import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { ENDPOINTS } from '../../config/endpoints';
import { http } from '../../services/api';
import { extractPayload } from '../../utils/payload';

const Previdenciario = () => {
  const [saida, setSaida] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rota, setRota] = useState(null);

  const enviar = async (endpoint, form) => {
    setRota(endpoint);
    setLoading(true);
    setSaida(null);
    try {
      const data = await http.post(endpoint, extractPayload(form));
      setSaida(data);
      toast.success('Cálculo realizado.');
    } catch (err) {
      toast.error(err?.message || 'Erro na requisição');
    } finally {
      setLoading(false);
    }
  };

  // Exemplos mínimos de formulários — substitua pelos seus forms reais
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-4 rounded-md border">
          <h3 className="font-semibold mb-3">Regra de Transição (EC 103)</h3>
          <button
            className="px-3 py-2 bg-blue-600 text-white rounded-md"
            onClick={() =>
              enviar(ENDPOINTS.calculadoras.previdenciario.regra_transicao_ec103, {
                idade: 62,
                tempo_contribuicao_anos: 35,
              })
            }
            disabled={loading}
          >
            {loading && rota === ENDPOINTS.calculadoras.previdenciario.regra_transicao_ec103
              ? 'Processando…'
              : 'Testar'}
          </button>
        </div>

        <div className="p-4 rounded-md border">
          <h3 className="font-semibold mb-3">Tempo Especial</h3>
          <button
            className="px-3 py-2 bg-blue-600 text-white rounded-md"
            onClick={() =>
              enviar(ENDPOINTS.calculadoras.previdenciario.tempo_especial, {
                periodos: [{ inicio: '2005-01-01', fim: '2015-01-01', agente: 'ruido' }],
              })
            }
            disabled={loading}
          >
            {loading && rota === ENDPOINTS.calculadoras.previdenciario.tempo_especial
              ? 'Processando…'
              : 'Testar'}
          </button>
        </div>

        <div className="p-4 rounded-md border">
          <h3 className="font-semibold mb-3">Período de Graça</h3>
          <button
            className="px-3 py-2 bg-blue-600 text-white rounded-md"
            onClick={() =>
              enviar(ENDPOINTS.calculadoras.previdenciario.periodo_graca, {
                data_ultima_contribuicao: '2022-05-01',
                categoria: 'empregado',
              })
            }
            disabled={loading}
          >
            {loading && rota === ENDPOINTS.calculadoras.previdenciario.periodo_graca
              ? 'Processando…'
              : 'Testar'}
          </button>
        </div>

        <div className="p-4 rounded-md border">
          <h3 className="font-semibold mb-3">Revisão da Vida Toda</h3>
          <button
            className="px-3 py-2 bg-blue-600 text-white rounded-md"
            onClick={() =>
              enviar(ENDPOINTS.calculadoras.previdenciario.revisao_vida_toda, {
                salarios_contribuicao: [1000, 1500, 2000],
              })
            }
            disabled={loading}
          >
            {loading && rota === ENDPOINTS.calculadoras.previdenciario.revisao_vida_toda
              ? 'Processando…'
              : 'Testar'}
          </button>
        </div>
      </div>

      <div className="p-4 rounded-md border">
        <h3 className="text-md font-semibold mb-2">Resultado</h3>
        {loading ? (
          <p>Processando…</p>
        ) : saida ? (
          <pre className="text-sm overflow-auto">
            {typeof saida === 'object' ? JSON.stringify(saida, null, 2) : String(saida)}
          </pre>
        ) : (
          <p>Execute um cálculo para ver o resultado.</p>
        )}
      </div>
    </div>
  );
};

export default Previdenciario;