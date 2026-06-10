"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { fmt } from "@/lib/mockData";
import Icon from "@/components/Icon";
import Sparkline from "@/components/Sparkline";

const NAMES = [
  "7xKp",
  "Bn3v",
  "9aQc",
  "Fd2k",
  "Lm5p",
  "Qw8r",
  "Zt2y",
  "Hk4n",
  "Vb6c",
  "Rp1s",
];

interface TapeEntry {
  id: string;
  who: string;
  side: "REAL" | "FAKE";
  amt: number;
  ago: string;
  you?: boolean;
}

function seedTape(realPct: number, marketId: string): TapeEntry[] {
  const out: TapeEntry[] = [];
  for (let i = 0; i < 7; i++) {
    const real = Math.random() < realPct / 100;
    out.push({
      id: "t" + i + marketId,
      who:
        NAMES[Math.floor(Math.random() * NAMES.length)] +
        "…" +
        Math.floor(Math.random() * 90 + 10),
      side: real ? "REAL" : "FAKE",
      amt: [25, 50, 75, 100, 150, 200, 250][
        Math.floor(Math.random() * 7)
      ],
      ago: i === 0 ? "now" : i + "m",
    });
  }
  return out;
}

function Read({
  l,
  v,
  cls = "",
  big,
}: {
  l: string;
  v: string;
  cls?: string;
  big?: boolean;
}) {
  return (
    <div className="between" style={{ padding: "7px 0" }}>
      <span className="lbl">{l}</span>
      <span className={"num " + cls} style={{ fontSize: big ? 22 : 14 }}>
        {v}
      </span>
    </div>
  );
}

