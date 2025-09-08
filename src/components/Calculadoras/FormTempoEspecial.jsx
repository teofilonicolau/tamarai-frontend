// src/components/Calculadoras/FormTempoEspecial.jsx
import React, { useState } from 'react';

const FormTempoEspecial = ({ onCalcular, loading }) => {
  const [dados, setDados] = useState({
    tempo_rural: '',
    tempo_urbano: '',
    tempo_especial: '',
    data_inicio_especial: ''
  });

  const [erros, setErros] = useState({});

  const validarFormulario = () => {
    const novosErros = {};

    if (!dados.tempo_rural || dados.tempo_rural < 0) {
      novosErros.tempo_rural = 'Informe o tempo rural (0 se não houver)';
    }
    if (!dados.tempo_urbano || dados.tempo_urbano < 0) {
      novosErros.tempo_urbano = 'Informe o tempo urbano (0 se não houver)';
    }
    if (!dados.tempo_especial || dados.tempo_especial < 0) {
      novosErros.tempo_especial = 'Informe o tempo especial';
    }
    if (dados.tempo_especial > 300) {
      novosErros.tempo_especial = 'Tempo especial não pode exceder 25 anos (300 meses)';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validarFormulario()) {
      const dadosParaCalcular = {
        tempo_rural: parseInt(dados.tempo_rural),
        tempo_urbano: parseInt(dados.tempo_urbano),
        tempo_especial: parseInt(dados.tempo_especial),
        data_inicio_especial: dados.data_inicio_especial || null
      };
      onCalcular(dadosParaCalcular);
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
        ⚡ Conversão de Tempo Especial
      </h3>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
              Tempo Rural (meses):
            </label>
            <input
              type="number"
              value={dados.tempo_rural}
              onChange={(e) => setDados({...dados, tempo_rural: e.target.value})}
              placeholder="Ex: 60"
              style={{
                width: '100%',
                padding: '12px',
                border: `2px solid ${erros.tempo_rural ? '#dc3545' : '#dee2e6'}`,
                borderRadius: '8px',
                fontSize: '1em'
              }}
            />
            {erros.tempo_rural && (
              <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '5px' }}>
                {erros.tempo_rural}
              </div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
              Tempo Urbano (meses):
            </label>
            <input
              type="number"
              value={dados.tempo_urbano}
              onChange={(e) => setDados({...dados, tempo_urbano: e.target.value})}
              placeholder="Ex: 144"
              style={{
                width: '100%',
                padding: '12px',
                border: `2px solid ${erros.tempo_urbano ? '#dc3545' : '#dee2e6'}`,
                borderRadius: '8px',
                fontSize: '1em'
              }}
            />
            {erros.tempo_urbano && (
              <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '5px' }}>
                {erros.tempo_urbano}
              </div>
            )}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
            Tempo Especial (meses):
          </label>
          <input
            type="number"
            value={dados.tempo_especial}
            onChange={(e) => setDados({...dados, tempo_especial: e.target.value})}
            placeholder="Ex: 96"
            style={{
              width: '100%',
              padding: '12px',
              border: `2px solid ${erros.tempo_especial ? '#dc3545' : '#dee2e6'}`,
              borderRadius: '8px',
              fontSize: '1em'
            }}
          />
          {erros.tempo_especial && (
            <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '5px' }}>
              {erros.tempo_especial}
            </div>
          )}
          <div style={{ fontSize: '0.9em', color: '#6c757d', marginTop: '5px', fontStyle: 'italic' }}>
            💡 Máximo: 25 anos (300 meses)
          </div>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
            Data de Início da Atividade Especial (opcional):
          </label>
          <input
            type="date"
            value={dados.data_inicio_especial}
            onChange={(e) => setDados({...dados, data_inicio_especial: e.target.value})}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #dee2e6',
              borderRadius: '8px',
              fontSize: '1em'
            }}
          />
          <div style={{ fontSize: '0.9em', color: '#6c757d', marginTop: '5px', fontStyle: 'italic' }}>
            📅 Para cálculo do período de exposição
          </div>
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
          {loading ? '⏳ Calculando...' : '🧮 Calcular Conversão'}
        </button>
      </form>
    </div>
  );
};

export default FormTempoEspecial;