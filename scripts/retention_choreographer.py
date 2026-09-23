#!/usr/bin/env python3
"""
🎬 RightMotion Retention Choreographer
======================================
Transforms shot directives, narrative intelligence, and word-level timestamps into a
sophisticated attention choreography and timeline design.

Core Creative Law:
  SIMPLE FRAME. RICH TIMELINE.
  "Keep the screen simple. Keep the timeline alive."

The Shot Director answers:
  WHAT should the viewer understand?
The Retention Choreographer answers:
  HOW should the viewer's attention behave while they understand it?

Key principles:
1. visualDensity != attentionIntensity
   A shot can have LOW visual complexity + HIGH attention intensity through anticipation,
   camera choreography, micro-events, sound accents, and payoffs.
2. Temporal Complexity over Spatial Clutter:
   1 object + many meaningful states > many objects + 1 simple state.
3. Micro-Events:
   Small meaningful events (nudges, accelerations, camera ticks, state mutations, snaps)
   that keep the timeline alive without cluttering the screen.
   Every micro-event must have a purpose (progression, anticipation, emphasis, causality,
   escalation, contrast, emotional change, reveal, punctuation).
4. Anticipation & Payoff:
   Meaningful setups must lead to anticipation, breath-holds, and clear payoffs.
5. Micro-Resets:
   Intentional cognitive refreshes (stillness, snap cuts, sound drops) to refresh attention.
6. Simultaneous Motion Budget:
   Primary moving system: 1, Secondary subtle motion: 0–1.
"""

import math
import re
from typing import Dict, Any, List, Optional, Tuple


