import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  GlossyGlowGraph,
  GlossyBarChart,
  GlossyRadialDial,
  GlossyBalanceScale,
  GlossyFrictionSlider,
  GlossyToggleBoard,
  SteppedProgressionStairs,
  GlossyFeatureGrid,
  PolishStickerFloat,
  KineticTypoLadder,
  ArchitecturalDraftingCanvas,
  VectorCursor,
} from "../../components/pure_graphics";
import { TacticalMemeCard } from "../../components/TacticalMemeCard";
import { MemeStickerOverlay } from "../../components/MemeStickerOverlay";
import { WordTimestamp } from "../../types";

interface CanvasProps {
  transcript: WordTimestamp[];
}

export const TheSelfImageTrapCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-8 select-none">
      {/* ======================== SCENE 1: PROCRASTINATE HARDEST (Frames 0-395) ======================== */}
      {frame >= 0 && frame < 395 && (() => {
        const cam1 = interpolate(frame, [0, 395], [1.0, 1.05], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.0, 0.0, 0.2, 1.0) });
        const c1Op  = interpolate(frame, [45, 65], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.22, 1, 0.36, 1) });
        const c1X   = interpolate(frame, [45, 65], [-16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.22, 1, 0.36, 1) });
        const c2Op  = interpolate(frame, [62, 82], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const c3Op  = interpolate(frame, [82, 102], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const cntProg = interpolate(frame, [80, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.22, 1, 0.36, 1) });
        const breathe = 1 + Math.sin((frame / fps) * 1.1) * 0.06;
        return (
          <div className="absolute inset-0" style={{ transform: `scale(${cam1})`, transformOrigin: "55% 50%" }}>
            {/* Atmospheric glow orbs */}
            <div className="absolute pointer-events-none" style={{ left: "35%", top: "54%", width: `${580 * breathe}px`, height: `${580 * breathe}px`, transform: "translate(-50%,-50%)", background: "radial-gradient(ellipse, rgba(244, 63, 94, 0.18) 0%, transparent 65%)", borderRadius: "50%", filter: "blur(28px)" }} />
            <div className="absolute pointer-events-none" style={{ left: "72%", top: "42%", width: `${240 * breathe}px`, height: `${240 * breathe}px`, transform: "translate(-50%,-50%)", background: "radial-gradient(ellipse, #10b98122 0%, transparent 65%)", borderRadius: "50%", filter: "blur(20px)" }} />

            {/* ── 3-TIER KINETIC TYPOGRAPHIC LADDER (Solution Wagon / Jordan Brown Master Style) ── */}
            <KineticTypoLadder
              leadIn="YOU PROCRASTINATE"
              slamWord="HARDEST"
              punchText="ON YOUR LIFE"
              startFrame={3}
              theme="light"
              accentColor="#f43f5e"
              showSelectionBox={true}
              showCursor={true}
              cursorType="arrow"
              yOffset="10%"
              align="center"
            />

            {/* GRAPH — shifted left-center below typography */}
            <div className="absolute" style={{ left: "-4%", top: "56%", transform: "translateY(-50%)" }}>
              <GlossyGlowGraph
                title=""
                entranceFrame={8}
                yLabel="TENSION"
                xLabels={["THINK", "DELAY", "FEAR", "ACTION"]}
                showFloorReflection={true}
                reflectionOpacity={0.25}
                theme="light"
                curves={[
                  {
                    id: "optimal_0",
                    label: "ACTION",
                    color: "#10b981",
                    glowColor: "#10b981",
                    startFrame: 14,
                    durationFrames: 38,
                    showArrow: true,
                    pathD: "M 100 310 C 160 130, 240 100, 310 128 C 390 165, 470 295, 548 318",
                    areaD: "M 100 340 L 100 310 C 160 130, 240 100, 310 128 C 390 165, 470 295, 548 318 L 548 340 Z",
                    tipX: 548,
                    tipY: 318,
                  },
                  {
                    id: "trap_0",
                    label: "AVOIDANCE",
                    color: "#f43f5e",
                    glowColor: "#f43f5e",
                    startFrame: 30,
                    durationFrames: 50,
                    showArrow: true,
                    pathD: "M 100 310 C 200 306, 320 310, 400 308 C 455 305, 502 162, 550 84",
                    areaD: "M 100 340 L 100 310 C 200 306, 320 310, 400 308 C 455 305, 502 162, 550 84 L 550 340 Z",
                    tipX: 550,
                    tipY: 84,
                  },
                ]}
                width={740}
                height={420}
              />
            </div>

            {/* STAGGERED DATA CALLOUTS — right side (Mobile 480p High Legibility) */}
            <div className="absolute pointer-events-none z-20" style={{ left: "58%", top: "42%", opacity: c1Op, transform: `translateX(${c1X}px)` }}>
              <div className="flex flex-col gap-1 px-6 py-4 rounded-2xl" style={{ background: `linear-gradient(135deg, #10b98120 0%, rgba(10,15,28,0.95) 100%)`, border: "2.5px solid #10b98188", backdropFilter: "blur(16px)", boxShadow: "0 12px 30px rgba(0,0,0,0.8), 0 0 20px #10b98133" }}>
                <span className="text-lg font-mono font-black tracking-widest uppercase" style={{ color: "#10b981", letterSpacing: "0.15em" }}>VISIBLE ATTEMPT</span>
                <span className="text-3xl font-display font-black tracking-tight leading-none" style={{ color: "#fff", textShadow: "0 0 16px #10b981cc" }}>EXECUTION</span>
              </div>
            </div>
            <div className="absolute pointer-events-none z-20" style={{ left: "58%", top: "56%", opacity: c2Op }}>
              <div className="flex flex-col gap-1 px-6 py-4 rounded-2xl" style={{ background: `linear-gradient(135deg, #f43f5e20 0%, rgba(10,15,28,0.95) 100%)`, border: "2.5px solid #f43f5e88", backdropFilter: "blur(16px)", boxShadow: "0 12px 30px rgba(0,0,0,0.8), 0 0 20px #f43f5e33" }}>
                <span className="text-lg font-mono font-black tracking-widest uppercase" style={{ color: "#f43f5e", letterSpacing: "0.15em" }}>ANTICIPATORY</span>
                <span className="text-3xl font-display font-black tracking-tight leading-none" style={{ color: "#fff", textShadow: "0 0 16px #f43f5ecc" }}>SELF-HANDICAP</span>
              </div>
            </div>
            <div className="absolute pointer-events-none z-20" style={{ left: "58%", top: "70%", opacity: c3Op }}>
              <div className="flex flex-col gap-1 px-6 py-4 rounded-2xl" style={{ background: `linear-gradient(135deg, #fb923c20 0%, rgba(10,15,28,0.95) 100%)`, border: "2.5px solid #fb923c88", backdropFilter: "blur(16px)", boxShadow: "0 12px 30px rgba(0,0,0,0.8), 0 0 20px #fb923c33" }}>
                <span className="text-lg font-mono font-black tracking-widest uppercase" style={{ color: "#fb923c", letterSpacing: "0.15em" }}>PRESERVE EXCUSE</span>
                <span className="text-3xl font-display font-black tracking-tight leading-none" style={{ color: "#fff", textShadow: "0 0 16px #fb923ccc" }}>DELAY LOOP</span>
              </div>
            </div>

            {/* ANIMATED COUNTER bottom-right (72px JetBrains Mono) */}
            <div className="absolute pointer-events-none flex flex-col items-center" style={{ left: "74%", bottom: "6%", opacity: c3Op }}>
              <span className="font-black font-mono tracking-tight" style={{ fontSize: "68px", color: "#0f172a", textShadow: `0 0 28px #f43f5e44`, lineHeight: 1 }}>
                {Math.round(cntProg * 86)}<span style={{ fontSize: "0.5em", color: "#f43f5e", verticalAlign: "super", marginLeft: "4px" }}>%</span>
              </span>
              <span className="text-base font-mono font-extrabold tracking-widest uppercase mt-1.5" style={{ color: "#475569", letterSpacing: "0.18em" }}>untested potential</span>
            </div>
          </div>
        );
      })()}

      {/* ======================== SCENE 2: ANTICIPATORY SELFHANDICAPPING (Frames 395-758) ======================== */}
      {frame >= 395 && frame < 758 && (() => {
        const cam2   = interpolate(frame, [395, 758], [1.04, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.22, 1, 0.36, 1) });
        const sceneF = frame - 395;
        const p1Op   = interpolate(sceneF, [58, 78], [0, 1], { extrapolateRight: "clamp" });
        const p2Op   = interpolate(sceneF, [80, 100], [0, 1], { extrapolateRight: "clamp" });
        const statsOp = interpolate(sceneF, [72, 92], [0, 1], { extrapolateRight: "clamp" });
        const breathe = 1 + Math.sin((frame / fps) * 1.1) * 0.06;
        return (
          <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ transform: `scale(${cam2})`, transformOrigin: "50% 48%" }}>
            <div className="absolute pointer-events-none" style={{ left: "28%", top: "55%", width: `${450 * breathe}px`, height: `${450 * breathe}px`, transform: "translate(-50%,-50%)", background: "radial-gradient(ellipse, #f43f5e28 0%, transparent 65%)", borderRadius: "50%", filter: "blur(30px)" }} />
            <div className="absolute pointer-events-none" style={{ left: "72%", top: "55%", width: `${450 * breathe}px`, height: `${450 * breathe}px`, transform: "translate(-50%,-50%)", background: "radial-gradient(ellipse, #10b98128 0%, transparent 65%)", borderRadius: "50%", filter: "blur(30px)" }} />

            {/* ── 3-TIER KINETIC TYPOGRAPHIC LADDER (Solution Wagon / Jordan Brown Master Style) ── */}
            <KineticTypoLadder
              leadIn="PSYCHOLOGISTS CALL THIS"
              slamWord="SELF-HANDICAPPING"
              punchText="PRESERVES EXCUSE"
              startFrame={398}
              theme="light"
              accentColor="#f43f5e"
              showSelectionBox={true}
              showCursor={true}
              cursorType="arrow"
              yOffset="10%"
              align="center"
            />

            {/* Dual comparison graph positioned comfortably below Typographic Ladder */}
            <div style={{ marginTop: "140px" }}>
              <GlossyGlowGraph
                title=""
                entranceFrame={403}
                yLabel="CERTAINTY"
                xLabels={["THINK", "PLAN", "WAIT", "ACT"]}
                showFloorReflection={true}
                reflectionOpacity={0.25}
                theme="light"
                curves={[
                  {
                    id: "good_1",
                    label: "VISIBLE EFFORT",
                    color: "#10b981",
                    glowColor: "#10b981",
                    startFrame: 410,
                    durationFrames: 42,
                    showArrow: true,
                    pathD: "M 100 305 C 155 120, 240 95, 315 118 C 400 148, 475 290, 548 315",
                    areaD: "M 100 340 L 100 305 C 155 120, 240 95, 315 118 C 400 148, 475 290, 548 315 L 548 340 Z",
                    tipX: 548,
                    tipY: 315,
                  },
                  {
                    id: "bad_1",
                    label: "PRESERVE EXCUSE",
                    color: "#f43f5e",
                    glowColor: "#f43f5e",
                    startFrame: 437,
                    durationFrames: 44,
                    showArrow: true,
                    pathD: "M 100 312 C 200 308, 330 312, 400 308 C 450 305, 500 162, 548 88",
                    areaD: "M 100 340 L 100 312 C 200 308, 330 312, 400 308 C 450 305, 500 162, 548 88 L 548 340 Z",
                    tipX: 548,
                    tipY: 88,
                  },
                ]}
                width={860}
                height={440}
              />
            </div>

            {/* Floating data pins above graph curves */}
            <div className="absolute pointer-events-none z-20" style={{ left: "16%", top: "44%", opacity: p1Op }}>
              <div className="flex flex-col gap-1 px-6 py-4 rounded-2xl" style={{ background: "linear-gradient(135deg, #10b98122 0%, rgba(10,15,28,0.95) 100%)", border: "2.5px solid #10b98188", backdropFilter: "blur(16px)", boxShadow: "0 10px 25px rgba(0,0,0,0.8)" }}>
                <span className="text-lg font-mono font-black tracking-widest uppercase" style={{ color: "#10b981", letterSpacing: "0.15em" }}>PUBLIC ATTEMPT</span>
                <span className="text-3xl font-display font-black tracking-tight leading-none" style={{ color: "#fff" }}>COLLECT EVIDENCE</span>
              </div>
            </div>
            <div className="absolute pointer-events-none z-20" style={{ right: "4%", top: "36%", opacity: p2Op }}>
              <div className="flex flex-col gap-1 px-6 py-4 rounded-2xl" style={{ background: "linear-gradient(135deg, #f43f5e22 0%, rgba(10,15,28,0.95) 100%)", border: "2.5px solid #f43f5e88", backdropFilter: "blur(16px)", boxShadow: "0 10px 25px rgba(0,0,0,0.8)" }}>
                <span className="text-lg font-mono font-black tracking-widest uppercase" style={{ color: "#f43f5e", letterSpacing: "0.15em" }}>PROTECT IDENTITY</span>
                <span className="text-3xl font-display font-black tracking-tight leading-none" style={{ color: "#fff" }}>HIDDEN FAILURE</span>
              </div>
            </div>

            {/* Bottom stats row - 56px JetBrains Mono */}
            <div className="absolute flex gap-20 items-center px-10 py-4 rounded-3xl" style={{ bottom: "4%", left: "50%", transform: "translateX(-50%)", opacity: statsOp, background: "rgba(10,15,28,0.88)", border: "2px solid rgba(255,255,255,0.18)", backdropFilter: "blur(20px)" }}>
              <div className="flex flex-col items-center gap-1">
                <span className="text-5xl md:text-6xl font-black font-mono tracking-tight" style={{ color: "#10b981", textShadow: "0 0 25px #10b98188" }}>+100%</span>
                <span className="text-base font-mono font-black tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.8)", letterSpacing: "0.15em" }}>action evidence</span>
              </div>
              <div style={{ width: "2px", height: "46px", background: "rgba(255,255,255,0.25)" }} />
              <div className="flex flex-col items-center gap-1">
                <span className="text-5xl md:text-6xl font-black font-mono tracking-tight" style={{ color: "#f43f5e", textShadow: "0 0 25px #f43f5e88" }}>ZERO</span>
                <span className="text-base font-mono font-black tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.8)", letterSpacing: "0.15em" }}>excuses left</span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ======================== SCENE 3: DELAY RESEARCH (Frames 758-856) ======================== */}
      {frame >= 758 && frame < 856 && (() => {
        const cam3    = interpolate(frame, [758, 848], [0.96, 1.02], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.22, 1, 0.36, 1) });
        const sceneF  = frame - 758;
        const leftX   = interpolate(sceneF, [0, 28], [-40, 0], { extrapolateRight: "clamp", easing: Easing.bezier(0.22, 1, 0.36, 1) });
        const leftOp  = interpolate(sceneF, [0, 22], [0, 1], { extrapolateRight: "clamp" });
        const rightX  = interpolate(sceneF, [12, 40], [40, 0], { extrapolateRight: "clamp", easing: Easing.bezier(0.22, 1, 0.36, 1) });
        const rightOp = interpolate(sceneF, [12, 34], [0, 1], { extrapolateRight: "clamp" });
        const breathe = 1 + Math.sin((frame / fps) * 1.1) * 0.06;
        return (
          <div className="absolute inset-0 flex flex-col items-center" style={{ transform: `scale(${cam3})`, transformOrigin: "50% 50%" }}>
            <div className="absolute pointer-events-none" style={{ left: "28%", top: "45%", width: `${500 * breathe}px`, height: `${500 * breathe}px`, transform: "translate(-50%,-50%)", background: "radial-gradient(ellipse, #38bdf828 0%, transparent 65%)", borderRadius: "50%", filter: "blur(30px)" }} />
            <div className="absolute pointer-events-none" style={{ left: "72%", top: "45%", width: `${500 * breathe}px`, height: `${500 * breathe}px`, transform: "translate(-50%,-50%)", background: "radial-gradient(ellipse, #f43f5e28 0%, transparent 65%)", borderRadius: "50%", filter: "blur(30px)" }} />

            {/* ── 3-TIER KINETIC TYPOGRAPHIC LADDER (Solution Wagon / Jordan Brown Master Style) ── */}
            <KineticTypoLadder
              leadIn="THE FAKE LOOP IS"
              slamWord="DELAY & PLAN"
              punchText="AVOIDING ACTION"
              startFrame={761}
              theme="light"
              accentColor="#38bdf8"
              showSelectionBox={true}
              showCursor={true}
              cursorType="arrow"
              yOffset="10%"
              align="center"
            />

            {/* CENTER: Hero Balance scale (700x400) - Lifted to top: 32% */}
            <div className="absolute" style={{ top: "32%" }}>
              <GlossyBalanceScale
                title=""
                titleColor="#ffffff"
                leftLabel="HIDDEN EXCUSE"
                leftSub="PRESERVES EGO"
                leftColor="#f43f5e"
                rightLabel="PUBLIC ACTION"
                rightSub="COLLECT EVIDENCE"
                rightColor="#10b981"
                winner="right"
                startFrame={758}
                width={700}
                height={400}
                glowColor="rgba(16, 185, 129, 0.22)"
                showFloorReflection={true}
                reflectionOpacity={0.25}
              />
            </div>

            {/* TWO PROMINENT COMPARATIVE VERDICT CARDS (Anchored at top: 52% to guarantee zero caption overlap) */}
            <div className="absolute flex gap-8 items-center" style={{ top: "52%" }}>
              <div className="flex flex-col gap-2 p-6 rounded-3xl shadow-2xl" style={{
                width: "440px",
                background: "rgba(15, 23, 42, 0.94)",
                border: "2.5px solid #f43f5e88",
                boxShadow: "0 25px 60px rgba(0,0,0,0.8), 0 0 30px #f43f5e33",
                opacity: leftOp,
                transform: `translateX(${leftX}px)`,
              }}>
                <div className="flex items-center justify-between">
                  <span className="text-base font-mono font-black uppercase px-4 py-1.5 rounded-full" style={{ background: "#f43f5e20", color: "#f43f5e", border: "1px solid #f43f5e66" }}>
                    THE TRAP
                  </span>
                  <span className="text-sm font-mono font-bold text-slate-400">UNTESTED EGO</span>
                </div>
                <span className="text-3xl font-display font-black text-white mt-1 leading-tight">
                  PROTECT IDENTITY
                </span>
                <span className="text-lg font-mono font-bold text-rose-400">
                  Delay & plan to avoid failure risk
                </span>
              </div>

              <div className="flex flex-col gap-2 p-6 rounded-3xl shadow-2xl" style={{
                width: "440px",
                background: "rgba(15, 23, 42, 0.94)",
                border: "2.5px solid #10b98188",
                boxShadow: "0 25px 60px rgba(0,0,0,0.8), 0 0 35px #10b98135",
                opacity: rightOp,
                transform: `translateX(${rightX}px)`,
              }}>
                <div className="flex items-center justify-between">
                  <span className="text-base font-mono font-black uppercase px-4 py-1.5 rounded-full" style={{ background: "#10b98120", color: "#10b981", border: "1px solid #10b98166" }}>
                    THE PROTOCOL
                  </span>
                  <span className="text-sm font-mono font-bold text-emerald-400">VISIBLE EFFORT</span>
                </div>
                <span className="text-3xl font-display font-black text-white mt-1 leading-tight">
                  ACTION BEATS FEAR
                </span>
                <span className="text-lg font-mono font-bold text-emerald-300">
                  Imperfect attempt removes uncertainty
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ======================== SCENE 4: ACTION REMOVES (Frames 856-end) ======================== */}
      {frame >= 856 && (() => {
        const cam4   = interpolate(frame, [856, 976], [0.95, 1.01], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.22, 1, 0.36, 1) });
        const sceneF = frame - 856;
        const pin1Op  = interpolate(sceneF, [30, 50], [0, 1], { extrapolateRight: "clamp" });
        const pin2Op  = interpolate(sceneF, [52, 72], [0, 1], { extrapolateRight: "clamp" });
        const divH = interpolate(sceneF, [18, 42], [0, 320], { extrapolateRight: "clamp", easing: Easing.bezier(0.22, 1, 0.36, 1) });
        const breathe = 1 + Math.sin((frame / fps) * 1.1) * 0.06;
        return (
          <div className="absolute inset-0 flex items-center" style={{ transform: `scale(${cam4})`, transformOrigin: "50% 50%" }}>
            <div className="absolute pointer-events-none" style={{ left: "70%", top: "54%", width: `${480 * breathe}px`, height: `${480 * breathe}px`, transform: "translate(-50%,-50%)", background: "radial-gradient(ellipse, #fbbf2428 0%, transparent 65%)", borderRadius: "50%", filter: "blur(30px)" }} />
            <div className="absolute pointer-events-none" style={{ left: "28%", top: "54%", width: `${400 * breathe}px`, height: `${400 * breathe}px`, transform: "translate(-50%,-50%)", background: "radial-gradient(ellipse, #10b98122 0%, transparent 65%)", borderRadius: "50%", filter: "blur(25px)" }} />

            {/* ── 3-TIER KINETIC TYPOGRAPHIC LADDER (Solution Wagon / Jordan Brown Master Style) ── */}
            <KineticTypoLadder
              leadIn="BREAK THE LOOP WITH"
              slamWord="VISIBLE EFFORT"
              punchText="TEST IDENTITY"
              startFrame={859}
              theme="light"
              accentColor="#10b981"
              showSelectionBox={true}
              showCursor={true}
              cursorType="arrow"
              yOffset="10%"
              align="center"
            />

            {/* LEFT: Stepped Staircase (500x420) */}
            <div className="absolute" style={{ left: "3%", top: "54%", transform: "translateY(-50%)" }}>
              <SteppedProgressionStairs
                title=""
                titleColor="#ffffff"
                orbColor="#10b981"
                startFrame={856}
                stepDurationFrames={24}
                showFloorReflection={true}
                reflectionOpacity={0.25}
                theme="light"
                width={500}
                height={420}
                steps={[
                  { id: "s1_3", label: "DESIRE" },
                  { id: "s2_3", label: "FEAR LOOP" },
                  { id: "s3_3", label: "PUBLIC STEP" },
                  { id: "s4_3", label: "VISIBLE EFFORT", isGoal: true },
                ]}
              />
            </div>

            {/* VERTICAL DIVIDER */}
            <div className="absolute pointer-events-none" style={{ left: "50%", top: "42%", width: "3px", height: `${divH}px`, background: "linear-gradient(to bottom, transparent, rgba(15,23,42,0.2), transparent)", boxShadow: "0 0 14px rgba(0,0,0,0.08)" }} />

            {/* RIGHT: Radial Dial (size 380) */}
            <div className="absolute" style={{ right: "4%", top: "54%", transform: "translateY(-52%)" }}>
              <GlossyRadialDial
                title=""
                titleColor="#ffffff"
                targetPercent={95}
                valueText="1ST TRY"
                labelText="IMPERFECT RULE"
                accentColor="#10b981"
                glowColor="rgba(16, 185, 129, 0.20)"
                startFrame={874}
                size={380}
                showFloorReflection={true}
                reflectionOpacity={0.25}
                theme="light"
              />
            </div>

            {/* Sleek Centered Telemetry Bar (Zero graphic overlap, sitting cleanly above captions) */}
            <div
              className="absolute flex gap-10 items-center px-8 py-3.5 rounded-2xl pointer-events-none z-20"
              style={{
                top: "62%",
                left: "50%",
                transform: "translateX(-50%)",
                opacity: pin1Op,
                background: "rgba(15, 23, 42, 0.94)",
                border: "2px solid rgba(16, 185, 129, 0.6)",
                backdropFilter: "blur(16px)",
                boxShadow: "0 12px 35px rgba(0,0,0,0.7), 0 0 20px rgba(16, 185, 129, 0.2)",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-400" style={{ boxShadow: "0 0 10px #10b981" }} />
                <span className="text-lg font-mono font-black text-emerald-400 tracking-wider">RULE:</span>
                <span className="text-2xl font-display font-black text-white">IMPERFECT FIRST</span>
              </div>
              <div style={{ width: "2px", height: "28px", background: "rgba(255,255,255,0.2)" }} />
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-amber-400" style={{ boxShadow: "0 0 10px #fbbf24" }} />
                <span className="text-lg font-mono font-black text-amber-400 tracking-wider">GOAL:</span>
                <span className="text-2xl font-display font-black text-white">REAL EVIDENCE</span>
              </div>
            </div>
          </div>
        );
      })()}

      
      {/* ======================================================== */}
      {/* TACTICAL RETENTION MEME POP (< 2.5s Strict Cap)          */}
      {/* ======================================================== */}
      <TacticalMemeCard
        memeId="doctor_strange_loop"
        startFrame={0}
        durationFrames={46}
        playbackRate={1.4}
        hudLabel="AUTOPILOT LOOP // RECURSION"
        theme="apple_studio"
        position="top"
      />

      
      {/* ======================================================== */}
      {/* MID-VIDEO GEN-Z MEME REACTION STICKER POP               */}
      {/* ======================================================== */}
      <MemeStickerOverlay
        stickerId="toddler_head_panic"
        startFrame={430}
        durationFrames={34}
        position="center-right"
        badgeText="PANIC MODE"
      />

    </div>
  );
};
