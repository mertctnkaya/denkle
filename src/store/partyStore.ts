import { create } from 'zustand';
import { supabase } from '../services/supabase';
import type { Party, PartyMember } from '../types/database';

interface PartyState {
  parties: Party[];
  currentParty: Party | null;
  members: PartyMember[];
  events: any[];
  isLoading: boolean;
  error: string | null;

  fetchParties: () => Promise<void>;
  fetchPartyDetails: (partyId: string) => Promise<void>;
  fetchEvents: (partyId: string) => Promise<void>;
  createParty: (name: string) => Promise<string | null>;
  joinParty: (joinCode: string) => Promise<string | null>;
  addShadowMember: (partyId: string, displayName: string) => Promise<void>;
  updateMemberRole: (partyId: string, memberId: string, newRole: 'owner' | 'admin' | 'member') => Promise<void>;
  removeMember: (partyId: string, memberId: string) => Promise<void>;
  updateParty: (partyId: string, updates: Partial<Party>) => Promise<boolean>;
  leaveParty: (partyId: string, memberId: string) => Promise<boolean>;
}

const generateJoinCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Mobil cihazlardan LAN (http://192.168.x.x) ile girildiğinde crypto.randomUUID() undefined döner!
// Bu yüzden güvenli bir UUID generator (fallback) yazıyoruz.
const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const usePartyStore = create<PartyState>((set, get) => ({
  parties: [],
  currentParty: null,
  members: [],
  events: [],
  isLoading: false,
  error: null,

  fetchEvents: async (partyId: string) => {
    try {
      const { data, error } = await supabase
        .from('party_events')
        .select('*')
        .eq('party_id', partyId)
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        set({ events: data });
      }
    } catch (err) {
      console.error("fetchEvents error", err);
    }
  },

  fetchParties: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Giriş yapmanız gerekiyor.");

      // Sadece üyesi olduğumuz partileri çek (RLS sayesinde supabase sadece bunları döner)
      // Üye sayısını da party_members tablosundan count ile alıyoruz.
      const { data, error } = await supabase
        .from('parties')
        .select('*, party_members(count)')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedParties = data.map((p: any) => ({
        ...p,
        member_count: p.party_members?.[0]?.count || 1
      }));

      set({ parties: mappedParties as Party[] });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchPartyDetails: async (partyId: string) => {
    set({ isLoading: true, error: null });
    try {
      const [partyRes, membersRes] = await Promise.all([
        supabase.from('parties').select('*').eq('id', partyId).single(),
        supabase.from('party_members').select('*').eq('party_id', partyId)
      ]);

      if (partyRes.error) throw partyRes.error;
      if (membersRes.error) throw membersRes.error;

      set({
        currentParty: partyRes.data as Party,
        members: membersRes.data as PartyMember[]
      });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  createParty: async (name: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Giriş yapmanız gerekiyor.");

      const partyId = generateUUID();
      const joinCode = generateJoinCode();

      // 1. Partiyi oluştur (RLS Select hatasını önlemek için UUID'yi kendimiz veriyoruz)
      const { error: partyError } = await supabase
        .from('parties')
        .insert([{ id: partyId, name, join_code: joinCode, created_by: user.id }]);

      if (partyError) {
        if (partyError.message.includes('fkey')) {
          throw new Error("Veritabanı ilişkisi hatası (Foreign Key). Profiliniz public.profiles tablosunda yok. (Trigger sorunu). Lütfen SQL scriptinizi kontrol edin.");
        }
        throw new Error("Grup oluşturma hatası: " + partyError.message);
      }

      // 2. Kendini kurucu (owner) olarak ekle
      const { error: memberError } = await supabase
        .from('party_members')
        .insert([{
          party_id: partyId,
          profile_id: user.id,
          display_name: user.user_metadata?.full_name || 'Kurucu',
          role: 'owner'
        }]);

      if (memberError) throw new Error("Grup üyesi eklenemedi: " + memberError.message);

      await get().fetchParties();
      return partyId;
    } catch (err: any) {
      set({ error: err.message });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  joinParty: async (joinCode: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Giriş yapmanız gerekiyor.");

      // Partiyi koddan bul
      // Partiyi koddan bul (RLS engeline takılmamak için RPC kullanıyoruz)
      const { data: partyId, error: findError } = await supabase.rpc('get_party_id_by_code', {
        code: joinCode.toUpperCase()
      });

      if (findError || !partyId) throw new Error("Grup bulunamadı veya kod geçersiz.");

      // Üye olarak ekle (RLS engellememeli, policy'yi hatırlayalım)
      const { error: joinError } = await supabase
        .from('party_members')
        .insert([{
          party_id: partyId,
          profile_id: user.id,
          display_name: user.user_metadata?.full_name || 'Üye',
          role: 'member'
        }]);

      if (joinError) {
        // Zaten üyeyse ignore edebiliriz (Supabase unique constraint vs varsa)
        if (joinError.code !== '23505') throw joinError; // 23505: unique violation
      }

      await get().fetchParties();
      return partyId;
    } catch (err: any) {
      set({ error: err.message });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  addShadowMember: async (partyId: string, displayName: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Giriş yapmanız gerekiyor.");

      const { error } = await supabase
        .from('party_members')
        .insert([{
          party_id: partyId,
          profile_id: null, // Hayalet profil
          display_name: displayName,
          role: 'member',
          added_by: user.id
        }]);

      if (error) throw error;

      const { data: currentMember } = await supabase.from('party_members').select('id').eq('party_id', partyId).eq('profile_id', user.id).single();
      if (currentMember) {
        await supabase.from('party_events').insert([{
          party_id: partyId,
          actor_id: currentMember.id,
          event_type: 'member_added',
          description: `"${displayName}" adlı hayalet üyeyi ekledi.`,
          metadata: { added_name: displayName }
        }]);
      }

      await get().fetchPartyDetails(partyId);
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateMemberRole: async (partyId: string, memberId: string, newRole: 'owner' | 'admin' | 'member') => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Giriş yapmanız gerekiyor.");
      
      const { data: currentMember } = await supabase.from('party_members').select('id, role').eq('party_id', partyId).eq('profile_id', user.id).single();

      // 1. Önce hedef kişiyi yeni role (owner) geçir (Hala owner yetkimiz varken)
      const { error } = await supabase
        .from('party_members')
        .update({ role: newRole })
        .eq('id', memberId)
        .eq('party_id', partyId); // extra safety

      if (error) throw error;

      // 2. Eğer kuruculuk devri yapılıyorsa, kendi yetkimizi admin'e düşür (Artık yeni bir owner var)
      if (newRole === 'owner' && currentMember && currentMember.role === 'owner') {
        await supabase
          .from('party_members')
          .update({ role: 'admin' })
          .eq('id', currentMember.id);
      }

      if (user) {
        const { data: targetMember } = await supabase.from('party_members').select('display_name').eq('id', memberId).single();
        
        if (currentMember && targetMember) {
          const roleNames = { owner: 'Kurucu', admin: 'Yönetici', member: 'Üye' };
          await supabase.from('party_events').insert([{
            party_id: partyId,
            actor_id: currentMember.id,
            event_type: 'role_updated',
            description: `"${targetMember.display_name}" adlı kişinin yetkisini "${roleNames[newRole]}" olarak güncelledi.`,
            metadata: { target_member_id: memberId, new_role: newRole }
          }]);
        }
      }

      await get().fetchPartyDetails(partyId);
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  removeMember: async (partyId: string, memberId: string) => {
    set({ isLoading: true, error: null });
    try {
      // 1. Üyenin dahil olduğu aktif harcamaları kontrol et
      const { data: memberShares, error: msError } = await supabase
        .from('share_participants')
        .select(`
          share_id,
          shares!inner ( id, split_mode, total_amount, status )
        `)
        .eq('party_member_id', memberId)
        .eq('shares.party_id', partyId)
        .neq('shares.status', 'cancelled');

      if (msError) throw msError;

      const nonEqualShares = (memberShares || []).filter((m: any) => m.shares.split_mode !== 'equal');
      if (nonEqualShares.length > 0) {
        throw new Error('Bu üye Yüzde/Sabit/Pay bölüşümlü aktif bir harcamaya dahil. Lütfen önce o harcamayı düzenleyin veya silin.');
      }

      // 2. Üyeyi veritabanından sil (CASCADE share_participants satırını silecektir)
      const { data: targetMember } = await supabase.from('party_members').select('display_name').eq('id', memberId).single();
      const { error } = await supabase
        .from('party_members')
        .delete()
        .eq('id', memberId)
        .eq('party_id', partyId);

      if (error) {
        if (error.message.includes('foreign key constraint')) {
          throw new Error('Supabase SQL Cascade yetkilerini ayarlamalısınız. Lütfen verilen SQL kodunu çalıştırın.');
        }
        throw error;
      }
      
      // Log event
      const { data: { user } } = await supabase.auth.getUser();
      if (user && targetMember) {
        const { data: currentMember } = await supabase.from('party_members').select('id').eq('party_id', partyId).eq('profile_id', user.id).single();
        if (currentMember) {
          await supabase.from('party_events').insert([{
            party_id: partyId,
            actor_id: currentMember.id,
            event_type: 'member_removed',
            description: `"${targetMember.display_name}" adlı kişiyi gruptan çıkardı.`,
            metadata: { removed_name: targetMember.display_name }
          }]);
        }
      }

      // 3. Etkilenen Eşit bölüşümlü harcamaları yeniden hesapla (Recalculation)
      const equalShareIds = (memberShares || []).map((m: any) => m.share_id);
      
      if (equalShareIds.length > 0) {
        // splitEngine import etmemiz gerekecek
        const { calculateOwedAmounts } = await import('../core/splittingEngine');

        for (const shareId of equalShareIds) {
          const { data: remainingParts, error: rpError } = await supabase
            .from('share_participants')
            .select('id, party_member_id')
            .eq('share_id', shareId);
            
          if (rpError) continue;
          
          if (remainingParts && remainingParts.length > 0) {
            const shareRecord: any = memberShares!.find((m: any) => m.share_id === shareId)?.shares;
            if (!shareRecord) continue;
            
            const participantsIds = remainingParts.map((p: any) => p.party_member_id);
            const totalAmount = Array.isArray(shareRecord) ? shareRecord[0].total_amount : shareRecord.total_amount;
            
            const newOwed = calculateOwedAmounts({
              totalAmount: totalAmount,
              participants: participantsIds,
              splitMode: 'equal'
            });
            
            // Kalan üyelerin owed_amount değerlerini güncelle
            for (const p of remainingParts) {
               await supabase
                 .from('share_participants')
                 .update({ owed_amount: newOwed[p.party_member_id] })
                 .eq('id', p.id);
            }
          }
        }
      }

      await get().fetchPartyDetails(partyId);
    } catch (err: any) {
      set({ error: err.message });
      console.error("Remove Member Error:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  updateParty: async (partyId: string, updates: Partial<Party>) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('parties')
        .update(updates)
        .eq('id', partyId);
      if (error) throw error;
      
      await get().fetchPartyDetails(partyId);
      return true;
    } catch (err: any) {
      set({ error: err.message });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  leaveParty: async (partyId: string, memberId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('party_members')
        .delete()
        .eq('id', memberId)
        .eq('party_id', partyId);
      
      if (error) throw error;
      
      // Çıkış yapıldıktan sonra partiler listesini güncelle
      await get().fetchParties();
      set({ currentParty: null, members: [], events: [] });
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Dashboard state'ini yenilemek için home store'a dispatch
        import('./homeStore').then(module => {
          module.useHomeStore.getState().fetchDashboardData(user.id);
        });
      }
      
      return true;
    } catch (err: any) {
      set({ error: err.message });
      return false;
    } finally {
      set({ isLoading: false });
    }
  }
}));
