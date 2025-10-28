// src/components/Calculadoras/ResultadosProcessuais.jsx
import React from 'react';

const formatCurrency = (v, moeda = 'BRL') => {
  const n = Number(v);
  if (!Number.isFinite(n)) return (0).toLocaleString('pt-BR', { style: 'currency', currency: moeda });
  return n.toLocaleString('pt-BR', { style: 'currency', currency: moeda });
};

const formatDate = (d) => {
  if (!d) return '-';
  try {
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return String(d);
    return dt.toLocaleDateString('pt-BR');
  } catch {
    return String(d);
  }
};

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

  const renderLiquidacaoSentenca = () => {
    // espera-se que "resultados" contenha:
    // { valor_principal, correcao_monetaria, juros_mora, honorarios_advocaticios, valor_total_liquidacao, data_calculo }
    const valorPrincipal = Number(resultados?.valor_principal) || 0;
    const correcao = Number(resultados?.correcao_monetaria) || 0;
    const juros = Number(resultados?.juros_mora) || 0;
    const honorarios = Number(resultados?.honorarios_advocaticios) || 0;
    const total = Number(resultados?.valor_total_liquidacao) || 0;
    const dataCalculo = resultados?.data_calculo || resultados?.data || null;
    const moeda = resultados?.moeda || 'BRL';

    return (
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '12px',
        border: '1px solid #dee2e6'
      }}>
        <h3 style={{ color: '#17a2b8', marginBottom: '20px', textAlign: 'center' }}>
          🧮 Resultado - Liquidação de Sentença
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
            <div style={{ fontSize: '0.9em', color: '#6c757d' }}>💰 Valor Principal</div>
            <div style={{ fontSize: '1.4em', fontWeight: 'bold', color: '#17a2b8' }}>{formatCurrency(valorPrincipal, moeda)}</div>
          </div>

          <div style={{ background: '#fff3cd', padding: '16px', borderRadius: '8px', border: '1px solid #ffeeba' }}>
            <div style={{ fontSize: '0.9em', color: '#856404' }}>📈 Correção Monetária</div>
            <div style={{ fontSize: '1.4em', fontWeight: 'bold', color: '#856404' }}>{formatCurrency(correcao, moeda)}</div>
          </div>

          <div style={{ background: '#f8d7da', padding: '16px', borderRadius: '8px', border: '1px solid #f5c6cb' }}>
            <div style={{ fontSize: '0.9em', color: '#721c24' }}>⏰ Juros de Mora</div>
            <div style={{ fontSize: '1.4em', fontWeight: 'bold', color: '#dc3545' }}>{formatCurrency(juros, moeda)}</div>
          </div>

          <div style={{ background: '#e8f5e8', padding: '16px', borderRadius: '8px', border: '1px solid #c3e6cb' }}>
            <div style={{ fontSize: '0.9em', color: '#155724' }}>⚖️ Honorários</div>
            <div style={{ fontSize: '1.4em', fontWeight: 'bold', color: '#28a745' }}>{formatCurrency(honorarios, moeda)}</div>
          </div>
        </div>

        <div style={{ background: '#17a2b8', color: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center', marginBottom: '16px' }}>
          <div style={{ fontSize: '0.95em', opacity: 0.95 }}>💰 Valor Total da Liquidação</div>
          <div style={{ fontSize: '2em', fontWeight: 'bold', marginTop: '8px' }}>{formatCurrency(total, moeda)}</div>
          <div style={{ marginTop: '8px', opacity: 0.9 }}>Data do cálculo: {formatDate(dataCalculo)}</div>
        </div>

        <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#1565c0' }}>📋 Observações e Base Legal</h4>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#1565c0' }}>
            <li>Art. 509 CPC - Liquidação por cálculo do contador</li>
            <li>Art. 85 CPC - Honorários advocatícios (8% a 20%)</li>
            <li>Art. 406 CC - Juros de mora de 1% ao mês</li>
            <li>Lei 6.899/81 - Correção monetária em débitos judiciais</li>
          </ul>
        </div>
      </div>
    );
  };

  const renderPensaoAlimenticia = () => (
    <div style={{
      background: 'white',
      padding: '30px',
      borderRadius: '12px',
      border: '1px solid #dee2e6'
    }}>
      <h3 style={{ color: '#17a2b8', marginBottom: '25px', textAlign: 'center' }}>
        👨‍👩‍👧‍👦 Resultado - Pensão Alimentícia
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
        <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#1565c0' }}>💰 Dados Financeiros</h4>
          <p><strong>Renda do alimentante:</strong> R\$ {Number(resultados?.renda_alimentante || 0).toFixed(2)}</p>
          <p><strong>Renda disponível (70%):</strong> R\$ {Number(resultados?.renda_disponivel || 0).toFixed(2)}</p>
          <p><strong>Percentual aplicado:</strong> {resultados?.percentual_aplicado || '-'}</p>
        </div>
        
        <div style={{ background: '#fff3cd', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>👶 Filhos</h4>
          <p><strong>Número de filhos:</strong> {resultados?.numero_filhos || 0}</p>
          <p><strong>Valor por filho:</strong> R\$ {(Number(resultados?.valor_por_filho) || 0).toFixed(2)}</p>
        </div>
      </div>

      <div style={{ background: '#17a2b8', color: 'white', padding: '25px', borderRadius: '12px', textAlign: 'center', marginBottom: '25px' }}>
        <h4 style={{ margin: '0 0 15px 0', fontSize: '1.3em' }}>💰 Valor Total da Pensão</h4>
        <p style={{ fontSize: '2.5em', fontWeight: 'bold', margin: '0' }}>
          R\$ { (Number(resultados?.valor_total_pensao) || 0).toFixed(2) }
        </p>
        <p style={{ margin: '10px 0 0 0', opacity: '0.9' }}>
          {resultados?.observacao || ''}
        </p>
      </div>
    </div>
  );

  switch (tipo) {
    case 'valor-causa':
      return renderValorCausa();
    case 'liquidacao-sentenca':
      return renderLiquidacaoSentenca();
    case 'pensao-alimenticia':
      return renderPensaoAlimenticia();
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