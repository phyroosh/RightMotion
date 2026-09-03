const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const CREDENTIALS_DIR = path.join(__dirname, 'credentials');
const CREDENTIALS_FILE = path.join(__dirname, 'credentials.json');
const TOKENS_DIR = path.join(__dirname, 'tokens');
const CHANNELS_FILE = path.join(__dirname, 'channels.json');

const LEGACY_CLIENT_SECRETS_PATH = path.join(__dirname, 'client_secrets.json');
const LEGACY_TOKEN_PATH = path.join(__dirname, 'token.json');

function ensureDirs() {
  if (!fs.existsSync(CREDENTIALS_DIR)) {
    try { fs.mkdirSync(CREDENTIALS_DIR, { recursive: true }); } catch (e) {}
  }
  if (!fs.existsSync(TOKENS_DIR)) {
    try { fs.mkdirSync(TOKENS_DIR, { recursive: true }); } catch (e) {}
  }
}

// -------------------------------------------------------------------
// 1. Google Cloud Console Credentials (client_secrets JSONs)
// -------------------------------------------------------------------

function getCredentialsRegistry() {
  ensureDirs();
  if (fs.existsSync(CREDENTIALS_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, 'utf-8'));
      if (data && Array.isArray(data.projects)) return data;
    } catch (e) {
      console.error('Failed to read credentials.json:', e);
    }
  }

  // Auto-migrate legacy client_secrets.json if it exists
  if (fs.existsSync(LEGACY_CLIENT_SECRETS_PATH)) {
    try {
      const content = fs.readFileSync(LEGACY_CLIENT_SECRETS_PATH, 'utf-8');
      const parsed = JSON.parse(content);
      const installed = parsed.installed || parsed.web;
      if (installed && installed.client_id) {
        const destFile = path.join(CREDENTIALS_DIR, 'default.json');
        fs.writeFileSync(destFile, JSON.stringify(parsed, null, 2), 'utf-8');

        const initialRegistry = {
          projects: [
            {
              id: 'default',
              name: 'Primary Google Cloud Project',
              clientId: installed.client_id,
              projectId: installed.project_id || 'default',
              filename: 'credentials/default.json',
              createdAt: new Date().toISOString(),
            },
          ],
          activeProjectId: 'default',
        };
        fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(initialRegistry, null, 2), 'utf-8');
        return initialRegistry;
      }
    } catch (e) {
      console.error('Failed to migrate legacy client_secrets.json:', e);
    }
  }

  return { projects: [], activeProjectId: null };
}

