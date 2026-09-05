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
        r"\{\s*(?:health|finance|self\s*improv?ement|facecam|no\s*topics?|no\s*meta|meta|no\s*memes?|duo|meme(?:\s*:\s*[^}]+)?|(?:product|pdf)\s*:\s*[^,}]+,\s*page\s*:\s*\d+)\s*\}",
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

    # Generic shortener: take first 3-4 impactful words
    words = clean.split()
    if len(words) > 4:
        short_title = " ".join(words[:4]).upper()
    else:
        short_title = clean.upper()

    highlight = words[0].upper() if words else "TRUTH"
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

def generate_full_metadata(topic: str, niche: str = "self_improvement", script: str = "", pinned_comment: str = "") -> Dict[str, Any]:
    """
    Master generator: outputs the complete metadata package for YouTube/Instagram.
    """
    clean = sanitize_raw_topic(topic)
    viral_title = synthesize_viral_title(clean, niche, script)
    thumb_title, highlight_word, thumb_sub = synthesize_thumbnail_title(clean, niche)
    description = synthesize_rich_description(clean, niche, script)
    tags = synthesize_tags(clean, niche)

    return {
        "raw_topic": topic,
        "clean_topic": clean,
        "title": viral_title,
        "thumbnail_title": thumb_title,
        "thumbnail_highlight": highlight_word,
        "thumbnail_subtitle": thumb_sub,
        "description": description,
        "tags": tags,
        "categoryId": "27",
        "privacyStatus": "public",
        "pinnedComment": pinned_comment or ""
    }

if __name__ == "__main__":
    import json
    sample = generate_full_metadata("Should you make relationships in teenage or not", "self_improvement", "Notice how in high school, everyone acts like being single means you're unwanted, but being in a relationship leaves you exhausted managing someone else's moods.")
    print(json.dumps(sample, indent=2))
