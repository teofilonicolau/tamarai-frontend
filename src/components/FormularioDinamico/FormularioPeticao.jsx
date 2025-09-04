import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

const FormularioPeticao = ({ tipoPeticao }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [peticaoGerada, setPeticaoGerada] = useState(null);
  const [mostrarCalculos, setMostrarCalculos] = useState(false);

  // Campos dinâmicos baseados no tipo de petição
  const camposDinamicos = {
    'aposentadoria-invalidez': ['informacoes_medicas', 'cid_principal', 'laudos_medicos'],
    'aposentadoria-especial': ['atividade_especial', 'exposicao_agentes_nocivos'],
    'bpc-loas': ['renda_familiar', 'tipo_deficiencia'],
    'pensao-morte': ['possui_dependentes'],
    'salario-maternidade': ['tipo_parto'],
    'aposentadoria-rural': ['tipo_atividade_rural']
  };

  const camposVisiveis = camposDinamicos[tipoPeticao] || [];

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Gerar petição
      const response = await api.post(`/previdenciario/peticao-${tipoPeticao}`, data);
      setPeticaoGerada(response.data);
      toast.success('Petição gerada com sucesso!');
    } catch (error) {
      toast.error('Erro ao gerar petição');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const gerarPDF = async () => {
    try {
      const response = await api.post(`/previdenciario/peticao-pdf/${tipoPeticao}`, 
        peticaoGerada.dados_utilizados, 
        { responseType: 'blob' }
      );
      
      // Download do PDF
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `peticao_${tipoPeticao}_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('PDF baixado com sucesso!');
    } catch (error) {
      toast.error('Erro ao gerar PDF');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {tipoPeticao.replace('-', ' ').toUpperCase()}
          </h1>
          <p className="text-gray-600">
            Preencha os dados para gerar sua petição previdenciária
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Seção 1: Dados Pessoais */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              👤 Dados do Requerente
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo *
                </label>
                <input
                  {...register('nome', { required: 'Nome é obrigatório' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nome completo do requerente"
                />
                {errors.nome && (
                  <p className="text-red-600 text-sm mt-1">{errors.nome.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CPF *
                </label>
                <input
                  {...register('cpf', { required: 'CPF é obrigatório' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="000.000.000-00"
                />
                {errors.cpf && (
                  <p className="text-red-600 text-sm mt-1">{errors.cpf.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  RG
                </label>
                <input
                  {...register('rg')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Número do RG"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Órgão Emissor
                </label>
                <input
                  {...register('orgao_emissor')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: SSP/SP"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço Completo
                </label>
                <textarea
                  {...register('endereco_completo')}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Rua, número, bairro, cidade/estado"
                />
              </div>
            </div>
          </div>

          {/* Seção 2: Dados do Benefício */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              �� Dados do Benefício
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  DER (Data de Entrada do Requerimento)
                </label>
                <input
                  type="date"
                  {...register('der')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor da Causa (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('valor_causa')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="50000.00"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo da Recusa do INSS
                </label>
                <textarea
                  {...register('motivo_recusa')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Descreva o motivo da negativa do INSS..."
                />
              </div>
            </div>
          </div>

          {/* Seção 3: Campos Dinâmicos */}
          {camposVisiveis.length > 0 && (
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                🎯 Informações Específicas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {camposVisiveis.includes('informacoes_medicas') && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Informações Médicas
                    </label>
                    <textarea
                      {...register('informacoes_medicas')}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Diagnóstico, sintomas, limitações funcionais..."
                    />
                  </div>
                )}

                {camposVisiveis.includes('cid_principal') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CID Principal
                    </label>
                    <input
                      {...register('cid_principal')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ex: M79.3"
                    />
                  </div>
                )}

                {camposVisiveis.includes('atividade_especial') && (
                  <div className="md:col-span-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        {...register('atividade_especial')}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Houve exposição a agentes nocivos (Atividade Especial)?
                      </span>
                    </label>
                  </div>
                )}

                {camposVisiveis.includes('renda_familiar') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Renda Familiar (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('renda_familiar')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}

              </div>
            </div>
          )}

          {/* Seção 4: Opções Avançadas */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              ⚖️ Opções Processuais
            </h2>
            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('justica_gratuita')}
                  defaultChecked={true}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Requerimento de Justiça Gratuita
                </span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('tutela_antecipada')}
                  defaultChecked={true}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Requerimento de Tutela Antecipada
                </span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={mostrarCalculos}
                  onChange={(e) => setMostrarCalculos(e.target.checked)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  🧮 Incluir Cálculos e Planilhas (Premium)
                </span>
              </label>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Gerando...' : '📄 Gerar Petição'}
            </button>

            {peticaoGerada && (
              <button
                type="button"
                onClick={gerarPDF}
                className="bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                📥 Baixar PDF
              </button>
            )}
          </div>

        </form>

        {/* Preview da Petição */}
        {peticaoGerada && (
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📋 Preview da Petição
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-800">
                {peticaoGerada.texto_peticao}
              </pre>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default FormularioPeticao;