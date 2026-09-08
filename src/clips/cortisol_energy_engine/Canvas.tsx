import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import {
  GlossyFloorStage,
  GlossyGlowGraph,
  GlossyToggleBoard,
  SteppedProgressionStairs,
  PolishStickerFloat,
} from "../../components/pure_graphics";
import { TacticalMemeCard } from "../../components/TacticalMemeCard";
import { WordTimestamp } from "../../types";

interface CanvasProps {
  transcript: WordTimestamp[];
}

export const CortisolEnergyEngineCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();

  return (
    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-8 select-none">
      {/* ======================================================== */}
      {/* SCENE 1: THE ROOT HOOK GRAPH (Frames 0 - 121) */}
      {/* ======================================================== */}
      {frame >= 0 && frame < 121 && (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <GlossyFloorStage glowColor="rgba(244, 63, 94, 0.16)">
            <GlossyGlowGraph
              title="CORTISOL"
              titleColor="#ffffff"
              entranceFrame={0}
              showFloorReflection={true}
              curves={[
                {
                  id: "hook_curve",
                  color: "#f43f5e",
                  startFrame: 10,
                  durationFrames: 45,
                  showArrow: true,
                  pathD: "M 100 320 C 220 320, 320 320, 400 310 C 460 300, 500 150, 550 90",
                  areaD: "M 100 340 L 100 320 C 220 320, 320 320, 400 310 C 460 300, 500 150, 550 90 L 550 340 Z",
                  tipX: 550,
                  tipY: 90,
                }
              ]}
              width={780}
              height={440}
            />
          </GlossyFloorStage>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 2: COGNITIVE MECHANISM SWITCHBOARD (Frames 121 - 609) */}
      {/* ======================================================== */}
      {frame >= 121 && frame < 609 && (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <GlossyFloorStage glowColor="rgba(16, 185, 129, 0.20)">
            <GlossyToggleBoard
              title="CORTISOL NOT JUST"
              titleColor="#ffffff"
              entranceFrame={121}
              showFloorReflection={true}
              items={[
                { id: "mech_1", label: "BUT BECAUSE IT IS YOUR PRIMARY ENERGY-DEPLOYMENT HORMONE.", activeFrame: 141, activeColor: "#10b981" },
                { id: "mech_2", label: "IT UNLOCKS GLUCOSE, FIRES UP YOUR MUSCLES, AND SHARPENS YOUR ATTENTION.", activeFrame: 171, activeColor: "#10b981" },
              ]}
              width={620}
            />
          </GlossyFloorStage>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 3: ACTION PROTOCOL STAIRS (Frames 609+) */}
      {/* ======================================================== */}
      {frame >= 609 && (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <GlossyFloorStage glowColor="rgba(251, 191, 36, 0.20)">
            <SteppedProgressionStairs
              title="DRAINING YOUR"
              titleColor="#ffffff"
              orbColor="#fbbf24"
              startFrame={609}
              stepDurationFrames={30}
              showFloorReflection={true}
              width={700}
              height={460}
              steps={[
                { id: "step_1", label: "AWARENESS" },
                { id: "step_2", label: "PAUSE" },
                { id: "step_3", label: "REWIRE" },
                { id: "step_4", label: "ACTION", isGoal: true },
              ]}
            />
          </GlossyFloorStage>
        </div>
      )}

      
      {/* ======================================================== */}
      {/* TACTICAL RETENTION MEME POP (< 2.5s Strict Cap)          */}
      {/* ======================================================== */}
      <TacticalMemeCard
        memeId="doctor_strange_loop"
        startFrame={0}
        durationFrames={46}
        playbackRate={1.4}
        hudLabel="AUTOPILOT LOOP // RECURSION"
        theme="apple_studio"
        position="top"
      />

    </div>
  );
};
