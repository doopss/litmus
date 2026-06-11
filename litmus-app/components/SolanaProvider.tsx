"use client";

import { useMemo, type ComponentType, type ReactNode } from "react";
import {
  ConnectionProvider,
  WalletProvider,
  type ConnectionProviderProps,
  type WalletProviderProps,
} from "@solana/wallet-adapter-react";
import { clusterApiUrl } from "@solana/web3.js";

const Conn = ConnectionProvider as ComponentType<ConnectionProviderProps>;
const Wallet = WalletProvider as ComponentType<WalletProviderProps>;

export default function SolanaProvider({ children }: { children: ReactNode }) {
  const endpoint = useMemo(
    () => process.env.NEXT_PUBLIC_SOLANA_RPC ?? clusterApiUrl("mainnet-beta"),
    []
  );

  return (
    <Conn endpoint={endpoint}>
      <Wallet wallets={[]} autoConnect>
        {children}
      </Wallet>
    </Conn>
  );
}
