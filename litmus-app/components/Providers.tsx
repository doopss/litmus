"use client";

import type { ReactNode } from "react";
import { AppProvider } from "@/lib/store";
import SolanaProvider from "./SolanaProvider";
import WalletStoreSync from "./WalletStoreSync";
import AppShell from "./AppShell";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SolanaProvider>
      <AppProvider>
        <WalletStoreSync />
        <AppShell>{children}</AppShell>
      </AppProvider>
    </SolanaProvider>
  );
}
