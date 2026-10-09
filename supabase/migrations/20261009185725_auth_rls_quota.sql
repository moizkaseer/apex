-- Builds on the July schema (init_apex_schema, entitlements_unique_index).
-- That design enabled RLS with no policies on purpose: the client would only
-- use supabase.auth and reach data through service-role server routes. This
-- migration switches to direct client access guarded by RLS, so the app reads
-- and writes its own rows with the publishable key. It adds:
--   1. owner-only policies on all tables
--   2. a profile row for every new account
--   3. profiles.settings for app preferences
--   4. a monthly AI quota the API routes charge through consume_ai_quota()

-- ── 1. policies: tables that carry user_id ──
do $$
declare t text;
begin
  foreach t in array array[
    'body_metric_entries', 'coach_conversations', 'daily_nutrition_budgets', 'injury_reports',
    'integration_connections', 'meal_logs', 'notification_preferences', 'nudge_logs',
    'plan_change_proposals', 'progress_photos', 'push_tokens', 'race_events',
    'readiness_scores', 'sleep_entries', 'training_plans', 'workout_logs'
  ] loop
    execute format(
      'create policy "own rows" on public.%I for all to authenticated
         using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id)', t);
  end loop;
end $$;

-- Entitlements are written by the RevenueCat webhook (service role); users only read.
create policy "read own entitlements" on public.entitlements
  for select to authenticated using ((select auth.uid()) = user_id);

-- Profiles are created by the trigger below and removed with the account.
create policy "read own profile" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);
create policy "update own profile" on public.profiles
  for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- ── 1b. policies: child tables, owned through their parent row ──
create policy "own rows" on public.chat_messages for all to authenticated
  using (exists (select 1 from public.coach_conversations p where p.id = conversation_id and p.user_id = (select auth.uid())))
  with check (exists (select 1 from public.coach_conversations p where p.id = conversation_id and p.user_id = (select auth.uid())));

create policy "own rows" on public.integration_data_modes for all to authenticated
  using (exists (select 1 from public.integration_connections p where p.id = integration_connection_id and p.user_id = (select auth.uid())))
  with check (exists (select 1 from public.integration_connections p where p.id = integration_connection_id and p.user_id = (select auth.uid())));

create policy "own rows" on public.meal_items for all to authenticated
  using (exists (select 1 from public.meal_logs p where p.id = meal_log_id and p.user_id = (select auth.uid())))
  with check (exists (select 1 from public.meal_logs p where p.id = meal_log_id and p.user_id = (select auth.uid())));

create policy "own rows" on public.return_to_run_stages for all to authenticated
  using (exists (select 1 from public.injury_reports p where p.id = injury_report_id and p.user_id = (select auth.uid())))
  with check (exists (select 1 from public.injury_reports p where p.id = injury_report_id and p.user_id = (select auth.uid())));

create policy "own rows" on public.training_plan_weeks for all to authenticated
  using (exists (select 1 from public.training_plans p where p.id = plan_id and p.user_id = (select auth.uid())))
  with check (exists (select 1 from public.training_plans p where p.id = plan_id and p.user_id = (select auth.uid())));

create policy "own rows" on public.workout_sets for all to authenticated
  using (exists (select 1 from public.workout_logs p where p.id = workout_log_id and p.user_id = (select auth.uid())))
  with check (exists (select 1 from public.workout_logs p where p.id = workout_log_id and p.user_id = (select auth.uid())));

create policy "own rows" on public.workouts for all to authenticated
  using (exists (
    select 1 from public.training_plan_weeks w join public.training_plans p on p.id = w.plan_id
    where w.id = plan_week_id and p.user_id = (select auth.uid())))
  with check (exists (
    select 1 from public.training_plan_weeks w join public.training_plans p on p.id = w.plan_id
    where w.id = plan_week_id and p.user_id = (select auth.uid())));

-- ── 2. a profile for every account ──
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), 'Athlete'))
  on conflict (id) do nothing;
  return new;
end;
$$;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Accounts created before this trigger existed.
insert into public.profiles (id)
select u.id from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id);

-- ── 3. app preferences ──
alter table public.profiles
  add column settings jsonb not null default '{}'::jsonb,
  add column updated_at timestamptz not null default now();

-- ── 4. monthly AI quota ──
-- No policies on purpose: clients can't read or edit it. The only way in is
-- consume_ai_quota(), which always counts against the caller's own uid.
create table public.ai_usage (
  user_id uuid not null references public.profiles (id) on delete cascade,
  month date not null,
  kind text not null check (kind in ('chat', 'vision')),
  count integer not null default 0,
  primary key (user_id, month, kind)
);
alter table public.ai_usage enable row level security;

create function public.consume_ai_quota(p_kind text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_month date := date_trunc('month', now())::date;
  v_limit integer := case p_kind when 'chat' then 300 when 'vision' then 90 else 0 end;
  v_count integer;
begin
  if v_uid is null or v_limit = 0 then
    return false;
  end if;

  insert into public.ai_usage as u (user_id, month, kind, count)
  values (v_uid, v_month, p_kind, 1)
  on conflict (user_id, month, kind)
    do update set count = u.count + 1
    where u.count < v_limit
  returning u.count into v_count;

  return v_count is not null;
end;
$$;
revoke execute on function public.consume_ai_quota(text) from public, anon;
grant execute on function public.consume_ai_quota(text) to authenticated;
