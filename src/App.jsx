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

// Componente wrapper para petições
const PeticaoPage = () => {
  const { tipoPeticao } = useParams();
  
  // Ferramentas IA
  if (tipoPeticao === 'consulta-juridica') return <ConsultaJuridica />;
  if (tipoPeticao === 'analise-texto') return <AnaliseTexto />;
  if (tipoPeticao === 'parecer-juridico') return <ParecerJuridico />;
  
  // Processual Civil
  if (tipoPeticao === 'peticao-execucao') return <PeticaoExecucao />;
  if (tipoPeticao === 'peticao-monitoria') return <PeticaoMonitoria />;
  
  // Padrão (previdenciário)
  return <FormularioPeticao tipoPeticao={tipoPeticao} />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              theme: {
                primary: '#4aed88',
              },
            },
          }}
        />
        
        <Routes>
          {/* Página inicial sem sidebar */}
          <Route path="/" element={<Home />} />
          
          {/* Páginas com sidebar */}
          <Route path="/peticoes/:tipoPeticao" element={
            <Layout>
              <PeticaoPage />
            </Layout>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
