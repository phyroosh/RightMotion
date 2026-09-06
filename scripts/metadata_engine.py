#!/usr/bin/env python3
"""
RightClips Autonomous Viral Metadata & Hook Synthesizer.
Converts raw user topic prompts into high-CTR viral titles,
punchy thumbnail card titles, rich structured descriptions,
and algorithmic SEO tags.
"""

import re
from typing import Dict, Any, List, Tuple

def sanitize_raw_topic(topic: str) -> str:
    """Strips niche brackets, product tags, modifier tags, and quotes."""
    clean = re.sub(
        r"\{\s*(?:health|finance|self\s*improv?ement|facecam|no\s*topics?|no\s*meta|meta|no\s*memes?|andrew|duo|meme(?:\s*:\s*[^}]+)?|(?:product|pdf)\s*:\s*[^,}]+,\s*page\s*:\s*\d+)\s*\}",
        "",
        topic,
        flags=re.IGNORECASE,
    )
    clean = clean.strip(" :\"'—-")
    clean = re.sub(r"\s+", " ", clean).strip()
    return clean

def synthesize_viral_title(topic: str, niche: str = "self_improvement", script: str = "") -> str:
    """
    Transforms raw topic phrasing into an irresistible short-form hook title.
    """
    clean = sanitize_raw_topic(topic)
    lower = clean.lower()

    # Specific common question / pattern mappings
    if "relationship" in lower and ("teen" in lower or "high school" in lower or "not" in lower):
        return "Why Teenage Relationships Feel So Exhausting 💔 #Shorts"
    if "caught trying" in lower or "seen trying" in lower:
        return "Why You Pretend Not to Care (The Fear of Trying) 🎭 #Shorts"
    if "social media" in lower and "teen" in lower:
        return "How Social Media Quietly Destroys Your Focus 📱 #Shorts"
    if "boundar" in lower and "friend" in lower:
        return "The Hard Truth About Boundaries with Friends 🧠 #Shorts"
    if "side character" in lower:
        return "Why You Feel Like a Side Character in Your Own Life 🪞 #Shorts"
    if "overthink" in lower and ("2 am" in lower or "night" in lower or "text" in lower):
        return "Why You Replay Every Awkward Conversation at 2 AM 🌙 #Shorts"
    if "alone" in lower and "not alone" in lower:
        return "When Life Feels Completely Out of Control 🌧️ #Shorts"
    if "gita" in lower and "teen" in lower:
        return "Ancient Gita Wisdom Every Teenager Needs to Hear 🏹 #Shorts"
    if "dopamine" in lower and ("reset" in lower or "loop" in lower):
        return "The 24-Hour Dopamine Loop Reset ⚡ #Shorts"
    if "cortisol" in lower and ("3 am" in lower or "wake" in lower):
        return "Why You Wake Up in a Panic at 3 AM ⏱️ #Shorts"

    # Conversational pattern conversions
    # "Should you X or not" -> "The Truth About X"
    m_should = re.match(r"^should\s+(?:you|we)\s+(.+?)(?:\s+or\s+not)?\??$", lower)
    if m_should:
        core = m_should.group(1).strip()
        core_cap = core.title()
        return f"The Truth About {core_cap} 🧠 #Shorts"

    # "How to X" -> "Why Most People Fail at X"
    if lower.startswith("how to "):
        action = clean[7:].strip()
        return f"The Secret to {action.title()} 💡 #Shorts"

    # "Why X" -> preserve with emoji
    if lower.startswith("why "):
        return f"{clean} 🧠 #Shorts"

    # Default fallback
    emoji = "💡" if niche == "finance" else ("🧬" if niche == "health" else "🧠")
    return f"{clean} {emoji} #Shorts"

