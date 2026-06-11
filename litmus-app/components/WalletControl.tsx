"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletReadyState, type WalletName } from "@solana/wallet-adapter-base";
import Icon from "./Icon";
import { WalletProvider } from "@/lib/types";

const SUPPORTED: WalletProvider[] = ["Phantom", "Solflare", "Backpack"];

interface WalletControlProps {
  compact?: boolean;
}

function truncateAddress(base58: string): string {
  return base58.slice(0, 4) + "…" + base58.slice(-4);
}

export default function WalletControl({ compact }: WalletControlProps) {
  const { wallets, select, connect, disconnect, connected, connecting, publicKey } =
    useWallet();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<WalletProvider | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const available = useMemo(
    () =>
      SUPPORTED.map((name) => {
        const entry = wallets.find((w) => w.adapter.name === name);
        return {
          name,
          ready:
            entry?.readyState === WalletReadyState.Installed ||
            entry?.readyState === WalletReadyState.Loadable,
        };
      }).filter((w) => w.ready),
    [wallets]
  );

  async function go(provider: WalletProvider) {
    setBusy(provider);
    try {
      select(provider as WalletName);
      await connect();
      setOpen(false);
    } catch {
      // user rejected or wallet unavailable — sheet stays open
    } finally {
      setBusy(null);
    }
  }

  async function handleDisconnect() {
    try {
      await disconnect();
    } catch {
      // ignore disconnect errors
    }
  }

  if (connected && publicKey) {
    return (
      <button
        className="btn sm"
        onClick={handleDisconnect}
        title="Disconnect"
        style={{
          borderColor: "color-mix(in oklab,var(--green) 45%,transparent)",
          color: "var(--green)",
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: 9,
            background: "var(--green)",
          }}
        />
        <span className="mono" style={{ fontSize: 12 }}>
          {truncateAddress(publicKey.toBase58())}
        </span>
      </button>
    );
  }

  return (
    <>
      <button
        className={"btn" + (compact ? " sm" : "")}
        onClick={() => setOpen(true)}
        disabled={connecting}
      >
        {connecting ? (
          <span className="spin" />
        ) : (
          <>
            <Icon name="wallet" size={16} /> Connect
          </>
        )}
      </button>
      {open &&
        mounted &&
        createPortal(
          <div
            className="sheet-wrap"
            onClick={(e) => e.target === e.currentTarget && setOpen(false)}
          >
            <div className="sheet">
              <div className="between" style={{ marginBottom: 18 }}>
                <div>
                  <div className="lbl" style={{ marginBottom: 5 }}>
                    CONNECT
                  </div>
                  <h3 style={{ fontSize: 18 }}>Select a wallet</h3>
                </div>
                <button className="btn sm ghost" onClick={() => setOpen(false)}>
                  <Icon name="x" size={16} />
                </button>
              </div>
              {available.length === 0 ? (
                <p
                  className="dim"
                  style={{ fontSize: 13, textAlign: "center", margin: "12px 0" }}
                >
                  No supported wallet detected. Install Phantom, Solflare, or
                  Backpack.
                </p>
              ) : (
                available.map(({ name }) => (
                  <button
                    key={name}
                    className="wallet-opt"
                    disabled={busy !== null}
                    onClick={() => go(name)}
                  >
                    <span className="ico">{name[0]}</span>
                    <span style={{ fontWeight: 500 }}>{name}</span>
                    {busy === name ? (
                      <span className="spin" style={{ marginLeft: "auto" }} />
                    ) : (
                      <Icon
                        name="chevR"
                        size={16}
                        style={{ marginLeft: "auto", color: "var(--mut)" }}
                      />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
