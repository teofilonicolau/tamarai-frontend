/* scripts/check-mapping.js
   Valida o mapeamento do FRONT (ENDPOINTS + chamadas axios/api.*)
   contra o BACK (OpenAPI/Swagger em /openapi.json).

   Uso:
   API_BASE_URL=https://tamarai-backend-production.up.railway.app node scripts/check-mapping.js
   (opcional) OPENAPI_URL=... para customizar o schema (por padrão: ${API_BASE_URL}/openapi.json)

   Saídas:
   - reports/mapping-report.json (detalhado)
   - resumo no console
*/

const fs = require('fs');
const path = require('path');

const API_BASE_URL = process.env.API_BASE_URL || 'https://tamarai-backend-production.up.railway.app';
const OPENAPI_URL = process.env.OPENAPI_URL || `${API_BASE_URL.replace(/\/$/, '')}/openapi.json`;

// ---- Utils simples ----
function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let results = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      results = results.concat(walk(full));
    } else if (/\.(js|jsx|ts|tsx)$/i.test(e.name)) {
      results.push(full);
    }
  }
  return results;
}

function readFileSafe(p) {
  try { return fs.readFileSync(p, 'utf8'); } catch { return ''; }
}

// Extrai o literal do objeto ENDPOINTS do arquivo endpoints.js
function extractEndpointsObjectLiteral(fileContent) {
  const rx = /export\s+const\s+ENDPOINTS\s*=\s*({[\s\S]*?});/m;
  const m = rx.exec(fileContent);
  return m ? m[1] : null;
}

// Executa o objeto literal em uma sandbox para obter o objeto JS
function evalObjectLiteralToJS(objLiteral) {
  const vm = require('vm');
  const context = {};
  const script = new vm.Script(`(function(){ const ENDPOINTS = ${objLiteral}; return ENDPOINTS; })()`);
  return script.runInNewContext(context);
}

function flattenEndpoints(obj, prefix = '') {
  const out = [];
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    const nextPrefix = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') {
      out.push({ keyPath: nextPrefix, path: value });
    } else if (value && typeof value === 'object') {
      out.push(...flattenEndpoints(value, nextPrefix));
    }
  }
  return out;
}

