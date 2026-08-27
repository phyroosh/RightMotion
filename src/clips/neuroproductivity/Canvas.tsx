import React from "react";
import { MotionKeyframeBox, createCardKeyframes, createChipKeyframes } from "../../components/MotionKeyframeBox";
import { WordTimestamp } from "../../types";
import {
  Calendar,
  Target,
  Layers,
  CheckCircle2,
  XCircle,
  Brain,
  Sparkles,
  Coffee,
  CheckSquare,
  Music,
  Zap,
  Flame,
  VolumeX,
  Sun,
  Shield,
  Clock,
  Shirt,
  Monitor,
  Trash2,
  Eye,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkle,
  Compass,
  Headphones,
  Lightbulb,
  Check,
  X,
  ArrowRight,
  RefreshCw,
  Sliders,
  Radio,
  FileText,
  Workflow,
  Smile,
  Frown,
} from "lucide-react";

interface CanvasProps {
  currentMs: number;
}

export const NeuroproductivityCanvas: React.FC<CanvasProps> = ({ currentMs }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 w-full h-full overflow-hidden">
      {/* ========================================================= */}
      {/* SCENE 1: THE 3 CONVENTIONAL ADVICE CARDS (4.5s - 16.8s)    */}
      {/* ========================================================= */}

      {/* 3 Advice Cards appearing side by side */}
      <MotionKeyframeBox
        currentMs={currentMs}
        keyframes={[
          { timeMs: 4400, opacity: 0, scale: 0.9, y: 40 },
          { timeMs: 4900, opacity: 1, scale: 1.0, y: 0 },
          { timeMs: 10500, opacity: 1, scale: 1.02, y: -4 },
          { timeMs: 11000, opacity: 0, scale: 0.92, y: 30 },
        ]}
        className="absolute top-[28%] left-[8%] w-[26%] bg-white rounded-3xl p-8 border-2 border-slate-200/90 shadow-[0_25px_60px_rgba(0,0,0,0.07)] flex flex-col gap-5"
      >
        <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
          <Calendar className="w-7 h-7" />
        </div>
        <div>
          <span className="text-xs font-mono font-black text-sky-600 uppercase tracking-widest">ADVICE 01</span>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-1">"Just make a schedule."</h3>
        </div>
      </MotionKeyframeBox>

      <MotionKeyframeBox
        currentMs={currentMs}
        keyframes={[
          { timeMs: 5600, opacity: 0, scale: 0.9, y: 40 },
          { timeMs: 6100, opacity: 1, scale: 1.0, y: 0 },
          { timeMs: 10500, opacity: 1, scale: 1.02, y: -4 },
          { timeMs: 11000, opacity: 0, scale: 0.92, y: 30 },
        ]}
        className="absolute top-[28%] left-[37%] w-[26%] bg-white rounded-3xl p-8 border-2 border-slate-200/90 shadow-[0_25px_60px_rgba(0,0,0,0.07)] flex flex-col gap-5"
      >
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
          <Target className="w-7 h-7" />
        </div>
        <div>
          <span className="text-xs font-mono font-black text-amber-600 uppercase tracking-widest">ADVICE 02</span>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-1">"Just focus on one thing."</h3>
        </div>
      </MotionKeyframeBox>

      <MotionKeyframeBox
        currentMs={currentMs}
        keyframes={[
          { timeMs: 7100, opacity: 0, scale: 0.9, y: 40 },
          { timeMs: 7600, opacity: 1, scale: 1.0, y: 0 },
          { timeMs: 10500, opacity: 1, scale: 1.02, y: -4 },
          { timeMs: 11000, opacity: 0, scale: 0.92, y: 30 },
        ]}
        className="absolute top-[28%] left-[66%] w-[26%] bg-white rounded-3xl p-8 border-2 border-slate-200/90 shadow-[0_25px_60px_rgba(0,0,0,0.07)] flex flex-col gap-5"
      >
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
          <Layers className="w-7 h-7" />
        </div>
        <div>
          <span className="text-xs font-mono font-black text-emerald-600 uppercase tracking-widest">ADVICE 03</span>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-1">"Just break it into smaller steps."</h3>
        </div>
      </MotionKeyframeBox>

      {/* The Frustration Strike: Works for someone else vs Completely useless for you */}
      <MotionKeyframeBox
        currentMs={currentMs}
        keyframes={[
          { timeMs: 11000, opacity: 0, scale: 0.92, y: 30 },
          { timeMs: 11600, opacity: 1, scale: 1.0, y: 0 },
          { timeMs: 16200, opacity: 1, scale: 1.02, y: -4 },
          { timeMs: 16800, opacity: 0, scale: 0.92, y: 30 },
        ]}
        className="absolute top-[24%] left-[15%] w-[70%] flex gap-8"
      >
        {/* Left: Someone else */}
        <div className="flex-1 bg-white rounded-3xl p-8 border-2 border-emerald-200 shadow-xl flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-black text-slate-900">Works Beautifully For Someone Else</h4>
          <p className="text-sm font-semibold text-slate-500">Smooth friction-free automatic habit loop</p>
          <div className="w-full h-3 bg-emerald-100 rounded-full overflow-hidden mt-2">
            <div className="w-full h-full bg-emerald-500 rounded-full" />
          </div>
        </div>

        {/* Right: For you */}
        <div className="flex-1 bg-white rounded-3xl p-8 border-2 border-rose-300 shadow-xl flex flex-col items-center text-center gap-4 relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
            <XCircle className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-black text-slate-900">Feels Completely Useless For You</h4>
          <p className="text-sm font-semibold text-slate-500">Massive internal friction & cognitive resistance</p>
          <div className="w-full h-3 bg-rose-100 rounded-full overflow-hidden mt-2">
            <div className="w-[15%] h-full bg-rose-500 rounded-full" />
          </div>
        </div>
      </MotionKeyframeBox>

      {/* ========================================================= */}
      {/* SCENE 2: THE 4 BRAIN FRAMEWORKS (28.5s - 40.0s)            */}
      {/* Solid Black Obsidian Canvas                               */}
      {/* ========================================================= */}

      {/* 4 Quadrants Grid */}
      <MotionKeyframeBox
        currentMs={currentMs}
        keyframes={[
          { timeMs: 28400, opacity: 0, scale: 0.92, y: 30 },
          { timeMs: 29000, opacity: 1, scale: 1.0, y: 0 },
          { timeMs: 39500, opacity: 1, scale: 1.02, y: -4 },
          { timeMs: 40000, opacity: 0, scale: 0.94, y: 30 },
        ]}
        className="absolute top-[18%] left-[10%] w-[80%] grid grid-cols-2 gap-6"
      >
        {/* Quadrant 1: Neurotypical */}
        <div className="bg-zinc-900/90 rounded-3xl p-7 border border-zinc-800 shadow-2xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                <Brain className="w-5 h-5" />
              </div>
              <h4 className="text-xl font-black text-white">NEUROTYPICAL</h4>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30">
              LINEAR
            </span>
          </div>
          <p className="text-sm font-medium text-zinc-400">
            Automates behavior through consistent repetition. Low friction for routine execution.
          </p>
        </div>

        {/* Quadrant 2: ADHD */}
        <div className="bg-zinc-900/90 rounded-3xl p-7 border border-amber-500/30 shadow-2xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-xl font-black text-white">ADHD</h4>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
              DOPAMINE-SEEKING
            </span>
          </div>
          <p className="text-sm font-medium text-zinc-400">
            Interest-based nervous system. Requires novelty, urgency, and immediate stimulation to engage.
          </p>
        </div>

        {/* Quadrant 3: Autism */}
        <div className="bg-zinc-900/90 rounded-3xl p-7 border border-emerald-500/30 shadow-2xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="text-xl font-black text-white">AUTISM</h4>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              PREDICTABILITY
            </span>
          </div>
          <p className="text-sm font-medium text-zinc-400">
            Structure regulates the nervous system. Highly sensitive to ambiguity, uncertainty, and sensory load.
          </p>
        </div>

        {/* Quadrant 4: AuDHD */}
        <div className="bg-zinc-900/90 rounded-3xl p-7 border border-indigo-500/30 shadow-2xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Sparkle className="w-5 h-5" />
              </div>
              <h4 className="text-xl font-black text-white">AuDHD</h4>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              THE DUAL PARADOX
            </span>
          </div>
          <p className="text-sm font-medium text-zinc-400">
            Simultaneously craves novelty while needing predictability. Requires balanced flexible structures.
          </p>
        </div>
      </MotionKeyframeBox>

      {/* ========================================================= */}
      {/* SCENE 3: ADVICE 01 — "MAKE A ROUTINE" (59.5s - 204.0s)     */}
      {/* Solid Studio White Canvas                                 */}
      {/* ========================================================= */}

      {/* Part A: Neurotypical Automatic Habit Chain (59.5s - 72.5s) */}
      <MotionKeyframeBox
        currentMs={currentMs}
        keyframes={[
          { timeMs: 59500, opacity: 0, scale: 0.92, y: 30 },
          { timeMs: 60200, opacity: 1, scale: 1.0, y: 0 },
          { timeMs: 72000, opacity: 1, scale: 1.02, y: -4 },
          { timeMs: 72500, opacity: 0, scale: 0.94, y: 30 },
        ]}
        className="absolute top-[22%] left-[12%] w-[76%] flex flex-col gap-6"
      >
        <div className="flex items-center justify-between bg-white rounded-2xl p-5 border-2 border-slate-200 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-black">
              NT
            </div>
            <span className="font-black text-slate-900 text-lg">NEUROTYPICAL ROUTINE: AUTOMATIC DECISION REDUCTION</span>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200">
            DECISIONS REQUIRED: -90%
          </span>
        </div>

        {/* 4 Automatic Steps */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-md flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center font-black text-lg">
              1
            </div>
            <h5 className="font-black text-slate-900 text-base">Wake Up</h5>
            <span className="text-xs text-slate-400 font-medium">Automatic trigger</span>
          </div>
          <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-md flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center font-black text-lg">
              2
            </div>
            <h5 className="font-black text-slate-900 text-base">Brush Teeth</h5>
            <span className="text-xs text-slate-400 font-medium">Habit anchored</span>
          </div>
          <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-md flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-black text-lg">
              3
            </div>
            <h5 className="font-black text-slate-900 text-base">Make Coffee</h5>
            <span className="text-xs text-slate-400 font-medium">Sensory reward</span>
          </div>
          <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-md flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-lg">
              4
            </div>
            <h5 className="font-black text-slate-900 text-base">Start Working</h5>
            <span className="text-xs text-slate-400 font-medium">Direct execution</span>
          </div>
        </div>
      </MotionKeyframeBox>

      {/* Part B1: ADHD 7:00 AM Wall & Neural Paralysis (72.8s - 88.0s) */}
      <MotionKeyframeBox
        currentMs={currentMs}
        keyframes={[
          { timeMs: 72800, opacity: 0, scale: 0.92, y: 30 },
          { timeMs: 73500, opacity: 1, scale: 1.0, y: 0 },
          { timeMs: 87500, opacity: 1, scale: 1.02, y: -4 },
          { timeMs: 88000, opacity: 0, scale: 0.94, y: 30 },
        ]}
        className="absolute top-[22%] left-[16%] w-[68%] bg-white rounded-3xl p-8 border-2 border-amber-300 shadow-2xl flex flex-col gap-6"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-amber-500" />
            <span className="font-black text-2xl text-slate-900">7:00 AM • The ADHD Initiation Wall</span>
          </div>
          <span className="text-xs font-mono font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
            MOTIVATION DEFICIT
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-amber-600 shrink-0 shadow-sm font-black text-2xl">
            ?
          </div>
          <p className="text-lg font-black text-slate-800 italic">
            "Okay. But what makes me want to do step one at 7:00 in the morning?"
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-black text-slate-400 uppercase">Task Quality</span>
            <p className="font-bold text-rose-500 mt-1">Boring / Low Dopamine</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-black text-slate-400 uppercase">Payoff Timing</span>
            <p className="font-bold text-rose-500 mt-1">Distant / Abstract</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-black text-slate-400 uppercase">Brain State</span>
            <p className="font-bold text-rose-500 mt-1">Under-Stimulated</p>
          </div>
        </div>
      </MotionKeyframeBox>

      {/* Part B2: ADHD Dopamine Engine: 5 Strategies (99.5s - 110.8s) */}
      <MotionKeyframeBox
        currentMs={currentMs}
        keyframes={[
          { timeMs: 99500, opacity: 0, scale: 0.92, y: 30 },
          { timeMs: 100200, opacity: 1, scale: 1.0, y: 0 },
          { timeMs: 110000, opacity: 1, scale: 1.02, y: -4 },
          { timeMs: 110800, opacity: 0, scale: 0.94, y: 30 },
        ]}
        className="absolute top-[20%] left-[10%] w-[80%] flex flex-col gap-5"
      >
        <div className="bg-white rounded-2xl p-4 border-2 border-emerald-300 shadow-md flex items-center justify-between">
          <span className="font-black text-slate-900 text-lg tracking-tight">
            ADHD SOLUTION: MAKE THE ROUTINE VISIBLE, IMMEDIATE & REWARDING
          </span>
          <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
            5 LEVERS
          </span>
        </div>

        <div className="grid grid-cols-5 gap-3.5">
          <div className="bg-white rounded-2xl p-5 border-2 border-slate-200 shadow-lg flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Coffee className="w-6 h-6" />
            </div>
            <h6 className="font-black text-sm text-slate-900">Coffee Gating</h6>
            <span className="text-xs text-slate-500 font-semibold">After 1st tiny micro-task</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border-2 border-slate-200 shadow-lg flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <CheckSquare className="w-6 h-6" />
            </div>
            <h6 className="font-black text-sm text-slate-900">Physical Checklist</h6>
            <span className="text-xs text-slate-500 font-semibold">Directly in line of sight</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border-2 border-slate-200 shadow-lg flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Music className="w-6 h-6" />
            </div>
            <h6 className="font-black text-sm text-slate-900">Audio Stimulation</h6>
            <span className="text-xs text-slate-500 font-semibold">Focus soundscape / BPM</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border-2 border-slate-200 shadow-lg flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h6 className="font-black text-sm text-slate-900">Short Bursts</h6>
            <span className="text-xs text-slate-500 font-semibold">15-minute sprint timers</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border-2 border-slate-200 shadow-lg flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Flame className="w-6 h-6" />
            </div>
            <h6 className="font-black text-sm text-slate-900">Artificial Urgency</h6>
            <span className="text-xs text-slate-500 font-semibold">Gamified finish line</span>
          </div>
        </div>
      </MotionKeyframeBox>

      {/* Part C: Autism Predictability & Sensory Load (115.6s - 175.5s) */}
      <MotionKeyframeBox
        currentMs={currentMs}
        keyframes={[
          { timeMs: 115600, opacity: 0, scale: 0.92, y: 30 },
          { timeMs: 116400, opacity: 1, scale: 1.0, y: 0 },
          { timeMs: 174500, opacity: 1, scale: 1.02, y: -4 },
          { timeMs: 175500, opacity: 0, scale: 0.94, y: 30 },
        ]}
        className="absolute top-[20%] left-[10%] w-[80%] flex flex-col gap-6"
      >
        {/* Autism Reframe */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-7 border-2 border-rose-200 shadow-xl flex flex-col gap-4">
            <div className="flex items-center gap-3 text-rose-600">
              <XCircle className="w-6 h-6" />
              <span className="font-black text-sm tracking-wider uppercase">Terrible Generic Advice</span>
            </div>
            <h4 className="text-2xl font-black text-slate-900 leading-tight">
              "Don't worry about the schedule. Just go with the flow."
            </h4>
            <p className="text-sm font-semibold text-slate-500">
              Creates severe anxiety by removing predictable structure and introducing chaos.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-7 border-2 border-emerald-300 shadow-xl flex flex-col gap-4">
            <div className="flex items-center gap-3 text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
              <span className="font-black text-sm tracking-wider uppercase">Autism-Regulating Strategy</span>
            </div>
            <h4 className="text-2xl font-black text-slate-900 leading-tight">
              "Predictable schedule + recovery room for the unexpected."
            </h4>
            <p className="text-sm font-semibold text-slate-500">
              Knowing what happens next removes uncertainty and calms the nervous system.
            </p>
          </div>
        </div>

        {/* Sensory Load Reduction Toolkit (Appears during sensory speech 141s - 175s) */}
        <MotionKeyframeBox
          currentMs={currentMs}
          keyframes={[
            { timeMs: 141000, opacity: 0, scale: 0.95, y: 15 },
            { timeMs: 141800, opacity: 1, scale: 1.0, y: 0 },
            { timeMs: 174500, opacity: 1, scale: 1.01, y: -3 },
            { timeMs: 175500, opacity: 0, scale: 0.94, y: 20 },
          ]}
        >
          <div className="bg-white rounded-2xl p-6 border-2 border-sky-200 shadow-lg flex items-center justify-between gap-4">
            <span className="font-black text-slate-900 text-sm uppercase tracking-wider shrink-0">
              SENSORY REDUCTION HACKS:
            </span>
            <div className="flex items-center gap-3">
              <span className="px-4 py-2 rounded-xl bg-sky-50 border border-sky-200 text-xs font-bold text-sky-800 flex items-center gap-2">
                <Headphones className="w-4 h-4 text-sky-600" /> Headphones
              </span>
              <span className="px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800 flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-600" /> Lower Lighting
              </span>
              <span className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600" /> Predictable Space
              </span>
              <span className="px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-800 flex items-center gap-2">
                <VolumeX className="w-4 h-4 text-indigo-600" /> Zero Interruptions
              </span>
            </div>
          </div>
        </MotionKeyframeBox>
      </MotionKeyframeBox>

      {/* Part D: AuDHD Tug-of-War Balance Scale (176.0s - 203.8s) */}
      <MotionKeyframeBox
        currentMs={currentMs}
        keyframes={[
          { timeMs: 176000, opacity: 0, scale: 0.92, y: 30 },
          { timeMs: 176800, opacity: 1, scale: 1.0, y: 0 },
          { timeMs: 203000, opacity: 1, scale: 1.02, y: -4 },
          { timeMs: 203800, opacity: 0, scale: 0.94, y: 30 },
        ]}
        className="absolute top-[20%] left-[12%] w-[76%] bg-white rounded-3xl p-8 border-2 border-indigo-300 shadow-2xl flex flex-col gap-6"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <Compass className="w-8 h-8 text-indigo-600" />
            <span className="font-black text-2xl text-slate-900">AuDHD • The Opposing Internal Vectors</span>
          </div>
          <span className="text-xs font-mono font-bold bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
            DUAL TENSION
          </span>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col gap-2">
            <span className="text-xs font-black text-amber-700 uppercase">Tension A</span>
            <p className="font-black text-slate-900 text-lg">
              Desperately wants structure ➔ Simultaneously struggles to follow it.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-sky-50 border border-sky-200 flex flex-col gap-2">
            <span className="text-xs font-black text-sky-700 uppercase">Tension B</span>
            <p className="font-black text-slate-900 text-lg">
              Craves novelty ➔ Unexpected changes are exhausting.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50 to-sky-50 border-2 border-indigo-200 text-center">
          <span className="text-xs font-mono font-black text-indigo-600 uppercase tracking-widest">
            THE GOLDEN ARCHITECTURE
          </span>
          <h4 className="text-xl font-black text-slate-900 mt-1">
            "Stable enough to feel predictable • Flexible enough to remain interesting."
          </h4>
        </div>
      </MotionKeyframeBox>

      {/* ========================================================= */}
      {/* SCENE 4: ADVICE 02 — "BREAK IT DOWN" (215.0s - 304.5s)     */}
      {/* Slate 900 Dark Charcoal Canvas                            */}
      {/* ========================================================= */}

      {/* Neurotypical vs ADHD Break Down (215.0s - 253.0s) */}
      <MotionKeyframeBox
        currentMs={currentMs}
        keyframes={[
          { timeMs: 215000, opacity: 0, scale: 0.92, y: 30 },
          { timeMs: 215800, opacity: 1, scale: 1.0, y: 0 },
          { timeMs: 252500, opacity: 1, scale: 1.02, y: -4 },
          { timeMs: 253000, opacity: 0, scale: 0.94, y: 30 },
        ]}
        className="absolute top-[18%] left-[10%] w-[80%] flex flex-col gap-6"
      >
        <div className="grid grid-cols-2 gap-6">
          {/* Left: Neurotypical Task Breakdown */}
          <div className="bg-slate-800/90 rounded-3xl p-7 border border-slate-700 shadow-xl flex flex-col gap-4">
            <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest">
              NEUROTYPICAL: DECOMPOSITION
            </span>
            <h4 className="text-xl font-black text-white">"Write My Report"</h4>
            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-sm font-semibold text-slate-300 flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-400" /> 1. Open document
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-sm font-semibold text-slate-300 flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-400" /> 2. Write title
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-sm font-semibold text-slate-300 flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-400" /> 3. Write introduction
              </div>
            </div>
            <span className="text-xs text-slate-400">Reduces overwhelm smoothly.</span>
          </div>

          {/* Right: ADHD Friction Reframe */}
          <div className="bg-slate-800/90 rounded-3xl p-7 border-2 border-amber-400/50 shadow-xl flex flex-col gap-4">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
              ADHD: ENGAGING ENTRY POINT
            </span>
            <h4 className="text-xl font-black text-white">"The Worst First Sentence"</h4>
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-amber-200 font-bold text-base">
              "Open the document and write the worst possible first sentence."
            </div>
            <div className="flex items-center gap-3 text-xs font-bold text-slate-300">
              <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700">🎮 Play</span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700">⚡ Movement</span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700">🔥 Zero Friction</span>
            </div>
          </div>
        </div>
      </MotionKeyframeBox>

      {/* Autism Sequence & Sharp Edges (253.1s - 281.0s) */}
      <MotionKeyframeBox
        currentMs={currentMs}
        keyframes={[
          { timeMs: 253100, opacity: 0, scale: 0.92, y: 30 },
          { timeMs: 253900, opacity: 1, scale: 1.0, y: 0 },
          { timeMs: 280500, opacity: 1, scale: 1.02, y: -4 },
          { timeMs: 281000, opacity: 0, scale: 0.94, y: 30 },
        ]}
        className="absolute top-[18%] left-[10%] w-[80%] flex flex-col gap-6"
      >
        <div className="bg-slate-800/90 rounded-3xl p-7 border border-slate-700 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-widest">
              AUTISM: REMOVING AMBIGUITY
            </span>
            <h4 className="text-2xl font-black text-white mt-1">"Clean Your Room" Is Vague</h4>
          </div>
          <span className="text-xs text-slate-400 font-medium max-w-xs text-right">
            Stress comes from hidden ambiguity: Where do I start? What counts as clean?
          </span>
        </div>

        {/* 4-Step Edges Sequence */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-slate-800 rounded-2xl p-6 border-2 border-emerald-500/40 shadow-md flex flex-col items-center text-center gap-3">
            <Shirt className="w-8 h-8 text-emerald-400" />
            <h5 className="font-black text-white text-base">1. Clothes First</h5>
            <span className="text-xs text-slate-400">Specific category</span>
          </div>
          <div className="bg-slate-800 rounded-2xl p-6 border-2 border-emerald-500/40 shadow-md flex flex-col items-center text-center gap-3">
            <Monitor className="w-8 h-8 text-emerald-400" />
            <h5 className="font-black text-white text-base">2. Then Desk</h5>
            <span className="text-xs text-slate-400">Clear work surface</span>
          </div>
          <div className="bg-slate-800 rounded-2xl p-6 border-2 border-emerald-500/40 shadow-md flex flex-col items-center text-center gap-3">
            <Layers className="w-8 h-8 text-emerald-400" />
            <h5 className="font-black text-white text-base">3. Then Floor</h5>
            <span className="text-xs text-slate-400">Visible ground space</span>
          </div>
          <div className="bg-slate-800 rounded-2xl p-6 border-2 border-emerald-500/40 shadow-md flex flex-col items-center text-center gap-3">
            <Trash2 className="w-8 h-8 text-emerald-400" />
            <h5 className="font-black text-white text-base">4. Then Trash</h5>
            <span className="text-xs text-slate-400">Final disposal</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center font-black text-emerald-300 text-lg">
          "And suddenly the task has sharp, visible edges."
        </div>
      </MotionKeyframeBox>

      {/* AuDHD Sequence + Stimulation (284.4s - 304.5s) */}
      <MotionKeyframeBox
        currentMs={currentMs}
        keyframes={[
          { timeMs: 284400, opacity: 0, scale: 0.92, y: 30 },
          { timeMs: 285200, opacity: 1, scale: 1.0, y: 0 },
          { timeMs: 304000, opacity: 1, scale: 1.02, y: -4 },
          { timeMs: 304500, opacity: 0, scale: 0.94, y: 30 },
        ]}
        className="absolute top-[20%] left-[12%] w-[76%] bg-slate-800/95 rounded-3xl p-8 border-2 border-indigo-400/50 shadow-2xl flex flex-col gap-6"
      >
        <div className="flex items-center justify-between border-b border-slate-700 pb-4">
          <div className="flex items-center gap-3">
            <Workflow className="w-8 h-8 text-indigo-400" />
            <span className="font-black text-2xl text-white">AuDHD • Sequence + Stimulation Synergy</span>
          </div>
          <span className="text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full">
            BOTH LEVERS
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700 flex flex-col items-center text-center gap-3">
            <Music className="w-8 h-8 text-sky-400" />
            <h6 className="font-black text-white text-base">Familiar Playlist</h6>
            <span className="text-xs text-slate-400">Consistent sensory backdrop</span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700 flex flex-col items-center text-center gap-3">
            <Clock className="w-8 h-8 text-amber-400" />
            <h6 className="font-black text-white text-base">Visible Timer</h6>
            <span className="text-xs text-slate-400">Anchors time perception</span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700 flex flex-col items-center text-center gap-3">
            <RefreshCw className="w-8 h-8 text-emerald-400" />
            <h6 className="font-black text-white text-base">2-Category Switch</h6>
            <span className="text-xs text-slate-400">Switch when one stalls</span>
          </div>
        </div>
      </MotionKeyframeBox>

      {/* ========================================================= */}
      {/* SCENE 5: ADVICE 03 — "USE A CALENDAR" (305.0s - 352.0s)    */}
      {/* Solid Studio White Canvas                                 */}
      {/* ========================================================= */}

      <MotionKeyframeBox
        currentMs={currentMs}
        keyframes={[
          { timeMs: 305000, opacity: 0, scale: 0.92, y: 30 },
          { timeMs: 305800, opacity: 1, scale: 1.0, y: 0 },
          { timeMs: 351500, opacity: 1, scale: 1.02, y: -4 },
          { timeMs: 352000, opacity: 0, scale: 0.94, y: 30 },
        ]}
        className="absolute top-[18%] left-[10%] w-[80%] flex flex-col gap-6"
      >
        <div className="bg-white rounded-3xl p-8 border-2 border-slate-200 shadow-xl flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-sky-600" />
              <span className="font-black text-2xl text-slate-900">ADHD Time Blindness & The 2-Tier Calendar</span>
            </div>
            <span className="text-xs font-mono font-bold bg-sky-100 text-sky-800 px-3 py-1 rounded-full">
              INTERMEDIATE ALERTS
            </span>
          </div>

          {/* Timeline Visualizer */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between relative">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black">
                NOW
              </div>
              <span className="text-xs font-bold text-slate-700 mt-2">Today</span>
            </div>

            <div className="flex-1 mx-6 h-2 bg-slate-200 rounded-full relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 rounded-full" />
              {/* Intermediate Alert Pin */}
              <div className="absolute left-[30%] -top-8 flex flex-col items-center">
                <span className="px-2.5 py-1 rounded-md bg-amber-500 text-white font-black text-[10px] shadow-sm">
                  PREPARE TRIGGER
                </span>
                <div className="w-1 h-4 bg-amber-500 mt-0.5" />
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center font-black">
                DUE
              </div>
              <span className="text-xs font-bold text-slate-700 mt-2">2 Weeks Out</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white border-2 border-slate-100 shadow-sm flex items-center gap-3">
              <Eye className="w-6 h-6 text-sky-500 shrink-0" />
              <span className="text-sm font-bold text-slate-800">Event Date: Tells you when it happens</span>
            </div>
            <div className="p-4 rounded-xl bg-white border-2 border-amber-200 shadow-sm flex items-center gap-3">
              <Zap className="w-6 h-6 text-amber-500 shrink-0" />
              <span className="text-sm font-bold text-slate-800">Prep Reminder: Tells you to start preparing</span>
            </div>
          </div>
        </div>
      </MotionKeyframeBox>

      {/* ========================================================= */}
      {/* SCENE 6: ADVICE 04 — "NEVER BREAK STREAKS" (353.0s - 399.5s) */}
      {/* Solid Black Obsidian Canvas                               */}
      {/* ========================================================= */}

      <MotionKeyframeBox
        currentMs={currentMs}
        keyframes={[
          { timeMs: 353000, opacity: 0, scale: 0.92, y: 30 },
          { timeMs: 353800, opacity: 1, scale: 1.0, y: 0 },
          { timeMs: 399000, opacity: 1, scale: 1.02, y: -4 },
          { timeMs: 399500, opacity: 0, scale: 0.94, y: 30 },
        ]}
        className="absolute top-[18%] left-[10%] w-[80%] flex flex-col gap-6"
      >
        <div className="grid grid-cols-2 gap-6">
          {/* Left: The Broken Streak Disaster */}
          <div className="bg-zinc-900/90 rounded-3xl p-7 border-2 border-rose-500/40 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-widest">
                THE BRITTLE STREAK TRAP
              </span>
              <XCircle className="w-5 h-5 text-rose-500" />
            </div>
            <h4 className="text-xl font-black text-white">"Just Do It Every Day"</h4>
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm font-medium">
              Miss 1 day ➔ Entire chain collapses ➔ Severe shame & restart paralysis.
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">✓</span>
              <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">✓</span>
              <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">✓</span>
              <span className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs">✗</span>
              <span className="text-xs font-mono text-zinc-500 ml-2">💥 CHAIN COLLAPSE</span>
            </div>
          </div>

          {/* Right: Resilient Return Protocol */}
          <div className="bg-zinc-900/90 rounded-3xl p-7 border-2 border-emerald-500/40 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                RESILIENT RETURN SYSTEM
              </span>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <h4 className="text-xl font-black text-white">"When I Miss, I Return"</h4>
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-bold">
              "Not: I must never miss. But: When I miss, I know exactly how I return."
            </div>
            <span className="text-xs text-zinc-400">
              Designs behavior for human reality, not idealized robotic consistency.
            </span>
          </div>
        </div>
      </MotionKeyframeBox>

      {/* ========================================================= */}
      {/* SCENE 7: THE UNDERLYING BOTTLENECK (400.0s - 482.5s)       */}
      {/* Solid Slate 50 Light Canvas                               */}
      {/* ========================================================= */}

      {/* 4 People Staring at Assignment (429.5s - 446.0s) */}
      <MotionKeyframeBox
        currentMs={currentMs}
        keyframes={[
          { timeMs: 429500, opacity: 0, scale: 0.92, y: 30 },
          { timeMs: 430200, opacity: 1, scale: 1.0, y: 0 },
          { timeMs: 445500, opacity: 1, scale: 1.02, y: -4 },
          { timeMs: 446000, opacity: 0, scale: 0.94, y: 30 },
        ]}
        className="absolute top-[20%] left-[10%] w-[80%] flex flex-col gap-5"
      >
        <div className="bg-white rounded-2xl p-4 border-2 border-slate-200 shadow-md text-center">
          <h4 className="text-xl font-black text-slate-900">
            Four People Staring At The Exact Same Unfinished Task
          </h4>
          <span className="text-xs text-slate-500 font-semibold">Outside: All Procrastinating • Inside: 4 Completely Different Experiences</span>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border-2 border-slate-200 shadow-lg flex flex-col items-center text-center gap-3">
            <span className="text-3xl">👀</span>
            <h6 className="font-black text-slate-900 text-sm">Person 1</h6>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">
              Distracted Attention
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border-2 border-slate-200 shadow-lg flex flex-col items-center text-center gap-3">
            <span className="text-3xl">🔋</span>
            <h6 className="font-black text-slate-900 text-sm">Person 2</h6>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md">
              Zero Motivation / Dopamine
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border-2 border-slate-200 shadow-lg flex flex-col items-center text-center gap-3">
            <span className="text-3xl">🌫️</span>
            <h6 className="font-black text-slate-900 text-sm">Person 3</h6>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
              Ambiguity Overwhelm
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border-2 border-slate-200 shadow-lg flex flex-col items-center text-center gap-3">
            <span className="text-3xl">⚡</span>
            <h6 className="font-black text-slate-900 text-sm">Person 4</h6>
            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md">
              Triple Collision
            </span>
          </div>
        </div>
      </MotionKeyframeBox>

      {/* The 5 Bottleneck Levers (465.0s - 482.5s) */}
      <MotionKeyframeBox
        currentMs={currentMs}
        keyframes={[
          { timeMs: 465000, opacity: 0, scale: 0.92, y: 30 },
          { timeMs: 465800, opacity: 1, scale: 1.0, y: 0 },
          { timeMs: 482000, opacity: 1, scale: 1.02, y: -4 },
          { timeMs: 482500, opacity: 0, scale: 0.94, y: 30 },
        ]}
        className="absolute top-[20%] left-[8%] w-[84%] flex flex-col gap-4"
      >
        <div className="bg-white rounded-2xl p-4 border-2 border-emerald-300 shadow-md text-center">
          <span className="font-black text-slate-900 text-lg uppercase tracking-tight">
            UNDERSTAND YOUR SPECIFIC BOTTLENECK LEVER
          </span>
        </div>

        <div className="grid grid-cols-5 gap-3">
          <div className="bg-white rounded-2xl p-4 border-2 border-slate-200 shadow-md flex flex-col items-center text-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            <h6 className="font-black text-xs text-slate-900">Novelty</h6>
            <span className="text-[11px] text-slate-500 font-medium">Helps you start</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border-2 border-slate-200 shadow-md flex flex-col items-center text-center gap-2">
            <Shield className="w-6 h-6 text-sky-500" />
            <h6 className="font-black text-xs text-slate-900">Predictability</h6>
            <span className="text-[11px] text-slate-500 font-medium">Helps you regulate</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border-2 border-slate-200 shadow-md flex flex-col items-center text-center gap-2">
            <Headphones className="w-6 h-6 text-emerald-500" />
            <h6 className="font-black text-xs text-slate-900">Sensory Reduction</h6>
            <span className="text-[11px] text-slate-500 font-medium">Frees up attention</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border-2 border-slate-200 shadow-md flex flex-col items-center text-center gap-2">
            <Eye className="w-6 h-6 text-indigo-500" />
            <h6 className="font-black text-xs text-slate-900">Visual Cues</h6>
            <span className="text-[11px] text-slate-500 font-medium">Makes invisible visible</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border-2 border-slate-200 shadow-md flex flex-col items-center text-center gap-2">
            <RotateCcw className="w-6 h-6 text-rose-500" />
            <h6 className="font-black text-xs text-slate-900">Recovery Points</h6>
            <span className="text-[11px] text-slate-500 font-medium">Absorbs life disruption</span>
          </div>
        </div>
      </MotionKeyframeBox>

      {/* ========================================================= */}
      {/* SCENE 8: THE GOLDEN REFRAME (514.0s - 528.0s)              */}
      {/* Studio White Solid Canvas                                 */}
      {/* ========================================================= */}

      <MotionKeyframeBox
        currentMs={currentMs}
        keyframes={[
          { timeMs: 514000, opacity: 0, scale: 0.92, y: 30 },
          { timeMs: 514800, opacity: 1, scale: 1.0, y: 0 },
          { timeMs: 527500, opacity: 1, scale: 1.02, y: -4 },
          { timeMs: 528000, opacity: 0, scale: 0.94, y: 30 },
        ]}
        className="absolute top-[20%] left-[14%] w-[72%] grid grid-cols-2 gap-6"
      >
        <div className="bg-white rounded-3xl p-7 border-2 border-rose-200 shadow-2xl flex flex-col gap-3">
          <div className="flex items-center gap-2 text-rose-500">
            <XCircle className="w-6 h-6" />
            <span className="font-black text-xs tracking-wider uppercase">Don't Ask</span>
          </div>
          <h4 className="text-2xl font-black text-slate-900">
            "What's wrong with your discipline?"
          </h4>
        </div>

        <div className="bg-white rounded-3xl p-7 border-2 border-emerald-400 shadow-2xl flex flex-col gap-3">
          <div className="flex items-center gap-2 text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
            <span className="font-black text-xs tracking-wider uppercase">Instead Ask</span>
          </div>
          <h4 className="text-2xl font-black text-slate-900">
            "What is your brain struggling with here?"
          </h4>
        </div>
      </MotionKeyframeBox>

      {/* ========================================================= */}
      {/* GAP FILLER A: ADHD INERTIA WALL (88.0s - 99.5s)           */}
      {/* Visualizes the frozen-despite-wanting-to-act feeling       */}
      {/* ========================================================= */}
      <MotionKeyframeBox
        currentMs={currentMs}
        keyframes={[
          { timeMs: 88000, opacity: 0, scale: 0.88, y: 40 },
          { timeMs: 88900, opacity: 1, scale: 1.0, y: 0 },
          { timeMs: 98800, opacity: 1, scale: 1.02, y: -5 },
          { timeMs: 99500, opacity: 0, scale: 0.93, y: 30 },
        ]}
        className="absolute top-[20%] left-[14%] w-[72%] flex flex-col gap-6"
      >
        {/* Big central quote card */}
        <div className="bg-white rounded-3xl p-8 border-2 border-amber-300 shadow-2xl text-center flex flex-col gap-4">
          <div className="flex items-center justify-center gap-3">
            <AlertTriangle className="w-8 h-8 text-amber-500" />
            <span className="text-xs font-mono font-black text-amber-700 uppercase tracking-widest">
              ADHD INERTIA PARADOX
            </span>
          </div>
          <h3 className="text-3xl font-black text-slate-900 leading-tight">
            "I know what I need to do.<br />
            I just can't make myself start."
          </h3>
          <p className="text-base font-semibold text-slate-500 max-w-lg mx-auto">
            It's not laziness. It's a neurological mismatch between intention and activation.
          </p>
        </div>

        {/* 3 inertia states side by side */}
        <div className="grid grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-6 border-2 border-rose-200 shadow-lg flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center text-2xl">😐</div>
            <h6 className="font-black text-slate-900 text-base">Body Won't Move</h6>
            <span className="text-xs text-slate-500 font-medium">Task initiation failure</span>
          </div>
          <div className="bg-white rounded-2xl p-6 border-2 border-amber-200 shadow-lg flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-2xl">🔁</div>
            <h6 className="font-black text-slate-900 text-base">Mental Loop</h6>
            <span className="text-xs text-slate-500 font-medium">Plans the same task repeatedly</span>
          </div>
          <div className="bg-white rounded-2xl p-6 border-2 border-sky-200 shadow-lg flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 rounded-full bg-sky-100 flex items-center justify-center text-2xl">⚡</div>
            <h6 className="font-black text-slate-900 text-base">Crisis Activates</h6>
            <span className="text-xs text-slate-500 font-medium">Finally starts under deadline pressure</span>
          </div>
        </div>
      </MotionKeyframeBox>

      {/* ========================================================= */}
      {/* GAP FILLER B: THE REAL QUESTION (400.0s - 429.5s)          */}
      {/* Philosophical interlude — what IS your brain's bottleneck? */}
      {/* ========================================================= */}
      <MotionKeyframeBox
        currentMs={currentMs}
        keyframes={[
          { timeMs: 400000, opacity: 0, scale: 0.88, y: 50 },
          { timeMs: 401000, opacity: 1, scale: 1.0, y: 0 },
          { timeMs: 428800, opacity: 1, scale: 1.02, y: -5 },
          { timeMs: 429500, opacity: 0, scale: 0.92, y: 30 },
        ]}
        className="absolute top-[16%] left-[10%] w-[80%] flex flex-col gap-5"
      >
        {/* Central thesis card */}
        <div className="bg-white rounded-3xl p-8 border-2 border-indigo-300 shadow-2xl text-center">
          <span className="text-xs font-mono font-black text-indigo-600 uppercase tracking-widest">
            The Deeper Pattern
          </span>
          <h3 className="text-3xl font-black text-slate-900 mt-3 leading-tight">
            Every piece of advice solves<br />
            <span className="text-indigo-600">one specific type of friction.</span>
          </h3>
        </div>

        {/* 4-friction cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border-2 border-amber-200 shadow-lg flex flex-col items-center text-center gap-3">
            <Zap className="w-8 h-8 text-amber-500" />
            <h6 className="font-black text-slate-900 text-sm">Activation Friction</h6>
            <span className="text-xs text-slate-500 font-semibold">Can't start</span>
          </div>
          <div className="bg-white rounded-2xl p-5 border-2 border-rose-200 shadow-lg flex flex-col items-center text-center gap-3">
            <VolumeX className="w-8 h-8 text-rose-500" />
            <h6 className="font-black text-slate-900 text-sm">Sensory Friction</h6>
            <span className="text-xs text-slate-500 font-semibold">Environment overwhelms</span>
          </div>
          <div className="bg-white rounded-2xl p-5 border-2 border-sky-200 shadow-lg flex flex-col items-center text-center gap-3">
            <AlertTriangle className="w-8 h-8 text-sky-500" />
            <h6 className="font-black text-slate-900 text-sm">Ambiguity Friction</h6>
            <span className="text-xs text-slate-500 font-semibold">Task boundaries unclear</span>
          </div>
          <div className="bg-white rounded-2xl p-5 border-2 border-emerald-200 shadow-lg flex flex-col items-center text-center gap-3">
            <RotateCcw className="w-8 h-8 text-emerald-500" />
            <h6 className="font-black text-slate-900 text-sm">Recovery Friction</h6>
            <span className="text-xs text-slate-500 font-semibold">Can't restart after breaks</span>
          </div>
        </div>

        {/* Bottom insight bar */}
        <div className="bg-slate-50 rounded-2xl p-5 border-2 border-slate-200 flex items-center justify-center gap-3 text-center">
          <Lightbulb className="w-6 h-6 text-amber-500 shrink-0" />
          <span className="font-black text-slate-800 text-base">
            Advice only works when it targets <em>your</em> specific friction type.
          </span>
        </div>
      </MotionKeyframeBox>

      {/* ========================================================= */}
      {/* GAP FILLER C: INTERNAL EXPERIENCE SPECTRUM (446s - 465s)   */}
      {/* The 4 radically different cognitive landscapes              */}
      {/* ========================================================= */}
      <MotionKeyframeBox
        currentMs={currentMs}
        keyframes={[
          { timeMs: 454000, opacity: 0, scale: 0.88, y: 40 },
          { timeMs: 454900, opacity: 1, scale: 1.0, y: 0 },
          { timeMs: 464500, opacity: 1, scale: 1.02, y: -5 },
          { timeMs: 465000, opacity: 0, scale: 0.93, y: 30 },
        ]}
        className="absolute top-[16%] left-[8%] w-[84%] flex flex-col gap-5"
      >
        <div className="bg-white rounded-2xl p-5 border-2 border-slate-200 shadow-md text-center">
          <span className="text-xs font-mono font-black text-slate-500 uppercase tracking-widest">
            The Invisible Internal Landscape
          </span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">
            Same Task. Four Completely Different Internal Battles.
          </h3>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {/* Neurotypical */}
          <div className="bg-white rounded-2xl p-5 border-2 border-sky-200 shadow-lg flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-black text-sm">NT</div>
              <span className="font-black text-slate-900 text-sm">Neurotypical</span>
            </div>
            <p className="text-xs font-semibold text-slate-600">
              Mild resistance. Applies willpower. Task begins within minutes.
            </p>
            <div className="h-2 bg-sky-100 rounded-full overflow-hidden">
              <div className="h-full bg-sky-500 rounded-full" style={{ width: "20%" }} />
            </div>
            <span className="text-[10px] font-bold text-sky-600">Friction Level: LOW</span>
          </div>

          {/* ADHD */}
          <div className="bg-white rounded-2xl p-5 border-2 border-amber-200 shadow-lg flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Zap className="w-9 h-9 p-2 rounded-xl bg-amber-100 text-amber-600" />
              <span className="font-black text-slate-900 text-sm">ADHD</span>
            </div>
            <p className="text-xs font-semibold text-slate-600">
              Dopamine wall. No urgency = no activation. Paralysis despite awareness.
            </p>
            <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: "80%" }} />
            </div>
            <span className="text-[10px] font-bold text-amber-600">Friction Level: VERY HIGH</span>
          </div>

          {/* Autism */}
          <div className="bg-white rounded-2xl p-5 border-2 border-emerald-200 shadow-lg flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Shield className="w-9 h-9 p-2 rounded-xl bg-emerald-100 text-emerald-600" />
              <span className="font-black text-slate-900 text-sm">Autism</span>
            </div>
            <p className="text-xs font-semibold text-slate-600">
              Task edges unclear. Sensory load too high. Nervous system in shutdown.
            </p>
            <div className="h-2 bg-emerald-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: "70%" }} />
            </div>
            <span className="text-[10px] font-bold text-emerald-600">Friction Level: HIGH</span>
          </div>

          {/* AuDHD */}
          <div className="bg-white rounded-2xl p-5 border-2 border-indigo-200 shadow-lg flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Sparkle className="w-9 h-9 p-2 rounded-xl bg-indigo-100 text-indigo-600" />
              <span className="font-black text-slate-900 text-sm">AuDHD</span>
            </div>
            <p className="text-xs font-semibold text-slate-600">
              Dopamine wall + sensory overload + ambiguity + rigid routines colliding.
            </p>
            <div className="h-2 bg-indigo-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: "95%" }} />
            </div>
            <span className="text-[10px] font-bold text-indigo-600">Friction Level: EXTREME</span>
          </div>
        </div>
      </MotionKeyframeBox>

    </div>
  );
};
