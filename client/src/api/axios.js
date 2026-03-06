import axios from 'axios';
import { useAuthStore } from '../store/authStore';
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api',
  withCredentials: true // still needed for refresh token cookie
});

// ← Attach accessToken from store to every request
api.interceptors.request.use((config) => {
  // dynamic import avoids circular dependency
  const { useAuthStore } = require('../store/authStore');
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
        const newToken = res.data.accessToken;

        useAuthStore.getState().setAccessToken(newToken);

        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        window.location.href = '/login';
        
      }
    }

    return Promise.reject(error);
  }
);

export default api;
