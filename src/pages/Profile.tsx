import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { Icon } from '../components/shared/Icon';
import type { IconName } from '../components/shared/Icon';

export const Profile = () => {
  const navigate = useNavigate();
  const { profile, user, signOut } = useAuthStore();
  const { addToast } = useToastStore();

  const fullName = profile?.full_name || user?.user_metadata?.full_name || 'Kullanıcı';
  const initial = fullName.charAt(0).toUpperCase();
  const email = user?.email || 'e-posta bulunamadı';

  const handleLogout = async () => {
    try {
      await signOut();
      addToast('Başarıyla çıkış yapıldı.', 'info');
      // signOut sonrasında App.tsx isAuthenticated=false olacağı için ana sayfaya/landing'e düşeriz.
    } catch (error) {
      addToast('Çıkış yapılırken bir hata oluştu.', 'error');
    }
  };

  const menuItems: { icon: IconName; title: string; subtitle?: string }[] = [
    { icon: 'user', title: 'Hesap Bilgileri', subtitle: 'İsim, e-posta ve şifre' },
    { icon: 'card', title: 'Ödeme Yöntemleri', subtitle: 'IBAN ve Papara ekle' },
    { icon: 'bell', title: 'Bildirimler', subtitle: 'Push bildirim ayarları' },
    { icon: 'shield', title: 'Gizlilik ve Güvenlik', subtitle: 'Veri tercihleri' },
    { icon: 'help', title: 'Yardım ve Destek', subtitle: 'Sık sorulan sorular' },
  ];

  return (
    <div className="p-6 pt-12 pb-24 max-w-lg mx-auto">
      {/* Üst Kısım: Başlık */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <Icon name="back" size={20} />
        </button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profil</h1>
      </div>

      {/* Profil Kartı */}
      <div className="bg-white dark:bg-card-dark rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm mb-6 flex items-center gap-5">
        <div className="w-16 h-16 bg-primary-light dark:bg-primary-dark/30 rounded-2xl flex items-center justify-center text-primary font-bold text-3xl border-2 border-white dark:border-slate-800 shadow-sm shrink-0 uppercase">
          {initial}
        </div>
        <div className="overflow-hidden">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white truncate">{fullName}</h2>
          <p className="text-sm text-slate-500 font-medium truncate">{email}</p>
        </div>
      </div>

      {/* Karma Puanı */}
      <div className="bg-linear-to-r from-warning-light/50 to-warning-light/10 dark:from-warning-dark/20 dark:to-transparent rounded-3xl p-5 border border-warning/20 mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Icon name="star" size={18} className="text-warning-dark dark:text-warning" />
            <p className="font-bold text-slate-900 dark:text-white">Karma Puanı</p>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium max-w-[200px]">
            Borçlarını vaktinde ödüyorsun. Güvenilirlik skorun yüksek!
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-warning-dark dark:text-warning">%95</span>
        </div>
      </div>

      {/* Menü Listesi */}
      <div className="bg-white dark:bg-card-dark rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden mb-8">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`flex items-center p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${index !== menuItems.length - 1 ? 'border-b border-slate-100 dark:border-slate-800/50' : ''
              }`}
            onClick={() => addToast('Bu özellik yakında eklenecek!', 'info')}
          >
            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0 mr-4">
              <Icon name={item.icon} size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{item.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{item.subtitle}</p>
            </div>
            <Icon name="forward" size={18} className="text-slate-400" />
          </div>
        ))}
      </div>

      {/* Çıkış Yap Butonu */}
      <button
        onClick={handleLogout}
        className="w-full py-4 bg-danger-50 dark:bg-danger-500/10 text-danger-700 dark:text-danger-400 rounded-2xl font-bold text-lg border border-danger-200 dark:border-danger-500/20 hover:bg-danger-100 dark:hover:bg-danger-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <Icon name="logout" size={20} />
        Çıkış Yap
      </button>

    </div>
  );
};
