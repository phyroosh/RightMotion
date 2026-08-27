import React from "react";
import { Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SolidBackground } from "../../components/SolidBackground";
import { CameraCanvas } from "../../components/CameraCanvas";
import { LofiCanvas } from "./Canvas";
import { LofiHeader } from "./LofiHeader";
import { LofiCaptions } from "./LofiCaptions";
import { LOFI_BACKGROUND_TRACK } from "./backgroundTrack";
import { LOFI_CAMERA_TRACK } from "./cameraTrack";
import "../../style.css";

export const LofiSongComposition: React.FC = () => {
  const { width, height, fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const currentMs = (frame / fps) * 1000;

  return (
    <div
      className="relative w-full h-full text-slate-100 flex flex-col justify-between overflow-hidden select-none font-sans"
      style={{ width, height, backgroundColor: "#140508" }}
    >
      {/* 1. Master Audio Track (Beautiful AI Generated Lofi Song) */}
      <Audio src={staticFile("lofi_song/audio.mp3")} volume={1.0} />

      {/* 2. Solid Lofi Red Backdrop Engine */}
      <SolidBackground
        currentMs={currentMs}
        keyframes={LOFI_BACKGROUND_TRACK}
        showSubtleGrid={true}
      />

      {/* 3. 2.5D After Effects Camera Rig & Motion Graphics Stage */}
      <CameraCanvas
        currentMs={currentMs}
        keyframes={LOFI_CAMERA_TRACK}
        width={width}
        height={height}
        enableDrift={true}
        driftIntensity={1.1}
      >
        {/* Widescreen 16:9 Lofi Visual Elements & Atmospheric Props */}
        <LofiCanvas currentMs={currentMs} />
      </CameraCanvas>

      {/* 4. Top Header REC HUD & Progress Bar (Screen Space Fixed) */}
      <LofiHeader />

      {/* 5. Dynamic Lofi Hinglish Lyrics & Hindi Poetic Subtitle */}
      <LofiCaptions currentMs={currentMs} />
    </div>
  );
};
