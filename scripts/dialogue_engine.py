#!/usr/bin/env python3
"""
RightClips Conversational Duo Dialogue Engine (Judy & Andrew)

Features:
1. Turn-based multi-speaker synthesis:
   - Judy (Hero Guide): en-US-AvaMultilingualNeural (rate="+8%")
   - Andrew (Viewer Voice / Questioner): en-US-SteffanNeural (rate="+7%")
2. Dynamic pacing & pause compression:
   - 140ms snappy inter-turn transitions for maximum short-form retention.
3. Standardized 44.1kHz Stereo audio pipeline for flawless PyAV / Faster-Whisper decoding.
4. Word-level transcription with deterministic speaker attribution via Faster-Whisper.
5. Generates both word-level transcript.json and macro speaker_segments.json.
"""

import sys
import os
import re
import site
import argparse
import asyncio
import json
import shutil
import subprocess
from pathlib import Path
from typing import List, Dict, Any, Tuple

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

# Automatically register CUDA DLLs if available
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
from faster_whisper import WhisperModel

VOICE_MAP = {
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
    if not text:
        return ""
    pattern = re.compile(
        r"\{\s*(?:health|finance|self\s*improv?ement|facecam|no\s*topics?|no\s*meta|meta|no\s*memes?|duo|meme(?:\s*:\s*[^}]+)?|(?:product|pdf)\s*:\s*[^,}]+,\s*page\s*:\s*\d+)\s*\}",
        re.IGNORECASE,
    )
    cleaned = pattern.sub("", text)
    cleaned = re.sub(r"[{}\\]", "", cleaned)
    return cleaned.strip()

def normalize_text(text: str) -> str:
    return (
        text.replace("…", ",")
        .replace("...", ",")
        .replace("\r\n", "\n")
        .replace("\n\n", " ")
        .replace("\n", " ")
        .strip()
    )

def parse_dialogue_turns(raw_text: str) -> List[Dict[str, str]]:
    """
    Parses dialogue script with JUDY: and ANDREW: tags into sequential speaker turns.
    Handles single-line, multi-line, and mixed formats.
    """
    cleaned_script = sanitize_tags(raw_text)
    
    # Strip metadata or pinned comment blocks if present
    meta_match = re.search(r"\[METADATA\](.*?)(?:\[VOICEOVER\]|\[PINNED COMMENT\]|$)", cleaned_script, re.DOTALL | re.IGNORECASE)
    if meta_match:
        cleaned_script = cleaned_script[meta_match.end():]
    vo_match = re.search(r"\[VOICEOVER\]\s*(.*?)(?:\[PINNED COMMENT\]|$)", cleaned_script, re.DOTALL | re.IGNORECASE)
    if vo_match:
        cleaned_script = vo_match.group(1)
    elif "[PINNED COMMENT]" in cleaned_script:
        cleaned_script = cleaned_script.split("[PINNED COMMENT]")[0]

    cleaned_script = cleaned_script.strip()
    pattern = re.compile(r"(?:^|\s+)(judy|andrew)\s*:\s*", re.IGNORECASE)
    matches = list(pattern.finditer(cleaned_script))

    turns: List[Dict[str, str]] = []

    if matches:
        if matches[0].start() > 0:
            init_text = normalize_text(cleaned_script[:matches[0].start()])
            if init_text:
                turns.append({"speaker": "judy", "text": init_text})

        for i, m in enumerate(matches):
            speaker = m.group(1).lower()
            start = m.end()
            end = matches[i + 1].start() if i + 1 < len(matches) else len(cleaned_script)
            text = normalize_text(cleaned_script[start:end])
            if text:
                turns.append({"speaker": speaker, "text": text})
    else:
        if cleaned_script:
            turns.append({"speaker": "judy", "text": normalize_text(cleaned_script)})

    return turns

def get_audio_duration_ms(audio_file: str) -> float:
    cmd = [
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        audio_file
    ]
    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, check=True)
    return float(result.stdout.strip()) * 1000.0

async def synthesize_turn(text: str, speaker: str, out_path: str):
    cfg = VOICE_MAP.get(speaker, VOICE_MAP["judy"])
    comm = edge_tts.Communicate(
        text=text,
        voice=cfg["voice"],
        rate=cfg["rate"],
        pitch=cfg["pitch"]
    )
    await comm.save(out_path)

