#!/usr/bin/env python3
"""
RightMotion Master CLI Generator
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
from script_intelligence import ScriptIntelligence
from orchestrator import CreativeOrchestrator
from geometry_resolver import GeometryResolver, ActorBounds

def sanitize_tags(text: str) -> str:
    if not text:
        return ""
    # Strip {Health}, {Finance}, {Self Improvement}, {facecam}, {no topics}, {no meta}, {meta}, {no meme}, {andrew}, {duo}, {meme: ...}, and product tags
    pattern = re.compile(
        r"\{\s*(?:health|finance|self\s*improv?ement|facecam|no\s*topics?|no\s*meta|meta|no\s*memes?|no\s*stickers?|andrew|duo|meme(?:\s*:\s*[^}]+)?|sticker(?:\s*:\s*[^}]+)?|(?:product|pdf)\s*:\s*[^,}]+,\s*page\s*:\s*\d+)\s*\}",
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
    text = re.sub(r"^topic\s*[:\-_–—]\s*", "", text, flags=re.IGNORECASE).strip()
    text = re.sub(r"^topic\s+", "", text, flags=re.IGNORECASE).strip()
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

def split_body_and_closing_question(text: str) -> Tuple[str, str]:
    """
    Separates the main narrative from the final reflective question.
    """
    clean = text.strip()
    sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', clean) if s.strip()]
    if len(sentences) >= 2:
        last = sentences[-1]
        if last.endswith("?") or any(last.lower().startswith(p) for p in ["tell me", "drop your", "drop a", "be honest", "question for you", "what would you", "have you ever"]):
            body = " ".join(sentences[:-1])
            question = last
            return body, question
    return clean, ""

async def synthesize_speech(text: str, output_path: Path, voice: str = "en-US-AvaMultilingualNeural"):
    import edge_tts
    output_path.parent.mkdir(parents=True, exist_ok=True)
    body_text, closing_question = split_body_and_closing_question(text)

    if closing_question:
        print(f"🎙️ [1/4] Synthesizing neural speech with intimate 220ms reflection breath before closing question...")
        work_dir = output_path.parent / "tts_temp"
        work_dir.mkdir(parents=True, exist_ok=True)
        body_raw = work_dir / "body_raw.mp3"
        body_norm = work_dir / "body_norm.mp3"
        q_raw = work_dir / "q_raw.mp3"
        q_norm = work_dir / "q_norm.mp3"
        pause_gap = work_dir / "pause_220ms.mp3"

        # Synthesize body
        comm_b = edge_tts.Communicate(text=body_text.replace("…", ",").replace("...", ","), voice=voice, rate="+8%")
        await comm_b.save(str(body_raw))
        subprocess.run([
            "ffmpeg", "-y", "-i", str(body_raw),
            "-af", "silenceremove=stop_periods=-1:stop_duration=0.18:stop_threshold=-35dB:detection=peak",
            "-ar", "44100", "-ac", "2", "-b:a", "192k", str(body_norm)
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

        # Synthesize closing question
        comm_q = edge_tts.Communicate(text=closing_question.replace("…", ",").replace("...", ","), voice=voice, rate="+6%")
        await comm_q.save(str(q_raw))
        subprocess.run([
            "ffmpeg", "-y", "-i", str(q_raw),
            "-af", "silenceremove=stop_periods=-1:stop_duration=0.18:stop_threshold=-35dB:detection=peak",
            "-ar", "44100", "-ac", "2", "-b:a", "192k", str(q_norm)
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

        # Generate 220ms breath pause gap
        subprocess.run([
            "ffmpeg", "-y", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo",
            "-t", "0.22", "-ar", "44100", "-ac", "2", "-b:a", "192k", str(pause_gap)
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

        # Concat with demuxer
        concat_list = work_dir / "concat.txt"
        concat_list.write_text(f"file '{body_norm.resolve().as_posix()}'\nfile '{pause_gap.resolve().as_posix()}'\nfile '{q_norm.resolve().as_posix()}'\n", encoding="utf-8")
        subprocess.run([
            "ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(concat_list),
            "-c:a", "libmp3lame", "-b:a", "192k", "-ar", "44100", "-ac", "2", str(output_path)
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        print(f"      Seamless master audio saved with 220ms breath pause to: {output_path}")
    else:
        raw_path = output_path.with_name("raw_" + output_path.name)
        print(f"🎙️ [1/4] Synthesizing neural speech with voice '{voice}' (rate=+8% for retention)...")
        norm_text = text.replace("…", ",").replace("...", ",").replace("\r\n", "\n").replace("\n\n", " ").replace("\n", " ").strip()
        communicate = edge_tts.Communicate(text=norm_text, voice=voice, rate="+8%")
        await communicate.save(str(raw_path))

        # Compress pauses > 0.20s
        try:
            cmd = [
                "ffmpeg", "-y", "-i", str(raw_path),
                "-af", "silenceremove=stop_periods=-1:stop_duration=0.20:stop_threshold=-35dB:detection=peak",
                "-ar", "44100", "-ac", "2", "-b:a", "192k",
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

def extract_concept_keyword(script_text: str, topic: str = "", niche: str = "self_improvement") -> Tuple[str, str, str]:
    """
    Extracts the core psychological, financial, or biological concept keyword,
    a short 1-sentence definition, and category badge for ConceptKeywordSlam.
    Returns: (term, definition, category_badge)
    """
    clean_s = re.sub(r"(?:^|\s+)(?:judy|andrew)\s*:\s*", " ", script_text, flags=re.IGNORECASE).strip()
    lower_s = clean_s.lower()

    # Pattern 1: "Psychologists call this [concept]" / "Psychology calls this [concept]"
    m_psych = re.search(r"(?:psychologists?|scientists?|doctors?|researchers?|chronobiologists?|biologists?|neuroscientists?|economists?)\s+call\s+this\s+([a-zA-Z\s\-]+?)(?=[.!,;\?]|\s+when|\s+where|\s+because|$)", clean_s, re.IGNORECASE)
    if m_psych:
        term = m_psych.group(1).strip().upper()
        post_text = clean_s[m_psych.end():].strip(" .!,;—")
        sentences = [s.strip() for s in re.split(r"[.!?]+", post_text) if len(s.strip()) > 10]
        definition = sentences[0] if sentences else "The subconscious mechanism driving this behavioral loop."
        definition = re.sub(r"^and\s+here\'?s\s+the\s+trap\s*[:\-_–—]\s*", "", definition, flags=re.IGNORECASE).strip()
        badge = "PSYCHOLOGICAL MECHANISM // 01" if niche == "self_improvement" else "COGNITIVE FRAMEWORK // 01"
        return (term, definition, badge)

    # Pattern 2: "This is called [concept]" / "Known as [concept]"
    m_called = re.search(r"(?:this is called|known as|termed|it's called)\s+([a-zA-Z\s\-]+?)(?=[.!,;\?]|\s+when|\s+where|\s+because|$)", clean_s, re.IGNORECASE)
    if m_called:
        term = m_called.group(1).strip().upper()
        post_text = clean_s[m_called.end():].strip(" .!,;—")
        sentences = [s.strip() for s in re.split(r"[.!?]+", post_text) if len(s.strip()) > 10]
        definition = sentences[0] if sentences else "The automatic neurological response to environmental friction."
        badge = "NEUROLOGICAL PROTOCOL // 01" if niche == "health" else "CORE MECHANISM // 01"
        return (term, definition, badge)

    # Pattern 3: Domain-specific high-impact concept dictionary
    concept_dict = {
        "identity borrowing": ("IDENTITY BORROWING", "Confusing the rush of being chosen with actual compatibility", "PSYCHOLOGICAL MECHANISM // 01"),
        "dorsal vagal": ("DORSAL VAGAL FREEZE", "Nervous system shutdown response under chronic emotional stress", "AUTONOMIC NERVOUS SYSTEM // 01"),
        "counter-intentional": ("COUNTER-INTENTIONAL LOOP", "Subconsciously self-sabotaging the exact outcomes you desire", "COGNITIVE PARADOX // 01"),
        "dopamine loop": ("DOPAMINE AUTOPILOT", "Compulsive habit loops triggered by environmental micro-cues", "NEUROCHEMICAL PROTOCOL // 01"),
        "hyperbolic discount": ("HYPERBOLIC DISCOUNTING", "Prioritizing immediate relief over exponential long-term capital", "BEHAVIORAL FINANCE // 01"),
        "cortisol spike": ("CORTISOL SPIKE PROTOCOL", "Acute adrenal activation disrupting restorative REM sleep", "CIRCADIAN BIOLOGY // 01"),
        "fear of trying": ("THE FEAR OF TRYING", "Pretending indifference to avoid public evaluation and failure", "EGO DEFENSE MECHANISM // 01"),
        "side character": ("SIDE CHARACTER SYNDROME", "Subconsciously minimizing your presence for others' comfort", "IDENTITY BLUEPRINT // 01"),
    }
    for k, (t, d, b) in concept_dict.items():
        if k in lower_s:
            return (t, d, b)

    # Fallback: Extract from topic / niche via metadata_engine
    try:
        from metadata_engine import synthesize_thumbnail_title
        short_title, highlight, sub = synthesize_thumbnail_title(topic, niche)
    except Exception:
        short_title, sub = topic[:30].upper(), "Core Mechanism & Protocol"

    badge = "COGNITIVE DIAGNOSTIC // 01"
    if niche == "finance":
        badge = "CAPITAL MODEL // 01"
    elif niche == "health":
        badge = "CELLULAR TELEMETRY // 01"
    return (short_title, sub, badge)

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
            "endFrame": round((end_ms / 1000) * fps),
        })

    return aligned


def assert_valid_canvas_scaffold(canvas_code: str, presenter_code: str) -> None:
    """Fail before registration when the scaffold has known TSX ownership errors."""
    export_at = canvas_code.find("export const")
    for component in ("TacticalMemeCard", "TacticalMemeFrame", "MemeStickerOverlay"):
        tag_at = canvas_code.find(f"<{component}")
        if tag_at != -1 and (export_at == -1 or tag_at < export_at):
            raise ValueError(f"Invalid scaffold: {component} JSX was emitted at module scope")
    if "<GlossyJudyIntro" in canvas_code and "<GlossyJudyIntro" in presenter_code:
        raise ValueError("Invalid scaffold: Canvas and Presenter both own GlossyJudyIntro")

def extract_scene_typo_ladders(script_text: str, topic: str = "") -> list:
    """
    Extracts 4 scene-specific 3-tier Kinetic Typographic Ladders from the script text:
      - Line 1 (leadIn): Context lead-in (2-4 words)
      - Line 2 (slamWord): Massive power headline word (1-2 words)
      - Line 3 (punchText): Bounded focus phrase (2-3 words)
    Dynamically parses the actual script sentences so every topic receives bespoke typography!
    """
    cleaned = re.sub(r"^\s*(?:judy|andrew)\s*:\s*", "", script_text, flags=re.IGNORECASE | re.MULTILINE)
    
    # Split on sentence terminals
    raw_sentences = [s.strip() for s in re.split(r'(?<=[.?!])\s+', cleaned) if s.strip()]
    if len(raw_sentences) < 4:
        raw_sentences = [s.strip() for s in re.split(r'[,;:—–]\s+', cleaned) if s.strip()]

    stop_words = {
        "a", "an", "the", "in", "on", "at", "to", "for", "of", "with", "by", "from",
        "up", "about", "into", "over", "after", "is", "are", "was", "were", "be",
        "been", "being", "have", "has", "had", "do", "does", "did", "and", "but",
        "or", "as", "if", "when", "than", "that", "this", "these", "those", "then",
        "so", "what", "which", "who", "whom", "there", "their", "they",
        "you", "your", "we", "our", "he", "his", "she", "her", "it", "its"
    }

    results = []
    default_leads = ["NOTICE HOW YOU", "THE MECHANISM IS", "THE HIDDEN TRAP", "THE PROTOCOL IS"]

    for i in range(4):
        sent = raw_sentences[i] if i < len(raw_sentences) else (raw_sentences[-1] if raw_sentences else (topic or "THE FOCUS"))
        words = [re.sub(r"[^\w\-]", "", w).upper() for w in sent.split() if re.sub(r"[^\w\-]", "", w)]
        content_words = [w for w in words if w.lower() not in stop_words and len(w) > 2]

        if not content_words:
            content_words = words if words else ["FOCUS", "SYSTEM"]

        lead = default_leads[i]
        slam = content_words[0] if len(content_words) >= 1 else "PARADOX"
        punch = " ".join(content_words[1:3]) if len(content_words) >= 3 else (content_words[1] if len(content_words) >= 2 else "DAILY PROTOCOL")

        if len(words) >= 5:
            first_two = " ".join(words[:2])
            for prefix in ["YOUR BRAIN", "YOU PROCRASTINATE", "YOU WAKE", "NOTICE HOW", "WHY YOU", "HEAD HITS", "EARNING MORE", "BREAK THE", "THE FIX"]:
                if first_two.startswith(prefix):
                    lead = first_two
                    slam = content_words[1] if len(content_words) > 1 else content_words[0]
                    punch = " ".join(content_words[2:4]) if len(content_words) >= 4 else (" ".join(content_words[1:3]) if len(content_words) >= 3 else punch)
                    break

        results.append({
            "leadIn": lead,
            "slamWord": slam,
            "punchText": punch or "DAILY PROTOCOL"
        })

    return results


def generate_lean_canvas_brief(
    pascal_name: str,
    s2_start: int,
    s3_start: int,
    total_frames: int,
    topic: str = "",
    niche: str = "self_improvement",
    problem_cutout: str = "",
    solution_cutout: str = "",
    creative_plan: dict = None,
    fps: int = 30,
    product_meta: dict = None,
) -> str:
    """
    Emit a lean Creative Brief Canvas.tsx with ZERO hardcoded visual content.

    The brief encodes:
    - Visual concept mechanism, transformation, and frontier recommendations
    - Frame anchors from transcript timing
    - Semantic cutout asset paths (as options, not prescriptions)
    - Design-first scene prompts — what to COMMUNICATE, not what to RENDER
    - Commented frontier import stubs for the orchestrator's selections

    The agent reads this brief and designs bespoke scenes. No card templates.
    No pre-written JSX. No hardcoded text strings. No default visual objects.
    """
    registry = load_asset_registry()
    p_meta = registry.get(problem_cutout, {})
    s_meta = registry.get(solution_cutout, {})
    p_path = p_meta.get("path", "assets/psychology/tangled_confusion_chaos.png")
    s_path = s_meta.get("path", "assets/psychology/enlightened_mind_insight.png")

    # Extract creative plan fields (graceful fallback when plan is absent)
    vc = {}
    champ = {}
    scene_plans = []
    if creative_plan:
        vc = creative_plan.get("visualConcept", {})
        champ = vc.get("championCandidate", {})
        scene_plans = creative_plan.get("scenePlans", [])

    primary_mechanism = vc.get("primaryMechanism", "semantic_accumulation").upper().replace("_", " ")
    central_transformation = vc.get("centralTransformation", "State A transitions visibly to State B")
    cause_event = vc.get("cause", "")
    visible_consequence = vc.get("visibleConsequence", "")
    persistent_state = vc.get("persistentState", "")
    concept_name = champ.get("conceptName", topic)
    physical_description = champ.get("physicalDescription", "")
    visible_transformation = champ.get("visibleTransformation", "")

    # Scene narrations from plan
    def _narration(scene_id: str) -> str:
        for sp in scene_plans:
            if sp.get("sceneId") == scene_id:
                return sp.get("intent", {}).get("narrationText", "")
        return ""

    hook_narration = _narration("scene_1_hook")
    logic_narration = _narration("scene_2_logic")
    solution_narration = _narration("scene_3_solution")

    # Active frontier codes per scene
    def _frontiers(scene_id: str) -> str:
        for sp in scene_plans:
            if sp.get("sceneId") == scene_id:
                caps = sp.get("activeCapabilities", [])
                entries = [f"{c['frontierCode']} ({c.get('capabilityConcept','')[:40]})" for c in caps if c['frontierCode'] not in ("F_BASE", "F_UBG")]
                return ", ".join(entries) if entries else "F_BASE only"
        return ""

    hook_frontiers = _frontiers("scene_1_hook")
    logic_frontiers = _frontiers("scene_2_logic")
    solution_frontiers = _frontiers("scene_3_solution")

    # Build frontier import stubs from all active capabilities across all scenes
    frontier_stubs = _build_frontier_import_stubs(creative_plan, product_meta=product_meta)

    # Timing display
    hook_dur = f"{s2_start/fps:.1f}s"
    mech_dur = f"{(s3_start - s2_start)/fps:.1f}s"
    res_dur = f"{(total_frames - s3_start)/fps:.1f}s"

    # Niche safe-zone color note
    niche_bg = {
        "self_improvement": "#f8fafc (light studio)",
        "finance": "#030712 (dark obsidian)",
        "health": "#060913 (bio-navy)",
        "facecam": "#070b14 (cinematic dark)",
    }.get(niche, "#f8fafc")

    product_section = ""
    if product_meta:
        prod_path = product_meta.get("public_path", "")
        prod_page = product_meta.get("page", 1)
        prod_title = product_meta.get("exercise_title", "Blueprint Protocol")
        product_section = f"""
 * ════════════════════════════════════════════════════════════
 * MODE A PRODUCT ASSET (Exercise / Blueprint Visual Proof)
 * ════════════════════════════════════════════════════════════
 *  Asset Path:   {prod_path}
 *  Page Number:  {prod_page}
 *  Exercise:     {prod_title}
 *  Component:    <ProductPageShowcase imageSrc="{prod_path}" pageNum={{{prod_page}}} ... />
 *  Guidance:     Ground the resolution scene in physical visual proof of the worksheet/blueprint.
 *                Do NOT wrap in a generic card panel or dashboard box."""

    return f'''import React from "react";
import {{ interpolate, spring, staticFile, useCurrentFrame, useVideoConfig }} from "remotion";
import {{ WordTimestamp }} from "../../types";
// Kinetic text tools (always available):
import {{ AnimatedSlashStrike, KineticHighlighter, CameraShake }} from "../../components/kinetic_text";
{frontier_stubs}

interface CanvasProps {{
  transcript: WordTimestamp[];
}}

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  🎬 CREATIVE BRIEF — {pascal_name}Canvas
 * ║  Topic: "{topic}"
 * ║  Niche background: {niche_bg}
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * ════════════════════════════════════════════════════════════
 * VISUAL CONCEPT  (source: creative_plan.json › visualConcept)
 * ════════════════════════════════════════════════════════════
 *  Primary Mechanism:       {primary_mechanism}
 *  Central Transformation:  {central_transformation}
 *  Concept:                 {concept_name}
 *  Physical Description:    {physical_description}
 *  Cause Event:             {cause_event}
 *  Visible Transformation:  {visible_transformation}
 *  Visible Consequence:     {visible_consequence}
 *  Persistent State:        {persistent_state}
 *
 * ════════════════════════════════════════════════════════════
 * SCENE PLAN  (60 FPS, safe zone: y 280 → 1340px, x 60 → 1020px)
 * ════════════════════════════════════════════════════════════
 *  HOOK        frames 0 → {s2_start}  ({hook_dur})
 *    Narration:  "{hook_narration}"
 *    Frontiers:  {hook_frontiers}
 *    Brief:      Establish the visual question and initial state described by
 *                the Creative Brief. Choose the strongest visual representation
 *                for what the narration MEANS. Do not default to a card.
 *                If the concept has a causal/physical setup, begin establishing
 *                that mechanism during the hook.
 *                Valid approaches: presenter grounding, visual question,
 *                semantic cutout, kinetic typography, environmental setup,
 *                or a frontier mechanism in initial state.
 *
 *  MECHANISM   frames {s2_start} → {s3_start}  ({mech_dur})
 *    Narration:  "{logic_narration}"
 *    Frontiers:  {logic_frontiers}
 *    Brief:      Execute the PRIMARY MECHANISM as a live physical event on screen.
 *                The viewer must SEE the transformation happen — not read about it.
 *                Use frontier components from the import stubs above.
 *                Anti-card law: Zero card containers as the primary visual.
 *                If multiple beats exist, choreograph them sequentially from
 *                transcript.json word timestamps — never all at once.
 *
 *  RESOLUTION  frames {s3_start} → {total_frames}  ({res_dur})
 *    Narration:  "{solution_narration}"
 *    Frontiers:  {solution_frontiers}
 *    Brief:      Show STATE B — the visible consequence of the transformation.
 *                "{visible_consequence}"
 *                Persistent state: "{persistent_state}"
 *                Decisive. No new information. One dominant impression.{product_section}
 *
 * ════════════════════════════════════════════════════════════
 * SEMANTIC CUTOUT ASSETS  (optional anchors, not prescriptions)
 * ════════════════════════════════════════════════════════════
 *  Problem anchor:  {problem_cutout} → staticFile("{p_path}")
 *  Solution anchor: {solution_cutout} → staticFile("{s_path}")
 *  Full library: public/assets/registry.json  (40+ transparent PNGs)
 *  Size rule: 400–750px. Physical presence, not decoration.
 *
 * ════════════════════════════════════════════════════════════
 * DESIGN CONSTRAINTS (NO HIDDEN VISUAL DEFAULTS)
 * ════════════════════════════════════════════════════════════
 *  ✗ NO rounded-3xl / rounded-2xl card containers as primary visual
 *  ✗ NO dashboard list rows with numbered pills and sub-labels
 *  ✗ NO floating metric boxes, HUD panels, status bars
 *  ✗ NO hardcoded text strings inherited from this scaffold
 *  ✗ NO pill/capsule badges
 *  ✗ NO prescription of mandatory visual components
 *  ✓ YES frontier mechanism as the dominant visual event
 *  ✓ YES large semantic cutouts (400–750px) as primary actors
 *  ✓ YES kinetic typography at 80–110px as visual object
 *  ✓ YES open-canvas spatial composition without container walls
 *  ✓ YES STATE A → transformation → STATE B story arc
 *
 *  Follow Rule 5.1 Design-First Sequence (AGENTS.md) before writing JSX.
 *  Read transcript.json for exact word-frame timestamps.
 *  Read creative_plan.json › scenePlans for the full orchestrator output.
 */
export const {pascal_name}Canvas: React.FC<CanvasProps> = () => {{
  const frame = useCurrentFrame();
  const {{ fps }} = useVideoConfig();

  // ═══ FRAME BOUNDARIES (from transcript.json timing) ═══
  // Hook:       frames 0       → {s2_start}   ({hook_dur})
  // Mechanism:  frames {s2_start} → {s3_start}  ({mech_dur})
  // Resolution: frames {s3_start} → {total_frames}   ({res_dur})
  // Word-precise micro-beats: read src/clips/*/transcript.json

  const isHook = frame < {s2_start};
  const isMechanism = frame >= {s2_start} && frame < {s3_start};
  const isResolution = frame >= {s3_start};

  return (
    <div
      className="absolute inset-x-0 flex flex-col items-center select-none pointer-events-none px-6"
      style={{{{ top: 280, height: 1060, maxWidth: 960, left: "50%", transform: "translateX(-50%)" }}}}
    >
      {{/* ═══ HOOK (frames 0 → {s2_start}) ════════════════════════════════
       * COMMUNICATE: {hook_narration}
       * Establish the visual question and initial state described by the Creative Brief.
       * Choose the strongest visual representation for the narration. Do not default to a card.
       * If the concept has a causal/physical setup, begin establishing that mechanism during the hook.
       */}}
      {{isHook && (null /* TODO: Design and implement hook scene */)}}

      {{/* ═══ MECHANISM (frames {s2_start} → {s3_start}) ════════════════════
       * COMMUNICATE: {logic_narration}
       * PRIMARY MECHANISM: {primary_mechanism}
       * Physical event: {physical_description}
       * Transformation: {visible_transformation}
       * Execute this as a live physical event. Use frontier components above.
       */}}
      {{isMechanism && (null /* TODO: Design and implement mechanism scene */)}}

      {{/* ═══ RESOLUTION (frames {s3_start} → {total_frames}) ═════════════════
       * COMMUNICATE: {solution_narration}
       * Show STATE B: {visible_consequence}
       * Decisive. One dominant impression. No new information stacks.
       */}}
      {{isResolution && (null /* TODO: Design and implement resolution scene */)}}
    </div>
  );
}};
'''


def _build_frontier_import_stubs(creative_plan: dict, product_meta: dict = None) -> str:
    """Build commented frontier import stubs from the orchestrator's active capabilities."""
    all_frontier_codes = set()
    if creative_plan:
        for sp in creative_plan.get("scenePlans", []):
            for cap in sp.get("activeCapabilities", []):
                code = cap.get("frontierCode", "")
                if code and code not in ("F_BASE", "F_UBG"):
                    all_frontier_codes.add(code)

    FRONTIER_IMPORTS = {
        "F1": '// F1 — Infinite World (spatial expansion, infinite canvas):\n// import { InfiniteWorldCanvas } from "../../components/world";',
        "F2": '// F2 — Materiality (brittle rupture, absorption, viscoelastic strain):\n// import { StressFractureEngine, CapillaryInkBleed, ViscoelasticDeformation } from "../../components/physics/materiality";',
        "F4": '// F4 — Semantic Mass Physics (fulcrum balance, tether, impulse response):\n// import { KineticFulcrumBeam, SemanticMassNode, TensileStructuralTether } from "../../components/physics/consequence";',
        "F5": '// F5 — Environmental Worlds (diorama stage, bedrock foundation, cantilever):\n// import { DioramaPlinth, BedrockFoundation, MonolithicCantilever } from "../../components/environment";',
        "F6": '// F6 — Temporal Manipulation (dramatic breath hold, micro-freeze):\n// import { WorldCameraBreathHold } from "../../components/temporal";',
        "F7": '// F7 — Causal State Machines (causal world, node graph, threshold reactor):\n// import { CausalWorld, CausalNode, ThresholdReactor } from "../../causal";',
    }
    TRANSFORMATION_IMPORTS = {
        "F1", "F4", "F7",
    }

    lines = ["// ═══ FRONTIER IMPORT STUBS (from orchestrator active capabilities) ═══",
             "// Uncomment what the Visual Concept mechanism requires.",
             "// Delete what you don't use. See docs/FRONTIER_GALLERY.md for usage.",
             "// DO NOT default to card containers when a frontier is recommended."]

    for code in sorted(all_frontier_codes):
        if code in FRONTIER_IMPORTS:
            lines.append(FRONTIER_IMPORTS[code])

    if all_frontier_codes & TRANSFORMATION_IMPORTS:
        lines.append(
            '// Transformation bridges (pathway wear, boundary shift, causal coupling):\n'
            '// import { KineticFurrow, ThresholdBoundary, PersistentMemoryStage } from "../../components/primitives";\n'
            '// import { ThresholdBoundaryShift, ResistancePathway, CausalActionCoupling } from "../../components/transformation";'
        )

    if product_meta:
        lines.append(
            '// Mode A Product Showcase:\n'
            '// import { ProductPageShowcase } from "../../components/ProductPageShowcase";'
        )

    if not all_frontier_codes and not product_meta:
        lines.append("// No non-base frontiers selected for this clip.")

    return "\n".join(lines)


