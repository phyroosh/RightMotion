#!/usr/bin/env python3
"""
🎙️ RightMotion Canonical Voiceover & Transcription Engine
Location: scripts/voiceover_engine.py

The single authoritative audio module for RightMotion.
Unifies:
  1. Microsoft Neural TTS speech synthesis (Edge TTS)
  2. Automatic dead-air pause compression (<180ms) and 220ms reflection breath handling
  3. Conversational Duo synthesis (Judy & Andrew) with 140ms snappy turn transitions
  4. Native creator facecam audio extraction (44.1kHz stereo)
  5. Faster-Whisper GPU/CPU word-level timestamp transcription (producing transcript.json)
"""

import sys
import os
import re
import site
import shutil
import argparse
import asyncio
import json
import subprocess
from pathlib import Path
from typing import List, Dict, Any, Tuple, Optional

ROOT_DIR = Path(__file__).resolve().parent.parent

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

# Automatically register CUDA DLLs for NVIDIA GPU acceleration if present
for site_pkg in site.getsitepackages():
    nvidia_dir = os.path.join(site_pkg, "nvidia")
    if os.path.isdir(nvidia_dir):
        for sub in os.listdir(nvidia_dir):
            bin_dir = os.path.join(nvidia_dir, sub, "bin")
            if os.path.isdir(bin_dir):
                try:
                    os.add_dll_directory(bin_dir)
                    os.environ["PATH"] = bin_dir + os.pathsep + os.environ.get("PATH", "")
                except Exception:
                    pass

import edge_tts

VOICE_MAP: Dict[str, Dict[str, str]] = {
    "judy": {
        "voice": "en-US-AvaMultilingualNeural",
        "rate": "+8%",
        "pitch": "+0Hz",
    },
    "andrew": {
        "voice": "en-US-SteffanNeural",
        "rate": "+7%",
        "pitch": "+0Hz",
    },
}


def sanitize_tags(text: str) -> str:
    """Strips metadata tags, mode switches, and bracketed modifiers from script text."""
    if not text:
        return ""
    pattern = re.compile(
        r"\{\s*(?:health|finance|self\s*improv?ement|facecam|no\s*topics?|no\s*meta|meta|no\s*memes?|no\s*stickers?|andrew|duo|meme(?:\s*:\s*[^}]+)?|sticker(?:\s*:\s*[^}]+)?|(?:product|pdf)\s*:\s*[^,}]+,\s*page\s*:\s*\d+)\s*\}",
        re.IGNORECASE,
    )
    cleaned = pattern.sub("", text)
    cleaned = re.sub(r"[{}\\]", "", cleaned)
    return cleaned.strip()


def normalize_text_for_tts(raw_text: str) -> str:
    """
    Cleans up text formatting to prevent neural TTS from creating multi-second artificial freezes.
    Replaces ellipses with commas, standardizes line breaks, and trims.
    """
    clean = sanitize_tags(raw_text)

    # Strip metadata or pinned comment blocks if present
    meta_match = re.search(r"\[METADATA\](.*?)(?:\[VOICEOVER\]|\[PINNED COMMENT\]|$)", clean, re.DOTALL | re.IGNORECASE)
    if meta_match:
        clean = clean[meta_match.end():]
    vo_match = re.search(r"\[VOICEOVER\]\s*(.*?)(?:\[PINNED COMMENT\]|$)", clean, re.DOTALL | re.IGNORECASE)
    if vo_match:
        clean = vo_match.group(1)
    elif "[PINNED COMMENT]" in clean:
        clean = clean.split("[PINNED COMMENT]")[0]

    return (
        clean
        .replace("…", ",")
        .replace("...", ",")
        .replace("\r\n", "\n")
        .replace("\n\n", " ")
        .replace("\n", " ")
        .strip()
    )


