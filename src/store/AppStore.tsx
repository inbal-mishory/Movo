import { createContext, useContext, useEffect, useMemo, useReducer, type Dispatch, type ReactNode } from 'react';
import { loadState, reducer, STORAGE_KEY, type Action } from './reducer';
import type { PersistedState } from '../types';

interface StoreValue {
  state: PersistedState;
  dispatch: Dispatch<Action>;
}

const StoreContext = createContext<StoreValue | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => loadState(globalThis.localStorage));

  useEffect(() => {
    try {
      globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage may be unavailable or full; the app keeps working in memory.
    }
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useAppStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useAppStore must be used inside AppStoreProvider');
  return ctx;
}
