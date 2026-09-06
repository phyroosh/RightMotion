#!/usr/bin/env python3
"""
RightClips Autonomous Scriptwriting Engine
Generates and validates high-retention short-form scripts for the Judy Insights persona.
Handles Mode A (Product-Linked with silent PDF rules) and Mode B ({no meta} organic growth).
"""

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Dict, Any, Tuple, Optional

ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(ROOT_DIR / "scripts"))

from pdf_topic_matcher import match_topic_to_product
from extract_product_page import extract_product_page

# Forbidden phrases and cliché patterns
BANNED_CLICHES = [
    r"here\'?s the thing",
    r"but here\'?s the catch",
    r"the tricky part is",
    r"what most people don\'?t realize is",
    r"that\'?s because",
    r"the truth is",
    r"you\'?re not lazy",
    r"it\'?s not that simple",
]

# Forbidden sales words
BANNED_SALES_WORDS = [
    r"\bmasterpiece\b",
    r"\blife-changing\b",
    r"\bmust-read\b",
    r"\bbuy now\b",
    r"\bworth every cent\b",
    r"\bgame-changer\b",
    r"\bdiscount\b",
]

def sanitize_tags(text: str) -> str:
    if not text:
        return ""
    pattern = re.compile(
        r"\{\s*(?:health|finance|self\s*improv?ement|facecam|no\s*topics?|no\s*meta|meta|no\s*memes?|andrew|duo|meme(?:\s*:\s*[^}]+)?|(?:product|pdf)\s*:\s*[^,}]+,\s*page\s*:\s*\d+)\s*\}",
        re.IGNORECASE,
    )
    cleaned = pattern.sub("", text)
    cleaned = re.sub(r"[{}\\]", "", cleaned)
    return re.sub(r"\s+", " ", cleaned).strip()

def check_script_hygiene(voiceover: str, is_mode_a: bool = True, is_duo: bool = False) -> Tuple[bool, list]:
    """
    Audits voiceover text for:
    1. Word count:
       - Solo Judy (default): 55-70 words ideal (max 75 words, ~20-24s).
       - Judy & Andrew ({andrew}): 75-115 words (max 120 words, up to 40s).
    2. Banned AI clichés.
    3. Banned sales hype words.
    4. Silent PDF rule (in Mode A: never speak 'Photon' or 'page X').
    """
    issues = []
    # Strip speaker tags for word count
    cleaned_vo = re.sub(r"^\s*(?:judy|andrew)\s*:\s*", "", voiceover, flags=re.IGNORECASE | re.MULTILINE)
    words = cleaned_vo.strip().split()
    word_count = len(words)

    if is_duo:
        if word_count < 60:
            issues.append(f"Duo script too short ({word_count} words). Aim for 75-115 words (up to 40 seconds).")
        elif word_count > 120:
            issues.append(f"Duo script too long ({word_count} words). Hard cap is 120 words (up to 40 seconds).")
    else:
        if word_count < 50:
            issues.append(f"Script too short ({word_count} words). Aim for 55-70 words (~20-24 seconds).")
        elif word_count > 75:
            issues.append(f"Script too long ({word_count} words). Solo Judy hard cap is 75 words (55-70 ideal, 20-24 seconds).")

    lower_text = voiceover.lower()
    for pattern in BANNED_CLICHES:
        if re.search(pattern, lower_text):
            issues.append(f"Contains banned AI cliché: {pattern}")

    for pattern in BANNED_SALES_WORDS:
        if re.search(pattern, lower_text):
            issues.append(f"Contains banned sales hype: {pattern}")

    if is_mode_a:
        if re.search(r"\bphoton(?:\.pdf)?\b", lower_text):
            issues.append("Violates Silent PDF rule: Script speaks 'Photon' aloud! (Never speak PDF name).")
        if re.search(r"\b(?:on\s+)?page\s+\d+\b", lower_text):
            issues.append("Violates Silent PDF rule: Script speaks page number aloud! (Visual proof card handles it on screen).")

    is_valid = len(issues) == 0
    return is_valid, issues

