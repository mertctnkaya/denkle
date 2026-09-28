import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePartyStore } from '../store/partyStore';
import { Icon } from '../components/shared/Icon';
import { Button } from '../components/shared/Button';

export const PartyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentParty, members, fetchPartyDetails, isLoading, error } = usePartyStore();
  const [activeTab, setActiveTab] = useState<'feed' | 'balances'>('feed');

  useEffect(() => {
    if (id) {
      fetchPartyDetails(id);
    }
  }, [id, fetchPartyDetails]);

  if (isLoading && !currentParty) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !currentParty) {
    return (
      <div className="p-6 pt-12 text-center">
        <Icon name="error" size={48} className="mx-auto text-danger mb-4" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Grup Bulunamadı</h2>
        <p className="text-slate-500 mb-6">{error || "Aradığınız grup silinmiş veya erişim izniniz yok."}</p>
        <Button onClick={() => navigate('/')} variant="outline">Ana Sayfaya Dön</Button>
      </div>
    );
  }

  const myNetBalance = 0; // İleride shareStore'dan gelecek
  const isPositive = myNetBalance >= 0;

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 pb-24 md:pb-6 relative min-h-screen">
      {/* 1. HEADER */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4 md:px-6 flex items-center justify-between mt-0 md:mt-0 pt-8 md:pt-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
          >
            <Icon name="back" size={24} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
              {currentParty.name}
            </h1>
            <p className="text-xs font-medium text-slate-500">
              Kod: <span className="text-primary font-bold">{currentParty.join_code}</span>
            </p>
          </div>
        </div>

        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300">
          <Icon name="settings" size={20} />
        </button>
      </div>

      {/* 2. DASHBOARD / ÖZET KARTI */}
      <div className="p-4 md:p-6">
        <div className="soft-card bg-linear-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 text-white rounded-3xl p-6 relative overflow-hidden shadow-lg shadow-slate-900/10">
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">Senin Durumun</p>
                <div className="flex items-end gap-2">
                  <h2 className={`text-3xl font-bold ${myNetBalance === 0 ? 'text-white' : isPositive ? 'text-success-light' : 'text-danger-light'}`}>
                    {myNetBalance === 0 ? 'Ödeştiniz' : `${isPositive ? '+' : '-'}₺${Math.abs(myNetBalance).toFixed(2)}`}
                  </h2>
                </div>
              </div>
              <div className="flex -space-x-3">
                {members.slice(0, 4).map((m) => (
                  <div key={m.id} className="w-10 h-10 rounded-full border-2 border-slate-800 bg-primary-light text-primary-dark font-bold text-sm flex items-center justify-center uppercase shadow-sm">
                    {m.display_name.charAt(0)}
                  </div>
                ))}
                {members.length > 4 && (
                  <div className="w-10 h-10 rounded-full border-2 border-slate-800 bg-slate-700 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                    +{members.length - 4}
                  </div>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-[80%]">
              Grupta toplam <span className="text-white font-bold">{members.length} kişi</span> var. Harcamaları görmek ve bölüşmek için aşağıdaki alanı kullan.
            </p>
          </div>
        </div>
      </div>

      {/* 3. TABS (Hareketler & Hesaplaşma) */}
      <div className="px-4 md:px-6 mb-2">
        <div className="flex bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'feed' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Harcama Akışı
          </button>
          <button
            onClick={() => setActiveTab('balances')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'balances' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Hesaplaşma (Kim Kime)
          </button>
        </div>
      </div>

      {/* 4. İÇERİK ALANI */}
      <div className="flex-1 px-4 md:px-6 overflow-y-auto">
        {activeTab === 'feed' ? (
          <div className="py-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-3xl">
              💸
            </div>
            <h3 className="text-slate-800 dark:text-slate-100 font-bold mb-2">Henüz Harcama Yok</h3>
            <p className="text-slate-500 text-sm max-w-[250px]">Gruptaki ilk harcamayı sen ekle ve hesapları denkleştirmeye başla.</p>
          </div>
        ) : (
          <div className="py-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-3xl">
              ⚖️
            </div>
            <h3 className="text-slate-800 dark:text-slate-100 font-bold mb-2">Hesaplar Denk</h3>
            <p className="text-slate-500 text-sm max-w-[250px]">Şu an kimsenin kimseye borcu yok. Harika!</p>
          </div>
        )}
      </div>

      {/* 5. FLOATING ACTION BUTTON (Yeni Harcama) */}
      <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50">
        <button className="h-14 px-6 bg-primary hover:bg-primary-dark text-white rounded-full shadow-lg shadow-primary/30 flex items-center justify-center gap-2 font-bold text-sm transition-all hover:scale-105 active:scale-95 cursor-pointer">
          <Icon name="plus" size={20} />
          Yeni Harcama
        </button>
      </div>
    </div>
  );
};
