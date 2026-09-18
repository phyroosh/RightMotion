import React from "react";
import { MotionStagePlayer } from "../compiler";
import priceOfInactionAST from "../clips/price_of_inaction/motion_ast.json";
import "../style.css";

/**
 * 🎬 MotionStagePlayerShowcase — Live Remotion Runtime Proof of Motion AST
 * Location: src/compositions/MotionStagePlayerShowcase.tsx
 *
 * Demonstrates the direct execution boundary between compiled Motion AST
 * and Remotion's physical rendering engine without disconnected shadow artifacts.
 */
export const MotionStagePlayerShowcase: React.FC = () => {
  return <MotionStagePlayer ast={priceOfInactionAST as any} />;
};
