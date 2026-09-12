import React from "react";
import { Easing, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { WordTimestamp } from "../../types";
import {
  InfiniteWorldCanvas,
  WorldEntity,
  WorldWaypoint,
} from "../../components/camera3d/InfiniteWorldCanvas";
import { CinematicIllustrationCard } from "../../components/CinematicIllustrationCard";
import {
  KineticFulcrumBeam,
  SemanticMassNode,
  TensileStructuralTether,
} from "../../components/physics/consequence";
import {
  ViscoelasticDeformation,
  OpticallyStableText,
} from "../../components/physics/materiality";
import { AnimatedSlashStrike, KineticHighlighter } from "../../components/kinetic_text";

interface CanvasProps {
  transcript: WordTimestamp[];
}

/**
 * ═════════════════════════════════════════════════════════════════════════════
 * ⚖️ THE LAW OF THE COUNTERWEIGHT — CANVAS (FRONTIER #4 MASTERPIECE)
 * ═════════════════════════════════════════════════════════════════════════════
 * 
 * Demonstrates SEMANTIC MASS + PHYSICAL CONSEQUENCE ENGINE:
 * 1. Action -> Consequence causal propagation across connected bodies.
 * 2. Closed-form torque balance on a central fulcrum.
 * 3. High-inertia mass impact with viscoelastic spring deformation.
 * 4. Tensile structural tether under strain vibration.
 * 5. Microscopic trigger exceeding critical threshold -> cable rupture.
 * 6. Catapult momentum transfer & ballistic ejection of the sovereign core.
 */

const WORLD_WAYPOINTS_60FPS: WorldWaypoint[] = [
  // 1. Chamber 1: The Pristine Premise (0 -> 240)
  { frame: 0, x: 0, y: 0, zoom: 1.0, angle: 0 },
  { frame: 240, x: 0, y: 0, zoom: 1.0, angle: 0 },
  // 2. Lateral Travel along Conduit 01 to Chamber 2 (240 -> 300)
  { frame: 300, x: 1400, y: 0, zoom: 1.0, angle: 0, durationFrames: 60, transitionType: "smooth" },
  // 3. Tension Push-in as Heavy Obsidian slams onto right arm (500 -> 525)
  { frame: 525, x: 1400, y: 0, zoom: 1.05, angle: -0.4, durationFrames: 25, transitionType: "snappy" },
  // 4. Tightening focus during high-frequency tether strain vibration (840 -> 870)
  { frame: 870, x: 1400, y: 0, zoom: 1.08, angle: 0.3, durationFrames: 30, transitionType: "smooth" },
  // 5. Critical Cable Rupture & Impact Shock (1080)
  { frame: 1080, x: 1400, y: 0, zoom: 1.10, angle: -0.6 },
  // 6. Vertical Plunge along Conduit 02 to Chamber 3 (1170 -> 1230)
  { frame: 1230, x: 1400, y: 1600, zoom: 1.0, angle: 0, durationFrames: 60, transitionType: "smooth" },
  // 7. Core Inscription Focus (1320 -> 1350)
  { frame: 1350, x: 1400, y: 1600, zoom: 1.06, angle: 0, durationFrames: 30, transitionType: "snappy" },
  // 8. The Grand Macro Blueprint Pull-Back (1380 -> 1460)
  { frame: 1460, x: 700, y: 800, zoom: 0.36, angle: 0, durationFrames: 80, transitionType: "smooth" },
];

const IMPACTS_60FPS = [
  { frame: 420, intensity: 7, durationFrames: 14 },   // Load 1 lands
  { frame: 500, intensity: 15, durationFrames: 20 },  // Massive Obsidian Block slams!
  { frame: 1060, intensity: 4, durationFrames: 10 },  // Micro-concession lands
  { frame: 1080, intensity: 20, durationFrames: 24 }, // CRITICAL CABLE RUPTURE!
  { frame: 1205, intensity: 16, durationFrames: 18 }, // Debris crash into foundation!
];

export const TheLawOfTheCounterweightCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Spoken Word Cue Triggers & Physical Timeline
  const SNAP_FRAME = 1080; // "snaps the cable" at frame 1080
  const isSnapped = frame >= SNAP_FRAME;

  // Conduit 01 & 02 Progress
  const conduit1Progress = interpolate(frame, [230, 295], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  const conduit2Progress = interpolate(frame, [1160, 1220], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // 2. Viscoelastic Hydraulic Damper (Under right arm of beam)
  // Compresses when heavy obsidian hits at frame 500, releases when snapped at 1080
  const damperLoad = interpolate(
    frame,
    [415, 430, 495, 520, 1075, 1082],
    [0.0, 0.25, 0.25, 0.88, 0.88, 0.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.2, 0.8, 0.2, 1) }
  );

  // 3. Beam Loads Configuration
  const beamLoads = [
    { id: "core_peace", arm: "left" as const, mass: 1.0, distance: 280, landFrame: 280 },
    { id: "first_yes", arm: "right" as const, mass: 2.2, distance: 220, landFrame: 420 },
    { id: "heavy_resentment", arm: "right" as const, mass: 7.8, distance: 300, landFrame: 500 },
    { id: "micro_speck", arm: "right" as const, mass: 0.25, distance: 320, landFrame: 1060 },
  ];

  // 4. Ballistic Ejection Trajectory for "YOUR CORE PEACE" (After snap at 1080)
  // Launches with initial upward velocity v0, reaches apex at +35 frames, floats to Chamber 3
  let ejectedCoreX = 0;
  let ejectedCoreY = 0;
  let ejectedCoreRot = 0;
  let ejectedCoreScale = 1.0;

  if (isSnapped) {
    const relSnap = frame - SNAP_FRAME;
    if (relSnap < 90) {
      // Phase A: Ballistic Arc Catapult
      const t = relSnap / 60; // seconds
      const v0y = -480; // px/s upward launch
      const g = 620; // px/s^2 gravity
      ejectedCoreY = v0y * t + 0.5 * g * t * t;
      ejectedCoreX = Math.sin(t * 3.5) * 45;
      ejectedCoreRot = Math.sin(t * 4.0) * 8.0;
    } else {
      // Phase B: Settling smoothly down Conduit 02 into Chamber 3 Pedestal
      const settleProgress = spring({
        frame: relSnap - 90,
        fps,
        config: { damping: 15, mass: 0.9, stiffness: 120 },
      });
      ejectedCoreX = interpolate(settleProgress, [0, 1], [40, 0]);
      ejectedCoreY = interpolate(settleProgress, [0, 1], [150, 0]);
      ejectedCoreRot = interpolate(settleProgress, [0, 1], [4, 0]);
      ejectedCoreScale = interpolate(settleProgress, [0, 1], [0.95, 1.0]);
    }
  }

  // 5. Shattered Debris of Heavy Obsidian (Breaks floor at frame 1195)
  const isFloorShattered = frame >= 1200;

  // Macro Blueprint opacity
  const macroOpacity = interpolate(frame, [1390, 1450], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle live telemetry pulse
  const livePulse = 0.5 + 0.5 * Math.sin((frame / fps) * (0.25 * 60));

  return (
    <InfiniteWorldCanvas
      waypoints={WORLD_WAYPOINTS_60FPS}
      impacts={IMPACTS_60FPS}
      showGrid={true}
      className="font-sans"
    >
      {/* ════════════════════════════════════════════════════════════ */}
      {/* SPATIAL CONDUITS (Continuous World Connectors)              */}
      {/* ════════════════════════════════════════════════════════════ */}
      {/* Conduit 01: Horizontal vector from Chamber 1 -> Chamber 2 */}
      <div
        className="absolute h-[3.5px] bg-slate-200 pointer-events-none"
        style={{ left: "480px", top: "0px", width: "440px" }}
      >
        <div
          className="h-full bg-amber-500 shadow-[0_0_14px_rgba(245,158,11,0.85)]"
          style={{ width: `${conduit1Progress * 100}%` }}
        />
        <div className="absolute top-3 left-1/2 -translate-x-1/2 font-mono text-[14px] font-black text-slate-400 uppercase tracking-widest">
          CONDUIT_01 // 1400px MOMENT TRANSFER
        </div>
      </div>

      {/* Conduit 02: Vertical plunge vector from Chamber 2 -> Chamber 3 */}
      <div
        className="absolute w-[3.5px] bg-slate-200 pointer-events-none"
        style={{ left: "1400px", top: "520px", height: "560px" }}
      >
        <div
          className="w-full bg-rose-500 shadow-[0_0_14px_rgba(244,63,94,0.85)]"
          style={{ height: `${conduit2Progress * 100}%` }}
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-[14px] font-black text-slate-400 uppercase tracking-widest rotate-90">
          CONDUIT_02 // 1600px GRAVITATIONAL PLUNGE
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* CHAMBER 1: THE PRISTINE PREMISE (World: [0, 0])             */}
      {/* "You don't burn out from working hard..."                   */}
      {/* ════════════════════════════════════════════════════════════ */}
      <WorldEntity worldX={0} worldY={0} width={960} height={1300}>
        <div className="w-full h-full flex flex-col items-center justify-start pt-10">
          {/* Sector Badge */}
          <div className="px-5 py-2.5 rounded-2xl bg-white border-[2.5px] border-slate-900 shadow-md mb-6 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-amber-500" style={{ opacity: livePulse }} />
            <span className="font-mono text-[20px] font-black text-slate-900 tracking-wider uppercase">
              SECTOR 01 // THE STRUCTURAL FALLACY
            </span>
          </div>

          {/* Part 1A: Hero Illustration Card (Frames 0 -> 145) */}
          {frame < 150 && (
            <div
              className="w-full flex flex-col items-center"
              style={{
                opacity: interpolate(frame, [135, 148], [1, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              <CinematicIllustrationCard
                imageSrc={staticFile("the_law_of_the_counterweight/assets/scene_illustration.png")}
                width={920}
                height={520}
              />
              <div className="mt-8 text-center max-w-[840px]">
                <h1 className="text-[64px] font-black text-[#090d16] leading-[1.08] tracking-tight uppercase">
                  BURNOUT IS NOT <br />
                  <span className="text-rose-600">AN EFFORT PROBLEM.</span>
                </h1>
              </div>
            </div>
          )}

          {/* Part 1B: The Asymmetric Premise Reveal (Frames 145 -> 240) */}
          {frame >= 145 && (
            <div
              className="w-full flex flex-col items-center mt-6"
              style={{
                opacity: interpolate(frame, [145, 160], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              <div className="w-[880px] p-8 rounded-3xl bg-white border-[2.5px] border-slate-900 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.16)] flex flex-col gap-5">
                <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4">
                  <span className="font-mono text-[18px] font-black text-rose-600 uppercase tracking-widest">
                    DIAGNOSTIC TELEMETRY
                  </span>
                  <span className="font-mono text-[16px] text-slate-400 font-bold">STATE: OVERBURDENED</span>
                </div>
                <div className="text-[48px] font-black text-[#090d16] leading-tight uppercase">
                  CARRYING UNWEIGHTED TENSION ON AN UNSTABLE STRUCTURE
                </div>
                <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white font-mono font-black flex items-center justify-center text-xl">
                    !
                  </div>
                  <span className="font-mono text-[20px] font-bold text-amber-950">
                    MECHANICAL FAILURE OCCURS BEFORE VISIBLE COLLAPSE.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </WorldEntity>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* CHAMBER 2: THE MECHANICAL FULCRUM & TENSION TETHER         */}
      {/* (World: [1400, 0])                                          */}
      {/* ════════════════════════════════════════════════════════════ */}
      <WorldEntity worldX={1400} worldY={0} width={1000} height={1300}>
        <div className="w-full h-full flex flex-col items-center justify-start pt-6 relative">
          {/* Sector Badge */}
          <div className="absolute top-6 left-12 px-5 py-2.5 rounded-2xl bg-white border-[2.5px] border-slate-900 shadow-md flex items-center gap-3 z-30">
            <div className="w-3 h-3 rounded-full bg-rose-500" style={{ opacity: livePulse }} />
            <span className="font-mono text-[18px] font-black text-slate-900 tracking-wider uppercase">
              SECTOR 02 // THE OVERLOADED FULCRUM
            </span>
          </div>

          {/* Fixed Ceiling Bracket for Structural Tether */}
          <div
            className="absolute top-6 right-[110px] flex flex-col items-center pointer-events-none z-30"
          >
            <div className="w-24 h-5 rounded-md bg-slate-900 border-2 border-slate-950 shadow-md flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-amber-400" style={{ opacity: livePulse }} />
            </div>
            <div className="font-mono text-[10px] font-black text-slate-500 mt-1 uppercase tracking-wider">
              CEILING ANCHOR // HIGH TENSILE
            </div>
          </div>

          {/* Mechanical Fulcrum & Balance Beam */}
          <div className="relative mt-[340px] w-full flex flex-col items-center">
            <KineticFulcrumBeam
              width={860}
              height={18}
              fulcrumRatio={0.5}
              maxAngleDeg={14}
              baseAngleDeg={0}
              loads={beamLoads}
              constraintSnapFrame={SNAP_FRAME}
            >
              {(beamState) => {
                // Tether connects from ceiling bracket (World Y ~ 50px -> local Y ~ -290px)
                // down to the top of the heavy stack on the right arm (local Y ~ -160px)
                const tetherStartX = 720;
                const tetherStartY = -285;
                const tetherEndX = 720;
                const tetherEndY = 60 + beamState.rightTipOffsetY - 160;

                return (
                  <>
                    {/* ════════════════════════════════════════════ */}
                    {/* TENSILE STRUCTURAL TETHER (Suspending Load)  */}
                    {/* ════════════════════════════════════════════ */}
                    <TensileStructuralTether
                      startX={tetherStartX}
                      startY={tetherStartY}
                      endX={tetherEndX}
                      endY={tetherEndY}
                      restLength={120}
                      snapFrame={SNAP_FRAME}
                      vibrationStartFrame={840}
                      vibrationIntensity={5.5}
                    />

                    {/* ════════════════════════════════════════════ */}
                    {/* LEFT ARM: "YOUR CORE PEACE" (Mass m=1.0)    */}
                    {/* ════════════════════════════════════════════ */}
                    {!isSnapped && (
                      <div
                        className="absolute pointer-events-auto"
                        style={{
                          left: "20px",
                          top: `${60 + beamState.leftTipOffsetY}px`,
                          transform: `translateY(-100%)`,
                          transformOrigin: "bottom center",
                        }}
                      >
                        <SemanticMassNode
                          mass={1.0}
                          enterFrame={275}
                          enableAmbientDrift={true}
                          impulses={[
                            { frame: 420, forceY: -8, durationFrames: 14 },
                            { frame: 500, forceY: -16, durationFrames: 22 },
                          ]}
                        >
                          <div className="w-[260px] p-5 rounded-2xl bg-white border-[2.5px] border-slate-900 shadow-[0_16px_32px_rgba(0,0,0,0.14)] flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                              <span className="font-mono text-[12px] font-black text-sky-600 uppercase">
                                MASS: 1.0 // CORE
                              </span>
                            </div>
                            <div className="text-[26px] font-black text-[#090d16] leading-tight uppercase">
                              YOUR PEACE
                            </div>
                            <div className="font-mono text-[11px] text-slate-400 font-bold uppercase">
                              LIGHT // DELICATE // SOVEREIGN
                            </div>
                          </div>
                        </SemanticMassNode>
                      </div>
                    )}

                    {/* Ballistic Launching Core (After Snap) */}
                    {isSnapped && frame < 1220 && (
                      <div
                        className="absolute pointer-events-none z-50"
                        style={{
                          left: "20px",
                          top: `${60 + beamState.leftTipOffsetY}px`,
                          transform: `translate3d(${ejectedCoreX.toFixed(2)}px, ${ejectedCoreY.toFixed(2)}px, 0px) rotate(${ejectedCoreRot.toFixed(2)}deg) scale(${ejectedCoreScale}) translateY(-100%)`,
                          transformOrigin: "bottom center",
                        }}
                      >
                        <div className="w-[260px] p-5 rounded-2xl bg-white border-[3px] border-sky-500 shadow-[0_24px_48px_rgba(14,165,233,0.35)] flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" style={{ opacity: 0.6 + 0.4 * Math.sin((frame / fps) * 20) }} />
                            <span className="font-mono text-[12px] font-black text-sky-500 uppercase">
                              BALLISTIC EJECTION
                            </span>
                          </div>
                          <div className="text-[26px] font-black text-[#090d16] leading-tight uppercase">
                            YOUR PEACE
                          </div>
                          <div className="font-mono text-[11px] text-emerald-600 font-bold uppercase">
                            MOMENTUM CONSERVED
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ════════════════════════════════════════════ */}
                    {/* RIGHT ARM: THE ESCALATING HEAVY LOAD STACK   */}
                    {/* ════════════════════════════════════════════ */}
                    <div
                      className="absolute pointer-events-auto flex flex-col items-center"
                      style={{
                        right: "20px",
                        top: `${60 + beamState.rightTipOffsetY}px`,
                        transform: `translateY(-100%)`,
                        transformOrigin: "bottom center",
                      }}
                    >
                      {/* Item 3: Microscopic Concession Speck (Lands at frame 1060) */}
                      {frame >= 1060 && !isSnapped && (
                        <SemanticMassNode
                          mass={0.25}
                          enterFrame={1060}
                          impulses={[{ frame: 1060, forceY: 6, durationFrames: 10 }]}
                          className="mb-2 z-30"
                        >
                          <div className="px-4 py-1.5 rounded-xl bg-rose-600 border-2 border-slate-950 text-white shadow-lg flex items-center gap-2">
                            <span className="font-mono text-[12px] font-black uppercase">
                              FINAL CONCESSION (0.25kg)
                            </span>
                          </div>
                        </SemanticMassNode>
                      )}

                      {/* Item 2: Massive Obsidian Monolith: RESENTMENT (m=7.8, lands at frame 500) */}
                      {frame >= 500 && (
                        <SemanticMassNode
                          mass={7.8}
                          enterFrame={500}
                          impulses={[
                            { frame: 500, forceY: 34, durationFrames: 24 },
                            { frame: 1060, forceY: 4, durationFrames: 8 },
                          ]}
                          className="mb-2 z-20"
                        >
                          <div
                            className={`w-[320px] p-6 rounded-2xl border-[3px] border-slate-950 flex flex-col gap-2 transition-colors ${
                              isSnapped
                                ? "bg-red-950 text-red-200 border-red-700 shadow-2xl"
                                : "bg-[#090d16] text-white shadow-[0_28px_56px_rgba(0,0,0,0.38)]"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[12px] font-black text-rose-400 uppercase">
                                MASS: 7.8 // CRUSHING LOAD
                              </span>
                              <span className="font-mono text-[11px] text-slate-400 font-bold">
                                {isSnapped ? "COLLAPSED" : "BRACED"}
                              </span>
                            </div>
                            <div className="text-[30px] font-black leading-tight uppercase">
                              SILENT RESENTMENT
                            </div>
                            <div className="font-mono text-[12px] text-slate-300 font-bold uppercase">
                              UNSPOKEN COMPROMISES
                            </div>
                          </div>
                        </SemanticMassNode>
                      )}

                      {/* Item 1: The Initial Compromise: "FIRST YES" (m=2.2, lands at frame 420) */}
                      {frame >= 420 && (
                        <SemanticMassNode
                          mass={2.2}
                          enterFrame={420}
                          impulses={[
                            { frame: 420, forceY: 18, durationFrames: 16 },
                            { frame: 500, forceY: 26, durationFrames: 20 },
                          ]}
                          className="z-10"
                        >
                          <div className="w-[300px] p-4 rounded-xl bg-amber-100 border-[2.5px] border-slate-900 shadow-md flex items-center justify-between">
                            <span className="text-[20px] font-black text-slate-900 uppercase">
                              JUST ONE MORE "YES"
                            </span>
                            <span className="font-mono text-[12px] font-black text-amber-700">
                              2.2kg
                            </span>
                          </div>
                        </SemanticMassNode>
                      )}
                    </div>
                  </>
                );
              }}
            </KineticFulcrumBeam>

            {/* ════════════════════════════════════════════════════════ */}
            {/* VISCOELASTIC HYDRAULIC DAMPER (Under Right Arm)          */}
            {/* ════════════════════════════════════════════════════════ */}
            <div
              className="absolute top-[220px] right-[70px] flex flex-col items-center pointer-events-none"
            >
              <ViscoelasticDeformation
                load={damperLoad}
                poissonRatio={0.44}
                maxCompression={0.24}
                impactFrame={500}
              >
                <div className="w-24 h-24 rounded-2xl bg-slate-900 border-[2.5px] border-slate-950 shadow-xl flex flex-col items-center justify-center p-2 text-white">
                  <div className="font-mono text-[10px] font-black text-amber-400 uppercase">
                    HYDRAULIC
                  </div>
                  <OpticallyStableText>
                    <div className="font-mono text-[18px] font-black text-white">
                      {(damperLoad * 100).toFixed(0)}%
                    </div>
                  </OpticallyStableText>
                  <div className="font-mono text-[9px] text-slate-400 uppercase">LOAD STRAIN</div>
                </div>
              </ViscoelasticDeformation>
              {/* Foundation Bedding */}
              <div className="w-36 h-3 rounded-full bg-slate-700 border-2 border-slate-900 mt-1 shadow-md" />
            </div>
          </div>

          {/* Live Inscription / Spoken Contradiction (Frames 575 -> 700) */}
          {frame >= 575 && frame < 720 && (
            <div className="mt-20 w-[840px] flex flex-col items-center">
              <div className="w-full p-6 rounded-3xl bg-white border-[2.5px] border-slate-900 shadow-xl flex items-center justify-between">
                <AnimatedSlashStrike
                  startFrame={600}
                  durationFrames={10}
                  preset="blade_slash"
                  color="rose"
                  strokeWidth={7}
                >
                  <span className="text-[36px] font-black text-slate-900 uppercase">
                    THE SYSTEM DOESN'T BEND
                  </span>
                </AnimatedSlashStrike>
                {frame >= 640 && (
                  <span className="text-[36px] font-black text-rose-600 uppercase tracking-wider font-mono">
                    IT BRACES.
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </WorldEntity>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* CHAMBER 3: THE BEDROCK FOUNDATION & SOVEREIGN CORE         */}
      {/* (World: [1400, 1600])                                       */}
      {/* "Stop adding counterweights to a structure..."             */}
      {/* ════════════════════════════════════════════════════════════ */}
      <WorldEntity worldX={1400} worldY={1600} width={1000} height={1300}>
        <div className="w-full h-full flex flex-col items-center justify-start pt-8">
          {/* Sector Badge */}
          <div className="px-5 py-2.5 rounded-2xl bg-white border-[2.5px] border-slate-900 shadow-md mb-8 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500" style={{ opacity: livePulse }} />
            <span className="font-mono text-[20px] font-black text-slate-900 tracking-wider uppercase">
              SECTOR 03 // THE GROUNDED BEDROCK
            </span>
          </div>

          {/* The Sovereign Core Pedestal (Receives Ejected Peace) */}
          <div className="w-[880px] flex flex-col items-center mt-6">
            {/* Settled Core Peace Card */}
            {frame >= 1210 && (
              <SemanticMassNode
                mass={1.0}
                enterFrame={1210}
                enableAmbientDrift={false}
                impulses={[{ frame: 1210, forceY: 18, durationFrames: 18 }]}
                className="mb-8 z-30"
              >
                <div className="w-[420px] p-7 rounded-3xl bg-white border-[3px] border-slate-900 shadow-[0_24px_48px_rgba(0,0,0,0.18)] flex flex-col gap-3 text-center items-center">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white font-mono font-black flex items-center justify-center text-2xl shadow-md">
                    ✓
                  </div>
                  <div className="text-[34px] font-black text-[#090d16] uppercase leading-tight">
                    YOUR SOVEREIGN CORE
                  </div>
                  <div className="font-mono text-[14px] font-black text-emerald-600 uppercase tracking-wider">
                    RESTING ON ITS OWN FOUNDATION
                  </div>
                </div>
              </SemanticMassNode>
            )}

            {/* Heavy Bedrock Monolith (Unshakable Foundation) */}
            <div className="w-full p-8 rounded-3xl bg-[#090d16] border-[3px] border-slate-950 shadow-2xl flex flex-col gap-4 text-white text-center items-center">
              <div className="font-mono text-[16px] font-black text-emerald-400 uppercase tracking-widest">
                THE RESOLUTION PROTOCOL
              </div>
              <h2 className="text-[44px] font-black leading-tight uppercase max-w-[760px]">
                NEVER BALANCE YOUR PEACE <br />
                <span className="text-amber-400">WITH DEAD WEIGHT.</span>
              </h2>
              <div className="mt-2 w-full flex items-center justify-center">
                {frame >= 1390 ? (
                  <KineticHighlighter
                    color="cyan"
                    startFrame={1409}
                    durationFrames={16}
                  >
                    <span className="text-[52px] font-black text-slate-900 tracking-tight uppercase">
                      CLEAR THE BEAM.
                    </span>
                  </KineticHighlighter>
                ) : (
                  <div className="font-mono text-[20px] text-slate-400 font-bold uppercase tracking-wider">
                    REMOVING THE COUNTERWEIGHTS...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </WorldEntity>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* GRAND MACRO BLUEPRINT TITLE OVERLAY (Frames 1380 -> 1494)   */}
      {/* ════════════════════════════════════════════════════════════ */}
      <div
        className="absolute inset-0 pointer-events-none z-50 flex flex-col items-center justify-start pt-24"
        style={{
          opacity: macroOpacity,
        }}
      >
        <div className="px-8 py-3 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-700 text-white font-mono text-[18px] font-black tracking-widest uppercase shadow-2xl">
          MACRO SPATIAL BLUEPRINT // PERSISTENT WORLD OVERVIEW
        </div>
      </div>
    </InfiniteWorldCanvas>
  );
};
