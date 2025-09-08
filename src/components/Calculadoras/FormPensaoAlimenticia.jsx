// src/components/Calculadoras/FormPensaoAlimenticia.jsx
import React, { useState } from 'react';

const FormPensaoAlimenticia = ({ onCalcular, loading }) => {
  const [dados, setDados] = useState({
    renda_alimentante: '',
    numero_filhos: '',
    percentual_sugerido: '0.30'
  });

  const [erros, setErros] = useState({});

  const percentuaisSugeridos = [
    { value: '0.20', label: '20% - Mínimo Legal', descricao: 'Para casos de renda baixa' },
    { value: '0.25', label: '25% - Moderado', descricao: 'Situação intermediária' },
    { value: '0.30', label: '30% - Padrão', descricao: 'Mais comum na jurisprudência' },
    { value: '0.35', label: '35% - Elevado', descricao: 'Para múltiplos filhos' },
    { value: '0.40', label: '40% - Máximo', descricao: 'Casos excepcionais' }
  ];

  const validarFormulario = () => {
    const novosErros = {};

    if (!dados.renda_alimentante || dados.renda_alimentante <= 0) {
      novosErros.renda_alimentante = 'Informe a renda do alimentante';
    }
    if (!dados.numero_filhos || dados.numero_filhos <= 0 || dados.numero_filhos > 10) {
      novosErros.numero_filhos = 'Informe o número de filhos (1-10)';
    }
    if (!dados.percentual_sugerido || dados.percentual_sugerido <= 0 || dados.percentual_sugerido > 0.5) {
      novosErros.percentual_sugerido = 'Percentual deve estar entre 1% e 50%';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const calcularPrevia = () => {
    if (dados.renda_alimentante && dados.numero_filhos && dados.percentual_sugerido) {
      const rendaDisponivel = dados.renda_alimentante * 0.70; // 70% da renda
      const valorPorFilho = (rendaDisponivel * dados.percentual_sugerido) / dados.numero_filhos;
      const valorTotal = valorPorFilho * dados.numero_filhos;
      
      return {
        rendaDisponivel: rendaDisponivel.toFixed(2),
        valorPorFilho: valorPorFilho.toFixed(2),
        valorTotal: valorTotal.toFixed(2),
        percentualEfetivo: ((valorTotal / dados.renda_alimentante) * 100).toFixed(1)
      };
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validarFormulario()) {
      const dadosParaCalcular = {
        renda_alimentante: parseFloat(dados.renda_alimentante),
        numero_filhos: parseInt(dados.numero_filhos),
        percentual_sugerido: parseFloat(dados.percentual_sugerido)
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
        👨‍👩‍👧‍👦 Cálculo de Pensão Alimentícia
      </h3>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
            💰 Renda Mensal do Alimentante (R$):
          </label>
          <input
            type="number"
            step="0.01"
            value={dados.renda_alimentante}
            onChange={(e) => setDados({...dados, renda_alimentante: e.target.value})}
            placeholder="Ex: 4500.00"
            style={{
              width: '100%',
              padding: '12px',
              border: `2px solid ${erros.renda_alimentante ? '#dc3545' : '#dee2e6'}`,
              borderRadius: '8px',
              fontSize: '1em'
            }}
          />
          {erros.renda_alimentante && (
            <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '5px' }}>
              {erros.renda_alimentante}
            </div>
          )}
          <div style={{ fontSize: '0.9em', color: '#6c757d', marginTop: '5px', fontStyle: 'italic' }}>
            💡 Considere renda líquida (salário + outras fontes)
          </div>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
            👶 Número de Filhos:
          </label>
          <input
            type="number"
            value={dados.numero_filhos}
            onChange={(e) => setDados({...dados, numero_filhos: e.target.value})}
            placeholder="Ex: 2"
            min="1"
            max="10"
            style={{
              width: '100%',
              padding: '12px',
              border: `2px solid ${erros.numero_filhos ? '#dc3545' : '#dee2e6'}`,
              borderRadius: '8px',
              fontSize: '1em'
            }}
          />
          {erros.numero_filhos && (
            <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '5px' }}>
              {erros.numero_filhos}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: 'bold', color: '#495057' }}>
            📊 Percentual Sugerido:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
            {percentuaisSugeridos.map(opcao => (
              <label key={opcao.value} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                padding: '12px 15px',
                border: `2px solid ${dados.percentual_sugerido === opcao.value ? '#17a2b8' : '#dee2e6'}`,
                borderRadius: '8px',
                background: dados.percentual_sugerido === opcao.value ? '#e3f2fd' : '#ffffff',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="radio"
                    name="percentual_sugerido"
                    value={opcao.value}
                    checked={dados.percentual_sugerido === opcao.value}
                    onChange={(e) => setDados({...dados, percentual_sugerido: e.target.value})}
                    style={{ marginRight: '12px' }}
                  />
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#495057' }}>
                      {opcao.label}
                    </div>
                    <div style={{ fontSize: '0.85em', color: '#6c757d' }}>
                      {opcao.descricao}
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>
          {erros.percentual_sugerido && (
            <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '8px' }}>
              {erros.percentual_sugerido}
            </div>
          )}
        </div>

        {/* Prévia do Cálculo */}
        {previa && (
          <div style={{
            background: '#e8f5e8',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '25px',
            border: '1px solid #28a745'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#155724' }}>
              📊 Prévia do Cálculo:
            </h4>
            <div style={{ color: '#155724', fontSize: '0.95em' }}>
              <p style={{ margin: '5px 0' }}>
                <strong>Renda disponível (70%):</strong> R$ {previa.rendaDisponivel}
              </p>
              <p style={{ margin: '5px 0' }}>
                <strong>Valor por filho:</strong> R$ {previa.valorPorFilho}
              </p>
              <p style={{ margin: '5px 0', fontWeight: 'bold', fontSize: '1.1em' }}>
                <strong>Valor total da pensão:</strong> R$ {previa.valorTotal}
              </p>
              <p style={{ margin: '5px 0', fontSize: '0.9em', fontStyle: 'italic' }}>
                📈 Percentual efetivo da renda: {previa.percentualEfetivo}%
              </p>
            </div>
          </div>
        )}

        {/* Informações Legais */}
        <div style={{
          background: '#e3f2fd',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '25px'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#1565c0' }}>
            📋 Informações Legais:
          </h4>
          <ul style={{ margin: '0', paddingLeft: '20px', color: '#1565c0', fontSize: '0.9em' }}>
            <li><strong>Base legal:</strong> Art. 1.694 e seguintes do Código Civil</li>
            <li><strong>Critérios:</strong> Necessidade do alimentando + Possibilidade do alimentante</li>
            <li><strong>Percentuais usuais:</strong> 20% a 30% da renda líquida</li>
            <li><strong>Revisão:</strong> Possível a qualquer tempo mediante alteração das circunstâncias</li>
            <li><strong>Desconto em folha:</strong> Preferencial para garantir pagamento</li>
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
            <li>Este cálculo é meramente orientativo</li>
            <li>O juiz tem discricionariedade para fixar o valor</li>
            <li>Considere outras despesas do alimentante (moradia, saúde, etc.)</li>
            <li>Analise a real necessidade dos alimentandos</li>
            <li>Verifique se há outros filhos ou dependentes</li>
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
          {loading ? '⏳ Calculando...' : '🧮 Calcular Pensão Alimentícia'}
        </button>
      </form>
    </div>
  );
};

export default FormPensaoAlimenticia;