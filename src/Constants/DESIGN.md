# Connections & nodes (design)

Accessible game space is a **graph of nodes** linked by **connections**. Whether a connection is available depends on its kind and run state.

## Nodes vs Areas

- **Areas** are the high-level regions we use for display (Undead Burg, Blighttown, etc.) and for grouping bosses, bonfires, etc. They don’t need to match the traversal graph 1:1.
- **Nodes** are the actual locations in that graph: rooms, corridors, boss arenas, etc. A node can optionally have an `areaId` to group it under an Area, but the graph is defined by nodes and connections, not by areas.

So “sub-areas” that don’t map cleanly to Areas are just **nodes** with or without an `areaId`; connections define how you move between them.

## Fog gates (randomizer)

We build this tool for **randomizer runs**. In randomizers:

- **Fog gates don't respawn** – once you've gone through, they stay open.
- Each gate has **two sides**, colloquially the **front** and **back** (as the canonical-run player would experience them). Each side attaches to a **node** (`frontNodeId`, `backNodeId` on the gate). All fog gates exist within an **area** (`areaId`).
- **Each side** of a gate goes to a **completely independent** other front or back of **another** fog gate. So the "connection" through a gate is not fixed: it's determined by the **seed**. The run stores a **warp table** (`run.fogGateWarps`): for each (gate, side), which (other gate, side) you emerge at.

So fog gates are **not** static graph edges. They are first-class entities (id, areaId, frontNodeId, backNodeId, optional bossId). Traversal is: at node N, find gates whose front or back is N; if the gate is available (no bossId or boss defeated), look up the warp target (gate′, side′) and move to that gate's node for that side. Reachability therefore uses both static **connections** (doors, one-ways, always) and **fog gate warps** from the run.

## Boss arenas

Each boss has an **arena** (a node with `kind: 'arena'` and `bossId`). That arena has one to three **fog gates**. A fog gate can have `bossId` set so it's only traversable once that boss is defeated.

## Connection availability (run state)

- **Static connections** (`door`, `one_way`, `always`) – door when `keyId` is in `run.acquiredKeys`; shortcut when `shortcutId` is in `run.shortcutsUnlocked`; one_way/always when you can reach `fromNodeId`.
- **Fog gates** – traversable when the gate has no `bossId` or that boss is in `run.bossesDefeated`; destination comes from `run.fogGateWarps`, not from the static connection graph.

## Reference map

A map of Lordran and how it’s all connected is kept in [REFERENCES.md](./REFERENCES.md). Use it when adding or editing nodes, connections, and areas.

## Next steps

- Add base data: **nodes** (at least every boss arena + major regions), **connections** (doors, one-ways, paths), and **fog gates** (per area, with frontNodeId/backNodeId).
- Reachability already walks the graph using connections and fog warps.
- UI: show reachable nodes/areas; optionally let the user load or edit the fog gate warp table for their seed.
