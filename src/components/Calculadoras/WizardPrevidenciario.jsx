// src/components/Calculadoras/WizardPrevidenciario.jsx
import React, { useState } from 'react';

const WizardPrevidenciario = ({ onCalcular, loading }) => {
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [dados, setDados] = useState({
    sexo: '',
    idade_atual: '',
    tempo_contribuicao_atual: '',
    tempo_contribuicao_em_13_11_2019: ''
  });

  const [erros, setErros] = useState({});

  const validarEtapa = (etapa) => {
    const novosErros = {};

    if (etapa === 1) {
      if (!dados.sexo) novosErros.sexo = 'Selecione o sexo';
      if (!dados.idade_atual) novosErros.idade_atual = 'Informe a idade';
      else if (dados.idade_atual < 18 || dados.idade_atual > 100) {
        novosErros.idade_atual = 'Idade deve estar entre 18 e 100 anos';
      }
    }

    if (etapa === 2) {
      if (!dados.tempo_contribuicao_atual) {
        novosErros.tempo_contribuicao_atual = 'Informe o tempo de contribuição atual';
      } else if (dados.tempo_contribuicao_atual < 0 || dados.tempo_contribuicao_atual > 50) {
        novosErros.tempo_contribuicao_atual = 'Tempo deve estar entre 0 e 50 anos';
      }

      if (!dados.tempo_contribuicao_em_13_11_2019) {
        novosErros.tempo_contribuicao_em_13_11_2019 = 'Informe o tempo em 13/11/2019';
      } else if (dados.tempo_contribuicao_em_13_11_2019 > dados.tempo_contribuicao_atual) {
        novosErros.tempo_contribuicao_em_13_11_2019 = 'Não pode ser maior que o tempo atual';
      }
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const proximaEtapa = () => {
    if (validarEtapa(etapaAtual)) {
      setEtapaAtual(etapaAtual + 1);
    }
  };

  const etapaAnterior = () => {
    setEtapaAtual(etapaAtual - 1);
    setErros({});
  };

  const handleSubmit = () => {
    if (validarEtapa(2)) {
      const dadosParaCalcular = {
        ...dados,
        idade_atual: parseInt(dados.idade_atual),
        tempo_contribuicao_atual: parseInt(dados.tempo_contribuicao_atual),
        tempo_contribuicao_em_13_11_2019: parseInt(dados.tempo_contribuicao_em_13_11_2019)
      };
      onCalcular(dadosParaCalcular);
    }
  };

  const renderEtapa1 = () => (
    <div style={{ padding: '30px' }}>
      <h2 style={{ color: '#495057', marginBottom: '20px' }}>
        👤 Dados Pessoais
      </h2>
      
      <div style={{ marginBottom: '25px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '8px', 
          fontWeight: 'bold',
          color: '#495057'
        }}>
          Sexo:
        </label>
        <div style={{ display: 'flex', gap: '15px' }}>
          {['masculino', 'feminino'].map(opcao => (
            <label key={opcao} style={{ 
              display: 'flex', 
              alignItems: 'center',
              cursor: 'pointer',
              padding: '10px 15px',
              border: `2px solid ${dados.sexo === opcao ? '#007bff' : '#dee2e6'}`,
              borderRadius: '8px',
              background: dados.sexo === opcao ? '#e3f2fd' : '#ffffff'
            }}>
              <input
                type="radio"
                name="sexo"
                value={opcao}
                checked={dados.sexo === opcao}
                onChange={(e) => setDados({...dados, sexo: e.target.value})}
                style={{ marginRight: '8px' }}
              />
              {opcao === 'masculino' ? '👨 Masculino' : '👩 Feminino'}
            </label>
          ))}
        </div>
        {erros.sexo && (
          <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '5px' }}>
            {erros.sexo}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '25px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '8px', 
          fontWeight: 'bold',
          color: '#495057'
        }}>
          Idade atual:
        </label>
        <input
          type="number"
          value={dados.idade_atual}
          onChange={(e) => setDados({...dados, idade_atual: e.target.value})}
          placeholder="Ex: 58"
          style={{
            width: '100%',
            padding: '12px',
            border: `2px solid ${erros.idade_atual ? '#dc3545' : '#dee2e6'}`,
            borderRadius: '8px',
            fontSize: '1em'
          }}
        />
        {erros.idade_atual && (
          <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '5px' }}>
            {erros.idade_atual}
          </div>
        )}
      </div>
    </div>
  );

  const renderEtapa2 = () => (
    <div style={{ padding: '30px' }}>
      <h2 style={{ color: '#495057', marginBottom: '20px' }}>
        📅 Tempo de Contribuição
      </h2>
      
      <div style={{ marginBottom: '25px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '8px', 
          fontWeight: 'bold',
          color: '#495057'
        }}>
          Tempo de contribuição atual (anos):
        </label>
        <input
          type="number"
          value={dados.tempo_contribuicao_atual}
          onChange={(e) => setDados({...dados, tempo_contribuicao_atual: e.target.value})}
          placeholder="Ex: 32"
          style={{
            width: '100%',
            padding: '12px',
            border: `2px solid ${erros.tempo_contribuicao_atual ? '#dc3545' : '#dee2e6'}`,
            borderRadius: '8px',
            fontSize: '1em'
          }}
        />
        {erros.tempo_contribuicao_atual && (
          <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '5px' }}>
            {erros.tempo_contribuicao_atual}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '25px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '8px', 
          fontWeight: 'bold',
          color: '#495057'
        }}>
          Tempo de contribuição em 13/11/2019 (anos):
        </label>
        <input
          type="number"
          value={dados.tempo_contribuicao_em_13_11_2019}
          onChange={(e) => setDados({...dados, tempo_contribuicao_em_13_11_2019: e.target.value})}
          placeholder="Ex: 28"
          style={{
            width: '100%',
            padding: '12px',
            border: `2px solid ${erros.tempo_contribuicao_em_13_11_2019 ? '#dc3545' : '#dee2e6'}`,
            borderRadius: '8px',
            fontSize: '1em'
          }}
        />
        {erros.tempo_contribuicao_em_13_11_2019 && (
          <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '5px' }}>
            {erros.tempo_contribuicao_em_13_11_2019}
          </div>
        )}
        <div style={{ 
          fontSize: '0.9em', 
          color: '#6c757d', 
          marginTop: '5px',
          fontStyle: 'italic'
        }}>
          💡 Data da promulgação da EC 103/2019 (necessário para calcular pedágios)
        </div>
      </div>
    </div>
  );

  const renderEtapa3 = () => (
    <div style={{ padding: '30px', textAlign: 'center' }}>
      <h2 style={{ color: '#495057', marginBottom: '20px' }}>
        ✅ Confirmar Dados
      </h2>
      
      <div style={{ 
        background: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '8px',
        textAlign: 'left',
        marginBottom: '25px'
      }}>
        <h4>📋 Resumo dos dados informados:</h4>
        <ul style={{ margin: '15px 0', paddingLeft: '20px' }}>
          <li><strong>Sexo:</strong> {dados.sexo}</li>
          <li><strong>Idade atual:</strong> {dados.idade_atual} anos</li>
          <li><strong>Tempo de contribuição atual:</strong> {dados.tempo_contribuicao_atual} anos</li>
          <li><strong>Tempo em 13/11/2019:</strong> {dados.tempo_contribuicao_em_13_11_2019} anos</li>
        </ul>
      </div>

      <div style={{ 
        background: '#e3f2fd', 
        padding: '15px', 
        borderRadius: '8px',
        marginBottom: '25px'
      }}>
        <p style={{ margin: '0', color: '#1565c0' }}>
          🎯 <strong>Pronto para calcular!</strong><br/>
          Clique em "Calcular Regras" para ver sua análise completa da EC 103/2019
        </p>
      </div>
    </div>
  );

  return (
    <div style={{ 
      background: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #dee2e6',
      marginBottom: '30px',
      overflow: 'hidden'
    }}>
      {/* Indicador de progresso */}
      <div style={{ 
        background: '#f8f9fa', 
        padding: '20px',
        borderBottom: '1px solid #dee2e6'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {[1, 2, 3].map(etapa => (
            <div key={etapa} style={{ 
              display: 'flex', 
              alignItems: 'center',
              color: etapaAtual >= etapa ? '#007bff' : '#6c757d'
            }}>
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: etapaAtual >= etapa ? '#007bff' : '#dee2e6',
                color: etapaAtual >= etapa ? 'white' : '#6c757d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                marginRight: '10px'
              }}>
                {etapaAtual > etapa ? '✓' : etapa}
              </div>
              <span style={{ fontWeight: etapaAtual === etapa ? 'bold' : 'normal' }}>
                {etapa === 1 && 'Dados Pessoais'}
                {etapa === 2 && 'Contribuição'}
                {etapa === 3 && 'Confirmar'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Conteúdo da etapa */}
      <div>
        {etapaAtual === 1 && renderEtapa1()}
        {etapaAtual === 2 && renderEtapa2()}
        {etapaAtual === 3 && renderEtapa3()}
      </div>

      {/* Botões de navegação */}
      <div style={{ 
        padding: '20px 30px',
        borderTop: '1px solid #dee2e6',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <button
          onClick={etapaAnterior}
          disabled={etapaAtual === 1}
          style={{
            padding: '12px 24px',
            border: '1px solid #6c757d',
            background: 'transparent',
            color: '#6c757d',
            borderRadius: '6px',
            cursor: etapaAtual === 1 ? 'not-allowed' : 'pointer',
            opacity: etapaAtual === 1 ? 0.5 : 1
          }}
        >
          ← Anterior
        </button>

        {etapaAtual < 3 ? (
          <button
            onClick={proximaEtapa}
            style={{
              padding: '12px 24px',
              border: 'none',
              background: '#007bff',
              color: 'white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Próximo →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: '12px 24px',
              border: 'none',
              background: loading ? '#6c757d' : '#28a745',
              color: 'white',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            {loading ? '⏳ Calculando...' : '🧮 Calcular Regras'}
          </button>
        )}
      </div>
    </div>
  );
};

export default WizardPrevidenciario;