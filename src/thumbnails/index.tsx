import React from 'react';
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
        <div key={item.label} className={`px-4 py-2.5 rounded-2xl border backdrop-blur-xl flex flex-col ${item.color}`}>
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
    theme="apple_studio"
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
    theme="apple_studio"
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
    theme="apple_studio"
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
    theme="apple_studio"
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
    theme="apple_studio"
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
    theme="apple_studio"
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
    theme="apple_studio"
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
    theme="apple_studio"
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
    theme="apple_studio"
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
    theme="apple_studio"
    aspectRatio="9:16"
    extraBadge="REMEMBER THIS"
  />
);

// 14. PROMISES & SELF-TRUST (9:16 Shorts)
export const PromisesThumbnail: React.FC = () => (
  <ThumbnailCard
    title="WHY YOU CAN'T KEEP YOUR PROMISES"
    highlightWord="PROMISES"
    highlightColor="rose"
    subtitle="You're Not Lazy — Your Brain Expects Failure"
    categoryBadge="SELF-TRUST PSYCHOLOGY"
    characterPose="character_fullbody_pointing.png"
    characterScale={1.0}
    theme="apple_studio"
    aspectRatio="9:16"
    extraBadge="REBUILD TRUST"
  />
);

// 15. BOUNDARIES & SELF-PEACE (9:16 Shorts)
export const BoundariesThumbnail: React.FC = () => (
  <ThumbnailCard
    title="WHY YOU STRUGGLE TO SET BOUNDARIES"
    highlightWord="BOUNDARIES"
    highlightColor="emerald"
    subtitle="Saying 'No' Without Writing An Essay Defending It"
    categoryBadge="BOUNDARIES PSYCHOLOGY"
    characterPose="character_fullbody_pointing.png"
    characterScale={1.0}
    theme="apple_studio"
    aspectRatio="9:16"
    extraBadge="PROTECT YOUR PEACE"
  />
);

// 16. BREAKING PATTERNS & HABIT LOOPS (9:16 Shorts)
export const PatternsThumbnail: React.FC = () => (
  <ThumbnailCard
    title="WHY YOU CAN'T BREAK OLD PATTERNS"
    highlightWord="PATTERNS"
    highlightColor="amber"
    subtitle="Break The Loop At The Smallest Point — One Different Move"
    categoryBadge="HABIT PSYCHOLOGY"
    characterPose="character_fullbody_pointing.png"
    characterScale={1.0}
    theme="apple_studio"
    aspectRatio="9:16"
    extraBadge="MICRO-INTERRUPTION"
  />
);

// 17. TEENAGE YEARS & THE BRAIN OVERLOAD (9:16 Shorts)
export const TeenageThumbnail: React.FC = () => (
  <ThumbnailCard
    title="WHY TEENAGE YEARS FEEL SO CHAOTIC"
    highlightWord="CHAOTIC"
    highlightColor="rose"
    subtitle="Your Brain Is Still Developing — You're Still Becoming You"
    categoryBadge="ADOLESCENT BRAIN"
    characterPose="character_fullbody_pointing.png"
    characterScale={1.0}
    theme="apple_studio"
    aspectRatio="9:16"
    extraBadge="MINDSET"
  />
);

// 18. ENVIRONMENT DESIGN & BAD CHOICES (9:16 Shorts)
export const EnvironmentThumbnail: React.FC = () => (
  <ThumbnailCard
    title="WHY SMART PEOPLE MAKE BAD CHOICES"
    highlightWord="BAD CHOICES"
    highlightColor="rose"
    subtitle="It's Not A Lack Of Discipline — It's Your Environment"
    categoryBadge="ENVIRONMENT PSYCHOLOGY"
    characterPose="character_fullbody_pointing.png"
    characterScale={1.0}
    theme="apple_studio"
    aspectRatio="9:16"
    extraBadge="NEURAL ADAPTATION"
  />
);

