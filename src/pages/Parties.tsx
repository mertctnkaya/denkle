import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePartyStore } from '../store/partyStore';
import { Icon } from '../components/shared/Icon';

export const Parties = () => {
  const navigate = useNavigate();
  const { parties, fetchParties, isLoading } = usePartyStore();

  useEffect(() => {
    fetchParties();
  }, [fetchParties]);

  const activeParties = parties.filter(p => !p.is_archived);
  const archivedParties = parties.filter(p => p.is_archived);

  if (isLoading && parties.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-950">
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 p-4 flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
        >
          <Icon name="back" size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Tüm Gruplarım</h1>
      </div>

      <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-8">
        
        {/* Aktif Gruplar */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Aktif Gruplar ({activeParties.length})</h2>
          
          {activeParties.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800">
              <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Icon name="users" size={32} />
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-medium">Aktif bir grubunuz bulunmuyor.</p>
              <button onClick={() => navigate('/')} className="mt-4 text-primary font-bold text-sm">Ana Sayfaya Dön</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeParties.map(party => (
                <div
                  key={party.id}
                  onClick={() => navigate(`/party/${party.id}`)}
                  className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-5 cursor-pointer hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-linear-to-br from-primary/20 to-primary/5 text-primary-dark dark:text-primary-light rounded-2xl flex items-center justify-center shadow-inner">
                        <span className="text-2xl group-hover:scale-110 transition-transform origin-bottom">🏕️</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">{party.name}</h3>
                        <p className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-1">
                          <Icon name="calendar" size={12} />
                          {new Date(party.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                        <Icon name="users" size={14} />
                      </div>
                      <span>{party.member_count || 1} Üye</span>
                    </div>
                    <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-700 pl-6">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <Icon name="scan" size={14} />
                      </div>
                      <span className="tracking-widest uppercase">{party.join_code}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Arşivlenmiş Gruplar */}
        {archivedParties.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Icon name="archive" size={16} />
              Arşivlenmiş Gruplar ({archivedParties.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {archivedParties.map(party => (
                <div
                  key={party.id}
                  onClick={() => navigate(`/party/${party.id}`)}
                  className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors opacity-80 hover:opacity-100 grayscale hover:grayscale-0 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-slate-200 dark:bg-slate-800 text-slate-500 rounded-2xl flex items-center justify-center">
                        <Icon name="archive" size={24} className="group-hover:scale-110 transition-transform" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-700 dark:text-slate-300 line-clamp-1">{party.name}</h3>
                        <p className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-1">
                          <Icon name="calendar" size={12} />
                          {new Date(party.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm font-semibold text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2 bg-slate-200/50 dark:bg-slate-800 p-2 pr-4 rounded-xl">
                      <div className="w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                        <Icon name="users" size={12} />
                      </div>
                      <span>{party.member_count || 1} Üye</span>
                    </div>
                    <div className="text-xs text-amber-600 dark:text-amber-500 font-bold bg-amber-100 dark:bg-amber-900/30 px-3 py-1.5 rounded-lg">
                      Sadece Okunabilir
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
