import axios from 'axios';

export const TOKEN_KEY = 'aam_token';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const hadToken = Boolean(localStorage.getItem(TOKEN_KEY));
      localStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new Event('auth:logout'));
      if (hadToken) {
        window.dispatchEvent(
          new CustomEvent('app:toast', {
            detail: { type: 'warning', title: 'Sessiya tugadi', message: 'Qaytadan tizimga kiring.' },
          })
        );
      }
    }
    return Promise.reject(error);
  }
);

export const extractErrorMessage = (error, fallback = 'Xatolik yuz berdi.') => {
  const payload = error?.response?.data;
  if (payload?.error?.message) {
    const details = payload.error.details;
    if (Array.isArray(details) && details.length > 0) {
      return `${payload.error.message} (${details.map((d) => d.message).join('; ')})`;
    }
    return payload.error.message;
  }
  if (error?.message) return error.message;
  return fallback;
};

export default api;
