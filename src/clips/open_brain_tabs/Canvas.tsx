import React from "react";
import { Easing, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { WordTimestamp } from "../../types";
import { AnimatedSlashStrike, KineticHighlighter } from "../../components/kinetic_text";
import { CinematicIllustrationCard } from "../../components/CinematicIllustrationCard";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  FileText,
  Lock,
  Target,
  X,
  Zap,
} from "lucide-react";
import { SafeContent } from "../../components/safe_area";

interface CanvasProps {
  transcript: WordTimestamp[];
}

/**
 * 🎬 OpenBrainTabsCanvas — 100% Bespoke Motion Graphics
 * Topic: "Every Unfinished Task Leaves a Tab Open in Your Brain"
 * Channel: Judy Insights (Apple Studio Light Canvas #f8fafc)
 *
 * 📐 Platform-Aware Safe Zones (YouTube Shorts 9:16):
 * - Primary graphics strictly between y: 280px and y: 1340px (clearing top navigation bar 0-240px)
 * - Horizontal width: max 880px (clearing right-side engagement rail x: 910-1080px)
 * - Kinetic Captions reserved: top: 73% to top: 81% (y: 1380px to 1560px)
 * - Zero overlap with captions or platform UI!
 *
 * 4 Speech-Synchronized Narrative Scenes (FPS Adaptive):
 *   Scene 1 (0ms → 6000ms):    Browser Overload vs Brain Architecture (RAM surge & 3 Open Tabs)
 *   Scene 2 (6000ms → 19600ms): The Zeigarnik Effect (3D Brain, Urgent Priority Override & Cognitive Drain)
 *   Scene 3 (19600ms → 23600ms): The Dramatic Breath-Hold & Slashing "Mental Endurance" into External Offloading
 *   Scene 4 (23600ms → 33300ms): The External Anchor Protocol & Live Tab Shutdown Payoff
 */
