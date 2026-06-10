"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { ANALYSIS_TAGS, runMockDetection } from "@/lib/mockData";

type Phase = "idle" | "uploading" | "analyzing" | "verifying";

const PHASE_LABELS: Record<Exclude<Phase, "idle">, string> = {
  uploading: "Uploading to storage...",
  analyzing: "Running AI analysis...",
  verifying: "Verifying on-chain...",
};

const PHASE_PROGRESS: Record<Exclude<Phase, "idle">, number> = {
  uploading: 30,
  analyzing: 65,
  verifying: 92,
};

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export default function VerifyPage() {
  const router = useRouter();
  const { addEarnings, setLastResult, showToast, state } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");

  const busy = phase !== "idle";

  function toggleTag(tag: string) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function handleFile(f: File | undefined) {
    if (f) setFile(f);
  }

  async function submit() {
    if (!file && !url.trim()) {
      showToast("Upload a file or paste a URL first");
      return;
    }

    setPhase("uploading");
    await delay(900);
    setPhase("analyzing");
    await delay(2000);
    setPhase("verifying");
    await delay(900);

    const detection = runMockDetection();
    const earnings = { base: 15, speed: 5, streak: 10, total: 30 };

    setLastResult({
      label: detection.label,
      confidence: detection.confidence,
      earnings,
      fileName: file ? file.name : url.trim(),
    });
    addEarnings(earnings.total, {
      icon: "🔍",
      description: `Verified ${file ? file.name : "URL content"}`,
      reward: earnings.total,
    });

    setPhase("idle");
    showToast(`Verification complete! +${earnings.total} LMT`);
    router.push("/result");
  }

  return (
    <div className="animate-fade-in">
      <header className="flex items-center justify-between border-b border-litmus-border px-4 py-3">
        <Link
          href="/dashboard"
          className="touch-target flex min-w-[44px] items-center text-litmus-muted hover:text-white"
        >
          ←
        </Link>
        <span className="font-bold">Verify Content</span>
        <div className="w-11" />
      </header>

      <div className="space-y-4 px-4 py-4">
        {/* Upload Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFile(e.dataTransfer.files[0]);
          }}
          className={`cursor-pointer rounded-card border-2 border-dashed p-8 text-center transition-all ${
            dragOver
              ? "border-litmus-accent bg-litmus-accent/10"
              : file
                ? "border-litmus-green"
                : "border-litmus-border"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*,image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          {file ? (
            <div>
              <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-card bg-litmus-bg text-2xl">
                {file.type.startsWith("image") ? "🖼️" : "🎬"}
              </div>
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-litmus-muted">
                {(file.size / 1048576).toFixed(1)} MB
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="touch-target mt-1 text-xs text-litmus-danger"
              >
                Remove
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-3 text-4xl">📎</div>
              <p className="mb-1 text-sm font-medium">
                Drag &amp; drop or tap to upload
              </p>
              <p className="text-xs text-litmus-muted">
                MP4, MOV, WebM · Max 100MB
              </p>
            </div>
          )}
        </div>

        {/* URL Input */}
        <div>
          <label className="mb-1.5 block text-xs text-litmus-muted">
            Or paste a URL
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://tiktok.com/..."
            className="touch-target w-full rounded-card border border-litmus-border bg-litmus-surface px-4 py-3 text-sm transition-colors focus:border-litmus-accent focus:outline-none"
          />
        </div>

        {/* Analysis Tags */}
        <div>
          <p className="mb-2 text-xs text-litmus-muted">
            Analysis focus (select all that apply)
          </p>
          <div className="flex flex-wrap gap-2">
            {ANALYSIS_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`touch-target rounded-full border px-4 py-2 text-xs transition-all ${
                  tags.includes(tag)
                    ? "border-litmus-accent bg-litmus-accent text-white"
                    : "border-litmus-border bg-litmus-surface hover:border-litmus-accent"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="card p-3 text-center">
            <p className="text-lg font-bold text-litmus-accent">⏱️ ~30s</p>
            <p className="text-[10px] text-litmus-muted">Analysis Time</p>
          </div>
          <div className="card p-3 text-center">
            <p className="text-lg font-bold text-litmus-green">💰 10–50</p>
            <p className="text-[10px] text-litmus-muted">LMT Reward</p>
          </div>
        </div>

        {/* Progress */}
        {busy && (
          <div className="card p-4">
            <div className="mb-3 flex justify-between">
              {(["uploading", "analyzing", "verifying"] as const).map((p) => {
                const order = ["uploading", "analyzing", "verifying"];
                const currentIdx = order.indexOf(phase);
                const thisIdx = order.indexOf(p);
                const done = thisIdx < currentIdx;
                const active = p === phase;
                return (
                  <div key={p} className="flex flex-1 flex-col items-center">
                    <div
                      className={`mb-1 h-3 w-3 rounded-full transition-all ${
                        done
                          ? "bg-litmus-green"
                          : active
                            ? "bg-litmus-accent shadow-[0_0_12px_#9945FF]"
                            : "bg-litmus-border"
                      }`}
                    />
                    <span className="text-[10px] capitalize text-litmus-muted">
                      {p}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-litmus-bg">
              <div
                className="h-full bg-litmus-accent transition-all duration-700"
                style={{ width: `${PHASE_PROGRESS[phase]}%` }}
              />
            </div>
            <p className="mt-2 text-center text-xs text-litmus-muted">
              {PHASE_LABELS[phase]}
            </p>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={submit}
          disabled={busy}
          className="touch-target w-full rounded-card cta-gradient py-4 font-semibold text-black transition-transform active:scale-[0.98] disabled:opacity-50"
        >
          {busy ? (
            <span className="flex items-center justify-center gap-2">
              <span className="loading-spinner h-5 w-5" />
              Processing...
            </span>
          ) : (
            "Submit for Verification"
          )}
        </button>

        <p className="text-center text-[10px] text-litmus-muted">
          Current streak: {state.stats.streak} days 🔥 — streak bonus applies
        </p>
      </div>
    </div>
  );
}
