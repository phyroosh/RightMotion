/**
 * 🎬 RightMotion — Structured Clip & Composition Registry
 * 
 * Canonical single source of truth for all production clips, metadata,
 * transcript links, and thumbnail bindings.
 * Consumed directly by Root.tsx (replaces brittle source-text mutation).
 */

import React from "react";
import { WordTimestamp } from "../types";

export interface ClipRegistration {
  id: string;
  pascalName: string;
  component: React.ComponentType<any>;
  thumbnailComponent?: React.ComponentType<any>;
  transcript: any[];
  format?: "shorts" | "longform";
  fps?: number;
  width?: number;
  height?: number;
  customDurationInFrames?: number;
}

export const calculateDurationInFrames = (transcript: any[], fps: number): number => {
  if (!transcript || transcript.length === 0) {
    return 150;
  }
  const lastWord = transcript[transcript.length - 1];
  const lastWordEndMs = lastWord?.end || lastWord?.endMs || 5000;
  const totalDurationMs = lastWordEndMs + 800; // 0.8s outro padding
  return Math.ceil((totalDurationMs / 1000) * fps);
};

// ============================================================================
// 1. Clip Component & Transcript Imports
// ============================================================================
import { WhyProcrastinationGetsEasierComposition } from "./why_procrastination_gets_easier";
import why_procrastination_gets_easierTranscript from "./why_procrastination_gets_easier/transcript.json";
import { PriceOfInactionComposition } from "./price_of_inaction";
import price_of_inactionTranscript from "./price_of_inaction/transcript.json";
import { ADHDComposition } from "./adhd";
import adhdTranscript from "./adhd/transcript.json";
import { ComparisonComposition } from "./comparison";
import comparisonTranscript from "./comparison/transcript.json";
import { HabitComposition } from "./habits";
import habitsTranscript from "./habits/transcript.json";
import { MotivationComposition } from "./motivation";
import motivationTranscript from "./motivation/transcript.json";
import { MaturityComposition } from "./maturity";
import maturityTranscript from "./maturity/transcript.json";
import { ProcrastinationComposition } from "./procrastination";
import procrastinationTranscript from "./procrastination/transcript.json";
import { NeuroproductivityComposition } from "./neuroproductivity";
import neuroproductivityTranscript from "./neuroproductivity/transcript.json";
import { LofiSongComposition } from "./lofi_song";
import lofi_songTranscript from "./lofi_song/transcript.json";
import { BoundariesComposition } from "./boundaries";
import boundariesTranscript from "./boundaries/transcript.json";
import { DopamineResetComposition } from "./dopamine_reset";
import dopamine_resetTranscript from "./dopamine_reset/transcript.json";
import { ShrinkingCircleComposition } from "./shrinking_circle";
import shrinking_circleTranscript from "./shrinking_circle/transcript.json";
import { HoldingGrudgesComposition } from "./holding_grudges";
import holding_grudgesTranscript from "./holding_grudges/transcript.json";
import { PushingAwayComposition } from "./pushing_away";
import pushing_awayTranscript from "./pushing_away/transcript.json";
import { TheCompoundingTrapComposition } from "./the_compounding_trap";
import the_compounding_trapTranscript from "./the_compounding_trap/transcript.json";
import { The3amCortisolSpikeComposition } from "./the_3am_cortisol_spike";
import the_3am_cortisol_spikeTranscript from "./the_3am_cortisol_spike/transcript.json";
import { TeenageMentalHealthComposition } from "./teenage_mental_health";
import teenage_mental_healthTranscript from "./teenage_mental_health/transcript.json";
import { TheIllusionOfOwnershipComposition } from "./the_illusion_of_ownership";
import the_illusion_of_ownershipTranscript from "./the_illusion_of_ownership/transcript.json";
import { TheDopamineSugarTrapComposition } from "./the_dopamine_sugar_trap";
import the_dopamine_sugar_trapTranscript from "./the_dopamine_sugar_trap/transcript.json";
import { CortisolAwakeningRoutineComposition } from "./cortisol_awakening_routine";
import cortisol_awakening_routineTranscript from "./cortisol_awakening_routine/transcript.json";
import { MapTheGapComposition } from "./map_the_gap";
import map_the_gapTranscript from "./map_the_gap/transcript.json";
import { DiagramYourLoopComposition } from "./diagram_your_loop";
import diagram_your_loopTranscript from "./diagram_your_loop/transcript.json";
import { YouAreNotAloneComposition } from "./you_are_not_alone";
import you_are_not_aloneTranscript from "./you_are_not_alone/transcript.json";
import { BuildToScaleTHFComposition } from "./build_to_scale_thf";
import build_to_scale_thfTranscript from "./build_to_scale_thf/transcript.json";
import { TeenageRelationshipsComposition } from "./teenage_relationships";
import teenage_relationshipsTranscript from "./teenage_relationships/transcript.json";
import { StopComparingComposition } from "./stop_comparing";
import stop_comparingTranscript from "./stop_comparing/transcript.json";
import { TrueRelationshipsComposition } from "./true_relationships";
import true_relationshipsTranscript from "./true_relationships/transcript.json";
import { TheProcrastinationLoopComposition } from "./the_procrastination_loop";
import the_procrastination_loopTranscript from "./the_procrastination_loop/transcript.json";
import { TheCortisolInversionComposition } from "./the_cortisol_inversion";
import the_cortisol_inversionTranscript from "./the_cortisol_inversion/transcript.json";
import { CortisolEnergyEngineComposition } from "./cortisol_energy_engine";
import cortisol_energy_engineTranscript from "./cortisol_energy_engine/transcript.json";
import { TheTruthAboutSleepComposition } from "./the_truth_about_sleep";
import the_truth_about_sleepTranscript from "./the_truth_about_sleep/transcript.json";
import { TheSelfImageTrapComposition } from "./the_self_image_trap";
import the_self_image_trapTranscript from "./the_self_image_trap/transcript.json";
import { TrainYourBrainComposition } from "./train_your_brain";
import train_your_brainTranscript from "./train_your_brain/transcript.json";
import { GogginsStrategySystemComposition } from "./goggins_strategy_system";
import goggins_strategy_systemTranscript from "./goggins_strategy_system/transcript.json";
import { SleepDebtTrapComposition } from "./sleep_debt_trap";
import sleep_debt_trapTranscript from "./sleep_debt_trap/transcript.json";
import { TheMaskYouMistakeComposition } from "./the_mask_you_mistake";
import the_mask_you_mistakeTranscript from "./the_mask_you_mistake/transcript.json";
import { HowToRuinYourTeensComposition } from "./how_to_ruin_your_teens";
import how_to_ruin_your_teensTranscript from "./how_to_ruin_your_teens/transcript.json";
import { ChoiceOverloadComposition } from "./choice_overload";
import choice_overloadTranscript from "./choice_overload/transcript.json";
import { ThePersonYouNeverChoseComposition } from "./the_person_you_never_chose";
import the_person_you_never_choseTranscript from "./the_person_you_never_chose/transcript.json";
import { BrainToleranceComposition } from "./brain_tolerance";
import brain_toleranceTranscript from "./brain_tolerance/transcript.json";
import { TheArchitectureOfFocusComposition } from "./the_architecture_of_focus";
import the_architecture_of_focusTranscript from "./the_architecture_of_focus/transcript.json";
import { TheLawOfStructuralLoadComposition } from "./the_law_of_structural_load";
import the_law_of_structural_loadTranscript from "./the_law_of_structural_load/transcript.json";
import { TheThresholdEffectComposition } from "./the_threshold_effect";
import the_threshold_effectTranscript from "./the_threshold_effect/transcript.json";
import { TheLawOfTheCounterweightComposition } from "./the_law_of_the_counterweight";
import the_law_of_the_counterweightTranscript from "./the_law_of_the_counterweight/transcript.json";
import { TheArchitectureOfPressureComposition } from "./the_architecture_of_pressure";
import the_architecture_of_pressureTranscript from "./the_architecture_of_pressure/transcript.json";
import { OpenBrainTabsComposition } from "./open_brain_tabs";
import open_brain_tabsTranscript from "./open_brain_tabs/transcript.json";
import { SmokeTestFrontierSComposition } from "./smoke_test_frontier_s";
import smoke_test_frontier_sTranscript from "./smoke_test_frontier_s/transcript.json";
import { SmallCompromisesComposition } from "./small_compromises";
import small_compromisesTranscript from "./small_compromises/transcript.json";
import { HowCortisolWorksComposition } from "./how_cortisol_works";
import how_cortisol_worksTranscript from "./how_cortisol_works/transcript.json";
import { DopamineRealityComposition } from "./dopamine_reality";
import dopamine_realityTranscript from "./dopamine_reality/transcript.json";
import { WhatYouTolerateComposition } from "./what_you_tolerate";
import what_you_tolerateTranscript from "./what_you_tolerate/transcript.json";
import { TheArtOfEnvironmentComposition } from "./the_art_of_environment";
import the_art_of_environmentTranscript from "./the_art_of_environment/transcript.json";
import { PromisesComposition } from "./promises";
import promisesTranscript from "./promises/transcript.json";
import { PatternsComposition } from "./patterns";
import patternsTranscript from "./patterns/transcript.json";
import { TeenageComposition } from "./teenage";
import teenageTranscript from "./teenage/transcript.json";
import { EnvironmentComposition } from "./environment";
import environmentTranscript from "./environment/transcript.json";
import { LonelinessComposition } from "./loneliness";
import lonelinessTranscript from "./loneliness/transcript.json";
import { SayingNoComposition } from "./saying_no";
import saying_noTranscript from "./saying_no/transcript.json";
import { SelfDoubtComposition } from "./self_doubt";
import self_doubtTranscript from "./self_doubt/transcript.json";
import { GogginsComposition } from "./goggins";
import gogginsTranscript from "./goggins/transcript.json";
import { BreaksComposition } from "./breaks";
import breaksTranscript from "./breaks/transcript.json";
import { StrengthComposition } from "./strength";
import strengthTranscript from "./strength/transcript.json";
import { EmotionsComposition } from "./emotions";
import emotionsTranscript from "./emotions/transcript.json";
import { ChaptersComposition } from "./chapters";
import chaptersTranscript from "./chapters/transcript.json";

