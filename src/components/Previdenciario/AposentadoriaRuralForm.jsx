// src/components/Previdenciario/AposentadoriaRuralForm.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { ENDPOINTS } from '../../config/endpoints';
import { normalizePayload } from '../../utils/payload';
import { validators } from '../../utils/validations';
import Preview from '../FormularioDinamico/Preview';

const AposentadoriaRuralForm = () => {
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
      // ---------- 1. Limpeza e validação ----------
      const cpf = (raw.cpf || '').toString().replace(/\D/g, '');
      const comprovantes = (raw.comprovantes || '')
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      // Validações obrigatórias
      if (!raw.nome?.trim()) throw new Error('Nome é obrigatório');
      if (cpf.length !== 11) throw new Error('CPF deve ter exatamente 11 dígitos');
      if (!validators.cpf(cpf)) throw new Error('CPF inválido (dígitos verificadores incorretos)');
      if (!raw.der) throw new Error('DER (Data de Entrada) é obrigatória');
      if (!raw.dib) throw new Error('DIB (Data de Início do Benefício) é obrigatória');
      if (!raw.periodo_atividade?.trim()) throw new Error('Informe o período de atividade rural');

      // ---------- 2. Payload normalizado ----------
      const payload = normalizePayload({
        tipo_beneficio: 'Aposentadoria Rural',
        numero_beneficio: raw.numero_beneficio || '',
        der: new Date(raw.der).toISOString().split('T')[0],
        dib: new Date(raw.dib).toISOString().split('T')[0],
        numero_processo_administrativo: raw.numero_processo_administrativo || '',
        motivo_recusa: raw.motivo_recusa || '',
        nome: raw.nome.trim(),
        cpf,
        rg: raw.documento_identificacao?.match(/\d+/)?.[0] || '',
        orgao_emissor: raw.documento_identificacao?.split('–')?.[1]?.trim() || '',
        endereco_completo: raw.local_atividade || '',
        telefone: raw.telefone || '',
        data_nascimento: raw.data_nascimento
          ? new Date(raw.data_nascimento).toISOString().split('T')[0]
          : '',
        tempo_contribuicao_total: raw.tempo_contribuicao_total
          ? Number(raw.tempo_contribuicao_total)
          : 0,
        historico_laboral: raw.historico_trabalhador_rural || '',
        historico_contribuicoes: '',
        informacoes_medicas: '',
        laudos_medicos: comprovantes.length > 0 ? comprovantes : [],
        cid_principal: '',
        atividade_especial: false,
        exposicao_agentes_nocivos: raw.tipo_atividade || '',
        valor_causa: raw.valor_causa ? Number(raw.valor_causa) : 60000,
        justica_gratuita: raw.justica_gratuita === true || raw.justica_gratuita === 'true',
        tutela_antecipada: raw.tutela_antecipada === true || raw.tutela_antecipada === 'true',
        especialidade_perito: '',
        comarca: raw.comarca || '',
        cidade_comarca: raw.cidade_comarca || '',
        estado_comarca: raw.estado_comarca || '',
        documentos_anexos: (raw.documentos_anexos || '')
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean).length > 0
          ? (raw.documentos_anexos || '').split('\n').map((s) => s.trim()).filter(Boolean)
          : [],
      });

      // ---------- 3. Envio ----------
      const endpoint = ENDPOINTS?.previdenciario?.peticao_aposentadoria_rural;
      if (!endpoint) throw new Error('Endpoint não configurado');

      console.debug('[Payload Enviado - Aposentadoria Rural]', payload);

      const resp = await api.post(endpoint, payload);
      setResultado(resp.data || resp);
      toast.success('Petição gerada com sucesso!');
    } catch (err) {
      console.error('Erro:', err);
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
    <div className="max-w-5xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
      <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Petição Inicial — Aposentadoria Rural/Híbrida
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Preencha todos os campos com base no modelo do Swagger. Campos obrigatórios marcados com *.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Seção: Dados do Benefício */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <h4 className="text-xl font-semibold mb-4">Dados do Benefício</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Número do Benefício</label>
              <input
                {...register('numero_beneficio')}
                placeholder="Ex.: 1234567890"
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Número do Processo Administrativo</label>
              <input
                {...register('numero_processo_administrativo')}
                placeholder="Ex.: 000123456789"
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">DER (Data de Entrada) *</label>
              <input
                type="date"
                {...register('der', { required: 'DER obrigatória' })}
                className="w-full px-4 py-2 border rounded-md"
              />
              {errors.der && <p className="text-red-600 text-sm">{errors.der.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">DIB *</label>
              <input
                type="date"
                {...register('dib', { required: 'DIB obrigatória' })}
                className="w-full px-4 py-2 border rounded-md"
              />
              {errors.dib && <p className="text-red-600 text-sm">{errors.dib.message}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Motivo da Recusa</label>
              <textarea
                {...register('motivo_recusa')}
                rows={2}
                placeholder="Descreva o motivo da recusa administrativa"
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Seção: Dados Pessoais */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <h4 className="text-xl font-semibold mb-4">Dados do Autor</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome Completo *</label>
              <input
                {...register('nome', { required: 'Nome obrigatório' })}
                placeholder="Ex.: José Raimundo da Silva"
                className="w-full px-4 py-2 border rounded-md"
              />
              {errors.nome && <p className="text-red-600 text-sm">{errors.nome.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CPF * (11 dígitos)</label>
              <input
                {...register('cpf', {
                  required: 'CPF obrigatório',
                  pattern: { value: /^\d{11}$/, message: 'Apenas 11 números' },
                })}
                maxLength={11}
                placeholder="Ex.: 12345678901"
                className="w-full px-4 py-2 border rounded-md"
              />
              {errors.cpf && <p className="text-red-600 text-sm">{errors.cpf.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Documento de Identificação</label>
              <input
                {...register('documento_identificacao')}
                placeholder="Ex.: RG nº 11223344 – SSP/CE"
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Telefone</label>
              <input
                {...register('telefone')}
                placeholder="Ex.: (88) 99999-9999"
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Data de Nascimento</label>
              <input
                type="date"
                {...register('data_nascimento')}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tempo de Contribuição Rural (anos)</label>
              <input
                type="number"
                step="0.1"
                {...register('tempo_contribuicao_total')}
                placeholder="Ex.: 15"
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Seção: Atividade Rural */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <h4 className="text-xl font-semibold mb-4">Atividade Rural</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Local da Atividade</label>
              <input
                {...register('local_atividade')}
                placeholder="Ex.: Sítio Lagoa do Norte, zona rural de Iguatu – CE"
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Período de Atividade (ex.: 1980–1995) *</label>
              <input
                {...register('periodo_atividade', { required: 'Período obrigatório' })}
                placeholder="Ex.: 1980–1995"
                className="w-full px-4 py-2 border rounded-md"
              />
              {errors.periodo_atividade && <p className="text-red-600 text-sm">{errors.periodo_atividade.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tipo de Atividade</label>
              <input
                {...register('tipo_atividade')}
                placeholder="Ex.: Agricultura familiar (milho, feijão, criação de animais)"
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Comprovantes (um por linha)</label>
              <textarea
                {...register('comprovantes')}
                rows={4}
                placeholder="CTPS\nDeclaração Rural\nNotas fiscais de venda\nCertidão de sindicato\nDeclarações de testemunhas"
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Histórico do Trabalhador Rural</label>
              <textarea
                {...register('historico_trabalhador_rural')}
                rows={5}
                placeholder="Descreva o início, continuidade e condições da atividade rural..."
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Documentos Anexos (um por linha)</label>
              <textarea
                {...register('documentos_anexos')}
                rows={4}
                placeholder="CNIS\nCTPS\nDeclaração Rural\nNotas fiscais\nRG e CPF\nComprovante de residência"
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Seção: Pedidos */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <h4 className="text-xl font-semibold mb-4">Pedidos</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Valor da Causa (R$)</label>
              <input
                type="number"
                step="0.01"
                {...register('valor_causa')}
                placeholder="Ex.: 60000"
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Justiça Gratuita?</label>
              <select
                {...register('justica_gratuita')}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value={true}>Sim</option>
                <option value={false}>Não</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tutela Antecipada?</label>
              <select
                {...register('tutela_antecipada')}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value={true}>Sim</option>
                <option value={false}>Não</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Comarca</label>
              <input
                {...register('comarca')}
                placeholder="Ex.: Comarca de Iguatu"
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cidade da Comarca</label>
              <input
                {...register('cidade_comarca')}
                placeholder="Ex.: Iguatu"
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Estado da Comarca</label>
              <input
                {...register('estado_comarca')}
                placeholder="Ex.: CE"
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mt-10">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-green-600 to-green-800 text-white py-4 rounded-lg hover:from-green-700 hover:to-green-900 disabled:opacity-60 transition font-bold text-xl shadow-lg hover:shadow-xl"
          >
            {loading ? 'Gerando Petição...' : 'Gerar Petição Rural com IA'}
          </button>
          <button
            type="button"
            onClick={() => {
              reset();
              setResultado(null);
            }}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-red-600 to-red-800 text-white py-4 rounded-lg hover:from-red-700 hover:to-red-900 disabled:opacity-60 transition font-bold text-xl shadow-lg hover:shadow-xl"
          >
            Limpar Tudo
          </button>
        </div>
      </form>

      {resultado && (
        <div className="mt-12 border-t pt-8">
          <Preview peticao={resultado} title="Petição Gerada - Aposentadoria Rural" />
        </div>
      )}
    </div>
  );
};

export default AposentadoriaRuralForm;