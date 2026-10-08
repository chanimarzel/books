// Torn paper collage kit.
import React from 'react';
import {Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const P = {
  kraft: '#e9dcc4',
  kraftDark: '#d8c6a6',
  navy: '#1f3b4d',
  navyDeep: '#162c3a',
  orange: '#e07a3f',
  rust: '#b5462f',
  brown: '#8c5a3c',
  brownDark: '#6b4229',
  cream: '#f6efe2',
  mustard: '#f4b23e',
  flame: '#fff1c9',
  teal: '#2f6f6a',
  tape: '#efe3b8',
};

export const FONT = "'Assistant', sans-serif";
export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const ease = Easing.bezier(0.33, 0, 0.2, 1);

// Stop-motion "boil": edges shift slightly every few frames.
const BOIL_STEP = 4;
export const useBoil = () => Math.floor(useCurrentFrame() / BOIL_STEP);

export const roughPath = (pts: [number, number][], amp: number, seed: string, boil = 0, step = 18) => {
  const out: string[] = [];
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % pts.length];
    const len = Math.hypot(x2 - x1, y2 - y1);
    const n = Math.max(1, Math.round(len / step));
    for (let k = 0; k < n; k++) {
      const t = k / n;
      const j = (a: string) =>
        (random(`${seed}-${i}-${k}-${a}`) - 0.5) * amp + (random(`${seed}-${i}-${k}-${a}-${boil}`) - 0.5) * amp * 0.3;
      out.push(`${(x1 + (x2 - x1) * t + j('x')).toFixed(1)},${(y1 + (y2 - y1) * t + j('y')).toFixed(1)}`);
    }
  }
  return `M ${out.join(' L ')} Z`;
};

export const rect = (x: number, y: number, w: number, h: number): [number, number][] => [
  [x, y],
  [x + w, y],
  [x + w, y + h],
  [x, y + h],
];

export const circlePts = (cx: number, cy: number, r: number, n = 36): [number, number][] =>
  new Array(n).fill(0).map((_, i) => {
    const a = (i / n) * Math.PI * 2;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  });

export const PaperDefs: React.FC = () => (
  <defs>
    <filter id="sh" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="9" stdDeviation="10" floodColor="#2a1a0e" floodOpacity="0.42" />
    </filter>
    <filter id="shs" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#2a1a0e" floodOpacity="0.38" />
    </filter>
  </defs>
);

export const Torn: React.FC<{
  pts: [number, number][];
  fill: string;
  amp?: number;
  seed: string;
  shadow?: 'sh' | 'shs' | false;
  opacity?: number;
}> = ({pts, fill, amp = 12, seed, shadow = 'sh', opacity = 1}) => {
  const boil = useBoil();
  return (
    <path
      d={roughPath(pts, amp, seed, boil)}
      fill={fill}
      opacity={opacity}
      filter={shadow ? `url(#${shadow})` : undefined}
    />
  );
};

export const Tape: React.FC<{x: number; y: number; r?: number; w?: number}> = ({x, y, r = 0, w = 120}) => (
  <rect x={x - w / 2} y={y - 17} width={w} height={34} fill={P.tape} opacity={0.78} transform={`rotate(${r} ${x} ${y})`} />
);

// Pop-in entrance: scale and settle rotation around (x, y).
export const Enter: React.FC<{
  at: number;
  x: number;
  y: number;
  rot?: number;
  from?: number;
  children: React.ReactNode;
  drop?: number;
}> = ({at, x, y, rot = 0, from = 0.4, drop = 0, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - at, fps, config: {damping: 11, stiffness: 140, mass: 0.7}});
  if (frame < at) return null;
  const sc = from + (1 - from) * s;
  const r = rot + (1 - s) * 8;
  const dy = (1 - s) * drop;
  return (
    <g
      opacity={Math.min(1, s * 2)}
      transform={`translate(${x} ${y + dy}) rotate(${r}) scale(${sc}) translate(${-x} ${-y})`}
    >
      {children}
    </g>
  );
};

// Estimated text width for Assistant (bold Hebrew averages about 0.5em per char).
const textW = (t: string, size: number, weight: number) => t.length * size * (weight >= 700 ? 0.52 : 0.47);

// Text on a torn paper strip. (x, y) is the center.
export const Strip: React.FC<{
  text: string;
  x?: number;
  y: number;
  size?: number;
  weight?: number;
  bg?: string;
  color?: string;
  rot?: number;
  seed: string;
  padX?: number;
  padY?: number;
  shadow?: 'sh' | 'shs' | false;
}> = ({
  text,
  x = 540,
  y,
  size = 64,
  weight = 800,
  bg = P.cream,
  color = P.navy,
  rot = 0,
  seed,
  padX = 34,
  padY = 18,
  shadow = 'shs',
}) => {
  const w = textW(text, size, weight) + padX * 2;
  const h = size * 1.15 + padY * 2;
  return (
    <g transform={`rotate(${rot} ${x} ${y})`}>
      <Torn pts={rect(x - w / 2, y - h / 2, w, h)} fill={bg} amp={Math.min(10, size * 0.14)} seed={seed} shadow={shadow} />
      <text
        x={x}
        y={y + size * 0.36}
        fontFamily={FONT}
        fontWeight={weight}
        fontSize={size}
        fill={color}
        textAnchor="middle"
        direction="rtl"
      >
        {text}
      </text>
    </g>
  );
};

