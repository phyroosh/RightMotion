import React from "react";

export const EmotionallyExpensiveBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#f8fafc] select-none pointer-events-none">
      {/* 1. Subtle studio radial illumination */}
      <div
        className="absolute left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[1400px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(248, 250, 252, 0.8) 50%, rgba(241, 245, 249, 1) 100%)",
        }}
      />

      {/* 2. Crisp subtle architectural grid */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* 3. Subtle edge vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: "inset 0 0 160px rgba(15, 23, 42, 0.04)",
        }}
      />
    </div>
  );
};
