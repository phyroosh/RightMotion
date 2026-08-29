import React from "react";
import { Composition, Still } from "remotion";
import { ADHDComposition } from "./clips/adhd";
import { ComparisonComposition } from "./clips/comparison";
import { HabitComposition } from "./clips/habits";
import { MotivationComposition } from "./clips/motivation";
import { MaturityComposition } from "./clips/maturity";
import { ProcrastinationComposition } from "./clips/procrastination";
import { NeuroproductivityComposition } from "./clips/neuroproductivity";
import { LofiSongComposition } from "./clips/lofi_song";
import { BoundariesComposition } from "./clips/boundaries";
import boundariesTranscript from "./clips/boundaries/transcript.json";
import { PromisesComposition } from "./clips/promises";
import promisesTranscript from "./clips/promises/transcript.json";
import { PatternsComposition } from "./clips/patterns";
import patternsTranscript from "./clips/patterns/transcript.json";
import { TeenageComposition } from "./clips/teenage";
import teenageTranscript from "./clips/teenage/transcript.json";
import { EnvironmentComposition } from "./clips/environment";
import environmentTranscript from "./clips/environment/transcript.json";
import {
  NeuroproductivityThumbnail,
  ProcrastinationThumbnail,
  LofiSongThumbnail,
  ADHDThumbnail,
  GogginsThumbnail,
  BreaksThumbnail,
  MotivationThumbnail,
  MaturityThumbnail,
  ComparisonThumbnail,
  HabitThumbnail,
  EmotionsThumbnail,
  StrengthThumbnail,
  ChaptersThumbnail,
  PromisesThumbnail,
  BoundariesThumbnail,
  PatternsThumbnail,
  TeenageThumbnail,
  EnvironmentThumbnail,
} from "./thumbnails";
import adhdTranscript from "./clips/adhd/transcript.json";
import comparisonTranscript from "./clips/comparison/transcript.json";
import habitTranscript from "./clips/habits/transcript.json";
import motivationTranscript from "./clips/motivation/transcript.json";
import maturityTranscript from "./clips/maturity/transcript.json";
import procrastinationTranscript from "./clips/procrastination/transcript.json";
import neuroproductivityTranscript from "./clips/neuroproductivity/transcript.json";
import lofiSongTranscript from "./clips/lofi_song/transcript.json";
import { GogginsComposition } from "./clips/goggins";
import { BreaksComposition } from "./clips/breaks";
import { StrengthComposition } from "./clips/strength";
import { EmotionsComposition } from "./clips/emotions";
import { ChaptersComposition } from "./clips/chapters";
import gogginsTranscript from "./clips/goggins/transcript.json";
import breaksTranscript from "./clips/breaks/transcript.json";
import strengthTranscript from "./clips/strength/transcript.json";
import emotionsTranscript from "./clips/emotions/transcript.json";
import chaptersTranscript from "./clips/chapters/transcript.json";
import { WordTimestamp } from "./types";
import "./style.css";

const calculateDurationInFrames = (transcript: any[], fps: number): number => {
  if (!transcript || transcript.length === 0) {
    return 150;
  }
  const lastWord = transcript[transcript.length - 1];
  const lastWordEndMs = lastWord?.end || lastWord?.endMs || 5000;
  const totalDurationMs = lastWordEndMs + 800; // 0.8s outro padding
  return Math.ceil((totalDurationMs / 1000) * fps);
};

