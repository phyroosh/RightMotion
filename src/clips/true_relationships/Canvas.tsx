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

export const TrueRelationshipsCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-8 select-none pointer-events-none">
      {/* ======================================================== */}
      {/* SCENE 1: THE ROOT HOOK (Frames 0 - 144)                   */}
      {/* "Ever feel like genuine love disappeared the moment..."   */}
      {/* ======================================================== */}
      {frame >= 0 && frame < 144 && (
        <div className="w-full h-full flex flex-col items-center justify-center relative">
          {/* Editorial Hook Typography above the prop */}
          <div className="absolute top-[12%] inset-x-0 px-8 flex justify-center">
            <EditorialTypographyScene
              ghostEcho="LOVE"
              leadIn="Ever feel like"
              focusWord="Genuine Love"
              subline="disappeared the moment relationships became content?"
              focusStyle="serif_italic"
              colorTheme="charcoal"
              entranceFrame={20}
              focusWordDelay={12}
              sublineDelay={24}
              showUnderline
            />
          </div>

          {/* Floating Editorial Photo Prop with Scalloped Stamp */}
          <div className="absolute top-[38%] inset-x-0 flex justify-center">
            <VisualPropCard
              imageSrc="true_relationships/assets/scene_illustration.png"
              width={780}
              height={440}
              entranceFrame={10}
              stampText="CURATED"
              stampSubtext="DISTORTION"
              stampFrame={80}
              stampTheme="trusted_red"
            />
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 2A: PSYCHOLOGICAL CONCEPT SLAM (Frames 144 - 217)   */}
      {/* "Psychologists call this curated distortion."             */}
      {/* ======================================================== */}
      {frame >= 144 && frame < 217 && (
        <div className="w-full h-full flex flex-col items-center justify-center relative">
          <div className="absolute top-[30%] inset-x-0 px-8 flex flex-col items-center justify-center">
            <EditorialTypographyScene
              ghostEcho="DISTORTION"
              leadIn="Psychologists call this"
              focusWord="Curated Distortion."
              subline="Your subconscious measures reality against impossible highlight reels."
              focusStyle="serif_italic"
              colorTheme="sky"
              entranceFrame={144}
              focusWordDelay={14}
              sublineDelay={26}
              showUnderline
              arrowPreset="loop_down"
            />
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 2B: THE MECHANISM VISUALIZATION (Frames 217 - 400)  */}
      {/* "Your brain judges real-life intimacy against highlight   */}
      {/*  reels, mistaking quiet consistency for a lack of passion"*/}
      {/* ======================================================== */}
      {frame >= 217 && frame < 400 && (
        <div className="w-full h-full flex flex-col items-center justify-center relative">
          {/* Top Typography */}
          <div className="absolute top-[12%] inset-x-0 px-8 flex justify-center">
            <EditorialTypographyScene
              ghostEcho="THE TRAP"
              leadIn="Your brain judges real intimacy against"
              focusWord="Highlight Reels"
              subline="Mistaking quiet consistency for a lack of passion."
              focusStyle="serif_bold"
              colorTheme="charcoal"
              entranceFrame={217}
              focusWordDelay={10}
              sublineDelay={24}
              showUnderline
            />
          </div>

          {/* 3D Neural Brain Prop Floating Cleanly with Soft Ambient Occlusion */}
          <div className="absolute top-[44%] inset-x-0 flex justify-center">
            <VisualPropCard
              cutoutId="hyperrealistic_3d_glowing_brain"
              width={560}
              height={420}
              entranceFrame={225}
              ghostEcho="CONSISTENCY"
              stampText="QUIET REALITY"
              stampSubtext="NOT PASSION DEFICIT"
              stampFrame={310}
              stampTheme="verified_blue"
            />
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 2C: THE REWIRE TRUTH (Frames 400 - 526)             */}
      {/* "Healthy love is private, unglamorous, and boring to an   */}
      {/*  algorithm."                                             */}
      {/* ======================================================== */}
      {frame >= 400 && frame < 526 && (
        <div className="w-full h-full flex flex-col items-center justify-center relative">
          <div className="absolute top-[26%] inset-x-0 px-8 flex flex-col items-center justify-center">
            <EditorialTypographyScene
              ghostEcho="ALGORITHM"
              leadIn="Healthy love is"
              focusWord="Private & Unglamorous"
              subline="...and deeply boring to an engagement algorithm."
              focusStyle="serif_italic"
              colorTheme="rose"
              entranceFrame={400}
              focusWordDelay={10}
              sublineDelay={22}
              showUnderline
              arrowPreset="loop_down"
            />
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 3: SPOKEN INTERACTIVE QUESTION CTA (Frames 526+)    */}
      {/* "Be honest: has scrolling ever made you question an       */}
      {/*  otherwise good relationship? Tell me below."             */}
      {/* ======================================================== */}
      {frame >= 526 && (() => {
        const spTellMe = spring({
          frame: Math.max(0, frame - 660),
          fps,
          config: { damping: 12, stiffness: 180 },
        });

        return (
          <div className="w-full h-full flex flex-col items-center justify-center relative">
            <div className="absolute top-[16%] inset-x-0 px-8 flex flex-col items-center text-center">
              <EditorialTypographyScene
                ghostEcho="HONESTY"
                leadIn="Be honest:"
                focusWord="Has Scrolling"
                subline="ever made you question an otherwise good relationship?"
                focusStyle="serif_italic"
                colorTheme="sky"
                entranceFrame={526}
                focusWordDelay={12}
                sublineDelay={22}
              />

              {/* Dynamic Call-To-Action Floating Direct on Canvas */}
              {frame >= 660 && (
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
                    entranceFrame={660}
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
      {/* TACTICAL RETENTION MEME POP (< 2.0s Frame 0 Hook)         */}
      {/* ======================================================== */}
      <TacticalMemeCard
        memeId="courtroom_shout_me"
        startFrame={0}
        durationFrames={44}
        playbackRate={1.4}
        hudLabel="SELF-CONFESSION // GUILTY AS CHARGED"
        theme="apple_studio"
        position="top"
      />

      {/* ======================================================== */}
      {/* MID-VIDEO GEN-Z MEME REACTION STICKERS                   */}
      {/* ======================================================== */}
      <MemeStickerOverlay
        stickerId="verne_turtle_shock"
        startFrame={335}
        durationFrames={36}
        position="bottom-right"
        badgeText="LIVE REACTION"
      />
      <MemeStickerOverlay
        stickerId="anya_smug"
        startFrame={455}
        durationFrames={34}
        position="top-right"
        badgeText="HEH 𓁹‿𓁹"
      />

      {/* ======================================================== */}
      {/* SPOKEN INTERACTIVE PILL (Seconds 18–22)                  */}
      {/* ======================================================== */}
      <InteractiveEngagementPill
        entranceFrame={530}
        durationFrames={105}
        prompt="Questioned good love due to reels? Tell me below 👇"
        tag="CONFESSION"
        icon="brain"
        theme="apple_studio"
      />
    </div>
  );
};