function saveCredentialsRegistry(registry) {
  try {
    fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(registry, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write credentials.json:', e);
  }
}

function getCredentialData(credentialId = null) {
  ensureDirs();
  const registry = getCredentialsRegistry();
  const targetId = credentialId || registry.activeProjectId || (registry.projects[0] ? registry.projects[0].id : null);

  if (targetId) {
    const proj = registry.projects.find((p) => p.id === targetId);
    if (proj) {
      const filePath = path.join(__dirname, proj.filename);
      if (fs.existsSync(filePath)) {
        try {
          const content = fs.readFileSync(filePath, 'utf-8');
          const parsed = JSON.parse(content);
          return { credentialId: proj.id, name: proj.name, credentials: parsed };
        } catch (e) {
          console.error(`Failed to parse credential file ${filePath}:`, e);
        }
      }
    }
  }

  // Fallback to legacy single file
  if (fs.existsSync(LEGACY_CLIENT_SECRETS_PATH)) {
    try {
      const content = fs.readFileSync(LEGACY_CLIENT_SECRETS_PATH, 'utf-8');
      const parsed = JSON.parse(content);
      return { credentialId: 'default', name: 'Legacy Project', credentials: parsed };
    } catch (e) {}
  }

  return null;
}

function addCredential({ name, jsonContent }) {
  ensureDirs();
  let parsed;
  if (typeof jsonContent === 'string') {
    try {
      parsed = JSON.parse(jsonContent);
    } catch (e) {
      throw new Error('Invalid JSON: ' + e.message);
    }
  } else {
    parsed = jsonContent;
  }

  const installed = parsed.installed || parsed.web;
  if (!installed || !installed.client_id || !installed.client_secret) {
    throw new Error('Invalid Google credentials format! Missing "installed" or "web" block with client_id and client_secret.');
  }

  const registry = getCredentialsRegistry();
  const id = 'gcp_' + Date.now().toString(36);
  const safeName = (name || installed.project_id || `Google Cloud Project (${registry.projects.length + 1})`).trim();
  const fileName = `credentials/${id}.json`;
  const destPath = path.join(__dirname, fileName);

  fs.writeFileSync(destPath, JSON.stringify(parsed, null, 2), 'utf-8');

  // Also sync to legacy client_secrets.json if none exists
  if (!fs.existsSync(LEGACY_CLIENT_SECRETS_PATH)) {
    try {
      fs.writeFileSync(LEGACY_CLIENT_SECRETS_PATH, JSON.stringify(parsed, null, 2), 'utf-8');
    } catch (e) {}
  }

  const projectInfo = {
    id,
    name: safeName,
    clientId: installed.client_id,
    projectId: installed.project_id || id,
    filename: fileName,
    createdAt: new Date().toISOString(),
  };

  registry.projects.push(projectInfo);
  if (!registry.activeProjectId) {
    registry.activeProjectId = id;
  }
  saveCredentialsRegistry(registry);

  return projectInfo;
}

function deleteCredential(credentialId) {
  const registry = getCredentialsRegistry();
  const proj = registry.projects.find((p) => p.id === credentialId);
  if (!proj) return { success: false, error: 'Credential not found' };

  registry.projects = registry.projects.filter((p) => p.id !== credentialId);
  const filePath = path.join(__dirname, proj.filename);
  if (fs.existsSync(filePath)) {
    try { fs.unlinkSync(filePath); } catch (e) {}
  }

  if (registry.activeProjectId === credentialId) {
    registry.activeProjectId = registry.projects.length > 0 ? registry.projects[0].id : null;
  }
  saveCredentialsRegistry(registry);

  return { success: true, activeProjectId: registry.activeProjectId };
}

// -------------------------------------------------------------------
// 2. YouTube Channels & OAuth Tokens
// -------------------------------------------------------------------

function getChannelsRegistry() {
  ensureDirs();
  if (fs.existsSync(CHANNELS_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(CHANNELS_FILE, 'utf-8'));
      if (data && Array.isArray(data.channels)) return data;
    } catch (e) {
      console.error('Failed to read channels.json:', e);
    }
  }

  // Auto-migrate legacy token.json if present
  if (fs.existsSync(LEGACY_TOKEN_PATH)) {
    try {
      const tokenData = JSON.parse(fs.readFileSync(LEGACY_TOKEN_PATH, 'utf-8'));
      if (tokenData) {
        const cred = getCredentialData('default');
        if (cred) {
          const installed = cred.credentials.installed || cred.credentials.web;
          const oauth2 = new google.auth.OAuth2(installed.client_id, installed.client_secret, 'http://localhost:4000/oauth2callback');
          oauth2.setCredentials(tokenData);

          // Return provisional registry while async sync will enrich it
          const provisionalId = 'legacy_channel';
          const tokenFile = `tokens/yt_${provisionalId}.json`;
          fs.writeFileSync(path.join(__dirname, tokenFile), JSON.stringify(tokenData, null, 2), 'utf-8');

          const initialRegistry = {
            channels: [
              {
                channelId: provisionalId,
                title: 'Connected Channel',
                customUrl: '@youtube',
                avatar: null,
                subscriberCount: null,
                videoCount: null,
                credentialId: 'default',
                tokenFile,
                connectedAt: new Date().toISOString(),
              },
            ],
            activeChannelId: provisionalId,
          };
          fs.writeFileSync(CHANNELS_FILE, JSON.stringify(initialRegistry, null, 2), 'utf-8');
          return initialRegistry;
        }
      }
    } catch (e) {
      console.error('Failed to migrate legacy token.json:', e);
    }
  }

  return { channels: [], activeChannelId: null };
}

