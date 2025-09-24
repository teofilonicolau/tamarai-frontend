// src/components/Calculadoras/FormTempoEspecial.jsx
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { ENDPOINTS } from '../../config/endpoints';

const FormTempoEspecial = () => {
  const [dataInicioEspecial, setDataInicioEspecial] = useState('');
  const [tempoEspecial, setTempoEspecial] = useState('');
  const [tempoRural, setTempoRural] = useState('');
  const [tempoUrbano, setTempoUrbano] = useState('');
  const [erros, setErros] = useState({});
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  const validarFormulario = () => {
    const novosErros = {};

    if (!dataInicioEspecial) {
      novosErros.data_inicio_especial = 'Informe a data de início especial';
    }
    if (!tempoEspecial || parseInt(tempoEspecial) <= 0) {
      novosErros.tempo_especial = 'Informe o tempo especial (meses)';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    const dados = {
      data_inicio_especial: dataInicioEspecial ? new Date(dataInicioEspecial).toISOString().split('T')[0] : '',
      tempo_especial: parseInt(tempoEspecial) || 0,
      tempo_rural: parseInt(tempoRural) || 0,
      tempo_urbano: parseInt(tempoUrbano) || 0,
    };

    setLoading(true);
    setResultado(null);
    try {
      const response = await api.post(ENDPOINTS.calculadoras.tempo_especial, dados);
      setResultado({
        tempo_total: response.data.tempo_total || 0,
        elegibilidade: response.data.elegibilidade || 'Não informado',
        detalhes: response.data.detalhes || ''
      });
      toast.success('Cálculo realizado com sucesso!');
    } catch (error) {
      const msg = error.response?.data?.detail || 'Erro no cálculo: verifique os valores';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #dee2e6',
      padding: '30px'
    }}>
      <h3 style={{ color: '#495057', marginBottom: '25px', textAlign: 'center' }}>
        ⏳ Cálculo de Tempo Especial
      </h3>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
            📅 Data de Início Especial:
          </label>
          <input
            type="date"
            value={dataInicioEspecial}
            onChange={(e) => setDataInicioEspecial(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: `2px solid ${erros.data_inicio_especial ? '#dc3545' : '#dee2e6'}`,
              borderRadius: '8px',
              fontSize: '1em'
            }}
            required
          />
          {erros.data_inicio_especial && (
            <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '5px' }}>
              {erros.data_inicio_especial}
            </div>
          )}
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
            ⏱️ Tempo Especial (meses):
          </label>
          <input
            type="number"
            value={tempoEspecial}
            onChange={(e) => setTempoEspecial(e.target.value)}
            placeholder="Ex: 120"
            style={{
              width: '100%',
              padding: '12px',
              border: `2px solid ${erros.tempo_especial ? '#dc3545' : '#dee2e6'}`,
              borderRadius: '8px',
              fontSize: '1em'
            }}
            required
          />
          {erros.tempo_especial && (
            <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '5px' }}>
              {erros.tempo_especial}
            </div>
          )}
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
            🌾 Tempo Rural (meses):
          </label>
          <input
            type="number"
            value={tempoRural}
            onChange={(e) => setTempoRural(e.target.value)}
            placeholder="Ex: 60"
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #dee2e6',
              borderRadius: '8px',
              fontSize: '1em'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
            🏙️ Tempo Urbano (meses):
          </label>
          <input
            type="number"
            value={tempoUrbano}
            onChange={(e) => setTempoUrbano(e.target.value)}
            placeholder="Ex: 180"
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #dee2e6',
              borderRadius: '8px',
              fontSize: '1em'
            }}
          />
        </div>

        {resultado && (
          <div style={{
            background: '#d4edda',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '25px',
            border: '1px solid #28a745'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#155724' }}>
              📈 Resultado do Cálculo:
            </h4>
            <div style={{ color: '#155724', fontSize: '0.95em' }}>
              <p style={{ margin: '5px 0' }}>
                <strong>Tempo Total (meses):</strong> {resultado.tempo_total}
              </p>
              <p style={{ margin: '5px 0' }}>
                <strong>Elegibilidade:</strong> {resultado.elegibilidade}
              </p>
              {resultado.detalhes && (
                <p style={{ margin: '5px 0' }}>
                  <strong>Detalhes:</strong> {resultado.detalhes}
                </p>
              )}
            </div>
          </div>
        )}

        <div style={{
          background: '#e3f2fd',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '25px'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#1565c0' }}>
            📋 Informações Legais:
          </h4>
          <ul style={{ margin: '0', paddingLeft: '20px', color: '#1565c0', fontSize: '0.9em' }}>
            <li><strong>Lei 8.213/91, Art. 57:</strong> Requisitos para aposentadoria especial</li>
            <li><strong>Decreto 3.048/99:</strong> Regulamenta tempo de contribuição especial</li>
            <li>Períodos rurais e urbanos podem ser convertidos com fatores específicos</li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '15px',
            border: 'none',
            background: loading ? '#6c757d' : '#28a745',
            color: 'white',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '1.1em',
            fontWeight: 'bold'
          }}
        >
          {loading ? '⏳ Calculando...' : '🧮 Calcular Tempo Especial'}
        </button>
      </form>
    </div>
  );
};

export default FormTempoEspecial;