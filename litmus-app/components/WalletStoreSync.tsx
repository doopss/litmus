"use client";

import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useApp } from "@/lib/store";
import { WalletProvider } from "@/lib/types";

const PROVIDERS: WalletProvider[] = ["Phantom", "Solflare", "Backpack"];

function truncateAddress(base58: string): string {
  return base58.slice(0, 4) + "…" + base58.slice(-4);
}

function toProvider(name: string | undefined): WalletProvider | null {
  if (PROVIDERS.includes(name as WalletProvider)) {
    return name as WalletProvider;
  }
  return null;
}

export default function WalletStoreSync() {
  const { publicKey, connected, wallet } = useWallet();
  const { syncWallet } = useApp();

  useEffect(() => {
    if (connected && publicKey && wallet) {
      const provider = toProvider(wallet.adapter.name);
      if (provider) {
        syncWallet({
          address: truncateAddress(publicKey.toBase58()),
          provider,
        });
        return;
      }
    }
    syncWallet(null);
  }, [connected, publicKey, wallet, syncWallet]);

  return null;
}
