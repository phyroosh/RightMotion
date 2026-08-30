import React from "react";

export const LonelinessBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-[#f8fafc]">
      {/* Studio Ambient Gradient */}
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(circle at 50% 20%, #f8fafc 0%, #f1f5f9 45%, #e2e8f0 100%)",
        }}
      />

      {/* Subtle Indigo / Rose Ambient Orbs */}
      <div
        className="absolute w-[680px] h-[680px] rounded-full blur-[140px] opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #6366f1 0%, #4338ca 100%)",
          top: "10%",
          left: "-12%",
        }}
      />
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[130px] opacity-18 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #f43f5e 0%, #e11d48 100%)",
          bottom: "18%",
          right: "-10%",
        }}
      />

      {/* Subtle Apple Grid Pattern */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(rgba(15, 23, 42, 0.28) 1.5px, transparent 1.5px)",
          backgroundSize: "36px 36px",
        }}
      />
    </div>
  );
};