function saveChannelsRegistry(registry) {
  try {
    fs.writeFileSync(CHANNELS_FILE, JSON.stringify(registry, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write channels.json:', e);
  }

  // Also sync active channel's token to legacy token.json
  if (registry.activeChannelId) {
    const ch = registry.channels.find((c) => c.channelId === registry.activeChannelId);
    if (ch && ch.tokenFile) {
      const tokPath = path.join(__dirname, ch.tokenFile);
      if (fs.existsSync(tokPath)) {
        try {
          fs.copyFileSync(tokPath, LEGACY_TOKEN_PATH);
        } catch (e) {}
      }
    }
  }
}

function getOAuth2ClientForCredential(credentialId = null, port = 4000) {
  const credObj = getCredentialData(credentialId);
  if (!credObj) {
    throw new Error('No Google Cloud credentials found. Please add a client_secrets.json in Settings.');
  }

  const installed = credObj.credentials.installed || credObj.credentials.web;
  const redirectUri = `http://localhost:${port}/oauth2callback`;
  return {
    oauth2Client: new google.auth.OAuth2(installed.client_id, installed.client_secret, redirectUri),
    credentialId: credObj.credentialId,
    credentialName: credObj.name,
  };
}

function getOAuth2ClientForChannel(channelId = null, port = 4000) {
  ensureDirs();
  const registry = getChannelsRegistry();
  const targetId = channelId || registry.activeChannelId;

  if (!targetId || registry.channels.length === 0) {
    return null;
  }

  const channel = registry.channels.find((c) => c.channelId === targetId);
  if (!channel) {
    return null;
  }

  const credObj = getCredentialData(channel.credentialId);
  if (!credObj) {
    throw new Error(`Google Cloud Project credentials not found for channel ${channel.title}.`);
  }

  const installed = credObj.credentials.installed || credObj.credentials.web;
  const redirectUri = `http://localhost:${port}/oauth2callback`;
  const oauth2Client = new google.auth.OAuth2(installed.client_id, installed.client_secret, redirectUri);

  const tokenPath = path.join(__dirname, channel.tokenFile);
  if (!fs.existsSync(tokenPath)) {
    // Fallback to legacy token.json
    if (fs.existsSync(LEGACY_TOKEN_PATH)) {
      try {
        const tokens = JSON.parse(fs.readFileSync(LEGACY_TOKEN_PATH, 'utf-8'));
        oauth2Client.setCredentials(tokens);
        return { oauth2Client, channel };
      } catch (e) {}
    }
    return null;
  }

  try {
    const tokens = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));
    oauth2Client.setCredentials(tokens);

    // Save refreshed tokens automatically
    oauth2Client.on('tokens', (newTokens) => {
      const merged = { ...tokens, ...newTokens };
      try {
        fs.writeFileSync(tokenPath, JSON.stringify(merged, null, 2), 'utf-8');
        if (channel.channelId === registry.activeChannelId) {
          fs.writeFileSync(LEGACY_TOKEN_PATH, JSON.stringify(merged, null, 2), 'utf-8');
        }
      } catch (e) {}
    });

    return { oauth2Client, channel };
  } catch (e) {
    console.error(`Error loading tokens for channel ${channel.title}:`, e);
    return null;
  }
}

async function registerChannelFromOAuth({ code, credentialId = null, port = 4000 }) {
  ensureDirs();
  const { oauth2Client, credentialId: resolvedCredId } = getOAuth2ClientForCredential(credentialId, port);

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  // Fetch YouTube channel details
  const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
  const response = await youtube.channels.list({
    part: 'snippet,statistics,contentDetails',
    mine: true,
  });

  if (!response.data.items || response.data.items.length === 0) {
    throw new Error('No YouTube channel found associated with this Google account.');
  }

  const item = response.data.items[0];
  const channelId = item.id;
  const title = item.snippet.title;
  const customUrl = item.snippet.customUrl || `@${title.replace(/\s+/g, '').toLowerCase()}`;
  const avatar =
    item.snippet.thumbnails?.high?.url ||
    item.snippet.thumbnails?.medium?.url ||
    item.snippet.thumbnails?.default?.url ||
    null;

  const tokenFileName = `tokens/yt_${channelId}.json`;
  const tokenFilePath = path.join(__dirname, tokenFileName);
  fs.writeFileSync(tokenFilePath, JSON.stringify(tokens, null, 2), 'utf-8');

  // Also sync to legacy token.json
  try {
    fs.writeFileSync(LEGACY_TOKEN_PATH, JSON.stringify(tokens, null, 2), 'utf-8');
  } catch (e) {}

  const registry = getChannelsRegistry();
  const idx = registry.channels.findIndex((c) => c.channelId === channelId);

  const channelRecord = {
    channelId,
    title,
    customUrl,
    avatar,
    subscriberCount: item.statistics?.subscriberCount || '0',
    videoCount: item.statistics?.videoCount || '0',
    uploadsPlaylistId: item.contentDetails?.relatedPlaylists?.uploads || null,
    credentialId: resolvedCredId,
    tokenFile: tokenFileName,
    connectedAt: new Date().toISOString(),
  };

  if (idx >= 0) {
    registry.channels[idx] = channelRecord;
  } else {
    registry.channels.push(channelRecord);
  }

  registry.activeChannelId = channelId;
  saveChannelsRegistry(registry);

  return channelRecord;
}

