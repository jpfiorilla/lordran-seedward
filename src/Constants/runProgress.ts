import type {
  KeyId,
  KeyItemId,
  MajorEventId,
  BossId,
  ShortcutId,
  BonfireId,
} from "./schema";

/**
 * Initial run progress: empty arrays (defeated = false for all bosses, etc.).
 */
export function getInitialAcquiredKeys(): KeyId[] {
  return [];
}

export function getInitialAcquiredKeyItems(): KeyItemId[] {
  return [];
}

export function getInitialMajorEventsCompleted(): MajorEventId[] {
  return [];
}

export function getInitialBossesDefeated(): BossId[] {
  return [];
}

export function getInitialShortcutsUnlocked(): ShortcutId[] {
  return [];
}

export function getInitialBonfiresLit(): BonfireId[] {
  return [];
}
