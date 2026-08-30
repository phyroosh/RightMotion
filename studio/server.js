const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const igPlaywright = require('./instagram_playwright');

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

// Helper to get OAuth2 client
function getOAuth2Client() {
  if (!fs.existsSync(CLIENT_SECRETS_PATH)) {
    throw new Error('client_secrets.json not found in studio directory');
  }
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
    } catch (e) {
      console.error('Failed to parse token.json:', e);
    }
  }

  return oauth2Client;
}

// Sync uploads with live YouTube channel
async function syncYouTubeUploads() {
  if (!fs.existsSync(TOKEN_PATH)) return;

  try {
    const oauth2Client = getOAuth2Client();
    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

    const channelRes = await youtube.channels.list({
      part: 'contentDetails,snippet',
      mine: true,
    });

    const channel = channelRes.data.items?.[0];
    const uploadsPlaylistId = channel?.contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsPlaylistId) return;

    const playlistRes = await youtube.playlistItems.list({
      part: 'snippet,status',
      playlistId: uploadsPlaylistId,
      maxResults: 50,
    });

    const ytVideos = playlistRes.data.items || [];
    let uploads = getUploadsRecord();
    let savedMetadata = getSavedMetadata();

    // Match YouTube videos with local files via metadata titles or keywords
    for (const yt of ytVideos) {
      const ytTitle = yt.snippet.title.trim();
      const ytVideoId = yt.snippet.resourceId.videoId;
      const ytPublishedAt = yt.snippet.publishedAt;
      const ytPrivacy = yt.status?.privacyStatus || 'public';

      // Find matching local file in metadata.json
      for (const [filename, meta] of Object.entries(savedMetadata)) {
        const metaTitle = (meta.title || '').trim();
        const metaTopic = (meta.topic || '').trim().toLowerCase();

        const isExactTitle = metaTitle && ytTitle.toLowerCase() === metaTitle.toLowerCase();
        const isTopicMatch = metaTopic && ytTitle.toLowerCase().includes(metaTopic);
        const isCleanMatch =
          (metaTopic === 'goggins' && ytTitle.toLowerCase().includes('goggins')) ||
          (metaTopic === 'motivation' && ytTitle.toLowerCase().includes('motivation')) ||
          (metaTopic === 'maturity' && ytTitle.toLowerCase().includes('mature')) ||
          (metaTopic === 'adhd' && ytTitle.toLowerCase().includes('adhd')) ||
          (metaTopic === 'breaks' && (ytTitle.toLowerCase().includes('break') || ytTitle.toLowerCase().includes('quitting'))) ||
          (metaTopic === 'comparison' && ytTitle.toLowerCase().includes('comparison')) ||
          (metaTopic === 'habits' && ytTitle.toLowerCase().includes('habit')) ||
          (metaTopic === 'procrastination' && ytTitle.toLowerCase().includes('procrastinat'));

        if (isExactTitle || isTopicMatch || isCleanMatch) {
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
    console.error('Auto YouTube sync error:', err.message);
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

// 3. API: Auth status & Channel Profile
app.get('/api/auth-status', async (req, res) => {
  try {
    if (!fs.existsSync(TOKEN_PATH)) {
      return res.json({ authenticated: false });
    }

    const oauth2Client = getOAuth2Client();
    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
    
    // Fetch channel profile info
    const response = await youtube.channels.list({
      part: 'snippet,statistics',
      mine: true,
    });

    if (response.data.items && response.data.items.length > 0) {
      const channel = response.data.items[0];
      const avatarUrl =
        channel.snippet.thumbnails?.high?.url ||
        channel.snippet.thumbnails?.medium?.url ||
        channel.snippet.thumbnails?.default?.url;

      return res.json({
        authenticated: true,
        channel: {
          title: channel.snippet.title,
          customUrl: channel.snippet.customUrl || `@${channel.snippet.title.replace(/\s+/g, '').toLowerCase()}`,
          avatar: `/api/channel-avatar?t=${Date.now()}`,
          directAvatar: avatarUrl,
          channelId: channel.id,
          subscriberCount: channel.statistics?.subscriberCount,
          videoCount: channel.statistics?.videoCount,
        },
      });
    }

    res.json({ authenticated: true, channel: null });
  } catch (err) {
    console.error('Auth verification error:', err.message);
    res.json({ authenticated: false, error: err.message });
  }
});

// Proxy channel avatar with NO CACHE to always serve current channel PFP
app.get('/api/channel-avatar', async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    if (!fs.existsSync(TOKEN_PATH)) {
      return res.redirect('https://ui-avatars.com/api/?name=YouTube&background=0071e3&color=fff');
    }
    const oauth2Client = getOAuth2Client();
    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
    const response = await youtube.channels.list({
      part: 'snippet',
      mine: true,
    });
    const channel = response.data.items?.[0];
    const avatarUrl =
      channel?.snippet?.thumbnails?.high?.url ||
      channel?.snippet?.thumbnails?.medium?.url ||
      channel?.snippet?.thumbnails?.default?.url;

    if (!avatarUrl) {
      const name = encodeURIComponent(channel?.snippet?.title || 'YouTube');
      return res.redirect(`https://ui-avatars.com/api/?name=${name}&background=0071e3&color=fff`);
    }

    const imgRes = await fetch(avatarUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });
    const arrayBuffer = await imgRes.arrayBuffer();
    res.setHeader('Content-Type', imgRes.headers.get('content-type') || 'image/jpeg');
    res.send(Buffer.from(arrayBuffer));
  } catch (err) {
    console.error('Failed to proxy avatar:', err);
    res.redirect('https://ui-avatars.com/api/?name=Judy+Insights&background=0071e3&color=fff');
  }
});

// 4. API: Get Google OAuth URL
app.get('/api/auth-url', (req, res) => {
  try {
    const oauth2Client = getOAuth2Client();
    const scopes = [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/youtube',
      'https://www.googleapis.com/auth/userinfo.profile',
    ];

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: scopes,
    });

    res.json({ url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. OAuth Callback Handler
app.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send('Authorization code missing');
  }

  try {
    const oauth2Client = getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));

    // Automatically sync uploads with the new channel
    await syncYouTubeUploads().catch(() => {});

    res.send(`
      <html>
        <head><title>YouTube Connected</title></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; background:#0f172a; color:white;">
          <div style="background:#1e293b; padding:40px 60px; border-radius:24px; text-align:center; box-shadow:0 20px 50px rgba(0,0,0,0.5); border:1px solid #334155;">
            <h1 style="color:#10b981; margin-bottom:12px;">✅ YouTube Studio Connected!</h1>
            <p style="color:#94a3b8; font-size:16px; margin-bottom:24px;">Your YouTube account has been updated and synced.</p>
            <a href="/" style="background:#0071e3; color:white; padding:12px 30px; border-radius:12px; text-decoration:none; font-weight:bold; font-size:15px;">Return to Studio</a>
          </div>
          <script>
            setTimeout(() => { window.location.href = '/'; }, 1500);
          </script>
        </body>
      </html>
    `);
  } catch (err) {
    console.error('Error exchanging token:', err);
    res.status(500).send(`Authentication Failed: ${err.message}`);
  }
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
// 8b. API: Instagram Authentication & Reels Automation (Playwright)
// ========================================================

// GET Instagram Session Status
app.get('/api/instagram/status', async (req, res) => {
  try {
    const status = await igPlaywright.checkSessionStatus();
    res.json(status);
  } catch (err) {
    res.status(500).json({ isConnected: false, error: err.message });
  }
});

// POST Start Interactive Playwright Login
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

// POST Disconnect Instagram Session
app.post('/api/instagram/disconnect', (req, res) => {
  try {
    const result = igPlaywright.disconnectSession();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST Upload Single Reel to Instagram
app.post('/api/instagram/upload', async (req, res) => {
  const { filename, caption, shareToFeed = true, publishAt } = req.body;

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
    uploads[filename] = {
      ...existing,
      instagram: {
        ...(existing.instagram || {}),
        uploaded: false,
        isScheduled: true,
        publishAt: new Date(publishAt).toISOString(),
        caption: caption || '',
        shareToFeed,
      },
    };
    saveUploadsRecord(uploads);
    return res.json({
      success: true,
      message: `Reel scheduled for ${new Date(publishAt).toLocaleString()}`,
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
    activeUpload.stage = '🎉 Reel published successfully to Instagram!';
    activeUpload.result = uploadRes;

    let uploads = getUploadsRecord();
    const existing = uploads[filename] || {};
    uploads[filename] = {
      ...existing,
      instagram: {
        uploaded: true,
        isScheduled: false,
        reelUrl: uploadRes.reelUrl,
        username: uploadRes.username,
        publishedAt: uploadRes.publishedAt || new Date().toISOString(),
      },
    };
    saveUploadsRecord(uploads);
  } catch (err) {
    activeUpload.inProgress = false;
    activeUpload.error = err.message || 'Instagram upload failed';
  }
});

// ========================================================
// 8c. API: Unified Multi-Platform Blast & Scheduling (YouTube + Instagram)
// ========================================================
app.post('/api/publish-multi', async (req, res) => {
  const {
    filename,
    platforms = ['youtube'],
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

  if (activeUpload.inProgress) {
    return res.status(409).json({ error: 'Another upload is currently in progress. Please wait.' });
  }

  activeUpload = {
    inProgress: true,
    platform: platforms.join('+'),
    progress: 5,
    stage: isScheduling
      ? `Scheduling release for ${new Date(isoPublishAt).toLocaleString()} on [${platforms.join(', ').toUpperCase()}]...`
      : `Preparing multi-platform publishing for [${platforms.join(', ').toUpperCase()}]...`,
    result: {},
    error: null,
  };

  res.json({
    message: 'Publishing process started',
    filename,
    platforms,
    timing,
    publishAt: isoPublishAt,
  });

  try {
    let uploads = getUploadsRecord();
    const existing = uploads[filename] || {};
    const baseName = filename.replace(/\.mp4$/i, '');
    const thumbPath = path.join(OUT_DIR, `${baseName}_thumbnail.png`);

    // 1. YouTube Execution / Scheduling
    if (platforms.includes('youtube')) {
      activeUpload.stage = isScheduling
        ? `Scheduling YouTube release on API...`
        : `Uploading to YouTube Shorts...`;

      const oauth2Client = getOAuth2Client();
      const ytClient = google.youtube({ version: 'v3', auth: oauth2Client });
      const fileSize = fs.statSync(filePath).size;

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
            activeUpload.progress = Math.round(pct * 0.5); // 0-50% for YouTube
            activeUpload.stage = `YouTube Upload: ${pct}%...`;
          },
        }
      );

      const videoId = ytRes.data.id;

      // Attach Thumbnail
      if (fs.existsSync(thumbPath)) {
        try {
          await ytClient.thumbnails.set({
            videoId,
            media: { mimeType: 'image/png', body: fs.createReadStream(thumbPath) },
          });
        } catch (e) {}
      }

      existing.uploaded = true;
      existing.videoId = videoId;
      existing.youtubeUrl = `https://youtu.be/${videoId}`;
      existing.shortsUrl = `https://youtube.com/shorts/${videoId}`;
      existing.isScheduled = isScheduling;
      existing.publishAt = isoPublishAt;
      existing.youtube = {
        uploaded: true,
        videoId,
        youtubeUrl: `https://youtu.be/${videoId}`,
        shortsUrl: `https://youtube.com/shorts/${videoId}`,
        isScheduled: isScheduling,
        publishAt: isoPublishAt,
        publishedAt: ytRes.data.snippet.publishedAt || new Date().toISOString(),
      };

      activeUpload.result.youtube = existing.youtube;
    }

    // 2. Instagram Execution (Always Live Immediate Upload via Playwright)
    if (platforms.includes('instagram')) {
      activeUpload.stage = 'Publishing Instagram Reel via Playwright...';
      activeUpload.progress = 60;

      const igRes = await igPlaywright.uploadReel({
        videoPath: filePath,
        coverPath: fs.existsSync(thumbPath) ? thumbPath : null,
        caption: instagram.caption || '',
        shareToFeed: instagram.shareToFeed !== false,
        onProgress: (p) => {
          activeUpload.stage = `Instagram: ${p.stage}`;
          activeUpload.progress = 50 + Math.round(p.progress * 0.5); // 50-100%
        },
        headless: false,
      });

      existing.instagram = {
        uploaded: true,
        reelUrl: igRes.reelUrl,
        username: igRes.username,
        publishedAt: igRes.publishedAt || new Date().toISOString(),
      };
      activeUpload.result.instagram = existing.instagram;
    }

    saveUploadsRecord(uploads);
    activeUpload.inProgress = false;
    activeUpload.progress = 100;
    activeUpload.stage = isScheduling
      ? `🎉 Successfully scheduled on YouTube & published to Instagram!`
      : `🎉 Successfully published to [${platforms.join(' & ').toUpperCase()}]!`;
  } catch (err) {
    console.error('Multi-platform publish error:', err);
    activeUpload.inProgress = false;
    activeUpload.error = err.message || 'Publishing failed';
  }
});

// ========================================================
// 9. API: Settings & YouTube API Credentials Configuration
// ========================================================

// GET Settings status & active channel info
app.get('/api/settings/youtube', async (req, res) => {
  const hasSecrets = fs.existsSync(CLIENT_SECRETS_PATH);
  const hasToken = fs.existsSync(TOKEN_PATH);

  let authUrl = null;
  let isConnected = false;
  let channel = null;

  if (hasSecrets) {
    try {
      const oauth2Client = getOAuth2Client();
      authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: [
          'https://www.googleapis.com/auth/youtube.upload',
          'https://www.googleapis.com/auth/youtube',
          'https://www.googleapis.com/auth/youtube.readonly',
        ],
      });

      if (hasToken) {
        try {
          const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
          const channelRes = await youtube.channels.list({
            part: 'snippet,statistics',
            mine: true,
          });
          const item = channelRes.data.items?.[0];
          if (item) {
            isConnected = true;
            channel = {
              id: item.id,
              title: item.snippet.title,
              description: item.snippet.description,
              customUrl: item.snippet.customUrl,
              thumbnail: item.snippet.thumbnails?.default?.url || item.snippet.thumbnails?.medium?.url,
              subscriberCount: item.statistics?.subscriberCount || '0',
              videoCount: item.statistics?.videoCount || '0',
              viewCount: item.statistics?.viewCount || '0',
            };
          }
        } catch (e) {
          console.warn('Could not fetch YouTube channel details:', e.message);
        }
      }
    } catch (e) {
      console.warn('OAuth2 client generation warning:', e.message);
    }
  }

  res.json({
    hasSecrets,
    hasToken,
    isConnected,
    channel,
    authUrl,
  });
});

// POST Save YouTube client_secrets.json directly from UI paste/upload
app.post('/api/settings/save-secrets', (req, res) => {
  let { jsonContent } = req.body;
  if (!jsonContent) {
    return res.status(400).json({ error: 'Please paste your client_secrets.json content.' });
  }

  try {
    let parsed;
    if (typeof jsonContent === 'string') {
      parsed = JSON.parse(jsonContent);
    } else {
      parsed = jsonContent;
    }

    const installed = parsed.installed || parsed.web;
    if (!installed || !installed.client_id || !installed.client_secret) {
      return res.status(400).json({
        error: 'Invalid format! The JSON must contain "installed" (Desktop App) or "web" with "client_id" and "client_secret".',
      });
    }

    // Save secrets file
    fs.writeFileSync(CLIENT_SECRETS_PATH, JSON.stringify(parsed, null, 2), 'utf-8');

    // Remove old token so user can authenticate with the new project
    if (fs.existsSync(TOKEN_PATH)) {
      try {
        fs.unlinkSync(TOKEN_PATH);
      } catch (e) {}
    }

    // Generate new auth URL
    const oauth2Client = getOAuth2Client();
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/youtube.upload',
        'https://www.googleapis.com/auth/youtube',
        'https://www.googleapis.com/auth/youtube.readonly',
      ],
    });

    console.log('✅ YouTube client_secrets.json successfully saved via Settings UI');
    res.json({
      success: true,
      message: 'YouTube API credentials saved! Click "Confirm & Connect Channel" to authenticate.',
      authUrl,
    });
  } catch (err) {
    res.status(400).json({ error: 'Failed to parse JSON: ' + err.message });
  }
});

// POST Reset YouTube Credentials
app.post('/api/settings/reset-secrets', (req, res) => {
  try {
    if (fs.existsSync(CLIENT_SECRETS_PATH)) fs.unlinkSync(CLIENT_SECRETS_PATH);
    if (fs.existsSync(TOKEN_PATH)) fs.unlinkSync(TOKEN_PATH);
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
