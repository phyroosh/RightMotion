#!/usr/bin/env python3
"""
RightMotion Asset Fetcher & AI Background Removal Engine
Fetches images from local paths, URLs, or search queries, and removes
the background using rembg / U2Net ONNX models to produce high-resolution,
clean transparent PNG cutouts ready for Remotion video compositions.
"""

import sys
import os
import argparse
import urllib.request
from pathlib import Path
from io import BytesIO

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

def remove_background(input_image_bytes: bytes, model_name: str = "u2netp") -> bytes:
    """Removes image background using rembg AI engine with fast lightweight models (u2netp ~4MB, silueta ~40MB, u2net ~176MB)."""
    from rembg import remove, new_session
    from PIL import Image
    
    print(f"🤖 Initializing AI background removal session (model: '{model_name}')...", flush=True)
    session = new_session(model_name)
    print("✂️ Processing alpha cutout...", flush=True)
    output_bytes = remove(input_image_bytes, session=session)
    
    # Clean up bounding box using PIL
    img = Image.open(BytesIO(output_bytes)).convert("RGBA")
    bbox = img.getbbox()
    if bbox:
        # Add 10px breathing room around bounding box
        w, h = img.size
        pad = 10
        x0 = max(0, bbox[0] - pad)
        y0 = max(0, bbox[1] - pad)
        x1 = min(w, bbox[2] + pad)
        y1 = min(h, bbox[3] + pad)
        img = img.crop((x0, y0, x1, y1))
        
    out_io = BytesIO()
    img.save(out_io, format="PNG", optimize=True)
    return out_io.getvalue()

def process_file_cutout(input_path: str, output_path: str, model_name: str = "u2netp"):
    """Processes local image file, removes background and saves transparent PNG."""
    print(f"🖼️ Loading image: {input_path}", flush=True)
    with open(input_path, "rb") as f:
        input_data = f.read()
    
    cutout_bytes = remove_background(input_data, model_name=model_name)
    
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    with open(output_path, "wb") as f:
        f.write(cutout_bytes)
    
    print(f"✅ Transparent cutout saved to: {output_path} ({len(cutout_bytes):,} bytes)", flush=True)

def process_url_cutout(url: str, output_path: str, model_name: str = "u2netp"):
    """Downloads image from URL, removes background, and saves transparent PNG."""
    print(f"🌐 Fetching image from: {url}", flush=True)
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    )
    with urllib.request.urlopen(req) as resp:
        input_data = resp.read()
    
    cutout_bytes = remove_background(input_data, model_name=model_name)
    
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    with open(output_path, "wb") as f:
        f.write(cutout_bytes)
    
    print(f"✅ Transparent cutout saved to: {output_path} ({len(cutout_bytes):,} bytes)", flush=True)

def main():
    parser = argparse.ArgumentParser(description="AI Image Asset Fetcher & Background Remover for RightMotion")
    parser.add_argument("--input", "-i", type=str, help="Local path to source image")
    parser.add_argument("--url", "-u", type=str, help="URL of image to download")
    parser.add_argument("--model", "-m", type=str, default="u2netp", help="rembg model (u2netp, silueta, u2net, isnet-general-use)")
    parser.add_argument("--out", "-o", type=str, required=True, help="Output transparent PNG path")
    args = parser.parse_args()

    if args.input:
        process_file_cutout(args.input, args.out, model_name=args.model)
    elif args.url:
        process_url_cutout(args.url, args.out, model_name=args.model)
    else:
        print("❌ Error: Must specify either --input or --url")
        sys.exit(1)

if __name__ == "__main__":
    main()
