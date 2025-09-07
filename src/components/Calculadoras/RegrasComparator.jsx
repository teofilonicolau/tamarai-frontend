// src/components/Calculadoras/RegrasComparator.jsx
import React from 'react';

const RegrasComparator = ({ resultados }) => {
  if (!resultados?.todas_regras) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        background: '#f8f9fa',
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h3>⏳ Aguardando cálculo...</h3>
        <p>Insira os dados para ver a análise das regras de transição</p>
      </div>
    );
  }

  const { melhor_regra, todas_regras, total_regras_elegiveis } = resultados;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Header com resumo */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '30px',
        borderRadius: '12px',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: '0 0 15px 0', fontSize: '2.2em' }}>
          📊 Análise EC 103/2019
        </h1>
        <div style={{ fontSize: '1.1em', opacity: '0.9' }}>
          <strong>{total_regras_elegiveis}</strong> de <strong>4</strong> regras elegíveis
          {total_regras_elegiveis === 0 && " • Veja a mais próxima abaixo"}
        </div>
      </div>

      {/* Melhor regra destacada */}
      {melhor_regra && (
        <div style={{
          background: melhor_regra.elegivel ? '#d4edda' : '#fff3cd',
          border: `2px solid ${melhor_regra.elegivel ? '#28a745' : '#ffc107'}`,
          borderRadius: '12px',
          padding: '25px',
          marginBottom: '30px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
            <span style={{ fontSize: '2em', marginRight: '15px' }}>
              {melhor_regra.elegivel ? '🏆' : '🎯'}
            </span>
            <div>
              <h2 style={{ 
                margin: '0', 
                color: melhor_regra.elegivel ? '#155724' : '#856404',
                fontSize: '1.5em'
              }}>
                {melhor_regra.elegivel ? 'ELEGÍVEL AGORA!' : 'MAIS PRÓXIMA'}
              </h2>
              <h3 style={{ 
                margin: '5px 0 0 0', 
                color: melhor_regra.elegivel ? '#155724' : '#856404',
                fontWeight: 'normal'
              }}>
                {melhor_regra.nome}
              </h3>
            </div>
          </div>
          
          <div style={{ 
            background: 'rgba(255,255,255,0.7)', 
            padding: '15px', 
            borderRadius: '8px',
            fontSize: '1.1em'
          }}>
            <strong>💡 Estratégia:</strong> {melhor_regra.observacao}
            {melhor_regra.observacao_adicional && (
              <div style={{ marginTop: '8px', fontStyle: 'italic' }}>
                {melhor_regra.observacao_adicional}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grid de todas as regras */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {todas_regras.map((regra, index) => {
          const isElegivel = regra.elegivel;
          const isMelhor = melhor_regra && regra.regra === melhor_regra.regra;
          
          return (
            <div 
              key={index}
              style={{
                background: isElegivel ? '#d4edda' : '#ffffff',
                border: `2px solid ${
                  isMelhor ? '#007bff' : 
                  isElegivel ? '#28a745' : '#dee2e6'
                }`,
                borderRadius: '12px',
                padding: '20px',
                position: 'relative',
                boxShadow: isMelhor ? '0 4px 12px rgba(0,123,255,0.3)' : '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              {/* Badge de status */}
              <div style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: isElegivel ? '#28a745' : '#6c757d',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.8em',
                fontWeight: 'bold'
              }}>
                {isElegivel ? '✅ ELEGÍVEL' : '⏳ PENDENTE'}
              </div>

              {/* Título da regra */}
              <h3 style={{ 
                margin: '0 0 15px 0',
                color: isElegivel ? '#155724' : '#495057',
                fontSize: '1.2em',
                paddingRight: '100px'
              }}>
                {regra.nome}
              </h3>

              {/* Requisitos */}
              <div style={{ marginBottom: '15px' }}>
                {regra.idade_atual !== undefined && (
                  <div style={{ marginBottom: '8px' }}>
                    <strong>👤 Idade:</strong> {regra.idade_atual} anos
                    {regra.idade_faltante > 0 && (
                      <span style={{ color: '#dc3545', marginLeft: '10px' }}>
                        (faltam {regra.idade_faltante})
                      </span>
                    )}
                  </div>
                )}
                
                {regra.tempo_atual !== undefined && (
                  <div style={{ marginBottom: '8px' }}>
                    <strong>📅 Contribuição:</strong> {regra.tempo_atual} anos
                    {regra.tempo_ainda_faltante > 0 && (
                      <span style={{ color: '#dc3545', marginLeft: '10px' }}>
                        (faltam {regra.tempo_ainda_faltante})
                      </span>
                    )}
                  </div>
                )}
                
                {regra.pontos_atuais !== undefined && (
                  <div style={{ marginBottom: '8px' }}>
                    <strong>🎯 Pontos:</strong> {regra.pontos_atuais}/{regra.pontos_exigidos}
                    {regra.pontos_faltantes > 0 && (
                      <span style={{ color: '#dc3545', marginLeft: '10px' }}>
                        (faltam {regra.pontos_faltantes})
                      </span>
                    )}
                  </div>
                )}
                
                {regra.pedagogio_meses !== undefined && regra.pedagogio_meses > 0 && (
                  <div style={{ marginBottom: '8px' }}>
                    <strong>⏰ Pedágio:</strong> {regra.pedagogio_meses} meses
                  </div>
                )}
              </div>

              {/* Barra de progresso visual */}
              {!isElegivel && (
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ 
                    background: '#e9ecef', 
                    borderRadius: '10px', 
                    height: '8px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      background: '#007bff',
                      height: '100%',
                      width: `${Math.max(10, 100 - (regra.pontos_faltantes || regra.idade_faltante || regra.tempo_ainda_faltante || 0) * 10)}%`,
                      borderRadius: '10px',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                  <small style={{ color: '#6c757d', fontSize: '0.8em' }}>
                    Progresso para elegibilidade
                  </small>
                </div>
              )}

              {/* Observação */}
              <div style={{ 
                background: 'rgba(0,0,0,0.05)', 
                padding: '10px', 
                borderRadius: '6px',
                fontSize: '0.9em',
                color: '#495057'
              }}>
                {regra.observacao}
              </div>
            </div>
          );
        })}
      </div>

      {/* Resumo estratégico */}
      <div style={{
        background: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '12px',
        padding: '25px'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#495057' }}>
          💡 Resumo Estratégico
        </h3>
        
        {total_regras_elegiveis > 0 ? (
          <div style={{ color: '#155724' }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '1.1em' }}>
              <strong>Parabéns!</strong> Você já pode se aposentar por <strong>{total_regras_elegiveis}</strong> regra(s).
            </p>
            <p style={{ margin: '0' }}>
              A <strong>{melhor_regra?.nome}</strong> é a mais vantajosa no momento.
            </p>
          </div>
        ) : (
          <div style={{ color: '#856404' }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '1.1em' }}>
              Ainda não elegível, mas a <strong>{melhor_regra?.nome}</strong> é a mais próxima.
            </p>
            <p style={{ margin: '0' }}>
              Continue contribuindo e monitore as regras de transição.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegrasComparator;