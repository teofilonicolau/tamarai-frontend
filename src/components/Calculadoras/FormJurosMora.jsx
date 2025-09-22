import React from 'react';
import { useForm } from 'react-hook-form';

const FormJurosMora = ({ onSubmit, loading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <label className="block text-sm font-medium mb-1">Valor Principal</label>
        <input
          type="text"
          placeholder="Ex.: 10.000,00"
          className="w-full border rounded-md px-3 py-2"
          {...register('valor_principal', { required: 'Obrigatório' })}
        />
        {errors.valor_principal && <span className="text-red-500 text-xs">{errors.valor_principal.message}</span>}
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
            {...register('data_final', { required: 'Obrigatório' })}
          />
          {errors.data_final && <span className="text-red-500 text-xs">{errors.data_final.message}</span>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Taxa (% a.m.)</label>
        <input
          type="number"
          step="0.01"
          placeholder="Ex.: 1,00"
          className="w-full border rounded-md px-3 py-2"
          {...register('taxa_mensal')}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-60"
      >
        {loading ? 'Calculando…' : 'Calcular'}
      </button>
    </form>
  );
};

export default FormJurosMora;
