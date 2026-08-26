import React from "react";
import { Composition } from "remotion";
import { ADHDComposition } from "./clips/adhd";
import { ComparisonComposition } from "./clips/comparison";
import { HabitComposition } from "./clips/habits";
import { MotivationComposition } from "./clips/motivation";
import { MaturityComposition } from "./clips/maturity";
import { ProcrastinationComposition } from "./clips/procrastination";
import adhdTranscript from "./clips/adhd/transcript.json";
import comparisonTranscript from "./clips/comparison/transcript.json";
import habitTranscript from "./clips/habits/transcript.json";
import motivationTranscript from "./clips/motivation/transcript.json";
import maturityTranscript from "./clips/maturity/transcript.json";
import procrastinationTranscript from "./clips/procrastination/transcript.json";
import { GogginsComposition } from "./clips/goggins";
import { BreaksComposition } from "./clips/breaks";
import { StrengthComposition } from "./clips/strength";
import gogginsTranscript from "./clips/goggins/transcript.json";
import breaksTranscript from "./clips/breaks/transcript.json";
import strengthTranscript from "./clips/strength/transcript.json";
import { WordTimestamp } from "./types";
import "./style.css";

const calculateDurationInFrames = (transcript: WordTimestamp[], fps: number): number => {
  if (!transcript || transcript.length === 0) {
    return 150;
  }
  const lastWordEndMs = transcript[transcript.length - 1]?.endMs || 5000;
  const totalDurationMs = lastWordEndMs + 800; // 0.8s outro padding
  return Math.ceil((totalDurationMs / 1000) * fps);
};

export const RemotionRoot: React.FC = () => {
  const fps = 30;
  const strengthDuration = calculateDurationInFrames(strengthTranscript as WordTimestamp[], fps);
  const gogginsDuration = calculateDurationInFrames(gogginsTranscript as WordTimestamp[], fps);
  const breaksDuration = calculateDurationInFrames(breaksTranscript as WordTimestamp[], fps);
  const adhdDuration = calculateDurationInFrames(adhdTranscript as WordTimestamp[], fps);
  const comparisonDuration = calculateDurationInFrames(comparisonTranscript as WordTimestamp[], fps);
  const habitDuration = calculateDurationInFrames(habitTranscript as WordTimestamp[], fps);
  const motivationDuration = calculateDurationInFrames(motivationTranscript as WordTimestamp[], fps);
  const maturityDuration = calculateDurationInFrames(maturityTranscript as WordTimestamp[], fps);
  const procrastinationDuration = calculateDurationInFrames(procrastinationTranscript as WordTimestamp[], fps);

  return (
    <>
      {/* 0. Real Strength & Vulnerability Video (9:16 Shorts) */}
      <Composition
        id="StrengthVideo"
        component={StrengthComposition}
        durationInFrames={strengthDuration}
        fps={fps}
        width={1080}
        height={1920}
      />

      {/* 0b. David Goggins Cookie Jar Video (9:16 Shorts) */}
      <Composition
        id="GogginsVideo"
        component={GogginsComposition}
        durationInFrames={gogginsDuration}
        fps={fps}
        width={1080}
        height={1920}
      />

      {/* 1. Taking A Break Video (9:16 Shorts) */}
      <Composition
        id="BreaksVideo"
        component={BreaksComposition}
        durationInFrames={breaksDuration}
        fps={fps}
        width={1080}
        height={1920}
      />

      {/* 2. ADHD Attention Paradox Video (9:16 Shorts) */}
      <Composition
        id="ADHDVideo"
        component={ADHDComposition}
        durationInFrames={adhdDuration}
        fps={fps}
        width={1080}
        height={1920}
      />

      {/* 3. Motivation Myth Video (9:16 Shorts) */}
      <Composition
        id="MotivationVideo"
        component={MotivationComposition}
        durationInFrames={motivationDuration}
        fps={fps}
        width={1080}
        height={1920}
      />

      {/* 4. Maturity & Growth Video (9:16 Shorts) */}
      <Composition
        id="MaturityVideo"
        component={MaturityComposition}
        durationInFrames={maturityDuration}
        fps={fps}
        width={1080}
        height={1920}
      />

      {/* 5. Comparison Mindset Video (9:16 Shorts) */}
      <Composition
        id="ComparisonVideo"
        component={ComparisonComposition}
        durationInFrames={comparisonDuration}
        fps={fps}
        width={1080}
        height={1920}
      />

      {/* 6. Habit Psychology Video (9:16 Shorts) */}
      <Composition
        id="HabitVideo"
        component={HabitComposition}
        durationInFrames={habitDuration}
        fps={fps}
        width={1080}
        height={1920}
      />

      {/* 7. Procrastination Video Essay (16:9 Long-Form Masterclass) */}
      <Composition
        id="ProcrastinationVideo"
        component={ProcrastinationComposition}
        durationInFrames={procrastinationDuration}
        fps={fps}
        width={1920}
        height={1080}
      />
    </>
  );
};
