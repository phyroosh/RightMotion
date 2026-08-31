import React from "react";

export const ShrinkingCircleBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-[#f8fafc]">
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background: "radial-gradient(circle at 50% 20%, #f1f5f9 0%, #e2e8f0 45%, #cbd5e1 100%)",
        }}
      />
      <div
        className="absolute w-[750px] h-[750px] rounded-full blur-[140px] opacity-25"
        style={{
          background: "radial-gradient(circle, #38bdf8 0%, #6366f1 100%)",
          top: "10%",
          left: "-10%",
        }}
      />
      <div
        className="absolute w-[650px] h-[650px] rounded-full blur-[120px] opacity-20"
        style={{
          background: "radial-gradient(circle, #10b981 0%, #06b6d4 100%)",
          bottom: "15%",
          right: "-10%",
        }}
      />
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: "radial-gradient(rgba(15, 23, 42, 0.3) 1.5px, transparent 1.5px)",
          backgroundSize: "36px 36px",
        }}
      />
    </div>
  );
};
