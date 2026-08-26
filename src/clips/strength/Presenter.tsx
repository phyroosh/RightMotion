import React from "react";
import { interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Img } from "remotion";
import { HelpCircle, Sparkles, Feather } from "lucide-react";
import { WordTimestamp } from "../../types";

interface PresenterProps {
  transcript: WordTimestamp[];
}

export const StrengthPresenter: React.FC<PresenterProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  // A-Roll Active Intervals:
  // 1. 0 - 3,500ms (Intro Hook)
  // 2. 9,100 - 15,400ms (Real Strength Reframe & Asking for Help)
  // 3. 30,100 - 33,600ms (Carry Alone Myth / Unburdening)
  const isIntro = currentMs < 3500;
  const isReframe = currentMs >= 9100 && currentMs < 15400;
  const isAloneMyth = currentMs >= 30100 && currentMs < 33600;

  const isARoll = isIntro || isReframe || isAloneMyth;
  if (!isARoll) return null;

  // Dynamic Avatar Poses & Badges
  let pose = "character_pointing.png";
  let badgeTitle = "THE SILENT STRUGGLE";
  let badgeSub = "MEN'S EMOTIONAL PARADOX";
  let badgeColor = "from-indigo-600 via-blue-600 to-sky-600";
  let IconComponent = HelpCircle;

  if (isReframe) {
    pose = "character_open.png";
    badgeTitle = "STRATEGIC INTELLIGENCE";
    badgeSub = "THE REAL STRENGTH REFRAME";
    badgeColor = "from-sky-600 via-indigo-600 to-blue-700";
    IconComponent = Sparkles;
  } else if (isAloneMyth) {
    pose = "character_crossed.png";
    badgeTitle = "UNBURDEN YOURSELF";
    badgeSub = "YOU HAVE NOTHING TO PROVE";
    badgeColor = "from-indigo-700 via-purple-700 to-sky-600";
    IconComponent = Feather;
  }

  // Entrance spring animation
  const activeStartMs = isIntro ? 0 : isReframe ? 9100 : 30100;
  const startFrame = Math.floor((activeStartMs / 1000) * fps);
  const spr = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: { damping: 18, stiffness: 110, mass: 0.8 },
  });

  const slideY = interpolate(spr, [0, 1], [70, 0]);
  const opacity = interpolate(spr, [0, 1], [0, 1]);

  // Subtle punch-in camera effect during the reframe beat
  const punchScale = isReframe
    ? interpolate(currentMs, [9100, 12000], [1.0, 1.05], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1.0;

  const baseScale = interpolate(spr, [0, 1], [0.94, 1.0]) * punchScale;

  // Gentle idle breathing
  const idleY = Math.sin((frame / fps) * 2.5) * 5;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-10 flex flex-col items-center justify-center select-none">
      {/* Upper Large Context Badge (Mobile-optimized high readability) */}
      <div
        className="absolute top-[14%] flex flex-col items-center gap-3 z-30"
        style={{
          transform: `translateY(${slideY * 0.3}px)`,
          opacity,
        }}
      >
        <div className="px-10 py-3 rounded-full bg-slate-950/95 text-sky-400 font-mono text-base font-black uppercase tracking-widest border-2 border-slate-700 shadow-2xl flex items-center gap-3 backdrop-blur-xl">
          <span className="w-3 h-3 rounded-full bg-sky-400 animate-ping" />
          {badgeSub}
        </div>
        <div
          className={`px-12 py-5 rounded-[28px] bg-gradient-to-r ${badgeColor} text-white font-black text-3xl uppercase tracking-wider shadow-[0_20px_50px_rgba(0,113,227,0.35)] border-[3px] border-white/60 flex items-center gap-4`}
        >
          <IconComponent className="w-9 h-9 text-white drop-shadow-md shrink-0" />
          <span>{badgeTitle}</span>
        </div>
      </div>

      {/* Main Avatar Presenter Shot */}
      <div
        className="absolute top-[20%] w-[720px] h-[880px] flex items-center justify-center"
        style={{
          transform: `translateY(${slideY + idleY}px) scale(${baseScale})`,
          opacity,
        }}
      >
        <div className="relative w-full h-full flex items-center justify-center filter drop-shadow-[0_30px_60px_rgba(0,113,227,0.25)]">
          <Img
            src={staticFile(pose)}
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};
