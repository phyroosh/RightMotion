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
  StressFractureEngine,
  ViscoelasticDeformation,
  CapillaryInkBleed,
} from "../../components/physics/materiality";

interface CanvasProps {
  transcript: WordTimestamp[];
}

const WORLD_WAYPOINTS: WorldWaypoint[] = [
  // 1. Chamber 1: The Glass Premise (0 -> 135)
  { frame: 0, x: 0, y: 0, zoom: 1.0, angle: 0 },
  { frame: 135, x: 0, y: 0, zoom: 1.0, angle: 0 },
  // 2. Lateral Travel along Conduit 01 to Chamber 2 (135 -> 165)
  { frame: 165, x: 1400, y: 0, zoom: 1.0, angle: 0, durationFrames: 30, transitionType: "smooth" },
  // 3. Tension Push-in as Stress Fissures Form (330 -> 350)
  { frame: 350, x: 1400, y: 0, zoom: 1.05, angle: -0.5, durationFrames: 20, transitionType: "snappy" },
  // 4. Critical Shatter Impact (446)
  { frame: 446, x: 1400, y: 0, zoom: 1.08, angle: 0.6 },
  // 5. Vertical Plunge along Conduit 02 to Chamber 3 (470 -> 505)
  { frame: 505, x: 1400, y: 1500, zoom: 1.0, angle: 0, durationFrames: 35, transitionType: "smooth" },
  // 6. Push-in on Inscription (620 -> 640)
  { frame: 640, x: 1400, y: 1500, zoom: 1.06, angle: 0, durationFrames: 20, transitionType: "snappy" },
  // 7. The Grand Macro Pull-Back (685 -> 730)
  { frame: 730, x: 700, y: 750, zoom: 0.34, angle: 0, durationFrames: 45, transitionType: "smooth" },
];

export const TheLawOfStructuralLoadCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Progressive load simulation in Chamber 2
  // Block 1 lands at f=180, Block 2 lands at f=245, Block 3 lands at f=320
  const compLoad = interpolate(
    frame,
    [165, 185, 245, 320, 440],
    [0.08, 0.35, 0.68, 0.94, 1.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.2, 0.8, 0.2, 1) }
  );

  // Stress accumulation ratio for StressFractureEngine
  const stressRatio = interpolate(
    frame,
    [185, 245, 340, 445],
    [0.1, 0.45, 0.82, 1.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Conduit pulse progress
  const conduit1Progress = interpolate(frame, [130, 165], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  const conduit2Progress = interpolate(frame, [460, 505], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // Chamber 3 Monolith entrance spring
  const monolithSpring = spring({
    frame: Math.max(0, frame - 505),
    fps,
    config: { damping: 14, mass: 0.9, stiffness: 120 },
  });

  // Macro Blueprint opacity
  const grandTitleOpacity = interpolate(frame, [695, 730], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Deterministic badge pulse
  const dotPulse = 0.45 + 0.55 * Math.sin(frame * 0.2);

  return (
    <InfiniteWorldCanvas
      waypoints={WORLD_WAYPOINTS}
      impacts={[
        { frame: 185, intensity: 8, durationFrames: 8 },
        { frame: 245, intensity: 10, durationFrames: 9 },
        { frame: 320, intensity: 12, durationFrames: 10 },
        { frame: 446, intensity: 18, durationFrames: 14 }, // Critical Shatter Impact!
        { frame: 508, intensity: 12, durationFrames: 10 },
      ]}
      showGrid={true}
      className="font-sans"
    >
      {/* ======================================================== */}
      {/* SPATIAL CONDUITS                                         */}
      {/* ======================================================== */}
      {/* Conduit 1: Horizontal line from Chamber 1 -> Chamber 2 */}
      <div
        className="absolute h-[3px] bg-slate-300 pointer-events-none"
        style={{ left: "480px", top: "0px", width: "440px" }}
      >
        <div
          className="h-full bg-sky-500 shadow-[0_0_12px_rgba(14,165,233,0.8)]"
          style={{ width: `${conduit1Progress * 100}%` }}
        />
        <div className="absolute top-3 left-1/2 -translate-x-1/2 font-mono text-[14px] font-bold text-slate-400 uppercase tracking-widest">
          CONDUIT_01 // 1400px LOAD TRANSFER
        </div>
      </div>

      {/* Conduit 2: Vertical line from Chamber 2 -> Chamber 3 */}
      <div
        className="absolute w-[3px] bg-slate-300 pointer-events-none"
        style={{ left: "1400px", top: "500px", height: "500px" }}
      >
        <div
          className="w-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]"
          style={{ height: `${conduit2Progress * 100}%` }}
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-[14px] font-bold text-slate-400 uppercase tracking-widest rotate-90">
          CONDUIT_02 // 1500px ANCHOR PLUNGE
        </div>
      </div>

      {/* ======================================================== */}
      {/* CHAMBER 1: THE GLASS PREMISE (World: [0, 0])             */}
      {/* "You don't burn out because you lack willpower..."       */}
      {/* ======================================================== */}
      <WorldEntity worldX={0} worldY={0} width={960} height={1300}>
        <div className="w-full h-full flex flex-col items-center justify-start pt-10">
          {/* Sector Badge */}
          <div className="px-5 py-2 rounded-2xl bg-white border-[2.5px] border-slate-900 shadow-md mb-6 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-sky-500" style={{ opacity: dotPulse }} />
            <span className="font-mono text-[22px] font-black text-slate-900 tracking-wider uppercase">
              SECTOR 01 // THE BRITTLE PREMISE
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
                WILLPOWER IS GLASS
              </h1>
              <CinematicIllustrationCard
                imageSrc={staticFile("the_law_of_structural_load/assets/scene_illustration.png")}
                width={920}
                height={520}
              />
            </div>
          )}

          {/* Part 1B: Crystalline Prism Introduction (Frames 75 -> 145) */}
          {frame >= 74 && (
            <div className="w-full flex flex-col items-center text-center">
              <h2 className="font-sans text-[64px] font-black text-slate-950 uppercase tracking-tight mb-4">
                MADE OF GLASS
              </h2>

              {/* Physical Crystalline Prism Container */}
              <div
                className="w-[780px] h-[460px] rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 249, 255, 0.85) 100%)",
                  border: "3px solid #0284c7",
                  boxShadow:
                    "0 24px 48px -12px rgba(2, 132, 199, 0.22), inset 0 2px 4px rgba(255, 255, 255, 0.9)",
                }}
              >
                {/* Prismatic Specular Refraction Bevels */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(45deg, transparent 40%, rgba(56, 189, 248, 0.15) 50%, transparent 60%)",
                  }}
                />

                <span className="font-mono text-[22px] font-black text-sky-600 tracking-widest uppercase mb-2">
                  MATERIAL SPECIFICATION: BRITTLE SOLID
                </span>
                <span className="font-sans text-[46px] font-black text-slate-950 tracking-tight leading-tight">
                  ZERO TENSILE DUCTILITY
                </span>
                <p className="font-mono text-[20px] font-bold text-slate-500 mt-4 uppercase">
                  CANNOT BEND • CAN ONLY ACCUMULATE STRAIN
                </p>
              </div>

              {/* Telemetry Footer */}
              <div className="w-[780px] mt-6 px-8 py-4 rounded-2xl bg-white border-[2.5px] border-slate-900 shadow-lg flex items-center justify-between font-mono">
                <span className="text-[20px] font-bold text-slate-500 uppercase">SHEAR LIMIT</span>
                <span className="text-[26px] font-black text-rose-600 uppercase">FINITE CAPACITY</span>
              </div>
            </div>
          )}
        </div>
      </WorldEntity>

      {/* ======================================================== */}
      {/* CHAMBER 2: MECHANICAL STRAIN & FRACTURE (World: [1400, 0])*/}
      {/* "When you pile unprioritized demands onto raw grit..."    */}
      {/* ======================================================== */}
      <WorldEntity worldX={1400} worldY={0} width={960} height={1300} startFrame={130}>
        <div className="w-full h-full flex flex-col items-center justify-start pt-10">
          {/* Sector Badge */}
          <div className="px-5 py-2 rounded-2xl bg-white border-[2.5px] border-slate-900 shadow-md mb-6 flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${compLoad > 0.8 ? "bg-rose-500" : "bg-amber-500"}`}
              style={{ opacity: dotPulse }}
            />
            <span className="font-mono text-[22px] font-black text-slate-900 tracking-wider uppercase">
              SECTOR 02 // COMPRESSIVE FAILURE
            </span>
          </div>

          <h2 className="font-sans text-[62px] font-black text-slate-950 uppercase tracking-tight text-center leading-[1.08] mb-6">
            STRUCTURAL LOAD TEST
          </h2>

          {/* Dynamic Compressive Weight Blocks landing on top */}
          <div className="w-[860px] flex flex-col gap-3 mb-6">
            {frame >= 180 && (
              <div
                className="w-full p-4 rounded-2xl bg-slate-950 text-white border-[2.5px] border-slate-800 shadow-lg flex items-center justify-between font-mono"
                style={{
                  transform: `translateY(${interpolate(frame, [180, 185], [-40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
                }}
              >
                <span className="text-[20px] font-bold uppercase">LOAD 01: UNPRIORITIZED DEMANDS</span>
                <span className="text-[22px] font-black text-rose-400">+2,400 KG</span>
              </div>
            )}

            {frame >= 240 && (
              <div
                className="w-full p-4 rounded-2xl bg-slate-950 text-white border-[2.5px] border-slate-800 shadow-lg flex items-center justify-between font-mono"
                style={{
                  transform: `translateY(${interpolate(frame, [240, 245], [-40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
                }}
              >
                <span className="text-[20px] font-bold uppercase">LOAD 02: RAW WILLPOWER GRIT</span>
                <span className="text-[22px] font-black text-rose-400">+4,800 KG</span>
              </div>
            )}
          </div>

          {/* Core Material Transformation: Viscoelastic Compression + Stress Fracture Engine */}
          <ViscoelasticDeformation
            load={compLoad}
            poissonRatio={0.45}
            maxCompression={0.14}
            impactFrame={frame >= 320 ? 320 : undefined}
            className="flex items-center justify-center"
          >
            <StressFractureEngine
              stress={stressRatio}
              shatterFrame={446}
              width={840}
              height={420}
              className="rounded-3xl overflow-hidden"
            >
              <div
                className="w-full h-full rounded-3xl p-8 flex flex-col items-center justify-between relative"
                style={{
                  background:
                    frame >= 446
                      ? "linear-gradient(135deg, rgba(254, 242, 242, 0.9) 0%, rgba(255, 255, 255, 0.8) 100%)"
                      : "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 249, 255, 0.85) 100%)",
                  border: frame >= 446 ? "3px solid #e11d48" : "3px solid #0284c7",
                  boxShadow:
                    frame >= 446
                      ? "0 28px 56px -12px rgba(225, 29, 72, 0.35)"
                      : "0 24px 48px -12px rgba(2, 132, 199, 0.22)",
                }}
              >
                <div className="w-full flex items-center justify-between border-b border-slate-200 pb-3">
                  <span className="font-mono text-[20px] font-black uppercase text-slate-500">
                    COLUMN AXIAL STRAIN
                  </span>
                  <span
                    className={`font-mono text-[22px] font-black uppercase ${
                      frame >= 446 ? "text-rose-600" : "text-sky-600"
                    }`}
                  >
                    {frame >= 446 ? "RUPTURED" : `${Math.round(compLoad * 100)}% SHEAR`}
                  </span>
                </div>

                <div className="text-center my-4">
                  <span
                    className={`font-sans text-[58px] font-black uppercase tracking-tight leading-none ${
                      frame >= 446 ? "text-rose-600" : "text-slate-950"
                    }`}
                  >
                    {frame >= 446 ? "IT FRACTURES." : "CANNOT BEND"}
                  </span>
                </div>

                <div className="w-full flex items-center justify-around font-mono border-t border-slate-200 pt-3">
                  <span className="text-[18px] text-slate-500 font-bold uppercase">ELASTICITY: 0%</span>
                  <span className="text-[18px] text-rose-600 font-black uppercase">
                    {frame >= 446 ? "STRUCTURAL CLEAVAGE" : "BRITTLE COLLAPSE IMMINENT"}
                  </span>
                </div>
              </div>
            </StressFractureEngine>
          </ViscoelasticDeformation>
        </div>
      </WorldEntity>

      {/* ======================================================== */}
      {/* CHAMBER 3: THE CAST-IRON MONOLITH (World: [1400, 1500])  */}
      {/* "Stop using fragile grit... Anchor your mind into..."     */}
      {/* ======================================================== */}
      <WorldEntity worldX={1400} worldY={1500} width={960} height={1300} startFrame={470}>
        <div
          className="w-full h-full flex flex-col items-center justify-start pt-10"
          style={{
            opacity: monolithSpring,
            transform: `translateY(${interpolate(monolithSpring, [0, 1], [80, 0])}px)`,
          }}
        >
          {/* Sector Badge */}
          <div className="px-5 py-2 rounded-2xl bg-slate-950 text-white border-[2.5px] border-slate-800 shadow-md mb-6 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400" style={{ opacity: dotPulse }} />
            <span className="font-mono text-[22px] font-black tracking-wider uppercase">
              SECTOR 03 // CAST-IRON ARCHITECTURE
            </span>
          </div>

          <h2 className="font-sans text-[66px] font-black text-slate-950 uppercase tracking-tight text-center leading-[1.06] mb-6">
            ANCHOR THE MIND
          </h2>

          {/* High-Mass Light-Absorbing Obsidian / Cast-Iron Monolith */}
          <div
            className="w-[920px] p-10 rounded-3xl bg-[#090d16] text-white border-[3px] border-slate-800 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] flex flex-col items-center mb-6 relative overflow-hidden"
          >
            {/* Cast-Iron Matte Surface Texture Bevel */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: "inset 0 2px 3px rgba(255, 255, 255, 0.12), inset 0 -2px 3px rgba(0, 0, 0, 0.6)",
              }}
            />

            <div className="w-full flex items-center justify-between border-b border-slate-800 pb-4 mb-8">
              <span className="font-mono text-[22px] font-bold text-slate-400 tracking-wider uppercase">
                MATERIAL REPLACEMENT PROTOCOL
              </span>
              <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[18px] font-black uppercase">
                HIGH INERTIA
              </span>
            </div>

            {/* Inscribed Words using CapillaryInkBleed */}
            <div className="w-full flex flex-col items-center gap-4 my-2">
              {/* Line 1: WRITTEN */}
              <div className="flex items-center gap-4">
                <span className="font-mono text-[28px] font-black text-slate-500">01 //</span>
                <CapillaryInkBleed
                  startFrame={635}
                  text="WRITTEN."
                  fontSize={64}
                  textColor="#ffffff"
                  glowColor="rgba(16, 185, 129, 0.4)"
                />
              </div>

              {/* Line 2: EXTERNAL */}
              <div className="flex items-center gap-4">
                <span className="font-mono text-[28px] font-black text-slate-500">02 //</span>
                <CapillaryInkBleed
                  startFrame={658}
                  text="EXTERNAL."
                  fontSize={64}
                  textColor="#ffffff"
                  glowColor="rgba(16, 185, 129, 0.4)"
                />
              </div>

              {/* Line 3: UNBREAKABLE */}
              <div className="flex items-center gap-4">
                <span className="font-mono text-[28px] font-black text-emerald-400">03 //</span>
                <CapillaryInkBleed
                  startFrame={685}
                  text="UNBREAKABLE."
                  fontSize={64}
                  textColor="#38bdf8"
                  glowColor="rgba(56, 189, 248, 0.5)"
                />
              </div>
            </div>

            <div className="w-full mt-8 p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between font-mono">
              <span className="text-[20px] text-slate-400 font-bold uppercase">PHYSICAL PROPERTY:</span>
              <span className="text-[24px] text-emerald-400 font-black uppercase">PERMANENT DEPOSITED MASS</span>
            </div>
          </div>

          {/* Final Sovereign Directive Slam */}
          <div className="w-[920px] p-6 rounded-2xl bg-white border-[2.5px] border-slate-900 shadow-xl flex items-center justify-around">
            <span className="font-mono text-[28px] font-black text-slate-400 uppercase line-through">
              BRITTLE WILLPOWER
            </span>
            <span className="text-slate-300 font-black text-[32px]">→</span>
            <span className="font-mono text-[34px] font-black text-slate-950 uppercase">
              CAST-IRON SYSTEMS
            </span>
          </div>
        </div>
      </WorldEntity>

      {/* ======================================================== */}
      {/* MACRO BLUEPRINT OVERLAY                                  */}
      {/* ======================================================== */}
      <WorldEntity worldX={700} worldY={750} width={3300} height={3800} startFrame={685}>
        <div
          className="w-full h-full pointer-events-none flex flex-col items-center justify-between p-12"
          style={{ opacity: grandTitleOpacity }}
        >
          {/* Top Macro Header */}
          <div className="w-full flex items-center justify-between border-b-[4px] border-slate-950 pb-8">
            <div className="flex flex-col">
              <span className="font-mono text-[42px] font-black text-slate-900 tracking-widest uppercase">
                MATERIALITY FRONTIER // PROTOTYPE #02
              </span>
              <span className="font-mono text-[28px] font-bold text-slate-500">
                SYSTEM TRANSFORMATION: GLASS FRACTURE → CAST-IRON ANCHOR
              </span>
            </div>
            <div className="px-8 py-3 rounded-2xl bg-slate-950 text-white font-mono text-[32px] font-black">
              100% MATERIAL CAUSALITY
            </div>
          </div>

          {/* Bottom Macro Directive */}
          <div className="w-full flex items-center justify-between border-t-[4px] border-slate-950 pt-8">
            <span className="font-mono text-[36px] font-black text-slate-900 tracking-widest uppercase">
              RIGHTMOTION PHYSICAL SEMANTICS PROTOTYPE
            </span>
            <span className="font-mono text-[32px] font-black text-sky-600">
              BRITTLE COMPRESSION → STRUCTURAL CLEAVAGE → CAPILLARY INK
            </span>
          </div>
        </div>
      </WorldEntity>
    </InfiniteWorldCanvas>
  );
};
