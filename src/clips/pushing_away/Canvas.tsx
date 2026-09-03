import React from "react";
import { ProCutout } from "../../components/ProCutout";
import { PropComparison } from "../../components/PropComparison";
import { KineticScene } from "../../components/KineticScene";
import { KineticCascadeItem } from "../../components/KineticCascade";
import { WordTimestamp } from "../../types";
import { VirtualCamera3D } from "../../components/camera3d/VirtualCamera3D";
import { IsometricCard } from "../../components/camera3d/IsometricCard";
import { PhysicalCard } from "../../components/physics/PhysicalCard";
import { SecondaryMotion } from "../../components/physics/SecondaryMotion";
import { HandDrawnDoodle } from "../../components/collage/HandDrawnDoodle";
import { HighlighterStroke } from "../../components/collage/HighlighterStroke";
import { TapeStrip } from "../../components/collage/TapeStrip";
import { SemanticWord } from "../../components/kinetic_text/SemanticWord";
import { GlitchText } from "../../components/kinetic_text/GlitchText";
import { HeartCrack, ShieldAlert, Sparkles, UserMinus, Flame, Lock } from "lucide-react";

interface CanvasProps {
  transcript: WordTimestamp[];
}

export const PushingAwayCanvas: React.FC<CanvasProps> = () => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-20 select-none overflow-hidden">
      {/* ─────────────────────────────────────────────────────────────
          BEAT 0: THE CARE PARADOX HOOK (0ms - 4300ms)
          "Ever notice how sometimes you push away the person you actually care about most?"
      ───────────────────────────────────────────────────────────── */}
      <KineticScene
        startMs={0}
        endMs={4300}
        inTransition="snap_up"
        outTransition="zoom_out"
        inDurationMs={320}
        outDurationMs={260}
        livingDrift={true}
        className="!justify-start pt-[13%]"
      >
        <div className="w-full max-w-[980px] px-6">
          <KineticCascadeItem delayMs={80} durationMs={360} direction="up" distance={30}>
            <div className="relative w-full rounded-[52px] p-10 bg-white/95 backdrop-blur-2xl shadow-[0_30px_70px_rgba(244,63,94,0.12)] border-[4px] border-rose-300/80 flex flex-col items-center gap-6 text-center">
              {/* Documentary Masking Tape */}
              <TapeStrip position="top-right" rotation={11} />

              <SecondaryMotion delayMs={140} momentumDirection="up" dragTiltDeg={3} springPreset="elasticSettle" enableWobble={true}>
                <div className="px-8 py-3 rounded-full bg-rose-50 border-2 border-rose-300 text-rose-700 font-mono font-black text-2xl uppercase tracking-widest flex items-center gap-3">
                  <HeartCrack className="w-7 h-7 text-rose-600" />
                  THE ATTACHMENT PARADOX
                </div>
              </SecondaryMotion>

              <div className="text-4xl md:text-5xl font-black text-slate-950 tracking-tight leading-tight max-w-[850px] relative">
                Pushing Away The Person You{" "}
                <span className="relative inline-block text-rose-600">
                  Care About Most
                  {/* Animated Hand-Drawn Marker Underline */}
                  <HandDrawnDoodle
                    preset="underline"
                    color="rose"
                    startMs={1500}
                    durationMs={420}
                    strokeWidth={6}
                    className="absolute -bottom-3 left-0 w-full h-7 pointer-events-none"
                  />
                </span>
              </div>
            </div>
          </KineticCascadeItem>
        </div>
      </KineticScene>

      {/* ─────────────────────────────────────────────────────────────
          BEAT 1: THE WITHDRAWAL SYMPTOMS (4300ms - 8600ms)
          "You might go quiet, act cold, or suddenly need distance."
      ───────────────────────────────────────────────────────────── */}
      <KineticScene
        startMs={4300}
        endMs={8600}
        inTransition="whip_right"
        outTransition="zoom_out"
        inDurationMs={380}
        outDurationMs={280}
        livingDrift={true}
      >
        <div className="w-full max-w-[1000px] flex flex-col items-center gap-7 px-6 relative">
          <KineticCascadeItem delayMs={4350} durationMs={360} direction="up" distance={25}>
            <div className="px-10 py-3.5 rounded-full bg-slate-950 text-sky-400 font-mono text-[24px] font-black uppercase tracking-widest flex items-center gap-3.5 shadow-2xl border-2 border-sky-500/30">
              <UserMinus className="w-7 h-7 text-sky-400" />
              THE 3-STEP RETREAT
            </div>
          </KineticCascadeItem>

          <KineticCascadeItem delayMs={4450} durationMs={420} direction="up" distance={45}>
            <div className="relative w-full rounded-[52px] p-10 bg-white/95 backdrop-blur-2xl border-[4px] border-sky-200 shadow-2xl flex items-center gap-8">
              <TapeStrip position="top-left" rotation={-10} />

              <div className="w-56 h-56 shrink-0">
                <ProCutout
                  assetId="isolated_curled_up"
                  glowColor="sky"
                  animation="punch_in"
                  annotation="WITHDRAWAL"
                  annotationPosition="top-right"
                  width="100%"
                  height="100%"
                />
              </div>

              <div className="flex-1 flex flex-col gap-4">
                <div className="p-4 rounded-2xl bg-slate-100 text-slate-800 font-black text-3xl flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xl shrink-0">1</span>
                  <span>Go Completely Quiet</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-100 text-slate-800 font-black text-3xl flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xl shrink-0">2</span>
                  <span>Act Emotionally Cold</span>
                </div>
                <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 font-black text-3xl flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center text-xl shrink-0">3</span>
                  <GlitchText startMs={6400} durationMs={450}>
                    <span>Need Sudden Distance</span>
                  </GlitchText>
                </div>
              </div>
            </div>
          </KineticCascadeItem>
        </div>
      </KineticScene>

      {/* ─────────────────────────────────────────────────────────────
          BEAT 2: THE HIDDEN MOTIVE • ISOMETRIC 3D (8600ms - 12200ms)
          "And weirdly… it can happen because you care, not because you don't."
      ───────────────────────────────────────────────────────────── */}
      <KineticScene
        startMs={8600}
        endMs={12200}
        inTransition="snap_up"
        outTransition="zoom_out"
        inDurationMs={380}
        outDurationMs={280}
        livingDrift={true}
      >
        <div className="w-full max-w-[1000px] px-6">
          <KineticCascadeItem delayMs={8650} durationMs={400} direction="up" distance={35}>
            <PhysicalCard tiltX={8} tiltY={-6} tiltZ={1.5} elevation={35}>
              <div className="w-full rounded-[52px] p-12 bg-white/95 backdrop-blur-2xl border-[4px] border-amber-300 shadow-[0_30px_70px_rgba(245,158,11,0.18)] flex flex-col items-center gap-8 text-center">
                <TapeStrip position="center-top" />

                <SecondaryMotion delayMs={160} momentumDirection="up" dragTiltDeg={3} springPreset="elasticSettle" enableWobble={true}>
                  <div className="px-8 py-3 rounded-full bg-amber-50 border-2 border-amber-300 text-amber-800 font-mono font-black text-2xl uppercase tracking-widest flex items-center gap-3">
                    <Flame className="w-7 h-7 text-amber-600" />
                    THE REAL MOTIVE
                  </div>
                </SecondaryMotion>

                <div className="text-5xl md:text-6xl font-black text-slate-950 tracking-tight leading-tight max-w-[880px]">
                  It Happens{" "}
                  <HighlighterStroke color="yellow" startMs={9500} durationMs={420}>
                    Because You Care.
                  </HighlighterStroke>
                </div>

                <div className="p-5 rounded-3xl bg-slate-900 text-white font-mono font-black text-2xl tracking-wide shadow-md">
                  NOT BECAUSE YOU DON'T
                </div>
              </div>
            </PhysicalCard>
          </KineticCascadeItem>
        </div>
      </KineticScene>

      {/* ─────────────────────────────────────────────────────────────
          BEAT 3: 3D VIRTUAL CAMERA SWOOP • VULNERABILITY REFLEX (12200ms - 17500ms)
          "Sometimes closeness makes us feel vulnerable. So when someone gets important to us..."
      ───────────────────────────────────────────────────────────── */}
      <KineticScene
        startMs={12200}
        endMs={17500}
        inTransition="snap_up"
        outTransition="zoom_out"
        inDurationMs={400}
        outDurationMs={280}
        livingDrift={true}
      >
        <VirtualCamera3D preset="dramatic_swoop" startMs={12200} readabilityLock={true}>
          <div className="w-full max-w-[1000px] flex flex-col items-center gap-7 px-6 relative">
            <KineticCascadeItem delayMs={12250} durationMs={360} direction="up" distance={25}>
              <div className="px-10 py-3.5 rounded-full bg-slate-950 text-rose-400 font-mono text-[24px] font-black uppercase tracking-widest flex items-center gap-3.5 shadow-2xl border-2 border-rose-500/30">
                <ShieldAlert className="w-7 h-7 text-rose-500" />
                THE VULNERABILITY REFLEX
              </div>
            </KineticCascadeItem>

            <KineticCascadeItem delayMs={12350} durationMs={450} direction="up" distance={45}>
              <div className="relative w-full rounded-[52px] p-12 bg-white/95 backdrop-blur-2xl border-[4px] border-rose-200 shadow-2xl flex items-center gap-8">
                <TapeStrip position="top-right" rotation={12} />

                <div className="w-60 h-60 shrink-0">
                  <ProCutout
                    assetId="fear_paranoia_voices"
                    glowColor="rose"
                    animation="punch_in"
                    annotation="ANXIETY"
                    annotationPosition="top-right"
                    width="100%"
                    height="100%"
                  />
                </div>

                <div className="flex-1 flex flex-col gap-5">
                  <div className="text-4xl md:text-5xl font-black text-slate-950 uppercase tracking-tight leading-tight">
                    Closeness Feels{" "}
                    <SemanticWord
                      word="VULNERABLE"
                      physics="fracture"
                      startMs={12800}
                      className="text-rose-600"
                    />
                  </div>
                  <div className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-950 font-black text-2xl md:text-3xl leading-snug">
                    When someone matters, the fear of losing them spikes.
                  </div>
                </div>
              </div>
            </KineticCascadeItem>
          </div>
        </VirtualCamera3D>
      </KineticScene>

      {/* ─────────────────────────────────────────────────────────────
          BEAT 4: THE AVOIDANT TRAP • LEAVE FIRST (17500ms - 24600ms)
          "It's basically, 'Leave first… before they can leave you.'"
      ───────────────────────────────────────────────────────────── */}
      <KineticScene
        startMs={17500}
        endMs={24600}
        inTransition="whip_right"
        outTransition="zoom_out"
        inDurationMs={380}
        outDurationMs={280}
        livingDrift={true}
      >
        <div className="w-full max-w-[1000px] px-6 flex flex-col items-center gap-7">
          <KineticCascadeItem delayMs={17550} durationMs={380} direction="up" distance={30}>
            <div className="px-10 py-3.5 rounded-full bg-slate-950 text-amber-400 font-mono text-[24px] font-black uppercase tracking-widest flex items-center gap-3.5 shadow-2xl border-2 border-amber-500/30">
              <Lock className="w-7 h-7 text-amber-500" />
              THE BRAIN'S FLAWED LOGIC
            </div>
          </KineticCascadeItem>

          <KineticCascadeItem delayMs={17650} durationMs={450} direction="up" distance={40}>
            <div className="relative w-full rounded-[52px] p-12 bg-white/95 backdrop-blur-2xl border-[4px] border-amber-300 shadow-[0_30px_70px_rgba(245,158,11,0.18)] flex flex-col items-center gap-8 text-center">
              <TapeStrip position="top-left" rotation={-11} />

              <div className="relative text-5xl md:text-6xl font-black text-slate-950 tracking-tight leading-tight max-w-[880px]">
                "Leave First Before They Can Leave You."
                {/* Hand-Drawn Scratch-out X Mark */}
                <HandDrawnDoodle
                  preset="scribble_cross"
                  color="rose"
                  startMs={22400}
                  durationMs={380}
                  strokeWidth={7}
                  className="absolute inset-0 m-auto w-48 h-48 pointer-events-none"
                />
              </div>

              <div className="w-full p-6 rounded-3xl bg-rose-500/15 border-2 border-rose-400 text-rose-950 font-black text-2xl md:text-3xl">
                A defense mechanism disguised as self-protection.
              </div>
            </div>
          </KineticCascadeItem>
        </div>
      </KineticScene>

      {/* ─────────────────────────────────────────────────────────────
          BEAT 5: GRAVITY DROP • THE FEAR REMAINS (24600ms - 28000ms)
          "But pushing someone away doesn't always make the fear disappear."
      ───────────────────────────────────────────────────────────── */}
      <KineticScene
        startMs={24600}
        endMs={28000}
        inTransition="snap_up"
        outTransition="zoom_out"
        inDurationMs={360}
        outDurationMs={260}
        livingDrift={true}
      >
        <div className="w-full max-w-[980px] px-6">
          <KineticCascadeItem delayMs={24650} durationMs={400} direction="up" distance={35}>
            <div className="w-full rounded-[52px] p-12 bg-white/95 backdrop-blur-2xl border-[4px] border-slate-300 shadow-2xl flex flex-col items-center gap-7 text-center">
              <div className="text-5xl md:text-6xl font-black text-slate-950 tracking-tight leading-tight">
                <SemanticWord
                  word="THE FEAR"
                  physics="gravity_drop"
                  startMs={25500}
                  className="text-rose-600 block mb-2"
                />
                Does Not Disappear.
              </div>

              <div className="text-2xl md:text-3xl font-bold text-slate-600 max-w-[800px] leading-snug">
                Pushing them away only creates the very loneliness you were trying to avoid.
              </div>
            </div>
          </KineticCascadeItem>
        </div>
      </KineticScene>

      {/* ─────────────────────────────────────────────────────────────
          BEAT 6: THE REFRAME • PRETENDING VS HONESTY (28000ms - 32900ms)
          "Sometimes, being honest about what you're feeling is safer than pretending you don't care."
      ───────────────────────────────────────────────────────────── */}
      <KineticScene
        startMs={28000}
        endMs={32900}
        inTransition="whip_right"
        outTransition="snap_up"
        inDurationMs={400}
        outDurationMs={280}
        livingDrift={true}
      >
        <div className="w-full max-w-[1020px] flex flex-col items-center gap-6 px-6 relative">
          <KineticCascadeItem delayMs={28050} durationMs={360} direction="up" distance={25}>
            <div className="px-10 py-3.5 rounded-full bg-slate-950 text-emerald-400 font-mono text-[24px] font-black uppercase tracking-widest flex items-center gap-3.5 shadow-2xl border-2 border-emerald-500/30">
              <Sparkles className="w-7 h-7 text-emerald-400" />
              THE HEALTHY REFRAME
            </div>
          </KineticCascadeItem>

          <KineticCascadeItem delayMs={28150} durationMs={420} direction="up" distance={40}>
            <PropComparison
              leftAssetId="setting_boundary_stop_hand"
              leftTitle="Pretending Cold"
              leftSubtitle="False safety that destroys connection"
              leftBadge="THE TRAP"
              leftGlow="rose"

              rightAssetId="hugging_comfort_embrace"
              rightTitle="Being Honest"
              rightSubtitle="True emotional safety and security"
              rightBadge="THE FIX"
              rightGlow="emerald"

              centerDividerText="VS"
              startMs={28000}
              revealRightMs={30200}
              progressive={true}
            />
          </KineticCascadeItem>
        </div>
      </KineticScene>

      {/* ─────────────────────────────────────────────────────────────
          BEAT 7: CLOSURE RESOLUTION • THEY MATTER (32900ms - 36700ms)
          "You don't have to shut people out just because they matter to you."
      ───────────────────────────────────────────────────────────── */}
      <KineticScene
        startMs={32900}
        endMs={36700}
        inTransition="zoom_in"
        outTransition="fade"
        inDurationMs={380}
        outDurationMs={200}
        livingDrift={true}
        className="!justify-start pt-[12%]"
      >
        <div className="w-full max-w-[1000px] px-6">
          <KineticCascadeItem delayMs={32950} durationMs={400} direction="up" distance={30}>
            <div className="relative w-full rounded-[52px] p-12 bg-white/95 backdrop-blur-2xl shadow-[0_30px_70px_rgba(245,158,11,0.22)] border-[4px] border-amber-400/90 flex flex-col items-center gap-8 text-center">
              <TapeStrip position="top-right" rotation={10} />

              <div className="px-8 py-3 rounded-full bg-amber-500/15 border-2 border-amber-400 text-amber-900 font-mono font-black text-2xl uppercase tracking-widest flex items-center gap-3">
                <Sparkles className="w-7 h-7 text-amber-600" />
                FINAL REVELATION
              </div>

              <div className="relative text-5xl md:text-6xl font-black text-slate-950 tracking-tight leading-tight max-w-[900px]">
                You Don't Have To Shut People Out Just Because{" "}
                <span className="relative inline-block text-emerald-600">
                  They Matter.
                  {/* Energetic Hand-Drawn Underline */}
                  <HandDrawnDoodle
                    preset="underline"
                    color="emerald"
                    startMs={34200}
                    durationMs={400}
                    strokeWidth={6}
                    className="absolute -bottom-4 left-0 w-full h-8"
                  />
                </span>
              </div>

              <div className="px-8 py-4 rounded-3xl bg-slate-950 text-emerald-300 font-mono font-black text-2xl flex items-center gap-3 shadow-xl">
                CONNECTION RESTORED • EMOTIONAL SAFETY
              </div>
            </div>
          </KineticCascadeItem>
        </div>
      </KineticScene>
    </div>
  );
};
