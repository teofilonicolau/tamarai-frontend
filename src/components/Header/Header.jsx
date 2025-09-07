import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  SunIcon,
  MoonIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

const Header = ({ darkMode, onToggleTheme }) => {
  const { tipoPeticao } = useParams();
  const navigate = useNavigate();

  // 🎯 TÍTULOS DINÂMICOS
  const getTituloPeticao = (tipo) => {
    const titulos = {
      'aposentadoria-invalidez': 'Aposentadoria por Invalidez',
      'aposentadoria-tempo-contribuicao': 'Aposentadoria por Tempo de Contribuição',
      'aposentadoria-especial': 'Aposentadoria Especial',
      'aposentadoria-rural': 'Aposentadoria Rural/Híbrida',
      'pensao-morte': 'Pensão por Morte',
      'bpc-loas': 'BPC/LOAS',
      'salario-maternidade': 'Salário Maternidade',
      'auxilio-doenca': 'Auxílio Doença',
      'revisao-vida-toda': 'Revisão da Vida Toda',
      'revisao-beneficio': 'Revisão de Benefício',
      'peticao-execucao': 'Petição de Execução',
      'peticao-monitoria': 'Petição Monitória',
      'consulta-juridica': 'Consulta Jurídica com IA',
      'analise-texto': 'Análise de Texto com IA',
      'parecer-juridico': 'Parecer Jurídico com IA'
    };
    return titulos[tipo] || 'Petições Jurídicas com IA';
  };

  return (
    <header 
      className="shadow-sm border-b transition-theme"
      style={{
        background: 'var(--bg-secondary)',
        borderColor: 'var(--border)'
      }}
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* 🎯 BREADCRUMB E TÍTULO */}
          <div className="flex items-center space-x-4">
            
            {/* 🔙 BOTÃO VOLTAR */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all hover:scale-105"
              style={{
                color: 'var(--accent)',
                background: 'var(--bg-tertiary)'
              }}
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Voltar ao Início</span>
            </button>
            
            {/* 📍 SEPARADOR */}
            <div 
              className="text-gray-300"
              style={{ color: 'var(--text-muted)' }}
            >
              |
            </div>
            
            {/* 📋 INFORMAÇÕES DA PÁGINA */}
            <div>
              <h1 
                className="text-xl font-semibold transition-theme"
                style={{ color: 'var(--text-primary)' }}
              >
                {getTituloPeticao(tipoPeticao)}
              </h1>
              <p 
                className="text-sm transition-theme"
                style={{ color: 'var(--text-secondary)' }}
              >
                Preencha os dados para gerar sua petição profissional
              </p>
            </div>
          </div>

          {/* 🎛️ AÇÕES DO HEADER */}
          <div className="flex items-center space-x-4">
            
            {/* 🟢 STATUS SISTEMA */}
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span style={{ color: 'var(--text-secondary)' }}>
                Sistema Online
              </span>
            </div>

            {/* 🌙 TOGGLE TEMA */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg transition-all hover:scale-105"
              style={{
                background: 'var(--bg-tertiary)',
                color: 'var(--text-primary)'
              }}
              title={darkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
            >
              {darkMode ? (
                <SunIcon className="w-5 h-5" />
              ) : (
                <MoonIcon className="w-5 h-5" />
              )}
            </button>

            {/* ❓ BOTÃO AJUDA */}
            <button 
              className="p-2 rounded-lg transition-all hover:scale-105"
              style={{
                background: 'var(--bg-tertiary)',
                color: 'var(--text-secondary)'
              }}
              title="Central de Ajuda"
            >
              <QuestionMarkCircleIcon className="w-5 h-5" />
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;