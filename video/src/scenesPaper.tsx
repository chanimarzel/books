import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {
  CutStar,
  Enter,
  P,
  PaperCandle,
  PaperCup,
  PaperDefs,
  PaperFlame,
  Steam,
  Strip,
  Tape,
  Torn,
  circlePts,
  clamp,
  ease,
  random,
  rect,
  useFade,
} from './paper';

const Svg: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
    <PaperDefs />
    {children}
  </svg>
);

// Slow drift so still frames breathe.
const useDrift = (amount = 0.04) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return 1 + interpolate(frame, [0, durationInFrames], [0, amount]);
};

const Drift: React.FC<{children: React.ReactNode; amount?: number}> = ({children, amount}) => {
  const z = useDrift(amount);
  return <g transform={`translate(540 800) scale(${z}) translate(-540 -800)`}>{children}</g>;
};

// Navy torn backdrop sheet used by most scenes.
const Backdrop: React.FC<{seed: string; color?: string; y0?: number; y1?: number}> = ({
  seed,
  color = P.navy,
  y0 = 250,
  y1 = 1290,
}) => <Torn pts={rect(60, y0, 960, y1 - y0)} fill={color} amp={24} seed={seed} />;

// 1. One cup, one candle on the table.
export const SceneTable: React.FC = () => {
  const o = useFade(10);
  return (
    <AbsoluteFill style={{opacity: o}}>
      <Svg>
        <Drift>
          <Enter at={0} x={540} y={770} from={0.85}>
            <Backdrop seed="t-bg" />
            <Tape x={200} y={262} r={-8} />
            <Tape x={890} y={252} r={6} />
          </Enter>
          <Enter at={6} x={540} y={760} rot={-2}>
            <Torn pts={rect(150, 520, 780, 470)} fill={P.orange} amp={20} seed="t-glow" />
          </Enter>
          {[
            [190, 420],
            [330, 360],
            [850, 400],
            [940, 470],
          ].map(([x, y], i) => (
            <Enter key={i} at={10 + i * 3} x={x} y={y}>
              <CutStar x={x} y={y} seed={`t-s${i}`} />
            </Enter>
          ))}
          <Enter at={12} x={540} y={1190} drop={60}>
            <Torn pts={rect(40, 1080, 1000, 260)} fill={P.brown} amp={26} seed="t-tbl" />
          </Enter>
          <Enter at={18} x={420} y={1100} drop={-80}>
            <Steam x={420} y={860} />
            <PaperCup x={420} y={1110} seed="t-cup" />
          </Enter>
          <Enter at={24} x={740} y={1100} drop={-80}>
            <PaperCandle x={740} y={1110} seed="t-cnd" />
          </Enter>
          <Tape x={560} y={1090} r={-3} />
        </Drift>
        <Enter at={4} x={540} y={330} rot={-3}>
          <Strip text="לפני שנה" y={330} size={84} rot={-3} seed="t-title" bg={P.cream} />
        </Enter>
      </Svg>
    </AbsoluteFill>
  );
};

