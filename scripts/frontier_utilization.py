#!/usr/bin/env python3
"""
🎬 RightMotion — Frontier Execution & Anti-Cardification Diagnostic Engine
Location: scripts/frontier_utilization.py

Authoritative diagnostic module measuring:
  1. Frontier Activation Depth (Levels 0 to 5)
  2. Quantitative Cardification Score & Penalties
  3. Mute Test & Remove-the-Text Test pass rates
  4. How-Did-They-Do-That Creative Score
  5. Whole-video Frontier Utilization Reports
"""

import argparse
import json
import re
import sys
from dataclasses import dataclass, field, asdict
from pathlib import Path
from typing import Any, Dict, List, Optional, Set, Tuple

ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(ROOT_DIR / "scripts"))

# Recognized physical mechanism primitives (Level 4-5 capabilities)
MECHANISM_PRIMITIVES = {
    "ThresholdBoundary": "F7",
    "ThresholdBoundaryShift": "F7",
    "KineticFurrow": "F7",
    "ResistancePathway": "F7",
    "CausalActionCoupling": "F7",
    "StateMemoryTrace": "F7",
    "CausalWorld": "F7",
    "CausalNode": "F7",
    "ThresholdReactor": "F7",
    "StressFractureEngine": "F2",
    "ViscoelasticDeformation": "F2",
    "CapillaryInkBleed": "F2",
    "KineticFulcrumBeam": "F4",
    "SemanticMassNode": "F4",
    "TensileStructuralTether": "F4",
    "InfiniteWorldCanvas": "F1",
    "DioramaPlinth": "F5",
    "BedrockFoundation": "F5",
    "MonolithicCantilever": "F5",
    "WorldCameraBreathHold": "F6",
    "TemporalDistortionLayer": "F6",
    "UniversalBackground": "F_UBG",
}

# Recognized story object exceptions (genuine narrative items, NOT cardification)
STORY_OBJECT_INDICATORS = [
    "ProductPageShowcase",
    "physical_document",
    "digital_device_screen",
    "blueprint_worksheet",
    "evidence_contract",
]


@dataclass
class SceneCardificationReport:
    scene_index: int
    card_count: int
    mechanism_count: int
    explanatory_box_count: int
    status_badge_count: int
    detected_mechanisms: List[str]
    has_physical_mutation: bool
    has_causal_interaction: bool
    cardification_score: float
    is_cardified: bool
    reasons: List[str]


@dataclass
class FrontierDepthScore:
    frontier_code: str
    selected: bool
    depth_level: int  # 0 to 5
    depth_name: str
    primary_mechanism_active: bool
    details: str


@dataclass
class VideoUtilizationReport:
    clip_name: str
    overall_cardification_score: float
    total_card_count: int
    total_mechanism_count: int
    primary_mechanism_ratio: float
    how_did_they_do_that_score: float
    mute_test_passed: bool
    remove_text_test_passed: bool
    frontier_depths: Dict[str, FrontierDepthScore]
    scenes: List[SceneCardificationReport]
    summary_verdict: str


