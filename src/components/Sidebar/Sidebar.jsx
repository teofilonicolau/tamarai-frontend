import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ expanded, onToggle, darkMode, onToggleTheme }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 🎯 CONFIGURAÇÃO DAS ÁREAS - SEM DUPLICAÇÃO
  const areas = {
    calculadoras: {
      titulo: 'Calculadoras',
      icon: '🧮',
      cor: '#8B5CF6',
      peticoes: [
        { id: 'calculadoras', nome: 'Hub Principal', icon: '🏠', path: '/calculadoras' },
        { id: 'calculadoras/previdenciario', nome: 'Previdenciário', icon: '⚖️', path: '/calculadoras/previdenciario' },
        { id: 'calculadoras/trabalhista', nome: 'Trabalhista', icon: '👷', path: '/calculadoras/trabalhista' },
        { id: 'calculadoras/processual', nome: 'Processual', icon: '📋', path: '/calculadoras/processual' },
        { id: 'calculadoras/financeiro', nome: 'Financeiro', icon: '💰', path: '/calculadoras/financeiro' },
        { id: 'dashboard', nome: 'Dashboard', icon: '📊', path: '/dashboard' }
      ]
    },
    previdenciario: {
      titulo: 'Previdenciário',
      icon: '🏛️',
      cor: '#3B82F6',
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
      icon: '⚖️',
      cor: '#10B981',
      peticoes: [
        { id: 'peticao-vinculo', nome: 'Vínculo Empregatício', icon: '🤝' },
        { id: 'quesitos-insalubridade', nome: 'Quesitos Insalubridade', icon: '⚠️' }
      ]
    },
    consumidor: {
      titulo: 'Consumidor',
      icon: '🛒',
      cor: '#8B5CF6',
      peticoes: [
        { id: 'peticao-vicio-produto', nome: 'Vício do Produto', icon: '📱' },
        { id: 'peticao-cobranca-indevida', nome: 'Cobrança Indevida', icon: '💳' }
      ]
    },
    civil: {
      titulo: 'Civil',
      icon: '📋',
      cor: '#F59E0B',
      peticoes: [
        { id: 'peticao-cobranca', nome: 'Cobrança', icon: '💰' },
        { id: 'peticao-indenizacao', nome: 'Indenização', icon: '⚖️' }
      ]
    },
    processualCivil: {
      titulo: 'Processual Civil',
      icon: '⚖️',
      cor: '#6366F1',
      peticoes: [
        { id: 'peticao-execucao', nome: 'Petição Execução', icon: '📊' },
        { id: 'peticao-monitoria', nome: 'Petição Monitória', icon: '📋' }
      ]
    },
    ferramentasIA: {
      titulo: 'Ferramentas IA',
      icon: '🤖',
      cor: '#EC4899',
      peticoes: [
        { id: 'consulta-juridica', nome: 'Consulta Jurídica', icon: '💬' },
        { id: 'analise-texto', nome: 'Análise de Texto', icon: '📄' },
        { id: 'parecer-juridico', nome: 'Parecer Jurídico', icon: '📋' }
      ]
    }
  };

  // 🎯 NAVEGAÇÃO INTELIGENTE
  const handleNavigation = (peticao) => {
    if (peticao.path) {
      navigate(peticao.path);
    } else if (peticao.id.startsWith('calculadoras') || peticao.id === 'dashboard') {
      navigate(`/${peticao.id}`);
    } else {
      navigate(`/peticoes/${peticao.id}`);
    }
  };

  // 🎯 VERIFICAR SE ESTÁ ATIVO
  const isActive = (peticao) => {
    if (peticao.path) {
      return location.pathname === peticao.path;
    }
    if (peticao.id.startsWith('calculadoras') || peticao.id === 'dashboard') {
      return location.pathname === `/${peticao.id}`;
    }
    return location.pathname === `/peticoes/${peticao.id}`;
  };

  return (
    <div 
      className={`sidebar-container transition-all duration-300 flex flex-col z-50 ${
        expanded ? 'w-80' : 'w-16'
      }`}
      style={{
        boxShadow: '2px 0 8px var(--shadow)'
      }}
    >
      
      {/* 🏗️ HEADER DA SIDEBAR */}
      <div 
        className="p-4 border-b transition-theme"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex items-center justify-between">
          
          {/* 🎨 LOGO E TÍTULO */}
          {expanded && (
            <div className="flex items-center space-x-3 animate-slideInRight">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center p-1"
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
                  className="text-xl font-bold transition-theme"
                  style={{ color: 'var(--sidebar-text)' }}
                >
                  TamarUSE
                </h1>
                <p 
                  className="text-sm transition-theme"
                  style={{ color: 'var(--sidebar-text)', opacity: 0.8 }}
                >
                  Petições Jurídicas com IA
                </p>
              </div>
            </div>
          )}
          
          {/* 🔄 BOTÃO TOGGLE */}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg transition-all hover:scale-105"
            style={{ 
              background: 'var(--sidebar-hover)',
              color: 'var(--sidebar-text)'
            }}
          >
            {expanded ? (
              <ChevronLeftIcon className="w-5 h-5" />
            ) : (
              <ChevronRightIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* 🌙 TOGGLE DARK MODE */}
      <div 
        className="px-2 py-4 border-b transition-theme"
        style={{ borderColor: 'var(--border)' }}
      >
        <button
          onClick={onToggleTheme}
          className="sidebar-item w-full"
        >
          {darkMode ? (
            <SunIcon className="sidebar-icon" />
          ) : (
            <MoonIcon className="sidebar-icon" />
          )}
          {expanded && (
            <span className="text-sm font-medium">
              {darkMode ? '☀️ Modo Claro' : '�� Modo Escuro'}
            </span>
          )}
        </button>
      </div>

      {/* 🏠 LINK PARA HOME - ÚNICO */}
      <div 
        className="px-2 py-4 border-b transition-theme"
        style={{ borderColor: 'var(--border)' }}
      >
        <button
          onClick={() => navigate('/')}
          className={`sidebar-item w-full ${location.pathname === '/' ? 'active' : ''}`}
        >
          <span className="sidebar-icon text-lg">🏠</span>
          {expanded && (
            <span className="text-sm font-medium">
              Voltar ao Início
            </span>
          )}
        </button>
      </div>

      {/* 📋 MENU DE ÁREAS */}
      <div className="flex-1 overflow-y-auto">
        {Object.entries(areas).map(([key, area]) => (
          <div key={key} className="mb-2">
            
            {/* 🏷️ TÍTULO DA ÁREA */}
            {expanded && (
              <div 
                className="px-4 py-3 border-b transition-theme"
                style={{ borderColor: 'var(--border)' }}
              >
                <h2 
                  className="text-sm font-semibold uppercase tracking-wide flex items-center transition-theme"
                  style={{ color: 'var(--sidebar-text)', opacity: 0.7 }}
                >
                  <span className="mr-2">{area.icon}</span>
                  {area.titulo}
                </h2>
              </div>
            )}
            
            {/* 📋 PETIÇÕES DA ÁREA */}
            <nav className="space-y-1 px-2 py-2">
              {area.peticoes.map((peticao) => {
                const ativo = isActive(peticao);
                
                return (
                  <button
                    key={peticao.id}
                    className={`sidebar-item w-full ${ativo ? 'active' : ''}`}
                    onClick={() => handleNavigation(peticao)}
                  >
                    <span className="sidebar-icon text-lg">{peticao.icon}</span>
                    {expanded && (
                      <span className="text-sm font-medium">
                        {peticao.nome}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* 📄 FOOTER DA SIDEBAR */}
      {expanded && (
        <div 
          className="p-4 border-t transition-theme"
          style={{ borderColor: 'var(--border)' }}
        >
          <div 
            className="text-xs flex items-center space-x-2 transition-theme"
            style={{ color: 'var(--sidebar-text)', opacity: 0.7 }}
          >
            <div>
              <p>© 2025 TamarUSE</p>
              <div className="flex items-center space-x-1">
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
        </div>
      )}
    </div>
  );
};

export default Sidebar;