// 19. DIGITAL LONELINESS & REAL CLOSENESS (9:16 Shorts)
export const LonelinessThumbnail: React.FC = () => (
  <ThumbnailCard
    title="SURROUNDED ONLINE YET TOTALLY ALONE"
    highlightWord="TOTALLY ALONE"
    highlightColor="rose"
    subtitle="Connection Without Closeness Is An Illusion"
    categoryBadge="DIGITAL PSYCHOLOGY"
    characterPose="character_fullbody_pointing.png"
    characterScale={1.0}
    theme="apple_studio"
    aspectRatio="9:16"
    extraBadge="REAL CONNECTION"
  />
);

// 20. SAYING NO WITHOUT GUILT (9:16 Shorts)
export const SayingNoThumbnail: React.FC = () => (
  <ThumbnailCard
    title="STOP SAYING YES WHEN YOU WANT TO SAY NO"
    highlightWord="SAY NO"
    highlightColor="rose"
    subtitle="You Don't Owe An Explanation To Protect Your Boundaries"
    categoryBadge="BOUNDARIES & SELF-RESPECT"
    characterPose="character_fullbody_pointing.png"
    characterScale={1.0}
    theme="apple_studio"
    aspectRatio="9:16"
    extraBadge="STOP PEOPLE PLEASING"
  />
);


export const DopamineResetThumbnail: React.FC = () => (
  <ThumbnailCard
    title="DOPAMINE RESET"
    highlightWord="DOPAMINE"
    highlightColor="sky"
    subtitle="High-Retention Psychology Breakdown"
    categoryBadge="NEUROSCIENCE"
    characterPose="character_fullbody_pointing.png"
    characterScale={1.0}
    theme="apple_studio"
    aspectRatio="9:16"
    extraBadge="FOCUS"
  />
);

export const ShrinkingCircleThumbnail: React.FC = () => (
  <ThumbnailCard
    title="SHRINK YOUR CIRCLE"
    highlightWord="PEACE"
    highlightColor="emerald"
    subtitle="Why Having Fewer Friends Reclaims Your Life"
    categoryBadge="RELATIONSHIPS"
    characterPose="character_fullbody_pointing.png"
    characterScale={1.0}
    theme="apple_studio"
    aspectRatio="9:16"
    extraBadge="INNER PEACE"
  />
);

export const HoldingGrudgesThumbnail: React.FC = () => (
  <ThumbnailCard
    title="STOP HOLDING GRUDGES"
    highlightWord="STOP"
    highlightColor="rose"
    subtitle="They Hurt You Once. You Replay It For Months."
    categoryBadge="EMOTIONAL CLOSURE"
    characterPose="character_fullbody_pointing.png"
    characterScale={1.0}
    theme="apple_studio"
    aspectRatio="9:16"
    extraBadge="HEALING"
  />
);

export const PushingAwayThumbnail: React.FC = () => (
  <ThumbnailCard
    title="WHY YOU PUSH THEM AWAY"
    highlightWord="PUSH"
    highlightColor="rose"
    subtitle="The Avoidant Trap: Pushing Away Who You Love"
    categoryBadge="RELATIONSHIP PSYCHOLOGY"
    characterPose="character_fullbody_pointing.png"
    characterScale={1.0}
    theme="apple_studio"
    aspectRatio="9:16"
    extraBadge="ATTACHMENT"
  />
);

// ========================================================
// 💹 FINANCE CHANNEL — Apex Wealth (Dark Obsidian Gold)
// ========================================================

// 21. THE COMPOUNDING TRAP (9:16 Finance Short)
export const TheCompoundingTrapThumbnail: React.FC = () => (
  <ThumbnailCard
    title="YOUR SAVINGS ACCOUNT IS MAKING YOU BROKE"
    highlightWord="BROKE"
    highlightColor="rose"
    subtitle="Why Cash Savings Quietly Destroy Your Wealth Every Year"
    categoryBadge="APEX WEALTH"
    characterPose="character_fullbody_pointing.png"
    characterScale={1.0}
    theme="obsidian_gold"
    aspectRatio="9:16"
    extraBadge="FINANCIAL TRUTH 💸"
  />
);

