import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const beneficios = [
    {
      id: 'aposentadoria-invalidez',
      titulo: 'Aposentadoria por Invalidez',
      descricao: 'Para segurados com incapacidade total e permanente para o trabalho',
      icon: '🏥',
      cor: 'from-red-500 to-red-600',
      hover: 'hover:from-red-600 hover:to-red-700'
    },
    {
      id: 'aposentadoria-tempo-contribuicao',
      titulo: 'Aposentadoria por Tempo',
      descricao: 'Para quem completou o tempo mínimo de contribuição exigido',
      icon: '⏰',
      cor: 'from-blue-500 to-blue-600',
      hover: 'hover:from-blue-600 hover:to-blue-700'
    },
    {
      id: 'aposentadoria-especial',
      titulo: 'Aposentadoria Especial',
      descricao: 'Para atividades com exposição a agentes nocivos à saúde',
      icon: '⚠️',
      cor: 'from-orange-500 to-orange-600',
      hover: 'hover:from-orange-600 hover:to-orange-700'
    },
    {
      id: 'aposentadoria-rural',
      titulo: 'Aposentadoria Rural',
      descricao: 'Para trabalhadores rurais e aposentadoria híbrida',
      icon: '🌾',
      cor: 'from-green-500 to-green-600',
      hover: 'hover:from-green-600 hover:to-green-700'
    },
    {
      id: 'pensao-morte',
      titulo: 'Pensão por Morte',
      descricao: 'Para dependentes de segurado falecido',
      icon: '💔',
      cor: 'from-gray-500 to-gray-600',
      hover: 'hover:from-gray-600 hover:to-gray-700'
    },
    {
      id: 'bpc-loas',
      titulo: 'BPC/LOAS',
      descricao: 'Benefício assistencial para idosos e pessoas com deficiência',
      icon: '🤝',
      cor: 'from-purple-500 to-purple-600',
      hover: 'hover:from-purple-600 hover:to-purple-700'
    },
    {
      id: 'salario-maternidade',
      titulo: 'Salário Maternidade',
      descricao: 'Para gestantes, adotantes e casos de guarda judicial',
      icon: '��',
      cor: 'from-pink-500 to-pink-600',
      hover: 'hover:from-pink-600 hover:to-pink-700'
    },
    {
      id: 'auxilio-doenca',
      titulo: 'Auxílio Doença',
      descricao: 'Para incapacidade temporária para o trabalho',
      icon: '🏥',
      cor: 'from-yellow-500 to-yellow-600',
      hover: 'hover:from-yellow-600 hover:to-yellow-700'
    },
    {
      id: 'revisao-vida-toda',
      titulo: 'Revisão da Vida Toda',
      descricao: 'Revisão incluindo salários anteriores a julho de 1994',
      icon: '📊',
      cor: 'from-indigo-500 to-indigo-600',
      hover: 'hover:from-indigo-600 hover:to-indigo-700'
    },
    {
      id: 'revisao-beneficio',
      titulo: 'Revisão de Benefício',
      descricao: 'Correção de cálculos incorretos do INSS',
      icon: '🔄',
      cor: 'from-teal-500 to-teal-600',
      hover: 'hover:from-teal-600 hover:to-teal-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      
      {/* Hero Section Redesenhada */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-32">
          <div className="text-center">
            
            {/* Logo e Título */}
            <div className="flex justify-center items-center mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mr-6">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                  <span className="text-3xl font-bold text-blue-600">T</span>
                </div>
              </div>
              <div className="text-left">
                <h1 className="text-5xl lg:text-6xl font-bold text-white mb-2">
                  Tamar<span className="text-blue-300">Use</span>
                </h1>
                <p className="text-blue-200 text-lg font-medium">
                  Powered by TamarAI
                </p>
              </div>
            </div>

            {/* Subtítulo */}
            <p className="text-xl lg:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Plataforma inteligente para geração de 
              <span className="text-white font-semibold"> petições previdenciárias </span>
              com Inteligência Artificial especializada
            </p>

            {/* Stats Cards */}
            <div className="flex justify-center space-x-6 mb-16">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center min-w-[120px]">
                <div className="text-3xl font-bold text-white mb-1">10</div>
                <div className="text-sm text-blue-200 font-medium">Tipos de Petições</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center min-w-[120px]">
                <div className="text-3xl font-bold text-white mb-1">PDF</div>
                <div className="text-sm text-blue-200 font-medium">Download Direto</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center min-w-[120px]">
                <div className="text-3xl font-bold text-white mb-1">IA</div>
                <div className="text-sm text-blue-200 font-medium">Jurisprudência</div>
              </div>
            </div>

            {/* CTA Button */}
            <button 
              onClick={() => document.getElementById('peticoes').scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transform hover:scale-105 transition-all duration-200 shadow-xl"
            >
              Começar Agora →
            </button>

          </div>
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L1440 120L1440 0C1440 0 1200 80 720 80C240 80 0 0 0 0L0 120Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Seção de Petições */}
      <div id="peticoes" className="max-w-7xl mx-auto px-4 py-20">
        
        {/* Header da Seção */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Escolha o Tipo de Petição
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Selecione o benefício previdenciário para gerar sua petição inicial 
            com fundamentação jurídica especializada e jurisprudência atualizada
          </p>
        </div>

        {/* Grid de Petições */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {beneficios.map((beneficio, index) => (
            <div
              key={beneficio.id}
              onClick={() => navigate(`/peticoes/${beneficio.id}`)}
              className="group cursor-pointer transform hover:-translate-y-2 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full">
                
                {/* Header do Card */}
                <div className={`bg-gradient-to-r ${beneficio.cor} ${beneficio.hover} p-6 transition-all duration-300`}>
                  <div className="flex items-center justify-between">
                    <div className="text-4xl">{beneficio.icon}</div>
                    <div className="bg-white/20 rounded-full p-2">
                      <svg className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Conteúdo do Card */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {beneficio.titulo}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {beneficio.descricao}
                  </p>
                  
                  {/* Badge */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Disponível
                    </span>
                    <span className="text-blue-600 text-sm font-medium group-hover:text-blue-700">
                      Criar Petição
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seção de Recursos */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Recursos Avançados
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tecnologia de ponta para petições jurídicas profissionais
            </p>
          </div>

          {/* Grid de Recursos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            
            {/* Recurso 1 */}
            <div className="text-center group">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Petições Inteligentes
              </h3>
              <p className="text-gray-600 leading-relaxed">
                IA especializada em Direito Previdenciário com jurisprudência 
                atualizada e fundamentação jurídica robusta
              </p>
            </div>

            {/* Recurso 2 */}
            <div className="text-center group">
              <div className="bg-gradient-to-r from-green-500 to-green-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Download PDF
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Formatação jurídica profissional pronta para protocolo 
                com layout padronizado e assinatura digital
              </p>
            </div>

            {/* Recurso 3 */}
            <div className="text-center group">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Cálculos Premium
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Planilhas e cálculos previdenciários automatizados 
                com valores atualizados e projeções precisas
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="flex justify-center items-center mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-4">
                <span className="text-xl font-bold">T</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold">TamarUse</h3>
                <p className="text-gray-400">Powered by TamarAI</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              © 2025 TamarUse. Todos os direitos reservados.
            </p>
            <p className="text-sm text-gray-500">
              Ferramenta de apoio jurídico. Revisão profissional obrigatória.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;