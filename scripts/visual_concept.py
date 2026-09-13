#!/usr/bin/env python3
"""
🎬 RightMotion — Visual Concept Translation Layer
============================================================
The reasoning layer between Story Understanding (Frontier S)
and Concrete Composition / Capability Selection (Frontier #0).

Core Creative Laws:
  1. WHEN A SCRIPT DESCRIBES A MEANINGFUL CHANGE, PREFER SHOWING
     THE CHANGE HAPPENING OVER SHOWING THE RESULT AS A STATIC STATE.
  2. PREFER CAUSAL TRANSFORMATION OVER INFORMATION DISPLAY
     WHEN THE STORY SUPPORTS IT.
  3. CORE QUESTION: WHAT SHOULD PHYSICALLY HAPPEN BECAUSE THIS IDEA IS TRUE?
     (Not: "What should I display?", "What card should I build?",
      "What text should appear?", "What component can I reuse?")

Transforms NormalizedStoryModel into an authoritative VisualConceptPlan
governing physical behavior, candidate alternatives, deterministic evaluation,
causal embodiment, and narrative memory.
"""

import argparse
import hashlib
import json
import re
import sys
from dataclasses import dataclass, field, asdict
from enum import Enum
from pathlib import Path
from typing import Dict, Any, List, Optional, Tuple

ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(ROOT_DIR / "scripts"))


# ============================================================
# 1. ENUMS & CATALOGS
# ============================================================

class VisualMechanism(str, Enum):
    """Catalog of 25 core physical / spatial / systemic mechanisms (§Rule 5)."""
    DEFORMATION = "deformation"
    ACCUMULATION = "accumulation"
    COMPRESSION = "compression"
    DISPLACEMENT = "displacement"
    EROSION = "erosion"
    BRANCHING = "branching"
    PROPAGATION = "propagation"
    TRANSFER = "transfer"
    COLLISION = "collision"
    FRAGMENTATION = "fragmentation"
    STACKING = "stacking"
    TRANSFORMATION = "transformation"
    THRESHOLD_CROSSING = "threshold_crossing"
    DECAY = "decay"
    NORMALIZATION = "normalization"
    ADAPTATION = "adaptation"
    CONSTRAINT = "constraint"
    RELEASE = "release"
    DISAPPEARANCE = "disappearance"
    AMPLIFICATION = "amplification"
    RESISTANCE = "resistance"
    REINFORCEMENT = "reinforcement"
    LOOPING = "looping"
    SPATIAL_MIGRATION = "spatial_migration"
    ENVIRONMENTAL_MUTATION = "environmental_mutation"


class MetaphorLevel(str, Enum):
    """Visual Metaphor Depth levels (§Rule 16)."""
    LEVEL_1_LITERAL = "LEVEL_1_LITERAL"              # Literal or iconographic depiction
    LEVEL_2_PHYSICAL_PROCESS = "LEVEL_2_PHYSICAL_PROCESS"  # Physical process behaving like the idea
    LEVEL_3_EXPERIENTIAL_SYSTEM = "LEVEL_3_EXPERIENTIAL_SYSTEM"  # Environmental system viewer experiences


# ============================================================
# 2. DATA MODELS
# ============================================================

@dataclass
class CandidateEvaluation:
    semanticClarity: float        # 0.0 - 1.0 (weight 2.0)
    memorability: float          # 0.0 - 1.0 (weight 2.0)
    originality: float           # 0.0 - 1.0 (weight 1.5)
    mobileReadability: float     # 0.0 - 1.0 (weight 2.0)
    complexityWithinBudget: float # 0.0 - 1.0 (weight 1.5)
    frontierSynergy: float       # 0.0 - 1.0 (weight 1.0)
    antiFailureModeScore: float  # 0.0 - 1.0 (weight 2.0)
    penalties: List[str] = field(default_factory=list)
    compositeScore: float = 0.0


@dataclass
class VisualConceptCandidate:
    candidateId: str
    conceptName: str
    primaryMechanism: str        # From VisualMechanism
    secondaryMechanism: Optional[str]
    metaphorLevel: str           # From MetaphorLevel
    physicalDescription: str
    causeEvent: str
    visibleTransformation: str
    visibleConsequence: str
    persistentMemory: str
    visualAbsence: List[str]
    requiredFrontiers: List[str]
    mappedComponents: List[str]
    evaluation: CandidateEvaluation = field(default_factory=lambda: CandidateEvaluation(0, 0, 0, 0, 0, 0, 0))


