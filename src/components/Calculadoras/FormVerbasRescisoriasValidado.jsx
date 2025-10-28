// src/components/Calculadoras/FormVerbasRescisoriasValidado.jsx
import React from 'react';
import { useValidation } from '../../hooks/useValidation';
import { validators } from '../../utils/validations';
import ValidatedInput from '../Common/ValidatedInput';

/**
 * Formulário para Verbas Rescisórias (produção - sem logs/alerts)
 * - Faz parse do salário corretamente
 * - Validação local como fallback (exibe erros inline através do hook)
 * - Envia apenas { salario: number, data_admissao, data_rescisao, tipo_rescisao }
 */
const FormVerbasRescisoriasValidado = ({ onCalcular, loading }) => {
  const parseMoney = (value) => {
    if (value == null) return 0;
    const s = String(value);
    let cleaned = s.replace(/[^\d,.-]/g, '');
    if (cleaned.indexOf('.') > -1 && cleaned.indexOf(',') > -1) {
      // assume formato pt-BR: '.' milhares e ',' decimal
      cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    } else {
      cleaned = cleaned.replace(',', '.');
    }
    // tratar múltiplos pontos
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      cleaned = parts.slice(0, -1).join('') + '.' + parts[parts.length - 1];
    }
    const n = parseFloat(cleaned);
    return Number.isFinite(n) ? n : 0;
  };

  const validationRules = {
    salario: [
      { required: true, message: 'Salário é obrigatório' },
      {
        validator: (v) => {
          const numeric = parseMoney(v);
          return numeric >= 1320 && numeric <= 50000;
        },
        message: 'Salário deve estar entre R$ 1.320,00 e R$ 50.000,00'
      }
    ],
    data_admissao: [
      { required: true, message: 'Data de admissão é obrigatória' },
      { validator: validators.data, message: 'Data inválida' }
    ],
    data_rescisao: [
      { required: true, message: 'Data de rescisão é obrigatória' },
      { validator: validators.data, message: 'Data inválida' }
    ],
    tipo_rescisao: [
      { required: true, message: 'Tipo de rescisão é obrigatório' }
    ]
  };

  const {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    validateAll,
    resetForm
  } = useValidation({
    salario: '',
    data_admissao: '',
    data_rescisao: '',
    tipo_rescisao: 'sem_justa_causa'
  }, validationRules);

  const tiposRescisao = [
    { value: 'sem_justa_causa', label: 'Demissão sem Justa Causa', cor: '#dc3545' },
    { value: 'com_justa_causa', label: 'Demissão com Justa Causa', cor: '#fd7e14' },
    { value: 'pedido_demissao', label: 'Pedido de Demissão', cor: '#6c757d' },
    { value: 'rescisao_indireta', label: 'Rescisão Indireta', cor: '#28a745' },
    { value: 'acordo_mutuo', label: 'Acordo Mútuo', cor: '#17a2b8' },
    { value: 'termino_contrato', label: 'Término de Contrato', cor: '#6f42c1' }
  ];

  const calcularTempoServico = () => {
    if (!values.data_admissao || !values.data_rescisao) return null;
    const admissao = new Date(values.data_admissao);
    const rescisao = new Date(values.data_rescisao);
    const diffTime = Math.abs(rescisao - admissao);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const anos = Math.floor(diffDays / 365);
    const meses = Math.floor((diffDays % 365) / 30);
    const dias = diffDays % 30;
    return { anos, meses, dias, totalDias: diffDays };
  };

  const tempoServico = calcularTempoServico();

  // Validação local (fallback) - marca campos como touched para que o hook mostre erros inline
  const validaLocal = () => {
    const problemas = {};
    const salarioNum = parseMoney(values.salario);

    if (!(salarioNum >= 1320 && salarioNum <= 50000)) {
      problemas.salario = 'Salário deve estar entre R$ 1.320,00 e R$ 50.000,00';
    }

    if (!values.data_admissao) {
      problemas.data_admissao = 'Data de admissão é obrigatória';
    } else if (!validators.data(values.data_admissao)) {
      problemas.data_admissao = 'Data de admissão inválida';
    }

    if (!values.data_rescisao) {
      problemas.data_rescisao = 'Data de rescisão é obrigatória';
    } else if (!validators.data(values.data_rescisao)) {
      problemas.data_rescisao = 'Data de rescisão inválida'; // CORRIGIDO: Ш= → =
    }

    if (values.data_admissao && values.data_rescisao) {
      const adm = new Date(values.data_admissao);
      const rec = new Date(values.data_rescisao);
      if (adm >= rec) {
        problemas.data_rescisao = 'Data de rescisão deve ser posterior à data de admissão';
      }
    }

    if (!values.tipo_rescisao) {
      problemas.tipo_rescisao = 'Tipo de rescisão é obrigatório';
    }

    return { ok: Object.keys(problemas).length === 0, problemas, salarioNum };
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validação pelo hook
    if (!validateAll()) return;

    // Validação local fallback
    const { ok, problemas, salarioNum } = validaLocal();
    if (!ok) {
      Object.keys(problemas).forEach((k) => setFieldTouched(k));
      return;
    }

    onCalcular({
      salario: salarioNum,
      data_admissao: values.data_admissao,
      data_rescisao: values.data_rescisao,
      tipo_rescisao: values.tipo_rescisao
    });
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #dee2e6',
      padding: '30px'
    }}>
      <h3 style={{ color: '#495057', marginBottom: '25px', textAlign: 'center' }}>
        Cálculo de Verbas Rescisórias
      </h3>

      <form onSubmit={handleSubmit}>
        <div style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '25px'
        }}>
          <h4 style={{ margin: '0 0 20px 0', color: '#495057' }}>
            Dados Contratuais
          </h4>

          <ValidatedInput
            label="Salário Mensal"
            name="salario"
            value={values.salario}
            onChange={(v) => setValue('salario', v)}
            onBlur={() => setFieldTouched('salario')}
            error={errors.salario}
            touched={touched.salario}
            mask="money"
            placeholder="R$ 0,00"
            icon="money"
            required
            helpText="Informe o salário mensal (ex.: R$ 1.600,00)"
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: 12 }}>
            <ValidatedInput
              label="Data de Admissão"
              name="data_admissao"
              type="date"
              value={values.data_admissao}
              onChange={(v) => setValue('data_admissao', v)}
              onBlur={() => setFieldTouched('data_admissao')}
              error={errors.data_admissao}
              touched={touched.data_admissao}
              icon="calendar"
              required
              helpText="Data de início do contrato"
            />

            <ValidatedInput
              label="Data de Rescisão"
              name="data_rescisao"
              type="date"
              value={values.data_rescisao}
              onChange={(v) => setValue('data_rescisao', v)}
              onBlur={() => setFieldTouched('data_rescisao')}
              error={errors.data_rescisao}
              touched={touched.data_rescisao}
              icon="calendar"
              required
              helpText="Data de término do contrato"
            />
          </div>
        </div>

        {tempoServico && (
          <div style={{
            background: '#e8f5e8',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #28a745'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#155724' }}>
              Tempo de Serviço Calculado:
            </h4>
            <p style={{ margin: '0', color: '#155724', fontSize: '1.1em', fontWeight: 'bold' }}>
              {tempoServico.anos} anos, {tempoServico.meses} meses e {tempoServico.dias} dias
            </p>
            <p style={{ margin: '5px 0 0 0', color: '#155724', fontSize: '0.9em' }}>
              Total: {tempoServico.totalDias} dias
            </p>
          </div>
        )}

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: 'bold', color: '#495057' }}>
            Tipo de Rescisão: <span style={{ color: '#dc3545' }}>*</span>
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '10px' }}>
            {tiposRescisao.map(tipo => (
              <label key={tipo.value} style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '12px 15px',
                border: `2px solid ${values.tipo_rescisao === tipo.value ? tipo.cor : '#dee2e6'}`,
                borderRadius: '8px',
                background: values.tipo_rescisao === tipo.value ? `${tipo.cor}15` : '#ffffff',
                transition: 'all 0.3s ease'
              }}>
                <input
                  type="radio"
                  name="tipo_rescisao"
                  value={tipo.value}
                  checked={values.tipo_rescisao === tipo.value}
                  onChange={(e) => setValue('tipo_rescisao', e.target.value)}
                  style={{ marginRight: '10px' }}
                />
                <span style={{ fontSize: '0.9em', color: values.tipo_rescisao === tipo.value ? tipo.cor : '#495057' }}>
                  {tipo.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={resetForm}
            style={{
              padding: '12px 24px',
              border: '2px solid #6c757d',
              background: 'transparent',
              color: '#6c757d',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1em',
              fontWeight: 'bold'
            }}
          >
            Limpar Formulário
          </button>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 24px',
              border: 'none',
              background: loading ? '#6c757d' : '#28a745',
              color: 'white',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1em',
              fontWeight: 'bold'
            }}
          >
            {loading ? 'Calculando...' : 'Calcular Verbas Rescisórias'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormVerbasRescisoriasValidado;