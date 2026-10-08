import '@fontsource/assistant/400.css';
import '@fontsource/assistant/800.css';
import React from 'react';
import {AbsoluteFill, random} from 'remotion';

const W = 1080;
const H = 1920;

// Rough, hand-cut edge: jitter points along a polyline.
const rough = (pts: [number, number][], amp: number, seed: string, step = 18) => {
  const out: string[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[i + 1];
    const len = Math.hypot(x2 - x1, y2 - y1);
    const n = Math.max(1, Math.round(len / step));
    for (let k = 0; k < n; k++) {
      const t = k / n;
      const jx = (random(`${seed}-${i}-${k}-x`) - 0.5) * amp;
      const jy = (random(`${seed}-${i}-${k}-y`) - 0.5) * amp;
      out.push(`${(x1 + (x2 - x1) * t + jx).toFixed(1)},${(y1 + (y2 - y1) * t + jy).toFixed(1)}`);
    }
  }
  return `M ${out.join(' L ')} Z`;
};

// Wavy horizontal layer (hills / cut paper band) from y with amplitude.
const wave = (y: number, amp: number, freq: number, phase: number) => {
  const p: string[] = [`M 0 ${H}`, `L 0 ${y}`];
  for (let x = 0; x <= W; x += 20) {
    p.push(`L ${x} ${y + Math.sin(x * freq + phase) * amp + Math.sin(x * freq * 2.3 + phase * 1.7) * amp * 0.35}`);
  }
  p.push(`L ${W} ${H} Z`);
  return p.join(' ');
};

const PaperDefs: React.FC<{id: string}> = ({id}) => (
  <defs>
    <filter id={`tex-${id}`} x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="3" result="n" />
      <feColorMatrix type="saturate" values="0" />
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.08" />
      </feComponentTransfer>
      <feComposite in2="SourceGraphic" operator="in" />
      <feBlend in="SourceGraphic" mode="multiply" />
    </filter>
    <filter id={`sh-${id}`} x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#1a0f08" floodOpacity="0.45" />
    </filter>
    <filter id={`shs-${id}`} x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="5" stdDeviation="6" floodColor="#1a0f08" floodOpacity="0.4" />
    </filter>
  </defs>
);

const Label: React.FC<{children: React.ReactNode; color: string; top?: number; size?: number; font?: number}> = ({
  children,
  color,
  top = 330,
  size = 92,
  font = 800,
}) => (
  <div
    style={{
      position: 'absolute',
      top,
      left: 80,
      right: 80,
      textAlign: 'center',
      direction: 'rtl',
      fontFamily: "'Assistant', sans-serif",
      fontWeight: font,
      fontSize: size,
      color,
      lineHeight: 1.1,
    }}
  >
    {children}
  </div>
);

const Caption: React.FC<{bg: string; color: string}> = ({bg, color}) => (
  <div style={{position: 'absolute', top: 1360, left: 90, right: 90, display: 'flex', justifyContent: 'center'}}>
    <div
      style={{
        direction: 'rtl',
        fontFamily: "'Assistant', sans-serif",
        fontWeight: 800,
        fontSize: 56,
        color,
        background: bg,
        padding: '14px 34px 18px',
        borderRadius: 18,
      }}
    >
      לפני שנה הנחתי כוס קפה אחת על השולחן.
    </div>
  </div>
);

