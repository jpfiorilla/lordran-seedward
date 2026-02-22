# Connections & nodes (design)

Accessible game space is a **graph of nodes** linked by **connections**. Whether a connection is available depends on its kind and run state.

## Nodes vs Areas

- **Areas** are the high-level regions we use for display (Undead Burg, Blighttown, etc.) and for grouping bosses, bonfires, etc. They don’t need to match the traversal graph 1:1.
- **Nodes** are the actual locations in that graph: rooms, corridors, boss arenas, etc. A node can optionally have an `areaId` to group it under an Area, but the graph is defined by nodes and connections, not by areas.

So “sub-areas” that don’t map cleanly to Areas are just **nodes** with or without an `areaId`; connections define how you move between them.

## Boss arenas

Each boss has an **arena** (a node with `kind: 'arena'` and `bossId`). That arena has one to three **fog gates** (connections with `kind: 'fog_gate'` and `bossId`). Those are well-defined in the game data. A fog-gate connection is **available** when that boss is defeated in the run (or when the gate is marked cleared in run state, depending how we want to track it).

## Connection availability (run state)

- **`fog_gate`** – available when `bossId` is in `run.bossesDefeated` (and optionally when the gate is “cleared” in run if we track that).
- **`door`** – available when `keyId` is in `run.acquiredKeys`.
- **`one_way`** / **`always`** – available when you can reach `fromNodeId` (derived by walking the graph from a start node).

So we don’t need to store “connection unlocked” in the run; we can **derive** it from connection kind + run state. If we later need to track “gate cleared but boss not defeated” or one-way state, we can add run-state fields then.

## Next steps

- Add base data: **nodes** (at least every boss arena + major regions) and **connections** (fog gates, key doors, one-ways).
- Implement **reachability**: from a set of start nodes, walk the graph using only available connections to get the set of reachable nodes.
- UI: show the graph or a list of reachable nodes/areas; optionally grey out or hide unreachable parts.
