import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { Scene, Theme } from "../types";
import { sp, SPRING_GENTLE, SPRING_SNAPPY } from "../utils/springs";

interface Props {
  scene: Scene;
  theme: Theme;
}

export const BulletScene: React.FC<Props> = ({ scene, theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headingProgress = sp(frame, fps, 0, SPRING_SNAPPY);
  const bullets = scene.bullets ?? [];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px 140px",
        background: `linear-gradient(150deg, ${theme.background_color} 50%, ${theme.primary_color}55 100%)`,
        fontFamily: theme.font_family,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle dot-grid background */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.06 }}
      >
        <defs>
          <pattern id="dotgrid" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
            <circle cx="24" cy="24" r="1.8" fill={theme.accent_color} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotgrid)" />
      </svg>

      {/* Decorative glow circle */}
      <div
        style={{
          position: "absolute",
          right: -180,
          bottom: -180,
          width: 560,
          height: 560,
          borderRadius: "50%",
          border: `2px solid ${theme.accent_color}20`,
          background: `radial-gradient(circle, ${theme.accent_color}08 0%, transparent 70%)`,
        }}
      />

      {/* Heading */}
      <div
        style={{
          fontSize: 58,
          fontWeight: 800,
          color: theme.text_color,
          marginBottom: 52,
          opacity: headingProgress,
          transform: `translateX(${interpolate(headingProgress, [0, 1], [-40, 0])}px)`,
          display: "flex",
          alignItems: "center",
          gap: 24,
        }}
      >
        <div
          style={{
            width: 8,
            height: 64,
            background: `linear-gradient(to bottom, ${theme.accent_color}, ${theme.primary_color}88)`,
            borderRadius: 4,
            flexShrink: 0,
          }}
        />
        {scene.heading}
      </div>

      {/* Bullet cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24, position: "relative" }}>
        {bullets.map((bullet, i) => {
          const delay = 12 + i * 16;
          const progress = sp(frame, fps, delay, SPRING_GENTLE);
          const x = interpolate(progress, [0, 1], [-70, 0]);

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 28,
                opacity: progress,
                transform: `translateX(${x}px)`,
              }}
            >
              {/* Number badge */}
              <div
                style={{
                  minWidth: 64,
                  height: 64,
                  borderRadius: 14,
                  background: `linear-gradient(135deg, ${theme.accent_color}, ${theme.primary_color})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                  fontWeight: 800,
                  color: "#FFFFFF",
                  boxShadow: `0 6px 24px ${theme.accent_color}55`,
                  flexShrink: 0,
                  transform: `scale(${progress})`,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>

              {/* Card */}
              <div
                style={{
                  flex: 1,
                  background: `linear-gradient(90deg, ${theme.primary_color}44 0%, ${theme.primary_color}22 100%)`,
                  border: `1px solid ${theme.accent_color}30`,
                  borderRadius: 16,
                  padding: "20px 32px",
                  boxShadow: `0 2px 20px rgba(0,0,0,0.25)`,
                }}
              >
                <div
                  style={{
                    fontSize: 38,
                    fontWeight: 500,
                    color: theme.text_color,
                    lineHeight: 1.4,
                  }}
                >
                  {bullet}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
