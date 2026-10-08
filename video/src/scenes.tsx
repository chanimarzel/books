import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, Candle, Chair, Cup, Dot, FONT, HaloDefs, Table, scatter} from './elements';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(0.33, 0, 0.2, 1);

const Svg: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0, ...style}}>
    <HaloDefs />
    {children}
  </svg>
);

export const Title: React.FC<{
  children: React.ReactNode;
  y: number;
  size?: number;
  weight?: number;
  color?: string;
  o?: number;
  glow?: boolean;
  dy?: number;
}> = ({children, y, size = 90, weight = 600, color = C.cream, o = 1, glow = false, dy = 0}) => (
  <div
    style={{
      position: 'absolute',
      left: 80,
      right: 80,
      top: y,
      transform: `translateY(calc(-50% + ${dy}px))`,
      textAlign: 'center',
      direction: 'rtl',
      fontFamily: FONT,
      fontSize: size,
      fontWeight: weight,
      lineHeight: 1.15,
      color,
      opacity: o,
      textShadow: glow ? '0 0 40px rgba(255,180,80,0.65), 0 0 90px rgba(255,140,40,0.35)' : 'none',
    }}
  >
    {children}
  </div>
);

// Fade in and out over the scene's duration.
const useSceneFade = (inF = 12, outF = 12) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return interpolate(frame, [0, inF, durationInFrames - outF, durationInFrames], [0, 1, 1, 0], clamp);
};

const appear = (frame: number, at: number, len = 18) => interpolate(frame, [at, at + len], [0, 1], {...clamp, easing: ease});

const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.75) 100%)'}}
  />
);

