import { NavLink } from 'react-router-dom';
import { Icon } from '../shared/Icon';
import { useAuthStore } from '../../store/authStore';

export const TopNav = () => {
  const { profile, user } = useAuthStore();

  const fullName = profile?.full_name || user?.user_metadata?.full_name || 'Kullanıcı';
  const initial = fullName.charAt(0).toUpperCase();
  const displayName = fullName.split(' ')[0];

  return (
    <header className="hidden md:flex items-center justify-between w-full h-16 px-8 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">

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
      <div className="flex items-center gap-4">
        <button className="bg-primary text-white px-5 py-2 rounded-xl font-bold text-sm shadow-md shadow-primary/30 hover:bg-primary-dark active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer">
          <Icon name="plus" size={18} strokeWidth={2.5} />
          Yeni Ekle
        </button>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-2 pl-1.5 pr-4 py-1.5 rounded-full transition-all border cursor-pointer ${isActive
              ? 'bg-primary-light/10 border-primary/20 dark:bg-primary-dark/10 dark:border-primary/20'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80'
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