function switchActiveChannel(channelId) {
  const registry = getChannelsRegistry();
  const found = registry.channels.find((c) => c.channelId === channelId);
  if (!found) {
    return { success: false, error: 'Channel not found in registry' };
  }

  registry.activeChannelId = found.channelId;
  saveChannelsRegistry(registry);

  // Sync token to legacy token.json
  const tokPath = path.join(__dirname, found.tokenFile);
  if (fs.existsSync(tokPath)) {
    try {
      fs.copyFileSync(tokPath, LEGACY_TOKEN_PATH);
    } catch (e) {}
  }

  return { success: true, activeChannel: found };
}

function disconnectChannel(channelId) {
  const registry = getChannelsRegistry();
  const found = registry.channels.find((c) => c.channelId === channelId);
  if (!found) return { success: true };

  registry.channels = registry.channels.filter((c) => c.channelId !== channelId);
  const tokPath = path.join(__dirname, found.tokenFile);
  if (fs.existsSync(tokPath)) {
    try { fs.unlinkSync(tokPath); } catch (e) {}
  }

  if (registry.activeChannelId === channelId) {
    registry.activeChannelId = registry.channels.length > 0 ? registry.channels[0].channelId : null;
    if (registry.activeChannelId) {
      const nextCh = registry.channels.find((c) => c.channelId === registry.activeChannelId);
      if (nextCh && nextCh.tokenFile) {
        const nextTok = path.join(__dirname, nextCh.tokenFile);
        if (fs.existsSync(nextTok)) {
          try { fs.copyFileSync(nextTok, LEGACY_TOKEN_PATH); } catch (e) {}
        }
      }
    } else {
      if (fs.existsSync(LEGACY_TOKEN_PATH)) {
        try { fs.unlinkSync(LEGACY_TOKEN_PATH); } catch (e) {}
      }
    }
  }

  saveChannelsRegistry(registry);
  return { success: true, activeChannelId: registry.activeChannelId };
}

async function refreshChannelDetails(channelId = null) {
  const clientObj = getOAuth2ClientForChannel(channelId);
  if (!clientObj) return null;

  try {
    const youtube = google.youtube({ version: 'v3', auth: clientObj.oauth2Client });
    const response = await youtube.channels.list({
      part: 'snippet,statistics,contentDetails',
      mine: true,
    });

    if (response.data.items && response.data.items.length > 0) {
      const item = response.data.items[0];
      const registry = getChannelsRegistry();
      const idx = registry.channels.findIndex((c) => c.channelId === item.id);
      if (idx >= 0) {
        registry.channels[idx].title = item.snippet.title;
        registry.channels[idx].customUrl = item.snippet.customUrl || registry.channels[idx].customUrl;
        registry.channels[idx].avatar =
          item.snippet.thumbnails?.high?.url ||
          item.snippet.thumbnails?.medium?.url ||
          item.snippet.thumbnails?.default?.url ||
          registry.channels[idx].avatar;
        registry.channels[idx].subscriberCount = item.statistics?.subscriberCount || '0';
        registry.channels[idx].videoCount = item.statistics?.videoCount || '0';
        registry.channels[idx].uploadsPlaylistId = item.contentDetails?.relatedPlaylists?.uploads || null;
        saveChannelsRegistry(registry);
        return registry.channels[idx];
      }
    }
  } catch (e) {
    console.error(`Failed to refresh channel ${channelId}:`, e.message);
  }
  return clientObj.channel;
}

// -------------------------------------------------------------------
// 3. Sovereign Niches Registry & Niche Account Binding
// -------------------------------------------------------------------

