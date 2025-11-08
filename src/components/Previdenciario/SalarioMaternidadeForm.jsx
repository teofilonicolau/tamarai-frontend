// src/components/Previdenciario/SalarioMaternidadeForm.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { ENDPOINTS } from '../../config/endpoints';
import { normalizePayload } from '../../utils/payload';
import { validators } from '../../utils/validations';
import Preview from '../FormularioDinamico/Preview';

const SalarioMaternidadeForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);

  // Apenas o campo necessário para o atributo `min` no input
  const periodoInicio = watch('periodo_licenca_inicio');

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
      if (!raw.nome?.trim()) throw new Error('Nome da mãe é obrigatório');
      if (cpf.length !== 11) throw new Error('CPF deve ter 11 dígitos');
      if (!validators.cpf(cpf)) throw new Error('CPF inválido');
      if (!raw.data_nascimento_filho) throw new Error('Data de nascimento do filho é obrigatória');
      if (!raw.periodo_licenca_inicio) throw new Error('Data de início da licença é obrigatória');
      if (!raw.der) throw new Error('DER é obrigatória');
      if (!raw.dib) throw new Error('DIB é obrigatória');

      // Validação de período
      if (raw.periodo_licenca_fim && raw.periodo_licenca_inicio) {
        const inicio = new Date(raw.periodo_licenca_inicio);
        const fim = new Date(raw.periodo_licenca_fim);
        if (fim < inicio) throw new Error('Data de fim da licença deve ser posterior ao início');
      }

      // ---------- 2. Payload normalizado ----------
      const payload = normalizePayload({
        tipo_beneficio: 'Salário-Maternidade',
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
        informacoes_medicas: '',
        laudos_medicos: [],
        cid_principal: '',
        atividade_especial: false,
        exposicao_agentes_nocivos: '',
        valor_causa: raw.valor_causa ? Number(raw.valor_causa) : 12000,
        justica_gratuita: raw.justica_gratuita === true || raw.justica_gratuita === 'true',
        tutela_antecipada: raw.tutela_antecipada === true || raw.tutela_antecipada === 'true',
        especialidade_perito: '',
        comarca: raw.comarca || '',
        cidade_comarca: raw.cidade_comarca || '',
        estado_comarca: raw.estado_comarca || '',
        // Campos específicos
        data_nascimento_filho: new Date(raw.data_nascimento_filho).toISOString().split('T')[0],
        periodo_licenca_inicio: new Date(raw.periodo_licenca_inicio).toISOString().split('T')[0],
        periodo_licenca_fim: raw.periodo_licenca_fim
          ? new Date(raw.periodo_licenca_fim).toISOString().split('T')[0]
          : '',
        tipo_contribuinte: raw.tipo_contribuinte || '',
        qualidade_segurada: raw.qualidade_segurada || '',
        documentos_anexos: documentos.length > 0 ? documentos : [],
      });

      // ---------- 3. Envio ----------
      const endpoint = ENDPOINTS?.previdenciario?.peticao_salario_maternidade;
      if (!endpoint) throw new Error('Endpoint não configurado');

      console.debug('[Payload Enviado - Salário-Maternidade]', payload);

      const resp = await api.post(endpoint, payload);
      setResultado(resp.data || resp);
      toast.success('Petição Salário-Maternidade gerada com sucesso!');
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
        Petição Inicial — Salário-Maternidade
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

        {/* Seção: Dados da Mãe */}
        <div className="bg-pink-50 dark:bg-pink-900 p-6 rounded-lg border border-pink-200 dark:border-pink-700">
          <h4 className="text-xl font-semibold mb-4 text-pink-800 dark:text-pink-200">
            Dados da Mãe (Requerente)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome Completo *</label>
              <input
                {...register('nome', { required: 'Nome obrigatório' })}
                placeholder="Ex.: Ana Clara dos Santos"
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

        {/* Seção: Dados do Filho */}
        <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
          <h4 className="text-xl font-semibold mb-4 text-blue-800 dark:text-blue-200">
            Dados do Filho
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Data de Nascimento do Filho *</label>
              <input
                type="date"
                {...register('data_nascimento_filho', { required: 'Data obrigatória' })}
                className="w-full px-4 py-2 border rounded-md"
              />
              {errors.data_nascimento_filho && <p className="text-red-600 text-sm">{errors.data_nascimento_filho.message}</p>}
            </div>
          </div>
        </div>

        {/* Seção: Período da Licença */}
        <div className="bg-green-50 dark:bg-green-900 p-6 rounded-lg border border-green-200 dark:border-green-700">
          <h4 className="text-xl font-semibold mb-4 text-green-800 dark:text-green-200">
            Período da Licença-Maternidade
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Início da Licença *</label>
              <input
                type="date"
                {...register('periodo_licenca_inicio', { required: 'Data obrigatória' })}
                className="w-full px-4 py-2 border rounded-md"
              />
              {errors.periodo_licenca_inicio && <p className="text-red-600 text-sm">{errors.periodo_licenca_inicio.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fim da Licença</label>
              <input
                type="date"
                {...register('periodo_licenca_fim')}
                min={periodoInicio || undefined}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Seção: Contribuição */}
        <div className="bg-purple-50 dark:bg-purple-900 p-6 rounded-lg border border-purple-200 dark:border-purple-700">
          <h4 className="text-xl font-semibold mb-4 text-purple-800 dark:text-purple-200">
            Informações de Contribuição
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tipo de Contribuinte</label>
              <select
                {...register('tipo_contribuinte')}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="">Selecione...</option>
                <option value="empregada">Empregada (CLT)</option>
                <option value="autonoma">Contribuinte Individual/Autônoma</option>
                <option value="facultativa">Contribuinte Facultativa</option>
                <option value="desempregada">Desempregada (período de graça)</option>
                <option value="mei">MEI</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Qualidade de Segurada</label>
              <select
                {...register('qualidade_segurada')}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="">Selecione...</option>
                <option value="mantida">Mantida</option>
                <option value="perdida">Perdida (requer reativação)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Seção: Histórico e Documentos */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <h4 className="text-xl font-semibold mb-4">Histórico e Documentos</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Histórico Laboral</label>
              <textarea
                {...register('historico_laboral')}
                rows={4}
                placeholder="Descreva empregos, contribuições e períodos relevantes..."
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Documentos Anexos (um por linha)</label>
              <textarea
                {...register('documentos_anexos')}
                rows={4}
                placeholder="Certidão de Nascimento do Filho\nCarteira de Trabalho\nComprovante de Contribuição\nRG e CPF"
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
                placeholder="Ex.: 12000"
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
              <label className="block text-sm font-medium mb mb-1">Comarca</label>
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
            className="flex-1 bg-gradient-to-r from-pink-600 to-pink-800 text-white py-4 rounded-lg hover:from-pink-700 hover:to-pink-900 disabled:opacity-60 transition font-bold text-xl shadow-lg hover:shadow-xl"
          >
            {loading ? 'Gerando Petição...' : 'Gerar Petição Salário-Maternidade'}
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
          <Preview peticao={resultado} title="Petição Gerada - Salário-Maternidade" />
        </div>
      )}
    </div>
  );
};

export default SalarioMaternidadeForm;