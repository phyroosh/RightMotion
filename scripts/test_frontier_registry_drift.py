#!/usr/bin/env python3
"""
🎬 Phase 4 Drift Test: Frontier Registry Single Source of Truth

Verifies that:
1. src/orchestrator/frontier_manifest.json is the authoritative Single Source of Truth.
2. Python runtime projection (scripts/orchestrator_registry.py) strictly matches the manifest.
3. TypeScript runtime projection (src/orchestrator/registry.ts) strictly matches the manifest.
4. F3 (Cinematic Camera) is strictly DORMANT_EXPERIMENTAL across manifest, Python, and TypeScript.
5. All 10 frontier codes exist across all three representations with zero drift.
"""

import unittest
import json
import subprocess
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
MANIFEST_PATH = ROOT_DIR / "src" / "orchestrator" / "frontier_manifest.json"

EXPECTED_FRONTIER_CODES = {
    "F_BASE",
    "F0",
    "F1",
    "F2",
    "F3",
    "F4",
    "F5",
    "F6",
    "F7",
    "F_UBG",
}


class TestFrontierRegistryDrift(unittest.TestCase):
    def setUp(self):
        self.assertTrue(MANIFEST_PATH.is_file(), f"Manifest file missing: {MANIFEST_PATH}")
        with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
            self.manifest_data = json.load(f)
        self.manifest_frontiers = self.manifest_data.get("frontiers", {})

        from orchestrator_registry import FRONTIER_REGISTRY
        self.py_registry = FRONTIER_REGISTRY

    def test_01_manifest_codes_complete(self):
        """Manifest contains exact expected set of 10 creative frontiers."""
        manifest_codes = set(self.manifest_frontiers.keys())
        self.assertEqual(
            manifest_codes,
            EXPECTED_FRONTIER_CODES,
            f"Manifest keys drift! Difference: {manifest_codes ^ EXPECTED_FRONTIER_CODES}"
        )

    def test_02_f3_strictly_dormant(self):
        """F3 must be strictly DORMANT_EXPERIMENTAL in the canonical manifest."""
        f3 = self.manifest_frontiers.get("F3", {})
        self.assertEqual(
            f3.get("status"),
            "DORMANT_EXPERIMENTAL",
            "F3 status in manifest must be strictly DORMANT_EXPERIMENTAL"
        )
        self.assertEqual(
            self.py_registry.get("F3", {}).get("status"),
            "DORMANT_EXPERIMENTAL",
            "F3 status in Python registry must be strictly DORMANT_EXPERIMENTAL"
        )

    def test_03_python_projection_exact_match(self):
        """Python projection matches manifest frontiers without addition or omission."""
        py_codes = set(self.py_registry.keys())
        manifest_codes = set(self.manifest_frontiers.keys())
        self.assertEqual(py_codes, manifest_codes, "Python registry keys do not match manifest keys")

        for code, manifest_cap in self.manifest_frontiers.items():
            py_cap = self.py_registry[code]

            # Core scalar identities
            self.assertEqual(py_cap["id"], manifest_cap["id"], f"ID mismatch on {code}")
            self.assertEqual(py_cap["code"], manifest_cap["code"], f"Code mismatch on {code}")
            self.assertEqual(py_cap["name"], manifest_cap["name"], f"Name mismatch on {code}")
            self.assertEqual(py_cap["status"], manifest_cap["status"], f"Status mismatch on {code}")
            self.assertEqual(py_cap["purpose"], manifest_cap["purpose"], f"Purpose mismatch on {code}")

            # Weights and costs (camelCase in manifest, snake_case + camelCase in py_cap)
            self.assertEqual(py_cap["complexity_weight"], manifest_cap["complexityWeight"], f"Complexity weight mismatch on {code}")
            self.assertEqual(py_cap["complexityWeight"], manifest_cap["complexityWeight"], f"ComplexityWeight camelCase mismatch on {code}")
            self.assertEqual(py_cap["performance_cost"], manifest_cap["performanceCost"], f"Performance cost mismatch on {code}")
            self.assertEqual(py_cap["mobile_risk"], manifest_cap["mobileRisk"], f"Mobile risk mismatch on {code}")
            self.assertEqual(py_cap["default_intensity"], manifest_cap["defaultIntensity"], f"Default intensity mismatch on {code}")

            # Array attributes
            self.assertEqual(py_cap["creative_strengths"], manifest_cap["creativeStrengths"], f"Creative strengths mismatch on {code}")
            self.assertEqual(py_cap["best_use_situations"], manifest_cap["bestUseSituations"], f"Best use mismatch on {code}")
            self.assertEqual(py_cap["anti_use_situations"], manifest_cap["antiUseSituations"], f"Anti use mismatch on {code}")
            self.assertEqual(py_cap["dependencies"], manifest_cap["dependencies"], f"Dependencies mismatch on {code}")
            self.assertEqual(py_cap["exported_components"], manifest_cap["exportedComponents"], f"Exported components mismatch on {code}")
            self.assertEqual(py_cap["synergistic_with"], manifest_cap["synergisticWith"], f"Synergistic mismatch on {code}")
            self.assertEqual(py_cap["conflicts_with"], manifest_cap["conflictsWith"], f"Conflicts mismatch on {code}")

    def test_04_typescript_projection_parity(self):
        """TypeScript projection matches manifest frontiers without drift."""
        ts_script = """
        import { FRONTIER_REGISTRY } from './src/orchestrator/registry';
        console.log(JSON.stringify(FRONTIER_REGISTRY));
        """
        res = subprocess.run(
            ["npx", "tsx", "-e", ts_script],
            cwd=str(ROOT_DIR),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=True
        )
        ts_registry = json.loads(res.stdout.strip())
        ts_codes = set(ts_registry.keys())
        manifest_codes = set(self.manifest_frontiers.keys())

        self.assertEqual(ts_codes, manifest_codes, f"TypeScript registry keys drift from manifest: {ts_codes ^ manifest_codes}")

        for code, manifest_cap in self.manifest_frontiers.items():
            ts_cap = ts_registry[code]
            self.assertEqual(ts_cap["id"], manifest_cap["id"], f"TS ID mismatch on {code}")
            self.assertEqual(ts_cap["name"], manifest_cap["name"], f"TS Name mismatch on {code}")
            self.assertEqual(ts_cap["status"], manifest_cap["status"], f"TS Status mismatch on {code}")
            self.assertEqual(ts_cap["complexityWeight"], manifest_cap["complexityWeight"], f"TS Complexity weight mismatch on {code}")
            self.assertEqual(ts_cap["performanceCost"], manifest_cap["performanceCost"], f"TS Performance cost mismatch on {code}")
            self.assertEqual(ts_cap["exportedComponents"], manifest_cap["exportedComponents"], f"TS Exported components mismatch on {code}")

    def test_05_f_ubg_parity(self):
        """F_UBG (Universal Background Intelligence) is fully unified in Python and TypeScript."""
        self.assertIn("F_UBG", self.manifest_frontiers)
        self.assertIn("F_UBG", self.py_registry)
        ubg = self.py_registry["F_UBG"]
        self.assertEqual(ubg["name"], "Universal Background Intelligence")
        self.assertEqual(ubg["status"], "ACTIVE")
        self.assertIn("UniversalBackground", ubg["exported_components"])


if __name__ == "__main__":
    unittest.main(verbosity=2)
