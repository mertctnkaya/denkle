import { create } from 'zustand';
import { supabase } from '../services/supabase';
import { simplifyDebts } from '../core/debtSimplificationEngine';
import type { RawDebt } from '../core/debtSimplificationEngine';
import type { Share, ShareParticipant, Settlement, Party } from '../types/database';

export interface RecentActivity {
  id: string;
  title: string;
  partyName: string;
  partyId: string;
  emoji: string;
  amount: number;
  status: string;
  isDebt: boolean;
  time: string;
  createdAt: Date;
}

interface HomeState {
  totalOwedToMe: number; // Alacağın
  totalIOwe: number; // Ödeyeceğin
  recentActivities: RecentActivity[];
  isLoading: boolean;
  fetchDashboardData: (userId: string) => Promise<void>;
}

export const useHomeStore = create<HomeState>((set) => ({
  totalOwedToMe: 0,
  totalIOwe: 0,
  recentActivities: [],
  isLoading: false,

  fetchDashboardData: async (userId: string) => {
    set({ isLoading: true });
    try {
      // 1. Kullanıcının dahil olduğu partileri bul
      const { data: myMemberships, error: memberErr } = await supabase
        .from('party_members')
        .select('party_id, id, role')
        .eq('profile_id', userId);

      if (memberErr) throw memberErr;
      if (!myMemberships || myMemberships.length === 0) {
        set({ totalOwedToMe: 0, totalIOwe: 0, recentActivities: [], isLoading: false });
        return;
      }

      const partyIds = myMemberships.map(m => m.party_id);

      // 2. Bu partilere ait bilgileri getir
      const [partiesRes, sharesRes, partsRes, settlementsRes] = await Promise.all([
        supabase.from('parties').select('id, name').in('id', partyIds),
        supabase.from('shares').select('*').in('party_id', partyIds).neq('status', 'cancelled').order('created_at', { ascending: false }),
        supabase.from('share_participants').select('*'), // RLS handles scoping to our parties
        supabase.from('settlements').select('*').in('party_id', partyIds).eq('status', 'completed')
      ]);

      const parties = (partiesRes.data || []) as Pick<Party, 'id' | 'name'>[];
      const shares = (sharesRes.data || []) as Share[];
      const settlements = (settlementsRes.data || []) as Settlement[];
      
      const shareIds = shares.map(s => s.id);
      
      let allParts = (partsRes.data || []) as ShareParticipant[];
      allParts = allParts.filter(p => shareIds.includes(p.share_id));

      let totalOwedToMe = 0;
      let totalIOwe = 0;

      // Her parti için borç sadeleştirme motorunu bağımsız çalıştır
      for (const partyId of partyIds) {
        const partyShares = shares.filter(s => s.party_id === partyId);
        const partyShareIds = partyShares.map(s => s.id);
        const partyParts = allParts.filter(p => partyShareIds.includes(p.share_id));
        const partySettlements = settlements.filter(s => s.party_id === partyId);
        const myMemberIdInParty = myMemberships.find(m => m.party_id === partyId)?.id;

        const rawDebts: RawDebt[] = [];

        partyParts.forEach(p => {
          const payersInThisShare = partyParts.filter(x => x.share_id === p.share_id && x.paid_amount > 0);
          const primaryPayer = payersInThisShare[0];

          if (primaryPayer && p.owed_amount > 0) {
            rawDebts.push({
              payer: primaryPayer.party_member_id,
              payee: p.party_member_id,
              amount: p.owed_amount
            });
          }
        });

        partySettlements.forEach(s => {
          rawDebts.push({
            payer: s.payer_id,
            payee: s.payee_id,
            amount: s.amount
          });
        });

        // Motoru çalıştır
        const computedDebts = simplifyDebts(rawDebts);

        // Bu partideki benim durumum
        if (myMemberIdInParty) {
          computedDebts.forEach(debt => {
            if (debt.from === myMemberIdInParty) {
              totalIOwe += debt.amount;
            } else if (debt.to === myMemberIdInParty) {
              totalOwedToMe += debt.amount;
            }
          });
        }
      }

      // 3. Son Hareketler (Recent Activities) oluştur
      const recentActivities: RecentActivity[] = [];
      
      shares.slice(0, 15).forEach(share => { 
        const partyName = parties.find(p => p.id === share.party_id)?.name || 'Grup';
        const myMemberId = myMemberships.find(m => m.party_id === share.party_id)?.id;
        
        const myParticipant = allParts.find(p => p.share_id === share.id && p.party_member_id === myMemberId);
        const isCreator = share.created_by === myMemberId;

        if (myParticipant || isCreator) {
          let amount = 0;
          let isDebt = false;
          let status = 'Dahilsin';

          if (myParticipant) {
            if (myParticipant.paid_amount > 0) {
              // Ben ödedim
              amount = share.total_amount; 
              isDebt = false;
              status = 'Sen Ödedin';
            } else if (myParticipant.owed_amount > 0) {
              // Borçluyum
              amount = myParticipant.owed_amount;
              isDebt = true;
              status = 'Ödeyeceksin';
            } else {
              amount = share.total_amount;
              status = 'Görüntüleme';
            }
          } else if (isCreator) {
            amount = share.total_amount;
            status = 'Sen Ekledin';
          }

          let emoji = '💸';
          if (share.category === 'fuel') emoji = '⛽';
          if (share.category === 'restaurant') emoji = '🍔';
          if (share.category === 'shopping') emoji = '🛒';
          if (share.category === 'general') emoji = '🧾';

          const timeStr = new Date(share.created_at).toLocaleString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

          recentActivities.push({
            id: share.id,
            title: share.title,
            partyName,
            partyId: share.party_id,
            emoji,
            amount,
            status,
            isDebt,
            time: timeStr,
            createdAt: new Date(share.created_at)
          });
        }
      });

      recentActivities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      set({
        totalOwedToMe,
        totalIOwe,
        recentActivities: recentActivities.slice(0, 5), 
        isLoading: false
      });

    } catch (err) {
      console.error('Home data fetch error:', err);
      set({ isLoading: false });
    }
  }
}));
