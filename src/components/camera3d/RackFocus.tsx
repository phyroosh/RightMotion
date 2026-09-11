import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface RackFocusProps {
  children: React.ReactNode;
  /** Whether this element is currently in sharp focus */
  isFocused?: boolean;
  /** Frame when focus transition starts */
  transitionStartFrame?: number;
  /** Frame when focus transition completes */
  transitionEndFrame?: number;
  /** Focus direction: "to_focus" (starts blurred -> becomes sharp) | "to_blur" (starts sharp -> becomes blurred) */
  direction?: "to_focus" | "to_blur";
  /** Maximum defocus blur in pixels (default: 5px) */
  blurAmount?: number;
  /** De-emphasized opacity (default: 0.5) */
  defocusedOpacity?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 🎯 RackFocus
 * Perceptually grounded focal plane controller.
 * 
 * Transfers viewer attention between near-field and far-field layers
 * through controlled depth softening (blur + opacity + contrast modulation).
 * Preserves high GPU/CPU performance by scoping blur strictly to isolated containers.
 */
export const RackFocus: React.FC<RackFocusProps> = ({
  children,
  isFocused,
  transitionStartFrame,
  transitionEndFrame,
  direction = "to_focus",
  blurAmount = 5,
  defocusedOpacity = 0.5,
  className = "",
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  let focusProgress = 1.0; // 1 = sharp, 0 = defocused

  if (transitionStartFrame !== undefined && transitionEndFrame !== undefined) {
    const dur = Math.max(1, transitionEndFrame - transitionStartFrame);
    const rel = frame - transitionStartFrame;

    const sp = spring({
      frame: Math.max(0, rel),
      fps,
      config: { damping: 16, stiffness: 110, mass: 0.8 },
    });

    if (direction === "to_focus") {
      focusProgress = frame < transitionStartFrame ? 0 : interpolate(sp, [0, 1], [0, 1]);
    } else {
      focusProgress = frame < transitionStartFrame ? 1 : interpolate(sp, [0, 1], [1, 0]);
    }
  } else if (isFocused !== undefined) {
    focusProgress = isFocused ? 1.0 : 0.0;
  }

  const currentBlur = (1.0 - focusProgress) * blurAmount;
  const currentOpacity = interpolate(focusProgress, [0, 1], [defocusedOpacity, 1.0]);
  const currentScale = interpolate(focusProgress, [0, 1], [0.97, 1.0]);
  const currentContrast = interpolate(focusProgress, [0, 1], [0.88, 1.0]);

  return (
    <div
      className={className}
      style={{
        filter: currentBlur > 0.1 ? `blur(${currentBlur.toFixed(2)}px) contrast(${currentContrast.toFixed(2)})` : undefined,
        opacity: currentOpacity,
        transform: `scale(${currentScale.toFixed(4)})`,
        transformOrigin: "center center",
        contain: "layout paint",
        willChange: "filter, opacity, transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
