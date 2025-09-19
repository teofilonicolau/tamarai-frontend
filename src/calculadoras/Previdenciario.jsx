// src/calculadoras/Previdenciario.jsx
import React, { useState } from 'react';
import WizardPrevidenciario from '../components/Calculadoras/WizardPrevidenciario';
import RegrasComparator from '../components/Calculadoras/RegrasComparator';
import ResultadosDetalhados from '../components/Calculadoras/ResultadosDetalhados';
import ResultadosPrevidenciarios from '../components/Calculadoras/ResultadosPrevidenciarios';
import api from '../services/api';
import { ENDPOINTS } from '../config/endpoints';

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
      endpoint: ENDPOINTS.calculadoras.previdenciario.regra_transicao_ec103,
      componente: 'wizard'
    },
    {
      id: 'tempo-especial',
      nome: 'Tempo Especial',
      descricao: 'Conversão de tempo especial em comum',
      icone: '⚡',
      endpoint: ENDPOINTS.calculadoras.previdenciario.tempo_especial,
      componente: 'form'
    },
    {
      id: 'periodo-graca',
      nome: 'Período de Graça',
      descricao: 'Cálculo do período de graça previdenciário',
      icone: '📅',
      endpoint: ENDPOINTS.calculadoras.previdenciario.periodo_graca,
      componente: 'form'
    },
    {
      id: 'revisao-vida-toda',
      nome: 'Revisão da Vida Toda',
      descricao: 'Análise de viabilidade da revisão',
      icone: '🔄',
      endpoint: ENDPOINTS.calculadoras.previdenciario.revisao_vida_toda,
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
    } catch {
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

  const renderFormulario = () => {
    switch (calculadoraAtiva) {
      case 'regra-transicao-ec103':
        return <WizardPrevidenciario onCalcular={calcular} loading={loading} />;
      
      case 'tempo-especial':
        return (
          <div className="text-center p-10">
            <div className="text-5xl mb-4 text-yellow-500">⚡</div>
            <h3 className="text-gray-900 dark:text-white mb-3 text-xl font-semibold">
              Tempo Especial
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Conversão de tempo especial em comum
            </p>
            <button
              onClick={() => calcular({
                teste: true,
                calculadora: calculadoraAtiva,
                timestamp: new Date().toISOString()
              })}
              disabled={loading}
              className="theme-button"
              style={{ background: loading ? '#6c757d' : '#667eea' }}
            >
              {loading ? '⏳ Calculando...' : '🧪 Teste com Dados Mock'}
            </button>
          </div>
        );
      
      case 'periodo-graca':
        return (
          <div className="text-center p-10">
            <div className="text-5xl mb-4 text-blue-500">📅</div>
            <h3 className="text-gray-900 dark:text-white mb-3 text-xl font-semibold">
              Período de Graça
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Cálculo do período de graça previdenciário
            </p>
            <button
              onClick={() => calcular({
                teste: true,
                calculadora: calculadoraAtiva,
                timestamp: new Date().toISOString()
              })}
              disabled={loading}
              className="theme-button"
              style={{ background: loading ? '#6c757d' : '#667eea' }}
            >
              {loading ? '⏳ Calculando...' : '🧪 Teste com Dados Mock'}
            </button>
          </div>
        );
      
      case 'revisao-vida-toda':
        return (
          <div className="text-center p-10">
            <div className="text-5xl mb-4 text-green-500">🔄</div>
            <h3 className="text-gray-900 dark:text-white mb-3 text-xl font-semibold">
              Revisão da Vida Toda
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Análise de viabilidade da revisão
            </p>
            <button
              onClick={() => calcular({
                teste: true,
                calculadora: calculadoraAtiva,
                timestamp: new Date().toISOString()
              })}
              disabled={loading}
              className="theme-button"
              style={{ background: loading ? '#6c757d' : '#667eea' }}
            >
              {loading ? '⏳ Calculando...' : '🧪 Teste com Dados Mock'}
            </button>
          </div>
        );
      
      default:
        return (
          <div className="text-center p-10">
            <div className="text-5xl mb-4">
              {calculadorasPrevidenciarias.find(c => c.id === calculadoraAtiva)?.icone}
            </div>
            <h3 className="text-gray-900 dark:text-white mb-3">
              {calculadorasPrevidenciarias.find(c => c.id === calculadoraAtiva)?.nome}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Formulário específico em desenvolvimento
            </p>
          </div>
        );
    }
  };

  const calculadoraAtual = calculadorasPrevidenciarias.find(c => c.id === calculadoraAtiva);

  return (
    <div className="max-w-6xl mx-auto p-5">
      
      {/* Header */}
      <div className="theme-card p-8 mb-8 text-center" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <h1 className="text-4xl font-bold mb-2">
          ⚖️ Calculadoras Previdenciárias
        </h1>
        <p className="text-lg opacity-90">
          Ferramentas especializadas em Direito Previdenciário
        </p>
      </div>

      {/* Seletor de Calculadoras */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {calculadorasPrevidenciarias.map(calc => (
          <div
            key={calc.id}
            onClick={() => {
              setCalculadoraAtiva(calc.id);
              resetarCalculadora();
            }}
            className={`theme-card p-6 cursor-pointer transition-all ${
              calculadoraAtiva === calc.id ? 'ring-2 ring-purple-500' : ''
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
        <div className="bg-purple-600 text-white p-5 text-center">
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

          {calculadoraAtiva === 'regra-transicao-ec103' ? (
            <>
              <RegrasComparator resultados={resultados} />
              <ResultadosDetalhados 
                resultados={resultados} 
                dadosEntrada={dadosEntrada}
              />
            </>
          ) : (
            <ResultadosPrevidenciarios 
              tipo={calculadoraAtiva}
              resultados={resultados}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Previdenciario;