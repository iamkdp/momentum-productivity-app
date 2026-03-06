import { create } from 'zustand';
import api from '../api/axios.js';

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isLoading: true,

  register: async (username, email, password) => {
    const res = await api.post('/auth/register', { username, email, password });
    set({ user: res.data.user, accessToken: res.data.accessToken });
  },

  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    set({ user: res.data.user, accessToken: res.data.accessToken });
  },

  logout: async () => {
    await api.post('/auth/logout');
    set({ user: null, accessToken: null });
  },

  checkAuth: async () => {
    try {
      // Try to get a new accessToken using the refreshToken cookie
      const res = await api.post('/auth/refresh');
      const newToken = res.data.accessToken;
      set({ accessToken: newToken });

      // Now fetch user with the new token
      const userRes = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${newToken}` }
      });
      set({ user: userRes.data.user, isLoading: false });
    } catch {
      set({ user: null, accessToken: null, isLoading: false });
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
  },

  setAccessToken: (token) => set({ accessToken: token })
}));
