
import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { ENDPOINTS } from '../../config/endpoints';
import { normalizePayload } from '../../utils/payload';

const ConsultaJuridica = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [resposta, setResposta] = useState(null);
  const previewRef = useRef(null);

  const onSubmit = async (data) => {
    setLoading(true);
    setResposta(null);
    try {
      const cleanedData = normalizePayload(data);
      const response = await api.post(ENDPOINTS.ai.consulta, cleanedData);
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

  const copiarTexto = () => {
    if (previewRef.current) {
      navigator.clipboard.writeText(previewRef.current.innerText);
      toast.success('Texto copiado!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="theme-card p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          📜 Consulta Jurídica
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Pergunta Jurídica
            </label>
            <textarea
              {...register('pergunta', { required: 'A pergunta é obrigatória' })}
              className={`mt-1 block w-full p-3 border rounded-lg ${
                errors.pergunta ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200`}
              placeholder="Descreva sua dúvida jurídica"
              rows="5"
            />
            {errors.pergunta && (
              <p className="mt-1 text-sm text-red-600">{errors.pergunta.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Área do Direito
            </label>
            <input
              {...register('area', { required: 'A área do direito é obrigatória' })}
              className={`mt-1 block w-full p-3 border rounded-lg ${
                errors.area ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200`}
              placeholder="Ex.: Direito Civil, Trabalhista, Previdenciário"
            />
            {errors.area && (
              <p className="mt-1 text-sm text-red-600">{errors.area.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nome do Escritório (opcional)
            </label>
            <input
              {...register('nome_escritorio')}
              className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              placeholder="Nome do escritório de advocacia"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nome do Advogado (opcional)
            </label>
            <input
              {...register('nome_advogado')}
              className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              placeholder="Nome do advogado responsável"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Persona da IA (opcional)
            </label>
            <input
              {...register('persona_ia')}
              className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              placeholder="Ex.: Advogado especialista em Direito Civil"
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-3 px-4 rounded-lg text-white font-medium ${
                loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? '⏳ Consultando...' : 'Realizar Consulta'}
            </button>
            <button
              type="button"
              onClick={() => reset()}
              disabled={loading}
              className="flex-1 py-3 px-4 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700"
            >
              Limpar Formulário
            </button>
          </div>
        </form>

        {resposta && (
          <div className="mt-8 border-t border-gray-200 dark:border-gray-600 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              📋 Resposta da Consulta
            </h3>
            <div ref={previewRef} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">
                {resposta.texto}
              </pre>
            </div>
            <button
              onClick={copiarTexto}
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Copiar Texto
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultaJuridica;
