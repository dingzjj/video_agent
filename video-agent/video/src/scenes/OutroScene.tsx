import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { Scene, Theme } from "../types";
import { sp, SPRING_GENTLE, SPRING_SLOW } from "../utils/springs";

interface Props {
  scene: Scene;
  theme: Theme;
}

export const OutroScene: React.FC<Props> = ({ scene, theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgProgress = sp(frame, fps, 0, SPRING_SLOW);
  const textProgress = sp(frame, fps, 12, SPRING_GENTLE);

  // Subtle pulse effect
  const pulse = Math.sin((frame / fps) * Math.PI * 0.8) * 0.05 + 0.95;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: `radial-gradient(ellipse at center, ${theme.primary_color} 0%, ${theme.background_color} 70%)`,
        fontFamily: theme.font_family,
        opacity: bgProgress,
      }}
    >
      {/* Decorative ring */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          border: `2px solid ${theme.accent_color}33`,
          transform: `scale(${pulse})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          border: `1px solid ${theme.accent_color}1a`,
          transform: `scale(${pulse * 0.98})`,
        }}
      />

      {/* Accent line */}
      <div
        style={{
          width: `${textProgress * 120}px`,
          height: 4,
          background: theme.accent_color,
          borderRadius: 2,
          marginBottom: 40,
        }}
      />

      {/* Message */}
      <div
        style={{
          fontSize: 52,
          fontWeight: 600,
          color: theme.text_color,
          textAlign: "center",
          maxWidth: 1200,
          lineHeight: 1.4,
          padding: "0 120px",
          opacity: textProgress,
          transform: `scale(${interpolate(textProgress, [0, 1], [0.9, 1])})`,
        }}
      >
        {scene.message}
      </div>

      {/* Bottom accent */}
      <div
        style={{
          width: `${textProgress * 120}px`,
          height: 4,
          background: theme.accent_color,
          borderRadius: 2,
          marginTop: 40,
        }}
      />
    </div>
  );
};
