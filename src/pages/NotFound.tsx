import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/shared/Icon';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      
      {/* Dekorasyon */}
      <div className="absolute top-[20%] left-[-10%] w-64 h-64 bg-danger/10 blur-[80px] rounded-full pointer-events-none" />

      <div className="w-24 h-24 bg-danger-light dark:bg-danger-dark/20 text-danger dark:text-danger-light rounded-full flex items-center justify-center mb-6 shadow-sm border border-danger/10">
        <Icon name="warning" size={48} />
      </div>
      
      <h1 className="text-6xl font-bold text-slate-900 dark:text-white mb-2 tracking-tighter">
        404
      </h1>
      
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">
        Kaybolduk!
      </h2>
      
      <p className="text-slate-500 mb-8 max-w-xs font-medium leading-relaxed">
        Aradığın sayfayı bulamadık. Ya fatura çoktan ödendi, ya da yanlış gruptasın.
      </p>
      
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 bg-primary text-white px-6 py-4 rounded-2xl font-bold hover:bg-primary-dark transition-all active:scale-95 shadow-lg shadow-primary/30"
      >
        <Icon name="home" size={20} />
        Ana Sayfaya Dön
      </button>

    </div>
  );
};
