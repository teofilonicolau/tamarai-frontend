import React, { useState } from 'react';

const FormJurosMora = ({ onCalcular, loading }) => {
  const [dados, setDados] = useState({
    valor_principal: '',
    data_inicial: '',
    data_final: '',
    taxa_mensal: '1.00'
  });
  const [erros, setErros] = useState({});

  const validar = () => {
    const e = {};
    const vp = parseFloat(String(dados.valor_principal).replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
    if (vp <= 0) e.valor_principal = 'Valor principal deve ser maior que 0';
    if (!dados.data_inicial) e.data_inicial = 'Obrigatório';
    if (!dados.data_final) e.data_final = 'Obrigatório';
    if (dados.data_inicial && dados.data_final && new Date(dados.data_inicial) >= new Date(dados.data_final)) {
      e.data_final = 'Data final deve ser posterior à data inicial';
    }
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const parseMoney = (s) => {
    if (s == null || s === '') return 0;
    const cleaned = String(s).replace(/[^\d,.-]/g, '');
    if (cleaned === '') return 0;
    const withDot = cleaned.indexOf('.') > -1 && cleaned.indexOf(',') > -1
      ? cleaned.replace(/\./g, '').replace(',', '.')
      : cleaned.replace(',', '.');
    const parts = withDot.split('.');
    const normalized = parts.length > 2 ? parts.slice(0, -1).join('') + '.' + parts[parts.length - 1] : withDot;
    const n = parseFloat(normalized);
    return Number.isFinite(n) ? n : 0;
  };

  const toTaxDecimal = (t) => {
    const n = parseFloat(String(t).replace(',', '.')) || 0;
    if (n >= 1) return n / 100;
    return n;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;

    const cleanedData = {
      valor_principal: parseMoney(dados.valor_principal),
      // o endpoint espera "data_vencimento" (usamos data_final como vencimento)
      data_vencimento: dados.data_final ? new Date(dados.data_final).toISOString().split('T')[0] : '',
      taxa_mensal: toTaxDecimal(dados.taxa_mensal)
    };

    // Usa o fluxo centralizado do pai (Calculadoras.calcular)
    if (onCalcular) {
      onCalcular(cleanedData);
    }
  };

  return (
    <div style={{ background: 'white', borderRadius: 12, border: '1px solid #dee2e6', padding: 30 }}>
      <h3 style={{ color: '#495057', marginBottom: 20, textAlign: 'center' }}>💸 Cálculo de Juros de Mora</h3>

      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 20 }}>
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold', color: '#495057' }}>Valor Principal (R$):</label>
          <input
            type="text"
            value={dados.valor_principal}
            onChange={(ev) => setDados(prev => ({ ...prev, valor_principal: ev.target.value }))}
            placeholder="Ex: 1.000.000,00"
            style={{ width: '100%', padding: 12, border: `2px solid ${erros.valor_principal ? '#dc3545' : '#dee2e6'}`, borderRadius: 8 }}
          />
          {erros.valor_principal && <div style={{ color: '#dc3545', marginTop: 6 }}>{erros.valor_principal}</div>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold', color: '#495057' }}>Data Inicial:</label>
            <input type="date" value={dados.data_inicial} onChange={(e) => setDados(prev => ({ ...prev, data_inicial: e.target.value }))} style={{ width: '100%', padding: 12, border: `2px solid ${erros.data_inicial ? '#dc3545' : '#dee2e6'}`, borderRadius: 8 }} />
            {erros.data_inicial && <div style={{ color: '#dc3545', marginTop: 6 }}>{erros.data_inicial}</div>}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold', color: '#495057' }}>Data Final (vencimento):</label>
            <input type="date" value={dados.data_final} onChange={(e) => setDados(prev => ({ ...prev, data_final: e.target.value }))} style={{ width: '100%', padding: 12, border: `2px solid ${erros.data_final ? '#dc3545' : '#dee2e6'}`, borderRadius: 8 }} />
            {erros.data_final && <div style={{ color: '#dc3545', marginTop: 6 }}>{erros.data_final}</div>}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold', color: '#495057' }}>Taxa (% a.m.):</label>
          <input
            type="number"
            step="0.01"
            value={dados.taxa_mensal}
            onChange={(ev) => setDados(prev => ({ ...prev, taxa_mensal: ev.target.value }))}
            style={{ width: '100%', padding: 12, border: `2px solid ${erros.taxa_mensal ? '#dc3545' : '#dee2e6'}`, borderRadius: 8 }}
          />
        </div>

        <div style={{ background: '#e3f2fd', padding: 15, borderRadius: 8 }}>
          <p style={{ margin: 0 }}>📋 Informações Legais: Juros de mora conforme Código Civil, art. 406. Taxa padrão de 1% ao mês, salvo disposição contratual.</p>
        </div>

        <button type="submit" disabled={loading} style={{ width: '100%', padding: 15, border: 'none', background: loading ? '#6c757d' : '#28a745', color: 'white', borderRadius: 8 }}>
          {loading ? '⏳ Calculando...' : '🧮 Calcular Juros de Mora'}
        </button>
      </form>
    </div>
  );
};

export default FormJurosMora;