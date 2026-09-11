import { Config } from "@remotion/cli/config";
import { enableTailwind } from "@remotion/tailwind";

// 100% Pure CPU Software Rendering Configuration (SwiftShader via Swangle, Zero GPU / Zero CUDA)
Config.setChromiumOpenGlRenderer("swangle");
Config.setHardwareAcceleration("disable");
Config.setConcurrency(8);
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);

Config.overrideWebpackConfig((currentConfiguration) => {
  return enableTailwind(currentConfiguration);
});
