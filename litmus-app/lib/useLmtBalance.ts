"use client";

import { useCallback, useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

export function useLmtBalance(publicKey: PublicKey | null) {
  const { connection } = useConnection();
  const [lmtBalance, setLmtBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    const mint = process.env.NEXT_PUBLIC_LMT_MINT;
    if (!publicKey || !mint) {
      setLmtBalance(0);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const accounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        mint: new PublicKey(mint),
      });
      const total = accounts.value.reduce((sum, { account }) => {
        const ui = account.data.parsed.info.tokenAmount.uiAmount;
        return sum + (ui ?? 0);
      }, 0);
      setLmtBalance(total);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch LMT balance");
      setLmtBalance(0);
    } finally {
      setIsLoading(false);
    }
  }, [connection, publicKey]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { lmtBalance, isLoading, error, refetch };
}
