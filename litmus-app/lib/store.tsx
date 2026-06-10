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
import {
  Activity,
  AppState,
  Market,
  VerificationResult,
  WalletProvider,
} from "./types";
import { INITIAL_STATE, MARKETS } from "./mockData";

const STORAGE_KEY = "litmus_v2_state";

const ADDRS = ["7xKp…9fQa", "Bn3v…Wm2L", "9aQc…Rt4Z", "Fd2k…Lp8N"];

interface AppContextValue {
  state: AppState;
  hydrated: boolean;
  markets: Market[];
  connectWallet: (provider: WalletProvider) => Promise<void>;
  disconnectWallet: () => void;
  addEarnings: (amount: number, activity: Omit<Activity, "id" | "time">) => void;
  placeBet: (market: Market, side: "REAL" | "FAKE", stake: number) => void;
  setLastResult: (result: VerificationResult) => void;
  resetDemo: () => void;
  toast: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...INITIAL_STATE,
        ...parsed,
        activities: parsed.activities ?? INITIAL_STATE.activities,
        positions: parsed.positions ?? [],
      };
    }
  } catch {
    // corrupted storage — fall back to defaults
  }
  return INITIAL_STATE;
}

function saveState(state: AppState) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        wallet: state.wallet,
        balance: state.balance,
        activities: state.activities,
        positions: state.positions,
        lastResult: state.lastResult,
      })
    );
  } catch {
    // storage full or unavailable
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [markets, setMarkets] = useState<Market[]>(MARKETS);
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const connectWallet = useCallback(async (provider: WalletProvider) => {
    await new Promise((r) => setTimeout(r, 900));
    const address = ADDRS[Math.floor(Math.random() * ADDRS.length)];
    setState((s) => ({ ...s, wallet: { address, provider } }));
  }, []);

  const disconnectWallet = useCallback(() => {
    setState((s) => ({ ...s, wallet: null }));
  }, []);

  const addEarnings = useCallback(
    (amount: number, activity: Omit<Activity, "id" | "time">) => {
      setState((s) => ({
        ...s,
        balance: s.balance + amount,
        stats: { ...s.stats, verified: s.stats.verified + 1 },
        activities: [
          { ...activity, id: crypto.randomUUID(), time: "just now" },
          ...s.activities,
        ].slice(0, 12),
      }));
    },
    []
  );

  const placeBet = useCallback(
    (market: Market, side: "REAL" | "FAKE", stake: number) => {
      const pct = side === "REAL" ? market.realPct : 100 - market.realPct;
      const payout = Math.floor(stake * (100 / Math.max(pct, 1)));
      setState((s) => ({
        ...s,
        balance: s.balance - stake,
        positions: [
          {
            id: "p" + Date.now(),
            marketId: market.id,
            subject: market.subject,
            side,
            stake,
            payout,
            status: "open",
          },
          ...s.positions,
        ],
        activities: [
          {
            id: "b" + Date.now(),
            kind: "bet" as const,
            description: `Staked ${stake} on ${side} · ${market.subject}`,
            reward: -stake,
            time: "just now",
          },
          ...s.activities,
        ].slice(0, 12),
      }));
      setMarkets((ms) =>
        ms.map((m) => {
          if (m.id !== market.id) return m;
          let real = m.realPct + (side === "REAL" ? 1 : -1);
          real = Math.max(4, Math.min(96, real));
          return {
            ...m,
            realPct: real,
            pool: m.pool + stake,
            participants: m.participants + 1,
            history: [...m.history.slice(1), real],
          };
        })
      );
    },
    []
  );

  const setLastResult = useCallback((result: VerificationResult) => {
    setState((s) => ({ ...s, lastResult: result }));
  }, []);

  const resetDemo = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(INITIAL_STATE);
    setMarkets(MARKETS);
    showToast("Demo state reset");
  }, [showToast]);

  return (
    <AppContext.Provider
      value={{
        state,
        hydrated,
        markets,
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
