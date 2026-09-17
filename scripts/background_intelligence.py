#!/usr/bin/env python3
"""
🎬 RightMotion — Universal Background Intelligence Subsystem
Location: scripts/background_intelligence.py

Autonomous asset discovery, security validation, computer vision analysis,
and semantic registry management for reusable background environments.

Capabilities:
1. Automatic asset discovery in canonical directory (`public/assets/universal_backgrounds/`).
2. Robust security & path traversal rejection.
3. Content-hash (SHA-256) and mtime caching to avoid redundant image decoding.
4. Computer vision analysis via Pillow & NumPy:
   - Perceptual luminance (ITU-R BT.709: 0.2126R + 0.7152G + 0.0722B)
   - RMS contrast & dynamic range
   - Saturation & color temperature (warm, cool, neutral, monochrome, colorful)
   - Edge gradient density & texture strength (subtle, medium, high)
   - Shannon visual entropy & spatial complexity (low, medium, high)
   - Text-safe region detection (top, center, bottom, left, right)
   - 9:16 mobile crop intelligence & focal point resolution
   - Compatibility metrics (text, presenter, graphic)
   - Motion & transition suitability
5. Graceful failure handling (corrupted assets marked ANALYSIS_FAILED).
"""

import argparse
import hashlib
import json
import math
import os
import re
import sys
from dataclasses import dataclass, field, asdict
from pathlib import Path
from typing import Dict, Any, List, Optional, Tuple

import numpy as np
from PIL import Image, ImageOps

ROOT_DIR = Path(__file__).resolve().parent.parent
CANONICAL_BG_DIR = ROOT_DIR / "public" / "assets" / "universal_backgrounds"
REGISTRY_PATH = CANONICAL_BG_DIR / "registry.json"
CACHE_DIR = ROOT_DIR / ".cache" / "universal_backgrounds"
CACHE_FILE = CACHE_DIR / "index_cache.json"

SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
SAFE_FILENAME_REGEX = re.compile(r"^[a-zA-Z0-9_\-\.]+$")


def sanitize_and_validate_path(filepath: Path, base_dir: Path = CANONICAL_BG_DIR) -> bool:
    """Strictly validates against path traversal, symlink escapes, and illegal characters."""
    try:
        resolved_base = base_dir.resolve()
        resolved_file = filepath.resolve()
        # Must be strictly within base_dir
        if resolved_base not in resolved_file.parents and resolved_file != resolved_base:
            return False
        # Filename must adhere to safe character set
        if not SAFE_FILENAME_REGEX.match(filepath.name):
            return False
        # Reject traversal markers
        if ".." in filepath.parts or "/" in filepath.name or "\\" in filepath.name:
            return False
        return True
    except Exception:
        return False


def compute_file_hash(filepath: Path) -> str:
    """Compute SHA-256 hash of file content in chunks."""
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()


@dataclass
class VisualAnalysis:
    width: int
    height: int
    aspectRatio: float
    format: str
    fileSize: int
    hash: str

    tone: str  # "dark" | "neutral" | "bright"
    colorTemp: str  # "warm" | "cool" | "neutral"
    isMonochrome: bool
    saturation: float  # 0.0 - 1.0
    brightness: float  # 0.0 - 1.0 (mean perceptual luminance)
    contrast: float  # 0.0 - 1.0 (RMS contrast)
    textureStrength: str  # "subtle" | "medium" | "high"
    edgeDensity: float
    visualComplexity: str  # "low" | "medium" | "high"
    entropy: float

    material: str
    moods: List[str]
    visualDensity: str  # "empty" | "sparse" | "medium" | "dense"

    textCompatibility: str  # "excellent" | "good" | "poor"
    presenterCompatibility: str  # "excellent" | "good" | "poor"
    graphicCompatibility: str  # "excellent" | "good" | "poor"

    textSafeRegions: Dict[str, bool]
    focalCenter: List[float]  # [x_norm, y_norm]
    safeCropModes: List[str]
    motionSuitability: List[str]
    transitionSuitability: List[str]

    lowResWarning: bool = False
    status: str = "READY"


