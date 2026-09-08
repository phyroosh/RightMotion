import React from "react";
import { useCurrentFrame } from "remotion";
import {
  GlossyFloorStage,
  GlossyGlowGraph,
  GlossyBarChart,
  GlossyRadialDial,
  GlossyBalanceScale,
  GlossyFrictionSlider,
  GlossyToggleBoard,
  SteppedProgressionStairs,
  GlossyFeatureGrid,
  PolishStickerFloat,
} from "../../components/pure_graphics";
import { TacticalMemeCard } from "../../components/TacticalMemeCard";
import { MemeStickerOverlay } from "../../components/MemeStickerOverlay";
import { WordTimestamp } from "../../types";

interface CanvasProps {
  transcript: WordTimestamp[];
}

export const TheTruthAboutSleepCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();

  return (
    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-8 select-none">
      {/* ======================================================== */}
      {/* SCENE 1: EVERY HOUR (Frames 0 - 150) */}
      {/* ======================================================== */}
      {frame >= 0 && frame < 150 && (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <GlossyFloorStage glowColor="rgba(244, 63, 94, 0.18)" glowCenterY={42} showReflection={false}>
            <GlossyRadialDial
              title="EVERY HOUR"
              titleColor="#ffffff"
              startFrame={0}
              targetPercent={80}
              valueText="16 HRS"
              labelText="MELATONIN TIMER"
              accentColor="#38bdf8"
              glowColor="rgba(244, 63, 94, 0.18)"
              size={440}
              showFloorReflection={true}
              reflectionOpacity={0.36}
            />
          </GlossyFloorStage>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 2: DURING WAKING (Frames 150 - 557) */}
      {/* ======================================================== */}
      {frame >= 150 && frame < 557 && (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <GlossyFloorStage glowColor="rgba(16, 185, 129, 0.20)" glowCenterY={42} showReflection={false}>
            <GlossyToggleBoard
              title="DURING WAKING"
              titleColor="#ffffff"
              entranceFrame={150}
              showFloorReflection={true}
              reflectionOpacity={0.35}
              items={[
                { id: "t1", label: "TRIGGER IDENTIFIED", activeFrame: 170, activeColor: "#10b981" },
                { id: "t2", label: "KINETIC SHIFT", activeFrame: 198, activeColor: "#10b981" },
              ]}
              width={620}
            />
          </GlossyFloorStage>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 3: ONLY TIME (Frames 557 - 965) */}
      {/* ======================================================== */}
      {frame >= 557 && frame < 965 && (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <GlossyFloorStage glowColor="rgba(244, 63, 94, 0.18)" glowCenterY={42} showReflection={false}>
            <GlossyBalanceScale
              title="ONLY TIME"
              titleColor="#ffffff"
              leftLabel="THE TRAP"
              leftSub="Comfort & Freeze"
              leftColor="#f43f5e"
              rightLabel="THE SOLUTION"
              rightSub="Freedom & Focus"
              rightColor="#10b981"
              winner="right"
              startFrame={557}
              width={680}
              height={420}
              glowColor="rgba(244, 63, 94, 0.18)"
              showFloorReflection={true}
              reflectionOpacity={0.36}
            />
          </GlossyFloorStage>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 4: SLEEP PASSIVE (Frames 965 - 1059) */}
      {/* ======================================================== */}
      {frame >= 965 && (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <GlossyFloorStage glowColor="rgba(16, 185, 129, 0.20)" glowCenterY={42} showReflection={false}>
            <SteppedProgressionStairs
              title="SLEEP PASSIVE"
              titleColor="#ffffff"
              orbColor="#fbbf24"
              startFrame={965}
              stepDurationFrames={28}
              showFloorReflection={true}
              reflectionOpacity={0.35}
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
        memeId="ishowspeed_stare"
        startFrame={0}
        durationFrames={42}
        playbackRate={1.4}
        hudLabel="COGNITIVE FREEZE // SPEECHLESS"
        theme="apple_studio"
        position="top"
      />

      
      {/* ======================================================== */}
      {/* MID-VIDEO GEN-Z MEME REACTION STICKER POP               */}
      {/* ======================================================== */}
      <MemeStickerOverlay
        stickerId="anya_smug"
        startFrame={185}
        durationFrames={34}
        position="top-right"
        badgeText="HEH 𓁹‿𓁹"
      />

    </div>
  );
};
