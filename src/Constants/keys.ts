import type { Key } from "./schema";

/**
 * Keys to track in a run. Sourced from https://darksouls.wiki.fextralife.com/Keys.
 * We exclude Master Key and any key that the Master Key can replace ("In Master Key: Yes" on the wiki).
 */
export const TRACKABLE_KEYS: Key[] = [
  { id: "dungeon-cell-key", name: "Dungeon Cell Key", areaId: "northern-undead-asylum" },
  { id: "undead-asylum-f2-east-key", name: "Undead Asylum F2 East Key", areaId: "northern-undead-asylum" },
  { id: "undead-asylum-f2-west-key", name: "Undead Asylum F2 West Key", areaId: "northern-undead-asylum" },
  { id: "big-pilgrims-key", name: "Big Pilgrim's Key", areaId: "northern-undead-asylum" },
  { id: "basement-key", name: "Basement Key", areaId: "undead-parish" },
  { id: "key-to-depths", name: "Key to Depths", areaId: "lower-undead-burg" },
  { id: "blighttown-key", name: "Blighttown Key", areaId: "the-depths" },
  { id: "key-to-the-seal", name: "Key to the Seal", areaId: "new-londo-ruins" },
  { id: "archive-tower-cell-key", name: "Archive Tower Cell Key", areaId: "the-dukes-archives" },
  { id: "archive-prison-extra-key", name: "Archive Prison Extra Key", areaId: "the-dukes-archives" },
  { id: "archive-tower-giant-door-key", name: "Archive Tower Giant Door Key", areaId: "the-dukes-archives" },
  { id: "archive-tower-giant-cell-key", name: "Archive Tower Giant Cell Key", areaId: "the-dukes-archives" },
  { id: "annex-key", name: "Annex Key", areaId: "painted-world" },
  { id: "crest-of-artorias", name: "Crest of Artorias", areaId: "darkroot-garden" },
  { id: "peculiar-doll", name: "Peculiar Doll", areaId: "northern-undead-asylum" },
  { id: "broken-pendant", name: "Broken Pendant", areaId: "the-dukes-archives" },
  { id: "crest-key", name: "Crest Key", areaId: "royal-wood" },
];
