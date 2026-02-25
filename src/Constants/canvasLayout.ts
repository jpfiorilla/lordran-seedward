import type { FogGate } from "./schema";
import { FOG_GATES } from "./fogGates";
import { DARK_SOULS_1_AREAS } from "./areas";

/**
 * Region colors by area, chosen to evoke each area's in-game look (stone, lava, forest, etc.).
 * All work on dark canvas background (#0f1012).
 */
const AREA_COLORS_MAP: Record<string, string> = {
  "northern-undead-asylum": "#5c6b73",
  "firelink-shrine": "#c9a227",
  "undead-burg": "#7d8a94",
  "undead-parish": "#8b7355",
  "darkroot-garden": "#2d5a3d",
  "darkroot-basin": "#3d6b5c",
  "lower-undead-burg": "#5a6268",
  "the-depths": "#4a5c4a",
  blighttown: "#6b6b3d",
  "great-hollow": "#6b5344",
  "quelaags-domain": "#b85c38",
  "sen-fortress": "#6b6b6b",
  "painted-world": "#7a9eb5",
  "anor-londo": "#c4a574",
  "the-catacombs": "#8b6914",
  "tomb-of-the-giants": "#2d2433",
  "the-dukes-archives": "#6b8ba3",
  "crystal-cave": "#5a8fb8",
  "new-londo-ruins": "#3d4a6b",
  "demon-ruins": "#8b3d2d",
  "lost-izalith": "#b85c2d",
  "kiln-of-the-first-flame": "#5c5c5c",
  "sanctuary-garden": "#4a7a5a",
  "royal-wood": "#5c6b3d",
  "chasm-of-the-abyss": "#3d2d4a",
};

const DEFAULT_AREA_COLOR = "#374151";

export const AREA_COLORS: Record<string, string> = {};
DARK_SOULS_1_AREAS.forEach((a) => {
  AREA_COLORS[a.id] = AREA_COLORS_MAP[a.id] ?? DEFAULT_AREA_COLOR;
});

/** Areas that have at least one fog gate. */
export const AREAS_WITH_GATES = DARK_SOULS_1_AREAS.filter((area) =>
  FOG_GATES.some((g) => g.areaId === area.id),
).map((area) => area.id);

export type RegionLayout = {
  areaId: string;
  areaName: string;
  color: string;
  gates: FogGate[];
};

/** Regions with gates for HTML layout (no x,y; layout is CSS). */
export function getRegionLayouts(): RegionLayout[] {
  return AREAS_WITH_GATES.map((areaId) => {
    const area = DARK_SOULS_1_AREAS.find((a) => a.id === areaId);
    const gates = FOG_GATES.filter((g) => g.areaId === areaId);
    return {
      areaId,
      areaName: area?.name ?? areaId,
      color: AREA_COLORS[areaId] ?? "#374151",
      gates,
    };
  }).filter((r) => r.gates.length > 0);
}
