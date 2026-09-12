import React from "react";
import { Img, staticFile } from "remotion";
import { ThumbnailCanvas } from "./ThumbnailCanvas";

export interface ImpossibleMetaphorLayoutProps {
  hookWord: string;
  hookSubtitle?: string;
  accentWord?: string;
  accentColor?: string;
  heroImageSrc: string;
  heroImageAlt?: string;
  heroScale?: number;
  heroOffsetY?: number;
  theme?: "apple_studio" | "obsidian" | "biotech_cyan" | "pure_white";
  aspectRatio?: "9:16" | "16:9";
  groundReflection?: boolean;
  cardFrame?: boolean;
}

export const ImpossibleMetaphorLayout: React.FC<ImpossibleMetaphorLayoutProps> = ({
  hookWord,
  hookSubtitle,
  accentWord,
  accentColor = "#f43f5e",
  heroImageSrc,
  heroImageAlt = "Hero Visual Metaphor",
  heroScale = 1.0,
  heroOffsetY = 0,
  theme = "apple_studio",
  aspectRatio = "9:16",
  groundReflection = false,
  cardFrame = true,
}) => {
  const is16x9 = aspectRatio === "16:9";
  const isLight = theme === "apple_studio" || theme === "pure_white";

  // Resolve staticFile if relative or bare
  const resolvedSrc = heroImageSrc.startsWith("http")
    ? heroImageSrc
    : staticFile(heroImageSrc.replace(/^\//, ""));

  return (
    <ThumbnailCanvas aspectRatio={aspectRatio} theme={theme}>
      {is16x9 ? (
        // 16:9 Widescreen Split-Composition
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "80px 100px",
          }}
        >
          {/* Left: Punch Text Hook (Level 1 / 3) */}
          <div
            style={{
              width: "48%",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              zIndex: 20,
            }}
          >
            <h1
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 900,
                fontSize: "115px",
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
                  <span
                    style={{
                      color: accentColor,
                      display: "inline-block",
                      textShadow: isLight
                        ? `0 10px 30px ${accentColor}40`
                        : `0 0 40px ${accentColor}80`,
                    }}
                  >
                    {accentWord}
                  </span>
                  {hookWord.split(accentWord)[1]}
                </>
              ) : (
                hookWord
              )}
            </h1>

            {hookSubtitle && (
              <p
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 700,
                  fontSize: "36px",
                  color: isLight ? "#475569" : "#94a3b8",
                  letterSpacing: "-0.01em",
                  margin: 0,
                }}
              >
                {hookSubtitle}
              </p>
            )}
          </div>

          {/* Right: Dominant Hero Metaphor Subject (Level 1) */}
          <div
            style={{
              width: "50%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <Img
              src={resolvedSrc}
              alt={heroImageAlt}
              style={{
                maxHeight: "92%",
                maxWidth: "100%",
                objectFit: "contain",
                transform: `scale(${heroScale}) translateY(${heroOffsetY}px)`,
                filter: isLight
                  ? "drop-shadow(0 30px 60px rgba(15,23,42,0.18)) drop-shadow(0 10px 20px rgba(15,23,42,0.10))"
                  : "drop-shadow(0 40px 80px rgba(0,0,0,0.95)) drop-shadow(0 10px 30px rgba(0,0,0,0.80))",
              }}
            />
          </div>
        </div>
      ) : (
        // 9:16 Vertical Mobile Composition
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "80px 48px 48px 48px",
          }}
        >
          {/* Top Zone: Single Punch Hook Text (Oversized, Clean, Uncluttered) */}
          <div
            style={{
              width: "100%",
              textAlign: "center",
              zIndex: 25,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <h1
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 900,
                fontSize: "128px",
                lineHeight: "0.95",
                letterSpacing: "-0.04em",
                color: isLight ? "#090d16" : "#ffffff",
                textTransform: "uppercase",
                margin: 0,
                wordBreak: "break-word",
              }}
            >
              {accentWord && hookWord.includes(accentWord) ? (
                <>
                  {hookWord.split(accentWord)[0]}
                  <span
                    style={{
                      color: accentColor,
                      display: "inline-block",
                      textShadow: isLight
                        ? `0 14px 40px ${accentColor}45`
                        : `0 0 50px ${accentColor}90`,
                    }}
                  >
                    {accentWord}
                  </span>
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

          {/* Lower Zone: Colossal Hero Metaphor Subject in Editorial Frame */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "1480px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 15,
            }}
          >
            {/* Ground Rim Light */}
            <div
              style={{
                position: "absolute",
                bottom: "5%",
                left: "50%",
                transform: "translateX(-50%)",
                width: "800px",
                height: "220px",
                background: `radial-gradient(ellipse at bottom, ${accentColor}30 0%, transparent 70%)`,
                filter: "blur(50px)",
                zIndex: 1,
              }}
            />

            {cardFrame ? (
              <div
                style={{
                  position: "relative",
                  width: "984px",
                  height: "1420px",
                  borderRadius: "44px",
                  overflow: "hidden",
                  border: isLight ? "3.5px solid #090d16" : "3.5px solid rgba(255,255,255,0.2)",
                  boxShadow: isLight
                    ? "0 40px 90px -15px rgba(15,23,42,0.25), 0 10px 25px rgba(15,23,42,0.12)"
                    : "0 50px 100px -20px rgba(0,0,0,0.95)",
                  zIndex: 5,
                  background: isLight ? "#ffffff" : "#0f172a",
                }}
              >
                <Img
                  src={resolvedSrc}
                  alt={heroImageAlt}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "49% center",
                    transform: `scale(${heroScale * 1.55}) translateY(${heroOffsetY}px)`,
                    position: "relative",
                    zIndex: 2,
                  }}
                />
              </div>
            ) : (
              <Img
                src={resolvedSrc}
                alt={heroImageAlt}
                style={{
                  maxHeight: "1350px",
                  maxWidth: "1020px",
                  objectFit: "contain",
                  objectPosition: "bottom center",
                  transform: `scale(${heroScale}) translateY(${heroOffsetY}px)`,
                  transformOrigin: "bottom center",
                  position: "relative",
                  zIndex: 5,
                  filter: isLight
                    ? "drop-shadow(0 35px 70px rgba(15,23,42,0.22)) drop-shadow(0 8px 24px rgba(15,23,42,0.12))"
                    : "drop-shadow(0 45px 90px rgba(0,0,0,0.98)) drop-shadow(0 12px 35px rgba(0,0,0,0.85))",
                }}
              />
            )}
          </div>
        </div>
      )}
    </ThumbnailCanvas>
  );
};