// 1. One cup, one candle on the table.
export const SceneTable: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const o = useSceneFade(18);
  const zoom = interpolate(frame, [0, durationInFrames], [1.0, 1.06]);
  const lit = appear(frame, 22, 20);
  return (
    <AbsoluteFill style={{opacity: o}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`}}>
        <Svg>
          <Table y={1040} />
          <Cup x={430} y={1090} scale={1.25} steam={appear(frame, 10, 30)} />
          <Candle x={700} y={1090} scale={1.1} height={230} lit={lit} seed={1} />
        </Svg>
      </AbsoluteFill>
      <Title y={420} size={64} weight={300} color={C.gold} o={appear(frame, 8, 24)}>
        לפני שנה
      </Title>
      <Vignette />
    </AbsoluteFill>
  );
};

// 2. The contract.
export const SceneContract: React.FC<{at: number[]; sign: number}> = ({at, sign: signAt}) => {
  const frame = useCurrentFrame();
  const o = useSceneFade();
  const items = ['פעם בחודש', 'שעתיים איתי', 'במתנה', 'בלי למכור. רק לתת.'];
  const sign = interpolate(frame, [signAt, signAt + 18], [0, 1], clamp);
  return (
    <AbsoluteFill style={{opacity: o}}>
      <Svg>
        <circle cx={540} cy={760} r={620} fill="url(#halo)" opacity={0.5} />
        <rect x={150} y={330} width={780} height={860} rx={18} fill="#f4e6cd" opacity={0.96} />
        <rect x={180} y={360} width={720} height={800} rx={10} fill="none" stroke="#c9a46b" strokeWidth={2} />
        <path
          d="M 300 1080 c 40 -50 70 -10 100 -30 s 60 -40 90 0 s 70 10 120 -20"
          stroke="#7a4a22"
          strokeWidth={5}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={420}
          strokeDashoffset={420 * (1 - sign)}
        />
        <line x1={280} y1={1100} x2={800} y2={1100} stroke="#b08a55" strokeWidth={2} />
      </Svg>
      <Title y={440} size={74} weight={800} color="#4a2c14" o={appear(frame, 0, 16)}>
        חוזה שת״פ
      </Title>
      <Title y={520} size={40} weight={600} color="#8a6034" o={appear(frame, 6, 16)}>
        עם הקב״ה
      </Title>
      {items.map((t, i) => (
        <Title
          key={t}
          y={620 + i * 92 + (i === 3 ? 40 : 0)}
          size={i === 3 ? 52 : 58}
          weight={i === 3 ? 800 : 600}
          color={i === 3 ? '#9a4d12' : '#3e2412'}
          o={appear(frame, at[i])}
          dy={(1 - appear(frame, at[i])) * 16}
        >
          {t}
        </Title>
      ))}
      <Title y={1000} size={30} weight={400} color="#8a6034" o={appear(frame, at[2] + 8)}>
        (פגישת אסטרטגיה בשווי 3,000 ₪)
      </Title>
      <Vignette />
    </AbsoluteFill>
  );
};

// 3. Seventy expected, three hundred fifty registered.
export const SceneCount: React.FC<{split: number}> = ({split}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const o = useSceneFade();
  const pts = scatter(350, 'reg');
  const first = interpolate(frame, [4, split - 6], [0, 70], {...clamp, easing: ease});
  const pop = spring({frame: frame - split, fps, config: {damping: 12, stiffness: 120}});
  const second = interpolate(frame, [split, split + 40], [70, 350], {...clamp, easing: Easing.out(Easing.cubic)});
  const n = frame < split ? Math.round(first) : Math.round(second);
  const big = frame >= split;
  return (
    <AbsoluteFill style={{opacity: o}}>
      <Svg>
        {pts.map((p, i) => {
          if (i < 70) {
            const a = appear(frame, 4 + (i / 70) * (split - 14), 10);
            return <Dot key={i} x={p.x} y={p.y} r={p.r * 0.9} o={a * 0.85} seed={i} />;
          }
          const t = interpolate(frame, [split + p.d * 26, split + 14 + p.d * 26], [0, 1], {...clamp, easing: ease});
          const x = 540 + (p.x - 540) * t;
          const y = 760 + (p.y - 760) * t;
          return <Dot key={i} x={x} y={y} r={p.r} o={t} seed={i} />;
        })}
      </Svg>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, rgba(18,11,7,0.85) 0%, rgba(18,11,7,0) 28%)'}} />
      <Title y={560} size={44} weight={400} color={C.gold} o={1}>
        {big ? 'נרשמו' : 'חשבתי'}
      </Title>
      <Title y={760} size={big ? 230 + pop * 40 : 200} weight={800} glow={big} color={big ? '#fff3dc' : C.cream}>
        {n}
      </Title>
      <Title y={930} size={44} weight={400} color={C.gold}>
        נשים
      </Title>
    </AbsoluteFill>
  );
};

// 4. So many lights, and I am one.
export const SceneOne: React.FC<{split: number}> = ({split}) => {
  const frame = useCurrentFrame();
  const o = useSceneFade();
  const pts = scatter(350, 'reg');
  const dim = interpolate(frame, [split - 6, split + 18], [1, 0.22], clamp);
  const candle = appear(frame, split - 10, 22);
  return (
    <AbsoluteFill style={{opacity: o}}>
      <Svg>
        {pts.map((p, i) => (
          <Dot key={i} x={p.x} y={p.y - frame * (0.3 + p.d * 0.6)} r={p.r} o={dim * (0.6 + p.d * 0.4)} seed={i} />
        ))}
        <g opacity={candle}>
          <Candle x={540} y={1150} scale={1.4} height={260} lit={candle} seed={4} />
        </g>
      </Svg>
      <Title y={420} size={60} weight={300} color={C.gold} o={appear(frame, 10, 24) * (1 - candle)}>
        אור שמבקש לצאת לאור
      </Title>
      <Title y={420} size={70} weight={600} color={C.cream} o={candle}>
        ואני אחת
      </Title>
      <Vignette />
    </AbsoluteFill>
  );
};

// 5. The bot is born.
export const SceneBot: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const o = useSceneFade();
  const s = spring({frame: frame - 10, fps, config: {damping: 14}});
  const rays = appear(frame, 6, 30);
  return (
    <AbsoluteFill style={{opacity: o}}>
      <Svg>
        <g opacity={rays * 0.5} transform={`rotate(${frame * 0.15} 540 760)`}>
          {new Array(18).fill(0).map((_, i) => (
            <path
              key={i}
              d="M 540 760 L 520 80 L 560 80 Z"
              fill="#ffcf85"
              opacity={0.12}
              transform={`rotate(${i * 20} 540 760)`}
            />
          ))}
        </g>
        <circle cx={540} cy={760} r={520} fill="url(#halo)" opacity={0.8} />
        <Candle x={540} y={1150} scale={1.4} height={260} lit={1} seed={4} />
      </Svg>
      <Title y={560} size={40} weight={400} color={C.gold} o={appear(frame, 4)}>
        ככה נולד הבוט
      </Title>
      <Title y={680} size={120 * (0.85 + 0.15 * s)} weight={800} glow o={s}>
        יוצאת לאור
      </Title>
    </AbsoluteFill>
  );
};

// 6. A candle for one, a candle for a hundred.
export const SceneTree: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames: d} = useVideoConfig();
  const o = useSceneFade();
  const levels = 7; // 1 + 2 + ... + 64 = 127 lights
  const nodes: {x: number; y: number; lvl: number; px?: number; py?: number}[] = [];
  for (let l = 0; l < levels; l++) {
    const count = 2 ** l;
    const y = 1180 - l * 100;
    for (let k = 0; k < count; k++) {
      const x = 540 + ((k + 0.5) / count - 0.5) * (120 + l * 140);
      const parent = l === 0 ? undefined : nodes[2 ** (l - 1) - 1 + Math.floor(k / 2)];
      nodes.push({x, y, lvl: l, px: parent?.x, py: parent?.y});
    }
  }
  const per = (d * 0.75) / levels;
  return (
    <AbsoluteFill style={{opacity: o}}>
      <Svg>
        {nodes.map((n, i) => {
          const t = appear(frame, n.lvl * per, per);
          return n.px !== undefined ? (
            <line
              key={`l${i}`}
              x1={n.px}
              y1={n.py}
              x2={n.px + (n.x - n.px) * t}
              y2={n.py! + (n.y - n.py!) * t}
              stroke="#ffc46b"
              strokeOpacity={0.25}
              strokeWidth={2}
            />
          ) : null;
        })}
        {nodes.map((n, i) => {
          const t = appear(frame, n.lvl * per + per * 0.7, 10);
          return <Dot key={i} x={n.x} y={n.y} r={n.lvl === 0 ? 34 : 26 - n.lvl * 2} o={t} seed={i} />;
        })}
      </Svg>
      <Title y={360} size={76} weight={600} o={appear(frame, 6)}>
        נר לאחד
      </Title>
      <Title y={450} size={76} weight={800} glow o={appear(frame, d * 0.55)}>
        נר למאה
      </Title>
    </AbsoluteFill>
  );
};

// 7. Twelve women around the table.
export const SceneTwelve: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames: d} = useVideoConfig();
  const o = useSceneFade();
  const cx = 540;
  const cy = 820;
  const shown = interpolate(frame, [8, d * 0.7], [0, 12], clamp);
  return (
    <AbsoluteFill style={{opacity: o}}>
      <Svg>
        <circle cx={cx} cy={cy} r={330} fill="#4a2e1a" />
        <circle cx={cx} cy={cy} r={330} fill="none" stroke="#6b4428" strokeWidth={14} />
        <circle cx={cx} cy={cy} r={400} fill="url(#halo)" opacity={0.6} />
        {new Array(12).fill(0).map((_, i) => {
          const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
          const x = cx + Math.cos(a) * 255;
          const y = cy + Math.sin(a) * 255;
          const t = interpolate(shown, [i, i + 1], [0, 1], clamp);
          return (
            <g key={i} opacity={t} transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * t})`}>
              <circle r={44} fill="#e9dcc6" />
              <circle r={30} fill="#5a3418" />
              <circle r={70} fill="url(#halo)" opacity={0.5} />
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r={34} fill="#f7ead6" />
        <circle cx={cx} cy={cy} r={140} fill="url(#halo)" />
        <Dot x={cx} y={cy - 6} r={30} seed={3} />
      </Svg>
      <Title y={330} size={150} weight={800} glow o={appear(frame, 4)}>
        {Math.round(shown)}
      </Title>
    </AbsoluteFill>
  );
};

