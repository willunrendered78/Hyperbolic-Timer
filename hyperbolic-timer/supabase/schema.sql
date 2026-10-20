-- =====================================================================================
-- NOT APPLIED. SUPERSEDED by schema.planned.sql: do not run this file.
-- It was the first draft: nullable user_id and row level security off.
-- Kept for reference until the auth lesson.
-- =====================================================================================

-- Hyperbolic Timer schema (MVP): tasks, tags, task_tags.
-- Run in the Supabase SQL editor. Matches the wireframes ("Simplified data relationships").
-- Not included on purpose: workout history, public profile table, auth screens.

create table if not exists public.tasks (
  id            uuid primary key default gen_random_uuid(),
  -- Nullable until the auth lesson; then ownership is enforced by row-level security.
  user_id       uuid references auth.users (id) on delete cascade,
  title         text not null check (length(btrim(title)) > 0),
  rounds        int  not null default 8  check (rounds > 0),
  work_seconds  int  not null default 20 check (work_seconds > 0),
  rest_seconds  int  not null default 10 check (rest_seconds >= 0),
  created_at    timestamptz not null default now()
);

create table if not exists public.tags (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users (id) on delete cascade,
  name        text not null check (length(btrim(name)) > 0),
  created_at  timestamptz not null default now()
);

-- Tag names are unique ignoring case (per user once auth exists; shared while user_id is null).
create unique index if not exists tags_name_unique
  on public.tags (coalesce(user_id, '00000000-0000-0000-0000-000000000000'::uuid), lower(btrim(name)));

-- Many-to-many join. Deleting a task or a tag removes only the link rows,
-- so deleting a tag never deletes a workout.
create table if not exists public.task_tags (
  task_id  uuid not null references public.tasks (id) on delete cascade,
  tag_id   uuid not null references public.tags  (id) on delete cascade,
  primary key (task_id, tag_id)
);

create index if not exists task_tags_tag_id_idx on public.task_tags (tag_id);
create index if not exists tasks_user_id_idx    on public.tasks (user_id);
create index if not exists tags_user_id_idx     on public.tags (user_id);

-- Row level security is intentionally NOT enabled yet (no auth in the MVP), so anyone with
-- the anon key can read and write these tables. Enable the policies below in the auth lesson:
--
-- alter table public.tasks     enable row level security;
-- alter table public.tags      enable row level security;
-- alter table public.task_tags enable row level security;
--
-- create policy "own tasks" on public.tasks for all
--   using (user_id = auth.uid()) with check (user_id = auth.uid());
-- create policy "own tags" on public.tags for all
--   using (user_id = auth.uid()) with check (user_id = auth.uid());
-- create policy "own task_tags" on public.task_tags for all
--   using (exists (select 1 from public.tasks t where t.id = task_id and t.user_id = auth.uid()))
--   with check (exists (select 1 from public.tasks t where t.id = task_id and t.user_id = auth.uid()));
