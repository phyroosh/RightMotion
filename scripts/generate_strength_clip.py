import sys
import os
import site
import asyncio
import json
import subprocess
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

# Register CUDA DLLs
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

SCRIPT_TEXT = """A lot of men think being strong means never admitting they’re struggling.
You keep everything inside.
You act like nothing bothers you.
Because somehow, opening up feels weak.
But real strength isn’t pretending you don’t have problems.
It’s knowing when you need help, and being smart enough to ask for it.
A man who can calmly say, “I’m not okay,” isn’t less masculine.
He’s self-aware.
He knows that ignoring a problem doesn’t make it disappear.
Sometimes the strongest thing you can do is talk to someone you trust, think clearly, and deal with the problem instead of hiding it.
You don’t have to carry everything alone just to prove you can carry it.
Real strength isn’t having no weakness.
It’s having the courage to face what’s actually there."""

# Clean text for snappy neural flow (no long ellipses or triple dots)
TTS_TEXT = (
    SCRIPT_TEXT
    .replace("…", ",")
    .replace("\n\n", " ")
    .replace("\n", " ")
)

OUT_AUDIO_DIR = r"C:\Toptier Products\RightClips\public\strength"
OUT_TRANSCRIPT_DIR = r"C:\Toptier Products\RightClips\src\clips\strength"
os.makedirs(OUT_AUDIO_DIR, exist_ok=True)
os.makedirs(OUT_TRANSCRIPT_DIR, exist_ok=True)

RAW_MP3 = os.path.join(OUT_AUDIO_DIR, "raw_voiceover.mp3")
FINAL_MP3 = os.path.join(OUT_AUDIO_DIR, "voiceover.mp3")
TRANSCRIPT_JSON = os.path.join(OUT_TRANSCRIPT_DIR, "transcript.json")

async def generate_tts():
    print("Synthesizing fast, natural voiceover with JennyNeural (+10% rate)...")
    communicate = edge_tts.Communicate(
        text=TTS_TEXT,
        voice="en-US-JennyNeural",
        rate="+10%",
        pitch="+0Hz"
    )
    await communicate.save(RAW_MP3)
    print(f"Raw TTS saved to {RAW_MP3}")

def trim_silences():
    """
    Compress silences longer than 0.20s to snappy gaps using ffmpeg silenceremove
    """
    print("Compressing long pauses for tight, snappy short-form pacing...")
    cmd = [
        "ffmpeg", "-y", "-i", RAW_MP3,
        "-af", "silenceremove=stop_periods=-1:stop_duration=0.20:stop_threshold=-35dB:detection=peak",
        "-b:a", "192k",
        FINAL_MP3
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    print(f"Tight, pause-fixed voiceover saved to {FINAL_MP3}")

def transcribe():
    print("Transcribing word-level timestamps using Faster-Whisper...")
    try:
        model = WhisperModel("base.en", device="cuda", compute_type="float16")
        segments, info = model.transcribe(FINAL_MP3, word_timestamps=True)
        segments = list(segments)
    except Exception as e:
        print(f"GPU Whisper notice: {e}, falling back to CPU...")
        model = WhisperModel("base.en", device="cpu", compute_type="int8")
        segments, info = model.transcribe(FINAL_MP3, word_timestamps=True)
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

    print(f"Audio Duration: {info.duration:.2f}s, Words Count: {len(words_list)}")
    with open(TRANSCRIPT_JSON, "w", encoding="utf-8") as f:
        json.dump(words_list, f, indent=2, ensure_ascii=False)
    print(f"Transcript saved to {TRANSCRIPT_JSON}")

if __name__ == "__main__":
    asyncio.run(generate_tts())
    trim_silences()
    transcribe()
