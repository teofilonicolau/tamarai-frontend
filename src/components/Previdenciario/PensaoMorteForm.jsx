// src/components/Previdenciario/PensaoMorteForm.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { ENDPOINTS } from '../../config/endpoints';
import { normalizePayload } from '../../utils/payload';
import { validators } from '../../utils/validations';
import Preview from '../FormularioDinamico/Preview';

const PensaoMorteForm = () => {
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
      const cpfRequerente = (raw.cpf || '').toString().replace(/\D/g, '');
      const cpfFalecido = (raw.cpf_falecido || '').toString().replace(/\D/g, '');
      const documentosAnexos = (raw.documentos_anexos || '')
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      // Validações obrigatórias
      if (!raw.nome?.trim()) throw new Error('Nome do requerente é obrigatório');
      if (cpfRequerente.length !== 11) throw new Error('CPF do requerente deve ter 11 dígitos');
      if (!validators.cpf(cpfRequerente)) throw new Error('CPF do requerente inválido');
      if (!raw.nome_falecido?.trim()) throw new Error('Nome do falecido é obrigatório');
      if (cpfFalecido.length !== 11) throw new Error('CPF do falecido deve ter 11 dígitos');
      if (!validators.cpf(cpfFalecido)) throw new Error('CPF do falecido inválido');
      if (!raw.data_obito) throw new Error('Data do óbito é obrigatória');
      if (!raw.der) throw new Error('DER é obrigatória');
      if (!raw.dib) throw new Error('DIB é obrigatória');

      // ---------- 2. Payload normalizado ----------
      const payload = normalizePayload({
        tipo_beneficio: 'Pensão por Morte',
        numero_beneficio: raw.numero_beneficio || '',
        der: new Date(raw.der).toISOString().split('T')[0],
        dib: new Date(raw.dib).toISOString().split('T')[0],
        numero_processo_administrativo: raw.numero_processo_administrativo || '',
        motivo_recusa: raw.motivo_recusa || '',
        nome: raw.nome.trim(),
        cpf: cpfRequerente,
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
        informacoes_medicas: '',
        laudos_medicos: [],
        cid_principal: '',
        atividade_especial: false,
        exposicao_agentes_nocivos: '',
        valor_causa: raw.valor_causa ? Number(raw.valor_causa) : 60000,
        justica_gratuita: raw.justica_gratuita === true || raw.justica_gratuita === 'true',
        tutela_antecipada: raw.tutela_antecipada === true || raw.tutela_antecipada === 'true',
        especialidade_perito: '',
        comarca: raw.comarca || '',
        cidade_comarca: raw.cidade_comarca || '',
        estado_comarca: raw.estado_comarca || '',
        // Campos específicos
        nome_falecido: raw.nome_falecido.trim(),
        cpf_falecido: cpfFalecido,
        data_obito: new Date(raw.data_obito).toISOString().split('T')[0],
        qualidade_segurado: raw.qualidade_segurado || '',
        parentesco: raw.parentesco || '',
        documentos_anexos: documentosAnexos.length > 0 ? documentosAnexos : [],
      });

      // ---------- 3. Envio ----------
      const endpoint = ENDPOINTS?.previdenciario?.peticao_pensao_morte;
      if (!endpoint) throw new Error('Endpoint não configurado');

      console.debug('[Payload Enviado - Pensão por Morte]', payload);

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
        Petição Inicial — Pensão por Morte
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Preencha os dados abaixo com atenção. Campos marcados com * são obrigatórios.
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
                placeholder="Ex.: 1122334455"
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

        {/* Seção: Dados do Falecido */}
        <div className="bg-red-50 dark:bg-red-900 p-6 rounded-lg border border-red-200 dark:border-red-700">
          <h4 className="text-xl font-semibold mb-4 text-red-800 dark:text-red-200">
            Dados do Falecido (Instituidor)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome Completo *</label>
              <input
                {...register('nome_falecido', { required: 'Nome do falecido é obrigatório' })}
                placeholder="Ex.: Antônio Carlos da Silva"
                className="w-full px-4 py-2 border rounded-md"
              />
              {errors.nome_falecido && <p className="text-red-600 text-sm">{errors.nome_falecido.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CPF * (11 dígitos)</label>
              <input
                {...register('cpf_falecido', {
                  required: 'CPF do falecido é obrigatório',
                  pattern: { value: /^\d{11}$/, message: 'Apenas 11 números' },
                })}
                maxLength={11}
                placeholder="Ex.: 12345678901"
                className="w-full px-4 py-2 border rounded-md"
              />
              {errors.cpf_falecido && <p className="text-red-600 text-sm">{errors.cpf_falecido.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Data do Óbito *</label>
              <input
                type="date"
                {...register('data_obito', { required: 'Data do óbito é obrigatória' })}
                className="w-full px-4 py-2 border rounded-md"
              />
              {errors.data_obito && <p className="text-red-600 text-sm">{errors.data_obito.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Qualidade de Segurado</label>
              <select
                {...register('qualidade_segurado')}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="">Selecione...</option>
                <option value="Contribuinte">Contribuinte</option>
                <option value="Aposentado">Aposentado</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
          </div>
        </div>

        {/* Seção: Dados do Requerente */}
        <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
          <h4 className="text-xl font-semibold mb-4 text-blue-800 dark:text-blue-200">
            Dados do Requerente (Dependente)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome Completo *</label>
              <input
                {...register('nome', { required: 'Nome do requerente é obrigatório' })}
                placeholder="Ex.: Maria Helena da Silva"
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
                placeholder="Ex.: 98765432100"
                className="w-full px-4 py-2 border rounded-md"
              />
              {errors.cpf && <p className="text-red-600 text-sm">{errors.cpf.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Parentesco com o Falecido</label>
              <select
                {...register('parentesco')}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="">Selecione...</option>
                <option value="Cônjuge">Cônjuge</option>
                <option value="Companheiro(a)">Companheiro(a)</option>
                <option value="Filho(a)">Filho(a)</option>
                <option value="Enteado(a)">Enteado(a)</option>
                <option value="Pais">Pais</option>
                <option value="Irmão(ã)">Irmão(ã)</option>
              </select>
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
            <div>
              <label className="block text-sm font-medium mb-1">Endereço Completo</label>
              <input
                {...register('endereco_completo')}
                placeholder="Ex.: Rua X, 123, Bairro Y, Cidade Z"
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Seção: Histórico e Documentos */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <h4 className="text-xl font-semibold mb-4">Histórico e Documentos</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Histórico Laboral do Falecido</label>
              <textarea
                {...register('historico_laboral')}
                rows={5}
                placeholder="Descreva empregos, contribuições, períodos de trabalho do instituidor..."
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Documentos Anexos (um por linha)</label>
              <textarea
                {...register('documentos_anexos')}
                rows={4}
                placeholder="Certidão de Óbito\nCNIS\nCTPS\nCertidão de Casamento\nComprovante de residência"
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
                placeholder="Ex.: Comarca de Fortaleza"
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cidade da Comarca</label>
              <input
                {...register('cidade_comarca')}
                placeholder="Ex.: Fortaleza"
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
            className="flex-1 bg-gradient-to-r from-purple-600 to-purple-800 text-white py-4 rounded-lg hover:from-purple-700 hover:to-purple-900 disabled:opacity-60 transition font-bold text-xl shadow-lg hover:shadow-xl"
          >
            {loading ? 'Gerando Petição...' : 'Gerar Petição de Pensão por Morte'}
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
          <Preview peticao={resultado} title="Petição Gerada - Pensão por Morte" />
        </div>
      )}
    </div>
  );
};

export default PensaoMorteForm;