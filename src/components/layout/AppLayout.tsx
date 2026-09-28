import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { TopNav } from './TopNav';

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col items-center transition-colors duration-300">

      {/* Üst Menü (Sadece Desktop) */}
      <TopNav />

      {/* Ana İçerik Alanı (Maksimum genişlikte ortalanmış) */}
      <main className="flex-1 w-full max-w-2xl px-0 md:px-6 py-0 md:py-6 pb-24 md:pb-12 overflow-y-auto">
        <Outlet />
      </main>

      {/* Alt Menü (Sadece Mobil) */}
      <BottomNav />

    </div>
  );
};
