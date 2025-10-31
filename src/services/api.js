
import axios from 'axios';

// Try multiple env vars for compatibility and provide sensible dev default
const baseURL = (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://127.0.0.1:8000' : ''));

// Trim trailing slashes if any
const normalizedBaseURL = baseURL ? baseURL.replace(/\/+$/, '') : '';

// Create axios instance
const api = axios.create({
  baseURL: normalizedBaseURL,
  timeout: 60000,
  withCredentials: false,
});

// Interceptor de requisição
api.interceptors.request.use(
  (config) => {
    // Token (se houver)
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Content-Type dinâmico: se for FormData, deixa o browser setar
    const isFormData = config.data instanceof FormData;
    if (!isFormData && !config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }

    // Aceita JSON e texto
    if (!config.headers.Accept) {
      config.headers.Accept = 'application/json, text/plain, */*';
    }

    if (import.meta.env.DEV) {
      const dataForLog = config.data ? JSON.parse(JSON.stringify(config.data)) : null;
      console.debug('[API REQUEST]', config.method?.toUpperCase(), config.baseURL || '', config.url, 'params:', config.params || {}, 'body:', dataForLog);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor de resposta
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) console.debug('[API RESPONSE]', response.status, response.config.url, response.data);

    const ct = (response.headers?.['content-type'] || '').toLowerCase();
    if (typeof response.data === 'string' && ct.includes('text/plain')) {
      return { ...response, data: { message: response.data } };
    }
    return response;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error('[API ERROR]', error?.response?.status, error?.config?.url, error?.response?.data || error.message);
    }

    const status = error?.response?.status || 0;
    const ct = (error?.response?.headers?.['content-type'] || '').toLowerCase();
    let message = error?.message || 'Erro na requisição';
    let data = error?.response?.data;

    if (typeof data === 'string' && ct.includes('text/plain')) {
      data = { message: data };
    }

    if (data?.message) message = data.message;
    if (data?.detail) message = data.detail;

    return Promise.reject({ status, message, data });
  },
);

// Helpers que retornam apenas response.data para simplificar uso
export const http = {
  get: (url, config) => api.get(url, config).then((r) => r.data),
  post: (url, body, config) => api.post(url, body, config).then((r) => r.data),
  put: (url, body, config) => api.put(url, body, config).then((r) => r.data),
  del: (url, config) => api.delete(url, config).then((r) => r.data),

  downloadBlob: async (url, body, filename, method = 'post') => {
    const res = await api.request({ url, method, data: body, responseType: 'blob' });
    const blob = new Blob([res.data], { type: res.data.type || 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename || 'arquivo.pdf';
    link.click();
    URL.revokeObjectURL(link.href);
  },
};

export default api;