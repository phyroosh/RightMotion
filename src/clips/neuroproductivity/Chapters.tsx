import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Sparkles, Brain, Compass, Clock, ShieldAlert, Target, CheckCircle2, HeartHandshake, Layers } from "lucide-react";

export interface ChapterDef {
  id: number;
  title: string;
  tag: string;
  startMs: number;
  endMs: number;
  icon: React.ComponentType<{ className?: string }>;
}

export const CHAPTERS: ChapterDef[] = [
  {
    id: 1,
    title: "The Productivity Trap",
    tag: "THE MYTH",
    startMs: 0,
    endMs: 28500,
    icon: Sparkles,
  },
  {
    id: 2,
    title: "The 4 Brain Frameworks",
    tag: "NEURODIVERSITY",
    startMs: 28500,
    endMs: 59500,
    icon: Brain,
  },
  {
    id: 3,
    title: "Advice 01: Make a Routine",
    tag: "REDUCING FRICTION",
    startMs: 59500,
    endMs: 215000,
    icon: Compass,
  },
  {
    id: 4,
    title: "Advice 02: Break It Down",
    tag: "AMBIGUITY VS STIMULATION",
    startMs: 215000,
    endMs: 305000,
    icon: Target,
  },
  {
    id: 5,
    title: "Advice 03: Use a Calendar",
    tag: "TIME BLINDNESS",
    startMs: 305000,
    endMs: 353000,
    icon: Clock,
  },
  {
    id: 6,
    title: "Advice 04: The Habit Streak Trap",
    tag: "RESILIENT RECOVERY",
    startMs: 353000,
    endMs: 400000,
    icon: ShieldAlert,
  },
  {
    id: 7,
    title: "The Underlying Bottleneck",
    tag: "ROOT CAUSES",
    startMs: 400000,
    endMs: 483000,
    icon: Layers,
  },
  {
    id: 8,
    title: "Fit Strategy To Brain",
    tag: "THE FINALE",
    startMs: 483000,
    endMs: 530680,
    icon: HeartHandshake,
  },
];

export const NeuroproductivityChapters: React.FC<{ currentMs: number }> = ({ currentMs }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const totalProgress = (frame / durationInFrames) * 100;

  // Find active chapter
  const activeChapter =
    CHAPTERS.find((c) => currentMs >= c.startMs && currentMs < c.endMs) ||
    CHAPTERS[CHAPTERS.length - 1];

  const chapterStartFrame = Math.floor((activeChapter.startMs / 1000) * fps);
  const chapterProgressFrames = Math.max(0, frame - chapterStartFrame);

  // Fast, snappy spring transition
  const entranceSpring = spring({
    frame: chapterProgressFrames,
    fps,
    config: { damping: 18, mass: 0.8, stiffness: 110 },
  });

  const IconComp = activeChapter.icon;

  return (
    <div className="absolute inset-x-0 top-0 pointer-events-none z-40 select-none">
      {/* 1. Sleek 16:9 Top Progress Bar with Subtle Gradient */}
      <div className="w-full h-1 bg-slate-300/40 relative overflow-hidden backdrop-blur-md">
        <div
          className="h-full bg-gradient-to-r from-[#0071e3] via-sky-400 to-[#6366f1] transition-all duration-100 ease-linear"
          style={{ width: `${totalProgress}%` }}
        />
      </div>

      {/* 2. Top-Left Widescreen Chapter Badge (Minimal, Apple Glass style) */}
      <div className="p-8 flex items-center justify-start">
        <div
          className="px-6 py-3 rounded-2xl apple-glass border border-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.06)] flex items-center gap-3.5"
          style={{
            transform: `translateY(${(1 - entranceSpring) * -16}px)`,
            opacity: Math.min(1, entranceSpring * 1.6),
          }}
        >
          <div className="w-8 h-8 rounded-xl bg-[#0071e3]/10 border border-[#0071e3]/20 flex items-center justify-center text-[#0071e3]">
            <IconComp className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono font-black text-sky-600 uppercase tracking-widest leading-none">
              CHAPTER 0{activeChapter.id} • {activeChapter.tag}
            </span>
            <span className="text-sm font-black text-slate-900 tracking-tight mt-0.5">
              {activeChapter.title}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
