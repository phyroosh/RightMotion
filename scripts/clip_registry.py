#!/usr/bin/env python3
"""
🎬 RightMotion Structured Clip & Thumbnail Registry Manager
Location: scripts/clip_registry.py

Authoritative manager for src/clips/registry.ts and src/thumbnails/index.tsx.
Eliminates brittle string-replace mutations by providing structured, idempotent,
and validated registration for all RightMotion video compositions and thumbnails.
"""

import os
import re
import sys
from pathlib import Path
from typing import Dict, Any, List, Optional

ROOT_DIR = Path(__file__).resolve().parent.parent
DEFAULT_REGISTRY_PATH = ROOT_DIR / "src" / "clips" / "registry.ts"
DEFAULT_THUMBNAILS_PATH = ROOT_DIR / "src" / "thumbnails" / "index.tsx"


def get_registered_clips(registry_path: Optional[Path] = None) -> List[Dict[str, Any]]:
    """
    Parses and returns all clips registered in src/clips/registry.ts.
    """
    path = registry_path or DEFAULT_REGISTRY_PATH
    if not path.exists():
        return []

    content = path.read_text(encoding="utf-8")
    clips: List[Dict[str, Any]] = []

    array_match = re.search(r'export\s+const\s+REGISTERED_CLIPS[^{]*=\s*\[([\s\S]*?)\n\];', content)
    if not array_match:
        return []

    array_content = array_match.group(1)
    entries = re.findall(r'\{([^{}]+)\}', array_content)

    for e in entries:
        id_m = re.search(r'id:\s*["\']([^"\']+)["\']', e)
        pascal_m = re.search(r'pascalName:\s*["\']([^"\']+)["\']', e)
        comp_m = re.search(r'component:\s*([^,\s]+)', e)
        thumb_m = re.search(r'thumbnailComponent:\s*([^,\s]+)', e)
        fmt_m = re.search(r'format:\s*["\']([^"\']+)["\']', e)

        if id_m and pascal_m:
            clip_id = id_m.group(1)
            pascal_name = pascal_m.group(1)
            clips.append({
                "id": clip_id,
                "pascalName": pascal_name,
                "component": comp_m.group(1) if comp_m else f"{pascal_name}Composition",
                "thumbnailComponent": thumb_m.group(1) if thumb_m else f"{pascal_name}Thumbnail",
                "format": fmt_m.group(1) if fmt_m else "shorts",
            })

    return clips


def is_clip_registered(clip_id: str, registry_path: Optional[Path] = None) -> bool:
    """Checks if a clip is already registered in src/clips/registry.ts."""
    path = registry_path or DEFAULT_REGISTRY_PATH
    if not path.exists():
        return False
    content = path.read_text(encoding="utf-8")
    return bool(re.search(rf'\bid:\s*["\']{re.escape(clip_id)}["\']', content))


