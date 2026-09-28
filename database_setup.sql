-- ==========================================
-- DENKLEŞ - SUPABASE MASTER SCHEMA
-- ==========================================

-- 1. PROFILES (Kullanıcılar)
create table public.profiles (
  id uuid references auth.users not null primary key,
  full_name text not null,
  avatar_url text,
  karma_score int default 100,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Herkes profilleri görebilir" on public.profiles
  for select using (true);

create policy "Kullanıcılar kendi profilini güncelleyebilir" on public.profiles
  for update using (auth.uid() = id);

-- (Opsiyonel) Yeni kayıt olan kullanıcıyı profiles tablosuna ekleyen Trigger
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id, 
    coalesce(new.raw_user_meta_data->>'full_name', 'İsimsiz Kullanıcı'), 
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. PARTIES (Gruplar)
create table public.parties (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  join_code text unique not null,
  created_by uuid references public.profiles(id) not null,
  is_archived boolean default false,
  created_at timestamptz default now()
);

alter table public.parties enable row level security;


-- 3. PARTY_MEMBERS (Grup Üyeleri ve Hayalet Profiller)
create table public.party_members (
  id uuid default gen_random_uuid() primary key,
  party_id uuid references public.parties(id) on delete cascade not null,
  profile_id uuid references public.profiles(id) on delete set null, -- NULL ise Hayalet(Shadow) profildir
  display_name text not null,
  role text default 'member' check (role in ('owner', 'admin', 'member')),
  added_by uuid references public.profiles(id) on delete set null,
  joined_at timestamptz default now()
);

alter table public.party_members enable row level security;


-- ==========================================
-- RLS: PARTIES & PARTY_MEMBERS GÜVENLİĞİ
-- ==========================================
-- Bir grubun verisini, sadece o gruba üye olanlar (party_members) görebilir.
create policy "Üyesi olduğum grupları görebilirim" on public.parties
  for select using (
    id in (
      select party_id from public.party_members where profile_id = auth.uid()
    )
  );

create policy "Kullanıcılar kendi gruplarını oluşturabilir" on public.parties
  for insert with check (auth.uid() = created_by);

create policy "Grubun üyeleri, gruptaki diğer üyeleri görebilir" on public.party_members
  for select using (
    party_id in (
      select party_id from public.party_members where profile_id = auth.uid()
    )
  );

create policy "Grup sahipleri ve yöneticiler üye ekleyebilir (veya kişi kendi katılabilir)" on public.party_members
  for insert with check (
    auth.uid() = profile_id OR 
    exists (
      select 1 from public.party_members pm 
      where pm.party_id = party_id 
      and pm.profile_id = auth.uid() 
      and pm.role in ('owner', 'admin')
    )
  );


-- 4. SHARES (Paylaşımlar / Harcamalar)
create table public.shares (
  id uuid default gen_random_uuid() primary key,
  party_id uuid references public.parties(id) on delete cascade not null,
  created_by uuid references public.party_members(id) on delete cascade not null,
  title text not null,
  total_amount numeric not null,
  category text default 'general',
  split_mode text default 'equal',
  status text default 'active',
  metadata jsonb, -- Ekstra veriler için (KM, Fiş, Araç ID)
  created_at timestamptz default now()
);

alter table public.shares enable row level security;

create policy "Grubun üyeleri harcamaları görebilir" on public.shares
  for select using (
    party_id in (
      select party_id from public.party_members where profile_id = auth.uid()
    )
  );

create policy "Grubun üyeleri harcama ekleyebilir" on public.shares
  for insert with check (
    party_id in (
      select party_id from public.party_members where profile_id = auth.uid()
    )
  );


-- 5. SHARE_PARTICIPANTS (Harcama Bölüşüm Detayları)
create table public.share_participants (
  id uuid default gen_random_uuid() primary key,
  share_id uuid references public.shares(id) on delete cascade not null,
  party_member_id uuid references public.party_members(id) on delete cascade not null,
  paid_amount numeric default 0, -- Kişinin kasadan anında ödediği para
  owed_amount numeric default 0, -- Bölüşüm motorunun biçtiği borç payı
  created_at timestamptz default now()
);

alter table public.share_participants enable row level security;

create policy "Grubun üyeleri harcama detaylarını görebilir" on public.share_participants
  for select using (
    share_id in (
      select s.id from public.shares s
      join public.party_members pm on s.party_id = pm.party_id
      where pm.profile_id = auth.uid()
    )
  );

create policy "Grubun üyeleri detay ekleyebilir" on public.share_participants
  for insert with check (
    share_id in (
      select s.id from public.shares s
      join public.party_members pm on s.party_id = pm.party_id
      where pm.profile_id = auth.uid()
    )
  );


-- 6. SETTLEMENTS (Ödemeler / Denkleştirmeler)
create table public.settlements (
  id uuid default gen_random_uuid() primary key,
  party_id uuid references public.parties(id) on delete cascade not null,
  payer_id uuid references public.party_members(id) on delete cascade not null,
  payee_id uuid references public.party_members(id) on delete cascade not null,
  amount numeric not null,
  status text default 'pending',
  created_at timestamptz default now()
);

alter table public.settlements enable row level security;

create policy "Grubun üyeleri ödemeleri görebilir" on public.settlements
  for select using (
    party_id in (
      select party_id from public.party_members where profile_id = auth.uid()
    )
  );


-- 7. VEHICLES (Araçlar - FuelSplit DNA)
create table public.vehicles (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  fuel_type text default 'gasoline',
  consumption numeric not null,
  created_at timestamptz default now()
);

alter table public.vehicles enable row level security;

create policy "Kullanıcılar kendi araçlarını görebilir" on public.vehicles
  for select using (auth.uid() = owner_id);

create policy "Kullanıcılar araç ekleyebilir" on public.vehicles
  for insert with check (auth.uid() = owner_id);
