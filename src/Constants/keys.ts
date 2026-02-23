import type { Key } from "./schema";

/** Key with optional "Unlocks" description from the wiki (for hover tooltip). */
export type KeyWithUnlocks = Key & { unlocks?: string };

/**
 * Keys to track in a run. Sourced from https://darksouls.wiki.fextralife.com/Keys.
 * We exclude Master Key and any key that the Master Key can replace ("In Master Key: Yes" on the wiki).
 * "Unlocks" text is from the wiki "Unlocks Location" column.
 */
export const TRACKABLE_KEYS: KeyWithUnlocks[] = [
  { id: "dungeon-cell-key", name: "Dungeon Cell Key", areaId: "northern-undead-asylum", unlocks: "Northern Undead Asylum. Cell door." },
  { id: "undead-asylum-f2-east-key", name: "Undead Asylum F2 East Key", areaId: "northern-undead-asylum", unlocks: "Undead Asylum. Door behind boulder trap." },
  { id: "undead-asylum-f2-west-key", name: "Undead Asylum F2 West Key", areaId: "northern-undead-asylum", unlocks: "Undead Asylum. Open the door guarded by Elite Undead, leads to Rusted Iron Ring." },
  { id: "big-pilgrims-key", name: "Big Pilgrim's Key", areaId: "northern-undead-asylum", unlocks: "Undead Asylum. Exit Asylum." },
  { id: "basement-key", name: "Basement Key", areaId: "undead-parish", unlocks: "Unlocks the small door at the start of the Hellkite bridge, leading to Lower Undead Burg." },
  { id: "key-to-depths", name: "Key to Depths", areaId: "lower-undead-burg", unlocks: "Unlocks the door to the Depths. Go right just before the Capra Demon's fog wall, the door is at the bottom of the tower by two thieves." },
  { id: "blighttown-key", name: "Blighttown Key", areaId: "the-depths", unlocks: "Unlocks Blighttown. Huge doors beside Domhnall of Zena (sewer merchant) in the Depths." },
  { id: "key-to-the-seal", name: "Key to the Seal", areaId: "new-londo-ruins", unlocks: "Access lower New Londo, Valley of Drakes (2nd entrance) and The Abyss." },
  { id: "archive-tower-cell-key", name: "Archive Tower Cell Key", areaId: "the-dukes-archives", unlocks: "Opens prison in Archive Tower. Opens the third door down from the bonfire." },
  { id: "archive-prison-extra-key", name: "Archive Prison Extra Key", areaId: "the-dukes-archives", unlocks: "Opens the other cell doors in Archive Tower. Also opens the second door in the Bonfire cell, and a shortcut to the gramophone." },
  { id: "archive-tower-giant-door-key", name: "Archive Tower Giant Door Key", areaId: "the-dukes-archives", unlocks: "Exit Archive Tower." },
  { id: "archive-tower-giant-cell-key", name: "Archive Tower Giant Cell Key", areaId: "the-dukes-archives", unlocks: "Opens the cell behind the Pisacas. Free Big Hat Logan." },
  { id: "annex-key", name: "Annex Key", areaId: "painted-world", unlocks: "Opens Annex in Painted World. Get Dark Ember." },
  { id: "crest-of-artorias", name: "Crest of Artorias", areaId: "darkroot-garden", unlocks: "Opens the sealed gate within Darkroot Garden." },
  { id: "peculiar-doll", name: "Peculiar Doll", areaId: "northern-undead-asylum", unlocks: "Access Painted World of Ariamis." },
  { id: "broken-pendant", name: "Broken Pendant", areaId: "the-dukes-archives", unlocks: "Access Lost Oolacile from the Darkroot Basin." },
  { id: "crest-key", name: "Crest Key", areaId: "royal-wood", unlocks: "Access Hawkeye Gough." },
];
