import React from 'react';
import { Img, staticFile } from 'remotion';
import { Sparkles, Zap } from 'lucide-react';

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
  theme?: 'obsidian' | 'crimson' | 'slate' | 'purple' | 'emerald' | 'amber' | 'blue' | 'white' | 'apple_studio' | 'obsidian_gold' | 'biotech_cyan';
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
  characterPose = 'character_pointing.png',
  characterPosition = 'right',
  characterScale = 1.0,
  characterOffsetY = 0,
  theme = 'apple_studio',
  aspectRatio = '16:9',
  extraBadge,
  extraBadgeColor,
  visualGraphic,
}) => {
  const is16x9 = aspectRatio === '16:9';

  // Map legacy fullbody references to high-impact zoomed waist-up cutouts
  const resolvedPose = React.useMemo(() => {
    if (!characterPose) return "character_pointing.png";
    const clean = characterPose.replace("public/", "").replace(/^\//, "");
    if (clean.includes("pointing")) return "character_pointing.png";
    if (clean.includes("open")) return "character_open.png";
    if (clean.includes("casual") || clean.includes("crossed")) return "character_crossed.png";
    return clean;
  }, [characterPose]);

  const themes = {
    apple_studio: {
      bg: '#ffffff',
      topGrad: 'radial-gradient(ellipse at 50% 0%, #ffffff 0%, #f8fafc 55%, #f1f5f9 100%)',
      charGrad: 'radial-gradient(ellipse at 50% 100%, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.6) 60%, transparent 100%)',
      glow: 'rgba(245, 158, 11, 0.28)', // Judy Warm Amber Sparkle
      glowWide: 'rgba(37, 99, 235, 0.22)', // Judy Cognitive Blue
      accent: '#0071e3', // Apple / Judy Electric Blue
      cardBg: 'rgba(255, 255, 255, 0.94)',
      cardBorder: 'rgba(15, 23, 42, 0.08)',
      rimLight: 'rgba(37, 99, 235, 0.22)',
      footerColor: '#64748b',
      textColor: '#090d16',
      subColor: '#0f172a',
      scrimGrad: 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.90) 45%, rgba(255, 255, 255, 0) 100%)',
      dotGrid: 'radial-gradient(rgba(100, 116, 139, 0.22) 1.5px, transparent 1.5px)',
    },
    obsidian: {
      bg: '#080c14',
      topGrad: 'linear-gradient(180deg, #080c14 0%, #0d1929 60%, #080c14 100%)',
      charGrad: 'linear-gradient(0deg, #172033 0%, #080c14 55%)',
      glow: 'rgba(56, 189, 248, 0.55)',
      glowWide: 'rgba(56, 189, 248, 0.30)',
      accent: '#38bdf8',
      cardBg: 'rgba(15, 23, 42, 0.90)',
      cardBorder: 'rgba(56, 189, 248, 0.22)',
      rimLight: 'rgba(56, 189, 248, 0.35)',
      footerColor: '#94a3b8',
      textColor: '#ffffff',
      subColor: '#e2e8f0',
      scrimGrad: 'linear-gradient(180deg, #080c14 0%, #080c14f5 40%, #080c14cc 70%, transparent 100%)',
      dotGrid: 'radial-gradient(rgba(255, 255, 255, 0.18) 1.5px, transparent 1.5px)',
    },
    crimson: {
      bg: '#0a0208',
      topGrad: 'linear-gradient(180deg, #0a0208 0%, #1a050c 60%, #0a0208 100%)',
      charGrad: 'linear-gradient(0deg, #4c0519 0%, #0a0208 55%)',
      glow: 'rgba(244, 63, 94, 0.65)',
      glowWide: 'rgba(244, 63, 94, 0.35)',
      accent: '#ff3b5c',
      cardBg: 'rgba(20, 5, 8, 0.94)',
      cardBorder: 'rgba(244, 63, 94, 0.45)',
      rimLight: 'rgba(244, 63, 94, 0.45)',
      footerColor: '#fda4af',
      textColor: '#ffffff',
      subColor: '#e2e8f0',
      scrimGrad: 'linear-gradient(180deg, #0a0208 0%, #0a0208f5 40%, #0a0208cc 70%, transparent 100%)',
      dotGrid: 'radial-gradient(rgba(255, 255, 255, 0.18) 1.5px, transparent 1.5px)',
    },
    slate: {
      bg: '#0b0f19',
      topGrad: 'linear-gradient(180deg, #0b0f19 0%, #131b30 60%, #0b0f19 100%)',
      charGrad: 'linear-gradient(0deg, #1e2238 0%, #0b0f19 55%)',
      glow: 'rgba(99, 102, 241, 0.55)',
      glowWide: 'rgba(99, 102, 241, 0.30)',
      accent: '#818cf8',
      cardBg: 'rgba(15, 23, 42, 0.92)',
      cardBorder: 'rgba(99, 102, 241, 0.35)',
      rimLight: 'rgba(99, 102, 241, 0.40)',
      footerColor: '#94a3b8',
      textColor: '#ffffff',
      subColor: '#e2e8f0',
      scrimGrad: 'linear-gradient(180deg, #0b0f19 0%, #0b0f19f5 40%, #0b0f19cc 70%, transparent 100%)',
      dotGrid: 'radial-gradient(rgba(255, 255, 255, 0.18) 1.5px, transparent 1.5px)',
    },
    purple: {
      bg: '#0a0512',
      topGrad: 'linear-gradient(180deg, #0a0512 0%, #180b30 60%, #0a0512 100%)',
      charGrad: 'linear-gradient(0deg, #3b0764 0%, #0a0512 55%)',
      glow: 'rgba(168, 85, 247, 0.65)',
      glowWide: 'rgba(168, 85, 247, 0.38)',
      accent: '#c084fc',
      cardBg: 'rgba(24, 10, 48, 0.94)',
      cardBorder: 'rgba(168, 85, 247, 0.42)',
      rimLight: 'rgba(192, 132, 252, 0.45)',
      footerColor: '#d8b4fe',
      textColor: '#ffffff',
      subColor: '#e2e8f0',
      scrimGrad: 'linear-gradient(180deg, #0a0512 0%, #0a0512f5 40%, #0a0208cc 70%, transparent 100%)',
      dotGrid: 'radial-gradient(rgba(255, 255, 255, 0.18) 1.5px, transparent 1.5px)',
    },
    emerald: {
      bg: '#021008',
      topGrad: 'linear-gradient(180deg, #021008 0%, #041f12 60%, #021008 100%)',
      charGrad: 'linear-gradient(0deg, #064e3b 0%, #021008 55%)',
      glow: 'rgba(16, 185, 129, 0.55)',
      glowWide: 'rgba(16, 185, 129, 0.30)',
      accent: '#34d399',
      cardBg: 'rgba(6, 30, 20, 0.94)',
      cardBorder: 'rgba(16, 185, 129, 0.40)',
      rimLight: 'rgba(52, 211, 153, 0.40)',
      footerColor: '#6ee7b7',
      textColor: '#ffffff',
      subColor: '#e2e8f0',
      scrimGrad: 'linear-gradient(180deg, #021008 0%, #021008f5 40%, #021008cc 70%, transparent 100%)',
      dotGrid: 'radial-gradient(rgba(255, 255, 255, 0.18) 1.5px, transparent 1.5px)',
    },
    amber: {
      bg: '#0f0800',
      topGrad: 'linear-gradient(180deg, #0f0800 0%, #201200 60%, #0f0800 100%)',
      charGrad: 'linear-gradient(0deg, #78350f 0%, #0f0800 55%)',
      glow: 'rgba(245, 158, 11, 0.60)',
      glowWide: 'rgba(245, 158, 11, 0.32)',
      accent: '#fbbf24',
      cardBg: 'rgba(30, 18, 6, 0.94)',
      cardBorder: 'rgba(245, 158, 11, 0.40)',
      rimLight: 'rgba(251, 191, 36, 0.45)',
      footerColor: '#fcd34d',
      textColor: '#ffffff',
      subColor: '#e2e8f0',
      scrimGrad: 'linear-gradient(180deg, #0f0800 0%, #0f0800f5 40%, #0f0800cc 70%, transparent 100%)',
      dotGrid: 'radial-gradient(rgba(255, 255, 255, 0.18) 1.5px, transparent 1.5px)',
    },
    blue: {
      bg: '#020b14',
      topGrad: 'linear-gradient(180deg, #020b14 0%, #061625 60%, #020b14 100%)',
      charGrad: 'linear-gradient(0deg, #0c4a6e 0%, #020b14 55%)',
      glow: 'rgba(14, 165, 233, 0.60)',
      glowWide: 'rgba(14, 165, 233, 0.32)',
      accent: '#38bdf8',
      cardBg: 'rgba(8, 28, 50, 0.94)',
      cardBorder: 'rgba(14, 165, 233, 0.40)',
      rimLight: 'rgba(56, 189, 248, 0.45)',
      footerColor: '#7dd3fc',
      textColor: '#ffffff',
      subColor: '#e2e8f0',
      scrimGrad: 'linear-gradient(180deg, #020b14 0%, #020b14f5 40%, #020b14cc 70%, transparent 100%)',
      dotGrid: 'radial-gradient(rgba(255, 255, 255, 0.18) 1.5px, transparent 1.5px)',
    },
    white: {
      bg: '#f8fafc',
      topGrad: 'radial-gradient(circle at 50% 15%, #ffffff 0%, #f1f5f9 45%, #e2e8f0 100%)',
      charGrad: 'radial-gradient(ellipse at 50% 100%, rgba(241, 245, 249, 0.95) 0%, rgba(248, 250, 252, 0.3) 70%, transparent 100%)',
      glow: 'rgba(245, 158, 11, 0.22)',
      glowWide: 'rgba(14, 165, 233, 0.18)',
      accent: '#0071e3',
      cardBg: 'rgba(255, 255, 255, 0.92)',
      cardBorder: 'rgba(15, 23, 42, 0.08)',
      rimLight: 'rgba(14, 165, 233, 0.25)',
      footerColor: '#64748b',
      textColor: '#090d16',
      subColor: '#1e293b',
      scrimGrad: 'linear-gradient(180deg, rgba(248, 250, 252, 0.98) 0%, rgba(248, 250, 252, 0.88) 45%, rgba(248, 250, 252, 0) 100%)',
      dotGrid: 'radial-gradient(rgba(15, 23, 42, 0.18) 1.5px, transparent 1.5px)',
    },
    // 💹 Finance Channel – Apex Wealth: Rich Dark Carbon + Cyber-Gold + Liquid Emerald
    obsidian_gold: {
      bg: '#030712',
      topGrad: 'linear-gradient(180deg, #030712 0%, #0b0f19 60%, #030712 100%)',
      charGrad: 'linear-gradient(0deg, #0b0f19 0%, #030712 55%)',
      glow: 'rgba(16, 185, 129, 0.55)',   // Liquid Emerald primary glow
      glowWide: 'rgba(245, 158, 11, 0.38)', // Cyber Gold secondary glow
      accent: '#10b981',
      cardBg: 'rgba(5, 10, 22, 0.96)',
      cardBorder: 'rgba(16, 185, 129, 0.35)',
      rimLight: 'rgba(245, 158, 11, 0.40)',
      footerColor: '#34d399',
      textColor: '#ffffff',
      subColor: '#e2e8f0',
      scrimGrad: 'linear-gradient(180deg, #030712 0%, #030712f5 40%, #030712cc 70%, transparent 100%)',
      dotGrid: 'radial-gradient(rgba(255,255,255,0.12) 1.5px, transparent 1.5px)',
    },
    // 🫀 Health Channel – BioMatrix: Deep Bio-Tech Navy + Cyber-Cyan + Bio-Mint
    biotech_cyan: {
      bg: '#060913',
      topGrad: 'linear-gradient(180deg, #060913 0%, #0a1124 60%, #060913 100%)',
      charGrad: 'linear-gradient(0deg, #0d1a3a 0%, #060913 55%)',
      glow: 'rgba(6, 182, 212, 0.60)',    // Electric Cyan primary glow
      glowWide: 'rgba(16, 185, 129, 0.38)', // Bio Mint secondary glow
      accent: '#06b6d4',
      cardBg: 'rgba(6, 10, 26, 0.96)',
      cardBorder: 'rgba(6, 182, 212, 0.38)',
      rimLight: 'rgba(16, 185, 129, 0.40)',
      footerColor: '#22d3ee',
      textColor: '#ffffff',
      subColor: '#e2e8f0',
      scrimGrad: 'linear-gradient(180deg, #060913 0%, #060913f5 40%, #060913cc 70%, transparent 100%)',
      dotGrid: 'radial-gradient(rgba(255,255,255,0.12) 1.5px, transparent 1.5px)',
    },
  }[theme || 'apple_studio'] || {
    bg: '#ffffff',
    topGrad: 'radial-gradient(ellipse at 50% 0%, #ffffff 0%, #f8fafc 55%, #f1f5f9 100%)',
    charGrad: 'radial-gradient(ellipse at 50% 100%, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.6) 60%, transparent 100%)',
    glow: 'rgba(245, 158, 11, 0.28)',
    glowWide: 'rgba(37, 99, 235, 0.22)',
    accent: '#0071e3',
    cardBg: 'rgba(255, 255, 255, 0.94)',
    cardBorder: 'rgba(15, 23, 42, 0.08)',
    rimLight: 'rgba(37, 99, 235, 0.22)',
    footerColor: '#64748b',
    textColor: '#090d16',
    subColor: '#0f172a',
    scrimGrad: 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.90) 45%, rgba(255, 255, 255, 0) 100%)',
    dotGrid: 'radial-gradient(rgba(100, 116, 139, 0.22) 1.5px, transparent 1.5px)',
  };

  const isLight = theme === 'apple_studio' || theme === 'white' || !theme;

  const highlightStyles = {
    amber: {
      bg: 'linear-gradient(135deg, #f59e0b, #f97316)',
      color: '#fff',
      shadow: isLight ? '0 10px 25px rgba(245, 158, 11, 0.42), 0 2px 6px rgba(0,0,0,0.06)' : '0 0 40px rgba(245,158,11,0.85), 0 4px 20px rgba(0,0,0,0.6)',
      border: 'none',
    },
    yellow: {
      bg: 'linear-gradient(135deg, #eab308, #fbbf24)',
      color: '#000',
      shadow: isLight ? '0 10px 25px rgba(234, 179, 8, 0.40), 0 2px 6px rgba(0,0,0,0.06)' : '0 0 40px rgba(234,179,8,0.90), 0 4px 20px rgba(0,0,0,0.6)',
      border: 'none',
    },
    rose: {
      bg: 'linear-gradient(135deg, #f43f5e, #be123c)',
      color: '#fff',
      shadow: isLight ? '0 10px 25px rgba(244, 63, 94, 0.42), 0 2px 6px rgba(0,0,0,0.06)' : '0 0 45px rgba(244,63,94,0.90), 0 4px 20px rgba(0,0,0,0.7)',
      border: 'none',
    },
    emerald: {
      bg: 'linear-gradient(135deg, #10b981, #0d9488)',
      color: '#fff',
      shadow: isLight ? '0 10px 25px rgba(16, 185, 129, 0.42), 0 2px 6px rgba(0,0,0,0.06)' : '0 0 40px rgba(16,185,129,0.85), 0 4px 20px rgba(0,0,0,0.6)',
      border: 'none',
    },
    sky: {
      bg: 'linear-gradient(135deg, #0071e3, #2563eb)',
      color: '#fff',
      shadow: isLight ? '0 10px 25px rgba(0, 113, 227, 0.42), 0 2px 6px rgba(0,0,0,0.06)' : '0 0 45px rgba(14,165,233,0.90), 0 4px 20px rgba(0,0,0,0.7)',
      border: 'none',
    },
    purple: {
      bg: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
      color: '#fff',
      shadow: isLight ? '0 10px 25px rgba(139, 92, 246, 0.42), 0 2px 6px rgba(0,0,0,0.06)' : '0 0 45px rgba(168,85,247,0.90), 0 4px 20px rgba(0,0,0,0.7)',
      border: 'none',
    },
    cyan: {
      bg: 'linear-gradient(135deg, #06b6d4, #0891b2)',
      color: '#fff',
      shadow: isLight ? '0 10px 25px rgba(6, 182, 212, 0.42), 0 2px 6px rgba(0,0,0,0.06)' : '0 0 45px rgba(6,182,212,0.90), 0 4px 20px rgba(0,0,0,0.7)',
      border: 'none',
    },
  }[highlightColor];

  const renderTitleWords = (fontSize: number, lineHeight: number) => {
    if (!highlightWord) {
      return (
        <div style={{
          fontSize,
          lineHeight,
          fontWeight: 900,
          color: themes.textColor,
          letterSpacing: '-0.02em',
          textShadow: isLight ? '0 2px 10px rgba(15,23,42,0.06)' : '0 6px 30px rgba(0,0,0,0.95), 0 2px 8px rgba(0,0,0,0.8)',
          wordBreak: 'break-word',
        }}>
          {title}
        </div>
      );
    }

    const regex = new RegExp(`(${highlightWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = title.split(regex);

    return (
      <div style={{ fontSize, lineHeight, wordBreak: 'break-word' }}>
        {parts.map((part, i) => {
          if (part.toLowerCase() === highlightWord.toLowerCase()) {
            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  background: highlightStyles.bg,
                  color: highlightStyles.color,
                  boxShadow: highlightStyles.shadow,
                  fontWeight: 900,
                  letterSpacing: '-0.01em',
                  padding: is16x9 ? '4px 22px 6px' : '6px 24px 8px',
                  borderRadius: '16px',
                  margin: '2px 4px',
                  transform: 'rotate(-1.5deg) skewX(-1deg)',
                  verticalAlign: 'middle',
                  textTransform: 'uppercase',
                }}
              >
                {part}
              </span>
            );
          }
          return (
            <span
              key={i}
              style={{
                fontWeight: 900,
                color: themes.textColor,
                letterSpacing: '-0.02em',
                textShadow: isLight ? '0 2px 10px rgba(15,23,42,0.06)' : '0 6px 30px rgba(0,0,0,0.95), 0 2px 8px rgba(0,0,0,0.8)',
                display: 'inline',
              }}
            >
              {part}
            </span>
          );
        })}
      </div>
    );
  };

  // ═══════════════════════════════════════════════════
  //  9:16 VERTICAL — Magazine Cover Layout
  //  Top 55%: Text content stack  (dark gradient)
  //  Bottom 55%: Full-body character centered (charGrad)
  // ═══════════════════════════════════════════════════
  if (!is16x9) {
    return (
      <div
        style={{
          position: 'relative',
          width: 1080,
          height: 1920,
          overflow: 'hidden',
          background: themes.bg,
          fontFamily: "'Inter', 'SF Pro Display', 'Helvetica Neue', sans-serif",
        }}
      >
        {/* ─── LAYER 1: Deep background gradient ─── */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: themes.topGrad,
          zIndex: 1,
        }} />

        {/* ─── LAYER 2: Character zone gradient (bottom warmth) ─── */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '65%',
          background: themes.charGrad,
          zIndex: 2,
        }} />

        {/* ─── LAYER 3A: Left Warm Amber Glow (Judy Insights Signature) ─── */}
        <div style={{
          position: 'absolute',
          top: isLight ? '14%' : '8%',
          left: isLight ? '-14%' : '50%',
          transform: isLight ? 'none' : 'translateX(-50%)',
          width: isLight ? '760px' : '700px',
          height: isLight ? '760px' : '700px',
          borderRadius: '50%',
          background: isLight
            ? 'radial-gradient(circle, rgba(245, 158, 11, 0.28) 0%, rgba(251, 191, 36, 0.12) 50%, transparent 75%)'
            : themes.glow,
          filter: isLight ? 'blur(100px)' : 'blur(120px)',
          zIndex: 3,
          opacity: isLight ? 0.85 : 0.85,
          pointerEvents: 'none',
        }} />

        {/* ─── LAYER 3B: Right Electric Cognitive Blue Glow (Judy Insights Signature) ─── */}
        {isLight && (
          <div style={{
            position: 'absolute',
            top: '26%',
            right: '-14%',
            width: '800px',
            height: '800px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(37, 99, 235, 0.24) 0%, rgba(14, 165, 233, 0.10) 50%, transparent 75%)',
            filter: 'blur(110px)',
            zIndex: 3,
            pointerEvents: 'none',
          }} />
        )}

        {/* ─── LAYER 4: Top accent glow ─── */}
        <div style={{
          position: 'absolute',
          top: '-5%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '900px',
          height: '500px',
          borderRadius: '50%',
          background: themes.glowWide,
          filter: 'blur(90px)',
          zIndex: 3,
          pointerEvents: 'none',
        }} />

        {/* ─── LAYER 5: Subtle dot grid overlay ─── */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: themes.dotGrid,
          backgroundSize: '38px 38px',
          zIndex: 4,
          opacity: isLight ? 0.25 : 0.12,
        }} />

        {/* ─── LAYER 6: Rim light strip behind character (bottom center) ─── */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '120px',
          background: `radial-gradient(ellipse, ${themes.rimLight} 0%, transparent 70%)`,
          filter: 'blur(30px)',
          zIndex: 5,
        }} />

        {/* ─── LAYER 7: CHARACTER — intimate waist-up eye-level framing grounded at bottom ─── */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: `translateX(-50%) scale(${characterScale}) translateY(${characterOffsetY}px)`,
          transformOrigin: 'bottom center',
          width: '980px',
          height: '1460px',
          zIndex: 16,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}>
          <Img
            src={staticFile(resolvedPose)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'bottom center',
              filter: isLight
                ? 'drop-shadow(0 20px 40px rgba(15,23,42,0.18)) drop-shadow(0 4px 12px rgba(15,23,42,0.12))'
                : 'drop-shadow(0 40px 80px rgba(0,0,0,0.99)) drop-shadow(0 8px 24px rgba(0,0,0,0.85))',
            }}
            alt="Character"
          />
        </div>

        {/* ─── LAYER 8: Text gradient scrim — covers ONLY the top text zone, never touches the character ─── */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '28%',
          background: themes.scrimGrad,
          zIndex: 15,
        }} />

        {/* ─── LAYER 9: TOP BADGES ─── */}
        <div style={{
          position: 'absolute',
          top: '60px',
          left: '60px',
          right: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 20,
        }}>
          <div style={{
            padding: '14px 28px',
            borderRadius: '999px',
            background: themes.cardBg,
            border: `1.5px solid ${themes.cardBorder}`,
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: isLight ? '0 4px 20px rgba(15,23,42,0.06)' : '0 8px 32px rgba(0,0,0,0.5)',
          }}>
            <Sparkles style={{ width: '22px', height: '22px', color: '#f59e0b' }} />
            <span style={{
              fontFamily: 'monospace',
              fontWeight: 800,
              fontSize: '22px',
              letterSpacing: '0.12em',
              color: themes.subColor,
              textTransform: 'uppercase',
            }}>
              {categoryBadge}
            </span>
          </div>

          <div style={{
            padding: '12px 24px',
            borderRadius: '999px',
            background: themes.cardBg,
            border: `1.5px solid ${themes.cardBorder}`,
            backdropFilter: 'blur(20px)',
            fontFamily: 'monospace',
            fontWeight: 800,
            fontSize: '20px',
            letterSpacing: '0.12em',
            color: isLight ? '#0071e3' : themes.accent,
            textTransform: 'uppercase',
            boxShadow: isLight ? '0 4px 20px rgba(15,23,42,0.06)' : '0 8px 32px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            {isLight && <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#0071e3', display: 'inline-block' }} />}
            {extraBadge || (isLight ? 'JUDY INSIGHTS' : '')}
          </div>
        </div>

        {/* ─── LAYER 10: MAIN TITLE TEXT BLOCK ─── */}
        <div style={{
          position: 'absolute',
          top: '180px',
          left: '60px',
          right: '60px',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}>
          {/* Hero Title */}
          {renderTitleWords(92, 1.06)}

          {/* Subtitle hook card */}
          {subtitle && (
            <div style={{
              display: 'inline-flex',
              alignSelf: 'flex-start',
              alignItems: 'center',
              gap: '14px',
              padding: '18px 28px',
              borderRadius: '20px',
              background: isLight ? 'rgba(255, 255, 255, 0.95)' : themes.cardBg,
              border: `1.5px solid ${isLight ? 'rgba(15, 23, 42, 0.08)' : themes.cardBorder}`,
              backdropFilter: 'blur(24px)',
              boxShadow: isLight ? '0 8px 30px rgba(15,23,42,0.06), 0 2px 8px rgba(0, 113, 227, 0.04)' : '0 12px 40px rgba(0,0,0,0.6)',
              maxWidth: '920px',
            }}>
              <Sparkles style={{ width: '26px', height: '26px', color: '#f59e0b', flexShrink: 0 }} />
              <span style={{
                fontSize: '28px',
                fontWeight: 800,
                color: themes.subColor,
                letterSpacing: '-0.01em',
                lineHeight: 1.35,
              }}>
                {subtitle}
              </span>
            </div>
          )}

          {/* Visual graphic slot */}
          {visualGraphic && (
            <div style={{ marginTop: '8px' }}>
              {visualGraphic}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════
  //  16:9 WIDESCREEN — Side-by-side composition
  //  Left 60%: Text content  |  Right 40%: Character
  // ═══════════════════════════════════════════════════
  return (
    <div
      style={{
        position: 'relative',
        width: 1920,
        height: 1080,
        overflow: 'hidden',
        background: themes.bg,
        backgroundImage: `radial-gradient(circle at ${characterPosition === 'left' ? '25%' : '75%'} 50%, ${themes.charGrad.split(',')[1].trim().replace(' 0%', '')} 0%, ${themes.bg} 65%)`,
        fontFamily: "'Inter', 'SF Pro Display', 'Helvetica Neue', sans-serif",
      }}
    >
      {/* Ambient glow orb near character */}
      <div style={{
        position: 'absolute',
        top: '5%',
        [characterPosition === 'left' ? 'left' : 'right']: '8%',
        width: '820px',
        height: '820px',
        borderRadius: '50%',
        background: themes.glowWide,
        filter: 'blur(130px)',
        zIndex: 2,
      }} />

      {/* Dot grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.22) 1.5px, transparent 1.5px)',
        backgroundSize: '38px 38px',
        opacity: 0.13,
        zIndex: 3,
      }} />

      {/* Character */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        [characterPosition === 'left' ? 'left' : 'right']: '30px',
        width: '700px',
        height: '1020px',
        transform: `scale(${characterScale}) translateY(${characterOffsetY}px)`,
        transformOrigin: 'bottom center',
        zIndex: 10,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}>
        {/* Rim light under character */}
        <div style={{
          position: 'absolute',
          bottom: '0',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '480px',
          height: '100px',
          background: `radial-gradient(ellipse, ${themes.rimLight} 0%, transparent 70%)`,
          filter: 'blur(25px)',
          zIndex: 1,
        }} />
        <Img
          src={staticFile(resolvedPose)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'bottom center',
            filter: 'drop-shadow(0 30px 70px rgba(0,0,0,0.98)) drop-shadow(0 6px 20px rgba(0,0,0,0.85))',
            position: 'relative',
            zIndex: 2,
          }}
          alt="Character"
        />
      </div>

      {/* Text scrim on text side */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: characterPosition === 'left'
          ? `linear-gradient(90deg, transparent 0%, ${themes.bg}f0 40%, ${themes.bg} 65%)`
          : `linear-gradient(90deg, ${themes.bg} 35%, ${themes.bg}f0 60%, transparent 100%)`,
        zIndex: 8,
      }} />

      {/* Content container */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '56px 72px',
        zIndex: 15,
      }}>
        {/* TOP BADGES */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{
            padding: '12px 26px',
            borderRadius: '999px',
            background: themes.cardBg,
            border: `1.5px solid ${themes.cardBorder}`,
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}>
            <Sparkles style={{ width: '20px', height: '20px', color: '#fbbf24' }} />
            <span style={{
              fontFamily: 'monospace', fontWeight: 800, fontSize: '17px',
              letterSpacing: '0.12em', color: '#e2e8f0', textTransform: 'uppercase',
            }}>
              {categoryBadge}
            </span>
          </div>

          {extraBadge && (
            <div style={{
              padding: '10px 22px',
              borderRadius: '999px',
              background: themes.cardBg,
              border: `1.5px solid ${themes.cardBorder}`,
              backdropFilter: 'blur(20px)',
              fontFamily: 'monospace', fontWeight: 800, fontSize: '15px',
              letterSpacing: '0.1em', color: themes.accent, textTransform: 'uppercase',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}>
              {extraBadge}
            </div>
          )}
        </div>

        {/* MAIN CONTENT: title + subtitle */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
          maxWidth: characterPosition === 'left' ? '1100px' : '1000px',
          marginLeft: characterPosition === 'left' ? 'auto' : undefined,
        }}>
          {renderTitleWords(88, 1.05)}

          {subtitle && (
            <div style={{
              display: 'inline-flex',
              alignSelf: 'flex-start',
              alignItems: 'center',
              gap: '14px',
              padding: '16px 28px',
              borderRadius: '18px',
              background: themes.cardBg,
              border: `1.5px solid ${themes.cardBorder}`,
              backdropFilter: 'blur(20px)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
              maxWidth: '880px',
            }}>
              <Zap style={{ width: '24px', height: '24px', color: '#fbbf24', flexShrink: 0 }} />
              <span style={{
                fontSize: '28px', fontWeight: 700,
                color: '#e2e8f0', letterSpacing: '-0.01em', lineHeight: 1.35,
              }}>
                {subtitle}
              </span>
            </div>
          )}

          {visualGraphic && (
            <div style={{ marginTop: '8px' }}>
              {visualGraphic}
            </div>
          )}
        </div>

        {/* BOTTOM FOOTER */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '18px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              width: '10px', height: '10px', borderRadius: '50%',
              background: '#34d399', boxShadow: '0 0 14px #34d399', display: 'block',
            }} />
            <span style={{
              fontFamily: 'monospace', fontSize: '15px', fontWeight: 700,
              letterSpacing: '0.1em', color: themes.footerColor, textTransform: 'uppercase',
            }}>
              RightMotion
            </span>
          </div>
          <span style={{
            fontFamily: 'monospace', fontSize: '15px', fontWeight: 700,
            letterSpacing: '0.08em', color: themes.footerColor, textTransform: 'uppercase',
          }}>
            HD 4K • 16:9
          </span>
        </div>
      </div>
    </div>
  );
};
