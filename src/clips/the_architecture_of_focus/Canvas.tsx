import React from "react";
import { Easing, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { WordTimestamp } from "../../types";
import {
  InfiniteWorldCanvas,
  WorldEntity,
  WorldWaypoint,
} from "../../components/camera3d/InfiniteWorldCanvas";
import { CinematicIllustrationCard } from "../../components/CinematicIllustrationCard";
import { AnimatedSlashStrike, KineticHighlighter } from "../../components/kinetic_text";
import { KineticTensionDial } from "../../components/pure_graphics/KineticTensionDial";

interface CanvasProps {
  transcript: WordTimestamp[];
}

const WORLD_WAYPOINTS: WorldWaypoint[] = [
  // 1. Chamber 1: The Intake & Mind (0 -> 115)
  { frame: 0, x: 0, y: 0, zoom: 1.0, angle: 0 },
  { frame: 115, x: 0, y: 0, zoom: 1.0, angle: 0 },
  // 2. Lateral Dolly Travel to Chamber 2 (115 -> 155)
  { frame: 155, x: 1500, y: 0, zoom: 1.0, angle: 0, durationFrames: 40, transitionType: "smooth" },
  // 3. Tension Push-in on Chamber 2 Overheat (270 -> 292)
  { frame: 292, x: 1500, y: 0, zoom: 1.06, angle: -0.6, durationFrames: 22, transitionType: "snappy" },
  // 4. Dramatic Breath-Hold Freeze at Chamber 2 (430 -> 450)
  { frame: 450, x: 1500, y: 0, zoom: 1.06, angle: 0 },
  // 5. Vertical Plunge Travel to Chamber 3 (450 -> 485)
  { frame: 485, x: 1500, y: 1600, zoom: 1.0, angle: 0, durationFrames: 35, transitionType: "smooth" },
  // 6. Epiphany Punch-in on Slash Strike (615 -> 635)
  { frame: 635, x: 1500, y: 1600, zoom: 1.08, angle: 0.8, durationFrames: 18, transitionType: "snappy" },
  // 7. The Grand Macro Pull-Back (675 -> 735)
  { frame: 735, x: 750, y: 800, zoom: 0.32, angle: 0, durationFrames: 60, transitionType: "smooth" },
];

export const TheArchitectureOfFocusCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Progressive micro-reveal springs for Chamber 1
  const brainSpring = spring({
    frame: Math.max(0, frame - 75),
    fps,
    config: { damping: 14, mass: 0.7, stiffness: 120 },
  });

  // Tension dial value in Chamber 2: ramps from 18% to 94% on spoken cues
  const tensionProgress = interpolate(
    frame,
    [155, 238, 275, 380],
    [18, 52, 86, 96],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.2, 0.8, 0.2, 1) }
  );

  // Chamber 3 Monolith entrance spring
  const monolithSpring = spring({
    frame: Math.max(0, frame - 485),
    fps,
    config: { damping: 15, mass: 0.85, stiffness: 115 },
  });

  // Conduit pulse animations (energy flowing across the floor)
  const conduit1Progress = interpolate(frame, [110, 155], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  const conduit2Progress = interpolate(frame, [440, 485], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // Grand macro title reveal during pull-back
  const grandTitleOpacity = interpolate(frame, [695, 735], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <InfiniteWorldCanvas
      waypoints={WORLD_WAYPOINTS}
      breathHolds={[
        { startFrame: 430, durationFrames: 22 },
      ]}
      impacts={[
        { frame: 292, intensity: 10, durationFrames: 8 },
        { frame: 485, intensity: 14, durationFrames: 10 },
        { frame: 632, intensity: 16, durationFrames: 12 },
      ]}
      showGrid={true}
      className="font-sans"
    >
      {/* ======================================================== */}
      {/* SPATIAL CONDUITS: PHYSICAL LINKS BETWEEN CHAMBERS        */}
      {/* ======================================================== */}
      {/* Conduit 1: Horizontal line from Chamber 1 -> Chamber 2 */}
      <div
        className="absolute h-[3px] bg-slate-300 pointer-events-none"
        style={{
          left: "480px",
          top: "0px",
          width: "540px",
        }}
      >
        <div
          className="h-full bg-sky-500 shadow-[0_0_12px_rgba(14,165,233,0.8)]"
          style={{ width: `${conduit1Progress * 100}%` }}
        />
        <div className="absolute top-3 left-1/2 -translate-x-1/2 font-mono text-[14px] font-bold text-slate-400 uppercase tracking-widest">
          CONDUIT_01 // 1500px TRAVEL
        </div>
      </div>

      {/* Conduit 2: Vertical line from Chamber 2 -> Chamber 3 */}
      <div
        className="absolute w-[3px] bg-slate-300 pointer-events-none"
        style={{
          left: "1500px",
          top: "500px",
          height: "600px",
        }}
      >
        <div
          className="w-full bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.8)]"
          style={{ height: `${conduit2Progress * 100}%` }}
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-[14px] font-bold text-slate-400 uppercase tracking-widest rotate-90">
          CONDUIT_02 // 1600px PLUNGE
        </div>
      </div>

      {/* ======================================================== */}
      {/* CHAMBER 1: THE INTAKE & MIND (World: [0, 0])             */}
      {/* "Your mind was never built to be a storage unit..."       */}
      {/* ======================================================== */}
      <WorldEntity worldX={0} worldY={0} width={960} height={1300}>
        <div className="w-full h-full flex flex-col items-center justify-start pt-10">
          {/* Sector Badge */}
          <div className="px-5 py-2 rounded-2xl bg-white border-[2.5px] border-slate-900 shadow-md mb-6 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-sky-500 animate-pulse" />
            <span className="font-mono text-[22px] font-black text-slate-900 tracking-wider uppercase">
              SECTOR 01 // COGNITIVE INTAKE
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
              <h1 className="font-sans text-[72px] font-black text-slate-950 tracking-tight text-center leading-[1.05] uppercase mb-6">
                NOT A STORAGE UNIT
              </h1>
              <CinematicIllustrationCard
                imageSrc={staticFile("the_architecture_of_focus/assets/scene_illustration.png")}
                width={920}
                height={520}
              />
            </div>
          )}

          {/* Part 1B: Processing Engine Core (Frames 75 -> 125) */}
          {frame >= 74 && (
            <div
              className="w-full flex flex-col items-center text-center"
              style={{
                opacity: brainSpring,
                transform: `scale(${interpolate(brainSpring, [0, 1], [0.85, 1])})`,
              }}
            >
              <h2 className="font-sans text-[68px] font-black text-slate-950 uppercase tracking-tight mb-2">
                IT IS A{" "}
                <KineticHighlighter startFrame={85} color="cyan">
                  PROCESSING ENGINE
                </KineticHighlighter>
              </h2>

              <div className="relative w-[480px] h-[480px] my-4 flex items-center justify-center">
                <img
                  src={staticFile("assets/psychology/hyperrealistic_3d_glowing_brain.png")}
                  alt="Glowing Brain"
                  className="w-full h-full object-contain drop-shadow-[0_25px_45px_rgba(14,165,233,0.25)]"
                />
              </div>

              {/* Data metric card */}
              <div className="w-[840px] px-8 py-5 rounded-2xl bg-white border-[2.5px] border-slate-900 shadow-xl flex items-center justify-between">
                <span className="font-mono text-[24px] font-bold text-slate-600 uppercase">
                  ACTIVE WORKING MEMORY
                </span>
                <span className="font-mono text-[34px] font-black text-sky-600">
                  4 CHUNKS MAX
                </span>
              </div>
            </div>
          )}
        </div>
      </WorldEntity>

      {/* ======================================================== */}
      {/* CHAMBER 2: THE COGNITIVE CONGESTION (World: [1500, 0])   */}
      {/* "When you try to hold every task, open loop, and..."      */}
      {/* ======================================================== */}
      <WorldEntity worldX={1500} worldY={0} width={960} height={1300}>
        <div className="w-full h-full flex flex-col items-center justify-start pt-10">
          {/* Sector Badge */}
          <div className="px-5 py-2 rounded-2xl bg-white border-[2.5px] border-slate-900 shadow-md mb-6 flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${tensionProgress > 80 ? "bg-rose-500 animate-ping" : "bg-amber-500"}`} />
            <span className="font-mono text-[22px] font-black text-slate-900 tracking-wider uppercase">
              SECTOR 02 // FRICTION OVERLOAD
            </span>
          </div>

          <h2 className="font-sans text-[64px] font-black text-slate-950 uppercase tracking-tight text-center leading-[1.08] mb-6">
            WORKING MEMORY OVERHEAT
          </h2>

          {/* Main Dial Card */}
          <div
            className={`w-[900px] p-8 rounded-3xl bg-white border-[2.5px] ${
              tensionProgress > 80 ? "border-rose-600 shadow-[0_25px_50px_-12px_rgba(225,29,72,0.25)]" : "border-slate-900 shadow-2xl"
            } flex flex-col items-center mb-6 transition-colors duration-300`}
          >
            <KineticTensionDial
              startFrame={155}
              peakFrame={292}
              initialValue={18}
              targetValue={96}
              criticalThreshold={75}
              label="COGNITIVE LOAD"
              sublabel="WORKING MEMORY SATURATION"
              width={420}
              height={260}
            />

            <div className="w-full grid grid-cols-3 gap-4 mt-6 pt-6 border-t-[2px] border-slate-100 font-mono text-center">
              <div className="flex flex-col">
                <span className="text-[18px] text-slate-500 font-bold uppercase">TASKS</span>
                <span className="text-[26px] font-black text-slate-900">STACKED</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[18px] text-slate-500 font-bold uppercase">OPEN LOOPS</span>
                <span className="text-[26px] font-black text-amber-600">ACCUMULATING</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[18px] text-slate-500 font-bold uppercase">STATE</span>
                <span className={`text-[26px] font-black ${tensionProgress > 80 ? "text-rose-600 animate-pulse" : "text-slate-900"}`}>
                  {tensionProgress > 80 ? "JAMMED" : "HEAVY"}
                </span>
              </div>
            </div>
          </div>

          {/* Contradiction Block */}
          <div className="w-[900px] p-6 rounded-2xl bg-white border-[2.5px] border-slate-900 shadow-xl flex items-center justify-between">
            <span className="font-mono text-[24px] font-bold text-slate-500 uppercase">
              NOT "DISTRACTION"
            </span>
            <span className="font-mono text-[30px] font-black text-rose-600 uppercase">
              COGNITIVE CONGESTION
            </span>
          </div>
        </div>
      </WorldEntity>

      {/* ======================================================== */}
      {/* CHAMBER 3: THE SOVEREIGN MONOLITH (World: [1500, 1600])  */}
      {/* "Break the loop by externalizing the load. Write..."     */}
      {/* ======================================================== */}
      <WorldEntity worldX={1500} worldY={1600} width={960} height={1300}>
        <div
          className="w-full h-full flex flex-col items-center justify-start pt-10"
          style={{
            opacity: monolithSpring,
            transform: `translateY(${interpolate(monolithSpring, [0, 1], [60, 0])}px)`,
          }}
        >
          {/* Sector Badge */}
          <div className="px-5 py-2 rounded-2xl bg-slate-950 text-white border-[2.5px] border-slate-800 shadow-md mb-6 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[22px] font-black tracking-wider uppercase">
              SECTOR 03 // THE SOVEREIGN MONOLITH
            </span>
          </div>

          <h2 className="font-sans text-[66px] font-black text-slate-950 uppercase tracking-tight text-center leading-[1.06] mb-6">
            EXTERNAL ENGINE
          </h2>

          {/* The High-Contrast Monolith Card */}
          <div className="w-[920px] p-8 rounded-3xl bg-slate-950 text-white border-[3px] border-slate-800 shadow-2xl flex flex-col items-center mb-6">
            <div className="w-full flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <span className="font-mono text-[22px] font-bold text-slate-400 tracking-wider uppercase">
                RESOLUTION PROTOCOL
              </span>
              <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[18px] font-black uppercase">
                ONE CONSTRAINT
              </span>
            </div>

            <div className="relative w-full py-4 flex flex-col items-center">
              <span className="font-sans text-[48px] font-black tracking-wider text-slate-400 line-through decoration-rose-500 decoration-4 mb-2">
                INSIDE WORKING MEMORY
              </span>

              {/* Slash Strike across Congestion */}
              <div className="relative py-2 px-6">
                <span className="font-sans text-[62px] font-black text-white tracking-tight uppercase">
                  WRITTEN ON PAPER
                </span>
                <AnimatedSlashStrike
                  startFrame={632}
                  color="emerald"
                  strokeWidth={7}
                  className="-top-2 left-0"
                />
              </div>
            </div>

            <div className="w-full mt-6 p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between font-mono">
              <span className="text-[22px] text-slate-400 font-bold uppercase">RESULTING STATE:</span>
              <span className="text-[26px] text-emerald-400 font-black uppercase">CLARITY RESTORED</span>
            </div>
          </div>

          {/* Directive Slam Card */}
          <div className="w-[920px] p-6 rounded-2xl bg-white border-[2.5px] border-slate-900 shadow-xl flex items-center justify-around">
            <span className="font-mono text-[30px] font-black text-slate-400 uppercase line-through">
              STOP STORING
            </span>
            <span className="text-slate-300 font-black text-[32px]">→</span>
            <span className="font-mono text-[36px] font-black text-slate-950 uppercase">
              START DIRECTING
            </span>
          </div>
        </div>
      </WorldEntity>

      {/* ======================================================== */}
      {/* MACRO BLUEPRINT OVERLAY (Visible upon Pull-Back)         */}
      {/* ======================================================== */}
      <WorldEntity worldX={750} worldY={800} width={3300} height={3800}>
        <div
          className="w-full h-full pointer-events-none flex flex-col items-center justify-between p-12"
          style={{ opacity: grandTitleOpacity }}
        >
          {/* Top Macro Header */}
          <div className="w-full flex items-center justify-between border-b-[4px] border-slate-950 pb-8">
            <div className="flex flex-col">
              <span className="font-mono text-[42px] font-black text-slate-900 tracking-widest uppercase">
                COGNITIVE ARCHITECTURE BLUEPRINT // V1.0
              </span>
              <span className="font-mono text-[28px] font-bold text-slate-500">
                SYSTEM DIAGRAM: INTAKE → FILTER → MONOLITH
              </span>
            </div>
            <div className="px-8 py-3 rounded-2xl bg-slate-950 text-white font-mono text-[32px] font-black">
              100% SOVEREIGN
            </div>
          </div>

          {/* Bottom Macro Directive */}
          <div className="w-full flex items-center justify-between border-t-[4px] border-slate-950 pt-8">
            <span className="font-mono text-[36px] font-black text-slate-900 tracking-widest uppercase">
              RIGHTMOTION PERSISTENT SPATIAL WORLD PROTOTYPE
            </span>
            <span className="font-mono text-[32px] font-black text-sky-600">
              ZERO SLIDE CUTS // CONTINUOUS 3500px FLIGHT
            </span>
          </div>
        </div>
      </WorldEntity>
    </InfiniteWorldCanvas>
  );
};