def synthesize_thumbnail_title(topic: str, niche: str = "self_improvement") -> Tuple[str, str, str]:
    """
    Extracts a punchy 2-4 word viral thumbnail title, highlight word, and subtitle.
    Returns: (thumbnail_title, highlight_word, subtitle)
    """
    clean = sanitize_raw_topic(topic)
    lower = clean.lower()

    if "relationship" in lower and ("teen" in lower or "not" in lower or "dating" in lower):
        return ("THE DATING TRAP", "DATING", "Why Teenage Relationships Exhaust You")
    if "caught trying" in lower or "seen trying" in lower:
        return ("FEAR OF TRYING", "TRYING", "Why You Pretend Indifference")
    if "social media" in lower:
        return ("SOCIAL MEDIA TRAP", "TRAP", "Why It Destroys Teen Focus")
    if "boundar" in lower:
        return ("FRIENDSHIP BOUNDARIES", "BOUNDARIES", "Saying No Without Guilt")
    if "side character" in lower:
        return ("SIDE CHARACTER SYNDROME", "SIDE", "Reclaiming Your Life")
    if "overthink" in lower:
        return ("THE 2 AM OVERTHINK", "OVERTHINK", "Silencing the Inner Loop")
    if "gita" in lower:
        return ("ANCIENT GITA WISDOM", "WISDOM", "Mindset for Modern Chaos")
    if "loop" in lower or "diagram" in lower:
        return ("DIAGRAM YOUR LOOP", "LOOP", "Audit Your Dopamine Triggers")
    if "minimum" in lower:
        return ("THE MINIMUM VIABLE DAY", "MINIMUM", "Emergency Baseline Survival")
    if "cortisol" in lower and ("3 am" in lower or "wake" in lower):
        return ("THE 3 AM CORTISOL SPIKE", "CORTISOL", "Why You Wake Up in a Panic")

    # High-impact semantic stop words to isolate core psychological concepts
    STOP_WORDS = {
        "why", "how", "what", "is", "are", "was", "were", "do", "does", "did",
        "the", "a", "an", "and", "or", "to", "of", "in", "for", "on", "with", "at", "by",
        "from", "be", "being", "been", "you", "your", "we", "our", "so", "that", "this",
        "it", "its", "when", "where", "feel", "feels", "feeling", "make", "makes", "making",
        "really", "actually", "always", "never", "about", "secretly", "quietly", "someone",
        "anyone", "everyone", "nobody", "things", "thing"
    }

    raw_words = [re.sub(r"[^\w-]", "", w) for w in clean.split() if re.sub(r"[^\w-]", "", w)]
    core_words = [w for w in raw_words if w.lower() not in STOP_WORDS and len(w) > 2]

    if core_words:
        if len(core_words) == 1:
            short_title = f"THE {core_words[0].upper()} TRAP"
            highlight = core_words[0].upper()
        elif len(core_words) == 2:
            short_title = f"{core_words[0].upper()} {core_words[1].upper()}"
            highlight = core_words[1].upper() if len(core_words[1]) >= len(core_words[0]) else core_words[0].upper()
        else:
            short_title = f"{core_words[0].upper()} {core_words[1].upper()} {core_words[2].upper()}"
            # Select the longest / most vivid emotional term as the glowing highlight word
            highlight = max(core_words[:3], key=len).upper()

        topic_phrase = f"{core_words[0].capitalize()} {core_words[1].capitalize()}" if len(core_words) > 1 else core_words[0].capitalize()
        if niche == "finance":
            subtitle = f"The Compound Leverage of {topic_phrase}"
        elif niche == "health":
            subtitle = f"The Biological Mechanism Behind {topic_phrase}"
        elif niche == "facecam":
            subtitle = f"Operator Breakdown: {topic_phrase}"
        else:
            subtitle = f"The Psychology Behind {topic_phrase}"
        return (short_title, highlight, subtitle)

    # Clean fallback if no core words survived stop-word filter
    words = clean.split()
    short_title = " ".join(words[:3]).upper() if words else "THE COGNITIVE TRAP"
    highlight = words[0].upper() if words else "TRAP"
    subtitle = "High-Retention Psychology Breakdown" if niche == "self_improvement" else "Strategic Capital & Wealth Protocol"
    return (short_title, highlight, subtitle)

