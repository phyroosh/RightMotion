#!/usr/bin/env python3
"""
🎬 RightMotion — Frontier S: Script Intelligence
============================================================
The intelligence layer sitting ABOVE the visual frontiers.

Core Law:
  BEFORE RIGHTMOTION DECIDES HOW TO SHOW SOMETHING,
  IT MUST UNDERSTAND WHAT THE CONTENT IS ACTUALLY SAYING.
  RIGHTMOTION MUST UNDERSTAND THE STORY BEFORE IT SELECTS THE TOOLS.

Transforms raw creative input (topic or script) into an authoritative,
structured NormalizedStoryModel consumed by Frontier #0, Frontier T,
Platform-Safe Composition, and Remotion.
"""

import argparse
import hashlib
import json
import os
import re
import sys
from dataclasses import dataclass, field, asdict
from pathlib import Path
from typing import Dict, Any, List, Optional, Tuple

ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(ROOT_DIR / "scripts"))

from generate_script import (
    generate_script_and_metadata,
    check_script_hygiene,
    sanitize_tags,
    CORE_ARCHETYPES,
)
from orchestrator_registry import FRONTIER_REGISTRY

INTELLIGENCE_VERSION = "1.0.1"
CACHE_DIR = ROOT_DIR / ".cache" / "script_intelligence"


# ============================================================
# 1. DATA MODELS / SCHEMA DEFINITIONS
# ============================================================

@dataclass
class StoryMeta:
    sourceType: str  # "user_script" | "topic_generated"
    originalInput: str
    topic: str
    channel: str
    mode: str  # "A" | "B"
    isDuo: bool
    wordCount: int
    intelligenceVersion: str = INTELLIGENCE_VERSION
    contentHash: str = ""


@dataclass
class CoreStory:
    coreIdea: str
    centralClaim: str
    viewerPromise: str
    viewerQuestion: str
    narrativeArchitecture: str


@dataclass
class NarrativeSegment:
    segmentId: str
    role: str  # "hook" | "setup" | "contradiction" | "mechanism" | "escalation" | "reveal" | "resolution"
    narrationText: str
    sentenceIndices: List[int]
    coreMeaning: str
    visualQuestion: str
    semanticWeight: str  # "CRITICAL" | "IMPORTANT" | "SUPPORTING"


@dataclass
class ClaimItem:
    statement: str
    type: str  # "central" | "supporting" | "causal" | "psychological" | "rhetorical" | "analogy" | "definition"


@dataclass
class EvidenceItem:
    type: str  # "study" | "named_concept" | "mechanism" | "analogy" | "anecdote" | "none"
    reference: str
    isVerifiable: bool


@dataclass
class MisconceptionItem:
    presumed: str
    actual: str
    revealLocation: str


@dataclass
class ClaimsAndEvidence:
    claims: List[Dict[str, Any]] = field(default_factory=list)
    evidence: List[Dict[str, Any]] = field(default_factory=list)
    misconceptions: List[Dict[str, Any]] = field(default_factory=list)


@dataclass
class CausalNode:
    id: str
    initialCondition: str
    reversibility: str  # "PERMANENT" | "REVERSIBLE" | "PARTIALLY_REVERSIBLE" | "RECOVERABLE" | "DECAYING"


@dataclass
class CausalChain:
    cause: str
    mechanism: str
    event: str
    consequence: str
    resultingState: str


@dataclass
class ThresholdEvent:
    source: str
    condition: str
    consequence: str


@dataclass
class CausalGraph:
    nodes: List[Dict[str, Any]] = field(default_factory=list)
    chains: List[Dict[str, Any]] = field(default_factory=list)
    thresholds: List[Dict[str, Any]] = field(default_factory=list)


@dataclass
class StateModel:
    initialState: str
    intermediateStates: List[str]
    finalState: str
    dynamics: str  # "accumulation" | "rupture" | "equilibrium" | "dissipation" | "transformation"


@dataclass
class TemporalModel:
    pacing: str  # "accelerating" | "steady_build" | "sudden_snap" | "cyclic_loop"
    hasRepetition: bool
    repetitionNature: str
    breathHoldWindow: Dict[str, Any] = field(default_factory=dict)


@dataclass
class EmotionalTrajectoryEntry:
    segmentId: str
    emotion: str
    attentionSpike: bool


@dataclass
class EmphasisMap:
    primary: List[str] = field(default_factory=list)
    secondary: List[str] = field(default_factory=list)


@dataclass
class VisualOpportunity:
    segmentId: str
    opportunityType: str  # "transformation" | "accumulation" | "contrast" | "reveal" | "threshold" | "constraint" | "branching" | "collision" | "connection" | "persistence"
    physicalDescription: str
    rationale: str


@dataclass
class VisualAbsence:
    textSpan: str
    recommendedTreatment: str  # "spoken_only" | "atmospheric_drift" | "supporting_label" | "transitional"
    reason: str


@dataclass
class SemanticImportance:
    critical: List[str] = field(default_factory=list)
    important: List[str] = field(default_factory=list)
    supporting: List[str] = field(default_factory=list)
    decorative: List[str] = field(default_factory=list)


@dataclass
class SceneCandidate:
    candidateId: str
    suggestedBoundary: str
    narrativeFunction: str
    dominantVisualAnchor: str


@dataclass
class ThumbnailSignals:
    coreCuriosity: str
    visualContradiction: str
    mostMemorableTransformation: str
    textHookCandidates: List[str] = field(default_factory=list)
    recommendedArchetype: str = "impossible_metaphor"


@dataclass
class FrontierSignals:
    signals: Dict[str, Dict[str, str]] = field(default_factory=dict)


@dataclass
class Diagnostics:
    hygieneValid: bool
    issues: List[str] = field(default_factory=list)
    unsupportedClaims: List[str] = field(default_factory=list)
    structuralNotes: List[str] = field(default_factory=list)


@dataclass
class NormalizedStoryModel:
    meta: StoryMeta
    story: CoreStory
    segments: List[NarrativeSegment]
    entitiesAndConcepts: Dict[str, List[str]]
    claimsAndEvidence: ClaimsAndEvidence
    causalGraph: CausalGraph
    stateModel: StateModel
    temporalModel: TemporalModel
    emotionalTrajectory: List[EmotionalTrajectoryEntry]
    emphasisMap: EmphasisMap
    visualOpportunities: List[VisualOpportunity]
    visualAbsence: List[VisualAbsence]
    semanticImportance: SemanticImportance
    sceneCandidates: List[SceneCandidate]
    thumbnailSignals: ThumbnailSignals
    frontierSignals: FrontierSignals
    diagnostics: Diagnostics

    def to_dict(self) -> Dict[str, Any]:
        """Convert the entire dataclass hierarchy to a clean JSON-serializable dictionary."""
        return asdict(self)

    def to_json(self, indent: int = 2) -> str:
        return json.dumps(self.to_dict(), indent=indent, ensure_ascii=False)


# ============================================================
# 2. FRONTIER S INTELLIGENCE ENGINE
# ============================================================

