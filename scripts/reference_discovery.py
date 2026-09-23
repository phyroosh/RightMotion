#!/usr/bin/env python3
"""
🎬 RightMotion Reference Discovery Engine
==========================================
Identifies and ranks relevant reference clips from the canonical reference library.
Provides the AI coding agent with concrete pedagogical deconstructions:
why each reference is strong, its visual mechanism, composition/camera/temporal
strategies, what to learn, and what NOT to copy.
"""

import argparse
import json
from pathlib import Path
from typing import Dict, Any, List, Optional

ROOT_DIR = Path(__file__).resolve().parent.parent
REFERENCE_LIBRARY_PATH = ROOT_DIR / "src" / "creative_brief" / "reference_library.json"


class ReferenceDiscovery:
    """
    Discovers the most educationally relevant reference clips for a given story.
    Classified by creative strategy: physical_metaphor, spatial_storytelling,
    causal_progression, accumulation, threshold_boundary, emotional_restraint.
    """

    def __init__(self, library_path: Optional[Path] = None):
        self.library_path = library_path or REFERENCE_LIBRARY_PATH
        self.library = self._load_library()

    def _load_library(self) -> Dict[str, Any]:
        if self.library_path.exists():
            try:
                with open(self.library_path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception as e:
                print(f"⚠️ Failed to load reference library from {self.library_path}: {e}")
        return {"references": []}

    def discover_references(
        self,
        concept: str = "",
        primary_mechanism: str = "",
        category: str = "",
        niche: str = "",
        max_results: int = 3,
        **kwargs,
    ) -> List[Dict[str, Any]]:
        """
        Ranks flagship reference clips by semantic and strategic fit to the story concept.
        """
        search_terms = f"{concept} {primary_mechanism} {category} {niche}".lower()
        search_tokens = set(search_terms.replace("_", " ").replace("-", " ").split())

        scored = []
        for ref in self.library.get("references", []):
            score = 0
            ref_category = ref.get("category", "").lower()
            ref_tags = [t.lower() for t in ref.get("tags", [])]
            ref_idea = ref.get("primaryVisualIdea", "").lower()
            ref_mech = ref.get("visualMechanism", "").lower()

            # Category match (high weight)
            if category and category.lower() in ref_category:
                score += 5

            # Tag token matches
            for tag in ref_tags:
                tag_tokens = set(tag.replace("_", " ").split())
                if tag_tokens & search_tokens:
                    score += 3

            # Concept / Idea matches
            for token in search_tokens:
                if len(token) > 3:
                    if token in ref_idea:
                        score += 2
                    if token in ref_mech:
                        score += 2
                    if token in ref.get("whyItIsStrong", "").lower():
                        score += 1

            scored.append((score, ref))

        # Sort descending by score, falling back to original order
        scored.sort(key=lambda x: x[0], reverse=True)
        return [item[1] for item in scored[:max_results]]

    def get_reference_clip_ids(
        self,
        concept: str = "",
        primary_mechanism: str = "",
        category: str = "",
        niche: str = "",
        max_results: int = 3,
        **kwargs,
    ) -> List[str]:
        refs = self.discover_references(
            concept=concept,
            primary_mechanism=primary_mechanism,
            category=category,
            niche=niche,
            max_results=max_results,
        )
        return [r["clipId"] for r in refs]

    def format_pedagogical_brief(self, refs: List[Dict[str, Any]]) -> str:
        """
        Formats reference deconstructions for injection into the creative brief
        or AI agent scaffolding instructions.
        """
        if not refs:
            return "No specific reference matches found."

        sections = []
        for i, ref in enumerate(refs, 1):
            sec = [
                f"### Reference {i}: {ref.get('title', ref.get('clipId'))} [{ref.get('category', 'strategy')}]",
                f"- **Why It Is Strong**: {ref.get('whyItIsStrong')}",
                f"- **Primary Visual Idea**: \"{ref.get('primaryVisualIdea')}\"",
                f"- **Visual Mechanism**: {ref.get('visualMechanism')}",
                f"- **Composition Strategy**: {ref.get('compositionStrategy')}",
                f"- **Camera Strategy**: {ref.get('cameraStrategy')}",
                f"- **Temporal Strategy**: {ref.get('temporalStrategy')}",
                f"- **Why It Remains Clear**: {ref.get('whyItRemainsClear')}",
                f"- 👉 **What To Learn**: {ref.get('whatShouldBeLearned')}",
                f"- 🛑 **What NOT To Copy**: {ref.get('whatShouldNotBeCopied')}",
            ]
            sections.append("\n".join(sec))

        return "\n\n".join(sections)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Test reference discovery engine")
    parser.add_argument("--test", action="store_true", help="Run self-test queries")
    parser.add_argument("--concept", type=str, default="pressure and burnout", help="Concept to query")
    parser.add_argument("--category", type=str, default="", help="Creative category to query")
    args = parser.parse_args()

    engine = ReferenceDiscovery()

    if args.test:
        test_queries = [
            ("attention friction", "accumulation"),
            ("burnout over time", "physical_metaphor"),
            ("feeling lonely in a room", "spatial_storytelling"),
            ("habit formation and neuroplasticity", "causal_progression"),
        ]
        print("🔍 Testing Reference Discovery Engine across diverse creative queries:\n")
        for concept, cat in test_queries:
            results = engine.discover_references(concept=concept, category=cat, max_results=1)
            ref = results[0] if results else None
            title = ref.get("title", "None") if ref else "None"
            clip_id = ref.get("clipId", "None") if ref else "None"
            print(f"Query: '{concept}' [{cat}]")
            print(f"  → Matched: {title} ({clip_id})")
        print("\n✅ Reference Discovery Engine self-test completed successfully.")
    else:
        results = engine.discover_references(concept=args.concept, category=args.category, max_results=2)
        print(engine.format_pedagogical_brief(results))
