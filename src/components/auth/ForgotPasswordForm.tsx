import { useState } from 'react';
import { Mail, Loader2 } from 'lucide-react';

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => void;
  loading: boolean;
  onCancel: () => void;
}

export const ForgotPasswordForm = ({ onSubmit, loading, onCancel }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email);
  };

  return (
    <>
      <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
          Şifremi Unuttum<span className="text-primary">.</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
          E-posta adresini gir, sana şifreni sıfırlaman için bir bağlantı gönderelim.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Mail size={20} />
          </div>
          <input
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white placeholder:text-slate-400"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary/30 hover:bg-primary-dark active:scale-[0.98] transition-all disabled:opacity-70 flex justify-center items-center mt-2 cursor-pointer"
        >
          {loading ? <Loader2 className="animate-spin" size={24} /> : 'Sıfırlama Linki Gönder'}
        </button>
      </form>

      <div className="mt-8 text-center animate-in fade-in duration-500 delay-200">
        <button
          onClick={onCancel}
          type="button"
          className="text-slate-500 font-bold hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          Giriş Ekranına Dön
        </button>
      </div>
    </>
  );
};
