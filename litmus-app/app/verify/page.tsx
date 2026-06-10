"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { ANALYSIS_TAGS, runMockDetection } from "@/lib/mockData";
import Icon from "@/components/Icon";

const PHASES = [
  { id: "upload", label: "Uploading to storage", p: 30 },
  { id: "analyze", label: "Running detector model", p: 68 },
  { id: "chain", label: "Anchoring proof on-chain", p: 94 },
];

export default function VerifyPage() {
  const router = useRouter();
  const { addEarnings, setLastResult, showToast, state } = useApp();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [drag, setDrag] = useState(false);
  const [phase, setPhase] = useState(-1);
  const busy = phase >= 0;

  function toggle(t: string) {
    setTags((p) =>
      p.includes(t) ? p.filter((x) => x !== t) : [...p, t]
    );
  }

  async function submit() {
    if (!file && !url.trim()) {
      showToast("Add a file or URL first");
      return;
    }
    for (let i = 0; i < PHASES.length; i++) {
      setPhase(i);
      await new Promise((r) => setTimeout(r, i === 1 ? 1900 : 850));
    }
    const det = runMockDetection();
    const earnings = { base: 15, speed: 5, streak: 10, total: 30 };
    setLastResult({
      label: det.label,
      confidence: det.confidence,
      earnings,
      fileName: file ? file.name : url.trim(),
    });
    addEarnings(earnings.total, {
      kind: "verify",
      description: `Verified ${file ? file.name : "URL content"}`,
      reward: earnings.total,
    });
    setPhase(-1);
    router.push("/result");
  }

  return (
    <div className="content narrow fade" style={{ padding: 0, maxWidth: 720 }}>
      <div className="lbl" style={{ marginBottom: 6 }}>
        STEP 01 · SUBMIT EVIDENCE
      </div>
      <h1 style={{ fontSize: 26, marginBottom: 18 }}>Verify Content</h1>

      <div className="grid" style={{ gap: 14 }}>
        <div
          className="panel tick scan"
          onClick={() => !busy && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
          }}
          style={{
            borderStyle: "dashed",
            borderColor: drag
              ? "var(--cyan)"
              : file
                ? "var(--green)"
                : "var(--line2)",
            cursor: busy ? "default" : "pointer",
            padding: 30,
            textAlign: "center",
            background: drag
              ? "color-mix(in oklab,var(--cyan) 8%,var(--panel))"
              : "var(--panel)",
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="video/*,image/*"
            hidden
            onChange={(e) =>
              e.target.files?.[0] && setFile(e.target.files[0])
            }
          />
          {file ? (
            <div>
              <div
                style={{
                  width: 56,
                  height: 56,
                  margin: "0 auto 12px",
                  display: "grid",
                  placeItems: "center",
                  border: "1px solid var(--green)",
                  borderRadius: 8,
                  color: "var(--green)",
                }}
              >
                <Icon name="check" size={26} />
              </div>
              <div className="mono" style={{ fontSize: 13 }}>
                {file.name}
              </div>
              <div className="lbl" style={{ marginTop: 4 }}>
                {(file.size / 1048576).toFixed(1)} MB · READY
              </div>
              <button
                className="btn sm ghost"
                style={{ marginTop: 10, color: "var(--red)" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
              >
                REMOVE
              </button>
            </div>
          ) : (
            <div>
              <div
                style={{
                  width: 52,
                  height: 52,
                  margin: "0 auto 14px",
                  display: "grid",
                  placeItems: "center",
                  border: "1px solid var(--line2)",
                  borderRadius: 8,
                  color: "var(--cyan)",
                }}
              >
                <Icon name="upload" size={24} />
              </div>
              <div
                style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}
              >
                Drop a file or tap to browse
              </div>
              <div className="lbl">MP4 · MOV · WEBM · PNG · MAX 100MB</div>
            </div>
          )}
        </div>

        <div className="panel">
          <div className="panel-b">
            <div className="lbl" style={{ marginBottom: 8 }}>
              OR PASTE A SOURCE URL
            </div>
            <div className="row" style={{ gap: 8 }}>
              <Icon name="link" size={16} style={{ color: "var(--mut)" }} />
              <input
                className="field"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://tiktok.com/@…"
                style={{ flex: 1 }}
              />
            </div>
            <div className="lbl" style={{ margin: "16px 0 9px" }}>
              ANALYSIS FOCUS
            </div>
            <div className="row" style={{ flexWrap: "wrap", gap: 8 }}>
              {ANALYSIS_TAGS.map((t) => (
                <button
                  key={t}
                  onClick={() => toggle(t)}
                  className="chip"
                  style={{
                    minHeight: 34,
                    padding: "0 12px",
                    cursor: "pointer",
                    borderColor: tags.includes(t)
                      ? "var(--cyan)"
                      : "var(--line2)",
                    color: tags.includes(t) ? "var(--cyan)" : "var(--ink2)",
                    background: tags.includes(t)
                      ? "color-mix(in oklab,var(--cyan) 10%,transparent)"
                      : "var(--bg2)",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid g2">
          <div className="stat">
            <div className="row" style={{ gap: 8 }}>
              <Icon name="clock" size={16} style={{ color: "var(--cyan)" }} />
              <span className="num" style={{ fontSize: 18 }}>
                ~30s
              </span>
            </div>
            <div className="lbl" style={{ marginTop: 4 }}>
              ANALYSIS TIME
            </div>
          </div>
          <div className="stat">
            <div className="row" style={{ gap: 8 }}>
              <Icon name="coins" size={16} style={{ color: "var(--green)" }} />
              <span className="num t-green" style={{ fontSize: 18 }}>
                10–50
              </span>
            </div>
            <div className="lbl" style={{ marginTop: 4 }}>
              LMT REWARD
            </div>
          </div>
        </div>

        {busy && (
          <div className="panel tick up">
            <div className="panel-b">
              <div className="between" style={{ marginBottom: 12 }}>
                {PHASES.map((ph, i) => (
                  <div key={ph.id} style={{ flex: 1, textAlign: "center" }}>
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 9,
                        margin: "0 auto 6px",
                        background:
                          i < phase
                            ? "var(--green)"
                            : i === phase
                              ? "var(--cyan)"
                              : "var(--line2)",
                        boxShadow:
                          i === phase ? "0 0 12px var(--cyan)" : "none",
                        transition: ".3s",
                      }}
                    />
                    <span className="lbl">{ph.id}</span>
                  </div>
                ))}
              </div>
              <div className="meter">
                <span
                  style={{
                    width: PHASES[phase].p + "%",
                    background: "var(--cyan)",
                  }}
                />
              </div>
              <div
                className="lbl"
                style={{ textAlign: "center", marginTop: 10 }}
              >
                {PHASES[phase].label}…
              </div>
            </div>
          </div>
        )}

        <button
          className="btn cta block"
          disabled={busy}
          onClick={submit}
          style={{ padding: 15 }}
        >
          {busy ? (
            <>
              <span className="spin" /> PROCESSING…
            </>
          ) : (
            <>
              SUBMIT FOR VERIFICATION <Icon name="arrowR" size={16} />
            </>
          )}
        </button>
        <div className="lbl" style={{ textAlign: "center" }}>
          STREAK {state.stats.streak}d ACTIVE · BONUS APPLIED
        </div>
      </div>
    </div>
  );
}
