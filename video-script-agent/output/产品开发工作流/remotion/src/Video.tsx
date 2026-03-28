import { AbsoluteFill } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';

const SceneA: React.FC = () => (
  <AbsoluteFill style={{ background: '#111', alignItems: 'center', justifyContent: 'center' }}>
    <p style={{ color: '#fff', fontSize: 80 }}>Scene A</p>
  </AbsoluteFill>
);

const SceneB: React.FC = () => (
  <AbsoluteFill style={{ background: '#222', alignItems: 'center', justifyContent: 'center' }}>
    <p style={{ color: '#F97316', fontSize: 80 }}>Scene B</p>
  </AbsoluteFill>
);

export const Video: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={90}>
        <SceneA />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 12 })} />
      <TransitionSeries.Sequence durationInFrames={90}>
        <SceneB />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
