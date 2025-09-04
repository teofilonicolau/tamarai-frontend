import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

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
        { id: 'vinculo-empregaticio', nome: 'Vínculo Empregatício', icon: '🤝' },
        { id: 'quesitos-insalubridade', nome: 'Quesitos Insalubridade', icon: '⚠️' }
      ]
    },
    consumidor: {
      titulo: 'Consumidor',
      icon: '🛒',
      peticoes: [
        { id: 'vicio-produto', nome: 'Vício do Produto', icon: '📱' },
        { id: 'cobranca-indevida', nome: 'Cobrança Indevida', icon: '💳' }
      ]
    },
    civil: {
      titulo: 'Civil',
      icon: '📋',
      peticoes: [
        { id: 'cobranca', nome: 'Cobrança', icon: '💰' },
        { id: 'indenizacao', nome: 'Indenização', icon: '⚖️' }
      ]
    },
    processualCivil: {
      titulo: 'Processual Civil',
      icon: '⚖️',
      peticoes: [
        { id: 'peticao-execucao', nome: 'Petição Execução', icon: '⚖️' },
        { id: 'peticao-monitoria', nome: 'Petição Monitória', icon: '📊' }
      ]
    },
    ferramentasIA: {
      titulo: 'Ferramentas IA',
      icon: '🤖',
      peticoes: [
        { id: 'consulta-juridica', nome: 'Consulta Jurídica', icon: '🤖' },
        { id: 'analise-texto', nome: 'Análise de Texto', icon: '📄' },
        { id: 'parecer-juridico', nome: 'Parecer Jurídico', icon: '📋' }
      ]
    }
  };

  return (
    <div className={`bg-primary-blue text-white transition-all duration-300 ${
      expanded ? 'w-80' : 'w-16'
    } flex flex-col`}>
      
      {/* Header da Sidebar */}
      <div className="p-4 border-b border-blue-600">
        <div className="flex items-center justify-between">
          {expanded && (
            <div className="flex items-center space-x-3">
              <img 
                src="/logo-tamarai-white.png" 
                alt="TamarAI" 
                className="w-10 h-10"
              />
              <div>
                <h1 className="text-xl font-bold">TamarUse</h1>
                <p className="text-blue-200 text-sm">Petições Inteligentes</p>
              </div>
            </div>
          )}
          
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            {expanded ? (
              <ChevronLeftIcon className="w-5 h-5" />
            ) : (
              <ChevronRightIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Menu de Áreas e Petições */}
      <div className="flex-1 overflow-y-auto">
        {Object.keys(areas).map((areaKey) => (
          <div key={areaKey} className="mb-4">
            {expanded && (
              <div className="px-4 pt-4">
                <h2 className="text-sm font-semibold text-blue-200 uppercase tracking-wide mb-3">
                  <span className="mr-2">{areas[areaKey].icon}</span>
                  {areas[areaKey].titulo}
                </h2>
              </div>
            )}
            <nav className="space-y-1 px-2">
              {areas[areaKey].peticoes.map((peticao) => (
                <button
                  key={peticao.id}
                  className="w-full flex items-center px-3 py-3 text-left rounded-lg hover:bg-blue-600 transition-colors group"
                  onClick={() => window.location.href = `/peticoes/${peticao.id}`}
                >
                  <span className="text-xl mr-3">{peticao.icon}</span>
                  {expanded && (
                    <span className="text-sm font-medium group-hover:text-white">
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
        <div className="p-4 border-t border-blue-600">
          <div className="text-xs text-blue-200">
            <p>© 2025 TamarUse</p>
            <p>Powered by TamarAI</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;