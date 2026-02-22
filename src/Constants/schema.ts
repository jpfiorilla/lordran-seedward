/**
 * Schema types for Dark Souls randomizer run state.
 * Fog gates have two sides (front/back); each side attaches to a node. All fog gates exist in an area.
 * In randomizer runs, fog gates don't respawn; each side warps to an independent other gate's side (seed-dependent).
 */

export type FogGateId = string;
export type AreaId = string;

/** Canonical 'front' or 'back' of a fog gate (as the canonical-run player would experience it). */
export type FogGateSide = "front" | "back";

export type FogGate = {
  id: FogGateId;
  /** All fog gates exist within an area. */
  areaId: AreaId;
  /** Node at the 'front' side of the gate. */
  frontNodeId: NodeId;
  /** Node at the 'back' side of the gate. */
  backNodeId: NodeId;
  name?: string;
  /** When set, gate is only traversable after this boss is defeated. */
  bossId?: BossId;
};

/** Identifies one side of a fog gate for the warp table. */
export type FogGateSideRef = { fogGateId: FogGateId; side: FogGateSide };

/** Per-seed: one side of a gate warps to another gate's side (independent of the other side). */
export type FogGateWarp = { from: FogGateSideRef; to: FogGateSideRef };

export type BonfireId = string;

export type Bonfire = {
  id: BonfireId;
  name: string;
  areaId: AreaId;
  /** Can be warped to with the Lordvessel */
  warpable?: boolean;
};

export type Area = {
  id: AreaId;
  name: string;
  fogGates: FogGate[];
  bonfires?: Bonfire[];
};

export type Run = {
  id: string;
  createdAt: number;
  areas: Area[];
  /** Per-seed: each fog gate side warps to another gate's side (empty until seed is set). */
  fogGateWarps: FogGateWarp[];
  /** Run progress: key ids acquired (empty array initially). */
  acquiredKeys: KeyId[];
  /** Run progress: key item ids acquired (empty array initially). */
  acquiredKeyItems: KeyItemId[];
  /** Run progress: bell ids rung (empty array initially). */
  bellsRung: BellOfAwakeningId[];
  /** Run progress: boss ids defeated (empty array initially = all false). */
  bossesDefeated: BossId[];
  /** Shortcuts / elevators unlocked (e.g. parish elevator to Firelink). */
  shortcutsUnlocked: ShortcutId[];
  /** Gates the player has passed through (for UI; gates don't respawn in randomizer). */
  fogGatesCleared?: FogGateId[];
};

export type BossId = string;

export type Boss = {
  id: BossId;
  name: string;
  areaId?: AreaId;
  /** Holds a Lord Soul (or Bequeathed Lord Soul Shard) */
  lordSoul?: boolean;
};

export type KeyId = string;

export type Key = {
  id: KeyId;
  name: string;
  areaId?: AreaId;
};

export type KeyItemId = string;

export type KeyItem = {
  id: KeyItemId;
  name: string;
  areaId?: AreaId;
};

export type BellOfAwakeningId = string;

export type BellOfAwakening = {
  id: BellOfAwakeningId;
  name: string;
  areaId: AreaId;
};

/** Location in the world graph (sub-area, room, arena). Does not map 1:1 to Areas. */
export type NodeId = string;

export type Node = {
  id: NodeId;
  name: string;
  /** Optional: group under an Area for display. Nodes can be finer-grained than Areas. */
  areaId?: AreaId;
  /** Boss arena (1–3 fog gates), general region, path, etc. */
  kind?: "arena" | "region" | "path";
  /** If kind is 'arena', which boss; gates open when this boss is defeated. */
  bossId?: BossId;
};

/** Id for a shortcut (elevator, gate, etc.) that can be unlocked in run state. */
export type ShortcutId = string;

/**
 * Connection between two nodes (doors, one-ways, paths). Fog gate traversal is separate:
 * fog gates have two sides (front/back) per gate and are traversed via the run's fogGateWarps.
 */
export type ConnectionId = string;

export type ConnectionKind =
  | "door" // blocked until key acquired
  | "one_way" // drop / one-way; typically always available once you're at fromNode
  | "always"; // no gate

