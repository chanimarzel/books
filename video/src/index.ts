import {Composition, registerRoot} from 'remotion';
import React from 'react';
import {Video} from './Video';
import {FPS, TOTAL_SECONDS} from './timeline';

const Root: React.FC = () =>
  React.createElement(Composition, {
    id: 'Main',
    component: Video,
    durationInFrames: Math.round(TOTAL_SECONDS * FPS),
    fps: FPS,
    width: 1080,
    height: 1920,
  });

registerRoot(Root);
