"use client";

import type { HealingEntry, JournalData, MarriageNote, RelationshipEntry } from "@/lib/journal-types";

const STORAGE_KEY = "relationship-compass:v1";

export const emptyJournalData: JournalData = {
  relationshipEntries: [],
  healingEntries: [],
  marriageNotes: [],
};

function readData(): JournalData {
  if (typeof window === "undefined") return emptyJournalData;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return emptyJournalData;

  try {
    return { ...emptyJournalData, ...JSON.parse(raw) };
  } catch {
    return emptyJournalData;
  }
}

function writeData(data: JournalData) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export const journalStore = {
  load: readData,
  saveRelationshipEntry(entry: RelationshipEntry) {
    const data = readData();
    writeData({
      ...data,
      relationshipEntries: [entry, ...data.relationshipEntries],
    });
  },
  saveHealingEntry(entry: HealingEntry) {
    const data = readData();
    writeData({
      ...data,
      healingEntries: [entry, ...data.healingEntries],
    });
  },
  updateHealingEntry(entry: HealingEntry) {
    const data = readData();
    writeData({
      ...data,
      healingEntries: data.healingEntries.map((item) => (item.id === entry.id ? entry : item)),
    });
  },
  saveMarriageNote(note: MarriageNote) {
    const data = readData();
    writeData({
      ...data,
      marriageNotes: [note, ...data.marriageNotes],
    });
  },
};
