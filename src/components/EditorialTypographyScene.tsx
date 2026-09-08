import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { HandwrittenArrow, ArrowPreset } from "./HandwrittenArrow";

export type TypographyFocusStyle =
  | "serif_italic"
  | "serif_bold"
  | "playful_handwritten"
  | "editorial_clean";

export type TypographyColorTheme = "charcoal" | "sky" | "rose" | "emerald" | "amber";

export interface EditorialTypographySceneProps {
  /** Pale giant background watermark word (e.g. "DISTORTION" or "AWARENESS") */
  ghostEcho?: string;
  /** Small lead-in phrase (e.g. "Let's suppose" or "Psychologists call this") */
  leadIn?: string;
  /** Massive focal word or phrase (e.g. "Curated Distortion" or "Healthy Love") */
  focusWord: string;
  /** Optional secondary subtitle or mechanism rule */
  subline?: string;
  /** Styling archetype for the focus word */
  focusStyle?: TypographyFocusStyle;
  /** Primary text accent theme */
  colorTheme?: TypographyColorTheme;
  /** Starting frame for the scene */
  entranceFrame?: number;
  /** Relative frame delay for focus word (default: 8 frames after leadIn) */
  focusWordDelay?: number;
  /** Relative frame delay for subline (default: 18 frames) */
  sublineDelay?: number;
  /** Dynamic self-drawing underline stroke under the focus word */
  showUnderline?: boolean;
  /** Handwritten arrow annotation */
  arrowPreset?: ArrowPreset | "none";
  /** Alignment of text */
  alignment?: "center" | "left";
  /** Optional top/bottom vertical offset */
  translateY?: number;
  className?: string;
  style?: React.CSSProperties;
}

const COLOR_MAP: Record<TypographyColorTheme, { main: string; accent: string; ghost: string }> = {
  charcoal: { main: "#111827", accent: "#374151", ghost: "rgba(17, 24, 39, 0.075)" },
  sky: { main: "#0f172a", accent: "#0071e3", ghost: "rgba(0, 113, 227, 0.08)" },
  rose: { main: "#111827", accent: "#e11d48", ghost: "rgba(225, 29, 72, 0.08)" },
  emerald: { main: "#111827", accent: "#059669", ghost: "rgba(5, 150, 105, 0.08)" },
  amber: { main: "#111827", accent: "#d97706", ghost: "rgba(217, 119, 6, 0.08)" },
};

/**
 * 🖋️ EditorialTypographyScene
 * Renders high-contrast editorial typography directly on the bare canvas substrate.
 * Eliminates SaaS card boxes in favor of pure magazine/documentary motion typography.
 */
