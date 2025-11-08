// src/components/Previdenciario/AposentadoriaEspecialForm.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { ENDPOINTS } from '../../config/endpoints';
import { normalizePayload } from '../../utils/payload';
import { validators } from '../../utils/validations'; // Validação avançada de CPF
import Preview from '../FormularioDinamico/Preview';

const AposentadoriaEspecialForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);

  const onSubmit = async (raw) => {
    setLoading(true);
    setResultado(null);
    try {
      // ---------- 1. Limpeza e validação mínima ----------
      const cpf = (raw.cpf || '').toString().replace(/\D/g, '');
      const agentesNocivos = (raw.agentes_nocivos || '')
        .toString()
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      const laudosMedicos = (raw.laudos_medicos || '')
        .toString()
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      const documentosAnexos = (raw.documentos_anexos || '')
        .toString()
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      // Validações obrigatórias
      if (!raw.nome?.trim()) throw new Error('Nome é obrigatório');
      if (cpf.length !== 11) throw new Error('CPF deve ter exatamente 11 dígitos');
      if (!validators.cpf(cpf)) throw new Error('CPF inválido (dígitos verificadores incorretos)');
      if (!raw.atividade_especial) throw new Error('Confirme que exerceu atividade especial');
      if (!raw.exposicao_agentes_nocivos?.trim()) throw new Error('Descreva a exposição a agentes nocivos');

      // ---------- 2. Payload normalizado (strings vazias, arrays vazios) ----------
      const payload = normalizePayload({
        tipo_beneficio: 'Aposentadoria Especial',
        numero_beneficio: raw.numero_beneficio || '',
        der: raw.der ? new Date(raw.der).toISOString().split('T')[0] : '',
        dib: raw.dib ? new Date(raw.dib).toISOString().split('T')[0] : '',
        nome: raw.nome.trim(),
        cpf, // já validado
        data_nascimento: raw.data_nascimento
          ? new Date(raw.data_nascimento).toISOString().split('T')[0]
          : '',
        tempo_contribuicao_total: raw.tempo_contribuicao_total
          ? Number(raw.tempo_contribuicao_total)
          : 0,
        atividade_especial: true, // já validado acima
        exposicao_agentes_nocivos: raw.exposicao_agentes_nocivos.trim(),
        agentes_nocivos: agentesNocivos.length > 0 ? agentesNocivos : [],
        periodos_especiais: raw.periodos_especiais || '',
        historico_laboral: raw.historico_laboral || '',
        laudos_medicos: laudosMedicos.length > 0 ? laudosMedicos : [],
        cid_principal: raw.cid_principal || '',
        documentos_anexos: documentosAnexos.length > 0 ? documentosAnexos : [],
      });

      // ---------- 3. Envio ----------
      const endpoint =
        ENDPOINTS?.previdenciario?.peticao_aposentadoria_especial ||
        ENDPOINTS?.previdenciario?.aposentadoria_especial;
      if (!endpoint) throw new Error('Endpoint não configurado para Aposentadoria Especial');

      console.debug('[Payload Enviado - Aposentadoria Especial]', payload);

      const resp = await api.post(endpoint, payload);
      setResultado(resp.data || resp);
      toast.success('Petição gerada com sucesso!');
    } catch (err) {
      console.error('AposentadoriaEspecialForm error:', err);
      const serverData = err?.response?.data || {};
      let msg = 'Erro ao gerar petição';

      if (serverData.detail) {
        msg = Array.isArray(serverData.detail)
          ? serverData.detail
              .map((d) => `${d.loc?.join(' > ') || ''}: ${d.msg}`)
              .join(' | ')
          : JSON.stringify(serverData.detail);
      } else if (serverData.message) {
        msg = serverData.message;
      } else if (err.message) {
        msg = err.message;
      }

      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Aposentadoria Especial (Atividade Insalubre/Perigosa)
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Nome Completo <span className="text-red-500">*</span>
            </label>
            <input
              {...register('nome', { required: 'Nome é obrigatório' })}
              placeholder="Nome completo do requerente"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.nome && <p className="text-red-600 text-sm mt-1">{errors.nome.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              CPF <span className="text-red-500">*</span>
            </label>
            <input
              {...register('cpf', {
                required: 'CPF é obrigatório',
                pattern: { value: /^\d{11}$/, message: 'Apenas 11 números' },
              })}
              maxLength={11}
              placeholder="Ex.: 12345678901"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.cpf && <p className="text-red-600 text-sm mt-1">{errors.cpf.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Data de Nascimento
            </label>
            <input
              type="date"
              {...register('data_nascimento')}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Número do Benefício (NB)
            </label>
            <input
              {...register('numero_beneficio')}
              placeholder="Ex.: 1234567890"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              DER (Data de Entrada do Requerimento)
            </label>
            <input
              type="date"
              {...register('der')}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              DIB (Data de Início do Benefício)
            </label>
            <input
              type="date"
              {...register('dib')}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Tempo Total de Contribuição Especial (anos)
            </label>
            <input
              type="number"
              step="0.1"
              {...register('tempo_contribuicao_total')}
              placeholder="Ex.: 25"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              CID Principal (se aplicável)
            </label>
            <input
              {...register('cid_principal')}
              placeholder="Ex.: Z57.1"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-700">
          <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
            Atividade Especial
          </h4>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                {...register('atividade_especial', {
                  required: 'Você deve confirmar a atividade especial',
                })}
                className="h-5 w-5 text-blue-600"
              />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Declaro que exerço/exerci atividade especial <span className="text-red-500">*</span>
              </label>
            </div>
            {errors.atividade_especial && (
              <p className="text-red-600 text-sm">{errors.atividade_especial.message}</p>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Exposição a Agentes Nocivos <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('exposicao_agentes_nocivos', {
                  required: 'Descreva a exposição',
                })}
                rows={3}
                placeholder="Ex.: Ruído acima de 85 dB, exposição a amianto, trabalho em altura..."
                className="w-full px-3 py-2 border rounded-md"
              />
              {errors.exposicao_agentes_nocivos && (
                <p className="text-red-600 text-sm mt-1">{errors.exposicao_agentes_nocivos.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Agentes Nocivos Específicos (um por linha)
              </label>
              <textarea
                {...register('agentes_nocivos')}
                rows={3}
                placeholder="Ex.:\nRuído\nPoeira sílica\nProdutos químicos"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Períodos de Atividade Especial
              </label>
              <textarea
                {...register('periodos_especiais')}
                rows={3}
                placeholder="Ex.:\n01/01/2000 a 31/12/2010 - Metalúrgica XYZ\n15/05/2015 a atual - Hospital ABC"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Histórico Laboral Completo
          </label>
          <textarea
            {...register('historico_laboral')}
            rows={4}
            placeholder="Descreva todas as funções, empresas e períodos de contribuição"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Laudos Técnicos / PPP (um por linha)
          </label>
          <textarea
            {...register('laudos_medicos')}
            rows={3}
            placeholder="Ex.:\nPPP - Metalúrgica (2000-2010)\nLTCAT - Hospital ABC"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Documentos Anexos (um por linha)
          </label>
          <textarea
            {...register('documentos_anexos')}
            rows={3}
            placeholder="Ex.:\nCNIS\nCarteira de Trabalho\nPPP\nLaudo Médico"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-purple-600 to-purple-800 text-white py-3 rounded-lg hover:from-purple-700 hover:to-purple-900 disabled:opacity-60 transition font-bold"
          >
            {loading ? 'Gerando petição...' : 'Gerar Petição com IA'}
          </button>
          <button
            type="button"
            onClick={() => {
              reset();
              setResultado(null);
            }}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-red-600 to-red-800 text-white py-3 rounded-lg hover:from-red-700 hover:to-red-900 disabled:opacity-60 transition font-bold"
          >
            Limpar Formulário
          </button>
        </div>
      </form>

      {resultado && (
        <div className="mt-10 border-t pt-6">
          <Preview peticao={resultado} title="Preview da Petição - Aposentadoria Especial" />
        </div>
      )}
    </div>
  );
};

export default AposentadoriaEspecialForm;