// 2. The contract.
export const SceneContract: React.FC<{at: number[]; sign: number}> = ({at, sign: signAt}) => {
  const frame = useCurrentFrame();
  const o = useFade();
  const items = ['פעם בחודש', 'שעתיים איתי', 'במתנה', 'בלי למכור. רק לתת.'];
  const rots = [-2, 1.5, -1, 2];
  const sign = interpolate(frame, [signAt, signAt + 18], [0, 1], clamp);
  return (
    <AbsoluteFill style={{opacity: o}}>
      <Svg>
        <Drift amount={0.03}>
          <Enter at={0} x={540} y={780} rot={-1.5} from={0.7}>
            <Torn pts={rect(110, 290, 860, 1000)} fill={P.cream} amp={16} seed="c-sheet" />
            <Torn pts={rect(150, 330, 780, 920)} fill="none" amp={0} seed="c-x" shadow={false} />
            {[...Array(9)].map((_, i) => (
              <line key={i} x1={170} x2={910} y1={600 + i * 62} y2={600 + i * 62} stroke={P.kraftDark} strokeWidth={2} />
            ))}
            <Tape x={180} y={300} r={-30} />
            <Tape x={900} y={300} r={30} />
          </Enter>
          <Enter at={4} x={540} y={410} rot={-2}>
            <Strip text="חוזה שת״פ" y={410} size={92} bg={P.navy} color={P.cream} rot={-2} seed="c-t1" />
          </Enter>
          <Enter at={8} x={540} y={520} rot={1.5}>
            <Strip text="עם הקב״ה" y={520} size={60} bg={P.mustard} color={P.navy} rot={1.5} seed="c-t2" />
          </Enter>
          {items.map((t, i) => (
            <Enter key={t} at={at[i]} x={540} y={650 + i * 105} rot={rots[i]}>
              <Strip
                text={t}
                y={650 + i * 105 + (i === 3 ? 20 : 0)}
                size={i === 3 ? 62 : 58}
                bg={i === 3 ? P.orange : P.kraft}
                color={i === 3 ? P.cream : P.navy}
                rot={rots[i]}
                seed={`c-i${i}`}
              />
            </Enter>
          ))}
          <Enter at={at[2] + 6} x={800} y={880} rot={8}>
            <g transform="rotate(8 800 880)">
              <Torn pts={circlePts(820, 860, 92, 28)} fill={P.rust} amp={6} seed="c-seal" shadow="shs" />
              <text x={820} y={850} fontFamily="Assistant" fontWeight={800} fontSize={30} fill={P.cream} textAnchor="middle">
                בשווי
              </text>
              <text x={820} y={888} fontFamily="Assistant" fontWeight={800} fontSize={34} fill={P.cream} textAnchor="middle" direction="rtl">
                3,000 ₪
              </text>
            </g>
          </Enter>
          <path
            d="M 300 1170 c 40 -50 70 -10 100 -30 s 60 -40 90 0 s 70 10 120 -20"
            stroke={P.navy}
            strokeWidth={7}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={420}
            strokeDashoffset={420 * (1 - sign)}
          />
          <line x1={260} y1={1195} x2={820} y2={1195} stroke={P.brown} strokeWidth={3} strokeDasharray="10 8" />
        </Drift>
      </Svg>
    </AbsoluteFill>
  );
};

// Confetti pieces: small torn paper bits.
const PIECES = new Array(350).fill(0).map((_, i) => ({
  x: 110 + random(`p-x-${i}`) * 860,
  y: 300 + random(`p-y-${i}`) * 960,
  r: random(`p-r-${i}`) * 360,
  s: 0.6 + random(`p-s-${i}`) * 0.7,
  c: [P.cream, P.mustard, P.orange, P.flame][Math.floor(random(`p-c-${i}`) * 4)],
  d: random(`p-d-${i}`),
}));

const Piece: React.FC<{x: number; y: number; r: number; s: number; c: string; o?: number}> = ({x, y, r, s, c, o = 1}) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} opacity={o}>
    <PaperFlameMini fill={c} />
  </g>
);

// Tiny flame-shaped bit, cheap (no filters, no boil).
const PaperFlameMini: React.FC<{fill: string}> = ({fill}) => (
  <path d="M 0 -22 C 14 -8, 13 8, 0 10 C -13 8, -14 -8, 0 -22 Z" fill={fill} stroke="#00000022" strokeWidth={1.5} />
);

