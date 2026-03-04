import { create } from 'zustand';
import api from '../api/axios';

export const useAnalyticsStore = create((set) => ({
  stats: null,
  logs: [],
  quote: null,
  isLoading: false,

  fetchQuote: async () => {
    try {
      const res = await api.get('/quote');
      set({ quote: res.data.quote });
    } catch (err) {
      console.error('Quote fetch failed', err);
    }
  },

  fetchAnalytics: async () => {
    set({ isLoading: true });
    try {
      const [analyticsRes, quoteRes] = await Promise.all([
        api.get('/analytics'),
        api.get('/quote')
      ]);
      set({
        stats: analyticsRes.data.stats,
        logs: analyticsRes.data.logs,
        quote: quoteRes.data.quote
      });
    } finally {
      set({ isLoading: false });
    }
  }
}));