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
      const { data, error } = await supabase
        .from('parties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ parties: data as Party[] });
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

      const joinCode = generateJoinCode();

      // 1. Partiyi oluştur
      const { data: party, error: partyError } = await supabase
        .from('parties')
        .insert([{ name, join_code: joinCode, created_by: user.id }])
        .select()
        .single();

      if (partyError) throw partyError;

      // 2. Kendini kurucu (owner) olarak ekle
      const { error: memberError } = await supabase
        .from('party_members')
        .insert([{
          party_id: party.id,
          profile_id: user.id,
          display_name: user.user_metadata?.full_name || 'Kurucu',
          role: 'owner'
        }]);

      if (memberError) throw memberError;

      await get().fetchParties();
      return party.id;
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
      const { data: party, error: findError } = await supabase
        .from('parties')
        .select('id')
        .eq('join_code', joinCode.toUpperCase())
        .single();

      if (findError || !party) throw new Error("Grup bulunamadı veya kod geçersiz.");

      // Üye olarak ekle (RLS engellememeli, policy'yi hatırlayalım)
      const { error: joinError } = await supabase
        .from('party_members')
        .insert([{
          party_id: party.id,
          profile_id: user.id,
          display_name: user.user_metadata?.full_name || 'Üye',
          role: 'member'
        }]);

      if (joinError) {
        // Zaten üyeyse ignore edebiliriz (Supabase unique constraint vs varsa)
        if (joinError.code !== '23505') throw joinError; // 23505: unique violation
      }

      await get().fetchParties();
      return party.id;
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
