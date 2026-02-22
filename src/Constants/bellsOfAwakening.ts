import type { BellOfAwakening } from './schema';

/**
 * The two Bells of Awakening in Dark Souls 1.
 * Ringing both opens the path to Sen's Fortress.
 */
export const BELLS_OF_AWAKENING: BellOfAwakening[] = [
  { id: 'bell-parish', name: 'First Bell of Awakening', areaId: 'undead-parish' },
  { id: 'bell-blighttown', name: 'Second Bell of Awakening', areaId: 'quelaags-domain' },
];
