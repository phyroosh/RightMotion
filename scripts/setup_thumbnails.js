const fs = require('fs');
const path = require('path');

const THUMBNAIL_CARD_CODE = `import React from 'react';
import { Img, staticFile } from 'remotion';
import { Sparkles, Zap, Brain, Shield, Clock, Flame, Heart, CheckCircle2 } from 'lucide-react';

export interface ThumbnailCardProps {
  title: string;
  highlightWord?: string;
  highlightColor?: 'amber' | 'rose' | 'emerald' | 'sky' | 'purple' | 'yellow';
  subtitle?: string;
  categoryBadge?: string;
  characterPose?: string;
  characterPosition?: 'left' | 'right' | 'center';
  characterScale?: number;
  characterOffsetY?: number;
  theme?: 'obsidian' | 'crimson' | 'slate' | 'purple' | 'emerald' | 'amber' | 'blue' | 'white';
  aspectRatio?: '16:9' | '9:16';
  extraBadge?: string;
  extraBadgeColor?: string;
  visualGraphic?: React.ReactNode;
}

export const ThumbnailCard: React.FC<ThumbnailCardProps> = ({
  title,
  highlightWord,
  highlightColor = 'amber',
  subtitle,
  categoryBadge = 'PSYCHOLOGY ESSAY',
  characterPose = 'character_fullbody_pointing.png',
  characterPosition = 'right',
  characterScale = 1.0,
  characterOffsetY = 0,
  theme = 'obsidian',
  aspectRatio = '16:9',
  extraBadge,
  extraBadgeColor = 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  visualGraphic,
}) => {
  const is16x9 = aspectRatio === '16:9';

  const themeStyles = {
    obsidian: {
      bg: '#080c14',
      gradient: is16x9
        ? 'radial-gradient(circle at 75% 50%, #172033 0%, #080c14 70%)'
        : 'radial-gradient(circle at 50% 65%, #172033 0%, #080c14 75%)',
      glow: 'rgba(56, 189, 248, 0.30)',
      accent: '#38bdf8',
      cardBg: 'rgba(15, 23, 42, 0.88)',
      cardBorder: 'rgba(255, 255, 255, 0.14)',
    },
    crimson: {
      bg: '#140508',
      gradient: is16x9
        ? 'radial-gradient(circle at 75% 50%, #4c0519 0%, #140508 70%)'
        : 'radial-gradient(circle at 50% 65%, #4c0519 0%, #140508 75%)',
      glow: 'rgba(244, 63, 94, 0.40)',
      accent: '#ff3b5c',
      cardBg: 'rgba(20, 5, 8, 0.92)',
      cardBorder: 'rgba(244, 63, 94, 0.38)',
    },
    slate: {
      bg: '#0b0f19',
      gradient: is16x9
        ? 'radial-gradient(circle at 70% 40%, #1e2238 0%, #0b0f19 75%)'
        : 'radial-gradient(circle at 50% 65%, #1e2238 0%, #0b0f19 75%)',
      glow: 'rgba(99, 102, 241, 0.35)',
      accent: '#818cf8',
      cardBg: 'rgba(15, 23, 42, 0.90)',
      cardBorder: 'rgba(99, 102, 241, 0.32)',
    },
    purple: {
      bg: '#0d071a',
      gradient: is16x9
        ? 'radial-gradient(circle at 75% 50%, #3b0764 0%, #0d071a 70%)'
        : 'radial-gradient(circle at 50% 65%, #3b0764 0%, #0d071a 75%)',
      glow: 'rgba(168, 85, 247, 0.40)',
      accent: '#c084fc',
      cardBg: 'rgba(24, 10, 48, 0.92)',
      cardBorder: 'rgba(168, 85, 247, 0.38)',
    },
    emerald: {
      bg: '#04130c',
      gradient: is16x9
        ? 'radial-gradient(circle at 75% 50%, #064e3b 0%, #04130c 70%)'
        : 'radial-gradient(circle at 50% 65%, #064e3b 0%, #04130c 75%)',
      glow: 'rgba(16, 185, 129, 0.35)',
      accent: '#34d399',
      cardBg: 'rgba(6, 30, 20, 0.92)',
      cardBorder: 'rgba(16, 185, 129, 0.38)',
    },
    amber: {
      bg: '#140c04',
      gradient: is16x9
        ? 'radial-gradient(circle at 75% 50%, #78350f 0%, #140c04 70%)'
        : 'radial-gradient(circle at 50% 65%, #78350f 0%, #140c04 75%)',
      glow: 'rgba(245, 158, 11, 0.35)',
      accent: '#fbbf24',
      cardBg: 'rgba(30, 18, 6, 0.92)',
      cardBorder: 'rgba(245, 158, 11, 0.38)',
    },
    blue: {
      bg: '#030d1a',
      gradient: is16x9
        ? 'radial-gradient(circle at 75% 50%, #0c4a6e 0%, #030d1a 70%)'
        : 'radial-gradient(circle at 50% 65%, #0c4a6e 0%, #030d1a 75%)',
      glow: 'rgba(14, 165, 233, 0.40)',
      accent: '#38bdf8',
      cardBg: 'rgba(8, 28, 50, 0.92)',
      cardBorder: 'rgba(14, 165, 233, 0.38)',
    },
    white: {
      bg: '#f8fafc',
      gradient: 'radial-gradient(circle at 75% 50%, #e2e8f0 0%, #f8fafc 70%)',
      glow: 'rgba(0, 113, 227, 0.18)',
      accent: '#0071e3',
      cardBg: 'rgba(255, 255, 255, 0.96)',
      cardBorder: 'rgba(0, 0, 0, 0.12)',
    },
  }[theme];

  const highlightClass = {
    amber: 'bg-gradient-to-r from-amber-400 to-orange-500 text-black shadow-[0_0_35px_rgba(245,158,11,0.7)]',
    yellow: 'bg-yellow-400 text-black shadow-[0_0_35px_rgba(250,204,21,0.8)]',
    rose: 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-[0_0_35px_rgba(244,63,94,0.8)]',
    emerald: 'bg-gradient-to-r from-emerald-400 to-teal-500 text-black shadow-[0_0_35px_rgba(52,211,153,0.7)]',
    sky: 'bg-gradient-to-r from-sky-400 to-blue-600 text-white shadow-[0_0_35px_rgba(56,189,248,0.8)]',
    purple: 'bg-gradient-to-r from-purple-400 to-fuchsia-600 text-white shadow-[0_0_35px_rgba(192,132,252,0.8)]',
  }[highlightColor];

  const renderTitle = () => {
    if (!highlightWord) {
      return <span className="text-white font-black tracking-tight">{title}</span>;
    }

    const regex = new RegExp('(' + highlightWord + ')', 'gi');
    const parts = title.split(regex);
    return (
      <div className={'flex flex-wrap items-center gap-x-4 gap-y-3 leading-[1.08] ' + (is16x9 ? '' : 'justify-start')}>
        {parts.map((part, i) => {
          if (part.toLowerCase() === highlightWord.toLowerCase()) {
            return (
              <span
                key={i}
                className={'inline-block px-5 py-2 rounded-2xl font-black uppercase tracking-tight transform -rotate-1 ' + highlightClass}
              >
                {part}
              </span>
            );
          }
          return (
            <span key={i} className="text-white font-black tracking-tight drop-shadow-[0_4px_18px_rgba(0,0,0,0.9)]">
              {part}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className={'relative w-full h-full overflow-hidden select-none font-sans flex flex-col justify-between ' + (is16x9 ? 'p-14' : 'p-12 pt-16 pb-12')}
      style={{
        backgroundColor: themeStyles.bg,
        backgroundImage: themeStyles.gradient,
        width: is16x9 ? 1920 : 1080,
        height: is16x9 ? 1080 : 1920,
      }}
    >
      {/* 1. Ambient Glow Orbs */}
      <div
        className="absolute pointer-events-none rounded-full blur-[140px]"
        style={{
          width: is16x9 ? '850px' : '750px',
          height: is16x9 ? '850px' : '750px',
          background: themeStyles.glow,
          top: is16x9 ? '8%' : '45%',
          right: is16x9 ? '15%' : '15%',
        }}
      />
      <div
        className="absolute pointer-events-none rounded-full blur-[120px]"
        style={{
          width: '550px',
          height: '550px',
          background: 'rgba(255, 255, 255, 0.06)',
          bottom: '5%',
          left: '5%',
        }}
      />

      {/* Subtle Dot Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.25) 1.5px, transparent 1.5px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* 2. TOP HEADER BADGES */}
      <div className="relative z-30 flex items-center justify-between w-full">
        <div
          className="px-6 py-2.5 rounded-full flex items-center gap-3 backdrop-blur-xl border shadow-lg"
          style={{
            backgroundColor: themeStyles.cardBg,
            borderColor: themeStyles.cardBorder,
          }}
        >
          <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
          <span className="text-sm font-mono font-black tracking-widest text-slate-100 uppercase">
            {categoryBadge}
          </span>
        </div>

        {extraBadge && (
          <div className={'px-5 py-2 rounded-full font-mono text-xs font-bold border backdrop-blur-md ' + extraBadgeColor}>
            {extraBadge}
          </div>
        )}
      </div>

      {/* 3. MAIN CONTENT: HEADLINE & SUPPORTING GRAPHICS */}
      <div
        className={'relative z-30 flex flex-col gap-6 ' + (
          is16x9 ? 'max-w-[1120px]' : 'max-w-[960px] mt-6'
        )}
      >
        {/* Hero Title */}
        <div style={{ fontSize: is16x9 ? '86px' : '78px' }}>
          {renderTitle()}
        </div>

        {/* Subtitle / Key Hook Card */}
        {subtitle && (
          <div
            className="self-start px-7 py-4 rounded-2xl backdrop-blur-xl border shadow-xl flex items-center gap-3.5 max-w-2xl"
            style={{
              backgroundColor: themeStyles.cardBg,
              borderColor: themeStyles.cardBorder,
            }}
          >
            <Zap className="w-6 h-6 text-amber-400 shrink-0" />
            <span className={(is16x9 ? 'text-2xl' : 'text-xl') + ' font-bold text-slate-200 tracking-tight leading-snug'}>
              {subtitle}
            </span>
          </div>
        )}

        {/* Custom Visual Graphic Slot */}
        {visualGraphic && (
          <div className="mt-2">
            {visualGraphic}
          </div>
        )}
      </div>

      {/* 4. BOTTOM ACCENT FOOTER */}
      <div className="relative z-30 flex items-center justify-between pt-4 border-t border-white/10">
        <div className="flex items-center gap-3 text-slate-400 font-mono text-xs uppercase tracking-wider">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
          <span>{is16x9 ? 'RightClips Masterclass' : 'RightClips Shorts'}</span>
        </div>

        <div className="flex items-center gap-2 text-slate-400 font-mono text-xs">
          <span>{is16x9 ? 'HD 4K 16:9' : 'HD 4K 9:16 SHORTS'}</span>
        </div>
      </div>

      {/* 5. FULL BODY CHARACTER POSE */}
      {characterPose && (
        <div
          className={'absolute pointer-events-none z-20 flex items-end justify-center ' + (
            is16x9
              ? (characterPosition === 'left' ? 'left-10 bottom-0' : 'right-10 bottom-0')
              : 'right-0 bottom-0'
          )}
          style={{
            width: is16x9 ? '640px' : '620px',
            height: is16x9 ? '980px' : '1080px',
            transform: 'scale(' + characterScale + ') translateY(' + characterOffsetY + 'px)',
            transformOrigin: 'bottom center',
          }}
        >
          <div
            className="absolute bottom-10 w-[450px] h-[640px] rounded-full blur-[90px] pointer-events-none"
            style={{
              background: themeStyles.glow,
              opacity: 0.85,
            }}
          />

          <Img
            src={staticFile(characterPose)}
            className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_25px_60px_rgba(0,0,0,0.95)] drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]"
            alt="Character"
          />
        </div>
      )}
    </div>
  );
};
`;

