import React from 'react';
import { useForm } from 'react-hook-form';

const FormCorrecaoMonetaria = ({ onSubmit, loading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
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
            {...register('data_final', { required: 'Obrigatório' })}
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
        className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-60"
      >
        {loading ? 'Calculando…' : 'Calcular'}
      </button>
    </form>
  );
};

export default FormCorrecaoMonetaria;
