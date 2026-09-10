# RightClips architectural bloat audit

## A. Actual architecture

```text
Agent topic + tagged script
  -> scripts/create_clip.py
  -> script/tag parsing, optional PDF extraction, TTS or facecam audio
  -> Faster-Whisper transcript.json + clip scaffold
  -> brittle text insertion into src/Root.tsx and src/thumbnails/index.tsx
  -> agent-authored src/clips/<name>/Canvas.tsx
  -> Remotion registry (src/index.ts -> src/Root.tsx)
  -> Remotion still/render command -> out/*.mp4 and thumbnails
  -> optional studio/ Express dashboard -> YouTube / Instagram publishing
```

Runtime-critical source is `src/index.ts`, `src/Root.tsx`, every clip imported by that registry, their shared components, and the `public/` assets they resolve. The generator and publishing studio are separate entry points; neither is required to preview a registered composition.

## B. Bloat inventory

| Issue | Location | Category | Why it is unnecessary | Action / risk |
| --- | --- | --- | --- | --- |
| Unreachable generic composition | `src/Composition.tsx` | DEAD_CODE | Its `MainComposition` was never registered, while `package.json` pointed its broken build command at it. | Deleted source and removed the misleading script. Low risk. |
| Duplicate legacy composition branch | `src/compositions/*`, `AppleBackground`, `CharacterAvatar`, `Comparison*`, `MotionGraphicsCanvas` | DUPLICATION / REMOTION_BLOAT | These were earlier hard-coded habit/comparison implementations. Live clips have their own modules and do not import this branch. | Deleted. Low risk; all live Root imports remain. |
| Single-use abandoned visual experiments | `AppleMotionCards`, editorial cards/graphs/meters, `camera3d/ParallaxLayer` | DEAD_CODE | No runtime or generator import reaches them. | Deleted. Low risk. |
| Orphan clips | `gita_in_teenage`, `reality_of_social_media` and their assets | DEAD_CODE | Neither was imported or registered in `Root.tsx`; therefore neither could be rendered by Remotion. | Deleted. Low risk. |
| Unused Node packages | `@remotion/media-parser`, `clsx`, `lucide`, `tailwind-merge` | DEPENDENCY_BLOAT | No code imports them. The studio uses a committed browser vendor file, while React code uses `lucide-react`. | Removed and lockfile regenerated. Low risk. |
| Manual registry with repeated imports, duration variables, composition JSX, and thumbnail JSX | `src/Root.tsx`, generator registration function | STRUCTURAL_BLOAT / AGENT_WORKFLOW_BLOAT | Adding one clip edits at least two source files by fragile string manipulation. It is difficult for agents to audit and easy to corrupt. | P2: replace with a typed clip manifest. Do not change until a migration validates every existing composition. |
| Two overlapping audio pipelines | `scripts/create_clip.py`, `scripts/voiceover_engine.py`, old per-clip generators | PIPELINE_BLOAT | The generator has its own synthesis/transcription path while the documented voiceover engine implements similar work. Several one-off audio scripts remain. | P1: make `voiceover_engine.py` the sole audio/transcript API, then remove one-off scripts after migration. |
| Generator contains several obsolete scaffold templates | `scripts/create_clip.py` | ABSTRACTION_BLOAT / REMOTION_BLOAT | The current glossy scaffold coexists with earlier Apple/collage template strings. Only one scaffold should be maintained. | P1: delete unreachable template branches after fixture-scaffolding tests are added. |
| Configuration conflicts with product direction | `README.md`, `AGENTS.md`, `create_clip.py`, legacy components | CONFIG_BLOAT | Documentation describes an Apple-light/Jenny flow while the authoritative agent rules require niche-specific glossy output/Ava default. | P1: rewrite README around the active CLI and mark `AGENTS.md` as the visual authority. |
| Publishing server repeats YouTube upload logic | `studio/server.js` | DUPLICATION | Single-channel upload and multi-publish independently build metadata, upload, thumbnail, and comment flows. | P2: extract one internal publish operation without changing routes. |

## C. Complexity hotspots

1. **Root registry**: one file is both a hand-maintained catalogue and a generated database, with 40+ imports and repeated wiring.
2. **Clip contract drift**: most clips use `Background`/`Canvas`/`Presenter`/`index`, but facecam and long-form clips have special layouts with no declared contract.
3. **Scaffolder size**: `create_clip.py` owns script parsing, metadata, audio, transcription, matching, code generation, registry mutation, and rendering.
4. **Audio ownership**: two general audio paths plus historical per-video scripts create unclear source-of-truth behavior.
5. **Thumbnail registry**: generated exports and Root registrations must stay synchronized with the clip registry.
6. **Studio publishing**: upload and multi-publish flows duplicate the same external side effects.
7. **Instruction drift**: README and agent rules prescribe incompatible aesthetics and commands.

## D. Simplification plan

### P0 — completed

- Delete the verified unreachable Remotion branch and two unregistered clips.
- Remove four unused dependencies and the stale `build` command.

### P1 — high-value, low-risk next work

- Define a small `ClipDefinition` manifest containing composition id, component, transcript, dimensions, and optional thumbnail; have Root render it.
- Keep only one audio/transcription implementation and delete the one-off audio scripts once its CLI contract is covered by a smoke test.
- Make README's new-clip instructions exactly match `create_clip.py` and AGENTS.md.

### P2 — careful restructuring

- Split `create_clip.py` into direct modules for input parsing, audio generation, scaffolding, and registry mutation; retain one CLI entry point.
- Extract one studio publishing service used by both upload routes.

### P3 — only if demonstrated useful

- Formalize a narrow clip-layout contract. Do not force long-form/facecam clips into it if their layouts genuinely differ.

## Validation completed for P0

- `npm run typecheck` passed before and after cleanup.
- Static searches confirmed no remaining references to deleted symbols or orphan clip names.
- `TrainYourBrainVideo` rendered successfully at frame 80 to `out/architecture_audit_train_your_brain.png`.
