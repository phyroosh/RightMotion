import React from "react";
import {
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Img,
} from "remotion";
import { WordTimestamp } from "../../types";
import { AnimatedSlashStrike, CameraShake } from "../../components/kinetic_text";
import { CinematicIllustrationCard } from "../../components/CinematicIllustrationCard";
import { ThresholdBoundaryShift, ResistancePathway } from "../../components/transformation";

interface CanvasProps {
  transcript: WordTimestamp[];
}

/**
 * 🎬 RightMotion Canvas — SmallCompromises (60 FPS Master)
 * Topic: "How One Small Compromise Becomes a Habit Before You Notice"
 *
 * 📐 Safe Zone Law (Platform Safe Region):
 *   - Top clearance: explicit paddingTop: 280px (clearing top navigation 0–240px + buffer)
 *   - Maximum horizontal width: max-w-[820px] centered in px-8 (clearing right interaction rail)
 *   - Scene 4 width: max-w-[500px] ml-4 (clearing Judy who stands grounded on right)
 *   - Captions clearance: bottom margin strictly clears y: 1340px (captions start at y: 1380px)
 *   - Absolute minimum font size: 36px. Never smaller.
 *
 * ⏱️ Chronological Micro-Choreography (60 FPS):
 *   - Scene 1A (Frames 0–150): Mandatory Hero Illustration + Judy grounded close-up intro
 *   - Scene 1B (Frames 150–420): The False Assumption vs The 1° Concession
 *   - Scene 2A (Frames 420–630): 3D Brain Cutout + Moral Intent slashed + Precedent Tracker
 *   - Scene 2B (Frames 630–950): Standard Threshold Recalibration -> STATUS: OPTIONAL
 *   - Scene 3A (Frames 950–1290): Two-Pass Friction Collapse (100% -> 48% -> New Baseline)
 *   - Scene 3B (Frames 1272–1315): Dramatic Breath Hold (Micro-freeze before epiphany)
 *   - Scene 3C (Frames 1290–1475): Epiphany Release: OUTCOME slashed -> DEFEND THE THRESHOLD
 *   - Scene 4  (Frames 1475–1816): Decisive Resolution: "JUST THIS ONCE" = THE ENTIRE BATTLE
 */
