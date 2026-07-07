"use client";

import type { HealingEntry, JournalData, MarriageNote, RelationshipEntry } from "@/lib/journal-types";
import type { JournalRepository } from "@/lib/storage/journal-repository";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const TABLES = {
  relationshipEntries: "relationship_entries",
  healingEntries: "healing_entries",
  marriageNotes: "marriage_notes",
} as const;

type RelationshipRow = {
  id: string;
  created_at: string;
  entry_date: string;
  activity: string;
  laughed_together: RelationshipEntry["laughedTogether"];
  felt_comfortable: RelationshipEntry["feltComfortable"];
  felt_considered: RelationshipEntry["feltConsidered"];
  felt_authentic: RelationshipEntry["feltAuthentic"];
  wish_to_meet_again: string;
  memo: string;
};

type HealingRow = {
  id: string;
  created_at: string;
  entry_date: string;
  event: string;
  feelings: HealingEntry["feelings"];
  interpreted_meaning: string;
  other_possibilities: string;
  emotion_or_value: HealingEntry["emotionOrValue"];
  wanted: HealingEntry["wanted"];
  timing: HealingEntry["timing"];
  private_release: string;
  revisit_date: string;
  revisit_same_feeling: HealingEntry["revisitSameFeeling"] | null;
  revisit_memo: string | null;
};

type MarriageRow = {
  id: string;
  created_at: string;
  entry_date: string;
  topic: MarriageNote["topic"];
  notes: string;
  gentle_next_step: string;
};

function requireSupabase() {
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  return supabase;
}

function relationshipToRow(entry: RelationshipEntry): RelationshipRow {
  return {
    id: entry.id,
    created_at: entry.createdAt,
    entry_date: entry.date,
    activity: entry.activity,
    laughed_together: entry.laughedTogether,
    felt_comfortable: entry.feltComfortable,
    felt_considered: entry.feltConsidered,
    felt_authentic: entry.feltAuthentic,
    wish_to_meet_again: entry.wishToMeetAgain,
    memo: entry.memo,
  };
}

function rowToRelationship(row: RelationshipRow): RelationshipEntry {
  return {
    id: row.id,
    createdAt: row.created_at,
    date: row.entry_date,
    activity: row.activity,
    laughedTogether: row.laughed_together,
    feltComfortable: row.felt_comfortable,
    feltConsidered: row.felt_considered,
    feltAuthentic: row.felt_authentic,
    wishToMeetAgain: row.wish_to_meet_again,
    memo: row.memo,
  };
}

function healingToRow(entry: HealingEntry): HealingRow {
  return {
    id: entry.id,
    created_at: entry.createdAt,
    entry_date: entry.date,
    event: entry.event,
    feelings: entry.feelings,
    interpreted_meaning: entry.interpretedMeaning,
    other_possibilities: entry.otherPossibilities,
    emotion_or_value: entry.emotionOrValue,
    wanted: entry.wanted,
    timing: entry.timing,
    private_release: entry.privateRelease,
    revisit_date: entry.revisitDate,
    revisit_same_feeling: entry.revisitSameFeeling ?? null,
    revisit_memo: entry.revisitMemo ?? null,
  };
}

function rowToHealing(row: HealingRow): HealingEntry {
  return {
    id: row.id,
    createdAt: row.created_at,
    date: row.entry_date,
    event: row.event,
    feelings: row.feelings ?? [],
    interpretedMeaning: row.interpreted_meaning,
    otherPossibilities: row.other_possibilities,
    emotionOrValue: row.emotion_or_value,
    wanted: row.wanted ?? [],
    timing: row.timing,
    privateRelease: row.private_release,
    revisitDate: row.revisit_date,
    revisitSameFeeling: row.revisit_same_feeling ?? undefined,
    revisitMemo: row.revisit_memo ?? undefined,
  };
}

function marriageToRow(note: MarriageNote): MarriageRow {
  return {
    id: note.id,
    created_at: note.createdAt,
    entry_date: note.date,
    topic: note.topic,
    notes: note.notes,
    gentle_next_step: note.gentleNextStep,
  };
}

function rowToMarriage(row: MarriageRow): MarriageNote {
  return {
    id: row.id,
    createdAt: row.created_at,
    date: row.entry_date,
    topic: row.topic,
    notes: row.notes,
    gentleNextStep: row.gentle_next_step,
  };
}

export const supabaseJournalStore: JournalRepository = {
  async load() {
    const supabase = requireSupabase();
    const [relationshipEntries, healingEntries, marriageNotes] = await Promise.all([
      supabase.from(TABLES.relationshipEntries).select("*").order("created_at", { ascending: false }),
      supabase.from(TABLES.healingEntries).select("*").order("created_at", { ascending: false }),
      supabase.from(TABLES.marriageNotes).select("*").order("created_at", { ascending: false }),
    ]);

    if (relationshipEntries.error) throw relationshipEntries.error;
    if (healingEntries.error) throw healingEntries.error;
    if (marriageNotes.error) throw marriageNotes.error;

    const data: JournalData = {
      relationshipEntries: (relationshipEntries.data as RelationshipRow[]).map(rowToRelationship),
      healingEntries: (healingEntries.data as HealingRow[]).map(rowToHealing),
      marriageNotes: (marriageNotes.data as MarriageRow[]).map(rowToMarriage),
    };

    return data;
  },
  async saveRelationshipEntry(entry) {
    const supabase = requireSupabase();
    const { error } = await supabase.from(TABLES.relationshipEntries).upsert(relationshipToRow(entry));

    if (error) {
      throw error;
    }
  },
  async saveHealingEntry(entry) {
    const supabase = requireSupabase();
    const { error } = await supabase.from(TABLES.healingEntries).upsert(healingToRow(entry));

    if (error) {
      throw error;
    }
  },
  async updateHealingEntry(entry) {
    const supabase = requireSupabase();
    const { error } = await supabase.from(TABLES.healingEntries).upsert(healingToRow(entry));

    if (error) {
      throw error;
    }
  },
  async saveMarriageNote(note) {
    const supabase = requireSupabase();
    const { error } = await supabase.from(TABLES.marriageNotes).upsert(marriageToRow(note));

    if (error) {
      throw error;
    }
  },
};
