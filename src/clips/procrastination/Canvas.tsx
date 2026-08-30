import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  Sparkles,
  Smartphone,
  FolderSync,
  Film,
  Brush,
  Brain,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Zap,
  Target,
  Clock,
  RotateCcw,
  CheckCircle2,
  Flame,
  Search,
  Timer,
  FileSpreadsheet,
  Mail,
  Dumbbell,
  MessageSquareWarning,
  Hourglass,
  Layers,
} from "lucide-react";
import { WordTimestamp } from "../../types";

interface CanvasProps {
  transcript: WordTimestamp[];
}

export const ProcrastinationCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  // Cinematic slow camera push across 16:9 canvas
  const cameraZoom = interpolate(frame, [0, durationInFrames], [1.0, 1.04], {
    extrapolateRight: "clamp",
  });

  // Snappy Premiere / After Effects spring curve
  const sp = (delayMs: number, d = 18, s = 120, m = 0.8) => {
    const df = Math.floor((delayMs / 1000) * fps);
    return spring({
      frame: Math.max(0, frame - df),
      fps,
      config: { damping: d, stiffness: s, mass: m },
    });
  };

  // A-Roll Presenter is active during:
  // (0-12s), (34-42s), (42-57s), (290-309s), (435-479s), (515s-end)
  const isARoll =
    (currentMs >= 0 && currentMs < 12000) ||
    (currentMs >= 34000 && currentMs < 57000) ||
    (currentMs >= 290000 && currentMs < 309080) ||
    (currentMs >= 435000 && currentMs < 478960) ||
    currentMs >= 515000;

  if (isARoll) return null;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-20 select-none overflow-hidden">
      {/* ===================================================================
          1. THE 17 PRIORITIES POP-IN (12,000 - 34,000ms)
          Editor Mindset: One hero prop on screen at a time, moving with words!
      =================================================================== */}
      {currentMs >= 12000 && currentMs < 34000 && (() => {
        // Sub-beats:
        // 12-16s: Room cleaning
        // 16-20s: Phone interesting
        // 20-24s: One video
        // 24-28s: Folder reorganizing
        // 28-34s: 10m -> 30m -> 2 hours time slip!

        if (currentMs < 16000) {
          const s = sp(12000);
          return (
            <div
              className="p-10 rounded-[40px] apple-glass border-2 border-sky-300 shadow-[0_30px_70px_rgba(14,165,233,0.15)] flex items-center gap-8 max-w-2xl"
              style={{
                transform: `scale(${0.9 + s * 0.1}) rotate(${interpolate(s, [0, 1], [-4, 0])}deg)`,
                opacity: Math.min(1, s * 1.5),
              }}
            >
              <div className="w-24 h-24 rounded-3xl bg-sky-500/15 text-sky-600 flex items-center justify-center shadow-inner shrink-0">
                <Brush className="w-14 h-14" />
              </div>
              <div className="flex flex-col">
                <span className="text-sky-600 font-mono text-xs font-black uppercase tracking-widest">
                  PRIORITY 01
                </span>
                <span className="text-slate-950 font-black text-4xl uppercase tracking-tight mt-1">
                  Cleaning The Room
                </span>
                <span className="text-sm text-slate-500 font-medium mt-1">
                  "Suddenly looks desperately untidy..."
                </span>
              </div>
            </div>
          );
        }

        if (currentMs < 20000) {
          const s = sp(16000);
          return (
            <div
              className="p-10 rounded-[40px] apple-glass border-2 border-indigo-300 shadow-[0_30px_70px_rgba(99,102,241,0.15)] flex items-center gap-8 max-w-2xl"
              style={{
                transform: `scale(${0.9 + s * 0.1}) rotate(${interpolate(s, [0, 1], [4, 0])}deg)`,
                opacity: Math.min(1, s * 1.5),
              }}
            >
              <div className="w-24 h-24 rounded-3xl bg-indigo-500/15 text-indigo-600 flex items-center justify-center shadow-inner shrink-0">
                <Smartphone className="w-14 h-14 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-indigo-600 font-mono text-xs font-black uppercase tracking-widest">
                  PRIORITY 02
                </span>
                <span className="text-slate-950 font-black text-4xl uppercase tracking-tight mt-1">
                  Phone Magnet
                </span>
                <span className="text-sm text-slate-500 font-medium mt-1">
                  "Unusually interesting notifications..."
                </span>
              </div>
            </div>
          );
        }

        if (currentMs < 24000) {
          const s = sp(20000);
          return (
            <div
              className="p-10 rounded-[40px] apple-glass border-2 border-rose-300 shadow-[0_30px_70px_rgba(244,63,94,0.15)] flex items-center gap-8 max-w-2xl"
              style={{
                transform: `scale(${0.9 + s * 0.1}) rotate(${interpolate(s, [0, 1], [-3, 0])}deg)`,
                opacity: Math.min(1, s * 1.5),
              }}
            >
              <div className="w-24 h-24 rounded-3xl bg-rose-500/15 text-rose-600 flex items-center justify-center shadow-inner shrink-0">
                <Film className="w-14 h-14" />
              </div>
              <div className="flex flex-col">
                <span className="text-rose-600 font-mono text-xs font-black uppercase tracking-widest">
                  PRIORITY 03
                </span>
                <span className="text-slate-950 font-black text-4xl uppercase tracking-tight mt-1">
                  Just That One Video
                </span>
                <span className="text-sm text-slate-500 font-medium mt-1">
                  "The clip you remembered you wanted to watch"
                </span>
              </div>
            </div>
          );
        }

        if (currentMs < 28000) {
          const s = sp(24000);
          return (
            <div
              className="p-10 rounded-[40px] apple-glass border-2 border-amber-300 shadow-[0_30px_70px_rgba(245,158,11,0.15)] flex items-center gap-8 max-w-2xl"
              style={{
                transform: `scale(${0.9 + s * 0.1}) rotate(${interpolate(s, [0, 1], [3, 0])}deg)`,
                opacity: Math.min(1, s * 1.5),
              }}
            >
              <div className="w-24 h-24 rounded-3xl bg-amber-500/15 text-amber-600 flex items-center justify-center shadow-inner shrink-0">
                <FolderSync className="w-14 h-14" />
              </div>
              <div className="flex flex-col">
                <span className="text-amber-600 font-mono text-xs font-black uppercase tracking-widest">
                  PRIORITY 04
                </span>
                <span className="text-slate-950 font-black text-4xl uppercase tracking-tight mt-1">
                  Folder Reorganization
                </span>
                <span className="text-sm text-slate-500 font-medium mt-1">
                  "Deeply curious about sorting directories"
                </span>
              </div>
            </div>
          );
        }

        // 28-34s: The Rapid Time Slip
        const sTime = sp(28000);
        return (
          <div
            className="p-10 rounded-[44px] bg-slate-950 text-white border-4 border-amber-400 shadow-[0_25px_80px_rgba(245,158,11,0.3)] flex items-center gap-10 max-w-3xl"
            style={{
              transform: `scale(${0.92 + sTime * 0.08})`,
              opacity: Math.min(1, sTime * 1.5),
            }}
          >
            <div className="w-24 h-24 rounded-3xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0">
              <Hourglass className="w-14 h-14 animate-spin" style={{ animationDuration: "6s" }} />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-amber-400 font-mono text-xs font-black uppercase tracking-widest">
                THE TIME SLIP TRAP
              </span>
              <div className="font-mono text-3xl font-black flex items-center gap-4">
                <span className="text-slate-400">10m</span>
                <ArrowRight className="w-6 h-6 text-amber-400" />
                <span className="text-amber-300">30m</span>
                <ArrowRight className="w-6 h-6 text-rose-400" />
                <span className="text-rose-400 text-5xl font-black">2 HOURS</span>
              </div>
              <span className="font-serif italic text-xl font-bold text-sky-400 mt-1">
                ✍️ "Behind schedule and annoyed with yourself"
              </span>
            </div>
          </div>
        );
      })()}

      {/* ===================================================================
          2. THE ANTICIPATION TRAP & AVOIDED ITEMS (57,000 - 141,760ms)
          Editor Mindset: Progressive focus, spotlighting one avoided task at a time!
      =================================================================== */}
      {currentMs >= 57000 && currentMs < 141760 && (() => {
        // 57-95s: Rapid Single Task Spotlight as mentioned by host
        // 95-141.7s: The 2 Brain Pathways (Discomfort vs Escape)

        if (currentMs < 95000) {
          // Specific task spotlight based on word timings
          let taskName = "Studying for Exam";
          let taskIcon = <FileSpreadsheet className="w-14 h-14" />;
          let taskColor = "border-sky-300 text-sky-600 bg-sky-50/20";

          if (currentMs >= 68000 && currentMs < 74000) {
            taskName = "Important Email";
            taskIcon = <Mail className="w-14 h-14" />;
            taskColor = "border-indigo-300 text-indigo-600 bg-indigo-50/20";
          } else if (currentMs >= 74000 && currentMs < 80000) {
            taskName = "Starting Project";
            taskIcon = <Target className="w-14 h-14" />;
            taskColor = "border-amber-300 text-amber-600 bg-amber-50/20";
          } else if (currentMs >= 80000 && currentMs < 86000) {
            taskName = "Going To The Gym";
            taskIcon = <Dumbbell className="w-14 h-14" />;
            taskColor = "border-emerald-300 text-emerald-600 bg-emerald-50/20";
          } else if (currentMs >= 86000) {
            taskName = "Hard Conversation";
            taskIcon = <MessageSquareWarning className="w-14 h-14" />;
            taskColor = "border-rose-300 text-rose-600 bg-rose-50/20";
          }

          const s = sp(currentMs);

          return (
            <div
              className={`p-10 rounded-[44px] apple-glass border-3 ${taskColor} shadow-2xl flex items-center gap-8 max-w-2xl`}
              style={{
                transform: `scale(${0.92 + s * 0.08})`,
                opacity: Math.min(1, s * 1.5),
              }}
            >
              <div className="w-24 h-24 rounded-3xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-lg">
                {taskIcon}
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-xs font-black uppercase text-slate-500 tracking-widest">
                  AVOIDED ACTION
                </span>
                <span className="text-slate-950 font-black text-4xl uppercase tracking-tight mt-1">
                  {taskName}
                </span>
                <span className="text-xs font-mono font-bold text-rose-500 uppercase mt-1">
                  ⚠️ Pre-Activity Anxiety Spike
                </span>
              </div>
            </div>
          );
        }

        // 95-141.7s: The 2 Clear Brain Choices (Side by side comparison)
        const sPath = sp(95000);
        return (
          <div
            className="w-full max-w-[1300px] grid grid-cols-2 gap-8"
            style={{
              transform: `translateY(${(1 - sPath) * 30}px)`,
              opacity: Math.min(1, sPath * 1.5),
            }}
          >
            {/* Path A */}
            <div className="p-8 rounded-[36px] apple-glass border-2 border-rose-200 flex flex-col gap-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-600 flex items-center justify-center font-black">
                A
              </div>
              <div>
                <span className="text-rose-500 font-mono text-xs font-black uppercase">PATH ONE</span>
                <h3 className="text-slate-950 font-black text-3xl uppercase tracking-tight mt-1">
                  Stay In Discomfort
                </h3>
              </div>
              <p className="text-xs text-slate-600 font-medium">Boredom, uncertainty, self-doubt</p>
              <div className="px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono font-bold">
                HIGH EMOTIONAL FRICTION
              </div>
            </div>

            {/* Path B */}
            <div className="p-8 rounded-[36px] bg-white/98 border-4 border-[#0071e3] flex flex-col gap-4 shadow-[0_20px_50px_rgba(0,113,227,0.25)]">
              <div className="w-12 h-12 rounded-2xl bg-[#0071e3] text-white flex items-center justify-center font-black">
                B
              </div>
              <div>
                <span className="text-[#0071e3] font-mono text-xs font-black uppercase">PATH TWO</span>
                <h3 className="text-slate-950 font-black text-3xl uppercase tracking-tight mt-1">
                  Escape & Instant Relief
                </h3>
              </div>
              <p className="text-xs text-slate-600 font-medium">Check phone, open tab, watch clip</p>
              <div className="px-4 py-2 rounded-xl bg-[#0071e3] text-white text-xs font-mono font-bold">
                SUBCONSCIOUS RELIEF REWARD
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===================================================================
          3. THE AVOIDANCE CIRCUIT (141,760 - 199,140ms)
          Editor Mindset: 4 Sequential Steps animating in rhythm
      =================================================================== */}
      {currentMs >= 141760 && currentMs < 199140 && (() => {
        const sCircuit = sp(141760);
        return (
          <div className="w-full max-w-[1400px] flex flex-col items-center gap-8">
            <div
              className="w-full grid grid-cols-4 gap-5"
              style={{
                transform: `translateY(${(1 - sCircuit) * 30}px)`,
                opacity: Math.min(1, sCircuit * 1.5),
              }}
            >
              <div className="p-6 rounded-3xl apple-glass border-2 border-slate-200 flex flex-col items-center text-center gap-3">
                <span className="font-mono text-xs font-bold text-slate-400">01</span>
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700">
                  <FileSpreadsheet className="w-7 h-7" />
                </div>
                <span className="font-black text-xl text-slate-950 uppercase">Open Task</span>
                <span className="text-[11px] text-slate-500 font-medium">Document / Email</span>
              </div>

              <div className="p-6 rounded-3xl apple-glass border-2 border-rose-300 bg-rose-50/30 flex flex-col items-center text-center gap-3">
                <span className="font-mono text-xs font-bold text-rose-500">02</span>
                <div className="w-14 h-14 rounded-2xl bg-rose-500/15 flex items-center justify-center text-rose-600">
                  <Flame className="w-7 h-7" />
                </div>
                <span className="font-black text-xl text-rose-600 uppercase">Pressure Wave</span>
                <span className="text-[11px] text-rose-600 font-medium">"I don't know this"</span>
              </div>

              <div className="p-6 rounded-3xl apple-glass border-2 border-indigo-300 flex flex-col items-center text-center gap-3">
                <span className="font-mono text-xs font-bold text-indigo-500">03</span>
                <div className="w-14 h-14 rounded-2xl bg-indigo-500 flex items-center justify-center text-white">
                  <Film className="w-7 h-7" />
                </div>
                <span className="font-black text-xl text-slate-950 uppercase">Close & Escape</span>
                <span className="text-[11px] text-indigo-600 font-medium">YouTube / Socials</span>
              </div>

              <div className="p-6 rounded-3xl bg-white/98 border-4 border-emerald-400 shadow-[0_20px_50px_rgba(16,185,129,0.25)] flex flex-col items-center text-center gap-3">
                <span className="font-mono text-xs font-bold text-emerald-600">04</span>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-white">
                  <Zap className="w-7 h-7" />
                </div>
                <span className="font-black text-xl text-slate-950 uppercase">Pressure Drops</span>
                <span className="text-[11px] text-emerald-700 font-bold">Relief Reward Loop</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 text-white flex items-center justify-between px-8 w-full max-w-3xl shadow-2xl">
              <span className="text-xs text-slate-300 font-medium">
                Your brain learns the pattern without asking permission.
              </span>
              <span className="font-serif italic text-xl font-bold text-sky-400">
                ✍️ "Avoidance-Learning Loop"
              </span>
            </div>
          </div>
        );
      })()}

      {/* ===================================================================
          4. THREAT TO COMPETENCE (199,140 - 268,000ms)
          Editor Mindset: Single Anxiety Shield Spotlight
      =================================================================== */}
      {currentMs >= 199140 && currentMs < 268000 && (() => {
        const sShield = sp(199140);
        return (
          <div
            className="w-full max-w-[1200px] p-8 rounded-[40px] bg-white/98 border-4 border-rose-400 shadow-[0_25px_80px_rgba(244,63,94,0.2)] flex flex-col gap-6"
            style={{
              transform: `scale(${0.94 + sShield * 0.06})`,
              opacity: Math.min(1, sShield * 1.5),
            }}
          >
            <div className="flex items-center justify-between border-b border-rose-100 pb-4">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-7 h-7 text-rose-500" />
                <span className="font-black text-3xl text-slate-950 uppercase">Threat To Competence</span>
              </div>
              <span className="px-4 py-1.5 rounded-xl bg-rose-500 text-white font-mono text-xs font-bold">
                EGO PROTECTION
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {["What if I can't understand it?", "What if I'm hopelessly behind?", "What if others do better?", "What if I try hard and fail?"].map((q, i) => (
                <div key={i} className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 font-bold text-sm">
                  "{q}"
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-xs text-slate-600 font-bold">
                When scrolling, you are not failing at anything.
              </span>
              <span className="font-serif italic text-2xl font-black text-[#0071e3]">
                ✍️ "Emotionally Expensive"
              </span>
            </div>
          </div>
        );
      })()}

      {/* ===================================================================
          5. THE 11:47 PM CLOCK (268,000 - 290,000ms)
          Editor Mindset: Bold glowing digital countdown
      =================================================================== */}
      {currentMs >= 268000 && currentMs < 290000 && (() => {
        const sClock = sp(268000);
        return (
          <div
            className="w-full max-w-[1000px] p-10 rounded-[44px] bg-slate-950 text-white border-4 border-amber-400 shadow-[0_25px_80px_rgba(245,158,11,0.3)] flex items-center justify-between"
            style={{
              transform: `scale(${0.92 + sClock * 0.08})`,
              opacity: Math.min(1, sClock * 1.5),
            }}
          >
            <div className="flex items-center gap-8">
              <div className="w-24 h-24 rounded-3xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-xl shrink-0">
                <Clock className="w-14 h-14 animate-spin" style={{ animationDuration: "12s" }} />
              </div>
              <div className="flex flex-col">
                <span className="text-amber-400 font-mono text-xs font-black uppercase tracking-widest">
                  THE LATE NIGHT SHIFT
                </span>
                <span className="text-white font-mono font-black text-6xl uppercase tracking-tight mt-1">
                  11:47 PM
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2 text-right">
              <span className="px-5 py-2 rounded-xl bg-rose-500 text-white font-mono font-black text-xs">
                PRESSURE INVERTED
              </span>
              <span className="text-xs text-slate-300 font-medium max-w-xs mt-1">
                Consequence of not doing it is now more painful than the task itself.
              </span>
            </div>
          </div>
        );
      })()}

      {/* ===================================================================
          6. THE 7-STEP GUILT COMPOUND (309,080 - 343,520ms)
          Editor Mindset: Cascading kinetic flowchart
      =================================================================== */}
      {currentMs >= 309080 && currentMs < 343520 && (() => {
        const sSpiral = sp(309080);
        return (
          <div className="w-full max-w-[1400px] flex flex-col items-center gap-8">
            <div
              className="w-full grid grid-cols-7 gap-3"
              style={{
                transform: `translateY(${(1 - sSpiral) * 30}px)`,
                opacity: Math.min(1, sSpiral * 1.5),
              }}
            >
              {[
                { step: "01", name: "TASK", color: "bg-slate-100 text-slate-800" },
                { step: "02", name: "DISCOMFORT", color: "bg-amber-100 text-amber-900" },
                { step: "03", name: "AVOIDANCE", color: "bg-indigo-100 text-indigo-900" },
                { step: "04", name: "RELIEF", color: "bg-emerald-100 text-emerald-900" },
                { step: "05", name: "GUILT", color: "bg-rose-100 text-rose-900" },
                { step: "06", name: "MORE PAIN", color: "bg-rose-200 text-rose-950 font-black" },
                { step: "07", name: "REPEAT", color: "bg-slate-900 text-white font-black" },
              ].map((s, idx) => (
                <div key={idx} className={`p-4 rounded-2xl ${s.color} border border-black/5 shadow-md flex flex-col items-center text-center gap-1.5`}>
                  <span className="font-mono text-[9px] font-bold opacity-60">STEP {s.step}</span>
                  <span className="font-black text-xs uppercase tracking-tight">{s.name}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-rose-500/10 border-2 border-rose-300 text-rose-900 px-8 flex items-center gap-4">
              <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
              <span className="font-bold text-sm">
                You're not just fighting the task — you're fighting everything you feel about the task.
              </span>
            </div>
          </div>
        );
      })()}

      {/* ===================================================================
          7. THE DIAGNOSTIC MATRIX (343,520 - 408,000ms)
          Editor Mindset: 3 Clean Root Causes & Permissions
      =================================================================== */}
      {currentMs >= 343520 && currentMs < 408000 && (() => {
        const sDiag = sp(343520);
        return (
          <div className="w-full max-w-[1400px] flex flex-col items-center gap-8">
            <div
              className="w-full grid grid-cols-3 gap-6"
              style={{
                transform: `translateY(${(1 - sDiag) * 30}px)`,
                opacity: Math.min(1, sDiag * 1.5),
              }}
            >
              <div className="p-8 rounded-[36px] apple-glass border-2 border-indigo-200 shadow-xl flex flex-col gap-3">
                <span className="px-3.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 font-mono text-xs font-bold w-fit">
                  01 • OVERWHELMED
                </span>
                <span className="text-slate-950 font-black text-2xl uppercase tracking-tight">
                  First Step Too Large
                </span>
                <p className="text-xs text-slate-600 font-medium">Break down into an immediate 2-minute micro action.</p>
              </div>

              <div className="p-8 rounded-[36px] apple-glass border-2 border-rose-200 shadow-xl flex flex-col gap-3">
                <span className="px-3.5 py-1 rounded-xl bg-rose-50 text-rose-700 font-mono text-xs font-bold w-fit">
                  02 • PERFECTIONISM
                </span>
                <span className="text-slate-950 font-black text-2xl uppercase tracking-tight">
                  Permission For Ugly Draft
                </span>
                <p className="text-xs text-slate-600 font-medium">Remove the need for perfection. Make a messy first pass.</p>
              </div>

              <div className="p-8 rounded-[36px] apple-glass border-2 border-amber-200 shadow-xl flex flex-col gap-3">
                <span className="px-3.5 py-1 rounded-xl bg-amber-50 text-amber-700 font-mono text-xs font-bold w-fit">
                  03 • BOREDOM
                </span>
                <span className="text-slate-950 font-black text-2xl uppercase tracking-tight">
                  Change Environment
                </span>
                <p className="text-xs text-slate-600 font-medium">Switch rooms or run a focused 15-minute timer.</p>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===================================================================
          8. THE 5-MINUTE RULE (408,000 - 435,000ms)
          Editor Mindset: Large stop-watch paradigm shift
      =================================================================== */}
      {currentMs >= 408000 && currentMs < 435000 && (() => {
        const sFive = sp(408000);
        return (
          <div
            className="w-full max-w-[1100px] p-10 rounded-[44px] bg-white/98 border-4 border-emerald-400 shadow-[0_25px_80px_rgba(16,185,129,0.3)] flex items-center justify-between"
            style={{
              transform: `scale(${0.92 + sFive * 0.08})`,
              opacity: Math.min(1, sFive * 1.5),
            }}
          >
            <div className="flex items-center gap-8">
              <div className="w-24 h-24 rounded-3xl bg-emerald-500 text-white flex items-center justify-center shadow-xl shrink-0">
                <CheckCircle2 className="w-14 h-14" />
              </div>
              <div className="flex flex-col">
                <span className="text-emerald-600 font-mono text-xs font-black uppercase tracking-widest">
                  ACTION PRECEDES EMOTION
                </span>
                <span className="text-slate-950 font-black text-5xl uppercase tracking-tight mt-1">
                  Do 5 Minutes Anyway
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end text-right">
              <span className="font-serif italic text-3xl font-black text-[#0071e3]">
                ✍️ "Feel uncomfortable and begin"
              </span>
            </div>
          </div>
        );
      })()}

      {/* ===================================================================
          9. COMPASSIONATE REFRAME (478,960 - 515,000ms)
          Editor Mindset: Identity reframe before finale
      =================================================================== */}
      {currentMs >= 478960 && currentMs < 515000 && (() => {
        const sReframe = sp(478960);
        return (
          <div
            className="w-full max-w-[1200px] grid grid-cols-2 gap-8"
            style={{
              transform: `scale(${0.94 + sReframe * 0.06})`,
              opacity: Math.min(1, sReframe * 1.5),
            }}
          >
            <div className="p-8 rounded-[36px] apple-glass border-2 border-rose-200 opacity-60 flex flex-col gap-2">
              <span className="text-xs font-mono font-black text-rose-500 uppercase">OBSOLETE BLAME</span>
              <span className="text-3xl font-black text-slate-900 uppercase line-through">"I am lazy & broken"</span>
            </div>

            <div className="p-8 rounded-[36px] bg-white/98 border-4 border-emerald-400 shadow-2xl flex flex-col gap-2">
              <span className="text-xs font-mono font-black text-emerald-600 uppercase">COMPASSIONATE TRUTH</span>
              <span className="text-3xl font-black text-slate-950 uppercase">"A learned protective reflex"</span>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
