// src/components/Calculadoras/ResultadosTrabalhistas.jsx
import React from 'react';

const ResultadosTrabalhistas = ({ tipo, resultados, dadosEntrada }) => {
  const renderHorasExtras = () => (
    <div style={{
      background: 'white',
      padding: '30px',
      borderRadius: '12px',
      border: '1px solid #dee2e6'
    }}>
      <h3 style={{ color: '#28a745', marginBottom: '25px', textAlign: 'center' }}>
        ⏰ Resultado - Horas Extras
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
        <div style={{ background: '#e8f5e8', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#155724' }}>📊 Resumo do Cálculo</h4>
          <p><strong>Horas extras diárias:</strong> {resultados.horas_extras_diarias}h</p>
          <p><strong>Total de horas extras:</strong> {resultados.total_horas_extras}h</p>
          <p><strong>Adicional aplicado:</strong> {resultados.adicional_aplicado}</p>
        </div>
        
        <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#1565c0' }}>💰 Valores</h4>
          <p><strong>Valor hora normal:</strong> R$ {resultados.valor_hora_normal?.toFixed(2)}</p>
          <p><strong>Valor hora extra:</strong> R$ {resultados.valor_hora_extra?.toFixed(2)}</p>
          <p style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#28a745' }}>
            <strong>Valor total:</strong> R$ {resultados.valor_total?.toFixed(2)}
          </p>
        </div>
      </div>
      
      <div style={{ background: '#fff3cd', padding: '15px', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>⚠️ Observações Importantes</h4>
        <ul style={{ margin: '0', paddingLeft: '20px', color: '#856404' }}>
          <li>Valor calculado com base no adicional mínimo de 50% (CLT)</li>
          <li>Considere reflexos em férias, 13º salário e FGTS</li>
          <li>Verifique convenção coletiva para percentuais superiores</li>
        </ul>
      </div>
    </div>
  );

  const renderVerbasRescisorias = () => (
    <div style={{
      background: 'white',
      padding: '30px',
      borderRadius: '12px',
      border: '1px solid #dee2e6'
    }}>
      <h3 style={{ color: '#28a745', marginBottom: '25px', textAlign: 'center' }}>
        💼 Resultado - Verbas Rescisórias
      </h3>
      
      {/* Tempo de Serviço */}
      <div style={{ background: '#e8f5e8', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#155724' }}>⏱️ Tempo de Serviço</h4>
        <p style={{ fontSize: '1.1em', fontWeight: 'bold' }}>
          {resultados.tempo_servico?.anos} anos, {resultados.tempo_servico?.meses} meses e {resultados.tempo_servico?.dias} dias
        </p>
        <p>Total: {resultados.tempo_servico?.total_dias} dias</p>
      </div>

      {/* Verbas Detalhadas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px', marginBottom: '25px' }}>
        {Object.entries(resultados.verbas_detalhadas || {}).map(([verba, dados]) => (
          <div key={verba} style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
            <h5 style={{ margin: '0 0 10px 0', color: '#495057', textTransform: 'capitalize' }}>
              {verba.replace(/_/g, ' ')}
            </h5>
            {typeof dados === 'object' && dados.valor_total && (
              <>
                <p style={{ fontSize: '1.1em', fontWeight: 'bold', color: '#28a745' }}>
                  R$ {dados.valor_total?.toFixed(2)}
                </p>
                <p style={{ fontSize: '0.9em', color: '#6c757d' }}>
                  {dados.observacao}
                </p>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Total */}
      <div style={{ background: '#28a745', color: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
        <h4 style={{ margin: '0 0 10px 0' }}>💰 Total das Verbas Rescisórias</h4>
        <p style={{ fontSize: '2em', fontWeight: 'bold', margin: '0' }}>
          R$ {resultados.total_verbas_rescisorias?.toFixed(2)}
        </p>
      </div>
    </div>
  );

  const renderAdicionalNoturno = () => (
    <div style={{
      background: 'white',
      padding: '30px',
      borderRadius: '12px',
      border: '1px solid #dee2e6'
    }}>
      <h3 style={{ color: '#28a745', marginBottom: '25px', textAlign: 'center' }}>
        �� Resultado - Adicional Noturno
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
        <div style={{ background: '#e8f5e8', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#155724' }}>📊 Cálculo</h4>
          <p><strong>Horas noturnas/dia:</strong> {resultados.horas_noturnas_diarias}h</p>
          <p><strong>Total horas noturnas:</strong> {resultados.total_horas_noturnas}h</p>
          <p><strong>Percentual adicional:</strong> {resultados.percentual_adicional}</p>
        </div>
        
        <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#1565c0' }}>💰 Valores</h4>
          <p><strong>Valor hora normal:</strong> R$ {resultados.valor_hora_normal?.toFixed(2)}</p>
          <p><strong>Valor hora noturna:</strong> R$ {resultados.valor_hora_noturna?.toFixed(2)}</p>
          <p style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#28a745' }}>
            <strong>Valor adicional:</strong> R$ {resultados.valor_adicional?.toFixed(2)}
          </p>
        </div>
      </div>
      
      <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#1565c0' }}>📋 Informações Legais</h4>
        <ul style={{ margin: '0', paddingLeft: '20px', color: '#1565c0' }}>
          <li>Horário noturno: 22h às 5h (CLT, art. 73)</li>
          <li>Hora noturna reduzida: 52min30s</li>
          <li>Adicional mínimo: 20% sobre hora normal</li>
        </ul>
      </div>
    </div>
  );

  switch (tipo) {
    case 'horas-extras':
      return renderHorasExtras();
    case 'verbas-rescisorias':
      return renderVerbasRescisorias();
    case 'adicional-noturno':
      return renderAdicionalNoturno();
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

export default ResultadosTrabalhistas;