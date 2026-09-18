import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, staticFile, Img } from "remotion";
import {
  MotionStageAST,
  MotionSceneAST,
  MotionActor,
  PhysicalForce,
  SpatialMutation,
  CausalCoupling,
  StageAnnotation,
  PersistentTrace,
} from "./ast.types";
import {
  OpenStageSurface,
  MechanismStage,
  ThresholdBoundary,
  KineticFurrow,
  PersistentMemoryStage,
  CausalActionCoupling,
} from "../components/primitives";
import { UniversalBackground } from "../components/backgrounds/UniversalBackground";
import { ProCutout } from "../components/ProCutout";
import { KineticFulcrumBeam } from "../components/physics/consequence/KineticFulcrumBeam";

export interface MotionStagePlayerProps {
  ast: MotionStageAST;
  className?: string;
  style?: React.CSSProperties;
  sceneOverrides?: Record<string, (scene: MotionSceneAST, frame: number) => React.ReactNode>;
  actorOverrides?: Record<string, (actor: MotionActor, scene: MotionSceneAST, frame: number) => React.ReactNode>;
  children?: React.ReactNode;
}

/**
 * 🎬 MotionStagePlayer — The Motion AST Remotion Execution Boundary
 * Location: src/compiler/MotionStagePlayer.tsx
 *
 * Directly executes the visual Abstract Syntax Tree (MotionStageAST) compiled by
 * Frontier #0 and orchestrator.py inside Remotion.
 *
 * Eliminates the "Disconnected Shadow AST" illusion by translating:
 *   - StageEnvironment -> OpenStageSurface & UniversalBackground
 *   - PersistentWorldMemory -> PersistentMemoryStage across scene boundaries
 *   - ContinuousBoundary -> ThresholdBoundary with live mechanical deflection
 *   - ConduitPathway -> KineticFurrow with multi-pass velocity transitions
 *   - SemanticCutouts -> ProCutout with spring physics and depth
 *   - CausalCouplings -> CausalActionCoupling impulse propagation
 *   - StageAnnotations -> Kinetic Typography with Montserrat/JetBrains Mono
 */
