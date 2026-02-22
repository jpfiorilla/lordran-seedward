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

export type Area = {
  id: AreaId;
  name: string;
  fogGates: FogGate[];
};

export type Run = {
  id: string;
  createdAt: number;
  areas: Area[];
};

export type BossId = string;

export type Boss = {
  id: BossId;
  name: string;
  areaId?: AreaId;
  /** Holds a Lord Soul (or Bequeathed Lord Soul Shard) */
  lordSoul?: boolean;
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
  {
    name: 'Area',
    kind: 'type' as const,
    def: `{
  id: AreaId;
  name: string;
  fogGates: FogGate[];
}`,
  },
  {
    name: 'Run',
    kind: 'type' as const,
    def: `{
  id: string;
  createdAt: number;
  areas: Area[];
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
    name: 'RunState',
    kind: 'type' as const,
    def: `{
  run: Run | null;
}`,
  },
];
