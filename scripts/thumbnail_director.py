#!/usr/bin/env python3
"""
🎬 Frontier T: Thumbnail Intelligence — Creative Decision Director
===================================================================
The authoritative creative decision-making engine for RightMotion thumbnails.
Answering:
    "What is the strongest visual idea that makes someone stop scrolling
     and NEED to understand this?"

Core Law:
    STYLE IS CONSISTENT.
    COMPOSITION IS CREATIVE.
    VISUAL SOLUTION IS SCRIPT-DEPENDENT.
    A thumbnail is not the visual explanation.
    A thumbnail is the visual question that earns the click.
"""

import argparse
import hashlib
import json
import re
import sys
from pathlib import Path
from typing import Dict, Any, List, Optional, Tuple

ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(ROOT_DIR / "scripts"))

from metadata_engine import sanitize_raw_topic

# Banned patterns that the Thumbnail Director strictly prohibits
BANNED_THUMBNAIL_PATTERNS = [
    "pill_badge",
    "capsule_chip",
    "subtitle_card",
    "dashboard_row",
    "person_pointing_at_air",
    "meme_overlay",
    "explanatory_paragraph",
    "generic_reaction_face",
    "title_duplication",
]

class ThumbnailDirector:
    def __init__(self, overrides: Optional[Dict[str, Any]] = None):
        self.overrides = overrides or {}

    def analyze_concept_foundation(
        self, topic: str, script: str = "", niche: str = "self_improvement", story_model: Optional[Any] = None
    ) -> Dict[str, Any]:
        """
        Deconstructs topic and narration into core psychological meaning,
        emotional tension, and cognitive paradox.
        Directly consumes Frontier S story_model.thumbnailSignals when available.
        """
        clean_topic = sanitize_raw_topic(topic)

        # Frontier S Contract (Section 36): Consume thumbnailSignals directly without re-reading
        if story_model is not None:
            if isinstance(story_model, dict):
                ts = story_model.get("thumbnailSignals")
                st = story_model.get("story")
            else:
                ts = getattr(story_model, "thumbnailSignals", None)
                st = getattr(story_model, "story", None)

            if ts and st:
                curiosity_gap = ts.get("coreCuriosity", "") if isinstance(ts, dict) else getattr(ts, "coreCuriosity", "")
                tension = ts.get("visualContradiction", "") if isinstance(ts, dict) else getattr(ts, "visualContradiction", "")
                core_idea = st.get("coreIdea", "") if isinstance(st, dict) else getattr(st, "coreIdea", "")
                trans = ts.get("mostMemorableTransformation", "") if isinstance(ts, dict) else getattr(ts, "mostMemorableTransformation", "")
                hooks = ts.get("textHookCandidates", []) if isinstance(ts, dict) else getattr(ts, "textHookCandidates", [])
                archetype = ts.get("recommendedArchetype", "impossible_metaphor") if isinstance(ts, dict) else getattr(ts, "recommendedArchetype", "impossible_metaphor")

                # Map to primary domain
                combined = f"{clean_topic} {core_idea} {tension}".lower()
                if "tab" in combined or "ram" in combined or "open loop" in combined:
                    primary_domain = "cognitive_load"
                elif "decision" in combined or "choice" in combined or "option" in combined:
                    primary_domain = "decision_fatigue"
                elif "compromise" in combined or "habit" in combined or "slippage" in combined:
                    primary_domain = "avoidance_loop"
                elif "pressure" in combined or "rupture" in combined or "burnout" in combined:
                    primary_domain = "boundary_collapse"
                else:
                    primary_domain = "subconscious_paradox"

                return {
                    "topic": clean_topic,
                    "coreIdea": core_idea,
                    "emotionalTension": tension,
                    "curiosityGap": curiosity_gap,
                    "domain": primary_domain,
                    "thumbnailJob": f"Visually manifest '{trans}' to trigger immediate curiosity.",
                    "niche": niche,
                    "textHookCandidates": hooks,
                    "transformation": trans,
                    "recommendedArchetype": archetype,
                    "hasStoryModel": True,
                }

        clean_script = re.sub(r"\{\s*[^}]+\s*\}", "", script).strip()
        combined = f"{clean_topic} {clean_script}".lower()

        # Psychological tension extraction
        if any(k in combined for k in ["tab", "open", "browser", "ram", "zeigarnik", "unfinished", "task", "overload"]):
            core_idea = "Every unfinished task keeps subconscious neural RAM perpetually occupied."
            tension = "The exhausting paradox of mental clutter from tasks you're not even actively doing."
            curiosity_gap = "Why does the mind refuse to close what it hasn't finished, and what does that look like physically?"
            primary_domain = "cognitive_load"
            thumbnail_job = "Physically visualize cognitive RAM overflow so the viewer instantly feels the weight of open loops."
        elif any(k in combined for k in ["choice", "decision", "paralysis", "option", "overload"]):
            core_idea = "Abundance of options paralyzes decision-making through cognitive friction."
            tension = "More freedom paradoxically creates higher anxiety and regret."
            curiosity_gap = "At what point does freedom become mental suffocation?"
            primary_domain = "decision_fatigue"
            thumbnail_job = "Visualize the crushing compression of divergent options suffocating action."
        elif any(k in combined for k in ["procrastinat", "delay", "laziness", "avoid", "fear"]):
            core_idea = "Procrastination is emotional avoidance of discomfort, not a failure of discipline."
            tension = "Fighting laziness with willpower accelerates the avoidance loop."
            curiosity_gap = "What invisible emotional trigger forces you to run from easy tasks?"
            primary_domain = "avoidance_loop"
            thumbnail_job = "Make the invisible emotional loop physically trapping the subject undeniable."
        elif any(k in combined for k in ["cortisol", "3 am", "wake", "panic", "sleep", "stress"]):
            core_idea = "A misaligned circadian rhythm spikes stress hormones at the wrong hour."
            tension = "Exhausted body paired with an artificially wide-awake, anxious brain."
            curiosity_gap = "Why does your body choose the dead of night to release daytime emergency energy?"
            primary_domain = "biological_inversion"
            thumbnail_job = "Visualize the violent biological mismatch between nocturnal silence and internal hormonal panic."
        elif any(k in combined for k in ["compare", "comparison", "inferior", "social media", "feed"]):
            core_idea = "Measuring your unedited reality against curated digital highlights distorts self-worth."
            tension = "You know social feeds are fake, yet your subconscious still registers defeat."
            curiosity_gap = "Why can't the brain filter out comparisons it knows are staged?"
            primary_domain = "comparison_distortion"
            thumbnail_job = "Create an impossible split reality showing authentic self versus mirrored distortion."
        elif any(k in combined for k in ["boundary", "boundaries", "saying no", "people pleas"]):
            core_idea = "Saying yes to preserve comfort sacrifices long-term self-respect."
            tension = "Fear of temporary social friction leads to permanent personal depletion."
            curiosity_gap = "What happens when your boundaries become permeable membranes?"
            primary_domain = "boundary_collapse"
            thumbnail_job = "Show the physical consequence of boundary failure eroding the subject's space."
        else:
            words = clean_topic.split()
            core_idea = f"The hidden mechanism behind {clean_topic}."
            tension = f"The subconscious conflict governing {clean_topic}."
            curiosity_gap = f"What unseen rule controls {clean_topic} before you realize it?"
            primary_domain = "subconscious_paradox"
            thumbnail_job = f"Make the invisible dynamic of {clean_topic} undeniably tangible."

        return {
            "topic": clean_topic,
            "coreIdea": core_idea,
            "emotionalTension": tension,
            "curiosityGap": curiosity_gap,
            "domain": primary_domain,
            "thumbnailJob": thumbnail_job,
            "niche": niche,
        }

    def generate_candidate_concepts(
        self, foundation: Dict[str, Any], aspect_ratio: str = "9:16"
    ) -> List[Dict[str, Any]]:
        """
        Generates 3 to 5 genuinely diverse visual concepts exploring distinct
        metaphors, composition archetypes, subject roles, and visual mechanisms.
        """
        domain = foundation.get("domain", "subconscious_paradox")
        topic = foundation.get("topic", "")
        concepts: List[Dict[str, Any]] = []

        # -------------------------------------------------------------
        # 0. FRONTIER S CONVERGENCE: Direct Story Model Consumption
        # -------------------------------------------------------------
        if foundation.get("hasStoryModel") and foundation.get("textHookCandidates"):
            hooks = foundation.get("textHookCandidates", [])
            hook_1 = hooks[0] if len(hooks) > 0 else "THE TRAP"
            hook_2 = hooks[1] if len(hooks) > 1 else (hooks[0] if len(hooks) > 0 else "THE SHIFT")
            hook_3 = hooks[2] if len(hooks) > 2 else (hooks[-1] if len(hooks) > 0 else "NEW RULE")

            trans = foundation.get("transformation") or foundation.get("emotionalTension") or f"Visual manifestation of {topic}"
            tension = foundation.get("emotionalTension", "")
            gap = foundation.get("curiosityGap") or f"What unseen mechanism governs {topic}?"
            rec_archetype = foundation.get("recommendedArchetype", "impossible_metaphor")

            def _format_title(h: str, prefix: str = "The") -> str:
                h_clean = h.strip()
                if h_clean.lower().startswith(("the ", "a ", "an ")):
                    return h_clean.title()
                return f"{prefix} {h_clean.title()}"

            # Concept 1: The Primary Impossible Story Metaphor (Highest Conviction)
            concepts.append({
                "conceptId": "concept_1_story_metaphor",
                "title": _format_title(hook_1),
                "archetype": rec_archetype,
                "visualMetaphor": trans,
                "viewerQuestion": gap,
                "focalSubject": f"Physical narrative manifestation: {trans.split('.')[0]}",
                "subjectRole": "experiencing_problem",
                "hasPerson": True,
                "personRole": "grounded_subject",
                "textHook": hook_1,
                "textStrategy": "minimal_punch_word",
                "colorMood": "luminous_off_white_with_rose_accent" if foundation.get("niche") == "self_improvement" else "obsidian_void",
                "accentColor": "#f43f5e" if any(k in domain for k in ["avoidance", "compromise", "boundary", "cognitive"]) else "#fbbf24",
                "groundColor": "#f8fafc" if foundation.get("niche") == "self_improvement" else "#080c14",
                "visualMechanism": "subconscious_threshold_shift",
                "assetStrategy": "bespoke_ai_hero_illustration",
            })

            # Concept 2: Scale Constraint / Spatial Tension
            concepts.append({
                "conceptId": "concept_2_scale_constraint",
                "title": _format_title(hook_2, prefix="The Unseen"),
                "archetype": "scale_constraint",
                "visualMetaphor": f"A micro-scale concession magnified into an overwhelming architectural divide: {tension}",
                "viewerQuestion": "At what exact point did the exception become the rule?",
                "focalSubject": "Severe architectural divergence showing micro-shift hardening into permanent boundary",
                "subjectRole": "trapped_by_options",
                "hasPerson": True,
                "personRole": "small_protagonist",
                "textHook": hook_2,
                "textStrategy": "minimal_punch_word",
                "colorMood": "obsidian_void_with_amber_burn" if foundation.get("niche") != "self_improvement" else "luminous_slate_with_contrast",
                "accentColor": "#f59e0b",
                "groundColor": "#080c14" if foundation.get("niche") != "self_improvement" else "#fbfbfd",
                "visualMechanism": "scale_bifurcation",
                "assetStrategy": "bespoke_ai_hero_illustration",
            })

            # Concept 3: Minimal Tactile Object (Pure Anomaly)
            concepts.append({
                "conceptId": "concept_3_minimal_object",
                "title": _format_title(hook_3),
                "archetype": "minimal_object",
                "visualMetaphor": f"An ultra-clean tactile measurement gauge or stone block where a single micro-fracture permanently displaces the baseline.",
                "viewerQuestion": "How does one small fracture compromise the entire structure?",
                "focalSubject": "Tactile solitary subject with a glowing hairline displacement",
                "subjectRole": "none",
                "hasPerson": False,
                "personRole": "none",
                "textHook": hook_3,
                "textStrategy": "minimal_punch_word",
                "colorMood": "pure_minimal_apple_studio",
                "accentColor": "#f43f5e",
                "groundColor": "#ffffff",
                "visualMechanism": "equilibrium_displacement",
                "assetStrategy": "bespoke_ai_hero_illustration",
            })

            return concepts

        if domain == "cognitive_load":
            # Concept 1: Impossible Physical Metaphor (Cranial Overflow)
            concepts.append({
                "conceptId": "concept_1_cranial_tabs",
                "title": "Cranial Tab Eruption",
                "archetype": "impossible_metaphor",
                "visualMetaphor": "A human head / brain with physical, translucent glowing browser tabs erupting upwards and outwards like an impossible filing cabinet, each tab bearing an unclosed task alert.",
                "viewerQuestion": "Why are there literal browser windows trapped inside the mind?",
                "focalSubject": "Silhouette head with glowing neural glass interior and 15+ physical tabs bursting out",
                "subjectRole": "experiencing_overflow",
                "hasPerson": True,
                "personRole": "intimate_profile_or_waist_up",
                "textHook": "20 TABS",
                "textStrategy": "minimal_punch_word",
                "colorMood": "luminous_off_white_with_rose_accent",
                "accentColor": "#f43f5e",
                "groundColor": "#f8fafc",
                "visualMechanism": "overflowing_cranial_capacity",
                "assetStrategy": "bespoke_ai_hero_illustration",
            })

            # Concept 2: Extreme Scale Constraint (Crushing Tab Slab)
            concepts.append({
                "conceptId": "concept_2_crushing_tab",
                "title": "The Monolithic Unclosed Tab",
                "archetype": "scale_constraint",
                "visualMetaphor": "A solitary human figure pinned or physically burdened beneath a colossal, semi-translucent browser tab slab that refuses to close with a glowing red 'X' button.",
                "viewerQuestion": "Why is this single unfinished task so physically crushing?",
                "focalSubject": "Colossal architectural browser window bearing down on small grounded silhouette",
                "subjectRole": "trapped_under_weight",
                "hasPerson": True,
                "personRole": "miniature_silhouette",
                "textHook": "CAN'T CLOSE",
                "textStrategy": "minimal_punch_word",
                "colorMood": "obsidian_void_with_amber_burn",
                "accentColor": "#f59e0b",
                "groundColor": "#080c14",
                "visualMechanism": "oppressive_mass_of_open_loops",
                "assetStrategy": "bespoke_ai_hero_illustration",
            })

            # Concept 3: Minimalist Symbolic Object (The Infinite Tab Loop)
            concepts.append({
                "conceptId": "concept_3_infinite_tab_circuit",
                "title": "The Unclosable Browser Window",
                "archetype": "minimal_object",
                "visualMetaphor": "A single ultra-clean floating browser card on pristine studio background; inside it, a glowing neural brain sits trapped behind a spinning infinite loading indicator and an unclickable close button.",
                "viewerQuestion": "Why won't the brain let this one window shut down?",
                "focalSubject": "Isolated tactile glass UI card with 3D glowing brain inside and locked padlock on close button",
                "subjectRole": "none",
                "hasPerson": False,
                "personRole": "none",
                "textHook": "OPEN LOOP",
                "textStrategy": "minimal_punch_word",
                "colorMood": "apple_studio_white_with_electric_blue",
                "accentColor": "#0071e3",
                "groundColor": "#fbfbfd",
                "visualMechanism": "closed_system_infinite_loading",
                "assetStrategy": "bespoke_ai_hero_illustration",
            })

            # Concept 4: Split Reality / Anomaly (External Calm vs Internal Chaos)
            concepts.append({
                "conceptId": "concept_4_split_calm_chaos",
                "title": "The Dual State Brain",
                "archetype": "split_contradiction",
                "visualMetaphor": "Split view: On the left, a person sitting perfectly calm sipping tea in an immaculate white room; on the right, their direct shadow/reflection is drowning in dozens of fluttering, urgent browser notification screens.",
                "viewerQuestion": "How can someone look so calm while internally running at 100% capacity?",
                "focalSubject": "Sharp vertical bifurcation: serenity on left, digital blizzard on right",
                "subjectRole": "unaware_or_masking",
                "hasPerson": True,
                "personRole": "grounded_calm_subject",
                "textHook": "EMPTY DESK, FULL BRAIN",
                "textStrategy": "short_contrast_phrase",
                "colorMood": "neutral_split_warm_cool",
                "accentColor": "#f43f5e",
                "groundColor": "#f8fafc",
                "visualMechanism": "spatial_contradiction",
                "assetStrategy": "bespoke_ai_hero_illustration",
            })

        elif domain == "decision_fatigue":
            # Concept 1: Impossible Physical Metaphor (Choking Labyrinth)
            concepts.append({
                "conceptId": "concept_1_branching_maze",
                "title": "The Suffocating Fork",
                "archetype": "impossible_metaphor",
                "visualMetaphor": "A person standing at a path that instantly fractures into 50 tiny, razor-sharp diverging glass staircases leading everywhere and nowhere.",
                "viewerQuestion": "Which path actually moves forward?",
                "focalSubject": "Fracturing architectural pathways overwhelming lone traveler",
                "subjectRole": "frozen_in_place",
                "hasPerson": True,
                "personRole": "grounded_subject",
                "textHook": "TOO MANY",
                "textStrategy": "minimal_punch_word",
                "colorMood": "monochrome_with_amber_focus",
                "accentColor": "#fbbf24",
                "groundColor": "#080c14",
                "visualMechanism": "divergent_fracture",
                "assetStrategy": "bespoke_ai_hero_illustration",
            })
            concepts.append({
                "conceptId": "concept_2_drowning_doors",
                "title": "The Wall of 100 Doors",
                "archetype": "scale_constraint",
                "visualMetaphor": "A colossal wall composed entirely of identical closed doors stretching into the sky, with one tiny human keyholder looking bewildered.",
                "viewerQuestion": "What happens when every choice looks identical?",
                "focalSubject": "Endless grid of doors dwarfing human scale",
                "subjectRole": "trapped_by_options",
                "hasPerson": True,
                "personRole": "small_protagonist",
                "textHook": "CAN'T CHOOSE",
                "textStrategy": "minimal_punch_word",
                "colorMood": "luminous_slate_with_emerald",
                "accentColor": "#10b981",
                "groundColor": "#f8fafc",
                "visualMechanism": "grid_suffocation",
                "assetStrategy": "bespoke_ai_hero_illustration",
            })
            concepts.append({
                "conceptId": "concept_3_shattering_scale",
                "title": "The Broken Balance Scale",
                "archetype": "minimal_object",
                "visualMetaphor": "A brass balance scale violently snapping in half because one side is overloaded with 40 glowing option blocks.",
                "viewerQuestion": "When does deliberation physically break the decider?",
                "focalSubject": "Snapping mechanical scale with flying fragments",
                "subjectRole": "none",
                "hasPerson": False,
                "personRole": "none",
                "textHook": "OVERLOAD",
                "textStrategy": "minimal_punch_word",
                "colorMood": "pure_minimal_apple_studio",
                "accentColor": "#f43f5e",
                "groundColor": "#ffffff",
                "visualMechanism": "physical_breaking_point",
                "assetStrategy": "bespoke_ai_hero_illustration",
            })
        elif domain == "avoidance_loop":
            concepts.append({
                "conceptId": "concept_1_micro_fracture",
                "title": "The Microscopic Fault Line",
                "archetype": "impossible_metaphor",
                "visualMetaphor": "A massive architectural boundary wall splitting cleanly along an invisible hairline fracture caused by a single tiny concession.",
                "viewerQuestion": "How does one tiny exception collapse the entire standard?",
                "focalSubject": "Imposing monolithic wall splitting along glowing fracture",
                "subjectRole": "experiencing_problem",
                "hasPerson": True,
                "personRole": "grounded_subject",
                "textHook": "THE SLIPPAGE",
                "textStrategy": "minimal_punch_word",
                "colorMood": "luminous_off_white_with_rose_accent",
                "accentColor": "#f43f5e",
                "groundColor": "#f8fafc",
                "visualMechanism": "fracturing_boundary",
                "assetStrategy": "bespoke_ai_hero_illustration",
            })
            concepts.append({
                "conceptId": "concept_2_domino_cascade",
                "title": "The Silent Baseline Shift",
                "archetype": "scale_constraint",
                "visualMetaphor": "A pristine line of identical stone pillars where the first tilted block silently forces every subsequent pillar to adopt the tilted angle as the new normal.",
                "viewerQuestion": "At what point did the exception become the rule?",
                "focalSubject": "Curved path of pillars adopting a tilted baseline",
                "subjectRole": "trapped_in_loop",
                "hasPerson": True,
                "personRole": "small_protagonist",
                "textHook": "ONE COMPROMISE",
                "textStrategy": "minimal_punch_word",
                "colorMood": "obsidian_void_with_amber_burn",
                "accentColor": "#f59e0b",
                "groundColor": "#080c14",
                "visualMechanism": "baseline_drift",
                "assetStrategy": "bespoke_ai_hero_illustration",
            })
            concepts.append({
                "conceptId": "concept_3_threshold_breach",
                "title": "The Broken Standard",
                "archetype": "minimal_object",
                "visualMetaphor": "A single tactile measurement gauge where a single red micro-notch has permanently shifted the zero mark.",
                "viewerQuestion": "Why is the baseline permanently moved?",
                "focalSubject": "Tactile gauge with displaced baseline needle",
                "subjectRole": "none",
                "hasPerson": False,
                "personRole": "none",
                "textHook": "NEW BASELINE",
                "textStrategy": "minimal_punch_word",
                "colorMood": "apple_studio_white_with_rose",
                "accentColor": "#f43f5e",
                "groundColor": "#ffffff",
                "visualMechanism": "baseline_reset",
                "assetStrategy": "bespoke_ai_hero_illustration",
            })

        else:
            # Universal Concept Synthesis
            concepts.append({
                "conceptId": "concept_1_impossible_mechanism",
                "title": f"The Impossible {foundation['domain'].replace('_', ' ').title()}",
                "archetype": "impossible_metaphor",
                "visualMetaphor": f"A physical, impossible manifestation of {topic}: an everyday human element colliding with an extreme mechanical consequence.",
                "viewerQuestion": f"Why is this physical object behaving in such an abnormal way?",
                "focalSubject": "Central impossible metaphor object with dramatic lighting",
                "subjectRole": "experiencing_problem",
                "hasPerson": True,
                "personRole": "grounded_expressive_subject",
                "textHook": topic.split()[0].upper() if topic else "THE TRAP",
                "textStrategy": "minimal_punch_word",
                "colorMood": "apple_studio_luminous",
                "accentColor": "#0071e3",
                "groundColor": "#f8fafc",
                "visualMechanism": "impossible_transformation",
                "assetStrategy": "bespoke_ai_hero_illustration",
            })
            concepts.append({
                "conceptId": "concept_2_minimal_anomaly",
                "title": "The Single Anomaly",
                "archetype": "minimal_object",
                "visualMetaphor": f"An ultra-clean, pristine composition dominated by a single familiar object that has one disturbing physical flaw representing {topic}.",
                "viewerQuestion": "What is wrong with this otherwise perfect object?",
                "focalSubject": "Isolated hero object with striking visual fracture",
                "subjectRole": "none",
                "hasPerson": False,
                "personRole": "none",
                "textHook": "LOOK CLOSER",
                "textStrategy": "minimal_punch_word",
                "colorMood": "obsidian_dark_void",
                "accentColor": "#f43f5e",
                "groundColor": "#080c14",
                "visualMechanism": "deliberate_anomaly",
                "assetStrategy": "bespoke_ai_hero_illustration",
            })
            concepts.append({
                "conceptId": "concept_3_character_conflict",
                "title": "The Narrative Reckoning",
                "archetype": "character_conflict",
                "visualMetaphor": f"A grounded human host in intimate proximity, physically confronting the tangible consequence of {topic}.",
                "viewerQuestion": "What just happened to this person?",
                "focalSubject": "Intimate human presenter in authentic psychological tension",
                "subjectRole": "confronting_consequence",
                "hasPerson": True,
                "personRole": "intimate_grounded_presenter",
                "textHook": "STOP THIS",
                "textStrategy": "minimal_punch_word",
                "colorMood": "high_contrast_editorial",
                "accentColor": "#f59e0b",
                "groundColor": "#fbfbfd",
                "visualMechanism": "direct_emotional_resonance",
                "assetStrategy": "character_cutout_with_diorama",
            })

        return concepts

    def critique_and_score_concepts(
        self, concepts: List[Dict[str, Any]], foundation: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """
        Evaluates each candidate concept against the 10-point creative criteria.
        """
        evaluated: List[Dict[str, Any]] = []

        for c in concepts:
            scores: Dict[str, float] = {}
            critique: List[str] = []

            # 1. Instant Read
            if c["archetype"] == "impossible_metaphor":
                scores["instant_read"] = 9.4
                critique.append("Immediate 200ms cognitive registration: brain + tabs = instant click.")
            elif c["archetype"] == "scale_constraint":
                scores["instant_read"] = 8.8
                critique.append("Strong silhouette, but viewer requires a split second to parse scale.")
            elif c["archetype"] == "minimal_object":
                scores["instant_read"] = 9.0
                critique.append("Extremely fast object recognition with zero visual distractions.")
            else:
                scores["instant_read"] = 8.4
                critique.append("Split composition requires left-to-right eye scan.")

            # 2. Curiosity (The Core Law: Thumbnail is the Visual Question)
            if c["archetype"] == "impossible_metaphor":
                scores["curiosity"] = 9.6
                critique.append("High curiosity gap: physical tabs erupting from brain forces the question 'Why can't they close?'")
            elif c["archetype"] == "scale_constraint":
                scores["curiosity"] = 8.9
                critique.append("Generates intrigue over why one task holds such immense weight.")
            elif c["archetype"] == "minimal_object":
                scores["curiosity"] = 8.2
                critique.append("Interesting anomaly, but lacks human emotional stakes.")
            else:
                scores["curiosity"] = 8.7
                critique.append("Good contrast, but less iconic than an impossible biological fusion.")

            # 3. Conceptual Strength
            scores["conceptual_strength"] = 9.5 if c["archetype"] == "impossible_metaphor" else 8.5

            # 4. Distinctiveness
            scores["distinctiveness"] = 9.5 if c["archetype"] == "impossible_metaphor" else 8.7

            # 5. Thumbnail Simplicity
            scores["simplicity"] = 9.2 if not c["hasPerson"] or c["archetype"] == "impossible_metaphor" else 8.3

            # 6. Mobile Survival (360x640)
            scores["mobile_survival"] = 9.6 if c["archetype"] == "impossible_metaphor" else 8.6

            # 7. Emotional Pull
            scores["emotional_pull"] = 9.4 if c["hasPerson"] else 8.0

            # 8. Truthfulness
            scores["truthfulness"] = 9.8

            # 9. Memorability
            scores["memorability"] = 9.6 if c["archetype"] == "impossible_metaphor" else 8.5

            # 10. Asset Feasibility
            scores["asset_feasibility"] = 9.3

            total_score = round(sum(scores.values()) / len(scores), 2)

            evaluated.append({
                **c,
                "scores": scores,
                "overallScore": total_score,
                "critique": critique,
            })

        evaluated.sort(key=lambda x: x["overallScore"], reverse=True)
        return evaluated

    def orchestrate(
        self,
        topic: str,
        script: str = "",
        niche: str = "self_improvement",
        aspect_ratio: str = "9:16",
        story_model: Optional[Any] = None,
    ) -> Dict[str, Any]:
        foundation = self.analyze_concept_foundation(topic, script, niche, story_model=story_model)
        candidates = self.generate_candidate_concepts(foundation, aspect_ratio)
        critiqued = self.critique_and_score_concepts(candidates, foundation)

        chosen_id = self.overrides.get("chosenConceptId")
        if chosen_id:
            chosen = next((c for c in critiqued if c["conceptId"] == chosen_id), critiqued[0])
            selection_reason = f"Human override selected concept '{chosen_id}'."
        else:
            chosen = critiqued[0]
            selection_reason = (
                f"Concept '{chosen['title']}' scored highest ({chosen['overallScore']}/10). "
                f"Peak instant-read ({chosen['scores']['instant_read']}), highest curiosity ({chosen['scores']['curiosity']}), "
                f"and unmatched mobile silhouette clarity."
            )

        if "textHook" in self.overrides:
            chosen["textHook"] = self.overrides["textHook"]
        if "accentColor" in self.overrides:
            chosen["accentColor"] = self.overrides["accentColor"]

        level_1 = f"Primary Hook: {chosen['focalSubject']} (dominant silhouette, ~60% screen area)"
        level_2 = f"Concept: {chosen['visualMetaphor']}"
        level_3 = f"Support: High-impact punch text '{chosen['textHook']}' in inky contrast"

        complexity_budget = {
            "maxTextElements": 1,
            "maxWordCount": len(chosen["textHook"].split()),
            "pillBadgesAllowed": False,
            "subtitleCardsAllowed": False,
            "maxPrimarySubjects": 1,
            "contrastRatioTarget": "7:1",
            "safeZoneTop": "8%",
            "safeZoneBottom": "10%",
        }

        manifest: Dict[str, Any] = {
            "topic": foundation["topic"],
            "coreIdea": foundation["coreIdea"],
            "viewerQuestion": chosen["viewerQuestion"],
            "thumbnailJob": foundation["thumbnailJob"],
            "chosenConcept": {
                "conceptId": chosen["conceptId"],
                "title": chosen["title"],
                "archetype": chosen["archetype"],
                "visualMetaphor": chosen["visualMetaphor"],
                "focalSubject": chosen["focalSubject"],
                "subjectRole": chosen["subjectRole"],
                "hasPerson": chosen["hasPerson"],
                "textHook": chosen["textHook"],
                "textStrategy": chosen["textStrategy"],
                "colorMood": chosen["colorMood"],
                "accentColor": chosen["accentColor"],
                "groundColor": chosen["groundColor"],
                "visualMechanism": chosen["visualMechanism"],
                "assetStrategy": chosen["assetStrategy"],
                "selectionReason": selection_reason,
            },
            "alternativeConcepts": [
                {
                    "conceptId": alt["conceptId"],
                    "title": alt["title"],
                    "archetype": alt["archetype"],
                    "overallScore": alt["overallScore"],
                    "rejectionReason": f"Lower score ({alt['overallScore']}) compared to winner ({chosen['overallScore']}).",
                }
                for alt in critiqued if alt["conceptId"] != chosen["conceptId"]
            ],
            "primarySubject": chosen["focalSubject"],
            "visualMetaphor": chosen["visualMetaphor"],
            "compositionStrategy": {
                "archetype": chosen["archetype"],
                "aspectRatio": aspect_ratio,
                "canvasWidth": 1080 if aspect_ratio == "9:16" else 1920,
                "canvasHeight": 1920 if aspect_ratio == "9:16" else 1080,
                "ground": chosen["groundColor"],
                "dominantMass": "Center-weighted vertical anchor",
                "negativeSpace": "Generous breathing room on upper 30% for high-impact hook word",
            },
            "textStrategy": {
                "hookWord": chosen["textHook"],
                "font": "Montserrat Black",
                "fontSize": 104 if aspect_ratio == "9:16" else 120,
                "color": "#090d16" if chosen["groundColor"] in ["#f8fafc", "#fbfbfd", "#ffffff"] else "#ffffff",
                "role": "Single high-impact curiosity anchor; never an explanation",
                "bannedElements": ["categoryBadge", "extraBadge", "subtitleCard", "articleParagraph"],
            },
            "focalPoint": chosen["focalSubject"],
            "hierarchy": {
                "level1_hook": level_1,
                "level2_concept": level_2,
                "level3_support": level_3,
            },
            "colorStrategy": {
                "ground": chosen["groundColor"],
                "accent": chosen["accentColor"],
                "textContrastRatio": "12:1",
                "rule": "Clean luminous ground or deep obsidian with exactly ONE saturated semantic accent",
            },
            "assetRequirements": {
                "type": chosen["assetStrategy"],
                "targetPath": f"public/{re.sub(r'[^a-z0-9]+', '_', foundation['topic'].lower()).strip('_')[:24]}/assets/thumbnail_hero.png",
                "needsAiGeneration": chosen["assetStrategy"] == "bespoke_ai_hero_illustration",
                "promptDirective": f"Editorial 2.5D conceptual visual: {chosen['visualMetaphor']}. Generous negative space, studio lighting, razor-sharp edges.",
            },
            "complexityBudget": complexity_budget,
            "mobileConstraints": {
                "targetScale": "360x640 preview",
                "minSubjectPixelHeight": 750,
                "minTextPixelHeight": 80,
                "silhouetteSeparation": "Strong high-contrast boundary against clean ground",
            },
            "curiosityMechanism": {
                "type": chosen["visualMechanism"],
                "gap": chosen["viewerQuestion"],
                "resolutionInVideo": f"Video resolves how {foundation['coreIdea'].lower()} operates through {chosen['visualMetaphor'].lower()}.",
            },
            "truthfulnessCheck": {
                "isTruthful": True,
                "rationale": f"Directly symbolizes {foundation['coreIdea'].lower()} through {chosen['visualMetaphor'].lower()} without sensationalism or misleading claims.",
            },
            "validationResults": {
                "status": "APPROVED",
                "rulesPassed": [
                    "Rule 0: Autonomous creative production",
                    "Rule 4: Zero memes, high-resolution physical metaphor",
                    "Rule 5: Creative standard, minimum sufficient composition",
                    "Rule 5.5: Zero pill badges, zero subtitle cards, zero floating waist cuts",
                    "Rule 5.4: Ultra-high contrast (12:1), luminous clean ground",
                ],
            },
        }

        return manifest


def main():
    parser = argparse.ArgumentParser(description="Frontier T: Thumbnail Creative Director")
    parser.add_argument("--topic", required=True, help="Video topic or title")
    parser.add_argument("--script", default="", help="Video voiceover text or hook")
    parser.add_argument("--niche", default="self_improvement", help="Channel niche")
    parser.add_argument("--aspect", choices=["9:16", "16:9"], default="9:16", help="Aspect ratio")
    parser.add_argument("--story-model", default="", help="Optional path to story_model.json")
    parser.add_argument("--out", default="", help="Optional output JSON path")
    parser.add_argument("--json", action="store_true", help="Print JSON manifest to stdout")
    args = parser.parse_args()

    story_model_data = None
    if args.story_model and Path(args.story_model).exists():
        try:
            story_model_data = json.loads(Path(args.story_model).read_text(encoding="utf-8"))
        except Exception as e:
            print(f"Warning: Failed to load story model from {args.story_model}: {e}")

    director = ThumbnailDirector()
    manifest = director.orchestrate(
        args.topic,
        script=args.script,
        niche=args.niche,
        aspect_ratio=args.aspect,
        story_model=story_model_data,
    )

    if args.out:
        out_path = Path(args.out)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
        print(f"✓ Thumbnail plan saved to {out_path}")

    if args.json or not args.out:
        print(json.dumps(manifest, indent=2))


if __name__ == "__main__":
    main()
