import React from "react";
import { getPlatformProfile } from "../../platform/profiles";
import { PlatformType } from "../../platform/types";

interface PlatformSafeOverlayProps {
  platform?: PlatformType;
  visible?: boolean;
  showDetails?: boolean;
}

/**
 * 🎬 PlatformSafeOverlay
 *
 * Visual composition guide overlay for 9:16 vertical videos.
 * Displays:
 *   - [ PLATFORM UI ] obstruction zones (Top navigation, right rail buttons, bottom metadata)
 *   - [ CAUTION ] zones (Device variations, captions reserved zone)
 *   - [ SAFE AREA ] guaranteed primary content bounds
 *   - [ PREFERRED FOCAL ] mobile optical eye-level focus
 *
 * NOTE: Non-rendered during final production exports by default unless visible={true}
 * or REMOTION_SAFE_OVERLAY=1.
 */
export const PlatformSafeOverlay: React.FC<PlatformSafeOverlayProps> = ({
  platform = "YOUTUBE_SHORTS",
  visible = false,
  showDetails = true,
}) => {
  // Check if overlay is enabled via prop or environment flag
  const isEnabled =
    visible ||
    (typeof process !== "undefined" &&
      process.env &&
      process.env.REMOTION_SAFE_OVERLAY === "1");

  if (!isEnabled) {
    return null;
  }

  const profile = getPlatformProfile(platform);
  const { canvas, obstructionZones, cautionZones, recommendedTextRegion, preferredFocalRegion, safeInsets } =
    profile;

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none z-[9999] overflow-hidden font-mono"
      style={{ width: canvas.width, height: canvas.height }}
    >
      {/* 1. OBSTRUCTION ZONES (Red / Magenta translucent) */}
      {obstructionZones.map((zone) => (
        <div
          key={zone.id}
          className="absolute bg-rose-500/15 border-2 border-rose-500/60 backdrop-blur-[1px] flex flex-col justify-center items-center text-rose-500 px-4 py-2 text-center"
          style={{
            left: zone.bounds.x,
            top: zone.bounds.y,
            width: zone.bounds.width,
            height: zone.bounds.height,
          }}
        >
          <div className="bg-slate-950/85 text-rose-400 border border-rose-500/50 px-3 py-1 rounded-md text-[18px] font-black tracking-wider uppercase shadow-lg">
            ⛔ {zone.name}
          </div>
          {showDetails && (
            <span className="text-[13px] text-rose-300/90 max-w-[80%] mt-1 leading-snug drop-shadow-md">
              {zone.description}
            </span>
          )}
        </div>
      ))}

      {/* 2. CAUTION ZONES (Amber translucent dashed) */}
      {cautionZones.map((zone) => (
        <div
          key={zone.id}
          className="absolute bg-amber-500/10 border-2 border-dashed border-amber-400/60 flex flex-col justify-center items-center text-amber-400 px-4 py-1 text-center"
          style={{
            left: zone.bounds.x,
            top: zone.bounds.y,
            width: zone.bounds.width,
            height: zone.bounds.height,
          }}
        >
          <div className="bg-slate-950/80 text-amber-300 border border-amber-400/40 px-2.5 py-0.5 rounded text-[15px] font-bold tracking-wider uppercase shadow-md">
            ⚠️ {zone.name}
          </div>
        </div>
      ))}

      {/* 3. PRIMARY SAFE AREA (Crisp Emerald Border) */}
      <div
        className="absolute border-[3px] border-emerald-400/80 rounded-2xl pointer-events-none shadow-[0_0_20px_rgba(52,211,153,0.2)]"
        style={{
          left: safeInsets.left,
          top: safeInsets.top,
          width: canvas.width - safeInsets.left - safeInsets.right,
          height: canvas.height - safeInsets.top - safeInsets.bottom,
        }}
      >
        <div className="absolute top-2 left-3 bg-emerald-950/90 text-emerald-400 border border-emerald-400/60 px-2.5 py-0.5 rounded text-[14px] font-black uppercase tracking-wider">
          ✓ SAFE AREA (CRITICAL CONTENT)
        </div>
      </div>

      {/* 4. RECOMMENDED TEXT REGION (Cyan outline) */}
      <div
        className="absolute border border-cyan-400/50 border-dotted rounded-xl pointer-events-none"
        style={{
          left: recommendedTextRegion.x,
          top: recommendedTextRegion.y,
          width: recommendedTextRegion.width,
          height: recommendedTextRegion.height,
        }}
      >
        <div className="absolute bottom-2 right-3 text-cyan-400 text-[12px] font-bold uppercase bg-slate-950/80 px-2 py-0.5 rounded">
          TEXT BOUNDS
        </div>
      </div>

      {/* 5. PREFERRED FOCAL REGION (Gold optical center reticle) */}
      <div
        className="absolute border-2 border-amber-300/40 rounded-3xl pointer-events-none flex items-center justify-center"
        style={{
          left: preferredFocalRegion.x,
          top: preferredFocalRegion.y,
          width: preferredFocalRegion.width,
          height: preferredFocalRegion.height,
        }}
      >
        <div className="bg-slate-950/85 text-amber-300 border border-amber-300/50 px-3 py-1 rounded-full text-[14px] font-black uppercase tracking-widest shadow-md">
          🎯 OPTICAL FOCAL CENTER
        </div>
      </div>

      {/* 6. MOCK WIREFRAME ICONS FOR YOUTUBE SHORTS (Helps human visually verify button alignments) */}
      {platform === "YOUTUBE_SHORTS" && (
        <div className="absolute right-6 top-[720px] flex flex-col items-center gap-7 text-white/50 pointer-events-none">
          {/* Like */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full border-2 border-white/40 flex items-center justify-center text-[18px]">
              👍
            </div>
            <span className="text-[12px] font-bold">128K</span>
          </div>
          {/* Dislike */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full border-2 border-white/40 flex items-center justify-center text-[18px]">
              👎
            </div>
            <span className="text-[12px] font-bold">Dislike</span>
          </div>
          {/* Comments */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full border-2 border-white/40 flex items-center justify-center text-[18px]">
              💬
            </div>
            <span className="text-[12px] font-bold">1,420</span>
          </div>
          {/* Share */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full border-2 border-white/40 flex items-center justify-center text-[18px]">
              ↗️
            </div>
            <span className="text-[12px] font-bold">Share</span>
          </div>
          {/* Remix */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full border-2 border-white/40 flex items-center justify-center text-[18px]">
              ⚡
            </div>
            <span className="text-[12px] font-bold">Remix</span>
          </div>
          {/* Sound spinning disc */}
          <div className="w-11 h-11 rounded-full border-2 border-white/60 bg-slate-900 flex items-center justify-center text-[14px]">
            🎵
          </div>
        </div>
      )}

      {/* Platform Badge indicator top-left */}
      <div className="absolute top-4 left-4 bg-slate-950/90 text-white border border-slate-700 px-3.5 py-1.5 rounded-lg text-[15px] font-bold flex items-center gap-2.5 shadow-xl">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
        <span>GUIDE: {profile.displayName} (9:16)</span>
      </div>
    </div>
  );
};
