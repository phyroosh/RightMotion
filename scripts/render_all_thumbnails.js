const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.resolve(__dirname, '..', 'out');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// Map video filename to thumbnail Still composition ID
const THUMBNAIL_MAP = {
  'neuroproductivity_video.mp4': 'NeuroproductivityThumbnail',
  'procrastination_video.mp4': 'ProcrastinationThumbnail',
  'lofi_song_video.mp4': 'LofiSongThumbnail',
  'adhd_video.mp4': 'ADHDThumbnail',
  'goggins_video.mp4': 'GogginsThumbnail',
  'breaks_video.mp4': 'BreaksThumbnail',
  'motivation_video.mp4': 'MotivationThumbnail',
  'maturity_video.mp4': 'MaturityThumbnail',
  'comparison_video.mp4': 'ComparisonThumbnail',
  'habit_video.mp4': 'HabitThumbnail',
  'emotions_video.mp4': 'EmotionsThumbnail',
  'strength_video.mp4': 'StrengthThumbnail',
  'chapters_video.mp4': 'ChaptersThumbnail',
  'promises_video.mp4': 'PromisesThumbnail',
  'the_threshold_effect_video.mp4': 'TheThresholdEffectThumbnail',
  'the_law_of_structural_load_video.mp4': 'TheLawOfStructuralLoadThumbnail',
  'the_architecture_of_focus_video.mp4': 'TheArchitectureOfFocusThumbnail',
  'brain_tolerance_video.mp4': 'BrainToleranceThumbnail',
  'the_person_you_never_chose_video.mp4': 'ThePersonYouNeverChoseThumbnail',
  'choice_overload_video.mp4': 'ChoiceOverloadThumbnail',
  'how_to_ruin_your_teens_video.mp4': 'HowToRuinYourTeensThumbnail',
  'the_mask_you_mistake_video.mp4': 'TheMaskYouMistakeThumbnail',
  'sleep_debt_trap_video.mp4': 'SleepDebtTrapThumbnail',
  'goggins_strategy_system_video.mp4': 'GogginsStrategySystemThumbnail',
  'train_your_brain_video.mp4': 'TrainYourBrainThumbnail',
  'the_self_image_trap_video.mp4': 'TheSelfImageTrapThumbnail',
  'the_truth_about_sleep_video.mp4': 'TheTruthAboutSleepThumbnail',
  'cortisol_energy_engine_video.mp4': 'CortisolEnergyEngineThumbnail',
  'the_cortisol_inversion_video.mp4': 'TheCortisolInversionThumbnail',
  'the_procrastination_loop_video.mp4': 'TheProcrastinationLoopThumbnail',
  'true_relationships_video.mp4': 'TrueRelationshipsThumbnail',
  'stop_comparing_video.mp4': 'StopComparingThumbnail',
  'teenage_relationships_video.mp4': 'TeenageRelationshipsThumbnail',
  'test_autonomous_mode_b_video.mp4': 'TestAutonomousModeBThumbnail',
  'test_autonomous_mode_a_video.mp4': 'TestAutonomousModeAThumbnail',
  'you_are_not_alone_video.mp4': 'YouAreNotAloneThumbnail',
  'map_the_gap_video.mp4': 'MapTheGapThumbnail',
  'photon_minimum_viable_day_video.mp4': 'PhotonMinimumViableDayThumbnail',
  'photon_dopamine_worksheet_video.mp4': 'PhotonDopamineWorksheetThumbnail',
  'holding_grudges_video.mp4': 'HoldingGrudgesThumbnail',
  'shrinking_circle_video.mp4': 'ShrinkingCircleThumbnail',
  'dopamine_reset_video.mp4': 'DopamineResetThumbnail',
  'boundaries_video.mp4': 'BoundariesThumbnail',
  'patterns_video.mp4': 'PatternsThumbnail',
  'teenage_video.mp4': 'TeenageThumbnail',
  'environment_video.mp4': 'EnvironmentThumbnail',
  'loneliness_video.mp4': 'LonelinessThumbnail',
  'saying_no_video.mp4': 'SayingNoThumbnail',
};

// Target single video or all
const targetArg = process.argv[2];

async function main() {
  console.log('\n=============================================================');
  console.log('🎨 RightMotion Automated High-Converting Thumbnail Engine');
  console.log('=============================================================\n');

  let entries = Object.entries(THUMBNAIL_MAP);
  if (targetArg) {
    entries = entries.filter(
      ([video, id]) =>
        video.toLowerCase().includes(targetArg.toLowerCase()) ||
        id.toLowerCase().includes(targetArg.toLowerCase())
    );
    if (entries.length === 0) {
      console.error(`❌ No thumbnail found matching: "${targetArg}"`);
      console.log('Available thumbnails:', Object.keys(THUMBNAIL_MAP).join(', '));
      process.exit(1);
    }
  }

  for (const [videoFile, stillId] of entries) {
    const baseName = videoFile.replace(/\.mp4$/i, '');
    const outThumbnailPath = path.join(OUT_DIR, `${baseName}_thumbnail.png`);

    console.log(`🖼️ Rendering Thumbnail: [${stillId}] -> out/${baseName}_thumbnail.png...`);
    const startTime = Date.now();

    try {
      const cmd = `npx remotion still src/index.ts ${stillId} "${outThumbnailPath}" --overwrite`;
      execSync(cmd, { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      const stat = fs.statSync(outThumbnailPath);
      const sizeKb = (stat.size / 1024).toFixed(1);
      console.log(`✅ [${stillId}] Rendered successfully in ${elapsed}s (${sizeKb} KB)\n`);
    } catch (err) {
      console.error(`❌ Failed to render ${stillId}:`, err.message);
    }
  }

  console.log('🎉 All requested thumbnails rendered successfully in out/!\n');
}

main().catch(console.error);