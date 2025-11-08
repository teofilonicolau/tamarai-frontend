import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { ENDPOINTS } from '../../config/endpoints';
import { normalizePayload } from '../../utils/payload';
import Preview from '../FormularioDinamico/Preview';

const RevisaoBeneficioForm = () => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset 
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);

  const onSubmit = async (raw) => {
    setLoading(true);
    setResultado(null);
    try {
      const cpf = (raw.cpf || '').toString().replace(/\D/g, '');
      const payload = normalizePayload({
        tipo_beneficio: raw.tipo_beneficio || 'Revisão de Benefício',
        numero_beneficio: raw.numero_beneficio || '',
        der: raw.der ? new Date(raw.der).toISOString().split('T')[0] : '',
        dib: raw.dib ? new Date(raw.dib).toISOString().split('T')[0] : '',
        nome: raw.nome || '',
        cpf,
        data_nascimento: raw.data_nascimento ? new Date(raw.data_nascimento).toISOString().split('T')[0] : '',
        motivo_rev: raw.motivo_rev || '',
        tipo_revisao: raw.tipo_revisao || '',
        periodos_revisao: raw.periodos_revisao || '',
        historico_contribuicoes: raw.historico_contribuicoes || '',
        documentos_anexos: (raw.documentos_anexos || '').toString().split('\n').map(s => s.trim()).filter(Boolean)
      });

      if (!payload.nome) throw new Error('Nome do requerente é obrigatório');
      if (!payload.cpf || payload.cpf.length !== 11) throw new Error('CPF inválido: deve conter 11 dígitos');
      if (!payload.numero_beneficio) throw new Error('Número do benefício (NB) é obrigatório');
      if (!payload.motivo_rev) throw new Error('Descreva o motivo da revisão');

      const endpoint = ENDPOINTS?.previdenciario?.peticao_revisao_beneficio ||
                      ENDPOINTS?.previdenciario?.revisao_beneficio;
      if (!endpoint) throw new Error('Endpoint não configurado para Revisão de Benefício');

      const resp = await api.post(endpoint, payload);
      setResultado(resp.data);
      toast.success('Petição de revisão gerada com sucesso!');
    } catch (err) {
      console.error('RevisaoBeneficioForm error:', err);
      const serverData = err?.response?.data || err?.response || null;
      let msg = err?.message || 'Erro ao gerar petição';
      if (serverData) {
        if (Array.isArray(serverData.detail)) {
          msg = serverData.detail.map(d => d.msg || JSON.stringify(d)).join(' ; ');
        } else if (Array.isArray(serverData)) {
          msg = serverData.map(i => (i?.msg || JSON.stringify(i))).join(' ; ');
        } else if (serverData.message) {
          msg = serverData.message;
        } else if (typeof serverData === 'string') {
          msg = serverData;
        } else {
          try { msg = JSON.stringify(serverData); } catch { msg = String(serverData); }
        }
      }
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Revisão de Benefício Previdenciário
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
              {...register('cpf', { required: 'CPF é obrigatório' })}
              placeholder="Apenas números (11 dígitos)"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.cpf && <p className="text-red-600 text-sm mt-1">{errors.cpf.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Número do Benefício (NB) <span className="text-red-500">*</span>
            </label>
            <input
              {...register('numero_beneficio', { required: 'NB é obrigatório' })}
              placeholder="Ex.: 1234567890"
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.numero_beneficio && <p className="text-red-600 text-sm mt-1">{errors.numero_beneficio.message}</p>}
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
        </div>

        <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-700">
          <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
            Detalhes da Revisão
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Tipo de Revisão
              </label>
              <select
                {...register('tipo_revisao')}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Selecione...</option>
                <option value="inclusao_tempo_especial">Inclusão de Tempo Especial</option>
                <option value="revisao_vida_toda">Revisão da Vida Toda</option>
                <option value="revisao_teto">Revisão do Teto</option>
                <option value="revisao_artigo_29">Revisão do Art. 29 (Buraco Negro)</option>
                <option value="revisao_fator_previdenciario">Revisão do Fator Previdenciário</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Motivo da Revisão <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('motivo_rev', { required: 'Motivo é obrigatório' })}
                rows={4}
                placeholder="Descreva detalhadamente o erro no cálculo, períodos não considerados, etc."
                className="w-full px-3 py-2 border rounded-md"
              />
              {errors.motivo_rev && <p className="text-red-600 text-sm mt-1">{errors.motivo_rev.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Períodos para Revisão (um por linha)
              </label>
              <textarea
                {...register('periodos_revisao')}
                rows={3}
                placeholder="Ex.:\n01/01/1990 a 31/12/1994 - Tempo Especial\n15/05/2000 a 10/10/2005 - Contribuição Rural"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Histórico de Contribuições
          </label>
          <textarea
            {...register('historico_contribuicoes')}
            rows={4}
            placeholder="Descreva todas as contribuições, empregos e períodos relevantes para a revisão"
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
            placeholder="Ex.:\nCNIS\nPPP\nCarteira de Trabalho\nCarta de Concessão"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition"
          >
            {loading ? 'Gerando petição...' : '📄 Gerar Petição'}
          </button>
          <button
            type="button"
            onClick={() => {
              reset();
              setResultado(null);
            }}
            disabled={loading}
            className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 disabled:opacity-60 transition"
          >
            Limpar Formulário
          </button>
        </div>
      </form>

      {resultado && (
        <div className="mt-10">
          <Preview peticao={resultado} title="Preview da Petição Gerada" />
        </div>
      )}
    </div>
  );
};

export default RevisaoBeneficioForm;