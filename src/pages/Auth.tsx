import { useState } from 'react';
import { supabase } from '../services/supabase';
import { useToastStore } from '../store/toastStore';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';

export const Auth = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToastStore();

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async (email: string, pass: string) => {
    if (!isValidEmail(email)) {
      addToast('Geçerli bir e-posta adresi giriniz.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) throw error;
      addToast('Başarıyla giriş yapıldı!', 'success');
    } catch (err: any) {
      if (err.message.includes('Invalid login credentials')) {
        addToast('E-posta veya şifre hatalı.', 'error');
      } else {
        addToast(err.message || 'Giriş yapılamadı.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (fullName: string, email: string, pass: string) => {
    if (fullName.trim().length < 3) {
      addToast('Lütfen geçerli bir ad soyad giriniz.', 'warning');
      return;
    }
    if (!isValidEmail(email)) {
      addToast('Geçerli bir e-posta adresi giriniz.', 'warning');
      return;
    }
    if (pass.length < 6) {
      addToast('Şifre en az 6 karakter olmalıdır.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: { full_name: fullName.trim() },
        },
      });
      if (error) throw error;
      addToast('Aramıza hoş geldin!', 'success');
    } catch (err: any) {
      if (err.message.includes('already registered')) {
        addToast('Bu e-posta adresi zaten kayıtlı.', 'error');
      } else {
        addToast(err.message || 'Kayıt olunamadı.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col p-6 relative overflow-hidden">
      {/* Arkaplan Dekorasyonları */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-primary/20 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-warning/20 blur-[80px] rounded-full pointer-events-none" />

      <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto z-10">
        {mode === 'login' ? (
          <LoginForm
            onSubmit={handleLogin}
            loading={loading}
            onSwitchMode={() => setMode('register')}
          />
        ) : (
          <RegisterForm
            onSubmit={handleRegister}
            loading={loading}
            onSwitchMode={() => setMode('login')}
          />
        )}
      </div>
    </div>
  );
};
