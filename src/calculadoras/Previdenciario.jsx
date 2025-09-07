// src/calculadoras/Previdenciario.jsx
import React, { useState } from 'react';
import WizardPrevidenciario from '../components/Calculadoras/WizardPrevidenciario';
import RegrasComparator from '../components/Calculadoras/RegrasComparator';
import ResultadosDetalhados from '../components/Calculadoras/ResultadosDetalhados';
import api from '../services/api';

const Previdenciario = () => {
  const [calculadoraAtiva, setCalculadoraAtiva] = useState('regra-transicao-ec103');
  const [resultados, setResultados] = useState(null);
  const [dadosEntrada, setDadosEntrada] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const calculadorasPrevidenciarias = [
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
  ];

  const calcular = async (dados) => {
    setLoading(true);
    setErro(null);
    setDadosEntrada(dados);
    
    try {
      const calculadoraConfig = calculadorasPrevidenciarias.find(c => c.id === calculadoraAtiva);
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

  const calculadoraAtual = calculadorasPrevidenciarias.find(c => c.id === calculadoraAtiva);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '30px',
        borderRadius: '12px',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '2.2em' }}>
          ⚖️ Calculadoras Previdenciárias
        </h1>
        <p style={{ margin: '0', opacity: '0.9' }}>
          Ferramentas especializadas em Direito Previdenciário
        </p>
      </div>

      {/* Seletor de Calculadoras */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '15px',
        marginBottom: '30px'
      }}>
        {calculadorasPrevidenciarias.map(calc => (
          <div
            key={calc.id}
            onClick={() => {
              setCalculadoraAtiva(calc.id);
              resetarCalculadora();
            }}
            style={{
              padding: '20px',
              border: `2px solid ${calculadoraAtiva === calc.id ? '#667eea' : '#dee2e6'}`,
              borderRadius: '10px',
              cursor: 'pointer',
              background: calculadoraAtiva === calc.id ? '#f8f9fa' : 'white',
              transition: 'all 0.3s ease',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '2em', marginBottom: '10px' }}>
              {calc.icone}
            </div>
            <h3 style={{ margin: '0 0 8px 0', color: '#495057' }}>
              {calc.nome}
            </h3>
            <p style={{ margin: '0', color: '#6c757d', fontSize: '0.9em' }}>
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
        <div style={{
          background: '#667eea',
          color: 'white',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h2 style={{ margin: '0' }}>
            {calculadoraAtual?.icone} {calculadoraAtual?.nome}
          </h2>
        </div>

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
                  background: loading ? '#6c757d' : '#667eea',
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
              �� Nova Consulta
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
    </div>
  );
};

export default Previdenciario;