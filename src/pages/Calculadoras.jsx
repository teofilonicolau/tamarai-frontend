// src/pages/Calculadoras.jsx
// src/pages/Calculadoras.jsx
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import RegrasComparator from '../components/Calculadoras/RegrasComparator';
import WizardPrevidenciario from '../components/Calculadoras/WizardPrevidenciario';
import ResultadosDetalhados from '../components/Calculadoras/ResultadosDetalhados';
import ResultadosPrevidenciarios from '../components/Calculadoras/ResultadosPrevidenciarios';
import ResultadosTrabalhistas from '../components/Calculadoras/ResultadosTrabalhistas';
import ResultadosProcessuais from '../components/Calculadoras/ResultadosProcessuais';
import ResultadosFinanceiros from '../components/Calculadoras/ResultadosFinanceiros';

// 🧮 IMPORTAR FORMULÁRIOS EXISTENTES
import FormTempoEspecial from '../components/Calculadoras/FormTempoEspecial';
import FormPeriodoGraca from '../components/Calculadoras/FormPeriodoGraca';
import FormRevisaoVidaToda from '../components/Calculadoras/FormRevisaoVidaToda';
import FormHorasExtras from '../components/Calculadoras/FormHorasExtras';
import FormVerbasRescisorias from '../components/Calculadoras/FormVerbasRescisorias';
import FormAdicionalNoturno from '../components/Calculadoras/FormAdicionalNoturno';
import FormValorCausa from '../components/Calculadoras/FormValorCausa';
import FormLiquidacaoSentenca from '../components/Calculadoras/FormLiquidacaoSentenca';
import FormPensaoAlimenticia from '../components/Calculadoras/FormPensaoAlimenticia';
import FormJurosMora from '../components/Calculadoras/FormJurosMora';
import FormCorrecaoMonetaria from '../components/Calculadoras/FormCorrecaoMonetaria';

import api from '../services/api';

