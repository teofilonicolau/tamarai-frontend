// src/components/FormularioDinamico/PeticaoExecucao.jsx

import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { ENDPOINTS } from '../../config/endpoints';
import { normalizePayload } from '../../utils/payload';
import jsPDF from 'jspdf';

const PeticaoExecucao = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [peticao, setPeticao] = useState(null);
  const previewRef = useRef(null);

  const onSubmit = async (data) => {
    setLoading(true);
    setPeticao(null);
    try {
      const cleanedData = normalizePayload({
        tipo_peticao: data.tipo_peticao,
        numero_processo: data.numero_processo || '',
        parte_contraria: data.parte_contraria,
        cpf_cnpj_parte_contraria: data.cpf_cnpj_parte_contraria.replace(/\D/g, ''),
        endereco_parte_contraria: data.endereco_parte_contraria || '',
        valor_execucao: parseFloat(data.valor_execucao) || 0,
        data_vencimento: data.data_vencimento ? new Date(data.data_vencimento).toISOString().split('T')[0] : '',
        titulo_executivo: data.titulo_executivo || '',
        descricao_pedido: data.descricao_pedido,
        valor_aluguel: parseFloat(data.valor_aluguel) || 0,
        meses_atraso: parseInt(data.meses_atraso) || 0,
        imovel_endereco: data.imovel_endereco || '',
        documentos_anexos: data.documentos_anexos ? data.documentos_anexos.split('\n').map(doc => doc.trim()).filter(doc => doc) : [],
        urgencia_fundamentacao: data.urgencia_fundamentacao || '',
      });

      if (cleanedData.cpf_cnpj_parte_contraria.length !== 11 && cleanedData.cpf_cnpj_parte_contraria.length !== 14) {
        throw new Error('CPF/CNPJ inválido');
      }
      if (cleanedData.valor_execucao <= 0) {
        throw new Error('Valor da execução deve ser maior que 0');
      }

      const response = await api.post(ENDPOINTS.processual.peticao_execucao, cleanedData);
      setPeticao(response.data);
      toast.success('Petição de execução gerada com sucesso!');
    } catch (error) {
      const msg = error.response?.data?.detail || error.message || 'Erro ao gerar petição. Verifique os dados.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const gerarPDF = () => {
    if (!peticao?.texto_peticao) {
      toast.error('Nenhuma petição gerada para exportar.');
      return;
    }
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('Petição de Execução', 10, 10);
    doc.text(peticao.texto_peticao, 10, 20, { maxWidth: 190 });
    doc.save('peticao-execucao.pdf');
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          📜 Petição de Execução
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tipo de Petição
            </label>
            <input
              {...register('tipo_peticao', { required: 'O tipo de petição é obrigatório' })}
              className={`mt-1 block w-full p-3 border rounded-lg ${
                errors.tipo_peticao ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200`}
              placeholder="Ex.: Execução de Título Extrajudicial"
            />
            {errors.tipo_peticao && (
              <p className="mt-1 text-sm text-red-600">{errors.tipo_peticao.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Número do Processo (opcional)
            </label>
            <input
              {...register('numero_processo')}
              className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              placeholder="Ex.: 0001234-56.2023.8.26.0000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Parte Contrária
            </label>
            <input
              {...register('parte_contraria', { required: 'O nome da parte contrária é obrigatório' })}
              className={`mt-1 block w-full p-3 border rounded-lg ${
                errors.parte_contraria ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200`}
              placeholder="Nome da parte contrária"
            />
            {errors.parte_contraria && (
              <p className="mt-1 text-sm text-red-600">{errors.parte_contraria.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              CPF/CNPJ da Parte Contrária
            </label>
            <input
              {...register('cpf_cnpj_parte_contraria', {
                required: 'O CPF/CNPJ é obrigatório',
                pattern: {
                  value: /^(\d{11}|\d{14})$/,
                  message: 'CPF/CNPJ deve ter 11 ou 14 dígitos',
                },
              })}
              className={`mt-1 block w-full p-3 border rounded-lg ${
                errors.cpf_cnpj_parte_contraria ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200`}
              placeholder="Ex.: 123.456.789-00 ou 12.345.678/0001-99"
            />
            {errors.cpf_cnpj_parte_contraria && (
              <p className="mt-1 text-sm text-red-600">{errors.cpf_cnpj_parte_contraria.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Endereço da Parte Contrária (opcional)
            </label>
            <input
              {...register('endereco_parte_contraria')}
              className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              placeholder="Endereço da parte contrária"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Valor da Execução (R$)
            </label>
            <input
              type="number"
              step="0.01"
              {...register('valor_execucao', {
                required: 'O valor da execução é obrigatório',
                min: { value: 0.01, message: 'O valor da execução deve ser maior que 0' },
              })}
              className={`mt-1 block w-full p-3 border rounded-lg ${
                errors.valor_execucao ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200`}
              placeholder="Ex.: 10000.00"
            />
            {errors.valor_execucao && (
              <p className="mt-1 text-sm text-red-600">{errors.valor_execucao.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Data de Vencimento
            </label>
            <input
              type="date"
              {...register('data_vencimento', { required: 'A data de vencimento é obrigatória' })}
              className={`mt-1 block w-full p-3 border rounded-lg ${
                errors.data_vencimento ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200`}
            />
            {errors.data_vencimento && (
              <p className="mt-1 text-sm text-red-600">{errors.data_vencimento.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Título Executivo
            </label>
            <input
              {...register('titulo_executivo', { required: 'O título executivo é obrigatório' })}
              className={`mt-1 block w-full p-3 border rounded-lg ${
                errors.titulo_executivo ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200`}
              placeholder="Ex.: Contrato de Mútuo, Cheque"
            />
            {errors.titulo_executivo && (
              <p className="mt-1 text-sm text-red-600">{errors.titulo_executivo.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Descrição do Pedido
            </label>
            <textarea
              {...register('descricao_pedido', { required: 'A descrição do pedido é obrigatória' })}
              className={`mt-1 block w-full p-3 border rounded-lg ${
                errors.descricao_pedido ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200`}
              placeholder="Descreva o pedido de execução"
              rows="5"
            />
            {errors.descricao_pedido && (
              <p className="mt-1 text-sm text-red-600">{errors.descricao_pedido.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Valor do Aluguel (R$, opcional)
            </label>
            <input
              type="number"
              step="0.01"
              {...register('valor_aluguel')}
              className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              placeholder="Ex.: 2000.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Meses em Atraso (opcional)
            </label>
            <input
              type="number"
              {...register('meses_atraso')}
              className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              placeholder="Ex.: 3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Endereço do Imóvel (opcional)
            </label>
            <input
              {...register('imovel_endereco')}
              className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              placeholder="Ex.: Rua das Flores, 123, São Paulo - SP"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Documentos Anexos (um por linha, opcional)
            </label>
            <textarea
              {...register('documentos_anexos')}
              className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              placeholder="Ex.: Contrato\nCheque\nNotificação Extrajudicial"
              rows="4"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Fundamentação de Urgência (opcional)
            </label>
            <textarea
              {...register('urgencia_fundamentacao')}
              className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              placeholder="Descreva a fundamentação para urgência, se aplicável"
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
              {loading ? '⏳ Gerando...' : 'Gerar Petição'}
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

        {peticao && (
          <div className="mt-8 border-t border-gray-200 dark:border-gray-600 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              📋 Preview da Petição
            </h3>
            <div ref={previewRef} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">
                {peticao.texto_peticao}
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

export default PeticaoExecucao;