# High-converting script blueprints mapped to Photon.pdf chapters
CURATED_SCRIPTS = {
    6: { # Map the Gap (Page 6)
        "topic": "The Fear of Being Caught Trying",
        "exercise_title": "Map The Gap",
        "keywords": ["caught trying", "social mask", "pretend not to care", "trying hardest"],
        "mode_a": (
            "Notice how you pretend not to care about the things you actually want most? "
            "We act indifferent so nobody laughs if we fall short. "
            "Psychologists call this the social mask. Performing casualness stops you from ever being a beginner. "
            "I mapped out the exact worksheet below so you can audit where you hide. Grab the guide below and start showing up as yourself."
        ),
        "mode_b": (
            "Notice how you pretend not to care about the things you actually want most? "
            "We act indifferent so nobody can laugh if we fall short. "
            "Psychologists call this the social mask. Performing casualness burns more energy than actually trying. "
            "Being caught trying is always better than performing a life you don't want. "
            "What's one thing you secretly care about, but pretend is no big deal? Tell me below."
        )
    },
    8: { # Diagram Your Loop (Page 8)
        "topic": "The 2 AM Phone Loop",
        "exercise_title": "Diagram Your Loop",
        "keywords": ["phone loop", "2 am phone", "scroll loop", "doomscroll"],
        "mode_a": (
            "Ever close an app only to reopen it five seconds later without thinking? "
            "That isn't a discipline failure. It's an automated dopamine loop numbing boredom. "
            "When you blame yourself, the spiral worsens. Once you separate the trigger from the craving, the loop shatters. "
            "I diagrammed the habit framework on the worksheet below. Grab the guide and disrupt your loop tonight."
        ),
        "mode_b": (
            "Ever close an app only to reopen it five seconds later without thinking? "
            "That isn't a discipline failure. It's an automated dopamine loop numbing boredom. "
            "When you blame yourself, the spiral worsens. Separate the trigger from your craving, and the cycle breaks. "
            "Be honest: how many hours did you lose to your phone today? Tell me below."
        )
    },
    14: { # The Minimum Viable Day (Page 14)
        "topic": "The Minimum Viable Day",
        "exercise_title": "The Minimum Viable Day",
        "keywords": ["minimum viable day", "emergency baseline", "low energy routine"],
        "mode_a": (
            "When you wake up feeling drained, an intense two-hour routine usually ends in phone freeze. "
            "Consistency isn't about peak output every single day. It's about shrinking the initiation threshold until your brain cannot generate resistance. "
            "Define your minimum viable day: one paragraph written, two minutes of stretching, or one honest breath. "
            "I laid out the protocol below. Grab the guide and protect your momentum."
        ),
        "mode_b": (
            "When you wake up feeling drained, an intense two-hour routine usually ends in phone freeze. "
            "Consistency isn't about peak output every single day. It's about shrinking the initiation threshold until your brain cannot generate resistance. "
            "Define your minimum viable day: one paragraph written, or two minutes of stretching. "
            "What's your emergency baseline when your energy hits zero? Tell me below."
        )
    }
}

CURATED_DUO_SCRIPTS = {
    "boundaries": {
        "keywords": ["boundar", "friend", "say no", "people pleas"],
        "topic": "Maintaining Boundaries with Friends",
        "voiceover": (
            "JUDY: Notice how you say yes to plans you secretly dread just to avoid feeling guilty? "
            "ANDREW: Wait, so you're telling me I should just be cold and not even hang out with my friends? "
            "JUDY: Setting boundaries isn't pushing people away. It's protecting your battery so you don't end up resenting them. "
            "ANDREW: Okay, fair... but won't they think I'm being distant or weird? "
            "JUDY: Real friends want you there when you're present, not performing. When you stop people-pleasing, the real connections survive."
        )
    },
    "caught_trying": {
        "keywords": ["trying", "caught", "pretend", "care", "failure", "mask"],
        "topic": "The Fear of Being Caught Trying",
        "voiceover": (
            "JUDY: Notice how you pretend not to care about the things you actually want most? "
            "ANDREW: Come on, if I try my hardest and still fail, everyone's going to laugh. Acting chill is just safer. "
            "JUDY: Psychologists call that the social mask. You spend so much energy performing indifference that you never allow yourself to grow. "
            "ANDREW: So what, I just start trying and let people judge me? "
            "JUDY: Exactly. Being caught trying is always better than spending your youth performing a life you don't even want."
        )
    },
    "phone_loop": {
        "keywords": ["phone", "scroll", "screen", "loop", "2 am", "bed"],
        "topic": "The 2 AM Phone Loop",
        "voiceover": (
            "JUDY: Ever close an app only to reopen it five seconds later without even realizing your thumb moved? "
            "ANDREW: Literally every single night. I tell myself five minutes and suddenly it's 2 AM. "
            "JUDY: That isn't a discipline failure. It's an automated dopamine loop. Your brain isn't hunting for posts—it's trying to numb boredom. "
            "ANDREW: So how do I actually break it without throwing my phone out the window? "
            "JUDY: Separate the physical cue from your craving. Put the charger across the room tonight, and watch the loop shatter."
        )
    }
}

