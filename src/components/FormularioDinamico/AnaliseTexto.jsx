import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

const AnaliseTexto = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [analise, setAnalise] = useState(null);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await api.post('/analise', data);
      setAnalise(response.data);
      toast.success('Análise realizada com sucesso!');
    } catch (error) {
      toast.error('Erro ao analisar texto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            📄 Análise de Texto com IA
          </h1>
          <p className="text-gray-600">
            Analise documentos jurídicos com inteligência artificial
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Texto para Análise *
            </label>
            <textarea
              {...register('texto', { required: 'Texto é obrigatório' })}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Cole aqui o texto do documento para análise..."
            />
            {errors.texto && (
              <p className="text-red-600 text-sm mt-1">{errors.texto.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Análise
              </label>
              <select
                {...register('tipo_analise')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="resumo">Resumo</option>
                <option value="pontos_principais">Pontos Principais</option>
                <option value="analise_juridica">Análise Jurídica</option>
                <option value="riscos">Análise de Riscos</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Escritório
              </label>
              <input
                {...register('firm_name')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Nome do escritório"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Advogado
              </label>
              <input
                {...register('lawyer_name')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Nome do advogado"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Persona da IA
              </label>
              <input
                {...register('ai_persona')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Analista Jurídico Especializado"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Analisando...' : '📄 Analisar Texto'}
          </button>

        </form>

        {analise && (
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📋 Resultado da Análise
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm text-gray-800">
                {analise.analise || JSON.stringify(analise, null, 2)}
              </pre>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AnaliseTexto;