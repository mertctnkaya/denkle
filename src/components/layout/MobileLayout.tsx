import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export const MobileLayout = () => {
  return (
    // Dış katman: Tüm ekranı kaplar ve içindeki container'ı ortalar. 
    // Masaüstü (Web) için arkaplanı hafif gri/desenli yapıyoruz.
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex justify-center selection:bg-primary/20">

      {/* İç katman (Telefon Ekranı Simülasyonu): max-w-md ile mobil genişlikte sabitlenir */}
      <div className="w-full max-w-md bg-background-light dark:bg-background-dark min-h-screen relative shadow-2xl overflow-x-hidden flex flex-col">

        {/* Sayfa İçerikleri (Outlet) */}
        <main className="flex-1 pb-24 overflow-y-auto custom-scrollbar">
          <Outlet />
        </main>

        {/* Alt Navigasyon */}
        <BottomNav />
      </div>
    </div>
  );
};
