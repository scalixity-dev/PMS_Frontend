import { create } from 'zustand';

type ToastType = 'error' | 'info' | 'success';

interface ChatToast {
  id: string;
  message: string;
  type: ToastType;
}

interface ChatToastState {
  toast: ChatToast | null;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
  showSuccess: (message: string) => void;
  dismiss: () => void;
}

const AUTO_DISMISS_MS = 5000;

export const useChatToastStore = create<ChatToastState>((set) => {
  let dismissTimer: ReturnType<typeof setTimeout> | null = null;

  const scheduleDismiss = () => {
    if (dismissTimer) clearTimeout(dismissTimer);
    dismissTimer = setTimeout(() => {
      set({ toast: null });
      dismissTimer = null;
    }, AUTO_DISMISS_MS);
  };

  const show = (message: string, type: ToastType) => {
    set({
      toast: {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        message,
        type,
      },
    });
    scheduleDismiss();
  };

  return {
    toast: null,
    showError: (message: string) => show(message, 'error'),
    showInfo: (message: string) => show(message, 'info'),
    showSuccess: (message: string) => show(message, 'success'),
    dismiss: () => set({ toast: null }),
  };
});
