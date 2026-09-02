import React from "react";
import { LivingStudioBackground } from "../../components/LivingStudioBackground";
import { DocumentaryTexture } from "../../components/collage/DocumentaryTexture";

export const PushingAwayBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden">
      {/* Living Apple Studio Ambient Lighting */}
      <LivingStudioBackground
        orbColor1="rgba(245, 158, 11, 0.16)"
        orbColor2="rgba(0, 113, 227, 0.14)"
        dotGridOpacity={0.06}
      />
      {/* Documentary Tactile Grain Overlay */}
      <DocumentaryTexture opacity={0.035} enableVignette={true} />
    </div>
  );
};
