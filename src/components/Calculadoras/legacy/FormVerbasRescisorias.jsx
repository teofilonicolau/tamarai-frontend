// src/components/Calculadoras/FormVerbasRescisorias.jsx
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { ENDPOINTS } from '../../config/endpoints';

const FormVerbasRescisorias = ({ loading }) => {
  const [dados, setDados] = useState({
    salario: '',
    data_admissao: '',
    data_rescisao: '',
    tipo_rescisao: 'sem_justa_causa',
    aviso_previo_trabalhado: false,
    ferias_vencidas: 0,
    ferias_proporcionais: true,
    decimo_terceiro_proporcional: true
  });
  const [erros, setErros] = useState({});
  const [resultado, setResultado] = useState(null);

  const tiposRescisao = [
    { value: 'sem_justa_causa', label: '🚫 Demissão sem Justa Causa', cor: '#dc3545' },
    { value: 'com_justa_causa', label: '⚠️ Demissão com Justa Causa', cor: '#fd7e14' },
    { value: 'pedido_demissao', label: '🚪 Pedido de Demissão', cor: '#6c757d' },
    { value: 'rescisao_indireta', label: '⚖️ Rescisão Indireta', cor: '#28a745' },
    { value: 'acordo_mutuo', label: '🤝 Acordo Mútuo', cor: '#17a2b8' },
    { value: 'termino_contrato', label: '📅 Término de Contrato', cor: '#6f42c1' }
  ];

  const validarFormulario = () => {
    const novosErros = {};

    if (!dados.salario || parseFloat(dados.salario.replace(/[^\d,]/g, '').replace(',', '.')) <= 0) {
      novosErros.salario = 'Informe o salário do empregado';
    }
    if (!dados.data_admissao) {
      novosErros.data_admissao = 'Informe a data de admissão';
    }
    if (!dados.data_rescisao) {
      novosErros.data_rescisao = 'Informe a data de rescisão';
    }
    if (dados.data_admissao && dados.data_rescisao) {
      const admissao = new Date(dados.data_admissao);
      const rescisao = new Date(dados.data_rescisao);
      if (admissao >= rescisao) {
        novosErros.data_rescisao = 'Data de rescisão deve ser posterior à admissão';
      }
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const calcularTempoServico = () => {
    if (dados.data_admissao && dados.data_rescisao) {
      const admissao = new Date(dados.data_admissao);
      const rescisao = new Date(dados.data_rescisao);
      const diffTime = Math.abs(rescisao - admissao);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const anos = Math.floor(diffDays / 365);
      const meses = Math.floor((diffDays % 365) / 30);
      const dias = diffDays % 30;
      
      return { anos, meses, dias, totalDias: diffDays };
    }
    return null;
  };

  const formatarMoeda = (valor) => {
    const numero = valor.replace(/\D/g, '');
    const valorFormatado = (parseFloat(numero) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
    return valorFormatado;
  };

  const handleSalarioChange = (e) => {
    const valor = e.target.value;
    const valorFormatado = formatarMoeda(valor);
    setDados({...dados, salario: valorFormatado});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    const dadosParaCalcular = {
      salario: parseFloat(dados.salario.replace(/[^\d,]/g, '').replace(',', '.')) || 0,
      data_admissao: dados.data_admissao ? new Date(dados.data_admissao).toISOString().split('T')[0] : '',
      data_rescisao: dados.data_rescisao ? new Date(dados.data_rescisao).toISOString().split('T')[0] : '',
      tipo_rescisao: dados.tipo_rescisao,
      aviso_previo_trabalhado: dados.aviso_previo_trabalhado,
      ferias_vencidas: Number(dados.ferias_vencidas) || 0,
      ferias_proporcionais: dados.ferias_proporcionais,
      decimo_terceiro_proporcional: dados.decimo_terceiro_proporcional
    };

    try {
      const response = await api.post(ENDPOINTS.calculadoras.verbas_rescisorias, dadosParaCalcular);
      setResultado({
        saldo_salario: response.data.saldo_salario || 0,
        aviso_previo: response.data.aviso_previo || 0,
        ferias_vencidas: response.data.ferias_vencidas || 0,
        ferias_proporcionais: response.data.ferias_proporcionais || 0,
        decimo_terceiro: response.data.decimo_terceiro || 0,
        multa_fgts: response.data.multa_fgts || 0,
        total: response.data.total || 0
      });
      toast.success('Cálculo realizado com sucesso!');
    } catch (error) {
      const msg = error.response?.data?.detail || 'Erro no cálculo: verifique os valores';
      toast.error(msg);
    }
  };

  const tempoServico = calcularTempoServico();
  const tipoSelecionado = tiposRescisao.find(t => t.value === dados.tipo_rescisao);

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #dee2e6',
      padding: '30px'
    }}>
      <h3 style={{ color: '#495057', marginBottom: '25px', textAlign: 'center' }}>
        💼 Cálculo de Verbas Rescisórias
      </h3>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
            💰 Salário Mensal (R$):
          </label>
          <input
            type="text"
            value={dados.salario}
            onChange={handleSalarioChange}
            placeholder="R$ 0,00"
            style={{
              width: '100%',
              padding: '12px',
              border: `2px solid ${erros.salario ? '#dc3545' : '#dee2e6'}`,
              borderRadius: '8px',
              fontSize: '1em'
            }}
          />
          {erros.salario && (
            <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '5px' }}>
              {erros.salario}
            </div>
          )}
          <div style={{ fontSize: '0.9em', color: '#6c757d', marginTop: '5px', fontStyle: 'italic' }}>
            💡 Último salário recebido pelo empregado
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
              📅 Data de Admissão:
            </label>
            <input
              type="date"
              value={dados.data_admissao}
              onChange={(e) => setDados({...dados, data_admissao: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                border: `2px solid ${erros.data_admissao ? '#dc3545' : '#dee2e6'}`,
                borderRadius: '8px',
                fontSize: '1em'
              }}
            />
            {erros.data_admissao && (
              <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '5px' }}>
                {erros.data_admissao}
              </div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
              📅 Data de Rescisão:
            </label>
            <input
              type="date"
              value={dados.data_rescisao}
              onChange={(e) => setDados({...dados, data_rescisao: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                border: `2px solid ${erros.data_rescisao ? '#dc3545' : '#dee2e6'}`,
                borderRadius: '8px',
                fontSize: '1em'
              }}
            />
            {erros.data_rescisao && (
              <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '5px' }}>
                {erros.data_rescisao}
              </div>
            )}
          </div>
        </div>

        {tempoServico && (
          <div style={{
            background: '#e8f5e8',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #28a745'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#155724' }}>
              ⏱️ Tempo de Serviço Calculado:
            </h4>
            <p style={{ margin: '0', color: '#155724', fontSize: '1.1em', fontWeight: 'bold' }}>
              {tempoServico.anos} anos, {tempoServico.meses} meses e {tempoServico.dias} dias
            </p>
            <p style={{ margin: '5px 0 0 0', color: '#155724', fontSize: '0.9em' }}>
              Total: {tempoServico.totalDias} dias
            </p>
          </div>
        )}

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: 'bold', color: '#495057' }}>
            ⚖️ Tipo de Rescisão:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '10px' }}>
            {tiposRescisao.map(tipo => (
              <label key={tipo.value} style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '12px 15px',
                border: `2px solid ${dados.tipo_rescisao === tipo.value ? tipo.cor : '#dee2e6'}`,
                borderRadius: '8px',
                background: dados.tipo_rescisao === tipo.value ? `${tipo.cor}15` : '#ffffff',
                transition: 'all 0.3s ease'
              }}>
                <input
                  type="radio"
                  name="tipo_rescisao"
                  value={tipo.value}
                  checked={dados.tipo_rescisao === tipo.value}
                  onChange={(e) => setDados({...dados, tipo_rescisao: e.target.value})}
                  style={{ marginRight: '10px' }}
                />
                <span style={{ fontSize: '0.9em', color: dados.tipo_rescisao === tipo.value ? tipo.cor : '#495057' }}>
                  {tipo.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {tipoSelecionado && (
          <div style={{
            background: `${tipoSelecionado.cor}15`,
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '25px',
            border: `1px solid ${tipoSelecionado.cor}`
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: tipoSelecionado.cor }}>
              📋 Informações sobre {tipoSelecionado.label}:
            </h4>
            <div style={{ color: tipoSelecionado.cor, fontSize: '0.9em' }}>
              {dados.tipo_rescisao === 'sem_justa_causa' && (
                <ul style={{ margin: '0', paddingLeft: '20px' }}>
                  <li>Aviso prévio (trabalhado ou indenizado)</li>
                  <li>Saldo de salário</li>
                  <li>13º salário proporcional</li>
                  <li>Férias vencidas + 1/3</li>
                  <li>Férias proporcionais + 1/3</li>
                  <li>Multa de 40% do FGTS</li>
                  <li>Liberação do FGTS</li>
                  <li>Seguro-desemprego</li>
                </ul>
              )}
              {dados.tipo_rescisao === 'com_justa_causa' && (
                <ul style={{ margin: '0', paddingLeft: '20px' }}>
                  <li>Apenas saldo de salário</li>
                  <li>Férias vencidas (se houver)</li>
                  <li>Sem direito a aviso prévio</li>
                  <li>Sem direito ao 13º proporcional</li>
                  <li>Sem direito a férias proporcionais</li>
                  <li>Sem direito ao FGTS e multa</li>
                </ul>
              )}
              {dados.tipo_rescisao === 'pedido_demissao' && (
                <ul style={{ margin: '0', paddingLeft: '20px' }}>
                  <li>Saldo de salário</li>
                  <li>13º salário proporcional</li>
                  <li>Férias vencidas + 1/3</li>
                  <li>Férias proporcionais + 1/3</li>
                  <li>Sem direito a aviso prévio</li>
                  <li>Sem direito ao FGTS e multa</li>
                </ul>
              )}
            </div>
          </div>
        )}

        <div style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '25px'
        }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#495057' }}>
            ⚙️ Opções Adicionais:
          </h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '10px',
              border: '1px solid #dee2e6',
              borderRadius: '6px',
              background: 'white'
            }}>
              <input
                type="checkbox"
                checked={dados.aviso_previo_trabalhado}
                onChange={(e) => setDados({...dados, aviso_previo_trabalhado: e.target.checked})}
                style={{ marginRight: '8px' }}
              />
              <span style={{ fontSize: '0.9em' }}>⏰ Aviso prévio trabalhado</span>
            </label>

            <label style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '10px',
              border: '1px solid #dee2e6',
              borderRadius: '6px',
              background: 'white'
            }}>
              <input
                type="checkbox"
                checked={dados.ferias_proporcionais}
                onChange={(e) => setDados({...dados, ferias_proporcionais: e.target.checked})}
                style={{ marginRight: '8px' }}
              />
              <span style={{ fontSize: '0.9em' }}>🏖️ Férias proporcionais</span>
            </label>

            <label style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '10px',
              border: '1px solid #dee2e6',
              borderRadius: '6px',
              background: 'white'
            }}>
              <input
                type="checkbox"
                checked={dados.decimo_terceiro_proporcional}
                onChange={(e) => setDados({...dados, decimo_terceiro_proporcional: e.target.checked})}
                style={{ marginRight: '8px' }}
              />
              <span style={{ fontSize: '0.9em' }}>🎁 13º salário proporcional</span>
            </label>
          </div>

          <div style={{ marginTop: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
              🏖️ Férias Vencidas (períodos):
            </label>
            <input
              type="number"
              value={dados.ferias_vencidas}
              onChange={(e) => setDados({...dados, ferias_vencidas: parseInt(e.target.value) || 0})}
              min="0"
              max="3"
              style={{
                width: '100px',
                padding: '8px',
                border: '1px solid #dee2e6',
                borderRadius: '6px',
                fontSize: '1em'
              }}
            />
            <div style={{ fontSize: '0.8em', color: '#6c757d', marginTop: '3px' }}>
              Número de períodos de férias vencidas (0 a 3)
            </div>
          </div>
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
              <p style={{ margin: '5px 0' }}><strong>Saldo de Salário:</strong> R$ {resultado.saldo_salario.toFixed(2)}</p>
              <p style={{ margin: '5px 0' }}><strong>Aviso Prévio:</strong> R$ {resultado.aviso_previo.toFixed(2)}</p>
              <p style={{ margin: '5px 0' }}><strong>Férias Vencidas:</strong> R$ {resultado.ferias_vencidas.toFixed(2)}</p>
              <p style={{ margin: '5px 0' }}><strong>Férias Proporcionais:</strong> R$ {resultado.ferias_proporcionais.toFixed(2)}</p>
              <p style={{ margin: '5px 0' }}><strong>13º Salário Proporcional:</strong> R$ {resultado.decimo_terceiro.toFixed(2)}</p>
              <p style={{ margin: '5px 0' }}><strong>Multa FGTS:</strong> R$ {resultado.multa_fgts.toFixed(2)}</p>
              <p style={{ margin: '5px 0' }}><strong>Total:</strong> R$ {resultado.total.toFixed(2)}</p>
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
            📋 Base Legal:
          </h4>
          <ul style={{ margin: '0', paddingLeft: '20px', color: '#1565c0', fontSize: '0.9em' }}>
            <li><strong>CLT Art. 477:</strong> Prazo para pagamento das verbas rescisórias</li>
            <li><strong>CLT Art. 487:</strong> Aviso prévio e suas modalidades</li>
            <li><strong>CLT Art. 142:</strong> Férias proporcionais e vencidas</li>
            <li><strong>Lei 8.036/90:</strong> FGTS e multa rescisória</li>
            <li><strong>CLT Art. 7º, XXI:</strong> Seguro-desemprego</li>
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
          {loading ? '⏳ Calculando...' : '🧮 Calcular Verbas Rescisórias'}
        </button>
      </form>
    </div>
  );
};

export default FormVerbasRescisorias;