def synthesize_rich_description(topic: str, niche: str = "self_improvement", script: str = "") -> str:
    """
    Generates a structured, engaging YouTube / Instagram description.
    """
    clean = sanitize_raw_topic(topic)
    viral_title = synthesize_viral_title(clean, niche, script)

    # Niche channel details
    if niche == "finance":
        channel_name = "Apex Wealth"
        channel_desc = "High-velocity financial models, capital compounding, and asymmetric leverage."
        hashtags = "#Shorts #Wealth #Finance #MoneyMindset #Investing #Capital #ApexWealth"
    elif niche == "health":
        channel_name = "BioMatrix"
        channel_desc = "Biometric telemetry, cellular longevity protocols, and circadian optimization."
        hashtags = "#Shorts #Biohacking #Longevity #Health #CircadianRhythm #BioMatrix"
    elif niche == "facecam":
        channel_name = "Build to Scale"
        channel_desc = "Behind-the-scenes startup breakdowns, unit economics, and operator secrets."
        hashtags = "#Shorts #Entrepreneurship #Startup #Business #BuildToScale"
    else:
        channel_name = "Judy Insights"
        channel_desc = "Deconstructing subconscious loops, emotional defense mechanisms, and human psychology."
        hashtags = "#Shorts #Psychology #Mindset #SelfImprovement #MentalHealth #JudyInsights"

    # Contextual insight extraction
    mechanism_preview = ""
    if script:
        clean_script = script.strip()
        if clean_script.startswith(("[", "{")):
            try:
                import json
                parsed = json.loads(clean_script)
                if isinstance(parsed, list):
                    clean_script = " ".join(item.get("word", item.get("text", "")) for item in parsed if isinstance(item, dict))
                elif isinstance(parsed, dict):
                    clean_script = parsed.get("text", "")
            except Exception:
                pass
        # Grab first 1-2 impactful sentences from clean_script
        sentences = [s.strip() for s in re.split(r"[.!?]+", clean_script) if len(s.strip()) > 15]
        if sentences:
            mechanism_preview = f"{sentences[0]}."

    if not mechanism_preview:
        mechanism_preview = f"We unpack the subconscious friction behind {clean.lower()} and how to rewire your automatic reactions."

    desc = f"""{viral_title.replace(' #Shorts', '')}

{mechanism_preview}

✨ Core Takeaway:
Most people struggle with this because their nervous system is on autopilot. When you understand the cognitive mechanism, the behavior stops feeling like personal failure and becomes something you can intentionally shift.

🔔 Follow {channel_name} for daily breakdowns on how your mind actually works:
{channel_desc}

{hashtags}"""
    return desc.strip()

def synthesize_tags(topic: str, niche: str = "self_improvement") -> List[str]:
    """
    Generates tailored search and recommendation tags.
    """
    clean = sanitize_raw_topic(topic)
    base_tags = ["Shorts", "YouTube Shorts", "Self Improvement", "Psychology", "Mindset"]
    
    # Specific niche tags
    niche_tags = {
        "self_improvement": ["Judy Insights", "Mental Models", "Teen Psychology", "Self Awareness", "Personal Growth"],
        "finance": ["Apex Wealth", "Wealth Building", "Financial Freedom", "Investing", "Money Psychology"],
        "health": ["BioMatrix", "Biohacking", "Neuroscience", "Circadian Rhythm", "Wellness"],
        "facecam": ["Startup Breakdown", "Founder Story", "Business Strategy", "Scale", "Operator"]
    }.get(niche, ["Judy Insights"])

    topic_tags = [w.capitalize() for w in re.findall(r"[a-zA-Z]{4,}", clean) if w.lower() not in ["should", "make", "this", "that", "with", "from", "about", "your", "what"]]

    combined = list(dict.fromkeys(base_tags + niche_tags + topic_tags + [clean]))
    return combined[:12]

