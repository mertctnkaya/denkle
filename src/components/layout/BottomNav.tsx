import { NavLink } from 'react-router-dom';
import { Icon } from '../shared/Icon';
import type { IconName } from '../shared/Icon';

export const BottomNav = () => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-center w-full pointer-events-none">
      <div className="w-full bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 pb-safe pointer-events-auto shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-center px-6 py-3 relative max-w-md mx-auto">

          <NavItem to="/" icon="home" label="Ana Sayfa" />
          <NavItem to="/parties" icon="users" label="Gruplar" />

          {/* Center Floating Action Button */}
          <div className="relative -top-6">
            <button className="flex items-center justify-center w-14 h-14 bg-primary text-white rounded-full shadow-lg shadow-primary/30 hover:scale-105 transition-transform active:scale-95 cursor-pointer">
              <Icon name="plus" size={28} strokeWidth={2.5} />
            </button>
          </div>

          <NavItem to="/activity" icon="bell" label="Hareketler" />
          <NavItem to="/profile" icon="user" label="Profil" />

        </div>
      </div>
    </div>
  );
};

const NavItem = ({ to, icon, label }: { to: string; icon: IconName; label: string }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center gap-1 transition-colors cursor-pointer ${isActive
          ? 'text-primary'
          : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
        }`
      }
    >
      <Icon name={icon} size={24} />
      <span className="text-[10px] font-medium">{label}</span>
    </NavLink>
  );
};
