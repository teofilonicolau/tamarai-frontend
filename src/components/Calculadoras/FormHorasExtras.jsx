import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { http } from '../../services/api';
import { ENDPOINTS } from '../../config/endpoints';

const FormHorasExtras = () => {
  const [dados, setDados] = useState({
    jornada_contratual: '',
    jornada_real: '',
    dias_trabalhados: '',
    valor_hora: '',
    percentual_adicional: '50'
  });
  const [erros, setErros] = useState({});
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  const validarFormulario = () => {
    const novosErros = {};

    if (!dados.jornada_contratual || Number(dados.jornada_contratual) <= 0) {
      novosErros.jornada_contratual = 'Informe a jornada contratual';
    }
    if (!dados.jornada_real || Number(dados.jornada_real) <= 0) {
      novosErros.jornada_real = 'Informe a jornada real trabalhada';
    }
    if (Number(dados.jornada_real) <= Number(dados.jornada_contratual)) {
      novosErros.jornada_real = 'Jornada real deve ser maior que a contratual';
    }
    if (!dados.dias_trabalhados || Number(dados.dias_trabalhados) <= 0 || Number(dados.dias_trabalhados) > 31) {
      novosErros.dias_trabalhados = 'Informe os dias trabalhados (1-31)';
    }
    if (!dados.valor_hora || parseFloat(dados.valor_hora) <= 0) {
      novosErros.valor_hora = 'Informe o valor da hora normal';
    }
    if (!dados.percentual_adicional || parseFloat(dados.percentual_adicional) <= 0) {
      novosErros.percentual_adicional = 'Informe o percentual adicional';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const calcularPrevia = () => {
    if (
      dados.jornada_contratual &&
      dados.jornada_real &&
      dados.dias_trabalhados &&
      dados.valor_hora &&
      dados.percentual_adicional
    ) {
      const horasExtras = (Number(dados.jornada_real) - Number(dados.jornada_contratual)) * Number(dados.dias_trabalhados);
      const multiplier = 1 + (parseFloat(dados.percentual_adicional) / 100);
      const valorTotal = horasExtras * parseFloat(dados.valor_hora) * multiplier;
      return { horasExtras, valorTotal };
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    const dadosParaCalcular = {
      jornada_contratual: Number(dados.jornada_contratual) || 0,
      jornada_real: Number(dados.jornada_real) || 0,
      dias_trabalhados: Number(dados.dias_trabalhados) || 0,
      valor_hora: parseFloat(dados.valor_hora) || 0,
      percentual_adicional: parseFloat(dados.percentual_adicional) || 50
    };

    setLoading(true);
    setResultado(null);
    try {
      const endpoint = ENDPOINTS.calculadoras.trabalhista.horas_extras;
      console.debug('Enviando para endpoint:', endpoint, 'dados:', dadosParaCalcular);

      const response = await http.post(endpoint, dadosParaCalcular);
      const calculo = response?.calculo ?? {};

      // backend fornece horas_extras_diarias (horas extras por dia) e valor_total
      const horasExtrasDiarias = calculo.horas_extras_diarias ?? calculo.horas_extras ?? 0;
      const dias = dadosParaCalcular.dias_trabalhados ?? 0;
      const horasExtrasTotais = horasExtrasDiarias * dias;

      setResultado({
        horasExtras: horasExtrasTotais,
        valorTotal: calculo.valor_total ?? calculo.valorTotal ?? 0,
        percentualAplicado: calculo.percentual_adicional ?? dadosParaCalcular.percentual_adicional
      });

      toast.success('Cálculo realizado com sucesso!');
    } catch (error) {
      const msg = error?.message || error?.data?.detail || 'Erro no cálculo: verifique os valores';
      console.error('Erro Horas Extras:', error);
      toast.error(msg);
    } finally {
      setLoading(false);
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
        ⏰ Cálculo de Horas Extras
      </h3>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
              Jornada Contratual (horas/dia):
            </label>
            <input
              type="number"
              value={dados.jornada_contratual}
              onChange={(e) => setDados({ ...dados, jornada_contratual: e.target.value })}
              placeholder="Ex: 8"
              style={{
                width: '100%',
                padding: '12px',
                border: `2px solid ${erros.jornada_contratual ? '#dc3545' : '#dee2e6'}`,
                borderRadius: '8px',
                fontSize: '1em'
              }}
            />
            {erros.jornada_contratual && (
              <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '5px' }}>
                {erros.jornada_contratual}
              </div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
              Jornada Real (horas/dia):
            </label>
            <input
              type="number"
              value={dados.jornada_real}
              onChange={(e) => setDados({ ...dados, jornada_real: e.target.value })}
              placeholder="Ex: 10"
              style={{
                width: '100%',
                padding: '12px',
                border: `2px solid ${erros.jornada_real ? '#dc3545' : '#dee2e6'}`,
                borderRadius: '8px',
                fontSize: '1em'
              }}
            />
            {erros.jornada_real && (
              <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '5px' }}>
                {erros.jornada_real}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
              Dias Trabalhados:
            </label>
            <input
              type="number"
              value={dados.dias_trabalhados}
              onChange={(e) => setDados({ ...dados, dias_trabalhados: e.target.value })}
              placeholder="Ex: 22"
              style={{
                width: '100%',
                padding: '12px',
                border: `2px solid ${erros.dias_trabalhados ? '#dc3545' : '#dee2e6'}`,
                borderRadius: '8px',
                fontSize: '1em'
              }}
            />
            {erros.dias_trabalhados && (
              <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '5px' }}>
                {erros.dias_trabalhados}
              </div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
              Valor da Hora Normal (R$):
            </label>
            <input
              type="number"
              step="0.01"
              value={dados.valor_hora}
              onChange={(e) => setDados({ ...dados, valor_hora: e.target.value })}
              placeholder="Ex: 12.50"
              style={{
                width: '100%',
                padding: '12px',
                border: `2px solid ${erros.valor_hora ? '#dc3545' : '#dee2e6'}`,
                borderRadius: '8px',
                fontSize: '1em'
              }}
            />
            {erros.valor_hora && (
              <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '5px' }}>
                {erros.valor_hora}
              </div>
            )}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
            Percentual Adicional (%):
          </label>
          <input
            type="number"
            step="0.01"
            value={dados.percentual_adicional}
            onChange={(e) => setDados({ ...dados, percentual_adicional: e.target.value })}
            placeholder="Ex: 50"
            style={{
              width: '100%',
              padding: '12px',
              border: `2px solid ${erros.percentual_adicional ? '#dc3545' : '#dee2e6'}`,
              borderRadius: '8px',
              fontSize: '1em'
            }}
          />
          {erros.percentual_adicional && (
            <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '5px' }}>
              {erros.percentual_adicional}
            </div>
          )}
          <div style={{ fontSize: '0.9em', color: '#6c757d', marginTop: '5px', fontStyle: 'italic' }}>
            💡 Percentual adicional sobre a hora normal (mínimo 50% per CLT)
          </div>
        </div>

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
                <strong>Horas extras totais:</strong> {previa.horasExtras} horas
              </p>
              <p style={{ margin: '5px 0' }}>
                <strong>Valor estimado:</strong> R$ {previa.valorTotal.toFixed(2)}
              </p>
              <p style={{ margin: '5px 0', fontSize: '0.9em', fontStyle: 'italic' }}>
                📌 Adicional de {dados.percentual_adicional}% aplicado
              </p>
            </div>
          </div>
        )}

        {resultado && (
          <div style={{
            background: '#d4edda',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '25px',
            border: '1px solid #28a745'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#155724' }}>
              📈 Resultado do Cálculo:
            </h4>
            <div style={{ color: '#155724', fontSize: '0.95em' }}>
              <p style={{ margin: '5px 0' }}>
                <strong>Horas extras totais:</strong> {resultado.horasExtras} horas
              </p>
              <p style={{ margin: '5px 0' }}>
                <strong>Valor total:</strong> R$ {Number(resultado.valorTotal).toFixed(2)}
              </p>
              <p style={{ margin: '5px 0', fontSize: '0.9em', fontStyle: 'italic' }}>
                📌 Adicional de {resultado.percentualAplicado}% aplicado
              </p>
            </div>
          </div>
        )}

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
            <li>Adicional mínimo de 50% sobre hora normal (CLT, art. 7º, XVI)</li>
            <li>Limite de 2 horas extras por dia (CLT, art. 59)</li>
            <li>Convenção coletiva pode estabelecer percentuais maiores</li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '15px',
            border: 'none',
            background: loading ? '#6c757d' : '#28a745',
            color: 'white',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '1.1em',
            fontWeight: 'bold'
          }}
        >
          {loading ? '⏳ Calculando...' : '🧮 Calcular Horas Extras'}
        </button>
      </form>
    </div>
  );
};

export default FormHorasExtras;