import { Composition } from 'remotion';
import { RAGVideo } from './Video';

// 总帧数 = 各场景帧数之和 - 转场帧数 * 转场次数
// 6场景 × 各帧数 - 6次转场 × 12帧
// (6+10+10+12+10+6+6)*30 - 6*12 = 1800 - 72 = 1728
const TOTAL_FRAMES = 1728;

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Video"
      component={RAGVideo}
      durationInFrames={TOTAL_FRAMES}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
