import {Composition, registerRoot} from 'remotion';
import React from 'react';
import {Video} from './Video';
import {StyleLayers, StylePop, StyleTorn} from './styletest';
import {FPS, TOTAL_SECONDS} from './timeline';

const still = (id: string, component: React.FC) =>
  React.createElement(Composition, {id, component, durationInFrames: 1, fps: FPS, width: 1080, height: 1920});

const Root: React.FC = () =>
  React.createElement(React.Fragment, null, still('StyleLayers', StyleLayers), still('StyleTorn', StyleTorn), still('StylePop', StylePop), React.createElement(Composition, {
    id: 'Main',
    component: Video,
    durationInFrames: Math.round(TOTAL_SECONDS * FPS),
    fps: FPS,
    width: 1080,
    height: 1920,
  }));

registerRoot(Root);
