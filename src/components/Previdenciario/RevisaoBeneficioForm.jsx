// src/components/Previdenciario/RevisaoBeneficioForm.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { ENDPOINTS } from '../../config/endpoints';
import { normalizePayload } from '../../utils/payload';
import { validators } from '../../utils/validations';
import Preview from '../FormularioDinamico/Preview';

const RevisaoBeneficioForm = () => {
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
      const documentos = (raw.documentos_anexos || '')
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      // Validações obrigatórias
      if (!raw.nome?.trim()) throw new Error('Nome do requerente é obrigatório');
      if (cpf.length !== 11) throw new Error('CPF deve ter 11 dígitos');
      if (!validators.cpf(cpf)) throw new Error('CPF inválido');
      if (!raw.numero_beneficio?.trim()) throw new Error('Número do benefício é obrigatório');
      if (!raw.der) throw new Error('DER é obrigatória');
      if (!raw.dib) throw new Error('DIB é obrigatória');
      if (!raw.tipo_revisao) throw new Error('Tipo de revisão é obrigatório');
      if (!raw.motivo_rev?.trim()) throw new Error('Motivo da revisão é obrigatório');

      // ---------- 2. Payload normalizado ----------
      const payload = normalizePayload({
        tipo_beneficio: raw.tipo_revisao || 'Revisão de Benefício',
        numero_beneficio: raw.numero_beneficio.trim(),
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
        tempo_contribuicao_total: raw.tempo_contribuicao_total ? Number(raw.tempo_contribuicao_total) : 0,
        historico_laboral: raw.historico_laboral || '',
        historico_contribuicoes: raw.historico_contribuicoes || '',
        informacoes_medicas: '',
        laudos_medicos: [],
        cid_principal: '',
        atividade_especial: raw.atividade_especial === true || raw.atividade_especial === 'true',
        exposicao_agentes_nocivos: raw.exposicao_agentes_nocivos || '',
        valor_causa: raw.valor_causa ? Number(raw.valor_causa) : 50000,
        justica_gratuita: raw.justica_gratuita === true || raw.justica_gratuita === 'true',
        tutela_antecipada: raw.tutela_antecipada === true || raw.tutela_antecipada === 'true',
        especialidade_perito: '',
        comarca: raw.comarca || '',
        cidade_comarca: raw.cidade_comarca || '',
        estado_comarca: raw.estado_comarca || '',
        documentos_anexos: documentos.length > 0 ? documentos : [],
      });

      // ---------- 3. Envio ----------
      const endpoint = ENDPOINTS?.previdenciario?.peticao_revisao_beneficio;
      if (!endpoint) throw new Error('Endpoint não configurado');

      console.debug('[Payload Enviado - Revisão de Benefício]', payload);

      const resp = await api.post(endpoint, payload);
      setResultado(resp.data || resp);
      toast.success('Petição de Revisão de Benefício gerada com sucesso!');
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
        Petição Inicial — Revisão de Benefício Previdenciário
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
              <label className="block text-sm font-medium mb-1">Número do Benefício (NB) *</label>
              <input
                {...register('numero_beneficio', { required: 'NB obrigatório' })}
                placeholder="Ex.: 1234567890"
                className="w-full px-4 py-2 border rounded-md"
              />
              {errors.numero_beneficio && <p className="text-red-600 text-sm">{errors.numero_beneficio.message}</p>}
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
            <div>
              <label className="block text-sm font-medium mb-1">Tempo Total de Contribuição (meses)</label>
              <input
                type="number"
                {...register('tempo_contribuicao_total')}
                placeholder="Ex.: 420"
                className="w-full px-4 py-2 border rounded-md"
              />
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

        {/* Seção: Detalhes da Revisão */}
        <div className="bg-yellow-50 dark:bg-yellow-900 p-6 rounded-lg border border-yellow-200 dark:border-yellow-700">
          <h4 className="text-xl font-semibold mb-4 text-yellow-800 dark:text-yellow-200">
            Detalhes da Revisão
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tipo de Revisão *</label>
              <select
                {...register('tipo_revisao', { required: 'Tipo obrigatório' })}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="">Selecione...</option>
                <option value="inclusao_tempo_especial">Inclusão de Tempo Especial</option>
                <option value="revisao_vida_toda">Revisão da Vida Toda</option>
                <option value="revisao_teto">Revisão do Teto</option>
                <option value="revisao_artigo_29">Revisão do Art. 29 (Buraco Negro)</option>
                <option value="revisao_fator_previdenciario">Revisão do Fator Previdenciário</option>
                <option value="outro">Outro</option>
              </select>
              {errors.tipo_revisao && <p className="text-red-600 text-sm">{errors.tipo_revisao.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Motivo da Revisão *</label>
              <textarea
                {...register('motivo_rev', { required: 'Motivo obrigatório' })}
                rows={5}
                placeholder="Descreva detalhadamente o erro no cálculo, períodos não considerados, etc."
                className="w-full px-4 py-2 border rounded-md"
              />
              {errors.motivo_rev && <p className="text-red-600 text-sm">{errors.motivo_rev.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Períodos para Revisão (um por linha)</label>
              <textarea
                {...register('periodos_revisao')}
                rows={4}
                placeholder="01/01/1990 a 31/12/1994 - Tempo Especial\n15/05/2000 a 10/10/2005 - Contribuição Rural"
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Seção: Histórico */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <h4 className="text-xl font-semibold mb-4">Histórico</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Histórico de Contribuições</label>
              <textarea
                {...register('historico_contribuicoes')}
                rows={4}
                placeholder="Descreva todas as contribuições, empregos e períodos relevantes para a revisão"
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Histórico Laboral</label>
              <textarea
                {...register('historico_laboral')}
                rows={4}
                placeholder="Ex.: 2010-2023: Auxiliar Administrativo na Empresa X..."
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Seção: Atividade Especial */}
        <div className="bg-purple-50 dark:bg-purple-900 p-6 rounded-lg border border-purple-200 dark:border-purple-700">
          <h4 className="text-xl font-semibold mb-4 text-purple-800 dark:text-purple-200">
            Atividade Especial (opcional)
          </h4>
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  {...register('atividade_especial')}
                  className="h-5 w-5 text-purple-600"
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
                placeholder="Ex.: Ruído acima de 85 dB, produtos químicos..."
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
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
              placeholder="CNIS\nPPP\nCarteira de Trabalho\nCarta de Concessão\nLaudo Pericial"
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
                placeholder="Ex.: 50000"
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
            className="flex-1 bg-gradient-to-r from-yellow-600 to-yellow-800 text-white py-4 rounded-lg hover:from-yellow-700 hover:to-yellow-900 disabled:opacity-60 transition font-bold text-xl shadow-lg hover:shadow-xl"
          >
            {loading ? 'Gerando Petição...' : 'Gerar Revisão de Benefício'}
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
          <Preview peticao={resultado} title="Petição Gerada - Revisão de Benefício" />
        </div>
      )}
    </div>
  );
};

export default RevisaoBeneficioForm;