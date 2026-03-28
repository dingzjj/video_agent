import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { Scene, Theme, DiagramNode, DiagramEdge } from "../types";
import { sp, SPRING_GENTLE, SPRING_SNAPPY } from "../utils/springs";

interface Props {
  scene: Scene;
  theme: Theme;
}

const NODE_W = 280;
const NODE_H = 100;

export const DiagramScene: React.FC<Props> = ({ scene, theme }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const headingProgress = sp(frame, fps, 0, SPRING_SNAPPY);
  const nodes: DiagramNode[] = scene.nodes ?? [];
  const edges: DiagramEdge[] = scene.edges ?? [];

  const diagramTop = 220;
  const diagramW = width - 240;
  const diagramH = height - diagramTop - 100;

  const nodePos = (node: DiagramNode) => ({
    x: 120 + node.x * diagramW,
    y: diagramTop + node.y * diagramH,
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `linear-gradient(180deg, ${theme.background_color} 0%, ${theme.primary_color}28 100%)`,
        fontFamily: theme.font_family,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dot grid */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.05 }}>
        <defs>
          <pattern id="diag-dots" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
            <circle cx="24" cy="24" r="1.8" fill={theme.accent_color} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diag-dots)" />
      </svg>

      {/* Decorative glow blobs */}
      <div
        style={{
          position: "absolute",
          left: -150,
          bottom: -150,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme.primary_color}44 0%, transparent 65%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -100,
          top: 100,
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme.accent_color}18 0%, transparent 65%)`,
        }}
      />

      {/* Heading */}
      <div
        style={{
          position: "absolute",
          top: 70,
          left: 120,
          right: 120,
          fontSize: 58,
          fontWeight: 800,
          color: theme.text_color,
          opacity: headingProgress,
          transform: `translateY(${interpolate(headingProgress, [0, 1], [-30, 0])}px)`,
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            width: 8,
            height: 60,
            background: `linear-gradient(to bottom, ${theme.accent_color}, ${theme.primary_color}88)`,
            borderRadius: 4,
            flexShrink: 0,
          }}
        />
        {scene.heading}
      </div>

      {/* SVG layer for edges */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <defs>
          {edges.map((_, i) => (
            <React.Fragment key={i}>
              <marker
                id={`arrowhead-${i}`}
                markerWidth="12"
                markerHeight="9"
                refX="11"
                refY="4.5"
                orient="auto"
              >
                <polygon points="0 0, 12 4.5, 0 9" fill={theme.accent_color} />
              </marker>
              <filter id={`glow-edge-${i}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </React.Fragment>
          ))}
        </defs>

        {edges.map((edge, i) => {
          const fromNode = nodes.find((n) => n.id === edge.from);
          const toNode = nodes.find((n) => n.id === edge.to);
          if (!fromNode || !toNode) return null;

          const from = nodePos(fromNode);
          const to = nodePos(toNode);
          const nodeDelay = nodes.length * 14 + 8;
          const edgeDelay = nodeDelay + i * 18;
          const edgeProgress = sp(frame, fps, edgeDelay, SPRING_GENTLE);
          const labelProgress = sp(frame, fps, edgeDelay + 18, SPRING_GENTLE);

          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2 - 50;
          const pathData = `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;

          return (
            <g key={i}>
              {/* Glow path */}
              <path
                d={pathData}
                fill="none"
                stroke={theme.accent_color}
                strokeWidth={8}
                strokeOpacity={0.25}
                strokeDasharray={len * 2}
                strokeDashoffset={interpolate(edgeProgress, [0, 1], [len * 2, 0])}
                filter={`url(#glow-edge-${i})`}
              />
              {/* Main path */}
              <path
                d={pathData}
                fill="none"
                stroke={theme.accent_color}
                strokeWidth={3}
                strokeDasharray={len * 2}
                strokeDashoffset={interpolate(edgeProgress, [0, 1], [len * 2, 0])}
                markerEnd={`url(#arrowhead-${i})`}
              />
              {edge.label && (
                <g opacity={labelProgress}>
                  <rect
                    x={midX - 80}
                    y={midY - 48}
                    width={160}
                    height={36}
                    rx={18}
                    fill={theme.background_color}
                    stroke={theme.accent_color}
                    strokeWidth={1.5}
                    strokeOpacity={0.55}
                  />
                  <text
                    x={midX}
                    y={midY - 22}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={theme.accent_color}
                    fontSize={20}
                    fontWeight={600}
                    fontFamily={theme.font_family}
                  >
                    {edge.label}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map((node, i) => {
        const delay = 15 + i * 14;
        const progress = sp(frame, fps, delay, SPRING_GENTLE);
        const pos = nodePos(node);

        return (
          <div
            key={node.id}
            style={{
              position: "absolute",
              left: pos.x - NODE_W / 2,
              top: pos.y - NODE_H / 2,
              width: NODE_W,
              height: NODE_H,
              background: `linear-gradient(135deg, ${theme.primary_color}ee, ${theme.primary_color}88)`,
              border: `2px solid ${theme.accent_color}66`,
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: progress,
              transform: `scale(${interpolate(progress, [0, 1], [0.4, 1])})`,
              boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 ${progress * 40}px ${theme.accent_color}33, inset 0 1px 0 rgba(255,255,255,0.1)`,
            }}
          >
            {/* Step number dot */}
            <div
              style={{
                position: "absolute",
                top: -14,
                right: -14,
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${theme.accent_color}, ${theme.primary_color})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
                fontWeight: 800,
                color: "#fff",
                boxShadow: `0 2px 12px ${theme.accent_color}88`,
              }}
            >
              {i + 1}
            </div>
            <span
              style={{
                color: theme.text_color,
                fontSize: 28,
                fontWeight: 700,
                textAlign: "center",
                padding: "0 20px",
                lineHeight: 1.3,
              }}
            >
              {node.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
