import { useState } from 'react';
import { Mail, Lock, User as UserIcon, Loader2 } from 'lucide-react';

interface RegisterFormProps {
  onSubmit: (name: string, email: string, pass: string) => void;
  loading: boolean;
  onSwitchMode: () => void;
}

export const RegisterForm = ({ onSubmit, loading, onSwitchMode }: RegisterFormProps) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(fullName, email, password);
  };

  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
          Denkleş<span className="text-primary">.</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Arkadaşlarına hemen katıl.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <UserIcon size={20} />
          </div>
          <input
            type="text"
            placeholder="Görünen İsim"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white placeholder:text-slate-400"
            required
          />
        </div>

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

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary/30 hover:bg-primary-dark active:scale-[0.98] transition-all disabled:opacity-70 flex justify-center items-center mt-2"
        >
          {loading ? <Loader2 className="animate-spin" size={24} /> : 'Kayıt Ol'}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-slate-500 text-sm font-medium">
          Zaten bir hesabın var mı?
        </p>
        <button
          onClick={onSwitchMode}
          type="button"
          className="mt-2 text-primary font-bold hover:text-primary-dark transition-colors"
        >
          Giriş Yap
        </button>
      </div>
    </>
  );
};
