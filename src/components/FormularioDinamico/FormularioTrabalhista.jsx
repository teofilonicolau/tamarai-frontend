// src/components/FormularioDinamico/FormularioTrabalhista.jsx
import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { ENDPOINTS } from '../../config/endpoints';
import { normalizePayload } from '../../utils/payload';
import jsPDF from 'jspdf';

const FormularioTrabalhista = ({ tipoPeticao }) => {
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
        cargo_funcao: data.cargo_funcao,
        empresa_re: data.empresa_re,
        cnpj_empresa: data.cnpj_empresa.replace(/\D/g, ''),
        periodo_trabalho_inicio: data.periodo_trabalho_inicio ? new Date(data.periodo_trabalho_inicio).toISOString().split('T')[0] : '',
        periodo_trabalho_fim: data.periodo_trabalho_fim ? new Date(data.periodo_trabalho_fim).toISOString().split('T')[0] : '',
        salario_registrado: parseFloat(data.salario_registrado) || 0,
        salario_real: parseFloat(data.salario_real) || 0,
        jornada_contratual: data.jornada_contratual || '',
        jornada_real: data.jornada_real || '',
        horas_extras_habituais: data.horas_extras_habituais || false,
        adicional_insalubridade: data.adicional_insalubridade || false,
        adicional_periculosidade: data.adicional_periculosidade || false,
        equipamentos_seguranca: data.equipamentos_seguranca || false,
        testemunhas: data.testemunhas
          ? data.testemunhas.split('\n').map(t => t.trim()).filter(t => t)
          : [],
        documentos_comprobatorios: data.documentos_comprobatorios
          ? data.documentos_comprobatorios.split('\n').map(doc => doc.trim()).filter(doc => doc)
          : [],
      });

      // Validações adicionais frontend
      if (cleanedData.cnpj_empresa.length !== 14) {
        throw new Error('CNPJ deve ter 14 dígitos');
      }
      if (!cleanedData.periodo_trabalho_inicio) {
        throw new Error('Data de início é obrigatória');
      }
      if (cleanedData.salario_registrado <= 0 && cleanedData.salario_real <= 0) {
        throw new Error('Informe pelo menos um salário');
      }

      const endpoint = tipoPeticao === 'peticao-vinculo'
        ? ENDPOINTS.trabalhista.peticao_vinculo
        : ENDPOINTS.trabalhista.quesitos_insalubridade;

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
    doc.text('Petição Trabalhista', 10, 10);
    doc.text(peticaoGerada.texto_peticao, 10, 20, { maxWidth: 190 });
    doc.save(`peticao-${tipoPeticao}.pdf`);
    toast.success('PDF gerado com sucesso!');
  };

  const copiarTexto = () => {
    if (previewRef.current) {
      navigator.clipboard.writeText(previewRef.current.innerText);
      toast.success('Texto copiado para área de transferência!');
    }
  };

  const getTitulo = () => {
    return tipoPeticao === 'peticao-vinculo'
      ? 'Petição de Reconhecimento de Vínculo Empregatício'
      : 'Quesitos de Insalubridade';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {getTitulo()}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Preencha os dados para gerar sua petição trabalhista
          </p>
        </div>

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
              placeholder="Ex.: Reconhecimento de Vínculo Empregatício"
            />
            {errors.tipo_acao && (
              <p className="mt-1 text-sm text-red-600">{errors.tipo_acao.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Cargo/Função
            </label>
            <input
              {...register('cargo_funcao', { required: 'O cargo/função é obrigatório' })}
              className={`mt-1 block w-full p-3 border rounded-lg ${
                errors.cargo_funcao ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200`}
              placeholder="Ex.: Auxiliar de Produção"
            />
            {errors.cargo_funcao && (
              <p className="mt-1 text-sm text-red-600">{errors.cargo_funcao.message}</p>
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
              Período de Trabalho - Início
            </label>
            <input
              type="date"
              {...register('periodo_trabalho_inicio', { required: 'Data de início é obrigatória' })}
              className={`mt-1 block w-full p-3 border rounded-lg ${
                errors.periodo_trabalho_inicio ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200`}
            />
            {errors.periodo_trabalho_inicio && (
              <p className="mt-1 text-sm text-red-600">{errors.periodo_trabalho_inicio.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Período de Trabalho - Fim (opcional)
            </label>
            <input
              type="date"
              {...register('periodo_trabalho_fim')}
              className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Salário Registrado (R$)
            </label>
            <input
              type="number"
              step="0.01"
              {...register('salario_registrado', {
                required: false,
                min: { value: 0, message: 'O salário deve ser maior ou igual a 0' },
              })}
              className={`mt-1 block w-full p-3 border rounded-lg ${
                errors.salario_registrado ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200`}
              placeholder="Ex.: 1500.00"
            />
            {errors.salario_registrado && (
              <p className="mt-1 text-sm text-red-600">{errors.salario_registrado.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Salário Real (R$)
            </label>
            <input
              type="number"
              step="0.01"
              {...register('salario_real', {
                required: false,
                min: { value: 0, message: 'O salário deve ser maior ou igual a 0' },
              })}
              className={`mt-1 block w-full p-3 border rounded-lg ${
                errors.salario_real ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200`}
              placeholder="Ex.: 2200.00"
            />
            {errors.salario_real && (
              <p className="mt-1 text-sm text-red-600">{errors.salario_real.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Jornada Contratual
            </label>
            <input
              {...register('jornada_contratual', { required: 'Jornada contratual é obrigatória' })}
              className={`mt-1 block w-full p-3 border rounded-lg ${
                errors.jornada_contratual ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200`}
              placeholder="Ex.: 44h semanais"
            />
            {errors.jornada_contratual && (
              <p className="mt-1 text-sm text-red-600">{errors.jornada_contratual.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Jornada Real
            </label>
            <input
              {...register('jornada_real', { required: 'Jornada real é obrigatória' })}
              className={`mt-1 block w-full p-3 border rounded-lg ${
                errors.jornada_real ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200`}
              placeholder="Ex.: 10h diárias"
            />
            {errors.jornada_real && (
              <p className="mt-1 text-sm text-red-600">{errors.jornada_real.message}</p>
            )}
          </div>
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                {...register('horas_extras_habituais')}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <span>Horas Extras Habitual</span>
            </label>
          </div>
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                {...register('adicional_insalubridade')}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <span>Adicional de Insalubridade</span>
            </label>
          </div>
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                {...register('adicional_periculosidade')}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <span>Adicional de Periculosidade</span>
            </label>
          </div>
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                {...register('equipamentos_seguranca')}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <span>Equipamentos de Segurança Fornecidos</span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Testemunhas (uma por linha, opcional)
            </label>
            <textarea
              {...register('testemunhas')}
              className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              placeholder="Ex.: João Silva - Colega de trabalho\nMaria Santos - Supervisora"
              rows="4"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Documentos Comprobatórios (um por linha, opcional)
            </label>
            <textarea
              {...register('documentos_comprobatorios')}
              className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              placeholder="Ex.: Contracheques\nCartão de ponto\nFotos do ambiente de trabalho"
              rows="4"
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-3 px-4 rounded-lg text-white font-medium ${
                loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
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

export default FormularioTrabalhista;
