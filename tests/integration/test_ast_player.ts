#!/usr/bin/env npx tsx
/**
 * 🧪 Test Suite for Motion AST → Remotion Runtime Execution Boundary
 * Location: tests/integration/test_ast_player.ts
 *
 * Verifies:
 *   1. MotionStagePlayer component export and contract integrity.
 *   2. Anti-Cardification Invariants: Zero UI cards or modal boxes.
 *   3. Open-Canvas Architecture: OpenStageSurface & MechanismStage layout.
 *   4. Remotion Still Rendering: Confirms pixel rendering of MotionStageAST
 *      across Hook (f:100), Mechanism (f:450), and Resolution (f:800) scenes.
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import * as compiler from "../../src/compiler";

const ROOT_DIR = path.resolve(__dirname, "../..");
const OUT_DIR = path.join(ROOT_DIR, "out");

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, testName: string, failureDetails?: string) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    if (failureDetails) {
      console.error(`     Details: ${failureDetails}`);
    }
  }
}

async function runTests() {
  console.log("=".repeat(75));
  console.log("🎬 RUNNING MOTION AST → REMOTION EXECUTION BOUNDARY TEST HARNESS");
  console.log("=".repeat(75));

  // -----------------------------------------------------------------
  // 1. Component Export & Types
  // -----------------------------------------------------------------
  console.log("\n[Group 1] Component Export Verification...");
  assert(
    typeof compiler.MotionStagePlayer === "function",
    "MotionStagePlayer exported as valid React component from src/compiler"
  );

  // -----------------------------------------------------------------
  // 2. Anti-Cardification & Open-Stage Code Invariant Checks
  // -----------------------------------------------------------------
  console.log("\n[Group 2] Anti-Cardification & Open-Stage Invariant Checks...");
  const playerCode = fs.readFileSync(
    path.join(ROOT_DIR, "src/compiler/MotionStagePlayer.tsx"),
    "utf-8"
  );

  const BANNED_CARD_PATTERNS = [
    /rounded-3xl\s+bg-white/i,
    /rounded-2xl\s+bg-white.*border/i,
    /TacticalMeme/i,
    /MotionCard/i,
    /PhysicalCard/i,
  ];

  for (const pattern of BANNED_CARD_PATTERNS) {
    assert(
      !pattern.test(playerCode),
      `Anti-Cardification: MotionStagePlayer.tsx does not contain ${pattern}`
    );
  }

  assert(
    playerCode.includes("<OpenStageSurface"),
    "Open-Stage Architecture: MotionStagePlayer wraps composition in OpenStageSurface"
  );

  assert(
    playerCode.includes("<MechanismStage"),
    "Open-Stage Architecture: MotionStagePlayer wraps scenes in MechanismStage safe bounds"
  );

  assert(
    playerCode.includes("<PersistentMemoryStage"),
    "Narrative Memory: MotionStagePlayer mounts PersistentMemoryStage across scenes"
  );

  // -----------------------------------------------------------------
  // 3. Remotion Still Rendering Verification (Live Proof Frames)
  // -----------------------------------------------------------------
  console.log("\n[Group 3] Remotion Proof Still Rendering (3 Proof Frames)...");
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  const proofFrames = [
    { frame: 100, label: "AST Hook Scene with Universal Background" },
    { frame: 450, label: "AST Mechanism Scene with ThresholdBoundary & Cutout" },
    { frame: 800, label: "AST Resolution Scene with Persistent Memory Trace" },
  ];

  for (const proof of proofFrames) {
    const outFile = path.join(OUT_DIR, `proof_ast_player_f${proof.frame}.png`);
    try {
      const cmd = `npx remotion still src/index.ts MotionStagePlayerShowcase "${outFile}" --frame=${proof.frame} --overwrite`;
      execSync(cmd, { stdio: "pipe", cwd: ROOT_DIR });

      assert(fs.existsSync(outFile), `Still [Frame ${proof.frame}]: ${proof.label} generated`);

      if (fs.existsSync(outFile)) {
        const stats = fs.statSync(outFile);
        assert(stats.size > 10000, `Still [Frame ${proof.frame}]: ${proof.label} valid image (${Math.round(stats.size / 1024)} KB)`);
        fs.unlinkSync(outFile); // Cleanup after test
      }
    } catch (err: any) {
      assert(false, `Still [Frame ${proof.frame}]: ${proof.label} render failed`, err.message);
    }
  }

  console.log("\n" + "=".repeat(75));
  console.log(`TEST RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
  console.log("=".repeat(75));

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
