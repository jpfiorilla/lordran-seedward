import { useEffect, useState, useCallback } from "react";
import "./App.css";
import { Routes, Route, Link, useSearchParams } from "react-router-dom";
import { SCHEMA_DEFINITIONS } from "./Constants/schema";
import { DARK_SOULS_1_AREAS } from "./Constants/areas";
import { DARK_SOULS_1_BOSSES } from "./Constants/bosses";
import { DARK_SOULS_1_BONFIRES } from "./Constants/bonfires";
import { BELLS_OF_AWAKENING } from "./Constants/bellsOfAwakening";
import { NODES, START_NODE_IDS } from "./Constants/nodes";
import { CONNECTIONS } from "./Constants/connections";
import {
  isConnectionAvailable,
  getConnectionsFrom,
  getReachableNodeIds,
} from "./Utils/reachability";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import {
  startNewRun,
  setRun,
  setBellRung,
  setBossDefeated,
  setShortcutUnlocked,
  clearRun,
} from "./redux";
import {
  encodeRunToShareParam,
  decodeRunFromShareParam,
  SHARE_PARAM,
} from "./Utils/runShare";
import FogGateCanvas from "./FogGateCanvas";

function SchemaBlock({ schema }) {
  return (
    <section className="schema-block">
      <h2 className="schema-name">
        {schema.name}
        <span className="schema-kind">{schema.kind}</span>
      </h2>
      <pre className="schema-def">
        <code>
          {schema.kind === "alias"
            ? `type ${schema.name} = ${schema.def};`
            : `type ${schema.name} = ${schema.def}`}
        </code>
      </pre>
    </section>
  );
}

