import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { ENDPOINTS } from '../../config/endpoints';
import { normalizePayload } from '../../utils/payload';
import Preview from './Preview';

const FormularioPeticao = ({ tipoPeticao }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [peticaoGerada, setPeticaoGerada] = useState(null);
  const previewRef = useRef(null);

  // detecta variações no param (ex.: "aposentadoria-invalidez" ou "peticao-aposentadoria-invalidez")
  const isAposentadoriaInvalidez = tipoPeticao === 'peticao-aposentadoria-invalidez' || tipoPeticao === 'aposentadoria-invalidez';

  // controle da seção específica (colapsável) para evitar poluir a UI
  const [showDadosAutor, setShowDadosAutor] = useState(isAposentadoriaInvalidez);

  // auto-expand se for aposentadoria por invalidez
  useEffect(() => {
    if (isAposentadoriaInvalidez) setShowDadosAutor(true);
  }, [isAposentadoriaInvalidez]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Payload base comum (mantém compatibilidade com implementações anteriores)
      let cleanedData = normalizePayload({
        tipo_peticao: tipoPeticao,
        parte_contraria: data.parte_contraria || '',
        cpf_cnpj_parte_contraria: data.cpf_cnpj_parte_contraria ? String(data.cpf_cnpj_parte_contraria).replace(/\D/g, '') : '',
        endereco_parte_contraria: data.endereco_parte_contraria || '',
        valor_causa: parseFloat(data.valor_causa) || 0,
        data_fato_gerador: data.data_fato_gerador ? new Date(data.data_fato_gerador).toISOString().split('T')[0] : '',
        descricao_caso: data.descricao_caso || '',
        documentos_anexos: data.documentos_anexos ? data.documentos_anexos.split('\n').map(doc => doc.trim()).filter(Boolean) : []
      });

      // Validações genéricas
      if (cleanedData.cpf_cnpj_parte_contraria && cleanedData.cpf_cnpj_parte_contraria.length !== 11 && cleanedData.cpf_cnpj_parte_contraria.length !== 14) {
        throw new Error('CPF/CNPJ da parte contrária inválido (deve conter 11 ou 14 dígitos)');
      }
      if (cleanedData.valor_causa <= 0) throw new Error('Valor da causa deve ser maior que 0');
      if (!cleanedData.descricao_caso) throw new Error('Descrição do caso é obrigatória');

      // Seleciona endpoint e adapta payload por tipo
      let endpoint;
      switch (tipoPeticao) {
        case 'peticao-vinculo':
          endpoint = ENDPOINTS.trabalhista.peticao_vinculo;
          break;
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
        case 'peticao-aposentadoria-invalidez':
        case 'aposentadoria-invalidez':
          endpoint = ENDPOINTS.previdenciario?.peticao_aposentadoria_invalidez || ENDPOINTS.previdenciario?.aposentadoria_invalidez || ENDPOINTS.previdenciario?.peticao_aposentadoria || ENDPOINTS.previdenciario?.peticao;
          // Constrói payload específico para aposentadoria por invalidez
          cleanedData = {
            tipo_beneficio: data.tipo_beneficio || 'Aposentadoria por Invalidez',
            numero_beneficio: data.numero_beneficio || '',
            der: data.der ? new Date(data.der).toISOString().split('T')[0] : (data.data_fato_gerador ? new Date(data.data_fato_gerador).toISOString().split('T')[0] : ''),
            dib: data.dib ? new Date(data.dib).toISOString().split('T')[0] : '',
            numero_processo_administrativo: data.numero_processo_administrativo || '',
            motivo_recusa: data.motivo_recusa || '',
            nome: data.nome || '',
            cpf: data.cpf ? String(data.cpf).replace(/\D/g, '') : '',
            rg: data.rg || '',
            orgao_emissor: data.orgao_emissor || '',
            endereco_completo: data.endereco_completo || data.endereco_parte_contraria || '',
            telefone: data.telefone || '',
            data_nascimento: data.data_nascimento ? new Date(data.data_nascimento).toISOString().split('T')[0] : '',
            tempo_contribuicao_total: Number(data.tempo_contribuicao_total) || 0,
            historico_laboral: data.historico_laboral || '',
            historico_contribuicoes: data.historico_contribuicoes || '',
            informacoes_medicas: data.informacoes_medicas || data.descricao_caso || '',
            laudos_medicos: data.laudos_medicos ? data.laudos_medicos.split('\n').map(l => l.trim()).filter(Boolean) : [],
            cid_principal: data.cid_principal || '',
            atividade_especial: !!data.atividade_especial,
            exposicao_agentes_nocivos: data.exposicao_agentes_nocivos || '',
            valor_causa: parseFloat(data.valor_causa) || 0,
            justica_gratuita: data.justica_gratuita === true || data.justica_gratuita === 'true',
            tutela_antecipada: data.tutela_antecipada === true || data.tutela_antecipada === 'true',
            especialidade_perito: data.especialidade_perito || '',
            comarca: data.comarca || '',
            cidade_comarca: data.cidade_comarca || '',
            estado_comarca: data.estado_comarca || ''
          };

          // validações específicas
          if (!cleanedData.nome) throw new Error('Nome do autor é obrigatório para esta petição');
          if (!cleanedData.cpf || cleanedData.cpf.length !== 11) throw new Error('CPF do autor obrigatório e deve ter 11 dígitos');
          break;
        default:
          throw new Error('Tipo de petição inválido');
      }

      if (!endpoint) throw new Error('Endpoint para este tipo de petição não está configurado');

      const response = await api.post(endpoint, cleanedData);
      setPeticaoGerada(response.data);
      toast.success('Petição gerada com sucesso!');
    } catch (error) {
      // formata mensagens do backend
      const serverData = error.response?.data || error.response || null;
      let msg = error.message || 'Erro ao gerar petição. Verifique os dados.';
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

  const copiarTexto = () => {
    if (previewRef.current) {
      navigator.clipboard.writeText(previewRef.current.innerText);
      toast.success('Texto copiado!');
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Endereço da Parte Contrária</label>
              <input {...register('endereco_parte_contraria')} placeholder="Endereço completo" className="w-full px-3 py-2 border rounded-md" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Valor da Causa</label>
              <input type="number" step="0.01" {...register('valor_causa', { required: 'Valor da causa é obrigatório', valueAsNumber: true })} placeholder="Ex.: 10000.00" className="w-full px-3 py-2 border rounded-md" />
              {errors.valor_causa && <p className="text-red-600 text-sm mt-1">{errors.valor_causa.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Data do Fato Gerador</label>
              <input type="date" {...register('data_fato_gerador', { required: 'Data é obrigatória' })} className="w-full px-3 py-2 border rounded-md" />
              <p className="text-xs text-gray-500 mt-1">Formato exibido pelo navegador (ex.: dd/mm/yyyy). Se precisar, informe a data no padrão ISO no backend.</p>
              {errors.data_fato_gerador && <p className="text-red-600 text-sm mt-1">{errors.data_fato_gerador.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Descrição do Caso</label>
            <textarea {...register('descricao_caso', { required: 'Descrição é obrigatória' })} rows={5} placeholder="Descreva o caso" className="w-full px-3 py-2 border rounded-md" />
            {errors.descricao_caso && <p className="text-red-600 text-sm mt-1">{errors.descricao_caso.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Documentos Anexos (um por linha)</label>
            <textarea {...register('documentos_anexos')} rows={3} placeholder="Ex.: RG\nLaudo Médico\nComprovante de Residência" className="w-full px-3 py-2 border rounded-md" />
          </div>

          {/* Toggle da seção específica de Previdenciário */}
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

          {/* Seção específica (previdenciário) — colapsável */}
          {showDadosAutor && (
            <div className="mt-4 p-4 border rounded-md bg-gray-50">
              <h3 className="text-lg font-semibold mb-3">Dados do Autor / Benefício</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <input {...register('nome', { required: isAposentadoriaInvalidez })} className="w-full px-3 py-2 border rounded-md" placeholder="Nome completo" />
                  {errors.nome && <p className="text-red-600 text-sm mt-1">{errors.nome.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                  <input {...register('cpf', { required: isAposentadoriaInvalidez })} className="w-full px-3 py-2 border rounded-md" placeholder="Somente números (11 dígitos)" />
                  {errors.cpf && <p className="text-red-600 text-sm mt-1">{errors.cpf.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">RG</label>
                  <input {...register('rg')} className="w-full px-3 py-2 border rounded-md" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Órgão Emissor</label>
                  <input {...register('orgao_emissor')} className="w-full px-3 py-2 border rounded-md" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
                  <input type="date" {...register('data_nascimento')} className="w-full px-3 py-2 border rounded-md" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">DER (Data do Evento)</label>
                  <input type="date" {...register('der')} className="w-full px-3 py-2 border rounded-md" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">DIB</label>
                  <input type="date" {...register('dib')} className="w-full px-3 py-2 border rounded-md" />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Histórico Laboral</label>
                  <textarea {...register('historico_laboral')} rows={3} className="w-full px-3 py-2 border rounded-md" />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Informações Médicas / Laudos (um por linha)</label>
                  <textarea {...register('laudos_medicos')} rows={3} placeholder="Laudo 1\nLaudo 2" className="w-full px-3 py-2 border rounded-md" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CID Principal</label>
                  <input {...register('cid_principal')} className="w-full px-3 py-2 border rounded-md" />
                </div>

                <div className="flex items-center gap-3">
                  <input type="checkbox" {...register('atividade_especial')} className="h-4 w-4" />
                  <label className="text-sm">Atividade Especial</label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exposição a Agentes Nocivos</label>
                  <input {...register('exposicao_agentes_nocivos')} className="w-full px-3 py-2 border rounded-md" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Comarca</label>
                  <input {...register('comarca')} className="w-full px-3 py-2 border rounded-md" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                  <input {...register('cidade_comarca')} className="w-full px-3 py-2 border rounded-md" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <input {...register('estado_comarca')} className="w-full px-3 py-2 border rounded-md" />
                </div>
              </div>
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