export const MotionStagePlayer: React.FC<MotionStagePlayerProps> = ({
  ast,
  className = "",
  style = {},
  sceneOverrides,
  actorOverrides,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  if (!ast || !ast.scenes || ast.scenes.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-950 text-white font-mono">
        [MotionStagePlayer] Empty or invalid MotionStageAST
      </div>
    );
  }

  // 1. Identify currently active scene(s)
  const activeScenes = ast.scenes.filter(
    (scene) => frame >= scene.startFrame && frame < scene.endFrame
  );

  // Fallback to first scene if before start or last scene if past totalFrames
  const currentScene: MotionSceneAST =
    activeScenes[0] ||
    (frame < ast.scenes[0].startFrame
      ? ast.scenes[0]
      : ast.scenes[ast.scenes.length - 1]);

  // 2. Resolve background intent (Scene-specific overrides environment default)
  const activeBackgroundIntent =
    currentScene.backgroundIntent || ast.environment?.defaultBackgroundIntent;

  // 3. Render individual actors inside safe mechanism stage
  const renderActor = (actor: MotionActor, scene: MotionSceneAST) => {
    if (actorOverrides && actorOverrides[actor.id]) {
      return actorOverrides[actor.id](actor, scene, frame);
    }

    const { geometry, resolvedLayout, visualStyle } = actor;
    const geomType = geometry?.type;

    // --- CONTINUOUS BOUNDARY (ThresholdBoundary) ---
    if (geomType === "continuous_boundary") {
      const matchingMutation = scene.mutations?.find(
        (m) => m.actorId === actor.id
      );
      const matchingForce = scene.forces?.find(
        (f) => f.targetActorId === actor.id
      );

      const triggerFrame =
        matchingMutation?.triggerFrame ??
        matchingForce?.triggerFrame ??
        scene.startFrame + 30;

      const initialBaselineY =
        (geometry as any).initialBaselineY ??
        matchingMutation?.parameters?.initialY ??
        620;

      const settledBaselineY =
        matchingMutation?.parameters?.settledY ??
        (initialBaselineY + (matchingMutation?.parameters?.deflectionPx ?? 180));

      const width = resolvedLayout?.width ?? 840;
      const startX =
        resolvedLayout?.originAnchor === "center"
          ? (resolvedLayout?.x ?? 540) - width / 2
          : (resolvedLayout?.x ?? 120);
      const endX = startX + width;

      return (
        <ThresholdBoundary
          key={actor.id}
          frame={frame}
          fps={fps}
          startX={startX}
          endX={endX}
          initialBaselineY={initialBaselineY}
          settledBaselineY={settledBaselineY}
          strokeColor={visualStyle?.strokeColor ?? "#090d16"}
          thicknessPx={(geometry as any).thicknessPx ?? 6}
          triggerFrame={triggerFrame}
          showGhostTrace={actor.isPersistent}
          label={actor.semanticRole.toUpperCase().replace(/_/g, " ")}
        />
      );
    }

    // --- CONDUIT PATHWAY (KineticFurrow) ---
    if (geomType === "conduit_pathway") {
      const grooveMutation = scene.mutations?.find(
        (m) => m.actorId === actor.id && m.type === "groove_wear"
      );

      const pass1Trigger =
        grooveMutation?.triggerFrame ?? scene.startFrame + 30;
      const pass1Duration = grooveMutation?.durationFrames ?? 60;
      const pass2Trigger = pass1Trigger + pass1Duration + 30;

      const furrowWidth = resolvedLayout?.width ?? 800;
      const startX =
        (geometry as any).start?.[0] ??
        (resolvedLayout?.originAnchor === "center"
          ? (resolvedLayout?.x ?? 540) - furrowWidth / 2
          : (resolvedLayout?.x ?? 140));
      const endX =
        (geometry as any).end?.[0] ??
        startX + furrowWidth;

      return (
        <KineticFurrow
          key={actor.id}
          frame={frame}
          fps={fps}
          startX={startX}
          endX={endX}
          y={resolvedLayout?.y ?? 800}
          initialWidthPx={(geometry as any).widthPx ?? 4}
          carvedWidthPx={grooveMutation?.parameters?.carvedWidthPx ?? 14}
          initialColor={visualStyle?.strokeColor ?? "#cbd5e1"}
          carvedColor={visualStyle?.fillColor ?? "#090d16"}
          pass1TriggerFrame={pass1Trigger}
          pass1DurationFrames={pass1Duration}
          pass2TriggerFrame={pass2Trigger}
          pass2DurationFrames={30}
        />
      );
    }

    // --- SEMANTIC CUTOUT (ProCutout) ---
    if (geomType === "semantic_cutout") {
      const assetPath = (geometry as any).assetPath || "";
      const framesIntoScene = Math.max(0, frame - scene.startFrame);
      const entranceSpring = spring({
        frame: framesIntoScene,
        fps,
        config: { damping: 13, stiffness: 140, mass: 0.6 },
      });

      const w = resolvedLayout?.width ?? 480;
      const h = resolvedLayout?.height ?? 480;
      const left =
        resolvedLayout?.originAnchor === "center"
          ? (resolvedLayout?.x ?? 540) - w / 2
          : (resolvedLayout?.x ?? 200);
      const top =
        resolvedLayout?.originAnchor === "center"
          ? (resolvedLayout?.y ?? 680) - h / 2
          : (resolvedLayout?.y ?? 450);

      return (
        <div
          key={actor.id}
          className="absolute flex items-center justify-center pointer-events-none"
          style={{
            left,
            top,
            width: w,
            height: h,
            transform: `scale(${interpolate(entranceSpring, [0, 1], [0.8, 1])})`,
            opacity: Math.min(1, entranceSpring * 1.2),
            zIndex: actor.zIndex ?? 10,
          }}
        >
          <ProCutout
            assetId={assetPath}
            src={assetPath}
            width={w}
            height={h}
            animation="pop_spring"
            glowColor="cyan"
          />
        </div>
      );
    }

    // --- FULCRUM BEAM (KineticFulcrumBeam) ---
    if (geomType === "fulcrum_beam") {
      const tiltMutation = scene.mutations?.find(
        (m) => m.actorId === actor.id && m.type === "torque_tilt"
      );
      const torqueForce = scene.forces?.find(
        (f) => f.targetActorId === actor.id
      );

      const triggerFrame =
        tiltMutation?.triggerFrame ??
        torqueForce?.triggerFrame ??
        scene.startFrame + 30;

      const beamWidth = (geometry as any).lengthPx ?? resolvedLayout?.width ?? 820;
      const maxAngle =
        tiltMutation?.parameters?.angleDeg ??
        torqueForce?.magnitude ??
        14;

      const loads = [
        {
          id: `${actor.id}_left_anchor`,
          arm: "left" as const,
          mass: 1.0,
          distance: 280,
          landFrame: scene.startFrame,
          label: "EQUILIBRIUM",
        },
        {
          id: `${actor.id}_right_impulse`,
          arm: "right" as const,
          mass: 3.2,
          distance: 280,
          landFrame: triggerFrame,
          label: "IMPULSE",
        },
      ];

      const left =
        resolvedLayout?.originAnchor === "center"
          ? (resolvedLayout?.x ?? 540) - beamWidth / 2
          : (resolvedLayout?.x ?? 130);
      const top = resolvedLayout?.y ?? 720;

      return (
        <div
          key={actor.id}
          className="absolute flex items-center justify-center pointer-events-none"
          style={{
            left,
            top,
            width: beamWidth,
            height: 120,
            zIndex: actor.zIndex ?? 15,
          }}
        >
          <KineticFulcrumBeam
            width={beamWidth}
            maxAngleDeg={maxAngle}
            loads={loads}
          />
        </div>
      );
    }

    // --- PRESENTER HOST ---
    if (geomType === "presenter_host") {
      const pose = (geometry as any).pose || "character.png";
      const baseHeight = (geometry as any).baseHeightPx || 1280;
      const position = (geometry as any).position || "right";

      const leftPos =
        position === "right"
          ? 380
          : position === "center"
          ? 100
          : 200;

      return (
        <div
          key={actor.id}
          className="absolute bottom-0 pointer-events-none select-none"
          style={{
            left: leftPos,
            zIndex: actor.zIndex ?? 20,
          }}
        >
          <Img
            src={staticFile(pose)}
            style={{
              height: baseHeight,
              objectFit: "contain",
              filter: "drop-shadow(0 25px 35px rgba(0,0,0,0.18))",
            }}
          />
        </div>
      );
    }

    // Default fallback container
    return (
      <div
        key={actor.id}
        className="absolute pointer-events-none"
        style={{
          left: resolvedLayout?.x ?? 100,
          top: resolvedLayout?.y ?? 500,
          width: resolvedLayout?.width ?? 400,
          height: resolvedLayout?.height ?? 300,
          zIndex: actor.zIndex ?? 5,
        }}
      />
    );
  };

  // 4. Render causal couplings
  const renderCausalCoupling = (coupling: CausalCoupling, scene: MotionSceneAST) => {
    const sourceActor = scene.actors.find((a) => a.id === coupling.sourceEvent.actorId);
    const targetActor = scene.actors.find((a) => a.id === coupling.targetReaction.actorId);

    const startX = sourceActor?.resolvedLayout?.x ?? 200;
    const startY = sourceActor?.resolvedLayout?.y ?? 600;
    const endX = targetActor?.resolvedLayout?.x ?? 800;
    const endY = targetActor?.resolvedLayout?.y ?? 800;

    return (
      <CausalActionCoupling
        key={coupling.couplingId}
        frame={frame}
        fps={fps}
        startX={startX}
        startY={startY}
        endX={endX}
        endY={endY}
        triggerFrame={coupling.sourceEvent.frame}
        propagationDurationFrames={coupling.propagationDelayFrames ?? 18}
        physicalLawLabel={coupling.physicalLaw}
      />
    );
  };

  // 5. Render kinetic typography annotations
  const renderAnnotation = (ann: StageAnnotation, scene: MotionSceneAST) => {
    const isActive =
      frame >= ann.startFrame && frame < ann.startFrame + ann.durationFrames;
    if (!isActive) return null;

    const framesSinceStart = Math.max(0, frame - ann.startFrame);
    const inSpring = spring({
      frame: framesSinceStart,
      fps,
      config: { damping: 14, stiffness: 150 },
    });

    const isMono = ann.font?.toLowerCase().includes("mono");
    const posX = ann.staticPlacement?.x ?? 540;
    const posY = ann.staticPlacement?.y ?? (ann.role === "hook_slam" ? 340 : 420);

    return (
      <div
        key={ann.annotationId}
        className="absolute flex items-center justify-center text-center pointer-events-none select-none"
        style={{
          left: posX,
          top: posY,
          transform: `translate(-50%, -50%) scale(${interpolate(inSpring, [0, 1], [0.85, 1])})`,
          opacity: Math.min(1, inSpring * 1.5),
          fontFamily: isMono ? "JetBrains Mono, monospace" : "Montserrat, sans-serif",
          fontWeight: 900,
          fontSize: ann.fontSizePx,
          color: ann.color || "#090d16",
          zIndex: 30,
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          maxWidth: 960,
        }}
      >
        {ann.text}
      </div>
    );
  };

  const safeBounds = ast.environment?.safeBounds || {
    top: 280,
    bottom: 1340,
    left: 80,
    right: 1000,
  };

  return (
    <OpenStageSurface
      groundColor={ast.environment?.groundColor ?? "#f8fafc"}
      lightingTheme={ast.environment?.lightingTheme ?? "clean_studio_radial"}
      gridTexture={ast.environment?.gridTexture ?? true}
      className={`absolute inset-0 ${className}`.trim()}
      style={style}
    >
      {/* 1. Universal Background Layer (if active) */}
      {activeBackgroundIntent &&
        activeBackgroundIntent.mode === "universal" &&
        activeBackgroundIntent.assetId && (
          <UniversalBackground
            assetId={activeBackgroundIntent.assetId as any}
            semanticRole={activeBackgroundIntent.semanticRole}
            cropStrategy={activeBackgroundIntent.cropStrategy as any}
            cropFocalPoint={activeBackgroundIntent.cropFocalPoint}
            motion={activeBackgroundIntent.motion as any}
            motionScaleDelta={activeBackgroundIntent.motionScaleDelta}
            opacity={activeBackgroundIntent.opacity ?? 1.0}
            dimmingOverlay={activeBackgroundIntent.dimmingOverlay}
            transitionIn={activeBackgroundIntent.transitionIn as any}
            sceneStartFrame={currentScene.startFrame}
            sceneDurationFrames={currentScene.endFrame - currentScene.startFrame}
          />
        )}

      {/* 2. Persistent World Memory (Scars, furrows, ghost baselines across scenes) */}
      <PersistentMemoryStage
        frame={frame}
        traces={ast.persistentWorldMemory || []}
      />

      {/* 3. Open-Canvas Mechanism Safe Stage */}
      {activeScenes.map((scene) => {
        if (sceneOverrides && sceneOverrides[scene.sceneId]) {
          return (
            <React.Fragment key={scene.sceneId}>
              {sceneOverrides[scene.sceneId](scene, frame)}
            </React.Fragment>
          );
        }

        return (
          <MechanismStage
            key={scene.sceneId}
            top={safeBounds.top}
            bottom={safeBounds.bottom}
          >
            {/* Physical Actors */}
            {scene.actors?.map((actor) => renderActor(actor, scene))}

            {/* Causal Force Couplings */}
            {scene.causalCouplings?.map((coupling) =>
              renderCausalCoupling(coupling, scene)
            )}

            {/* Kinetic Typography Annotations */}
            {scene.annotations?.map((ann) => renderAnnotation(ann, scene))}
          </MechanismStage>
        );
      })}

      {/* 4. Canvas Children / Bespoke Overlays */}
      {children}
    </OpenStageSurface>
  );
};
