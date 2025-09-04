import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Header = () => {
  const { tipoPeticao } = useParams();
  const navigate = useNavigate();

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
      'revisao-beneficio': 'Revisão de Benefício'
    };
    return titulos[tipo] || 'Petição Previdenciária';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Breadcrumb e Título */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Voltar ao Início</span>
            </button>
            
            <div className="text-gray-300">|</div>
            
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {getTituloPeticao(tipoPeticao)}
              </h1>
              <p className="text-sm text-gray-500">
                Preencha os dados para gerar sua petição
              </p>
            </div>
          </div>

          {/* Ações do Header */}
          <div className="flex items-center space-x-4">
            
            {/* Status */}
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Sistema Online</span>
            </div>

            {/* Botão de Ajuda */}
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;