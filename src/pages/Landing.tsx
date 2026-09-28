import { useNavigate, useSearchParams } from 'react-router-dom';
import { useThemeStore } from '../store/themeStore';
import { Sun, Moon, ArrowRight, Users, PieChart, Wallet } from 'lucide-react';
import { Icon } from '../components/shared/Icon';

export const Landing = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isDarkMode, toggleTheme } = useThemeStore();

  // Örn: denkles.vercel.app/?inviter=Mert
  const inviter = searchParams.get('inviter');
  const groupName = searchParams.get('group') || 'Ortak Hesap';

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 transition-colors selection:bg-primary/20 flex flex-col">

      {/* Üst Navigasyon (Sadece Landing İçin) */}
      <nav className="w-full px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center font-bold text-lg">
            D
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Denkleş.
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={() => navigate('/auth')}
            className="text-sm font-bold cursor-pointer text-primary hover:text-primary-dark transition-colors"
          >
            Giriş Yap
          </button>
        </div>
      </nav>

      {/* Ana İçerik */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 md:py-24 text-center max-w-3xl mx-auto w-full">

        {/* Davet Kartı (Eğer inviter parametresi varsa) */}
        {inviter && (
          <div className="mb-8 p-4 md:p-6 bg-white dark:bg-card-dark rounded-3xl border border-primary/20 shadow-lg shadow-primary/5 animate-fade-in inline-flex flex-col items-center">
            <div className="w-12 h-12 bg-primary-light text-primary rounded-full flex items-center justify-center mb-3">
              <Icon name="users" size={24} />
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base">
              <strong className="text-slate-900 dark:text-white">{inviter}</strong> seni
              <strong className="text-slate-900 dark:text-white"> {groupName}</strong> grubuna davet etti!
            </p>
          </div>
        )}

        {/* Hero Sloganı */}
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
          Hesapları Bölüşmenin <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-primary-dark">
            En Adaletli Yolu.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-10 max-w-xl">
          Ev arkadaşlarınla, tatilde veya ofiste kimin kime ne kadar borcu olduğunu saniyeler içinde hesapla.
        </p>

        {/* Hemen Başla Butonu */}
        <button
          onClick={() => navigate('/auth')}
          className="w-full md:w-auto px-8 py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary-dark active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/30 mb-6 cursor-pointer"
        >
          Hemen Başla
          <ArrowRight size={20} />
        </button>

        <p className="text-xs text-slate-400 dark:text-slate-500">
          Denkleş'i denemek tamamen ücretsizdir. <br className="md:hidden" /> Kredi kartı gerekmez.
        </p>
      </main>

      {/* Özellikler Grid (Masaüstü için güzel durur) */}
      <section className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-16 md:py-24 px-6 w-full">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6 rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="w-14 h-14 bg-primary-light dark:bg-primary-dark/30 text-primary rounded-2xl flex items-center justify-center mb-4">
              <Users size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Gruplar Oluştur</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Tatil, ev veya ofis için farklı gruplar kur, herkesi tek bir yere topla.</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="w-14 h-14 bg-success-light dark:bg-success-dark/30 text-success-dark dark:text-success rounded-2xl flex items-center justify-center mb-4">
              <PieChart size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Matematiği Bize Bırak</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Karmaşık borç ağlarını anında sadeleştirir. "Kim kime ne verecek?" derdi biter.</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="w-14 h-14 bg-warning-light dark:bg-warning-dark/30 text-warning-dark dark:text-warning rounded-2xl flex items-center justify-center mb-4">
              <Wallet size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Hesapları Kapat</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">IBAN veya Papara kopyala, ödemeni yap ve tek tuşla "Ödedim" diyerek hesabı kapat.</p>
          </div>
        </div>
      </section>

    </div>
  );
};
