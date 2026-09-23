# 🛡️ RightMotion Context-Leak Audit & Knowledge Grounding Report

**Date**: September 19, 2026  
**Status**: COMPLETE & VERIFIED  
**Objective**: Prevent creative quality degradation across fresh AI coding-agent conversations by transferring implicit conversational taste and visual principles into permanent, repository-level operating systems.

---

## 1. Executive Summary & Root Cause Investigation

Prior to this intervention, RightMotion exhibited a classic **context-dependence vulnerability**:
- When run within an ongoing conversation with extensive prompt priming, the AI generated minimalist, physical-mechanism-driven motion graphics with exceptional restraint.
- When invoked in a **fresh AI coding session**, the agent frequently regressed to generic cards, multi-target visual clutter, and template-like layouts.

### Findings on the 5 Investigation Questions:

#### A. What was in conversational memory that was absent from repo files?
The conversational context contained the *pedagogical rationale* behind RightMotion:
1. **The Visual Solution Decision Tree**: When faced with a concept, what should the agent think of first? (Open physical metaphor → concrete physical object → spatial typography → motivated card).
2. **Card Escape Logic**: Why cards are tempting (web SaaS priors) and how to escape them into open-stage mechanics.
3. **Flagship Exemplars**: Detailed knowledge of which existing clips (`distraction_noise`, `cortisol_awakening_routine`, `emotional_distance`, etc.) represent the gold standard, why they work, and what mistakes to avoid.
4. **The "Remove One Thing" Pass**: The habit of stripping secondary decorations before rendering.

In the repository files, rules were primarily stated as prohibitions (e.g. "anti-cardification", "no memes") without providing positive generative alternatives or concrete reference case studies.

#### B. Why did fresh agents default to cards?
Modern LLMs are predominantly trained on web SaaS UI code (Tailwind dashboards, React card components, pricing tables, hero sections). When prompted to display information, their strongest prior is:
`Container (card) -> Title -> Subtitle -> Body -> Badge`.
Without an explicit, authoritative Decision Tree redirecting them to open-canvas physics, agents naturally fall back to card containers.

#### C. Did existing docs instruct the agent clearly?
`AGENTS.md` was comprehensive (600+ lines) but had three structural gaps:
1. **No clear precedence hierarchy**: Agents could treat component suggestions in briefs as a mandatory shopping list rather than optional tools.
2. **Binary framing**: "Zero cardification" caused confusion when a card was legitimately needed (e.g. hero illustration, product worksheet proof), leading agents to either violate the rule or over-complicate simple visuals.
3. **Lack of pedagogical deconstruction**: The docs explained *what not to do*, but did not deconstruct *why* flagship clips succeed.

#### D. What is the single source of truth?
Previously ambiguous between `AGENTS.md`, `creative_brief.json`, and `Canvas.tsx` comments.
**Now established**: The **Creative Hierarchy of Authority**:
1. `RIGHTMOTION_CREATIVE_CONSTITUTION.md` (Supreme Creative Law)
2. `creative_brief.json` (Authoritative Shot Plan & Pedagogical References)
3. Shot Directives (Scene-by-Scene Objectives)
4. Component Index (Candidate Tools / Optional Choices)
5. Agent Implementation (`Canvas.tsx` Execution)

#### E. How does the agent discover relevant precedents?
Previously: impossible without manually browsing 50+ clip folders.
**Now established**: The `ReferenceDiscovery` engine (`scripts/reference_discovery.py`) automatically indexes `src/creative_brief/reference_library.json` and injects top matching reference studies directly into `creative_brief.json` and `Canvas.tsx`.

---

## 2. Knowledge Encoding Matrix: Implicit vs. Explicit

