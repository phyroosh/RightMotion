import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import {
  GlossyFloorStage,
  GlossyGlowGraph,
  GlossyToggleBoard,
  SteppedProgressionStairs,
  PolishStickerFloat,
} from "../../components/pure_graphics";
import { WordTimestamp } from "../../types";

interface CanvasProps {
  transcript: WordTimestamp[];
}

export const TheCortisolInversionCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();

  return (
    <div className="absolute inset-0 w-full h-full select-none">
      {/* ======================================================== */}
      {/* SCENE 1: THE INVERTED CURVE PARADOX (Frames 0 - 145 / 0-4.8s) */}
      {/* ======================================================== */}
      {frame >= 0 && frame < 145 && (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <GlossyFloorStage
            glowColor="rgba(244, 63, 94, 0.16)"
            glowCenterY={42}
            showReflection={false}
          >
            <GlossyGlowGraph
              title="CORTISOL INVERSION"
              titleColor="#ffffff"
              entranceFrame={5}
              yLabel="CORTISOL LEVEL"
              xLabels={["8 AM", "12 PM", "6 PM", "12 AM"]}
              showFloorReflection={true}
              reflectionOpacity={0.36}
              curves={[
                {
                  id: "inverted_spike",
                  color: "#f43f5e",
                  glowColor: "#f43f5e",
                  startFrame: 15,
                  durationFrames: 50,
                  showArrow: true,
                  pathD: "M 100 320 C 220 320, 320 320, 400 310 C 460 300, 500 150, 550 90",
                  areaD: "M 100 340 L 100 320 C 220 320, 320 320, 400 310 C 460 300, 500 150, 550 90 L 550 340 Z",
                  tipX: 550,
                  tipY: 90,
                },
              ]}
              width={780}
              height={440}
            />
          </GlossyFloorStage>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 2: ENERGY DEPLOYMENT SWITCHBOARD (Frames 145 - 295 / 4.8-9.8s) */}
      {/* ======================================================== */}
      {frame >= 145 && frame < 295 && (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <GlossyFloorStage
            glowColor="rgba(16, 185, 129, 0.20)"
            glowCenterY={42}
            showReflection={false}
          >
            <GlossyToggleBoard
              title="ENERGY DEPLOYMENT"
              titleColor="#ffffff"
              headerBg="rgba(16, 185, 129, 0.28)"
              entranceFrame={145}
              showCursor={true}
              cursorTargetIndex={0}
              cursorClickFrame={180}
              showFloorReflection={true}
              reflectionOpacity={0.34}
              items={[
                {
                  id: "glucose",
                  label: "GLUCOSE RELEASE",
                  activeFrame: 180,
                  activeColor: "#10b981",
                },
                {
                  id: "drive",
                  label: "PHYSICAL DRIVE",
                  activeFrame: 220,
                  activeColor: "#10b981",
                },
                {
                  id: "wakefulness",
                  label: "CELLULAR ENERGY",
                  activeFrame: 250,
                  activeColor: "#10b981",
                },
              ]}
              width={580}
            />
          </GlossyFloorStage>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 3: SUNLIGHT VS DARKNESS COMPARATIVE GRAPH (Frames 295 - 505 / 9.8-16.8s) */}
      {/* ======================================================== */}
      {frame >= 295 && frame < 505 && (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <GlossyFloorStage
            glowColor="rgba(56, 189, 248, 0.16)"
            glowCenterY={42}
            showReflection={false}
          >
            <GlossyGlowGraph
              title="SUNLIGHT vs DARKNESS"
              titleColor="#ffffff"
              entranceFrame={295}
              yLabel="CORTISOL SURGE"
              xLabels={["8 AM", "12 PM", "6 PM", "12 AM"]}
              showFloorReflection={true}
              reflectionOpacity={0.36}
              curves={[
                {
                  id: "optimal",
                  label: "OPTIMAL (SUNLIGHT)",
                  color: "#10b981",
                  glowColor: "#10b981",
                  startFrame: 300,
                  durationFrames: 45,
                  showArrow: true,
                  pathD: "M 100 130 C 140 80, 200 75, 270 140 C 360 220, 460 300, 550 320",
                  areaD: "M 100 340 L 100 130 C 140 80, 200 75, 270 140 C 360 220, 460 300, 550 320 L 550 340 Z",
                  tipX: 200,
                  tipY: 75,
                },
                {
                  id: "inverted",
                  label: "INVERTED (NO LIGHT)",
                  color: "#f43f5e",
                  glowColor: "#f43f5e",
                  startFrame: 360,
                  durationFrames: 45,
                  showArrow: true,
                  pathD: "M 100 320 C 220 320, 320 320, 400 310 C 460 300, 500 160, 550 110",
                  areaD: "M 100 340 L 100 320 C 220 320, 320 320, 400 310 C 460 300, 500 160, 550 110 L 550 340 Z",
                  tipX: 550,
                  tipY: 110,
                },
              ]}
              width={820}
              height={440}
            />
          </GlossyFloorStage>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 4: 60-MINUTE PROTOCOL STAIRS (Frames 505 - 720 / 16.8-24.0s) */}
      {/* ======================================================== */}
      {frame >= 505 && (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <GlossyFloorStage
            glowColor="rgba(251, 191, 36, 0.20)"
            glowCenterY={42}
            showReflection={false}
          >
            <SteppedProgressionStairs
              title="60-MINUTE PROTOCOL"
              titleColor="#ffffff"
              orbColor="#fbbf24"
              startFrame={505}
              stepDurationFrames={32}
              showFloorReflection={true}
              reflectionOpacity={0.34}
              width={700}
              height={460}
              steps={[
                { id: "wake", label: "WAKE UP" },
                { id: "window", label: "60 MIN" },
                { id: "sunlight", label: "LIGHT" },
                { id: "reset", label: "RESET" },
                { id: "sleep", label: "OPTIMAL", isGoal: true },
              ]}
            />
          </GlossyFloorStage>
        </div>
      )}
    </div>
  );
};