class BackgroundAnalyzer:
    """Analyzes visual attributes of candidate backgrounds using Pillow & NumPy."""

    @staticmethod
    def analyze_image(filepath: Path) -> VisualAnalysis:
        file_size = filepath.stat().st_size
        file_hash = compute_file_hash(filepath)

        try:
            with Image.open(filepath) as img:
                img_format = (img.format or filepath.suffix.lstrip(".")).upper()
                width, height = img.size
                aspect_ratio = round(width / max(1, height), 4)

                # Convert to RGB array
                rgb_img = img.convert("RGB")
                arr = np.array(rgb_img, dtype=np.float32)
        except Exception as e:
            # Corrupted or unreadable image
            return VisualAnalysis(
                width=0,
                height=0,
                aspectRatio=0.0,
                format=filepath.suffix.lstrip(".").upper(),
                fileSize=file_size,
                hash=file_hash,
                tone="unknown",
                colorTemp="neutral",
                isMonochrome=False,
                saturation=0.0,
                brightness=0.0,
                contrast=0.0,
                textureStrength="unknown",
                edgeDensity=0.0,
                visualComplexity="unknown",
                entropy=0.0,
                material="unknown",
                moods=[],
                visualDensity="unknown",
                textCompatibility="poor",
                presenterCompatibility="poor",
                graphicCompatibility="poor",
                textSafeRegions={"safeTop": False, "safeCenter": False, "safeBottom": False, "safeLeft": False, "safeRight": False},
                focalCenter=[0.5, 0.5],
                safeCropModes=["center"],
                motionSuitability=["static"],
                transitionSuitability=["cut"],
                lowResWarning=True,
                status="ANALYSIS_FAILED",
            )

        # 1. Luminance & Contrast
        # Rec. 709 luminance
        r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
        gray = 0.2126 * r + 0.7152 * g + 0.0722 * b
        mean_lum = float(gray.mean()) / 255.0
        contrast_rms = float(gray.std()) / 255.0

        if mean_lum < 0.25:
            tone = "dark"
        elif mean_lum > 0.72:
            tone = "bright"
        else:
            tone = "neutral"

        # 2. Color Temperature & Saturation
        max_c = np.maximum(np.maximum(r, g), b)
        min_c = np.minimum(np.minimum(r, g), b)
        delta = max_c - min_c
        with np.errstate(divide="ignore", invalid="ignore"):
            sat_map = np.where(max_c > 0, delta / max_c, 0.0)
        mean_sat = float(sat_map.mean())

        mean_r, mean_g, mean_b = float(r.mean()), float(g.mean()), float(b.mean())
        if mean_sat < 0.12:
            is_monochrome = True
            color_temp = "neutral"
        else:
            is_monochrome = False
            if mean_r > mean_b + 12:
                color_temp = "warm"
            elif mean_b > mean_r + 12:
                color_temp = "cool"
            else:
                color_temp = "neutral"

        # 3. Edge Gradient & Texture Strength
        gy, gx = np.gradient(gray)
        grad_mag = np.sqrt(gx**2 + gy**2)
        mean_edge = float(grad_mag.mean())

        if mean_edge < 3.0:
            texture_strength = "subtle"
        elif mean_edge < 9.0:
            texture_strength = "medium"
        else:
            texture_strength = "high"

        # 4. Visual Entropy & Complexity
        hist, _ = np.histogram(gray, bins=64, range=(0, 255), density=True)
        hist = hist[hist > 0]
        entropy = float(-np.sum(hist * np.log2(hist))) if len(hist) > 0 else 0.0

        # High entropy combined with high edge density indicates high visual complexity
        complexity_metric = (entropy / 6.0) * 0.5 + (min(mean_edge, 20.0) / 20.0) * 0.5
        if complexity_metric < 0.45:
            visual_complexity = "low"
            visual_density = "sparse" if mean_edge > 1.5 else "empty"
        elif complexity_metric < 0.75:
            visual_complexity = "medium"
            visual_density = "medium"
        else:
            visual_complexity = "high"
            visual_density = "dense"

        # 5. Text-Safe Regions
        # Evaluate variance in standard 9:16 vertical video bands
        # Top band (15% - 40%), Center band (40% - 70%), Bottom band (70% - 90%)
        h, w = gray.shape
        top_slice = gray[int(h * 0.15) : int(h * 0.40), :]
        center_slice = gray[int(h * 0.40) : int(h * 0.70), :]
        bottom_slice = gray[int(h * 0.70) : int(h * 0.90), :]
        left_slice = gray[:, : int(w * 0.50)]
        right_slice = gray[:, int(w * 0.50) :]

        top_edge = float(grad_mag[int(h * 0.15) : int(h * 0.40), :].mean())
        center_edge = float(grad_mag[int(h * 0.40) : int(h * 0.70), :].mean())
        bottom_edge = float(grad_mag[int(h * 0.70) : int(h * 0.90), :].mean())
        left_edge = float(grad_mag[:, : int(w * 0.50)].mean())
        right_edge = float(grad_mag[:, int(w * 0.50) :].mean())

        # Safe if edge clutter is under threshold and variance is controlled
        safe_top = bool(top_edge < 14.0 and (top_slice.std() / 255.0) < 0.35)
        safe_center = bool(center_edge < 14.0 and (center_slice.std() / 255.0) < 0.35)
        safe_bottom = bool(bottom_edge < 14.0 and (bottom_slice.std() / 255.0) < 0.35)
        safe_left = bool(left_edge < 14.0)
        safe_right = bool(right_edge < 14.0)

        # Text compatibility rating
        if (tone == "dark" or tone == "bright") and visual_complexity in ["low", "medium"]:
            text_compat = "excellent"
        elif visual_complexity == "high":
            text_compat = "poor"
        else:
            text_compat = "good"

        # Presenter compatibility (dark/neutral grounds provide sharp separation for Judy)
        if tone == "dark":
            presenter_compat = "excellent"
        elif tone == "bright" and mean_lum > 0.85:
            presenter_compat = "good"
        else:
            presenter_compat = "good" if visual_complexity != "high" else "poor"

        # Graphic compatibility
        graphic_compat = "excellent" if visual_complexity in ["low", "medium"] else "good"

        # 6. Focal Center (Center of mass of luminance gradient / energy)
        y_indices, x_indices = np.indices(gray.shape)
        weights = grad_mag + 1e-5
        total_w = weights.sum()
        focal_x = float((x_indices * weights).sum() / (total_w * max(1, w)))
        focal_y = float((y_indices * weights).sum() / (total_w * max(1, h)))
        focal_center = [round(max(0.1, min(0.9, focal_x)), 3), round(max(0.1, min(0.9, focal_y)), 3)]

        # 7. Material & Mood Inference
        name_lower = filepath.stem.lower()
        moods = []
        if tone == "dark":
            moods.extend(["cinematic", "tactile", "minimal"])
        elif tone == "bright":
            moods.extend(["editorial", "clean", "calm"])
        else:
            moods.extend(["neutral", "grounded"])

        if "paper" in name_lower or "grain" in name_lower:
            material = "paper"
            moods.append("tactile")
        elif "concrete" in name_lower or "stone" in name_lower:
            material = "concrete"
            moods.append("brutalist")
        elif "metal" in name_lower:
            material = "metal"
            moods.append("technical")
        elif "fabric" in name_lower or "cloth" in name_lower:
            material = "fabric"
            moods.append("organic")
        elif "gradient" in name_lower:
            material = "gradient"
            moods.append("abstract")
        elif tone == "dark" and texture_strength in ["medium", "high"]:
            material = "matte_surface"
            moods.append("cinematic")
        else:
            material = "studio_surface"

        # 8. Motion & Transitions
        motion_suitability = ["static", "slow_drift"]
        if visual_complexity != "high":
            motion_suitability.extend(["zoom", "parallax"])

        transition_suitability = ["dissolve", "cut"]
        if tone == "dark":
            transition_suitability.append("luma_wipe")

        safe_crop_modes = ["center"]
        if focal_center[1] < 0.4:
            safe_crop_modes.append("top_weighted")
        elif focal_center[1] > 0.6:
            safe_crop_modes.append("bottom_weighted")

        low_res = bool(width < 1080 or height < 1920)

        return VisualAnalysis(
            width=width,
            height=height,
            aspectRatio=aspect_ratio,
            format=img_format,
            fileSize=file_size,
            hash=file_hash,
            tone=tone,
            colorTemp=color_temp,
            isMonochrome=is_monochrome,
            saturation=round(mean_sat, 3),
            brightness=round(mean_lum, 3),
            contrast=round(contrast_rms, 3),
            textureStrength=texture_strength,
            edgeDensity=round(mean_edge, 2),
            visualComplexity=visual_complexity,
            entropy=round(entropy, 2),
            material=material,
            moods=sorted(list(set(moods))),
            visualDensity=visual_density,
            textCompatibility=text_compat,
            presenterCompatibility=presenter_compat,
            graphicCompatibility=graphic_compat,
            textSafeRegions={
                "safeTop": safe_top,
                "safeCenter": safe_center,
                "safeBottom": safe_bottom,
                "safeLeft": safe_left,
                "safeRight": safe_right,
            },
            focalCenter=focal_center,
            safeCropModes=safe_crop_modes,
            motionSuitability=motion_suitability,
            transitionSuitability=transition_suitability,
            lowResWarning=low_res,
            status="READY",
        )


