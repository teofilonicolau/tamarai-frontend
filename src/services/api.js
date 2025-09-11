// src/services/api.js
import axios from 'axios';

// Configuração base da API
console.log('🔍 TODAS AS VARIÁVEIS:', import.meta.env);
console.log('🔍 VITE_API_URL:', import.meta.env.VITE_API_URL);
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
console.log('🔍 API_URL FINAL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
    console.log('🌐 Ambiente:', import.meta.env.MODE);
    console.log('🔗 API URL:', import.meta.env.VITE_API_URL);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response Success:`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.data || error.message);
    
    // Tratamento específico de erros
    if (error.response?.status === 404) {
      console.error('🔍 Endpoint não encontrado:', error.config?.url);
    }
    
    return Promise.reject(error);
  }
);

export default api;