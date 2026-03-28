export type SceneType = "title" | "bullet" | "split" | "image" | "diagram" | "step" | "outro";

export type AnimationType =
  | "fade_zoom_in"
  | "stagger_slide_up"
  | "slide_in_from_left"
  | "draw_arrows"
  | "ken_burns"
  | "fade_in_center"
  | "slide_in_steps";

export interface StepItem {
  number: number;
  title: string;
  description: string;
}

export interface DiagramNode {
  id: string;
  label: string;
  x: number; // 0-1
  y: number; // 0-1
}

export interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
}

export interface Scene {
  id: string;
  type: SceneType;
  duration_seconds: number;
  animation: AnimationType;
  image_query?: string;
  asset_path?: string; // relative to /public/

  // type-specific
  title?: string;
  subtitle?: string;
  heading?: string;
  body?: string;
  bullets?: string[];
  caption?: string;
  message?: string;
  nodes?: DiagramNode[];
  edges?: DiagramEdge[];
  steps?: StepItem[];
}

export interface Theme {
  primary_color: string;
  accent_color: string;
  background_color: string;
  font_family: string;
  text_color: string;
}

export interface Storyboard {
  title: string;
  total_duration_seconds: number;
  fps: number;
  resolution: { width: number; height: number };
  theme: Theme;
  scenes: Scene[];
}
