import type { MajorEvent } from "./schema";

/**
 * Major events in a Dark Souls 1 run (bells, Lordvessel).
 * Order matches typical progression. dependsOn disables the checkbox until that event is completed.
 */
export const MAJOR_EVENTS: MajorEvent[] = [
  { id: "bell-parish", name: "First Bell of Awakening", areaId: "undead-parish" },
  { id: "bell-blighttown", name: "Second Bell of Awakening", areaId: "quelaags-domain" },
  { id: "lordvessel-procured", name: "Lordvessel procured" },
  {
    id: "lordvessel-placed",
    name: "Lordvessel placed",
    dependsOn: "lordvessel-procured",
  },
];
