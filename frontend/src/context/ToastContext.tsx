import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    const duration = toast.duration || 4500;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  const success = useCallback((title: string, message?: string) => {
    addToast({ type: 'success', title, message });
  }, [addToast]);

  const error = useCallback((title: string, message?: string) => {
    addToast({ type: 'error', title, message });
  }, [addToast]);

  const warning = useCallback((title: string, message?: string) => {
    addToast({ type: 'warning', title, message });
  }, [addToast]);

  const info = useCallback((title: string, message?: string) => {
    addToast({ type: 'info', title, message });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
      {children}
      {/* Accessible Toast Container */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      >
        {toasts.map((toastItem) => (
          <div
            key={toastItem.id}
            role="alert"
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-lg shadow-xl border transition-all duration-200 transform translate-y-0 ${
              toastItem.type === 'success'
                ? 'bg-emerald-950 border-emerald-500/60 text-emerald-100'
                : toastItem.type === 'error'
                ? 'bg-red-950 border-red-500/60 text-red-100'
                : toastItem.type === 'warning'
                ? 'bg-amber-950 border-amber-500/60 text-amber-100'
                : 'bg-brand-navyDark border-brand-gold/50 text-white'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toastItem.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {toastItem.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400" />}
              {toastItem.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {toastItem.type === 'info' && <Info className="w-5 h-5 text-brand-gold" />}
            </div>
            <div className="flex-1 text-sm">
              <p className="font-bold tracking-wide">{toastItem.title}</p>
              {toastItem.message && <p className="mt-0.5 text-xs opacity-90 leading-relaxed">{toastItem.message}</p>}
            </div>
            <button
              onClick={() => removeToast(toastItem.id)}
              aria-label="Dismiss notification"
              className="shrink-0 p-1 opacity-70 hover:opacity-100 transition-opacity rounded focus-visible:ring-1 focus-visible:ring-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
