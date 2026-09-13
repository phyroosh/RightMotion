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
import { CutoutShowcase } from "./compositions/CutoutShowcase";
import { PlatformSafeShowcase } from "./compositions/PlatformSafeShowcase";
import { PrimitivesShowcase } from "./compositions/PrimitivesShowcase";
import { DopamineResetComposition } from "./clips/dopamine_reset";
import dopamineResetTranscript from "./clips/dopamine_reset/transcript.json";
import { ShrinkingCircleComposition } from "./clips/shrinking_circle";
import shrinkingCircleTranscript from "./clips/shrinking_circle/transcript.json";
import { HoldingGrudgesComposition } from "./clips/holding_grudges";
import holding_grudgesTranscript from "./clips/holding_grudges/transcript.json";
import { PushingAwayComposition } from "./clips/pushing_away";
import pushingAwayTranscript from "./clips/pushing_away/transcript.json";
import { TheCompoundingTrapComposition } from "./clips/the_compounding_trap";
import theCompoundingTrapTranscript from "./clips/the_compounding_trap/transcript.json";
import { The3amCortisolSpikeComposition } from "./clips/the_3am_cortisol_spike";
import the3amCortisolSpikeTranscript from "./clips/the_3am_cortisol_spike/transcript.json";
import { TeenageMentalHealthComposition } from "./clips/teenage_mental_health";
import teenageMentalHealthTranscript from "./clips/teenage_mental_health/transcript.json";
import { TheIllusionOfOwnershipComposition } from "./clips/the_illusion_of_ownership";
import theIllusionOfOwnershipTranscript from "./clips/the_illusion_of_ownership/transcript.json";
import { TheDopamineSugarTrapComposition } from "./clips/the_dopamine_sugar_trap";
import theDopamineSugarTrapTranscript from "./clips/the_dopamine_sugar_trap/transcript.json";
import { CortisolAwakeningRoutineComposition } from "./clips/cortisol_awakening_routine";
import cortisolAwakeningRoutineTranscript from "./clips/cortisol_awakening_routine/transcript.json";

import { MapTheGapComposition } from "./clips/map_the_gap";
import map_the_gapTranscript from "./clips/map_the_gap/transcript.json";
import { DiagramYourLoopComposition } from "./clips/diagram_your_loop";
import diagram_your_loopTranscript from "./clips/diagram_your_loop/transcript.json";

