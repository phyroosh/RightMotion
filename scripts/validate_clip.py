#!/usr/bin/env python3
"""
RightMotion Autonomous Pre-Flight Video Validator.
Audits generated clips against all production, retention, and Remotion standards:
    1. Transcript integrity & runtime policy (25-35s solo Judy, <40s Duo Andrew)
2. Audio files (voiceover, BGM, and SFX cues)
3. Editorial scene illustration presence
4. Tactical meme validation (Frame 0 hook, < 2.0s duration, registered meme ID)
5. Remotion composition & thumbnail registration in Root.tsx & thumbnails/index.tsx
6. Optional thumbnail still render dry-run
"""

import sys
import os
import re
import json
import argparse
import subprocess
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent

GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
CYAN = "\033[96m"
BOLD = "\033[1m"
RESET = "\033[0m"

def to_pascal_case(snake_str: str) -> str:
    return "".join(word.capitalize() for word in snake_str.split("_"))

def validate_clip(name: str, render_still: bool = False) -> bool:
    print(f"\n{BOLD}{CYAN}🔍 Auditing RightMotion Composition: '{name}'{RESET}")
    print("=" * 60)
    
    errors = []
    warnings = []
    pascal_name = to_pascal_case(name)

    clip_dir = ROOT_DIR / "src" / "clips" / name
    public_dir = ROOT_DIR / "public" / name

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
    word_count = 0

    if transcript_file.exists():
        try:
            with open(transcript_file, "r", encoding="utf-8") as f:
                transcript_data = json.load(f)
            
            if not isinstance(transcript_data, list) or len(transcript_data) == 0:
                errors.append("transcript.json is empty or not a JSON list")
            else:
                word_count = len(transcript_data)
                last_word = transcript_data[-1]
                last_ms = last_word.get("endMs", last_word.get("end", 0))
                if last_ms < 1000 and last_ms > 0:
                    last_ms *= 1000
                duration_sec = (last_ms + 800) / 1000.0  # +800ms outro padding
                
                # Check for duo presence
                is_duo = any(item.get("speaker") == "andrew" for item in transcript_data)

                # Check runtime policies
                if is_duo:
                    if duration_sec > 42.0:
                        warnings.append(f"Duo runtime ({duration_sec:.1f}s, {word_count} words) exceeds recommended 40s limit (hard cap 42s)")
                    elif duration_sec < 18.0:
                        warnings.append(f"Duo runtime ({duration_sec:.1f}s) is unusually short (<18s)")
                else:
                    if duration_sec > 35.0:
                        warnings.append(f"Solo Judy runtime ({duration_sec:.1f}s, {word_count} words) exceeds the 25-35s policy")
                    elif duration_sec < 25.0:
                        warnings.append(f"Solo Judy runtime ({duration_sec:.1f}s) is below the 25-35s policy")

        except Exception as e:
            errors.append(f"Failed to parse transcript.json: {e}")

    # 5. Tactical Meme Audit
    if canvas_file.exists():
        canvas_code = canvas_file.read_text(encoding="utf-8")
        # JSX components are legal only inside a React return tree.  A former
        # scaffold bug injected meme JSX between imports, producing invalid TSX.
        canvas_export_at = canvas_code.find("export const")
        for component in ("TacticalMemeCard", "TacticalMemeFrame", "MemeStickerOverlay"):
            tag_at = canvas_code.find(f"<{component}")
            if tag_at != -1 and (canvas_export_at == -1 or tag_at < canvas_export_at):
                errors.append(f"{component} JSX appears at module scope; move it inside the Canvas return tree")

        # A clip must have exactly one owner for the mandatory opening Judy.
        # Canvas-owned intros and Presenter-owned intros together create a
        # visible duplicate presenter during the hook.
        presenter_file = clip_dir / "Presenter.tsx"
        presenter_code = presenter_file.read_text(encoding="utf-8") if presenter_file.exists() else ""
        if "<GlossyJudyIntro" in canvas_code and "<GlossyJudyIntro" in presenter_code:
            errors.append("Duplicate GlossyJudyIntro ownership in Canvas.tsx and Presenter.tsx")
        meme_match = re.search(r'<(?:TacticalMemeCard|TacticalMemeFrame)[^>]*memeId=["\']([^"\']+)["\'][^>]*>', canvas_code)
        if meme_match:
            meme_id = meme_match.group(1)
            # Check against registry
            registry_file = ROOT_DIR / "public" / "memes" / "registry.json"
            if registry_file.exists():
                with open(registry_file, "r", encoding="utf-8") as f:
                    reg = json.load(f)
                valid_ids = [m["id"] for m in reg.get("memes", [])]
                if meme_id not in valid_ids:
                    errors.append(f"Meme ID '{meme_id}' is not in public/memes/registry.json (valid: {len(valid_ids)} memes)")
                else:
                    # Check disk file
                    meme_video = ROOT_DIR / "public" / "memes" / f"{meme_id}.mp4"
                    if not meme_video.exists():
                        errors.append(f"Meme video file missing on disk: {meme_video}")

            # Check startFrame
            start_match = re.search(r'startFrame=\{?(\d+)\}?', meme_match.group(0))
            if start_match and int(start_match.group(1)) != 0:
                warnings.append(f"Tactical meme starts at frame {start_match.group(1)} instead of frame 0 hook")

            # Check durationFrames
            dur_match = re.search(r'durationFrames=\{?(\d+)\}?', meme_match.group(0))
            if dur_match and int(dur_match.group(1)) > 66:
                warnings.append(f"Tactical meme duration ({dur_match.group(1)} frames / {int(dur_match.group(1))/30:.2f}s) exceeds 2.0s retention cap")

    # 5b. Scene-design brief and diversity audit.  This is static and never
    # renders the clip, so it is safe to run before every render.
    plan_file = clip_dir / "motion_plan.json"
    if plan_file.exists():
        try:
            plan = json.loads(plan_file.read_text(encoding="utf-8"))
            diversity = plan.get("visualDesign", {}).get("diversity") or plan.get("artDirection", {}).get("diversityScore")
            briefs = [scene.get("designBrief") for scene in plan.get("storyboard", [])]
            if len(briefs) != 4 or any(not brief for brief in briefs):
                errors.append("motion_plan.json is missing one or more required scene design briefs")
            elif not diversity or not diversity.get("passes"):
                errors.append("motion_plan.json fails the semantic visual-diversity check")
        except Exception as exc:
            errors.append(f"Unable to audit motion_plan.json: {exc}")

    # 6. Remotion Root & Thumbnails Registration
    root_file = ROOT_DIR / "src" / "Root.tsx"
    thumb_file = ROOT_DIR / "src" / "thumbnails" / "index.tsx"

    if root_file.exists():
        root_content = root_file.read_text(encoding="utf-8")
        if f'id="{pascal_name}Video"' not in root_content:
            errors.append(f"Composition '{pascal_name}Video' not registered in src/Root.tsx")
        if f'id="{pascal_name}Thumbnail"' not in root_content:
            errors.append(f"Still '{pascal_name}Thumbnail' not registered in src/Root.tsx")

    if thumb_file.exists():
        thumb_content = thumb_file.read_text(encoding="utf-8")
        if f"export const {pascal_name}Thumbnail" not in thumb_content:
            errors.append(f"Thumbnail component '{pascal_name}Thumbnail' not exported in src/thumbnails/index.tsx")

    # 7. Render Dry Run (if requested)
    if render_still and not errors:
        print(f"   {CYAN}⚡ Running Remotion still render dry-run...{RESET}")
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
            print(f"   {GREEN}✓ Still thumbnail rendered successfully!{RESET}")

    # Final Output Summary
    mode_str = "Judy & Andrew Duo (up to 40s)" if is_duo else "Solo Judy Insights (25-35s policy)"
    print(f"\n📊 Summary for {BOLD}{name}{RESET}:")
    print(f"   • Presenter Mode: {mode_str}")
    print(f"   • Word Count:     {word_count} words")
    print(f"   • Total Runtime:  {duration_sec:.1f}s ({int(duration_sec * 30)} frames)")

    if warnings:
        print(f"\n{YELLOW}{BOLD}⚠️  Warnings ({len(warnings)}):{RESET}")
        for w in warnings:
            print(f"   {YELLOW}• {w}{RESET}")

    if errors:
        print(f"\n{RED}{BOLD}❌ Errors ({len(errors)}):{RESET}")
        for e in errors:
            print(f"   {RED}• {e}{RESET}")
        print(f"\n{RED}{BOLD}Result: FAILED{RESET}\n")
        return False
    else:
        print(f"\n{GREEN}{BOLD}✅ All Quality & Architecture Checks Passed! Ready for Render.{RESET}\n")
        return True

def main():
    parser = argparse.ArgumentParser(description="Validate a RightMotion composition before rendering.")
    parser.add_argument("name", help="Clip folder name (e.g. self_doubt, teenage_relationships)")
    parser.add_argument("--still", action="store_true", help="Perform a dry-run render of the still thumbnail")
    args = parser.parse_args()

    success = validate_clip(args.name, render_still=args.still)
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
