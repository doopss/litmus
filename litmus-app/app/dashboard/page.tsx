"use client";

import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { useApp } from "@/lib/store";
import { usd } from "@/lib/mockData";
import { useLmtBalance } from "@/lib/useLmtBalance";
import WalletControl from "@/components/WalletControl";
import Sparkline from "@/components/Sparkline";
import Icon from "@/components/Icon";
import { ActivityKind } from "@/lib/types";

const ACTIVITY_ICONS: Record<ActivityKind, "scan" | "trophy" | "market" | "flame"> = {
  verify: "scan",
  win: "trophy",
  bet: "market",
  streak: "flame",
};

const EARN_SPARK = [8, 12, 9, 16, 14, 22, 19, 28, 24, 31];

export default function DashboardPage() {
  const { state, markets } = useApp();
  const { publicKey } = useWallet();
  const { lmtBalance, isLoading: lmtLoading } = useLmtBalance(publicKey);
  const hot = markets[0];

  return (
    <div className="fade">
      <div
        className="between"
        style={{ marginBottom: 18, flexWrap: "wrap", gap: 10 }}
      >
        <div>
          <div className="lbl" style={{ marginBottom: 6 }}>
            SESSION · HUNTER #{state.rank}
          </div>
          <h1 style={{ fontSize: 26 }}>Dashboard</h1>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <WalletControl />
        </div>
      </div>

      <div
        className="grid"
        style={{ gridTemplateColumns: "minmax(0,1.4fr) 1fr", marginBottom: 14 }}
        id="dash-top"
      >
        <div className="panel tick">
          <div className="panel-b">
            <div className="between">
              <span className="lbl">GAME LMT</span>
              <span className="chip cyan">
                <Icon name="trophy" size={11} />
                RANK #{state.rank} · TOP {state.percentile}%
              </span>
            </div>
            <div
              className="row"
              style={{ alignItems: "flex-end", gap: 10, margin: "12px 0 4px" }}
            >
              <span className="num" style={{ fontSize: 44, lineHeight: 1 }}>
                {state.balance.toLocaleString()}
              </span>
              <span
                className="mono t-cyan"
                style={{ fontSize: 16, marginBottom: 6 }}
              >
                LMT
              </span>
            </div>
            <div className="between">
              <span className="mut mono" style={{ fontSize: 12.5 }}>
                ≈ {usd(state.balance)} USD
              </span>
              <Sparkline
                data={EARN_SPARK}
                w={140}
                h={34}
                stroke="var(--green)"
                fill="color-mix(in oklab,var(--green) 12%,transparent)"
              />
            </div>
            <div
              className="between"
              style={{
                marginTop: 12,
                paddingTop: 12,
                borderTop: "1px solid var(--line)",
              }}
            >
              <span className="lbl">WALLET LMT</span>
              <span className="num t-cyan" style={{ fontSize: 16 }}>
                {lmtLoading
                  ? "…"
                  : lmtBalance.toLocaleString(undefined, {
                      maximumFractionDigits: 4,
                    })}{" "}
                <span style={{ fontSize: 12 }}>on-chain</span>
              </span>
            </div>
          </div>
        </div>

        <div className="grid" style={{ gap: 14 }}>
          <Link
            href="/verify"
            className="btn cta"
            style={{
              height: "100%",
              flexDirection: "column",
              gap: 8,
              padding: 18,
            }}
          >
            <Icon name="scan" size={22} />
            <span style={{ fontWeight: 600 }}>Verify & Earn</span>
          </Link>
          <Link
            href="/market"
            className="btn"
            style={{
              height: "100%",
              flexDirection: "column",
              gap: 8,
              padding: 18,
            }}
          >
            <Icon name="market" size={22} />
            <span style={{ fontWeight: 600 }}>Open Markets</span>
          </Link>
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
            <div className={"v " + s[2]} style={{ fontSize: 22 }}>
              {s[1]}
            </div>
            <div className="lbl" style={{ marginTop: 3 }}>
              {s[0]}
            </div>
          </div>
        ))}
      </div>

      <div className="grid g2 collapse" style={{ alignItems: "start" }}>
        <Link
          href={`/market/${hot.id}`}
          className="panel tick"
          style={{ textAlign: "left", display: "block", padding: 0 }}
        >
          <div className="panel-h">
            <span className="lbl">HOT MARKET</span>
            <span className="chip red">
              <Icon name="flame" size={11} />
              TRENDING
            </span>
          </div>
          <div className="panel-b">
            <h3 style={{ fontSize: 17, marginBottom: 4 }}>{hot.subject}</h3>
            <p className="dim" style={{ fontSize: 12.5, margin: "0 0 14px" }}>
              {hot.claim}
            </p>
            <div className="between" style={{ marginBottom: 7 }}>
              <span className="mono t-green" style={{ fontSize: 12 }}>
                REAL {hot.realPct}%
              </span>
              <span className="mono t-red" style={{ fontSize: 12 }}>
                {100 - hot.realPct}% FAKE
              </span>
            </div>
            <div className="split">
              <div className="g" style={{ width: hot.realPct + "%" }} />
              <div className="r" style={{ width: 100 - hot.realPct + "%" }} />
            </div>
            <div
              className="row t-cyan"
              style={{
                fontSize: 12,
                fontFamily: "var(--mono)",
                marginTop: 14,
              }}
            >
              STAKE CONVICTION <Icon name="arrowR" size={14} />
            </div>
          </div>
        </Link>

        <div className="panel">
          <div className="panel-h">
            <span className="lbl">ACTIVITY LOG</span>
          </div>
          <div>
            {state.activities.slice(0, 6).map((a) => (
              <div className="tbl-row" key={a.id}>
                <span
                  className="fi"
                  style={{
                    width: 30,
                    height: 30,
                    marginBottom: 0,
                    borderRadius: 6,
                  }}
                >
                  <Icon name={ACTIVITY_ICONS[a.kind]} size={15} />
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {a.description}
                  </div>
                  <div className="lbl" style={{ marginTop: 2 }}>
                    {a.time}
                  </div>
                </div>
                <span
                  className={"num " + (a.reward >= 0 ? "t-green" : "t-red")}
                  style={{ fontSize: 13 }}
                >
                  {a.reward >= 0 ? "+" : ""}
                  {a.reward}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