// Busca chamadas axios/api.* para inferir método por endpoint
function scanHttpCalls(srcDir, endpointKeyPaths, endpointPaths) {
  const files = walk(srcDir);
  const results = [];
  const methodRx = /\b(axios|api)\s*\.\s*(get|post|put|patch|delete)\s*\(\s*([^)]+)\)/gi;

  for (const file of files) {
    const content = readFileSafe(file);
    if (!content) continue;

    let m;
    while ((m = methodRx.exec(content))) {
      const method = m[2].toUpperCase();
      const arg = m[3];

      // Tentamos identificar se a chamada usa uma constante do ENDPOINTS (ex.: ENDPOINTS.ai.consulta)
      // ou se tem string literal diretamente com o path.
      const referencedKeys = endpointKeyPaths.filter(k => new RegExp(`\b${k.replace(/\./g, '\.')}\b`).test(arg));
      const literalPathMatch = /(['"`])\/[a-zA-Z0-9_\/:\-{}]+?\1/.exec(arg);
      const literalPath = literalPathMatch ? literalPathMatch[0].slice(1, -1) : null;

      if (referencedKeys.length) {
        for (const keyPath of referencedKeys) {
          const p = endpointPaths[keyPath];
          results.push({ file, method, keyPath, path: p, source: 'ENDPOINTS' });
        }
      } else if (literalPath) {
        // Caso raro: chamada direta com string literal
        // Verificamos se essa string literal corresponde a algum path do ENDPOINTS
        const matchKey = Object.keys(endpointPaths).find(k => endpointPaths[k] === literalPath);
        results.push({ file, method, keyPath: matchKey || null, path: literalPath, source: 'LITERAL' });
      }
    }
  }
  return results;
}

async function fetchOpenAPI(url) {
  let fetchFn = global.fetch;
  if (typeof fetchFn !== 'function') {
    try { fetchFn = (await import('node-fetch')).default; } catch (e) {
      throw new Error('Fetch não disponível e "node-fetch" não instalado. Rode: npm i node-fetch -D');
    }
  }
  const res = await fetchFn(url);
  if (!res.ok) {
    throw new Error(`Falha ao obter OpenAPI em ${url}: HTTP ${res.status}`);
  }
  return res.json();
}

function buildOpenApiIndex(openapi) {
  const index = {}; // path -> Set(methods)
  const paths = openapi.paths || {};
  for (const p of Object.keys(paths)) {
    const methods = Object.keys(paths[p]).map(m => m.toUpperCase());
    index[p] = new Set(methods);
  }
  return index;
}

// Normaliza caminhos para comparação literal segura
function normalizePath(p) {
  // Remove trailing slash (do backend) e mantém case-sensitive
  return p.replace(/\/+$/, '');
}

function compare(frontPath, frontMethod, openApiIndex) {
  const fp = normalizePath(frontPath);
  const methods = openApiIndex[fp];
  if (!methods) {
    return { status: 'NOT_FOUND', available: [] };
  }
  if (!frontMethod) {
    return { status: 'UNKNOWN_METHOD', available: Array.from(methods) };
  }
  if (methods.has(frontMethod)) {
    return { status: 'OK', available: Array.from(methods) };
  }
  return { status: 'METHOD_MISMATCH', available: Array.from(methods) };
}

(async function main() {
  try {
    const endpointsFile = path.resolve('src/config/endpoints.js');
    const srcDir = path.resolve('src');

    const endpointsContent = readFileSafe(endpointsFile);
    if (!endpointsContent) {
      console.error(`Arquivo não encontrado: ${endpointsFile}`);
      process.exit(1);
    }

    const objLiteral = extractEndpointsObjectLiteral(endpointsContent);
    if (!objLiteral) {
      console.error('Não foi possível extrair o objeto literal ENDPOINTS de src/config/endpoints.js');
      process.exit(1);
    }

    const ENDPOINTS = evalObjectLiteralToJS(objLiteral);
    const flat = flattenEndpoints(ENDPOINTS);
    const endpointKeyPaths = flat.map(e => `ENDPOINTS.${e.keyPath}`);
    const endpointPathByKey = Object.fromEntries(flat.map(e => [e.keyPath, e.path]));

    // Descobre métodos usados no front
    const calls = scanHttpCalls(srcDir, endpointKeyPaths, endpointPathByKey);
    // Mapa (path) -> Set(methods encontrados)
    const frontMethodMap = {};
    for (const c of calls) {
      const p = normalizePath(c.path);
      frontMethodMap[p] = frontMethodMap[p] || new Set();
      frontMethodMap[p].add(c.method);
    }

    // Carrega OpenAPI
    const openapi = await fetchOpenAPI(OPENAPI_URL);
    const apiIndex = buildOpenApiIndex(openapi);

    // Valida cada endpoint do FRONT contra o BACK
    const report = [];
    for (const { keyPath, path: frontPath } of flat) {
      const methodsFound = frontMethodMap[normalizePath(frontPath)];
      const usedMethods = methodsFound ? Array.from(methodsFound) : [];

      if (usedMethods.length === 0) {
        // Sem método identificado no front para esse path
        const cmp = compare(frontPath, null, apiIndex);
        report.push({
          keyPath,
          path: frontPath,
          method: null,
          status: cmp.status,
          backendAvailableMethods: cmp.available
        });
      } else {
        for (const m of usedMethods) {
          const cmp = compare(frontPath, m, apiIndex);
          report.push({
            keyPath,
            path: frontPath,
            method: m,
            status: cmp.status,
            backendAvailableMethods: cmp.available
          });
        }
      }
    }

    // Saída
    const outDir = path.resolve('reports');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
    const outFile = path.join(outDir, 'mapping-report.json');
    fs.writeFileSync(outFile, JSON.stringify({
      generatedAt: new Date().toISOString(),
      apiBaseUrl: API_BASE_URL,
      openapiUrl: OPENAPI_URL,
      summary: {
        totalFrontendEndpoints: flat.length,
        totalCallsDetected: calls.length
      },
      details: report
    }, null, 2));

    // Resumo no console
    const counters = report.reduce((acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    }, {});
    console.log('=== Mapping Report (resumo) ===');
    console.log(`OpenAPI: ${OPENAPI_URL}`);
    console.log(`Endpoints no FRONT: ${flat.length}`);
    console.log(`Chamadas detectadas no código: ${calls.length}`);
    console.log('Status:', counters);
    console.log(`Arquivo completo: ${outFile}`);
    if (counters.METHOD_MISMATCH || counters.NOT_FOUND) {
      console.log('\nAtenção: Há divergências. Envie o arquivo reports/mapping-report.json para correção precisa.');
    } else {
      console.log('\nTudo certo: sem divergências críticas encontradas nos endpoints escaneados.');
    }
  } catch (err) {
    console.error('Erro na validação:', err.message);
    process.exit(1);
  }
})();