export default function MarketDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { markets, state, placeBet, showToast } = useApp();
  const market = markets.find((m) => m.id === params.id) || markets[0];
  const balance = state.balance;

  const trackRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(0.5);
  const [placing, setPlacing] = useState(false);
  const [tape, setTape] = useState<TapeEntry[]>(() =>
    seedTape(market.realPct, market.id)
  );

  useEffect(() => {
    setPos(0.5);
    setTape(seedTape(market.realPct, market.id));
  }, [params.id, market.realPct, market.id]);

  const DEAD = 0.04;
  const side =
    pos < 0.5 - DEAD ? "FAKE" : pos > 0.5 + DEAD ? "REAL" : null;
  const conviction = side
    ? Math.min(
        1,
        side === "REAL"
          ? (pos - (0.5 + DEAD)) / (0.5 - DEAD)
          : (0.5 - DEAD - pos) / (0.5 - DEAD)
      )
    : 0;
  const stake = side
    ? Math.min(balance, Math.round((conviction * balance) / 5) * 5)
    : 0;
  const oddsPct =
    side === "REAL"
      ? market.realPct
      : side === "FAKE"
        ? 100 - market.realPct
        : 0;
  const payout =
    stake > 0 && oddsPct > 0 ? Math.floor(stake * (100 / oddsPct)) : 0;
  const profit = payout - stake;
  const mult = oddsPct > 0 ? 100 / oddsPct : 0;

  function setFromClientX(clientX: number) {
    const el = trackRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = (clientX - r.left) / r.width;
    setPos(Math.max(0, Math.min(1, p)));
  }

  function snapSide(s: "REAL" | "FAKE") {
    setPos(s === "REAL" ? 0.78 : 0.22);
  }

  function setStakeAbs(amt: number) {
    const s = side || "FAKE";
    const c = Math.min(1, amt / balance);
    setPos(
      s === "REAL"
        ? 0.5 + DEAD + c * (0.5 - DEAD)
        : 0.5 - DEAD - c * (0.5 - DEAD)
    );
  }

  async function bet() {
    if (!side) {
      showToast("Drag the dial toward REAL or FAKE");
      return;
    }
    if (stake < 5) {
      showToast("Increase your conviction — min 5 LMT");
      return;
    }
    if (stake > balance) {
      showToast("Insufficient balance");
      return;
    }
    setPlacing(true);
    await new Promise((r) => setTimeout(r, 1200));
    placeBet(market, side, stake);
    setTape((t) =>
      [
        {
          id: "u" + Date.now(),
          who: "you",
          side: side as "REAL" | "FAKE",
          amt: stake,
          ago: "now",
          you: true,
        },
        ...t,
      ].slice(0, 9)
    );
    setPlacing(false);
    setPos(0.5);
    showToast(`Bet locked · ${stake} LMT on ${side}`);
  }

  const delta =
    market.history[market.history.length - 1] - market.history[0];

  return (
    <div className="fade">
      <Link
        href="/market"
        className="row mut"
        style={{
          fontSize: 12.5,
          fontFamily: "var(--mono)",
          marginBottom: 16,
        }}
      >
        <Icon name="arrowL" size={15} /> ALL MARKETS
      </Link>

      <div
        className="grid"
        style={{
          gridTemplateColumns: "minmax(0,1fr) 320px",
          alignItems: "start",
        }}
        id="mkt-grid"
      >
        <div className="grid" style={{ gap: 14 }}>
          <div className="panel tick">
            <div className="panel-b">
              <div
                className="between"
                style={{ alignItems: "flex-start", marginBottom: 14 }}
              >
                <div>
                  <div className="row" style={{ gap: 8, marginBottom: 8 }}>
                    <span className="chip red">{market.tag}</span>
                    <span className="chip">
                      <Icon name="clock" size={11} />
                      {market.endsIn}
                    </span>
                  </div>
                  <h1 style={{ fontSize: 24, marginBottom: 6 }}>
                    {market.subject}
                  </h1>
                  <p
                    className="dim"
                    style={{ fontSize: 13.5, margin: 0, maxWidth: 460 }}
                  >
                    {market.claim}
                  </p>
                  <div className="lbl" style={{ marginTop: 10 }}>
                    SOURCE · {market.source}
                  </div>
                </div>
              </div>
              <div className="media scan" style={{ height: 150 }}>
                <div className="crosshair" />
                <span className="ml">
                  EVIDENCE FRAME · {market.id.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-h">
              <span className="lbl">CROWD BELIEF · REAL %</span>
              <span className="mono" style={{ fontSize: 12 }}>
                <span className={delta >= 0 ? "t-green" : "t-red"}>
                  {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}pt
                </span>
                <span className="mut"> / 10h</span>
              </span>
            </div>
            <div className="panel-b">
              <div className="between" style={{ alignItems: "flex-end" }}>
                <div>
                  <div
                    className="num t-green"
                    style={{ fontSize: 34, lineHeight: 1 }}
                  >
                    {market.realPct}
                    <span style={{ fontSize: 16 }}>%</span>
                  </div>
                  <div className="lbl" style={{ marginTop: 4 }}>
                    SAY AUTHENTIC
                  </div>
                </div>
                <Sparkline
                  data={market.history}
                  w={150}
                  h={64}
                  stroke="var(--cyan)"
                  fill="color-mix(in oklab,var(--cyan) 12%,transparent)"
                  dot
                />
                <div style={{ textAlign: "right" }}>
                  <div
                    className="num t-red"
                    style={{ fontSize: 34, lineHeight: 1 }}
                  >
                    {100 - market.realPct}
                    <span style={{ fontSize: 16 }}>%</span>
                  </div>
                  <div className="lbl" style={{ marginTop: 4 }}>
                    SAY FAKE
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="panel tick">
            <div className="panel-h">
              <span className="lbl">CONVICTION DIAL</span>
              <span className="lbl">DRAG TO STAKE</span>
            </div>
            <div className="panel-b">
              <div
                ref={trackRef}
                className={"conv" + (side ? " side-" + side : "")}
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  setFromClientX(e.clientX);
                }}
                onPointerMove={(e) => {
                  if (e.buttons || e.pressure) setFromClientX(e.clientX);
                }}
              >
                <div className="edge l">FAKE</div>
                <div className="edge r">REAL</div>
                <div className="ctr" />
                <div className="puck" style={{ left: pos * 100 + "%" }}>
                  <Icon
                    name={
                      side === "REAL"
                        ? "check"
                        : side === "FAKE"
                          ? "x"
                          : "target"
                    }
                    size={18}
                    style={{
                      color:
                        side === "REAL"
                          ? "var(--green)"
                          : side === "FAKE"
                            ? "var(--red)"
                            : "var(--mut)",
                    }}
                  />
                </div>
              </div>

              <div className="between" style={{ marginTop: 14 }}>
                <button
                  className="btn red sm"
                  style={{ opacity: side === "FAKE" ? 1 : 0.8 }}
                  onClick={() => snapSide("FAKE")}
                >
                  <Icon name="x" size={14} /> CALL FAKE
                </button>
                <div style={{ textAlign: "center" }}>
                  <div className="lbl">CONVICTION</div>
                  <div className="num" style={{ fontSize: 18 }}>
                    {Math.round(conviction * 100)}%
                  </div>
                </div>
                <button
                  className="btn green sm"
                  style={{ opacity: side === "REAL" ? 1 : 0.8 }}
                  onClick={() => snapSide("REAL")}
                >
                  CALL REAL <Icon name="check" size={14} />
                </button>
              </div>

              <div
                className="row"
                style={{ gap: 8, marginTop: 14, flexWrap: "wrap" }}
              >
                {[50, 100, 250].map((a) => (
                  <button
                    key={a}
                    className="btn sm"
                    disabled={a > balance}
                    onClick={() => setStakeAbs(a)}
                  >
                    {a}
                  </button>
                ))}
                <button
                  className="btn sm"
                  onClick={() => setStakeAbs(balance)}
                >
                  MAX
                </button>
                <button
                  className="btn ghost sm"
                  onClick={() => setPos(0.5)}
                  style={{ marginLeft: "auto" }}
                >
                  RESET
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid" style={{ gap: 14 }} id="mkt-side">
          <div className="panel tick">
            <div className="panel-h">
              <span className="lbl">ORDER TICKET</span>
            </div>
            <div className="panel-b" style={{ display: "grid", gap: 0 }}>
              <Read
                l="POSITION"
                v={side || "—"}
                cls={
                  side === "REAL"
                    ? "t-green"
                    : side === "FAKE"
                      ? "t-red"
                      : "mut"
                }
              />
              <Read l="ENTRY ODDS" v={side ? oddsPct + "%" : "—"} />
              <Read
                l="PAYOUT MULT"
                v={side ? mult.toFixed(2) + "×" : "—"}
              />
              <Read l="STAKE" v={stake ? fmt(stake) + " LMT" : "—"} />
              <div
                style={{
                  height: 1,
                  background: "var(--line)",
                  margin: "8px 0",
                }}
              />
              <Read
                l="TO WIN"
                v={payout ? fmt(payout) + " LMT" : "—"}
                cls="t-green"
                big
              />
              <Read
                l="PROFIT"
                v={profit > 0 ? "+" + fmt(profit) : "—"}
                cls="t-green"
              />
              <button
                className="btn cta block"
                style={{ marginTop: 14 }}
                disabled={placing || !side}
                onClick={bet}
              >
                {placing ? (
                  <>
                    <span className="spin" /> LOCKING…
                  </>
                ) : (
                  <>
                    LOCK BET <Icon name="shield" size={15} />
                  </>
                )}
              </button>
              <div
                className="lbl"
                style={{
                  textAlign: "center",
                  marginTop: 10,
                  lineHeight: 1.6,
                }}
              >
                BALANCE {fmt(balance)} LMT · SETTLES ON RESOLUTION
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-h">
              <span className="lbl">LIVE TAPE</span>
              <span className="chip cyan">
                <span className="dot" />
                FEED
              </span>
            </div>
            <div style={{ maxHeight: 240, overflow: "auto" }}>
              {tape.map((t) => (
                <div
                  key={t.id}
                  className="tbl-row"
                  style={{ fontFamily: "var(--mono)", fontSize: 12 }}
                >
                  <span
                    className={
                      "mono " + (t.side === "REAL" ? "t-green" : "t-red")
                    }
                    style={{ width: 36 }}
                  >
                    {t.side === "REAL" ? "BUY" : "SEL"}
                  </span>
                  <span className="dim" style={{ flex: 1 }}>
                    {t.you ? "you" : t.who}
                  </span>
                  <span className="num">{t.amt}</span>
                  <span
                    className="mut"
                    style={{ width: 30, textAlign: "right" }}
                  >
                    {t.ago}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel-b panel" style={{ fontSize: 12 }}>
            <div className="row" style={{ gap: 8, color: "var(--ink2)" }}>
              <Icon name="info" size={15} style={{ color: "var(--cyan)" }} />
              <span>
                <b style={{ color: "var(--ink)" }}>
                  {100 - market.realPct}%
                </b>{" "}
                of hunters call this FAKE. Contrarian positions pay{" "}
                <b className="t-green">
                  {(100 / Math.max(market.realPct, 1)).toFixed(1)}×
                </b>{" "}
                if authentic.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
