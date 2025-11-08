// src/components/Previdenciario/BasePrevidenciarioForm.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import Preview from '../FormularioDinamico/Preview';
import api from '../../services/api';
import { normalizePayload } from '../../utils/payload';
import usePrevidenciarioValidators from './hooks/usePrevidenciarioValidators';
import { ENDPOINTS } from '../../config/endpoints';

/**
 * Props:
 * - initialValues (object) optional
 * - buildPayload(data): function (child-specific) -> returns object payload
 * - endpoint: string OR endpointKey (if endpoint key from ENDPOINTS.previdenciario)
 * - title: string
 */
const BasePrevidenciarioForm = ({ initialValues = {}, buildPayload, endpoint, endpointKey, title }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({ defaultValues: initialValues });
  const [loading, setLoading] = useState(false);
  const [peticaoGerada, setPeticaoGerada] = useState(null);
  const { onlyDigits, validateCpfOrCnpj } = usePrevidenciarioValidators();

  const resolveEndpoint = () => {
    if (endpoint) return endpoint;
    if (endpointKey && ENDPOINTS.previdenciario && ENDPOINTS.previdenciario[endpointKey]) return ENDPOINTS.previdenciario[endpointKey];
    return `/api/v1/previdenciario/${endpointKey || ''}`;
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // child builds specific payload (fields mapping)
      const specific = buildPayload ? buildPayload(data) : {};
      // normalization centralizada
      let payload = normalizePayload({ ...specific });

      // final CPF/CNPJ normalization & validation (defesa em profundidade)
      if (payload.cpf) {
        payload.cpf = onlyDigits(payload.cpf);
        if (!validateCpfOrCnpj(payload.cpf)) throw new Error('CPF inválido: verifique os dígitos.');
      }
      if (payload.cpf_cnpj_parte_contraria) {
        payload.cpf_cnpj_parte_contraria = onlyDigits(payload.cpf_cnpj_parte_contraria);
        if (!validateCpfOrCnpj(payload.cpf_cnpj_parte_contraria)) throw new Error('CPF/CNPJ da parte contrária inválido.');
      }

      const url = resolveEndpoint();
      if (import.meta.env.DEV) console.debug('[BasePrevidenciarioForm] POST', url, payload);

      const resp = await api.post(url, payload);
      setPeticaoGerada(resp.data);
      toast.success('Petição gerada com sucesso!');
    } catch (err) {
      const serverData = err?.response?.data || err?.response || null;
      let msg = err?.message || 'Erro ao gerar petição';
      if (serverData) {
        if (Array.isArray(serverData.detail)) msg = serverData.detail.map(d => d.msg || JSON.stringify(d)).join(' ; ');
        else if (serverData.message) msg = serverData.message;
        else if (typeof serverData === 'string') msg = serverData;
        else msg = JSON.stringify(serverData);
      }
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm">Nome</label>
            <input {...register('nome')} className="w-full px-3 py-2 border rounded" />
          </div>

          <div>
            <label className="block text-sm">CPF</label>
            <input {...register('cpf', {
              setValueAs: v => (v ? onlyDigits(v) : ''),
              validate: v => (!v || validateCpfOrCnpj(v) || 'CPF inválido'),
            })} className="w-full px-3 py-2 border rounded" />
            {errors.cpf && <p className="text-red-600 text-sm mt-1">{errors.cpf.message}</p>}
          </div>

          <div>
            <label className="block text-sm">RG</label>
            <input {...register('rg')} className="w-full px-3 py-2 border rounded" />
          </div>

          <div>
            <label className="block text-sm">Órgão Emissor</label>
            <input {...register('orgao_emissor')} className="w-full px-3 py-2 border rounded" />
          </div>

          <div>
            <label className="block text-sm">Data de Nascimento</label>
            <input type="date" {...register('data_nascimento')} className="w-full px-3 py-2 border rounded" />
          </div>

          <div>
            <label className="block text-sm">Comarca</label>
            <input {...register('comarca')} className="w-full px-3 py-2 border rounded" />
          </div>
        </div>

        {/* espaço para inputs específicos do formulário filho (se necessário) */}
        <div>
          {/* Caso o formulário filho precise de inputs extras, adapte este Base ou crie um child que renderize inputs específicos */}
        </div>

        <div className="flex gap-3 mt-4">
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
            {loading ? 'Gerando...' : 'Gerar Petição'}
          </button>
          <button type="button" onClick={() => { reset(); setPeticaoGerada(null); }} className="bg-gray-200 px-4 py-2 rounded">
            Limpar
          </button>
        </div>
      </form>

      {peticaoGerada && (
        <div className="mt-6">
          <Preview peticao={peticaoGerada} title={title || 'Preview da Petição'} />
        </div>
      )}
    </div>
  );
};

export default BasePrevidenciarioForm;