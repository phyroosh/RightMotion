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
          BEAT 0: THE SINGLE INCIDENT HOOK (0ms - 2400ms)
          "Ever notice how someone can hurt you once..."
      ───────────────────────────────────────────────────────────── */}
      <KineticScene
        startMs={0}
        endMs={2400}
        inTransition="snap_up"
        outTransition="zoom_out"
        inDurationMs={320}
        outDurationMs={260}
        livingDrift={true}
        className="!justify-start pt-[14%]"
      >
        <div className="w-full max-w-[940px] px-6">
          <KineticCascadeItem delayMs={100} durationMs={350} direction="up" distance={30}>
            <SingleIncidentCard />
          </KineticCascadeItem>
        </div>
      </KineticScene>

      {/* ─────────────────────────────────────────────────────────────
          BEAT 1: THE REPLAY LOOP TICKER (2400ms - 5300ms)
          "...and somehow you keep replaying it in your head for months?"
      ───────────────────────────────────────────────────────────── */}
      <KineticScene
        startMs={2400}
        endMs={5300}
        inTransition="whip_right"
        outTransition="zoom_out"
        inDurationMs={380}
        outDurationMs={280}
        livingDrift={true}
      >
        <div className="w-full max-w-[960px] px-6">
          <KineticCascadeItem delayMs={2450} durationMs={400} direction="up" distance={35}>
            <MetricCounterPill
              startMs={2400}
              endMs={5300}
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
          BEAT 2: THE ROOT FRICTION • UNFINISHED EXPERIENCES (5300ms - 9800ms)
          "That's partly because your brain hates unfinished emotional experiences."
      ───────────────────────────────────────────────────────────── */}
      <KineticScene
        startMs={5300}
        endMs={9800}
        inTransition="snap_up"
        outTransition="zoom_out"
        inDurationMs={400}
        outDurationMs={280}
        livingDrift={true}
      >
        <div className="w-full max-w-[1000px] flex flex-col items-center gap-7 px-6 relative">
          <KineticCascadeItem delayMs={5300} durationMs={360} direction="down" distance={20}>
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 text-[260px] font-black text-slate-900/[0.04] leading-none tracking-tighter uppercase pointer-events-none select-none">
              LOOP
            </div>
          </KineticCascadeItem>

          <KineticCascadeItem delayMs={5360} durationMs={380} direction="up" distance={25}>
            <div className="px-10 py-3.5 rounded-full bg-slate-950 text-rose-400 font-mono text-[22px] font-black uppercase tracking-widest flex items-center gap-3.5 shadow-2xl border-2 border-rose-500/30">
              <AlertCircle className="w-7 h-7 text-rose-500" />
              STAGE 01 • UNFINISHED BUSINESS
            </div>
          </KineticCascadeItem>

          <KineticCascadeItem delayMs={5460} durationMs={450} direction="up" distance={45}>
            <div className="w-full rounded-[52px] p-10 bg-white/95 backdrop-blur-2xl border-[4px] border-rose-200/80 shadow-2xl flex items-center gap-8">
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
                <div className="text-4xl font-black text-slate-950 uppercase tracking-tight leading-tight">
                  Brain Hates Open Loops
                </div>
                <div className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-200/80 text-rose-950 font-black text-2xl flex items-center gap-3">
                  <span className="w-3.5 h-3.5 rounded-full bg-rose-500 shrink-0" />
                  <span>The Zeigarnik effect traps unresolved conflicts in active memory</span>
                </div>
              </div>
            </div>
          </KineticCascadeItem>
        </div>
      </KineticScene>

      {/* ─────────────────────────────────────────────────────────────
          BEAT 3: MENTAL DVR MEMORY REWIND (9800ms - 13200ms)
          "It keeps revisiting what happened..."
      ───────────────────────────────────────────────────────────── */}
      <KineticScene
        startMs={9800}
        endMs={13200}
        inTransition="whip_right"
        outTransition="zoom_out"
        inDurationMs={380}
        outDurationMs={280}
        livingDrift={true}
      >
        <div className="w-full max-w-[980px] px-6">
          <KineticCascadeItem delayMs={9850} durationMs={400} direction="up" distance={35}>
            <TimelineScrubber
              startMs={9800}
              endMs={13200}
              label="MENTAL DVR • AUTO-REWIND"
              sublabel="Your brain endlessly replays the memory searching for missing closure"
            />
          </KineticCascadeItem>
        </div>
      </KineticScene>

      {/* ─────────────────────────────────────────────────────────────
          BEAT 4: THE SIMULATION DECISION TREE (13200ms - 16600ms)
          "...almost like it's trying to figure out, 'How could I have prevented this?'"
      ───────────────────────────────────────────────────────────── */}
      <KineticScene
        startMs={13200}
        endMs={16600}
        inTransition="snap_up"
        outTransition="zoom_out"
        inDurationMs={380}
        outDurationMs={280}
        livingDrift={true}
      >
        <div className="w-full max-w-[980px] px-6">
          <KineticCascadeItem delayMs={13250} durationMs={400} direction="up" distance={35}>
            <SimulationTree startMs={13200} />
          </KineticCascadeItem>
        </div>
      </KineticScene>

      {/* ─────────────────────────────────────────────────────────────
          BEAT 5: THE GRUDGE PARADOX • ILLUSION VS REALITY (16600ms - 25800ms)
          "So holding a grudge can feel like protecting yourself. But eventually,
           you're not protecting yourself from them anymore... you're carrying them around in your own head."
      ───────────────────────────────────────────────────────────── */}
      <KineticScene
        startMs={16600}
        endMs={25800}
        inTransition="whip_right"
        outTransition="snap_up"
        inDurationMs={420}
        outDurationMs={300}
        livingDrift={true}
      >
        <div className="w-full max-w-[1020px] flex flex-col items-center gap-6 px-6 relative">
          <KineticCascadeItem delayMs={16600} durationMs={360} direction="down" distance={20}>
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 text-[260px] font-black text-slate-900/[0.04] leading-none tracking-tighter uppercase pointer-events-none select-none">
              BURDEN
            </div>
          </KineticCascadeItem>

          <KineticCascadeItem delayMs={16650} durationMs={380} direction="up" distance={25}>
            <div className="px-10 py-3.5 rounded-full bg-slate-950 text-sky-400 font-mono text-[22px] font-black uppercase tracking-widest flex items-center gap-3.5 shadow-2xl border-2 border-sky-500/30">
              <ShieldAlert className="w-7 h-7 text-sky-400" />
              STAGE 02 • THE GRUDGE PARADOX
            </div>
          </KineticCascadeItem>

          <KineticCascadeItem delayMs={16750} durationMs={450} direction="up" distance={40}>
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
              startMs={16600}
              revealRightMs={20500}
              progressive={true}
            />
          </KineticCascadeItem>
        </div>
      </KineticScene>

      {/* ─────────────────────────────────────────────────────────────
          BEAT 6: APPLE TOGGLE SWITCH • REFRAME (25800ms - 30200ms)
          "You don't have to forgive someone just because they hurt you."
      ───────────────────────────────────────────────────────────── */}
      <KineticScene
        startMs={25800}
        endMs={30200}
        inTransition="snap_up"
        outTransition="zoom_out"
        inDurationMs={380}
        outDurationMs={280}
        livingDrift={true}
      >
        <div className="w-full max-w-[980px] px-6">
          <KineticCascadeItem delayMs={25850} durationMs={400} direction="up" distance={35}>
            <AppleToggleSwitch />
          </KineticCascadeItem>
        </div>
      </KineticScene>

      {/* ─────────────────────────────────────────────────────────────
          BEAT 7: CLOSURE & EVICTION NOTICE (30200ms - 35000ms)
          "Sometimes healing simply means deciding: 'I'm not giving this any more space in me.'"
      ───────────────────────────────────────────────────────────── */}
      <KineticScene
        startMs={30200}
        endMs={35000}
        inTransition="zoom_in"
        outTransition="fade"
        inDurationMs={400}
        outDurationMs={200}
        livingDrift={true}
        className="!justify-start pt-[12%]"
      >
        <div className="w-full max-w-[980px] px-6">
          <KineticCascadeItem delayMs={30250} durationMs={420} direction="up" distance={30}>
            <ClosureCard />
          </KineticCascadeItem>
        </div>
      </KineticScene>
    </div>
  );
};
