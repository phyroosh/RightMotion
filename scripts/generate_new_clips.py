import sys
import os
import site
import asyncio
import json
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

SCRIPT_GOGGINS = """People think David Goggins is just running on adrenaline all the time.

Like somehow he feels insanely motivated… and that’s why he can keep going when everyone else stops.

But that’s not how he explains it.

He uses something he calls the “Cookie Jar.”

When things get brutally hard, he mentally goes back to moments when he already survived something difficult.

His past wins remind him, “I’ve been here before. I know I can handle this.”

And sometimes, he deliberately remembers the emotions from those victories, using them to reignite that drive when his body and mind start begging him to stop.

So maybe the secret isn’t being fearless.

It’s having enough evidence from your own life to know…

“I’ve gotten through hard things before.”

And that can be surprisingly powerful when today gets heavy."""

SCRIPT_BREAKS = """You know what’s underrated?

Taking a really long break.

Not quitting.

Just… stepping away for a while.

Because sometimes you’re not lazy.

You’re exhausted.

And forcing yourself to keep going doesn’t always make you stronger. Sometimes it just makes you hate the thing you once cared about.

Rest.

Disappear for a bit.

Take the pressure off.

But keep one tiny part of you that still says, “I’m not done.”

You can stop for weeks.

You can lose momentum.

You can even feel like you’ve fallen behind.

And when you’re ready, you can start again.

Your journey doesn’t become meaningless just because you paused it.

Sometimes the healthiest thing you can do…

is rest long enough to want to come back."""

async def generate_and_transcribe(name, script_text, audio_dir, json_path):
    print(f"\n🎙️ Generating Fast Female Voice for: {name} (en-US-JennyNeural, +8% rate)...")
    os.makedirs(audio_dir, exist_ok=True)
    audio_path = os.path.join(audio_dir, "voiceover.mp3")
    
    communicate = edge_tts.Communicate(script_text, "en-US-JennyNeural", rate="+8%", pitch="+0Hz")
    await communicate.save(audio_path)
    print(f"✅ Saved voiceover to: {audio_path}")
    
    print(f"🚀 Transcribing {name} with CUDA GPU float16...")
    try:
        model = WhisperModel("base.en", device="cuda", compute_type="float16")
        segments, info = model.transcribe(audio_path, word_timestamps=True)
        segments = list(segments)
    except Exception as e:
        print(f"CUDA note: {e}, falling back to CPU")
        model = WhisperModel("base.en", device="cpu", compute_type="int8")
        segments, info = model.transcribe(audio_path, word_timestamps=True)
        segments = list(segments)
        
    word_list = []
    for segment in segments:
        for word in segment.words:
            word_list.append({
                "word": word.word.strip(),
                "startMs": int(word.start * 1000),
                "endMs": int(word.end * 1000)
            })
            
    print(f"✅ Transcribed {len(word_list)} words for {name}. Duration: {info.duration:.2f}s")
    os.makedirs(os.path.dirname(json_path), exist_ok=True)
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(word_list, f, indent=2)
    print(f"✅ Saved timestamps to: {json_path}")

async def main():
    await generate_and_transcribe(
        "David Goggins Cookie Jar",
        SCRIPT_GOGGINS,
        "public/goggins",
        "src/clips/goggins/transcript.json"
    )
    await generate_and_transcribe(
        "Taking A Break",
        SCRIPT_BREAKS,
        "public/breaks",
        "src/clips/breaks/transcript.json"
    )
    print("\n🎉 Both Short-Form Audio & Transcripts generated successfully!")

if __name__ == "__main__":
    asyncio.run(main())
