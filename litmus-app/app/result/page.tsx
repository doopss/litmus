"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import CountUp from "@/components/CountUp";
import Icon from "@/components/Icon";

const FALLBACK_RESULT = {
  label: "FAKE" as const,
  confidence: 94,
  earnings: { base: 15, speed: 5, streak: 10, total: 30 },
  fileName: "elon-mars.mp4",
};

export default function ResultPage() {
  const { state, markets, showToast } = useApp();
  const r = state.lastResult ?? FALLBACK_RESULT;
  const fake = r.label === "FAKE";
  const col = fake ? "var(--red)" : "var(--green)";
  const [conf, setConf] = useState(0);

  useEffect(() => {
    let c = 0;
    const t = setInterval(() => {
      c += 2;
      if (c >= r.confidence) {
        c = r.confidence;
        clearInterval(t);
      }
      setConf(c);
    }, 18);
    const s = setTimeout(() => {
      clearInterval(t);
      setConf(r.confidence);
    }, 1400);
    return () => {
      clearInterval(t);
      clearTimeout(s);
    };
  }, [r.confidence]);

  async function share() {
    try {
      await navigator.clipboard.writeText(
        `Caught a ${r.label} on Litmus · ${r.confidence}% confidence · +${r.earnings.total} LMT`
      );
    } catch {
      // clipboard unavailable
    }
    showToast("Result copied to clipboard");
  }

  const related = markets.slice(1, 3);

  return (
    <div
      className="content narrow fade"
      style={{ padding: 0, maxWidth: 640, textAlign: "center" }}
    >
      <div className="chip cyan" style={{ margin: "0 auto 18px" }}>
        <Icon name="shield" size={12} />
        VERIFICATION COMPLETE · ANCHORED
      </div>
      <div
        className="ring"
        style={{
          border: "1px solid var(--line)",
          background:
            "radial-gradient(circle at 50% 40%, " +
            (fake
              ? "color-mix(in oklab,var(--red) 14%,transparent)"
              : "color-mix(in oklab,var(--green) 14%,transparent)") +
            ", transparent 70%)",
        }}
      >
        <svg
          width="168"
          height="168"
          viewBox="0 0 168 168"
          style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}
        >
          <circle
            cx="84"
            cy="84"
            r="76"
            fill="none"
            stroke="var(--line)"
            strokeWidth="3"
          />
          <circle
            cx="84"
            cy="84"
            r="76"
            fill="none"
            stroke={col}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 76}
            strokeDashoffset={2 * Math.PI * 76 * (1 - conf / 100)}
            style={{ transition: "stroke-dashoffset .1s linear" }}
          />
        </svg>
        <div>
          <div className="verdict" style={{ fontSize: 30, color: col }}>
            {r.label}
          </div>
          <div className="num" style={{ fontSize: 22 }}>
            {conf}%
          </div>
          <div className="lbl" style={{ marginTop: 2 }}>
            CONFIDENCE
          </div>
        </div>
      </div>
      <p className="dim" style={{ fontSize: 13.5, margin: "20px 0 24px" }}>
        Detector flagged{" "}
        <span className="mono" style={{ color: "var(--ink)" }}>
          {r.fileName}
        </span>{" "}
        as{" "}
        <b style={{ color: col }}>{r.label}</b>. Proof recorded on-chain.
      </p>

      <div className="panel" style={{ textAlign: "left", marginBottom: 14 }}>
        <div className="panel-h">
          <span className="lbl">EARNINGS BREAKDOWN</span>
        </div>
        <div className="panel-b" style={{ display: "grid", gap: 0 }}>
          {(
            [
              ["Base reward", r.earnings.base, ""],
              ["Speed bonus", r.earnings.speed, "t-green"],
              ["Streak bonus", r.earnings.streak, "t-green"],
            ] as const
          ).map((x) => (
            <div className="between" key={x[0]} style={{ padding: "7px 0" }}>
              <span className="dim" style={{ fontSize: 13.5 }}>
                {x[0]}
              </span>
              <span className={"num " + x[2]} style={{ fontSize: 14 }}>
                +{x[1]} LMT
              </span>
            </div>
          ))}
          <div
            className="between"
            style={{
              padding: "12px 0 2px",
              borderTop: "1px solid var(--line)",
              marginTop: 6,
            }}
          >
            <span style={{ fontWeight: 600 }}>Total earned</span>
            <span className="num t-cyan" style={{ fontSize: 22 }}>
              <CountUp
                target={r.earnings.total}
                prefix="+"
                suffix=" LMT"
              />
            </span>
          </div>
        </div>
      </div>

      <div className="panel" style={{ textAlign: "left", marginBottom: 16 }}>
        <div className="panel-h">
          <span className="lbl">RELATED MARKETS</span>
        </div>
        {related.map((m) => (
          <Link
            key={m.id}
            href={`/market/${m.id}`}
            className="tbl-row"
            style={{ width: "100%", textAlign: "left" }}
          >
            <span style={{ flex: 1, fontSize: 14 }}>{m.subject}</span>
            <span className="mono t-red" style={{ fontSize: 12 }}>
              {100 - m.realPct}% FAKE
            </span>
            <Icon name="arrowR" size={15} style={{ color: "var(--cyan)" }} />
          </Link>
        ))}
      </div>

      <div className="grid g2">
        <button className="btn" onClick={share}>
          <Icon name="share" size={16} /> Share
        </button>
        <Link href="/verify" className="btn cta">
          Keep earning <Icon name="arrowR" size={16} />
        </Link>
      </div>
    </div>
  );
}