// ============================================================================
// 2. Thumbnail Imports
// ============================================================================
import {
  ADHDThumbnail,
  ComparisonThumbnail,
  HabitThumbnail,
  MotivationThumbnail,
  MaturityThumbnail,
  ProcrastinationThumbnail,
  NeuroproductivityThumbnail,
  LofiSongThumbnail,
  BoundariesThumbnail,
  DopamineResetThumbnail,
  ShrinkingCircleThumbnail,
  HoldingGrudgesThumbnail,
  PushingAwayThumbnail,
  TheCompoundingTrapThumbnail,
  The3amCortisolSpikeThumbnail,
  TeenageMentalHealthThumbnail,
  TheIllusionOfOwnershipThumbnail,
  TheDopamineSugarTrapThumbnail,
  CortisolAwakeningRoutineThumbnail,
  MapTheGapThumbnail,
  DiagramYourLoopThumbnail,
  YouAreNotAloneThumbnail,
  BuildToScaleTHFThumbnail,
  TeenageRelationshipsThumbnail,
  StopComparingThumbnail,
  TrueRelationshipsThumbnail,
  TheProcrastinationLoopThumbnail,
  TheCortisolInversionThumbnail,
  CortisolEnergyEngineThumbnail,
  TheTruthAboutSleepThumbnail,
  TheSelfImageTrapThumbnail,
  TrainYourBrainThumbnail,
  GogginsStrategySystemThumbnail,
  SleepDebtTrapThumbnail,
  TheMaskYouMistakeThumbnail,
  HowToRuinYourTeensThumbnail,
  ChoiceOverloadThumbnail,
  ThePersonYouNeverChoseThumbnail,
  BrainToleranceThumbnail,
  TheArchitectureOfFocusThumbnail,
  TheLawOfStructuralLoadThumbnail,
  TheThresholdEffectThumbnail,
  TheLawOfTheCounterweightThumbnail,
  TheArchitectureOfPressureThumbnail,
  OpenBrainTabsThumbnail,
  SmokeTestFrontierSThumbnail,
  SmallCompromisesThumbnail,
  HowCortisolWorksThumbnail,
  DopamineRealityThumbnail,
  WhatYouTolerateThumbnail,
  TheArtOfEnvironmentThumbnail,
  PromisesThumbnail,
  PatternsThumbnail,
  TeenageThumbnail,
  EnvironmentThumbnail,
  LonelinessThumbnail,
  SayingNoThumbnail,
  SelfDoubtThumbnail,
  GogginsThumbnail,
  BreaksThumbnail,
  StrengthThumbnail,
  EmotionsThumbnail,
  ChaptersThumbnail,
  PriceOfInactionThumbnail,
  WhyProcrastinationGetsEasierThumbnail,
} from "../thumbnails";

