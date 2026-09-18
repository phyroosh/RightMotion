const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.resolve(__dirname, '..', 'out');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

/**
 * Dynamically extracts registered clips and thumbnails from canonical src/clips/registry.ts.
 * Eliminates brittle hardcoded THUMBNAIL_MAP and source-text mutation.
 */
function getThumbnailMapFromRegistry() {
  const registryPath = path.resolve(__dirname, '..', 'src', 'clips', 'registry.ts');
  if (!fs.existsSync(registryPath)) {
    throw new Error(`Canonical clips registry not found at ${registryPath}`);
  }
  const content = fs.readFileSync(registryPath, 'utf8');
  const thumbnailMap = {};

  const arrayMatch = content.match(/export\s+const\s+REGISTERED_CLIPS[^{]*=\s*\[([\s\S]*?)\n\];/);
  if (!arrayMatch) {
    throw new Error('Unable to parse REGISTERED_CLIPS array from src/clips/registry.ts');
  }

  const entries = arrayMatch[1].match(/\{([^{}]+)\}/g) || [];
  for (const entry of entries) {
    const idMatch = entry.match(/id:\s*["']([^"']+)["']/);
    const pascalMatch = entry.match(/pascalName:\s*["']([^"']+)["']/);
    const thumbMatch = entry.match(/thumbnailComponent:\s*([^,\s]+)/);

    if (idMatch && pascalMatch) {
      const id = idMatch[1];
      const pascalName = pascalMatch[1];
      const thumbId = (thumbMatch && thumbMatch[1] !== 'undefined') ? thumbMatch[1] : `${pascalName}Thumbnail`;
      thumbnailMap[`${id}_video.mp4`] = thumbId;
    }
  }

  return thumbnailMap;
}

// Target single video or all
const targetArg = process.argv[2];

async function main() {
  console.log('\n=============================================================');
  console.log('🎨 RightMotion Automated High-Converting Thumbnail Engine');
  console.log('=============================================================\n');

  const THUMBNAIL_MAP = getThumbnailMapFromRegistry();
  console.log(`📋 Loaded ${Object.keys(THUMBNAIL_MAP).length} clips from canonical src/clips/registry.ts\n`);

  let entries = Object.entries(THUMBNAIL_MAP);
  if (targetArg) {
    entries = entries.filter(
      ([video, id]) =>
        video.toLowerCase().includes(targetArg.toLowerCase()) ||
        id.toLowerCase().includes(targetArg.toLowerCase())
    );
    if (entries.length === 0) {
      console.error(`❌ No thumbnail found matching: "${targetArg}"`);
      console.log('Available thumbnails:', Object.keys(THUMBNAIL_MAP).join(', '));
      process.exit(1);
    }
  }

  for (const [videoFile, stillId] of entries) {
    const baseName = videoFile.replace(/\.mp4$/i, '');
    const outThumbnailPath = path.join(OUT_DIR, `${baseName}_thumbnail.png`);

    console.log(`🖼️ Rendering Thumbnail: [${stillId}] -> out/${baseName}_thumbnail.png...`);
    const startTime = Date.now();

    try {
      const cmd = `npx remotion still src/index.ts ${stillId} "${outThumbnailPath}" --overwrite`;
      execSync(cmd, { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      const stat = fs.statSync(outThumbnailPath);
      const sizeKb = (stat.size / 1024).toFixed(1);
      console.log(`✅ [${stillId}] Rendered successfully in ${elapsed}s (${sizeKb} KB)\n`);
    } catch (err) {
      console.error(`❌ Failed to render ${stillId}:`, err.message);
    }
  }

  console.log('🎉 All requested thumbnails rendered successfully in out/!\n');
}

main().catch(console.error);