import { create } from 'zustand';
import api from '../api/axios';
import { useAuthStore } from './authStore';
export const useRoutineStore = create((set, get) => ({
    routines: [],
    isLoading: false,

    fetchRoutines: async () => {
        set({ isLoading: true });
        try {
            const res = await api.get('/routines');
            set({ routines: res.data.routines });
        } finally {
            set({ isLoading: false });
        }
    },

    addRoutine: async (title) => {
        const res = await api.post('/routines', { title });
        set({ routines: [...get().routines, res.data.routine] });
    },

    completeRoutine: async (id) => {
    const res = await api.patch(`/routines/${id}/complete`);
    set({
      routines: get().routines.map(r => r._id === id ? res.data.routine : r)
    });

    // ← directly update user in auth store
    const authStore = useAuthStore.getState();
    authStore.updateUserStats({
      score: res.data.newScore,
      currentStreak: res.data.globalStreak
    });

    return {
      pointsEarned: res.data.pointsEarned,
      streakBonus: res.data.streakBonus,
      newStreak: res.data.newStreak
    };
  },
    deleteRoutine: async (id) => {
        await api.delete(`/routines/${id}`);
        set({ routines: get().routines.filter(r => r._id !== id) });
    }
}));