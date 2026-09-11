import { Config } from "@remotion/cli/config";
import { enableTailwind } from "@remotion/tailwind";

// High-Throughput & Deterministic Rendering Configuration
// Defaults to "angle" (hardware-accelerated GPU via Linux GLES/EGL for ~2 min 1080x1920 exports).
// Gracefully falls back to "swiftshader" (pure CPU software) via REMOTION_GL=swiftshader or CLI --gl=swiftshader.
const glRenderer = (process.env.REMOTION_GL as any) || "angle";
Config.setChromiumOpenGlRenderer(glRenderer);

if (glRenderer === "swangle" || glRenderer === "swiftshader") {
  Config.setHardwareAcceleration("disable");
} else {
  Config.setHardwareAcceleration("if-possible");
}

Config.setConcurrency(8);
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
Config.setCodec("h264");
Config.setPixelFormat("yuv420p");

Config.overrideWebpackConfig((currentConfiguration) => {
  return enableTailwind(currentConfiguration);
});

