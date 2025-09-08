// src/components/Calculadoras/FormJurosMora.jsx
import React, { useState } from 'react';

const FormJurosMora = ({ onCalcular, loading }) => {
  const [dados, setDados] = useState({
    valor_principal: '',
    data_vencimento: '',
    taxa_mensal: '0.01'
  });

  const [erros, setErros] = useState({});

  const validarFormulario = () => {
    const novosErros = {};

    if (!dados.valor_principal || dados.valor_principal <= 0) {
      novosErros.valor_principal = 'Informe o valor principal';
    }
    if (!dados.data_vencimento) {
      novosErros.data_vencimento = 'Informe a data de vencimento';
    }
    if (!dados.taxa_mensal || dados.taxa_mensal <= 0 || dados.taxa_mensal > 1) {
      novosErros.taxa_mensal = 'Taxa deve estar entre 0,01% e 100%';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validarFormulario()) {
      const dadosParaCalcular = {
        valor_principal: parseFloat(dados.valor_principal),
        data_vencimento: dados.data_vencimento,
        taxa_mensal: parseFloat(dados.taxa_mensal)
      };
      onCalcular(dadosParaCalcular);
    }
  };

  const calcularPrevia = () => {
    if (dados.valor_principal && dados.data_vencimento && dados.taxa_mensal) {
      const hoje = new Date();
      const vencimento = new Date(dados.data_vencimento);
      const diasAtraso = Math.max(0, Math.floor((hoje - vencimento) / (1000 * 60 * 60 * 24)));
      const mesesAtraso = diasAtraso / 30;
      const juros = dados.valor_principal * dados.taxa_mensal * mesesAtraso;
      return { diasAtraso, juros: juros.toFixed(2) };
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
        📈 Cálculo de Juros de Mora
      </h3>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
            Valor Principal (R$):
          </label>
          <input
            type="number"
            step="0.01"
            value={dados.valor_principal}
            onChange={(e) => setDados({...dados, valor_principal: e.target.value})}
            placeholder="Ex: 5000.00"
            style={{
              width: '100%',
              padding: '12px',
              border: `2px solid ${erros.valor_principal ? '#dc3545' : '#dee2e6'}`,
              borderRadius: '8px',
              fontSize: '1em'
            }}
          />
          {erros.valor_principal && (
            <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '5px' }}>
              {erros.valor_principal}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
            Data de Vencimento:
          </label>
          <input
            type="date"
            value={dados.data_vencimento}
            onChange={(e) => setDados({...dados, data_vencimento: e.target.value})}
            style={{
              width: '100%',
              padding: '12px',
              border: `2px solid ${erros.data_vencimento ? '#dc3545' : '#dee2e6'}`,
              borderRadius: '8px',
              fontSize: '1em'
            }}
          />
          {erros.data_vencimento && (
            <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '5px' }}>
              {erros.data_vencimento}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
            Taxa Mensal (decimal):
          </label>
          <select
            value={dados.taxa_mensal}
            onChange={(e) => setDados({...dados, taxa_mensal: e.target.value})}
            style={{
              width: '100%',
              padding: '12px',
              border: `2px solid ${erros.taxa_mensal ? '#dc3545' : '#dee2e6'}`,
              borderRadius: '8px',
              fontSize: '1em'
            }}
          >
            <option value="0.01">1% ao mês (padrão)</option>
            <option value="0.005">0,5% ao mês</option>
            <option value="0.02">2% ao mês</option>
            <option value="custom">Personalizada</option>
          </select>
          {dados.taxa_mensal === 'custom' && (
            <input
              type="number"
              step="0.001"
              placeholder="Ex: 0.015 (1,5%)"
              onChange={(e) => setDados({...dados, taxa_mensal: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #dee2e6',
                borderRadius: '8px',
                fontSize: '1em',
                marginTop: '10px'
              }}
            />
          )}
          {erros.taxa_mensal && (
            <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '5px' }}>
              {erros.taxa_mensal}
            </div>
          )}
          <div style={{ fontSize: '0.9em', color: '#6c757d', marginTop: '5px', fontStyle: 'italic' }}>
            💡 Taxa padrão: 1% ao mês (art. 406 CC + CTN)
          </div>
        </div>

        {previa && previa.diasAtraso > 0 && (
          <div style={{
            background: '#fff3cd',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '25px',
            border: '1px solid #ffc107'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>
              �� Prévia do Cálculo:
            </h4>
            <div style={{ color: '#856404', fontSize: '0.95em' }}>
              <p style={{ margin: '5px 0' }}>
                <strong>Dias em atraso:</strong> {previa.diasAtraso} dias
              </p>
              <p style={{ margin: '5px 0' }}>
                <strong>Juros estimados:</strong> R$ {previa.juros}
              </p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '15px',
            border: 'none',
            background: loading ? '#6c757d' : '#ffc107',
            color: 'white',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '1.1em',
            fontWeight: 'bold'
          }}
        >
          {loading ? '⏳ Calculando...' : '🧮 Calcular Juros de Mora'}
        </button>
      </form>
    </div>
  );
};

export default FormJurosMora;