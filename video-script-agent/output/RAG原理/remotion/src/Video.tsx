import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { useVideoConfig } from 'remotion';
import { Scene1Hook } from './scenes/Scene1Hook';
import { Scene2Compare } from './scenes/Scene2Compare';
import { Scene3Library } from './scenes/Scene3Library';
import { Scene4Flow } from './scenes/Scene4Flow';
import { Scene5UseCase } from './scenes/Scene5UseCase';
import { Scene6Benefits } from './scenes/Scene6Benefits';
import { Scene7Payoff } from './scenes/Scene7Payoff';

const TRANSITION_FRAMES = 12;

export const RAGVideo: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={6 * fps} premountFor={1 * fps}>
        <Scene1Hook />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
      />

      <TransitionSeries.Sequence durationInFrames={10 * fps} premountFor={1 * fps}>
        <Scene2Compare />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
      />

      <TransitionSeries.Sequence durationInFrames={10 * fps} premountFor={1 * fps}>
        <Scene3Library />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
      />

      <TransitionSeries.Sequence durationInFrames={12 * fps} premountFor={1 * fps}>
        <Scene4Flow />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
      />

      <TransitionSeries.Sequence durationInFrames={10 * fps} premountFor={1 * fps}>
        <Scene5UseCase />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
      />

      <TransitionSeries.Sequence durationInFrames={6 * fps} premountFor={1 * fps}>
        <Scene6Benefits />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
      />

      <TransitionSeries.Sequence durationInFrames={6 * fps} premountFor={1 * fps}>
        <Scene7Payoff />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
