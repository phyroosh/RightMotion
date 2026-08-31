import asyncio
import json
import os
import sys
import site
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

import edge_tts
from faster_whisper import WhisperModel
import ctranslate2

SCRIPT_TEXT = """Ever say "yes" to something you really don't want to do, just because saying no feels awkward?

You don't need some huge explanation.

Try, "Nah, I'm gonna pass, but thanks for asking."

Or, "I can't do that, hope you get it."

And if they keep pushing? Just calmly repeat yourself. You don't have to argue.

The people worth keeping around won't need you to betray your own boundaries just to stay friends.

And honestly, saying no gets much easier once you realize you're allowed to."""

ROOT_DIR = Path(__file__).resolve().parent.parent

async def main():
    clip_name = "saying_no"
    audio_path = ROOT_DIR / "public" / clip_name / "voiceover.mp3"
    transcript_path = ROOT_DIR / "src" / "clips" / clip_name / "transcript.json"

    audio_path.parent.mkdir(parents=True, exist_ok=True)
    transcript_path.parent.mkdir(parents=True, exist_ok=True)

    print("🎙️ Synthesizing voiceover with en-US-AvaNeural...")
    communicate = edge_tts.Communicate(text=SCRIPT_TEXT, voice="en-US-AvaNeural", rate="+3%")
    await communicate.save(str(audio_path))
    print(f"✅ Saved voiceover to: {audio_path}")

    print("📝 Transcribing word timestamps with faster-whisper...")
    can_cuda = False
    try:
        if ctranslate2.get_cuda_device_count() > 0:
            can_cuda = True
    except Exception:
        can_cuda = False

    device = "cuda" if can_cuda else "cpu"
    comp_type = "float16" if device == "cuda" else "int8"
    print(f"Using device: {device} ({comp_type})")

    model = WhisperModel("base.en", device=device, compute_type=comp_type)
    segments, info = model.transcribe(str(audio_path), word_timestamps=True, language="en", beam_size=5)

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

    with open(transcript_path, "w", encoding="utf-8") as f:
        json.dump(words_list, f, indent=2, ensure_ascii=False)

    duration_sec = words_list[-1]["end"] / 1000.0 if words_list else 0
    print(f"✅ Transcribed {len(words_list)} words -> {transcript_path} ({duration_sec:.2f}s total)")

if __name__ == "__main__":
    asyncio.run(main())
