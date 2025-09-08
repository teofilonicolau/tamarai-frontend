// src/components/Calculadoras/FormCorrecaoMonetaria.jsx
import React, { useState } from 'react';

const FormCorrecaoMonetaria = ({ onCalcular, loading }) => {
  const [dados, setDados] = useState({
    valor: '',
    data_inicial: '',
    indice: 'INPC'
  });

  const [erros, setErros] = useState({});

  const indicesDisponiveis = [
    { 
      value: 'INPC', 
      label: 'INPC - Índice Nacional de Preços ao Consumidor',
      descricao: 'Mais usado em ações previdenciárias',
      orgao: 'IBGE'
    },
    { 
      value: 'IPCA', 
      label: 'IPCA - Índice de Preços ao Consumidor Amplo',
      descricao: 'Meta oficial de inflação',
      orgao: 'IBGE'
    },
    { 
      value: 'IPCA-E', 
      label: 'IPCA-E - IPCA Especial',
      descricao: 'Usado em precatórios',
      orgao: 'IBGE'
    },
    { 
      value: 'IGP-M', 
      label: 'IGP-M - Índice Geral de Preços do Mercado',
      descricao: 'Contratos e aluguéis',
      orgao: 'FGV'
    },
    { 
      value: 'IGP-DI', 
      label: 'IGP-DI - Índice Geral de Preços - Disponibilidade Interna',
      descricao: 'Correção de débitos fiscais',
      orgao: 'FGV'
    },
    { 
      value: 'SELIC', 
      label: 'SELIC - Sistema Especial de Liquidação e Custódia',
      descricao: 'Taxa básica de juros',
      orgao: 'BACEN'
    }
  ];

  const validarFormulario = () => {
    const novosErros = {};

    if (!dados.valor || dados.valor <= 0) {
      novosErros.valor = 'Informe o valor a ser corrigido';
    }
    if (!dados.data_inicial) {
      novosErros.data_inicial = 'Informe a data inicial';
    }
    
    // Validar se a data não é futura
    if (dados.data_inicial && new Date(dados.data_inicial) > new Date()) {
      novosErros.data_inicial = 'Data inicial não pode ser futura';
    }
    
    // Validar se a data não é muito antiga (mais de 30 anos)
    if (dados.data_inicial) {
      const dataInicial = new Date(dados.data_inicial);
      const trintaAnosAtras = new Date();
      trintaAnosAtras.setFullYear(trintaAnosAtras.getFullYear() - 30);
      
      if (dataInicial < trintaAnosAtras) {
        novosErros.data_inicial = 'Data muito antiga - verifique a disponibilidade do índice';
      }
    }

    if (!dados.indice) {
      novosErros.indice = 'Selecione o índice de correção';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const calcularPrevia = () => {
    if (dados.valor && dados.data_inicial) {
      const hoje = new Date();
      const dataInicial = new Date(dados.data_inicial);
      const diasDecorridos = Math.max(0, Math.floor((hoje - dataInicial) / (1000 * 60 * 60 * 24)));
      const anosDecorridos = diasDecorridos / 365;
      
      // Estimativas por índice (valores aproximados)
      const taxasAnuais = {
        'INPC': 0.045,    // 4,5%
        'IPCA': 0.045,    // 4,5%
        'IPCA-E': 0.045,  // 4,5%
        'IGP-M': 0.055,   // 5,5%
        'IGP-DI': 0.055,  // 5,5%
        'SELIC': 0.105    // 10,5%
      };
      
      const taxaAnual = taxasAnuais[dados.indice] || 0.045;
      const fatorCorrecao = Math.pow(1 + taxaAnual, anosDecorridos);
      const valorCorrigido = dados.valor * fatorCorrecao;
      const valorCorrecao = valorCorrigido - dados.valor;
      
      return {
        diasDecorridos,
        anosDecorridos: anosDecorridos.toFixed(1),
        taxaAnual: (taxaAnual * 100).toFixed(1),
        fatorCorrecao: fatorCorrecao.toFixed(4),
        valorCorrigido: valorCorrigido.toFixed(2),
        valorCorrecao: valorCorrecao.toFixed(2)
      };
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validarFormulario()) {
      const dadosParaCalcular = {
        valor: parseFloat(dados.valor),
        data_inicial: dados.data_inicial,
        indice: dados.indice
      };
      onCalcular(dadosParaCalcular);
    }
  };

  const previa = calcularPrevia();
  const indiceSelecionado = indicesDisponiveis.find(i => i.value === dados.indice);

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #dee2e6',
      padding: '30px'
    }}>
      <h3 style={{ color: '#495057', marginBottom: '25px', textAlign: 'center' }}>
        📊 Correção Monetária
      </h3>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
            💰 Valor Original (R$):
          </label>
          <input
            type="number"
            step="0.01"
            value={dados.valor}
            onChange={(e) => setDados({...dados, valor: e.target.value})}
            placeholder="Ex: 10000.00"
            style={{
              width: '100%',
              padding: '12px',
              border: `2px solid ${erros.valor ? '#dc3545' : '#dee2e6'}`,
              borderRadius: '8px',
              fontSize: '1em'
            }}
          />
          {erros.valor && (
            <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '5px' }}>
              {erros.valor}
            </div>
          )}
          <div style={{ fontSize: '0.9em', color: '#6c757d', marginTop: '5px', fontStyle: 'italic' }}>
            💡 Valor que será corrigido monetariamente
          </div>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
            📅 Data Inicial:
          </label>
          <input
            type="date"
            value={dados.data_inicial}
            onChange={(e) => setDados({...dados, data_inicial: e.target.value})}
            style={{
              width: '100%',
              padding: '12px',
              border: `2px solid ${erros.data_inicial ? '#dc3545' : '#dee2e6'}`,
              borderRadius: '8px',
              fontSize: '1em'
            }}
          />
          {erros.data_inicial && (
            <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '5px' }}>
              {erros.data_inicial}
            </div>
          )}
          <div style={{ fontSize: '0.9em', color: '#6c757d', marginTop: '5px', fontStyle: 'italic' }}>
            📋 Data base para início da correção
          </div>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: 'bold', color: '#495057' }}>
            📈 Índice de Correção:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
            {indicesDisponiveis.map(indice => (
              <label key={indice.value} style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '12px 15px',
                border: `2px solid ${dados.indice === indice.value ? '#ffc107' : '#dee2e6'}`,
                borderRadius: '8px',
                background: dados.indice === indice.value ? '#fff3cd' : '#ffffff',
                transition: 'all 0.3s ease'
              }}>
                <input
                  type="radio"
                  name="indice"
                  value={indice.value}
                  checked={dados.indice === indice.value}
                  onChange={(e) => setDados({...dados, indice: e.target.value})}
                  style={{ marginRight: '12px' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', color: '#495057', marginBottom: '2px' }}>
                    {indice.label}
                  </div>
                  <div style={{ fontSize: '0.85em', color: '#6c757d', marginBottom: '2px' }}>
                    {indice.descricao}
                  </div>
                  <div style={{ fontSize: '0.8em', color: '#856404', fontWeight: 'bold' }}>
                    Órgão: {indice.orgao}
                  </div>
                </div>
              </label>
            ))}
          </div>
          {erros.indice && (
            <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '8px' }}>
              {erros.indice}
            </div>
          )}
        </div>

        {/* Informações sobre o índice selecionado */}
        {indiceSelecionado && (
          <div style={{
            background: '#fff3cd',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '25px',
            border: '1px solid #ffc107'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>
              📋 Sobre o {indiceSelecionado.value}:
            </h4>
            <p style={{ margin: '0', color: '#856404', fontSize: '0.9em' }}>
              <strong>{indiceSelecionado.label}</strong><br/>
              {indiceSelecionado.descricao} - Calculado pelo {indiceSelecionado.orgao}
            </p>
          </div>
        )}

        {/* Prévia do Cálculo */}
        {previa && previa.diasDecorridos > 0 && (
          <div style={{
            background: '#e8f5e8',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '25px',
            border: '1px solid #28a745'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#155724' }}>
              �� Prévia da Correção:
            </h4>
            <div style={{ color: '#155724', fontSize: '0.95em' }}>
              <p style={{ margin: '5px 0' }}>
                <strong>Período:</strong> {previa.diasDecorridos} dias ({previa.anosDecorridos} anos)
              </p>
              <p style={{ margin: '5px 0' }}>
                <strong>Taxa anual estimada:</strong> {previa.taxaAnual}%
              </p>
              <p style={{ margin: '5px 0' }}>
                <strong>Fator de correção:</strong> {previa.fatorCorrecao}
              </p>
              <p style={{ margin: '5px 0' }}>
                <strong>Valor da correção:</strong> R$ {previa.valorCorrecao}
              </p>
              <hr style={{ margin: '10px 0', border: 'none', borderTop: '1px solid #155724' }} />
              <p style={{ margin: '5px 0', fontWeight: 'bold', fontSize: '1.1em' }}>
                <strong>Valor corrigido:</strong> R$ {previa.valorCorrigido}
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
            �� Base Legal:
          </h4>
          <ul style={{ margin: '0', paddingLeft: '20px', color: '#1565c0', fontSize: '0.9em' }}>
            <li><strong>Lei 6.899/81:</strong> Correção monetária em débitos judiciais</li>
            <li><strong>Lei 10.192/01:</strong> Desindexação da economia</li>
            <li><strong>CPC Art. 322:</strong> Pedido de correção monetária</li>
            <li><strong>Súmula 43 STJ:</strong> Incide correção desde o evento danoso</li>
            <li><strong>Súmula 562 STF:</strong> Não incide sobre honorários advocatícios</li>
          </ul>
        </div>

        {/* Observações Importantes */}
        <div style={{
          background: '#fff3cd',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '25px',
          border: '1px solid #ffc107'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>
            ⚠️ Observações Importantes:
          </h4>
          <ul style={{ margin: '0', paddingLeft: '20px', color: '#856404', fontSize: '0.9em' }}>
            <li>Cálculo estimativo - consulte tabelas oficiais atualizadas</li>
            <li>Índices podem ter períodos de indisponibilidade</li>
            <li>Alguns índices são calculados com defasagem</li>
            <li>Verificar jurisprudência específica para o tipo de processo</li>
            <li>Possível aplicação de índices diferentes por período</li>
          </ul>
        </div>

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
          {loading ? '⏳ Calculando...' : '🧮 Calcular Correção Monetária'}
        </button>
      </form>
    </div>
  );
};

export default FormCorrecaoMonetaria;