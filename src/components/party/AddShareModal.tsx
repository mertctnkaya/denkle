import { useState, useMemo } from 'react';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import { Icon } from '../shared/Icon';
import type { IconName } from '../shared/Icon';
import type { PartyMember, Share } from '../../types/database';

interface AddShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: PartyMember[];
  currentUserId: string;
  onAdd: (
    title: string,
    amount: number,
    paidByMemberId: string,
    category: Share['category'],
    participants: string[],
    splitMode: 'equal' | 'percentage' | 'exact' | 'shares'
  ) => Promise<void>;
}

const CATEGORIES: { id: Share['category']; label: string; icon: IconName; color: string }[] = [
  { id: 'general', label: 'Genel', icon: 'receipt', color: 'bg-slate-100 text-slate-600' },
  { id: 'fuel', label: 'Yakıt', icon: 'camera', color: 'bg-orange-100 text-orange-600' }, // Todo: add gas-pump icon later, using camera as placeholder
  { id: 'restaurant', label: 'Yemek', icon: 'star', color: 'bg-red-100 text-red-600' },
  { id: 'shopping', label: 'Market', icon: 'card', color: 'bg-blue-100 text-blue-600' },
];

export const AddShareModal = ({ isOpen, onClose, members, currentUserId, onAdd }: AddShareModalProps) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Share['category']>('general');
  const [splitMode, setSplitMode] = useState<'equal' | 'percentage' | 'exact' | 'shares'>('equal');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Bulunduğumuz kullanıcının PartyMember id'sini bul
  const me = useMemo(() => members.find(m => m.profile_id === currentUserId), [members, currentUserId]);

  const [paidBy, setPaidBy] = useState<string>(me?.id || '');

  // Şimdilik eşit bölüşüm (Herkes dahil)
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(members.map(m => m.id));

  // Modal kapandığında state'leri sıfırla
  const handleClose = () => {
    setTitle('');
    setAmount('');
    setCategory('general');
    setSplitMode('equal');
    setPaidBy(me?.id || '');
    setSelectedParticipants(members.map(m => m.id));
    onClose();
  };

  const handleSubmit = async () => {
    if (!title.trim() || !amount || parseFloat(amount) <= 0 || !paidBy) return;
    if (selectedParticipants.length === 0) return;

    setIsSubmitting(true);
    await onAdd(
      title.trim(),
      parseFloat(amount),
      paidBy,
      category,
      selectedParticipants,
      splitMode
    );
    setIsSubmitting(false);
    handleClose();
  };

  const toggleParticipant = (memberId: string) => {
    if (selectedParticipants.includes(memberId)) {
      setSelectedParticipants(prev => prev.filter(id => id !== memberId));
    } else {
      setSelectedParticipants(prev => [...prev, memberId]);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Yeni Harcama Ekle"
      footer={
        <div className="flex gap-3">
          <Button variant="ghost" fullWidth onClick={handleClose}>İptal</Button>
          <Button
            variant="primary"
            fullWidth
            isLoading={isSubmitting}
            onClick={handleSubmit}
            disabled={!title.trim() || !amount || parseFloat(amount) <= 0 || selectedParticipants.length === 0}
          >
            Ekle
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Tutar ve Başlık */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Ne İçin?</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn: Market alışverişi"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white"
            />
          </div>
          <div className="w-1/3">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Tutar (₺)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white font-bold text-lg text-right"
            />
          </div>
        </div>

        {/* Kategori Seçimi */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-2">Kategori</label>
          <div className="grid grid-cols-4 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${category === cat.id
                  ? 'border-primary bg-primary/5 dark:bg-primary/10'
                  : 'border-transparent bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${cat.color}`}>
                  <Icon name={cat.icon} size={16} />
                </div>
                <span className={`text-[10px] font-bold ${category === cat.id ? 'text-primary' : 'text-slate-500'}`}>
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Bölüşüm Türü (Split Mode) */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-2">Bölüşüm Türü (Nasıl Bölüşülecek?)</label>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {(['equal', 'percentage', 'shares', 'exact'] as const).map(mode => {
              const labels = {
                equal: 'Eşit',
                percentage: 'Yüzde',
                shares: 'Pay',
                exact: 'Tam Tutar'
              };
              const isSelected = splitMode === mode;
              return (
                <button
                  key={mode}
                  onClick={() => setSplitMode(mode)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${isSelected ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  {labels[mode]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Kim Ödedi? (Single Select Chips) */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-2">Parayı Kim Verdi? <span className="font-normal text-slate-400">(Kasadan ödeyen)</span></label>
          <div className="flex overflow-x-auto gap-2 pb-2 custom-scrollbar snap-x">
            {members.map(m => {
              const isSelected = paidBy === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setPaidBy(m.id)}
                  className={`snap-start shrink-0 flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border text-sm font-semibold transition-all duration-300 ${isSelected
                    ? 'bg-slate-900 dark:bg-white border-slate-900 dark:border-white text-white dark:text-slate-900 shadow-md shadow-slate-900/20'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${isSelected ? 'bg-white/20 dark:bg-slate-900/20' : 'bg-slate-100 dark:bg-slate-700'}`}>
                    {m.display_name.charAt(0).toUpperCase()}
                  </div>
                  {m.profile_id === currentUserId ? 'Sen' : m.display_name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Kimler Arasında Bölüşülecek? (Multi Select Chips) */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-end mb-3">
            <label className="block text-xs font-semibold text-slate-500">
              Bu Harcamaya Kimler Ortak? <span className="font-normal">
                ({splitMode === 'equal' ? 'Eşit bölüşülecek' : splitMode === 'percentage' ? 'Yüzde ile' : splitMode === 'shares' ? 'Pay ile' : 'Tam tutar ile'})
              </span>
            </label>
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{selectedParticipants.length} kişi seçili</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {members.map(m => {
              const isSelected = selectedParticipants.includes(m.id);
              return (
                <button
                  key={m.id}
                  onClick={() => toggleParticipant(m.id)}
                  className={`flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border text-sm font-medium transition-all ${isSelected
                    ? 'bg-primary-light/50 dark:bg-primary-dark/20 border-primary/30 text-primary-dark dark:text-primary-light'
                    : 'bg-transparent border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-slate-300'
                    }`}
                >
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors ${isSelected ? 'border-primary bg-primary text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                    {isSelected && <Icon name="success" size={10} strokeWidth={4} />}
                  </div>
                  {m.profile_id === currentUserId ? 'Sen' : m.display_name}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </Modal>
  );
};
