#!/usr/bin/env python3
"""
RightMotion PDF Topic Matcher & Exercise Indexer
Autonomously indexes product PDFs (e.g. Products/Photon.pdf) and matches topic prompts
to the exact chapter, page number, and exercise for high-converting visual proof cards.
"""

import argparse
import json
import os
import re
import subprocess
from pathlib import Path
from typing import Dict, List, Optional, Any

ROOT_DIR = Path(__file__).resolve().parent.parent
PRODUCTS_DIR = ROOT_DIR / "Products"

PHOTON_CURATED_INDEX = [
    {
        "page": 4,
        "exercise_title": "Trace the Wire",
        "chapter": "Chapter 1 — What Made You, Current You?",
        "keywords": [
            "belief", "conditioning", "childhood", "parents", "origin", "programming",
            "self doubt", "inherited", "unchosen", "not good enough", "imposter", "identity"
        ],
        "summary": "Audit unchosen beliefs and tracing where your self-narrative actually originated."
    },
    {
        "page": 6,
        "exercise_title": "Map the Gap",
        "chapter": "Chapter 2 — You vs. The Mask",
        "keywords": [
            "mask", "performing", "exhaustion", "social mask", "fake", "friends", "pleasing",
            "fitting in", "hiding", "rejection", "fear of being caught trying", "authenticity",
            "peer pressure", "comparison"
        ],
        "summary": "Mapping the gap between who you are and who you perform across friends, family, online, and alone."
    },
    {
        "page": 8,
        "exercise_title": "Diagram Your Loop",
        "chapter": "Chapter 3 — The Loop & The Fault",
        "keywords": [
            "loop", "habit", "bad habit", "dopamine", "phone", "doomscroll", "scroll",
            "autopilot", "craving", "trigger", "procrastination", "relapse", "distraction",
            "overthinking", "2 am", "bedtime revenge"
        ],
        "summary": "Diagramming your repeated destructive pattern (cue, craving, response, reward) to locate the exact break point."
    },
    {
        "page": 10,
        "exercise_title": "Write the Identity, Then the Proof",
        "chapter": "Chapter 4 — Identity & Neuroplasticity",
        "keywords": [
            "neuroplasticity", "brain", "rewire", "identity", "proof", "repetition", "self trust",
            "confidence", "votes", "rebuilding", "start from zero", "habits", "evidence"
        ],
        "summary": "Writing a concrete identity statement backed by undeniable small physical daily proof."
    },
    {
        "page": 12,
        "exercise_title": "The Four Layers Quick Reference",
        "chapter": "Chapter 5 — The Plan",
        "keywords": [
            "plan", "system", "environment", "values", "feedback", "operating system",
            "friction", "setup", "structure", "focus"
        ],
        "summary": "Operating system of values, environment architecture, systems, and feedback loops."
    },
    {
        "page": 14,
        "exercise_title": "The Minimum Viable Day",
        "chapter": "Chapter 6 — Is It That Difficult?",
        "keywords": [
            "minimum viable", "discipline", "consistency", "lazy", "burnout", "low energy",
            "survival", "freeze mode", "exhausted", "hardest habit", "friction", "perfectionism",
            "starting", "paralysis"
        ],
        "summary": "The absolute smallest non-negotiable version of your key habit that still counts as done on low-energy days."
    },
    {
        "page": 15,
        "exercise_title": "The Whole Framework Compressed",
        "chapter": "Summary",
        "keywords": [
            "framework", "summary", "overview", "compressed", "reset", "mindset", "change"
        ],
        "summary": "Complete 1-page condensed framework on identity, conditioning, and behavioral change."
    }
]

