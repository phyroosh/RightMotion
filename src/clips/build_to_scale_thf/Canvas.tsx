import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, staticFile } from "remotion";
import { FacecamBRoll } from "../../components/facecam";
import { TapeStrip } from "../../components/collage/TapeStrip";
import { Sparkles, TrendingUp, Zap, Store, CheckCircle2, ArrowRight, MapPin, Coffee, Cake, FileText, Search } from "lucide-react";

export const BuildToScaleTHFCanvas: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-30 overflow-hidden">

      {/* ========================================================================= */}
      {/* SCENE 1: THE HOOK (Frames 0 - 265)                                        */}
      {/* "Bhai Lucknow ke is ladke ne apne chhote se hotel ko... ₹131 CRORE!"      */}
      {/* ========================================================================= */}
      {frame >= 0 && frame < 265 && (() => {
        const spTag = spring({ frame: frame - 10, fps, config: { damping: 14, stiffness: 130 } });
        const spBadge = spring({ frame: frame - 120, fps, config: { damping: 14, stiffness: 140 } });

        return (
          <>
            {/* Top Hook Tag (Frames 0 - 28) */}
            {frame < 30 && (
              <div
                className="absolute top-[8%] inset-x-0 flex justify-center transition-all"
                style={{
                  opacity: frame >= 10 ? Math.min(1, spTag * 1.5) : 0,
                  transform: `translateY(${frame >= 10 ? interpolate(spTag, [0, 1], [-25, 0]) : -25}px)`,
                }}
              >
                <div className="px-6 py-2.5 rounded-full bg-black/85 border-2 border-amber-400/60 backdrop-blur-xl shadow-2xl flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-amber-400" />
                  <span className="text-2xl font-mono font-black text-amber-300 tracking-wider uppercase">
                    LUCKNOW • HOTEL TO BRAND
                  </span>
                </div>
              </div>
            )}

            {/* B-ROLL 01: Founder Ankit Sahni Reveal (Frames 30 - 115) */}
            {/* Host slides down by 360px during this beat */}
            <FacecamBRoll
              mediaSrc={staticFile("build_to_scale_thf/broll/founder_ankit_sahni.png")}
              startFrame={30}
              endFrame={115}
              title="ANKIT SAHNI • FOUNDER"
              badgeIcon={<Zap className="w-6 h-6 text-amber-400" />}
              calloutTag="VISIONARY"
              spotlightCircle={false}
              variant="card"
            />

            {/* Host Centered Interlude: Status Tag (Frames 116 - 154) */}
            {frame >= 116 && frame < 155 && (
              <div
                className="absolute bottom-[28%] inset-x-0 flex justify-center px-8 transition-all"
                style={{
                  opacity: Math.min(1, spBadge * 1.5),
                  transform: `scale(${interpolate(spBadge, [0, 1], [0.85, 1])})`,
                }}
              >
                <div className="px-8 py-4 rounded-2xl bg-black/90 border-2 border-cyan-400/60 backdrop-blur-xl shadow-2xl flex items-center gap-4">
                  <TrendingUp className="w-7 h-7 text-cyan-400" />
                  <span className="text-3xl font-black text-white uppercase tracking-tight">
                    LUXURY BRAND TRANSFORMATION
                  </span>
                </div>
              </div>
            )}

            {/* B-ROLL 02: Bikaji ₹131 Crore Stock Filing News Article (Frames 155 - 250) */}
            {/* Host slides down by 360px during this beat */}
            <FacecamBRoll
              mediaSrc={staticFile("build_to_scale_thf/broll/bikaji_news.png")}
              startFrame={155}
              endFrame={250}
              title="OFFICIAL STOCK FILING • ₹131 CRORE"
              badgeIcon={<FileText className="w-6 h-6 text-emerald-400" />}
              calloutTag="53.02% STAKE"
              variant="card"
              mediaFit="contain"
            />
          </>
        );
      })()}

      {/* ========================================================================= */}
      {/* SCENE 2: THE SERIES & BRAND REVEAL (Frames 265 - 540)                     */}
      {/* "Yeh hai humari Build to Scale series... The Hazelnut Factory"            */}
      {/* ========================================================================= */}
      {frame >= 265 && frame < 540 && (() => {
        const spSeries = spring({ frame: frame - 275, fps, config: { damping: 14, stiffness: 130 } });
        const spMetrics = spring({ frame: frame - 370, fps, config: { damping: 14, stiffness: 140 } });

        return (
          <>
            {/* Top Series Header (Frames 275 - 470) */}
            {frame < 470 && (
              <div
                className="absolute top-[8%] inset-x-0 flex justify-center transition-all"
                style={{
                  opacity: frame >= 275 ? Math.min(1, spSeries * 1.5) : 0,
                  transform: `translateY(${frame >= 275 ? interpolate(spSeries, [0, 1], [-25, 0]) : -25}px)`,
                }}
              >
                <div className="relative">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 pointer-events-none">
                    <TapeStrip position="center-top" width={160} height={40} />
                  </div>
                  <div className="px-7 py-3 rounded-2xl bg-black/90 border-2 border-amber-400/80 backdrop-blur-xl shadow-2xl flex items-center gap-3">
                    <Zap className="w-6 h-6 text-amber-400" />
                    <span className="text-2xl font-mono font-black text-amber-300 tracking-wider uppercase">
                      BUILD TO SCALE • EPISODE 01
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Chest Zone: Growth vs Failure (Frames 370 - 469) */}
            {frame >= 370 && frame < 470 && (
              <div
                className="absolute bottom-[28%] inset-x-0 flex justify-center px-8 transition-all"
                style={{
                  opacity: Math.min(1, spMetrics * 1.5),
                  transform: `scale(${interpolate(spMetrics, [0, 1], [0.85, 1])})`,
                }}
              >
                <div className="px-8 py-4 rounded-2xl bg-black/90 border border-white/25 backdrop-blur-md shadow-2xl flex items-center gap-5">
                  <span className="text-2xl font-mono font-black text-emerald-400 uppercase">
                    GROWTH SECRETS
                  </span>
                  <span className="text-white/40 text-2xl font-black">•</span>
                  <span className="text-2xl font-mono font-black text-rose-400 uppercase">
                    ROOT FAILURES
                  </span>
                </div>
              </div>
            )}

            {/* B-ROLL 03: The Hazelnut Factory Store Ambiance (Frames 470 - 535) */}
            {/* Host slides down by 360px during this beat */}
            <FacecamBRoll
              mediaSrc={staticFile("build_to_scale_thf/broll/store_ambiance.png")}
              startFrame={470}
              endFrame={535}
              title="THE HAZELNUT FACTORY"
              badgeIcon={<Store className="w-6 h-6 text-amber-400" />}
              calloutTag="EST. 2019"
              variant="card"
              kenBurns="zoom-in"
            />
          </>
        );
      })()}

      {/* ========================================================================= */}
      {/* SCENE 3: THE 3 MARKET GAPS (Frames 540 - 825)                             */}
      {/* "Mithai alag... Coffee alag... Bakery kahin aur... Teeno ek saath nahi!"  */}
      {/* ========================================================================= */}
      {frame >= 540 && frame < 825 && (() => {
        const spGap = spring({ frame: frame - 795, fps, config: { damping: 13, stiffness: 150 } });

        return (
          <>
            {/* B-ROLL 04: Lucknow Map (Frames 550 - 620) */}
            {/* Host slides down by 360px during this beat */}
            <FacecamBRoll
              mediaSrc={staticFile("build_to_scale_thf/broll/lucknow_map.png")}
              startFrame={550}
              endFrame={620}
              title="LUCKNOW ORIGIN • 2019"
              badgeIcon={<MapPin className="w-6 h-6 text-cyan-400" />}
              calloutTag="GROUND ZERO"
              variant="card"
              kenBurns="zoom-out"
            />

            {/* B-ROLL 05: Specialty Coffee Pour-Over Bar (Frames 645 - 715) */}
            {/* Host slides down by 360px during this beat */}
            <FacecamBRoll
              mediaSrc={staticFile("build_to_scale_thf/broll/specialty_coffee.png")}
              startFrame={645}
              endFrame={715}
              title="01 • COFFEE BARS"
              badgeIcon={<Coffee className="w-6 h-6 text-cyan-400" />}
              calloutTag="SEPARATE"
              variant="card"
              kenBurns="zoom-in"
            />

            {/* B-ROLL 06: Artisanal Bakery Display (Frames 720 - 795) */}
            {/* Host slides down by 360px during this beat */}
            <FacecamBRoll
              mediaSrc={staticFile("build_to_scale_thf/broll/bakery_display.png")}
              startFrame={720}
              endFrame={795}
              title="02 • BAKERY DESSERTS"
              badgeIcon={<Cake className="w-6 h-6 text-emerald-400" />}
              calloutTag="SCATTERED"
              variant="card"
              kenBurns="zoom-in"
            />

            {/* Resolution Stamp: 3-in-1 Unified Luxury Destination (Frames 795 - 825) */}
            {/* Host springs back to center */}
            {frame >= 795 && (
              <div
                className="absolute bottom-[28%] inset-x-0 flex justify-center px-8 transition-all"
                style={{
                  opacity: Math.min(1, spGap * 1.5),
                  transform: `scale(${interpolate(spGap, [0, 1], [0.85, 1])})`,
                }}
              >
                <div className="p-6 px-10 rounded-3xl bg-emerald-950/95 border-3 border-emerald-400/90 shadow-[0_0_40px_rgba(16,185,129,0.4)] backdrop-blur-2xl flex items-center justify-between gap-6 max-w-[860px] w-full">
                  <span className="text-3xl font-black text-white uppercase flex items-center gap-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
                    <span>THF: 3-IN-1 LUXURY DESTINATION</span>
                  </span>
                  <span className="text-2xl font-mono font-black text-emerald-300 uppercase">
                    UNIFIED
                  </span>
                </div>
              </div>
            )}
          </>
        );
      })()}

      {/* ========================================================================= */}
      {/* SCENE 4: SCALING & VALUATION (Frames 825 - 1085)                          */}
      {/* "2019 pehli shop kholi... 23 outlets ban chuki... ₹250 CRORE VALUATION!"  */}
      {/* ========================================================================= */}
      {frame >= 825 && frame < 1085 && (() => {
        const spM1 = spring({ frame: frame - 860, fps, config: { damping: 13, stiffness: 140 } });
        const spM2 = spring({ frame: frame - 920, fps, config: { damping: 13, stiffness: 140 } });

        return (
          <>
            {/* Top Scaling Indicator (Frames 825 - 955) */}
            {frame < 960 && (
              <div className="absolute top-[8%] inset-x-0 flex justify-center">
                <div className="px-6 py-2.5 rounded-full bg-black/85 border border-emerald-400/60 backdrop-blur-md shadow-xl flex items-center gap-2.5">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <span className="text-xl font-mono font-black text-emerald-300 tracking-wider uppercase">
                    RAPID EXPANSION TIMELINE
                  </span>
                </div>
              </div>
            )}

            {/* Chest Zone: 2019 vs 2026 Expansion (Frames 860 - 959) */}
            {frame >= 860 && frame < 960 && (
              <div className="absolute bottom-[28%] inset-x-0 flex flex-col items-center gap-3.5 px-8">
                {/* Milestone 1: 2019 */}
                <div
                  className="w-full max-w-[800px]"
                  style={{
                    opacity: Math.min(1, spM1 * 1.5),
                    transform: `scale(${interpolate(spM1, [0, 1], [0.85, 1])})`,
                  }}
                >
                  <div className="p-4 px-6 rounded-2xl bg-black/90 border border-white/25 flex items-center justify-between shadow-xl backdrop-blur-md">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl font-black text-amber-400 font-mono">2019</span>
                      <span className="text-2xl font-black text-white">1ST SHOP IN LUCKNOW</span>
                    </div>
                    <span className="text-xl font-mono text-white/60">PILOT STORE</span>
                  </div>
                </div>

                {/* Milestone 2: 23+ Outlets */}
                {frame >= 920 && (
                  <div
                    className="w-full max-w-[800px]"
                    style={{
                      opacity: Math.min(1, spM2 * 1.5),
                      transform: `scale(${interpolate(spM2, [0, 1], [0.85, 1])})`,
                    }}
                  >
                    <div className="p-4 px-6 rounded-2xl bg-black/92 border-2 border-emerald-500/70 flex items-center justify-between shadow-xl backdrop-blur-md">
                      <div className="flex items-center gap-4">
                        <span className="text-3xl font-black text-emerald-400 font-mono">2026</span>
                        <span className="text-3xl font-black text-white">23+ LUXURY OUTLETS</span>
                      </div>
                      <span className="text-xl font-mono font-black text-emerald-400 uppercase px-3 py-1 bg-emerald-500/20 rounded-lg">
                        MULTI-CITY
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* B-ROLL 07: Google AI Overview Valuation Card (Frames 960 - 1060) */}
            {/* Host slides down by 360px during this beat */}
            <FacecamBRoll
              mediaSrc={staticFile("build_to_scale_thf/broll/valuation_overview.png")}
              startFrame={960}
              endFrame={1060}
              title="VALUATION RESEARCH • 2026"
              badgeIcon={<Search className="w-6 h-6 text-amber-400" />}
              calloutTag="₹250 CRORE"
              variant="card"
              mediaFit="contain"
            />
          </>
        );
      })()}

      {/* ========================================================================= */}
      {/* SCENE 5: THE BIG INSIGHT & OUTRO (Frames 1085 - 1322)                     */}
      {/* "Business ke liye new invention nahi chahiye... spot the problem!"        */}
      {/* ========================================================================= */}
      {frame >= 1085 && (() => {
        const spLesson1 = spring({ frame: frame - 1100, fps, config: { damping: 14, stiffness: 140 } });
        const spLesson2 = spring({ frame: frame - 1205, fps, config: { damping: 12, stiffness: 150 } });
        const spOutro = spring({ frame: frame - 1280, fps, config: { damping: 14, stiffness: 140 } });

        return (
          <>
            {/* Top Lesson Badge */}
            <div className="absolute top-[8%] inset-x-0 flex justify-center">
              <div className="px-6 py-2.5 rounded-full bg-black/85 border border-amber-400/60 backdrop-blur-md shadow-xl flex items-center gap-2.5">
                <Zap className="w-5 h-5 text-amber-400" />
                <span className="text-xl font-mono font-black text-amber-300 tracking-wider uppercase">
                  THE FOUNDER'S PLAYBOOK
                </span>
              </div>
            </div>

            {/* Chest Zone: Core Insight Cards (Frames 1100 - 1279) */}
            {frame < 1280 && (
              <div className="absolute bottom-[28%] inset-x-0 flex flex-col items-center gap-3.5 px-8">
                {/* Myth: No New Invention Needed (Frame 1100) */}
                <div
                  className="w-full max-w-[800px]"
                  style={{
                    opacity: frame >= 1100 ? Math.min(1, spLesson1 * 1.5) : 0,
                    transform: `scale(${frame >= 1100 ? interpolate(spLesson1, [0, 1], [0.85, 1]) : 0.85})`,
                  }}
                >
                  <div className="p-4 px-6 rounded-2xl bg-black/90 border border-rose-500/50 flex items-center justify-between shadow-xl backdrop-blur-md line-through text-white/60">
                    <span className="text-2xl font-black">NO NEW INVENTION NEEDED</span>
                    <span className="text-xl font-mono text-rose-400 font-bold uppercase">MYTH</span>
                  </div>
                </div>

                {/* Truth: Spot The Unnoticed Problem (Frame 1205) */}
                <div
                  className="w-full max-w-[800px]"
                  style={{
                    opacity: frame >= 1205 ? Math.min(1, spLesson2 * 1.5) : 0,
                    transform: `scale(${frame >= 1205 ? interpolate(spLesson2, [0, 1], [0.8, 1]) : 0.8})`,
                  }}
                >
                  <div className="p-5 px-7 rounded-2xl bg-black/95 border-3 border-emerald-400/80 shadow-[0_0_35px_rgba(16,185,129,0.35)] backdrop-blur-2xl flex items-center justify-between">
                    <div>
                      <div className="text-xl font-mono font-black text-emerald-300 uppercase">THE REAL SECRET</div>
                      <div className="text-3xl font-black text-white">NOTICE UNSEEN PROBLEMS</div>
                    </div>
                    <Sparkles className="w-8 h-8 text-emerald-400 shrink-0" />
                  </div>
                </div>
              </div>
            )}

            {/* Outro Call to Action (Frame 1280+) */}
            {frame >= 1280 && (
              <div
                className="absolute bottom-[28%] inset-x-0 flex justify-center px-8 transition-all"
                style={{
                  opacity: Math.min(1, spOutro * 1.5),
                  transform: `scale(${interpolate(spOutro, [0, 1], [0.85, 1])})`,
                }}
              >
                <div className="px-8 py-4 rounded-full bg-amber-400 text-black font-black text-2xl uppercase tracking-wider shadow-2xl flex items-center gap-3">
                  <span>BUILD TO SCALE • DAILY SECRETS</span>
                  <ArrowRight className="w-7 h-7 stroke-[3]" />
                </div>
              </div>
            )}
          </>
        );
      })()}

    </div>
  );
};
