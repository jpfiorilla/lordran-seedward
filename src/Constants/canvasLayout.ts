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

/** Region dimensions. */
export const REGION_WIDTH = 200;
export const REGION_HEIGHT = 260;
export const REGION_PADDING = 8;
export const GATE_CARD_WIDTH = 180;
export const GATE_CARD_HEIGHT = 24;
export const GATE_GAP = 4;
/** Front handle (left) and back handle (right) x in gate-local coords. */
export const HANDLE_FRONT_X = 8;
export const HANDLE_BACK_X = GATE_CARD_WIDTH - 8;
export const HANDLE_Y = GATE_CARD_HEIGHT / 2;
export const HANDLE_R = 6;

/** Map-like (x, y) positions per area so connections read clearly. Spacing ~260. */
const MAP_POSITIONS: Record<string, { x: number; y: number }> = {
  "northern-undead-asylum": { x: 40, y: 40 },
  "firelink-shrine": { x: 40, y: 320 },
  "undead-burg": { x: 320, y: 120 },
  "undead-parish": { x: 320, y: 320 },
  "the-depths": { x: 320, y: 520 },
  "new-londo-ruins": { x: 40, y: 600 },
  "the-catacombs": { x: 40, y: 800 },
  "sen-fortress": { x: 600, y: 320 },
  "blighttown": { x: 320, y: 720 },
  "great-hollow": { x: 320, y: 920 },
  "darkroot-garden": { x: 600, y: 120 },
  "anor-londo": { x: 880, y: 200 },
  "painted-world": { x: 880, y: 400 },
  "tomb-of-the-giants": { x: 40, y: 1000 },
  "the-dukes-archives": { x: 880, y: 560 },
  "crystal-cave": { x: 880, y: 720 },
  "demon-ruins": { x: 600, y: 800 },
  "lost-izalith": { x: 600, y: 960 },
  "royal-wood": { x: 880, y: 880 },
  "sanctuary-garden": { x: 880, y: 1040 },
  "chasm-of-the-abyss": { x: 880, y: 1200 },
};

/** Areas that have at least one fog gate. */
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

/** Compute region positions from map; gates listed per region. */
export function getRegionLayouts(): RegionLayout[] {
  const result: RegionLayout[] = [];
  const ordered = AREAS_WITH_GATES.map((areaId) => {
    const area = DARK_SOULS_1_AREAS.find((a) => a.id === areaId);
    const gates = FOG_GATES.filter((g) => g.areaId === areaId);
    return { areaId, areaName: area?.name ?? areaId, gates };
  }).filter((r) => r.gates.length > 0);

  ordered.forEach(({ areaId, areaName, gates }) => {
    const pos = MAP_POSITIONS[areaId] ?? { x: 0, y: 0 };
    result.push({
      areaId,
      areaName,
      color: AREA_COLORS[areaId] ?? "#374151",
      x: pos.x,
      y: pos.y,
      width: REGION_WIDTH,
      height: REGION_HEIGHT,
      gates,
    });
  });
  return result;
}

/** Bounding box of all regions for SVG viewBox. */
export function getMapBounds(layouts: RegionLayout[]): { x: number; y: number; w: number; h: number } {
  if (layouts.length === 0) return { x: 0, y: 0, w: 800, h: 600 };
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  layouts.forEach((r) => {
    minX = Math.min(minX, r.x);
    minY = Math.min(minY, r.y);
    maxX = Math.max(maxX, r.x + r.width);
    maxY = Math.max(maxY, r.y + r.height);
  });
  const pad = 60;
  return {
    x: minX - pad,
    y: minY - pad,
    w: maxX - minX + pad * 2,
    h: maxY - minY + pad * 2,
  };
}

/** Gate position inside a region (top-left of card). Index = gate index in region. */
export function getGatePositionInRegion(gateIndex: number): { x: number; y: number } {
  const headerH = 26;
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
