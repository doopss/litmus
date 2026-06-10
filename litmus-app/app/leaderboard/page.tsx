"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { LEADERBOARDS, fmt } from "@/lib/mockData";
import { LeaderboardTab } from "@/lib/types";
import Icon from "@/components/Icon";

const TABS: [LeaderboardTab, string][] = [
  ["weekly", "Weekly"],
  ["monthly", "Monthly"],
  ["alltime", "All Time"],
];

export default function LeaderboardPage() {
  const { state, showToast } = useApp();
  const [tab, setTab] = useState<LeaderboardTab>("weekly");
  const [inv, setInv] = useState(false);

  async function invite() {
    setInv(true);
    await new Promise((r) => setTimeout(r, 700));
    try {
      await navigator.clipboard.writeText(
        "https://litmus.protocol/invite/hunter47"
      );
    } catch {
      // clipboard unavailable
    }
    setInv(false);
    showToast("Invite link copied · +100 LMT per referral");
  }

  const max = LEADERBOARDS[tab][0].score;

  return (
    <div className="content narrow fade" style={{ padding: 0, maxWidth: 720 }}>
      <div className="lbl" style={{ marginBottom: 6 }}>
        STANDINGS
      </div>
      <h1 style={{ fontSize: 26, marginBottom: 18 }}>Leaderboard</h1>
      <div className="seg" style={{ marginBottom: 16 }}>
        {TABS.map(([id, l]) => (
          <button
            key={id}
            className={tab === id ? "on" : ""}
            onClick={() => setTab(id)}
          >
            {l}
          </button>
        ))}
      </div>
      <div className="panel" key={tab} style={{ marginBottom: 14 }}>
        {LEADERBOARDS[tab].map((e, i) => (
          <div
            className="tbl-row up"
            key={e.name}
            style={{ animationDelay: i * 35 + "ms" }}
          >
            <span
              className="num"
              style={{
                width: 26,
                textAlign: "center",
                color: i < 3 ? "var(--cyan)" : "var(--mut)",
                fontSize: i < 3 ? 16 : 13,
                fontWeight: i < 3 ? 600 : 400,
              }}
            >
              {e.rank}
            </span>
            <span style={{ flex: 1, fontSize: 14 }} className="mono">
              @{e.name}
            </span>
            <div className="meter" style={{ width: 70, height: 4 }}>
              <span
                style={{
                  width: (e.score / max) * 100 + "%",
                  background: i < 3 ? "var(--cyan)" : "var(--line2)",
                }}
              />
            </div>
            <span
              className="num t-cyan"
              style={{ width: 64, textAlign: "right", fontSize: 13 }}
            >
              {fmt(e.score)}
            </span>
          </div>
        ))}
      </div>
      <div
        className="panel tick"
        style={{
          borderColor: "var(--cyan-d)",
          marginBottom: 14,
          background: "color-mix(in oklab,var(--cyan) 7%,var(--panel))",
        }}
      >
        <div className="tbl-row" style={{ borderBottom: "none" }}>
          <span
            className="num t-cyan"
            style={{ width: 30, textAlign: "center", fontSize: 16 }}
          >
            #{state.rank}
          </span>
          <div style={{ flex: 1 }}>
            <div className="mono" style={{ fontSize: 14 }}>
              @hunter{" "}
              <span className="chip cyan" style={{ marginLeft: 6 }}>
                YOU
              </span>
            </div>
            <div className="lbl" style={{ marginTop: 2 }}>
              TOP {state.percentile}% THIS WEEK
            </div>
          </div>
          <span className="num" style={{ fontSize: 14 }}>
            4,650
          </span>
        </div>
      </div>
      <div className="grid g4" style={{ marginBottom: 14 }}>
        {(
          [
            ["VERIFIED", state.stats.verified, ""],
            ["ACCURACY", state.stats.accuracy + "%", "t-green"],
            ["ROI", "+" + state.stats.roi + "%", "t-cyan"],
            ["STREAK", state.stats.streak + "d", "t-amber"],
          ] as const
        ).map((s) => (
          <div className="stat" key={s[0]}>
            <div className={"v " + s[2]} style={{ fontSize: 20 }}>
              {s[1]}
            </div>
            <div className="lbl" style={{ marginTop: 3 }}>
              {s[0]}
            </div>
          </div>
        ))}
      </div>
      <button className="btn block" disabled={inv} onClick={invite}>
        <Icon name="share" size={16} />{" "}
        {inv ? "Generating link…" : "Invite hunters — earn 100 LMT"}
      </button>
    </div>
  );
}