def synthesize_spoken_cta(topic: str, niche: str = "self_improvement") -> str:
    """
    Synthesizes an intimate, high-friction spoken interactive question for the voiceover ending.
    Begins with an ellipsis/dash to trigger a natural 200-250ms breath pause in TTS before Judy asks.
    """
    clean = sanitize_raw_topic(topic)
    lower = clean.lower()

    if "relationship" in lower or "dating" in lower:
        return "... Be honest: have you ever stayed in something just so you wouldn't feel alone? Tell me below."
    if "caught trying" in lower or "seen trying" in lower:
        return "... Question for you: what's the one thing you secretly care deeply about, but pretend is no big deal? Tell me below."
    if "social media" in lower:
        return "... Be honest: what's the first app you open when you feel bored? Drop it below."
    if "boundar" in lower:
        return "... Have you ever felt guilty for finally saying no to a friend? Tell me below."
    if "overthink" in lower:
        return "... Be honest: do you ever replay awkward conversations in your head for hours? Tell me below."
    if "side character" in lower:
        return "... Do you ever catch yourself living for other people's approval? Drop your thoughts below."
    if "dopamine" in lower or "loop" in lower:
        return "... What's the one bad habit loop you keep falling back into? Drop it below."
    if "cortisol" in lower or "sleep" in lower or "3 am" in lower:
        return "... Do you wake up feeling calm, or with your chest already tight? Tell me below."

    if niche == "finance":
        return "... Would you rather take 10k right now, or 100k locked for three years? Tell me below."
    if niche == "health":
        return "... Do you wake up energized, or needing coffee just to function? Tell me below."

    return f"... Have you ever caught yourself doing this? Drop your thoughts below."

def synthesize_interactive_pill_text(topic: str, niche: str = "self_improvement") -> Tuple[str, str]:
    """
    Returns (pill_prompt, pill_tag) for on-screen InteractiveEngagementPill.
    """
    clean = sanitize_raw_topic(topic)
    lower = clean.lower()

    if "relationship" in lower or "dating" in lower:
        return ("Mistaken anxiety for chemistry? Tell me below 👇", "CONFESSION")
    if "caught trying" in lower:
        return ("Pretending not to care? Be honest 👇", "REALITY CHECK")
    if "overthink" in lower:
        return ("Replaying 2 AM thoughts? Drop them 👇", "COMMUNITY")
    if "boundar" in lower:
        return ("Hard to say no to friends? Tell me below 👇", "BOUNDARIES")
    
    return ("Have you felt this? Drop your thoughts 👇", "COMMUNITY")

def generate_full_metadata(topic: str, niche: str = "self_improvement", script: str = "", pinned_comment: str = "") -> Dict[str, Any]:
    """
    Master generator: outputs the complete metadata package for YouTube/Instagram.
    """
    clean = sanitize_raw_topic(topic)
    viral_title = synthesize_viral_title(clean, niche, script)
    thumb_title, highlight_word, thumb_sub = synthesize_thumbnail_title(clean, niche)
    description = synthesize_rich_description(clean, niche, script)
    tags = synthesize_tags(clean, niche)
    spoken_cta = synthesize_spoken_cta(clean, niche)
    pill_prompt, pill_tag = synthesize_interactive_pill_text(clean, niche)

    # If pinned_comment not passed, align it with the spoken question!
    if not pinned_comment:
        clean_question = spoken_cta.strip(". —").strip()
        pinned_comment = f"{clean_question} 👇"

    return {
        "raw_topic": topic,
        "clean_topic": clean,
        "title": viral_title,
        "thumbnail_title": thumb_title,
        "thumbnail_highlight": highlight_word,
        "thumbnail_subtitle": thumb_sub,
        "spoken_cta": spoken_cta,
        "pill_prompt": pill_prompt,
        "pill_tag": pill_tag,
        "description": description,
        "tags": tags,
        "categoryId": "27",
        "privacyStatus": "public",
        "pinnedComment": pinned_comment
    }

if __name__ == "__main__":
    import argparse
    import json

    parser = argparse.ArgumentParser(description="RightClips Viral Metadata Engine")
    parser.add_argument("--topic", default="Should you make relationships in teenage or not", help="Raw topic prompt")
    parser.add_argument("--niche", default="self_improvement", help="Channel niche")
    parser.add_argument("--script", default="", help="Voiceover script text")
    parser.add_argument("--json", action="store_true", help="Output JSON format")
    args = parser.parse_args()

    sample = generate_full_metadata(args.topic, args.niche, args.script)
    print(json.dumps(sample, indent=2))