| Knowledge Domain | Previous State (Implicit Context) | Current State (Repository Operating System) |
|:---|:---|:---|
| **Creative Philosophy** | Enforced via chat user correction | Encoded in root `RIGHTMOTION_CREATIVE_CONSTITUTION.md` with Permanent Standard Banner |
| **Hierarchy of Authority** | Implied in user instructions | Formally codified in `AGENTS.md` & Constitution (Constitution > Brief > Directives > Components > Code) |
| **Card Escape Logic** | Urged via feedback ("don't use cards") | Codified in **Visual Solution Decision Tree** & Law of No Unmotivated Cardification |
| **Pedagogical References** | Discussed ad-hoc in prompt history | Structured database in `src/creative_brief/reference_library.json` + `scripts/reference_discovery.py` |
| **Shot Intent & Pacing** | Spread across prompt suggestions | Authored in `src/clips/<name>/creative_brief.json` with frame anchors & pacing modes |
| **Scaffolding Grounding** | Generic stubs | Bespoke mission header in `Canvas.tsx` linking Constitution, Brief, and Flagship Reference Study |
| **Quality Audit** | Manual chat evaluation | Qualitative Editorial Critic (`scripts/visual_critic.py`) auditing focal hierarchy, card motivation, motion purpose, state progression |
| **Mechanism Detection** | Hardcoded component names only | Broadened to recognize bespoke SVG vector paths, radial orbits, stroke tracing, and physical cutouts |

---

## 3. Architecture of Permanent Systems Deployed

### 1. `RIGHTMOTION_CREATIVE_CONSTITUTION.md`
- **Location**: Repository root
- **Purpose**: Supreme creative standard for all RightMotion productions.
- **Key Sections**:
  - The Creative Mantra: "RightMotion does not try to look creative. RightMotion tries to make the idea clear."
  - 7 Core Principles: Single Focal Point, Motion Has Semantic Meaning, Negative Space, Live Transformation, No Unmotivated Cardification, Audio-Visual Synchronization, The "Remove One Thing" Pass.
  - Good vs. Bad Catalog across 6 domains.
  - "When You See X, Think Y" instinctive translation guide.
  - Visual Solution Decision Tree.

### 2. Pedagogical Reference Library & Discovery Engine
- **Files**: `src/creative_brief/reference_library.json` and `scripts/reference_discovery.py`
- **Contents**: Deconstructions of flagship clips (`distraction_noise`, `cortisol_awakening_routine`, `emotional_distance`, `habits`, `boundaries`, `the_cost_of_compromise`).
- **Deconstruction Schema**: Category, Why It Is Strong, Primary Visual Idea, Visual Mechanism, Composition Strategy, Camera Strategy, Temporal Strategy, Why It Remains Clear, What to Learn, What NOT to Copy.
- **CLI Discovery**: `python3 scripts/reference_discovery.py --concept "<topic>"`

### 3. Scaffolding Mission Injection
- **Files**: `scripts/creative_brief_compiler.py` and `scripts/create_clip.py`
- **Mechanism**: Every generated clip injects a rich `RIGHTMOTION CREATIVE MISSION` header at the top of `Canvas.tsx`, embedding:
  - Link to `RIGHTMOTION_CREATIVE_CONSTITUTION.md`
  - Link to `creative_brief.json`
  - Assigned Flagship Reference Study with specific learning points
  - The 7 Creative Gate questions

### 4. Qualitative Visual Critic Engine
- **File**: `scripts/visual_critic.py`
- **Enhancements**:
  - Removed numeric compliance scores in favor of actionable qualitative findings:
    - `✅ clear focal hierarchy` vs `⚠ competing visual targets`
    - `✅ no unmotivated cardification` vs `⚠ generic card fallback`
    - `✅ meaningful motion` vs `⚠ decorative motion`
    - `✅ meaningful state progression` vs `⚠ lacking state progression`
  - Expanded mechanism detection to recognize bespoke SVG geometry (`path`, `bezier`, `circle`, `strokeDashoffset`) and semantic cutout anchors.

---

## 4. Fresh-Session Benchmark Protocol

To prove total context independence, three benchmark clips across distinct visual categories are produced without conversational prompts:
1. **Psychological Metaphor**: `rumination_loop` (Closed feedback loop spinning under anxiety).
2. **Physical/Causal Progression**: `habit_groove` (Action carving a low-friction channel over time).
3. **Emotional/Spatial Restraint**: `social_exhaustion` (Depleting sovereign space in crowded environments).

Each benchmark is validated against the 4 Qualitative Findings and rendered to final MP4.
