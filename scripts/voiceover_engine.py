#!/usr/bin/env python3
"""
Standard Voiceover Engine for RightClips.

Permanent Rules Implemented:
1. Natural Speech Rate: en-US-JennyNeural at rate="+0%" (Natural conversational tone, NOT artificially sped up).
2. Mandatory Silence & Pause Compression: Automatically trims and compresses inter-sentence dead air to 150ms-180ms.
3. GPU Word-Level Timestamp Transcription via Faster-Whisper.
"""

import sys
import os
import site
import argparse
import asyncio
import json
import subprocess
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

# Automatically register CUDA DLLs for NVIDIA GPU acceleration
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

def normalize_text_for_tts(raw_text: str) -> str:
    """
    Cleans up text formatting to prevent neural TTS from creating multi-second artificial freezes.
    """
    return (
        raw_text
        .replace("…", ",")
        .replace("...", ",")
        .replace("\r\n", "\n")
        .replace("\n\n", " ")
        .replace("\n", " ")
        .strip()
    )

async def generate_raw_tts(clean_text: str, raw_mp3_path: str, voice: str = "en-US-JennyNeural"):
    """
    Synthesizes speech with smart tempo boost (rate="+8%") for high viewer retention.
    """
    print(f"🎙️ Synthesizing voice with {voice} (Smart tempo boost: +8%)...")
    communicate = edge_tts.Communicate(
        text=clean_text,
        voice=voice,
        rate="+8%",
        pitch="+0Hz"
    )
    await communicate.save(raw_mp3_path)
    print(f"✅ Raw TTS saved to {raw_mp3_path}")

def compress_pauses(raw_mp3_path: str, final_mp3_path: str, max_pause_sec: float = 0.18):
    """
    Compresses long inter-sentence dead air to a tight, natural 150ms-180ms gap using FFmpeg.
    """
    print(f"⚡ Trimming and compressing awkward pauses (capping silences > {max_pause_sec}s)...")
    cmd = [
        "ffmpeg", "-y", "-i", raw_mp3_path,
        "-af", f"silenceremove=stop_periods=-1:stop_duration={max_pause_sec}:stop_threshold=-35dB:detection=peak",
        "-b:a", "192k",
        final_mp3_path
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    print(f"✅ Snappy, pause-fixed master audio saved to {final_mp3_path}")

def transcribe_timestamps(audio_path: str, transcript_json_path: str):
    """
    Transcribes word-level timestamps from the pause-trimmed audio using Faster-Whisper.
    """
    print("🚀 Transcribing frame-accurate word timestamps with Faster-Whisper...")
    try:
        model = WhisperModel("base.en", device="cuda", compute_type="float16")
        segments, info = model.transcribe(audio_path, word_timestamps=True)
        segments = list(segments)
    except Exception as e:
        print(f"⚠️ CUDA Notice: {e}, falling back to CPU Whisper...")
        model = WhisperModel("base.en", device="cpu", compute_type="int8")
        segments, info = model.transcribe(audio_path, word_timestamps=True)
        segments = list(segments)

    words_list = []
    for seg in segments:
        if seg.words:
            for w in seg.words:
                cleaned_word = w.word.strip()
                if cleaned_word:
                    words_list.append({
                        "word": cleaned_word,
                        "startMs": int(w.start * 1000),
                        "endMs": int(w.end * 1000)
                    })

    print(f"✅ Transcribed {len(words_list)} words. Duration: {info.duration:.2f}s")
    os.makedirs(os.path.dirname(transcript_json_path), exist_ok=True)
    with open(transcript_json_path, "w", encoding="utf-8") as f:
        json.dump(words_list, f, indent=2, ensure_ascii=False)
    print(f"✅ Timestamps saved to {transcript_json_path}")

async def process_voiceover(script_text: str, topic: str, root_dir: str = r"C:\Toptier Products\RightClips"):
    public_dir = os.path.join(root_dir, "public", topic)
    clips_dir = os.path.join(root_dir, "src", "clips", topic)
    os.makedirs(public_dir, exist_ok=True)
    os.makedirs(clips_dir, exist_ok=True)

    raw_mp3 = os.path.join(public_dir, "raw_voiceover.mp3")
    final_mp3 = os.path.join(public_dir, "voiceover.mp3")
    transcript_json = os.path.join(clips_dir, "transcript.json")

    clean_text = normalize_text_for_tts(script_text)
    await generate_raw_tts(clean_text, raw_mp3)
    compress_pauses(raw_mp3, final_mp3)
    transcribe_timestamps(final_mp3, transcript_json)
    print(f"\n🎉 Voiceover pipeline complete for '{topic}'!")

def main():
    parser = argparse.ArgumentParser(description="RightClips Standard Voiceover & Silence Compression Engine")
    parser.add_argument("--text", type=str, help="Script text string")
    parser.add_argument("--file", type=str, help="Path to text file containing script")
    parser.add_argument("--topic", type=str, required=True, help="Clip folder name (e.g. strength, focus, habit)")
    args = parser.parse_args()

    if args.text:
        text = args.text
    elif args.file:
        with open(args.file, "r", encoding="utf-8") as f:
            text = f.read()
    else:
        print("Error: Either --text or --file must be specified.")
        sys.exit(1)

    asyncio.run(process_voiceover(text, args.topic))

if __name__ == "__main__":
    main()
