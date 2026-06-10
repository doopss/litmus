"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { RELATED_MARKETS } from "@/lib/mockData";
import Confetti from "@/components/Confetti";
import CountUp from "@/components/CountUp";

const FALLBACK_RESULT = {
  label: "FAKE" as const,
  confidence: 94,
  earnings: { base: 15, speed: 5, streak: 10, total: 30 },
  fileName: "elon-mars-video.mp4",
};

export default function ResultPage() {
  const { state, hydrated, showToast } = useApp();
  const [confidence, setConfidence] = useState(0);

  const result = state.lastResult ?? FALLBACK_RESULT;
  const isFake = result.label === "FAKE";

  useEffect(() => {
    if (!hydrated) return;
    const target = result.confidence;
    const timer = setTimeout(() => {
      let c = 0;
      const interval = setInterval(() => {
        c += 2;
        if (c >= target) {
          c = target;
          clearInterval(interval);
        }
        setConfidence(c);
      }, 20);
    }, 400);
    return () => clearTimeout(timer);
  }, [hydrated, result.confidence]);

  async function share() {
    const text = `I just caught a ${result.label} on @LitmusProtocol with ${result.confidence}% confidence! Earned +${result.earnings.total} LMT 🎯`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // clipboard unavailable — toast still confirms
    }
    showToast("Results copied to clipboard!");
  }

  return (
    <div className="animate-fade-in">
      <Confetti />

      <div className="space-y-5 px-4 py-6 text-center">
        {/* Celebration */}
        <div className="animate-scale-in text-5xl">🎉</div>
        <div>
          <h1 className="mb-1 text-2xl font-extrabold">
            Verification Complete!
          </h1>
          <p className="text-sm text-litmus-muted">
            Your analysis has been recorded on-chain
          </p>
        </div>

        {/* Result Circle */}
        <div
          className={`mx-auto flex h-36 w-36 animate-scale-in flex-col items-center justify-center rounded-full border-4 ${
            isFake
              ? "border-litmus-danger bg-litmus-danger/10"
              : "border-litmus-green bg-litmus-green/10"
          }`}
          style={{ animationDelay: "200ms" }}
        >
          <span
            className={`text-2xl font-extrabold ${
              isFake ? "text-litmus-danger" : "text-litmus-green"
            }`}
          >
            {result.label}
          </span>
          <span className="mt-1 text-lg font-bold">{confidence}%</span>
          <span className="text-[10px] text-litmus-muted">confidence</span>
        </div>

        {/* Confidence Bar */}
        <div className="card mx-auto max-w-xs p-4">
          <p className="mb-1 text-xs text-litmus-muted">Confidence Score</p>
          <div className="h-2 overflow-hidden rounded-full bg-litmus-bg">
            <div
              className={`h-full transition-all duration-300 ${
                isFake ? "bg-litmus-danger" : "bg-litmus-green"
              }`}
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>

        {/* Earnings Breakdown */}
        <div className="card p-4 text-left">
          <h3 className="mb-3 text-center text-sm font-semibold">
            Earnings Breakdown
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-litmus-muted">Base Reward</span>
              <span>+{result.earnings.base} LMT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-litmus-muted">Speed Bonus</span>
              <span className="text-litmus-green">
                +{result.earnings.speed} LMT
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-litmus-muted">Streak Bonus</span>
              <span className="text-litmus-green">
                +{result.earnings.streak} LMT
              </span>
            </div>
            <div className="flex justify-between border-t border-litmus-border pt-2 font-bold">
              <span>Total Earned</span>
              <span className="text-lg text-litmus-accent">
                <CountUp
                  target={result.earnings.total}
                  duration={1200}
                  prefix="+"
                  suffix=" LMT"
                />
              </span>
            </div>
          </div>
        </div>

        {/* Related Markets */}
        <div className="text-left">
          <h3 className="mb-2 text-sm font-semibold">Related Markets</h3>
          <div className="space-y-2">
            {RELATED_MARKETS.map((m) => (
              <Link
                key={m.title}
                href="/market"
                className="card flex items-center justify-between p-3 transition-colors hover:border-litmus-accent/50"
              >
                <span className="text-sm font-medium">{m.title}</span>
                <span className="text-xs text-litmus-danger">
                  FAKE {m.fakePct}%
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={share}
            className="touch-target rounded-card border border-litmus-border py-3 text-sm font-semibold transition-colors hover:border-litmus-accent"
          >
            📤 Share
          </button>
          <Link
            href="/verify"
            className="touch-target flex items-center justify-center rounded-card cta-gradient py-3 text-sm font-semibold text-black transition-transform active:scale-[0.98]"
          >
            Keep Earning
          </Link>
        </div>
      </div>
    </div>
  );
}
