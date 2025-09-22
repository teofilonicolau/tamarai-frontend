// src/components/FormularioDinamico/ParecerJuridico.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { ENDPOINTS } from '../../config/endpoints';
import { http } from '../../services/api';
import { extractPayload } from '../../utils/payload';

const ParecerJuridico = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [parecer, setParecer] = useState(null);

  const onSubmit = async (formValues) => {
    const payload = extractPayload(formValues);
    setLoading(true);
    setParecer(null);
    try {
      const data = await http.post(ENDPOINTS.ia.parecer_juridico, payload);
      setParecer(data);
      toast.success('Parecer gerado com sucesso.');
    } catch (err) {
      toast.error(err?.message || 'Erro ao gerar parecer');
    } finally {
      setLoading(false);
    }
  };

  const gerarPDF = async () => {
    if (!parecer?.dados_utilizados) {
      toast.error('Nenhum parecer carregado para gerar PDF');
      return;
    }

    try {
      const response = await http.post(
        `${ENDPOINTS.ia.parecer_juridico}/pdf`, 
        parecer.dados_utilizados, 
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `parecer_juridico_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('PDF baixado com sucesso!');
    } catch (err) {
      toast.error(err?.message || 'Erro ao gerar PDF');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="theme-card p-6">
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            📋 Parecer Jurídico com IA
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Gere pareceres jurídicos estruturados e fundamentados
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Título do Parecer *
            </label>
            <input
              {...register('titulo', { required: 'Título é obrigatório' })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Ex: Parecer sobre Aposentadoria Especial"
            />
            {errors.titulo && (
              <p className="text-red-600 text-sm mt-1">{errors.titulo.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Conteúdo/Questão a Analisar *
            </label>
            <textarea
              {...register('conteudo', { required: 'Conteúdo é obrigatório' })}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Descreva a situação jurídica que precisa de parecer..."
            />
            {errors.conteudo && (
              <p className="text-red-600 text-sm mt-1">{errors.conteudo.message}</p>
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
                <option value="processual_civil">Processual Civil</option>
              </select>
            </div>

            <div className="flex items-center">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('incluir_jurisprudencia')}
                  defaultChecked={true}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Incluir Jurisprudência
                </span>
              </label>
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

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Texto da Assinatura
              </label>
              <input
                {...register('signature_text')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Ex: Dr. João Silva - OAB/SP 123456"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Persona da IA
              </label>
              <input
                {...register('ai_persona')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Ex: Especialista em Direito Previdenciário com 15 anos de experiência"
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="theme-button flex-1"
              style={{ background: '#8B5CF6' }}
            >
              {loading ? 'Gerando...' : '📋 Gerar Parecer'}
            </button>

            {parecer && (
              <button
                type="button"
                onClick={gerarPDF}
                className="theme-button"
                style={{ background: '#10B981' }}
              >
                📥 Baixar PDF
              </button>
            )}
          </div>

        </form>

        {parecer && (
          <div className="mt-8 border-t border-gray-200 dark:border-gray-600 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              📋 Parecer Gerado
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">
                {parecer.parecer || JSON.stringify(parecer, null, 2)}
              </pre>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ParecerJuridico;