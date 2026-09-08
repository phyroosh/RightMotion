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
      {/* SCENE 1: THE ROOT FRICTION & HOOK (Frames 0 - 129) */}
      {/* ======================================================== */}
      {frame >= 0 && frame < 129 && (
        <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
          <CinematicIllustrationCard
            imageSrc="the_procrastination_loop/assets/scene_illustration.png"
            accentColor="blue"
            entranceFrame={0}
            beats={[
            {
                        "frame": 54,
                        "type": "callout",
                        "text": "CLEAN REALITY",
                        "subtext": "The Procrastination",
                        "position": "top-right",
                        "icon": "target",
                        "color": "blue",
                        "zoomLevel": 1.15,
                        "targetX": 50,
                        "targetY": 40
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
      {/* (Frames 129 - 204)             */}
      {/* ======================================================== */}
      {frame >= 129 && frame < 204 && (
        <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-150">
          <ConceptKeywordSlam
            term="THE PROCRASTINATION TRAP"
            definition="The Psychology Behind Procrastination"
            categoryBadge="COGNITIVE DIAGNOSTIC // 01"
            entranceFrame={129}
            durationFrames={75}
            theme="apple_studio"
            icon="brain"
            width={920}
          />
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 2B: THE BREAKDOWN (REVEALED ONE-BY-ONE AS SPOKEN!)  */}
      {/* (Frames 204 - 703)                     */}
      {/* ======================================================== */}
      {frame >= 204 && frame < 703 && (() => {
        const spP1 = spring({ frame: frame - 204, fps, config: { damping: 13, stiffness: 140 } });
        const spP2 = spring({ frame: frame - 204, fps, config: { damping: 13, stiffness: 140 } });
        const spP3 = spring({ frame: frame - 265, fps, config: { damping: 13, stiffness: 140 } });
        const spP4 = spring({ frame: frame - 325, fps, config: { damping: 13, stiffness: 140 } });
        const spP5 = spring({ frame: frame - 375, fps, config: { damping: 13, stiffness: 140 } });
        const spP6 = spring({ frame: frame - 434, fps, config: { damping: 13, stiffness: 140 } });
        const spP7 = spring({ frame: frame - 531, fps, config: { damping: 13, stiffness: 140 } });
        const spP8 = spring({ frame: frame - 589, fps, config: { damping: 13, stiffness: 140 } });
        const spP9 = spring({ frame: frame - 645, fps, config: { damping: 13, stiffness: 140 } });

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
                impactMs={6800}
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
                  
                {/* Progressive Item 1 (Spoken Frame: 204) */}
                <div
                  style={{
                    opacity: frame >= 204 ? Math.min(1, spP1 * 1.2) : 0,
                    transform: `scale(${frame >= 204 ? interpolate(spP1, [0, 1], [0.8, 1]) : 0.8}) translateY(${frame >= 204 ? interpolate(spP1, [0, 1], [25, 0]) : 25}px)`,
                    pointerEvents: frame >= 204 ? "auto" : "none",
                  }}
                >
                  <div className="p-4 rounded-2xl bg-slate-50/90 border border-sky-200/80 flex items-center justify-between text-left shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#0071e3]/15 text-[#0071e3] flex items-center justify-center text-3xl font-black font-mono shrink-0">
                        01
                      </div>
                      <div>
                        <div className="text-3xl font-black text-slate-950">
                          That's not laziness.
                        </div>
                        
                      </div>
                    </div>
                  </div>
                </div>
                {/* Progressive Item 2 (Spoken Frame: 204) */}
                <div
                  style={{
                    opacity: frame >= 204 ? Math.min(1, spP2 * 1.2) : 0,
                    transform: `scale(${frame >= 204 ? interpolate(spP2, [0, 1], [0.8, 1]) : 0.8}) translateY(${frame >= 204 ? interpolate(spP2, [0, 1], [25, 0]) : 25}px)`,
                    pointerEvents: frame >= 204 ? "auto" : "none",
                  }}
                >
                  <div className="p-4 rounded-2xl bg-slate-50/90 border border-sky-200/80 flex items-center justify-between text-left shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#0071e3]/15 text-[#0071e3] flex items-center justify-center text-3xl font-black font-mono shrink-0">
                        02
                      </div>
                      <div>
                        <div className="text-3xl font-black text-slate-950">
                          It's your amygdala firing a threat signal at the task itself.
                        </div>
                        
                      </div>
                    </div>
                  </div>
                </div>
                {/* Progressive Item 3 (Spoken Frame: 265) */}
                <div
                  style={{
                    opacity: frame >= 265 ? Math.min(1, spP3 * 1.2) : 0,
                    transform: `scale(${frame >= 265 ? interpolate(spP3, [0, 1], [0.8, 1]) : 0.8}) translateY(${frame >= 265 ? interpolate(spP3, [0, 1], [25, 0]) : 25}px)`,
                    pointerEvents: frame >= 265 ? "auto" : "none",
                  }}
                >
                  <div className="p-4 rounded-2xl bg-slate-50/90 border border-sky-200/80 flex items-center justify-between text-left shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#0071e3]/15 text-[#0071e3] flex items-center justify-center text-3xl font-black font-mono shrink-0">
                        03
                      </div>
                      <div>
                        <div className="text-3xl font-black text-slate-950">
                          Psychologists call it Limbic Friction.
                        </div>
                        
                      </div>
                    </div>
                  </div>
                </div>
                {/* Progressive Item 4 (Spoken Frame: 325) */}
                <div
                  style={{
                    opacity: frame >= 325 ? Math.min(1, spP4 * 1.2) : 0,
                    transform: `scale(${frame >= 325 ? interpolate(spP4, [0, 1], [0.8, 1]) : 0.8}) translateY(${frame >= 325 ? interpolate(spP4, [0, 1], [25, 0]) : 25}px)`,
                    pointerEvents: frame >= 325 ? "auto" : "none",
                  }}
                >
                  <div className="p-4 rounded-2xl bg-slate-50/90 border border-sky-200/80 flex items-center justify-between text-left shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#0071e3]/15 text-[#0071e3] flex items-center justify-center text-3xl font-black font-mono shrink-0">
                        04
                      </div>
                      <div>
                        <div className="text-3xl font-black text-slate-950">
                          Your planning brain wants to go.
                        </div>
                        
                      </div>
                    </div>
                  </div>
                </div>
                {/* Progressive Item 5 (Spoken Frame: 375) */}
                <div
                  style={{
                    opacity: frame >= 375 ? Math.min(1, spP5 * 1.2) : 0,
                    transform: `scale(${frame >= 375 ? interpolate(spP5, [0, 1], [0.8, 1]) : 0.8}) translateY(${frame >= 375 ? interpolate(spP5, [0, 1], [25, 0]) : 25}px)`,
                    pointerEvents: frame >= 375 ? "auto" : "none",
                  }}
                >
                  <div className="p-4 rounded-2xl bg-slate-50/90 border border-sky-200/80 flex items-center justify-between text-left shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#0071e3]/15 text-[#0071e3] flex items-center justify-center text-3xl font-black font-mono shrink-0">
                        05
                      </div>
                      <div>
                        <div className="text-3xl font-black text-slate-950">
                          Your survival brain sees risk.
                        </div>
                        
                      </div>
                    </div>
                  </div>
                </div>
                {/* Progressive Item 6 (Spoken Frame: 434) */}
                <div
                  style={{
                    opacity: frame >= 434 ? Math.min(1, spP6 * 1.2) : 0,
                    transform: `scale(${frame >= 434 ? interpolate(spP6, [0, 1], [0.8, 1]) : 0.8}) translateY(${frame >= 434 ? interpolate(spP6, [0, 1], [25, 0]) : 25}px)`,
                    pointerEvents: frame >= 434 ? "auto" : "none",
                  }}
                >
                  <div className="p-4 rounded-2xl bg-slate-50/90 border border-sky-200/80 flex items-center justify-between text-left shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#0071e3]/15 text-[#0071e3] flex items-center justify-center text-3xl font-black font-mono shrink-0">
                        06
                      </div>
                      <div>
                        <div className="text-3xl font-black text-slate-950">
                          The fix
                        </div>
                        <div className="text-2xl font-mono text-sky-700 font-bold mt-0.5">narrow your gaze onto your task for 10 seconds.</div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Progressive Item 7 (Spoken Frame: 531) */}
                <div
                  style={{
                    opacity: frame >= 531 ? Math.min(1, spP7 * 1.2) : 0,
                    transform: `scale(${frame >= 531 ? interpolate(spP7, [0, 1], [0.8, 1]) : 0.8}) translateY(${frame >= 531 ? interpolate(spP7, [0, 1], [25, 0]) : 25}px)`,
                    pointerEvents: frame >= 531 ? "auto" : "none",
                  }}
                >
                  <div className="p-4 rounded-2xl bg-slate-50/90 border border-sky-200/80 flex items-center justify-between text-left shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#0071e3]/15 text-[#0071e3] flex items-center justify-center text-3xl font-black font-mono shrink-0">
                        07
                      </div>
                      <div>
                        <div className="text-3xl font-black text-slate-950">
                          That resets the threat response.
                        </div>
                        
                      </div>
                    </div>
                  </div>
                </div>
                {/* Progressive Item 8 (Spoken Frame: 589) */}
                <div
                  style={{
                    opacity: frame >= 589 ? Math.min(1, spP8 * 1.2) : 0,
                    transform: `scale(${frame >= 589 ? interpolate(spP8, [0, 1], [0.8, 1]) : 0.8}) translateY(${frame >= 589 ? interpolate(spP8, [0, 1], [25, 0]) : 25}px)`,
                    pointerEvents: frame >= 589 ? "auto" : "none",
                  }}
                >
                  <div className="p-4 rounded-2xl bg-slate-50/90 border border-sky-200/80 flex items-center justify-between text-left shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#0071e3]/15 text-[#0071e3] flex items-center justify-center text-3xl font-black font-mono shrink-0">
                        08
                      </div>
                      <div>
                        <div className="text-3xl font-black text-slate-950">
                          Your brain stops resisting the start.
                        </div>
                        
                      </div>
                    </div>
                  </div>
                </div>
                {/* Progressive Item 9 (Spoken Frame: 645) */}
                <div
                  style={{
                    opacity: frame >= 645 ? Math.min(1, spP9 * 1.2) : 0,
                    transform: `scale(${frame >= 645 ? interpolate(spP9, [0, 1], [0.8, 1]) : 0.8}) translateY(${frame >= 645 ? interpolate(spP9, [0, 1], [25, 0]) : 25}px)`,
                    pointerEvents: frame >= 645 ? "auto" : "none",
                  }}
                >
                  <div className="p-4 rounded-2xl bg-slate-50/90 border border-sky-200/80 flex items-center justify-between text-left shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#0071e3]/15 text-[#0071e3] flex items-center justify-center text-3xl font-black font-mono shrink-0">
                        09
                      </div>
                      <div>
                        <div className="text-3xl font-black text-slate-950">
                          What's the task you keep avoiding?
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
      {/* SCENE 3: SOLUTION PROTOCOL / PRODUCT SHOWCASE (Frames 703 - 718) */}
      {/* ======================================================== */}
      {frame >= 703 && frame < 718 && (() => {
        const spSolCutout = spring({ frame: frame - 703, fps, config: { damping: 13, stiffness: 140 } });
        const spFinale = spring({ frame: frame - 703, fps, config: { damping: 13, stiffness: 140 } });

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
                impactMs={23433}
                className="w-full p-8 rounded-3xl bg-white/95 border-2 border-sky-300/60 shadow-2xl backdrop-blur-md flex flex-col items-center text-center gap-6"
              >
                <h3 className="text-5xl font-black text-slate-950 leading-tight mt-1">
                  Tell me below.
                </h3>

                <div
                  className="w-full flex justify-center items-center my-2 transition-all"
                  style={{
                    opacity: frame >= 703 ? Math.min(1, spSolCutout * 1.2) : 0,
                    transform: `scale(${frame >= 703 ? interpolate(spSolCutout, [0, 1], [0.6, 1]) : 0.6}) translateY(${frame >= 703 ? interpolate(spSolCutout, [0, 1], [30, 0]) : 30}px)`,
                    pointerEvents: frame >= 703 ? "auto" : "none",
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
                    opacity: frame >= 703 ? Math.min(1, spFinale * 1.2) : 0,
                    transform: `scale(${frame >= 703 ? interpolate(spFinale, [0, 1], [0.8, 1]) : 0.8})`,
                    pointerEvents: frame >= 703 ? "auto" : "none",
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
        entranceFrame={503}
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
        stickerId="shaq_timeout_pause"
        startFrame={164}
        durationFrames={34}
        position="center-left"
        badgeText="HOLD UP PAUSE"
      />

    </div>
  );
};
