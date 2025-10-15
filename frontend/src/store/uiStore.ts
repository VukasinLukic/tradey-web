import { create } from 'zustand';

interface ToastState {
  message: string | null;
  type: 'success' | 'error';
  showToast: (message: string, type?: 'success' | 'error') => void;
  hideToast: () => void;
}

export const useUiStore = create<ToastState>((set) => ({
  message: null,
  type: 'success',
  showToast: (message, type = 'success') => set({ message, type }),
  hideToast: () => set({ message: null }),
}));
