"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { LEADERBOARDS } from "@/lib/mockData";
import { LeaderboardTab } from "@/lib/types";

const TABS: { id: LeaderboardTab; label: string }[] = [
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "alltime", label: "All Time" },
];

export default function LeaderboardPage() {
  const { state, showToast } = useApp();
  const [tab, setTab] = useState<LeaderboardTab>("weekly");
  const [inviting, setInviting] = useState(false);

  async function invite() {
    setInviting(true);
    await new Promise((r) => setTimeout(r, 700));
    try {
      await navigator.clipboard.writeText(
        "https://litmus.protocol/invite/hunter47"
      );
    } catch {
      // clipboard unavailable — toast still confirms
    }
    setInviting(false);
    showToast("Invite link copied! Share to earn 100 LMT");
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
        <span className="font-bold">Leaderboard</span>
        <div className="w-11" />
      </header>

      <div className="space-y-4 px-4 py-4">
        {/* Tabs */}
        <div className="flex gap-1 rounded-card border border-litmus-border bg-litmus-surface p-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`touch-target flex-1 rounded-lg py-2.5 text-xs font-medium transition-all ${
                tab === t.id
                  ? "bg-litmus-accent text-white"
                  : "text-litmus-muted hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Rankings */}
        <div className="space-y-2" key={tab}>
          {LEADERBOARDS[tab].map((entry, i) => (
            <div
              key={entry.name}
              className="card flex animate-slide-up items-center gap-3 p-3 transition-colors hover:border-litmus-accent/40"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <span
                className={`w-6 text-center font-bold ${
                  entry.medal ? "text-lg" : "text-sm text-litmus-muted"
                }`}
              >
                {entry.medal ?? entry.rank}
              </span>
              <p className="flex-1 text-sm font-semibold">{entry.name}</p>
              <span className="text-sm font-bold text-litmus-accent">
                {entry.score.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {/* User Position */}
        <div className="flex animate-pulse-slow items-center gap-3 rounded-card border-2 border-litmus-accent bg-litmus-accent/10 p-3">
          <span className="w-8 text-center font-bold text-litmus-accent">
            #{state.rank}
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold">You (@hunter)</p>
            <p className="text-[10px] text-litmus-muted">
              Top {state.percentile}% this week
            </p>
          </div>
          <span className="text-sm font-bold">4,650</span>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="card p-3 text-center">
            <p className="text-xl font-bold">{state.stats.verified}</p>
            <p className="text-[10px] text-litmus-muted">Verified</p>
          </div>
          <div className="card p-3 text-center">
            <p className="text-xl font-bold text-litmus-green">
              {state.stats.accuracy}%
            </p>
            <p className="text-[10px] text-litmus-muted">Accuracy</p>
          </div>
          <div className="card p-3 text-center">
            <p className="text-xl font-bold text-litmus-accent">
              +{state.stats.roi}%
            </p>
            <p className="text-[10px] text-litmus-muted">ROI</p>
          </div>
          <div className="card p-3 text-center">
            <p className="text-xl font-bold text-litmus-danger">
              {state.stats.streak}🔥
            </p>
            <p className="text-[10px] text-litmus-muted">Day Streak</p>
          </div>
        </div>

        {/* Invite */}
        <button
          onClick={invite}
          disabled={inviting}
          className="touch-target w-full rounded-card border border-litmus-accent py-3 text-sm font-semibold text-litmus-accent transition-colors hover:bg-litmus-accent/10 disabled:opacity-50"
        >
          {inviting ? "Generating link..." : "Invite Friends — Earn 100 LMT"}
        </button>
      </div>
    </div>
  );
}
