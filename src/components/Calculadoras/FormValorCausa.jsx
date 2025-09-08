// src/components/Calculadoras/FormValorCausa.jsx
import React, { useState } from 'react';

const FormValorCausa = ({ onCalcular, loading }) => {
  const [dados, setDados] = useState({
    tipo_acao: 'indenizatoria',
    valor_pretendido: '',
    tem_danos_morais: false,
    valor_danos_morais: '',
    tem_danos_materiais: false,
    valor_danos_materiais: '',
    tem_lucros_cessantes: false,
    valor_lucros_cessantes: '',
    tem_pensao: false,
    valor_pensao_mensal: '',
    idade_beneficiario: '',
    expectativa_vida: 75
  });

  const [erros, setErros] = useState({});

  const tiposAcao = [
    { value: 'indenizatoria', label: '💰 Ação Indenizatória', descricao: 'Danos morais e/ou materiais' },
    { value: 'cobranca', label: '�� Ação de Cobrança', descricao: 'Cobrança de valores' },
    { value: 'revisional', label: '📝 Ação Revisional', descricao: 'Revisão de contratos' },
    { value: 'declaratoria', label: '📋 Ação Declaratória', descricao: 'Declaração de direitos' },
    { value: 'execucao', label: '⚖️ Execução', descricao: 'Execução de título' },
    { value: 'cautelar', label: '🚨 Cautelar', descricao: 'Medida cautelar' }
  ];

  const validarFormulario = () => {
    const novosErros = {};

    if (dados.tem_danos_morais && (!dados.valor_danos_morais || parseFloat(dados.valor_danos_morais.replace(/[^\d,]/g, '').replace(',', '.')) <= 0)) {
      novosErros.valor_danos_morais = 'Informe o valor dos danos morais';
    }

    if (dados.tem_danos_materiais && (!dados.valor_danos_materiais || parseFloat(dados.valor_danos_materiais.replace(/[^\d,]/g, '').replace(',', '.')) <= 0)) {
      novosErros.valor_danos_materiais = 'Informe o valor dos danos materiais';
    }

    if (dados.tem_pensao && (!dados.valor_pensao_mensal || parseFloat(dados.valor_pensao_mensal.replace(/[^\d,]/g, '').replace(',', '.')) <= 0)) {
      novosErros.valor_pensao_mensal = 'Informe o valor da pensão mensal';
    }

    if (dados.tem_pensao && (!dados.idade_beneficiario || parseInt(dados.idade_beneficiario) <= 0 || parseInt(dados.idade_beneficiario) > 100)) {
      novosErros.idade_beneficiario = 'Informe uma idade válida (1-100 anos)';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const formatarMoeda = (valor) => {
    const numero = valor.replace(/\D/g, '');
    const valorFormatado = (parseFloat(numero) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
    return valorFormatado;
  };

  const handleValorChange = (campo, valor) => {
    const valorFormatado = formatarMoeda(valor);
    setDados({...dados, [campo]: valorFormatado});
  };

  const calcularValorTotal = () => {
    let total = 0;

    if (dados.valor_pretendido) {
      total += parseFloat(dados.valor_pretendido.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    }

    if (dados.tem_danos_morais && dados.valor_danos_morais) {
      total += parseFloat(dados.valor_danos_morais.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    }

    if (dados.tem_danos_materiais && dados.valor_danos_materiais) {
      total += parseFloat(dados.valor_danos_materiais.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    }

    if (dados.tem_lucros_cessantes && dados.valor_lucros_cessantes) {
      total += parseFloat(dados.valor_lucros_cessantes.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    }

    if (dados.tem_pensao && dados.valor_pensao_mensal && dados.idade_beneficiario) {
      const valorMensal = parseFloat(dados.valor_pensao_mensal.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
      const idade = parseInt(dados.idade_beneficiario) || 0;
      const anosRestantes = Math.max(0, dados.expectativa_vida - idade);
      const valorPensao = valorMensal * 12 * anosRestantes;
      total += valorPensao;
    }

    return total;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validarFormulario()) {
      const dadosParaCalcular = {
        ...dados,
        valor_total_calculado: calcularValorTotal(),
        valor_pretendido: dados.valor_pretendido ? parseFloat(dados.valor_pretendido.replace(/[^\d,]/g, '').replace(',', '.')) : 0,
        valor_danos_morais: dados.valor_danos_morais ? parseFloat(dados.valor_danos_morais.replace(/[^\d,]/g, '').replace(',', '.')) : 0,
        valor_danos_materiais: dados.valor_danos_materiais ? parseFloat(dados.valor_danos_materiais.replace(/[^\d,]/g, '').replace(',', '.')) : 0,
        valor_lucros_cessantes: dados.valor_lucros_cessantes ? parseFloat(dados.valor_lucros_cessantes.replace(/[^\d,]/g, '').replace(',', '.')) : 0,
        valor_pensao_mensal: dados.valor_pensao_mensal ? parseFloat(dados.valor_pensao_mensal.replace(/[^\d,]/g, '').replace(',', '.')) : 0
      };
      onCalcular(dadosParaCalcular);
    }
  };

  const valorTotal = calcularValorTotal();
  // LINHA REMOVIDA: const tipoSelecionado = tiposAcao.find(t => t.value === dados.tipo_acao);

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #dee2e6',
      padding: '30px'
    }}>
      <h3 style={{ color: '#495057', marginBottom: '25px', textAlign: 'center' }}>
        �� Cálculo do Valor da Causa
      </h3>

      <form onSubmit={handleSubmit}>
        {/* Tipo de Ação */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: 'bold', color: '#495057' }}>
            ⚖️ Tipo de Ação:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            {tiposAcao.map(tipo => (
              <label key={tipo.value} style={{
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                padding: '15px',
                border: `2px solid ${dados.tipo_acao === tipo.value ? '#17a2b8' : '#dee2e6'}`,
                borderRadius: '8px',
                background: dados.tipo_acao === tipo.value ? '#17a2b815' : '#ffffff',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                  <input
                    type="radio"
                    name="tipo_acao"
                    value={tipo.value}
                    checked={dados.tipo_acao === tipo.value}
                    onChange={(e) => setDados({...dados, tipo_acao: e.target.value})}
                    style={{ marginRight: '8px' }}
                  />
                  <span style={{ fontSize: '0.9em', fontWeight: 'bold' }}>
                    {tipo.label}
                  </span>
                </div>
                <span style={{ fontSize: '0.8em', color: '#6c757d' }}>
                  {tipo.descricao}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Valor Pretendido */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
            💰 Valor Pretendido Principal:
          </label>
          <input
            type="text"
            value={dados.valor_pretendido}
            onChange={(e) => handleValorChange('valor_pretendido', e.target.value)}
            placeholder="R$ 0,00"
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #dee2e6',
              borderRadius: '8px',
              fontSize: '1em'
            }}
          />
          <div style={{ fontSize: '0.9em', color: '#6c757d', marginTop: '5px', fontStyle: 'italic' }}>
            💡 Valor principal da pretensão
          </div>
        </div>

        {/* Danos Morais */}
        <div style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '25px'
        }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            marginBottom: '15px'
          }}>
            <input
              type="checkbox"
              checked={dados.tem_danos_morais}
              onChange={(e) => setDados({...dados, tem_danos_morais: e.target.checked})}
              style={{ marginRight: '10px' }}
            />
            <span style={{ fontWeight: 'bold', color: '#495057' }}>
              😢 Incluir Danos Morais
            </span>
          </label>

          {dados.tem_danos_morais && (
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
                Valor dos Danos Morais:
              </label>
              <input
                type="text"
                value={dados.valor_danos_morais}
                onChange={(e) => handleValorChange('valor_danos_morais', e.target.value)}
                placeholder="R$ 0,00"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `2px solid ${erros.valor_danos_morais ? '#dc3545' : '#dee2e6'}`,
                  borderRadius: '8px',
                  fontSize: '1em'
                }}
              />
              {erros.valor_danos_morais && (
                <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '5px' }}>
                  {erros.valor_danos_morais}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Danos Materiais */}
        <div style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '25px'
        }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            marginBottom: '15px'
          }}>
            <input
              type="checkbox"
              checked={dados.tem_danos_materiais}
              onChange={(e) => setDados({...dados, tem_danos_materiais: e.target.checked})}
              style={{ marginRight: '10px' }}
            />
            <span style={{ fontWeight: 'bold', color: '#495057' }}>
              🏠 Incluir Danos Materiais
            </span>
          </label>

          {dados.tem_danos_materiais && (
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
                Valor dos Danos Materiais:
              </label>
              <input
                type="text"
                value={dados.valor_danos_materiais}
                onChange={(e) => handleValorChange('valor_danos_materiais', e.target.value)}
                placeholder="R$ 0,00"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `2px solid ${erros.valor_danos_materiais ? '#dc3545' : '#dee2e6'}`,
                  borderRadius: '8px',
                  fontSize: '1em'
                }}
              />
              {erros.valor_danos_materiais && (
                <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '5px' }}>
                  {erros.valor_danos_materiais}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Lucros Cessantes */}
        <div style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '25px'
        }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            marginBottom: '15px'
          }}>
            <input
              type="checkbox"
              checked={dados.tem_lucros_cessantes}
              onChange={(e) => setDados({...dados, tem_lucros_cessantes: e.target.checked})}
              style={{ marginRight: '10px' }}
            />
            <span style={{ fontWeight: 'bold', color: '#495057' }}>
              �� Incluir Lucros Cessantes
            </span>
          </label>

          {dados.tem_lucros_cessantes && (
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
                Valor dos Lucros Cessantes:
              </label>
              <input
                type="text"
                value={dados.valor_lucros_cessantes}
                onChange={(e) => handleValorChange('valor_lucros_cessantes', e.target.value)}
                placeholder="R$ 0,00"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #dee2e6',
                  borderRadius: '8px',
                  fontSize: '1em'
                }}
              />
            </div>
          )}
        </div>

        {/* Pensão */}
        <div style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '25px'
        }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            marginBottom: '15px'
          }}>
            <input
              type="checkbox"
              checked={dados.tem_pensao}
              onChange={(e) => setDados({...dados, tem_pensao: e.target.checked})}
              style={{ marginRight: '10px' }}
            />
            <span style={{ fontWeight: 'bold', color: '#495057' }}>
              👨‍👩‍👧‍👦 Incluir Pensão Alimentícia/Indenizatória
            </span>
          </label>

          {dados.tem_pensao && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#495057' }}>
                  Valor Mensal:
                </label>
                <input
                  type="text"
                  value={dados.valor_pensao_mensal}
                  onChange={(e) => handleValorChange('valor_pensao_mensal', e.target.value)}
                  placeholder="R$ 0,00"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `2px solid ${erros.valor_pensao_mensal ? '#dc3545' : '#dee2e6'}`,
                    borderRadius: '6px',
                    fontSize: '1em'
                  }}
                />
                {erros.valor_pensao_mensal && (
                  <div style={{ color: '#dc3545', fontSize: '0.8em', marginTop: '3px' }}>
                    {erros.valor_pensao_mensal}
                  </div>
                )}
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#495057' }}>
                  Idade do Beneficiário:
                </label>
                <input
                  type="number"
                  value={dados.idade_beneficiario}
                  onChange={(e) => setDados({...dados, idade_beneficiario: e.target.value})}
                  min="0"
                  max="100"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `2px solid ${erros.idade_beneficiario ? '#dc3545' : '#dee2e6'}`,
                    borderRadius: '6px',
                    fontSize: '1em'
                  }}
                />
                {erros.idade_beneficiario && (
                  <div style={{ color: '#dc3545', fontSize: '0.8em', marginTop: '3px' }}>
                    {erros.idade_beneficiario}
                  </div>
                )}
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#495057' }}>
                  Expectativa de Vida:
                </label>
                <input
                  type="number"
                  value={dados.expectativa_vida}
                  onChange={(e) => setDados({...dados, expectativa_vida: parseInt(e.target.value) || 75})}
                  min="50"
                  max="100"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #dee2e6',
                    borderRadius: '6px',
                    fontSize: '1em'
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Valor Total Calculado */}
        {valorTotal > 0 && (
          <div style={{
            background: '#e8f5e8',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '25px',
            border: '1px solid #28a745'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#155724' }}>
              💰 Valor Total da Causa:
            </h4>
            <p style={{ margin: '0', color: '#155724', fontSize: '1.5em', fontWeight: 'bold' }}>
              {valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
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
            📋 Base Legal:
          </h4>
          <ul style={{ margin: '0', paddingLeft: '20px', color: '#1565c0', fontSize: '0.9em' }}>
            <li><strong>Art. 292 do CPC:</strong> Valor da causa em ações indenizatórias</li>
            <li><strong>Art. 293 do CPC:</strong> Valor da causa em ações de cobrança</li>
            <li><strong>Art. 294 do CPC:</strong> Valor da causa em ações declaratórias</li>
            <li><strong>Lei 11.419/06:</strong> Custas processuais baseadas no valor da causa</li>
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
          {loading ? '⏳ Calculando...' : '💰 Calcular Valor da Causa'}
        </button>
      </form>
    </div>
  );
};

export default FormValorCausa;