// 3. Seventy expected, three hundred fifty registered.
export const SceneCount: React.FC<{split: number}> = ({split}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const o = useFade();
  const first = interpolate(frame, [4, split - 6], [0, 70], {...clamp, easing: ease});
  const second = interpolate(frame, [split, split + 36], [70, 350], {...clamp, easing: ease});
  const big = frame >= split;
  const n = big ? Math.round(second) : Math.round(first);
  const pop = spring({frame: frame - split, fps, config: {damping: 9, stiffness: 160}});
  return (
    <AbsoluteFill style={{opacity: o}}>
      <Svg>
        <Backdrop seed="n-bg" />
        <Tape x={540} y={255} r={2} w={180} />
        {PIECES.map((p, i) => {
          if (i < 70) {
            const t = interpolate(frame, [4 + (i / 70) * (split - 14), 12 + (i / 70) * (split - 14)], [0, 1], clamp);
            return t > 0 ? <Piece key={i} x={p.x} y={p.y - (1 - t) * 40} r={p.r} s={p.s} c={p.c} o={t} /> : null;
          }
          const t = interpolate(frame, [split + p.d * 24, split + 14 + p.d * 24], [0, 1], {...clamp, easing: ease});
          if (t <= 0) return null;
          return <Piece key={i} x={540 + (p.x - 540) * t} y={760 + (p.y - 760) * t} r={p.r * t} s={p.s} c={p.c} o={t} />;
        })}
        <g transform={`translate(540 770) scale(${big ? 1 + pop * 0.12 : 1}) rotate(${big ? -3 : 2}) translate(-540 -770)`}>
          <Torn pts={rect(270, 610, 540, 320)} fill={big ? P.orange : P.cream} amp={16} seed={big ? 'n-tag2' : 'n-tag1'} />
          <text
            x={540}
            y={835}
            fontFamily="Assistant"
            fontWeight={800}
            fontSize={240}
            fill={big ? P.cream : P.navy}
            textAnchor="middle"
          >
            {n}
          </text>
        </g>
        <Strip text={big ? 'נרשמו' : 'חשבתי'} y={580} size={54} bg={P.mustard} rot={-4} seed={big ? 'n-l2' : 'n-l1'} />
        <Strip text="נשים" x={640} y={960} size={50} bg={P.cream} rot={3} seed="n-l3" />
      </Svg>
    </AbsoluteFill>
  );
};

// 4. So many lights, and I am one.
export const SceneOne: React.FC<{split: number}> = ({split}) => {
  const frame = useCurrentFrame();
  const o = useFade();
  const fall = interpolate(frame, [split - 6, split + 20], [0, 1], {...clamp, easing: ease});
  return (
    <AbsoluteFill style={{opacity: o}}>
      <Svg>
        <Backdrop seed="o-bg" />
        <clipPath id="o-clip">
          <rect x={70} y={260} width={940} height={1020} />
        </clipPath>
        <g clipPath="url(#o-clip)">
        {PIECES.map((p, i) => (
          <Piece
            key={i}
            x={p.x}
            y={p.y - frame * (0.4 + p.d * 0.8) + fall * (300 + p.d * 700)}
            r={p.r + frame * (p.d - 0.5) * 2}
            s={p.s}
            c={p.c}
            o={1 - fall * 0.85}
          />
        ))}
        </g>
        <Enter at={split - 8} x={540} y={1160} drop={120}>
          <PaperCandle x={540} y={1180} s={1.25} seed="o-c" />
        </Enter>
        <Enter at={8} x={540} y={360} rot={-2}>
          <g opacity={1 - fall}>
            <Strip text="אור שמבקש לצאת לאור" y={360} size={60} bg={P.cream} rot={-2} seed="o-t1" />
          </g>
        </Enter>
        <Enter at={split} x={540} y={360} rot={3}>
          <Strip text="ואני אחת" y={360} size={84} bg={P.mustard} rot={3} seed="o-t2" />
        </Enter>
      </Svg>
    </AbsoluteFill>
  );
};

