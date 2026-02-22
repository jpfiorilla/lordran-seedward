import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  Run,
  Area,
  FogGate,
  AreaId,
  FogGateId,
  KeyId,
  KeyItemId,
  BellOfAwakeningId,
} from "../Constants/schema";
import {
  getInitialBellsRung,
  getInitialAcquiredKeys,
  getInitialAcquiredKeyItems,
} from "../Constants/runProgress";

const STORAGE_KEY = "lordran-seedkeeper-run";

/** Stored shape (Sets serialized as arrays). */
type RunStored = Omit<
  Run,
  "acquiredKeys" | "acquiredKeyItems" | "bellsRung"
> & {
  acquiredKeys: KeyId[];
  acquiredKeyItems: KeyItemId[];
  bellsRung: BellOfAwakeningId[];
};

function runToStored(run: Run): RunStored {
  return {
    ...run,
    acquiredKeys: Array.from(run.acquiredKeys),
    acquiredKeyItems: Array.from(run.acquiredKeyItems),
    bellsRung: Array.from(run.bellsRung),
  };
}

function toIdArray(value: unknown, asRecord: boolean): string[] {
  if (Array.isArray(value)) return value;
  if (asRecord && value && typeof value === "object") {
    return Object.entries(value)
      .filter(([, v]) => v === true)
      .map(([k]) => k);
  }
  return [];
}

function storedToRun(stored: RunStored): Run {
  return {
    ...stored,
    acquiredKeys: new Set(toIdArray(stored.acquiredKeys, true)),
    acquiredKeyItems: new Set(toIdArray(stored.acquiredKeyItems, true)),
    bellsRung: new Set(toIdArray(stored.bellsRung, true)),
  };
}

function loadFromStorage(): Run | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw) as RunStored;
    if (!stored?.id || !Array.isArray(stored.areas)) return null;
    return storedToRun(stored);
  } catch {
    return null;
  }
}

function saveToStorage(run: Run | null) {
  try {
    if (run) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(runToStored(run)));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}

const initialState: { run: Run | null } = {
  run: loadFromStorage(),
};

const runSlice = createSlice({
  name: "run",
  initialState,
  reducers: {
    setRun(state, action: PayloadAction<Run | null>) {
      state.run = action.payload;
      saveToStorage(state.run);
    },
    startNewRun(state) {
      state.run = {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        areas: [],
        acquiredKeys: getInitialAcquiredKeys(),
        acquiredKeyItems: getInitialAcquiredKeyItems(),
        bellsRung: getInitialBellsRung(),
      };
      saveToStorage(state.run);
    },
    addArea(
      state,
      action: PayloadAction<Omit<Area, "fogGates"> & { fogGates?: FogGate[] }>,
    ) {
      if (!state.run) return;
      const { id, name, fogGates = [] } = action.payload;
      state.run.areas.push({ id, name, fogGates });
      saveToStorage(state.run);
    },
    updateArea(
      state,
      action: PayloadAction<{ areaId: AreaId; name?: string }>,
    ) {
      if (!state.run) return;
      const area = state.run.areas.find((a) => a.id === action.payload.areaId);
      if (!area) return;
      if (action.payload.name !== undefined) area.name = action.payload.name;
      saveToStorage(state.run);
    },
    addFogGate(
      state,
      action: PayloadAction<{ areaId: AreaId; fogGate: FogGate }>,
    ) {
      if (!state.run) return;
      const area = state.run.areas.find((a) => a.id === action.payload.areaId);
      if (!area) return;
      area.fogGates.push(action.payload.fogGate);
      saveToStorage(state.run);
    },
    setFogGateCleared(
      state,
      action: PayloadAction<{
        areaId: AreaId;
        fogGateId: FogGateId;
        cleared: boolean;
      }>,
    ) {
      if (!state.run) return;
      const area = state.run.areas.find((a) => a.id === action.payload.areaId);
      if (!area) return;
      const gate = area.fogGates.find((g) => g.id === action.payload.fogGateId);
      if (!gate) return;
      gate.cleared = action.payload.cleared;
      saveToStorage(state.run);
    },
    setKeyAcquired(
      state,
      action: PayloadAction<{ keyId: KeyId; acquired: boolean }>,
    ) {
      if (!state.run) return;
      const { keyId, acquired } = action.payload;
      if (acquired) state.run.acquiredKeys.add(keyId);
      else state.run.acquiredKeys.delete(keyId);
      saveToStorage(state.run);
    },
    setKeyItemAcquired(
      state,
      action: PayloadAction<{ keyItemId: KeyItemId; acquired: boolean }>,
    ) {
      if (!state.run) return;
      const { keyItemId, acquired } = action.payload;
      if (acquired) state.run.acquiredKeyItems.add(keyItemId);
      else state.run.acquiredKeyItems.delete(keyItemId);
      saveToStorage(state.run);
    },
    setBellRung(
      state,
      action: PayloadAction<{ bellId: BellOfAwakeningId; rung: boolean }>,
    ) {
      if (!state.run) return;
      const { bellId, rung } = action.payload;
      if (rung) state.run.bellsRung.add(bellId);
      else state.run.bellsRung.delete(bellId);
      saveToStorage(state.run);
    },
    clearRun(state) {
      state.run = null;
      saveToStorage(null);
    },
  },
});

export { runSlice };
export default runSlice.reducer;