def normalize_and_compress_turn(in_path: str, out_path: str, max_pause_sec: float = 0.16):
    """
    Trims awkward pauses and normalizes audio to 44100Hz stereo 192k.
    """
    cmd = [
        "ffmpeg", "-y", "-i", in_path,
        "-af", f"silenceremove=stop_periods=-1:stop_duration={max_pause_sec}:stop_threshold=-35dB:detection=peak",
        "-ar", "44100", "-ac", "2", "-b:a", "192k",
        out_path
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

async def build_duo_audio(turns: List[Dict[str, str]], work_dir: Path, final_audio_path: Path) -> List[Dict[str, Any]]:
    """
    Synthesizes each turn, normalizes to 44.1kHz stereo, concatenates with 140ms gaps,
    and returns exact turn timing metadata [startMs, endMs, speaker, text].
    """
    work_dir.mkdir(parents=True, exist_ok=True)
    final_audio_path.parent.mkdir(parents=True, exist_ok=True)
    
    # 1. Synthesize all turns concurrently
    tasks = []
    raw_files = []
    trimmed_files = []
    
    for idx, turn in enumerate(turns):
        raw_f = work_dir / f"turn_{idx}_{turn['speaker']}_raw.mp3"
        trim_f = work_dir / f"turn_{idx}_{turn['speaker']}_norm.mp3"
        raw_files.append(str(raw_f))
        trimmed_files.append(str(trim_f))
        tasks.append(synthesize_turn(turn["text"], turn["speaker"], str(raw_f)))
    
    print(f"🎙️ Synthesizing {len(turns)} dialogue turns with Ava (Judy) & Steffan (Andrew)...")
    await asyncio.gather(*tasks)

    # 2. Compress silences and normalize each turn to 44.1kHz stereo
    for raw_f, trim_f in zip(raw_files, trimmed_files):
        try:
            normalize_and_compress_turn(raw_f, trim_f, max_pause_sec=0.16)
        except Exception:
            cmd_fallback = [
                "ffmpeg", "-y", "-i", raw_f,
                "-ar", "44100", "-ac", "2", "-b:a", "192k",
                trim_f
            ]
            subprocess.run(cmd_fallback, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

    # 3. Create a 140ms standardized silence transition gap (44.1kHz stereo)
    pause_gap_file = work_dir / "pause_140ms.mp3"
    cmd_pause = [
        "ffmpeg", "-y", "-f", "lavfi",
        "-i", "anullsrc=r=44100:cl=stereo",
        "-t", "0.14",
        "-ar", "44100", "-ac", "2", "-b:a", "192k",
        str(pause_gap_file)
    ]
    subprocess.run(cmd_pause, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

    # 4. Build concat list and calculate precise turn boundaries
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

            # Add inter-turn pause if not last turn
            if idx < len(turns) - 1:
                f.write(f"file '{pause_gap_file.resolve().as_posix()}'\n")
                current_offset_ms += 140.0

    # 5. Concatenate with ffmpeg
    cmd_concat = [
        "ffmpeg", "-y", "-f", "concat", "-safe", "0",
        "-i", str(concat_list_file),
        "-ar", "44100", "-ac", "2", "-b:a", "192k",
        str(final_audio_path)
    ]
    subprocess.run(cmd_concat, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    print(f"✅ Master duo audio created: {final_audio_path} (Duration: {current_offset_ms/1000:.2f}s)")

    return turn_timings

def transcribe_and_attribute_speakers(
    audio_path: Path,
    transcript_json: Path,
    segments_json: Path,
    turn_timings: List[Dict[str, Any]]
) -> Tuple[List[Dict[str, Any]], float]:
    """
    Transcribes audio using faster-whisper and assigns speaker identity to each word
    using deterministic turn time boundaries.
    """
    print("🚀 Transcribing frame-accurate word timestamps with speaker attribution...")
    try:
        model = WhisperModel("base.en", device="cuda", compute_type="float16")
        seg_gen, info = model.transcribe(str(audio_path), word_timestamps=True, language="en", beam_size=5)
        segments = list(seg_gen)
    except Exception as e:
        print(f"⚠️ CUDA Notice: {e}, falling back to CPU Whisper...")
        model = WhisperModel("base.en", device="cpu", compute_type="int8")
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
                
                words_list.append({
                    "word": clean_word,
                    "startMs": start_ms,
                    "endMs": end_ms,
                    "speaker": speaker
                })

    # Save transcript.json
    transcript_json.parent.mkdir(parents=True, exist_ok=True)
    with open(transcript_json, "w", encoding="utf-8") as f:
        json.dump(words_list, f, indent=2, ensure_ascii=False)

    # Save speaker_segments.json
    segments_json.parent.mkdir(parents=True, exist_ok=True)
    with open(segments_json, "w", encoding="utf-8") as f:
        json.dump(turn_timings, f, indent=2, ensure_ascii=False)

    duration_sec = info.duration
    print(f"✅ Transcribed {len(words_list)} words across {len(turn_timings)} speaker turns ({duration_sec:.2f}s).")
    print(f"✅ Saved transcript to {transcript_json}")
    print(f"✅ Saved speaker segments to {segments_json}")

    return words_list, duration_sec

async def process_dialogue(script_text: str, topic: str, root_dir: Path = None):
    root = root_dir or Path(__file__).resolve().parent.parent
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
    words_list, duration_sec = transcribe_and_attribute_speakers(final_audio, transcript_json, segments_json, turn_timings)

    # Cleanup temp audio files
    shutil.rmtree(work_dir, ignore_errors=True)
    print(f"\n🎉 Conversational Duo Pipeline complete for '{name}'!")
    return words_list, turn_timings, duration_sec

def main():
    parser = argparse.ArgumentParser(description="RightClips Judy & Andrew Duo Dialogue Engine")
    parser.add_argument("--text", type=str, help="Script text with JUDY: and ANDREW: turns")
    parser.add_argument("--file", type=str, help="Path to text file containing dialogue script")
    parser.add_argument("--topic", type=str, required=True, help="Topic / clip name")
    args = parser.parse_args()

    if args.text:
        text = args.text
    elif args.file:
        with open(args.file, "r", encoding="utf-8") as f:
            text = f.read()
    else:
        print("Error: Either --text or --file must be specified.")
        sys.exit(1)

    asyncio.run(process_dialogue(text, args.topic))

if __name__ == "__main__":
    main()
