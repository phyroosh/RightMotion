#!/usr/bin/env python3
"""
RightClips Master CLI Generator
End-to-end automated video, 4K thumbnail, and cutout asset storyboard generation for AI agents & creators.
"""

import argparse
import asyncio
import json
import os
import re
import sys
import site
import subprocess
from pathlib import Path

# Force UTF-8 output encoding for Windows terminals
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

# Automatically configure NVIDIA CUDA library paths for Windows ctranslate2
for s in site.getsitepackages():
    for sub in ["nvidia/cublas/bin", "nvidia/cudnn/bin", "nvidia/cuda_nvrtc/bin"]:
        p = os.path.join(s, sub)
        if os.path.exists(p):
            try:
                os.add_dll_directory(p)
                os.environ["PATH"] = p + os.pathsep + os.environ.get("PATH", "")
            except Exception:
                pass

ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(ROOT_DIR / "scripts"))

from extract_product_page import extract_product_page
from generate_script import generate_script_and_metadata, check_script_hygiene
from dialogue_engine import process_dialogue

def sanitize_tags(text: str) -> str:
    if not text:
        return ""
    # Strip {Health}, {Finance}, {Self Improvement}, {facecam}, {no topics}, {no meta}, {no meme}, {duo}, {meme: ...}, and product tags
    pattern = re.compile(
        r"\{\s*(?:health|finance|self\s*improv?ement|facecam|no\s*topics?|no\s*meta|no\s*memes?|duo|meme(?:\s*:\s*[^}]+)?|(?:product|pdf)\s*:\s*[^,}]+,\s*page\s*:\s*\d+)\s*\}",
        re.IGNORECASE,
    )
    cleaned = pattern.sub("", text)
    cleaned = re.sub(r"[{}\\]", "", cleaned)
    return re.sub(r"\s+", " ", cleaned).strip()

def parse_script_blocks(raw_text: str):
    """
    Parses [METADATA] and [VOICEOVER] blocks if present.
    Returns: (product_file, page_number, exercise_title, voiceover_text)
    """
    if not raw_text:
        return None, None, None, ""

    product_file = None
    page_number = None
    exercise_title = None
    voiceover_text = raw_text
    pinned_comment = None

    # Check for [METADATA]
    meta_match = re.search(r"\[METADATA\](.*?)(?:\[VOICEOVER\]|\[PINNED COMMENT\]|$)", raw_text, re.DOTALL | re.IGNORECASE)
    if meta_match:
        meta_content = meta_match.group(1)
        f_match = re.search(r"product_file:\s*([^\n\r]+)", meta_content, re.IGNORECASE)
        if f_match:
            product_file = f_match.group(1).strip()
        p_match = re.search(r"page_number:\s*(\d+)", meta_content, re.IGNORECASE)
        if p_match:
            try:
                page_number = int(p_match.group(1).strip())
            except ValueError:
                pass
        e_match = re.search(r"exercise_title:\s*([^\n\r]+)", meta_content, re.IGNORECASE)
        if e_match:
            exercise_title = e_match.group(1).strip()

    # Check for [PINNED COMMENT]
    pinned_match = re.search(r"\[PINNED COMMENT\]\s*(.*)", raw_text, re.DOTALL | re.IGNORECASE)
    if pinned_match:
        pinned_comment = pinned_match.group(1).strip()

    # Check for [VOICEOVER]
    vo_match = re.search(r"\[VOICEOVER\]\s*(.*?)(?:\[PINNED COMMENT\]|$)", raw_text, re.DOTALL | re.IGNORECASE)
    if vo_match:
        voiceover_text = vo_match.group(1).strip()
    elif meta_match:
        voiceover_text = raw_text[meta_match.end():]
        if pinned_match:
            c_idx = voiceover_text.lower().find("[pinned comment]")
            if c_idx != -1:
                voiceover_text = voiceover_text[:c_idx]
        voiceover_text = voiceover_text.strip()
    elif pinned_match:
        c_idx = raw_text.lower().find("[pinned comment]")
        if c_idx != -1:
            voiceover_text = raw_text[:c_idx].strip()

    return product_file, page_number, exercise_title, voiceover_text, pinned_comment


def clean_thumbnail_title(raw_title: str) -> str:
    """
    Ensures thumbnail titles are 100% pure high-converting viral hooks,
    strictly stripping any page numbers, PDF mentions, or parenthetical page tags.
    Example: 'Diagram Your Loop (Page 7)' -> 'DIAGRAM YOUR LOOP'
    """
    if not raw_title:
        return ""
    text = sanitize_tags(raw_title)
    # Strip parenthetical/bracketed page references: (Page 7), [Page 14], (p. 7), (pg. 7), (Page 7 of 15)
    text = re.sub(
        r"\s*[\(\[\{]\s*(?:page|pg\.?|p\.)\s*\d+(?:\s*(?:of|/)\s*\d+)?\s*[\)\]\}]",
        "",
        text,
        flags=re.IGNORECASE,
    )
    # Strip standalone page mentions: "Page 7", "Pg. 14", "p. 7"
    text = re.sub(r"\b(?:page|pg\.?|p\.)\s*\d+\b", "", text, flags=re.IGNORECASE)
    # Strip file extensions / PDF mentions: "Photon.pdf", "something.pdf"
    text = re.sub(r"\b\w+\.pdf\b", "", text, flags=re.IGNORECASE)
    # Strip trailing/leading hyphens, colons, or punctuation
    text = re.sub(r"[\s\-_:–—]+$", "", text).strip()
    text = re.sub(r"^[\s\-_:–—]+", "", text).strip()
    text = re.sub(r"\s+", " ", text).strip()
    return text.upper()