import { YouAreNotAloneComposition } from "./clips/you_are_not_alone";
import you_are_not_aloneTranscript from "./clips/you_are_not_alone/transcript.json";
import { BuildToScaleTHFComposition } from "./clips/build_to_scale_thf";
import buildToScaleTHFTranscript from "./clips/build_to_scale_thf/transcript.json";
import { TeenageRelationshipsComposition } from "./clips/teenage_relationships";
import teenage_relationshipsTranscript from "./clips/teenage_relationships/transcript.json";
import { StopComparingComposition } from "./clips/stop_comparing";
import stop_comparingTranscript from "./clips/stop_comparing/transcript.json";
import { TrueRelationshipsComposition } from "./clips/true_relationships";
import true_relationshipsTranscript from "./clips/true_relationships/transcript.json";
import { TheProcrastinationLoopComposition } from "./clips/the_procrastination_loop";
import the_procrastination_loopTranscript from "./clips/the_procrastination_loop/transcript.json";
import { TheCortisolInversionComposition } from "./clips/the_cortisol_inversion";
import the_cortisol_inversionTranscript from "./clips/the_cortisol_inversion/transcript.json";
import { CortisolEnergyEngineComposition } from "./clips/cortisol_energy_engine";
import cortisol_energy_engineTranscript from "./clips/cortisol_energy_engine/transcript.json";
import { TheTruthAboutSleepComposition } from "./clips/the_truth_about_sleep";
import the_truth_about_sleepTranscript from "./clips/the_truth_about_sleep/transcript.json";
import { TheSelfImageTrapComposition } from "./clips/the_self_image_trap";
import the_self_image_trapTranscript from "./clips/the_self_image_trap/transcript.json";
import { TrainYourBrainComposition } from "./clips/train_your_brain";
import train_your_brainTranscript from "./clips/train_your_brain/transcript.json";
import { GogginsStrategySystemComposition } from "./clips/goggins_strategy_system";
import goggins_strategy_systemTranscript from "./clips/goggins_strategy_system/transcript.json";
import { SleepDebtTrapComposition } from "./clips/sleep_debt_trap";
import sleep_debt_trapTranscript from "./clips/sleep_debt_trap/transcript.json";
import { TheMaskYouMistakeComposition } from "./clips/the_mask_you_mistake";
import the_mask_you_mistakeTranscript from "./clips/the_mask_you_mistake/transcript.json";
import { HowToRuinYourTeensComposition } from "./clips/how_to_ruin_your_teens";
import how_to_ruin_your_teensTranscript from "./clips/how_to_ruin_your_teens/transcript.json";
import { ChoiceOverloadComposition } from "./clips/choice_overload";
import choice_overloadTranscript from "./clips/choice_overload/transcript.json";
import { ThePersonYouNeverChoseComposition } from "./clips/the_person_you_never_chose";
import the_person_you_never_choseTranscript from "./clips/the_person_you_never_chose/transcript.json";
import { BrainToleranceComposition } from "./clips/brain_tolerance";
import brain_toleranceTranscript from "./clips/brain_tolerance/transcript.json";
import { TheArchitectureOfFocusComposition } from "./clips/the_architecture_of_focus";
import the_architecture_of_focusTranscript from "./clips/the_architecture_of_focus/transcript.json";
import { TheLawOfStructuralLoadComposition } from "./clips/the_law_of_structural_load";
import the_law_of_structural_loadTranscript from "./clips/the_law_of_structural_load/transcript.json";
import { TheThresholdEffectComposition } from "./clips/the_threshold_effect";
import the_threshold_effectTranscript from "./clips/the_threshold_effect/transcript.json";
import { TheLawOfTheCounterweightComposition } from "./clips/the_law_of_the_counterweight";
import the_law_of_the_counterweightTranscript from "./clips/the_law_of_the_counterweight/transcript.json";
import { TheArchitectureOfPressureComposition } from "./clips/the_architecture_of_pressure";
import the_architecture_of_pressureTranscript from "./clips/the_architecture_of_pressure/transcript.json";
import { OpenBrainTabsComposition } from "./clips/open_brain_tabs";
import open_brain_tabsTranscript from "./clips/open_brain_tabs/transcript.json";
import { SmokeTestFrontierSComposition } from "./clips/smoke_test_frontier_s";
import smoke_test_frontier_sTranscript from "./clips/smoke_test_frontier_s/transcript.json";
import { SmallCompromisesComposition } from "./clips/small_compromises";
import small_compromisesTranscript from "./clips/small_compromises/transcript.json";
import { HowCortisolWorksComposition } from "./clips/how_cortisol_works";
import how_cortisol_worksTranscript from "./clips/how_cortisol_works/transcript.json";
import { DopamineRealityComposition } from "./clips/dopamine_reality";
import dopamine_realityTranscript from "./clips/dopamine_reality/transcript.json";
import { PromisesComposition } from "./clips/promises";
import promisesTranscript from "./clips/promises/transcript.json";
import { PatternsComposition } from "./clips/patterns";
import patternsTranscript from "./clips/patterns/transcript.json";
import { TeenageComposition } from "./clips/teenage";
import teenageTranscript from "./clips/teenage/transcript.json";
import { EnvironmentComposition } from "./clips/environment";
import environmentTranscript from "./clips/environment/transcript.json";
import { LonelinessComposition } from "./clips/loneliness";
import lonelinessTranscript from "./clips/loneliness/transcript.json";
import { SayingNoComposition } from "./clips/saying_no";
import sayingNoTranscript from "./clips/saying_no/transcript.json";
import { SelfDoubtComposition } from "./clips/self_doubt";
import self_doubtTranscript from "./clips/self_doubt/transcript.json";
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
  DopamineRealityThumbnail,
  HowCortisolWorksThumbnail,
  SmallCompromisesThumbnail,
  SmokeTestFrontierSThumbnail,
  OpenBrainTabsThumbnail,
  TheArchitectureOfPressureThumbnail,
  TheLawOfTheCounterweightThumbnail,
  TheThresholdEffectThumbnail,
  TheLawOfStructuralLoadThumbnail,
  TheArchitectureOfFocusThumbnail,
  BrainToleranceThumbnail,
  ThePersonYouNeverChoseThumbnail,
  ChoiceOverloadThumbnail,
  HowToRuinYourTeensThumbnail,
  TheMaskYouMistakeThumbnail,
  SleepDebtTrapThumbnail,
  GogginsStrategySystemThumbnail,
  TrainYourBrainThumbnail,
  TheSelfImageTrapThumbnail,
  TheTruthAboutSleepThumbnail,
  CortisolEnergyEngineThumbnail,
  TheCortisolInversionThumbnail,
  TheProcrastinationLoopThumbnail,
  TrueRelationshipsThumbnail,
  StopComparingThumbnail,
  TeenageRelationshipsThumbnail,
  YouAreNotAloneThumbnail,
  MapTheGapThumbnail,
  HoldingGrudgesThumbnail,
  PushingAwayThumbnail,
  ShrinkingCircleThumbnail,
  DopamineResetThumbnail,
  BoundariesThumbnail,
  PatternsThumbnail,
  TeenageThumbnail,
  EnvironmentThumbnail,
  LonelinessThumbnail,
  SayingNoThumbnail,
  TheCompoundingTrapThumbnail,
  The3amCortisolSpikeThumbnail,
  TeenageMentalHealthThumbnail,
  TheIllusionOfOwnershipThumbnail,
  TheDopamineSugarTrapThumbnail,
  CortisolAwakeningRoutineThumbnail,
  DiagramYourLoopThumbnail,
  BuildToScaleTHFThumbnail,
  SelfDoubtThumbnail,
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
  const fps = 60;
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
  
  const dopamine_resetDuration = calculateDurationInFrames(dopamineResetTranscript as any[], fps);
  const shrinkingCircleDuration = calculateDurationInFrames(shrinkingCircleTranscript as any[], fps);
  
  const holding_grudgesDuration = calculateDurationInFrames(holding_grudgesTranscript as any[], fps);
  const pushingAwayDuration = calculateDurationInFrames(pushingAwayTranscript as any[], fps);
  
  
  
  const map_the_gapDuration = calculateDurationInFrames(map_the_gapTranscript as any[], fps);
  
  const you_are_not_aloneDuration = calculateDurationInFrames(you_are_not_aloneTranscript as any[], fps);
  
  
  
  const teenage_relationshipsDuration = calculateDurationInFrames(teenage_relationshipsTranscript as any[], fps);
  
  const stop_comparingDuration = calculateDurationInFrames(stop_comparingTranscript as any[], fps);
  
  const true_relationshipsDuration = calculateDurationInFrames(true_relationshipsTranscript as any[], fps);
  
  const the_procrastination_loopDuration = calculateDurationInFrames(the_procrastination_loopTranscript as any[], fps);
  
  const the_cortisol_inversionDuration = calculateDurationInFrames(the_cortisol_inversionTranscript as any[], fps);
  
  const cortisol_energy_engineDuration = calculateDurationInFrames(cortisol_energy_engineTranscript as any[], fps);
  
  const the_truth_about_sleepDuration = calculateDurationInFrames(the_truth_about_sleepTranscript as any[], fps);
  
  const the_self_image_trapDuration = calculateDurationInFrames(the_self_image_trapTranscript as any[], fps);

  const train_your_brainDuration = calculateDurationInFrames(train_your_brainTranscript as any[], fps);

  const goggins_strategy_systemDuration = calculateDurationInFrames(goggins_strategy_systemTranscript as any[], fps);
  
  const sleep_debt_trapDuration = calculateDurationInFrames(sleep_debt_trapTranscript as any[], fps);
  
  const the_mask_you_mistakeDuration = calculateDurationInFrames(the_mask_you_mistakeTranscript as any[], fps);
  
  const how_to_ruin_your_teensDuration = calculateDurationInFrames(how_to_ruin_your_teensTranscript as any[], fps);
  
  const choice_overloadDuration = calculateDurationInFrames(choice_overloadTranscript as any[], fps);
  
  const the_person_you_never_choseDuration = calculateDurationInFrames(the_person_you_never_choseTranscript as any[], fps);
  
  const brain_toleranceDuration = calculateDurationInFrames(brain_toleranceTranscript as any[], fps);
  
  const the_architecture_of_focusDuration = calculateDurationInFrames(the_architecture_of_focusTranscript as any[], fps);
  
  const the_law_of_structural_loadDuration = calculateDurationInFrames(the_law_of_structural_loadTranscript as any[], fps);
  
  const the_threshold_effectDuration = calculateDurationInFrames(the_threshold_effectTranscript as any[], fps);
  
  const the_law_of_the_counterweightDuration = calculateDurationInFrames(the_law_of_the_counterweightTranscript as any[], fps);
  
  const the_architecture_of_pressureDuration = calculateDurationInFrames(the_architecture_of_pressureTranscript as any[], fps);
  
  const open_brain_tabsDuration = calculateDurationInFrames(open_brain_tabsTranscript as any[], fps);
  
  const smoke_test_frontier_sDuration = calculateDurationInFrames(smoke_test_frontier_sTranscript as any[], fps);
  
  const small_compromisesDuration = calculateDurationInFrames(small_compromisesTranscript as any[], fps);
  
  const how_cortisol_worksDuration = calculateDurationInFrames(how_cortisol_worksTranscript as any[], fps);
  
  const dopamine_realityDuration = calculateDurationInFrames(dopamine_realityTranscript as any[], fps);
  const promisesDuration = calculateDurationInFrames(promisesTranscript as any[], fps);
  const patternsDuration = calculateDurationInFrames(patternsTranscript as any[], fps);
  const teenageDuration = calculateDurationInFrames(teenageTranscript as any[], fps);
  const environmentDuration = calculateDurationInFrames(environmentTranscript as any[], fps);
  const lonelinessDuration = calculateDurationInFrames(lonelinessTranscript as any[], fps);
  const sayingNoDuration = calculateDurationInFrames(sayingNoTranscript as any[], fps);
  const theCompoundingTrapDuration = calculateDurationInFrames(theCompoundingTrapTranscript as any[], fps);
  const the3amCortisolSpikeDuration = calculateDurationInFrames(the3amCortisolSpikeTranscript as any[], fps);
  const teenageMentalHealthDuration = calculateDurationInFrames(teenageMentalHealthTranscript as any[], fps);
  const theIllusionOfOwnershipDuration = calculateDurationInFrames(theIllusionOfOwnershipTranscript as any[], fps);
  const theDopamineSugarTrapDuration = calculateDurationInFrames(theDopamineSugarTrapTranscript as any[], fps);
  const cortisolAwakeningRoutineDuration = calculateDurationInFrames(cortisolAwakeningRoutineTranscript as any[], fps);
  const diagram_your_loopDuration = calculateDurationInFrames(diagram_your_loopTranscript as any[], fps);
  const self_doubtDuration = calculateDurationInFrames(self_doubtTranscript as any[], fps);
  const buildToScaleTHFDuration = 1322; // 44.06s video at 30 fps


  return (
    <>
      <Composition
        id="SayingNoVideo"
        component={SayingNoComposition}
        durationInFrames={sayingNoDuration}
        fps={fps}
        width={1080}
        height={1920}
      />

      <Composition
        id="LonelinessVideo"
        component={LonelinessComposition}
        durationInFrames={lonelinessDuration}
        fps={fps}
        width={1080}
        height={1920}
      />

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

      
      <Composition
        id="DopamineResetVideo"
        component={DopamineResetComposition}
        durationInFrames={dopamine_resetDuration}
        fps={fps}
        width={1080}
        height={1920}
      />

      
      <Composition
        id="ShrinkingCircleVideo"
        component={ShrinkingCircleComposition}
        durationInFrames={shrinkingCircleDuration}
        fps={fps}
        width={1080}
        height={1920}
      />

      <Composition
        id="HoldingGrudgesVideo"
        component={HoldingGrudgesComposition}
        durationInFrames={holding_grudgesDuration}
        fps={fps}
        width={1080}
        height={1920}
      />

      {/* 0. Pushing Away & Avoidant Trap Video (9:16 Shorts) */}
      <Composition
        id="PushingAwayVideo"
        component={PushingAwayComposition}
        durationInFrames={pushingAwayDuration}
        fps={fps}
        width={1080}
        height={1920}
      />



      
      <Composition
        id="MapTheGapVideo"
        component={MapTheGapComposition}
        durationInFrames={map_the_gapDuration}
        fps={fps}
        width={1080}
        height={1920}
      />

      <Composition
        id="DiagramYourLoopVideo"
        component={DiagramYourLoopComposition}
        durationInFrames={diagram_your_loopDuration}
        fps={fps}
        width={1080}
        height={1920}
      />


      
      <Composition
        id="YouAreNotAloneVideo"
        component={YouAreNotAloneComposition}
        durationInFrames={you_are_not_aloneDuration}
        fps={fps}
        width={1080}
        height={1920}
      />

      
      
      <Composition
        id="TeenageRelationshipsVideo"
        component={TeenageRelationshipsComposition}
        durationInFrames={teenage_relationshipsDuration}
        fps={fps}
        width={1080}
        height={1920}
      />

      
      <Composition
        id="StopComparingVideo"
        component={StopComparingComposition}
        durationInFrames={stop_comparingDuration}
        fps={fps}
        width={1080}
        height={1920}
      />

      
      <Composition
        id="TrueRelationshipsVideo"
        component={TrueRelationshipsComposition}
        durationInFrames={true_relationshipsDuration}
        fps={fps}
        width={1080}
        height={1920}
      />

      
      <Composition
        id="TheProcrastinationLoopVideo"
        component={TheProcrastinationLoopComposition}
        durationInFrames={the_procrastination_loopDuration}
        fps={fps}
        width={1080}
        height={1920}
      />

      
      <Composition
        id="TheCortisolInversionVideo"
        component={TheCortisolInversionComposition}
        durationInFrames={the_cortisol_inversionDuration}
        fps={fps}
        width={1080}
        height={1920}
      />

      
      <Composition
        id="CortisolEnergyEngineVideo"
        component={CortisolEnergyEngineComposition}
        durationInFrames={cortisol_energy_engineDuration}
        fps={fps}
        width={1080}
        height={1920}
      />

      
      <Composition
        id="TheTruthAboutSleepVideo"
        component={TheTruthAboutSleepComposition}
        durationInFrames={the_truth_about_sleepDuration}
        fps={fps}
        width={1080}
        height={1920}
      />

      
      <Composition
        id="TheSelfImageTrapVideo"
        component={TheSelfImageTrapComposition}
        durationInFrames={the_self_image_trapDuration}
        fps={fps}
        width={1080}
        height={1920}
      />

      
      <Composition
        id="TrainYourBrainVideo"
        component={TrainYourBrainComposition}
        durationInFrames={train_your_brainDuration}
        fps={fps}
        width={1080}
        height={1920}
      />


      <Composition
        id="GogginsStrategySystemVideo"
        component={GogginsStrategySystemComposition}
        durationInFrames={goggins_strategy_systemDuration}
        fps={fps}
        width={1080}
        height={1920}
      />

      
      <Composition
        id="SleepDebtTrapVideo"
        component={SleepDebtTrapComposition}
        durationInFrames={sleep_debt_trapDuration}
        fps={fps}
        width={1080}
        height={1920}
      />

      
      <Composition
        id="TheMaskYouMistakeVideo"
        component={TheMaskYouMistakeComposition}
        durationInFrames={the_mask_you_mistakeDuration}
        fps={fps}
        width={1080}
        height={1920}
      />

      
      <Composition
        id="HowToRuinYourTeensVideo"
        component={HowToRuinYourTeensComposition}
        durationInFrames={how_to_ruin_your_teensDuration}
        fps={fps}
        width={1080}
        height={1920}
      />

      
      <Composition
        id="ChoiceOverloadVideo"
        component={ChoiceOverloadComposition}
        durationInFrames={choice_overloadDuration}
        fps={fps}
        width={1080}
        height={1920}
      />

      
      <Composition
        id="ThePersonYouNeverChoseVideo"
        component={ThePersonYouNeverChoseComposition}
        durationInFrames={the_person_you_never_choseDuration}
        fps={fps}
        width={1080}
        height={1920}
      />

      
      <Composition
        id="BrainToleranceVideo"
        component={BrainToleranceComposition}
        durationInFrames={brain_toleranceDuration}
        fps={fps}
        width={1080}
        height={1920}
      />

      
      <Composition
        id="TheArchitectureOfFocusVideo"
        component={TheArchitectureOfFocusComposition}
        durationInFrames={the_architecture_of_focusDuration}
        fps={fps}
        width={1080}
        height={1920}
      />

      
      <Composition
        id="TheLawOfStructuralLoadVideo"
        component={TheLawOfStructuralLoadComposition}
        durationInFrames={the_law_of_structural_loadDuration}
        fps={fps}
        width={1080}
        height={1920}
      />

      
      <Composition
        id="TheThresholdEffectVideo"
        component={TheThresholdEffectComposition}
        durationInFrames={the_threshold_effectDuration}
        fps={fps}
        width={1080}
        height={1920}
      />

      
      <Composition
        id="TheLawOfTheCounterweightVideo"
        component={TheLawOfTheCounterweightComposition}
        durationInFrames={the_law_of_the_counterweightDuration}
        fps={fps}
        width={1080}
        height={1920}
      />

      
      <Composition
        id="TheArchitectureOfPressureVideo"
        component={TheArchitectureOfPressureComposition}
        durationInFrames={the_architecture_of_pressureDuration}
        fps={fps}
        width={1080}
        height={1920}
      />

      
      <Composition
        id="OpenBrainTabsVideo"
        component={OpenBrainTabsComposition}
        durationInFrames={open_brain_tabsDuration}
        fps={fps}
        width={1080}
        height={1920}
      />

      
      <Composition
        id="SmokeTestFrontierSVideo"
        component={SmokeTestFrontierSComposition}
        durationInFrames={smoke_test_frontier_sDuration}
        fps={fps}
        width={1080}
        height={1920}
      />

      
      <Composition
        id="SmallCompromisesVideo"
        component={SmallCompromisesComposition}
        durationInFrames={small_compromisesDuration}
        fps={fps}
        width={1080}
        height={1920}
      />

      
      <Composition
        id="HowCortisolWorksVideo"
        component={HowCortisolWorksComposition}
        durationInFrames={how_cortisol_worksDuration}
        fps={fps}
        width={1080}
        height={1920}
      />

      
      <Composition
        id="DopamineRealityVideo"
        component={DopamineRealityComposition}
        durationInFrames={dopamine_realityDuration}
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
      <Still
        id="LonelinessThumbnail"
        component={LonelinessThumbnail}
        width={1080}
        height={1920}
      />
      <Still
        id="SayingNoThumbnail"
        component={SayingNoThumbnail}
        width={1080}
        height={1920}
      />

      {/* Cutout Asset Engine Showcase */}
      <Still
        id="CutoutShowcase"
        component={CutoutShowcase}
        width={1920}
        height={1080}
      />
      <Composition
        id="CutoutShowcaseVideo"
        component={CutoutShowcase}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Platform-Safe Composition Architecture Showcase (9:16 Shorts) */}
      <Composition
        id="PlatformSafeShowcaseVideo"
        component={PlatformSafeShowcase}
        durationInFrames={120}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Phase 2: Runtime Physical Primitives Showcase */}
      <Composition
        id="PrimitivesShowcase"
        component={PrimitivesShowcase}
        durationInFrames={1500}
        fps={60}
        width={1080}
        height={1920}
      />

    
      <Still
        id="DopamineResetThumbnail"
        component={DopamineResetThumbnail}
        width={1080}
        height={1920}
      />
      <Still
        id="ShrinkingCircleThumbnail"
        component={ShrinkingCircleThumbnail}
        width={1080}
        height={1920}
      />
    
      <Still
        id="HoldingGrudgesThumbnail"
        component={HoldingGrudgesThumbnail}
        width={1080}
        height={1920}
      />
      <Still
        id="PushingAwayThumbnail"
        component={PushingAwayThumbnail}
        width={1080}
        height={1920}
      />

      {/* ─── 💹 FINANCE CHANNEL — Apex Wealth ─── */}
      <Composition
        id="TheCompoundingTrapVideo"
        component={TheCompoundingTrapComposition}
        durationInFrames={theCompoundingTrapDuration}
        fps={fps}
        width={1080}
        height={1920}
      />
      <Still
        id="TheCompoundingTrapThumbnail"
        component={TheCompoundingTrapThumbnail}
        width={1080}
        height={1920}
      />

      {/* ─── 🫀 HEALTH CHANNEL — BioMatrix ─── */}
      <Composition
        id="The3amCortisolSpikeVideo"
        component={The3amCortisolSpikeComposition}
        durationInFrames={the3amCortisolSpikeDuration}
        fps={fps}
        width={1080}
        height={1920}
      />
      <Still
        id="The3amCortisolSpikeThumbnail"
        component={The3amCortisolSpikeThumbnail}
        width={1080}
        height={1920}
      />
      <Composition
        id="TeenageMentalHealthVideo"
        component={TeenageMentalHealthComposition}
        durationInFrames={teenageMentalHealthDuration}
        fps={fps}
        width={1080}
        height={1920}
      />
      <Still
        id="TeenageMentalHealthThumbnail"
        component={TeenageMentalHealthThumbnail}
        width={1080}
        height={1920}
      />
      <Composition
        id="TheIllusionOfOwnershipVideo"
        component={TheIllusionOfOwnershipComposition}
        durationInFrames={theIllusionOfOwnershipDuration}
        fps={30}
        width={1080}
        height={1920}
      />
      <Still
        id="TheIllusionOfOwnershipThumbnail"
        component={TheIllusionOfOwnershipThumbnail}
        width={1080}
        height={1920}
      />
      <Composition
        id="TheDopamineSugarTrapVideo"
        component={TheDopamineSugarTrapComposition}
        durationInFrames={theDopamineSugarTrapDuration}
        fps={30}
        width={1080}
        height={1920}
      />
      <Still
        id="TheDopamineSugarTrapThumbnail"
        component={TheDopamineSugarTrapThumbnail}
        width={1080}
        height={1920}
      />
      <Composition
        id="CortisolAwakeningRoutineVideo"
        component={CortisolAwakeningRoutineComposition}
        durationInFrames={cortisolAwakeningRoutineDuration}
        fps={30}
        width={1080}
        height={1920}
      />
      <Still
        id="CortisolAwakeningRoutineThumbnail"
        component={CortisolAwakeningRoutineThumbnail}
        width={1080}
        height={1920}
      />


    
      <Still
        id="MapTheGapThumbnail"
        component={MapTheGapThumbnail}
        width={1080}
        height={1920}
      />
      <Still
        id="DiagramYourLoopThumbnail"
        component={DiagramYourLoopThumbnail}
        width={1080}
        height={1920}
      />
    
      <Still
        id="YouAreNotAloneThumbnail"
        component={YouAreNotAloneThumbnail}
        width={1080}
        height={1920}
      />

      {/* {facecam} Style 4 Test: Build To Scale — The Hazelnut Factory */}
      <Composition
        id="BuildToScaleTHFVideo"
        component={BuildToScaleTHFComposition}
        durationInFrames={buildToScaleTHFDuration}
        fps={30}
        width={1080}
        height={1920}
      />
      <Still
        id="BuildToScaleTHFThumbnail"
        component={BuildToScaleTHFThumbnail}
        width={1080}
        height={1920}
      />
    
      
      <Still
        id="TeenageRelationshipsThumbnail"
        component={TeenageRelationshipsThumbnail}
        width={1080}
        height={1920}
      />

      <Composition
        id="SelfDoubtVideo"
        component={SelfDoubtComposition}
        durationInFrames={self_doubtDuration}
        fps={fps}
        width={1080}
        height={1920}
      />
      <Still
        id="SelfDoubtThumbnail"
        component={SelfDoubtThumbnail}
        width={1080}
        height={1920}
      />
    
      <Still
        id="StopComparingThumbnail"
        component={StopComparingThumbnail}
        width={1080}
        height={1920}
      />
    
      <Still
        id="TrueRelationshipsThumbnail"
        component={TrueRelationshipsThumbnail}
        width={1080}
        height={1920}
      />
    
      <Still
        id="TheProcrastinationLoopThumbnail"
        component={TheProcrastinationLoopThumbnail}
        width={1080}
        height={1920}
      />
    
      <Still
        id="TheCortisolInversionThumbnail"
        component={TheCortisolInversionThumbnail}
        width={1080}
        height={1920}
      />
    
      <Still
        id="CortisolEnergyEngineThumbnail"
        component={CortisolEnergyEngineThumbnail}
        width={1080}
        height={1920}
      />
    
      <Still
        id="TheTruthAboutSleepThumbnail"
        component={TheTruthAboutSleepThumbnail}
        width={1080}
        height={1920}
      />
    
      <Still
        id="TheSelfImageTrapThumbnail"
        component={TheSelfImageTrapThumbnail}
        width={1080}
        height={1920}
      />
    
      <Still
        id="TrainYourBrainThumbnail"
        component={TrainYourBrainThumbnail}
        width={1080}
        height={1920}
      />

      <Still
        id="GogginsStrategySystemThumbnail"
        component={GogginsStrategySystemThumbnail}
        width={1080}
        height={1920}
      />
    
      <Still
        id="SleepDebtTrapThumbnail"
        component={SleepDebtTrapThumbnail}
        width={1080}
        height={1920}
      />
    
      <Still
        id="TheMaskYouMistakeThumbnail"
        component={TheMaskYouMistakeThumbnail}
        width={1080}
        height={1920}
      />
    
      <Still
        id="HowToRuinYourTeensThumbnail"
        component={HowToRuinYourTeensThumbnail}
        width={1080}
        height={1920}
      />
    
      <Still
        id="ChoiceOverloadThumbnail"
        component={ChoiceOverloadThumbnail}
        width={1080}
        height={1920}
      />
    
      <Still
        id="ThePersonYouNeverChoseThumbnail"
        component={ThePersonYouNeverChoseThumbnail}
        width={1080}
        height={1920}
      />
    
      <Still
        id="BrainToleranceThumbnail"
        component={BrainToleranceThumbnail}
        width={1080}
        height={1920}
      />
    
      <Still
        id="TheArchitectureOfFocusThumbnail"
        component={TheArchitectureOfFocusThumbnail}
        width={1080}
        height={1920}
      />
    
      <Still
        id="TheLawOfStructuralLoadThumbnail"
        component={TheLawOfStructuralLoadThumbnail}
        width={1080}
        height={1920}
      />
    
      <Still
        id="TheThresholdEffectThumbnail"
        component={TheThresholdEffectThumbnail}
        width={1080}
        height={1920}
      />
    
      <Still
        id="TheLawOfTheCounterweightThumbnail"
        component={TheLawOfTheCounterweightThumbnail}
        width={1080}
        height={1920}
      />
    
      <Still
        id="TheArchitectureOfPressureThumbnail"
        component={TheArchitectureOfPressureThumbnail}
        width={1080}
        height={1920}
      />
    
      <Still
        id="OpenBrainTabsThumbnail"
        component={OpenBrainTabsThumbnail}
        width={1080}
        height={1920}
      />
    
      <Still
        id="SmokeTestFrontierSThumbnail"
        component={SmokeTestFrontierSThumbnail}
        width={1080}
        height={1920}
      />
    
      <Still
        id="SmallCompromisesThumbnail"
        component={SmallCompromisesThumbnail}
        width={1080}
        height={1920}
      />
    
      <Still
        id="HowCortisolWorksThumbnail"
        component={HowCortisolWorksThumbnail}
        width={1080}
        height={1920}
      />
    
      <Still
        id="DopamineRealityThumbnail"
        component={DopamineRealityThumbnail}
        width={1080}
        height={1920}
      />
    </>
  );
};
