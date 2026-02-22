import './App.css';
import { SCHEMA_DEFINITIONS } from './Constants/schema';
import { DARK_SOULS_1_AREAS } from './Constants/areas';
import { DARK_SOULS_1_BOSSES } from './Constants/bosses';
import { DARK_SOULS_1_BONFIRES } from './Constants/bonfires';
import { BELLS_OF_AWAKENING } from './Constants/bellsOfAwakening';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { startNewRun, setBellRung, setBossDefeated } from './redux';

function SchemaBlock({ schema }) {
  return (
    <section className="schema-block">
      <h2 className="schema-name">
        {schema.name}
        <span className="schema-kind">{schema.kind}</span>
      </h2>
      <pre className="schema-def">
        <code>
          {schema.kind === 'alias' ? `type ${schema.name} = ${schema.def};` : `type ${schema.name} = ${schema.def}`}
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
        <h1 className="App-title">Lordran Seedkeeper</h1>
        <p className="App-subtitle">Run state schemas (in development)</p>
      </header>
      <main className="App-main">
        <section className="content-section content-section--run-progress">
          <h2 className="content-heading">Current run progress</h2>
          <section className="content-subsection">
            <h3 className="content-subheading">Bells of Awakening</h3>
            {!run && (
              <p className="run-prompt">
                <button type="button" className="btn btn-primary" onClick={() => dispatch(startNewRun())}>
                  Start run
                </button>
                {' '}to track progress (rung state).
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
                        onChange={(e) => dispatch(setBellRung({ bellId: bell.id, rung: e.target.checked }))}
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
            const bonfiresInArea = DARK_SOULS_1_BONFIRES.filter((b) => b.areaId === area.id);
            const bossesInArea = DARK_SOULS_1_BOSSES.filter((b) => b.areaId === area.id);
            if (bonfiresInArea.length === 0 && bossesInArea.length === 0) return null;
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
                            {bonfire.warpable && <span className="bonfire-tag bonfire-tag--warp">Warp</span>}
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
                                onChange={(e) => dispatch(setBossDefeated({ bossId: boss.id, defeated: e.target.checked }))}
                              />
                              <span className="boss-checkbox-label">Defeated</span>
                            </label>
                          )}
                          <span className="boss-name-wrap">
                            <span className="boss-name">{boss.name}</span>
                            {boss.lordSoul && <span className="boss-tag boss-tag--lord">Lord Soul</span>}
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
