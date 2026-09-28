import { useNavigate } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';

export const Home = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { profile, user } = useAuthStore();

  const fullName = profile?.full_name || user?.user_metadata?.full_name;
  const initial = fullName ? fullName.charAt(0).toUpperCase() : 'K';
  const displayName = fullName ? fullName.split(' ')[0] : 'Kullanıcı';

  return (
    <div className="p-6 md:p-0 pt-12 md:pt-6">
      {/* Üst Karşılama Alanı */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-sm text-slate-500 font-medium mb-1">Hoş geldin, {displayName}</p>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Hesaplar Denk! 🎉</h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Sadece mobilde görünen profil butonu (Desktop'ta TopNav'da profil var) */}
          <button
            onClick={() => navigate('/profile')}
            className="md:hidden w-12 h-12 bg-primary-light dark:bg-primary-dark/30 rounded-full flex items-center justify-center text-primary font-bold text-lg border-2 border-white dark:border-slate-800 shadow-sm uppercase cursor-pointer hover:scale-105 active:scale-95 transition-all"
          >
            {initial}
          </button>
        </div>
      </div>

      {/* Özet Kartı */}
      <div className="soft-card bg-linear-to-br from-primary to-primary-dark text-white border-0 p-6 md:p-8 rounded-3xl mb-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-primary-light text-sm font-medium mb-1">Toplam Alacağın</p>
            <h2 className="text-4xl font-bold tracking-tight">₺450.00</h2>
          </div>
          <span className="bg-white/20 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm">
            Net Pozitif
          </span>
        </div>
        <div className="flex gap-4">
          <button className="flex-1 bg-white text-primary py-3 rounded-xl font-bold text-sm hover:bg-slate-50 active:scale-95 transition-all cursor-pointer">
            Hesap İste
          </button>
          <button className="flex-1 bg-primary-dark/50 text-white py-3 rounded-xl font-bold text-sm hover:bg-primary-dark active:scale-95 transition-all cursor-pointer">
            Ben Ödedim
          </button>
        </div>
      </div>

      {/* Son Hareketler */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Son Hareketler</h3>
        <button className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors cursor-pointer hidden md:block">
          Tümünü Gör
        </button>
      </div>

      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="soft-card p-4 flex items-center justify-between hover:scale-[1.02] cursor-pointer bg-white dark:bg-card-dark rounded-2xl border border-slate-100 dark:border-slate-800/50 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning-light text-warning-dark rounded-full flex items-center justify-center font-bold text-xl shrink-0">
                🍕
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-900 dark:text-white">Dün Geceki Pizza</p>
                <p className="text-xs text-slate-500 mt-0.5">Ev Grubu • Ahmet ekledi</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-danger text-sm">-₺120.00</p>
              <p className="text-[10px] text-slate-400 font-medium mt-1">Ödenmedi</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
