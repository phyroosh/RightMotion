import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { PhysicalCard } from "../../components/physics/PhysicalCard";
import { TapeStrip } from "../../components/collage/TapeStrip";
import { ProCutout } from "../../components/ProCutout";
import { ProductPageShowcase } from "../../components/ProductPageShowcase";
import {
  Sparkles,
  Zap,
  Smartphone,
  Flame,
  ShieldAlert,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { WordTimestamp } from "../../types";

interface CanvasProps {
  transcript: WordTimestamp[];
}

export const DiagramYourLoopCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-8 select-none">
      
      {/* =================================================================== */}
      {/* SCENE 0: INTRO TOP FLOATING BRANDING PILL (Frames 0 - 116)          */}
      {/* Judy is presenting full screen asking the hook question!            */}
      {/* =================================================================== */}
      {frame >= 0 && frame < 116 && (() => {
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
      {/* SCENE 1: THE INVISIBLE COMPULSION (Frames 116 - 236)                */}
      {/* "That itch isn't about enjoying what you find..."                   */}
      {/* =================================================================== */}
      {frame >= 116 && frame < 236 && (() => {
        const spCard = spring({ frame: frame - 116, fps, config: { damping: 14, stiffness: 120, mass: 0.9 } });
        const spCutout = spring({ frame: frame - 128, fps, config: { damping: 13, stiffness: 140 } });
        const spStatus = spring({ frame: frame - 173, fps, config: { damping: 13, stiffness: 140 } });

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
                impactMs={3900}
                className="w-full p-8 rounded-3xl bg-white/95 border-2 border-sky-300/80 shadow-2xl backdrop-blur-md flex flex-col items-center text-center gap-6"
              >
                {/* Clean Bold Title */}
                <div className="text-center mt-2 max-w-[860px]">
                  <div className="text-3xl font-mono font-bold text-slate-500 uppercase tracking-wider">
                    THE COMPULSION LOOP
                  </div>
                  <h1 className="text-5xl font-black text-slate-950 leading-tight tracking-tight mt-1">
                    That Itch Isn't
                    <div className="block mt-1">
                      <span className="text-rose-500 font-black text-6xl">Enjoyment</span>
                    </div>
                  </h1>
                </div>

                {/* Hero Prop — Stamped on Frame 128 */}
                <div
                  className="w-full flex justify-center items-center my-3 transition-all"
                  style={{
                    opacity: frame >= 128 ? Math.min(1, spCutout * 1.2) : 0,
                    transform: `scale(${frame >= 128 ? interpolate(spCutout, [0, 1], [0.6, 1]) : 0.6}) translateY(${frame >= 128 ? interpolate(spCutout, [0, 1], [30, 0]) : 30}px)`,
                    pointerEvents: frame >= 128 ? "auto" : "none",
                  }}
                >
                  <ProCutout
                    assetId="phone_dopamine_overload"
                    glowColor="rose"
                    animation="stamp_impact"
                    width={440}
                    height={320}
                    ghostText="THE URGE"
                  />
                </div>

                {/* Status Bar — Revealed on Frame 173 */}
                <div
                  className="w-full transition-all"
                  style={{
                    opacity: frame >= 173 ? Math.min(1, spStatus * 1.2) : 0,
                    transform: `scale(${frame >= 173 ? interpolate(spStatus, [0, 1], [0.85, 1]) : 0.85})`,
                    pointerEvents: frame >= 173 ? "auto" : "none",
                  }}
                >
                  <div className="w-full p-4 rounded-2xl bg-slate-100/90 border border-sky-200 flex items-center justify-between text-2xl font-mono text-slate-800 shadow-sm">
                    <span className="flex items-center gap-3">
                      <Smartphone className="w-7 h-7 text-rose-500 shrink-0" />
                      <span className="font-bold">Opening an app with nothing new</span>
                    </span>
                    <span className="text-rose-500 font-black tracking-wide shrink-0">
                      AUTOPILOT
                    </span>
                  </div>
                </div>
              </PhysicalCard>
            </div>
          </div>
        );
      })()}

      {/* =================================================================== */}
      {/* SCENE 2: ANTICIPATION VS PLEASURE (Frames 236 - 365)                */}
      {/* "Dopamine isn't pleasure—it's anticipation. It's the signal..."     */}
      {/* =================================================================== */}
      {frame >= 236 && frame < 365 && (() => {
        const spCard = spring({ frame: frame - 236, fps, config: { damping: 14, stiffness: 120, mass: 0.9 } });
        const spCutout = spring({ frame: frame - 239, fps, config: { damping: 13, stiffness: 140 } });
        const spAnti = spring({ frame: frame - 244, fps, config: { damping: 13, stiffness: 140 } });
        const spWhisper = spring({ frame: frame - 293, fps, config: { damping: 13, stiffness: 140 } });

        return (
          <div
            className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200"
            style={{
              opacity: Math.min(1, spCard * 1.3),
              transform: `scale(${interpolate(spCard, [0, 1], [0.9, 1])}) translateY(${interpolate(spCard, [0, 1], [30, 0])}px)`,
            }}
          >
            <div className="relative w-full max-w-[940px]">
              <div className="absolute -top-7 left-8 z-30 pointer-events-none">
                <TapeStrip position="top-left" width={180} height={48} enableWobble />
              </div>

              <PhysicalCard
                tiltX={-3}
                tiltY={3}
                elevation={46}
                impactMs={7900}
                className="w-full p-8 rounded-3xl bg-white/95 border-2 border-sky-300/80 shadow-2xl backdrop-blur-md flex flex-col items-center text-center gap-5"
              >
                {/* Title */}
                <div className="text-center mt-1">
                  <div className="text-2xl font-mono text-slate-500 font-bold uppercase tracking-wider">
                    NEUROCHEMISTRY REFRAME
                  </div>
                  <h2 className="text-5xl font-black text-slate-950 leading-tight mt-1">
                    Dopamine Is Anticipation
                  </h2>
                </div>

                {/* Neural Prop — Revealed on Frame 239 */}
                <div
                  className="w-full flex justify-center items-center my-2 transition-all"
                  style={{
                    opacity: frame >= 239 ? Math.min(1, spCutout * 1.2) : 0,
                    transform: `scale(${frame >= 239 ? interpolate(spCutout, [0, 1], [0.6, 1]) : 0.6}) translateY(${frame >= 239 ? interpolate(spCutout, [0, 1], [25, 0]) : 25}px)`,
                    pointerEvents: frame >= 239 ? "auto" : "none",
                  }}
                >
                  <ProCutout
                    assetId="dopamine_head_circuit"
                    glowColor="amber"
                    animation="stamp_impact"
                    width={360}
                    height={260}
                    ghostText="DOPAMINE"
                  />
                </div>

                {/* Progressive Comparison Boxes */}
                <div className="flex flex-col gap-3 w-full">
                  {/* Pleasure vs Anticipation Box */}
                  <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 flex items-center justify-between text-left">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-200 text-slate-500 flex items-center justify-center shrink-0">
                        <XCircle className="w-7 h-7 text-rose-500" />
                      </div>
                      <div>
                        <div className="text-2xl font-mono text-slate-400 font-bold line-through">
                          NOT PLEASURE
                        </div>
                        <div className="text-2xl font-bold text-slate-600">
                          Enjoying what you find
                        </div>
                      </div>
                    </div>
                    <span className="text-2xl font-mono font-black text-rose-500 uppercase">
                      MYTH
                    </span>
                  </div>

                  {/* Anticipation Box — Revealed on Frame 244 */}
                  <div
                    style={{
                      opacity: frame >= 244 ? Math.min(1, spAnti * 1.2) : 0,
                      transform: `scale(${frame >= 244 ? interpolate(spAnti, [0, 1], [0.85, 1]) : 0.85}) translateY(${frame >= 244 ? interpolate(spAnti, [0, 1], [20, 0]) : 20}px)`,
                      pointerEvents: frame >= 244 ? "auto" : "none",
                    }}
                    className="p-4 rounded-2xl bg-[#0071e3]/10 border-2 border-[#0071e3]/40 flex items-center justify-between text-left shadow-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#0071e3] text-white flex items-center justify-center shrink-0">
                        <Sparkles className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <div className="text-3xl font-black text-[#0071e3]">
                          ANTICIPATION
                        </div>
                        <div className="text-2xl font-mono text-slate-700 font-bold">
                          The search for novelty
                        </div>
                      </div>
                    </div>
                    <span className="text-2xl font-mono font-black text-[#0071e3] uppercase">
                      TRUTH
                    </span>
                  </div>

                  {/* Neural Whisper Callout — Revealed on Frame 293 ("whispers, maybe something good is next") */}
                  <div
                    style={{
                      opacity: frame >= 293 ? Math.min(1, spWhisper * 1.2) : 0,
                      transform: `scale(${frame >= 293 ? interpolate(spWhisper, [0, 1], [0.9, 1]) : 0.9})`,
                      pointerEvents: frame >= 293 ? "auto" : "none",
                    }}
                    className="w-full p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center gap-3 text-2xl font-mono font-bold text-amber-900"
                  >
                    <Zap className="w-6 h-6 text-amber-600 shrink-0" />
                    <span>"Maybe something good is next..."</span>
                  </div>
                </div>
              </PhysicalCard>
            </div>
          </div>
        );
      })()}

      {/* =================================================================== */}
      {/* SCENE 3: THE 3-STEP HABIT LOOP (Frames 365 - 560)                   */}
      {/* "So the second boredom hits, your brain treats it as a cue..."      */}
      {/* PROGRESSIVE SEQUENTIAL REVEAL: ZERO MONOLITHIC BLOCKS!             */}
      {/* =================================================================== */}
      {frame >= 365 && frame < 560 && (() => {
        const spCard = spring({ frame: frame - 365, fps, config: { damping: 14, stiffness: 120, mass: 0.9 } });
        const spStep1 = spring({ frame: frame - 378, fps, config: { damping: 13, stiffness: 140 } });
        const spStep2 = spring({ frame: frame - 457, fps, config: { damping: 13, stiffness: 140 } });
        const spStep3 = spring({ frame: frame - 499, fps, config: { damping: 13, stiffness: 140 } });

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
                tiltX={-4}
                tiltY={4}
                elevation={44}
                impactMs={12200}
                className="w-full p-8 rounded-3xl bg-white/95 border-2 border-sky-300/80 shadow-2xl backdrop-blur-md flex flex-col items-center text-center gap-6"
              >
                {/* Title */}
                <div className="text-center mt-1">
                  <h2 className="text-5xl font-black text-slate-950 leading-tight">
                    The Autopilot Loop
                  </h2>
                  <div className="text-2xl font-mono text-[#0071e3] font-bold mt-1 tracking-wider uppercase">
                    3 Steps Wired Into The Brain
                  </div>
                </div>

                {/* Progressive Items */}
                <div className="flex flex-col gap-4 w-full my-1">
                  {/* Step 01: Spoken Frame 378 ("boredom hits... treats it as a cue") */}
                  <div
                    style={{
                      opacity: frame >= 378 ? Math.min(1, spStep1 * 1.2) : 0,
                      transform: `scale(${frame >= 378 ? interpolate(spStep1, [0, 1], [0.8, 1]) : 0.8}) translateY(${frame >= 378 ? interpolate(spStep1, [0, 1], [25, 0]) : 25}px)`,
                      pointerEvents: frame >= 378 ? "auto" : "none",
                    }}
                  >
                    <div className="p-4 rounded-2xl bg-amber-50/90 border-2 border-amber-300/80 flex items-center justify-between text-left shadow-md">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center text-3xl font-black font-mono shrink-0">
                          01
                        </div>
                        <div>
                          <div className="text-3xl font-black text-slate-950">
                            THE CUE: Boredom Hits
                          </div>
                          <div className="text-2xl font-mono text-amber-700 font-bold mt-0.5">
                            Brain flags micro-boredom as discomfort
                          </div>
                        </div>
                      </div>
                      <Clock className="w-8 h-8 text-amber-600 shrink-0" />
                    </div>
                  </div>

                  {/* Step 02: Spoken Frame 457 ("spikes the urge") */}
                  <div
                    style={{
                      opacity: frame >= 457 ? Math.min(1, spStep2 * 1.2) : 0,
                      transform: `scale(${frame >= 457 ? interpolate(spStep2, [0, 1], [0.8, 1]) : 0.8}) translateY(${frame >= 457 ? interpolate(spStep2, [0, 1], [25, 0]) : 25}px)`,
                      pointerEvents: frame >= 457 ? "auto" : "none",
                    }}
                  >
                    <div className="p-4 rounded-2xl bg-rose-50/90 border-2 border-rose-300/80 flex items-center justify-between text-left shadow-md">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-rose-500/20 text-rose-600 flex items-center justify-center text-3xl font-black font-mono shrink-0">
                          02
                        </div>
                        <div>
                          <div className="text-3xl font-black text-rose-950">
                            THE CRAVING: Urge Spikes
                          </div>
                          <div className="text-2xl font-mono text-rose-600 font-bold mt-0.5">
                            Anticipation kicks in before conscious thought
                          </div>
                        </div>
                      </div>
                      <Zap className="w-8 h-8 text-rose-500 shrink-0" />
                    </div>
                  </div>

                  {/* Step 03: Spoken Frame 499 ("has you scrolling before you've even thought") */}
                  <div
                    style={{
                      opacity: frame >= 499 ? Math.min(1, spStep3 * 1.2) : 0,
                      transform: `scale(${frame >= 499 ? interpolate(spStep3, [0, 1], [0.8, 1]) : 0.8}) translateY(${frame >= 499 ? interpolate(spStep3, [0, 1], [25, 0]) : 25}px)`,
                      pointerEvents: frame >= 499 ? "auto" : "none",
                    }}
                  >
                    <div className="p-4 rounded-2xl bg-[#0071e3]/10 border-2 border-[#0071e3]/40 flex items-center justify-between text-left shadow-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-[#0071e3] text-white flex items-center justify-center text-3xl font-black font-mono shrink-0">
                          03
                        </div>
                        <div>
                          <div className="text-3xl font-black text-[#0071e3]">
                            THE RESPONSE: Autopilot Scroll
                          </div>
                          <div className="text-2xl font-mono text-slate-700 font-bold mt-0.5">
                            Hand unlocks phone without conscious choice
                          </div>
                        </div>
                      </div>
                      <Smartphone className="w-8 h-8 text-[#0071e3] shrink-0" />
                    </div>
                  </div>
                </div>
              </PhysicalCard>
            </div>
          </div>
        );
      })()}

      {/* =================================================================== */}
      {/* SCENE 4: WILLPOWER FLAW & PRODUCT SHOWCASE (Frames 560 - 760)       */}
      {/* "Fighting that craving with willpower usually fails. I sketched..."  */}
      {/* =================================================================== */}
      {frame >= 560 && frame < 650 && (() => {
        const spCard = spring({ frame: frame - 560, fps, config: { damping: 14, stiffness: 120, mass: 0.9 } });
        const spCutout = spring({ frame: frame - 571, fps, config: { damping: 13, stiffness: 140 } });

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
                impactMs={18660}
                className="w-full p-8 rounded-3xl bg-white/95 border-2 border-sky-300/80 shadow-2xl backdrop-blur-md flex flex-col items-center text-center gap-6"
              >
                <h2 className="text-5xl font-black text-slate-950 leading-tight mt-2">
                  Willpower Fails At The Craving
                </h2>

                <div
                  className="w-full flex justify-center items-center my-2 transition-all"
                  style={{
                    opacity: frame >= 571 ? Math.min(1, spCutout * 1.2) : 0,
                    transform: `scale(${frame >= 571 ? interpolate(spCutout, [0, 1], [0.6, 1]) : 0.6}) translateY(${frame >= 571 ? interpolate(spCutout, [0, 1], [30, 0]) : 30}px)`,
                    pointerEvents: frame >= 571 ? "auto" : "none",
                  }}
                >
                  <ProCutout
                    assetId="brain_battery_depleted"
                    glowColor="rose"
                    animation="stamp_impact"
                    width={420}
                    height={300}
                    ghostText="DEPLETED"
                  />
                </div>

                <div className="w-full p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between text-2xl font-mono text-rose-800">
                  <span className="flex items-center gap-3">
                    <ShieldAlert className="w-7 h-7 text-rose-600" />
                    <span className="font-bold">Fighting craving requires high willpower</span>
                  </span>
                  <span className="text-rose-600 font-black tracking-wide">
                    DEPLETABLE
                  </span>
                </div>
              </PhysicalCard>
            </div>
          </div>
        );
      })()}

      {/* PRODUCT PAGE SHOWCASE: Frame 650 to 760 */}
      {/* "I sketched out the loop diagram on page 7 to help you interrupt..." */}
      {frame >= 650 && frame < 760 && (
        <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
          <ProductPageShowcase
            imageSrc="products/Photon/page_8_paragraph.png"
            pageNum={7}
            productName="PHOTON BLUEPRINT"
            accentColor="blue"
            entranceFrame={650}
            badgeLabel="DIAGRAM YOUR LOOP PROTOCOL"
            width={880}
            height={1080}
          />
        </div>
      )}

      {/* =================================================================== */}
      {/* SCENE 5: FINALE REFRAME TOP CARD (Frames 760 - 846)                 */}
      {/* "...but for today—just put the phone in another room."              */}
      {/* =================================================================== */}
      {frame >= 760 && frame < 846 && (() => {
        const spFinaleCard = spring({ frame: frame - 760, fps, config: { damping: 14, stiffness: 110, mass: 0.85 } });
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
                <span>INTERRUPT THE CUE</span>
              </div>
              <h2 className="text-4xl font-black text-slate-900 leading-snug">
                For Today:
                <div className="text-5xl font-black text-rose-500 mt-2">
                  PUT THE PHONE IN ANOTHER ROOM.
                </div>
              </h2>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
