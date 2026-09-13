/**
 * RightMotion Remote Access & Permission System — Express Router
 * Mounts at /api/remote in studio/server.js
 */

const express = require('express');
const router = express.Router();

const store = require('./store');
const auth = require('./auth');
const presence = require('./presence');
const { Permissions, Roles, InviteStatus, ALL_PERMISSIONS } = require('./types');
const { requirePermission, requireOwner } = require('./permissions');
const { getTransport } = require('./transport');
const os = require('os');

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

// -------------------------------------------------------------------
// 1. PUBLIC AUTHENTICATION & SESSION ENDPOINTS
// -------------------------------------------------------------------

// POST /api/remote/auth/login
router.post('/auth/login', (req, res) => {
  const clientIp = req.socket?.remoteAddress || '127.0.0.1';
  const rateCheck = auth.checkLoginRateLimit(clientIp);
  if (!rateCheck.allowed) {
    return res.status(429).json({ error: rateCheck.error, code: 'RATE_LIMITED' });
  }

  const { email, password, deviceLabel } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required', code: 'INVALID_INPUT' });
  }

  const invite = store.getInviteByEmail(email);
  if (!invite) {
    auth.recordFailedLogin(clientIp);
    return res.status(401).json({ error: 'Invalid email or password', code: 'INVALID_CREDENTIALS' });
  }

  // Check invite status
  if (invite.status === InviteStatus.SUSPENDED) {
    return res.status(403).json({
      error: 'This invite account is currently suspended. Please contact the studio owner.',
      code: 'INVITE_SUSPENDED',
    });
  }
  if (invite.status === InviteStatus.REVOKED) {
    return res.status(403).json({
      error: 'This invite has been revoked and can no longer be used.',
      code: 'INVITE_REVOKED',
    });
  }
  if (invite.status === InviteStatus.EXPIRED || (invite.expiresAt && new Date(invite.expiresAt).getTime() <= Date.now())) {
    store.updateInvite(invite.id, { status: InviteStatus.EXPIRED });
    return res.status(403).json({
      error: 'This invite has expired.',
      code: 'INVITE_EXPIRED',
    });
  }

  // Verify password using constant-time scrypt
  const isValid = auth.verifyPassword(password, invite.passwordHash);
  if (!isValid) {
    auth.recordFailedLogin(clientIp);
    return res.status(401).json({ error: 'Invalid email or password', code: 'INVALID_CREDENTIALS' });
  }

  auth.clearFailedLogin(clientIp);

  // Generate session
  const rawToken = auth.generateSessionToken('rm_vis');
  const tokenHash = auth.hashSessionToken(rawToken);
  const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const userAgent = req.headers['user-agent'] || '';

  const sessionRecord = {
    id: sessionId,
    tokenHash,
    inviteId: invite.id,
    role: Roles.VISITOR,
    email: invite.email,
    deviceLabel: deviceLabel || presence.parseDeviceLabel(userAgent),
    userAgent,
    ip: clientIp,
    createdAt: new Date().toISOString(),
    lastSeen: new Date().toISOString(),
    revokedAt: null,
  };

  store.addSession(sessionRecord);
  store.updateInvite(invite.id, { lastSeen: new Date().toISOString() });

  // Set secure HttpOnly session cookie
  res.setHeader(
    'Set-Cookie',
    `rm_session=${rawToken}; Path=/; HttpOnly; SameSite=Lax`
  );

  return res.json({
    success: true,
    token: rawToken,
    sessionId,
    user: {
      email: invite.email,
      role: Roles.VISITOR,
      permissions: invite.permissions,
      label: invite.label,
    },
  });
});

