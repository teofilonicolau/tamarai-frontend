// src/services/api.js
import axios from 'axios';

// Configuração base da API
const api = axios.create({
  baseURL: 'http://localhost:8000',  // ← SEM /api/v1 aqui!
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
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