// 5. The bot is born: paper sunburst.
export const SceneBot: React.FC = () => {
  const frame = useCurrentFrame();
  const o = useFade();
  const rays = 16;
  return (
    <AbsoluteFill style={{opacity: o}}>
      <Svg>
        <Backdrop seed="b-bg" color={P.navyDeep} />
        <Enter at={0} x={540} y={800} from={0.2}>
          <g transform={`rotate(${frame * 0.4} 540 800)`}>
            {new Array(rays).fill(0).map((_, i) => {
              const a1 = (i / rays) * Math.PI * 2;
              const a2 = ((i + 0.5) / rays) * Math.PI * 2;
              return (
                <Torn
                  key={i}
                  pts={[
                    [540, 800],
                    [540 + Math.cos(a1) * 620, 800 + Math.sin(a1) * 620],
                    [540 + Math.cos(a2) * 620, 800 + Math.sin(a2) * 620],
                  ]}
                  fill={i % 2 ? P.mustard : P.orange}
                  amp={8}
                  seed={`b-r${i}`}
                  shadow={false}
                  opacity={0.9}
                />
              );
            })}
          </g>
        </Enter>
        <Enter at={6} x={540} y={800} from={0.3}>
          <Torn pts={circlePts(540, 860, 250, 40)} fill={P.cream} amp={10} seed="b-disk" />
          <PaperCandle x={540} y={1060} s={1.0} seed="b-c" />
        </Enter>
        <Enter at={10} x={540} y={430} rot={-3} from={0.2}>
          <Strip text="יוצאת לאור" y={430} size={120} bg={P.navy} color={P.cream} rot={-3} seed="b-t" />
        </Enter>
        <Enter at={4} x={540} y={300} rot={2}>
          <Strip text="ככה נולד הבוט" y={300} size={46} bg={P.cream} rot={2} seed="b-t2" />
        </Enter>
      </Svg>
    </AbsoluteFill>
  );
};

// 6. A candle for one, a candle for a hundred.
export const SceneTree: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames: d} = useVideoConfig();
  const o = useFade();
  const levels = 7;
  const nodes: {x: number; y: number; lvl: number; px?: number; py?: number}[] = [];
  for (let l = 0; l < levels; l++) {
    const count = 2 ** l;
    const y = 1200 - l * 100;
    for (let k = 0; k < count; k++) {
      const x = 540 + ((k + 0.5) / count - 0.5) * (100 + l * 140);
      const parent = l === 0 ? undefined : nodes[2 ** (l - 1) - 1 + Math.floor(k / 2)];
      nodes.push({x, y, lvl: l, px: parent?.x, py: parent?.y});
    }
  }
  const per = (d * 0.72) / levels;
  return (
    <AbsoluteFill style={{opacity: o}}>
      <Svg>
        <Backdrop seed="r-bg" />
        {nodes.map((n, i) => {
          if (n.px === undefined) return null;
          const t = interpolate(frame, [n.lvl * per, n.lvl * per + per], [0, 1], {...clamp, easing: ease});
          return (
            <line
              key={`l${i}`}
              x1={n.px}
              y1={n.py}
              x2={n.px + (n.x - n.px) * t}
              y2={n.py! + (n.y - n.py!) * t}
              stroke={P.cream}
              strokeOpacity={0.55}
              strokeWidth={2.5}
              strokeDasharray="7 6"
            />
          );
        })}
        {nodes.map((n, i) => {
          const at = n.lvl * per + per * 0.75;
          if (frame < at) return null;
          const s = Math.min(1, (frame - at) / 8);
          const size = n.lvl === 0 ? 0.42 : Math.max(0.12, 0.3 - n.lvl * 0.03);
          return n.lvl < 3 ? (
            <g key={i} transform={`translate(${n.x} ${n.y}) scale(${s}) translate(${-n.x} ${-n.y})`}>
              <PaperFlame x={n.x} y={n.y + 20} s={size} seed={`r-n${i}`} />
            </g>
          ) : (
            <g key={i} transform={`translate(${n.x} ${n.y}) scale(${s * (1.6 - n.lvl * 0.15)})`}>
              <PaperFlameMini fill={[P.mustard, P.orange, P.flame][i % 3]} />
            </g>
          );
        })}
        <Enter at={4} x={340} y={380} rot={-4}>
          <Strip text="נר לאחד" x={340} y={380} size={70} bg={P.cream} rot={-4} seed="r-t1" />
        </Enter>
        <Enter at={Math.round(d * 0.55)} x={730} y={420} rot={3} from={0.2}>
          <Strip text="נר למאה" x={730} y={420} size={80} bg={P.mustard} rot={3} seed="r-t2" />
        </Enter>
      </Svg>
    </AbsoluteFill>
  );
};

