#!/usr/bin/env python3
"""
RightClips Master CLI Generator
End-to-end automated video, 4K thumbnail, and cutout asset storyboard generation for AI agents & creators.
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
REGISTRY_PATH = ROOT_DIR / "public" / "assets" / "registry.json"

def load_asset_registry():
    if REGISTRY_PATH.exists():
        try:
            with open(REGISTRY_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {}

def select_cutout_assets(topic: str, script: str):
    """
    Intelligently select the best matching problem & solution cutout assets from the registry based on text keywords.
    """
    registry = load_asset_registry()
    if not registry:
        return ("phone_dopamine_overload", "hyperrealistic_3d_glowing_brain")

    combined_text = f"{topic} {script}".lower()

    # Keyword scoring
    scored = []
    for asset_id, meta in registry.items():
        score = 0
        for kw in meta.get("keywords", []):
            if re.search(r"\b" + re.escape(kw) + r"\b", combined_text):
                score += 3
            elif kw in combined_text:
                score += 1
        scored.append((score, asset_id, meta))

    scored.sort(key=lambda x: x[0], reverse=True)

    # Separate problem/burnout vs solution/psychology/habits
    problem_assets = [item for item in scored if item[2].get("category") in ["burnout", "devices"] or item[2].get("tone") in ["critical", "drained", "chaotic", "oppressive", "distressed"]]
    solution_assets = [item for item in scored if item[2].get("category") in ["psychology", "habits", "relationships"] and item[2].get("tone") in ["insightful", "epiphany", "uplifting", "warm", "focused", "disciplined"]]

    problem_id = problem_assets[0][1] if problem_assets else "brain_battery_depleted"
    solution_id = solution_assets[0][1] if solution_assets else "hyperrealistic_3d_glowing_brain"

    return problem_id, solution_id

async def synthesize_speech(text: str, output_path: Path, voice: str = "en-US-AvaMultilingualNeural"):
    import edge_tts
    output_path.parent.mkdir(parents=True, exist_ok=True)
    print(f"🎙️ [1/4] Synthesizing neural speech with voice '{voice}' (rate=+8% for retention)...")
    communicate = edge_tts.Communicate(text=text, voice=voice, rate="+8%")
    await communicate.save(str(output_path))
    print(f"      Saved voiceover to: {output_path}")

def transcribe_audio(audio_path: Path, output_json: Path):
    from faster_whisper import WhisperModel
    import ctranslate2

    print("📝 [2/4] Extracting word timestamps with faster-whisper...")
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
        except Exception as e:
            print(f"      CUDA runtime ({e}), using CPU int8...")
            model = WhisperModel("base.en", device="cpu", compute_type="int8")
            seg_gen, info = model.transcribe(str(audio_path), word_timestamps=True, language="en", beam_size=5)
            segments = list(seg_gen)
            device = "cpu"
            comp_type = "int8"
    else:
        model = WhisperModel("base.en", device="cpu", compute_type="int8")
        seg_gen, info = model.transcribe(str(audio_path), word_timestamps=True, language="en", beam_size=5)
        segments = list(seg_gen)

    print(f"      Transcribing on compute device: {device} ({comp_type})")

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

def scaffold_clip_files(name: str, topic: str, format_type: str, duration_sec: float, script_text: str):
    print(f"🎨 [3/4] Scaffolding Remotion clip files with Pro Cutout Storyboard in src/clips/{name}/...")
    clip_dir = ROOT_DIR / "src" / "clips" / name
    clip_dir.mkdir(parents=True, exist_ok=True)

    pascal_name = "".join(w.capitalize() for w in re.split(r"[_\-\s]+", name))
    problem_cutout, solution_cutout = select_cutout_assets(topic, script_text)
    print(f"      Selected Cutout Metaphors: Problem='{problem_cutout}', Solution='{solution_cutout}'")

    # Dynamic proportional timing:
    intro_ms = min(4000, round(duration_sec * 1000 * 0.22))
    outro_ms = max(intro_ms + 2000, round(duration_sec * 1000 * 0.78))
    mid_start = intro_ms
    mid_end = outro_ms
    pivot_ms = round(mid_start + (mid_end - mid_start) * 0.48)

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
        className="absolute w-[700px] h-[700px] rounded-full blur-[140px] opacity-25"
        style={{{{
          background: "radial-gradient(circle, #38bdf8 0%, #6366f1 100%)",
          top: "12%",
          left: "-10%",
        }}}}
      />
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-20"
        style={{{{
          background: "radial-gradient(circle, #f43f5e 0%, #fb923c 100%)",
          bottom: "18%",
          right: "-10%",
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
import {{ Sparkles, Zap }} from "lucide-react";

interface PresenterProps {{
  currentMs: number;
}}

export const {pascal_name}Presenter: React.FC<PresenterProps> = ({{ currentMs }}) => {{
  const frame = useCurrentFrame();
  const {{ fps }} = useVideoConfig();

  const keyframes: KeyframePoint[] = [
    {{ timeMs: 0, pose: "fullbody_pointing", scale: 1.0, y: 80, rotate: -1, opacity: 0 }},
    {{ timeMs: 350, pose: "fullbody_pointing", scale: 1.0, y: 0, rotate: 0, opacity: 1 }},
    {{ timeMs: {intro_ms - 600}, pose: "fullbody_pointing", scale: 1.03, y: -4, rotate: 0, opacity: 1 }},
    {{ timeMs: {intro_ms}, pose: "fullbody_pointing", scale: 0.96, y: 90, rotate: 1, opacity: 0 }},
    {{ timeMs: {outro_ms}, pose: "fullbody_open", scale: 0.96, y: 80, rotate: -1, opacity: 0 }},
    {{ timeMs: {outro_ms + 400}, pose: "fullbody_open", scale: 1.0, y: 0, rotate: 0, opacity: 1 }},
    {{ timeMs: {round(duration_sec * 1000)}, pose: "fullbody_open", scale: 1.04, y: -6, rotate: 0, opacity: 1 }},
  ];

  const isIntro = currentMs >= 0 && currentMs < {intro_ms};
  const isFinale = currentMs >= {outro_ms};
  const isPresenterActive = isIntro || isFinale;

  const badgeSpring = spring({{ frame, fps, config: {{ damping: 18, mass: 0.8, stiffness: 110 }} }});
  if (!isPresenterActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col items-center justify-end overflow-hidden">
      <div className="absolute inset-0 backdrop-blur-2xl bg-white/35 pointer-events-none" />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[850px] h-[850px] rounded-full pointer-events-none blur-[120px]"
        style={{{{
          background: isFinale
            ? "radial-gradient(circle, rgba(16,185,129,0.35) 0%, rgba(14,165,233,0.2) 60%, transparent 80%)"
            : "radial-gradient(circle, rgba(244,63,94,0.35) 0%, rgba(99,102,241,0.2) 60%, transparent 80%)",
        }}}}
      />
      {{isIntro && (
        <div
          className="absolute top-[13%] apple-glass flex items-center shadow-[0_30px_70px_rgba(0,113,227,0.18)] border-[5px] border-white z-40"
          style={{{{
            transform: `translateY(${{(1 - badgeSpring) * -20}}px) scale(${{0.96 + badgeSpring * 0.04}})`,
            padding: "24px 54px",
            borderRadius: 44,
            gap: 20,
          }}}}
        >
          <Zap className="text-[#0071e3]" style={{{{ width: 52, height: 52 }}}} />
          <span className="text-slate-950 font-black tracking-wider uppercase" style={{{{ fontSize: 38 }}}}>
            {topic.upper()}
          </span>
        </div>
      )}}
      <CharacterKeyframeAnimator keyframes={{keyframes}} currentMs={{currentMs}} baseHeight={{1550}} />
    </div>
  );
}};
"""
    (clip_dir / "Presenter.tsx").write_text(pres_code, encoding="utf-8")

    # 3. Canvas (High-Retention Storyboard with ProCutout & PropComparison)
    canvas_code = f"""import React from "react";
import {{ spring, useCurrentFrame, useVideoConfig }} from "remotion";
import {{ ProCutout }} from "../../components/ProCutout";
import {{ WordTimestamp }} from "../../types";
import {{ Sparkles, AlertCircle, Target }} from "lucide-react";

interface CanvasProps {{
  transcript: WordTimestamp[];
}}

export const {pascal_name}Canvas: React.FC<CanvasProps> = () => {{
  const frame = useCurrentFrame();
  const {{ fps }} = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  // Scene Timings:
  // Scene 1 (Diagnostic Problem): {mid_start}ms - {pivot_ms}ms
  // Scene 2 (Neural Shift / Solution): {pivot_ms}ms - {mid_end}ms
  const isScene1 = currentMs >= {mid_start} && currentMs < {pivot_ms};
  const isScene2 = currentMs >= {pivot_ms} && currentMs < {mid_end};

  const sp = (delayMs: number, d = 20, s = 90, m = 0.85) => {{
    const df = Math.floor((delayMs / 1000) * fps);
    return spring({{
      frame: Math.max(0, frame - df),
      fps,
      config: {{ damping: d, stiffness: s, mass: m }},
    }});
  }};

  if (!isScene1 && !isScene2) return null;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-20 select-none overflow-hidden flex flex-col items-center justify-center px-6">
      {{/* ─────────────────────────────────────────────────────────────
          SCENE 1: THE ROOT FRICTION & DIAGNOSTIC PROBLEM
      ───────────────────────────────────────────────────────────── */}}
      {{isScene1 && (() => {{
        const sCard = sp({mid_start});

        return (
          <div className="w-full max-w-[1000px] flex flex-col items-center gap-7">
            {{/* Ghost Headline */}}
            <div className="absolute -top-32 text-[260px] font-black text-slate-900/[0.04] leading-none tracking-tighter uppercase pointer-events-none select-none">
              TRAP
            </div>



            {{/* Main Diagnostic Card */}}
            <div
              className="w-full rounded-[52px] p-10 bg-white/95 backdrop-blur-2xl border-[4px] border-rose-200/80 shadow-2xl flex items-center gap-8"
              style={{{{
                transform: `translateY(${{(1 - sCard) * 45}}px) scale(${{0.94 + sCard * 0.06}})`,
                opacity: Math.min(1, sCard * 1.5),
              }}}}
            >
              <div className="w-64 h-64 shrink-0">
                <ProCutout
                  assetId="{problem_cutout}"
                  glowColor="rose"
                  animation="punch_in"
                  annotation="BURNOUT LOOP"
                  annotationPosition="top-right"
                  width="100%"
                  height="100%"
                />
              </div>

              <div className="flex-1 flex flex-col gap-4">
                <div className="text-4xl font-black text-slate-950 uppercase tracking-tight leading-tight">
                  Neural Circuit Overload
                </div>
                <div className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-200/80 text-rose-950 font-black text-2xl flex items-center gap-3">
                  <span className="w-3.5 h-3.5 rounded-full bg-rose-500 shrink-0" />
                  <span>Draining focus before you even begin</span>
                </div>
              </div>
            </div>
          </div>
        );
      }})()}}

      {{/* ─────────────────────────────────────────────────────────────
          SCENE 2: THE NEURAL REWIRE & SOLUTION FRAMEWORK
      ───────────────────────────────────────────────────────────── */}}
      {{isScene2 && (() => {{
        const sCard = sp({pivot_ms});

        return (
          <div className="w-full max-w-[1000px] flex flex-col items-center gap-7">
            {{/* Ghost Headline */}}
            <div className="absolute -top-32 text-[260px] font-black text-slate-900/[0.04] leading-none tracking-tighter uppercase pointer-events-none select-none">
              REWIRE
            </div>



            {{/* Solution Hero Card */}}
            <div
              className="w-full rounded-[52px] p-10 bg-white/95 backdrop-blur-2xl border-[4px] border-emerald-200/80 shadow-2xl flex items-center gap-8"
              style={{{{
                transform: `translateY(${{(1 - sCard) * 45}}px) scale(${{0.94 + sCard * 0.06}})`,
                opacity: Math.min(1, sCard * 1.5),
              }}}}
            >
              <div className="w-64 h-64 shrink-0">
                <ProCutout
                  assetId="{solution_cutout}"
                  glowColor="emerald"
                  animation="stamp_impact"
                  annotation="REWIRED"
                  annotationPosition="top-right"
                  width="100%"
                  height="100%"
                />
              </div>

              <div className="flex-1 flex flex-col gap-4">
                <div className="text-4xl font-black text-slate-950 uppercase tracking-tight leading-tight">
                  High-Retention Clarity
                </div>
                <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-200/80 text-emerald-950 font-black text-2xl flex items-center gap-3">
                  <Sparkles className="w-7 h-7 text-emerald-600 shrink-0" />
                  <span>1 Micro-Shift Transforms The Output</span>
                </div>
              </div>
            </div>
          </div>
        );
      }})()}}
    </div>
  );
}};
"""
    (clip_dir / "Canvas.tsx").write_text(canvas_code, encoding="utf-8")

    # 4. index.tsx
    fps = 30
    mid_scene_frame = round((mid_start / 1000) * fps)
    impact_frame = mid_scene_frame + 12
    solution_frame = round((pivot_ms / 1000) * fps)
    finale_frame = round((outro_ms / 1000) * fps)

    idx_code = f"""import React from "react";
import {{ Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig }} from "remotion";
import {{ {pascal_name}Background }} from "./Background";
import {{ {pascal_name}Canvas }} from "./Canvas";
import {{ {pascal_name}Presenter }} from "./Presenter";
import {{ AppleProgressBar }} from "../../components/AppleProgressBar";
import {{ AppleKineticCaptions }} from "../../components/AppleKineticCaptions";
import {{ SoundDesignEngine, SfxCue }} from "../../components/SoundDesignEngine";
import {{ {pascal_name}Thumbnail }} from "../../thumbnails";
import rawTranscript from "./transcript.json";
import {{ WordTimestamp }} from "../../types";
import "../../style.css";

const transcript: WordTimestamp[] = (rawTranscript as any[]).map((t) => ({{
  word: t.word,
  startMs: t.startMs ?? t.start,
  endMs: t.endMs ?? t.end,
}}));

// Multi-SFX audio cues synchronized with visual card & cutout entrances
const SFX_CUES: SfxCue[] = [
  {{ frame: 0,                 type: "whoosh_deep",    volume: 0.32 }}, // 0.0s: Intro Presenter entrance
  {{ frame: 12,                type: "click",          volume: 0.26 }}, // 0.4s: Topic badge pop
  {{ frame: {mid_scene_frame}, type: "whoosh_fast",    volume: 0.34 }}, // Storyboard card entrance
  {{ frame: {impact_frame},    type: "impact_hit",     volume: 0.22 }}, // Problem cutout diagnostic reveal
  {{ frame: {solution_frame},  type: "whoosh_sparkle", volume: 0.32 }}, // Solution cutout insight reveal
  {{ frame: {finale_frame},    type: "whoosh_sparkle", volume: 0.35 }}, // Finale Presenter Re-Entry
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
      {{/* 0. High-Converting 4K Thumbnail First-Frame */}}
      {{frame === 0 && (
        <div className="absolute inset-0 w-full h-full z-50 pointer-events-none">
          <{pascal_name}Thumbnail />
        </div>
      )}}

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

      {{/* 3. Rich Layered Sound Design Engine */}}
      <SoundDesignEngine cues={{SFX_CUES}} />

      {{/* 4. Top Apple Progress Bar */}}
      <AppleProgressBar />

      {{/* 5. Apple Studio Mesh Background */}}
      <{pascal_name}Background />

      {{/* 6. Motion Graphics Storyboard Canvas with Pro Cutouts */}}
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
    theme="apple_studio"
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
    out_thumb = f"out/{name}_video_thumbnail.png"
    out_video = f"out/{name}_video.mp4"
    (ROOT_DIR / "out").mkdir(parents=True, exist_ok=True)

    npx_bin = "npx.cmd" if sys.platform == "win32" else "npx"
    gl_flag = "--gl=egl" if sys.platform != "win32" else "--gl=angle"

    # 1. Render Thumbnail
    print(f"      Rendering Still (GPU): {pascal_name}Thumbnail -> {out_thumb}...")
    subprocess.run(
        f"{npx_bin} remotion still src/index.ts {pascal_name}Thumbnail {out_thumb} {gl_flag} --overwrite",
        shell=True,
        cwd=str(ROOT_DIR),
        check=True
    )

    # 2. Render Video with GPU acceleration
    print(f"      Rendering Video (GPU accelerated): {pascal_name}Video -> {out_video}...")
    subprocess.run(
        f"{npx_bin} remotion render src/index.ts {pascal_name}Video {out_video} {gl_flag} --concurrency=4 --overwrite",
        shell=True,
        cwd=str(ROOT_DIR),
        check=True
    )
    print(f"\n🎉 Video & 4K Thumbnail successfully created in {out_video} & {out_thumb}!")

async def main():
    parser = argparse.ArgumentParser(description="RightClips Autonomous Video Engine")
    parser.add_argument("--name", required=True, help="Clip identifier (e.g. discipline)")
    parser.add_argument("--topic", default=None, help="Display title / topic")
    parser.add_argument("--script", required=True, help="Voiceover script text")
    parser.add_argument("--format", choices=["shorts", "longform"], default="shorts")
    parser.add_argument("--voice", default="en-US-AvaMultilingualNeural")
    parser.add_argument("--no-render", action="store_true", help="Skip final MP4/PNG render")

    args = parser.parse_args()
    
    # Strip {no topics} and {no topic} modifier tags cleanly
    no_topics_pattern = re.compile(r"\{\s*no\s+topics?\s*\}", re.IGNORECASE)
    clean_script = no_topics_pattern.sub("", args.script).strip()
    clean_topic = no_topics_pattern.sub("", args.topic or "").strip() if args.topic else None

    name = re.sub(r"\{\s*no\s+topics?\s*\}", "", args.name, flags=re.IGNORECASE)
    name = re.sub(r"[^a-z0-9_]+", "_", name.lower()).strip("_")
    topic = clean_topic or name.replace("_", " ").title()

    audio_path = ROOT_DIR / "public" / name / "voiceover.mp3"
    transcript_path = ROOT_DIR / "src" / "clips" / name / "transcript.json"

    # Step 1: Synthesize
    await synthesize_speech(clean_script, audio_path, args.voice)

    # Step 2: Transcribe
    words, duration_sec = transcribe_audio(audio_path, transcript_path)

    # Step 3: Scaffold & Register
    pascal_name = scaffold_clip_files(name, topic, args.format, duration_sec, clean_script)
    register_composition_and_thumbnail(name, pascal_name, topic, args.format)

    # Step 4: Render
    if not args.no_render:
        render_assets(name, pascal_name)

if __name__ == "__main__":
    asyncio.run(main())
