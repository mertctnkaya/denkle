import { NavLink } from 'react-router-dom';
import { Icon } from '../shared/Icon';
import { useAuthStore } from '../../store/authStore';
import { useToastStore } from '../../store/toastStore';
import { useThemeStore } from '../../store/themeStore';

export const TopNav = () => {
  const { profile, user, signOut } = useAuthStore();
  const { addToast } = useToastStore();
  const { isDarkMode, toggleTheme } = useThemeStore();

  const fullName = profile?.full_name || user?.user_metadata?.full_name || 'Kullanıcı';
  const initial = fullName.charAt(0).toUpperCase();
  const displayName = fullName.split(' ')[0];

  const handleLogout = async () => {
    try {
      await signOut();
      addToast('Başarıyla çıkış yapıldı.', 'info');
    } catch (error) {
      addToast('Çıkış yapılırken bir hata oluştu.', 'error');
    }
  };

  return (
    <header className="hidden md:flex items-center justify-between w-full h-16 px-8 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-50">

      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center font-bold shadow-md shadow-primary/20">
          D
        </div>
        <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">
          Denkleş.
        </span>
      </div>

      {/* Ortadaki Menü */}
      <nav className="flex items-center gap-8">
        <NavItem to="/" label="Ana Sayfa" />
        <NavItem to="/parties" label="Gruplar" />
        <NavItem to="/activity" label="Hareketler" />
        <NavItem to="/profile" label="Profil" />
      </nav>

      {/* Sağ Taraf Aksiyonlar */}
      <div className="flex items-center gap-3">
        {/* Tema Değiştirme Butonu */}
        <button
          onClick={toggleTheme}
          title={isDarkMode ? "Açık Temaya Geç" : "Koyu Temaya Geç"}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-200/50 dark:bg-slate-800 transition-all hover:scale-105 active:scale-95 cursor-pointer mr-2 border border-slate-300/50 dark:border-slate-700"
        >
          {isDarkMode ? (
            <Icon name="moon" size={20} className="text-indigo-400" />
          ) : (
            <Icon name="sun" size={20} className="text-amber-500" />
          )}
        </button>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-2 pl-1.5 pr-4 py-1.5 rounded-full transition-all border cursor-pointer ${isActive
              ? 'bg-primary-light/50 border-primary/20 dark:bg-primary-dark/10 dark:border-primary/20'
              : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-200/50 dark:hover:bg-slate-700/80'
            }`
          }
        >
          <div className="w-7 h-7 bg-primary-light dark:bg-primary-dark/30 rounded-full flex items-center justify-center text-primary font-bold text-xs uppercase">
            {initial}
          </div>
          <span className="font-semibold text-sm text-slate-700 dark:text-slate-200">
            {displayName}
          </span>
        </NavLink>

        <button
          onClick={handleLogout}
          title="Çıkış Yap"
          className="w-10 h-10 rounded-full flex items-center justify-center bg-transparent border-2 border-danger text-danger hover:bg-danger hover:text-white transition-all cursor-pointer group"
        >
          <Icon name="logout" size={18} className="text-danger group-hover:text-white transition-colors" />
        </button>
      </div>

    </header>
  );
};

const NavItem = ({ to, label }: { to: string; label: string }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `font-semibold text-sm transition-colors ${isActive
          ? 'text-primary'
          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
        }`
      }
    >
      {label}
    </NavLink>
  );
};
