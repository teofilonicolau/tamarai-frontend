import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { ENDPOINTS } from '../../config/endpoints';

const FormJurosMora = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);

  const onSubmit = async (data) => {
    setLoading(true);
    setResultado(null);
    try {
      const cleanedData = {
        valor_principal: parseFloat(data.valor_principal.replace(/[^\d,]/g, '').replace(',', '.')) || 0,
        data_inicial: data.data_inicial ? new Date(data.data_inicial).toISOString().split('T')[0] : '',
        data_final: data.data_final ? new Date(data.data_final).toISOString().split('T')[0] : '',
        taxa_mensal: parseFloat(data.taxa_mensal) || 0
      };

      if (cleanedData.valor_principal <= 0) throw new Error('Valor principal deve ser maior que 0');
      if (!cleanedData.data_inicial || !cleanedData.data_final) throw new Error('Datas são obrigatórias');
      if (new Date(cleanedData.data_inicial) >= new Date(cleanedData.data_final)) {
        throw new Error('Data final deve ser posterior à data inicial');
      }

      const response = await api.post(ENDPOINTS.calculadoras.juros_mora, cleanedData);
      setResultado({
        valor_total: response.data.valor_total || 0,
        juros_calculado: response.data.juros_calculado || 0
      });
      toast.success('Cálculo realizado com sucesso!');
    } catch (error) {
      const msg = error.response?.data?.detail || error.message || 'Erro no cálculo: verifique os valores';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #dee2e6',
      padding: '30px'
    }}>
      <h3 style={{ color: '#495057', marginBottom: '25px', textAlign: 'center' }}>
        💸 Cálculo de Juros de Mora
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
            Valor Principal (R$):
          </label>
          <input
            type="text"
            placeholder="Ex: 10.000,00"
            {...register('valor_principal', { required: 'Obrigatório' })}
            style={{
              width: '100%',
              padding: '12px',
              border: `2px solid ${errors.valor_principal ? '#dc3545' : '#dee2e6'}`,
              borderRadius: '8px',
              fontSize: '1em'
            }}
          />
          {errors.valor_principal && (
            <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '5px' }}>
              {errors.valor_principal.message}
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
              Data Inicial:
            </label>
            <input
              type="date"
              {...register('data_inicial', { required: 'Obrigatório' })}
              style={{
                width: '100%',
                padding: '12px',
                border: `2px solid ${errors.data_inicial ? '#dc3545' : '#dee2e6'}`,
                borderRadius: '8px',
                fontSize: '1em'
              }}
            />
            {errors.data_inicial && (
              <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '5px' }}>
                {errors.data_inicial.message}
              </div>
            )}
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
              Data Final:
            </label>
            <input
              type="date"
              {...register('data_final', { required: 'Obrigatório' })}
              style={{
                width: '100%',
                padding: '12px',
                border: `2px solid ${errors.data_final ? '#dc3545' : '#dee2e6'}`,
                borderRadius: '8px',
                fontSize: '1em'
              }}
            />
            {errors.data_final && (
              <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '5px' }}>
                {errors.data_final.message}
              </div>
            )}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
            Taxa (% a.m.):
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="Ex: 1.00"
            {...register('taxa_mensal')}
            style={{
              width: '100%',
              padding: '12px',
              border: `2px solid ${errors.taxa_mensal ? '#dc3545' : '#dee2e6'}`,
              borderRadius: '8px',
              fontSize: '1em'
            }}
          />
          {errors.taxa_mensal && (
            <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '5px' }}>
              {errors.taxa_mensal.message}
            </div>
          )}
        </div>

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
                <strong>Juros Calculado:</strong> R$ {resultado.juros_calculado.toFixed(2)}
              </p>
              <p style={{ margin: '5px 0' }}>
                <strong>Valor Total:</strong> R$ {resultado.valor_total.toFixed(2)}
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
            <li>Juros de mora conforme Código Civil, art. 406</li>
            <li>Taxa padrão de 1% ao mês, salvo disposição contratual</li>
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
          {loading ? '⏳ Calculando...' : '🧮 Calcular Juros de Mora'}
        </button>
      </form>
    </div>
  );
};

export default FormJurosMora;