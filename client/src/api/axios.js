import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api',
  withCredentials: true
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // ← Don't intercept auth check calls — let them fail silently
    const isAuthCall =
      original.url.includes('/auth/me') ||
      original.url.includes('/auth/refresh') ||
      original.url.includes('/auth/login') ||
      original.url.includes('/auth/register');

    if (error.response?.status === 401 && !original._retry && !isAuthCall) {
      original._retry = true;
      try {
        await axios.post(
          import.meta.env.VITE_API_URL + '/api/auth/refresh',
          {},
          { withCredentials: true }
        );
        return api(original);
      } catch {
        window.location.href = '/login'; // only fires for protected routes now
      }
    }

    return Promise.reject(error);
  }
);

export default api;