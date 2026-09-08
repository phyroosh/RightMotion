import React from "react";

/**
 * 🌌 TheCortisolInversionBackground
 * Deep Obsidian Void background matching high-end motion graphics references.
 */
export const TheCortisolInversionBackground: React.FC = () => {
  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{
        backgroundColor: "#000000",
        backgroundImage: "radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0.4) 0%, #000000 100%)",
      }}
    />
  );
};
