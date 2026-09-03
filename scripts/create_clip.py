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
def sanitize_tags(text: str) -> str:
    if not text:
        return ""
    # Strip {Health}, {Finance}, {Self Improvement}, {Self Improvment}, {no topics}, {no topic}
    pattern = re.compile(r"\{\s*(health|finance|self\s*improv?ement|no\s*topics?)\s*\}", re.IGNORECASE)
    cleaned = pattern.sub("", text)
    # Also strip any residual curly braces that might break JSX evaluation
    cleaned = re.sub(r"[{}\\]", "", cleaned)
    return re.sub(r"\s+", " ", cleaned).strip()

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

def parse_script_into_concepts(script_text: str):
    lines = [l.strip() for l in script_text.splitlines() if l.strip()]
    concepts = []
    for line in lines:
        parts = [p.strip() for p in re.split(r'(?<=[a-zA-Z][.?!])\s+(?=[A-Z"\'“‘])', line) if p.strip()]
        for p in parts:
            if p:
                concepts.append(p)
    return concepts

def align_concepts(concepts, words_list, fps=30):
    aligned = []
    curr_idx = 0
    total_words = len(words_list) if words_list else 0
    
    for c in concepts:
        c_tokens = [re.sub(r"[^a-zA-Z0-9]", "", w.lower()) for w in c.split() if w.strip()]
        if not c_tokens:
            continue
        
        match_idx = None
        if total_words > 0:
            for i in range(curr_idx, total_words):
                w_token = re.sub(r"[^a-zA-Z0-9]", "", words_list[i].get("word", "").lower())
                if w_token == c_tokens[0]:
                    match_idx = i
                    break
                elif len(c_tokens) > 1 and w_token == c_tokens[1]:
                    match_idx = max(0, i - 1)
                    break
        
        if match_idx is not None and total_words > 0:
            start_ms = words_list[match_idx].get("startMs", words_list[match_idx].get("start", 0))
            curr_idx = min(match_idx + max(1, len(c_tokens) - 1), total_words - 1)
            end_ms = words_list[curr_idx].get("endMs", words_list[curr_idx].get("end", start_ms + 1500))
        else:
            prev_end = aligned[-1]["endMs"] if aligned else 0
            start_ms = prev_end + 300
            end_ms = start_ms + 2000
        
        aligned.append({
            "text": c,
            "startMs": start_ms,
            "endMs": end_ms,
            "startFrame": round((start_ms / 1000) * fps),
            "endFrame": round((end_ms / 1000) * fps)
        })
    return aligned

