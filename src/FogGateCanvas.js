import { useRef, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { setFogGateWarp, removeFogGateWarp, startNewRun } from "./redux";
import {
  getRegionLayouts,
  getGatePositionInRegion,
  getMapBounds,
  GATE_CARD_WIDTH,
  GATE_CARD_HEIGHT,
  HANDLE_FRONT_X,
  HANDLE_BACK_X,
  HANDLE_Y,
  HANDLE_R,
} from "./Constants/canvasLayout";

function sideRefKey(ref) {
  return `${ref.fogGateId}:${ref.side}`;
}

/** Build a map from FogGateSideRef key to { region, gateIndex } for resolving positions. */
function buildHandleMap(layouts) {
  const map = new Map();
  layouts.forEach((region) => {
    region.gates.forEach((gate, gateIndex) => {
      map.set(sideRefKey({ fogGateId: gate.id, side: "front" }), {
        region,
        gateIndex,
        side: "front",
      });
      map.set(sideRefKey({ fogGateId: gate.id, side: "back" }), {
        region,
        gateIndex,
        side: "back",
      });
    });
  });
  return map;
}

const REGION_OFFSET = 20;

function getHandlePosition(handleMap, region, gateIndex, side) {
  const gatePos = getGatePositionInRegion(gateIndex);
  const x =
    region.x +
    REGION_OFFSET +
    gatePos.x +
    (side === "front" ? HANDLE_FRONT_X : HANDLE_BACK_X);
  const y = region.y + REGION_OFFSET + gatePos.y + HANDLE_Y;
  return { x, y };
}

/** Quadratic curve control point so the line bends and reads clearly. */
function getCurveControlPoint(x1, y1, x2, y2) {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy) || 1;
  const curve = Math.min(40, dist * 0.3);
  let perpX = (-dy / dist) * curve;
  let perpY = (dx / dist) * curve;
  if (dx < 0) {
    perpX = -perpX;
    perpY = -perpY;
  }
  return { cx: midX + perpX, cy: midY + perpY };
}

