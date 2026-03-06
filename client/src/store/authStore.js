import { create } from 'zustand';
import api, { setToken, clearToken } from '../api/axios.js';

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: true,

  register: async (username, email, password) => {
    const res = await api.post('/auth/register', { username, email, password });
    setToken(res.data.accessToken); // ← store token in axios module
    set({ user: res.data.user });
  },

  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    setToken(res.data.accessToken); // ← store token in axios module
    set({ user: res.data.user });
  },

  logout: async () => {
    await api.post('/auth/logout');
    clearToken();
    set({ user: null });
  },

  checkAuth: async () => {
    try {
      // Use refresh token cookie to get a new access token
      const res = await api.post('/auth/refresh');
      setToken(res.data.accessToken);

      // Now fetch user with that token attached automatically
      const userRes = await api.get('/auth/me');
      set({ user: userRes.data.user, isLoading: false });
    } catch {
      clearToken();
      set({ user: null, isLoading: false });
    }
  },

  updateUserStats: ({ score, currentStreak }) => {
    set(state => ({
      user: {
        ...state.user,
        ...(score !== undefined && { score }),
        ...(currentStreak !== undefined && { currentStreak })
      }
    }));
  }
}));
