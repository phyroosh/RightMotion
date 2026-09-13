import React from "react";
import { useCurrentFrame } from "remotion";
import {
  OpenStageSurface,
  ThresholdBoundary,
  KineticFurrow,
  PersistentMemoryStage,
} from "../components/primitives";
import "../style.css";

/**
 * 🎬 PrimitivesShowcase — Remotion Test Composition for Phase 2 Primitives
 *
 * Demonstrates the open-canvas physical phenomenon:
 *   - Frames 500–940: ThresholdBoundary (Impulse at 680 -> Deflection -> Settled -> Ghost).
 *   - Frames 940–1200: KineticFurrow (Untouched -> Pass 1 Drag -> Groove Wear -> Pass 2 Glide)
 *     with PersistentMemoryStage maintaining the ghost trace from the prior boundary scene!
 */
export const PrimitivesShowcase: React.FC = () => {
  const frame = useCurrentFrame();

  // Persistent memory traces preserved across scenes
  const memoryTraces = [
    {
      traceId: "original_standard_ghost",
      originatingActorId: "integrity_boundary",
      originatingSceneId: "scene_boundary",
      appearance: "dashed_ghost_line" as const,
      coordinates: { y: 620, startX: 120, endX: 960 },
      opacity: 0.35,
      persistsUntilEnd: true,
      semanticMeaning: "Visual memory of the uncompromised baseline standard",
    },
  ];

  const isBoundaryScene = frame < 940;

  return (
    <OpenStageSurface groundColor="#f8fafc" lightingTheme="clean_studio_radial" gridTexture={true}>
      {/* 1. Threshold Boundary Scene (Frames 0–940) */}
      {isBoundaryScene && (
        <ThresholdBoundary
          frame={frame}
          fps={60}
          startX={120}
          endX={960}
          initialBaselineY={620}
          settledBaselineY={800}
          strokeColor="#090d16"
          thicknessPx={6}
          triggerFrame={680}
          impulseDurationFrames={50}
          showGhostTrace={true}
          ghostOpacity={0.35}
          label="THE STANDARD"
          labelColor="#64748b"
        />
      )}

      {/* 2. Kinetic Furrow Scene (Frames 940–1200) */}
      {!isBoundaryScene && (
        <>
          {/* Historical trace carried over from previous scene */}
          <PersistentMemoryStage frame={frame} traces={memoryTraces} />

          {/* Kinetic low-resistance pathway */}
          <KineticFurrow
            frame={frame}
            fps={60}
            startX={140}
            endX={940}
            y={800}
            initialWidthPx={4}
            carvedWidthPx={14}
            initialColor="#cbd5e1"
            carvedColor="#090d16"
            pass1TriggerFrame={970}
            pass1DurationFrames={65}
            pass2TriggerFrame={1070}
            pass2DurationFrames={30}
            massSizePx={32}
            massColor="#f43f5e"
            showFrictionStat={true}
            statText="-50% FRICTION"
          />
        </>
      )}
    </OpenStageSurface>
  );
};
