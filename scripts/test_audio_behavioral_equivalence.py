#!/usr/bin/env python3
"""
🎬 Phase 3 Behavioral Equivalence Verification: Old vs New Audio Pipeline

Performs strict comparative analysis between the legacy inline audio/Whisper pipeline
(from cc5bbef:scripts/create_clip.py) and the canonical pipeline (scripts/voiceover_engine.py).

Evaluates:
1. Audio duration (exact ffprobe ms duration)
2. Transcript word matching and equality
3. Word count parity
4. Timestamp drift:
   - First word start timestamp
   - Last word end timestamp
   - Mean absolute drift (ms)
   - Max absolute drift (ms)
5. Pause boundaries & reflection breath pause detection via ffmpeg silencedetect
"""

import sys
import os
import re
import json
import asyncio
import shutil
import tempfile
import subprocess
from pathlib import Path
from typing import Tuple, List, Dict, Any

ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(ROOT_DIR / "scripts"))

import edge_tts
from voiceover_engine import (
    generate_voiceover,
    transcribe_audio,
    split_body_and_closing_question as new_split_body_and_closing_question,
    get_audio_duration_ms,
)

TEST_SCRIPT = (
    "Every time you tolerate disrespect, broken promises, or your own excuses, "
    "your brain logs it as acceptable. Over time, your baseline shifts downward. "
    "What once felt unacceptable becomes your normal. You wonder why your standards dropped, "
    "but the truth is simple: your neural wiring adapted to what you allowed. "
    "What standard did you lower without realizing it?"
)


# ==============================================================================
# 1. LEGACY IMPLEMENTATION (Reconstructed identically from cc5bbef:create_clip.py)
# ==============================================================================

def old_split_body_and_closing_question(text: str) -> Tuple[str, str]:
    clean = text.strip()
    sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', clean) if s.strip()]
    if len(sentences) >= 2:
        last = sentences[-1]
        if last.endswith("?") or any(
            last.lower().startswith(p)
            for p in ["tell me", "drop your", "drop a", "be honest", "question for you", "what would you", "have you ever"]
        ):
            body = " ".join(sentences[:-1])
            question = last
            return body, question
    return clean, ""


