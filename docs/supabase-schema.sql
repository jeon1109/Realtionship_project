-- Relationship Compass Supabase schema.
-- Single-user MVP note:
-- This schema is meant for a private/personal deployment without login.
-- If this app is public, add Supabase Auth and RLS before storing sensitive data.

create table if not exists relationship_entries (
  id text primary key,
  created_at timestamptz not null,
  entry_date date not null,
  activity text not null,
  laughed_together text not null,
  felt_comfortable text not null,
  felt_considered text not null,
  felt_authentic text not null,
  wish_to_meet_again text not null default '',
  memo text not null default ''
);

create index if not exists relationship_entries_created_at_idx
on relationship_entries (created_at desc);

create table if not exists healing_entries (
  id text primary key,
  created_at timestamptz not null,
  entry_date date not null,
  event text not null,
  feelings text[] not null default '{}',
  interpreted_meaning text not null default '',
  other_possibilities text not null default '',
  emotion_or_value text not null,
  wanted text[] not null default '{}',
  timing text not null,
  private_release text not null default '',
  revisit_date date not null,
  revisit_same_feeling text,
  revisit_memo text
);

create index if not exists healing_entries_created_at_idx
on healing_entries (created_at desc);

create table if not exists marriage_notes (
  id text primary key,
  created_at timestamptz not null,
  entry_date date not null,
  topic text not null,
  notes text not null,
  gentle_next_step text not null default ''
);

create index if not exists marriage_notes_created_at_idx
on marriage_notes (created_at desc);
