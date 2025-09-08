// src/components/Calculadoras/FormAdicionalNoturno.jsx
import React, { useState } from 'react';

const FormAdicionalNoturno = ({ onCalcular, loading }) => {
  const [dados, setDados] = useState({
    salario_base: '',
    horas_noturnas: '',
    dias_trabalhados: ''
  });

  const [erros, setErros] = useState({});

  const validarFormulario = () => {
    const novosErros = {};

    if (!dados.salario_base || dados.salario_base <= 0) {
      novosErros.salario_base = 'Informe o salário base';
    }
    if (!dados.horas_noturnas || dados.horas_noturnas <= 0 || dados.horas_noturnas > 8) {
      novosErros.horas_noturnas = 'Informe as horas noturnas (1-8 por dia)';
    }
    if (!dados.dias_trabalhados || dados.dias_trabalhados <= 0 || dados.dias_trabalhados > 31) {
      novosErros.dias_trabalhados = 'Informe os dias trabalhados (1-31)';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const calcularPrevia = () => {
    if (dados.salario_base && dados.horas_noturnas && dados.dias_trabalhados) {
      const valorHoraNormal = dados.salario_base / 220; // 220h mensais
      const valorHoraNoturna = valorHoraNormal * 1.20; // 20% adicional
      const totalHorasNoturnas = dados.horas_noturnas * dados.dias_trabalhados;
      const valorAdicional = (valorHoraNoturna - valorHoraNormal) * totalHorasNoturnas;
      
      return {
        valorHoraNormal: valorHoraNormal.toFixed(2),
        valorHoraNoturna: valorHoraNoturna.toFixed(2),
        totalHorasNoturnas,
        valorAdicional: valorAdicional.toFixed(2)
      };
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validarFormulario()) {
      const dadosParaCalcular = {
        salario_base: parseFloat(dados.salario_base),
        horas_noturnas: parseInt(dados.horas_noturnas),
        dias_trabalhados: parseInt(dados.dias_trabalhados)
      };
      onCalcular(dadosParaCalcular);
    }
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
        🌙 Cálculo de Adicional Noturno
      </h3>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
            💰 Salário Base Mensal (R$):
          </label>
          <input
            type="number"
            step="0.01"
            value={dados.salario_base}
            onChange={(e) => setDados({...dados, salario_base: e.target.value})}
            placeholder="Ex: 2200.00"
            style={{
              width: '100%',
              padding: '12px',
              border: `2px solid ${erros.salario_base ? '#dc3545' : '#dee2e6'}`,
              borderRadius: '8px',
              fontSize: '1em'
            }}
          />
          {erros.salario_base && (
            <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '5px' }}>
              {erros.salario_base}
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
              🌙 Horas Noturnas por Dia:
            </label>
            <input
              type="number"
              value={dados.horas_noturnas}
              onChange={(e) => setDados({...dados, horas_noturnas: e.target.value})}
              placeholder="Ex: 5"
              min="1"
              max="8"
              style={{
                width: '100%',
                padding: '12px',
                border: `2px solid ${erros.horas_noturnas ? '#dc3545' : '#dee2e6'}`,
                borderRadius: '8px',
                fontSize: '1em'
              }}
            />
            {erros.horas_noturnas && (
              <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '5px' }}>
                {erros.horas_noturnas}
              </div>
            )}
            <div style={{ fontSize: '0.9em', color: '#6c757d', marginTop: '5px', fontStyle: 'italic' }}>
              🕘 Horário noturno: 22h às 5h
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
              📅 Dias Trabalhados:
            </label>
            <input
              type="number"
              value={dados.dias_trabalhados}
              onChange={(e) => setDados({...dados, dias_trabalhados: e.target.value})}
              placeholder="Ex: 22"
              min="1"
              max="31"
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
        </div>

        {/* Prévia do Cálculo */}
        {previa && (
          <div style={{
            background: '#e8f5e8',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '25px',
            border: '1px solid #28a745'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#155724' }}>
              📊 Prévia do Cálculo:
            </h4>
            <div style={{ color: '#155724', fontSize: '0.95em' }}>
              <p style={{ margin: '5px 0' }}>
                <strong>Valor hora normal:</strong> R$ {previa.valorHoraNormal}
              </p>
              <p style={{ margin: '5px 0' }}>
                <strong>Valor hora noturna:</strong> R$ {previa.valorHoraNoturna}
              </p>
              <p style={{ margin: '5px 0' }}>
                <strong>Total horas noturnas:</strong> {previa.totalHorasNoturnas} horas
              </p>
              <p style={{ margin: '5px 0', fontWeight: 'bold', fontSize: '1.1em' }}>
                <strong>Valor adicional:</strong> R$ {previa.valorAdicional}
              </p>
            </div>
          </div>
        )}

        {/* Informações Legais */}
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
            <li><strong>Horário noturno:</strong> 22h às 5h (CLT, art. 73)</li>
            <li><strong>Adicional mínimo:</strong> 20% sobre hora normal</li>
            <li><strong>Hora noturna reduzida:</strong> 52 minutos e 30 segundos</li>
            <li><strong>Convenção coletiva:</strong> pode estabelecer percentuais maiores</li>
            <li><strong>Reflexos:</strong> incide sobre férias, 13º salário, FGTS</li>
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
          {loading ? '⏳ Calculando...' : '🧮 Calcular Adicional Noturno'}
        </button>
      </form>
    </div>
  );
};

export default FormAdicionalNoturno;