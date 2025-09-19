// src/calculadoras/Processual.jsx
import React, { useState } from 'react';
import FormPensaoAlimenticia from '../components/Calculadoras/FormPensaoAlimenticia';
import FormLiquidacaoSentenca from '../components/Calculadoras/FormLiquidacaoSentenca';
import FormValorCausa from '../components/Calculadoras/FormValorCausa';
import ResultadosProcessuais from '../components/Calculadoras/ResultadosProcessuais';
import api from '../services/api';
import { ENDPOINTS } from '../config/endpoints';

const Processual = () => {
  const [calculadoraAtiva, setCalculadoraAtiva] = useState('valor-causa');
  const [resultados, setResultados] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const calculadorasProcessuais = [
    {
      id: 'valor-causa',
      nome: 'Valor da Causa',
      descricao: 'Cálculo do valor da causa processual',
      icone: '💰',
      endpoint: ENDPOINTS.calculadoras.processual.valor_causa
    },
    {
      id: 'liquidacao-sentenca',
      nome: 'Liquidação de Sentença',
      descricao: 'Liquidação com juros e correção',
      icone: '📋',
      endpoint: ENDPOINTS.calculadoras.processual.liquidacao_sentenca
    },
    {
      id: 'pensao-alimenticia',
      nome: 'Pensão Alimentícia',
      descricao: 'Cálculo de pensão alimentícia',
      icone: '👨‍👩‍👧‍👦',
      endpoint: ENDPOINTS.calculadoras.familia.pensao_alimenticia
    }
  ];

  const calcular = async (dados) => {
    setLoading(true);
    setErro(null);
    
    try {
      const calculadoraConfig = calculadorasProcessuais.find(c => c.id === calculadoraAtiva);
      const response = await api.post(calculadoraConfig.endpoint, dados);
      setResultados(response.data.calculo || response.data);
    } catch {
      setErro('Erro ao calcular. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const resetarCalculadora = () => {
    setResultados(null);
    setErro(null);
  };

  const renderFormulario = () => {
    switch (calculadoraAtiva) {
      case 'valor-causa':
        return <FormValorCausa onCalcular={calcular} loading={loading} />;
      case 'liquidacao-sentenca':
        return <FormLiquidacaoSentenca onCalcular={calcular} loading={loading} />;
      case 'pensao-alimenticia':
        return <FormPensaoAlimenticia onCalcular={calcular} loading={loading} />;
      default:
        return (
          <div className="text-center p-10">
            <div className="text-5xl mb-4">
              {calculadorasProcessuais.find(c => c.id === calculadoraAtiva)?.icone}
            </div>
            <h3 className="text-gray-900 dark:text-white mb-3">
              {calculadorasProcessuais.find(c => c.id === calculadoraAtiva)?.nome}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Formulário específico em desenvolvimento
            </p>
            <button
              onClick={() => calcular({
                teste: true,
                calculadora: calculadoraAtiva,
                timestamp: new Date().toISOString()
              })}
              disabled={loading}
              className="theme-button"
              style={{ background: loading ? '#6c757d' : '#17a2b8' }}
            >
              {loading ? '⏳ Calculando...' : '🧪 Teste com Dados Mock'}
            </button>
          </div>
        );
    }
  };

  const calculadoraAtual = calculadorasProcessuais.find(c => c.id === calculadoraAtiva);

  return (
    <div className="max-w-6xl mx-auto p-5">
      
      {/* Header */}
      <div className="theme-card p-8 mb-8 text-center" style={{
        background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)',
        color: 'white'
      }}>
        <h1 className="text-4xl font-bold mb-2">
          ⚖️ Calculadoras Processuais
        </h1>
        <p className="text-lg opacity-90">
          Ferramentas para cálculos processuais e liquidações
        </p>
      </div>

      {/* Seletor de Calculadoras */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {calculadorasProcessuais.map(calc => (
          <div
            key={calc.id}
            onClick={() => {
              setCalculadoraAtiva(calc.id);
              resetarCalculadora();
            }}
            className={`theme-card p-6 cursor-pointer transition-all ${
              calculadoraAtiva === calc.id ? 'ring-2 ring-cyan-500' : ''
            }`}
          >
            <div className="text-center">
              <div className="text-4xl mb-3">{calc.icone}</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {calc.nome}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {calc.descricao}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Área de Cálculo */}
      <div className="theme-card overflow-hidden">
        <div className="bg-cyan-600 text-white p-5 text-center">
          <h2 className="text-xl font-semibold">
            {calculadoraAtual?.icone} {calculadoraAtual?.nome}
          </h2>
        </div>

        <div className="p-8">
          {renderFormulario()}
        </div>
      </div>

      {/* Erro */}
      {erro && (
        <div className="error-state mt-5">
          ❌ <strong>Erro:</strong> {erro}
        </div>
      )}

      {/* Resultados */}
      {resultados && !loading && (
        <div className="mt-8">
          <div className="text-center mb-5">
            <button
              onClick={resetarCalculadora}
              className="theme-button"
              style={{ background: '#6c757d' }}
            >
              �� Nova Consulta
            </button>
          </div>

          <ResultadosProcessuais 
            tipo={calculadoraAtiva}
            resultados={resultados}
          />
        </div>
      )}
    </div>
  );
};

export default Processual;