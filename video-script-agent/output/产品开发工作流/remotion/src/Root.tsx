import { Composition } from 'remotion';
import { Video } from './Video';

// 总帧数 = 8场景帧数之和 - 7个转场各12帧
// 210 + 240*6 + 150 - 7*12 = 210 + 1440 + 150 - 84 = 1716
const TOTAL_FRAMES = 1716;

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Video"
      component={Video}
      durationInFrames={TOTAL_FRAMES}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
