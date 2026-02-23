# Fog gate warp UI – design & plan

This doc outlines how to present and edit the information you track in a run: **which gates you’ve accessed** and **how they teleport you around the world**. It’s based on the kind of notes that work well in a Google Doc (warp pairs, grouping, “need” notes, dead ends) and adapts that into an in-app design.

---

## What we’re representing

From your notes, the useful unit is a **warp pair**: one fog gate (two sides) that connects two locations. Each side is:

- **Area** (e.g. undead burg, anor londo)
- **Gate label** (e.g. taurus demon exit, o&s arena, dragon cutscene)
- **Side** (front / rear)

So one row in your doc is one warp: **Side A ↔ Side B**. The same gate might appear on multiple rows (once per “connection” in the seed), and you group rows by status (start, in progress, completed) and annotate with “need: X” or “(dead end)”.

---

## Core data we already have

- **FogGate**: id, areaId, frontNodeId, backNodeId, name?, bossId?
- **FogGateWarp**: `{ from: { fogGateId, side }, to: { fogGateId, side } }`
- **Run.fogGateWarps**: array of warps (the seed)
- **Run.fogGatesCleared**: optional list of gate ids you’ve passed through

So we can already store “Side A ↔ Side B” and “which gates I’ve used.” What we’re designing is **how to show and edit this** and, optionally, a bit of **extra metadata** (need, dead end, loop) if we want to support your “paths in progress” and “dead end” annotations.

---

## 1. Primary view: warp list (the main interface)

**Goal:** One place to see every warp in the run, in a form that’s as scannable as your doc.

**Format per row:**

- **Left side:** `Area: Gate name (front|rear)`  
- **Right side:** `Area: Gate name (front|rear)`  
- Optional: status badge (available / need X / completed) and tags (dead end, loop).

**Display options:**

- **Table:** Columns e.g. `From (area: gate side)` | `To (area: gate side)` | Status | Notes. Sortable by area, status, or “used” (cleared).
- **Card list:** Each warp is a card with both sides and optional notes; cards can be grouped (see below).
- **Compact list:** One line per warp, e.g. `undead burg: taurus demon exit rear ↔ depths: boss front`, with optional status/notes on the same line or on expand.

**Recommendation:** Start with a **single scrollable list** (table or compact lines). Each row = one `FogGateWarp`. Resolve fogGateId + side to “Area: Gate name (front|back)” using static fog gate + area data. No schema change.

---

## 2. Grouping and sections (like your doc)

Your doc has:

- **Start** – where you begin (e.g. asylum start ↔ firelink nest).
- **Main body** – warps you’ve discovered and use.
- **Paths in progress** – warps you know about but are blocked, with “need: X”.
- **Completed** – warps you’ve “finished” or that are dead ends.

**Proposed grouping in the app:**

1. **By status (optional, if we add status):**
   - **Available** – you can use this warp now (no blocker, or you have the key/boss/etc.).
   - **Blocked** – you know the warp but need something (“need: place lordvessel”, “need: orange ring”).
   - **Used / completed** – you’ve gone through (or marked as done); optionally infer from `fogGatesCleared` or an explicit “completed” flag.

2. **By area (always useful):**
   - Filter: “Show only warps involving [Undead Burg / Anor Londo / …].”
   - Or group rows under area headers so you can quickly find “all warps from Sen’s” or “all warps into Blighttown.”

3. **Start / first steps:**
   - A small “Start” block: show start node(s) and the warp(s) that leave from them (e.g. “Undead Asylum: start ↔ Firelink Shrine: nest”). This can be derived from `START_NODE_IDS` + which warps have a side at that node.

**Implementation:** Grouping can be view-only (compute from `fogGateWarps` + areas + run state). “Blocked” and “Completed” are nicer with a tiny bit of extra data (see §4).

---

## 3. Labels: “Area: Gate name (front|rear)”

To match your doc we need a **readable label** for each (gate, side).

- **Area:** From `FogGate.areaId` → area name (we have area names in constants).
- **Gate name:** From `FogGate.name`; if missing, fallback to node name or “Gate &lt;id&gt;”.
- **Side:** Map our `front`/`back` to your “front”/“rear” (same idea); display as “(front)” or “(rear)” or “(back)”.

So the main work is **data**: ensure every fog gate in the seed has an `areaId` and a good `name`. The UI then just formats “{areaName}: {gateName} ({side})” for each side of every warp. No schema change for the UI itself.

---

## 4. Optional metadata: “need”, dead end, loop

Your “need: …” and “(dead end)” notes are very useful. Two ways to support them:

**Option A – Free-form note per warp (simplest)**  
- Add to run state: `warpNotes?: Record<string, string>` keyed by something like `warpKey(from, to)` (e.g. `${from.fogGateId}:${from.side}-${to.fogGateId}:${to.side}`).
- User can type “need: place lordvessel” or “dead end” or anything. No structure, but flexible and quick to implement.

