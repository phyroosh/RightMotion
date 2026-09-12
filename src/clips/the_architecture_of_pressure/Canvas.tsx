import React from "react";
import { interpolate, staticFile, useCurrentFrame } from "remotion";
import { WordTimestamp } from "../../types";
import { CinematicIllustrationCard } from "../../components/CinematicIllustrationCard";
import {
  InfiniteWorldCanvas,
  WorldWaypoint,
  WorldEntity,
} from "../../components/camera3d/InfiniteWorldCanvas";
import {
  MonolithicCantilever,
  BedrockFoundation,
} from "../../components/environment";

interface CanvasProps {
  transcript: WordTimestamp[];
}

export const TheArchitectureOfPressureCanvas: React.FC<CanvasProps> = ({
  transcript,
}) => {
  const frame = useCurrentFrame();
  void transcript;

  // ========================================================
  // CAMERA WAYPOINTS (MOBILE-FIRST VERTICAL CHOREOGRAPHY)
  // ========================================================
  const waypoints: WorldWaypoint[] = [
    // 1. Hook (Bedrock Foundation + Judy + Illustration) - Holds until frame 85!
    { frame: 0, x: 540, y: 1680, zoom: 1.0 },
    { frame: 85, x: 540, y: 1680, zoom: 1.0 },

    // 2. Crane Up to the Pristine Overhang (Frames 85 -> 240)
    {
      frame: 240,
      x: 540,
      y: 680,
      zoom: 1.05,
      durationFrames: 155,
      transitionType: "smooth",
    },

    // 3. Holds as Load 1 & 2 drop (Frames 240 -> 720)
    {
      frame: 320,
      x: 540,
      y: 680,
      zoom: 1.05,
      durationFrames: 60,
      transitionType: "smooth",
    },
    {
      frame: 640,
      x: 540,
      y: 700,
      zoom: 1.05,
      durationFrames: 60,
      transitionType: "smooth",
    },

    // 4. Push-in to the Tearing Anchor Joint / Fissures (Frames 750 -> 1050)
    {
      frame: 750,
      x: 430,
      y: 680,
      zoom: 1.22,
      durationFrames: 140,
      transitionType: "smooth",
    },

    // 5. Tension Freeze / Dramatic Breath-Hold (Frames 1100 -> 1170)
    { frame: 1100, x: 430, y: 680, zoom: 1.22 },

    // 6. Catastrophic Shear Snap (Frame 1171) & Plunge Downward
    {
      frame: 1171,
      x: 540,
      y: 1480,
      zoom: 0.95,
      durationFrames: 74,
      transitionType: "smooth",
    },

    // 7. Crash Site & Rebound (Frame 1245 -> 1480)
    { frame: 1245, x: 540, y: 1480, zoom: 0.95 },

    // 8. Reframe to Unified Environmental Memory (Frames 1480 -> 1935)
    {
      frame: 1480,
      x: 540,
      y: 1220,
      zoom: 0.78,
      durationFrames: 110,
      transitionType: "smooth",
    },
  ];

  // Camera impacts (Haptic screen shake on structural breaks)
  const impacts = [
    { frame: 1171, intensity: 32, durationFrames: 18 }, // Catastrophic shear snap
    { frame: 1245, intensity: 22, durationFrames: 14 }, // Bedrock crash impact
  ];

  // ========================================================
  // ATMOSPHERIC INDUSTRIAL TEST CHAMBER BACKGROUND
  // ========================================================
  const Background = (
    <div className="absolute inset-0 bg-[#050810] select-none overflow-hidden">
      {/* Subtle Studio Radial Glow centered on the Cantilever */}
      <div
        className="absolute left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full opacity-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(34,211,238,0.2) 0%, rgba(15,23,42,0.1) 50%, transparent 75%)",
        }}
      />

      {/* Massive Vertical Background Structural Pilasters */}
      <div className="absolute inset-0 flex justify-between px-6 pointer-events-none opacity-20">
        <div className="w-12 h-full bg-[#0e1626] border-x border-slate-700" />
        <div className="w-12 h-full bg-[#0e1626] border-x border-slate-700" />
      </div>

      {/* Atmospheric Elevation Level Lines */}
      <div className="absolute inset-0 flex flex-col justify-between py-24 opacity-10 pointer-events-none">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="w-full h-[1px] bg-slate-400" />
        ))}
      </div>
    </div>
  );

  return (
    <div className="absolute inset-0 bg-[#050810] select-none">
      <InfiniteWorldCanvas
        className="!bg-transparent !text-slate-100"
        waypoints={waypoints}
        background={Background}
        showGrid={false}
        impacts={impacts}
      >
        {/* ======================================================== */}
        {/* UNIFIED VERTICAL TEST CHAMBER (X=540, Y=1200)           */}
        {/* Coordinates: 1080px wide x 2400px tall                  */}
        {/* ======================================================== */}
        <WorldEntity worldX={540} worldY={1200} width={1080} height={2400}>
          <div className="relative w-full h-full">
            {/* 1. THE MONOLITHIC CANTILEVER & CRASH WRECKAGE */}
            <MonolithicCantilever
              wallX={160}
              anchorY={680}
              girderWidth={840}
              girderHeight={260}
              shearFrame={1171}
              crashFrame={1245}
              floorY={1620}
              loads={[
                {
                  id: "load-1",
                  mass: 450,
                  landFrame: 280,
                  distanceX: 300,
                  title: "RESPONSIBILITY",
                  metric: "450 kN",
                },
                {
                  id: "load-2",
                  mass: 850,
                  landFrame: 600,
                  distanceX: 520,
                  title: "EXPECTATIONS",
                  metric: "850 kN",
                },
              ]}
            />

            {/* 2. HOOK HERO CARD (WORLD Y=1260, FRAMES 0 -> 90) */}
            {frame < 120 && (
              <div
                className="absolute z-40 flex flex-col items-center pointer-events-none"
                style={{
                  left: "540px",
                  top: "1260px",
                  transform: "translate(-50%, -50%)",
                  opacity: interpolate(frame, [70, 95], [1, 0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              >
                <CinematicIllustrationCard
                  imageSrc={staticFile(
                    "the_architecture_of_pressure/assets/scene_illustration.png"
                  )}
                  width={860}
                  height={480}
                />
              </div>
            )}

            {/* 3. THE BEDROCK FOUNDATION SLAB (Y=1620 -> 2200) */}
            <BedrockFoundation width={1080} height={580} y={1620} />

            {/* 3. ENVIRONMENTAL MEMORY: CLOSING DECISIVE STATEMENT (FRAMES > 1580) */}
            {frame > 1580 && (
              <div
                className="absolute z-50 flex flex-col items-center justify-center text-center pointer-events-none"
                style={{
                  left: "90px",
                  top: "980px", // Centered right inside the empty sheared chasm!
                  width: "900px",
                }}
              >
                <div
                  className="font-black text-6xl text-white tracking-tighter uppercase drop-shadow-[0_15px_30px_rgba(0,0,0,0.95)]"
                  style={{
                    opacity: interpolate(frame, [1580, 1620], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }),
                    transform: `translateY(${interpolate(
                      frame,
                      [1580, 1620],
                      [20, 0],
                      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                    )}px)`,
                  }}
                >
                  NOT A FADE.
                </div>

                <div
                  className="font-black text-7xl text-rose-500 tracking-tighter uppercase mt-4 drop-shadow-[0_15px_35px_rgba(239,68,68,0.4)]"
                  style={{
                    opacity: interpolate(frame, [1680, 1720], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }),
                    transform: `translateY(${interpolate(
                      frame,
                      [1680, 1720],
                      [20, 0],
                      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                    )}px)`,
                  }}
                >
                  STRUCTURAL FAILURE.
                </div>
              </div>
            )}
          </div>
        </WorldEntity>
      </InfiniteWorldCanvas>
    </div>
  );
};
