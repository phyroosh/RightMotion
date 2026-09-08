import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Sun, Smartphone, CheckCircle2, MessageCircle, ArrowDown } from "lucide-react";

export interface PollOption {
  icon?: "sun" | "phone" | "check";
  title: string;
  subtitle: string;
  pct: number;
}

export interface EditorialPollCardProps {
  entranceFrame?: number;
  question?: string;
  optionA?: PollOption;
  optionB?: PollOption;
  width?: number;
  className?: string;
}

/**
 * 🗳️ EditorialPollCard
 * High-converting interactive poll card for the closing interactive question CTA.
 * Catalyzes viewer replies in the comments by showing live voting options.
 */
export const EditorialPollCard: React.FC<EditorialPollCardProps> = ({
  entranceFrame = 0,
  question = "BE HONEST: WHAT'S YOUR FIRST 60 MINUTES?",
  optionA = {
    icon: "sun",
    title: "15-Min Morning Sunlight",
    subtitle: "Resets clock & unlocks morning cortisol",
    pct: 28,
  },
  optionB = {
    icon: "phone",
    title: "Scroll Phone In Bed",
    subtitle: "Flattens curve & delays spike to midnight",
    pct: 72,
  },
  width = 920,
  className = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < entranceFrame) return null;

  const relFrame = frame - entranceFrame;

  const spCard = spring({
    frame: relFrame,
    fps,
    config: { damping: 14, stiffness: 140, mass: 0.8 },
  });

  const spBars = spring({
    frame: Math.max(0, relFrame - 12),
    fps,
    config: { damping: 16, stiffness: 110 },
  });

  const pctA = Math.round(interpolate(spBars, [0, 1], [0, optionA.pct]));
  const pctB = Math.round(interpolate(spBars, [0, 1], [0, optionB.pct]));

  return (
    <div
      className={`relative select-none pointer-events-none flex flex-col items-center ${className}`}
      style={{
        width: `${width}px`,
        opacity: spCard,
        transform: `scale(${interpolate(spCard, [0, 1], [0.88, 1])}) translateY(${interpolate(
          spCard,
          [0, 1],
          [40, 0]
        )}px)`,
      }}
    >
      <div
        className="w-full rounded-[44px] p-8 flex flex-col gap-6 relative overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #ffffff 0%, #f9f7f4 100%)",
          border: "2px solid rgba(15, 23, 42, 0.09)",
          boxShadow:
            "0 32px 70px -15px rgba(15, 23, 42, 0.16), 0 10px 24px -5px rgba(15, 23, 42, 0.08), inset 0 2px 0 rgba(255, 255, 255, 0.9)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-600 shadow-sm">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sky-600 font-mono text-xs font-black tracking-widest uppercase">
                COMMUNITY PULSE CHECK
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {question}
              </h3>
            </div>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white font-mono font-bold text-xs flex items-center gap-1.5 shadow-md">
            <span>LIVE POLL</span>
          </div>
        </div>

        {/* Two Options */}
        <div className="flex flex-col gap-4">
          {/* Option A */}
          <div className="relative p-5 rounded-3xl bg-slate-50 border border-slate-200 overflow-hidden shadow-sm">
            {/* Background Fill Progress Bar */}
            <div
              className="absolute inset-y-0 left-0 bg-emerald-500/15 transition-all duration-300 rounded-3xl"
              style={{ width: `${pctA}%` }}
            />

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-black text-slate-900 leading-tight">
                    {optionA.title}
                  </div>
                  <div className="text-xs font-mono font-bold text-slate-500 mt-0.5">
                    {optionA.subtitle}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono font-black text-3xl text-emerald-700">
                  {pctA}%
                </span>
              </div>
            </div>
          </div>

          {/* Option B */}
          <div className="relative p-5 rounded-3xl bg-slate-50 border border-slate-200 overflow-hidden shadow-sm">
            {/* Background Fill Progress Bar */}
            <div
              className="absolute inset-y-0 left-0 bg-rose-500/15 transition-all duration-300 rounded-3xl"
              style={{ width: `${pctB}%` }}
            />

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-black text-slate-900 leading-tight">
                    {optionB.title}
                  </div>
                  <div className="text-xs font-mono font-bold text-slate-500 mt-0.5">
                    {optionB.subtitle}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono font-black text-3xl text-rose-700">
                  {pctB}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Footer */}
        <div className="pt-2 flex items-center justify-center gap-3">
          <div className="px-8 py-3 rounded-full bg-slate-950 text-white font-mono font-black text-lg uppercase tracking-wider shadow-xl flex items-center gap-2.5">
            <span>Be honest: Drop your answer below</span>
            <ArrowDown className="w-5 h-5 text-sky-400 animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
};