const INDEX_CODE = `import React from 'react';
import { ThumbnailCard } from './ThumbnailCard';
import { Brain, Shield, Clock, Flame, Heart, Sparkles, Moon, Award, CheckCircle2 } from 'lucide-react';

// ========================================================
// 16:9 WIDESCREEN THUMBNAILS (Long-Form Masterclasses)
// ========================================================

// 1. NEUROPRODUCTIVITY (16:9 Long Form Masterclass)
export const NeuroproductivityThumbnail: React.FC = () => {
  const graphic = (
    <div className="flex items-center gap-3">
      {[
        { label: 'ADHD', desc: 'Dopamine Loop', color: 'border-rose-500/40 bg-rose-950/50 text-rose-300' },
        { label: 'AUTISM', desc: 'Sensory Load', color: 'border-sky-500/40 bg-sky-950/50 text-sky-300' },
        { label: 'AuDHD', desc: 'Inertia Paradox', color: 'border-purple-500/40 bg-purple-950/50 text-purple-300' },
        { label: 'NT', desc: 'Linear Action', color: 'border-emerald-500/40 bg-emerald-950/50 text-emerald-300' },
      ].map((item) => (
        <div key={item.label} className={\`px-4 py-2.5 rounded-2xl border backdrop-blur-xl flex flex-col \${item.color}\`}>
          <span className="text-xs font-mono font-black tracking-wider">{item.label}</span>
          <span className="text-[11px] font-bold opacity-80">{item.desc}</span>
        </div>
      ))}
    </div>
  );

  return (
    <ThumbnailCard
      title="WHY PRODUCTIVITY ADVICE FAILS"
      highlightWord="FAILS"
      highlightColor="rose"
      subtitle="ADHD • Autism • AuDHD • Neurotypical"
      categoryBadge="NEURODIVERSITY MASTERCLASS"
      characterPose="character_fullbody_pointing.png"
      characterScale={1.02}
      theme="obsidian"
      aspectRatio="16:9"
      extraBadge="100% EVIDENCE BASED"
      extraBadgeColor="text-sky-300 border-sky-500/30 bg-sky-500/10"
      visualGraphic={graphic}
    />
  );
};

// 2. PROCRASTINATION (16:9 Long Form Visual Essay)
export const ProcrastinationThumbnail: React.FC = () => {
  const graphic = (
    <div className="flex items-center gap-4">
      <div className="px-5 py-3 rounded-2xl bg-purple-950/60 border border-purple-500/40 backdrop-blur-xl flex items-center gap-3">
        <Clock className="w-6 h-6 text-purple-400 animate-pulse" />
        <div className="flex flex-col">
          <span className="text-xs font-mono text-purple-300">THE 11:47 PM PARADOX</span>
          <span className="text-sm font-black text-white">Avoidance-Learning Loop</span>
        </div>
      </div>
      <div className="px-5 py-3 rounded-2xl bg-rose-950/60 border border-rose-500/40 backdrop-blur-xl flex items-center gap-3">
        <Flame className="w-6 h-6 text-rose-400" />
        <span className="text-sm font-bold text-rose-200">Action With Discomfort</span>
      </div>
    </div>
  );

  return (
    <ThumbnailCard
      title="WHY YOU PROCRASTINATE (NOT LAZINESS)"
      highlightWord="NOT LAZINESS"
      highlightColor="yellow"
      subtitle="You Don't Hate The Task — You Hate The Feeling"
      categoryBadge="PSYCHOLOGY VISUAL ESSAY"
      characterPose="character_fullbody_open.png"
      characterScale={1.0}
      theme="purple"
      aspectRatio="16:9"
      extraBadge="10 MINUTE BLUEPRINT"
      extraBadgeColor="text-purple-300 border-purple-500/30 bg-purple-500/10"
      visualGraphic={graphic}
    />
  );
};

// 3. LOFI SONG (16:9 Midnight Aesthetic Music Video)
export const LofiSongThumbnail: React.FC = () => {
  const graphic = (
    <div className="flex items-center gap-4">
      <div className="px-6 py-3.5 rounded-2xl bg-black/60 border border-rose-500/40 backdrop-blur-2xl flex items-center gap-3.5 shadow-2xl">
        <div className="w-10 h-10 rounded-full bg-rose-600/30 border border-rose-400 flex items-center justify-center text-rose-300 font-bold">
          ❤️
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-black text-rose-100">Uski Baatein</span>
          <span className="text-xs text-rose-300/80 font-mono">02:47 AM • Midnight Lofi</span>
        </div>
      </div>
    </div>
  );

  return (
    <ThumbnailCard
      title="USKI BAATEIN (MIDNIGHT LOFI)"
      highlightWord="USKI BAATEIN"
      highlightColor="rose"
      subtitle="Raat Dheemi Thi, Shehar Soya Tha... 🌙❤️"
      categoryBadge="LOFI RED AESTHETIC"
      characterPose="character_fullbody_casual.png"
      characterScale={0.96}
      theme="crimson"
      aspectRatio="16:9"
      extraBadge="02:47 AM CHILL VIBES"
      extraBadgeColor="text-rose-300 border-rose-500/30 bg-rose-500/10"
      visualGraphic={graphic}
    />
  );
};

// ========================================================
// 9:16 VERTICAL THUMBNAILS (YouTube Shorts / Reels Covers)
// ========================================================

// 4. ADHD ATTENTION PARADOX (9:16 Shorts)
export const ADHDThumbnail: React.FC = () => (
  <ThumbnailCard
    title="ADHD IS NOT JUST BEING DISTRACTED"
    highlightWord="DISTRACTED"
    highlightColor="amber"
    subtitle="The Invisible Steering Problem In Your Brain"
    categoryBadge="ADHD PARADOX"
    characterPose="character_fullbody_pointing.png"
    characterScale={1.0}
    theme="amber"
    aspectRatio="9:16"
    extraBadge="BRAIN SCIENCE"
  />
);

// 5. DAVID GOGGINS (9:16 Shorts)
export const GogginsThumbnail: React.FC = () => (
  <ThumbnailCard
    title="GOGGINS' SECRET WEAPON IS NOT ADRENALINE"
    highlightWord="ADRENALINE"
    highlightColor="yellow"
    subtitle="The Cookie Jar Mental Blueprint"
    categoryBadge="MENTAL TOUGHNESS"
    characterPose="character_fullbody_pointing.png"
    characterScale={1.0}
    theme="obsidian"
    aspectRatio="9:16"
    extraBadge="STAY HARD"
  />
);

// 6. TAKING A BREAK (9:16 Shorts)
export const BreaksThumbnail: React.FC = () => (
  <ThumbnailCard
    title="WHY TAKING A LONG BREAK IS NOT QUITTING"
    highlightWord="NOT QUITTING"
    highlightColor="emerald"
    subtitle="Resting Long Enough To Want To Come Back"
    categoryBadge="BURNOUT RECOVERY"
    characterPose="character_fullbody_casual.png"
    characterScale={0.98}
    theme="emerald"
    aspectRatio="9:16"
    extraBadge="SELF CARE"
  />
);

// 7. MOTIVATION (9:16 Shorts)
export const MotivationThumbnail: React.FC = () => (
  <ThumbnailCard
    title="WHY MOTIVATION IS A COMPLETE LIE"
    highlightWord="COMPLETE LIE"
    highlightColor="yellow"
    subtitle="Action Creates Motivation — Not The Reverse"
    categoryBadge="ACTION PSYCHOLOGY"
    characterPose="character_fullbody_pointing.png"
    characterScale={1.0}
    theme="slate"
    aspectRatio="9:16"
    extraBadge="DO THIS INSTEAD"
  />
);

// 8. MATURITY (9:16 Shorts)
export const MaturityThumbnail: React.FC = () => (
  <ThumbnailCard
    title="WHY SOME PEOPLE MATURE FASTER"
    highlightWord="MATURE FASTER"
    highlightColor="sky"
    subtitle="It's Not Age — It's What Life Forced You To Handle"
    categoryBadge="EMOTIONAL MATURITY"
    characterPose="character_fullbody_open.png"
    characterScale={0.98}
    theme="blue"
    aspectRatio="9:16"
    extraBadge="GROWTH MINDSET"
  />
);

// 9. COMPARISON (9:16 Shorts)
export const ComparisonThumbnail: React.FC = () => (
  <ThumbnailCard
    title="WHY YOU CAN NEVER WIN COMPARISON"
    highlightWord="COMPARISON"
    highlightColor="rose"
    subtitle="The Moving Finish Line Trap Explained"
    categoryBadge="SELF WORTH"
    characterPose="character_fullbody_casual.png"
    characterScale={0.98}
    theme="purple"
    aspectRatio="9:16"
    extraBadge="FOCUS ON YOU"
  />
);

// 10. HABITS (9:16 Shorts)
export const HabitThumbnail: React.FC = () => (
  <ThumbnailCard
    title="THE REAL REASON YOU CANNOT BREAK BAD HABITS"
    highlightWord="BAD HABITS"
    highlightColor="amber"
    subtitle="Your Brain Prefers Familiar Comfort Over Good"
    categoryBadge="ATOMIC HABITS"
    characterPose="character_fullbody_open.png"
    characterScale={0.98}
    theme="slate"
    aspectRatio="9:16"
    extraBadge="BRAIN HACKS"
  />
);

// 11. EMOTIONS (9:16 Shorts)
export const EmotionsThumbnail: React.FC = () => (
  <ThumbnailCard
    title="HOW MEN & WOMEN PROCESS EMOTIONS"
    highlightWord="EMOTIONS"
    highlightColor="sky"
    subtitle="Never Make Permanent Decisions In Temporary Storms"
    categoryBadge="EMOTIONAL PROCESSING"
    characterPose="character_fullbody_casual.png"
    characterScale={0.98}
    theme="blue"
    aspectRatio="9:16"
    extraBadge="RELATIONSHIPS"
  />
);

// 12. STRENGTH (9:16 Shorts)
export const StrengthThumbnail: React.FC = () => (
  <ThumbnailCard
    title="WHAT REAL STRENGTH ACTUALLY LOOKS LIKE"
    highlightWord="REAL STRENGTH"
    highlightColor="emerald"
    subtitle="Courage To Face What's There — Not Pretending"
    categoryBadge="RESILIENCE MINDSET"
    characterPose="character_fullbody_pointing.png"
    characterScale={1.0}
    theme="emerald"
    aspectRatio="9:16"
    extraBadge="MINDSET"
  />
);

// 13. CHAPTERS (9:16 Shorts)
export const ChaptersThumbnail: React.FC = () => (
  <ThumbnailCard
    title="WHEN LIFE FEELS COMPLETELY UNFAIR"
    highlightWord="UNFAIR"
    highlightColor="amber"
    subtitle="A Difficult Chapter Is Not The Whole Story"
    categoryBadge="PERSPECTIVE"
    characterPose="character_fullbody_open.png"
    characterScale={0.98}
    theme="amber"
    aspectRatio="9:16"
    extraBadge="REMEMBER THIS"
  />
);

fs.writeFileSync(path.join(__dirname, '..', 'src', 'thumbnails', 'index.tsx'), INDEX_CODE, 'utf-8');
console.log('✅ Generated 16:9 Long-Form & 9:16 Shorts Thumbnail components');
console.log('ℹ️  ThumbnailCard.tsx was NOT overwritten — edit src/thumbnails/ThumbnailCard.tsx directly to change the layout engine.');