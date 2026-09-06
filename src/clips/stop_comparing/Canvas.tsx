import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { PhysicalCard } from "../../components/physics/PhysicalCard";
import { TapeStrip } from "../../components/collage/TapeStrip";
import { CinematicIllustrationCard } from "../../components/CinematicIllustrationCard";
import { InteractiveEngagementPill } from "../../components/InteractiveEngagementPill";
import { TacticalMemeCard } from "../../components/TacticalMemeCard";
import { ConceptKeywordSlam } from "../../components/ConceptKeywordSlam";
import { Sparkles } from "lucide-react";
import { WordTimestamp } from "../../types";

interface CanvasProps {
  transcript: WordTimestamp[];
}

export const StopComparingCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-8 select-none">
      {/* ======================================================== */}
      {/* SCENE 1: THE ROOT FRICTION & HOOK (Frames 0 - 137)       */}
      {/* ======================================================== */}
      {frame >= 0 && frame < 137 && (
        <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
          <CinematicIllustrationCard
            imageSrc="stop_comparing/assets/scene_illustration.png"
            title="Notice how achieving your goals only makes you compare yourself to people even further ahead?"
            subtitle="Psychologists call this Upward Social Comparison."
            badgeLabel="COGNITIVE DIAGNOSTIC // 01"
            accentColor="blue"
            entranceFrame={0}
            subtitleFrame={92}
            beats={[
              {
                frame: 92,
                type: "callout",
                text: "STATUS GAP",
                subtext: "Psychologists call this Upward Social Comparison.",
                position: "top-right",
                icon: "target",
                color: "blue",
                zoomLevel: 1.15,
                targetX: 50,
                targetY: 40,
              },
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
      {/* (Frames 137 - 219)                                       */}
      {/* ======================================================== */}
      {frame >= 137 && frame < 219 && (
        <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-150">
          <ConceptKeywordSlam
            term="UPWARD SOCIAL COMPARISON"
            definition="Your brain isn't measuring your worth, it's measuring distance—treating someone else's highlight reel as your deficit"
            categoryBadge="PSYCHOLOGICAL MECHANISM // 01"
            entranceFrame={137}
            durationFrames={82}
            theme="apple_studio"
            icon="brain"
            width={920}
          />
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 2B: THE BREAKDOWN (REVEALED ONE-BY-ONE AS SPOKEN!)  */}
      {/* (Frames 294 - 428)                     */}
      {/* ======================================================== */}
      {/* ======================================================== */}
      {/* SCENE 2B: THE BREAKDOWN (REVEALED ONE-BY-ONE AS SPOKEN!)  */}
      {/* (Frames 219 - 552)                                       */}
      {/* ======================================================== */}
      {frame >= 219 && frame < 552 && (() => {
        const spP1 = spring({ frame: frame - 219, fps, config: { damping: 13, stiffness: 140 } });
        const spP2 = spring({ frame: frame - 342, fps, config: { damping: 13, stiffness: 140 } });
        const spP3 = spring({ frame: frame - 428, fps, config: { damping: 13, stiffness: 140 } });

        return (
          <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
            <div className="relative w-full max-w-[920px]">
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                <TapeStrip position="center-top" width={180} height={48} enableWobble />
              </div>

              <PhysicalCard
                tiltX={-4}
                tiltY={3}
                elevation={44}
                impactMs={7300}
                className="w-full p-8 rounded-3xl bg-white/95 border-2 border-sky-300/60 shadow-2xl backdrop-blur-md flex flex-col items-center text-center gap-5"
              >
                {/* Section Header */}
                <div className="text-center mt-1">
                  <h2 className="text-5xl font-black text-slate-950 leading-tight uppercase tracking-tight">
                    THE COMPARISON TRAP
                  </h2>
                  <div className="text-2xl font-mono text-[#0071e3] font-bold mt-1 tracking-wider uppercase">
                    How to Break Upward Comparison
                  </div>
                </div>

                {/* PROGRESSIVE SEQUENTIAL REVEALS: ONE BY ONE ON EXACT WORDS */}
                <div className="flex flex-col gap-4 w-full my-1">
                  {/* Progressive Item 1 (Spoken Frame: 219) */}
                  <div
                    style={{
                      opacity: frame >= 219 ? Math.min(1, spP1 * 1.2) : 0,
                      transform: `scale(${frame >= 219 ? interpolate(spP1, [0, 1], [0.8, 1]) : 0.8}) translateY(${frame >= 219 ? interpolate(spP1, [0, 1], [25, 0]) : 25}px)`,
                      pointerEvents: frame >= 219 ? "auto" : "none",
                    }}
                  >
                    <div className="p-4 rounded-2xl bg-slate-50/90 border border-sky-200/80 flex items-center justify-between text-left shadow-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#0071e3]/15 text-[#0071e3] flex items-center justify-center text-3xl font-black font-mono shrink-0">
                          01
                        </div>
                        <div>
                          <div className="text-3xl font-black text-slate-950">
                            The False Metric
                          </div>
                          <div className="text-2xl font-mono text-sky-700 font-bold mt-0.5">
                            Your brain isn't measuring worth—it's measuring distance.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progressive Item 2 (Spoken Frame: 342) */}
                  <div
                    style={{
                      opacity: frame >= 342 ? Math.min(1, spP2 * 1.2) : 0,
                      transform: `scale(${frame >= 342 ? interpolate(spP2, [0, 1], [0.8, 1]) : 0.8}) translateY(${frame >= 342 ? interpolate(spP2, [0, 1], [25, 0]) : 25}px)`,
                      pointerEvents: frame >= 342 ? "auto" : "none",
                    }}
                  >
                    <div className="p-4 rounded-2xl bg-slate-50/90 border border-sky-200/80 flex items-center justify-between text-left shadow-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#0071e3]/15 text-[#0071e3] flex items-center justify-center text-3xl font-black font-mono shrink-0">
                          02
                        </div>
                        <div>
                          <div className="text-3xl font-black text-slate-950">
                            The Highlight Asymmetry
                          </div>
                          <div className="text-2xl font-mono text-sky-700 font-bold mt-0.5">
                            Treating someone else's highlight reel as your personal deficit.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progressive Item 3 (Spoken Frame: 428) */}
                  <div
                    style={{
                      opacity: frame >= 428 ? Math.min(1, spP3 * 1.2) : 0,
                      transform: `scale(${frame >= 428 ? interpolate(spP3, [0, 1], [0.8, 1]) : 0.8}) translateY(${frame >= 428 ? interpolate(spP3, [0, 1], [25, 0]) : 25}px)`,
                      pointerEvents: frame >= 428 ? "auto" : "none",
                    }}
                  >
                    <div className="p-4 rounded-2xl bg-slate-50/90 border border-sky-200/80 flex items-center justify-between text-left shadow-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center text-3xl font-black font-mono shrink-0">
                          03
                        </div>
                        <div>
                          <div className="text-3xl font-black text-slate-950">
                            The Rewire Shift
                          </div>
                          <div className="text-2xl font-mono text-emerald-600 font-bold mt-0.5">
                            Measure progress backward from who you were yesterday.
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
      {/* SCENE 3: THE SPOKEN CTA FINALE (Frames 552+)             */}
      {/* ======================================================== */}
      {frame >= 552 && (() => {
        const spCard = spring({ frame: frame - 552, fps, config: { damping: 14, stiffness: 130 } });

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
                impactMs={18400}
                className="w-full p-7 rounded-3xl bg-white/95 border-2 border-sky-300/80 shadow-2xl backdrop-blur-md flex flex-col items-center text-center gap-3"
              >
                <div className="px-6 py-2 rounded-full bg-amber-100/90 border border-amber-300 text-amber-900 font-mono font-black text-2xl uppercase tracking-wider flex items-center gap-2.5">
                  <Sparkles className="w-6 h-6 text-amber-600" />
                  <span>BE HONEST</span>
                </div>

                <h3 className="text-4xl font-black text-slate-950 leading-snug tracking-tight px-4">
                  Who do you secretly compare yourself to most?
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
      {/* ON-SCREEN INTERACTIVE ENGAGEMENT PILL (Frames 470–545)   */}
      {/* ======================================================== */}
      <InteractiveEngagementPill
        entranceFrame={470}
        durationFrames={75}
        prompt="Secretly comparing yourself? Be honest 👇"
        tag="COMPARISON"
        icon="brain"
        theme="apple_studio"
      />
      
      {/* ======================================================== */}
      {/* TACTICAL RETENTION MEME POP (< 2.5s Strict Cap)          */}
      {/* ======================================================== */}
      <TacticalMemeCard
        memeId="bateman_iphone_inspection"
        startFrame={0}
        durationFrames={44}
        playbackRate={1.4}
        hudLabel="STATUS ANXIETY // PHONE OBSESSION"
        theme="apple_studio"
        position="top"
      />

    </div>
  );
};