function HomePage() {
  const dispatch = useAppDispatch();
  const run = useAppSelector((s) => s.run.run);

  return (
    <main className="App-main">
      <section className="content-section content-section--canvas">
        <h2 className="content-heading">Fog gate warps</h2>
        <p className="map-hint">
          Drag from one gate handle (front or back) to another to set the
          randomizer connection. White = front, lavender = back. ⌘/Ctrl+click a
          handle to delete its connection.
        </p>
        <FogGateCanvas />
      </section>
      <section className="content-section content-section--run-progress">
        <h2 className="content-heading">Current run progress</h2>
        <section className="content-subsection">
          <h3 className="content-subheading">Bells of Awakening</h3>
          {!run && (
            <p className="run-prompt">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => dispatch(startNewRun())}
              >
                Start run
              </button>{" "}
              to track progress (rung state).
            </p>
          )}
          <ul className="bell-list">
            {BELLS_OF_AWAKENING.map((bell) => (
              <li key={bell.id} className="bell-item">
                {run && (
                  <label className="bell-checkbox">
                    <input
                      type="checkbox"
                      checked={run.bellsRung.includes(bell.id)}
                      onChange={(e) =>
                        dispatch(
                          setBellRung({
                            bellId: bell.id,
                            rung: e.target.checked,
                          }),
                        )
                      }
                    />
                    <span className="bell-checkbox-label">Rung</span>
                  </label>
                )}
                <span className="bell-name">{bell.name}</span>
              </li>
            ))}
          </ul>
        </section>
        {run && (
          <section className="content-subsection">
            <h3 className="content-subheading">Shortcuts</h3>
            <ul className="shortcut-list">
              <li className="shortcut-item">
                <label className="shortcut-checkbox">
                  <input
                    type="checkbox"
                    checked={run.shortcutsUnlocked.includes("parish-elevator")}
                    onChange={(e) =>
                      dispatch(
                        setShortcutUnlocked({
                          shortcutId: "parish-elevator",
                          unlocked: e.target.checked,
                        }),
                      )
                    }
                  />
                  <span>Parish elevator (Firelink ↔ Undead Parish)</span>
                </label>
              </li>
            </ul>
          </section>
        )}
        {run && (
          <section className="content-subsection">
            <h3 className="content-subheading">From Firelink Shrine</h3>
            <p className="map-hint">
              Connections you can take from the start node. Availability
              depends on run state.
            </p>
            <ul className="connection-list">
              {getConnectionsFrom(CONNECTIONS, "firelink-shrine").map((conn) => {
                const available = isConnectionAvailable(conn, run);
                const toNode = NODES.find((n) => n.id === conn.toNodeId);
                const toName = toNode?.name ?? conn.toNodeId;
                return (
                  <li
                    key={conn.id}
                    className={`connection-item ${available ? "connection-item--available" : "connection-item--locked"}`}
                  >
                    <span className="connection-name">
                      {conn.name ?? conn.id}
                    </span>
                    <span className="connection-arrow">→</span>
                    <span className="connection-target">{toName}</span>
                    {conn.shortcutId && (
                      <span className="connection-gate">
                        {available ? "✓" : "locked"}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        )}
        {run && (
          <section className="content-subsection">
            <h3 className="content-subheading">Reachable nodes</h3>
            <p className="map-hint">
              All nodes you can reach from the start with current run state.
            </p>
            <ul className="node-list">
              {Array.from(
                getReachableNodeIds(
                  CONNECTIONS,
                  run?.areas?.flatMap((a) => a.fogGates) ?? [],
                  run,
                  START_NODE_IDS,
                ),
              ).map((nodeId) => {
                const node = NODES.find((n) => n.id === nodeId);
                return (
                  <li key={nodeId} className="node-item">
                    {node?.name ?? nodeId}
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </section>

      <section className="content-section">
        <h2 className="content-heading">Areas</h2>
        {DARK_SOULS_1_AREAS.map((area) => {
          const bonfiresInArea = DARK_SOULS_1_BONFIRES.filter(
            (b) => b.areaId === area.id,
          );
          const bossesInArea = DARK_SOULS_1_BOSSES.filter(
            (b) => b.areaId === area.id,
          );
          if (bonfiresInArea.length === 0 && bossesInArea.length === 0)
            return null;
          return (
            <div key={area.id} className="area-block">
              <h3 className="area-name">{area.name}</h3>
              {bonfiresInArea.length > 0 && (
                <div className="area-subsection">
                  <span className="area-subsection-label">Bonfires</span>
                  <ul className="bonfire-list">
                    {bonfiresInArea.map((bonfire) => (
                      <li key={bonfire.id} className="bonfire-item">
                        <span className="bonfire-name-wrap">
                          <span className="bonfire-name">{bonfire.name}</span>
                          {bonfire.warpable && (
                            <span className="bonfire-tag bonfire-tag--warp">
                              Warp
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {bossesInArea.length > 0 && (
                <div className="area-subsection">
                  <span className="area-subsection-label">Bosses</span>
                  <ul className="boss-list">
                    {bossesInArea.map((boss) => (
                      <li key={boss.id} className="boss-item">
                        {run && (
                          <label className="boss-checkbox">
                            <input
                              type="checkbox"
                              checked={run.bossesDefeated.includes(boss.id)}
                              onChange={(e) =>
                                dispatch(
                                  setBossDefeated({
                                    bossId: boss.id,
                                    defeated: e.target.checked,
                                  }),
                                )
                              }
                            />
                            <span className="boss-checkbox-label">Defeated</span>
                          </label>
                        )}
                        <span className="boss-name-wrap">
                          <span className="boss-name">{boss.name}</span>
                          {boss.lordSoul && (
                            <span className="boss-tag boss-tag--lord">
                              Lord Soul
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </section>
    </main>
  );
}

function DebugPage() {
  const run = useAppSelector((s) => s.run.run);

  return (
    <main className="App-main">
      <p className="schema-intro">
        Dark Souls areas and fog gates. Areas contain FogGates; tracking which
        gates are cleared = run progress.
      </p>
      {SCHEMA_DEFINITIONS.map((schema) => (
        <SchemaBlock key={schema.name} schema={schema} />
      ))}
      {run && (
        <section className="content-section">
          <h2 className="content-heading">Current run state (JSON)</h2>
          <pre className="schema-def">
            <code>{JSON.stringify(run, null, 2)}</code>
          </pre>
        </section>
      )}
    </main>
  );
}

function App() {
  const dispatch = useAppDispatch();
  const run = useAppSelector((s) => s.run.run);
  const [searchParams, setSearchParams] = useSearchParams();
  const [copied, setCopied] = useState(false);

  const copyShareLink = useCallback(() => {
    if (!run) return;
    const encoded = encodeRunToShareParam(run);
    const url = `${window.location.origin}${window.location.pathname}?${SHARE_PARAM}=${encoded}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [run]);

  useEffect(() => {
    const param = searchParams.get(SHARE_PARAM);
    if (!param) return;
    const decoded = decodeRunFromShareParam(param);
    if (decoded) {
      dispatch(setRun(decoded));
    } else {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete(SHARE_PARAM);
          return next;
        },
        { replace: true },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount to apply shared link
  }, []);

  useEffect(() => {
    const urlParam = searchParams.get(SHARE_PARAM);
    if (urlParam && run) {
      const fromUrl = decodeRunFromShareParam(urlParam);
      if (fromUrl && fromUrl.id !== run.id) return;
    }
    if (run) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set(SHARE_PARAM, encodeRunToShareParam(run));
          return next;
        },
        { replace: true },
      );
    } else {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete(SHARE_PARAM);
          return next;
        },
        { replace: false },
      );
    }
  }, [run, setSearchParams, searchParams]);

  useEffect(() => {
    if (run != null) return;
    const param = searchParams.get(SHARE_PARAM);
    if (!param) return;
    const decoded = decodeRunFromShareParam(param);
    if (decoded) dispatch(setRun(decoded));
  }, [run, searchParams, dispatch]);

  return (
    <div className="App">
      <header className="App-header">
        <div className="App-header-inner">
          <div>
            <h1 className="App-title">
              <Link to="/" className="App-title-link">
                Lordran Seedkeeper
              </Link>
            </h1>
          </div>
          <nav className="App-nav">
            {run && (
              <>
                <button
                  type="button"
                  className={`btn btn-share ${copied ? "btn-share--copied" : ""}`}
                  onClick={copyShareLink}
                  title="Copy share link"
                >
                  {copied ? (
                    <span className="btn-share-feedback">Copied!</span>
                  ) : (
                    "Share"
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => dispatch(clearRun())}
                >
                  Reset run
                </button>
              </>
            )}
          </nav>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/debug" element={<DebugPage />} />
      </Routes>
    </div>
  );
}

export default App;
