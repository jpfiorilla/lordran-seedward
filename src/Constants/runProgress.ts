import type { KeyId, KeyItemId, BellOfAwakeningId, BossId } from './schema';

/**
 * Initial run progress: empty Sets for all run-state collections (defeated = false for all bosses).
 */
export function getInitialAcquiredKeys(): Set<KeyId> {
  return new Set();
}

export function getInitialAcquiredKeyItems(): Set<KeyItemId> {
  return new Set();
}

export function getInitialBellsRung(): Set<BellOfAwakeningId> {
  return new Set();
}

export function getInitialBossesDefeated(): Set<BossId> {
  return new Set();
}
