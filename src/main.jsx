// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/globals.css';

// 🚀 CONFIGURAÇÃO DE DESENVOLVIMENTO
if (import.meta.env.DEV) {
  console.log('🚀 TamarUSE Frontend iniciado em modo desenvolvimento');
  console.log('📡 Backend esperado em: http://localhost:8000');
}

// 🎯 RENDERIZAÇÃO DA APLICAÇÃO
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// �� CONFIGURAÇÕES GLOBAIS
window.addEventListener('unhandledrejection', (event) => {
  console.error('🚨 Promise rejeitada:', event.reason);
});

// 📱 DETECÇÃO DE DISPOSITIVO
if (window.innerWidth < 768) {
  document.body.classList.add('mobile-device');
}

// �� APLICAR TEMA INICIAL
const savedTheme = localStorage.getItem('tamaruse-theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

document.documentElement.setAttribute('data-theme', initialTheme);

// �� LOG DE INICIALIZAÇÃO
console.log(`
🏛️ TamarUSE - Petições Jurídicas Inteligentes
📅 Versão: 1.0.0
🎨 Tema inicial: ${initialTheme}
📱 Dispositivo: ${window.innerWidth < 768 ? 'Mobile' : 'Desktop'}
🌐 Ambiente: ${import.meta.env.MODE}
`);