class FrontierUtilizationAuditor:
    """Audits RightMotion compositions for Anti-Cardification & Frontier Depth."""

    @classmethod
    def audit_canvas_code(
        cls,
        canvas_code: str,
        creative_plan: Optional[Dict[str, Any]] = None,
        clip_name: str = "unknown",
        motion_ast: Optional[Dict[str, Any]] = None,
    ) -> VideoUtilizationReport:
        # Strip comments
        clean_code = re.sub(r"/\*.*?\*/", "", canvas_code, flags=re.DOTALL)
        clean_code = re.sub(r"//.*", "", clean_code)

        # 1. Detect physical mechanism primitives imported and used
        detected_mechanisms = []
        for prim, f_code in MECHANISM_PRIMITIVES.items():
            if f"<{prim}" in clean_code:
                detected_mechanisms.append((prim, f_code))

        # Check if Canvas is powered directly by MotionStagePlayer + MotionStageAST
        is_ast_driven = "<MotionStagePlayer" in clean_code and motion_ast is not None
        ast_prims = []
        if is_ast_driven:
            scenes = motion_ast.get("scenes", [])
            for sc in scenes:
                for actor in sc.get("actors", []):
                    geom_type = actor.get("geometry", {}).get("type", "")
                    if geom_type == "continuous_boundary":
                        ast_prims.append(("ThresholdBoundary", "F7"))
                    elif geom_type == "conduit_pathway":
                        ast_prims.append(("KineticFurrow", "F7"))
                    elif geom_type == "fulcrum_beam":
                        ast_prims.append(("KineticFulcrumBeam", "F4"))
                    elif geom_type == "monolithic_foundation":
                        ast_prims.append(("BedrockFoundation", "F5"))
                if sc.get("causalCouplings"):
                    ast_prims.append(("CausalActionCoupling", "F7"))
            if motion_ast.get("persistentWorldMemory"):
                ast_prims.append(("PersistentMemoryStage", "F7"))
            bgi = motion_ast.get("environment", {}).get("defaultBackgroundIntent") or (scenes[0].get("backgroundIntent") if scenes else None)
            if bgi and bgi.get("mode") == "universal":
                ast_prims.append(("UniversalBackground", "F_UBG"))

            for ap in ast_prims:
                if ap not in detected_mechanisms:
                    detected_mechanisms.append(ap)

        # 2. Count presentation card containers
        # Patterns for card containers:
        # rounded-3xl / rounded-2xl + bg-white or bg-slate-950 or border
        card_matches = re.findall(
            r"""(?x)
            <div[^>]*className=[\"'][^\"']*?
            (?:rounded-3xl|rounded-2xl)
            [^\"']*?
            (?:bg-white|bg-slate-900|bg-slate-950|border-\[2\.5px\]|border-\[3px\]|border-slate-900|shadow-)
            [^\"']*?[\"']
            """,
            clean_code,
        )

        total_cards = len(card_matches)

        # Deduct legitimate story objects
        story_object_count = 0
        for story_kw in STORY_OBJECT_INDICATORS:
            if story_kw in clean_code:
                story_object_count += 1
        presentation_cards = max(0, total_cards - story_object_count)

        # Count status badges / pills
        status_badges = len(
            re.findall(
                r"""rounded-(?:full|lg|xl)\s+(?:bg-(?:rose|amber|emerald|sky|slate)-(?:50|100|900|950)|border)""",
                clean_code,
            )
        )

        # Count explanatory text blocks inside cards
        explanatory_boxes = len(
            re.findall(r"""<p[^>]*className=[\"'][^\"']*text-(?:slate|white)""", clean_code)
        )

        # Physical mutations detected
        has_mutation = any(
            m in clean_code
            for m in [
                "ThresholdBoundary",
                "ThresholdBoundaryShift",
                "KineticFurrow",
                "ResistancePathway",
                "StressFractureEngine",
                "ViscoelasticDeformation",
                "CapillaryInkBleed",
                "AnimatedSlashStrike",
                "deflect",
                "carvedExtentX",
                "shatterFrame",
            ]
        ) or (
            is_ast_driven and any(len(sc.get("mutations", [])) > 0 for sc in motion_ast.get("scenes", []))
        )

        # Causal interactions detected
        has_causal = any(
            c in clean_code
            for c in [
                "CausalActionCoupling",
                "CausalWorld",
                "CausalNode",
                "ThresholdReactor",
                "CausalImpulseConduit",
                "useNodeState",
                "useCausalConsequence",
                "triggerFrame",
            ]
        ) or (
            is_ast_driven and any(len(sc.get("causalCouplings", [])) > 0 for sc in motion_ast.get("scenes", []))
        )

        # Calculate Cardification Score:
        # Penalties:
        score = 0.0
        reasons = []

        if presentation_cards > 0:
            card_pen = presentation_cards * 14.0
            score += card_pen
            reasons.append(f"+{card_pen:.0f} pts: {presentation_cards} presentation card containers detected")

        if status_badges >= 2:
            badge_pen = min(20.0, status_badges * 4.0)
            score += badge_pen
            reasons.append(f"+{badge_pen:.0f} pts: {status_badges} status badges/pills detected")

        if explanatory_boxes >= 2:
            exp_pen = min(15.0, explanatory_boxes * 3.0)
            score += exp_pen
            reasons.append(f"+{exp_pen:.0f} pts: {explanatory_boxes} explanatory paragraph blocks in containers")

        # Rewards for genuine mechanisms:
        if has_mutation:
            score -= 28.0
            reasons.append("-28 pts: Live physical mutation (deflection/furrow/fracture/deformation) active")

        if has_causal:
            score -= 24.0
            reasons.append("-24 pts: Causal coupling or state machine active")

        mech_count = len(detected_mechanisms)
        if mech_count >= 1:
            mech_rew = min(30.0, mech_count * 15.0)
            score -= mech_rew
            reasons.append(f"-{mech_rew:.0f} pts: {mech_count} physical mechanism primitives instantiated")

        score = max(0.0, score)
        is_cardified = score >= 35.0 or (presentation_cards >= 3 and mech_count == 0)

        # Mute test evaluation:
        # A scene passes if it has physical mutations or causal interaction so the event is self-evident visually
        mute_test_passed = (has_mutation or has_causal or mech_count >= 1) and presentation_cards <= 2

        # Remove-the-text test evaluation:
        # If all typography and cards were stripped, would a physical mechanism remain?
        remove_text_passed = mech_count >= 1 or has_mutation

        # How-Did-They-Do-That Score (0.0 to 10.0)
        # Low for card stacks, high for physical mechanisms and state transitions
        how_score = 3.0  # baseline
        if presentation_cards >= 4:
            how_score -= 2.0
        elif presentation_cards == 0 and mech_count >= 1:
            how_score += 2.5

        if has_mutation:
            how_score += 2.5
        if has_causal:
            how_score += 2.0
        how_score = max(1.0, min(10.0, how_score))

        # 3. Frontier Activation Depths (Levels 0-5)
        frontier_depths = cls._evaluate_frontier_depths(clean_code, creative_plan, ast_prims=ast_prims)

        # Overall verdict
        if is_cardified:
            verdict = "FAIL_CARDIFIED: Scene is dominated by editorial card layouts rather than physical mechanisms."
        elif not remove_text_passed:
            verdict = "WARNING_TEXT_DEPENDENT: Scene lacks substantive physical mechanism when text is removed."
        else:
            verdict = "OPTIMAL_MECHANISM_DRIVEN: Physical mechanism is the dominant visual event."

        primary_ratio = 1.0 if (mech_count > 0 and presentation_cards <= 1) else (mech_count / max(1, mech_count + presentation_cards))

        scene_report = SceneCardificationReport(
            scene_index=1,
            card_count=presentation_cards,
            mechanism_count=mech_count,
            explanatory_box_count=explanatory_boxes,
            status_badge_count=status_badges,
            detected_mechanisms=[p for p, f in detected_mechanisms],
            has_physical_mutation=has_mutation,
            has_causal_interaction=has_causal,
            cardification_score=score,
            is_cardified=is_cardified,
            reasons=reasons,
        )

        return VideoUtilizationReport(
            clip_name=clip_name,
            overall_cardification_score=score,
            total_card_count=presentation_cards,
            total_mechanism_count=mech_count,
            primary_mechanism_ratio=primary_ratio,
            how_did_they_do_that_score=how_score,
            mute_test_passed=mute_test_passed,
            remove_text_test_passed=remove_text_passed,
            frontier_depths=frontier_depths,
            scenes=[scene_report],
            summary_verdict=verdict,
        )

    @classmethod
    def _evaluate_frontier_depths(
        cls,
        clean_code: str,
        creative_plan: Optional[Dict[str, Any]],
        ast_prims: Optional[List[Tuple[str, str]]] = None,
    ) -> Dict[str, FrontierDepthScore]:
        frontiers = ["F1", "F2", "F4", "F5", "F6", "F7", "F_UBG"]
        results = {}

        # Get active capabilities from plan if available
        plan_selected = set()
        if creative_plan and "scenePlans" in creative_plan:
            for sp in creative_plan["scenePlans"]:
                for cap in sp.get("activeCapabilities", []):
                    plan_selected.add(cap.get("frontierCode"))

        depth_names = {
            0: "Level 0: Not Selected",
            1: "Level 1: Planning Metadata Only",
            2: "Level 2: AST Represented but Not Visible",
            3: "Level 3: Decorative Secondary Effect",
            4: "Level 4: Meaningful Visual Behavior",
            5: "Level 5: Primary Visual Mechanism",
        }

        for f_code in frontiers:
            is_selected = f_code in plan_selected

            # Check presence in clean_code or executed from Motion AST
            matching_prims = [
                p for p, fc in MECHANISM_PRIMITIVES.items() if fc == f_code and f"<{p}" in clean_code
            ]
            if ast_prims:
                for p, fc in ast_prims:
                    if fc == f_code and p not in matching_prims:
                        matching_prims.append(p)

            if not is_selected and not matching_prims:
                results[f_code] = FrontierDepthScore(
                    frontier_code=f_code,
                    selected=False,
                    depth_level=0,
                    depth_name=depth_names[0],
                    primary_mechanism_active=False,
                    details="Frontier was not selected for this narrative.",
                )
                continue

            if is_selected and not matching_prims:
                results[f_code] = FrontierDepthScore(
                    frontier_code=f_code,
                    selected=True,
                    depth_level=1,
                    depth_name=depth_names[1],
                    primary_mechanism_active=False,
                    details="Selected in creative plan but no corresponding primitive rendered in JSX (collapsed into cards).",
                )
                continue

            # If primitives are rendered, assess Level 3, 4, or 5
            has_primary = False
            if f_code == "F7":
                if any(p in matching_prims for p in ["ThresholdBoundary", "ThresholdBoundaryShift", "KineticFurrow", "ResistancePathway", "CausalActionCoupling"]):
                    depth = 5
                    has_primary = True
                else:
                    depth = 4
            elif f_code == "F2":
                if "StressFractureEngine" in matching_prims or "ViscoelasticDeformation" in matching_prims:
                    depth = 5 if "ThresholdBoundary" not in clean_code and not any(p == "ThresholdBoundary" for p in matching_prims) else 4
                    has_primary = (depth == 5)
                else:
                    depth = 3
            elif f_code == "F4":
                if "KineticFulcrumBeam" in matching_prims or "SemanticMassNode" in matching_prims:
                    depth = 5 if "ThresholdBoundary" not in clean_code and not any(p == "ThresholdBoundary" for p in matching_prims) else 4
                    has_primary = (depth == 5)
                else:
                    depth = 3
            elif f_code == "F1":
                depth = 4 if "InfiniteWorldCanvas" in matching_prims else 3
            elif f_code == "F5":
                depth = 4 if "DioramaPlinth" in matching_prims or "BedrockFoundation" in matching_prims else 3
            elif f_code == "F6":
                depth = 4 if "WorldCameraBreathHold" in clean_code or "breathHold" in clean_code else 3
            elif f_code == "F_UBG":
                depth = 4 if "UniversalBackground" in matching_prims else 3
            else:
                depth = 3

            results[f_code] = FrontierDepthScore(
                frontier_code=f_code,
                selected=is_selected,
                depth_level=depth,
                depth_name=depth_names[depth],
                primary_mechanism_active=has_primary,
                details=f"Instantiated primitives: {', '.join(matching_prims)}",
            )

        return results

    @classmethod
    def audit_clip_directory(cls, clip_dir: Path) -> VideoUtilizationReport:
        canvas_file = clip_dir / "Canvas.tsx"
        if not canvas_file.exists():
            raise FileNotFoundError(f"Missing Canvas.tsx in {clip_dir}")

        canvas_code = canvas_file.read_text(encoding="utf-8")

        plan = None
        plan_file = clip_dir / "creative_plan.json"
        if plan_file.exists():
            try:
                plan = json.loads(plan_file.read_text(encoding="utf-8"))
            except Exception:
                pass

        ast = None
        ast_file = clip_dir / "motion_ast.json"
        if ast_file.exists():
            try:
                ast = json.loads(ast_file.read_text(encoding="utf-8"))
            except Exception:
                pass

        return cls.audit_canvas_code(canvas_code, creative_plan=plan, clip_name=clip_dir.name, motion_ast=ast)

    @classmethod
    def format_report_markdown(cls, report: VideoUtilizationReport) -> str:
        lines = []
        lines.append(f"# 📊 Frontier Utilization & Anti-Cardification Report: `{report.clip_name}`\n")
        lines.append(f"**Verdict**: `{report.summary_verdict}`")
        lines.append(f"**Cardification Score**: `{report.overall_cardification_score:.1f}` (Target: < 35.0)")
        lines.append(f"**Presentation Cards**: `{report.total_card_count}` | **Mechanisms**: `{report.total_mechanism_count}`")
        lines.append(f"**Primary Mechanism Ratio**: `{report.primary_mechanism_ratio * 100:.1f}%`")
        lines.append(f"**'How Did They Do That?' Score**: `{report.how_did_they_do_that_score:.1f} / 10.0`")
        lines.append(f"**Mute Test Passed**: `{'✅ YES' if report.mute_test_passed else '❌ NO'}`")
        lines.append(f"**Remove-Text Test Passed**: `{'✅ YES' if report.remove_text_test_passed else '❌ NO'}`\n")

        lines.append("## 🎯 Frontier Activation Depth Breakdown")
        lines.append("| Frontier | Status | Depth Level | Mechanism Active | Details |")
        lines.append("|:---|:---|:---|:---|:---|")
        for f_code, ds in report.frontier_depths.items():
            st = "SELECTED" if ds.selected else "NOT_SELECTED"
            act = "✅ YES" if ds.primary_mechanism_active else "—"
            lines.append(f"| **{f_code}** | `{st}` | **{ds.depth_name}** | {act} | {ds.details} |")

        lines.append("\n## 🔍 Cardification Penalties & Rewards")
        for sc in report.scenes:
            for r in sc.reasons:
                lines.append(f"- {r}")

        return "\n".join(lines)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Audit RightMotion clip for Anti-Cardification & Frontier Depth")
    parser.add_argument("--clip", type=str, help="Clip name in src/clips/")
    parser.add_argument("--file", type=str, help="Direct path to Canvas.tsx")
    args = parser.parse_args()

    if args.clip:
        c_dir = ROOT_DIR / "src" / "clips" / args.clip
        rep = FrontierUtilizationAuditor.audit_clip_directory(c_dir)
        print(FrontierUtilizationAuditor.format_report_markdown(rep))
    elif args.file:
        p = Path(args.file)
        code = p.read_text(encoding="utf-8")
        rep = FrontierUtilizationAuditor.audit_canvas_code(code, clip_name=p.parent.name)
        print(FrontierUtilizationAuditor.format_report_markdown(rep))
    else:
        print("Specify --clip <name> or --file <path>")
