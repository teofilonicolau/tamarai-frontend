import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const Home = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  // 🎯 INICIALIZAR TEMA
  useEffect(() => {
    const savedTheme = localStorage.getItem('tamaruse-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    setDarkMode(isDark);
    updateTheme(isDark);
  }, []);

  // 🎨 ATUALIZAR TEMA
  const updateTheme = (isDark) => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('tamaruse-theme', isDark ? 'dark' : 'light');
  };

  // 🔄 TOGGLE DO TEMA
  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    updateTheme(newDarkMode);
  };

  // 🎯 TODAS AS ÁREAS ORGANIZADAS
  const areas = {
    calculadoras: {
      titulo: 'Calculadoras Jurídicas',
      cor: 'from-purple-600 to-indigo-600',
      corHover: 'hover:from-purple-700 hover:to-indigo-700',
      icon: '🧮',
      descricao: 'Calculadoras especializadas por área jurídica com precisão profissional',
      peticoes: [
        { id: 'calculadoras/previdenciario', nome: 'Previdenciário', icon: '⚖️', desc: 'EC 103/2019, Tempo Especial, Pedágios' },
        { id: 'calculadoras/trabalhista', nome: 'Trabalhista', icon: '👷', desc: 'Horas Extras, Rescisão, Adicionais' },
        { id: 'calculadoras/processual', nome: 'Processual', icon: '📋', desc: 'Valor da Causa, Liquidação, Custas' },
        { id: 'calculadoras/financeiro', nome: 'Financeiro', icon: '💰', desc: 'Juros, Correção Monetária, Indexadores' },
        { id: 'dashboard', nome: 'Dashboard', icon: '📊', desc: 'Métricas, Analytics e Relatórios' }
      ]
    },
    previdenciario: {
      titulo: 'Direito Previdenciário',
      cor: 'from-blue-600 to-cyan-600',
      corHover: 'hover:from-blue-700 hover:to-cyan-700',
      icon: '🏛️',
      descricao: 'Petições especializadas para benefícios do INSS com fundamentação jurídica',
      peticoes: [
        { id: 'aposentadoria-invalidez', nome: 'Aposentadoria por Invalidez', icon: '🏥', desc: 'Incapacidade total e permanente' },
        { id: 'aposentadoria-tempo-contribuicao', nome: 'Aposentadoria por Tempo', icon: '⏰', desc: 'Tempo de contribuição integral' },
        { id: 'aposentadoria-especial', nome: 'Aposentadoria Especial', icon: '⚠️', desc: 'Atividades insalubres e perigosas' },
        { id: 'aposentadoria-rural', nome: 'Aposentadoria Rural', icon: '🌾', desc: 'Trabalhador rural e híbrido' },
        { id: 'pensao-morte', nome: 'Pensão por Morte', icon: '💔', desc: 'Dependentes do segurado' },
        { id: 'bpc-loas', nome: 'BPC/LOAS', icon: '🤝', desc: 'Benefício assistencial' },
        { id: 'salario-maternidade', nome: 'Salário Maternidade', icon: '👶', desc: 'Proteção à maternidade' },
        { id: 'auxilio-doenca', nome: 'Auxílio Doença', icon: '🏥', desc: 'Incapacidade temporária' },
        { id: 'revisao-vida-toda', nome: 'Revisão da Vida Toda', icon: '📊', desc: 'Revisão de benefício' },
        { id: 'revisao-beneficio', nome: 'Revisão de Benefício', icon: '🔄', desc: 'Correção de valores' }
      ]
    },
    trabalhista: {
      titulo: 'Direito Trabalhista',
      cor: 'from-green-600 to-emerald-600',
      corHover: 'hover:from-green-700 hover:to-emerald-700',
      icon: '⚖️',
      descricao: 'Petições para direitos trabalhistas e relações de emprego',
      peticoes: [
        { id: 'peticao-vinculo', nome: 'Vínculo Empregatício', icon: '🤝', desc: 'Reconhecimento de vínculo' },
        { id: 'quesitos-insalubridade', nome: 'Quesitos Insalubridade', icon: '⚠️', desc: 'Perícia de insalubridade' }
      ]
    },
    consumidor: {
      titulo: 'Direito do Consumidor',
      cor: 'from-purple-600 to-pink-600',
      corHover: 'hover:from-purple-700 hover:to-pink-700',
      icon: '🛒',
      descricao: 'Petições para defesa dos direitos do consumidor',
      peticoes: [
        { id: 'peticao-vicio-produto', nome: 'Vício do Produto', icon: '📱', desc: 'Defeitos e vícios' },
        { id: 'peticao-cobranca-indevida', nome: 'Cobrança Indevida', icon: '💳', desc: 'Cobranças abusivas' }
      ]
    },
    civil: {
      titulo: 'Direito Civil',
      cor: 'from-orange-600 to-red-600',
      corHover: 'hover:from-orange-700 hover:to-red-700',
      icon: '📋',
      descricao: 'Petições para direito civil e obrigações',
      peticoes: [
        { id: 'peticao-cobranca', nome: 'Cobrança', icon: '💰', desc: 'Cobrança de dívidas' },
        { id: 'peticao-indenizacao', nome: 'Indenização', icon: '⚖️', desc: 'Danos morais e materiais' }
      ]
    },
    processualCivil: {
      titulo: 'Processual Civil',
      cor: 'from-indigo-600 to-blue-600',
      corHover: 'hover:from-indigo-700 hover:to-blue-700',
      icon: '⚖️',
      descricao: 'Petições processuais especializadas e execuções',
      peticoes: [
        { id: 'peticao-execucao', nome: 'Petição Execução', icon: '📊', desc: 'Execução de títulos' },
        { id: 'peticao-monitoria', nome: 'Petição Monitória', icon: '📋', desc: 'Ação monitória' }
      ]
    },
    ferramentasIA: {
      titulo: 'Ferramentas com IA',
      cor: 'from-pink-600 to-rose-600',
      corHover: 'hover:from-pink-700 hover:to-rose-700',
      icon: '🤖',
      descricao: 'Ferramentas jurídicas inteligentes com IA avançada',
      peticoes: [
        { id: 'consulta-juridica', nome: 'Consulta Jurídica', icon: '💬', desc: 'Consultas especializadas' },
        { id: 'analise-texto', nome: 'Análise de Texto', icon: '📄', desc: 'Análise de documentos' },
        { id: 'parecer-juridico', nome: 'Parecer Jurídico', icon: '📋', desc: 'Pareceres fundamentados' }
      ]
    }
  };

  // 🎯 NAVEGAÇÃO INTELIGENTE
  const handleCardClick = (peticaoId) => {
    if (peticaoId.startsWith('calculadoras/') || peticaoId === 'dashboard') {
      navigate(`/${peticaoId}`);
    } else {
      navigate(`/peticoes/${peticaoId}`);
    }
  };

  return (
    <div 
      className="min-h-screen transition-theme"
      style={{ background: 'var(--bg-primary)' }}
    >
      
      {/* 🏗️ HEADER PRINCIPAL */}
      <header 
        className={`shadow-lg transition-theme ${darkMode ? 'header-dark' : ''}`}
        style={{ background: darkMode ? 'var(--header-bg)' : 'var(--accent)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            
            {/* 🎨 LOGO E TÍTULO */}
            <div 
              className="flex items-center space-x-4 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <div 
                className="w-16 h-16 rounded-lg flex items-center justify-center p-3"
                style={{ background: 'var(--bg-secondary)' }}
              >
                <img 
                  src={darkMode ? "/logoTamarModoBlack.png" : "/logoTamarAI2.png"}
                  alt="TamarUSE Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 
                  className="text-3xl font-bold"
                  style={{ color: 'var(--text-header-footer)' }}
                >
                  TamarUSE
                </h1>
                <p 
                  className="text-lg"
                  style={{ color: 'var(--text-header-footer)', opacity: 0.8 }}
                >
                  Petições Jurídicas Inteligentes
                </p>
              </div>
            </div>

            {/* 🌙 TOGGLE TEMA */}
            <button
              onClick={toggleTheme}
              className="p-3 rounded-lg transition-all hover:scale-105"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'var(--text-header-footer)'
              }}
              title={darkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
            >
              {darkMode ? (
                <SunIcon className="w-6 h-6" />
              ) : (
                <MoonIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 🎯 HERO SECTION */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 
            className="text-5xl font-bold mb-6 transition-theme"
            style={{ color: 'var(--text-primary)' }}
          >
            Petições Jurídicas com Inteligência Artificial
          </h1>
          <p 
            className="text-xl mb-8 max-w-4xl mx-auto transition-theme"
            style={{ color: 'var(--text-secondary)' }}
          >
            Gere petições profissionais com fundamentação jurídica especializada, 
            jurisprudência atualizada do STF e STJ, calculadoras avançadas e 
            tecnologia de ponta para máxima eficiência jurídica.
          </p>
        </div>
      </section>

      {/* 📋 CARDS SECTION */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* 📍 TÍTULO PRINCIPAL */}
          <div className="text-center mb-12">
            <h2 
              className="text-3xl font-bold mb-4 transition-theme"
              style={{ color: 'var(--text-primary)' }}
            >
              Escolha o Tipo de Petição ou Ferramenta Jurídica
            </h2>
            <p 
              className="text-lg transition-theme"
              style={{ color: 'var(--text-secondary)' }}
            >
              Selecione o card para gerar sua petição inicial, usar calculadoras especializadas 
              ou ferramentas com fundamentação jurídica e jurisprudência atualizada
            </p>
          </div>

          {/* 🎨 CARDS POR ÁREA */}
          {Object.entries(areas).map(([key, area]) => (
            <div key={key} className="mb-12">
              
              {/* 🏷️ TÍTULO DA ÁREA */}
              <div className="mb-6">
                <h3 
                  className="text-2xl font-bold flex items-center transition-theme"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <span 
                    className="mr-3 text-3xl"
                    style={{ color: 'var(--icon-color)' }}
                  >
                    {area.icon}
                  </span>
                  {area.titulo}
                </h3>
                <p 
                  className="mt-2 transition-theme"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {area.descricao}
                </p>
              </div>

              {/* 📋 GRID DE CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {area.peticoes.map((peticao) => (
                  <div
                    key={peticao.id}
                    onClick={() => handleCardClick(peticao.id)}
                    className="theme-card cursor-pointer transform transition-all duration-200 hover:scale-105 p-6"
                  >
                    <div className="text-center">
                      <div 
                        className="card-icon"
                        style={{ color: 'var(--icon-color)' }}
                      >
                        {peticao.icon}
                      </div>
                      <h3 
                        className="card-title text-lg font-semibold mb-2"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {peticao.nome}
                      </h3>
                      <p 
                        className="card-description text-sm"
                        style={{ color: 'var(--text-secondary)' }}
                      >
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

      {/* 💡 RECURSOS AVANÇADOS - ÍCONES CORRIGIDOS */}
      <section 
        className="py-16 transition-theme"
        style={{ background: 'var(--bg-secondary)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 
              className="text-3xl font-bold mb-4 transition-theme"
              style={{ color: 'var(--text-primary)' }}
            >
              Recursos Avançados
            </h2>
            <p 
              className="text-lg transition-theme"
              style={{ color: 'var(--text-secondary)' }}
            >
              Tecnologia de ponta para petições jurídicas profissionais e calculadoras especializadas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* 🤖 IA ESPECIALIZADA */}
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'var(--bg-tertiary)' }}
              >
                <span 
                  className="text-2xl"
                  style={{ color: 'var(--icon-color)' }}
                >
                  🤖
                </span>
              </div>
              <h3 
                className="text-lg font-semibold mb-2 transition-theme"
                style={{ color: 'var(--text-primary)' }}
              >
                IA Especializada
              </h3>
              <p 
                className="transition-theme"
                style={{ color: 'var(--text-secondary)' }}
              >
                Inteligência artificial treinada em direito brasileiro
              </p>
            </div>

            {/* 📚 JURISPRUDÊNCIA - ÍCONE CORRIGIDO */}
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'var(--success-bg)' }}
              >
                <span 
                  className="text-2xl"
                  style={{ color: 'var(--icon-color)' }}
                >
                  📚
                </span>
              </div>
              <h3 
                className="text-lg font-semibold mb-2 transition-theme"
                style={{ color: 'var(--text-primary)' }}
              >
                Jurisprudência
              </h3>
              <p 
                className="transition-theme"
                style={{ color: 'var(--text-secondary)' }}
              >
                Base atualizada com decisões dos tribunais superiores
              </p>
            </div>

            {/* 🧮 CALCULADORAS - ÍCONE CORRIGIDO */}
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'var(--warning-bg)' }}
              >
                <span 
                  className="text-2xl"
                  style={{ color: 'var(--icon-color)' }}
                >
                  🧮
                </span>
              </div>
              <h3 
                className="text-lg font-semibold mb-2 transition-theme"
                style={{ color: 'var(--text-primary)' }}
              >
                Calculadoras
              </h3>
              <p 
                className="transition-theme"
                style={{ color: 'var(--text-secondary)' }}
              >
                Ferramentas especializadas para cálculos jurídicos precisos
              </p>
            </div>

            {/* ⚡ RAPIDEZ */}
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'var(--error-bg)' }}
              >
                <span 
                  className="text-2xl"
                  style={{ color: 'var(--icon-color)' }}
                >
                  ⚡
                </span>
              </div>
              <h3 
                className="text-lg font-semibold mb-2 transition-theme"
                style={{ color: 'var(--text-primary)' }}
              >
                Rapidez
              </h3>
              <p 
                className="transition-theme"
                style={{ color: 'var(--text-secondary)' }}
              >
                Resultados gerados em segundos com qualidade profissional
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 📄 FOOTER */}
      <footer 
        className={`py-12 transition-theme ${darkMode ? 'footer-dark' : ''}`}
        style={{ background: darkMode ? 'var(--footer-bg)' : 'var(--accent)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center p-2"
              style={{ background: 'var(--bg-secondary)' }}
            >
              <img 
                src={darkMode ? "/logoTamarModoBlack.png" : "/logoTamarAI2.png"}
                alt="TamarUSE Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 
                className="text-xl font-bold"
                style={{ color: 'var(--text-header-footer)' }}
              >
                TamarUSE
              </h3>
              <div 
                className="flex items-center space-x-2 text-sm"
                style={{ color: 'var(--text-header-footer)', opacity: 0.8 }}
              >
                <span>Powered by</span>
                <img 
                  src={darkMode ? "/logoTamarModoBlack.png" : "/logoTamarAI2.png"}
                  alt="TamarAI" 
                  className="w-4 h-4 object-contain"
                />
                <span>TamarAI</span>
              </div>
            </div>
          </div>
          
          <div 
            className="text-center"
            style={{ color: 'var(--text-header-footer)', opacity: 0.8 }}
          >
            <p>&copy; 2025 TamarUSE. Todos os direitos reservados.</p>
            <p className="mt-2">Petições jurídicas inteligentes com tecnologia de ponta.</p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;