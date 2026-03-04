import { create } from 'zustand';
import api from '../api/axios';
import { useAuthStore } from './authStore';
export const useTaskStore = create((set, get) => ({
  tasks: [],
  isLoading: false,

  fetchTasks: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/tasks');
      set({ tasks: res.data.tasks });
    } finally {
      set({ isLoading: false });
    }
  },

  addTask: async (title, isImportant, deadline) => {
    const res = await api.post('/tasks', { title, isImportant, deadline });
    set({ tasks: [res.data.task, ...get().tasks] });
  },

  completeTask: async (id) => {
    const res = await api.patch(`/tasks/${id}/complete`);
    set({
      tasks: get().tasks.map(t => t._id === id ? res.data.task : t)
    });

    // ← directly update user in auth store with fresh values
    const authStore = useAuthStore.getState();
    authStore.updateUserStats({
      score: res.data.newScore,
      currentStreak: res.data.currentStreak
    });

    return res.data.pointsEarned;
  },

  deleteTask: async (id) => {
    await api.delete(`/tasks/${id}`);
    set({ tasks: get().tasks.filter(t => t._id !== id) });
  },

  updateTask: async (id, data) => {
    const res = await api.patch(`/tasks/${id}`, data);
    set({
      tasks: get().tasks.map(t =>
        t._id === id ? res.data.task : t
      )
    });
  }
}));