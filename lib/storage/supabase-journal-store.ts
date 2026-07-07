"use client";

import type { HealingEntry, MarriageNote, RelationshipEntry } from "@/lib/journal-types";
import { emptyJournalData } from "@/lib/journal-store";
import type { JournalRepository } from "@/lib/storage/journal-repository";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const TABLES = {
  relationshipEntries: "relationship_entries",
  healingEntries: "healing_entries",
  marriageNotes: "marriage_notes",
} as const;

function requireSupabase() {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  return supabase;
}

async function insertJson(table: string, entry: unknown) {
  const supabase = requireSupabase();
  const { error } = await supabase.from(table).insert({ data: entry });

  if (error) {
    throw error;
  }
}

export const supabaseJournalStore: JournalRepository = {
  async load() {
    const supabase = requireSupabase();
    const [relationshipEntries, healingEntries, marriageNotes] = await Promise.all([
      supabase.from(TABLES.relationshipEntries).select("data").order("created_at", { ascending: false }),
      supabase.from(TABLES.healingEntries).select("data").order("created_at", { ascending: false }),
      supabase.from(TABLES.marriageNotes).select("data").order("created_at", { ascending: false }),
    ]);

    if (relationshipEntries.error) throw relationshipEntries.error;
    if (healingEntries.error) throw healingEntries.error;
    if (marriageNotes.error) throw marriageNotes.error;

    return {
      relationshipEntries: relationshipEntries.data.map((row) => row.data as RelationshipEntry),
      healingEntries: healingEntries.data.map((row) => row.data as HealingEntry),
      marriageNotes: marriageNotes.data.map((row) => row.data as MarriageNote),
    };
  },
  saveRelationshipEntry(entry) {
    return insertJson(TABLES.relationshipEntries, entry);
  },
  saveHealingEntry(entry) {
    return insertJson(TABLES.healingEntries, entry);
  },
  async updateHealingEntry(entry) {
    const supabase = requireSupabase();
    const { error } = await supabase
      .from(TABLES.healingEntries)
      .update({ data: entry })
      .eq("entry_id", entry.id);

    if (error) {
      throw error;
    }
  },
  saveMarriageNote(note) {
    return insertJson(TABLES.marriageNotes, note);
  },
};

export const supabaseFallbackData = emptyJournalData;
