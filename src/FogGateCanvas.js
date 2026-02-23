import { useRef, useState, useCallback, useLayoutEffect } from "react";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { setFogGateWarp, removeFogGateWarp, startNewRun } from "./redux";
import { getRegionLayouts } from "./Constants/canvasLayout";

function sideRefKey(ref) {
  return `${ref.fogGateId}:${ref.side}`;
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
  const containerRef = useRef(null);
  const handleRefs = useRef(new Map());
  const [handlePositions, setHandlePositions] = useState(new Map());
  const [containerRect, setContainerRect] = useState({ width: 1, height: 1 });
  const [dragging, setDragging] = useState(null);
  const [dragPos, setDragPos] = useState(null);

  const layouts = getRegionLayouts();

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

  const onHandlePointerDown = useCallback(
    (e, fogGateId, side) => {
      e.preventDefault();
      if (!run) return;
      if (e.metaKey || e.ctrlKey) {
        dispatch(removeFogGateWarp({ fogGateId, side }));
        return;
      }
      setDragging({ fogGateId, side });
      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        setDragPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
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
      setDragPos(null);
    },
    [dragging, run, dispatch]
  );

  const onPointerMove = useCallback(
    (e) => {
      if (dragging && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDragPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
    },
    [dragging]
  );

  const onPointerUpGlobal = useCallback(() => {
    if (dragging) {
      setDragging(null);
      setDragPos(null);
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
  const { width: svgW, height: svgH } = containerRect;

  return (
    <div
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
            {dragging && dragPos && (() => {
              const fromPos = handlePositions.get(
                sideRefKey({ fogGateId: dragging.fogGateId, side: dragging.side })
              );
              if (!fromPos) return null;
              const { cx, cy } = getCurveControlPoint(
                fromPos.x, fromPos.y,
                dragPos.x, dragPos.y
              );
              return (
                <path
                  d={`M ${fromPos.x} ${fromPos.y} Q ${cx} ${cy} ${dragPos.x} ${dragPos.y}`}
                  className="fog-canvas-warp-line fog-canvas-warp-line--preview"
                  fill="none"
                  strokeWidth={2}
                  strokeDasharray="4 4"
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
                      <button
                        type="button"
                        className="fog-canvas-handle fog-canvas-handle--front"
                        ref={(el) =>
                          setHandleRef(
                            sideRefKey({ fogGateId: gate.id, side: "front" }),
                            el
                          )
                        }
                        onPointerDown={(e) =>
                          onHandlePointerDown(e, gate.id, "front")
                        }
                        onPointerUp={(e) =>
                          onHandlePointerUp(e, gate.id, "front")
                        }
                        title="Front (drag to connect, ⌘/Ctrl+click to delete)"
                        aria-label={`${gate.name ?? gate.id} front`}
                      />
                      <button
                        type="button"
                        className="fog-canvas-handle fog-canvas-handle--back"
                        ref={(el) =>
                          setHandleRef(
                            sideRefKey({ fogGateId: gate.id, side: "back" }),
                            el
                          )
                        }
                        onPointerDown={(e) =>
                          onHandlePointerDown(e, gate.id, "back")
                        }
                        onPointerUp={(e) =>
                          onHandlePointerUp(e, gate.id, "back")
                        }
                        title="Back (drag to connect, ⌘/Ctrl+click to delete)"
                        aria-label={`${gate.name ?? gate.id} back`}
                      />
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
