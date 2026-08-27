#!/usr/bin/env python3
"""
RightClips Master CLI Generator
End-to-end automated video and 4K thumbnail generation for AI agents & creators.
"""

import argparse
import asyncio
import json
import os
import re
import sys
import site
import subprocess
from pathlib import Path

# Force UTF-8 output encoding for Windows terminals
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")


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

ROOT_DIR = Path(__file__).resolve().parent.parent

async def synthesize_speech(text: str, output_path: Path, voice: str = "en-US-AvaNeural"):
    import edge_tts
    output_path.parent.mkdir(parents=True, exist_ok=True)
    print(f"🎙️ [1/4] Synthesizing neural speech with voice '{voice}'...")
    communicate = edge_tts.Communicate(text=text, voice=voice, rate="+3%")
    await communicate.save(str(output_path))
    print(f"      Saved voiceover to: {output_path}")

def transcribe_audio(audio_path: Path, output_json: Path):
    from faster_whisper import WhisperModel
    import ctranslate2

    print("📝 [2/4] Extracting word timestamps with faster-whisper...")
    output_json.parent.mkdir(parents=True, exist_ok=True)

    can_cuda = False
    try:
        if ctranslate2.get_cuda_device_count() > 0:
            can_cuda = True
    except Exception:
        can_cuda = False

    device = "cuda" if can_cuda else "cpu"
    comp_type = "float16" if device == "cuda" else "int8"
    print(f"      Using compute device: {device} ({comp_type})")

    model = WhisperModel("base.en", device=device, compute_type=comp_type)
    segments, info = model.transcribe(str(audio_path), word_timestamps=True, language="en", beam_size=5)

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
    print(f"      Transcribed {len(words_list)} words -> {output_json} ({duration_sec:.2f}s)")
    return words_list, duration_sec

