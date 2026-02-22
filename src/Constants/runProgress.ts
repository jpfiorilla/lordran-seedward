import type { KeyId, KeyItemId, BellOfAwakeningId } from './schema';

/**
 * Initial run progress: empty Sets for all run-state collections.
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
