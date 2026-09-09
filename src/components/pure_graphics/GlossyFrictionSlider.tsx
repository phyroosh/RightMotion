import React from "react";
import {
  Easing,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface GlossyFrictionSliderProps {
  title?: string;
  titleColor?: string;
  startLabel?: string;
  endLabel?: string;
  startPercent?: number; // 0 - 100
  endPercent?: number; // 0 - 100
  accentColor?: string;
  glowColor?: string;
  startFrame?: number;
  dragDurationFrames?: number;
  width?: number;
  showCursor?: boolean;
  showFloorReflection?: boolean;
  reflectionOpacity?: number;
  isReflection?: boolean;
  theme?: "dark" | "light";
}

/**
 * 🎬 GlossyFrictionSlider
 * Tactile frosted glass slider track where the authentic cartoon glove pointer
 * cursor drags the glowing thumb knob from high friction to optimal resolution.
 * Complete with non-linear drag easing and downward wet-floor mirror reflections.
 */
export const GlossyFrictionSlider: React.FC<GlossyFrictionSliderProps> = ({
  title,
  titleColor = "#ffffff",
  startLabel = "FRICTION",
  endLabel = "FLOW STATE",
  startPercent = 15,
  endPercent = 92,
  accentColor = "#10b981",
  glowColor = "rgba(16, 185, 129, 0.22)",
  startFrame = 0,
  dragDurationFrames = 50,
  width = 660,
  showCursor = true,
  showFloorReflection = true,
  reflectionOpacity = 0.38,
  isReflection = false,
  theme = "dark",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterSpring = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 15, mass: 0.8, stiffness: 130 },
  });

  // Non-linear drag progress: starts after pause, accelerates, smoothly decelerates
  const dragStart = startFrame + 18;
  const dragProgress = interpolate(
    frame,
    [dragStart, dragStart + dragDurationFrames],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }
  );

  const currentPercent =
    startPercent + (endPercent - startPercent) * dragProgress;
  const trackWidth = width - 80;
  const thumbX = (currentPercent / 100) * trackWidth;

  // Cursor clicking / grab scale
  const isDragging =
    frame >= dragStart - 6 && frame <= dragStart + dragDurationFrames + 10;
  const cursorScale =
    frame >= dragStart && frame <= dragStart + dragDurationFrames
      ? 0.86
      : 1.0;

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* 1. Floating Glowing Title */}
      {!isReflection && title && (
        <div
          className="mb-8 flex flex-col items-center"
          style={{
            opacity: interpolate(enterSpring, [0, 0.6], [0, 1]),
            transform: `translateY(${interpolate(enterSpring, [0, 1], [20, 0])}px)`,
          }}
        >
          <span
            className="text-4xl font-black tracking-widest uppercase font-sans"
            style={{
              color: titleColor,
              textShadow: `0 0 20px rgba(255, 255, 255, 0.4), 0 0 45px ${glowColor}`,
            }}
          >
            {title}
          </span>
        </div>
      )}

      {/* 2. Slider Track & Frame */}
      {(() => {
        const isLight = theme === "light";
        return (
          <div
            className="relative flex flex-col items-center p-8 rounded-3xl"
            style={{
              width: `${width}px`,
              background: isLight ? "rgba(255, 255, 255, 0.95)" : "rgba(15, 23, 42, 0.75)",
              border: isLight ? "2.5px solid rgba(15, 23, 42, 0.12)" : "1px solid rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(20px)",
              boxShadow: isLight
                ? `0 20px 50px rgba(0, 0, 0, 0.08), 0 0 35px ${glowColor}`
                : `0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px ${glowColor}33`,
              transform: `scale(${interpolate(enterSpring, [0, 1], [0.92, 1])})`,
              opacity: interpolate(enterSpring, [0, 0.3], [0, 1]),
            }}
          >
            {/* Top Labels - Upgraded for mobile */}
            <div className="w-full flex justify-between items-center mb-7 px-2">
              <span className={`text-lg md:text-xl font-mono font-black tracking-wider uppercase ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                {startLabel}
              </span>
              <span
                className="text-4xl font-mono font-black tracking-widest"
                style={{
                  color: accentColor,
                  textShadow: `0 0 20px ${accentColor}`,
                }}
              >
                {Math.round(currentPercent)}%
              </span>
              <span
                className="text-lg md:text-xl font-mono font-black tracking-wider uppercase"
                style={{ color: accentColor }}
              >
                {endLabel}
              </span>
            </div>

            {/* Horizontal Track Bar - Thick 34px for 480p mobile screen visibility */}
            <div
              className="relative h-9 rounded-full overflow-visible flex items-center"
              style={{
                width: `${trackWidth}px`,
                background: isLight ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.12)",
                border: isLight ? "2px solid rgba(0, 0, 0, 0.12)" : "2px solid rgba(255, 255, 255, 0.25)",
              }}
            >
          {/* Glowing Active Track Fill */}
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${thumbX}px`,
              background: `linear-gradient(90deg, rgba(255,255,255,0.3) 0%, ${accentColor} 100%)`,
              boxShadow: `0 0 25px ${accentColor}`,
            }}
          />

          {/* Draggable Glowing Thumb Knob - Larger 42px */}
          <div
            className="absolute -top-1.5 flex items-center justify-center rounded-full pointer-events-none"
            style={{
              left: `${thumbX - 21}px`,
              width: "42px",
              height: "42px",
              background: "#ffffff",
              border: `4px solid ${accentColor}`,
              boxShadow: `0 0 30px 8px ${accentColor}, 0 4px 20px rgba(0,0,0,0.9)`,
              transform: `scale(${isDragging ? 1.18 : 1.0})`,
              transition: "transform 0.15s ease-out",
            }}
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
            </div>
          </div>
        </div>
      );
    })()}

      {/* 3. Authentic Cartoon Glove Pointer Cursor */}
      {!isReflection && showCursor && isDragging && (
        <div
          className="absolute pointer-events-none z-40 transition-transform duration-75"
          style={{
            left: `calc(50% - ${width / 2}px + 40px + ${thumbX}px - 18px)`,
            top: "140px",
            transform: `scale(${cursorScale})`,
          }}
        >
          <img
            src={staticFile("assets/cursor_pointer.png")}
            alt="Hand Pointer Cursor"
            className="w-14 h-14 object-contain"
            style={{
              filter: "drop-shadow(0 10px 22px rgba(0, 0, 0, 0.9))",
            }}
          />
        </div>
      )}

      {/* 4. Downward Wet-Floor Mirror Reflection */}
      {showFloorReflection && !isReflection && (
        <div
          className="pointer-events-none select-none origin-top -mt-2"
          style={{
            transform: "scaleY(-1)",
            opacity: reflectionOpacity,
            filter: "blur(2.2px)",
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 25%, rgba(0,0,0,0) 65%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 25%, rgba(0,0,0,0) 65%)",
          }}
        >
          <GlossyFrictionSlider
            startLabel={startLabel}
            endLabel={endLabel}
            startPercent={startPercent}
            endPercent={endPercent}
            accentColor={accentColor}
            glowColor={glowColor}
            startFrame={startFrame}
            dragDurationFrames={dragDurationFrames}
            width={width}
            showCursor={false}
            showFloorReflection={false}
            isReflection={true}
          />
        </div>
      )}
    </div>
  );
};