class RetentionChoreographer:
    """
    Choreographs viewer attention, micro-events, temporal variation, and timeline dynamics.
    """

    def __init__(self, fps: int = 60):
        self.fps = fps

    def choreograph(
        self,
        shots: List[Dict[str, Any]],
        story_model: Any,
        creative_plan: Dict[str, Any],
        transcript: List[Dict[str, Any]],
        total_frames: int,
        niche: str = "self_improvement",
    ) -> Dict[str, Any]:
        """
        Main entry point:
        Enriches shots with an AttentionPlan and generates the clip's global attention curve.
        """
        # 1. Determine narrative and attention category
        curve_type, base_trajectory = self._determine_curve_type(story_model, niche)

        # 2. Build global attention curve with dynamic phases
        attention_curve = self._build_attention_curve(
            shots=shots,
            curve_type=curve_type,
            total_frames=total_frames,
            story_model=story_model,
        )

        # 3. Choreograph each shot's timeline
        num_shots = len(shots)
        enriched_shots = []

        for idx, shot in enumerate(shots):
            fr = shot.get("frameRange", [0, total_frames])
            shot_start, shot_end = fr[0], fr[1]
            shot_duration = max(1, shot_end - shot_start)
            role = self._extract_role(shot)
            pacing_mode = shot.get("pacingMode", "BUILD")
            primary_mech = shot.get("visualMechanism", {}).get("type", "mechanism")
            primary_idea = shot.get("primaryVisualIdea", shot.get("visualObjective", ""))

            # Extract words falling within this shot
            shot_words = self._filter_words_in_range(transcript, shot_start, shot_end)

            # Determine attention trajectory and intensity
            # Note: visualDensity != attentionIntensity!
            attention_intensity = self._derive_attention_intensity(
                role=role,
                pacing_mode=pacing_mode,
                idx=idx,
                num_shots=num_shots,
            )

            trajectory = self._derive_shot_trajectory(
                role=role,
                pacing_mode=pacing_mode,
                idx=idx,
                num_shots=num_shots,
                curve_type=curve_type,
            )

            initial_state = "IMMEDIATE" if idx == 0 else ("SETTLE" if pacing_mode in ("HOLD", "RELEASE") else "INTRODUCE")

            # Anticipation & Payoff
            anticipation, anticipation_window, breath_before_payoff = self._derive_anticipation(
                shot_start=shot_start,
                shot_end=shot_end,
                role=role,
                pacing_mode=pacing_mode,
                shot_words=shot_words,
            )

            payoff_frame = self._derive_payoff_frame(
                shot_start=shot_start,
                shot_end=shot_end,
                role=role,
                pacing_mode=pacing_mode,
                idx=idx,
                num_shots=num_shots,
            )

            movement_peak = self._derive_movement_peak(
                shot_start=shot_start,
                shot_end=shot_end,
                payoff_frame=payoff_frame,
                pacing_mode=pacing_mode,
            )

            # Visual Resets
            has_visual_reset, reset_frames = self._derive_visual_resets(
                shot_start=shot_start,
                shot_end=shot_end,
                idx=idx,
                num_shots=num_shots,
                pacing_mode=pacing_mode,
            )

            # Micro-Events generation
            micro_events = self._generate_micro_events(
                shot_start=shot_start,
                shot_end=shot_end,
                role=role,
                pacing_mode=pacing_mode,
                primary_mech=primary_mech,
                shot_words=shot_words,
                anticipation_window=anticipation_window,
                payoff_frame=payoff_frame,
                reset_frames=reset_frames,
            )

            # Camera Choreography (Micro vs Significant vs Large vs Static)
            camera_choreography = self._derive_camera_choreography(
                role=role,
                pacing_mode=pacing_mode,
                trajectory=trajectory,
                duration_frames=shot_duration,
                has_anticipation=anticipation,
            )

            # Sound Opportunities
            sound_opportunities = self._derive_sound_opportunities(
                micro_events=micro_events,
                anticipation=anticipation,
                payoff_frame=payoff_frame,
                reset_frames=reset_frames,
                pacing_mode=pacing_mode,
            )

            # Simultaneous Motion Budget (Primary: 1, Secondary: 0-1)
            simultaneous_budget = self._derive_simultaneous_motion_budget(role, pacing_mode)

            # Attention Plan object
            attention_plan = {
                "initialState": initial_state,
                "trajectory": trajectory,
                "attentionIntensity": attention_intensity,
                "anticipation": anticipation,
                "anticipationWindow": anticipation_window,
                "breathBeforePayoff": breath_before_payoff,
                "movementPeak": movement_peak,
                "payoffFrame": payoff_frame,
                "visualReset": has_visual_reset,
                "visualResetFrames": reset_frames,
                "microEvents": micro_events,
                "attentionReason": self._derive_attention_reason(role, trajectory, attention_intensity),
            }

            # Visual Complexity section (preserving density and adding motion budget)
            visual_complexity = {
                "density": shot.get("visualDensity", "LOW"),
                "componentBudget": shot.get("componentBudget", 1),
                "simultaneousMotionBudget": simultaneous_budget,
            }

            # Enrich the shot
            shot_copy = dict(shot)
            shot_copy["attentionPlan"] = attention_plan
            shot_copy["visualComplexity"] = visual_complexity
            shot_copy["cameraChoreography"] = camera_choreography
            shot_copy["soundOpportunities"] = sound_opportunities

            enriched_shots.append(shot_copy)

        return {
            "attentionCurve": attention_curve,
            "shots": enriched_shots,
        }

    def _determine_curve_type(self, story_model: Any, niche: str) -> Tuple[str, str]:
        """
        Selects a narrative attention curve pattern (Psychological, Mechanistic, Emotional, Provocative).
        """
        niche_lower = niche.lower()
        if niche_lower == "finance":
            return "MECHANISTIC_ESCALATION", "ESCALATING"
        elif niche_lower == "health":
            return "BIOLOGICAL_PROGRESSION", "RISING"

        # Check dynamics in story model
        dynamics = ""
        if hasattr(story_model, "stateModel"):
            dynamics = getattr(story_model.stateModel, "dynamics", "")
        elif isinstance(story_model, dict) and "stateModel" in story_model:
            dynamics = story_model["stateModel"].get("dynamics", "")

        dynamics_lower = str(dynamics).lower()
        if "erosion" in dynamics_lower or "strain" in dynamics_lower or "tension" in dynamics_lower:
            return "PSYCHOLOGICAL_TENSION", "WAVE"
        elif "breakthrough" in dynamics_lower or "epiphany" in dynamics_lower:
            return "PROVOCATION_RELEASE", "PUNCTUATED"
        elif "emotional" in dynamics_lower or "grief" in dynamics_lower or "sovereignty" in dynamics_lower:
            return "EMOTIONAL_REALIZATION", "RISING"

        return "PSYCHOLOGICAL_TENSION", "ESCALATING"

    def _build_attention_curve(
        self,
        shots: List[Dict[str, Any]],
        curve_type: str,
        total_frames: int,
        story_model: Any,
    ) -> Dict[str, Any]:
        """
        Constructs the macro attention curve across the entire duration.
        """
        phases = []
        num_shots = len(shots)

        for i, s in enumerate(shots):
            fr = s.get("frameRange", [0, total_frames])
            role = self._extract_role(s)
            pacing = s.get("pacingMode", "BUILD")

            phase_name = "ESTABLISH" if i == 0 else (
                "MAJOR_PAYOFF" if i == num_shots - 1 and pacing == "RELEASE" else (
                    "ESCALATE" if pacing in ("ACCELERATE", "IMPACT") else "BUILD"
                )
            )

            intensity_val = 0.85 if i == 0 else (0.65 if phase_name == "BUILD" else (0.95 if phase_name in ("ESCALATE", "MAJOR_PAYOFF") else 0.5))

            phases.append({
                "shotId": s.get("shotId", f"shot_{i+1}"),
                "phase": phase_name,
                "frameRange": fr,
                "attentionIntensity": "HIGH" if intensity_val > 0.8 else ("MEDIUM" if intensity_val > 0.6 else "LOW"),
                "numericalIntensity": intensity_val,
                "rhythmDescription": f"[{pacing}] Narrative beat driving {role}",
            })

        return {
            "curveType": curve_type,
            "overallContrastRatio": "HIGH_DYNAMIC_RANGE",
            "phases": phases,
            "philosophy": (
                "SIMPLE FRAME, RICH TIMELINE: Keep the screen simple. Keep the timeline alive. "
                "Contrast between quiet observation, rising anticipation, sharp micro-events, and decisive payoff."
            ),
        }

    def _extract_role(self, shot: Dict[str, Any]) -> str:
        shot_id = shot.get("shotId", "").lower()
        if "hook" in shot_id:
            return "hook"
        elif "mechanism" in shot_id:
            return "mechanism"
        elif "escalation" in shot_id:
            return "escalation"
        elif "contradiction" in shot_id:
            return "contradiction"
        elif "resolution" in shot_id:
            return "resolution"
        return "scene"

    def _filter_words_in_range(
        self, transcript: List[Dict[str, Any]], start_frame: int, end_frame: int
    ) -> List[Dict[str, Any]]:
        words_in_range = []
        for w in transcript:
            start_raw = w.get("startMs", w.get("start", 0))
            if start_raw < 500:
                s_ms = start_raw * 1000.0
            else:
                s_ms = float(start_raw)
            wf = max(0, int(round((s_ms / 1000.0) * self.fps)))
            if start_frame <= wf < end_frame:
                words_in_range.append({
                    "word": w.get("word", ""),
                    "frame": wf,
                })
        return words_in_range

    def _derive_attention_intensity(
        self, role: str, pacing_mode: str, idx: int, num_shots: int
    ) -> str:
        """
        Derives attention intensity. Note: visualDensity != attentionIntensity!
        A shot with LOW visual density can have HIGH attention intensity due to tension.
        """
        if role == "hook" or idx == 0:
            return "HIGH"  # Hook must seize attention immediately
        if pacing_mode in ("IMPACT", "ACCELERATE"):
            return "SPIKE"
        if role in ("mechanism", "escalation"):
            return "HIGH"  # Mechanism creates intellectual tension
        if pacing_mode == "HOLD":
            return "MEDIUM"  # Intentional hold: stillness with intense focus
        if pacing_mode == "RELEASE":
            return "LOW"  # Grounding, sovereign release
        return "MEDIUM"

    def _derive_shot_trajectory(
        self, role: str, pacing_mode: str, idx: int, num_shots: int, curve_type: str
    ) -> str:
        if idx == 0:
            return "PUNCTUATED"  # Hook punches then settles
        if idx == num_shots - 1:
            return "FALLING" if pacing_mode == "RELEASE" else "PUNCTUATED"
        if pacing_mode in ("ACCELERATE", "IMPACT"):
            return "ESCALATING"
        if pacing_mode == "BUILD":
            return "RISING"
        if pacing_mode == "HOLD":
            return "STABLE"
        return "WAVE"

    def _derive_anticipation(
        self,
        shot_start: int,
        shot_end: int,
        role: str,
        pacing_mode: str,
        shot_words: List[Dict[str, Any]],
    ) -> Tuple[bool, Optional[List[int]], bool]:
        """
        Calculates anticipation window: a deliberate pre-event slow-in, hold, or rising cue.
        """
        dur = shot_end - shot_start
        if dur < 60:
            return False, None, False

        # Mechanism and Escalation are prime anticipation candidates
        if role in ("mechanism", "escalation") or pacing_mode in ("BUILD", "ACCELERATE", "IMPACT"):
            anticipation_start = max(shot_start + 30, shot_end - 40)
            anticipation_end = max(anticipation_start + 10, shot_end - 12)
            breath_before_payoff = True
            return True, [anticipation_start, anticipation_end], breath_before_payoff

        return False, None, False

    def _derive_payoff_frame(
        self, shot_start: int, shot_end: int, role: str, pacing_mode: str, idx: int, num_shots: int
    ) -> Optional[int]:
        dur = shot_end - shot_start
        if dur < 30:
            return None

        if pacing_mode in ("IMPACT", "ACCELERATE") or role in ("mechanism", "escalation"):
            return shot_end - 10
        elif role == "resolution":
            return shot_start + int(round(dur * 0.4))
        elif role == "hook":
            return shot_start + min(75, int(round(dur * 0.7)))

        return shot_end - 15

    def _derive_movement_peak(
        self, shot_start: int, shot_end: int, payoff_frame: Optional[int], pacing_mode: str
    ) -> int:
        if payoff_frame:
            return max(shot_start, payoff_frame - 5)
        return shot_start + int(round((shot_end - shot_start) * 0.6))

    def _derive_visual_resets(
        self, shot_start: int, shot_end: int, idx: int, num_shots: int, pacing_mode: str
    ) -> Tuple[bool, List[int]]:
        """
        Calculates intentional visual resets to prevent visual fatigue.
        """
        dur = shot_end - shot_start
        resets = []

        if idx > 0 and pacing_mode in ("HOLD", "RELEASE", "BUILD"):
            resets.append(shot_start)

        if dur > 240:
            mid_reset = shot_start + int(round(dur * 0.5))
            resets.append(mid_reset)

        return len(resets) > 0, resets

    def _generate_micro_events(
        self,
        shot_start: int,
        shot_end: int,
        role: str,
        pacing_mode: str,
        primary_mech: str,
        shot_words: List[Dict[str, Any]],
        anticipation_window: Optional[List[int]],
        payoff_frame: Optional[int],
        reset_frames: List[int],
    ) -> List[Dict[str, Any]]:
        """
        Generates small, purposeful temporal events across the timeline.
        Every micro-event MUST communicate a specific reason.
        """
        events = []
        dur = shot_end - shot_start

        # 1. Entrance / Hook Micro-Event
        if role == "hook":
            events.append({
                "frame": shot_start,
                "type": "CAMERA_PUNCH",
                "reason": "emphasis",
                "target": "Hero Subject",
                "description": "Crisp intimate scale punch-in (baseHeight: 1280px) establishing immediate connection.",
            })
            events.append({
                "frame": shot_start + 25,
                "type": "PARTIAL_REVEAL",
                "reason": "progression",
                "target": "Hero Card",
                "description": "Scene illustration emerges cleanly alongside Judy presenter.",
            })
            if dur > 60:
                events.append({
                    "frame": shot_start + 55,
                    "type": "HIGHLIGHT",
                    "reason": "anticipation",
                    "target": "Core Paradox Keyword",
                    "description": "Subtle luminance shift on primary concept anchor.",
                })

        # 2. Mechanism Micro-Events (Temporal complexity: one object, many states)
        elif role in ("mechanism", "escalation"):
            events.append({
                "frame": shot_start + 10,
                "type": "CAMERA_SETTLE",
                "reason": "progression",
                "target": "Physical Mechanism Ground",
                "description": "Camera locks into clean mechanical axis; negative space isolates subject.",
            })

            if shot_words:
                mid_words = shot_words[1:-1] if len(shot_words) > 2 else shot_words
                step_count = min(3, max(1, len(mid_words)))
                stride = max(1, len(mid_words) // step_count)
                for step_idx in range(step_count):
                    w_obj = mid_words[min(len(mid_words) - 1, step_idx * stride)]
                    wf = w_obj["frame"]
                    events.append({
                        "frame": wf,
                        "type": "TINY_DEFORMATION" if step_idx == 0 else "STATE_MUTATION",
                        "reason": "causality",
                        "target": "Physical Mechanism",
                        "description": f"Auditory impulse on \"{w_obj['word']}\" triggers progressive physical deflection.",
                    })

            if anticipation_window:
                events.append({
                    "frame": anticipation_window[0],
                    "type": "ANTICIPATION_PAUSE",
                    "reason": "anticipation",
                    "target": "System Dynamic",
                    "description": "Kinetic velocity briefly decelerates; tension tightens before threshold crossing.",
                })

            if payoff_frame:
                events.append({
                    "frame": payoff_frame,
                    "type": "SHAPE_SNAP",
                    "reason": "escalation" if role == "escalation" else "punctuation",
                    "target": "Primary Subject",
                    "description": "Mechanical state achieves decisive threshold: fracture, permanent groove, or deflection snap.",
                })

        # 3. Resolution Micro-Events (Clarity & Release)
        elif role == "resolution":
            events.append({
                "frame": shot_start + 12,
                "type": "VISUAL_RESET",
                "reason": "contrast",
                "target": "Canvas Environment",
                "description": "Previous strain instantly clears; composition snaps to open sovereign negative space.",
            })
            if payoff_frame and payoff_frame > shot_start + 15:
                events.append({
                    "frame": payoff_frame,
                    "type": "HIGHLIGHT",
                    "reason": "reveal",
                    "target": "Resolution Anchor",
                    "description": "Clean rim glow illuminates re-stabilized baseline state.",
                })
            events.append({
                "frame": max(shot_start + 45, shot_end - 25),
                "type": "CAMERA_SETTLE",
                "reason": "emotional_change",
                "target": "Master Frame",
                "description": "Camera motion gently slows to zero drift; lingering visual peace.",
            })

        # Generic fallback for unmapped shots
        else:
            events.append({
                "frame": shot_start + 15,
                "type": "OBJECT_NUDGE",
                "reason": "progression",
                "target": "Primary Subject",
                "description": "Intentional subtle spring settle.",
            })

        events.sort(key=lambda e: e["frame"])
        return events

    def _derive_camera_choreography(
        self,
        role: str,
        pacing_mode: str,
        trajectory: str,
        duration_frames: int,
        has_anticipation: bool,
    ) -> Dict[str, Any]:
        """
        Choreographs camera movement. Restrained: camera movement is meaning, not decoration.
        """
        if role == "hook":
            return {
                "mode": "SIGNIFICANT_MOVEMENT",
                "motionRole": "push_pressure",
                "movement": "Intimate waist-up push (scale 1.0 -> 1.05) over hook delivery",
                "rationale": "Draws mobile viewer into host conversation instantly.",
            }
        elif pacing_mode == "HOLD":
            return {
                "mode": "STATIC_HOLD",
                "motionRole": "static_focus",
                "movement": "Zero camera movement (locked tripod)",
                "rationale": "Static hold gives cognitive breathing room to absorb the concept.",
            }
        elif role in ("mechanism", "escalation"):
            return {
                "mode": "MICRO_MOVEMENT",
                "motionRole": "push_pressure" if trajectory == "ESCALATING" else "drift",
                "movement": "Subtle 2% forward drift tracking mechanical strain",
                "rationale": "Increases cognitive tension without competing with the physical mechanism.",
            }
        elif role == "resolution":
            return {
                "mode": "MICRO_MOVEMENT",
                "motionRole": "settle_realization",
                "movement": "Gentle 1.5% pull-back revealing spacious negative space",
                "rationale": "Creates emotional relief and sovereign grounding.",
            }

        return {
            "mode": "MICRO_MOVEMENT",
            "motionRole": "drift",
            "movement": "Subtle 1% linear drift",
            "rationale": "Subtle life without competing with primary subject.",
        }

    def _derive_sound_opportunities(
        self,
        micro_events: List[Dict[str, Any]],
        anticipation: bool,
        payoff_frame: Optional[int],
        reset_frames: List[int],
        pacing_mode: str,
    ) -> List[Dict[str, Any]]:
        """
        Identifies exact audio punctuation opportunities that support attention choreography.
        """
        cues = []
        for ev in micro_events:
            ev_type = ev["type"]
            f = ev["frame"]
            if ev_type in ("SHAPE_SNAP", "TINY_DEFORMATION"):
                cues.append({
                    "frame": f,
                    "type": "impact",
                    "soundRole": "crisp_mechanical_hit",
                    "description": "Short, precise tactile click/impact reinforcing physical change.",
                })
            elif ev_type == "ANTICIPATION_PAUSE":
                cues.append({
                    "frame": f,
                    "type": "riser",
                    "soundRole": "subtle_tension_riser",
                    "description": "Low, subtle rising tone before the payoff beat.",
                })
            elif ev_type == "VISUAL_RESET":
                cues.append({
                    "frame": f,
                    "type": "drop",
                    "soundRole": "audio_breather_drop",
                    "description": "Subtle atmospheric drop signaling cognitive reset.",
                })
            elif ev_type == "HIGHLIGHT":
                cues.append({
                    "frame": f,
                    "type": "accent",
                    "soundRole": "chime_accent",
                    "description": "High-frequency subtle glass or ping accent.",
                })

        return cues

    def _derive_simultaneous_motion_budget(self, role: str, pacing_mode: str) -> int:
        """
        Simultaneous motion budget:
        Guidance: 1 primary moving system, 0-1 secondary subtle motion.
        """
        if pacing_mode in ("HOLD", "RELEASE"):
            return 1
        return 2

    def _derive_attention_reason(self, role: str, trajectory: str, intensity: str) -> str:
        if role == "hook":
            return "Seizes high mobile attention in first 2.5s with hero illustration & intimate host framing."
        elif role in ("mechanism", "escalation"):
            return "Maintains intellectual curiosity through progressive structural deformation and micro-events."
        elif role == "resolution":
            return "Delivers cognitive satisfaction and calm closure through expansive negative space."
        return "Balances viewer stimulation with conceptual clarity."
