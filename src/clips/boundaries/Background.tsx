import React from "react";

export const BoundariesBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-[#f8fafc]">
      {/* 1. Base Subtle Radial Gradient */}
      <div
        className="absolute inset-0 opacity-95"
        style={{
          background: "radial-gradient(circle at 50% 25%, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%)",
        }}
      />

      {/* 2. Top-Left Ambient Emerald Orb */}
      <div
        className="absolute w-[700px] h-[700px] rounded-full blur-[140px] opacity-25 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #10b981 0%, #059669 100%)",
          top: "10%",
          left: "-15%",
        }}
      />

      {/* 3. Top-Right Ambient Indigo Orb */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[130px] opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #6366f1 0%, #4338ca 100%)",
          top: "30%",
          right: "-15%",
        }}
      />

      {/* 4. Fine High-Tech Dot Matrix Grid Overlay */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(15, 23, 42, 0.35) 1.5px, transparent 1.5px)",
          backgroundSize: "36px 36px",
        }}
      />
    </div>
  );
};

