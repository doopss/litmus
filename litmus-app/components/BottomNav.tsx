"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/dashboard", label: "Dash", icon: "📊" },
  { href: "/verify", label: "Verify", icon: "🔍" },
  { href: "/market", label: "Market", icon: "🎲" },
  { href: "/leaderboard", label: "Ranks", icon: "🏆" },
  { href: "/result", label: "Result", icon: "🎉" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-[480px] border-t border-litmus-border bg-litmus-surface">
      <div className="flex h-[72px] items-center justify-around px-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`touch-target flex min-w-[44px] flex-col items-center justify-center gap-0.5 px-2 transition-colors ${
                active ? "text-litmus-accent" : "text-litmus-muted hover:text-white"
              }`}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
