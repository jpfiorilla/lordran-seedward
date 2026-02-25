import LZString from "lz-string";
import type { Run, FogGateSide, Area } from "../Constants/schema";

const SHARE_PARAM = "run";

/** Warp tuple: fromId, fromSide, toId, toSide, optional colorIndex */
type CompactWarp = [string, FogGateSide, string, FogGateSide, number?];

type CompactRun = {
  i: string;
  t: number;
  a: unknown[];
  w: CompactWarp[];
  c?: string[];
  k?: string[];
  ki?: string[];
  b?: string[];
  o?: string[];
  s?: string[];
};

function toIdArray(value: unknown, asRecord: boolean): string[] {
  if (Array.isArray(value)) return value;
  if (asRecord && value && typeof value === "object") {
    return Object.entries(value)
      .filter(([, v]) => v === true)
      .map(([k]) => k);
  }
  return [];
}

function compactToRun(c: CompactRun): Run {
  return {
    id: c.i,
    createdAt: c.t,
    areas: c.a as Area[],
    fogGateWarps: (c.w ?? []).map((tuple, i) => {
      const [fg1, s1, fg2, s2, colorIndex] = tuple;
      return {
        from: { fogGateId: fg1, side: s1 },
        to: { fogGateId: fg2, side: s2 },
        colorIndex: colorIndex ?? i,
      };
    }),
    fogGatesCleared: c.c ?? [],
    acquiredKeys: c.k ?? [],
    acquiredKeyItems: c.ki ?? [],
    majorEventsCompleted: c.b ?? [],
    bossesDefeated: c.o ?? [],
    shortcutsUnlocked: c.s ?? [],
  };
}

function runToCompact(run: Run): CompactRun {
  return {
    i: run.id,
    t: run.createdAt,
    a: run.areas,
    w: run.fogGateWarps.map((w, i) => [
      w.from.fogGateId,
      w.from.side,
      w.to.fogGateId,
      w.to.side,
      w.colorIndex ?? i,
    ]),
    c: run.fogGatesCleared?.length ? run.fogGatesCleared : undefined,
    k: run.acquiredKeys.length ? run.acquiredKeys : undefined,
    ki: run.acquiredKeyItems.length ? run.acquiredKeyItems : undefined,
    b: run.majorEventsCompleted.length ? run.majorEventsCompleted : undefined,
    o: run.bossesDefeated.length ? run.bossesDefeated : undefined,
    s: run.shortcutsUnlocked.length ? run.shortcutsUnlocked : undefined,
  };
}

/** Encode run to a short URI-safe string (compact JSON + LZ compression). */
export function encodeRunToShareParam(run: Run): string {
  const compact = runToCompact(run);
  const json = JSON.stringify(compact);
  return LZString.compressToEncodedURIComponent(json);
}

/** Decode run from a share param; returns null if invalid. */
export function decodeRunFromShareParam(param: string | null): Run | null {
  if (!param || typeof param !== "string") return null;
  try {
    const json = LZString.decompressFromEncodedURIComponent(param);
    if (!json) return null;
    const c = JSON.parse(json) as unknown;
    if (!c || typeof c !== "object") return null;
    const comp = c as Record<string, unknown>;
    if (typeof comp.i !== "string" || !Array.isArray(comp.a)) return null;
    const rawW = comp.w as CompactWarp[] | undefined;
    const warps: CompactWarp[] = Array.isArray(rawW)
      ? rawW.map((tuple) => {
          if (tuple.length >= 5) return tuple;
          const [fg1, s1, fg2, s2] = tuple;
          return [fg1, s1, fg2, s2, undefined];
        })
      : [];
    const compact: CompactRun = {
      i: comp.i,
      t: typeof comp.t === "number" ? comp.t : Date.now(),
      a: comp.a,
      w: warps,
      c: Array.isArray(comp.c) ? comp.c : undefined,
      k: toIdArray(comp.k, true),
      ki: toIdArray(comp.ki, true),
      b: toIdArray(comp.b, true),
      o: toIdArray(comp.o, true),
      s: toIdArray(comp.s, true),
    };
    return compactToRun(compact);
  } catch {
    return null;
  }
}

export { SHARE_PARAM };