def scaffold_clip_files(name: str, topic: str, format_type: str, duration_sec: float):
    print(f"🎨 [3/4] Scaffolding Remotion clip files in src/clips/{name}/...")
    clip_dir = ROOT_DIR / "src" / "clips" / name
    clip_dir.mkdir(parents=True, exist_ok=True)

    pascal_name = "".join(w.capitalize() for w in re.split(r"[_\-\s]+", name))

    # 1. Background
    bg_code = f"""import React from "react";

export const {pascal_name}Background: React.FC = () => {{
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-[#f8fafc]">
      <div
        className="absolute inset-0 opacity-90"
        style={{{{
          background: "radial-gradient(circle at 50% 20%, #f1f5f9 0%, #e2e8f0 45%, #cbd5e1 100%)",
        }}}}
      />
      <div
        className="absolute w-[650px] h-[650px] rounded-full blur-[140px] opacity-25"
        style={{{{
          background: "radial-gradient(circle, #f59e0b 0%, #d97706 100%)",
          top: "15%",
          left: "-10%",
        }}}}
      />
      <div
        className="absolute inset-0 opacity-15"
        style={{{{
          backgroundImage: "radial-gradient(rgba(15, 23, 42, 0.3) 1.5px, transparent 1.5px)",
          backgroundSize: "36px 36px",
        }}}}
      />
    </div>
  );
}};
"""
    (clip_dir / "Background.tsx").write_text(bg_code, encoding="utf-8")

    # 2. Presenter
    pres_code = f"""import React from "react";
import {{ spring, useCurrentFrame, useVideoConfig }} from "remotion";
import {{ CharacterKeyframeAnimator, KeyframePoint }} from "../../components/CharacterKeyframeAnimator";
import {{ Sparkles, Brain, ShieldCheck }} from "lucide-react";

interface PresenterProps {{
  currentMs: number;
}}

export const {pascal_name}Presenter: React.FC<PresenterProps> = ({{ currentMs }}) => {{
  const frame = useCurrentFrame();
  const {{ fps }} = useVideoConfig();

  const keyframes: KeyframePoint[] = [
    {{ timeMs: 0, pose: "pointing", scale: 0.94, y: 80, rotate: -2, opacity: 0 }},
    {{ timeMs: 350, pose: "pointing", scale: 1.0, y: 0, rotate: 0, opacity: 1 }},
    {{ timeMs: 4000, pose: "pointing", scale: 1.02, y: -4, rotate: 1, opacity: 1 }},
    {{ timeMs: 4800, pose: "pointing", scale: 0.95, y: 90, rotate: 2, opacity: 0 }},
    {{ timeMs: {round((duration_sec - 5) * 1000)}, pose: "open", scale: 0.94, y: 80, rotate: -2, opacity: 0 }},
    {{ timeMs: {round((duration_sec - 4.5) * 1000)}, pose: "open", scale: 1.06, y: 0, rotate: 0, opacity: 1 }},
    {{ timeMs: {round(duration_sec * 1000)}, pose: "open", scale: 1.08, y: -6, rotate: 0, opacity: 1 }},
  ];

  const isIntro = currentMs >= 0 && currentMs < 4800;
  const isFinale = currentMs >= {round((duration_sec - 5) * 1000)};
  const isPresenterActive = isIntro || isFinale;

  const badgeSpring = spring({{ frame, fps, config: {{ damping: 18, mass: 0.8, stiffness: 110 }} }});
  if (!isPresenterActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col items-center justify-end overflow-hidden">
      <div className="absolute inset-0 backdrop-blur-2xl bg-white/35 pointer-events-none transition-all duration-500" />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[850px] h-[850px] rounded-full pointer-events-none blur-[120px]"
        style={{{{
          background: isFinale
            ? "radial-gradient(circle, rgba(16,185,129,0.32) 0%, rgba(14,165,233,0.2) 60%, transparent 80%)"
            : "radial-gradient(circle, rgba(244,63,94,0.32) 0%, rgba(99,102,241,0.18) 60%, transparent 80%)",
        }}}}
      />
      {{isIntro && (
        <div
          className="absolute top-[13%] apple-glass flex items-center shadow-[0_30px_70px_rgba(244,63,94,0.22)] border-[5px] border-white z-40"
          style={{{{
            transform: `translateY(${{(1 - badgeSpring) * -20}}px) scale(${{0.96 + badgeSpring * 0.04}})`,
            padding: "24px 54px",
            borderRadius: 44,
            gap: 20,
          }}}}
        >
          <Sparkles className="text-rose-500 animate-spin" style={{{{ width: 52, height: 52, animationDuration: "8s" }}}} />
          <span className="text-slate-950 font-black tracking-wider uppercase" style={{{{ fontSize: 38 }}}}>
            {topic.upper()}
          </span>
        </div>
      )}}
      <CharacterKeyframeAnimator keyframes={{keyframes}} currentMs={{currentMs}} />
    </div>
  );
}};
"""
    (clip_dir / "Presenter.tsx").write_text(pres_code, encoding="utf-8")

    # 3. Canvas
    canvas_code = f"""import React from "react";
import {{ interpolate, spring, useCurrentFrame, useVideoConfig }} from "remotion";
import {{ Target, Sparkles, Brain, CheckCircle2 }} from "lucide-react";
import {{ WordTimestamp }} from "../../types";

interface CanvasProps {{
  transcript: WordTimestamp[];
}}

export const {pascal_name}Canvas: React.FC<CanvasProps> = () => {{
  const frame = useCurrentFrame();
  const {{ fps, durationInFrames }} = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  const cameraZoom = interpolate(frame, [0, durationInFrames], [1.0, 1.05], {{
    extrapolateRight: "clamp",
  }});

  const isMidScene = currentMs >= 4800 && currentMs < {round((duration_sec - 5) * 1000)};
  if (!isMidScene) return null;

  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none z-20 select-none overflow-hidden"
      style={{{{ transform: `scale(${{cameraZoom}})`, transformOrigin: "center center" }}}}
    >
      <div className="absolute inset-x-0 top-[42%] -translate-y-1/2 flex flex-col items-center justify-center px-8">
        <div className="w-full max-w-[940px] rounded-[44px] p-9 bg-white/98 border-3 border-amber-200 shadow-2xl flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg">
              <Brain className="w-8 h-8" />
            </div>
            <div>
              <div className="text-xs font-mono font-black text-amber-600 uppercase">CORE PSYCHOLOGY</div>
              <div className="text-3xl font-black text-slate-950">{topic}</div>
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 text-base font-semibold leading-relaxed">
            Key insight: Consistent execution of small commitments compounds into permanent self-transformation.
          </div>
        </div>
      </div>
    </div>
  );
}};
"""
    (clip_dir / "Canvas.tsx").write_text(canvas_code, encoding="utf-8")

    # ─────────────────────────────────────────────────────────────────────────────
    # 4. index.tsx  — GENTLE EVENT-DRIVEN SOUND DESIGN
    # ─────────────────────────────────────────────────────────────────────────────
    fps = 30
    mid_scene_frame = 144  # 4.8s (Canvas Storyboard Pop)
    finale_frame = max(mid_scene_frame + 60, round((duration_sec - 5.0) * fps))  # Finale Presenter Re-Entry

    idx_code = f"""import React from "react";
import {{ Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig }} from "remotion";
import {{ {pascal_name}Background }} from "./Background";
import {{ {pascal_name}Canvas }} from "./Canvas";
import {{ {pascal_name}Presenter }} from "./Presenter";
import {{ AppleProgressBar }} from "../../components/AppleProgressBar";
import {{ AppleKineticCaptions }} from "../../components/AppleKineticCaptions";
import rawTranscript from "./transcript.json";
import {{ WordTimestamp }} from "../../types";
import "../../style.css";

const transcript: WordTimestamp[] = (rawTranscript as any[]).map((t) => ({{
  word: t.word,
  startMs: t.startMs ?? t.start,
  endMs: t.endMs ?? t.end,
}}));

// Gentle tactile audio triggers — tied strictly to actual visual card entrances
const SFX_FRAMES = [
  0,                  // 0.0s: Intro Topic Badge Entrance
  {mid_scene_frame},  // 4.8s: Storyboard Psychology Card Pop
  {finale_frame},     // Finale Presenter Re-Entry
];

export const {pascal_name}Composition: React.FC = () => {{
  const {{ width, height, fps, durationInFrames }} = useVideoConfig();
  const frame = useCurrentFrame();
  const currentMs = (frame / fps) * 1000;

  return (
    <div
      className="relative w-full h-full bg-[#fbfbfd] text-slate-900 flex flex-col justify-between overflow-hidden select-none font-sans"
      style={{{{ width, height }}}}
    >
      {{/* 1. Voiceover Audio Track */}}
      <Audio src={{staticFile("{name}/voiceover.mp3")}} volume={{1.3}} />

      {{/* 2. Ducked Background Ambient Music */}}
      <Audio
        src={{staticFile("audio/bgm/monume-documentary-documentary-music-547923.mp3")}}
        volume={{(f) =>
          interpolate(
            f,
            [0, 25, durationInFrames - 35, durationInFrames],
            [0, 0.12, 0.12, 0],
            {{ extrapolateLeft: "clamp", extrapolateRight: "clamp" }}
          )
        }}
        loop
      />

      {{/* 3. Gentle Tactile Audio Feedback (Subtle Apple-style clicks on real visual shifts) */}}
      {{SFX_FRAMES.map((f, idx) => (
        <Sequence key={`sfx-${{idx}}`} from={{f}} durationInFrames={{15}}>
          <Audio src={{staticFile("audio/sfx/mouse_click.mp3")}} volume={{0.22}} />
        </Sequence>
      ))}}

      {{/* 4. Top Apple Sleek Progress Bar */}}
      <AppleProgressBar />

      {{/* 5. Apple Studio Mesh Background */}}
      <{pascal_name}Background />

      {{/* 6. Motion Graphics Storyboard Canvas */}}
      <{pascal_name}Canvas transcript={{transcript}} />

      {{/* 7. Multi-Pose Character Presenter */}}
      <{pascal_name}Presenter currentMs={{currentMs}} />

      {{/* 8. Kinetic Captions with Neon Apple Glow */}}
      <AppleKineticCaptions transcript={{transcript}} />
    </div>
  );
}};
"""
    (clip_dir / "index.tsx").write_text(idx_code, encoding="utf-8")
    print(f"      Scaffolded 4 clip components in src/clips/{name}/")
    return pascal_name

