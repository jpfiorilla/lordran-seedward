import './App.css';
import { SCHEMA_DEFINITIONS } from './Constants/schema';
import { DARK_SOULS_1_AREAS } from './Constants/areas';
import { DARK_SOULS_1_BOSSES } from './Constants/bosses';

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
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">Lordran Seedkeeper</h1>
        <p className="App-subtitle">Run state schemas (in development)</p>
      </header>
      <main className="App-main">
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
            const bossesInArea = DARK_SOULS_1_BOSSES.filter((b) => b.areaId === area.id);
            if (bossesInArea.length === 0) return null;
            return (
              <div key={area.id} className="area-block">
                <h3 className="area-name">{area.name}</h3>
                <ul className="boss-list">
                  {bossesInArea.map((boss) => (
                    <li key={boss.id} className="boss-item">
                      <span className="boss-name-wrap">
                        <span className="boss-name">{boss.name}</span>
                        {boss.lordSoul && <span className="boss-tag boss-tag--lord">Lord Soul</span>}
                      </span>
                      <code className="boss-id">{boss.id}</code>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}

export default App;
