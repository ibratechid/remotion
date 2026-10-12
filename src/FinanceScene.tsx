import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

const W = 1920;
const H = 1080;
const BASE = 880;

const COLORS = {
  bgA: '#06122b',
  bgB: '#0b2a4a',
  bgC: '#0f4c5c',
  teal: '#2dd4bf',
  green: '#4ade80',
  blue: '#38bdf8',
  gold: '#fbbf24',
  white: '#e2f0ff',
};

// ---------- helpers ----------
const ease = Easing.bezier(0.22, 1, 0.36, 1); // smooth "out-expo" feel

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

// Catmull-Rom -> smooth cubic Bezier path
const smoothPath = (pts: {x: number; y: number}[]) => {
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
};

// ---------- data ----------
const HEIGHTS = [120, 180, 150, 260, 220, 340, 300, 430, 390, 520];
const BAR_W = 50;
const GAP = 28;
const START_X = 180;

const bars = HEIGHTS.map((h, i) => ({
  x: START_X + i * (BAR_W + GAP),
  h,
  cx: START_X + i * (BAR_W + GAP) + BAR_W / 2,
}));

const linePts = bars.map((b) => ({x: b.cx, y: BASE - b.h - 90}));
const LINE_D = smoothPath(linePts);

const DONUT = {cx: 1440, cy: 380, r: 170, stroke: 46};
const DONUT_C = 2 * Math.PI * DONUT.r;
const SEGMENTS = [
  {frac: 0.46, color: COLORS.teal},
  {frac: 0.31, color: COLORS.blue},
  {frac: 0.23, color: COLORS.gold},
];

const COINS = [
  {x: 1200, y: 800, s: 46},
  {x: 1330, y: 880, s: 34},
  {x: 1760, y: 820, s: 52},
  {x: 1640, y: 930, s: 30},
  {x: 1130, y: 640, s: 28},
];

// ---------- scene ----------
export const FinanceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const t = frame / fps;

  // global fade in / out for clean edits
  const fade = interpolate(frame, [0, 12, 138, 149], [0, 1, 1, 0.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // slow background drift
  const glowX = 30 + Math.sin(t * 0.9) * 8;
  const glowY = 40 + Math.cos(t * 0.7) * 8;

  // line draw progress
  const lineP = ease(clamp01((frame - 30) / 80));

  // donut progress
  const donutP = ease(clamp01((frame - 16) / 80));

  // ledger rows
  const rows = [0.86, 0.64, 0.78];

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at ${glowX}% ${glowY}%, ${COLORS.bgC} 0%, ${COLORS.bgB} 38%, ${COLORS.bgA} 100%)`,
        opacity: fade,
      }}
    >
      <svg width={width} height={height} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLORS.green} />
            <stop offset="100%" stopColor={COLORS.teal} stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={COLORS.blue} />
            <stop offset="100%" stopColor={COLORS.gold} />
          </linearGradient>
          <radialGradient id="coinGrad" cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#fff3b0" />
            <stop offset="60%" stopColor={COLORS.gold} />
            <stop offset="100%" stopColor="#b45309" />
          </radialGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* grid */}
        {Array.from({length: 7}).map((_, i) => {
          const y = BASE - i * 120;
          const o = interpolate(frame, [0, 25], [0, 0.14], {extrapolateRight: 'clamp'});
          return (
            <line key={i} x1={120} x2={1100} y1={y} y2={y} stroke={COLORS.white} strokeOpacity={o} strokeWidth={2} />
          );
        })}

        {/* bars */}
        {bars.map((b, i) => {
          const sp = spring({frame: frame - 6 - i * 4, fps, config: {damping: 18, stiffness: 90, mass: 0.8}});
          const h = b.h * sp;
          return (
            <rect
              key={i}
              x={b.x}
              y={BASE - h}
              width={BAR_W}
              height={h}
              rx={12}
              fill="url(#barGrad)"
              opacity={0.92}
            />
          );
        })}

        {/* growth line */}
        <path
          d={LINE_D}
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth={9}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - lineP}
          filter="url(#glow)"
        />
        {linePts.map((p, i) => {
          const reach = (i + 0.4) / linePts.length;
          const pop = spring({
            frame: frame - (30 + reach * 80),
            fps,
            config: {damping: 12, stiffness: 160},
          });
          return (
            <g key={i} transform={`translate(${p.x} ${p.y}) scale(${pop})`}>
              <circle r={15} fill={COLORS.bgA} stroke={COLORS.gold} strokeWidth={5} />
              <circle r={5} fill={COLORS.gold} />
            </g>
          );
        })}

        {/* donut chart */}
        <circle
          cx={DONUT.cx}
          cy={DONUT.cy}
          r={DONUT.r}
          fill="none"
          stroke={COLORS.white}
          strokeOpacity={0.08}
          strokeWidth={DONUT.stroke}
        />
        {(() => {
          let acc = 0;
          return SEGMENTS.map((s, i) => {
            const start = acc;
            acc += s.frac;
            const visible = clamp01((donutP - start) / s.frac) * s.frac;
            const len = visible * DONUT_C;
            return (
              <circle
                key={i}
                cx={DONUT.cx}
                cy={DONUT.cy}
                r={DONUT.r}
                fill="none"
                stroke={s.color}
                strokeWidth={DONUT.stroke}
                strokeLinecap="butt"
                strokeDasharray={`${Math.max(0, len - 4)} ${DONUT_C}`}
                strokeDashoffset={-start * DONUT_C}
                transform={`rotate(-90 ${DONUT.cx} ${DONUT.cy})`}
              />
            );
          });
        })()}
        <circle
          cx={DONUT.cx}
          cy={DONUT.cy}
          r={70 + Math.sin(t * 3) * 4}
          fill={COLORS.teal}
          opacity={0.18}
          filter="url(#glow)"
        />
        <circle cx={DONUT.cx} cy={DONUT.cy} r={34} fill={COLORS.teal} opacity={0.9} />

        {/* ledger rows */}
        {rows.map((r, i) => {
          const p = ease(clamp01((frame - 50 - i * 8) / 50));
          const y = 690 + i * 56;
          return (
            <g key={i}>
              <rect x={1240} y={y} width={400} height={20} rx={10} fill={COLORS.white} opacity={0.1} />
              <rect
                x={1240}
                y={y}
                width={400 * r * p}
                height={20}
                rx={10}
                fill={i === 1 ? COLORS.blue : i === 2 ? COLORS.gold : COLORS.green}
              />
              <circle cx={1200} cy={y + 10} r={10} fill={COLORS.white} opacity={0.5 * p} />
            </g>
          );
        })}

        {/* floating coins */}
        {COINS.map((c, i) => {
          const pop = spring({frame: frame - 24 - i * 6, fps, config: {damping: 14, stiffness: 110}});
          const bob = Math.sin(t * 2.4 + i * 1.3) * 12;
          return (
            <g key={i} transform={`translate(${c.x} ${c.y + bob}) scale(${pop})`} filter="url(#glow)">
              <circle r={c.s} fill="url(#coinGrad)" />
              <circle r={c.s * 0.68} fill="none" stroke="#b45309" strokeWidth={4} opacity={0.6} />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