async def old_synthesize_speech(text: str, output_path: Path, voice: str = "en-US-AvaMultilingualNeural"):
    output_path.parent.mkdir(parents=True, exist_ok=True)
    body_text, closing_question = old_split_body_and_closing_question(text)

    if closing_question:
        work_dir = output_path.parent / "tts_temp_old"
        work_dir.mkdir(parents=True, exist_ok=True)
        body_raw = work_dir / "body_raw.mp3"
        body_norm = work_dir / "body_norm.mp3"
        q_raw = work_dir / "q_raw.mp3"
        q_norm = work_dir / "q_norm.mp3"
        pause_gap = work_dir / "pause_220ms.mp3"

        # Synthesize body
        comm_b = edge_tts.Communicate(text=body_text.replace("…", ",").replace("...", ","), voice=voice, rate="+8%")
        await comm_b.save(str(body_raw))
        subprocess.run([
            "ffmpeg", "-y", "-i", str(body_raw),
            "-af", "silenceremove=stop_periods=-1:stop_duration=0.18:stop_threshold=-35dB:detection=peak",
            "-ar", "44100", "-ac", "2", "-b:a", "192k", str(body_norm)
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

        # Synthesize closing question
        comm_q = edge_tts.Communicate(text=closing_question.replace("…", ",").replace("...", ","), voice=voice, rate="+6%")
        await comm_q.save(str(q_raw))
        subprocess.run([
            "ffmpeg", "-y", "-i", str(q_raw),
            "-af", "silenceremove=stop_periods=-1:stop_duration=0.18:stop_threshold=-35dB:detection=peak",
            "-ar", "44100", "-ac", "2", "-b:a", "192k", str(q_norm)
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

        # Generate 220ms breath pause gap
        subprocess.run([
            "ffmpeg", "-y", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo",
            "-t", "0.22", "-ar", "44100", "-ac", "2", "-b:a", "192k", str(pause_gap)
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

        # Concat with demuxer
        concat_list = work_dir / "concat.txt"
        concat_list.write_text(f"file '{body_norm.resolve().as_posix()}'\nfile '{pause_gap.resolve().as_posix()}'\nfile '{q_norm.resolve().as_posix()}'\n", encoding="utf-8")
        subprocess.run([
            "ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(concat_list),
            "-c:a", "libmp3lame", "-b:a", "192k", "-ar", "44100", "-ac", "2", str(output_path)
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        shutil.rmtree(work_dir, ignore_errors=True)
    else:
        raw_path = output_path.with_name("raw_" + output_path.name)
        norm_text = text.replace("…", ",").replace("...", ",").replace("\r\n", "\n").replace("\n\n", " ").replace("\n", " ").strip()
        communicate = edge_tts.Communicate(text=norm_text, voice=voice, rate="+8%")
        await communicate.save(str(raw_path))

        cmd = [
            "ffmpeg", "-y", "-i", str(raw_path),
            "-af", "silenceremove=stop_periods=-1:stop_duration=0.20:stop_threshold=-35dB:detection=peak",
            "-ar", "44100", "-ac", "2", "-b:a", "192k",
            str(output_path)
        ]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        try:
            raw_path.unlink(missing_ok=True)
        except Exception:
            pass


def old_transcribe_audio(audio_path: Path, output_json: Path):
    from faster_whisper import WhisperModel
    import ctranslate2

    output_json.parent.mkdir(parents=True, exist_ok=True)

    device = "cpu"
    comp_type = "int8"
    segments = None
    if ctranslate2.get_cuda_device_count() > 0:
        try:
            model = WhisperModel("base.en", device="cuda", compute_type="float16")
            seg_gen, info = model.transcribe(str(audio_path), word_timestamps=True, language="en", beam_size=5)
            segments = list(seg_gen)
            device = "cuda"
            comp_type = "float16"
        except Exception:
            model = WhisperModel("base.en", device="cpu", compute_type="int8")
            seg_gen, info = model.transcribe(str(audio_path), word_timestamps=True, language="en", beam_size=5)
            segments = list(seg_gen)
    else:
        model = WhisperModel("base.en", device="cpu", compute_type="int8")
        seg_gen, info = model.transcribe(str(audio_path), word_timestamps=True, language="en", beam_size=5)
        segments = list(seg_gen)

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

    with open(output_json, "w", encoding="utf-8") as f:
        json.dump(words_list, f, indent=2, ensure_ascii=False)

    duration_sec = words_list[-1]["end"] / 1000.0 if words_list else 5.0
    return words_list, duration_sec


# ==============================================================================
# 2. AUDIO & PAUSE BOUNDARY ANALYSIS
# ==============================================================================

def detect_silence_intervals(audio_path: Path, threshold_db: int = -30, min_duration: float = 0.15) -> List[Dict[str, float]]:
    """Detects silent intervals using ffmpeg silencedetect filter."""
    cmd = [
        "ffmpeg", "-i", str(audio_path),
        "-af", f"silencedetect=noise={threshold_db}dB:d={min_duration}",
        "-f", "null", "-"
    ]
    proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    lines = proc.stderr.splitlines()

    silences = []
    current_start = None
    for line in lines:
        if "silence_start:" in line:
            m = re.search(r"silence_start:\s*([0-9.]+)", line)
            if m:
                current_start = float(m.group(1))
        elif "silence_end:" in line and current_start is not None:
            m_end = re.search(r"silence_end:\s*([0-9.]+)", line)
            m_dur = re.search(r"silence_duration:\s*([0-9.]+)", line)
            end = float(m_end.group(1)) if m_end else current_start
            dur = float(m_dur.group(1)) if m_dur else (end - current_start)
            silences.append({
                "start": current_start,
                "end": end,
                "duration": dur,
            })
            current_start = None

    return silences


# ==============================================================================
# 3. MAIN BEHAVIORAL EQUIVALENCE TEST
# ==============================================================================

async def run_behavioral_equivalence_test():
    print("=" * 75)
    print("🎬 RUNNING PHASE 3 BEHAVIORAL EQUIVALENCE TEST: OLD vs NEW AUDIO PIPELINE")
    print("=" * 75)

    test_dir = ROOT_DIR / ".cache" / "test_audio_equivalence"
    test_dir.mkdir(parents=True, exist_ok=True)

    old_audio_path = test_dir / "old_voiceover.mp3"
    old_json_path = test_dir / "old_transcript.json"

    new_audio_path = test_dir / "new_voiceover.mp3"
    new_json_path = test_dir / "new_transcript.json"

    print("\n[Step 1] Synthesizing Legacy Audio (cc5bbef)...")
    await old_synthesize_speech(TEST_SCRIPT, old_audio_path)
    print(f"  ✅ Legacy audio saved: {old_audio_path}")

    print("\n[Step 2] Transcribing Legacy Audio...")
    old_words, old_duration_whisper = old_transcribe_audio(old_audio_path, old_json_path)
    old_duration_ffprobe_ms = get_audio_duration_ms(old_audio_path)
    print(f"  ✅ Legacy transcribed: {len(old_words)} words | ffprobe: {old_duration_ffprobe_ms:.1f}ms | whisper: {old_duration_whisper:.2f}s")

    print("\n[Step 3] Synthesizing and Transcribing Canonical Audio (voiceover_engine.py)...")
    new_words, new_duration_whisper = await generate_voiceover(TEST_SCRIPT, new_audio_path, new_json_path)
    new_duration_ffprobe_ms = get_audio_duration_ms(new_audio_path)
    print(f"  ✅ Canonical generated & transcribed: {len(new_words)} words | ffprobe: {new_duration_ffprobe_ms:.1f}ms | whisper: {new_duration_whisper:.2f}s")

    print("\n" + "=" * 75)
    print("📊 COMPARATIVE ANALYSIS & EQUIVALENCE METRICS")
    print("=" * 75)

    # 1. Duration Analysis
    duration_delta_ms = abs(new_duration_ffprobe_ms - old_duration_ffprobe_ms)
    print(f"\n1. AUDIO DURATION:")
    print(f"   - Old duration (ffprobe): {old_duration_ffprobe_ms:.2f} ms ({old_duration_ffprobe_ms / 1000.0:.3f} s)")
    print(f"   - New duration (ffprobe): {new_duration_ffprobe_ms:.2f} ms ({new_duration_ffprobe_ms / 1000.0:.3f} s)")
    print(f"   - Delta:                  {duration_delta_ms:.2f} ms ({duration_delta_ms / 1000.0:.3f} s)")
    duration_pass = duration_delta_ms < 200.0
    print(f"   - Result:                 {'✅ PASS (<200ms delta)' if duration_pass else '❌ FAIL'}")

    # 2. Word Count & Transcript Parity
    print(f"\n2. WORD COUNT & TRANSCRIPT PARITY:")
    print(f"   - Old word count:         {len(old_words)}")
    print(f"   - New word count:         {len(new_words)}")
    word_count_pass = len(old_words) == len(new_words)
    print(f"   - Word count match:       {'✅ PASS (identical)' if word_count_pass else '❌ MISMATCH'}")

    # Text alignment
    matched_words = 0
    min_len = min(len(old_words), len(new_words))
    for i in range(min_len):
        w_old = old_words[i]["word"].lower().strip(".,?!:;")
        w_new = new_words[i]["word"].lower().strip(".,?!:;")
        if w_old == w_new:
            matched_words += 1

    transcript_similarity = (matched_words / max(len(old_words), len(new_words))) * 100.0
    print(f"   - Transcript alignment:   {matched_words}/{min_len} exact words matched ({transcript_similarity:.1f}%)")
    transcript_pass = transcript_similarity >= 98.0
    print(f"   - Result:                 {'✅ PASS (>=98% match)' if transcript_pass else '❌ FAIL'}")

    # 3. Timestamp Drift
    print(f"\n3. TIMESTAMP DRIFT:")
    start_drifts = []
    end_drifts = []
    for i in range(min_len):
        s_old = old_words[i].get("startMs", old_words[i]["start"])
        s_new = new_words[i].get("startMs", new_words[i]["start"])
        e_old = old_words[i].get("endMs", old_words[i]["end"])
        e_new = new_words[i].get("endMs", new_words[i]["end"])
        start_drifts.append(abs(s_new - s_old))
        end_drifts.append(abs(e_new - e_old))

    mean_start_drift = sum(start_drifts) / len(start_drifts) if start_drifts else 0.0
    max_start_drift = max(start_drifts) if start_drifts else 0.0
    mean_end_drift = sum(end_drifts) / len(end_drifts) if end_drifts else 0.0
    max_end_drift = max(end_drifts) if end_drifts else 0.0

    first_start_old = old_words[0].get("startMs", old_words[0]["start"])
    first_start_new = new_words[0].get("startMs", new_words[0]["start"])
    last_end_old = old_words[-1].get("endMs", old_words[-1]["end"])
    last_end_new = new_words[-1].get("endMs", new_words[-1]["end"])

    print(f"   - First word start:       Old: {first_start_old} ms | New: {first_start_new} ms (delta: {abs(first_start_new - first_start_old)} ms)")
    print(f"   - Last word end:          Old: {last_end_old} ms | New: {last_end_new} ms (delta: {abs(last_end_new - last_end_old)} ms)")
    print(f"   - Mean start drift:       {mean_start_drift:.2f} ms")
    print(f"   - Max start drift:        {max_start_drift:.2f} ms")
    print(f"   - Mean end drift:         {mean_end_drift:.2f} ms")
    print(f"   - Max end drift:          {max_end_drift:.2f} ms")

    drift_pass = mean_start_drift < 60.0 and max_start_drift < 200.0
    print(f"   - Result:                 {'✅ PASS (mean <60ms, max <200ms)' if drift_pass else '❌ FAIL'}")

    # 4. Pause Boundaries & Reflection Gap
    print(f"\n4. PAUSE BOUNDARIES & REFLECTION BREATH DETECTION:")
    old_silences = detect_silence_intervals(old_audio_path)
    new_silences = detect_silence_intervals(new_audio_path)

    print(f"   - Detected silence regions (Old): {len(old_silences)}")
    for s in old_silences:
        print(f"       * {s['start']:.2f}s -> {s['end']:.2f}s (dur: {s['duration'] * 1000:.0f}ms)")
    print(f"   - Detected silence regions (New): {len(new_silences)}")
    for s in new_silences:
        print(f"       * {s['start']:.2f}s -> {s['end']:.2f}s (dur: {s['duration'] * 1000:.0f}ms)")

    # Find the reflection breath pause (expected ~0.22s before the closing question)
    # The closing question starts around 18s - 22s in this 25s script
    old_reflection = [s for s in old_silences if 0.18 <= s["duration"] <= 0.35 and s["start"] > 14.0]
    new_reflection = [s for s in new_silences if 0.18 <= s["duration"] <= 0.35 and s["start"] > 14.0]

    has_old_breath = len(old_reflection) > 0
    has_new_breath = len(new_reflection) > 0
    print(f"   - Reflection pause (Old): {'Detected at ' + str(round(old_reflection[0]['start'], 2)) + 's (' + str(round(old_reflection[0]['duration']*1000)) + 'ms)' if has_old_breath else 'Not detected'}")
    print(f"   - Reflection pause (New): {'Detected at ' + str(round(new_reflection[0]['start'], 2)) + 's (' + str(round(new_reflection[0]['duration']*1000)) + 'ms)' if has_new_breath else 'Not detected'}")

    pause_pass = has_old_breath and has_new_breath
    if pause_pass:
        pause_delta = abs(new_reflection[0]["start"] - old_reflection[0]["start"]) * 1000.0
        print(f"   - Reflection boundary delta: {pause_delta:.1f} ms")
        pause_pass = pause_delta < 200.0
    print(f"   - Result:                 {'✅ PASS (reflection breath aligned within tolerance)' if pause_pass else '❌ FAIL'}")

    # Overall Decision
    all_passed = duration_pass and word_count_pass and transcript_pass and drift_pass and pause_pass
    print("\n" + "=" * 75)
    if all_passed:
        print("🏆 FINAL VERDICT: BEHAVIORAL EQUIVALENCE CONFIRMED (100% PASS)")
        print("   The canonical voiceover_engine.py is behaviorally equivalent to legacy code.")
        print("=" * 75)
        return True
    else:
        print("⚠️ FINAL VERDICT: BEHAVIORAL EQUIVALENCE FAILED")
        print("=" * 75)
        return False


if __name__ == "__main__":
    success = asyncio.run(run_behavioral_equivalence_test())
    sys.exit(0 if success else 1)
