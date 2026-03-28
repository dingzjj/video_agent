import { Scene } from "../types";

export function secToFrames(seconds: number, fps: number): number {
  return Math.round(seconds * fps);
}

export function sceneStartFrame(scenes: Scene[], index: number, fps: number): number {
  return scenes
    .slice(0, index)
    .reduce((sum, s) => sum + secToFrames(s.duration_seconds, fps), 0);
}

export function totalFrames(scenes: Scene[], fps: number): number {
  return scenes.reduce((sum, s) => sum + secToFrames(s.duration_seconds, fps), 0);
}
