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
import { Sparkles, Zap, ArrowRight } from "lucide-react";
import { WordTimestamp } from "../../types";

interface CanvasProps {
  transcript: WordTimestamp[];
}

export const SelfDoubtCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-8 select-none">
      {/* ======================================================== */}
      {/* SCENE 1: THE ROOT FRICTION & HOOK (Frames 0 - 158) */}
      {/* ======================================================== */}
      {frame >= 0 && frame < 158 && (
        <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
          <CinematicIllustrationCard
            imageSrc="self_doubt/assets/scene_illustration.png"
            title="Notice how you assume everyone else was handed a manual for life,"
            subtitle="while you're secretly faking it?"
            badgeLabel="COGNITIVE DIAGNOSTIC // 01"
            accentColor="blue"
            entranceFrame={0}
            subtitleFrame={109}
            beats={[
            {
                        "frame": 109,
                        "type": "callout",
                        "text": "YOURE REALITY",
                        "subtext": "while you're secretly faking it?",
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
      {/* (Frames 158 - 233)             */}
      {/* ======================================================== */}
      {frame >= 158 && frame < 233 && (
        <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-150">
          <ConceptKeywordSlam
            term="PLURALISTIC IGNORANCE"
            definition="And here's the trap: because everyone else masks their insecurity too, you compare your private chaos to their public performance"
            categoryBadge="PSYCHOLOGICAL MECHANISM // 01"
            entranceFrame={158}
            durationFrames={75}
            theme="apple_studio"
            icon="brain"
            width={920}
          />
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 2B: THE BREAKDOWN (REVEALED ONE-BY-ONE AS SPOKEN!)  */}
      {/* (Frames 233 - 534)                     */}
      {/* ======================================================== */}
      {frame >= 233 && frame < 534 && (() => {
        const spP1 = spring({ frame: frame - 233, fps, config: { damping: 13, stiffness: 140 } });
        const spP2 = spring({ frame: frame - 233, fps, config: { damping: 13, stiffness: 140 } });
        const spP3 = spring({ frame: frame - 440, fps, config: { damping: 13, stiffness: 140 } });
        const spP4 = spring({ frame: frame - 496, fps, config: { damping: 13, stiffness: 140 } });

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
                impactMs={7767}
                className="w-full p-8 rounded-3xl bg-white/95 border-2 border-sky-300/60 shadow-2xl backdrop-blur-md flex flex-col items-center text-center gap-6"
              >
                {/* Clean Uncrowded Section Header - NO RAW TOPIC LEAKS */}
                <div className="text-center mt-1">
                  <h2 className="text-5xl font-black text-slate-950 leading-tight uppercase tracking-tight">
                    THE SELF DOUBT TRAP
                  </h2>
                  <div className="text-2xl font-mono text-[#0071e3] font-bold mt-1 tracking-wider uppercase">
                    Pluralistic Ignorance Mechanism
                  </div>
                </div>

                {/* PROGRESSIVE SEQUENTIAL REVEALS: ONE BY ONE ON EXACT WORDS */}
                <div className="flex flex-col gap-4 w-full my-1">
                  
                {/* Progressive Item 1 (Spoken Frame: 232) */}
                <div
                  style={{
                    opacity: frame >= 232 ? Math.min(1, spP1 * 1.2) : 0,
                    transform: `scale(${frame >= 232 ? interpolate(spP1, [0, 1], [0.8, 1]) : 0.8}) translateY(${frame >= 232 ? interpolate(spP1, [0, 1], [25, 0]) : 25}px)`,
                    pointerEvents: frame >= 232 ? "auto" : "none",
                  }}
                >
                  <div className="p-4 rounded-2xl bg-slate-50/90 border border-sky-200/80 flex items-center justify-between text-left shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#0071e3]/15 text-[#0071e3] flex items-center justify-center text-3xl font-black font-mono shrink-0">
                        01
                      </div>
                      <div>
                        <div className="text-3xl font-black text-slate-950">
                          The Insecurity Mask
                        </div>
                        <div className="text-2xl font-mono text-sky-700 font-bold mt-0.5">Everyone hides their private doubts behind a calm face.</div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Progressive Item 2 (Spoken Frame: 353) */}
                <div
                  style={{
                    opacity: frame >= 353 ? Math.min(1, spP2 * 1.2) : 0,
                    transform: `scale(${frame >= 353 ? interpolate(spP2, [0, 1], [0.8, 1]) : 0.8}) translateY(${frame >= 353 ? interpolate(spP2, [0, 1], [25, 0]) : 25}px)`,
                    pointerEvents: frame >= 353 ? "auto" : "none",
                  }}
                >
                  <div className="p-4 rounded-2xl bg-slate-50/90 border border-sky-200/80 flex items-center justify-between text-left shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#0071e3]/15 text-[#0071e3] flex items-center justify-center text-3xl font-black font-mono shrink-0">
                        02
                      </div>
                      <div>
                        <div className="text-3xl font-black text-slate-950">
                          The False Comparison
                        </div>
                        <div className="text-2xl font-mono text-sky-700 font-bold mt-0.5">Judging your private chaos against their public performance.</div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Progressive Item 3 (Spoken Frame: 440) */}
                <div
                  style={{
                    opacity: frame >= 440 ? Math.min(1, spP3 * 1.2) : 0,
                    transform: `scale(${frame >= 440 ? interpolate(spP3, [0, 1], [0.8, 1]) : 0.8}) translateY(${frame >= 440 ? interpolate(spP3, [0, 1], [25, 0]) : 25}px)`,
                    pointerEvents: frame >= 440 ? "auto" : "none",
                  }}
                >
                  <div className="p-4 rounded-2xl bg-slate-50/90 border border-sky-200/80 flex items-center justify-between text-left shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#0071e3]/15 text-[#0071e3] flex items-center justify-center text-3xl font-black font-mono shrink-0">
                        03
                      </div>
                      <div>
                        <div className="text-3xl font-black text-slate-950">
                          The Reality Check
                        </div>
                        <div className="text-2xl font-mono text-sky-700 font-bold mt-0.5">Self-doubt isn't proof that you're behind.</div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Progressive Item 4 (Spoken Frame: 496) */}
                <div
                  style={{
                    opacity: frame >= 496 ? Math.min(1, spP4 * 1.2) : 0,
                    transform: `scale(${frame >= 496 ? interpolate(spP4, [0, 1], [0.8, 1]) : 0.8}) translateY(${frame >= 496 ? interpolate(spP4, [0, 1], [25, 0]) : 25}px)`,
                    pointerEvents: frame >= 496 ? "auto" : "none",
                  }}
                >
                  <div className="p-4 rounded-2xl bg-slate-50/90 border border-sky-200/80 flex items-center justify-between text-left shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#0071e3]/15 text-[#0071e3] flex items-center justify-center text-3xl font-black font-mono shrink-0">
                        04
                      </div>
                      <div>
                        <div className="text-3xl font-black text-slate-950">
                          The Rewire Shift
                        </div>
                        <div className="text-2xl font-mono text-emerald-600 font-bold mt-0.5">It's simply neurological proof that you care.</div>
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
      {/* SCENE 3: THE SPOKEN CTA FINALE (Frames 534+)             */}
      {/* ======================================================== */}
      {frame >= 534 && (() => {
        const spCard = spring({ frame: frame - 534, fps, config: { damping: 14, stiffness: 130 } });

        return (
          <div
            className="absolute top-[11%] w-full max-w-[920px] flex flex-col items-center z-20 pointer-events-none"
            style={{
              opacity: Math.min(1, spCard * 1.2),
              transform: `translateY(${interpolate(spCard, [0, 1], [-25, 0])}px) scale(${interpolate(spCard, [0, 1], [0.94, 1])})`,
            }}
          >
            <div className="relative w-full">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                <TapeStrip position="center-top" width={170} height={44} enableWobble />
              </div>

              <PhysicalCard
                tiltX={2}
                tiltY={-2}
                elevation={38}
                impactMs={17800}
                className="w-full p-7 rounded-3xl bg-white/95 border-2 border-sky-300/80 shadow-2xl backdrop-blur-md flex flex-col items-center text-center gap-3"
              >
                <div className="px-6 py-2 rounded-full bg-amber-100/90 border border-amber-300 text-amber-900 font-mono font-black text-2xl uppercase tracking-wider flex items-center gap-2.5">
                  <Sparkles className="w-6 h-6 text-amber-600" />
                  <span>BE HONEST</span>
                </div>

                <h3 className="text-4xl font-black text-slate-950 leading-snug tracking-tight px-4">
                  What's one thing you hold yourself back from trying?
                </h3>

                <div className="text-2xl font-mono text-sky-600 font-bold uppercase tracking-wider mt-1">
                  Tell me below 👇
                </div>
              </PhysicalCard>
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* ON-SCREEN INTERACTIVE ENGAGEMENT PILL (Frames 453–528)   */}
      {/* ======================================================== */}
      <InteractiveEngagementPill
        entranceFrame={453}
        durationFrames={75}
        prompt="Have you felt this? Drop your thoughts 👇"
        tag="COMMUNITY"
        icon="brain"
        theme="apple_studio"
      />
      
      {/* ======================================================== */}
      {/* TACTICAL RETENTION MEME POP (< 2.5s Strict Cap)          */}
      {/* ======================================================== */}
      <TacticalMemeCard
        memeId="lego_bruce_flabbergasted"
        startFrame={0}
        durationFrames={42}
        playbackRate={1.4}
        hudLabel="MIND BLOWN // SUDDEN EPIPHANY"
        theme="apple_studio"
        position="top"
      />

    </div>
  );
};
