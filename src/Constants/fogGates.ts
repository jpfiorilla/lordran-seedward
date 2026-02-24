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
  "firelink-shrine": ["birds-nest"],
  "undead-burg": [
    "hellkite-dragon-cutscene",
    "taurus-demon",
    "taurus-demon-arena",
    "taurus-demon-exit",
    "capra-demon-arena",
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
  "the-depths": ["channeler", "gaping-dragon-entrance", "gaping-dragon-arena"],
  "new-londo-ruins": [
    "catwalks",
    "mass-of-souls",
    "four-kings-entrance",
    "four-kings-arena",
  ],
  "the-catacombs": ["patches-bridge", "gravelord-coffin", "pinwheel-arena"],
  "sen-fortress": [
    "stairwell",
    "roof",
    "iron-golem-entrance",
    "iron-golem-arena",
    "exit",
  ],
  blighttown: [
    "whip",
    "quelaag",
    "quelaag-arena",
    "quelaags-domain",
    "great-hollow",
  ],
  "lost-izalith": ["bed-of-chaos", "bed-of-chaos-arena"],
  "demon-ruins": [
    "ceaseless-discharge-entrance",
    "ceaseless-discharge-arena",
    "centipede-demon-entrance",
    "centipede-demon-arena",
    "centipede-demon-exit",
    "demon-firesage-entrance",
    "demon-firesage-arena",
    "demon-firesage-exit",
  ],
  "royal-wood": [
    "artorias-entrance",
    "artorias-arena",
    "artorias-exit",
    "kalameet",
    "kalameet-arena",
    "manus-entrance",
    "manus-arena",
  ],
  "anor-londo": [
    "entrance",
    "rafters",
    "archers",
    "ornstein-and-smough-entrance",
    "ornstein-elevator",
    "smough-elevator",
    "darkmoon-tomb",
    "painted-world",
  ],
  "tomb-of-the-giants": [
    "dog-gate",
    "nito-entrance",
    "nito-arena",
    "nito-arena-gravelord-version",
  ],
  "the-dukes-archives": [
    "seath-cutscene",
    "staff-jail",
    "library-exit",
    "seath-the-scaleless",
    "seath-the-scaleless-arena",
  ],
  "sanctuary-garden": [
    "guardian-foyer",
    "sanctuary-guardian-entrance",
    "sanctuary-guardian-arena",
    "sanctuary-guardian-exit",
  ],
  "painted-world": [
    "courtyard",
    "crossbreed-priscilla",
    "crossbreed-priscilla-arena",
  ],
  "great-hollow": ["bottom"],
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
  gate("firelink-shrine", "birds-nest", "Bird's nest", { noBack: true }),
  gate("undead-burg", "hellkite-dragon-cutscene", "Hellkite dragon cutscene"),
  gate("undead-burg", "taurus-demon", "Taurus demon", { noBack: true }),
  gate("undead-burg", "taurus-demon-exit", "Taurus demon exit", {
    noFront: true,
  }),
  gate("undead-burg", "taurus-demon-arena", "Taurus demon arena", {
    bossId: "taurus-demon",
  }),
  gate("undead-burg", "capra-demon-arena", "Capra demon arena", {
    bossId: "capra-demon",
    noBack: true,
  }),
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
  gate("the-depths", "channeler", "Channeler"),
  gate("the-depths", "gaping-dragon-entrance", "Gaping dragon entrance", {
    noBack: true,
  }),
  gate("the-depths", "gaping-dragon-arena", "Gaping dragon arena", {
    bossId: "gaping-dragon",
    noBack: true,
  }),
  gate("new-londo-ruins", "catwalks", "Catwalks"),
  gate("new-londo-ruins", "mass-of-souls", "Mass of souls"),
  gate("new-londo-ruins", "four-kings-entrance", "Four Kings entrance", {
    noBack: true,
  }),
  gate("new-londo-ruins", "four-kings-arena", "Four Kings arena", {
    bossId: "four-kings",
    noFront: true,
  }),
  gate("the-catacombs", "patches-bridge", "Patches bridge"),
  gate("the-catacombs", "gravelord-coffin", "Gravelord coffin", {
    noBack: true,
  }),
  gate("the-catacombs", "pinwheel-arena", "Pinwheel arena", {
    bossId: "pinwheel",
    noBack: true,
  }),
  gate("sen-fortress", "stairwell", "Stairwell"),
  gate("sen-fortress", "roof", "Roof"),
  gate("sen-fortress", "iron-golem-entrance", "Iron golem entrance", {
    noBack: true,
  }),
  gate("sen-fortress", "iron-golem-arena", "Iron golem arena"),
  gate("sen-fortress", "exit", "Exit", { noFront: true }),
  gate("blighttown", "whip", "Whip"),
  gate("blighttown", "quelaag", "Quelaag", { noBack: true }),
  gate("blighttown", "quelaag-arena", "Quelaag arena", {
    bossId: "chaos-witch-quelaag",
  }),
  gate("blighttown", "quelaags-domain", "Quelaag's domain", {
    noFront: true,
  }),
  gate("blighttown", "great-hollow", "Great hollow"),
  gate("lost-izalith", "bed-of-chaos", "Bed of Chaos", { noBack: true }),
  gate("lost-izalith", "bed-of-chaos-arena", "Bed of Chaos arena", {
    noFront: true,
    bossId: "bed-of-chaos",
  }),
  gate("royal-wood", "artorias-entrance", "Artorias entrance", {
    noBack: true,
  }),
  gate("royal-wood", "artorias-arena", "Artorias arena", {
    bossId: "artorias",
  }),
  gate("royal-wood", "artorias-exit", "Artorias exit", {
    noFront: true,
  }),
  gate("royal-wood", "kalameet", "Kalameet", {
    noBack: true,
  }),
  gate("royal-wood", "kalameet-arena", "Kalameet arena", {
    noFront: true,
    bossId: "black-dragon-kalameet",
  }),
  gate("royal-wood", "manus-entrance", "Manus entrance", { noBack: true }),
  gate("royal-wood", "manus-arena", "Manus arena", {
    bossId: "manus-father-of-the-abyss",
    noFront: true,
  }),
  gate("anor-londo", "entrance", "Entrance", { noFront: true }),
  gate(
    "anor-londo",
    "ornstein-and-smough-entrance",
    "Ornstein and Smough entrance",
    {
      bossId: "ornstein-and-smough",
    },
  ),
  gate("anor-londo", "ornstein-elevator", "Ornstein elevator"),
  gate("anor-londo", "smough-elevator", "Smough elevator"),
  gate("anor-londo", "archers", "Archers"),
  gate("anor-londo", "rafters", "Rafters"),
  gate("anor-londo", "darkmoon-tomb", "Darkmoon tomb"),
  gate("anor-londo", "painted-world", "Painted world", { noBack: true }),
  gate("tomb-of-the-giants", "dog-gate", "Dog gate"),
  gate("tomb-of-the-giants", "nito-entrance", "Nito entrance", {
    noBack: true,
  }),
  gate("tomb-of-the-giants", "nito-arena", "Nito arena", {
    bossId: "nito",
    noFront: true,
  }),
  gate(
    "tomb-of-the-giants",
    "nito-arena-gravelord-version",
    "Nito arena (Gravelord version)",
    {
      noFront: true,
    },
  ),
  gate("the-dukes-archives", "seath-cutscene", "Seath cutscene"),
  gate("the-dukes-archives", "staff-jail", "Staff/Jail"),
  gate("the-dukes-archives", "library-exit", "Library exit"),
  gate("the-dukes-archives", "seath-the-scaleless", "Seath the Scaleless", {
    noBack: true,
  }),
  gate(
    "the-dukes-archives",
    "seath-the-scaleless-arena",
    "Seath the Scaleless arena",
    { noFront: true, bossId: "seath-the-scaleless" },
  ),
  gate("sanctuary-garden", "guardian-foyer", "Guardian foyer", {
    noBack: true,
  }),
  gate(
    "sanctuary-garden",
    "sanctuary-guardian-entrance",
    "Sanctuary guardian entrance",
    {
      noBack: true,
    },
  ),
  gate(
    "sanctuary-garden",
    "sanctuary-guardian-arena",
    "Sanctuary guardian arena",
    { bossId: "sanctuary-guardian" },
  ),
  gate(
    "sanctuary-garden",
    "sanctuary-guardian-exit",
    "Sanctuary guardian exit",
    {
      noFront: true,
    },
  ),
  gate("painted-world", "courtyard", "Courtyard"),
  gate("painted-world", "crossbreed-priscilla", "Crossbreed Priscilla", {
    noBack: true,
  }),
  gate(
    "painted-world",
    "crossbreed-priscilla-arena",
    "Crossbreed Priscilla arena",
    {
      bossId: "crossbreed-priscilla",
      noFront: true,
    },
  ),
  gate("demon-ruins", "ceaseless-discharge-entrance", "Ceaseless discharge", {
    noBack: true,
  }),
  gate(
    "demon-ruins",
    "ceaseless-discharge-arena",
    "Ceaseless discharge arena",
    {
      bossId: "ceaseless-discharge",
      noFront: true,
    },
  ),
  gate("demon-ruins", "centipede-demon-entrance", "Centipede demon", {
    noBack: true,
  }),
  gate("demon-ruins", "centipede-demon-arena", "Centipede demon arena", {
    bossId: "centipede-demon",
  }),
  gate("demon-ruins", "centipede-demon-exit", "Centipede demon exit", {
    noFront: true,
  }),
  gate("demon-ruins", "demon-firesage-entrance", "Demon firesage", {
    noBack: true,
  }),
  gate("demon-ruins", "demon-firesage-arena", "Demon Firesage arena", {
    bossId: "demon-firesage",
  }),
  gate("demon-ruins", "demon-firesage-exit", "Demon firesage exit", {
    noFront: true,
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
