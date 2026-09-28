import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useToastStore } from '../store/toastStore';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { ForgotPasswordForm } from '../components/auth/ForgotPasswordForm';
import { Icon } from '../components/shared/Icon';

export const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot_password'>('login');
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
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) throw error;

      const name = data.user?.user_metadata?.full_name?.split(' ')[0];
      addToast(name ? `Hoş geldin, ${name}! 👋` : 'Başarıyla giriş yapıldı!', 'success');
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.includes('Invalid login credentials')) {
        addToast('E-posta veya şifre hatalı.', 'error');
      } else if (msg.includes('Email not confirmed')) {
        addToast('Lütfen e-posta adresinizi doğrulayın.', 'error');
      } else {
        addToast('Giriş yapılamadı. Lütfen tekrar deneyin.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (fullName: string, email: string, pass: string) => {
    if (fullName.trim().length < 3) {
      addToast('Lütfen geçerli bir görünen isim giriniz.', 'warning');
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

      const name = fullName.trim().split(' ')[0];
      addToast(`Aramıza hoş geldin, ${name}! 🎉`, 'success');
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.includes('already registered')) {
        addToast('Bu e-posta adresi zaten kayıtlı.', 'error');
      } else {
        addToast('Kayıt olunamadı. Lütfen tekrar deneyin.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (email: string) => {
    if (!isValidEmail(email)) {
      addToast('Geçerli bir e-posta adresi giriniz.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      if (error) throw error;

      addToast('Şifre sıfırlama bağlantısı e-postana gönderildi!', 'success');
      setMode('login'); // Link yollandıktan sonra giriş ekranına dön.
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.includes('over_email_send_rate_limit')) {
        addToast('Çok fazla istek attınız, lütfen biraz bekleyin.', 'warning');
      } else {
        addToast('Bağlantı gönderilemedi. Lütfen tekrar deneyin.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col p-6 relative overflow-hidden">

      {/* Üst Geri Butonu */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-20 w-10 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white shadow-sm transition-colors cursor-pointer"
      >
        <Icon name="back" size={20} />
      </button>

      {/* Arkaplan Dekorasyonları */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-primary/20 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-warning/20 blur-[80px] rounded-full pointer-events-none" />

      <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto z-10">
        {mode === 'login' && (
          <LoginForm
            onSubmit={handleLogin}
            loading={loading}
            onSwitchMode={() => setMode('register')}
            onForgotPassword={() => setMode('forgot_password')}
          />
        )}
        {mode === 'register' && (
          <RegisterForm
            onSubmit={handleRegister}
            loading={loading}
            onSwitchMode={() => setMode('login')}
          />
        )}
        {mode === 'forgot_password' && (
          <ForgotPasswordForm
            onSubmit={handleForgotPassword}
            loading={loading}
            onCancel={() => setMode('login')}
          />
        )}
      </div>
    </div>
  );
};
