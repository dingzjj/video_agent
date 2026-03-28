import React, { useEffect, useState } from "react";
import {
  Sequence,
  delayRender,
  continueRender,
  staticFile,
  useVideoConfig,
} from "remotion";
import { Storyboard, Scene } from "../types";
import { TitleScene } from "../scenes/TitleScene";
import { BulletScene } from "../scenes/BulletScene";
import { SplitScene } from "../scenes/SplitScene";
import { ImageScene } from "../scenes/ImageScene";
import { DiagramScene } from "../scenes/DiagramScene";
import { StepScene } from "../scenes/StepScene";
import { OutroScene } from "../scenes/OutroScene";
import { secToFrames } from "../utils/timing";

// ── Scene router ──────────────────────────────────────────
function SceneRouter({ scene, theme }: { scene: Scene; theme: Storyboard["theme"] }) {
  switch (scene.type) {
    case "title":   return <TitleScene   scene={scene} theme={theme} />;
    case "bullet":  return <BulletScene  scene={scene} theme={theme} />;
    case "split":   return <SplitScene   scene={scene} theme={theme} />;
    case "image":   return <ImageScene   scene={scene} theme={theme} />;
    case "diagram": return <DiagramScene scene={scene} theme={theme} />;
    case "step":    return <StepScene    scene={scene} theme={theme} />;
    case "outro":   return <OutroScene   scene={scene} theme={theme} />;
    default:        return null;
  }
}

// ── Main composition ──────────────────────────────────────
export const KnowledgeVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  const [storyboard, setStoryboard] = useState<Storyboard | null>(null);
  const [handle] = useState(() => delayRender("Loading storyboard"));

  useEffect(() => {
    fetch(staticFile("storyboard.json"))
      .then((r) => r.json())
      .then((data: Storyboard) => {
        setStoryboard(data);
        continueRender(handle);
      })
      .catch((e) => {
        console.error("Failed to load storyboard:", e);
        continueRender(handle);
      });
  }, [handle]);

  if (!storyboard) {
    return <div style={{ width: "100%", height: "100%", background: "#0D1B2A" }} />;
  }

  const { scenes, theme } = storyboard;

  // Build cumulative start frames
  let offset = 0;
  const sequencedScenes = scenes.map((scene) => {
    const from = offset;
    const durationInFrames = secToFrames(scene.duration_seconds, fps);
    offset += durationInFrames;
    return { scene, from, durationInFrames };
  });

  return (
    <>
      {sequencedScenes.map(({ scene, from, durationInFrames }) => (
        <Sequence
          key={scene.id}
          from={from}
          durationInFrames={durationInFrames}
          name={`${scene.id} [${scene.type}]`}
        >
          {/* Full-frame container */}
          <div style={{ position: "absolute", inset: 0 }}>
            <SceneRouter scene={scene} theme={theme} />
          </div>
        </Sequence>
      ))}
    </>
  );
};
