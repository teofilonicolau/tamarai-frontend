// src/components/FormularioDinamico/FormularioTrabalhista.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { ENDPOINTS } from '../../config/endpoints';

const FormularioTrabalhista = ({ tipoPeticao }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [peticaoGerada, setPeticaoGerada] = useState(null);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const endpoint = tipoPeticao === 'peticao-vinculo' 
        ? ENDPOINTS.trabalhista.peticao_vinculo
        : ENDPOINTS.trabalhista.quesitos_insalubridade;
      
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
      const endpoint = tipoPeticao === 'peticao-vinculo' 
        ? `${ENDPOINTS.trabalhista.peticao_vinculo}/pdf`
        : `${ENDPOINTS.trabalhista.quesitos_insalubridade}/pdf`;
      
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
    return tipoPeticao === 'peticao-vinculo' 
      ? '🤝 Petição - Vínculo Empregatício'
      : '⚠️ Quesitos - Insalubridade';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {getTitulo()}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Preencha os dados para gerar sua petição trabalhista
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
                  placeholder={tipoPeticao === 'peticao-vinculo' ? 'Reconhecimento de Vínculo Empregatício' : 'Perícia de Insalubridade'}
                />
                {errors.tipo_acao && (
                  <p className="text-red-600 text-sm mt-1">{errors.tipo_acao.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Cargo/Função *
                </label>
                <input
                  {...register('cargo_funcao', { required: 'Cargo é obrigatório' })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Ex: Auxiliar de Produção"
                />
                {errors.cargo_funcao && (
                  <p className="text-red-600 text-sm mt-1">{errors.cargo_funcao.message}</p>
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
                  placeholder="Razão social da empresa"
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
            </div>
          </div>

          {/* Seção 3: Período de Trabalho */}
          <div className="border-b border-gray-200 dark:border-gray-600 pb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              📅 Período de Trabalho
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Data de Início *
                </label>
                <input
                  type="date"
                  {...register('periodo_trabalho_inicio', { required: 'Data de início é obrigatória' })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                {errors.periodo_trabalho_inicio && (
                  <p className="text-red-600 text-sm mt-1">{errors.periodo_trabalho_inicio.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Data de Término
                </label>
                <input
                  type="date"
                  {...register('periodo_trabalho_fim')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Seção 4: Dados Salariais */}
          <div className="border-b border-gray-200 dark:border-gray-600 pb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              💰 Dados Salariais
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Salário Registrado (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('salario_registrado')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Salário Real (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('salario_real')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Seção 5: Jornada de Trabalho */}
          <div className="border-b border-gray-200 dark:border-gray-600 pb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              ⏰ Jornada de Trabalho
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Jornada Contratual
                </label>
                <select
                  {...register('jornada_contratual')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="44h semanais">44h semanais</option>
                  <option value="40h semanais">40h semanais</option>
                  <option value="36h semanais">36h semanais</option>
                  <option value="30h semanais">30h semanais</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Jornada Real
                </label>
                <input
                  {...register('jornada_real')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Ex: 10h diárias"
                />
              </div>
            </div>
          </div>

          {/* Seção 6: Condições de Trabalho */}
          <div className="border-b border-gray-200 dark:border-gray-600 pb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              ⚠️ Condições de Trabalho
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('horas_extras_habituais')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Horas extras habituais
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('adicional_insalubridade')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Adicional de insalubridade
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('adicional_periculosidade')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Adicional de periculosidade
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('equipamentos_seguranca')}
                  defaultChecked={true}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Equipamentos de segurança fornecidos
                </span>
              </div>
            </div>
          </div>

          {/* Seção 7: Provas */}
          <div className="border-b border-gray-200 dark:border-gray-600 pb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              📋 Provas e Testemunhas
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Testemunhas (uma por linha)
                </label>
                <textarea
                  {...register('testemunhas')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Ex:&#10;João Silva - Colega de trabalho&#10;Maria Santos - Supervisora"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Documentos Comprobatórios (uma por linha)
                </label>
                <textarea
                  {...register('documentos_comprobatorios')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Ex:&#10;Contracheques&#10;Cartão de ponto&#10;Fotos do ambiente de trabalho"
                />
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
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
                {tipoPeticao === 'quesitos-insalubridade' 
                  ? peticaoGerada.quesitos?.join('\n\n') || JSON.stringify(peticaoGerada, null, 2)
                  : peticaoGerada.texto_peticao || JSON.stringify(peticaoGerada, null, 2)
                }
              </pre>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default FormularioTrabalhista;