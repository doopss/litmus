"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";
import { fmtK } from "@/lib/mockData";
import Icon from "@/components/Icon";
import Sparkline from "@/components/Sparkline";

export default function MarketListPage() {
  const { markets } = useApp();

  return (
    <div className="fade">
      <div
        className="between"
        style={{ marginBottom: 18, flexWrap: "wrap", gap: 12 }}
      >
        <div>
          <div className="lbl" style={{ marginBottom: 6 }}>
            PREDICTION MARKETS
          </div>
          <h1 style={{ fontSize: 26 }}>Open Signals</h1>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <span className="chip cyan">
            <span className="dot" />
            LIVE
          </span>
          <span className="chip">{markets.length} MARKETS</span>
        </div>
      </div>

      <div className="grid g2 collapse">
        {markets.map((m, i) => (
          <Link
            key={m.id}
            href={`/market/${m.id}`}
            className="panel tick up"
            style={{
              textAlign: "left",
              padding: 0,
              animationDelay: i * 60 + "ms",
              display: "block",
            }}
          >
            <div className="panel-b" style={{ padding: 16 }}>
              <div
                className="between"
                style={{ alignItems: "flex-start", marginBottom: 12 }}
              >
                <span
                  className={
                    "chip " +
                    (m.realPct < 35 ? "red" : m.realPct > 60 ? "green" : "")
                  }
                >
                  {m.tag}
                </span>
                {m.hot && (
                  <span className="chip red">
                    <Icon name="flame" size={11} />
                    HOT
                  </span>
                )}
              </div>
              <h3 style={{ fontSize: 17, marginBottom: 6 }}>{m.subject}</h3>
              <p
                className="dim"
                style={{
                  fontSize: 12.5,
                  margin: "0 0 14px",
                  minHeight: 34,
                  lineHeight: 1.4,
                }}
              >
                {m.claim}
              </p>

              <div className="between" style={{ marginBottom: 7 }}>
                <span className="mono t-green" style={{ fontSize: 12 }}>
                  REAL {m.realPct}%
                </span>
                <Sparkline
                  data={m.history}
                  w={88}
                  h={26}
                  stroke="var(--cyan)"
                />
                <span className="mono t-red" style={{ fontSize: 12 }}>
                  {100 - m.realPct}% FAKE
                </span>
              </div>
              <div className="split" style={{ marginBottom: 14 }}>
                <div className="g" style={{ width: m.realPct + "%" }} />
                <div className="r" style={{ width: 100 - m.realPct + "%" }} />
              </div>

              <div className="between">
                <div className="row" style={{ gap: 16 }}>
                  <div>
                    <div className="lbl">POOL</div>
                    <div className="mono" style={{ fontSize: 13 }}>
                      {fmtK(m.pool)} LMT
                    </div>
                  </div>
                  <div>
                    <div className="lbl">ENDS</div>
                    <div className="mono" style={{ fontSize: 13 }}>
                      {m.endsIn}
                    </div>
                  </div>
                </div>
                <span
                  className="row t-cyan"
                  style={{ fontSize: 12, fontFamily: "var(--mono)" }}
                >
                  OPEN <Icon name="arrowR" size={14} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
