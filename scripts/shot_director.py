#!/usr/bin/env python3
"""
🎬 RightMotion Shot Director
=============================
Transforms high-level narrative intelligence (NormalizedStoryModel), visual concept plans,
causal graphs, state models, and word-level transcript timings into a structured ShotDirective[].

The Shot Director answers:
  "WHAT should the audience SEE during this exact interval?"
  (Not: "Which React component should I use?")

Key principles:
1. Shots are semantic (establish, reveal, contrast, accumulate, compress, fracture, transform, resolve, hold).
2. Creative confidence is strictly tiered:
   - REQUIRED: Narrative purpose, visual objective, 5-question visual state change.
   - RECOMMENDED: Visual mechanism, composition mode, camera movement, transition motivation.
   - OPTIONAL: Suggested components (agent is free to invent or use better alternatives).
3. The 5 Core Visual State Questions are evaluated for every shot:
   - What exists at the beginning?
   - What happens?
   - What visibly changes?
   - What exists at the end?
   - Why does that change matter?
4. Creative hints, NOT rigid recipes (e.g. anxiety can be push-in, environmental compression, or spatial isolation).
5. Pacing modes: HOLD, OBSERVE, BUILD, ACCELERATE, IMPACT, RELEASE.
   (Breath holds are optional narrative pacing opportunities, NOT 14s rigid rules).
"""

import json
import re
from typing import Dict, Any, List, Optional, Tuple


