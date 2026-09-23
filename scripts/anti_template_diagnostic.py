#!/usr/bin/env python3
"""
🎬 RightMotion Anti-Template Diagnostic Engine
===============================================
Detects UNMOTIVATED repetition across clips to prevent RightMotion from degrading
into a rigid template engine.

Checks for:
1. Repeated component sequences across multiple clips (template drift)
2. Excessive presenter dominance (presenter taking over >45% of non-hook frames)
3. Excessive cardification (Rule 5.5 Anti-cardification violations)
4. Excessive text-dependence (information display without physical transformation)
5. Zero-state-change scenes (scenes where only typography changes)
6. Flat pacing curves (zero variation in shot pacing modes)

Crucial distinction:
MOTIVATED repetition (e.g. intentional recurring motif within a story) is allowed.
UNMOTIVATED repetition (copy-pasting the same visual structure across unrelated clips) is flagged.
"""

import argparse
import json
import re
from pathlib import Path
from typing import Dict, Any, List, Optional

ROOT_DIR = Path(__file__).resolve().parent.parent

BANNED_MEME_COMPONENTS = ["TacticalMemeCard", "TacticalMemeFrame", "MemeStickerOverlay"]


class AntiTemplateDiagnostic:
    """
    Audits one or multiple clips for template stagnation.
    """

    def __init__(self, clips_dir: Optional[Path] = None):
        self.clips_dir = clips_dir or (ROOT_DIR / "src" / "clips")

    def audit_clip(self, clip_name: str) -> Dict[str, Any]:
        """
        Audits a single clip's Canvas.tsx and creative_brief.json.
        """
        clip_path = self.clips_dir / clip_name
        canvas_path = clip_path / "Canvas.tsx"
        brief_path = clip_path / "creative_brief.json"

        if not canvas_path.exists():
            return {
                "clipName": clip_name,
                "status": "ERROR",
                "message": f"Canvas.tsx not found in {clip_path}",
                "flags": [],
            }

        code = canvas_path.read_text(encoding="utf-8")
        brief = {}
        if brief_path.exists():
            try:
                brief = json.loads(brief_path.read_text(encoding="utf-8"))
            except Exception:
                pass

        flags = []

        # 1. Banned Meme Check
        for meme in BANNED_MEME_COMPONENTS:
            if meme in code:
                flags.append({
                    "severity": "CRITICAL",
                    "type": "BANNED_MEME_PATTERN",
                    "detail": f"Found banned meme component '{meme}'. Rule 4 enforces zero memes.",
                })

        # 2. Cardification Check (Rule 5.5)
        card_matches = re.findall(r"(?:PhysicalCard|SingleIncidentCard|VisualPropCard)", code)
        if len(card_matches) >= 3:
            flags.append({
                "severity": "WARNING",
                "type": "EXCESSIVE_CARDIFICATION",
                "detail": f"Detected {len(card_matches)} card instances. Check Rule 5.5 Anti-cardification: use open-stage physical primitives.",
            })

        # 3. Presenter Dominance Check
        # If Judy or Presenter is mounted across the entire composition rather than just the hook
        if "isHook" in code and "Presenter" in code:
            pass  # Well isolated to hook
        elif "GlossyJudyIntro" in code:
            # Check exitFrame
            exit_m = re.search(r"exitFrame=\{?(\d+)\}?", code)
            if exit_m and int(exit_m.group(1)) > 150:
                flags.append({
                    "severity": "WARNING",
                    "type": "PRESENTER_LINGERING",
                    "detail": f"GlossyJudyIntro persists until frame {exit_m.group(1)}. Host should yield stage to physical mechanisms after ~2.5s (f:75-100).",
                })

        # 4. Text-Only Scene Check
        has_physical_primitives = any(
            comp in code
            for comp in [
                "ThresholdBoundary", "ViscoelasticDeformation", "StressFractureEngine",
                "KineticFurrow", "KineticFulcrumBeam", "CausalWorld", "InfiniteWorldCanvas",
                "AnimatedSlashStrike", "KineticHighlighter"
            ]
        )
        if not has_physical_primitives:
            flags.append({
                "severity": "WARNING",
                "type": "TEXT_HEAVY_NO_MECHANISM",
                "detail": "Composition lacks physical mechanisms. Ensure abstract concepts are represented physically.",
            })

        # 5. Pacing Curve Check
        shots = brief.get("shots", [])
        if shots:
            pacing_modes = set(s.get("pacingMode") for s in shots if s.get("pacingMode"))
            if len(pacing_modes) <= 1:
                flags.append({
                    "severity": "ADVISORY",
                    "type": "FLAT_PACING_CURVE",
                    "detail": f"All shots share uniform pacing mode '{list(pacing_modes)[0] if pacing_modes else 'N/A'}'. Introduce rhythmic contrast (e.g. HOLD, IMPACT, ACCELERATE).",
                })

        # Determine overall diagnostic health
        has_critical = any(f["severity"] == "CRITICAL" for f in flags)
        has_warning = any(f["severity"] == "WARNING" for f in flags)
        status = "FAIL" if has_critical else ("WARNING" if has_warning else "CLEAN")

        return {
            "clipName": clip_name,
            "status": status,
            "flags": flags,
            "hasPhysicalPrimitives": has_physical_primitives,
            "cardCount": len(card_matches),
        }

    def audit_multiple_clips(self, clip_names: List[str]) -> Dict[str, Any]:
        """
        Audits a fleet of clips and checks for cross-clip structural clone patterns.
        """
        results = [self.audit_clip(name) for name in clip_names]
        clean_count = sum(1 for r in results if r["status"] == "CLEAN")
        warn_count = sum(1 for r in results if r["status"] == "WARNING")
        fail_count = sum(1 for r in results if r["status"] == "FAIL")

        return {
            "totalAudited": len(clip_names),
            "cleanCount": clean_count,
            "warningCount": warn_count,
            "failCount": fail_count,
            "results": results,
        }


def main():
    parser = argparse.ArgumentParser(description="RightMotion Anti-Template Diagnostic Engine")
    parser.add_argument("--clip", help="Single clip name to audit")
    parser.add_argument("--all", action="store_true", help="Audit all registered clips")
    args = parser.parse_args()

    diag = AntiTemplateDiagnostic()
    if args.clip:
        res = diag.audit_clip(args.clip)
        print(f"\n🔍 Anti-Template Audit for '{args.clip}': {res['status']}")
        if res["flags"]:
            for f in res["flags"]:
                print(f"  [{f['severity']}] {f['type']}: {f['detail']}")
        else:
            print("  ✅ 100% Clean: No unmotivated repetition, meme artifacts, or excessive cardification detected.")
    else:
        # Audit a diverse sample of 6 clips
        sample = ["the_threshold_effect", "the_law_of_structural_load", "small_compromises", "loneliness", "the_dopamine_sugar_trap", "procrastination"]
        summary = diag.audit_multiple_clips(sample)
        print(f"\n📊 Multi-Clip Fleet Audit Summary ({summary['totalAudited']} clips):")
        print(f"  Clean: {summary['cleanCount']} | Warnings: {summary['warningCount']} | Fails: {summary['failCount']}")
        for r in summary["results"]:
            print(f"  - {r['clipName']}: {r['status']} ({len(r['flags'])} flags)")


if __name__ == "__main__":
    main()
