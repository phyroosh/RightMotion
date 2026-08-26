import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import {
  MessageCircle,
  Users,
  Search,
  VolumeX,
  Tv,
  Wrench,
  AlertOctagon,
  Scale,
  Compass,
  CheckCircle2,
  XCircle,
  Flame,
  Layers,
} from "lucide-react";
import { WordTimestamp } from "../../types";
import {
  MotionKeyframeBox,
  MotionKeyframe,
  interpolateTrack,
  createCardKeyframes,
  createChipKeyframes,
} from "../../components/MotionKeyframeBox";

interface CanvasProps {
  transcript: WordTimestamp[];
}

export const EmotionsCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  // Global smooth camera push across the entire composition
  const cameraZoom = interpolateTrack(
    currentMs,
    [
      { timeMs: 0, value: 1.0 },
      { timeMs: durationInFrames * (1000 / fps), value: 1.045 },
    ]
  );

  // Active check for whether any B-Roll scene is in range
  const isBRollActive =
    (currentMs >= 4100 && currentMs < 17600) ||
    (currentMs >= 24400 && currentMs < 39800);

  if (!isBRollActive) return null;

  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none z-20 select-none overflow-hidden"
      style={{ transform: `scale(${cameraZoom})`, transformOrigin: "center center" }}
    >
      {/* ========================================================================= */}
      {/* SCENE 1: The Dual Processing Spectrum (4.2s - 17.5s)                      */}
      {/* ========================================================================= */}
      {currentMs >= 4100 && currentMs < 17600 && (
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-[220px] px-10">
          {/* 1. Header Pill */}
          <MotionKeyframeBox
            currentMs={currentMs}
            keyframes={[
              { timeMs: 4200, opacity: 0, scale: 0.9, y: -25 },
              { timeMs: 4650, opacity: 1, scale: 1.0, y: 0 },
              { timeMs: 16900, opacity: 1, scale: 1.02, y: -4 },
              { timeMs: 17450, opacity: 0, scale: 0.94, y: -20 },
            ]}
            className="apple-glass px-10 py-4 rounded-full border-[3px] border-indigo-200/80 shadow-xl flex items-center gap-4 mb-10"
          >
            <Layers className="text-indigo-600" style={{ width: 36, height: 36 }} />
            <span className="text-slate-900 font-extrabold tracking-wider uppercase" style={{ fontSize: 32 }}>
              CASE 01 • THE PROCESSING SPECTRUM
            </span>
          </MotionKeyframeBox>

          {/* 2. Dual Comparison Grid Cards */}
          <div className="w-full max-w-[960px] flex flex-col gap-6">
            {/* Top Card: Relational Processing Loop (Women) */}
            {(() => {
              const womenCardKeyframes: MotionKeyframe[] = [
                { timeMs: 4400, opacity: 0, scale: 0.93, y: 40 },
                { timeMs: 4900, opacity: 1, scale: 1.0, y: 0 },
                { timeMs: 16900, opacity: 1, scale: 1.015, y: -3 },
                { timeMs: 17450, opacity: 0, scale: 0.94, y: 35 },
              ];

              // Smooth intensity tracking between women active (4.4s-10.7s) and men takeover (10.7s+)
              const activeWeight = interpolateTrack(currentMs, [
                { timeMs: 4400, value: 0 },
                { timeMs: 4900, value: 1 },
                { timeMs: 10600, value: 1 },
                { timeMs: 11100, value: 0.55 },
              ]);

              return (
                <MotionKeyframeBox
                  currentMs={currentMs}
                  keyframes={womenCardKeyframes}
                  className="rounded-[36px] p-8 border-[4px] shadow-2xl bg-white"
                  style={{
                    borderColor: `rgba(253, 164, 175, ${0.4 + activeWeight * 0.6})`,
                    boxShadow: `0 25px 60px rgba(244, 63, 94, ${activeWeight * 0.18})`,
                    opacity: activeWeight,
                  }}
                >
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 font-black text-2xl shadow-inner">
                        ♀
                      </div>
                      <div>
                        <div className="text-slate-950 font-black text-3xl tracking-tight">RELATIONAL PROCESSING</div>
                        <div className="text-rose-600 font-bold text-lg uppercase tracking-wider">
                          Talking • Connecting • Exploring
                        </div>
                      </div>
                    </div>
                    {currentMs < 10700 && (
                      <span className="px-5 py-2 rounded-full bg-rose-500 text-white font-black text-lg tracking-wider uppercase">
                        ACTIVE MODE
                      </span>
                    )}
                  </div>

                  {/* 3 Step Pill Chips — Each with discrete buttery bezier animations */}
                  <div className="grid grid-cols-3 gap-4">
                    {/* Chip 1: Talking */}
                    <MotionKeyframeBox
                      currentMs={currentMs}
                      keyframes={[
                        { timeMs: 4800, opacity: 0.5, scale: 0.95 },
                        { timeMs: 7200, opacity: 0.5, scale: 0.95 },
                        { timeMs: 7500, opacity: 1.0, scale: 1.06 },
                        { timeMs: 7800, opacity: 1.0, scale: 1.0 },
                      ]}
                      className="p-4 rounded-2xl border-[3px] flex flex-col items-center gap-2"
                      style={{
                        backgroundColor: currentMs >= 7200 ? "#fff1f2" : "#f8fafc",
                        borderColor: currentMs >= 7200 ? "#fb7185" : "#e2e8f0",
                      }}
                    >
                      <MessageCircle className={currentMs >= 7200 ? "text-rose-600" : "text-slate-400"} style={{ width: 36, height: 36 }} />
                      <span className="text-slate-900 font-extrabold text-xl">1. TALKING</span>
                    </MotionKeyframeBox>

                    {/* Chip 2: Connecting */}
                    <MotionKeyframeBox
                      currentMs={currentMs}
                      keyframes={[
                        { timeMs: 4800, opacity: 0.5, scale: 0.95 },
                        { timeMs: 7500, opacity: 0.5, scale: 0.95 },
                        { timeMs: 7800, opacity: 1.0, scale: 1.06 },
                        { timeMs: 8100, opacity: 1.0, scale: 1.0 },
                      ]}
                      className="p-4 rounded-2xl border-[3px] flex flex-col items-center gap-2"
                      style={{
                        backgroundColor: currentMs >= 7500 ? "#fff1f2" : "#f8fafc",
                        borderColor: currentMs >= 7500 ? "#fb7185" : "#e2e8f0",
                      }}
                    >
                      <Users className={currentMs >= 7500 ? "text-rose-600" : "text-slate-400"} style={{ width: 36, height: 36 }} />
                      <span className="text-slate-900 font-extrabold text-xl">2. CONNECTING</span>
                    </MotionKeyframeBox>

                    {/* Chip 3: Understanding */}
                    <MotionKeyframeBox
                      currentMs={currentMs}
                      keyframes={[
                        { timeMs: 4800, opacity: 0.5, scale: 0.95 },
                        { timeMs: 9200, opacity: 0.5, scale: 0.95 },
                        { timeMs: 9550, opacity: 1.0, scale: 1.06 },
                        { timeMs: 9850, opacity: 1.0, scale: 1.0 },
                      ]}
                      className="p-4 rounded-2xl border-[3px] flex flex-col items-center gap-2"
                      style={{
                        backgroundColor: currentMs >= 9200 ? "#fff1f2" : "#f8fafc",
                        borderColor: currentMs >= 9200 ? "#fb7185" : "#e2e8f0",
                      }}
                    >
                      <Search className={currentMs >= 9200 ? "text-rose-600" : "text-slate-400"} style={{ width: 36, height: 36 }} />
                      <span className="text-slate-900 font-extrabold text-xl">3. UNDERSTANDING</span>
                    </MotionKeyframeBox>
                  </div>
                </MotionKeyframeBox>
              );
            })()}

            {/* Bottom Card: Containment & Action (Men) */}
            {(() => {
              const menCardKeyframes: MotionKeyframe[] = [
                { timeMs: 10700, opacity: 0, scale: 0.93, y: 40 },
                { timeMs: 11200, opacity: 1, scale: 1.0, y: 0 },
                { timeMs: 16900, opacity: 1, scale: 1.015, y: -3 },
                { timeMs: 17450, opacity: 0, scale: 0.94, y: 35 },
              ];

              return (
                <MotionKeyframeBox
                  currentMs={currentMs}
                  keyframes={menCardKeyframes}
                  className="rounded-[36px] p-8 border-[4px] shadow-2xl bg-slate-950 text-white border-sky-400"
                  style={{
                    boxShadow: "0 25px 60px rgba(14, 165, 233, 0.25)",
                  }}
                >
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 font-black text-2xl shadow-inner">
                        ♂
                      </div>
                      <div>
                        <div className="font-black text-3xl tracking-tight text-white">CONTAINMENT & ACTION</div>
                        <div className="text-sky-400 font-bold text-lg uppercase tracking-wider">
                          Quiet • Distraction • Problem-Solving
                        </div>
                      </div>
                    </div>
                    <span className="px-5 py-2 rounded-full bg-sky-500 text-slate-950 font-black text-lg tracking-wider uppercase">
                      ACTIVE MODE
                    </span>
                  </div>

                  {/* 3 Step Pill Chips */}
                  <div className="grid grid-cols-3 gap-4">
                    {/* Chip 1: Stay Quiet */}
                    <MotionKeyframeBox
                      currentMs={currentMs}
                      keyframes={[
                        { timeMs: 11000, opacity: 0.5, scale: 0.95 },
                        { timeMs: 13500, opacity: 0.5, scale: 0.95 },
                        { timeMs: 13850, opacity: 1.0, scale: 1.06 },
                        { timeMs: 14150, opacity: 1.0, scale: 1.0 },
                      ]}
                      className="p-4 rounded-2xl border-[3px] flex flex-col items-center gap-2"
                      style={{
                        backgroundColor: currentMs >= 13500 ? "rgba(12, 74, 110, 0.8)" : "rgba(15, 23, 42, 0.5)",
                        borderColor: currentMs >= 13500 ? "#38bdf8" : "#334155",
                      }}
                    >
                      <VolumeX className="text-sky-400" style={{ width: 36, height: 36 }} />
                      <span className="text-white font-extrabold text-xl">1. STAY QUIET</span>
                    </MotionKeyframeBox>

                    {/* Chip 2: Distract */}
                    <MotionKeyframeBox
                      currentMs={currentMs}
                      keyframes={[
                        { timeMs: 11000, opacity: 0.5, scale: 0.95 },
                        { timeMs: 14600, opacity: 0.5, scale: 0.95 },
                        { timeMs: 14950, opacity: 1.0, scale: 1.06 },
                        { timeMs: 15250, opacity: 1.0, scale: 1.0 },
                      ]}
                      className="p-4 rounded-2xl border-[3px] flex flex-col items-center gap-2"
                      style={{
                        backgroundColor: currentMs >= 14600 ? "rgba(12, 74, 110, 0.8)" : "rgba(15, 23, 42, 0.5)",
                        borderColor: currentMs >= 14600 ? "#38bdf8" : "#334155",
                      }}
                    >
                      <Tv className="text-sky-400" style={{ width: 36, height: 36 }} />
                      <span className="text-white font-extrabold text-xl">2. DISTRACT</span>
                    </MotionKeyframeBox>

                    {/* Chip 3: Fix Problem */}
                    <MotionKeyframeBox
                      currentMs={currentMs}
                      keyframes={[
                        { timeMs: 11000, opacity: 0.5, scale: 0.95 },
                        { timeMs: 16100, opacity: 0.5, scale: 0.95 },
                        { timeMs: 16450, opacity: 1.0, scale: 1.06 },
                        { timeMs: 16750, opacity: 1.0, scale: 1.0 },
                      ]}
                      className="p-4 rounded-2xl border-[3px] flex flex-col items-center gap-2"
                      style={{
                        backgroundColor: currentMs >= 16100 ? "rgba(12, 74, 110, 0.8)" : "rgba(15, 23, 42, 0.5)",
                        borderColor: currentMs >= 16100 ? "#38bdf8" : "#334155",
                      }}
                    >
                      <Wrench className="text-sky-400" style={{ width: 36, height: 36 }} />
                      <span className="text-white font-extrabold text-xl">3. FIX PROBLEM</span>
                    </MotionKeyframeBox>
                  </div>
                </MotionKeyframeBox>
              );
            })()}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCENE 2: The State vs Decision Rule (24.5s - 31.0s)                       */}
      {/* ========================================================================= */}
      {currentMs >= 24400 && currentMs < 31000 && (
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-[220px] px-10">
          {/* 1. Header Pill */}
          <MotionKeyframeBox
            currentMs={currentMs}
            keyframes={[
              { timeMs: 24500, opacity: 0, scale: 0.9, y: -25 },
              { timeMs: 24950, opacity: 1, scale: 1.0, y: 0 },
              { timeMs: 30400, opacity: 1, scale: 1.02, y: -4 },
              { timeMs: 30900, opacity: 0, scale: 0.94, y: -20 },
            ]}
            className="apple-glass px-10 py-4 rounded-full border-[3px] border-rose-300 shadow-xl flex items-center gap-4 mb-10"
          >
            <AlertOctagon className="text-rose-600" style={{ width: 36, height: 36 }} />
            <span className="text-slate-900 font-extrabold tracking-wider uppercase" style={{ fontSize: 32 }}>
              RULE 01 • DECISION GUARDRAIL
            </span>
          </MotionKeyframeBox>

          {/* 2. Hero Formula Card */}
          {(() => {
            const cardKeyframes: MotionKeyframe[] = [
              { timeMs: 24800, opacity: 0, scale: 0.93, y: 40 },
              { timeMs: 25300, opacity: 1, scale: 1.0, y: 0 },
              { timeMs: 30400, opacity: 1, scale: 1.025, y: -4 },
              { timeMs: 30900, opacity: 0, scale: 0.94, y: 35 },
            ];

            // Smooth progress bar fill
            const barProgress = interpolateTrack(currentMs, [
              { timeMs: 25000, value: 30 },
              { timeMs: 28400, value: 30 },
              { timeMs: 29200, value: 96 },
            ]);

            // Highlighting pulse on permanent decisions
            const permanentHighlight = interpolateTrack(currentMs, [
              { timeMs: 28400, value: 0 },
              { timeMs: 28800, value: 1 },
            ]);

            return (
              <MotionKeyframeBox
                currentMs={currentMs}
                keyframes={cardKeyframes}
                className="w-full max-w-[960px] apple-card rounded-[44px] p-10 border-[5px] border-slate-200/90 shadow-[0_40px_90px_rgba(0,0,0,0.12)] bg-white/95 flex flex-col items-center text-center"
              >
                {/* Temporary Tag */}
                <div className="px-6 py-2 rounded-full bg-amber-100 border-[2px] border-amber-300 text-amber-900 font-black text-xl tracking-wider uppercase mb-6 flex items-center gap-3">
                  <Flame className="text-amber-600" style={{ width: 28, height: 28 }} />
                  TEMPORARY EMOTIONAL STATE
                </div>

                {/* Big Formula Statement */}
                <div className="text-slate-950 font-black text-5xl tracking-tight leading-[1.2] mb-8">
                  NEVER MAKE <br />
                  <span
                    className="px-4 py-1 rounded-2xl inline-block"
                    style={{
                      backgroundColor: `rgba(225, 29, 72, ${permanentHighlight})`,
                      color: permanentHighlight > 0.5 ? "#ffffff" : "#e11d48",
                      transform: `scale(${1.0 + permanentHighlight * 0.06})`,
                      boxShadow: permanentHighlight > 0.5 ? "0 10px 30px rgba(225, 29, 72, 0.4)" : "none",
                    }}
                  >
                    PERMANENT DECISIONS
                  </span>
                </div>

                {/* Waveform / Intensity graph */}
                <div className="w-full bg-slate-100 rounded-3xl p-6 border-[3px] border-slate-200 flex flex-col gap-3">
                  <div className="flex justify-between items-center text-slate-600 font-extrabold text-lg uppercase tracking-wider">
                    <span>Peak Emotion (High Turbulence)</span>
                    <span className="text-rose-600 font-black">DO NOT ACT</span>
                  </div>
                  <div className="w-full h-5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600 rounded-full"
                      style={{ width: `${barProgress}%` }}
                    />
                  </div>
                </div>
              </MotionKeyframeBox>
            );
          })()}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCENE 3: The 2-Question Clarity Audit (31.0s - 36.5s)                      */}
      {/* ========================================================================= */}
      {currentMs >= 30900 && currentMs < 36600 && (
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-[220px] px-10">
          {/* 1. Header Pill */}
          <MotionKeyframeBox
            currentMs={currentMs}
            keyframes={[
              { timeMs: 31000, opacity: 0, scale: 0.9, y: -25 },
              { timeMs: 31450, opacity: 1, scale: 1.0, y: 0 },
              { timeMs: 36000, opacity: 1, scale: 1.02, y: -4 },
              { timeMs: 36500, opacity: 0, scale: 0.94, y: -20 },
            ]}
            className="apple-glass px-10 py-4 rounded-full border-[3px] border-sky-300 shadow-xl flex items-center gap-4 mb-8"
          >
            <Compass className="text-sky-600" style={{ width: 36, height: 36 }} />
            <span className="text-slate-900 font-extrabold tracking-wider uppercase" style={{ fontSize: 32 }}>
              PROTOCOL 02 • THE CLARITY AUDIT
            </span>
          </MotionKeyframeBox>

          {/* 2. Two Big Question Cards */}
          <div className="w-full max-w-[960px] flex flex-col gap-6">
            {/* Question 01: Identification */}
            <MotionKeyframeBox
              currentMs={currentMs}
              keyframes={[
                { timeMs: 31300, opacity: 0, scale: 0.93, y: 35 },
                { timeMs: 31800, opacity: 1, scale: 1.0, y: 0 },
                { timeMs: 36000, opacity: 1, scale: 1.015, y: -3 },
                { timeMs: 36500, opacity: 0, scale: 0.94, y: 30 },
              ]}
              className="rounded-[36px] p-8 border-[4px] shadow-xl bg-white/95 border-sky-400"
              style={{
                boxShadow: "0 20px 50px rgba(14, 165, 233, 0.18)",
              }}
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="px-4 py-1.5 rounded-xl bg-sky-100 text-sky-700 font-black text-lg uppercase tracking-wider">
                  QUESTION 01
                </span>
                <span className="text-slate-500 font-bold text-lg">IDENTIFICATION</span>
              </div>
              <div className="text-slate-950 font-black text-4xl tracking-tight">
                “What am I <span className="text-sky-600 underline decoration-sky-300 decoration-4">actually feeling?</span>”
              </div>
            </MotionKeyframeBox>

            {/* Question 02: Resolution */}
            <MotionKeyframeBox
              currentMs={currentMs}
              keyframes={[
                { timeMs: 34800, opacity: 0, scale: 0.93, y: 35 },
                { timeMs: 35350, opacity: 1, scale: 1.0, y: 0 },
                { timeMs: 36000, opacity: 1, scale: 1.015, y: -3 },
                { timeMs: 36500, opacity: 0, scale: 0.94, y: 30 },
              ]}
              className="rounded-[36px] p-8 border-[4px] shadow-xl bg-white/95 border-indigo-400"
              style={{
                boxShadow: "0 20px 50px rgba(99, 102, 241, 0.18)",
              }}
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="px-4 py-1.5 rounded-xl bg-indigo-100 text-indigo-700 font-black text-lg uppercase tracking-wider">
                  QUESTION 02
                </span>
                <span className="text-slate-500 font-bold text-lg">RESOLUTION</span>
              </div>
              <div className="text-slate-950 font-black text-4xl tracking-tight">
                “And what do I <span className="text-indigo-600 underline decoration-indigo-300 decoration-4">actually need?</span>”
              </div>
            </MotionKeyframeBox>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCENE 4: The Equilibrium Horizon (36.5s - 39.7s)                          */}
      {/* ========================================================================= */}
      {currentMs >= 36400 && currentMs < 39800 && (
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-[220px] px-10">
          {/* 1. Header Pill */}
          <MotionKeyframeBox
            currentMs={currentMs}
            keyframes={[
              { timeMs: 36500, opacity: 0, scale: 0.9, y: -25 },
              { timeMs: 36900, opacity: 1, scale: 1.0, y: 0 },
              { timeMs: 39200, opacity: 1, scale: 1.02, y: -4 },
              { timeMs: 39700, opacity: 0, scale: 0.94, y: -20 },
            ]}
            className="apple-glass px-10 py-4 rounded-full border-[3px] border-emerald-300 shadow-xl flex items-center gap-4 mb-8"
          >
            <Scale className="text-emerald-600" style={{ width: 36, height: 36 }} />
            <span className="text-slate-900 font-extrabold tracking-wider uppercase" style={{ fontSize: 32 }}>
              THE BALANCED MIDDLE GROUND
            </span>
          </MotionKeyframeBox>

          {/* 2. Dual Extremes vs Sweet Spot */}
          <div className="w-full max-w-[960px] flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-5">
              {/* Extreme 1: Suppress */}
              <MotionKeyframeBox
                currentMs={currentMs}
                keyframes={[
                  { timeMs: 36600, opacity: 0, scale: 0.9, y: 25 },
                  { timeMs: 37050, opacity: 1, scale: 1.0, y: 0 },
                  { timeMs: 39200, opacity: 1, scale: 1.015, y: -2 },
                  { timeMs: 39700, opacity: 0, scale: 0.92, y: 20 },
                ]}
                className="p-6 rounded-[28px] bg-rose-50 border-[3px] border-rose-300 flex flex-col items-center text-center shadow-lg"
              >
                <XCircle className="text-rose-500 mb-2" style={{ width: 44, height: 44 }} />
                <span className="text-rose-950 font-black text-2xl uppercase">DON’T SUPPRESS</span>
                <span className="text-rose-700 font-bold text-lg">No bottling inside</span>
              </MotionKeyframeBox>

              {/* Extreme 2: Drown */}
              <MotionKeyframeBox
                currentMs={currentMs}
                keyframes={[
                  { timeMs: 37800, opacity: 0, scale: 0.9, y: 25 },
                  { timeMs: 38250, opacity: 1, scale: 1.0, y: 0 },
                  { timeMs: 39200, opacity: 1, scale: 1.015, y: -2 },
                  { timeMs: 39700, opacity: 0, scale: 0.92, y: 20 },
                ]}
                className="p-6 rounded-[28px] bg-amber-50 border-[3px] border-amber-300 flex flex-col items-center text-center shadow-lg"
              >
                <XCircle className="text-amber-500 mb-2" style={{ width: 44, height: 44 }} />
                <span className="text-amber-950 font-black text-2xl uppercase">DON’T DROWN</span>
                <span className="text-amber-700 font-bold text-lg">No spiraling overwhelm</span>
              </MotionKeyframeBox>
            </div>

            {/* Sweet Spot Banner */}
            <MotionKeyframeBox
              currentMs={currentMs}
              keyframes={[
                { timeMs: 38500, opacity: 0, scale: 0.92, y: 30 },
                { timeMs: 38950, opacity: 1, scale: 1.0, y: 0 },
                { timeMs: 39200, opacity: 1, scale: 1.015, y: -2 },
                { timeMs: 39700, opacity: 0, scale: 0.92, y: 25 },
              ]}
              className="rounded-[32px] p-6 bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-600 text-white flex items-center justify-center gap-4 shadow-2xl border-[3px] border-emerald-300/60"
            >
              <CheckCircle2 className="text-white" style={{ width: 40, height: 40 }} />
              <span className="font-black text-3xl tracking-tight uppercase">
                FEEL IT • OBSERVE IT • LET TIME CLEAR IT
              </span>
            </MotionKeyframeBox>
          </div>
        </div>
      )}
    </div>
  );
};
