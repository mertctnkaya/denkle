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
    <div className="p-6 md:p-0 pt-12 md:pt-6 pb-24 md:pb-6 max-w-2xl mx-auto w-full">
      {/* Üst Kısım: Başlık */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="md:hidden w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <Icon name="back" size={20} />
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Profil Ayarları</h1>
      </div>

      {/* Profil Kartı */}
      <div className="bg-white dark:bg-card-dark rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-sm mb-8 flex items-center gap-6">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-primary-light dark:bg-primary-dark/30 rounded-2xl flex items-center justify-center text-primary font-bold text-3xl md:text-4xl border-2 border-white dark:border-slate-800 shadow-sm shrink-0 uppercase">
          {initial}
        </div>
        <div className="overflow-hidden">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white truncate">{fullName}</h2>
          <p className="text-sm md:text-base text-slate-500 font-medium truncate mt-1">{email}</p>
        </div>
      </div>

      {/* Karma Puanı (AI Fikri) */}
      <div className="bg-linear-to-r from-warning-light/50 to-warning-light/10 dark:from-warning-dark/20 dark:to-transparent rounded-3xl p-6 md:p-8 border border-warning/20 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Icon name="star" size={20} className="text-warning-dark dark:text-warning" />
            <p className="font-bold text-lg text-slate-900 dark:text-white">Karma Puanı</p>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium max-w-sm">
            Borçlarını vaktinde ödüyorsun. Güvenilirlik skorun yüksek!
          </p>
        </div>
        <div className="text-left md:text-right">
          <span className="text-4xl font-black text-warning-dark dark:text-warning">%95</span>
        </div>
      </div>

      {/* Menü Listesi */}
      <div className="bg-white dark:bg-card-dark rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden mb-8">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`group flex items-center p-4 md:p-5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${index !== menuItems.length - 1 ? 'border-b border-slate-100 dark:border-slate-800/50' : ''
              }`}
            onClick={() => addToast('Bu özellik yakında eklenecek!', 'info')}
          >
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 group-hover:bg-primary-light dark:group-hover:bg-primary-dark/30 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-primary dark:group-hover:text-primary-light shrink-0 mr-4 md:mr-5 transition-all duration-300">
              <Icon name={item.icon} size={22} className="group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 dark:text-white text-base group-hover:text-primary dark:group-hover:text-primary-light transition-colors">{item.title}</h3>
              <p className="text-sm text-slate-500 mt-0.5">{item.subtitle}</p>
            </div>
            <Icon name="forward" size={20} className="text-slate-400 group-hover:text-primary dark:group-hover:text-primary-light group-hover:translate-x-1 transition-all duration-300" />
          </div>
        ))}
      </div>

      {/* Çıkış Yap Butonu */}
      <button
        onClick={handleLogout}
        className="w-full py-4 md:py-5 bg-transparent border-2 border-danger text-danger rounded-2xl font-bold text-lg hover:bg-danger hover:text-white hover:shadow-lg hover:shadow-danger/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <Icon name="logout" size={22} />
        Çıkış Yap
      </button>

    </div>
  );
};