def split_body_and_closing_question(text: str) -> Tuple[str, str]:
    """
    Separates the main narrative from the final reflective question.
    Allows inserting an intimate reflection breath (220ms pause) before the question.
    """
    clean = text.strip()
    sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', clean) if s.strip()]
    if len(sentences) >= 2:
        last = sentences[-1]
        if last.endswith("?") or any(
            last.lower().startswith(p)
            for p in ["tell me", "drop your", "drop a", "be honest", "question for you", "what would you", "have you ever"]
        ):
            body = " ".join(sentences[:-1])
            question = last
            return body, question
    return clean, ""


def parse_dialogue_turns(raw_text: str) -> List[Dict[str, str]]:
    """
    Parses dialogue script with JUDY: and ANDREW: tags into sequential speaker turns.
    Handles single-line, multi-line, and mixed formats.
    """
    clean_text = normalize_text_for_tts(raw_text)
    pattern = re.compile(r"(?:^|\s+)(judy|andrew)\s*:\s*", re.IGNORECASE)
    matches = list(pattern.finditer(clean_text))

    turns: List[Dict[str, str]] = []

    if matches:
        if matches[0].start() > 0:
            init_text = clean_text[:matches[0].start()].strip()
            if init_text:
                turns.append({"speaker": "judy", "text": init_text})

        for i, m in enumerate(matches):
            speaker = m.group(1).lower()
            start = m.end()
            end = matches[i + 1].start() if i + 1 < len(matches) else len(clean_text)
            turn_text = clean_text[start:end].strip()
            if turn_text:
                turns.append({"speaker": speaker, "text": turn_text})
    else:
        if clean_text:
            turns.append({"speaker": "judy", "text": clean_text})

    return turns


def get_audio_duration_ms(audio_file: str | Path) -> float:
    """Returns exact audio duration in milliseconds via ffprobe."""
    cmd = [
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        str(audio_file)
    ]
    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, check=True)
    return float(result.stdout.strip()) * 1000.0


def normalize_and_compress_audio(
    in_path: str | Path,
    out_path: str | Path,
    max_pause_sec: float = 0.18
) -> None:
    """
    Trims awkward dead air to a natural 150ms-180ms gap and standardizes to 44.1kHz stereo 192k MP3.
    """
    cmd = [
        "ffmpeg", "-y", "-i", str(in_path),
        "-af", f"silenceremove=stop_periods=-1:stop_duration={max_pause_sec}:stop_threshold=-35dB:detection=peak",
        "-ar", "44100", "-ac", "2", "-b:a", "192k",
        str(out_path)
    ]
    try:
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    except Exception:
        # Fallback without silenceremove if audio has non-standard streams
        cmd_fb = [
            "ffmpeg", "-y", "-i", str(in_path),
            "-ar", "44100", "-ac", "2", "-b:a", "192k",
            str(out_path)
        ]
        subprocess.run(cmd_fb, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)


