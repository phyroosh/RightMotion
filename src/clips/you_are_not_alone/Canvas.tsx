import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { PhysicalCard } from "../../components/physics/PhysicalCard";
import { TapeStrip } from "../../components/collage/TapeStrip";
import { ProCutout } from "../../components/ProCutout";
import {
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  HeartHandshake,
} from "lucide-react";
import { WordTimestamp } from "../../types";

interface CanvasProps {
  transcript: WordTimestamp[];
}

export const YouAreNotAloneCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slow buttery spring helper for rock-solid stationary lock
  const sp = (targetFrame: number, d = 20, s = 95, m = 0.85) => {
    return spring({
      frame: Math.max(0, frame - targetFrame),
      fps,
      config: { damping: d, stiffness: s, mass: m },
    });
  };

  return (
    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-8 select-none">
      
      {/* ======================================================== */}
      {/* SCENE 1: HOW YOU CARRY IT (Frames 105 - 306)             */}
      {/* "...believing that God is still with you can make things  */}
      {/* feel a little lighter? It doesn't magically solve the    */}
      {/* problem. But it can change how you carry it."            */}
      {/* ======================================================== */}
      {frame >= 105 && frame < 306 && (() => {
        const sCutout = sp(112);
        const sReality = sp(205);
        const sShift = sp(251);

        return (
          <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
            <div className="relative w-full max-w-[940px]">
              <div className="absolute -top-7 right-8 z-30 pointer-events-none">
                <TapeStrip position="top-right" width={180} height={48} enableWobble />
              </div>

              <PhysicalCard
                tiltX={3}
                tiltY={-3}
                elevation={45}
                impactMs={3500}
                className="w-full p-9 rounded-[40px] bg-white/95 border-2 border-sky-300/70 shadow-2xl backdrop-blur-md flex flex-col items-center text-center gap-6"
              >
                {/* Hero Title & Subtitle */}
                <div className="text-center mt-1">
                  <h2 className="text-5xl font-black text-slate-950 leading-tight">
                    HOW YOU CARRY IT
                  </h2>
                  <div className="text-2xl font-mono text-[#0071e3] font-bold mt-1 tracking-wider uppercase">
                    Perspective vs The Problem
                  </div>
                </div>

                {/* Tactile Hero Cutout Prop */}
                <div
                  className="w-full flex justify-center items-center my-1"
                  style={{
                    opacity: frame >= 112 ? Math.min(1, sCutout * 1.2) : 0,
                    transform: `scale(${frame >= 112 ? interpolate(sCutout, [0, 1], [0.8, 1]) : 0.8}) translateY(${frame >= 112 ? interpolate(sCutout, [0, 1], [25, 0]) : 25}px)`,
                  }}
                >
                  <ProCutout
                    assetId="mindful_heart_gratitude"
                    glowColor="amber"
                    animation="stamp_impact"
                    width={400}
                    height={300}
                    ghostText="LIGHTER"
                  />
                </div>

                {/* Progressive Speech-Synchronized Pillars */}
                <div className="grid grid-cols-2 gap-5 w-full mt-1">
                  {/* Reality: Problem remains */}
                  <div
                    className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-200 flex flex-col gap-2 text-left shadow-sm"
                    style={{
                      opacity: frame >= 205 ? Math.min(1, sReality * 1.2) : 0,
                      transform: `scale(${frame >= 205 ? interpolate(sReality, [0, 1], [0.85, 1]) : 0.85})`,
                    }}
                  >
                    <div className="flex items-center gap-2 text-xl font-mono font-black text-rose-600 uppercase">
                      <XCircle className="w-6 h-6 text-rose-500 shrink-0" />
                      THE REALITY
                    </div>
                    <div className="text-2xl font-black text-slate-950 leading-snug">
                      Problems don’t vanish
                    </div>
                    <div className="text-xl font-mono font-bold text-slate-600">
                      Circumstances stay the same
                    </div>
                  </div>

                  {/* Shift: How you carry it */}
                  <div
                    className="p-5 rounded-2xl bg-sky-50/90 border-2 border-sky-300 flex flex-col gap-2 text-left shadow-md"
                    style={{
                      opacity: frame >= 251 ? Math.min(1, sShift * 1.2) : 0,
                      transform: `scale(${frame >= 251 ? interpolate(sShift, [0, 1], [0.85, 1]) : 0.85})`,
                    }}
                  >
                    <div className="flex items-center gap-2 text-xl font-mono font-black text-[#0071e3] uppercase">
                      <Sparkles className="w-6 h-6 text-[#0071e3] shrink-0" />
                      THE SHIFT
                    </div>
                    <div className="text-2xl font-black text-slate-950 leading-snug">
                      The weight feels lighter
                    </div>
                    <div className="text-xl font-mono font-bold text-sky-800">
                      You are no longer crushed
                    </div>
                  </div>
                </div>
              </PhysicalCard>
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* SCENE 2: THE 3 GIFTS OF FAITH (Frames 306 - 450)         */}
      {/* "Faith can give you a sense of meaning, hope, and       */}
      {/* support when you don’t have clear answers."              */}
      {/* ======================================================== */}
      {frame >= 306 && frame < 450 && (() => {
        const sP1 = sp(310);
        const sP2 = sp(365);
        const sP3 = sp(379);
        const sStatus = sp(391);

        return (
          <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
            <div className="relative w-full max-w-[940px]">
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                <TapeStrip position="center-top" width={180} height={48} enableWobble />
              </div>

              <PhysicalCard
                tiltX={-4}
                tiltY={3}
                elevation={44}
                impactMs={10200}
                className="w-full p-9 rounded-[40px] bg-white/95 border-2 border-sky-300/70 shadow-2xl backdrop-blur-md flex flex-col items-center text-center gap-6"
              >
                {/* Header */}
                <div className="text-center mt-1">
                  <h2 className="text-5xl font-black text-slate-950 leading-tight">
                    THE THREE GIFTS
                  </h2>
                  <div className="text-2xl font-mono text-[#0071e3] font-bold mt-1 tracking-wider uppercase">
                    What Faith Actually Restores
                  </div>
                </div>

                {/* Progressive Sequential Reveals (100% Speech-Synchronized) */}
                <div className="flex flex-col gap-4 w-full my-1">
                  {/* Gift 1: Meaning (Spoken Frame 310) */}
                  <div
                    style={{
                      opacity: frame >= 310 ? Math.min(1, sP1 * 1.2) : 0,
                      transform: `scale(${frame >= 310 ? interpolate(sP1, [0, 1], [0.85, 1]) : 0.85}) translateY(${frame >= 310 ? interpolate(sP1, [0, 1], [20, 0]) : 20}px)`,
                    }}
                  >
                    <div className="p-4 rounded-2xl bg-slate-50/90 border border-sky-200/80 flex items-center justify-between text-left shadow-md">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-[#0071e3]/15 text-[#0071e3] flex items-center justify-center text-3xl font-black font-mono shrink-0">
                          01
                        </div>
                        <div>
                          <div className="text-3xl font-black text-slate-950">MEANING</div>
                          <div className="text-2xl font-mono text-sky-700 font-bold mt-0.5">
                            A reason to keep standing through the trial
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gift 2: Hope (Spoken Frame 365) */}
                  <div
                    style={{
                      opacity: frame >= 365 ? Math.min(1, sP2 * 1.2) : 0,
                      transform: `scale(${frame >= 365 ? interpolate(sP2, [0, 1], [0.85, 1]) : 0.85}) translateY(${frame >= 365 ? interpolate(sP2, [0, 1], [20, 0]) : 20}px)`,
                    }}
                  >
                    <div className="p-4 rounded-2xl bg-slate-50/90 border border-sky-200/80 flex items-center justify-between text-left shadow-md">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center text-3xl font-black font-mono shrink-0">
                          02
                        </div>
                        <div>
                          <div className="text-3xl font-black text-slate-950">HOPE</div>
                          <div className="text-2xl font-mono text-amber-800 font-bold mt-0.5">
                            Light and assurance beyond current fog
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gift 3: Support (Spoken Frame 379) */}
                  <div
                    style={{
                      opacity: frame >= 379 ? Math.min(1, sP3 * 1.2) : 0,
                      transform: `scale(${frame >= 379 ? interpolate(sP3, [0, 1], [0.85, 1]) : 0.85}) translateY(${frame >= 379 ? interpolate(sP3, [0, 1], [20, 0]) : 20}px)`,
                    }}
                  >
                    <div className="p-4 rounded-2xl bg-slate-50/90 border border-sky-200/80 flex items-center justify-between text-left shadow-md">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center text-3xl font-black font-mono shrink-0">
                          03
                        </div>
                        <div>
                          <div className="text-3xl font-black text-slate-950">SUPPORT</div>
                          <div className="text-2xl font-mono text-emerald-800 font-bold mt-0.5">
                            You are backed by a higher presence
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Status Box: No Clear Answers Needed */}
                <div
                  className="w-full"
                  style={{
                    opacity: frame >= 391 ? Math.min(1, sStatus * 1.2) : 0,
                    transform: `scale(${frame >= 391 ? interpolate(sStatus, [0, 1], [0.9, 1]) : 0.9})`,
                  }}
                >
                  <div className="w-full p-4 rounded-2xl bg-slate-100 border border-sky-200/80 flex items-center justify-between text-2xl font-mono text-slate-800">
                    <span className="flex items-center gap-3">
                      <HelpCircle className="w-7 h-7 text-[#0071e3]" />
                      <span className="font-bold">No clear answers required</span>
                    </span>
                    <span className="text-[#0071e3] font-black tracking-wide">CONFIDENCE RESTORED</span>
                  </div>
                </div>
              </PhysicalCard>
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* SCENE 3: THE DIALOGUE REFRAME (Frames 450 - 636)         */}
      {/* "Instead of thinking, 'I have to handle all of this     */}
      {/* alone,' you feel, 'I can keep going. I'm not alone in   */}
      {/* this.'"                                                 */}
      {/* ======================================================== */}
      {frame >= 450 && frame < 636 && (() => {
        const sBoxA = sp(452);
        const sBoxB = sp(538);

        return (
          <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
            <div className="relative w-full max-w-[940px]">
              <div className="absolute -top-7 left-8 z-30 pointer-events-none">
                <TapeStrip position="top-left" width={180} height={48} enableWobble />
              </div>

              <PhysicalCard
                tiltX={3}
                tiltY={-4}
                elevation={45}
                impactMs={15000}
                className="w-full p-9 rounded-[40px] bg-white/95 border-2 border-sky-300/70 shadow-2xl backdrop-blur-md flex flex-col items-center text-center gap-6"
              >
                {/* Header */}
                <div className="text-center mt-1">
                  <h2 className="text-5xl font-black text-slate-950 leading-tight">
                    THE INTERNAL REFRAME
                  </h2>
                  <div className="text-2xl font-mono text-[#0071e3] font-bold mt-1 tracking-wider uppercase">
                    Breaking The Isolation Trap
                  </div>
                </div>

                {/* Side-by-side Dialogue Reframe Cards */}
                <div className="flex flex-col gap-5 w-full my-2">
                  {/* Old Isolation Thought (Revealed on Frame 452) */}
                  <div
                    className="p-6 rounded-3xl bg-rose-50/90 border-3 border-rose-300 flex flex-col gap-3 text-left shadow-md"
                    style={{
                      opacity: frame >= 452 ? Math.min(1, sBoxA * 1.2) : 0,
                      transform: `scale(${frame >= 452 ? interpolate(sBoxA, [0, 1], [0.85, 1]) : 0.85})`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-mono font-black text-rose-700 uppercase flex items-center gap-2">
                        <XCircle className="w-6 h-6 text-rose-500" />
                        OLD ISOLATION THOUGHT
                      </span>
                      <span className="px-3.5 py-1 rounded-xl bg-rose-200 text-rose-800 font-mono text-xl font-black">
                        DRAINING
                      </span>
                    </div>
                    <div className="text-3xl sm:text-4xl font-black text-rose-950 leading-snug">
                      “I have to handle all of this alone.”
                    </div>
                  </div>

                  {/* Faith Reframe (Revealed on Frame 538) */}
                  <div
                    className="p-6 rounded-3xl bg-emerald-50/95 border-3 border-emerald-400 flex flex-col gap-3 text-left shadow-xl"
                    style={{
                      opacity: frame >= 538 ? Math.min(1, sBoxB * 1.2) : 0,
                      transform: `scale(${frame >= 538 ? interpolate(sBoxB, [0, 1], [0.85, 1]) : 0.85})`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-mono font-black text-emerald-700 uppercase flex items-center gap-2">
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                        FAITH REFRAME
                      </span>
                      <span className="px-3.5 py-1 rounded-xl bg-emerald-200 text-emerald-900 font-mono text-xl font-black">
                        UNSHAKABLE
                      </span>
                    </div>
                    <div className="text-3xl sm:text-4xl font-black text-emerald-950 leading-snug">
                      “I can keep going. I’m not alone in this.”
                    </div>
                  </div>
                </div>
              </PhysicalCard>
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* SCENE 4: THE NEXT STEP (Frames 636 - 762)                */}
      {/* "And sometimes, that shift in perspective is enough to   */}
      {/* help you take the next step."                            */}
      {/* ======================================================== */}
      {frame >= 636 && frame < 762 && (() => {
        const sCutout = sp(640);
        const sPill = sp(711);

        return (
          <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
            <div className="relative w-full max-w-[940px]">
              <div className="absolute -top-7 right-8 z-30 pointer-events-none">
                <TapeStrip position="top-right" width={180} height={48} enableWobble />
              </div>

              <PhysicalCard
                tiltX={-3}
                tiltY={3}
                elevation={45}
                impactMs={21200}
                className="w-full p-9 rounded-[40px] bg-white/95 border-2 border-sky-300/70 shadow-2xl backdrop-blur-md flex flex-col items-center text-center gap-6"
              >
                {/* Header */}
                <div className="text-center mt-1">
                  <h2 className="text-5xl font-black text-slate-950 leading-tight">
                    SHIFT IN PERSPECTIVE
                  </h2>
                  <div className="text-2xl font-mono text-[#0071e3] font-bold mt-1 tracking-wider uppercase">
                    Action Over Certainty
                  </div>
                </div>

                {/* Hero Cutout */}
                <div
                  className="w-full flex justify-center items-center my-1"
                  style={{
                    opacity: frame >= 640 ? Math.min(1, sCutout * 1.2) : 0,
                    transform: `scale(${frame >= 640 ? interpolate(sCutout, [0, 1], [0.8, 1]) : 0.8}) translateY(${frame >= 640 ? interpolate(sCutout, [0, 1], [25, 0]) : 25}px)`,
                  }}
                >
                  <ProCutout
                    assetId="enlightened_mind_insight"
                    glowColor="amber"
                    animation="stamp_impact"
                    width={400}
                    height={300}
                    ghostText="CLARITY"
                  />
                </div>

                {/* Directive Action Pill */}
                <div
                  className="w-full"
                  style={{
                    opacity: frame >= 711 ? Math.min(1, sPill * 1.2) : 0,
                    transform: `scale(${frame >= 711 ? interpolate(sPill, [0, 1], [0.85, 1]) : 0.85})`,
                  }}
                >
                  <div className="w-full p-5 rounded-2xl bg-emerald-100/90 border-2 border-emerald-500/40 flex items-center justify-center gap-3 text-3xl font-black text-emerald-950 shadow-xl">
                    <ArrowRight className="w-8 h-8 text-emerald-700 shrink-0" />
                    <span>ENOUGH TO TAKE THE NEXT STEP</span>
                  </div>
                </div>
              </PhysicalCard>
            </div>
          </div>
        );
      })()}

    </div>
  );
};