def sanitize_topic(raw_topic: str) -> str:
    """
    Cleans topic titles so they represent pure high-impact subject lines,
    stripping niche brackets, product tags, and parenthetical page numbers.
    """
    if not raw_topic:
        return ""
    text = sanitize_tags(raw_topic)
    text = re.sub(
        r"\s*[\(\[\{]\s*(?:page|pg\.?|p\.)\s*\d+(?:\s*(?:of|/)\s*\d+)?\s*[\)\]\}]",
        "",
        text,
        flags=re.IGNORECASE,
    )
    text = re.sub(r"\b(?:page|pg\.?|p\.)\s*\d+\b", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\b\w+\.pdf\b", "", text, flags=re.IGNORECASE)
    text = re.sub(r"[\s\-_:–—]+$", "", text).strip()
    text = re.sub(r"^[\s\-_:–—]+", "", text).strip()
    return re.sub(r"\s+", " ", text).strip()

REGISTRY_PATH = ROOT_DIR / "public" / "assets" / "registry.json"

def load_asset_registry():
    if REGISTRY_PATH.exists():
        try:
            with open(REGISTRY_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {}

def select_cutout_assets(topic: str, script: str):
    """
    Intelligently select the best matching problem & solution cutout assets from the registry based on text keywords.
    """
    registry = load_asset_registry()
    if not registry:
        return ("phone_dopamine_overload", "hyperrealistic_3d_glowing_brain")

    combined_text = f"{topic} {script}".lower()

    # Keyword scoring
    scored = []
    for asset_id, meta in registry.items():
        score = 0
        for kw in meta.get("keywords", []):
            if re.search(r"\b" + re.escape(kw) + r"\b", combined_text):
                score += 3
            elif kw in combined_text:
                score += 1
        scored.append((score, asset_id, meta))

    scored.sort(key=lambda x: x[0], reverse=True)

    # Separate problem/burnout vs solution/psychology/habits
    problem_assets = [item for item in scored if item[2].get("category") in ["burnout", "devices"] or item[2].get("tone") in ["critical", "drained", "chaotic", "oppressive", "distressed"]]
    solution_assets = [item for item in scored if item[2].get("category") in ["psychology", "habits", "relationships"] and item[2].get("tone") in ["insightful", "epiphany", "uplifting", "warm", "focused", "disciplined"]]

    problem_id = problem_assets[0][1] if problem_assets else "brain_battery_depleted"
    solution_id = solution_assets[0][1] if solution_assets else "hyperrealistic_3d_glowing_brain"

    return problem_id, solution_id

async def synthesize_speech(text: str, output_path: Path, voice: str = "en-US-AvaMultilingualNeural"):
    import edge_tts
    output_path.parent.mkdir(parents=True, exist_ok=True)
    raw_path = output_path.with_name("raw_" + output_path.name)
    print(f"🎙️ [1/4] Synthesizing neural speech with voice '{voice}' (rate=+8% for retention)...")
    # Clean text to avoid pauses
    norm_text = text.replace("…", ",").replace("...", ",").replace("\r\n", "\n").replace("\n\n", " ").replace("\n", " ").strip()
    communicate = edge_tts.Communicate(text=norm_text, voice=voice, rate="+8%")
    await communicate.save(str(raw_path))

    # Compress pauses > 0.18s
    try:
        cmd = [
            "ffmpeg", "-y", "-i", str(raw_path),
            "-af", "silenceremove=stop_periods=-1:stop_duration=0.18:stop_threshold=-35dB:detection=peak",
            "-b:a", "192k",
            str(output_path)
        ]
        subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        print(f"      Pause-compressed master audio saved to: {output_path}")
    except Exception as e:
        print(f"      Pause compression fallback: {e}")
        shutil.copy2(str(raw_path), str(output_path))

def transcribe_audio(audio_path: Path, output_json: Path):
    from faster_whisper import WhisperModel
    import ctranslate2

    print("📝 [2/4] Extracting word timestamps with faster-whisper...")
    output_json.parent.mkdir(parents=True, exist_ok=True)

    device = "cpu"
    comp_type = "int8"
    segments = None
    if ctranslate2.get_cuda_device_count() > 0:
        try:
            model = WhisperModel("base.en", device="cuda", compute_type="float16")
            seg_gen, info = model.transcribe(str(audio_path), word_timestamps=True, language="en", beam_size=5)
            segments = list(seg_gen)
            device = "cuda"
            comp_type = "float16"
        except Exception as e:
            print(f"      CUDA runtime ({e}), using CPU int8...")
            model = WhisperModel("base.en", device="cpu", compute_type="int8")
            seg_gen, info = model.transcribe(str(audio_path), word_timestamps=True, language="en", beam_size=5)
            segments = list(seg_gen)
            device = "cpu"
            comp_type = "int8"
    else:
        model = WhisperModel("base.en", device="cpu", compute_type="int8")
        seg_gen, info = model.transcribe(str(audio_path), word_timestamps=True, language="en", beam_size=5)
        segments = list(seg_gen)

    print(f"      Transcribing on compute device: {device} ({comp_type})")

    words_list = []
    for s in segments:
        for w in s.words:
            word_clean = w.word.strip()
            if word_clean:
                words_list.append({
                    "word": word_clean,
                    "start": round(w.start * 1000),
                    "end": round(w.end * 1000),
                    "confidence": round(w.probability, 3)
                })

    with open(output_json, "w", encoding="utf-8") as f:
        json.dump(words_list, f, indent=2, ensure_ascii=False)

    duration_sec = words_list[-1]["end"] / 1000.0 if words_list else 5.0
    print(f"      Transcribed {len(words_list)} words -> {output_json} ({duration_sec:.2f}s)")
    return words_list, duration_sec

def parse_script_into_concepts(script_text: str):
    # Strip speaker prefixes (e.g. JUDY:, ANDREW:) for visual cards
    clean_text = re.sub(r"(?:^|\s+)(?:judy|andrew)\s*:\s*", " ", script_text, flags=re.IGNORECASE).strip()
    lines = [l.strip() for l in clean_text.splitlines() if l.strip()]
    concepts = []
    for line in lines:
        parts = [p.strip() for p in re.split(r'(?<=[a-zA-Z][.?!])\s+(?=[A-Z"\'“‘])', line) if p.strip()]
        for p in parts:
            words = p.split()
            # If a single sentence is very long (>= 16 words), split on contrast clauses or em-dashes
            if len(words) >= 16:
                sub_parts = re.split(r'(?<=,)\s+(?=but\b|yet\b|however\b|while\b|whereas\b)|(?<=\w)\s*—\s*|(?<=;)\s+', p, flags=re.IGNORECASE)
                if len(sub_parts) > 1:
                    for sp in sub_parts:
                        if sp.strip():
                            concepts.append(sp.strip())
                    continue
            if p:
                concepts.append(p)
    return concepts

def generate_illustration_beats(s1_words, s1_start, s2_start, topic, hook_text, problem_text, accent_color="cyan", fps=30):
    beats = []
    s1_frames = s2_start - s1_start
    if not s1_words or s1_frames < 45:
        return beats, s1_start

    contrast_keywords = {
        "but", "yet", "however", "instead", "actually", "until", "when",
        "where", "while", "because", "every", "nobody", "most", "stop", "never"
    }

    pivot_frames = []
    for i, w in enumerate(s1_words):
        wf = round((w.get("start", w.get("startMs", 0)) / 1000) * fps)
        cleaned = re.sub(r"[^a-zA-Z]", "", w.get("word", "").lower())
        if cleaned in contrast_keywords:
            pivot_frames.append((wf, cleaned, w.get("word", "")))

    # Choose beat 2 frame around 35% - 50% through s1
    target_b2_frame = round(s1_start + s1_frames * 0.42)
    b2_frame = target_b2_frame
    for pf, kw, orig in pivot_frames:
        if abs(pf - target_b2_frame) <= round(fps * 1.6) and pf >= s1_start + 25:
            b2_frame = pf
            break

    # Extract a prominent word around b2_frame for callout tag
    b2_word = ""
    for w in s1_words:
        wf = round((w.get("start", w.get("startMs", 0)) / 1000) * fps)
        if wf >= b2_frame:
            cleaned = re.sub(r"[^a-zA-Z]", "", w.get("word", "").upper())
            if len(cleaned) >= 4 and cleaned.lower() not in contrast_keywords:
                b2_word = cleaned
                break

    def clean_truncate(text, max_len=50):
        if len(text) <= max_len:
            return text
        truncated = text[:max_len].rsplit(" ", 1)[0]
        return truncated + "..."

    callout_tag = f"{b2_word} REALITY" if b2_word else "CORE FRICTION"
    callout_sub = clean_truncate(problem_text, 50)

    # Beat 2: Tactical Callout Pin with Camera Punch
    beats.append({
        "frame": b2_frame,
        "type": "callout",
        "text": callout_tag,
        "subtext": callout_sub,
        "position": "top-right",
        "icon": "target",
        "color": accent_color,
        "zoomLevel": 1.15,
        "targetX": 50,
        "targetY": 40
    })

    # Beat 3: Diagnostic Warning Stamp (if s1 is >= 4.5s / 135 frames)
    if s1_frames >= 135 and s2_start - b2_frame >= 60:
        target_b3_frame = round(b2_frame + (s2_start - b2_frame) * 0.58)
        b3_frame = target_b3_frame

        friction_keywords = {
            "anxiety", "paralyzed", "fear", "crisis", "failure", "loop",
            "burnout", "exhaustion", "trap", "panic", "stress", "mask",
            "overthinking", "identity", "doubt", "freeze", "alone"
        }
        b3_word = ""
        for w in s1_words:
            wf = round((w.get("start", w.get("startMs", 0)) / 1000) * fps)
            cleaned = re.sub(r"[^a-zA-Z]", "", w.get("word", "").lower())
            if cleaned in friction_keywords and wf >= b2_frame + 20:
                b3_frame = wf
                b3_word = cleaned.upper()
                break

        stamp_title = f"{b3_word} // ACTIVE" if b3_word else "SUBCONSCIOUS PARALYSIS"

        beats.append({
            "frame": b3_frame,
            "type": "stamp",
            "text": stamp_title,
            "subtext": "COGNITIVE OVERLOAD",
            "position": "bottom-left",
            "icon": "alert",
            "color": "rose",
        })

    subtitle_frame = b2_frame
    return beats, subtitle_frame

def generate_pinned_comment(topic: str, niche: str, hook_text: str = "", script_text: str = "") -> str:
    """
    Autonomously generate a high-retention, discussion-catalyzing pinned comment.
    Designed to trigger viewer responses, boost comments from 0, and drive algorithmic push.
    """
    clean_top = topic.replace("{Self Improvement}", "").replace("{Finance}", "").replace("{Health}", "").replace("{facecam}", "").replace("{no topics}", "").replace("{no meta}", "").strip()
    lower_t = f"{clean_top} {hook_text} {script_text}".lower()

    if niche == "finance":
        if any(k in lower_t for k in ["credit", "score", "utilization"]):
            return "Be honest: What's the biggest credit card myth you believed when you first started? Drop your score goals below 👇"
        elif any(k in lower_t for k in ["invest", "roth", "compound", "401k"]):
            return "At what age did you first hear about compounding? Let's see the average in the replies 👇"
        elif any(k in lower_t for k in ["emergency", "savings", "debt"]):
            return "What's the #1 unexpected expense that wiped out your savings before? How did you recover? 👇"
        return "Be honest: what's the one financial rule you wish you were taught at 18 instead of learning the hard way? Drop your thoughts below 👇"

    elif niche == "health":
        if any(k in lower_t for k in ["caffeine", "coffee", "adenosine", "crash"]):
            return "How many minutes after waking up do you usually drink your first coffee? Drop your exact morning time below 👇"
        elif any(k in lower_t for k in ["sleep", "cortisol", "circadian", "wake"]):
            return "What time do you usually fall asleep vs when you actually want to? Call yourself out below 👇"
        elif any(k in lower_t for k in ["freeze", "doomscroll", "dopamine"]):
            return "How many hours of screentime did your phone log yesterday? Be brutally honest 👇"
        return "Quick pulse check: Which of these habits drains your physical energy the most right now? Drop a 🫀 below 👇"

    elif niche == "facecam":
        return "What's your take on this strategy? Would you have made this same move? Let's discuss in the comments 👇"

    else:
        # Self Improvement / Psychology
        if any(k in lower_t for k in ["smart", "bad choices", "foolish", "decision"]):
            return "Be honest: What's a bad choice you made recently even though you knew better? We've all been there 👇"
        elif any(k in lower_t for k in ["pretend", "care", "trying", "caught"]):
            return "Question for you: What's the one thing you secretly care deeply about, but pretend is no big deal around others? Be honest 👇"
        elif any(k in lower_t for k in ["overthinking", "2 am", "spiral", "text"]):
            return "What was the last interaction you caught your brain over-analyzing at 2 AM? Drop it below 👇"
        elif any(k in lower_t for k in ["mask", "exhaustion", "burnout"]):
            return "How much of your day is spent performing versus actually feeling like yourself? Drop your thoughts below 👇"
        elif any(k in lower_t for k in ["alone", "loneliness", "isolated", "friend"]):
            return "If you're in a season where it feels like nobody truly gets you, drop a 🤍 below. You're not as isolated as you think."
        elif any(k in lower_t for k in ["promise", "trust", "habit"]):
            return "What's one small promise to yourself that you're going to keep today? Lock it in below 👇"
        return "Which part of this breakdown hit closest to home for you? Drop a 🧠 below 👇"

def generate_engagement_pill_text(topic: str, niche: str) -> str:
    lower_t = topic.lower()
    if niche == "finance":
        return "Save this framework for payday 📌"
    elif niche == "health":
        return "Drop a 🫀 if you need this reset"
    else:
        if "overthink" in lower_t or "2 am" in lower_t:
            return "Save this for your next 2 AM spiral 📌"
        elif "pretend" in lower_t or "trying" in lower_t:
            return "Have you caught yourself doing this? 🧠"
        elif "alone" in lower_t:
            return "Drop a 🤍 if this resonated with you"
        elif "promise" in lower_t:
            return "Double tap to lock in your promise 🔒"
        return "Have you felt this? Drop your thoughts 👇"

def align_concepts(concepts, words_list, fps=30):
    aligned = []
    curr_idx = 0
    total_words = len(words_list) if words_list else 0
    
    for c in concepts:
        c_tokens = [re.sub(r"[^a-zA-Z0-9]", "", w.lower()) for w in c.split() if w.strip()]
        if not c_tokens:
            continue
        
        match_idx = None
        if total_words > 0:
            for i in range(curr_idx, total_words):
                w_token = re.sub(r"[^a-zA-Z0-9]", "", words_list[i].get("word", "").lower())
                if w_token == c_tokens[0]:
                    match_idx = i
                    break
                elif len(c_tokens) > 1 and w_token == c_tokens[1]:
                    match_idx = max(0, i - 1)
                    break
        
        if match_idx is not None and total_words > 0:
            start_ms = words_list[match_idx].get("startMs", words_list[match_idx].get("start", 0))
            curr_idx = min(match_idx + max(1, len(c_tokens) - 1), total_words - 1)
            end_ms = words_list[curr_idx].get("endMs", words_list[curr_idx].get("end", start_ms + 1500))
        else:
            prev_end = aligned[-1]["endMs"] if aligned else 0
            start_ms = prev_end + 300
            end_ms = start_ms + 2000
        
        aligned.append({
            "text": c,
            "startMs": start_ms,
            "endMs": end_ms,
            "startFrame": round((start_ms / 1000) * fps),
            "endFrame": round((end_ms / 1000) * fps)
        })
    return aligned

def scaffold_clip_files(name: str, raw_topic: str, format_type: str, duration_sec: float, raw_script: str, words_list: list = None, product_meta: dict = None, illustration_path: str = None, pinned_comment: str = None, is_duo: bool = False, meme_meta: dict = None):
    topic = sanitize_tags(raw_topic)
    script_text = sanitize_tags(raw_script)
    print(f"🎨 [3/4] Scaffolding Remotion clip files with Speech-Synchronized Progressive Reveal in src/clips/{name}/...")
    clip_dir = ROOT_DIR / "src" / "clips" / name
    clip_dir.mkdir(parents=True, exist_ok=True)

    fps = 30
    total_frames = round(duration_sec * fps)
    pascal_name = "".join(w.capitalize() for w in re.split(r"[_\-\s]+", name))
    problem_cutout, solution_cutout = select_cutout_assets(topic, script_text)

    # 1. Niche Detection & Design System Mapping
    lower_text = f"{topic} {script_text}".lower()
    if "{facecam}" in lower_text or "facecam" in lower_text:
        niche = "facecam"
    elif "{finance}" in lower_text or "apex wealth" in lower_text or "roth" in lower_text or "credit" in lower_text or "invest" in lower_text or "money" in lower_text or "wealth" in lower_text:
        niche = "finance"
    elif "{health}" in lower_text or "biomatrix" in lower_text or "cortisol" in lower_text or "circadian" in lower_text or "sleep" in lower_text or "dopamine" in lower_text or "adenosine" in lower_text or "body" in lower_text:
        niche = "health"
    else:
        niche = "self_improvement"

    if niche == "finance":
        bg_code = f"""import React from "react";
import {{ FinanceBackground }} from "../../components/finance/FinanceBackground";

export const {pascal_name}Background: React.FC = () => {{
  return <FinanceBackground />;
}};
"""
        card_class = "w-full p-8 rounded-3xl bg-[#0b0f19]/95 border-2 border-emerald-500/40 shadow-2xl backdrop-blur-md flex flex-col items-center text-center gap-6"
        text_color = "text-white"
        accent_color = "text-emerald-400"
        sub_accent = "text-amber-400"
        item_box = "p-4 rounded-2xl bg-[#111827]/90 border border-emerald-500/30 flex items-center justify-between text-left shadow-lg"
        pill_box = "w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl font-black font-mono shrink-0"
        sub_pill = "text-2xl font-mono text-emerald-300 font-bold"
        status_box = "w-full p-4 rounded-2xl bg-black/70 border border-emerald-500/30 flex items-center justify-between text-2xl font-mono text-emerald-200"
        status_alert = "text-amber-400 font-black tracking-wide"
        glow_problem = "rose"
        glow_solution = "emerald"
    elif niche == "health":
        bg_code = f"""import React from "react";
import {{ HealthBackground }} from "../../components/health/HealthBackground";

export const {pascal_name}Background: React.FC = () => {{
  return <HealthBackground />;
}};
"""
        card_class = "w-full p-8 rounded-3xl bg-[#0a1124]/95 border-2 border-cyan-500/40 shadow-2xl backdrop-blur-md flex flex-col items-center text-center gap-6"
        text_color = "text-white"
        accent_color = "text-cyan-400"
        sub_accent = "text-rose-400"
        item_box = "p-4 rounded-2xl bg-[#0e172f]/90 border border-cyan-500/40 flex items-center justify-between text-left shadow-lg"
        pill_box = "w-12 h-12 rounded-xl bg-cyan-500/25 text-cyan-400 flex items-center justify-center text-3xl font-black font-mono shrink-0"
        sub_pill = "text-2xl font-mono text-cyan-300 font-bold"
        status_box = "w-full p-4 rounded-2xl bg-black/70 border border-cyan-500/30 flex items-center justify-between text-2xl font-mono text-cyan-200"
        status_alert = "text-rose-400 font-black tracking-wide"
        glow_problem = "rose"
        glow_solution = "cyan"
    elif niche == "facecam":
        bg_code = f"""import React from "react";

export const {pascal_name}Background: React.FC = () => {{
  return <div className="absolute inset-0 bg-[#070b14]" />;
}};
"""
        card_class = "w-full p-8 rounded-3xl bg-[#0b1120]/95 border-2 border-amber-500/40 shadow-2xl backdrop-blur-md flex flex-col items-center text-center gap-6"
        text_color = "text-white"
        accent_color = "text-amber-400"
        sub_accent = "text-cyan-400"
        item_box = "p-4 rounded-2xl bg-[#0f172a]/90 border border-amber-500/40 flex items-center justify-between text-left shadow-lg"
        pill_box = "w-12 h-12 rounded-xl bg-amber-500/25 text-amber-400 flex items-center justify-center text-3xl font-black font-mono shrink-0"
        sub_pill = "text-2xl font-mono text-amber-300 font-bold"
        status_box = "w-full p-4 rounded-2xl bg-black/70 border border-amber-500/30 flex items-center justify-between text-2xl font-mono text-amber-200"
        status_alert = "text-cyan-400 font-black tracking-wide"
        glow_problem = "rose"
        glow_solution = "amber"
    else: # self_improvement
        bg_code = f"""import React from "react";
import {{ LivingStudioBackground }} from "../../components/LivingStudioBackground";

export const {pascal_name}Background: React.FC = () => {{
  return <LivingStudioBackground />;
}};
"""
        card_class = "w-full p-8 rounded-3xl bg-white/95 border-2 border-sky-300/60 shadow-2xl backdrop-blur-md flex flex-col items-center text-center gap-6"
        text_color = "text-slate-950"
        accent_color = "text-[#0071e3]"
        sub_accent = "text-rose-500"
        item_box = "p-4 rounded-2xl bg-slate-50/90 border border-sky-200/80 flex items-center justify-between text-left shadow-lg"
        pill_box = "w-12 h-12 rounded-xl bg-[#0071e3]/15 text-[#0071e3] flex items-center justify-center text-3xl font-black font-mono shrink-0"
        sub_pill = "text-2xl font-mono text-sky-700 font-bold"
        status_box = "w-full p-4 rounded-2xl bg-slate-100/90 border border-sky-200 flex items-center justify-between text-2xl font-mono text-slate-800"
        status_alert = "text-rose-500 font-black tracking-wide"
        glow_problem = "rose"
        glow_solution = "amber"

    (clip_dir / "Background.tsx").write_text(bg_code, encoding="utf-8")

    # 2. Concept Segmentation & Word Timestamp Alignment
    concepts = parse_script_into_concepts(script_text)
    aligned = align_concepts(concepts, words_list, fps)

    if len(aligned) < 3:
        # Fallback if script is very short
        aligned = [
            {"text": topic, "startMs": 0, "endMs": round(duration_sec*350), "startFrame": 0, "endFrame": round(total_frames*0.35)},
            {"text": script_text, "startMs": round(duration_sec*350), "endMs": round(duration_sec*700), "startFrame": round(total_frames*0.35), "endFrame": round(total_frames*0.70)},
            {"text": "Master The Protocol", "startMs": round(duration_sec*700), "endMs": round(duration_sec*1000), "startFrame": round(total_frames*0.70), "endFrame": total_frames},
        ]

    # Partition concepts across 3 scenes:
    # Scene 1: Hook & Diagnostic Problem
    # Scene 2: The Core Breakdown / List Points (REVEALED ONE-BY-ONE!)
    # Scene 3: The Actionable Protocol & Finale
    n_concepts = len(aligned)
    if illustration_path and aligned[0]["endFrame"] >= 140 and n_concepts >= 3:
        # Pacing guardrail for illustration: if concept 0 alone is >= 4.6s, don't double up into an 11s scene!
        s1_items = [aligned[0]]
        s2_items = aligned[1:-1]
        s3_items = [aligned[-1]]
    elif n_concepts >= 6:
        s1_items = aligned[:2]
        s2_items = aligned[2:-2]
        s3_items = aligned[-2:]
    elif n_concepts >= 4:
        s1_items = aligned[:2]
        s2_items = aligned[2:-1]
        s3_items = aligned[-1:]
    else:
        s1_items = [aligned[0]]
        s2_items = [aligned[1]]
        s3_items = [aligned[-1]]

    s1_start = 0
    s2_start = s2_items[0]["startFrame"]
    s3_start = s3_items[0]["startFrame"]
    
    # Timings for Scene 1 elements:
    c1_hook_text = s1_items[0]["text"]
    c1_problem_text = s1_items[1]["text"] if len(s1_items) > 1 else topic
    f_c1_cutout = s1_items[1]["startFrame"] if len(s1_items) > 1 else max(12, round(s2_start * 0.4))
    f_c1_metric = max(f_c1_cutout + 12, round(s2_start * 0.75))

    intro_ms = min(3500, round((s1_items[-1]["startFrame"] / fps) * 1000))
    outro_ms = max(intro_ms + 3000, round(((total_frames - 75) / fps) * 1000))
    outro_frame = round((outro_ms / 1000) * fps)
    s3_end = outro_frame if outro_frame > s3_start + 30 else total_frames

    # 3. Presenter.tsx
    if is_duo:
        pres_code = f"""import React from "react";
import {{ DuoPresenter, DuoSpeakerSegment }} from "../../components/DuoPresenter";
import speakerSegmentsRaw from "./speaker_segments.json";

interface PresenterProps {{
  currentMs: number;
}}

const speakerSegments: DuoSpeakerSegment[] = speakerSegmentsRaw as DuoSpeakerSegment[];

export const {pascal_name}Presenter: React.FC<PresenterProps> = ({{ currentMs }}) => {{
  return (
    <DuoPresenter
      currentMs={{currentMs}}
      segments={{speakerSegments}}
      baseHeight={{1280}}
      showBadge={{true}}
    />
  );
}};
"""
    else:
        pres_code = f"""import React from "react";
import {{ spring, useCurrentFrame, useVideoConfig }} from "remotion";
import {{ CharacterKeyframeAnimator, KeyframePoint }} from "../../components/CharacterKeyframeAnimator";
import {{ Zap }} from "lucide-react";

interface PresenterProps {{
  currentMs: number;
}}

export const {pascal_name}Presenter: React.FC<PresenterProps> = ({{ currentMs }}) => {{
  const frame = useCurrentFrame();
  const {{ fps }} = useVideoConfig();

  const keyframes: KeyframePoint[] = [
    {{ timeMs: 0, pose: "fullbody_pointing", scale: 1.0, y: 80, rotate: -1, opacity: 0 }},
    {{ timeMs: 350, pose: "fullbody_pointing", scale: 1.0, y: 0, rotate: 0, opacity: 1 }},
    {{ timeMs: {intro_ms - 600}, pose: "fullbody_pointing", scale: 1.03, y: -4, rotate: 0, opacity: 1 }},
    {{ timeMs: {intro_ms}, pose: "fullbody_pointing", scale: 0.96, y: 90, rotate: 1, opacity: 0 }},
    {{ timeMs: {outro_ms}, pose: "fullbody_open", scale: 0.96, y: 80, rotate: -1, opacity: 0 }},
    {{ timeMs: {outro_ms + 400}, pose: "fullbody_open", scale: 1.0, y: 0, rotate: 0, opacity: 1 }},
    {{ timeMs: {round(duration_sec * 1000)}, pose: "fullbody_open", scale: 1.04, y: -6, rotate: 0, opacity: 1 }},
  ];

  const isIntro = {"false" if illustration_path else f"currentMs >= 0 && currentMs < {intro_ms}"};
  const isFinale = currentMs >= {outro_ms};
  const isPresenterActive = isIntro || isFinale;

  const badgeSpring = spring({{ frame, fps, config: {{ damping: 18, mass: 0.8, stiffness: 110 }} }});
  if (!isPresenterActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col items-center justify-end overflow-hidden">
      <CharacterKeyframeAnimator keyframes={{keyframes}} currentMs={{currentMs}} baseHeight={{1550}} />
    </div>
  );
}};
"""
    (clip_dir / "Presenter.tsx").write_text(pres_code, encoding="utf-8")

    accent_choice = "cyan" if niche == "health" else ("emerald" if niche == "finance" else "blue")

    # 4. Canvas.tsx with Speech-Synchronized Sequential Reveals
    # Build Scene 2 points JSX
    s2_points_jsx = []
    s2_spring_defs = []
    sfx_cues = [
        {"frame": 0, "type": "whoosh_deep", "volume": 0.32},
        {"frame": f_c1_cutout, "type": "impact_hit", "volume": 0.24},
        {"frame": s2_start, "type": "whoosh_fast", "volume": 0.34},
    ]

    # 4a. Tactical Meme Integration (< 2.5s Strict Retention Cap, Muted, 1.4x Fast-Forward)
    meme_jsx = ""
    if meme_meta:
        m_id = meme_meta.get("id", "side_eye_dog")
        m_dur = min(meme_meta.get("default_duration_frames", 45), 66)
        m_start = max(18, min(f_c1_cutout - 8, 28))
        m_speed = meme_meta.get("playback_rate", 1.4)
        m_label = meme_meta.get("hud_label", "REACTION PROTOCOL // 01")
        m_sfx = meme_meta.get("recommended_sfx", "whoosh_fast")
        m_theme = "dark_obsidian" if niche in ("finance", "facecam") else ("cyber_cyan" if niche == "health" else "apple_studio")

        sfx_cues.append({"frame": m_start, "type": m_sfx, "volume": 0.32})
        sfx_cues.append({"frame": m_start + m_dur, "type": "click", "volume": 0.22})

        meme_jsx = f"""
      {{/* ======================================================== */}}
      {{/* TACTICAL RETENTION MEME POP (< 2.5s Strict Cap)          */}}
      {{/* ======================================================== */}}
      <TacticalMemeCard
        memeId="{m_id}"
        startFrame={{{m_start}}}
        durationFrames={{{m_dur}}}
        playbackRate={{{m_speed}}}
        hudLabel="{m_label}"
        theme="{m_theme}"
        position="top"
      />
"""

    # 4b. Interactive Engagement Pill (Seconds 18–22 / ~70% timeline to boost likes and comments)
    pill_entrance = round(total_frames * 0.70)
    if pill_entrance < s2_start + 45:
        pill_entrance = s2_start + 45
    if pill_entrance > total_frames - 90:
        pill_entrance = max(s2_start + 20, total_frames - 120)

    pill_prompt = generate_engagement_pill_text(topic, niche)
    pill_theme = "obsidian" if niche in ("finance", "facecam") else ("biotech_cyan" if niche == "health" else "apple_studio")
    pill_icon = "pin" if niche == "finance" else ("heart" if niche == "health" else "brain")
    pill_tag = "WEALTH CHECK" if niche == "finance" else ("BIO CHECK" if niche == "health" else "COMMUNITY")
    sfx_cues.append({"frame": pill_entrance, "type": "click", "volume": 0.28})

    illustration_beats = []
    s1_subtitle_frame = f_c1_cutout
    if illustration_path:
        s1_words = [w for w in (words_list or []) if round((w.get("start", w.get("startMs", 0)) / 1000) * fps) < s2_start]
        illustration_beats, s1_subtitle_frame = generate_illustration_beats(
            s1_words=s1_words,
            s1_start=s1_start,
            s2_start=s2_start,
            topic=topic,
            hook_text=c1_hook_text,
            problem_text=c1_problem_text,
            accent_color=accent_choice,
            fps=fps
        )
        for b in illustration_beats:
            if b["type"] == "callout":
                sfx_cues.append({"frame": b["frame"], "type": "whoosh_fast", "volume": 0.28})
                sfx_cues.append({"frame": b["frame"], "type": "click", "volume": 0.24})
            elif b["type"] == "stamp":
                sfx_cues.append({"frame": b["frame"], "type": "impact_hit", "volume": 0.32})

    for idx, pt in enumerate(s2_items):
        p_frame = pt["startFrame"]
        p_text = pt["text"]
        clean_text = re.sub(r"^(\d+[\.\)]\s*|[-*]\s*)", "", p_text).strip()
        parts = clean_text.split(":", 1) if ":" in clean_text else [clean_text]
        p_title = parts[0].strip()
        p_desc = parts[1].strip() if len(parts) > 1 else ""

        s2_spring_defs.append(f'const spP{idx+1} = spring({{ frame: frame - {p_frame}, fps, config: {{ damping: 13, stiffness: 140 }} }});')
        sfx_cues.append({"frame": p_frame, "type": "click", "volume": 0.26})

        s2_points_jsx.append(f"""
                {{/* Progressive Item {idx+1} (Spoken Frame: {p_frame}) */}}
                <div
                  style={{{{
                    opacity: frame >= {p_frame} ? Math.min(1, spP{idx+1} * 1.2) : 0,
                    transform: `scale(${{frame >= {p_frame} ? interpolate(spP{idx+1}, [0, 1], [0.8, 1]) : 0.8}}) translateY(${{frame >= {p_frame} ? interpolate(spP{idx+1}, [0, 1], [25, 0]) : 25}}px)`,
                    pointerEvents: frame >= {p_frame} ? "auto" : "none",
                  }}}}
                >
                  <div className="{item_box}">
                    <div className="flex items-center gap-4">
                      <div className="{pill_box}">
                        0{idx+1}
                      </div>
                      <div>
                        <div className="text-3xl font-black {text_color}">
                          {p_title}
                        </div>
                        {f'<div className="{sub_pill} mt-0.5">{p_desc}</div>' if p_desc else ''}
                      </div>
                    </div>
                  </div>
                </div>""")

    # Scene 3 points:
    s3_c1 = s3_items[0]
    s3_c2 = s3_items[1] if len(s3_items) > 1 else s3_items[0]
    f_s3_cutout = s3_c1["startFrame"]
    f_s3_finale = s3_c2["startFrame"]
    sfx_cues.append({"frame": f_s3_cutout, "type": "whoosh_sparkle", "volume": 0.32})
    sfx_cues.append({"frame": f_s3_finale, "type": "impact_hit", "volume": 0.28})
    s3_impact_ms = round((s3_start / fps) * 1000)
    if product_meta:
        prod_stem = Path(product_meta["pdf_name"]).stem.upper()
        scene3_content_jsx = f"""{{frame >= {s3_start} && frame < {s3_end} && (
        <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
          <ProductPageShowcase
            imageSrc="{product_meta['public_path']}"
            pageNum={{{product_meta['page']}}}
            productName="{prod_stem} BLUEPRINT"
            accentColor="{accent_choice}"
            entranceFrame={{{s3_start}}}
            badgeLabel="OFFICIAL WORKSHEET PROTOCOL"
            width={{880}}
            height={{1080}}
          />
        </div>
      )}}"""
    else:
        scene3_content_jsx = f"""{{frame >= {s3_start} && frame < {s3_end} && (() => {{
        const spSolCutout = spring({{ frame: frame - {f_s3_cutout}, fps, config: {{ damping: 13, stiffness: 140 }} }});
        const spFinale = spring({{ frame: frame - {f_s3_finale}, fps, config: {{ damping: 13, stiffness: 140 }} }});

        return (
          <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
            <div className="relative w-full max-w-[920px]">
              <div className="absolute -top-7 left-8 z-30 pointer-events-none">
                <TapeStrip position="top-left" width={{180}} height={{48}} enableWobble />
              </div>

              <PhysicalCard
                tiltX={{3}}
                tiltY={{-3}}
                elevation={{45}}
                impactMs={{{s3_impact_ms}}}
                className="{card_class}"
              >
                <h3 className="text-5xl font-black {text_color} leading-tight mt-1">
                  {s3_c1["text"]}
                </h3>

                <div
                  className="w-full flex justify-center items-center my-2 transition-all"
                  style={{{{
                    opacity: frame >= {f_s3_cutout} ? Math.min(1, spSolCutout * 1.2) : 0,
                    transform: `scale(${{frame >= {f_s3_cutout} ? interpolate(spSolCutout, [0, 1], [0.6, 1]) : 0.6}}) translateY(${{frame >= {f_s3_cutout} ? interpolate(spSolCutout, [0, 1], [30, 0]) : 30}}px)`,
                    pointerEvents: frame >= {f_s3_cutout} ? "auto" : "none",
                  }}}}
                >
                  <ProCutout
                    assetId="{solution_cutout}"
                    glowColor="{glow_solution}"
                    animation="stamp_impact"
                    width={{420}}
                    height={{320}}
                    ghostText="REWIRE"
                  />
                </div>

                <div
                  className="w-full transition-all"
                  style={{{{
                    opacity: frame >= {f_s3_finale} ? Math.min(1, spFinale * 1.2) : 0,
                    transform: `scale(${{frame >= {f_s3_finale} ? interpolate(spFinale, [0, 1], [0.8, 1]) : 0.8}})`,
                    pointerEvents: frame >= {f_s3_finale} ? "auto" : "none",
                  }}}}
                >
                  <div className="w-full p-5 rounded-2xl bg-black/60 border border-emerald-500/30 flex items-center justify-center gap-3 text-3xl font-black {accent_color} shadow-xl">
                    <Sparkles className="w-7 h-7 text-emerald-400 shrink-0" />
                    <span>{s3_c2["text"]}</span>
                  </div>
                </div>
              </PhysicalCard>
            </div>
          </div>
        );
      }})()}}"""
    s2_spring_str = "\n        ".join(s2_spring_defs)
    s2_points_str = "".join(s2_points_jsx)

    if illustration_path:
        s1_impact_ms = round((s1_start / fps) * 1000)
        beats_json = json.dumps(illustration_beats, indent=12)
        scene1_content_jsx = f"""{{frame >= {s1_start} && frame < {s2_start} && (
        <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
          <CinematicIllustrationCard
            imageSrc="{illustration_path}"
            title="{c1_hook_text}"
            subtitle="{c1_problem_text}"
            badgeLabel="COGNITIVE DIAGNOSTIC // 01"
            accentColor="{accent_choice}"
            entranceFrame={{{s1_start}}}
            subtitleFrame={{{s1_subtitle_frame}}}
            beats={{{beats_json}}}
            width={{920}}
            height={{520}}
            tiltX={{3}}
            tiltY={{-3}}
          />
        </div>
      )}}"""
    else:
        scene1_content_jsx = f"""{{frame >= {s1_start} && frame < {s2_start} && (() => {{
        const spCutout = spring({{ frame: frame - {f_c1_cutout}, fps, config: {{ damping: 13, stiffness: 140 }} }});
        const spMetric = spring({{ frame: frame - {f_c1_metric}, fps, config: {{ damping: 13, stiffness: 140 }} }});

        return (
          <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
            <div className="relative w-full max-w-[920px]">
              <div className="absolute -top-7 right-8 z-30 pointer-events-none">
                <TapeStrip position="top-right" width={{180}} height={{48}} enableWobble />
              </div>

              <PhysicalCard
                tiltX={{4}}
                tiltY={{-4}}
                elevation={{45}}
                impactMs={{{round((s1_start/fps)*1000)}}}
                className="{card_class}"
              >
                {{/* Hero Hook Title */}}
                <h1 className="text-5xl font-black {text_color} leading-tight tracking-tight max-w-[840px] mt-2">
                  {c1_hook_text}
                </h1>

                {{/* Cutout Hero Prop — Revealed on Speech Frame {f_c1_cutout} */}}
                <div
                  className="w-full flex justify-center items-center my-3 transition-all"
                  style={{{{
                    opacity: frame >= {f_c1_cutout} ? Math.min(1, spCutout * 1.2) : 0,
                    transform: `scale(${{frame >= {f_c1_cutout} ? interpolate(spCutout, [0, 1], [0.6, 1]) : 0.6}}) translateY(${{frame >= {f_c1_cutout} ? interpolate(spCutout, [0, 1], [30, 0]) : 30}}px)`,
                    pointerEvents: frame >= {f_c1_cutout} ? "auto" : "none",
                  }}}}
                >
                  <ProCutout
                    assetId="{problem_cutout}"
                    glowColor="{glow_problem}"
                    animation="stamp_impact"
                    width={{420}}
                    height={{320}}
                    ghostText="THE TRAP"
                  />
                </div>

                {{/* Diagnostic Status Bar — Revealed on Speech Frame {f_c1_metric} */}}
                <div
                  className="w-full transition-all"
                  style={{{{
                    opacity: frame >= {f_c1_metric} ? Math.min(1, spMetric * 1.2) : 0,
                    transform: `scale(${{frame >= {f_c1_metric} ? interpolate(spMetric, [0, 1], [0.8, 1]) : 0.8}})`,
                    pointerEvents: frame >= {f_c1_metric} ? "auto" : "none",
                  }}}}
                >
                  <div className="{status_box}">
                    <span className="flex items-center gap-2.5">
                      <Zap className="w-6 h-6 text-amber-400" />
                      <span>{c1_problem_text[:35]}</span>
                    </span>
                    <span className="{status_alert}">CRITICAL DIAGNOSTIC</span>
                  </div>
                </div>
              </PhysicalCard>
            </div>
          </div>
        );
      }})()}}"""

    canvas_container_class = (
        "absolute inset-0 w-full h-full flex flex-col items-center justify-start pt-[10%] p-8 select-none"
        if is_duo
        else "absolute inset-0 w-full h-full flex flex-col items-center justify-center p-8 select-none"
    )

    canvas_code = f"""import React from "react";
import {{ useCurrentFrame, useVideoConfig, spring, interpolate }} from "remotion";
import {{ PhysicalCard }} from "../../components/physics/PhysicalCard";
import {{ TapeStrip }} from "../../components/collage/TapeStrip";
import {{ ProCutout }} from "../../components/ProCutout";
import {{ ProductPageShowcase }} from "../../components/ProductPageShowcase";
import {{ CinematicIllustrationCard }} from "../../components/CinematicIllustrationCard";
import {{ InteractiveEngagementPill }} from "../../components/InteractiveEngagementPill";
import {{ TacticalMemeCard }} from "../../components/TacticalMemeCard";
import {{ Sparkles, Zap, ArrowRight }} from "lucide-react";
import {{ WordTimestamp }} from "../../types";

interface CanvasProps {{
  transcript: WordTimestamp[];
}}

export const {pascal_name}Canvas: React.FC<CanvasProps> = () => {{
  const frame = useCurrentFrame();
  const {{ fps }} = useVideoConfig();

  return (
    <div className="{canvas_container_class}">
      {meme_jsx}

      {{/* ======================================================== */}}
      {{/* SCENE 1: THE ROOT FRICTION & HOOK (Frames {s1_start} - {s2_start}) */}}
      {{/* ======================================================== */}}
      {scene1_content_jsx}

      {{/* ======================================================== */}}
      {{/* SCENE 2: THE BREAKDOWN (REVEALED ONE-BY-ONE AS SPOKEN!)  */}}
      {{/* (Frames {s2_start} - {s3_start})                          */}}
      {{/* ======================================================== */}}
      {{frame >= {s2_start} && frame < {s3_start} && (() => {{
        {s2_spring_str}

        return (
          <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
            <div className="relative w-full max-w-[920px]">
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                <TapeStrip position="center-top" width={{180}} height={{48}} enableWobble />
              </div>

              <PhysicalCard
                tiltX={{-5}}
                tiltY={{4}}
                elevation={{44}}
                impactMs={{{round((s2_start/fps)*1000)}}}
                className="{card_class}"
              >
                {{/* Clean Uncrowded Section Header */}}
                <div className="text-center mt-1">
                  <h2 className="text-5xl font-black {text_color} leading-tight">
                    {topic}
                  </h2>
                  <div className="text-2xl font-mono {accent_color} font-bold mt-1 tracking-wider uppercase">
                    Core Principles & Breakdown
                  </div>
                </div>

                {{/* PROGRESSIVE SEQUENTIAL REVEALS: ONE BY ONE ON EXACT WORDS */}}
                <div className="flex flex-col gap-4 w-full my-1">
                  {s2_points_str}
                </div>
              </PhysicalCard>
            </div>
          </div>
        );
      }})()}}

      {{/* ======================================================== */}}
      {{/* SCENE 3: SOLUTION PROTOCOL / PRODUCT SHOWCASE (Frames {s3_start} - {s3_end}) */}}
      {{/* ======================================================== */}}
      {scene3_content_jsx}

      {{/* ======================================================== */}}
      {{/* ON-SCREEN INTERACTIVE ENGAGEMENT PILL (Seconds 18–22)    */}}
      {{/* ======================================================== */}}
      <InteractiveEngagementPill
        entranceFrame={{{pill_entrance}}}
        durationFrames={{105}}
        prompt="{pill_prompt}"
        tag="{pill_tag}"
        icon="{pill_icon}"
        theme="{pill_theme}"
      />
    </div>
  );
}};
"""
    (clip_dir / "Canvas.tsx").write_text(canvas_code, encoding="utf-8")

    # 5. index.tsx with Multi-Layered Sound Design
    sfx_json = json.dumps(sfx_cues, indent=2)

    idx_code = f"""import React from "react";
import {{ Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig }} from "remotion";
import {{ {pascal_name}Background }} from "./Background";
import {{ {pascal_name}Canvas }} from "./Canvas";
import {{ {pascal_name}Presenter }} from "./Presenter";
import {{ AppleProgressBar }} from "../../components/AppleProgressBar";
import {{ AppleKineticCaptions }} from "../../components/AppleKineticCaptions";
import {{ SoundDesignEngine, SfxCue }} from "../../components/SoundDesignEngine";
import {{ {pascal_name}Thumbnail }} from "../../thumbnails";
import rawTranscript from "./transcript.json";
import {{ WordTimestamp }} from "../../types";
import "../../style.css";

const transcript: WordTimestamp[] = (rawTranscript as any[]).map((t) => ({{
  word: t.word,
  startMs: t.startMs ?? t.start,
  endMs: t.endMs ?? t.end,
  speaker: t.speaker,
}}));

// Multi-SFX audio cues synchronized with progressive visual reveals
const SFX_CUES: SfxCue[] = {sfx_json};

export const {pascal_name}Composition: React.FC = () => {{
  const {{ width, height, fps, durationInFrames }} = useVideoConfig();
  const frame = useCurrentFrame();
  const currentMs = (frame / fps) * 1000;

  return (
    <div
      className="relative w-full h-full bg-[#fbfbfd] text-slate-900 flex flex-col justify-between overflow-hidden select-none font-sans"
      style={{{{ width, height }}}}
    >
      {{/* 0. High-Converting 4K Thumbnail First-Frame */}}
      {{frame === 0 && (
        <div className="absolute inset-0 w-full h-full z-50 pointer-events-none">
          <{pascal_name}Thumbnail />
        </div>
      )}}

      {{/* 1. Voiceover Audio Track */}}
      <Audio src={{staticFile("{name}/voiceover.mp3")}} volume={{1.3}} />

      {{/* 2. Ducked Background Ambient Music */}}
      <Audio
        src={{staticFile("audio/bgm/monume-documentary-documentary-music-547923.mp3")}}
        volume={{(f) =>
          interpolate(
            f,
            [0, 25, durationInFrames - 35, durationInFrames],
            [0, 0.12, 0.12, 0],
            {{ extrapolateLeft: "clamp", extrapolateRight: "clamp" }}
          )
        }}
        loop
      />

      {{/* 3. Rich Layered Sound Design Engine */}}
      <SoundDesignEngine cues={{SFX_CUES}} />

      {{/* 4. Top Apple Progress Bar */}}
      <AppleProgressBar />

      {{/* 5. Niche Living Background */}}
      <{pascal_name}Background />

      {{/* 6. Speech-Synchronized Progressive Reveal Canvas */}}
      <{pascal_name}Canvas transcript={{transcript}} />

      {{/* 7. Multi-Pose Character Presenter */}}
      <{pascal_name}Presenter currentMs={{currentMs}} />

      {{/* 8. Kinetic Captions with Neon Apple Glow */}}
      <AppleKineticCaptions transcript={{transcript}} />
    </div>
  );
}};
"""
    (clip_dir / "index.tsx").write_text(idx_code, encoding="utf-8")
    print(f"      Scaffolded 4 speech-synchronized clip components in src/clips/{name}/")
    return pascal_name


def register_composition_and_thumbnail(name: str, pascal_name: str, topic: str, format_type: str, niche: str = 'self_improvement', pinned_comment: str = None, script_text: str = None):
    root_file = ROOT_DIR / "src" / "Root.tsx"
    thumb_file = ROOT_DIR / "src" / "thumbnails" / "index.tsx"
    render_script = ROOT_DIR / "scripts" / "render_all_thumbnails.js"
    meta_file = ROOT_DIR / "studio" / "metadata.json"

    # Register in Root.tsx if not already there
    root_content = root_file.read_text(encoding="utf-8")
    if f"{pascal_name}Composition" not in root_content:
        import_stmt = f'import {{ {pascal_name}Composition }} from "./clips/{name}";\nimport {name}Transcript from "./clips/{name}/transcript.json";\n'
        root_content = root_content.replace('import { PromisesComposition }', f'{import_stmt}import {{ PromisesComposition }}')
        root_content = root_content.replace('PromisesThumbnail,', f'PromisesThumbnail,\n  {pascal_name}Thumbnail,')
        
        comp_code = f"""
  const {name}Duration = calculateDurationInFrames({name}Transcript as any[], fps);"""
        root_content = root_content.replace('const promisesDuration', f'{comp_code}\n  const promisesDuration')

        jsx_comp = f"""
      <Composition
        id="{pascal_name}Video"
        component={{{pascal_name}Composition}}
        durationInFrames={{{name}Duration}}
        fps={{fps}}
        width={{{1080 if format_type == "shorts" else 1920}}}
        height={{{1920 if format_type == "shorts" else 1080}}}
      />"""
        root_content = root_content.replace('{/* 0. Broken Promises', f'{jsx_comp}\n\n      {{/* 0. Broken Promises')

        jsx_still = f"""
      <Still
        id="{pascal_name}Thumbnail"
        component={{{pascal_name}Thumbnail}}
        width={{{1080 if format_type == "shorts" else 1920}}}
        height={{{1920 if format_type == "shorts" else 1080}}}
      />"""
        root_content = root_content.replace('</>\n  );', f'{jsx_still}\n    </>\n  );')
        root_file.write_text(root_content, encoding="utf-8")
        print("      Registered composition and still in src/Root.tsx")

    # Register in thumbnails/index.tsx
    thumb_content = thumb_file.read_text(encoding="utf-8")
    if f"{pascal_name}Thumbnail" not in thumb_content:
        clean_title = clean_thumbnail_title(topic)
        highlight = clean_title.split()[0] if clean_title.split() else "TRUTH"

        # Channel specific styling - strictly pure themes and badges, NEVER page numbers or PDF names!
        if niche == "facecam":
            cat_badge = "BUILD TO SCALE • FACECAM"
            extra_badge = "STARTUP"
            theme = "obsidian"
            sub = "Creator Breakdown & Business Secrets"
        elif niche == "finance":
            cat_badge = "APEX WEALTH • FINANCE"
            extra_badge = "WEALTH"
            theme = "obsidian"
            sub = "Wealth Compounding & Early Adult Strategy"
        elif niche == "health":
            cat_badge = "BIOMATRIX • HEALTH"
            extra_badge = "BIOHACK"
            theme = "biotech_cyan"
            sub = "Biological Reset & Cellular Protocol"
        else:
            cat_badge = "JUDY INSIGHTS • PSYCHOLOGY"
            extra_badge = "MINDSET"
            theme = "apple_studio"
            sub = "High-Retention Psychology Breakdown"

        thumb_decl = f"""
export const {pascal_name}Thumbnail: React.FC = () => (
  <ThumbnailCard
    title="{clean_title}"
    highlightWord="{highlight}"
    highlightColor="rose"
    subtitle="{sub}"
    categoryBadge="{cat_badge}"
    characterPose="character_pointing.png"
    theme="{theme}"
    aspectRatio="{ "9:16" if format_type == "shorts" else "16:9" }"
    extraBadge="{extra_badge}"
  />
);
"""
        thumb_content += thumb_decl
        thumb_file.write_text(thumb_content, encoding="utf-8")
        print("      Registered thumbnail component in src/thumbnails/index.tsx")

    # Register in render_all_thumbnails.js
    render_content = render_script.read_text(encoding="utf-8")
    if f"{name}_video.mp4" not in render_content:
        render_content = render_content.replace(
            "'promises_video.mp4': 'PromisesThumbnail',",
            f"'promises_video.mp4': 'PromisesThumbnail',\n  '{name}_video.mp4': '{pascal_name}Thumbnail',"
        )
        render_script.write_text(render_content, encoding="utf-8")

    # Add metadata
    if meta_file.exists():
        try:
            meta = json.loads(meta_file.read_text(encoding="utf-8"))
            final_pinned = pinned_comment or generate_pinned_comment(topic=topic, niche=niche, hook_text=topic, script_text=script_text or "")
            meta[f"{name}_video.mp4"] = {
                "topic": name,
                "title": f"{topic} 🧠 #{'Shorts' if format_type == 'shorts' else 'Masterclass'}",
                "description": f"{topic} — Psychological breakdown of mental models, habit loops, and identity shifts.\n\n#Shorts #Psychology #Mindset #SelfImprovement",
                "tags": ["Shorts", "Psychology", "Mindset", topic, "Self Improvement"],
                "categoryId": "27",
                "privacyStatus": "public",
                "pinnedComment": final_pinned
            }
            meta_file.write_text(json.dumps(meta, indent=2, ensure_ascii=False), encoding="utf-8")
            print("      Added metadata to studio/metadata.json")
            print(f"\n💬 [Suggested High-Retention Pinned Comment]:")
            print(f"   \"{final_pinned}\"\n")
        except Exception as e:
            print(f"      Metadata warning: {e}")

def render_assets(name: str, pascal_name: str):
    print("🎥 [4/4] Rendering 4K Thumbnail & MP4 Video...")
    out_thumb = f"out/{name}_video_thumbnail.png"
    out_video = f"out/{name}_video.mp4"
    (ROOT_DIR / "out").mkdir(parents=True, exist_ok=True)

    npx_bin = "npx.cmd" if sys.platform == "win32" else "npx"
    gl_flag = "--gl=egl" if sys.platform != "win32" else "--gl=angle"

    # 1. Render Thumbnail
    print(f"      Rendering Still (GPU): {pascal_name}Thumbnail -> {out_thumb}...")
    subprocess.run(
        f"{npx_bin} remotion still src/index.ts {pascal_name}Thumbnail {out_thumb} {gl_flag} --overwrite",
        shell=True,
        cwd=str(ROOT_DIR),
        check=True
    )

    # 2. Render Video with GPU acceleration
    print(f"      Rendering Video (GPU accelerated): {pascal_name}Video -> {out_video}...")
    subprocess.run(
        f"{npx_bin} remotion render src/index.ts {pascal_name}Video {out_video} {gl_flag} --concurrency=4 --overwrite",
        shell=True,
        cwd=str(ROOT_DIR),
        check=True
    )
    print(f"\n🎉 Video & 4K Thumbnail successfully created in {out_video} & {out_thumb}!")

async def main():
    parser = argparse.ArgumentParser(description="RightClips Autonomous Video Engine")
    parser.add_argument("--name", required=True, help="Clip identifier (e.g. discipline)")
    parser.add_argument("--topic", default=None, help="Display title / topic")
    parser.add_argument("--script", default=None, help="Voiceover script text (or topic can auto-generate it)")
    parser.add_argument("--format", choices=["shorts", "longform"], default="shorts")
    parser.add_argument("--voice", default="en-US-AvaMultilingualNeural")
    parser.add_argument("--product", default=None, help="Product PDF filename (e.g. Photon.pdf)")
    parser.add_argument("--product-page", type=int, default=None, help="Exact PDF page number to show (e.g. 14)")
    parser.add_argument("--facecam", default=None, help="Path to creator facecam video file")
    parser.add_argument("--video", default=None, help="Alias for --facecam")
    parser.add_argument("--style", default=None, choices=["self_improvement", "finance", "health", "facecam"], help="Explicit editing style override")
    parser.add_argument("--meme", default=None, help="Meme ID override (e.g. side_eye_dog) or 'auto'")
    parser.add_argument("--no-meme", action="store_true", help="Disable Tactical Meme pop (memes are enabled by default)")
    parser.add_argument("--illustration", default=None, help="Relative or absolute path to generated painterly illustration for Scene 1 (e.g. test_motion_illustration/assets/scene_illustration.png)")
    parser.add_argument("--no-render", action="store_true", help="Skip final MP4/PNG render")

    args = parser.parse_args()
    
    raw_script = args.script
    raw_topic = args.topic or ""

    # Check for {no meta} tag across inputs
    has_no_meta = bool(re.search(r"\{\s*no\s*meta\s*\}", f"{raw_topic} {raw_script or ''} {args.name}", re.IGNORECASE))

    # Check for duo mode across inputs
    raw_combined = f"{raw_topic} {raw_script or ''} {args.name}".lower()
    is_duo = args.duo or bool(re.search(r"\{\s*duo\s*\}", raw_combined, re.IGNORECASE)) or (
        bool(re.search(r"(?:^|\s+)judy\s*:", raw_combined, re.IGNORECASE)) and
        bool(re.search(r"(?:^|\s+)andrew\s*:", raw_combined, re.IGNORECASE))
    )

    # If no script provided, autonomously generate it from topic
    if not raw_script and raw_topic:
        print(f"✍️  [Scriptwriter] No script provided. Autonomously generating script for topic: '{raw_topic}' (Duo: {is_duo})...")
        gen_res = generate_script_and_metadata(raw_topic, duo=is_duo)
        raw_script = gen_res["formatted_output"]
        if gen_res.get("is_duo"):
            is_duo = True
        print(f"      Generated Mode {gen_res['mode']} script ({gen_res['word_count']} words)")
    elif not raw_script:
        raise ValueError("Must provide either --script or --topic to generate a video!")

    # Parse [METADATA] and [VOICEOVER] blocks if present
    meta_pdf, meta_page, meta_title, vo_text, script_pinned_comment = parse_script_blocks(raw_script)

    # Check again if parsed vo_text has dialogue turns
    if not is_duo and vo_text:
        vo_lower = vo_text.lower()
        if bool(re.search(r"(?:^|\s+)judy\s*:", vo_lower)) and bool(re.search(r"(?:^|\s+)andrew\s*:", vo_lower)):
            is_duo = True

    product_pdf = args.product or meta_pdf
    product_page = args.product_page or meta_page

    # If {no meta} was requested, strictly disable product linking
    if has_no_meta:
        product_pdf = None
        product_page = None
        product_meta = None
    else:
        # Also check inline {product: ...} tag
        product_tag_pattern = re.compile(
            r"\{\s*(?:product|pdf)\s*:\s*([^,}]+?)(?:\.pdf)?\s*,\s*page\s*:\s*(\d+)\s*\}",
            re.IGNORECASE,
        )
        tag_match = product_tag_pattern.search(f"{raw_topic} {raw_script}")
        if tag_match:
            if not product_pdf:
                product_pdf = tag_match.group(1).strip()
            if not product_page:
                product_page = int(tag_match.group(2).strip())

        product_meta = None
        if product_pdf and product_page:
            try:
                product_meta = extract_product_page(product_pdf, product_page)
                print(f"📄 [Product] Extracted {product_meta['pdf_name']} Page {product_meta['page']} -> {product_meta['public_path']}")
            except Exception as e:
                print(f"⚠️  [Product] Warning: Failed to extract product page: {e}")

    # Detect channel niche from raw topic & script before sanitizing
    video_source = args.facecam or args.video
    is_facecam = bool(video_source) or "{facecam}" in raw_combined or args.style == "facecam"

    if is_facecam:
        channel_voice = "en-US-AvaMultilingualNeural"
    elif "{finance}" in raw_combined or args.style == "finance":
        channel_voice = "en-US-AndrewMultilingualNeural"
    elif "{health}" in raw_combined or args.style == "health":
        channel_voice = "en-US-BrianMultilingualNeural"
    else:
        channel_voice = "en-US-AvaMultilingualNeural"

    voice_to_use = args.voice if args.voice and args.voice != "en-US-AvaMultilingualNeural" else channel_voice

    clean_script = sanitize_tags(vo_text)
    clean_topic = sanitize_topic(args.topic) if args.topic else None

    # Audit script hygiene
    is_valid, issues = check_script_hygiene(clean_script, is_mode_a=bool(product_meta))
    if not is_valid:
        print("⚠️  [Script Hygiene Advisory]:")
        for iss in issues:
            print(f"      - {iss}")

    name = sanitize_tags(args.name)
    name = re.sub(r"[^a-z0-9_]+", "_", name.lower()).strip("_")
    topic = clean_topic or name.replace("_", " ").title()
    
    # Determine niche string
    raw_niche_check = f"{raw_topic} {raw_script}".lower()
    if is_facecam:
        detected_niche = "facecam"
    elif "{finance}" in raw_niche_check or args.style == "finance":
        detected_niche = "finance"
    elif "{health}" in raw_niche_check or args.style == "health":
        detected_niche = "health"
    else:
        detected_niche = "self_improvement"

    audio_path = ROOT_DIR / "public" / name / "voiceover.mp3"
    transcript_path = ROOT_DIR / "src" / "clips" / name / "transcript.json"

    # Step 1: Audio setup (Extract from facecam, Synthesize Conversational Duo, or Standard TTS)
    if is_facecam and video_source:
        import shutil
        print(f"🎬 [1/4] Extracting native voice audio from video: {video_source}...")
        audio_path.parent.mkdir(parents=True, exist_ok=True)
        dest_video = ROOT_DIR / "public" / name / "facecam.mp4"
        shutil.copy2(str(video_source), str(dest_video))
        cmd = [
            "ffmpeg", "-y", "-i", str(video_source),
            "-vn", "-ar", "44100", "-ac", "2", "-b:a", "192k",
            str(audio_path)
        ]
        subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print(f"      Native master audio saved to: {audio_path}")
        print(f"      Facecam video saved to: {dest_video}")
        words, duration_sec = transcribe_audio(audio_path, transcript_path)
    elif is_duo:
        print(f"🎙️ [1/4] Synthesizing Conversational Duo speech (Judy & Andrew)...")
        words, turn_timings, duration_sec = await process_dialogue(vo_text or clean_script, name, root_dir=ROOT_DIR)
    else:
        await synthesize_speech(clean_script, audio_path, voice_to_use)
        words, duration_sec = transcribe_audio(audio_path, transcript_path)

    # Step 3: Scaffold & Register
    # Resolve tactical retention meme (DEFAULT ENABLED unless {no meme}, {no memes}, or --no-meme)
    has_no_meme = (
        args.no_meme
        or bool(re.search(r"\{\s*no\s*memes?\s*\}", raw_combined, re.IGNORECASE))
        or (args.meme and args.meme.lower() in ("none", "false", "no", "off", "disable", "disabled"))
    )

    explicit_meme = args.meme
    has_explicit_meme_tag = bool(re.search(r"\{\s*meme\s*:\s*([a-zA-Z0-9_\-]+)\s*\}", raw_combined, re.IGNORECASE))
    if not explicit_meme and has_explicit_meme_tag:
        tag_m = re.search(r"\{\s*meme\s*:\s*([a-zA-Z0-9_\-]+)\s*\}", raw_combined, re.IGNORECASE)
        if tag_m:
            explicit_meme = tag_m.group(1)

    meme_match = None
    if not has_no_meme:
        from meme_matcher import find_best_meme
        target_meme_id = explicit_meme if (explicit_meme and explicit_meme != "auto") else None
        meme_match = find_best_meme(
            raw_topic,
            clean_script,
            explicit_meme_id=target_meme_id
        )
        if meme_match:
            override_str = f" (explicit override: {explicit_meme})" if target_meme_id else " (DEFAULT auto-matched)"
            print(f"🎭 [Meme Engine] Tactical retention meme enabled{override_str}: '{meme_match['name']}' ({meme_match['id']})")
            print(f"      Duration: {meme_match['default_duration_frames']} frames (< 2.5s cap), Speed: {meme_match['playback_rate']}x, SFX: {meme_match['recommended_sfx']}")
    else:
        print(f"🔇 [Meme Engine] Tactical meme disabled via {{no meme}} / --no-meme.")

    illustration_path = args.illustration
    if not illustration_path:
        possible_locs = [
            ROOT_DIR / "public" / name / "assets" / "scene_illustration.png",
            ROOT_DIR / "public" / name / "scene_illustration.png",
        ]
        for p in possible_locs:
            if p.exists():
                illustration_path = str(p.relative_to(ROOT_DIR / "public"))
                print(f"🎨 [Illustration] Found bespoke scene illustration: {illustration_path}")
                break

    pascal_name = scaffold_clip_files(
        name, topic, args.format, duration_sec, clean_script, words, product_meta,
        illustration_path=illustration_path, pinned_comment=script_pinned_comment, is_duo=is_duo,
        meme_meta=meme_match
    )
    register_composition_and_thumbnail(name, pascal_name, topic, args.format, detected_niche, pinned_comment=script_pinned_comment, script_text=clean_script)

    # Step 4: Render
    if not args.no_render:
        render_assets(name, pascal_name)

if __name__ == "__main__":
    asyncio.run(main())
