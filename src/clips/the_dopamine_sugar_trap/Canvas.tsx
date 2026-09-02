import React from "react";
import { KineticScene } from "../../components/KineticScene";
import { ProCutout } from "../../components/ProCutout";
import { BiometricRing } from "../../components/health/BiometricRing";
import { CortisolSpikeGraph } from "../../components/health/CortisolSpikeGraph";
import { MetabolicStatusCard } from "../../components/health/MetabolicStatusCard";
import { IsometricCard } from "../../components/camera3d/IsometricCard";

export const TheDopamineSugarTrapCanvas: React.FC<{ frame: number; fps: number; currentMs: number }> = ({ currentMs }) => {
  return (
    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center pointer-events-none px-6 z-10 pt-[15%] pb-[25%]">
      
      <KineticScene startMs={0} endMs={8000} currentMs={currentMs} inTransition="whip_left" outTransition="snap_up">
        <h1 className="text-6xl font-black text-white text-center mb-8 drop-shadow-2xl">
          THE <span className="text-[#06b6d4]">SUGAR TRAP</span>
        </h1>
        <IsometricCard tiltX={5} tiltY={-10} elevation={30}>
          <ProCutout
            assetId="dopamine_head_circuit"
            glowColor="cyan"
            animation="punch_in"
            width={400}
            height={400}
          />
        </IsometricCard>
      </KineticScene>

      <KineticScene startMs={8200} endMs={17000} currentMs={currentMs} inTransition="snap_up" outTransition="zoom_out">
        <BiometricRing frame={Math.floor(currentMs / (1000/30))} />
        <CortisolSpikeGraph frame={Math.floor(currentMs / (1000/30))} />
      </KineticScene>

      <KineticScene startMs={17200} endMs={27000} currentMs={currentMs} inTransition="snap_up" outTransition="zoom_out">
        <MetabolicStatusCard />
      </KineticScene>

    </div>
  );
};