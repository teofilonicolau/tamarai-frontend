import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { ENDPOINTS } from '../../config/endpoints';
import { normalizePayload } from '../../utils/payload';
import jsPDF from 'jspdf';

const FormularioConsumidor = ({ tipoPeticao }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [peticaoGerada, setPeticaoGerada] = useState(null);
  const previewRef = useRef(null);

  const onSubmit = async (data) => {
    setLoading(true);
    setPeticaoGerada(null);
    try {
      const rawCnpj = (data.cnpj_empresa || '').toString();
      const cnpjOnly = rawCnpj.replace(/\D/g, '');

      const cleanedData = normalizePayload({
        tipo_problema: data.tipo_problema,
        data_ocorrencia: data.data_ocorrencia ? new Date(data.data_ocorrencia).toISOString().split('T')[0] : '',
        descricao_problema: data.descricao_problema,
        empresa_re: data.empresa_re,
        cnpj_empresa: cnpjOnly,
        endereco_empresa: data.endereco_empresa || '',
        valor_produto_servico: parseFloat(data.valor_produto_servico) || 0,
        valor_prejuizo: parseFloat(data.valor_prejuizo) || 0,
        possui_nota_fiscal: !!data.possui_nota_fiscal,
        garantia_vigente: !!data.garantia_vigente,
        tentativa_solucao_amigavel: !!data.tentativa_solucao_amigavel,
        provas_disponiveis: (data.provas_disponiveis || '').toString().split('\n').map(p => p.trim()).filter(Boolean),
      });

      if (!cleanedData.cnpj_empresa || cleanedData.cnpj_empresa.length !== 14) {
        throw new Error('CNPJ deve ter 14 dígitos');
      }
      if (!cleanedData.data_ocorrencia) {
        throw new Error('Data da ocorrência é obrigatória');
      }
      if ((cleanedData.valor_produto_servico || 0) <= 0 && (cleanedData.valor_prejuizo || 0) <= 0) {
        throw new Error('Informe pelo menos um valor (produto/serviço ou prejuízo)');
      }

      const endpoint = tipoPeticao === 'peticao-vicio-produto'
        ? ENDPOINTS?.consumidor?.peticao_vicio_produto
        : ENDPOINTS?.consumidor?.peticao_cobranca_indevida;

      if (!endpoint) throw new Error('Endpoint consumidor não configurado');

      const response = await api.post(endpoint, cleanedData);
      setPeticaoGerada(response.data);
      toast.success('Petição gerada com sucesso!');
    } catch (error) {
      const serverData = error?.response?.data || error?.response || null;
      let msg = error?.message || 'Erro ao gerar petição. Verifique os dados.';
      if (serverData) {
        try {
          if (Array.isArray(serverData.detail)) {
            msg = serverData.detail.map(d => d.msg || JSON.stringify(d)).join(' ; ');
          } else if (serverData.message) {
            msg = serverData.message;
          } else if (typeof serverData === 'string') {
            msg = serverData;
          } else {
            msg = JSON.stringify(serverData);
          }
        } catch (e) {
          console.error('Erro ao processar serverData em FormularioConsumidor:', e);
        }
      }
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const gerarPDF = () => {
    if (!peticaoGerada?.texto_peticao) {
      toast.error('Nenhuma petição gerada para exportar.');
      return;
    }
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('Petição Consumidor', 10, 10);
    doc.text(peticaoGerada.texto_peticao, 10, 20, { maxWidth: 190 });
    doc.save(`peticao-${tipoPeticao}.pdf`);
    toast.success('PDF gerado com sucesso!');
  };

  const copiarTexto = () => {
    if (previewRef.current) {
      navigator.clipboard.writeText(previewRef.current.innerText);
      toast.success('Texto copiado!');
    }
  };

  const getTitulo = () => (tipoPeticao === 'peticao-vicio-produto' ? 'Petição por Vício de Produto' : 'Petição por Cobrança Indevida');

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">📜 {getTitulo()}</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de Problema</label>
            <input {...register('tipo_problema', { required: 'O tipo de problema é obrigatório' })} className="mt-1 block w-full p-3 border rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200" placeholder="Ex.: Defeito em produto, cobrança indevida" />
            {errors.tipo_problema && <p className="mt-1 text-sm text-red-600">{errors.tipo_problema.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data da Ocorrência</label>
            <input type="date" {...register('data_ocorrencia', { required: 'A data da ocorrência é obrigatória' })} className="mt-1 block w-full p-3 border rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200" />
            {errors.data_ocorrencia && <p className="mt-1 text-sm text-red-600">{errors.data_ocorrencia.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descrição do Problema</label>
            <textarea {...register('descricao_problema', { required: 'A descrição do problema é obrigatória' })} className="mt-1 block w-full p-3 border rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200" rows="5" placeholder="Descreva o problema enfrentado" />
            {errors.descricao_problema && <p className="mt-1 text-sm text-red-600">{errors.descricao_problema.message}</p>}
          </div>

          <div className="flex space-x-4">
            <button type="submit" disabled={loading} className={`flex-1 py-3 px-4 rounded-lg text-white font-medium ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>{loading ? '⏳ Gerando...' : 'Gerar Petição'}</button>
            <button type="button" onClick={() => { reset(); setPeticaoGerada(null); }} disabled={loading} className="flex-1 py-3 px-4 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700">Limpar Formulário</button>
          </div>
        </form>

        {peticaoGerada && (
          <div className="mt-8 border-t border-gray-200 dark:border-gray-600 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📋 Preview da Petição</h3>
            <div ref={previewRef} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">{peticaoGerada.texto_peticao}</pre>
            </div>
            <div className="mt-4 flex space-x-4">
              <button onClick={copiarTexto} className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Copiar Texto</button>
              <button onClick={gerarPDF} className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700">Gerar PDF</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormularioConsumidor;