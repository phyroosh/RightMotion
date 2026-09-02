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

// 1. API: List all rendered videos sorted by date (newest first) & categorized with live upload and schedule status
app.get('/api/videos', async (req, res) => {
  try {
    if (!fs.existsSync(OUT_DIR)) {
      return res.json({
        videos: [],
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

      return {
        filename,
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

    const longForms = videos.filter((v) => v.isLongForm);
    const shorts = videos.filter((v) => !v.isLongForm);
    const uploadedVideos = videos.filter((v) => v.isUploaded && !v.isScheduled);
    const scheduledVideos = videos.filter((v) => v.isScheduled);
    const unuploadedVideos = videos.filter((v) => !v.isUploaded && !v.isScheduled);

    res.json({
      videos,
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
  const { channelId } = req.body;
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
  const { channelId } = req.body;
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
  const { filename, title, description, tags, categoryId, privacyStatus, publishAt } = req.body;

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

    activeUpload.inProgress = false;
    activeUpload.progress = 100;
    activeUpload.stage = isScheduling
      ? `🎉 Upload Complete! Scheduled with custom thumbnail for ${new Date(isoPublishAt).toLocaleString()}`
      : `🎉 Upload Complete! Video ${thumbnailAttached ? 'with custom thumbnail ' : ''}is live on YouTube.`;
      
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
    };
    saveUploadsRecord(uploads);

    console.log('✅ Video uploaded and recorded successfully:', activeUpload.result);
  } catch (err) {
    console.error('❌ Upload error:', err);
    activeUpload.inProgress = false;
    activeUpload.error = err.message || 'Upload failed';
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

app.listen(PORT, () => {
  console.log(`\n========================================================`);
  console.log(`🚀 RightClips Studio is running at: http://localhost:${PORT}`);
  console.log(`========================================================\n`);
});
