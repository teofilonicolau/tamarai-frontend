// src/components/Calculadoras/ResultadosFinanceiros.jsx
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

const ResultadosFinanceiros = ({ tipo, resultados }) => {
  const renderJurosMora = () => {
    const dias = Number(resultados?.dias_atraso ?? resultados?.dias ?? 0);
    const meses = dias / 30;
    const taxa = resultados?.taxa_mensal ?? resultados?.taxa ?? '-';
    const valor_principal = Number(resultados?.valor_principal ?? 0);
    const valor_juros = Number(resultados?.juros ?? resultados?.valor_juros ?? 0);
    const valor_total = Number(resultados?.valor_total ?? 0);

    return (
      <div style={{
        background: 'white',
        padding: 30,
        borderRadius: 12,
        border: '1px solid #dee2e6'
      }}>
        <h3 style={{ color: '#ffc107', marginBottom: 25, textAlign: 'center' }}>📈 Resultado - Juros de Mora</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 25 }}>
          <div style={{ background: '#fff3cd', padding: 15, borderRadius: 8 }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>📊 Período</h4>
            <p><strong>Dias em atraso:</strong> {dias}</p>
            <p><strong>Meses em atraso (aprox):</strong> {meses.toFixed(2)}</p>
            <p><strong>Taxa mensal:</strong> {typeof taxa === 'number' ? (taxa).toString() : taxa}</p>
          </div>

          <div style={{ background: '#e8f5e8', padding: 15, borderRadius: 8 }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#155724' }}>💰 Valores</h4>
            <p><strong>Valor principal:</strong> {formatCurrency(valor_principal)}</p>
            <p><strong>Valor dos juros:</strong> {formatCurrency(valor_juros)}</p>
            <p style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#28a745' }}>
              <strong>Valor total:</strong> {formatCurrency(valor_total)}
            </p>
          </div>
        </div>

        <div style={{ background: '#e3f2fd', padding: 15, borderRadius: 8 }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#1565c0' }}>📋 Base Legal</h4>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#1565c0' }}>
            <li>Art. 406 do Código Civil - Taxa de 1% ao mês</li>
            <li>Art. 161, §1º do CTN - Juros de mora</li>
            <li>Súmula 54 STJ - Juros moratórios em ação de indenização</li>
          </ul>
        </div>
      </div>
    );
  };

  const renderCorrecaoMonetaria = () => {
    // campos esperados: valor_original, data_inicial, data_final, anos_decorridos, indice_utilizado, taxa_anual, fator_correcao, valor_corrigido, valor_correcao
    const valorOriginal = Number(resultados?.valor_original ?? resultados?.valor ?? 0);
    const dataInicial = resultados?.data_inicial || resultados?.data_vencimento || null;
    const dataFinal = resultados?.data_final || null;
    const anos = Number(resultados?.anos_decorridos ?? 0);
    const indice = resultados?.indice_utilizado ?? resultados?.indice ?? '-';
    const taxaAnual = resultados?.taxa_anual ?? resultados?.taxa ?? '-';
    const fator = Number(resultados?.fator_correcao ?? 1);
    const valorCorrigido = Number(resultados?.valor_corrigido ?? resultados?.valor_corrigido ?? 0);
    const valorCorrecao = Number(resultados?.valor_correcao ?? 0);

    return (
      <div style={{
        background: 'white',
        padding: 30,
        borderRadius: 12,
        border: '1px solid #dee2e6'
      }}>
        <h3 style={{ color: '#ffc107', marginBottom: 20, textAlign: 'center' }}>📊 Resultado - Correção Monetária</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 20 }}>
          <div style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, border: '1px solid #dee2e6' }}>
            <div style={{ fontSize: '0.9em', color: '#6c757d' }}>💰 Valor Original</div>
            <div style={{ fontSize: '1.4em', fontWeight: 'bold', color: '#17a2b8' }}>{formatCurrency(valorOriginal)}</div>
            <div style={{ marginTop: 8, color: '#6c757d' }}>
              <div><strong>Data inicial:</strong> {formatDate(dataInicial)}</div>
              <div><strong>Data final:</strong> {formatDate(dataFinal)}</div>
            </div>
          </div>

          <div style={{ background: '#fff3cd', padding: 16, borderRadius: 8, border: '1px solid #ffeeba' }}>
            <div style={{ fontSize: '0.9em', color: '#856404' }}>📈 Índice e Taxa</div>
            <div style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#856404' }}>{indice}</div>
            <div style={{ marginTop: 8 }}>
              <div><strong>Anos decorridos:</strong> {Number(anos).toFixed(2)}</div>
              <div><strong>Taxa anual (estimada):</strong> {typeof taxaAnual === 'number' ? `${taxaAnual}%` : taxaAnual}</div>
            </div>
          </div>

          <div style={{ background: '#e8f5e8', padding: 16, borderRadius: 8, border: '1px solid #c3e6cb' }}>
            <div style={{ fontSize: '0.9em', color: '#155724' }}>🔢 Fator e Correção</div>
            <div style={{ fontSize: '1.4em', fontWeight: 'bold', color: '#155724' }}>{fator.toFixed(4)}</div>
            <div style={{ marginTop: 8 }}>
              <div><strong>Valor corrigido:</strong> {formatCurrency(valorCorrigido)}</div>
              <div><strong>Valor da correção:</strong> {formatCurrency(valorCorrecao)}</div>
            </div>
          </div>
        </div>

        <div style={{ background: '#e3f2fd', padding: 15, borderRadius: 8 }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#1565c0' }}>📋 Observações</h4>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#1565c0' }}>
            <li>Valores apresentados são estimativas com base no índice selecionado.</li>
            <li>Consulte tabelas oficiais para cálculos formais.</li>
            <li>Honorários, multas e deduções não estão incluídos neste cálculo.</li>
          </ul>
        </div>
      </div>
    );
  };

  switch (tipo) {
    case 'juros-mora':
      return renderJurosMora();
    case 'correcao-monetaria':
      return renderCorrecaoMonetaria();
    default:
      return (
        <div style={{
          background: 'white',
          padding: 30,
          borderRadius: 12,
          border: '1px solid #dee2e6'
        }}>
          <h3>📊 Resultado do Cálculo</h3>
          <pre style={{ background: '#f8f9fa', padding: 20, borderRadius: 8, overflow: 'auto', fontSize: '0.9em' }}>
            {JSON.stringify(resultados, null, 2)}
          </pre>
        </div>
      );
  }
};

export default ResultadosFinanceiros;