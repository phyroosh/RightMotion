#!/usr/bin/env python3
"""
RightMotion Autonomous Pre-Flight Video Validator.
Audits generated clips against all production, retention, and Remotion standards:
1. Transcript integrity & runtime policy (25-35s solo Judy, <40s Duo Andrew)
2. Audio files (voiceover.mp3) and editorial scene illustration presence
3. Structured clip registration in src/clips/registry.ts & thumbnail export in src/thumbnails/index.tsx
4. Platform-safe composition audit (YouTube Shorts UI clearance)
5. Anti-cardification & frontier utilization audit (quantitative scoring)
6. Optional thumbnail still render dry-run
"""

import sys
import os
import re
import json
import argparse
import subprocess
from pathlib import Path
from typing import Dict, Any, List, Tuple

ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(ROOT_DIR / "scripts"))

try:
    from platform_safe_validator import audit_clip_source
except ImportError:
    audit_clip_source = None

GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
CYAN = "\033[96m"
BOLD = "\033[1m"
RESET = "\033[0m"


def to_pascal_case(snake_str: str) -> str:
    return "".join(word.capitalize() for word in re.split(r"[_\-\s]+", snake_str.strip()))


def audit_clip(name: str, render_still: bool = False) -> Tuple[bool, List[str], List[str], Dict[str, Any]]:
    """
    Performs comprehensive pre-flight validation of a RightMotion clip.
    Returns: (is_valid, errors, warnings, summary_data)
    """
    errors: List[str] = []
    warnings: List[str] = []
    pascal_name = to_pascal_case(name)

    clip_dir = ROOT_DIR / "src" / "clips" / name
    public_dir = ROOT_DIR / "public" / name

    summary_data: Dict[str, Any] = {
        "name": name,
        "pascal_name": pascal_name,
        "is_duo": False,
        "word_count": 0,
        "duration_sec": 0.0,
        "total_frames": 0,
        "cardification_score": None,
    }

    # 1. Directory Structure Checks
    if not clip_dir.exists():
        errors.append(f"Source directory missing: {clip_dir}")
    if not public_dir.exists():
        errors.append(f"Public asset directory missing: {public_dir}")

    # 2. Source Code Files
    index_file = clip_dir / "index.tsx"
    canvas_file = clip_dir / "Canvas.tsx"
    transcript_file = clip_dir / "transcript.json"

    if not index_file.exists():
        errors.append(f"Missing composition entry: {index_file}")
    if not canvas_file.exists():
        errors.append(f"Missing visual canvas: {canvas_file}")
    if not transcript_file.exists():
        errors.append(f"Missing transcript JSON: {transcript_file}")

    # 3. Audio & Illustration Assets
    voiceover_file = public_dir / "voiceover.mp3"
    illustration_file = public_dir / "assets" / "scene_illustration.png"

    if not voiceover_file.exists():
        errors.append(f"Missing voiceover audio: {voiceover_file}")
    else:
        vo_size = voiceover_file.stat().st_size
        if vo_size < 1000:
            errors.append(f"Voiceover file suspiciously small ({vo_size} bytes): {voiceover_file}")

    if not illustration_file.exists():
        warnings.append(f"Missing scene illustration: {illustration_file}")

    # 4. Transcript & Runtime Policy Analysis
    is_duo = False
    duration_sec = 0.0
    transcript_word_count = 0

    if transcript_file.exists():
        try:
            with open(transcript_file, "r", encoding="utf-8") as f:
                transcript_data = json.load(f)

            if not isinstance(transcript_data, list) or len(transcript_data) == 0:
                errors.append("transcript.json is empty or not a JSON list")
            else:
                transcript_word_count = len(transcript_data)
                last_word = transcript_data[-1]
                last_ms = last_word.get("endMs", last_word.get("end", 0))
                if 0 < last_ms < 1000:
                    last_ms *= 1000
                duration_sec = (last_ms + 800) / 1000.0  # +800ms outro padding

                # Check for duo presence
                is_duo = any(item.get("speaker") == "andrew" for item in transcript_data)

                # Check runtime policies
                if is_duo:
                    if duration_sec > 42.0:
                        warnings.append(
                            f"Duo runtime ({duration_sec:.1f}s, {transcript_word_count} words) exceeds recommended 40s limit (hard cap 42s)"
                        )
                    elif duration_sec < 18.0:
                        warnings.append(f"Duo runtime ({duration_sec:.1f}s) is unusually short (<18s)")
                else:
                    if duration_sec > 35.0:
                        warnings.append(
                            f"Solo Judy runtime ({duration_sec:.1f}s, {transcript_word_count} words) exceeds the 25-35s policy"
                        )
                    elif duration_sec < 25.0:
                        warnings.append(f"Solo Judy runtime ({duration_sec:.1f}s) is below the 25-35s policy")

        except Exception as e:
            errors.append(f"Failed to parse transcript.json: {e}")

    summary_data["is_duo"] = is_duo
    summary_data["duration_sec"] = duration_sec
    summary_data["word_count"] = transcript_word_count
    summary_data["total_frames"] = int(duration_sec * 30)

    # 5. Zero Memes Policy Audit
    if canvas_file.exists():
        canvas_code = canvas_file.read_text(encoding="utf-8")
        for component in ("TacticalMemeCard", "TacticalMemeFrame", "MemeStickerOverlay"):
            if f"<{component}" in canvas_code:
                warnings.append(
                    f"{component} detected: Memes/stickers are deprecated under the Zero-Memes policy. Pivot to semantic cutouts in public/assets/."
                )

        # A clip must have exactly one owner for the opening Judy
        presenter_file = clip_dir / "Presenter.tsx"
        presenter_code = presenter_file.read_text(encoding="utf-8") if presenter_file.exists() else ""
        if "<GlossyJudyIntro" in canvas_code and "<GlossyJudyIntro" in presenter_code:
            errors.append("Duplicate GlossyJudyIntro ownership in Canvas.tsx and Presenter.tsx")

    # 5b. Frontier T: Thumbnail Plan Audit (Variable Shadowing Fixed)
    thumb_plan_file = clip_dir / "thumbnail_plan.json"
    if thumb_plan_file.exists():
        try:
            t_plan = json.loads(thumb_plan_file.read_text(encoding="utf-8"))
            if "chosenConcept" not in t_plan or "thumbnailJob" not in t_plan:
                errors.append("thumbnail_plan.json is missing required Frontier T fields")
            hook_text = t_plan.get("chosenConcept", {}).get("textHook", "")
            hook_word_count = len(hook_text.split())
            if hook_word_count > 3:
                errors.append(
                    f"thumbnail_plan.json exceeds complexity budget: textHook '{hook_text}' has {hook_word_count} words (> 3)"
                )
        except Exception as exc:
            errors.append(f"Unable to audit thumbnail_plan.json: {exc}")

    # 5c. Platform-Safe Composition Audit (YouTube Shorts UI clearance)
    if audit_clip_source:
        try:
            platform_reports = audit_clip_source(name, root_dir=ROOT_DIR)
            for r in platform_reports:
                if r.status == "CRITICAL":
                    errors.append(f"Platform Safe Collision: {r.element} ({r.intersection}) -> {r.recommended_correction}")
                elif r.status == "WARNING":
                    warnings.append(f"Platform Safe Caution: {r.element} ({r.intersection}) -> {r.recommended_correction}")
        except Exception as exc:
            warnings.append(f"Unable to run platform safe audit: {exc}")

    # 6. Structured Clip & Thumbnail Registration (Canonical Registry Audit)
    registry_file = ROOT_DIR / "src" / "clips" / "registry.ts"
    root_file = ROOT_DIR / "src" / "Root.tsx"
    thumb_file = ROOT_DIR / "src" / "thumbnails" / "index.tsx"

    if registry_file.exists():
        reg_content = registry_file.read_text(encoding="utf-8")
        id_pattern = rf'\bid:\s*["\']{re.escape(name)}["\']'
        if not re.search(id_pattern, reg_content):
            errors.append(f"Clip '{name}' not registered in src/clips/registry.ts (REGISTERED_CLIPS)")
        else:
            pascal_pattern = rf'\bpascalName:\s*["\']{re.escape(pascal_name)}["\']'
            if not re.search(pascal_pattern, reg_content):
                errors.append(f"Clip '{name}' has mismatched pascalName in src/clips/registry.ts (expected '{pascal_name}')")
            if f"{pascal_name}Composition" not in reg_content:
                errors.append(f"Composition '{pascal_name}Composition' not imported in src/clips/registry.ts")
    else:
        errors.append(f"Missing structured clip registry: {registry_file}")

    if root_file.exists():
        root_content = root_file.read_text(encoding="utf-8")
        # Root.tsx mounts clips dynamically from REGISTERED_CLIPS
        if "REGISTERED_CLIPS" not in root_content and f'id="{pascal_name}Video"' not in root_content:
            errors.append("src/Root.tsx does not mount REGISTERED_CLIPS or direct composition")
    else:
        errors.append(f"Missing Remotion Root: {root_file}")

    if thumb_file.exists():
        thumb_content = thumb_file.read_text(encoding="utf-8")
        if f"{pascal_name}Thumbnail" not in thumb_content:
            errors.append(f"Thumbnail component '{pascal_name}Thumbnail' not exported in src/thumbnails/index.tsx")

    # 7. Render Dry Run (if requested)
    if render_still and not errors:
        test_out = ROOT_DIR / "out" / f"test_{name}_still.png"
        test_out.parent.mkdir(parents=True, exist_ok=True)
        cmd = [
            "npx", "remotion", "still",
            "src/index.ts",
            f"{pascal_name}Thumbnail",
            str(test_out)
        ]
        res = subprocess.run(cmd, cwd=ROOT_DIR, capture_output=True, text=True)
        if res.returncode != 0:
            errors.append(f"Remotion still render failed: {res.stderr.strip()}")
        else:
            if test_out.exists():
                test_out.unlink()

    # 8. Anti-Cardification & Frontier Utilization Audit
    try:
        from frontier_utilization import FrontierUtilizationAuditor
        if canvas_file.exists():
            report = FrontierUtilizationAuditor.audit_clip_directory(clip_dir)
            summary_data["cardification_score"] = report.overall_cardification_score
            summary_data["frontier_report"] = report

            if report.overall_cardification_score >= 40.0:
                reasons_list = [r for sc in report.scenes for r in sc.reasons]
                reasons_str = "; ".join(reasons_list) if reasons_list else "Score exceeded threshold"
                errors.append(
                    f"Cardification Score excessive ({report.overall_cardification_score:.1f} >= 40.0). "
                    f"Scene is dominated by card containers/pills rather than physical mechanisms. "
                    f"Reasons: {reasons_str}"
                )
            elif not report.remove_text_test_passed and report.total_mechanism_count == 0:
                warnings.append(
                    "Scene lacks physical mechanism primitives; canvas relies heavily on typography."
                )
    except Exception as e:
        warnings.append(f"Frontier utilization audit skipped: {e}")

    is_valid = len(errors) == 0
    return is_valid, errors, warnings, summary_data


