// src/components/Calculadoras/ResultadosFinanceiros.jsx
import React from 'react';

const ResultadosFinanceiros = ({ tipo, resultados }) => {
  const renderJurosMora = () => (
    <div style={{
      background: 'white',
      padding: '30px',
      borderRadius: '12px',
      border: '1px solid #dee2e6'
    }}>
      <h3 style={{ color: '#ffc107', marginBottom: '25px', textAlign: 'center' }}>
        📈 Resultado - Juros de Mora
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
        <div style={{ background: '#fff3cd', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>📊 Período</h4>
          <p><strong>Dias em atraso:</strong> {resultados.dias_atraso}</p>
          <p><strong>Meses em atraso:</strong> {resultados.meses_atraso?.toFixed(2)}</p>
          <p><strong>Taxa mensal:</strong> {resultados.taxa_mensal}</p>
        </div>
        
        <div style={{ background: '#e8f5e8', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#155724' }}>💰 Valores</h4>
          <p><strong>Valor principal:</strong> R\$ {resultados.valor_principal?.toFixed(2)}</p>
          <p><strong>Valor dos juros:</strong> R\$ {resultados.valor_juros?.toFixed(2)}</p>
          <p style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#28a745' }}>
            <strong>Valor total:</strong> R\$ {resultados.valor_total?.toFixed(2)}
          </p>
        </div>
      </div>
      
      <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#1565c0' }}>📋 Base Legal</h4>
        <ul style={{ margin: '0', paddingLeft: '20px', color: '#1565c0' }}>
          <li>Art. 406 do Código Civil - Taxa de 1% ao mês</li>
          <li>Art. 161, §1º do CTN - Juros de mora</li>
          <li>Súmula 54 STJ - Juros moratórios em ação de indenização</li>
        </ul>
      </div>
    </div>
  );

  const renderCorrecaoMonetaria = () => (
    <div style={{
      background: 'white',
      padding: '30px',
      borderRadius: '12px',
      border: '1px solid #dee2e6'
    }}>
      <h3 style={{ color: '#ffc107', marginBottom: '25px', textAlign: 'center' }}>
        📊 Resultado - Correção Monetária
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
        <div style={{ background: '#fff3cd', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>📅 Período</h4>
          <p><strong>Data inicial:</strong> {new Date(resultados.data_inicial).toLocaleDateString('pt-BR')}</p>
          <p><strong>Data final:</strong> {new Date(resultados.data_final).toLocaleDateString('pt-BR')}</p>
          <p><strong>Anos decorridos:</strong> {resultados.anos_decorridos}</p>
          <p><strong>Índice utilizado:</strong> {resultados.indice_utilizado}</p>
        </div>
        
        <div style={{ background: '#e8f5e8', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#155724' }}>💰 Valores</h4>
          <p><strong>Valor original:</strong> R\$ {resultados.valor_original?.toFixed(2)}</p>
          <p><strong>Fator de correção:</strong> {resultados.fator_correcao}</p>
          <p><strong>Valor da correção:</strong> R\$ {resultados.valor_correcao?.toFixed(2)}</p>
          <p style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#28a745' }}>
            <strong>Valor corrigido:</strong> R\$ {resultados.valor_corrigido?.toFixed(2)}
          </p>
        </div>
      </div>
      
      <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#1565c0' }}>📋 Informações do Índice</h4>
        <p><strong>Taxa anual estimada:</strong> {resultados.taxa_anual}</p>
        <p style={{ fontSize: '0.9em', color: '#6c757d' }}>
          * Valores calculados com base em estimativas. Consulte tabelas oficiais para cálculos precisos.
        </p>
      </div>
    </div>
  );

  switch (tipo) {
    case 'juros-mora':
      return renderJurosMora();
    case 'correcao-monetaria':
      return renderCorrecaoMonetaria();
    default:
      return (
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '12px',
          border: '1px solid #dee2e6'
        }}>
          <h3>📊 Resultado do Cálculo</h3>
          <pre style={{ 
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            overflow: 'auto',
            fontSize: '0.9em'
          }}>
            {JSON.stringify(resultados, null, 2)}
          </pre>
        </div>
      );
  }
};

export default ResultadosFinanceiros;