/**
 * RightMotion Remote Access & Permission System — Store & Persistence
 * Atomic, zero-dependency file-based storage in studio/remote/data/
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { InviteStatus, Roles, ALL_PERMISSIONS, DEFAULT_VISITOR_PERMISSIONS } = require('./types');

const DATA_DIR = path.join(__dirname, 'data');
const INVITES_FILE = path.join(DATA_DIR, 'invites.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');
const STATE_FILE = path.join(DATA_DIR, 'state.json');
const OWNER_CAPABILITY_FILE = path.join(DATA_DIR, 'owner_capability.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true, mode: 0o700 });
  }
}

function safeReadJson(filePath, defaultValue) {
  ensureDataDir();
  if (!fs.existsSync(filePath)) return defaultValue;
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`[RemoteStore] Error reading ${path.basename(filePath)}:`, err.message);
    return defaultValue;
  }
}

function safeWriteJson(filePath, data) {
  ensureDataDir();
  const tmpFile = `${filePath}.${crypto.randomBytes(6).toString('hex')}.tmp`;
  try {
    fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), { encoding: 'utf-8', mode: 0o600 });
    fs.renameSync(tmpFile, filePath);
  } catch (err) {
    console.error(`[RemoteStore] Error writing ${path.basename(filePath)}:`, err.message);
    try { if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile); } catch (e) {}
    throw err;
  }
}

// -------------------------------------------------------------------
// 1. OWNER CAPABILITY (Trusted Local Secret)
// -------------------------------------------------------------------

function getOrCreateOwnerCapability() {
  ensureDataDir();
  let cap = safeReadJson(OWNER_CAPABILITY_FILE, null);
  if (!cap || !cap.ownerSecret || !cap.ownerToken) {
    cap = {
      ownerSecret: crypto.randomBytes(32).toString('hex'),
      ownerToken: `rm_owner_${crypto.randomBytes(24).toString('base64url')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    safeWriteJson(OWNER_CAPABILITY_FILE, cap);
    try { fs.chmodSync(OWNER_CAPABILITY_FILE, 0o600); } catch (e) {}
  }
  return cap;
}

function rotateOwnerCapability() {
  const cap = {
    ownerSecret: crypto.randomBytes(32).toString('hex'),
    ownerToken: `rm_owner_${crypto.randomBytes(24).toString('base64url')}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  safeWriteJson(OWNER_CAPABILITY_FILE, cap);
  try { fs.chmodSync(OWNER_CAPABILITY_FILE, 0o600); } catch (e) {}
  return cap;
}

// -------------------------------------------------------------------
// 2. REMOTE ACCESS STATE
// -------------------------------------------------------------------

function getRemoteState() {
  return safeReadJson(STATE_FILE, {
    enabled: false,
    transportType: 'tailscale',
    publicUrl: null,
    transportStatus: 'offline',
    transportError: null,
    enabledAt: null,
    killSwitchActivated: false,
    transportToken: crypto.randomBytes(24).toString('hex'),
  });
}

function updateRemoteState(patch) {
  const current = getRemoteState();
  const updated = { ...current, ...patch };
  safeWriteJson(STATE_FILE, updated);
  return updated;
}

// -------------------------------------------------------------------
// 3. INVITES
// -------------------------------------------------------------------

function getInvites() {
  return safeReadJson(INVITES_FILE, []);
}

function saveInvites(invites) {
  safeWriteJson(INVITES_FILE, invites);
}

function getInviteById(id) {
  const list = getInvites();
  return list.find((i) => i.id === id) || null;
}

function getInviteByEmail(email) {
  if (!email) return null;
  const list = getInvites();
  const normalized = email.trim().toLowerCase();
  return list.find((i) => i.email.toLowerCase() === normalized) || null;
}

function addInvite(inviteData) {
  const list = getInvites();
  list.push(inviteData);
  saveInvites(list);
  return inviteData;
}

function updateInvite(id, patch) {
  const list = getInvites();
  const idx = list.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...patch, updatedAt: new Date().toISOString() };
  saveInvites(list);
  return list[idx];
}

function deleteInvite(id) {
  const list = getInvites();
  const filtered = list.filter((i) => i.id !== id);
  const deleted = filtered.length < list.length;
  if (deleted) saveInvites(filtered);
  return deleted;
}

// -------------------------------------------------------------------
// 4. SESSIONS
// -------------------------------------------------------------------

function getSessions() {
  return safeReadJson(SESSIONS_FILE, []);
}

function saveSessions(sessions) {
  safeWriteJson(SESSIONS_FILE, sessions);
}

function getSessionById(sessionId) {
  const list = getSessions();
  return list.find((s) => s.id === sessionId && !s.revokedAt) || null;
}

function getSessionByTokenHash(tokenHash) {
  const list = getSessions();
  return list.find((s) => s.tokenHash === tokenHash && !s.revokedAt) || null;
}

function addSession(sessionData) {
  const list = getSessions();
  list.push(sessionData);
  saveSessions(list);
  return sessionData;
}

function updateSessionLastSeen(sessionId, ip = null, userAgent = null) {
  const list = getSessions();
  const sess = list.find((s) => s.id === sessionId && !s.revokedAt);
  if (sess) {
    sess.lastSeen = new Date().toISOString();
    if (ip) sess.ip = ip;
    if (userAgent) sess.userAgent = userAgent;
    saveSessions(list);
    return sess;
  }
  return null;
}

function revokeSession(sessionId) {
  const list = getSessions();
  const sess = list.find((s) => s.id === sessionId);
  if (sess && !sess.revokedAt) {
    sess.revokedAt = new Date().toISOString();
    saveSessions(list);
    return true;
  }
  return false;
}

function revokeSessionsForInvite(inviteId) {
  const list = getSessions();
  let count = 0;
  const now = new Date().toISOString();
  list.forEach((s) => {
    if (s.inviteId === inviteId && !s.revokedAt) {
      s.revokedAt = now;
      count++;
    }
  });
  if (count > 0) saveSessions(list);
  return count;
}

function revokeAllVisitorSessions() {
  const list = getSessions();
  let count = 0;
  const now = new Date().toISOString();
  list.forEach((s) => {
    if (s.role === Roles.VISITOR && !s.revokedAt) {
      s.revokedAt = now;
      count++;
    }
  });
  if (count > 0) saveSessions(list);
  return count;
}

module.exports = {
  getOrCreateOwnerCapability,
  rotateOwnerCapability,
  getRemoteState,
  updateRemoteState,
  getInvites,
  saveInvites,
  getInviteById,
  getInviteByEmail,
  addInvite,
  updateInvite,
  deleteInvite,
  getSessions,
  saveSessions,
  getSessionById,
  getSessionByTokenHash,
  addSession,
  updateSessionLastSeen,
  revokeSession,
  revokeSessionsForInvite,
  revokeAllVisitorSessions,
};
