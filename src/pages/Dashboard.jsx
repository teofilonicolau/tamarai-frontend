// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';

const MetricasOverview = ({ data }) => {
  if (!data) return <div>Carregando métricas...</div>;
  
  return (
    <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
      <div style={{ 
        background: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '8px',
        minWidth: '200px',
        textAlign: 'center'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>📊 Total de Cálculos</h3>
        <p style={{ fontSize: '2em', margin: '0', color: '#007bff', fontWeight: 'bold' }}>
          {data.total_calculos}
        </p>
      </div>
      
      <div style={{ 
        background: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '8px',
        minWidth: '200px',
        textAlign: 'center'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>📈 Casos Este Mês</h3>
        <p style={{ fontSize: '2em', margin: '0', color: '#28a745', fontWeight: 'bold' }}>
          {data.casos_mes}
        </p>
      </div>
      
      <div style={{ 
        background: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '8px',
        minWidth: '200px',
        textAlign: 'center'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>⭐ Feedback Médio</h3>
        <p style={{ fontSize: '2em', margin: '0', color: '#ffc107', fontWeight: 'bold' }}>
          {data.feedback_medio}/5
        </p>
      </div>
    </div>
  );
};

const GraficosAnalise = ({ data }) => {
  if (!data?.calculos_por_tipo) return null;
  
  return (
    <div style={{ 
      background: '#ffffff', 
      padding: '20px', 
      borderRadius: '8px',
      border: '1px solid #dee2e6',
      marginBottom: '20px'
    }}>
      <h3 style={{ marginTop: '0', color: '#495057' }}>📊 Cálculos por Tipo</h3>
      <div>
        {Object.entries(data.calculos_por_tipo).map(([tipo, quantidade]) => (
          <div key={tipo} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            padding: '10px 0',
            borderBottom: '1px solid #f8f9fa'
          }}>
            <span style={{ fontWeight: '500', textTransform: 'capitalize' }}>
              {tipo.replace('_', ' ')}
            </span>
            <span style={{ 
              background: '#007bff', 
              color: 'white', 
              padding: '4px 12px', 
              borderRadius: '20px',
              fontSize: '0.9em'
            }}>
              {quantidade}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AlertasJuridicos = () => {
  return (
    <div style={{ 
      background: '#d4edda', 
      padding: '20px', 
      borderRadius: '8px',
      border: '1px solid #c3e6cb'
    }}>
      <h3 style={{ marginTop: '0', color: '#155724' }}>🚨 Status do Sistema</h3>
      <div style={{ color: '#155724' }}>
        <div style={{ marginBottom: '10px' }}>
          <span style={{ fontWeight: 'bold' }}>✅ Sistema:</span> Funcionando perfeitamente
        </div>
        <div style={{ marginBottom: '10px' }}>
          <span style={{ fontWeight: 'bold' }}>💡 Calculadoras:</span> EC 103/2019 operacional
        </div>
        <div>
          <span style={{ fontWeight: 'bold' }}>📊 Analytics:</span> Coletando dados em tempo real
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await api.get('/api/v1/analytics/dashboard');
        setMetrics(response.data);
      } catch (err) {
        setError('Erro ao carregar métricas: ' + err.message);
        console.error('Erro:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMetrics();
  }, []);
  
  if (loading) return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>⏳ Carregando dashboard...</h2>
    </div>
  );
  
  if (error) return (
    <div style={{ padding: '20px', color: 'red' }}>
      <h2>❌ Erro: {error}</h2>
      <p>Verifique se o backend está rodando em http://localhost:8000</p>
    </div>
  );
  
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#495057', marginBottom: '30px' }}>📊 Dashboard Executivo</h1>
      <MetricasOverview data={metrics} />
      <GraficosAnalise data={metrics} />
      <AlertasJuridicos />
      
      <div style={{ 
        marginTop: '30px', 
        padding: '15px', 
        background: '#f8f9fa', 
        borderRadius: '8px',
        fontSize: '0.9em',
        color: '#6c757d'
      }}>
        <strong>Última atualização:</strong> {metrics?.ultima_atualizacao ? 
          new Date(metrics.ultima_atualizacao).toLocaleString('pt-BR') : 
          'Não disponível'
        }
      </div>
    </div>
  );
};

export default Dashboard;