class ShotDirector:
    """
    Compiles narrative segments, state models, and transcript timings into a cohesive ShotPlan.
    """

    def __init__(self, fps: int = 60):
        self.fps = fps

    @staticmethod
    def normalize_word_timing(word_obj: Dict[str, Any], fps: int = 60) -> Tuple[int, int]:
        """
        Normalizes various timestamp schemas (start/end, startMs/endMs) into exact frame numbers.
        """
        start_raw = word_obj.get("startMs")
        if start_raw is None:
            start_raw = word_obj.get("start", 0)
            if start_raw < 500:  # Seconds format (e.g. 1.25s)
                start_ms = start_raw * 1000.0
            else:
                start_ms = float(start_raw)
        else:
            start_ms = float(start_raw)

        end_raw = word_obj.get("endMs")
        if end_raw is None:
            end_raw = word_obj.get("end", start_ms / 1000.0 + 0.3)
            if end_raw < 500:
                end_ms = end_raw * 1000.0
            else:
                end_ms = float(end_raw)
        else:
            end_ms = float(end_raw)

        start_frame = max(0, int(round((start_ms / 1000.0) * fps)))
        end_frame = max(start_frame + 1, int(round((end_ms / 1000.0) * fps)))
        return start_frame, end_frame

    def decompose_shots(
        self,
        story_model: Any,
        creative_plan: Dict[str, Any],
        transcript: List[Dict[str, Any]],
        total_frames: int,
        niche: str = "self_improvement",
    ) -> List[Dict[str, Any]]:
        """
        Main entry point: Generates a list of ShotDirective dicts.
        """
        # 1. Extract story elements
        segments = []
        if hasattr(story_model, "segments"):
            for seg in story_model.segments:
                segments.append({
                    "segmentId": getattr(seg, "segmentId", ""),
                    "role": getattr(seg, "role", ""),
                    "narrationText": getattr(seg, "narrationText", ""),
                    "coreMeaning": getattr(seg, "coreMeaning", ""),
                    "visualQuestion": getattr(seg, "visualQuestion", ""),
                    "semanticWeight": getattr(seg, "semanticWeight", "IMPORTANT"),
                })
        elif isinstance(story_model, dict) and "segments" in story_model:
            segments = story_model["segments"]

        # 2. Extract visual concept
        vc = creative_plan.get("visualConcept", {}) if creative_plan else {}
        champ = vc.get("championCandidate", {})
        primary_mechanism = vc.get("primaryMechanism", "semantic_accumulation")
        concept_name = champ.get("conceptName", vc.get("conceptName", "Core Paradox"))
        physical_desc = champ.get("physicalDescription", "Physical transformation of state")
        visible_trans = champ.get("visibleTransformation", "State A visibly shifts to State B")
        visible_conseq = champ.get("visibleConsequence", "Residual consequence of the action")
        persistent_state = champ.get("persistentState", "Settled baseline state")

        # 3. Extract causal / state model
        state_model_dict = {}
        if hasattr(story_model, "stateModel"):
            sm = story_model.stateModel
            state_model_dict = {
                "initialState": getattr(sm, "initialState", ""),
                "finalState": getattr(sm, "finalState", ""),
                "dynamics": getattr(sm, "dynamics", ""),
            }
        elif isinstance(story_model, dict) and "stateModel" in story_model:
            state_model_dict = story_model["stateModel"]

        dynamics = state_model_dict.get("dynamics", "accumulation")

        # 4. Check for narrative breath-hold opportunity from temporal model
        temporal_dict = {}
        if hasattr(story_model, "temporalModel"):
            tm = story_model.temporalModel
            temporal_dict = {
                "pacing": getattr(tm, "pacing", "steady_build"),
                "breathHoldWindow": getattr(tm, "breathHoldWindow", {}),
            }
        elif isinstance(story_model, dict) and "temporalModel" in story_model:
            temporal_dict = story_model["temporalModel"]

        has_breath_opportunity = bool(temporal_dict.get("breathHoldWindow"))

        # 5. Partition frames across narrative segments using transcript
        shot_boundaries = self._calculate_segment_frame_ranges(segments, transcript, total_frames)

        # 6. Build shots
        shots = []
        num_shots = len(shot_boundaries)

        for idx, (seg_info, start_f, end_f) in enumerate(shot_boundaries):
            shot_id = f"shot_{idx + 1}_{seg_info.get('role', 'scene')}"
            role = seg_info.get("role", "scene").lower()
            narration = seg_info.get("narrationText", "")
            core_meaning = seg_info.get("coreMeaning", narration)
            visual_question = seg_info.get("visualQuestion", "")

            # Determine pacing mode and narrative hints dynamically
            pacing_mode, emotional_state, camera_hint, comp_mode = self._derive_pacing_and_camera(
                role=role,
                dynamics=dynamics,
                is_penultimate=(idx == num_shots - 2),
                is_final=(idx == num_shots - 1),
                has_breath_opportunity=has_breath_opportunity,
                duration_frames=(end_f - start_f),
                primary_mechanism=primary_mechanism,
                niche=niche,
            )

            # Determine 5-question visual state change
            state_change = self._derive_state_change(
                role=role,
                dynamics=dynamics,
                initial_state=state_model_dict.get("initialState", "Untouched baseline"),
                final_state=state_model_dict.get("finalState", "Stabilized resolution"),
                visible_trans=visible_trans,
                visible_conseq=visible_conseq,
                persistent_state=persistent_state,
                core_meaning=core_meaning,
                pacing_mode=pacing_mode,
            )

            # Transition to next shot
            transition = None
            if idx < num_shots - 1:
                next_role = shot_boundaries[idx + 1][0].get("role", "")
                transition = self._derive_transition(role, next_role, dynamics)

            # Sound cues
            sound_cues = self._derive_sound_cues(role, start_f, end_f, pacing_mode)

            # Caption behavior
            caption_behavior = {
                "visibility": "reduced" if pacing_mode in ("IMPACT", "HOLD") and (end_f - start_f) > 60 else "normal",
                "emphasisWords": self._extract_emphasis_words(narration),
            }

            # Suggested components (OPTIONAL)
            suggested_components = self._suggest_components_for_role(
                role=role,
                primary_mechanism=primary_mechanism,
                pacing_mode=pacing_mode,
                niche=niche,
                creative_plan=creative_plan,
            )

            # Visual mechanism
            mech_type = primary_mechanism if role in ("mechanism", "escalation", "contradiction") else "editorial_framing"
            visual_mech = {
                "type": mech_type,
                "confidence": "RECOMMENDED" if role in ("mechanism", "escalation") else "OPTIONAL",
            }

            # Continuity
            continuity = self._derive_continuity(idx, role, persistent_state, shots)

            # Visual Density Budget (Default: LOW)
            visual_density = self._derive_visual_density(role, pacing_mode)

            # Primary Visual Idea (one clear sentence)
            primary_visual_idea = self._derive_primary_visual_idea(
                role=role,
                concept_name=concept_name,
                primary_mechanism=primary_mechanism,
                physical_desc=physical_desc,
                visible_trans=visible_trans,
                visible_conseq=visible_conseq,
                narration=narration,
            )

            # Secondary Visual Support
            secondary_visual_support = self._derive_secondary_visual_support(role, niche)

            # Visual Focus Hierarchy (PRIMARY -> SECONDARY -> AMBIENT)
            visual_focus = self._derive_visual_focus(
                role=role,
                primary_idea=primary_visual_idea,
                secondary_support=secondary_visual_support,
                niche=niche,
            )

            # Component Budget (Default: 1, Max: 2)
            component_budget = self._derive_component_budget(role, pacing_mode)

            # Simplification Directive (what NOT to add)
            simplification_directive = self._derive_simplification_directive(role, primary_mechanism)

            shot: Dict[str, Any] = {
                "shotId": shot_id,
                "frameRange": [start_f, end_f],
                "narrativePurpose": f"[{role.upper()}] {core_meaning}",
                "visualObjective": self._derive_visual_objective(role, primary_mechanism, physical_desc, visible_trans, visible_conseq),
                "primaryVisualIdea": primary_visual_idea,
                "secondaryVisualSupport": secondary_visual_support,
                "visualFocus": visual_focus,
                "visualDensity": visual_density,
                "componentBudget": component_budget,
                "simplificationDirective": simplification_directive,
                "emotionalState": emotional_state,
                "pacingMode": pacing_mode,
                "subject": self._derive_subject(role, concept_name, primary_mechanism, niche),
                "visualQuestion": visual_question or f"What causes {concept_name} to occur?",
                "visualMechanism": visual_mech,
                "suggestedComponents": suggested_components,
                "composition": {
                    "mode": comp_mode,
                    "focalPoint": "center_mechanism" if role in ("mechanism", "escalation") else "upper_third_narrative",
                    "confidence": "RECOMMENDED",
                },
                "camera": {
                    "mode": camera_hint["mode"],
                    "movement": camera_hint["movement"],
                    "confidence": "RECOMMENDED",
                },
                "stateChange": state_change,
            }

            if transition:
                shot["transitionToNext"] = transition
            if sound_cues:
                shot["soundCues"] = sound_cues
            if caption_behavior:
                shot["captionBehavior"] = caption_behavior
            if continuity:
                shot["continuity"] = continuity

            shots.append(shot)

        return shots

    def _calculate_segment_frame_ranges(
        self,
        segments: List[Dict[str, Any]],
        transcript: List[Dict[str, Any]],
        total_frames: int,
    ) -> List[Tuple[Dict[str, Any], int, int]]:
        """
        Aligns segment narrations with transcript word timestamps to find exact start/end frames.
        """
        if not segments:
            # Fallback 3-shot structure if no segments parsed
            s1 = int(round(total_frames * 0.15))
            s2 = int(round(total_frames * 0.70))
            return [
                ({"role": "hook", "narrationText": "Hook premise", "coreMeaning": "Establish problem"}, 0, s1),
                ({"role": "mechanism", "narrationText": "Active mechanism", "coreMeaning": "Core transformation"}, s1, s2),
                ({"role": "resolution", "narrationText": "Resolution", "coreMeaning": "Visible takeaway"}, s2, total_frames),
            ]

        if not transcript:
            # Divide evenly based on segment count
            count = len(segments)
            ranges = []
            for i, seg in enumerate(segments):
                st = int(round((i / count) * total_frames))
                et = int(round(((i + 1) / count) * total_frames)) if i < count - 1 else total_frames
                ranges.append((seg, st, et))
            return ranges

        # Match segment text to transcript words
        words = transcript
        total_words = len(words)

        matched_indices = []
        w_idx = 0

        for seg in segments:
            seg_text = seg.get("narrationText", "").lower()
            seg_words = re.findall(r"\b\w+\b", seg_text)
            if not seg_words:
                matched_indices.append(w_idx)
                continue

            # Look ahead for matching anchor word
            anchor = seg_words[0]
            found_idx = w_idx
            for k in range(w_idx, min(total_words, w_idx + 25)):
                w_str = words[k].get("word", "").lower()
                clean_w = re.sub(r"[^\w]", "", w_str)
                if clean_w == anchor:
                    found_idx = k
                    break
            matched_indices.append(found_idx)
            w_idx = min(total_words - 1, found_idx + max(1, len(seg_words) - 1))

        # Build frame boundaries
        ranges = []
        for i in range(len(segments)):
            start_word_idx = matched_indices[i]
            st_f, _ = self.normalize_word_timing(words[start_word_idx], self.fps)
            if i == 0:
                st_f = 0

            if i < len(segments) - 1:
                next_word_idx = matched_indices[i + 1]
                et_f, _ = self.normalize_word_timing(words[next_word_idx], self.fps)
                if et_f <= st_f:
                    et_f = st_f + int(round(self.fps * 2.5))
            else:
                et_f = total_frames

            ranges.append((segments[i], st_f, min(total_frames, et_f)))

        # Ensure monotonic contiguous sequence
        for i in range(len(ranges) - 1):
            curr_seg, curr_st, curr_et = ranges[i]
            next_seg, next_st, next_et = ranges[i + 1]
            if curr_et != next_st:
                ranges[i] = (curr_seg, curr_st, next_st)

        # Last shot reaches total_frames
        last_seg, last_st, _ = ranges[-1]
        ranges[-1] = (last_seg, last_st, total_frames)

        return ranges

    def _derive_pacing_and_camera(
        self,
        role: str,
        dynamics: str,
        is_penultimate: bool,
        is_final: bool,
        has_breath_opportunity: bool,
        duration_frames: int,
        primary_mechanism: str,
        niche: str,
    ) -> Tuple[str, str, Dict[str, str], str]:
        """
        Determines pacing mode, emotion, camera movement, and composition layout.
        Uses creative hints rather than rigid recipes.
        """
        # Hook
        if role == "hook":
            return (
                "ACCELERATE",
                "High curiosity & tension",
                {"mode": "handheld_drift", "movement": "Subtle organic drift with intimate presenter/hero framing"},
                "open_canvas",
            )

        # Contradiction / Friction
        if role in ("contradiction", "setup"):
            return (
                "BUILD",
                "Friction, paradox, accumulating cognitive load",
                {"mode": "push_in", "movement": "Slow continuous 2.5D push-in emphasizing compression"},
                "asymmetric",
            )

        # Mechanism / Escalation
        if role in ("mechanism", "escalation"):
            # If penultimate or breath opportunity, evaluate optional pause
            if is_penultimate and has_breath_opportunity and duration_frames > 90:
                return (
                    "HOLD",
                    "Pregnant pause: visual breath before the tipping point",
                    {"mode": "static", "movement": "Sudden arrest of visual drift, tension hold"},
                    "centered_minimalism",
                )
            return (
                "BUILD" if dynamics == "accumulation" else "ACCELERATE",
                "Active cause-and-effect physical propagation",
                {"mode": "push_in" if primary_mechanism == "compression" else "lateral_pan",
                 "movement": "Tracking focal point as resistance builds"},
                "open_canvas",
            )

        # Reveal / Epiphany
        if role == "reveal":
            return (
                "IMPACT",
                "Epiphany, sudden realization, structural release",
                {"mode": "pull_out", "movement": "Sudden explosive zoom snap or micro camera shake"},
                "centered_minimalism",
            )

        # Resolution
        if is_final or role == "resolution":
            return (
                "RELEASE",
                "Clarity, sovereign recalibration, grounded closure",
                {"mode": "static", "movement": "Steady grounded wide observation, zero unnecessary camera travel"},
                "centered_minimalism",
            )

        # Default
        return (
            "OBSERVE",
            "Focused comprehension",
            {"mode": "static", "movement": "Controlled subtle breathing drift"},
            "open_canvas",
        )

    def _derive_state_change(
        self,
        role: str,
        dynamics: str,
        initial_state: str,
        final_state: str,
        visible_trans: str,
        visible_conseq: str,
        persistent_state: str,
        core_meaning: str,
        pacing_mode: str,
    ) -> Dict[str, str]:
        """
        Answers the mandatory 5 Visual State questions for each shot.
        """
        if role == "hook":
            return {
                "whatExistsAtBeginning": "Uninitiated baseline / untouched space",
                "whatHappens": "Initial friction introduced; subject confronts the core question",
                "whatVisiblyChanges": "Hero visual or presenter establishes the scene; primary question surfaces",
                "whatExistsAtEnd": "State A: Problem space actively engaged",
                "whyChangeMatters": "Captures curiosity in the first 2.5s before the viewer scrolls away",
            }
        elif role in ("setup", "contradiction"):
            return {
                "whatExistsAtBeginning": "Initial unexamined assumption",
                "whatHappens": "Opposing force enters; resistance or cognitive friction becomes visible",
                "whatVisiblyChanges": "Surface deforms, boundary deflects, or dual pathways diverge in tension",
                "whatExistsAtEnd": "Contradiction manifest on screen; system is under load",
                "whyChangeMatters": "Exposes why standard willpower or naive effort fails",
            }
        elif role in ("mechanism", "escalation"):
            return {
                "whatExistsAtBeginning": "System under rising load (State A)",
                "whatHappens": f"Live execution of {dynamics}: {visible_trans}",
                "whatVisiblyChanges": "Live physical deformation, worn furrow deepening, or threshold approaching breaking point",
                "whatExistsAtEnd": "System at tipping threshold or undergoing phase change",
                "whyChangeMatters": "Allows the viewer to SEE the invisible psychology physically operate",
            }
        elif role == "reveal":
            return {
                "whatExistsAtBeginning": "System at peak tension or holding breath",
                "whatHappens": "The critical threshold crosses; slash strike or cleavage occurs",
                "whatVisiblyChanges": f"Old paradigm fractured; new insight snaps into focus: {visible_conseq}",
                "whatExistsAtEnd": "Fracture resolved; sovereign clarity achieved",
                "whyChangeMatters": "Delivers the core epiphany payoff that justifies the entire video",
            }
        elif role == "resolution":
            return {
                "whatExistsAtBeginning": "Decompressed post-epiphany space",
                "whatHappens": "Stabilization; sovereign boundary grounded; persistent memory trace settles",
                "whatVisiblyChanges": f"Deliberate calm; environment reflects {persistent_state}",
                "whatExistsAtEnd": f"State B: {final_state}",
                "whyChangeMatters": "Leaves the viewer with an unforgettable decisive takeaway and emotional peace",
            }
        else:
            if pacing_mode == "HOLD":
                return {
                    "whatExistsAtBeginning": "Established visual system",
                    "whatHappens": "Intentional hold and visual silence; audio delivers weighty realization",
                    "whatVisiblyChanges": "Deliberate absence of movement; subtle atmospheric breathing only",
                    "whatExistsAtEnd": "Insight fully absorbed",
                    "whyChangeMatters": "Gives the viewer cognitive space to internalize the profound shift",
                }
            return {
                "whatExistsAtBeginning": "Current stage composition",
                "whatHappens": f"Narrative progression: {core_meaning}",
                "whatVisiblyChanges": "Elements shift focus according to spoken beat",
                "whatExistsAtEnd": "Intermediate progression state",
                "whyChangeMatters": "Maintains rhythmic momentum and narrative clarity",
            }

    def _derive_visual_objective(
        self,
        role: str,
        primary_mechanism: str,
        physical_desc: str,
        visible_trans: str,
        visible_conseq: str,
    ) -> str:
        """
        Creates actionable WHAT-to-see visual objective for the AI agent.
        """
        if role == "hook":
            return "Establish hero subject and immediate question in high contrast open stage. Ground viewer immediately."
        elif role in ("setup", "contradiction"):
            return f"Show competing forces or unexamined assumption. Visually demonstrate tension rather than explaining it."
        elif role in ("mechanism", "escalation"):
            return f"Execute {primary_mechanism.upper()}: {physical_desc}. Viewer must observe physical state changing live."
        elif role == "reveal":
            return f"Deliver the payoff: {visible_conseq}. Sharp kinetic impact, highlighter stroke, or threshold crossing."
        elif role == "resolution":
            return f"Present settled sovereign state. Zero cluttered dashboard cards; one decisive visual impression."
        return "Communicate narrative meaning through clear visual hierarchy."

    def _derive_subject(self, role: str, concept_name: str, primary_mechanism: str, niche: str) -> str:
        """
        Determines the visual subject of the shot.
        """
        if role == "hook":
            return "Hero illustration & grounded host avatar"
        elif role in ("mechanism", "escalation"):
            return f"Active {primary_mechanism} mechanism ({concept_name})"
        elif role == "reveal":
            return "Epiphany threshold / sovereign recalibration"
        elif role == "resolution":
            return "Grounded sovereign state / persistent artifact"
        return f"{concept_name} visual representation"

    def _derive_transition(self, from_role: str, to_role: str, dynamics: str) -> Dict[str, str]:
        """
        Provides story-motivated transitions between shots.
        """
        if from_role == "hook" and to_role in ("setup", "contradiction"):
            return {
                "type": "scale_through",
                "motivation": "Zooming past initial curiosity directly into the underlying anatomical cause",
            }
        elif from_role in ("setup", "contradiction") and to_role in ("mechanism", "escalation"):
            return {
                "type": "morph",
                "motivation": "Contradiction transforms into active mechanical impulse",
            }
        elif from_role in ("mechanism", "escalation") and to_role == "reveal":
            return {
                "type": "collapse",
                "motivation": "Old strained structure collapses to reveal the core truth beneath",
            }
        elif to_role == "resolution":
            return {
                "type": "fade_hold",
                "motivation": "Decompression after impact; quiet settling into sovereign clarity",
            }
        return {
            "type": "hard_cut",
            "motivation": "Sharp cognitive break matching narrative pivot",
        }

    def _derive_sound_cues(self, role: str, start_f: int, end_f: int, pacing_mode: str) -> List[Dict[str, Any]]:
        """
        Generates narrative sound design cues synced to frame events.
        """
        cues = []
        if role == "hook":
            cues.append({"type": "whoosh_deep", "frame": start_f + 4, "purpose": "Opening scene presence"})
        elif pacing_mode == "IMPACT":
            cues.append({"type": "impact_hit", "frame": start_f + 2, "purpose": "Decisive realization strike"})
        elif role in ("mechanism", "escalation"):
            cues.append({"type": "click", "frame": start_f + 8, "purpose": "Mechanical state shift engagement"})
            if (end_f - start_f) > 90:
                cues.append({"type": "marker_scribble", "frame": start_f + 45, "purpose": "Annotation or pathway emphasis"})
        elif role == "resolution":
            cues.append({"type": "whoosh_cinematic", "frame": start_f + 5, "purpose": "Settling into final resolution"})
        return cues

    def _derive_visual_density(self, role: str, pacing_mode: str) -> str:
        """
        Visual density budget:
        LOW (default): explanations, setup, emotional moments, holds, reflection.
        MEDIUM: mechanisms, accumulation, transitions, escalating systems.
        HIGH: temporary only for major impact, climax, rupture, reveal, transformation.
        """
        if pacing_mode == "IMPACT" or role == "reveal":
            return "HIGH"
        if role in ("mechanism", "escalation"):
            return "MEDIUM"
        return "LOW"

    def _derive_primary_visual_idea(
        self,
        role: str,
        concept_name: str,
        primary_mechanism: str,
        physical_desc: str,
        visible_trans: str,
        visible_conseq: str,
        narration: str,
    ) -> str:
        """
        Synthesizes the single primary visual idea understandable in one clear sentence.
        Follows Section 4: ONE VISUAL IDEA PER SHOT.
        """
        mech_clean = primary_mechanism.replace("_", " ").lower()
        if role == "hook":
            return f"Hero editorial subject introduces {concept_name} in an open, high-contrast visual field."
        elif role in ("setup", "contradiction"):
            return f"A single boundary or structural element encounters resistance, visually establishing tension."
        elif role in ("mechanism", "escalation"):
            if "deformation" in mech_clean or "compression" in mech_clean or "load" in mech_clean or "strain" in mech_clean:
                return "One monolithic structure visibly deforms under escalating continuous load."
            elif "fracture" in mech_clean or "rupture" in mech_clean or "break" in mech_clean:
                return "A single structural line cracks progressively under unsustainable strain."
            elif "accumulation" in mech_clean or "noise" in mech_clean or "tab" in mech_clean or "distraction" in mech_clean:
                return "Each small incident visibly settles into the space, progressively filling the environment."
            elif "distance" in mech_clean or "isolation" in mech_clean or "lonel" in mech_clean:
                return "The central figure slowly moves further away into negative space, increasing emotional distance."
            elif "threshold" in mech_clean or "boundary" in mech_clean:
                return "A single threshold line visibly yields and recedes under repeated pressure."
            elif "furrow" in mech_clean or "groove" in mech_clean or "habit" in mech_clean:
                return "A single path becomes visibly deeper and more worn with each repeated movement."
            return f"One active {mech_clean} system evolves: {visible_trans}."
        elif role == "reveal":
            return f"The tension releases through a single decisive transformation: {visible_conseq}."
        elif role == "resolution":
            return "One quiet, grounded sovereign state settles with generous negative breathing room."
        return f"A single focused visual system clearly demonstrates {concept_name}."

    def _derive_secondary_visual_support(self, role: str, niche: str) -> Optional[str]:
        """
        At most a small amount of supporting info (one label, secondary cue, subtle reaction).
        """
        if role == "hook":
            return "Subtle host grounding along bottom screen margin."
        elif role in ("setup", "contradiction"):
            return "A single understated orientation label or tension vector."
        elif role in ("mechanism", "escalation"):
            return "A single ghost trace or subtle load indicator."
        elif role == "reveal":
            return "A single kinetic highlight stroke or sharp impact shake."
        elif role == "resolution":
            return "A single permanent baseline mark or settled status label."
        return None

    def _derive_visual_focus(
        self,
        role: str,
        primary_idea: str,
        secondary_support: Optional[str],
        niche: str,
    ) -> Dict[str, Any]:
        """
        Explicit Visual Focus Hierarchy (PRIMARY -> SECONDARY -> AMBIENT).
        """
        primary_target = (
            "Hero illustration card" if role == "hook"
            else ("Active mechanical transformation" if role in ("mechanism", "escalation")
                  else ("Epiphany release action" if role == "reveal" else "Settled sovereign baseline"))
        )
        return {
            "primary": primary_target,
            "secondary": secondary_support or "None (pure single-subject focus)",
            "backgroundRole": "Pristine ambient canvas; zero competing visual targets or distracting motion",
        }

    def _derive_component_budget(self, role: str, pacing_mode: str) -> int:
        """
        Component budget: default 1. Maximum recommended 2.
        suggestedComponents are options, NOT ingredients.
        """
        return 1

    def _derive_simplification_directive(self, role: str, primary_mechanism: str) -> str:
        """
        Tactical advice on what NOT to add (anti-over-explanation pass).
        """
        if role == "hook":
            return "Do not stack multiple floating cards or badges; let the hero illustration and presenter establish focus."
        elif role in ("mechanism", "escalation"):
            return "Do not combine with secondary dials, multiple charts, or decorative floating particles. One deforming system carries the scene."
        elif role == "reveal":
            return "Do not repeat the spoken sentence in giant paragraphs. Deliver one decisive visual strike or release."
        elif role == "resolution":
            return "Do not build a dashboard summary. End on a clean, grounded baseline with generous negative space."
        return "Keep the composition minimal. If the primary visual already communicates the idea, stop adding elements."

    def _suggest_components_for_role(
        self,
        role: str,
        primary_mechanism: str,
        pacing_mode: str,
        niche: str,
        creative_plan: Dict[str, Any],
    ) -> List[Dict[str, Any]]:
        """
        Suggests relevant components as MUTUALLY OPTIONAL options for the coding agent.
        Component budget is strictly restrained (default: 1).
        """
        suggestions = []

        if role == "hook":
            suggestions.append({
                "component": "CinematicIllustrationCard",
                "confidence": "RECOMMENDED",
                "reason": "Opening 2.5s hero editorial framing (Rule 4)",
                "importPath": "../../components/CinematicIllustrationCard",
                "visualComplexity": "LOW",
                "bestUse": "single_subject",
            })
            if niche == "self_improvement":
                suggestions.append({
                    "component": "GlossyJudyIntro",
                    "confidence": "RECOMMENDED",
                    "reason": "Grounded presenter connection on mobile screens",
                    "importPath": "../../components/pure_graphics",
                    "visualComplexity": "LOW",
                    "bestUse": "supporting_system",
                })
        elif role in ("mechanism", "escalation"):
            # Map based on primary mechanism - pick ONE primary tool
            mech = primary_mechanism.lower()
            if "deformation" in mech or "compression" in mech or "strain" in mech or "load" in mech:
                suggestions.append({
                    "component": "ViscoelasticDeformation",
                    "confidence": "OPTIONAL",
                    "reason": "Simulates gradual strain and deformation under load",
                    "importPath": "../../components/physics/materiality",
                    "visualComplexity": "MEDIUM",
                    "bestUse": "single_subject",
                })
            elif "fracture" in mech or "rupture" in mech or "breaking" in mech:
                suggestions.append({
                    "component": "StressFractureEngine",
                    "confidence": "OPTIONAL",
                    "reason": "Simulates structural cleavage and progressive fracture",
                    "importPath": "../../components/physics/materiality",
                    "visualComplexity": "MEDIUM",
                    "bestUse": "single_subject",
                })
            elif "threshold" in mech or "boundary" in mech:
                suggestions.append({
                    "component": "ThresholdBoundary",
                    "confidence": "OPTIONAL",
                    "reason": "Physical boundary displacement under repeated impulses",
                    "importPath": "../../components/primitives",
                    "visualComplexity": "LOW",
                    "bestUse": "single_subject",
                })
            elif "causal" in mech or "state_machine" in mech:
                suggestions.append({
                    "component": "CausalWorld",
                    "confidence": "OPTIONAL",
                    "reason": "Deterministic discrete state machine with persistent memory",
                    "importPath": "../../causal",
                    "visualComplexity": "HIGH",
                    "bestUse": "complex_sequence",
                })
            else:
                suggestions.append({
                    "component": "KineticFurrow",
                    "confidence": "OPTIONAL",
                    "reason": "Carves repeated groove pathway illustrating habitual ease",
                    "importPath": "../../components/primitives",
                    "visualComplexity": "LOW",
                    "bestUse": "single_subject",
                })
        elif role == "reveal":
            suggestions.append({
                "component": "AnimatedSlashStrike",
                "confidence": "RECOMMENDED",
                "reason": "Slices through rejected premise in real-time",
                "importPath": "../../components/kinetic_text",
                "visualComplexity": "LOW",
                "bestUse": "single_subject",
            })
            suggestions.append({
                "component": "KineticHighlighter",
                "confidence": "OPTIONAL",
                "reason": "Draws hand-painted highlighter strike behind breakthrough word",
                "importPath": "../../components/kinetic_text",
                "visualComplexity": "LOW",
                "bestUse": "supporting_system",
            })
        elif role == "resolution":
            suggestions.append({
                "component": "PersistentMemoryStage",
                "confidence": "OPTIONAL",
                "reason": "Leaves persistent ghost trace of the journey",
                "importPath": "../../components/primitives",
                "visualComplexity": "LOW",
                "bestUse": "supporting_system",
            })

        return suggestions

    def _derive_continuity(
        self,
        shot_idx: int,
        role: str,
        persistent_state: str,
        previous_shots: List[Dict[str, Any]],
    ) -> Optional[Dict[str, Any]]:
        """
        Preserves visual traces and objects across shots.
        """
        if shot_idx == 0:
            return None

        prev_shot = previous_shots[-1]
        prev_id = prev_shot.get("shotId", "")

        if role in ("mechanism", "escalation"):
            return {
                "inheritFromShot": prev_id,
                "preserveElements": ["boundary_axis", "tension_vector"],
                "persistentTrace": "Ghost outline of untouched baseline",
            }
        elif role in ("reveal", "resolution"):
            return {
                "inheritFromShot": prev_id,
                "preserveElements": ["ground_recalibrated_line"],
                "persistentTrace": f"Permanent mark of {persistent_state}",
            }

        return {
            "inheritFromShot": prev_id,
        }

    def _extract_emphasis_words(self, text: str) -> List[str]:
        """
        Pulls strong cognitive anchor words from narration text for caption emphasis.
        """
        words = re.findall(r"\b[A-Za-z]{4,}\b", text)
        # Select up to 3 distinctive words
        stopwords = {"this", "that", "with", "from", "your", "what", "when", "where", "about", "which", "there", "their"}
        filtered = [w.upper() for w in words if w.lower() not in stopwords]
        return filtered[:3]
