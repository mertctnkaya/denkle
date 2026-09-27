import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import { UserProfile } from '../types';

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;

  // Actions
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
  fetchProfile: (userId: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  profile: null,
  isLoading: true,

  initialize: async () => {
    // 1. Get current session
    const { data: { session } } = await supabase.auth.getSession();

    set({
      session,
      user: session?.user || null,
      isLoading: !session // If no session, loading is done
    });

    if (session?.user) {
      await get().fetchProfile(session.user.id);
    }

    // 2. Listen for auth changes
    supabase.auth.onAuthStateChange(async (_event, session) => {
      set({ session, user: session?.user || null });
      if (session?.user) {
        await get().fetchProfile(session.user.id);
      } else {
        set({ profile: null, isLoading: false });
      }
    });
  },

  fetchProfile: async (authId: string) => {
    try {
      set({ isLoading: true });
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_id', authId)
        .single();

      if (error) throw error;
      set({ profile: data as UserProfile, isLoading: false });
    } catch (error) {
      console.error('Error fetching profile:', error);
      set({ profile: null, isLoading: false });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, profile: null });
  },
}));