export const EditorialTypographyScene: React.FC<EditorialTypographySceneProps> = ({
  ghostEcho,
  leadIn,
  focusWord,
  subline,
  focusStyle = "serif_italic",
  colorTheme = "charcoal",
  entranceFrame = 0,
  focusWordDelay = 8,
  sublineDelay = 18,
  showUnderline = false,
  arrowPreset = "none",
  alignment = "center",
  translateY = 0,
  className = "",
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < entranceFrame) {
    return null;
  }

  const colors = COLOR_MAP[colorTheme];

  // 1. Lead-in Spring
  const relLead = Math.max(0, frame - entranceFrame);
  const spLead = spring({
    frame: relLead,
    fps,
    config: { damping: 16, stiffness: 150 },
  });

  // 2. Focus Word Spring (punchy, high tension)
  const relFocus = Math.max(0, frame - (entranceFrame + focusWordDelay));
  const spFocus = spring({
    frame: relFocus,
    fps,
    config: { damping: 13, stiffness: 180, mass: 0.8 },
  });

  // 3. Subline Spring
  const relSub = Math.max(0, frame - (entranceFrame + sublineDelay));
  const spSub = spring({
    frame: relSub,
    fps,
    config: { damping: 16, stiffness: 140 },
  });

  // 4. Underline self-draw progress
  const underlineProgress = interpolate(
    relFocus,
    [10, 28],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Focus font class & style
  const getFocusFontClasses = () => {
    switch (focusStyle) {
      case "serif_italic":
        return "font-serif italic font-black";
      case "serif_bold":
        return "font-serif font-black tracking-tight";
      case "playful_handwritten":
        return "font-sans font-black italic tracking-wide";
      case "editorial_clean":
      default:
        return "font-sans font-black uppercase tracking-tight";
    }
  };

  return (
    <div
      className={`relative w-full flex flex-col pointer-events-none select-none ${
        alignment === "center" ? "items-center text-center" : "items-start text-left"
      } ${className}`}
      style={{
        transform: `translateY(${translateY}px)`,
        ...style,
      }}
    >
      {/* 1. Ghost Echo Watermark */}
      {ghostEcho && (
        <div
          aria-hidden="true"
          className="absolute -top-16 inset-x-0 flex justify-center text-center font-serif font-black italic pointer-events-none select-none z-0"
          style={{
            fontSize: "clamp(130px, 20vw, 260px)",
            color: colors.ghost,
            letterSpacing: "-0.04em",
            transform: `translateY(${interpolate(spFocus, [0, 1], [30, 0])}px)`,
            opacity: Math.min(1, spFocus * 1.5),
          }}
        >
          {ghostEcho}
        </div>
      )}

      {/* 2. Lead-In Phrase */}
      {leadIn && (
        <div
          className="relative z-10 font-serif italic text-3xl md:text-4xl text-slate-600 mb-1"
          style={{
            opacity: Math.min(1, spLead * 1.5),
            transform: `translateY(${interpolate(spLead, [0, 1], [20, 0])}px)`,
          }}
        >
          {leadIn}
        </div>
      )}

      {/* 3. Focus Word (The Key Cognition) */}
      <div
        className="relative z-10 inline-block px-2"
        style={{
          opacity: Math.min(1, spFocus * 1.5),
          transform: `translateY(${interpolate(spFocus, [0, 1], [25, 0])}px) scale(${interpolate(
            spFocus,
            [0, 1],
            [0.92, 1]
          )})`,
        }}
      >
        <span
          className={`text-6xl md:text-7xl lg:text-8xl leading-tight ${getFocusFontClasses()}`}
          style={{
            color: colors.main,
            textShadow: "0 2px 20px rgba(0,0,0,0.06)",
          }}
        >
          {focusWord}
        </span>

        {/* Dynamic Animated Underline */}
        {showUnderline && relFocus >= 8 && (
          <div className="absolute -bottom-2 left-0 right-0 h-4 pointer-events-none">
            <svg
              viewBox="0 0 400 24"
              fill="none"
              preserveAspectRatio="none"
              className="w-full h-full overflow-visible"
            >
              <path
                d="M 10 14 C 90 8, 240 18, 390 10"
                stroke={colors.accent}
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeDasharray="400"
                strokeDashoffset={400 * (1 - underlineProgress)}
                style={{
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.12))",
                }}
              />
            </svg>
          </div>
        )}
      </div>

      {/* 4. Subline / Insight Explanation */}
      {subline && (
        <div
          className="relative z-10 max-w-[820px] font-sans text-xl md:text-2xl text-slate-600 font-medium leading-snug mt-3 px-4"
          style={{
            opacity: Math.min(1, spSub * 1.5),
            transform: `translateY(${interpolate(spSub, [0, 1], [18, 0])}px)`,
          }}
        >
          {subline}
        </div>
      )}

      {/* 5. Handwritten Arrow (if specified) */}
      {arrowPreset !== "none" && (
        <div className="relative z-20 mt-2">
          <HandwrittenArrow
            preset={arrowPreset}
            entranceFrame={entranceFrame + focusWordDelay + 10}
            color={colors.accent}
            width={120}
            height={130}
          />
        </div>
      )}
    </div>
  );
};
