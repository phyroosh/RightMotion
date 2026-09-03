import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { KineticScene } from "../../components/KineticScene";
import { BiometricRing } from "../../components/health/BiometricRing";
import { CircadianClock } from "../../components/health/CircadianClock";
import { CortisolSpikeGraph } from "../../components/health/CortisolSpikeGraph";
import { MetabolicStatusCard } from "../../components/health/MetabolicStatusCard";
import { IsometricCard } from "../../components/camera3d/IsometricCard";
import { PhysicalCard } from "../../components/physics/PhysicalCard";
import { SecondaryMotion } from "../../components/physics/SecondaryMotion";
import { VirtualCamera3D } from "../../components/camera3d/VirtualCamera3D";
import { SemanticWord } from "../../components/kinetic_text/SemanticWord";
import { GlitchText } from "../../components/kinetic_text/GlitchText";
import { CameraShake } from "../../components/kinetic_text/CameraShake";
import { HandDrawnDoodle } from "../../components/collage/HandDrawnDoodle";
import { HighlighterStroke } from "../../components/collage/HighlighterStroke";

// ─── SCENE TIMESTAMPS (ms) ──────────────────────────────────────────────────
// Scene 1: 0–4000ms     — Hook: "Ever notice how you fall asleep exhausted..."
// Scene 2: 4000–8500ms  — "That's not random insomnia. That's a metabolic signal."
// Scene 3: 8500–14000ms — "Around 3 AM, your liver runs low on glycogen..."
// Scene 4: 14000–20000ms — "Cortisol & adrenaline dump into your bloodstream..."
// Scene 5: 20000–26000ms — "Heart beats faster, eyes snap open..."
// Scene 6: 26000–31000ms — "You don't have an anxiety problem..."
// Scene 7: 31000–37000ms — "One spoon of healthy fats before bed..."