// 8. A woman shared; back one year.
export const SceneShare: React.FC<{split: number}> = ({split}) => {
  const frame = useCurrentFrame();
  const {durationInFrames: d} = useVideoConfig();
  const o = useSceneFade();
  const bubble = appear(frame, 4, 20) * interpolate(frame, [split - 10, split + 8], [1, 0], clamp);
  const rw = interpolate(frame, [split, d - 10], [0, 1], {...clamp, easing: ease});
  const lines = [520, 440, 500, 360];
  return (
    <AbsoluteFill style={{opacity: o}}>
      <Svg>
        <g opacity={bubble} transform={`translate(0 ${(1 - appear(frame, 4, 20)) * 30})`}>
          <rect x={170} y={470} width={740} height={460} rx={46} fill="#2b1c12" stroke="#e9b86c" strokeOpacity={0.5} strokeWidth={3} />
          <path d="M 760 930 L 820 1010 L 700 930 Z" fill="#2b1c12" />
          <text x={860} y={590} fontFamily="Assistant" fontSize={120} fill="#e9b86c" opacity={0.6} textAnchor="middle">
            ”
          </text>
          {lines.map((w, i) => {
            const t = appear(frame, 14 + i * 10, 22);
            return (
              <rect key={i} x={830 - w * t} y={620 + i * 70} width={w * t} height={22} rx={11} fill="#f7ead6" opacity={0.35 + 0.25 * Math.sin(frame * 0.1 + i)} />
            );
          })}
        </g>
        <g opacity={rw}>
          <g transform={`rotate(${-rw * 360} 540 760)`}>
            <circle cx={540} cy={760} r={300} fill="none" stroke="#e9b86c" strokeOpacity={0.35} strokeWidth={3} strokeDasharray="6 18" />
            <Dot x={540} y={460} r={28} seed={9} />
          </g>
          <circle cx={540} cy={760} r={360} fill="url(#halo)" opacity={0.5 * rw} />
          <Cup x={540} y={860} scale={0.9} steam={rw} seed={2} />
        </g>
      </Svg>
      <Title y={360} size={56} weight={300} color={C.gold} o={rw}>
        שנה אחורה
      </Title>
    </AbsoluteFill>
  );
};