def scaffold_clip_files(
    name: str,
    raw_topic: str,
    format_type: str,
    duration_sec: float,
    raw_script: str,
    words_list: list = None,
    product_meta: dict = None,
    illustration_path: str = None,
    pinned_comment: str = None,
    is_duo: bool = False,
    meme_meta: dict = None,
    sticker_meta: dict = None,
    niche: str = None,
    creative_plan: dict = None,
    motion_ast: dict = None,
):
    topic = sanitize_tags(raw_topic)
    script_text = sanitize_tags(raw_script)
    print(f"🎨 [3/4] Scaffolding Remotion composition files in src/clips/{name}/...")
    clip_dir = ROOT_DIR / "src" / "clips" / name
    clip_dir.mkdir(parents=True, exist_ok=True)

    fps = 30
    total_frames = round(duration_sec * fps)
    pascal_name = "".join(w.capitalize() for w in re.split(r"[_\-\s]+", name))
    problem_cutout, solution_cutout = select_cutout_assets(topic, script_text)

    # 1. Niche Detection & Design System Mapping
    if not niche:
        lower_raw = f"{raw_topic} {raw_script}".lower()
        if re.search(r"\{\s*self\s*improv?ement\s*\}", lower_raw):
            niche = "self_improvement"
        elif "{facecam}" in lower_raw or "facecam" in lower_raw:
            niche = "facecam"
        elif "{finance}" in lower_raw or "apex wealth" in lower_raw:
            niche = "finance"
        elif "{health}" in lower_raw or "biomatrix" in lower_raw:
            niche = "health"
        else:
            lower_text = f"{topic} {script_text}".lower()
            if "facecam" in lower_text:
                niche = "facecam"
            elif "apex wealth" in lower_text or "roth" in lower_text or "credit" in lower_text or "invest" in lower_text or "money" in lower_text or "wealth" in lower_text:
                niche = "finance"
            elif "biomatrix" in lower_text or "cortisol" in lower_text or "circadian" in lower_text or "sleep" in lower_text or "dopamine" in lower_text or "adenosine" in lower_text:
                niche = "health"
            else:
                niche = "self_improvement"

    from metadata_engine import generate_full_metadata
    meta_package = generate_full_metadata(raw_topic, niche=niche, script=script_text, pinned_comment=pinned_comment or "")
    concept_term, concept_def, concept_badge = extract_concept_keyword(script_text, topic, niche)

    # Universal Background Intelligence Integration
    ubg_scenes = []
    if motion_ast and "scenes" in motion_ast:
        for sc in motion_ast["scenes"]:
            bgi = sc.get("backgroundIntent")
            if bgi and bgi.get("mode") == "universal" and bgi.get("assetId"):
                ubg_scenes.append((sc, bgi))
    elif creative_plan and "scenePlans" in creative_plan:
        for sp in creative_plan["scenePlans"]:
            bgi = sp.get("backgroundIntent")
            if bgi and bgi.get("mode") == "universal" and bgi.get("assetId"):
                ubg_scenes.append((sp["intent"], bgi))

    if ubg_scenes:
        all_same_asset = (
            len(set(b[1]["assetId"] for b in ubg_scenes)) == 1
            and len(ubg_scenes) == (len(motion_ast["scenes"]) if motion_ast and "scenes" in motion_ast else len(creative_plan["scenePlans"]))
        )
        if all_same_asset:
            first_sc, first_bgi = ubg_scenes[0]
            asset_id = first_bgi["assetId"]
            sem_role = first_bgi.get("semanticRole", "cinematic_surface")
            crop_strat = first_bgi.get("cropStrategy", "center_focal")
            motion_type = first_bgi.get("motion", "slow_zoom_in")
            scale_delta = first_bgi.get("motionScaleDelta", 1.04)
            opacity_val = first_bgi.get("opacity", 1.0)
            t_in = first_bgi.get("transitionIn")
            t_in_prop = f'transitionIn={{{json.dumps(t_in)}}}' if t_in else ""
            t_out = first_bgi.get("transitionOut")
            t_out_prop = f'transitionOut={{{json.dumps(t_out)}}}' if t_out else ""
            jsx_body = f"""      <UniversalBackground
        assetId="{asset_id}"
        semanticRole="{sem_role}"
        cropStrategy="{crop_strat}"
        motion="{motion_type}"
        motionScaleDelta={{{scale_delta}}}
        opacity={{{opacity_val}}}
        {t_in_prop}
        {t_out_prop}
        sceneStartFrame={{0}}
      />"""
        else:
            bg_elements = []
            for sc, bgi in ubg_scenes:
                asset_id = bgi["assetId"]
                sem_role = bgi.get("semanticRole", "cinematic_surface")
                crop_strat = bgi.get("cropStrategy", "center_focal")
                motion_type = bgi.get("motion", "slow_zoom_in")
                scale_delta = bgi.get("motionScaleDelta", 1.04)
                opacity_val = bgi.get("opacity", 1.0)
                t_in = bgi.get("transitionIn")
                t_in_prop = f'transitionIn={{{json.dumps(t_in)}}}' if t_in else ""
                t_out = bgi.get("transitionOut")
                t_out_prop = f'transitionOut={{{json.dumps(t_out)}}}' if t_out else ""
                s_start = sc.get("startFrame", 0)
                s_end = sc.get("endFrame", round(duration_sec * 60))
                s_dur = s_end - s_start

                bg_elements.append(f"""      {{frame >= {s_start} && frame < {s_end} && (
        <UniversalBackground
          assetId="{asset_id}"
          semanticRole="{sem_role}"
          cropStrategy="{crop_strat}"
          motion="{motion_type}"
          motionScaleDelta={{{scale_delta}}}
          opacity={{{opacity_val}}}
          {t_in_prop}
          {t_out_prop}
          sceneStartFrame={{{s_start}}}
          sceneDurationFrames={{{s_dur}}}
        />
      )}}""")
            jsx_body = "\n".join(bg_elements)

        bg_code = f"""import React from "react";
import {{ useCurrentFrame }} from "remotion";
import {{ UniversalBackground }} from "../../components/backgrounds";

export const {pascal_name}Background: React.FC = () => {{
  const frame = useCurrentFrame();

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#030712]">
{jsx_body}
    </div>
  );
}};
"""
    elif niche == "finance":
        bg_code = f"""import React from "react";
import {{ FinanceBackground }} from "../../components/finance/FinanceBackground";

export const {pascal_name}Background: React.FC = () => {{
  return <FinanceBackground />;
}};
"""
    elif niche == "health":
        bg_code = f"""import React from "react";
import {{ HealthBackground }} from "../../components/health/HealthBackground";

export const {pascal_name}Background: React.FC = () => {{
  return <HealthBackground />;
}};
"""
    elif niche == "facecam":
        bg_code = f"""import React from "react";

export const {pascal_name}Background: React.FC = () => {{
  return <div className="absolute inset-0 bg-[#070b14]" />;
}};
"""
    else: # self_improvement default (clean foundation canvas)
        bg_code = f"""import React from "react";
import {{ ArchitecturalDraftingCanvas }} from "../../components/pure_graphics";

export const {pascal_name}Background: React.FC = () => {{
  return <ArchitecturalDraftingCanvas theme="light" />;
}};
"""

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
    elif niche in ("finance", "health"):
        pres_code = f"""import React from "react";

interface PresenterProps {{
  currentMs: number;
}}

export const {pascal_name}Presenter: React.FC<PresenterProps> = () => null;
"""
    else:
        intro_title = "THE PARADOX"
        intro_glow = "rgba(244, 63, 94, 0.22)"
        intro_exit = 75
        intro_pose = "character_pointing.png"
        if concept_term:
            intro_title = concept_term.split()[0].upper()

        pres_code = f"""import React from "react";
import {{ GlossyJudyIntro }} from "../../components/pure_graphics";

interface PresenterProps {{
  currentMs: number;
}}

/**
 * 🎬 {pascal_name}Presenter
 * Mounts the mandatory Judy Intro pop-up during the opening problem hook (first ~2.5s / Frames 0 - {intro_exit}).
 * Framed close-up and intimate to connect with viewers on small mobile screens.
 */
export const {pascal_name}Presenter: React.FC<PresenterProps> = () => {{
  return (
    <GlossyJudyIntro
      startFrame={{0}}
      exitFrame={{{intro_exit}}}
      glowColor="{intro_glow}"
      pose="{intro_pose}"
      reflectionOpacity={{0.36}}
      baseHeight={{1280}}
      position="right"
    />
  );
}};
"""
    if not (clip_dir / "Presenter.tsx").exists():
        (clip_dir / "Presenter.tsx").write_text(pres_code, encoding="utf-8")
    else:
        print(f"      Preserving bespoke Presenter.tsx at {clip_dir / 'Presenter.tsx'}")

    accent_choice = "cyan" if niche == "health" else ("emerald" if niche == "finance" else "blue")

    # 4. Canvas.tsx with Speech-Synchronized Sequential Reveals
    # Build Scene 2 points JSX
    s2_points_jsx = []
    s2_spring_defs = []
    sfx_cues = []
    if not sfx_cues:
        sfx_cues = [
            {"frame": 0, "type": "whoosh_deep", "volume": 0.32},
            {"frame": f_c1_cutout, "type": "whoosh_fast", "volume": 0.32},
            {"frame": s2_start, "type": "whoosh_fast", "volume": 0.34},
        ]

    # 4a. Zero Memes Policy (Meme cards and reaction stickers permanently retired)
    meme_jsx = ""
    sticker_jsx = ""

    # 4b. Interactive Engagement Pill (Seconds 18–22 / ~70% timeline to boost likes and comments)
    pill_entrance = round(total_frames * 0.70)
    if pill_entrance < s2_start + 45:
        pill_entrance = s2_start + 45
    if pill_entrance > total_frames - 90:
        pill_entrance = max(s2_start + 20, total_frames - 120)

    pill_prompt = meta_package.get("pill_prompt", generate_engagement_pill_text(topic, niche))
    pill_tag = meta_package.get("pill_tag", "COMMUNITY")
    pill_theme = "obsidian" if niche in ("finance", "facecam") else ("biotech_cyan" if niche == "health" else "apple_studio")
    pill_icon = "pin" if niche == "finance" else ("heart" if niche == "health" else "brain")
    sfx_cues.append({"frame": pill_entrance, "type": "click", "volume": 0.28})

    # 4c. Concept Keyword Slam Engine (Visual reinforcement for core psychological terms)
    concept_entrance = s2_start
    concept_dur = 75
    if s3_start - s2_start < 130:
        concept_dur = min(75, max(45, (s3_start - s2_start) // 2))
    concept_exit = s2_start + concept_dur

    slam_theme = "obsidian" if niche in ("finance", "facecam") else ("biotech_cyan" if niche == "health" else "apple_studio")
    slam_icon = "target" if niche == "finance" else ("activity" if niche == "health" else "brain")

    sfx_cues.append({"frame": concept_exit, "type": "whoosh_sparkle", "volume": 0.24})

    s2_clean_header = meta_package.get("thumbnail_title", clean_thumbnail_title(topic))
    s2_clean_sub = meta_package.get("thumbnail_subtitle", "Core Principles & Breakdown")

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
                sfx_cues.append({"frame": b["frame"], "type": "whoosh_deep", "volume": 0.28})

    for idx, pt in enumerate(s2_items):
        p_frame = max(pt["startFrame"], concept_exit)
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
    sfx_cues.append({"frame": f_s3_finale, "type": "click", "volume": 0.32})
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
            accentColor="{accent_choice}"
            entranceFrame={{{s1_start}}}
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

    if not product_meta:
        canvas_code = generate_canvas_scaffold(
            pascal_name=pascal_name,
            canvas_container_class=canvas_container_class,
            s1_start=s1_start,
            s2_start=s2_start,
            s3_start=s3_start,
            total_frames=total_frames,
            topic=topic,
            problem_cutout=problem_cutout,
            solution_cutout=solution_cutout,
        )
    else:
        canvas_code = f"""import React from "react";
import {{ useCurrentFrame, useVideoConfig, spring, interpolate }} from "remotion";
import {{ PhysicalCard }} from "../../components/physics/PhysicalCard";
import {{ TapeStrip }} from "../../components/collage/TapeStrip";
import {{ ProCutout }} from "../../components/ProCutout";
import {{ ProductPageShowcase }} from "../../components/ProductPageShowcase";
import {{ CinematicIllustrationCard }} from "../../components/CinematicIllustrationCard";
import {{ ConceptKeywordSlam }} from "../../components/ConceptKeywordSlam";
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
      {{/* ======================================================== */}}
      {{/* SCENE 1: THE ROOT FRICTION & HOOK (Frames {s1_start} - {s2_start}) */}}
      {{/* ======================================================== */}}
      {scene1_content_jsx}

      {{/* ======================================================== */}}
      {{/* SCENE 2A: HIGH-IMPACT CONCEPT KEYWORD SLAM              */}}
      {{/* (Frames {concept_entrance} - {concept_exit})             */}}
      {{/* ======================================================== */}}
      {{frame >= {concept_entrance} && frame < {concept_exit} && (
        <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-150">
          <ConceptKeywordSlam
            term="{concept_term}"
            definition="{concept_def}"
            categoryBadge="{concept_badge}"
            entranceFrame={{{concept_entrance}}}
            durationFrames={{{concept_dur}}}
            theme="{slam_theme}"
            icon="{slam_icon}"
            width={{920}}
          />
        </div>
      )}}

      {{/* ======================================================== */}}
      {{/* SCENE 2B: THE BREAKDOWN (REVEALED ONE-BY-ONE AS SPOKEN!)  */}}
      {{/* (Frames {concept_exit} - {s3_start})                     */}}
      {{/* ======================================================== */}}
      {{frame >= {concept_exit} && frame < {s3_start} && (() => {{
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
                impactMs={{{round((concept_exit/fps)*1000)}}}
                className="{card_class}"
              >
                {{/* Clean Uncrowded Section Header - NO RAW TOPIC LEAKS */}}
                <div className="text-center mt-1">
                  <h2 className="text-5xl font-black {text_color} leading-tight uppercase tracking-tight">
                    {s2_clean_header}
                  </h2>
                  <div className="text-2xl font-mono {accent_color} font-bold mt-1 tracking-wider uppercase">
                    {s2_clean_sub}
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
    </div>
  );
}};
"""
    if not (clip_dir / "Canvas.tsx").exists():
        (clip_dir / "Canvas.tsx").write_text(canvas_code, encoding="utf-8")
        assert_valid_canvas_scaffold(canvas_code, pres_code)
    else:
        print(f"      Preserving bespoke Canvas.tsx at {clip_dir / 'Canvas.tsx'}")

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
import {{ GroundedTextureEngine }} from "../../components/texture";
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

      {{/* 9. Grounded Finishing Texture (35mm Living Grain + Halation + Vignette) */}}
      <GroundedTextureEngine grainOpacity={{0.042}} />
    </div>
  );
}};
"""
    (clip_dir / "index.tsx").write_text(idx_code, encoding="utf-8")
    print(f"      Scaffolded 4 speech-synchronized clip components in src/clips/{name}/")
    return pascal_name


def register_composition_and_thumbnail(name: str, pascal_name: str, topic: str, format_type: str, niche: str = 'self_improvement', pinned_comment: str = None, script_text: str = None, story_model: Optional[Any] = None):
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

    # Register in thumbnails/index.tsx (Frontier T: Thumbnail Intelligence)
    thumb_content = thumb_file.read_text(encoding="utf-8")
    from thumbnail_director import ThumbnailDirector
    t_director = ThumbnailDirector()
    aspect_str = "9:16" if format_type == "shorts" else "16:9"
    t_manifest = t_director.orchestrate(
        topic,
        script=script_text or "",
        niche=niche,
        aspect_ratio=aspect_str,
        story_model=story_model,
    )

    # Persist inspectable thumbnail_plan.json
    clip_dir = ROOT_DIR / "src" / "clips" / name
    if clip_dir.exists():
        (clip_dir / "thumbnail_plan.json").write_text(json.dumps(t_manifest, indent=2), encoding="utf-8")
        print(f"      [Frontier T] Persisted thumbnail_plan.json in {clip_dir}")

    if f"{pascal_name}Thumbnail" not in thumb_content:
        chosen_concept = t_manifest["chosenConcept"]
        hook_word = chosen_concept["textHook"]
        accent_color = chosen_concept["accentColor"]
        theme = "apple_studio" if niche == "self_improvement" else ("obsidian" if niche in ["finance", "facecam"] else "biotech_cyan")

        thumb_decl = f"""
