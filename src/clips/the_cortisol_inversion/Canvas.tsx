import React from "react";
import { useCurrentFrame } from "remotion";
import {
  GlossyFloorStage,
  GlossyGlowGraph,
  GlossyFrictionSlider,
  GlossyBalanceScale,
  GlossyRadialDial,
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
      {/* SCENE 1: THE INVERTED CURVE PARADOX (Frames 0 - 150 / 0-5.0s) */}
      {/* ======================================================== */}
      {frame >= 0 && frame < 150 && (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <GlossyFloorStage
            glowColor="rgba(244, 63, 94, 0.18)"
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
                  startFrame: 20,
                  durationFrames: 55,
                  showArrow: true,
                  pathD:
                    "M 100 320 C 220 320, 320 320, 400 310 C 460 300, 500 150, 550 90",
                  areaD:
                    "M 100 340 L 100 320 C 220 320, 320 320, 400 310 C 460 300, 500 150, 550 90 L 550 340 Z",
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
      {/* SCENE 2: TACTILE FRICTION SLIDER (Frames 150 - 300 / 5.0-10.0s) */}
      {/* ======================================================== */}
      {frame >= 150 && frame < 300 && (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <GlossyFloorStage
            glowColor="rgba(16, 185, 129, 0.20)"
            glowCenterY={42}
            showReflection={false}
          >
            <GlossyFrictionSlider
              title="ENERGY DEPLOYMENT"
              titleColor="#ffffff"
              startLabel="LETHARGY"
              endLabel="PHYSICAL DRIVE"
              startPercent={18}
              endPercent={94}
              accentColor="#10b981"
              glowColor="rgba(16, 185, 129, 0.22)"
              startFrame={150}
              dragDurationFrames={50}
              width={660}
              showCursor={true}
              showFloorReflection={true}
              reflectionOpacity={0.35}
            />
          </GlossyFloorStage>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 3: COMPARATIVE BALANCE SCALE (Frames 300 - 470 / 10.0-15.6s) */}
      {/* ======================================================== */}
      {frame >= 300 && frame < 470 && (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <GlossyFloorStage
            glowColor="rgba(56, 189, 248, 0.18)"
            glowCenterY={42}
            showReflection={false}
          >
            <GlossyBalanceScale
              title="THE CIRCADIAN SHIFT"
              titleColor="#ffffff"
              leftLabel="MISS MORNING LIGHT"
              leftSub="Flatlined Cortisol"
              leftColor="#f43f5e"
              rightLabel="EARLY PHOTONS"
              rightSub="Optimal Morning Peak"
              rightColor="#10b981"
              winner="right"
              startFrame={300}
              width={680}
              height={420}
              glowColor="rgba(56, 189, 248, 0.20)"
              showFloorReflection={true}
              reflectionOpacity={0.36}
            />
          </GlossyFloorStage>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 4: 16-HOUR MELATONIN CHRONO DIAL (Frames 470 - End / 15.6s-End) */}
      {/* ======================================================== */}
      {frame >= 470 && (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <GlossyFloorStage
            glowColor="rgba(251, 191, 36, 0.20)"
            glowCenterY={42}
            showReflection={false}
          >
            <GlossyRadialDial
              title="THE 60-MINUTE PROTOCOL"
              titleColor="#ffffff"
              targetPercent={85}
              valueText="16 HRS"
              labelText="MELATONIN RELEASE TIMER"
              accentColor="#fbbf24"
              glowColor="rgba(251, 191, 36, 0.22)"
              startFrame={470}
              size={460}
              showFloorReflection={true}
              reflectionOpacity={0.35}
            />
          </GlossyFloorStage>
        </div>
      )}
    </div>
  );
};
