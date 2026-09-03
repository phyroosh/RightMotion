import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PhysicalCard } from "../../components/physics/PhysicalCard";
import { SecondaryMotion } from "../../components/physics/SecondaryMotion";
import { ProCutout } from "../../components/ProCutout";
import { PropComparison } from "../../components/PropComparison";
import { HandDrawnDoodle } from "../../components/collage/HandDrawnDoodle";
import { TapeStrip } from "../../components/collage/TapeStrip";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Brain,
  CheckCircle2,
  Clock,
  Dna,
  Heart,
  Moon,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

export const TeenageMentalHealthCanvas: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene Timings in Frames (30 FPS)
  // Scene 1: 0 - 105 (0.0s - 3.5s)   Hook: Mood Suddenly Changes
  // Scene 2: 105 - 380 (3.5s - 12.7s) Neurobiology Matrix: Hormones, Synapses, Sleep
  // Scene 3: 380 - 528 (12.7s - 17.6s) Critical Contrast: Rough Day vs Weeks
  // Scene 4: 528 - 807 (17.6s - 26.9s) Diagnostic Flags: 4 Critical Signs & Not Dramatic
  // Scene 5: 807 - 945 (26.9s - 31.5s) Clinical Support Network
  // Scene 6: 945 - 1010 (31.5s - 33.7s) Powerful Affirmation Outro

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-8 pt-16 pb-48 z-10 pointer-events-none select-none">
      
      {/* ======================================================== */}
      {/* SCENE 1: THE SUDDEN SHIFT HOOK (Frames 0 - 105)          */}
      {/* ======================================================== */}
      {frame >= 0 && frame < 105 && (
        <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
          <div className="relative w-full max-w-[920px]">
            {/* Safe Outer Anchored Tape Strip */}
            <div className="absolute -top-7 right-8 z-30 pointer-events-none">
              <TapeStrip position="top-right" width={180} height={48} enableWobble />
            </div>

            <PhysicalCard
              tiltX={6}
              tiltY={-4}
              elevation={38}
              impactMs={350}
              className="w-full p-9 rounded-3xl bg-[#0a1124]/95 border-2 border-cyan-500/40 shadow-2xl backdrop-blur-md flex flex-col items-center text-center gap-6"
            >
              {/* Clean, Uncrowded Hero Hook Question */}

              {/* Hero Hook Question */}
              <h1 className="text-5xl font-black text-white tracking-tight leading-tight max-w-[840px]">
                Ever Feel Like Your Mood{" "}
                <span className="text-cyan-400 font-black">Suddenly Shifts</span>{" "}
                For No Reason?
              </h1>

              {/* Visual Cutout: Mood Spectrum Scale (Enlarged) */}
              <div className="w-full flex justify-center my-2">
                <ProCutout
                  assetId="mood_rating_scale_emojis"
                  glowColor="sky"
                  animation="stamp_impact"
                  width={600}
                  height={190}
                  annotation="VOLATILE SWING"
                  annotationPosition="top-right"
                />
              </div>

              {/* Telemetry Status Bar */}
              <div className="w-full p-4 rounded-2xl bg-black/70 border border-cyan-500/30 flex items-center justify-between text-2xl font-mono text-cyan-200">
                <span className="flex items-center gap-2.5">
                  <Clock className="w-6 h-6 text-cyan-400" />
                  <span>STATE: ADOLESCENT NEURO-SHIFT</span>
                </span>
                <span className="text-rose-400 font-black tracking-wide">UNEXPLAINED DROP</span>
              </div>
            </PhysicalCard>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 2: THE TEENAGE NEUROBIOLOGY MATRIX (Frames 105-380) */}
      {/* ======================================================== */}
      {frame >= 105 && frame < 380 && (() => {
        // Speech-Synchronized Word Milestones:
        // 6640ms (frame 199): "brain,"
        // 7180ms (frame 215): "hormones,"
        // 7660ms (frame 230): "sleep,"
        // 8560ms (frame 257): "school,"
        // 9300ms (frame 279): "friendships,"

        const spBrain = spring({ frame: frame - 199, fps, config: { damping: 13, stiffness: 130 } });
        const spHormones = spring({ frame: frame - 215, fps, config: { damping: 13, stiffness: 140 } });
        const spSleep = spring({ frame: frame - 230, fps, config: { damping: 13, stiffness: 140 } });
        const spSchool = spring({ frame: frame - 257, fps, config: { damping: 13, stiffness: 140 } });
        const spFriends = spring({ frame: frame - 279, fps, config: { damping: 13, stiffness: 140 } });

        return (
          <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
            <div className="relative w-full max-w-[920px]">
              <PhysicalCard
                tiltX={5}
                tiltY={-4}
                elevation={42}
                impactMs={3700}
                className="w-full p-8 rounded-3xl bg-[#0a1124]/95 border-2 border-cyan-500/40 shadow-2xl backdrop-blur-md flex flex-col items-center text-center gap-6 min-h-[640px]"
              >
                {/* Telemetry Header */}
                <div className="px-6 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 font-mono font-black text-2xl flex items-center gap-3 shadow-md">
                  <Brain className="w-7 h-7 text-cyan-400" />
                  <span>TEENAGE BRAIN REMODELING</span>
                </div>

                {/* Centerpiece 3D Glass Brain Cutout (Slam on "brain," at frame 199) */}
                <div
                  className="my-1 transition-all"
                  style={{
                    opacity: frame >= 199 ? Math.min(1, spBrain * 1.2) : 0,
                    transform: `scale(${frame >= 199 ? interpolate(spBrain, [0, 1], [0.6, 1]) : 0.6}) translateY(${frame >= 199 ? interpolate(spBrain, [0, 1], [30, 0]) : 30}px)`,
                  }}
                >
                  <ProCutout
                    assetId="hyperrealistic_3d_glowing_brain"
                    glowColor="sky"
                    animation="stamp_impact"
                    width={380}
                    height={340}
                    ghostText="REMODELING"
                    annotation="NEURAL STORM"
                    annotationPosition="top-right"
                  />
                </div>

                {/* 4 Orbiting Clinical Drivers Matrix — REVEALED SEQUENTIALLY AS SPOKEN */}
                <div className="grid grid-cols-2 gap-4 w-full">
                  {/* 1. Hormones (Slam on "hormones," at frame 215) */}
                  <div
                    style={{
                      opacity: frame >= 215 ? Math.min(1, spHormones * 1.2) : 0,
                      transform: `scale(${frame >= 215 ? interpolate(spHormones, [0, 1], [0.7, 1]) : 0.7}) translateY(${frame >= 215 ? interpolate(spHormones, [0, 1], [25, 0]) : 25}px)`,
                    }}
                  >
                    <div className="p-4 rounded-2xl bg-[#0e172f]/90 border border-rose-500/40 flex items-center gap-3.5 text-left shadow-lg">
                      <div className="w-12 h-12 rounded-xl bg-rose-500/25 text-rose-400 flex items-center justify-center shrink-0">
                        <Zap className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="text-3xl font-black text-white leading-tight">HORMONAL SURGE</div>
                        <div className="text-2xl font-mono text-rose-300 font-bold mt-0.5">+300% Chemical Shift</div>
                      </div>
                    </div>
                  </div>

                  {/* 2. Synaptic Pruning / School (Slam on "school," at frame 257) */}
                  <div
                    style={{
                      opacity: frame >= 257 ? Math.min(1, spSchool * 1.2) : 0,
                      transform: `scale(${frame >= 257 ? interpolate(spSchool, [0, 1], [0.7, 1]) : 0.7}) translateY(${frame >= 257 ? interpolate(spSchool, [0, 1], [25, 0]) : 25}px)`,
                    }}
                  >
                    <div className="p-4 rounded-2xl bg-[#0e172f]/90 border border-cyan-500/40 flex items-center gap-3.5 text-left shadow-lg">
                      <div className="w-12 h-12 rounded-xl bg-cyan-500/25 text-cyan-400 flex items-center justify-center shrink-0">
                        <Dna className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="text-3xl font-black text-white leading-tight">SYNAPTIC PRUNING</div>
                        <div className="text-2xl font-mono text-cyan-300 font-bold mt-0.5">PFC Rewiring In Progress</div>
                      </div>
                    </div>
                  </div>

                  {/* 3. Sleep / Circadian (Slam on "sleep," at frame 230) */}
                  <div
                    style={{
                      opacity: frame >= 230 ? Math.min(1, spSleep * 1.2) : 0,
                      transform: `scale(${frame >= 230 ? interpolate(spSleep, [0, 1], [0.7, 1]) : 0.7}) translateY(${frame >= 230 ? interpolate(spSleep, [0, 1], [25, 0]) : 25}px)`,
                    }}
                  >
                    <div className="p-4 rounded-2xl bg-[#0e172f]/90 border border-amber-500/40 flex items-center gap-3.5 text-left shadow-lg">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/25 text-amber-400 flex items-center justify-center shrink-0">
                        <Moon className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="text-3xl font-black text-white leading-tight">CIRCADIAN DELAY</div>
                        <div className="text-2xl font-mono text-amber-300 font-bold mt-0.5">2-Hour Melatonin Lag</div>
                      </div>
                    </div>
                  </div>

                  {/* 4. Social & Academic / Friendships (Slam on "friendships," at frame 279) */}
                  <div
                    style={{
                      opacity: frame >= 279 ? Math.min(1, spFriends * 1.2) : 0,
                      transform: `scale(${frame >= 279 ? interpolate(spFriends, [0, 1], [0.7, 1]) : 0.7}) translateY(${frame >= 279 ? interpolate(spFriends, [0, 1], [25, 0]) : 25}px)`,
                    }}
                  >
                    <div className="p-4 rounded-2xl bg-[#0e172f]/90 border border-emerald-500/40 flex items-center gap-3.5 text-left shadow-lg">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/25 text-emerald-400 flex items-center justify-center shrink-0">
                        <Users className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="text-3xl font-black text-white leading-tight">SOCIAL OVERLOAD</div>
                        <div className="text-2xl font-mono text-emerald-300 font-bold mt-0.5">Identity & Academic Stress</div>
                      </div>
                    </div>
                  </div>
                </div>
              </PhysicalCard>
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* SCENE 3: THE CRITICAL CONTRAST (Frames 380 - 528)        */}
      {/* ======================================================== */}
      {frame >= 380 && frame < 528 && (
        <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
          <div className="w-full max-w-[920px] p-6 rounded-3xl bg-[#0a1124]/95 border-2 border-cyan-500/40 shadow-2xl backdrop-blur-md">
            <PropComparison
              leftAssetId="battery_low_red"
              leftTitle="A Rough Day"
              leftSubtitle="Temporary 24-48hr energy dip; rebounds after sleep"
              leftBadge="TRANSIENT DIP"
              leftGlow="amber"
              rightAssetId="brain_battery_depleted"
              rightTitle="Chronic Low"
              rightSubtitle="Persistent daily fatigue & numbness for weeks on end"
              rightBadge="CLINICAL FLAG"
              rightGlow="rose"
              centerDividerText="VS"
            />
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 4: THE 4 DIAGNOSTIC FLAGS (Frames 528 - 807)       */}
      {/* ======================================================== */}
      {frame >= 528 && frame < 807 && (() => {
        // Speech-Synchronized Word Milestones:
        // 17640ms (frame 529): "losing interest"
        // 20080ms (frame 602): "feeling hopeless"
        // 21240ms (frame 637): "struggling to function"
        // 22720ms (frame 681): "nothing will get better"
        // 24740ms (frame 742): "being dramatic" -> Reframe banner

        const spFlag1 = spring({ frame: frame - 529, fps, config: { damping: 13, stiffness: 140 } });
        const spFlag2 = spring({ frame: frame - 602, fps, config: { damping: 13, stiffness: 140 } });
        const spFlag3 = spring({ frame: frame - 637, fps, config: { damping: 13, stiffness: 140 } });
        const spFlag4 = spring({ frame: frame - 681, fps, config: { damping: 13, stiffness: 140 } });
        const spBanner = spring({ frame: frame - 742, fps, config: { damping: 14, stiffness: 130 } });

        return (
          <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
            <div className="relative w-full max-w-[920px]">
              {/* Anchored Tape Strip safe at -top-7 */}
              <div className="absolute -top-7 left-8 z-30 pointer-events-none">
                <TapeStrip position="top-left" width={180} height={48} enableWobble />
              </div>

              <PhysicalCard
                tiltX={6}
                tiltY={-5}
                elevation={42}
                impactMs={17800}
                className="w-full p-8 rounded-3xl bg-[#0a1124]/95 border-2 border-rose-500/50 shadow-2xl backdrop-blur-md flex flex-col items-center text-center gap-6 min-h-[640px]"
              >


                {/* Core Header with Anchored Marker Circle */}
                <h2 className="text-4xl font-black text-white leading-tight max-w-[840px]">
                  Feeling Low Almost Every Day{" "}
                  <div className="relative inline-block my-1">
                    <span className="text-rose-400 font-black text-5xl">For Weeks?</span>
                    <HandDrawnDoodle
                      preset="circle"
                      color="rose"
                      startMs={17600}
                      className="absolute inset-0 -m-3 w-[120%] h-[130%]"
                    />
                  </div>
                </h2>

                {/* 4 Clinical Flags Grid — REVEALED SEQUENTIALLY ON EXACT WORDS */}
                <div className="grid grid-cols-2 gap-4 w-full my-1">
                  {/* Flag 1: Losing Interest (Frame 529) */}
                  <div
                    style={{
                      opacity: frame >= 529 ? Math.min(1, spFlag1 * 1.2) : 0,
                      transform: `scale(${frame >= 529 ? interpolate(spFlag1, [0, 1], [0.7, 1]) : 0.7}) translateY(${frame >= 529 ? interpolate(spFlag1, [0, 1], [25, 0]) : 25}px)`,
                    }}
                  >
                    <div className="p-4 rounded-2xl bg-[#0e172f]/90 border border-rose-500/40 flex items-center gap-3.5 text-left shadow-lg">
                      <span className="text-4xl font-black text-rose-400 shrink-0">1</span>
                      <div>
                        <div className="text-3xl font-black text-white">Losing Interest</div>
                        <div className="text-2xl font-mono text-slate-300 font-bold mt-0.5">Zero Joy In Hobbies</div>
                      </div>
                    </div>
                  </div>

                  {/* Flag 2: Feeling Hopeless (Frame 602) */}
                  <div
                    style={{
                      opacity: frame >= 602 ? Math.min(1, spFlag2 * 1.2) : 0,
                      transform: `scale(${frame >= 602 ? interpolate(spFlag2, [0, 1], [0.7, 1]) : 0.7}) translateY(${frame >= 602 ? interpolate(spFlag2, [0, 1], [25, 0]) : 25}px)`,
                    }}
                  >
                    <div className="p-4 rounded-2xl bg-[#0e172f]/90 border border-rose-500/40 flex items-center gap-3.5 text-left shadow-lg">
                      <span className="text-4xl font-black text-rose-400 shrink-0">2</span>
                      <div>
                        <div className="text-3xl font-black text-white">Feeling Hopeless</div>
                        <div className="text-2xl font-mono text-slate-300 font-bold mt-0.5">Deep Cognitive Paralysis</div>
                      </div>
                    </div>
                  </div>

                  {/* Flag 3: Cannot Function (Frame 637) */}
                  <div
                    style={{
                      opacity: frame >= 637 ? Math.min(1, spFlag3 * 1.2) : 0,
                      transform: `scale(${frame >= 637 ? interpolate(spFlag3, [0, 1], [0.7, 1]) : 0.7}) translateY(${frame >= 637 ? interpolate(spFlag3, [0, 1], [25, 0]) : 25}px)`,
                    }}
                  >
                    <div className="p-4 rounded-2xl bg-[#0e172f]/90 border border-rose-500/40 flex items-center gap-3.5 text-left shadow-lg">
                      <span className="text-4xl font-black text-rose-400 shrink-0">3</span>
                      <div>
                        <div className="text-3xl font-black text-white">Cannot Function</div>
                        <div className="text-2xl font-mono text-slate-300 font-bold mt-0.5">School, Sleep & Focus Slip</div>
                      </div>
                    </div>
                  </div>

                  {/* Flag 4: Nothing Improves (Frame 681) */}
                  <div
                    style={{
                      opacity: frame >= 681 ? Math.min(1, spFlag4 * 1.2) : 0,
                      transform: `scale(${frame >= 681 ? interpolate(spFlag4, [0, 1], [0.7, 1]) : 0.7}) translateY(${frame >= 681 ? interpolate(spFlag4, [0, 1], [25, 0]) : 25}px)`,
                    }}
                  >
                    <div className="p-4 rounded-2xl bg-[#0e172f]/90 border border-rose-500/40 flex items-center gap-3.5 text-left shadow-lg">
                      <span className="text-4xl font-black text-rose-400 shrink-0">4</span>
                      <div>
                        <div className="text-3xl font-black text-white">"Nothing Improves"</div>
                        <div className="text-2xl font-mono text-slate-300 font-bold mt-0.5">Tunnel Vision Distortion</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Anti-Stigma Reframe Callout (Slam on "dramatic" at Frame 742) */}
                <div
                  className="w-full transition-all"
                  style={{
                    opacity: frame >= 742 ? Math.min(1, spBanner * 1.2) : 0,
                    transform: `scale(${frame >= 742 ? interpolate(spBanner, [0, 1], [0.8, 1]) : 0.8}) translateY(${frame >= 742 ? interpolate(spBanner, [0, 1], [20, 0]) : 20}px)`,
                  }}
                >
                  <div className="w-full p-5 rounded-2xl bg-gradient-to-r from-rose-950/60 via-purple-950/60 to-black border-2 border-rose-500/40 flex items-center justify-center gap-4 text-3xl font-black text-white shadow-xl">
                    <span className="text-rose-400 line-through">"You're Being Dramatic"</span>
                    <ArrowRight className="w-7 h-7 text-cyan-400 shrink-0" />
                    <span className="text-cyan-300 font-mono">IT'S NEUROCHEMISTRY</span>
                  </div>
                </div>
              </PhysicalCard>
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* SCENE 5: THE SUPPORT NETWORK (Frames 807 - 945)          */}
      {/* ======================================================== */}
      {frame >= 807 && frame < 945 && (() => {
        // Speech-Synchronized Word Milestones:
        // 26960ms (frame 808): "Talk to someone you trust" -> Cutout stamps
        // 28720ms (frame 861): "parent," -> Card 1
        // 29220ms (frame 876): "counselor," -> Card 2
        // 29960ms (frame 898): "teacher," -> Card 3
        // 30660ms (frame 920): "doctor." -> Card 4

        const spCutout = spring({ frame: frame - 808, fps, config: { damping: 13, stiffness: 130 } });
        const spParent = spring({ frame: frame - 861, fps, config: { damping: 13, stiffness: 140 } });
        const spCounselor = spring({ frame: frame - 876, fps, config: { damping: 13, stiffness: 140 } });
        const spTeacher = spring({ frame: frame - 898, fps, config: { damping: 13, stiffness: 140 } });
        const spDoctor = spring({ frame: frame - 920, fps, config: { damping: 13, stiffness: 140 } });

        return (
          <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
            <div className="relative w-full max-w-[920px]">
              {/* Anchored Tape Strip safe at -top-7 */}
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                <TapeStrip position="center-top" width={180} height={48} enableWobble />
              </div>

              <PhysicalCard
                tiltX={5}
                tiltY={-4}
                elevation={40}
                impactMs={27000}
                className="w-full p-8 rounded-3xl bg-[#0a1124]/95 border-2 border-emerald-500/50 shadow-2xl backdrop-blur-md flex flex-col items-center text-center gap-6 min-h-[640px]"
              >
                {/* Header Badge */}
                <div className="px-6 py-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-mono font-black text-2xl flex items-center gap-3 shadow-lg">
                  <ShieldCheck className="w-7 h-7 text-emerald-400" />
                  <span>CLINICAL SUPPORT ALLIANCE</span>
                </div>

                {/* Cutout Hero: Friendship & Support Embrace (Frame 808) */}
                <div
                  className="my-1 transition-all"
                  style={{
                    opacity: frame >= 808 ? Math.min(1, spCutout * 1.2) : 0,
                    transform: `scale(${frame >= 808 ? interpolate(spCutout, [0, 1], [0.7, 1]) : 0.7}) translateY(${frame >= 808 ? interpolate(spCutout, [0, 1], [25, 0]) : 25}px)`,
                  }}
                >
                  <ProCutout
                    assetId="friendship_comfort_support"
                    glowColor="emerald"
                    animation="stamp_impact"
                    width={350}
                    height={300}
                    ghostText="SUPPORT"
                    annotation="REACH OUT"
                    annotationPosition="top-right"
                  />
                </div>

                <h2 className="text-4xl font-black text-white tracking-tight">
                  Talk To Someone You Trust
                </h2>

                {/* 4 Verified Support Channels — SEQUENTIALLY ON EXACT WORDS */}
                <div className="grid grid-cols-2 gap-4 w-full">
                  {/* Channel 1: Parent (Frame 861) */}
                  <div
                    style={{
                      opacity: frame >= 861 ? Math.min(1, spParent * 1.2) : 0,
                      transform: `scale(${frame >= 861 ? interpolate(spParent, [0, 1], [0.7, 1]) : 0.7}) translateY(${frame >= 861 ? interpolate(spParent, [0, 1], [25, 0]) : 25}px)`,
                    }}
                  >
                    <div className="p-4 rounded-2xl bg-[#0e172f]/90 border border-emerald-500/40 flex items-center gap-3.5 text-left shadow-lg">
                      <CheckCircle2 className="w-7 h-7 text-emerald-400 shrink-0" />
                      <div>
                        <div className="text-3xl font-black text-white">Parent / Family</div>
                        <div className="text-2xl font-mono text-emerald-300 font-bold mt-0.5">Unconditional Safety</div>
                      </div>
                    </div>
                  </div>

                  {/* Channel 2: School Counselor (Frame 876) */}
                  <div
                    style={{
                      opacity: frame >= 876 ? Math.min(1, spCounselor * 1.2) : 0,
                      transform: `scale(${frame >= 876 ? interpolate(spCounselor, [0, 1], [0.7, 1]) : 0.7}) translateY(${frame >= 876 ? interpolate(spCounselor, [0, 1], [25, 0]) : 25}px)`,
                    }}
                  >
                    <div className="p-4 rounded-2xl bg-[#0e172f]/90 border border-cyan-500/40 flex items-center gap-3.5 text-left shadow-lg">
                      <CheckCircle2 className="w-7 h-7 text-cyan-400 shrink-0" />
                      <div>
                        <div className="text-3xl font-black text-white">School Counselor</div>
                        <div className="text-2xl font-mono text-cyan-300 font-bold mt-0.5">Confidential Guidance</div>
                      </div>
                    </div>
                  </div>

                  {/* Channel 3: Trusted Teacher (Frame 898) */}
                  <div
                    style={{
                      opacity: frame >= 898 ? Math.min(1, spTeacher * 1.2) : 0,
                      transform: `scale(${frame >= 898 ? interpolate(spTeacher, [0, 1], [0.7, 1]) : 0.7}) translateY(${frame >= 898 ? interpolate(spTeacher, [0, 1], [25, 0]) : 25}px)`,
                    }}
                  >
                    <div className="p-4 rounded-2xl bg-[#0e172f]/90 border border-purple-500/40 flex items-center gap-3.5 text-left shadow-lg">
                      <CheckCircle2 className="w-7 h-7 text-purple-400 shrink-0" />
                      <div>
                        <div className="text-3xl font-black text-white">Trusted Teacher</div>
                        <div className="text-2xl font-mono text-purple-300 font-bold mt-0.5">Academic Advocacy</div>
                      </div>
                    </div>
                  </div>

                  {/* Channel 4: Doctor / Clinician (Frame 920) */}
                  <div
                    style={{
                      opacity: frame >= 920 ? Math.min(1, spDoctor * 1.2) : 0,
                      transform: `scale(${frame >= 920 ? interpolate(spDoctor, [0, 1], [0.7, 1]) : 0.7}) translateY(${frame >= 920 ? interpolate(spDoctor, [0, 1], [25, 0]) : 25}px)`,
                    }}
                  >
                    <div className="p-4 rounded-2xl bg-[#0e172f]/90 border border-sky-500/40 flex items-center gap-3.5 text-left shadow-lg">
                      <CheckCircle2 className="w-7 h-7 text-sky-400 shrink-0" />
                      <div>
                        <div className="text-3xl font-black text-white">Doctor / Clinician</div>
                        <div className="text-2xl font-mono text-sky-300 font-bold mt-0.5">Biometric Triage</div>
                      </div>
                    </div>
                  </div>
                </div>
              </PhysicalCard>
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* SCENE 6: THE POWERFUL AFFIRMATION OUTRO (Frames 945-1010) */}
      {/* ======================================================== */}
      {frame >= 945 && (
        <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
          <PhysicalCard
            tiltX={6}
            tiltY={-4}
            elevation={46}
            impactMs={31600}
            className="w-full max-w-[920px] p-9 rounded-3xl bg-[#0a1124]/95 border-2 border-cyan-500/60 shadow-2xl backdrop-blur-md flex flex-col items-center text-center gap-7"
          >
            {/* Cutout Hero: Hugging Comfort Embrace (Enlarged to 400px) */}
            <div className="my-2">
              <ProCutout
                assetId="hugging_comfort_embrace"
                glowColor="sky"
                animation="pop_spring"
                width={400}
                height={350}
                ghostText="TOGETHER"
              />
            </div>

            {/* Powerful Final Affirmation Title */}
            <div className="flex flex-col items-center gap-3">
              <h1 className="text-6xl font-black text-white tracking-tight leading-tight">
                YOU ARE NOT ALONE.
              </h1>
              <p className="text-4xl font-black text-cyan-300">
                You Don't Have To Figure It All Out
              </p>
            </div>

            {/* Final Telemetry Confirmation Pill */}
            <SecondaryMotion springPreset="fluidTelemetry" enableDrift className="w-full">
              <div className="p-4 rounded-2xl bg-cyan-500/20 border-2 border-cyan-500/50 text-2xl font-mono font-black text-cyan-200 flex items-center justify-center gap-3 shadow-lg">
                <Heart className="w-7 h-7 text-rose-400 fill-rose-400 animate-pulse" />
                <span>BIO-METRIC SUPPORT PROTOCOL ACTIVE</span>
              </div>
            </SecondaryMotion>
          </PhysicalCard>
        </div>
      )}

    </div>
  );
};
