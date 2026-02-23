import type { Connection } from "./schema";

/**
 * Connections between nodes (doors, one-ways, paths). Fog gate traversal is via run.fogGateWarps.
 * Reference: Lordran connection map in REFERENCES.md (https://i.imgur.com/TeyUpcd.png).
 */
export const CONNECTIONS: Connection[] = [
  {
    id: "conn-dragon-bridge",
    fromNodeId: "firelink-shrine",
    toNodeId: "undead-burg-bridge",
    kind: "always",
    name: "Dragon cutscene bridge",
  },
  {
    id: "conn-bird-nest",
    fromNodeId: "firelink-shrine",
    toNodeId: "bird-nest",
    kind: "always",
    name: "Bird's nest",
  },
  {
    id: "conn-parish-elevator",
    fromNodeId: "firelink-shrine",
    toNodeId: "undead-parish",
    kind: "always",
    shortcutId: "parish-elevator",
    name: "Parish elevator",
  },
];
