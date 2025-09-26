// src/config/endpoints.js

// src/config/endpoints.js
// Define os endpoints da API com métodos HTTP e descrições para clareza

export const ENDPOINTS = {
  // 🤖 FERRAMENTAS DE IA
  ai: {
    consulta: '/api/v1/consulta', // POST: Realiza consultas jurídicas
    analise: '/api/v1/analise', // POST: Análise de texto jurídico
    parecer: '/api/v1/parecer', // POST: Geração de parecer jurídico
    // 👇 ALIAS para compatibilidade com novos componentes
    parecer_juridico: '/api/v1/parecer' // POST: Alias para parecer jurídico
  },

  // 🏛️ PETIÇÕES PREVIDENCIÁRIAS
  previdenciario: {
    auxilio_doenca: '/api/v1/previdenciario/peticao-auxilio-doenca', // POST: Petição para auxílio-doença
    aposentadoria_invalidez: '/api/v1/previdenciario/peticao-aposentadoria-invalidez', // POST: Petição para aposentadoria por invalidez
    aposentadoria_especial: '/api/v1/previdenciario/peticao-aposentadoria-especial', // POST: Petição para aposentadoria especial
    aposentadoria_tempo_contribuicao: '/api/v1/previdenciario/peticao-aposentadoria-tempo-contribuicao', // POST: Petição para aposentadoria por tempo de contribuição
    aposentadoria_rural: '/api/v1/previdenciario/peticao-aposentadoria-rural', // POST: Petição para aposentadoria rural
    pensao_morte: '/api/v1/previdenciario/peticao-pensao-morte', // POST: Petição para pensão por morte
    bpc_loas: '/api/v1/previdenciario/peticao-bpc-loas', // POST: Petição para BPC/LOAS
    salario_maternidade: '/api/v1/previdenciario/peticao-salario-maternidade', // POST: Petição para salário-maternidade
    revisao_vida_toda: '/api/v1/previdenciario/peticao-revisao-vida-toda', // POST: Petição para revisão da vida toda
    revisao_beneficio: '/api/v1/previdenciario/peticao-revisao-beneficio', // POST: Petição para revisão de benefício
    peticao_com_calculo: '/api/v1/previdenciario/peticao-com-calculo', // POST: Petição com cálculos previdenciários
    peticao_pdf: '/api/v1/previdenciario/peticao-pdf' // POST: Geração de petição em PDF
  },

  // ⚖️ PETIÇÕES TRABALHISTAS
  trabalhista: {
    peticao_vinculo: '/api/v1/trabalhista/peticao-vinculo', // POST: Petição para reconhecimento de vínculo empregatício
    quesitos_insalubridade: '/api/v1/trabalhista/quesitos-insalubridade' // POST: Quesitos para insalubridade
  },

  // 🛒 PETIÇÕES CONSUMIDOR
  consumidor: {
    peticao_vicio_produto: '/api/v1/consumidor/peticao-vicio-produto', // POST: Petição por vício em produto
    peticao_cobranca_indevida: '/api/v1/consumidor/peticao-cobranca-indevida' // POST: Petição por cobrança indevida
  },

  // 📋 PETIÇÕES CIVIL
  civil: {
    peticao_cobranca: '/api/v1/civil/peticao-cobranca', // POST: Petição de cobrança
    peticao_indenizacao: '/api/v1/civil/peticao-indenizacao' // POST: Petição de indenização
  },

  // ⚖️ PETIÇÕES PROCESSUAL CIVIL
  processual: {
    peticao_execucao: '/api/v1/processual-civil/peticao-execucao', // POST: Petição de execução
    peticao_monitoria: '/api/v1/processual-civil/peticao-monitoria' // POST: Petição monitória
  },

  // 🧮 CALCULADORAS PREVIDENCIÁRIAS
  calculadoras: {
    previdenciario: {
      tempo_especial: '/api/v1/tempo-especial', // POST: Cálculo de tempo especial
      periodo_graca: '/api/v1/periodo-graca', // POST: Cálculo de período de graça
      regra_transicao_ec103: '/api/v1/regra-transicao-ec103', // POST: Cálculo de regra de transição EC103
      revisao_vida_toda: '/api/v1/revisao-vida-toda' // POST: Cálculo para revisão da vida toda
    },

    // 💼 CALCULADORAS TRABALHISTAS
    trabalhista: {
      horas_extras: '/api/v1/horas-extras', // POST: Cálculo de horas extras
      verbas_rescisorias: '/api/v1/verbas-rescisorias', // POST: Cálculo de verbas rescisórias
      adicional_noturno: '/api/v1/adicional-noturno' // POST: Cálculo de adicional noturno
    },

    // ⚖️ CALCULADORAS PROCESSUAIS
    processual: {
      valor_causa: '/api/v1/valor-causa', // POST: Cálculo do valor da causa
      liquidacao_sentenca: '/api/v1/liquidacao-sentenca', // POST: Liquidação de sentença
      juros_mora: '/api/v1/juros-mora', // POST: Cálculo de juros de mora
      correcao_monetaria: '/api/v1/correcao-monetaria' // POST: Cálculo de correção monetária
    },

    // 👨‍👩‍👧‍👦 CALCULADORAS FAMÍLIA
    familia: {
      pensao_alimenticia: '/api/v1/pensao-alimenticia' // POST: Cálculo de pensão alimentícia
    }
  },

  // 📊 ANALYTICS
  analytics: {
    dashboard: '/api/v1/analytics/dashboard', // GET: Dashboard de métricas
    metricas_detalhadas: '/api/v1/analytics/metricas-detalhadas', // GET: Métricas detalhadas
    status: '/api/v1/analytics/status' // GET: Status do analytics
  },

  // ℹ️ INFORMAÇÕES DO SISTEMA
  sistema: {
    status: '/api/v1/status', // GET: Status do sistema
    info: '/api/v1/info', // GET: Informações do sistema
    areas_direito: '/api/v1/areas-direito' // GET: Lista de áreas do direito
  }
};

// 🎯 HELPER FUNCTIONS (MANTENHA - SÃO ÚTEIS!)
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
