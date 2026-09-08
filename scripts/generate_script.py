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
       - Solo Judy (default): 70-100 words ideal (min 65, max 105 words, 25-35s runtime).
       - Judy & Andrew ({andrew}): 80-120 words (up to 40s).
    2. Strict No-CTA / No-Ending-Question directive (Problem > Logic > Solution).
    3. Banned AI clichés.
    4. Banned sales hype words.
    5. Silent PDF rule (in Mode A: never speak 'Photon' or 'page X').
    """
    issues = []
    # Strip speaker tags for word count
    cleaned_vo = re.sub(r"^\s*(?:judy|andrew)\s*:\s*", "", voiceover, flags=re.IGNORECASE | re.MULTILINE)
    words = cleaned_vo.strip().split()
    word_count = len(words)

    if is_duo:
        if word_count < 65:
            issues.append(f"Duo script too short ({word_count} words). Aim for 80-120 words (up to 40 seconds).")
        elif word_count > 125:
            issues.append(f"Duo script too long ({word_count} words). Hard cap is 125 words (up to 40 seconds).")
    else:
        if word_count < 65:
            issues.append(f"Script too short ({word_count} words). Aim for 70-100 words (25-35 seconds).")
        elif word_count > 105:
            issues.append(f"Script too long ({word_count} words). Solo Judy hard cap is 105 words (70-100 ideal, 25-35 seconds).")

    # Strict No-CTA & No-Closing-Question Enforcement
    trimmed_vo = cleaned_vo.strip()
    if trimmed_vo.endswith("?"):
        issues.append("Violates Strict No-CTA Rule: Script ends with a question mark! Must conclude with the definitive solution.")

    lower_text = voiceover.lower()
    banned_cta_patterns = [
        r"tell\s+me\s+below",
        r"comment\s+below",
        r"drop\s+your\s+thoughts",
        r"drop\s+(?:a\s+)?comment",
        r"what\s+do\s+you\s+think",
        r"be\s+honest\s*:",
        r"question\s+for\s+you\s*:",
        r"subscribe\b",
        r"follow\s+for\s+more",
        r"save\s+this\b",
        r"share\s+this\b",
    ]
    for pattern in banned_cta_patterns:
        if re.search(pattern, lower_text):
            issues.append(f"Violates Strict No-CTA Rule: Contains banned audience engagement CTA: '{pattern}'. Videos must be pure high-density information (Problem > Logic > Solution).")

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
            "We perform casual indifference in public so nobody can laugh if our effort falls short. "
            "Psychologists call this Anticipatory Self-Handicapping. "
            "Performing casualness burns twice as much mental energy as genuinely trying, while locking your nervous system in chronic self-doubt. "
            "The solution is to reframe visible effort: stop treating beginner mistakes as a personal vulnerability. "
            "Give yourself explicit permission to be visibly invested. Being caught trying earns lasting self-respect, while pretending not to care guarantees a life you never wanted."
        ),
        "pinned_comment": "Core takeaway: Being caught trying earns lasting self-respect, while performing indifference only guarantees a life you never wanted."
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
            "Ever close an app only to reopen it five seconds later without thinking, watching your bedtime disappear? "
            "That isn't a lack of willpower. It's an automated dopamine loop where your brain numbs emotional exhaustion with effortless micro-rewards. "
            "When you judge yourself, the guilt triggers more cortisol, locking you deeper into the screen. "
            "The solution is physical friction: remove the charger completely outside your bedroom thirty minutes before sleep, and switch your screen to grayscale. "
            "Eliminate the visual trigger, and your brain's automated loop collapses on night one."
        ),
        "pinned_comment": "The Protocol: Move your phone charger outside the bedroom 30 minutes before sleep and switch to grayscale. Eliminate the cue to collapse the loop."
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
            "When you wake up feeling completely drained, forcing an ambitious two-hour routine usually ends in phone freeze and guilt. "
            "Consistency isn't about demanding peak performance every single day. "
            "When cognitive friction exceeds your baseline energy, your nervous system triggers task avoidance to protect metabolic reserves. "
            "The solution is locking in a minimum viable baseline: the microscopic non-negotiable floor you execute even on zero energy. "
            "One paragraph written, two minutes of stretching, or five pages read. Shrinking the volume keeps the habit chain unbroken without burning out your reserves."
        ),
        "pinned_comment": "The Rule: Never break the chain on low-energy days. Shrink the initiation volume to a 2-minute minimum viable baseline."
    }
}

CORE_ARCHETYPES = {
    "boundaries": {
        "keywords": ["say no", "people pleas", "boundar", "fawn", "guilt", "obligat", "nice guy", "agreeable", "overcommit", "stand up for"],
        "voiceover": (
            "Notice how saying yes to plans you dread always leaves you secretly resenting the other person? "
            "Psychologists call this Fawn Response Conditioning. "
            "You unconsciously believe compliance guarantees safety and social belonging, but your nervous system is trading inner self-worth for temporary peace. "
            "The solution is instituting the mandatory twenty-four-hour delay rule: never commit to non-essential requests in real time. "
            "Give yourself space to evaluate your battery first. A boundary is not a hostile wall—it is the operating manual for how you protect your limited energy."
        ),
        "pinned_comment": "The Rule: Never say yes in real time. Use the 24-hour delay rule to evaluate your battery before committing."
    },
    "comparison": {
        "keywords": ["compar", "behind", "jealous", "envy", "social media", "timeline", "ahead", "peer", "inadequa", "measur"],
        "voiceover": (
            "Notice how achieving your goals never stops you from feeling five years behind everyone else? "
            "Cognitive scientists call this Upward Social Anchoring. "
            "Your brain constantly compares your private, messy internal reality against curated highlight reels of strangers, turning someone else's milestone into false proof of your inadequacy. "
            "The solution is replacing upward comparison with reverse tracking: measure where you stand today strictly against where you were three years ago. "
            "Audit your inputs ruthlessly. You cannot be late to a timeline that was uniquely designed for you."
        ),
        "pinned_comment": "Perspective: Upward social comparison distorts reality. Measure backwards against your past self, not stranger highlight reels."
    },
    "trying": {
        "keywords": ["trying", "caught", "pretend", "care", "mask", "failure", "embarrass", "cringe", "effort", "perfection", "vulnerab"],
        "voiceover": (
            "Notice how you pretend not to care about the things you secretly want most in life? "
            "Psychologists call this Anticipatory Self-Handicapping. "
            "You adopt a posture of cynical detachment so that if you fall short, nobody can judge your true capability. But chronic indifference stunts your ambition and leaves you hollow. "
            "The solution is committing to radical public effort: give yourself full permission to be a clumsy, visible beginner. "
            "Taking your goals seriously and risking failure builds authentic self-respect that hiding behind a cool mask will never provide."
        ),
        "pinned_comment": "Truth: Radical public effort is the only cure for self-doubt. Stop performing indifference and allow yourself to be a beginner."
    },
    "dopamine": {
        "keywords": ["phone", "scroll", "screen", "loop", "doomscroll", "distract", "app", "procrastinat", "instagram", "tiktok", "reels", "shorts", "addict"],
        "voiceover": (
            "Ever open your phone to check a quick message, only to lose forty-five minutes scrolling on autopilot? "
            "Neurobiologists call this Dopamine Variable Reward Hijacking. "
            "Short-form algorithms mirror slot machines, keeping your prefrontal cortex in anticipation of a high-value novelty hit while draining your focus reserves. "
            "The solution is introducing physical friction: switch your phone screen to grayscale and remove social apps from your home screen. "
            "When screens lose chromatic saturation, neural dopamine spikes drop by over forty percent, restoring your cognitive autonomy immediately."
        ),
        "pinned_comment": "Action Protocol: Turn your phone display to grayscale. Stripping color drops dopamine spikes by over 40% and breaks the loop."
    },
    "overthinking": {
        "keywords": ["overthink", "ruminat", "racing", "mind", "replay", "awake", "night", "worry", "worried", "anxious", "anxiety", "second guess", "paralysis"],
        "voiceover": (
            "Why does your brain wait until your head hits the pillow to replay an awkward conversation from three years ago? "
            "Cognitive psychologists call this Threat Simulation Rumination. "
            "In evolutionary biology, scanning social errors protected you from tribal exile. At night, with sensory distractions gone, your nervous system mistakenly treats past social friction as an active threat. "
            "The solution is an immediate external brain dump: write the ruminating thought onto physical paper before turning off the light. "
            "Transferring thoughts from working memory signals completion to your brain, lowering evening cortisol and allowing deep restorative sleep."
        ),
        "pinned_comment": "Sleep Protocol: Ruminating thoughts at night are evolutionary threat simulations. Write them on physical paper to signal completion to your brain."
    },
    "burnout": {
        "keywords": ["burnout", "exhaust", "drain", "tired", "rest", "fatigue", "freeze", "deplet", "couch", "paraly", "overwhelm", "lazy"],
        "voiceover": (
            "Notice how lying on the couch scrolling doesn't recharge you when your mind is screaming with guilt? "
            "Physiologists call this Autonomic Nervous System Freeze. "
            "Pushing through exhaustion doesn't build mental toughness; it elevates baseline cortisol and conditions your body to live in survival mode, mistaking physical stillness for laziness. "
            "The solution is switching from passive numbing to active nervous system restoration: step away from all screens, take a slow fifteen-minute walk outdoors, or practice double-inhale physiological sighs. "
            "True biological recovery requires emotional safety, not just sitting still."
        ),
        "pinned_comment": "Recovery Protocol: Passive scrolling triggers guilt and nervous system freeze. True recovery requires screen-free active regulation."
    },
    "relationships": {
        "keywords": ["dating", "relationship", "love", "breakup", "partner", "attach", "lonel", "single", "chemistry", "toxic", "crush", "ex"],
        "voiceover": (
            "Why does modern dating leave you completely exhausted, yet being alone feels unbearable? "
            "Psychologists call this Anxious Attachment Mirroring. "
            "When emotional consistency is absent, your nervous system confuses high anxiety and unpredictable turbulence with genuine chemistry, keeping you addicted to intermittent validation. "
            "The solution is decoupling intensity from compatibility: evaluate someone strictly by how regulated your body feels in their presence over forty-eight hours. "
            "Real connection brings grounded calm, not an adrenaline rollercoaster. If you have to shrink your boundaries to keep them, walk away."
        ),
        "pinned_comment": "Dating Rule: Never confuse high anxiety with chemistry. Genuine connection brings nervous system calm, not an adrenaline rollercoaster."
    },
    "finance": {
        "keywords": ["money", "wealth", "spend", "rich", "income", "afford", "saving", "save", "invest", "buy", "hedonic", "debt", "salary", "budget", "broke"],
        "voiceover": (
            "Notice how earning more money never makes you feel permanently financially secure? "
            "Behavioral economists call this The Hedonic Treadmill Effect. "
            "As income climbs, subconscious lifestyle creep automatically upgrades your baseline desires, locking you into an endless sprint where spending expands to absorb every raise. "
            "The solution is enforcing an automatic reverse-budget: divert fifty percent of every pay raise directly into automated investment accounts before it touches your checking account. "
            "True wealth is not what you spend on display—it is the permanent freedom bought by your savings rate."
        ),
        "pinned_comment": "Wealth Rule: As income rises, divert 50% of every raise into automated investments first. True wealth is freedom, not lifestyle creep."
    },
    "health": {
        "keywords": ["health", "sleep", "insomnia", "cortisol", "wake", "waking", "3 am", "sugar", "diet", "body", "stress", "nervous system", "circadian", "energy", "wired"],
        "voiceover": (
            "You wake up exhausted because your daily cortisol curve is completely inverted. "
            "Cortisol isn't just stress—it is an energy-deploying hormone designed to unlock glucose and drive physical alertness. "
            "When you miss morning sunlight, your cortisol stays flat all day and surges late at night, leaving you sluggish at noon and wide awake at midnight. "
            "The solution is getting direct outdoor sunlight into your eyes for ten to fifteen minutes within sixty minutes of waking. "
            "Morning photons trigger an immediate cortisol surge that powers daytime energy, while setting a natural timer to release melatonin sixteen hours later."
        ),
        "pinned_comment": "The Cortisol Protocol: View direct morning sunlight within 60 minutes of waking to anchor daytime energy and unlock effortless sleep 16 hours later."
    }
}

def generate_dynamic_mode_b_script(clean_topic: str) -> Tuple[str, str]:
    vo = (
        f"Notice how you delay working on {clean_topic.lower()} even when you know it impacts your future? "
        "Psychologists call this Emotional Task Avoidance. "
        "Your brain doesn't fear the work itself—it treats emotional uncertainty as a physical threat, freezing your prefrontal cortex in comfort mode. "
        "Waiting for motivation keeps you trapped because motivation is an emotion, not an initiation trigger. "
        "The solution is shrinking the initiation threshold to two minutes: write a single sentence, open the project, or take one physical step. "
        "Breaking the kinetic barrier shifts your dopamine from avoidance to completion, building unstoppable momentum."
    )
    comment = f"The Protocol on {clean_topic.lower()}: Motivation never precedes action. Shrink the initiation threshold to 2 minutes to break the kinetic barrier."
    return vo, comment

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
        pinned_comment = None
        lower_top = clean_topic.lower()
        for p_num, c_data in CURATED_SCRIPTS.items():
            if c_data["topic"].lower() in lower_top or any(kw in lower_top for kw in c_data.get("keywords", [])):
                curated_mode_b = c_data["mode_b"]
                pinned_comment = c_data.get("pinned_comment", "Question for you: What are your thoughts on this? Tell me below 👇")
                break

        if not curated_mode_b:
            # Match against the 9 Core Psychological Archetypes
            for arch_name, arch_data in CORE_ARCHETYPES.items():
                if any(kw in lower_top for kw in arch_data["keywords"]):
                    curated_mode_b = arch_data["voiceover"]
                    pinned_comment = arch_data["pinned_comment"]
                    break

        if not curated_mode_b:
            # Dynamic 2-Beat Curiosity Gap fallback tailored to clean_topic
            curated_mode_b, pinned_comment = generate_dynamic_mode_b_script(clean_topic)

        voiceover = curated_mode_b
        words = voiceover.split()
        is_valid, issues = check_script_hygiene(voiceover, is_mode_a=False, is_duo=False)

        formatted_output = f"[VOICEOVER]\n{voiceover}\n\n[PINNED COMMENT]\n{pinned_comment}"

        return {
            "mode": "B",
            "is_product_linked": False,
            "topic": clean_topic,
            "voiceover": voiceover,
            "pinned_comment": pinned_comment,
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
