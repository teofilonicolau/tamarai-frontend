// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import FormularioPeticao from './components/FormularioDinamico/FormularioPeticao';
import ConsultaJuridica from './components/FormularioDinamico/ConsultaJuridica';
import AnaliseTexto from './components/FormularioDinamico/AnaliseTexto';
import ParecerJuridico from './components/FormularioDinamico/ParecerJuridico';
import PeticaoExecucao from './components/FormularioDinamico/PeticaoExecucao';
import PeticaoMonitoria from './components/FormularioDinamico/PeticaoMonitoria';
import Calculadoras from './pages/Calculadoras';
import Dashboard from './pages/Dashboard';

// 🎯 COMPONENTE WRAPPER PARA PETIÇÕES INTELIGENTE
const PeticaoPage = () => {
  const { tipoPeticao } = useParams();
  
  // 🤖 FERRAMENTAS IA
  if (tipoPeticao === 'consulta-juridica') return <ConsultaJuridica />;
  if (tipoPeticao === 'analise-texto') return <AnaliseTexto />;
  if (tipoPeticao === 'parecer-juridico') return <ParecerJuridico />;
  
  // ⚖️ PROCESSUAL CIVIL
  if (tipoPeticao === 'peticao-execucao') return <PeticaoExecucao />;
  if (tipoPeticao === 'peticao-monitoria') return <PeticaoMonitoria />;
  
  // 🏛️ PADRÃO (PREVIDENCIÁRIO E OUTROS)
  return <FormularioPeticao tipoPeticao={tipoPeticao} />;
};

// �� COMPONENTE WRAPPER PARA CALCULADORAS
const CalculadorasPage = () => {
  return <Calculadoras />;
};

// 🚀 COMPONENTE PRINCIPAL DA APLICAÇÃO
function App() {
  return (
    <Router>
      <div className="App">
        
        {/* 🔥 SISTEMA DE NOTIFICAÇÕES */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500'
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: 'var(--success)',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: 'var(--error)',
                secondary: '#fff',
              },
            },
            loading: {
              iconTheme: {
                primary: 'var(--accent)',
                secondary: '#fff',
              },
            },
          }}
        />
        
        {/* 🛣️ SISTEMA DE ROTAS COMPLETO */}
        <Routes>
          
          {/* 🏠 PÁGINA INICIAL SEM SIDEBAR */}
          <Route path="/" element={<Home />} />
          
          {/* 📄 PETIÇÕES COM SIDEBAR */}
          <Route path="/peticoes/:tipoPeticao" element={
            <Layout>
              <PeticaoPage />
            </Layout>
          } />
          
          {/* 🧮 CALCULADORAS COM SIDEBAR */}
          <Route path="/calculadoras" element={
            <Layout>
              <CalculadorasPage />
            </Layout>
          } />
          
          {/* 🧮 CALCULADORAS POR CATEGORIA */}
          <Route path="/calculadoras/previdenciario" element={
            <Layout>
              <CalculadorasPage />
            </Layout>
          } />
          
          <Route path="/calculadoras/trabalhista" element={
            <Layout>
              <CalculadorasPage />
            </Layout>
          } />
          
          <Route path="/calculadoras/processual" element={
            <Layout>
              <CalculadorasPage />
            </Layout>
          } />
          
          <Route path="/calculadoras/financeiro" element={
            <Layout>
              <CalculadorasPage />
            </Layout>
          } />
          
          {/* 📊 DASHBOARD */}
          <Route path="/dashboard" element={
            <Layout>
              <Dashboard />
            </Layout>
          } />
          
          {/* 🔍 ROTA 404 - PÁGINA NÃO ENCONTRADA */}
          <Route path="*" element={
            <Layout>
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 20px',
                color: 'var(--text-primary)'
              }}>
                <h1 style={{ fontSize: '4em', margin: '0 0 20px 0' }}>🔍</h1>
                <h2 style={{ margin: '0 0 15px 0' }}>Página não encontrada</h2>
                <p style={{ color: 'var(--text-secondary)' }}>
                  A página que você está procurando não existe.
                </p>
                <button
                  onClick={() => window.location.href = '/'}
                  style={{
                    marginTop: '20px',
                    padding: '12px 24px',
                    background: 'var(--accent)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  🏠 Voltar ao Início
                </button>
              </div>
            </Layout>
          } />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;