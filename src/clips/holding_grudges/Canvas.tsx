import React from "react";
import { ProCutout } from "../../components/ProCutout";
import { PropComparison } from "../../components/PropComparison";
import { KineticScene } from "../../components/KineticScene";
import { KineticCascadeItem } from "../../components/KineticCascade";
import { SingleIncidentCard } from "../../components/pure_graphics/SingleIncidentCard";
import { MetricCounterPill } from "../../components/pure_graphics/MetricCounterPill";
import { TimelineScrubber } from "../../components/pure_graphics/TimelineScrubber";
import { SimulationTree } from "../../components/pure_graphics/SimulationTree";
import { AppleToggleSwitch } from "../../components/pure_graphics/AppleToggleSwitch";
import { ClosureCard } from "../../components/pure_graphics/ClosureCard";
import { WordTimestamp } from "../../types";
import { AlertCircle, ShieldAlert } from "lucide-react";

interface CanvasProps {
  transcript: WordTimestamp[];
}

export const HoldingGrudgesCanvas: React.FC<CanvasProps> = () => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-20 select-none overflow-hidden">
      {/* ─────────────────────────────────────────────────────────────
          BEAT 0: THE SINGLE INCIDENT HOOK (0ms - 2100ms)
          "Ever notice how someone can hurt you once..."
      ───────────────────────────────────────────────────────────── */}
      <KineticScene
        startMs={0}
        endMs={2100}
        inTransition="snap_up"
        outTransition="zoom_out"
        inDurationMs={300}
        outDurationMs={240}
        livingDrift={true}
        className="!justify-start pt-[14%]"
      >
        <div className="w-full max-w-[960px] px-6">
          <KineticCascadeItem delayMs={60} durationMs={320} direction="up" distance={30}>
            <SingleIncidentCard />
          </KineticCascadeItem>
        </div>
      </KineticScene>

      {/* ─────────────────────────────────────────────────────────────
          BEAT 1: THE REPLAY LOOP TICKER (2100ms - 4800ms)
          "...and somehow you keep replaying it in your head for months?"
      ───────────────────────────────────────────────────────────── */}
      <KineticScene
        startMs={2100}
        endMs={4800}
        inTransition="whip_right"
        outTransition="zoom_out"
        inDurationMs={350}
        outDurationMs={260}
        livingDrift={true}
      >
        <div className="w-full max-w-[1000px] px-6">
          <KineticCascadeItem delayMs={2150} durationMs={380} direction="up" distance={35}>
            <MetricCounterPill
              startMs={2100}
              endMs={4800}
              targetCount={365}
              label="Replaying an event 365 times creates 100x the emotional damage of the original event."
              badge="REPLAY LOOP"
              unit="REPLAYS"
              accentColor="rose"
            />
          </KineticCascadeItem>
        </div>
      </KineticScene>

      {/* ─────────────────────────────────────────────────────────────
          BEAT 2: THE ROOT FRICTION • UNFINISHED EXPERIENCES (4800ms - 9100ms)
          "That's partly because your brain hates unfinished emotional experiences."
      ───────────────────────────────────────────────────────────── */}
      <KineticScene
        startMs={4800}
        endMs={9100}
        inTransition="snap_up"
        outTransition="zoom_out"
        inDurationMs={380}
        outDurationMs={260}
        livingDrift={true}
      >
        <div className="w-full max-w-[1000px] flex flex-col items-center gap-7 px-6 relative">
          <KineticCascadeItem delayMs={4800} durationMs={340} direction="down" distance={20}>
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 text-[260px] font-black text-slate-900/[0.04] leading-none tracking-tighter uppercase pointer-events-none select-none">
              LOOP
            </div>
          </KineticCascadeItem>

          <KineticCascadeItem delayMs={4850} durationMs={360} direction="up" distance={25}>
            <div className="px-10 py-3.5 rounded-full bg-slate-950 text-rose-400 font-mono text-[24px] font-black uppercase tracking-widest flex items-center gap-3.5 shadow-2xl border-2 border-rose-500/30">
              <AlertCircle className="w-7 h-7 text-rose-500" />
              STAGE 01 • UNFINISHED BUSINESS
            </div>
          </KineticCascadeItem>

          <KineticCascadeItem delayMs={4950} durationMs={420} direction="up" distance={45}>
            <div className="w-full rounded-[52px] p-12 bg-white/95 backdrop-blur-2xl border-[4px] border-rose-200 shadow-2xl flex items-center gap-8">
              <div className="w-64 h-64 shrink-0">
                <ProCutout
                  assetId="tangled_confusion_chaos"
                  glowColor="rose"
                  animation="punch_in"
                  annotation="RACING THOUGHTS"
                  annotationPosition="top-right"
                  width="100%"
                  height="100%"
                />
              </div>

              <div className="flex-1 flex flex-col gap-4">
                <div className="text-5xl font-black text-slate-950 uppercase tracking-tight leading-tight">
                  Brain Hates Open Loops
                </div>
                <div className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-950 font-black text-2xl md:text-3xl flex items-center gap-3">
                  <span className="w-4 h-4 rounded-full bg-rose-500 shrink-0" />
                  <span>Unresolved conflicts loop endlessly in memory</span>
                </div>
              </div>
            </div>
          </KineticCascadeItem>
        </div>
      </KineticScene>

      {/* ─────────────────────────────────────────────────────────────
          BEAT 3: MENTAL DVR MEMORY REWIND (9100ms - 12200ms)
          "It keeps revisiting what happened..."
      ───────────────────────────────────────────────────────────── */}
      <KineticScene
        startMs={9100}
        endMs={12200}
        inTransition="whip_right"
        outTransition="zoom_out"
        inDurationMs={360}
        outDurationMs={260}
        livingDrift={true}
      >
        <div className="w-full max-w-[1000px] px-6">
          <KineticCascadeItem delayMs={9150} durationMs={380} direction="up" distance={35}>
            <TimelineScrubber
              startMs={9100}
              endMs={12200}
              label="MENTAL DVR • AUTO-REWIND"
              sublabel="Your brain endlessly replays the memory searching for closure"
            />
          </KineticCascadeItem>
        </div>
      </KineticScene>

      {/* ─────────────────────────────────────────────────────────────
          BEAT 4: THE SIMULATION DECISION TREE (12200ms - 15200ms)
          "...almost like it's trying to figure out, 'How could I have prevented this?'"
      ───────────────────────────────────────────────────────────── */}
      <KineticScene
        startMs={12200}
        endMs={15200}
        inTransition="snap_up"
        outTransition="zoom_out"
        inDurationMs={360}
        outDurationMs={260}
        livingDrift={true}
      >
        <div className="w-full max-w-[1000px] px-6">
          <KineticCascadeItem delayMs={12250} durationMs={380} direction="up" distance={35}>
            <SimulationTree startMs={12200} />
          </KineticCascadeItem>
        </div>
      </KineticScene>

      {/* ─────────────────────────────────────────────────────────────
          BEAT 5: THE GRUDGE PARADOX • ILLUSION VS REALITY (15200ms - 23800ms)
          "So holding a grudge can feel like protecting yourself. But eventually,
           you're not protecting yourself from them anymore... you're carrying them around in your own head."
      ───────────────────────────────────────────────────────────── */}
      <KineticScene
        startMs={15200}
        endMs={23800}
        inTransition="whip_right"
        outTransition="snap_up"
        inDurationMs={400}
        outDurationMs={280}
        livingDrift={true}
      >
        <div className="w-full max-w-[1020px] flex flex-col items-center gap-6 px-6 relative">
          <KineticCascadeItem delayMs={15200} durationMs={340} direction="down" distance={20}>
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 text-[260px] font-black text-slate-900/[0.04] leading-none tracking-tighter uppercase pointer-events-none select-none">
              BURDEN
            </div>
          </KineticCascadeItem>

          <KineticCascadeItem delayMs={15250} durationMs={360} direction="up" distance={25}>
            <div className="px-10 py-3.5 rounded-full bg-slate-950 text-sky-400 font-mono text-[24px] font-black uppercase tracking-widest flex items-center gap-3.5 shadow-2xl border-2 border-sky-500/30">
              <ShieldAlert className="w-7 h-7 text-sky-400" />
              STAGE 02 • THE GRUDGE PARADOX
            </div>
          </KineticCascadeItem>

          <KineticCascadeItem delayMs={15350} durationMs={420} direction="up" distance={40}>
            <PropComparison
              leftAssetId="setting_boundary_stop_hand"
              leftTitle="The Illusion"
              leftSubtitle="Feels like armor & self-protection"
              leftBadge="WHAT IT FEELS LIKE"
              leftGlow="sky"

              rightAssetId="slumped_anxiety_scribble"
              rightTitle="The Reality"
              rightSubtitle="Carrying them rent-free in your own head"
              rightBadge="WHAT IT ACTUALLY IS"
              rightGlow="rose"

              centerDividerText="VS"
              startMs={15200}
              revealRightMs={18800}
              progressive={true}
            />
          </KineticCascadeItem>
        </div>
      </KineticScene>

      {/* ─────────────────────────────────────────────────────────────
          BEAT 6: APPLE TOGGLE SWITCH • REFRAME (23800ms - 27000ms)
          "You don't have to forgive someone just because they hurt you."
      ───────────────────────────────────────────────────────────── */}
      <KineticScene
        startMs={23800}
        endMs={27000}
        inTransition="snap_up"
        outTransition="zoom_out"
        inDurationMs={360}
        outDurationMs={260}
        livingDrift={true}
      >
        <div className="w-full max-w-[1000px] px-6">
          <KineticCascadeItem delayMs={23850} durationMs={380} direction="up" distance={35}>
            <AppleToggleSwitch />
          </KineticCascadeItem>
        </div>
      </KineticScene>

      {/* ─────────────────────────────────────────────────────────────
          BEAT 7: CLOSURE & EVICTION NOTICE (27000ms - 32280ms)
          "Sometimes healing simply means deciding: 'I'm not giving this any more space in me.'"
      ───────────────────────────────────────────────────────────── */}
      <KineticScene
        startMs={27000}
        endMs={32280}
        inTransition="zoom_in"
        outTransition="fade"
        inDurationMs={380}
        outDurationMs={200}
        livingDrift={true}
        className="!justify-start pt-[12%]"
      >
        <div className="w-full max-w-[1000px] px-6">
          <KineticCascadeItem delayMs={27050} durationMs={400} direction="up" distance={30}>
            <ClosureCard />
          </KineticCascadeItem>
        </div>
      </KineticScene>
    </div>
  );
};
