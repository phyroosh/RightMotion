import React from "react";
import { interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { WordTimestamp } from "../../types";
import {
  CinematicDepthWorld,
  WorldDepthEntity,
  ForegroundOccluder,
  RackFocus,
  WorldWaypoint,
} from "../../components/camera3d";
import { AnimatedSlashStrike, KineticHighlighter } from "../../components/kinetic_text";
import { CinematicIllustrationCard } from "../../components/CinematicIllustrationCard";

interface CanvasProps {
  transcript: WordTimestamp[];
}

// 🎥 Motivated Chronological Camera Flight Path
const WORLD_WAYPOINTS: WorldWaypoint[] = [
  // Waypoint 0: Chamber 1 (The Doorway Premise)
  { frame: 0, x: 0, y: 0, zoom: 1.0 },
  // Waypoint 1: Motivated Dolly right into Chamber 2 (The Event Boundary)
  { frame: 240, x: 1400, y: 0, zoom: 1.05, durationFrames: 45, transitionType: "smooth" },
  // Waypoint 2: Hold at Chamber 2 for Rack Focus & Breakdown
  { frame: 460, x: 1400, y: 0, zoom: 1.05 },
  // Waypoint 3: Motivated Vertical Plunge down into Chamber 3 (Environmental Foundation)
  { frame: 520, x: 1400, y: 1500, zoom: 1.06, durationFrames: 40, transitionType: "smooth" },
  // Waypoint 4: Hold at Chamber 3 for Resolution
  { frame: 580, x: 1400, y: 1500, zoom: 1.08 },
  // Waypoint 5: Grand Macro Spatial Pull-Back revealing entire interconnected architecture
  { frame: 640, x: 700, y: 750, zoom: 0.34, durationFrames: 45, transitionType: "smooth" },
];

/**
 * 🎬 TheThresholdEffectCanvas
 * Frontier #3: Cinematic Camera Language + Depth Prototype.
 * 
 * Implements:
 * - 3-Plane Depth Stratification (Foreground Z > 0, Midground Z = 0, Deep Background Z < 0)
 * - Near-Lens Foreground Occlusion (Doorway Arch & Vertical Monolithic Pillar)
 * - Motivated Dolly Wipe (Physical doorway wipes the camera during lateral traversal)
 * - Perceptual Rack-Focus Selective Attention (Foreground memory purge vs Midground system)
 * - Macro Architectural Pull-Back revealing complete spatial topology
 */
export const TheThresholdEffectCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Deterministic frame-driven pulses (replaces wall-clock CSS keyframes)
  const dotPulse = 0.45 + 0.55 * Math.sin(frame * 0.2);
  const alertPulse = 0.6 + 0.4 * Math.sin(frame * 0.35);

  // Progressive conduit energy fills
  const conduit1Progress = interpolate(frame, [170, 230], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const conduit2Progress = interpolate(frame, [470, 520], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Rack focus states:
  // Between frames 318 and 390 ("working memory dumps the previous room"): Focus on Foreground!
  // At frame 415+ ("blinds you to the system ahead"): Focus pulls BACK to Midground!
  const isForegroundFocused = frame >= 315 && frame < 410;

  return (
    <CinematicDepthWorld
      waypoints={WORLD_WAYPOINTS}
      breathHolds={[
        { startFrame: 330, durationFrames: 20 }, // Dramatic freeze during working memory purge
      ]}
      impacts={[
        { frame: 235, intensity: 10, durationFrames: 8 },  // Dolly arrival in Chamber 2
        { frame: 445, intensity: 14, durationFrames: 10 }, // Blade strike on resistance
        { frame: 520, intensity: 12, durationFrames: 10 }, // Vertical plunge impact in Chamber 3
      ]}
      showGrid={true}
      className="font-sans"
    >
      {/* ======================================================== */}
      {/* SPATIAL CONDUITS: PHYSICAL LINKS BETWEEN CHAMBERS        */}
      {/* ======================================================== */}
      {/* Conduit 01: Horizontal line from Chamber 1 -> Chamber 2 */}
      <div
        className="absolute h-[3px] bg-slate-300 pointer-events-none z-10"
        style={{ left: "480px", top: "0px", width: "540px" }}
      >
        <div
          className="h-full bg-sky-500 shadow-[0_0_12px_rgba(14,165,233,0.8)]"
          style={{ width: `${conduit1Progress * 100}%` }}
        />
        <div className="absolute top-3 left-1/2 -translate-x-1/2 font-mono text-[14px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
          CONDUIT_01 // 1400PX THRESHOLD TRAVERSAL
        </div>
      </div>

      {/* Conduit 02: Vertical line from Chamber 2 -> Chamber 3 */}
      <div
        className="absolute w-[3px] bg-slate-300 pointer-events-none z-10"
        style={{ left: "1400px", top: "500px", height: "500px" }}
      >
        <div
          className="w-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]"
          style={{ height: `${conduit2Progress * 100}%` }}
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-[14px] font-bold text-slate-400 uppercase tracking-widest rotate-90 whitespace-nowrap">
          CONDUIT_02 // 1500PX FOUNDATION PLUNGE
        </div>
      </div>

      {/* ======================================================== */}
      {/* LAYER 1: FOREGROUND OCCLUDERS (Z > 0, 1.55x PARALLAX)    */}
      {/* ======================================================== */}
      {/* Foreground Doorway Arch stationed along Conduit 01 ([700, 0]) */}
      {/* As camera dollies right from Chamber 1 -> Chamber 2, this sweeps across the lens creating a motivated portal wipe! */}
      <WorldDepthEntity
        worldX={700}
        worldY={0}
        width={1100}
        height={1920}
        depth="foreground"
        startFrame={175}
        endFrame={255}
      >
        <ForegroundOccluder
          type="doorway_arch"
          width={1100}
          height={1920}
          apertureWidth={780}
          apertureHeight={1700}
          color="#090d16"
          label="EVENT BOUNDARY // PORTAL 01"
        />
      </WorldDepthEntity>

      {/* Foreground Vertical Structural Pillar between Chamber 2 and 3 */}
      {/* Passes rapidly across the camera during the 1500px vertical dive */}
      <WorldDepthEntity
        worldX={1340}
        worldY={650}
        width={180}
        height={800}
        depth="foreground"
        startFrame={475}
        endFrame={518}
      >
        <ForegroundOccluder
          type="monolithic_pillar"
          width={180}
          height={800}
          color="#0f172a"
          label="STRUCTURAL PILLAR // LEVEL -01"
        />
      </WorldDepthEntity>

      {/* ======================================================== */}
      {/* CHAMBER 1: THE INVISIBLE DOORWAY (World: [0, 0])         */}
      {/* "You don't stall because you're lazy..."                 */}
      {/* ======================================================== */}
      <WorldDepthEntity worldX={0} worldY={0} width={960} height={1300} depth="midground">
        <div className="w-full h-full flex flex-col items-center justify-start pt-12">
          {/* Sector Badge */}
          <div className="px-5 py-2 rounded-2xl bg-white border-[2.5px] border-slate-900 shadow-md mb-6 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-sky-500" style={{ opacity: dotPulse }} />
            <span className="font-mono text-[22px] font-black text-slate-900 tracking-wider uppercase">
              SECTOR 01 // THE THRESHOLD PREMISE
            </span>
          </div>

          {/* Part 1A: Hero Illustration Card (Frames 0 -> 75) */}
          {frame < 78 && (
            <div
              className="w-full flex flex-col items-center"
              style={{
                opacity: interpolate(frame, [68, 76], [1, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              <h1 className="font-sans text-[68px] font-black text-slate-950 tracking-tight text-center leading-[1.05] uppercase mb-6">
                INVISIBLE DOORWAY
              </h1>
              <CinematicIllustrationCard
                imageSrc={staticFile("the_threshold_effect/assets/scene_illustration.png")}
                width={920}
                height={520}
              />
            </div>
          )}

          {/* Part 1B: The Tangled Confusion Knot (Frames 75 -> 180) */}
          {frame >= 74 && (
            <div
              className="w-full flex flex-col items-center text-center"
              style={{
                opacity: interpolate(frame, [74, 82], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                transform: `translateY(${interpolate(frame, [74, 84], [24, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })}px)`,
              }}
            >
              <h2 className="font-sans text-[64px] font-black text-slate-950 uppercase tracking-tight mb-4">
                EVERY TASK IS A ROOM
              </h2>

              {/* Editorial Card framed through the foreground doorway */}
              <div className="w-[780px] p-8 rounded-3xl bg-white border-[2.5px] border-slate-900 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.16)] flex flex-col items-center">
                <img
                  src={staticFile("assets/psychology/tangled_confusion_chaos.png")}
                  alt="Tangled Mental Friction"
                  className="w-[420px] h-auto object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.2)] mb-4"
                />
                <span className="font-mono text-[20px] font-bold text-slate-500 uppercase tracking-widest">
                  COGNITIVE PERCEPTION // PHYSICAL BOUNDARY
                </span>
              </div>
            </div>
          )}
        </div>
      </WorldDepthEntity>

      {/* ======================================================== */}
      {/* CHAMBER 2: THE EVENT BOUNDARY & RACK FOCUS ([1400, 0])   */}
      {/* "In psychology, it's called the Event Boundary..."       */}
      {/* ======================================================== */}
      <WorldDepthEntity worldX={1400} worldY={0} width={960} height={1300} depth="midground">
        <RackFocus
          isFocused={!isForegroundFocused}
          blurAmount={5}
          defocusedOpacity={0.5}
          className="w-full h-full flex flex-col items-center justify-start pt-12"
        >
          {/* Sector Badge */}
          <div className="px-5 py-2 rounded-2xl bg-white border-[2.5px] border-slate-900 shadow-md mb-6 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-amber-500" style={{ opacity: dotPulse }} />
            <span className="font-mono text-[22px] font-black text-slate-900 tracking-wider uppercase">
              SECTOR 02 // EVENT BOUNDARY PROTOCOL
            </span>
          </div>

          <h2 className="font-sans text-[62px] font-black text-slate-950 uppercase tracking-tight text-center leading-[1.08] mb-6">
            COGNITIVE DUMP
          </h2>

          {/* Sequential Telemetry & System Blocks */}
          <div className="w-[840px] flex flex-col gap-4">
            {/* Block 1: Working memory resets */}
            {frame >= 265 && (
              <div
                className="w-full p-6 rounded-3xl bg-white border-[2.5px] border-slate-900 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.14)] flex items-center justify-between"
                style={{
                  transform: `translateY(${interpolate(frame, [265, 275], [25, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
                }}
              >
                <div className="flex flex-col">
                  <span className="font-mono text-[18px] font-black text-rose-600 uppercase tracking-wider">
                    CRITICAL FLUSH // MEMORY PURGED
                  </span>
                  <span className="font-sans text-[36px] font-black text-slate-950 uppercase mt-1">
                    PREVIOUS ROOM ERASED
                  </span>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-rose-50 border-[2px] border-rose-300 flex items-center justify-center font-mono font-black text-rose-600 text-2xl">
                  0%
                </div>
              </div>
            )}

            {/* Block 2: Contradiction & Animated Slash Strike */}
            {frame >= 380 && (
              <div
                className="relative w-full p-6 rounded-3xl bg-white border-[2.5px] border-slate-900 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.14)] flex items-center justify-between overflow-hidden"
                style={{
                  transform: `translateY(${interpolate(frame, [380, 390], [25, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
                }}
              >
                <div className="flex flex-col">
                  <span className="font-mono text-[18px] font-bold text-slate-500 uppercase tracking-wider">
                    PERCEIVED BARRIER
                  </span>
                  <div className="relative inline-block mt-1">
                    {/* Live Marker Strike slicing across the text at frame 445 */}
                    <AnimatedSlashStrike
                      startFrame={445}
                      color="rose"
                      strokeWidth={7}
                      angle={-6}
                    >
                      <span className="font-sans text-[38px] font-black text-slate-950 uppercase tracking-tight">
                        INTERNAL RESISTANCE
                      </span>
                    </AnimatedSlashStrike>
                  </div>
                </div>

                {frame >= 448 && (
                  <div className="px-4 py-2 rounded-xl bg-slate-950 text-white font-mono text-[16px] font-black uppercase">
                    FALSE SIGNAL
                  </div>
                )}
              </div>
            )}
          </div>
        </RackFocus>
      </WorldDepthEntity>

      {/* Foreground Rack Focus Target: Floating HUD Lens Panel (Z > 0) */}
      {/* When active (frames 315-410), pulls viewer attention to the foreground friction */}
      <WorldDepthEntity
        worldX={1400}
        worldY={170}
        width={780}
        height={220}
        depth="foreground"
        startFrame={280}
        endFrame={430}
      >
        <RackFocus
          isFocused={isForegroundFocused}
          blurAmount={6}
          defocusedOpacity={0.4}
          className="w-full h-full"
        >
          <div
            className="w-full h-full rounded-3xl p-6 flex items-center justify-between border-[2.5px] border-rose-500"
            style={{
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 241, 242, 0.92) 100%)",
              boxShadow: "0 28px 56px -12px rgba(244, 63, 94, 0.28), 0 0 0 1px rgba(244, 63, 94, 0.15)",
              opacity: interpolate(frame, [280, 292, 410, 426], [0, 1, 1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              transform: `translateY(${interpolate(frame, [280, 292, 410, 426], [24, 0, 0, -20], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}px)`,
            }}
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-600" style={{ opacity: alertPulse }} />
                <span className="font-mono text-[16px] font-black text-rose-600 tracking-widest uppercase">
                  FOREGROUND FRICTION // LENS TARGET
                </span>
              </div>
              <span className="font-sans text-[32px] font-black text-slate-950 uppercase tracking-tight">
                WORKING MEMORY: PURGE
              </span>
              <span className="font-mono text-[16px] font-bold text-slate-600 mt-1 uppercase">
                ATTENTION TRAPPED AT THRESHOLD
              </span>
            </div>

            <div className="px-5 py-3 rounded-2xl bg-rose-600 text-white font-mono font-black text-xl tracking-wider uppercase">
              ACTIVE
            </div>
          </div>
        </RackFocus>
      </WorldDepthEntity>

      {/* ======================================================== */}
      {/* CHAMBER 3: ARCHITECTURAL FOUNDATION ([1400, 1500])       */}
      {/* "Stop fighting the doorway. Anchor the room..."          */}
      {/* ======================================================== */}
      <WorldDepthEntity worldX={1400} worldY={1500} width={960} height={1300} depth="midground">
        <div className="w-full h-full flex flex-col items-center justify-start pt-12">
          {/* Sector Badge */}
          <div className="px-5 py-2 rounded-2xl bg-white border-[2.5px] border-slate-900 shadow-md mb-6 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500" style={{ opacity: dotPulse }} />
            <span className="font-mono text-[22px] font-black text-slate-900 tracking-wider uppercase">
              SECTOR 03 // ARCHITECTURAL FOUNDATION
            </span>
          </div>

          <h2 className="font-sans text-[62px] font-black text-slate-950 uppercase tracking-tight text-center leading-[1.08] mb-6">
            ANCHOR THE ROOM
          </h2>

          {/* Cast-Iron Obsidian Monolith (#030712) with 3D Glowing Brain */}
          <div
            className="w-[840px] rounded-3xl p-8 bg-[#030712] text-white border-[2.5px] border-slate-800 shadow-[0_30px_60px_rgba(0,0,0,0.35)] flex flex-col items-center"
          >
            <div className="w-full flex items-center justify-between pb-6 border-b border-slate-800 font-mono text-[18px]">
              <span className="font-bold text-slate-400 uppercase">SYSTEM PROTOCOL</span>
              <span className="font-black text-emerald-400 uppercase">ZERO RESISTANCE</span>
            </div>

            <div className="w-full my-6 flex items-center justify-center">
              <img
                src={staticFile("assets/psychology/hyperrealistic_3d_glowing_brain.png")}
                alt="Glowing Neural Brain"
                className="w-[360px] h-auto object-contain drop-shadow-[0_0_40px_rgba(16,185,129,0.3)]"
              />
            </div>

            {/* Inscribed Sovereign Principles */}
            <div className="w-full flex flex-col gap-3 font-mono text-[22px]">
              <div className="w-full p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 font-bold">01 // CONTEXT</span>
                <span className="text-white font-black">PRE-LOADED</span>
              </div>
              <div className="w-full p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 font-bold">02 // DOORWAY</span>
                <span className="text-emerald-400 font-black">DISMANTLED</span>
              </div>
              <div className="w-full p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 font-bold">03 // MOMENTUM</span>
                <span className="text-sky-400 font-black">AUTOMATIC</span>
              </div>
            </div>
          </div>
        </div>
      </WorldDepthEntity>

      {/* ======================================================== */}
      {/* MACRO ARCHITECTURAL OVERVIEW BANNER (Frames 590+)        */}
      {/* ======================================================== */}
      {frame >= 585 && (
        <WorldDepthEntity
          worldX={700}
          worldY={-720}
          width={2200}
          height={140}
          depth="midground"
          startFrame={585}
        >
          <div className="w-full h-full flex items-center justify-between px-12 border-b-[3px] border-slate-900 font-mono text-[24px] uppercase tracking-widest bg-white/70 backdrop-blur-sm">
            <span className="font-black text-slate-900">
              CINEMATIC OBSERVER // FRONTIER #03
            </span>
            <span className="px-6 py-2 rounded-xl bg-slate-950 text-white font-black text-[20px]">
              MULTI-PLANE DEPTH TOPOLOGY
            </span>
          </div>
        </WorldDepthEntity>
      )}
    </CinematicDepthWorld>
  );
};