export const The3amCortisolSpikeCanvas: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ms = (frame / fps) * 1000;

  return (
    <div className="absolute inset-0 w-full h-full">

      {/* ─── SCENE 1: THE HOOK ───────────────────────────────── */}
      <KineticScene startMs={0} endMs={4000} inTransition="snap_up" outTransition="zoom_out">
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8 gap-6">
          {/* Biometric Ring preview hint with fluid secondary elasticity */}
          <SecondaryMotion delayMs={140} momentumDirection="up" dragTiltDeg={2.5} springPreset="fluidTelemetry" enableDrift={true}>
            <div className="px-8 py-2.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-mono text-xl font-black uppercase tracking-widest">
              SLEEP TELEMETRY ALERT
            </div>
          </SecondaryMotion>

          <PhysicalCard tiltX={6} tiltY={-5} elevation={24} className="w-[960px]">
            <div className="p-10 rounded-[40px] bg-slate-900/90 border-[3px] border-rose-500/40 shadow-2xl text-center flex flex-col gap-4">
              <div className="text-slate-300 font-black text-3xl">You Fall Asleep Exhausted…</div>
              <div className="text-white font-black" style={{ fontSize: "56px", lineHeight: 1.15 }}>
                You Violently Wake Up At
              </div>
              <div className="relative inline-block mx-auto my-2">
                <span className="text-rose-400 font-mono font-black" style={{ fontSize: "80px" }}>
                  3 AM
                </span>
                <HandDrawnDoodle
                  preset="circle"
                  color="rose"
                  startMs={1500}
                  className="absolute inset-0 -m-3 w-[125%] h-[125%]"
                />
              </div>
              <div className="text-slate-300 font-black text-3xl">Mind Racing. Heart Pounding.</div>
            </div>
          </PhysicalCard>
        </div>
      </KineticScene>

      {/* ─── SCENE 2: NOT INSOMNIA — METABOLIC SIGNAL ───────── */}
      <KineticScene startMs={4000} endMs={8500} inTransition="whip_left" outTransition="snap_up">
        <CameraShake triggerFrames={[Math.floor((4000 / 1000) * fps)]} intensity={8}>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-8 gap-6">
            <SemanticWord physics="fracture" startMs={4200}
              className="text-white font-black text-center" style={{ fontSize: "60px" }}>
              NOT RANDOM INSOMNIA
            </SemanticWord>

            <IsometricCard tiltX={5} tiltY={-4} elevation={20} className="w-[960px]">
              <div className="p-9 rounded-[40px] bg-slate-900/90 border-[3px] border-cyan-500/50 shadow-[0_20px_60px_rgba(6,182,212,0.2)] text-center flex flex-col gap-4">
                <div className="text-cyan-400 font-mono font-black text-xl uppercase tracking-widest">
                  CELLULAR BIOLOGY DIAGNOSIS
                </div>
                <div className="text-white font-black text-4xl leading-snug">
                  That 3 AM jolt is an<br />
                  <span className="text-rose-400">Emergency Metabolic Signal</span>
                </div>
              </div>
            </IsometricCard>

            <CircadianClock className="w-[960px]" />
          </div>
        </CameraShake>
      </KineticScene>

      {/* ─── SCENE 3: LIVER GLYCOGEN DEPLETION ──────────────── */}
      <KineticScene startMs={8500} endMs={14000} inTransition="snap_up" outTransition="zoom_out">
        <VirtualCamera3D preset="isometric_shelf" readabilityLock={true} readabilityLockMs={2500}>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-8 gap-6">
            <div className="text-cyan-300 font-mono text-xl font-black uppercase tracking-widest">
              WHAT HAPPENS AT 3 AM
            </div>

            <BiometricRing startMs={8800} className="w-[960px]" />
          </div>
        </VirtualCamera3D>
      </KineticScene>

      {/* ─── SCENE 4: CORTISOL DUMP TELEMETRY ───────────────── */}
      <KineticScene startMs={14000} endMs={20000} inTransition="whip_left" outTransition="snap_up">
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8 gap-6">
          <div className="text-rose-400 font-mono font-black text-xl uppercase tracking-widest">
            HORMONAL EMERGENCY RESPONSE
          </div>

          <CortisolSpikeGraph startMs={14400} className="w-[960px]" />

          <IsometricCard tiltX={4} tiltY={-3} elevation={15} className="w-[960px]">
            <div className="p-7 rounded-[36px] bg-slate-900/90 border-[3px] border-rose-500/40 shadow-xl flex gap-4 items-start">
              <div className="w-3 h-3 rounded-full bg-rose-500 shrink-0 mt-2 animate-ping" />
              <div className="text-white font-black text-3xl leading-snug">
                Adrenal glands dump cortisol & adrenaline directly into your bloodstream to prevent hypoglycemia.
              </div>
            </div>
          </IsometricCard>
        </div>
      </KineticScene>

      {/* ─── SCENE 5: PHYSICAL SYMPTOMS ─────────────────────── */}
      <KineticScene startMs={20000} endMs={26000} inTransition="snap_up" outTransition="zoom_out">
        <CameraShake triggerFrames={[Math.floor((20000 / 1000) * fps)]} intensity={7}>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-8 gap-5">
            <div className="text-slate-300 font-mono text-xl font-black uppercase tracking-widest">
              THE 3 AM EMERGENCY SYMPTOMS
            </div>
            <div className="w-[960px] flex flex-col gap-4">
              {[
                { icon: "❤️", text: "Heart Rate Spikes", color: "rose" },
                { icon: "👁️", text: "Eyes Snap Wide Open", color: "cyan" },
                { icon: "🧠", text: "Brain Searches For Threats", color: "amber" },
              ].map((item, i) => (
                <IsometricCard key={i} tiltX={4} tiltY={-3} elevation={15}>
                  <div className={`p-6 rounded-3xl bg-slate-900/90 border-[3px] border-${item.color}-500/40 flex items-center gap-5`}>
                    <span className="text-5xl">{item.icon}</span>
                    <div className={`text-${item.color}-300 font-black text-3xl`}>{item.text}</div>
                  </div>
                </IsometricCard>
              ))}
            </div>
          </div>
        </CameraShake>
      </KineticScene>

      {/* ─── SCENE 6: REFRAME — NOT ANXIETY ─────────────────── */}
      <KineticScene startMs={26000} endMs={31000} inTransition="whip_left" outTransition="snap_up">
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8 gap-6">
          <IsometricCard tiltX={6} tiltY={-4} elevation={24} className="w-[960px]">
            <div className="p-10 rounded-[40px] bg-slate-900/90 border-[3px] border-emerald-500/50 shadow-[0_30px_80px_rgba(16,185,129,0.2)] text-center flex flex-col gap-5">
              <div className="text-slate-400 font-black text-2xl line-through">
                "I have an anxiety problem at night."
              </div>
              <HandDrawnDoodle preset="scribble_cross" color="rose" startMs={26400}
                className="mx-auto w-48" />
              <div className="text-emerald-400 font-mono font-black text-xl uppercase tracking-widest">
                THE REAL DIAGNOSIS
              </div>
              <div className="text-white font-black text-4xl leading-snug">
                You have an<br />
                <span className="text-emerald-400">Evening Glucose Crash</span>
              </div>
            </div>
          </IsometricCard>
        </div>
      </KineticScene>

      {/* ─── SCENE 7: THE PROTOCOL (SOLUTION) ───────────────── */}
      <KineticScene startMs={31000} endMs={99999} inTransition="snap_up" outTransition="zoom_out">
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8 gap-6">
          <div className="text-emerald-400 font-mono font-black text-xl uppercase tracking-widest">
            THE METABOLIC PROTOCOL
          </div>

          <MetabolicStatusCard className="w-[960px]" />

          <div className="flex gap-3 flex-wrap justify-center">
            <div className="px-6 py-2 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 font-mono font-black text-xl">
              UNBROKEN SLEEP ✓
            </div>
            <div className="px-6 py-2 rounded-full bg-emerald-950/80 border border-emerald-400/50 text-emerald-300 font-mono font-black text-xl">
              CALM NERVOUS SYSTEM ✓
            </div>
          </div>
        </div>
      </KineticScene>

    </div>
  );
};
