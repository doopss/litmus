"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Activity, AppState, VerificationResult, WalletProvider } from "./types";
import { INITIAL_STATE } from "./mockData";

const STORAGE_KEY = "litmus-app-state";

interface AppContextValue {
  state: AppState;
  hydrated: boolean;
  connectWallet: (provider: WalletProvider) => Promise<void>;
  disconnectWallet: () => void;
  addEarnings: (amount: number, activity: Omit<Activity, "id" | "time">) => void;
  placeBet: (stake: number, side: "REAL" | "FAKE", marketTitle: string) => void;
  setLastResult: (result: VerificationResult) => void;
  resetDemo: () => void;
  toast: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...INITIAL_STATE, ...JSON.parse(raw) };
  } catch {
    // corrupted storage — fall back to defaults
  }
  return INITIAL_STATE;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, hydrated]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  }, []);

  const connectWallet = useCallback(
    async (provider: WalletProvider) => {
      await new Promise((r) => setTimeout(r, 1000));
      const address = "7xKp" + "…" + "9mNq";
      setState((s) => ({ ...s, wallet: { address, provider } }));
      showToast(`Connected via ${provider}`);
    },
    [showToast]
  );

  const disconnectWallet = useCallback(() => {
    setState((s) => ({ ...s, wallet: null }));
    showToast("Wallet disconnected");
  }, [showToast]);

  const addEarnings = useCallback(
    (amount: number, activity: Omit<Activity, "id" | "time">) => {
      setState((s) => ({
        ...s,
        balance: s.balance + amount,
        stats: { ...s.stats, verified: s.stats.verified + 1 },
        activities: [
          { ...activity, id: crypto.randomUUID(), time: "Just now" },
          ...s.activities,
        ].slice(0, 12),
      }));
    },
    []
  );

  const placeBet = useCallback(
    (stake: number, side: "REAL" | "FAKE", marketTitle: string) => {
      setState((s) => ({
        ...s,
        balance: s.balance - stake,
        activities: [
          {
            id: crypto.randomUUID(),
            icon: "🎲",
            description: `Bet ${stake} LMT on ${side} — ${marketTitle}`,
            reward: -stake,
            time: "Just now",
          },
          ...s.activities,
        ].slice(0, 12),
      }));
    },
    []
  );

  const setLastResult = useCallback((result: VerificationResult) => {
    setState((s) => ({ ...s, lastResult: result }));
  }, []);

  const resetDemo = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(INITIAL_STATE);
    showToast("Demo data reset");
  }, [showToast]);

  return (
    <AppContext.Provider
      value={{
        state,
        hydrated,
        connectWallet,
        disconnectWallet,
        addEarnings,
        placeBet,
        setLastResult,
        resetDemo,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
