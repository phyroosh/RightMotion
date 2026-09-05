import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { PhysicalCard } from "../../components/physics/PhysicalCard";
import { TapeStrip } from "../../components/collage/TapeStrip";
import { ProCutout } from "../../components/ProCutout";
import { ProductPageShowcase } from "../../components/ProductPageShowcase";
import { CinematicIllustrationCard } from "../../components/CinematicIllustrationCard";
import { InteractiveEngagementPill } from "../../components/InteractiveEngagementPill";
import { Sparkles, Zap, ArrowRight } from "lucide-react";
import { WordTimestamp } from "../../types";

interface CanvasProps {
  transcript: WordTimestamp[];
}

export const RealityOfSocialMediaCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-8 select-none">
      
      {/* ======================================================== */}
      {/* SCENE 1: THE ROOT FRICTION & HOOK (Frames 0 - 220) */}
      {/* ======================================================== */}
      {frame >= 0 && frame < 220 && (
        <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
          <CinematicIllustrationCard
            imageSrc="reality_of_social_media/assets/scene_illustration.png"
            title="Notice how you have a completely fine day until you open your phone for three minutes?"
            subtitle="Suddenly everyone's life looks miles ahead of yours."
            badgeLabel="COGNITIVE DIAGNOSTIC // 01"
            accentColor="blue"
            entranceFrame={0}
            subtitleFrame={58}
            beats={[
            {
                        "frame": 58,
                        "type": "callout",
                        "text": "OPEN REALITY",
                        "subtext": "Suddenly everyone's life looks miles ahead of...",
                        "position": "top-right",
                        "icon": "target",
                        "color": "blue",
                        "zoomLevel": 1.15,
                        "targetX": 50,
                        "targetY": 40
            },
            {
                        "frame": 152,
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
      {/* SCENE 2: THE BREAKDOWN (REVEALED ONE-BY-ONE AS SPOKEN!)  */}
      {/* (Frames 220 - 687)                          */}
      {/* ======================================================== */}
      {frame >= 220 && frame < 687 && (() => {
        const spP1 = spring({ frame: frame - 220, fps, config: { damping: 13, stiffness: 140 } });
        const spP2 = spring({ frame: frame - 445, fps, config: { damping: 13, stiffness: 140 } });
        const spP3 = spring({ frame: frame - 585, fps, config: { damping: 13, stiffness: 140 } });

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
                impactMs={7333}
                className="w-full p-8 rounded-3xl bg-white/95 border-2 border-sky-300/60 shadow-2xl backdrop-blur-md flex flex-col items-center text-center gap-6"
              >
                {/* Clean Uncrowded Section Header */}
                <div className="text-center mt-1">
                  <h2 className="text-5xl font-black text-slate-950 leading-tight">
                    Reality of Social Media for Teenagers
                  </h2>
                  <div className="text-2xl font-mono text-[#0071e3] font-bold mt-1 tracking-wider uppercase">
                    Core Principles & Breakdown
                  </div>
                </div>

                {/* PROGRESSIVE SEQUENTIAL REVEALS: ONE BY ONE ON EXACT WORDS */}
                <div className="flex flex-col gap-4 w-full my-1">
                  
                {/* Progressive Item 1 (Spoken Frame: 220) */}
                <div
                  style={{
                    opacity: frame >= 220 ? Math.min(1, spP1 * 1.2) : 0,
                    transform: `scale(${frame >= 220 ? interpolate(spP1, [0, 1], [0.8, 1]) : 0.8}) translateY(${frame >= 220 ? interpolate(spP1, [0, 1], [25, 0]) : 25}px)`,
                    pointerEvents: frame >= 220 ? "auto" : "none",
                  }}
                >
                  <div className="p-4 rounded-2xl bg-slate-50/90 border border-sky-200/80 flex items-center justify-between text-left shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#0071e3]/15 text-[#0071e3] flex items-center justify-center text-3xl font-black font-mono shrink-0">
                        01
                      </div>
                      <div>
                        <div className="text-3xl font-black text-slate-950">
                          Psychologists call this Asymmetric Comparison
                        </div>
                        <div className="text-2xl font-mono text-sky-700 font-bold mt-0.5">your brain measures your raw behind-the-scenes against everyone else's curated highlight reel.</div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Progressive Item 2 (Spoken Frame: 445) */}
                <div
                  style={{
                    opacity: frame >= 445 ? Math.min(1, spP2 * 1.2) : 0,
                    transform: `scale(${frame >= 445 ? interpolate(spP2, [0, 1], [0.8, 1]) : 0.8}) translateY(${frame >= 445 ? interpolate(spP2, [0, 1], [25, 0]) : 25}px)`,
                    pointerEvents: frame >= 445 ? "auto" : "none",
                  }}
                >
                  <div className="p-4 rounded-2xl bg-slate-50/90 border border-sky-200/80 flex items-center justify-between text-left shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#0071e3]/15 text-[#0071e3] flex items-center justify-center text-3xl font-black font-mono shrink-0">
                        02
                      </div>
                      <div>
                        <div className="text-3xl font-black text-slate-950">
                          Algorithms deliberately amplify perfection to keep you feeling inadequate and hooked.
                        </div>
                        
                      </div>
                    </div>
                  </div>
                </div>
                {/* Progressive Item 3 (Spoken Frame: 585) */}
                <div
                  style={{
                    opacity: frame >= 585 ? Math.min(1, spP3 * 1.2) : 0,
                    transform: `scale(${frame >= 585 ? interpolate(spP3, [0, 1], [0.8, 1]) : 0.8}) translateY(${frame >= 585 ? interpolate(spP3, [0, 1], [25, 0]) : 25}px)`,
                    pointerEvents: frame >= 585 ? "auto" : "none",
                  }}
                >
                  <div className="p-4 rounded-2xl bg-slate-50/90 border border-sky-200/80 flex items-center justify-between text-left shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#0071e3]/15 text-[#0071e3] flex items-center justify-center text-3xl font-black font-mono shrink-0">
                        03
                      </div>
                      <div>
                        <div className="text-3xl font-black text-slate-950">
                          Disconnecting is not falling behind — it is protecting your peace.
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
      {/* SCENE 3: SOLUTION PROTOCOL / PRODUCT SHOWCASE (Frames 687 - 745) */}
      {/* ======================================================== */}
      {frame >= 687 && frame < 745 && (() => {
        const spSolCutout = spring({ frame: frame - 687, fps, config: { damping: 13, stiffness: 140 } });
        const spFinale = spring({ frame: frame - 760, fps, config: { damping: 13, stiffness: 140 } });

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
                impactMs={22900}
                className="w-full p-8 rounded-3xl bg-white/95 border-2 border-sky-300/60 shadow-2xl backdrop-blur-md flex flex-col items-center text-center gap-6"
              >
                <h3 className="text-5xl font-black text-slate-950 leading-tight mt-1">
                  If you are ready to stop comparing, stick around.
                </h3>

                <div
                  className="w-full flex justify-center items-center my-2 transition-all"
                  style={{
                    opacity: frame >= 687 ? Math.min(1, spSolCutout * 1.2) : 0,
                    transform: `scale(${frame >= 687 ? interpolate(spSolCutout, [0, 1], [0.6, 1]) : 0.6}) translateY(${frame >= 687 ? interpolate(spSolCutout, [0, 1], [30, 0]) : 30}px)`,
                    pointerEvents: frame >= 687 ? "auto" : "none",
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
                    opacity: frame >= 760 ? Math.min(1, spFinale * 1.2) : 0,
                    transform: `scale(${frame >= 760 ? interpolate(spFinale, [0, 1], [0.8, 1]) : 0.8})`,
                    pointerEvents: frame >= 760 ? "auto" : "none",
                  }}
                >
                  <div className="w-full p-5 rounded-2xl bg-black/60 border border-emerald-500/30 flex items-center justify-center gap-3 text-3xl font-black text-[#0071e3] shadow-xl">
                    <Sparkles className="w-7 h-7 text-emerald-400 shrink-0" />
                    <span>We unpack these patterns every day.</span>
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
        entranceFrame={574}
        durationFrames={105}
        prompt="Have you felt this? Drop your thoughts 👇"
        tag="COMMUNITY"
        icon="brain"
        theme="apple_studio"
      />
    </div>
  );
};
