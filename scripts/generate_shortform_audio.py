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

COMPARISON_SCRIPT = """You know why comparing yourself to other people never really stops?

Because every time you become better… your brain just finds someone new to compare you to.

You get fit? Now you notice someone fitter.

You make more money? Suddenly you're looking at someone richer.

You finally feel confident? And then you meet someone who seems effortlessly confident.

So the finish line keeps moving.

That's the trap.

Comparison doesn't actually disappear when your life gets better.

Because the problem isn't always that you're behind.

Sometimes, your brain has just learned to look sideways before it looks at you.

So maybe don't ask, “Am I doing better than them?”

Ask, “Am I doing better than the version of me who started?”

That's a race you can actually finish.

And honestly… you don't need to win someone else's life to feel like yours is enough."""

HABIT_SCRIPT = """You know what's weird?

You can know a habit is bad for you… and still do it again tonight.

You know scrolling for hours makes you feel worse.

You know skipping work creates more stress.

You know that one person isn't good for you.

And yet… you go back.

Because knowing better and changing are actually two different things.

Your brain doesn't always choose what's good for you.

It usually chooses what feels familiar… easy… or comforting in the moment.

So when you're tired, stressed, or lonely, your brain goes, “Yeah, I know this isn't great… but it worked last time.”

That's why information alone doesn't break habits.

You don't break a habit by giving yourself guilt.

You break it by giving your brain a different way to feel okay."""

async def generate_and_transcribe(name, script_text, audio_dir, json_path):
    print(f"🎙️ Generating Fast Female Voice for: {name} (en-US-JennyNeural, +8% rate)...")
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
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(word_list, f, indent=2)
    print(f"✅ Saved timestamps to: {json_path}")

async def main():
    await generate_and_transcribe(
        "Comparison Mindset",
        COMPARISON_SCRIPT,
        "public/comparison",
        "src/clips/comparison/transcript.json"
    )
    await generate_and_transcribe(
        "Habit Psychology",
        HABIT_SCRIPT,
        "public/habits",
        "src/clips/habits/transcript.json"
    )
    print("\n🎉 Both Short-Form Audio & Transcripts generated successfully!")

if __name__ == "__main__":
    asyncio.run(main())
