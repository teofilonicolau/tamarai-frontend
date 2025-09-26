// src/components/FormularioDinamico/FormularioCivil.jsx
import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { ENDPOINTS } from '../../config/endpoints';
import { normalizePayload } from '../../utils/payload';
import jsPDF from 'jspdf';

const FormularioCivil = ({ tipoPeticao }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [peticaoGerada, setPeticaoGerada] = useState(null);
  const previewRef = useRef(null);

  const onSubmit = async (data) => {
    setLoading(true);
    setPeticaoGerada(null);
    try {
      const cleanedData = normalizePayload({
        tipo_acao: data.tipo_acao,
        data_fato_gerador: data.data_fato_gerador ? new Date(data.data_fato_gerador).toISOString().split('T')[0] : '',
        descricao_caso: data.descricao_caso,
        parte_contraria: data.parte_contraria,
        cpf_cnpj_parte_contraria: data.cpf_cnpj_parte_contraria.replace(/\D/g, ''),
        endereco_parte_contraria: data.endereco_parte_contraria || '',
        valor_causa: parseFloat(data.valor_causa) || 0,
        ...(tipoPeticao === 'peticao-cobranca' && {
          valor_divida: parseFloat(data.valor_divida) || 0,
        }),
        ...(tipoPeticao === 'peticao-indenizacao' && {
          valor_danos_materiais: parseFloat(data.valor_danos_materiais) || 0,
          valor_danos_morais: parseFloat(data.valor_danos_morais) || 0,
        }),
        tentativa_acordo_extrajudicial: data.tentativa_acordo_extrajudicial || false,
        urgencia_caso: data.urgencia_caso || false,
        documentos_comprobatorios: data.documentos_comprobatorios
          ? data.documentos_comprobatorios.split('\n').map(doc => doc.trim()).filter(doc => doc)
          : [],
      });

      if (cleanedData.cpf_cnpj_parte_contraria.length !== 11 && cleanedData.cpf_cnpj_parte_contraria.length !== 14) {
        throw new Error('CPF/CNPJ inválido');
      }
      if (!cleanedData.data_fato_gerador) {
        throw new Error('Data do fato gerador é obrigatória');
      }
      if (cleanedData.valor_causa <= 0) {
        throw new Error('Valor da causa deve ser maior que 0');
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

  const gerarPDF = () => {
    if (!peticaoGerada?.texto_peticao) {
      toast.error('Nenhuma petição gerada para exportar.');
      return;
    }
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('Petição Civil', 10, 10);
    doc.text(peticaoGerada.texto_peticao, 10, 20, { maxWidth: 190 });
    doc.save(`peticao-${tipoPeticao}.pdf`);
    toast.success('PDF gerado com sucesso!');
  };

  const copiarTexto = () => {
    if (previewRef.current) {
      navigator.clipboard.writeText(previewRef.current.innerText);
      toast.success('Texto copiado!');
    }
  };

  const getTitulo = () => {
    return tipoPeticao === 'peticao-cobranca'
      ? 'Petição de Cobrança'
      : 'Petição de Indenização';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          📜 {getTitulo()}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tipo de Ação
            </label>
            <input
              {...register('tipo_acao', { required: 'O tipo de ação é obrigatório' })}
              className={`mt-1 block w-full p-3 border rounded-lg ${
                errors.tipo_acao ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200`}
              placeholder="Ex.: Ação de Cobrança, Indenização"
            />
            {errors.tipo_acao && (
              <p className="mt-1 text-sm text-red-600">{errors.tipo_acao.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Data do Fato Gerador
            </label>
            <input
              type="date"
              {...register('data_fato_gerador', { required: 'A data do fato gerador é obrigatória' })}
              className={`mt-1 block w-full p-3 border rounded-lg ${
                errors.data_fato_gerador ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200`}
            />
            {errors.data_fato_gerador && (
              <p className="mt-1 text-sm text-red-600">{errors.data_fato_gerador.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Descrição do Caso
            </label>
            <textarea
              {...register('descricao_caso', { required: 'A descrição do caso é obrigatória' })}
              className={`mt-1 block w-full p-3 border rounded-lg ${
                errors.descricao_caso ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200`}
              placeholder="Descreva os fatos do caso"
              rows="5"
            />
            {errors.descricao_caso && (
              <p className="mt-1 text-sm text-red-600">{errors.descricao_caso.message}</p>
            )}
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
              Valor da Causa
            </label>
            <input
              type="number"
              step="0.01"
              {...register('valor_causa', {
                required: 'O valor da causa é obrigatório',
                min: { value: 0.01, message: 'O valor da causa deve ser maior que 0' },
              })}
              className={`mt-1 block w-full p-3 border rounded-lg ${
                errors.valor_causa ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200`}
              placeholder="Ex.: 10000.00"
            />
            {errors.valor_causa && (
              <p className="mt-1 text-sm text-red-600">{errors.valor_causa.message}</p>
            )}
          </div>
          {tipoPeticao === 'peticao-cobranca' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Valor da Dívida
              </label>
              <input
                type="number"
                step="0.01"
                {...register('valor_divida', {
                  required: 'O valor da dívida é obrigatório',
                  min: { value: 0.01, message: 'O valor da dívida deve ser maior que 0' },
                })}
                className={`mt-1 block w-full p-3 border rounded-lg ${
                  errors.valor_divida ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200`}
                placeholder="Ex.: 5000.00"
              />
              {errors.valor_divida && (
                <p className="mt-1 text-sm text-red-600">{errors.valor_divida.message}</p>
              )}
            </div>
          )}
          {tipoPeticao === 'peticao-indenizacao' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Valor dos Danos Materiais
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('valor_danos_materiais', {
                    required: 'O valor dos danos materiais é obrigatório',
                    min: { value: 0.01, message: 'O valor dos danos materiais deve ser maior que 0' },
                  })}
                  className={`mt-1 block w-full p-3 border rounded-lg ${
                    errors.valor_danos_materiais ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200`}
                  placeholder="Ex.: 3000.00"
                />
                {errors.valor_danos_materiais && (
                  <p className="mt-1 text-sm text-red-600">{errors.valor_danos_materiais.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Valor dos Danos Morais
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('valor_danos_morais', {
                    required: 'O valor dos danos morais é obrigatório',
                    min: { value: 0.01, message: 'O valor dos danos morais deve ser maior que 0' },
                  })}
                  className={`mt-1 block w-full p-3 border rounded-lg ${
                    errors.valor_danos_morais ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200`}
                  placeholder="Ex.: 2000.00"
                />
                {errors.valor_danos_morais && (
                  <p className="mt-1 text-sm text-red-600">{errors.valor_danos_morais.message}</p>
                )}
              </div>
            </>
          )}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                {...register('tentativa_acordo_extrajudicial')}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <span>Tentativa de Acordo Extrajudicial</span>
            </label>
          </div>
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                {...register('urgencia_caso')}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <span>Caso de Urgência</span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Documentos Comprobatórios (um por linha, opcional)
            </label>
            <textarea
              {...register('documentos_comprobatorios')}
              className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              placeholder="Ex.: Contrato\nNota Fiscal\nComprovante de Pagamento"
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

        {peticaoGerada && (
          <div className="mt-8 border-t border-gray-200 dark:border-gray-600 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              📋 Preview da Petição
            </h3>
            <div ref={previewRef} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">
                {peticaoGerada.texto_peticao}
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

export default FormularioCivil;
