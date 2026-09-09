import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { VectorCursor } from "./VectorCursor";

export interface KineticTypoLadderProps {
  leadIn: string;             // Line 1: Context phrase, e.g. "The most expensive" or "We don't"
  slamWord: string;           // Line 2: Power headline word, e.g. "Sentence" or "Run 3 month"
  punchText?: string;         // Line 3: Focus punch phrase, e.g. "In business?" or "Experiments"
  startFrame: number;
  durationFrames?: number;
  theme?: "light" | "dark";
  accentColor?: string;
  showSelectionBox?: boolean; // default: true
  showCursor?: boolean;       // default: true
  cursorType?: "arrow" | "glove";
  yOffset?: string;           // default: "18%"
  align?: "center" | "left";
  staggerFrames?: number;     // frames between line entrances, default: 6
  className?: string;
}

/**
 * 🪜 KineticTypoLadder
 * Master After Effects-grade Typographic Ladder component.
 * Directly recreates the signature kinetic typography in Jordan Brown / Iman Gadzhi / Solution Wagon references:
 *   - Line 1: Clean context lead-in with masked vertical slide-up
 *   - Line 2: Massive, heavy grotesk display headline slam
 *   - Line 3: Interactive punchline enclosed in a dashed vector bounding box with 8 anchor handles
 *   - Vector cursor that flies onto the handle with spring click physics
 */
