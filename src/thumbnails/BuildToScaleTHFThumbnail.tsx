import React from "react";
import { Img, staticFile } from "remotion";
import { Sparkles, TrendingUp, Zap } from "lucide-react";
import { TapeStrip } from "../components/collage/TapeStrip";

export const BuildToScaleTHFThumbnail: React.FC = () => {
  return (
    <div className="relative w-[1080px] h-[1920px] bg-[#030712] overflow-hidden select-none font-sans">
      {/* 1. Background Real Creator Still */}
      <div className="absolute inset-0 w-full h-full">
        <Img
          src={staticFile("build_to_scale_thf/speaker_still.png")}
          className="w-full h-full object-cover scale-105"
        />
        {/* Cinematic Vignette & Rich Color Grading Overlays */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 38%, rgba(0,0,0,0) 35%, rgba(3, 7, 18, 0.6) 70%, rgba(3, 7, 18, 0.95) 100%)",
          }}
        />
        <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-black/90 via-black/50 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-[700px] bg-gradient-to-t from-black via-black/85 to-transparent pointer-events-none" />
      </div>

      {/* 2. Top Header HUD */}
      <div className="absolute top-12 left-12 right-12 z-20 flex justify-between items-center">
        {/* Category Badge */}
        <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-black/85 border-2 border-amber-400/80 backdrop-blur-xl shadow-2xl">
          <Zap className="w-7 h-7 text-amber-400" />
          <span className="text-2xl font-mono font-black text-amber-300 uppercase tracking-wider">
            BUILD TO SCALE • FACECAM
          </span>
        </div>

        {/* Case Study Badge */}
        <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400/60 backdrop-blur-md">
          <TrendingUp className="w-6 h-6 text-emerald-400" />
          <span className="text-2xl font-mono font-black text-emerald-300 uppercase">
            CASE STUDY
          </span>
        </div>
      </div>

      {/* 3. Chest Zone Hook Card (Positioned comfortably below speaker's chin & eyes) */}
      <div className="absolute bottom-[17%] left-10 right-10 z-20 flex flex-col items-center text-center">
        <div className="relative w-full max-w-[960px]">
          <div className="absolute -top-7 left-12 pointer-events-none z-30">
            <TapeStrip position="top-left" width={180} height={46} />
          </div>

          <div className="p-8 px-10 rounded-3xl bg-black/95 border-4 border-amber-400/90 shadow-[0_0_70px_rgba(251,191,36,0.45)] backdrop-blur-2xl flex flex-col items-center gap-3">
            <div className="text-3xl font-mono font-black text-amber-300 uppercase tracking-widest">
              LUCKNOW HOTEL ➔ LUXURY CHAIN
            </div>
            <h1 className="text-7xl font-black text-white uppercase tracking-tight leading-none">
              THE <span className="text-emerald-400">₹131 CRORE</span>
              <br />
              <span className="text-amber-400">SECRET</span>
            </h1>
            <div className="text-2xl font-mono font-black text-white/90 mt-1 uppercase tracking-wide">
              23+ Outlets • ₹250 Cr Valuation
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Footer Proof Bar */}
      <div className="absolute bottom-8 left-10 right-10 z-20 flex items-center justify-between">
        <div className="flex items-center gap-4 p-4 px-6 rounded-2xl bg-black/90 border border-white/25 backdrop-blur-md shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-amber-400/20 flex items-center justify-center text-amber-400 text-3xl font-black font-mono">
            01
          </div>
          <div>
            <div className="text-2xl font-black text-white">THE TEA & BAKERY GAP</div>
            <div className="text-xl font-mono font-bold text-amber-300">3-in-1 Unified Store</div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-emerald-950/90 border-2 border-emerald-400/80 shadow-[0_0_30px_rgba(16,185,129,0.35)] backdrop-blur-md">
          <Sparkles className="w-8 h-8 text-emerald-400" />
          <span className="text-2xl font-black text-emerald-300 uppercase">
            SCALE FORMULA
          </span>
        </div>
      </div>
    </div>
  );
};
