import '@fontsource/assistant/800.css';
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {CutStar, Grain, P, PaperCandle, PaperCup, PaperDefs, Strip, Tape, Torn, rect} from './paper';

const Frame: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: P.kraft}}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
      <PaperDefs />
      {children}
    </svg>
    <Grain />
  </AbsoluteFill>
);

// A. The surprise numbers: 70 crossed out, 350 big.
export const CoverNumbers: React.FC = () => (
  <Frame>
    <Torn pts={rect(60, 250, 960, 1420)} fill={P.navy} amp={26} seed="cv-bg" />
    <Tape x={200} y={262} r={-8} />
    <Tape x={890} y={252} r={6} />
    {[
      [170, 420],
      [910, 380],
      [880, 1090],
      [190, 1150],
    ].map(([x, y], i) => (
      <CutStar key={i} x={x} y={y} seed={`cv-s${i}`} />
    ))}
    <Strip text="חשבתי שיירשמו" y={420} size={62} bg={P.cream} rot={-3} seed="cv-1" />
    <g transform="rotate(4 540 600)">
      <Torn pts={rect(380, 500, 320, 200)} fill={P.kraft} amp={12} seed="cv-70" />
      <text x={540} y={655} fontFamily="Assistant" fontWeight={800} fontSize={150} fill={P.navy} textAnchor="middle">
        70
      </text>
      <path d="M 370 640 L 710 560" stroke={P.rust} strokeWidth={22} strokeLinecap="round" />
    </g>
    <Strip text="נרשמו" y={800} size={62} bg={P.mustard} rot={2} seed="cv-2" />
    <g transform="rotate(-3 540 1000)">
      <Torn pts={rect(220, 860, 640, 300)} fill={P.orange} amp={18} seed="cv-350" />
      <text x={540} y={1080} fontFamily="Assistant" fontWeight={800} fontSize={250} fill={P.cream} textAnchor="middle">
        350
      </text>
    </g>
    <Strip text="ומשם הכול התחיל" y={1225} size={64} bg={P.cream} rot={-2} seed="cv-3" />
    <Torn pts={rect(80, 1520, 920, 140)} fill={P.brown} amp={20} seed="cv-tbl" />
    <PaperCup x={430} y={1560} s={0.55} seed="cv-cup" />
    <PaperCandle x={650} y={1560} s={0.5} seed="cv-cnd" />
  </Frame>
);

// B. The contract hook.
export const CoverContract: React.FC = () => (
  <Frame>
    <Torn pts={rect(60, 250, 960, 1420)} fill={P.navy} amp={26} seed="cc-bg" />
    <Tape x={200} y={262} r={-8} />
    <Tape x={890} y={252} r={6} />
    <g transform="rotate(-3 540 820)">
      <Torn pts={rect(170, 430, 740, 800)} fill={P.cream} amp={16} seed="cc-sheet" />
      {[...Array(7)].map((_, i) => (
        <line key={i} x1={220} x2={860} y1={760 + i * 60} y2={760 + i * 60} stroke={P.kraftDark} strokeWidth={2} />
      ))}
      <Tape x={240} y={440} r={-30} />
      <Tape x={840} y={440} r={30} />
    </g>
    <Strip text="יש לי חוזה שת״פ" y={570} size={84} bg={P.navy} color={P.cream} rot={-3} seed="cc-1" />
    <Strip text="עם הקב״ה" y={690} size={96} bg={P.mustard} rot={2} seed="cc-2" />
    <Strip text="וזה מה שקרה" y={890} size={58} bg={P.kraft} rot={-2} seed="cc-3" />
    <Strip text="בשנה אחת" y={985} size={58} bg={P.kraft} rot={1.5} seed="cc-4" />
    <path
      d="M 320 1140 c 40 -50 70 -10 100 -30 s 60 -40 90 0 s 70 10 120 -20"
      stroke={P.navy}
      strokeWidth={7}
      fill="none"
      strokeLinecap="round"
      transform="rotate(-3 540 820)"
    />
    <Torn pts={rect(80, 1430, 920, 200)} fill={P.brown} amp={20} seed="cc-tbl" />
    <PaperCup x={420} y={1470} s={0.62} seed="cc-cup" />
    <PaperCandle x={650} y={1470} s={0.6} seed="cc-cnd" />
  </Frame>
);
