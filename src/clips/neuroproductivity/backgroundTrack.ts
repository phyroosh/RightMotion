import { SolidColorKeyframe } from "../../components/SolidBackground";

export const SOLID_BACKGROUND_TRACK: SolidColorKeyframe[] = [
  // 1. Chapter 1: The Productivity Trap (0s - 28.5s) -> Crisp Studio White
  { timeMs: 0, color: "#ffffff", theme: "light" },

  // 2. Chapter 2: The 4 Brain Frameworks (28.5s - 59.5s) -> Obsidian Black
  { timeMs: 28500, color: "#09090b", theme: "dark" },

  // 3. Chapter 3: Advice 01 - Make a Routine (59.5s - 215.0s) -> Crisp Studio White
  { timeMs: 59500, color: "#ffffff", theme: "light" },

  // 4. Chapter 4: Advice 02 - Break It Down (215.0s - 305.0s) -> Slate 900 Dark Charcoal
  { timeMs: 215000, color: "#0f172a", theme: "dark" },

  // 5. Chapter 5: Advice 03 - Use a Calendar (305.0s - 353.0s) -> Crisp Studio White
  { timeMs: 305000, color: "#ffffff", theme: "light" },

  // 6. Chapter 6: Advice 04 - Never Break the Streak (353.0s - 400.0s) -> Obsidian Black
  { timeMs: 353000, color: "#09090b", theme: "dark" },

  // 7. Chapter 7: The Underlying Bottleneck (400.0s - 483.0s) -> Crisp Slate 50 Off-White
  { timeMs: 400000, color: "#f8fafc", theme: "light" },

  // 8. Chapter 8: Fit Strategy to Brain (483.0s - End) -> Crisp Studio White
  { timeMs: 483000, color: "#ffffff", theme: "light" },
];
