import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { Scene, Theme } from "../types";
import { sp, SPRING_GENTLE, SPRING_SNAPPY } from "../utils/springs";

interface Props {
  scene: Scene;
  theme: Theme;
}

// Accent color variants for step badges
const BADGE_GRADIENTS = [
  ["#FF6B6B", "#EE4B2B"],
  ["#4ECDC4", "#2B8A85"],
  ["#F7C59F", "#E8A470"],
  ["#A8E6CF", "#4CAF50"],
];

export const StepScene: React.FC<Props> = ({ scene, theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headingProgress = sp(frame, fps, 0, SPRING_SNAPPY);
  const steps = scene.steps ?? [];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "56px 120px",
        background: `linear-gradient(135deg, ${theme.background_color} 0%, ${theme.primary_color}40 100%)`,
        fontFamily: theme.font_family,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dot grid */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.05 }}
      >
        <defs>
          <pattern id="steps-dots" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
            <circle cx="24" cy="24" r="1.8" fill={theme.accent_color} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#steps-dots)" />
      </svg>

      {/* Top-right decorative arc */}
      <div
        style={{
          position: "absolute",
          right: -200,
          top: -200,
          width: 700,
          height: 700,
          borderRadius: "50%",
          border: `3px solid ${theme.accent_color}18`,
          background: `radial-gradient(circle, ${theme.primary_color}20 0%, transparent 65%)`,
        }}
      />

      {/* Heading */}
      <div
        style={{
          fontSize: 52,
          fontWeight: 800,
          color: theme.text_color,
          marginBottom: 44,
          opacity: headingProgress,
          transform: `translateY(${interpolate(headingProgress, [0, 1], [-24, 0])}px)`,
          display: "flex",
          alignItems: "center",
          gap: 20,
          position: "relative",
        }}
      >
        <div
          style={{
            width: 8,
            height: 56,
            background: `linear-gradient(to bottom, ${theme.accent_color}, ${theme.primary_color}88)`,
            borderRadius: 4,
            flexShrink: 0,
          }}
        />
        {scene.heading}
      </div>

      {/* Steps */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          flex: 1,
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Vertical connector line */}
        {steps.length > 1 && (
          <div
            style={{
              position: "absolute",
              left: 43,
              top: 72,
              bottom: 72,
              width: 2,
              background: `linear-gradient(to bottom, ${theme.accent_color}44, transparent)`,
              zIndex: 0,
            }}
          />
        )}

        {steps.map((step, i) => {
          const delay = 10 + i * 18;
          const progress = sp(frame, fps, delay, SPRING_GENTLE);
          const x = interpolate(progress, [0, 1], [-80, 0]);
          const badgeColors = BADGE_GRADIENTS[i % BADGE_GRADIENTS.length];

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 32,
                opacity: progress,
                transform: `translateX(${x}px)`,
                position: "relative",
                zIndex: 1,
              }}
            >
              {/* Step number badge */}
              <div
                style={{
                  minWidth: 88,
                  height: 88,
                  borderRadius: 20,
                  background: `linear-gradient(135deg, ${badgeColors[0]}, ${badgeColors[1]})`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: `0 8px 28px ${badgeColors[0]}55`,
                  transform: `scale(${interpolate(progress, [0, 1], [0.5, 1])})`,
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.75)", letterSpacing: 1.5, textTransform: "uppercase" }}>
                  STEP
                </div>
                <div style={{ fontSize: 34, fontWeight: 900, color: "#FFFFFF", lineHeight: 1 }}>
                  {String(step.number ?? i + 1)}
                </div>
              </div>

              {/* Content card */}
              <div
                style={{
                  flex: 1,
                  background: `linear-gradient(100deg, ${theme.primary_color}40 0%, ${theme.primary_color}20 100%)`,
                  border: `1px solid ${theme.accent_color}28`,
                  borderRadius: 20,
                  padding: "22px 36px",
                  boxShadow: `0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)`,
                  minHeight: 88,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 700,
                    color: theme.text_color,
                    marginBottom: 8,
                    lineHeight: 1.2,
                  }}
                >
                  {step.title}
                </div>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 400,
                    color: `${theme.text_color}bb`,
                    lineHeight: 1.55,
                  }}
                >
                  {step.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
