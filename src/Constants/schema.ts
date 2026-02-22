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
};

export type RunState = {
  run: Run | null;
};