// ========================================================
// 🫀 HEALTH CHANNEL — BioMatrix (Biotech Cyan)
// ========================================================

// 22. THE 3AM CORTISOL SPIKE (9:16 Health Short)
export const The3amCortisolSpikeThumbnail: React.FC = () => (
  <ThumbnailCard
    title="WHY YOU WAKE UP AT 3 AM WITH PANIC"
    highlightWord="3 AM"
    highlightColor="sky"
    subtitle="The Cortisol Spike — Not Anxiety, A Metabolic Emergency"
    categoryBadge="BIOMATRIX SCIENCE"
    characterPose="character_fullbody_pointing.png"
    characterScale={1.0}
    theme="biotech_cyan"
    aspectRatio="9:16"
    extraBadge="SLEEP BIOLOGY 🫀"
  />
);

// 23. TEENAGE MENTAL HEALTH (9:16 Health Short)
export const TeenageMentalHealthThumbnail: React.FC = () => (
  <ThumbnailCard
    title="WHY YOUR MOOD SUDDENLY CRASHES"
    highlightWord="CRASHES"
    highlightColor="sky"
    subtitle="The Teenage Brain Storm — Remodeling, Not Drama"
    categoryBadge="NEUROBIOLOGY"
    characterPose="character_fullbody_pointing.png"
    characterScale={1.0}
    theme="biotech_cyan"
    aspectRatio="9:16"
    extraBadge="TEEN HEALTH 🫀"
  />
);

export const TheIllusionOfOwnershipThumbnail: React.FC = () => (
  <ThumbnailCard
    title="THE ILLUSION OF OWNERSHIP"
    highlightWord="OWNERSHIP"
    highlightColor="emerald"
    subtitle="Stop Financing Your Lifestyle"
    categoryBadge="WEALTH"
    characterPose="character_fullbody_pointing.png"
    characterScale={1.0}
    theme="obsidian_gold"
    aspectRatio="9:16"
  />
);

export const TheDopamineSugarTrapThumbnail: React.FC = () => (
  <ThumbnailCard
    title="THE SUGAR TRAP"
    highlightWord="TRAP"
    highlightColor="sky"
    subtitle="The 2 PM Energy Crash"
    categoryBadge="HEALTH"
    characterPose="character_fullbody_pointing.png"
    characterScale={1.0}
    theme="biotech_cyan"
    aspectRatio="9:16"
  />
);

// 24. CORTISOL AWAKENING ROUTINE (9:16 Health Short)
export const CortisolAwakeningRoutineThumbnail: React.FC = () => (
  <ThumbnailCard
    title="WHY YOU WAKE UP EXHAUSTED AFTER 8 HOURS"
    highlightWord="EXHAUSTED"
    highlightColor="sky"
    subtitle="The Cortisol Awakening Glitch Explained"
    categoryBadge="CIRCADIAN BIOLOGY"
    characterPose="character_fullbody_pointing.png"
    characterScale={1.0}
    theme="biotech_cyan"
    aspectRatio="9:16"
    extraBadge="LONGEVITY 🫀"
  />
);


export const The48HourDopamineProtocolThumbnail: React.FC = () => (
  <ThumbnailCard
    title="THE 48-HOUR DOPAMINE PROTOCOL"
    highlightWord="THE"
    highlightColor="rose"
    subtitle="High-Retention Psychology Breakdown"
    categoryBadge="PSYCHOLOGY"
    characterPose="character_fullbody_pointing.png"
    theme="apple_studio"
    aspectRatio="9:16"
    extraBadge="MINDSET"
  />
);

export const TheMinimumViableDayThumbnail: React.FC = () => (
  <ThumbnailCard
    title="THE MINIMUM VIABLE DAY"
    highlightWord="THE"
    highlightColor="rose"
    subtitle="High-Retention Psychology Breakdown"
    categoryBadge="PSYCHOLOGY"
    characterPose="character_fullbody_pointing.png"
    theme="apple_studio"
    aspectRatio="9:16"
    extraBadge="MINDSET"
  />
);

