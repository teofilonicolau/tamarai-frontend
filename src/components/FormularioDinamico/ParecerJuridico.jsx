
import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { ENDPOINTS } from '../../config/endpoints';
import { http } from '../../services/api';
import { extractPayload, normalizePayload } from '../../utils/payload';
import jsPDF from 'jspdf';

const ParecerJuridico = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [parecer, setParecer] = useState(null);
  const previewRef = useRef(null);

  const onSubmit = async (formValues) => {
    const payload = normalizePayload(extractPayload(formValues));
    setLoading(true);
    setParecer(null);
    try {
      const response = await http.post(ENDPOINTS.ai.parecer, payload);
      const parecerText = response.data?.parecer_juridico || response.data?.parecer || 'Parecer não disponível';
      setParecer({ texto: parecerText, dados_utilizados: payload });
      toast.success('Parecer gerado com sucesso.');
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Erro ao gerar parecer';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const gerarPDF = () => {
    if (!parecer?.texto) {
      toast.error('Nenhum parecer gerado para exportar.');
      return;
    }
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('Parecer Jurídico', 10, 10);
    doc.text(parecer.texto, 10, 20, { maxWidth: 190 });
    doc.save('parecer-juridico.pdf');
    toast.success('PDF gerado com sucesso!');
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
          📜 Gerar Parecer Jurídico
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Pergunta ou Dúvida Jurídica
            </label>
            <textarea
              {...register('pergunta', { required: 'A pergunta é obrigatória' })}
              className={`mt-1 block w-full p-3 border rounded-lg ${
                errors.pergunta ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200`}
              placeholder="Descreva a dúvida jurídica ou questão a ser analisada"
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
              {...register('area_direito', { required: 'A área do direito é obrigatória' })}
              className={`mt-1 block w-full p-3 border rounded-lg ${
                errors.area_direito ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200`}
              placeholder="Ex.: Direito Civil, Trabalhista, Consumidor"
            />
            {errors.area_direito && (
              <p className="mt-1 text-sm text-red-600">{errors.area_direito.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Contexto do Caso
            </label>
            <textarea
              {...register('contexto', { required: 'O contexto do caso é obrigatório' })}
              className={`mt-1 block w-full p-3 border rounded-lg ${
                errors.contexto ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200`}
              placeholder="Descreva o contexto ou fatos relevantes do caso"
              rows="5"
            />
            {errors.contexto && (
              <p className="mt-1 text-sm text-red-600">{errors.contexto.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Documentos ou Provas (um por linha, opcional)
            </label>
            <textarea
              {...register('documentos')}
              className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              placeholder="Ex.: Contrato\nE-mails\nNotas fiscais"
              rows="4"
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
              {loading ? '⏳ Gerando...' : 'Gerar Parecer'}
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

        {parecer && (
          <div className="mt-8 border-t border-gray-200 dark:border-gray-600 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              📋 Parecer Gerado
            </h3>
            <div ref={previewRef} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">
                {parecer.texto}
              </pre>
            </div>
            <div className="mt-4 flex space-x-4">
              <button
                onClick={copiarTexto}
                className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Copiar Texto
              </button>
              <button
                onClick={gerarPDF}
                className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Gerar PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParecerJuridico;
