import React from "react";

export const HoldingGrudgesBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-[#f8fafc]">
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background: "radial-gradient(circle at 50% 20%, #f1f5f9 0%, #e2e8f0 45%, #cbd5e1 100%)",
        }}
      />
      <div
        className="absolute w-[700px] h-[700px] rounded-full blur-[140px] opacity-25"
        style={{
          background: "radial-gradient(circle, #38bdf8 0%, #6366f1 100%)",
          top: "12%",
          left: "-10%",
        }}
      />
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-20"
        style={{
          background: "radial-gradient(circle, #f43f5e 0%, #fb923c 100%)",
          bottom: "18%",
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
