# 🤖 Guia de Uso do GitHub Copilot no VS Code

## 📋 Índice

- [Sobre o GitHub Copilot](#sobre-o-github-copilot)
- [Requisitos e Instalação](#requisitos-e-instalação)
- [Configuração no VS Code](#configuração-no-vs-code)
- [Como Usar o Copilot](#como-usar-o-copilot)
- [Melhores Práticas para Este Projeto](#melhores-práticas-para-este-projeto)
- [Dicas para Desenvolvimento React](#dicas-para-desenvolvimento-react)
- [Comandos e Atalhos Úteis](#comandos-e-atalhos-úteis)
- [Solução de Problemas](#solução-de-problemas)
- [Recursos Adicionais](#recursos-adicionais)

## 🤖 Sobre o GitHub Copilot

O **GitHub Copilot** é um assistente de codificação alimentado por IA que ajuda você a escrever código mais rápido e com menos esforço. Ele foi treinado em bilhões de linhas de código e pode sugerir linhas inteiras ou funções completas enquanto você digita.

### Benefícios para o Projeto TamarUse

- ⚡ **Produtividade**: Escreva componentes React mais rapidamente
- 🎯 **Precisão**: Sugestões baseadas no contexto do projeto
- 📚 **Aprendizado**: Descubra melhores práticas e padrões
- 🔧 **Manutenção**: Facilita refatoração e correção de bugs
- 💡 **Criatividade**: Explore diferentes abordagens de implementação

## 📦 Requisitos e Instalação

### Pré-requisitos

1. **Conta GitHub** com acesso ao GitHub Copilot
   - Assinatura individual, empresarial ou estudantil
   - Verificar disponibilidade em: https://github.com/settings/copilot

2. **Visual Studio Code** (versão 1.74.0 ou superior)
   - Download: https://code.visualstudio.com/

3. **Node.js** (versão 18 ou superior)
   - Já instalado para este projeto

### Instalação da Extensão

1. **Abra o VS Code**

2. **Acesse a aba de Extensões** (`Ctrl+Shift+X` ou `Cmd+Shift+X` no Mac)

3. **Busque por "GitHub Copilot"**
   - Procure pela extensão oficial da GitHub

4. **Instale as seguintes extensões**:
   - `GitHub Copilot` - Extensão principal
   - `GitHub Copilot Chat` - Para chat interativo (recomendado)

5. **Faça login na sua conta GitHub**
   - Clique em "Sign in to GitHub" quando solicitado
   - Autorize o VS Code a acessar sua conta

6. **Verificar instalação**
   - Você verá o ícone do Copilot na barra de status (canto inferior direito)
   - O ícone deve estar ativo (sem um X vermelho)

## ⚙️ Configuração no VS Code

### Configurações Recomendadas

Adicione estas configurações ao seu arquivo `settings.json` do VS Code (`Ctrl+,` ou `Cmd+,`):

```json
{
  // GitHub Copilot
  "github.copilot.enable": {
    "*": true,
    "yaml": true,
    "plaintext": false,
    "markdown": true,
    "javascript": true,
    "javascriptreact": true,
    "typescript": true,
    "typescriptreact": true
  },
  
  // Sugestões inline
  "github.copilot.editor.enableAutoCompletions": true,
  
  // Chat do Copilot
  "github.copilot.chat.enabled": true,
  
  // Editor
  "editor.inlineSuggest.enabled": true,
  "editor.quickSuggestions": {
    "other": true,
    "comments": false,
    "strings": true
  },
  
  // Específico para JavaScript/React
  "javascript.suggest.autoImports": true,
  "typescript.suggest.autoImports": true
}
```

### Teclas de Atalho Padrão

| Ação | Windows/Linux | Mac |
|------|---------------|-----|
| Aceitar sugestão | `Tab` | `Tab` |
| Rejeitar sugestão | `Esc` | `Esc` |
| Próxima sugestão | `Alt+]` | `Option+]` |
| Sugestão anterior | `Alt+[` | `Option+[` |
| Abrir Copilot Chat | `Ctrl+Shift+I` | `Cmd+Shift+I` |
| Sugestões alternativas | `Ctrl+Enter` | `Cmd+Enter` |

## 🚀 Como Usar o Copilot

### 1. Sugestões Automáticas (Inline)

O Copilot sugerirá código automaticamente enquanto você digita:

**Exemplo: Criando um novo componente React**

```javascript
// Digite um comentário descrevendo o que você quer:
// Componente de formulário para cadastro de petição previdenciária

// O Copilot sugerirá algo como:
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const FormularioPeticaoPrevidenciaria = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = (data) => {
    // Lógica de submissão
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Campos do formulário */}
    </form>
  );
};

export default FormularioPeticaoPrevidenciaria;
```

### 2. GitHub Copilot Chat

Use o chat para fazer perguntas e obter ajuda contextual:

**Abra o Chat**: `Ctrl+Shift+I` (Windows/Linux) ou `Cmd+Shift+I` (Mac)

**Exemplos de Perguntas**:

```
# Explicar código
"Explique o que este componente faz"

# Gerar código
"Crie um hook customizado para gerenciar autenticação"

# Refatorar
"Refatore esta função para usar async/await"

# Debugging
"Por que este useEffect está causando um loop infinito?"

# Testes
"Gere testes unitários para este componente"

# Documentação
"Adicione JSDoc a esta função"
```

### 3. Comandos Slash no Chat

Use comandos especiais para tarefas específicas:

- `/explain` - Explica o código selecionado
- `/fix` - Sugere correções para o código
- `/tests` - Gera testes para o código
- `/help` - Mostra ajuda sobre o Copilot

## 🎯 Melhores Práticas para Este Projeto

### 1. Use Comentários Descritivos

O Copilot funciona melhor quando você fornece contexto claro:

```javascript
// ❌ Comentário vago
// função de cálculo

// ✅ Comentário específico
// Calcula o valor da aposentadoria por tempo de contribuição
// considerando a EC 103/2019 e o pedágio de 50%
```

### 2. Seja Específico com Nomenclatura

Use nomes de variáveis e funções descritivos:

```javascript
// ❌ Nomes genéricos
const calc = (x, y) => x * y;

// ✅ Nomes específicos
const calcularValorBeneficioPrevidenciario = (salarioContribuicao, fatorPrevidenciario) => {
  return salarioContribuicao * fatorPrevidenciario;
};
```

### 3. Aproveite o Contexto do Projeto

O Copilot analisa arquivos abertos e importações:

```javascript
// Abra arquivos relacionados antes de começar
// Exemplo: Se vai criar um novo formulário, abra FormularioPeticao.jsx

// O Copilot usará o padrão existente para sugestões
```

### 4. Valide as Sugestões

**IMPORTANTE**: Sempre revise o código sugerido:

- ✅ Verifique se está alinhado com os padrões do projeto
- ✅ Confira se as importações estão corretas
- ✅ Teste o código gerado
- ✅ Revise a lógica de negócio
- ✅ Certifique-se de que não há vulnerabilidades de segurança

### 5. Use Para Tarefas Repetitivas

O Copilot é excelente para:

- Criar estruturas de componentes similares
- Gerar validações de formulário
- Escrever testes unitários
- Criar funções utilitárias
- Documentar código com JSDoc

## ⚛️ Dicas para Desenvolvimento React

### Componentes Funcionais

```javascript
// Digite o nome e o Copilot sugere a estrutura:
const CalculadoraPrevidenciaria = () => {
  // O Copilot completa com useState, handlers, etc.
```

### Hooks Customizados

```javascript
// Crie hooks seguindo o padrão "use":
const useFormularioPeticao = () => {
  // O Copilot sugere lógica de estado e efeitos
```

### Integração com APIs

```javascript
// O Copilot reconhece axios e sugere padrões:
import axios from 'axios';

const fetchPeticaoPrevidenciaria = async (tipo) => {
  // Sugestões de try/catch, error handling, etc.
```

### Estilização com Tailwind

```javascript
// O Copilot conhece classes Tailwind:
<div className="flex items-center justify-between p-4 bg-blue-600 rounded-lg">
  {/* Sugestões de classes Tailwind contextuais */}
</div>
```

## ⌨️ Comandos e Atalhos Úteis

### Atalhos Essenciais

| Comando | Atalho | Descrição |
|---------|--------|-----------|
| Aceitar sugestão completa | `Tab` | Aceita toda a sugestão |
| Aceitar palavra | `Ctrl+→` | Aceita próxima palavra da sugestão |
| Ver alternativas | `Alt+\` | Mostra múltiplas sugestões |
| Abrir painel lateral | `Ctrl+Shift+A` | Abre sugestões em painel |

### Comandos do Chat

```
# Análise de código
/explain [código]

# Correção de bugs
/fix [descrição do problema]

# Geração de testes
/tests [função ou componente]

# Otimização
"Como posso otimizar este código?"

# Documentação
"Adicione documentação JSDoc"
```

## 🔧 Solução de Problemas

### Copilot Não Está Funcionando

1. **Verifique a conexão**
   - Clique no ícone do Copilot na barra de status
   - Certifique-se de que está conectado à sua conta GitHub

2. **Reinicie a extensão**
   - Comando Palette (`Ctrl+Shift+P`)
   - Digite "Reload Window"

3. **Verifique sua assinatura**
   - Acesse: https://github.com/settings/copilot
   - Confirme que sua assinatura está ativa

### Sugestões Não Aparecem

1. **Verifique as configurações**
   ```json
   "editor.inlineSuggest.enabled": true
   ```

2. **Reinicie o VS Code**

3. **Verifique se o arquivo está em uma linguagem suportada**
   - JavaScript, JSX, TypeScript, etc.

### Sugestões Inadequadas

1. **Forneça mais contexto**
   - Adicione comentários descritivos
   - Abra arquivos relacionados

2. **Use o Chat para refinamento**
   - Explique o que você precisa especificamente

3. **Rejeite e tente novamente**
   - `Esc` para rejeitar
   - Continue digitando para novas sugestões

### Problemas de Performance

1. **Desative temporariamente**
   - Clique no ícone do Copilot
   - Selecione "Disable Completions"

2. **Configure linguagens específicas**
   ```json
   "github.copilot.enable": {
     "*": false,
     "javascript": true,
     "javascriptreact": true
   }
   ```

## 📚 Recursos Adicionais

### Documentação Oficial

- [GitHub Copilot Docs](https://docs.github.com/en/copilot)
- [VS Code Copilot Extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)
- [Copilot Chat](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat)

### Tutoriais e Guias

- [Getting Started with Copilot](https://docs.github.com/en/copilot/getting-started-with-github-copilot)
- [Copilot Best Practices](https://docs.github.com/en/copilot/using-github-copilot/best-practices-for-using-github-copilot)

### Comunidade

- [GitHub Community Discussions](https://github.com/orgs/community/discussions/categories/copilot)
- [Stack Overflow - GitHub Copilot](https://stackoverflow.com/questions/tagged/github-copilot)

### Vídeos Tutoriais (YouTube)

- "GitHub Copilot Tutorial for Beginners"
- "Advanced GitHub Copilot Techniques"
- "GitHub Copilot with React and TypeScript"

## 💡 Dicas Finais

### Para Maximizar Produtividade

1. **Escreva comentários antes do código**
   - Descreva o que você quer implementar
   - O Copilot usará como contexto

2. **Mantenha arquivos relacionados abertos**
   - O Copilot analisa tabs abertas
   - Mais contexto = melhores sugestões

3. **Use nomenclatura consistente**
   - Siga padrões do projeto
   - O Copilot aprende com o código existente

4. **Experimente o Chat**
   - Faça perguntas específicas
   - Peça refatorações e otimizações

5. **Revise sempre**
   - Nunca aceite código sem entender
   - Teste tudo que o Copilot sugere
   - Adapte às necessidades do projeto

### Segurança e Privacidade

- 🔒 O Copilot não compartilha código do seu projeto publicamente
- 🔒 Suas sugestões são geradas com base em padrões públicos
- 🔒 Você mantém todos os direitos sobre o código gerado
- 🔒 Revise sugestões para evitar código com licenças incompatíveis

## 🎓 Aprendizado Contínuo

O GitHub Copilot é uma ferramenta poderosa, mas **você** continua sendo o desenvolvedor:

- ✅ Use-o para acelerar tarefas repetitivas
- ✅ Aprenda com as sugestões
- ✅ Entenda o código antes de aceitar
- ✅ Adapte as sugestões ao seu contexto
- ✅ Mantenha boas práticas de desenvolvimento

---

## 📞 Suporte

Se você tiver dúvidas ou problemas específicos com o Copilot neste projeto:

1. Consulte a [Documentação Oficial](https://docs.github.com/en/copilot)
2. Verifique as [Issues do Projeto](https://github.com/teofilonicolau/tamarai-frontend/issues)
3. Entre em contato com o desenvolvedor: teofilonicolau157@gmail.com

---

<div align="center">

**Desenvolvido com ❤️ e assistido por 🤖 GitHub Copilot**

© 2025 TamarUse - Petições Jurídicas Inteligentes

</div>
