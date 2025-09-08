// src/components/Calculadoras/ResultadosProcessuais.jsx
import React from 'react';

const ResultadosProcessuais = ({ tipo, resultados }) => {
  const renderValorCausa = () => (
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
          R\$ {resultados.valor_causa?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
        <p style={{ margin: '10px 0 0 0', opacity: '0.9' }}>
          Moeda: {resultados.moeda}
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

  const renderLiquidacaoSentenca = () => (
    <div style={{
      background: 'white',
      padding: '30px',
      borderRadius: '12px',
      border: '1px solid #dee2e6'
    }}>
      <h3 style={{ color: '#17a2b8', marginBottom: '25px', textAlign: 'center' }}>
        📋 Resultado - Liquidação de Sentença
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginBottom: '25px' }}>
        <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#1565c0' }}>💰 Valor Principal</h4>
          <p style={{ fontSize: '1.3em', fontWeight: 'bold', color: '#17a2b8' }}>
            R\$ {resultados.valor_principal?.toFixed(2)}
          </p>
        </div>
        
        <div style={{ background: '#fff3cd', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>📈 Correção Monetária</h4>
          <p style={{ fontSize: '1.3em', fontWeight: 'bold', color: '#ffc107' }}>
            R\$ {resultados.correcao_monetaria?.toFixed(2)}
          </p>
        </div>
        
        <div style={{ background: '#f8d7da', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#721c24' }}>⏰ Juros de Mora</h4>
          <p style={{ fontSize: '1.3em', fontWeight: 'bold', color: '#dc3545' }}>
            R\$ {resultados.juros_mora?.toFixed(2)}
          </p>
        </div>
        
        {resultados.honorarios_advocaticios && (
          <div style={{ background: '#e8f5e8', padding: '15px', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#155724' }}>⚖️ Honorários</h4>
            <p style={{ fontSize: '1.3em', fontWeight: 'bold', color: '#28a745' }}>
              R\$ {resultados.honorarios_advocaticios?.toFixed(2)}
            </p>
          </div>
        )}
      </div>

      {/* Total da Liquidação */}
      <div style={{ background: '#28a745', color: 'white', padding: '25px', borderRadius: '12px', textAlign: 'center', marginBottom: '25px' }}>
        <h4 style={{ margin: '0 0 15px 0', fontSize: '1.3em' }}>💰 Total da Liquidação</h4>
        <p style={{ fontSize: '2.5em', fontWeight: 'bold', margin: '0' }}>
          R\$ {resultados.valor_total_liquidacao?.toFixed(2)}
        </p>
        <p style={{ margin: '10px 0 0 0', opacity: '0.9' }}>
          Data do cálculo: {new Date(resultados.data_calculo).toLocaleDateString('pt-BR')}
        </p>
      </div>
      
      <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#1565c0' }}>📋 Base Legal</h4>
        <ul style={{ margin: '0', paddingLeft: '20px', color: '#1565c0' }}>
          <li>Art. 509 CPC - Liquidação por cálculo do contador</li>
          <li>Art. 85 CPC - Honorários advocatícios (8% a 20%)</li>
          <li>Lei 6.899/81 - Correção monetária em débitos judiciais</li>
          <li>Art. 406 CC - Juros de mora de 1% ao mês</li>
        </ul>
      </div>
    </div>
  );

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
          <p><strong>Renda do alimentante:</strong> R\$ {resultados.renda_alimentante?.toFixed(2)}</p>
          <p><strong>Renda disponível (70%):</strong> R\$ {resultados.renda_disponivel?.toFixed(2)}</p>
          <p><strong>Percentual aplicado:</strong> {resultados.percentual_aplicado}</p>
        </div>
        
        <div style={{ background: '#fff3cd', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>👶 Filhos</h4>
          <p><strong>Número de filhos:</strong> {resultados.numero_filhos}</p>
          <p><strong>Valor por filho:</strong> R\$ {resultados.valor_por_filho?.toFixed(2)}</p>
        </div>
      </div>

      {/* Valor Total da Pensão */}
      <div style={{ background: '#17a2b8', color: 'white', padding: '25px', borderRadius: '12px', textAlign: 'center', marginBottom: '25px' }}>
        <h4 style={{ margin: '0 0 15px 0', fontSize: '1.3em' }}>💰 Valor Total da Pensão</h4>
        <p style={{ fontSize: '2.5em', fontWeight: 'bold', margin: '0' }}>
          R\$ {resultados.valor_total_pensao?.toFixed(2)}
        </p>
        <p style={{ margin: '10px 0 0 0', opacity: '0.9' }}>
          {resultados.observacao}
        </p>
      </div>
      
      <div style={{ background: '#fff3cd', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>⚠️ Observações Importantes</h4>
        <ul style={{ margin: '0', paddingLeft: '20px', color: '#856404' }}>
          <li>Valor sugerido baseado em critérios usuais da jurisprudência</li>
          <li>O juiz tem discricionariedade para fixar valor diferente</li>
          <li>Considerar necessidades específicas dos alimentandos</li>
          <li>Possibilidade de revisão mediante alteração das circunstâncias</li>
        </ul>
      </div>
      
      <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#1565c0' }}>📋 Base Legal</h4>
        <ul style={{ margin: '0', paddingLeft: '20px', color: '#1565c0' }}>
          <li>Art. 1.694 CC - Obrigação alimentar entre parentes</li>
          <li>Art. 1.695 CC - Critérios: necessidade + possibilidade</li>
          <li>Art. 1.699 CC - Fixação judicial dos alimentos</li>
          <li>Lei 5.478/68 - Lei de Alimentos</li>
        </ul>
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