// 7. Twelve women around the table (top view).
export const SceneTwelve: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames: d} = useVideoConfig();
  const o = useFade();
  const cx = 540;
  const cy = 830;
  const shown = interpolate(frame, [8, d * 0.7], [0, 12], clamp);
  return (
    <AbsoluteFill style={{opacity: o}}>
      <Svg>
        <Backdrop seed="w-bg" color={P.teal} />
        <Enter at={0} x={cx} y={cy} from={0.6}>
          <Torn pts={circlePts(cx, cy, 340, 48)} fill={P.brown} amp={14} seed="w-tbl" />
          <Torn pts={circlePts(cx, cy, 300, 48)} fill={P.brownDark} amp={8} seed="w-tbl2" shadow={false} />
        </Enter>
        {new Array(12).fill(0).map((_, i) => {
          const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
          const x = cx + Math.cos(a) * 240;
          const y = cy + Math.sin(a) * 240;
          return (
            <Enter key={i} at={8 + ((d * 0.7 - 8) / 12) * i} x={x} y={y} from={0.2}>
              <Torn pts={circlePts(x, y, 50, 18)} fill={P.cream} amp={5} seed={`w-c${i}`} shadow="shs" />
              <Torn pts={circlePts(x, y, 33, 16)} fill="#4a2a17" amp={3} seed={`w-k${i}`} shadow={false} />
            </Enter>
          );
        })}
        <PaperFlame x={cx} y={cy + 50} s={0.55} seed="w-fl" />
        <Enter at={4} x={540} y={330} rot={-3}>
          <g transform="rotate(-3 540 330)">
            <Torn pts={rect(400, 250, 280, 170)} fill={P.mustard} amp={12} seed="w-n" />
            <text x={540} y={385} fontFamily="Assistant" fontWeight={800} fontSize={140} fill={P.navy} textAnchor="middle">
              {Math.round(shown)}
            </text>
          </g>
        </Enter>
      </Svg>
    </AbsoluteFill>
  );
};

const MONTHS = ['אלול', 'אב', 'תמוז', 'סיון', 'אייר', 'ניסן', 'אדר', 'שבט', 'טבת', 'כסלו', 'חשוון', 'תשרי'];

// 8. A woman shared; then a tear-off calendar flips back one year.
export const SceneShare: React.FC<{split: number}> = ({split}) => {
  const frame = useCurrentFrame();
  const {durationInFrames: d} = useVideoConfig();
  const o = useFade();
  const bubbleOut = interpolate(frame, [split - 8, split + 6], [1, 0], clamp);
  const flipLen = Math.max(24, d - split - 20);
  const idx = Math.min(MONTHS.length - 1, Math.floor(interpolate(frame, [split + 4, split + 4 + flipLen], [0, MONTHS.length - 0.01], clamp)));
  const calendarIn = frame >= split - 2;
  return (
    <AbsoluteFill style={{opacity: o}}>
      <Svg>
        <Backdrop seed="s-bg" />
        <g opacity={bubbleOut}>
          <Enter at={2} x={540} y={760} from={0.3} rot={-2}>
            <g transform="rotate(-2 540 760)">
              <Torn
                pts={[
                  [170, 470],
                  [910, 450],
                  [930, 1010],
                  [720, 1020],
                  [800, 1140],
                  [610, 1025],
                  [150, 1040],
                ]}
                fill={P.cream}
                amp={12}
                seed="s-bub"
              />
              <text x={830} y={620} fontFamily="Assistant" fontWeight={800} fontSize={200} fill={P.orange} textAnchor="middle">
                ”
              </text>
            </g>
          </Enter>
          <Enter at={12} x={540} y={830} from={0.2}>
            <PaperCandle x={540} y={960} s={0.85} seed="s-c" />
          </Enter>
        </g>
        {calendarIn && (
          <Enter at={split - 2} x={540} y={780} from={0.5}>
            <Torn pts={rect(250, 500, 580, 640)} fill={P.cream} amp={12} seed="s-cal" />
            <Torn pts={rect(250, 500, 580, 150)} fill={P.rust} amp={10} seed="s-calh" shadow={false} />
            {[340, 440, 540, 640, 740].map((x) => (
              <circle key={x} cx={x} cy={510} r={12} fill={P.navyDeep} />
            ))}
            <text x={540} y={605} fontFamily="Assistant" fontWeight={800} fontSize={60} fill={P.cream} textAnchor="middle">
              לפני שנה
            </text>
            <text
              key={idx}
              x={540}
              y={930}
              fontFamily="Assistant"
              fontWeight={800}
              fontSize={idx === MONTHS.length - 1 ? 190 : 170}
              fill={idx === MONTHS.length - 1 ? P.orange : P.navy}
              textAnchor="middle"
            >
              {MONTHS[idx]}
            </text>
          </Enter>
        )}
      </Svg>
    </AbsoluteFill>
  );
};

