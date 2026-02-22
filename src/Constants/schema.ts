/**
 * Schema types for Dark Souls randomizer run state.
 * Areas contain FogGates; tracking which gates are cleared = run progress.
 */

export type FogGateId = string;
export type AreaId = string;

export type FogGate = {
  id: FogGateId;
  name?: string;
  /** Whether the player has opened / passed through this gate */
  cleared: boolean;
};

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
  /** Run progress: key ids acquired (empty array initially). */
  acquiredKeys: KeyId[];
  /** Run progress: key item ids acquired (empty array initially). */
  acquiredKeyItems: KeyItemId[];
  /** Run progress: bell ids rung (empty array initially). */
  bellsRung: BellOfAwakeningId[];
  /** Run progress: boss ids defeated (empty array initially = all false). */
  bossesDefeated: BossId[];
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
  kind?: 'arena' | 'region' | 'path';
  /** If kind is 'arena', which boss; gates open when this boss is defeated. */
  bossId?: BossId;
};

/** Connection between two nodes. Available or not depending on type and run state. */
export type ConnectionId = string;

export type ConnectionKind =
  | 'fog_gate'   // blocked until boss defeated (or gate cleared in run)
  | 'door'       // blocked until key acquired
  | 'one_way'    // drop / one-way; typically always available once you're at fromNode
  | 'always';    // no gate

export type Connection = {
  id: ConnectionId;
  fromNodeId: NodeId;
  toNodeId: NodeId;
  kind: ConnectionKind;
  /** When kind is 'fog_gate': which boss's arena this gate belongs to (gate opens when defeated). */
  bossId?: BossId;
  /** When kind is 'fog_gate': optional link to FogGate for display. */
  fogGateId?: FogGateId;
  /** When kind is 'door': key required to open. */
  keyId?: KeyId;
};

export type RunState = {
  run: Run | null;
};

/** Display definitions for the homepage "db" – keep in sync with types above. */
export const SCHEMA_DEFINITIONS = [
  { name: 'FogGateId', kind: 'alias' as const, def: 'string' },
  { name: 'AreaId', kind: 'alias' as const, def: 'string' },
  {
    name: 'FogGate',
    kind: 'type' as const,
    def: `{
  id: FogGateId;
  name?: string;
  /** Whether the player has opened / passed through this gate */
  cleared: boolean;
}`,
  },
  { name: 'BonfireId', kind: 'alias' as const, def: 'string' },
  {
    name: 'Bonfire',
    kind: 'type' as const,
    def: `{
  id: BonfireId;
  name: string;
  areaId: AreaId;
  /** Can be warped to with the Lordvessel */
  warpable?: boolean;
}`,
  },
  {
    name: 'Area',
    kind: 'type' as const,
    def: `{
  id: AreaId;
  name: string;
  fogGates: FogGate[];
  bonfires?: Bonfire[];
}`,
  },
  { name: 'KeyId', kind: 'alias' as const, def: 'string' },
  { name: 'KeyItemId', kind: 'alias' as const, def: 'string' },
  { name: 'BellOfAwakeningId', kind: 'alias' as const, def: 'string' },
  {
    name: 'Run',
    kind: 'type' as const,
    def: `{
  id: string;
  createdAt: number;
  areas: Area[];
  acquiredKeys: KeyId[];
  acquiredKeyItems: KeyItemId[];
  bellsRung: BellOfAwakeningId[];
  bossesDefeated: BossId[];
}`,
  },
  { name: 'BossId', kind: 'alias' as const, def: 'string' },
  {
    name: 'Boss',
    kind: 'type' as const,
    def: `{
  id: BossId;
  name: string;
  areaId?: AreaId;
  /** Holds a Lord Soul (or Bequeathed Lord Soul Shard) */
  lordSoul?: boolean;
}`,
  },
  {
    name: 'Key',
    kind: 'type' as const,
    def: `{
  id: KeyId;
  name: string;
  areaId?: AreaId;
}`,
  },
  {
    name: 'KeyItem',
    kind: 'type' as const,
    def: `{
  id: KeyItemId;
  name: string;
  areaId?: AreaId;
}`,
  },
  {
    name: 'BellOfAwakening',
    kind: 'type' as const,
    def: `{
  id: BellOfAwakeningId;
  name: string;
  areaId: AreaId;
}`,
  },
  { name: 'NodeId', kind: 'alias' as const, def: 'string' },
  {
    name: 'Node',
    kind: 'type' as const,
    def: `{
  id: NodeId;
  name: string;
  areaId?: AreaId;
  kind?: 'arena' | 'region' | 'path';
  bossId?: BossId;
}`,
  },
  { name: 'ConnectionId', kind: 'alias' as const, def: 'string' },
  { name: 'ConnectionKind', kind: 'alias' as const, def: "'fog_gate' | 'door' | 'one_way' | 'always'" },
  {
    name: 'Connection',
    kind: 'type' as const,
    def: `{
  id: ConnectionId;
  fromNodeId: NodeId;
  toNodeId: NodeId;
  kind: ConnectionKind;
  bossId?: BossId;
  fogGateId?: FogGateId;
  keyId?: KeyId;
}`,
  },
  {
    name: 'RunState',
    kind: 'type' as const,
    def: `{
  run: Run | null;
}`,
  },
];
