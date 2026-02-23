import type { FogGate } from "./schema";
import { FOG_GATES } from "./fogGates";
import { DARK_SOULS_1_AREAS } from "./areas";

/** Colors for region backgrounds (by area id). Distinct hues. */
const PALETTE = [
  "#3d5a80",
  "#98c1d9",
  "#293241",
  "#ee6c4d",
  "#e0fbfc",
  "#2d6a4f",
  "#40916c",
  "#95d5b2",
  "#1b4332",
  "#9d4edd",
  "#c77dff",
  "#7b2cbf",
  "#5c4d7d",
  "#774936",
  "#b08968",
  "#ddb892",
  "#bc6c25",
  "#dda15e",
  "#606c38",
  "#283618",
  "#bc4749",
  "#6a4c93",
  "#1982c4",
  "#8ac926",
  "#ffca3a",
  "#6a994e",
  "#a7c957",
];

const areaIdsInOrder = DARK_SOULS_1_AREAS.map((a) => a.id);

export const AREA_COLORS: Record<string, string> = {};
areaIdsInOrder.forEach((id, i) => {
  AREA_COLORS[id] = PALETTE[i % PALETTE.length];
});

/** Areas that have at least one fog gate. */
export const AREAS_WITH_GATES = areaIdsInOrder.filter((areaId) =>
  FOG_GATES.some((g) => g.areaId === areaId)
);

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
    return { areaId, areaName: area?.name ?? areaId, color: AREA_COLORS[areaId] ?? "#374151", gates };
  }).filter((r) => r.gates.length > 0);
}