export const SmallCompromisesCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Snappy spring helper
  const springFast = (delay: number) =>
    spring({
      frame: frame - delay,
      fps,
      config: { damping: 14, stiffness: 140, mass: 0.6 },
    });

  // Scene triggers accurately mapped to 60fps word timestamps
  const isScene1A = frame >= 0 && frame < 150;
  const isScene1B = frame >= 150 && frame < 420;
  const isScene2A = frame >= 420 && frame < 630;
  const isScene2B = frame >= 630 && frame < 950;
  const isScene3A = frame >= 950 && frame < 1290;
  const isScene3C = frame >= 1290 && frame < 1475;
  const isScene4  = frame >= 1475 && frame <= 1816;

  // Scene 1B springs
  const s1bSpring = springFast(155);
  const s1bStampSpring = springFast(300);

  // Scene 2A springs
  const s2aBrainSpring = springFast(425);
  const s2aMoralSpring = springFast(470);
  const s2aPrecedentSpring = springFast(570);

  // Scene 2B springs
  const s2bSpring = springFast(635);
  const s2bOptionalSpring = springFast(870);

  // Scene 3A springs (Friction drop from 100% to 48%)
  const s3aSpring = springFast(955);
  const frictionProgress = interpolate(frame, [1040, 1090], [100, 48], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const s3aNormSpring = springFast(1160);
  const baselineShiftProgress = interpolate(frame, [1170, 1220], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scene 3C springs (Epiphany Release)
  const s3cSpring = springFast(1295);
  const s3cThresholdSpring = springFast(1405);

  // Scene 4 springs (Decisive Resolution)
  const s4Spring = springFast(1480);
  const s4BattleSpring = springFast(1710);

  return (
    <div className="absolute inset-0 overflow-hidden select-none font-sans">
      {/* ======================================================== */}
      {/* SCENE 1A: MANDATORY HERO ILLUSTRATION INTRO (0 – 150)   */}
      {/* ======================================================== */}
      {isScene1A && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-start px-8"
          style={{ paddingTop: 280 }}
        >
          <div className="w-full max-w-[820px] flex flex-col items-center">
            {/* Editorial Header */}
            <div className="w-full mb-6 flex items-center justify-between">
              <span className="text-[36px] font-mono font-bold tracking-widest text-slate-500 uppercase">
                BEHAVIORAL EROSION
              </span>
              <span className="text-[36px] font-mono font-black text-rose-600 uppercase">
                01 // PREMISE
              </span>
            </div>

            {/* Bespoke 16:9 Hero Illustration Card */}
            <div className="w-full flex justify-center">
              <CinematicIllustrationCard
                imageSrc={staticFile("small_compromises/assets/scene_illustration.png")}
                width={820}
                height={460}
                accentColor="rose"
              />
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 1B: THE 1-DEGREE CONCESSION (150 – 420)           */}
      {/* ======================================================== */}
      {isScene1B && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-start px-8"
          style={{
            paddingTop: 280,
            opacity: interpolate(s1bSpring, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(s1bSpring, [0, 1], [30, 0])}px)`,
          }}
        >
          <div className="w-full max-w-[820px] flex flex-col gap-8">
            {/* Card 1: The False Assumption */}
            <div className="w-full p-8 rounded-3xl bg-slate-200 border-[2.5px] border-slate-400 flex flex-col gap-3">
              <span className="text-[36px] font-mono font-bold text-slate-600 uppercase">
                WHAT YOU FEAR
              </span>
              <span className="text-[56px] font-black text-slate-600 uppercase tracking-tight line-through decoration-rose-600 decoration-4">
                CATASTROPHIC FAILURE
              </span>
            </div>

            {/* Card 2: The Actual Reality */}
            <div className="w-full p-8 rounded-3xl bg-white border-[3px] border-slate-900 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.16)] flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[36px] font-mono font-black text-rose-600 uppercase">
                  HOW IT ACTUALLY HAPPENS
                </span>
                <span className="text-[36px] font-mono font-bold text-slate-500">
                  +1.0° SHIFT
                </span>
              </div>
              <div className="text-[64px] font-black text-[#090d16] leading-tight uppercase">
                ONE TINY CONCESSION
              </div>

              {/* Spoken stamp: "one-time exception" (Frame 300) */}
              {frame >= 300 && (
                <div
                  className="mt-4 p-5 rounded-2xl bg-slate-900 border-[2.5px] border-amber-400 flex items-center justify-between shadow-lg"
                  style={{
                    opacity: interpolate(s1bStampSpring, [0, 1], [0, 1]),
                    transform: `scale(${interpolate(s1bStampSpring, [0, 1], [0.92, 1])})`,
                  }}
                >
                  <span className="text-[40px] font-black text-amber-400 uppercase">
                    &ldquo;JUST THIS ONCE&rdquo;
                  </span>
                  <span className="text-[36px] font-mono font-bold text-white uppercase">
                    THE HINGE
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 2A: BRAIN TRACKS PRECEDENT, NOT MORALS (420 – 630) */}
      {/* ======================================================== */}
      {isScene2A && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-start px-8"
          style={{ paddingTop: 280 }}
        >
          <div className="w-full max-w-[820px] flex flex-col items-center gap-6">
            {/* 3D Brain Cutout Anchor (380px, crisp shadow) */}
            <div
              className="w-full flex justify-center"
              style={{
                opacity: interpolate(s2aBrainSpring, [0, 1], [0, 1]),
                transform: `scale(${interpolate(s2aBrainSpring, [0, 1], [0.85, 1])})`,
              }}
            >
              <Img
                src={staticFile("assets/psychology/hyperrealistic_3d_glowing_brain.png")}
                alt="3D Glowing Brain"
                className="w-[380px] h-auto object-contain drop-shadow-[0_24px_38px_rgba(0,0,0,0.18)]"
              />
            </div>

            {/* Block 1: Moral Significance (Slashed live at frame 510) */}
            {frame >= 470 && (
              <div
                className="relative w-full p-6 rounded-3xl bg-white border-[2.5px] border-slate-900 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.14)] flex items-center justify-between overflow-hidden"
                style={{
                  opacity: interpolate(s2aMoralSpring, [0, 1], [0, 1]),
                  transform: `translateY(${interpolate(s2aMoralSpring, [0, 1], [20, 0])}px)`,
                }}
              >
                <AnimatedSlashStrike
                  startFrame={510}
                  durationFrames={14}
                  preset="blade_slash"
                  color="rose"
                  strokeWidth={8}
                >
                  <span className="text-[52px] font-black text-[#090d16] uppercase">
                    MORAL SIGNIFICANCE
                  </span>
                </AnimatedSlashStrike>
                <span className="text-[36px] font-mono font-bold text-slate-500 uppercase">
                  IGNORED
                </span>
              </div>
            )}

            {/* Block 2: It Tracks Precedent (Slam impact at frame 570) */}
            {frame >= 570 && (
              <div
                className="w-full p-7 rounded-3xl bg-[#090d16] border-[2.5px] border-slate-900 shadow-2xl flex items-center justify-between text-white"
                style={{
                  opacity: interpolate(s2aPrecedentSpring, [0, 1], [0, 1]),
                  transform: `scale(${interpolate(s2aPrecedentSpring, [0, 1], [0.94, 1])})`,
                }}
              >
                <div className="flex flex-col">
                  <span className="text-[36px] font-mono font-bold text-emerald-400 uppercase">
                    NEURAL RULE
                  </span>
                  <span className="text-[56px] font-black tracking-tight text-white uppercase">
                    TRACKS PRECEDENT
                  </span>
                </div>
                <div className="text-[56px] font-mono font-black text-emerald-400">
                  +1
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 2B: BOUNDARY RECALIBRATION -> OPTIONAL (630 – 950) */}
      {/* ======================================================== */}
      {isScene2B && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-start px-8"
          style={{
            paddingTop: 280,
            opacity: interpolate(s2bSpring, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(s2bSpring, [0, 1], [25, 0])}px)`,
          }}
        >
          <div className="w-full max-w-[820px] flex flex-col gap-6">
            <div className="w-full flex items-center justify-between">
              <span className="text-[36px] font-mono font-bold text-slate-500 uppercase">
                MECHANISM // THRESHOLD RECALIBRATION
              </span>
              <span className="text-[36px] font-mono font-black text-rose-600 uppercase">
                ACTION OVER DISPLAY
              </span>
            </div>

            {/* Live Physical Boundary Displacement Primitive */}
            <div className="w-full p-8 pb-12 rounded-3xl bg-white border-[3px] border-slate-900 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.16)] flex flex-col gap-6">
              <ThresholdBoundaryShift
                triggerFrame={800}
                initialLabel="STRICT STANDARD"
                impulseLabel="JUST THIS ONCE"
                mutatedLabel="RECALIBRATED BASELINE"
                displacementPx={170}
                width={756}
              />
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 3A: THE FRICTION COLLAPSE (950 – 1290)            */}
      {/* ======================================================== */}
      {isScene3A && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-start px-8"
          style={{
            paddingTop: 280,
            opacity: interpolate(s3aSpring, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(s3aSpring, [0, 1], [25, 0])}px)`,
          }}
        >
          <div className="w-full max-w-[820px] flex flex-col gap-6">
            <div className="w-full flex items-center justify-between">
              <span className="text-[36px] font-mono font-bold text-slate-500 uppercase">
                EROSION // WORN PATHWAY DYNAMICS
              </span>
              <span className="text-[36px] font-mono font-black text-rose-600 uppercase">
                −52% RESISTANCE
              </span>
            </div>

            {/* Live Physical Resistance Pathway & Friction Decay Primitive */}
            <ResistancePathway
              pass1StartFrame={960}
              pass1Duration={60}
              pass2StartFrame={1040}
              pass2Duration={40}
              width={820}
            />

            {/* Live Baseline Normalization Notification with Ghost Memory Line */}
            {frame >= 1160 && (
              <div
                className="w-full p-6 rounded-2xl bg-slate-900 text-white border-[2.5px] border-slate-950 flex flex-col gap-2 shadow-2xl"
                style={{
                  opacity: interpolate(s3aNormSpring, [0, 1], [0, 1]),
                  transform: `translateY(${interpolate(s3aNormSpring, [0, 1], [20, 0])}px)`,
                }}
              >
                <div className="w-full flex items-center justify-between border-b border-slate-700 pb-2">
                  <span className="text-[36px] font-mono font-bold text-amber-400 uppercase">
                    NORMALIZATION COMPLETE
                  </span>
                  <span className="text-[36px] font-mono font-bold text-slate-400 uppercase">
                    NEW STANDARD
                  </span>
                </div>
                <div className="text-[44px] font-black uppercase text-white tracking-tight">
                  THE EXCEPTION BECOMES THE BASELINE
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 3C: EPIPHANY — DEFEND THE THRESHOLD (1290 – 1475)  */}
      {/* ======================================================== */}
      {isScene3C && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-start px-8"
          style={{
            paddingTop: 280,
            opacity: interpolate(s3cSpring, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(s3cSpring, [0, 1], [25, 0])}px)`,
          }}
        >
          <div className="w-full max-w-[820px] flex flex-col gap-6">
            {/* Wrong Target: OUTCOME (Slashed live at frame 1340) */}
            <div className="relative w-full p-6 rounded-3xl bg-white border-[2.5px] border-slate-900 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.14)] flex items-center justify-between overflow-hidden">
              <AnimatedSlashStrike
                startFrame={1340}
                durationFrames={14}
                preset="blade_slash"
                color="rose"
                strokeWidth={8}
              >
                <span className="text-[52px] font-black text-slate-700 uppercase">
                  DEFEND OUTCOME
                </span>
              </AnimatedSlashStrike>
              <span className="text-[36px] font-mono font-bold text-rose-600 uppercase">
                TOO LATE
              </span>
            </div>

            {/* True Solution: DEFEND THE THRESHOLD (Slams in at frame 1405) */}
            {frame >= 1405 && (
              <div
                className="w-full p-8 rounded-3xl bg-white border-[3.5px] border-slate-950 shadow-[0_28px_54px_-12px_rgba(0,0,0,0.22)] flex flex-col gap-4"
                style={{
                  opacity: interpolate(s3cThresholdSpring, [0, 1], [0, 1]),
                  transform: `scale(${interpolate(s3cThresholdSpring, [0, 1], [0.92, 1])})`,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[36px] font-mono font-bold text-emerald-600 uppercase">
                    ACTION PROTOCOL
                  </span>
                  <span className="text-[36px] font-mono font-black text-[#090d16] uppercase">
                    DAY 01
                  </span>
                </div>
                <div className="text-[68px] font-black text-[#090d16] uppercase leading-none">
                  DEFEND THE
                  <br />
                  <span className="text-emerald-600">THRESHOLD</span>
                </div>

                {/* Hand Cutout Anchor */}
                <div className="w-full flex justify-end mt-2">
                  <Img
                    src={staticFile("assets/relationships/setting_boundary_stop_hand.png")}
                    alt="Boundary Stop"
                    className="w-[260px] h-auto object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.18)]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 4: DECISIVE TAKEAWAY (1475 – 1816)                 */}
      {/* ======================================================== */}
      {isScene4 && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-start px-8"
          style={{
            paddingTop: 280,
            opacity: interpolate(s4Spring, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(s4Spring, [0, 1], [20, 0])}px)`,
          }}
        >
          {/* Stationed in top safe zone (y: 280 to 560px) cleanly above Judy */}
          <div className="w-full max-w-[820px] flex flex-col gap-4">
            <div className="w-full flex items-center justify-between">
              <span className="text-[36px] font-mono font-bold text-slate-500 uppercase">
                SOVEREIGN SHIFT
              </span>
              <span className="text-[36px] font-mono font-black text-emerald-600 uppercase">
                FINAL LAW
              </span>
            </div>

            {/* Unified Sovereign Statement Card */}
            <div className="w-full p-6 rounded-3xl bg-white border-[3px] border-slate-900 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.16)] flex flex-col gap-3">
              <div className="flex items-center justify-between border-b-[2px] border-slate-100 pb-2">
                <span className="text-[36px] font-mono font-bold text-rose-600 uppercase">
                  THE DECEPTIVE PHRASE
                </span>
                <span className="text-[40px] font-black text-[#090d16] uppercase">
                  &ldquo;JUST THIS ONCE&rdquo;
                </span>
              </div>

              {/* The Slam Payoff (Frame 1710) */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[36px] font-mono font-bold text-slate-500 uppercase">
                  THE REAL STAKES
                </span>
                <span
                  className="text-[44px] font-black uppercase text-emerald-600"
                  style={{
                    opacity: interpolate(s4BattleSpring, [0, 1], [0, 1]),
                    transform: `scale(${interpolate(s4BattleSpring, [0, 1], [0.94, 1])})`,
                  }}
                >
                  THE ENTIRE BATTLE
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