function getNichesRegistry() {
  const reg = getChannelsRegistry();
  if (reg.niches) return reg.niches;

  const defaultNiches = {
    self_improvement: {
      id: "self_improvement",
      name: "Judy Insights",
      tag: "{Self Improvement}",
      theme: "apple_studio",
      accentColor: "#0071e3",
      badge: "Mindset & Psychology",
      youtube: {
        channelId: reg.activeChannelId || (reg.channels[0]?.channelId) || null,
        title: "Judy Insights",
        customUrl: "@thejudyinsights",
        avatar: reg.channels[0]?.avatar || null,
        connected: !!(reg.activeChannelId || reg.channels[0]?.channelId)
      },
      instagram: {
        username: "thejudyinsights",
        connected: true
      },
      defaultTags: ["SelfImprovement", "Psychology", "Mindset", "PersonalGrowth", "Shorts"]
    },
    finance: {
      id: "finance",
      name: "Apex Wealth",
      tag: "{Finance}",
      theme: "obsidian_gold",
      accentColor: "#10b981",
      badge: "Capital Markets & Growth",
      youtube: { channelId: null, title: "Apex Wealth", connected: false },
      instagram: { username: "apexwealth", connected: false },
      defaultTags: ["Finance", "Investing", "Wealth", "Money", "Compounding", "Shorts"]
    },
    health: {
      id: "health",
      name: "BioMatrix",
      tag: "{Health}",
      theme: "biotech_cyan",
      accentColor: "#06b6d4",
      badge: "Cellular Biology & Longevity",
      youtube: { channelId: null, title: "BioMatrix", connected: false },
      instagram: { username: "biomatrixhealth", connected: false },
      defaultTags: ["Health", "Neuroscience", "CircadianRhythm", "Biology", "Longevity", "Shorts"]
    }
  };

  reg.niches = defaultNiches;
  saveChannelsRegistry(reg);
  return reg.niches;
}

function bindYouTubeToNiche(nicheId, channelId) {
  const reg = getChannelsRegistry();
  if (!reg.niches) reg.niches = getNichesRegistry();
  if (!reg.niches[nicheId]) return { success: false, error: 'Unknown niche' };

  const channel = reg.channels.find(c => c.channelId === channelId);
  if (!channel) return { success: false, error: 'Channel not found in registry' };

  reg.niches[nicheId].youtube = {
    channelId: channel.channelId,
    title: channel.title,
    customUrl: channel.customUrl,
    avatar: channel.avatar,
    credentialId: channel.credentialId,
    tokenFile: channel.tokenFile,
    connected: true
  };
  saveChannelsRegistry(reg);
  return { success: true, niche: reg.niches[nicheId] };
}

function bindInstagramToNiche(nicheId, username) {
  const reg = getChannelsRegistry();
  if (!reg.niches) reg.niches = getNichesRegistry();
  if (!reg.niches[nicheId]) return { success: false, error: 'Unknown niche' };

  reg.niches[nicheId].instagram = {
    username,
    connected: true,
    sessionFile: `instagram_sessions/${username}.json`
  };
  saveChannelsRegistry(reg);
  return { success: true, niche: reg.niches[nicheId] };
}

function getNicheAuthClient(nicheId, port = 4000) {
  const niches = getNichesRegistry();
  const niche = niches[nicheId];
  if (!niche || !niche.youtube || !niche.youtube.channelId) {
    return getOAuth2ClientForChannel(null, port);
  }
  return getOAuth2ClientForChannel(niche.youtube.channelId, port);
}

module.exports = {
  // Directories & Paths
  CREDENTIALS_DIR,
  CREDENTIALS_FILE,
  TOKENS_DIR,
  CHANNELS_FILE,
  LEGACY_CLIENT_SECRETS_PATH,
  LEGACY_TOKEN_PATH,

  // Credentials
  getCredentialsRegistry,
  saveCredentialsRegistry,
  getCredentialData,
  addCredential,
  deleteCredential,
  listCredentials: () => getCredentialsRegistry().projects,

  // Channels
  getChannelsRegistry,
  saveChannelsRegistry,
  getOAuth2ClientForCredential,
  getOAuth2ClientForChannel,
  registerChannelFromOAuth,
  switchActiveChannel,
  disconnectChannel,
  refreshChannelDetails,
  listChannels: () => getChannelsRegistry().channels,

  // Sovereign Niches
  getNichesRegistry,
  bindYouTubeToNiche,
  bindInstagramToNiche,
  getNicheAuthClient,
};
