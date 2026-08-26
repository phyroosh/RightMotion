import os
import sys
import json
import re
import asyncio
import edge_tts

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

ADHD_SCRIPT = """Everyone gets distracted.

You open your phone for one thing… and somehow twenty minutes disappear.

But ADHD isn’t simply “getting distracted a lot.”

For someone with ADHD, the problem can be much deeper.

They might genuinely want to start something, know exactly what they need to do… and still feel almost physically stuck.

And sometimes, they can focus for hours on something they’re really interested in.

That’s the confusing part.

It’s not always about how much attention they have.

It’s often about how difficult it is to control where that attention goes.

So if your brain feels impossible to steer sometimes…

that doesn’t automatically mean you’re lazy or undisciplined.

Your experience might be telling you something worth understanding."""

async def generate_audio_and_timestamps():
    audio_dir = "public/adhd"
    audio_path = os.path.join(audio_dir, "voiceover.mp3")
    json_path = "src/clips/adhd/transcript.json"

    os.makedirs(audio_dir, exist_ok=True)
    os.makedirs(os.path.dirname(json_path), exist_ok=True)

    print("🎙️ Synthesizing Female Neural Voice (en-US-JennyNeural, +8% rate)...")
    comm = edge_tts.Communicate(ADHD_SCRIPT, "en-US-JennyNeural", rate="+8%", pitch="+0Hz")

    sentences = []
    audio_data = bytearray()

    async for chunk in comm.stream():
        if chunk["type"] == "audio":
            audio_data.extend(chunk["data"])
        elif chunk["type"] == "SentenceBoundary":
            sentences.append(chunk)

    with open(audio_path, "wb") as f:
        f.write(audio_data)
    print(f"✅ Saved voiceover audio to: {audio_path} ({len(audio_data)} bytes)")

    # Build precise word-level timestamps using high-resolution sentence boundaries
    words = []
    for s in sentences:
        s_offset_ms = int(s["offset"] / 10000)
        s_dur_ms = int(s["duration"] / 10000)
        s_text = s["text"].strip()
        # Clean up tokens
        raw_tokens = [t for t in re.split(r"\s+", s_text) if t]
        if not raw_tokens:
            continue

        # Proportional allocation by syllable/character weight with minimum duration
        weights = [max(2, len(t)) for t in raw_tokens]
        total_weight = sum(weights)

        cur_ms = s_offset_ms
        for i, tok in enumerate(raw_tokens):
            w_dur = max(110, int((weights[i] / total_weight) * s_dur_ms))
            end_ms = cur_ms + w_dur
            if i == len(raw_tokens) - 1:
                end_ms = s_offset_ms + s_dur_ms

            cleaned = tok.replace("“", "").replace("”", "").replace('"', '')
            words.append({
                "word": cleaned,
                "startMs": cur_ms,
                "endMs": end_ms
            })
            cur_ms = end_ms

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(words, f, indent=2, ensure_ascii=False)

    total_duration_sec = words[-1]["endMs"] / 1000.0 if words else 0
    print(f"✅ Generated {len(words)} word timestamps -> {json_path}")
    print(f"✅ Total spoken duration: {total_duration_sec:.2f}s (~{int(total_duration_sec * 30)} frames @ 30fps)")

if __name__ == "__main__":
    asyncio.run(generate_audio_and_timestamps())
