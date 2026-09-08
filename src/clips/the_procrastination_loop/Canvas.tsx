import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { PhysicalCard } from "../../components/physics/PhysicalCard";
import { TapeStrip } from "../../components/collage/TapeStrip";
import { ProCutout } from "../../components/ProCutout";
import { ProductPageShowcase } from "../../components/ProductPageShowcase";
import { CinematicIllustrationCard } from "../../components/CinematicIllustrationCard";
import { InteractiveEngagementPill } from "../../components/InteractiveEngagementPill";
import { TacticalMemeCard, TacticalMemeFrame } from "../../components/TacticalMemeCard";
import { ConceptKeywordSlam } from "../../components/ConceptKeywordSlam";
import { MemeStickerOverlay } from "../../components/MemeStickerOverlay";
import { Sparkles, Zap, ArrowRight } from "lucide-react";
import { WordTimestamp } from "../../types";

interface CanvasProps {
  transcript: WordTimestamp[];
}

export const TheProcrastinationLoopCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-8 select-none">
      {/* ======================================================== */}
      {/* SCENE 1: THE ROOT FRICTION & HOOK (Frames 0 - 188) */}
      {/* ======================================================== */}
      {frame >= 0 && frame < 188 && (
        <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
          <CinematicIllustrationCard
            imageSrc="the_procrastination_loop/assets/scene_illustration.png"
            accentColor="blue"
            entranceFrame={0}
            beats={[
            {
                        "frame": 79,
                        "type": "callout",
                        "text": "READY REALITY",
                        "subtext": "Psychologists call this Temporal Self-Appraisal...",
                        "position": "top-right",
                        "icon": "target",
                        "color": "blue",
                        "zoomLevel": 1.15,
                        "targetX": 50,
                        "targetY": 40
            },
            {
                        "frame": 142,
                        "type": "stamp",
                        "text": "SUBCONSCIOUS PARALYSIS",
                        "subtext": "COGNITIVE OVERLOAD",
                        "position": "bottom-left",
                        "icon": "alert",
                        "color": "rose"
            }
]}
            width={920}
            height={520}
            tiltX={3}
            tiltY={-3}
          />
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 2A: HIGH-IMPACT CONCEPT KEYWORD SLAM              */}
      {/* (Frames 188 - 263)             */}
      {/* ======================================================== */}
      {frame >= 188 && frame < 263 && (
        <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-150">
          <ConceptKeywordSlam
            term="TEMPORAL SELF-APPRAISAL BIAS"
            definition="Your brain doesn't fear the task — it fears the version of you that might fail at it"
            categoryBadge="PSYCHOLOGICAL MECHANISM // 01"
            entranceFrame={188}
            durationFrames={75}
            theme="apple_studio"
            icon="brain"
            width={920}
          />
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 2B: THE BREAKDOWN (REVEALED ONE-BY-ONE AS SPOKEN!)  */}
      {/* (Frames 263 - 454)                     */}
      {/* ======================================================== */}
      {frame >= 263 && frame < 454 && (() => {
        const spP1 = spring({ frame: frame - 263, fps, config: { damping: 13, stiffness: 140 } });
        const spP2 = spring({ frame: frame - 263, fps, config: { damping: 13, stiffness: 140 } });
        const spP3 = spring({ frame: frame - 317, fps, config: { damping: 13, stiffness: 140 } });
        const spP4 = spring({ frame: frame - 370, fps, config: { damping: 13, stiffness: 140 } });
        const spP5 = spring({ frame: frame - 418, fps, config: { damping: 13, stiffness: 140 } });

        return (
          <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
            <div className="relative w-full max-w-[920px]">
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                <TapeStrip position="center-top" width={180} height={48} enableWobble />
              </div>

              <PhysicalCard
                tiltX={-5}
                tiltY={4}
                elevation={44}
                impactMs={8767}
                className="w-full p-8 rounded-3xl bg-white/95 border-2 border-sky-300/60 shadow-2xl backdrop-blur-md flex flex-col items-center text-center gap-6"
              >
                {/* Clean Uncrowded Section Header - NO RAW TOPIC LEAKS */}
                <div className="text-center mt-1">
                  <h2 className="text-5xl font-black text-slate-950 leading-tight uppercase tracking-tight">
                    THE PROCRASTINATION TRAP
                  </h2>
                  <div className="text-2xl font-mono text-[#0071e3] font-bold mt-1 tracking-wider uppercase">
                    The Psychology Behind Procrastination
                  </div>
                </div>

                {/* PROGRESSIVE SEQUENTIAL REVEALS: ONE BY ONE ON EXACT WORDS */}
                <div className="flex flex-col gap-4 w-full my-1">
                  
                {/* Progressive Item 1 (Spoken Frame: 263) */}
                <div
                  style={{
                    opacity: frame >= 263 ? Math.min(1, spP1 * 1.2) : 0,
                    transform: `scale(${frame >= 263 ? interpolate(spP1, [0, 1], [0.8, 1]) : 0.8}) translateY(${frame >= 263 ? interpolate(spP1, [0, 1], [25, 0]) : 25}px)`,
                    pointerEvents: frame >= 263 ? "auto" : "none",
                  }}
                >
                  <div className="p-4 rounded-2xl bg-slate-50/90 border border-sky-200/80 flex items-center justify-between text-left shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#0071e3]/15 text-[#0071e3] flex items-center justify-center text-3xl font-black font-mono shrink-0">
                        01
                      </div>
                      <div>
                        <div className="text-3xl font-black text-slate-950">
                          Your brain doesn't fear the task
                        </div>
                        
                      </div>
                    </div>
                  </div>
                </div>
                {/* Progressive Item 2 (Spoken Frame: 263) */}
                <div
                  style={{
                    opacity: frame >= 263 ? Math.min(1, spP2 * 1.2) : 0,
                    transform: `scale(${frame >= 263 ? interpolate(spP2, [0, 1], [0.8, 1]) : 0.8}) translateY(${frame >= 263 ? interpolate(spP2, [0, 1], [25, 0]) : 25}px)`,
                    pointerEvents: frame >= 263 ? "auto" : "none",
                  }}
                >
                  <div className="p-4 rounded-2xl bg-slate-50/90 border border-sky-200/80 flex items-center justify-between text-left shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#0071e3]/15 text-[#0071e3] flex items-center justify-center text-3xl font-black font-mono shrink-0">
                        02
                      </div>
                      <div>
                        <div className="text-3xl font-black text-slate-950">
                          it fears the version of you that might fail at it.
                        </div>
                        
                      </div>
                    </div>
                  </div>
                </div>
                {/* Progressive Item 3 (Spoken Frame: 317) */}
                <div
                  style={{
                    opacity: frame >= 317 ? Math.min(1, spP3 * 1.2) : 0,
                    transform: `scale(${frame >= 317 ? interpolate(spP3, [0, 1], [0.8, 1]) : 0.8}) translateY(${frame >= 317 ? interpolate(spP3, [0, 1], [25, 0]) : 25}px)`,
                    pointerEvents: frame >= 317 ? "auto" : "none",
                  }}
                >
                  <div className="p-4 rounded-2xl bg-slate-50/90 border border-sky-200/80 flex items-center justify-between text-left shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#0071e3]/15 text-[#0071e3] flex items-center justify-center text-3xl font-black font-mono shrink-0">
                        03
                      </div>
                      <div>
                        <div className="text-3xl font-black text-slate-950">
                          So you keep moving the start line.
                        </div>
                        
                      </div>
                    </div>
                  </div>
                </div>
                {/* Progressive Item 4 (Spoken Frame: 370) */}
                <div
                  style={{
                    opacity: frame >= 370 ? Math.min(1, spP4 * 1.2) : 0,
                    transform: `scale(${frame >= 370 ? interpolate(spP4, [0, 1], [0.8, 1]) : 0.8}) translateY(${frame >= 370 ? interpolate(spP4, [0, 1], [25, 0]) : 25}px)`,
                    pointerEvents: frame >= 370 ? "auto" : "none",
                  }}
                >
                  <div className="p-4 rounded-2xl bg-slate-50/90 border border-sky-200/80 flex items-center justify-between text-left shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#0071e3]/15 text-[#0071e3] flex items-center justify-center text-3xl font-black font-mono shrink-0">
                        04
                      </div>
                      <div>
                        <div className="text-3xl font-black text-slate-950">
                          The delay isn't laziness.
                        </div>
                        
                      </div>
                    </div>
                  </div>
                </div>
                {/* Progressive Item 5 (Spoken Frame: 418) */}
                <div
                  style={{
                    opacity: frame >= 418 ? Math.min(1, spP5 * 1.2) : 0,
                    transform: `scale(${frame >= 418 ? interpolate(spP5, [0, 1], [0.8, 1]) : 0.8}) translateY(${frame >= 418 ? interpolate(spP5, [0, 1], [25, 0]) : 25}px)`,
                    pointerEvents: frame >= 418 ? "auto" : "none",
                  }}
                >
                  <div className="p-4 rounded-2xl bg-slate-50/90 border border-sky-200/80 flex items-center justify-between text-left shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#0071e3]/15 text-[#0071e3] flex items-center justify-center text-3xl font-black font-mono shrink-0">
                        05
                      </div>
                      <div>
                        <div className="text-3xl font-black text-slate-950">
                          It's self-protection.
                        </div>
                        
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              </PhysicalCard>
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* SCENE 3: SOLUTION PROTOCOL / PRODUCT SHOWCASE (Frames 454 - 525) */}
      {/* ======================================================== */}
      {frame >= 454 && frame < 525 && (() => {
        const spSolCutout = spring({ frame: frame - 454, fps, config: { damping: 13, stiffness: 140 } });
        const spFinale = spring({ frame: frame - 584, fps, config: { damping: 13, stiffness: 140 } });

        return (
          <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
            <div className="relative w-full max-w-[920px]">
              <div className="absolute -top-7 left-8 z-30 pointer-events-none">
                <TapeStrip position="top-left" width={180} height={48} enableWobble />
              </div>

              <PhysicalCard
                tiltX={3}
                tiltY={-3}
                elevation={45}
                impactMs={15133}
                className="w-full p-8 rounded-3xl bg-white/95 border-2 border-sky-300/60 shadow-2xl backdrop-blur-md flex flex-col items-center text-center gap-6"
              >
                <h3 className="text-5xl font-black text-slate-950 leading-tight mt-1">
                  Be honest: what's the one thing you keep postponing that you actually care deeply about?
                </h3>

                <div
                  className="w-full flex justify-center items-center my-2 transition-all"
                  style={{
                    opacity: frame >= 454 ? Math.min(1, spSolCutout * 1.2) : 0,
                    transform: `scale(${frame >= 454 ? interpolate(spSolCutout, [0, 1], [0.6, 1]) : 0.6}) translateY(${frame >= 454 ? interpolate(spSolCutout, [0, 1], [30, 0]) : 30}px)`,
                    pointerEvents: frame >= 454 ? "auto" : "none",
                  }}
                >
                  <ProCutout
                    assetId="hyperrealistic_3d_glowing_brain"
                    glowColor="amber"
                    animation="stamp_impact"
                    width={420}
                    height={320}
                    ghostText="REWIRE"
                  />
                </div>

                <div
                  className="w-full transition-all"
                  style={{
                    opacity: frame >= 584 ? Math.min(1, spFinale * 1.2) : 0,
                    transform: `scale(${frame >= 584 ? interpolate(spFinale, [0, 1], [0.8, 1]) : 0.8})`,
                    pointerEvents: frame >= 584 ? "auto" : "none",
                  }}
                >
                  <div className="w-full p-5 rounded-2xl bg-black/60 border border-emerald-500/30 flex items-center justify-center gap-3 text-3xl font-black text-[#0071e3] shadow-xl">
                    <Sparkles className="w-7 h-7 text-emerald-400 shrink-0" />
                    <span>Tell me below.</span>
                  </div>
                </div>
              </PhysicalCard>
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* ON-SCREEN INTERACTIVE ENGAGEMENT PILL (Seconds 18–22)    */}
      {/* ======================================================== */}
      <InteractiveEngagementPill
        entranceFrame={420}
        durationFrames={105}
        prompt="Have you felt this? Drop your thoughts 👇"
        tag="COMMUNITY"
        icon="brain"
        theme="apple_studio"
      />
      
      {/* ======================================================== */}
      {/* TACTICAL RETENTION MEME POP (< 2.5s Strict Cap)          */}
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
      {/* MID-VIDEO GEN-Z MEME REACTION STICKER POP               */}
      {/* ======================================================== */}
      <MemeStickerOverlay
        stickerId="anya_smug"
        startFrame={223}
        durationFrames={34}
        position="top-right"
        badgeText="HEH 𓁹‿𓁹"
      />

    </div>
  );
};
