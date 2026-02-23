import type { FogGate, Node } from "./schema";

/**
 * Fog gates from randomizer runs. Each gate has one or two sides (front/back); each side is a node.
 * IDs and node IDs follow: gate id = areaId + "-" + slug; frontNodeId = id + "-front", backNodeId = id + "-back".
 * Use { noFront: true } or { noBack: true } for gates that only have one side.
 * Cross-referenced with: https://darksouls.fandom.com/wiki/Fog_Door
 */
function gate(
  areaId: string,
  slug: string,
  name: string,
  opts?: { bossId?: string; noFront?: boolean; noBack?: boolean },
): FogGate {
  const id = `${areaId}-${slug}` as FogGate["id"];
  return {
    id,
    areaId,
    ...(!opts?.noFront && { frontNodeId: `${id}-front` }),
    ...(!opts?.noBack && { backNodeId: `${id}-back` }),
    name,
    ...(opts?.bossId && { bossId: opts.bossId }),
  };
}

/** Gate slug order per area: standard critical path (order encountered in a typical run). */
const CRITICAL_PATH_ORDER: Record<string, string[]> = {
  "northern-undead-asylum": ["start", "boss-gate", "stray-demon-arena"],
  "firelink-shrine": ["nest"],
  "undead-burg": [
    "hellkite-dragon-cutscene",
    "taurus-demon",
    "taurus-demon-arena",
    "taurus-demon-exit",
    "capra-demon",
  ],
  "undead-parish": ["bridge", "gargoyles", "gargoyles-arena"],
  "darkroot-garden": [
    "crest-of-artorias-door",
    "moonlight-butterfly",
    "moonlight-butterfly-arena",
    "divine-ember",
    "sif-door",
    "sif-arena",
  ],
  "the-depths": ["labyrinth", "gaping-dragon", "boss"],
  "new-londo-ruins": ["entrance", "bridge", "house", "sealed", "four-kings"],
  "the-catacombs": ["bridge-door", "coffin", "pinwheel", "pinwheel-arena"],
  "sen-fortress": ["entrance", "stairs", "roof", "iron-golem-arena"],
  blighttown: ["chimney", "quelaag", "quelaag-arena"],
  "quelaags-domain": ["quelaag"],
  "lost-izalith": [
    "ceaseless-discharge",
    "demon-firesage",
    "demon-firesage-arena",
    "centipede-demon",
    "centipede-demon-arena",
    "bed-of-chaos",
    "demon-centipede",
  ],
  "demon-ruins": ["ceaseless-discharge", "demon-firesage", "centipede-demon"],
  "royal-wood": [
    "sanctuary-guardian",
    "artorias-arena",
    "artorias",
    "kalameet",
    "kalameet-arena",
    "manus-arena",
  ],
  "anor-londo": [
    "entrance",
    "rafters",
    "archers",
    "o-and-s",
    "lordvessel",
    "gwyndolin",
    "painted-world",
  ],
  "tomb-of-the-giants": [
    "first-bonfire",
    "dog-gate",
    "nito-entrance",
    "nito-arena",
  ],
  "the-dukes-archives": ["seath-cutscene", "jail", "crystal-cave-exit"],
  "crystal-cave": ["seath-arena"],
  "chasm-of-the-abyss": ["manus"],
  "sanctuary-garden": ["guardian-hub", "sanctuary-guardian-arena"],
  "painted-world": ["courtyard", "boss"],
  "great-hollow": ["bottom"],
  "kiln-of-the-first-flame": ["gwyn"],
};

function gateOrderIndex(g: FogGate): number {
  const order = CRITICAL_PATH_ORDER[g.areaId];
  if (!order) return 999;
  const slug = g.id.slice(g.areaId.length + 1);
  const i = order.indexOf(slug);
  return i === -1 ? 999 : i;
}

