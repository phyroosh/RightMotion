import { Config } from "@remotion/cli/config";
import { enableTailwind } from "@remotion/tailwind";

// GPU Hardware Acceleration Configuration (NVIDIA RTX 3050 via ANGLE/Direct3D11)
Config.setChromiumOpenGlRenderer("angle");
Config.setConcurrency(8);
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);

Config.overrideWebpackConfig((currentConfiguration) => {
  return enableTailwind(currentConfiguration);
});
