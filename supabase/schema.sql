-- Land-it schema. Paste this into Supabase SQL Editor and hit Run.
-- Safe to re-run: uses IF NOT EXISTS / drops policies before recreating.

-- ============================================================
-- 1. PROFILES — 1:1 with auth.users, holds display info + admin flag
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  avatar text not null,
  email text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- Idempotent add for existing deployments.
alter table public.profiles add column if not exists email text;

-- Auto-create a profile row when a user signs up.
-- name + avatar come from the auth signup metadata we pass from the client.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  raw_name text;
  initials text;
begin
  raw_name := coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1));
  initials := upper(substring(regexp_replace(raw_name, '[^A-Za-z ]', '', 'g') from 1 for 1))
           || upper(coalesce(substring(split_part(raw_name, ' ', 2) from 1 for 1), ''));

  insert into public.profiles (id, name, avatar, is_admin, email)
  values (
    new.id,
    raw_name,
    initials,
    new.email = 'alalani29@sjs.org',
    new.email
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 2. CONTESTS
-- ============================================================
create table if not exists public.contests (
  id uuid primary key default gen_random_uuid(),
  created_by uuid references public.profiles(id) on delete set null,
  company text not null,
  logo text,
  role text not null,
  difficulty text not null,
  title text not null,
  description text not null,
  tech_stack text[] not null default '{}',
  prize text not null,
  deadline date,
  deliverables text[] not null default '{}',
  evaluation_criteria text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists contests_created_by_idx on public.contests(created_by);
create index if not exists contests_created_at_idx on public.contests(created_at desc);

-- ============================================================
-- 3. SUBMISSIONS
-- ============================================================
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  contest_id uuid not null references public.contests(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  user_name text not null,
  user_email text not null,
  github_url text not null,
  notes text,
  status text not null default 'Submitted',
  score integer,
  submitted_at timestamptz not null default now(),
  unique (contest_id, user_id)
);

-- For existing tables, add the snapshot columns if they're missing.
alter table public.submissions add column if not exists user_name  text not null default '';
alter table public.submissions add column if not exists user_email text not null default '';

create index if not exists submissions_contest_id_idx on public.submissions(contest_id);
create index if not exists submissions_user_id_idx on public.submissions(user_id);

-- ============================================================
-- 4. ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles    enable row level security;
alter table public.contests    enable row level security;
alter table public.submissions enable row level security;

-- Helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

-- ---- profiles ----
drop policy if exists "profiles are readable by everyone"   on public.profiles;
drop policy if exists "users can see their own profile"     on public.profiles;
drop policy if exists "users can update their own profile"  on public.profiles;

-- Own profile or admin. Other users' names/avatars are exposed via the
-- public.leaderboard view (for standings) and submissions snapshots.
create policy "users can see their own profile"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ---- contests ----
drop policy if exists "contests are readable by everyone"    on public.contests;
drop policy if exists "authenticated users can insert"       on public.contests;
drop policy if exists "creator or admin can update"          on public.contests;
drop policy if exists "creator or admin can delete"          on public.contests;

create policy "contests are readable by everyone"
  on public.contests for select
  using (true);

create policy "authenticated users can insert"
  on public.contests for insert
  with check (auth.uid() = created_by);

create policy "creator or admin can update"
  on public.contests for update
  using (auth.uid() = created_by or public.is_admin());

create policy "creator or admin can delete"
  on public.contests for delete
  using (auth.uid() = created_by or public.is_admin());

-- ---- submissions ----
drop policy if exists "submissions visible to owner, contest creator, or admin" on public.submissions;
drop policy if exists "users can insert their own submission"                  on public.submissions;
drop policy if exists "creator or admin can update status/score"               on public.submissions;
drop policy if exists "owner or admin can delete"                              on public.submissions;

create policy "submissions visible to owner, contest creator, or admin"
  on public.submissions for select
  using (
    auth.uid() = user_id
    or public.is_admin()
    or exists (
      select 1 from public.contests c
      where c.id = submissions.contest_id and c.created_by = auth.uid()
    )
  );

create policy "users can insert their own submission"
  on public.submissions for insert
  with check (auth.uid() = user_id);

create policy "creator or admin can update status/score"
  on public.submissions for update
  using (
    public.is_admin()
    or exists (
      select 1 from public.contests c
      where c.id = submissions.contest_id and c.created_by = auth.uid()
    )
  );

create policy "owner or admin can delete"
  on public.submissions for delete
  using (auth.uid() = user_id or public.is_admin());

-- ============================================================
-- 5. PUBLIC LEADERBOARD VIEW
-- Exposes only non-sensitive fields (name, avatar, score, status)
-- so anyone can see the standings on a contest.
-- Runs as the view owner so it bypasses submissions RLS, but only
-- the whitelisted columns are projected.
-- ============================================================
create or replace view public.leaderboard
with (security_invoker = off) as
  select
    s.contest_id,
    s.user_name as name,
    upper(substring(regexp_replace(s.user_name, '[^A-Za-z ]', '', 'g') from 1 for 1))
      || upper(coalesce(substring(split_part(s.user_name, ' ', 2) from 1 for 1), '')) as avatar,
    coalesce(s.score, 0) as score,
    s.status
  from public.submissions s;

grant select on public.leaderboard to anon, authenticated;
