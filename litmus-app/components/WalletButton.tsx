"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { WalletProvider } from "@/lib/types";

const WALLETS: { provider: WalletProvider; icon: string }[] = [
  { provider: "Phantom", icon: "👻" },
  { provider: "Solflare", icon: "🔆" },
  { provider: "Backpack", icon: "🎒" },
];

export default function WalletButton() {
  const { state, connectWallet, disconnectWallet } = useApp();
  const [open, setOpen] = useState(false);
  const [connecting, setConnecting] = useState<WalletProvider | null>(null);

  async function handleConnect(provider: WalletProvider) {
    setConnecting(provider);
    await connectWallet(provider);
    setConnecting(null);
    setOpen(false);
  }

  if (state.wallet) {
    return (
      <button
        onClick={disconnectWallet}
        className="touch-target rounded-lg border border-litmus-green/60 bg-litmus-surface px-3 py-2 text-xs text-litmus-green transition-colors hover:border-litmus-danger hover:text-litmus-danger"
        title="Tap to disconnect"
      >
        {state.wallet.address}
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="touch-target rounded-lg border border-litmus-border bg-litmus-surface px-3 py-2 text-xs transition-colors hover:border-litmus-accent"
      >
        Connect Wallet
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="w-full max-w-[480px] animate-slide-up rounded-t-2xl bg-litmus-surface p-5 pb-8">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Connect Wallet</h3>
              <button
                onClick={() => setOpen(false)}
                className="touch-target flex min-w-[44px] items-center justify-center text-litmus-muted hover:text-white"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              {WALLETS.map(({ provider, icon }) => (
                <button
                  key={provider}
                  onClick={() => handleConnect(provider)}
                  disabled={connecting !== null}
                  className="touch-target flex w-full items-center gap-3 rounded-card border border-litmus-border bg-litmus-bg p-4 transition-colors hover:border-litmus-accent disabled:opacity-50"
                >
                  <span className="text-2xl">{icon}</span>
                  <span className="font-medium">{provider}</span>
                  {connecting === provider && (
                    <span className="loading-spinner ml-auto h-5 w-5" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
