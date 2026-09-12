/**
 * 🚩 RightMotion Feature Flags & Frontier Configuration
 * 
 * Controls active creative frontiers across the video production pipeline:
 * - FRONTIER 1: InfiniteWorldCanvas (Persistent spatial worlds, continuous kinematics) -> ACTIVE
 * - FRONTIER 2: Materiality & Physical Semantics (Material-driven meaning & state mutation) -> ACTIVE
 * - FRONTIER 3: Cinematic Camera Language + Depth (Multi-plane depth, foreground occluders, rack focus) -> DORMANT (Temporarily Disabled)
 */

export const FEATURES = {
  /** Frontier 1: Persistent coordinate-based spatial worlds */
  ENABLE_INFINITE_WORLD_CANVAS_V1: true,

  /** Frontier 2: Physical semantics and materiality */
  ENABLE_MATERIALITY_V2: true,

  /** 
   * Frontier 3: Multi-plane depth stratification, near-lens foreground occluders,
   * and optical rack-focus mechanics.
   * 
   * Set to `false` to make Frontier #3 dormant and fall back to the stable,
   * authoritative pre-Frontier-#3 camera and coordinate system.
   * Set to `true` to re-enable Frontier #3 features with one switch.
   */
  ENABLE_CINEMATIC_CAMERA_V3: false,
} as const;

/**
 * Direct boolean switch for Frontier #3.
 * Change this to `true` to re-enable Frontier #3.
 */
export const ENABLE_CINEMATIC_CAMERA_V3: boolean = FEATURES.ENABLE_CINEMATIC_CAMERA_V3;
