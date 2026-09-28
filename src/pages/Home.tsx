import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

export const Home = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();

  return (
    <div className="p-6 pt-12">
      {/* Üst Karşılama Alanı */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-sm text-slate-500 font-medium mb-1">Günaydın, Mert</p>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Hesaplar Denk! 🎉</h1>
        </div>
        <div className="flex items-center gap-3">
          {/* Tema Değiştirici Buton */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div className="w-12 h-12 bg-primary-light dark:bg-primary-dark/30 rounded-full flex items-center justify-center text-primary font-bold text-lg border-2 border-white dark:border-slate-800 shadow-sm">
            M
          </div>
        </div>
      </div>

      {/* Özet Kartı (Soft Card) */}
      <div className="soft-card bg-linear-to-br from-primary to-primary-dark text-white mb-8 border-0">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-primary-light text-sm font-medium mb-1">Toplam Alacağın</p>
            <h2 className="text-3xl font-bold">₺450.00</h2>
          </div>
          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
            Net Pozitif
          </span>
        </div>
        <div className="flex gap-4">
          <button className="flex-1 bg-white text-primary py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-50 active:scale-95 transition-all">
            Hesap İste
          </button>
          <button className="flex-1 bg-primary-dark/50 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-dark active:scale-95 transition-all">
            Ben Ödedim
          </button>
        </div>
      </div>

      {/* Bekleyen Paylaşımlar (Dummy) */}
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Son Hareketler</h3>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="soft-card p-4 flex items-center justify-between hover:scale-[1.02] cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-warning-light text-warning-dark rounded-full flex items-center justify-center font-bold">
                🍕
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-900 dark:text-white">Dün Geceki Pizza</p>
                <p className="text-xs text-slate-500">Ev Grubu • Ahmet ekledi</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-danger text-sm">-₺120.00</p>
              <p className="text-[10px] text-slate-400 font-medium">Ödenmedi</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
