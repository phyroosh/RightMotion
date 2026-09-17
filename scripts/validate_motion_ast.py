#!/usr/bin/env python3
"""
🎬 RightMotion — Motion AST Semantic Validator
Location: scripts/validate_motion_ast.py

Authoritative validator for MotionStageAST intermediate representation.
Validates structural schema integrity AND deep semantic invariants:
  1. Structural Schema Conformance (MotionStageAST specification)
  2. Entity Referencing (mutations, forces, causal couplings, persistent traces)
  3. Irreversible Mutations & Narrative Memory Traces
  4. Frame Ranges & Temporal Ordering
  5. Platform Safe Bounds Enforcement (x: 80-1000, y: 280-1340)
  6. Anti-Cardification Invariant (No UI container substituting for a visual mechanism)
  7. Preservation of Semantic Intent Fields (semanticRole, stateBefore, stateAfter, physicalRationale)
  8. Extensibility Support (custom geometries, custom forces, custom mutations)
"""

import argparse
import json
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict, List, Optional, Set, Tuple

# Banned UI container keywords in semantic roles or geometry types
BANNED_CONTAINER_ROLES = {
    "ui_card",
    "info_card",
    "data_card",
    "dashboard_panel",
    "list_card",
    "stat_panel",
    "metric_card",
    "content_box",
}

BANNED_GEOMETRY_TYPES = {
    "card",
    "panel",
    "dashboard",
    "ui_container",
    "card_box",
}

GENERIC_DISALLOWED_ROLES = {
    "actor",
    "item",
    "box",
    "object",
    "element",
    "thing",
    "container",
}


@dataclass
class ValidationError:
    code: str
    message: str
    path: str
    severity: str = "ERROR"  # "ERROR" or "WARNING"


@dataclass
class ValidationResult:
    is_valid: bool
    errors: List[ValidationError] = field(default_factory=list)
    warnings: List[ValidationError] = field(default_factory=list)

    def add_error(self, code: str, message: str, path: str):
        self.errors.append(ValidationError(code=code, message=message, path=path, severity="ERROR"))
        self.is_valid = False

    def add_warning(self, code: str, message: str, path: str):
        self.warnings.append(ValidationError(code=code, message=message, path=path, severity="WARNING"))


