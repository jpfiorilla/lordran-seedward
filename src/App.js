import { useEffect, useState, useCallback, useRef } from "react";
import "./App.css";
import { Routes, Route, Link, useSearchParams } from "react-router-dom";
import { SCHEMA_DEFINITIONS } from "./Constants/schema";
import { BELLS_OF_AWAKENING } from "./Constants/bellsOfAwakening";
import { TRACKABLE_KEYS } from "./Constants/keys";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import {
  startNewRun,
  setRun,
  setBellRung,
  setShortcutUnlocked,
  setKeyAcquired,
  clearRun,
} from "./redux";
import {
  encodeRunToShareParam,
  decodeRunFromShareParam,
  SHARE_PARAM,
} from "./Utils/runShare";
import FogGateCanvas from "./FogGateCanvas";
import {
  KeyIcon,
  FogGateIcon,
  BellIcon,
  ShortcutIcon,
  CodeIcon,
} from "./Icons";

const SHORTCUTS = [
  {
    id: "parish-elevator",
    label: "Parish elevator (Firelink ↔ Undead Parish)",
  },
  { id: "chaos-servant-covenant", label: "Chaos servant covenant" },
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
        <h2 className="content-heading">
          <FogGateIcon className="content-heading-icon" />
          Fog gate warps
        </h2>
        <p className="map-hint">
          Drag from one gate handle (front or back) to another to set the
          randomizer connection. White = front, lavender = back. ⌘/Ctrl+click a
          handle to delete its connection.
        </p>
        <FogGateCanvas />
        {run && (
          <section className="content-subsection content-subsection--keys">
            <div className="keys-heading-wrap">
              <h2 className="content-heading">
                <KeyIcon className="content-heading-icon" />
                Keys
              </h2>
              <span className="keys-tooltip" role="tooltip">
                We don't track keys that the Master Key can open—just pick the
                Master Key as your starting gift.
              </span>
            </div>
            <ul className="key-list">
              {TRACKABLE_KEYS.map((keyDef) => (
                <li key={keyDef.id} className="key-item">
                  <span className="key-item-wrap">
                    <label className="key-checkbox">
                      <input
                        type="checkbox"
                        checked={run.acquiredKeys.includes(keyDef.id)}
                        onChange={(e) =>
                          dispatch(
                            setKeyAcquired({
                              keyId: keyDef.id,
                              acquired: e.target.checked,
                            }),
                          )
                        }
                      />
                      <span className="key-name">{keyDef.name}</span>
                    </label>
                    {keyDef.unlocks && (
                      <span className="key-unlocks-tooltip" role="tooltip">
                        {keyDef.unlocks}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </section>
      <section className="content-section">
        <section className="content-subsection">
          <h2 className="content-heading">
            <BellIcon className="content-heading-icon" />
            Bells of Awakening
          </h2>
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
            <h2 className="content-heading">
              <ShortcutIcon className="content-heading-icon" />
              Shortcuts
            </h2>
            <ul className="shortcut-list">
              {SHORTCUTS.map(({ id, label }) => (
                <li key={id} className="shortcut-item">
                  <label className="shortcut-checkbox">
                    <input
                      type="checkbox"
                      checked={run.shortcutsUnlocked.includes(id)}
                      onChange={(e) =>
                        dispatch(
                          setShortcutUnlocked({
                            shortcutId: id,
                            unlocked: e.target.checked,
                          }),
                        )
                      }
                    />
                    <span>{label}</span>
                  </label>
                </li>
              ))}
            </ul>
          </section>
        )}
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
          <h2 className="content-heading">
            <CodeIcon className="content-heading-icon" />
            Current run state (JSON)
          </h2>
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
  const skipRestoreFromUrlRef = useRef(false);

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
    if (skipRestoreFromUrlRef.current) {
      skipRestoreFromUrlRef.current = false;
      return;
    }
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
                  onClick={() => {
                    skipRestoreFromUrlRef.current = true;
                    dispatch(clearRun());
                  }}
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
