import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import posthog from "posthog-js";
import { initialState, transition, type Action, type State } from "./model";
import { parseState, readState, saveState, STORAGE_KEY, type StoragePort } from "./storage";
function browserStorage(): StoragePort | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}
function useStore() {
  const [loaded] = useState(() => readState(browserStorage()));
  const [state, setState] = useState(loaded.state);
  const [issue, setIssue] = useState(loaded.issue);
  const [error, setError] = useState("");
  const [blocked, setBlocked] = useState(loaded.blocked);
  const latest = useRef(state);
  const identifiedPersonId = useRef<string | null | undefined>(undefined);
  const posthogConfigured = Boolean(
    import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN && import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  );
  function commit(next: State, replace = false) {
    latest.current = next;
    setState(next);
    setError("");
    if (blocked && !replace) return;
    try {
      saveState(browserStorage(), next);
      setIssue("");
      if (replace) setBlocked(false);
    } catch (e) {
      setIssue((e as Error).message);
    }
  }
  function run(action: Action) {
    try {
      commit(transition(latest.current, action));
      return true;
    } catch (e) {
      setError(
        e instanceof Error && e.name !== "ZodError"
          ? e.message
          : "Sprawdź poprawność i długość wprowadzonych danych.",
      );
      return false;
    }
  }
  function importState(raw: string) {
    try {
      const next = parseState(raw);
      commit(next, true);
      return true;
    } catch (e) {
      setError((e as Error).message);
      return false;
    }
  }
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);
  useEffect(() => {
    if (!posthogConfigured || identifiedPersonId.current === state.activePersonId) return;

    if (identifiedPersonId.current !== undefined && identifiedPersonId.current !== null)
      posthog.reset();

    const person = state.people.find((item) => item.id === state.activePersonId);
    if (person) posthog.identify(person.id, { name: person.name, role: person.role });

    identifiedPersonId.current = state.activePersonId;
  }, [posthogConfigured, state.activePersonId, state.people]);
  // Another open tab saved the scenario: adopt its data so this tab's next save cannot
  // overwrite it. Each tab keeps its own selected person, so candidate and employer views
  // can stay open side by side. Unreadable values are ignored and never written back.
  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key !== STORAGE_KEY || !event.newValue) return;
      let incoming: State;
      try {
        incoming = parseState(event.newValue);
      } catch {
        return;
      }
      const ownPerson = latest.current.activePersonId;
      const next =
        ownPerson === null || incoming.people.some((person) => person.id === ownPerson)
          ? { ...incoming, activePersonId: ownPerson }
          : incoming;
      latest.current = next;
      setState(next);
      setBlocked(false);
      setIssue("");
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  return {
    state,
    issue,
    error,
    blocked,
    original: loaded.original,
    run,
    importState,
    clearError: () => setError(""),
    reset: () => commit(initialState(), true),
  };
}
type Store = ReturnType<typeof useStore>;
const Context = createContext<Store | null>(null);
export function PrototypeProvider({ children }: { children: ReactNode }) {
  const store = useStore();
  return <Context.Provider value={store}>{children}</Context.Provider>;
}
export function usePrototype() {
  const store = useContext(Context);
  if (!store) throw new Error("PrototypeProvider is required");
  return store;
}