**Option B – Structured “need” + tags**  
- **Prerequisite per warp (or per gate side):** e.g. `needKeyId`, `needKeyItemId`, `needLordvessel`, `needTriggerId` (stray demon, etc.), or a generic `needLabel: string`.
- **Tags:** `deadEnd`, `loop`, `optionalBoss` as booleans or a small enum on the “to” side or on the warp.
- Better for filtering (“show me all warps that need lordvessel”) and for future automation (e.g. graying out warps you can’t use yet). Slightly more schema and UI (dropdowns / checkboxes).

**Recommendation:** Start with **Option A** (one free-form note per warp). If we later see repeated “need” patterns, we can add structured fields and/or preset “need” options. Schema: e.g. `Run.warpNotes?: { [warpKey: string]: string }` and optionally `warpTags?: { [warpKey: string]: ('dead_end' | 'loop' | 'optional_boss')[] }` if we want tags without parsing text.

---

## 5. Editing and adding warps

**Viewing** is the main use case; **editing** is needed when the user has seed info or discovers a warp in-game.

- **Add warp:**  
  - “Add warp” opens a small form: choose “From” (gate + side) and “To” (gate + side).  
  - From/To could be two dropdowns (or searchable selects): first pick area, then gate, then front/back. Or a single dropdown of “Area: Gate (side)” options.  
  - On submit, append one `FogGateWarp` to `run.fogGateWarps` and optionally a line in `warpNotes`.

- **Edit warp:**  
  - Click a row → edit “To” (and optionally “From” if we allow it) and note.  
  - Persist as update to `run.fogGateWarps` and `warpNotes`.

- **Delete warp:**  
  - Remove that entry from `run.fogGateWarps` and any note.

- **Bulk import (stretch):**  
  - Paste text in the style of your doc (e.g. “undead burg: taurus demon exit rear ↔ depths: boss front”) and parse lines into warp pairs. Requires a consistent format and a mapping from “area: gate side” text → (fogGateId, side). Nice later iteration.

---

## 6. Start block and “paths in progress”

- **Start:**  
  - Small section at top: “Start: &lt;start node names&gt;” and the warp(s) that leave from start (e.g. “Undead Asylum: start ↔ Firelink Shrine: nest”). Completely derived from `START_NODE_IDS` and `fogGateWarps` + gate/node data.

- **Paths in progress:**  
  - If we have notes (Option A), filter or group rows where the note contains “need” or a specific prefix.  
  - If we add structured “need” (Option B), filter by “blocked” / “need lordvessel” etc.  
  - Section heading: “Paths in progress” and list those warps with the “need” text or tag visible.

- **Completed / used:**  
  - Either use `fogGatesCleared` to infer “you’ve used this gate” and optionally dim or move to a “Completed” section, or add an explicit “mark as completed” and store that in run state (e.g. `warpCompleted?: string[]` by warpKey). Your “Completed” section can be “warps we’ve used” or “warps that are dead ends / done”; the UI can offer both filters.

---

## 7. Suggested implementation order

1. **Warp list view (read-only)**  
   - One list/table of all `run.fogGateWarps`.  
   - Each row: “Area: Gate (front|back) ↔ Area: Gate (front|back)” using existing FogGate + Area data.  
   - Empty state: “No warps yet. Add warps from your seed or as you discover them.”

2. **Add / edit / delete warp**  
   - Form to pick From (gate + side) and To (gate + side); save to `run.fogGateWarps`.  
   - Inline or modal edit for existing row; delete row.

3. **Optional: free-form note per warp**  
   - Add `run.warpNotes?: Record<string, string>`.  
   - In the list, show a note column or expandable “note” under the row. Edit in place or in edit modal.

4. **Grouping and filters**  
   - Group by area (e.g. “Undead Burg”, “Anor Londo”) or filter by area.  
   - Optional “Start” block at top (derived).  
   - Optional “Paths in progress” = warps with a note (or tag) indicating need; “Completed” = by `fogGatesCleared` or explicit completed set.

5. **Stretch: bulk import**  
   - Paste doc-style lines; parse into warps; match “area: gate side” to (fogGateId, side) via name/area lookup.

---

## 8. Summary

| Need from your doc              | Approach in the app                                                                 |
|---------------------------------|--------------------------------------------------------------------------------------|
| See which gates go where        | Primary view: list/table of warp pairs, “Area: Gate (front|rear) ↔ Area: Gate (front|rear)” |
| Group by status                 | Group/filter by “available”, “blocked” (need X), “completed”; optional notes/tags   |
| “need: X”                      | Free-form note per warp first; optional structured “need” later                     |
| Dead end / loop                | Optional tag or note per warp                                                       |
| Start and first steps          | Derived “Start” block from start nodes + warps from those nodes                     |
| Edit as you discover           | Add / edit / delete warp; optional bulk paste                                       |

The design keeps the **warp pair** as the central unit (like your doc), uses the existing **FogGateWarp** and **FogGate** model, and adds minimal run state (e.g. `warpNotes`) so we can support “paths in progress” and “completed” without overcomplicating the schema. We can then iterate on grouping, filters, and a more structured “need” system based on how you actually use it.
