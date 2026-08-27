import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import {
  ShieldCheck,
  ShieldAlert,
  ArrowRightLeft,
  FileX2,
  CheckCircle2,
  XCircle,
  Sparkles,
  Layers,
  CornerDownRight,
  MessageSquare,
  Scale,
  Ban,
  Check,
  HeartHandshake,
} from "lucide-react";
import { WordTimestamp } from "../../types";
import {
  MotionKeyframeBox,
  MotionKeyframe,
  interpolateTrack,
} from "../../components/MotionKeyframeBox";

interface CanvasProps {
  transcript: WordTimestamp[];
}

export const BoundariesCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  // Global smooth camera push across the canvas
  const cameraZoom = interpolateTrack(
    currentMs,
    [
      { timeMs: 0, value: 1.0 },
      { timeMs: durationInFrames * (1000 / fps), value: 1.04 },
    ]
  );

  // Active check for B-Roll scenes in range (7.8s - 25.5s)
  const isBRollActive = currentMs >= 7600 && currentMs < 25600;
  if (!isBRollActive) return null;

  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none z-20 select-none overflow-hidden"
      style={{ transform: `scale(${cameraZoom})`, transformOrigin: "center center" }}
    >
      {/* ========================================================================= */}
      {/* SCENE 1: THE CORE DEFINITION (7.6s - 14.3s)                               */}
      {/* "And boundaries aren't about controlling other people..."                  */}
      {/* ========================================================================= */}
      {currentMs >= 7600 && currentMs < 14400 && (
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-[260px] px-10">
          {/* Header Pill */}
          <MotionKeyframeBox
            currentMs={currentMs}
            keyframes={[
              { timeMs: 7700, opacity: 0, scale: 0.9, y: -25 },
              { timeMs: 8150, opacity: 1, scale: 1.0, y: 0 },
              { timeMs: 13700, opacity: 1, scale: 1.02, y: -4 },
              { timeMs: 14250, opacity: 0, scale: 0.94, y: -20 },
            ]}
            className="apple-glass px-10 py-4 rounded-full border-[3px] border-emerald-300 shadow-xl flex items-center gap-4 mb-10"
          >
            <ShieldCheck className="text-emerald-600" style={{ width: 40, height: 40 }} />
            <span className="text-slate-900 font-extrabold tracking-wider uppercase" style={{ fontSize: 34 }}>
              PRINCIPLE 01 • THE DEFINITION
            </span>
          </MotionKeyframeBox>

          {/* Dual Comparison Cards */}
          <div className="w-full max-w-[960px] flex flex-col gap-7">
            {/* Top Card: What It's NOT (Controlling Others) */}
            {(() => {
              const notActiveWeight = interpolateTrack(currentMs, [
                { timeMs: 7800, value: 0 },
                { timeMs: 8300, value: 1 },
                { timeMs: 11000, value: 1 },
                { timeMs: 11600, value: 0.5 },
              ]);

              return (
                <MotionKeyframeBox
                  currentMs={currentMs}
                  keyframes={[
                    { timeMs: 7900, opacity: 0, scale: 0.93, y: 35 },
                    { timeMs: 8400, opacity: 1, scale: 1.0, y: 0 },
                    { timeMs: 13700, opacity: 1, scale: 1.015, y: -3 },
                    { timeMs: 14250, opacity: 0, scale: 0.94, y: 30 },
                  ]}
                  className="rounded-[38px] p-9 border-[4px] shadow-2xl bg-white"
                  style={{
                    borderColor: `rgba(253, 164, 175, ${0.4 + notActiveWeight * 0.6})`,
                    boxShadow: `0 25px 60px rgba(244, 63, 94, ${notActiveWeight * 0.16})`,
                    opacity: notActiveWeight,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 shadow-inner">
                        <XCircle className="w-10 h-10" />
                      </div>
                      <div>
                        <div className="text-xs font-mono font-black text-rose-600 uppercase tracking-widest mb-1">
                          COMMON MISCONCEPTION
                        </div>
                        <div className="text-slate-950 font-black text-3xl tracking-tight">
                          CONTROLLING OTHERS
                        </div>
                      </div>
                    </div>
                    <span className="px-5 py-2 rounded-full bg-rose-100 text-rose-700 font-black text-base tracking-wider uppercase border border-rose-200">
                      NOT A BOUNDARY
                    </span>
                  </div>
                </MotionKeyframeBox>
              );
            })()}

            {/* Bottom Card: What It IS (Your Internal Standard) */}
            {(() => {
              return (
                <MotionKeyframeBox
                  currentMs={currentMs}
                  keyframes={[
                    { timeMs: 10900, opacity: 0, scale: 0.93, y: 35 },
                    { timeMs: 11400, opacity: 1, scale: 1.0, y: 0 },
                    { timeMs: 13700, opacity: 1, scale: 1.015, y: -3 },
                    { timeMs: 14250, opacity: 0, scale: 0.94, y: 30 },
                  ]}
                  className="rounded-[38px] p-9 border-[4px] shadow-2xl bg-slate-950 text-white border-emerald-400"
                  style={{
                    boxShadow: "0 30px 70px rgba(16, 185, 129, 0.28)",
                  }}
                >
                  <div className="flex items-center justify-between mb-7 pb-5 border-b border-slate-800">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 font-black text-2xl shadow-inner">
                        <ShieldCheck className="w-10 h-10" />
                      </div>
                      <div>
                        <div className="font-black text-3xl tracking-tight text-white">YOUR INTERNAL STANDARD</div>
                        <div className="text-emerald-400 font-bold text-lg uppercase tracking-wider mt-0.5">
                          What You Will & Won’t Accept
                        </div>
                      </div>
                    </div>
                    <span className="px-5 py-2 rounded-full bg-emerald-500 text-slate-950 font-black text-base tracking-wider uppercase">
                      TRUE BOUNDARY
                    </span>
                  </div>

                  {/* 2 Step Pill Chips: Will Accept vs Won't Accept */}
                  <div className="grid grid-cols-2 gap-5">
                    {/* Chip 1: What You Will Accept */}
                    <div
                      className="p-5 rounded-2xl border-[3px] flex items-center gap-4"
                      style={{
                        backgroundColor: "rgba(6, 78, 59, 0.6)",
                        borderColor: "#34d399",
                      }}
                    >
                      <Check className="text-emerald-400 w-8 h-8 flex-shrink-0" />
                      <span className="text-white font-extrabold text-2xl">WHAT YOU ACCEPT</span>
                    </div>

                    {/* Chip 2: What You Won't Accept */}
                    <div
                      className="p-5 rounded-2xl border-[3px] flex items-center gap-4"
                      style={{
                        backgroundColor: "rgba(136, 19, 55, 0.6)",
                        borderColor: "#fb7185",
                      }}
                    >
                      <Ban className="text-rose-400 w-8 h-8 flex-shrink-0" />
                      <span className="text-white font-extrabold text-2xl">WHAT YOU WON’T</span>
                    </div>
                  </div>
                </MotionKeyframeBox>
              );
            })()}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCENE 2: THE SCRIPT BLUEPRINT (14.3s - 20.4s)                              */}
      {/* "So instead of: You need to stop doing that... Try: I'm not comfortable..."*/}
      {/* ========================================================================= */}
      {currentMs >= 14300 && currentMs < 20500 && (
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-[260px] px-10">
          {/* Header Pill */}
          <MotionKeyframeBox
            currentMs={currentMs}
            keyframes={[
              { timeMs: 14400, opacity: 0, scale: 0.9, y: -25 },
              { timeMs: 14850, opacity: 1, scale: 1.0, y: 0 },
              { timeMs: 19800, opacity: 1, scale: 1.02, y: -4 },
              { timeMs: 20350, opacity: 0, scale: 0.94, y: -20 },
            ]}
            className="apple-glass px-10 py-4 rounded-full border-[3px] border-sky-300 shadow-xl flex items-center gap-4 mb-10"
          >
            <ArrowRightLeft className="text-sky-600" style={{ width: 40, height: 40 }} />
            <span className="text-slate-900 font-extrabold tracking-wider uppercase" style={{ fontSize: 34 }}>
              THE COMMUNICATION SHIFT
            </span>
          </MotionKeyframeBox>

          <div className="w-full max-w-[960px] flex flex-col gap-7">
            {/* Top Card: Instead of */}
            <MotionKeyframeBox
              currentMs={currentMs}
              keyframes={[
                { timeMs: 14600, opacity: 0, scale: 0.93, y: 35 },
                { timeMs: 15100, opacity: 1, scale: 1.0, y: 0 },
                { timeMs: 19800, opacity: 1, scale: 1.015, y: -3 },
                { timeMs: 20350, opacity: 0, scale: 0.94, y: 30 },
              ]}
              className="rounded-[38px] p-8 border-[4px] shadow-xl bg-white border-rose-300"
              style={{
                boxShadow: "0 20px 50px rgba(244, 63, 94, 0.14)",
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-1.5 rounded-xl bg-rose-100 text-rose-700 font-black text-sm uppercase tracking-wider">
                  ❌ INSTEAD OF (ACCUSATORY)
                </span>
              </div>
              <div className="text-slate-800 font-black text-4xl tracking-tight line-through opacity-70">
                “You need to stop doing that.”
              </div>
            </MotionKeyframeBox>

            {/* Bottom Card: Try this */}
            {(() => {
              const stepAwayGlow = interpolateTrack(currentMs, [
                { timeMs: 18800, value: 0 },
                { timeMs: 19500, value: 1 },
              ]);

              return (
                <MotionKeyframeBox
                  currentMs={currentMs}
                  keyframes={[
                    { timeMs: 16800, opacity: 0, scale: 0.93, y: 35 },
                    { timeMs: 17350, opacity: 1, scale: 1.0, y: 0 },
                    { timeMs: 19800, opacity: 1, scale: 1.015, y: -3 },
                    { timeMs: 20350, opacity: 0, scale: 0.94, y: 30 },
                  ]}
                  className="rounded-[38px] p-9 border-[4px] shadow-2xl bg-slate-950 text-white border-emerald-400"
                  style={{
                    boxShadow: "0 30px 70px rgba(16, 185, 129, 0.28)",
                  }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <span className="px-4 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-sm uppercase tracking-wider">
                      ✅ TRY THIS (CALM & CLEAR)
                    </span>
                    <span className="text-emerald-400 font-bold text-sm tracking-wider uppercase">
                      100% Boundary Owned
                    </span>
                  </div>
                  <div className="text-white font-black text-4xl tracking-tight leading-snug">
                    “I’m not comfortable with that, so{" "}
                    <span
                      className="px-4 py-1.5 rounded-2xl inline-block transition-all"
                      style={{
                        backgroundColor: `rgba(16, 185, 129, ${stepAwayGlow > 0.5 ? 0.9 : 0.25})`,
                        color: stepAwayGlow > 0.5 ? "#022c22" : "#34d399",
                        transform: `scale(${1.0 + stepAwayGlow * 0.05})`,
                      }}
                    >
                      I’m going to step away.
                    </span>
                    ”
                  </div>
                </MotionKeyframeBox>
              );
            })()}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCENE 3: ZERO OVER-EXPLAINING (20.4s - 25.5s)                              */}
      {/* "And don't over-explain. You're allowed to say no without writing an essay"*/}
      {/* ========================================================================= */}
      {currentMs >= 20400 && currentMs < 25600 && (
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-[260px] px-10">
          {/* Header Pill */}
          <MotionKeyframeBox
            currentMs={currentMs}
            keyframes={[
              { timeMs: 20500, opacity: 0, scale: 0.9, y: -25 },
              { timeMs: 20950, opacity: 1, scale: 1.0, y: 0 },
              { timeMs: 24900, opacity: 1, scale: 1.02, y: -4 },
              { timeMs: 25400, opacity: 0, scale: 0.94, y: -20 },
            ]}
            className="apple-glass px-10 py-4 rounded-full border-[3px] border-amber-300 shadow-xl flex items-center gap-4 mb-10"
          >
            <FileX2 className="text-amber-600" style={{ width: 40, height: 40 }} />
            <span className="text-slate-900 font-extrabold tracking-wider uppercase" style={{ fontSize: 34 }}>
              RULE 02 • ZERO OVER-EXPLAINING
            </span>
          </MotionKeyframeBox>

          {/* Hero Rule Card */}
          {(() => {
            const noHighlight = interpolateTrack(currentMs, [
              { timeMs: 22800, value: 0 },
              { timeMs: 23300, value: 1 },
            ]);

            return (
              <MotionKeyframeBox
                currentMs={currentMs}
                keyframes={[
                  { timeMs: 20800, opacity: 0, scale: 0.93, y: 35 },
                  { timeMs: 21300, opacity: 1, scale: 1.0, y: 0 },
                  { timeMs: 24900, opacity: 1, scale: 1.02, y: -4 },
                  { timeMs: 25400, opacity: 0, scale: 0.94, y: 30 },
                ]}
                className="w-full max-w-[960px] apple-card rounded-[44px] p-12 border-[5px] border-slate-200 shadow-[0_40px_90px_rgba(0,0,0,0.12)] bg-white/98 flex flex-col items-center text-center"
              >
                {/* Rule Badge */}
                <div className="px-6 py-2 rounded-full bg-emerald-100 border-[2px] border-emerald-300 text-emerald-900 font-black text-xl tracking-wider uppercase mb-7 flex items-center gap-3">
                  <CheckCircle2 className="text-emerald-600" style={{ width: 28, height: 28 }} />
                  NO DEFENSE ESSAY NEEDED
                </div>

                {/* Big Statement */}
                <div className="text-slate-950 font-black text-5xl tracking-tight leading-[1.25] mb-9">
                  YOU’RE ALLOWED TO <br />
                  <span
                    className="px-6 py-2 rounded-2xl inline-block mt-2"
                    style={{
                      backgroundColor: `rgba(16, 185, 129, ${0.15 + noHighlight * 0.85})`,
                      color: noHighlight > 0.5 ? "#ffffff" : "#059669",
                      transform: `scale(${1.0 + noHighlight * 0.08})`,
                      boxShadow: noHighlight > 0.5 ? "0 15px 35px rgba(16, 185, 129, 0.4)" : "none",
                    }}
                  >
                    JUST SAY “NO.”
                  </span>
                </div>

                {/* Subtext Comparison Card */}
                <div className="w-full bg-slate-100 rounded-3xl p-7 border-[3px] border-slate-200 flex justify-around items-center">
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-mono font-black text-slate-500 uppercase">DON’T DO THIS</span>
                    <span className="text-rose-600 font-black text-2xl line-through mt-1">3-Page Defense Essay</span>
                  </div>
                  <div className="h-12 w-[2px] bg-slate-300" />
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-mono font-black text-emerald-600 uppercase">COMPLETE SENTENCE</span>
                    <span className="text-slate-900 font-black text-2xl mt-1">“No, thank you.”</span>
                  </div>
                </div>
              </MotionKeyframeBox>
            );
          })()}
        </div>
      )}

    </div>
  );
};

