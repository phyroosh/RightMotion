import React from "react";
import { Img, staticFile } from "remotion";
import { ThumbnailCanvas } from "./ThumbnailCanvas";

export interface MinimalObjectLayoutProps {
  hookWord: string;
  hookSubtitle?: string;
  accentWord?: string;
  accentColor?: string;
  objectSrc: string;
  objectScale?: number;
  theme?: "apple_studio" | "obsidian" | "biotech_cyan" | "pure_white";
  aspectRatio?: "9:16" | "16:9";
}

export const MinimalObjectLayout: React.FC<MinimalObjectLayoutProps> = ({
  hookWord,
  hookSubtitle,
  accentWord,
  accentColor = "#0071e3",
  objectSrc,
  objectScale = 1.0,
  theme = "apple_studio",
  aspectRatio = "9:16",
}) => {
  const is16x9 = aspectRatio === "16:9";
  const isLight = theme === "apple_studio" || theme === "pure_white";

  const resolvedSrc = objectSrc.startsWith("http")
    ? objectSrc
    : staticFile(objectSrc.replace(/^\//, ""));

  return (
    <ThumbnailCanvas aspectRatio={aspectRatio} theme={theme}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: is16x9 ? "center" : "space-between",
          padding: is16x9 ? "60px 100px" : "120px 60px 80px 60px",
        }}
      >
        {/* Top Text Hook */}
        <div
          style={{
            textAlign: "center",
            zIndex: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "18px",
          }}
        >
          <h1
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 900,
              fontSize: is16x9 ? "115px" : "105px",
              lineHeight: "0.98",
              letterSpacing: "-0.03em",
              color: isLight ? "#090d16" : "#ffffff",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            {accentWord && hookWord.includes(accentWord) ? (
              <>
                {hookWord.split(accentWord)[0]}
                <span style={{ color: accentColor }}>{accentWord}</span>
                {hookWord.split(accentWord)[1]}
              </>
            ) : (
              hookWord
            )}
          </h1>

          {hookSubtitle && (
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 800,
                fontSize: "36px",
                color: isLight ? "#64748b" : "#94a3b8",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              {hookSubtitle}
            </span>
          )}
        </div>

        {/* Central Dominant Object with Pedestal Glow & Shadow */}
        <div
          style={{
            position: "relative",
            width: is16x9 ? "700px" : "850px",
            height: is16x9 ? "600px" : "1100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          {/* Subtle Ambient Grounding Disc */}
          <div
            style={{
              position: "absolute",
              bottom: "10%",
              width: "550px",
              height: "120px",
              borderRadius: "50%",
              background: `radial-gradient(ellipse, ${accentColor}30 0%, transparent 70%)`,
              filter: "blur(40px)",
              zIndex: 1,
            }}
          />

          <Img
            src={resolvedSrc}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              transform: `scale(${objectScale})`,
              position: "relative",
              zIndex: 5,
              filter: isLight
                ? "drop-shadow(0 30px 60px rgba(15,23,42,0.22))"
                : "drop-shadow(0 40px 80px rgba(0,0,0,0.95))",
            }}
            alt="Hero Object"
          />
        </div>
      </div>
    </ThumbnailCanvas>
  );
};