def scaffold_clip_files(name: str, raw_topic: str, format_type: str, duration_sec: float, raw_script: str, words_list: list = None):
    topic = sanitize_tags(raw_topic)
    script_text = sanitize_tags(raw_script)
    print(f"🎨 [3/4] Scaffolding Remotion clip files with Speech-Synchronized Progressive Reveal in src/clips/{name}/...")
    clip_dir = ROOT_DIR / "src" / "clips" / name
    clip_dir.mkdir(parents=True, exist_ok=True)

    fps = 30
    total_frames = round(duration_sec * fps)
    pascal_name = "".join(w.capitalize() for w in re.split(r"[_\-\s]+", name))
    problem_cutout, solution_cutout = select_cutout_assets(topic, script_text)

    # 1. Niche Detection & Design System Mapping
    lower_text = f"{topic} {script_text}".lower()
    if "{finance}" in lower_text or "apex wealth" in lower_text or "roth" in lower_text or "credit" in lower_text or "invest" in lower_text or "money" in lower_text or "wealth" in lower_text:
        niche = "finance"
    elif "{health}" in lower_text or "biomatrix" in lower_text or "cortisol" in lower_text or "circadian" in lower_text or "sleep" in lower_text or "dopamine" in lower_text or "adenosine" in lower_text or "body" in lower_text:
        niche = "health"
    else:
        niche = "self_improvement"

    if niche == "finance":
        bg_code = f"""import React from "react";
import {{ FinanceBackground }} from "../../components/finance/FinanceBackground";

export const {pascal_name}Background: React.FC = () => {{
  return <FinanceBackground />;
}};
"""
        card_class = "w-full p-8 rounded-3xl bg-[#0b0f19]/95 border-2 border-emerald-500/40 shadow-2xl backdrop-blur-md flex flex-col items-center text-center gap-6"
        text_color = "text-white"
        accent_color = "text-emerald-400"
        sub_accent = "text-amber-400"
        item_box = "p-4 rounded-2xl bg-[#111827]/90 border border-emerald-500/30 flex items-center justify-between text-left shadow-lg"
        pill_box = "w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl font-black font-mono shrink-0"
        sub_pill = "text-2xl font-mono text-emerald-300 font-bold"
        status_box = "w-full p-4 rounded-2xl bg-black/70 border border-emerald-500/30 flex items-center justify-between text-2xl font-mono text-emerald-200"
        status_alert = "text-amber-400 font-black tracking-wide"
        glow_problem = "rose"
        glow_solution = "emerald"
    elif niche == "health":
        bg_code = f"""import React from "react";
import {{ HealthBackground }} from "../../components/health/HealthBackground";

export const {pascal_name}Background: React.FC = () => {{
  return <HealthBackground />;
}};
"""
        card_class = "w-full p-8 rounded-3xl bg-[#0a1124]/95 border-2 border-cyan-500/40 shadow-2xl backdrop-blur-md flex flex-col items-center text-center gap-6"
        text_color = "text-white"
        accent_color = "text-cyan-400"
        sub_accent = "text-rose-400"
        item_box = "p-4 rounded-2xl bg-[#0e172f]/90 border border-cyan-500/40 flex items-center justify-between text-left shadow-lg"
        pill_box = "w-12 h-12 rounded-xl bg-cyan-500/25 text-cyan-400 flex items-center justify-center text-3xl font-black font-mono shrink-0"
        sub_pill = "text-2xl font-mono text-cyan-300 font-bold"
        status_box = "w-full p-4 rounded-2xl bg-black/70 border border-cyan-500/30 flex items-center justify-between text-2xl font-mono text-cyan-200"
        status_alert = "text-rose-400 font-black tracking-wide"
        glow_problem = "rose"
        glow_solution = "cyan"
    else: # self_improvement
        bg_code = f"""import React from "react";
import {{ LivingStudioBackground }} from "../../components/LivingStudioBackground";

export const {pascal_name}Background: React.FC = () => {{
  return <LivingStudioBackground />;
}};
"""
        card_class = "w-full p-8 rounded-3xl bg-white/95 border-2 border-sky-300/60 shadow-2xl backdrop-blur-md flex flex-col items-center text-center gap-6"
        text_color = "text-slate-950"
        accent_color = "text-[#0071e3]"
        sub_accent = "text-rose-500"
        item_box = "p-4 rounded-2xl bg-slate-50/90 border border-sky-200/80 flex items-center justify-between text-left shadow-lg"
        pill_box = "w-12 h-12 rounded-xl bg-[#0071e3]/15 text-[#0071e3] flex items-center justify-center text-3xl font-black font-mono shrink-0"
        sub_pill = "text-2xl font-mono text-sky-700 font-bold"
        status_box = "w-full p-4 rounded-2xl bg-slate-100/90 border border-sky-200 flex items-center justify-between text-2xl font-mono text-slate-800"
        status_alert = "text-rose-500 font-black tracking-wide"
        glow_problem = "rose"
        glow_solution = "amber"

    (clip_dir / "Background.tsx").write_text(bg_code, encoding="utf-8")

    # 2. Concept Segmentation & Word Timestamp Alignment
    concepts = parse_script_into_concepts(script_text)
    aligned = align_concepts(concepts, words_list, fps)

    if len(aligned) < 3:
        # Fallback if script is very short
        aligned = [
            {"text": topic, "startMs": 0, "endMs": round(duration_sec*350), "startFrame": 0, "endFrame": round(total_frames*0.35)},
            {"text": script_text, "startMs": round(duration_sec*350), "endMs": round(duration_sec*700), "startFrame": round(total_frames*0.35), "endFrame": round(total_frames*0.70)},
            {"text": "Master The Protocol", "startMs": round(duration_sec*700), "endMs": round(duration_sec*1000), "startFrame": round(total_frames*0.70), "endFrame": total_frames},
        ]

    # Partition concepts across 3 scenes:
    # Scene 1: Hook & Diagnostic Problem
    # Scene 2: The Core Breakdown / List Points (REVEALED ONE-BY-ONE!)
    # Scene 3: The Actionable Protocol & Finale
    n_concepts = len(aligned)
    if n_concepts >= 6:
        s1_items = aligned[:2]
        s2_items = aligned[2:-2]
        s3_items = aligned[-2:]
    elif n_concepts >= 4:
        s1_items = aligned[:2]
        s2_items = aligned[2:-1]
        s3_items = aligned[-1:]
    else:
        s1_items = [aligned[0]]
        s2_items = [aligned[1]]
        s3_items = [aligned[-1]]

    s1_start = 0
    s2_start = s2_items[0]["startFrame"]
    s3_start = s3_items[0]["startFrame"]
    s3_end = total_frames

    # Timings for Scene 1 elements:
    c1_hook_text = s1_items[0]["text"]
    c1_problem_text = s1_items[1]["text"] if len(s1_items) > 1 else topic
    f_c1_cutout = s1_items[1]["startFrame"] if len(s1_items) > 1 else max(12, round(s2_start * 0.4))
    f_c1_metric = max(f_c1_cutout + 12, round(s2_start * 0.75))

    # Presenter visibility: Enters intro, and re-enters ONLY for the closing 2.5s outro
    intro_ms = min(3500, round((s1_items[-1]["startFrame"] / fps) * 1000))
    outro_ms = max(intro_ms + 3000, round(((total_frames - 75) / fps) * 1000))

    # 3. Presenter.tsx
    pres_code = f"""import React from "react";
import {{ spring, useCurrentFrame, useVideoConfig }} from "remotion";
import {{ CharacterKeyframeAnimator, KeyframePoint }} from "../../components/CharacterKeyframeAnimator";
import {{ Zap }} from "lucide-react";

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
      <div className="absolute inset-0 backdrop-blur-2xl bg-white/20 pointer-events-none" />
      <CharacterKeyframeAnimator keyframes={{keyframes}} currentMs={{currentMs}} baseHeight={{1550}} />
    </div>
  );
}};
"""
    (clip_dir / "Presenter.tsx").write_text(pres_code, encoding="utf-8")

    # 4. Canvas.tsx with Speech-Synchronized Sequential Reveals
    # Build Scene 2 points JSX
    s2_points_jsx = []
    s2_spring_defs = []
    sfx_cues = [
        {"frame": 0, "type": "whoosh_deep", "volume": 0.32},
        {"frame": f_c1_cutout, "type": "impact_hit", "volume": 0.24},
        {"frame": s2_start, "type": "whoosh_fast", "volume": 0.34},
    ]

    for idx, pt in enumerate(s2_items):
        p_frame = pt["startFrame"]
        p_text = pt["text"]
        clean_text = re.sub(r"^(\d+[\.\)]\s*|[-*]\s*)", "", p_text).strip()
        parts = clean_text.split(":", 1) if ":" in clean_text else [clean_text]
        p_title = parts[0].strip()
        p_desc = parts[1].strip() if len(parts) > 1 else ""

        s2_spring_defs.append(f'const spP{idx+1} = spring({{ frame: frame - {p_frame}, fps, config: {{ damping: 13, stiffness: 140 }} }});')
        sfx_cues.append({"frame": p_frame, "type": "click", "volume": 0.26})

        s2_points_jsx.append(f"""
                {{/* Progressive Item {idx+1} (Spoken Frame: {p_frame}) */}}
                <div
                  style={{{{
                    opacity: frame >= {p_frame} ? Math.min(1, spP{idx+1} * 1.2) : 0,
                    transform: `scale(${{frame >= {p_frame} ? interpolate(spP{idx+1}, [0, 1], [0.8, 1]) : 0.8}}) translateY(${{frame >= {p_frame} ? interpolate(spP{idx+1}, [0, 1], [25, 0]) : 25}}px)`,
                    pointerEvents: frame >= {p_frame} ? "auto" : "none",
                  }}}}
                >
                  <div className="{item_box}">
                    <div className="flex items-center gap-4">
                      <div className="{pill_box}">
                        0{idx+1}
                      </div>
                      <div>
                        <div className="text-3xl font-black {text_color}">
                          {p_title}
                        </div>
                        {f'<div className="{sub_pill} mt-0.5">{p_desc}</div>' if p_desc else ''}
                      </div>
                    </div>
                  </div>
                </div>""")

    # Scene 3 points:
    s3_c1 = s3_items[0]
    s3_c2 = s3_items[1] if len(s3_items) > 1 else s3_items[0]
    f_s3_cutout = s3_c1["startFrame"]
    f_s3_finale = s3_c2["startFrame"]
    sfx_cues.append({"frame": f_s3_cutout, "type": "whoosh_sparkle", "volume": 0.32})
    sfx_cues.append({"frame": f_s3_finale, "type": "impact_hit", "volume": 0.28})

    s2_spring_str = "\n        ".join(s2_spring_defs)
    s2_points_str = "".join(s2_points_jsx)

    canvas_code = f"""import React from "react";
import {{ useCurrentFrame, useVideoConfig, spring, interpolate }} from "remotion";
import {{ PhysicalCard }} from "../../components/physics/PhysicalCard";
import {{ TapeStrip }} from "../../components/collage/TapeStrip";
import {{ ProCutout }} from "../../components/ProCutout";
import {{ Sparkles, Zap, ArrowRight }} from "lucide-react";
import {{ WordTimestamp }} from "../../types";

interface CanvasProps {{
  transcript: WordTimestamp[];
}}

export const {pascal_name}Canvas: React.FC<CanvasProps> = () => {{
  const frame = useCurrentFrame();
  const {{ fps }} = useVideoConfig();

  return (
    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-8 select-none">
      
      {{/* ======================================================== */}}
      {{/* SCENE 1: THE ROOT FRICTION & HOOK (Frames {s1_start} - {s2_start}) */}}
      {{/* ======================================================== */}}
      {{frame >= {s1_start} && frame < {s2_start} && (() => {{
        const spCutout = spring({{ frame: frame - {f_c1_cutout}, fps, config: {{ damping: 13, stiffness: 140 }} }});
        const spMetric = spring({{ frame: frame - {f_c1_metric}, fps, config: {{ damping: 13, stiffness: 140 }} }});

        return (
          <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
            <div className="relative w-full max-w-[920px]">
              <div className="absolute -top-7 right-8 z-30 pointer-events-none">
                <TapeStrip position="top-right" width={{180}} height={{48}} enableWobble />
              </div>

              <PhysicalCard
                tiltX={{4}}
                tiltY={{-4}}
                elevation={{45}}
                impactMs={{{round((s1_start/fps)*1000)}}}
                className="{card_class}"
              >
                {{/* Hero Hook Title */}}
                <h1 className="text-5xl font-black {text_color} leading-tight tracking-tight max-w-[840px] mt-2">
                  {c1_hook_text}
                </h1>

                {{/* Cutout Hero Prop — Revealed on Speech Frame {f_c1_cutout} */}}
                <div
                  className="w-full flex justify-center items-center my-3 transition-all"
                  style={{{{
                    opacity: frame >= {f_c1_cutout} ? Math.min(1, spCutout * 1.2) : 0,
                    transform: `scale(${{frame >= {f_c1_cutout} ? interpolate(spCutout, [0, 1], [0.6, 1]) : 0.6}}) translateY(${{frame >= {f_c1_cutout} ? interpolate(spCutout, [0, 1], [30, 0]) : 30}}px)`,
                    pointerEvents: frame >= {f_c1_cutout} ? "auto" : "none",
                  }}}}
                >
                  <ProCutout
                    assetId="{problem_cutout}"
                    glowColor="{glow_problem}"
                    animation="stamp_impact"
                    width={{420}}
                    height={{320}}
                    ghostText="THE TRAP"
                  />
                </div>

                {{/* Diagnostic Status Bar — Revealed on Speech Frame {f_c1_metric} */}}
                <div
                  className="w-full transition-all"
                  style={{{{
                    opacity: frame >= {f_c1_metric} ? Math.min(1, spMetric * 1.2) : 0,
                    transform: `scale(${{frame >= {f_c1_metric} ? interpolate(spMetric, [0, 1], [0.8, 1]) : 0.8}})`,
                    pointerEvents: frame >= {f_c1_metric} ? "auto" : "none",
                  }}}}
                >
                  <div className="{status_box}">
                    <span className="flex items-center gap-2.5">
                      <Zap className="w-6 h-6 text-amber-400" />
                      <span>{c1_problem_text[:35]}</span>
                    </span>
                    <span className="{status_alert}">CRITICAL DIAGNOSTIC</span>
                  </div>
                </div>
              </PhysicalCard>
            </div>
          </div>
        );
      }})()}}

      {{/* ======================================================== */}}
      {{/* SCENE 2: THE BREAKDOWN (REVEALED ONE-BY-ONE AS SPOKEN!)  */}}
      {{/* (Frames {s2_start} - {s3_start})                          */}}
      {{/* ======================================================== */}}
      {{frame >= {s2_start} && frame < {s3_start} && (() => {{
        {s2_spring_str}

        return (
          <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
            <div className="relative w-full max-w-[920px]">
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                <TapeStrip position="center-top" width={{180}} height={{48}} enableWobble />
              </div>

              <PhysicalCard
                tiltX={{-5}}
                tiltY={{4}}
                elevation={{44}}
                impactMs={{{round((s2_start/fps)*1000)}}}
                className="{card_class}"
              >
                {{/* Clean Uncrowded Section Header */}}
                <div className="text-center mt-1">
                  <h2 className="text-5xl font-black {text_color} leading-tight">
                    {topic}
                  </h2>
                  <div className="text-2xl font-mono {accent_color} font-bold mt-1 tracking-wider uppercase">
                    Core Principles & Breakdown
                  </div>
                </div>

                {{/* PROGRESSIVE SEQUENTIAL REVEALS: ONE BY ONE ON EXACT WORDS */}}
                <div className="flex flex-col gap-4 w-full my-1">
                  {s2_points_str}
                </div>
              </PhysicalCard>
            </div>
          </div>
        );
      }})()}}

      {{/* ======================================================== */}}
      {{/* SCENE 3: THE ACTIONABLE SOLUTION & FINALE (Frames {s3_start} - {s3_end}) */}}
      {{/* ======================================================== */}}
      {{frame >= {s3_start} && frame < {s3_end} && (() => {{
        const spSolCutout = spring({{ frame: frame - {f_s3_cutout}, fps, config: {{ damping: 13, stiffness: 140 }} }});
        const spFinale = spring({{ frame: frame - {f_s3_finale}, fps, config: {{ damping: 13, stiffness: 140 }} }});

        return (
          <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
            <div className="relative w-full max-w-[920px]">
              <div className="absolute -top-7 left-8 z-30 pointer-events-none">
                <TapeStrip position="top-left" width={{180}} height={{48}} enableWobble />
              </div>

              <PhysicalCard
                tiltX={{3}}
                tiltY={{-3}}
                elevation={{45}}
                impactMs={{{round((s3_start/fps)*1000)}}}
                className="{card_class}"
              >
                {{/* Actionable Protocol Title */}}
                <h3 className="text-5xl font-black {text_color} leading-tight mt-1">
                  {s3_c1["text"]}
                </h3>

                {{/* Solution Cutout Hero — Revealed on Speech Frame {f_s3_cutout} */}}
                <div
                  className="w-full flex justify-center items-center my-2 transition-all"
                  style={{{{
                    opacity: frame >= {f_s3_cutout} ? Math.min(1, spSolCutout * 1.2) : 0,
                    transform: `scale(${{frame >= {f_s3_cutout} ? interpolate(spSolCutout, [0, 1], [0.6, 1]) : 0.6}}) translateY(${{frame >= {f_s3_cutout} ? interpolate(spSolCutout, [0, 1], [30, 0]) : 30}}px)`,
                    pointerEvents: frame >= {f_s3_cutout} ? "auto" : "none",
                  }}}}
                >
                  <ProCutout
                    assetId="{solution_cutout}"
                    glowColor="{glow_solution}"
                    animation="stamp_impact"
                    width={{420}}
                    height={{320}}
                    ghostText="REWIRE"
                  />
                </div>

                {{/* Finale Affirmation Statement — Revealed on Speech Frame {f_s3_finale} */}}
                <div
                  className="w-full transition-all"
                  style={{{{
                    opacity: frame >= {f_s3_finale} ? Math.min(1, spFinale * 1.2) : 0,
                    transform: `scale(${{frame >= {f_s3_finale} ? interpolate(spFinale, [0, 1], [0.8, 1]) : 0.8}})`,
                    pointerEvents: frame >= {f_s3_finale} ? "auto" : "none",
                  }}}}
                >
                  <div className="w-full p-5 rounded-2xl bg-black/60 border border-emerald-500/30 flex items-center justify-center gap-3 text-3xl font-black {accent_color} shadow-xl">
                    <Sparkles className="w-7 h-7 text-emerald-400 shrink-0" />
                    <span>{s3_c2["text"]}</span>
                  </div>
                </div>
              </PhysicalCard>
            </div>
          </div>
        );
      }})()}}
    </div>
  );
}};
"""
    (clip_dir / "Canvas.tsx").write_text(canvas_code, encoding="utf-8")

    # 5. index.tsx with Multi-Layered Sound Design
    sfx_json = json.dumps(sfx_cues, indent=2)

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