// ============================================================================
// 3. Canonical Clip Registry Array
// ============================================================================
export const REGISTERED_CLIPS: ClipRegistration[] = [
  {
    id: "why_procrastination_gets_easier",
    pascalName: "WhyProcrastinationGetsEasier",
    component: WhyProcrastinationGetsEasierComposition,
    thumbnailComponent: WhyProcrastinationGetsEasierThumbnail,
    transcript: why_procrastination_gets_easierTranscript as any[],
    format: "shorts",
  },
  {
    id: "price_of_inaction",
    pascalName: "PriceOfInaction",
    component: PriceOfInactionComposition,
    thumbnailComponent: PriceOfInactionThumbnail,
    transcript: price_of_inactionTranscript as any[],
    format: "shorts",
  },
  {
    id: "adhd",
    pascalName: "ADHD",
    component: ADHDComposition,
    thumbnailComponent: ADHDThumbnail,
    transcript: adhdTranscript as any[],
  },
  {
    id: "comparison",
    pascalName: "Comparison",
    component: ComparisonComposition,
    thumbnailComponent: ComparisonThumbnail,
    transcript: comparisonTranscript as any[],
  },
  {
    id: "habits",
    pascalName: "Habit",
    component: HabitComposition,
    thumbnailComponent: HabitThumbnail,
    transcript: habitsTranscript as any[],
  },
  {
    id: "motivation",
    pascalName: "Motivation",
    component: MotivationComposition,
    thumbnailComponent: MotivationThumbnail,
    transcript: motivationTranscript as any[],
  },
  {
    id: "maturity",
    pascalName: "Maturity",
    component: MaturityComposition,
    thumbnailComponent: MaturityThumbnail,
    transcript: maturityTranscript as any[],
  },
  {
    id: "procrastination",
    pascalName: "Procrastination",
    component: ProcrastinationComposition,
    thumbnailComponent: ProcrastinationThumbnail,
    transcript: procrastinationTranscript as any[],
    format: "longform",
    width: 1920,
    height: 1080,
  },
  {
    id: "neuroproductivity",
    pascalName: "Neuroproductivity",
    component: NeuroproductivityComposition,
    thumbnailComponent: NeuroproductivityThumbnail,
    transcript: neuroproductivityTranscript as any[],
    format: "longform",
    width: 1920,
    height: 1080,
  },
  {
    id: "lofi_song",
    pascalName: "LofiSong",
    component: LofiSongComposition,
    thumbnailComponent: LofiSongThumbnail,
    transcript: lofi_songTranscript as any[],
    format: "longform",
    width: 1920,
    height: 1080,
    customDurationInFrames: Math.ceil(130.86 * 60),
  },
  {
    id: "boundaries",
    pascalName: "Boundaries",
    component: BoundariesComposition,
    thumbnailComponent: BoundariesThumbnail,
    transcript: boundariesTranscript as any[],
  },
  {
    id: "dopamine_reset",
    pascalName: "DopamineReset",
    component: DopamineResetComposition,
    thumbnailComponent: DopamineResetThumbnail,
    transcript: dopamine_resetTranscript as any[],
  },
  {
    id: "shrinking_circle",
    pascalName: "ShrinkingCircle",
    component: ShrinkingCircleComposition,
    thumbnailComponent: ShrinkingCircleThumbnail,
    transcript: shrinking_circleTranscript as any[],
  },
  {
    id: "holding_grudges",
    pascalName: "HoldingGrudges",
    component: HoldingGrudgesComposition,
    thumbnailComponent: HoldingGrudgesThumbnail,
    transcript: holding_grudgesTranscript as any[],
  },
  {
    id: "pushing_away",
    pascalName: "PushingAway",
    component: PushingAwayComposition,
    thumbnailComponent: PushingAwayThumbnail,
    transcript: pushing_awayTranscript as any[],
  },
  {
    id: "the_compounding_trap",
    pascalName: "TheCompoundingTrap",
    component: TheCompoundingTrapComposition,
    thumbnailComponent: TheCompoundingTrapThumbnail,
    transcript: the_compounding_trapTranscript as any[],
  },
  {
    id: "the_3am_cortisol_spike",
    pascalName: "The3amCortisolSpike",
    component: The3amCortisolSpikeComposition,
    thumbnailComponent: The3amCortisolSpikeThumbnail,
    transcript: the_3am_cortisol_spikeTranscript as any[],
  },
  {
    id: "teenage_mental_health",
    pascalName: "TeenageMentalHealth",
    component: TeenageMentalHealthComposition,
    thumbnailComponent: TeenageMentalHealthThumbnail,
    transcript: teenage_mental_healthTranscript as any[],
  },
  {
    id: "the_illusion_of_ownership",
    pascalName: "TheIllusionOfOwnership",
    component: TheIllusionOfOwnershipComposition,
    thumbnailComponent: TheIllusionOfOwnershipThumbnail,
    transcript: the_illusion_of_ownershipTranscript as any[],
  },
  {
    id: "the_dopamine_sugar_trap",
    pascalName: "TheDopamineSugarTrap",
    component: TheDopamineSugarTrapComposition,
    thumbnailComponent: TheDopamineSugarTrapThumbnail,
    transcript: the_dopamine_sugar_trapTranscript as any[],
  },
  {
    id: "cortisol_awakening_routine",
    pascalName: "CortisolAwakeningRoutine",
    component: CortisolAwakeningRoutineComposition,
    thumbnailComponent: CortisolAwakeningRoutineThumbnail,
    transcript: cortisol_awakening_routineTranscript as any[],
  },
  {
    id: "map_the_gap",
    pascalName: "MapTheGap",
    component: MapTheGapComposition,
    thumbnailComponent: MapTheGapThumbnail,
    transcript: map_the_gapTranscript as any[],
  },
  {
    id: "diagram_your_loop",
    pascalName: "DiagramYourLoop",
    component: DiagramYourLoopComposition,
    thumbnailComponent: DiagramYourLoopThumbnail,
    transcript: diagram_your_loopTranscript as any[],
  },
  {
    id: "you_are_not_alone",
    pascalName: "YouAreNotAlone",
    component: YouAreNotAloneComposition,
    thumbnailComponent: YouAreNotAloneThumbnail,
    transcript: you_are_not_aloneTranscript as any[],
  },
  {
    id: "build_to_scale_thf",
    pascalName: "BuildToScaleTHF",
    component: BuildToScaleTHFComposition,
    thumbnailComponent: BuildToScaleTHFThumbnail,
    transcript: build_to_scale_thfTranscript as any[],
    customDurationInFrames: 1322,
  },
  {
    id: "teenage_relationships",
    pascalName: "TeenageRelationships",
    component: TeenageRelationshipsComposition,
    thumbnailComponent: TeenageRelationshipsThumbnail,
    transcript: teenage_relationshipsTranscript as any[],
  },
  {
    id: "stop_comparing",
    pascalName: "StopComparing",
    component: StopComparingComposition,
    thumbnailComponent: StopComparingThumbnail,
    transcript: stop_comparingTranscript as any[],
  },
  {
    id: "true_relationships",
    pascalName: "TrueRelationships",
    component: TrueRelationshipsComposition,
    thumbnailComponent: TrueRelationshipsThumbnail,
    transcript: true_relationshipsTranscript as any[],
  },
  {
    id: "the_procrastination_loop",
    pascalName: "TheProcrastinationLoop",
    component: TheProcrastinationLoopComposition,
    thumbnailComponent: TheProcrastinationLoopThumbnail,
    transcript: the_procrastination_loopTranscript as any[],
  },
  {
    id: "the_cortisol_inversion",
    pascalName: "TheCortisolInversion",
    component: TheCortisolInversionComposition,
    thumbnailComponent: TheCortisolInversionThumbnail,
    transcript: the_cortisol_inversionTranscript as any[],
  },
  {
    id: "cortisol_energy_engine",
    pascalName: "CortisolEnergyEngine",
    component: CortisolEnergyEngineComposition,
    thumbnailComponent: CortisolEnergyEngineThumbnail,
    transcript: cortisol_energy_engineTranscript as any[],
  },
  {
    id: "the_truth_about_sleep",
    pascalName: "TheTruthAboutSleep",
    component: TheTruthAboutSleepComposition,
    thumbnailComponent: TheTruthAboutSleepThumbnail,
    transcript: the_truth_about_sleepTranscript as any[],
  },
  {
    id: "the_self_image_trap",
    pascalName: "TheSelfImageTrap",
    component: TheSelfImageTrapComposition,
    thumbnailComponent: TheSelfImageTrapThumbnail,
    transcript: the_self_image_trapTranscript as any[],
  },
  {
    id: "train_your_brain",
    pascalName: "TrainYourBrain",
    component: TrainYourBrainComposition,
    thumbnailComponent: TrainYourBrainThumbnail,
    transcript: train_your_brainTranscript as any[],
  },
  {
    id: "goggins_strategy_system",
    pascalName: "GogginsStrategySystem",
    component: GogginsStrategySystemComposition,
    thumbnailComponent: GogginsStrategySystemThumbnail,
    transcript: goggins_strategy_systemTranscript as any[],
  },
  {
    id: "sleep_debt_trap",
    pascalName: "SleepDebtTrap",
    component: SleepDebtTrapComposition,
    thumbnailComponent: SleepDebtTrapThumbnail,
    transcript: sleep_debt_trapTranscript as any[],
  },
  {
    id: "the_mask_you_mistake",
    pascalName: "TheMaskYouMistake",
    component: TheMaskYouMistakeComposition,
    thumbnailComponent: TheMaskYouMistakeThumbnail,
    transcript: the_mask_you_mistakeTranscript as any[],
  },
  {
    id: "how_to_ruin_your_teens",
    pascalName: "HowToRuinYourTeens",
    component: HowToRuinYourTeensComposition,
    thumbnailComponent: HowToRuinYourTeensThumbnail,
    transcript: how_to_ruin_your_teensTranscript as any[],
  },
  {
    id: "choice_overload",
    pascalName: "ChoiceOverload",
    component: ChoiceOverloadComposition,
    thumbnailComponent: ChoiceOverloadThumbnail,
    transcript: choice_overloadTranscript as any[],
  },
  {
    id: "the_person_you_never_chose",
    pascalName: "ThePersonYouNeverChose",
    component: ThePersonYouNeverChoseComposition,
    thumbnailComponent: ThePersonYouNeverChoseThumbnail,
    transcript: the_person_you_never_choseTranscript as any[],
  },
  {
    id: "brain_tolerance",
    pascalName: "BrainTolerance",
    component: BrainToleranceComposition,
    thumbnailComponent: BrainToleranceThumbnail,
    transcript: brain_toleranceTranscript as any[],
  },
  {
    id: "the_architecture_of_focus",
    pascalName: "TheArchitectureOfFocus",
    component: TheArchitectureOfFocusComposition,
    thumbnailComponent: TheArchitectureOfFocusThumbnail,
    transcript: the_architecture_of_focusTranscript as any[],
  },
  {
    id: "the_law_of_structural_load",
    pascalName: "TheLawOfStructuralLoad",
    component: TheLawOfStructuralLoadComposition,
    thumbnailComponent: TheLawOfStructuralLoadThumbnail,
    transcript: the_law_of_structural_loadTranscript as any[],
  },
  {
    id: "the_threshold_effect",
    pascalName: "TheThresholdEffect",
    component: TheThresholdEffectComposition,
    thumbnailComponent: TheThresholdEffectThumbnail,
    transcript: the_threshold_effectTranscript as any[],
  },
  {
    id: "the_law_of_the_counterweight",
    pascalName: "TheLawOfTheCounterweight",
    component: TheLawOfTheCounterweightComposition,
    thumbnailComponent: TheLawOfTheCounterweightThumbnail,
    transcript: the_law_of_the_counterweightTranscript as any[],
  },
  {
    id: "the_architecture_of_pressure",
    pascalName: "TheArchitectureOfPressure",
    component: TheArchitectureOfPressureComposition,
    thumbnailComponent: TheArchitectureOfPressureThumbnail,
    transcript: the_architecture_of_pressureTranscript as any[],
  },
  {
    id: "open_brain_tabs",
    pascalName: "OpenBrainTabs",
    component: OpenBrainTabsComposition,
    thumbnailComponent: OpenBrainTabsThumbnail,
    transcript: open_brain_tabsTranscript as any[],
  },
  {
    id: "smoke_test_frontier_s",
    pascalName: "SmokeTestFrontierS",
    component: SmokeTestFrontierSComposition,
    thumbnailComponent: SmokeTestFrontierSThumbnail,
    transcript: smoke_test_frontier_sTranscript as any[],
  },
  {
    id: "small_compromises",
    pascalName: "SmallCompromises",
    component: SmallCompromisesComposition,
    thumbnailComponent: SmallCompromisesThumbnail,
    transcript: small_compromisesTranscript as any[],
  },
  {
    id: "how_cortisol_works",
    pascalName: "HowCortisolWorks",
    component: HowCortisolWorksComposition,
    thumbnailComponent: HowCortisolWorksThumbnail,
    transcript: how_cortisol_worksTranscript as any[],
  },
  {
    id: "dopamine_reality",
    pascalName: "DopamineReality",
    component: DopamineRealityComposition,
    thumbnailComponent: DopamineRealityThumbnail,
    transcript: dopamine_realityTranscript as any[],
  },
  {
    id: "what_you_tolerate",
    pascalName: "WhatYouTolerate",
    component: WhatYouTolerateComposition,
    thumbnailComponent: WhatYouTolerateThumbnail,
    transcript: what_you_tolerateTranscript as any[],
  },
  {
    id: "the_art_of_environment",
    pascalName: "TheArtOfEnvironment",
    component: TheArtOfEnvironmentComposition,
    thumbnailComponent: TheArtOfEnvironmentThumbnail,
    transcript: the_art_of_environmentTranscript as any[],
  },
  {
    id: "promises",
    pascalName: "Promises",
    component: PromisesComposition,
    thumbnailComponent: PromisesThumbnail,
    transcript: promisesTranscript as any[],
  },
  {
    id: "patterns",
    pascalName: "Patterns",
    component: PatternsComposition,
    thumbnailComponent: PatternsThumbnail,
    transcript: patternsTranscript as any[],
  },
  {
    id: "teenage",
    pascalName: "Teenage",
    component: TeenageComposition,
    thumbnailComponent: TeenageThumbnail,
    transcript: teenageTranscript as any[],
  },
  {
    id: "environment",
    pascalName: "Environment",
    component: EnvironmentComposition,
    thumbnailComponent: EnvironmentThumbnail,
    transcript: environmentTranscript as any[],
  },
  {
    id: "loneliness",
    pascalName: "Loneliness",
    component: LonelinessComposition,
    thumbnailComponent: LonelinessThumbnail,
    transcript: lonelinessTranscript as any[],
  },
  {
    id: "saying_no",
    pascalName: "SayingNo",
    component: SayingNoComposition,
    thumbnailComponent: SayingNoThumbnail,
    transcript: saying_noTranscript as any[],
  },
  {
    id: "self_doubt",
    pascalName: "SelfDoubt",
    component: SelfDoubtComposition,
    thumbnailComponent: SelfDoubtThumbnail,
    transcript: self_doubtTranscript as any[],
  },
  {
    id: "goggins",
    pascalName: "Goggins",
    component: GogginsComposition,
    thumbnailComponent: GogginsThumbnail,
    transcript: gogginsTranscript as any[],
  },
  {
    id: "breaks",
    pascalName: "Breaks",
    component: BreaksComposition,
    thumbnailComponent: BreaksThumbnail,
    transcript: breaksTranscript as any[],
  },
  {
    id: "strength",
    pascalName: "Strength",
    component: StrengthComposition,
    thumbnailComponent: StrengthThumbnail,
    transcript: strengthTranscript as any[],
  },
  {
    id: "emotions",
    pascalName: "Emotions",
    component: EmotionsComposition,
    thumbnailComponent: EmotionsThumbnail,
    transcript: emotionsTranscript as any[],
  },
  {
    id: "chapters",
    pascalName: "Chapters",
    component: ChaptersComposition,
    thumbnailComponent: ChaptersThumbnail,
    transcript: chaptersTranscript as any[],
  },
];
