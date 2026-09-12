import React from "react";

export interface BedrockFoundationProps {
  width?: number;
  height?: number;
  y?: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const BedrockFoundation: React.FC<BedrockFoundationProps> = ({
  width = 1080,
  height = 440,
  y = 1760,
  children,
  className = "",
  style = {},
}) => {
  return (
    <div
      className={`absolute left-0 select-none z-10 ${className}`}
      style={{
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        ...style,
      }}
    >
      {/* 1. Top Impact Rail / Curb */}
      <div className="w-full h-8 bg-[#1e293b] border-y-4 border-slate-950 flex items-center justify-between px-8 relative shadow-2xl">
        {/* Specular Edge Highlight */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-slate-300/40" />

        {/* Hazard Safety Chevrons */}
        <div
          className="w-full h-full opacity-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 15px, #f59e0b 15px, #f59e0b 30px)",
          }}
        />

        {/* Heavy Foundation Anchor Bolts */}
        <div className="absolute inset-x-12 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={i}
              className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-600 shadow-inner"
            />
          ))}
        </div>
      </div>

      {/* 2. Monolithic Granite Substrate (Ground Bedrock) */}
      <div
        className="w-full h-[calc(100%-32px)] bg-[#070b12] border-x-4 border-b-4 border-slate-950 p-6 flex flex-col justify-between relative shadow-[0_-20px_50px_rgba(0,0,0,0.9)]"
        style={{
          backgroundImage:
            "linear-gradient(180deg, #0d1422 0%, #060911 60%, #030509 100%)",
        }}
      >
        {/* Subtle Bedrock Fissures / Mineral Strata */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 50% 0%, rgba(34, 211, 238, 0.15) 0%, transparent 70%)",
          }}
        />

        {/* Optional Content Mounted Directly onto Foundation */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
};