export const KineticTypoLadder: React.FC<KineticTypoLadderProps> = ({
  leadIn,
  slamWord,
  punchText,
  startFrame,
  durationFrames,
  theme = "light",
  accentColor,
  showSelectionBox = true,
  showCursor = true,
  cursorType = "arrow",
  yOffset = "18%",
  align = "center",
  staggerFrames = 6,
  className = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < startFrame) return null;
  if (durationFrames && frame > startFrame + durationFrames) return null;

  const isDark = theme === "dark";

  // Palette definition
  const leadInColor = isDark ? "#94a3b8" : "#475569";
  const slamColor = isDark ? "#ffffff" : "#0f172a";
  const punchColor = isDark ? "#f8fafc" : "#1e293b";
  const boxBorder = isDark ? "rgba(255, 255, 255, 0.45)" : "rgba(15, 23, 42, 0.40)";
  const handleColor = isDark ? "#ffffff" : "#0f172a";
  const activeAccent = accentColor ?? (isDark ? "#38bdf8" : "#0071e3");

  // ── Line 1 Entrance (Lead-In) ──────────────────────────────────────────────
  const f1 = Math.max(0, frame - startFrame);
  const sp1 = spring({ frame: f1, fps, config: { damping: 16, mass: 0.7, stiffness: 140 } });
  const y1 = interpolate(sp1, [0, 1], [100, 0]);
  const op1 = interpolate(sp1, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });

  // ── Line 2 Entrance (Slam Word) ────────────────────────────────────────────
  const startF2 = startFrame + staggerFrames;
  const f2 = Math.max(0, frame - startF2);
  const sp2 = spring({ frame: f2, fps, config: { damping: 14, mass: 0.75, stiffness: 150 } });
  const y2 = interpolate(sp2, [0, 1], [100, 0]);
  const op2 = interpolate(sp2, [0, 0.35], [0, 1], { extrapolateRight: "clamp" });
  const scale2 = interpolate(sp2, [0, 1], [0.92, 1.0]);

  // Motion blur simulation during high-velocity entrance
  const blur2 = interpolate(sp2, [0, 0.6, 1], [4, 1.5, 0], { extrapolateRight: "clamp" });

  // ── Line 3 Entrance (Punchline + Bounding Box) ─────────────────────────────
  const startF3 = startFrame + staggerFrames * 2;
  const f3 = Math.max(0, frame - startF3);
  const sp3 = spring({ frame: f3, fps, config: { damping: 14, mass: 0.8, stiffness: 130 } });
  const y3 = interpolate(sp3, [0, 1], [100, 0]);
  const op3 = interpolate(sp3, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });

  // Bounding box draw/expand spring
  const boxSp = spring({
    frame: Math.max(0, frame - (startF3 + 4)),
    fps,
    config: { damping: 15, mass: 0.6, stiffness: 160 },
  });
  const boxScale = interpolate(boxSp, [0, 1], [0.94, 1.0]);
  const boxOpacity = interpolate(boxSp, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });

  const alignmentClass = align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div
      className={`absolute inset-x-0 z-30 flex flex-col ${alignmentClass} pointer-events-none select-none px-8 ${className}`}
      style={{ top: yOffset }}
    >
      {/* ── LINE 1: Context Lead-In (Masked Vertical Slide-Up) ── */}
      {leadIn && (
        <div className="overflow-hidden py-1">
          <div
            style={{
              transform: `translateY(${y1}%)`,
              opacity: op1,
            }}
          >
            <span
              className="font-display font-semibold tracking-tight"
              style={{
                fontSize: "36px",
                color: leadInColor,
                letterSpacing: "-0.01em",
              }}
            >
              {leadIn}
            </span>
          </div>
        </div>
      )}

      {/* ── LINE 2: Hero Slam Word (Massive Grotesk Display) ── */}
      {slamWord && (
        <div className="overflow-hidden py-1 mt-0.5">
          <div
            style={{
              transform: `translateY(${y2}%) scale(${scale2})`,
              opacity: op2,
              filter: `blur(${blur2}px)`,
              transformOrigin: align === "center" ? "center center" : "left center",
            }}
          >
            <span
              className="block font-display font-black tracking-tight uppercase leading-[0.95]"
              style={{
                fontSize: "82px",
                color: slamColor,
                textShadow: isDark
                  ? `0 0 25px ${activeAccent}99, 0 8px 30px rgba(0,0,0,0.8)`
                  : "0 4px 18px rgba(0, 0, 0, 0.12)",
                letterSpacing: "-0.02em",
              }}
            >
              {slamWord}
            </span>
          </div>
        </div>
      )}

      {/* ── LINE 3: Punch Phrase + Dashed Selection Bounding Box ── */}
      {punchText && (
        <div className="relative mt-2">
          {/* Dashed Vector Selection Box with 8 Corner/Edge Anchor Handles */}
          {showSelectionBox && frame >= startF3 + 4 && (
            <div
              className="absolute -inset-x-5 -inset-y-2 pointer-events-none"
              style={{
                border: `2px dashed ${boxBorder}`,
                borderRadius: "4px",
                transform: `scale(${boxScale})`,
                opacity: boxOpacity,
                boxShadow: isDark
                  ? `0 0 16px ${activeAccent}22, inset 0 0 12px ${activeAccent}11`
                  : "0 2px 10px rgba(0,0,0,0.04)",
              }}
            >
              {/* 4 Corner Anchor Handles (Solid 8x8 squares) */}
              <div
                className="absolute -top-[5px] -left-[5px] w-[9px] height-[9px]"
                style={{ backgroundColor: handleColor, border: "1px solid white", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
              />
              <div
                className="absolute -top-[5px] -right-[5px] w-[9px] height-[9px]"
                style={{ backgroundColor: handleColor, border: "1px solid white", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
              />
              <div
                className="absolute -bottom-[5px] -left-[5px] w-[9px] height-[9px]"
                style={{ backgroundColor: handleColor, border: "1px solid white", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
              />
              {/* Bottom-Right Handle: Target for Vector Cursor */}
              <div
                id="selection-handle-br"
                className="absolute -bottom-[5px] -right-[5px] w-[9px] height-[9px]"
                style={{
                  backgroundColor: activeAccent,
                  border: "1px solid white",
                  boxShadow: `0 0 8px ${activeAccent}`,
                }}
              />

              {/* 4 Edge Midpoint Handles */}
              <div
                className="absolute -top-[4px] left-1/2 -translate-x-1/2 w-[7px] height-[7px]"
                style={{ backgroundColor: handleColor, border: "1px solid white" }}
              />
              <div
                className="absolute -bottom-[4px] left-1/2 -translate-x-1/2 w-[7px] height-[7px]"
                style={{ backgroundColor: handleColor, border: "1px solid white" }}
              />
              <div
                className="absolute top-1/2 -left-[4px] -translate-y-1/2 w-[7px] height-[7px]"
                style={{ backgroundColor: handleColor, border: "1px solid white" }}
              />
              <div
                className="absolute top-1/2 -right-[4px] -translate-y-1/2 w-[7px] height-[7px]"
                style={{ backgroundColor: handleColor, border: "1px solid white" }}
              />
            </div>
          )}

          {/* Masked Punchline Text */}
          <div className="overflow-hidden py-1 px-3">
            <div
              style={{
                transform: `translateY(${y3}%)`,
                opacity: op3,
              }}
            >
              <span
                className="font-display font-bold tracking-tight"
                style={{
                  fontSize: "48px",
                  color: punchColor,
                  letterSpacing: "-0.01em",
                }}
              >
                {punchText}
              </span>
            </div>
          </div>

          {/* Vector Cursor Flying to Bottom-Right Anchor Handle */}
          {showCursor && showSelectionBox && (
            <div className="absolute right-[-24px] bottom-[-24px]">
              <VectorCursor
                targetX={0}
                targetY={0}
                startX={75}
                startY={95}
                startFrame={startF3 + 6}
                flightDurationFrames={16}
                clickFrame={startF3 + 24}
                cursorType={cursorType}
                size={42}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
