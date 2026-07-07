# Supabase Setup Guide

This project currently stores journal data in browser `localStorage`. Supabase is prepared as a future storage option, but it is not enabled by default.

## 1. Create a Supabase Project

1. Go to Supabase and create a new project.
2. Open `Project Settings` -> `API`.
3. Copy:
   - Project URL
   - anon public key

## 2. Add Local Environment Variables

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_JOURNAL_STORAGE=local
```

Keep `NEXT_PUBLIC_JOURNAL_STORAGE=local` until the UI is intentionally switched to Supabase mode.

## 3. Suggested Tables

For the first Supabase version, keep the app data shape flexible by storing each entry as JSONB. This preserves the MVP data model and makes migration from localStorage simple.

```sql
create table relationship_entries (
  id uuid primary key default gen_random_uuid(),
  entry_id text generated always as (data ->> 'id') stored unique,
  data jsonb not null,
  created_at timestamptz not null default now()
);

create table healing_entries (
  id uuid primary key default gen_random_uuid(),
  entry_id text generated always as (data ->> 'id') stored unique,
  data jsonb not null,
  created_at timestamptz not null default now()
);

create table marriage_notes (
  id uuid primary key default gen_random_uuid(),
  entry_id text generated always as (data ->> 'id') stored unique,
  data jsonb not null,
  created_at timestamptz not null default now()
);
```

## 4. Row Level Security Direction

Do not ship shared cloud storage without a privacy plan.

Recommended path:

1. Add Supabase Auth.
2. Add `user_id uuid references auth.users(id)` to each table.
3. Enable RLS.
4. Add policies so each user can only read/write their own entries.

Example future policy shape:

```sql
alter table relationship_entries enable row level security;

create policy "Users can read their own relationship entries"
on relationship_entries for select
using (auth.uid() = user_id);

create policy "Users can insert their own relationship entries"
on relationship_entries for insert
with check (auth.uid() = user_id);
```

## 5. Files Added for Supabase Readiness

- `.env.example`: documents required environment variables.
- `lib/supabase/client.ts`: creates a browser Supabase client only when env vars are present.
- `lib/storage/journal-repository.ts`: repository contract shared by local and future remote storage.
- `lib/storage/supabase-journal-store.ts`: first Supabase adapter draft.

## 6. Current Default

The app still uses:

```text
localStorage key: relationship-compass:v1
```

This keeps the current MVP behavior stable while making the storage boundary ready for a later Supabase migration.
