#!/usr/bin/env python3
"""
🎬 scripts/render_clip.py
Unified RightMotion Clip Renderer.

Supports:
- Production Mode (default): Hardware-accelerated 1080x1920 export with automatic SwiftShader CPU fallback.
- Fast Mode: Rapid preview iteration (scaled or range-targeted).
- CPU-Only Mode: 100% pure CPU software rasterization using Google SwiftShader.
"""

import argparse
import os
import subprocess
import sys
import time


def to_pascal_case(snake_str: str) -> str:
    components = snake_str.strip().split("_")
    return "".join(x.title() for x in components)


def main():
    parser = argparse.ArgumentParser(description="Render a RightMotion clip with optimized throughput.")
    parser.add_argument("--name", required=True, help="Clip name (e.g., the_architecture_of_focus)")
    parser.add_argument(
        "--mode",
        choices=["production", "fast", "cpu"],
        default="production",
        help="Render mode: production (~2 min GPU), fast (preview range), cpu (pure SwiftShader software)"
    )
    parser.add_argument("--frames", default=None, help="Specific frame range, e.g. 0-90")
    parser.add_argument("--scale", type=float, default=None, help="Downscale factor for preview (e.g. 0.5)")
    parser.add_argument("--out", default=None, help="Custom output filepath")
    parser.add_argument("--concurrency", type=int, default=4, help="Worker concurrency (default: 4)")
    args = parser.parse_args()

    clean_name = args.name.lower().strip()
    comp_id = to_pascal_case(clean_name)
    if not comp_id.endswith("Video"):
        comp_id += "Video"

    out_dir = "out"
    os.makedirs(out_dir, exist_ok=True)
    out_path = args.out or os.path.join(out_dir, f"{clean_name}_video.mp4")

    # Determine backend flags
    env = os.environ.copy()
    cmd = [
        "npx", "remotion", "render",
        "src/index.ts",
        comp_id,
        out_path,
        f"--concurrency={args.concurrency}",
    ]

    if args.mode == "cpu":
        cmd.append("--gl=swiftshader")
        env["REMOTION_GL"] = "swiftshader"
        print(f"⚙️  Mode: Pure CPU Software Rendering (SwiftShader) | Concurrency: {args.concurrency}")
    elif args.mode == "fast":
        cmd.append("--gl=angle")
        env["REMOTION_GL"] = "angle"
        if not args.frames:
            cmd.append("--frames=0-120")
        if args.scale:
            cmd.append(f"--scale={args.scale}")
        print(f"⚡ Mode: Fast Preview Iteration | Concurrency: {args.concurrency}")
    else:
        # Production
        cmd.append("--gl=angle")
        env["REMOTION_GL"] = "angle"
        print(f"🚀 Mode: High-Throughput Production (ANGLE GPU) | Concurrency: {args.concurrency}")

    if args.frames:
        cmd.append(f"--frames={args.frames}")

    print(f"🎬 Composition: {comp_id}")
    print(f"📁 Output: {out_path}")
    print(f"💻 Command: {' '.join(cmd)}\n")

    t0 = time.perf_counter()
    res = subprocess.run(cmd, env=env)
    dur = time.perf_counter() - t0

    if res.returncode != 0:
        if args.mode == "production":
            print("\n⚠️  GPU ANGLE render failed. Attempting graceful fallback to SwiftShader (CPU)...")
            cmd_fallback = [c if not c.startswith("--gl=") else "--gl=swiftshader" for c in cmd]
            env["REMOTION_GL"] = "swiftshader"
            t0_fb = time.perf_counter()
            res_fb = subprocess.run(cmd_fallback, env=env)
            dur_fb = time.perf_counter() - t0_fb
            if res_fb.returncode == 0:
                print(f"\n✅ Render completed successfully via CPU fallback in {dur_fb:.1f}s ({dur_fb/60:.2f} min).")
                sys.exit(0)
        print(f"\n❌ Render failed with exit code {res.returncode}")
        sys.exit(res.returncode)

    print(f"\n✅ Render completed successfully in {dur:.1f}s ({dur/60:.2f} min).")


if __name__ == "__main__":
    main()