const Calculadoras = () => {
  const location = useLocation();
  
  // 🎯 DETERMINAR CATEGORIA INICIAL BASEADA NA URL
  const determinarCategoriaInicial = () => {
    const path = location.pathname;
    if (path.includes('/previdenciario')) return 'previdenciario';
    if (path.includes('/trabalhista')) return 'trabalhista';
    if (path.includes('/processual')) return 'processual';
    if (path.includes('/financeiro')) return 'financeiro';
    return 'previdenciario'; // padrão
  };

  const [categoriaAtiva, setCategoriaAtiva] = useState(determinarCategoriaInicial());
  const [calculadoraAtiva, setCalculadoraAtiva] = useState('regra-transicao-ec103');
  const [resultados, setResultados] = useState(null);
  const [dadosEntrada, setDadosEntrada] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  // 📋 CONFIGURAÇÃO DAS CALCULADORAS POR CATEGORIA
  const calculadorasPorCategoria = {
    previdenciario: {
      nome: '⚖️ Previdenciário',
      cor: '#667eea',
      calculadoras: [
        {
          id: 'regra-transicao-ec103',
          nome: 'Regras de Transição EC 103/2019',
          descricao: 'Análise completa das 4 regras de transição',
          icone: '📊',
          endpoint: '/api/v1/regra-transicao-ec103',  // ✅ CORRIGIDO
          componente: 'wizard',
          implementado: true
        },
        {
          id: 'tempo-especial',
          nome: 'Tempo Especial',
          descricao: 'Conversão de tempo especial em comum',
          icone: '⚡',
          endpoint: '/api/v1/tempo-especial',  // ✅ CORRIGIDO
          componente: 'form',
          implementado: true
        },
        {
          id: 'periodo-graca',
          nome: 'Período de Graça',
          descricao: 'Cálculo do período de graça previdenciário',
          icone: '📅',
          endpoint: '/api/v1/periodo-graca',  // ✅ CORRIGIDO
          componente: 'form',
          implementado: true
        },
        {
          id: 'revisao-vida-toda',
          nome: 'Revisão da Vida Toda',
          descricao: 'Análise de viabilidade da revisão',
          icone: '🔄',
          endpoint: '/api/v1/revisao-vida-toda',  // ✅ CORRIGIDO
          componente: 'form',
          implementado: true
        }
      ]
    },
    trabalhista: {
      nome: '👷 Trabalhista',
      cor: '#28a745',
      calculadoras: [
        {
          id: 'horas-extras',
          nome: 'Horas Extras',
          descricao: 'Cálculo de horas extras e reflexos',
          icone: '⏰',
          endpoint: '/api/v1/horas-extras',  // ✅ CORRIGIDO
          componente: 'form',
          implementado: true
        },
        {
          id: 'verbas-rescisorias',
          nome: 'Verbas Rescisórias',
          descricao: 'Cálculo completo da rescisão',
          icone: '💼',
          endpoint: '/api/v1/verbas-rescisorias',  // ✅ CORRIGIDO
          componente: 'form',
          implementado: true
        },
        {
          id: 'adicional-noturno',
          nome: 'Adicional Noturno',
          descricao: 'Cálculo do adicional noturno',
          icone: '🌙',
          endpoint: '/api/v1/adicional-noturno',  // ✅ CORRIGIDO
          componente: 'form',
          implementado: true
        }
      ]
    },
    processual: {
      nome: '⚖️ Processual',
      cor: '#17a2b8',
      calculadoras: [
        {
          id: 'valor-causa',
          nome: 'Valor da Causa',
          descricao: 'Cálculo do valor da causa processual',
          icone: '💰',
          endpoint: '/api/v1/valor-causa',  // ✅ CORRIGIDO
          componente: 'form',
          implementado: true
        },
        {
          id: 'liquidacao-sentenca',
          nome: 'Liquidação de Sentença',
          descricao: 'Liquidação com juros e correção',
          icone: '📋',
          endpoint: '/api/v1/liquidacao-sentenca',  // ✅ CORRIGIDO
          componente: 'form',
          implementado: true
        },
        {
          id: 'pensao-alimenticia',
          nome: 'Pensão Alimentícia',
          descricao: 'Cálculo de pensão alimentícia',
          icone: '👨‍👩‍👧‍👦',
          endpoint: '/api/v1/pensao-alimenticia',  // ✅ CORRIGIDO
          componente: 'form',
          implementado: true
        }
      ]
    },
    financeiro: {
      nome: '💰 Financeiro',
      cor: '#ffc107',
      calculadoras: [
        {
          id: 'juros-mora',
          nome: 'Juros de Mora',
          descricao: 'Cálculo de juros moratórios',
          icone: '📈',
          endpoint: '/api/v1/juros-mora',  // ✅ CORRIGIDO
          componente: 'form',
          implementado: true
        },
        {
          id: 'correcao-monetaria',
          nome: 'Correção Monetária',
          descricao: 'Atualização monetária por índices',
          icone: '📊',
          endpoint: '/api/v1/correcao-monetaria',  // ✅ CORRIGIDO
          componente: 'form',
          implementado: true
        }
      ]
    }
  };

  // 🧮 FUNÇÃO PARA CALCULAR
  const calcular = async (dados) => {
    setLoading(true);
    setErro(null);
    setDadosEntrada(dados);
    
    try {
      const calculadoraConfig = calculadorasPorCategoria[categoriaAtiva]
        .calculadoras.find(c => c.id === calculadoraAtiva);
      
      console.log('🧮 Enviando dados para:', calculadoraConfig.endpoint);
      console.log('📊 Dados:', dados);
      
      const response = await api.post(calculadoraConfig.endpoint, dados);
      setResultados(response.data.resultado || response.data);
      
    } catch (error) {
      console.error('❌ Erro no cálculo:', error);
      setErro(`Erro ao calcular: ${error.response?.data?.detail || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 FUNÇÃO PARA RESETAR
  const resetarCalculadora = () => {
    setResultados(null);
    setDadosEntrada(null);
    setErro(null);
  };

  // 🎯 FUNÇÃO PARA RENDERIZAR FORMULÁRIO
  const renderizarFormulario = () => {
    const calculadoraConfig = calculadorasPorCategoria[categoriaAtiva]
      .calculadoras.find(c => c.id === calculadoraAtiva);

    if (!calculadoraConfig) {
      return (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h3>❌ Calculadora não encontrada</h3>
        </div>
      );
    }

    // 🧙‍♂️ WIZARD ESPECIAL PARA EC 103
    if (calculadoraAtiva === 'regra-transicao-ec103') {
      return (
        <WizardPrevidenciario 
          onCalcular={calcular}
          loading={loading}
        />
      );
    }

    // 📋 FORMULÁRIOS ESPECÍFICOS
    const FormularioComponent = {
      'tempo-especial': FormTempoEspecial,
      'periodo-graca': FormPeriodoGraca,
      'revisao-vida-toda': FormRevisaoVidaToda,
      'horas-extras': FormHorasExtras,
      'verbas-rescisorias': FormVerbasRescisorias,
      'adicional-noturno': FormAdicionalNoturno,
      'valor-causa': FormValorCausa,
      'liquidacao-sentenca': FormLiquidacaoSentenca,
      'pensao-alimenticia': FormPensaoAlimenticia,
      'juros-mora': FormJurosMora,
      'correcao-monetaria': FormCorrecaoMonetaria
    }[calculadoraAtiva];

    if (FormularioComponent) {
      return (
        <FormularioComponent 
          onCalcular={calcular}
          loading={loading}
        />
      );
    }

    // 🚧 FORMULÁRIO EM DESENVOLVIMENTO
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '3em', marginBottom: '20px' }}>
          {calculadoraConfig.icone}
        </div>
        <h3 style={{ color: '#495057', marginBottom: '15px' }}>
          {calculadoraConfig.nome}
        </h3>
        <p style={{ color: '#6c757d', marginBottom: '25px' }}>
          {calculadoraConfig.descricao}
        </p>
        <p style={{ color: '#856404', marginBottom: '25px' }}>
          🚧 Formulário específico em desenvolvimento
        </p>
        <button
          onClick={() => calcular({
            teste: true,
            calculadora: calculadoraAtiva,
            timestamp: new Date().toISOString()
          })}
          disabled={loading}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: loading ? '#6c757d' : calculadorasPorCategoria[categoriaAtiva].cor,
            color: 'white',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '1em',
            fontWeight: 'bold'
          }}
        >
          {loading ? '⏳ Calculando...' : '🧪 Teste com Dados Mock'}
        </button>
      </div>
    );
  };

  // 🎯 FUNÇÃO PARA RENDERIZAR RESULTADOS
  const renderizarResultados = () => {
    if (!resultados) return null;

    // 📊 RESULTADO ESPECIAL PARA EC 103
    if (calculadoraAtiva === 'regra-transicao-ec103') {
      return (
        <>
          <RegrasComparator resultados={resultados} />
          <ResultadosDetalhados 
            resultados={resultados} 
            dadosEntrada={dadosEntrada}
          />
        </>
      );
    }

    // 📋 RESULTADOS POR CATEGORIA
    const ComponenteResultado = {
      previdenciario: ResultadosPrevidenciarios,
      trabalhista: ResultadosTrabalhistas,
      processual: ResultadosProcessuais,
      financeiro: ResultadosFinanceiros
    }[categoriaAtiva];

    if (ComponenteResultado) {
      return (
        <ComponenteResultado 
          tipo={calculadoraAtiva}
          resultados={resultados}
          dadosEntrada={dadosEntrada}
        />
      );
    }

    // 📊 RESULTADO GENÉRICO
    return (
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '12px',
        border: '1px solid #dee2e6'
      }}>
        <h3>📊 Resultado do Cálculo</h3>
        <pre style={{ 
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          overflow: 'auto',
          fontSize: '0.9em'
        }}>
          {JSON.stringify(resultados, null, 2)}
        </pre>
      </div>
    );
  };

  const calculadoraAtual = calculadorasPorCategoria[categoriaAtiva]
    ?.calculadoras.find(c => c.id === calculadoraAtiva);

  return (
    <div style={{ 
      maxWidth: '1400px', 
      margin: '0 auto', 
      padding: '20px',
      minHeight: '100vh'
    }}>
      
      {/* 🏗️ HEADER PRINCIPAL */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '40px',
        background: `linear-gradient(135deg, ${calculadorasPorCategoria[categoriaAtiva].cor} 0%, #764ba2 100%)`,
        color: 'white',
        padding: '40px',
        borderRadius: '12px'
      }}>
        <h1 style={{ margin: '0 0 15px 0', fontSize: '2.5em' }}>
          🧮 Calculadoras Jurídicas
        </h1>
        <p style={{ margin: '0', fontSize: '1.2em', opacity: '0.9' }}>
          {calculadorasPorCategoria[categoriaAtiva].nome} - {calculadoraAtual?.nome || 'Selecione uma calculadora'}
        </p>
      </div>

      {/* 🎯 NAVEGAÇÃO POR CATEGORIAS */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '30px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {Object.entries(calculadorasPorCategoria).map(([key, categoria]) => (
          <button
            key={key}
            onClick={() => {
              setCategoriaAtiva(key);
              setCalculadoraAtiva(categoria.calculadoras[0].id);
              resetarCalculadora();
            }}
            style={{
              padding: '12px 24px',
              border: `2px solid ${categoria.cor}`,
              background: categoriaAtiva === key ? categoria.cor : 'transparent',
              color: categoriaAtiva === key ? 'white' : categoria.cor,
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '1em',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
          >
            {categoria.nome}
          </button>
        ))}
      </div>

      {/* 🧮 NAVEGAÇÃO POR CALCULADORAS */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        {calculadorasPorCategoria[categoriaAtiva].calculadoras.map(calc => (
          <div
            key={calc.id}
            onClick={() => {
              setCalculadoraAtiva(calc.id);
              resetarCalculadora();
            }}
            style={{
              padding: '20px',
              border: `2px solid ${calculadoraAtiva === calc.id ? calculadorasPorCategoria[categoriaAtiva].cor : '#dee2e6'}`,
              borderRadius: '12px',
              cursor: 'pointer',
              background: calculadoraAtiva === calc.id ? '#f8f9fa' : 'white',
              transition: 'all 0.3s ease',
              boxShadow: calculadoraAtiva === calc.id ? '0 4px 12px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.05)',
              position: 'relative'
            }}
          >
            {/* 🏷️ BADGE DE STATUS */}
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: calc.implementado ? '#28a745' : '#ffc107',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '0.7em',
              fontWeight: 'bold'
            }}>
              {calc.implementado ? '✅ ATIVO' : '🚧 DEV'}
            </div>
            
            <div style={{ 
              fontSize: '2em', 
              marginBottom: '10px',
              textAlign: 'center'
            }}>
              {calc.icone}
            </div>
            <h3 style={{ 
              margin: '0 0 8px 0', 
              color: '#495057',
              textAlign: 'center',
              paddingRight: '60px'
            }}>
              {calc.nome}
            </h3>
            <p style={{ 
              margin: '0', 
              color: '#6c757d',
              fontSize: '0.9em',
              textAlign: 'center'
            }}>
              {calc.descricao}
            </p>
          </div>
        ))}
      </div>

      {/* 🧮 ÁREA DE CÁLCULO */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        border: '1px solid #dee2e6',
        overflow: 'hidden'
      }}>
        
        {/* 🏷️ HEADER DA CALCULADORA ATIVA */}
        <div style={{
          background: calculadorasPorCategoria[categoriaAtiva].cor,
          color: 'white',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h2 style={{ margin: '0', fontSize: '1.5em' }}>
            {calculadoraAtual?.icone} {calculadoraAtual?.nome}
          </h2>
          <p style={{ margin: '8px 0 0 0', opacity: '0.9' }}>
            {calculadoraAtual?.descricao}
          </p>
        </div>

        {/* 📋 CONTEÚDO DA CALCULADORA */}
        <div style={{ padding: '30px' }}>
          {renderizarFormulario()}
        </div>
      </div>

      {/* ❌ EXIBIÇÃO DE ERRO */}
      {erro && (
        <div style={{
          background: '#f8d7da',
          color: '#721c24',
          padding: '15px',
          borderRadius: '8px',
          marginTop: '20px',
          border: '1px solid #f5c6cb'
        }}>
          ❌ <strong>Erro:</strong> {erro}
        </div>
      )}

      {/* ⏳ LOADING */}
      {loading && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          background: '#e3f2fd',
          borderRadius: '12px',
          marginTop: '20px'
        }}>
          <div style={{ fontSize: '3em', marginBottom: '15px' }}>⏳</div>
          <h3 style={{ margin: '0', color: '#1565c0' }}>
            Processando cálculo...
          </h3>
        </div>
      )}

      {/* 📊 RESULTADOS */}
      {resultados && !loading && (
        <div style={{ marginTop: '30px' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <button
              onClick={resetarCalculadora}
              style={{
                padding: '10px 20px',
                border: '1px solid #6c757d',
                background: 'transparent',
                color: '#6c757d',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              🔄 Nova Consulta
            </button>
          </div>

          {renderizarResultados()}
        </div>
      )}

      {/* 📋 FOOTER INFORMATIVO */}
      <div style={{
        marginTop: '40px',
        padding: '20px',
        background: '#f8f9fa',
        borderRadius: '8px',
        textAlign: 'center',
        fontSize: '0.9em',
        color: '#6c757d'
      }}>
        <p style={{ margin: '0' }}>
          ⚖️ <strong>Importante:</strong> Estas calculadoras são ferramentas de orientação. 
          Para decisões definitivas, consulte sempre um advogado especializado.
        </p>
      </div>
    </div>
  );
};

export default Calculadoras;
