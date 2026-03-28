import { spring, SpringConfig } from "remotion";

export const SPRING_GENTLE: SpringConfig = { damping: 18, stiffness: 80, mass: 1 };
export const SPRING_SNAPPY: SpringConfig = { damping: 24, stiffness: 200, mass: 0.8 };
export const SPRING_SLOW: SpringConfig = { damping: 30, stiffness: 40, mass: 1.2 };
export const SPRING_BOUNCE: SpringConfig = { damping: 10, stiffness: 120, mass: 1 };

/**
 * Returns a spring value clamped to [0, 1].
 * Use as a multiplier for opacity, scale, translateX/Y.
 */
export function sp(
  frame: number,
  fps: number,
  delay = 0,
  config: SpringConfig = SPRING_GENTLE
): number {
  const val = spring({ frame: Math.max(0, frame - delay), fps, config });
  return Math.min(1, Math.max(0, val));
}

/**
 * Ease-in-out interpolation between two values using spring.
 */
export function lerp(from: number, to: number, progress: number): number {
  return from + (to - from) * progress;
}
