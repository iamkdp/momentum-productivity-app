import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api',
  withCredentials: true
});

// ── Token stored locally in this module ──────────────────
let _accessToken = null;

export const setToken = (token) => { _accessToken = token; };
export const getToken = () => _accessToken;
export const clearToken = () => { _accessToken = null; };

// ── Attach token to every request ────────────────────────
api.interceptors.request.use((config) => {
  if (_accessToken) {
    config.headers.Authorization = `Bearer ${_accessToken}`;
  }
  return config;
});

// ── Auto refresh on 401 ───────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    const isAuthCall =
      original.url.includes('/auth/me') ||
      original.url.includes('/auth/refresh') ||
      original.url.includes('/auth/login') ||
      original.url.includes('/auth/register');

    if (error.response?.status === 401 && !original._retry && !isAuthCall) {
      original._retry = true;
      try {
        const res = await axios.post(
          import.meta.env.VITE_API_URL + '/api/auth/refresh',
          {},
          { withCredentials: true }
        );
        _accessToken = res.data.accessToken;
        original.headers.Authorization = `Bearer ${_accessToken}`;
        return api(original);
      } catch {
        _accessToken = null;
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
