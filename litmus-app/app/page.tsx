"use client";

import Link from "next/link";
import CountUp from "@/components/CountUp";

const FEATURES = [
  {
    icon: "⚡️",
    title: "Verify & Earn",
    desc: "Upload suspicious videos and earn 10–50 LMT per verification.",
    href: "/verify",
  },
  {
    icon: "🎲",
    title: "Bet & Win",
    desc: "Predict REAL or FAKE on hot markets and multiply your LMT.",
    href: "/market",
  },
  {
    icon: "🏆",
    title: "Compete",
    desc: "Climb weekly rankings and unlock bonus rewards.",
    href: "/leaderboard",
  },
];

export default function LandingPage() {
  return (
    <div className="animate-fade-in">
      <header className="flex items-center justify-between border-b border-litmus-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-litmus-accent text-sm font-bold">
            L
          </div>
          <span className="text-lg font-bold">Litmus</span>
        </div>
        <Link
          href="/dashboard"
          className="touch-target flex items-center px-3 text-sm font-medium text-litmus-accent"
        >
          Sign In
        </Link>
      </header>

      {/* Hero */}
      <div className="px-4 py-8 text-center">
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-litmus-border bg-litmus-surface px-3 py-1 text-xs text-litmus-muted">
          <span className="h-2 w-2 animate-pulse-slow rounded-full bg-litmus-green" />
          Live on Solana
        </div>
        <h1 className="mb-3 text-3xl font-extrabold leading-tight">
          Get Paid to
          <br />
          <span className="bg-cta-gradient bg-clip-text text-transparent">
            Catch Fakes
          </span>
        </h1>
        <p className="mx-auto mb-6 max-w-xs text-sm text-litmus-muted">
          Verify deepfakes, bet on authenticity, and climb the leaderboard.
          Earn LMT tokens for every catch.
        </p>
        <Link
          href="/dashboard"
          className="touch-target mb-3 block w-full rounded-card cta-gradient py-4 text-base font-semibold text-black transition-transform active:scale-[0.98]"
        >
          Start Earning — It&apos;s Free
        </Link>
        <Link
          href="/verify"
          className="touch-target block w-full rounded-card border border-litmus-border py-3 text-sm text-litmus-muted transition-colors hover:border-litmus-accent hover:text-white"
        >
          See How It Works
        </Link>
      </div>

      {/* Stats Bar */}
      <div className="card mx-4 mb-6 p-4">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-lg font-bold text-litmus-accent">
              <CountUp target={12847} />
            </p>
            <p className="text-[10px] uppercase tracking-wide text-litmus-muted">
              Earning Today
            </p>
          </div>
          <div className="border-x border-litmus-border">
            <p className="text-lg font-bold text-litmus-green">
              <CountUp target={48} prefix="$" suffix="K" />
            </p>
            <p className="text-[10px] uppercase tracking-wide text-litmus-muted">
              Paid Out
            </p>
          </div>
          <div>
            <p className="text-lg font-bold">
              <CountUp
                target={2.4}
                suffix="M"
                format={(n) => n.toFixed(1)}
              />
            </p>
            <p className="text-[10px] uppercase tracking-wide text-litmus-muted">
              Fakes Caught
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid gap-3 px-4">
        {FEATURES.map((f, i) => (
          <Link
            key={f.title}
            href={f.href}
            className="card flex animate-slide-up items-start gap-3 p-4 transition-colors hover:border-litmus-accent/50"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-litmus-accent/20 text-lg">
              {f.icon}
            </div>
            <div>
              <h3 className="mb-0.5 text-sm font-semibold">{f.title}</h3>
              <p className="text-xs text-litmus-muted">{f.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Testimonial */}
      <div className="mx-4 my-6 rounded-card border border-litmus-accent/30 bg-gradient-to-br from-litmus-accent/10 to-transparent p-4">
        <p className="mb-3 text-sm italic text-litmus-muted">
          &quot;I earned 2,400 LMT in my first week just verifying TikToks.
          Litmus changed how I think about media.&quot;
        </p>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-litmus-accent text-xs font-bold">
            DK
          </div>
          <div>
            <p className="text-xs font-semibold">@deepfakekiller</p>
            <p className="text-[10px] text-litmus-muted">Top 5% Hunter</p>
          </div>
        </div>
      </div>
    </div>
  );
}
