"use client";

import { useApp } from "@/lib/store";

export default function Toast() {
  const { toast } = useApp();

  return (
    <div
      className={`fixed bottom-20 left-4 right-4 z-[150] mx-auto max-w-[448px] transition-all duration-300 ${
        toast ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-24 opacity-0"
      }`}
    >
      <div className="card px-4 py-3 text-center text-sm shadow-lg">{toast}</div>
    </div>
  );
}
