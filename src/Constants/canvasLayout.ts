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
const areaIndex = new Map(areaIdsInOrder.map((id, i) => [id, i]));

export const AREA_COLORS: Record<string, string> = {};
areaIdsInOrder.forEach((id, i) => {
  AREA_COLORS[id] = PALETTE[i % PALETTE.length];
});

/** Region dimensions and grid. */
export const REGION_WIDTH = 220;
export const REGION_HEIGHT = 280;
export const REGION_COLS = 4;
export const REGION_PADDING = 8;
export const GATE_CARD_WIDTH = 200;
export const GATE_CARD_HEIGHT = 26;
export const GATE_GAP = 4;
/** Front handle (left) and back handle (right) x in gate-local coords. */
export const HANDLE_FRONT_X = 8;
export const HANDLE_BACK_X = GATE_CARD_WIDTH - 8;
export const HANDLE_Y = GATE_CARD_HEIGHT / 2;
export const HANDLE_R = 6;

/** Areas that have at least one fog gate, in display order. */
export const AREAS_WITH_GATES = areaIdsInOrder.filter((areaId) =>
  FOG_GATES.some((g) => g.areaId === areaId)
);

export type RegionLayout = {
  areaId: string;
  areaName: string;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  gates: FogGate[];
};

/** Compute region positions in a grid; gates listed per region. */
export function getRegionLayouts(): RegionLayout[] {
  const result: RegionLayout[] = [];
  const ordered = AREAS_WITH_GATES.map((areaId) => {
    const area = DARK_SOULS_1_AREAS.find((a) => a.id === areaId);
    const gates = FOG_GATES.filter((g) => g.areaId === areaId);
    return { areaId, areaName: area?.name ?? areaId, gates };
  }).filter((r) => r.gates.length > 0);

  ordered.forEach(({ areaId, areaName, gates }, i) => {
    const col = i % REGION_COLS;
    const row = Math.floor(i / REGION_COLS);
    result.push({
      areaId,
      areaName,
      color: AREA_COLORS[areaId] ?? "#374151",
      x: col * (REGION_WIDTH + 16),
      y: row * (REGION_HEIGHT + 16),
      width: REGION_WIDTH,
      height: REGION_HEIGHT,
      gates,
    });
  });
  return result;
}

/** Gate position inside a region (top-left of card). Index = gate index in region. */
export function getGatePositionInRegion(gateIndex: number): { x: number; y: number } {
  const headerH = 28;
  return {
    x: REGION_PADDING,
    y: headerH + gateIndex * (GATE_CARD_HEIGHT + GATE_GAP),
  };
}

/** Resolve handle screen position (for drawing lines). Region layout + gate index + side. */
export function getHandleScreenPosition(
  region: RegionLayout,
  gateIndex: number,
  side: "front" | "back"
): { x: number; y: number } {
  const gatePos = getGatePositionInRegion(gateIndex);
  const x =
    region.x +
    gatePos.x +
    (side === "front" ? HANDLE_FRONT_X : HANDLE_BACK_X);
  const y = region.y + gatePos.y + HANDLE_Y;
  return { x, y };
}