// Multi-SFX audio cues synchronized with progressive visual reveals
const SFX_CUES: SfxCue[] = {sfx_json};

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

      {{/* 5. Niche Living Background */}}
      <{pascal_name}Background />

      {{/* 6. Speech-Synchronized Progressive Reveal Canvas */}}
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
    print(f"      Scaffolded 4 speech-synchronized clip components in src/clips/{name}/")
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
    
    # Detect channel niche from raw topic & script before sanitizing
    raw_combined = f"{args.topic or ''} {args.script} {args.name}".lower()
    if "{finance}" in raw_combined:
        channel_voice = "en-US-AndrewMultilingualNeural"
    elif "{health}" in raw_combined:
        channel_voice = "en-US-BrianMultilingualNeural"
    else:
        channel_voice = "en-US-AvaMultilingualNeural"

    voice_to_use = args.voice if args.voice and args.voice != "en-US-AvaMultilingualNeural" else channel_voice

    clean_script = sanitize_tags(args.script)
    clean_topic = sanitize_tags(args.topic) if args.topic else None

    name = sanitize_tags(args.name)
    name = re.sub(r"[^a-z0-9_]+", "_", name.lower()).strip("_")
    topic = clean_topic or name.replace("_", " ").title()

    audio_path = ROOT_DIR / "public" / name / "voiceover.mp3"
    transcript_path = ROOT_DIR / "src" / "clips" / name / "transcript.json"

    # Step 1: Synthesize
    await synthesize_speech(clean_script, audio_path, voice_to_use)

    # Step 2: Transcribe
    words, duration_sec = transcribe_audio(audio_path, transcript_path)

    # Step 3: Scaffold & Register
    pascal_name = scaffold_clip_files(name, topic, args.format, duration_sec, clean_script, words)
    register_composition_and_thumbnail(name, pascal_name, topic, args.format)

    # Step 4: Render
    if not args.no_render:
        render_assets(name, pascal_name)

if __name__ == "__main__":
    asyncio.run(main())
