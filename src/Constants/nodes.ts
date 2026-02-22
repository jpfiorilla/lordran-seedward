import type { Node } from "./schema";

/**
 * World graph nodes. Start node for early game: firelink-shrine.
 * Sub-areas don't map 1:1 to Areas; areaId is for display grouping.
 */
export const NODES: Node[] = [
  {
    id: "firelink-shrine",
    name: "Firelink Shrine",
    areaId: "firelink-shrine",
    kind: "region",
  },
  {
    id: "undead-burg-bridge",
    name: "Undead Burg (bridge)",
    areaId: "undead-burg",
    kind: "region",
  },
  {
    id: "bird-nest",
    name: "Bird's nest",
    areaId: "firelink-shrine",
    kind: "path",
  },
  {
    id: "undead-parish",
    name: "Undead Parish",
    areaId: "undead-parish",
    kind: "region",
  },
];

export const START_NODE_IDS = ["firelink-shrine"] as const;
