// src/calculadoras/Trabalhista.jsx
import React, { useState } from 'react';
import FormHorasExtras from '../components/Calculadoras/FormHorasExtras';
import FormVerbasRescisorias from '../components/Calculadoras/FormVerbasRescisorias';
import FormAdicionalNoturno from '../components/Calculadoras/FormAdicionalNoturno';
import ResultadosTrabalhistas from '../components/Calculadoras/ResultadosTrabalhistas';
import api from '../services/api';
import { ENDPOINTS } from '../config/endpoints';

const Trabalhista = () => {
  const [calculadoraAtiva, setCalculadoraAtiva] = useState('horas-extras');
  const [resultados, setResultados] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const calculadorasTrabalhistas = [
    {
      id: 'horas-extras',
      nome: 'Horas Extras',
      descricao: 'Cálculo de horas extras e reflexos',
      icone: '⏰',
      endpoint: ENDPOINTS.calculadoras.trabalhista.horas_extras
    },
    {
      id: 'verbas-rescisorias',
      nome: 'Verbas Rescisórias',
      descricao: 'Cálculo completo da rescisão',
      icone: '💼',
      endpoint: ENDPOINTS.calculadoras.trabalhista.verbas_rescisorias
    },
    {
      id: 'adicional-noturno',
      nome: 'Adicional Noturno',
      descricao: 'Cálculo do adicional noturno',
      icone: '🌙',
      endpoint: ENDPOINTS.calculadoras.trabalhista.adicional_noturno
    }
  ];

  const calcular = async (dados) => {
    setLoading(true);
    setErro(null);
    
    try {
      const calculadoraConfig = calculadorasTrabalhistas.find(c => c.id === calculadoraAtiva);
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
      case 'horas-extras':
        return <FormHorasExtras onCalcular={calcular} loading={loading} />;
      case 'verbas-rescisorias':
        return <FormVerbasRescisorias onCalcular={calcular} loading={loading} />;
      case 'adicional-noturno':
        return <FormAdicionalNoturno onCalcular={calcular} loading={loading} />;
      default:
        return (
          <div className="text-center p-10">
            <div className="text-5xl mb-4">
              {calculadorasTrabalhistas.find(c => c.id === calculadoraAtiva)?.icone}
            </div>
            <h3 className="text-gray-900 dark:text-white mb-3">
              {calculadorasTrabalhistas.find(c => c.id === calculadoraAtiva)?.nome}
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
              style={{ background: loading ? '#6c757d' : '#28a745' }}
            >
              {loading ? '⏳ Calculando...' : '🧪 Teste com Dados Mock'}
            </button>
          </div>
        );
    }
  };

  const calculadoraAtual = calculadorasTrabalhistas.find(c => c.id === calculadoraAtiva);

  return (
    <div className="max-w-6xl mx-auto p-5">
      
      {/* Header */}
      <div className="theme-card p-8 mb-8 text-center" style={{
        background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
        color: 'white'
      }}>
        <h1 className="text-4xl font-bold mb-2">
          👷 Calculadoras Trabalhistas
        </h1>
        <p className="text-lg opacity-90">
          Ferramentas especializadas em Direito do Trabalho
        </p>
      </div>

      {/* Seletor de Calculadoras */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {calculadorasTrabalhistas.map(calc => (
          <div
            key={calc.id}
            onClick={() => {
              setCalculadoraAtiva(calc.id);
              resetarCalculadora();
            }}
            className={`theme-card p-6 cursor-pointer transition-all ${
              calculadoraAtiva === calc.id ? 'ring-2 ring-green-500' : ''
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
        <div className="bg-green-600 text-white p-5 text-center">
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

          <ResultadosTrabalhistas 
            tipo={calculadoraAtiva}
            resultados={resultados}
          />
        </div>
      )}
    </div>
  );
};

export default Trabalhista;