const GATES_UNSORTED: FogGate[] = [
  gate("northern-undead-asylum", "start", "Start (Oscar)"),
  gate("northern-undead-asylum", "boss-gate", "Boss gate"),
  gate("northern-undead-asylum", "stray-demon-arena", "Stray demon arena", {
    bossId: "stray-demon",
    noBack: true,
  }),
  gate("firelink-shrine", "nest", "Nest", { noBack: true }),
  gate("undead-burg", "hellkite-dragon-cutscene", "Hellkite dragon cutscene"),
  gate("undead-burg", "taurus-demon", "Taurus demon", { noBack: true }),
  gate("undead-burg", "taurus-demon-exit", "Taurus demon exit", {
    noFront: true,
  }),
  gate("undead-burg", "taurus-demon-arena", "Taurus demon arena", {
    bossId: "taurus-demon",
  }),
  gate("undead-burg", "capra-demon", "Capra demon"),
  gate("undead-parish", "bridge", "Bridge"),
  gate("undead-parish", "gargoyles", "Gargoyles", { noBack: true }),
  gate("undead-parish", "gargoyles-arena", "Gargoyles arena", {
    bossId: "bell-gargoyles",
  }),
  gate("undead-parish", "gargoyles-arena-exit", "Gargoyles arena exit", {
    noFront: true,
  }),
  gate("darkroot-garden", "crest-of-artorias-door", "Crest of Artorias door"),
  gate("darkroot-garden", "moonlight-butterfly", "Moonlight butterfly", {
    noBack: true,
  }),
  gate("darkroot-garden", "sif-door", "Sif door"),
  gate(
    "darkroot-garden",
    "moonlight-butterfly-arena",
    "Moonlight butterfly arena",
    { bossId: "moonlight-butterfly" },
  ),
  gate("darkroot-garden", "divine-ember", "Divine ember", { noFront: true }),
  gate("darkroot-garden", "sif-arena", "Sif arena", {
    bossId: "sif",
    noBack: true,
  }),
  gate("the-depths", "boss", "Boss"),
  gate("the-depths", "labyrinth", "Labyrinth"),
  gate("the-depths", "gaping-dragon", "Gaping dragon"),
  gate("new-londo-ruins", "entrance", "Entrance"),
  gate("new-londo-ruins", "bridge", "Bridge"),
  gate("new-londo-ruins", "four-kings", "Four Kings"),
  gate("new-londo-ruins", "house", "House"),
  gate("new-londo-ruins", "sealed", "Sealed"),
  gate("the-catacombs", "bridge-door", "Bridge door"),
  gate("the-catacombs", "coffin", "Coffin"),
  gate("the-catacombs", "pinwheel", "Pinwheel"),
  gate("the-catacombs", "pinwheel-arena", "Pinwheel arena"),
  gate("sen-fortress", "entrance", "Entrance"),
  gate("sen-fortress", "stairs", "Stairs"),
  gate("sen-fortress", "roof", "Roof"),
  gate("sen-fortress", "iron-golem-arena", "Iron golem arena"),
  gate("blighttown", "quelaag", "Quelaag"),
  gate("blighttown", "chimney", "Chimney"),
  gate("blighttown", "quelaag-arena", "Quelaag arena"),
  gate("quelaags-domain", "quelaag", "Quelaag", {
    bossId: "chaos-witch-quelaag",
  }),
  gate("lost-izalith", "ceaseless-discharge", "Ceaseless discharge"),
  gate("lost-izalith", "centipede-demon", "Centipede demon"),
  gate("lost-izalith", "centipede-demon-arena", "Centipede demon arena"),
  gate("lost-izalith", "bed-of-chaos", "Bed of Chaos"),
  gate("lost-izalith", "demon-firesage", "Demon Firesage"),
  gate("lost-izalith", "demon-firesage-arena", "Demon Firesage arena"),
  gate("lost-izalith", "demon-centipede", "Demon centipede"),
  gate("royal-wood", "artorias", "Artorias"),
  gate("royal-wood", "kalameet", "Kalameet"),
  gate("royal-wood", "kalameet-arena", "Kalameet arena"),
  gate("royal-wood", "manus-arena", "Manus arena"),
  gate("royal-wood", "artorias-arena", "Artorias arena"),
  gate("royal-wood", "sanctuary-guardian", "Sanctuary guardian"),
  gate("anor-londo", "o-and-s", "O&S"),
  gate("anor-londo", "archers", "Archers"),
  gate("anor-londo", "rafters", "Rafters"),
  gate("anor-londo", "gwyndolin", "Gwyndolin"),
  gate("anor-londo", "lordvessel", "Lordvessel"),
  gate("anor-londo", "painted-world", "Painted world"),
  gate("anor-londo", "entrance", "Entrance (golem)"),
  gate("tomb-of-the-giants", "nito-arena", "Nito arena"),
  gate("tomb-of-the-giants", "first-bonfire", "First bonfire"),
  gate("tomb-of-the-giants", "nito-entrance", "Nito entrance"),
  gate("tomb-of-the-giants", "dog-gate", "Dog gate"),
  gate("the-dukes-archives", "seath-cutscene", "Seath cutscene"),
  gate("the-dukes-archives", "jail", "Jail"),
  gate("the-dukes-archives", "crystal-cave-exit", "Crystal cave exit"),
  gate("chasm-of-the-abyss", "manus", "Manus"),
  gate(
    "sanctuary-garden",
    "sanctuary-guardian-arena",
    "Sanctuary guardian arena",
  ),
  gate("sanctuary-garden", "guardian-hub", "Guardian hub"),
  gate("painted-world", "courtyard", "Courtyard"),
  gate("painted-world", "boss", "Boss"),
  gate("demon-ruins", "ceaseless-discharge", "Ceaseless discharge", {
    bossId: "ceaseless-discharge",
  }),
  gate("demon-ruins", "centipede-demon", "Centipede demon"),
  gate("demon-ruins", "demon-firesage", "Demon Firesage"),
  gate("great-hollow", "bottom", "Bottom"),
  gate("crystal-cave", "seath-arena", "Seath arena"),
  gate("kiln-of-the-first-flame", "gwyn", "Gwyn", {
    bossId: "gwyn-lord-of-cinder",
  }),
];

/** Sorted by area then by critical path order within each area. */
export const FOG_GATES: FogGate[] = [...GATES_UNSORTED].sort((a, b) => {
  if (a.areaId !== b.areaId) return a.areaId.localeCompare(b.areaId);
  return gateOrderIndex(a) - gateOrderIndex(b);
});

/**
 * Node records for every fog gate side (front and back). Use with NODES for full graph.
 */
export function getFogGateNodes(
  _areas: { id: string; name: string }[],
): Node[] {
  const nodes: Node[] = [];
  for (const g of FOG_GATES) {
    const label = g.name ?? g.id;
    if (g.frontNodeId)
      nodes.push({
        id: g.frontNodeId,
        name: `${label} (front)`,
        areaId: g.areaId,
        kind: "path",
      });
    if (g.backNodeId)
      nodes.push({
        id: g.backNodeId,
        name: `${label} (back)`,
        areaId: g.areaId,
        kind: "path",
      });
  }
  return nodes;
}

/** Lookup by id. */
export const FOG_GATES_BY_ID = new Map(FOG_GATES.map((g) => [g.id, g]));

/** All gate-side node ids (front and back, where defined). */
export const FOG_GATE_NODE_IDS = new Set(
  FOG_GATES.flatMap((g) => [g.frontNodeId, g.backNodeId].filter(Boolean)),
);
