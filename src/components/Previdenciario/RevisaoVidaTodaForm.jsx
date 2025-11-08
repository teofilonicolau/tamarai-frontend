import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { ENDPOINTS } from '../../config/endpoints';
import { normalizePayload } from '../../utils/payload';
import Preview from '../FormularioDinamico/Preview';

const RevisaoVidaTodaForm = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);

  const onSubmit = async (raw) => {
    setLoading(true);
    setResultado(null);
    try {
      const cpf = (raw.cpf || '').toString().replace(/\D/g, '');
      const payload = normalizePayload({
        tipo_beneficio: raw.tipo_beneficio || '',
        numero_beneficio: raw.numero_beneficio || '',
        der: raw.der ? new Date(raw.der).toISOString().split('T')[0] : '',
        dib: raw.dib ? new Date(raw.dib).toISOString().split('T')[0] : '',
        nome: raw.nome || '',
        cpf,
        data_nascimento: raw.data_nascimento ? new Date(raw.data_nascimento).toISOString().split('T')[0] : '',
        historico_contribuicoes: raw.historico_contribuicoes || '',
        documentos_anexos: (raw.documentos_anexos || '').toString().split('\n').map(s => s.trim()).filter(Boolean)
      });

      if (!payload.cpf || payload.cpf.length !== 11) throw new Error('CPF inválido');
      const endpoint = ENDPOINTS?.previdenciario?.peticao_revisao_vida_toda;
      if (!endpoint) throw new Error('Endpoint não configurado');

      const resp = await api.post(endpoint, payload);
      setResultado(resp.data);
      toast.success('Petição gerada com sucesso!');
    } catch (err) {
      console.error('RevisaoVidaTodaForm error:', err);
      const msg = err?.response?.data?.detail || err?.message || 'Erro';
      toast.error(Array.isArray(msg) ? JSON.stringify(msg) : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Revisão — Vida Toda</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div><label>Nome</label><input {...register('nome', { required: 'Nome obrigatório' })} className="w-full" />{errors.nome && <p className="text-red-600">{errors.nome.message}</p>}</div>
        <div><label>CPF</label><input {...register('cpf', { required: 'CPF obrigatório' })} className="w-full" />{errors.cpf && <p className="text-red-600">{errors.cpf.message}</p>}</div>
        <div><label>Histórico de Contribuições</label><textarea {...register('historico_contribuicoes')} rows={4} className="w-full" /></div>
        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">{loading ? 'Gerando...' : 'Gerar'}</button>
          <button type="button" onClick={() => { reset(); setResultado(null); }} className="bg-gray-200 px-4 py-2 rounded">Limpar</button>
        </div>
      </form>
      {resultado && <div className="mt-6"><Preview peticao={resultado} title="Preview da Petição" /></div>}
    </div>
  );
};

export default RevisaoVidaTodaForm;