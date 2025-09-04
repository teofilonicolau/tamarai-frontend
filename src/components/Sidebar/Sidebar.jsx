import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

const Sidebar = ({ expanded, onToggle }) => {
  const areas = {
    previdenciario: {
      titulo: 'Previdenciário',
      icon: '🏛️',
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
      peticoes: [
        { id: 'peticao-vinculo', nome: 'Vínculo Empregatício', icon: '🤝' },
        { id: 'quesitos-insalubridade', nome: 'Quesitos Insalubridade', icon: '⚠️' }
      ]
    },
    consumidor: {
      titulo: 'Consumidor',
      icon: '🛒',
      peticoes: [
        { id: 'peticao-vicio-produto', nome: 'Vício do Produto', icon: '📱' },
        { id: 'peticao-cobranca-indevida', nome: 'Cobrança Indevida', icon: '💳' }
      ]
    },
    civil: {
      titulo: 'Civil',
      icon: '📋',
      peticoes: [
        { id: 'peticao-cobranca', nome: 'Cobrança', icon: '💰' },
        { id: 'peticao-indenizacao', nome: 'Indenização', icon: '⚖️' }
      ]
    },
    processualCivil: {
      titulo: 'Processual Civil',
      icon: '⚖️',
      peticoes: [
        { id: 'peticao-execucao', nome: 'Petição Execução', icon: '📊' },
        { id: 'peticao-monitoria', nome: 'Petição Monitória', icon: '📋' }
      ]
    },
    ferramentasIA: {
      titulo: 'Ferramentas IA',
      icon: '🤖',
      peticoes: [
        { id: 'consulta-juridica', nome: 'Consulta Jurídica', icon: '💬' },
        { id: 'analise-texto', nome: 'Análise de Texto', icon: '📄' },
        { id: 'parecer-juridico', nome: 'Parecer Jurídico', icon: '📋' }
      ]
    }
  };

  return (
    <div className={`bg-blue-600 text-white transition-all duration-300 ${
      expanded ? 'w-80' : 'w-16'
    } flex flex-col`}>
      
      {/* Header da Sidebar */}
      <div className="p-4 border-b border-blue-500">
        <div className="flex items-center justify-between">
          {expanded && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1">
                <img 
                  src="/logoTamarAI2.png" 
                  alt="TamarAI Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">TamarUse</h1>
                <p className="text-blue-200 text-sm">Petições Inteligentes</p>
              </div>
            </div>
          )}
          
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-blue-500 transition-colors"
          >
            {expanded ? (
              <ChevronLeftIcon className="w-5 h-5 text-white" />
            ) : (
              <ChevronRightIcon className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Link para Home */}
      <div className="px-2 py-4 border-b border-blue-500/30">
        <button
          onClick={() => window.location.href = '/'}
          className="w-full flex items-center px-3 py-3 text-left rounded-lg hover:bg-blue-500 transition-colors group"
        >
          <HomeIcon className="w-5 h-5 mr-3 text-white" />
          {expanded && (
            <span className="text-sm font-medium text-white group-hover:text-blue-100">
              🏠 Voltar ao Início
            </span>
          )}
        </button>
      </div>

      {/* Menu de Áreas */}
      <div className="flex-1 overflow-y-auto">
        {Object.entries(areas).map(([key, area]) => (
          <div key={key} className="mb-2">
            
            {/* Título da Área */}
            {expanded && (
              <div className="px-4 py-3 border-b border-blue-500/30">
                <h2 className="text-sm font-semibold text-blue-200 uppercase tracking-wide flex items-center">
                  <span className="mr-2">{area.icon}</span>
                  {area.titulo}
                </h2>
              </div>
            )}
            
            {/* Petições da Área */}
            <nav className="space-y-1 px-2 py-2">
              {area.peticoes.map((peticao) => (
                <button
                  key={peticao.id}
                  className="w-full flex items-center px-3 py-3 text-left rounded-lg hover:bg-blue-500 transition-colors group"
                  onClick={() => window.location.href = `/peticoes/${peticao.id}`}
                >
                  <span className="text-lg mr-3">{peticao.icon}</span>
                  {expanded && (
                    <span className="text-sm font-medium text-white group-hover:text-blue-100">
                      {peticao.nome}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        ))}
      </div>

      {/* Footer da Sidebar */}
      {expanded && (
        <div className="p-4 border-t border-blue-500">
          <div className="text-xs text-blue-200 flex items-center space-x-2">
            <div>
              <p>© 2025 TamarUse</p>
              <div className="flex items-center space-x-1">
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
        </div>
      )}
    </div>
  );
};

export default Sidebar;