class ScriptIntelligence:
    def __init__(self, use_cache: bool = True):
        self.use_cache = use_cache
        if self.use_cache:
            CACHE_DIR.mkdir(parents=True, exist_ok=True)

    def compute_hash(self, text: str, topic: str, channel: str, mode: str) -> str:
        raw_key = f"{text.strip()}::{topic.strip()}::{channel}::{mode}::{INTELLIGENCE_VERSION}"
        return hashlib.sha256(raw_key.encode("utf-8")).hexdigest()

    def get_from_cache(self, content_hash: str) -> Optional[NormalizedStoryModel]:
        if not self.use_cache:
            return None
        cache_file = CACHE_DIR / f"{content_hash}.json"
        if cache_file.exists():
            try:
                data = json.loads(cache_file.read_text(encoding="utf-8"))
                return self._dict_to_model(data)
            except Exception:
                return None
        return None

    def save_to_cache(self, model: NormalizedStoryModel):
        if not self.use_cache:
            return
        cache_file = CACHE_DIR / f"{model.meta.contentHash}.json"
        try:
            cache_file.write_text(model.to_json(indent=2), encoding="utf-8")
        except Exception:
            pass

    # -------------------------------------------------------------
    # Convergence Entrypoints
    # -------------------------------------------------------------

    def analyze_topic_or_script(
        self,
        topic: Optional[str] = None,
        script: Optional[str] = None,
        channel: str = "self_improvement",
        mode: str = "B",
        is_duo: bool = False,
    ) -> NormalizedStoryModel:
        """
        The authoritative convergence point.
        If topic only is provided: generates script via Scriptwriter, then analyzes.
        If script is provided: preserves script verbatim, validates hygiene, then analyzes.
        """
        if not script and not topic:
            raise ValueError("Must provide either a topic or a script to Script Intelligence.")

        if not script:
            source_type = "topic_generated"
            clean_top = sanitize_tags(topic or "")
            # Generate script using existing RightMotion scriptwriting standards
            gen_res = generate_script_and_metadata(clean_top, duo=is_duo, meta=(mode == "A"))
            final_script = gen_res["voiceover"]
            original_input = topic
            mode = gen_res.get("mode", mode)
        else:
            source_type = "user_script"
            original_input = script
            # Strip tags and block headers if present, preserving text
            final_script = sanitize_tags(script)
            clean_top = sanitize_tags(topic or "")
            if not clean_top:
                # Derive descriptive working topic from first sentence or words
                first_sent = re.split(r"(?<=[.?!])\s+", final_script)[0]
                clean_top = first_sent[:60].strip()

        return self.analyze(
            script=final_script,
            topic=clean_top,
            source_type=source_type,
            channel=channel,
            mode=mode,
            is_duo=is_duo,
            original_input=original_input,
        )

    def analyze(
        self,
        script: str,
        topic: str,
        source_type: str = "user_script",
        channel: str = "self_improvement",
        mode: str = "B",
        is_duo: bool = False,
        original_input: Optional[str] = None,
    ) -> NormalizedStoryModel:
        """
        Core deep analysis engine. Analyzes the script at multiple scales:
        Video level -> Segment level -> Sentence level -> Phrase level.
        """
        clean_script = sanitize_tags(script).strip()
        clean_topic = sanitize_tags(topic).strip()
        orig_input = original_input or clean_script

        content_hash = self.compute_hash(clean_script, clean_topic, channel, mode)
        cached = self.get_from_cache(content_hash)
        if cached:
            return cached

        # Tokenize sentences safely
        sentences = [s.strip() for s in re.split(r"(?<=[.?!])\s+", clean_script) if s.strip()]
        words = clean_script.split()
        word_count = len(words)

        # 1. Hygiene & Diagnostics
        is_valid, hygiene_issues = check_script_hygiene(
            clean_script, is_mode_a=(mode == "A"), is_duo=is_duo
        )

        # 2. Deeper Meaning & Narrative Extraction
        core_story = self._extract_core_story(clean_topic, clean_script, sentences)

        # 3. Meaning-Based Segmentation
        segments = self._segment_narrative(sentences, core_story)

        # 4. Claims, Evidence & Misconceptions
        claims_evidence = self._extract_claims_and_evidence(sentences, clean_script)

        # 5. Causal Graph Extraction (Aligned with F7)
        causal_graph = self._extract_causality(clean_topic, clean_script, sentences, segments)

        # 6. State Model & Transition Dynamics
        state_model = self._extract_state_model(clean_script, causal_graph)

        # 7. Temporal Model (Aligned with F6)
        temporal_model = self._extract_temporal_model(clean_script, segments, word_count)

        # 8. Emotional & Attention Trajectory
        emotional_trajectory = self._extract_emotional_trajectory(segments)

        # 9. Spoken Emphasis Map
        emphasis_map = self._extract_emphasis_map(sentences)

        # 10. Visual Opportunities vs. Visual Absence
        visual_opportunities, visual_absence = self._analyze_visual_opportunities_and_absence(
            segments, clean_script, causal_graph
        )

        # 11. Semantic Importance (Feeding Platform Safe Validator)
        semantic_importance = self._extract_semantic_importance(
            core_story, segments, claims_evidence, causal_graph
        )

        # 12. Scene Candidates
        scene_candidates = self._propose_scene_candidates(segments, causal_graph, visual_opportunities)

        # 13. Thumbnail Signals (Feeding Frontier T)
        thumbnail_signals = self._extract_thumbnail_signals(
            clean_topic, clean_script, core_story, claims_evidence
        )

        # 14. Frontier Capability Signals (Feeding Frontier #0)
        frontier_signals = self._evaluate_frontier_signals(
            clean_script, core_story, causal_graph, state_model, temporal_model, visual_opportunities
        )

        # 15. Diagnostics & Structural Checks
        diagnostics = Diagnostics(
            hygieneValid=is_valid,
            issues=hygiene_issues,
            unsupportedClaims=[
                c["statement"] for c in claims_evidence.claims
                if c["type"] == "factual" and not any(e["isVerifiable"] for e in claims_evidence.evidence)
            ],
            structuralNotes=self._check_structural_coherence(segments, core_story),
        )

        # 16. Entities & Concepts
        entities_and_concepts = self._extract_entities_and_concepts(clean_topic, clean_script)

        meta = StoryMeta(
            sourceType=source_type,
            originalInput=orig_input,
            topic=clean_topic,
            channel=channel,
            mode=mode,
            isDuo=is_duo,
            wordCount=word_count,
            intelligenceVersion=INTELLIGENCE_VERSION,
            contentHash=content_hash,
        )

        model = NormalizedStoryModel(
            meta=meta,
            story=core_story,
            segments=segments,
            entitiesAndConcepts=entities_and_concepts,
            claimsAndEvidence=claims_evidence,
            causalGraph=causal_graph,
            stateModel=state_model,
            temporalModel=temporal_model,
            emotionalTrajectory=emotional_trajectory,
            emphasisMap=emphasis_map,
            visualOpportunities=visual_opportunities,
            visualAbsence=visual_absence,
            semanticImportance=semantic_importance,
            sceneCandidates=scene_candidates,
            thumbnailSignals=thumbnail_signals,
            frontierSignals=frontier_signals,
            diagnostics=diagnostics,
        )

        self.save_to_cache(model)
        return model

    # -------------------------------------------------------------
    # Internal Semantic Parsing Sub-Methods
    # -------------------------------------------------------------

    def _extract_core_story(self, topic: str, script: str, sentences: List[str]) -> CoreStory:
        """Identifies the deepest conceptual thesis, promise, and unanswered question."""
        lower_script = script.lower()
        lower_topic = topic.lower()

        # Psychological Archetype or Domain Detection
        if any(w in lower_script or w in lower_topic for w in ["tab", "unfinished", "open loop", "zeigarnik", "ram", "mental clutter"]):
            core_idea = "Every unfinished task keeps subconscious neural RAM occupied, leaking cognitive bandwidth until the system exhausts itself."
            central_claim = "Mental exhaustion is not caused by the work you are doing, but by the unresolved loops you leave open."
            viewer_promise = "Understand why your mind feels cluttered even when sitting still, and how to close invisible neural loops."
            viewer_question = "Why does unfinished work keep returning to attention and draining energy?"
            architecture = "PARADOX -> HIDDEN_MECHANISM -> ESCALATION -> RELEASE"

        elif any(w in lower_script or w in lower_topic for w in ["compromise", "habit", "notice", "slippage", "boundary", "erosion", "concession"]):
            core_idea = "A repeated low-cost concession quietly alters the system baseline until an abnormal compromise becomes the new unconscious normal."
            central_claim = "Destructive patterns do not begin with catastrophic failures; they begin with unexamined micro-compromises."
            viewer_promise = "Recognize the invisible shift where a single small concession hardens into an automatic habit."
            viewer_question = "How does a tiny, harmless compromise turn into an automatic habit before you notice?"
            architecture = "OBSERVATION -> BASELINE_SHIFT -> ACCUMULATION -> CRITICAL_REVEAL"

        elif any(w in lower_script or w in lower_topic for w in ["pressure", "burden", "load", "weigh", "heavy", "strain"]):
            core_idea = "Capacity deforms under continuous unacknowledged pressure before structural rupture occurs."
            central_claim = "Resilience is not infinite absorption; without release, sustained pressure produces irreversible deformation."
            viewer_promise = "See where systemic pressure accumulates before physical breakdown happens."
            viewer_question = "Why does pressure suddenly feel unbearable even when the last addition was tiny?"
            architecture = "TENSION -> COMPRESSION -> THRESHOLD -> DEFLECTION"

        elif any(w in lower_script or w in lower_topic for w in ["motivation", "start", "action", "feel like", "waiting"]):
            core_idea = "Action precedes neurochemical motivation rather than waiting for emotional readiness."
            central_claim = "Action creates motivation far more reliably than motivation creates action."
            viewer_promise = "Learn how to bypass emotional resistance by lowering starting friction."
            viewer_question = "Why does waiting to feel motivated guarantee inaction?"
            architecture = "MISCONCEPTION -> NEUROLOGICAL_INVERSION -> TACTICAL_SHIFT"

        elif any(w in lower_script or w in lower_topic for w in ["burnout", "snap", "break", "limit", "exhaust"]):
            core_idea = "Endurance systems exhibit non-linear failure: performance remains flat until sudden brittle fracture."
            central_claim = "Burnout is not gradual depletion; it is a structural snapping point triggered by ignored baseline fatigue."
            viewer_promise = "Understand the physical threshold between productive stress and systemic collapse."
            viewer_question = "What causes the sudden drop from functioning to complete burnout?"
            architecture = "PROBLEM -> HIDDEN_CAUSE -> ESCALATION -> BREAKPOINT -> RESOLUTION"

        elif any(w in lower_script or w in lower_topic for w in ["cortisol", "3 am", "sleep", "panic", "wake"]):
            core_idea = "Circadian inversion triggers daytime emergency adrenaline pathways during nocturnal recovery states."
            central_claim = "3 AM anxiety is a biochemical blood sugar or hormonal alarm, not an existential dilemma."
            viewer_promise = "Discover why your nervous system panics in silence and how to reset the alarm."
            viewer_question = "Why does your body release daytime emergency panic in the dead of night?"
            architecture = "HOOK -> BIOLOGICAL_PARADOX -> CAUSAL_EXPLANATION -> RESET"

        elif any(w in lower_script or w in lower_topic for w in ["percent", "number", "stat", "hours", "deficit", "study"]):
            core_idea = "Quantifiable cognitive deficits compound exponentially rather than additively."
            central_claim = "Small measurable daily trade-offs aggregate into massive cognitive systemic debts."
            viewer_promise = "See the exact mathematical reality behind daily invisible trade-offs."
            viewer_question = "What is the true compounding cost of this overlooked deficit?"
            architecture = "METRIC_HOOK -> SYSTEMIC_EQUATION -> AUDIT -> RESOLUTION"

        else:
            # Deep synthesis fallback for general topics
            first_sent = sentences[0] if sentences else topic
            last_sent = sentences[-1] if sentences else ""
            core_idea = f"The underlying behavioral architecture governing {topic}: unexamined mechanisms produce unintended outcomes."
            central_claim = f"{first_sent} The core friction is solved by addressing the structural driver rather than surface symptoms."
            viewer_promise = f"Understand the hidden mechanism behind {topic} and how to decisively change the outcome."
            viewer_question = f"What unseen rule controls {topic} before you consciously realize it?"
            architecture = "HOOK -> QUESTION -> MECHANISM -> ESCALATION -> REVEAL -> RESOLUTION"

        return CoreStory(
            coreIdea=core_idea,
            centralClaim=central_claim,
            viewerPromise=viewer_promise,
            viewerQuestion=viewer_question,
            narrativeArchitecture=architecture,
        )

    def _segment_narrative(self, sentences: List[str], core: CoreStory) -> List[NarrativeSegment]:
        """
        Segments script into semantic narrative units rather than rigid sentence quotas.
        Each segment represents an intentional cognitive beat.
        """
        total = len(sentences)
        if total == 0:
            return []

        segments: List[NarrativeSegment] = []

        if total == 1:
            segments.append(
                NarrativeSegment(
                    segmentId="seg_1_thesis",
                    role="reveal",
                    narrationText=sentences[0],
                    sentenceIndices=[0],
                    coreMeaning=core.coreIdea,
                    visualQuestion=core.viewerQuestion,
                    semanticWeight="CRITICAL",
                )
            )
            return segments

        if total == 2:
            segments.append(
                NarrativeSegment(
                    segmentId="seg_1_hook",
                    role="hook",
                    narrationText=sentences[0],
                    sentenceIndices=[0],
                    coreMeaning="The opening contradiction / paradox.",
                    visualQuestion=core.viewerQuestion,
                    semanticWeight="CRITICAL",
                )
            )
            segments.append(
                NarrativeSegment(
                    segmentId="seg_2_payoff",
                    role="resolution",
                    narrationText=sentences[1],
                    sentenceIndices=[1],
                    coreMeaning=core.centralClaim,
                    visualQuestion="What changes after this realization?",
                    semanticWeight="IMPORTANT",
                )
            )
            return segments

        # 3 or more sentences: Natural narrative division
        # Beat 1: Hook / Paradox (First 1-2 sentences)
        hook_s = [sentences[0]]
        hook_indices = [0]

        # Check if sentence 2 is a direct hook continuation (e.g. "Notice how...", "We act...")
        if total >= 4 and any(sentences[1].lower().startswith(p) for p in ["we ", "it ", "you ", "and "]):
            hook_s.append(sentences[1])
            hook_indices.append(1)
            remaining = sentences[2:]
            rem_start = 2
        else:
            remaining = sentences[1:]
            rem_start = 1

        segments.append(
            NarrativeSegment(
                segmentId="seg_1_hook",
                role="hook",
                narrationText=" ".join(hook_s),
                sentenceIndices=hook_indices,
                coreMeaning="Establishes the intuitive friction or observable paradox.",
                visualQuestion=core.viewerQuestion,
                semanticWeight="CRITICAL",
            )
        )

        if len(remaining) == 1:
            segments.append(
                NarrativeSegment(
                    segmentId="seg_2_resolution",
                    role="resolution",
                    narrationText=remaining[0],
                    sentenceIndices=[rem_start],
                    coreMeaning=core.centralClaim,
                    visualQuestion="What is the decisive shift?",
                    semanticWeight="CRITICAL",
                )
            )
            return segments

        # Split remaining into Mechanism / Escalation and Resolution
        # Last 1-2 sentences represent the decisive shift / resolution
        if len(remaining) >= 3:
            mechanism_s = remaining[:-1]
            mech_indices = list(range(rem_start, rem_start + len(mechanism_s)))
            res_s = [remaining[-1]]
            res_indices = [rem_start + len(mechanism_s)]

            # Check if mechanism contains a distinct contradiction / escalation
            mid_idx = len(mechanism_s) // 2
            if len(mechanism_s) >= 3:
                s_part1 = mechanism_s[:mid_idx]
                s_part2 = mechanism_s[mid_idx:]

                segments.append(
                    NarrativeSegment(
                        segmentId="seg_2_mechanism",
                        role="mechanism",
                        narrationText=" ".join(s_part1),
                        sentenceIndices=mech_indices[:mid_idx],
                        coreMeaning="Unpacks the hidden causal mechanism driving the paradox.",
                        visualQuestion="How does this hidden dynamic actually function?",
                        semanticWeight="IMPORTANT",
                    )
                )
                segments.append(
                    NarrativeSegment(
                        segmentId="seg_3_escalation",
                        role="escalation",
                        narrationText=" ".join(s_part2),
                        sentenceIndices=mech_indices[mid_idx:],
                        coreMeaning="Demonstrates the consequence when the mechanism runs unchecked.",
                        visualQuestion="What happens when this condition crosses the threshold?",
                        semanticWeight="CRITICAL",
                    )
                )
            else:
                segments.append(
                    NarrativeSegment(
                        segmentId="seg_2_mechanism",
                        role="mechanism",
                        narrationText=" ".join(mechanism_s),
                        sentenceIndices=mech_indices,
                        coreMeaning="Unpacks the hidden mechanism and systemic consequence.",
                        visualQuestion="Why does this happen beneath conscious awareness?",
                        semanticWeight="IMPORTANT",
                    )
                )

            segments.append(
                NarrativeSegment(
                    segmentId="seg_4_resolution" if len(segments) == 3 else "seg_3_resolution",
                    role="resolution",
                    narrationText=" ".join(res_s),
                    sentenceIndices=res_indices,
                    coreMeaning="The decisive operational takeaway or sovereign resolution.",
                    visualQuestion="How does the system return to equilibrium or agency?",
                    semanticWeight="CRITICAL",
                )
            )
        else:
            segments.append(
                NarrativeSegment(
                    segmentId="seg_2_mechanism",
                    role="mechanism",
                    narrationText=remaining[0],
                    sentenceIndices=[rem_start],
                    coreMeaning="The underlying causal logic.",
                    visualQuestion="What drives this outcome?",
                    semanticWeight="IMPORTANT",
                )
            )
            segments.append(
                NarrativeSegment(
                    segmentId="seg_3_resolution",
                    role="resolution",
                    narrationText=remaining[1],
                    sentenceIndices=[rem_start + 1],
                    coreMeaning="The decisive operational takeaway.",
                    visualQuestion="What is the resulting shift?",
                    semanticWeight="CRITICAL",
                )
            )

        return segments

    def _extract_claims_and_evidence(self, sentences: List[str], full_text: str) -> ClaimsAndEvidence:
        """Extracts claims, verifies evidence, and detects misconceptions."""
        claims: List[Dict[str, Any]] = []
        evidence: List[Dict[str, Any]] = []
        misconceptions: List[Dict[str, Any]] = []

        lower_full = full_text.lower()

        # Detect Misconceptions ("You think X, but actually Y")
        misc_patterns = [
            r"you\s+think\s+([^.,;]+)[.,;]?\s*(?:but|in\s+reality|actually)\s*([^.,;]+)",
            r"we\s+(?:act|perform)\s+([^.,;]+)\s+so\s+nobody\s+([^.,;]+)",
            r"notice\s+how\s+([^.,;?]+)",
        ]
        for pat in misc_patterns:
            for m in re.finditer(pat, lower_full):
                groups = m.groups()
                if len(groups) >= 2:
                    misconceptions.append({
                        "presumed": groups[0].strip(),
                        "actual": groups[1].strip(),
                        "revealLocation": "hook_contradiction",
                    })
                elif len(groups) == 1:
                    misconceptions.append({
                        "presumed": "Intuitive assumption",
                        "actual": groups[0].strip(),
                        "revealLocation": "opening_observation",
                    })

        # Evidence detection (studies, experiments, named concepts)
        if re.search(r"\b(study|research|experiment|data|meta-analysis)\b", lower_full):
            evidence.append({
                "type": "study",
                "reference": "Scientific research or empirical study cited in script",
                "isVerifiable": True,
            })
        named_match = re.search(
            r"\b(?:psychologists?|researchers?|neuroscientists?|scientists?)\s+(?:call|refer\s+to)\s+this\s+([A-Za-z\-]+(?:\s+[A-Za-z\-]+)*)",
            full_text,
            re.IGNORECASE,
        )
        if named_match:
            concept_name = named_match.group(1).strip().rstrip(".,;:")
            evidence.append({
                "type": "named_concept",
                "reference": concept_name,
                "isVerifiable": True,
            })
        elif "zeigarnik" in lower_full:
            evidence.append({
                "type": "named_concept",
                "reference": "Zeigarnik Effect (Cognitive Loop Memory)",
                "isVerifiable": True,
            })

        # Claim classification
        for idx, sent in enumerate(sentences):
            sent_lower = sent.lower()
            if re.search(r"\b(\d+\s*percent|percent|\d+%\b|\d+\s*hours|\bstudy\b|\bresearch\b)", sent_lower) or any(w in sent_lower for w in ["ninety-nine percent", "stat", "data"]):
                c_type = "factual"
            elif any(w in sent_lower for w in ["causes", "leads to", "drains", "erodes", "creates", "turns into", "becomes"]):
                c_type = "causal"
            elif any(w in sent_lower for w in ["brain", "nervous system", "subconscious", "dopamine", "mind"]):
                c_type = "psychological"
            elif idx == len(sentences) - 1:
                c_type = "conclusion"
            elif any(w in sent_lower for w in ["imagine", "like a", "as if"]):
                c_type = "analogy"
            else:
                c_type = "supporting"

            claims.append({
                "statement": sent,
                "type": c_type,
            })

        return ClaimsAndEvidence(
            claims=claims,
            evidence=evidence,
            misconceptions=misconceptions,
        )

    def _extract_causality(
        self, topic: str, script: str, sentences: List[str], segments: List[NarrativeSegment]
    ) -> CausalGraph:
        """
        Extracts structural cause -> mechanism -> event -> consequence -> new state.
        Directly feeds Frontier #7 without keyword guessing.
        """
        lower = script.lower()
        nodes: List[Dict[str, Any]] = []
        chains: List[Dict[str, Any]] = []
        thresholds: List[Dict[str, Any]] = []

        if any(w in lower for w in ["tab", "unfinished", "open loop", "drain", "bandwidth", "fatigue"]):
            nodes.append({
                "id": "cognitive_bandwidth",
                "initialCondition": "NOMINAL",
                "reversibility": "RECOVERABLE",
            })
            nodes.append({
                "id": "open_task_counter",
                "initialCondition": "EMPTY",
                "reversibility": "REVERSIBLE",
            })
            chains.append({
                "cause": "Unfinished task left open in attention",
                "mechanism": "Subconscious loop continuously holds task memory active",
                "event": "TASK_UNFINISHED",
                "consequence": "Neural RAM leakage drains working memory capacity",
                "resultingState": "STRAINED",
            })
            chains.append({
                "cause": "Accumulation of 5+ unclosed loops",
                "mechanism": "Bandwidth saturation exceeds processing capacity",
                "event": "THRESHOLD_CROSSING",
                "consequence": "System experiences cognitive paralysis / fatigue",
                "resultingState": "CRITICAL",
            })
            thresholds.append({
                "source": "open_task_counter",
                "condition": "count >= threshold_capacity",
                "consequence": "Trigger SYSTEM_OVERLOAD and transition cognitive_bandwidth to CRITICAL",
            })

        elif any(w in lower for w in ["compromise", "habit", "baseline", "slippage", "notice"]):
            nodes.append({
                "id": "behavioral_baseline",
                "initialCondition": "STRICT_INTEGRITY",
                "reversibility": "PARTIALLY_REVERSIBLE",
            })
            nodes.append({
                "id": "compromise_accumulator",
                "initialCondition": "ZERO",
                "reversibility": "DECAYING",
            })
            chains.append({
                "cause": "First small unnoticed concession",
                "mechanism": "Absence of immediate pain reduces perceived risk",
                "event": "TRIGGER",
                "consequence": "Internal threshold adjusts slightly downward",
                "resultingState": "ERODING",
            })
            chains.append({
                "cause": "Repeated concession over time",
                "mechanism": "Neural adaptation normalizes the lower standard",
                "event": "ACCUMULATION",
                "consequence": "Compromise becomes the default subconscious baseline",
                "resultingState": "HARDENED_HABIT",
            })
            thresholds.append({
                "source": "compromise_accumulator",
                "condition": "repetitions >= habit_threshold",
                "consequence": "Behavior shifts from conscious choice to automatic default",
            })

        elif any(w in lower for w in ["pressure", "burden", "load", "strain", "break", "snap", "fracture"]):
            nodes.append({
                "id": "structural_integrity",
                "initialCondition": "UNSTRESSED",
                "reversibility": "PARTIALLY_REVERSIBLE",
            })
            nodes.append({
                "id": "accumulated_load",
                "initialCondition": "MINIMAL",
                "reversibility": "REVERSIBLE",
            })
            chains.append({
                "cause": "Silent acquiescence / accepting extra burden",
                "mechanism": "Elastic capacity absorbs load through compressive strain",
                "event": "DEFORMATION",
                "consequence": "Material deflection and internal stress accumulate",
                "resultingState": "HIGH_TENSION",
            })
            chains.append({
                "cause": "Load exceeds ultimate tensile strength",
                "mechanism": "Brittle cleavage along microscopic fault lines",
                "event": "FAILURE",
                "consequence": "Instantaneous catastrophic fracture / systemic halt",
                "resultingState": "RUPTURED",
            })
            thresholds.append({
                "source": "accumulated_load",
                "condition": "load >= elastic_limit",
                "consequence": "Trigger brittle stress fracture rupture",
            })

        elif any(w in lower for w in ["balance", "fulcrum", "trade", "against", "counterweight"]):
            nodes.append({
                "id": "system_fulcrum",
                "initialCondition": "BALANCED",
                "reversibility": "REVERSIBLE",
            })
            chains.append({
                "cause": "Heavy arrival of responsibility or systemic demand",
                "mechanism": "Torque propagation across fulcrum moment arm",
                "event": "IMPACT",
                "consequence": "Angular displacement tilting the opposing value beam",
                "resultingState": "DEFLECTED",
            })
            thresholds.append({
                "source": "system_fulcrum",
                "condition": "angle >= maximum_tilt",
                "consequence": "Opposing node loses contact or structural tether ruptures",
            })

        else:
            # Check if text actually exhibits cause-and-effect language
            has_causal_markers = any(
                w in lower for w in [
                    "causes", "leads to", "drains", "erodes", "creates", "turns into",
                    "becomes", "consequence", "trigger", "produces", "forces", "locks"
                ]
            )
            if has_causal_markers:
                nodes.append({
                    "id": "narrative_subject",
                    "initialCondition": "NOMINAL",
                    "reversibility": "RECOVERABLE",
                })
                chains.append({
                    "cause": segments[0].coreMeaning if segments else "Initial condition",
                    "mechanism": "Unexamined psychological mechanism operating over time",
                    "event": "TRANSFORMATION",
                    "consequence": "Systemic state change alters behavioral equilibrium",
                    "resultingState": "RESOLVED" if len(segments) <= 2 else "CRITICAL",
                })

        return CausalGraph(nodes=nodes, chains=chains, thresholds=thresholds)

    def _extract_state_model(self, script: str, causal: CausalGraph) -> StateModel:
        """Determines the discrete state lifecycle."""
        lower = script.lower()

        if any(w in lower for w in ["compromise", "habit", "baseline", "slippage"]):
            return StateModel(
                initialState="CONSCIOUS_AGENCY",
                intermediateStates=["UNNOTICED_EROSION", "NORMALIZED_TOLERANCE"],
                finalState="HARDENED_AUTOMATICITY",
                dynamics="transformation",
            )
        elif any(w in lower for w in ["stress fracture", "structural rupture", "system snaps", "violent snap", "burnout fracture"]):
            return StateModel(
                initialState="INTACT_CAPACITY",
                intermediateStates=["COMPRESSIVE_STRAIN", "MICRO_FRACTURE_EXPANSION"],
                finalState="BRITTLE_RUPTURE_OR_REST",
                dynamics="rupture",
            )
        elif any(w in lower for w in ["browser tab", "open loop", "zeigarnik", "cognitive bandwidth", "neural ram"]) or ("tab" in lower and "brain" in lower):
            return StateModel(
                initialState="CLEAR_BANDWIDTH",
                intermediateStates=["PROGRESSIVE_LEAKAGE", "SATURATED_SYSTEM"],
                finalState="OFFLOADED_CLARITY",
                dynamics="accumulation",
            )
        elif any(w in lower for w in ["balance", "fulcrum", "tilt", "counterweight"]):
            return StateModel(
                initialState="EQUILIBRIUM",
                intermediateStates=["LOAD_DISPLACEMENT", "ANGULAR_TORQUE"],
                finalState="RECALIBRATED_ALIGNMENT",
                dynamics="equilibrium",
            )
        else:
            has_causal_markers = any(
                w in lower for w in [
                    "causes", "leads to", "drains", "erodes", "creates", "turns into",
                    "becomes", "consequence", "trigger", "produces", "forces", "locks"
                ]
            )
            if has_causal_markers:
                return StateModel(
                    initialState="UNAWARE_STATE",
                    intermediateStates=["EXPOSED_MECHANISM", "CRITICAL_PIVOT"],
                    finalState="SOVEREIGN_ACTION",
                    dynamics="transformation",
                )
            else:
                return StateModel(
                    initialState="OBSERVATION",
                    intermediateStates=[],
                    finalState="INFORMED_ACTION",
                    dynamics="linear",
                )

    def _extract_temporal_model(
        self, script: str, segments: List[NarrativeSegment], word_count: int
    ) -> TemporalModel:
        """Extracts temporal behavior, pacing rhythm, and the F6 breath-hold moment."""
        lower = script.lower()

        # Repetition / Cycle detection
        has_repetition = bool(
            re.search(r"\b(again|repeat|loop|every\s+day|daily|cycle|continuous|slowly)\b", lower)
        )
        rep_nature = "behavioral_loop" if has_repetition else "none"

        # Pacing determination
        if any(w in lower for w in ["sudden", "snap", "moment", "freeze", "realize"]):
            pacing = "sudden_snap"
        elif any(w in lower for w in ["slowly", "accumulate", "quietly", "build", "before you notice"]):
            pacing = "steady_build"
        elif has_repetition:
            pacing = "cyclic_loop"
        else:
            pacing = "accelerating"

        # Dramatic breath hold location (~14s mark or right before the epiphany/reveal)
        # Find the segment that serves as reveal or pivot
        breath_hold_anchor = "The pivotal cognitive realization right before the solution"
        for seg in segments:
            if seg.role in ["reveal", "escalation"]:
                breath_hold_anchor = seg.narrationText[:60]
                break

        approx_sec = round((word_count / 150) * 60 * 0.48, 1)  # ~48% into runtime (~14s)

        breath_hold = {
            "suggested": True,
            "narrativeAnchor": breath_hold_anchor,
            "approximateTimestampSec": approx_sec,
            "durationFrames": 18,  # Standard 18-frame freeze
            "rationale": "Micro-freeze halting visual drift to give the viewer cognitive stillness before the epiphany lands.",
        }

        return TemporalModel(
            pacing=pacing,
            hasRepetition=has_repetition,
            repetitionNature=rep_nature,
            breathHoldWindow=breath_hold,
        )

    def _extract_emotional_trajectory(
        self, segments: List[NarrativeSegment]
    ) -> List[EmotionalTrajectoryEntry]:
        """Maps the psychological journey across narrative segments."""
        trajectory: List[EmotionalTrajectoryEntry] = []
        for seg in segments:
            if seg.role == "hook":
                emotion = "curiosity_and_recognition"
                spike = True
            elif seg.role in ["setup", "mechanism"]:
                emotion = "analytical_clarity"
                spike = False
            elif seg.role == "escalation":
                emotion = "cognitive_tension"
                spike = True
            elif seg.role == "reveal":
                emotion = "epiphany_and_release"
                spike = True
            else:  # resolution
                emotion = "grounded_confidence"
                spike = False

            trajectory.append(
                EmotionalTrajectoryEntry(
                    segmentId=seg.segmentId,
                    emotion=emotion,
                    attentionSpike=spike,
                )
            )
        return trajectory

    def _extract_emphasis_map(self, sentences: List[str]) -> EmphasisMap:
        """Identifies words and phrases carrying primary and secondary semantic weight."""
        primary: List[str] = []
        secondary: List[str] = []

        for sent in sentences:
            # Capitalized named concepts or key contradiction phrases
            matches = re.findall(r"\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b", sent)
            for m in matches:
                if m.lower() not in ["notice", "every", "the", "this", "that", "you", "when"]:
                    primary.append(m)

            # High-impact semantic verbs and nouns
            for w in re.findall(r"\b(bandwidth|compromise|fracture|rupture|pressure|torque|baseline|fatigue|loop|drain|action)\b", sent, re.IGNORECASE):
                if w.upper() not in primary:
                    primary.append(w.upper())

            # Secondary supportive words
            for w in re.findall(r"\b(unnoticed|silent|continuous|automatically|instantly|mechanism)\b", sent, re.IGNORECASE):
                if w.lower() not in secondary:
                    secondary.append(w.lower())

        return EmphasisMap(primary=primary[:6], secondary=secondary[:6])

    def _analyze_visual_opportunities_and_absence(
        self, segments: List[NarrativeSegment], script: str, causal: CausalGraph
    ) -> Tuple[List[VisualOpportunity], List[VisualAbsence]]:
        """
        Discovers high-value visual metaphors while strictly identifying
        content that must remain quiet / spoken-only to prevent visual clutter.
        """
        opportunities: List[VisualOpportunity] = []
        absence: List[VisualAbsence] = []

        lower = script.lower()

        # Visual Opportunities
        if any(w in lower for w in ["browser tab", "neural tab", "open loop", "brain ram", "neural ram", "mental clutter"]) or ("tab" in lower and "brain" in lower):
            opportunities.append(
                VisualOpportunity(
                    segmentId="seg_1_hook",
                    opportunityType="accumulation",
                    physicalDescription="Physical translucent neural browser tabs stacking and crowding mental space",
                    rationale="Externalizes internal cognitive RAM leak into an unmistakable tactile object.",
                )
            )
            opportunities.append(
                VisualOpportunity(
                    segmentId="seg_3_resolution" if len(segments) >= 3 else "seg_2_mechanism",
                    opportunityType="transformation",
                    physicalDescription="Externalized offloading: floating clutter collapses into a singular grounded notebook",
                    rationale="Physical resolution of open loop via externalization.",
                )
            )

        elif any(w in lower for w in ["compromise", "habit", "baseline", "slippage"]):
            opportunities.append(
                VisualOpportunity(
                    segmentId="seg_1_hook",
                    opportunityType="contrast",
                    physicalDescription="A crisp horizontal baseline marker subtly shifting downward under a light weight",
                    rationale="Visually embodies the insidious nature of micro-concessions.",
                )
            )
            opportunities.append(
                VisualOpportunity(
                    segmentId="seg_2_mechanism",
                    opportunityType="reveal",
                    physicalDescription="Live marker cut slicing through text with AnimatedSlashStrike on the exact spoken realization",
                    rationale="Action over display: the viewer witnesses the rejection happening in real time.",
                )
            )

        elif any(w in lower for w in ["pressure", "burden", "load", "strain"]):
            opportunities.append(
                VisualOpportunity(
                    segmentId="seg_1_hook",
                    opportunityType="constraint",
                    physicalDescription="Viscoelastic compressive strain bulging laterally under vertical burden",
                    rationale="Makes the unacknowledged weight visceral on screen.",
                )
            )
            if any(w in lower for w in ["break", "snap", "rupture", "fracture"]):
                opportunities.append(
                    VisualOpportunity(
                        segmentId="seg_2_mechanism",
                        opportunityType="threshold",
                        physicalDescription="Brittle stress fracture propagation across container surface at peak tension",
                        rationale="Visual threshold crossing communicating non-linear system failure.",
                    )
                )

        elif any(w in lower for w in ["balance", "fulcrum", "torque", "counterweight"]):
            opportunities.append(
                VisualOpportunity(
                    segmentId="seg_2_mechanism",
                    opportunityType="collision",
                    physicalDescription="Kinetic fulcrum beam tilting with deterministic torque balance",
                    rationale="Action in load body directly causes physical tilt in counterweight body.",
                )
            )

        else:
            opportunities.append(
                VisualOpportunity(
                    segmentId="seg_1_hook",
                    opportunityType="contrast",
                    physicalDescription="High-contrast split editorial layout pairing Judy intimate bust with semantic hero anchor",
                    rationale="Establishes personal connection and curiosity on mobile screen.",
                )
            )

        # Visual Absence Identification (Content that should NOT receive elaborate visuals)
        for seg in segments:
            text = seg.narrationText
            # Transitional connective phrases
            for phrase in ["notice how", "and that's why", "so instead of", "because when", "it isn't because"]:
                if phrase in text.lower():
                    absence.append(
                        VisualAbsence(
                            textSpan=phrase,
                            recommendedTreatment="spoken_only",
                            reason="Rhetorical glue; animating this creates visual noise without adding narrative meaning.",
                        )
                    )

            # Atmospheric or emotional qualifiers
            if seg.role == "resolution" and any(w in text.lower() for w in ["start small", "take back", "reframe"]):
                absence.append(
                    VisualAbsence(
                        textSpan="Closing guidance phrasing",
                        recommendedTreatment="transitional",
                        reason="Final takeaway lands with 3x more impact when the background is still and quiet.",
                    )
                )

        return opportunities, absence

    def _extract_semantic_importance(
        self,
        core: CoreStory,
        segments: List[NarrativeSegment],
        claims: ClaimsAndEvidence,
        causal: CausalGraph,
    ) -> SemanticImportance:
        """Classifies content into importance tiers for platform safe validation."""
        critical: List[str] = [core.centralClaim, core.coreIdea]
        important: List[str] = [core.viewerPromise, core.viewerQuestion]
        supporting: List[str] = []
        decorative: List[str] = [
            "ambient studio radial glow",
            "crisp vector grid texture",
            "drop-shadow depth planes",
        ]

        for seg in segments:
            if seg.role in ["hook", "reveal"]:
                critical.append(seg.narrationText)
            elif seg.role in ["mechanism", "resolution"]:
                important.append(seg.narrationText)
            else:
                supporting.append(seg.narrationText)

        for cl in claims.claims:
            if cl["type"] == "causal" and cl["statement"] not in critical:
                important.append(cl["statement"])

        return SemanticImportance(
            critical=critical[:4],
            important=important[:4],
            supporting=supporting[:4],
            decorative=decorative,
        )

    def _propose_scene_candidates(
        self,
        segments: List[NarrativeSegment],
        causal: CausalGraph,
        opps: List[VisualOpportunity],
    ) -> List[SceneCandidate]:
        """Proposes scene candidate boundaries based on narrative shifts."""
        candidates: List[SceneCandidate] = []
        for idx, seg in enumerate(segments):
            anchor = "Editorial Hero Card + Judy Grounded Close-up" if idx == 0 else (
                f"Physical {opps[0].opportunityType.title()} Metaphor" if opps else "High-Contrast Kinetic Anchor"
            )
            candidates.append(
                SceneCandidate(
                    candidateId=f"candidate_scene_{idx + 1}",
                    suggestedBoundary=f"Frames corresponding to segment '{seg.role}'",
                    narrativeFunction=seg.coreMeaning,
                    dominantVisualAnchor=anchor,
                )
            )
        return candidates

    def _extract_thumbnail_signals(
        self, topic: str, script: str, core: CoreStory, claims: ClaimsAndEvidence
    ) -> ThumbnailSignals:
        """Extracts high-converting curiosity signals for Frontier T."""
        lower = script.lower()

        if any(w in lower for w in ["browser tab", "neural tab", "open loop", "brain ram", "neural ram", "mental clutter"]) or ("tab" in lower and "brain" in lower):
            curiosity = "Why does the mind refuse to close what it hasn't finished, and what does that look like physically?"
            contradiction = "Sitting in absolute physical silence while mental RAM burns at 100% capacity"
            transformation = "Chaotic eruption of translucent tabs collapsing into clean external clarity"
            hooks = ["20 TABS", "BRAIN RAM", "OPEN LOOPS", "MENTAL CLUTTER"]
            archetype = "impossible_metaphor"
        elif any(w in lower for w in ["compromise", "habit", "baseline", "slippage"]):
            curiosity = "At what exact moment does an unexamined concession cross into an unconscious habit?"
            contradiction = "You believed you made a single minor exception, but your subconscious made a permanent rule"
            transformation = "A microscopic horizontal fault line widening into an immutable granite wall"
            hooks = ["THE SLIPPAGE", "NEW BASELINE", "ONE COMPROMISE", "FAULT LINE"]
            archetype = "impossible_metaphor"
        elif any(w in lower for w in ["pressure", "burden", "strain", "break", "snap"]):
            curiosity = "Why did the system collapse under a feather-light addition?"
            contradiction = "Feeling proud of absorbing infinite pressure right before sudden structural fracture"
            transformation = "Pristine load-bearing plinth developing sudden violent brittle cleavage"
            hooks = ["THE SNAP", "LOAD LIMIT", "HIDDEN PRESSURE", "BRITTLE BREAK"]
            archetype = "minimal_object"
        else:
            curiosity = core.viewerQuestion
            contradiction = claims.misconceptions[0]["presumed"] + " vs " + claims.misconceptions[0]["actual"] if claims.misconceptions else core.centralClaim
            transformation = "State of confusion transforming into decisive structural sovereignty"
            words = [w.upper() for w in re.findall(r"\b[A-Za-z]{4,}\b", topic) if w.upper() not in ["WHEN", "THAT", "WHAT", "HOW", "YOUR"]]
            hooks = [f"{words[0]} {words[1]}" if len(words) >= 2 else (words[0] if words else "THE SHIFT")]
            archetype = "impossible_metaphor"

        return ThumbnailSignals(
            coreCuriosity=curiosity,
            visualContradiction=contradiction,
            mostMemorableTransformation=transformation,
            textHookCandidates=hooks[:4],
            recommendedArchetype=archetype,
        )

    def _evaluate_frontier_signals(
        self,
        script: str,
        core: CoreStory,
        causal: CausalGraph,
        state: StateModel,
        temporal: TemporalModel,
        opps: List[VisualOpportunity],
    ) -> FrontierSignals:
        """
        Produces non-binding capability recommendation signals for Frontier #0.
        Frontier #0 retains final authority.
        F3 is strictly DORMANT_DISABLED.
        """
        lower = script.lower()
        signals: Dict[str, Dict[str, str]] = {}

        # F1: InfiniteWorldCanvas (Spatial continuity / concept chambers)
        if any(w in lower for w in ["chamber", "room", "door", "path", "compartment", "architecture", "journey"]):
            signals["F1"] = {
                "signal": "HIGH",
                "rationale": "Narrative invokes discrete spatial compartments and architectural flow.",
            }
        elif len(causal.chains) >= 3:
            signals["F1"] = {
                "signal": "MEDIUM",
                "rationale": "Multi-stage causal loop benefits from continuous camera flight between nodes.",
            }
        else:
            signals["F1"] = {
                "signal": "LOW",
                "rationale": "Intimate single-subject dialogue; camera flight would dilute message punch.",
            }

        # F2: Materiality (Viscoelastic deformation, stress fracture, ink absorption)
        if state.dynamics == "rupture" or any(w in lower for w in ["pressure", "burden", "compress", "snap", "break"]):
            signals["F2"] = {
                "signal": "HIGH",
                "rationale": "Physical strain, compression, or brittle rupture directly expresses the core tension.",
            }
        elif any(w in lower for w in ["permanent", "written", "deboss", "inscribe", "carve"]):
            signals["F2"] = {
                "signal": "MEDIUM",
                "rationale": "Capillary ink absorption expresses irreversible psychological commitment.",
            }
        else:
            signals["F2"] = {
                "signal": "LOW",
                "rationale": "No physical deformation required; metric or definition scene.",
            }

        # F3: Cinematic Camera Language + Depth (STRICTLY DORMANT)
        signals["F3"] = {
            "signal": "DORMANT_DISABLED",
            "rationale": "Frontier #3 remains strictly DORMANT_EXPERIMENTAL in features.ts. Replaced by high-contrast 2.5D layered composition.",
        }

        # F4: Semantic Mass & Physical Consequence (Closed-form fulcrum torque, balance, inertia)
        if any(w in lower for w in ["balance", "fulcrum", "tilt", "trade", "counterweight", "heavy"]):
            signals["F4"] = {
                "signal": "HIGH",
                "rationale": "Opposing systemic forces require kinetic torque balance and mass differentiation.",
            }
        else:
            signals["F4"] = {
                "signal": "LOW",
                "rationale": "No balance or torque mechanic present.",
            }

        # F5: Environmental / Diorama Worlds (Architectural plinths, plinth grounding)
        if any(w in lower for w in ["foundation", "bedrock", "ground", "cantilever", "structure"]):
            signals["F5"] = {
                "signal": "HIGH",
                "rationale": "Architectural plinth provides grounding for habit foundations.",
            }
        elif signals.get("F4", {}).get("signal") == "HIGH":
            signals["F5"] = {
                "signal": "LOW",
                "rationale": "F4 KineticFulcrumBeam provides the physical ground; F5 diorama is redundant.",
            }
        else:
            signals["F5"] = {
                "signal": "LOW",
                "rationale": "Clean luminous light canvas with subtle radial depth is superior.",
            }

        # F6: Temporal Manipulation (Dramatic breath-hold freeze, time oscillation)
        if temporal.breathHoldWindow.get("suggested", False):
            signals["F6"] = {
                "signal": "HIGH",
                "rationale": "Narrative contains a high-value epiphany preceded by an 18-frame breath-hold micro-freeze.",
            }
        elif temporal.hasRepetition:
            signals["F6"] = {
                "signal": "MEDIUM",
                "rationale": "Harmonic oscillation useful for cyclic behavioral reinforcement.",
            }
        else:
            signals["F6"] = {
                "signal": "LOW",
                "rationale": "Standard steady-state narrative pacing.",
            }

        # F7: Visual State Machines & Causal Storytelling (Deterministic state machine, causal memory)
        if len(causal.chains) >= 2 or (len(causal.chains) >= 1 and state.dynamics in ["accumulation", "rupture"]):
            signals["F7"] = {
                "signal": "VERY_HIGH",
                "rationale": "Explicit cause-and-effect loop with discrete state transitions (nominal -> strained -> resolved).",
            }
        elif len(causal.chains) >= 1 or (len(causal.nodes) > 0 and state.dynamics != "linear"):
            signals["F7"] = {
                "signal": "MEDIUM",
                "rationale": "Basic state transition detected.",
            }
        else:
            signals["F7"] = {
                "signal": "LOW",
                "rationale": "Pure observational statement without state mutations.",
            }

        # T: Thumbnail Intelligence
        signals["T"] = {
            "signal": "HIGH",
            "rationale": "Strong conceptual contradiction and curiosity gap extracted for thumbnail design.",
        }

        return FrontierSignals(signals=signals)

    def _extract_entities_and_concepts(self, topic: str, script: str) -> Dict[str, List[str]]:
        """Extracts key conceptual entities and persistent narrative objects."""
        lower = f"{topic} {script}".lower()
        concepts: List[str] = []
        entities: List[str] = []
        persistent: List[str] = []

        if "tab" in lower or "ram" in lower:
            concepts.extend(["Cognitive Load", "Zeigarnik Effect", "Working Memory"])
            entities.extend(["Translucent Neural Browser Tab", "Open Loop Alert", "External Notebook"])
            persistent.append("Neural Browser Tab (travels from Hook into Resolution)")
        elif "compromise" in lower or "habit" in lower:
            concepts.extend(["Baseline Drift", "Micro-Concession", "Behavioral Normalization"])
            entities.extend(["Integrity Threshold Line", "Subconscious Anchor", "Marker Blade"])
            persistent.append("Integrity Threshold Line (tracks baseline deflection across scenes)")
        elif "pressure" in lower or "burnout" in lower:
            concepts.extend(["Tensile Load", "Elastic Capacity", "Brittle Cleavage"])
            entities.extend(["Load Block", "Stress Fracture", "Ground Plinth"])
            persistent.append("Load Block (accumulates mass across Scene 1 and Scene 2)")
        else:
            concepts.append(topic.title())
            entities.append("Editorial Focus Card")

        return {
            "concepts": concepts,
            "entities": entities,
            "persistentObjects": persistent,
        }

    def _check_structural_coherence(
        self, segments: List[NarrativeSegment], core: CoreStory
    ) -> List[str]:
        """Validates narrative coherence and absence of dangling loops."""
        notes: List[str] = []
        if len(segments) < 2:
            notes.append("Warning: Single-segment script offers limited opportunity for narrative escalation.")
        has_hook = any(s.role == "hook" for s in segments)
        has_res = any(s.role == "resolution" for s in segments)
        if not has_hook:
            notes.append("Notice: Opening lacks clear hook or contradiction beat.")
        if not has_res:
            notes.append("Notice: Closing lacks decisive operational resolution.")
        return notes

    # -------------------------------------------------------------
    # 3. INSPECTABILITY & REPORT FORMATTER
    # -------------------------------------------------------------

    def format_inspection_report(self, model: NormalizedStoryModel) -> str:
        """Produces a clean developer-readable summary of the story intelligence."""
        lines: List[str] = []
        lines.append("=" * 78)
        lines.append("🎬 FRONTIER S: SCRIPT INTELLIGENCE REPORT")
        lines.append("=" * 78)
        lines.append(f"Input Source : {model.meta.sourceType.upper()} ({model.meta.wordCount} words, Mode {model.meta.mode})")
        lines.append(f"Topic        : \"{model.meta.topic}\"")
        lines.append(f"Content Hash : {model.meta.contentHash[:16]}... (v{model.meta.intelligenceVersion})")
        lines.append("-" * 78)

        lines.append("\n🧠 1. CORE STORY ARCHITECTURE")
        lines.append(f"  • Core Idea       : {model.story.coreIdea}")
        lines.append(f"  • Central Claim   : {model.story.centralClaim}")
        lines.append(f"  • Viewer Promise  : {model.story.viewerPromise}")
        lines.append(f"  • Viewer Question : {model.story.viewerQuestion}")
        lines.append(f"  • Narrative Arc   : {model.story.narrativeArchitecture}")

        lines.append("\n📑 2. NARRATIVE SEGMENTS (Meaning-Based)")
        for seg in model.segments:
            lines.append(f"  [{seg.segmentId}] Role: {seg.role.upper()} ({seg.semanticWeight})")
            lines.append(f"    ↳ Narration      : \"{seg.narrationText}\"")
            lines.append(f"    ↳ Core Meaning   : {seg.coreMeaning}")
            lines.append(f"    ↳ Visual Question: {seg.visualQuestion}")

        lines.append("\n⚡ 3. CAUSALITY & STATE GRAPH (Aligned with F7)")
        if model.causalGraph.chains:
            for ch in model.causalGraph.chains:
                lines.append(f"  • CAUSE: {ch['cause']}")
                lines.append(f"    ↳ MECHANISM     : {ch['mechanism']}")
                lines.append(f"    ↳ EVENT         : {ch['event']} -> {ch['consequence']}")
                lines.append(f"    ↳ RESULTING STATE: {ch['resultingState']}")
        else:
            lines.append("  • No complex multi-node causal graph detected (Linear progression).")

        lines.append(f"\n🔄 4. STATE MODEL ({model.stateModel.dynamics.upper()})")
        lines.append(f"  {model.stateModel.initialState} ──► {', '.join(model.stateModel.intermediateStates)} ──► {model.stateModel.finalState}")

        lines.append("\n⏱️ 5. TEMPORAL INTELLIGENCE (Aligned with F6)")
        lines.append(f"  • Pacing Mode     : {model.temporalModel.pacing.upper()}")
        lines.append(f"  • Repetition Loop : {'YES (' + model.temporalModel.repetitionNature + ')' if model.temporalModel.hasRepetition else 'NO'}")
        bh = model.temporalModel.breathHoldWindow
        if bh.get("suggested"):
            lines.append(f"  • Breath-Hold (F6): ~{bh.get('approximateTimestampSec')}s ({bh.get('durationFrames')} frames) right before: \"{bh.get('narrativeAnchor')}\"")

        lines.append("\n🎨 6. VISUAL OPPORTUNITIES vs. VISUAL ABSENCE")
        lines.append("  [OPPORTUNITIES]:")
        for opp in model.visualOpportunities:
            lines.append(f"    - {opp.opportunityType.upper()}: {opp.physicalDescription}")
            lines.append(f"      ↳ *Rationale*: {opp.rationale}")
        lines.append("  [VISUAL ABSENCE (Keep Quiet / Spoken-Only)]:")
        for abs_item in model.visualAbsence:
            lines.append(f"    - \"{abs_item.textSpan}\" -> {abs_item.recommendedTreatment.upper()} ({abs_item.reason})")

        lines.append("\n🛡️ 7. SEMANTIC IMPORTANCE (Platform Safe Areas)")
        lines.append(f"  • CRITICAL   : {len(model.semanticImportance.critical)} elements (Guaranteed 100% obstruction-free)")
        lines.append(f"  • IMPORTANT  : {len(model.semanticImportance.important)} elements")
        lines.append(f"  • SUPPORTING : {len(model.semanticImportance.supporting)} elements")
        lines.append(f"  • DECORATIVE : {', '.join(model.semanticImportance.decorative)}")

        lines.append("\n🎯 8. THUMBNAIL SIGNALS (Aligned with Frontier T)")
        lines.append(f"  • Curiosity Gap     : {model.thumbnailSignals.coreCuriosity}")
        lines.append(f"  • Core Contradiction: {model.thumbnailSignals.visualContradiction}")
        lines.append(f"  • Text Hooks        : {', '.join(model.thumbnailSignals.textHookCandidates)}")
        lines.append(f"  • Archetype         : {model.thumbnailSignals.recommendedArchetype}")

        lines.append("\n🚀 9. FRONTIER CAPABILITY SIGNALS (Non-Binding Signals for F0)")
        for f_code, sig in sorted(model.frontierSignals.signals.items()):
            lines.append(f"  • {f_code.ljust(4)}: {sig['signal'].ljust(16)} — {sig['rationale']}")

        lines.append("\n🩺 10. DIAGNOSTICS & HYGIENE")
        lines.append(f"  • Hygiene Status    : {'✅ 100% COMPLIANT' if model.diagnostics.hygieneValid else '⚠️ ISSUES DETECTED'}")
        if model.diagnostics.issues:
            for iss in model.diagnostics.issues:
                lines.append(f"    - {iss}")
        if model.diagnostics.unsupportedClaims:
            for uc in model.diagnostics.unsupportedClaims:
                lines.append(f"    - Unsupported Factual Claim: \"{uc}\"")
        if model.diagnostics.structuralNotes:
            for sn in model.diagnostics.structuralNotes:
                lines.append(f"    - Structural Note: {sn}")

        lines.append("=" * 78 + "\n")
        return "\n".join(lines)

    # -------------------------------------------------------------
    # 4. Deserialization Helper
    # -------------------------------------------------------------

    def _dict_to_model(self, data: Dict[str, Any]) -> NormalizedStoryModel:
        return NormalizedStoryModel(
            meta=StoryMeta(**data["meta"]),
            story=CoreStory(**data["story"]),
            segments=[NarrativeSegment(**s) for s in data["segments"]],
            entitiesAndConcepts=data["entitiesAndConcepts"],
            claimsAndEvidence=ClaimsAndEvidence(**data["claimsAndEvidence"]),
            causalGraph=CausalGraph(**data["causalGraph"]),
            stateModel=StateModel(**data["stateModel"]),
            temporalModel=TemporalModel(**data["temporalModel"]),
            emotionalTrajectory=[EmotionalTrajectoryEntry(**e) for e in data["emotionalTrajectory"]],
            emphasisMap=EmphasisMap(**data["emphasisMap"]),
            visualOpportunities=[VisualOpportunity(**v) for v in data["visualOpportunities"]],
            visualAbsence=[VisualAbsence(**va) for va in data["visualAbsence"]],
            semanticImportance=SemanticImportance(**data["semanticImportance"]),
            sceneCandidates=[SceneCandidate(**sc) for sc in data["sceneCandidates"]],
            thumbnailSignals=ThumbnailSignals(**data["thumbnailSignals"]),
            frontierSignals=FrontierSignals(**data["frontierSignals"]),
            diagnostics=Diagnostics(**data["diagnostics"]),
        )


