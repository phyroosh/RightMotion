import React from "react";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface BarItem {
  id: string;
  label: string;
  value: number; // 0 - 100
  displayValue?: string;
  color?: string;
  glow?: string;
  isOptimal?: boolean;
}

export interface GlossyBarChartProps {
  title?: string;
  titleColor?: string;
  bars: BarItem[];
  startFrame?: number;
  width?: number;
  height?: number;
  glowColor?: string;
  showFloorReflection?: boolean;
  reflectionOpacity?: number;
  isReflection?: boolean;
}

/**
 * 🎬 GlossyBarChart
 * 3D frosted glass vertical columns with glowing gradient tops and staggered non-linear springs.
 * Displays clean comparative metrics (e.g. "SUNLIGHT: 100%" vs "SCREENS: 12%").
 * Complete with downward glossy wet-floor mirror reflections.
 */
export const GlossyBarChart: React.FC<GlossyBarChartProps> = ({
  title,
  titleColor = "#ffffff",
  bars,
  startFrame = 0,
  width = 680,
  height = 480,
  glowColor = "rgba(16, 185, 129, 0.22)",
  showFloorReflection = true,
  reflectionOpacity = 0.38,
  isReflection = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring for the stage & title
  const stageSpring = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 15, mass: 0.8, stiffness: 130 },
  });

  const chartHeight = height - 120;

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* 1. Floating Focus Title (Only on main instance, never reflected) */}
      {!isReflection && title && (
        <div
          className="mb-8 flex flex-col items-center"
          style={{
            opacity: interpolate(stageSpring, [0, 0.6], [0, 1]),
            transform: `translateY(${interpolate(stageSpring, [0, 1], [20, 0])}px)`,
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

      {/* 2. Standing 3D Columns Container */}
      <div
        className="relative flex items-end justify-center gap-12"
        style={{
          width: `${width}px`,
          height: `${chartHeight}px`,
          transform: `scale(${interpolate(stageSpring, [0, 1], [0.92, 1])})`,
          opacity: interpolate(stageSpring, [0, 0.4], [0, 1]),
        }}
      >
        {/* Baseline Floor Bar */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 20%, rgba(255,255,255,0.2) 80%, transparent 100%)",
          }}
        />

        {bars.map((bar, i) => {
          // Staggered non-linear spring with fast pop and gentle settling
          const barSpring = spring({
            frame: frame - startFrame - 8 - i * 9,
            fps,
            config: { damping: 14, mass: 0.65, stiffness: 140 },
          });

          const primaryColor =
            bar.color || (bar.isOptimal ? "#10b981" : "#f43f5e");
          const barGlow =
            bar.glow || (bar.isOptimal ? "rgba(16, 185, 129, 0.5)" : "rgba(244, 63, 94, 0.5)");

          const targetBarHeight = (bar.value / 100) * (chartHeight - 60);
          const currentHeight = Math.max(12, targetBarHeight * barSpring);

          // Eased value ticker calculation
          const currentValue = Math.round(bar.value * Math.min(1, barSpring));

          return (
            <div
              key={bar.id}
              className="relative flex flex-col items-center"
              style={{
                width: `${Math.min(160, Math.floor((width - 80) / bars.length))}px`,
              }}
            >
              {/* Value Label (Above Bar) */}
              <div
                className="mb-3 font-mono font-black text-2xl tracking-wider transition-opacity duration-200"
                style={{
                  color: primaryColor,
                  textShadow: `0 0 16px ${barGlow}`,
                  opacity: barSpring > 0.15 ? 1 : 0,
                  transform: `translateY(${interpolate(barSpring, [0, 1], [15, 0])}px)`,
                }}
              >
                {bar.displayValue || `${currentValue}%`}
              </div>

              {/* 3D Frosted Column Body */}
              <div
                className="w-full rounded-t-2xl relative overflow-hidden transition-all"
                style={{
                  height: `${currentHeight}px`,
                  background: `linear-gradient(180deg, ${primaryColor}44 0%, rgba(255,255,255,0.06) 40%, rgba(0,0,0,0.6) 100%)`,
                  borderTop: `3px solid ${primaryColor}`,
                  borderLeft: "1px solid rgba(255, 255, 255, 0.18)",
                  borderRight: "1px solid rgba(255, 255, 255, 0.18)",
                  boxShadow: `0 0 30px ${barGlow}, inset 0 1px 0 rgba(255,255,255,0.6)`,
                }}
              >
                {/* Specular Edge Highlight Sheen */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 60%)",
                  }}
                />

                {/* Glowing Beacon Head on Top */}
                <div
                  className="absolute top-0 left-0 right-0 h-[6px] rounded-full"
                  style={{
                    backgroundColor: primaryColor,
                    boxShadow: `0 0 20px 4px ${primaryColor}`,
                  }}
                />
              </div>

              {/* Category Label (Bottom) */}
              <div
                className="mt-4 text-center text-sm font-black tracking-widest uppercase font-sans"
                style={{
                  color: bar.isOptimal ? "#e2e8f0" : "#94a3b8",
                  maxWidth: "140px",
                  lineHeight: "1.3",
                }}
              >
                {bar.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Downward Wet-Floor Mirror Reflection */}
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
          <GlossyBarChart
            bars={bars}
            startFrame={startFrame}
            width={width}
            height={height}
            glowColor={glowColor}
            showFloorReflection={false}
            isReflection={true}
          />
        </div>
      )}
    </div>
  );
};
