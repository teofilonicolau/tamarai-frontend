// src/calculadoras/Financeiro.jsx
import React, { useState } from 'react';
import api from '../services/api';

const Financeiro = () => {
  const [calculadoraAtiva, setCalculadoraAtiva] = useState('juros-mora');
  const [resultados, setResultados] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const calculadorasFinanceiras = [
    {
      id: 'juros-mora',
      nome: 'Juros de Mora',
      descricao: 'Cálculo de juros moratórios',
      icone: '📈',
      endpoint: '/juros-mora'
    },
    {
      id: 'correcao-monetaria',
      nome: 'Correção Monetária',
      descricao: 'Atualização monetária por índices',
      icone: '📊',
      endpoint: '/correcao-monetaria'
    }
  ];

  const calcular = async (dados) => {
    setLoading(true);
    setErro(null);
    
    try {
      const calculadoraConfig = calculadorasFinanceiras.find(c => c.id === calculadoraAtiva);
      const response = await api.post(calculadoraConfig.endpoint, dados);
      setResultados(response.data.resultado || response.data);
    } catch (error) {
      console.error('Erro no cálculo:', error);
      setErro('Erro ao calcular. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const calculadoraAtual = calculadorasFinanceiras.find(c => c.id === calculadoraAtiva);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #ffc107 0%, #e0a800 100%)',
        color: 'white',
        padding: '30px',
        borderRadius: '12px',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '2.2em' }}>
          💰 Calculadoras Financeiras
        </h1>
        <p style={{ margin: '0', opacity: '0.9' }}>
          Ferramentas para cálculos financeiros e atualizações
        </p>
      </div>

      {/* Seletor de Calculadoras */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '15px',
        marginBottom: '30px'
      }}>
        {calculadorasFinanceiras.map(calc => (
          <div
            key={calc.id}
            onClick={() => {
              setCalculadoraAtiva(calc.id);
              setResultados(null);
              setErro(null);
            }}
            style={{
              padding: '20px',
              border: `2px solid ${calculadoraAtiva === calc.id ? '#ffc107' : '#dee2e6'}`,
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
          background: '#ffc107',
          color: 'white',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h2 style={{ margin: '0' }}>
            {calculadoraAtual?.icone} {calculadoraAtual?.nome}
          </h2>
        </div>

        <div style={{ padding: '30px', textAlign: 'center' }}>
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
              background: loading ? '#6c757d' : '#ffc107',
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
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '12px',
          border: '1px solid #dee2e6',
          marginTop: '20px'
        }}>
          <h3>�� Resultado do Cálculo</h3>
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
  );
};

export default Financeiro;