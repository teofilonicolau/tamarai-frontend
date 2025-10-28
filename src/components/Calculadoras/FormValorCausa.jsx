// src/components/Calculadoras/FormValorCausa.jsx
import React, { useState } from 'react';

/**
 * FormValorCausa — adapta o formulário para enviar o payload que o backend espera.
 *
 * Mapeamento básico (padrão):
 * - parcelas_vencidas: número (se aplicável) — adicionamos campo quando tipo === 'cobranca'
 * - valor_mensal: número — preferimos valor_pensao_mensal quando informado, senão
 *   usamos valor_pretendido como fallback (você pode ajustar a regra conforme necessidade)
 *
 * Observação: o backend (Swagger) aceita ao menos { parcelas_vencidas, valor_mensal }.
 */

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
    expectativa_vida: 75,
    parcelas_vencidas: '' // novo campo (opcional, usado para cobrança)
  });

  const [erros, setErros] = useState({});

  const tiposAcao = [
    { value: 'indenizatoria', label: '💰 Ação Indenizatória', descricao: 'Danos morais e/ou materiais' },
    { value: 'cobranca', label: '💸 Ação de Cobrança', descricao: 'Cobrança de valores' },
    { value: 'revisional', label: '📝 Ação Revisional', descricao: 'Revisão de contratos' },
    { value: 'declaratoria', label: '📋 Ação Declaratória', descricao: 'Declaração de direitos' },
    { value: 'execucao', label: '⚖️ Execução', descricao: 'Execução de título' },
    { value: 'cautelar', label: '🚨 Cautelar', descricao: 'Medida cautelar' }
  ];

  const parseMoney = (input) => {
    if (input == null) return 0;
    const s = String(input);
    // Remove texto não numérico exceto . e ,
    let cleaned = s.replace(/[^\d,.-]/g, '');
    if (cleaned === '') return 0;
    // Se contém '.' e ',' assumimos pt-BR ('.' milhares, ',' decimal)
    if (cleaned.indexOf('.') > -1 && cleaned.indexOf(',') > -1) {
      cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    } else {
      cleaned = cleaned.replace(',', '.');
    }
    // Lidar com múltiplos pontos - mantém o último como decimal
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      cleaned = parts.slice(0, -1).join('') + '.' + parts[parts.length - 1];
    }
    const n = parseFloat(cleaned);
    return Number.isFinite(n) ? n : 0;
  };

  const validarFormulario = () => {
    const novosErros = {};

    if (dados.tem_danos_morais && parseMoney(dados.valor_danos_morais) <= 0) {
      novosErros.valor_danos_morais = 'Informe o valor dos danos morais';
    }

    if (dados.tem_danos_materiais && parseMoney(dados.valor_danos_materiais) <= 0) {
      novosErros.valor_danos_materiais = 'Informe o valor dos danos materiais';
    }

    if (dados.tem_pensao && parseMoney(dados.valor_pensao_mensal) <= 0) {
      novosErros.valor_pensao_mensal = 'Informe o valor da pensão mensal';
    }

    if (dados.tem_pensao) {
      const idade = parseInt(dados.idade_beneficiario, 10) || 0;
      if (idade <= 0 || idade > 120) {
        novosErros.idade_beneficiario = 'Informe uma idade válida (1-120 anos)';
      }
    }

    // Se for cobrança, validar parcelas_vencidas e valor_pretendido mínimo
    if (dados.tipo_acao === 'cobranca') {
      const parcelas = parseInt(dados.parcelas_vencidas, 10);
      if (isNaN(parcelas) || parcelas < 0) {
        novosErros.parcelas_vencidas = 'Informe um número válido de parcelas vencidas';
      }
      if (parseMoney(dados.valor_pretendido) <= 0) {
        novosErros.valor_pretendido = 'Informe o valor do título (valor mensal ou pretensão)';
      }
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleValorChange = (campo, valor) => {
    // Armazena valor bruto/formatado conforme edição (mantemos string para edição)
    setDados(prev => ({ ...prev, [campo]: valor }));
  };

  const calcularValorTotal = () => {
    let total = 0;
    total += parseMoney(dados.valor_pretendido) || 0;
    if (dados.tem_danos_morais) total += parseMoney(dados.valor_danos_morais);
    if (dados.tem_danos_materiais) total += parseMoney(dados.valor_danos_materiais);
    if (dados.tem_lucros_cessantes) total += parseMoney(dados.valor_lucros_cessantes);

    if (dados.tem_pensao) {
      const valorMensal = parseMoney(dados.valor_pensao_mensal);
      const idade = parseInt(dados.idade_beneficiario, 10) || 0;
      const anosRestantes = Math.max(0, (dados.expectativa_vida || 75) - idade);
      total += valorMensal * 12 * anosRestantes;
    }

    return total;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    // Construir payload mínimo que o backend espera
    const parcelas_vencidas = dados.tipo_acao === 'cobranca'
      ? (parseInt(dados.parcelas_vencidas, 10) || 0)
      : 0;

    // valor_mensal: se houver pensão -> usar valor_pensao_mensal; se ação de cobrança -> usar valor_pretendido (assumido mensal);
    // caso contrário fallback para 0 (ou para valor_pretendido, conforme sua regra de negócio)
    let valor_mensal = 0;
    if (dados.tem_pensao) {
      valor_mensal = parseMoney(dados.valor_pensao_mensal);
    } else if (dados.tipo_acao === 'cobranca') {
      valor_mensal = parseMoney(dados.valor_pretendido);
    } else {
      valor_mensal = 0;
    }

    const payload = {
      parcelas_vencidas,
      valor_mensal
    };

    onCalcular(payload);
  };

  const valorTotal = calcularValorTotal();

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #dee2e6',
      padding: '30px'
    }}>
      <h3 style={{ color: '#495057', marginBottom: '25px', textAlign: 'center' }}>
        💰 Cálculo do Valor da Causa
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
                    onChange={(e) => setDados(prev => ({ ...prev, tipo_acao: e.target.value }))}
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
              border: `2px solid ${erros.valor_pretendido ? '#dc3545' : '#dee2e6'}`,
              borderRadius: '8px',
              fontSize: '1em'
            }}
          />
          {erros.valor_pretendido && <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '5px' }}>{erros.valor_pretendido}</div>}
          <div style={{ fontSize: '0.9em', color: '#6c757d', marginTop: '5px', fontStyle: 'italic' }}>
            💡 Valor principal da pretensão
          </div>
        </div>

        {/* Se for cobrança: parcelas vencidas */}
        {dados.tipo_acao === 'cobranca' && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
              📅 Parcelas vencidas
            </label>
            <input
              type="number"
              min="0"
              value={dados.parcelas_vencidas}
              onChange={(e) => setDados(prev => ({ ...prev, parcelas_vencidas: e.target.value }))}
              style={{
                width: '150px',
                padding: '10px',
                border: `2px solid ${erros.parcelas_vencidas ? '#dc3545' : '#dee2e6'}`,
                borderRadius: '6px',
                fontSize: '1em'
              }}
            />
            {erros.parcelas_vencidas && <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '5px' }}>{erros.parcelas_vencidas}</div>}
            <div style={{ fontSize: '0.9em', color: '#6c757d', marginTop: '5px' }}>
              💡 Número de parcelas em atraso (se aplicável)
            </div>
          </div>
        )}

        {/* Pensão (se aplicável) */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: '15px' }}>
            <input
              type="checkbox"
              checked={dados.tem_pensao}
              onChange={(e) => setDados(prev => ({ ...prev, tem_pensao: e.target.checked }))}
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
                {erros.valor_pensao_mensal && <div style={{ color: '#dc3545', fontSize: '0.8em', marginTop: '3px' }}>{erros.valor_pensao_mensal}</div>}
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#495057' }}>
                  Idade do Beneficiário:
                </label>
                <input
                  type="number"
                  value={dados.idade_beneficiario}
                  onChange={(e) => setDados(prev => ({ ...prev, idade_beneficiario: e.target.value }))}
                  min="0"
                  max="120"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `2px solid ${erros.idade_beneficiario ? '#dc3545' : '#dee2e6'}`,
                    borderRadius: '6px',
                    fontSize: '1em'
                  }}
                />
                {erros.idade_beneficiario && <div style={{ color: '#dc3545', fontSize: '0.8em', marginTop: '3px' }}>{erros.idade_beneficiario}</div>}
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#495057' }}>
                  Expectativa de Vida:
                </label>
                <input
                  type="number"
                  value={dados.expectativa_vida}
                  onChange={(e) => setDados(prev => ({ ...prev, expectativa_vida: parseInt(e.target.value, 10) || 75 }))}
                  min="50"
                  max="120"
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