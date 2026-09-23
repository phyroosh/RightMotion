import React from "react";
import { interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { WordTimestamp } from "../../types";
import { Sparkles, Trophy, Layers, Clock, ShieldCheck, ArrowRight, Eye, FileText, CheckCircle2 } from "lucide-react";

interface CanvasProps {
  transcript: WordTimestamp[];
}

/**
 * 🎬 BehindTheScenesCanvas
 * Topic: "You’re Comparing Your Behind-the-Scenes to Someone Else’s Highlight Reel"
 * Channel: Judy Insights (Light Canvas #f8fafc)
 *
 * 🎯 CREATIVE MANTRA & RETENTION LAW:
 *  - SIMPLE FRAME. RICH TIMELINE.
 *  - Open-canvas physical mechanisms (Zero unmotivated card containers).
 *  - Visual density != attention intensity.
 *  - High contrast, mobile-optimized typography, perfectly timed micro-events.
 */
export const BehindTheScenesCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ══════════════════════════════════════════════════════════════
  // SCENE TIMELINE (Derived from transcript.json timestamps)
  // Scene 1 (Hook & Hero Card):             0 → 285   (0.0s – 4.75s)
  // Scene 2 (The 1:100 Open Iceberg):      285 → 585  (4.75s – 9.75s)
  // Scene 3 (Finished Trophy vs Process):  585 → 985  (9.75s – 16.4s)
  // Scene 4 (Rehearsal vs Opening Night):  985 → 1285 (16.4s – 21.4s)
  // Scene 5 (Bedrock Foundation & Quiet): 1285 → 1526 (21.4s – 25.4s)
  // ══════════════════════════════════════════════════════════════

  // --- Spring dynamic controllers ---
  const s1Spring = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  
  const s2Spring = spring({ frame: Math.max(0, frame - 285), fps, config: { damping: 14, stiffness: 110 } });
  const s2GridSpring = spring({ frame: Math.max(0, frame - 360), fps, config: { damping: 15, stiffness: 100 } });
  
  const s3Spring = spring({ frame: Math.max(0, frame - 585), fps, config: { damping: 14, stiffness: 120 } });
  const s3Draft1 = spring({ frame: Math.max(0, frame - 740), fps, config: { damping: 12, stiffness: 140 } });
  const s3Draft2 = spring({ frame: Math.max(0, frame - 820), fps, config: { damping: 12, stiffness: 140 } });
  const s3Draft3 = spring({ frame: Math.max(0, frame - 890), fps, config: { damping: 12, stiffness: 140 } });
  
  const s4Spring = spring({ frame: Math.max(0, frame - 985), fps, config: { damping: 14, stiffness: 125 } });
  const s4ConduitsSpring = spring({ frame: Math.max(0, frame - 1040), fps, config: { damping: 14, stiffness: 110 } });
  
  const s5Spring = spring({ frame: Math.max(0, frame - 1285), fps, config: { damping: 14, stiffness: 110 } });
  const s5ResolveSpring = spring({ frame: Math.max(0, frame - 1490), fps, config: { damping: 15, stiffness: 90 } });

  // Crossfade opacities
  const s1Opacity = interpolate(frame, [0, 15, 270, 285], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s2Opacity = interpolate(frame, [285, 305, 570, 585], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s3Opacity = interpolate(frame, [585, 605, 970, 985], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s4Opacity = interpolate(frame, [985, 1005, 1270, 1285], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s5Opacity = interpolate(frame, [1285, 1305, 1520, 1526], [0, 1, 1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      className="absolute inset-0 flex flex-col items-center select-none pointer-events-none"
      style={{ width: 1080, height: 1920 }}
    >
      {/* ══════════════════════════════════════════════════════════════
          SCENE 1: HOOK & HERO EDITORIAL CARD (Frames 0 → 285)
          Judy present on right (0–75). Hero illustration in top/center.
          Clean, elegant, uncluttered.
          ══════════════════════════════════════════════════════════════ */}
      {frame < 290 && (
        <div
          className="absolute inset-x-0 flex flex-col items-center px-10"
          style={{
            top: 260,
            opacity: s1Opacity,
            transform: `translateY(${interpolate(s1Spring, [0, 1], [30, 0])}px)`,
          }}
        >
          {/* Eyebrow Badge */}
          <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-sky-100/90 border border-sky-300 text-sky-800 font-mono text-sm font-bold uppercase tracking-widest mb-4 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
            COGNITIVE ASYMMETRY // 01
          </div>

          {/* Headline */}
          <h1
            className="text-slate-950 font-black text-center tracking-tight leading-[1.05] mb-6"
            style={{ fontSize: 58, fontFamily: "Montserrat, sans-serif" }}
          >
            BEHIND-THE-SCENES <br />
            <span className="text-[#0284c7]">VS HIGHLIGHT REEL</span>
          </h1>

          {/* Hero Editorial Card */}
          <div
            className="w-full max-w-[840px] rounded-3xl overflow-hidden border-[3px] border-slate-900/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.16)] bg-white relative"
            style={{
              aspectRatio: "16 / 9",
              transform: `scale(${interpolate(s1Spring, [0, 1], [0.94, 1])})`,
            }}
          >
            <img
              src={staticFile("behind_the_scenes/assets/scene_illustration.png")}
              alt="Behind the scenes vs highlight reel"
              className="w-full h-full object-cover"
            />

            {/* Inset Label */}
            <div className="absolute bottom-4 left-6 px-3.5 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-md">
              <span className="text-xs font-mono font-bold text-slate-800 tracking-wider uppercase">
                THE TWO REALITIES
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SCENE 2: THE OPEN-CANVAS ICEBERG HORIZON (Frames 285 → 585)
          "On your feed, people broadcast their single peak hour out of hundreds of ordinary ones."
          Visual Mechanism: An open-canvas horizon dividing the 1 floating peak hour
          from the massive submerged volume of 99 ordinary hours. Zero card container.
          ══════════════════════════════════════════════════════════════ */}
      {frame >= 280 && frame < 590 && (
        <div
          className="absolute inset-x-0 flex flex-col items-center px-12"
          style={{
            top: 260,
            opacity: s2Opacity,
            transform: `translateY(${interpolate(s2Spring, [0, 1], [30, 0])}px)`,
          }}
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-amber-100/90 border border-amber-300 text-amber-800 font-mono text-sm font-bold uppercase tracking-widest mb-3 shadow-sm">
            <Eye className="w-4 h-4 text-amber-600" />
            THE 1:100 RATIO // SELECTION BIAS
          </div>

          <h2
            className="text-slate-950 font-black text-center tracking-tight leading-[1.05] mb-8"
            style={{ fontSize: 54, fontFamily: "Montserrat, sans-serif" }}
          >
            THE BROADCAST BIAS
          </h2>

          {/* Open-Canvas Physical Mechanism */}
          <div className="w-full max-w-[860px] flex flex-col items-center relative">
            
            {/* 1. Above Horizon: The Single Peak Hour (Gleaming Gold Monolith) */}
            <div className="flex flex-col items-center mb-6 relative">
              <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500 text-white font-mono text-xs font-black uppercase tracking-wider mb-3 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                BROADCASTED // 1%
              </div>

              <div className="px-8 py-5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 border-2 border-amber-500 shadow-[0_20px_40px_rgba(245,158,11,0.30)] flex flex-col items-center text-center">
                <span className="text-xs font-mono font-black text-amber-950 uppercase tracking-widest">
                  WHAT YOU SEE ON YOUR FEED
                </span>
                <span className="text-3xl font-black text-slate-950 mt-1">
                  1 Single Peak Hour
                </span>
              </div>
            </div>

            {/* 2. The Horizon Waterline */}
            <div className="w-full relative flex items-center justify-center my-4">
              <div className="w-full border-t-2 border-dashed border-sky-400/80" />
              <div className="absolute px-4 py-1 rounded-full bg-sky-600 text-white font-mono text-xs font-bold uppercase tracking-widest shadow-md">
                FEED HORIZON (WATERLINE)
              </div>
            </div>

            {/* 3. Below Horizon: The 99 Submerged Ordinary Hours */}
            <div
              className="w-full flex flex-col items-center mt-3"
              style={{
                opacity: s2GridSpring,
                transform: `translateY(${interpolate(s2GridSpring, [0, 1], [20, 0])}px)`,
              }}
            >
              <div className="flex items-center justify-between w-full max-w-[760px] mb-3 px-2">
                <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  THE UNSEEN REALITY
                </span>
                <span className="text-xs font-mono font-black text-slate-600 bg-slate-200/90 px-2.5 py-0.5 rounded-md">
                  99 ORDINARY HOURS // 99%
                </span>
              </div>

              {/* Monolithic 10x6 Submerged Block Grid */}
              <div className="w-full max-w-[760px] grid grid-cols-10 gap-2 p-4 rounded-2xl bg-slate-200/50 border border-slate-300/80">
                {Array.from({ length: 60 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-6 rounded-md bg-slate-300/80 border border-slate-300 shadow-sm"
                    style={{
                      opacity: interpolate(frame, [360, 480], [0.4, 0.95], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                    }}
                  />
                ))}
              </div>

              <div className="text-xs font-mono font-semibold text-slate-500 mt-4 tracking-wide text-center">
                Unposted routines, ordinary effort, and repetitive drafts.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SCENE 3: FINISHED TROPHY VS THE LIVE WORKSHOP (Frames 585 → 985)
          "You see their finished trophy, but you have to live through every quiet doubt, failed draft, and exhausting misstep of your own."
          Visual Mechanism: Open-canvas physical contrast.
          Trophy on museum pedestal (zero friction) vs accumulating heavy draft sheets (100% friction).
          ══════════════════════════════════════════════════════════════ */}
      {frame >= 580 && frame < 990 && (
        <div
          className="absolute inset-x-0 flex flex-col items-center px-10"
          style={{
            top: 250,
            opacity: s3Opacity,
            transform: `translateY(${interpolate(s3Spring, [0, 1], [30, 0])}px)`,
          }}
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900 text-white font-mono text-sm font-bold uppercase tracking-widest mb-3 shadow-sm">
            <Layers className="w-4 h-4 text-sky-400" />
            ASYMMETRIC FRICTION
          </div>

          <h2
            className="text-slate-950 font-black text-center tracking-tight leading-[1.05] mb-8"
            style={{ fontSize: 52, fontFamily: "Montserrat, sans-serif" }}
          >
            TROPHY VS PROCESS
          </h2>

          {/* Open-Canvas Physical Dual Arena */}
          <div className="w-full max-w-[880px] grid grid-cols-2 gap-8 items-start">
            
            {/* Left Column: Your Accumulating Process Sheets */}
            <div className="flex flex-col items-center w-full">
              <div className="flex items-center gap-2 mb-4">
                <span className="font-mono text-xs font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 uppercase tracking-wider">
                  YOUR PROCESS // 100% FRICTION
                </span>
              </div>

              {/* Physical Accumulating Sheets with tactile drop shadows */}
              <div className="flex flex-col gap-3.5 w-full">
                {/* 1. Quiet Doubt */}
                <div
                  className="p-4 rounded-2xl bg-white border-2 border-slate-200 shadow-md flex items-center gap-3.5"
                  style={{
                    opacity: s3Draft1,
                    transform: `translateY(${interpolate(s3Draft1, [0, 1], [-25, 0])}px)`,
                  }}
                >
                  <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-black text-sm shrink-0">
                    01
                  </div>
                  <div>
                    <div className="text-slate-950 font-bold text-base">Quiet Doubt</div>
                    <div className="text-xs text-slate-500 font-medium">Internal hesitation & uncertainty</div>
                  </div>
                </div>

                {/* 2. Failed Draft */}
                <div
                  className="p-4 rounded-2xl bg-white border-2 border-amber-300 shadow-md flex items-center gap-3.5 rotate-[-1deg]"
                  style={{
                    opacity: s3Draft2,
                    transform: `translateY(${interpolate(s3Draft2, [0, 1], [-25, 0])}px)`,
                  }}
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-sm shrink-0">
                    02
                  </div>
                  <div>
                    <div className="text-slate-950 font-bold text-base">Failed Drafts</div>
                    <div className="text-xs text-slate-600 font-medium">Discarded attempts & revisions</div>
                  </div>
                </div>

                {/* 3. Exhausting Misstep */}
                <div
                  className="p-4 rounded-2xl bg-white border-2 border-rose-300 shadow-md flex items-center gap-3.5 rotate-[1deg]"
                  style={{
                    opacity: s3Draft3,
                    transform: `translateY(${interpolate(s3Draft3, [0, 1], [-25, 0])}px)`,
                  }}
                >
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-black text-sm shrink-0">
                    03
                  </div>
                  <div>
                    <div className="text-slate-950 font-bold text-base">Exhausting Missteps</div>
                    <div className="text-xs text-slate-600 font-medium">The heavy energy cost of build-up</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Their Finished Trophy on a Plinth */}
            <div className="flex flex-col items-center w-full">
              <div className="flex items-center gap-2 mb-4">
                <span className="font-mono text-xs font-black text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-300 uppercase tracking-wider">
                  THEIR ENDPOINT // ZERO FRICTION
                </span>
              </div>

              {/* Glowing Trophy Pedestal Mechanism */}
              <div className="flex flex-col items-center">
                {/* Glowing Trophy Icon */}
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-200 flex items-center justify-center shadow-[0_20px_45px_rgba(245,158,11,0.38)] mb-3 border-2 border-amber-300">
                  <Trophy className="w-16 h-16 text-slate-950" />
                </div>

                {/* Pedestal Base */}
                <div className="w-48 h-12 rounded-t-xl bg-slate-900 border-x-2 border-t-2 border-slate-800 flex items-center justify-center shadow-lg">
                  <span className="font-mono text-xs font-black text-amber-400 uppercase tracking-widest">
                    THE TROPHY
                  </span>
                </div>
                <div className="w-56 h-4 bg-slate-800 rounded-b-lg shadow-md" />

                <div className="text-center mt-5 px-3">
                  <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-1">
                    THE DELETION OF STRUGGLE
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    The audience only sees the trophy, never the scrap paper that forged it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SCENE 4: REHEARSAL VS OPENING NIGHT (Frames 985 → 1285)
          "You aren't falling behind. You’re just comparing your unedited rehearsal to their final opening night."
          Visual Mechanism: Open-canvas dual timeline conduits showing chronological offset.
          ══════════════════════════════════════════════════════════════ */}
      {frame >= 980 && frame < 1290 && (
        <div
          className="absolute inset-x-0 flex flex-col items-center px-10"
          style={{
            top: 250,
            opacity: s4Opacity,
            transform: `translateY(${interpolate(s4Spring, [0, 1], [30, 0])}px)`,
          }}
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-300 text-emerald-800 font-mono text-sm font-bold uppercase tracking-widest mb-3 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            CHRONOLOGICAL REFRAME
          </div>

          {/* Major Punctuation Slam */}
          <h2
            className="text-slate-950 font-black text-center tracking-tight leading-[1.05] mb-2"
            style={{ fontSize: 56, fontFamily: "Montserrat, sans-serif" }}
          >
            YOU AREN'T <br />
            <span className="text-emerald-600">FALLING BEHIND</span>
          </h2>

          <div className="text-slate-500 font-mono text-sm font-bold tracking-wider uppercase mb-8">
            Different chapters, not different abilities.
          </div>

          {/* Open-Canvas Dual Timeline Conduits */}
          <div
            className="w-full max-w-[880px] flex flex-col gap-6"
            style={{
              opacity: s4ConduitsSpring,
              transform: `translateY(${interpolate(s4ConduitsSpring, [0, 1], [20, 0])}px)`,
            }}
          >
            {/* Conduit 1: Their Timeline (Opening Night) */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <span className="font-mono text-xs font-black text-amber-800 uppercase tracking-wider">
                  THEIR PUBLIC TIMELINE
                </span>
                <span className="font-mono text-xs font-black text-amber-700 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-300">
                  STAGE 5: OPENING NIGHT
                </span>
              </div>

              {/* Physical Rail */}
              <div className="relative w-full h-4 rounded-full bg-slate-200 shadow-inner overflow-hidden">
                <div className="w-full h-full bg-gradient-to-r from-amber-400 to-amber-500" />
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
                <span>Concept</span>
                <span>Rehearsal</span>
                <span>Editing</span>
                <span className="text-amber-700 font-black flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Premiere (100%)
                </span>
              </div>
            </div>

            {/* Center Offset Indicator */}
            <div className="flex items-center justify-center gap-4 py-1">
              <div className="h-0.5 flex-1 bg-slate-300" />
              <div className="px-4 py-1.5 rounded-full bg-slate-900 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-md">
                TIMELINE OFFSET (NOT A TALENT GAP)
              </div>
              <div className="h-0.5 flex-1 bg-slate-300" />
            </div>

            {/* Conduit 2: Your Active Timeline (Rehearsal) */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <span className="font-mono text-xs font-black text-[#0284c7] uppercase tracking-wider">
                  YOUR ACTIVE TIMELINE
                </span>
                <span className="font-mono text-xs font-black text-[#0284c7] bg-sky-100 px-3 py-0.5 rounded-full border border-sky-300">
                  STAGE 2: UNEDITED REHEARSAL
                </span>
              </div>

              {/* Physical Rail with Mid Playhead */}
              <div className="relative w-full h-4 rounded-full bg-slate-200 shadow-inner overflow-hidden">
                <div className="w-[40%] h-full bg-gradient-to-r from-sky-400 to-[#0284c7]" />
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
                <span className="text-slate-400">Concept</span>
                <span className="text-[#0284c7] font-black">Rehearsal (Current)</span>
                <span className="text-slate-400">Editing (Next)</span>
                <span className="text-slate-400">Premiere (Future)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SCENE 5: PRIVATE FOUNDATION VS SHOWROOM & BUILD IN QUIET
          (Frames 1285 → 1526)
          "Stop measuring your private foundation against someone else’s showroom. Build in quiet."
          - Frames 1285 to 1495: Bedrock Foundation vs Showroom
          - Frames 1495 to 1526: Decisive Monolithic "BUILD IN QUIET."
          ══════════════════════════════════════════════════════════════ */}
      {frame >= 1280 && (
        <div
          className="absolute inset-x-0 flex flex-col items-center px-10"
          style={{
            top: 250,
            opacity: s5Opacity,
            transform: `translateY(${interpolate(s5Spring, [0, 1], [30, 0])}px)`,
          }}
        >
          {/* Phase 5A: Foundation vs Showroom (Frames 1280 to 1495) */}
          {frame < 1495 && (
            <div className="w-full flex flex-col items-center">
              <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900 text-white font-mono text-sm font-bold uppercase tracking-widest mb-3 shadow-sm">
                <Layers className="w-4 h-4 text-amber-400" />
                BEDROCK VS SHOWROOM
              </div>

              <h2
                className="text-slate-950 font-black text-center tracking-tight leading-[1.05] mb-8"
                style={{ fontSize: 52, fontFamily: "Montserrat, sans-serif" }}
              >
                STOP MEASURING
              </h2>

              <div className="w-full max-w-[860px] flex flex-col gap-6">
                {/* Upper: The Showroom (Thin & Superficial) */}
                <div className="flex flex-col p-4 rounded-2xl border-2 border-dashed border-slate-300 bg-white/60">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
                      THEIR PUBLIC SHOWROOM
                    </span>
                    <span className="font-mono text-[11px] font-semibold text-slate-400">
                      THIN // SURFACE DISPLAY
                    </span>
                  </div>
                  <div className="text-slate-800 font-bold text-lg">
                    Curated For Immediate Applause
                  </div>
                </div>

                {/* Lower: Your Private Foundation (Massive Concrete Bedrock) */}
                <div className="flex flex-col p-7 rounded-3xl bg-slate-950 text-white shadow-2xl border-2 border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-black text-sky-400 uppercase tracking-wider flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
                      YOUR PRIVATE FOUNDATION
                    </span>
                    <span className="font-mono text-xs font-black text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
                      IMMOVABLE STRENGTH
                    </span>
                  </div>
                  <div className="text-white font-black text-2xl mb-1">
                    Reinforced Underground Bedrock
                  </div>
                  <div className="text-sm text-slate-300 font-medium">
                    Unseen by the feed. Built to endure decades, not 24-hour algorithmic cycles.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Phase 5B: Sovereign Decisive Resolution (Frames 1495 to 1526) */}
          {frame >= 1490 && (
            <div
              className="w-full flex flex-col items-center justify-center text-center mt-12"
              style={{
                opacity: s5ResolveSpring,
                transform: `scale(${interpolate(s5ResolveSpring, [0, 1], [0.92, 1])})`,
              }}
            >
              {/* Sovereign Cornerstone Icon */}
              <div className="w-20 h-20 rounded-3xl bg-slate-950 text-white flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.25)] mb-6 border-2 border-slate-800">
                <ShieldCheck className="w-10 h-10 text-sky-400" />
              </div>

              {/* Decisive Monolithic Headline */}
              <h1
                className="text-slate-950 font-black tracking-tight leading-none mb-4"
                style={{ fontSize: 78, fontFamily: "Montserrat, sans-serif" }}
              >
                BUILD IN <br />
                <span className="text-[#0284c7]">QUIET.</span>
              </h1>

              {/* Sovereign Tagline */}
              <p className="text-slate-600 font-mono text-base font-bold tracking-wider uppercase max-w-[560px]">
                Roots grow underground before trees touch the sky.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


