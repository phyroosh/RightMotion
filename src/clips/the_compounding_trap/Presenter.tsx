import React from "react";
import { CharacterKeyframeAnimator, KeyframePoint } from "../../components/CharacterKeyframeAnimator";

interface PresenterProps {
  currentMs: number;
}

/**
 * Finance Channel: No human presenter — Apex Wealth channel uses pure motion
 * graphics with dark luxury aesthetics. Presenter is intentionally not shown.
 */
export const TheCompoundingTrapPresenter: React.FC<PresenterProps> = ({ currentMs }) => {
  // Finance channel uses pure motion graphics, no presenter character
  return null;
};
