import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  Run,
  Area,
  FogGate,
  FogGateWarp,
  FogGateSideRef,
  AreaId,
  FogGateId,
  KeyId,
  KeyItemId,
  BellOfAwakeningId,
  BossId,
  ShortcutId,
} from "../Constants/schema";
import {
  getInitialBellsRung,
  getInitialAcquiredKeys,
  getInitialAcquiredKeyItems,
  getInitialBossesDefeated,
  getInitialShortcutsUnlocked,
} from "../Constants/runProgress";

const STORAGE_KEY = "lordran-seedkeeper-run";

function toIdArray(value: unknown, asRecord: boolean): string[] {
  if (Array.isArray(value)) return value;
  if (asRecord && value && typeof value === "object") {
    return Object.entries(value)
      .filter(([, v]) => v === true)
      .map(([k]) => k);
  }
  return [];
}

function loadFromStorage(): Run | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Run;
    if (!parsed?.id || !Array.isArray(parsed.areas)) return null;
    return {
      id: parsed.id,
      createdAt: parsed.createdAt,
      areas: parsed.areas,
      fogGateWarps: Array.isArray(parsed.fogGateWarps)
        ? parsed.fogGateWarps
        : [],
      fogGatesCleared: Array.isArray(parsed.fogGatesCleared)
        ? parsed.fogGatesCleared
        : [],
      acquiredKeys: toIdArray(parsed.acquiredKeys, true),
      acquiredKeyItems: toIdArray(parsed.acquiredKeyItems, true),
      bellsRung: toIdArray(parsed.bellsRung, true),
      bossesDefeated: toIdArray(parsed.bossesDefeated ?? [], true),
      shortcutsUnlocked: toIdArray(parsed.shortcutsUnlocked ?? [], true),
    };
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
        fogGateWarps: [],
        fogGatesCleared: [],
        acquiredKeys: getInitialAcquiredKeys(),
        acquiredKeyItems: getInitialAcquiredKeyItems(),
        bellsRung: getInitialBellsRung(),
        bossesDefeated: getInitialBossesDefeated(),
        shortcutsUnlocked: getInitialShortcutsUnlocked(),
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
    setFogGateWarp(
      state,
      action: PayloadAction<{ from: FogGateSideRef; to: FogGateSideRef }>,
    ) {
      if (!state.run) return;
      const { from, to } = action.payload;
      if (
        from.fogGateId === to.fogGateId &&
        from.side === to.side
      )
        return;
      state.run.fogGateWarps = state.run.fogGateWarps.filter(
        (w) =>
          !(w.from.fogGateId === from.fogGateId && w.from.side === from.side),
      );
      state.run.fogGateWarps.push({ from, to });
      saveToStorage(state.run);
    },
    removeFogGateWarp(
      state,
      action: PayloadAction<FogGateSideRef>,
    ) {
      if (!state.run) return;
      const from = action.payload;
      state.run.fogGateWarps = state.run.fogGateWarps.filter(
        (w) =>
          !(w.from.fogGateId === from.fogGateId && w.from.side === from.side),
      );
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
      const { fogGateId, cleared } = action.payload;
      const list = state.run.fogGatesCleared ?? [];
      if (cleared) {
        if (!list.includes(fogGateId))
          state.run.fogGatesCleared = [...list, fogGateId];
      } else {
        state.run.fogGatesCleared = list.filter((id) => id !== fogGateId);
      }
      saveToStorage(state.run);
    },
    setKeyAcquired(
      state,
      action: PayloadAction<{ keyId: KeyId; acquired: boolean }>,
    ) {
      if (!state.run) return;
      const { keyId, acquired } = action.payload;
      if (acquired) {
        if (!state.run.acquiredKeys.includes(keyId))
          state.run.acquiredKeys.push(keyId);
      } else {
        state.run.acquiredKeys = state.run.acquiredKeys.filter(
          (id) => id !== keyId,
        );
      }
      saveToStorage(state.run);
    },
    setKeyItemAcquired(
      state,
      action: PayloadAction<{ keyItemId: KeyItemId; acquired: boolean }>,
    ) {
      if (!state.run) return;
      const { keyItemId, acquired } = action.payload;
      if (acquired) {
        if (!state.run.acquiredKeyItems.includes(keyItemId))
          state.run.acquiredKeyItems.push(keyItemId);
      } else {
        state.run.acquiredKeyItems = state.run.acquiredKeyItems.filter(
          (id) => id !== keyItemId,
        );
      }
      saveToStorage(state.run);
    },
    setBellRung(
      state,
      action: PayloadAction<{ bellId: BellOfAwakeningId; rung: boolean }>,
    ) {
      if (!state.run) return;
      const { bellId, rung } = action.payload;
      if (rung) {
        if (!state.run.bellsRung.includes(bellId))
          state.run.bellsRung.push(bellId);
      } else {
        state.run.bellsRung = state.run.bellsRung.filter((id) => id !== bellId);
      }
      saveToStorage(state.run);
    },
    setBossDefeated(
      state,
      action: PayloadAction<{ bossId: BossId; defeated: boolean }>,
    ) {
      if (!state.run) return;
      const { bossId, defeated } = action.payload;
      if (defeated) {
        if (!state.run.bossesDefeated.includes(bossId))
          state.run.bossesDefeated.push(bossId);
      } else {
        state.run.bossesDefeated = state.run.bossesDefeated.filter(
          (id) => id !== bossId,
        );
      }
      saveToStorage(state.run);
    },
    setShortcutUnlocked(
      state,
      action: PayloadAction<{ shortcutId: ShortcutId; unlocked: boolean }>,
    ) {
      if (!state.run) return;
      const { shortcutId, unlocked } = action.payload;
      if (unlocked) {
        if (!state.run.shortcutsUnlocked.includes(shortcutId))
          state.run.shortcutsUnlocked.push(shortcutId);
      } else {
        state.run.shortcutsUnlocked = state.run.shortcutsUnlocked.filter(
          (id) => id !== shortcutId,
        );
      }
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
