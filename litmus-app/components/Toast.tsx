"use client";

import { useApp } from "@/lib/store";

export default function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  return (
    <div className="lc-toast lc-toast-info">
      <span>{toast}</span>
    </div>
  );
}
