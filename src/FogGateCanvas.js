import { useRef, useState, useCallback, useLayoutEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { setFogGateWarp, removeFogGateWarp, startNewRun } from "./redux";
import { getRegionLayouts } from "./Constants/canvasLayout";

function sideRefKey(ref) {
  return `${ref.fogGateId}:${ref.side}`;
}

/** Crafty / audio-studio cable palette (Reason-style soft synth wires). */
const CONNECTION_PALETTE = [
  "#e07a5f",
  "#81b29a",
  "#3d405b",
  "#f4a261",
  "#2a9d8f",
  "#e9c46a",
  "#264653",
  "#e76f51",
  "#457b9d",
  "#9b5de5",
  "#00b4d8",
  "#06d6a0",
  "#ef476f",
  "#ffd166",
  "#118ab2",
];

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
  const wrapRef = useRef(null);
  const containerRef = useRef(null);
  const handleRefs = useRef(new Map());
  const [handlePositions, setHandlePositions] = useState(new Map());
  const [containerRect, setContainerRect] = useState({ width: 1, height: 1 });
  const [dragging, setDragging] = useState(null);
  const [dragPos, setDragPos] = useState(null);
  const [hoverTarget, setHoverTarget] = useState(null);

  const layouts = getRegionLayouts();
  const warps = useMemo(() => run?.fogGateWarps ?? [], [run?.fogGateWarps]);

  const getConnectionColorForHandle = useCallback(
    (fogGateId, side) => {
      const idx = warps.findIndex(
        (w) => w.from.fogGateId === fogGateId && w.from.side === side,
      );
      return idx >= 0
        ? CONNECTION_PALETTE[idx % CONNECTION_PALETTE.length]
        : null;
    },
    [warps],
  );

  const hasHandleConnection = useCallback(
    (fogGateId, side) =>
      warps.some(
        (w) =>
          (w.from.fogGateId === fogGateId && w.from.side === side) ||
          (w.to.fogGateId === fogGateId && w.to.side === side),
      ),
    [warps],
  );

  const potentialConnectionColor =
    CONNECTION_PALETTE[warps.length % CONNECTION_PALETTE.length];

  const measureHandles = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const next = new Map();
    handleRefs.current.forEach((el, key) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      next.set(key, {
        x: r.left - rect.left + r.width / 2,
        y: r.top - rect.top + r.height / 2,
      });
    });
    setHandlePositions(next);
    setContainerRect({ width: rect.width, height: rect.height });
  }, []);

  const scheduleMeasure = useCallback(() => {
    requestAnimationFrame(() => {
      measureHandles();
    });
  }, [measureHandles]);

  useLayoutEffect(() => {
    measureHandles();
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(scheduleMeasure);
    ro.observe(container);
    const onWindowResize = () => scheduleMeasure();
    window.addEventListener("resize", onWindowResize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onWindowResize);
    };
  }, [measureHandles, scheduleMeasure]);

  const setHandleRef = useCallback((key, el) => {
    if (el) handleRefs.current.set(key, el);
    else handleRefs.current.delete(key);
  }, []);

  const completeConnectionTo = useCallback(
    (targetFogGateId, targetSide) => {
      if (!dragging || !run) return;
      const from = {
        fogGateId: dragging.fogGateId,
        side: dragging.side,
      };
      const to = { fogGateId: targetFogGateId, side: targetSide };
      const targetAlreadyHasConnection = hasHandleConnection(
        targetFogGateId,
        targetSide,
      );
      if (targetAlreadyHasConnection) {
        setDragging(null);
        setDragPos(null);
        setHoverTarget(null);
        return;
      }
      if (from.fogGateId !== to.fogGateId || from.side !== to.side) {
        dispatch(setFogGateWarp({ from, to }));
      }
      setDragging(null);
      setDragPos(null);
      setHoverTarget(null);
    },
    [dragging, run, dispatch, hasHandleConnection],
  );

  const onHandlePointerDown = useCallback(
    (e, fogGateId, side) => {
      e.preventDefault();
      if (!run) return;
      if (e.metaKey || e.ctrlKey) {
        dispatch(removeFogGateWarp({ fogGateId, side }));
        return;
      }
      if (
        dragging &&
        dragging.fogGateId === fogGateId &&
        dragging.side === side
      ) {
        setDragging(null);
        setDragPos(null);
        setHoverTarget(null);
        return;
      }
      if (
        dragging &&
        (dragging.fogGateId !== fogGateId || dragging.side !== side)
      ) {
        completeConnectionTo(fogGateId, side);
        return;
      }
      setDragging({ fogGateId, side });
      wrapRef.current?.setPointerCapture(e.pointerId);
      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        setDragPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
    },
    [run, dispatch, dragging, completeConnectionTo],
  );

  const onHandlePointerUp = useCallback(
    (e, targetFogGateId, targetSide) => {
      if (!dragging) return;
      if (
        dragging.fogGateId === targetFogGateId &&
        dragging.side === targetSide
      ) {
        return;
      }
      completeConnectionTo(targetFogGateId, targetSide);
    },
    [dragging, completeConnectionTo],
  );

  const onPointerMove = useCallback(
    (e) => {
      if (dragging && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDragPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
    },
    [dragging],
  );

  const onPointerUpGlobal = useCallback(
    (e) => {
      if (!dragging) return;
      const el = e.target && document.elementFromPoint(e.clientX, e.clientY);
      const handle = el?.closest?.(".fog-canvas-handle");
      if (handle?.dataset?.fogGateId != null && handle?.dataset?.side != null) {
        const targetFogGateId = handle.dataset.fogGateId;
        const targetSide = handle.dataset.side;
        if (
          dragging.fogGateId === targetFogGateId &&
          dragging.side === targetSide
        ) {
          return;
        }
        completeConnectionTo(targetFogGateId, targetSide);
        return;
      }
      setDragging(null);
      setDragPos(null);
      setHoverTarget(null);
    },
    [dragging, completeConnectionTo],
  );

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

  const { width: svgW, height: svgH } = containerRect;

  return (
    <div
      ref={wrapRef}
      className="fog-canvas-wrap"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerUpGlobal}
      onPointerUp={onPointerUpGlobal}
      onPointerCancel={onPointerUpGlobal}
    >
      <div ref={containerRef} className="fog-canvas-inner">
        <svg
          className="fog-canvas-lines"
          width={svgW}
          height={svgH}
          viewBox={`0 0 ${svgW} ${svgH}`}
          preserveAspectRatio="none"
          style={{ touchAction: "none", pointerEvents: "none" }}
        >
          <g className="fog-canvas-warps">
            {warps.map((warp, i) => {
              const fromPos = handlePositions.get(sideRefKey(warp.from));
              const toPos = handlePositions.get(sideRefKey(warp.to));
              if (!fromPos || !toPos) return null;
              const { cx, cy } = getCurveControlPoint(
                fromPos.x,
                fromPos.y,
                toPos.x,
                toPos.y,
              );
              const strokeColor =
                CONNECTION_PALETTE[i % CONNECTION_PALETTE.length];
              return (
                <path
                  key={`${sideRefKey(warp.from)}-${i}`}
                  d={`M ${fromPos.x} ${fromPos.y} Q ${cx} ${cy} ${toPos.x} ${toPos.y}`}
                  className="fog-canvas-warp-line"
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={2.5}
                />
              );
            })}
            {dragging &&
              dragPos &&
              (() => {
                const fromPos = handlePositions.get(
                  sideRefKey({
                    fogGateId: dragging.fogGateId,
                    side: dragging.side,
                  }),
                );
                if (!fromPos) return null;
                const { cx, cy } = getCurveControlPoint(
                  fromPos.x,
                  fromPos.y,
                  dragPos.x,
                  dragPos.y,
                );
                return (
                  <path
                    d={`M ${fromPos.x} ${fromPos.y} Q ${cx} ${cy} ${dragPos.x} ${dragPos.y}`}
                    className="fog-canvas-warp-line fog-canvas-warp-line--preview"
                    fill="none"
                    stroke={potentialConnectionColor}
                    strokeWidth={2.5}
                    strokeDasharray="5 4"
                  />
                );
              })()}
          </g>
        </svg>

        <div className="fog-canvas-regions">
          {layouts.map((region) => (
            <div
              key={region.areaId}
              className="fog-canvas-region"
              style={{
                "--region-color": region.color,
              }}
            >
              <div className="fog-canvas-region-name">{region.areaName}</div>
              <div className="fog-canvas-gates">
                {region.gates.map((gate) => (
                  <div key={gate.id} className="fog-canvas-gate">
                    <span className="fog-canvas-gate-name">
                      {gate.name ?? gate.id}
                    </span>
                    <div className="fog-canvas-handles">
                      {["front", "back"].map((side) => {
                        const isHoverTarget =
                          dragging &&
                          hoverTarget?.fogGateId === gate.id &&
                          hoverTarget?.side === side &&
                          !(
                            dragging.fogGateId === gate.id &&
                            dragging.side === side
                          );
                        const connectionColor = getConnectionColorForHandle(
                          gate.id,
                          side,
                        );
                        const isDropBlocked =
                          isHoverTarget && hasHandleConnection(gate.id, side);
                        const displayColor =
                          isHoverTarget && !isDropBlocked
                            ? potentialConnectionColor
                            : (connectionColor ??
                              (side === "front"
                                ? "rgba(255,255,255,0.9)"
                                : "rgba(200,200,255,0.9)"));
                        return (
                          <button
                            key={side}
                            type="button"
                            data-fog-gate-id={gate.id}
                            data-side={side}
                            className={`fog-canvas-handle fog-canvas-handle--${side}${
                              connectionColor
                                ? " fog-canvas-handle--connected"
                                : ""
                            }${isHoverTarget && !isDropBlocked ? " fog-canvas-handle--hover-target" : ""}${
                              isDropBlocked
                                ? " fog-canvas-handle--drop-blocked"
                                : ""
                            }`}
                            ref={(el) =>
                              setHandleRef(
                                sideRefKey({ fogGateId: gate.id, side }),
                                el,
                              )
                            }
                            style={{ "--handle-color": displayColor }}
                            onPointerDown={(e) =>
                              onHandlePointerDown(e, gate.id, side)
                            }
                            onPointerUp={(e) =>
                              onHandlePointerUp(e, gate.id, side)
                            }
                            onPointerEnter={() =>
                              dragging &&
                              setHoverTarget({ fogGateId: gate.id, side })
                            }
                            onPointerLeave={() =>
                              dragging && setHoverTarget(null)
                            }
                            title={`${side === "front" ? "Front" : "Back"} (click or drag to connect, ⌘/Ctrl+click to delete)`}
                            aria-label={`${gate.name ?? gate.id} ${side}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
