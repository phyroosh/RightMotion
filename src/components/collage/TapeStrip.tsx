import React from "react";

export type TapePosition = "top-left" | "top-right" | "center-top" | "bottom-left" | "bottom-right";

export interface TapeStripProps {
  position?: TapePosition;
  rotation?: number;
  width?: number;
  height?: number;
  color?: "cream" | "semi_transparent" | "amber";
  className?: string;
  style?: React.CSSProperties;
}

const POSITION_STYLES: Record<TapePosition, React.CSSProperties> = {
  "top-left": {
    top: "-18px",
    left: "24px",
    transform: "rotate(-12deg)",
  },
  "top-right": {
    top: "-18px",
    right: "24px",
    transform: "rotate(10deg)",
  },
  "center-top": {
    top: "-16px",
    left: "50%",
    transform: "translateX(-50%) rotate(-1.5deg)",
  },
  "bottom-left": {
    bottom: "-18px",
    left: "24px",
    transform: "rotate(8deg)",
  },
  "bottom-right": {
    bottom: "-18px",
    right: "24px",
    transform: "rotate(-9deg)",
  },
};

const COLOR_STYLES = {
  cream: {
    bg: "rgba(254, 252, 232, 0.85)",
    border: "rgba(254, 240, 138, 0.5)",
  },
  semi_transparent: {
    bg: "rgba(255, 255, 255, 0.72)",
    border: "rgba(226, 232, 240, 0.6)",
  },
  amber: {
    bg: "rgba(254, 243, 199, 0.85)",
    border: "rgba(251, 191, 36, 0.4)",
  },
};

/**
 * 🩹 TapeStrip
 * Physical masking tape with serrated torn edges that pins cards to the canvas,
 * giving authentic documentary collage texture.
 */
export const TapeStrip: React.FC<TapeStripProps> = ({
  position = "top-right",
  rotation,
  width = 110,
  height = 34,
  color = "cream",
  className = "",
  style = {},
}) => {
  const posStyle = POSITION_STYLES[position];
  const colorStyle = COLOR_STYLES[color];

  const finalTransform = rotation !== undefined
    ? `rotate(${rotation}deg)`
    : posStyle.transform;

  return (
    <div
      className={`absolute z-30 pointer-events-none select-none ${className}`}
      style={{
        ...posStyle,
        width: `${width}px`,
        height: `${height}px`,
        transform: finalTransform,
        backgroundColor: colorStyle.bg,
        backdropFilter: "blur(4px)",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.10)",
        // Serrated 45-degree torn tape ends via CSS clip-path
        clipPath: `polygon(
          0% 15%, 3% 0%, 97% 0%, 100% 15%,
          98% 35%, 100% 50%, 97% 65%, 100% 85%, 97% 100%,
          3% 100%, 0% 85%, 3% 65%, 0% 50%, 2% 35%
        )`,
        ...style,
      }}
    >
      {/* Subtle textured tape fiber line */}
      <div className="w-full h-full opacity-25 border-t border-b border-black/10" />
    </div>
  );
};