def extract_pdf_pages_text(pdf_path: Path) -> List[Dict[str, Any]]:
    pages = []
    try:
        info_proc = subprocess.run(["pdfinfo", str(pdf_path)], capture_output=True, text=True)
        num_pages = 1
        for line in info_proc.stdout.split("\n"):
            if "Pages:" in line:
                num_pages = int(line.split(":")[1].strip())
                break
        
        for p in range(1, num_pages + 1):
            res = subprocess.run(
                ["pdftotext", "-f", str(p), "-l", str(p), str(pdf_path), "-"],
                capture_output=True,
                text=True,
                check=True
            )
            text = res.stdout.strip()
            pages.append({"page": p, "text": text})
    except Exception as e:
        print(f"⚠️ Error extracting text from {pdf_path}: {e}")
    return pages

def score_page_match(query: str, page_data: Dict[str, Any]) -> float:
    tokens = set(re.findall(r"\b[a-zA-Z]{3,}\b", query.lower()))
    score = 0.0

    keywords = page_data.get("keywords", [])
    for kw in keywords:
        for t in tokens:
            if t in kw or kw in t:
                score += 3.0
            if t == kw:
                score += 5.0

    title = page_data.get("exercise_title", "").lower()
    for t in tokens:
        if t in title:
            score += 4.0

    summary = page_data.get("summary", "").lower()
    for t in tokens:
        if t in summary:
            score += 1.5

    return score

def match_topic_to_product(topic: str, pdf_filename: Optional[str] = "Photon.pdf") -> Dict[str, Any]:
    target_pdf = PRODUCTS_DIR / (pdf_filename or "Photon.pdf")
    if not target_pdf.exists():
        pdf_files = list(PRODUCTS_DIR.glob("*.pdf"))
        if pdf_files:
            target_pdf = pdf_files[0]
        else:
            raise FileNotFoundError(f"No PDF found in {PRODUCTS_DIR}")

    best_match = None
    best_score = -1.0

    if target_pdf.name.lower() == "photon.pdf":
        for entry in PHOTON_CURATED_INDEX:
            s = score_page_match(topic, entry)
            if s > best_score:
                best_score = s
                best_match = entry

    if not best_match or best_score < 1.0:
        extracted = extract_pdf_pages_text(target_pdf)
        tokens = set(re.findall(r"\b[a-zA-Z]{3,}\b", topic.lower()))
        for p in extracted:
            text = p["text"].lower()
            s = sum(1.0 for t in tokens if t in text)
            if "exercise" in text or "worksheet" in text:
                s += 2.0
            if s > best_score:
                best_score = s
                ex_match = re.search(r"EXERCISE\s*[\-—:]\s*([^\n]+)", p["text"], re.IGNORECASE)
                ex_title = ex_match.group(1).strip().title() if ex_match else f"Protocol Page {p["page"]}"
                best_match = {
                    "page": p["page"],
                    "exercise_title": ex_title,
                    "chapter": f"Page {p["page"]}",
                    "summary": p["text"][:150]
                }

    if not best_match:
        best_match = PHOTON_CURATED_INDEX[2]

    return {
        "product_file": target_pdf.name,
        "page_number": best_match["page"],
        "exercise_title": best_match["exercise_title"],
        "chapter": best_match.get("chapter", ""),
        "summary": best_match.get("summary", ""),
        "score": best_score
    }

def main():
    parser = argparse.ArgumentParser(description="Match topic to product PDF exercise")
    parser.add_argument("--topic", required=True, help="Topic prompt or script keyword")
    parser.add_argument("--pdf", default="Photon.pdf", help="Target PDF file in Products/")
    parser.add_argument("--json", action="store_true", help="Output raw JSON")
    args = parser.parse_args()

    result = match_topic_to_product(args.topic, args.pdf)
    if args.json:
        print(json.dumps(result, indent=2))
    else:
        print(f"\n🎯 Best Match in {result["product_file"]}:")
        print(f"   • Page: {result["page_number"]}")
        print(f"   • Exercise: {result["exercise_title"]}")
        print(f"   • Chapter: {result["chapter"]}")
        print(f"   • Summary: {result["summary"]}")
        print(f"   • Match Score: {result["score"]:.1f}\n")

if __name__ == "__main__":
    main()
