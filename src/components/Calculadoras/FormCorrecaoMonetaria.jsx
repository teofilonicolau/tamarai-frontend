import React from 'react';
import { useForm } from 'react-hook-form';

/**
 * FormCorrecaoMonetaria
 * - Usa onCalcular (contrato padrão dos formulários) para integrar com Calculadoras.jsx
 * - data_final é opcional
 * - botão maior, com hover e estado disabled visual
 */
const FormCorrecaoMonetaria = ({ onCalcular, loading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const submit = (data) => {
    // Envia os mesmos campos que o backend espera; o pai (Calculadoras.formatarDados) fará conversões
    if (onCalcular) {
      onCalcular({
        valor: data.valor,
        data_inicial: data.data_inicial,
        data_final: data.data_final || '',
        indice: data.indice
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-3">
      <div>
        <label className="block text-sm font-medium mb-1">Valor</label>
        <input
          type="text"
          placeholder="Ex.: 10.000,00"
          className="w-full border rounded-md px-3 py-2"
          {...register('valor', { required: 'Obrigatório' })}
        />
        {errors.valor && <span className="text-red-500 text-xs">{errors.valor.message}</span>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Data Inicial</label>
          <input
            type="date"
            className="w-full border rounded-md px-3 py-2"
            {...register('data_inicial', { required: 'Obrigatório' })}
          />
          {errors.data_inicial && <span className="text-red-500 text-xs">{errors.data_inicial.message}</span>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Data Final</label>
          <input
            type="date"
            className="w-full border rounded-md px-3 py-2"
            {...register('data_final')}
          />
          {errors.data_final && <span className="text-red-500 text-xs">{errors.data_final.message}</span>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Índice</label>
        <select className="w-full border rounded-md px-3 py-2" {...register('indice', { required: 'Obrigatório' })}>
          <option value="IPCA-E">IPCA-E</option>
          <option value="INPC">INPC</option>
          <option value="IGP-M">IGP-M</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 rounded-md bg-blue-600 text-white disabled:opacity-60 hover:bg-blue-700 transition"
      >
        {loading ? 'Calculando…' : 'Calcular'}
      </button>
    </form>
  );
};

export default FormCorrecaoMonetaria;