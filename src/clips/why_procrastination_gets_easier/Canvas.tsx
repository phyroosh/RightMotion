import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { WordTimestamp } from "../../types";
import { AnimatedSlashStrike } from "../../components/kinetic_text";
import { MechanismStage } from "../../components/primitives/MechanismStage";
import { CinematicIllustrationCard } from "../../components/CinematicIllustrationCard";

interface CanvasProps {
  transcript: WordTimestamp[];
}

export const WhyProcrastinationGetsEasierCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ═════════════════════════════════════════════════════════════════════════════
  // SCENE PHASES (60 FPS calibrated from transcript.json timestamps)
  // ═════════════════════════════════════════════════════════════════════════════
  // Scene 1: Hook 1 (Editorial card + Judy host):     frames 0 → 150    (0.0s - 2.5s)
  // Scene 2: Hook 2 (Rewiring neural consequence):    frames 150 → 396  (2.5s - 6.6s)
  // Scene 3: Mechanism 1 (Stress drop plunge):        frames 396 → 620  (6.6s - 10.3s)
  // Scene 4: Mechanism 2 (Dopamine survival trap):    frames 620 → 940  (10.3s - 15.7s)
  // Scene 5: Mechanism 3 (Deepening neural furrow):   frames 940 → 1170 (15.7s - 19.5s)
  // Scene 6: Solution 1 (Decouple the task):          frames 1170 → 1350(19.5s - 22.5s)
  // Scene 7: Solution 2 (90-second threshold):        frames 1350 → 1550(22.5s - 25.8s)
  // Scene 8: Resolution (Threat evaporates & flow):   frames 1550 → 1787(25.8s - 29.8s)
  // ═════════════════════════════════════════════════════════════════════════════

  return (
    <MechanismStage top={270} bottom={1340}>
      {/* ───────────────────────────────────────────────────────────────────────
          SCENE 1: HOOK 1 (Frames 0 → 150)
          Intimate Scandinavian study illustration card + Judy host (Presenter.tsx)
          Narration: "Every time you postpone uncomfortable work..."
      ──────────────────────────────────────────────────────────────────────── */}
      {frame < 150 && (
        <div className="w-full h-full flex flex-col items-center justify-start pt-2">
          {/* Headline */}
          <div
            className="text-center mb-5"
            style={{
              opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
              transform: `translateY(${interpolate(frame, [0, 24], [-20, 0], { extrapolateRight: "clamp" })}px)`,
            }}
          >
            <div
              className="text-[#090d16] font-black uppercase tracking-tight"
              style={{ fontFamily: "Montserrat", fontSize: 58, lineHeight: 1.1 }}
            >
              The Avoidance Cycle
            </div>
            <div
              className="text-[#f43f5e] font-mono font-bold tracking-wider uppercase mt-1"
              style={{ fontSize: 36 }}
            >
              UNCOMFORTABLE WORK
            </div>
          </div>

          {/* Bespoke Editorial Hero Card */}
          <div
            className="flex items-center justify-center"
            style={{
              transform: `scale(${interpolate(frame, [0, 30], [0.92, 1], { extrapolateRight: "clamp" })})`,
              opacity: interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" }),
            }}
          >
            <CinematicIllustrationCard
              imageSrc="why_procrastination_gets_easier/assets/scene_illustration.png"
              width={760}
              height={440}
              entranceFrame={0}
              accentColor="rose"
              tiltX={2}
              tiltY={-2}
              enableKenBurns
            />
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────
          SCENE 2: HOOK 2 (Frames 150 → 396)
          Judy exits; we reveal the neural consequence:
          "you aren't just losing time—you're rewiring your brain to make quitting automatic."
      ──────────────────────────────────────────────────────────────────────── */}
      {frame >= 150 && frame < 396 && (
        <div className="w-full h-full flex flex-col items-center justify-start pt-4 px-4">
          {/* Kinetic Headline with Live Strike */}
          <div className="text-center mb-6">
            <div
              className="text-[#64748b] font-mono font-bold tracking-widest text-3xl uppercase mb-2"
              style={{
                opacity: interpolate(frame, [150, 165], [0, 1], { extrapolateRight: "clamp" }),
              }}
            >
              NOT JUST LOST TIME
            </div>

            <div className="relative inline-block mt-1">
              <AnimatedSlashStrike
                startFrame={180}
                durationFrames={12}
                color="rose"
                strokeWidth={9}
                angle={-10}
              >
                <span
                  className="text-[#090d16] font-black uppercase tracking-tight"
                  style={{
                    fontFamily: "Montserrat",
                    fontSize: 72,
                    lineHeight: 1.1,
                    opacity: frame >= 180 ? 0.45 : 1,
                  }}
                >
                  LOSING TIME
                </span>
              </AnimatedSlashStrike>
            </div>

            {frame >= 235 && (
              <div
                className="text-[#f43f5e] font-black uppercase tracking-tight mt-3"
                style={{
                  fontFamily: "Montserrat",
                  fontSize: 74,
                  lineHeight: 1.1,
                  transform: `scale(${spring({
                    frame: frame - 235,
                    fps,
                    config: { damping: 12, stiffness: 140 },
                  })})`,
                }}
              >
                REWIRING FOR FAILURE
              </div>
            )}
          </div>

          {/* Central Chaotic Cognitive Tangled Knot Cutout */}
          <div
            className="relative flex items-center justify-center mt-4"
            style={{
              transform: `scale(${spring({
                frame: frame - 155,
                fps,
                config: { damping: 14, stiffness: 120, mass: 0.8 },
              })}) rotate(${interpolate(frame, [150, 396], [-4, 4])}deg)`,
              opacity: interpolate(frame, [150, 170], [0, 1], { extrapolateRight: "clamp" }),
            }}
          >
            <Img
              src={staticFile("assets/psychology/tangled_confusion_chaos.png")}
              style={{
                width: 520,
                height: 520,
                objectFit: "contain",
                filter: "drop-shadow(0 25px 35px rgba(0,0,0,0.18))",
              }}
            />

            {/* Pulsing Synapse Circuit Sparks */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{
                opacity: interpolate(frame, [235, 270, 396], [0, 0.9, 0.4]),
              }}
            >
              <div className="w-80 h-80 rounded-full border-4 border-dashed border-[#f43f5e] animate-spin" />
            </div>
          </div>

          {/* Bottom Callout */}
          {frame >= 312 && (
            <div
              className="mt-6 text-[#090d16] font-mono font-bold text-center tracking-wide"
              style={{
                fontSize: 38,
                opacity: interpolate(frame, [312, 330], [0, 1], { extrapolateRight: "clamp" }),
              }}
            >
              AUTOMATIC QUITTING INSTINCT
            </div>
          )}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────
          SCENE 3: MECHANISM 1 (Frames 396 → 620)
          The Immediate Drop in Stress Hormones (Cortisol Gauge Plunge)
          Narration: "Delaying a task triggers an immediate drop in stress hormones."
      ──────────────────────────────────────────────────────────────────────── */}
      {frame >= 396 && frame < 620 && (
        <div className="w-full h-full flex flex-col items-center justify-start pt-4 px-6">
          {/* Header */}
          <div
            className="text-center mb-6"
            style={{
              opacity: interpolate(frame, [396, 415], [0, 1], { extrapolateRight: "clamp" }),
              transform: `translateY(${interpolate(frame, [396, 415], [-15, 0], { extrapolateRight: "clamp" })}px)`,
            }}
          >
            <div className="text-[#64748b] font-mono font-bold tracking-widest text-3xl uppercase">
              BIOLOGICAL SHORTCUT
            </div>
            <div
              className="text-[#090d16] font-black uppercase tracking-tight mt-1"
              style={{ fontFamily: "Montserrat", fontSize: 68, lineHeight: 1.1 }}
            >
              THE STRESS DROP
            </div>
          </div>

          {/* Physical Cortisol Pressure Hydraulic Meter */}
          {(() => {
            const dropTrigger = 492; // word: "drop"
            const isDropped = frame >= dropTrigger;
            const dropProgress = isDropped
              ? spring({
                  frame: frame - dropTrigger,
                  fps,
                  config: { damping: 12, stiffness: 140, mass: 0.6 },
                })
              : 0;

            const stressPercent = Math.round(
              interpolate(dropProgress, [0, 1], [96, 14], { extrapolateRight: "clamp" })
            );

            return (
              <div className="w-full max-w-[760px] flex flex-col items-center mt-2">
                {/* Metric Display */}
                <div className="w-full flex justify-between items-baseline px-4 mb-3">
                  <div className="text-left">
                    <div className="text-sm font-mono text-slate-500 uppercase tracking-wider font-bold">
                      CORTISOL / THREAT LOAD
                    </div>
                    <div
                      className="font-mono font-black"
                      style={{
                        fontSize: 78,
                        color: isDropped ? "#10b981" : "#f43f5e",
                        lineHeight: 1,
                      }}
                    >
                      {stressPercent}%
                    </div>
                  </div>

                  {isDropped && (
                    <div
                      className="text-right"
                      style={{
                        transform: `scale(${spring({
                          frame: frame - dropTrigger,
                          fps,
                          config: { damping: 10, stiffness: 160 },
                        })})`,
                      }}
                    >
                      <div className="text-sm font-mono text-emerald-600 font-bold tracking-wider">
                        INSTANT RELIEF
                      </div>
                      <div
                        className="font-mono font-black text-emerald-600"
                        style={{ fontSize: 60, lineHeight: 1 }}
                      >
                        -82%
                      </div>
                    </div>
                  )}
                </div>

                {/* Vertical Gauge Chamber */}
                <div className="w-full h-[380px] bg-slate-100 rounded-3xl p-3 border-4 border-slate-900 relative overflow-hidden shadow-2xl flex flex-col justify-end">
                  {/* Fluid Level with spring bounce */}
                  <div
                    className="w-full rounded-2xl transition-all duration-75 relative overflow-hidden"
                    style={{
                      height: `${stressPercent}%`,
                      background: isDropped
                        ? "linear-gradient(180deg, #34d399 0%, #059669 100%)"
                        : "linear-gradient(180deg, #fb7185 0%, #e11d48 100%)",
                      boxShadow: isDropped
                        ? "0 0 40px rgba(16, 185, 129, 0.4)"
                        : "0 0 40px rgba(244, 63, 94, 0.4)",
                    }}
                  >
                    <div className="absolute top-0 inset-x-0 h-4 bg-white/40" />
                  </div>

                  {/* Ghost Baseline Marker */}
                  <div
                    className="absolute inset-x-0 border-t-2 border-dashed border-slate-400 pointer-events-none"
                    style={{ top: "10%" }}
                  >
                    <span className="absolute right-4 -top-6 text-xs font-mono font-bold text-slate-500">
                      PRE-DELAY ANXIETY: 96%
                    </span>
                  </div>
                </div>

                {/* In-Scene Reaction Notice */}
                {isDropped && (
                  <div
                    className="mt-6 text-center"
                    style={{
                      opacity: interpolate(frame, [dropTrigger, dropTrigger + 20], [0, 1]),
                      transform: `scale(${spring({
                        frame: frame - dropTrigger,
                        fps,
                        config: { damping: 14, stiffness: 120 },
                      })})`,
                    }}
                  >
                    <span
                      className="text-[#090d16] font-black uppercase tracking-tight"
                      style={{ fontFamily: "Montserrat", fontSize: 52 }}
                    >
                      Temporary Relief Hits
                    </span>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────
          SCENE 4: MECHANISM 2 (Frames 620 → 940)
          The Survival Illusion & Dopamine Reward Loop
          Narration: "Your brain misinterprets this sudden relief as survival, cementing a dopamine reward loop for avoidance."
      ──────────────────────────────────────────────────────────────────────── */}
      {frame >= 620 && frame < 940 && (
        <div className="w-full h-full flex flex-col items-center justify-start pt-4 px-4">
          {/* Header */}
          <div
            className="text-center mb-4"
            style={{
              opacity: interpolate(frame, [620, 640], [0, 1], { extrapolateRight: "clamp" }),
            }}
          >
            <div className="text-[#f59e0b] font-mono font-bold tracking-widest text-3xl uppercase">
              FALSE SURVIVAL SIGNAL
            </div>
            <div
              className="text-[#090d16] font-black uppercase tracking-tight mt-1"
              style={{ fontFamily: "Montserrat", fontSize: 64, lineHeight: 1.1 }}
            >
              Dopamine Reward Loop
            </div>
          </div>

          {/* Central Dopamine Head Circuit Semantic Cutout */}
          <div
            className="relative flex items-center justify-center my-3"
            style={{
              transform: `scale(${spring({
                frame: frame - 625,
                fps,
                config: { damping: 14, stiffness: 130 },
              })})`,
            }}
          >
            <Img
              src={staticFile("assets/psychology/dopamine_head_circuit.png")}
              style={{
                width: 480,
                height: 480,
                objectFit: "contain",
                filter: "drop-shadow(0 25px 35px rgba(0,0,0,0.16))",
              }}
            />

            {/* Rotating Dopamine Orbit Ring */}
            <svg
              className="absolute pointer-events-none"
              width="540"
              height="540"
              viewBox="0 0 540 540"
              style={{
                transform: `rotate(${interpolate(frame, [620, 940], [0, 360])}deg)`,
              }}
            >
              <circle
                cx="270"
                cy="270"
                r="230"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="4"
                strokeDasharray="16 12"
                opacity="0.75"
              />
              <circle cx="500" cy="270" r="14" fill="#f59e0b" filter="drop-shadow(0 0 10px #f59e0b)" />
              <circle cx="40" cy="270" r="14" fill="#f59e0b" filter="drop-shadow(0 0 10px #f59e0b)" />
            </svg>

            {/* Central Stamp: RELIEF = SURVIVAL */}
            {frame >= 736 && (
              <div
                className="absolute bg-white border-4 border-slate-900 px-6 py-3 rounded-2xl shadow-2xl"
                style={{
                  top: "22%",
                  transform: `scale(${spring({
                    frame: frame - 736,
                    fps,
                    config: { damping: 10, stiffness: 180 },
                  })}) rotate(-4deg)`,
                }}
              >
                <span
                  className="text-[#090d16] font-black tracking-tight"
                  style={{ fontFamily: "Montserrat", fontSize: 44 }}
                >
                  RELIEF = SURVIVAL
                </span>
              </div>
            )}
          </div>

          {/* Spoken Action Reveal: Cementing Avoidance */}
          {frame >= 812 && (
            <div
              className="mt-4 text-center"
              style={{
                opacity: interpolate(frame, [812, 830], [0, 1], { extrapolateRight: "clamp" }),
                transform: `scale(${spring({
                  frame: frame - 812,
                  fps,
                  config: { damping: 12, stiffness: 150 },
                })})`,
              }}
            >
              <div
                className="text-[#f43f5e] font-black uppercase tracking-tight"
                style={{ fontFamily: "Montserrat", fontSize: 56, lineHeight: 1.1 }}
              >
                AVOIDANCE REINFORCED
              </div>
              <div className="text-slate-600 font-mono font-bold text-2xl mt-1">
                CHEMICAL REWARD COUPLING
              </div>
            </div>
          )}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────
          SCENE 5: MECHANISM 3 (Frames 940 → 1170)
          Deepening Neural Pathway / Furrow Carving
          Narration: "The more you delay, the deeper this neural pathway carves into your habits."
      ──────────────────────────────────────────────────────────────────────── */}
      {frame >= 940 && frame < 1170 && (
        <div className="w-full h-full flex flex-col items-center justify-start pt-4 px-4">
          {/* Header */}
          <div
            className="text-center mb-6"
            style={{
              opacity: interpolate(frame, [940, 960], [0, 1], { extrapolateRight: "clamp" }),
            }}
          >
            <div className="text-[#64748b] font-mono font-bold tracking-widest text-3xl uppercase">
              MYELINATION IN ACTION
            </div>
            <div
              className="text-[#090d16] font-black uppercase tracking-tight mt-1"
              style={{ fontFamily: "Montserrat", fontSize: 68, lineHeight: 1.1 }}
            >
              The Deepening Groove
            </div>
          </div>

          {/* Physical Furrow & Synaptic Trench Carving Mechanism */}
          {(() => {
            const carveTrigger = 1072; // word: "carves"
            const isCarving = frame >= carveTrigger;
            const carveProgress = isCarving
              ? spring({
                  frame: frame - carveTrigger,
                  fps,
                  config: { damping: 14, stiffness: 120 },
                })
              : 0;

            const depthMultiplier = (1 + carveProgress * 3.8).toFixed(1);
            const trenchWidth = interpolate(carveProgress, [0, 1], [6, 26]);

            return (
              <div className="w-full max-w-[820px] flex flex-col items-center mt-3">
                {/* Metric Readout */}
                <div className="w-full flex justify-between items-baseline px-4 mb-4">
                  <div>
                    <div className="text-sm font-mono text-slate-500 font-bold uppercase">
                      CHANNEL RESISTANCE
                    </div>
                    <div
                      className="font-mono font-black"
                      style={{
                        fontSize: 72,
                        color: isCarving ? "#10b981" : "#090d16",
                        lineHeight: 1,
                      }}
                    >
                      {isCarving ? "NEAR ZERO" : "NORMAL"}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-mono text-slate-500 font-bold uppercase">
                      GROOVE DEPTH
                    </div>
                    <div
                      className="font-mono font-black text-[#f43f5e]"
                      style={{ fontSize: 72, lineHeight: 1 }}
                    >
                      {depthMultiplier}x
                    </div>
                  </div>
                </div>

                {/* Visual SVG Trench Stage */}
                <svg
                  width="800"
                  height="260"
                  viewBox="0 0 800 260"
                  className="overflow-visible"
                >
                  {/* Faded Intentional Baseline (Ghost line) */}
                  <line
                    x1="40"
                    y1="60"
                    x2="760"
                    y2="60"
                    stroke="#94a3b8"
                    strokeWidth="3"
                    strokeDasharray="8 6"
                    opacity="0.6"
                  />
                  <text
                    x="50"
                    y="45"
                    fill="#64748b"
                    fontFamily="Montserrat"
                    fontSize="22"
                    fontWeight="bold"
                  >
                    INTENTIONAL FOCUS PATHWAY (ABANDONED)
                  </text>

                  {/* Carved Avoidance Canyon */}
                  <line
                    x1="40"
                    y1="160"
                    x2="760"
                    y2="160"
                    stroke="#090d16"
                    strokeWidth={trenchWidth}
                    strokeLinecap="round"
                  />

                  {/* Laser Hot-Core glowing inside the trench */}
                  <line
                    x1="40"
                    y1="160"
                    x2="760"
                    y2="160"
                    stroke={isCarving ? "#f43f5e" : "#cbd5e1"}
                    strokeWidth={Math.max(2, trenchWidth - 10)}
                    strokeLinecap="round"
                  />

                  {/* Traveling Impulse Bead */}
                  <circle
                    cx={interpolate(
                      (frame * 12) % 800,
                      [0, 800],
                      [60, 740]
                    )}
                    cy="160"
                    r={isCarving ? 16 : 10}
                    fill={isCarving ? "#f43f5e" : "#090d16"}
                    filter="drop-shadow(0 0 10px rgba(244,63,94,0.6))"
                  />
                </svg>

                {/* Subtitle Warning */}
                <div
                  className="mt-6 text-center"
                  style={{
                    opacity: interpolate(frame, [940, 965], [0, 1]),
                  }}
                >
                  <span
                    className="text-[#090d16] font-black uppercase tracking-tight"
                    style={{ fontFamily: "Montserrat", fontSize: 52 }}
                  >
                    Quitting Becomes Muscle Memory
                  </span>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────
          SCENE 6: SOLUTION 1 (Frames 1170 → 1350)
          Decouple the Task from Anxiety
          Narration: "To break the cycle, decouple the task from anxiety."
      ──────────────────────────────────────────────────────────────────────── */}
      {frame >= 1170 && frame < 1350 && (
        <div className="w-full h-full flex flex-col items-center justify-start pt-4 px-4">
          {/* Header */}
          <div
            className="text-center mb-6"
            style={{
              opacity: interpolate(frame, [1170, 1190], [0, 1], { extrapolateRight: "clamp" }),
            }}
          >
            <div className="text-[#10b981] font-mono font-bold tracking-widest text-3xl uppercase">
              THE SOLUTION PROTOCOL
            </div>
            <div
              className="text-[#090d16] font-black uppercase tracking-tight mt-1"
              style={{ fontFamily: "Montserrat", fontSize: 68, lineHeight: 1.1 }}
            >
              Break The Coupling
            </div>
          </div>

          {/* Physical Decoupling Mechanism */}
          {(() => {
            const cutTrigger = 1250; // word: "decouple"
            const isCut = frame >= cutTrigger;
            const recoil = isCut
              ? spring({
                  frame: frame - cutTrigger,
                  fps,
                  config: { damping: 12, stiffness: 150 },
                })
              : 0;

            const leftOffset = recoil * -60;
            const rightOffset = recoil * 60;

            return (
              <div className="w-full max-w-[800px] flex flex-col items-center mt-6">
                <div className="w-full flex items-center justify-between relative py-12">
                  {/* Left Node: THE TASK */}
                  <div
                    className="bg-white border-4 border-slate-900 rounded-3xl p-6 shadow-2xl z-10 text-center"
                    style={{
                      transform: `translateX(${leftOffset}px)`,
                      width: 320,
                    }}
                  >
                    <div className="text-xs font-mono text-slate-500 font-bold uppercase mb-1">
                      OBJECTIVE
                    </div>
                    <div
                      className="text-[#090d16] font-black uppercase"
                      style={{ fontFamily: "Montserrat", fontSize: 46 }}
                    >
                      THE WORK
                    </div>
                  </div>

                  {/* Severed Connection / Slash Blade */}
                  <div className="absolute inset-x-0 flex items-center justify-center">
                    <AnimatedSlashStrike
                      startFrame={cutTrigger}
                      durationFrames={10}
                      color="rose"
                      strokeWidth={12}
                      angle={-25}
                    >
                      <div
                        className="h-3 bg-slate-900 transition-all"
                        style={{
                          width: isCut ? 0 : 160,
                          opacity: isCut ? 0 : 1,
                        }}
                      />
                    </AnimatedSlashStrike>
                  </div>

                  {/* Right Node: ANXIETY */}
                  <div
                    className="border-4 rounded-3xl p-6 shadow-2xl z-10 text-center transition-all"
                    style={{
                      transform: `translateX(${rightOffset}px)`,
                      width: 320,
                      borderColor: isCut ? "#cbd5e1" : "#f43f5e",
                      backgroundColor: isCut ? "#f8fafc" : "#fff1f2",
                      opacity: isCut ? 0.4 : 1,
                    }}
                  >
                    <div className="text-xs font-mono text-slate-500 font-bold uppercase mb-1">
                      THREAT FILTER
                    </div>
                    <div
                      className="font-black uppercase"
                      style={{
                        fontFamily: "Montserrat",
                        fontSize: 46,
                        color: isCut ? "#94a3b8" : "#e11d48",
                      }}
                    >
                      ANXIETY
                    </div>
                  </div>
                </div>

                {/* Resolution Stamp */}
                {isCut && (
                  <div
                    className="mt-8 text-center"
                    style={{
                      transform: `scale(${spring({
                        frame: frame - cutTrigger,
                        fps,
                        config: { damping: 12, stiffness: 160 },
                      })})`,
                    }}
                  >
                    <span
                      className="text-[#10b981] font-black uppercase tracking-tight"
                      style={{ fontFamily: "Montserrat", fontSize: 62 }}
                    >
                      SEVER THE EMOTIONAL LINK
                    </span>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────
          SCENE 7: SOLUTION 2 (Frames 1350 → 1550)
          The 90-Second Entry Threshold
          Narration: "Shrink your starting threshold to just ninety seconds of friction."
      ──────────────────────────────────────────────────────────────────────── */}
      {frame >= 1350 && frame < 1550 && (
        <div className="w-full h-full flex flex-col items-center justify-start pt-4 px-4">
          {/* Header */}
          <div
            className="text-center mb-5"
            style={{
              opacity: interpolate(frame, [1350, 1370], [0, 1], { extrapolateRight: "clamp" }),
            }}
          >
            <div className="text-[#64748b] font-mono font-bold tracking-widest text-3xl uppercase">
              MICRO-ENTRY ARCHITECTURE
            </div>
            <div
              className="text-[#090d16] font-black uppercase tracking-tight mt-1"
              style={{ fontFamily: "Montserrat", fontSize: 66, lineHeight: 1.1 }}
            >
              Shrink The Threshold
            </div>
          </div>

          {/* Mechanical Resistance Wall Compression */}
          {(() => {
            const shrinkTrigger = 1360; // word: "shrink"
            const isShrunk = frame >= shrinkTrigger;
            const shrinkProgress = isShrunk
              ? spring({
                  frame: frame - shrinkTrigger,
                  fps,
                  config: { damping: 14, stiffness: 130 },
                })
              : 0;

            const barrierHeight = interpolate(shrinkProgress, [0, 1], [360, 70]);

            return (
              <div className="w-full max-w-[780px] flex flex-col items-center mt-2">
                {/* Friction Comparison Metrics */}
                <div className="w-full flex justify-between items-baseline px-4 mb-3">
                  <div>
                    <div className="text-sm font-mono text-slate-500 font-bold uppercase">
                      STARTING COST
                    </div>
                    <div
                      className="font-mono font-black"
                      style={{
                        fontSize: 88,
                        color: isShrunk ? "#090d16" : "#f43f5e",
                        lineHeight: 1,
                      }}
                    >
                      {isShrunk ? "90 SEC" : "2 HOURS"}
                    </div>
                  </div>

                  {isShrunk && (
                    <div
                      className="text-right"
                      style={{
                        transform: `scale(${spring({
                          frame: frame - shrinkTrigger,
                          fps,
                          config: { damping: 10, stiffness: 180 },
                        })})`,
                      }}
                    >
                      <div className="text-sm font-mono text-emerald-600 font-bold uppercase">
                        FRICTION DROP
                      </div>
                      <div
                        className="font-mono font-black text-[#10b981]"
                        style={{ fontSize: 72, lineHeight: 1 }}
                      >
                        -95%
                      </div>
                    </div>
                  )}
                </div>

                {/* Compression Stage Box */}
                <div className="w-full h-[320px] bg-slate-100 rounded-3xl p-4 border-4 border-slate-900 relative flex items-end justify-center overflow-hidden shadow-2xl">
                  {/* Compressible Physical Barrier */}
                  <div
                    className="w-full rounded-2xl flex items-center justify-center transition-all duration-75 relative"
                    style={{
                      height: barrierHeight,
                      background: isShrunk
                        ? "linear-gradient(180deg, #10b981 0%, #059669 100%)"
                        : "linear-gradient(180deg, #f43f5e 0%, #e11d48 100%)",
                      boxShadow: isShrunk
                        ? "0 0 35px rgba(16,185,129,0.3)"
                        : "0 0 35px rgba(244,63,94,0.3)",
                    }}
                  >
                    <span
                      className="text-white font-mono font-black tracking-wider uppercase"
                      style={{ fontSize: isShrunk ? 38 : 52 }}
                    >
                      {isShrunk ? "90s LOW FRICTION ENTRY" : "HIGH THREAT WALL"}
                    </span>
                  </div>
                </div>

                {/* Actionable Rule */}
                <div
                  className="mt-6 text-center"
                  style={{
                    opacity: interpolate(frame, [1360, 1390], [0, 1]),
                  }}
                >
                  <span
                    className="text-[#090d16] font-black uppercase tracking-tight"
                    style={{ fontFamily: "Montserrat", fontSize: 50 }}
                  >
                    Action Precedes Motivation
                  </span>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────
          SCENE 8: RESOLUTION (Frames 1550 → 1787)
          Threat Evaporates & 3D Glowing Brain Flow
          Narration: "Lower the perceived threat, and the urge to flee evaporates."
      ──────────────────────────────────────────────────────────────────────── */}
      {frame >= 1550 && (
        <div className="w-full h-full flex flex-col items-center justify-start pt-4 px-4">
          {/* Top Dominant Impression */}
          <div
            className="text-center mb-3"
            style={{
              opacity: interpolate(frame, [1550, 1575], [0, 1], { extrapolateRight: "clamp" }),
              transform: `translateY(${interpolate(frame, [1550, 1575], [-15, 0], { extrapolateRight: "clamp" })}px)`,
            }}
          >
            <div className="text-[#10b981] font-mono font-bold tracking-widest text-3xl uppercase">
              THREAT NEUTRALIZED
            </div>

            {/* Evaporating Dissolving Text */}
            <div className="relative inline-block mt-2">
              <span
                className="text-[#090d16] font-black uppercase tracking-tight"
                style={{
                  fontFamily: "Montserrat",
                  fontSize: 76,
                  lineHeight: 1.1,
                  display: "inline-block",
                  opacity: interpolate(frame, [1680, 1725], [1, 0.15], { extrapolateRight: "clamp" }),
                  transform: `translateY(${interpolate(frame, [1680, 1725], [0, -35], { extrapolateRight: "clamp" })}px) scale(${interpolate(frame, [1680, 1725], [1, 0.92], { extrapolateRight: "clamp" })})`,
                  filter: `blur(${interpolate(frame, [1680, 1725], [0, 10], { extrapolateRight: "clamp" })}px)`,
                }}
              >
                URGE TO FLEE
              </span>
            </div>
          </div>

          {/* Glowing 3D Synaptic Brain Semantic Cutout */}
          <div
            className="relative flex items-center justify-center my-2"
            style={{
              transform: `scale(${spring({
                frame: frame - 1560,
                fps,
                config: { damping: 12, stiffness: 110, mass: 0.8 },
              })}) translateY(${Math.sin(frame / 20) * 8}px)`,
            }}
          >
            <Img
              src={staticFile("assets/psychology/hyperrealistic_3d_glowing_brain.png")}
              style={{
                width: 520,
                height: 520,
                objectFit: "contain",
                filter: "drop-shadow(0 25px 45px rgba(16,185,129,0.25))",
              }}
            />

            {/* Synaptic Halo Glow */}
            <div
              className="absolute inset-0 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none"
              style={{
                opacity: interpolate(frame, [1550, 1620], [0, 0.7]),
              }}
            />
          </div>

          {/* Final Decisive Takeaway (Hard Impact, No CTA) */}
          {frame >= 1620 && (
            <div
              className="mt-3 text-center"
              style={{
                opacity: interpolate(frame, [1620, 1650], [0, 1], { extrapolateRight: "clamp" }),
                transform: `scale(${spring({
                  frame: frame - 1620,
                  fps,
                  config: { damping: 14, stiffness: 140 },
                })})`,
              }}
            >
              <div
                className="text-[#090d16] font-black uppercase tracking-tight"
                style={{ fontFamily: "Montserrat", fontSize: 62, lineHeight: 1.1 }}
              >
                Lower The Friction.
              </div>
              <div
                className="text-[#10b981] font-black uppercase tracking-tight mt-1"
                style={{ fontFamily: "Montserrat", fontSize: 62, lineHeight: 1.1 }}
              >
                Action Follows.
              </div>
            </div>
          )}
        </div>
      )}
    </MechanismStage>
  );
};


