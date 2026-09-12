import React from "react";

export interface ThumbnailCanvasProps {
  children: React.ReactNode;
  aspectRatio?: "9:16" | "16:9";
  theme?: "apple_studio" | "obsidian" | "biotech_cyan" | "pure_white";
  className?: string;
}

export const ThumbnailCanvas: React.FC<ThumbnailCanvasProps> = ({
  children,
  aspectRatio = "9:16",
  theme = "apple_studio",
  className = "",
}) => {
  const is16x9 = aspectRatio === "16:9";
  const width = is16x9 ? 1920 : 1080;
  const height = is16x9 ? 1080 : 1920;

  // Premium studio backgrounds with zero dirty grain
  const themes = {
    apple_studio: {
      bg: "#f8fafc",
      gradient: "radial-gradient(ellipse at 50% 15%, #ffffff 0%, #f8fafc 60%, #f1f5f9 100%)",
      gridColor: "rgba(100, 116, 139, 0.14)",
      glowColor: "rgba(37, 99, 235, 0.12)",
      textColor: "#090d16",
    },
    pure_white: {
      bg: "#ffffff",
      gradient: "radial-gradient(circle at 50% 30%, #ffffff 0%, #f8fafc 100%)",
      gridColor: "rgba(100, 116, 139, 0.10)",
      glowColor: "rgba(244, 63, 94, 0.08)",
      textColor: "#000000",
    },
    obsidian: {
      bg: "#080c14",
      gradient: "radial-gradient(circle at 50% 35%, #131c2e 0%, #080c14 75%)",
      gridColor: "rgba(255, 255, 255, 0.10)",
      glowColor: "rgba(56, 189, 248, 0.22)",
      textColor: "#ffffff",
    },
    biotech_cyan: {
      bg: "#060913",
      gradient: "radial-gradient(circle at 50% 35%, #0a1733 0%, #060913 75%)",
      gridColor: "rgba(6, 182, 212, 0.12)",
      glowColor: "rgba(6, 182, 212, 0.25)",
      textColor: "#ffffff",
    },
  };

  const currentTheme = themes[theme] || themes.apple_studio;

  return (
    <div
      className={`relative overflow-hidden select-none font-sans ${className}`}
      style={{
        width,
        height,
        backgroundColor: currentTheme.bg,
        backgroundImage: currentTheme.gradient,
        color: currentTheme.textColor,
      }}
    >
      {/* Crisp Dot Grid Structure */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(${currentTheme.gridColor} 1.5px, transparent 1.5px)`,
          backgroundSize: "36px 36px",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Atmospheric Studio Glow */}
      <div
        style={{
          position: "absolute",
          top: "18%",
          left: "50%",
          transform: "translateX(-50%)",
          width: is16x9 ? "1100px" : "860px",
          height: is16x9 ? "700px" : "860px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${currentTheme.glowColor} 0%, transparent 70%)`,
          filter: "blur(90px)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Primary Content Container adhering to Mobile Safe Zones */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {children}
      </div>
    </div>
  );
};