def generate_dynamic_duo_script(clean_topic: str) -> str:
    return (
        f"JUDY: Notice how you get completely trapped in your head whenever it comes to {clean_topic.lower()}? "
        f"ANDREW: Honestly, yeah. But isn't overthinking just trying to prepare for the worst case? "
        "JUDY: That's the illusion. Your nervous system treats emotional uncertainty like a physical threat, so it keeps replaying worst-case scenarios to feel in control. "
        "ANDREW: Okay, makes sense. But how do you actually stop that spiral in the moment? "
        "JUDY: Stop trying to debate your thoughts. Ground yourself in physical reality, and the anxiety loses its power instantly."
    )

def generate_script_and_metadata(raw_topic: str, duo: bool = False, meta: bool = False) -> Dict[str, Any]:
    """
    Main orchestrator for Autonomous Scriptwriting:
    - Default is Mode B (Organic / Growth CTA, ZERO PDF search)
    - Mode A (Product-Linked, PDF search) ONLY runs when {meta}, --meta, or {product: ...} is explicitly present
    - If duo is requested: Generates conversational Judy & Andrew dialogue
    - Returns structured metadata and voiceover text
    """
    has_explicit_product = bool(re.search(r"\{\s*(?:product|pdf)\s*:\s*[^,}]+,\s*page\s*:\s*\d+\s*\}", raw_topic, re.IGNORECASE))
    has_meta_tag = bool(re.search(r"\{\s*meta\s*\}", raw_topic, re.IGNORECASE))
    has_no_meta_tag = bool(re.search(r"\{\s*no\s*meta\s*\}", raw_topic, re.IGNORECASE))

    # Mode A is ONLY triggered if {meta}, {product: ...}, or meta=True is explicitly passed, and NOT overridden by {no meta}
    is_mode_a = (meta or has_meta_tag or has_explicit_product) and not has_no_meta_tag
    has_andrew_tag = bool(re.search(r"\{\s*andrew\s*\}", raw_topic, re.IGNORECASE))
    has_duo_tag = bool(re.search(r"\{\s*duo\s*\}", raw_topic, re.IGNORECASE))
    is_duo = duo or has_andrew_tag or has_duo_tag
    clean_topic = sanitize_tags(raw_topic)

    if is_duo:
        # CONVERSATIONAL DUO MODE (Judy & Andrew) - Up to 40s
        lower_top = clean_topic.lower()
        matched_duo = None
        for k, item in CURATED_DUO_SCRIPTS.items():
            if any(kw in lower_top for kw in item["keywords"]):
                matched_duo = item["voiceover"]
                break
        
        voiceover = matched_duo or generate_dynamic_duo_script(clean_topic)
        words = re.sub(r"^\s*(?:judy|andrew)\s*:\s*", "", voiceover, flags=re.IGNORECASE | re.MULTILINE).split()
        is_valid, issues = check_script_hygiene(voiceover, is_mode_a=False, is_duo=True)

        formatted_output = f"[VOICEOVER]\n{voiceover}"
        return {
            "mode": "DUO",
            "is_product_linked": False,
            "topic": clean_topic,
            "voiceover": voiceover,
            "metadata": None,
            "word_count": len(words),
            "formatted_output": formatted_output,
            "is_valid": is_valid,
            "issues": issues,
            "is_duo": True
        }

    if not is_mode_a:
        # MODE B: Organic / Growth (DEFAULT!) - ZERO PDF LOOKUP
        # Check if topic matches any curated high-impact scripts
        curated_mode_b = None
        lower_top = clean_topic.lower()
        for p_num, c_data in CURATED_SCRIPTS.items():
            if c_data["topic"].lower() in lower_top or any(kw in lower_top for kw in c_data.get("keywords", [])):
                curated_mode_b = c_data["mode_b"]
                break

        voiceover = curated_mode_b or (
            f"Notice how often you find yourself overthinking {clean_topic.lower()}? "
            "Your nervous system treats emotional uncertainty like a physical threat, so it keeps you replaying old interactions to feel safe. "
            "The shift happens when you stop debating your thoughts and simply observe the physical sensation. "
            "Be honest: what's the one thought that keeps you awake at night? Tell me below."
        )
        
        words = voiceover.split()
        is_valid, issues = check_script_hygiene(voiceover, is_mode_a=False, is_duo=False)

        formatted_output = f"[VOICEOVER]\n{voiceover}"

        return {
            "mode": "B",
            "is_product_linked": False,
            "topic": clean_topic,
            "voiceover": voiceover,
            "metadata": None,
            "word_count": len(words),
            "formatted_output": formatted_output,
            "is_valid": is_valid,
            "issues": issues
        }

    else:
        # MODE A: Standard / Product-Linked (ONLY when {meta} is explicitly passed)
        match = match_topic_to_product(clean_topic)
        page_num = match["page_number"]
        ex_title = match["exercise_title"]
        product_file = match["product_file"]

        if page_num in CURATED_SCRIPTS:
            voiceover = CURATED_SCRIPTS[page_num]["mode_a"]
        else:
            voiceover = (
                f"Notice how often you get caught in the loop around {clean_topic.lower()}? "
                "It isn't because you lack discipline. Your brain simply repeats whichever pattern gave you instant relief in the past. "
                "Once you separate the environmental cue from your actual craving, the friction drops and your agency returns. "
                f"I mapped out the entire framework on the worksheet below so you can audit your own habits. Grab the guide below and take back your focus."
            )

        words = voiceover.split()
        is_valid, issues = check_script_hygiene(voiceover, is_mode_a=True)

        # Extract product page image for RightClips
        try:
            extract_product_page(product_file, page_num)
        except Exception as e:
            print(f"⚠️ Page extraction note: {e}")

        formatted_output = (
            f"[METADATA]\n"
            f"product_file: {product_file}\n"
            f"page_number: {page_num}\n"
            f"exercise_title: {ex_title}\n\n"
            f"[VOICEOVER]\n"
            f"{voiceover}"
        )

        return {
            "mode": "A",
            "is_product_linked": True,
            "topic": clean_topic,
            "voiceover": voiceover,
            "metadata": {
                "product_file": product_file,
                "page_number": page_num,
                "exercise_title": ex_title
            },
            "word_count": len(words),
            "formatted_output": formatted_output,
            "is_valid": is_valid,
            "issues": issues
        }

