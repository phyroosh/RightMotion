# 🎬 RightMotion — Automated AI Video Studio & Publishing Suite

> **Programmatic Video Creation, Kinetic Typography, and YouTube Publishing Engine powered by Remotion, React, Tailwind CSS, Edge-TTS, and Faster-Whisper.**

---

## 🌟 Overview

**RightMotion** is a high-retention video production and automated publishing platform. It transforms raw text scripts into studio-grade vertical **YouTube Shorts (9:16)** and widescreen **Video Essays (16:9)** featuring:
* **Tactile Apple Glass Aesthetics** with specular sheen animations, fluid spring physics, and dynamic lighting.
* **A-Roll Presenter Mode** with multi-pose host switching (`pointing`, `crossed`, `open`).
* **B-Roll Single-Concept Motion Graphics** with custom tactile props, stopwatch meters, and hand-annotated callouts.
* **Master Voiceover Pipeline**: Natural neural voiceover synthesis (`en-US-JennyNeural`) with automated dead-air silence compression (<180ms cap) and GPU-accelerated word-level timestamp alignment.
* **Integrated YouTube Studio UI**: Local web dashboard (`http://localhost:4000`) for managing video inventory, editing metadata, monitoring channel stats, and 1-click scheduling/uploading directly via YouTube Data API v3.

---

## 🏗️ Architecture & Tech Stack

```
RightMotion/
├── .agents/rules/             # Core editing guidelines & permanent AI rules
│   ├── editing-style.md      # A-Roll/B-Roll pacing, tactile props, typography
│   └── video-pipeline.md     # Audio standards, pause-compression, GPU specs
├── src/
│   ├── Root.tsx              # Remotion root registry for all video compositions
│   ├── types.ts              # Core TypeScript interfaces (WordTimestamp, etc.)
│   ├── components/           # Reusable video components (captions, progress bars)
│   └── clips/                # Individual video composition modules
│       ├── strength/         # Real Strength & Vulnerability Short
│       ├── goggins/          # David Goggins Cookie Jar Short
│       ├── breaks/           # Why Taking A Long Break Isn't Quitting Short
│       ├── adhd/             # ADHD Attention Paradox Short
│       ├── motivation/       # Why Motivation Is A Lie Short
│       ├── maturity/         # Maturity & Growth Short
│       ├── comparison/       # Comparison Trap Short
│       ├── habits/           # Habit Psychology Short
│       └── procrastination/  # 16:9 Long-Form Masterclass Essay
├── public/                   # Static audio assets, voiceovers, character cutouts
│   ├── character_pointing.png
│   ├── character_crossed.png
│   ├── character_open.png
│   └── audio/ (sfx, bgm)
├── scripts/                  # Automation scripts
│   ├── voiceover_engine.py   # Natural TTS + Silence Compressor + Whisper GPU
│   └── generate_strength_clip.py
├── studio/                   # YouTube Studio Web App
│   ├── server.js             # Express backend with YouTube Data API v3 & OAuth 2.0
│   ├── metadata.json         # Video titles, descriptions, tags, and topics
│   ├── uploads.json          # Persistent upload history and schedule tracking
│   └── public/index.html     # Glassmorphism Studio UI dashboard
└── out/                      # Rendered 1080x1920 & 1920x1080 MP4 files
```

---

## ⚡ Quick Start

### 1. Prerequisites
* **Node.js** v18+ & **npm**
* **Python** 3.10+
* **FFmpeg** on system `PATH`
* **NVIDIA GPU with CUDA** (recommended for instant Whisper transcription and Remotion ANGLE rendering)

### 2. Install Dependencies

**Linux / Fedora:**
```bash
./start_studio.sh       # All-in-one: verifies, installs dependencies & launches
# Or standalone setup:
./scripts/setup.sh
```

**Windows:**
```bat
scripts\windows\setup.bat
```

Or manually:
```bash
# Install Node dependencies
npm install

# Setup Python virtual environment & dependencies
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 3. Start Remotion Preview Studio
```bash
npx remotion preview
```
Open [http://localhost:3000](http://localhost:3000) to live preview and scrub any clip with hot reload.

### 4. Start RightMotion Studio (YouTube Publishing Dashboard)

**Linux / Fedora:**
```bash
# Complete verification, auto-setup & launch:
./start_studio.sh

# Or direct fast start (skips checks):
./Direct_start_server.sh
```

**Windows:**
```bat
scripts\windows\start_studio.bat
```

Or via npm:
```bash
npm run studio
```
Open [http://localhost:4000](http://localhost:4000) to view:
* Video catalog with status badges (`✅ LIVE`, `📅 SCHED`, `⏳ READY`).
* Instant YouTube Data API v3 upload & scheduling (with quick slots: `1 AM`, `2 AM`, `7 AM`, `2 PM`, `9 PM`).
* Live channel statistics and verified subscriber sync.

---

## 🎬 How a New Video Is Produced

1. **Voiceover Synthesis & Silence Compression**:
   Run the master audio engine to generate natural speech with zero dead-air pauses:
   ```bash
   python scripts/voiceover_engine.py --text "Your script here..." --topic "my_topic"
   ```
2. **Component Assembly (`src/clips/<topic>/`)**:
   * `Background.tsx`: Ambient mesh gradient blobs and subtle studio texture.
   * `Presenter.tsx`: Host avatar with dynamic pose transitions.
   * `Canvas.tsx`: High-impact single-concept B-Roll scenes.
   * `index.tsx`: Main composition wiring audio tracks, BGM, SFX, progress bar, and kinetic captions.
3. **Register Composition in `src/Root.tsx`**.
4. **Render Master MP4**:
   ```bash
   npx remotion render MyTopicVideo out/my_topic_video.mp4 --gl=angle
   ```
5. **Publish / Schedule**:
   Launch `node studio/server.js`, select your desired release time, and click **Schedule Video on YouTube**.

---

## 🛡️ License
Private repository — RightMotion Engine.
