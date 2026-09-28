import { useState } from 'react';
import { Mail, Lock, Loader2 } from 'lucide-react';

interface LoginFormProps {
  onSubmit: (email: string, pass: string) => void;
  loading: boolean;
  onSwitchMode: () => void;
  onForgotPassword: () => void;
}

export const LoginForm = ({ onSubmit, loading, onSwitchMode, onForgotPassword }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <>
      <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
          Denkleş<span className="text-primary">.</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Hesaplaşmaya kaldığın yerden devam et.
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

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Lock size={20} />
          </div>
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white placeholder:text-slate-400"
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm font-bold text-slate-500 hover:text-primary transition-colors cursor-pointer"
          >
            Şifremi Unuttum
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary/30 hover:bg-primary-dark active:scale-[0.98] transition-all disabled:opacity-70 flex justify-center items-center mt-2 cursor-pointer"
        >
          {loading ? <Loader2 className="animate-spin" size={24} /> : 'Giriş Yap'}
        </button>
      </form>

      <div className="mt-8 text-center animate-in fade-in duration-500 delay-200">
        <p className="text-slate-500 text-sm font-medium">
          Henüz hesabın yok mu?
        </p>
        <button
          onClick={onSwitchMode}
          type="button"
          className="mt-2 text-primary font-bold hover:text-primary-dark transition-colors cursor-pointer"
        >
          Hemen Kayıt Ol
        </button>
      </div>
    </>
  );
};
