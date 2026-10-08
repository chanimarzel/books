import '@fontsource/assistant/300.css';
import '@fontsource/assistant/400.css';
import '@fontsource/assistant/600.css';
import '@fontsource/assistant/800.css';
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {C, FONT} from './elements';
import {
  SceneBereishit,
  SceneBot,
  SceneChair,
  SceneContract,
  SceneCount,
  SceneEnd,
  SceneOne,
  SceneShare,
  SceneTable,
  SceneTree,
  SceneTwelve,
} from './scenes';
import {
  ALL_CHUNKS,
  END_CARD_START,
  FPS,
  LINES,
  MUSIC_FILE,
  NARRATION_FILE,
  NARRATION_OFFSET,
  TOTAL_SECONDS,
  chunkAt,
  sec,
} from './timeline';

const OVERLAP = 10; // crossfade frames between scenes

// Scene list: which line each scene starts on.
const L = (i: number) => sec(LINES[i].start) - 6;

type Scene = {from: number; to: number; render: (from: number) => React.ReactNode};

const SCENES: Scene[] = [
  {from: 0, to: L(1), render: () => <SceneTable />},
  {
    from: L(1),
    to: L(2),
    render: (f) => (
      <SceneContract
        at={[
          sec(chunkAt('פעם בחודש').start) - f,
          sec(chunkAt('פעם בחודש').start + 0.9) - f,
          sec(chunkAt('במתנה').start) - f,
          sec(chunkAt('בלי למכור').start) - f,
        ]}
        sign={sec(chunkAt('רק לתת').start) - f}
      />
    ),
  },
  {from: L(2), to: L(4), render: (f) => <SceneCount split={sec(LINES[3].start) - f} />},
  {from: L(4), to: L(6), render: (f) => <SceneOne split={sec(LINES[5].start) - f} />},
  {from: L(6), to: L(7), render: () => <SceneBot />},
  {from: L(7), to: L(8), render: () => <SceneTree />},
  {from: L(8), to: L(9), render: () => <SceneTwelve />},
  {
    from: L(9),
    to: L(10),
    render: (f) => <SceneShare split={sec(chunkAt('וחזרתי').start) - f} />,
  },
  {from: L(10), to: L(11), render: () => <SceneBereishit />},
  {from: L(11), to: sec(END_CARD_START), render: (f) => <SceneChair split={sec(LINES[12].start) - f} />},
  {from: sec(END_CARD_START), to: sec(TOTAL_SECONDS), render: () => <SceneEnd />},
];

const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const idx = ALL_CHUNKS.findIndex((c, i) => {
    const next = ALL_CHUNKS[i + 1];
    // Hold a chunk through short pauses until the next one starts.
    const holdUntil = next ? Math.min(next.start, c.end + 0.5) : c.end + 0.5;
    return t >= c.start && t < holdUntil;
  });
  if (idx < 0) return null;
  const c = ALL_CHUNKS[idx];
  const o = interpolate(t, [c.start, c.start + 0.15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        position: 'absolute',
        left: 90,
        right: 90,
        top: 1330,
        display: 'flex',
        justifyContent: 'center',
        opacity: o,
      }}
    >
      <div
        style={{
          direction: 'rtl',
          unicodeBidi: 'plaintext',
          textAlign: 'center',
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: 58,
          lineHeight: 1.3,
          color: '#fffaf0',
          background: 'rgba(18, 11, 7, 0.55)',
          padding: '14px 34px 18px',
          borderRadius: 22,
          textShadow: '0 2px 10px rgba(0,0,0,0.6)',
        }}
      >
        {c.text}
      </div>
    </div>
  );
};

export const Video: React.FC = () => {
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 40%, ${C.bg2} 0%, ${C.bg} 70%)`}}>
      {SCENES.map((s, i) => {
        const from = Math.max(0, s.from - (i === 0 ? 0 : OVERLAP / 2));
        const to = Math.min(sec(TOTAL_SECONDS), s.to + OVERLAP / 2);
        return (
          <Sequence key={i} from={from} durationInFrames={to - from} layout="none">
            <AbsoluteFill>{s.render(from)}</AbsoluteFill>
          </Sequence>
        );
      })}
      <Captions />
      {NARRATION_FILE && (
        <Sequence from={sec(NARRATION_OFFSET)} layout="none">
          <Audio src={staticFile(NARRATION_FILE)} />
        </Sequence>
      )}
      {MUSIC_FILE && <Audio src={staticFile(MUSIC_FILE)} volume={NARRATION_FILE ? 0.22 : 0.8} />}
    </AbsoluteFill>
  );
};
