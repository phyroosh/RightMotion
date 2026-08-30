import asyncio
import json
import os
import site
import sys
from pathlib import Path

# Force UTF-8 output encoding for Windows terminals
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

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

script_text = """Have you ever noticed how you can be surrounded by people online… and still feel completely alone?
Because social media gives us connection without always giving us closeness.
You can watch someone’s life, like their post, reply to their story… but still never have that one person you can actually sit with and say, “I’m not okay.”
And because everyone looks like they’re doing something, going somewhere, becoming someone… you start feeling like you’re the only one who’s lost.
We’re more connected than ever.
But sometimes, what we really need isn’t more people on a screen.
It’s one real person who makes you feel safe enough to be yourself."""

async def main():
    audio_path = Path("public/loneliness/voiceover.mp3")
    audio_path.parent.mkdir(parents=True, exist_ok=True)
    
    print("🎙️ Synthesizing neural speech with en-US-AvaNeural...")
    communicate = edge_tts.Communicate(text=script_text, voice="en-US-AvaNeural", rate="+3%")
    await communicate.save(str(audio_path))
    print(f"✅ Voiceover saved to: {audio_path}")

    print("📝 Transcribing with faster-whisper...")
    can_cuda = False
    try:
        if ctranslate2.get_cuda_device_count() > 0:
            can_cuda = True
    except Exception:
        can_cuda = False
    device = "cuda" if can_cuda else "cpu"
    comp_type = "float16" if device == "cuda" else "int8"
    print(f"   Using compute device: {device} ({comp_type})")
    
    model = WhisperModel("base.en", device=device, compute_type=comp_type)
    segments, _ = model.transcribe(str(audio_path), word_timestamps=True, language="en", beam_size=5)
    
    words_list = []
    for s in segments:
        for w in s.words:
            word_clean = w.word.strip()
            if word_clean:
                words_list.append({
                    "word": word_clean,
                    "start": round(w.start * 1000),
                    "end": round(w.end * 1000),
                    "startMs": round(w.start * 1000),
                    "endMs": round(w.end * 1000),
                    "confidence": round(w.probability, 3)
                })
                
    transcript_path = Path("src/clips/loneliness/transcript.json")
    transcript_path.parent.mkdir(parents=True, exist_ok=True)
    with open(transcript_path, "w", encoding="utf-8") as f:
        json.dump(words_list, f, indent=2, ensure_ascii=False)
        
    duration_sec = words_list[-1]["end"] / 1000.0
    print(f"✅ Transcribed {len(words_list)} words, duration: {duration_sec:.2f}s ({words_list[-1]['end']}ms)")

if __name__ == "__main__":
    asyncio.run(main())
