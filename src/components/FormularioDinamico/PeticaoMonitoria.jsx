import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

const PeticaoMonitoria = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [peticao, setPeticao] = useState(null);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await api.post('/processual-civil/peticao-monitoria', data);
      setPeticao(response.data);
      toast.success('Petição monitória gerada com sucesso!');
    } catch (error) {
      toast.error('Erro ao gerar petição');
    } finally {
      setLoading(false);
    }
  };

  const gerarPDF = async () => {
    try {
      const response = await api.post('/processual-civil/peticao-monitoria/pdf', 
        peticao.dados_utilizados, 
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `peticao_monitoria_${Date.now()}.pdf`);
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
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            📋 Petição Monitória
          </h1>
          <p className="text-gray-600">
            Gere petições de ação monitória para cobrança de dívidas
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Dados Básicos */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              📋 Dados Básicos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Petição *
                </label>
                <input
                  {...register('tipo_peticao', { required: 'Tipo é obrigatório' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Petição Inicial de Ação Monitória"
                  defaultValue="Petição Inicial de Ação Monitória"
                />
                {errors.tipo_peticao && (
                  <p className="text-red-600 text-sm mt-1">{errors.tipo_peticao.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número do Processo
                </label>
                <input
                  {...register('numero_processo')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="0000000-00.0000.0.00.0000"
                />
              </div>
            </div>
          </div>

          {/* Dados da Parte Contrária */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              👤 Dados do Devedor
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo *
                </label>
                <input
                  {...register('parte_contraria', { required: 'Nome é obrigatório' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Nome do devedor"
                />
                {errors.parte_contraria && (
                  <p className="text-red-600 text-sm mt-1">{errors.parte_contraria.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CPF/CNPJ *
                </label>
                <input
                  {...register('cpf_cnpj_parte_contraria', { required: 'CPF/CNPJ é obrigatório' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="000.000.000-00"
                />
                {errors.cpf_cnpj_parte_contraria && (
                  <p className="text-red-600 text-sm mt-1">{errors.cpf_cnpj_parte_contraria.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço Completo
                </label>
                <textarea
                  {...register('endereco_parte_contraria')}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Endereço completo do devedor"
                />
              </div>
            </div>
          </div>

          {/* Dados da Dívida */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              💰 Dados da Dívida
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor da Dívida (R\$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('valor_execucao', { required: 'Valor é obrigatório' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
                {errors.valor_execucao && (
                  <p className="text-red-600 text-sm mt-1">{errors.valor_execucao.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Vencimento
                </label>
                <input
                  type="date"
                  {...register('data_vencimento')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prova Escrita da Dívida
                </label>
                <input
                  {...register('titulo_executivo')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Contrato de prestação de serviços, Nota promissória, Cheque"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição da Obrigação *
                </label>
                <textarea
                  {...register('descricao_pedido', { required: 'Descrição é obrigatória' })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Descreva detalhadamente a origem da dívida, o contrato ou acordo firmado, as condições de pagamento..."
                />
                {errors.descricao_pedido && (
                  <p className="text-red-600 text-sm mt-1">{errors.descricao_pedido.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Dados Específicos (Locação) */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              🏠 Dados Específicos (se aplicável)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor Mensal (R\$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('valor_aluguel')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meses em Atraso
                </label>
                <input
                  type="number"
                  {...register('meses_atraso')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço do Imóvel
                </label>
                <input
                  {...register('imovel_endereco')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Endereço do imóvel (se aplicável)"
                />
              </div>
            </div>
          </div>

          {/* Provas e Documentos */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              📎 Provas e Documentos
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Documentos Comprobatórios (um por linha)
                </label>
                <textarea
                  {...register('documentos_anexos')}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex:&#10;Contrato original assinado&#10;Comprovantes de entrega/prestação do serviço&#10;Correspondências de cobrança&#10;Comprovantes de inadimplência"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fundamentação da Urgência
                </label>
                <textarea
                  {...register('urgencia_fundamentacao')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Justifique a urgência do caso, se aplicável (ex: risco de prescrição, necessidade de recursos para subsistência...)"
                />
              </div>
            </div>
          </div>

          {/* Opções Processuais */}
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
                  {...register('citacao_correios')}
                  defaultChecked={true}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Citação pelos Correios
                </span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('conversao_execucao')}
                  defaultChecked={true}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Conversão em Execução (caso de embargos)
                </span>
              </label>
            </div>
          </div>

          {/* Botões */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Gerando...' : '📋 Gerar Petição Monitória'}
            </button>

            {peticao && (
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

        {peticao && (
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📋 Preview da Petição
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-800">
                {peticao.texto_peticao}
              </pre>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PeticaoMonitoria;