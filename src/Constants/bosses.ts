import type { Boss } from './schema';

/**
 * All bosses in Dark Souls 1 (base + Artorias of the Abyss).
 * areaId matches DARK_SOULS_1_AREAS in areas.ts.
 */
export const DARK_SOULS_1_BOSSES: Boss[] = [
  { id: 'asylum-demon', name: 'Asylum Demon', areaId: 'northern-undead-asylum' },
  { id: 'taurus-demon', name: 'Taurus Demon', areaId: 'undead-burg' },
  { id: 'bell-gargoyles', name: 'Bell Gargoyles', areaId: 'undead-parish' },
  { id: 'moonlight-butterfly', name: 'Moonlight Butterfly', areaId: 'darkroot-garden' },
  { id: 'capra-demon', name: 'Capra Demon', areaId: 'lower-undead-burg' },
  { id: 'gaping-dragon', name: 'Gaping Dragon', areaId: 'the-depths' },
  { id: 'stray-demon', name: 'Stray Demon', areaId: 'northern-undead-asylum' },
  { id: 'chaos-witch-quelaag', name: 'Chaos Witch Quelaag', areaId: 'blighttown' },
  { id: 'great-grey-wolf-sif', name: 'Great Grey Wolf Sif', areaId: 'darkroot-garden' },
  { id: 'iron-golem', name: 'Iron Golem', areaId: 'sen-fortress' },
  { id: 'crossbreed-priscilla', name: 'Crossbreed Priscilla', areaId: 'painted-world' },
  { id: 'ornstein-and-smough', name: 'Ornstein and Smough', areaId: 'anor-londo' },
  { id: 'dark-sun-gwyndolin', name: 'Dark Sun Gwyndolin', areaId: 'anor-londo' },
  { id: 'pinwheel', name: 'Pinwheel', areaId: 'the-catacombs' },
  { id: 'gravelord-nito', name: 'Gravelord Nito', areaId: 'tomb-of-the-giants', lordSoul: true },
  { id: 'seath-the-scaleless', name: 'Seath the Scaleless', areaId: 'crystal-cave', lordSoul: true },
  { id: 'four-kings', name: 'The Four Kings', areaId: 'new-londo-ruins', lordSoul: true },
  { id: 'ceaseless-discharge', name: 'Ceaseless Discharge', areaId: 'demon-ruins' },
  { id: 'centipede-demon', name: 'Centipede Demon', areaId: 'demon-ruins' },
  { id: 'firesage-demon', name: 'Firesage Demon', areaId: 'demon-ruins' },
  { id: 'bed-of-chaos', name: 'Bed of Chaos', areaId: 'lost-izalith', lordSoul: true },
  { id: 'gwyn-lord-of-cinder', name: 'Gwyn, Lord of Cinder', areaId: 'kiln-of-the-first-flame' },
  { id: 'sanctuary-guardian', name: 'Sanctuary Guardian', areaId: 'sanctuary-garden' },
  { id: 'knight-artorias', name: 'Knight Artorias', areaId: 'royal-wood' },
  { id: 'black-dragon-kalameet', name: 'Black Dragon Kalameet', areaId: 'royal-wood' },
  { id: 'manus-father-of-the-abyss', name: 'Manus, Father of the Abyss', areaId: 'chasm-of-the-abyss' },
];
