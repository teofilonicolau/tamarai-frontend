// src/components/FormularioDinamico/ConsultaJuridica.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { ENDPOINTS } from '../../config/endpoints';

const ConsultaJuridica = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [resposta, setResposta] = useState(null);

  const onSubmit = async (data) => {
    setLoading(true);
    setResposta(null);
    try {
      const response = await api.post(ENDPOINTS.ai.consulta, data);
      const respostaText = response.data?.resposta || response.data?.resultado || 'Resposta não disponível';
      setResposta({ texto: respostaText });
      toast.success('Consulta realizada com sucesso!');
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Erro ao realizar consulta';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="theme-card p-6">
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            💬 Consulta Jurídica com IA
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Faça perguntas jurídicas e receba respostas especializadas
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Sua Pergunta *
            </label>
            <textarea
              {...register('pergunta', { required: 'Pergunta é obrigatória' })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Digite sua pergunta jurídica..."
            />
            {errors.pergunta && (
              <p className="text-red-600 text-sm mt-1">{errors.pergunta.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Área do Direito
              </label>
              <select
                {...register('area')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="geral">Geral</option>
                <option value="previdenciario">Previdenciário</option>
                <option value="trabalhista">Trabalhista</option>
                <option value="civil">Civil</option>
                <option value="consumidor">Consumidor</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Nome do Escritório
              </label>
              <input
                {...register('firm_name')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Nome do escritório"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Nome do Advogado
              </label>
              <input
                {...register('lawyer_name')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Nome do advogado"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Persona da IA
              </label>
              <input
                {...register('ai_persona')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Ex: Especialista em Direito Previdenciário"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="theme-button w-full"
            style={{ background: '#3B82F6' }}
          >
            {loading ? 'Consultando...' : '💬 Fazer Consulta'}
          </button>

        </form>

        {resposta && (
          <div className="mt-8 border-t border-gray-200 dark:border-gray-600 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              📋 Resposta da Consulta
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">
                {resposta.texto}
              </pre>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ConsultaJuridica;