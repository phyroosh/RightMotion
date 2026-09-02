import React from "react";
import { useCurrentFrame } from "remotion";
import { FinanceBackground } from "../../components/finance/FinanceBackground";

export const TheCompoundingTrapBackground: React.FC = () => {
  const frame = useCurrentFrame();
  return <FinanceBackground />;
};
