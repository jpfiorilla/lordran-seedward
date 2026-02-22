import "./App.css";
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
  setBellRung,
  setBossDefeated,
  setShortcutUnlocked,
  clearRun,
} from "./redux";

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

function App() {
  const dispatch = useAppDispatch();
  const run = useAppSelector((s) => s.run.run);

  return (
    <div className="App">
      <header className="App-header">
        <div className="App-header-inner">
          <div>
            <h1 className="App-title">Lordran Seedkeeper</h1>
            <p className="App-subtitle">Run state schemas (in development)</p>
          </div>
          {run && (
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => dispatch(clearRun())}
            >
              Reset run
            </button>
          )}
        </div>
      </header>
      <main className="App-main">
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
                  <code className="bell-id">{bell.id}</code>
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
                      checked={run.shortcutsUnlocked.includes(
                        "parish-elevator",
                      )}
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
                {getConnectionsFrom(CONNECTIONS, "firelink-shrine").map(
                  (conn) => {
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
                  },
                )}
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

        <p className="schema-intro">
          Dark Souls areas and fog gates. Areas contain FogGates; tracking which
          gates are cleared = run progress.
        </p>
        {SCHEMA_DEFINITIONS.map((schema) => (
          <SchemaBlock key={schema.name} schema={schema} />
        ))}

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
                          <code className="bonfire-id">{bonfire.id}</code>
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
                              <span className="boss-checkbox-label">
                                Defeated
                              </span>
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
                          <code className="boss-id">{boss.id}</code>
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
    </div>
  );
}

export default App;
