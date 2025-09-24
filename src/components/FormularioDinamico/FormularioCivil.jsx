// src/components/FormularioDinamico/FormularioCivil.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { ENDPOINTS } from '../../config/endpoints';

const FormularioCivil = ({ tipoPeticao }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [peticaoGerada, setPeticaoGerada] = useState(null);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const cleanedData = {
        tipo_acao: data.tipo_acao,
        data_fato_gerador: data.data_fato_gerador ? new Date(data.data_fato_gerador).toISOString().split('T')[0] : '',
        descricao_caso: data.descricao_caso,
        parte_contraria: data.parte_contraria,
        cpf_cnpj_parte_contraria: data.cpf_cnpj_parte_contraria.replace(/\D/g, ''),
        endereco_parte_contraria: data.endereco_parte_contraria || '',
        valor_causa: parseFloat(data.valor_causa) || 0,
        ...(tipoPeticao === 'peticao-cobranca' && {
          valor_divida: parseFloat(data.valor_divida) || 0
        }),
        ...(tipoPeticao === 'peticao-indenizacao' && {
          valor_danos_materiais: parseFloat(data.valor_danos_materiais) || 0,
          valor_danos_morais: parseFloat(data.valor_danos_morais) || 0
        }),
        tentativa_acordo_extrajudicial: data.tentativa_acordo_extrajudicial || false,
        urgencia_caso: data.urgencia_caso || false,
        documentos_comprobatorios: data.documentos_comprobatorios ? data.documentos_comprobatorios.split('\n').map(doc => doc.trim()).filter(doc => doc) : []
      };

      if (cleanedData.valor_causa <= 0) {
        throw new Error('Valor da causa deve ser maior que 0');
      }
      if (!cleanedData.data_fato_gerador) {
        throw new Error('Data do fato gerador é obrigatória');
      }

      const endpoint = tipoPeticao === 'peticao-cobranca' 
        ? ENDPOINTS.civil.peticao_cobranca
        : ENDPOINTS.civil.peticao_indenizacao;

      const response = await api.post(endpoint, cleanedData);
      setPeticaoGerada(response.data);
      toast.success('Petição gerada com sucesso!');
    } catch (error) {
      const msg = error.response?.data?.detail || error.message || 'Erro ao gerar petição. Verifique os dados.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const gerarPDF = async () => {
    try {
      const endpoint = tipoPeticao === 'peticao-cobranca' 
        ? `${ENDPOINTS.civil.peticao_cobranca}/pdf`
        : `${ENDPOINTS.civil.peticao_indenizacao}/pdf`;

      const response = await api.post(endpoint, peticaoGerada.dados_utilizados, { responseType: 'blob' });
      
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
    return tipoPeticao === 'peticao-cobranca' 
      ? '💰 Petição - Ação de Cobrança'
      : '⚖️ Petição - Ação de Indenização';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {getTitulo()}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Preencha os dados para gerar sua petição de direito civil
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Seção 1: Dados da Ação */}
          <div className="border-b border-gray-200 dark:border-gray-600 pb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              📋 Dados da Ação
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Tipo de Ação *
                </label>
                <input
                  {...register('tipo_acao', { required: 'Tipo de ação é obrigatório' })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={tipoPeticao === 'peticao-cobranca' ? 'Ação de Cobrança' : 'Ação de Indenização'}
                  defaultValue={tipoPeticao === 'peticao-cobranca' ? 'Ação de Cobrança' : 'Ação de Indenização'}
                />
                {errors.tipo_acao && (
                  <p className="text-red-600 text-sm mt-1">{errors.tipo_acao.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Data do Fato Gerador *
                </label>
                <input
                  type="date"
                  {...register('data_fato_gerador', { required: 'Data é obrigatória' })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                {errors.data_fato_gerador && (
                  <p className="text-red-600 text-sm mt-1">{errors.data_fato_gerador.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Descrição do Caso *
                </label>
                <textarea
                  {...register('descricao_caso', { required: 'Descrição é obrigatória' })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Descreva detalhadamente os fatos que motivam a ação..."
                />
                {errors.descricao_caso && (
                  <p className="text-red-600 text-sm mt-1">{errors.descricao_caso.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Seção 2: Dados da Parte Contrária */}
          <div className="border-b border-gray-200 dark:border-gray-600 pb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              👤 Dados da Parte Contrária
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Nome Completo *
                </label>
                <input
                  {...register('parte_contraria', { required: 'Nome é obrigatório' })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Nome da parte contrária"
                />
                {errors.parte_contraria && (
                  <p className="text-red-600 text-sm mt-1">{errors.parte_contraria.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  CPF/CNPJ *
                </label>
                <input
                  {...register('cpf_cnpj_parte_contraria', { required: 'CPF/CNPJ é obrigatório' })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="000.000.000-00 ou 00.000.000/0000-00"
                />
                {errors.cpf_cnpj_parte_contraria && (
                  <p className="text-red-600 text-sm mt-1">{errors.cpf_cnpj_parte_contraria.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Endereço Completo
                </label>
                <textarea
                  {...register('endereco_parte_contraria')}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Endereço completo da parte contrária"
                />
              </div>
            </div>
          </div>

          {/* Seção 3: Valores */}
          <div className="border-b border-gray-200 dark:border-gray-600 pb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              💰 Valores da Ação
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Valor da Causa (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('valor_causa', { 
                    required: 'Valor da causa é obrigatório',
                    min: { value: 0.01, message: 'Valor deve ser maior que 0' }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0.00"
                />
                {errors.valor_causa && (
                  <p className="text-red-600 text-sm mt-1">{errors.valor_causa.message}</p>
                )}
              </div>

              {tipoPeticao === 'peticao-cobranca' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Valor da Dívida (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('valor_divida')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="0.00"
                  />
                </div>
              )}

              {tipoPeticao === 'peticao-indenizacao' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Danos Materiais (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('valor_danos_materiais')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Danos Morais (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('valor_danos_morais')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="0.00"
                    />
                  </div>
                </>
              )}
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
                  {...register('tentativa_acordo_extrajudicial')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Houve tentativa de acordo extrajudicial
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('urgencia_caso')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Caso de urgência
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Documentos Comprobatórios (um por linha)
                </label>
                <textarea
                  {...register('documentos_comprobatorios')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Ex:&#10;Contrato assinado&#10;Comprovantes de pagamento&#10;Correspondências"
                />
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50"
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

export default FormularioCivil;