def validate_clip(name: str, render_still: bool = False, print_output: bool = True) -> bool:
    """CLI and pipeline interface for validating a clip."""
    if print_output:
        print(f"\n{BOLD}{CYAN}🔍 Auditing RightMotion Composition: '{name}'{RESET}")
        print("=" * 60)

    is_valid, errors, warnings, summary_data = audit_clip(name, render_still=render_still)

    if print_output:
        # Print Frontier Utilization metrics if available
        report = summary_data.get("frontier_report")
        if report:
            print(f"   {CYAN}📊 Frontier Utilization & Anti-Cardification Audit:{RESET}")
            print(f"      • Cardification Score:      {report.overall_cardification_score:.1f} (Pass threshold: < 40.0)")
            print(f"      • Presentation Cards:       {report.total_card_count}")
            print(f"      • Physical Mechanisms:      {report.total_mechanism_count}")
            print(f"      • Primary Mechanism Ratio:  {report.primary_mechanism_ratio * 100:.1f}%")
            print(f"      • Mute Test:                {'PASSED' if report.mute_test_passed else 'FAILED'}")
            print(f"      • Remove-Text Test:         {'PASSED' if report.remove_text_test_passed else 'FAILED'}")

        mode_str = (
            "Judy & Andrew Duo (up to 40s)"
            if summary_data["is_duo"]
            else "Solo Judy Insights (25-35s policy)"
        )
        print(f"\n📊 Summary for {BOLD}{name}{RESET}:")
        print(f"   • Presenter Mode: {mode_str}")
        print(f"   • Word Count:     {summary_data['word_count']} words")
        print(f"   • Total Runtime:  {summary_data['duration_sec']:.1f}s ({summary_data['total_frames']} frames)")

        if warnings:
            print(f"\n{YELLOW}{BOLD}⚠️  Warnings ({len(warnings)}):{RESET}")
            for w in warnings:
                print(f"   {YELLOW}• {w}{RESET}")

        if errors:
            print(f"\n{RED}{BOLD}❌ Errors ({len(errors)}):{RESET}")
            for e in errors:
                print(f"   {RED}• {e}{RESET}")
            print(f"\n{RED}{BOLD}Result: FAILED{RESET}\n")
        else:
            print(f"\n{GREEN}{BOLD}✅ All Quality & Architecture Checks Passed! Ready for Render.{RESET}\n")

    return is_valid


def main():
    parser = argparse.ArgumentParser(description="Validate a RightMotion composition before rendering.")
    parser.add_argument("name", help="Clip folder name (e.g. self_doubt, teenage_relationships)")
    parser.add_argument("--still", action="store_true", help="Perform a dry-run render of the still thumbnail")
    args = parser.parse_args()

    success = validate_clip(args.name, render_still=args.still)
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
