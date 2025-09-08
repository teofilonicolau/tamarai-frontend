// src/components/Calculadoras/FormRevisaoVidaToda.jsx
import React, { useState } from 'react';

const FormRevisaoVidaToda = ({ onCalcular, loading }) => {
  const [dados, setDados] = useState({
    salarios_antes_1994: [],
    salarios_depois_1994: [],
    data_dib: ''
  });

  const [salarioAntes, setSalarioAntes] = useState('');
  const [salarioDepois, setSalarioDepois] = useState('');
  const [erros, setErros] = useState({});

  const validarFormulario = () => {
    const novosErros = {};

    if (dados.salarios_antes_1994.length === 0) {
      novosErros.salarios_antes_1994 = 'Adicione pelo menos um salário anterior a 1994';
    }
    if (dados.salarios_depois_1994.length === 0) {
      novosErros.salarios_depois_1994 = 'Adicione pelo menos um salário posterior a 1994';
    }
    if (!dados.data_dib) {
      novosErros.data_dib = 'Informe a data do DIB (Data de Início do Benefício)';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const adicionarSalarioAntes = () => {
    if (salarioAntes && parseFloat(salarioAntes) > 0) {
      setDados({
        ...dados,
        salarios_antes_1994: [...dados.salarios_antes_1994, parseFloat(salarioAntes)]
      });
      setSalarioAntes('');
    }
  };

  const adicionarSalarioDepois = () => {
    if (salarioDepois && parseFloat(salarioDepois) > 0) {
      setDados({
        ...dados,
        salarios_depois_1994: [...dados.salarios_depois_1994, parseFloat(salarioDepois)]
      });
      setSalarioDepois('');
    }
  };

  const removerSalarioAntes = (index) => {
    const novosSalarios = dados.salarios_antes_1994.filter((_, i) => i !== index);
    setDados({ ...dados, salarios_antes_1994: novosSalarios });
  };

  const removerSalarioDepois = (index) => {
    const novosSalarios = dados.salarios_depois_1994.filter((_, i) => i !== index);
    setDados({ ...dados, salarios_depois_1994: novosSalarios });
  };

  const calcularPrevia = () => {
    if (dados.salarios_antes_1994.length > 0 && dados.salarios_depois_1994.length > 0) {
      const mediaAntes = dados.salarios_antes_1994.reduce((a, b) => a + b, 0) / dados.salarios_antes_1994.length;
      const mediaDepois = dados.salarios_depois_1994.reduce((a, b) => a + b, 0) / dados.salarios_depois_1994.length;
      const mediaTodos = [...dados.salarios_antes_1994, ...dados.salarios_depois_1994];
      const mediaVidaToda = mediaTodos.reduce((a, b) => a + b, 0) / mediaTodos.length;
      
      return {
        mediaAntes: mediaAntes.toFixed(2),
        mediaDepois: mediaDepois.toFixed(2),
        mediaVidaToda: mediaVidaToda.toFixed(2),
        vantajosa: mediaVidaToda > mediaDepois
      };
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validarFormulario()) {
      onCalcular(dados);
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
        �� Revisão da Vida Toda
      </h3>

      <form onSubmit={handleSubmit}>
        {/* Salários Antes de 1994 */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: 'bold', color: '#495057' }}>
            💰 Salários Anteriores a Julho/1994:
          </label>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <input
              type="number"
              step="0.01"
              value={salarioAntes}
              onChange={(e) => setSalarioAntes(e.target.value)}
              placeholder="Ex: 1200.00"
              style={{
                flex: 1,
                padding: '12px',
                border: '2px solid #dee2e6',
                borderRadius: '8px',
                fontSize: '1em'
              }}
            />
            <button
              type="button"
              onClick={adicionarSalarioAntes}
              style={{
                padding: '12px 20px',
                border: 'none',
                background: '#28a745',
                color: 'white',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              ➕ Adicionar
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
            {dados.salarios_antes_1994.map((salario, index) => (
              <div key={index} style={{
                background: '#e8f5e8',
                padding: '8px 12px',
                borderRadius: '20px',
                border: '1px solid #28a745',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>R\$ {salario.toFixed(2)}</span>
                <button
                  type="button"
                  onClick={() => removerSalarioAntes(index)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#dc3545',
                    cursor: 'pointer',
                    fontSize: '1.2em'
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {erros.salarios_antes_1994 && (
            <div style={{ color: '#dc3545', fontSize: '0.9em' }}>
              {erros.salarios_antes_1994}
            </div>
          )}
        </div>

        {/* Salários Depois de 1994 */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: 'bold', color: '#495057' }}>
            💰 Salários Posteriores a Julho/1994:
          </label>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <input
              type="number"
              step="0.01"
              value={salarioDepois}
              onChange={(e) => setSalarioDepois(e.target.value)}
              placeholder="Ex: 2500.00"
              style={{
                flex: 1,
                padding: '12px',
                border: '2px solid #dee2e6',
                borderRadius: '8px',
                fontSize: '1em'
              }}
            />
            <button
              type="button"
              onClick={adicionarSalarioDepois}
              style={{
                padding: '12px 20px',
                border: 'none',
                background: '#007bff',
                color: 'white',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              ➕ Adicionar
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
            {dados.salarios_depois_1994.map((salario, index) => (
              <div key={index} style={{
                background: '#e3f2fd',
                padding: '8px 12px',
                borderRadius: '20px',
                border: '1px solid #007bff',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>R\$ {salario.toFixed(2)}</span>
                <button
                  type="button"
                  onClick={() => removerSalarioDepois(index)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#dc3545',
                    cursor: 'pointer',
                    fontSize: '1.2em'
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {erros.salarios_depois_1994 && (
            <div style={{ color: '#dc3545', fontSize: '0.9em' }}>
              {erros.salarios_depois_1994}
            </div>
          )}
        </div>

        {/* Data DIB */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
            📅 Data do DIB (Data de Início do Benefício):
          </label>
          <input
            type="date"
            value={dados.data_dib}
            onChange={(e) => setDados({...dados, data_dib: e.target.value})}
            style={{
              width: '100%',
              padding: '12px',
              border: `2px solid ${erros.data_dib ? '#dc3545' : '#dee2e6'}`,
              borderRadius: '8px',
              fontSize: '1em'
            }}
          />
          {erros.data_dib && (
            <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '5px' }}>
              {erros.data_dib}
            </div>
          )}
          <div style={{ fontSize: '0.9em', color: '#6c757d', marginTop: '5px', fontStyle: 'italic' }}>
            📋 Data em que o benefício foi concedido pelo INSS
          </div>
        </div>

        {/* Prévia do Cálculo */}
        {previa && (
          <div style={{
            background: previa.vantajosa ? '#e8f5e8' : '#fff3cd',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '25px',
            border: `1px solid ${previa.vantajosa ? '#28a745' : '#ffc107'}`
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: previa.vantajosa ? '#155724' : '#856404' }}>
              📊 Prévia da Análise:
            </h4>
            <div style={{ color: previa.vantajosa ? '#155724' : '#856404', fontSize: '0.95em' }}>
              <p style={{ margin: '5px 0' }}>
                <strong>Média pós-1994:</strong> R\$ {previa.mediaDepois}
              </p>
              <p style={{ margin: '5px 0' }}>
                <strong>Média vida toda:</strong> R\$ {previa.mediaVidaToda}
              </p>
              <p style={{ margin: '5px 0', fontWeight: 'bold' }}>
                {previa.vantajosa ? '✅ Revisão VANTAJOSA' : '❌ Revisão NÃO vantajosa'}
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
            📋 Sobre a Revisão da Vida Toda:
          </h4>
          <ul style={{ margin: '0', paddingLeft: '20px', color: '#1565c0', fontSize: '0.9em' }}>
            <li>Inclui salários anteriores a julho/1994 no cálculo</li>
            <li>Válida para benefícios concedidos após 29/11/1999</li>
            <li>Sujeita a decadência de 10 anos (EC 103/2019)</li>
            <li>Análise de viabilidade é essencial antes do ajuizamento</li>
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
          {loading ? '⏳ Analisando...' : '🧮 Analisar Viabilidade'}
        </button>
      </form>
    </div>
  );
};

export default FormRevisaoVidaToda;