export const OpenBrainTabsCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Frame helper: converts milliseconds to exact frame at current fps (e.g. 60fps)
  const f = (ms: number) => Math.round((ms / 1000) * fps);

  // Scene triggers based on exact speech timestamps
  const isScene1 = frame >= 0 && frame < f(6000);
  const isHookIntro = frame < f(2500);

  const isScene2 = frame >= f(6000) && frame < f(19600);

  const isScene3 = frame >= f(19600) && frame < f(23600);

  const isScene4 = frame >= f(23600);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none font-sans">
      {/* ======================================================== */}
      {/* SCENE 1: HOOK & THE ARCHITECTURE (0ms → 6000ms)          */}
      {/* "You leave 5 browser tabs open... exact same architecture"*/}
      {/* ======================================================== */}
      {isScene1 && (
        <div className="absolute inset-0 flex flex-col items-center justify-start px-8" style={{ paddingTop: 280 }}>
          {/* Part 1A: Mandatory 2.5s Hero Intro (0 → 2500ms) */}
          {isHookIntro ? (
            <SafeContent importance="critical" className="w-full max-w-[880px] flex flex-col items-center">
              <div
                className="w-full flex flex-col items-center"
                style={{
                  transform: `scale(${interpolate(frame, [0, f(2500)], [1.0, 1.04], {
                    extrapolateRight: "clamp",
                  })})`,
                }}
              >
                <CinematicIllustrationCard
                  imageSrc={staticFile("open_brain_tabs/assets/scene_illustration.png")}
                  width={880}
                  height={516}
                />
              </div>
            </SafeContent>
          ) : (
            /* Part 1B: The Cognitive RAM Architecture (2500ms → 6000ms) */
            <SafeContent importance="important" className="w-full max-w-[880px] flex flex-col items-center gap-5">
              {/* Architecture Header Badge */}
              <div
                className="px-6 py-2 rounded-2xl bg-white border-[2.5px] border-slate-900 shadow-md flex items-center gap-3"
                style={{
                  opacity: interpolate(frame, [f(2500), f(2700)], [0, 1], {
                    extrapolateLeft: "clamp",
                  }),
                  transform: `translateY(${interpolate(frame, [f(2500), f(2700)], [20, 0], {
                    extrapolateLeft: "clamp",
                    easing: Easing.out(Easing.cubic),
                  })}px)`,
                }}
              >
                <Activity className="w-6 h-6 text-rose-600" />
                <span className="font-mono text-[22px] font-black text-slate-900 tracking-wider uppercase">
                  SYSTEM MONITOR // BIOLOGICAL RAM
                </span>
              </div>

              {/* Cognitive RAM Meter Container */}
              <div
                className="w-full p-6 rounded-3xl bg-white border-[2.5px] border-slate-900 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.16)] flex flex-col gap-4"
                style={{
                  opacity: interpolate(frame, [f(2550), f(2750)], [0, 1], {
                    extrapolateLeft: "clamp",
                  }),
                  transform: `scale(${spring({
                    frame: Math.max(0, frame - f(2550)),
                    fps,
                    config: { damping: 13, stiffness: 130, mass: 0.8 },
                  })})`,
                }}
              >
                <div className="flex justify-between items-baseline">
                  <span className="text-[36px] font-black text-[#090d16] uppercase tracking-tight">
                    COGNITIVE LOAD
                  </span>
                  <span className="font-mono text-[52px] font-black text-rose-600">
                    {Math.round(
                      interpolate(frame, [f(2600), f(4200)], [24, 89], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                        easing: Easing.bezier(0.16, 1, 0.3, 1),
                      })
                    )}
                    %
                  </span>
                </div>

                {/* Meter Bar */}
                <div className="w-full h-7 rounded-full bg-slate-100 border-2 border-slate-900 overflow-hidden p-1">
                  <div
                    className="h-full rounded-full transition-all bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600"
                    style={{
                      width: `${interpolate(frame, [f(2600), f(4200)], [24, 89], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                      })}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between font-mono text-[20px] font-bold text-slate-500 uppercase">
                  <span>BASELINE (20%)</span>
                  <span className="text-rose-600 font-black">CRITICAL BOTTLENECK</span>
                </div>
              </div>

              {/* 3 Live Open Tab Chips entering sequentially on spoken audio */}
              <div className="w-full flex flex-col gap-3">
                {[
                  { label: "UNANSWERED INBOX THREAD", ms: 2760 },
                  { label: "HALF-WRITTEN REPORT", ms: 3500 },
                  { label: "UNRESOLVED DECISION", ms: 4200 },
                ].map((item, idx) => {
                  if (frame < f(item.ms)) return null;
                  const tabSpring = spring({
                    frame: frame - f(item.ms),
                    fps,
                    config: { damping: 12, stiffness: 150, mass: 0.5 },
                  });
                  return (
                    <div
                      key={idx}
                      className="w-full px-6 py-4 rounded-2xl bg-white border-[2.5px] border-slate-900 shadow-md flex items-center justify-between"
                      style={{
                        transform: `scale(${tabSpring}) translateY(${(1 - tabSpring) * 15}px)`,
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-4 h-4 rounded-full bg-rose-500 animate-pulse" />
                        <span className="text-[28px] font-black text-[#090d16] tracking-tight">
                          {item.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[20px] font-bold text-rose-600 uppercase">
                          ACTIVE RAM
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center">
                          <X className="w-5 h-5 text-slate-500" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Spoken Conclusion Slam (Frame f(5000)+: "Your brain operates on the exact same architecture") */}
              {frame >= f(4900) && (
                <div
                  className="w-full py-5 px-7 rounded-3xl bg-[#090d16] text-white border-[2.5px] border-slate-900 shadow-2xl flex items-center justify-between mt-2"
                  style={{
                    transform: `scale(${spring({
                      frame: frame - f(4900),
                      fps,
                      config: { damping: 14, stiffness: 160 },
                    })})`,
                  }}
                >
                  <span className="text-[36px] font-black tracking-wide uppercase">
                    SAME ARCHITECTURE
                  </span>
                  <span className="font-mono text-[22px] font-bold text-amber-400 uppercase">
                    ZERO HARD DRIVE
                  </span>
                </div>
              )}
            </SafeContent>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 2: THE ZEIGARNIK EFFECT & COGNITIVE HOARDING      */}
      {/* (6000ms → 19600ms)                                       */}
      {/* "Psychologists call this the Zeigarnik effect..."        */}
      {/* ======================================================== */}
      {isScene2 && (
        <div className="absolute inset-0 flex flex-col items-center justify-start px-8" style={{ paddingTop: 280 }}>
          {/* Main Title Card — Critical Headline protected inside Safe Text Region */}
          <SafeContent importance="critical" className="w-full max-w-[880px] flex flex-col items-center">
            <div
              className="w-full p-6 rounded-3xl bg-white border-[2.5px] border-slate-900 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.16)] flex flex-col items-center text-center gap-1.5"
              style={{
                transform: `scale(${spring({
                  frame: frame - f(6000),
                  fps,
                  config: { damping: 13, stiffness: 130 },
                })})`,
              }}
            >
              <span className="font-mono text-[22px] font-black text-indigo-600 tracking-widest uppercase">
                1927 // COGNITIVE RECALL LAW
              </span>
              <h1 className="text-[58px] font-black text-[#090d16] tracking-tight uppercase leading-none">
                THE ZEIGARNIK EFFECT
              </h1>
            </div>
          </SafeContent>

          {/* Subconscious Brain Staging & Conflict (Center focal zone) */}
          <SafeContent importance="critical" className="relative w-full max-w-[880px] flex flex-col items-center justify-center my-3">
            {/* Cutout 1: 3D Neural Brain (6000ms → 16200ms) */}
            {frame < f(16200) ? (
              <div
                className="relative flex flex-col items-center justify-center"
                style={{
                  transform: `scale(${spring({
                    frame: frame - f(6100),
                    fps,
                    config: { damping: 14, stiffness: 120 },
                  })})`,
                }}
              >
                {/* Ambient glow backing */}
                <div
                  className="absolute pointer-events-none rounded-full"
                  style={{
                    width: 520,
                    height: 520,
                    background:
                      frame >= f(10900)
                        ? "radial-gradient(circle, rgba(244,63,94,0.25) 0%, transparent 70%)"
                        : "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)",
                  }}
                />
                <img
                  src={staticFile("assets/psychology/hyperrealistic_3d_glowing_brain.png")}
                  alt="3D Neural Brain"
                  className="w-[500px] h-auto object-contain drop-shadow-[0_32px_50px_rgba(0,0,0,0.22)]"
                />

                {/* Spoken cue at 10900ms: "subconscious treats it as an urgent priority" */}
                {frame >= f(10900) && (
                  <div
                    className="absolute top-[48%] -translate-y-1/2 px-8 py-4 rounded-3xl bg-rose-600 text-white border-[3px] border-slate-950 shadow-2xl flex items-center gap-4"
                    style={{
                      transform: `scale(${spring({
                        frame: frame - f(10900),
                        fps,
                        config: { damping: 10, stiffness: 180, mass: 0.5 },
                      })}) rotate(-2deg)`,
                    }}
                  >
                    <AlertCircle className="w-9 h-9 text-amber-300" />
                    <div className="flex flex-col text-left">
                      <span className="font-mono text-[18px] font-black text-rose-200 uppercase tracking-widest">
                        THREAT STATUS
                      </span>
                      <span className="text-[38px] font-black tracking-tight uppercase leading-none">
                        URGENT PRIORITY
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Cutout 2: Depleted Brain Battery (16200ms → 19600ms) */
              /* Spoken cue: "quietly draining your focus and elevating low-grade anxiety" */
              <div
                className="relative flex flex-col items-center justify-center"
                style={{
                  transform: `scale(${spring({
                    frame: frame - f(16200),
                    fps,
                    config: { damping: 14, stiffness: 120 },
                  })})`,
                }}
              >
                <div
                  className="absolute pointer-events-none rounded-full"
                  style={{
                    width: 500,
                    height: 500,
                    background: "radial-gradient(circle, rgba(239,68,68,0.22) 0%, transparent 70%)",
                  }}
                />
                <img
                  src={staticFile("assets/burnout/brain_battery_depleted.png")}
                  alt="Depleted Brain Battery"
                  className="w-[480px] h-auto object-contain drop-shadow-[0_32px_50px_rgba(0,0,0,0.22)]"
                />
              </div>
            )}
          </SafeContent>

          {/* Lower Informational Banner: Progressive Reveal on spoken cues */}
          {frame >= f(13780) && (
            <SafeContent importance="important" className="w-full max-w-[880px] p-6 rounded-3xl bg-white border-[2.5px] border-slate-900 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.14)] flex items-center justify-between"
              style={{
                transform: `translateY(${interpolate(frame, [f(13780), f(14200)], [20, 0], {
                  extrapolateLeft: "clamp",
                  easing: Easing.out(Easing.cubic),
                })}px)`,
                opacity: interpolate(frame, [f(13780), f(14100)], [0, 1], {
                  extrapolateLeft: "clamp",
                }),
              }}
            >
              <div className="flex flex-col">
                <span className="font-mono text-[20px] font-bold text-slate-500 uppercase">
                  {frame < f(16200) ? "BACKGROUND PROCESS" : "NEUROLOGICAL IMPACT"}
                </span>
                <span className="text-[34px] font-black text-[#090d16] uppercase">
                  {frame < f(16200) ? "HOARDS ACTIVE RAM" : "ELEVATES LOW-GRADE ANXIETY"}
                </span>
              </div>
              <div className="px-5 py-2.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-2">
                <span className="font-mono text-[24px] font-black text-rose-600">
                  {frame < f(16200) ? "-75% FOCUS" : "+90% STRESS"}
                </span>
              </div>
            </SafeContent>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 3: DRAMATIC BREATH-HOLD & EPIPHANY (19600ms → 23600ms) */}
      {/* "The fix isn't forcing mental endurance. It's external offloading." */}
      {/* ======================================================== */}
      {isScene3 && (
        <div className="absolute inset-0 flex flex-col items-center justify-start px-8" style={{ paddingTop: 280 }}>
          {/* Phase A: 19600ms → 22200ms — Refuting Mental Endurance with Live Slash */}
          {frame < f(22200) ? (
            <SafeContent importance="critical" className="w-full max-w-[880px] flex flex-col items-center gap-6">
              {/* Category indicator */}
              <div className="px-6 py-2 rounded-2xl bg-white border-[2.5px] border-slate-900 shadow-md">
                <span className="font-mono text-[22px] font-black text-slate-600 tracking-wider uppercase">
                  THE COMMON FAILURE MODE
                </span>
              </div>

              {/* Flawed Premise Card */}
              <div className="w-full p-8 rounded-3xl bg-white border-[2.5px] border-slate-900 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.16)] flex flex-col items-center justify-center text-center gap-4">
                <span className="font-mono text-[22px] font-bold text-slate-400 uppercase">
                  POPULAR MISCONCEPTION
                </span>

                {/* Animated Slash Strike across "MENTAL ENDURANCE" at frame f(20800) */}
                <div className="relative py-2 px-4">
                  <AnimatedSlashStrike
                    startFrame={f(20800)}
                    durationFrames={14}
                    preset="blade_slash"
                    color="rose"
                    strokeWidth={8}
                  >
                    <h2 className="text-[64px] font-black text-[#090d16] uppercase tracking-tight leading-none">
                      MENTAL ENDURANCE
                    </h2>
                  </AnimatedSlashStrike>
                </div>

                {frame >= f(21200) && (
                  <div
                    className="px-6 py-2.5 rounded-2xl bg-rose-100 border-[2px] border-rose-600 text-rose-800 font-mono text-[22px] font-black uppercase"
                    style={{
                      transform: `scale(${spring({
                        frame: frame - f(21200),
                        fps,
                        config: { damping: 12, stiffness: 160 },
                      })})`,
                    }}
                  >
                    BIOLOGICALLY IMPOSSIBLE
                  </div>
                )}
              </div>

              {/* Depleted Battery Physical Cutout Anchor */}
              <div
                className="relative flex flex-col items-center justify-center mt-1"
                style={{
                  transform: `scale(${spring({
                    frame: frame - f(20800),
                    fps,
                    config: { damping: 14, stiffness: 130 },
                  })})`,
                }}
              >
                <img
                  src={staticFile("assets/burnout/battery_low_red.png")}
                  alt="Low Battery Red"
                  className="w-[400px] h-auto object-contain drop-shadow-[0_28px_45px_rgba(0,0,0,0.20)]"
                />
              </div>

              {/* Psychological Reason Line */}
              {frame >= f(21400) && (
                <div className="text-center font-sans text-[32px] font-black text-slate-700">
                  You cannot overpower open neural loops with willpower.
                </div>
              )}
            </SafeContent>
          ) : (
            /* Phase B: 22200ms → 23600ms — Epiphany: External Offloading */
            <SafeContent importance="critical" className="w-full max-w-[880px] flex flex-col items-center gap-6"
              style={{
                transform: `scale(${spring({
                  frame: frame - f(22200),
                  fps,
                  config: { damping: 13, stiffness: 130 },
                })})`,
              }}
            >
              <div className="px-6 py-2.5 rounded-2xl bg-emerald-100 border-[2.5px] border-emerald-800 shadow-md flex items-center gap-3">
                <Zap className="w-7 h-7 text-emerald-700" />
                <span className="font-mono text-[22px] font-black text-emerald-900 tracking-wider uppercase">
                  THE NEURO-SOLUTION
                </span>
              </div>

              {/* Sovereign Breakthrough Card */}
              <div className="w-full p-8 rounded-3xl bg-white border-[2.5px] border-slate-900 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.16)] flex flex-col items-center text-center gap-3">
                <span className="font-mono text-[22px] font-bold text-slate-500 uppercase">
                  SYSTEM OVERRIDE
                </span>

                <div className="py-2">
                  <KineticHighlighter
                    startFrame={f(22380)}
                    durationFrames={22}
                    color="lime"
                    heightPercentage="55%"
                  >
                    <h2 className="text-[60px] font-black text-[#090d16] uppercase tracking-tight">
                      EXTERNAL OFFLOADING
                    </h2>
                  </KineticHighlighter>
                </div>

                <p className="text-[30px] font-bold text-slate-600 mt-1">
                  Transfer the loop from working RAM into physical space.
                </p>
              </div>

              {/* Physical Circuit Cutout Anchor */}
              <div className="relative flex flex-col items-center justify-center mt-2">
                <img
                  src={staticFile("assets/psychology/dopamine_head_circuit.png")}
                  alt="Dopamine Circuit Head"
                  className="w-[420px] h-auto object-contain drop-shadow-[0_28px_45px_rgba(0,0,0,0.18)]"
                />
              </div>
            </SafeContent>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 4: EXTERNAL ANCHOR PROTOCOL & TAB SHUTDOWN        */}
      {/* (23600ms → 33300ms)                                      */}
      {/* "Write down the unfinished loop... closes the mental tab"*/}
      {/* ======================================================== */}
      {isScene4 && (
        <div className="absolute inset-0 flex flex-col items-center justify-start px-8" style={{ paddingTop: 280 }}>
          {/* Phase 4A: The 2-Step Protocol (23600ms → 28400ms) */}
          {frame < f(28400) ? (
            <SafeContent importance="critical" className="w-full max-w-[880px] flex flex-col items-center gap-5">
              <div className="px-6 py-2 rounded-2xl bg-white border-[2.5px] border-slate-900 shadow-md">
                <span className="font-mono text-[22px] font-black text-slate-900 tracking-wider uppercase">
                  THE 2-STEP CLOSURE PROTOCOL
                </span>
              </div>

              {/* Step 1 Card: Write down the loop (Spoken cue at 24440ms) */}
              {frame >= f(24000) && (
                <div
                  className="w-full p-6 rounded-3xl bg-white border-[2.5px] border-slate-900 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.14)] flex items-center justify-between"
                  style={{
                    transform: `scale(${spring({
                      frame: frame - f(24000),
                      fps,
                      config: { damping: 13, stiffness: 140 },
                    })})`,
                  }}
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 border-2 border-indigo-600 flex items-center justify-center">
                      <FileText className="w-8 h-8 text-indigo-700" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-mono text-[18px] font-bold text-indigo-600 uppercase">
                        STEP 01 // CAPTURE
                      </span>
                      <span className="text-[34px] font-black text-[#090d16] uppercase">
                        WRITE DOWN THE LOOP
                      </span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-mono text-[22px] font-black">
                    ✓
                  </div>
                </div>
              )}

              {/* Step 2 Card: Assign exact next micro-step (Spoken cue at 26980ms) */}
              {frame >= f(26500) && (
                <div
                  className="w-full p-6 rounded-3xl bg-white border-[2.5px] border-slate-900 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.14)] flex items-center justify-between"
                  style={{
                    transform: `scale(${spring({
                      frame: frame - f(26500),
                      fps,
                      config: { damping: 13, stiffness: 140 },
                    })})`,
                  }}
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 border-2 border-emerald-600 flex items-center justify-center">
                      <Target className="w-8 h-8 text-emerald-700" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-mono text-[18px] font-bold text-emerald-600 uppercase">
                        STEP 02 // ACTION POINT
                      </span>
                      <span className="text-[34px] font-black text-[#090d16] uppercase">
                        EXACT NEXT MICRO-STEP
                      </span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-mono text-[22px] font-black">
                    ✓
                  </div>
                </div>
              )}

              {/* Center Target Focus Crosshair Anchor */}
              <div className="relative flex flex-col items-center justify-center my-2">
                <img
                  src={staticFile("assets/habits/target_focus_crosshair.png")}
                  alt="Target Focus Crosshair"
                  className="w-[380px] h-auto object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.16)]"
                />
              </div>

              {/* Anchored Rule Callout */}
              {frame >= f(27200) && (
                <div
                  className="w-full py-4 px-6 rounded-2xl bg-slate-100 border-[2px] border-slate-300 text-center font-mono text-[22px] font-bold text-slate-700 uppercase"
                  style={{
                    opacity: interpolate(frame, [f(27200), f(27600)], [0, 1], {
                      extrapolateLeft: "clamp",
                    }),
                  }}
                >
                  Not "work on project" → "Open file & write 1st bullet"
                </div>
              )}
            </SafeContent>
          ) : (
            /* Phase 4B: Secure Anchor & Live Tab Closure Payoff (28400ms → 33300ms) */
            <SafeContent importance="critical" className="w-full max-w-[880px] flex flex-col items-center gap-5">
              {/* Spoken cue at 28440ms: "Once your brain knows the action is securely anchored" */}
              <div
                className="w-full p-6 rounded-3xl bg-white border-[2.5px] border-slate-900 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.16)] flex items-center justify-between"
                style={{
                  transform: `scale(${spring({
                    frame: frame - f(28400),
                    fps,
                    config: { damping: 13, stiffness: 140 },
                  })})`,
                }}
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 border-2 border-emerald-600 flex items-center justify-center">
                    <Lock className="w-8 h-8 text-emerald-700" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono text-[18px] font-bold text-emerald-600 uppercase">
                      COGNITIVE CONTRACT
                    </span>
                    <span className="text-[34px] font-black text-[#090d16] uppercase">
                      SECURELY ANCHORED
                    </span>
                  </div>
                </div>
                <span className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 font-mono text-[18px] font-black uppercase">
                  THREAT CLEARED
                </span>
              </div>

              {/* Cutout / Epiphany Mind Staging (31480ms+ / f 1888) */}
              {/* At 31480ms: "it immediately closes the mental tab" */}
              <div className="relative w-full flex flex-col items-center justify-center my-2">
                {frame >= f(31480) ? (
                  /* Radiant Enlightened Mind cutout on tab closure */
                  <div
                    className="relative flex flex-col items-center justify-center"
                    style={{
                      transform: `scale(${spring({
                        frame: frame - f(31480),
                        fps,
                        config: { damping: 12, stiffness: 150 },
                      })})`,
                    }}
                  >
                    <div
                      className="absolute pointer-events-none rounded-full"
                      style={{
                        width: 500,
                        height: 500,
                        background:
                          "radial-gradient(circle, rgba(16,185,129,0.30) 0%, transparent 70%)",
                      }}
                    />
                    <img
                      src={staticFile("assets/psychology/enlightened_mind_insight.png")}
                      alt="Enlightened Mind Insight"
                      className="w-[490px] h-auto object-contain drop-shadow-[0_32px_50px_rgba(0,0,0,0.22)]"
                    />
                  </div>
                ) : (
                  /* The Open Tab getting ready to close */
                  <div
                    className="w-full p-8 rounded-3xl bg-white border-[2.5px] border-slate-900 shadow-xl flex items-center justify-between"
                    style={{
                      transform: `scale(${spring({
                        frame: frame - f(28600),
                        fps,
                        config: { damping: 14, stiffness: 130 },
                      })})`,
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-5 h-5 rounded-full bg-amber-500 animate-pulse" />
                      <span className="text-[32px] font-black text-[#090d16] uppercase">
                        PENDING TASK TAB
                      </span>
                    </div>
                    <span className="font-mono text-[22px] font-bold text-indigo-600">
                      CLOSING...
                    </span>
                  </div>
                )}
              </div>

              {/* Decisive Resolution Typography (31480ms+) */}
              {frame >= f(31480) && (
                <div
                  className="w-full p-6 rounded-3xl bg-[#090d16] text-white border-[2.5px] border-slate-900 shadow-2xl flex flex-col items-center text-center gap-1.5"
                  style={{
                    transform: `scale(${spring({
                      frame: frame - f(31480),
                      fps,
                      config: { damping: 13, stiffness: 150 },
                    })})`,
                  }}
                >
                  <h3 className="text-[52px] font-black uppercase text-emerald-400 tracking-tight leading-tight">
                    TAB CLOSED.
                  </h3>
                  <span className="font-mono text-[22px] font-bold text-slate-300 uppercase tracking-wider">
                    WORKING RAM RESTORED TO 100%
                  </span>
                </div>
              )}
            </SafeContent>
          )}
        </div>
      )}
    </div>
  );
};
