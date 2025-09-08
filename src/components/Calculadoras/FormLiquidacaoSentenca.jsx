// src/components/Calculadoras/FormLiquidacaoSentenca.jsx
import React, { useState } from 'react';

const FormLiquidacaoSentenca = ({ onCalcular, loading }) => {
  const [dados, setDados] = useState({
    valor_principal: '',
    data_sentenca: '',
    incluir_honorarios: true
  });

  const [erros, setErros] = useState({});

  const validarFormulario = () => {
    const novosErros = {};

    if (!dados.valor_principal || dados.valor_principal <= 0) {
      novosErros.valor_principal = 'Informe o valor principal da condenação';
    }
    if (!dados.data_sentenca) {
      novosErros.data_sentenca = 'Informe a data da sentença';
    }
    
    // Validar se a data não é futura
    if (dados.data_sentenca && new Date(dados.data_sentenca) > new Date()) {
      novosErros.data_sentenca = 'Data da sentença não pode ser futura';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const calcularPrevia = () => {
    if (dados.valor_principal && dados.data_sentenca) {
      const hoje = new Date();
      const sentenca = new Date(dados.data_sentenca);
      const diasDecorridos = Math.max(0, Math.floor((hoje - sentenca) / (1000 * 60 * 60 * 24)));
      const anosDecorridos = diasDecorridos / 365;
      
      // Estimativa simples (4,5% ao ano IPCA + 1% ao mês juros)
      const taxaIpca = 0.045;
      const fatorCorrecao = Math.pow(1 + taxaIpca, anosDecorridos);
      const correcaoEstimada = dados.valor_principal * (fatorCorrecao - 1);
      
      const mesesDecorridos = diasDecorridos / 30;
      const jurosEstimados = dados.valor_principal * 0.01 * mesesDecorridos;
      
      const valorCorrigido = parseFloat(dados.valor_principal) + correcaoEstimada;
      const honorarios = dados.incluir_honorarios ? valorCorrigido * 0.10 : 0;
      const valorTotal = valorCorrigido + jurosEstimados + honorarios;
      
      return {
        diasDecorridos,
        anosDecorridos: anosDecorridos.toFixed(1),
        correcaoEstimada: correcaoEstimada.toFixed(2),
        jurosEstimados: jurosEstimados.toFixed(2),
        honorarios: honorarios.toFixed(2),
        valorTotal: valorTotal.toFixed(2)
      };
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validarFormulario()) {
      const dadosParaCalcular = {
        valor_principal: parseFloat(dados.valor_principal),
        data_sentenca: dados.data_sentenca,
        incluir_honorarios: dados.incluir_honorarios
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
        �� Liquidação de Sentença
      </h3>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
            💰 Valor Principal da Condenação (R$):
          </label>
          <input
            type="number"
            step="0.01"
            value={dados.valor_principal}
            onChange={(e) => setDados({...dados, valor_principal: e.target.value})}
            placeholder="Ex: 18000.00"
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
          <div style={{ fontSize: '0.9em', color: '#6c757d', marginTop: '5px', fontStyle: 'italic' }}>
            💡 Valor fixado na sentença condenatória
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
            📅 Data da Sentença:
          </label>
          <input
            type="date"
            value={dados.data_sentenca}
            onChange={(e) => setDados({...dados, data_sentenca: e.target.value})}
            style={{
              width: '100%',
              padding: '12px',
              border: `2px solid ${erros.data_sentenca ? '#dc3545' : '#dee2e6'}`,
              borderRadius: '8px',
              fontSize: '1em'
            }}
          />
          {erros.data_sentenca && (
            <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '5px' }}>
              {erros.data_sentenca}
            </div>
          )}
          <div style={{ fontSize: '0.9em', color: '#6c757d', marginTop: '5px', fontStyle: 'italic' }}>
            📋 Data do trânsito em julgado ou da condenação
          </div>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            padding: '15px',
            border: `2px solid ${dados.incluir_honorarios ? '#28a745' : '#dee2e6'}`,
            borderRadius: '8px',
            background: dados.incluir_honorarios ? '#e8f5e8' : '#ffffff',
            transition: 'all 0.3s ease'
          }}>
            <input
              type="checkbox"
              checked={dados.incluir_honorarios}
              onChange={(e) => setDados({...dados, incluir_honorarios: e.target.checked})}
              style={{ marginRight: '12px', transform: 'scale(1.2)' }}
            />
            <div>
              <div style={{ fontWeight: 'bold', color: '#495057' }}>
                ⚖️ Incluir Honorários Advocatícios
              </div>
              <div style={{ fontSize: '0.9em', color: '#6c757d', marginTop: '3px' }}>
                10% sobre o valor principal corrigido (padrão CPC)
              </div>
            </div>
          </label>
        </div>

        {/* Prévia do Cálculo */}
        {previa && previa.diasDecorridos > 0 && (
          <div style={{
            background: '#e3f2fd',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '25px',
            border: '1px solid #2196f3'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#1565c0' }}>
              📊 Prévia da Liquidação:
            </h4>
            <div style={{ color: '#1565c0', fontSize: '0.95em' }}>
              <p style={{ margin: '5px 0' }}>
                <strong>Período:</strong> {previa.diasDecorridos} dias ({previa.anosDecorridos} anos)
              </p>
              <p style={{ margin: '5px 0' }}>
                <strong>Correção monetária:</strong> R$ {previa.correcaoEstimada}
              </p>
              <p style={{ margin: '5px 0' }}>
                <strong>Juros de mora:</strong> R$ {previa.jurosEstimados}
              </p>
              {dados.incluir_honorarios && (
                <p style={{ margin: '5px 0' }}>
                  <strong>Honorários (10%):</strong> R$ {previa.honorarios}
                </p>
              )}
              <hr style={{ margin: '10px 0', border: 'none', borderTop: '1px solid #1565c0' }} />
              <p style={{ margin: '5px 0', fontWeight: 'bold', fontSize: '1.1em' }}>
                <strong>Valor total estimado:</strong> R$ {previa.valorTotal}
              </p>
            </div>
          </div>
        )}

        {/* Informações sobre Índices */}
        <div style={{
          background: '#e8f5e8',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '25px',
          border: '1px solid #28a745'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#155724' }}>
            📈 Índices de Correção:
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', color: '#155724', fontSize: '0.9em' }}>
            <div>
              <strong>Correção Monetária:</strong>
              <ul style={{ margin: '5px 0', paddingLeft: '15px' }}>
                <li>IPCA-E (padrão)</li>
                <li>INPC (alternativo)</li>
                <li>IGP-M (específico)</li>
              </ul>
            </div>
            <div>
              <strong>Juros de Mora:</strong>
              <ul style={{ margin: '5px 0', paddingLeft: '15px' }}>
                <li>1% ao mês (padrão)</li>
                <li>SELIC (específico)</li>
                <li>TR + 1% (poupança)</li>
              </ul>
            </div>
          </div>
        </div>

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
            <li><strong>Art. 509 CPC:</strong> Liquidação por cálculo do contador</li>
            <li><strong>Art. 85 CPC:</strong> Honorários advocatícios (8% a 20%)</li>
            <li><strong>Art. 406 CC:</strong> Juros de mora de 1% ao mês</li>
            <li><strong>Lei 6.899/81:</strong> Correção monetária em débitos judiciais</li>
            <li><strong>Súmula 362 STJ:</strong> Correção desde o evento danoso</li>
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
            <li>Índices podem variar conforme o tipo de processo</li>
            <li>Honorários sujeitos à análise judicial (8% a 20%)</li>
            <li>Possível incidência de outros encargos (multas, etc.)</li>
            <li>Verificar se há pagamentos parciais a deduzir</li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '15px',
            border: 'none',
            background: loading ? '#6c757d' : '#17a2b8',
            color: 'white',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '1.1em',
            fontWeight: 'bold'
          }}
        >
          {loading ? '⏳ Calculando...' : '🧮 Calcular Liquidação'}
        </button>
      </form>
    </div>
  );
};

export default FormLiquidacaoSentenca;