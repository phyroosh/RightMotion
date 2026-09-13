/**
 * RightMotion Remote Access & Permission System — Authentication & Crypto
 * Zero-dependency cryptography using native Node.js 22 crypto module.
 */

const crypto = require('crypto');
const store = require('./store');
const { InviteStatus, Roles, ALL_PERMISSIONS, DEFAULT_VISITOR_PERMISSIONS } = require('./types');

const SCRYPT_KEYLEN = 64;

// -------------------------------------------------------------------
// 1. PASSWORD HASHING (Native Node.js scrypt)
// -------------------------------------------------------------------

function hashPassword(password) {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string');
  }
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, SCRYPT_KEYLEN);
  return `scrypt:${salt}:${derivedKey.toString('hex')}`;
}

function verifyPassword(password, storedHash) {
  if (!password || !storedHash || typeof storedHash !== 'string') {
    return false;
  }
  const parts = storedHash.split(':');
  if (parts.length !== 3 || parts[0] !== 'scrypt') {
    return false;
  }
  const salt = parts[1];
  const originalKeyHex = parts[2];
  const derivedKey = crypto.scryptSync(password, salt, SCRYPT_KEYLEN);
  const originalKey = Buffer.from(originalKeyHex, 'hex');

  if (derivedKey.length !== originalKey.length) {
    return false;
  }
  return crypto.timingSafeEqual(derivedKey, originalKey);
}

// -------------------------------------------------------------------
// 2. CREDENTIAL & TOKEN GENERATION
// -------------------------------------------------------------------

function generateSyntheticEmail() {
  const existingInvites = store.getInvites();
  const existingEmails = new Set(existingInvites.map((i) => i.email.toLowerCase()));

  // Try sequential visitor1, visitor2, ...
  for (let i = 1; i < 1000; i++) {
    const candidate = `visitor${i}@rightmotion.local`;
    if (!existingEmails.has(candidate)) {
      return candidate;
    }
  }
  // Fallback to random suffix
  return `visitor_${crypto.randomBytes(4).toString('hex')}@rightmotion.local`;
}

function generateStrongPassword() {
  // 16 chars of high-entropy base64url characters (e.g. "a9B_z3Km8L1x9Qp2")
  return crypto.randomBytes(12).toString('base64url');
}

function hashSessionToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function generateSessionToken(prefix = 'rm_sess') {
  return `${prefix}_${crypto.randomBytes(24).toString('base64url')}`;
}

// -------------------------------------------------------------------
// 3. INVITE CREATION
// -------------------------------------------------------------------

function createInvite({
  email = null,
  password = null,
  permissions = null,
  label = '',
  expiresInHours = null,
  createdBy = Roles.OWNER,
}) {
  const finalEmail = email ? email.trim().toLowerCase() : generateSyntheticEmail();
  const plaintextPassword = password ? password.trim() : generateStrongPassword();

  // Validate duplicate email
  const existing = store.getInviteByEmail(finalEmail);
  if (existing) {
    throw new Error(`An invite with identity "${finalEmail}" already exists.`);
  }

  const passwordHash = hashPassword(plaintextPassword);
  const now = new Date();
  const expiresAt = expiresInHours
    ? new Date(now.getTime() + expiresInHours * 60 * 60 * 1000).toISOString()
    : null;

  const validPermissions = Array.isArray(permissions) && permissions.length > 0
    ? permissions.filter((p) => ALL_PERMISSIONS.includes(p))
    : [...DEFAULT_VISITOR_PERMISSIONS];

  const inviteId = `inv_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

  const inviteRecord = {
    id: inviteId,
    email: finalEmail,
    passwordHash,
    status: InviteStatus.ACTIVE,
    permissions: validPermissions,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    expiresAt,
    createdBy,
    label: label.trim(),
    lastSeen: null,
  };

  store.addInvite(inviteRecord);

  // Return the record WITH the plaintext password ONLY THIS ONCE so the owner can copy it.
  // The plaintext password is NEVER stored in database or logged.
  return {
    invite: inviteRecord,
    credentials: {
      email: finalEmail,
      password: plaintextPassword,
    },
  };
}

// -------------------------------------------------------------------
// 4. RATE LIMITING (Brute Force Defense for Login)
// -------------------------------------------------------------------

const loginAttempts = new Map(); // ip -> { count: number, resetAt: number }

function checkLoginRateLimit(ip) {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record) return { allowed: true };

  if (now > record.resetAt) {
    loginAttempts.delete(ip);
    return { allowed: true };
  }

  if (record.count >= 5) {
    const waitSec = Math.ceil((record.resetAt - now) / 1000);
    return {
      allowed: false,
      error: `Too many failed login attempts. Please wait ${waitSec} seconds before trying again.`,
    };
  }

  return { allowed: true };
}

function recordFailedLogin(ip) {
  const now = Date.now();
  const windowMs = 5 * 60 * 1000; // 5 minute window
  const record = loginAttempts.get(ip) || { count: 0, resetAt: now + windowMs };
  record.count += 1;
  record.resetAt = Math.max(record.resetAt, now + windowMs);
  loginAttempts.set(ip, record);
}

function clearFailedLogin(ip) {
  loginAttempts.delete(ip);
}

// -------------------------------------------------------------------
// 5. COOKIE & TOKEN PARSING HELPERS
// -------------------------------------------------------------------

function parseCookies(cookieHeader) {
  const list = {};
  if (!cookieHeader) return list;

  cookieHeader.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    const name = parts.shift().trim();
    const value = decodeURIComponent(parts.join('='));
    if (name) list[name] = value;
  });

  return list;
}

function extractTokenFromRequest(req) {
  // 1. Check query param ?auth=<token> or ?token=<token>
  if (req.query) {
    if (req.query.auth && typeof req.query.auth === 'string') return req.query.auth.trim();
    if (req.query.token && typeof req.query.token === 'string') return req.query.token.trim();
  }

  // 2. Check Authorization: Bearer <token>
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const bearer = authHeader.substring(7).trim();
    if (bearer) return bearer;
  }

  // 3. Check cookies (rm_session or rm_owner_session)
  const cookies = parseCookies(req.headers['cookie']);
  if (cookies['rm_session']) return cookies['rm_session'];
  if (cookies['rm_owner_session']) return cookies['rm_owner_session'];

  return null;
}

module.exports = {
  hashPassword,
  verifyPassword,
  generateSyntheticEmail,
  generateStrongPassword,
  hashSessionToken,
  generateSessionToken,
  createInvite,
  checkLoginRateLimit,
  recordFailedLogin,
  clearFailedLogin,
  parseCookies,
  extractTokenFromRequest,
};
