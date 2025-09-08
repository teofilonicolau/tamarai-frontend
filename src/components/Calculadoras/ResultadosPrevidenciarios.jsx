// src/components/Calculadoras/ResultadosPrevidenciarios.jsx
import React from 'react';

const ResultadosPrevidenciarios = ({ tipo, resultados }) => {
  const renderTempoEspecial = () => (
    <div style={{
      background: 'white',
      padding: '30px',
      borderRadius: '12px',
      border: '1px solid #dee2e6'
    }}>
      <h3 style={{ color: '#667eea', marginBottom: '25px', textAlign: 'center' }}>
        ⚡ Resultado - Conversão de Tempo Especial
      </h3>
      
      {/* Resumo dos Tempos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
        <div style={{ background: '#e8f5e8', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#155724' }}>🌾 Tempo Rural</h4>
          <p style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#28a745' }}>
            {resultados.tempo_rural_meses} meses
          </p>
        </div>
        
        <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#1565c0' }}>🏢 Tempo Urbano</h4>
          <p style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#17a2b8' }}>
            {resultados.tempo_urbano_meses} meses
          </p>
        </div>
        
        <div style={{ background: '#fff3cd', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>⚡ Tempo Especial</h4>
          <p style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#ffc107' }}>
            {resultados.tempo_especial_formatado}
          </p>
        </div>
      </div>

      {/* Conversão */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
        <div style={{ background: '#f8d7da', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#721c24' }}>👨 Conversão para Homem</h4>
          <p><strong>Tempo especial convertido:</strong> {resultados.tempo_especial_convertido_homem} meses</p>
          <p><strong>Total geral:</strong> {resultados.total_formatado_homem}</p>
        </div>
        
        <div style={{ background: '#f8d7da', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#721c24' }}>👩 Conversão para Mulher</h4>
          <p><strong>Tempo especial convertido:</strong> {resultados.tempo_especial_convertido_mulher} meses</p>
          <p><strong>Total geral:</strong> {resultados.total_formatado_mulher}</p>
        </div>
      </div>

      {/* Período de Exposição */}
      {resultados.data_inicio_atividade_especial && (
        <div style={{ background: '#e8f5e8', padding: '15px', borderRadius: '8px', marginBottom: '25px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#155724' }}>�� Período de Exposição</h4>
          <p><strong>Data de início:</strong> {new Date(resultados.data_inicio_atividade_especial).toLocaleDateString('pt-BR')}</p>
          <p><strong>Período de exposição:</strong> {resultados.periodo_exposicao_formatado}</p>
        </div>
      )}

      {/* Validação */}
      <div style={{ 
        background: resultados.validacao?.tempo_valido ? '#e8f5e8' : '#f8d7da', 
        padding: '15px', 
        borderRadius: '8px',
        marginBottom: '15px'
      }}>
        <h4 style={{ 
          margin: '0 0 10px 0', 
          color: resultados.validacao?.tempo_valido ? '#155724' : '#721c24' 
        }}>
          ✅ Validação
        </h4>
        <p><strong>Tempo válido:</strong> {resultados.validacao?.tempo_valido ? 'Sim' : 'Não'}</p>
        <p><strong>Limite máximo:</strong> {resultados.validacao?.limite_maximo_anos} anos</p>
        {resultados.validacao?.alertas?.length > 0 && (
          <div>
            <strong>Alertas:</strong>
            <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
              {resultados.validacao.alertas.map((alerta, index) => (
                <li key={index}>{alerta}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#1565c0' }}>📋 Informações Legais</h4>
        <ul style={{ margin: '0', paddingLeft: '20px', color: '#1565c0' }}>
          <li>Conversão baseada na Lei 8.213/91 e Decreto 3.048/99</li>
          <li>Fator de conversão: 1,4 para homens e 1,2 para mulheres</li>
          <li>Limite máximo de 25 anos de atividade especial</li>
          <li>Necessária comprovação através de PPP ou LTCAT</li>
        </ul>
      </div>
    </div>
  );

  const renderPeriodoGraca = () => (
    <div style={{
      background: 'white',
      padding: '30px',
      borderRadius: '12px',
      border: '1px solid #dee2e6'
    }}>
      <h3 style={{ color: '#667eea', marginBottom: '25px', textAlign: 'center' }}>
        📅 Resultado - Período de Graça
      </h3>
      
      {/* Status Principal */}
      <div style={{ 
        background: resultados.tem_periodo_graca ? '#e8f5e8' : '#f8d7da',
        color: resultados.tem_periodo_graca ? '#155724' : '#721c24',
        padding: '25px', 
        borderRadius: '12px', 
        textAlign: 'center',
        marginBottom: '25px'
      }}>
        <h4 style={{ margin: '0 0 15px 0', fontSize: '1.3em' }}>
          {resultados.tem_periodo_graca ? '✅ MANTÉM QUALIDADE' : '❌ PERDEU QUALIDADE'}
        </h4>
        <p style={{ fontSize: '1.1em', margin: '0' }}>
          {resultados.observacao}
        </p>
      </div>

      {/* Detalhes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
        <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#1565c0' }}>📅 Dias sem Contribuir</h4>
          <p style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#17a2b8' }}>
            {resultados.dias_sem_contribuir}
          </p>
        </div>
        
        {resultados.tem_periodo_graca && (
          <div style={{ background: '#e8f5e8', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#155724' }}>⏰ Dias Restantes</h4>
            <p style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#28a745' }}>
              {resultados.dias_restantes}
            </p>
          </div>
        )}
        
        <div style={{ 
          background: resultados.periodo_graca_valido ? '#e8f5e8' : '#f8d7da', 
          padding: '15px', 
          borderRadius: '8px', 
          textAlign: 'center' 
        }}>
          <h4 style={{ 
            margin: '0 0 10px 0', 
            color: resultados.periodo_graca_valido ? '#155724' : '#721c24' 
          }}>
            📋 Status do Período
          </h4>
          <p style={{ 
            fontSize: '1.2em', 
            fontWeight: 'bold', 
            color: resultados.periodo_graca_valido ? '#28a745' : '#dc3545' 
          }}>
            {resultados.periodo_graca_valido ? 'VÁLIDO' : 'INVÁLIDO'}
          </p>
        </div>
      </div>
      
      <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#1565c0' }}>📋 Informações sobre Período de Graça</h4>
        <ul style={{ margin: '0', paddingLeft: '20px', color: '#1565c0' }}>
          <li><strong>Segurado comum:</strong> 12 meses após última contribuição</li>
          <li><strong>Segurado especial:</strong> Não perde qualidade de segurado</li>
          <li><strong>Prorrogação:</strong> Possível em casos específicos (desemprego, etc.)</li>
          <li><strong>Base legal:</strong> Art. 15 da Lei 8.213/91</li>
        </ul>
      </div>
    </div>
  );

  const renderRevisaoVidaToda = () => (
    <div style={{
      background: 'white',
      padding: '30px',
      borderRadius: '12px',
      border: '1px solid #dee2e6'
    }}>
      <h3 style={{ color: '#667eea', marginBottom: '25px', textAlign: 'center' }}>
        🔄 Resultado - Revisão da Vida Toda
      </h3>
      
      {/* Status da Revisão */}
      <div style={{ 
        background: resultados.vantajosa ? '#e8f5e8' : '#f8d7da',
        color: resultados.vantajosa ? '#155724' : '#721c24',
        padding: '25px', 
        borderRadius: '12px', 
        textAlign: 'center',
        marginBottom: '25px'
      }}>
        <h4 style={{ margin: '0 0 15px 0', fontSize: '1.3em' }}>
          {resultados.vantajosa ? '✅ REVISÃO VANTAJOSA' : '❌ REVISÃO NÃO VANTAJOSA'}
        </h4>
        <p style={{ fontSize: '1.1em', margin: '0' }}>
          {resultados.observacao}
        </p>
      </div>

      {/* Comparação de Médias */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '25px' }}>
        <div style={{ background: '#fff3cd', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>�� Média Pós-1994</h4>
          <p style={{ fontSize: '1.3em', fontWeight: 'bold', color: '#ffc107' }}>
            R\$ {resultados.media_pos_1994?.toFixed(2)}
          </p>
        </div>
        
        <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#1565c0' }}>📊 Média Vida Toda</h4>
          <p style={{ fontSize: '1.3em', fontWeight: 'bold', color: '#17a2b8' }}>
            R\$ {resultados.media_vida_toda?.toFixed(2)}
          </p>
        </div>
        
        <div style={{ 
          background: resultados.diferenca_mensal >= 0 ? '#e8f5e8' : '#f8d7da', 
          padding: '15px', 
          borderRadius: '8px', 
          textAlign: 'center' 
        }}>
          <h4 style={{ 
            margin: '0 0 10px 0', 
            color: resultados.diferenca_mensal >= 0 ? '#155724' : '#721c24' 
          }}>
            📈 Diferença Mensal
          </h4>
          <p style={{ 
            fontSize: '1.3em', 
            fontWeight: 'bold', 
            color: resultados.diferenca_mensal >= 0 ? '#28a745' : '#dc3545' 
          }}>
            R\$ {Math.abs(resultados.diferenca_mensal)?.toFixed(2)}
            <br/>
            <span style={{ fontSize: '0.7em' }}>
              {resultados.diferenca_mensal >= 0 ? '(A MAIS)' : '(A MENOS)'}
            </span>
          </p>
        </div>
      </div>

      {/* Valor Devido */}
      {resultados.valor_devido_bruto > 0 && (
        <div style={{ background: '#e8f5e8', padding: '15px', borderRadius: '8px', marginBottom: '25px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#155724' }}>💰 Valor Devido (Estimativa)</h4>
          <p><strong>Meses desde DIB:</strong> {resultados.meses_desde_dib}</p>
          <p style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#28a745' }}>
            <strong>Valor bruto devido:</strong> R\$ {resultados.valor_devido_bruto?.toFixed(2)}
          </p>
        </div>
      )}
      
      <div style={{ background: '#fff3cd', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>⚠️ Observações Importantes</h4>
        <ul style={{ margin: '0', paddingLeft: '20px', color: '#856404' }}>
          <li>Análise baseada apenas nas médias salariais informadas</li>
          <li>Necessária análise jurídica completa antes do ajuizamento</li>
          <li>Sujeita à decadência de 10 anos (EC 103/2019)</li>
          <li>Considerar custos processuais e honorários advocatícios</li>
        </ul>
      </div>
      
      <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#1565c0' }}>📋 Base Legal</h4>
        <ul style={{ margin: '0', paddingLeft: '20px', color: '#1565c0' }}>
          <li>STF - RE 1.276.977 (Tema 1.102) - Revisão da Vida Toda</li>
          <li>Lei 8.213/91 - Cálculo do salário-de-benefício</li>
          <li>EC 103/2019 - Prazo decadencial de 10 anos</li>
          <li>Aplicável a benefícios concedidos após 29/11/1999</li>
        </ul>
      </div>
    </div>
  );

  switch (tipo) {
    case 'tempo-especial':
      return renderTempoEspecial();
    case 'periodo-graca':
      return renderPeriodoGraca();
    case 'revisao-vida-toda':
      return renderRevisaoVidaToda();
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

export default ResultadosPrevidenciarios;