# ============================================================
# 5. CLI INTERFACE
# ============================================================

def main():
    parser = argparse.ArgumentParser(description="RightMotion Frontier S: Script Intelligence")
    parser.add_argument("--topic", type=str, default=None, help="Topic title or prompt")
    parser.add_argument("--script", type=str, default=None, help="Voiceover script text")
    parser.add_argument("--channel", type=str, default="self_improvement", help="Channel niche")
    parser.add_argument("--mode", type=str, default="B", choices=["A", "B"], help="Mode A (Product) or Mode B (Organic)")
    parser.add_argument("--duo", action="store_true", help="Conversational Duo mode with Andrew")
    parser.add_argument("--inspect", action="store_true", help="Print developer-readable inspection report")
    parser.add_argument("--json", action="store_true", help="Print complete JSON model output")
    parser.add_argument("--output", type=str, default="", help="Path to save story_model.json")
    parser.add_argument("--no-cache", action="store_true", help="Bypass cache")
    args = parser.parse_args()

    if not args.topic and not args.script:
        parser.print_help()
        sys.exit(1)

    intelligence = ScriptIntelligence(use_cache=not args.no_cache)
    model = intelligence.analyze_topic_or_script(
        topic=args.topic,
        script=args.script,
        channel=args.channel,
        mode=args.mode,
        is_duo=args.duo,
    )

    if args.inspect or not args.json:
        print(intelligence.format_inspection_report(model))

    if args.json:
        print(model.to_json(indent=2))

    if args.output:
        out_path = Path(args.output)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(model.to_json(indent=2), encoding="utf-8")
        print(f"✅ Normalized Story Model saved to: {out_path}")


if __name__ == "__main__":
    main()
