import sys
import os
import site

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

import asyncio
import edge_tts
import json
from faster_whisper import WhisperModel

MOTIVATION_SCRIPT = """You think you need motivation to start.

But honestly… motivation usually shows up after you start.

Because when something feels difficult, your brain keeps waiting for that magical moment when you suddenly feel like doing it.

And it rarely comes.

You do a tiny bit anyway… and then your brain goes, “Oh. We’re actually doing this.”

That’s why action creates motivation more often than motivation creates action.

So don’t ask, “Do I feel motivated?”

Ask, “What’s the smallest thing I can do right now?”

You don’t need to feel ready.

You just need to make starting feel easy.

And hey… if today feels a little heavy, that’s okay.

You can start small. Really small."""

MATURITY_SCRIPT = """Ever notice how some people seem way older than they actually are…

while others can be forty and still act like a teenager?

It’s not just age.

A lot of maturity comes from what life makes you deal with.

When someone has to handle responsibility, disappointment, or difficult situations early, they often learn to think ahead sooner.

But if someone rarely has to face consequences, they can keep avoiding uncomfortable things… even as they get older.

And that’s the weird part.

Someone can have a young face and an old mind.

Someone else can have an adult life… but never really grow up emotionally.

So maturity isn’t really about how many birthdays you’ve had.

It’s about how much you’ve learned to handle.

And if you feel like you had to grow up too fast… you’re allowed to slow down now, too."""

async def generate_and_transcribe(name, script_text, audio_dir, json_path):
    print(f"🎙️ Generating Fast Female Voice for: {name} (en-US-JennyNeural, +8% rate)...")
    os.makedirs(audio_dir, exist_ok=True)
    os.makedirs(os.path.dirname(json_path), exist_ok=True)
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
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(word_list, f, indent=2)
    print(f"✅ Saved timestamps to: {json_path}")

async def main():
    await generate_and_transcribe(
        "Motivation Myth",
        MOTIVATION_SCRIPT,
        "public/motivation",
        "src/clips/motivation/transcript.json"
    )
    await generate_and_transcribe(
        "Maturity & Growth",
        MATURITY_SCRIPT,
        "public/maturity",
        "src/clips/maturity/transcript.json"
    )
    print("\n🎉 Fresh Audio & Transcripts generated successfully!")

if __name__ == "__main__":
    asyncio.run(main())
