import React from "react";
import {
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { WordTimestamp } from "../../types";
import {
  AnimatedSlashStrike,
  CameraShake,
  KineticHighlighter,
} from "../../components/kinetic_text";
import {
  Sparkles,
  Zap,
  CheckCircle2,
  Lock,
  Smartphone,
  Eye,
  Activity,
} from "lucide-react";

interface CanvasProps {
  transcript: WordTimestamp[];
}

/**
 * 🎬 RightMotion Bespoke Canvas — TheArtOfEnvironment
 * Channel: Judy Insights (Apple Studio Razor-Sharp Editorial)
 *
 * 📐 Mobile-First Composition (Section 25 / Rule 5.9):
 *   - Canvas: 1080x1920 @ 60 FPS (9:16 Vertical)
 *   - Safe Text/Graphic Zone: y: 260px to y: 1340px (height: 1080px, width: 940px)
 *   - Kinetic Captions Zone:  y: 1380px to y: 1560px
 *   - Platform UI Hazards:    Top 0-240px, Bottom 1560-1920px
 *   - High Information Density + Clear Hierarchy + Large Touchless Readability
 *   - Zero 500px dead space black holes!
 */
export const TheArtOfEnvironmentCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 60 FPS Boundary Triggers
  const fHookEnd = 150;    // 2.50s (Judy Intro exits here)
  const fS1End = 340;      // 5.67s
  const fS2End = 635;      // 10.58s
  const fS3End = 895;      // 14.92s
  const fS4End = 1150;     // 19.17s

  const isHookIntro = frame < fHookEnd;
  const isScene1 = frame >= fHookEnd && frame < fS1End;
  const isScene2 = frame >= fS1End && frame < fS2End;
  const isScene3 = frame >= fS2End && frame < fS3End;
  const isScene4 = frame >= fS3End && frame < fS4End;
  const isScene5 = frame >= fS4End;

  // Scene 1 Micro-beats:
  const fNotStrike = 182;
  const fRoomSlam = 280;

  // Scene 2 Micro-beats:
  const fObjectPhone = 390;
  const fObjectClutter = 483;
  const fDrainImpact = 585;

  // Scene 3 Micro-beats:
  const fDrainDrop = 716;
  const fFaceDownSlam = 825;

  // Scene 4 Micro-beats:
  const fPathB = 981;
  const fFrictionSlide = 1046;

  // Scene 5 Micro-beats:
  const fDisciplineSlash = 1159;
  const fPerimeterReveal = 1250;
  const fRule1 = 1362;
  const fRule2 = 1546;
  const fTakeaway = 1634;

  return (
    <div
      className="absolute inset-x-0 flex flex-col items-center select-none pointer-events-none px-6"
      style={{
        top: 260,
        height: 1080,
        maxWidth: 960,
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      {/* ======================================================== */}
      {/* 1. HOOK INTRO (0s - 2.5s / Frames 0 to 150)              */}
      {/* Bespoke Illustration Card staged alongside Judy           */}
      {/* ======================================================== */}
      {isHookIntro && (() => {
        const spHook = spring({
          frame,
          fps,
          config: { damping: 16, mass: 0.8, stiffness: 140 },
        });

        const kbScale = interpolate(frame, [0, 150], [1.0, 1.05], {
          extrapolateRight: "clamp",
        });

        return (
          <div
            className="w-full h-full flex flex-col items-center justify-start pt-2"
            style={{
              opacity: interpolate(spHook, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(spHook, [0, 1], [25, 0])}px) scale(${interpolate(spHook, [0, 1], [0.94, 1])})`,
            }}
          >
            {/* Minimal Category Badge */}
            <div className="flex items-center gap-3 px-6 py-2.5 rounded-full bg-slate-900 text-white shadow-md mb-4">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span className="text-xl font-mono font-bold tracking-wider uppercase">
                SPATIAL NEUROSCIENCE
              </span>
            </div>

            {/* Editorial Card with Generated Bespoke Illustration */}
            <div className="w-full rounded-3xl bg-white border-[3px] border-slate-900 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.18)] p-6 flex flex-col items-center overflow-hidden">
              <div className="w-full pb-3 px-2 flex justify-between items-center border-b border-slate-100">
                <span className="text-slate-950 text-3xl font-black tracking-tight">
                  THE WILLPOWER ILLUSION
                </span>
                <span className="text-sky-600 font-mono text-xl font-bold uppercase tracking-wide">
                  SPATIAL ARCHITECTURE
                </span>
              </div>

              <div className="w-full h-[460px] rounded-2xl overflow-hidden relative border border-slate-200 mt-4">
                <div
                  className="w-full h-full"
                  style={{ transform: `scale(${kbScale})` }}
                >
                  <Img
                    src={staticFile("the_art_of_environment/assets/scene_illustration.png")}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-slate-950/85 via-transparent to-transparent p-6">
                  <span className="text-white text-3xl font-black tracking-tight leading-snug drop-shadow-md">
                    YOUR ROOM DECIDES BEFORE YOU DO
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* 2. SCENE 1: THE MISATTRIBUTION & ROOM SLAM (Frames 150-340)*/}
      {/* Spoken: "not fighting impulses... fighting your room"    */}
      {/* ======================================================== */}
      {isScene1 && (() => {
        const spS1 = spring({
          frame: frame - fHookEnd,
          fps,
          config: { damping: 15, mass: 0.8, stiffness: 130 },
        });

        const showRoomSlam = frame >= fRoomSlam;
        const spRoom = spring({
          frame: Math.max(0, frame - fRoomSlam),
          fps,
          config: { damping: 12, mass: 0.6, stiffness: 200 },
        });

        return (
          <CameraShake
            triggerFrames={[fRoomSlam]}
            intensity={16}
            className="w-full h-full flex flex-col justify-between items-center py-2"
          >
            <div
              className="w-full flex flex-col items-center gap-6"
              style={{
                opacity: interpolate(spS1, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(spS1, [0, 1], [20, 0])}px)`,
              }}
            >
              {/* Scene Headline */}
              <div className="w-full text-center">
                <span className="text-slate-400 font-mono text-2xl font-bold uppercase tracking-widest">
                  STAGE 01: THE COGNITIVE ILLUSION
                </span>
                <h2 className="text-6xl font-black text-white tracking-tight mt-2">
                  WHAT ARE YOU REALLY FIGHTING?
                </h2>
              </div>

              {/* Contradiction Card 1: Internal Impulses (Slashed Live) */}
              <div className="relative w-full p-8 rounded-3xl bg-white border-[3px] border-slate-900 shadow-xl flex items-center justify-between overflow-hidden">
                <div className="flex flex-col">
                  <span className="text-xl font-mono font-bold text-slate-400 uppercase tracking-wider">
                    PERCEIVED OPPONENT
                  </span>
                  <AnimatedSlashStrike
                    startFrame={fNotStrike}
                    durationFrames={8}
                    preset="blade_slash"
                    color="rose"
                    strokeWidth={8}
                  >
                    <span className="text-5xl font-black text-slate-900 uppercase tracking-tight">
                      INTERNAL IMPULSES
                    </span>
                  </AnimatedSlashStrike>
                </div>
                <span
                  className={`text-2xl font-mono font-black uppercase px-5 py-2.5 rounded-xl border transition-all ${
                    frame >= fNotStrike
                      ? "text-rose-600 bg-rose-50 border-rose-200"
                      : "text-slate-500 bg-slate-100 border-slate-200"
                  }`}
                >
                  {frame >= fNotStrike ? "NOT THE CAUSE" : "FALSE TARGET"}
                </span>
              </div>
            </div>

            {/* Reveal Card 2: YOUR ROOM (Impact Slam) - Occupies Lower Half */}
            <div className="w-full">
              {showRoomSlam ? (
                <div
                  className="w-full p-8 rounded-3xl bg-slate-950 text-white border-[3px] border-slate-900 shadow-2xl flex flex-col gap-4"
                  style={{
                    transform: `scale(${interpolate(spRoom, [0, 1], [0.92, 1])}) translateY(${interpolate(spRoom, [0, 1], [15, 0])}px)`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-amber-400 font-mono text-2xl font-bold uppercase tracking-wider flex items-center gap-2">
                      <Lock className="w-6 h-6" />
                      THE TRUE FORCING FUNCTION
                    </span>
                    <span className="text-slate-300 font-mono text-xl font-black uppercase bg-slate-900 px-4 py-1.5 rounded-lg border border-slate-800">
                      10x LEVERAGE
                    </span>
                  </div>
                  <h3 className="text-8xl font-black tracking-tight leading-none text-white my-1">
                    YOUR ROOM
                  </h3>
                  <div className="text-3xl font-bold text-slate-200 leading-snug">
                    Physical space overrides willpower every single hour.
                  </div>
                </div>
              ) : (
                <div className="w-full p-6 rounded-3xl bg-slate-900/40 border-2 border-dashed border-slate-700/60 text-center">
                  <span className="text-xl font-mono text-slate-400 uppercase tracking-wide">
                    Analyzing environmental forcing functions...
                  </span>
                </div>
              )}
            </div>
          </CameraShake>
        );
      })()}

      {/* ======================================================== */}
      {/* 3. SCENE 2: THE SENSORY TAX & MICRO-DEMANDS (Frames 340-635)*/}
      {/* Spoken: "Every object in your visual field sends..."       */}
      {/* ======================================================== */}
      {isScene2 && (() => {
        const spS2 = spring({
          frame: frame - fS1End,
          fps,
          config: { damping: 15, mass: 0.8, stiffness: 130 },
        });

        const showPhone = frame >= fObjectPhone;
        const showClutter = frame >= fObjectClutter;
        const isImpact = frame >= fDrainImpact;

        const pulseScale = 1 + Math.sin(frame * 0.12) * 0.02;

        return (
          <CameraShake
            triggerFrames={[fDrainImpact]}
            intensity={12}
            className="w-full h-full flex flex-col justify-between items-center py-2"
          >
            {/* Top: Scene Headline */}
            <div
              className="w-full flex flex-col items-center"
              style={{
                opacity: interpolate(spS2, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(spS2, [0, 1], [20, 0])}px)`,
              }}
            >
              <div className="w-full text-center">
                <span className="text-slate-400 font-mono text-2xl font-bold uppercase tracking-widest">
                  STAGE 02: THE MECHANISM
                </span>
                <h2 className="text-6xl font-black text-white tracking-tight mt-2">
                  THE VISUAL FIELD TAX
                </h2>
              </div>
            </div>

            {/* Center: Large Semantic Cutout (Dopamine Head Circuit) */}
            <div className="relative w-full flex items-center justify-center my-1">
              <div
                className="relative z-10 flex items-center justify-center"
                style={{ transform: `scale(${pulseScale})` }}
              >
                <img
                  src={staticFile("assets/psychology/dopamine_head_circuit.png")}
                  alt="Neural Circuit"
                  className="w-[420px] h-auto object-contain"
                  style={{ filter: "invert(1) drop-shadow(0 0 35px rgba(56,189,248,0.35))" }}
                />
              </div>
            </div>

            {/* Lower: Micro-demand Callout Blocks Spanning to Bottom Boundary */}
            <div className="w-full flex flex-col gap-3.5">
              {showPhone && (
                <div className="w-full p-5 rounded-3xl bg-white border-[3px] border-slate-900 shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <Smartphone className="w-7 h-7 text-rose-500" />
                    <span className="text-3xl font-black text-slate-900">
                      PHONE IN PERIPHERY
                    </span>
                  </div>
                  <span className="text-2xl font-mono font-black text-rose-600 bg-rose-50 px-4 py-1.5 rounded-xl border border-rose-200">
                    +28% COGNITIVE TENSION
                  </span>
                </div>
              )}

              {showClutter && (
                <div className="w-full p-5 rounded-3xl bg-white border-[3px] border-slate-900 shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <Eye className="w-7 h-7 text-amber-500" />
                    <span className="text-3xl font-black text-slate-900">
                      DESK CLUTTER &amp; OPEN TABS
                    </span>
                  </div>
                  <span className="text-2xl font-mono font-black text-amber-600 bg-amber-50 px-4 py-1.5 rounded-xl border border-amber-200">
                    +35% BACKGROUND DRAIN
                  </span>
                </div>
              )}

              {isImpact && (
                <div className="w-full p-5 rounded-3xl bg-slate-950 text-white border-[3px] border-slate-900 shadow-2xl flex items-center justify-between">
                  <span className="text-2xl font-mono font-bold uppercase text-amber-400 flex items-center gap-3">
                    <Activity className="w-6 h-6" />
                    TOTAL PASSIVE LOAD
                  </span>
                  <span className="text-3xl font-mono font-black text-rose-400">
                    PREFRONTAL EXHAUSTION
                  </span>
                </div>
              )}
            </div>
          </CameraShake>
        );
      })()}

      {/* ======================================================== */}
      {/* 4. SCENE 3: THE PHONE PROXIMITY PENALTY (Frames 635-895)  */}
      {/* Spoken: "A phone on your desk silently drains..."        */}
      {/* ======================================================== */}
      {isScene3 && (() => {
        const spS3 = spring({
          frame: frame - fS2End,
          fps,
          config: { damping: 15, mass: 0.8, stiffness: 130 },
        });

        const drainProgress = interpolate(frame, [fDrainDrop, fDrainDrop + 70], [100, 38], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const isFaceDown = frame >= fFaceDownSlam;

        return (
          <CameraShake
            triggerFrames={[fFaceDownSlam]}
            intensity={14}
            className="w-full h-full flex flex-col justify-between items-center py-2"
          >
            {/* Top: Scene Headline */}
            <div
              className="w-full flex flex-col items-center"
              style={{
                opacity: interpolate(spS3, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(spS3, [0, 1], [20, 0])}px)`,
              }}
            >
              <div className="w-full text-center">
                <span className="text-slate-400 font-mono text-2xl font-bold uppercase tracking-widest">
                  STAGE 03: THE PROXIMITY STUDY
                </span>
                <h2 className="text-6xl font-black text-white tracking-tight mt-2">
                  THE SILENT BANDWIDTH LEAK
                </h2>
              </div>
            </div>

            {/* Center: Large Battery Low Cutout */}
            <div className="relative w-full flex flex-col items-center justify-center my-1">
              <img
                src={staticFile("assets/burnout/battery_low_red.png")}
                alt="Battery Depleted"
                className="w-[440px] h-auto object-contain drop-shadow-[0_20px_40px_rgba(244,63,94,0.3)]"
              />
            </div>

            {/* Lower: Dynamic Bandwidth Gauge Card & Scientific Callout */}
            <div className="w-full flex flex-col gap-4">
              <div className="w-full p-7 rounded-3xl bg-white border-[3px] border-slate-900 shadow-xl flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-mono font-bold text-slate-700 uppercase">
                    AVAILABLE WORKING MEMORY
                  </span>
                  <span className="text-6xl font-mono font-black text-rose-600">
                    {Math.round(drainProgress)}%
                  </span>
                </div>

                {/* Progress Bar Container */}
                <div className="w-full h-11 rounded-full bg-slate-100 border-[2.5px] border-slate-900 overflow-hidden p-1.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all"
                    style={{ width: `${drainProgress}%` }}
                  />
                </div>

                {/* Condition Indicator */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-xl font-mono text-slate-500 uppercase">
                    DEVICE STATE:
                  </span>
                  <span
                    className={`text-2xl font-black uppercase px-5 py-2 rounded-xl border ${
                      isFaceDown
                        ? "bg-rose-50 border-rose-300 text-rose-600"
                        : "bg-slate-50 border-slate-200 text-slate-700"
                    }`}
                  >
                    {isFaceDown ? "EVEN WHEN TURNED FACE DOWN" : "PHONE IN SIGHT"}
                  </span>
                </div>
              </div>

              {/* Scientific Callout */}
              <div className="w-full p-5 rounded-2xl bg-slate-900 text-white border-[2px] border-slate-800 text-center shadow-md">
                <span className="text-2xl font-bold text-slate-200">
                  Active Inhibition: Subconscious energy is consumed resisting the check.
                </span>
              </div>
            </div>
          </CameraShake>
        );
      })()}

      {/* ======================================================== */}
      {/* 5. SCENE 4: THE LAW OF SPATIAL FRICTION (Frames 895-1150) */}
      {/* Spoken: "Your brain takes the path of lowest..."         */}
      {/* ======================================================== */}
      {isScene4 && (() => {
        const spS4 = spring({
          frame: frame - fS3End,
          fps,
          config: { damping: 15, mass: 0.8, stiffness: 130 },
        });

        const showPathB = frame >= fPathB;
        const slideProgress = interpolate(frame, [fFrictionSlide, fFrictionSlide + 50], [0, 100], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div
            className="w-full h-full flex flex-col justify-between items-center py-2"
            style={{
              opacity: interpolate(spS4, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(spS4, [0, 1], [20, 0])}px)`,
            }}
          >
            {/* Top: Scene Headline */}
            <div className="w-full text-center">
              <span className="text-slate-400 font-mono text-2xl font-bold uppercase tracking-widest">
                STAGE 04: THE GOVERNING LAW
              </span>
              <h2 className="text-6xl font-black text-white tracking-tight mt-2">
                PATH OF LOWEST FRICTION
              </h2>
            </div>

            {/* Center: Path Comparison Board (High-Density Responsive System) */}
            <div className="w-full flex flex-col gap-4 my-auto">
              {/* Path A: High Spatial Friction */}
              <div className="w-full p-7 rounded-3xl bg-white border-[3px] border-slate-900 shadow-lg flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xl font-mono font-bold text-rose-500 uppercase tracking-wider">
                    HIGH SPATIAL FRICTION
                  </span>
                  <span className="text-4xl font-black text-slate-900 mt-1">
                    DEEP WORK &amp; STUDY
                  </span>
                  <span className="text-xl font-mono text-slate-500 mt-1.5">
                    Multiple physical barriers to start
                  </span>
                </div>
                <div className="px-6 py-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 font-mono font-black text-2xl uppercase">
                  RESISTED
                </div>
              </div>

              {/* Path B: Zero Spatial Friction */}
              {showPathB ? (
                <div className="w-full p-7 rounded-3xl bg-slate-950 text-white border-[3px] border-slate-900 shadow-2xl flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400 font-mono text-xl font-bold uppercase flex items-center gap-2.5">
                      <Zap className="w-6 h-6" />
                      ZERO SPATIAL FRICTION
                    </span>
                    <span className="text-emerald-300 font-mono font-black text-xl bg-emerald-950/80 px-4 py-1.5 rounded-xl border border-emerald-500/40">
                      100% EXECUTION RATE
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-4xl font-black text-white">
                      DOOMSCROLLING &amp; APPS
                    </span>
                    <span className="text-xl font-mono text-slate-300 mt-1">
                      Zero barriers (within arm&apos;s reach)
                    </span>
                  </div>

                  {/* Dynamic Friction Slider Track */}
                  <div className="w-full h-6 bg-slate-800 rounded-full overflow-hidden p-1 mt-1 border border-slate-700">
                    <div
                      className="h-full bg-emerald-400 rounded-full transition-all"
                      style={{ width: `${slideProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="w-full p-6 rounded-3xl bg-slate-900/40 border-2 border-dashed border-slate-700/60 text-center">
                  <span className="text-xl font-mono text-slate-400 uppercase tracking-wide">
                    Evaluating cognitive path of least resistance...
                  </span>
                </div>
              )}
            </div>

            {/* Bottom: Core Law Card Anchored directly above captions */}
            <div className="w-full p-6 rounded-3xl bg-white border-[3px] border-slate-900 text-center shadow-2xl">
              <span className="text-3xl font-black text-slate-950 leading-snug">
                &ldquo;You do not choose your habits. Your space chooses for you.&rdquo;
              </span>
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* 6. SCENE 5: THE 2-STEP RE-ARCHITECTURE (Frames 1150-1686) */}
      {/* Spoken: "Stop relying on discipline. Re-architect..."     */}
      {/* ======================================================== */}
      {isScene5 && (() => {
        const spS5 = spring({
          frame: frame - fS4End,
          fps,
          config: { damping: 15, mass: 0.8, stiffness: 130 },
        });

        const showRule1 = frame >= fRule1;
        const showRule2 = frame >= fRule2;
        const showTakeaway = frame >= fTakeaway;

        return (
          <CameraShake
            triggerFrames={[fPerimeterReveal, fTakeaway]}
            intensity={14}
            className="w-full h-full flex flex-col justify-between items-center py-2"
          >
            {/* Top: Scene Headline */}
            <div
              className="w-full flex flex-col items-center"
              style={{
                opacity: interpolate(spS5, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(spS5, [0, 1], [20, 0])}px)`,
              }}
            >
              <div className="w-full text-center">
                <span
                  className={`font-mono text-2xl font-bold uppercase tracking-widest ${
                    frame >= 1214 ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  STAGE 05: THE ARCHITECTURAL PROTOCOL
                </span>
                <h2
                  className={`text-6xl font-black tracking-tight mt-2 ${
                    frame >= 1214 ? "text-slate-950" : "text-white"
                  }`}
                >
                  RE-ARCHITECT YOUR PERIMETER
                </h2>
              </div>
            </div>

            {/* Center: Progressive Operational Rules */}
            <div className="w-full flex flex-col gap-4 my-auto">
              {/* Slash Discipline Card */}
              <div className="relative w-full p-7 rounded-3xl bg-white border-[3px] border-slate-900 shadow-lg flex items-center justify-between overflow-hidden">
                <div className="flex flex-col">
                  <span className="text-lg font-mono font-bold text-slate-400 uppercase">
                    OBSOLETE PARADIGM
                  </span>
                  <AnimatedSlashStrike
                    startFrame={fDisciplineSlash}
                    durationFrames={8}
                    preset="blade_slash"
                    color="rose"
                    strokeWidth={8}
                  >
                    <span className="text-4xl font-black text-slate-900 uppercase">
                      RELY ON WILLPOWER
                    </span>
                  </AnimatedSlashStrike>
                </div>
                <span className="text-2xl font-mono font-black text-rose-600 bg-rose-50 px-5 py-2 rounded-xl border border-rose-200 uppercase">
                  ACTIVE DRAIN
                </span>
              </div>

              {/* Protocol Rule 1: Increase Friction by 2 Steps */}
              {showRule1 && (
                <div className="w-full p-6 rounded-3xl bg-white border-[3px] border-slate-900 shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-600 shrink-0">
                      <Lock className="w-7 h-7" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-mono font-bold text-rose-600 uppercase">
                        RULE 01 // DISTRACTIONS
                      </span>
                      <span className="text-3xl font-black text-slate-900">
                        ADD +2 PHYSICAL STEPS
                      </span>
                      <span className="text-xl font-mono text-slate-500">
                        Phone in hallway behind a closed door
                      </span>
                    </div>
                  </div>
                  <span className="text-xl font-mono font-black text-slate-700 bg-slate-100 px-4 py-2 rounded-xl">
                    NEUTRALIZED
                  </span>
                </div>
              )}

              {/* Protocol Rule 2: Reduce Friction to Zero */}
              {showRule2 && (
                <div className="w-full p-6 rounded-3xl bg-slate-950 text-white border-[3px] border-slate-900 shadow-2xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-900/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-mono font-bold text-emerald-400 uppercase">
                        RULE 02 // IDENTITY FLOW
                      </span>
                      <KineticHighlighter
                        startFrame={fRule2}
                        durationFrames={12}
                        color="emerald"
                      >
                        <span className="text-3xl font-black text-white">
                          REDUCE FRICTION TO ZERO
                        </span>
                      </KineticHighlighter>
                      <span className="text-xl font-mono text-slate-300">
                        Desk clean, notebook open, work pre-staged
                      </span>
                    </div>
                  </div>
                  <span className="text-xl font-mono font-black text-emerald-400 bg-emerald-950 px-4 py-2 rounded-xl border border-emerald-500/40">
                    AUTOMATIC
                  </span>
                </div>
              )}
            </div>

            {/* Bottom: Decisive Closing Sovereign Callout */}
            <div className="w-full">
              {showTakeaway ? (
                <div className="w-full p-6 rounded-3xl bg-white border-[3px] border-slate-900 text-center shadow-2xl">
                  <h3 className="text-3xl font-black text-slate-950 tracking-tight leading-snug">
                    DESIGN YOUR ENVIRONMENT. IT DESIGNS YOU.
                  </h3>
                </div>
              ) : (
                <div className="w-full p-4 text-center">
                  <span className="text-lg font-mono text-slate-400 uppercase tracking-widest">
                    Operational Principle // The Sovereign Shift
                  </span>
                </div>
              )}
            </div>
          </CameraShake>
        );
      })()}
    </div>
  );
};
