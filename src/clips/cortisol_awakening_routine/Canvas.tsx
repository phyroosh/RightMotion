import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { PhysicalCard } from "../../components/physics/PhysicalCard";
import { ProCutout } from "../../components/ProCutout";
import { TapeStrip } from "../../components/collage/TapeStrip";
import {
  Moon,
  Sun,
  Clock,
  Smartphone,
  Coffee,
  Droplets,
  ArrowRight,
} from "lucide-react";

export const CortisolAwakeningCanvas: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-8 select-none">
      
      {/* ======================================================== */}
      {/* SCENE 1: THE 8-HOUR SLEEP PARADOX (Frames 0 - 140)       */}
      {/* ======================================================== */}
      {frame >= 0 && frame < 140 && (
        <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
          <div className="relative w-full max-w-[920px]">
            {/* Anchored Tape Strip safe at -top-7 */}
            <div className="absolute -top-7 right-8 z-30 pointer-events-none">
              <TapeStrip position="top-right" width={180} height={48} enableWobble />
            </div>

            <PhysicalCard
              tiltX={4}
              tiltY={-4}
              elevation={45}
              impactMs={150}
              className="w-full p-8 rounded-3xl bg-[#0a1124]/95 border-2 border-cyan-500/40 shadow-2xl backdrop-blur-md flex flex-col items-center text-center gap-6"
            >
              {/* Clean, Uncrowded Hook Header (No pill heading, no underline marker) */}
              <h1 className="text-5xl font-black text-white leading-tight tracking-tight max-w-[840px] mt-2">
                Slept 8 Full Hours Yet{" "}
                <div className="block mt-1">
                  <span className="text-rose-400 font-black text-6xl">Still Exhausted?</span>
                </div>
              </h1>

              {/* Cutout Hero: Exhausted in Bed (Centered & Spacious) */}
              <div className="w-full flex justify-center items-center my-3">
                <ProCutout
                  assetId="exhausted_in_bed"
                  glowColor="rose"
                  animation="stamp_impact"
                  width={440}
                  height={340}
                  ghostText="TIRED"
                />
              </div>

              {/* Telemetry Status Bar */}
              <div className="w-full p-4 rounded-2xl bg-black/70 border border-cyan-500/30 flex items-center justify-between text-2xl font-mono text-cyan-200">
                <span className="flex items-center gap-2.5">
                  <Moon className="w-6 h-6 text-amber-400" />
                  <span>TOTAL SLEEP: 8.0 HRS</span>
                </span>
                <span className="text-rose-400 font-black tracking-wide">RECOVERY FAILURE</span>
              </div>
            </PhysicalCard>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 2: THE GLITCH IN CAR (Frames 140 - 280)            */}
      {/* ======================================================== */}
      {frame >= 140 && frame < 280 && (() => {
        // Speech timestamps:
        // Frame 148 (4940ms): "laziness." -> Anti-laziness banner
        // Frame 188 (6280ms): "glitch in your" -> 3D Glowing Brain slams
        // Frame 207 (6900ms): "Cortisol Awakening Response" -> CAR HUD badge pops
        const spBanner = spring({ frame: frame - 148, fps, config: { damping: 13, stiffness: 140 } });
        const spBrain = spring({ frame: frame - 188, fps, config: { damping: 13, stiffness: 130 } });
        const spHud = spring({ frame: frame - 207, fps, config: { damping: 13, stiffness: 140 } });

        return (
          <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
            <div className="relative w-full max-w-[920px]">
              <PhysicalCard
                tiltX={-5}
                tiltY={4}
                elevation={44}
                impactMs={4800}
                className="w-full p-8 rounded-3xl bg-[#0a1124]/95 border-2 border-cyan-500/40 shadow-2xl backdrop-blur-md flex flex-col items-center text-center gap-6"
              >
                {/* Anti-Laziness Reframe Banner */}
                <div
                  style={{
                    opacity: frame >= 148 ? Math.min(1, spBanner * 1.2) : 0,
                    transform: `scale(${frame >= 148 ? interpolate(spBanner, [0, 1], [0.8, 1]) : 0.8})`,
                  }}
                  className="w-full p-4 rounded-2xl bg-gradient-to-r from-rose-950/60 via-purple-950/60 to-black border-2 border-rose-500/40 flex items-center justify-center gap-4 text-3xl font-black text-white shadow-xl"
                >
                  <span className="text-rose-400 line-through">"You're Lazy"</span>
                  <ArrowRight className="w-7 h-7 text-cyan-400 shrink-0" />
                  <span className="text-cyan-300 font-mono">NEUROLOGICAL GLITCH</span>
                </div>

                {/* 3D Brain Cutout — Centered */}
                <div
                  className="w-full flex justify-center items-center my-2 transition-all"
                  style={{
                    opacity: frame >= 188 ? Math.min(1, spBrain * 1.2) : 0,
                    transform: `scale(${frame >= 188 ? interpolate(spBrain, [0, 1], [0.6, 1]) : 0.6}) translateY(${frame >= 188 ? interpolate(spBrain, [0, 1], [30, 0]) : 30}px)`,
                  }}
                >
                  <ProCutout
                    assetId="hyperrealistic_3d_glowing_brain"
                    glowColor="sky"
                    animation="stamp_impact"
                    width={400}
                    height={320}
                    ghostText="C.A.R."
                  />
                </div>

                {/* The Cortisol Awakening Response Telemetry HUD (Frame 207) */}
                <div
                  className="w-full transition-all"
                  style={{
                    opacity: frame >= 207 ? Math.min(1, spHud * 1.2) : 0,
                    transform: `scale(${frame >= 207 ? interpolate(spHud, [0, 1], [0.8, 1]) : 0.8})`,
                  }}
                >
                  <div className="w-full p-5 rounded-2xl bg-[#0e172f]/90 border-2 border-cyan-500/40 flex items-center justify-between shadow-xl">
                    <div className="text-left">
                      <div className="text-2xl font-mono text-slate-400 font-bold">BIOLOGICAL TRIGGER</div>
                      <div className="text-3xl font-black text-white">Cortisol Awakening Response</div>
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-2xl font-mono font-bold">
                      MISALIGNED
                    </div>
                  </div>
                </div>
              </PhysicalCard>
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* SCENE 3: THE 3 BIOLOGICAL SWITCHES (Frames 280 - 760)     */}
      {/* ======================================================== */}
      {frame >= 280 && frame < 760 && (() => {
        // Speech timestamps:
        // Frame 403 (13420ms): "First, morning adenosine clearance" -> Switch 1
        // Frame 523 (17440ms): "Second, a natural cortisol surge" -> Switch 2
        // Frame 655 (21820ms): "third, core body temperature rise" -> Switch 3

        const spSwitch1 = spring({ frame: frame - 403, fps, config: { damping: 13, stiffness: 140 } });
        const spSwitch2 = spring({ frame: frame - 523, fps, config: { damping: 13, stiffness: 140 } });
        const spSwitch3 = spring({ frame: frame - 655, fps, config: { damping: 13, stiffness: 140 } });

        return (
          <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
            <div className="relative w-full max-w-[920px]">
              {/* Anchored Tape Strip safe at -top-7 */}
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                <TapeStrip position="center-top" width={180} height={48} enableWobble />
              </div>

              <PhysicalCard
                tiltX={5}
                tiltY={-4}
                elevation={44}
                impactMs={9500}
                className="w-full p-8 rounded-3xl bg-[#0a1124]/95 border-2 border-cyan-500/40 shadow-2xl backdrop-blur-md flex flex-col items-center text-center gap-6"
              >
                {/* Clean, Uncrowded Header (No repetitive top pill) */}
                <div className="text-center mt-1">
                  <h2 className="text-5xl font-black text-white leading-tight">
                    3 Morning Switches
                  </h2>
                  <div className="text-2xl font-mono text-cyan-300 font-bold mt-1 tracking-wider">
                    MUST ACTIVATE IN HARMONY
                  </div>
                </div>

                {/* The 3 Switches Stack — REVEALED SEQUENTIALLY ON EXACT WORDS */}
                <div className="flex flex-col gap-4 w-full my-1">
                  {/* Switch 1: Adenosine Clearance (Frame 403) */}
                  <div
                    style={{
                      opacity: frame >= 403 ? Math.min(1, spSwitch1 * 1.2) : 0,
                      transform: `scale(${frame >= 403 ? interpolate(spSwitch1, [0, 1], [0.75, 1]) : 0.75}) translateY(${frame >= 403 ? interpolate(spSwitch1, [0, 1], [25, 0]) : 25}px)`,
                    }}
                  >
                    <div className="p-4 rounded-2xl bg-[#0e172f]/90 border border-cyan-500/40 flex items-center justify-between text-left shadow-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-cyan-500/25 text-cyan-400 flex items-center justify-center text-3xl font-black font-mono shrink-0">
                          1
                        </div>
                        <div>
                          <div className="text-3xl font-black text-white">Adenosine Clearance</div>
                          <div className="text-2xl font-mono text-cyan-300 font-bold mt-0.5">Flush Residual Sleep Pressure</div>
                        </div>
                      </div>
                      <div className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 font-mono font-bold text-xl">
                        SWITCH 1
                      </div>
                    </div>
                  </div>

                  {/* Switch 2: Cortisol Surge (Frame 523) */}
                  <div
                    style={{
                      opacity: frame >= 523 ? Math.min(1, spSwitch2 * 1.2) : 0,
                      transform: `scale(${frame >= 523 ? interpolate(spSwitch2, [0, 1], [0.75, 1]) : 0.75}) translateY(${frame >= 523 ? interpolate(spSwitch2, [0, 1], [25, 0]) : 25}px)`,
                    }}
                  >
                    <div className="p-4 rounded-2xl bg-[#0e172f]/90 border border-emerald-500/40 flex items-center justify-between text-left shadow-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/25 text-emerald-400 flex items-center justify-center text-3xl font-black font-mono shrink-0">
                          2
                        </div>
                        <div>
                          <div className="text-3xl font-black text-white">Natural Cortisol Surge</div>
                          <div className="text-2xl font-mono text-emerald-300 font-bold mt-0.5">+50% Mental Alertness Spike</div>
                        </div>
                      </div>
                      <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xl">
                        SWITCH 2
                      </div>
                    </div>
                  </div>

                  {/* Switch 3: Core Body Temperature (Frame 655) */}
                  <div
                    style={{
                      opacity: frame >= 655 ? Math.min(1, spSwitch3 * 1.2) : 0,
                      transform: `scale(${frame >= 655 ? interpolate(spSwitch3, [0, 1], [0.75, 1]) : 0.75}) translateY(${frame >= 655 ? interpolate(spSwitch3, [0, 1], [25, 0]) : 25}px)`,
                    }}
                  >
                    <div className="p-4 rounded-2xl bg-[#0e172f]/90 border border-amber-500/40 flex items-center justify-between text-left shadow-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/25 text-amber-400 flex items-center justify-center text-3xl font-black font-mono shrink-0">
                          3
                        </div>
                        <div>
                          <div className="text-3xl font-black text-white">Core Temperature Rise</div>
                          <div className="text-2xl font-mono text-amber-300 font-bold mt-0.5">Ignite Mitochondrial Engine</div>
                        </div>
                      </div>
                      <div className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 font-mono font-bold text-xl">
                        SWITCH 3
                      </div>
                    </div>
                  </div>
                </div>
              </PhysicalCard>
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* SCENE 4: THE 3 SABOTAGING TRAPS (Frames 760 - 1050)      */}
      {/* ======================================================== */}
      {frame >= 760 && frame < 1050 && (() => {
        // Speech timestamps:
        // Frame 797 (26560ms): "phone in dark" -> Trap 1
        // Frame 840 (28000ms): "caffeine immediately" -> Trap 2
        // Frame 904 (30120ms): "mid-deep-sleep" -> Trap 3
        // Frame 992 (33060ms): "sleep inertia for hours" -> Paralyzed warning

        const spTrap1 = spring({ frame: frame - 797, fps, config: { damping: 13, stiffness: 140 } });
        const spTrap2 = spring({ frame: frame - 840, fps, config: { damping: 13, stiffness: 140 } });
        const spTrap3 = spring({ frame: frame - 904, fps, config: { damping: 13, stiffness: 140 } });
        const spParalyzed = spring({ frame: frame - 992, fps, config: { damping: 14, stiffness: 130 } });

        return (
          <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
            <div className="relative w-full max-w-[920px]">
              {/* Anchored Tape Strip */}
              <div className="absolute -top-7 left-8 z-30 pointer-events-none">
                <TapeStrip position="top-left" width={180} height={48} enableWobble />
              </div>

              <PhysicalCard
                tiltX={6}
                tiltY={-5}
                elevation={44}
                impactMs={25500}
                className="w-full p-8 rounded-3xl bg-[#0a1124]/95 border-2 border-rose-500/50 shadow-2xl backdrop-blur-md flex flex-col items-center text-center gap-6"
              >
                {/* Clean, Uncrowded Header (No bulky top pill) */}
                <div className="text-center mt-1">
                  <h2 className="text-5xl font-black text-white leading-tight">
                    3 Morning Traps
                  </h2>
                  <div className="text-2xl font-mono text-rose-400 font-bold mt-1 tracking-wider">
                    PARALYZING PREFRONTAL FUNCTION
                  </div>
                </div>

                {/* 3 Saboteur Cards — SEQUENTIALLY ON EXACT WORDS */}
                <div className="flex flex-col gap-3.5 w-full my-1">
                  {/* Trap 1: Phone in Dark (Frame 797) */}
                  <div
                    style={{
                      opacity: frame >= 797 ? Math.min(1, spTrap1 * 1.2) : 0,
                      transform: `scale(${frame >= 797 ? interpolate(spTrap1, [0, 1], [0.75, 1]) : 0.75}) translateY(${frame >= 797 ? interpolate(spTrap1, [0, 1], [20, 0]) : 20}px)`,
                    }}
                  >
                    <div className="p-4 rounded-2xl bg-[#0e172f]/90 border border-rose-500/40 flex items-center gap-4 text-left shadow-lg">
                      <div className="w-12 h-12 rounded-xl bg-rose-500/25 text-rose-400 flex items-center justify-center shrink-0">
                        <Smartphone className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="text-3xl font-black text-white">Phone In Dark Bedroom</div>
                        <div className="text-2xl font-mono text-rose-300 font-bold mt-0.5">Dopamine Shock + Blue Light Trap</div>
                      </div>
                    </div>
                  </div>

                  {/* Trap 2: Immediate Caffeine (Frame 840) */}
                  <div
                    style={{
                      opacity: frame >= 840 ? Math.min(1, spTrap2 * 1.2) : 0,
                      transform: `scale(${frame >= 840 ? interpolate(spTrap2, [0, 1], [0.75, 1]) : 0.75}) translateY(${frame >= 840 ? interpolate(spTrap2, [0, 1], [20, 0]) : 20}px)`,
                    }}
                  >
                    <div className="p-4 rounded-2xl bg-[#0e172f]/90 border border-rose-500/40 flex items-center gap-4 text-left shadow-lg">
                      <div className="w-12 h-12 rounded-xl bg-rose-500/25 text-rose-400 flex items-center justify-center shrink-0">
                        <Coffee className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="text-3xl font-black text-white">Immediate Caffeine</div>
                        <div className="text-2xl font-mono text-rose-300 font-bold mt-0.5">Locks Adenosine (Causes 2 PM Crash)</div>
                      </div>
                    </div>
                  </div>

                  {/* Trap 3: Waking Mid-Deep Sleep (Frame 904) */}
                  <div
                    style={{
                      opacity: frame >= 904 ? Math.min(1, spTrap3 * 1.2) : 0,
                      transform: `scale(${frame >= 904 ? interpolate(spTrap3, [0, 1], [0.75, 1]) : 0.75}) translateY(${frame >= 904 ? interpolate(spTrap3, [0, 1], [20, 0]) : 20}px)`,
                    }}
                  >
                    <div className="p-4 rounded-2xl bg-[#0e172f]/90 border border-rose-500/40 flex items-center gap-4 text-left shadow-lg">
                      <div className="w-12 h-12 rounded-xl bg-rose-500/25 text-rose-400 flex items-center justify-center shrink-0">
                        <Moon className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="text-3xl font-black text-white">Alarm In Mid-Deep Sleep</div>
                        <div className="text-2xl font-mono text-rose-300 font-bold mt-0.5">Shatters Sleep Architecture</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Paralyzed Inertia Callout (Frame 992) */}
                <div
                  className="w-full transition-all"
                  style={{
                    opacity: frame >= 992 ? Math.min(1, spParalyzed * 1.2) : 0,
                    transform: `scale(${frame >= 992 ? interpolate(spParalyzed, [0, 1], [0.8, 1]) : 0.8})`,
                  }}
                >
                  <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-rose-950/70 via-black to-rose-950/70 border-2 border-rose-500/50 flex items-center justify-center gap-3 text-3xl font-black text-white shadow-xl">
                    <span className="text-rose-400">BRAIN PARALYZED IN SLEEP INERTIA</span>
                  </div>
                </div>
              </PhysicalCard>
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* SCENE 5: THE 3-STEP PROTOCOL (Frames 1050 - 1280)        */}
      {/* ======================================================== */}
      {frame >= 1050 && frame < 1280 && (() => {
        // Speech timestamps:
        // Frame 1090 (36340ms): "direct morning sunlight within fifteen minutes" -> Step 1
        // Frame 1146 (38200ms): "delay caffeine by ninety minutes" -> Step 2
        // Frame 1216 (40540ms): "hydrate before touching a screen" -> Step 3

        const spStep1 = spring({ frame: frame - 1090, fps, config: { damping: 13, stiffness: 140 } });
        const spStep2 = spring({ frame: frame - 1146, fps, config: { damping: 13, stiffness: 140 } });
        const spStep3 = spring({ frame: frame - 1216, fps, config: { damping: 13, stiffness: 140 } });

        return (
          <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
            <div className="relative w-full max-w-[920px]">
              {/* Anchored Tape Strip safe at -top-7 */}
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                <TapeStrip position="center-top" width={180} height={48} enableWobble />
              </div>

              <PhysicalCard
                tiltX={5}
                tiltY={-4}
                elevation={44}
                impactMs={35500}
                className="w-full p-8 rounded-3xl bg-[#0a1124]/95 border-2 border-emerald-500/50 shadow-2xl backdrop-blur-md flex flex-col items-center text-center gap-6"
              >
                {/* Clean, Uncrowded Header (No bulky top pill) */}
                <div className="text-center mt-1">
                  <h2 className="text-5xl font-black text-white leading-tight">
                    The 3-Step Reset
                  </h2>
                  <div className="text-2xl font-mono text-emerald-400 font-bold mt-1 tracking-wider">
                    RECLAIM NATURAL MORNING FOCUS
                  </div>
                </div>

                {/* 3 Steps Stack — SEQUENTIALLY ON EXACT WORDS */}
                <div className="flex flex-col gap-4 w-full my-1">
                  {/* Step 1: Sunlight in 15 Min (Frame 1090) */}
                  <div
                    style={{
                      opacity: frame >= 1090 ? Math.min(1, spStep1 * 1.2) : 0,
                      transform: `scale(${frame >= 1090 ? interpolate(spStep1, [0, 1], [0.75, 1]) : 0.75}) translateY(${frame >= 1090 ? interpolate(spStep1, [0, 1], [20, 0]) : 20}px)`,
                    }}
                  >
                    <div className="p-4 rounded-2xl bg-[#0e172f]/90 border border-emerald-500/40 flex items-center gap-4 text-left shadow-lg">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/25 text-emerald-400 flex items-center justify-center shrink-0">
                        <Sun className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="text-3xl font-black text-white">Direct Sunlight in 15 Min</div>
                        <div className="text-2xl font-mono text-emerald-300 font-bold mt-0.5">Triggers Immediate Cortisol Peak</div>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Delay Caffeine 90 Min (Frame 1146) */}
                  <div
                    style={{
                      opacity: frame >= 1146 ? Math.min(1, spStep2 * 1.2) : 0,
                      transform: `scale(${frame >= 1146 ? interpolate(spStep2, [0, 1], [0.75, 1]) : 0.75}) translateY(${frame >= 1146 ? interpolate(spStep2, [0, 1], [20, 0]) : 20}px)`,
                    }}
                  >
                    <div className="p-4 rounded-2xl bg-[#0e172f]/90 border border-cyan-500/40 flex items-center gap-4 text-left shadow-lg">
                      <div className="w-12 h-12 rounded-xl bg-cyan-500/25 text-cyan-400 flex items-center justify-center shrink-0">
                        <Clock className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="text-3xl font-black text-white">Delay Caffeine 90 Minutes</div>
                        <div className="text-2xl font-mono text-cyan-300 font-bold mt-0.5">Allows Adenosine To Fully Clear</div>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Hydrate First (Frame 1216) */}
                  <div
                    style={{
                      opacity: frame >= 1216 ? Math.min(1, spStep3 * 1.2) : 0,
                      transform: `scale(${frame >= 1216 ? interpolate(spStep3, [0, 1], [0.75, 1]) : 0.75}) translateY(${frame >= 1216 ? interpolate(spStep3, [0, 1], [20, 0]) : 20}px)`,
                    }}
                  >
                    <div className="p-4 rounded-2xl bg-[#0e172f]/90 border border-sky-500/40 flex items-center gap-4 text-left shadow-lg">
                      <div className="w-12 h-12 rounded-xl bg-sky-500/25 text-sky-400 flex items-center justify-center shrink-0">
                        <Droplets className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="text-3xl font-black text-white">Hydrate Before Screens</div>
                        <div className="text-2xl font-mono text-sky-300 font-bold mt-0.5">500ml Electrolytes Before Phone</div>
                      </div>
                    </div>
                  </div>
                </div>
              </PhysicalCard>
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* SCENE 6: FINALE AFFIRMATION (Frames 1280 - 1346)         */}
      {/* ======================================================== */}
      {frame >= 1280 && (
        <div className="w-full flex flex-col items-center justify-center animate-in zoom-in-95 duration-300">
          <div className="relative w-full max-w-[920px]">
            <PhysicalCard
              tiltX={4}
              tiltY={-4}
              elevation={45}
              impactMs={42800}
              className="w-full p-8 rounded-3xl bg-[#0a1124]/95 border-2 border-cyan-500/50 shadow-2xl backdrop-blur-md flex flex-col items-center text-center gap-6"
            >
              {/* Cutout Hero: 3D Glowing Brain (Centered & Spacious) */}
              <div className="w-full flex justify-center items-center my-3">
                <ProCutout
                  assetId="hyperrealistic_3d_glowing_brain"
                  glowColor="sky"
                  animation="stamp_impact"
                  width={420}
                  height={340}
                  ghostText="BIOLOGY"
                />
              </div>

              {/* Clean Grand Affirmation Header (No pill, no underline marker) */}
              <h1 className="text-5xl font-black text-white leading-tight tracking-tight">
                Your Energy Isn't Random —{" "}
                <div className="block mt-2">
                  <span className="text-cyan-400 font-black text-6xl">IT'S BIOLOGY.</span>
                </div>
              </h1>
            </PhysicalCard>
          </div>
        </div>
      )}

    </div>
  );
};
