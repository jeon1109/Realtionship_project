import type { HealingEntry, JournalData, MarriageNote, RelationshipEntry } from "@/lib/journal-types";

export type JournalRepository = {
  load(): Promise<JournalData> | JournalData;
  saveRelationshipEntry(entry: RelationshipEntry): Promise<void> | void;
  saveHealingEntry(entry: HealingEntry): Promise<void> | void;
  updateHealingEntry(entry: HealingEntry): Promise<void> | void;
  saveMarriageNote(note: MarriageNote): Promise<void> | void;
};
