"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { WALLETS } from "@/lib/mockData";
import { WalletProvider } from "@/lib/types";
import Icon from "./Icon";

interface WalletControlProps {
  compact?: boolean;
}

export default function WalletControl({ compact }: WalletControlProps) {
  const { state, connectWallet, disconnectWallet } = useApp();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<WalletProvider | null>(null);

  async function go(provider: WalletProvider) {
    setBusy(provider);
    await connectWallet(provider);
    setBusy(null);
    setOpen(false);
  }

  if (state.wallet) {
    return (
      <button
        className="btn sm"
        onClick={disconnectWallet}
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
          {state.wallet.address}
        </span>
      </button>
    );
  }

  return (
    <>
      <button
        className={"btn" + (compact ? " sm" : "")}
        onClick={() => setOpen(true)}
      >
        <Icon name="wallet" size={16} /> Connect
      </button>
      {open && (
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
            {WALLETS.map((p) => (
              <button
                key={p}
                className="wallet-opt"
                disabled={busy !== null}
                onClick={() => go(p)}
              >
                <span className="ico">{p[0]}</span>
                <span style={{ fontWeight: 500 }}>{p}</span>
                {busy === p ? (
                  <span className="spin" style={{ marginLeft: "auto" }} />
                ) : (
                  <Icon
                    name="chevR"
                    size={16}
                    style={{ marginLeft: "auto", color: "var(--mut)" }}
                  />
                )}
              </button>
            ))}
            <div className="lbl" style={{ textAlign: "center", marginTop: 8 }}>
              MOCK CONNECTION · NO REAL ASSETS
            </div>
          </div>
        </div>
      )}
    </>
  );
}