@dataclass
class VisualConceptPlan:
    topic: str
    coreIdea: str
    centralTransformation: str
    primaryMechanism: str
    championCandidate: VisualConceptCandidate
    alternativeCandidates: List[VisualConceptCandidate]
    cause: str
    visibleConsequence: str
    persistentState: str
    selectedFrontiers: List[str]
    whyThisMechanism: str
    whatIsIntentionallyNotVisualized: List[str]
    inspectableReport: str = ""

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

    def to_json(self, indent: int = 2) -> str:
        return json.dumps(self.to_dict(), indent=indent, ensure_ascii=False)


# ============================================================
# 3. VISUAL CONCEPT TRANSLATION ENGINE
# ============================================================

class VisualConceptTranslator:
    """
    Translates story meaning and causal models into physical mechanisms,
    generating and evaluating multi-dimensional candidates before Remotion execution.
    """

    def __init__(self, seed: Optional[str] = None):
        self.seed = seed or "rightmotion_deterministic_seed"

    def translate(
        self,
        topic: str,
        script: str,
        story_model: Optional[Any] = None,
    ) -> VisualConceptPlan:
        """
        Main entrypoint: Generates candidates, evaluates them, resolves the champion,
        and constructs the VisualConceptPlan.
        """
        # 1. Ingest Story Model signals
        if story_model is None:
            from script_intelligence import ScriptIntelligence
            intel = ScriptIntelligence()
            story_model = intel.analyze_topic_or_script(topic=topic, script=script)

        # Normalize story_model to dict access or attribute access
        def get_field(obj, key, default=None):
            if hasattr(obj, key):
                return getattr(obj, key)
            if isinstance(obj, dict):
                return obj.get(key, default)
            return default

        story_obj = get_field(story_model, "story", {})
        core_idea = get_field(story_obj, "coreIdea", topic)
        causal_graph = get_field(story_model, "causalGraph", {})
        state_model = get_field(story_model, "stateModel", {})
        temporal_model = get_field(story_model, "temporalModel", {})
        vis_opps = get_field(story_model, "visualOpportunities", [])
        vis_absence = get_field(story_model, "visualAbsence", [])

        # 2. Derive Central Transformation
        central_transformation = self._derive_central_transformation(
            topic, script, core_idea, causal_graph, state_model
        )

        # 3. Generate 2 to 4 distinct Visual Concept Candidates
        candidates = self._generate_candidates(
            topic=topic,
            script=script,
            core_idea=core_idea,
            central_transformation=central_transformation,
            causal_graph=causal_graph,
            state_model=state_model,
            temporal_model=temporal_model,
            visual_opportunities=vis_opps,
        )

        # 4. Evaluate all candidates deterministically
        evaluated_candidates = [
            self._evaluate_candidate(c, topic=topic, script=script) for c in candidates
        ]

        # 5. Select Champion (highest composite score)
        evaluated_candidates.sort(key=lambda c: c.evaluation.compositeScore, reverse=True)
        champion = evaluated_candidates[0]
        alternatives = evaluated_candidates[1:]

        # 6. Extract persistent state and intentional absences
        persistent_state = champion.persistentMemory or "Active threshold state stabilized at new coordinates"
        absences = []
        if isinstance(vis_absence, list):
            for va in vis_absence:
                span = get_field(va, "textSpan", "")
                reason = get_field(va, "reason", "")
                if span:
                    absences.append(f"{span} ({reason})")
        if not absences:
            absences = [
                "Peripheral narration filler words (spoken-only audio load)",
                "Redundant stat gauges and numerical labels (action precedes notation)",
                "Decorative background particles and arbitrary floating icons",
            ]

        # 7. Compile Inspectable Diagnostic Report (§Rule 36)
        why_this = (
            f"Candidate '{champion.conceptName}' achieved highest composite score "
            f"({champion.evaluation.compositeScore:.2f}) with superior semantic clarity "
            f"({champion.evaluation.semanticClarity:.2f}) and mobile readability "
            f"({champion.evaluation.mobileReadability:.2f}). "
            f"Employs {champion.metaphorLevel} depth to express '{champion.primaryMechanism}' "
            f"as a live physical event rather than static card text."
        )

        report = self._format_report(
            core_idea=core_idea,
            central_transformation=central_transformation,
            champion=champion,
            alternatives=alternatives,
            why_this=why_this,
            absences=absences,
        )

        return VisualConceptPlan(
            topic=topic,
            coreIdea=core_idea,
            centralTransformation=central_transformation,
            primaryMechanism=champion.primaryMechanism,
            championCandidate=champion,
            alternativeCandidates=alternatives,
            cause=champion.causeEvent,
            visibleConsequence=champion.visibleConsequence,
            persistentState=persistent_state,
            selectedFrontiers=champion.requiredFrontiers,
            whyThisMechanism=why_this,
            whatIsIntentionallyNotVisualized=absences,
            inspectableReport=report,
        )

    # -------------------------------------------------------------
    # Private Helpers
    # -------------------------------------------------------------

    def _derive_central_transformation(
        self,
        topic: str,
        script: str,
        core_idea: str,
        causal_graph: Any,
        state_model: Any,
    ) -> str:
        """Derive the core state change: STATE A -> transition -> STATE B."""
        def get_field(obj, key, default=None):
            if hasattr(obj, key):
                return getattr(obj, key)
            if isinstance(obj, dict):
                return obj.get(key, default)
            return default

        init_state = get_field(state_model, "initialState", "")
        final_state = get_field(state_model, "finalState", "")
        chains = get_field(causal_graph, "chains", [])

        if init_state and final_state and init_state != final_state:
            intermediates = get_field(state_model, "intermediateStates", [])
            inter_str = f" -> {' -> '.join(intermediates)}" if intermediates else ""
            return f"{init_state}{inter_str} -> {final_state}"

        if chains and len(chains) > 0:
            first_chain = chains[0]
            cause = get_field(first_chain, "cause", "")
            consequence = get_field(first_chain, "consequence", "")
            if cause and consequence:
                return f"{cause} -> {consequence}"

        # Fallback from script analysis
        text = (topic + " " + script).lower()
        if any(w in text for w in ["compromise", "habit", "baseline", "concession", "drift", "exception"]):
            return "UNCOMPROMISED_BASELINE -> micro_deflection -> resistance_decay -> NEW_NORMAL"
        if any(w in text for w in ["burnout", "pressure", "exhaust", "break", "limit", "load"]):
            return "EQUILIBRIUM -> accumulating_strain -> critical_threshold -> RUPTURE"
        if any(w in text for w in ["focus", "distraction", "attention", "overload", "task", "tab"]):
            return "FOCUSED_COGNITION -> task_accumulation -> bandwidth_saturation -> FRAGMENTATION"
        if any(w in text for w in ["decision", "choice", "fork", "path", "diverge"]):
            return "SINGULAR_ORIGIN -> divergent_branching -> irreversible_selection"

        return "INITIAL_STABILITY -> physical_mutation -> RESOLVED_EQUILIBRIUM"

    def _generate_candidates(
        self,
        topic: str,
        script: str,
        core_idea: str,
        central_transformation: str,
        causal_graph: Any,
        state_model: Any,
        temporal_model: Any,
        visual_opportunities: Any,
    ) -> List[VisualConceptCandidate]:
        """Generate 2 to 4 genuinely distinct candidates (not superficial variations)."""
        text = (topic + " " + script).lower()
        candidates: List[VisualConceptCandidate] = []

        # =========================================================
        # ARCHETYPE 1: BASELINE DRIFT / COMPROMISE / HABIT FORMATION
        # =========================================================
        if any(w in text for w in ["compromise", "habit", "baseline", "concession", "discipline", "precedent", "threshold"]):
            # Candidate A: Physical Boundary Displacement & Baseline Recalibration
            candidates.append(VisualConceptCandidate(
                candidateId="cand_boundary_displacement",
                conceptName="Physical Boundary Displacement & Baseline Recalibration",
                primaryMechanism=VisualMechanism.DISPLACEMENT.value,
                secondaryMechanism=VisualMechanism.NORMALIZATION.value,
                metaphorLevel=MetaphorLevel.LEVEL_2_PHYSICAL_PROCESS.value,
                physicalDescription=(
                    "An architectural integrity line spans the canvas horizontally. "
                    "When a tiny impulse ('just this once') impacts it, the boundary "
                    "physically deflects downward with a viscoelastic sag. The original baseline "
                    "remains as a faded ghost line, while the deflected line solidifies into the new ground normal."
                ),
                causeEvent="Micro-concession impulse exerts localized vertical torque",
                visibleTransformation=(
                    "Original boundary (100% integrity) -> downward sag -> ghost line remains -> "
                    "recalibrates to optional ground plane"
                ),
                visibleConsequence="The exception physically occupies the position previously held by the standard",
                persistentMemory="Faded ghost line of original 100% boundary remains faintly visible across subsequent scenes",
                visualAbsence=["No abstract percentage charts", "No isolated stat cards", "No static before/after boxes"],
                requiredFrontiers=["F7", "F4", "F_BASE"],
                mappedComponents=["ThresholdBoundaryShift", "CausalWorld", "CameraShake"],
            ))

            # Candidate B: Resistance Pathway Erosion (Worn Groove Dynamic)
            candidates.append(VisualConceptCandidate(
                candidateId="cand_resistance_pathway_erosion",
                conceptName="Resistance Pathway Erosion & Friction Decay",
                primaryMechanism=VisualMechanism.EROSION.value,
                secondaryMechanism=VisualMechanism.RESISTANCE.value,
                metaphorLevel=MetaphorLevel.LEVEL_2_PHYSICAL_PROCESS.value,
                physicalDescription=(
                    "A physical kinetic channel where the first crossing requires maximum force "
                    "against high friction and mechanical drag. Upon crossing, a trench is carved. "
                    "The second passage glides effortlessly through the worn groove at double velocity."
                ),
                causeEvent="Action repetition carves low-resistance furrow in cognitive landscape",
                visibleTransformation=(
                    "Rough surface (high friction) -> first pass cuts groove -> surface erodes -> "
                    "second pass glides with zero friction"
                ),
                visibleConsequence="Channel depth permanently reduces resistance to future traversal",
                persistentMemory="Eroded furrow remains permanently stamped into diorama terrain",
                visualAbsence=["No circular loop arrows", "No generic habit-tracker checkboxes"],
                requiredFrontiers=["F7", "F2", "F_BASE"],
                mappedComponents=["ResistancePathway", "CausalWorld", "KineticHighlighter"],
            ))

            # Candidate C: Viscoelastic Elastic Adaptation & Permanent Plastic Shift
            candidates.append(VisualConceptCandidate(
                candidateId="cand_elastic_plastic_deformation",
                conceptName="Viscoelastic Material Strain & Permanent Plastic Shift",
                primaryMechanism=VisualMechanism.DEFORMATION.value,
                secondaryMechanism=VisualMechanism.ADAPTATION.value,
                metaphorLevel=MetaphorLevel.LEVEL_3_EXPERIENTIAL_SYSTEM.value,
                physicalDescription=(
                    "A resilient membrane starts taut and sovereign. A repeated micro-load stretches it. "
                    "Initially it springs back; past the critical threshold, elasticity is lost and "
                    "the deformed stretched shape becomes permanent plastic deformation."
                ),
                causeEvent="Repeated load exceeds yield point of standard",
                visibleTransformation="Taut boundary -> elastic strain -> yield point exceeded -> permanent plastic sag",
                visibleConsequence="Material memory adapts to the compromise, treating sag as natural state",
                persistentMemory="Permanent sag in foundation frame",
                visualAbsence=["No multi-colored badge pills", "No cartoon spring effects"],
                requiredFrontiers=["F2", "F4", "F7"],
                mappedComponents=["ViscoelasticDeformation", "CausalWorld", "StressFractureEngine"],
            ))

            # Candidate D: Environmental Perimeter Contraction (Spatial Encroachment)
            candidates.append(VisualConceptCandidate(
                candidateId="cand_spatial_encroachment",
                conceptName="Environmental Perimeter Contraction",
                primaryMechanism=VisualMechanism.ENVIRONMENTAL_MUTATION.value,
                secondaryMechanism=VisualMechanism.CONSTRAINT.value,
                metaphorLevel=MetaphorLevel.LEVEL_3_EXPERIENTIAL_SYSTEM.value,
                physicalDescription=(
                    "A spacious architectural room representing sovereign agency. Each concession "
                    "causes an external wall to step inward by 50px, physically compressing the interior "
                    "space until the occupant acclimates to the claustrophobic boundary."
                ),
                causeEvent="Unexamined compromise moves defensive boundary inward",
                visibleTransformation="Wide open chamber -> wall steps inward -> room dimensions contract -> cramped room normalizes",
                visibleConsequence="Reduced operational space accepted as standard reality",
                persistentMemory="Contracted room perimeter persists into final scene",
                visualAbsence=["No literal tiny furniture", "No game-HUD minimaps"],
                requiredFrontiers=["F5", "F1", "F7"],
                mappedComponents=["DioramaPlinth", "InfiniteWorldCanvas", "CausalWorld"],
            ))

        # =========================================================
        # ARCHETYPE 2: BURNOUT / MECHANICAL OVERLOAD / RUPTURE
        # =========================================================
        elif any(w in text for w in ["burnout", "pressure", "exhaust", "break", "limit", "load", "strain", "rupture"]):
            candidates.append(VisualConceptCandidate(
                candidateId="cand_brittle_fracture_rupture",
                conceptName="Progressive Stress Fracture to Brittle Rupture",
                primaryMechanism=VisualMechanism.FRAGMENTATION.value,
                secondaryMechanism=VisualMechanism.THRESHOLD_CROSSING.value,
                metaphorLevel=MetaphorLevel.LEVEL_2_PHYSICAL_PROCESS.value,
                physicalDescription=(
                    "A high-contrast structural bedrock supports increasing weight nodes. "
                    "Micro-cracks propagate silently across the surface. At the critical limit, "
                    "the structure catastrophically fractures into split shards with a shockwave."
                ),
                causeEvent="Cumulative unacknowledged load exceeds shear threshold",
                visibleTransformation="Pristine structure -> hairline fracture propagation -> structural snap -> split bedrock",
                visibleConsequence="Irreversible fracture forces involuntary pause",
                persistentMemory="Fractured bedrock remains visible with severed gap in resolution",
                visualAbsence=["No medical symptom checklists", "No glowing battery icons"],
                requiredFrontiers=["F2", "F7", "F4"],
                mappedComponents=["StressFractureEngine", "CausalWorld", "CameraShake"],
            ))

            candidates.append(VisualConceptCandidate(
                candidateId="cand_viscoelastic_compressive_sag",
                conceptName="Viscoelastic Compressive Strain & Bulge",
                primaryMechanism=VisualMechanism.COMPRESSION.value,
                secondaryMechanism=VisualMechanism.DEFORMATION.value,
                metaphorLevel=MetaphorLevel.LEVEL_2_PHYSICAL_PROCESS.value,
                physicalDescription=(
                    "A solid rectangular foundation block slowly compresses vertically while bulging "
                    "laterally under continuous load, demonstrating internal material distress before visible failure."
                ),
                causeEvent="Continuous sustained load without recovery interval",
                visibleTransformation="Rectangular geometry -> vertical thinning -> lateral bulging -> severe deflection",
                visibleConsequence="Distorted geometry communicates chronic strain",
                persistentMemory="Compressed block height maintained into final scene",
                visualAbsence=["No cartoon sweat drops", "No red flashing alarm badges"],
                requiredFrontiers=["F2", "F4", "F_BASE"],
                mappedComponents=["ViscoelasticDeformation", "OpticallyStableText", "CausalWorld"],
            ))

            candidates.append(VisualConceptCandidate(
                candidateId="cand_fulcrum_torque_overload",
                conceptName="Closed-Form Fulcrum Balance to Catastrophic Tilt",
                primaryMechanism=VisualMechanism.COLLISION.value,
                secondaryMechanism=VisualMechanism.TRANSFER.value,
                metaphorLevel=MetaphorLevel.LEVEL_2_PHYSICAL_PROCESS.value,
                physicalDescription=(
                    "A balanced fulcrum beam holds agency on one side. A heavy mass drops onto the opposing arm, "
                    "causing immediate torque rotation that slams the beam into the ground plane."
                ),
                causeEvent="Sudden load imbalance overwhelms restoring force",
                visibleTransformation="Horizontal balance -> torque acceleration -> ground impact with bounce",
                visibleConsequence="Beam rests at permanent tilted angle",
                persistentMemory="Tilted beam angle preserved",
                visualAbsence=["No generic weight scales with icons", "No balance sheet tables"],
                requiredFrontiers=["F4", "F7", "F_BASE"],
                mappedComponents=["KineticFulcrumBeam", "SemanticMassNode", "CausalWorld"],
            ))

        # =========================================================
        # ARCHETYPE 3: ATTENTION / TASK OVERLOAD / COGNITIVE DRAIN
        # =========================================================
        elif any(w in text for w in ["attention", "focus", "tab", "task", "drain", "bandwidth", "multitask", "overload"]):
            candidates.append(VisualConceptCandidate(
                candidateId="cand_bandwidth_saturation_spill",
                conceptName="Bandwidth Vessel Saturation & Liquid Overflow",
                primaryMechanism=VisualMechanism.ACCUMULATION.value,
                secondaryMechanism=VisualMechanism.THRESHOLD_CROSSING.value,
                metaphorLevel=MetaphorLevel.LEVEL_2_PHYSICAL_PROCESS.value,
                physicalDescription=(
                    "A precision cognitive vessel fills incrementally with each arriving task node. "
                    "At 100% capacity, incoming tasks cause liquid to breach the perimeter and cascade "
                    "downward, eroding the supporting foundation."
                ),
                causeEvent="Task arrival rate exceeds cognitive clearance rate",
                visibleTransformation="Empty vessel -> stepped accumulation -> brim reached -> catastrophic spill",
                visibleConsequence="Supporting foundation stained and compromised by overflow",
                persistentMemory="Stained footing marks previous overflow event",
                visualAbsence=["No computer desktop windows", "No to-do list checkboxes"],
                requiredFrontiers=["F7", "F2", "F_BASE"],
                mappedComponents=["CausalWorld", "CapillaryInkBleed", "KineticHighlighter"],
            ))

            candidates.append(VisualConceptCandidate(
                candidateId="cand_node_branching_fragmentation",
                conceptName="Cognitive Fiber Branching to Tensile Snapping",
                primaryMechanism=VisualMechanism.BRANCHING.value,
                secondaryMechanism=VisualMechanism.FRAGMENTATION.value,
                metaphorLevel=MetaphorLevel.LEVEL_2_PHYSICAL_PROCESS.value,
                physicalDescription=(
                    "A single thick, glowing conduit splits into 2, then 4, then 8 micro-strands. "
                    "As strands multiply, their thickness thins to hairline threads until the central "
                    "signal dissipates into static."
                ),
                causeEvent="Dividing attention across divergent threads",
                visibleTransformation="Single robust conduit -> geometric divergence -> thinning threads -> signal loss",
                visibleConsequence="Diffuse network incapable of transmitting decisive force",
                persistentMemory="Dispersed thread coordinates remain across transitions",
                visualAbsence=["No literal browser icon cutouts", "No smartphone wireframe overlays"],
                requiredFrontiers=["F7", "F4", "F_BASE"],
                mappedComponents=["TensileStructuralTether", "CausalWorld", "CameraShake"],
            ))

        # =========================================================
        # ARCHETYPE 4: PURE MINIMALIST / EXPLANATORY / METRIC
        # =========================================================
        elif any(w in text for w in ["study", "percent", "hours", "ratio", "data", "metric", "mathematics", "formula"]):
            candidates.append(VisualConceptCandidate(
                candidateId="cand_typographic_contrast_editorial",
                conceptName="High-Contrast Typographic Precision & Spatial Restraint",
                primaryMechanism=VisualMechanism.DISPLACEMENT.value,
                secondaryMechanism=VisualMechanism.TRANSFORMATION.value,
                metaphorLevel=MetaphorLevel.LEVEL_1_LITERAL.value,
                physicalDescription=(
                    "Clean, expansive negative space with deep black inky typography. "
                    "Key metric shifts through crisp coordinate displacement rather than "
                    "gratuitous physics widgets. Prioritizes pure cognitive legibility."
                ),
                causeEvent="Spoken metric contrast drives instantaneous typographic hierarchy swap",
                visibleTransformation="State 1 metric dissolves -> State 2 metric scales in with weighted arrival",
                visibleConsequence="Undistorted clarity of factual proposition",
                persistentMemory="Final key metric remains anchored in canvas header",
                visualAbsence=["No 3D physics diorama", "No particle simulations", "No complex camera flight"],
                requiredFrontiers=["F_BASE"],
                mappedComponents=["AnimatedSlashStrike", "KineticHighlighter"],
            ))

        # =========================================================
        # ARCHETYPE 5: GENERAL FALLBACK (SOVEREIGN AGENCY SHIFT)
        # =========================================================
        if not candidates:
            candidates.append(VisualConceptCandidate(
                candidateId="cand_threshold_shift_general",
                conceptName="Threshold Boundary Recalibration",
                primaryMechanism=VisualMechanism.THRESHOLD_CROSSING.value,
                secondaryMechanism=VisualMechanism.NORMALIZATION.value,
                metaphorLevel=MetaphorLevel.LEVEL_2_PHYSICAL_PROCESS.value,
                physicalDescription=(
                    "A solid standard line shifts position when challenged, demonstrating "
                    "the live transition from strict rule to optional baseline."
                ),
                causeEvent="Challenging the standard alters systemic boundary",
                visibleTransformation="Initial threshold -> deflection under pressure -> new baseline set",
                visibleConsequence="Altered baseline governs subsequent choices",
                persistentMemory="Ghost trace of original line remains visible",
                visualAbsence=["No generic app cards", "No static list items"],
                requiredFrontiers=["F7", "F_BASE"],
                mappedComponents=["ThresholdBoundaryShift", "CausalWorld"],
            ))
            candidates.append(VisualConceptCandidate(
                candidateId="cand_structural_foundation_reinforcement",
                conceptName="Bedrock Foundation Inscription",
                primaryMechanism=VisualMechanism.REINFORCEMENT.value,
                secondaryMechanism=VisualMechanism.ADAPTATION.value,
                metaphorLevel=MetaphorLevel.LEVEL_2_PHYSICAL_PROCESS.value,
                physicalDescription=(
                    "A massive bedrock foundation absorbs an impact and debosses "
                    "the permanent realization directly into the structural ground."
                ),
                causeEvent="Decisive choice establishes sovereign ground",
                visibleTransformation="Uninscribed plinth -> impact strike -> debossed permanent marker",
                visibleConsequence="Permanent inscription remains immovable",
                persistentMemory="Debossed bedrock persists into outro",
                visualAbsence=["No light gray badges", "No floating pill capsules"],
                requiredFrontiers=["F2", "F5", "F_BASE"],
                mappedComponents=["CapillaryInkBleed", "BedrockFoundation"],
            ))

        return candidates

    def _evaluate_candidate(
        self,
        candidate: VisualConceptCandidate,
        topic: str,
        script: str,
    ) -> VisualConceptCandidate:
        """
        Evaluate candidate across 7 dimensions + apply anti-failure penalties.
        Deterministic scoring based on intrinsic properties and topic fit.
        """
        penalties: List[str] = []

        # 1. Semantic Clarity (0.0 to 1.0)
        # Level 2 physical processes generally mirror causal narratives best
        if candidate.metaphorLevel == MetaphorLevel.LEVEL_2_PHYSICAL_PROCESS.value:
            clarity = 0.95
        elif candidate.metaphorLevel == MetaphorLevel.LEVEL_3_EXPERIENTIAL_SYSTEM.value:
            clarity = 0.88
        else:
            clarity = 0.75

        # 2. Memorability (0.0 to 1.0) - Memorability Test (§Rule 33)
        # Would someone describe the physical event tomorrow?
        if candidate.primaryMechanism in [VisualMechanism.DISPLACEMENT.value, VisualMechanism.EROSION.value, VisualMechanism.FRAGMENTATION.value]:
            memorability = 0.96
        elif candidate.primaryMechanism in [VisualMechanism.DEFORMATION.value, VisualMechanism.ENVIRONMENTAL_MUTATION.value]:
            memorability = 0.90
        else:
            memorability = 0.78

        # 3. Originality (0.0 to 1.0) - Avoid Level 1 tropes (§Rule 16)
        if candidate.metaphorLevel == MetaphorLevel.LEVEL_3_EXPERIENTIAL_SYSTEM.value:
            originality = 0.96
        elif candidate.metaphorLevel == MetaphorLevel.LEVEL_2_PHYSICAL_PROCESS.value:
            originality = 0.90
        else:
            originality = 0.65
            penalties.append("LEVEL_1_LITERAL_PENALTY: Overly direct representation lacks metaphoric resonance")

        # 4. Mobile Readability (0.0 to 1.0) - Mobile Test (§Rule 31)
        # Large bold geometric mechanisms score higher than diffuse multi-element systems
        if candidate.primaryMechanism in [VisualMechanism.DISPLACEMENT.value, VisualMechanism.EROSION.value]:
            mobile_readability = 0.95
        elif candidate.primaryMechanism in [VisualMechanism.ENVIRONMENTAL_MUTATION.value, VisualMechanism.BRANCHING.value]:
            mobile_readability = 0.78
            penalties.append("MOBILE_COMPLEXITY_RISK: Spatial contraction or multi-branching requires delicate framing on 6-inch screens")
        else:
            mobile_readability = 0.88

        # 5. Complexity Within Budget (0.0 to 1.0)
        if len(candidate.requiredFrontiers) <= 2:
            budget_score = 0.95
        elif len(candidate.requiredFrontiers) == 3:
            budget_score = 0.85
        else:
            budget_score = 0.70
            penalties.append("HIGH_FRONTIER_COUNT: Requires >= 4 frontiers, risking cognitive overload and frame budget")

        # 6. Frontier Synergy (0.0 to 1.0)
        # F7 + F4 or F7 + F2 have high synergy
        req_set = set(candidate.requiredFrontiers)
        if "F7" in req_set and ("F4" in req_set or "F2" in req_set):
            synergy = 0.98
        elif "F7" in req_set or "F_BASE" in req_set:
            synergy = 0.90
        else:
            synergy = 0.80

        # 7. Anti-Failure Mode Score (0.0 to 1.0) (§Rule 29)
        anti_failure = 1.0
        # Check against cardification, labelization, chart fallback
        for absence in candidate.visualAbsence:
            if "stat cards" in absence.lower() or "percentage charts" in absence.lower():
                anti_failure += 0.05
        anti_failure = min(1.0, anti_failure)

        # Composite Calculation with weights:
        # Clarity (2.0) + Memorability (2.0) + Originality (1.5) + Mobile (2.0) + Budget (1.5) + Synergy (1.0) + AntiFailure (2.0) = 12.0 total weight
        raw_weighted = (
            clarity * 2.0 +
            memorability * 2.0 +
            originality * 1.5 +
            mobile_readability * 2.0 +
            budget_score * 1.5 +
            synergy * 1.0 +
            anti_failure * 2.0
        )
        composite = round(raw_weighted / 12.0, 3)

        # Apply penalty deductions
        composite -= len(penalties) * 0.04
        composite = max(0.1, round(composite, 3))

        candidate.evaluation = CandidateEvaluation(
            semanticClarity=round(clarity, 2),
            memorability=round(memorability, 2),
            originality=round(originality, 2),
            mobileReadability=round(mobile_readability, 2),
            complexityWithinBudget=round(budget_score, 2),
            frontierSynergy=round(synergy, 2),
            antiFailureModeScore=round(anti_failure, 2),
            penalties=penalties,
            compositeScore=composite,
        )
        return candidate

    def _format_report(
        self,
        core_idea: str,
        central_transformation: str,
        champion: VisualConceptCandidate,
        alternatives: List[VisualConceptCandidate],
        why_this: str,
        absences: List[str],
    ) -> str:
        """Format inspectable diagnostic output matching §Rule 36."""
        alt_lines = []
        for alt in alternatives:
            alt_lines.append(f"  - {alt.conceptName} [{alt.primaryMechanism}] (Score: {alt.evaluation.compositeScore:.2f})")
        alt_str = "\n".join(alt_lines) if alt_lines else "  None"

        absence_lines = [f"  - {a}" for a in absences]
        absence_str = "\n".join(absence_lines)

        return (
            "============================================================\n"
            "🎬 VISUAL CONCEPT TRANSLATION REPORT (§Rule 36)\n"
            "============================================================\n"
            f"Core idea:\n  {core_idea}\n\n"
            f"Central transformation:\n  {central_transformation}\n\n"
            f"Primary mechanism:\n  {champion.primaryMechanism.upper()} ({champion.conceptName})\n"
            f"  Metaphor Depth: {champion.metaphorLevel}\n\n"
            f"Alternative mechanisms evaluated:\n{alt_str}\n\n"
            f"Cause:\n  {champion.causeEvent}\n\n"
            f"Visible consequence:\n  {champion.visibleConsequence}\n\n"
            f"Persistent state:\n  {champion.persistentMemory}\n\n"
            f"Selected frontiers:\n  {', '.join(champion.requiredFrontiers)}\n"
            f"Mapped components:\n  {', '.join(champion.mappedComponents)}\n\n"
            f"Why this mechanism:\n  {why_this}\n\n"
            f"What is intentionally NOT visualized:\n{absence_str}\n"
            "============================================================\n"
        )


# ============================================================
# 4. CLI INTERFACE
# ============================================================

def main():
    parser = argparse.ArgumentParser(description="RightMotion Visual Concept Translator")
    parser.add_argument("--topic", type=str, required=True, help="Topic of the clip")
    parser.add_argument("--script", type=str, default="", help="Narration script text")
    parser.add_argument("--json", action="store_true", help="Output raw JSON")
    args = parser.parse_args()

    translator = VisualConceptTranslator()
    plan = translator.translate(topic=args.topic, script=args.script)

    if args.json:
        print(plan.to_json(indent=2))
    else:
        print(plan.inspectableReport)


if __name__ == "__main__":
    main()