export default function FogGateCanvas() {
  const dispatch = useAppDispatch();
  const run = useAppSelector((s) => s.run.run);
  const svgRef = useRef(null);
  const [dragging, setDragging] = useState(null);
  const [dragPosSvg, setDragPosSvg] = useState(null);

  const layouts = getRegionLayouts();
  const handleMap = useRef(null);
  if (!handleMap.current) handleMap.current = buildHandleMap(layouts);
  const handleMapCurrent = handleMap.current;

  const getHandleCoords = useCallback(
    (ref) => {
      const entry = handleMapCurrent.get(sideRefKey(ref));
      if (!entry) return null;
      return getHandlePosition(
        handleMapCurrent,
        entry.region,
        entry.gateIndex,
        entry.side
      );
    },
    [handleMapCurrent]
  );

  const onHandlePointerDown = useCallback(
    (e, fogGateId, side) => {
      e.preventDefault();
      if (!run) return;
      if (e.metaKey || e.ctrlKey) {
        dispatch(removeFogGateWarp({ fogGateId, side }));
        return;
      }
      setDragging({ fogGateId, side });
      if (svgRef.current) {
        const pt = svgRef.current.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const svgP = pt.matrixTransform(svgRef.current.getScreenCTM().inverse());
        setDragPosSvg({ x: svgP.x, y: svgP.y });
      }
    },
    [run, dispatch]
  );

  const onHandlePointerUp = useCallback(
    (e, targetFogGateId, targetSide) => {
      if (!dragging || !run) return;
      const from = { fogGateId: dragging.fogGateId, side: dragging.side };
      const to = { fogGateId: targetFogGateId, side: targetSide };
      if (from.fogGateId !== to.fogGateId || from.side !== to.side) {
        dispatch(setFogGateWarp({ from, to }));
      }
      setDragging(null);
      setDragPosSvg(null);
    },
    [dragging, run, dispatch]
  );

  const onPointerMove = useCallback(
    (e) => {
      if (dragging && svgRef.current) {
        const pt = svgRef.current.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const svgP = pt.matrixTransform(
          svgRef.current.getScreenCTM().inverse()
        );
        setDragPosSvg({ x: svgP.x, y: svgP.y });
      }
    },
    [dragging]
  );

  const onPointerUpGlobal = useCallback(() => {
    if (dragging) {
      setDragging(null);
      setDragPosSvg(null);
    }
  }, [dragging]);

  if (!run) {
    return (
      <div className="fog-canvas-empty">
        <p>Start a run to wire fog gates.</p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => dispatch(startNewRun())}
        >
          Start run
        </button>
      </div>
    );
  }

  const warps = run.fogGateWarps ?? [];
  const bounds = getMapBounds(layouts);
  const svgW = bounds.w;
  const svgH = bounds.h;
  const viewBox = `${bounds.x + REGION_OFFSET} ${bounds.y + REGION_OFFSET} ${bounds.w} ${bounds.h}`;

  return (
    <div
      className="fog-canvas-wrap"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerUpGlobal}
      onPointerUp={onPointerUpGlobal}
      onPointerCancel={onPointerUpGlobal}
    >
      <svg
        ref={svgRef}
        className="fog-canvas-svg"
        width={svgW}
        height={svgH}
        viewBox={viewBox}
        style={{ touchAction: "none" }}
      >
        {/* Warp lines (under everything), curved so they read clearly */}
        <g className="fog-canvas-warps">
          {warps.map((warp, i) => {
            const fromPos = getHandleCoords(warp.from);
            const toPos = getHandleCoords(warp.to);
            if (!fromPos || !toPos) return null;
            const { cx, cy } = getCurveControlPoint(
              fromPos.x, fromPos.y,
              toPos.x, toPos.y
            );
            return (
              <path
                key={`${sideRefKey(warp.from)}-${i}`}
                d={`M ${fromPos.x} ${fromPos.y} Q ${cx} ${cy} ${toPos.x} ${toPos.y}`}
                className="fog-canvas-warp-line"
                fill="none"
                strokeWidth={2}
              />
            );
          })}
          {dragging && dragPosSvg !== null && (() => {
            const fromPos = getHandleCoords({
              fogGateId: dragging.fogGateId,
              side: dragging.side,
            });
            if (!fromPos) return null;
            const { cx, cy } = getCurveControlPoint(
              fromPos.x, fromPos.y,
              dragPosSvg.x, dragPosSvg.y
            );
            return (
              <path
                d={`M ${fromPos.x} ${fromPos.y} Q ${cx} ${cy} ${dragPosSvg.x} ${dragPosSvg.y}`}
                className="fog-canvas-warp-line fog-canvas-warp-line--preview"
                fill="none"
                strokeWidth={2}
                strokeDasharray="4 4"
              />
            );
          })()}
        </g>

        {/* Regions and gates */}
        {layouts.map((region) => (
          <g
            key={region.areaId}
            className="fog-canvas-region"
            transform={`translate(${region.x + REGION_OFFSET}, ${region.y + REGION_OFFSET})`}
          >
            <rect
              x={0}
              y={0}
              width={region.width}
              height={region.height}
              fill={region.color}
              fillOpacity={0.35}
              stroke={region.color}
              strokeWidth={2}
              rx={8}
            />
            <text
              x={region.width / 2}
              y={18}
              textAnchor="middle"
              className="fog-canvas-region-name"
              fill="currentColor"
            >
              {region.areaName}
            </text>
            {region.gates.map((gate, gateIndex) => {
              const gatePos = getGatePositionInRegion(gateIndex);
              const gx = gatePos.x;
              const gy = gatePos.y;
              return (
                <g
                  key={gate.id}
                  transform={`translate(${gx}, ${gy})`}
                  className="fog-canvas-gate"
                >
                  <rect
                    width={GATE_CARD_WIDTH}
                    height={GATE_CARD_HEIGHT}
                    fill="rgba(0,0,0,0.4)"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth={1}
                    rx={4}
                  />
                  <text
                    x={GATE_CARD_WIDTH / 2}
                    y={GATE_CARD_HEIGHT / 2 + 4}
                    textAnchor="middle"
                    className="fog-canvas-gate-name"
                    fill="currentColor"
                  >
                    {gate.name ?? gate.id}
                  </text>
                  {/* Front handle (left) */}
                  <circle
                    cx={HANDLE_FRONT_X}
                    cy={HANDLE_Y}
                    r={HANDLE_R}
                    className="fog-canvas-handle fog-canvas-handle--front"
                    data-handle
                    data-fog-gate-id={gate.id}
                    data-side="front"
                    fill="rgba(255,255,255,0.9)"
                    stroke="#1a1b1e"
                    strokeWidth={1}
                    onPointerDown={(e) => onHandlePointerDown(e, gate.id, "front")}
                    onPointerUp={(e) => onHandlePointerUp(e, gate.id, "front")}
                  />
                  {/* Back handle (right) */}
                  <circle
                    cx={HANDLE_BACK_X}
                    cy={HANDLE_Y}
                    r={HANDLE_R}
                    className="fog-canvas-handle fog-canvas-handle--back"
                    data-handle
                    data-fog-gate-id={gate.id}
                    data-side="back"
                    fill="rgba(200,200,255,0.9)"
                    stroke="#1a1b1e"
                    strokeWidth={1}
                    onPointerDown={(e) => onHandlePointerDown(e, gate.id, "back")}
                    onPointerUp={(e) => onHandlePointerUp(e, gate.id, "back")}
                  />
                </g>
              );
            })}
          </g>
        ))}
      </svg>
    </div>
  );
}
