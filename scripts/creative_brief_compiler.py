#!/usr/bin/env python3
"""
🎬 RightMotion Creative Brief Compiler
=======================================
Bridges high-level story intelligence, visual concept translation, and orchestrator plans
into a single, canonical `creative_brief.json` and an immediate Canvas.tsx header summary.

Guarantees:
1. Canonical source of truth: `src/clips/<name>/creative_brief.json`
2. Immediate context: Compact `RIGHTMOTION CREATIVE MISSION` header in `Canvas.tsx`
3. Zero information loss between planning and coding agent
4. Strict confidence hierarchy: REQUIRED (meaning/state) > RECOMMENDED (mechanism) > OPTIONAL (components)
"""

import json
from pathlib import Path
from typing import Dict, Any, List, Optional
from shot_director import ShotDirector
from retention_choreographer import RetentionChoreographer
from reference_discovery import ReferenceDiscovery

ROOT_DIR = Path(__file__).resolve().parent.parent


class CreativeBriefCompiler:
    """
    Compiles story models, creative plans, and transcripts into CreativeBrief.
    """

    def __init__(self, fps: int = 60):
        self.fps = fps
        self.shot_director = ShotDirector(fps=fps)
        self.retention_choreographer = RetentionChoreographer(fps=fps)
        self.ref_discovery = ReferenceDiscovery()
        self.component_index_path = ROOT_DIR / "src" / "creative_brief" / "component_index.json"
        self._component_index = None

    def compile_brief(
        self,
        clip_name: str,
        topic: str,
        niche: str,
        clean_script: str,
        words: List[Dict[str, Any]],
        story_model: Any,
        creative_plan: Dict[str, Any],
        motion_ast: Dict[str, Any],
        duration_sec: float,
        illustration_path: Optional[str] = None,
        problem_cutout: Optional[str] = None,
        solution_cutout: Optional[str] = None,
    ) -> Dict[str, Any]:
        total_frames = int(round(duration_sec * self.fps))

        # 1. Distill Story Intelligence
        story_summary = self._extract_story_summary(story_model, topic, clean_script)

        # 2. Distill Emotional Arc
        emotional_arc = self._extract_emotional_arc(story_model, words, total_frames)

        # 3. Distill Visual Concept
        visual_concept = self._extract_visual_concept(creative_plan, topic)

        # 4. Decompose into ShotDirectives via ShotDirector (WHAT the viewer sees)
        raw_shots = self.shot_director.decompose_shots(
            story_model=story_model,
            creative_plan=creative_plan,
            transcript=words,
            total_frames=total_frames,
            niche=niche,
        )

        # 4b. Choreograph Attention and Timeline Dynamics via RetentionChoreographer (HOW attention behaves)
        choreography = self.retention_choreographer.choreograph(
            shots=raw_shots,
            story_model=story_model,
            creative_plan=creative_plan,
            transcript=words,
            total_frames=total_frames,
            niche=niche,
        )
        shots = choreography["shots"]
        attention_curve = choreography["attentionCurve"]

        # 5. Distill Visual Language & Platform Constraints
        visual_language = self._extract_visual_language(
            creative_plan=creative_plan,
            motion_ast=motion_ast,
            niche=niche,
            concept=visual_concept.get("conceptName", topic),
            primary_mechanism=visual_concept.get("primaryMechanism", ""),
        )

        # 6. Distill Assets
        assets = {
            "illustration": illustration_path or f"{clip_name}/assets/scene_illustration.png",
            "problemCutout": {
                "id": problem_cutout or "tangled_confusion_chaos",
                "path": f"assets/psychology/{problem_cutout or 'tangled_confusion_chaos'}.png",
            },
            "solutionCutout": {
                "id": solution_cutout or "enlightened_mind_insight",
                "path": f"assets/psychology/{solution_cutout or 'enlightened_mind_insight'}.png",
            },
        }

        # 7. Discover Pedagogical References
        ref_matches = self.ref_discovery.discover_references(
            concept=topic,
            primary_mechanism=visual_concept.get("primaryMechanism", ""),
            max_results=2,
        )

        # 8. Master Agent Contract (Minimalist Visual Storytelling & Retention Choreography)
        agent_contract = {
            "instructions": (
                "READ RIGHTMOTION_CREATIVE_CONSTITUTION.md AND THIS BRIEF BEFORE IMPLEMENTING Canvas.tsx. "
                "The Shot Director defines WHAT the viewer must see; the Retention Choreographer defines "
                "HOW attention behaves over time; you as the AI editor decide HOW to realize it. "
                "SIMPLE FRAME. RICH TIMELINE — Keep the screen simple. Keep the timeline alive."
            ),
            "confidenceHierarchy": (
                "CONSTITUTION > BRIEF > SHOT DIRECTIVES & ATTENTION PLAN > COMPONENT INDEX > AGENT IMPLEMENTATION.\n"
                "REQUIRED: Narrative purpose, visual objective, primary visual idea, 5-question state change, and attention plan.\n"
                "RECOMMENDED: Primary visual mechanism, composition mode, camera movement, and micro-events.\n"
                "OPTIONAL: Suggested components (mutually optional options, NOT ingredients. Budget: 1)."
            ),
            "retentionPhilosophy": (
                "SIMPLE FRAME, RICH TIMELINE: A frame should be easy to understand at a glance. "
                "A sequence should remain dynamically interesting over time. visualDensity != attentionIntensity. "
                "Do not increase visual complexity merely to increase stimulation. Create retention through "
                "anticipation, timing, transformation, camera choreography, micro-events, contrast, and payoffs."
            ),
            "simultaneousMotionBudget": (
                "Strict limit on simultaneous significant motion: exactly 1 primary moving system, "
                "and 0-1 subtle secondary cues. Never let presenter, physical mechanism, camera drift, "
                "animated cards, text slams, and particles move simultaneously."
            ),
            "visualHierarchy": (
                "PRIMARY (one dominant visual idea) -> SECONDARY (at most one supporting detail) -> "
                "AMBIENT (context only; zero competition). Never multiple competing targets at once."
            ),
            "noUnmotivatedCardification": (
                "Cards are permitted ONLY when they genuinely improve clarity or serve a justified narrative "
                "purpose (e.g. hero illustration card, product page worksheet proof, physical smartphone screen). "
                "A card must NEVER be used as a lazy default wrapper around text or icons."
            ),
            "componentRestraint": (
                "suggestedComponents are MUTUALLY OPTIONAL candidates, NOT ingredients. Component budget "
                "defaults to 1 (max 2 for complex mechanisms). Prefer the smallest number of visual systems."
            ),
            "temporalComplexity": (
                "Visual complexity exists in TIME rather than SPACE. Prefer one object with many meaningful "
                "states (stable -> pressure -> deflection -> fracture) over many objects with one simple state."
            ),
            "fiveQuestionsRule": (
                "For every shot, you must satisfy: 1) What exists at the beginning? 2) What happens? "
                "3) What visibly changes? 4) What exists at the end? 5) Why does that change matter? "
                "If only text changes, redesign the scene around physical or spatial transformation."
            ),
            "minimalityPass": (
                "Before finalizing every major shot, execute the 'Remove One Thing' pass: What can be removed "
                "without losing meaning? Strip decorative particles, redundant metrics, and extra badges. "
                "If the physical motion already explains the idea, stop adding things."
            ),
        }

        brief = {
            "version": "1.0.0",
            "clipId": clip_name,
            "topic": topic,
            "niche": niche,
            "fps": self.fps,
            "totalFrames": total_frames,
            "story": story_summary,
            "emotionalArc": emotional_arc,
            "visualConcept": visual_concept,
            "attentionCurve": attention_curve,
            "shots": shots,
            "visualLanguage": visual_language,
            "assets": assets,
            "pedagogicalReferences": ref_matches,
            "agentContract": agent_contract,
        }

        return brief

    def format_canvas_mission_header(
        self,
        pascal_name: str,
        brief: Dict[str, Any],
        s2_start: int,
        s3_start: int,
        total_frames: int,
    ) -> str:
        """
        Generates the compact, human-readable RIGHTMOTION CREATIVE MISSION header
        injected into the top of Canvas.tsx.
        """
        topic = brief.get("topic", "")
        clip_id = brief.get("clipId", "")
        vc = brief.get("visualConcept", {})
        story = brief.get("story", {})
        shots = brief.get("shots", [])

        primary_mech = vc.get("primaryMechanism", "Physical Mechanism").upper().replace("_", " ")
        central_trans = vc.get("centralTransformation", "State A transforms to State B")
        core_idea = story.get("coreIdea", topic)
        why_mech = vc.get("whyThisMechanism", "Visualizes the underlying psychological dynamic")

        # Format shots summary with minimalist visual grammar & retention choreography
        shots_summary_lines = []
        for s in shots:
            fr = s.get("frameRange", [0, 0])
            dur_sec = (fr[1] - fr[0]) / self.fps
            p_mode = s.get("pacingMode", "BUILD")
            v_density = s.get("visualDensity", "LOW")
            comp_budget = s.get("componentBudget", 1)
            primary_idea = s.get("primaryVisualIdea", s.get("visualObjective", ""))[:75]
            att_plan = s.get("attentionPlan", {})
            trajectory = att_plan.get("trajectory", "RISING")
            att_intensity = att_plan.get("attentionIntensity", "MEDIUM")
            micro_count = len(att_plan.get("microEvents", []))
            payoff_f = att_plan.get("payoffFrame")
            payoff_str = f" | Payoff: f{payoff_f}" if payoff_f else ""
            shots_summary_lines.append(
                f" *    • {s.get('shotId', 'shot')} (f:{fr[0]}-{fr[1]}, {dur_sec:.1f}s) [{p_mode} | Density:{v_density} | Attention:{att_intensity} | Trajectory:{trajectory}]:\n"
                f" *      Primary Idea: \"{primary_idea}\"\n"
                f" *      Retention Plan: {micro_count} micro-events{payoff_str} (visualDensity != attentionIntensity)"
            )
        shots_summary_str = "\n".join(shots_summary_lines) if shots_summary_lines else " *    • 3-Scene Narrative Arc"

        # Pedagogical Reference Study
        ped_refs = brief.get("pedagogicalReferences", [])
        ref_study_lines = []
        if ped_refs:
            top_ref = ped_refs[0]
            ref_study_lines.append(
                f" * 💡 FLAGSHIP REFERENCE STUDY: {top_ref.get('title', top_ref.get('clipId'))} (Category: {top_ref.get('category', 'strategy')})\n"
                f" *    Why it works: {top_ref.get('whyItIsStrong')}\n"
                f" *    👉 What to learn: {top_ref.get('whatShouldBeLearned')}\n"
                f" *    🛑 What NOT to copy: {top_ref.get('whatShouldNotBeCopied')}\n"
                f" *    Explore further: python3 scripts/reference_discovery.py --concept \"{topic}\""
            )
        ref_study_str = "\n".join(ref_study_lines) if ref_study_lines else " * 💡 FLAGSHIP REFERENCES: Run `python3 scripts/reference_discovery.py` to inspect proven reference clips."

        att_curve = brief.get("attentionCurve", {})
        curve_type = att_curve.get("curveType", "PSYCHOLOGICAL_TENSION")

        header = f"""/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  🎬 RIGHTMOTION CREATIVE MISSION — {pascal_name}Canvas
 * ║  Topic: "{topic}"
 * ║  Primary Visual Mechanism: {primary_mech}
 * ║  Attention Curve: {curve_type}
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * 🎯 THE RIGHTMOTION CREATIVE MANTRA & RETENTION LAW:
 *    • SIMPLE FRAME. RICH TIMELINE.
 *    • Keep the screen simple. Keep the timeline alive.
 *    • visualDensity != attentionIntensity. (Low spatial clutter + high temporal intent).
 *    • CLARITY OVER COMPLEXITY · SIMPLICITY OVER SPECTACLE · MEANING OVER DECORATION.
 *    • ONE STRONG VISUAL IDEA BEATS FIVE COMPETING IDEAS.
 *    • When the visual is already explaining the idea, stop adding things.
 *
 * 🏛️ CREATIVE CONSTITUTION (Supreme Law): Read RIGHTMOTION_CREATIVE_CONSTITUTION.md
 *    Precedence: CONSTITUTION > BRIEF > SHOT DIRECTIVES & ATTENTION PLAN > COMPONENT INDEX > AGENT IMPLEMENTATION.
 *
 * 📖 CANONICAL BRIEF: Read src/clips/{clip_id}/creative_brief.json
 *    Authoritative shot directives, attention plans, visual clarity budgets, and 5-question state changes.
 *
 * 🛠️ EDITING LAYERS PLAYBOOK: Read docs/EDITING_LAYERS_PLAYBOOK.md
 *    Directing guide for composing Physical Metaphor + Camera + Sound + State + Captions.
 *
 * 🎬 THE EDITING-LAYER COMPOSITION LAW:
 *    RIGHTMOTION IS AN EDITING SYSTEM, NOT A COMPONENT LIBRARY.
 *    Do not merely place components on screen. Direct and edit the idea through:
 *    IDEA → VISUAL METAPHOR → EDITING LAYERS → TIMING / INTERACTION → PAYOFF
 *
 * 📐 MOBILE SCALE LAW (SIMPLE FRAME ≠ SMALL VISUALS):
 *    Assume 9:16 YouTube Short on a 6-inch phone at ~720p effective resolution:
 *    • PRIMARY VISUAL: 400px–750px width/height, 6px–14px SVG strokes. Immediately recognizable.
 *    • SECONDARY CUES: 150px–300px, 2px–4px strokes. Subordinated support, zero competition.
 *    • TYPOGRAPHY: Hero 80–110px, Headlines 56–72px, absolute floor 36px. Never use tiny body copy.
 *
{ref_study_str}
 *
 * 🎯 CORE STORY IDEA:
 *    "{core_idea}"
 *
 * 🔄 CENTRAL TRANSFORMATION:
 *    {central_trans}
 *    Why: {why_mech}
 *
 * ⏱️ PLANNED SHOT SEQUENCE (Shot Director + Retention Choreographer):
{shots_summary_str}
 *
 * 🛑 RETENTION & MINIMALIST EDITORIAL LAWS:
 *    1. Simple Frame, Rich Timeline: Keep the screen simple. Keep the timeline alive.
 *       Create retention through anticipation, micro-events, camera choreography, and payoffs.
 *    2. Multi-Layer Composition: Compose 3-5 editing layers together:
 *       Physical Metaphor (400-750px) + CameraCanvas push/tilt + SoundDesignEngine tactile SFX +
 *       Temporal Micro-events (tremors/recoil) + AppleKineticCaptions interaction.
 *    3. No Generic Fallback: Never reduce a dynamic concept into static cards + text + Lucide icons.
 *       If the script says pressure, deform a structure. If it says habits, carve a furrow.
 *    4. Simultaneous Motion Budget: Exactly 1 primary moving system, 0-1 subtle secondary cues.
 *       Never let presenter, physical mechanism, camera drift, animated cards, and text move simultaneously.
 *    5. Visual Hierarchy: PRIMARY (one dominant visual idea) → SECONDARY (at most 1 supporting cue) → AMBIENT.
 *       Never PRIMARY + SECONDARY x 3 + TEXT + ICON + PRESENTER + PARTICLES all competing at once.
 *    6. Law of No Unmotivated Cardification: Cards are permitted ONLY when genuinely justified
 *       (e.g. hero illustration card, product page worksheet proof, physical device screen).
 *       NEVER wrap text or icons in a default card or panel. Prefer open-canvas physical mechanisms.
 *    7. Temporal Complexity: Visual complexity exists in TIME rather than SPACE.
 *       Prefer 1 object with many meaningful states over many objects with 1 simple state.
 *    8. Anticipation and Payoff: Every meaningful setup must lead to anticipation and a decisive payoff.
 *    9. The viewer must SEE the mechanism operate live, not merely read about it.
 *   10. Ban Visual Over-Explanation: If the physical motion already explains the sentence, do NOT
 *       repeat it in giant redundant text. Let the motion communicate.
 *   11. "Remove One Thing" Pass: Before finalizing every shot, ask: "What can I remove without losing meaning?"
 *   12. Five Questions: What exists before? What happens? What visibly changes? What exists after? Why does it matter?
 */"""
        return header

    def _extract_story_summary(self, story_model: Any, topic: str, clean_script: str) -> Dict[str, Any]:
        if hasattr(story_model, "story"):
            st = story_model.story
            return {
                "coreIdea": getattr(st, "coreIdea", topic),
                "centralClaim": getattr(st, "centralClaim", clean_script[:120]),
                "viewerPromise": getattr(st, "viewerPromise", "Understand the hidden dynamic"),
                "narrativeArc": getattr(st, "narrativeArc", "Problem -> Mechanism -> Resolution"),
            }
        elif isinstance(story_model, dict) and "story" in story_model:
            st = story_model["story"]
            return {
                "coreIdea": st.get("coreIdea", topic),
                "centralClaim": st.get("centralClaim", clean_script[:120]),
                "viewerPromise": st.get("viewerPromise", "Understand the hidden dynamic"),
                "narrativeArc": st.get("narrativeArc", "Problem -> Mechanism -> Resolution"),
            }
        return {
            "coreIdea": topic,
            "centralClaim": clean_script[:120],
            "viewerPromise": "Understand the hidden dynamic",
            "narrativeArc": "Problem -> Mechanism -> Resolution",
        }

    def _extract_emotional_arc(
        self,
        story_model: Any,
        words: List[Dict[str, Any]],
        total_frames: int,
    ) -> Dict[str, Any]:
        entries = []
        if hasattr(story_model, "emotionalTrajectory"):
            for item in story_model.emotionalTrajectory:
                entries.append({
                    "segmentId": getattr(item, "segmentId", ""),
                    "emotion": getattr(item, "emotion", "Curiosity"),
                    "attentionSpike": getattr(item, "attentionSpike", False),
                })
        elif isinstance(story_model, dict) and "emotionalTrajectory" in story_model:
            entries = story_model["emotionalTrajectory"]

        segments = []
        count = len(entries) if entries else 3
        for i in range(count):
            st_f = int(round((i / count) * total_frames))
            et_f = int(round(((i + 1) / count) * total_frames))
            entry = entries[i] if i < len(entries) else {}
            segments.append({
                "segmentId": entry.get("segmentId", f"segment_{i + 1}"),
                "role": "hook" if i == 0 else ("resolution" if i == count - 1 else "mechanism"),
                "startFrame": st_f,
                "endFrame": et_f,
                "emotion": entry.get("emotion", "Analytical curiosity"),
                "intensity": 0.9 if i == 0 else (0.95 if i == count - 2 else 0.75),
                "attentionSpike": entry.get("attentionSpike", i == 0),
            })

        return {
            "overall": "Curiosity -> Tension & Cognitive Friction -> Epiphany Release -> Grounded Peace",
            "segments": segments,
        }

    def _extract_visual_concept(self, creative_plan: Dict[str, Any], topic: str) -> Dict[str, Any]:
        vc = creative_plan.get("visualConcept", {}) if creative_plan else {}
        champ = vc.get("championCandidate", {})
        return {
            "conceptName": champ.get("conceptName", vc.get("conceptName", topic)),
            "primaryMechanism": vc.get("primaryMechanism", "semantic_accumulation"),
            "centralTransformation": vc.get("centralTransformation", "State A visibly transitions to State B"),
            "physicalDescription": champ.get("physicalDescription", "Physical system undergoing strain or mutation"),
            "visibleTransformation": champ.get("visibleTransformation", "Live structural deformation"),
            "visibleConsequence": champ.get("visibleConsequence", "Residual consequence of the action"),
            "persistentState": champ.get("persistentState", "Settled baseline state"),
            "whyThisMechanism": vc.get("whyThisMechanism", "Accurately represents the underlying friction"),
            "intentionallyNotVisualized": vc.get("whatIsIntentionallyNotVisualized", ["Generic floating cards", "Empty icons"]),
            "metaphorDepth": champ.get("depthLevel", "PHYSICAL_PROCESS"),
        }

    def _extract_visual_language(
        self,
        creative_plan: Dict[str, Any],
        motion_ast: Dict[str, Any],
        niche: str,
        concept: str = "",
        primary_mechanism: str = "",
    ) -> Dict[str, Any]:
        active_frontiers = []
        if creative_plan:
            for sp in creative_plan.get("scenePlans", []):
                for c in sp.get("activeCapabilities", []):
                    code = c.get("frontierCode")
                    if code and code not in active_frontiers:
                        active_frontiers.append(code)

        ground_colors = {
            "self_improvement": "#f8fafc",
            "finance": "#030712",
            "health": "#060913",
            "facecam": "#070b14",
        }

        # Dynamic Reference Clips discovered via ReferenceDiscovery
        ref_clips = self.ref_discovery.get_reference_clip_ids(
            concept=concept,
            primary_mechanism=primary_mechanism,
            niche=niche,
            max_results=3,
        )

        return {
            "activeFrontiers": active_frontiers or ["F_BASE", "F_UBG"],
            "forbiddenPatterns": [
                "Dashboard/list-card rows with numbered pills",
                "Empty colored container boxes replacing physical mechanisms",
                "Body paragraphs rendered in text boxes",
                "Unmotivated bobbing or constant spinning",
                "Meme cards or reaction stickers",
            ],
            "referenceClips": ref_clips,
            "groundColor": ground_colors.get(niche, "#f8fafc"),
            "accentColor": "#0284c7" if niche == "self_improvement" else "#f59e0b",
        }
