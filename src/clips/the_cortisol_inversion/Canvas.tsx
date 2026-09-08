import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { VisualPropCard } from "../../components/VisualPropCard";
import { EditorialTypographyScene } from "../../components/EditorialTypographyScene";
import { HandwrittenArrow } from "../../components/HandwrittenArrow";
import { TacticalMemeCard } from "../../components/TacticalMemeCard";
import { MemeStickerOverlay } from "../../components/MemeStickerOverlay";
import { InteractiveEngagementPill } from "../../components/InteractiveEngagementPill";
import { WordTimestamp } from "../../types";

interface CanvasProps {
  transcript: WordTimestamp[];
}

export const TheCortisolInversionCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-8 select-none">
      {/* ======================================================== */}
      {/* SCENE 1: THE ROOT HOOK (Frames 0 - 213) */}
      {/* ======================================================== */}
      {frame >= 0 && frame < 213 && (
        <div className="w-full h-full flex flex-col items-center justify-center relative">
          <div className="absolute top-[12%] inset-x-0 px-8 flex justify-center">
            <EditorialTypographyScene
              ghostEcho="THE"
              leadIn="Notice how you're"
              focusWord="exhausted all morning,"
              subline="but wide awake the second you get into bed?"
              focusStyle="serif_italic"
              colorTheme="charcoal"
              entranceFrame={20}
              focusWordDelay={12}
              sublineDelay={24}
              showUnderline
            />
          </div>

          <div className="absolute top-[38%] inset-x-0 flex justify-center">
            <VisualPropCard
              imageSrc="the_cortisol_inversion/assets/scene_illustration.png"
              width={780}
              height={440}
              entranceFrame={10}
              stampText="PARADOX"
              stampSubtext="INSIGHT"
              stampFrame={80}
              stampTheme="trusted_red"
            />
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 2A: PSYCHOLOGICAL CONCEPT SLAM (Frames 213 - 288) */}
      {/* ======================================================== */}
      {frame >= 213 && frame < 288 && (
        <div className="w-full h-full flex flex-col items-center justify-center relative">
          <div className="absolute top-[30%] inset-x-0 px-8 flex flex-col items-center justify-center">
            <EditorialTypographyScene
              ghostEcho="THE"
              leadIn="Chronobiologists call this"
              focusWord="THE CORTISOL INVERSION."
              subline="cortisol isn't just stress; it's an energy-deploying hormone that unlocks glucose and drive"
              focusStyle="serif_italic"
              colorTheme="sky"
              entranceFrame={213}
              focusWordDelay={14}
              sublineDelay={26}
              showUnderline
              arrowPreset="loop_down"
            />
          </div>
        </div>
      )}

      
      {/* SCENE 2B: THE FIRST MECHANISM (Frames 288 - 296) */}
      {frame >= 288 && frame < 296 && (
        <div className="w-full h-full flex flex-col items-center justify-center relative">
          <div className="absolute top-[12%] inset-x-0 px-8 flex justify-center">
            <EditorialTypographyScene
              ghostEcho="MECHANISM"
              leadIn="The hidden pattern:"
              focusWord="And here's the trap"
              subline="cortisol isn't just stress;"
              focusStyle="serif_bold"
              colorTheme="charcoal"
              entranceFrame={288}
              focusWordDelay={10}
              sublineDelay={22}
              showUnderline
            />
          </div>

          <div className="absolute top-[44%] inset-x-0 flex justify-center">
            <VisualPropCard
              cutoutId="hyperrealistic_3d_glowing_brain"
              width={560}
              height={420}
              entranceFrame={296}
              ghostEcho="THE"
              stampText="NEURAL SHIFT"
              stampSubtext="SUBSTRATE"
              stampFrame={333}
              stampTheme="verified_blue"
            />
          </div>
        </div>
      )}

      {/* SCENE 2C: THE REWIRE TRUTH (Frames 296 - 587) */}
      {frame >= 296 && frame < 587 && (
        <div className="w-full h-full flex flex-col items-center justify-center relative">
          <div className="absolute top-[26%] inset-x-0 px-8 flex flex-col items-center justify-center">
            <EditorialTypographyScene
              ghostEcho="TRUTH"
              leadIn="The psychological rule:"
              focusWord="it's an energy-deploying hormone that unlocks glucose and drive."
              subline=""
              focusStyle="serif_italic"
              colorTheme="rose"
              entranceFrame={296}
              focusWordDelay={10}
              sublineDelay={22}
              showUnderline
              arrowPreset="loop_down"
            />
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 3: SPOKEN INTERACTIVE QUESTION CTA (Frames 587+) */}
      {/* ======================================================== */}
      {frame >= 587 && (() => {
        const spTellMe = spring({
          frame: Math.max(0, frame - 673),
          fps,
          config: { damping: 12, stiffness: 180 },
        });

        return (
          <div className="w-full h-full flex flex-col items-center justify-center relative">
            <div className="absolute top-[16%] inset-x-0 px-8 flex flex-col items-center text-center">
              <EditorialTypographyScene
                ghostEcho="HONESTY"
                leadIn="Do you"
                focusWord="get morning sunlight,"
                subline="or scroll in bed?"
                focusStyle="serif_italic"
                colorTheme="sky"
                entranceFrame={587}
                focusWordDelay={12}
                sublineDelay={22}
              />

              {frame >= 673 && (
                <div
                  className="mt-6 flex flex-col items-center gap-3 pointer-events-none"
                  style={{
                    opacity: Math.min(1, spTellMe * 1.5),
                    transform: `scale(${interpolate(spTellMe, [0, 1], [0.85, 1])}) translateY(${interpolate(
                      spTellMe,
                      [0, 1],
                      [20, 0]
                    )}px)`,
                  }}
                >
                  <HandwrittenArrow
                    preset="loop_down"
                    entranceFrame={673}
                    color="#0071e3"
                    width={110}
                    height={120}
                  />
                  <div className="px-8 py-3.5 rounded-full bg-slate-900 text-white font-mono font-black text-2xl uppercase tracking-wider shadow-2xl flex items-center gap-3">
                    <span>Tell me below 👇</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      
      {/* ======================================================== */}
      {/* TACTICAL RETENTION MEME POP (< 2.5s Strict Cap)          */}
      {/* ======================================================== */}
      <TacticalMemeCard
        memeId="al_pacino_depressed_bench"
        startFrame={0}
        durationFrames={48}
        playbackRate={1.35}
        hudLabel="CHRONIC EXHAUSTION // BURNOUT"
        theme="apple_studio"
        position="top"
      />

      
      {/* ======================================================== */}
      {/* MID-VIDEO GEN-Z MEME REACTION STICKER POP               */}
      {/* ======================================================== */}
      <MemeStickerOverlay
        stickerId="anya_smug"
        startFrame={248}
        durationFrames={34}
        position="top-right"
        badgeText="HEH 𓁹‿𓁹"
      />


      <InteractiveEngagementPill
        entranceFrame={481}
        durationFrames={105}
        prompt="Have you felt this? Drop your thoughts 👇"
        tag="COMMUNITY"
        icon="brain"
        theme="apple_studio"
      />
    </div>
  );
};
