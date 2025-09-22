import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || '';

const api = axios.create({
  baseURL,
  timeout: 20000,
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

    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor de resposta
api.interceptors.response.use(
  (response) => {
    const ct = (response.headers?.['content-type'] || '').toLowerCase();

    // text/plain => normaliza para objeto { message }
    if (typeof response.data === 'string' && ct.includes('text/plain')) {
      return { ...response, data: { message: response.data } };
    }

    return response;
  },
  (error) => {
    // Normalização de erro
    const status = error?.response?.status || 0;
    const ct = (error?.response?.headers?.['content-type'] || '').toLowerCase();
    let message = error?.message || 'Erro na requisição';
    let data = error?.response?.data;

    // text/plain no erro => trata como mensagem
    if (typeof data === 'string' && ct.includes('text/plain')) {
      data = { message: data };
    }

    if (data?.message) message = data.message;

    return Promise.reject({ status, message, data });
  },
);

// Helpers
export const http = {
  get: (url, config) => api.get(url, config).then((r) => r.data),
  post: (url, body, config) => api.post(url, body, config).then((r) => r.data),
  put: (url, body, config) => api.put(url, body, config).then((r) => r.data),
  del: (url, config) => api.delete(url, config).then((r) => r.data),

  // Para downloads (PDF, planilhas etc.)
  downloadBlob: async (url, body, filename, method = 'post') => {
    const res = await api.request({
      url,
      method,
      data: body,
      responseType: 'blob',
    });

    const blob = new Blob([res.data], { type: res.data.type || 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename || 'arquivo.pdf';
    link.click();
    URL.revokeObjectURL(link.href);
  },
};

export default api;
