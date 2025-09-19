// src/calculadoras/Financeiro.jsx
import React, { useState } from 'react';
import FormJurosMora from '../components/Calculadoras/FormJurosMora';
import FormCorrecaoMonetaria from '../components/Calculadoras/FormCorrecaoMonetaria';
import ResultadosFinanceiros from '../components/Calculadoras/ResultadosFinanceiros';
import api from '../services/api';
import { ENDPOINTS } from '../config/endpoints';

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
      endpoint: ENDPOINTS.calculadoras.processual.juros_mora
    },
    {
      id: 'correcao-monetaria',
      nome: 'Correção Monetária',
      descricao: 'Atualização monetária por índices',
      icone: '📊',
      endpoint: ENDPOINTS.calculadoras.processual.correcao_monetaria
    }
  ];

  const calcular = async (dados) => {
    setLoading(true);
    setErro(null);
    
    try {
      const calculadoraConfig = calculadorasFinanceiras.find(c => c.id === calculadoraAtiva);
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
      case 'juros-mora':
        return <FormJurosMora onCalcular={calcular} loading={loading} />;
      case 'correcao-monetaria':
        return <FormCorrecaoMonetaria onCalcular={calcular} loading={loading} />;
      default:
        return (
          <div className="text-center p-10">
            <div className="text-5xl mb-4">
              {calculadorasFinanceiras.find(c => c.id === calculadoraAtiva)?.icone}
            </div>
            <h3 className="text-gray-900 dark:text-white mb-3">
              {calculadorasFinanceiras.find(c => c.id === calculadoraAtiva)?.nome}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Formulário específico em desenvolvimento
            </p>
          </div>
        );
    }
  };

  const calculadoraAtual = calculadorasFinanceiras.find(c => c.id === calculadoraAtiva);

  return (
    <div className="max-w-6xl mx-auto p-5">
      
      {/* Header */}
      <div className="theme-card p-8 mb-8 text-center" style={{
        background: 'linear-gradient(135deg, #ffc107 0%, #e0a800 100%)',
        color: 'white'
      }}>
        <h1 className="text-4xl font-bold mb-2">
          💰 Calculadoras Financeiras
        </h1>
        <p className="text-lg opacity-90">
          Ferramentas para cálculos financeiros e atualizações
        </p>
      </div>

      {/* Seletor de Calculadoras */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {calculadorasFinanceiras.map(calc => (
          <div
            key={calc.id}
            onClick={() => {
              setCalculadoraAtiva(calc.id);
              resetarCalculadora();
            }}
            className={`theme-card p-6 cursor-pointer transition-all ${
              calculadoraAtiva === calc.id ? 'ring-2 ring-yellow-500' : ''
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
        <div className="bg-yellow-500 text-white p-5 text-center">
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
              🔄 Nova Consulta
            </button>
          </div>

          <ResultadosFinanceiros 
            tipo={calculadoraAtiva}
            resultados={resultados}
          />
        </div>
      )}
    </div>
  );
};

export default Financeiro;