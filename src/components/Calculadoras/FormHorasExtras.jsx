// src/components/Calculadoras/FormHorasExtras.jsx
import React, { useState } from 'react';

const FormHorasExtras = ({ onCalcular, loading }) => {
  const [dados, setDados] = useState({
    jornada_contratual: '',
    jornada_real: '',
    dias_trabalhados: '',
    valor_hora: ''
  });

  const [erros, setErros] = useState({});

  const validarFormulario = () => {
    const novosErros = {};

    if (!dados.jornada_contratual || dados.jornada_contratual <= 0) {
      novosErros.jornada_contratual = 'Informe a jornada contratual';
    }
    if (!dados.jornada_real || dados.jornada_real <= 0) {
      novosErros.jornada_real = 'Informe a jornada real trabalhada';
    }
    if (dados.jornada_real <= dados.jornada_contratual) {
      novosErros.jornada_real = 'Jornada real deve ser maior que a contratual';
    }
    if (!dados.dias_trabalhados || dados.dias_trabalhados <= 0 || dados.dias_trabalhados > 31) {
      novosErros.dias_trabalhados = 'Informe os dias trabalhados (1-31)';
    }
    if (!dados.valor_hora || dados.valor_hora <= 0) {
      novosErros.valor_hora = 'Informe o valor da hora normal';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validarFormulario()) {
      const dadosParaCalcular = {
        jornada_contratual: parseInt(dados.jornada_contratual),
        jornada_real: parseInt(dados.jornada_real),
        dias_trabalhados: parseInt(dados.dias_trabalhados),
        valor_hora: parseFloat(dados.valor_hora)
      };
      onCalcular(dadosParaCalcular);
    }
  };

  const calcularPrevia = () => {
    if (dados.jornada_contratual && dados.jornada_real && dados.dias_trabalhados && dados.valor_hora) {
      const horasExtras = (dados.jornada_real - dados.jornada_contratual) * dados.dias_trabalhados;
      const valorTotal = horasExtras * dados.valor_hora * 1.5;
      return { horasExtras, valorTotal };
    }
    return null;
  };

  const previa = calcularPrevia();

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #dee2e6',
      padding: '30px'
    }}>
      <h3 style={{ color: '#495057', marginBottom: '25px', textAlign: 'center' }}>
        ⏰ Cálculo de Horas Extras
      </h3>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
              Jornada Contratual (horas/dia):
            </label>
            <input
              type="number"
              value={dados.jornada_contratual}
              onChange={(e) => setDados({...dados, jornada_contratual: e.target.value})}
              placeholder="Ex: 8"
              style={{
                width: '100%',
                padding: '12px',
                border: `2px solid ${erros.jornada_contratual ? '#dc3545' : '#dee2e6'}`,
                borderRadius: '8px',
                fontSize: '1em'
              }}
            />
            {erros.jornada_contratual && (
              <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '5px' }}>
                {erros.jornada_contratual}
              </div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
              Jornada Real (horas/dia):
            </label>
            <input
              type="number"
              value={dados.jornada_real}
              onChange={(e) => setDados({...dados, jornada_real: e.target.value})}
              placeholder="Ex: 10"
              style={{
                width: '100%',
                padding: '12px',
                border: `2px solid ${erros.jornada_real ? '#dc3545' : '#dee2e6'}`,
                borderRadius: '8px',
                fontSize: '1em'
              }}
            />
            {erros.jornada_real && (
              <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '5px' }}>
                {erros.jornada_real}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
              Dias Trabalhados:
            </label>
            <input
              type="number"
              value={dados.dias_trabalhados}
              onChange={(e) => setDados({...dados, dias_trabalhados: e.target.value})}
              placeholder="Ex: 22"
              style={{
                width: '100%',
                padding: '12px',
                border: `2px solid ${erros.dias_trabalhados ? '#dc3545' : '#dee2e6'}`,
                borderRadius: '8px',
                fontSize: '1em'
              }}
            />
            {erros.dias_trabalhados && (
              <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '5px' }}>
                {erros.dias_trabalhados}
              </div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
              Valor da Hora Normal (R$):
            </label>
            <input
              type="number"
              step="0.01"
              value={dados.valor_hora}
              onChange={(e) => setDados({...dados, valor_hora: e.target.value})}
              placeholder="Ex: 12.50"
              style={{
                width: '100%',
                padding: '12px',
                border: `2px solid ${erros.valor_hora ? '#dc3545' : '#dee2e6'}`,
                borderRadius: '8px',
                fontSize: '1em'
              }}
            />
            {erros.valor_hora && (
              <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '5px' }}>
                {erros.valor_hora}
              </div>
            )}
          </div>
        </div>

        {previa && (
          <div style={{
            background: '#e8f5e8',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '25px',
            border: '1px solid #28a745'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#155724' }}>
              �� Prévia do Cálculo:
            </h4>
            <div style={{ color: '#155724', fontSize: '0.95em' }}>
              <p style={{ margin: '5px 0' }}>
                <strong>Horas extras totais:</strong> {previa.horasExtras} horas
              </p>
              <p style={{ margin: '5px 0' }}>
                <strong>Valor estimado:</strong> R$ {previa.valorTotal.toFixed(2)}
              </p>
              <p style={{ margin: '5px 0', fontSize: '0.9em', fontStyle: 'italic' }}>
                �� Adicional de 50% já aplicado
              </p>
            </div>
          </div>
        )}

        <div style={{
          background: '#e3f2fd',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '25px'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#1565c0' }}>
            📋 Informações Legais:
          </h4>
          <ul style={{ margin: '0', paddingLeft: '20px', color: '#1565c0', fontSize: '0.9em' }}>
            <li>Adicional mínimo de 50% sobre hora normal (CLT, art. 7º, XVI)</li>
            <li>Limite de 2 horas extras por dia (CLT, art. 59)</li>
            <li>Convenção coletiva pode estabelecer percentuais maiores</li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '15px',
            border: 'none',
            background: loading ? '#6c757d' : '#28a745',
            color: 'white',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '1.1em',
            fontWeight: 'bold'
          }}
        >
          {loading ? '⏳ Calculando...' : '🧮 Calcular Horas Extras'}
        </button>
      </form>
    </div>
  );
};

export default FormHorasExtras;