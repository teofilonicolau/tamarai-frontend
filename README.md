
# TamarUse - Petições Jurídicas Inteligentes

![Logo TamarUse](./public/logoTamar.png)

## 🚀 Visão Geral do Projeto

TamarUse é uma plataforma inovadora que utiliza **Inteligência Artificial** para gerar petições jurídicas profissionais de forma automatizada. O sistema oferece formulários especializados para diferentes áreas do direito, incluindo Previdenciário, Trabalhista, Consumidor, Civil e Processual Civil, além de ferramentas jurídicas inteligentes.

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

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge)](https://github.com/seu-usuario/tamaruse-frontend)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)](https://github.com/seu-usuario/tamaruse-frontend/releases)

## 🛠️ Tecnologias e Bibliotecas Utilizadas

### **Frontend Core**
- **[React 18.3.1](https://react.dev/)** - Biblioteca JavaScript para construção de interfaces de usuário
- **[Vite 5.4.2](https://vitejs.dev/)** - Ferramenta de build rápida para desenvolvimento web moderno
- **[TypeScript 5.6.2](https://www.typescriptlang.org/)** - Superset tipado do JavaScript para maior segurança e produtividade

### **Estilização e UI**
- **[Tailwind CSS 3.4.1](https://tailwindcss.com/)** - Framework CSS utility-first para design responsivo
- **[Heroicons 2.1.5](https://heroicons.com/)** - Biblioteca de ícones SVG otimizados para React
- **[PostCSS 8.4.47](https://postcss.org/)** - Ferramenta para transformar CSS com plugins JavaScript

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
│   └── Sidebar/               # Navegação lateral
│       └── Sidebar.jsx
├── pages/                     # Páginas principais
│   └── Home.jsx
├── services/                  # Serviços e APIs
│   └── api.js
├── styles/                    # Estilos globais
│   └── globals.css
└── App.jsx                    # Componente raiz
```

## 🎯 Funcionalidades Principais

### **📋 Áreas Jurídicas Cobertas**

#### **🏛️ Previdenciário (10 tipos)**
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

#### **⚖️ Trabalhista (2 tipos)**
- Vínculo Empregatício
- Quesitos de Insalubridade

#### **🛒 Consumidor (2 tipos)**
- Vício do Produto
- Cobrança Indevida

#### **📋 Civil (2 tipos)**
- Cobrança
- Indenização

#### **⚖️ Processual Civil (2 tipos)**
- Petição de Execução
- Petição Monitória

#### **🤖 Ferramentas IA (3 tipos)**
- Consulta Jurídica Inteligente
- Análise de Texto Jurídico
- Parecer Jurídico Automatizado

### **✨ Recursos Avançados**

- **🤖 IA Especializada** - Inteligência artificial treinada em direito brasileiro
- **📚 Jurisprudência Atualizada** - Base de dados com decisões dos tribunais superiores
- **⚡ Geração Rápida** - Petições profissionais geradas em segundos
- **📱 Design Responsivo** - Interface adaptável para desktop, tablet e mobile
- **🎨 UX Intuitiva** - Navegação organizada por áreas jurídicas
- **📄 Export PDF** - Download das petições em formato profissional

## 🚀 Como Configurar e Executar

### **📋 Pré-requisitos**

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

### **⚙️ Instalação**

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/tamaruse-frontend.git
   cd tamaruse-frontend
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

1. **Acesse a página inicial** e visualize todas as áreas jurídicas disponíveis
2. **Selecione a área** de interesse (Previdenciário, Trabalhista, etc.)
3. **Escolha o tipo de petição** ou ferramenta desejada
4. **Preencha o formulário** com os dados específicos do caso
5. **Gere a petição** com fundamentação jurídica automatizada
6. **Baixe o PDF** da petição pronta para uso

## 🔗 Integração com Backend

O frontend se comunica com uma API REST que fornece:

- **Geração de petições** com IA especializada
- **Consulta de jurisprudência** atualizada
- **Validação de dados** jurídicos
- **Export em PDF** profissional

### **Endpoints principais:**
```javascript
// Petições Previdenciárias
POST /api/previdenciario/{tipo-peticao}

// Petições Trabalhistas  
POST /api/trabalhista/{tipo-peticao}

// Ferramentas IA
POST /api/ia/consulta-juridica
POST /api/ia/analise-texto
POST /api/ia/parecer-juridico

// Export PDF
POST /api/{area}/{tipo}/pdf
```

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

## 📄 Licença

Este projeto está licenciado sob a **Licença MIT**. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📧 Contato e Suporte

- **Desenvolvedor**: Teofilo Nicolau
- **Empresa**: TamarAI
- **Especialização**: Desenvolvedor
- **Email**: [contato@teofilonicolau](mailto:teofilonicolau157@gmail.com)


## 🏆 Powered by TamarAI

![TamarAI](./public/logoTamar.png)

Este projeto é desenvolvido com a tecnologia **TamarAI**, uma plataforma de inteligência artificial especializada em direito brasileiro, oferecendo soluções inovadoras para automação de petições jurídicas.

---

**© 2025 TamarUse. Todos os direitos reservados.**
*Petições jurídicas inteligentes com tecnologia de ponta.*


---