class MotionASTValidator:
    """Validates MotionStageAST against structural rules and semantic invariants."""

    def __init__(self, ast_data: Dict[str, Any]):
        self.ast = ast_data
        self.result = ValidationResult(is_valid=True)
        self.actor_registry: Dict[str, Dict[str, Any]] = {}  # actorId -> actorDict
        self.persistent_actor_ids: Set[str] = set()
        self.scene_ids: Set[str] = set()
        self.persistent_trace_ids: Set[str] = set()

    def validate(self) -> ValidationResult:
        self._validate_root_structure()
        if not self.result.is_valid and any(e.code == "ROOT_TYPE_ERROR" for e in self.result.errors):
            return self.result

        self._validate_environment()
        self._index_scenes_and_actors()
        self._validate_persistent_world_memory()
        self._validate_scenes()
        return self.result

    def _validate_root_structure(self):
        if not isinstance(self.ast, dict):
            self.result.add_error("ROOT_TYPE_ERROR", "Motion AST must be a JSON object", "root")
            return

        required_root_fields = ["version", "clipId", "fps", "totalFrames", "environment", "scenes"]
        for field_name in required_root_fields:
            if field_name not in self.ast:
                self.result.add_error("MISSING_ROOT_FIELD", f"Missing required root field: '{field_name}'", f"root.{field_name}")

        fps = self.ast.get("fps")
        if fps is not None and (not isinstance(fps, (int, float)) or fps <= 0):
            self.result.add_error("INVALID_FPS", f"fps must be a positive number, got {fps}", "root.fps")

        total_frames = self.ast.get("totalFrames")
        if total_frames is not None and (not isinstance(total_frames, int) or total_frames <= 0):
            self.result.add_error("INVALID_TOTAL_FRAMES", f"totalFrames must be a positive integer, got {total_frames}", "root.totalFrames")

    def _validate_environment(self):
        env = self.ast.get("environment")
        if not isinstance(env, dict):
            self.result.add_error("INVALID_ENVIRONMENT", "environment must be a dictionary", "root.environment")
            return

        for f in ["groundColor", "lightingTheme", "safeBounds"]:
            if f not in env:
                self.result.add_error("MISSING_ENV_FIELD", f"environment missing required field '{f}'", f"root.environment.{f}")

        bounds = env.get("safeBounds")
        if isinstance(bounds, dict):
            for b in ["top", "bottom", "left", "right"]:
                if b not in bounds or not isinstance(bounds[b], (int, float)):
                    self.result.add_error("INVALID_SAFE_BOUNDS", f"safeBounds missing or invalid numeric key: '{b}'", f"root.environment.safeBounds.{b}")
            if "top" in bounds and "bottom" in bounds and bounds["top"] >= bounds["bottom"]:
                self.result.add_error("INVALID_BOUNDS_RANGE", f"safeBounds top ({bounds['top']}) must be < bottom ({bounds['bottom']})", "root.environment.safeBounds")
            if "left" in bounds and "right" in bounds and bounds["left"] >= bounds["right"]:
                self.result.add_error("INVALID_BOUNDS_RANGE", f"safeBounds left ({bounds['left']}) must be < right ({bounds['right']})", "root.environment.safeBounds")
        else:
            self.result.add_error("INVALID_SAFE_BOUNDS", "safeBounds must be a dictionary", "root.environment.safeBounds")

        default_bg = env.get("defaultBackgroundIntent")
        if default_bg is not None:
            self._validate_background_intent(default_bg, "root.environment.defaultBackgroundIntent")

    def _index_scenes_and_actors(self):
        scenes = self.ast.get("scenes")
        if not isinstance(scenes, list) or len(scenes) == 0:
            self.result.add_error("EMPTY_SCENES", "scenes must be a non-empty list of scene objects", "root.scenes")
            return

        for idx, scene in enumerate(scenes):
            if not isinstance(scene, dict):
                self.result.add_error("INVALID_SCENE", f"scene at index {idx} must be a dictionary", f"root.scenes[{idx}]")
                continue
            scene_id = scene.get("sceneId")
            if not scene_id or not isinstance(scene_id, str):
                self.result.add_error("INVALID_SCENE_ID", f"scene at index {idx} missing valid sceneId", f"root.scenes[{idx}].sceneId")
            elif scene_id in self.scene_ids:
                self.result.add_error("DUPLICATE_SCENE_ID", f"Duplicate sceneId '{scene_id}' detected", f"root.scenes[{idx}].sceneId")
            else:
                self.scene_ids.add(scene_id)

            actors = scene.get("actors", [])
            if isinstance(actors, list):
                for a_idx, actor in enumerate(actors):
                    if isinstance(actor, dict):
                        a_id = actor.get("id")
                        if a_id and isinstance(a_id, str):
                            self.actor_registry[a_id] = actor
                            if actor.get("isPersistent", False):
                                self.persistent_actor_ids.add(a_id)

    def _validate_persistent_world_memory(self):
        pwm = self.ast.get("persistentWorldMemory", [])
        if not isinstance(pwm, list):
            self.result.add_error("INVALID_PWM", "persistentWorldMemory must be a list", "root.persistentWorldMemory")
            return

        for idx, trace in enumerate(pwm):
            path = f"root.persistentWorldMemory[{idx}]"
            if not isinstance(trace, dict):
                self.result.add_error("INVALID_TRACE", "Trace must be a dictionary", path)
                continue

            trace_id = trace.get("traceId")
            if not trace_id or not isinstance(trace_id, str):
                self.result.add_error("MISSING_TRACE_ID", "Trace missing valid traceId", f"{path}.traceId")
            else:
                self.persistent_trace_ids.add(trace_id)

            origin_actor = trace.get("originatingActorId")
            if not origin_actor or origin_actor not in self.actor_registry:
                self.result.add_error(
                    "INVALID_TRACE_ORIGIN_ACTOR",
                    f"persistentTrace references unknown originatingActorId '{origin_actor}'",
                    f"{path}.originatingActorId",
                )

            origin_scene = trace.get("originatingSceneId")
            if not origin_scene or origin_scene not in self.scene_ids:
                self.result.add_error(
                    "INVALID_TRACE_ORIGIN_SCENE",
                    f"persistentTrace references unknown originatingSceneId '{origin_scene}'",
                    f"{path}.originatingSceneId",
                )

            # Semantic Intent preservation: semanticMeaning required
            meaning = trace.get("semanticMeaning")
            if not meaning or not isinstance(meaning, str) or len(meaning.strip()) < 5:
                self.result.add_error(
                    "MISSING_SEMANTIC_INTENT",
                    "persistentTrace must have a descriptive 'semanticMeaning' (min 5 chars)",
                    f"{path}.semanticMeaning",
                )

    def _validate_background_intent(self, intent: Dict[str, Any], path: str, scene: Optional[Dict[str, Any]] = None):
        if not isinstance(intent, dict):
            self.result.add_error("INVALID_BACKGROUND_INTENT", "backgroundIntent must be a dictionary", path)
            return

        mode = intent.get("mode")
        if mode not in ["universal", "solid_ground", "none"]:
            self.result.add_error(
                "INVALID_BACKGROUND_MODE",
                f"backgroundIntent mode must be 'universal', 'solid_ground', or 'none', got {mode}",
                f"{path}.mode",
            )
            return

        role = intent.get("semanticRole")
        if not role or not isinstance(role, str):
            self.result.add_error(
                "MISSING_SEMANTIC_INTENT",
                "backgroundIntent must specify a semanticRole",
                f"{path}.semanticRole",
            )
        elif role.lower() in ["background", "bg", "image", "texture", "thing", "container"]:
            self.result.add_error(
                "GENERIC_SEMANTIC_ROLE",
                f"backgroundIntent semanticRole '{role}' is too generic. Must describe creative role (e.g. 'cinematic_surface', 'tactile_stage')",
                f"{path}.semanticRole",
            )

        reason = intent.get("reason")
        if not reason or not isinstance(reason, str) or len(reason.strip()) < 5:
            self.result.add_error(
                "MISSING_SEMANTIC_INTENT",
                "backgroundIntent must have an explanatory 'reason' field (min 5 chars)",
                f"{path}.reason",
            )

        if mode == "universal":
            asset_id = intent.get("assetId")
            if not asset_id or not isinstance(asset_id, str):
                self.result.add_error(
                    "MISSING_BACKGROUND_ASSET",
                    "backgroundIntent with mode='universal' requires a non-empty string assetId",
                    f"{path}.assetId",
                )

            opacity = intent.get("opacity", 1.0)
            if not isinstance(opacity, (int, float)) or not (0.0 <= opacity <= 1.0):
                self.result.add_error(
                    "INVALID_OPACITY",
                    f"backgroundIntent opacity must be between 0.0 and 1.0, got {opacity}",
                    f"{path}.opacity",
                )

            # Check transition bounds if scene provided
            if scene:
                scene_start = scene.get("startFrame", 0)
                scene_end = scene.get("endFrame", 10000)
                scene_dur = max(1, scene_end - scene_start)

                t_in = intent.get("transitionIn")
                if isinstance(t_in, dict):
                    dur = t_in.get("durationFrames")
                    if not isinstance(dur, int) or dur <= 0:
                        self.result.add_error(
                            "INVALID_TRANSITION_TIMING",
                            "transitionIn durationFrames must be positive integer",
                            f"{path}.transitionIn.durationFrames",
                        )
                    elif dur > scene_dur:
                        self.result.add_error(
                            "TRANSITION_EXCEEDS_SCENE",
                            f"transitionIn durationFrames ({dur}) exceeds scene duration ({scene_dur})",
                            f"{path}.transitionIn.durationFrames",
                        )

                t_out = intent.get("transitionOut")
                if isinstance(t_out, dict):
                    dur = t_out.get("durationFrames")
                    if not isinstance(dur, int) or dur <= 0:
                        self.result.add_error(
                            "INVALID_TRANSITION_TIMING",
                            "transitionOut durationFrames must be positive integer",
                            f"{path}.transitionOut.durationFrames",
                        )
                    elif dur > scene_dur:
                        self.result.add_error(
                            "TRANSITION_EXCEEDS_SCENE",
                            f"transitionOut durationFrames ({dur}) exceeds scene duration ({scene_dur})",
                            f"{path}.transitionOut.durationFrames",
                        )

    def _validate_scenes(self):
        scenes = self.ast.get("scenes", [])
        total_frames = self.ast.get("totalFrames", 100000)
        env = self.ast.get("environment", {})
        safe_bounds = env.get("safeBounds", {"top": 280, "bottom": 1340, "left": 80, "right": 1000})

        last_end_frame = 0
        active_persistent_actors: Dict[str, Dict[str, Any]] = {}

        for s_idx, scene in enumerate(scenes):
            if not isinstance(scene, dict):
                continue
            scene_id = scene.get("sceneId", f"scene_{s_idx}")
            path = f"root.scenes[{s_idx}]"

            # 1. Temporal Ordering & Frame Ranges
            start_frame = scene.get("startFrame")
            end_frame = scene.get("endFrame")

            if not isinstance(start_frame, int) or start_frame < 0:
                self.result.add_error("INVALID_FRAME_RANGE", f"Scene startFrame must be an integer >= 0, got {start_frame}", f"{path}.startFrame")
                start_frame = 0

            if not isinstance(end_frame, int) or end_frame <= start_frame:
                self.result.add_error("INVALID_FRAME_RANGE", f"Scene endFrame must be > startFrame ({start_frame}), got {end_frame}", f"{path}.endFrame")
                end_frame = start_frame + 1

            if end_frame > total_frames:
                self.result.add_error("FRAME_EXCEEDS_TOTAL", f"Scene endFrame ({end_frame}) exceeds totalFrames ({total_frames})", f"{path}.endFrame")

            if s_idx > 0 and start_frame < last_end_frame:
                self.result.add_error(
                    "SCENE_FRAME_OVERLAP",
                    f"Scene starts at {start_frame} before previous scene ended at {last_end_frame}",
                    f"{path}.startFrame",
                )
            last_end_frame = end_frame

            # 2. Narrative Goal (Semantic Intent)
            goal = scene.get("narrativeGoal")
            if not goal or not isinstance(goal, str) or len(goal.strip()) < 10:
                self.result.add_error(
                    "MISSING_SEMANTIC_INTENT",
                    "Scene must have a descriptive 'narrativeGoal' (min 10 chars)",
                    f"{path}.narrativeGoal",
                )

            # 3. Background Intent (Universal Background Intelligence)
            bg_intent = scene.get("backgroundIntent")
            if bg_intent is not None:
                self._validate_background_intent(bg_intent, f"{path}.backgroundIntent", scene)

            # Build in-scene entities
            local_actors = scene.get("actors", [])
            in_scene_actor_ids: Set[str] = set()
            local_actors_by_id: Dict[str, Dict[str, Any]] = {}

            # Add persistent actors carried over from prior scenes
            all_accessible_actors: Dict[str, Dict[str, Any]] = dict(active_persistent_actors)

            if isinstance(local_actors, list):
                for a_idx, actor in enumerate(local_actors):
                    if not isinstance(actor, dict):
                        continue
                    a_id = actor.get("id")
                    if a_id:
                        if a_id in in_scene_actor_ids:
                            self.result.add_error("DUPLICATE_ACTOR_ID", f"Duplicate actor id '{a_id}' in scene '{scene_id}'", f"{path}.actors[{a_idx}].id")
                        in_scene_actor_ids.add(a_id)
                        local_actors_by_id[a_id] = actor
                        all_accessible_actors[a_id] = actor

                    self._validate_actor(actor, f"{path}.actors[{a_idx}]", scene, safe_bounds)

            # Index annotations
            annotations = scene.get("annotations", [])
            in_scene_annotation_ids: Set[str] = set()
            if isinstance(annotations, list):
                for ann_idx, ann in enumerate(annotations):
                    if isinstance(ann, dict):
                        ann_id = ann.get("annotationId")
                        if ann_id:
                            in_scene_annotation_ids.add(ann_id)
                        self._validate_annotation(ann, f"{path}.annotations[{ann_idx}]", scene, all_accessible_actors, safe_bounds)

            # Index forces
            forces = scene.get("forces", [])
            in_scene_force_ids: Set[str] = set()
            if isinstance(forces, list):
                for f_idx, force in enumerate(forces):
                    if isinstance(force, dict):
                        f_id = force.get("forceId")
                        if f_id:
                            in_scene_force_ids.add(f_id)
                        self._validate_force(force, f"{path}.forces[{f_idx}]", scene, all_accessible_actors)

            # Index mutations
            mutations = scene.get("mutations", [])
            in_scene_mutation_ids: Set[str] = set()
            if isinstance(mutations, list):
                for m_idx, mut in enumerate(mutations):
                    if isinstance(mut, dict):
                        m_id = mut.get("mutationId")
                        if m_id:
                            in_scene_mutation_ids.add(m_id)
                        self._validate_mutation(
                            mut,
                            f"{path}.mutations[{m_idx}]",
                            scene,
                            all_accessible_actors,
                            in_scene_annotation_ids,
                        )

            # Validate causal couplings
            couplings = scene.get("causalCouplings", [])
            if isinstance(couplings, list):
                for c_idx, coup in enumerate(couplings):
                    if isinstance(coup, dict):
                        self._validate_causal_coupling(
                            coup,
                            f"{path}.causalCouplings[{c_idx}]",
                            scene,
                            all_accessible_actors,
                            in_scene_annotation_ids,
                            in_scene_force_ids,
                            in_scene_mutation_ids,
                        )

            # Update persistent actors for next scenes
            for a_id, actor in local_actors_by_id.items():
                if actor.get("isPersistent", False):
                    active_persistent_actors[a_id] = actor

    def _validate_actor(self, actor: Dict[str, Any], path: str, scene: Dict[str, Any], safe_bounds: Dict[str, Any]):
        actor_id = actor.get("id")
        if not actor_id or not isinstance(actor_id, str):
            self.result.add_error("INVALID_ACTOR_ID", "Actor must have a non-empty string 'id'", f"{path}.id")

        # Semantic Role validation (Preservation of Semantic Intent)
        role = actor.get("semanticRole")
        if not role or not isinstance(role, str) or len(role.strip()) < 3:
            self.result.add_error(
                "MISSING_SEMANTIC_INTENT",
                f"Actor '{actor_id}' must have a descriptive 'semanticRole' (min 3 chars)",
                f"{path}.semanticRole",
            )
        elif role.lower().strip() in GENERIC_DISALLOWED_ROLES:
            self.result.add_error(
                "GENERIC_SEMANTIC_ROLE",
                f"Actor '{actor_id}' has generic role '{role}'. Roles must be narrative-specific.",
                f"{path}.semanticRole",
            )

        # Anti-Cardification Invariant
        scene_role = scene.get("role", "")
        is_hook = scene_role == "hook" or scene.get("startFrame", 0) <= 75

        # Check banned container roles
        if role and any(banned in role.lower() for banned in BANNED_CONTAINER_ROLES):
            if not (is_hook and "hook" in role.lower()):
                self.result.add_error(
                    "CARDIFICATION_VIOLATION",
                    f"Actor '{actor_id}' uses banned container role '{role}'. UI containers may not substitute for visual mechanisms.",
                    f"{path}.semanticRole",
                )

        # Geometry validation
        geom = actor.get("geometry")
        if not isinstance(geom, dict) or "type" not in geom:
            self.result.add_error("INVALID_GEOMETRY", f"Actor '{actor_id}' geometry must be an object with 'type'", f"{path}.geometry")
        else:
            geom_type = geom.get("type", "")
            if geom_type in BANNED_GEOMETRY_TYPES:
                self.result.add_error(
                    "CARDIFICATION_VIOLATION",
                    f"Actor '{actor_id}' uses banned geometry type '{geom_type}'. RightMotion prohibits generic card/panel containers.",
                    f"{path}.geometry.type",
                )
            elif geom_type == "custom_geometry":
                # Extensibility check
                if "geometryName" not in geom or not geom["geometryName"]:
                    self.result.add_error("INVALID_CUSTOM_GEOMETRY", "custom_geometry must provide 'geometryName'", f"{path}.geometry.geometryName")
                if "parameters" not in geom or not isinstance(geom["parameters"], dict):
                    self.result.add_error("INVALID_CUSTOM_GEOMETRY", "custom_geometry must provide 'parameters' dictionary", f"{path}.geometry.parameters")

        # Resolved Layout & Platform Safe Bounds
        layout = actor.get("resolvedLayout")
        if not isinstance(layout, dict):
            self.result.add_error("MISSING_RESOLVED_LAYOUT", f"Actor '{actor_id}' missing 'resolvedLayout'", f"{path}.resolvedLayout")
            return

        for k in ["x", "y", "width", "height"]:
            if k not in layout or not isinstance(layout[k], (int, float)):
                self.result.add_error("INVALID_LAYOUT_FIELD", f"Actor '{actor_id}' layout missing numeric '{k}'", f"{path}.resolvedLayout.{k}")

        importance = actor.get("narrativeImportance", "SECONDARY")
        if importance not in ["HERO", "SECONDARY", "ENVIRONMENTAL"]:
            self.result.add_error("INVALID_IMPORTANCE", f"narrativeImportance must be HERO, SECONDARY, or ENVIRONMENTAL, got {importance}", f"{path}.narrativeImportance")

        # Safe bounds enforcement for HERO & SECONDARY actors
        if importance in ["HERO", "SECONDARY"]:
            self._check_actor_safe_bounds(actor_id, geom, layout, safe_bounds, path)

    def _check_actor_safe_bounds(
        self,
        actor_id: str,
        geom: Optional[Dict[str, Any]],
        layout: Dict[str, Any],
        bounds: Dict[str, Any],
        path: str,
    ):
        x = layout.get("x", 0)
        y = layout.get("y", 0)
        w = layout.get("width", 0)
        h = layout.get("height", 0)
        anchor = layout.get("originAnchor", "center")
        geom_type = geom.get("type", "") if geom else ""

        left = bounds.get("left", 80)
        right = bounds.get("right", 1000)
        top = bounds.get("top", 280)
        bottom = bounds.get("bottom", 1340)

        # Tolerance for boundary lines spanning across screen
        tol = 60

        # Presenter host grounded at bottom bezel has special grounding semantics
        if geom_type == "presenter_host":
            if anchor == "bottom_center":
                # Presenter center x should be within safe area, waist-up body extends upwards
                if not (left - tol <= x <= right + tol):
                    self.result.add_error("SAFE_BOUNDS_VIOLATION", f"Presenter actor '{actor_id}' x={x} out of safe bounds [{left}, {right}]", f"{path}.resolvedLayout.x")
            return

        if anchor == "center":
            # Center coordinates must be within safe zone
            if not (left <= x <= right):
                self.result.add_error("SAFE_BOUNDS_VIOLATION", f"Hero actor '{actor_id}' center x={x} outside safe horizontal range [{left}, {right}]", f"{path}.resolvedLayout.x")
            if not (top - tol <= y <= bottom + tol):
                self.result.add_error("SAFE_BOUNDS_VIOLATION", f"Hero actor '{actor_id}' center y={y} outside safe vertical range [{top}, {bottom}]", f"{path}.resolvedLayout.y")
        elif anchor == "bottom_center":
            if not (left - tol <= x <= right + tol):
                self.result.add_error("SAFE_BOUNDS_VIOLATION", f"Actor '{actor_id}' x={x} outside safe bounds", f"{path}.resolvedLayout.x")

    def _validate_annotation(
        self,
        ann: Dict[str, Any],
        path: str,
        scene: Dict[str, Any],
        accessible_actors: Dict[str, Dict[str, Any]],
        safe_bounds: Dict[str, Any],
    ):
        ann_id = ann.get("annotationId")
        if not ann_id or not isinstance(ann_id, str):
            self.result.add_error("INVALID_ANNOTATION_ID", "Annotation must have non-empty string annotationId", f"{path}.annotationId")

        # Frame timing
        start_frame = ann.get("startFrame")
        duration = ann.get("durationFrames")
        scene_start = scene.get("startFrame", 0)
        scene_end = scene.get("endFrame", 100000)

        if not isinstance(start_frame, int) or start_frame < scene_start or start_frame >= scene_end:
            self.result.add_error(
                "INVALID_TIMING",
                f"Annotation '{ann_id}' startFrame {start_frame} outside scene range [{scene_start}, {scene_end}]",
                f"{path}.startFrame",
            )

        if not isinstance(duration, int) or duration <= 0:
            self.result.add_error("INVALID_TIMING", f"Annotation '{ann_id}' durationFrames must be > 0", f"{path}.durationFrames")

        # Attached actor reference check
        attached_id = ann.get("attachedToActorId")
        if attached_id:
            if attached_id not in accessible_actors:
                self.result.add_error(
                    "DANGLING_ACTOR_REFERENCE",
                    f"Annotation '{ann_id}' attachedToActorId references unknown actor '{attached_id}'",
                    f"{path}.attachedToActorId",
                )
        else:
            # Static placement safe bounds check
            pos = ann.get("staticPlacement")
            if isinstance(pos, dict):
                x = pos.get("x")
                y = pos.get("y")
                left = safe_bounds.get("left", 80)
                right = safe_bounds.get("right", 1000)
                top = safe_bounds.get("top", 280)
                bottom = safe_bounds.get("bottom", 1340)
                tol = 40

                if isinstance(x, (int, float)) and not (left - tol <= x <= right + tol):
                    self.result.add_error("SAFE_BOUNDS_VIOLATION", f"Annotation '{ann_id}' static x={x} outside safe bounds [{left}, {right}]", f"{path}.staticPlacement.x")
                if isinstance(y, (int, float)) and not (top - tol <= y <= bottom + tol):
                    self.result.add_error("SAFE_BOUNDS_VIOLATION", f"Annotation '{ann_id}' static y={y} outside safe bounds [{top}, {bottom}]", f"{path}.staticPlacement.y")

    def _validate_force(
        self,
        force: Dict[str, Any],
        path: str,
        scene: Dict[str, Any],
        accessible_actors: Dict[str, Dict[str, Any]],
    ):
        force_id = force.get("forceId")
        if not force_id or not isinstance(force_id, str):
            self.result.add_error("INVALID_FORCE_ID", "Force missing valid forceId", f"{path}.forceId")

        target_actor = force.get("targetActorId")
        if not target_actor or target_actor not in accessible_actors:
            self.result.add_error(
                "DANGLING_ACTOR_REFERENCE",
                f"Force '{force_id}' references non-existent targetActorId '{target_actor}'",
                f"{path}.targetActorId",
            )

        # Semantic intent preservation: semanticCause required
        cause = force.get("semanticCause")
        if not cause or not isinstance(cause, str) or len(cause.strip()) < 5:
            self.result.add_error(
                "MISSING_SEMANTIC_INTENT",
                f"Force '{force_id}' must specify 'semanticCause' (min 5 chars explaining WHY force acts)",
                f"{path}.semanticCause",
            )

        # Frame timing
        trigger = force.get("triggerFrame")
        duration = force.get("durationFrames")
        scene_start = scene.get("startFrame", 0)
        scene_end = scene.get("endFrame", 100000)

        if not isinstance(trigger, int) or trigger < scene_start or trigger >= scene_end:
            self.result.add_error(
                "INVALID_TIMING",
                f"Force '{force_id}' triggerFrame {trigger} outside scene [{scene_start}, {scene_end}]",
                f"{path}.triggerFrame",
            )

        if not isinstance(duration, int) or duration <= 0:
            self.result.add_error("INVALID_TIMING", f"Force '{force_id}' durationFrames must be > 0", f"{path}.durationFrames")

        # Extensibility: custom_force
        if force.get("type") == "custom_force":
            if "customParameters" in force and not isinstance(force["customParameters"], dict):
                self.result.add_error("INVALID_CUSTOM_FORCE", "customParameters must be a dictionary", f"{path}.customParameters")

    def _validate_mutation(
        self,
        mut: Dict[str, Any],
        path: str,
        scene: Dict[str, Any],
        accessible_actors: Dict[str, Dict[str, Any]],
        annotation_ids: Set[str],
    ):
        mut_id = mut.get("mutationId")
        if not mut_id or not isinstance(mut_id, str):
            self.result.add_error("INVALID_MUTATION_ID", "Mutation missing valid mutationId", f"{path}.mutationId")

        actor_id = mut.get("actorId")
        # Target can be an accessible actor OR an annotation (for text mutations like marker_slash)
        if not actor_id or (actor_id not in accessible_actors and actor_id not in annotation_ids):
            self.result.add_error(
                "DANGLING_ACTOR_REFERENCE",
                f"Mutation '{mut_id}' references unknown actorId/entity '{actor_id}'",
                f"{path}.actorId",
            )

        # Semantic Intent preservation
        for field_name in ["stateBefore", "stateAfter", "physicalRationale"]:
            val = mut.get(field_name)
            if not val or not isinstance(val, str) or len(val.strip()) < 3:
                self.result.add_error(
                    "MISSING_SEMANTIC_INTENT",
                    f"Mutation '{mut_id}' must provide descriptive '{field_name}'",
                    f"{path}.{field_name}",
                )

        # Timing
        trigger = mut.get("triggerFrame")
        duration = mut.get("durationFrames")
        scene_start = scene.get("startFrame", 0)
        scene_end = scene.get("endFrame", 100000)

        if not isinstance(trigger, int) or trigger < scene_start or trigger >= scene_end:
            self.result.add_error(
                "INVALID_TIMING",
                f"Mutation '{mut_id}' triggerFrame {trigger} outside scene [{scene_start}, {scene_end}]",
                f"{path}.triggerFrame",
            )

        if not isinstance(duration, int) or duration <= 0:
            self.result.add_error("INVALID_TIMING", f"Mutation '{mut_id}' durationFrames must be > 0", f"{path}.durationFrames")

        # Extensibility: custom_mutation
        if mut.get("type") == "custom_mutation":
            if "parameters" not in mut or not isinstance(mut["parameters"], dict):
                self.result.add_error("INVALID_CUSTOM_MUTATION", "custom_mutation must provide 'parameters' dictionary", f"{path}.parameters")

        # Irreversible Mutations & Narrative Memory Trace
        mut_type = mut.get("type", "")
        state_after = str(mut.get("stateAfter", "")).upper()
        is_irreversible = (
            "PERMANENT" in state_after
            or "RECALIBRATED" in state_after
            or "FRACTURE" in state_after
            or mut_type in ["viscoelastic_sag", "brittle_cleavage"]
        )

        if is_irreversible:
            # Must either define createsMemoryTrace or exist in persistentWorldMemory
            has_memory_trace = "createsMemoryTrace" in mut and isinstance(mut["createsMemoryTrace"], dict)
            has_world_trace = any(
                t.get("originatingActorId") == actor_id for t in self.ast.get("persistentWorldMemory", [])
            )
            if not has_memory_trace and not has_world_trace:
                self.result.add_error(
                    "MISSING_MEMORY_TRACE",
                    f"Irreversible mutation '{mut_id}' on '{actor_id}' (stateAfter: '{state_after}') must define createsMemoryTrace or register a persistent trace in persistentWorldMemory",
                    f"{path}.createsMemoryTrace",
                )

            if has_memory_trace:
                trace = mut["createsMemoryTrace"]
                t_id = trace.get("traceId")
                if not t_id:
                    self.result.add_error("INVALID_MEMORY_TRACE", "createsMemoryTrace must have traceId", f"{path}.createsMemoryTrace.traceId")
                if not trace.get("persistsUntilEnd", False):
                    self.result.add_warning("TRANSIENT_MEMORY_TRACE", "Memory trace should generally persistUntilEnd: true", f"{path}.createsMemoryTrace.persistsUntilEnd")

    def _validate_causal_coupling(
        self,
        coup: Dict[str, Any],
        path: str,
        scene: Dict[str, Any],
        accessible_actors: Dict[str, Dict[str, Any]],
        annotation_ids: Set[str],
        force_ids: Set[str],
        mutation_ids: Set[str],
    ):
        coup_id = coup.get("couplingId")
        if not coup_id or not isinstance(coup_id, str):
            self.result.add_error("INVALID_COUPLING_ID", "CausalCoupling missing valid couplingId", f"{path}.couplingId")

        # Source event entity check
        source = coup.get("sourceEvent")
        if not isinstance(source, dict):
            self.result.add_error("INVALID_COUPLING_SOURCE", "sourceEvent must be a dictionary", f"{path}.sourceEvent")
        else:
            s_actor = source.get("actorId")
            valid_source = (
                s_actor in accessible_actors
                or s_actor in annotation_ids
                or s_actor in self.persistent_trace_ids
            )
            if not s_actor or not valid_source:
                self.result.add_error(
                    "DANGLING_COUPLING_SOURCE",
                    f"Coupling '{coup_id}' sourceEvent references unknown entity '{s_actor}'",
                    f"{path}.sourceEvent.actorId",
                )

        # Target reaction entity check
        target = coup.get("targetReaction")
        if not isinstance(target, dict):
            self.result.add_error("INVALID_COUPLING_TARGET", "targetReaction must be a dictionary", f"{path}.targetReaction")
        else:
            t_actor = target.get("actorId")
            valid_target = (
                t_actor in accessible_actors
                or t_actor in annotation_ids
                or t_actor in self.persistent_trace_ids
            )
            if not t_actor or not valid_target:
                self.result.add_error(
                    "DANGLING_COUPLING_TARGET",
                    f"Coupling '{coup_id}' targetReaction references unknown entity '{t_actor}'",
                    f"{path}.targetReaction.actorId",
                )

            # Check triggered force or mutation reference if provided
            trig_force = target.get("triggeredForceId")
            if trig_force and trig_force not in force_ids:
                # May refer to a force triggered in current scene
                self.result.add_warning(
                    "UNREGISTERED_TRIGGERED_FORCE",
                    f"Coupling '{coup_id}' triggers force '{trig_force}' which is not registered in this scene's forces list",
                    f"{path}.targetReaction.triggeredForceId",
                )

        # Propagation delay
        delay = coup.get("propagationDelayFrames", 0)
        if not isinstance(delay, int) or delay < 0:
            self.result.add_error("INVALID_COUPLING_DELAY", f"propagationDelayFrames must be an integer >= 0, got {delay}", f"{path}.propagationDelayFrames")

        # Physical law (Semantic Intent preservation)
        law = coup.get("physicalLaw")
        if not law or not isinstance(law, str) or len(law.strip()) < 5:
            self.result.add_error(
                "MISSING_SEMANTIC_INTENT",
                f"CausalCoupling '{coup_id}' must specify 'physicalLaw' (min 5 chars)",
                f"{path}.physicalLaw",
            )