def main():
    parser = argparse.ArgumentParser(description="RightClips Judy Scriptwriter")
    parser.add_argument("--topic", required=True, help="Topic with channel and optional {meta} or {no meta} tag")
    parser.add_argument("--meta", action="store_true", help="Enable product PDF linking/extraction (default is organic/no-meta mode)")
    parser.add_argument("--duo", action="store_true", help="Generate conversational duo script with Judy and Andrew")
    parser.add_argument("--andrew", action="store_true", help="Include Andrew character (Conversational Duo mode with Judy, runtime up to 40s)")
    parser.add_argument("--check-script", default=None, help="Validate an existing script text")
    parser.add_argument("--json", action="store_true", help="Output JSON format")
    args = parser.parse_args()

    is_duo_opt = args.andrew or args.duo or bool(re.search(r"\{\s*(?:andrew|duo)\s*\}", args.topic, re.IGNORECASE))

    if args.check_script:
        has_meta = "{meta}" in args.topic.lower() or args.meta
        check_is_duo = is_duo_opt or (
            bool(re.search(r"^\s*judy\s*:", args.check_script, re.IGNORECASE | re.MULTILINE)) and
            bool(re.search(r"^\s*andrew\s*:", args.check_script, re.IGNORECASE | re.MULTILINE))
        )
        is_valid, issues = check_script_hygiene(args.check_script, is_mode_a=has_meta, is_duo=check_is_duo)
        words = len(re.sub(r"^\s*(?:judy|andrew)\s*:\s*", "", args.check_script, flags=re.IGNORECASE | re.MULTILINE).split())
        print(f"\nScript Hygiene Check ({words} words, Duo: {check_is_duo}):")
        if is_valid:
            print("  ✅ 100% Compliant (Pacing, no clichés, no spoken product/page mentions)")
        else:
            print("  ❌ Issues found:")
            for iss in issues:
                print(f"     - {iss}")
        return

    result = generate_script_and_metadata(args.topic, duo=is_duo_opt, meta=args.meta)
    if args.json:
        print(json.dumps(result, indent=2))
    else:
        print(f"\n{'='*50}")
        print(f"🎬 Judy Scriptwriter Output — Mode {result['mode']} ({result['word_count']} words)")
        print(f"{'='*50}\n")
        print(result["formatted_output"])
        print(f"\n{'='*50}\n")

if __name__ == "__main__":
    main()
