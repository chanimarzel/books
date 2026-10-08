import React from 'react';
import {random, useCurrentFrame} from 'remotion';

export const C = {
  bg: '#120b07',
  bg2: '#1f140d',
  amber: '#ffb54d',
  gold: '#e9b86c',
  cream: '#f7ead6',
  wood: '#3a2416',
  woodLight: '#5a3a23',
  wax: '#f3e3c8',
};

export const FONT = "'Assistant', sans-serif";

// Soft flicker based on frame and seed.
const flicker = (frame: number, seed: number) =>
  1 +
  0.06 * Math.sin(frame * 0.41 + seed * 7.1) +
  0.04 * Math.sin(frame * 1.13 + seed * 3.3) +
  0.03 * Math.sin(frame * 2.07 + seed * 1.7);

export const Flame: React.FC<{
  x: number;
  y: number;
  size?: number;
  lit?: number;
  seed?: number;
}> = ({x, y, size = 1, lit = 1, seed = 0}) => {
  const frame = useCurrentFrame();
  if (lit <= 0) return null;
  const f = flicker(frame, seed);
  const sway = Math.sin(frame * 0.23 + seed) * 2.5 * size;
  const h = 46 * size * f * lit;
  const w = 16 * size * lit;
  const gid = `fl-${seed}`;
  return (
    <g>
      <defs>
        <radialGradient id={gid} cx="50%" cy="70%" r="60%">
          <stop offset="0%" stopColor="#fff8e1" />
          <stop offset="45%" stopColor="#ffd27a" />
          <stop offset="100%" stopColor="#ff8a1f" stopOpacity="0.9" />
        </radialGradient>
      </defs>
      <circle cx={x} cy={y - h * 0.4} r={150 * size * lit * f} fill="url(#halo)" opacity={0.55 * lit} />
      <path
        d={`M ${x} ${y - h} C ${x + w + sway} ${y - h * 0.45}, ${x + w} ${y}, ${x} ${y} C ${x - w} ${y}, ${x - w + sway} ${y - h * 0.45}, ${x} ${y - h} Z`}
        fill={`url(#${gid})`}
      />
      <ellipse cx={x} cy={y - h * 0.22} rx={w * 0.35} ry={h * 0.18} fill="#6b8cff" opacity={0.35} />
    </g>
  );
};

export const HaloDefs: React.FC = () => (
  <defs>
    <radialGradient id="halo">
      <stop offset="0%" stopColor="#ffcf7a" stopOpacity="0.55" />
      <stop offset="40%" stopColor="#ff9f3a" stopOpacity="0.18" />
      <stop offset="100%" stopColor="#ff9f3a" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="dot">
      <stop offset="0%" stopColor="#fff4d6" stopOpacity="1" />
      <stop offset="25%" stopColor="#ffc766" stopOpacity="0.9" />
      <stop offset="100%" stopColor="#ff9f3a" stopOpacity="0" />
    </radialGradient>
    <linearGradient id="wax" x1="0" x2="1">
      <stop offset="0%" stopColor="#d9c4a3" />
      <stop offset="45%" stopColor="#fbf0dd" />
      <stop offset="100%" stopColor="#cdb48e" />
    </linearGradient>
    <linearGradient id="cup" x1="0" x2="1">
      <stop offset="0%" stopColor="#d8cbb8" />
      <stop offset="40%" stopColor="#fbf5ea" />
      <stop offset="100%" stopColor="#bfae95" />
    </linearGradient>
    <linearGradient id="table" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#5b3a22" />
      <stop offset="100%" stopColor="#2a190e" />
    </linearGradient>
  </defs>
);

// Candle: (x, y) is the bottom center.
export const Candle: React.FC<{
  x: number;
  y: number;
  scale?: number;
  height?: number;
  lit?: number;
  seed?: number;
}> = ({x, y, scale = 1, height = 220, lit = 1, seed = 0}) => {
  const w = 56 * scale;
  const h = height * scale;
  const top = y - h;
  return (
    <g>
      <rect x={x - w / 2} y={top} width={w} height={h} rx={6 * scale} fill="url(#wax)" />
      <ellipse cx={x} cy={top} rx={w / 2} ry={8 * scale} fill="#fff6e6" />
      <line x1={x} y1={top} x2={x} y2={top - 12 * scale} stroke="#2b1a10" strokeWidth={3 * scale} />
      <Flame x={x} y={top - 8 * scale} size={scale} lit={lit} seed={seed} />
    </g>
  );
};

// Small glowing point of light.
export const Dot: React.FC<{x: number; y: number; r: number; o?: number; seed?: number}> = ({
  x,
  y,
  r,
  o = 1,
  seed = 0,
}) => {
  const frame = useCurrentFrame();
  const f = 1 + 0.12 * Math.sin(frame * 0.3 + seed * 13.7);
  if (o <= 0) return null;
  return <circle cx={x} cy={y} r={r * f} fill="url(#dot)" opacity={o} />;
};

