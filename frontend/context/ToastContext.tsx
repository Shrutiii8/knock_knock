'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  showToast: (type: ToastType, title: string, message?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, title, message }]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      
      {/* ARIA Live Region Toast Container */}
      <div 
        aria-live="polite" 
        aria-atomic="true"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full"
      >
        <AnimatePresence>
          {toasts.map(toast => {
            const icons = {
              success: <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />,
              error: <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />,
              warning: <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />,
              info: <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
            };

            const borderColors = {
              success: 'border-l-4 border-green-600',
              error: 'border-l-4 border-red-600',
              warning: 'border-l-4 border-amber-500',
              info: 'border-l-4 border-blue-600'
            };

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                className={`pointer-events-auto bg-white shadow-xl rounded-md p-3.5 flex items-start justify-between border border-gray-200 ${borderColors[toast.type]}`}
              >
                <div className="flex items-start gap-3 pr-2">
                  {icons[toast.type]}
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{toast.title}</div>
                    {toast.message && (
                      <div className="text-xs text-gray-600 mt-0.5">{toast.message}</div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-gray-400 hover:text-gray-600 p-0.5 rounded transition-colors"
                  aria-label="Close notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
