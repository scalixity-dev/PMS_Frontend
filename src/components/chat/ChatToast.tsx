import { X } from 'lucide-react';
import { useChatToastStore } from '../../store/chatToastStore';

const TOAST_STYLES = {
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  success: 'bg-green-50 border-green-200 text-green-800',
};

export function ChatToast() {
  const { toast, dismiss } = useChatToastStore();

  if (!toast) return null;

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-[9999] flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${TOAST_STYLES[toast.type]}`}
      role="alert"
    >
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={dismiss}
        className="p-1 rounded hover:opacity-70 transition-opacity"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