// Paper flame: three stacked cut-out tear drops.
export const PaperFlame: React.FC<{x: number; y: number; s?: number; seed: string}> = ({x, y, s = 1, seed}) => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame * 0.18 + seed.length) * 0.06;
  const drop = (h: number, w: number): [number, number][] => [
    [x, y - h * s],
    [x + w * 0.55 * s, y - h * 0.55 * s],
    [x + w * 0.5 * s, y - h * 0.2 * s],
    [x, y],
    [x - w * 0.5 * s, y - h * 0.2 * s],
    [x - w * 0.55 * s, y - h * 0.55 * s],
  ];
  return (
    <g transform={`rotate(${sway * 57} ${x} ${y})`}>
      <Torn pts={drop(170, 110)} fill={P.orange} amp={7 * s} seed={`${seed}-f1`} shadow="shs" />
      <Torn pts={drop(120, 80)} fill={P.mustard} amp={6 * s} seed={`${seed}-f2`} shadow={false} />
      <Torn pts={drop(70, 46)} fill={P.flame} amp={4 * s} seed={`${seed}-f3`} shadow={false} />
    </g>
  );
};

// Paper candle: (x, y) is the bottom center.
export const PaperCandle: React.FC<{x: number; y: number; s?: number; h?: number; lit?: boolean; seed: string}> = ({
  x,
  y,
  s = 1,
  h = 260,
  lit = true,
  seed,
}) => {
  const w = 96 * s;
  const top = y - h * s;
  return (
    <g>
      <Torn pts={rect(x - w / 2, top, w, h * s)} fill={P.cream} amp={7 * s} seed={`${seed}-c`} />
      <rect x={x - 3 * s} y={top - 22 * s} width={6 * s} height={24 * s} fill={P.navyDeep} />
      {lit && <PaperFlame x={x} y={top - 12 * s} s={s} seed={seed} />}
    </g>
  );
};

// Paper cup: (x, y) is the bottom center.
export const PaperCup: React.FC<{x: number; y: number; s?: number; seed: string}> = ({x, y, s = 1, seed}) => {
  const top = y - 230 * s;
  return (
    <g>
      <Torn
        pts={[
          [x + 85 * s, top + 40 * s],
          [x + 175 * s, top + 50 * s],
          [x + 165 * s, top + 150 * s],
          [x + 85 * s, top + 160 * s],
        ]}
        fill={P.cream}
        amp={8 * s}
        seed={`${seed}-h`}
      />
      <Torn
        pts={[
          [x + 102 * s, top + 70 * s],
          [x + 145 * s, top + 74 * s],
          [x + 140 * s, top + 128 * s],
          [x + 100 * s, top + 132 * s],
        ]}
        fill={P.kraftDark}
        amp={4 * s}
        seed={`${seed}-hh`}
        shadow={false}
      />
      <Torn pts={[[x - 130 * s, top], [x + 130 * s, top], [x + 100 * s, y], [x - 100 * s, y]]} fill={P.cream} amp={9 * s} seed={`${seed}-b`} />
      <Torn pts={rect(x - 118 * s, top, 236 * s, 34 * s)} fill="#4a2a17" amp={5 * s} seed={`${seed}-k`} shadow={false} />
    </g>
  );
};

// Paper steam: wavy cut strips rising.
export const Steam: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => {
  const frame = useCurrentFrame();
  return (
    <g>
      {[-40, 30].map((dx, i) => {
        const t = ((frame + i * 25) % 70) / 70;
        const o = Math.sin(t * Math.PI) * 0.85;
        const yy = y - t * 60 * s;
        return (
          <path
            key={dx}
            d={`M ${x + dx * s} ${yy} q ${-22 * s} ${-35 * s} 0 ${-70 * s} q ${22 * s} ${-35 * s} 0 ${-70 * s}`}
            stroke={P.cream}
            strokeWidth={16 * s}
            strokeLinecap="round"
            fill="none"
            opacity={o}
            filter="url(#shs)"
          />
        );
      })}
    </g>
  );
};

export const CutStar: React.FC<{x: number; y: number; s?: number; fill?: string; seed: string}> = ({
  x,
  y,
  s = 1,
  fill = P.cream,
  seed,
}) => {
  const pts: [number, number][] = new Array(10).fill(0).map((_, i) => {
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const r = (i % 2 === 0 ? 30 : 13) * s;
    return [x + Math.cos(a) * r, y + Math.sin(a) * r];
  });
  return <Torn pts={pts} fill={fill} amp={3 * s} seed={seed} shadow="shs" />;
};

export const useFade = (inF = 8, outF = 8) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return interpolate(frame, [0, inF, durationInFrames - outF, durationInFrames], [0, 1, 1, 0], clamp);
};

// Paper grain over the whole frame.
export const Grain: React.FC = () => (
  <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, mixBlendMode: 'multiply', opacity: 0.55}}>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="5" />
      <feColorMatrix type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.36  0 0 0 0 0.25  0 0 0 0.35 0" />
    </filter>
    <rect width={1080} height={1920} filter="url(#grain)" />
  </svg>
);

// Wrap a caption into lines of at most maxChars.
export const wrap = (text: string, maxChars: number) => {
  const words = text.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > maxChars && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = (cur + ' ' + w).trim();
    }
  }
  if (cur) lines.push(cur);
  return lines;
};

export {random};
