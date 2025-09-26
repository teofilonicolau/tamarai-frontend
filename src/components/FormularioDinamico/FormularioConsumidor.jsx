
import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { ENDPOINTS } from '../../config/endpoints';
import { normalizePayload } from '../../utils/payload';
import jsPDF from 'jspdf';

const FormularioConsumidor = ({ tipoPeticao }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [peticaoGerada, setPeticaoGerada] = useState(null);
  const previewRef = useRef(null);

  const onSubmit = async (data) => {
    setLoading(true);
    setPeticaoGerada(null);
    try {
      const cleanedData = normalizePayload({
        tipo_problema: data.tipo_problema,
        data_ocorrencia: data.data_ocorrencia ? new Date(data.data_ocorrencia).toISOString().split('T')[0] : '',
        descricao_problema: data.descricao_problema,
        empresa_re: data.empresa_re,
        cnpj_empresa: data.cnpj_empresa.replace(/\D/g, ''),
        endereco_empresa: data.endereco_empresa || '',
        valor_produto_servico: parseFloat(data.valor_produto_servico) || 0,
        valor_prejuizo: parseFloat(data.valor_prejuizo) || 0,
        possui_nota_fiscal: data.possui_nota_fiscal || false,
        garantia_vigente: data.garantia_vigente || false,
        tentativa_solucao_amigavel: data.tentativa_solucao_amigavel || false,
        provas_disponiveis: data.provas_disponiveis
          ? data.provas_disponiveis.split('\n').map(p => p.trim()).filter(p => p)
          : [],
      });

      if (cleanedData.cnpj_empresa.length !== 14) {
        throw new Error('CNPJ deve ter 14 dígitos');
      }
      if (!cleanedData.data_ocorrencia) {
        throw new Error('Data da ocorrência é obrigatória');
      }
      if (cleanedData.valor_produto_servico <= 0 && cleanedData.valor_prejuizo <= 0) {
        throw new Error('Informe pelo menos um valor');
      }

      const endpoint = tipoPeticao === 'peticao-vicio-produto'
        ? ENDPOINTS.consumidor.peticao_vicio_produto
        : ENDPOINTS.consumidor.peticao_cobranca_indevida;

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
    doc.text('Petição Consumidor', 10, 10);
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
    return tipoPeticao === 'peticao-vicio-produto'
      ? 'Petição por Vício de Produto'
      : 'Petição por Cobrança Indevida';
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
              Tipo de Problema
            </label>
            <input
              {...register('tipo_problema', { required: 'O tipo de problema é obrigatório' })}
              className={`mt-1 block w-full p-3 border rounded-lg ${
                errors.tipo_problema ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200`}
              placeholder="Ex.: Defeito em produto, cobrança indevida"
            />
            {errors.tipo_problema && (
              <p className="mt-1 text-sm text-red-600">{errors.tipo_problema.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Data da Ocorrência
            </label>
            <input
              type="date"
              {...register('data_ocorrencia', { required: 'A data da ocorrência é obrigatória' })}
              className={`mt-1 block w-full p-3 border rounded-lg ${
                errors.data_ocorrencia ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200`}
            />
            {errors.data_ocorrencia && (
              <p className="mt-1 text-sm text-red-600">{errors.data_ocorrencia.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Descrição do Problema
            </label>
            <textarea
              {...register('descricao_problema', { required: 'A descrição do problema é obrigatória' })}
              className={`mt-1 block w-full p-3 border rounded-lg ${
                errors.descricao_problema ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200`}
              placeholder="Descreva o problema enfrentado"
              rows="5"
            />
            {errors.descricao_problema && (
              <p className="mt-1 text-sm text-red-600">{errors.descricao_problema.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Empresa Ré
            </label>
            <input
              {...register('empresa_re', { required: 'O nome da empresa ré é obrigatório' })}
              className={`mt-1 block w-full p-3 border rounded-lg ${
                errors.empresa_re ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200`}
              placeholder="Nome da empresa ré"
            />
            {errors.empresa_re && (
              <p className="mt-1 text-sm text-red-600">{errors.empresa_re.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              CNPJ da Empresa
            </label>
            <input
              {...register('cnpj_empresa', {
                required: 'O CNPJ é obrigatório',
                pattern: {
                  value: /^\d{14}$/,
                  message: 'CNPJ deve ter 14 dígitos',
                },
              })}
              className={`mt-1 block w-full p-3 border rounded-lg ${
                errors.cnpj_empresa ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200`}
              placeholder="Ex.: 12.345.678/0001-99"
            />
            {errors.cnpj_empresa && (
              <p className="mt-1 text-sm text-red-600">{errors.cnpj_empresa.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Endereço da Empresa (opcional)
            </label>
            <input
              {...register('endereco_empresa')}
              className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              placeholder="Endereço da empresa ré"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Valor do Produto/Serviço
            </label>
            <input
              type="number"
              step="0.01"
              {...register('valor_produto_servico', {
                required: false,
                min: { value: 0, message: 'O valor deve ser maior ou igual a 0' },
              })}
              className={`mt-1 block w-full p-3 border rounded-lg ${
                errors.valor_produto_servico ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200`}
              placeholder="Ex.: 1000.00"
            />
            {errors.valor_produto_servico && (
              <p className="mt-1 text-sm text-red-600">{errors.valor_produto_servico.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Valor do Prejuízo
            </label>
            <input
              type="number"
              step="0.01"
              {...register('valor_prejuizo', {
                required: false,
                min: { value: 0, message: 'O valor deve ser maior ou igual a 0' },
              })}
              className={`mt-1 block w-full p-3 border rounded-lg ${
                errors.valor_prejuizo ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200`}
              placeholder="Ex.: 500.00"
            />
            {errors.valor_prejuizo && (
              <p className="mt-1 text-sm text-red-600">{errors.valor_prejuizo.message}</p>
            )}
          </div>
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                {...register('possui_nota_fiscal')}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <span>Possui Nota Fiscal</span>
            </label>
          </div>
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                {...register('garantia_vigente')}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <span>Garantia Vigente</span>
            </label>
          </div>
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                {...register('tentativa_solucao_amigavel')}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <span>Tentativa de Solução Amigável</span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Provas Disponíveis (um por linha, opcional)
            </label>
            <textarea
              {...register('provas_disponiveis')}
              className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              placeholder="Ex.: Nota Fiscal\nE-mails\nFotos do produto"
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

export default FormularioConsumidor;