class BackgroundRegistry:
    """Manages indexing, caching, and persistence of the universal background library."""

    def __init__(self, bg_dir: Path = CANONICAL_BG_DIR, cache_file: Path = CACHE_FILE, registry_path: Path = REGISTRY_PATH):
        self.bg_dir = bg_dir
        self.cache_file = cache_file
        self.registry_path = registry_path
        self.cache: Dict[str, Any] = self._load_cache()

    def _load_cache(self) -> Dict[str, Any]:
        if self.cache_file.exists():
            try:
                with open(self.cache_file, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                return {}
        return {}

    def _save_cache(self):
        self.cache_file.parent.mkdir(parents=True, exist_ok=True)
        with open(self.cache_file, "w", encoding="utf-8") as f:
            json.dump(self.cache, f, indent=2)

    def scan(self, force_rescan: bool = False) -> Dict[str, Any]:
        """Scans canonical directory, discovers new/modified/removed files, updates registry."""
        self.bg_dir.mkdir(parents=True, exist_ok=True)
        found_files = []
        for p in sorted(self.bg_dir.iterdir()):
            if p.is_file() and p.suffix.lower() in SUPPORTED_EXTENSIONS:
                if sanitize_and_validate_path(p, self.bg_dir):
                    found_files.append(p)

        registry_entries: Dict[str, Any] = {}
        new_cache: Dict[str, Any] = {}

        for filepath in found_files:
            asset_id = filepath.stem.lower()
            asset_id = re.sub(r"[^a-z0-9_]+", "_", asset_id).strip("_")

            stat = filepath.stat()
            mtime = stat.st_mtime
            size = stat.st_size

            cached_data = self.cache.get(asset_id)
            if not force_rescan and cached_data and cached_data.get("mtime") == mtime and cached_data.get("size") == size:
                analysis_dict = cached_data.get("analysis", {})
                new_cache[asset_id] = cached_data
            else:
                analysis = BackgroundAnalyzer.analyze_image(filepath)
                analysis_dict = asdict(analysis)
                new_cache[asset_id] = {
                    "mtime": mtime,
                    "size": size,
                    "analysis": analysis_dict,
                }

            rel_path = f"assets/universal_backgrounds/{filepath.name}"
            registry_entries[asset_id] = {
                "id": asset_id,
                "filename": filepath.name,
                "path": rel_path,
                **analysis_dict,
            }

        self.cache = new_cache
        self._save_cache()

        self.registry_path.parent.mkdir(parents=True, exist_ok=True)
        with open(self.registry_path, "w", encoding="utf-8") as f:
            json.dump(registry_entries, f, indent=2)

        return registry_entries

    def get_asset(self, asset_id: str) -> Optional[Dict[str, Any]]:
        if not self.registry_path.exists():
            self.scan()
        try:
            with open(self.registry_path, "r", encoding="utf-8") as f:
                reg = json.load(f)
                return reg.get(asset_id)
        except Exception:
            return None


def format_diagnostic_report(entries: Dict[str, Any]) -> str:
    """Generates clean terminal diagnostics for discovered backgrounds."""
    lines = [
        "=" * 70,
        "🎬 RIGHTMOTION — UNIVERSAL BACKGROUND INTELLIGENCE REGISTRY",
        "=" * 70,
        f"Canonical Directory: {CANONICAL_BG_DIR}",
        f"Total Assets Discovered: {len(entries)}",
        "-" * 70,
    ]
    for asset_id, meta in entries.items():
        status = meta.get("status", "READY")
        status_icon = "✅" if status == "READY" else "⚠️"
        lines.append(f"{status_icon} ID: {asset_id} ({meta.get('filename')})")
        lines.append(f"   Dimensions: {meta.get('width')}x{meta.get('height')} ({meta.get('aspectRatio')} AR) | Size: {meta.get('fileSize', 0) // 1024} KB")
        lines.append(f"   Tone: {meta.get('tone')} ({meta.get('colorTemp')}) | Lum: {meta.get('brightness')} | Contrast: {meta.get('contrast')}")
        lines.append(f"   Texture: {meta.get('textureStrength')} (edge: {meta.get('edgeDensity')}) | Complexity: {meta.get('visualComplexity')}")
        lines.append(f"   Material: {meta.get('material')} | Moods: {', '.join(meta.get('moods', []))}")
        lines.append(f"   Compatibility -> Text: {meta.get('textCompatibility')} | Presenter: {meta.get('presenterCompatibility')} | Graphic: {meta.get('graphicCompatibility')}")
        safe_regions = [k.replace("safe", "") for k, v in meta.get("textSafeRegions", {}).items() if v]
        lines.append(f"   Text-Safe Zones: {', '.join(safe_regions) if safe_regions else 'None'}")
        lines.append(f"   Recommended Motion: {', '.join(meta.get('motionSuitability', []))}")
        if meta.get("lowResWarning"):
            lines.append("   ⚠️ Low-resolution warning (< 1080x1920)")
        lines.append("-" * 70)
    lines.append("=" * 70)
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description="RightMotion Universal Background Intelligence Scanner & Analyzer")
    parser.add_argument("--scan", action="store_true", help="Scan canonical directory and rebuild registry")
    parser.add_argument("--force", action="store_true", help="Force re-analyzing all assets ignoring cache")
    parser.add_argument("--inspect", type=str, default=None, help="Inspect specific asset ID")
    parser.add_argument("--json", action="store_true", help="Output raw JSON format")
    args = parser.parse_args()

    registry = BackgroundRegistry()
    entries = registry.scan(force_rescan=args.force)

    if args.inspect:
        asset = entries.get(args.inspect)
        if not asset:
            print(f"❌ Asset '{args.inspect}' not found in registry.")
            sys.exit(1)
        if args.json:
            print(json.dumps(asset, indent=2))
        else:
            print(format_diagnostic_report({args.inspect: asset}))
    else:
        if args.json:
            print(json.dumps(entries, indent=2))
        else:
            print(format_diagnostic_report(entries))


if __name__ == "__main__":
    main()