// A. Layered paper cut: stacked cut layers with depth shadows, night sky to warm table.
export const StyleLayers: React.FC = () => {
  const id = 'a';
  const layers = ['#24324a', '#2f4260', '#3d5577', '#4e6a8e'];
  return (
    <AbsoluteFill style={{background: '#1b2638'}}>
      <svg width={W} height={H}>
        <PaperDefs id={id} />
        <g filter={`url(#tex-${id})`}>
          <rect width={W} height={H} fill="#1b2638" />
          {/* glow disk */}
          <circle cx={540} cy={760} r={430} fill="#f2b45a" opacity={0.95} filter={`url(#sh-${id})`} />
          <circle cx={540} cy={760} r={330} fill="#f7c873" filter={`url(#sh-${id})`} />
          <circle cx={540} cy={760} r={230} fill="#fbdc98" filter={`url(#sh-${id})`} />
          {layers.map((c, i) => (
            <path key={c} d={wave(900 + i * 70, 40 - i * 6, 0.006 + i * 0.002, i * 1.3)} fill={c} filter={`url(#sh-${id})`} />
          ))}
          {/* table */}
          <path d={`M 0 1180 L ${W} 1180 L ${W} ${H} L 0 ${H} Z`} fill="#c8643b" filter={`url(#sh-${id})`} />
          <path d={`M 0 1210 L ${W} 1210 L ${W} ${H} L 0 ${H} Z`} fill="#a84f2e" />
          {/* cup */}
          <g filter={`url(#sh-${id})`}>
            <ellipse cx={420} cy={1185} rx={150} ry={26} fill="#f3e6cf" />
            <path d="M 300 1000 L 540 1000 L 515 1175 Q 420 1195 325 1175 Z" fill="#fbf3e4" />
            <path d="M 532 1040 q 80 -6 70 60 q -8 50 -80 44" stroke="#fbf3e4" strokeWidth={22} fill="none" />
            <ellipse cx={420} cy={1002} rx={120} ry={22} fill="#7a4524" />
            <path d="M 380 960 q -30 -50 0 -100 q 30 -50 0 -100" stroke="#fbf3e4" strokeWidth={16} fill="none" strokeLinecap="round" opacity={0.85} />
            <path d="M 450 950 q -25 -45 0 -90 q 25 -45 0 -90" stroke="#fbf3e4" strokeWidth={12} fill="none" strokeLinecap="round" opacity={0.6} />
          </g>
          {/* candle */}
          <g filter={`url(#sh-${id})`}>
            <rect x={690} y={930} width={80} height={250} rx={8} fill="#fbf3e4" />
            <path d="M 730 760 C 790 840, 780 920, 730 925 C 680 920, 670 840, 730 760 Z" fill="#f08a2c" />
            <path d="M 730 810 C 765 860, 760 915, 730 918 C 700 915, 695 860, 730 810 Z" fill="#f9c74f" />
            <path d="M 730 860 C 748 885, 746 912, 730 914 C 714 912, 712 885, 730 860 Z" fill="#fff4d6" />
          </g>
          {/* stars */}
          {new Array(26).fill(0).map((_, i) => (
            <circle key={i} cx={60 + random(`s${i}`) * 960} cy={120 + random(`t${i}`) * 300} r={4 + random(`r${i}`) * 5} fill="#fbdc98" filter={`url(#shs-${id})`} />
          ))}
        </g>
      </svg>
      <Label color="#fbf3e4">לפני שנה</Label>
      <Caption bg="#fbf3e4" color="#2f4260" />
    </AbsoluteFill>
  );
};

