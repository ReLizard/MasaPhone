import { SlotConfig, createEmptySlot } from './MasanielloEngine';

const STORAGE_KEY = 'masaphone_web_slots_v2';
const TOTAL_SLOTS = 6;

export function loadSlots(): SlotConfig[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return Array.from({ length: TOTAL_SLOTS }, (_, i) => createEmptySlot(i));
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return Array.from({ length: TOTAL_SLOTS }, (_, i) => createEmptySlot(i));
    }
    return Array.from({ length: TOTAL_SLOTS }, (_, i) => {
      if (i < parsed.length && parsed[i]) {
        const s = parsed[i];
        return {
          name: s.name || `Masa ${i + 1}`,
          isConfigured: !!s.isConfigured,
          initialBankroll: s.initialBankroll || "35.00",
          totalEvents: typeof s.totalEvents === 'number' ? s.totalEvents : 10,
          targetWins: typeof s.targetWins === 'number' ? s.targetWins : 7,
          odds: Array.isArray(s.odds) && s.odds.length > 0 ? s.odds : Array(100).fill("2.00"),
          results: Array.isArray(s.results) ? s.results : [],
          actualStakes: Array.isArray(s.actualStakes) ? s.actualStakes : [],
          notes: Array.isArray(s.notes) ? s.notes : [],
        };
      }
      return createEmptySlot(i);
    });
  } catch (err) {
    console.error('Error loading slots from localStorage', err);
    return Array.from({ length: TOTAL_SLOTS }, (_, i) => createEmptySlot(i));
  }
}

export function saveSlots(slots: SlotConfig[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slots));
  } catch (err) {
    console.error('Error saving slots to localStorage', err);
  }
}

export function exportAllData(slots: SlotConfig[]): string {
  return JSON.stringify({
    version: '2.0',
    exportDate: new Date().toISOString(),
    slots
  }, null, 2);
}

export function importAllData(jsonStr: string): SlotConfig[] | null {
  try {
    const data = JSON.parse(jsonStr);
    const slots = data.slots || data;
    if (Array.isArray(slots)) {
      saveSlots(slots);
      return loadSlots();
    }
  } catch (err) {
    console.error('Error importing slots', err);
  }
  return null;
}
