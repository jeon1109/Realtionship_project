-- Relationship Compass personal-use access settings.
-- Run this after docs/supabase-schema.sql.
--
-- This disables Row Level Security so the app can read, insert, and update
-- records with the public anon key.
--
-- Use this only for a private/personal deployment.
-- If you share the app publicly, replace this with Supabase Auth + user-scoped RLS.

alter table relationship_entries disable row level security;
alter table healing_entries disable row level security;
alter table marriage_notes disable row level security;

grant usage on schema public to anon;
grant select, insert, update on relationship_entries to anon;
grant select, insert, update on healing_entries to anon;
grant select, insert, update on marriage_notes to anon;
