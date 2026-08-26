import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Sparkles, Brain, Compass, Clock, ShieldAlert, Target, CheckCircle2, HeartHandshake } from "lucide-react";

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
    title: "The 17 Sudden Priorities",
    tag: "THE HOOK",
    startMs: 0,
    endMs: 42000,
    icon: Sparkles,
  },
  {
    id: 2,
    title: "The Core Revelation",
    tag: "THE REFRAME",
    startMs: 42000,
    endMs: 57000,
    icon: Brain,
  },
  {
    id: 3,
    title: "The Anticipation Trap",
    tag: "DISCOMFORT ESCAPE",
    startMs: 57000,
    endMs: 141760,
    icon: Compass,
  },
  {
    id: 4,
    title: "The Avoidance Loop",
    tag: "NEURAL REWARD",
    startMs: 141760,
    endMs: 199140,
    icon: Target,
  },
  {
    id: 5,
    title: "Threat to Competence",
    tag: "EGO DEFENSE",
    startMs: 199140,
    endMs: 268000,
    icon: ShieldAlert,
  },
  {
    id: 6,
    title: "The 11:47 PM Paradox",
    tag: "PRESSURE INVERSION",
    startMs: 268000,
    endMs: 309080,
    icon: Clock,
  },
  {
    id: 7,
    title: "The Guilt & Shame Compound",
    tag: "THE EXHAUSTION LOOP",
    startMs: 309080,
    endMs: 343520,
    icon: ShieldAlert,
  },
  {
    id: 8,
    title: "The Diagnostic Question",
    tag: "ROOT CAUSE",
    startMs: 343520,
    endMs: 408000,
    icon: Brain,
  },
  {
    id: 9,
    title: "Acting With Discomfort",
    tag: "THE 5-MINUTE SHIFT",
    startMs: 408000,
    endMs: 478960,
    icon: CheckCircle2,
  },
  {
    id: 10,
    title: "A Kinder Understanding",
    tag: "THE FINALE",
    startMs: 478960,
    endMs: 558140,
    icon: HeartHandshake,
  },
];

export const ProcrastinationChapters: React.FC<{ currentMs: number }> = ({ currentMs }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const totalProgress = (frame / durationInFrames) * 100;

  // Find active chapter
  const activeChapter = CHAPTERS.find(
    (c) => currentMs >= c.startMs && currentMs < c.endMs
  ) || CHAPTERS[CHAPTERS.length - 1];

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
      <div className="w-full h-1 bg-slate-200/50 relative overflow-hidden backdrop-blur-md">
        <div
          className="h-full bg-gradient-to-r from-[#0071e3] via-sky-400 to-[#6366f1] transition-all duration-100 ease-linear"
          style={{ width: `${totalProgress}%` }}
        />
      </div>

      {/* 2. Top-Left Widescreen Chapter Badge (Minimal, no cluttered right badge) */}
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
