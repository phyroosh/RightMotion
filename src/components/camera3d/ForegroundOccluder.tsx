import React from "react";

export type OccluderType = "doorway_arch" | "monolithic_pillar" | "aperture_frame";

export interface ForegroundOccluderProps {
  type?: OccluderType;
  /** Width in pixels of the occluder assembly */
  width?: number;
  /** Height in pixels of the occluder assembly */
  height?: number;
  /** Depth color (default: '#090d16') */
  color?: string;
  /** Optional inner aperture width (for doorway or aperture) */
  apertureWidth?: number;
  /** Optional inner aperture height */
  apertureHeight?: number;
  /** Subtitle / annotation on the pillar or jamb */
  label?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 🚪 ForegroundOccluder
 * Near-lens physical architectural geometry that passes in front of the virtual camera.
 * 
 * Creates true 3D spatial volume and physical scale:
 * As the camera dollies horizontally or vertically, the foreground occluder slides
 * across the lens at high relative velocity, momentarily framing or wiping the midground subject.
 */
export const ForegroundOccluder: React.FC<ForegroundOccluderProps> = ({
  type = "doorway_arch",
  width = 980,
  height = 1400,
  color = "#0f172a",
  apertureWidth = 720,
  apertureHeight = 1100,
  label = "THRESHOLD // 01",
  children,
  className = "",
  style = {},
}) => {
  const jambThickness = Math.max(30, (width - apertureWidth) / 2);
  const headerThickness = Math.max(40, height - apertureHeight);

  if (type === "doorway_arch") {
    return (
      <div
        className={`relative pointer-events-none select-none ${className}`}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          ...style,
        }}
      >
        {/* Left Doorway Jamb */}
        <div
          className="absolute left-0 top-0 bottom-0 shadow-[20px_0_40px_rgba(0,0,0,0.15)]"
          style={{
            width: `${jambThickness}px`,
            backgroundColor: color,
            borderRight: "2px solid rgba(255, 255, 255, 0.15)",
          }}
        >
          {label && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 rotate-90 origin-center whitespace-nowrap font-mono text-[14px] font-bold text-slate-400 tracking-widest uppercase">
              {label}
            </div>
          )}
        </div>

        {/* Right Doorway Jamb */}
        <div
          className="absolute right-0 top-0 bottom-0 shadow-[-20px_0_40px_rgba(0,0,0,0.15)]"
          style={{
            width: `${jambThickness}px`,
            backgroundColor: color,
            borderLeft: "2px solid rgba(255, 255, 255, 0.15)",
          }}
        />

        {/* Top Header Beam */}
        <div
          className="absolute top-0 left-0 right-0 shadow-[0_20px_40px_rgba(0,0,0,0.2)] flex items-center justify-center"
          style={{
            height: `${headerThickness}px`,
            backgroundColor: color,
            borderBottom: "2.5px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="font-mono text-[16px] font-black text-white tracking-widest uppercase">
              EVENT BOUNDARY // PHYSICAL THRESHOLD
            </span>
          </div>
        </div>

        {/* Clear Aperture Space */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            left: `${jambThickness}px`,
            right: `${jambThickness}px`,
            top: `${headerThickness}px`,
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  if (type === "monolithic_pillar") {
    return (
      <div
        className={`relative pointer-events-none select-none shadow-[24px_0_60px_rgba(0,0,0,0.25)] ${className}`}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: color,
          borderRight: "3px solid rgba(255, 255, 255, 0.12)",
          ...style,
        }}
      >
        <div className="absolute top-12 left-1/2 -translate-x-1/2 rotate-90 origin-center whitespace-nowrap font-mono text-[16px] font-bold text-slate-400 tracking-widest uppercase">
          {label}
        </div>
        {children}
      </div>
    );
  }

  // aperture_frame
  return (
    <div
      className={`relative pointer-events-none select-none ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        border: `32px solid ${color}`,
        boxShadow: "inset 0 0 40px rgba(0,0,0,0.25), 0 30px 60px rgba(0,0,0,0.18)",
        borderRadius: "40px",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
