import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
    id: string;
    type: ToastType;
    message: string;
    duration: number;
}

interface ToastContextValue {
    show: (message: string, type?: ToastType, duration?: number) => void;
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    warning: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const ICONS: Record<ToastType, React.ComponentType<{ className?: string; size?: number }>> = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
};

const COLORS: Record<ToastType, string> = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const ICON_COLORS: Record<ToastType, string> = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500',
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const remove = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const show = useCallback(
        (message: string, type: ToastType = 'info', duration: number = 4000) => {
            const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
            setToasts((prev) => [...prev, { id, message, type, duration }]);
        },
        [],
    );

    const value: ToastContextValue = {
        show,
        success: (msg, dur) => show(msg, 'success', dur),
        error: (msg, dur) => show(msg, 'error', dur ?? 6000),
        warning: (msg, dur) => show(msg, 'warning', dur),
        info: (msg, dur) => show(msg, 'info', dur),
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="fixed top-4 right-4 z-[999999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
                {toasts.map((t) => (
                    <ToastItemView key={t.id} toast={t} onClose={() => remove(t.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

const ToastItemView: React.FC<{ toast: ToastItem; onClose: () => void }> = ({ toast, onClose }) => {
    const Icon = ICONS[toast.type];

    useEffect(() => {
        const timer = setTimeout(onClose, toast.duration);
        return () => clearTimeout(timer);
    }, [toast.duration, onClose]);

    return (
        <div
            role="alert"
            className={`pointer-events-auto flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg animate-in slide-in-from-right-5 fade-in duration-200 ${COLORS[toast.type]}`}
        >
            <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${ICON_COLORS[toast.type]}`} />
            <div className="flex-1 text-sm leading-relaxed break-words">{toast.message}</div>
            <button
                onClick={onClose}
                aria-label="Dismiss"
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
                <X size={16} />
            </button>
        </div>
    );
};

/**
 * useToast hook. Usage:
 *   const toast = useToast();
 *   toast.success('Saved!');
 *   toast.error('Failed: ' + err.message);
 */
export const useToast = (): ToastContextValue => {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        // Fallback so components don't crash if provider is missing. Console-only —
        // never fall back to a native window.alert/confirm dialog.
        return {
            show: (msg, type = 'info') => console.log(`[Toast fallback] ${type}:`, msg),
            success: (msg) => console.log('[Toast success]', msg),
            error: (msg) => console.error('[Toast error]', msg),
            warning: (msg) => console.warn('[Toast warning]', msg),
            info: (msg) => console.info('[Toast info]', msg),
        };
    }
    return ctx;
};
