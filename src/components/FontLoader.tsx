import React from "react";
import { staticFile } from "remotion";

export const FontLoader: React.FC = () => {
  return (
    <style>{`
      @font-face {
        font-family: 'Montserrat';
        font-style: normal;
        font-weight: 700;
        src: url('${staticFile("fonts/Montserrat-Bold.ttf")}') format('truetype');
      }
      @font-face {
        font-family: 'Montserrat';
        font-style: normal;
        font-weight: 800;
        src: url('${staticFile("fonts/Montserrat-ExtraBold.ttf")}') format('truetype');
      }
      @font-face {
        font-family: 'Montserrat';
        font-style: normal;
        font-weight: 900;
        src: url('${staticFile("fonts/Montserrat-Black.ttf")}') format('truetype');
      }
      @font-face {
        font-family: 'JetBrains Mono';
        font-style: normal;
        font-weight: 700;
        src: url('${staticFile("fonts/JetBrainsMono-Bold.ttf")}') format('truetype');
      }
      @font-face {
        font-family: 'JetBrains Mono';
        font-style: normal;
        font-weight: 800;
        src: url('${staticFile("fonts/JetBrainsMono-ExtraBold.ttf")}') format('truetype');
      }
    `}</style>
  );
};
