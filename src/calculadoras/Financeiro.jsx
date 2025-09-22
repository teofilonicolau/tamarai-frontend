import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { ENDPOINTS } from '../config/endpoints';
import { http } from '../services/api';
import { extractPayload } from '../utils/payload';

// Formulários filhos (ajusto abaixo)
import FormJurosMora from '../components/Calculadoras/FormJurosMora';
import FormCorrecaoMonetaria from '../components/Calculadoras/FormCorrecaoMonetaria';

const Financeiro = () => {
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ultimaAcao, setUltimaAcao] = useState(null); // 'juros' | 'correcao'

  const onSubmitJuros = async (form) => {
    setUltimaAcao('juros');
    const payload = extractPayload(form);
    setLoading(true);
    setResultado(null);
    try {
      const data = await http.post(ENDPOINTS.calculadoras.processual.juros_mora, payload);
      setResultado(data);
      toast.success('Juros de mora calculados com sucesso.');
    } catch (err) {
      toast.error(err?.message || 'Erro ao calcular juros de mora');
    } finally {
      setLoading(false);
    }
  };

  const onSubmitCorrecao = async (form) => {
    setUltimaAcao('correcao');
    const payload = extractPayload(form);
    setLoading(true);
    setResultado(null);
    try {
      const data = await http.post(ENDPOINTS.calculadoras.processual.correcao_monetaria, payload);
      setResultado(data);
      toast.success('Correção monetária calculada com sucesso.');
    } catch (err) {
      toast.error(err?.message || 'Erro ao calcular correção monetária');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-4 rounded-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Juros de Mora</h2>
          <FormJurosMora onSubmit={onSubmitJuros} loading={loading && ultimaAcao === 'juros'} />
        </div>

        <div className="p-4 rounded-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Correção Monetária</h2>
          <FormCorrecaoMonetaria onSubmit={onSubmitCorrecao} loading={loading && ultimaAcao === 'correcao'} />
        </div>
      </div>

      <div className="p-4 rounded-md border border-gray-200 dark:border-gray-700">
        <h3 className="text-md font-semibold mb-2">Resultado</h3>
        {loading ? (
          <p>Processando…</p>
        ) : resultado ? (
          <pre className="text-sm overflow-auto">
            {typeof resultado === 'object' ? JSON.stringify(resultado, null, 2) : String(resultado)}
          </pre>
        ) : (
          <p>Envie um formulário para ver o resultado.</p>
        )}
      </div>
    </div>
  );
};

export default Financeiro;