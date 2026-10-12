import React from 'react';
import {Composition} from 'remotion';
import {FinanceScene} from './FinanceScene';

// 5 seconds @ 30fps = 150 frames. 1920x1080 (use --scale=2 for 4K).
export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="FinanceAccounting"
      component={FinanceScene}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
