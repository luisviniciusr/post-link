-- postadoria auth/profile fix
-- Run this once in Supabase SQL Editor.
-- It removes the failing auth trigger and lets the signed-in user create/update their own profile row.

-- Ensure the profiles table has the columns the app expects, even if it was created earlier with a different shape.
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists name text;
alter table public.profiles add column if not exists user_type text default 'personal';
alter table public.profiles add column if not exists plan text default 'trial';
alter table public.profiles add column if not exists onboarded boolean default false;
alter table public.profiles add column if not exists stripe_customer_id text;
alter table public.profiles add column if not exists created_at timestamptz default now();

-- The auth trigger is what is causing "Database error saving new user".
-- The React app now creates the profile row after auth succeeds, so this trigger is no longer needed.
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

alter table public.profiles enable row level security;

drop policy if exists "own profile read" on public.profiles;
drop policy if exists "own profile insert" on public.profiles;
drop policy if exists "own profile update" on public.profiles;

create policy "own profile read"
  on public.profiles for select
  using (auth.uid() = id);

create policy "own profile insert"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "own profile update"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);
