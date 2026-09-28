import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Icon } from '../components/shared/Icon';

export const Home = () => {
  const navigate = useNavigate();
  const { profile, user } = useAuthStore();

  const fullName = profile?.full_name || user?.user_metadata?.full_name;
  const initial = fullName ? fullName.charAt(0).toUpperCase() : 'K';
  const displayName = fullName ? fullName.split(' ')[0] : 'Kullanıcı';

  // İleride veritabanından gelecek örnek veriler (Mock Data)
  const parties = [
    { id: 1, name: 'Ev Arkadaşları', emoji: '🏠', balance: -340, members: 3 },
    { id: 2, name: 'İzmir Tatili', emoji: '🌴', balance: 850, members: 5 },
    { id: 3, name: 'Ofis Kahve', emoji: '☕', balance: 0, members: 8 },
  ];

  const recentShares = [
    { id: 1, title: 'Migros Alışverişi', group: 'Ev Arkadaşları', emoji: '🛒', amount: -340, status: 'Ödeyeceksin', isDebt: true, time: '2 saat önce' },
    { id: 2, title: 'Shell Yakıt', group: 'İzmir Tatili', emoji: '⛽', amount: 450, status: 'Alacaksın', isDebt: false, time: 'Dün' },
    { id: 3, title: 'Akşam Pizzası', group: 'Ev Arkadaşları', emoji: '🍕', amount: -120, status: 'Ödeyeceksin', isDebt: true, time: 'Dün' },
    { id: 4, title: 'Airbnb Kapora', group: 'İzmir Tatili', emoji: '🏡', amount: 400, status: 'Alacaksın', isDebt: false, time: '3 gün önce' },
  ];

  return (
    <div className="p-6 md:p-0 pt-12 md:pt-6">
      {/* Üst Karşılama Alanı */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-sm text-slate-500 font-medium mb-1">Hoş geldin, {displayName}</p>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Hesaplar Denk! 🎉</h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/profile')}
            className="md:hidden w-12 h-12 bg-primary-light dark:bg-primary-dark/30 rounded-full flex items-center justify-center text-primary font-bold text-lg border-2 border-white dark:border-slate-800 shadow-sm uppercase cursor-pointer hover:scale-105 active:scale-95 transition-all"
          >
            {initial}
          </button>
        </div>
      </div>

      {/* Finansal Özet Kartı (Koyu Modern Tasarım) */}
      <div className="soft-card bg-linear-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 text-white border-0 p-6 md:p-8 rounded-3xl mb-8 relative overflow-hidden shadow-xl shadow-slate-900/10">
        {/* Dekoratif Arkaplan Bulanıklıkları */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-success/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-row items-center justify-between mb-8">
          <div className="flex-1">
            <p className="text-slate-400 text-sm font-medium mb-1">Alacağın</p>
            <h2 className="text-2xl md:text-3xl font-bold text-success-light">₺850.00</h2>
          </div>
          <div className="w-px h-12 bg-slate-700 mx-4"></div>
          <div className="flex-1 text-right">
            <p className="text-slate-400 text-sm font-medium mb-1">Ödeyeceğin</p>
            <h2 className="text-2xl md:text-3xl font-bold text-danger-light">₺460.00</h2>
          </div>
        </div>

        <div className="relative z-10 flex gap-4">
          <button className="flex-1 bg-primary text-white py-3.5 rounded-xl font-bold text-sm hover:bg-primary-dark active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-primary/25 flex items-center justify-center gap-2">
            <Icon name="plus" size={18} strokeWidth={2.5} />
            Ben Ödedim
          </button>
          <button className="flex-1 bg-white/10 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-white/20 active:scale-[0.98] transition-all cursor-pointer backdrop-blur-md">
            Hızlı Paylaş
          </button>
        </div>
      </div>

      {/* Partilerim (Gruplar) - Yatay Kaydırma */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Gruplarım</h3>
          <button
            onClick={() => navigate('/parties')}
            className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors cursor-pointer"
          >
            Tümünü Gör
          </button>
        </div>

        <div className="flex overflow-x-auto gap-4 pb-4 custom-scrollbar snap-x -mx-6 px-6 md:mx-0 md:px-0">

          {/* Yeni Grup Ekle Butonu */}
          <div className="snap-start shrink-0 w-32 h-40 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full flex items-center justify-center">
              <Icon name="plus" size={24} />
            </div>
            <span className="font-semibold text-sm text-slate-500">Yeni Grup</span>
          </div>

          {/* Mevcut Gruplar */}
          {parties.map((party) => (
            <div key={party.id} className="snap-start shrink-0 w-36 h-40 soft-card bg-white dark:bg-card-dark rounded-3xl border border-slate-200/60 dark:border-slate-800/50 shadow-sm p-4 flex flex-col justify-between cursor-pointer hover:scale-[1.02] active:scale-95 transition-all group">
              <div className="flex justify-between items-start">
                <div className="text-3xl group-hover:scale-110 transition-transform origin-bottom-left">{party.emoji}</div>
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                  <Icon name="users" size={12} className="text-slate-500" />
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">{party.members}</span>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 mb-1">{party.name}</h4>
                <p className={`text-xs font-bold ${party.balance > 0 ? 'text-success' : party.balance < 0 ? 'text-danger' : 'text-slate-500'}`}>
                  {party.balance > 0 ? `+₺${party.balance}` : party.balance < 0 ? `-₺${Math.abs(party.balance)}` : 'Denk!'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Aktif Paylaşımlar */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Aktif Paylaşımlar</h3>
        <button
          onClick={() => navigate('/activity')}
          className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors cursor-pointer hidden md:block"
        >
          Tümünü Gör
        </button>
      </div>

      <div className="space-y-3">
        {recentShares.map((share) => (
          <div key={share.id} className="soft-card p-4 flex items-center justify-between hover:scale-[1.02] cursor-pointer bg-white dark:bg-card-dark rounded-2xl border border-slate-200/60 dark:border-slate-800/50 shadow-sm group">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0 ${share.isDebt ? 'bg-danger-light/50 dark:bg-danger-dark/20' : 'bg-success-light/50 dark:bg-success-dark/20'}`}>
                {share.emoji}
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-primary transition-colors">{share.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{share.group} • {share.time}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-bold text-sm ${share.isDebt ? 'text-danger' : 'text-success'}`}>
                {share.isDebt ? '-' : '+'}₺{Math.abs(share.amount).toFixed(2)}
              </p>
              <p className="text-[10px] text-slate-400 font-medium mt-1">{share.status}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