def validate_motion_ast(ast_data: Dict[str, Any]) -> ValidationResult:
    """Public functional validator entrypoint."""
    validator = MotionASTValidator(ast_data)
    return validator.validate()


def main():
    parser = argparse.ArgumentParser(description="Validate RightMotion MotionStageAST")
    parser.add_argument("--ast", type=str, required=True, help="Path to AST JSON file")
    parser.add_argument("--verbose", action="store_true", help="Print all warnings and detailed trace")
    args = parser.parse_args()

    ast_path = Path(args.ast)
    if not ast_path.exists():
        print(f"❌ Error: AST file not found: {ast_path}", file=sys.stderr)
        sys.exit(1)

    try:
        with open(ast_path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        print(f"❌ Error parsing JSON from {ast_path}: {e}", file=sys.stderr)
        sys.exit(1)

    result = validate_motion_ast(data)

    if result.is_valid:
        print(f"✅ PASS: Motion AST '{ast_path.name}' passed all structural and semantic invariants!")
        if args.verbose and result.warnings:
            for w in result.warnings:
                print(f"  ⚠️ WARNING [{w.code}] ({w.path}): {w.message}")
        sys.exit(0)
    else:
        print(f"❌ FAIL: Motion AST '{ast_path.name}' failed with {len(result.errors)} errors:", file=sys.stderr)
        for err in result.errors:
            print(f"  • [{err.code}] at {err.path}: {err.message}", file=sys.stderr)
        if args.verbose and result.warnings:
            for w in result.warnings:
                print(f"  ⚠️ WARNING [{w.code}] ({w.path}): {w.message}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
