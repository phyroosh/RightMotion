#!/usr/bin/env python3
"""
RightMotion Conversational Duo Dialogue Engine (Judy & Andrew)
Compatibility forwarder pointing to canonical scripts/voiceover_engine.py.
"""

import sys
import argparse
import asyncio
from voiceover_engine import (
    VOICE_MAP,
    parse_dialogue_turns,
    build_duo_audio,
    transcribe_and_attribute_speakers,
    process_dialogue,
)

__all__ = [
    "VOICE_MAP",
    "parse_dialogue_turns",
    "build_duo_audio",
    "transcribe_and_attribute_speakers",
    "process_dialogue",
]


def main():
    parser = argparse.ArgumentParser(description="RightMotion Judy & Andrew Duo Dialogue Engine")
    parser.add_argument("--text", type=str, help="Script text with JUDY: and ANDREW: turns")
    parser.add_argument("--file", type=str, help="Path to text file containing dialogue script")
    parser.add_argument("--topic", type=str, required=True, help="Topic / clip name")
    args = parser.parse_args()

    if args.text:
        text = args.text
    elif args.file:
        with open(args.file, "r", encoding="utf-8") as f:
            text = f.read()
    else:
        print("Error: Either --text or --file must be specified.")
        sys.exit(1)

    asyncio.run(process_dialogue(text, args.topic))


if __name__ == "__main__":
    main()
