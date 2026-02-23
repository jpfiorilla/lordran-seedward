import type { FogGate, Node } from "./schema";

/**
 * Fog gates from randomizer runs. Each gate has two sides (front/back); each side is a node.
 * IDs and node IDs follow: gate id = areaId + "-" + slug; frontNodeId = id + "-front", backNodeId = id + "-back".
 * Sourced from observed run notes (asylum start ↔ firelink nest, burg/depths, catacombs, DLC, etc.).
 */
function gate(
  areaId: string,
  slug: string,
  name: string,
  bossId?: string
): FogGate {
  const id = `${areaId}-${slug}` as FogGate["id"];
  return {
    id,
    areaId,
    frontNodeId: `${id}-front`,
    backNodeId: `${id}-back`,
    name,
    ...(bossId && { bossId }),
  };
}

export const FOG_GATES: FogGate[] = [
  // Northern Undead Asylum
  gate("northern-undead-asylum", "start", "Start"),
  gate("northern-undead-asylum", "boss-gate", "Boss gate"),
  gate("northern-undead-asylum", "stray-demon-arena", "Stray demon arena"),
  // Firelink Shrine
  gate("firelink-shrine", "nest", "Nest"),
  // Undead Burg
  gate("undead-burg", "taurus-demon-exit", "Taurus demon exit"),
  gate("undead-burg", "taurus-demon-arena", "Taurus demon arena"),
  gate("undead-burg", "taurus-demon", "Taurus demon"),
  gate("undead-burg", "bridge", "Bridge"),
  gate("undead-burg", "dragon-cutscene", "Dragon cutscene"),
  gate("undead-burg", "capra-demon", "Capra demon"),
  // The Depths
  gate("the-depths", "boss", "Boss"),
  gate("the-depths", "labyrinth", "Labyrinth"),
  gate("the-depths", "gaping-dragon", "Gaping dragon"),
  // New Londo Ruins
  gate("new-londo-ruins", "entrance", "Entrance"),
  gate("new-londo-ruins", "bridge", "Bridge"),
  gate("new-londo-ruins", "four-kings", "Four Kings"),
  gate("new-londo-ruins", "house", "House"),
  gate("new-londo-ruins", "sealed", "Sealed"),
  // The Catacombs
  gate("the-catacombs", "bridge-door", "Bridge door"),
  gate("the-catacombs", "coffin", "Coffin"),
  gate("the-catacombs", "pinwheel", "Pinwheel"),
  gate("the-catacombs", "pinwheel-arena", "Pinwheel arena"),
  // Sen's Fortress
  gate("sen-fortress", "entrance", "Entrance"),
  gate("sen-fortress", "stairs", "Stairs"),
  gate("sen-fortress", "roof", "Roof"),
  gate("sen-fortress", "iron-golem-arena", "Iron golem arena"),
  // Blighttown
  gate("blighttown", "quelaag", "Quelaag"),
  gate("blighttown", "chimney", "Chimney"),
  gate("blighttown", "quelaag-arena", "Quelaag arena"),
  // Lost Izalith
  gate("lost-izalith", "ceaseless-discharge", "Ceaseless discharge"),
  gate("lost-izalith", "centipede-demon", "Centipede demon"),
  gate("lost-izalith", "centipede-demon-arena", "Centipede demon arena"),
  gate("lost-izalith", "bed-of-chaos", "Bed of Chaos"),
  gate("lost-izalith", "demon-firesage", "Demon Firesage"),
  gate("lost-izalith", "demon-firesage-arena", "Demon Firesage arena"),
  gate("lost-izalith", "demon-centipede", "Demon centipede"),
  // Royal Wood (Oolacile)
  gate("royal-wood", "artorias", "Artorias"),
  gate("royal-wood", "kalameet", "Kalameet"),
  gate("royal-wood", "kalameet-arena", "Kalameet arena"),
  gate("royal-wood", "manus-arena", "Manus arena"),
  gate("royal-wood", "artorias-arena", "Artorias arena"),
  gate("royal-wood", "sanctuary-guardian", "Sanctuary guardian"),
  // Anor Londo
  gate("anor-londo", "o-and-s", "O&S"),
  gate("anor-londo", "archers", "Archers"),
  gate("anor-londo", "rafters", "Rafters"),
  gate("anor-londo", "gwyndolin", "Gwyndolin"),
  gate("anor-londo", "lordvessel", "Lordvessel"),
  gate("anor-londo", "painted-world", "Painted world"),
  gate("anor-londo", "entrance", "Entrance (golem)"),
  // Tomb of the Giants
  gate("tomb-of-the-giants", "nito-arena", "Nito arena"),
  gate("tomb-of-the-giants", "first-bonfire", "First bonfire"),
  gate("tomb-of-the-giants", "nito-entrance", "Nito entrance"),
  gate("tomb-of-the-giants", "dog-gate", "Dog gate"),
  // Darkroot Garden
  gate("darkroot-garden", "sif-door", "Sif door"),
  gate("darkroot-garden", "moonlight-butterfly", "Moonlight butterfly"),
  gate("darkroot-garden", "moonlight-butterfly-arena", "Moonlight butterfly arena"),
  gate("darkroot-garden", "artorias-door", "Artorias door"),
  gate("darkroot-garden", "divine-ember", "Divine ember"),
  gate("darkroot-garden", "sif-arena", "Sif arena"),
  // The Duke's Archives
  gate("the-dukes-archives", "seath-cutscene", "Seath cutscene"),
  gate("the-dukes-archives", "jail", "Jail"),
  gate("the-dukes-archives", "crystal-cave-exit", "Crystal cave exit"),
  // Chasm of the Abyss
  gate("chasm-of-the-abyss", "manus", "Manus"),
  // Sanctuary Garden
  gate("sanctuary-garden", "sanctuary-guardian-arena", "Sanctuary guardian arena"),
  gate("sanctuary-garden", "guardian-hub", "Guardian hub"),
  // Painted World
  gate("painted-world", "courtyard", "Courtyard"),
  gate("painted-world", "boss", "Boss"),
  // Demon Ruins
  gate("demon-ruins", "centipede-demon", "Centipede demon"),
  gate("demon-ruins", "demon-firesage", "Demon Firesage"),
  // Undead Parish
  gate("undead-parish", "gargoyles", "Gargoyles"),
  gate("undead-parish", "gargoyles-arena", "Gargoyles arena"),
  // Great Hollow
  gate("great-hollow", "bottom", "Bottom"),
  // Crystal Cave
  gate("crystal-cave", "seath-arena", "Seath arena"),
];

/**
 * Node records for every fog gate side (front and back). Use with NODES for full graph.
 */
export function getFogGateNodes(areas: { id: string; name: string }[]): Node[] {
  const areaByName = new Map(areas.map((a) => [a.id, a]));
  const nodes: Node[] = [];
  for (const g of FOG_GATES) {
    const areaName = areaByName.get(g.areaId)?.name ?? g.areaId;
    const label = g.name ?? g.id;
    nodes.push(
      {
        id: g.frontNodeId,
        name: `${label} (front)`,
        areaId: g.areaId,
        kind: "path",
      },
      {
        id: g.backNodeId,
        name: `${label} (back)`,
        areaId: g.areaId,
        kind: "path",
      }
    );
  }
  return nodes;
}

/** Lookup by id. */
export const FOG_GATES_BY_ID = new Map(FOG_GATES.map((g) => [g.id, g]));

/** All gate-side node ids (front and back). */
export const FOG_GATE_NODE_IDS = new Set(
  FOG_GATES.flatMap((g) => [g.frontNodeId, g.backNodeId])
);