export const MapTheGapThumbnail: React.FC = () => (
  <ThumbnailCard
    title="STOP SAYING YES (MAP THE GAP)"
    highlightWord="STOP SAYING YES"
    highlightColor="rose"
    subtitle="Why People-Pleasing Drains You • Page 6 Blueprint"
    categoryBadge="JUDY INSIGHTS • PSYCHOLOGY"
    characterPose="character_fullbody_pointing.png"
    theme="apple_studio"
    aspectRatio="9:16"
    extraBadge="PHOTON PROTOCOL"
  />
);

export const DiagramYourLoopThumbnail: React.FC = () => (
  <ThumbnailCard
    title="DIAGRAM YOUR LOOP"
    highlightWord="DIAGRAM"
    highlightColor="rose"
    subtitle="Break Autopilot Scrolling & Interrupt Cues"
    categoryBadge="JUDY INSIGHTS • PSYCHOLOGY"
    characterPose="character_fullbody_pointing.png"
    theme="apple_studio"
    aspectRatio="9:16"
    extraBadge="HABITS"
  />
);


export const YouAreNotAloneThumbnail: React.FC = () => (
  <ThumbnailCard
    title="YOU ARE NOT ALONE"
    highlightWord="NOT ALONE"
    highlightColor="rose"
    subtitle="When Life Feels Completely Out Of Control"
    categoryBadge="JUDY INSIGHTS • MINDSET"
    characterPose="character_fullbody_open.png"
    characterScale={1.05}
    theme="apple_studio"
    aspectRatio="9:16"
    extraBadge="PERSPECTIVE"
  />
);

export { BuildToScaleTHFThumbnail } from "./BuildToScaleTHFThumbnail";


export const TeenageRelationshipsThumbnail: React.FC = () => (
  <ThumbnailCard
    title="THE DATING TRAP"
    highlightWord="DATING"
    highlightColor="rose"
    subtitle="Why Teenage Relationships Exhaust You"
    categoryBadge="JUDY INSIGHTS • PSYCHOLOGY"
    characterPose="character_pointing.png"
    theme="apple_studio"
    aspectRatio="9:16"
    extraBadge="MINDSET"
  />
);

export const GitaInTeenageThumbnail: React.FC = () => (
  <ThumbnailCard
    title="GITA WISDOM FOR TEENAGERS"
    highlightWord="WISDOM"
    highlightColor="emerald"
    subtitle="Ancient Mindset for Modern Chaos"
    categoryBadge="JUDY INSIGHTS • PHILOSOPHY"
    characterPose="character_pointing.png"
    theme="apple_studio"
    aspectRatio="9:16"
    extraBadge="MINDSET"
  />
);

export const RealityOfSocialMediaThumbnail: React.FC = () => (
  <ThumbnailCard
    title="THE REALITY OF SOCIAL MEDIA"
    highlightWord="REALITY"
    highlightColor="sky"
    subtitle="Why It Destroys Teen Focus"
    categoryBadge="JUDY INSIGHTS • PSYCHOLOGY"
    characterPose="character_pointing.png"
    theme="apple_studio"
    aspectRatio="9:16"
    extraBadge="FOCUS"
  />
);

export const SelfDoubtThumbnail: React.FC = () => (
  <ThumbnailCard
    title="WHY YOU DOUBT YOURSELF"
    highlightWord="DOUBT"
    highlightColor="amber"
    subtitle="The Psychology of Imposter Syndrome"
    categoryBadge="JUDY INSIGHTS • PSYCHOLOGY"
    characterPose="character_pointing.png"
    theme="apple_studio"
    aspectRatio="9:16"
    extraBadge="CLARITY"
  />
);


export const StopComparingThumbnail: React.FC = () => (
  <ThumbnailCard
    title="THE COMPARISON TRAP"
    highlightWord="COMPARISON"
    highlightColor="rose"
    subtitle="How to Break Upward Comparison"
    categoryBadge="JUDY INSIGHTS • PSYCHOLOGY"
    characterPose="character_pointing.png"
    theme="apple_studio"
    aspectRatio="9:16"
    extraBadge="MINDSET"
  />
);