// 9. Bereishit: the dark sheet tears open to light.
export const SceneBereishit: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames: d} = useVideoConfig();
  const o = useFade(6);
  const open = interpolate(frame, [d * 0.3, d * 0.7], [0, 1], {...clamp, easing: ease});
  const gap = open * 330;
  return (
    <AbsoluteFill style={{opacity: o}}>
      <Svg>
        {/* light behind */}
        <Torn pts={rect(60, 250, 960, 1040)} fill={P.mustard} amp={20} seed="g-l" />
        <Torn pts={circlePts(540, 770, 300, 40)} fill={P.flame} amp={14} seed="g-sun" shadow={false} />
        {new Array(8).fill(0).map((_, i) => (
          <CutStar key={i} x={200 + ((i * 97) % 680)} y={360 + ((i * 173) % 820)} s={0.9} fill={P.cream} seed={`g-s${i}`} />
        ))}
        {/* tearing halves */}
        <g transform={`translate(${-gap} 0) rotate(${-open * 4} 60 770)`}>
          <Torn pts={[[50, 240], [560, 240], [500, 520], [580, 800], [510, 1040], [560, 1300], [50, 1300]]} fill={P.navy} amp={16} seed="g-a" />
        </g>
        <g transform={`translate(${gap} 0) rotate(${open * 4} 1020 770)`}>
          <Torn pts={[[560, 240], [1030, 240], [1030, 1300], [560, 1300], [510, 1040], [580, 800], [500, 520]]} fill={P.navy} amp={16} seed="g-b" />
        </g>
        <Enter at={2} x={540} y={600} rot={-2}>
          <Strip text="מוצאי שבת" y={560} size={52} bg={P.cream} rot={-2} seed="g-t0" />
        </Enter>
        <Enter at={6} x={540} y={720} rot={2} from={0.3}>
          <Strip text="בראשית" y={720} size={140} bg={P.orange} color={P.cream} rot={2} seed="g-t1" />
        </Enter>
        <Enter at={Math.round(d * 0.6)} x={540} y={900} rot={-3}>
          <Strip text="יהי אור" y={900} size={76} bg={P.navy} color={P.flame} rot={-3} seed="g-t2" />
        </Enter>
      </Svg>
    </AbsoluteFill>
  );
};

// Paper chair, side view. (x, y) is floor center.
const PaperChair: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g>
    <Torn pts={rect(x - 120 * s, y - 540 * s, 240 * s, 60 * s)} fill={P.rust} amp={6} seed="ch-top" />
    <Torn pts={rect(x - 120 * s, y - 540 * s, 34 * s, 540 * s)} fill={P.rust} amp={5} seed="ch-l" />
    <Torn pts={rect(x + 86 * s, y - 540 * s, 34 * s, 540 * s)} fill={P.rust} amp={5} seed="ch-r" />
    <Torn pts={rect(x - 120 * s, y - 420 * s, 240 * s, 26 * s)} fill={P.rust} amp={4} seed="ch-m" />
    <Torn pts={rect(x - 150 * s, y - 260 * s, 300 * s, 46 * s)} fill={P.orange} amp={6} seed="ch-seat" />
  </g>
);

// 10. Empty chair waiting at the table.
export const SceneChair: React.FC<{split: number}> = ({split}) => {
  const o = useFade(10, 6);
  return (
    <AbsoluteFill style={{opacity: o}}>
      <Svg>
        <Drift amount={0.05}>
          <Backdrop seed="h-bg" />
          <Tape x={190} y={262} r={-8} />
          <Tape x={890} y={252} r={6} />
          <Enter at={4} x={760} y={1000} drop={-60}>
            <PaperChair x={760} y={1110} s={0.95} />
          </Enter>
          <Torn pts={rect(40, 1060, 1000, 260)} fill={P.brown} amp={26} seed="h-tbl" />
          <Steam x={330} y={830} s={0.9} />
          <PaperCup x={330} y={1090} s={0.9} seed="h-cup1" />
          <Enter at={10} x={760} y={1080} drop={-60}>
            <Steam x={760} y={830} s={0.9} />
            <PaperCup x={760} y={1090} s={0.9} seed="h-cup2" />
          </Enter>
          <PaperCandle x={545} y={1090} s={0.9} seed="h-c" />
        </Drift>
        <Enter at={split} x={540} y={400} rot={-3} from={0.2}>
          <Strip text="אולי זו את?" y={400} size={110} bg={P.mustard} rot={-3} seed="h-q" />
        </Enter>
      </Svg>
    </AbsoluteFill>
  );
};

// 11. End card.
export const SceneEnd: React.FC = () => {
  const o = useFade(10, 1);
  return (
    <AbsoluteFill style={{opacity: o}}>
      <Svg>
        <Enter at={0} x={540} y={780} from={0.8}>
          <Torn pts={rect(80, 260, 920, 1060)} fill={P.navy} amp={22} seed="e-bg" />
          <Tape x={200} y={272} r={-8} />
          <Tape x={880} y={262} r={6} />
        </Enter>
        <Enter at={3} x={540} y={360} rot={2}>
          <Strip text="הגרלת חשוון" y={360} size={50} bg={P.mustard} rot={2} seed="e-1" />
        </Enter>
        <Enter at={7} x={540} y={490} rot={-2} from={0.3}>
          <Strip text="פגישת קפה" y={490} size={110} bg={P.cream} rot={-2} seed="e-2" />
        </Enter>
        <Enter at={12} x={540} y={620} rot={1}>
          <Strip text="שעתיים איתי, במתנה" y={620} size={54} bg={P.kraft} rot={1} seed="e-3" />
        </Enter>
        <Enter at={18} x={540} y={740} rot={-1}>
          <Strip text="ההגרלה: מוצ״ש בראשית, 23:00" y={740} size={52} bg={P.cream} rot={-1} seed="e-4" />
        </Enter>
        <Enter at={26} x={540} y={860} rot={2} from={0.2}>
          <Strip text="להרשמה: בקישור המצורף" y={860} size={60} bg={P.orange} color={P.cream} rot={2} seed="e-5" />
        </Enter>
        <Enter at={14} x={540} y={1150} drop={60}>
          <Torn pts={rect(100, 1150, 880, 140)} fill={P.brown} amp={18} seed="e-tbl" />
          <PaperCup x={440} y={1180} s={0.6} seed="e-cup" />
          <PaperCandle x={640} y={1180} s={0.55} seed="e-c" />
        </Enter>
      </Svg>
    </AbsoluteFill>
  );
};
