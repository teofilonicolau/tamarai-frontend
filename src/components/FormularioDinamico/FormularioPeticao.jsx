// src/components/FormularioDinamico/FormularioPeticao.jsx
import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { ENDPOINTS } from '../../config/endpoints';
import { normalizePayload } from '../../utils/payload';
import Preview from './Preview';

const FormularioPeticao = ({ tipoPeticao }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [peticaoGerada, setPeticaoGerada] = useState(null);
  const previewRef = useRef(null);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const cleanedData = normalizePayload({
        tipo_peticao: tipoPeticao,
        parte_contraria: data.parte_contraria || '',
        cpf_cnpj_parte_contraria: data.cpf_cnpj_parte_contraria ? data.cpf_cnpj_parte_contraria.replace(/\D/g, '') : '',
        endereco_parte_contraria: data.endereco_parte_contraria || '',
        valor_causa: parseFloat(data.valor_causa) || 0,
        data_fato_gerador: data.data_fato_gerador ? new Date(data.data_fato_gerador).toISOString().split('T')[0] : '',
        descricao_caso: data.descricao_caso || '',
        documentos_anexos: data.documentos_anexos ? data.documentos_anexos.split('\n').map(doc => doc.trim()).filter(Boolean) : []
      });

      // Validações genéricas
      if (cleanedData.cpf_cnpj_parte_contraria && cleanedData.cpf_cnpj_parte_contraria.length !== 11 && cleanedData.cpf_cnpj_parte_contraria.length !== 14) {
        throw new Error('CPF/CNPJ inválido');
      }
      if (cleanedData.valor_causa <= 0) throw new Error('Valor da causa deve ser maior que 0');
      if (!cleanedData.descricao_caso) throw new Error('Descrição do caso é obrigatória');

      let endpoint;
      switch (tipoPeticao) {
        case 'peticao-vinculo':
          endpoint = ENDPOINTS.trabalhista.peticao_vinculo;
          break;
        case 'quesitos-insalubridade':
          endpoint = ENDPOINTS.trabalhista.quesitos_insalubridade;
          break;
        case 'peticao-vicio-produto':
          endpoint = ENDPOINTS.consumidor.peticao_vicio_produto;
          break;
        case 'peticao-cobranca-indevida':
          endpoint = ENDPOINTS.consumidor.peticao_cobranca_indevida;
          break;
        case 'peticao-cobranca':
          endpoint = ENDPOINTS.civil.peticao_cobranca;
          break;
        case 'peticao-indenizacao':
          endpoint = ENDPOINTS.civil.peticao_indenizacao;
          break;
        case 'peticao-execucao':
          endpoint = ENDPOINTS.processual.peticao_execucao;
          break;
        case 'peticao-monitoria':
          endpoint = ENDPOINTS.processual.peticao_monitoria;
          break;
        default:
          throw new Error('Tipo de petição inválido');
      }

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

  const copiarTexto = () => {
    if (previewRef.current) {
      navigator.clipboard.writeText(previewRef.current.innerText);
      toast.success('Texto copiado!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Gerar Petição
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Preencha os dados para gerar sua petição
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Parte Contrária
            </label>
            <input
              {...register('parte_contraria', { required: 'Parte contrária é obrigatória' })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Nome da parte contrária"
            />
            {errors.parte_contraria && (
              <p className="text-red-600 text-sm mt-1">{errors.parte_contraria.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              CPF/CNPJ da Parte Contrária
            </label>
            <input
              {...register('cpf_cnpj_parte_contraria')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="CPF ou CNPJ"
            />
            {errors.cpf_cnpj_parte_contraria && (
              <p className="text-red-600 text-sm mt-1">{errors.cpf_cnpj_parte_contraria.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Endereço da Parte Contrária
            </label>
            <input
              {...register('endereco_parte_contraria')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Endereço completo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Valor da Causa
            </label>
            <input
              {...register('valor_causa', { required: 'Valor da causa é obrigatório', valueAsNumber: true })}
              type="number"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Valor em reais"
            />
            {errors.valor_causa && (
              <p className="text-red-600 text-sm mt-1">{errors.valor_causa.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Data do Fato Gerador
            </label>
            <input
              {...register('data_fato_gerador', { required: 'Data é obrigatória' })}
              type="date"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            {errors.data_fato_gerador && (
              <p className="text-red-600 text-sm mt-1">{errors.data_fato_gerador.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Descrição do Caso
            </label>
            <textarea
              {...register('descricao_caso', { required: 'Descrição é obrigatória' })}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Descreva o caso"
            />
            {errors.descricao_caso && (
              <p className="text-red-600 text-sm mt-1">{errors.descricao_caso.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Documentos Anexos
            </label>
            <textarea
              {...register('documentos_anexos')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Liste os documentos, um por linha"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Gerando...' : '📄 Gerar Petição'}
          </button>
          <button
            type="button"
            onClick={() => reset()}
            disabled={loading}
            className="w-full mt-2 bg-red-600 text-white py-3 px-6 rounded-lg"
          >
            Limpar Formulário
          </button>
        </form>

        {peticaoGerada && (
          <div className="mt-8">
            <Preview content={peticaoGerada.texto_peticao} title="Preview da Petição" />
            <button onClick={copiarTexto} className="mt-4 bg-blue-600 text-white py-2 px-4 rounded">
              Copiar Texto
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormularioPeticao;