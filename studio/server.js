const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const igPlaywright = require('./instagram_playwright');
const multiChannel = require('./multi_channel_manager');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const ROOT_DIR = path.resolve(__dirname, '..');
const ROOT_PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const MEMES_REGISTRY_PATH = path.join(ROOT_PUBLIC_DIR, 'memes', 'registry.json');

app.use('/memes', express.static(path.join(ROOT_PUBLIC_DIR, 'memes')));
app.use('/public', express.static(ROOT_PUBLIC_DIR));

const CLIENT_SECRETS_PATH = path.join(__dirname, 'client_secrets.json');
const TOKEN_PATH = path.join(__dirname, 'token.json');
const METADATA_PATH = path.join(__dirname, 'metadata.json');
const UPLOADS_PATH = path.join(__dirname, 'uploads.json');
const OUT_DIR = path.resolve(__dirname, '..', 'out');

// Helper to get persistent uploads record
function getUploadsRecord() {
  if (fs.existsSync(UPLOADS_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(UPLOADS_PATH, 'utf-8'));
    } catch (e) {
      console.error('Error reading uploads.json:', e);
    }
  }
  return {};
}

function saveUploadsRecord(record) {
  try {
    fs.writeFileSync(UPLOADS_PATH, JSON.stringify(record, null, 2));
  } catch (e) {
    console.error('Error saving uploads.json:', e);
  }
}

// Helper to get persistent metadata record with safe fallback
function getSavedMetadata() {
  if (fs.existsSync(METADATA_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(METADATA_PATH, 'utf-8'));
    } catch (e) {
      console.error('Error reading metadata.json:', e.message);
    }
  }
  return {};
}

// Helper to get OAuth2 client (multi-channel enabled with fallback)
function getOAuth2Client(channelId = null) {
  const chObj = multiChannel.getOAuth2ClientForChannel(channelId, PORT);
  if (chObj && chObj.oauth2Client) {
    return chObj.oauth2Client;
  }

  // Fallback to credential client (e.g. for generating auth URLs)
  try {
    const credObj = multiChannel.getOAuth2ClientForCredential(null, PORT);
    if (credObj && credObj.oauth2Client) return credObj.oauth2Client;
  } catch (e) {}

  if (fs.existsSync(CLIENT_SECRETS_PATH)) {
    const fileContent = fs.readFileSync(CLIENT_SECRETS_PATH, 'utf-8');
    const credentials = JSON.parse(fileContent);
    const installed = credentials.installed || credentials.web;
    const redirectUri = `http://localhost:${PORT}/oauth2callback`;
    const oauth2Client = new google.auth.OAuth2(
      installed.client_id,
      installed.client_secret,
      redirectUri
    );
    if (fs.existsSync(TOKEN_PATH)) {
      try {
        const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
        oauth2Client.setCredentials(tokens);
      } catch (e) {}
    }
    return oauth2Client;
  }

  throw new Error('No Google Cloud credentials found. Please add a client_secrets.json in Settings.');
}

// Sync uploads with live YouTube channel(s)
async function syncYouTubeUploads(targetChannelId = null) {
  const reg = multiChannel.getChannelsRegistry();
  const channelsToSync = targetChannelId
    ? reg.channels.filter((c) => c.channelId === targetChannelId)
    : reg.channels;

  if (channelsToSync.length === 0) {
    if (!fs.existsSync(TOKEN_PATH)) return;
    try {
      const oauth2Client = getOAuth2Client();
      const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
      const channelRes = await youtube.channels.list({
        part: 'contentDetails,snippet',
        mine: true,
      });
      const ch = channelRes.data.items?.[0];
      const uploadsPlaylistId = ch?.contentDetails?.relatedPlaylists?.uploads;
      if (!uploadsPlaylistId) return;

      const playlistRes = await youtube.playlistItems.list({
        part: 'snippet,status',
        playlistId: uploadsPlaylistId,
        maxResults: 50,
      });
      const ytVideos = playlistRes.data.items || [];
      let uploads = getUploadsRecord();
      let savedMetadata = getSavedMetadata();

      for (const yt of ytVideos) {
        const ytTitle = yt.snippet.title.trim();
        const ytVideoId = yt.snippet.resourceId.videoId;
        const ytPublishedAt = yt.snippet.publishedAt;
        const ytPrivacy = yt.status?.privacyStatus || 'public';

        for (const [filename, meta] of Object.entries(savedMetadata)) {
          const metaTitle = (meta.title || '').trim();
          const metaTopic = (meta.topic || '').trim().toLowerCase();
          const isExactTitle = metaTitle && ytTitle.toLowerCase() === metaTitle.toLowerCase();
          const isTopicMatch = metaTopic && ytTitle.toLowerCase().includes(metaTopic);

          if (isExactTitle || isTopicMatch) {
            const existing = uploads[filename] || {};
            uploads[filename] = {
              ...existing,
              uploaded: true,
              videoId: ytVideoId,
              youtubeUrl: `https://youtu.be/${ytVideoId}`,
              shortsUrl: `https://youtube.com/shorts/${ytVideoId}`,
              title: ytTitle,
              privacyStatus: existing.privacyStatus || ytPrivacy,
              publishAt: existing.publishAt || null,
              isScheduled: existing.isScheduled || false,
              publishedAt: ytPublishedAt,
            };
            break;
          }
        }
      }
      saveUploadsRecord(uploads);
    } catch (err) {
      console.error('Legacy sync error:', err.message);
    }
    return;
  }

  for (const channel of channelsToSync) {
    try {
      const clientObj = multiChannel.getOAuth2ClientForChannel(channel.channelId, PORT);
      if (!clientObj) continue;

      const youtube = google.youtube({ version: 'v3', auth: clientObj.oauth2Client });
      const channelRes = await youtube.channels.list({
        part: 'contentDetails,snippet,statistics',
        mine: true,
      });

      const chData = channelRes.data.items?.[0];
      if (!chData) continue;

      // Update channel metadata
      channel.title = chData.snippet.title;
      channel.customUrl = chData.snippet.customUrl || channel.customUrl;
      channel.avatar =
        chData.snippet.thumbnails?.high?.url ||
        chData.snippet.thumbnails?.medium?.url ||
        chData.snippet.thumbnails?.default?.url ||
        channel.avatar;
      channel.subscriberCount = chData.statistics?.subscriberCount || '0';
      channel.videoCount = chData.statistics?.videoCount || '0';
      multiChannel.saveChannelsRegistry(reg);

      const uploadsPlaylistId = chData.contentDetails?.relatedPlaylists?.uploads;
      if (!uploadsPlaylistId) continue;

      const playlistRes = await youtube.playlistItems.list({
        part: 'snippet,status',
        playlistId: uploadsPlaylistId,
        maxResults: 50,
      });

      const ytVideos = playlistRes.data.items || [];
      let uploads = getUploadsRecord();
      let savedMetadata = getSavedMetadata();

      for (const yt of ytVideos) {
        const ytTitle = yt.snippet.title.trim();
        const ytVideoId = yt.snippet.resourceId.videoId;
        const ytPublishedAt = yt.snippet.publishedAt;
        const ytPrivacy = yt.status?.privacyStatus || 'public';

        for (const [filename, meta] of Object.entries(savedMetadata)) {
          const metaTitle = (meta.title || '').trim();
          const metaTopic = (meta.topic || '').trim().toLowerCase();
          const isExactTitle = metaTitle && ytTitle.toLowerCase() === metaTitle.toLowerCase();
          const isTopicMatch = metaTopic && ytTitle.toLowerCase().includes(metaTopic);

          if (isExactTitle || isTopicMatch) {
            const existing = uploads[filename] || {};
            if (!existing.channels) existing.channels = {};
            existing.channels[channel.channelId] = {
              uploaded: true,
              channelId: channel.channelId,
              channelTitle: channel.title,
              videoId: ytVideoId,
              youtubeUrl: `https://youtu.be/${ytVideoId}`,
              shortsUrl: `https://youtube.com/shorts/${ytVideoId}`,
              title: ytTitle,
              privacyStatus: ytPrivacy,
              publishedAt: ytPublishedAt,
            };

            if (channel.channelId === reg.activeChannelId || !existing.uploaded) {
              existing.uploaded = true;
              existing.videoId = ytVideoId;
              existing.youtubeUrl = `https://youtu.be/${ytVideoId}`;
              existing.shortsUrl = `https://youtube.com/shorts/${ytVideoId}`;
              existing.title = ytTitle;
              existing.privacyStatus = ytPrivacy;
              existing.publishedAt = ytPublishedAt;
            }

            uploads[filename] = existing;
            break;
          }
        }
      }
      saveUploadsRecord(uploads);
    } catch (err) {
      console.error(`Sync error for channel ${channel.title}:`, err.message);
    }
  }
}

// Current upload state for progress polling
let activeUpload = {
  inProgress: false,
  progress: 0,
  stage: '',
  result: null,
  error: null,
};

function classifyVideoNiche(filename, meta = {}) {
  const metaStr = `${meta.topic || ''} ${meta.title || ''} ${meta.description || ''} ${(meta.tags || []).join(' ')}`.toLowerCase();
  const fileStr = filename.toLowerCase();

  // 1. Check explicit bracket tags first
  if (metaStr.includes('{finance}')) return 'finance';
  if (metaStr.includes('{health}')) return 'health';
  if (metaStr.includes('{self improvement}') || metaStr.includes('{self improvment}')) return 'self_improvement';

  // 2. Specific filename heuristics
  if (
    fileStr.includes('compounding') ||
    fileStr.includes('ownership') ||
    fileStr.includes('wealth') ||
    fileStr.includes('finance') ||
    fileStr.includes('money') ||
    fileStr.includes('investing') ||
    fileStr.includes('cash_flow')
  ) {
    return 'finance';
  }

  if (
    fileStr.includes('cortisol') ||
    fileStr.includes('sugar_trap') ||
    fileStr.includes('biomatrix') ||
    fileStr.includes('metabolic') ||
    fileStr.includes('circadian') ||
    fileStr.includes('glycogen') ||
    fileStr.includes('hormone') ||
    fileStr.includes('teenage_mental_health')
  ) {
    return 'health';
  }

  // 3. Keyword heuristics (excluding 'mental health' which belongs to Judy Insights psychology)
  const cleanText = metaStr.replace(/mental health/g, 'psychology_wellbeing');

  if (
    cleanText.includes('investing') ||
    cleanText.includes('compounding') ||
    cleanText.includes('cash flow') ||
    cleanText.includes('interest rate') ||
    cleanText.includes('inflation') ||
    cleanText.includes('stock market')
  ) {
    return 'finance';
  }

  if (
    cleanText.includes('cortisol') ||
    cleanText.includes('adrenal') ||
    cleanText.includes('circadian') ||
    cleanText.includes('glycogen') ||
    cleanText.includes('cellular biology') ||
    cleanText.includes('metabolism') ||
    cleanText.includes('biometric') ||
    cleanText.includes('blood sugar')
  ) {
    return 'health';
  }

  return 'self_improvement';
}

