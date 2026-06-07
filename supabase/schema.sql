-- ============================================================
-- postadoria database schema
-- Run this in Supabase → SQL Editor → New Query → Run
-- ============================================================

-- ----- profiles -----
-- Mirrors auth.users with app-specific fields. Auto-created on signup via trigger.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  user_type text default 'personal',        -- founder | creator | agency | enterprise | small_business | personal
  plan text default 'trial',                 -- trial | creator | pro
  onboarded boolean default false,
  stripe_customer_id text,
  created_at timestamptz default now()
);

-- ----- connections -----
-- One row per connected social account.
create table if not exists public.connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  platform text not null,                    -- bluesky | twitter | instagram | linkedin | facebook | tiktok | youtube | threads | pinterest
  account_handle text,                       -- @handle / display
  account_name text,
  -- Credentials/tokens. For Bluesky we store an app-password session;
  -- for OAuth platforms this holds access/refresh tokens. Encrypted at rest by Supabase.
  credentials jsonb,
  status text default 'connected',           -- connected | error | expired
  created_at timestamptz default now(),
  unique (user_id, platform, account_handle)
);

-- ----- posts -----
-- One row per composed post (master record).
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  master_caption text,
  post_type text default 'text',             -- text | image | video
  media_url text,                            -- stored media (Supabase Storage) if any
  status text default 'draft',               -- draft | scheduled | publishing | posted | failed
  scheduled_at timestamptz,                  -- when to publish (null for drafts / publish-now)
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ----- post_targets -----
-- One row per (post × platform). Holds the per-platform caption + publish result.
create table if not exists public.post_targets (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  connection_id uuid references public.connections(id) on delete set null,
  platform text not null,
  caption text,                              -- resolved caption (override or master)
  status text default 'pending',             -- pending | posted | failed
  remote_id text,                            -- id/uri returned by the platform after posting
  error text,                                -- failure reason if status = failed
  posted_at timestamptz
);

-- ----- indexes -----
create index if not exists idx_posts_user on public.posts(user_id);
create index if not exists idx_posts_scheduled on public.posts(status, scheduled_at);
create index if not exists idx_targets_post on public.post_targets(post_id);
create index if not exists idx_connections_user on public.connections(user_id);

-- ============================================================
-- Auto-create a profile row when a new auth user signs up
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Row Level Security — users can only touch their own rows
-- ============================================================
alter table public.profiles      enable row level security;
alter table public.connections   enable row level security;
alter table public.posts         enable row level security;
alter table public.post_targets  enable row level security;

-- profiles
drop policy if exists "own profile read"   on public.profiles;
drop policy if exists "own profile update" on public.profiles;
create policy "own profile read"   on public.profiles for select using (auth.uid() = id);
create policy "own profile update" on public.profiles for update using (auth.uid() = id);

-- connections
drop policy if exists "own connections" on public.connections;
create policy "own connections" on public.connections
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- posts
drop policy if exists "own posts" on public.posts;
create policy "own posts" on public.posts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- post_targets (scoped via parent post ownership)
drop policy if exists "own post targets" on public.post_targets;
create policy "own post targets" on public.post_targets
  for all using (
    exists (select 1 from public.posts p where p.id = post_targets.post_id and p.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.posts p where p.id = post_targets.post_id and p.user_id = auth.uid())
  );
