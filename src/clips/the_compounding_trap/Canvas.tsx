import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { KineticScene } from "../../components/KineticScene";
import { CompoundGrowthChart } from "../../components/finance/CompoundGrowthChart";
import { WealthMultiplierMeter } from "../../components/finance/WealthMultiplierMeter";
import { CashFlowSankeyCard } from "../../components/finance/CashFlowSankeyCard";
import { FinanceTickerBadge } from "../../components/finance/FinanceTickerBadge";
import { IsometricCard } from "../../components/camera3d/IsometricCard";
import { PhysicalCard } from "../../components/physics/PhysicalCard";
import { SecondaryMotion } from "../../components/physics/SecondaryMotion";
import { VirtualCamera3D } from "../../components/camera3d/VirtualCamera3D";
import { SemanticWord } from "../../components/kinetic_text/SemanticWord";
import { GlitchText } from "../../components/kinetic_text/GlitchText";
import { CameraShake } from "../../components/kinetic_text/CameraShake";
import { HandDrawnDoodle } from "../../components/collage/HandDrawnDoodle";

// ─── SCENE TIMESTAMPS (ms) ──────────────────────────────────────────────────
// Scene 1: 0–4500ms    — "Ever wonder why you can work 60 hours..."
// Scene 2: 4500–8800ms — "It's because cash in a bank account isn't safe..."
// Scene 3: 8800–14000ms — "Inflation quietly steals 4–7%..."
// Scene 4: 14000–20000ms — "While the average person is proud of saving..."
// Scene 5: 20000–26000ms — "Wealthy people don't hoard cash..."
// Scene 6: 26000–31000ms — "Stop collecting paper. Start owning cash flow."
// Scene 7: 31000–37000ms — "Because the biggest financial risk in 2026..."

