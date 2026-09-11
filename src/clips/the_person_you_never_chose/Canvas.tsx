import React from "react";
import { Easing, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { WordTimestamp } from "../../types";
import { Compass, EyeOff, RefreshCw } from "lucide-react";
import { AnimatedSlashStrike, KineticHighlighter } from "../../components/kinetic_text";
import { CinematicParallaxRig, PersistentAnchor } from "../../components/camera3d";

interface CanvasProps {
  transcript: WordTimestamp[];
}

/**
 * 🎬 ThePersonYouNeverChoseCanvas — 100% Bespoke Motion Graphics
 * Topic: "The Person You Never Chose" {Self Improvement}
 * Channel: Judy Insights (Apple Studio Razor-Sharp Editorial)
 *
 * Safe Zones:
 * - Primary graphics strictly between top: 6% and top: 68% (y: 115px to 1300px)
 * - Kinetic Captions reserved: top: 73% to top: 81%
 * - Zero overlap with captions!
 *
 * Visual Standard (Level 100 Standards):
 * - ZERO MEMES: All memes and sticker overlays permanently removed.
 * - PHYSICAL CUTOUTS: Anchored by Judy poses and psychology cutouts with crisp drop shadows.
 * - ULTRA-HIGH CONTRAST: Inky black (#090d16) text, solid white cards, razor-sharp 2.5px borders.
 * - SPATIAL CONTINUITY: PersistentAnchor carries visual identity across scene boundaries.
 * - THE DRAMATIC BREATH HOLD: 21-frame acoustic & visual freeze right before the central epiphany.
 */
export const ThePersonYouNeverChoseCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <CinematicParallaxRig
      basePushIn={{
        startFrame: 0,
        endFrame: 840,
        startZoom: 1.0,
        endZoom: 1.045,
      }}
      punchIns={[
        { frame: 521, zoom: 1.06, durationFrames: 14, targetY: -20 },
        { frame: 630, zoom: 1.10, durationFrames: 10, targetY: -35, dutchTilt: -1.0 },
        { frame: 740, zoom: 1.07, durationFrames: 14, targetY: -25 },
      ]}
      breathHolds={[
        { startFrame: 500, durationFrames: 21 },
      ]}
      impacts={[
        { frame: 630, intensity: 14, durationFrames: 10 },
      ]}
      className="w-full h-full select-none font-sans"
    >
      <div className="absolute inset-0 w-full h-full">
        {/* Cross-Scene Persistent Anchor: Identity Token bridges Scene 1 into Scene 2 */}
        <PersistentAnchor
          startFrame={75}
          transitionStartFrame={380}
          transitionEndFrame={415}
          initialState={{ x: 0, y: 130, scale: 1.0, opacity: 1 }}
          targetState={{ x: -280, y: 70, scale: 0.55, opacity: 0.85 }}
          exitFrame={520}
          className="top-0 left-1/2 z-30"
        >
          <div className="px-5 py-2 rounded-2xl bg-slate-950 text-white border-[2.5px] border-slate-800 shadow-xl flex items-center gap-3">
            <div className="w-3.5 h-3.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="font-mono text-[28px] font-black uppercase tracking-wider">
              BORROWED IDENTITY
            </span>
          </div>
        </PersistentAnchor>
      {/* ======================================================== */}
      {/* SCENE 1: BORROWED SUCCESS & PERFORMANCE HABIT (0 → 395)  */}
      {/* "You can become incredibly successful at living a life..."*/}
      {/* ======================================================== */}
      {frame >= 0 && frame < 395 && (() => {
        // Part 1A: Frames 0 -> 75 (~2.5s Hook: Hero Illustration + Close-up Judy)
        const hookOpacity = interpolate(frame, [65, 75], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const heroImageSpring = spring({
          frame,
          fps,
          config: { damping: 14, mass: 0.7, stiffness: 120 },
        });

        // Part 1B: Frames 75 -> 395 (Reshaping for expectations & performance habit)
        const part1BProgress = interpolate(frame, [75, 95], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });

        const judyCutoutSpring = spring({
          frame: Math.max(0, frame - 75),
          fps,
          config: { damping: 13, mass: 0.6, stiffness: 130 },
        });

        const habitSpring = spring({
          frame: Math.max(0, frame - 160),
          fps,
          config: { damping: 12, mass: 0.6, stiffness: 140 },
        });

        return (
          <div className="absolute inset-0 flex flex-col items-center">
            {/* PART 1A: 2.5s Hook with Created Illustration & Close-up Judy (Frames 0 -> 75) */}
            {frame < 78 && (
              <div
                className="absolute flex flex-col items-center text-center px-8 w-full"
                style={{
                  top: "9%",
                  opacity: hookOpacity,
                  transform: `translateY(${interpolate(hookOpacity, [0, 1], [-25, 0])}px)`,
                }}
              >
                <span className="font-mono text-[36px] font-black tracking-[0.25em] text-rose-600 uppercase mb-2">
                  THE SILENT PARADOX
                </span>

                <h1 className="font-sans font-black text-[78px] leading-[1.05] tracking-tight text-slate-950 mb-5">
                  NEVER CHOSE
                </h1>

                {/* Hero Created Illustration Card */}
                <div
                  className="relative w-[920px] bg-white border-[3px] border-slate-950 rounded-[36px] p-3 shadow-[0_26px_50px_-10px_rgba(0,0,0,0.22)] overflow-hidden"
                  style={{
                    transform: `scale(${heroImageSpring})`,
                  }}
                >
                  <div className="relative w-full h-[460px] rounded-[24px] overflow-hidden border-[1.5px] border-slate-200">
                    <img
                      src={staticFile("the_person_you_never_chose/assets/scene_illustration.png")}
                      alt="The Person You Never Chose"
                      className="w-full h-full object-cover"
                      style={{
                        transform: `scale(${interpolate(frame, [0, 75], [1.0, 1.05])})`,
                        transformOrigin: "center center",
                      }}
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent p-5 flex items-center justify-between">
                      <span className="font-mono text-[32px] font-black text-white uppercase tracking-wider">
                        BORROWED IDENTITY
                      </span>
                      <span className="font-mono text-[28px] font-bold text-amber-300 uppercase tracking-widest">
                        ORIGIN POINT
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PART 1B: Reshaping & Performance Habit (Frames 75 -> 285) */}
            {frame >= 75 && (
              <div
                className="absolute flex flex-col items-center w-full px-8"
                style={{
                  top: "10%",
                  opacity: part1BProgress,
                  transform: `translateY(${interpolate(part1BProgress, [0, 1], [40, 0])}px)`,
                }}
              >
                <span className="font-mono text-[38px] font-black tracking-[0.25em] text-rose-600 uppercase mb-2">
                  THE RESHAPING
                </span>

                <h1 className="font-sans font-black text-[78px] leading-tight tracking-tight text-slate-950 text-center mb-6">
                  <KineticHighlighter startFrame={135} color="yellow">BORROWED</KineticHighlighter> SUCCESS
                </h1>

                {/* Main Card with Integrated Semantic Cutout */}
                <div className="relative w-[900px] bg-white border-[2.5px] border-slate-950 rounded-[40px] p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.2)] flex items-center justify-between overflow-hidden">
                  <div className="flex flex-col max-w-[480px]">
                    <span className="font-mono text-[36px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      BEHAVIOR PATTERN
                    </span>
                    <h2 className="font-sans font-black text-[54px] text-slate-950 leading-tight">
                      ADAPT TO PRAISE.
                      <br />
                      FORGET INTENT.
                    </h2>
                  </div>

                  {/* High-Resolution Semantic Confusion Cutout */}
                  <div
                    className="relative w-[320px] h-[320px] flex items-center justify-center"
                    style={{ transform: `scale(${judyCutoutSpring})` }}
                  >
                    <img
                      src={staticFile("assets/psychology/tangled_confusion_chaos.png")}
                      alt="Tangled Confusion"
                      className="w-full h-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.18)]"
                    />
                  </div>
                </div>

                {/* Sub-Card: Performance Habit Slam */}
                {frame >= 160 && (
                  <div
                    className="w-[900px] mt-6 bg-slate-950 text-white rounded-[32px] p-7 border-[2px] border-slate-900 shadow-2xl flex items-center justify-between"
                    style={{ transform: `scale(${habitSpring})` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-4 h-4 rounded-full bg-rose-500 animate-ping" />
                      <span className="font-sans font-black text-[46px] text-white tracking-tight">
                        A HABIT OF PERFORMANCE
                      </span>
                    </div>
                    <span className="font-mono text-[36px] font-bold text-slate-300 uppercase">
                      AUTOMATED
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* SCENE 2: THE VALIDATION LOOP & VALUE MISALIGNMENT (395→660)*/}
      {/* "The loop is simple. Adapt, receive validation, repeat..." */}
      {/* "Eventually, your decisions feel right because..."        */}
      {/* ======================================================== */}
      {frame >= 395 && frame < 660 && (() => {
        // Part 2A: The Closed Loop (Frames 395 -> 520)
        const scene2AOpacity = interpolate(frame, [505, 520], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div className="absolute inset-0 flex flex-col items-center">
            {/* PART 2A: THE RECURSIVE ORBITAL LOOP (Adapt -> Validate -> Repeat) */}
            {frame < 522 && (() => {
              const loopRotation = interpolate(frame, [395, 520], [0, 360], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.linear,
              });

              // Synced to audio: "Adapt" (frame 445), "receive validation" (frame 465), "repeat" (frame 495)
              const node1Spring = spring({
                frame: Math.max(0, frame - 445),
                fps,
                config: { damping: 13, mass: 0.6, stiffness: 140 },
              });
              const node2Spring = spring({
                frame: Math.max(0, frame - 465),
                fps,
                config: { damping: 13, mass: 0.6, stiffness: 140 },
              });
              const node3Spring = spring({
                frame: Math.max(0, frame - 495),
                fps,
                config: { damping: 13, mass: 0.6, stiffness: 140 },
              });

              return (
                <div
                  className="absolute flex flex-col items-center w-full px-8"
                  style={{
                    top: "10%",
                    opacity: scene2AOpacity,
                    transform: `translateY(${interpolate(scene2AOpacity, [0, 1], [-40, 0])}px)`,
                  }}
                >
                  <span className="font-mono text-[38px] font-black tracking-[0.25em] text-slate-900 uppercase mb-2">
                    CLOSED FEEDBACK SYSTEM
                  </span>

                  <h1 className="font-sans font-black text-[80px] leading-tight tracking-tight text-slate-950 text-center mb-6">
                    THE LOOP IS SIMPLE
                  </h1>

                  {/* High-Contrast Razor-Sharp Orbital Loop Container */}
                  <div className="relative w-[880px] h-[450px] bg-white border-[2.5px] border-slate-950 rounded-[44px] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.18)] flex items-center justify-center">
                    <svg
                      className="absolute w-[360px] h-[360px]"
                      viewBox="0 0 360 360"
                      style={{ transform: `rotate(${loopRotation}deg)` }}
                    >
                      <circle
                        cx="180"
                        cy="180"
                        r="140"
                        fill="none"
                        stroke="#090d16"
                        strokeWidth="5"
                        strokeDasharray="16 12"
                        className="opacity-70"
                      />
                      <circle cx="180" cy="40" r="12" fill="#e11d48" />
                    </svg>

                    <div className="z-10 flex flex-col items-center text-center px-6">
                      <RefreshCw className="w-12 h-12 text-slate-950 animate-spin mb-2" />
                      <span className="font-mono text-[32px] font-black text-slate-500 uppercase tracking-widest">
                        AUTONOMOUS
                      </span>
                      <span className="font-sans font-black text-[48px] text-slate-950 leading-none mt-1">
                        CYCLE
                      </span>
                    </div>

                    {/* Node 1: ADAPT (Top) */}
                    <div
                      className="absolute top-4 px-7 py-3.5 rounded-2xl bg-slate-950 text-white font-sans font-black text-[38px] shadow-xl flex items-center gap-3 border border-slate-800"
                      style={{ transform: `scale(${node1Spring})` }}
                    >
                      1. ADAPT
                    </div>

                    {/* Node 2: VALIDATE (Bottom Right) */}
                    <div
                      className="absolute bottom-6 right-8 px-7 py-3.5 rounded-2xl bg-slate-950 text-white font-sans font-black text-[38px] shadow-xl flex items-center gap-3 border border-slate-800"
                      style={{ transform: `scale(${node2Spring})` }}
                    >
                      2. VALIDATE
                    </div>

                    {/* Node 3: REPEAT (Bottom Left) */}
                    <div
                      className="absolute bottom-6 left-8 px-7 py-3.5 rounded-2xl bg-rose-600 text-white font-sans font-black text-[38px] shadow-xl flex items-center gap-3"
                      style={{ transform: `scale(${node3Spring})` }}
                    >
                      3. REPEAT
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* PART 2B: FAMILIAR DOES NOT EQUAL VALUES (PROGRESSIVE LIVE CUT) */}
            {frame >= 520 && (() => {
              const headerSpring = spring({
                frame: frame - 520,
                fps,
                config: { damping: 13, mass: 0.6, stiffness: 140 },
              });

              // Block 1: "feel right ... familiar" (enters at frame 545)
              const block1Spring = spring({
                frame: Math.max(0, frame - 545),
                fps,
                config: { damping: 13, mass: 0.6, stiffness: 140 },
              });

              // Block 2: "not because they reflect your values" (enters at frame 600)
              const block2Spring = spring({
                frame: Math.max(0, frame - 600),
                fps,
                config: { damping: 13, mass: 0.6, stiffness: 140 },
              });

              // Sub-card realization (enters at frame 642)
              const insightSpring = spring({
                frame: Math.max(0, frame - 642),
                fps,
                config: { damping: 13, mass: 0.6, stiffness: 140 },
              });

              const isSlashed = frame >= 630;

              return (
                <div
                  className="absolute flex flex-col items-center text-center px-8 w-full"
                  style={{
                    top: "10%",
                    transform: `scale(${headerSpring})`,
                    opacity: Math.min(1, headerSpring),
                  }}
                >
                  <span className="font-mono text-[36px] font-black tracking-[0.25em] text-slate-900 uppercase mb-2">
                    THE PSYCHOLOGICAL TRAP
                  </span>

                  <h1 className="font-sans font-black text-[92px] tracking-tight text-slate-950 leading-tight mb-8">
                    FEELS RIGHT?
                  </h1>

                  {/* Progressive Razor-Sharp High-Contrast Editorial Card */}
                  <div className="w-[900px] bg-white border-[3px] border-slate-950 rounded-[40px] p-8 shadow-[0_28px_56px_-12px_rgba(0,0,0,0.22)] flex flex-col gap-6">
                    {/* Block 1: Conditioned / Familiar (Enters at frame 545 on speech "feel right because familiar") */}
                    {frame >= 545 && (
                      <div
                        className="flex items-center justify-between p-6 rounded-2xl bg-slate-100 border-[2px] border-slate-300 transition-all shadow-sm"
                        style={{
                          transform: `scale(${block1Spring}) translateY(${interpolate(block1Spring, [0, 1], [25, 0])}px)`,
                          opacity: Math.min(1, block1Spring),
                        }}
                      >
                        <div className="px-5 py-2 rounded-xl bg-slate-950 text-white font-mono text-[32px] font-black tracking-wider uppercase">
                          FEELS RIGHT
                        </div>
                        <span className="font-sans font-black text-[54px] text-amber-700 tracking-tight">
                          <KineticHighlighter startFrame={550} color="amber">JUST FAMILIAR</KineticHighlighter>
                        </span>
                      </div>
                    )}

                    {/* Block 2: Values (Enters at frame 600, slashed in real-time at frame 630) */}
                    {frame >= 600 && (
                      <div
                        className={`flex items-center justify-between p-6 rounded-2xl border-[2.5px] transition-colors duration-150 ${
                          isSlashed
                            ? "bg-rose-50 border-rose-500 shadow-md"
                            : "bg-slate-50 border-slate-300"
                        }`}
                        style={{
                          transform: `scale(${block2Spring}) translateY(${interpolate(block2Spring, [0, 1], [25, 0])}px)`,
                          opacity: Math.min(1, block2Spring),
                        }}
                      >
                        <div
                          className={`px-5 py-2 rounded-xl font-mono text-[32px] font-black tracking-wider uppercase transition-colors duration-150 ${
                            isSlashed ? "bg-rose-600 text-white" : "bg-slate-900 text-white"
                          }`}
                        >
                          TRUTH
                        </div>

                        {/* Real-time cutting action via AnimatedSlashStrike */}
                        <div className="font-sans font-black text-[54px] tracking-tight">
                          <AnimatedSlashStrike
                            startFrame={630}
                            durationFrames={7}
                            preset="blade_slash"
                            color="rose"
                            strokeWidth={8}
                          >
                            <span
                              className={`transition-colors duration-150 ${
                                isSlashed ? "text-rose-600" : "text-slate-950"
                              }`}
                            >
                              NOT YOUR VALUES
                            </span>
                          </AnimatedSlashStrike>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Clean Impact Insight Card (Zero floating avatars! Pure graphic punch) */}
                  {frame >= 642 && (
                    <div
                      className="w-[900px] mt-6 bg-slate-950 text-white rounded-[32px] p-7 border-[2px] border-slate-900 shadow-2xl flex items-center justify-between"
                      style={{
                        transform: `scale(${insightSpring})`,
                        opacity: Math.min(1, insightSpring),
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-4 h-4 rounded-full bg-amber-400 animate-ping" />
                        <span className="font-sans font-black text-[42px] text-white tracking-tight">
                          COMFORT IS NOT CONVICTION
                        </span>
                      </div>
                      <span className="font-mono text-[32px] font-bold text-slate-300 uppercase">
                        CONDITIONED
                      </span>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* SCENE 3: THE SOVEREIGN QUESTION (Frames 660 → 840)       */}
      {/* "Break the loop by asking one question before major..."   */}
      {/* ======================================================== */}
      {frame >= 660 && frame < 840 && (() => {
        const scene3Enter = spring({
          frame: Math.max(0, frame - 660),
          fps,
          config: { damping: 14, mass: 0.7, stiffness: 130 },
        });

        const questionSpring = spring({
          frame: Math.max(0, frame - 740),
          fps,
          config: { damping: 12, mass: 0.6, stiffness: 140 },
        });

        return (
          <div className="absolute inset-0 flex flex-col items-center">
            <div
              className="absolute flex flex-col items-center w-full px-8"
              style={{
                top: "10%",
                opacity: scene3Enter,
                transform: `translateY(${interpolate(scene3Enter, [0, 1], [40, 0])}px)`,
              }}
            >
              <span className="font-mono text-[38px] font-black tracking-[0.25em] text-slate-900 uppercase mb-2">
                THE SOVEREIGN TEST
              </span>

              <h1 className="font-sans font-black text-[84px] leading-tight tracking-tight text-slate-950 text-center mb-6">
                BREAK THE LOOP
              </h1>

              {/* The Diagnostic Question Card (High Contrast) */}
              <div
                className="w-[900px] bg-white border-[2.5px] border-slate-950 rounded-[40px] p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.22)] flex flex-col items-center text-center"
                style={{ transform: `scale(${questionSpring})` }}
              >
                <div className="flex items-center gap-3 text-slate-950 mb-6">
                  <EyeOff className="w-12 h-12 text-slate-950" />
                  <span className="font-mono font-black text-[38px] uppercase tracking-wider">
                    REMOVE THE AUDIENCE
                  </span>
                </div>

                <div className="bg-slate-950 rounded-[28px] p-8 w-full shadow-lg mb-6">
                  <p className="font-sans font-black text-[58px] leading-[1.25] text-white">
                    “WOULD I STILL
                    <br />
                    <span className="text-emerald-400">CHOOSE THIS</span>
                    <br />
                    IF NOBODY KNEW?”
                  </p>
                </div>

                <span className="font-mono text-[38px] font-black text-slate-950">
                  DECIDE IN TOTAL SILENCE
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* SCENE 4: ANSWERS THAT SURVIVE WITHOUT APPLAUSE (840 → 926) */}
      {/* "Build your life around answers that survive without..."  */}
      {/* ======================================================== */}
      {frame >= 840 && (() => {
        const cam4 = interpolate(frame, [840, 926], [0.99, 1.04], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });

        const scene4Enter = spring({
          frame: Math.max(0, frame - 840),
          fps,
          config: { damping: 14, mass: 0.7, stiffness: 130 },
        });

        const coreHit = spring({
          frame: Math.max(0, frame - 875),
          fps,
          config: { damping: 12, mass: 0.6, stiffness: 140 },
        });

        return (
          <div
            className="absolute inset-0 flex flex-col items-center"
            style={{ transform: `scale(${cam4})`, transformOrigin: "50% 36%" }}
          >
            <div
              className="absolute flex flex-col items-center w-full px-8"
              style={{
                top: "10%",
                opacity: scene4Enter,
                transform: `translateY(${interpolate(scene4Enter, [0, 1], [40, 0])}px)`,
              }}
            >
              <span className="font-mono text-[38px] font-black tracking-[0.25em] text-emerald-700 uppercase mb-2">
                UNSHAKABLE ALIGNMENT
              </span>

              <h1 className="font-sans font-black text-[84px] leading-tight tracking-tight text-slate-950 text-center mb-6">
                WITHOUT APPLAUSE
              </h1>

              {/* The Unshakable Foundation Card with Cutout Payoff */}
              <div className="w-[900px] bg-white border-[2.5px] border-slate-950 rounded-[40px] p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.2)] flex flex-col items-center">
                <div className="flex items-center justify-between w-full mb-6">
                  <span className="font-sans font-black text-[46px] text-slate-950 flex items-center gap-4">
                    <Compass className="w-12 h-12 text-emerald-600" />
                    SOVEREIGN CHOICE
                  </span>
                  <div className="px-6 py-2.5 rounded-2xl bg-emerald-600 text-white font-mono font-black text-[36px]">
                    100% INTERNAL
                  </div>
                </div>

                {/* 2 Core Sovereign Tenets */}
                <div className="grid grid-cols-2 gap-4 w-full mb-4">
                  <div className="p-6 rounded-2xl bg-slate-100 border-[2px] border-slate-300 flex flex-col">
                    <span className="font-mono text-[36px] font-black text-slate-600 uppercase">
                      EXTERNAL NOISE
                    </span>
                    <span className="font-sans font-black text-[44px] text-slate-950 mt-1">
                      DISREGARDED
                    </span>
                  </div>

                  <div className="p-6 rounded-2xl bg-emerald-50 border-[2px] border-emerald-400 flex flex-col">
                    <span className="font-mono text-[36px] font-black text-emerald-700 uppercase">
                      PERSONAL VALUES
                    </span>
                    <span className="font-sans font-black text-[44px] text-emerald-950 mt-1">
                      PROTECTED
                    </span>
                  </div>
                </div>
              </div>

              {/* Final Hero Impact Punch */}
              {frame >= 875 && (
                <div
                  className="w-[900px] mt-6 bg-slate-950 text-white rounded-[32px] p-7 border-[2px] border-slate-900 shadow-2xl flex flex-col items-center text-center"
                  style={{ transform: `scale(${coreHit})` }}
                >
                  <span className="font-mono text-[34px] font-bold text-emerald-400 uppercase tracking-widest mb-1">
                    THE BLUEPRINT
                  </span>
                  <span className="font-sans font-black text-[54px] tracking-tight text-white leading-tight">
                    BUILD WHAT SURVIVES IN SILENCE
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })()}
      </div>
    </CinematicParallaxRig>
  );
};
