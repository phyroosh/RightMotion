import { CameraKeyframe } from "../../components/CameraCanvas";

/**
 * Comprehensive After Effects Camera Movement Track
 * Full 16:9 cinematic panning, zooming, tracking, and rotational tilts.
 */
export const CAMERA_TRACK: CameraKeyframe[] = [
  // --- CHAPTER 1: THE PRODUCTIVITY TRAP (0s - 28.5s) ---
  // 0s: Intro Presenter Hook (Center, gentle push-in)
  { timeMs: 0, x: 960, y: 540, zoom: 1.04, rotate: 0 },
  { timeMs: 4000, x: 960, y: 540, zoom: 1.08, rotate: 0 },
  // 4.5s: 3 Advice Cards appear across wide canvas -> Camera pans across
  { timeMs: 4500, x: 800, y: 520, zoom: 1.06, rotate: -0.6 },
  { timeMs: 7200, x: 1120, y: 520, zoom: 1.06, rotate: 0.6 },
  // 11.2s: "Works beautifully for someone else... completely useless for you"
  { timeMs: 11200, x: 960, y: 520, zoom: 1.02, rotate: 0 },
  { timeMs: 14000, x: 960, y: 520, zoom: 1.06, rotate: -0.8 },
  // 17.0s: Presenter Discipline Reframe
  { timeMs: 17000, x: 960, y: 540, zoom: 1.05, rotate: 0 },
  { timeMs: 27000, x: 960, y: 540, zoom: 1.10, rotate: 0.4 },

  // --- CHAPTER 2: THE 4 BRAIN FRAMEWORKS (28.5s - 59.5s) ---
  // 28.5s: Cut to Wide 4-Quadrant Matrix
  { timeMs: 28500, x: 960, y: 520, zoom: 0.98, rotate: 0 },
  // 32.0s: Glide to Top-Right (ADHD)
  { timeMs: 32000, x: 1140, y: 440, zoom: 1.12, rotate: 0.8 },
  // 34.5s: Glide to Bottom-Left (Autism)
  { timeMs: 34500, x: 780, y: 600, zoom: 1.12, rotate: -0.8 },
  // 36.5s: Glide to Bottom-Right (AuDHD)
  { timeMs: 36500, x: 1140, y: 600, zoom: 1.14, rotate: 0.8 },
  // 40.0s: Pull back to Presenter Mid-Shot on Variation & Patterns
  { timeMs: 40000, x: 960, y: 540, zoom: 1.04, rotate: 0 },
  { timeMs: 58000, x: 960, y: 540, zoom: 1.10, rotate: -0.4 },

  // --- CHAPTER 3: ADVICE 01 - MAKE A ROUTINE (59.5s - 215.0s) ---
  // 59.5s: Neurotypical Routine loop (4 steps)
  { timeMs: 59500, x: 960, y: 520, zoom: 1.04, rotate: 0 },
  { timeMs: 70000, x: 960, y: 520, zoom: 1.07, rotate: 0.3 },
  // 72.8s: ADHD 7:00 AM Wall
  { timeMs: 72800, x: 960, y: 530, zoom: 1.05, rotate: -0.5 },
  { timeMs: 85000, x: 960, y: 530, zoom: 1.09, rotate: 0.3 },
  // 99.5s: ADHD Dopamine Engine (5 Levers across widescreen)
  { timeMs: 99500, x: 960, y: 510, zoom: 1.02, rotate: 0 },
  { timeMs: 110000, x: 960, y: 510, zoom: 1.05, rotate: -0.3 },
  // 111.0s: Presenter Different Mechanism
  { timeMs: 111000, x: 960, y: 540, zoom: 1.06, rotate: 0 },
  // 115.6s: Autism Predictability & Uncertainty Removal
  { timeMs: 115600, x: 960, y: 520, zoom: 1.04, rotate: -0.4 },
  { timeMs: 139000, x: 960, y: 520, zoom: 1.07, rotate: 0 },
  // 141.0s: Sensory Load & Reduction Toolkit
  { timeMs: 141000, x: 960, y: 520, zoom: 1.03, rotate: 0.4 },
  { timeMs: 172000, x: 960, y: 520, zoom: 1.06, rotate: -0.3 },
  // 176.0s: AuDHD Dual Tug-of-War Balance
  { timeMs: 176000, x: 960, y: 530, zoom: 1.04, rotate: 0.5 },
  { timeMs: 203000, x: 960, y: 530, zoom: 1.08, rotate: -0.3 },
  // 204.0s: Presenter AuDHD Balance
  { timeMs: 204000, x: 960, y: 540, zoom: 1.05, rotate: 0 },
  { timeMs: 214000, x: 960, y: 540, zoom: 1.10, rotate: 0 },

  // --- CHAPTER 4: ADVICE 02 - BREAK IT DOWN (215.0s - 305.0s) ---
  // 215.0s: Neurotypical vs ADHD Break Down
  { timeMs: 215000, x: 960, y: 520, zoom: 1.04, rotate: -0.4 },
  { timeMs: 252000, x: 960, y: 520, zoom: 1.08, rotate: 0.3 },
  // 253.1s: Autism 4-Step Room Sequence with Edges
  { timeMs: 253100, x: 960, y: 520, zoom: 1.03, rotate: -0.3 },
  { timeMs: 280000, x: 960, y: 520, zoom: 1.06, rotate: 0 },
  // 284.4s: AuDHD Sequence + Playlist/Timer Integration
  { timeMs: 284400, x: 960, y: 530, zoom: 1.05, rotate: 0.4 },
  { timeMs: 304000, x: 960, y: 530, zoom: 1.08, rotate: -0.2 },

  // --- CHAPTER 5: ADVICE 03 - USE A CALENDAR (305.0s - 353.0s) ---
  // 305.0s: ADHD Time Blindness & 2-Tier Calendar
  { timeMs: 305000, x: 960, y: 520, zoom: 1.04, rotate: -0.4 },
  { timeMs: 351000, x: 960, y: 520, zoom: 1.08, rotate: 0.3 },

  // --- CHAPTER 6: ADVICE 04 - NEVER BREAK THE STREAK (353.0s - 400.0s) ---
  // 353.0s: The Broken Habit Chain vs Resilient Return
  { timeMs: 353000, x: 960, y: 520, zoom: 1.04, rotate: -0.5 },
  { timeMs: 387000, x: 960, y: 520, zoom: 1.08, rotate: 0.3 },
  // 388.0s: Presenter Resilient Recovery
  { timeMs: 388000, x: 960, y: 540, zoom: 1.05, rotate: 0 },
  { timeMs: 399000, x: 960, y: 540, zoom: 1.10, rotate: 0 },

  // --- CHAPTER 7: THE UNDERLYING BOTTLENECK (400.0s - 483.0s) ---
  // 400.0s: Behavior In Isolation
  { timeMs: 400000, x: 960, y: 540, zoom: 1.02, rotate: 0 },
  // 429.5s: 4 People Staring at Unfinished Assignment
  { timeMs: 429500, x: 960, y: 520, zoom: 1.02, rotate: -0.3 },
  { timeMs: 445500, x: 960, y: 520, zoom: 1.06, rotate: 0.2 },
  // 446.0s: Presenter Internal Experience
  { timeMs: 446000, x: 960, y: 540, zoom: 1.05, rotate: 0 },
  // 465.0s: The 5 Bottleneck Levers
  { timeMs: 465000, x: 960, y: 510, zoom: 1.02, rotate: 0.3 },
  { timeMs: 482000, x: 960, y: 510, zoom: 1.05, rotate: -0.2 },

  // --- CHAPTER 8: FIT STRATEGY TO BRAIN (483.0s - 530.68s) ---
  // 483.0s: Presenter Finale
  { timeMs: 483000, x: 960, y: 540, zoom: 1.02, rotate: 0 },
  { timeMs: 514000, x: 960, y: 540, zoom: 1.06, rotate: 0 },
  // 514.8s: "What is your brain struggling with here?" -> Punch in on Judy
  { timeMs: 514800, x: 960, y: 520, zoom: 1.10, rotate: 0 },
  { timeMs: 530680, x: 960, y: 520, zoom: 1.14, rotate: 0 },
];
