#!/usr/bin/env python3
"""
Python Asset Generator for Automated Motion Graphics Engine
Synthesizes speech via edge-tts (en-US-AvaNeural) and generates
precise word-level timestamps using faster-whisper (base.en) with NVIDIA CUDA GPU acceleration.
"""

import asyncio
import json
import os
import sys
import site
import argparse
from pathlib import Path

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

DEFAULT_SCRIPT = (
    "You know what's weird? "
    "You can know a habit is bad for you… and still do it again tonight. "
    "You know scrolling for hours makes you feel worse. "
    "You know skipping work creates more stress. "
    "You know that one person isn't good for you. "
    "And yet… you go back. "
    "Because knowing better and changing are actually two different things. "
    "Your brain doesn't always choose what's good for you. "
    "It usually chooses what feels familiar… easy… or comforting in the moment. "
    "So when you're tired, stressed, or lonely, your brain goes, 'Yeah, I know this isn't great… but it worked last time.' "
    "That's why information alone doesn't break habits. "
    "You don't need more guilt. "
    "You need to understand what the habit is doing for you. "
    "Because once you see that… changing it starts to feel a little less like fighting yourself."
)

DEFAULT_VOICE = "en-US-AvaNeural"
WHISPER_MODEL = "base.en"


async def synthesize_speech(text: str, output_path: Path, voice: str = DEFAULT_VOICE):
    """Synthesize voiceover using edge-tts."""
    import edge_tts

    print(f"[1/3] Synthesizing speech with voice '{voice}'...")
    output_path.parent.mkdir(parents=True, exist_ok=True)

    communicate = edge_tts.Communicate(text=text, voice=voice)
    await communicate.save(str(output_path))
    print(f"      Saved voiceover audio to: {output_path}")


def transcribe_audio_words(audio_path: Path, output_json_path: Path):
    """Transcribe audio and extract word-level millisecond timestamps using faster-whisper on GPU."""
    from faster_whisper import WhisperModel
    import ctranslate2

    def _get_segments(device_type, comp_type):
        print(f"[2/3] Loading faster-whisper model '{WHISPER_MODEL}' on GPU ({device_type}, {comp_type})...")
        model = WhisperModel(WHISPER_MODEL, device=device_type, compute_type=comp_type)
        print(f"[3/3] Transcribing audio with GPU acceleration for word-level timestamps...")
        segments_gen, info = model.transcribe(
            str(audio_path),
            word_timestamps=True,
            language="en",
            beam_size=5,
        )
        return list(segments_gen)

    # Attempt CUDA first with RTX 3050 GPU
    segments = None
    has_cuda = False
    try:
        if ctranslate2.get_cuda_device_count() > 0:
            has_cuda = True
            print(f"      [GPU DETECTED] Found {ctranslate2.get_cuda_device_count()} NVIDIA CUDA device(s). Using dedicated GPU.")
    except Exception as e:
        print(f"      CUDA check exception: {e}")
        has_cuda = False

    if has_cuda:
        try:
            segments = _get_segments("cuda", "float16")
        except Exception as err:
            print(f"      CUDA transcription float16 failed ({err}), trying int8_float16...")
            try:
                segments = _get_segments("cuda", "int8_float16")
            except Exception as err2:
                print(f"      CUDA transcription failed ({err2}), falling back to CPU...")
                segments = None

    if segments is None:
        try:
            segments = _get_segments("cpu", "int8")
        except Exception as err:
            print(f"      CPU int8 failed ({err}), falling back to CPU float32...")
            segments = _get_segments("cpu", "float32")

    word_items = []
    for segment in segments:
        if segment.words:
            for w in segment.words:
                cleaned_word = w.word.strip()
                if cleaned_word:
                    start_ms = int(round(w.start * 1000))
                    end_ms = int(round(w.end * 1000))
                    word_items.append({
                        "word": cleaned_word,
                        "startMs": start_ms,
                        "endMs": end_ms,
                    })

    output_json_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_json_path, "w", encoding="utf-8") as f:
        json.dump(word_items, f, indent=2, ensure_ascii=False)

    print(f"      Generated {len(word_items)} word timestamps -> {output_json_path}")
    if word_items:
        total_duration_sec = word_items[-1]["endMs"] / 1000.0
        print(f"      Total spoken duration: {total_duration_sec:.2f}s (~{int(total_duration_sec * 30)} frames @ 30fps)")

    return word_items


def main():
    parser = argparse.ArgumentParser(description="Generate voiceover audio and word-level transcript for Remotion.")
    parser.add_argument("--text", type=str, default=DEFAULT_SCRIPT, help="Script text to synthesize")
    parser.add_argument("--voice", type=str, default=DEFAULT_VOICE, help="edge-tts voice identifier")
    parser.add_argument("--audio-out", type=str, default="public/voiceover.mp3", help="Output audio file path")
    parser.add_argument("--json-out", type=str, default="src/transcript.json", help="Output transcript JSON path")
    args = parser.parse_args()

    project_root = Path(__file__).parent.resolve()
    audio_path = (project_root / args.audio_out).resolve()
    json_path = (project_root / args.json_out).resolve()

    print("=" * 60)
    print("  AUTOMATED SHORTS ASSET GENERATOR (edge-tts + faster-whisper CUDA)")
    print("=" * 60)
    print(f"Voice: {args.voice}")
    print(f"Script: \"{args.text}\"\n")

    # Step 1: Synthesize
    asyncio.run(synthesize_speech(args.text, audio_path, voice=args.voice))

    # Step 2: Transcribe with GPU
    words = transcribe_audio_words(audio_path, json_path)

    print("=" * 60)
    print("Assets successfully generated and ready for Remotion!")
    print("=" * 60)


if __name__ == "__main__":
    main()
