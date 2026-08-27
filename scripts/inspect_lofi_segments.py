import json
import os
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

with open(r"C:\Toptier Products\RightClips\src\clips\lofi_song\raw_whisper.json", "r", encoding="utf-8") as f:
    raw = json.load(f)

for idx, seg in enumerate(raw):
    print(f"Segment {idx:2d} [{seg['startMs']/1000:6.2f}s - {seg['endMs']/1000:6.2f}s] {seg['text']}")
