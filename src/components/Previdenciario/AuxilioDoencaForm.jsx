// src/components/Previdenciario/AuxilioDoencaForm.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { ENDPOINTS } from '../../config/endpoints';
import { normalizePayload } from '../../utils/payload';
import { validators } from '../../utils/validations';
import Preview from '../FormularioDinamico/Preview';

const AuxilioDoencaForm = () => {
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
      const laudos = (raw.laudos_medicos || '')
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      const documentos = (raw.documentos_anexos || '')
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      // Validações obrigatórias
      if (!raw.nome?.trim()) throw new Error('Nome do requerente é obrigatório');
      if (cpf.length !== 11) throw new Error('CPF deve ter 11 dígitos');
      if (!validators.cpf(cpf)) throw new Error('CPF inválido');
      if (!raw.der) throw new Error('DER é obrigatória');
      if (!raw.dib) throw new Error('DIB é obrigatória');
      if (!raw.cid_principal?.trim()) throw new Error('CID principal é obrigatório');
      if (!raw.informacoes_medicas?.trim()) throw new Error('Descreva as informações médicas');

      // ---------- 2. Payload normalizado ----------
      const payload = normalizePayload({
        tipo_beneficio: 'Auxílio-Doença',
        numero_beneficio: raw.numero_beneficio || '',
        der: new Date(raw.der).toISOString().split('T')[0],
        dib: new Date(raw.dib).toISOString().split('T')[0],
        numero_processo_administrativo: raw.numero_processo_administrativo || '',
        motivo_recusa: raw.motivo_recusa || '',
        nome: raw.nome.trim(),
        cpf,
        rg: raw.rg || '',
        orgao_emissor: raw.orgao_emissor || '',
        endereco_completo: raw.endereco_completo || '',
        telefone: raw.telefone || '',
        data_nascimento: raw.data_nascimento
          ? new Date(raw.data_nascimento).toISOString().split('T')[0]
          : '',
        tempo_contribuicao_total: 0,
        historico_laboral: raw.historico_laboral || '',
        historico_contribuicoes: '',
        informacoes_medicas: raw.informacoes_medicas.trim(),
        laudos_medicos: laudos.length > 0 ? laudos : [],
        cid_principal: raw.cid_principal.trim(),
        atividade_especial: raw.atividade_especial === true || raw.atividade_especial === 'true',
        exposicao_agentes_nocivos: raw.exposicao_agentes_nocivos || '',
        valor_causa: raw.valor_causa ? Number(raw.valor_causa) : 36000,
        justica_gratuita: raw.justica_gratuita === true || raw.justica_gratuita === 'true',
        tutela_antecipada: raw.tutela_antecipada === true || raw.tutela_antecipada === 'true',
        especialidade_perito: raw.especialidade_perito || '',
        comarca: raw.comarca || '',
        cidade_comarca: raw.cidade_comarca || '',
        estado_comarca: raw.estado_comarca || '',
        documentos_anexos: documentos.length > 0 ? documentos : [],
      });

      // ---------- 3. Envio ----------
      const endpoint = ENDPOINTS?.previdenciario?.peticao_auxilio_doenca;
      if (!endpoint) throw new Error('Endpoint não configurado');

      console.debug('[Payload Enviado - Auxílio-Doença]', payload);

      const resp = await api.post(endpoint, payload);
      setResultado(resp.data || resp);
      toast.success('Petição Auxílio-Doença gerada com sucesso!');
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
        Petição Inicial — Auxílio-Doença
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Preencha os dados com atenção. Campos marcados com * são obrigatórios.
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
        <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
          <h4 className="text-xl font-semibold mb-4 text-blue-800 dark:text-blue-200">
            Dados do Requerente
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome Completo *</label>
              <input
                {...register('nome', { required: 'Nome obrigatório' })}
                placeholder="Ex.: José Silva Oliveira"
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
              <label className="block text-sm font-medium mb-1">Data de Nascimento</label>
              <input
                type="date"
                {...register('data_nascimento')}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">RG</label>
              <input
                {...register('rg')}
                placeholder="Ex.: 11223344"
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Órgão Emissor</label>
              <input
                {...register('orgao_emissor')}
                placeholder="Ex.: SSP/CE"
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Endereço Completo</label>
              <input
                {...register('endereco_completo')}
                placeholder="Rua, número, bairro, cidade, CEP"
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Seção: Informações Médicas */}
        <div className="bg-red-50 dark:bg-red-900 p-6 rounded-lg border border-red-200 dark:border-red-700">
          <h4 className="text-xl font-semibold mb-4 text-red-800 dark:text-red-200">
            Informações Médicas
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">CID Principal *</label>
              <input
                {...register('cid_principal', { required: 'CID obrigatório' })}
                placeholder="Ex.: J45.9 (Asma)"
                className="w-full px-4 py-2 border rounded-md"
              />
              {errors.cid_principal && <p className="text-red-600 text-sm">{errors.cid_principal.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Descrição da Doença e Limitações *
              </label>
              <textarea
                {...register('informacoes_medicas', { required: 'Descrição obrigatória' })}
                rows={5}
                placeholder="Descreva sintomas, tratamentos, período de afastamento, impacto no trabalho..."
                className="w-full px-4 py-2 border rounded-md"
              />
              {errors.informacoes_medicas && (
                <p className="text-red-600 text-sm">{errors.informacoes_medicas.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Laudos Médicos (um por linha)</label>
              <textarea
                {...register('laudos_medicos')}
                rows={4}
                placeholder="Atestado Médico - Dr. João (15/10/2025)\nExame de Raio-X - Fratura confirmada"
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Seção: Atividade Especial */}
        <div className="bg-yellow-50 dark:bg-yellow-900 p-6 rounded-lg border border-yellow-200 dark:border-yellow-700">
          <h4 className="text-xl font-semibold mb-4 text-yellow-800 dark:text-yellow-200">
            Atividade Especial (exposição a agentes nocivos)
          </h4>
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  {...register('atividade_especial')}
                  className="h-5 w-5 text-yellow-600"
                />
                <span>Trabalha ou trabalhou em atividade especial?</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Agentes Nocivos (se aplicável)
              </label>
              <textarea
                {...register('exposicao_agentes_nocivos')}
                rows={3}
                placeholder="Ex.: Ruído acima de 85 dB, produtos químicos, poeira..."
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Seção: Histórico Laboral */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <h4 className="text-xl font-semibold mb-4">Histórico Laboral</h4>
          <div>
            <label className="block text-sm font-medium mb-1">Descreva empregos e contribuições</label>
            <textarea
              {...register('historico_laboral')}
              rows={4}
              placeholder="Ex.: Empregado CLT de 2015 a 2023 na Empresa X..."
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
        </div>

        {/* Seção: Documentos */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <h4 className="text-xl font-semibold mb-4">Documentos Anexos</h4>
          <div>
            <label className="block text-sm font-medium mb-1">Lista de documentos (um por linha)</label>
            <textarea
              {...register('documentos_anexos')}
              rows={4}
              placeholder="CNIS\nComprovante de Residência\nReceituário Médico\nLaudo Pericial"
              className="w-full px-4 py-2 border rounded-md"
            />
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
                placeholder="Ex.: 36000"
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
              <label className="block text-sm font-medium mb-1">Especialidade do Perito</label>
              <input
                {...register('especialidade_perito')}
                placeholder="Ex.: Ortopedista"
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Comarca</label>
              <input
                {...register('comarca')}
                placeholder="Ex.: Comarca de Fortaleza"
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cidade</label>
              <input
                {...register('cidade_comarca')}
                placeholder="Ex.: Fortaleza"
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Estado</label>
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
            className="flex-1 bg-gradient-to-r from-red-600 to-red-800 text-white py-4 rounded-lg hover:from-red-700 hover:to-red-900 disabled:opacity-60 transition font-bold text-xl shadow-lg hover:shadow-xl"
          >
            {loading ? 'Gerando Petição...' : 'Gerar Petição Auxílio-Doença'}
          </button>
          <button
            type="button"
            onClick={() => {
              reset();
              setResultado(null);
            }}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-gray-600 to-gray-800 text-white py-4 rounded-lg hover:from-gray-700 hover:to-gray-900 disabled:opacity-60 transition font-bold text-xl shadow-lg hover:shadow-xl"
          >
            Limpar Tudo
          </button>
        </div>
      </form>

      {resultado && (
        <div className="mt-12 border-t pt-8">
          <Preview peticao={resultado} title="Petição Gerada - Auxílio-Doença" />
        </div>
      )}
    </div>
  );
};

export default AuxilioDoencaForm;