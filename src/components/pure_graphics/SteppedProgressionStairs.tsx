import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface StepItem {
  id: string;
  label: string;
  isGoal?: boolean;
}

export interface SteppedProgressionStairsProps {
  title?: string;
  titleColor?: string;
  steps: StepItem[];
  orbColor?: string; // e.g. "#fbbf24" (warm golden) or "#10b981" (emerald)
  startFrame?: number;
  stepDurationFrames?: number; // frames spent on each step transition
  width?: number;
  height?: number;
  showFloorReflection?: boolean;
  reflectionOpacity?: number;
  className?: string;
}

/**
 * 🪜 SteppedProgressionStairs
 * Direct recreation of Reference 2 (Plan -> Action -> Focus -> Goal).
 * Renders an ascending staircase of frosted glass steps with a glowing orb
 * that leaps dynamically between steps with smooth ballistic arcs and radial bloom.
 */
export const SteppedProgressionStairs: React.FC<SteppedProgressionStairsProps> = ({
  title,
  titleColor = "#ffffff",
  steps,
  orbColor = "#fbbf24",
  startFrame = 0,
  stepDurationFrames = 30,
  width = 720,
  height = 460,
  showFloorReflection = true,
  reflectionOpacity = 0.35,
  className = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = Math.max(0, frame - startFrame);
  const totalSteps = steps.length;

  const totalTransitionTime = (totalSteps - 1) * stepDurationFrames;
  const clampedFrame = Math.min(relFrame, totalTransitionTime);
  const rawStepProgress = clampedFrame / stepDurationFrames;
  const currentStepIndex = Math.min(Math.floor(rawStepProgress), totalSteps - 1);
  const nextStepIndex = Math.min(currentStepIndex + 1, totalSteps - 1);
  const interStepT = rawStepProgress - currentStepIndex;

  const jumpArc = Math.sin(interStepT * Math.PI) * 45;

  const stepWidth = 135;
  const stepHeight = 44;
  const startX = 50;
  const startY = height - 80;
  const deltaX = (width - startX - stepWidth - 40) / (totalSteps - 1);
  const deltaY = (startY - 60) / (totalSteps - 1);

  const getStepCoords = (idx: number) => {
    return {
      x: startX + idx * deltaX,
      y: startY - idx * deltaY,
    };
  };

  const currentCoord = getStepCoords(currentStepIndex);
  const nextCoord = getStepCoords(nextStepIndex);
  const orbX = interpolate(
    interStepT,
    [0, 1],
    [currentCoord.x + stepWidth / 2, nextCoord.x + stepWidth / 2]
  );
  const orbY =
    interpolate(interStepT, [0, 1], [currentCoord.y - 25, nextCoord.y - 25]) - jumpArc;

  const renderStairsContent = (isReflection: boolean = false) => (
    <div
      className="relative"
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {/* Step Blocks */}
      {steps.map((step, idx) => {
        const coord = getStepCoords(idx);
        const isReached = currentStepIndex >= idx;

        const stepSpring = spring({
          frame: Math.max(0, relFrame - idx * 6),
          fps,
          config: { damping: 14, mass: 0.8, stiffness: 120 },
        });

        return (
          <div
            key={step.id}
            className="absolute flex items-center justify-center rounded-xl border transition-all duration-300"
            style={{
              left: `${coord.x}px`,
              top: `${coord.y}px`,
              width: `${stepWidth}px`,
              height: `${stepHeight}px`,
              transform: `scale(${stepSpring})`,
              opacity: stepSpring,
              backgroundColor: step.isGoal
                ? isReached
                  ? "rgba(251, 191, 36, 0.15)"
                  : "rgba(255, 255, 255, 0.05)"
                : isReached
                ? "rgba(255, 255, 255, 0.12)"
                : "rgba(255, 255, 255, 0.03)",
              borderColor: step.isGoal
                ? isReached
                  ? "rgba(251, 191, 36, 0.8)"
                  : "rgba(251, 191, 36, 0.3)"
                : isReached
                ? "rgba(255, 255, 255, 0.7)"
                : "rgba(255, 255, 255, 0.15)",
              boxShadow: isReached
                ? step.isGoal
                  ? "0 0 25px rgba(251, 191, 36, 0.5), inset 0 0 15px rgba(251, 191, 36, 0.2)"
                  : "0 0 15px rgba(255, 255, 255, 0.25)"
                : "none",
            }}
          >
            <span
              className="text-sm md:text-base font-black tracking-widest uppercase font-mono"
              style={{
                color: step.isGoal
                  ? isReached
                    ? "#fbbf24"
                    : "rgba(251, 191, 36, 0.6)"
                  : isReached
                  ? "#ffffff"
                  : "rgba(255, 255, 255, 0.4)",
                textShadow: isReached
                  ? step.isGoal
                    ? "0 0 10px #fbbf24"
                    : "0 0 8px rgba(255,255,255,0.8)"
                  : "none",
              }}
            >
              {step.label}
            </span>

            {step.isGoal && !isReflection && (
              <div
                className="absolute -inset-2 rounded-2xl pointer-events-none"
                style={{
                  border: "2px solid rgba(251, 191, 36, 0.4)",
                  animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                }}
              />
            )}
          </div>
        );
      })}

      {/* Leaping Glowing Orb */}
      <div
        className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${orbX}px`,
          top: `${orbY}px`,
        }}
      >
        <div
          className="absolute -inset-8 rounded-full"
          style={{
            background: `radial-gradient(circle, ${orbColor} 0%, transparent 70%)`,
            opacity: 0.75 + Math.sin(frame * 0.15) * 0.15,
          }}
        />

        <div
          className="absolute -inset-2.5 rounded-full border-2"
          style={{
            borderColor: orbColor,
            opacity: 0.8,
          }}
        />

        <div
          className="relative w-8 h-8 rounded-full"
          style={{
            backgroundColor: orbColor,
            boxShadow: `0 0 20px ${orbColor}, 0 0 40px ${orbColor}88, inset 0 0 10px #ffffff`,
          }}
        />
      </div>
    </div>
  );

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Title (floats above, no floor reflection) */}
      {title && (
        <div className="mb-6 flex flex-col items-center">
          <h2
            className="text-4xl md:text-5xl font-black tracking-wider uppercase font-sans text-center"
            style={{
              color: titleColor,
              textShadow: `0 0 20px ${titleColor}88, 0 0 45px ${titleColor}44`,
            }}
          >
            {title}
          </h2>
        </div>
      )}

      {/* 3D Stairs with Built-in Floor Mirror Reflection */}
      <div className="relative flex flex-col items-center">
        <div className="relative z-10">{renderStairsContent(false)}</div>

        {showFloorReflection && (
          <div
            className="pointer-events-none select-none origin-top"
            style={{
              marginTop: "4px",
              transform: "scaleY(-1)",
              opacity: reflectionOpacity,
              filter: "blur(2px)",
              maskImage:
                "linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.25) 30%, transparent 60%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.25) 30%, transparent 60%)",
            }}
          >
            {renderStairsContent(true)}
          </div>
        )}
      </div>
    </div>
  );
};