// B. Torn paper collage: kraft, torn edges, tape, cut-out shapes.
export const StyleTorn: React.FC = () => {
  const id = 'b';
  const tape = (x: number, y: number, r: number) => (
    <rect x={x - 60} y={y - 18} width={120} height={36} fill="#efe3b8" opacity={0.75} transform={`rotate(${r} ${x} ${y})`} />
  );
  return (
    <AbsoluteFill style={{background: '#e9dcc4'}}>
      <svg width={W} height={H}>
        <PaperDefs id={id} />
        <g filter={`url(#tex-${id})`}>
          <rect width={W} height={H} fill="#e9dcc4" />
          {/* torn blocks */}
          <path d={rough([[60, 260], [1020, 230], [1040, 1250], [40, 1290]], 22, 'big')} fill="#1f3b4d" filter={`url(#sh-${id})`} />
          <path d={rough([[150, 520], [930, 500], [950, 980], [130, 1010]], 20, 'sun')} fill="#e07a3f" filter={`url(#sh-${id})`} transform="rotate(-2 540 760)" />
          <path d={rough([[40, 1080], [1040, 1050], [1060, 1330], [20, 1350]], 26, 'tbl')} fill="#8c5a3c" filter={`url(#sh-${id})`} />
          {/* cup cut-out */}
          <g filter={`url(#sh-${id})`}>
            <path d={rough([[300, 860], [560, 860], [530, 1090], [330, 1090]], 10, 'cup')} fill="#f6efe2" />
            <path d={rough([[555, 900], [640, 910], [630, 1010], [545, 1020]], 8, 'hdl')} fill="#f6efe2" />
            <path d={rough([[330, 860], [530, 860], [520, 890], [340, 890]], 6, 'cof')} fill="#4a2a17" />
          </g>
          {/* candle */}
          <g filter={`url(#sh-${id})`}>
            <path d={rough([[700, 820], [790, 820], [795, 1090], [695, 1090]], 8, 'cnd')} fill="#f6efe2" />
            <path d={rough([[745, 640], [800, 760], [745, 810], [690, 760]], 10, 'fl1')} fill="#f4b23e" />
            <path d={rough([[745, 700], [775, 770], [745, 800], [715, 770]], 6, 'fl2')} fill="#fff1c9" />
          </g>
          {tape(200, 270, -8)}
          {tape(900, 250, 6)}
          {tape(560, 1065, -3)}
          {/* scribble stars */}
          {[180, 330, 860, 950].map((x, i) => (
            <path key={x} d={`M ${x} ${380 + i * 25} l 10 26 l 26 2 l -20 16 l 8 26 l -24 -14 l -24 14 l 8 -26 l -20 -16 l 26 -2 Z`} fill="#f6efe2" />
          ))}
        </g>
      </svg>
      <Label color="#1f3b4d" top={110} size={100}>
        לפני שנה
      </Label>
      <Caption bg="#1f3b4d" color="#f6efe2" />
    </AbsoluteFill>
  );
};

// C. Pop paper diorama: bright flat colors, bold layered frames, playful and modern.
export const StylePop: React.FC = () => {
  const id = 'c';
  const frames = ['#ff8a5b', '#ffb36b', '#ffd27f', '#fff0c4'];
  return (
    <AbsoluteFill style={{background: '#ff6f61'}}>
      <svg width={W} height={H}>
        <PaperDefs id={id} />
        <g filter={`url(#tex-${id})`}>
          <rect width={W} height={H} fill="#ff6f61" />
          {frames.map((c, i) => {
            const m = 70 + i * 55;
            return <rect key={c} x={m} y={240 + i * 55} width={W - m * 2} height={1120 - i * 110} rx={60 - i * 8} fill={c} filter={`url(#sh-${id})`} />;
          })}
          {/* arch window with night */}
          <path d="M 300 1100 L 300 640 A 240 240 0 0 1 780 640 L 780 1100 Z" fill="#3a2e6e" filter={`url(#sh-${id})`} />
          <circle cx={640} cy={600} r={60} fill="#fff0c4" />
          <circle cx={665} cy={585} r={52} fill="#3a2e6e" />
          {/* table */}
          <rect x={150} y={1060} width={780} height={60} rx={20} fill="#2bb3a3" filter={`url(#sh-${id})`} />
          <rect x={200} y={1110} width={40} height={180} fill="#1f8f83" />
          <rect x={840} y={1110} width={40} height={180} fill="#1f8f83" />
          {/* cup */}
          <g filter={`url(#sh-${id})`}>
            <path d="M 330 900 L 520 900 L 500 1060 L 350 1060 Z" fill="#ffffff" />
            <rect x={330} y={940} width={190} height={30} fill="#ff6f61" />
            <path d="M 515 930 q 70 0 60 55 q -8 40 -66 36" stroke="#ffffff" strokeWidth={20} fill="none" />
          </g>
          {/* candle */}
          <g filter={`url(#sh-${id})`}>
            <rect x={650} y={840} width={70} height={220} rx={12} fill="#ffffff" />
            <path d="M 685 700 C 740 770, 730 830, 685 835 C 640 830, 630 770, 685 700 Z" fill="#ffb000" />
            <path d="M 685 750 C 712 790, 708 828, 685 830 C 662 828, 658 790, 685 750 Z" fill="#fff0c4" />
          </g>
        </g>
      </svg>
      <Label color="#3a2e6e" top={300} size={88}>
        לפני שנה
      </Label>
      <Caption bg="#3a2e6e" color="#fff0c4" />
    </AbsoluteFill>
  );
};