// Coffee cup: (x, y) is bottom center.
export const Cup: React.FC<{x: number; y: number; scale?: number; steam?: number; seed?: number}> = ({
  x,
  y,
  scale = 1,
  steam = 1,
  seed = 0,
}) => {
  const frame = useCurrentFrame();
  const s = scale;
  const w = 150 * s;
  const h = 130 * s;
  const top = y - h;
  return (
    <g>
      <ellipse cx={x} cy={y + 4 * s} rx={130 * s} ry={22 * s} fill="#e6d8c2" />
      <ellipse cx={x} cy={y} rx={110 * s} ry={14 * s} fill="#cbb999" />
      <path
        d={`M ${x + w / 2 - 4 * s} ${top + 30 * s} q ${55 * s} ${-6 * s} ${48 * s} ${40 * s} q ${-6 * s} ${34 * s} ${-58 * s} ${30 * s}`}
        stroke="#e7dccb"
        strokeWidth={14 * s}
        fill="none"
      />
      <path
        d={`M ${x - w / 2} ${top} L ${x + w / 2} ${top} L ${x + w / 2 - 14 * s} ${y - 10 * s} Q ${x} ${y + 4 * s} ${x - w / 2 + 14 * s} ${y - 10 * s} Z`}
        fill="url(#cup)"
      />
      <ellipse cx={x} cy={top} rx={w / 2} ry={16 * s} fill="#f8f1e5" />
      <ellipse cx={x} cy={top + 2 * s} rx={w / 2 - 10 * s} ry={11 * s} fill="#5a3418" />
      {steam > 0 &&
        [0, 1, 2].map((i) => {
          const t = (frame * 0.6 + i * 40 + seed * 17) % 120;
          const op = Math.sin((t / 120) * Math.PI) * 0.35 * steam;
          const sx = x + (i - 1) * 32 * s;
          const sy = top - 10 * s - t * 1.1 * s;
          const wob = Math.sin((frame + i * 30) * 0.07) * 14 * s;
          return (
            <path
              key={i}
              d={`M ${sx} ${sy + 60 * s} q ${wob} ${-30 * s} 0 ${-60 * s} q ${-wob} ${-30 * s} 0 ${-60 * s}`}
              stroke="#fff"
              strokeOpacity={op}
              strokeWidth={8 * s}
              strokeLinecap="round"
              fill="none"
            />
          );
        })}
    </g>
  );
};

// Table: a warm wooden surface seen at a low angle.
export const Table: React.FC<{y: number; o?: number}> = ({y, o = 1}) => (
  <g opacity={o}>
    <ellipse cx={540} cy={y + 30} rx={620} ry={120} fill="#000" opacity={0.35} />
    <path d={`M -40 ${y} L 1120 ${y} L 1120 ${y + 520} L -40 ${y + 520} Z`} fill="url(#table)" />
    <rect x={-40} y={y - 6} width={1160} height={12} fill={C.woodLight} />
    {[0, 1, 2, 3].map((i) => (
      <path
        key={i}
        d={`M -40 ${y + 60 + i * 70} C 300 ${y + 50 + i * 70}, 700 ${y + 80 + i * 70}, 1120 ${y + 62 + i * 70}`}
        stroke="#000"
        strokeOpacity={0.12}
        strokeWidth={3}
        fill="none"
      />
    ))}
  </g>
);

// Simple chair seen from the side, facing the viewer slightly.
export const Chair: React.FC<{x: number; y: number; scale?: number; o?: number}> = ({x, y, scale = 1, o = 1}) => {
  const s = scale;
  const col = '#7a5233';
  return (
    <g opacity={o}>
      <rect x={x - 110 * s} y={y - 520 * s} width={22 * s} height={520 * s} rx={6 * s} fill={col} />
      <rect x={x + 88 * s} y={y - 520 * s} width={22 * s} height={520 * s} rx={6 * s} fill={col} />
      <rect x={x - 110 * s} y={y - 520 * s} width={220 * s} height={40 * s} rx={10 * s} fill={col} />
      <rect x={x - 110 * s} y={y - 430 * s} width={220 * s} height={18 * s} rx={6 * s} fill={col} opacity={0.8} />
      <rect x={x - 130 * s} y={y - 250 * s} width={260 * s} height={34 * s} rx={10 * s} fill="#93653f" />
      <rect x={x - 120 * s} y={y - 216 * s} width={20 * s} height={216 * s} fill={col} />
      <rect x={x + 100 * s} y={y - 216 * s} width={20 * s} height={216 * s} fill={col} />
    </g>
  );
};

// Deterministic scatter of points across the visual area.
export const scatter = (n: number, seed: string, area = {x0: 70, x1: 1010, y0: 300, y1: 1240}) =>
  new Array(n).fill(0).map((_, i) => ({
    x: area.x0 + random(`${seed}-x-${i}`) * (area.x1 - area.x0),
    y: area.y0 + random(`${seed}-y-${i}`) * (area.y1 - area.y0),
    r: 10 + random(`${seed}-r-${i}`) * 16,
    d: random(`${seed}-d-${i}`),
  }));
