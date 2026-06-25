import { useState, ReactNode } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  type: ToastType;
  title: string;
  message: string;
}

let toastId = 0;
let externalAddToast: ((type: ToastType, title: string, message: string) => void) | null = null;

export const showToast = (type: ToastType, title: string, message: string) => {
  if (externalAddToast) externalAddToast(type, title, message);
};

const icons = {
  success: <CheckCircle2 className="text-emerald-400 shrink-0" size={20} />,
  error: <XCircle className="text-red-400 shrink-0" size={20} />,
  info: <Info className="text-blue-400 shrink-0" size={20} />,
};

const styles: Record<ToastType, string> = {
  success: 'border-emerald-500/30 bg-emerald-500/10',
  error: 'border-red-500/30 bg-red-500/10',
  info: 'border-blue-500/30 bg-blue-500/10',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (type: ToastType, title: string, message: string) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };

  externalAddToast = addToast;

  return (
    <>
      {children}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 w-80">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              className={`p-4 rounded-2xl border backdrop-blur-2xl bg-slate-900/90 shadow-2xl flex gap-3 items-start ${styles[toast.type]}`}
            >
              {icons[toast.type]}
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm">{toast.title}</p>
                <p className="text-slate-300 text-xs mt-0.5 leading-relaxed">{toast.message}</p>
              </div>
              <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} className="text-slate-500 hover:text-white shrink-0">
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
