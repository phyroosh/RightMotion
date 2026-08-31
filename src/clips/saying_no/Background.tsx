import React from "react";

export const SayingNoBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-[#f8fafc]">
      {/* Studio Radial Backdrop Light */}
      <div
        className="absolute inset-0 opacity-95"
        style={{
          background: "radial-gradient(circle at 50% 25%, #ffffff 0%, #f1f5f9 55%, #e2e8f0 100%)",
        }}
      />

      {/* Top Rose Amber Ambient Glow */}
      <div
        className="absolute w-[700px] h-[700px] rounded-full blur-[150px] opacity-25"
        style={{
          background: "radial-gradient(circle, #f43f5e 0%, #fb7185 60%, transparent 80%)",
          top: "10%",
          left: "-15%",
        }}
      />

      {/* Bottom Right Indigo Glow */}
      <div
        className="absolute w-[650px] h-[650px] rounded-full blur-[140px] opacity-20"
        style={{
          background: "radial-gradient(circle, #6366f1 0%, #3b82f6 60%, transparent 80%)",
          bottom: "15%",
          right: "-10%",
        }}
      />

      {/* Apple Studio Geometric Dot Grid */}
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: "radial-gradient(rgba(15, 23, 42, 0.35) 1.5px, transparent 1.5px)",
          backgroundSize: "36px 36px",
        }}
      />
    </div>
  );
};
