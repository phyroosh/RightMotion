import os
import sys
import json
import subprocess
import site
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

from faster_whisper import WhisperModel

source_audio = r"C:\Users\Qwen\Desktop\WhatsApp Audio 2026-08-27 at 8.51.59 AM.mpeg"
target_dir = r"C:\Toptier Products\RightClips\public\lofi_song"
clip_dir = r"C:\Toptier Products\RightClips\src\clips\lofi_song"
os.makedirs(target_dir, exist_ok=True)
os.makedirs(clip_dir, exist_ok=True)

target_mp3 = os.path.join(target_dir, "audio.mp3")

print(f"🔄 Checking audio at {target_mp3}...")
if not os.path.exists(target_mp3):
    cmd = ["ffmpeg", "-y", "-i", source_audio, "-b:a", "320k", target_mp3]
    subprocess.run(cmd, check=True)
    print("✅ Converted audio successfully.")
else:
    print("✅ Audio already exists, skipping conversion.")

# Get exact duration
cmd_probe = ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", target_mp3]
res = subprocess.run(cmd_probe, capture_output=True, text=True, check=True)
duration = float(res.stdout.strip())
print(f"🎵 Audio Duration: {duration:.2f} seconds ({duration * 1000:.0f} ms)")

# Transcribe with Faster-Whisper
print("🚀 Transcribing singing/speech timestamps with Faster-Whisper (base) — language=Hindi...")
try:
    model = WhisperModel("base", device="cuda", compute_type="float16")
    segments, info = model.transcribe(target_mp3, language="hi", word_timestamps=True, task="transcribe")
    segments = list(segments)
except Exception as e:
    print(f"⚠️ GPU Notice ({e}), falling back to CPU...")
    model = WhisperModel("base", device="cpu", compute_type="int8")
    segments, info = model.transcribe(target_mp3, language="hi", word_timestamps=True, task="transcribe")
    segments = list(segments)

raw_transcripts = []
for s in segments:
    print(f"[{s.start:6.2f}s - {s.end:6.2f}s] {s.text}")
    seg_words = []
    if s.words:
        for w in s.words:
            seg_words.append({
                "word": w.word.strip(),
                "startMs": int(w.start * 1000),
                "endMs": int(w.end * 1000)
            })
    raw_transcripts.append({
        "text": s.text.strip(),
        "startMs": int(s.start * 1000),
        "endMs": int(s.end * 1000),
        "words": seg_words
    })

raw_json_path = os.path.join(clip_dir, "raw_whisper.json")
with open(raw_json_path, "w", encoding="utf-8") as f:
    json.dump(raw_transcripts, f, indent=2, ensure_ascii=False)

print(f"✅ Raw Whisper timestamps saved to {raw_json_path}")
