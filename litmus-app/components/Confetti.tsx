"use client";

import { useEffect, useState } from "react";

interface Piece {
  id: number;
  left: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
  round: boolean;
}

const COLORS = ["#9945FF", "#14F195", "#FF4D6D", "#FFD700", "#00D4FF"];

export default function Confetti() {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 0.8,
      duration: 2 + Math.random() * 2,
      size: 6 + Math.random() * 6,
      round: Math.random() > 0.5,
    }));
    setPieces(generated);
    const timer = setTimeout(() => setPieces([]), 4500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="animate-confetti fixed -top-2"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.round ? "50%" : "2px",
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