def register_composition_and_thumbnail(name: str, pascal_name: str, topic: str, format_type: str):
    root_file = ROOT_DIR / "src" / "Root.tsx"
    thumb_file = ROOT_DIR / "src" / "thumbnails" / "index.tsx"
    render_script = ROOT_DIR / "scripts" / "render_all_thumbnails.js"
    meta_file = ROOT_DIR / "studio" / "metadata.json"

    # Register in Root.tsx if not already there
    root_content = root_file.read_text(encoding="utf-8")
    if f"{pascal_name}Composition" not in root_content:
        import_stmt = f'import {{ {pascal_name}Composition }} from "./clips/{name}";\nimport {name}Transcript from "./clips/{name}/transcript.json";\n'
        thumb_import = f', {pascal_name}Thumbnail'
        root_content = root_content.replace('import { PromisesComposition }', f'{import_stmt}import {{ PromisesComposition }}')
        root_content = root_content.replace('PromisesThumbnail,', f'PromisesThumbnail,\n  {pascal_name}Thumbnail,')
        
        comp_code = f"""
  const {name}Duration = calculateDurationInFrames({name}Transcript as any[], fps);"""
        root_content = root_content.replace('const promisesDuration', f'{comp_code}\n  const promisesDuration')

        jsx_comp = f"""
      <Composition
        id="{pascal_name}Video"
        component={{{pascal_name}Composition}}
        durationInFrames={{{name}Duration}}
        fps={{fps}}
        width={{{1080 if format_type == "shorts" else 1920}}}
        height={{{1920 if format_type == "shorts" else 1080}}}
      />"""
        root_content = root_content.replace('{/* 0. Broken Promises', f'{jsx_comp}\n\n      {{/* 0. Broken Promises')

        jsx_still = f"""
      <Still
        id="{pascal_name}Thumbnail"
        component={{{pascal_name}Thumbnail}}
        width={{{1080 if format_type == "shorts" else 1920}}}
        height={{{1920 if format_type == "shorts" else 1080}}}
      />"""
        root_content = root_content.replace('</>\n  );', f'{jsx_still}\n    </>\n  );')
        root_file.write_text(root_content, encoding="utf-8")
        print("      Registered composition and still in src/Root.tsx")

    # Register in thumbnails/index.tsx
    thumb_content = thumb_file.read_text(encoding="utf-8")
    if f"{pascal_name}Thumbnail" not in thumb_content:
        thumb_decl = f"""
export const {pascal_name}Thumbnail: React.FC = () => (
  <ThumbnailCard
    title="{topic.upper()}"
    highlightWord="{topic.split()[0].upper() if topic.split() else 'TRUTH'}"
    highlightColor="rose"
    subtitle="High-Retention Psychology Breakdown"
    categoryBadge="PSYCHOLOGY"
    characterPose="character_fullbody_pointing.png"
    characterScale={{1.0}}
    theme="obsidian"
    aspectRatio="{ "9:16" if format_type == "shorts" else "16:9" }"
    extraBadge="MINDSET"
  />
);
"""
        thumb_content += thumb_decl
        thumb_file.write_text(thumb_content, encoding="utf-8")
        print("      Registered thumbnail component in src/thumbnails/index.tsx")

    # Register in render_all_thumbnails.js
    render_content = render_script.read_text(encoding="utf-8")
    if f"{name}_video.mp4" not in render_content:
        render_content = render_content.replace(
            "'promises_video.mp4': 'PromisesThumbnail',",
            f"'promises_video.mp4': 'PromisesThumbnail',\n  '{name}_video.mp4': '{pascal_name}Thumbnail',"
        )
        render_script.write_text(render_content, encoding="utf-8")

    # Add metadata
    if meta_file.exists():
        try:
            meta = json.loads(meta_file.read_text(encoding="utf-8"))
            meta[f"{name}_video.mp4"] = {
                "topic": name,
                "title": f"{topic} 🧠 #{'Shorts' if format_type == 'shorts' else 'Masterclass'}",
                "description": f"{topic} — Psychological breakdown of mental models, habit loops, and identity shifts.\n\n#Shorts #Psychology #Mindset #SelfImprovement",
                "tags": ["Shorts", "Psychology", "Mindset", topic, "Self Improvement"],
                "categoryId": "27",
                "privacyStatus": "public"
            }
            meta_file.write_text(json.dumps(meta, indent=2, ensure_ascii=False), encoding="utf-8")
            print("      Added metadata to studio/metadata.json")
        except Exception as e:
            print(f"      Metadata warning: {e}")

