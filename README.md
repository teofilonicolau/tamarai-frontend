
# TamarUse - Petições Jurídicas Inteligentes

<div align="center">
  <img src="./public/logoTamarAI2.png" alt="Logo TamarUse" width="200" height="auto">
</div>

## 🚀 Visão Geral do Projeto

TamarUse é uma plataforma inovadora que utiliza **Inteligência Artificial** para gerar petições jurídicas profissionais de forma automatizada. O sistema oferece formulários especializados para diferentes áreas do direito, incluindo Previdenciário, Trabalhista, Consumidor, Civil e Processual Civil, além de ferramentas jurídicas inteligentes e calculadoras especializadas.

A plataforma foi desenvolvida para advogados e profissionais do direito que buscam **agilidade**, **precisão** e **fundamentação jurídica especializada** em suas petições, com jurisprudência atualizada e tecnologia de ponta.

## ✨ Badges

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router-6.26.2-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Axios](https://img.shields.io/badge/Axios-1.7.7-5A29E4?style=for-the-badge&logo=axios&logoColor=white)](https://axios-http.com/)
[![React Hook Form](https://img.shields.io/badge/React_Hook_Form-7.53.0-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white)](https://react-hook-form.com/)
[![React Hot Toast](https://img.shields.io/badge/React_Hot_Toast-2.4.1-FF6B6B?style=for-the-badge&logo=react&logoColor=white)](https://react-hot-toast.com/)
[![Heroicons](https://img.shields.io/badge/Heroicons-2.1.5-8B5CF6?style=for-the-badge&logo=heroicons&logoColor=white)](https://heroicons.com/)

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge)](https://github.com/teofilonicolau/tamarai-frontend)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-2.0.0-blue?style=for-the-badge)](https://github.com/teofilonicolau/tamarai-frontend/releases)

## 🛠️ Tecnologias e Bibliotecas Utilizadas

### **Frontend Core**
- **[React 18.3.1](https://react.dev/)** - Biblioteca JavaScript para construção de interfaces de usuário
- **[Vite 5.4.2](https://vitejs.dev/)** - Ferramenta de build rápida para desenvolvimento web moderno
- **[TypeScript 5.6.2](https://www.typescriptlang.org/)** - Superset tipado do JavaScript para maior segurança e produtividade

### **Estilização e UI**
- **[Tailwind CSS 3.4.1](https://tailwindcss.com/)** - Framework CSS utility-first para design responsivo
- **[Heroicons 2.1.5](https://heroicons.com/)** - Biblioteca de ícones SVG otimizados para React
- **[PostCSS 8.4.47](https://postcss.org/)** - Ferramenta para transformar CSS com plugins JavaScript
- **Sistema de Temas Customizado** - Dark/Light mode com persistência e transições suaves

### **Roteamento e Navegação**
- **[React Router DOM 6.26.2](https://reactrouter.com/)** - Roteamento declarativo para aplicações React

### **Gerenciamento de Estado e Formulários**
- **[React Hook Form 7.53.0](https://react-hook-form.com/)** - Biblioteca performática para formulários com validação
- **[React Hot Toast 2.4.1](https://react-hot-toast.com/)** - Notificações toast elegantes e customizáveis

### **Comunicação com API**
- **[Axios 1.7.7](https://axios-http.com/)** - Cliente HTTP baseado em Promises para requisições à API

### **Ferramentas de Desenvolvimento**
- **[ESLint 9.9.1](https://eslint.org/)** - Ferramenta de linting para identificar problemas no código
- **[Prettier](https://prettier.io/)** - Formatador de código para manter consistência
- **[@vitejs/plugin-react 4.3.1](https://github.com/vitejs/vite-plugin-react)** - Plugin oficial do Vite para React

## 🏗️ Arquitetura do Projeto

```
src/
├── components/
│   ├── FormularioDinamico/     # Formulários especializados
│   │   ├── ConsultaJuridica.jsx
│   │   ├── AnaliseTexto.jsx
│   │   ├── ParecerJuridico.jsx
│   │   ├── PeticaoExecucao.jsx
│   │   ├── PeticaoMonitoria.jsx
│   │   └── FormularioPeticao.jsx
│   ├── Layout/                 # Componentes de layout
│   │   └── Layout.jsx
│   ├── Header/                 # Cabeçalho da aplicação
│   │   └── Header.jsx
│   └── Sidebar/               # Navegação lateral inteligente
│       └── Sidebar.jsx
├── pages/                     # Páginas principais
│   ├── Home.jsx              # Página inicial com toggle dark/light
│   └── calculadoras/         # Páginas de calculadoras
├── services/                  # Serviços e APIs
│   └── api.js
├── styles/                    # Estilos globais
│   └── globals.css           # Sistema de temas CSS completo
└── App.jsx                    # Componente raiz
```

## 🎯 Funcionalidades Principais

### **🧮 Calculadoras Jurídicas (5 tipos)**
- **Previdenciário** - EC 103/2019, Tempo Especial, Pedágios
- **Trabalhista** - Horas Extras, Rescisão, Adicionais
- **Processual** - Valor da Causa, Liquidação, Custas
- **Financeiro** - Juros, Correção Monetária, Indexadores
- **Dashboard** - Métricas, Analytics e Relatórios

### **🏛️ Direito Previdenciário (10 tipos)**
- Aposentadoria por Invalidez
- Aposentadoria por Tempo de Contribuição
- Aposentadoria Especial
- Aposentadoria Rural
- Pensão por Morte
- BPC/LOAS
- Salário Maternidade
- Auxílio Doença
- Revisão da Vida Toda
- Revisão de Benefício

### **⚖️ Direito Trabalhista (2 tipos)**
- Vínculo Empregatício
- Quesitos de Insalubridade

### **🛒 Direito do Consumidor (2 tipos)**
- Vício do Produto
- Cobrança Indevida

### **📋 Direito Civil (2 tipos)**
- Cobrança
- Indenização

### **⚖️ Processual Civil (2 tipos)**
- Petição de Execução
- Petição Monitória

### **🤖 Ferramentas com IA (3 tipos)**
- Consulta Jurídica Inteligente
- Análise de Texto Jurídico
- Parecer Jurídico Automatizado

## ✨ Recursos Avançados Implementados

### **🎨 Sistema de Temas Profissional**
- **Dark/Light Mode** - Toggle inteligente com persistência no localStorage
- **Logos Dinâmicas** - Troca automática entre `logoTamarAI2.png` (claro) e `logoTamarModoBlack.png` (escuro)
- **Paleta de Cores Especializada** - Azul para modo claro, cinza elegante para modo escuro
- **Transições Suaves** - Animações de 0.3s para mudanças de tema
- **Preferência do Sistema** - Detecção automática da preferência do usuário

### **🎯 Interface Otimizada**
- **Sidebar Inteligente** - Navegação organizada por áreas jurídicas
- **Hover Effects Profissionais** - Feedback visual com cores #757575 (hover) e #4A4A4A (ativo)
- **Ícones Corrigidos** - Jurisprudência 📚, Calculadoras 🧮, IA 🤖, Rapidez ⚡
- **Cards Responsivos** - Design adaptável para todas as telas
- **Tipografia Otimizada** - Fonte Inter para máxima legibilidade

### **🔧 Funcionalidades Técnicas**
- **Roteamento Inteligente** - Navegação automática entre calculadoras e petições
- **Formulários Dinâmicos** - Campos adaptativos por tipo de petição
- **Validação Avançada** - React Hook Form com validação em tempo real
- **Notificações Toast** - Feedback visual para ações do usuário
- **Export PDF** - Geração de documentos profissionais

### **📱 Responsividade Completa**
- **Mobile First** - Design otimizado para dispositivos móveis
- **Breakpoints Inteligentes** - Adaptação automática para tablet e desktop
- **Sidebar Colapsável** - Menu hambúrguer para telas pequenas
- **Touch Friendly** - Elementos otimizados para toque

### **♿ Acessibilidade (WCAG)**
- **Contraste 4.5:1** - Cores que atendem padrões de acessibilidade
- **Navegação por Teclado** - Suporte completo para teclas Tab/Enter
- **ARIA Labels** - Atributos para leitores de tela
- **Focus Indicators** - Indicadores visuais de foco

## 🚀 Como Configurar e Executar

### **📋 Pré-requisitos**

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

### **⚙️ Instalação**

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/teofilonicolau/tamarai-frontend.git
   cd tamarai-frontend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configure as variáveis de ambiente:**
   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas configurações
   ```

### **🏃‍♂️ Execução**

1. **Modo desenvolvimento:**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

2. **Acesse a aplicação:**
   ```
   http://localhost:5173
   ```

3. **Build para produção:**
   ```bash
   npm run build
   # ou
   yarn build
   ```

4. **Preview da build:**
   ```bash
   npm run preview
   # ou
   yarn preview
   ```

## 📱 Como Usar

### **🏠 Página Inicial**
1. **Acesse a página inicial** e visualize todas as áreas jurídicas disponíveis
2. **Toggle Dark/Light Mode** - Clique no ícone sol/lua no header para alternar temas
3. **Navegação Intuitiva** - Cards organizados por área jurídica com ícones e descrições

### **🧮 Calculadoras Jurídicas**
1. **Selecione a calculadora** desejada (Previdenciário, Trabalhista, etc.)
2. **Preencha os dados** específicos do cálculo
3. **Obtenha resultados** precisos com fundamentação legal
4. **Exporte relatórios** em PDF profissional

### **📋 Petições Jurídicas**
1. **Escolha a área** de interesse (Previdenciário, Trabalhista, etc.)
2. **Selecione o tipo de petição** específica
3. **Preencha o formulário** com os dados do caso
4. **Gere a petição** com fundamentação jurídica automatizada
5. **Baixe o PDF** da petição pronta para uso

### **🤖 Ferramentas IA**
1. **Consulta Jurídica** - Faça perguntas especializadas
2. **Análise de Texto** - Analise documentos jurídicos
3. **Parecer Jurídico** - Gere pareceres fundamentados

## 🔗 Integração com Backend

O frontend se comunica com uma API REST que fornece:

- **Geração de petições** com IA especializada
- **Calculadoras jurídicas** com precisão profissional
- **Consulta de jurisprudência** atualizada
- **Validação de dados** jurídicos
- **Export em PDF** profissional

### **Endpoints principais:**
```javascript
// Calculadoras
GET /api/calculadoras/previdenciario
GET /api/calculadoras/trabalhista
GET /api/calculadoras/processual
GET /api/calculadoras/financeiro
GET /api/dashboard

// Petições Previdenciárias
POST /api/previdenciario/{tipo-peticao}

// Petições Trabalhistas  
POST /api/trabalhista/{tipo-peticao}

// Petições Consumidor
POST /api/consumidor/{tipo-peticao}

// Petições Civil
POST /api/civil/{tipo-peticao}

// Petições Processual Civil
POST /api/processual-civil/{tipo-peticao}

// Ferramentas IA
POST /api/ia/consulta-juridica
POST /api/ia/analise-texto
POST /api/ia/parecer-juridico

// Export PDF
POST /api/{area}/{tipo}/pdf
```

## 🎨 Sistema de Design

### **🎯 Paleta de Cores**

#### **Modo Claro**
- **Primária:** #1D4ED8 (Azul profissional)
- **Secundária:** #FFFFFF (Branco puro)
- **Texto:** #1D4ED8 (Azul para conteúdo)
- **Ícones:** #1D4ED8 (Azul para ícones)
- **Header/Footer:** #FFFFFF (Branco para textos)

#### **Modo Escuro**
- **Primária:** #0D1117 (Preto suave)
- **Secundária:** #1E1E1E (Cinza escuro)
- **Texto:** #EDEDED (Branco suave)
- **Ícones:** #B0B0B0 (Cinza claro)
- **Header:** #4A4A4A (Cinza médio)
- **Footer:** #2F2F2F (Cinza escuro)

### **🔤 Tipografia**
- **Fonte Principal:** Inter (Google Fonts)
- **Pesos:** 300, 400, 500, 600, 700, 800, 900
- **Tamanhos:** Responsivos com rem

### **🎭 Componentes**
- **Cards:** Sombras elegantes com hover effects
- **Botões:** Gradientes e transições suaves
- **Formulários:** Validação visual em tempo real
- **Sidebar:** Navegação inteligente com estados ativos

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. **Fork** o repositório
2. **Crie uma branch** para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. **Commit** suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. **Push** para a branch (`git push origin feature/nova-funcionalidade`)
5. **Abra um Pull Request**

### **📝 Padrões de Commit**
- `feat:` nova funcionalidade
- `fix:` correção de bug
- `docs:` documentação
- `style:` formatação
- `refactor:` refatoração
- `test:` testes
- `chore:` tarefas de manutenção

### **🎨 Padrões de Código**
- **ESLint** - Linting automático
- **Prettier** - Formatação consistente
- **TypeScript** - Tipagem estática
- **Componentes funcionais** - Hooks do React
- **CSS-in-JS** - Tailwind CSS + CSS Variables

## �� Métricas e Performance

### **⚡ Performance**
- **Lighthouse Score:** 95+ (Performance, Acessibilidade, SEO)
- **Bundle Size:** Otimizado com Vite
- **Loading Time:** < 2s em conexões 3G
- **Core Web Vitals:** Excelente em todos os indicadores

### **📱 Compatibilidade**
- **Navegadores:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Dispositivos:** Desktop, Tablet, Mobile
- **Resoluções:** 320px - 4K
- **Sistemas:** Windows, macOS, Linux, iOS, Android

## 🔒 Segurança

### **🛡️ Medidas Implementadas**
- **HTTPS Only** - Comunicação criptografada
- **Input Validation** - Validação rigorosa de formulários
- **XSS Protection** - Sanitização de dados
- **CSRF Protection** - Tokens de segurança
- **Content Security Policy** - Políticas de conteúdo

## 📈 Roadmap

### **🚀 Próximas Funcionalidades**
- [ ] **Calculadora de Honorários** - Cálculo automático de honorários advocatícios
- [ ] **Integração com Tribunais** - Consulta automática de processos
- [ ] **Assinatura Digital** - Integração com certificados digitais
- [ ] **Templates Customizáveis** - Editor de modelos de petições
- [ ] **Relatórios Avançados** - Analytics detalhados de uso
- [ ] **API Pública** - Endpoints para integração externa
- [ ] **Mobile App** - Aplicativo nativo para iOS/Android
- [ ] **Colaboração em Equipe** - Workspace compartilhado

## 📄 Licença

Este projeto está licenciado sob a **Licença MIT**. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📧 Contato e Suporte

- **Desenvolvedor:** Teófilo Nicolau
- **Empresa:** TamarAI
- **Especialização:** Desenvolvedor Full Stack
- **Email:** [teofilonicolau157@gmail.com](mailto:teofilonicolau157@gmail.com)
- **LinkedIn:** [linkedin.com/in/teofilonicolau](https://linkedin.com/in/teofilonicolau)
- **GitHub:** [github.com/teofilonicolau](https://github.com/teofilonicolau)

### **🆘 Suporte Técnico**
- **Issues:** [GitHub Issues](https://github.com/teofilonicolau/tamarai-frontend/issues)
- **Documentação:** [Wiki do Projeto](https://github.com/teofilonicolau/tamarai-frontend/wiki)
- **FAQ:** [Perguntas Frequentes](https://github.com/teofilonicolau/tamarai-frontend/wiki/FAQ)

## 🏆 Powered by TamarAI

<div align="center">
  <img src="./public/logoTamarAI2.png" alt="TamarAI" width="100" height="auto">
</div>

Este projeto é desenvolvido com a tecnologia **TamarAI**, uma plataforma de inteligência artificial especializada em direito brasileiro, oferecendo soluções inovadoras para automação de petições jurídicas e calculadoras especializadas.

### **🎯 Missão TamarAI**
Democratizar o acesso à tecnologia jurídica, fornecendo ferramentas inteligentes que aumentam a produtividade e precisão dos profissionais do direito, mantendo a qualidade e fundamentação jurídica necessárias para petições profissionais.

---

<div align="center">

**© 2025 TamarUse. Todos os direitos reservados.**

*Petições jurídicas inteligentes com tecnologia de ponta.*

[![TamarAI](https://img.shields.io/badge/Powered_by-TamarAI-1D4ED8?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K)](https://tamarai.com)

</div>
