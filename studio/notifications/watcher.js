/**
 * RightMotion Autonomous File System Watcher
 * Detects background AI clip creation, video rendering completion, and thumbnail generation.
 */

const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const notificationService = require('./service');

const ROOT_DIR = path.resolve(__dirname, '../..');
const OUT_DIR = path.join(ROOT_DIR, 'out');
const CLIPS_DIR = path.join(ROOT_DIR, 'src', 'clips');

class SystemWatcher {
  constructor() {
    this.watcher = null;
    this.knownRenders = new Map(); // filename -> { size, mtime }
    this.knownClips = new Set();
    this.pendingRenders = new Map(); // filename -> timer
    this.isInitialized = false;
  }

  start() {
    if (this.watcher) return;

    // Scan initial state so we don't spam notifications on startup
    this.scanInitialState();

    const watchTargets = [OUT_DIR, CLIPS_DIR];
    watchTargets.forEach(t => {
      if (!fs.existsSync(t)) {
        fs.mkdirSync(t, { recursive: true });
      }
    });

    this.watcher = chokidar.watch(watchTargets, {
      ignored: /(^|[\/\\])\..|node_modules/,
      persistent: true,
      ignoreInitial: true,
      depth: 2,
      awaitWriteFinish: {
        stabilityThreshold: 1500,
        pollInterval: 250
      }
    });

    this.watcher
      .on('add', (filePath) => this.handleFileAdded(filePath))
      .on('change', (filePath) => this.handleFileChanged(filePath))
      .on('addDir', (dirPath) => this.handleDirAdded(dirPath))
      .on('error', (err) => console.warn('[Watcher] Watcher warning:', err.message));

    this.isInitialized = true;
    console.log('[Watcher] Autonomous background watcher active for out/ and src/clips/.');
  }

  scanInitialState() {
    try {
      if (fs.existsSync(OUT_DIR)) {
        const files = fs.readdirSync(OUT_DIR);
        files.forEach(f => {
          if (f.endsWith('.mp4') || f.endsWith('_thumbnail.png')) {
            try {
              const stat = fs.statSync(path.join(OUT_DIR, f));
              this.knownRenders.set(f, { size: stat.size, mtime: stat.mtimeMs });
            } catch (e) {}
          }
        });
      }

      if (fs.existsSync(CLIPS_DIR)) {
        const dirs = fs.readdirSync(CLIPS_DIR, { withFileTypes: true });
        dirs.forEach(d => {
          if (d.isDirectory()) {
            this.knownClips.add(d.name);
          }
        });
      }
    } catch (e) {
      console.warn('[Watcher] Error scanning initial state:', e.message);
    }
  }

  handleDirAdded(dirPath) {
    const parent = path.dirname(dirPath);
    if (path.resolve(parent) === path.resolve(CLIPS_DIR)) {
      const clipName = path.basename(dirPath);
      if (!this.knownClips.has(clipName)) {
        this.knownClips.add(clipName);

        // Allow files to be scaffolded before firing notification
        setTimeout(() => {
          this.emitClipCreated(clipName);
        }, 1500);
      }
    }
  }

  handleFileAdded(filePath) {
    const filename = path.basename(filePath);
    const ext = path.extname(filename).toLowerCase();

    if (filePath.startsWith(OUT_DIR)) {
      if (ext === '.mp4') {
        this.debounceRenderComplete(filename, filePath);
      } else if (filename.endsWith('_thumbnail.png')) {
        this.emitThumbnailReady(filename);
      }
    } else if (filePath.startsWith(CLIPS_DIR) && filename === 'Canvas.tsx') {
      const clipName = path.basename(path.dirname(filePath));
      if (!this.knownClips.has(clipName)) {
        this.knownClips.add(clipName);
        this.emitClipCreated(clipName);
      }
    }
  }

  handleFileChanged(filePath) {
    const filename = path.basename(filePath);
    if (filePath.startsWith(OUT_DIR) && filename.endsWith('.mp4')) {
      this.debounceRenderComplete(filename, filePath);
    }
  }

  debounceRenderComplete(filename, filePath) {
    if (this.pendingRenders.has(filename)) {
      clearTimeout(this.pendingRenders.get(filename));
    }

    // Wait until file is completely written and stable
    const timer = setTimeout(() => {
      this.pendingRenders.delete(filename);
      this.verifyAndEmitRender(filename, filePath);
    }, 2000);

    this.pendingRenders.set(filename, timer);
  }

  verifyAndEmitRender(filename, filePath) {
    try {
      if (!fs.existsSync(filePath)) return;
      const stat = fs.statSync(filePath);
      if (stat.size < 50 * 1024) return; // Skip zero-byte or tiny temp files

      const prev = this.knownRenders.get(filename);
      if (prev && prev.size === stat.size && Math.abs(prev.mtime - stat.mtimeMs) < 1000) {
        return; // Already notified for this exact file state
      }

      this.knownRenders.set(filename, { size: stat.size, mtime: stat.mtimeMs });

      const clipBase = filename.replace(/\.mp4$/i, '').replace(/_video$/i, '');
      const sizeMb = (stat.size / (1024 * 1024)).toFixed(1);
      const titleFormatted = clipBase.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

      notificationService.dispatch({
        type: 'RENDER_COMPLETED',
        category: 'render',
        title: '🎬 Video Render Complete',
        body: `${titleFormatted} (${sizeMb} MB) has finished rendering and is ready for review.`,
        clip: filename,
        tab: 'studio',
        url: notificationService.formatDeepLink(filename, 'studio'),
        data: { filename, clipBase, sizeMb }
      });
    } catch (e) {
      console.warn('[Watcher] Error verifying render file:', e.message);
    }
  }

  emitClipCreated(clipName) {
    const titleFormatted = clipName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const videoFilename = `${clipName}_video.mp4`;

    notificationService.dispatch({
      type: 'PROJECT_CREATED',
      category: 'project',
      title: '✨ New Video Project Ready',
      body: `"${titleFormatted}" has been scaffolded and is ready for design review.`,
      clip: videoFilename,
      tab: 'studio',
      url: notificationService.formatDeepLink(videoFilename, 'studio'),
      data: { clipName, videoFilename }
    });
  }

  emitThumbnailReady(filename) {
    const clipBase = filename.replace(/_thumbnail\.png$/i, '');
    const titleFormatted = clipBase.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    notificationService.dispatch({
      type: 'THUMBNAIL_READY',
      category: 'render',
      title: '🖼️ Thumbnail Generated',
      body: `New cover ready for "${titleFormatted}".`,
      clip: `${clipBase}_video.mp4`,
      tab: 'studio',
      url: notificationService.formatDeepLink(`${clipBase}_video.mp4`, 'studio'),
      data: { filename, clipBase }
    });
  }

  stop() {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }
  }
}

const watcher = new SystemWatcher();
module.exports = watcher;
