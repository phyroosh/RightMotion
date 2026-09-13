import React from "react";
import { Easing, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { WordTimestamp } from "../../types";
import { AnimatedSlashStrike, KineticHighlighter } from "../../components/kinetic_text";
import { CinematicIllustrationCard } from "../../components/CinematicIllustrationCard";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  FileText,
  Lock,
  Target,
  X,
  Zap,
} from "lucide-react";
import { SafeContent } from "../../components/safe_area";
import {
  CausalWorld,
  CausalNode,
  ThresholdReactor,
  StateInspector,
  useNodeState,
  useCausalConsequence,
  CausalGraphDefinition,
  RootTrigger,
} from "../../causal";
import { ViscoelasticDeformation } from "../../components/physics/materiality";

interface CanvasProps {
  transcript: WordTimestamp[];
}

/**
 * 🎬 Frontier #7: Visual State Machine Definition for Open Brain Tabs
 * Topic: "Every Unfinished Task Leaves a Tab Open in Your Brain"
 * 
 * System Architecture:
 * - Central Node: `brain_core` (Condition: NOMINAL -> ACCUMULATING -> CRITICAL_STRAIN -> COGNITIVE_LEAKAGE -> OFFLOAD_ANCHORED -> RESTORED)
 * - Satellite Nodes: `task_tab_1`, `task_tab_2`, `task_tab_3`
 * - Threshold: cognitiveLoad >= 70% fires CRITICAL_LOAD_THRESHOLD
 * - Narrative Memory: Records systemicStrainRecorded, externalAnchorSecured, and loopClosed across scenes!
 */
const BRAIN_TABS_CAUSAL_GRAPH: CausalGraphDefinition = {
  nodes: [
    {
      id: "brain_core",
      initialCondition: "NOMINAL",
      initialValues: { cognitiveLoad: 24, attentionRemaining: 100, openLoops: 0, anxietyLevel: 10 },
      transitions: [
        {
          fromCondition: "*",
          triggerEventType: "TAB_SPAWNED",
          toCondition: "ACCUMULATING",
          mutations: [
            { property: "cognitiveLoad", operation: "add", value: 23, max: 100 },
            { property: "attentionRemaining", operation: "add", value: -25, min: 8 },
            { property: "openLoops", operation: "add", value: 1 },
          ],
        },
        {
          fromCondition: "*",
          triggerEventType: "CRITICAL_LOAD_THRESHOLD",
          toCondition: "CRITICAL_STRAIN",
          mutations: [
            { property: "anxietyLevel", operation: "set", value: 85 },
          ],
          memoryUpdates: { systemicStrainRecorded: true, peakLoadPercent: 93 },
        },
        {
          fromCondition: "*",
          triggerEventType: "SUB_CONSCIOUS_DRAIN",
          toCondition: "COGNITIVE_LEAKAGE",
          mutations: [
            { property: "cognitiveLoad", operation: "set", value: 94 },
            { property: "attentionRemaining", operation: "set", value: 12 },
            { property: "anxietyLevel", operation: "set", value: 95 },
          ],
          memoryUpdates: { zeigarnikLeakageActive: true },
        },
        {
          fromCondition: "*",
          triggerEventType: "EXTERNAL_ANCHOR_ESTABLISHED",
          toCondition: "OFFLOAD_ANCHORED",
          mutations: [
            { property: "anxietyLevel", operation: "set", value: 20 },
            { property: "cognitiveLoad", operation: "set", value: 45 },
          ],
          memoryUpdates: { externalAnchorSecured: true, protocolExecuted: "2_STEP_CLOSURE" },
        },
        {
          fromCondition: "*",
          triggerEventType: "TAB_CLOSED_SUCCESS",
          toCondition: "RESTORED",
          mutations: [
            { property: "cognitiveLoad", operation: "set", value: 15 },
            { property: "attentionRemaining", operation: "set", value: 100 },
            { property: "openLoops", operation: "set", value: 0 },
            { property: "anxietyLevel", operation: "set", value: 5 },
          ],
          memoryUpdates: { loopClosed: true, finalState: "100%_RAM_RESTORED" },
        },
      ],
    },
    {
      id: "task_tab_1",
      initialCondition: "PENDING",
      transitions: [
        {
          fromCondition: "PENDING",
          triggerEventType: "SPAWN_TAB_1",
          toCondition: "ACTIVE_OPEN",
          emitSecondaryEvents: [
            { targetNodeId: "brain_core", eventType: "TAB_SPAWNED", delayFrames: 2 },
          ],
        },
        {
          fromCondition: "*",
          triggerEventType: "TAB_CLOSED_SUCCESS",
          toCondition: "ARCHIVED",
        },
      ],
    },
    {
      id: "task_tab_2",
      initialCondition: "PENDING",
      transitions: [
        {
          fromCondition: "PENDING",
          triggerEventType: "SPAWN_TAB_2",
          toCondition: "ACTIVE_OPEN",
          emitSecondaryEvents: [
            { targetNodeId: "brain_core", eventType: "TAB_SPAWNED", delayFrames: 2 },
          ],
        },
        {
          fromCondition: "*",
          triggerEventType: "TAB_CLOSED_SUCCESS",
          toCondition: "ARCHIVED",
        },
      ],
    },
    {
      id: "task_tab_3",
      initialCondition: "PENDING",
      transitions: [
        {
          fromCondition: "PENDING",
          triggerEventType: "SPAWN_TAB_3",
          toCondition: "ACTIVE_OPEN",
          emitSecondaryEvents: [
            { targetNodeId: "brain_core", eventType: "TAB_SPAWNED", delayFrames: 2 },
          ],
        },
        {
          fromCondition: "*",
          triggerEventType: "TAB_CLOSED_SUCCESS",
          toCondition: "ARCHIVED",
        },
      ],
    },
  ],
  thresholds: [
    {
      id: "th_load_strain",
      sourceNodeId: "brain_core",
      property: "cognitiveLoad",
      operator: ">=",
      thresholdValue: 70,
      emitEvent: {
        targetNodeId: "brain_core",
        eventType: "CRITICAL_LOAD_THRESHOLD",
      },
    },
  ],
};

