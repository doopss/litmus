"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";
import { LMT_USD_RATE, MARKET } from "@/lib/mockData";
import WalletButton from "@/components/WalletButton";

export default function DashboardPage() {
  const { state, hydrated } = useApp();

  return (
    <div className="animate-fade-in">
      <header className="flex items-center justify-between border-b border-litmus-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-litmus-accent text-sm font-bold">
            L
          </div>
          <span className="font-bold">Dashboard</span>
        </div>
        <WalletButton />
      </header>

      <div className="space-y-4 px-4 py-4">
        <h1 className="text-xl font-extrabold">Welcome, Hunter! 🏆</h1>

        {/* Earnings Card */}
        <div className="rounded-card border border-litmus-accent/40 bg-gradient-to-br from-litmus-accent/20 to-litmus-surface p-5">
          <p className="mb-1 text-xs text-litmus-muted">Your Balance</p>
          <div className="mb-2 flex items-end gap-2">
            <span className="text-3xl font-extrabold">
              {hydrated ? state.balance.toLocaleString() : "—"}
            </span>
            <span className="mb-1 font-semibold text-litmus-accent">LMT</span>
          </div>
          <p className="text-sm text-litmus-muted">
            ≈ ${hydrated ? (state.balance * LMT_USD_RATE).toFixed(2) : "—"} USD
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-litmus-bg/50 px-3 py-1 text-xs">
            <span>🏅</span>
            <span>
              Rank #{state.rank} — Top {state.percentile}%
            </span>
          </div>
        </div>

        {/* CTAs */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/verify"
            className="touch-target flex items-center justify-center rounded-card cta-gradient py-4 text-sm font-semibold text-black transition-transform active:scale-[0.98]"
          >
            ⚡️ Verify &amp; Earn
          </Link>
          <Link
            href="/market"
            className="touch-target card flex items-center justify-center py-4 text-sm font-semibold transition-colors hover:border-litmus-accent"
          >
            🎲 Bet &amp; Win
          </Link>
        </div>

        {/* Hot Market Preview */}
        <Link
          href="/market"
          className="card block p-4 transition-colors hover:border-litmus-accent/50"
        >
          <div className="mb-3 flex items-start justify-between">
            <div>
              <span className="rounded-full bg-litmus-danger/20 px-2 py-0.5 text-[10px] font-medium text-litmus-danger">
                🔥 HOT
              </span>
              <h3 className="mt-1 text-sm font-semibold">{MARKET.title}</h3>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-litmus-muted">Pool</p>
              <p className="text-sm font-bold text-litmus-accent">
                {(MARKET.pool / 1000).toFixed(0)}K LMT
              </p>
            </div>
          </div>
          <div className="mb-2 flex justify-between text-xs">
            <span className="text-litmus-danger">
              {MARKET.crowdFakePercent}% say FAKE
            </span>
            <span className="text-litmus-muted">Ends in {MARKET.endsIn}</span>
          </div>
          <div className="flex h-2 overflow-hidden rounded-full bg-litmus-bg">
            <div
              className="odds-bar h-full bg-litmus-green"
              style={{ width: `${100 - MARKET.crowdFakePercent}%` }}
            />
            <div
              className="odds-bar h-full bg-litmus-danger"
              style={{ width: `${MARKET.crowdFakePercent}%` }}
            />
          </div>
        </Link>

        {/* Activity Feed */}
        <div>
          <h3 className="mb-3 text-sm font-semibold">Recent Activity</h3>
          <div className="space-y-2">
            {state.activities.map((a, i) => (
              <div
                key={a.id}
                className="card flex animate-slide-up items-center gap-3 p-3"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span className="text-lg">{a.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{a.description}</p>
                  <p className="text-[10px] text-litmus-muted">{a.time}</p>
                </div>
                <span
                  className={`text-sm font-bold ${
                    a.reward >= 0 ? "text-litmus-green" : "text-litmus-danger"
                  }`}
                >
                  {a.reward >= 0 ? "+" : ""}
                  {a.reward} LMT
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
