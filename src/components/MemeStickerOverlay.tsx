import React from "react";
import { interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export interface StickerMeta {
  id: string;
  name: string;
  file: string;
  archetype: string;
  genz_slang: string;
  viewer_instant_feeling: string;
  situational_triggers: string[];
  default_badge: string;
  default_tilt: number;
  position: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "center-right" | "center-left";
}

export const STICKERS: Record<string, StickerMeta> = {
  anya_crying: {
    id: "anya_crying",
    name: "Anya Dramatic Breakdown",
    file: "memes/stickers/anya_crying.png",
    archetype: "Dramatic Despair & Overreacting",
    genz_slang: "literally me crying over the smallest inconvenience",
    viewer_instant_feeling: "Relatable self-mockery when minor life friction hits.",
    situational_triggers: ["overreacting", "mild criticism", "emotional fatigue"],
    default_badge: "LITERALLY ME FR",
    default_tilt: -4,
    position: "bottom-right",
  },
  talking_to_brick_wall: {
    id: "talking_to_brick_wall",
    name: "Talking To A Brick Wall",
    file: "memes/stickers/talking_to_brick_wall.png",
    archetype: "Futility & Emotional Exhaustion",
    genz_slang: "talking to a brick wall fr / bro is NOT listening",
    viewer_instant_feeling: "Exhausted resignation from communicating to someone unresponsive.",
    situational_triggers: ["unresponsive communication", "boundaries ignored"],
    default_badge: "TALKING TO A WALL",
    default_tilt: 3,
    position: "center-right",
  },
  verne_turtle_shock: {
    id: "verne_turtle_shock",
    name: "Verne Turtle Traumatized Shock",
    file: "memes/stickers/verne_turtle_shock.png",
    archetype: "Stunned Disbelief & Existential Freeze",
    genz_slang: "live reaction to that information / goofy ahh shock",
    viewer_instant_feeling: "Jaw-dropped silence when an uncomfortable truth is exposed.",
    situational_triggers: ["uncomfortable truth", "existential freeze", "reality check"],
    default_badge: "LIVE REACTION",
    default_tilt: -3,
    position: "bottom-right",
  },
  patrick_drool: {
    id: "patrick_drool",
    name: "Patrick Drooling Stupor",
    file: "memes/stickers/patrick_drool.png",
    archetype: "Brainrot & Zero Thoughts",
    genz_slang: "head empty no thoughts / zero braincells / 2 AM brainrot",
    viewer_instant_feeling: "Vegetative dopamine stupor while mindless scrolling in bed.",
    situational_triggers: ["dopamine scrolling loop", "brainrot", "zero thoughts"],
    default_badge: "HEAD EMPTY",
    default_tilt: 4,
    position: "bottom-left",
  },
  anya_smug: {
    id: "anya_smug",
    name: "Anya Smug 'Heh' Face",
    file: "memes/stickers/anya_smug.png",
    archetype: "Superior Smirk & Caught In 4K",
    genz_slang: "Anya Heh (𓁹‿𓁹) / me when I know I'm right / caught in 4K",
    viewer_instant_feeling: "Mischievous satisfaction knowing an embarrassing truth.",
    situational_triggers: ["calling out subconscious coping", "caught in 4K"],
    default_badge: "HEH 𓁹‿𓁹",
    default_tilt: 2,
    position: "top-right",
  },
  toddler_head_panic: {
    id: "toddler_head_panic",
    name: "Toddler Hands On Head Panic",
    file: "memes/stickers/toddler_head_panic.png",
    archetype: "Sudden Chaos & Panic Attack",
    genz_slang: "instant panic attack / brain short-circuiting",
    viewer_instant_feeling: "High-voltage adrenaline shock when unexpected exposure hits.",
    situational_triggers: ["sudden deadline", "panic attack", "brain overload"],
    default_badge: "PANIC MODE",
    default_tilt: -5,
    position: "center-right",
  },
  crying_kid_homework: {
    id: "crying_kid_homework",
    name: "Crying Kid Homework",
    file: "memes/stickers/crying_kid_homework.png",
    archetype: "Reluctant Suffering & Forced Adulting",
    genz_slang: "doing homework in tears / being forced to adult",
    viewer_instant_feeling: "Deep nostalgic empathy for reluctant, agonizing effort.",
    situational_triggers: ["executive dysfunction", "procrastination pain"],
    default_badge: "PURE SUFFERING",
    default_tilt: -2,
    position: "bottom-right",
  },
  assignment_overload_cram: {
    id: "assignment_overload_cram",
    name: "Assignment Chaos Cram",
    file: "memes/stickers/assignment_overload_cram.png",
    archetype: "ADHD Panic & Deadline Sprint",
    genz_slang: "finishing 3 weeks of work in 2 hours / 11:59 PM sprint",
    viewer_instant_feeling: "Manic caffeine-fueled rush of cramming everything into the last hour.",
    situational_triggers: ["last-minute cramming", "multitasking chaos"],
    default_badge: "11:59 PM SPRINT",
    default_tilt: 4,
    position: "bottom-left",
  },
  girl_crying_at_desk: {
    id: "girl_crying_at_desk",
    name: "Girl Crying At Desk",
    file: "memes/stickers/girl_crying_at_desk.png",
    archetype: "Quiet Despondency & Emotional Exhaustion",
    genz_slang: "me trying to do basic life tasks / quiet burnout",
    viewer_instant_feeling: "Quiet, helpless exhaustion having zero mental energy left.",
    situational_triggers: ["quiet burnout", "emotional exhaustion"],
    default_badge: "BURNOUT FR",
    default_tilt: -3,
    position: "bottom-right",
  },
  spiderman_scheming_chair: {
    id: "spiderman_scheming_chair",
    name: "Spider-Man Mastermind Scheming",
    file: "memes/stickers/spiderman_scheming_chair.png",
    archetype: "Villain Arc & Calculated Overthinking",
    genz_slang: "let him cook / plotting my next unhinged decision",
    viewer_instant_feeling: "Exaggerated thrill of plotting an elaborate comeback or overthinking.",
    situational_triggers: ["threat simulation rumination", "let him cook"],
    default_badge: "LETTING HIM COOK",
    default_tilt: 3,
    position: "center-right",
  },
  tai_lung_laptop_despair: {
    id: "tai_lung_laptop_despair",
    name: "Tai Lung Laptop Horror",
    file: "memes/stickers/tai_lung_laptop_despair.png",
    archetype: "Confronting Receipts & Sheer Regret",
    genz_slang: "checking bank account on Sunday / reading late texts",
    viewer_instant_feeling: "Cold sweat seeing undeniable proof of a costly mistake.",
    situational_triggers: ["confronting avoided reality", "checking bank balance"],
    default_badge: "THE RECEIPTS",
    default_tilt: -4,
    position: "bottom-right",
  },
  shannon_sharpe_suit_flex: {
    id: "shannon_sharpe_suit_flex",
    name: "Shannon Sharpe Suit Flex",
    file: "memes/stickers/shannon_sharpe_suit_flex.png",
    archetype: "Main Character Energy & Unapologetic Swagger",
    genz_slang: "Unc Sharpe in the suit / main character energy",
    viewer_instant_feeling: "Radiant confidence and self-assurance after setting boundaries.",
    situational_triggers: ["self-worth rewire", "main character energy"],
    default_badge: "MAIN CHARACTER",
    default_tilt: 2,
    position: "center-right",
  },
  shaq_timeout_pause: {
    id: "shaq_timeout_pause",
    name: "Shaq Timeout Pause",
    file: "memes/stickers/shaq_timeout_pause.png",
    archetype: "Cognitive Reality Check & Hard Stop",
    genz_slang: "Shaq timeout / hold up pause / wait a damn minute",
    viewer_instant_feeling: "Immediate pattern interrupt stopping toxic runaway thoughts.",
    situational_triggers: ["calling out cognitive distortion", "reality check"],
    default_badge: "HOLD UP PAUSE",
    default_tilt: -2,
    position: "center-left",
  },
  tom_holland_knuckle_bite: {
    id: "tom_holland_knuckle_bite",
    name: "Tom Holland Knuckle Bite Anxiety",
    file: "memes/stickers/tom_holland_knuckle_bite.png",
    archetype: "Acute Tension & Second-Hand Cringe",
    genz_slang: "biting knuckles in agony / waiting for the reply",
    viewer_instant_feeling: "Agonizing suspense and tension waiting for a high-stakes reply.",
    situational_triggers: ["anxious attachment waiting", "sweating bullets"],
    default_badge: "SWEATING BULLETS",
    default_tilt: 3,
    position: "bottom-right",
  },
  friends_dapping_laughing: {
    id: "friends_dapping_laughing",
    name: "Friends Dapping & Laughing",
    file: "memes/stickers/friends_dapping_laughing.png",
    archetype: "Real Camaraderie & Mutual Validation",
    genz_slang: "dapping up the homie / me and bro when the joke lands",
    viewer_instant_feeling: "Warm belonging and shared humor with real ones.",
    situational_triggers: ["authentic friendship", "healthy validation"],
    default_badge: "REAL ONES ONLY",
    default_tilt: -3,
    position: "bottom-right",
  },
};

export interface MemeStickerOverlayProps {
  stickerId: string;
  startFrame: number;
  durationFrames?: number;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "center-right" | "center-left";
  badgeText?: string;
  size?: number;
  customX?: number;
  customY?: number;
  tiltDeg?: number;
}

/**
 * 🏷️ MemeStickerOverlay
 * Mid-video tactile die-cut sticker reaction component.
 * Allows high-retention Gen-Z memes to pop in during Beat 1, Beat 2, or Beat 3
 * with authentic physical die-cut borders, multi-layered paper drop shadows,
 * and high-velocity spring bounce without disrupting voiceover audio.
 */
export const MemeStickerOverlay: React.FC<MemeStickerOverlayProps> = ({
  stickerId,
  startFrame,
  durationFrames = 32,
  position,
  badgeText,
  size = 310,
  customX,
  customY,
  tiltDeg,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sticker = STICKERS[stickerId] || STICKERS["verne_turtle_shock"];
  const relFrame = frame - startFrame;

  if (relFrame < 0 || relFrame > durationFrames) {
    return null;
  }

  // Entrance spring: snappy pop-in with slight scale overshoot
  const spEntrance = spring({
    frame: relFrame,
    fps,
    config: { damping: 11, stiffness: 170, mass: 0.8 },
  });

  // Exit spring: quick collapse in the final 8 frames
  const exitWindow = 8;
  const exitProgress = Math.max(0, relFrame - (durationFrames - exitWindow)) / exitWindow;
  const exitScale = interpolate(exitProgress, [0, 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const baseScale = spEntrance * exitScale;
  const activeTilt = tiltDeg !== undefined ? tiltDeg : sticker.default_tilt;
  const entranceTilt = interpolate(spEntrance, [0, 1], [activeTilt - 6, activeTilt]);
  const activePosition = position || sticker.position;

  // Compute position coordinates
  let positionStyles: React.CSSProperties = {};
  if (customX !== undefined || customY !== undefined) {
    positionStyles = {
      left: customX ?? "auto",
      top: customY ?? "auto",
    };
  } else {
    switch (activePosition) {
      case "bottom-right":
        positionStyles = { right: "5%", bottom: "38%" };
        break;
      case "bottom-left":
        positionStyles = { left: "5%", bottom: "38%" };
        break;
      case "top-right":
        positionStyles = { right: "5%", top: "14%" };
        break;
      case "top-left":
        positionStyles = { left: "5%", top: "14%" };
        break;
      case "center-right":
        positionStyles = { right: "5%", top: "32%" };
        break;
      case "center-left":
        positionStyles = { left: "5%", top: "32%" };
        break;
      default:
        positionStyles = { right: "5%", bottom: "38%" };
    }
  }

  const badge = badgeText || sticker.default_badge;

  return (
    <div
      className="absolute z-50 pointer-events-none select-none"
      style={{
        ...positionStyles,
        zIndex: 50,
        width: `${size}px`,
        transform: `scale(${baseScale}) rotate(${entranceTilt}deg)`,
        transformOrigin: "center center",
        willChange: "transform, opacity",
      }}
    >
      {/* Tactile Paper Die-Cut Sticker Card */}
      <div
        className="relative p-2 bg-white rounded-3xl"
        style={{
          boxShadow:
            "0 18px 36px -6px rgba(0, 0, 0, 0.32), 0 6px 14px -3px rgba(0, 0, 0, 0.18), inset 0 1px 1px rgba(255, 255, 255, 0.9)",
          border: "4px solid #ffffff",
        }}
      >
        {/* Subtle Archival Tooth on Sticker Frame */}
        <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-slate-100">
          <img
            src={staticFile(sticker.file)}
            alt={sticker.name}
            className="w-full h-full object-cover"
          />
          {/* Subtle Tactile Gloss Gradient */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, transparent 60%)",
            }}
          />
        </div>

        {/* Authentic Gen-Z Reaction Badge Tag */}
        {badge && (
          <div
            className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-slate-950 text-white font-black text-xs tracking-wider uppercase whitespace-nowrap shadow-lg flex items-center gap-1.5 border border-white/40"
            style={{
              transform: "translateX(-50%) rotate(-1deg)",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{badge}</span>
          </div>
        )}
      </div>
    </div>
  );
};
