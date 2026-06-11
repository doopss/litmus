"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { useApp } from "@/lib/store";
import { useLmtBalance } from "@/lib/useLmtBalance";
import Icon from "./Icon";
import WalletControl from "./WalletControl";
import Toast from "./Toast";

const NAV_ITEMS = [
  { href: "/", label: "Overview", icon: "home" as const, k: "1" },
  { href: "/dashboard", label: "Dashboard", icon: "grid" as const, k: "2" },
  { href: "/verify", label: "Verify", icon: "scan" as const, k: "3" },
  { href: "/market", label: "Markets", icon: "market" as const, k: "4" },
  { href: "/leaderboard", label: "Ranks", icon: "trophy" as const, k: "5" },
];

function topNavKey(pathname: string): string {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/dashboard")) return "dashboard";
  if (pathname.startsWith("/verify") || pathname.startsWith("/result"))
    return "verify";
  if (pathname.startsWith("/market")) return "markets";
  if (pathname.startsWith("/leaderboard")) return "leaderboard";
  return "home";
}

function navActive(href: string, top: string): boolean {
  if (href === "/") return top === "home";
  if (href === "/market") return top === "markets";
  return top === href.slice(1);
}

function Brand({ subtitle }: { subtitle?: boolean }) {
  return (
    <div className="brand">
      <div className="glyph" />
      <div className="wordmark">
        LITMUS
        {subtitle && <small>FORENSIC NET</small>}
      </div>
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state } = useApp();
  const { publicKey } = useWallet();
  const { lmtBalance, isLoading: lmtLoading } = useLmtBalance(publicKey);
  const top = topNavKey(pathname);

  return (
    <div className="stage">
      <div className="app">
        <aside className="sidebar">
          <Brand subtitle />
          <nav className="nav">
            {NAV_ITEMS.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={navActive(n.href, top) ? "on" : ""}
              >
                <Icon name={n.icon} size={18} /> {n.label}
                <span className="kbd">{n.k}</span>
              </Link>
            ))}
          </nav>
          <div className="sidefoot">
            <div className="panel" style={{ padding: 12, marginBottom: 10 }}>
              <div className="lbl" style={{ marginBottom: 4 }}>
                GAME LMT
              </div>
              <div className="num" style={{ fontSize: 19 }}>
                {state.balance.toLocaleString()}{" "}
                <span className="t-cyan" style={{ fontSize: 12 }}>
                  LMT
                </span>
              </div>
              <div className="lbl" style={{ marginTop: 10, marginBottom: 4 }}>
                WALLET LMT
              </div>
              <div className="num t-cyan" style={{ fontSize: 15 }}>
                {lmtLoading
                  ? "…"
                  : lmtBalance.toLocaleString(undefined, {
                      maximumFractionDigits: 4,
                    })}
              </div>
            </div>
            <WalletControl compact />
          </div>
        </aside>

        <div className="main">
          <header className="topbar">
            <Brand />
            <WalletControl compact />
          </header>
          <div className="content">{children}</div>
        </div>
      </div>

      <nav className="tabbar">
        {NAV_ITEMS.map((n) => (
            <Link key={n.href} href={n.href} className={navActive(n.href, top) ? "on" : ""}>
              <Icon name={n.icon} size={20} />
              {n.label}
            </Link>
        ))}
      </nav>
      <Toast />
    </div>
  );
}
