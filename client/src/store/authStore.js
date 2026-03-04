import { create } from 'zustand';
import api from '../api/axios.js';

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: true,

  register: async (username, email, password) => {
    // console.log('register called', { username, email, password });
    const res = await api.post('/auth/register', { username, email, password });
    set({ user: res.data.user, isLoading: false });
  },

  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    set({ user: res.data.user, isLoading: false });
  },

  logout: async () => {
    await api.post('/auth/logout');
    set({ user: null, isLoading: false });
  },

  checkAuth: async () => {
    try {
      const res = await api.get('/auth/me');
      set({ user: res.data.user, isLoading: false });
    } catch {
      set({ user: null, isLoading: false });
    }
  },

  // ← new: patch user fields directly without a network call
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