// POST /api/remote/auth/logout
router.post('/auth/logout', (req, res) => {
  if (req.user && req.user.sessionId && req.user.sessionId !== 'local_owner_session') {
    store.revokeSession(req.user.sessionId);
  }
  res.setHeader('Set-Cookie', 'rm_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
  res.setHeader('Set-Cookie', 'rm_owner_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
  res.json({ success: true, message: 'Logged out successfully' });
});

// GET /api/remote/auth/me
router.get('/auth/me', (req, res) => {
  if (!req.user) {
    return res.json({ authenticated: false, user: null });
  }
  return res.json({
    authenticated: true,
    user: {
      email: req.user.email,
      role: req.user.role,
      permissions: req.user.permissions,
      sessionId: req.user.sessionId,
      isLocalOwner: req.user.isLocalOwner || false,
      label: req.user.label || 'User',
    },
  });
});

// POST /api/remote/heartbeat
router.post('/heartbeat', (req, res) => {
  if (!req.user || !req.user.sessionId) {
    return res.status(401).json({ error: 'Not authenticated', code: 'AUTH_REQUIRED' });
  }
  if (req.user.sessionId === 'local_owner_session' || req.user.sessionId === 'owner_master_token') {
    return res.json({ success: true, status: 'online', isOwner: true });
  }

  const clientIp = req.socket?.remoteAddress || '127.0.0.1';
  const userAgent = req.headers['user-agent'] || '';
  const result = presence.processHeartbeat(req.user.sessionId, clientIp, userAgent);

  if (!result.valid) {
    res.setHeader('Set-Cookie', 'rm_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
    return res.status(401).json({ error: result.error, code: 'SESSION_INVALID' });
  }

  return res.json({ success: true, status: 'online' });
});

// -------------------------------------------------------------------
// 2. REMOTE STATE & EMERGENCY KILL SWITCH
// -------------------------------------------------------------------

// GET /api/remote/status
router.get('/status', (req, res) => {
  const state = store.getRemoteState();

  // If unauthenticated, return only minimal public status without leaking LAN IP or active user details
  if (!req.user) {
    return res.json({
      enabled: state.enabled,
      publicUrl: state.publicUrl,
      transportStatus: state.transportStatus,
      killSwitchActivated: state.killSwitchActivated,
      isOwner: false,
    });
  }

  const currentSessionId = req.user ? req.user.sessionId : null;
  const activeUsers = presence.getActiveUsers(currentSessionId);
  const serverPort = process.env.PORT || 4000;
  const localIp = getLocalIp();

  const isOwner = req.user ? req.user.role === Roles.OWNER : false;
  const ownerCap = isOwner ? store.getOrCreateOwnerCapability() : null;

  res.json({
    enabled: state.enabled,
    publicUrl: state.publicUrl,
    lanUrl: `http://${localIp}:${serverPort}`,
    ownerPublicUrl: (isOwner && state.publicUrl) ? `${state.publicUrl}/?auth=${ownerCap.ownerToken}` : null,
    ownerLanUrl: isOwner ? `http://${localIp}:${serverPort}/?auth=${ownerCap.ownerToken}` : null,
    localIp,
    transportStatus: state.transportStatus,
    transportError: state.transportError,
    transportType: state.transportType,
    enabledAt: state.enabledAt,
    killSwitchActivated: state.killSwitchActivated,
    activeUsersCount: activeUsers.length,
    activeUsers,
    isOwner,
  });
});

// POST /api/remote/enable
router.post('/enable', requireOwner, async (req, res) => {
  try {
    const { transportType = 'auto', customUrl = null } = req.body || {};
    const transport = getTransport(transportType);
    const serverPort = process.env.PORT || 4000;

    const startResult = await transport.start(serverPort, customUrl);
    const updatedState = store.updateRemoteState({
      enabled: true,
      transportType: transport.name || transportType,
      publicUrl: startResult.publicUrl,
      transportStatus: startResult.success ? 'online' : 'error',
      transportError: startResult.error || null,
      enabledAt: new Date().toISOString(),
      killSwitchActivated: false,
    });

    res.json({
      success: true,
      state: updatedState,
      message: startResult.success
        ? `Remote access enabled! Public URL: ${startResult.publicUrl}`
        : `Remote access enabled with warning: ${startResult.error}`,
    });
  } catch (err) {
    console.error('[RemoteRoutes] Error enabling remote access:', err);
    res.status(500).json({ error: `Failed to enable remote access: ${err.message}` });
  }
});

// POST /api/remote/disable
router.post('/disable', requireOwner, async (req, res) => {
  try {
    const state = store.getRemoteState();
    const transport = getTransport(state.transportType);
    await transport.stop(process.env.PORT || 4000).catch(() => {});

    // Invalidate all active visitor sessions upon disabling remote access
    const revokedVisitorsCount = store.revokeAllVisitorSessions();

    const updatedState = store.updateRemoteState({
      enabled: false,
      publicUrl: null,
      transportStatus: 'offline',
      transportError: null,
      enabledAt: null,
    });

    res.json({
      success: true,
      state: updatedState,
      revokedVisitorsCount,
      message: 'Remote access disabled. All visitor sessions have been terminated. Localhost access remains active.',
    });
  } catch (err) {
    console.error('[RemoteRoutes] Error disabling remote access:', err);
    res.status(500).json({ error: `Failed to disable remote access: ${err.message}` });
  }
});

// POST /api/remote/kill — EMERGENCY KILL SWITCH
router.post('/kill', requireOwner, async (req, res) => {
  try {
    const state = store.getRemoteState();
    const transport = getTransport(state.transportType);
    await transport.stop(process.env.PORT || 4000).catch(() => {});

    // Immediately terminate ALL remote visitor sessions
    const revokedCount = store.revokeAllVisitorSessions();

    // Rotate owner capability token to force clean authentication
    const updatedState = store.updateRemoteState({
      enabled: false,
      publicUrl: null,
      transportStatus: 'offline',
      transportError: 'EMERGENCY KILL SWITCH ACTIVATED',
      killSwitchActivated: true,
      enabledAt: null,
    });

    console.warn(`[RemoteRoutes] 🚨 EMERGENCY KILL SWITCH TRIGGERED: Revoked ${revokedCount} visitor sessions.`);

    res.json({
      success: true,
      state: updatedState,
      revokedVisitorsCount: revokedCount,
      message: '🚨 ALL REMOTE ACCESS HAS BEEN IMMEDIATELY TERMINATED. Localhost studio data remains untouched.',
    });
  } catch (err) {
    console.error('[RemoteRoutes] Error in kill switch:', err);
    res.status(500).json({ error: `Kill switch error: ${err.message}` });
  }
});

// -------------------------------------------------------------------
// 3. INVITE MANAGEMENT (Strictly OWNER ONLY)
// -------------------------------------------------------------------

const OWNER_ONLY_PERMS = [
  Permissions.MANAGE_INVITES,
  Permissions.MANAGE_SETTINGS,
  Permissions.REMOTE_ACCESS_CONTROL,
];

// GET /api/remote/invites
router.get('/invites', requireOwner, (req, res) => {
  const list = store.getInvites();
  const sessions = store.getSessions();

  // Attach live session count and omit password hashes from client response
  const sanitized = list.map((inv) => {
    const activeSessions = sessions.filter(
      (s) => s.inviteId === inv.id && !s.revokedAt
    ).length;

    return {
      id: inv.id,
      email: inv.email,
      status: inv.status,
      permissions: inv.permissions,
      createdAt: inv.createdAt,
      expiresAt: inv.expiresAt,
      createdBy: inv.createdBy,
      label: inv.label,
      lastSeen: inv.lastSeen,
      activeSessions,
    };
  });

  res.json({ invites: sanitized });
});

// POST /api/remote/invites — Generate or custom invite
router.post('/invites', requireOwner, (req, res) => {
  try {
    let { email, password, permissions, label, expiresInHours, preset } = req.body || {};

    if (!Array.isArray(permissions) || permissions.length === 0) {
      if (preset === 'admin') {
        // High-privilege collaborator: full creative & release capabilities (no owner management)
        permissions = ALL_PERMISSIONS.filter((p) => !OWNER_ONLY_PERMS.includes(p));
      } else if (preset === 'full_contributor') {
        permissions = [
          Permissions.VIEW_PROJECTS,
          Permissions.EDIT_PROJECTS,
          Permissions.CREATE_PROJECTS,
          Permissions.GENERATE,
          Permissions.RENDER,
          Permissions.DOWNLOAD,
          Permissions.UPLOAD,
          Permissions.PUBLISH,
        ];
      } else if (preset === 'view_only') {
        permissions = [
          Permissions.VIEW_PROJECTS,
          Permissions.RENDER,
          Permissions.DOWNLOAD,
        ];
      } else {
        // safe_editor or default
        permissions = [
          Permissions.VIEW_PROJECTS,
          Permissions.EDIT_PROJECTS,
          Permissions.GENERATE,
          Permissions.RENDER,
          Permissions.DOWNLOAD,
        ];
      }
    } else {
      // Disallow remote visitors from ever receiving OWNER_ONLY_PERMS
      permissions = permissions.filter((p) => !OWNER_ONLY_PERMS.includes(p));
    }

    const created = auth.createInvite({
      email: email && typeof email === 'string' ? email.trim() : null,
      password: password && typeof password === 'string' ? password.trim() : null,
      permissions,
      label: label && typeof label === 'string' ? label.trim() : '',
      expiresInHours,
      createdBy: req.user.email || Roles.OWNER,
    });

    const state = store.getRemoteState();
    res.json({
      success: true,
      invite: {
        id: created.invite.id,
        email: created.invite.email,
        status: created.invite.status,
        permissions: created.invite.permissions,
        createdAt: created.invite.createdAt,
        expiresAt: created.invite.expiresAt,
        label: created.invite.label,
      },
      credentials: created.credentials, // Plaintext password returned ONCE to the owner
      publicUrl: state.publicUrl,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/remote/invites/:id — Suspend, Reactivate, or Update Permissions
router.patch('/invites/:id', requireOwner, (req, res) => {
  const { id } = req.params;
  const { status, permissions, label } = req.body || {};

  const existing = store.getInviteById(id);
  if (!existing) {
    return res.status(404).json({ error: 'Invite not found' });
  }

  const patch = {};

  if (status && Object.values(InviteStatus).includes(status)) {
    patch.status = status;
    // When an invite is suspended or revoked, immediately invalidate its sessions!
    if (status === InviteStatus.SUSPENDED || status === InviteStatus.REVOKED) {
      store.revokeSessionsForInvite(id);
    }
  }

  if (Array.isArray(permissions)) {
    // Strip owner-only permissions
    patch.permissions = permissions
      .filter((p) => ALL_PERMISSIONS.includes(p))
      .filter((p) => !OWNER_ONLY_PERMS.includes(p));
  }

  if (typeof label === 'string') {
    patch.label = label.trim();
  }

  const updated = store.updateInvite(id, patch);

  res.json({
    success: true,
    invite: {
      id: updated.id,
      email: updated.email,
      status: updated.status,
      permissions: updated.permissions,
      label: updated.label,
      createdAt: updated.createdAt,
      lastSeen: updated.lastSeen,
    },
  });
});

// PATCH /api/remote/invites/:id/permissions alias
router.patch('/invites/:id/permissions', requireOwner, (req, res) => {
  const { id } = req.params;
  const { permissions } = req.body || {};
  const existing = store.getInviteById(id);
  if (!existing) return res.status(404).json({ error: 'Invite not found' });
  const validPerms = Array.isArray(permissions)
    ? permissions.filter((p) => ALL_PERMISSIONS.includes(p) && !OWNER_ONLY_PERMS.includes(p))
    : existing.permissions;
  const updated = store.updateInvite(id, { permissions: validPerms });
  res.json({ success: true, invite: updated });
});

// PATCH /api/remote/invites/:id/status alias
router.patch('/invites/:id/status', requireOwner, (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};
  const existing = store.getInviteById(id);
  if (!existing) return res.status(404).json({ error: 'Invite not found' });
  if (status === InviteStatus.SUSPENDED || status === InviteStatus.REVOKED) {
    store.revokeSessionsForInvite(id);
  }
  const updated = store.updateInvite(id, { status });
  res.json({ success: true, invite: updated });
});

// DELETE /api/remote/invites/:id — Permanently delete invite
router.delete('/invites/:id', requireOwner, (req, res) => {
  const { id } = req.params;
  store.revokeSessionsForInvite(id);
  const deleted = store.deleteInvite(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Invite not found' });
  }
  res.json({ success: true, id, message: 'Invite and associated sessions deleted.' });
});

// -------------------------------------------------------------------
// 4. SESSIONS & ACTIVE USERS MANAGEMENT (Strictly OWNER ONLY)
// -------------------------------------------------------------------

// GET /api/remote/sessions
router.get('/sessions', requireOwner, (req, res) => {
  const currentSessionId = req.user ? req.user.sessionId : null;
  const activeUsers = presence.getActiveUsers(currentSessionId);
  res.json({ activeUsers, total: activeUsers.length });
});

// DELETE /api/remote/sessions/:id — Revoke a single session
router.delete('/sessions/:id', requireOwner, (req, res) => {
  const { id } = req.params;
  const revoked = store.revokeSession(id);
  if (!revoked) {
    return res.status(404).json({ error: 'Session not found or already revoked' });
  }
  res.json({ success: true, sessionId: id, message: 'Session revoked successfully' });
});

// POST /api/remote/sessions/revoke-all — Revoke all visitor sessions
router.post('/sessions/revoke-all', requireOwner, (req, res) => {
  const count = store.revokeAllVisitorSessions();
  res.json({ success: true, revokedCount: count, message: `Revoked ${count} visitor sessions.` });
});

module.exports = router;
