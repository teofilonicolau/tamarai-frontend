// src/pages/Calculadoras.jsx
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import RegrasComparator from '../components/Calculadoras/RegrasComparator';
import WizardPrevidenciario from '../components/Calculadoras/WizardPrevidenciario';
import ResultadosDetalhados from '../components/Calculadoras/ResultadosDetalhados';
import api from '../services/api';

const Calculadoras = () => {
  const location = useLocation();
  const [categoriaAtiva, setCategoriaAtiva] = useState('previdenciario');
  const [calculadoraAtiva, setCalculadoraAtiva] = useState('regra-transicao-ec103');
  const [resultados, setResultados] = useState(null);
  const [dadosEntrada, setDadosEntrada] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  // Configuração das calculadoras por categoria
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
          endpoint: '/regra-transicao-ec103',
          componente: 'wizard'
        },
        {
          id: 'tempo-especial',
          nome: 'Tempo Especial',
          descricao: 'Conversão de tempo especial em comum',
          icone: '⚡',
          endpoint: '/tempo-especial',
          componente: 'form'
        },
        {
          id: 'periodo-graca',
          nome: 'Período de Graça',
          descricao: 'Cálculo do período de graça previdenciário',
          icone: '📅',
          endpoint: '/periodo-graca',
          componente: 'form'
        },
        {
          id: 'revisao-vida-toda',
          nome: 'Revisão da Vida Toda',
          descricao: 'Análise de viabilidade da revisão',
          icone: '🔄',
          endpoint: '/revisao-vida-toda',
          componente: 'form'
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
          endpoint: '/horas-extras',
          componente: 'form'
        },
        {
          id: 'verbas-rescisorias',
          nome: 'Verbas Rescisórias',
          descricao: 'Cálculo completo da rescisão',
          icone: '💼',
          endpoint: '/verbas-rescisorias',
          componente: 'form'
        },
        {
          id: 'adicional-noturno',
          nome: 'Adicional Noturno',
          descricao: 'Cálculo do adicional noturno',
          icone: '🌙',
          endpoint: '/adicional-noturno',
          componente: 'form'
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
          endpoint: '/valor-causa',
          componente: 'form'
        },
        {
          id: 'liquidacao-sentenca',
          nome: 'Liquidação de Sentença',
          descricao: 'Liquidação com juros e correção',
          icone: '📋',
          endpoint: '/liquidacao-sentenca',
          componente: 'form'
        },
        {
          id: 'pensao-alimenticia',
          nome: 'Pensão Alimentícia',
          descricao: 'Cálculo de pensão alimentícia',
          icone: '👨‍👩‍👧‍👦',
          endpoint: '/pensao-alimenticia',
          componente: 'form'
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
          endpoint: '/juros-mora',
          componente: 'form'
        },
        {
          id: 'correcao-monetaria',
          nome: 'Correção Monetária',
          descricao: 'Atualização monetária por índices',
          icone: '📊',
          endpoint: '/correcao-monetaria',
          componente: 'form'
        }
      ]
    }
  };

  const calcular = async (dados) => {
    setLoading(true);
    setErro(null);
    setDadosEntrada(dados);
    
    try {
      const calculadoraConfig = calculadorasPorCategoria[categoriaAtiva]
        .calculadoras.find(c => c.id === calculadoraAtiva);
      
      const response = await api.post(calculadoraConfig.endpoint, dados);
      setResultados(response.data.resultado || response.data);
    } catch (error) {
      console.error('Erro no cálculo:', error);
      setErro('Erro ao calcular. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const resetarCalculadora = () => {
    setResultados(null);
    setDadosEntrada(null);
    setErro(null);
  };

  const calculadoraAtual = calculadorasPorCategoria[categoriaAtiva]
    .calculadoras.find(c => c.id === calculadoraAtiva);

  return (
    <div style={{ 
      maxWidth: '1400px', 
      margin: '0 auto', 
      padding: '20px',
      minHeight: '100vh'
    }}>
      {/* Header Principal */}
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
          {calculadorasPorCategoria[categoriaAtiva].nome} - {calculadoraAtual?.nome}
        </p>
      </div>

      {/* Navegação por Categorias */}
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

      {/* Navegação por Calculadoras da Categoria */}
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
              boxShadow: calculadoraAtiva === calc.id ? '0 4px 12px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.05)'
            }}
          >
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
              textAlign: 'center'
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

      {/* Área de Cálculo */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        border: '1px solid #dee2e6',
        overflow: 'hidden'
      }}>
        {/* Header da calculadora ativa */}
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

        {/* Conteúdo da calculadora */}
        <div style={{ padding: '30px' }}>
          {calculadoraAtiva === 'regra-transicao-ec103' ? (
            <WizardPrevidenciario 
              onCalcular={calcular}
              loading={loading}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '3em', marginBottom: '20px' }}>
                {calculadoraAtual?.icone}
              </div>
              <h3 style={{ color: '#495057', marginBottom: '15px' }}>
                {calculadoraAtual?.nome}
              </h3>
              <p style={{ color: '#6c757d', marginBottom: '25px' }}>
                Formulário específico em desenvolvimento
              </p>
              <button
                onClick={() => calcular({
                  teste: true,
                  calculadora: calculadoraAtiva
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
          )}
        </div>
      </div>

      {/* Erro */}
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

      {/* Loading */}
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

      {/* Resultados */}
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

          {calculadoraAtiva === 'regra-transicao-ec103' ? (
            <>
              <RegrasComparator resultados={resultados} />
              <ResultadosDetalhados 
                resultados={resultados} 
                dadosEntrada={dadosEntrada}
              />
            </>
          ) : (
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
          )}
        </div>
      )}

      {/* Footer informativo */}
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