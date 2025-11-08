// src/components/Previdenciario/AposentadoriaTempoContribuicaoForm.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { ENDPOINTS } from '../../config/endpoints';
import { normalizePayload } from '../../utils/payload';
import { validators } from '../../utils/validations';
import Preview from '../FormularioDinamico/Preview';

const AposentadoriaTempoContribuicaoForm = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);

  const onSubmit = async (raw) => {
    setLoading(true);
    setResultado(null);
    try {
      // ---------- 1. Validação mínima (frontend) ----------
      const cpf = (raw.cpf || '').toString().replace(/\D/g, '');
      const laudos = (raw.laudos_medicos || '')
        .toString()
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      if (!raw.nome?.trim()) throw new Error('Nome é obrigatório');
      if (cpf.length !== 11) throw new Error('CPF deve ter exatamente 11 dígitos');
      if (!validators.cpf(cpf)) throw new Error('CPF inválido (dígitos verificadores incorretos)');
      if (!raw.der) throw new Error('DER é obrigatória');
      if (!raw.dib) throw new Error('DIB é obrigatória');

      // ---------- 2. Payload normalizado (string vazia ao invés de null) ----------
      const payload = normalizePayload({
        tipo_beneficio: 'Aposentadoria por Tempo de Contribuição',
        numero_beneficio: raw.numero_beneficio || '',
        der: raw.der ? new Date(raw.der).toISOString().split('T')[0] : '',
        dib: raw.dib ? new Date(raw.dib).toISOString().split('T')[0] : '',
        numero_processo_administrativo: raw.numero_processo_administrativo || '',
        motivo_recusa: raw.motivo_recusa || '',
        nome: raw.nome?.trim() || '',
        cpf, // já validado: 11 dígitos + dígitos verificadores
        rg: raw.rg || '',
        orgao_emissor: raw.orgao_emissor || '',
        endereco_completo: raw.endereco_completo || '',
        telefone: raw.telefone || '',
        data_nascimento: raw.data_nascimento
          ? new Date(raw.data_nascimento).toISOString().split('T')[0]
          : '',
        tempo_contribuicao_total: raw.tempo_contribuicao_total
          ? Number(raw.tempo_contribuicao_total)
          : 0,
        historico_laboral: raw.historico_laboral || '',
        historico_contribuicoes: raw.historico_contribuicoes || '',
        informacoes_medicas: raw.informacoes_medicas || '',
        laudos_medicos: laudos.length > 0 ? laudos : [],
        cid_principal: raw.cid_principal || '',
        atividade_especial:
          raw.atividade_especial === true || raw.atividade_especial === 'true',
        exposicao_agentes_nocivos: raw.exposicao_agentes_nocivos || '',
        valor_causa: raw.valor_causa ? Number(raw.valor_causa) : 60000,
        justica_gratuita:
          raw.justica_gratuita === true || raw.justica_gratuita === 'true',
        tutela_antecipada:
          raw.tutela_antecipada === true || raw.tutela_antecipada === 'true',
        especialidade_perito: raw.especialidade_perito || '',
        comarca: raw.comarca || '',
        cidade_comarca: raw.cidade_comarca || '',
        estado_comarca: raw.estado_comarca || '',
      });

      const endpoint = ENDPOINTS?.previdenciario?.peticao_aposentadoria_tempo_contribuicao;
      if (!endpoint) throw new Error('Endpoint não configurado');

      console.debug('[Payload Enviado - Tempo Contribuição]', payload);

      const resp = await api.post(endpoint, payload);
      setResultado(resp.data || resp);
      toast.success('Petição gerada com sucesso!');
    } catch (err) {
      console.error('Erro completo:', err);
      const serverData = err?.response?.data || {};
      let msg = 'Erro ao gerar petição';

      if (serverData.detail) {
        msg = Array.isArray(serverData.detail)
          ? serverData.detail.map(d => `${d.loc.join(' > ')}: ${d.msg}`).join(' | ')
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
        Petição Inicial - Aposentadoria por Tempo de Contribuição
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Preencha todos os campos com base no modelo do Swagger. Campos obrigatórios marcados com *.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Hidden para tipo_beneficio */}
        <input type="hidden" value="Aposentadoria por Tempo de Contribuição" {...register('tipo_beneficio')} />

        {/* Seção: Benefício */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <h4 className="text-xl font-semibold mb-4">Dados do Benefício</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Número do Benefício</label>
              <input {...register('numero_beneficio')} placeholder="Ex.: 1234567890" className="w-full px-4 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Número do Processo Administrativo</label>
              <input {...register('numero_processo_administrativo')} placeholder="Ex.: 000123456789" className="w-full px-4 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">DER (Data do Evento) *</label>
              <input type="date" {...register('der', { required: 'DER obrigatória' })} className="w-full px-4 py-2 border rounded-md" />
              {errors.der && <p className="text-red-600 text-sm">{errors.der.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">DIB *</label>
              <input type="date" {...register('dib', { required: 'DIB obrigatória' })} className="w-full px-4 py-2 border rounded-md" />
              {errors.dib && <p className="text-red-600 text-sm">{errors.dib.message}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Motivo da Recusa</label>
              <textarea {...register('motivo_recusa')} rows={2} placeholder="Descreva o motivo da recusa administrativa" className="w-full px-4 py-2 border rounded-md" />
            </div>
          </div>
        </div>

        {/* Seção: Dados Pessoais */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <h4 className="text-xl font-semibold mb-4">Dados do Autor</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome Completo *</label>
              <input {...register('nome', { required: 'Nome obrigatório' })} placeholder="Ex.: João da Silva" className="w-full px-4 py-2 border rounded-md" />
              {errors.nome && <p className="text-red-600 text-sm">{errors.nome.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CPF * (11 dígitos)</label>
              <input
                {...register('cpf', {
                  required: 'CPF obrigatório',
                  pattern: { value: /^\d{11}$/, message: 'Apenas 11 números' }
                })}
                maxLength={11}
                placeholder="Ex.: 12345678901"
                className="w-full px-4 py-2 border rounded-md"
              />
              {errors.cpf && <p className="text-red-600 text-sm">{errors.cpf.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">RG</label>
              <input {...register('rg')} placeholder="Ex.: 12345678" className="w-full px-4 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Órgão Emissor</label>
              <input {...register('orgao_emissor')} placeholder="Ex.: SSP/SP" className="w-full px-4 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Data de Nascimento</label>
              <input type="date" {...register('data_nascimento')} className="w-full px-4 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Telefone</label>
              <input {...register('telefone')} placeholder="Ex.: (11) 98765-4321" className="w-full px-4 py-2 border rounded-md" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Endereço Completo</label>
              <input {...register('endereco_completo')} placeholder="Rua, número, bairro, cidade, CEP" className="w-full px-4 py-2 border rounded-md" />
            </div>
          </div>
        </div>

        {/* Seção: Histórico e Médico */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <h4 className="text-xl font-semibold mb-4">Histórico Laboral e Médico</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tempo de Contribuição Total (anos) *</label>
              <input
                type="number"
                {...register('tempo_contribuicao_total', { required: 'Campo obrigatório', min: { value: 1, message: 'Mínimo 1 ano' } })}
                placeholder="Ex.: 35"
                className="w-full px-4 py-2 border rounded-md"
              />
              {errors.tempo_contribuicao_total && <p className="text-red-600 text-sm">{errors.tempo_contribuicao_total.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CID Principal</label>
              <input {...register('cid_principal')} placeholder="Ex.: M54.5" className="w-full px-4 py-2 border rounded-md" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Histórico Laboral</label>
              <textarea {...register('historico_laboral')} rows={3} placeholder="Descreva as profissões e períodos" className="w-full px-4 py-2 border rounded-md" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Histórico de Contribuições</label>
              <textarea {...register('historico_contribuicoes')} rows={3} placeholder="Descreva contribuições INSS" className="w-full px-4 py-2 border rounded-md" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Informações Médicas</label>
              <textarea {...register('informacoes_medicas')} rows={4} placeholder="Descreva sintomas e tratamentos" className="w-full px-4 py-2 border rounded-md" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Laudos Médicos (um por linha)</label>
              <textarea {...register('laudos_medicos')} rows={5} placeholder="Ex.:\nLaudo ortopédico – Dr. Carlos\nLaudo neurológico – Hospital X" className="w-full px-4 py-2 border rounded-md" />
            </div>
          </div>
        </div>

        {/* Seção: Atividade Especial e Processo */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <h4 className="text-xl font-semibold mb-4">Atividade Especial e Pedidos</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Atividade Especial?</label>
              <select {...register('atividade_especial')} className="w-full px-4 py-2 border rounded-md">
                <option value={false}>Não</option>
                <option value={true}>Sim</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Exposição a Agentes Nocivos</label>
              <input {...register('exposicao_agentes_nocivos')} placeholder="Ex.: Ruído, químicos" className="w-full px-4 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Valor da Causa (R$)</label>
              <input type="number" step="0.01" {...register('valor_causa')} placeholder="Ex.: 60000" className="w-full px-4 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Especialidade do Perito</label>
              <input {...register('especialidade_perito')} placeholder="Ex.: Ortopedista" className="w-full px-4 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Justiça Gratuita?</label>
              <select {...register('justica_gratuita')} className="w-full px-4 py-2 border rounded-md">
                <option value={true}>Sim</option>
                <option value={false}>Não</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tutela Antecipada?</label>
              <select {...register('tutela_antecipada')} className="w-full px-4 py-2 border rounded-md">
                <option value={true}>Sim</option>
                <option value={false}>Não</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Comarca</label>
              <input {...register('comarca')} placeholder="Ex.: Comarca de São Paulo" className="w-full px-4 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cidade da Comarca</label>
              <input {...register('cidade_comarca')} placeholder="Ex.: São Paulo" className="w-full px-4 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Estado da Comarca</label>
              <input {...register('estado_comarca')} placeholder="Ex.: SP" className="w-full px-4 py-2 border rounded-md" />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mt-10">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-green-600 to-green-800 text-white py-4 rounded-lg hover:from-green-700 hover:to-green-900 disabled:opacity-60 transition font-bold text-xl shadow-lg hover:shadow-xl"
          >
            {loading ? 'Gerando Petição...' : 'Gerar Petição com IA'}
          </button>
          <button
            type="button"
            onClick={() => { reset(); setResultado(null); }}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-red-600 to-red-800 text-white py-4 rounded-lg hover:from-red-700 hover:to-red-900 disabled:opacity-60 transition font-bold text-xl shadow-lg hover:shadow-xl"
          >
            Limpar Tudo
          </button>
        </div>
      </form>

      {resultado && (
        <div className="mt-12 border-t pt-8">
          <Preview peticao={resultado} title="Petição Gerada - Preview" />
        </div>
      )}
    </div>
  );
};

export default AposentadoriaTempoContribuicaoForm;