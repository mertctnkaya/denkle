import { useToastStore } from '../../store/toastStore';
import type { ToastType, ToastMessage } from '../../store/toastStore';
import { Icon } from './Icon';

// Sadece border ve özel hafif vurgular, arkaplan tamamen mat (solid) olacak
const toastStyles: Record<ToastType, string> = {
  success: 'border-emerald-200 dark:border-emerald-500/30',
  error: 'border-danger-200 dark:border-danger-500/30',
  warning: 'border-warning/30 dark:border-warning-dark/30',
  info: 'border-primary/30 dark:border-primary/30',
};

const toastIcons: Record<ToastType, React.ReactNode> = {
  success: <Icon name="success" size={20} className="text-emerald-500 dark:text-emerald-400 shrink-0" />,
  error: <Icon name="error" size={20} className="text-danger-500 dark:text-danger-400 shrink-0" />,
  warning: <Icon name="warning" size={20} className="text-warning-dark dark:text-warning shrink-0" />,
  info: <Icon name="info" size={20} className="text-primary-dark dark:text-primary-light shrink-0" />,
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    // items-center ile içindeki toastların ekranı kaplamayıp içeriği kadar (inline) yer kaplamasını sağlıyoruz
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 w-full max-w-md pointer-events-none px-4">
      {toasts.map((toast: ToastMessage) => (
        <div
          key={toast.id}
          className={`
            pointer-events-auto w-auto max-w-full
            inline-flex items-center gap-3 py-3 px-5 rounded-2xl border shadow-xl
            bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100
            animate-in slide-in-from-top-4 fade-in duration-300
            ${toastStyles[toast.type]}
          `}
          onClick={() => removeToast(toast.id)}
          role="alert"
        >
          {toastIcons[toast.type]}
          <p className="text-sm font-semibold leading-snug wrap-break-word">
            {toast.message}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeToast(toast.id);
            }}
            className="shrink-0 opacity-50 hover:opacity-100 transition-opacity ml-1 cursor-pointer"
          >
            <Icon name="close" size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