// 0a. API: Get Tactical Meme Board Registry (21 internet culture memes)
app.get('/api/memes', (req, res) => {
  if (fs.existsSync(MEMES_REGISTRY_PATH)) {
    try {
      const data = JSON.parse(fs.readFileSync(MEMES_REGISTRY_PATH, 'utf-8'));
      return res.json(data);
    } catch (err) {
      console.error('Error reading memes registry:', err);
    }
  }
  return res.json({ memes: [], total: 0 });
});

// 0b. API: Engine Telemetry & System Health
app.get('/api/system/health', (req, res) => {
  try {
    const clipsDir = path.join(ROOT_DIR, 'src', 'clips');
    const clipsCount = fs.existsSync(clipsDir)
      ? fs.readdirSync(clipsDir).filter((f) => {
          try {
            return fs.statSync(path.join(clipsDir, f)).isDirectory();
          } catch (e) {
            return false;
          }
        }).length
      : 0;

    let renderedCount = 0;
    if (fs.existsSync(OUT_DIR)) {
      renderedCount = fs.readdirSync(OUT_DIR).filter((f) => f.endsWith('.mp4')).length;
    }

    const venvPython = path.join(ROOT_DIR, '.venv', 'bin', 'python3');
    const pythonReady = fs.existsSync(venvPython);

    return res.json({
      status: 'online',
      version: '3.5.0',
      nodeVersion: process.version,
      remotionVersion: '4.0.240',
      pythonReady,
      clipsCount,
      renderedCount,
      totalMemes: 21,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(500).json({ status: 'degraded', error: err.message });
  }
});

// 1. API: List all rendered videos sorted by date (newest first) & categorized with live upload and schedule status
app.get('/api/videos', async (req, res) => {
  try {
    const niches = multiChannel.getNichesRegistry();

    if (!fs.existsSync(OUT_DIR)) {
      return res.json({
        videos: [],
        byNiche: { self_improvement: [], finance: [], health: [] },
        niches,
        longForms: [],
        shorts: [],
        uploadedVideos: [],
        unuploadedVideos: [],
        scheduledVideos: [],
        totalCount: 0,
        uploadedCount: 0,
        unuploadedCount: 0,
        scheduledCount: 0,
      });
    }

    // Try auto-syncing with YouTube if authenticated
    await syncYouTubeUploads().catch(() => {});
    const savedMetadata = getSavedMetadata();
    const uploads = getUploadsRecord();
    const files = fs.readdirSync(OUT_DIR);
    // Filter out temporary test images and keep only valid mp4 videos
    const videoFiles = files.filter((f) => f.endsWith('.mp4'));

    const now = new Date();

    const videos = videoFiles.map((filename) => {
      const filePath = path.join(OUT_DIR, filename);
      const stats = fs.statSync(filePath);
      const meta = savedMetadata[filename] || {
        topic: filename.replace('.mp4', '').replace('_video', ''),
        title: filename.replace('.mp4', '').replace(/_/g, ' ').toUpperCase() + ' #Shorts',
        description: 'Auto-generated motion graphics video by RightClips.\n\n#Shorts #Viral',
        tags: ['Shorts', 'Viral', 'Video'],
        categoryId: '27',
        privacyStatus: 'public',
      };

      const uploadInfo = uploads[filename] || {};

      // YouTube Status
      const ytUploaded = !!(uploadInfo.youtube?.uploaded || uploadInfo.uploaded);
      const ytVideoId = uploadInfo.youtube?.videoId || uploadInfo.videoId || null;
      const ytPublishAt = uploadInfo.youtube?.publishAt || uploadInfo.publishAt || null;
      const ytIsScheduled = !!(
        (uploadInfo.youtube?.isScheduled || uploadInfo.isScheduled) &&
        ytPublishAt &&
        new Date(ytPublishAt) > now
      );

      // Instagram Status (Always Live Immediate)
      const igUploaded = !!(uploadInfo.instagram && uploadInfo.instagram.uploaded);
      const igReelUrl = uploadInfo.instagram?.reelUrl || null;

      const isUploaded = ytUploaded || igUploaded;
      const isScheduled = ytIsScheduled;

      const isLongForm =
        filename.includes('procrastination') ||
        filename.includes('neuroproductivity') ||
        filename.includes('lofi_song') ||
        (meta.title && (meta.title.includes('Visual Essay') || meta.title.includes('Masterclass') || meta.title.includes('Lyric Video'))) ||
        (meta.topic && (meta.topic.includes('essay') || meta.topic.includes('neuroproductivity') || meta.topic.includes('lofi'))) ||
        stats.size > 50 * 1024 * 1024; // > 50MB typically long form

      const baseName = filename.replace(/\.mp4$/i, '');
      const thumbFile = `${baseName}_thumbnail.png`;
      const thumbPath = path.join(OUT_DIR, thumbFile);
      const hasThumbnail = fs.existsSync(thumbPath);

      const niche = classifyVideoNiche(filename, meta);

      return {
        filename,
        niche,
        sizeMb: (stats.size / (1024 * 1024)).toFixed(2),
        modifiedAt: stats.mtime,
        mtimeMs: stats.mtimeMs,
        isLongForm,
        format: isLongForm ? '16:9 Long-Form' : '9:16 Shorts',
        metadata: meta,
        isUploaded,
        isScheduled,
        youtube: {
          isUploaded: ytUploaded,
          isScheduled: ytIsScheduled,
          videoId: ytVideoId,
          youtubeUrl: ytVideoId ? `https://youtu.be/${ytVideoId}` : null,
          shortsUrl: ytVideoId ? `https://youtube.com/shorts/${ytVideoId}` : null,
          publishAt: ytPublishAt,
          publishedAt: uploadInfo.publishedAt || uploadInfo.youtube?.publishedAt || null,
        },
        instagram: {
          isUploaded: igUploaded,
          reelUrl: igReelUrl,
          username: uploadInfo.instagram?.username || null,
          publishedAt: uploadInfo.instagram?.publishedAt || null,
        },
        channels: uploadInfo.channels || {},
        instagramAccounts: uploadInfo.instagramAccounts || {},
        uploadInfo: isUploaded ? uploadInfo : null,
        hasThumbnail,
        thumbnailFile: hasThumbnail ? thumbFile : null,
        thumbnailUrl: hasThumbnail ? `/api/thumbnail/${thumbFile}` : null,
      };
    });

    // Sort strictly by modification date (newest first)
    videos.sort((a, b) => b.mtimeMs - a.mtimeMs);

    const byNiche = {
      self_improvement: videos.filter((v) => v.niche === 'self_improvement'),
      finance: videos.filter((v) => v.niche === 'finance'),
      health: videos.filter((v) => v.niche === 'health'),
    };

    const longForms = videos.filter((v) => v.isLongForm);
    const shorts = videos.filter((v) => !v.isLongForm);
    const uploadedVideos = videos.filter((v) => v.isUploaded && !v.isScheduled);
    const scheduledVideos = videos.filter((v) => v.isScheduled);
    const unuploadedVideos = videos.filter((v) => !v.isUploaded && !v.isScheduled);

    res.json({
      videos,
      byNiche,
      niches,
      longForms,
      shorts,
      uploadedVideos,
      scheduledVideos,
      unuploadedVideos,
      totalCount: videos.length,
      uploadedCount: uploadedVideos.length,
      scheduledCount: scheduledVideos.length,
      unuploadedCount: unuploadedVideos.length,
      longFormCount: longForms.length,
      shortsCount: shorts.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 1b. API: Force Sync with YouTube channel
app.post('/api/sync-uploads', async (req, res) => {
  try {
    await syncYouTubeUploads();
    const uploads = getUploadsRecord();
    res.json({ success: true, count: Object.keys(uploads).length, uploads });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Stream video file for HTML5 preview
app.get('/api/video-file/:filename', (req, res) => {
  const filePath = path.join(OUT_DIR, req.params.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Video not found');
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(filePath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(filePath).pipe(res);
  }
});

// 2b. Serve thumbnail image file
app.get('/api/thumbnail/:filename', (req, res) => {
  const thumbPath = path.join(OUT_DIR, req.params.filename);
  if (!fs.existsSync(thumbPath)) {
    return res.status(404).send('Thumbnail not found');
  }
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'no-cache');
  fs.createReadStream(thumbPath).pipe(res);
});

// 2c. Render or Re-render Thumbnail on Demand
app.post('/api/render-thumbnail', (req, res) => {
  const { filename } = req.body;
  if (!filename) {
    return res.status(400).json({ error: 'filename is required' });
  }

  const { exec } = require('child_process');
  const baseName = filename.replace(/\.mp4$/i, '');
  const cmd = `node scripts/render_all_thumbnails.js "${filename}"`;

  exec(cmd, { cwd: path.resolve(__dirname, '..') }, (error, stdout, stderr) => {
    if (error) {
      console.error('Thumbnail render error:', stderr || error.message);
      return res.status(500).json({ error: error.message, stderr });
    }

    const thumbFile = `${baseName}_thumbnail.png`;
    res.json({
      success: true,
      filename,
      thumbnailFile: thumbFile,
      thumbnailUrl: `/api/thumbnail/${thumbFile}?t=${Date.now()}`,
    });
  });
});

// 3. API: Auth status & Channel Profile (Multi-Channel & Multi-Project Enabled)
app.get('/api/auth-status', async (req, res) => {
  try {
    const reg = multiChannel.getChannelsRegistry();
    const credReg = multiChannel.getCredentialsRegistry();
    const activeChannel =
      reg.channels.find((c) => c.channelId === reg.activeChannelId) || reg.channels[0] || null;

    if (activeChannel) {
      // Async refresh stats in background
      multiChannel.refreshChannelDetails(activeChannel.channelId).catch(() => {});

      const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(activeChannel.title)}&background=0071e3&color=fff`;
      return res.json({
        authenticated: true,
        channel: {
          title: activeChannel.title,
          customUrl: activeChannel.customUrl,
          avatar: `/api/channel-avatar?channelId=${activeChannel.channelId}&t=${Date.now()}`,
          directAvatar: activeChannel.avatar || fallbackAvatar,
          channelId: activeChannel.channelId,
          subscriberCount: activeChannel.subscriberCount,
          videoCount: activeChannel.videoCount,
        },
        channels: reg.channels.map((c) => ({
          channelId: c.channelId,
          title: c.title,
          customUrl: c.customUrl,
          avatar: c.avatar,
          subscriberCount: c.subscriberCount,
          videoCount: c.videoCount,
          isActive: c.channelId === reg.activeChannelId,
        })),
        activeChannelId: reg.activeChannelId,
        credentials: credReg.projects,
        activeProjectId: credReg.activeProjectId,
      });
    }

    res.json({
      authenticated: false,
      channel: null,
      channels: [],
      credentials: credReg.projects,
      activeProjectId: credReg.activeProjectId,
    });
  } catch (err) {
    console.error('Auth verification error:', err.message);
    res.json({ authenticated: false, error: err.message, channels: [] });
  }
});

// Proxy channel avatar with NO CACHE to always serve current channel PFP
app.get('/api/channel-avatar', async (req, res) => {
  try {
    const { channelId } = req.query;
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    const reg = multiChannel.getChannelsRegistry();
    const target = channelId
      ? reg.channels.find((c) => c.channelId === channelId)
      : reg.channels.find((c) => c.channelId === reg.activeChannelId) || reg.channels[0];

    let avatarUrl = target?.avatar;
    if (!avatarUrl && target) {
      const clientObj = multiChannel.getOAuth2ClientForChannel(target.channelId, PORT);
      if (clientObj) {
        const yt = google.youtube({ version: 'v3', auth: clientObj.oauth2Client });
        const chRes = await yt.channels.list({ part: 'snippet', mine: true });
        avatarUrl = chRes.data.items?.[0]?.snippet?.thumbnails?.high?.url;
        if (avatarUrl) {
          target.avatar = avatarUrl;
          multiChannel.saveChannelsRegistry(reg);
        }
      }
    }

    if (!avatarUrl) {
      const name = encodeURIComponent(target?.title || 'YouTube');
      return res.redirect(`https://ui-avatars.com/api/?name=${name}&background=0071e3&color=fff`);
    }

    const imgRes = await fetch(avatarUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
    });
    const arrayBuffer = await imgRes.arrayBuffer();
    res.setHeader('Content-Type', imgRes.headers.get('content-type') || 'image/jpeg');
    res.send(Buffer.from(arrayBuffer));
  } catch (err) {
    console.error('Failed to proxy avatar:', err);
    res.redirect('https://ui-avatars.com/api/?name=Judy+Insights&background=0071e3&color=fff');
  }
});

// 4. API: Get Google OAuth URL (Supports specifying which Google Cloud Project to authenticate with)
app.get('/api/auth-url', (req, res) => {
  try {
    const { credentialId } = req.query;
    const { oauth2Client, credentialId: resolvedCredId } = multiChannel.getOAuth2ClientForCredential(
      credentialId,
      PORT
    );

    const scopes = [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/youtube',
      'https://www.googleapis.com/auth/userinfo.profile',
    ];

    const statePayload = Buffer.from(JSON.stringify({ credentialId: resolvedCredId })).toString('base64');

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: scopes,
      state: statePayload,
    });

    res.json({ url, credentialId: resolvedCredId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. OAuth Callback Handler (Multi-Channel Registration)
app.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send('Authorization code missing');
  }

  let credentialId = null;
  if (req.query.state) {
    try {
      const decoded = JSON.parse(Buffer.from(req.query.state, 'base64').toString('utf-8'));
      credentialId = decoded.credentialId;
    } catch (e) {}
  }

  try {
    const channel = await multiChannel.registerChannelFromOAuth({
      code,
      credentialId,
      port: PORT,
    });

    // Automatically sync uploads with the new channel
    await syncYouTubeUploads(channel.channelId).catch(() => {});

    const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(channel.title)}&background=0071e3&color=fff`;

    res.send(`
      <html>
        <head><title>YouTube Channel Connected</title></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; background:#090d16; color:white;">
          <div style="background:#121826; padding:40px 50px; border-radius:24px; text-align:center; box-shadow:0 25px 60px rgba(0,0,0,0.6); border:1px solid rgba(255,255,255,0.1); max-width:440px; width:90%;">
            <div style="width:72px; height:72px; border-radius:50%; margin:0 auto 16px; overflow:hidden; border:3px solid #10b981; box-shadow:0 0 20px rgba(16,185,129,0.3);">
              <img src="${channel.avatar || fallbackAvatar}" style="width:100%; height:100%; object-fit:cover;" />
            </div>
            <h1 style="color:#10b981; margin-bottom:8px; font-size:22px; font-weight:800;">✅ Channel Connected!</h1>
            <p style="color:#f8fafc; font-size:18px; font-weight:bold; margin-bottom:4px;">${channel.title}</p>
            <p style="color:#38bdf8; font-family:monospace; font-size:14px; margin-bottom:20px;">${channel.customUrl}</p>
            <p style="color:#94a3b8; font-size:13px; margin-bottom:24px;">Syncing video uploads and activating channel...</p>
            <a href="/" style="background:#0071e3; color:white; padding:12px 30px; border-radius:12px; text-decoration:none; font-weight:bold; font-size:14px; display:inline-block;">Return to Studio</a>
          </div>
          <script>
            setTimeout(() => { window.location.href = '/'; }, 1800);
          </script>
        </body>
      </html>
    `);
  } catch (err) {
    console.error('Error exchanging token:', err);
    res.status(500).send(`Authentication Failed: ${err.message}`);
  }
});

// 5b. Multi-Channel YouTube API Endpoints
app.get('/api/channels', (req, res) => {
  const reg = multiChannel.getChannelsRegistry();
  res.json(reg);
});

app.post('/api/channels/switch', (req, res) => {
  const channelId = (req.body || {}).channelId || null;
  if (!channelId) return res.status(400).json({ error: 'channelId is required' });
  const result = multiChannel.switchActiveChannel(channelId);
  if (!result.success) return res.status(404).json(result);
  res.json(result);
});

app.delete('/api/channels/:channelId', (req, res) => {
  const result = multiChannel.disconnectChannel(req.params.channelId);
  res.json(result);
});

app.post('/api/channels/sync', async (req, res) => {
  const channelId = (req.body || {}).channelId || null;
  await syncYouTubeUploads(channelId).catch(() => {});
  res.json({ success: true, message: 'Channels sync completed' });
});

// Logout / Disconnect Active Channel
app.post('/api/logout', (req, res) => {
  const reg = multiChannel.getChannelsRegistry();
  if (reg.activeChannelId) {
    multiChannel.disconnectChannel(reg.activeChannelId);
  }
  res.json({ success: true, message: 'Disconnected active YouTube channel' });
});

// 5c. Multi-Project Google Cloud Credentials API Endpoints
app.get('/api/credentials', (req, res) => {
  const reg = multiChannel.getCredentialsRegistry();
  res.json(reg);
});

app.post('/api/credentials', (req, res) => {
  const { name, jsonContent } = req.body;
  if (!jsonContent) return res.status(400).json({ error: 'jsonContent is required' });
  try {
    const project = multiChannel.addCredential({ name, jsonContent });
    res.json({ success: true, project });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/credentials/:id', (req, res) => {
  const result = multiChannel.deleteCredential(req.params.id);
  res.json(result);
});

// -------------------------------------------------------------------
// 5d. Sovereign Niches & Multi-Account Binding API Endpoints
// -------------------------------------------------------------------
app.get('/api/niches', (req, res) => {
  try {
    const niches = multiChannel.getNichesRegistry();
    res.json(niches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/niches/:nicheId/bind-youtube', (req, res) => {
  const channelId = (req.body || {}).channelId || null;
  if (!channelId) return res.status(400).json({ error: 'channelId is required' });
  const result = multiChannel.bindYouTubeToNiche(req.params.nicheId, channelId);
  res.json(result);
});

app.post('/api/niches/:nicheId/bind-instagram', (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'username is required' });
  const result = multiChannel.bindInstagramToNiche(req.params.nicheId, username);
  res.json(result);
});

// 6. API: Save Metadata
app.post('/api/save-metadata', (req, res) => {
  const { filename, metadata } = req.body;
  if (!filename || !metadata) {
    return res.status(400).json({ error: 'filename and metadata required' });
  }

  try {
    const saved = getSavedMetadata();
    saved[filename] = metadata;
    fs.writeFileSync(METADATA_PATH, JSON.stringify(saved, null, 2));
    res.json({ success: true, metadata: saved[filename] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. API: Upload Progress Status
app.get('/api/upload-status', (req, res) => {
  res.json(activeUpload);
});

// 8. API: Upload or Schedule Video to YouTube
app.post('/api/upload', async (req, res) => {
  const { filename, title, description, tags, categoryId, privacyStatus, publishAt, pinnedComment, autoPostComment = true } = req.body;

  if (!filename) {
    return res.status(400).json({ error: 'Filename is required' });
  }

  const filePath = path.join(OUT_DIR, filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `Video file ${filename} not found in out/` });
  }

  if (activeUpload.inProgress) {
    return res.status(409).json({ error: 'Another upload is already in progress' });
  }

  // Validate scheduled publish time if scheduling is requested
  const isScheduling = privacyStatus === 'scheduled' || !!publishAt;
  let isoPublishAt = null;
  if (isScheduling) {
    if (!publishAt) {
      return res.status(400).json({ error: 'A valid future date and time is required for scheduled publishing.' });
    }
    const scheduleDate = new Date(publishAt);
    if (isNaN(scheduleDate.getTime())) {
      return res.status(400).json({ error: 'Invalid datetime format for scheduling.' });
    }
    if (scheduleDate.getTime() <= Date.now() + 60 * 1000) {
      return res.status(400).json({ error: 'Scheduled publish time must be at least 2 minutes in the future.' });
    }
    isoPublishAt = scheduleDate.toISOString();
  }

  try {
    const oauth2Client = getOAuth2Client();
    if (!fs.existsSync(TOKEN_PATH)) {
      return res.status(401).json({ error: 'Not authenticated with YouTube. Please connect your account first.' });
    }

    activeUpload = {
      inProgress: true,
      progress: 0,
      stage: isScheduling ? 'Initializing YouTube scheduled upload session...' : 'Initializing YouTube API session...',
      result: null,
      error: null,
    };

    // Return immediately to client so UI can poll progress
    res.json({ message: 'Upload started', filename, isScheduling, publishAt: isoPublishAt });

    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
    const fileSize = fs.statSync(filePath).size;

    activeUpload.stage = isScheduling
      ? `Uploading video (Private mode for scheduled release on ${new Date(isoPublishAt).toLocaleString()})...`
      : 'Uploading video chunks to YouTube...';

    // Build YouTube status payload
    // Note: YouTube requires privacyStatus to be 'private' when publishAt is provided!
    const statusPayload = {
      selfDeclaredMadeForKids: false,
    };

    if (isScheduling) {
      statusPayload.privacyStatus = 'private';
      statusPayload.publishAt = isoPublishAt;
    } else {
      statusPayload.privacyStatus = privacyStatus || 'public';
    }

    const response = await youtube.videos.insert(
      {
        part: 'snippet,status',
        notifySubscribers: true,
        requestBody: {
          snippet: {
            title: title || filename,
            description: description || '',
            tags: tags || ['Shorts'],
            categoryId: categoryId || '27', // 27 = Education, 22 = People & Blogs
            defaultLanguage: 'en',
            defaultAudioLanguage: 'en',
          },
          status: statusPayload,
        },
        media: {
          body: fs.createReadStream(filePath),
        },
      },
      {
        onUploadProgress: (evt) => {
          const progress = Math.min(99, Math.round((evt.bytesRead / fileSize) * 100));
          activeUpload.progress = progress;
          activeUpload.stage = isScheduling
            ? `Uploading: ${progress}% • Will publish live on ${new Date(isoPublishAt).toLocaleDateString()} at ${new Date(isoPublishAt).toLocaleTimeString()}`
            : `Uploading: ${progress}% (${(evt.bytesRead / (1024 * 1024)).toFixed(1)}MB / ${(fileSize / (1024 * 1024)).toFixed(1)}MB)`;
        },
      }
    );

    const videoId = response.data.id;

    // Attach Custom Thumbnail to YouTube Video if available
    const baseName = filename.replace(/\.mp4$/i, '');
    const thumbPath = path.join(OUT_DIR, `${baseName}_thumbnail.png`);
    let thumbnailAttached = false;

    if (fs.existsSync(thumbPath)) {
      try {
        activeUpload.stage = isScheduling
          ? `Attaching custom high-converting thumbnail to scheduled release...`
          : 'Attaching custom high-converting thumbnail to YouTube video...';
        console.log(`🖼️ Uploading custom thumbnail for video ${videoId} from ${thumbPath}...`);
        
        await youtube.thumbnails.set({
          videoId,
          media: {
            mimeType: 'image/png',
            body: fs.createReadStream(thumbPath),
          },
        });
        thumbnailAttached = true;
        console.log('✅ Custom thumbnail attached to YouTube video successfully!');
      } catch (thumbErr) {
        console.warn('⚠️ Custom thumbnail could not be attached automatically via YouTube API (may require channel phone verification):', thumbErr.message);
      }
    }

    // Automatically post high-converting Discussion Pinned Comment if provided & enabled
    const savedMeta = getSavedMetadata();
    const targetComment = (pinnedComment !== undefined && pinnedComment !== null)
      ? pinnedComment
      : (savedMeta[filename]?.pinnedComment || null);

    let commentPosted = false;
    let commentId = null;

    if (autoPostComment && targetComment && targetComment.trim()) {
      try {
        activeUpload.stage = 'Posting creator discussion comment to YouTube...';
        console.log(`💬 Posting creator discussion comment to video ${videoId}...`);
        const commentRes = await youtube.commentThreads.insert({
          part: 'snippet',
          requestBody: {
            snippet: {
              videoId,
              topLevelComment: {
                snippet: {
                  textOriginal: targetComment.trim(),
                },
              },
            },
          },
        });
        commentId = commentRes.data?.id || null;
        commentPosted = true;
        console.log('✅ Creator discussion comment posted successfully! ID:', commentId);
      } catch (commentErr) {
        console.warn('⚠️ Discussion comment could not be posted automatically:', commentErr.message);
      }
    }

    activeUpload.inProgress = false;
    activeUpload.progress = 100;
    activeUpload.stage = isScheduling
      ? `🎉 Upload Complete! Scheduled with custom thumbnail for ${new Date(isoPublishAt).toLocaleString()}`
      : `🎉 Upload Complete! Video ${thumbnailAttached ? 'with custom thumbnail ' : ''}is live on YouTube.${commentPosted ? ' 💬 Discussion comment posted!' : ''}`;
      
    activeUpload.result = {
      videoId,
      youtubeUrl: `https://youtu.be/${videoId}`,
      shortsUrl: `https://youtube.com/shorts/${videoId}`,
      title: response.data.snippet.title,
      privacyStatus: response.data.status.privacyStatus,
      publishAt: isoPublishAt,
      isScheduled: isScheduling,
      publishedAt: response.data.snippet.publishedAt || new Date().toISOString(),
      thumbnailAttached,
      commentPosted,
      commentId,
      pinnedComment: targetComment,
    };

    // Save record to persistent uploads.json
    let uploads = getUploadsRecord();
    uploads[filename] = {
      uploaded: true,
      videoId,
      youtubeUrl: `https://youtu.be/${videoId}`,
      shortsUrl: `https://youtube.com/shorts/${videoId}`,
      title: response.data.snippet.title,
      privacyStatus: isScheduling ? 'scheduled' : response.data.status.privacyStatus,
      publishAt: isoPublishAt,
      isScheduled: isScheduling,
      publishedAt: activeUpload.result.publishedAt,
      thumbnailAttached,
      commentPosted,
      commentId,
      pinnedComment: targetComment,
    };
    saveUploadsRecord(uploads);

    console.log('✅ Video uploaded and recorded successfully:', activeUpload.result);
  } catch (err) {
    console.error('❌ Upload error:', err);
    activeUpload.inProgress = false;
    activeUpload.error = err.message || 'Upload failed';
  }
});

// 8b. API: Post or Re-post Discussion Comment to YouTube Video
app.post('/api/videos/:filename/comment', async (req, res) => {
  const { filename } = req.params;
  const { commentText } = req.body;
  const uploads = getUploadsRecord();
  const videoRecord = uploads[filename];

  if (!videoRecord || !videoRecord.videoId) {
    return res.status(404).json({ error: 'Video is not yet uploaded to YouTube or videoId is missing' });
  }

  const textToPost = commentText || videoRecord.pinnedComment || getSavedMetadata()[filename]?.pinnedComment;
  if (!textToPost || !textToPost.trim()) {
    return res.status(400).json({ error: 'No comment text provided or found in metadata' });
  }

  try {
    const oauth2Client = getOAuth2Client();
    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
    const response = await youtube.commentThreads.insert({
      part: ['snippet'],
      requestBody: {
        snippet: {
          videoId: videoRecord.videoId,
          topLevelComment: {
            snippet: {
              textOriginal: textToPost.trim(),
            },
          },
        },
      },
    });

    videoRecord.commentPosted = true;
    videoRecord.commentId = response.data?.id || null;
    videoRecord.pinnedComment = textToPost.trim();
    saveUploadsRecord(uploads);

    res.json({
      success: true,
      commentId: response.data?.id,
      videoId: videoRecord.videoId,
      comment: textToPost.trim(),
    });
  } catch (err) {
    console.error('Comment posting error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Logout / Disconnect YouTube
// ========================================================
// 8b. API: Instagram Authentication & Multi-Account Reels Automation (Playwright)
// ========================================================

// GET Instagram Session Status (active account or specific username)
app.get('/api/instagram/status', async (req, res) => {
  try {
    const { username } = req.query;
    const status = await igPlaywright.checkSessionStatus(username);
    res.json(status);
  } catch (err) {
    res.status(500).json({ isConnected: false, error: err.message });
  }
});

// GET All Connected Instagram Accounts
app.get('/api/instagram/accounts', (req, res) => {
  res.json(igPlaywright.listAccounts());
});

// POST Switch Active Instagram Account
app.post('/api/instagram/switch', (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'username is required' });
  const result = igPlaywright.switchActiveAccount(username);
  if (!result.success) return res.status(404).json(result);
  res.json(result);
});

// POST Start Interactive Playwright Login (Connect New or Additional IG Account)
app.post('/api/instagram/login', async (req, res) => {
  try {
    activeUpload = {
      inProgress: true,
      platform: 'instagram',
      progress: 10,
      stage: 'Launching interactive Instagram browser for login...',
      result: null,
      error: null,
    };

    res.json({ message: 'Login process started. Please complete login in the opened browser window.' });

    const result = await igPlaywright.startInteractiveLogin((progressData) => {
      activeUpload.stage = progressData.stage;
      activeUpload.progress = progressData.progress;
    });

    activeUpload.inProgress = false;
    if (result.success) {
      activeUpload.progress = 100;
      activeUpload.stage = `✅ Successfully connected to Instagram as @${result.username}!`;
      activeUpload.result = result;
    } else {
      activeUpload.error = result.error || 'Login window closed before authentication.';
    }
  } catch (err) {
    activeUpload.inProgress = false;
    activeUpload.error = err.message;
  }
});

// POST Disconnect Instagram Account
app.post('/api/instagram/disconnect', (req, res) => {
  try {
    const { username } = req.body;
    const result = igPlaywright.disconnectAccount(username);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST Upload Single Reel to Instagram (Supports targeting specific account)
app.post('/api/instagram/upload', async (req, res) => {
  const { filename, username, caption, shareToFeed = true, publishAt } = req.body;

  if (!filename) {
    return res.status(400).json({ error: 'filename is required' });
  }

  const filePath = path.join(OUT_DIR, filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `Video file ${filename} not found in out/` });
  }

  const baseName = filename.replace(/\.mp4$/i, '');
  const thumbPath = path.join(OUT_DIR, `${baseName}_thumbnail.png`);
  const isScheduling = !!publishAt && new Date(publishAt) > new Date();

  // If scheduled, save to persistent queue
  if (isScheduling) {
    let uploads = getUploadsRecord();
    const existing = uploads[filename] || {};
    const targetUser = username || igPlaywright.listAccounts().activeUsername || 'instagram';

    if (!existing.instagramAccounts) existing.instagramAccounts = {};
    existing.instagramAccounts[targetUser] = {
      uploaded: false,
      isScheduled: true,
      publishAt: new Date(publishAt).toISOString(),
      caption: caption || '',
      shareToFeed,
      username: targetUser,
    };

    existing.instagram = existing.instagramAccounts[targetUser];
    uploads[filename] = existing;
    saveUploadsRecord(uploads);

    return res.json({
      success: true,
      message: `Reel scheduled for ${new Date(publishAt).toLocaleString()} on @${targetUser}`,
      isScheduled: true,
      publishAt,
    });
  }

  if (activeUpload.inProgress) {
    return res.status(409).json({ error: 'Another upload is already in progress' });
  }

  activeUpload = {
    inProgress: true,
    platform: 'instagram',
    progress: 5,
    stage: 'Starting automated Instagram Reels uploader...',
    result: null,
    error: null,
  };

  res.json({ message: 'Instagram Reel upload initiated', filename });

  try {
    const uploadRes = await igPlaywright.uploadReel({
      username: username || null,
      videoPath: filePath,
      coverPath: fs.existsSync(thumbPath) ? thumbPath : null,
      caption: caption || '',
      shareToFeed,
      onProgress: (p) => {
        activeUpload.stage = p.stage;
        activeUpload.progress = p.progress;
      },
      headless: true,
    });

    activeUpload.inProgress = false;
    activeUpload.progress = 100;
    activeUpload.stage = `🎉 Reel published successfully to Instagram (@${uploadRes.username})!`;
    activeUpload.result = uploadRes;

    let uploads = getUploadsRecord();
    const existing = uploads[filename] || {};
    if (!existing.instagramAccounts) existing.instagramAccounts = {};

    existing.instagramAccounts[uploadRes.username] = {
      uploaded: true,
      isScheduled: false,
      reelUrl: uploadRes.reelUrl,
      username: uploadRes.username,
      publishedAt: uploadRes.publishedAt || new Date().toISOString(),
    };

    existing.instagram = existing.instagramAccounts[uploadRes.username];
    uploads[filename] = existing;
    saveUploadsRecord(uploads);
  } catch (err) {
    activeUpload.inProgress = false;
    activeUpload.error = err.message || 'Instagram upload failed';
  }
});

// ========================================================
// 8c. API: Unified Multi-Destination Publishing & Scheduling
// Supports multiple YouTube Channels and multiple Instagram Accounts simultaneously!
// ========================================================
app.post('/api/publish-multi', async (req, res) => {
  const {
    filename,
    platforms = ['youtube'],
    youtubeChannelIds: reqYtChannels,
    instagramUsernames: reqIgUsers,
    timing = 'now', // 'now' | 'schedule' | 'draft'
    publishAt,
    youtube = {},
    instagram = {},
  } = req.body;

  if (!filename) {
    return res.status(400).json({ error: 'filename is required' });
  }

  const filePath = path.join(OUT_DIR, filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: `Video file ${filename} not found in out/` });
  }

  const isScheduling = timing === 'schedule' && !!publishAt;
  const isoPublishAt = isScheduling ? new Date(publishAt).toISOString() : null;

  if (isScheduling && (!isoPublishAt || new Date(isoPublishAt) <= new Date(Date.now() + 60 * 1000))) {
    return res.status(400).json({ error: 'Scheduled time must be at least 2 minutes in the future.' });
  }

  // Resolve target YouTube Channels
  let targetYtChannelIds = [];
  if (platforms.includes('youtube')) {
    if (Array.isArray(reqYtChannels) && reqYtChannels.length > 0) {
      targetYtChannelIds = reqYtChannels;
    } else {
      const chReg = multiChannel.getChannelsRegistry();
      if (chReg.activeChannelId) targetYtChannelIds = [chReg.activeChannelId];
      else if (chReg.channels.length > 0) targetYtChannelIds = [chReg.channels[0].channelId];
    }
  }

  // Resolve target Instagram Accounts
  let targetIgUsernames = [];
  if (platforms.includes('instagram')) {
    if (Array.isArray(reqIgUsers) && reqIgUsers.length > 0) {
      targetIgUsernames = reqIgUsers;
    } else {
      const igReg = igPlaywright.listAccounts();
      if (igReg.activeUsername) targetIgUsernames = [igReg.activeUsername];
      else if (igReg.accounts.length > 0) targetIgUsernames = [igReg.accounts[0].username];
    }
  }

  if (targetYtChannelIds.length === 0 && targetIgUsernames.length === 0) {
    return res.status(400).json({ error: 'No active or selected destination channels found to publish to.' });
  }

  if (activeUpload.inProgress) {
    return res.status(409).json({ error: 'Another upload is currently in progress. Please wait.' });
  }

  const totalDestinations = targetYtChannelIds.length + targetIgUsernames.length;

  activeUpload = {
    inProgress: true,
    platform: platforms.join('+'),
    progress: 5,
    stage: isScheduling
      ? `Scheduling release for ${new Date(isoPublishAt).toLocaleString()} across ${totalDestinations} destination(s)...`
      : `Preparing publishing across ${totalDestinations} destination(s)...`,
    result: { youtubeChannels: [], instagramAccounts: [] },
    error: null,
  };

  res.json({
    message: 'Publishing process started',
    filename,
    platforms,
    targetYtChannelIds,
    targetIgUsernames,
    timing,
    publishAt: isoPublishAt,
  });

  try {
    let uploads = getUploadsRecord();
    const existing = uploads[filename] || {};
    if (!existing.channels) existing.channels = {};
    if (!existing.instagramAccounts) existing.instagramAccounts = {};

    const baseName = filename.replace(/\.mp4$/i, '');
    const thumbPath = path.join(OUT_DIR, `${baseName}_thumbnail.png`);
    const fileSize = fs.statSync(filePath).size;

    let stepIndex = 0;

    // 1. Upload/Schedule across all selected YouTube Channels
    for (const channelId of targetYtChannelIds) {
      stepIndex++;
      const clientObj = multiChannel.getOAuth2ClientForChannel(channelId, PORT);
      if (!clientObj) {
        console.warn(`YouTube channel ${channelId} OAuth client not available, skipping.`);
        continue;
      }

      const { oauth2Client, channel } = clientObj;
      const ytClient = google.youtube({ version: 'v3', auth: oauth2Client });

      activeUpload.stage = isScheduling
        ? `[${stepIndex}/${totalDestinations}] Scheduling on YouTube: "${channel.title}"...`
        : `[${stepIndex}/${totalDestinations}] Uploading to YouTube: "${channel.title}"...`;

      const statusPayload = { selfDeclaredMadeForKids: false };
      if (isScheduling) {
        statusPayload.privacyStatus = 'private';
        statusPayload.publishAt = isoPublishAt;
      } else {
        statusPayload.privacyStatus = youtube.privacyStatus || 'public';
      }

      const ytRes = await ytClient.videos.insert(
        {
          part: 'snippet,status',
          notifySubscribers: true,
          requestBody: {
            snippet: {
              title: youtube.title || filename,
              description: youtube.description || '',
              tags: youtube.tags || ['Shorts'],
              categoryId: youtube.categoryId || '27',
              defaultLanguage: 'en',
            },
            status: statusPayload,
          },
          media: { body: fs.createReadStream(filePath) },
        },
        {
          onUploadProgress: (evt) => {
            const pct = Math.min(99, Math.round((evt.bytesRead / fileSize) * 100));
            const baseProgress = ((stepIndex - 1) / totalDestinations) * 100;
            const stepSlice = (1 / totalDestinations) * 100;
            activeUpload.progress = Math.round(baseProgress + (pct / 100) * stepSlice * 0.85);
            activeUpload.stage = `[${stepIndex}/${totalDestinations}] YouTube ("${channel.title}"): ${pct}%...`;
          },
        }
      );

      const videoId = ytRes.data.id;
      let thumbnailAttached = false;

      // Attach High-Converting 4K Thumbnail to this channel's upload
      if (fs.existsSync(thumbPath)) {
        try {
          activeUpload.stage = `[${stepIndex}/${totalDestinations}] Attaching custom thumbnail on "${channel.title}"...`;
          await ytClient.thumbnails.set({
            videoId,
            media: { mimeType: 'image/png', body: fs.createReadStream(thumbPath) },
          });
          thumbnailAttached = true;
        } catch (thumbErr) {
          console.warn(`Could not attach thumbnail for ${channel.title}:`, thumbErr.message);
        }
      }

      // Automatically post high-converting Discussion Pinned Comment if provided
      const targetComment = youtube.pinnedComment || savedMetadata[filename]?.pinnedComment || null;
      let commentPosted = false;
      let commentId = null;
      if (youtube.autoPostComment !== false && targetComment && targetComment.trim()) {
        try {
          activeUpload.stage = `[${stepIndex}/${totalDestinations}] Posting creator discussion comment on "${channel.title}"...`;
          const cRes = await ytClient.commentThreads.insert({
            part: ['snippet'],
            requestBody: {
              snippet: {
                videoId,
                topLevelComment: {
                  snippet: { textOriginal: targetComment.trim() },
                },
              },
            },
          });
          commentId = cRes.data?.id || null;
          commentPosted = true;
          console.log(`✅ Creator discussion comment posted for ${channel.title}! ID:`, commentId);
        } catch (cErr) {
          console.warn(`Could not post discussion comment for ${channel.title}:`, cErr.message);
        }
      }

      const channelRecord = {
        uploaded: true,
        channelId: channel.channelId,
        channelTitle: channel.title,
        videoId,
        youtubeUrl: `https://youtu.be/${videoId}`,
        shortsUrl: `https://youtube.com/shorts/${videoId}`,
        isScheduled: isScheduling,
        publishAt: isoPublishAt,
        publishedAt: ytRes.data.snippet.publishedAt || new Date().toISOString(),
        thumbnailAttached,
        commentPosted,
        commentId,
        pinnedComment: targetComment,
      };

      existing.channels[channel.channelId] = channelRecord;

      // Keep top-level legacy fields updated with active or last channel
      existing.uploaded = true;
      existing.videoId = videoId;
      existing.youtubeUrl = `https://youtu.be/${videoId}`;
      existing.shortsUrl = `https://youtube.com/shorts/${videoId}`;
      existing.isScheduled = isScheduling;
      existing.publishAt = isoPublishAt;
      existing.publishedAt = channelRecord.publishedAt;
      existing.youtube = channelRecord;
      existing.commentPosted = commentPosted;
      existing.commentId = commentId;
      existing.pinnedComment = targetComment;

      if (!activeUpload.result.youtubeChannels) activeUpload.result.youtubeChannels = [];
      activeUpload.result.youtubeChannels.push(channelRecord);
      activeUpload.result.youtube = channelRecord;
    }

    // 2. Upload/Schedule across all selected Instagram Accounts
    for (const igUsername of targetIgUsernames) {
      stepIndex++;
      activeUpload.stage = `[${stepIndex}/${totalDestinations}] Publishing Reel to Instagram: @${igUsername}...`;

      const igRes = await igPlaywright.uploadReel({
        username: igUsername,
        videoPath: filePath,
        coverPath: fs.existsSync(thumbPath) ? thumbPath : null,
        caption: instagram.caption || '',
        shareToFeed: instagram.shareToFeed !== false,
        onProgress: (p) => {
          const baseProgress = ((stepIndex - 1) / totalDestinations) * 100;
          const stepSlice = (1 / totalDestinations) * 100;
          activeUpload.progress = Math.round(baseProgress + (p.progress / 100) * stepSlice);
          activeUpload.stage = `[${stepIndex}/${totalDestinations}] Instagram (@${igUsername}): ${p.stage}`;
        },
        headless: false,
      });

      const igRecord = {
        uploaded: true,
        username: igRes.username || igUsername,
        reelUrl: igRes.reelUrl,
        publishedAt: igRes.publishedAt || new Date().toISOString(),
      };

      existing.instagramAccounts[igRecord.username] = igRecord;
      existing.instagram = igRecord;

      if (!activeUpload.result.instagramAccounts) activeUpload.result.instagramAccounts = [];
      activeUpload.result.instagramAccounts.push(igRecord);
      activeUpload.result.instagram = igRecord;
    }

    uploads[filename] = existing;
    saveUploadsRecord(uploads);

    activeUpload.inProgress = false;
    activeUpload.progress = 100;
    activeUpload.stage = isScheduling
      ? `🎉 Successfully scheduled release across ${totalDestinations} destination(s)!`
      : `🎉 Successfully published across ${totalDestinations} destination(s)!`;
  } catch (err) {
    console.error('Multi-destination publish error:', err);
    activeUpload.inProgress = false;
    activeUpload.error = err.message || 'Publishing failed';
  }
});

// 8d. API: Sovereign Niche 1-Click Publishing & Scheduling
app.post('/api/niches/:nicheId/publish', async (req, res) => {
  const { nicheId } = req.params;
  const {
    filename,
    target = 'both', // 'youtube' | 'instagram' | 'both'
    mode = 'direct', // 'direct' | 'schedule'
    publishAt = null,
  } = req.body;

  if (!filename) return res.status(400).json({ error: 'filename is required' });

  const niches = multiChannel.getNichesRegistry();
  const niche = niches[nicheId];
  if (!niche) return res.status(404).json({ error: `Niche ${nicheId} not found` });

  const platforms = [];
  const ytChannelIds = [];
  const igUsernames = [];

  if (target === 'youtube' || target === 'both') {
    if (niche.youtube && niche.youtube.channelId) {
      platforms.push('youtube');
      ytChannelIds.push(niche.youtube.channelId);
    }
  }

  if (target === 'instagram' || target === 'both') {
    if (niche.instagram && niche.instagram.username) {
      platforms.push('instagram');
      igUsernames.push(niche.instagram.username);
    }
  }

  if (platforms.length === 0) {
    return res.status(400).json({
      error: `No connected ${target} accounts configured for niche "${niche.name}". Please connect your account first.`
    });
  }

  // Set normalized body for multi-destination publisher
  req.body.platforms = platforms;
  req.body.youtubeChannelIds = ytChannelIds;
  req.body.instagramUsernames = igUsernames;
  req.body.timing = mode === 'schedule' ? 'schedule' : 'now';
  req.body.publishAt = publishAt;

  // Delegate directly to publish-multi handler logic by triggering standard route
  // In Express, we can re-route by calling the same handler or invoking axios/fetch or running the logic
  // We will call the publish handler directly!
  // To keep code perfectly DRY and robust, we can invoke the internal handler
  try {
    const filePath = path.join(OUT_DIR, filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: `Video file ${filename} not found in out/` });
    }

    // Call /api/publish-multi logic
    if (activeUpload.inProgress) {
      return res.status(409).json({ error: 'Another upload is already in progress' });
    }

    const isScheduling = mode === 'schedule' && !!publishAt;
    const isoPublishAt = isScheduling ? new Date(publishAt).toISOString() : null;

    activeUpload = {
      inProgress: true,
      platform: platforms.length > 1 ? 'both' : platforms[0],
      progress: 5,
      stage: `Initializing ${target.toUpperCase()} release for ${niche.name}...`,
      result: null,
      error: null,
    };

    res.json({
      message: `Publishing initiated for ${niche.name} (${target.toUpperCase()})`,
      niche: niche.name,
      target,
      mode: isScheduling ? 'schedule' : 'direct',
      publishAt: isoPublishAt,
      platforms,
      filename,
    });

    // Run async background publish
    (async () => {
      try {
        const savedMetadata = getSavedMetadata();
        const meta = savedMetadata[filename] || {};
        const title = meta.title || filename.replace('.mp4', '').replace(/_/g, ' ');
        const description = meta.description || '';
        const tags = meta.tags || niche.defaultTags || [];
        const thumbPath = path.join(OUT_DIR, `${filename.replace(/\.mp4$/i, '')}_thumbnail.png`);

        const uploads = getUploadsRecord();
        const existing = uploads[filename] || { filename, channels: {}, instagramAccounts: {} };

        // 1. YouTube Upload
        if (platforms.includes('youtube') && ytChannelIds.length > 0) {
          for (const chId of ytChannelIds) {
            activeUpload.stage = `Uploading to YouTube channel: ${niche.youtube.title}...`;
            activeUpload.progress = 20;

            const clientObj = multiChannel.getOAuth2ClientForChannel(chId);
            if (!clientObj) throw new Error(`Authentication client missing for channel ${chId}`);

            const youtube = google.youtube({ version: 'v3', auth: clientObj.oauth2Client });
            const fileSize = fs.statSync(filePath).size;

            const ytRes = await youtube.videos.insert({
              part: 'snippet,status',
              requestBody: {
                snippet: { title, description, tags, categoryId: '27' },
                status: {
                  privacyStatus: isScheduling ? 'private' : 'public',
                  publishAt: isoPublishAt,
                  selfDeclaredMadeForKids: false,
                },
              },
              media: { body: fs.createReadStream(filePath) },
            });

            const uploadedVideoId = ytRes.data.id;
            activeUpload.progress = 60;

            // Thumbnail
            if (uploadedVideoId && fs.existsSync(thumbPath)) {
              try {
                await youtube.thumbnails.set({
                  videoId: uploadedVideoId,
                  media: { body: fs.createReadStream(thumbPath) },
                });
              } catch (thErr) {
                console.warn('Thumbnail set warning:', thErr.message);
              }
            }

            // Discussion Comment
            const targetComment = meta.pinnedComment || null;
            let commentPosted = false;
            let commentId = null;
            if (uploadedVideoId && targetComment && targetComment.trim()) {
              try {
                const cRes = await youtube.commentThreads.insert({
                  part: ['snippet'],
                  requestBody: {
                    snippet: {
                      videoId: uploadedVideoId,
                      topLevelComment: {
                        snippet: {
                          textOriginal: targetComment.trim(),
                        },
                      },
                    },
                  },
                });
                commentId = cRes.data?.id || null;
                commentPosted = true;
                console.log(`✅ Discussion comment posted for channel ${niche.youtube.title}!`);
              } catch (cErr) {
                console.warn('Comment post warning:', cErr.message);
              }
            }

            existing.channels[chId] = {
              uploaded: true,
              videoId: uploadedVideoId,
              publishAt: isoPublishAt,
              isScheduled,
              channelTitle: niche.youtube.title,
              publishedAt: new Date().toISOString(),
              commentPosted,
              commentId,
              pinnedComment: targetComment,
            };
            existing.youtube = existing.channels[chId];
          }
        }

        // 2. Instagram Upload
        if (platforms.includes('instagram') && igUsernames.length > 0) {
          for (const igUser of igUsernames) {
            activeUpload.stage = `Uploading Reel to Instagram: @${igUser}...`;
            activeUpload.progress = 75;

            const igRes = await igPlaywright.uploadReel({
              username: igUser,
              videoPath: filePath,
              coverPath: fs.existsSync(thumbPath) ? thumbPath : null,
              caption: `${title}\n\n${description}`,
              shareToFeed: true,
              onProgress: (p) => {
                activeUpload.stage = p.stage;
                activeUpload.progress = 75 + Math.floor(p.progress * 0.2);
              },
              headless: true,
            });

            existing.instagramAccounts[igUser] = {
              uploaded: true,
              username: igUser,
              reelUrl: igRes.reelUrl,
              publishedAt: new Date().toISOString(),
            };
            existing.instagram = existing.instagramAccounts[igUser];
          }
        }

        uploads[filename] = existing;
        saveUploadsRecord(uploads);

        activeUpload.inProgress = false;
        activeUpload.progress = 100;
        activeUpload.stage = isScheduling
          ? `🎉 Successfully scheduled release for ${niche.name}!`
          : `🎉 Successfully published to ${niche.name}!`;
      } catch (err) {
        console.error(`Error in niche publish for ${nicheId}:`, err);
        activeUpload.inProgress = false;
        activeUpload.error = err.message || 'Niche publish failed';
      }
    })();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========================================================
// 9. API: Settings & YouTube API Credentials Configuration
// ========================================================

// GET Settings status & active channel info (Multi-Project & Multi-Channel)
app.get('/api/settings/youtube', async (req, res) => {
  const credReg = multiChannel.getCredentialsRegistry();
  const chReg = multiChannel.getChannelsRegistry();
  const activeChannel =
    chReg.channels.find((c) => c.channelId === chReg.activeChannelId) || chReg.channels[0] || null;

  const hasSecrets = credReg.projects.length > 0 || fs.existsSync(CLIENT_SECRETS_PATH);
  const hasToken = chReg.channels.length > 0 || fs.existsSync(TOKEN_PATH);

  let authUrl = null;
  if (hasSecrets) {
    try {
      const { oauth2Client, credentialId } = multiChannel.getOAuth2ClientForCredential(null, PORT);
      const statePayload = Buffer.from(JSON.stringify({ credentialId })).toString('base64');
      authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: [
          'https://www.googleapis.com/auth/youtube.upload',
          'https://www.googleapis.com/auth/youtube',
          'https://www.googleapis.com/auth/youtube.readonly',
          'https://www.googleapis.com/auth/userinfo.profile',
        ],
        state: statePayload,
      });
    } catch (e) {
      console.warn('OAuth2 client generation warning:', e.message);
    }
  }

  res.json({
    hasSecrets,
    hasToken,
    isConnected: !!activeChannel,
    channel: activeChannel,
    channels: chReg.channels,
    activeChannelId: chReg.activeChannelId,
    credentials: credReg.projects,
    activeProjectId: credReg.activeProjectId,
    authUrl,
  });
});

// POST Save YouTube client_secrets.json directly from UI paste/upload (Adds project to multi-credential registry)
app.post('/api/settings/save-secrets', (req, res) => {
  let { jsonContent, name } = req.body;
  if (!jsonContent) {
    return res.status(400).json({ error: 'Please paste your client_secrets.json content.' });
  }

  try {
    const project = multiChannel.addCredential({ name, jsonContent });
    const { oauth2Client, credentialId } = multiChannel.getOAuth2ClientForCredential(project.id, PORT);
    const statePayload = Buffer.from(JSON.stringify({ credentialId })).toString('base64');

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/youtube.upload',
        'https://www.googleapis.com/auth/youtube',
        'https://www.googleapis.com/auth/youtube.readonly',
        'https://www.googleapis.com/auth/userinfo.profile',
      ],
      state: statePayload,
    });

    console.log(`✅ Google Cloud credentials "${project.name}" successfully saved via Settings UI`);
    res.json({
      success: true,
      message: `Google Cloud credentials "${project.name}" saved! Click "Confirm & Connect Channel" to authenticate.`,
      project,
      authUrl,
    });
  } catch (err) {
    res.status(400).json({ error: 'Failed to parse/save credentials: ' + err.message });
  }
});

// POST Reset YouTube Credentials
app.post('/api/settings/reset-secrets', (req, res) => {
  try {
    if (fs.existsSync(CLIENT_SECRETS_PATH)) fs.unlinkSync(CLIENT_SECRETS_PATH);
    if (fs.existsSync(TOKEN_PATH)) fs.unlinkSync(TOKEN_PATH);
    if (fs.existsSync(multiChannel.CREDENTIALS_FILE)) fs.unlinkSync(multiChannel.CREDENTIALS_FILE);
    if (fs.existsSync(multiChannel.CHANNELS_FILE)) fs.unlinkSync(multiChannel.CHANNELS_FILE);
    res.json({ success: true, message: 'YouTube API credentials and connection reset.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 💡 AI VIDEO TOPIC PIPELINE REST APIS
// ==========================================
const PIPELINE_FILE = path.join(__dirname, 'pipeline.json');

function getPipelineData() {
  if (!fs.existsSync(PIPELINE_FILE)) {
    const initial = { self_improvement: [], finance: [], health: [] };
    fs.writeFileSync(PIPELINE_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  try {
    return JSON.parse(fs.readFileSync(PIPELINE_FILE, 'utf-8'));
  } catch (e) {
    return { self_improvement: [], finance: [], health: [] };
  }
}

function savePipelineData(data) {
  fs.writeFileSync(PIPELINE_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// 1. GET /api/pipeline?niche=health
app.get('/api/pipeline', (req, res) => {
  const { niche } = req.query;
  const data = getPipelineData();
  if (niche && niche !== 'all' && data[niche]) {
    return res.json({ niche, topics: data[niche] || [] });
  }
  return res.json({ niches: data });
});

// 2. POST /api/pipeline/topics - Add manual or suggested topic
app.post('/api/pipeline/topics', (req, res) => {
  const { title, niche = 'self_improvement', source = 'manual', status = 'upcoming' } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Topic title is required' });
  }
  // Strip {no topics} modifier if present
  const cleanTitle = title.replace(/\{\s*no\s+topics?\s*\}/gi, '').trim();
  if (!cleanTitle) {
    return res.status(400).json({ error: 'Valid topic title is required' });
  }
  const data = getPipelineData();
  if (!data[niche]) data[niche] = [];

  const newTopic = {
    id: `top_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    title: cleanTitle,
    niche,
    status: status, // 'upcoming' | 'in_progress' | 'completed'
    source: source, // 'manual' | 'ai_suggested' | 'ai_generated'
    createdAt: new Date().toISOString(),
  };

  data[niche].push(newTopic);
  savePipelineData(data);
  res.json({ success: true, topic: newTopic });
});

// 3. PATCH /api/pipeline/topics/:id - Toggle completed or in_progress
app.patch('/api/pipeline/topics/:id', (req, res) => {
  const { id } = req.params;
  const { status, title, videoFilename } = req.body;
  const data = getPipelineData();

  let foundTopic = null;
  for (const nicheKey of Object.keys(data)) {
    const list = data[nicheKey];
    const idx = list.findIndex(t => t.id === id);
    if (idx !== -1) {
      if (status) {
        list[idx].status = status;
        if (status === 'completed') {
          list[idx].completedAt = new Date().toISOString();
        } else {
          delete list[idx].completedAt;
        }
      }
      if (title) list[idx].title = title;
      if (videoFilename !== undefined) list[idx].videoFilename = videoFilename;
      foundTopic = list[idx];
      break;
    }
  }

  if (!foundTopic) {
    return res.status(404).json({ error: 'Topic not found' });
  }

  savePipelineData(data);
  res.json({ success: true, topic: foundTopic });
});

// 4. DELETE /api/pipeline/topics/:id
app.delete('/api/pipeline/topics/:id', (req, res) => {
  const { id } = req.params;
  const data = getPipelineData();
  let deleted = false;

  for (const nicheKey of Object.keys(data)) {
    const initialLen = data[nicheKey].length;
    data[nicheKey] = data[nicheKey].filter(t => t.id !== id);
    if (data[nicheKey].length < initialLen) {
      deleted = true;
      break;
    }
  }

  if (!deleted) {
    return res.status(404).json({ error: 'Topic not found' });
  }

  savePipelineData(data);
  res.json({ success: true, id });
});

// 5. POST /api/pipeline/suggest - Enhanced Multi-Pillar AI Topic Ideation Engine
app.post('/api/pipeline/suggest', (req, res) => {
  const { niche = 'self_improvement', count = 2 } = req.body;
  const data = getPipelineData();
  if (!data[niche]) data[niche] = [];

  const existingTitles = new Set((data[niche] || []).map(t => t.title.toLowerCase()));

  // Curated High-Converting Niche Matrices mapped to specific pillars
  const nicheMatrices = {
    self_improvement: [
      // Deeply Relatable Teenager Psychology & Mindset
      {
        title: "Why You Feel Like a Side Character in Your Own Life",
        category: "teen_psychology",
        categoryLabel: "Teen Psychology"
      },
      {
        title: "The Fear of Being Seen Trying (Why Teens Pretend Not to Care)",
        category: "teen_psychology",
        categoryLabel: "Teen Psychology"
      },
      {
        title: "Why You Overthink Every Text and Replay Conversations at 2 AM",
        category: "teen_psychology",
        categoryLabel: "Teen Psychology"
      },
      {
        title: "The Exhaustion of Pretending You're Fine at School All Day",
        category: "teen_psychology",
        categoryLabel: "Teen Psychology"
      },
      {
        title: "Why Losing Friends in High School Hurts Worse Than a Breakup",
        category: "teen_psychology",
        categoryLabel: "Teen Psychology"
      },
      {
        title: "Comparing Your Behind-the-Scenes to Everyone's Highlight Reel",
        category: "teen_psychology",
        categoryLabel: "Teen Psychology"
      },
      {
        title: "The Spotlight Illusion: Why Nobody Is Actually Judging You That Closely",
        category: "teen_psychology",
        categoryLabel: "Teen Psychology"
      },
      {
        title: "Why Parental Criticism Stings 10x Harder During Teenage Years",
        category: "teen_psychology",
        categoryLabel: "Teen Psychology"
      },
      {
        title: "The Anxiety of Group Projects and Speaking Up in Class",
        category: "teen_psychology",
        categoryLabel: "Teen Psychology"
      },
      {
        title: "Why You Distance Yourself When People Get Too Close (Avoidant Instincts)",
        category: "teen_psychology",
        categoryLabel: "Teen Psychology"
      },
      {
        title: "Starting From Scratch: What to Do When You Have No Direction or Passion",
        category: "teen_psychology",
        categoryLabel: "Teen Psychology"
      },
      {
        title: "How to Stop Comparing Your Looks and Personality to Others Online",
        category: "teen_psychology",
        categoryLabel: "Teen Psychology"
      }
    ],

    health: [
      // Essential Habits & Health Tips for Teens, Lost & Confused People + Bio Telemetry
      {
        title: "The 10-Minute Morning Anchor (For When You Wake Up Lost & Aimless)",
        category: "habits_for_the_lost",
        categoryLabel: "Habits for the Lost"
      },
      {
        title: "How to Break the 'Freeze Response' When Doomscrolling Paralyzes You",
        category: "habits_for_the_lost",
        categoryLabel: "Habits for the Lost"
      },
      {
        title: "The 48-Hour Dopamine Baseline Reset (Ending Teen Sensory Burnout)",
        category: "habits_for_the_lost",
        categoryLabel: "Habits for the Lost"
      },
      {
        title: "Rebuilding Self-Trust (What to Do When You Keep Breaking Promises to Yourself)",
        category: "habits_for_the_lost",
        categoryLabel: "Habits for the Lost"
      },
      {
        title: "The Low-Energy Survival Protocol (Getting Through Days When You Barely Function)",
        category: "habits_for_the_lost",
        categoryLabel: "Habits for the Lost"
      },
      {
        title: "The 2-Minute Micro-Action Rule That Destroys Chronic Procrastination",
        category: "habits_for_the_lost",
        categoryLabel: "Habits for the Lost"
      },
      {
        title: "Why Clean Spaces Rewire Chaotic Minds (The Environmental Anchor)",
        category: "habits_for_the_lost",
        categoryLabel: "Habits for the Lost"
      },
      {
        title: "The 3-Minute Vagus Nerve Reset (Instant Parasympathetic Recovery)",
        category: "clinical_telemetry",
        categoryLabel: "Clinical Telemetry"
      },
      {
        title: "The 90-Minute Caffeine Delay Rule (Resetting Your Adenosine Receptors)",
        category: "clinical_telemetry",
        categoryLabel: "Clinical Telemetry"
      },
      {
        title: "Why You Wake Up Exhausted After 8 Hours (Cortisol Awakening Glitch)",
        category: "clinical_telemetry",
        categoryLabel: "Clinical Telemetry"
      },
      {
        title: "Teen Circadian Phase Delay: Why Your Brain Stays Awake Past Midnight",
        category: "clinical_telemetry",
        categoryLabel: "Clinical Telemetry"
      },
      {
        title: "The Glucose Spike-and-Crash Cycle (Why You Fall Asleep at 2 PM After Lunch)",
        category: "clinical_telemetry",
        categoryLabel: "Clinical Telemetry"
      }
    ],

    finance: [
      // Pillar A: Basic to Intermediate Finance for Early Adults
      {
        title: "The 30% Credit Card Utilization Rule Every 18-Year-Old Must Know",
        category: "early_adult_foundations",
        categoryLabel: "Early Adult Money"
      },
      {
        title: "Why Leaving Cash in a Big Bank Savings Account Loses You 4% a Year",
        category: "early_adult_foundations",
        categoryLabel: "Early Adult Money"
      },
      {
        title: "The First $10,000 Emergency Fund Roadmap (Step-by-Step for Your 20s)",
        category: "early_adult_foundations",
        categoryLabel: "Early Adult Money"
      },
      {
        title: "The New Car Financing Trap That Destroys Early Adult Net Worth",
        category: "early_adult_foundations",
        categoryLabel: "Early Adult Money"
      },
      {
        title: "How to Read Your First Paycheck (Taxes, FICA, and 401k Match Explained)",
        category: "early_adult_foundations",
        categoryLabel: "Early Adult Money"
      },
      {
        title: "The Student Loan Avalanche vs Snowball Method (Paying Off Debt 3x Faster)",
        category: "early_adult_foundations",
        categoryLabel: "Early Adult Money"
      },

      // Pillar B: Advanced Wealth Compounding & Financial Hacks
      {
        title: "Roth IRA Math: Why Starting at Age 20 vs 30 Costs You $1.2 Million",
        category: "wealth_hacks",
        categoryLabel: "Wealth Hack"
      },
      {
        title: "The 50% Pay Raise Rule (How to Completely Immunize Against Lifestyle Creep)",
        category: "wealth_hacks",
        categoryLabel: "Wealth Hack"
      },
      {
        title: "Index Funds vs Stock Picking: The Mathematical Truth Wall Street Hides",
        category: "wealth_hacks",
        categoryLabel: "Wealth Hack"
      },
      {
        title: "The 3 Silent Subscription and Bank Fee Leaks Draining $3,000/Year",
        category: "wealth_hacks",
        categoryLabel: "Wealth Hack"
      },
      {
        title: "Asymmetric Leverage: Why the Rich Trade Systems Instead of Hours",
        category: "wealth_hacks",
        categoryLabel: "Wealth Hack"
      },
      {
        title: "How to Legally Structure a Side Hustle for Maximum Tax Write-Offs",
        category: "wealth_hacks",
        categoryLabel: "Wealth Hack"
      }
    ]
  };

  const pool = nicheMatrices[niche] || nicheMatrices.self_improvement;
  const available = pool.filter(item => !existingTitles.has(item.title.toLowerCase()));

  // Balanced picking across sub-pillars if multiple available
  let picks = [];
  if (available.length >= count) {
    // Group by category to pick diverse topics
    const byCategory = {};
    available.forEach(item => {
      if (!byCategory[item.category]) byCategory[item.category] = [];
      byCategory[item.category].push(item);
    });
    const categories = Object.keys(byCategory);
    let catIdx = 0;
    while (picks.length < count && available.length > 0) {
      const currentCat = categories[catIdx % categories.length];
      if (byCategory[currentCat] && byCategory[currentCat].length > 0) {
        picks.push(byCategory[currentCat].shift());
      } else {
        const remaining = available.filter(x => !picks.includes(x));
        if (remaining.length > 0) picks.push(remaining[0]);
        else break;
      }
      catIdx++;
    }
  } else {
    picks = (available.length > 0 ? available : pool).slice(0, count);
  }

  const newTopics = picks.map(item => ({
    id: `top_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    title: item.title,
    category: item.category || 'general',
    categoryLabel: item.categoryLabel || 'Topic',
    niche,
    status: 'upcoming',
    source: 'ai_suggested',
    createdAt: new Date().toISOString()
  }));

  data[niche].push(...newTopics);
  savePipelineData(data);

  res.json({ success: true, suggestions: newTopics });
});

// =========================================================
// PRODUCTS ENGINE API
// =========================================================
const PRODUCTS_DIR = path.resolve(__dirname, '..', 'Products');
const PUBLIC_PRODUCTS_DIR = path.resolve(__dirname, '..', 'public', 'products');

app.use('/products', express.static(PUBLIC_PRODUCTS_DIR));

// Helper to get PDF page count using pdfinfo
function getPdfPageCount(pdfPath) {
  try {
    const { execSync } = require('child_process');
    const out = execSync(`pdfinfo "${pdfPath}"`, { encoding: 'utf-8' });
    const match = out.match(/Pages:\s+(\d+)/i);
    if (match) return parseInt(match[1], 10);
  } catch (e) {}
  return null;
}

// 1. GET /api/products - List all product PDFs in Products/
app.get('/api/products', (req, res) => {
  if (!fs.existsSync(PRODUCTS_DIR)) {
    return res.json({ products: [] });
  }

  try {
    const files = fs.readdirSync(PRODUCTS_DIR).filter(f => f.toLowerCase().endsWith('.pdf'));
    const products = files.map(file => {
      const fullPath = path.join(PRODUCTS_DIR, file);
      const stat = fs.statSync(fullPath);
      const stem = path.basename(file, path.extname(file));
      const pageCount = getPdfPageCount(fullPath);

      // Check existing extracted pages in public/products/<stem>
      const cachedPages = [];
      const stemDir = path.join(PUBLIC_PRODUCTS_DIR, stem);
      if (fs.existsSync(stemDir)) {
        const pageFiles = fs.readdirSync(stemDir).filter(f => f.startsWith('page_') && f.endsWith('.png'));
        pageFiles.forEach(pf => {
          const m = pf.match(/page_(\d+)\.png/);
          if (m) cachedPages.push(parseInt(m[1], 10));
        });
        cachedPages.sort((a, b) => a - b);
      }

      return {
        name: file,
        stem,
        sizeBytes: stat.size,
        pageCount,
        cachedPages,
        previewUrl: cachedPages.length > 0 ? `/products/${stem}/page_${cachedPages[0]}.png` : null
      };
    });

    res.json({ products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. POST /api/products/extract - Extract a specific page on demand
app.post('/api/products/extract', (req, res) => {
  const { pdf, page } = req.body;
  if (!pdf || !page) {
    return res.status(400).json({ error: 'Missing pdf or page number' });
  }

  const { execSync } = require('child_process');
  try {
    const scriptPath = path.resolve(__dirname, '..', 'scripts', 'extract_product_page.py');
    const out = execSync(`python3 "${scriptPath}" --pdf "${pdf}" --page ${page}`, { encoding: 'utf-8' });
    const stem = path.basename(pdf, path.extname(pdf));
    res.json({
      success: true,
      message: out.trim(),
      publicPath: `products/${stem}/page_${page}.png`,
      url: `/products/${stem}/page_${page}.png`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n========================================================`);
  console.log(`🚀 RightClips Studio is running at: http://localhost:${PORT}`);
  console.log(`========================================================\n`);
});
