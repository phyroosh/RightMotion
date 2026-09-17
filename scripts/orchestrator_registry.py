#!/usr/bin/env python3
"""
🎬 Frontier #0: Creative Intelligence Orchestrator — Python Capability Registry

Projected directly from the authoritative single source of truth:
src/orchestrator/frontier_manifest.json

DO NOT add independent frontier authorities here.
"""

import json
from pathlib import Path
from typing import Dict, Any

ROOT_DIR = Path(__file__).resolve().parent.parent
MANIFEST_PATH = ROOT_DIR / "src" / "orchestrator" / "frontier_manifest.json"


def _load_manifest() -> Dict[str, Any]:
    if not MANIFEST_PATH.is_file():
        raise FileNotFoundError(f"Authoritative frontier manifest not found at: {MANIFEST_PATH}")
    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def _project_frontier(raw: Dict[str, Any]) -> Dict[str, Any]:
    """
    Projects a frontier capability from the manifest into a Python dictionary
    supporting both snake_case and camelCase access for complete backward compatibility.
    """
    projected = dict(raw)

    # Key mappings from camelCase (manifest) to snake_case (Python callers)
    mappings = {
        "creativeStrengths": "creative_strengths",
        "bestUseSituations": "best_use_situations",
        "antiUseSituations": "anti_use_situations",
        "exportedComponents": "exported_components",
        "performanceCost": "performance_cost",
        "complexityWeight": "complexity_weight",
        "mobileRisk": "mobile_risk",
        "synergisticWith": "synergistic_with",
        "conflictsWith": "conflicts_with",
        "defaultIntensity": "default_intensity",
    }

    for camel, snake in mappings.items():
        if camel in raw:
            projected[snake] = raw[camel]
        elif snake in raw:
            projected[camel] = raw[snake]

    return projected


def project_registry() -> Dict[str, Dict[str, Any]]:
    """Loads and projects all frontiers from the authoritative manifest."""
    manifest = _load_manifest()
    frontiers = manifest.get("frontiers", {})
    return {code: _project_frontier(cap) for code, cap in frontiers.items()}


FRONTIER_MANIFEST: Dict[str, Any] = _load_manifest()
FRONTIER_REGISTRY: Dict[str, Dict[str, Any]] = project_registry()


if __name__ == "__main__":
    print(f"✅ Loaded {len(FRONTIER_REGISTRY)} frontiers from authoritative manifest:")
    for code, cap in sorted(FRONTIER_REGISTRY.items()):
        status = cap.get("status")
        weight = cap.get("complexity_weight")
        print(f"   [{code:6s}] {cap.get('name', 'Unknown'):40s} | status={status:20s} | weight={weight}")
