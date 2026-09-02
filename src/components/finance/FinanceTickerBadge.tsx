import React from "react";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

export interface FinanceTickerBadgeProps {
  label: string;
  value: string;
  type?: "gain" | "loss" | "neutral";
  className?: string;
}

/**
 * 🏷️ FinanceTickerBadge
 * Wall Street ticker style telemetry pill for live financial statistics.
 */
export const FinanceTickerBadge: React.FC<FinanceTickerBadgeProps> = ({
  label,
  value,
  type = "gain",
  className = "",
}) => {
  const isGain = type === "gain";
  const isLoss = type === "loss";

  const colorStyle = isGain
    ? "bg-emerald-950/80 border-emerald-500/50 text-emerald-300"
    : isLoss
    ? "bg-rose-950/80 border-rose-500/50 text-rose-300"
    : "bg-amber-950/80 border-amber-500/50 text-amber-300";

  return (
    <div
      className={`inline-flex items-center gap-3 px-6 py-2.5 rounded-full border-2 backdrop-blur-xl shadow-xl font-mono select-none ${colorStyle} ${className}`}
    >
      {isGain && <TrendingUp className="w-6 h-6 text-emerald-400 animate-pulse" />}
      {isLoss && <TrendingDown className="w-6 h-6 text-rose-400" />}
      <span className="text-xl font-black uppercase tracking-wider">{label}</span>
      <span className="text-2xl font-black">{value}</span>
    </div>
  );
};
