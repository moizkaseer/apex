-- Index every foreign key: the RLS policies added in auth_rls_quota filter on
-- these columns on every query, and cascading account deletes walk them.
create index if not exists body_metric_entries_user_id_idx on public.body_metric_entries (user_id);
create index if not exists chat_messages_conversation_id_idx on public.chat_messages (conversation_id);
create index if not exists coach_conversations_user_id_idx on public.coach_conversations (user_id);
create index if not exists injury_reports_user_id_idx on public.injury_reports (user_id);
create index if not exists integration_data_modes_integration_connection_id_idx on public.integration_data_modes (integration_connection_id);
create index if not exists meal_items_meal_log_id_idx on public.meal_items (meal_log_id);
create index if not exists meal_logs_user_id_idx on public.meal_logs (user_id);
create index if not exists nudge_logs_user_id_idx on public.nudge_logs (user_id);
create index if not exists plan_change_proposals_user_id_idx on public.plan_change_proposals (user_id);
create index if not exists progress_photos_user_id_idx on public.progress_photos (user_id);
create index if not exists push_tokens_user_id_idx on public.push_tokens (user_id);
create index if not exists race_events_user_id_idx on public.race_events (user_id);
create index if not exists return_to_run_stages_injury_report_id_idx on public.return_to_run_stages (injury_report_id);
create index if not exists training_plan_weeks_plan_id_idx on public.training_plan_weeks (plan_id);
create index if not exists training_plans_race_event_id_idx on public.training_plans (race_event_id);
create index if not exists training_plans_user_id_idx on public.training_plans (user_id);
create index if not exists workout_logs_user_id_idx on public.workout_logs (user_id);
create index if not exists workout_logs_workout_id_idx on public.workout_logs (workout_id);
create index if not exists workout_sets_workout_log_id_idx on public.workout_sets (workout_log_id);
create index if not exists workouts_plan_week_id_idx on public.workouts (plan_week_id);
