import React from "react";
import { interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export interface ToggleItem {
  id: string;
  label: string;
  activeFrame?: number; // frame at which this toggle flips ON
  activeColor?: string; // default: "#22c55e" (emerald neon)
}

export interface GlossyToggleBoardProps {
  title?: string;
  titleColor?: string;
  headerBg?: string; // default: "rgba(185, 28, 28, 0.35)" or emerald
  items: ToggleItem[];
  showCursor?: boolean;
  cursorTargetIndex?: number; // which item the cursor clicks
  cursorClickFrame?: number;
  width?: number; // default: 680
  entranceFrame?: number;
  showFloorReflection?: boolean;
  reflectionOpacity?: number;
  className?: string;
}

/**
 * 🎛️ GlossyToggleBoard
 * Direct recreation of Reference 3 ("SUCCESS" switchboard).
 * Optimized for mobile viewport with commanding presence and tactile toggle switches.
 */
export const GlossyToggleBoard: React.FC<GlossyToggleBoardProps> = ({
  title,
  titleColor = "#ffffff",
  headerBg = "rgba(16, 185, 129, 0.25)",
  items,
  showCursor = true,
  cursorTargetIndex = 0,
  cursorClickFrame = 25,
  width = 680,
  entranceFrame = 0,
  showFloorReflection = true,
  reflectionOpacity = 0.38,
  className = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = Math.max(0, frame - entranceFrame);
  const enterSpring = spring({
    frame: relFrame,
    fps,
    config: { damping: 14, mass: 0.8, stiffness: 120 },
  });

  const scale = interpolate(enterSpring, [0, 1], [0.92, 1.0]);
  const opacity = interpolate(enterSpring, [0, 1], [0, 1]);

  const renderCardContent = (isReflection: boolean = false) => (
    <div
      className="relative rounded-[40px] p-10 border border-white/15 backdrop-blur-2xl flex flex-col gap-8"
      style={{
        width: `${width}px`,
        backgroundColor: "rgba(15, 20, 30, 0.82)",
        boxShadow: isReflection
          ? "none"
          : "0 30px 70px -15px rgba(0, 0, 0, 0.85), inset 0 1.5px 1.5px rgba(255, 255, 255, 0.25), 0 0 50px rgba(16, 185, 129, 0.15)",
      }}
    >
      {/* Header Pill */}
      {title && (
        <div
          className="w-full py-5 rounded-2xl flex items-center justify-center border border-white/10"
          style={{
            backgroundColor: headerBg,
            boxShadow: "inset 0 1px 2px rgba(255, 255, 255, 0.25)",
          }}
        >
          <span
            className="text-3xl md:text-4xl font-black tracking-widest uppercase font-sans text-center"
            style={{
              color: titleColor,
              textShadow: "0 0 20px rgba(255, 255, 255, 0.7)",
            }}
          >
            {title}
          </span>
        </div>
      )}

      {/* Toggle Rows */}
      <div className="flex flex-col gap-7 py-2">
        {items.map((item) => {
          const isTurnedOn = item.activeFrame !== undefined && frame >= item.activeFrame;
          const toggleColor = item.activeColor || "#22c55e";

          const toggleRel =
            item.activeFrame !== undefined ? Math.max(0, frame - item.activeFrame) : 0;
          const toggleSpring = spring({
            frame: toggleRel,
            fps,
            config: { damping: 12, mass: 0.6, stiffness: 140 },
          });

          const thumbX = isTurnedOn ? interpolate(toggleSpring, [0, 1], [0, 32]) : 0;

          return (
            <div key={item.id} className="flex items-center justify-between px-3 py-1">
              <span
                className="text-2xl font-black tracking-wider uppercase font-mono transition-colors duration-300"
                style={{
                  color: isTurnedOn ? "#ffffff" : "rgba(255, 255, 255, 0.6)",
                  textShadow: isTurnedOn ? "0 0 15px rgba(255, 255, 255, 0.85)" : "none",
                }}
              >
                {item.label}
              </span>

              <div
                className="relative w-20 h-11 rounded-full p-1 transition-colors duration-300 flex items-center"
                style={{
                  backgroundColor: isTurnedOn ? toggleColor : "rgba(75, 85, 99, 0.5)",
                  boxShadow: isTurnedOn
                    ? `0 0 22px ${toggleColor}cc, inset 0 1px 2px rgba(255, 255, 255, 0.4)`
                    : "inset 0 2px 4px rgba(0, 0, 0, 0.5)",
                }}
              >
                <div
                  className="w-9 h-9 rounded-full bg-white shadow-md transition-transform"
                  style={{
                    transform: `translateX(${thumbX}px)`,
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.4)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Animated Hand Cursor Clicking (Authentic Glove Pointer) */}
      {!isReflection && showCursor && (
        <div
          className="absolute pointer-events-none transition-all duration-300 z-30"
          style={{
            right: "42px",
            top: `${142 + cursorTargetIndex * 76}px`,
            opacity: frame >= cursorClickFrame - 10 && frame <= cursorClickFrame + 40 ? 1 : 0,
            transform: `scale(${
              frame >= cursorClickFrame && frame <= cursorClickFrame + 8 ? 0.86 : 1.0
            })`,
          }}
        >
          <img
            src={staticFile("assets/cursor_pointer.png")}
            alt="Hand Pointer Cursor"
            className="w-14 h-14 object-contain"
            style={{
              filter: "drop-shadow(0 10px 20px rgba(0, 0, 0, 0.85))",
            }}
          />
        </div>
      )}
    </div>
  );

  return (
    <div
      className={`flex flex-col items-center select-none ${className}`}
      style={{
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      <div className="relative flex flex-col items-center">
        {/* Main Board */}
        <div className="relative z-10">{renderCardContent(false)}</div>

        {/* Glossy Floor Mirror Reflection */}
        {showFloorReflection && (
          <div
            className="pointer-events-none select-none origin-top"
            style={{
              marginTop: "6px",
              transform: "scaleY(-1)",
              opacity: reflectionOpacity,
              filter: "blur(2.5px)",
              maskImage:
                "linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 35%, transparent 65%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 35%, transparent 65%)",
            }}
          >
            {renderCardContent(true)}
          </div>
        )}
      </div>
    </div>
  );
};