def render_assets(name: str, pascal_name: str):
    print("🎥 [4/4] Rendering 4K Thumbnail & MP4 Video...")
    out_thumb = ROOT_DIR / "out" / f"{name}_video_thumbnail.png"
    out_video = ROOT_DIR / "out" / f"{name}_video.mp4"
    out_thumb.parent.mkdir(parents=True, exist_ok=True)

    # 1. Render Thumbnail
    print(f"      Rendering Still: {pascal_name}Thumbnail -> {out_thumb.name}...")
    subprocess.run(
        f'npx remotion still src/index.ts {pascal_name}Thumbnail "{out_thumb}" --overwrite',
        shell=True,
        cwd=str(ROOT_DIR),
        check=True
    )

    # 2. Render Video
    print(f"      Rendering Video: {pascal_name}Video -> {out_video.name}...")
    subprocess.run(
        f'npx remotion render src/index.ts {pascal_name}Video "{out_video}" --concurrency=4 --overwrite',
        shell=True,
        cwd=str(ROOT_DIR),
        check=True
    )
    print(f"\n🎉 Video & 4K Thumbnail successfully created in out/{out_video.name} & out/{out_thumb.name}!")

async def main():
    parser = argparse.ArgumentParser(description="RightClips Autonomous Video Engine")
    parser.add_argument("--name", required=True, help="Clip identifier (e.g. discipline)")
    parser.add_argument("--topic", default=None, help="Display title / topic")
    parser.add_argument("--script", required=True, help="Voiceover script text")
    parser.add_argument("--format", choices=["shorts", "longform"], default="shorts")
    parser.add_argument("--voice", default="en-US-AvaNeural")
    parser.add_argument("--no-render", action="store_true", help="Skip final MP4/PNG render")

    args = parser.parse_args()
    name = re.sub(r"[^a-z0-9_]+", "_", args.name.lower()).strip("_")
    topic = args.topic or name.replace("_", " ").title()

    audio_path = ROOT_DIR / "public" / name / "voiceover.mp3"
    transcript_path = ROOT_DIR / "src" / "clips" / name / "transcript.json"

    # Step 1: Synthesize
    await synthesize_speech(args.script, audio_path, args.voice)

    # Step 2: Transcribe
    words, duration_sec = transcribe_audio(audio_path, transcript_path)

    # Step 3: Scaffold & Register
    pascal_name = scaffold_clip_files(name, topic, args.format, duration_sec)
    register_composition_and_thumbnail(name, pascal_name, topic, args.format)

    # Step 4: Render
    if not args.no_render:
        render_assets(name, pascal_name)

if __name__ == "__main__":
    asyncio.run(main())
