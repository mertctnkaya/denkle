import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import { Icon } from '../shared/Icon';
import type { Share, ShareParticipant, Settlement, PartyMember } from '../../types/database';

interface BalanceBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: PartyMember | undefined;
  shares: Share[];
  participants: ShareParticipant[];
  settlements: Settlement[];
  members: PartyMember[];
  onViewShare: (share: Share) => void;
}

export const BalanceBreakdownModal = ({
  isOpen,
  onClose,
  member,
  shares,
  participants,
  settlements,
  members,
  onViewShare
}: BalanceBreakdownModalProps) => {
  if (!member) return null;

  // Harcamalardan gelen net etkiler
  const shareEffects = shares.map(share => {
    const myPart = participants.find(p => p.share_id === share.id && p.party_member_id === member.id);
    if (!myPart) return null;

    const netEffect = Number(myPart.paid_amount) - Number(myPart.owed_amount);
    if (netEffect === 0) return null; // Etkisi yoksa gösterme

    return {
      id: share.id,
      type: 'share' as const,
      title: share.title,
      netEffect,
      date: new Date(share.created_at),
      originalData: share
    };
  }).filter(Boolean);

  // Ödemelerden (Settlements) gelen net etkiler
  const settlementEffects = settlements.filter(s => s.status === 'completed' && (s.payer_id === member.id || s.payee_id === member.id)).map(s => {
    const isPayer = s.payer_id === member.id;
    // Eğer ben ödediysem, sisteme para soktum demektir (Alacağım artar -> +)
    // Eğer bana ödendiyse, paramı aldım demektir (Alacağım azalır -> -)
    const netEffect = isPayer ? Number(s.amount) : -Number(s.amount);
    const otherMemberId = isPayer ? s.payee_id : s.payer_id;
    const otherMember = members.find(m => m.id === otherMemberId);

    return {
      id: s.id,
      type: 'settlement' as const,
      title: isPayer ? `Ödeme Yaptın (${otherMember?.display_name})` : `Ödeme Aldın (${otherMember?.display_name})`,
      netEffect,
      date: new Date(s.created_at),
      originalData: s
    };
  });

  const allEffects = [...(shareEffects as any[]), ...settlementEffects].sort((a, b) => b.date.getTime() - a.date.getTime());
  const totalBalance = allEffects.reduce((sum, item) => sum + item.netEffect, 0);
  const isPositive = totalBalance >= 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bakiye Dökümü">
      <div className="space-y-4">
        <p className="text-sm text-slate-500 mb-2">
          Mevcut bakiyenizin (<strong>{isPositive ? '+' : ''}₺{Math.abs(totalBalance).toFixed(2)}</strong>) hangi harcama ve ödemelerden oluştuğunu aşağıda görebilirsiniz.
        </p>
        
        <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {allEffects.length === 0 ? (
             <div className="text-center py-6 text-slate-400 text-sm font-medium">
               Henüz bakiyenizi etkileyen bir hareket yok.
             </div>
          ) : (
            allEffects.map(item => {
              const itemPositive = item.netEffect > 0;
              return (
                <div 
                  key={item.id} 
                  className={`flex items-center justify-between p-3 rounded-xl border ${item.type === 'share' ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/80 bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50'}`}
                  onClick={() => {
                    if (item.type === 'share') {
                      onViewShare(item.originalData);
                      onClose();
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${item.type === 'settlement' ? 'bg-indigo-100 text-indigo-500 dark:bg-indigo-900/30' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                      <Icon name={item.type === 'settlement' ? 'success' : 'receipt'} size={16} />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{item.title}</div>
                      <div className="text-[10px] text-slate-400">{item.date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })} {item.type === 'share' ? (itemPositive ? 'Sen ödedin' : 'Dahilsin') : 'Denkleştirme'}</div>
                    </div>
                  </div>
                  <div className={`font-bold shrink-0 ${itemPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {itemPositive ? '+' : '-'}₺{Math.abs(item.netEffect).toFixed(2)}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center px-1">
          <span className="font-bold text-slate-600 dark:text-slate-400">NET TOPLAM</span>
          <span className={`text-xl font-black ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
            {isPositive ? '+' : '-'}₺{Math.abs(totalBalance).toFixed(2)}
          </span>
        </div>

        <Button variant="ghost" fullWidth onClick={onClose}>Kapat</Button>
      </div>
    </Modal>
  );
};
