"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { MARKET } from "@/lib/mockData";

type Side = "REAL" | "FAKE" | null;

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export default function MarketPage() {
  const { state, placeBet, showToast } = useApp();
  const [side, setSide] = useState<Side>(null);
  const [stake, setStake] = useState(100);
  const [placing, setPlacing] = useState(false);
  const [odds, setOdds] = useState({
    real: MARKET.realPercent,
    fake: MARKET.fakePercent,
  });

  function select(s: Exclude<Side, null>) {
    setSide(s);
    // nudge odds toward the selected side for visual feedback
    setOdds((prev) => {
      if (s === "REAL") {
        const real = Math.min(prev.real + 1, 95);
        return { real, fake: 100 - real };
      }
      const fake = Math.min(prev.fake + 1, 95);
      return { real: 100 - fake, fake };
    });
  }

  const pct = side === "REAL" ? odds.real : side === "FAKE" ? odds.fake : 0;
  const potentialWin = side && pct > 0 ? Math.floor(stake * (100 / pct)) : 0;
  const profit = potentialWin - stake;

  async function handlePlaceBet() {
    if (!side) {
      showToast("Select REAL or FAKE first");
      return;
    }
    if (stake < 1) {
      showToast("Enter a valid stake");
      return;
    }
    if (stake > state.balance) {
      showToast("Insufficient balance");
      return;
    }

    setPlacing(true);
    await delay(1500);
    placeBet(stake, side, MARKET.title);
    setPlacing(false);
    showToast(`Bet placed! ${stake} LMT on ${side}`);
  }

  return (
    <div className="animate-fade-in">
      <header className="flex items-center justify-between border-b border-litmus-border px-4 py-3">
        <Link
          href="/dashboard"
          className="touch-target flex min-w-[44px] items-center text-litmus-muted hover:text-white"
        >
          ←
        </Link>
        <span className="font-bold">Prediction Market</span>
        <div className="w-11" />
      </header>

      <div className="space-y-4 px-4 py-4">
        {/* Market Header */}
        <div className="card p-4">
          <span className="rounded-full bg-litmus-danger/20 px-2 py-0.5 text-[10px] text-litmus-danger">
            🔥 TRENDING
          </span>
          <h2 className="mb-1 mt-2 text-lg font-bold">{MARKET.title}</h2>
          <p className="text-xs text-litmus-muted">
            Posted 3h ago · {MARKET.participants.toLocaleString()} participants
            · Ends in {MARKET.endsIn}
          </p>
        </div>

        {/* Odds */}
        <div className="card p-4">
          <div className="mb-3 flex justify-between text-sm font-semibold">
            <span className="text-litmus-green">REAL {odds.real}%</span>
            <span className="text-litmus-danger">FAKE {odds.fake}%</span>
          </div>
          <div className="mb-4 flex h-4 overflow-hidden rounded-full bg-litmus-bg">
            <div
              className="odds-bar h-full bg-litmus-green"
              style={{ width: `${odds.real}%` }}
            />
            <div
              className="odds-bar h-full bg-litmus-danger"
              style={{ width: `${odds.fake}%` }}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 text-center text-xs">
            <div className="rounded-lg bg-litmus-bg p-2">
              <p className="text-litmus-muted">Total Pool</p>
              <p className="font-bold text-litmus-accent">
                {(MARKET.pool / 1000).toFixed(0)}K LMT
              </p>
            </div>
            <div className="rounded-lg bg-litmus-bg p-2">
              <p className="text-litmus-muted">Your Balance</p>
              <p className="font-bold">{state.balance.toLocaleString()} LMT</p>
            </div>
          </div>
        </div>

        {/* Selection */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => select("REAL")}
            className={`touch-target rounded-card border-2 py-4 text-sm font-bold transition-all ${
              side === "REAL"
                ? "border-litmus-green bg-litmus-green text-black"
                : "border-litmus-border bg-litmus-surface hover:border-litmus-green"
            }`}
          >
            ✓ REAL
          </button>
          <button
            onClick={() => select("FAKE")}
            className={`touch-target rounded-card border-2 py-4 text-sm font-bold transition-all ${
              side === "FAKE"
                ? "border-litmus-danger bg-litmus-danger text-white"
                : "border-litmus-border bg-litmus-surface hover:border-litmus-danger"
            }`}
          >
            ✗ FAKE
          </button>
        </div>

        {/* Stake */}
        <div className="card p-4">
          <label className="mb-2 block text-xs text-litmus-muted">
            Your Stake (LMT)
          </label>
          <div className="mb-3 flex items-center gap-2">
            <input
              type="number"
              value={stake}
              min={1}
              max={state.balance}
              onChange={(e) => setStake(parseInt(e.target.value) || 0)}
              className="touch-target w-full min-w-0 flex-1 rounded-card border border-litmus-border bg-litmus-bg px-4 py-3 text-lg font-bold transition-colors focus:border-litmus-accent focus:outline-none"
            />
            <button
              onClick={() => setStake(state.balance)}
              className="touch-target shrink-0 rounded-lg bg-litmus-accent/20 px-3 py-3 text-xs font-medium text-litmus-accent"
            >
              MAX
            </button>
          </div>
          <div className="mb-3 flex gap-2">
            {[25, 50, 100].map((amount) => (
              <button
                key={amount}
                onClick={() => setStake(amount)}
                className="touch-target flex-1 rounded-lg border border-litmus-border bg-litmus-bg py-2 text-xs transition-colors hover:border-litmus-accent"
              >
                {amount}
              </button>
            ))}
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-litmus-muted">Potential Win</span>
              <span
                className={`font-bold ${side ? "text-litmus-green" : "text-litmus-muted"}`}
              >
                {side ? `${potentialWin.toLocaleString()} LMT` : "Select a side"}
              </span>
            </div>
            {side && (
              <div className="flex justify-between text-xs">
                <span className="text-litmus-muted">Profit</span>
                <span className="font-semibold text-litmus-green">
                  +{profit.toLocaleString()} LMT
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Tip */}
        <div className="rounded-card border border-litmus-accent/30 bg-litmus-accent/10 p-3 text-xs text-litmus-muted">
          💡 <strong className="text-white">Tip:</strong>{" "}
          {MARKET.crowdFakePercent}% of hunters say FAKE. Betting against the
          crowd offers higher returns if correct.
        </div>

        {/* Place Bet */}
        <button
          onClick={handlePlaceBet}
          disabled={placing || !side}
          className="touch-target w-full rounded-card cta-gradient py-4 font-semibold text-black transition-transform active:scale-[0.98] disabled:opacity-50"
        >
          {placing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="loading-spinner h-5 w-5" />
              Placing bet...
            </span>
          ) : (
            "Place Bet"
          )}
        </button>
      </div>
    </div>
  );
}
