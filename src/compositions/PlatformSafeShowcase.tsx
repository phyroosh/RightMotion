import React from "react";
import { staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { PlatformSafeOverlay } from "../components/safe_area/PlatformSafeOverlay";
import { SafeContent } from "../components/safe_area/SafeContent";
import { AlertCircle, Zap } from "lucide-react";
import "../style.css";

/**
 * 🎬 PlatformSafeShowcase
 *
 * Demonstrates the RightMotion Platform-Aware Safe Composition System:
 *   1. PLATFORM UI IS PART OF THE COMPOSITIONAL ENVIRONMENT
 *   2. Non-rendered / toggleable PlatformSafeOverlay showing YouTube Shorts UI wireframes
 *   3. Semantic element hierarchy: Critical, Important, Decorative
 *   4. Balanced positioning inside the recommended text & subject regions
 */
export const PlatformSafeShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  return (
    <div
      className="relative w-full h-full bg-[#f8fafc] text-slate-900 overflow-hidden font-sans select-none"
      style={{ width, height }}
    >
      {/* 1. DECORATIVE BACKGROUND (Allowed to bleed into caution/obstruction zones) */}
      <SafeContent
        importance="decorative"
        className="absolute inset-0 pointer-events-none opacity-40"
      >
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-200/50 to-pink-200/30 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[700px] h-[700px] rounded-full bg-gradient-to-tl from-emerald-200/40 to-cyan-200/30 blur-3xl" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(#090d16 1.5px, transparent 1.5px)",
            backgroundSize: "32px 32px",
          }}
        />
      </SafeContent>

      {/* 2. SCENE COMPOSITION — Padded cleanly at safeTop = 280px */}
      <div className="absolute inset-0 flex flex-col items-center justify-start px-8" style={{ paddingTop: 280 }}>
        {/* CRITICAL ELEMENT 1: Primary Headline Card (Clears top navigation 0-240px) */}
        <SafeContent importance="critical" className="w-full max-w-[800px] flex flex-col items-center">
          <div className="w-full p-5 rounded-3xl bg-white border-[2.5px] border-slate-900 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.16)] flex flex-col items-center text-center gap-1.5">
            <span className="font-mono text-[20px] font-black text-indigo-600 tracking-widest uppercase">
              PLATFORM-AWARE COMPOSITION
            </span>
            <h1 className="text-[50px] font-black text-[#090d16] tracking-tight uppercase leading-tight">
              SAFE AREA ARCHITECTURE
            </h1>
          </div>
        </SafeContent>

        {/* CRITICAL ELEMENT 2: Visual Metaphor in Optical Focal Center */}
        <SafeContent importance="critical" className="relative w-full max-w-[780px] flex flex-col items-center justify-center my-4">
          <div className="relative flex flex-col items-center justify-center">
            {/* Ambient halo glow */}
            <div
              className="absolute pointer-events-none rounded-full"
              style={{
                width: 480,
                height: 480,
                background:
                  "radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%)",
              }}
            />
            <img
              src={staticFile("assets/psychology/hyperrealistic_3d_glowing_brain.png")}
              alt="3D Neural Brain"
              className="w-[450px] h-auto object-contain drop-shadow-[0_32px_50px_rgba(0,0,0,0.22)]"
            />

            {/* Focal Tag: Threat Status */}
            <div className="absolute top-[48%] -translate-y-1/2 px-7 py-3 rounded-3xl bg-emerald-600 text-white border-[3px] border-slate-950 shadow-2xl flex items-center gap-3 rotate-[-2deg]">
              <Zap className="w-7 h-7 text-amber-300" />
              <div className="flex flex-col text-left">
                <span className="font-mono text-[15px] font-black text-emerald-200 uppercase tracking-widest">
                  SHORTS SAFE ZONE
                </span>
                <span className="text-[30px] font-black tracking-tight uppercase leading-none">
                  100% CLEAR
                </span>
              </div>
            </div>
          </div>
        </SafeContent>

        {/* IMPORTANT ELEMENT: Supporting Metrics (Sits cleanly above captions, clears right rail) */}
        <SafeContent importance="important" className="w-full max-w-[780px] p-5 rounded-3xl bg-white border-[2.5px] border-slate-900 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.14)] flex items-center justify-between mt-1">
          <div className="flex flex-col">
            <span className="font-mono text-[17px] font-bold text-slate-500 uppercase">
              UI COLLISION STATUS
            </span>
            <span className="text-[28px] font-black text-[#090d16] uppercase">
              ZERO FEED OVERLAP
            </span>
          </div>
          <div className="px-5 py-2 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center gap-2">
            <span className="font-mono text-[20px] font-black text-emerald-700">
              OPTIMAL (9:16)
            </span>
          </div>
        </SafeContent>
      </div>

      {/* 3. SIMULATED CAPTIONS (At y: 1400px / bottom: 19%) */}
      <div className="absolute inset-x-0 bottom-[19%] flex items-end justify-center pointer-events-none z-40 px-8">
        <div className="flex items-center justify-center max-w-[840px] px-6 py-3 rounded-3xl bg-white/85 border border-slate-200/80 backdrop-blur-md shadow-xl text-center">
          <span className="text-[44px] font-black tracking-tight text-slate-900 uppercase">
            Platform UI Is Part Of The Canvas
          </span>
        </div>
      </div>

      {/* 4. VISUAL PLATFORM OVERLAY (Set visible={true} to demonstrate composition guide) */}
      <PlatformSafeOverlay platform="YOUTUBE_SHORTS" visible={true} showDetails={true} />
    </div>
  );
};
