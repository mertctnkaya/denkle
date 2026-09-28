import { useToastStore } from '../../store/toastStore';
import type { ToastType } from '../../store/toastStore';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const toastStyles: Record<ToastType, string> = {
  success: 'bg-success-light dark:bg-success-dark/20 text-success-dark dark:text-success-light border-success/20',
  error: 'bg-danger-light dark:bg-danger-dark/20 text-danger-dark dark:text-danger-light border-danger/20',
  warning: 'bg-warning-light dark:bg-warning-dark/20 text-warning-dark dark:text-warning-light border-warning/20',
  info: 'bg-primary-light dark:bg-primary-dark/20 text-primary-dark dark:text-primary-light border-primary/20',
};

const ToastIcon = ({ type }: { type: ToastType }) => {
  switch (type) {
    case 'success': return <CheckCircle2 size={20} />;
    case 'error': return <AlertCircle size={20} />;
    case 'warning': return <AlertTriangle size={20} />;
    case 'info': return <Info size={20} />;
  }
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-safe pt-4 left-0 right-0 z-100 flex flex-col items-center gap-2 pointer-events-none px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          onClick={() => removeToast(toast.id)}
          className={`
            pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-lg cursor-pointer
            w-full max-w-sm animate-in slide-in-from-top-4 fade-in duration-300
            ${toastStyles[toast.type]}
          `}
        >
          <div className="shrink-0">
            <ToastIcon type={toast.type} />
          </div>
          <p className="flex-1 text-sm font-semibold">{toast.message}</p>
          <button
            onClick={(e) => { e.stopPropagation(); removeToast(toast.id); }}
            className="opacity-50 hover:opacity-100 transition-opacity"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
