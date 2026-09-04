import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { PhysicalCard } from "../../components/physics/PhysicalCard";
import { TapeStrip } from "../../components/collage/TapeStrip";
import { ProCutout } from "../../components/ProCutout";
import { ProductPageShowcase } from "../../components/ProductPageShowcase";
import {
  Sparkles,
  Users,
  Smartphone,
  Home,
  ShieldAlert,
  BatteryWarning,
  CheckCircle2,
} from "lucide-react";
import { WordTimestamp } from "../../types";

interface CanvasProps {
  transcript: WordTimestamp[];
}

export const MapTheGapCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-8 select-none">
      
      {/* =================================================================== */}
      {/* SCENE 0: INTRO TOP FLOATING BRANDING PILL (Frames 0 - 125)          */}
      {/* =================================================================== */}
      {frame >= 0 && frame < 125 && (() => {
        const spIntroBadge = spring({ frame, fps, config: { damping: 18, stiffness: 100, mass: 0.8 } });
        return (
          <div
            className="absolute top-[12%] z-30 flex flex-col items-center"
            style={{
              opacity: Math.min(1, spIntroBadge * 1.5),
              transform: `translateY(${(1 - spIntroBadge) * -20}px)`,
            }}
          >
            <div className="px-8 py-3.5 rounded-full bg-white/90 border-2 border-sky-300/80 backdrop-blur-xl shadow-xl flex items-center gap-3">
              <span className="w-3.5 h-3.5 rounded-full bg-[#0071e3] animate-pulse" />
              <span className="font-mono text-2xl font-black text-slate-800 tracking-wider uppercase">
                JUDY INSIGHTS • PSYCHOLOGY
              </span>
            </div>
          </div>
        );
      })()}

      {/* =================================================================== */}
      {/* SCENE 1: THE TRAP — MANAGING THE MASK (Frames 125 - 255)            */}
      {/* "You probably weren’t being kind—you were managing the mask..."   */}
      {/* =================================================================== */}
      {frame >= 125 && frame < 255 && (() => {
        const spCard = spring({ frame: frame - 125, fps, config: { damping: 14, stiffness: 120, mass: 0.9 } });
        const spCutout = spring({ frame: frame - 193, fps, config: { damping: 13, stiffness: 140 } });
        const spMetric = spring({ frame: frame - 235, fps, config: { damping: 13, stiffness: 140 } });

        return (
          <div
            className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200"
            style={{
              opacity: Math.min(1, spCard * 1.3),
              transform: `scale(${interpolate(spCard, [0, 1], [0.9, 1])}) translateY(${interpolate(spCard, [0, 1], [30, 0])}px)`,
            }}
          >
            <div className="relative w-full max-w-[940px]">
              <div className="absolute -top-7 right-8 z-30 pointer-events-none">
                <TapeStrip position="top-right" width={180} height={48} enableWobble />
              </div>

              <PhysicalCard
                tiltX={3}
                tiltY={-3}
                elevation={46}
                impactMs={4200}
                className="w-full p-8 rounded-3xl bg-white/95 border-2 border-sky-300/80 shadow-2xl backdrop-blur-md flex flex-col items-center text-center gap-6"
              >
                <div className="text-center mt-2 max-w-[860px]">
                  <div className="text-3xl font-mono font-bold text-slate-500 uppercase tracking-wider">
                    THE PEOPLE-PLEASING TRAP
                  </div>
                  <h1 className="text-5xl font-black text-slate-950 leading-tight tracking-tight mt-1">
                    You Weren't Being Kind.
                    <div className="block mt-1">
                      <span className="text-rose-500 font-black text-6xl">Managing The Mask</span>
                    </div>
                  </h1>
                </div>

                <div
                  className="w-full flex justify-center items-center my-2 transition-all"
                  style={{
                    opacity: frame >= 193 ? Math.min(1, spCutout * 1.2) : 0,
                    transform: `scale(${frame >= 193 ? interpolate(spCutout, [0, 1], [0.6, 1]) : 0.6}) translateY(${frame >= 193 ? interpolate(spCutout, [0, 1], [30, 0]) : 30}px)`,
                    pointerEvents: frame >= 193 ? "auto" : "none",
                  }}
                >
                  <ProCutout
                    assetId="brain_trapped_in_cage"
                    glowColor="rose"
                    animation="stamp_impact"
                    width={420}
                    height={320}
                    ghostText="THE MASK"
                  />
                </div>

                <div
                  className="w-full transition-all"
                  style={{
                    opacity: frame >= 235 ? Math.min(1, spMetric * 1.2) : 0,
                    transform: `scale(${frame >= 235 ? interpolate(spMetric, [0, 1], [0.85, 1]) : 0.85})`,
                    pointerEvents: frame >= 235 ? "auto" : "none",
                  }}
                >
                  <div className="w-full p-4 rounded-2xl bg-rose-50/90 border-2 border-rose-200 flex items-center justify-between text-2xl font-mono">
                    <span className="flex items-center gap-3 text-slate-800 font-bold">
                      <ShieldAlert className="w-7 h-7 text-rose-600 shrink-0" />
                      <span>SOCIAL COMPLIANCE PROTECTION</span>
                    </span>
                    <span className="text-rose-600 font-black tracking-wide">
                      HIGH RESENTMENT
                    </span>
                  </div>
                </div>
              </PhysicalCard>
            </div>
          </div>
        );
      })()}

      {/* =================================================================== */}
      {/* SCENE 2: THE WIDENING GAP & ENERGY DRAIN (Frames 255 - 425)         */}
      {/* "When the gap between what you feel and how you act gets too wide" */}
      {/* =================================================================== */}
      {frame >= 255 && frame < 425 && (() => {
        const spCard = spring({ frame: frame - 255, fps, config: { damping: 14, stiffness: 120, mass: 0.9 } });
        const spBoxes = spring({ frame: frame - 306, fps, config: { damping: 13, stiffness: 140 } });
        const spTension = spring({ frame: frame - 373, fps, config: { damping: 12, stiffness: 130 } });
        const spDrain = spring({ frame: frame - 403, fps, config: { damping: 13, stiffness: 140 } });

        const gapExpansion = frame >= 373 ? interpolate(spTension, [0, 1], [24, 76]) : 24;

        return (
          <div
            className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200"
            style={{
              opacity: Math.min(1, spCard * 1.3),
              transform: `scale(${interpolate(spCard, [0, 1], [0.9, 1])}) translateY(${interpolate(spCard, [0, 1], [30, 0])}px)`,
            }}
          >
            <div className="relative w-full max-w-[940px]">
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                <TapeStrip position="center-top" width={180} height={48} enableWobble />
              </div>

              <PhysicalCard
                tiltX={-3}
                tiltY={3}
                elevation={46}
                impactMs={8500}
                className="w-full p-8 rounded-3xl bg-white/95 border-2 border-sky-300/80 shadow-2xl backdrop-blur-md flex flex-col items-center text-center gap-6"
              >
                <div className="text-center mt-1">
                  <div className="text-2xl font-mono text-[#0071e3] font-bold tracking-widest uppercase">
                    NEUROLOGICAL FRICTION
                  </div>
                  <h2 className="text-5xl font-black text-slate-950 leading-tight mt-1">
                    The Widening Gap
                  </h2>
                </div>

                <div
                  className="w-full flex flex-col gap-3 my-1 transition-all"
                  style={{
                    opacity: frame >= 306 ? Math.min(1, spBoxes * 1.2) : 0,
                    transform: `scale(${frame >= 306 ? interpolate(spBoxes, [0, 1], [0.88, 1]) : 0.88})`,
                    pointerEvents: frame >= 306 ? "auto" : "none",
                  }}
                >
                  <div className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-slate-200 flex items-center justify-between text-left shadow-md">
                    <div>
                      <span className="text-xl font-mono font-bold text-rose-500 uppercase tracking-wider block">
                        WHAT YOU ACTUALLY FEEL (INSIDE)
                      </span>
                      <span className="text-3xl font-black text-slate-900 mt-1 block">
                        "I'm overwhelmed and cannot do this."
                      </span>
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-rose-100 text-rose-700 font-mono text-2xl font-black">
                      TRUE STATE
                    </div>
                  </div>

                  <div
                    className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500/15 via-rose-500/20 to-amber-500/15 border border-rose-300 flex items-center justify-between font-mono font-black text-2xl text-rose-600 transition-all"
                    style={{
                      height: `${gapExpansion + 40}px`,
                    }}
                  >
                    <span>▲ THE HIDDEN DISCONNECT</span>
                    <span className="text-3xl font-black">
                      {frame >= 373 ? "GAP IS TOO WIDE ⚠️" : "EXPANDING GAP"}
                    </span>
                    <span>▼ EXHAUSTING DISSONANCE</span>
                  </div>

                  <div className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-slate-200 flex items-center justify-between text-left shadow-md">
                    <div>
                      <span className="text-xl font-mono font-bold text-sky-600 uppercase tracking-wider block">
                        HOW YOU ACT (OUTSIDE COMPLIANCE)
                      </span>
                      <span className="text-3xl font-black text-slate-900 mt-1 block">
                        "Sure, yeah, happy to help anytime!"
                      </span>
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-sky-100 text-[#0071e3] font-mono text-2xl font-black">
                      THE MASK
                    </div>
                  </div>
                </div>

                <div
                  className="w-full transition-all"
                  style={{
                    opacity: frame >= 403 ? Math.min(1, spDrain * 1.2) : 0,
                    transform: `scale(${frame >= 403 ? interpolate(spDrain, [0, 1], [0.85, 1]) : 0.85})`,
                    pointerEvents: frame >= 403 ? "auto" : "none",
                  }}
                >
                  <div className="w-full p-4 rounded-2xl bg-rose-600 text-white flex items-center justify-between text-2xl font-mono font-black shadow-xl">
                    <span className="flex items-center gap-3">
                      <BatteryWarning className="w-7 h-7 text-white shrink-0 animate-bounce" />
                      <span>IT DRAINS YOU COMPLETELY</span>
                    </span>
                    <span className="bg-white text-rose-600 px-3 py-1 rounded-xl font-mono text-xl uppercase">
                      ENERGY COLLAPSE
                    </span>
                  </div>
                </div>
              </PhysicalCard>
            </div>
          </div>
        );
      })()}

      {/* =================================================================== */}
      {/* SCENE 3: NOTICE IN 3 CONTEXTS & THE 3 WRITES (Frames 425 - 645)    */}
      {/* "Try noticing it in three places: family, friends, and online..."   */}
      {/* =================================================================== */}
      {frame >= 425 && frame < 645 && (() => {
        const spCard = spring({ frame: frame - 425, fps, config: { damping: 14, stiffness: 120, mass: 0.9 } });
        const spP1 = spring({ frame: frame - 480, fps, config: { damping: 13, stiffness: 140 } });
        const spP2 = spring({ frame: frame - 496, fps, config: { damping: 13, stiffness: 140 } });
        const spP3 = spring({ frame: frame - 517, fps, config: { damping: 13, stiffness: 140 } });

        const isPromptsPhase = frame >= 544;
        const spW1 = spring({ frame: frame - 550, fps, config: { damping: 13, stiffness: 140 } });
        const spW2 = spring({ frame: frame - 573, fps, config: { damping: 13, stiffness: 140 } });
        const spW3 = spring({ frame: frame - 607, fps, config: { damping: 13, stiffness: 140 } });

        return (
          <div
            className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200"
            style={{
              opacity: Math.min(1, spCard * 1.3),
              transform: `scale(${interpolate(spCard, [0, 1], [0.9, 1])}) translateY(${interpolate(spCard, [0, 1], [30, 0])}px)`,
            }}
          >
            <div className="relative w-full max-w-[940px]">
              <div className="absolute -top-7 right-10 z-30 pointer-events-none">
                <TapeStrip position="top-right" width={180} height={48} enableWobble />
              </div>

              <PhysicalCard
                tiltX={3}
                tiltY={-3}
                elevation={46}
                impactMs={14200}
                className="w-full p-8 rounded-3xl bg-white/95 border-2 border-sky-300/80 shadow-2xl backdrop-blur-md flex flex-col items-center text-center gap-6"
              >
                <div className="text-center mt-1">
                  <div className="text-2xl font-mono text-[#0071e3] font-bold tracking-widest uppercase">
                    AUDIT YOUR CONTEXTS
                  </div>
                  <h2 className="text-5xl font-black text-slate-950 leading-tight mt-1">
                    {!isPromptsPhase ? "Notice The 3 Places" : "Write Down The Truth"}
                  </h2>
                </div>

                {!isPromptsPhase ? (
                  <div className="flex flex-col gap-4 w-full my-1">
                    <div
                      style={{
                        opacity: frame >= 480 ? Math.min(1, spP1 * 1.2) : 0,
                        transform: `scale(${frame >= 480 ? interpolate(spP1, [0, 1], [0.8, 1]) : 0.8}) translateY(${frame >= 480 ? interpolate(spP1, [0, 1], [20, 0]) : 20}px)`,
                        pointerEvents: frame >= 480 ? "auto" : "none",
                      }}
                      className="p-5 rounded-2xl bg-slate-50 border-2 border-sky-200 flex items-center justify-between shadow-md text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-600 flex items-center justify-center font-mono text-3xl font-black shrink-0">
                          <Home className="w-8 h-8" />
                        </div>
                        <div>
                          <div className="text-3xl font-black text-slate-950">1. Family</div>
                          <div className="text-2xl font-mono text-slate-500 font-bold">
                            Expectations, inherited guilt & duty
                          </div>
                        </div>
                      </div>
                      <span className="px-4 py-2 rounded-xl bg-amber-100 text-amber-800 font-mono text-xl font-bold">
                        CONTEXT 01
                      </span>
                    </div>

                    <div
                      style={{
                        opacity: frame >= 496 ? Math.min(1, spP2 * 1.2) : 0,
                        transform: `scale(${frame >= 496 ? interpolate(spP2, [0, 1], [0.8, 1]) : 0.8}) translateY(${frame >= 496 ? interpolate(spP2, [0, 1], [20, 0]) : 20}px)`,
                        pointerEvents: frame >= 496 ? "auto" : "none",
                      }}
                      className="p-5 rounded-2xl bg-slate-50 border-2 border-sky-200 flex items-center justify-between shadow-md text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-sky-500/20 text-[#0071e3] flex items-center justify-center font-mono text-3xl font-black shrink-0">
                          <Users className="w-8 h-8" />
                        </div>
                        <div>
                          <div className="text-3xl font-black text-slate-950">2. Friends</div>
                          <div className="text-2xl font-mono text-slate-500 font-bold">
                            Fear of social exclusion & conflict
                          </div>
                        </div>
                      </div>
                      <span className="px-4 py-2 rounded-xl bg-sky-100 text-sky-800 font-mono text-xl font-bold">
                        CONTEXT 02
                      </span>
                    </div>

                    <div
                      style={{
                        opacity: frame >= 517 ? Math.min(1, spP3 * 1.2) : 0,
                        transform: `scale(${frame >= 517 ? interpolate(spP3, [0, 1], [0.8, 1]) : 0.8}) translateY(${frame >= 517 ? interpolate(spP3, [0, 1], [20, 0]) : 20}px)`,
                        pointerEvents: frame >= 517 ? "auto" : "none",
                      }}
                      className="p-5 rounded-2xl bg-slate-50 border-2 border-sky-200 flex items-center justify-between shadow-md text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-600 flex items-center justify-center font-mono text-3xl font-black shrink-0">
                          <Smartphone className="w-8 h-8" />
                        </div>
                        <div>
                          <div className="text-3xl font-black text-slate-950">3. Online</div>
                          <div className="text-2xl font-mono text-slate-500 font-bold">
                            Curated feeds & performance pressure
                          </div>
                        </div>
                      </div>
                      <span className="px-4 py-2 rounded-xl bg-purple-100 text-purple-800 font-mono text-xl font-bold">
                        CONTEXT 03
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 w-full my-1">
                    <div
                      style={{
                        opacity: frame >= 550 ? Math.min(1, spW1 * 1.2) : 0,
                        transform: `scale(${frame >= 550 ? interpolate(spW1, [0, 1], [0.8, 1]) : 0.8}) translateY(${frame >= 550 ? interpolate(spW1, [0, 1], [20, 0]) : 20}px)`,
                        pointerEvents: frame >= 550 ? "auto" : "none",
                      }}
                      className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-200 flex items-center justify-between shadow-md text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#0071e3]/20 text-[#0071e3] flex items-center justify-center font-mono text-2xl font-black shrink-0">
                          A
                        </div>
                        <div>
                          <div className="text-3xl font-black text-slate-950">Write What You Say</div>
                          <div className="text-2xl font-mono text-slate-500 font-bold">
                            The polite exterior: "Sure, no problem!"
                          </div>
                        </div>
                      </div>
                      <CheckCircle2 className="w-7 h-7 text-[#0071e3] shrink-0" />
                    </div>

                    <div
                      style={{
                        opacity: frame >= 573 ? Math.min(1, spW2 * 1.2) : 0,
                        transform: `scale(${frame >= 573 ? interpolate(spW2, [0, 1], [0.8, 1]) : 0.8}) translateY(${frame >= 573 ? interpolate(spW2, [0, 1], [20, 0]) : 20}px)`,
                        pointerEvents: frame >= 573 ? "auto" : "none",
                      }}
                      className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-200 flex items-center justify-between shadow-md text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-600 flex items-center justify-center font-mono text-2xl font-black shrink-0">
                          B
                        </div>
                        <div>
                          <div className="text-3xl font-black text-rose-950">Write What You Hide</div>
                          <div className="text-2xl font-mono text-rose-600 font-bold">
                            The real feeling: "I'm resentful and exhausted."
                          </div>
                        </div>
                      </div>
                      <CheckCircle2 className="w-7 h-7 text-rose-500 shrink-0" />
                    </div>

                    <div
                      style={{
                        opacity: frame >= 607 ? Math.min(1, spW3 * 1.2) : 0,
                        transform: `scale(${frame >= 607 ? interpolate(spW3, [0, 1], [0.8, 1]) : 0.8}) translateY(${frame >= 607 ? interpolate(spW3, [0, 1], [20, 0]) : 20}px)`,
                        pointerEvents: frame >= 607 ? "auto" : "none",
                      }}
                      className="p-5 rounded-2xl bg-gradient-to-r from-purple-50 to-sky-50 border-2 border-purple-300 flex items-center justify-between shadow-lg text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center font-mono text-2xl font-black shrink-0">
                          C
                        </div>
                        <div>
                          <div className="text-3xl font-black text-purple-950">Where Gap Feels Biggest</div>
                          <div className="text-2xl font-mono text-purple-700 font-bold">
                            Target the exact relationship leaking your energy
                          </div>
                        </div>
                      </div>
                      <Sparkles className="w-7 h-7 text-purple-600 shrink-0" />
                    </div>
                  </div>
                )}
              </PhysicalCard>
            </div>
          </div>
        );
      })()}

      {/* =================================================================== */}
      {/* SCENE 4: PRODUCT SHOWCASE — PAGE 6 MAP THE GAP (Frames 645 - 738)   */}
      {/* "That’s the MAP THE GAP exercise on page 6."                       */}
      {/* =================================================================== */}
      {frame >= 645 && frame < 738 && (
        <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
          <ProductPageShowcase
            imageSrc="products/Photon/page_6_paragraph.png"
            pageNum={6}
            productName="PHOTON BLUEPRINT"
            accentColor="blue"
            entranceFrame={645}
            badgeLabel="MAP THE GAP PROTOCOL"
            width={880}
            height={1080}
          />
        </div>
      )}

      {/* =================================================================== */}
      {/* SCENE 5: FINALE REFRAME TOP CARD (Frames 740 - 861)                 */}
      {/* "Saying no gets easier when you stop treating someone else’s        */}
      {/* disappointment like your responsibility."                           */}
      {/* =================================================================== */}
      {frame >= 740 && frame < 861 && (() => {
        const spFinaleCard = spring({ frame: frame - 740, fps, config: { damping: 14, stiffness: 110, mass: 0.85 } });
        return (
          <div
            className="absolute top-[12%] z-40 w-full max-w-[940px] px-8 flex flex-col items-center select-none"
            style={{
              opacity: Math.min(1, spFinaleCard * 1.4),
              transform: `translateY(${(1 - spFinaleCard) * -30}px) scale(${interpolate(spFinaleCard, [0, 1], [0.92, 1])})`,
            }}
          >
            <div className="w-full p-8 rounded-3xl bg-white/95 border-2 border-sky-300/90 shadow-2xl backdrop-blur-2xl flex flex-col items-center text-center gap-4">
              <div className="px-6 py-2 rounded-full bg-[#0071e3]/15 text-[#0071e3] border border-[#0071e3]/30 font-mono text-2xl font-black uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-[#0071e3]" />
                <span>THE CORE REFRAME</span>
              </div>
              <h2 className="text-4xl font-black text-slate-900 leading-snug">
                Someone else's disappointment is
                <div className="text-5xl font-black text-rose-500 mt-2">
                  NOT YOUR RESPONSIBILITY.
                </div>
              </h2>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
