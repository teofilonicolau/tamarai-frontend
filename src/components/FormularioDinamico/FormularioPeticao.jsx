import React, { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { ENDPOINTS } from '../../config/endpoints';
import { normalizePayload } from '../../utils/payload';
import Preview from './Preview';
import { getPrevidenciarioEntry } from '../../components/Previdenciario';

// Helper para formatar data de forma segura (retorna '' se inválida)
const safeFormatDate = (value) => {
  if (!value && value !== 0) return '';
  try {
    const asString = String(value).trim();
    const dmY = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(asString);
    const candidate = dmY ? `${dmY[3]}-${dmY[2]}-${dmY[1]}` : asString;
    const d = new Date(candidate);
    if (Number.isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  } catch (e) {
    console.warn('safeFormatDate failed for value:', value, e);
    return '';
  }
};

const FormularioPeticao = ({ tipoPeticao }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [peticaoGerada, setPeticaoGerada] = useState(null);

  // aceita variações: 'peticao-xxx' ou 'xxx'
  const normalizeSlug = (slug) => {
    if (!slug) return slug;
    return slug.startsWith('peticao-') ? slug : `peticao-${slug}`;
  };

  const normalizedSlug = normalizeSlug(tipoPeticao);

  // detecta variações no param (ex.: "aposentadoria-invalidez" ou "peticao-aposentadoria-invalidez")
  const isAposentadoriaInvalidez = tipoPeticao === 'peticao-aposentadoria-invalidez' || tipoPeticao === 'aposentadoria-invalidez';

  // controle da seção específica (colapsável) para evitar poluir a UI
  const [showDadosAutor, setShowDadosAutor] = useState(isAposentadoriaInvalidez);

  useEffect(() => {
    if (isAposentadoriaInvalidez) setShowDadosAutor(true);
  }, [isAposentadoriaInvalidez]);

  // Delegação para formulários previdenciários (lazy load)
  const previdEntry = getPrevidenciarioEntry(normalizedSlug);
  if (previdEntry) {
    const FormComponent = previdEntry.component;
    return (
      <Suspense fallback={<div className="text-center py-8">Carregando formulário previdenciário...</div>}>
        <FormComponent />
      </Suspense>
    );
  }

  const validateAndNormalizeCpfCnpj = (obj) => {
    if (obj.cpf) {
      const cpfOnly = String(obj.cpf).replace(/\D/g, '');
      if (cpfOnly.length !== 11) throw new Error('CPF do autor inválido: informe 11 dígitos sem pontuação.');
      obj.cpf = cpfOnly;
    }

    if (obj.cpf_cnpj_parte_contraria) {
      const only = String(obj.cpf_cnpj_parte_contraria).replace(/\D/g, '');
      if (only.length !== 11 && only.length !== 14) throw new Error('CPF/CNPJ da parte contrária inválido: informe 11 (CPF) ou 14 (CNPJ) dígitos.');
      obj.cpf_cnpj_parte_contraria = only;
    }

    return obj;
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Normaliza e evita Invalid time value
      let cleanedData = normalizePayload({
        tipo_peticao: normalizedSlug,
        parte_contraria: data.parte_contraria || '',
        cpf_cnpj_parte_contraria: data.cpf_cnpj_parte_contraria ? String(data.cpf_cnpj_parte_contraria).replace(/\D/g, '') : '',
        endereco_parte_contraria: data.endereco_parte_contraria || '',
        valor_causa: (data.valor_causa !== undefined && data.valor_causa !== null) ? Number(data.valor_causa) : 0,
        data_fato_gerador: safeFormatDate(data.data_fato_gerador),
        descricao_caso: data.descricao_caso || '',
        documentos_anexos: data.documentos_anexos ? data.documentos_anexos.split('\n').map(doc => doc.trim()).filter(Boolean) : []
      });

      // Validações genéricas
      if (cleanedData.cpf_cnpj_parte_contraria && cleanedData.cpf_cnpj_parte_contraria.length !== 11 && cleanedData.cpf_cnpj_parte_contraria.length !== 14) {
        throw new Error('CPF/CNPJ da parte contrária inválido (deve conter 11 ou 14 dígitos)');
      }
      if (cleanedData.valor_causa <= 0) throw new Error('Valor da causa deve ser maior que 0');
      if (!cleanedData.descricao_caso) throw new Error('Descrição do caso é obrigatória');

      // Seleciona endpoint via normalizedSlug (mais robusto)
      let endpoint;
      switch (normalizedSlug) {
        case 'peticao-vinculo':
          endpoint = ENDPOINTS.trabalhista.peticao_vinculo;
          break;
        case 'peticao-quesitos-insalubridade':
        case 'quesitos-insalubridade':
          endpoint = ENDPOINTS.trabalhista.quesitos_insalubridade;
          break;
        case 'peticao-vicio-produto':
          endpoint = ENDPOINTS.consumidor.peticao_vicio_produto;
          break;
        case 'peticao-cobranca-indevida':
          endpoint = ENDPOINTS.consumidor.peticao_cobranca_indevida;
          break;
        case 'peticao-cobranca':
          endpoint = ENDPOINTS.civil.peticao_cobranca;
          break;
        case 'peticao-indenizacao':
          endpoint = ENDPOINTS.civil.peticao_indenizacao;
          break;
        case 'peticao-execucao':
          endpoint = ENDPOINTS.processual.peticao_execucao;
          break;
        case 'peticao-monitoria':
          endpoint = ENDPOINTS.processual.peticao_monitoria;
          break;
        default:
          throw new Error('Tipo de petição inválido');
      }

      if (!endpoint) throw new Error('Endpoint para este tipo de petição não está configurado');

      // Validações finais e normalização de CPF/CNPJ (frontend)
      cleanedData = validateAndNormalizeCpfCnpj(cleanedData);

      // Debug: log do endpoint que será usado (ajuda a confirmar se aponta para o backend certo)
      if (import.meta.env.DEV) {
        console.debug('[FormularioPeticao] endpoint ->', endpoint);
        console.debug('[FormularioPeticao] payload ->', cleanedData);
      }

      // Envia para o backend
      const response = await api.post(endpoint, cleanedData);
      setPeticaoGerada(response.data);
      toast.success('Petição gerada com sucesso!');
    } catch (error) {
      const serverData = error?.response?.data || error?.response || null;
      let msg = error?.message || 'Erro ao gerar petição. Verifique os dados.';
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
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Gerar Petição</h1>
          <p className="text-gray-600 dark:text-gray-300">Preencha os dados para gerar sua petição</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Campos comuns - grid 2 colunas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Parte Contrária</label>
              <input {...register('parte_contraria', { required: 'Parte contrária é obrigatória' })} placeholder="Nome da parte contrária" className="w-full px-3 py-2 border rounded-md" />
              {errors.parte_contraria && <p className="text-red-600 text-sm mt-1">{errors.parte_contraria.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">CPF/CNPJ da Parte Contrária</label>
              <input {...register('cpf_cnpj_parte_contraria')} placeholder="Ex.: 123.456.789-00 ou 12.345.678/0001-99" className="w-full px-3 py-2 border rounded-md" />
            </div>

            <div>
              <label className="block text-sm font medium text-gray-700 dark:text-gray-200 mb-1">Endereço da Parte Contrária</label>
              <input {...register('endereco_parte_contraria')} placeholder="Endereço completo" className="w-full px-3 py-2 border rounded-md" />
            </div>

            <div>
              <label className="block text-sm font medium text-gray-700 dark:text-gray-200 mb-1">Valor da Causa</label>
              <input type="number" step="0.01" {...register('valor_causa', { required: 'Valor da causa é obrigatório', valueAsNumber: true })} placeholder="Ex.: 10000.00" className="w-full px-3 py-2 border rounded-md" />
              {errors.valor_causa && <p className="text-red-600 text-sm mt-1">{errors.valor_causa.message}</p>}
            </div>

            <div>
              <label className="block text-sm font medium text-gray-700 dark:text-gray-200 mb-1">Data do Fato Gerador</label>
              <input type="date" {...register('data_fato_gerador', { required: 'Data é obrigatória' })} className="w-full px-3 py-2 border rounded-md" />
              <p className="text-xs text-gray-500 mt-1">Formato exibido pelo navegador (ex.: dd/mm/yyyy). Se precisar, informe a data no padrão ISO no backend.</p>
              {errors.data_fato_gerador && <p className="text-red-600 text-sm mt-1">{errors.data_fato_gerador.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font medium text-gray-700 dark:text-gray-200 mb-1">Descrição do Caso</label>
            <textarea {...register('descricao_caso', { required: 'Descrição é obrigatória' })} rows={5} placeholder="Descreva o caso" className="w-full px-3 py-2 border rounded-md" />
            {errors.descricao_caso && <p className="text-red-600 text-sm mt-1">{errors.descricao_caso.message}</p>}
          </div>

          <div>
            <label className="block text-sm font medium text-gray-700 dark:text-gray-200 mb-1">Documentos Anexos (um por linha)</label>
            <textarea {...register('documentos_anexos')} rows={3} placeholder="Ex.: RG\nLaudo Médico\nComprovante de Residência" className="w-full px-3 py-2 border rounded-md" />
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowDadosAutor(s => !s)}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200"
            >
              {showDadosAutor ? 'Ocultar' : 'Mostrar'} Dados do Autor / Benefício {isAposentadoriaInvalidez ? '(preenchimento recomendado)' : ''}
            </button>
            <p className="text-xs text-gray-500 mt-2">Os campos abaixo são específicos para petições previdenciárias (ex.: aposentadoria por invalidez). Só abra se necessário.</p>
          </div>

          {showDadosAutor && (
            <div className="mt-4 p-4 border rounded-md bg-gray-50">
              {/* ... seção previdenciária (mantida sem alterações) ... */}
              {/* (mantenha o mesmo conteúdo que já tinha para os campos previdenciários) */}
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-3 mt-2">
            <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-60">
              {loading ? 'Gerando...' : '📄 Gerar Petição'}
            </button>
            <button type="button" onClick={() => reset()} disabled={loading} className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700">
              Limpar Formulário
            </button>
          </div>
        </form>

        {peticaoGerada && (
          <div className="mt-8">
            <Preview peticao={peticaoGerada} title="Preview da Petição" />
          </div>
        )}
      </div>
    </div>
  );
};

export default FormularioPeticao;