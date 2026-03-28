import React from "react";
import { Composition } from "remotion";
import { KnowledgeVideo } from "./compositions/KnowledgeVideo";

// Default total frames — overridden by the renderer via --frames flag
const DEFAULT_DURATION_FRAMES = 1800; // 60s @ 30fps

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="KnowledgeVideo"
      component={KnowledgeVideo}
      durationInFrames={DEFAULT_DURATION_FRAMES}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
