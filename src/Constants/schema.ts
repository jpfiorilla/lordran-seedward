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
  /** Run progress: key ids acquired (empty Set initially). */
  acquiredKeys: Set<KeyId>;
  /** Run progress: key item ids acquired (empty Set initially). */
  acquiredKeyItems: Set<KeyItemId>;
  /** Run progress: bell ids rung (empty Set initially). */
  bellsRung: Set<BellOfAwakeningId>;
  /** Run progress: boss ids defeated (empty Set initially = all false). */
  bossesDefeated: Set<BossId>;
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
  acquiredKeys: Set<KeyId>;
  acquiredKeyItems: Set<KeyItemId>;
  bellsRung: Set<BellOfAwakeningId>;
  bossesDefeated: Set<BossId>;
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
  {
    name: 'RunState',
    kind: 'type' as const,
    def: `{
  run: Run | null;
}`,
  },
];
