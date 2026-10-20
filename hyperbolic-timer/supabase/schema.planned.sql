-- =====================================================================================
-- PLANNED SCHEMA: NOT APPLIED, NOT TESTED.
-- Proposed 2026-10-20. Implement together with Supabase auth in the designated Code
-- Platoon lesson. Until then the app runs on localStorage and nothing here has been run.
--
-- Differences from schema.sql: user_id is required and defaults to the signed-in user,
-- tags.is_starter, a read-only starter_tags template table, a signup trigger that copies
-- the templates into each new user's own tags, and row-level security.
-- =====================================================================================

create table if not exists public.tasks (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title         text not null check (length(btrim(title)) > 0),
  rounds        int  not null default 8  check (rounds > 0),
  work_seconds  int  not null default 20 check (work_seconds > 0),
  rest_seconds  int  not null default 10 check (rest_seconds >= 0),
  created_at    timestamptz not null default now()
);

create table if not exists public.tags (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name        text not null check (length(btrim(name)) > 0),
  is_starter  boolean not null default false,  -- true only for copies of starter_tags
  created_at  timestamptz not null default now()
);

-- Tag names are unique per user, ignoring case and surrounding spaces.
create unique index if not exists tags_name_unique
  on public.tags (user_id, lower(btrim(name)));

-- Many-to-many join. Deleting a task or tag removes only link rows, never the other side.
create table if not exists public.task_tags (
  task_id  uuid not null references public.tasks (id) on delete cascade,
  tag_id   uuid not null references public.tags  (id) on delete cascade,
  primary key (task_id, tag_id)
);

create index if not exists task_tags_tag_id_idx on public.task_tags (tag_id);
create index if not exists tasks_user_id_idx    on public.tasks (user_id);

-- Starter tag templates: no user data, readable by signed-in users, edited only by you
-- in the SQL editor.
create table if not exists public.starter_tags (
  name        text primary key check (length(btrim(name)) > 0),
  sort_order  int not null default 0
);

insert into public.starter_tags (name, sort_order)
values ('HIIT', 1), ('Strength', 2), ('Tabata', 3), ('Bodyweight', 4)
on conflict (name) do nothing;  -- safe to run more than once

-- Copy the templates into one user's own tags. Idempotent: the unique index on tags
-- stops duplicates. Runs only at account creation, so deleted starter tags stay deleted.
create or replace function public.seed_starter_tags(p_user_id uuid) returns void
language sql security definer set search_path = public as $$
  insert into public.tags (user_id, name, is_starter)
  select p_user_id, name, true from public.starter_tags order by sort_order
  on conflict do nothing;
$$;

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  perform public.seed_starter_tags(new.id);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Not callable from the browser.
revoke execute on function public.seed_starter_tags(uuid) from public, anon, authenticated;
revoke execute on function public.handle_new_user()       from public, anon, authenticated;

-- Row level security: each user sees and changes only their own rows.
alter table public.tasks         enable row level security;
alter table public.tags          enable row level security;
alter table public.task_tags     enable row level security;
alter table public.starter_tags  enable row level security;

create policy "own tasks" on public.tasks for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "own tags" on public.tags for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "read starter templates" on public.starter_tags for select to authenticated
  using (true);

-- A link is allowed only when both the task and the tag belong to the user.
create policy "own task_tags" on public.task_tags for all to authenticated
  using (exists (
    select 1 from public.tasks t where t.id = task_id and t.user_id = (select auth.uid())))
  with check (
    exists (select 1 from public.tasks t where t.id = task_id and t.user_id = (select auth.uid()))
    and exists (select 1 from public.tags g where g.id = tag_id and g.user_id = (select auth.uid())));

-- One-off, only if accounts existed before the trigger:
--   select public.seed_starter_tags(id) from auth.users;
