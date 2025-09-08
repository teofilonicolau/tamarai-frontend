// src/calculadoras/Trabalhista.jsx
import React, { useState } from 'react';
import FormHorasExtras from '../components/Calculadoras/FormHorasExtras';
import FormVerbasRescisorias from '../components/Calculadoras/FormVerbasRescisorias';
import FormAdicionalNoturno from '../components/Calculadoras/FormAdicionalNoturno';
import ResultadosTrabalhistas from '../components/Calculadoras/ResultadosTrabalhistas'; // NOVO IMPORT
import api from '../services/api';

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
      endpoint: '/horas-extras'
    },
    {
      id: 'verbas-rescisorias',
      nome: 'Verbas Rescisórias',
      descricao: 'Cálculo completo da rescisão',
      icone: '💼',
      endpoint: '/verbas-rescisorias'
    },
    {
      id: 'adicional-noturno',
      nome: 'Adicional Noturno',
      descricao: 'Cálculo do adicional noturno',
      icone: '🌙',
      endpoint: '/adicional-noturno'
    }
  ];

  const calcular = async (dados) => {
    setLoading(true);
    setErro(null);
    
    try {
      const calculadoraConfig = calculadorasTrabalhistas.find(c => c.id === calculadoraAtiva);
      const response = await api.post(calculadoraConfig.endpoint, dados);
      setResultados(response.data.calculo || response.data);
    } catch (error) {
      console.error('Erro no cálculo:', error);
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
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '3em', marginBottom: '20px' }}>
              {calculadorasTrabalhistas.find(c => c.id === calculadoraAtiva)?.icone}
            </div>
            <h3 style={{ color: '#495057', marginBottom: '15px' }}>
              {calculadorasTrabalhistas.find(c => c.id === calculadoraAtiva)?.nome}
            </h3>
            <p style={{ color: '#6c757d', marginBottom: '25px' }}>
              Formulário específico em desenvolvimento
            </p>
          </div>
        );
    }
  };

  const calculadoraAtual = calculadorasTrabalhistas.find(c => c.id === calculadoraAtiva);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
        color: 'white',
        padding: '30px',
        borderRadius: '12px',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '2.2em' }}>
          👷 Calculadoras Trabalhistas
        </h1>
        <p style={{ margin: '0', opacity: '0.9' }}>
          Ferramentas especializadas em Direito do Trabalho
        </p>
      </div>

      {/* Seletor de Calculadoras */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '15px',
        marginBottom: '30px'
      }}>
        {calculadorasTrabalhistas.map(calc => (
          <div
            key={calc.id}
            onClick={() => {
              setCalculadoraAtiva(calc.id);
              resetarCalculadora();
            }}
            style={{
              padding: '20px',
              border: `2px solid ${calculadoraAtiva === calc.id ? '#28a745' : '#dee2e6'}`,
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
          background: '#28a745',
          color: 'white',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h2 style={{ margin: '0' }}>
            {calculadoraAtual?.icone} {calculadoraAtual?.nome}
          </h2>
        </div>

        <div style={{ padding: '30px' }}>
          {renderFormulario()}
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