export type Connection = {
  id: ConnectionId;
  fromNodeId: NodeId;
  toNodeId: NodeId;
  kind: ConnectionKind;
  /** Display label (e.g. "Dragon cutscene bridge", "Bird's nest", "Parish elevator"). */
  name?: string;
  /** When kind is 'door': key required to open. */
  keyId?: KeyId;
  /** When set: connection only available if this shortcut is unlocked in run state. */
  shortcutId?: ShortcutId;
};

export type RunState = {
  run: Run | null;
};

/** Display definitions for the homepage "db" – keep in sync with types above. */
export const SCHEMA_DEFINITIONS = [
  { name: "FogGateId", kind: "alias" as const, def: "string" },
  { name: "FogGateSide", kind: "alias" as const, def: "'front' | 'back'" },
  {
    name: "FogGateSideRef",
    kind: "type" as const,
    def: "{ fogGateId: FogGateId; side: FogGateSide }",
  },
  {
    name: "FogGateWarp",
    kind: "type" as const,
    def: "{ from: FogGateSideRef; to: FogGateSideRef }",
  },
  { name: "AreaId", kind: "alias" as const, def: "string" },
  {
    name: "FogGate",
    kind: "type" as const,
    def: `{
  id: FogGateId;
  areaId: AreaId;
  frontNodeId: NodeId;
  backNodeId: NodeId;
  name?: string;
  bossId?: BossId;
}`,
  },
  { name: "BonfireId", kind: "alias" as const, def: "string" },
  {
    name: "Bonfire",
    kind: "type" as const,
    def: `{
  id: BonfireId;
  name: string;
  areaId: AreaId;
  /** Can be warped to with the Lordvessel */
  warpable?: boolean;
}`,
  },
  {
    name: "Area",
    kind: "type" as const,
    def: `{
  id: AreaId;
  name: string;
  fogGates: FogGate[];
  bonfires?: Bonfire[];
}`,
  },
  { name: "KeyId", kind: "alias" as const, def: "string" },
  { name: "KeyItemId", kind: "alias" as const, def: "string" },
  { name: "BellOfAwakeningId", kind: "alias" as const, def: "string" },
  {
    name: "Run",
    kind: "type" as const,
    def: `{
  id: string;
  createdAt: number;
  areas: Area[];
  fogGateWarps: FogGateWarp[];
  acquiredKeys: KeyId[];
  acquiredKeyItems: KeyItemId[];
  bellsRung: BellOfAwakeningId[];
  bossesDefeated: BossId[];
  shortcutsUnlocked: ShortcutId[];
  fogGatesCleared?: FogGateId[];
}`,
  },
  { name: "ShortcutId", kind: "alias" as const, def: "string" },
  { name: "BossId", kind: "alias" as const, def: "string" },
  {
    name: "Boss",
    kind: "type" as const,
    def: `{
  id: BossId;
  name: string;
  areaId?: AreaId;
  /** Holds a Lord Soul (or Bequeathed Lord Soul Shard) */
  lordSoul?: boolean;
}`,
  },
  {
    name: "Key",
    kind: "type" as const,
    def: `{
  id: KeyId;
  name: string;
  areaId?: AreaId;
}`,
  },
  {
    name: "KeyItem",
    kind: "type" as const,
    def: `{
  id: KeyItemId;
  name: string;
  areaId?: AreaId;
}`,
  },
  {
    name: "BellOfAwakening",
    kind: "type" as const,
    def: `{
  id: BellOfAwakeningId;
  name: string;
  areaId: AreaId;
}`,
  },
  { name: "NodeId", kind: "alias" as const, def: "string" },
  {
    name: "Node",
    kind: "type" as const,
    def: `{
  id: NodeId;
  name: string;
  areaId?: AreaId;
  kind?: 'arena' | 'region' | 'path';
  bossId?: BossId;
}`,
  },
  { name: "ConnectionId", kind: "alias" as const, def: "string" },
  {
    name: "ConnectionKind",
    kind: "alias" as const,
    def: "'door' | 'one_way' | 'always'",
  },
  {
    name: "Connection",
    kind: "type" as const,
    def: `{
  id: ConnectionId;
  fromNodeId: NodeId;
  toNodeId: NodeId;
  kind: ConnectionKind;
  name?: string;
  keyId?: KeyId;
  shortcutId?: ShortcutId;
}`,
  },
  {
    name: "RunState",
    kind: "type" as const,
    def: `{
  run: Run | null;
}`,
  },
];
