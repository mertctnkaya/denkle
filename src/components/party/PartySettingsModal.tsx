import { useState } from 'react';
import type { Party, PartyMember } from '../../types/database';
import { usePartyStore } from '../../store/partyStore';
import { useToastStore } from '../../store/toastStore';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import { Icon } from '../shared/Icon';
import { useNavigate } from 'react-router-dom';

interface PartySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  party: Party;
  myMember: PartyMember;
  netBalance: number; // Kullanıcının gruptaki net bakiyesi
}

export const PartySettingsModal = ({ isOpen, onClose, party, myMember, netBalance }: PartySettingsModalProps) => {
  const navigate = useNavigate();
  const { addToast } = useToastStore();
  const { updateParty, leaveParty } = usePartyStore();
  
  const [partyName, setPartyName] = useState(party.name);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  
  const canEditName = myMember.role === 'owner' || myMember.role === 'admin';
  const isOwner = myMember.role === 'owner';

  const handleUpdateName = async () => {
    if (!partyName.trim() || partyName === party.name) return;
    setIsUpdating(true);
    const success = await updateParty(party.id, { name: partyName.trim() });
    setIsUpdating(false);
    
    if (success) {
      addToast('Grup adı güncellendi.', 'success');
    } else {
      const err = usePartyStore.getState().error;
      addToast(err || 'Güncellenirken hata oluştu.', 'error');
    }
  };

  const handleToggleArchive = async () => {
    setIsUpdating(true);
    const success = await updateParty(party.id, { is_archived: !party.is_archived });
    setIsUpdating(false);
    
    if (success) {
      addToast(party.is_archived ? 'Grup arşivden çıkarıldı.' : 'Grup arşivlendi.', 'success');
    } else {
      const err = usePartyStore.getState().error;
      addToast(err || 'İşlem başarısız.', 'error');
    }
  };

  const handleLeave = async () => {
    if (netBalance !== 0) {
      addToast(`Gruptan ayrılabilmek için bakiyenizin sıfır olması gerekiyor (Mevcut: ${netBalance > 0 ? '+' : ''}${netBalance} TL).`, 'warning');
      return;
    }
    
    if (isOwner) {
      addToast('Kurucu gruptan ayrılamaz. Önce kuruculuğu devretmelisiniz.', 'error');
      return;
    }

    if (!window.confirm('Gruptan ayrılmak istediğinize emin misiniz?')) return;

    setIsLeaving(true);
    const success = await leaveParty(party.id, myMember.id);
    setIsLeaving(false);

    if (success) {
      addToast('Gruptan ayrıldınız.', 'success');
      onClose();
      navigate('/');
    } else {
      const err = usePartyStore.getState().error;
      addToast(err || 'Gruptan ayrılırken hata oluştu.', 'error');
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Grup Ayarları">
      <div className="space-y-6">
        
        {/* Grup Adı */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Grup Adı</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={partyName} 
              onChange={(e) => setPartyName(e.target.value)} 
              disabled={!canEditName}
              className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white disabled:opacity-50"
            />
            {canEditName && (
              <Button onClick={handleUpdateName} isLoading={isUpdating} disabled={partyName === party.name || !partyName.trim()}>
                Kaydet
              </Button>
            )}
          </div>
        </div>

        {/* AI Idea: QR Şablonu */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Icon name="scan" size={20} />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Ev Arkadaşı Modu (QR)</h4>
            <p className="text-xs text-slate-500 mt-1 mb-2">Buzdolabına asmalık hızlı harcama ekleme şablonu. (v0.5 ile gelecek)</p>
            <button className="text-xs font-bold text-primary hover:underline cursor-pointer" onClick={() => addToast('Bu özellik henüz yapım aşamasında!', 'info')}>Önizlemeyi Gör</button>
          </div>
        </div>

        {/* Arşivleme */}
        {isOwner && (
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">Partiyi Arşivle</h4>
            <p className="text-xs text-slate-500 mb-3">Arşivlenen gruplara yeni harcama eklenemez, ancak geçmiş kayıtlar okunabilir kalır.</p>
            <Button variant={party.is_archived ? "primary" : "outline"} fullWidth onClick={handleToggleArchive} isLoading={isUpdating}>
              {party.is_archived ? 'Arşivden Çıkar' : 'Grubu Arşivle'}
            </Button>
          </div>
        )}

        {/* Gruptan Ayrıl */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
          <Button variant="danger" fullWidth onClick={handleLeave} isLoading={isLeaving}>
            Gruptan Ayrıl
          </Button>
          <p className="text-[10px] text-center text-slate-400 mt-2">
            Gruptan ayrılabilmek için bakiyenizin tam olarak 0 (sıfır) olması gerekir.
          </p>
        </div>

      </div>
    </Modal>
  );
};
