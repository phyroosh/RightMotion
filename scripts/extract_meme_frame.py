#!/usr/bin/env python3
"""
RightClips Meme Frame Extractor
Extracts the peak, most expressive single frame from curated meme clips into public/memes/frames/<id>.png.
"""

import os
import subprocess
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
MEMES_DIR = ROOT_DIR / "public" / "memes"
FRAMES_DIR = MEMES_DIR / "frames"

# Tuned peak timestamps for maximum comedic and emotional expression
PEAK_TIMESTAMPS = {
    "lego_bruce_flabbergasted": 0.9,
    "ishowspeed_stare": 0.7,
    "confused_kid": 0.6,
    "bateman_iphone_inspection": 1.1,
    "cat_laughing_pointing": 0.6,
    "rdj_shocked_closeup": 0.7,
    "courtroom_shout_me": 0.8,
    "walter_white_despair": 1.2,
    "michael_jackson_popcorn": 1.0,
    "rowley_innocent_wave": 0.8,
    "ronaldo_sipping_tea": 0.9,
    "wet_seal_cat": 0.7,
    "sweating_gamer": 0.8,
    "office_rage_smash": 1.0,
    "angry_grandpa_rage": 0.8,
    "doctor_strange_loop": 0.8,
    "tony_stark_explosion": 1.2,
    "ishowspeed_nodding_headphones": 0.8,
    "chrome_cyborg_overload": 1.0,
    "al_pacino_depressed_bench": 1.0,
    "doctor_strange_multiverse": 1.2
}

def extract_all_frames():
    FRAMES_DIR.mkdir(parents=True, exist_ok=True)
    count = 0
    for mp4_file in MEMES_DIR.glob("*.mp4"):
        meme_id = mp4_file.stem
        output_png = FRAMES_DIR / f"{meme_id}.png"
        ts = PEAK_TIMESTAMPS.get(meme_id, 0.8)

        cmd = [
            "ffmpeg", "-y",
            "-ss", str(ts),
            "-i", str(mp4_file),
            "-vframes", "1",
            "-update", "1",
            str(output_png)
        ]
        res = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        if res.returncode == 0:
            count += 1
            print(f"✅ Extracted frame: {meme_id}.png (at {ts}s)")
        else:
            print(f"❌ Failed: {meme_id}")

    print(f"\n🎉 Successfully extracted {count} iconic meme frames to {FRAMES_DIR.relative_to(ROOT_DIR)}")

if __name__ == "__main__":
    extract_all_frames()
