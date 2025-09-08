// src/components/Calculadoras/FormPeriodoGraca.jsx
import React, { useState } from 'react';

const FormPeriodoGraca = ({ onCalcular, loading }) => {
  const [dados, setDados] = useState({
    tipo_segurado: '',
    ultima_contribuicao: ''
  });

  const [erros, setErros] = useState({});

  const tiposSegurado = [
    { value: 'empregado', label: '👔 Empregado CLT' },
    { value: 'autonomo', label: '💼 Autônomo' },
    { value: 'contribuinte_individual', label: '🏢 Contribuinte Individual' },
    { value: 'rural_pura', label: '🌾 Segurado Especial Rural' },
    { value: 'domestico', label: '�� Empregado Doméstico' }
  ];

  const validarFormulario = () => {
    const novosErros = {};

    if (!dados.tipo_segurado) {
      novosErros.tipo_segurado = 'Selecione o tipo de segurado';
    }
    if (!dados.ultima_contribuicao) {
      novosErros.ultima_contribuicao = 'Informe a data da última contribuição';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validarFormulario()) {
      onCalcular(dados);
    }
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #dee2e6',
      padding: '30px'
    }}>
      <h3 style={{ color: '#495057', marginBottom: '25px', textAlign: 'center' }}>
        📅 Verificação do Período de Graça
      </h3>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: 'bold', color: '#495057' }}>
            Tipo de Segurado:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {tiposSegurado.map(tipo => (
              <label key={tipo.value} style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '12px 15px',
                border: `2px solid ${dados.tipo_segurado === tipo.value ? '#667eea' : '#dee2e6'}`,
                borderRadius: '8px',
                background: dados.tipo_segurado === tipo.value ? '#e3f2fd' : '#ffffff',
                transition: 'all 0.3s ease'
              }}>
                <input
                  type="radio"
                  name="tipo_segurado"
                  value={tipo.value}
                  checked={dados.tipo_segurado === tipo.value}
                  onChange={(e) => setDados({...dados, tipo_segurado: e.target.value})}
                  style={{ marginRight: '10px' }}
                />
                <span style={{ fontSize: '0.9em' }}>{tipo.label}</span>
              </label>
            ))}
          </div>
          {erros.tipo_segurado && (
            <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '8px' }}>
              {erros.tipo_segurado}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
            Data da Última Contribuição:
          </label>
          <input
            type="date"
            value={dados.ultima_contribuicao}
            onChange={(e) => setDados({...dados, ultima_contribuicao: e.target.value})}
            style={{
              width: '100%',
              padding: '12px',
              border: `2px solid ${erros.ultima_contribuicao ? '#dc3545' : '#dee2e6'}`,
              borderRadius: '8px',
              fontSize: '1em'
            }}
          />
          {erros.ultima_contribuicao && (
            <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '5px' }}>
              {erros.ultima_contribuicao}
            </div>
          )}
          <div style={{ fontSize: '0.9em', color: '#6c757d', marginTop: '5px', fontStyle: 'italic' }}>
            📅 Data da última contribuição previdenciária
          </div>
        </div>

        <div style={{
          background: '#e3f2fd',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '25px'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#1565c0' }}>
            📋 Sobre o Período de Graça:
          </h4>
          <ul style={{ margin: '0', paddingLeft: '20px', color: '#1565c0', fontSize: '0.9em' }}>
            <li>Segurado comum: 12 meses após última contribuição</li>
            <li>Segurado especial rural: não perde qualidade</li>
            <li>Período pode ser prorrogado em casos específicos</li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '15px',
            border: 'none',
            background: loading ? '#6c757d' : '#667eea',
            color: 'white',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '1.1em',
            fontWeight: 'bold'
          }}
        >
          {loading ? '⏳ Verificando...' : '🔍 Verificar Período de Graça'}
        </button>
      </form>
    </div>
  );
};

export default FormPeriodoGraca;