import './App.css';
import { DARK_SOULS_1_BOSSES } from './Constants/bosses';

const SCHEMAS = [
  {
    name: 'FogGateId',
    kind: 'alias',
    def: 'string',
  },
  {
    name: 'AreaId',
    kind: 'alias',
    def: 'string',
  },
  {
    name: 'FogGate',
    kind: 'type',
    def: `{
  id: FogGateId;
  name?: string;
  /** Whether the player has opened / passed through this gate */
  cleared: boolean;
}`,
  },
  {
    name: 'Area',
    kind: 'type',
    def: `{
  id: AreaId;
  name: string;
  fogGates: FogGate[];
}`,
  },
  {
    name: 'Run',
    kind: 'type',
    def: `{
  id: string;
  createdAt: number;
  areas: Area[];
}`,
  },
  {
    name: 'Boss',
    kind: 'type',
    def: `{
  id: BossId;
  name: string;
  areaId?: AreaId;
}`,
  },
  {
    name: 'BossId',
    kind: 'alias',
    def: 'string',
  },
  {
    name: 'RunState',
    kind: 'type',
    def: `{
  run: Run | null;
}`,
  },
];

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
        {SCHEMAS.map((schema) => (
          <SchemaBlock key={schema.name} schema={schema} />
        ))}

        <section className="content-section">
          <h2 className="content-heading">Dark Souls 1 bosses</h2>
          <p className="content-note">Area assignment coming soon.</p>
          <ul className="boss-list">
            {DARK_SOULS_1_BOSSES.map((boss) => (
              <li key={boss.id} className="boss-item">
                <span className="boss-name">{boss.name}</span>
                <code className="boss-id">{boss.id}</code>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;
