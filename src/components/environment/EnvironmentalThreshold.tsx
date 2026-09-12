import React from "react";

export interface EnvironmentalThresholdProps {
  width?: number;
  height?: number;
  thickness?: number;
  label?: string;
  isOpen?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 🚪 EnvironmentalThreshold
 * An architectural frame that delineates the boundary between two world chambers.
 * When the camera passes through, it signifies a conceptual transition.
 */
export const EnvironmentalThreshold: React.FC<EnvironmentalThresholdProps> = ({
  width = 120,
  height = 800,
  thickness = 40,
  label,
  isOpen = true,
  children,
  className = "",
  style = {},
}) => {
  return (
    <div
      className={`relative flex flex-col justify-between ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        ...style,
      }}
    >
      {/* Top Lintel */}
      <div 
        className="relative w-full bg-slate-900 border-[2.5px] border-slate-950 shadow-lg z-20 flex items-center justify-center"
        style={{ height: `${thickness}px` }}
      >
        {label && (
          <div className="absolute -top-8 font-mono text-[12px] font-bold text-slate-400 tracking-[0.3em] uppercase">
            {label}
          </div>
        )}
      </div>

      {/* Pillars */}
      <div className="flex-1 flex justify-between w-full relative z-10">
        <div className="h-full bg-slate-800 border-x-[2.5px] border-slate-950 shadow-inner" style={{ width: `${thickness}px` }} />
        <div className="h-full bg-slate-800 border-x-[2.5px] border-slate-950 shadow-inner" style={{ width: `${thickness}px` }} />
        
        {/* Force Field / Glass / Blockade if not open */}
        {!isOpen && (
          <div className="absolute inset-0 mx-auto w-[calc(100%-80px)] bg-cyan-900/40 backdrop-blur-sm border-2 border-cyan-400/50 shadow-[0_0_30px_rgba(34,211,238,0.2)]" />
        )}
      </div>

      {/* Bottom Sill */}
      <div 
        className="relative w-full bg-slate-900 border-[2.5px] border-slate-950 shadow-lg z-20"
        style={{ height: `${thickness}px` }}
      />
      
      <div className="absolute inset-0 z-30 pointer-events-none">
        {children}
      </div>
    </div>
  );
};
