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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors selection:bg-primary/20 flex flex-col">

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
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
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

      {/* Ana İçerik (Hero Section) */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-5xl mx-auto w-full text-center relative">

        {/* Arkaplan Dekorasyonları (Desktop & Mobile Uyumlu) */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/20 blur-[100px] rounded-full pointer-events-none -z-10" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-warning/20 blur-[100px] rounded-full pointer-events-none -z-10" />

        {inviter ? (
          // DAVETLİ (SHADOW PROFILE) GÖRÜNÜMÜ
          <div className="max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-20 h-20 bg-primary-light dark:bg-primary-dark/30 text-primary rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white dark:border-slate-900 shadow-xl">
              <Users size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight leading-tight">
              <span className="text-primary">{inviter}</span> seni davet etti!
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 font-medium">
              "{groupName}" grubundaki ortak masrafları bölüşmek için hemen katıl.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => alert('Misafir girişi altyapısı hazırlanıyor...')} // Daha sonra anonim auth'a bağlanacak
                className="w-full py-4 cursor-pointer bg-primary text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary/30 hover:bg-primary-dark active:scale-[0.98] transition-all flex justify-center items-center gap-2"
              >
                Hemen Başla (Misafir)
                <ArrowRight size={20} />
              </button>
              <button
                onClick={() => navigate('/auth')}
                className="w-full py-4 cursor-pointer bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 rounded-2xl font-bold text-lg shadow-sm border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] transition-all"
              >
                Kayıt Ol & Giriş Yap
              </button>
            </div>

            <div className="mt-6 flex items-start gap-2 text-left bg-warning-light/30 dark:bg-warning-dark/10 p-4 rounded-xl border border-warning/20">
              <Icon name="info" className="text-warning-dark dark:text-warning-light shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                Misafir olarak başlarsan, ileride dilediğin zaman kayıt olarak tüm geçmişini ve verilerini kalıcı hale getirebilirsin.
              </p>
            </div>
          </div>
        ) : (
          // ORGANİK (NORMAL) GÖRÜNÜM
          <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <span className="inline-block py-1.5 px-4 rounded-full bg-primary-light dark:bg-primary-dark/30 text-primary-dark dark:text-primary-light text-xs font-bold tracking-wide mb-6">
              HESAPLAŞMANIN EN KOLAY YOLU
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
              Kim kime ne ödeyecek <br className="hidden md:block" /> derdine <span className="text-primary">son ver.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-10 font-medium max-w-lg mx-auto">
              Tatil, ev arkadaşlığı veya akşam yemeği... Ortak masrafları gir, Denkleş senin için kimin ne kadar borcu olduğunu hesaplasın.
            </p>

            <button
              onClick={() => navigate('/auth')}
              className="px-10 py-5 cursor-pointer bg-primary text-white rounded-full font-bold text-xl shadow-xl shadow-primary/30 hover:bg-primary-dark hover:-translate-y-1 active:translate-y-0 transition-all flex items-center gap-2 mx-auto"
            >
              Ücretsiz Başla
              <ArrowRight size={24} />
            </button>
          </div>
        )}

        {/* Özellikler (Sadece organik görünümde veya aşağı kaydırınca) */}
        {!inviter && (
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl text-left border-t border-slate-200 dark:border-slate-800 pt-16">
            <FeatureCard
              icon={<PieChart size={24} />}
              title="Zekice Bölüşüm"
              desc="Kimisi eksi yedi, kimisi fazla verdi. Algoritmamız en az işlemle borçları sadeleştirir."
            />
            <FeatureCard
              icon={<Users size={24} />}
              title="Kayıtsız Katılım"
              desc="Arkadaşlarına link at, uygulama indirmeden saniyeler içinde hesaba dahil olsunlar."
            />
            <FeatureCard
              icon={<Wallet size={24} />}
              title="Tamamen Ücretsiz"
              desc="Gizli ücret yok, premium dayatması yok. Tüm temel hesaplaşma özellikleri bedava."
            />
          </div>
        )}

      </main>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="bg-white dark:bg-card-dark p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
    <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 text-primary rounded-2xl flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{desc}</p>
  </div>
);
