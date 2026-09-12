import React from "react";
import { ElementImportance } from "../../platform/types";

interface SafeContentProps extends React.HTMLAttributes<HTMLDivElement> {
  importance?: ElementImportance;
  children: React.ReactNode;
  as?: React.ElementType;
  debugHighlight?: boolean;
}

/**
 * 🎬 SafeContent
 *
 * Semantic layout wrapper classifying visual elements by importance:
 *   - "critical": MUST remain completely inside platform safe zones (Headlines, key metrics, core metaphor)
 *   - "important": Preferably clear of major obstruction zones (Supporting labels, annotations)
 *   - "decorative": Allowed to touch caution/edge zones (Particles, ambient glows, background illustrations)
 */
export const SafeContent: React.FC<SafeContentProps> = ({
  importance = "important",
  children,
  as: Component = "div",
  className = "",
  debugHighlight = false,
  style,
  ...rest
}) => {
  const isDebug =
    debugHighlight ||
    (typeof process !== "undefined" &&
      process.env &&
      process.env.REMOTION_DEBUG_SAFE === "1");

  const debugClasses = isDebug
    ? importance === "critical"
      ? "outline-2 outline-emerald-500 relative"
      : importance === "important"
      ? "outline-2 outline-amber-500 relative"
      : "outline-1 outline-slate-400 relative"
    : "";

  return (
    <Component
      data-importance={importance}
      className={`${debugClasses} ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </Component>
  );
};
