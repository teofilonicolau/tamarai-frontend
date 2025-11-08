import axios from 'axios';

// Prefer explicit env vars: primeiro VITE_API_BASE_URL, depois VITE_API_URL
const envBase = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '';

// Normalize (remove trailing slash) and decide fallback for DEV
let baseURL = envBase ? String(envBase).replace(/\/+$/, '') : '';

// Dev fallback (use localhost backend for local testing).
// In CI/production we want baseURL to be explicitly configured.
if (!baseURL && import.meta.env.DEV) {
  baseURL = 'http://127.0.0.1:8000';
  console.warn('[API] VITE_API_BASE_URL/VITE_API_URL not set — using local fallback:', baseURL);
  console.info('[API] To use remote backend, set VITE_API_BASE_URL in .env.local and restart dev server.');
}

const api = axios.create({
  baseURL,
  timeout: 120000, // 2 minutos — ideal para endpoints lentos com IA
  withCredentials: false,
});

// === RETRY LOGIC (1 retry com delay de 1s) ===
const MAX_RETRIES = 1;
const RETRY_DELAY = 1000; // ms

api.interceptors.request.use((config) => {
  config.retryCount = config.retryCount || 0;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const config = error.config;

    // Só retry em caso de timeout ou erro de rede (sem resposta)
    if (
      config.retryCount < MAX_RETRIES &&
      (!error.response || error.code === 'ECONNABORTED')
    ) {
      config.retryCount += 1;

      if (import.meta.env.DEV) {
        console.warn(
          `[API RETRY] Tentativa ${config.retryCount}/${MAX_RETRIES} para ${config.method?.toUpperCase()} ${config.url}`
        );
      }

      // Delay antes do retry
      return new Promise((resolve) => setTimeout(() => resolve(axios(config)), RETRY_DELAY));
    }

    return Promise.reject(error);
  }
);

// === REQUEST INTERCEPTOR (mantido original com melhorias) ===
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }

      const isFormData = config.data instanceof FormData;
      config.headers = config.headers || {};
      if (!isFormData && !config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json';
      }

      if (!config.headers.Accept) {
        config.headers.Accept = 'application/json, text/plain, */*';
      }

      if (import.meta.env.DEV) {
        const dataForLog = config.data ? JSON.parse(JSON.stringify(config.data)) : null;
        console.debug(
          '[API REQUEST]',
          (config.method || '').toUpperCase(),
          config.baseURL || '',
          config.url,
          'body:',
          dataForLog
        );
      }
    } catch (e) {
      console.error('[API] request interceptor error', e);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// === RESPONSE INTERCEPTOR (mantido original com tratamento de text/plain) ===
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.debug('[API RESPONSE]', response.status, response.config?.url);
    }
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
    if (data?.detail) {
      message = data.detail;
    }

    return Promise.reject({ status, message, data });
  }
);

// === HELPERS (mantidos) ===
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
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
  },
};

export default api;