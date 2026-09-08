import React from "react";

export interface StudioDepthPropsProps {
  className?: string;
  opacity?: number;
}

/**
 * 🌟 StudioDepthProps
 * Out-of-focus peripheral studio props (faceted 3D stars & geometric stones).
 * Creates the signature cinema prime lens shallow depth-of-field seen in reference video frames 1, 10, 18.
 */
export const StudioDepthProps: React.FC<StudioDepthPropsProps> = ({
  className = "",
  opacity = 0.58,
}) => {
  return (
    <div
      className={`absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden ${className}`}
      style={{ opacity }}
    >
      {/* 1. Top-Right Faceted Star Prop (Heavy bokeh blur) */}
      <div
        className="absolute -top-12 -right-12 pointer-events-none"
        style={{
          width: 380,
          height: 380,
          filter: "blur(12px) drop-shadow(0 20px 30px rgba(0,0,0,0.15))",
          transform: "rotate(18deg)",
        }}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Faceted 8-point geometric origami star */}
          <polygon points="100,10 120,70 180,60 135,100 180,140 120,130 100,190 80,130 20,140 65,100 20,60 80,70" fill="#2d3748" />
          {/* Facet shading */}
          <polygon points="100,10 120,70 100,100" fill="#1a202c" />
          <polygon points="180,60 135,100 100,100" fill="#4a5568" />
          <polygon points="180,140 120,130 100,100" fill="#2d3748" />
          <polygon points="100,190 80,130 100,100" fill="#1a202c" />
          <polygon points="20,140 65,100 100,100" fill="#4a5568" />
          <polygon points="20,60 80,70 100,100" fill="#2d3748" />
        </svg>
      </div>

      {/* 2. Bottom-Left Faceted Star Prop (Foreground bokeh blur) */}
      <div
        className="absolute -bottom-24 -left-20 pointer-events-none"
        style={{
          width: 480,
          height: 480,
          filter: "blur(16px) drop-shadow(0 25px 40px rgba(0,0,0,0.20))",
          transform: "rotate(-12deg)",
        }}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <polygon points="100,10 120,70 180,60 135,100 180,140 120,130 100,190 80,130 20,140 65,100 20,60 80,70" fill="#2d3748" />
          <polygon points="100,10 120,70 100,100" fill="#1a202c" />
          <polygon points="180,60 135,100 100,100" fill="#4a5568" />
          <polygon points="180,140 120,130 100,100" fill="#2d3748" />
          <polygon points="100,190 80,130 100,100" fill="#1a202c" />
          <polygon points="20,140 65,100 100,100" fill="#4a5568" />
          <polygon points="20,60 80,70 100,100" fill="#2d3748" />
        </svg>
      </div>
    </div>
  );
};
