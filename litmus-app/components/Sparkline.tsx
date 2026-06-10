interface SparklineProps {
  data: number[];
  w?: number;
  h?: number;
  stroke?: string;
  fill?: string;
  strokeWidth?: number;
  dot?: boolean;
}

export default function Sparkline({
  data,
  w = 120,
  h = 36,
  stroke = "currentColor",
  fill = "none",
  strokeWidth = 1.5,
  dot = false,
}: SparklineProps) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * (w - 2) + 1;
    const y = h - 2 - ((d - min) / span) * (h - 4);
    return [x, y] as const;
  });
  const line = pts.map((p) => p.join(",")).join(" ");
  const area = `1,${h} ` + line + ` ${w - 1},${h}`;

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ display: "block", overflow: "visible" }}
    >
      {fill !== "none" && (
        <polygon points={area} fill={fill} stroke="none" />
      )}
      <polyline
        points={line}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {dot && (
        <circle
          cx={pts[pts.length - 1][0]}
          cy={pts[pts.length - 1][1]}
          r="2.5"
          fill={stroke}
        />
      )}
    </svg>
  );
}
