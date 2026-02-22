import type { KeyId, KeyItemId, BellOfAwakeningId, BossId, ShortcutId } from './schema';

/**
 * Initial run progress: empty arrays (defeated = false for all bosses, etc.).
 */
export function getInitialAcquiredKeys(): KeyId[] {
  return [];
}

export function getInitialAcquiredKeyItems(): KeyItemId[] {
  return [];
}

export function getInitialBellsRung(): BellOfAwakeningId[] {
  return [];
}

export function getInitialBossesDefeated(): BossId[] {
  return [];
}

export function getInitialShortcutsUnlocked(): ShortcutId[] {
  return [];
}
