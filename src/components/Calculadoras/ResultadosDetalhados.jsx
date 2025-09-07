// src/components/Calculadoras/ResultadosDetalhados.jsx
import React, { useState } from 'react';

const ResultadosDetalhados = ({ resultados, dadosEntrada }) => {
  const [abaSelecionada, setAbaSelecionada] = useState('resumo');

  if (!resultados) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Nenhum resultado para exibir</p>
      </div>
    );
  }

  const { melhor_regra, todas_regras, total_regras_elegiveis } = resultados;

  const renderResumo = () => (
    <div style={{ padding: '20px' }}>
      <h3>📊 Resumo Executivo</h3>
      
      <div style={{ 
        background: '#f8f9fa', 
        padding: '15px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h4>👤 Dados do Segurado:</h4>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li><strong>Sexo:</strong> {dadosEntrada?.sexo || 'N/A'}</li>
          <li><strong>Idade atual:</strong> {dadosEntrada?.idade_atual || 'N/A'} anos</li>
          <li><strong>Tempo de contribuição:</strong> {dadosEntrada?.tempo_contribuicao_atual || 'N/A'} anos</li>
          <li><strong>Contribuição em 13/11/2019:</strong> {dadosEntrada?.tempo_contribuicao_em_13_11_2019 || 'N/A'} anos</li>
        </ul>
      </div>

      <div style={{ 
        background: total_regras_elegiveis > 0 ? '#d4edda' : '#fff3cd', 
        padding: '15px', 
        borderRadius: '8px',
        border: `1px solid ${total_regras_elegiveis > 0 ? '#c3e6cb' : '#ffeaa7'}`
      }}>
        <h4 style={{ color: total_regras_elegiveis > 0 ? '#155724' : '#856404' }}>
          🎯 Situação Atual:
        </h4>
        <p style={{ margin: '10px 0', fontSize: '1.1em' }}>
          {total_regras_elegiveis > 0 ? (
            <>✅ <strong>Elegível para aposentadoria</strong> por {total_regras_elegiveis} regra(s)</>
          ) : (
            <>⏳ <strong>Ainda não elegível</strong>, mas próximo da {melhor_regra?.nome}</>
          )}
        </p>
      </div>
    </div>
  );

  const renderDetalhes = () => (
    <div style={{ padding: '20px' }}>
      <h3>🔍 Análise Detalhada por Regra</h3>
      
      {todas_regras.map((regra, index) => (
        <div key={index} style={{
          background: '#ffffff',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '15px'
        }}>
          <h4 style={{ 
            color: regra.elegivel ? '#28a745' : '#495057',
            marginBottom: '15px'
          }}>
            {regra.elegivel ? '✅' : '⏳'} {regra.nome}
          </h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <strong>📋 Requisitos:</strong>
              <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                {regra.idade_minima && (
                  <li>Idade mínima: {regra.idade_minima} anos</li>
                )}
                {regra.tempo_minimo && (
                  <li>Tempo mínimo: {regra.tempo_minimo} anos</li>
                )}
                {regra.pontos_exigidos && (
                  <li>Pontos exigidos: {regra.pontos_exigidos}</li>
                )}
              </ul>
            </div>
            
            <div>
              <strong>📊 Situação Atual:</strong>
              <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                {regra.idade_atual && (
                  <li>Idade: {regra.idade_atual} anos</li>
                )}
                {regra.tempo_atual && (
                  <li>Tempo: {regra.tempo_atual} anos</li>
                )}
                {regra.pontos_atuais && (
                  <li>Pontos: {regra.pontos_atuais}</li>
                )}
              </ul>
            </div>
          </div>
          
          <div style={{ 
            marginTop: '15px', 
            padding: '10px', 
            background: '#f8f9fa',
            borderRadius: '6px',
            fontSize: '0.9em'
          }}>
            <strong>💡 Observação:</strong> {regra.observacao}
          </div>
        </div>
      ))}
    </div>
  );

  const renderCalculos = () => (
    <div style={{ padding: '20px' }}>
      <h3>🧮 Cálculos Técnicos</h3>
      
      <div style={{ 
        background: '#f8f9fa', 
        padding: '15px', 
        borderRadius: '8px',
        fontFamily: 'monospace',
        fontSize: '0.9em'
      }}>
        <h4>📊 Dados de Entrada:</h4>
        <pre style={{ margin: '10px 0', whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(dadosEntrada, null, 2)}
        </pre>
        
        <h4 style={{ marginTop: '20px' }}>📋 Resultado Completo:</h4>
        <pre style={{ margin: '10px 0', whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(resultados, null, 2)}
        </pre>
      </div>
    </div>
  );

  return (
    <div style={{ 
      background: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #dee2e6',
      marginTop: '20px'
    }}>
      {/* Abas */}
      <div style={{ 
        display: 'flex', 
        borderBottom: '1px solid #dee2e6',
        background: '#f8f9fa',
        borderRadius: '12px 12px 0 0'
      }}>
        {[
          { id: 'resumo', label: '📊 Resumo', icon: '📊' },
          { id: 'detalhes', label: '�� Detalhes', icon: '🔍' },
          { id: 'calculos', label: '🧮 Cálculos', icon: '🧮' }
        ].map(aba => (
          <button
            key={aba.id}
            onClick={() => setAbaSelecionada(aba.id)}
            style={{
              padding: '15px 25px',
              border: 'none',
              background: abaSelecionada === aba.id ? '#ffffff' : 'transparent',
              color: abaSelecionada === aba.id ? '#007bff' : '#6c757d',
              borderBottom: abaSelecionada === aba.id ? '2px solid #007bff' : 'none',
              cursor: 'pointer',
              fontSize: '1em',
              fontWeight: abaSelecionada === aba.id ? 'bold' : 'normal',
              transition: 'all 0.3s ease'
            }}
          >
            {aba.label}
          </button>
        ))}
      </div>

      {/* Conteúdo das abas */}
      <div>
        {abaSelecionada === 'resumo' && renderResumo()}
        {abaSelecionada === 'detalhes' && renderDetalhes()}
        {abaSelecionada === 'calculos' && renderCalculos()}
      </div>
    </div>
  );
};

export default ResultadosDetalhados;