#!/usr/bin/env python3
import asyncio
import json
import os
import site
from pathlib import Path

# Configure CUDA for ctranslate2 / faster-whisper on Windows
for s in site.getsitepackages():
    for sub in ["nvidia/cublas/bin", "nvidia/cudnn/bin", "nvidia/cuda_nvrtc/bin"]:
        p = os.path.join(s, sub)
        if os.path.exists(p):
            try:
                os.add_dll_directory(p)
                os.environ["PATH"] = p + os.pathsep + os.environ.get("PATH", "")
            except Exception:
                pass

SCRIPT_TEXT = (
    "Why does breaking your own promises start to feel like proof that you just can't change? "
    "You tell yourself, 'Tomorrow, I'll do it.' "
    "Then tomorrow comes… and you don't. "
    "After doing that for years, you stop trusting yourself. "
    "But here's the part people miss: you're not failing because you're lazy. "
    "You've trained your brain to expect your promises won't last. "
    "So don't rebuild your whole life overnight. "
    "Make one tiny promise today… and actually keep it. "
    "Not because that one thing changes everything. "
    "Because every time you keep your word to yourself, you slowly become someone you can trust again."
)

OUTPUT_AUDIO = Path("public/promises/voiceover.mp3")
OUTPUT_TRANSCRIPT = Path("src/clips/promises/transcript.json")

async def synthesize():
    import edge_tts
    OUTPUT_AUDIO.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_TRANSCRIPT.parent.mkdir(parents=True, exist_ok=True)

    print("[1/2] Synthesizing speech with edge-tts (en-US-AvaNeural)...")
    # Using rate="+3%" for crisp punchy rhythm
    communicate = edge_tts.Communicate(text=SCRIPT_TEXT, voice="en-US-AvaNeural", rate="+3%")
    await communicate.save(str(OUTPUT_AUDIO))
    print(f"      Saved voiceover to: {OUTPUT_AUDIO}")

def transcribe():
    from faster_whisper import WhisperModel
    import ctranslate2

    print("[2/2] Transcribing audio with faster-whisper (base.en)...")
    device = "cuda" if ctranslate2.get_cuda_device_count() > 0 else "cpu"
    compute_type = "float16" if device == "cuda" else "int8"
    print(f"      Using device: {device} ({compute_type})")

    model = WhisperModel("base.en", device=device, compute_type=compute_type)
    segments, info = model.transcribe(str(OUTPUT_AUDIO), word_timestamps=True, language="en", beam_size=5)

    words_list = []
    for segment in segments:
        for w in segment.words:
            clean_word = w.word.strip()
            if not clean_word:
                continue
            words_list.append({
                "word": clean_word,
                "start": round(w.start * 1000),
                "end": round(w.end * 1000),
                "confidence": round(w.probability, 3)
            })

    with open(OUTPUT_TRANSCRIPT, "w", encoding="utf-8") as f:
        json.dump(words_list, f, indent=2, ensure_ascii=False)

    print(f"      Extracted {len(words_list)} word timestamps -> {OUTPUT_TRANSCRIPT}")
    total_sec = words_list[-1]["end"] / 1000.0 if words_list else 0
    total_frames = int(total_sec * 30) + 15
    print(f"      Total Duration: {total_sec:.2f}s ({total_frames} frames @ 30fps)")

if __name__ == "__main__":
    asyncio.run(synthesize())
    transcribe()