// 9. Bereishit: starting over. Let there be light.
export const SceneBereishit: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames: d} = useVideoConfig();
  const o = useSceneFade(8);
  const light = interpolate(frame, [d * 0.35, d * 0.75], [0, 1], {...clamp, easing: ease});
  return (
    <AbsoluteFill style={{opacity: o}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 30%, rgba(255,214,150,${0.55 * light}) 0%, rgba(255,160,70,${0.18 * light}) 35%, rgba(0,0,0,0) 70%)`,
        }}
      />
      <Title y={520} size={42} weight={400} color={C.gold} o={appear(frame, 4)}>
        מוצאי שבת
      </Title>
      <Title y={680} size={170} weight={800} glow={light > 0.2} o={appear(frame, 6, 24)} color={light > 0.5 ? '#fff6e4' : C.cream}>
        בראשית
      </Title>
      <Title y={880} size={60} weight={300} color={C.gold} o={light}>
        יהי אור
      </Title>
    </AbsoluteFill>
  );
};

// 10. Empty chair waiting at the table.
export const SceneChair: React.FC<{split: number}> = ({split}) => {
  const frame = useCurrentFrame();
  const {durationInFrames: d} = useVideoConfig();
  const o = useSceneFade(14, 10);
  const zoom = interpolate(frame, [0, d], [1, 1.08]);
  const q = appear(frame, split, 16);
  return (
    <AbsoluteFill style={{opacity: o}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: '50% 60%'}}>
        <Svg>
          <circle cx={540} cy={800} r={560} fill="url(#halo)" opacity={0.35} />
          <Chair x={720} y={1060} scale={0.95} o={appear(frame, 4, 24)} />
          <Table y={1000} />
          <Cup x={360} y={1060} scale={1.1} seed={5} />
          <Cup x={720} y={1060} scale={1.1} seed={6} steam={appear(frame, 10, 30)} />
          <Candle x={540} y={1060} scale={1.0} height={200} lit={1} seed={7} />
        </Svg>
      </AbsoluteFill>
      <Title y={360} size={110} weight={800} glow o={q} dy={(1 - q) * 20}>
        אולי זו את?
      </Title>
      <Vignette />
    </AbsoluteFill>
  );
};

// 11. End card.
export const SceneEnd: React.FC = () => {
  const frame = useCurrentFrame();
  const o = useSceneFade(14, 1);
  return (
    <AbsoluteFill style={{opacity: o}}>
      <Svg>
        <circle cx={540} cy={1130} r={420} fill="url(#halo)" opacity={0.7} />
        <Cup x={460} y={1210} scale={0.85} />
        <Candle x={650} y={1210} scale={0.85} height={190} lit={1} seed={8} />
      </Svg>
      <Title y={360} size={46} weight={400} color={C.gold} o={appear(frame, 2)}>
        הגרלת חשוון
      </Title>
      <Title y={470} size={100} weight={800} glow o={appear(frame, 6)}>
        פגישת קפה
      </Title>
      <Title y={580} size={48} weight={400} o={appear(frame, 12)}>
        שעתיים איתי, במתנה
      </Title>
      <Title y={720} size={52} weight={600} color="#fff3dc" o={appear(frame, 20)}>
        ההגרלה: מוצ״ש בראשית, 23:00
      </Title>
      <div
        style={{
          position: 'absolute',
          left: 190,
          right: 190,
          top: 800,
          height: 96,
          borderRadius: 48,
          background: 'linear-gradient(90deg, #f0b15a, #ffd08a)',
          opacity: appear(frame, 28),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          direction: 'rtl',
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 46,
          color: '#2a160a',
          boxShadow: '0 0 60px rgba(255,170,70,0.45)',
        }}
      >
        להרשמה: בקישור המצורף
      </div>
    </AbsoluteFill>
  );
};
