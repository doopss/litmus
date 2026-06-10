"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";
import CountUp from "@/components/CountUp";
import Icon from "@/components/Icon";

export default function LandingPage() {
  const { markets } = useApp();

  const tape = markets.flatMap((m) => [
    {
      t: m.subject,
      v: m.realPct + "% REAL",
      s: m.realPct < 35 ? "r" : "g",
    },
  ]);
  const allTape = [
    ...tape,
    { t: "PAID OUT 24H", v: "48,210 LMT", s: "g" },
    { t: "FAKES FLAGGED", v: "2.4M", s: "r" },
    { t: "HUNTERS ONLINE", v: "12,847", s: "g" },
  ];

  return (
    <div className="fade">
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 22 }}>
        <span className="chip cyan">
          <span className="dot" />
          LIVE ON SOLANA
        </span>
        <span className="lbl">PROTOCOL v2.0</span>
      </div>
      <h1 className="hero-title" style={{ marginBottom: 22 }}>
        AUTHENTICITY
        <br />
        IS A <span className="accent">SIGNAL.</span>
      </h1>
      <p
        className="dim"
        style={{
          fontSize: 16,
          maxWidth: 520,
          marginBottom: 26,
          lineHeight: 1.55,
        }}
      >
        Litmus turns forensic media analysis into a market. Verify suspect
        footage, stake conviction on prediction markets, and earn LMT for every
        fake you catch.
      </p>
      <div className="row" style={{ gap: 12, marginBottom: 34, flexWrap: "wrap" }}>
        <Link
          href="/verify"
          className="btn cta"
          style={{ fontSize: 14, padding: "13px 22px" }}
        >
          <Icon name="scan" size={17} /> Run a verification
        </Link>
        <Link href="/market" className="btn" style={{ padding: "13px 20px" }}>
          <Icon name="market" size={17} /> Browse markets
        </Link>
      </div>

      <div className="ticker" style={{ margin: "0 0 30px", borderRadius: 6 }}>
        <div className="ticker-track">
          {[...allTape, ...allTape].map((x, i) => (
            <span className="ti" key={i}>
              <span
                className={"mono " + (x.s === "g" ? "t-green" : "t-red")}
              >
                ●
              </span>{" "}
              {x.t} <b className="mono">{x.v}</b>
            </span>
          ))}
        </div>
      </div>

      <div className="grid g3" style={{ marginBottom: 30 }}>
        <div className="stat">
          <div className="v t-cyan">
            <CountUp target={12847} />
          </div>
          <div className="lbl" style={{ marginTop: 4 }}>
            EARNING TODAY
          </div>
        </div>
        <div className="stat">
          <div className="v t-green">
            <CountUp target={48} prefix="$" suffix="K" />
          </div>
          <div className="lbl" style={{ marginTop: 4 }}>
            PAID OUT (24H)
          </div>
        </div>
        <div className="stat">
          <div className="v">
            <CountUp target={2.4} decimals={1} suffix="M" />
          </div>
          <div className="lbl" style={{ marginTop: 4 }}>
            FAKES CAUGHT
          </div>
        </div>
      </div>

      <div className="grid g3">
        {[
          {
            i: "scan" as const,
            t: "Verify & Earn",
            d: "Upload suspect clips. Our detector returns a confidence score — you earn 10–50 LMT per resolved verification.",
            href: "/verify",
          },
          {
            i: "market" as const,
            t: "Stake Conviction",
            d: "Drag the conviction dial toward REAL or FAKE. Contrarian calls pay multiples when you're right.",
            href: "/market",
          },
          {
            i: "trophy" as const,
            t: "Climb the Tape",
            d: "Accuracy compounds into rank. Weekly standings unlock bonus emissions for top hunters.",
            href: "/leaderboard",
          },
        ].map((f, i) => (
          <Link
            key={f.t}
            href={f.href}
            className="feat up"
            style={{ textAlign: "left", animationDelay: i * 80 + "ms" }}
          >
            <div className="fi">
              <Icon name={f.i} size={20} />
            </div>
            <h3 style={{ fontSize: 16, marginBottom: 7 }}>{f.t}</h3>
            <p
              className="dim"
              style={{ fontSize: 13, margin: 0, lineHeight: 1.5 }}
            >
              {f.d}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
