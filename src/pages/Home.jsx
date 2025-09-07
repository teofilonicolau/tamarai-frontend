// src/pages/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  // Todas as petições e ferramentas organizadas por área
  const areas = {
    calculadoras: {
      titulo: 'Calculadoras Jurídicas',
      cor: 'bg-gradient-to-r from-purple-600 to-indigo-600',
      corHover: 'hover:from-purple-700 hover:to-indigo-700',
      icon: '🧮',
      descricao: 'Calculadoras especializadas por área jurídica',
      peticoes: [
        { id: 'calculadoras/previdenciario', nome: 'Previdenciário', icon: '⚖️', desc: 'EC 103/2019, Tempo Especial' },
        { id: 'calculadoras/trabalhista', nome: 'Trabalhista', icon: '👷', desc: 'Horas Extras, Rescisão' },
        { id: 'calculadoras/processual', nome: 'Processual', icon: '📋', desc: 'Valor da Causa, Liquidação' },
        { id: 'calculadoras/financeiro', nome: 'Financeiro', icon: '💰', desc: 'Juros, Correção Monetária' },
        { id: 'dashboard', nome: 'Dashboard', icon: '📊', desc: 'Métricas e Analytics' }
      ]
    },
    previdenciario: {
      titulo: 'Previdenciário',
      cor: 'bg-blue-600',
      corHover: 'hover:bg-blue-700',
      icon: '🏛️',
      descricao: 'Petições para benefícios do INSS',
      peticoes: [
        { id: 'aposentadoria-invalidez', nome: 'Aposentadoria por Invalidez', icon: '🏥' },
        { id: 'aposentadoria-tempo-contribuicao', nome: 'Aposentadoria por Tempo', icon: '⏰' },
        { id: 'aposentadoria-especial', nome: 'Aposentadoria Especial', icon: '⚠️' },
        { id: 'aposentadoria-rural', nome: 'Aposentadoria Rural', icon: '🌾' },
        { id: 'pensao-morte', nome: 'Pensão por Morte', icon: '💔' },
        { id: 'bpc-loas', nome: 'BPC/LOAS', icon: '🤝' },
        { id: 'salario-maternidade', nome: 'Salário Maternidade', icon: '👶' },
        { id: 'auxilio-doenca', nome: 'Auxílio Doença', icon: '🏥' },
        { id: 'revisao-vida-toda', nome: 'Revisão da Vida Toda', icon: '📊' },
        { id: 'revisao-beneficio', nome: 'Revisão de Benefício', icon: '🔄' }
      ]
    },
    trabalhista: {
      titulo: 'Trabalhista',
      cor: 'bg-green-600',
      corHover: 'hover:bg-green-700',
      icon: '⚖️',
      descricao: 'Petições para direitos trabalhistas',
      peticoes: [
        { id: 'peticao-vinculo', nome: 'Vínculo Empregatício', icon: '🤝' },
        { id: 'quesitos-insalubridade', nome: 'Quesitos Insalubridade', icon: '⚠️' }
      ]
    },
    consumidor: {
      titulo: 'Consumidor',
      cor: 'bg-purple-600',
      corHover: 'hover:bg-purple-700',
      icon: '🛒',
      descricao: 'Petições para defesa do consumidor',
      peticoes: [
        { id: 'peticao-vicio-produto', nome: 'Vício do Produto', icon: '📱' },
        { id: 'peticao-cobranca-indevida', nome: 'Cobrança Indevida', icon: '💳' }
      ]
    },
    civil: {
      titulo: 'Civil',
      cor: 'bg-orange-600',
      corHover: 'hover:bg-orange-700',
      icon: '📋',
      descricao: 'Petições para direito civil',
      peticoes: [
        { id: 'peticao-cobranca', nome: 'Cobrança', icon: '💰' },
        { id: 'peticao-indenizacao', nome: 'Indenização', icon: '⚖️' }
      ]
    },
    processualCivil: {
      titulo: 'Processual Civil',
      cor: 'bg-indigo-600',
      corHover: 'hover:bg-indigo-700',
      icon: '⚖️',
      descricao: 'Petições processuais especializadas',
      peticoes: [
        { id: 'peticao-execucao', nome: 'Petição Execução', icon: '📊' },
        { id: 'peticao-monitoria', nome: 'Petição Monitória', icon: '📋' }
      ]
    },
    ferramentasIA: {
      titulo: 'Ferramentas IA',
      cor: 'bg-pink-600',
      corHover: 'hover:bg-pink-700',
      icon: '🤖',
      descricao: 'Ferramentas jurídicas inteligentes',
      peticoes: [
        { id: 'consulta-juridica', nome: 'Consulta Jurídica', icon: '💬' },
        { id: 'analise-texto', nome: 'Análise de Texto', icon: '📄' },
        { id: 'parecer-juridico', nome: 'Parecer Jurídico', icon: '📋' }
      ]
    }
  };

  const handleCardClick = (peticaoId) => {
    // Verificar se é calculadora ou dashboard
    if (peticaoId.startsWith('calculadoras/') || peticaoId === 'dashboard') {
      navigate(`/${peticaoId}`);
    } else {
      navigate(`/peticoes/${peticaoId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      
      {/* Header */}
      <header className="bg-[#0056b3] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center">
            <div 
              className="flex items-center space-x-4 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center p-3">
                <img 
                  src="/logoTamarAI2.png" 
                  alt="TamarAI Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">TamarUse</h1>
                <p className="text-blue-200 text-lg">Petições Jurídicas Inteligentes</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-[#0056b3] mb-6">
            Petições Jurídicas com Inteligência Artificial
          </h1>
          <p className="text-xl text-[#0056b3] mb-8 max-w-3xl mx-auto">
            Gere petições profissionais com fundamentação jurídica especializada, 
            jurisprudência atualizada e calculadoras avançadas.
          </p>
        </div>
      </section>

      {/* Cards Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0056b3] mb-4">
              Escolha o Tipo de Petição ou Ferramenta Jurídica
            </h2>
            <p className="text-lg text-[#0056b3]">
              Selecione o card para gerar sua petição inicial, usar calculadoras especializadas 
              ou ferramentas com fundamentação jurídica e jurisprudência atualizada
            </p>
          </div>

          {/* Cards por Área */}
          {Object.entries(areas).map(([key, area]) => (
            <div key={key} className="mb-12">
              
              {/* Título da Área */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-[#0056b3] flex items-center">
                  <span className="mr-3 text-3xl">{area.icon}</span>
                  {area.titulo}
                </h3>
                <p className="text-[#0056b3] mt-2">{area.descricao}</p>
              </div>

              {/* Grid de Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {area.peticoes.map((peticao) => (
                  <div
                    key={peticao.id}
                    onClick={() => handleCardClick(peticao.id)}
                    className={`${area.cor} ${area.corHover} text-white p-6 rounded-lg shadow-lg cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-4">{peticao.icon}</div>
                      <h3 className="text-lg font-semibold mb-2">{peticao.nome}</h3>
                      <p className="text-sm opacity-90">
                        {peticao.desc || 'Clique para acessar'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* Recursos Avançados */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0056b3] mb-4">
              Recursos Avançados
            </h2>
            <p className="text-lg text-[#0056b3]">
              Tecnologia de ponta para petições jurídicas profissionais e calculadoras especializadas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-lg font-semibold text-[#0056b3] mb-2">IA Especializada</h3>
              <p className="text-[#0056b3]">Inteligência artificial treinada em direito brasileiro</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-lg font-semibold text-[#0056b3] mb-2">Jurisprudência</h3>
              <p className="text-[#0056b3]">Base atualizada com decisões dos tribunais superiores</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧮</span>
              </div>
              <h3 className="text-lg font-semibold text-[#0056b3] mb-2">Calculadoras</h3>
              <p className="text-[#0056b3]">Ferramentas especializadas para cálculos jurídicos precisos</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-[#0056b3] mb-2">Rapidez</h3>
              <p className="text-[#0056b3]">Resultados gerados em segundos com qualidade profissional</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0056b3] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-2">
              <img 
                src="/logoTamarAI2.png" 
                alt="TamarAI Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold">TamarUse</h3>
              <div className="flex items-center space-x-2 text-sm text-blue-200">
                <span>Powered by</span>
                <img 
                  src="/logoTamarAI2.png" 
                  alt="TamarAI" 
                  className="w-4 h-4 object-contain"
                />
                <span>TamarAI</span>
              </div>
            </div>
          </div>
          
          <div className="text-center text-blue-200">
            <p>&copy; 2025 TamarUse. Todos os direitos reservados.</p>
            <p className="mt-2">Petições jurídicas inteligentes com tecnologia de ponta.</p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;