def register_clip_composition(
    clip_id: str,
    pascal_name: str,
    format_type: str = "shorts",
    custom_duration: Optional[int] = None,
    registry_path: Optional[Path] = None,
) -> bool:
    """
    Idempotently registers a clip in src/clips/registry.ts with structural validation.
    """
    path = registry_path or DEFAULT_REGISTRY_PATH
    if not path.exists():
        raise FileNotFoundError(f"Clip registry not found: {path}")

    content = path.read_text(encoding="utf-8")

    # If already registered, verify integrity and return True
    if is_clip_registered(clip_id, path):
        return True

    # 1. Prepare Component & Transcript Imports
    comp_import = (
        f'import {{ {pascal_name}Composition }} from "./{clip_id}";\n'
        f'import {clip_id}Transcript from "./{clip_id}/transcript.json";\n'
    )

    # Insert imports before section 2 or after section 1 header
    if "// 1. Clip Component & Transcript Imports" in content:
        split_marker = "// 1. Clip Component & Transcript Imports\n// ============================================================================\n"
        if split_marker in content:
            content = content.replace(split_marker, f"{split_marker}{comp_import}")
        else:
            content = re.sub(
                r"(// 1\. Clip Component & Transcript Imports[^\n]*\n(?:[^\n]*\n)?)",
                rf"\1{comp_import}",
                content,
                count=1,
            )
    else:
        # Fallback to inserting after imports block
        content = comp_import + content

    # 2. Add Thumbnail Component Import to section 2 if not present
    thumb_name = f"{pascal_name}Thumbnail"
    if thumb_name not in content:
        # Insert inside import { ... } from "../thumbnails";
        thumb_import_match = re.search(r'(\}\s*from\s*["\']\.\./thumbnails["\'];)', content)
        if thumb_import_match:
            content = (
                content[: thumb_import_match.start()]
                + f"  {thumb_name},\n"
                + content[thumb_import_match.start() :]
            )

    # 3. Insert Entry into REGISTERED_CLIPS array
    custom_dur_line = f"    customDurationInFrames: {custom_duration},\n" if custom_duration else ""
    new_entry = f"""  {{
    id: "{clip_id}",
    pascalName: "{pascal_name}",
    component: {pascal_name}Composition,
    thumbnailComponent: {thumb_name},
    transcript: {clip_id}Transcript as any[],
    format: "{format_type}",
{custom_dur_line}  }},\n"""

    array_marker = "export const REGISTERED_CLIPS: ClipRegistration[] = [\n"
    if array_marker in content:
        content = content.replace(array_marker, f"{array_marker}{new_entry}")
    else:
        content = re.sub(
            r"(export\s+const\s+REGISTERED_CLIPS\s*:\s*ClipRegistration\[\]\s*=\s*\[\n)",
            rf"\1{new_entry}",
            content,
            count=1,
        )

    # 4. Syntax & Structural Invariant Validation
    # Ensure balanced curly braces and square brackets
    open_curly = content.count("{")
    close_curly = content.count("}")
    open_sq = content.count("[")
    close_sq = content.count("]")

    if open_curly != close_curly:
        raise ValueError(
            f"Registration aborted: unbalanced curly braces in registry.ts ({{: {open_curly}, }}: {close_curly})"
        )
    if open_sq != close_sq:
        raise ValueError(
            f"Registration aborted: unbalanced square brackets in registry.ts ([: {open_sq}, ]: {close_sq})"
        )

    path.write_text(content, encoding="utf-8")
    return True


def register_clip_thumbnail(
    clip_id: str,
    pascal_name: str,
    hook_word: str,
    accent_color: str,
    format_type: str = "shorts",
    theme: str = "apple_studio",
    thumbnails_path: Optional[Path] = None,
) -> bool:
    """
    Idempotently registers a thumbnail component in src/thumbnails/index.tsx.
    """
    path = thumbnails_path or DEFAULT_THUMBNAILS_PATH
    if not path.exists():
        raise FileNotFoundError(f"Thumbnails file not found: {path}")

    content = path.read_text(encoding="utf-8")
    thumb_name = f"{pascal_name}Thumbnail"

    if f"export const {thumb_name}" in content:
        return True

    aspect_str = "9:16" if format_type == "shorts" else "16:9"

    thumb_decl = f"""
export const {thumb_name}: React.FC = () => (
  <ImpossibleMetaphorLayout
    hookWord="{hook_word}"
    accentColor="{accent_color}"
    heroImageSrc="{clip_id}/assets/scene_illustration.png"
    aspectRatio="{aspect_str}"
    theme="{theme}"
  />
);
"""
    content = content.rstrip() + "\n" + thumb_decl
    path.write_text(content, encoding="utf-8")
    return True


def main():
    if len(sys.argv) > 1 and sys.argv[1] == "list":
        clips = get_registered_clips()
        print(f"🎬 Total Registered Clips: {len(clips)}")
        for c in clips:
            print(f"  • {c['id']} ({c['pascalName']}Video / {c['thumbnailComponent']}) [{c['format']}]")
    elif len(sys.argv) > 2 and sys.argv[1] == "check":
        name = sys.argv[2]
        reg = is_clip_registered(name)
        print(f"Clip '{name}' registered: {reg}")
    else:
        print("Usage: python3 scripts/clip_registry.py [list | check <name>]")


if __name__ == "__main__":
    main()
