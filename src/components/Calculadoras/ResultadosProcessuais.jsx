// src/components/Calculadoras/ResultadosProcessuais.jsx
import React from 'react';

const ResultadosProcessuais = ({ tipo, resultados }) => {
  const renderValorCausa = () => {
    // garantir que valor_causa seja número para formatar
    const valorNumerico = Number(resultados?.valor_causa) || 0;
    const moeda = resultados?.moeda || 'BRL';

    return (
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '12px',
        border: '1px solid #dee2e6'
      }}>
        <h3 style={{ color: '#17a2b8', marginBottom: '25px', textAlign: 'center' }}>
          💰 Resultado - Valor da Causa
        </h3>
        
        <div style={{ background: '#17a2b8', color: 'white', padding: '30px', borderRadius: '12px', textAlign: 'center', marginBottom: '25px' }}>
          <h4 style={{ margin: '0 0 15px 0', fontSize: '1.2em' }}>💰 Valor da Causa</h4>
          <p style={{ fontSize: '3em', fontWeight: 'bold', margin: '0' }}>
            {valorNumerico.toLocaleString('pt-BR', { style: 'currency', currency: moeda })}
          </p>
          <p style={{ margin: '10px 0 0 0', opacity: '0.9' }}>
            Moeda: {moeda}
          </p>
        </div>

        <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#1565c0' }}>📋 Informações Legais</h4>
          <ul style={{ margin: '0', paddingLeft: '20px', color: '#1565c0' }}>
            <li>Art. 292 do CPC - Valor da causa deve corresponder ao benefício econômico</li>
            <li>Custas processuais calculadas sobre este valor</li>
            <li>Base para cálculo de honorários advocatícios</li>
            <li>Determina a competência do juízo (valor da causa)</li>
          </ul>
        </div>
      </div>
    );
  };

  // restante do arquivo permanece igual (omiti aqui para foco)
  // Para manter compatibilidade, você pode deixar os outros renders como estavam no seu arquivo original.
  // Abaixo apenas invocamos o render correto com base no tipo:
  switch (tipo) {
    case 'valor-causa':
      return renderValorCausa();
    case 'liquidacao-sentenca':
      // ... seu renderLiquidacaoSentenca original
      return (
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '12px',
          border: '1px solid #dee2e6'
        }}>
          {/* mantenha seu conteúdo existente para liquidação */}
          <h3>Resultado - Liquidação (ver código original)</h3>
        </div>
      );
    case 'pensao-alimenticia':
      // ... seu renderPensaoAlimenticia original
      return (
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '12px',
          border: '1px solid #dee2e6'
        }}>
          <h3>Resultado - Pensão (ver código original)</h3>
        </div>
      );
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

export default ResultadosProcessuais;