export const {pascal_name}Thumbnail: React.FC = () => (
  <ImpossibleMetaphorLayout
    hookWord="{hook_word}"
    accentColor="{accent_color}"
    heroImageSrc="{name}/assets/scene_illustration.png"
    aspectRatio="{ "9:16" if format_type == "shorts" else "16:9" }"
    theme="{theme}"
  />
);
"""
        thumb_content += thumb_decl
        thumb_file.write_text(thumb_content, encoding="utf-8")
        print("      [Frontier T] Registered bespoke thumbnail component in src/thumbnails/index.tsx")

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
            from metadata_engine import generate_full_metadata
            meta_package = generate_full_metadata(topic, niche=niche, script=script_text or "", pinned_comment=pinned_comment or "")
            meta = json.loads(meta_file.read_text(encoding="utf-8"))
            final_pinned = pinned_comment or meta_package.get("pinnedComment") or generate_pinned_comment(topic=topic, niche=niche, hook_text=topic, script_text=script_text or "")
            meta[f"{name}_video.mp4"] = {
                "topic": name,
                "title": meta_package["title"],
                "description": meta_package["description"],
                "tags": meta_package["tags"],
                "categoryId": "27",
                "privacyStatus": "public",
                "pinnedComment": final_pinned
            }
            meta_file.write_text(json.dumps(meta, indent=2, ensure_ascii=False), encoding="utf-8")
            print("      Added beautiful viral metadata to studio/metadata.json")
            print(f"      Viral Hook Title: \"{meta_package['title']}\"")
            print(f"\n💬 [Suggested High-Retention Pinned Comment]:")
            print(f"   \"{final_pinned}\"\n")
        except Exception as e:
            print(f"      Metadata warning: {e}")

def render_assets(name: str, pascal_name: str):
    print("🎥 [4/4] Rendering 4K Thumbnail & MP4 Video...")
    out_thumb = f"out/{name}_thumbnail.png"
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
    parser = argparse.ArgumentParser(description="RightMotion Autonomous Video Engine")
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
    parser.add_argument("--duo", action="store_true", help="Enable Conversational Duo mode (Judy & Andrew)")
    parser.add_argument("--andrew", action="store_true", help="Include Andrew character (Conversational Duo mode with Judy, runtime up to 40s)")
    parser.add_argument("--meme", default=None, help="Meme ID override (e.g. ishowspeed_stare) or 'auto'")
    parser.add_argument("--meme-start", type=int, default=0, help="Meme start frame (default: 0 for instant opening hook)")
    parser.add_argument("--meme-mode", choices=["video", "frame"], default="video", help="Meme display mode (video card or still frame)")
    parser.add_argument("--sticker", default=None, help="Gen-Z meme reaction sticker ID (e.g. verne_turtle_shock) or 'none'")
    parser.add_argument("--no-sticker", action="store_true", help="Disable mid-video Gen-Z meme reaction stickers")
    parser.add_argument("--no-meme", action="store_true", help="Disable the opening tactical retention meme")
    parser.add_argument("--meta", action="store_true", help="Enable product PDF linking/extraction (default is organic/no-meta mode)")
    parser.add_argument("--illustration", default=None, help="Relative or absolute path to generated painterly illustration for Scene 1 (e.g. test_motion_illustration/assets/scene_illustration.png)")
    parser.add_argument("--no-render", action="store_true", help="Skip final MP4/PNG render")
    parser.add_argument("--render", action="store_true", help="Render final MP4/PNG immediately (default: False, AI Agent should edit Canvas.tsx first)")
    parser.add_argument("--inspect-intelligence", action="store_true", help="Print Frontier S Script Intelligence inspection report")
    parser.add_argument("--inspect-visual-pipeline", action="store_true", help="Print end-to-end visual pipeline diagnostic trace (Script -> Visual Concept -> F0 -> UBG -> Motion AST -> Compiler)")
    parser.add_argument("--inspect-composition", action="store_true", help="Print Section 25 mobile composition and visual density audit report")

    args = parser.parse_args()
    
    raw_script = args.script
    raw_topic = args.topic or ""

    raw_combined = f"{raw_topic} {raw_script or ''} {args.name}".lower()

    # Check for {meta} tag (Mode A opt-in) vs {no meta} tag across inputs
    has_meta_tag = bool(re.search(r"\{\s*meta\s*\}", raw_combined, re.IGNORECASE))
    has_no_meta_tag = bool(re.search(r"\{\s*no\s*meta\s*\}", raw_combined, re.IGNORECASE))
    has_explicit_product = bool(args.product) or bool(re.search(r"\{\s*(?:product|pdf)\s*:\s*[^,}]+,\s*page\s*:\s*\d+\s*\}", raw_combined, re.IGNORECASE))

    # Mode B (organic growth) is DEFAULT unless {meta}, --meta, or {product: ...} is explicitly requested!
    is_mode_a = (args.meta or has_meta_tag or has_explicit_product) and not has_no_meta_tag

    # Check for Andrew / Duo mode: ONLY include Andrew when {andrew}, --andrew, {duo}, or --duo is explicitly used!
    has_andrew_tag = bool(re.search(r"\{\s*andrew\s*\}", raw_combined, re.IGNORECASE))
    has_duo_tag = bool(re.search(r"\{\s*duo\s*\}", raw_combined, re.IGNORECASE))
    is_duo = getattr(args, "andrew", False) or args.duo or has_andrew_tag or has_duo_tag

    if is_duo:
        print("👥 [Andrew Protocol] '{andrew}' detected: Including Andrew alongside Judy (runtime allowed up to 40s).")

    # If no script provided, autonomously generate it from topic
    if not raw_script and raw_topic:
        print(f"✍️  [Scriptwriter] No script provided. Autonomously generating script for topic: '{raw_topic}' (Andrew/Duo: {is_duo}, Meta: {is_mode_a})...")
        gen_res = generate_script_and_metadata(raw_topic, duo=is_duo, meta=is_mode_a)
        raw_script = gen_res["formatted_output"]
        if gen_res.get("is_duo"):
            is_duo = True
        print(f"      Generated Mode {gen_res['mode']} script ({gen_res['word_count']} words)")
    elif not raw_script:
        raise ValueError("Must provide either --script or --topic to generate a video!")

    # Parse [METADATA] and [VOICEOVER] blocks if present
    meta_pdf, meta_page, meta_title, vo_text, script_pinned_comment = parse_script_blocks(raw_script)

    product_pdf = None
    product_page = None
    product_meta = None

    if is_mode_a:
        product_pdf = args.product or meta_pdf
        product_page = args.product_page or meta_page

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

        if product_pdf and product_page:
            try:
                product_meta = extract_product_page(product_pdf, product_page)
                print(f"📄 [Product] Extracted {product_meta['pdf_name']} Page {product_meta['page']} -> {product_meta['public_path']}")
            except Exception as e:
                print(f"⚠️  [Product] Warning: Failed to extract product page: {e}")
    else:
        print(f"🌱 [Organic Engine] Running in Mode B (Organic Growth) — zero PDF hunt.")

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
    is_valid, issues = check_script_hygiene(clean_script, is_mode_a=bool(product_meta), is_duo=is_duo)
    if not is_valid:
        print("⚠️  [Script Hygiene Advisory]:")
        for iss in issues:
            print(f"      - {iss}")

    name = sanitize_tags(args.name)
    name = re.sub(r"[^a-z0-9_]+", "_", name.lower()).strip("_")
    topic = clean_topic or name.replace("_", " ").title()
    
    # Determine niche string
    raw_niche_check = f"{raw_topic} {raw_script}".lower()
    if re.search(r"\{\s*self\s*improv?ement\s*\}", raw_niche_check) or args.style == "self_improvement":
        detected_niche = "self_improvement"
    elif is_facecam or "{facecam}" in raw_niche_check or args.style == "facecam":
        detected_niche = "facecam"
    elif "{finance}" in raw_niche_check or args.style == "finance":
        detected_niche = "finance"
    elif "{health}" in raw_niche_check or args.style == "health":
        detected_niche = "health"
    else:
        detected_niche = "self_improvement"

    # Frontier S: Script Intelligence Convergence Point
    print(f"🧠 [Frontier S] Analyzing narrative, causality, and visual opportunities with Script Intelligence...")
    intelligence = ScriptIntelligence()
    story_model = intelligence.analyze(
        script=clean_script,
        topic=topic,
        source_type="topic_generated" if not args.script and args.topic else "user_script",
        channel=detected_niche,
        mode="A" if is_mode_a else "B",
        is_duo=is_duo,
    )
    if getattr(args, "inspect_intelligence", False):
        print(intelligence.format_inspection_report(story_model))

    story_model_path = ROOT_DIR / "src" / "clips" / name / "story_model.json"
    story_model_path.parent.mkdir(parents=True, exist_ok=True)
    story_model_path.write_text(story_model.to_json(indent=2), encoding="utf-8")
    print(f"      Normalized Story Model saved to: {story_model_path}")

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

    # Frontier #0: Creative Intelligence Orchestration & Motion AST Compilation
    print(f"🎬 [Frontier #0] Orchestrating creative capabilities and compiling Motion AST...")
    orchestrator = CreativeOrchestrator()
    creative_plan = orchestrator.generate_plan(
        clip_name=name,
        topic=topic,
        script=clean_script,
        transcript=words,
        fps=60,
        story_model=story_model,
    )
    motion_ast = orchestrator.compile_motion_ast(creative_plan, transcript=words)

    creative_plan_path = ROOT_DIR / "src" / "clips" / name / "creative_plan.json"
    creative_plan_path.write_text(json.dumps(creative_plan, indent=2), encoding="utf-8")
    print(f"      Creative Plan saved to: {creative_plan_path}")

    motion_ast_path = ROOT_DIR / "src" / "clips" / name / "motion_ast.json"
    motion_ast_path.write_text(json.dumps(motion_ast, indent=2), encoding="utf-8")
    print(f"      Motion AST saved to: {motion_ast_path}")

    if getattr(args, "inspect_visual_pipeline", False):
        print("\n" + "=" * 70)
        print("🔍 [INSPECT VISUAL PIPELINE] End-to-End Diagnostic Trace")
        print("=" * 70)
        print(f"1. Script & Topic:")
        print(f"   Topic:  \"{topic}\"")
        print(f"   Niche:  {detected_niche}")
        print(f"   Script: \"{clean_script[:100]}...\"")
        print(f"\n2. Frontier S (Story Model):")
        print(f"   Core Idea: {story_model.story.coreIdea if hasattr(story_model, 'story') else 'N/A'}")
        print(f"\n3. Frontier #0 (Creative Orchestration):")
        print(f"   Overall Complexity: {creative_plan['overallComplexityRating']}")
        for sp in creative_plan['scenePlans']:
            sc_id = sp['sceneId']
            acts = [a['frontierCode'] for a in sp['activeCapabilities']]
            rejs = [r['frontierCode'] for r in sp['rejectedCapabilities']]
            bgi = sp.get('backgroundIntent', {})
            print(f"   - {sc_id}:")
            print(f"     Active:     {', '.join(acts)}")
            print(f"     Rejected:   {', '.join(rejs)}")
            print(f"     Background: mode={bgi.get('mode')}, asset={bgi.get('assetId')}, role={bgi.get('semanticRole')}, motion={bgi.get('motion')}")
            print(f"     Reason:     {bgi.get('reason')}")
        print(f"\n4. Motion AST Compilation:")
        print(f"   Version:      {motion_ast['version']}")
        print(f"   Total Frames: {motion_ast['totalFrames']}")
        print(f"   Scenes:       {len(motion_ast['scenes'])}")
        print(f"   Ground Color: {motion_ast['environment']['groundColor']}")
        print("=" * 70 + "\n")

    if getattr(args, "inspect_composition", False) or getattr(args, "inspect_visual_pipeline", False):
        print("\n" + "=" * 70)
        print("📐 [INSPECT COMPOSITION] 9:16 Mobile Density & Dead-Space Audit")
        print("=" * 70)
        for sc in motion_ast["scenes"]:
            sc_id = sc["sceneId"]
            actors = []
            for act in sc.get("actors", []):
                layout = act.get("resolvedLayout", {})
                actors.append(ActorBounds(
                    id=act["id"],
                    semantic_role=act.get("semanticRole", "actor"),
                    importance=act.get("narrativeImportance", "SECONDARY"),
                    x=layout.get("x", 540),
                    y=layout.get("y", 680),
                    width=layout.get("width", 500),
                    height=layout.get("height", 300),
                    origin_anchor=layout.get("originAnchor", "center"),
                ))
            for ann in sc.get("annotations", []):
                sp = ann.get("staticPlacement", {})
                actors.append(ActorBounds(
                    id=ann.get("annotationId", "headline"),
                    semantic_role="scene_headline",
                    importance="CRITICAL",
                    x=sp.get("x", 540),
                    y=sp.get("y", 340),
                    width=GeometryResolver.SAFE_WIDTH,
                    height=90,
                    origin_anchor="center",
                    font_size_px=ann.get("fontSizePx", 68),
                    text_content=ann.get("text", ""),
                ))
            metrics = GeometryResolver.calculate_metrics(actors)
            print(GeometryResolver.format_diagnostic_report(sc_id, metrics, actors))
        print("=" * 70 + "\n")

    # Step 3: Scaffold & Register
    # Zero Memes Policy: Memes and reaction stickers are permanently retired
    meme_match = None
    sticker_match = None

    illustration_path = args.illustration
    if illustration_path:
        p_ill = Path(illustration_path)
        if p_ill.is_absolute() and str(p_ill).startswith(str(ROOT_DIR / "public")):
            illustration_path = str(p_ill.relative_to(ROOT_DIR / "public"))
        elif illustration_path.startswith("public/"):
            illustration_path = illustration_path.replace("public/", "", 1)
    else:
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
        meme_meta=meme_match,
        sticker_meta=sticker_match,
        niche=detected_niche,
        creative_plan=creative_plan,
        motion_ast=motion_ast,
    )
    register_composition_and_thumbnail(
        name,
        pascal_name,
        topic,
        args.format,
        detected_niche,
        pinned_comment=script_pinned_comment,
        script_text=clean_script,
        story_model=story_model,
    )

    try:
        from notify import dispatch_notification
        title_fmt = name.replace("_", " ").title()
        dispatch_notification(
            event_type="PROJECT_CREATED",
            title=f"✨ New Clip Scaffolded: {title_fmt}",
            body=f"Audio and transcript ready for '{topic}'. Starter canvas is ready.",
            clip=f"{name}_video.mp4",
            tab="studio",
            category="project"
        )
    except Exception:
        pass

    # Step 4: Render
    if args.render and not args.no_render:
        render_assets(name, pascal_name)
    else:
        print("\n" + "=" * 80)
        print(f"🎬 CLIP SCAFFOLDED: {name} ({pascal_name})")
        print("=" * 80)
        print(f"✨ Audio, transcript timestamps, and registered composition are ready!")
        print(f"📁 Starter Canvas: src/clips/{name}/Canvas.tsx")
        print(f"🧠 Story Intelligence: src/clips/{name}/story_model.json")
        print("\n👉 MANDATORY AI AGENT ACTION:")
        print(f"1. Open src/clips/{name}/Canvas.tsx.")
        print(f"2. Write 100% bespoke Remotion motion graphics tailored to '{topic}'.")
        print(f"3. Verify stills: npx remotion still src/index.ts {pascal_name}Video out/{name}_scene1.png --frame=80")
        print(f"4. Render video: npx remotion render src/index.ts {pascal_name}Video out/{name}_video.mp4")
        print("=" * 80 + "\n")

if __name__ == "__main__":
    asyncio.run(main())
