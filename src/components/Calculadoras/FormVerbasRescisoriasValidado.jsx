// src/components/Calculadoras/FormVerbasRescisoriasValidado.jsx
import React from 'react';
import { useValidation } from '../../hooks/useValidation';
import { validators } from '../../utils/validators';
import ValidatedInput from '../Common/ValidatedInput';

const FormVerbasRescisoriasValidado = ({ onCalcular, loading }) => {
  const validationRules = {
    cpf: [
      { required: true, message: 'CPF é obrigatório' },
      { validator: validators.cpf, message: 'CPF inválido' }
    ],
    salario: [
      { required: true, message: 'Salário é obrigatório' },
      { validator: (value) => validators.valorMonetario(value, 1320, 50000), message: 'Salário deve estar entre R$ 1.320,00 e R$ 50.000,00' }
    ],
    data_admissao: [
      { required: true, message: 'Data de admissão é obrigatória' },
      { validator: validators.data, message: 'Data inválida' }
    ],
    data_rescisao: [
      { required: true, message: 'Data de rescisão é obrigatória' },
      { validator: validators.data, message: 'Data inválida' }
    ],
    telefone: [
      { validator: validators.telefone, message: 'Telefone inválido' }
    ],
    email: [
      { validator: validators.email, message: 'Email inválido' }
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
    cpf: '',
    salario: '',
    data_admissao: '',
    data_rescisao: '',
    telefone: '',
    email: '',
    tipo_rescisao: 'sem_justa_causa'
  }, validationRules);

  const tiposRescisao = [
    { value: 'sem_justa_causa', label: '🚫 Demissão sem Justa Causa', cor: '#dc3545' },
    { value: 'com_justa_causa', label: '⚠️ Demissão com Justa Causa', cor: '#fd7e14' },
    { value: 'pedido_demissao', label: '🚪 Pedido de Demissão', cor: '#6c757d' },
    { value: 'rescisao_indireta', label: '⚖️ Rescisão Indireta', cor: '#28a745' },
    { value: 'acordo_mutuo', label: '🤝 Acordo Mútuo', cor: '#17a2b8' },
    { value: 'termino_contrato', label: '📅 Término de Contrato', cor: '#6f42c1' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateAll()) {
      // Validação adicional para datas
      if (values.data_admissao && values.data_rescisao) {
        const admissao = new Date(values.data_admissao);
        const rescisao = new Date(values.data_rescisao);
        
        if (admissao >= rescisao) {
          alert('Data de rescisão deve ser posterior à data de admissão');
          return;
        }
      }
      
      onCalcular({
        ...values,
        salario: parseFloat(values.salario.replace(/[^\d,]/g, '').replace(',', '.'))
      });
    }
  };

  const calcularTempoServico = () => {
    if (values.data_admissao && values.data_rescisao) {
      const admissao = new Date(values.data_admissao);
      const rescisao = new Date(values.data_rescisao);
      const diffTime = Math.abs(rescisao - admissao);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const anos = Math.floor(diffDays / 365);
      const meses = Math.floor((diffDays % 365) / 30);
      const dias = diffDays % 30;
      
      return { anos, meses, dias, totalDias: diffDays };
    }
    return null;
  };

  const tempoServico = calcularTempoServico();

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #dee2e6',
      padding: '30px'
    }}>
      <h3 style={{ color: '#495057', marginBottom: '25px', textAlign: 'center' }}>
        �� Cálculo de Verbas Rescisórias (Validado)
      </h3>

      <form onSubmit={handleSubmit}>
        {/* Dados Pessoais */}
        <div style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '25px'
        }}>
          <h4 style={{ margin: '0 0 20px 0', color: '#495057' }}>
            👤 Dados Pessoais
          </h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <ValidatedInput
              label="CPF"
              name="cpf"
              value={values.cpf}
              onChange={setValue}
              onBlur={setFieldTouched}
              error={errors.cpf}
              touched={touched.cpf}
              mask="cpf"
              placeholder="000.000.000-00"
              icon="🆔"
              required
              helpText="Informe o CPF do empregado"
            />
            
            <ValidatedInput
              label="Telefone"
              name="telefone"
              value={values.telefone}
              onChange={setValue}
              onBlur={setFieldTouched}
              error={errors.telefone}
              touched={touched.telefone}
              mask="telefone"
              placeholder="(00) 00000-0000"
              icon="📱"
              helpText="Telefone para contato"
            />
          </div>
          
          <ValidatedInput
            label="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={setValue}
            onBlur={setFieldTouched}
            error={errors.email}
            touched={touched.email}
            placeholder="exemplo@email.com"
            icon="📧"
            helpText="Email para envio do relatório"
          />
        </div>

        {/* Dados Contratuais */}
        <div style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '25px'
        }}>
          <h4 style={{ margin: '0 0 20px 0', color: '#495057' }}>
            📋 Dados Contratuais
          </h4>
          
          <ValidatedInput
            label="Salário Mensal"
            name="salario"
            value={values.salario}
            onChange={setValue}
            onBlur={setFieldTouched}
            error={errors.salario}
            touched={touched.salario}
            mask="money"
            placeholder="R$ 0,00"
            icon="💰"
            required
            helpText="Último salário recebido pelo empregado"
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <ValidatedInput
              label="Data de Admissão"
              name="data_admissao"
              type="date"
              value={values.data_admissao}
              onChange={setValue}
              onBlur={setFieldTouched}
              error={errors.data_admissao}
              touched={touched.data_admissao}
              icon="📅"
              required
              helpText="Data de início do contrato"
            />

            <ValidatedInput
              label="Data de Rescisão"
              name="data_rescisao"
              type="date"
              value={values.data_rescisao}
              onChange={setValue}
              onBlur={setFieldTouched}
              error={errors.data_rescisao}
              touched={touched.data_rescisao}
              icon="📅"
              required
              helpText="Data de término do contrato"
            />
          </div>
        </div>

        {/* Tempo de Serviço */}
        {tempoServico && (
          <div style={{
            background: '#e8f5e8',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #28a745'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#155724' }}>
              ⏱️ Tempo de Serviço Calculado:
            </h4>
            <p style={{ margin: '0', color: '#155724', fontSize: '1.1em', fontWeight: 'bold' }}>
              {tempoServico.anos} anos, {tempoServico.meses} meses e {tempoServico.dias} dias
            </p>
            <p style={{ margin: '5px 0 0 0', color: '#155724', fontSize: '0.9em' }}>
              Total: {tempoServico.totalDias} dias
            </p>
          </div>
        )}

        {/* Tipo de Rescisão */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: 'bold', color: '#495057' }}>
            ⚖️ Tipo de Rescisão: <span style={{ color: '#dc3545' }}>*</span>
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

        {/* Botões */}
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
            🔄 Limpar Formulário
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
            {loading ? '⏳ Calculando...' : '🧮 Calcular Verbas Rescisórias'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormVerbasRescisoriasValidado;