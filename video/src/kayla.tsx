// Short chat-style video: a winner's message after her strategy meeting, and tonight's raffle.
import '@fontsource/assistant/400.css';
import '@fontsource/assistant/800.css';
import React from 'react';
import {AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Enter, FONT, Grain, P, PaperDefs, Strip, Tape, Torn, circlePts, clamp, ease, rect, wrap} from './paper';

export const K_FPS = 30;

type Msg = {text: string; me?: boolean};

// Kayla's messages, quoted from her WhatsApp (emojis removed, one typo fixed).
const MSGS: Msg[] = [
  {text: 'חני, מועדים לשמחה'},
  {text: 'חייבת לך תודה גדולה על פגישה מטורפת.'},
  {text: 'תוך שעתיים, קלטת את הרעיון, את הקונספט, לימדת אותי דברים דייקת אותי.'},
  {text: 'הפגישה הייתה קפיצת מדרגה בכל כך הרבה מובנים ובכל התחומים.'},
  {text: 'התחלתי לשווק את המערכים לשליחות, וגם לפתוח קבוצות חדשות של לומדות תניא אצלי בישובים.'},
  {text: 'וזה פשוט שדרג הכל, ועוד ישדרג! כי בתכלס נתת לי כלים ומיומנויות, וזה רק משתכלל.'},
  {text: 'שוב תודה לך, ותודה לאלוקים שזכיתי בהגרלה'},
  {text: 'יאאא איזה מרגש לקרוא את ההודעות שלך', me: true},
];

const INTRO = 75;
const TYPING = 16;
const readFrames = (t: string) => Math.round((0.9 + t.length * 0.045) * K_FPS);

// Layout
const SIZE = 44;
const LINE_H = 58;
const MAX_CHARS = 26;
const GAP = 26;
const CHAT_TOP = 470;
const CHAT_BOTTOM = 1450;

const layout = (() => {
  let t = INTRO;
  let y = CHAT_TOP;
  return MSGS.map((m) => {
    const lines = wrap(m.text, MAX_CHARS);
    const h = lines.length * LINE_H + 44;
    const longest = Math.max(...lines.map((l) => l.length));
    const w = Math.min(860, longest * SIZE * 0.5 + 70);
    const at = t + TYPING;
    const item = {...m, lines, h, w, y, typingAt: t, at};
    t = at + readFrames(m.text);
    y += h + GAP;
    return item;
  });
})();

const CHAT_END = layout[layout.length - 1].at + readFrames(MSGS[MSGS.length - 1].text);
const HIGHLIGHTS_END = CHAT_END + 95;
export const K_DURATION = HIGHLIGHTS_END + 210;

// Scroll so the newest bubble stays above CHAT_BOTTOM.
const scrollAt = (frame: number) => {
  let target = 0;
  let prev = 0;
  let from = 0;
  for (const b of layout) {
    const need = Math.max(0, b.y + b.h - CHAT_BOTTOM);
    if (frame >= b.typingAt) {
      prev = target;
      target = need;
      from = b.typingAt;
    }
  }
  return interpolate(frame, [from, from + 12], [prev, target], {...clamp, easing: ease});
};

const Bubble: React.FC<(typeof layout)[number]> = ({text, me, lines, h, w, y, at}) => {
  const right = !me;
  const x = right ? 980 - w : 100;
  return (
    <Enter at={at} x={right ? 980 : 100} y={y + h} from={0.5}>
      <Torn pts={rect(x, y, w, h)} fill={me ? P.mustard : P.cream} amp={8} seed={`k-b-${text.length}`} shadow="shs" />
      {lines.map((l, i) => (
        <text
          key={i}
          x={x + w - 34}
          y={y + 22 + SIZE + i * LINE_H - 6}
          fontFamily={FONT}
          fontWeight={i === 0 && text.startsWith('חני') ? 800 : 400}
          fontSize={SIZE}
          fill={P.navy}
          textAnchor="start"
          direction="rtl"
        >
          {l}
        </text>
      ))}
    </Enter>
  );
};

const Typing: React.FC<{y: number; me?: boolean; frame: number}> = ({y, me, frame}) => {
  const x = me ? 100 : 980 - 150;
  return (
    <g>
      <Torn pts={rect(x, y, 150, 84)} fill={me ? P.mustard : P.cream} amp={6} seed="k-typing" shadow="shs" />
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx={x + 45 + i * 30}
          cy={y + 42 - Math.max(0, Math.sin((frame - i * 4) * 0.35)) * 10}
          r={9}
          fill={P.navy}
          opacity={0.7}
        />
      ))}
    </g>
  );
};

const Chat: React.FC = () => {
  const frame = useCurrentFrame();
  const scroll = scrollAt(frame);
  const typing = layout.find((b) => frame >= b.typingAt && frame < b.at);
  const dim = interpolate(frame, [CHAT_END, CHAT_END + 12], [1, 0.35], clamp);
  return (
    <g opacity={dim}>
      <clipPath id="k-chat">
        <rect x={60} y={CHAT_TOP - 20} width={960} height={CHAT_BOTTOM - CHAT_TOP + 60} />
      </clipPath>
      <g clipPath="url(#k-chat)">
        <g transform={`translate(0 ${-scroll})`}>
          {layout.map((b, i) => (frame >= b.at ? <Bubble key={i} {...b} /> : null))}
          {typing && <Typing y={typing.y} me={typing.me} frame={frame} />}
        </g>
      </g>
    </g>
  );
};

const Header: React.FC = () => (
  <Enter at={INTRO - 12} x={540} y={370} from={0.6}>
    <Torn pts={rect(110, 310, 860, 120)} fill={P.navyDeep} amp={10} seed="k-head" shadow="shs" />
    <Torn pts={circlePts(890, 370, 42, 20)} fill={P.orange} amp={4} seed="k-av" shadow={false} />
    <text x={890} y={386} fontFamily={FONT} fontWeight={800} fontSize={44} fill={P.cream} textAnchor="middle">
      ק
    </text>
    <text x={820} y={386} fontFamily={FONT} fontWeight={800} fontSize={50} fill={P.cream} textAnchor="start" direction="rtl">
      קיילא
    </text>
    <text x={600} y={384} fontFamily={FONT} fontWeight={400} fontSize={32} fill={P.mustard} textAnchor="start" direction="rtl">
      זכתה בהגרלה
    </text>
  </Enter>
);

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [INTRO - 14, INTRO - 2], [1, 0], clamp);
  if (frame > INTRO) return null;
  return (
    <g opacity={o}>
      <Enter at={2} x={540} y={640} rot={-3} from={0.2}>
        <Strip text="שעתיים." y={640} size={130} bg={P.mustard} rot={-3} seed="k-i1" />
      </Enter>
      <Enter at={14} x={540} y={810} rot={2}>
        <Strip text="פגישת קפה אחת." y={810} size={80} bg={P.cream} rot={2} seed="k-i2" />
      </Enter>
      <Enter at={30} x={540} y={960} rot={-1.5}>
        <Strip text="וזו ההודעה שקיבלתי אחרי" y={960} size={60} bg={P.orange} color={P.cream} rot={-1.5} seed="k-i3" />
      </Enter>
    </g>
  );
};

const Highlights: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < CHAT_END || frame > HIGHLIGHTS_END + 10) return null;
  const o = interpolate(frame, [HIGHLIGHTS_END - 8, HIGHLIGHTS_END + 6], [1, 0], clamp);
  return (
    <g opacity={o}>
      <Enter at={CHAT_END + 4} x={540} y={700} rot={-3} from={0.2}>
        <Strip text="תוך שעתיים" y={700} size={96} bg={P.mustard} rot={-3} seed="k-h1" />
      </Enter>
      <Enter at={CHAT_END + 24} x={540} y={880} rot={2} from={0.2}>
        <Strip text="קפיצת מדרגה" y={880} size={96} bg={P.orange} color={P.cream} rot={2} seed="k-h2" />
      </Enter>
      <Enter at={CHAT_END + 44} x={540} y={1060} rot={-2} from={0.2}>
        <Strip text="קבוצות תניא חדשות" y={1060} size={80} bg={P.cream} rot={-2} seed="k-h3" />
      </Enter>
    </g>
  );
};

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const s = HIGHLIGHTS_END;
  if (frame < s - 4) return null;
  return (
    <g>
      <Enter at={s} x={540} y={800} from={0.85}>
        <Torn pts={rect(70, 260, 940, 1220)} fill={P.navy} amp={22} seed="k-e-bg" />
        <Tape x={200} y={272} r={-8} />
        <Tape x={880} y={262} r={6} />
      </Enter>
      <Enter at={s + 4} x={540} y={380} rot={2}>
        <Strip text="הגרלת חשוון" y={380} size={52} bg={P.mustard} rot={2} seed="k-e1" />
      </Enter>
      <Enter at={s + 8} x={540} y={520} rot={-2} from={0.3}>
        <Strip text="הערב ב-23:00" y={520} size={120} bg={P.cream} rot={-2} seed="k-e2" />
      </Enter>
      <Enter at={s + 16} x={540} y={670} rot={1}>
        <Strip text="שעתיים איתי לפגישת אסטרטגיה" y={670} size={50} bg={P.kraft} rot={1} seed="k-e3" />
      </Enter>
      <Enter at={s + 20} x={540} y={755} rot={-1}>
        <Strip text="במתנה לזוכה" y={755} size={50} bg={P.kraft} rot={-1} seed="k-e4" />
      </Enter>
      <Enter at={s + 30} x={540} y={900} rot={-3} from={0.2}>
        <Strip text="אולי זו את?" y={900} size={100} bg={P.mustard} rot={-3} seed="k-e5" />
      </Enter>
      <Enter at={s + 42} x={540} y={1050} rot={1}>
        <Strip text="גם אם נרשמת בעבר," y={1040} size={46} bg={P.cream} rot={1} seed="k-e6" />
        <Strip text="החודש נרשמים מחדש" y={1115} size={46} bg={P.cream} rot={-1} seed="k-e7" />
      </Enter>
      <Enter at={s + 52} x={540} y={1270} rot={2} from={0.2}>
        <Strip text="להרשמה: בקישור המצורף" y={1270} size={62} bg={P.orange} color={P.cream} rot={2} seed="k-e8" />
      </Enter>
    </g>
  );
};

export const KaylaVideo: React.FC = () => (
  <AbsoluteFill style={{background: P.kraft}}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
      <PaperDefs />
      <Torn pts={rect(60, 250, 960, 1290)} fill={P.navy} amp={24} seed="k-bg" />
      <Tape x={200} y={262} r={-8} />
      <Tape x={890} y={252} r={6} />
      <Intro />
      <Header />
      <Chat />
      <Highlights />
      <EndCard />
    </svg>
    <Grain />
    <Audio src={staticFile('music-kayla.wav')} volume={0.8} />
  </AbsoluteFill>
);