export const RemotionRoot: React.FC = () => {
  const fps = 30;
  const chaptersDuration = calculateDurationInFrames(chaptersTranscript as WordTimestamp[], fps);
  const emotionsDuration = calculateDurationInFrames(emotionsTranscript as WordTimestamp[], fps);
  const strengthDuration = calculateDurationInFrames(strengthTranscript as WordTimestamp[], fps);
  const gogginsDuration = calculateDurationInFrames(gogginsTranscript as WordTimestamp[], fps);
  const breaksDuration = calculateDurationInFrames(breaksTranscript as WordTimestamp[], fps);
  const adhdDuration = calculateDurationInFrames(adhdTranscript as WordTimestamp[], fps);
  const comparisonDuration = calculateDurationInFrames(comparisonTranscript as WordTimestamp[], fps);
  const habitDuration = calculateDurationInFrames(habitTranscript as WordTimestamp[], fps);
  const motivationDuration = calculateDurationInFrames(motivationTranscript as WordTimestamp[], fps);
  const maturityDuration = calculateDurationInFrames(maturityTranscript as WordTimestamp[], fps);
  const procrastinationDuration = calculateDurationInFrames(procrastinationTranscript as WordTimestamp[], fps);
  const neuroproductivityDuration = calculateDurationInFrames(neuroproductivityTranscript as WordTimestamp[], fps);
  const lofiSongDuration = Math.ceil(130.86 * fps); // 130.86s audio = 3926 frames
  
  const boundariesDuration = calculateDurationInFrames(boundariesTranscript as any[], fps);
  const promisesDuration = calculateDurationInFrames(promisesTranscript as any[], fps);
  const patternsDuration = calculateDurationInFrames(patternsTranscript as any[], fps);
  const teenageDuration = calculateDurationInFrames(teenageTranscript as any[], fps);
  const environmentDuration = calculateDurationInFrames(environmentTranscript as any[], fps);

  return (
    <>
      <Composition
        id="EnvironmentVideo"
        component={EnvironmentComposition}
        durationInFrames={environmentDuration}
        fps={fps}
        width={1080}
        height={1920}
      />

      <Composition
        id="TeenageVideo"
        component={TeenageComposition}
        durationInFrames={teenageDuration}
        fps={fps}
        width={1080}
        height={1920}
      />

      <Composition
        id="PatternsVideo"
        component={PatternsComposition}
        durationInFrames={patternsDuration}
        fps={fps}
        width={1080}
        height={1920}
      />
      
      <Composition
        id="BoundariesVideo"
        component={BoundariesComposition}
        durationInFrames={boundariesDuration}
        fps={fps}
        width={1080}
        height={1920}
      />

      {/* 0. Broken Promises & Self-Trust Video (9:16 Shorts) */}
      <Composition
        id="PromisesVideo"
        component={PromisesComposition}
        durationInFrames={promisesDuration}
        fps={fps}
        width={1080}
        height={1920}
      />

      {/* 9. Lofi Red Aesthetics Lyric Music Video (16:9 Long-Form Masterclass with Solid Red Colors & AE Camera) */}
      <Composition
        id="LofiSongVideo"
        component={LofiSongComposition}
        durationInFrames={lofiSongDuration}
        fps={fps}
        width={1920}
        height={1080}
      />

      {/* 8. Neuroproductivity Video Essay (16:9 Long-Form Masterclass with Solid Colors & AE Camera) */}
      <Composition
        id="NeuroproductivityVideo"
        component={NeuroproductivityComposition}
        durationInFrames={neuroproductivityDuration}
        fps={fps}
        width={1920}
        height={1080}
      />
      {/* 0. Unfinished Chapters & Starting Line Video (9:16 Shorts) */}
      <Composition
        id="ChaptersVideo"
        component={ChaptersComposition}
        durationInFrames={chaptersDuration}
        fps={fps}
        width={1080}
        height={1920}
      />

      {/* 0a. Emotional Processing & Clarity Video (9:16 Shorts) */}
      <Composition
        id="EmotionsVideo"
        component={EmotionsComposition}
        durationInFrames={emotionsDuration}
        fps={fps}
        width={1080}
        height={1920}
      />

      {/* 0a. Real Strength & Vulnerability Video (9:16 Shorts) */}
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

      {/* ======================================================== */}
      {/* 16:9 WIDESCREEN THUMBNAILS (Long-Form Masterclasses)     */}
      {/* ======================================================== */}
      <Still
        id="NeuroproductivityThumbnail"
        component={NeuroproductivityThumbnail}
        width={1920}
        height={1080}
      />
      <Still
        id="ProcrastinationThumbnail"
        component={ProcrastinationThumbnail}
        width={1920}
        height={1080}
      />
      <Still
        id="LofiSongThumbnail"
        component={LofiSongThumbnail}
        width={1920}
        height={1080}
      />

      {/* ======================================================== */}
      {/* 9:16 VERTICAL THUMBNAILS (YouTube Shorts / Reels Covers) */}
      {/* ======================================================== */}
      <Still
        id="ADHDThumbnail"
        component={ADHDThumbnail}
        width={1080}
        height={1920}
      />
      <Still
        id="GogginsThumbnail"
        component={GogginsThumbnail}
        width={1080}
        height={1920}
      />
      <Still
        id="BreaksThumbnail"
        component={BreaksThumbnail}
        width={1080}
        height={1920}
      />
      <Still
        id="MotivationThumbnail"
        component={MotivationThumbnail}
        width={1080}
        height={1920}
      />
      <Still
        id="MaturityThumbnail"
        component={MaturityThumbnail}
        width={1080}
        height={1920}
      />
      <Still
        id="ComparisonThumbnail"
        component={ComparisonThumbnail}
        width={1080}
        height={1920}
      />
      <Still
        id="HabitThumbnail"
        component={HabitThumbnail}
        width={1080}
        height={1920}
      />
      <Still
        id="EmotionsThumbnail"
        component={EmotionsThumbnail}
        width={1080}
        height={1920}
      />
      <Still
        id="StrengthThumbnail"
        component={StrengthThumbnail}
        width={1080}
        height={1920}
      />
      <Still
        id="ChaptersThumbnail"
        component={ChaptersThumbnail}
        width={1080}
        height={1920}
      />
      <Still
        id="PromisesThumbnail"
        component={PromisesThumbnail}
        width={1080}
        height={1920}
      />
    
      <Still
        id="BoundariesThumbnail"
        component={BoundariesThumbnail}
        width={1080}
        height={1920}
      />
      <Still
        id="PatternsThumbnail"
        component={PatternsThumbnail}
        width={1080}
        height={1920}
      />
      <Still
        id="TeenageThumbnail"
        component={TeenageThumbnail}
        width={1080}
        height={1920}
      />
      <Still
        id="EnvironmentThumbnail"
        component={EnvironmentThumbnail}
        width={1080}
        height={1920}
      />
    </>
  );
};
