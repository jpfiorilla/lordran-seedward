import type {
  Connection,
  Run,
  FogGate,
  FogGateSideRef,
} from "../Constants/schema";

/**
 * True if this connection can be traversed given current run state.
 */
export function isConnectionAvailable(conn: Connection, run: Run | null): boolean {
  if (!run) {
    return conn.kind === "always" && !conn.shortcutId && !conn.keyId;
  }
  if (conn.shortcutId && !run.shortcutsUnlocked.includes(conn.shortcutId)) return false;
  if (conn.kind === "door" && conn.keyId && !run.acquiredKeys.includes(conn.keyId)) return false;
  return true;
}

function sideKey(ref: FogGateSideRef): string {
  return `${ref.fogGateId}:${ref.side}`;
}

/**
 * Node ids reachable from this node by crossing one fog gate (using run's warp table).
 * Gate is only traversable if it has no bossId or that boss is defeated.
 */
export function getFogGateExits(
  fromNodeId: string,
  fogGates: FogGate[],
  run: Run | null
): Set<string> {
  const out = new Set<string>();
  if (!run?.fogGateWarps?.length) return out;
  const sideToNode = new Map<string, string>();
  for (const g of fogGates) {
    sideToNode.set(`${g.id}:front`, g.frontNodeId);
    sideToNode.set(`${g.id}:back`, g.backNodeId);
  }
  const warpTo = new Map<string, FogGateSideRef>();
  for (const w of run.fogGateWarps) {
    warpTo.set(sideKey(w.from), w.to);
  }
  for (const g of fogGates) {
    let side: "front" | "back" | null = null;
    if (g.frontNodeId === fromNodeId) side = "front";
    else if (g.backNodeId === fromNodeId) side = "back";
    if (side === null) continue;
    if (g.bossId && run && !run.bossesDefeated.includes(g.bossId)) continue;
    const target = warpTo.get(sideKey({ fogGateId: g.id, side }));
    if (!target) continue;
    const destNode = sideToNode.get(sideKey(target));
    if (destNode) out.add(destNode);
  }
  return out;
}

/**
 * From start node ids, walk the graph using available connections and fog gate warps.
 * Pass flattened fog gates (e.g. run.areas.flatMap(a => a.fogGates)) for fog traversal.
 */
export function getReachableNodeIds(
  connections: Connection[],
  fogGates: FogGate[],
  run: Run | null,
  startNodeIds: readonly string[]
): Set<string> {
  const reachable = new Set<string>(startNodeIds);
  let frontier = [...startNodeIds];
  while (frontier.length > 0) {
    const from = frontier.pop()!;
    for (const conn of connections) {
      if (conn.fromNodeId !== from) continue;
      if (!isConnectionAvailable(conn, run)) continue;
      if (reachable.has(conn.toNodeId)) continue;
      reachable.add(conn.toNodeId);
      frontier.push(conn.toNodeId);
    }
    const fogExits = getFogGateExits(from, fogGates, run);
    for (const nodeId of fogExits) {
      if (reachable.has(nodeId)) continue;
      reachable.add(nodeId);
      frontier.push(nodeId);
    }
  }
  return reachable;
}

/**
 * Connections that start from the given node (for "from Firelink" style UI).
 */
export function getConnectionsFrom(
  connections: Connection[],
  fromNodeId: string
): Connection[] {
  return connections.filter((c) => c.fromNodeId === fromNodeId);
}
