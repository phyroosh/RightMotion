import asyncio
import json
import os
import site
from pathlib import Path

# Setup CUDA
for s in site.getsitepackages():
    for sub in ['nvidia/cublas/bin', 'nvidia/cudnn/bin', 'nvidia/cuda_nvrtc/bin']:
        p = os.path.join(s, sub)
        if os.path.exists(p):
            try:
                os.add_dll_directory(p)
                os.environ['PATH'] = p + os.pathsep + os.environ.get('PATH', '')
            except Exception:
                pass

import edge_tts
from faster_whisper import WhisperModel
import ctranslate2

SCRIPT = """Why can a smart person still keep making the same bad choices?

Because your environment is quietly shaping you all the time.

You can have discipline, goals, even a really strong mindset… but if the people around you normalize procrastination, negativity, or unhealthy habits, resisting that every day gets exhausting.

Your brain adapts to what feels normal.

So sometimes, you don't need more motivation. You need a different environment.

Change what you see. Who you spend time with. What you make easy.

Because even a very smart mind struggles when it’s constantly surrounded by things pulling it in the wrong direction."""

async def main():
    audio_path = Path("public/environment/voiceover.mp3")
    transcript_path = Path("src/clips/environment/transcript.json")
    audio_path.parent.mkdir(parents=True, exist_ok=True)
    transcript_path.parent.mkdir(parents=True, exist_ok=True)

    print("1. Synthesizing TTS...")
    comm = edge_tts.Communicate(text=SCRIPT, voice="en-US-AvaNeural", rate="+3%")
    await comm.save(str(audio_path))
    print("   Audio saved to:", audio_path)

    print("2. Transcribing with faster-whisper...")
    can_cuda = False
    try:
        if ctranslate2.get_cuda_device_count() > 0:
            can_cuda = True
    except Exception:
        can_cuda = False
    device = "cuda" if can_cuda else "cpu"
    comp_type = "float16" if device == "cuda" else "int8"
    print(f"   Using device: {device} ({comp_type})")

    model = WhisperModel("base.en", device=device, compute_type=comp_type)
    segments, _ = model.transcribe(str(audio_path), word_timestamps=True, language="en", beam_size=5)

    words = []
    for s in segments:
        for w in s.words:
            word_clean = w.word.strip()
            if word_clean:
                words.append({
                    "word": word_clean,
                    "start": round(w.start * 1000),
                    "end": round(w.end * 1000),
                    "confidence": round(w.probability, 3)
                })

    with open(transcript_path, "w", encoding="utf-8") as f:
        json.dump(words, f, indent=2, ensure_ascii=False)

    print(f"   Saved {len(words)} words to {transcript_path}. Total duration: {words[-1]['end']}ms")

if __name__ == "__main__":
    asyncio.run(main())
