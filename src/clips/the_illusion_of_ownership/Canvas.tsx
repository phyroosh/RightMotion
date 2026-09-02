import React from "react";
import { KineticScene } from "../../components/KineticScene";
import { ProCutout } from "../../components/ProCutout";
import { CashFlowSankeyCard } from "../../components/finance/CashFlowSankeyCard";
import { WealthMultiplierMeter } from "../../components/finance/WealthMultiplierMeter";
import { IsometricCard } from "../../components/camera3d/IsometricCard";

export const TheIllusionOfOwnershipCanvas: React.FC<{ frame: number; fps: number; currentMs: number }> = ({ currentMs }) => {
  return (
    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center pointer-events-none px-6 z-10 pt-[15%] pb-[25%]">
      
      <KineticScene startMs={0} endMs={8000} currentMs={currentMs} inTransition="whip_left" outTransition="snap_up">
        <h1 className="text-6xl font-black text-white text-center mb-8 drop-shadow-2xl">
          THE ILLUSION OF <span className="text-[#10b981]">OWNERSHIP</span>
        </h1>
        <IsometricCard tiltX={10} tiltY={-5} elevation={40}>
          <ProCutout
            assetId="phone_dopamine_overload"
            glowColor="emerald"
            animation="stamp_impact"
            width={400}
            height={400}
          />
        </IsometricCard>
      </KineticScene>

      <KineticScene startMs={8200} endMs={16000} currentMs={currentMs} inTransition="whip_left" outTransition="zoom_out">
        <CashFlowSankeyCard />
      </KineticScene>

      <KineticScene startMs={16200} endMs={25000} currentMs={currentMs} inTransition="snap_up" outTransition="zoom_out">
        <WealthMultiplierMeter />
      </KineticScene>

    </div>
  );
};