/**
 * Speech-Synchronized Root Triggers (derived from transcript.json word timestamps)
 */
const buildRootTriggers = (fps: number): RootTrigger[] => {
  const f = (ms: number) => Math.round((ms / 1000) * fps);
  return [
    { frame: f(2760), targetNodeId: "task_tab_1", eventType: "SPAWN_TAB_1" },
    { frame: f(3500), targetNodeId: "task_tab_2", eventType: "SPAWN_TAB_2" },
    { frame: f(4200), targetNodeId: "task_tab_3", eventType: "SPAWN_TAB_3" },
    { frame: f(10900), targetNodeId: "brain_core", eventType: "SUB_CONSCIOUS_DRAIN" },
    { frame: f(28400), targetNodeId: "brain_core", eventType: "EXTERNAL_ANCHOR_ESTABLISHED" },
    { frame: f(31480), targetNodeId: "brain_core", eventType: "TAB_CLOSED_SUCCESS" },
  ];
};

/**
 * Inner Living Canvas consuming the causal state machine.
 */
const OpenBrainTabsCausalCanvasInner: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = (ms: number) => Math.round((ms / 1000) * fps);

  // Read causal state and derived consequence from the living state machine
  const brainState = useNodeState("brain_core");
  const brainConsequence = useCausalConsequence("brain_core", "cognitiveLoad");

  const tab1State = useNodeState("task_tab_1");
  const tab2State = useNodeState("task_tab_2");
  const tab3State = useNodeState("task_tab_3");

  // Scene triggers based on speech
  const isScene1 = frame >= 0 && frame < f(6000);
  const isHookIntro = frame < f(2500);

  const isScene2 = frame >= f(6000) && frame < f(19600);
  const isScene3 = frame >= f(19600) && frame < f(23600);
  const isScene4 = frame >= f(23600);

  // Smooth visual progress derived directly from causal value
  const loadPercentage = Math.round(brainState.values.cognitiveLoad ?? 24);
  const isCriticalStrain = brainConsequence.isCritical || loadPercentage >= 70;

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none font-sans">
      {/* Developer HUD: Real-time Causal State Inspection */}
      <StateInspector
        enabled={false} // Toggle to true during dev inspection
        monitoredNodeIds={["brain_core", "task_tab_1", "task_tab_2", "task_tab_3"]}
      />

      {/* ======================================================== */}
      {/* SCENE 1: HOOK & THE ARCHITECTURE (0ms → 6000ms)          */}
      {/* "You leave 5 browser tabs open... exact same architecture"*/}
      {/* ======================================================== */}
      {isScene1 && (
        <div className="absolute inset-0 flex flex-col items-center justify-start px-8" style={{ paddingTop: 280 }}>
          {isHookIntro ? (
            <SafeContent importance="critical" className="w-full max-w-[880px] flex flex-col items-center">
              <div
                className="w-full flex flex-col items-center"
                style={{
                  transform: `scale(${interpolate(frame, [0, f(2500)], [1.0, 1.04], {
                    extrapolateRight: "clamp",
                  })})`,
                }}
              >
                <CinematicIllustrationCard
                  imageSrc={staticFile("open_brain_tabs/assets/scene_illustration.png")}
                  width={880}
                  height={516}
                />
              </div>
            </SafeContent>
          ) : (
            <SafeContent importance="important" className="w-full max-w-[880px] flex flex-col items-center gap-5">
              {/* Architecture Header Badge */}
              <div
                className="px-6 py-2 rounded-2xl bg-white border-[2.5px] border-slate-900 shadow-md flex items-center gap-3"
                style={{
                  opacity: interpolate(frame, [f(2500), f(2700)], [0, 1], {
                    extrapolateLeft: "clamp",
                  }),
                  transform: `translateY(${interpolate(frame, [f(2500), f(2700)], [20, 0], {
                    extrapolateLeft: "clamp",
                    easing: Easing.out(Easing.cubic),
                  })}px)`,
                }}
              >
                <Activity className={`w-6 h-6 ${isCriticalStrain ? "text-rose-600 animate-pulse" : "text-slate-900"}`} />
                <span className="font-mono text-[22px] font-black text-slate-900 tracking-wider uppercase">
                  SYSTEM MONITOR // BIOLOGICAL RAM [{brainState.condition}]
                </span>
              </div>

              {/* Cognitive Load Meter — Live Causal Value */}
              <ThresholdReactor
                nodeId="brain_core"
                property="cognitiveLoad"
                threshold={70}
                criticalClassName="border-rose-600 shadow-[0_24px_48px_-12px_rgba(244,63,94,0.3)]"
                normalClassName="border-slate-900"
              >
                <div className="w-full p-6 rounded-3xl bg-white border-[2.5px] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.16)] flex flex-col gap-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[36px] font-black text-[#090d16] uppercase tracking-tight">
                      COGNITIVE LOAD
                    </span>
                    <span className={`font-mono text-[52px] font-black ${isCriticalStrain ? "text-rose-600" : "text-indigo-600"}`}>
                      {loadPercentage}%
                    </span>
                  </div>

                  {/* Dynamic Meter Bar reacting to causal value */}
                  <div className="w-full h-7 rounded-full bg-slate-100 border-2 border-slate-900 overflow-hidden p-1">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isCriticalStrain
                          ? "bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600"
                          : "bg-gradient-to-r from-sky-400 to-indigo-600"
                      }`}
                      style={{ width: `${loadPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between font-mono text-[20px] font-bold text-slate-500 uppercase">
                    <span>BASELINE (24%)</span>
                    <span className={isCriticalStrain ? "text-rose-600 font-black" : "text-slate-500"}>
                      {isCriticalStrain ? "THRESHOLD EXCEEDED // STRAIN" : "NOMINAL CAPACITY"}
                    </span>
                  </div>
                </div>
              </ThresholdReactor>

              {/* 3 Live Open Tab Chips — Driven by Causal Nodes */}
              <div className="w-full flex flex-col gap-3">
                {[
                  { id: "task_tab_1", label: "UNANSWERED INBOX THREAD", state: tab1State },
                  { id: "task_tab_2", label: "HALF-WRITTEN REPORT", state: tab2State },
                  { id: "task_tab_3", label: "UNRESOLVED DECISION", state: tab3State },
                ].map((item) => {
                  if (item.state.condition === "PENDING") return null;
                  const relTrans = item.state.framesSinceTransition;
                  const tabSpring = spring({
                    frame: relTrans,
                    fps,
                    config: { damping: 12, stiffness: 150, mass: 0.5 },
                  });
                  return (
                    <CausalNode key={item.id} id={item.id} className="w-full">
                      <div
                        className="w-full px-6 py-4 rounded-2xl bg-white border-[2.5px] border-slate-900 shadow-md flex items-center justify-between"
                        style={{
                          transform: `scale(${tabSpring}) translateY(${(1 - tabSpring) * 15}px)`,
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-4 h-4 rounded-full bg-rose-500 animate-pulse" />
                          <span className="text-[28px] font-black text-[#090d16] tracking-tight">
                            {item.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[20px] font-bold text-rose-600 uppercase">
                            ACTIVE RAM (+23%)
                          </span>
                          <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center">
                            <X className="w-5 h-5 text-slate-500" />
                          </div>
                        </div>
                      </div>
                    </CausalNode>
                  );
                })}
              </div>

              {/* Conclusion Slam */}
              {frame >= f(4900) && (
                <div
                  className="w-full py-5 px-7 rounded-3xl bg-[#090d16] text-white border-[2.5px] border-slate-900 shadow-2xl flex items-center justify-between mt-2"
                  style={{
                    transform: `scale(${spring({
                      frame: frame - f(4900),
                      fps,
                      config: { damping: 14, stiffness: 160 },
                    })})`,
                  }}
                >
                  <span className="text-[36px] font-black tracking-wide uppercase">
                    SAME ARCHITECTURE
                  </span>
                  <span className="font-mono text-[22px] font-bold text-amber-400 uppercase">
                    ZERO HARD DRIVE
                  </span>
                </div>
              )}
            </SafeContent>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 2: THE ZEIGARNIK EFFECT & COGNITIVE HOARDING      */}
      {/* (6000ms → 19600ms)                                       */}
      {/* "Psychologists call this the Zeigarnik effect..."        */}
      {/* ======================================================== */}
      {isScene2 && (
        <div className="absolute inset-0 flex flex-col items-center justify-start px-8" style={{ paddingTop: 280 }}>
          {/* Main Title Card */}
          <SafeContent importance="critical" className="w-full max-w-[880px] flex flex-col items-center">
            <div
              className="w-full p-6 rounded-3xl bg-white border-[2.5px] border-slate-900 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.16)] flex flex-col items-center text-center gap-1.5"
              style={{
                transform: `scale(${spring({
                  frame: frame - f(6000),
                  fps,
                  config: { damping: 13, stiffness: 130 },
                })})`,
              }}
            >
              <span className="font-mono text-[22px] font-black text-indigo-600 tracking-widest uppercase">
                1927 // COGNITIVE RECALL LAW [{brainState.condition}]
              </span>
              <h1 className="text-[58px] font-black text-[#090d16] tracking-tight uppercase leading-none">
                THE ZEIGARNIK EFFECT
              </h1>
            </div>
          </SafeContent>

          {/* Subconscious Brain Staging & Viscoelastic Deformation */}
          <SafeContent importance="critical" className="relative w-full max-w-[880px] flex flex-col items-center justify-center my-3">
            {frame < f(16200) ? (
              <ViscoelasticDeformation
                load={brainState.condition === "COGNITIVE_LEAKAGE" ? 0.85 : 0.45}
                maxCompression={0.08}
              >
                <div
                  className="relative flex flex-col items-center justify-center"
                  style={{
                    transform: `scale(${spring({
                      frame: frame - f(6100),
                      fps,
                      config: { damping: 14, stiffness: 120 },
                    })})`,
                  }}
                >
                  <div
                    className="absolute pointer-events-none rounded-full"
                    style={{
                      width: 520,
                      height: 520,
                      background:
                        brainState.condition === "COGNITIVE_LEAKAGE"
                          ? "radial-gradient(circle, rgba(244,63,94,0.30) 0%, transparent 70%)"
                          : "radial-gradient(circle, rgba(99,102,241,0.20) 0%, transparent 70%)",
                    }}
                  />
                  <img
                    src={staticFile("assets/psychology/hyperrealistic_3d_glowing_brain.png")}
                    alt="3D Neural Brain"
                    className="w-[500px] h-auto object-contain drop-shadow-[0_32px_50px_rgba(0,0,0,0.22)]"
                  />

                  {/* Alert on subconscious drain state */}
                  {brainState.condition === "COGNITIVE_LEAKAGE" && (
                    <div
                      className="absolute top-[48%] -translate-y-1/2 px-8 py-4 rounded-3xl bg-rose-600 text-white border-[3px] border-slate-950 shadow-2xl flex items-center gap-4"
                      style={{
                        transform: `scale(${spring({
                          frame: brainState.framesSinceTransition,
                          fps,
                          config: { damping: 10, stiffness: 180, mass: 0.5 },
                        })}) rotate(-2deg)`,
                      }}
                    >
                      <AlertCircle className="w-9 h-9 text-amber-300" />
                      <div className="flex flex-col text-left">
                        <span className="font-mono text-[18px] font-black text-rose-200 uppercase tracking-widest">
                          STATE // LEAKAGE
                        </span>
                        <span className="text-[38px] font-black tracking-tight uppercase leading-none">
                          URGENT PRIORITY
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </ViscoelasticDeformation>
            ) : (
              /* Cutout 2: Depleted Brain Battery */
              <div
                className="relative flex flex-col items-center justify-center"
                style={{
                  transform: `scale(${spring({
                    frame: frame - f(16200),
                    fps,
                    config: { damping: 14, stiffness: 120 },
                  })})`,
                }}
              >
                <div
                  className="absolute pointer-events-none rounded-full"
                  style={{
                    width: 500,
                    height: 500,
                    background: "radial-gradient(circle, rgba(239,68,68,0.25) 0%, transparent 70%)",
                  }}
                />
                <img
                  src={staticFile("assets/burnout/brain_battery_depleted.png")}
                  alt="Depleted Brain Battery"
                  className="w-[480px] h-auto object-contain drop-shadow-[0_32px_50px_rgba(0,0,0,0.22)]"
                />
              </div>
            )}
          </SafeContent>

          {/* Lower Informational Banner */}
          {frame >= f(13780) && (
            <SafeContent importance="important" className="w-full max-w-[880px] p-6 rounded-3xl bg-white border-[2.5px] border-slate-900 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.14)] flex items-center justify-between"
              style={{
                transform: `translateY(${interpolate(frame, [f(13780), f(14200)], [20, 0], {
                  extrapolateLeft: "clamp",
                  easing: Easing.out(Easing.cubic),
                })}px)`,
                opacity: interpolate(frame, [f(13780), f(14100)], [0, 1], {
                  extrapolateLeft: "clamp",
                }),
              }}
            >
              <div className="flex flex-col">
                <span className="font-mono text-[20px] font-bold text-slate-500 uppercase">
                  {frame < f(16200) ? "BACKGROUND CAUSAL DRAIN" : "NEUROLOGICAL IMPAIRMENT"}
                </span>
                <span className="text-[34px] font-black text-[#090d16] uppercase">
                  {frame < f(16200) ? "HOARDS ACTIVE RAM (94%)" : "ELEVATES LOW-GRADE ANXIETY"}
                </span>
              </div>
              <div className="px-5 py-2.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-2">
                <span className="font-mono text-[24px] font-black text-rose-600">
                  {frame < f(16200) ? "-88% BANDWIDTH" : "+95% ANXIETY"}
                </span>
              </div>
            </SafeContent>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 3: DRAMATIC BREATH-HOLD & EPIPHANY (19600ms → 23600ms) */}
      {/* ======================================================== */}
      {isScene3 && (
        <div className="absolute inset-0 flex flex-col items-center justify-start px-8" style={{ paddingTop: 280 }}>
          {frame < f(22200) ? (
            <SafeContent importance="critical" className="w-full max-w-[880px] flex flex-col items-center gap-6">
              <div className="px-6 py-2 rounded-2xl bg-white border-[2.5px] border-slate-900 shadow-md">
                <span className="font-mono text-[22px] font-black text-slate-600 tracking-wider uppercase">
                  THE COMMON FAILURE MODE
                </span>
              </div>

              <div className="w-full p-8 rounded-3xl bg-white border-[2.5px] border-slate-900 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.16)] flex flex-col items-center justify-center text-center gap-4">
                <span className="font-mono text-[22px] font-bold text-slate-400 uppercase">
                  POPULAR MISCONCEPTION
                </span>

                <div className="relative py-2 px-4">
                  <AnimatedSlashStrike
                    startFrame={f(20800)}
                    durationFrames={14}
                    preset="blade_slash"
                    color="rose"
                    strokeWidth={8}
                  >
                    <h2 className="text-[64px] font-black text-[#090d16] uppercase tracking-tight leading-none">
                      MENTAL ENDURANCE
                    </h2>
                  </AnimatedSlashStrike>
                </div>

                {frame >= f(21200) && (
                  <div
                    className="px-6 py-2.5 rounded-2xl bg-rose-100 border-[2px] border-rose-600 text-rose-800 font-mono text-[22px] font-black uppercase"
                    style={{
                      transform: `scale(${spring({
                        frame: frame - f(21200),
                        fps,
                        config: { damping: 12, stiffness: 160 },
                      })})`,
                    }}
                  >
                    BIOLOGICALLY IMPOSSIBLE
                  </div>
                )}
              </div>

              <div
                className="relative flex flex-col items-center justify-center mt-1"
                style={{
                  transform: `scale(${spring({
                    frame: frame - f(20800),
                    fps,
                    config: { damping: 14, stiffness: 130 },
                  })})`,
                }}
              >
                <img
                  src={staticFile("assets/burnout/battery_low_red.png")}
                  alt="Low Battery Red"
                  className="w-[400px] h-auto object-contain drop-shadow-[0_28px_45px_rgba(0,0,0,0.20)]"
                />
              </div>

              {frame >= f(21400) && (
                <div className="text-center font-sans text-[32px] font-black text-slate-700">
                  You cannot overpower open neural loops with willpower.
                </div>
              )}
            </SafeContent>
          ) : (
            <SafeContent importance="critical" className="w-full max-w-[880px] flex flex-col items-center gap-6"
              style={{
                transform: `scale(${spring({
                  frame: frame - f(22200),
                  fps,
                  config: { damping: 13, stiffness: 130 },
                })})`,
              }}
            >
              <div className="px-6 py-2.5 rounded-2xl bg-emerald-100 border-[2.5px] border-emerald-800 shadow-md flex items-center gap-3">
                <Zap className="w-7 h-7 text-emerald-700" />
                <span className="font-mono text-[22px] font-black text-emerald-900 tracking-wider uppercase">
                  THE CAUSAL COUNTERMEASURE
                </span>
              </div>

              <div className="w-full p-8 rounded-3xl bg-white border-[2.5px] border-slate-900 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.16)] flex flex-col items-center text-center gap-3">
                <span className="font-mono text-[22px] font-bold text-slate-500 uppercase">
                  SYSTEM OVERRIDE
                </span>

                <div className="py-2">
                  <KineticHighlighter
                    startFrame={f(22380)}
                    durationFrames={22}
                    color="lime"
                    heightPercentage="55%"
                  >
                    <h2 className="text-[60px] font-black text-[#090d16] uppercase tracking-tight">
                      EXTERNAL OFFLOADING
                    </h2>
                  </KineticHighlighter>
                </div>

                <p className="text-[30px] font-bold text-slate-600 mt-1">
                  Transfer the loop from working RAM into physical space.
                </p>
              </div>

              <div className="relative flex flex-col items-center justify-center mt-2">
                <img
                  src={staticFile("assets/psychology/dopamine_head_circuit.png")}
                  alt="Dopamine Circuit Head"
                  className="w-[420px] h-auto object-contain drop-shadow-[0_28px_45px_rgba(0,0,0,0.18)]"
                />
              </div>
            </SafeContent>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* SCENE 4: EXTERNAL ANCHOR PROTOCOL & TAB SHUTDOWN        */}
      {/* ======================================================== */}
      {isScene4 && (
        <div className="absolute inset-0 flex flex-col items-center justify-start px-8" style={{ paddingTop: 280 }}>
          {frame < f(28400) ? (
            <SafeContent importance="critical" className="w-full max-w-[880px] flex flex-col items-center gap-5">
              <div className="px-6 py-2 rounded-2xl bg-white border-[2.5px] border-slate-900 shadow-md">
                <span className="font-mono text-[22px] font-black text-slate-900 tracking-wider uppercase">
                  THE 2-STEP CLOSURE PROTOCOL
                </span>
              </div>

              {frame >= f(24000) && (
                <div
                  className="w-full p-6 rounded-3xl bg-white border-[2.5px] border-slate-900 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.14)] flex items-center justify-between"
                  style={{
                    transform: `scale(${spring({
                      frame: frame - f(24000),
                      fps,
                      config: { damping: 13, stiffness: 140 },
                    })})`,
                  }}
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 border-2 border-indigo-600 flex items-center justify-center">
                      <FileText className="w-8 h-8 text-indigo-700" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-mono text-[18px] font-bold text-indigo-600 uppercase">
                        STEP 01 // CAPTURE
                      </span>
                      <span className="text-[34px] font-black text-[#090d16] uppercase">
                        WRITE DOWN THE LOOP
                      </span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-mono text-[22px] font-black">
                    ✓
                  </div>
                </div>
              )}

              {frame >= f(26500) && (
                <div
                  className="w-full p-6 rounded-3xl bg-white border-[2.5px] border-slate-900 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.14)] flex items-center justify-between"
                  style={{
                    transform: `scale(${spring({
                      frame: frame - f(26500),
                      fps,
                      config: { damping: 13, stiffness: 140 },
                    })})`,
                  }}
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 border-2 border-emerald-600 flex items-center justify-center">
                      <Target className="w-8 h-8 text-emerald-700" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-mono text-[18px] font-bold text-emerald-600 uppercase">
                        STEP 02 // ACTION POINT
                      </span>
                      <span className="text-[34px] font-black text-[#090d16] uppercase">
                        EXACT NEXT MICRO-STEP
                      </span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-mono text-[22px] font-black">
                    ✓
                  </div>
                </div>
              )}

              <div className="relative flex flex-col items-center justify-center my-2">
                <img
                  src={staticFile("assets/habits/target_focus_crosshair.png")}
                  alt="Target Focus Crosshair"
                  className="w-[380px] h-auto object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.16)]"
                />
              </div>

              {frame >= f(27200) && (
                <div
                  className="w-full py-4 px-6 rounded-2xl bg-slate-100 border-[2px] border-slate-300 text-center font-mono text-[22px] font-bold text-slate-700 uppercase"
                  style={{
                    opacity: interpolate(frame, [f(27200), f(27600)], [0, 1], {
                      extrapolateLeft: "clamp",
                    }),
                  }}
                >
                  Not "work on project" → "Open file & write 1st bullet"
                </div>
              )}
            </SafeContent>
          ) : (
            <SafeContent importance="critical" className="w-full max-w-[880px] flex flex-col items-center gap-5">
              {/* Cognitive Contract Card */}
              <div
                className="w-full p-6 rounded-3xl bg-white border-[2.5px] border-slate-900 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.16)] flex items-center justify-between"
                style={{
                  transform: `scale(${spring({
                    frame: frame - f(28400),
                    fps,
                    config: { damping: 13, stiffness: 140 },
                  })})`,
                }}
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 border-2 border-emerald-600 flex items-center justify-center">
                    <Lock className="w-8 h-8 text-emerald-700" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono text-[18px] font-bold text-emerald-600 uppercase">
                      COGNITIVE CONTRACT // {brainState.condition}
                    </span>
                    <span className="text-[34px] font-black text-[#090d16] uppercase">
                      SECURELY ANCHORED
                    </span>
                  </div>
                </div>
                <span className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 font-mono text-[18px] font-black uppercase">
                  THREAT CLEARED
                </span>
              </div>

              {/* Enlightened Mind Resolution or Closing Tab */}
              <div className="relative w-full flex flex-col items-center justify-center my-2">
                {brainState.condition === "RESTORED" ? (
                  <div
                    className="relative flex flex-col items-center justify-center"
                    style={{
                      transform: `scale(${spring({
                        frame: brainState.framesSinceTransition,
                        fps,
                        config: { damping: 12, stiffness: 150 },
                      })})`,
                    }}
                  >
                    <div
                      className="absolute pointer-events-none rounded-full"
                      style={{
                        width: 500,
                        height: 500,
                        background:
                          "radial-gradient(circle, rgba(16,185,129,0.30) 0%, transparent 70%)",
                      }}
                    />
                    <img
                      src={staticFile("assets/psychology/enlightened_mind_insight.png")}
                      alt="Enlightened Mind Insight"
                      className="w-[490px] h-auto object-contain drop-shadow-[0_32px_50px_rgba(0,0,0,0.22)]"
                    />
                  </div>
                ) : (
                  <div
                    className="w-full p-8 rounded-3xl bg-white border-[2.5px] border-slate-900 shadow-xl flex items-center justify-between"
                    style={{
                      transform: `scale(${spring({
                        frame: frame - f(28600),
                        fps,
                        config: { damping: 14, stiffness: 130 },
                      })})`,
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-5 h-5 rounded-full bg-amber-500 animate-pulse" />
                      <span className="text-[32px] font-black text-[#090d16] uppercase">
                        PENDING TASK TAB
                      </span>
                    </div>
                    <span className="font-mono text-[22px] font-bold text-indigo-600">
                      CLOSING LOOP...
                    </span>
                  </div>
                )}
              </div>

              {/* Decisive Resolution Typography with Narrative Memory */}
              {brainState.condition === "RESTORED" && (
                <div
                  className="w-full p-6 rounded-3xl bg-[#090d16] text-white border-[2.5px] border-slate-900 shadow-2xl flex flex-col items-center text-center gap-1.5"
                  style={{
                    transform: `scale(${spring({
                      frame: brainState.framesSinceTransition,
                      fps,
                      config: { damping: 13, stiffness: 150 },
                    })})`,
                  }}
                >
                  <h3 className="text-[52px] font-black uppercase text-emerald-400 tracking-tight leading-tight">
                    TAB CLOSED.
                  </h3>
                  <span className="font-mono text-[22px] font-bold text-slate-300 uppercase tracking-wider">
                    WORKING RAM RESTORED TO 100%
                  </span>
                </div>
              )}
            </SafeContent>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * 🎬 OpenBrainTabsCanvas
 * Top-level canvas wrapping the scene within the Frontier #7 CausalWorld provider.
 */
export const OpenBrainTabsCanvas: React.FC<CanvasProps> = (props) => {
  const { fps, durationInFrames } = useVideoConfig();
  const rootTriggers = React.useMemo(() => buildRootTriggers(fps), [fps]);

  return (
    <CausalWorld
      graph={BRAIN_TABS_CAUSAL_GRAPH}
      rootTriggers={rootTriggers}
      totalFrames={durationInFrames}
    >
      <OpenBrainTabsCausalCanvasInner {...props} />
    </CausalWorld>
  );
};