export const TheCompoundingTrapCanvas: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ms = (frame / fps) * 1000;

  return (
    <div className="absolute inset-0 w-full h-full">
      {/* ─── SCENE 1: THE BURNING QUESTION ──────────────────── */}
      <KineticScene startMs={0} endMs={4500} inTransition="snap_up" outTransition="zoom_out">
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8 gap-6">
          {/* Floating live ticker badges with physical follow-through inertia */}
          <div className="flex gap-4 flex-wrap justify-center">
            <SecondaryMotion delayMs={120} momentumDirection="up" dragTiltDeg={3.5} springPreset="heavyImpact" enableWobble={true}>
              <FinanceTickerBadge label="INFLATION" value="+6.8% YOY" type="loss" />
            </SecondaryMotion>
            <SecondaryMotion delayMs={220} momentumDirection="up" dragTiltDeg={-3.5} springPreset="heavyImpact" enableWobble={true}>
              <FinanceTickerBadge label="SAVINGS RATE" value="0.42% APY" type="loss" />
            </SecondaryMotion>
          </div>

          <PhysicalCard tiltX={5} tiltY={-5} elevation={22} className="w-[960px]">
            <div className="p-10 rounded-[40px] bg-slate-900/90 border-[3px] border-rose-500/40 shadow-2xl flex flex-col items-center gap-5 text-center">
              <div className="px-6 py-2 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-300 font-mono text-xl font-black uppercase tracking-widest">
                THE PRODUCTIVITY TRAP
              </div>
              <div className="text-white font-black text-5xl leading-tight">
                60 Hours A Week,<br />Every Dollar Saved.
              </div>
              <div className="relative inline-block mt-2 pb-2">
                <span className="text-rose-400 font-black text-4xl">Still Feel Broke?</span>
                <HandDrawnDoodle
                  preset="underline"
                  color="rose"
                  startMs={1500}
                  className="w-full absolute -bottom-5 left-0 h-7"
                />
              </div>
            </div>
          </PhysicalCard>
        </div>
      </KineticScene>

      {/* ─── SCENE 2: THE BANK ACCOUNT TRAP ─────────────────── */}
      <KineticScene startMs={4500} endMs={8800} inTransition="whip_left" outTransition="snap_up">
        <CameraShake triggerFrames={[Math.floor((4500 / 1000) * fps)]} intensity={7}>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-8 gap-6">
            <div className="text-slate-300 font-mono text-2xl font-bold uppercase tracking-widest">
              THE HIDDEN THREAT
            </div>
            <div className="text-center">
              <GlitchText
                className="text-white font-black leading-none"
                style={{ fontSize: "72px" }}
              >
                CASH IS NOT SAFE
              </GlitchText>
            </div>

            <IsometricCard tiltX={6} tiltY={-4} elevation={25} className="w-[960px]">
              <div className="p-9 rounded-[40px] bg-slate-900/90 border-[3px] border-amber-400/40 shadow-2xl text-center">
                <div className="text-amber-300 font-mono text-xl font-black uppercase tracking-widest mb-3">
                  WHAT YOUR BANK DOESN'T TELL YOU
                </div>
                <div className="text-white font-black text-4xl leading-snug">
                  Money sitting in a savings account<br />is slowly evaporating every single day.
                </div>
              </div>
            </IsometricCard>

            <FinanceTickerBadge label="REAL RETURN" value="-4.2% NET" type="loss" />
          </div>
        </CameraShake>
      </KineticScene>

      {/* ─── SCENE 3: INFLATION DATA REVEAL ─────────────────── */}
      <KineticScene startMs={8800} endMs={14000} inTransition="snap_up" outTransition="zoom_out">
        <VirtualCamera3D preset="isometric_shelf" readabilityLock={true} readabilityLockMs={2500}>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-8 gap-6">
            <div className="flex gap-4 flex-wrap justify-center">
              <FinanceTickerBadge label="INFLATION RATE" value="4–7% YOY" type="loss" />
              <FinanceTickerBadge label="SAVINGS YIELD" value="0.4% APY" type="neutral" />
            </div>

            <IsometricCard tiltX={7} tiltY={-5} elevation={28} className="w-[960px]">
              <div className="p-9 rounded-[40px] bg-slate-900/90 border-[3px] border-rose-500/50 shadow-[0_20px_60px_rgba(244,63,94,0.2)] flex flex-col gap-5">
                <div className="text-rose-400 font-mono text-xl font-black uppercase tracking-widest text-center">
                  ANNUAL WEALTH DESTRUCTION
                </div>
                {/* Visual bar comparing purchasing power */}
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="flex justify-between text-slate-300 font-mono text-xl font-bold mb-2">
                      <span>Year 1 ($10,000)</span><span className="text-white">$10,000</span>
                    </div>
                    <div className="h-6 rounded-full bg-emerald-500/30 border border-emerald-500/40 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full w-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-300 font-mono text-xl font-bold mb-2">
                      <span>Year 5 (After Inflation)</span><span className="text-rose-400">$7,835</span>
                    </div>
                    <div className="h-6 rounded-full bg-rose-500/20 border border-rose-500/30 overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full w-[78%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-300 font-mono text-xl font-bold mb-2">
                      <span>Year 10 (After Inflation)</span><span className="text-rose-600">$5,204</span>
                    </div>
                    <div className="h-6 rounded-full bg-rose-500/20 border border-rose-800/30 overflow-hidden">
                      <div className="h-full bg-rose-700 rounded-full w-[52%]" />
                    </div>
                  </div>
                </div>
                <div className="text-center text-rose-300 font-mono text-2xl font-black">
                  SAME CASH. HALF THE POWER.
                </div>
              </div>
            </IsometricCard>
          </div>
        </VirtualCamera3D>
      </KineticScene>

      {/* ─── SCENE 4: THE AVERAGE PERSON TRAP ───────────────── */}
      <KineticScene startMs={14000} endMs={20000} inTransition="whip_left" outTransition="snap_up">
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8 gap-6">
          <SemanticWord
            physics="gravity_drop"
            startMs={14200}
            className="text-white font-black text-center"
            style={{ fontSize: "64px" }}
          >
            $10,000 SAVED
          </SemanticWord>

          <WealthMultiplierMeter startMs={14600} className="w-[960px]" />

          <SecondaryMotion
            startMs={14600}
            delayMs={200}
            momentumDirection="up"
            springPreset="heavyImpact"
            enableWobble={true}
            wobbleIntensityDeg={4}
          >
            <div className="px-6 py-3 rounded-2xl bg-amber-950/60 border border-amber-500/40 text-amber-300 font-mono text-2xl font-black text-center">
              PROUD OF $10K SAVINGS? IT LOSES HALF ITS VALUE IN A DECADE.
            </div>
          </SecondaryMotion>
        </div>
      </KineticScene>

      {/* ─── SCENE 5: THE WEALTHY FORMULA ───────────────────── */}
      <KineticScene startMs={20000} endMs={26000} inTransition="snap_up" outTransition="zoom_out">
        <VirtualCamera3D preset="dramatic_swoop" readabilityLock={true} readabilityLockMs={2800}>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-8 gap-6">
            <div className="text-emerald-400 font-mono text-xl font-black uppercase tracking-widest">
              THE WEALTHY MINDSET
            </div>

            <CompoundGrowthChart startMs={20400} className="w-[960px]" />

            <div className="flex gap-4 flex-wrap justify-center">
              <FinanceTickerBadge label="COMPOUND ASSETS" value="+1040% RETURN" type="gain" />
            </div>
          </div>
        </VirtualCamera3D>
      </KineticScene>

      {/* ─── SCENE 6: THE CAPITAL ALLOCATION REVEAL ─────────── */}
      <KineticScene startMs={26000} endMs={31000} inTransition="whip_left" outTransition="snap_up">
        <CameraShake triggerFrames={[Math.floor((26000 / 1000) * fps)]} intensity={6}>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-8 gap-6">
            <SemanticWord
              physics="fracture"
              startMs={26200}
              className="text-white font-black text-center"
              style={{ fontSize: "60px" }}
            >
              STOP COLLECTING PAPER
            </SemanticWord>

            <CashFlowSankeyCard className="w-[960px]" />
          </div>
        </CameraShake>
      </KineticScene>

      {/* ─── SCENE 7: THE RISK OF PLAYING IT SAFE ───────────── */}
      <KineticScene startMs={31000} endMs={99999} inTransition="snap_up" outTransition="zoom_out">
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8 gap-6">
          <FinanceTickerBadge label="THE REAL RISK" value="INACTION" type="loss" />

          <IsometricCard tiltX={5} tiltY={-4} elevation={22} className="w-[960px]">
            <div className="p-10 rounded-[40px] bg-slate-900/90 border-[3px] border-emerald-500/60 shadow-[0_30px_80px_rgba(16,185,129,0.25)] flex flex-col items-center gap-5 text-center">
              <div className="text-emerald-300 font-mono text-xl font-black uppercase tracking-widest">
                THE MOST DANGEROUS FINANCIAL MOVE IN 2026
              </div>
              <GlitchText
                className="text-white font-black"
                style={{ fontSize: "72px" }}
              >
                PLAYING IT SAFE
              </GlitchText>
              <div className="text-slate-300 font-black text-3xl leading-snug">
                The biggest risk is not losing money.<br />It's watching your money slowly disappear.
              </div>
            </div>
          </IsometricCard>

          <div className="flex gap-4 flex-wrap justify-center">
            <FinanceTickerBadge label="START NOW" value="OWN CASH FLOW" type="gain" />
          </div>
        </div>
      </KineticScene>
    </div>
  );
};
