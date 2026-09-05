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

export const GitaInTeenageCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-8 select-none">
      
      {/* ======================================================== */}
      {/* SCENE 1: THE ROOT FRICTION & HOOK (Frames 0 - 241) */}
      {/* ======================================================== */}
      {frame >= 0 && frame < 241 && (
        <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
          <CinematicIllustrationCard
            imageSrc="gita_in_teenage/assets/scene_illustration.png"
            title="Notice how you pretend not to care about the things you actually want most?"
            subtitle="We learn to act indifferent so nobody can laugh at us if we fall short."
            badgeLabel="COGNITIVE DIAGNOSTIC // 01"
            accentColor="cyan"
            entranceFrame={0}
            subtitleFrame={82}
            beats={[
            {
                        "frame": 82,
                        "type": "callout",
                        "text": "WANT REALITY",
                        "subtext": "We learn to act indifferent so nobody can laugh...",
                        "position": "top-right",
                        "icon": "target",
                        "color": "cyan",
                        "zoomLevel": 1.15,
                        "targetX": 50,
                        "targetY": 40
            },
            {
                        "frame": 174,
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
      {/* (Frames 241 - 628)                          */}
      {/* ======================================================== */}
      {frame >= 241 && frame < 628 && (() => {
        const spP1 = spring({ frame: frame - 241, fps, config: { damping: 13, stiffness: 140 } });
        const spP2 = spring({ frame: frame - 307, fps, config: { damping: 13, stiffness: 140 } });
        const spP3 = spring({ frame: frame - 458, fps, config: { damping: 13, stiffness: 140 } });

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
                impactMs={8033}
                className="w-full p-8 rounded-3xl bg-[#0a1124]/95 border-2 border-cyan-500/40 shadow-2xl backdrop-blur-md flex flex-col items-center text-center gap-6"
              >
                {/* Clean Uncrowded Section Header */}
                <div className="text-center mt-1">
                  <h2 className="text-5xl font-black text-white leading-tight">
                    The Gita for Teenagers
                  </h2>
                  <div className="text-2xl font-mono text-cyan-400 font-bold mt-1 tracking-wider uppercase">
                    Core Principles & Breakdown
                  </div>
                </div>

                {/* PROGRESSIVE SEQUENTIAL REVEALS: ONE BY ONE ON EXACT WORDS */}
                <div className="flex flex-col gap-4 w-full my-1">
                  
                {/* Progressive Item 1 (Spoken Frame: 241) */}
                <div
                  style={{
                    opacity: frame >= 241 ? Math.min(1, spP1 * 1.2) : 0,
                    transform: `scale(${frame >= 241 ? interpolate(spP1, [0, 1], [0.8, 1]) : 0.8}) translateY(${frame >= 241 ? interpolate(spP1, [0, 1], [25, 0]) : 25}px)`,
                    pointerEvents: frame >= 241 ? "auto" : "none",
                  }}
                >
                  <div className="p-4 rounded-2xl bg-[#0e172f]/90 border border-cyan-500/40 flex items-center justify-between text-left shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-cyan-500/25 text-cyan-400 flex items-center justify-center text-3xl font-black font-mono shrink-0">
                        01
                      </div>
                      <div>
                        <div className="text-3xl font-black text-white">
                          Psychologists call this the social mask.
                        </div>
                        
                      </div>
                    </div>
                  </div>
                </div>
                {/* Progressive Item 2 (Spoken Frame: 307) */}
                <div
                  style={{
                    opacity: frame >= 307 ? Math.min(1, spP2 * 1.2) : 0,
                    transform: `scale(${frame >= 307 ? interpolate(spP2, [0, 1], [0.8, 1]) : 0.8}) translateY(${frame >= 307 ? interpolate(spP2, [0, 1], [25, 0]) : 25}px)`,
                    pointerEvents: frame >= 307 ? "auto" : "none",
                  }}
                >
                  <div className="p-4 rounded-2xl bg-[#0e172f]/90 border border-cyan-500/40 flex items-center justify-between text-left shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-cyan-500/25 text-cyan-400 flex items-center justify-center text-3xl font-black font-mono shrink-0">
                        02
                      </div>
                      <div>
                        <div className="text-3xl font-black text-white">
                          You spend so much energy performing casualness that you never give yourself permission to be a beginner.
                        </div>
                        
                      </div>
                    </div>
                  </div>
                </div>
                {/* Progressive Item 3 (Spoken Frame: 458) */}
                <div
                  style={{
                    opacity: frame >= 458 ? Math.min(1, spP3 * 1.2) : 0,
                    transform: `scale(${frame >= 458 ? interpolate(spP3, [0, 1], [0.8, 1]) : 0.8}) translateY(${frame >= 458 ? interpolate(spP3, [0, 1], [25, 0]) : 25}px)`,
                    pointerEvents: frame >= 458 ? "auto" : "none",
                  }}
                >
                  <div className="p-4 rounded-2xl bg-[#0e172f]/90 border border-cyan-500/40 flex items-center justify-between text-left shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-cyan-500/25 text-cyan-400 flex items-center justify-center text-3xl font-black font-mono shrink-0">
                        03
                      </div>
                      <div>
                        <div className="text-3xl font-black text-white">
                          The real shift happens when you decide being caught trying is better than spending your youth performing a life you don't even want.
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
      {/* SCENE 3: SOLUTION PROTOCOL / PRODUCT SHOWCASE (Frames 628 - 715) */}
      {/* ======================================================== */}
      {frame >= 628 && frame < 715 && (() => {
        const spSolCutout = spring({ frame: frame - 628, fps, config: { damping: 13, stiffness: 140 } });
        const spFinale = spring({ frame: frame - 728, fps, config: { damping: 13, stiffness: 140 } });

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
                impactMs={20933}
                className="w-full p-8 rounded-3xl bg-[#0a1124]/95 border-2 border-cyan-500/40 shadow-2xl backdrop-blur-md flex flex-col items-center text-center gap-6"
              >
                <h3 className="text-5xl font-black text-white leading-tight mt-1">
                  If you're trying to figure yourself out without all the noise, stick around.
                </h3>

                <div
                  className="w-full flex justify-center items-center my-2 transition-all"
                  style={{
                    opacity: frame >= 628 ? Math.min(1, spSolCutout * 1.2) : 0,
                    transform: `scale(${frame >= 628 ? interpolate(spSolCutout, [0, 1], [0.6, 1]) : 0.6}) translateY(${frame >= 628 ? interpolate(spSolCutout, [0, 1], [30, 0]) : 30}px)`,
                    pointerEvents: frame >= 628 ? "auto" : "none",
                  }}
                >
                  <ProCutout
                    assetId="hyperrealistic_3d_glowing_brain"
                    glowColor="cyan"
                    animation="stamp_impact"
                    width={420}
                    height={320}
                    ghostText="REWIRE"
                  />
                </div>

                <div
                  className="w-full transition-all"
                  style={{
                    opacity: frame >= 728 ? Math.min(1, spFinale * 1.2) : 0,
                    transform: `scale(${frame >= 728 ? interpolate(spFinale, [0, 1], [0.8, 1]) : 0.8})`,
                    pointerEvents: frame >= 728 ? "auto" : "none",
                  }}
                >
                  <div className="w-full p-5 rounded-2xl bg-black/60 border border-emerald-500/30 flex items-center justify-center gap-3 text-3xl font-black text-cyan-400 shadow-xl">
                    <Sparkles className="w-7 h-7 text-emerald-400 shrink-0" />
                    <span>We unpack these patterns every day.</span>
                  </div>
                </div>
              </PhysicalCard>
            </div>
          </div>
        );
      })()}

      {/* ON-SCREEN INTERACTIVE ENGAGEMENT PILL (Seconds 17.3–21 / Frame 520) */}
      <InteractiveEngagementPill
        entranceFrame={520}
        durationFrames={105}
        prompt="Have you caught yourself doing this? 🧠"
        tag="MINDSET AUDIT"
        icon="brain"
        theme="apple_studio"
      />
    </div>
  );
};