async def synthesize_speech(
    text: str,
    output_path: str | Path,
    voice: str = "en-US-AvaMultilingualNeural",
    rate: str = "+8%",
) -> None:
    """
    Synthesizes neural voiceover audio using Edge TTS with optional reflection pause handling.
    Standardizes output to 44.1kHz stereo 192k MP3 with compressed pauses.
    """
    out_p = Path(output_path)
    out_p.parent.mkdir(parents=True, exist_ok=True)

    clean_text = normalize_text_for_tts(text)
    body_text, closing_question = split_body_and_closing_question(clean_text)

    if closing_question:
        print(f"🎙️ Synthesizing neural speech with intimate 220ms reflection breath before closing question ({voice})...")
        work_dir = out_p.parent / ".tts_temp"
        work_dir.mkdir(parents=True, exist_ok=True)
        body_raw = work_dir / "body_raw.mp3"
        body_norm = work_dir / "body_norm.mp3"
        q_raw = work_dir / "q_raw.mp3"
        q_norm = work_dir / "q_norm.mp3"
        pause_gap = work_dir / "pause_220ms.mp3"

        # 1. Synthesize body text (+8% rate)
        comm_b = edge_tts.Communicate(text=body_text, voice=voice, rate=rate)
        await comm_b.save(str(body_raw))
        normalize_and_compress_audio(body_raw, body_norm, max_pause_sec=0.18)

        # 2. Synthesize closing question (+6% slightly more deliberate)
        comm_q = edge_tts.Communicate(text=closing_question, voice=voice, rate="+6%")
        await comm_q.save(str(q_raw))
        normalize_and_compress_audio(q_raw, q_norm, max_pause_sec=0.18)

        # 3. Generate 220ms silence pause gap
        cmd_pause = [
            "ffmpeg", "-y", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo",
            "-t", "0.22", "-ar", "44100", "-ac", "2", "-b:a", "192k", str(pause_gap)
        ]
        subprocess.run(cmd_pause, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

        # 4. Concat with demuxer
        concat_list = work_dir / "concat.txt"
        concat_list.write_text(
            f"file '{body_norm.resolve().as_posix()}'\nfile '{pause_gap.resolve().as_posix()}'\nfile '{q_norm.resolve().as_posix()}'\n",
            encoding="utf-8"
        )
        cmd_concat = [
            "ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(concat_list),
            "-c:a", "libmp3lame", "-b:a", "192k", "-ar", "44100", "-ac", "2", str(out_p)
        ]
        subprocess.run(cmd_concat, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        shutil.rmtree(work_dir, ignore_errors=True)
        print(f"✅ Seamless master audio saved with 220ms breath pause to: {out_p}")
    else:
        raw_path = out_p.with_name(f"raw_{out_p.name}")
        print(f"🎙️ Synthesizing voice with {voice} (rate={rate})...")
        communicate = edge_tts.Communicate(text=clean_text, voice=voice, rate=rate)
        await communicate.save(str(raw_path))
        normalize_and_compress_audio(raw_path, out_p, max_pause_sec=0.18)
        try:
            raw_path.unlink(missing_ok=True)
        except Exception:
            pass
        print(f"✅ Snappy pause-compressed master audio saved to: {out_p}")


async def build_duo_audio(
    turns: List[Dict[str, str]],
    work_dir: Path,
    final_audio_path: Path
) -> List[Dict[str, Any]]:
    """
    Synthesizes conversational dialogue turns (Judy & Andrew), compresses dead air,
    concatenates with 140ms inter-turn transitions, and returns turn timing boundaries.
    """
    work_dir.mkdir(parents=True, exist_ok=True)
    final_audio_path.parent.mkdir(parents=True, exist_ok=True)

    tasks = []
    raw_files = []
    trimmed_files = []

    for idx, turn in enumerate(turns):
        raw_f = work_dir / f"turn_{idx}_{turn['speaker']}_raw.mp3"
        trim_f = work_dir / f"turn_{idx}_{turn['speaker']}_norm.mp3"
        raw_files.append(str(raw_f))
        trimmed_files.append(str(trim_f))

        cfg = VOICE_MAP.get(turn["speaker"], VOICE_MAP["judy"])
        comm = edge_tts.Communicate(
            text=turn["text"],
            voice=cfg["voice"],
            rate=cfg["rate"],
            pitch=cfg["pitch"]
        )
        tasks.append(comm.save(str(raw_f)))

    print(f"🎙️ Synthesizing {len(turns)} dialogue turns with Ava (Judy) & Steffan (Andrew)...")
    await asyncio.gather(*tasks)

    for raw_f, trim_f in zip(raw_files, trimmed_files):
        normalize_and_compress_audio(raw_f, trim_f, max_pause_sec=0.16)

    # 140ms inter-turn transition gap
    pause_gap_file = work_dir / "pause_140ms.mp3"
    cmd_pause = [
        "ffmpeg", "-y", "-f", "lavfi",
        "-i", "anullsrc=r=44100:cl=stereo",
        "-t", "0.14",
        "-ar", "44100", "-ac", "2", "-b:a", "192k",
        str(pause_gap_file)
    ]
    subprocess.run(cmd_pause, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

    concat_list_file = work_dir / "concat_list.txt"
    turn_timings: List[Dict[str, Any]] = []
    current_offset_ms = 0.0

    with open(concat_list_file, "w", encoding="utf-8") as f:
        for idx, (turn, trim_f) in enumerate(zip(turns, trimmed_files)):
            dur_ms = get_audio_duration_ms(trim_f)
            turn_start = round(current_offset_ms)
            turn_end = round(current_offset_ms + dur_ms)

            turn_timings.append({
                "turn_index": idx,
                "speaker": turn["speaker"],
                "startMs": turn_start,
                "endMs": turn_end,
                "text": turn["text"]
            })

            f.write(f"file '{Path(trim_f).resolve().as_posix()}'\n")
            current_offset_ms += dur_ms

            if idx < len(turns) - 1:
                f.write(f"file '{pause_gap_file.resolve().as_posix()}'\n")
                current_offset_ms += 140.0

    cmd_concat = [
        "ffmpeg", "-y", "-f", "concat", "-safe", "0",
        "-i", str(concat_list_file),
        "-ar", "44100", "-ac", "2", "-b:a", "192k",
        str(final_audio_path)
    ]
    subprocess.run(cmd_concat, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    print(f"✅ Master duo audio created: {final_audio_path} (Duration: {current_offset_ms/1000:.2f}s)")

    return turn_timings


def transcribe_audio(
    audio_path: str | Path,
    output_json: Optional[str | Path] = None,
    model_size: str = "base.en"
) -> Tuple[List[Dict[str, Any]], float]:
    """
    Transcribes word-level timestamps using Faster-Whisper.
    Attempts NVIDIA CUDA GPU float16 acceleration first, with automatic fallback to CPU int8.
    Produces canonical WordTimestamp structures with startMs/endMs and start/end aliases.
    """
    from faster_whisper import WhisperModel
    import ctranslate2

    audio_path = Path(audio_path)
    print(f"🚀 Transcribing frame-accurate word timestamps with Faster-Whisper ({model_size})...")

    device = "cpu"
    comp_type = "int8"
    segments = None

    if ctranslate2.get_cuda_device_count() > 0:
        try:
            model = WhisperModel(model_size, device="cuda", compute_type="float16")
            seg_gen, info = model.transcribe(str(audio_path), word_timestamps=True, language="en", beam_size=5)
            segments = list(seg_gen)
            device = "cuda"
            comp_type = "float16"
        except Exception as e:
            print(f"   ⚠️ CUDA Notice ({e}), falling back to CPU int8 Whisper...")
            model = WhisperModel(model_size, device="cpu", compute_type="int8")
            seg_gen, info = model.transcribe(str(audio_path), word_timestamps=True, language="en", beam_size=5)
            segments = list(seg_gen)
            device = "cpu"
            comp_type = "int8"
    else:
        model = WhisperModel(model_size, device="cpu", compute_type="int8")
        seg_gen, info = model.transcribe(str(audio_path), word_timestamps=True, language="en", beam_size=5)
        segments = list(seg_gen)

    print(f"   Compute Device: {device} ({comp_type})")

    words_list: List[Dict[str, Any]] = []
    for seg in segments:
        if seg.words:
            for w in seg.words:
                clean_word = w.word.strip()
                if clean_word:
                    start_ms = round(w.start * 1000)
                    end_ms = round(w.end * 1000)
                    prob = round(w.probability, 3) if hasattr(w, "probability") and w.probability is not None else 1.0
                    words_list.append({
                        "word": clean_word,
                        "startMs": start_ms,
                        "endMs": end_ms,
                        "start": start_ms,
                        "end": end_ms,
                        "confidence": prob,
                    })

    if output_json:
        out_j = Path(output_json)
        out_j.parent.mkdir(parents=True, exist_ok=True)
        with open(out_j, "w", encoding="utf-8") as f:
            json.dump(words_list, f, indent=2, ensure_ascii=False)
        print(f"✅ Transcribed {len(words_list)} words -> {out_j}")

    duration_sec = (words_list[-1]["endMs"] / 1000.0) if words_list else (info.duration if 'info' in locals() else 0.0)
    return words_list, duration_sec


def transcribe_and_attribute_speakers(
    audio_path: Path,
    transcript_json: Path,
    segments_json: Path,
    turn_timings: List[Dict[str, Any]],
    model_size: str = "base.en"
) -> Tuple[List[Dict[str, Any]], float]:
    """
    Transcribes audio using Faster-Whisper and assigns speaker identity to each word
    using deterministic turn time boundaries.
    """
    from faster_whisper import WhisperModel
    import ctranslate2

    print("🚀 Transcribing frame-accurate word timestamps with speaker attribution...")
    device = "cpu"
    comp_type = "int8"
    segments = None

    if ctranslate2.get_cuda_device_count() > 0:
        try:
            model = WhisperModel(model_size, device="cuda", compute_type="float16")
            seg_gen, info = model.transcribe(str(audio_path), word_timestamps=True, language="en", beam_size=5)
            segments = list(seg_gen)
            device = "cuda"
            comp_type = "float16"
        except Exception as e:
            print(f"   ⚠️ CUDA Notice ({e}), falling back to CPU int8 Whisper...")
            model = WhisperModel(model_size, device="cpu", compute_type="int8")
            seg_gen, info = model.transcribe(str(audio_path), word_timestamps=True, language="en", beam_size=5)
            segments = list(seg_gen)
    else:
        model = WhisperModel(model_size, device="cpu", compute_type="int8")
        seg_gen, info = model.transcribe(str(audio_path), word_timestamps=True, language="en", beam_size=5)
        segments = list(seg_gen)

    words_list: List[Dict[str, Any]] = []

    def get_speaker_for_time(mid_ms: float) -> str:
        for t in turn_timings:
            if t["startMs"] <= mid_ms <= t["endMs"] + 80:
                return t["speaker"]
        closest = min(turn_timings, key=lambda t: min(abs(mid_ms - t["startMs"]), abs(mid_ms - t["endMs"])))
        return closest["speaker"]

    for seg in segments:
        if seg.words:
            for w in seg.words:
                clean_word = w.word.strip()
                if not clean_word:
                    continue
                start_ms = round(w.start * 1000)
                end_ms = round(w.end * 1000)
                mid_ms = (start_ms + end_ms) / 2.0
                speaker = get_speaker_for_time(mid_ms)
                prob = round(w.probability, 3) if hasattr(w, "probability") and w.probability is not None else 1.0

                words_list.append({
                    "word": clean_word,
                    "startMs": start_ms,
                    "endMs": end_ms,
                    "start": start_ms,
                    "end": end_ms,
                    "confidence": prob,
                    "speaker": speaker,
                })

    transcript_json.parent.mkdir(parents=True, exist_ok=True)
    with open(transcript_json, "w", encoding="utf-8") as f:
        json.dump(words_list, f, indent=2, ensure_ascii=False)

    segments_json.parent.mkdir(parents=True, exist_ok=True)
    with open(segments_json, "w", encoding="utf-8") as f:
        json.dump(turn_timings, f, indent=2, ensure_ascii=False)

    duration_sec = info.duration if 'info' in locals() else (words_list[-1]["endMs"] / 1000.0 if words_list else 0.0)
    print(f"✅ Transcribed {len(words_list)} words across {len(turn_timings)} speaker turns ({duration_sec:.2f}s).")
    print(f"✅ Saved transcript to {transcript_json}")
    print(f"✅ Saved speaker segments to {segments_json}")

    return words_list, duration_sec


def extract_facecam_audio(
    video_source: str | Path,
    dest_video: str | Path,
    dest_audio: str | Path
) -> None:
    """Copies creator facecam video and extracts 44.1kHz stereo audio."""
    v_src = Path(video_source)
    d_vid = Path(dest_video)
    d_aud = Path(dest_audio)

    d_vid.parent.mkdir(parents=True, exist_ok=True)
    d_aud.parent.mkdir(parents=True, exist_ok=True)

    print(f"🎬 Extracting native voice audio from video: {v_src}...")
    shutil.copy2(str(v_src), str(d_vid))
    cmd = [
        "ffmpeg", "-y", "-i", str(v_src),
        "-vn", "-ar", "44100", "-ac", "2", "-b:a", "192k",
        str(d_aud)
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"✅ Native master audio saved to: {d_aud}")
    print(f"✅ Facecam video saved to: {d_vid}")


async def generate_voiceover(
    script_text: str,
    audio_path: str | Path,
    transcript_path: Optional[str | Path] = None,
    voice: str = "en-US-AvaMultilingualNeural",
    rate: str = "+8%",
) -> Tuple[List[Dict[str, Any]], float]:
    """
    Unified Single-Step Audio Pipeline:
    Synthesizes neural voiceover audio, compresses pauses, and transcribes word-level timestamps.
    Returns: (words_list, duration_sec)
    """
    await synthesize_speech(script_text, audio_path, voice=voice, rate=rate)
    return transcribe_audio(audio_path, transcript_path)


async def process_voiceover(
    script_text: str,
    topic: str,
    root_dir: str | Path = None,
    voice: str = "en-US-AvaMultilingualNeural"
) -> Tuple[List[Dict[str, Any]], float]:
    """Top-level pipeline runner for standard solo voiceover."""
    root = Path(root_dir) if root_dir else ROOT_DIR
    name = re.sub(r"[^a-z0-9_]+", "_", topic.lower()).strip("_")
    public_dir = root / "public" / name
    clips_dir = root / "src" / "clips" / name

    final_mp3 = public_dir / "voiceover.mp3"
    transcript_json = clips_dir / "transcript.json"

    words, dur = await generate_voiceover(script_text, final_mp3, transcript_json, voice=voice)
    print(f"\n🎉 Voiceover pipeline complete for '{name}'! ({dur:.2f}s)")
    return words, dur


async def process_dialogue(
    script_text: str,
    topic: str,
    root_dir: Path = None
) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]], float]:
    """Top-level pipeline runner for Conversational Duo (Judy & Andrew)."""
    root = root_dir or ROOT_DIR
    name = re.sub(r"[^a-z0-9_]+", "_", topic.lower()).strip("_")

    public_dir = root / "public" / name
    clips_dir = root / "src" / "clips" / name
    work_dir = public_dir / ".dialogue_temp"

    final_audio = public_dir / "voiceover.mp3"
    transcript_json = clips_dir / "transcript.json"
    segments_json = clips_dir / "speaker_segments.json"

    turns = parse_dialogue_turns(script_text)
    print(f"💬 Found {len(turns)} turns in script for '{topic}':")
    for idx, t in enumerate(turns):
        print(f"   [{idx+1}] {t['speaker'].upper()}: {t['text'][:60]}...")

    turn_timings = await build_duo_audio(turns, work_dir, final_audio)
    words_list, duration_sec = transcribe_and_attribute_speakers(
        final_audio, transcript_json, segments_json, turn_timings
    )

    shutil.rmtree(work_dir, ignore_errors=True)
    print(f"\n🎉 Conversational Duo Pipeline complete for '{name}'!")
    return words_list, turn_timings, duration_sec


def main():
    parser = argparse.ArgumentParser(description="RightMotion Canonical Voiceover & Transcription Engine")
    parser.add_argument("--text", type=str, help="Script text string")
    parser.add_argument("--file", type=str, help="Path to text file containing script")
    parser.add_argument("--topic", type=str, required=True, help="Clip folder name (e.g. strength, focus, habit)")
    parser.add_argument("--voice", type=str, default="en-US-AvaMultilingualNeural", help="Neural TTS voice name")
    parser.add_argument("--duo", action="store_true", help="Synthesize conversational duo dialogue (Judy & Andrew)")
    args = parser.parse_args()

    if args.text:
        text = args.text
    elif args.file:
        with open(args.file, "r", encoding="utf-8") as f:
            text = f.read()
    else:
        print("Error: Either --text or --file must be specified.")
        sys.exit(1)

    if args.duo:
        asyncio.run(process_dialogue(text, args.topic))
    else:
        asyncio.run(process_voiceover(text, args.topic, voice=args.voice))


if __name__ == "__main__":
    main()
