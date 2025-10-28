import React from 'react';

// Componente para exibir resultados de cálculos trabalhistas
const ResultadosTrabalhistas = ({ tipo, resultados = {}, dadosEntrada }) => {
  // Função para formatar valores monetários
  const formatarMoeda = (valor) => {
    return valor != null ? `R$ ${Number(valor).toFixed(2).replace('.', ',')}` : 'R$ 0,00';
  };

  // Função para formatar tempo de serviço
  const formatarTempoServico = (tempo) => {
    if (!tempo) return 'Não informado';
    return `${tempo.anos || 0} anos, ${tempo.meses || 0} meses e ${tempo.dias || 0} dias`;
  };

  // Normaliza um valor de percentual vindo do backend pra number (ex.: 20, "20%", "20,0", {percentual:20})
  const parsePercentual = (raw) => {
    if (raw == null) return NaN;

    if (typeof raw === 'number') {
      return Number.isFinite(raw) ? raw : NaN;
    }

    if (typeof raw === 'string') {
      const cleaned = raw.replace('%', '').replace(/\s/g, '').replace(',', '.');
      const n = parseFloat(cleaned);
      return Number.isFinite(n) ? n : NaN;
    }

    if (typeof raw === 'object') {
      const candidates = [
        raw.percentual,
        raw.percentual_adicional,
        raw.value,
        raw.percent,
        raw.data,
      ];
      for (const c of candidates) {
        if (c != null) {
          const parsed = parsePercentual(c);
          if (Number.isFinite(parsed)) return parsed;
        }
      }
    }

    return NaN;
  };

  // Componente reutilizável para seção de dados de entrada
  const DadosEntradaSection = () => (
    dadosEntrada && (
      <div style={{
        background: '#f8f9fa',
        padding: '15px',
        borderRadius: '8px',
        marginTop: '20px',
        border: '1px solid #dee2e6'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>📋 Dados Utilizados no Cálculo</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.9em' }}>
          <p><strong>CPF:</strong> {dadosEntrada?.cpf || 'Não informado'}</p>
          <p><strong>Salário:</strong> {formatarMoeda(dadosEntrada?.salario ?? dadosEntrada?.salario_base)}</p>
          {dadosEntrada?.data_admissao && (
            <p><strong>Data Admissão:</strong> {dadosEntrada.data_admissao}</p>
          )}
          {dadosEntrada?.data_rescisao && (
            <p><strong>Data Rescisão:</strong> {dadosEntrada.data_rescisao}</p>
          )}
          {dadosEntrada?.tipo_rescisao && (
            <p><strong>Tipo Rescisão:</strong> {dadosEntrada.tipo_rescisao}</p>
          )}
          {dadosEntrada?.horas_noturnas && (
            <p><strong>Horas Noturnas/Dia:</strong> {dadosEntrada.horas_noturnas}h</p>
          )}
          {dadosEntrada?.dias_trabalhados && (
            <p><strong>Dias Trabalhados:</strong> {dadosEntrada.dias_trabalhados}</p>
          )}
        </div>
      </div>
    )
  );

  // Seção Horas Extras
  const HorasExtrasSection = () => (
    <div style={{
      background: 'white',
      padding: '30px',
      borderRadius: '12px',
      border: '1px solid #dee2e6'
    }}>
      <h3 style={{ color: '#28a745', marginBottom: '25px', textAlign: 'center' }}>
        ⏰ Resultado - Horas Extras
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
        <div style={{ background: '#e8f5e8', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#155724' }}>📊 Resumo do Cálculo</h4>
          <p><strong>Horas extras diárias:</strong> {resultados.horas_extras_diarias || 0}h</p>
          <p><strong>Total de horas extras:</strong> {resultados.total_horas_extras || 0}h</p>
          <p><strong>Adicional aplicado:</strong> {resultados.adicional_aplicado || '50%'}</p>
        </div>

        <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#1565c0' }}>💰 Valores</h4>
          <p><strong>Valor hora normal:</strong> {formatarMoeda(resultados.valor_hora_normal)}</p>
          <p><strong>Valor hora extra:</strong> {formatarMoeda(resultados.valor_hora_extra)}</p>
          <p style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#28a745' }}>
            <strong>Valor total:</strong> {formatarMoeda(resultados.valor_total)}
          </p>
        </div>
      </div>

      <div style={{ background: '#fff3cd', padding: '15px', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>⚠️ Observações Importantes</h4>
        <ul style={{ margin: '0', paddingLeft: '20px', color: '#856404' }}>
          <li>Valor calculado com base no adicional mínimo de 50% (CLT)</li>
          <li>Considere reflexos em férias, 13º salário e FGTS</li>
          <li>Verifique convenção coletiva para percentuais superiores</li>
        </ul>
      </div>

      <DadosEntradaSection />
    </div>
  );

  // Seção Verbas Rescisórias
  const VerbasRescisoriasSection = () => (
    <div style={{
      background: 'white',
      padding: '30px',
      borderRadius: '12px',
      border: '1px solid #dee2e6'
    }}>
      <h3 style={{ color: '#28a745', marginBottom: '25px', textAlign: 'center' }}>
        💼 Resultado - Verbas Rescisórias
      </h3>

      <div style={{ background: '#e8f5e8', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#155724' }}>⏱️ Tempo de Serviço</h4>
        <p style={{ fontSize: '1.1em', fontWeight: 'bold' }}>
          {formatarTempoServico(resultados.tempo_servico)}
        </p>
        <p>Total: {resultados.tempo_servico?.total_dias || 0} dias</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px', marginBottom: '25px' }}>
        {Object.entries(resultados.verbas_detalhadas || {}).map(([verba, dados]) => (
          <div key={verba} style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
            <h5 style={{ margin: '0 0 10px 0', color: '#495057', textTransform: 'capitalize' }}>
              {verba.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </h5>
            {typeof dados === 'object' && dados.valor_total != null && (
              <>
                <p style={{ fontSize: '1.1em', fontWeight: 'bold', color: '#28a745' }}>
                  {formatarMoeda(dados.valor_total)}
                </p>
                <p style={{ fontSize: '0.9em', color: '#6c757d' }}>
                  {dados.observacao || 'Verba rescisória calculada conforme CLT'}
                </p>
              </>
            )}
          </div>
        ))}
      </div>

      <div style={{ background: '#28a745', color: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
        <h4 style={{ margin: '0 0 10px 0' }}>💰 Total das Verbas Rescisórias</h4>
        <p style={{ fontSize: '2em', fontWeight: 'bold', margin: '0' }}>
          {formatarMoeda(resultados.total_verbas_rescisorias)}
        </p>
      </div>

      <DadosEntradaSection />
    </div>
  );

  // Seção Adicional Noturno (defensiva)
  const AdicionalNoturnoSection = () => {
    const percRaw = (resultados?.percentual_adicional ?? resultados?.percentual) || resultados?.adicional_percentual;
    const percNum = parsePercentual(percRaw);
    const percToShow = Number.isFinite(percNum) ? percNum : 20; // fallback 20%

    // Formatar exibição segura do percentual
    const percentualExibicao = `${Math.round(percToShow)}%`;

    return (
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '12px',
        border: '1px solid #dee2e6'
      }}>
        <h3 style={{ color: '#28a745', marginBottom: '25px', textAlign: 'center' }}>
          ⏰ Resultado - Adicional Noturno
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
          <div style={{ background: '#e8f5e8', padding: '15px', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#155724' }}>📊 Cálculo</h4>
            <p><strong>Horas noturnas/dia:</strong> {resultados.horas_noturnas_diarias || resultados.horas_noturnas || 0}h</p>
            <p><strong>Total horas noturnas:</strong> {resultados.total_horas_noturnas || 0}h</p>
            <p><strong>Percentual adicional:</strong> {percentualExibicao}</p>
          </div>

          <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#1565c0' }}>💰 Valores</h4>
            <p><strong>Valor hora normal:</strong> {formatarMoeda(resultados.valor_hora_normal)}</p>
            <p><strong>Valor hora noturna:</strong> {formatarMoeda(resultados.valor_hora_noturna)}</p>
            <p style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#28a745' }}>
              <strong>Valor adicional:</strong> {formatarMoeda(resultados.valor_adicional)}
            </p>
          </div>
        </div>

        <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#1565c0' }}>📋 Informações Legais</h4>
          <ul style={{ margin: '0', paddingLeft: '20px', color: '#1565c0' }}>
            <li>Horário noturno: 22h às 5h (CLT, art. 73)</li>
            <li>Hora noturna reduzida: 52min30s</li>
            <li>Adicional mínimo: 20% sobre hora normal</li>
          </ul>
        </div>

        <DadosEntradaSection />
      </div>
    );
  };

  // Mapeamento de tipos para componentes
  const tipoMap = {
    'horas-extras': HorasExtrasSection,
    'verbas-rescisorias': VerbasRescisoriasSection,
    'adicional-noturno': AdicionalNoturnoSection
  };

  const Componente = tipoMap[tipo] || (() => (
    <div style={{ padding: 20 }}>Tipo não suportado</div>
  ));
  return <Componente />;
};

export default ResultadosTrabalhistas;