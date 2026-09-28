import { create } from 'zustand';
import { supabase } from '../services/supabase';
import type { Party, PartyMember } from '../types/database';

interface PartyState {
  parties: Party[];
  currentParty: Party | null;
  members: PartyMember[];
  isLoading: boolean;
  error: string | null;

  fetchParties: () => Promise<void>;
  fetchPartyDetails: (partyId: string) => Promise<void>;
  createParty: (name: string) => Promise<string | null>;
  joinParty: (joinCode: string) => Promise<string | null>;
  addShadowMember: (partyId: string, displayName: string) => Promise<void>;
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
  isLoading: false,
  error: null,

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

      await get().fetchPartyDetails(partyId);
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  }
}));
