// src/components/FormularioDinamico/FormularioConsumidor.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { ENDPOINTS } from '../../config/endpoints';

const FormularioConsumidor = ({ tipoPeticao }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [peticaoGerada, setPeticaoGerada] = useState(null);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const endpoint = tipoPeticao === 'peticao-vicio-produto' 
        ? ENDPOINTS.consumidor.peticao_vicio_produto
        : ENDPOINTS.consumidor.peticao_cobranca_indevida;
      
      const response = await api.post(endpoint, data);
      setPeticaoGerada(response.data);
      toast.success('Petição gerada com sucesso!');
    } catch {
      toast.error('Erro ao gerar petição');
    } finally {
      setLoading(false);
    }
  };

  const gerarPDF = async () => {
    try {
      const endpoint = tipoPeticao === 'peticao-vicio-produto' 
        ? `${ENDPOINTS.consumidor.peticao_vicio_produto}/pdf`
        : `${ENDPOINTS.consumidor.peticao_cobranca_indevida}/pdf`;
      
      const response = await api.post(endpoint, 
        peticaoGerada.dados_utilizados, 
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${tipoPeticao}_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('PDF baixado com sucesso!');
    } catch {
      toast.error('Erro ao gerar PDF');
    }
  };

  const getTitulo = () => {
    return tipoPeticao === 'peticao-vicio-produto' 
      ? '📱 Petição - Vício do Produto'
      : '💳 Petição - Cobrança Indevida';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {getTitulo()}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Preencha os dados para gerar sua petição de direito do consumidor
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Seção 1: Dados do Problema */}
          <div className="border-b border-gray-200 dark:border-gray-600 pb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              🔍 Dados do Problema
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Tipo do Problema *
                </label>
                <input
                  {...register('tipo_problema', { required: 'Tipo do problema é obrigatório' })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={tipoPeticao === 'peticao-vicio-produto' ? 'Ex: Defeito no produto' : 'Ex: Cobrança indevida'}
                />
                {errors.tipo_problema && (
                  <p className="text-red-600 text-sm mt-1">{errors.tipo_problema.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Data da Ocorrência *
                </label>
                <input
                  type="date"
                  {...register('data_ocorrencia', { required: 'Data é obrigatória' })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                {errors.data_ocorrencia && (
                  <p className="text-red-600 text-sm mt-1">{errors.data_ocorrencia.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Descrição Detalhada do Problema *
                </label>
                <textarea
                  {...register('descricao_problema', { required: 'Descrição é obrigatória' })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Descreva detalhadamente o que aconteceu..."
                />
                {errors.descricao_problema && (
                  <p className="text-red-600 text-sm mt-1">{errors.descricao_problema.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Seção 2: Dados da Empresa */}
          <div className="border-b border-gray-200 dark:border-gray-600 pb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              🏢 Dados da Empresa
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Nome da Empresa *
                </label>
                <input
                  {...register('empresa_ré', { required: 'Nome da empresa é obrigatório' })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Nome da empresa responsável"
                />
                {errors.empresa_ré && (
                  <p className="text-red-600 text-sm mt-1">{errors.empresa_ré.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  CNPJ *
                </label>
                <input
                  {...register('cnpj_empresa', { required: 'CNPJ é obrigatório' })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="00.000.000/0000-00"
                />
                {errors.cnpj_empresa && (
                  <p className="text-red-600 text-sm mt-1">{errors.cnpj_empresa.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Endereço da Empresa
                </label>
                <textarea
                  {...register('endereco_empresa')}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Endereço completo da empresa"
                />
              </div>
            </div>
          </div>

          {/* Seção 3: Valores */}
          <div className="border-b border-gray-200 dark:border-gray-600 pb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              💰 Valores Envolvidos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Valor do Produto/Serviço (R\$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('valor_produto_servico')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Valor do Prejuízo (R\$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('valor_prejuizo')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Seção 4: Informações Adicionais */}
          <div className="border-b border-gray-200 dark:border-gray-600 pb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              📋 Informações Adicionais
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('nota_fiscal')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Possui nota fiscal
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('garantia_vigente')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Garantia ainda vigente
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('tentativa_solucao_amigavel')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Houve tentativa de solução amigável
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Provas Disponíveis (uma por linha)
                </label>
                <textarea
                  {...register('provas_disponíveis')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Ex:&#10;Fotos do produto defeituoso&#10;Comprovantes de pagamento&#10;Correspondências com a empresa"
                />
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Gerando...' : '📄 Gerar Petição'}
            </button>

            {peticaoGerada && (
              <button
                type="button"
                onClick={gerarPDF}
                className="bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700"
              >
                📥 Baixar PDF
              </button>
            )}
          </div>

        </form>

        {/* Preview da Petição */}
        {peticaoGerada && (
          <div className="mt-8 border-t border-gray-200 dark:border-gray-600 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              📋 Preview da Petição
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">
                {peticaoGerada.texto_peticao}
              </pre>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default FormularioConsumidor;