import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Run, Area, FogGate, AreaId, FogGateId } from '../Constants/schema';

const STORAGE_KEY = 'lordran-seedkeeper-run';

function loadFromStorage(): Run | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Run;
    if (!parsed?.id || !Array.isArray(parsed.areas)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveToStorage(run: Run | null) {
  try {
    if (run) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(run));
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
  name: 'run',
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
      };
      saveToStorage(state.run);
    },
    addArea(state, action: PayloadAction<Omit<Area, 'fogGates'> & { fogGates?: FogGate[] }>) {
      if (!state.run) return;
      const { id, name, fogGates = [] } = action.payload;
      state.run.areas.push({ id, name, fogGates });
      saveToStorage(state.run);
    },
    updateArea(state, action: PayloadAction<{ areaId: AreaId; name?: string }>) {
      if (!state.run) return;
      const area = state.run.areas.find((a) => a.id === action.payload.areaId);
      if (!area) return;
      if (action.payload.name !== undefined) area.name = action.payload.name;
      saveToStorage(state.run);
    },
    addFogGate(
      state,
      action: PayloadAction<{ areaId: AreaId; fogGate: FogGate }>
    ) {
      if (!state.run) return;
      const area = state.run.areas.find((a) => a.id === action.payload.areaId);
      if (!area) return;
      area.fogGates.push(action.payload.fogGate);
      saveToStorage(state.run);
    },
    setFogGateCleared(
      state,
      action: PayloadAction<{ areaId: AreaId; fogGateId: FogGateId; cleared: boolean }>
    ) {
      if (!state.run) return;
      const area = state.run.areas.find((a) => a.id === action.payload.areaId);
      if (!area) return;
      const gate = area.fogGates.find((g) => g.id === action.payload.fogGateId);
      if (!gate) return;
      gate.cleared = action.payload.cleared;
      saveToStorage(state.run);
    },
    clearRun(state) {
      state.run = null;
      saveToStorage(null);
    },
  },
});

export const {
  setRun,
  startNewRun,
  addArea,
  updateArea,
  addFogGate,
  setFogGateCleared,
  clearRun,
} = runSlice.actions;

export default runSlice.reducer;
