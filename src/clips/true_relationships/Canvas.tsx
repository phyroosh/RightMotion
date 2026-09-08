import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { PhysicalCard } from "../../components/physics/PhysicalCard";
import { TapeStrip } from "../../components/collage/TapeStrip";
import { ProCutout } from "../../components/ProCutout";
import { ProductPageShowcase } from "../../components/ProductPageShowcase";
import { CinematicIllustrationCard } from "../../components/CinematicIllustrationCard";
import { InteractiveEngagementPill } from "../../components/InteractiveEngagementPill";
import { TacticalMemeCard, TacticalMemeFrame } from "../../components/TacticalMemeCard";
import { ConceptKeywordSlam } from "../../components/ConceptKeywordSlam";
import { MemeStickerOverlay } from "../../components/MemeStickerOverlay";
import { Sparkles, Zap, ArrowRight } from "lucide-react";
import { WordTimestamp } from "../../types";

interface CanvasProps {
  transcript: WordTimestamp[];
}

export const TrueRelationshipsCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-8 select-none">
      {/* ======================================================== */}
      {/* SCENE 1: THE ROOT FRICTION & HOOK (Frames 0 - 217) */}
      {/* ======================================================== */}
      {frame >= 0 && frame < 217 && (
        <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
          <CinematicIllustrationCard
            imageSrc="true_relationships/assets/scene_illustration.png"
            accentColor="blue"
            entranceFrame={0}
            beats={[
            {
                        "frame": 91,
                        "type": "callout",
                        "text": "ONLINE REALITY",
                        "subtext": "Psychologists call this Curated Distortion.",
                        "position": "top-right",
                        "icon": "target",
                        "color": "blue",
                        "zoomLevel": 1.15,
                        "targetX": 50,
                        "targetY": 40
            },
            {
                        "frame": 164,
                        "type": "stamp",
                        "text": "SUBCONSCIOUS PARALYSIS",
                        "subtext": "COGNITIVE OVERLOAD",
                        "position": "bottom-left",
                        "icon": "alert",
                        "color": "rose"
            }
]}
            width={920}
            height={520}
            tiltX={3}
            tiltY={-3}
          />
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 2A: HIGH-IMPACT CONCEPT KEYWORD SLAM              */}
      {/* (Frames 217 - 292)             */}
      {/* ======================================================== */}
      {frame >= 217 && frame < 292 && (
        <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-150">
          <ConceptKeywordSlam
            term="CURATED DISTORTION"
            definition="Your brain judges real-life intimacy against highlight reels, mistaking quiet consistency for a lack of passion"
            categoryBadge="PSYCHOLOGICAL MECHANISM // 01"
            entranceFrame={217}
            durationFrames={75}
            theme="apple_studio"
            icon="brain"
            width={920}
          />
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 2B: THE BREAKDOWN (REVEALED ONE-BY-ONE AS SPOKEN!)  */}
      {/* (Frames 292 - 527)                     */}
      {/* ======================================================== */}
      {frame >= 292 && frame < 527 && (() => {
        const spP1 = spring({ frame: frame - 292, fps, config: { damping: 13, stiffness: 140 } });
        const spP2 = spring({ frame: frame - 403, fps, config: { damping: 13, stiffness: 140 } });

        return (
          <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
            <div className="relative w-full max-w-[920px]">
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                <TapeStrip position="center-top" width={180} height={48} enableWobble />
              </div>

              <PhysicalCard
                tiltX={-5}
                tiltY={4}
                elevation={44}
                impactMs={9733}
                className="w-full p-8 rounded-3xl bg-white/95 border-2 border-sky-300/60 shadow-2xl backdrop-blur-md flex flex-col items-center text-center gap-6"
              >
                {/* Clean Uncrowded Section Header - NO RAW TOPIC LEAKS */}
                <div className="text-center mt-1">
                  <h2 className="text-5xl font-black text-slate-950 leading-tight uppercase tracking-tight">
                    SOCIAL MEDIA TRAP
                  </h2>
                  <div className="text-2xl font-mono text-[#0071e3] font-bold mt-1 tracking-wider uppercase">
                    Why It Destroys Teen Focus
                  </div>
                </div>

                {/* PROGRESSIVE SEQUENTIAL REVEALS: ONE BY ONE ON EXACT WORDS */}
                <div className="flex flex-col gap-4 w-full my-1">
                  
                {/* Progressive Item 1 (Spoken Frame: 292) */}
                <div
                  style={{
                    opacity: frame >= 292 ? Math.min(1, spP1 * 1.2) : 0,
                    transform: `scale(${frame >= 292 ? interpolate(spP1, [0, 1], [0.8, 1]) : 0.8}) translateY(${frame >= 292 ? interpolate(spP1, [0, 1], [25, 0]) : 25}px)`,
                    pointerEvents: frame >= 292 ? "auto" : "none",
                  }}
                >
                  <div className="p-4 rounded-2xl bg-slate-50/90 border border-sky-200/80 flex items-center justify-between text-left shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#0071e3]/15 text-[#0071e3] flex items-center justify-center text-3xl font-black font-mono shrink-0">
                        01
                      </div>
                      <div>
                        <div className="text-3xl font-black text-slate-950">
                          Your brain judges real-life intimacy against highlight reels, mistaking quiet consistency for a lack of passion.
                        </div>
                        
                      </div>
                    </div>
                  </div>
                </div>
                {/* Progressive Item 2 (Spoken Frame: 403) */}
                <div
                  style={{
                    opacity: frame >= 403 ? Math.min(1, spP2 * 1.2) : 0,
                    transform: `scale(${frame >= 403 ? interpolate(spP2, [0, 1], [0.8, 1]) : 0.8}) translateY(${frame >= 403 ? interpolate(spP2, [0, 1], [25, 0]) : 25}px)`,
                    pointerEvents: frame >= 403 ? "auto" : "none",
                  }}
                >
                  <div className="p-4 rounded-2xl bg-slate-50/90 border border-sky-200/80 flex items-center justify-between text-left shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#0071e3]/15 text-[#0071e3] flex items-center justify-center text-3xl font-black font-mono shrink-0">
                        02
                      </div>
                      <div>
                        <div className="text-3xl font-black text-slate-950">
                          Healthy love is private, unglamorous, and boring to an algorithm.
                        </div>
                        
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              </PhysicalCard>
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* SCENE 3: SOLUTION PROTOCOL / PRODUCT SHOWCASE (Frames 527 - 598) */}
      {/* ======================================================== */}
      {frame >= 527 && (() => {
        const spSolCutout = spring({ frame: frame - 527, fps, config: { damping: 13, stiffness: 140 } });
        const spFinale = spring({ frame: frame - 660, fps, config: { damping: 13, stiffness: 140 } });

        return (
          <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
            <div className="relative w-full max-w-[920px]">
              <div className="absolute -top-7 left-8 z-30 pointer-events-none">
                <TapeStrip position="top-left" width={180} height={48} enableWobble />
              </div>

              <PhysicalCard
                tiltX={3}
                tiltY={-3}
                elevation={45}
                impactMs={17567}
                className="w-full p-8 rounded-3xl bg-white/95 border-2 border-sky-300/60 shadow-2xl backdrop-blur-md flex flex-col items-center text-center gap-6"
              >
                <h3 className="text-5xl font-black text-slate-950 leading-tight mt-1">
                  Be honest: has scrolling ever made you question an otherwise good relationship?
                </h3>

                <div
                  className="w-full flex justify-center items-center my-2 transition-all"
                  style={{
                    opacity: frame >= 527 ? Math.min(1, spSolCutout * 1.2) : 0,
                    transform: `scale(${frame >= 527 ? interpolate(spSolCutout, [0, 1], [0.6, 1]) : 0.6}) translateY(${frame >= 527 ? interpolate(spSolCutout, [0, 1], [30, 0]) : 30}px)`,
                    pointerEvents: frame >= 527 ? "auto" : "none",
                  }}
                >
                  <ProCutout
                    assetId="hyperrealistic_3d_glowing_brain"
                    glowColor="amber"
                    animation="stamp_impact"
                    width={420}
                    height={320}
                    ghostText="REWIRE"
                  />
                </div>

                <div
                  className="w-full transition-all"
                  style={{
                    opacity: frame >= 660 ? Math.min(1, spFinale * 1.2) : 0,
                    transform: `scale(${frame >= 660 ? interpolate(spFinale, [0, 1], [0.8, 1]) : 0.8})`,
                    pointerEvents: frame >= 660 ? "auto" : "none",
                  }}
                >
                  <div className="w-full p-5 rounded-2xl bg-black/60 border border-emerald-500/30 flex items-center justify-center gap-3 text-3xl font-black text-[#0071e3] shadow-xl">
                    <Sparkles className="w-7 h-7 text-emerald-400 shrink-0" />
                    <span>Tell me below.</span>
                  </div>
                </div>
              </PhysicalCard>
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* ON-SCREEN INTERACTIVE ENGAGEMENT PILL (Seconds 18–22)    */}
      {/* ======================================================== */}
      <InteractiveEngagementPill
        entranceFrame={471}
        durationFrames={105}
        prompt="Mistaken anxiety for chemistry? Tell me below 👇"
        tag="CONFESSION"
        icon="brain"
        theme="apple_studio"
      />
      
      {/* ======================================================== */}
      {/* TACTICAL RETENTION MEME POP (< 2.5s Strict Cap)          */}
      {/* ======================================================== */}
      <TacticalMemeCard
        memeId="courtroom_shout_me"
        startFrame={0}
        durationFrames={44}
        playbackRate={1.4}
        hudLabel="SELF-CONFESSION // GUILTY AS CHARGED"
        theme="apple_studio"
        position="top"
      />

      {/* ======================================================== */}
      {/* MID-VIDEO GEN-Z MEME REACTION STICKERS                   */}
      {/* ======================================================== */}
      <MemeStickerOverlay
        stickerId="verne_turtle_shock"
        startFrame={335}
        durationFrames={36}
        position="bottom-right"
        badgeText="LIVE REACTION"
      />
      <MemeStickerOverlay
        stickerId="anya_smug"
        startFrame={455}
        durationFrames={34}
        position="top-right"
        badgeText="HEH 𓁹‿𓁹"
      />

    </div>
  );
};
