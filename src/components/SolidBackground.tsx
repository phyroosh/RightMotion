import React from "react";

export interface SolidColorKeyframe {
  timeMs: number;
  color: string; // e.g. '#ffffff', '#09090b', '#0f172a'
  theme?: "light" | "dark";
}

export interface SolidBackgroundProps {
  currentMs: number;
  keyframes: SolidColorKeyframe[];
  showSubtleGrid?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Gets the active solid background color and theme at currentMs
 */
export function getActiveSolidColor(
  currentMs: number,
  keyframes: SolidColorKeyframe[]
): { color: string; theme: "light" | "dark" } {
  if (!keyframes || keyframes.length === 0) {
    return { color: "#ffffff", theme: "light" };
  }

  const sorted = [...keyframes].sort((a, b) => a.timeMs - b.timeMs);
  let active = sorted[0];

  for (const k of sorted) {
    if (currentMs >= k.timeMs) {
      active = k;
    } else {
      break;
    }
  }

  const isDark =
    active.theme === "dark" ||
    active.color === "#000000" ||
    active.color === "#09090b" ||
    active.color === "#0f172a" ||
    active.color === "#18181b";

  return {
    color: active.color,
    theme: active.theme || (isDark ? "dark" : "light"),
  };
}

/**
 * SolidBackground:
 * Ultra-clean, premium solid color backdrop engine for Long-Form Video Essays.
 * Completely replaces gradients with intentional, high-contrast solid stages (White, Black, Charcoal, etc.).
 */
export const SolidBackground: React.FC<SolidBackgroundProps> = ({
  currentMs,
  keyframes,
  showSubtleGrid = false,
  className = "",
  style = {},
}) => {
  const { color, theme } = getActiveSolidColor(currentMs, keyframes);
  const isDark = theme === "dark";

  return (
    <div
      className={`absolute inset-0 pointer-events-none transition-colors duration-300 ${className}`}
      style={{
        backgroundColor: color,
        ...style,
      }}
    >
      {/* Optional ultra-faint architectural dot grid for subtle technical texture */}
      {showSubtleGrid && (
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: isDark
              ? "radial-gradient(circle, #ffffff 1px, transparent 1px)"
              : "radial-gradient(circle, #000000 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      )}
    </div>
  );
};
