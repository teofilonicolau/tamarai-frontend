// src/config/endpoints.js
export const ENDPOINTS = {
  // 🤖 FERRAMENTAS DE IA
  ai: {
    consulta: '/api/v1/consulta',
    analise: '/api/v1/analise',
    parecer: '/api/v1/parecer-juridico'
  },

  // 🏛️ PETIÇÕES PREVIDENCIÁRIAS
  previdenciario: {
    auxilio_doenca: '/api/v1/previdenciario/peticao-auxilio-doenca',
    aposentadoria_invalidez: '/api/v1/previdenciario/peticao-aposentadoria-invalidez',
    aposentadoria_especial: '/api/v1/previdenciario/peticao-aposentadoria-especial',
    aposentadoria_tempo_contribuicao: '/api/v1/previdenciario/peticao-aposentadoria-tempo-contribuicao',
    aposentadoria_rural: '/api/v1/previdenciario/peticao-aposentadoria-rural',
    pensao_morte: '/api/v1/previdenciario/peticao-pensao-morte',
    bpc_loas: '/api/v1/previdenciario/peticao-bpc-loas',
    salario_maternidade: '/api/v1/previdenciario/peticao-salario-maternidade',
    revisao_vida_toda: '/api/v1/previdenciario/peticao-revisao-vida-toda',
    revisao_beneficio: '/api/v1/previdenciario/peticao-revisao-beneficio',
    peticao_com_calculo: '/api/v1/previdenciario/peticao-com-calculo',
    peticao_pdf: '/api/v1/previdenciario/peticao-pdf'
  },

  // ⚖️ PETIÇÕES TRABALHISTAS
  trabalhista: {
    peticao_vinculo: '/api/v1/trabalhista/peticao-vinculo',
    quesitos_insalubridade: '/api/v1/trabalhista/quesitos-insalubridade'
  },

  // 🛒 PETIÇÕES CONSUMIDOR
  consumidor: {
    peticao_vicio_produto: '/api/v1/consumidor/peticao-vicio-produto',
    peticao_cobranca_indevida: '/api/v1/consumidor/peticao-cobranca-indevida'
  },

  // 📋 PETIÇÕES CIVIL
  civil: {
    peticao_cobranca: '/api/v1/civil/peticao-cobranca',
    peticao_indenizacao: '/api/v1/civil/peticao-indenizacao'
  },

  // ⚖️ PETIÇÕES PROCESSUAL CIVIL
  processual: {
    peticao_execucao: '/api/v1/processual-civil/peticao-execucao',
    peticao_monitoria: '/api/v1/processual-civil/peticao-monitoria'
  },

  // 🧮 CALCULADORAS PREVIDENCIÁRIAS
  calculadoras: {
    previdenciario: {
      tempo_especial: '/api/v1/tempo-especial',
      periodo_graca: '/api/v1/periodo-graca',
      regra_transicao_ec103: '/api/v1/regra-transicao-ec103',
      revisao_vida_toda: '/api/v1/revisao-vida-toda'
    },
    
    // 💼 CALCULADORAS TRABALHISTAS
    trabalhista: {
      horas_extras: '/api/v1/horas-extras',
      verbas_rescisorias: '/api/v1/verbas-rescisorias',
      adicional_noturno: '/api/v1/adicional-noturno'
    },

    // ⚖️ CALCULADORAS PROCESSUAIS
    processual: {
      valor_causa: '/api/v1/valor-causa',
      liquidacao_sentenca: '/api/v1/liquidacao-sentenca',
      juros_mora: '/api/v1/juros-mora',
      correcao_monetaria: '/api/v1/correcao-monetaria'
    },

    // 👨‍👩‍👧‍👦 CALCULADORAS FAMÍLIA
    familia: {
      pensao_alimenticia: '/api/v1/pensao-alimenticia'
    }
  },

  // 📊 ANALYTICS
  analytics: {
    dashboard: '/api/v1/analytics/dashboard',
    metricas_detalhadas: '/api/v1/analytics/metricas-detalhadas',
    status: '/api/v1/analytics/status'
  },

  // ℹ️ INFORMAÇÕES DO SISTEMA
  sistema: {
    status: '/api/v1/status',
    info: '/api/v1/info',
    areas_direito: '/api/v1/areas-direito'
  }
};

// 🎯 HELPER FUNCTIONS PARA FACILITAR O USO
export const getEndpoint = (categoria, subcategoria, acao = null) => {
  try {
    if (acao) {
      return ENDPOINTS[categoria][subcategoria][acao];
    }
    return ENDPOINTS[categoria][subcategoria];
  } catch {
    console.error(`Endpoint não encontrado: ${categoria}.${subcategoria}.${acao}`);
    return null;
  }
};

// 🔍 BUSCAR ENDPOINT POR NOME
export const findEndpoint = (searchTerm) => {
  const results = [];
  
  const searchInObject = (obj, path = '') => {
    Object.keys(obj).forEach(key => {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (typeof obj[key] === 'string') {
        if (key.includes(searchTerm) || obj[key].includes(searchTerm)) {
          results.push({
            path: currentPath,
            endpoint: obj[key]
          });
        }
      } else if (typeof obj[key] === 'object') {
        searchInObject(obj[key], currentPath);
      }
    });
  };
  
  searchInObject(ENDPOINTS);
  return results;
};

// 📋 LISTAR TODOS OS ENDPOINTS
export const getAllEndpoints = () => {
  const allEndpoints = [];
  
  const extractEndpoints = (obj, category = '') => {
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'string') {
        allEndpoints.push({
          category,
          name: key,
          endpoint: obj[key]
        });
      } else if (typeof obj[key] === 'object') {
        extractEndpoints(obj[key], category ? `${category}.${key}` : key);
      }
    });
  };
  
  extractEndpoints(ENDPOINTS);
  return allEndpoints;
};

export default ENDPOINTS;