import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import { Icon } from '../shared/Icon';
import type { IconName } from '../shared/Icon';
import type { PartyMember, Share, ShareParticipant } from '../../types/database';
import { useMemo } from 'react';

interface ViewShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  share: Share | null;
  participants: ShareParticipant[];
  members: PartyMember[];
  currentUserId: string;
  onEdit?: () => void;
  isArchived?: boolean;
}

export const ViewShareModal = ({ isOpen, onClose, share, participants, members, currentUserId, onEdit, isArchived = false }: ViewShareModalProps) => {
  const shareParticipants = useMemo(() => {
    if (!share) return [];
    return participants.filter(p => p.share_id === share.id);
  }, [share, participants]);

  const payerParticipant = useMemo(() => {
    return shareParticipants.find(p => p.paid_amount > 0);
  }, [shareParticipants]);

  const payerMember = useMemo(() => {
    return members.find(m => m.id === payerParticipant?.party_member_id);
  }, [payerParticipant, members]);

  if (!share) return null;

  let catIcon: IconName = 'receipt';
  if (share.category === 'fuel') catIcon = 'camera';
  if (share.category === 'restaurant') catIcon = 'star';
  if (share.category === 'shopping') catIcon = 'card';

  const splitModeLabels = {
    equal: 'Eşit Bölüşüm',
    percentage: 'Yüzdelik Bölüşüm',
    shares: 'Pay ile Bölüşüm',
    exact: 'Tam Tutar ile Bölüşüm'
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Harcama Detayı"
    >
      <div className="space-y-6">
        {/* Başlık ve İkon */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
            <Icon name={catIcon} size={28} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{share.title}</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">
              {new Date(share.created_at).toLocaleString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-slate-900 dark:text-white">₺{share.total_amount.toFixed(2)}</div>
          </div>
        </div>

        {/* Kim Ödedi ve Nasıl Bölüşüldü */}
        <div className="flex gap-3">
          <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
            <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Kim Ödedi?</span>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary-light text-primary-dark flex items-center justify-center text-xs font-bold uppercase">
                {payerMember?.display_name.charAt(0) || '?'}
              </div>
              <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">
                {payerMember?.profile_id === currentUserId ? 'Sen' : payerMember?.display_name || 'Bilinmiyor'}
              </span>
            </div>
          </div>
          <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
            <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Nasıl Bölüşüldü?</span>
            <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">
              {splitModeLabels[share.split_mode as keyof typeof splitModeLabels] || share.split_mode}
            </span>
          </div>
        </div>

        {/* Bölüşüm Listesi */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ortaklar ({shareParticipants.filter(p => members.some(m => m.id === p.party_member_id)).length})</h4>
          </div>
          
          {(() => {
            const validParticipants = shareParticipants.filter(p => members.some(m => m.id === p.party_member_id));
            const validTotalOwed = validParticipants.reduce((sum, p) => sum + Number(p.owed_amount), 0);
            const totalMismatch = Math.abs(validTotalOwed - Number(share.total_amount)) > 0.05;

            return (
              <>
                {totalMismatch && (
                  <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-xs rounded-xl font-medium border border-rose-100 dark:border-rose-800/50">
                    <span className="block font-bold mb-1">⚠️ Toplam Tutar Uyuşmazlığı</span>
                    Bazı üyeler gruptan çıkarıldığı için aktif ortakların payları toplamı (₺{validTotalOwed.toFixed(2)}), harcamanın asıl tutarı (₺{share.total_amount.toFixed(2)}) ile uyuşmuyor. Lütfen harcamayı düzenleyin veya yeniden hesaplayın.
                  </div>
                )}
                
                <div className="space-y-2">
                  {validParticipants.map(part => {
                    const member = members.find(m => m.id === part.party_member_id)!;
                    const isMe = member.profile_id === currentUserId;
                    // Kalan kişilere göre dinamik yüzde hesabı
                    const percentage = validTotalOwed > 0 ? (Number(part.owed_amount) / validTotalOwed) * 100 : 0;

                    return (
                      <div key={part.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-xs uppercase">
                            {member.display_name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-slate-900 dark:text-white">
                              {member.display_name} {isMe && <span className="text-slate-400 font-normal">(Sen)</span>}
                            </div>
                            <div className="text-[10px] text-orange-500 font-bold mt-0.5">
                              %{percentage.toFixed(1).replace('.0', '')} pay
                            </div>
                          </div>
                        </div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          ₺{Number(part.owed_amount).toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            );
          })()}
        </div>

        <div className="flex gap-3">
          {!isArchived && (payerMember?.profile_id === currentUserId || members.find(m => m.profile_id === currentUserId)?.role === 'owner' || members.find(m => m.profile_id === currentUserId)?.role === 'admin' || share.created_by === members.find(m => m.profile_id === currentUserId)?.id) && (
            <Button variant="outline" fullWidth onClick={() => onEdit?.()}>
              Düzenle
            </Button>
          )}
          <Button variant="ghost" fullWidth onClick={onClose}>Kapat</Button>
        </div>
      </div>
    </Modal>
  );
};
