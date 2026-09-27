export interface UserProfile {
  id: string; // The generic UUID (NOT auth_id)
  auth_id: string | null;
  is_shadow: boolean;
  created_by: string | null;
  full_name: string;
  email: string | null;
  avatar_url: string | null;
  karma_score: number;
  iban: string | null;
  privacy_settings: {
    iban: 'public' | 'group' | 'private';
    karma: 'public' | 'group' | 'private';
  };
  created_at: string;
  updated_at: string;
}
