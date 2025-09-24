// src/components/FormularioDinamico/FormularioPeticao.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { ENDPOINTS } from '../../config/endpoints';

const FormularioPeticao = ({ tipoPeticao }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
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
      // Limpar CPF e formatar dados
      const cleanedData = {
        ...data,
        tipo_beneficio: tipoPeticao,
        cpf: data.cpf.replace(/\D/g, ''),
        der: data.der ? new Date(data.der).toISOString().split('T')[0] : '',
        valor_causa: parseFloat(data.valor_causa) || 0,
        informacoes_medicas: data.informacoes_medicas || '',
        cid_principal: data.cid_principal || '',
        exposicao_agentes_nocivos: data.exposicao_agentes_nocivos || '',
        motivo_recusa: data.motivo_recusa || '',
        endereco_completo: data.endereco_completo || '',
        rg: data.rg || '',
        orgao_emissor: data.orgao_emissor || ''
      };

      // Validação básica do CPF
      if (cleanedData.cpf.length !== 11) {
        throw new Error('CPF deve conter 11 dígitos');
      }

      // Mapear endpoint baseado no tipo de petição
      const endpointMap = {
        'auxilio-doenca': ENDPOINTS.previdenciario.auxilio_doenca,
        'aposentadoria-invalidez': ENDPOINTS.previdenciario.aposentadoria_invalidez,
        'aposentadoria-especial': ENDPOINTS.previdenciario.aposentadoria_especial,
        'aposentadoria-tempo-contribuicao': ENDPOINTS.previdenciario.aposentadoria_tempo_contribuicao,
        'aposentadoria-rural': ENDPOINTS.previdenciario.aposentadoria_rural,
        'pensao-morte': ENDPOINTS.previdenciario.pensao_morte,
        'bpc-loas': ENDPOINTS.previdenciario.bpc_loas,
        'salario-maternidade': ENDPOINTS.previdenciario.salario_maternidade,
        'revisao-vida-toda': ENDPOINTS.previdenciario.revisao_vida_toda,
        'revisao-beneficio': ENDPOINTS.previdenciario.revisao_beneficio
      };

      const endpoint = endpointMap[tipoPeticao] || `/previdenciario/peticao-${tipoPeticao}`;
      const response = await api.post(endpoint, cleanedData);
      setPeticaoGerada(response.data);
      toast.success('Petição gerada com sucesso!');
    } catch (error) {
      const msg = error.response?.status === 422 
        ? error.response?.data?.detail || 'Erro de validação nos dados. Verifique os campos: CPF, datas, valores.'
        : 'Erro ao gerar petição. Tente novamente.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const gerarPDF = async () => {
    try {
      const response = await api.post(`${ENDPOINTS.previdenciario.peticao_pdf}/${tipoPeticao}`, 
        peticaoGerada.dados_utilizados, 
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `peticao_${tipoPeticao}_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('PDF baixado com sucesso!');
    } catch {
      toast.error('Erro ao gerar PDF');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="theme-card p-6">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {tipoPeticao.replace('-', ' ').toUpperCase()}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Preencha os dados para gerar sua petição previdenciária
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Seção 1: Dados Pessoais */}
          <div className="border-b border-gray-200 dark:border-gray-600 pb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              👤 Dados do Requerente
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Nome Completo *
                </label>
                <input
                  {...register('nome', { required: 'Nome é obrigatório' })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Nome completo do requerente"
                />
                {errors.nome && (
                  <p className="text-red-600 text-sm mt-1">{errors.nome.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  CPF *
                </label>
                <input
                  {...register('cpf', { 
                    required: 'CPF é obrigatório',
                    pattern: {
                      value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                      message: 'Formato de CPF inválido (use 000.000.000-00)'
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="000.000.000-00"
                />
                {errors.cpf && (
                  <p className="text-red-600 text-sm mt-1">{errors.cpf.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  RG
                </label>
                <input
                  {...register('rg')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Número do RG"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Órgão Emissor
                </label>
                <input
                  {...register('orgao_emissor')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Ex: SSP/SP"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Endereço Completo
                </label>
                <textarea
                  {...register('endereco_completo')}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Rua, número, bairro, cidade/estado"
                />
              </div>
            </div>
          </div>

          {/* Seção 2: Dados do Benefício */}
          <div className="border-b border-gray-200 dark:border-gray-600 pb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              📋 Dados do Benefício
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  DER (Data de Entrada do Requerimento)
                </label>
                <input
                  type="date"
                  {...register('der')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Valor da Causa (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('valor_causa', {
                    min: { value: 0, message: 'Valor deve ser maior ou igual a 0' }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="50000.00"
                />
                {errors.valor_causa && (
                  <p className="text-red-600 text-sm mt-1">{errors.valor_causa.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Motivo da Recusa do INSS
                </label>
                <textarea
                  {...register('motivo_recusa')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Descreva o motivo da negativa do INSS..."
                />
              </div>
            </div>
          </div>

          {/* Seção 3: Campos Dinâmicos */}
          {camposVisiveis.length > 0 && (
            <div className="border-b border-gray-200 dark:border-gray-600 pb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                🎯 Informações Específicas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {camposVisiveis.includes('informacoes_medicas') && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Informações Médicas
                    </label>
                    <textarea
                      {...register('informacoes_medicas')}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Diagnóstico, sintomas, limitações funcionais..."
                    />
                  </div>
                )}

                {camposVisiveis.includes('cid_principal') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      CID Principal
                    </label>
                    <input
                      {...register('cid_principal')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Houve exposição a agentes nocivos (Atividade Especial)?
                      </span>
                    </label>
                  </div>
                )}

                {camposVisiveis.includes('exposicao_agentes_nocivos') && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Exposição a Agentes Nocivos
                    </label>
                    <textarea
                      {...register('exposicao_agentes_nocivos')}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Descreva os agentes nocivos e período de exposição..."
                    />
                  </div>
                )}

                {camposVisiveis.includes('renda_familiar') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Renda Familiar (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('renda_familiar', {
                        min: { value: 0, message: 'Renda deve ser maior ou igual a 0' }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    {errors.renda_familiar && (
                      <p className="text-red-600 text-sm mt-1">{errors.renda_familiar.message}</p>
                    )}
                  </div>
                )}

                {camposVisiveis.includes('tipo_deficiencia') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Tipo de Deficiência
                    </label>
                    <input
                      {...register('tipo_deficiencia')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Descreva o tipo de deficiência"
                    />
                  </div>
                )}

                {camposVisiveis.includes('possui_dependentes') && (
                  <div className="md:col-span-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        {...register('possui_dependentes')}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Possui Dependentes?
                      </span>
                    </label>
                  </div>
                )}

                {camposVisiveis.includes('tipo_parto') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Tipo de Parto
                    </label>
                    <select
                      {...register('tipo_parto')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Selecione</option>
                      <option value="normal">Normal</option>
                      <option value="cesariana">Cesariana</option>
                    </select>
                  </div>
                )}

                {camposVisiveis.includes('tipo_atividade_rural') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Tipo de Atividade Rural
                    </label>
                    <input
                      {...register('tipo_atividade_rural')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Descreva a atividade rural"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Seção 4: Opções Avançadas */}
          <div className="border-b border-gray-200 dark:border-gray-600 pb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
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
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
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
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
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
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
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
              className="theme-button flex-1"
            >
              {loading ? 'Gerando...' : '📄 Gerar Petição'}
            </button>

            {peticaoGerada && (
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

export default FormularioPeticao;