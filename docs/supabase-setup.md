# Supabase Setup Guide

Relationship Compass uses browser `localStorage` by default. Supabase can now be enabled as the active storage option with environment variables.

## 1. Create a Supabase Project

1. Create a Supabase project.
2. Open `Project Settings` -> `API`.
3. Copy:
   - Project URL
   - anon public key 
   -  - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhanVwa3planp4bG5jaHlmeG9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0MjY0ODEsImV4cCI6MjA5OTAwMjQ4MX0.UKa6Clqzf8-f-cFoH1Qj39T0JHE1MhVfLZenAqDK9ck

## 2. Create Tables

Open the Supabase SQL Editor and run the SQL in:

```text
docs/supabase-schema.sql
```

The app maps each journal model to real table columns:

- `RelationshipEntry` -> `relationship_entries`
- `HealingEntry` -> `healing_entries`
- `MarriageNote` -> `marriage_notes`

## 3. Add Environment Variables

Create `.env.local` in the project root for local development:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_JOURNAL_STORAGE=supabase
```

Use `NEXT_PUBLIC_JOURNAL_STORAGE=local` when you want to keep the browser-only MVP behavior.

On Vercel, add the same variables under:

```text
Project Settings -> Environment Variables
```

Then redeploy.

## 4. Run Locally

After creating `.env.local`, restart the dev server:

```bash
npm run dev -- -p 3001
```

If Supabase is configured correctly, new journal entries will be saved to Supabase instead of localStorage.

## 5. Privacy and RLS Direction

The current app still has no login. With `NEXT_PUBLIC_JOURNAL_STORAGE=supabase`, data is stored in your Supabase project.

For a private single-user MVP, the simplest setup is to use the schema as-is and keep the app URL private. Do not treat this as secure multi-user storage.

Before making the app public, add Supabase Auth and Row Level Security.

Recommended path:

1. Add Supabase Auth.
2. Add `user_id uuid references auth.users(id)` to each table.
3. Enable RLS.
4. Add policies so each user can only read/write their own entries.

Example future policy shape:

```sql
alter table relationship_entries add column user_id uuid references auth.users(id);
alter table relationship_entries enable row level security;

create policy "Users can read their own relationship entries"
on relationship_entries for select
using (auth.uid() = user_id);

create policy "Users can insert their own relationship entries"
on relationship_entries for insert
with check (auth.uid() = user_id);
```

## 6. Files Used by Supabase Storage

- `.env.example`: documents required environment variables.
- `docs/supabase-schema.sql`: SQL schema for the mapped Supabase tables.
- `lib/supabase/client.ts`: creates a browser Supabase client when env vars are present.
- `lib/storage/journal-repository.ts`: repository contract shared by local and Supabase storage.
- `lib/storage/supabase-journal-store.ts`: Supabase adapter with explicit column mapping.
- `lib/journal-store.ts`: selects localStorage or Supabase based on `NEXT_PUBLIC_JOURNAL_STORAGE`.

## 7. Migration Note

Existing localStorage data is not automatically uploaded to Supabase yet.

Current localStorage key:

```text
relationship-compass:v1
```

A later migration feature can read this key and insert the records through `supabaseJournalStore`.
