import type { CSSProperties } from "react";

const ICON_PATHS: Record<string, string> = {
  home: "M3 11.5 12 4l9 7.5M5.5 10v9.5h13V10",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM13 13h7v7h-7zM4 13h7v7H4z",
  scan: "M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M4 12h16",
  market: "M4 19V9M9 19V5M14 19v-7M19 19v-4M3 19h18",
  trophy: "M7 4h10v4a5 5 0 0 1-10 0zM7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 0-3 3M12 13v4M8.5 20h7M10 20l.5-3M14 20l-.5-3",
  wallet: "M4 7h13a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a1 1 0 0 1 1-1h11M16 13h2",
  arrowL: "M14 5l-7 7 7 7",
  arrowR: "M10 5l7 7-7 7",
  check: "M5 12.5l4.5 4.5L19 6.5",
  x: "M6 6l12 12M18 6L6 18",
  flame: "M12 21a6 6 0 0 0 6-6c0-4-4-6.5-5.2-9.6C12 8 9.5 8.5 9.5 11 9 10.5 8 9.5 8 8c-1.5 1.6-2 3.4-2 5a6 6 0 0 0 6 8z",
  share: "M5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7M12 16V4M8 8l4-4 4 4",
  info: "M12 11v5M12 7.5h.01",
  clock: "M12 7v5l3 2",
  shield: "M12 3l7 3v5c0 4.5-3 7.8-7 9.5-4-1.7-7-5-7-9.5V6z M9 12l2 2 4-4",
  coins: "M9 8a6 3 0 1 0 0-6 6 3 0 0 0 0 6zM3 11c0 1.7 2.7 3 6 3s6-1.3 6-3M3 5v6c0 1.7 2.7 3 6 3M15 9c2.5.3 4 .9 4 2 0 1.7-2.7 3-6 3s-6-1.3-6-3",
  target: "M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0-10 0M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0",
  upload: "M12 16V5M8 9l4-4 4 4M5 19h14",
  link: "M9 15l6-6M10 7l1-1a4 4 0 0 1 6 6l-1 1M14 17l-1 1a4 4 0 0 1-6-6l1-1",
  chevR: "M9 6l6 6-6 6",
};

interface IconProps {
  name: keyof typeof ICON_PATHS;
  size?: number;
  stroke?: number;
  className?: string;
  style?: CSSProperties;
}

export default function Icon({
  name,
  size = 20,
  stroke = 2,
  className = "",
  style = {},
}: IconProps) {
  const d = ICON_PATHS[name];
  if (!d) return null;
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0, ...style }}
    >
      {d
        .split("M")
        .filter(Boolean)
        .map((seg, i) => (
          <path key={i} d={"M" + seg} />
        ))}
    </svg>
  );
}
