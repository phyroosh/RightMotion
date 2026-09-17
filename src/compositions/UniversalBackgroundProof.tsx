/**
 * 🎬 RightMotion — UniversalBackgroundProof Composition
 * Location: src/compositions/UniversalBackgroundProof.tsx
 *
 * Demonstrates the 7 core creative proof scenarios:
 * 1. Black/dark texture background (dark_matte_spotlight_01).
 * 2. High-contrast typography (>7:1 white text on dark matte surface).
 * 3. Presenter grounding (Judy waist-up cleanly separated from textured background).
 * 4. Seamless cross-background transition (Scene 1 dark -> Scene 2 warm paper).
 * 5. Visual mechanism + background stage.
 * 6. Intentional no-background suppression (Scene 3: pure clarity canvas for diagram).
 * 7. Intentional narrative return (Scene 4: return to opening dark spotlight).
 */

import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { UniversalBackground } from "../components/backgrounds";
import "../style.css";

export const UniversalBackgroundProof: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Scene Segments (at 30 FPS):
  // Scene 1: Frames 0 - 90 (0.0s - 3.0s): Dark Spotlight + Hero Typography + Presenter
  // Scene 2: Frames 90 - 180 (3.0s - 6.0s): Warm Paper Texture + Threshold Mechanism
  // Scene 3: Frames 180 - 240 (6.0s - 8.0s): No Background (Clarity Canvas) + Pure Diagram
  // Scene 4: Frames 240 - 300 (8.0s - 10.0s): Narrative Return to Dark Spotlight

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none bg-[#090d16]"
      style={{ width, height }}
    >
      {/* ========================================================================= */}
      {/* 1. BACKGROUND LAYER                                                      */}
      {/* ========================================================================= */}

      {/* Scene 1 & 4: Dark Matte Spotlight Surface */}
      {((frame >= 0 && frame < 90) || frame >= 240) && (
        <UniversalBackground
          assetId="dark_matte_spotlight_01"
          semanticRole="cinematic_surface"
          cropStrategy="center_focal"
          motion="slow_zoom_in"
          motionScaleDelta={1.05}
          opacity={1.0}
          transitionIn={frame < 90 ? { type: "fade", durationFrames: 12 } : { type: "dissolve", durationFrames: 15 }}
          sceneStartFrame={frame < 90 ? 0 : 240}
          sceneDurationFrames={frame < 90 ? 90 : 60}
        />
      )}

      {/* Scene 2: Warm Tactile Paper Surface */}
      {frame >= 90 && frame < 180 && (
        <UniversalBackground
          assetId="paper_warm_tactile_02"
          semanticRole="tactile_stage"
          cropStrategy="center_focal"
          motion="subtle_drift"
          opacity={1.0}
          transitionIn={{ type: "dissolve", durationFrames: 15 }}
          transitionOut={{ type: "dissolve", durationFrames: 15 }}
          sceneStartFrame={90}
          sceneDurationFrames={90}
        />
      )}

      {/* Scene 3: Mode "none" (Clarity Canvas) */}
      {frame >= 180 && frame < 240 && (
        <div className="absolute inset-0 bg-[#060913] transition-opacity duration-300" />
      )}

      {/* ========================================================================= */}
      {/* 2. FOREGROUND CONTENT & MECHANISMS                                        */}
      {/* ========================================================================= */}

      {/* SCENE 1 (Frames 0 - 90): Dark Matte + White Typography + Presenter */}
      {frame >= 0 && frame < 90 && (
        <div className="absolute inset-0 flex flex-col justify-between p-16 z-20">
          <div className="pt-40 flex flex-col items-start gap-4">
            <span className="font-mono text-emerald-400 text-3xl font-bold tracking-widest uppercase">
              ACT 01 // CINEMATIC SURFACE
            </span>
            <h1 className="text-white font-black text-7xl tracking-tight leading-tight max-w-[900px]">
              THE INVISIBLE FRICTION
            </h1>
            <p className="text-slate-300 text-4xl max-w-[800px] mt-2">
              Contrast ratio &gt; 12:1 against authentic dark spotlight texture.
            </p>
          </div>

          {/* Grounded Judy Presenter */}
          <div className="absolute bottom-0 right-12 z-30 pointer-events-none">
            <Img
              src={staticFile("character_open.png")}
              style={{
                height: 1150,
                objectFit: "contain",
                filter: "drop-shadow(0 25px 35px rgba(0,0,0,0.6))",
              }}
            />
          </div>
        </div>
      )}

      {/* SCENE 2 (Frames 90 - 180): Warm Paper + Mechanism */}
      {frame >= 90 && frame < 180 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-16 z-20">
          <span className="font-mono text-slate-800 text-3xl font-bold tracking-widest uppercase mb-4">
            ACT 02 // TACTILE STAGE
          </span>
          <h2 className="text-slate-950 font-black text-6xl tracking-tight text-center mb-8">
            PHYSICAL THRESHOLD SHIFT
          </h2>
          {/* Visual Mechanism: Dynamic Threshold Beam */}
          <div className="w-[850px] h-3 bg-slate-950 rounded-full my-6 relative shadow-lg">
            <div
              className="absolute -top-6 w-14 h-14 rounded-full bg-rose-500 border-4 border-slate-950 shadow-xl"
              style={{
                left: `${interpolate(frame, [90, 180], [10, 85], { extrapolateRight: "clamp" })}%`,
              }}
            />
          </div>
          <p className="text-slate-700 text-3xl text-center max-w-[700px] mt-4 font-mono">
            Background provides tactile materiality without competing with physics.
          </p>
        </div>
      )}

      {/* SCENE 3 (Frames 180 - 240): No Background (Clarity Canvas) */}
      {frame >= 180 && frame < 240 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-16 z-20">
          <span className="font-mono text-cyan-400 text-3xl font-bold tracking-widest uppercase mb-4">
            ACT 03 // CLARITY CANVAS (NO BG)
          </span>
          <h2 className="text-white font-black text-6xl tracking-tight text-center mb-8">
            HIGH-DENSITY DATA DIAGRAM
          </h2>
          <div className="grid grid-cols-2 gap-6 w-[880px]">
            <div className="p-8 rounded-3xl bg-slate-900/90 border-2 border-cyan-500/40 text-center">
              <span className="text-cyan-400 font-mono text-2xl font-bold">STATE A</span>
              <p className="text-white text-3xl font-black mt-2">DOPAMINE: 12%</p>
            </div>
            <div className="p-8 rounded-3xl bg-slate-900/90 border-2 border-emerald-500/40 text-center">
              <span className="text-emerald-400 font-mono text-2xl font-bold">STATE B</span>
              <p className="text-white text-3xl font-black mt-2">SEROTONIN: 88%</p>
            </div>
          </div>
          <p className="text-slate-400 text-3xl text-center max-w-[700px] mt-6 font-mono">
            Background intentionally suppressed for maximum educational diagram focus.
          </p>
        </div>
      )}

      {/* SCENE 4 (Frames 240 - 300): Narrative Return to Dark Spotlight */}
      {frame >= 240 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-16 z-20">
          <span className="font-mono text-amber-400 text-3xl font-bold tracking-widest uppercase mb-4">
            ACT 04 // NARRATIVE RETURN
          </span>
          <h2 className="text-white font-black text-7xl tracking-tight text-center max-w-[900px] leading-tight">
            THE FINAL RESOLUTION
          </h2>
          <p className="text-slate-300 text-3xl text-center max-w-[750px] mt-6">
            Returning to the opening spotlight environment to bring closure to the narrative.
          </p>
        </div>
      )}
    </div>
  );
};
