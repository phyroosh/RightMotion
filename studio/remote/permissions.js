/**
 * RightMotion Remote Access & Permission System — Authorization & Middleware
 * Real-time permission evaluation with strict local owner capability validation.
 */

const store = require('./store');
const auth = require('./auth');
const { Permissions, ALL_PERMISSIONS, Roles, InviteStatus } = require('./types');

// Proxy & forwarding headers that indicate a reverse proxy or tunnel is forwarding the request
const PROXY_HEADER_NAMES = [
  'x-forwarded-for',
  'x-forwarded-host',
  'x-forwarded-proto',
  'x-forwarded-server',
  'via',
  'cf-connecting-ip',
  'x-real-ip',
  'forwarded',
  'tailscale-funnel',
  'x-rightmotion-transport-token',
];

/**
 * Checks whether an incoming HTTP request is a DIRECT, unproxied local connection
 * from a browser on the same physical machine, and NOT routed through a reverse proxy or tunnel.
 */
function isDirectLocalOrigin(req) {
  const remoteIp = req.socket?.remoteAddress || req.connection?.remoteAddress || '';
  const isLoopbackIp =
    remoteIp === '127.0.0.1' ||
    remoteIp === '::1' ||
    remoteIp === '::ffff:127.0.0.1';

  if (!isLoopbackIp) {
    return false;
  }

  // If ANY reverse-proxy or forwarding header is present, this connection was forwarded!
  for (const headerName of PROXY_HEADER_NAMES) {
    if (req.headers[headerName]) {
      return false;
    }
  }

  // Check Host header: must be strictly localhost or 127.0.0.1 (not an external domain)
  const host = (req.headers['host'] || '').toLowerCase();
  const isLocalHost =
    host.startsWith('localhost:') ||
    host === 'localhost' ||
    host.startsWith('127.0.0.1:') ||
    host === '127.0.0.1' ||
    host.startsWith('[::1]:') ||
    host === '[::1]';

  if (!isLocalHost) {
    return false;
  }

  // If remote access is enabled and has a public URL, verify host is not the public URL
  const remoteState = store.getRemoteState();
  if (remoteState.enabled && remoteState.publicUrl) {
    try {
      const parsedPublic = new URL(remoteState.publicUrl);
      if (host.includes(parsedPublic.host.toLowerCase())) {
        return false;
      }
    } catch (e) {}
  }

  // Cross-Site / Drive-By Defense: If Origin or Referer header is present, it MUST originate from localhost
  const origin = (req.headers['origin'] || '').toLowerCase();
  if (origin) {
    const isLocalOrigin =
      origin.startsWith('http://localhost') ||
      origin.startsWith('http://127.0.0.1') ||
      origin.startsWith('http://[::1]');
    if (!isLocalOrigin) {
      return false;
    }
  }

  const referer = (req.headers['referer'] || '').toLowerCase();
  if (referer) {
    const isLocalReferer =
      referer.startsWith('http://localhost') ||
      referer.startsWith('http://127.0.0.1') ||
      referer.startsWith('http://[::1]');
    if (!isLocalReferer) {
      return false;
    }
  }

  return true;
}

/**
 * Resolves the authenticated user identity and current permissions for the request.
 * Real-time: always looks up current invite state and current permissions.
 */
function resolveAuthContext(req) {
  const token = auth.extractTokenFromRequest(req);
  const ownerCap = store.getOrCreateOwnerCapability();

  // 1. Direct Local Owner Bootstrap: If direct local origin and no visitor token, issue/attach owner session
  if (isDirectLocalOrigin(req)) {
    // If the request presents an active visitor token, honor the visitor identity (useful for testing on localhost)
    if (token) {
      const tokenHash = auth.hashSessionToken(token);
      const session = store.getSessionByTokenHash(tokenHash);
      if (session && !session.revokedAt && session.role === Roles.VISITOR) {
        return resolveVisitorSession(session, req);
      }
    }

    // Otherwise, direct local connection is authenticated as the local OWNER capability
    return {
      role: Roles.OWNER,
      email: 'owner@localhost',
      permissions: ALL_PERMISSIONS,
      isLocalOwner: true,
      sessionId: 'local_owner_session',
      label: 'Local Host',
    };
  }

  // 2. Remote or Token-bearing request: MUST present a valid session token
  if (!token) {
    return null;
  }

  // 2a. Check if token matches the trusted Owner Token capability directly
  if (token === ownerCap.ownerToken) {
    return {
      role: Roles.OWNER,
      email: 'owner@rightmotion.local',
      permissions: ALL_PERMISSIONS,
      isLocalOwner: true,
      sessionId: 'owner_master_token',
      label: 'Owner Master',
    };
  }

  // 2b. Lookup active session in store
  const tokenHash = auth.hashSessionToken(token);
  const session = store.getSessionByTokenHash(tokenHash);
  if (!session || session.revokedAt) {
    return null;
  }

  // If session is an OWNER session (e.g. phone paired as owner)
  if (session.role === Roles.OWNER) {
    store.updateSessionLastSeen(session.id, req.socket?.remoteAddress, req.headers['user-agent']);
    return {
      role: Roles.OWNER,
      email: session.email || 'owner@rightmotion.local',
      permissions: ALL_PERMISSIONS,
      isLocalOwner: false,
      sessionId: session.id,
      label: session.label || 'Paired Owner Device',
    };
  }

  // If session is a VISITOR session, resolve real-time invite status and permissions
  return resolveVisitorSession(session, req);
}

function resolveVisitorSession(session, req) {
  if (!session.inviteId) {
    store.revokeSession(session.id);
    return null;
  }

  const invite = store.getInviteById(session.inviteId);
  if (!invite) {
    store.revokeSession(session.id);
    return null;
  }

  // Check real-time invite status
  if (invite.status !== InviteStatus.ACTIVE) {
    store.revokeSession(session.id);
    return null;
  }

  // Check expiration if set
  if (invite.expiresAt && new Date(invite.expiresAt).getTime() <= Date.now()) {
    store.updateInvite(invite.id, { status: InviteStatus.EXPIRED });
    store.revokeSession(session.id);
    return null;
  }

  // Update session last seen
  store.updateSessionLastSeen(session.id, req.socket?.remoteAddress, req.headers['user-agent']);

  return {
    role: Roles.VISITOR,
    email: invite.email,
    // REAL-TIME: Always evaluate current permissions stored in the invite!
    permissions: Array.isArray(invite.permissions) ? invite.permissions : [],
    inviteId: invite.id,
    sessionId: session.id,
    isLocalOwner: false,
    label: invite.label || 'Visitor Client',
  };
}

/**
 * Express middleware that attaches req.user to every request.
 */
function authContextMiddleware(req, res, next) {
  try {
    req.user = resolveAuthContext(req);

    // If request resolves as OWNER (direct local origin or verified owner token), set cookie seamlessly
    if (req.user && req.user.role === Roles.OWNER) {
      const cookies = auth.parseCookies(req.headers['cookie']);
      if (!cookies['rm_owner_session']) {
        const ownerCap = store.getOrCreateOwnerCapability();
        res.setHeader('Set-Cookie', `rm_owner_session=${ownerCap.ownerToken}; Path=/; HttpOnly; SameSite=Lax`);
      }
    }
  } catch (err) {
    console.error('[AuthMiddleware] Error resolving auth context:', err);
    req.user = null;
  }
  next();
}

/**
 * Core permission check function.
 */
function hasPermission(user, permission) {
  if (!user) return false;
  if (user.role === Roles.OWNER) return true;
  if (!permission) return true;
  return Array.isArray(user.permissions) && user.permissions.includes(permission);
}

/**
 * Express middleware generator to enforce a specific permission.
 * Returns 401 if unauthenticated, 403 if missing permission.
 */
function requirePermission(permission) {
  return function (req, res, next) {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required. Please log in with an active invite.',
        code: 'AUTH_REQUIRED',
        requiredPermission: permission,
      });
    }

    if (!hasPermission(req.user, permission)) {
      return res.status(403).json({
        error: `Forbidden: you do not have the required permission (${permission}) to perform this action.`,
        code: 'PERMISSION_DENIED',
        requiredPermission: permission,
      });
    }

    next();
  };
}

/**
 * Express middleware that strictly requires OWNER role.
 */
function requireOwner(req, res, next) {
  if (!req.user || req.user.role !== Roles.OWNER) {
    return res.status(403).json({
      error: 'Forbidden: this operation requires Owner privileges.',
      code: 'OWNER_REQUIRED',
    });
  }
  next();
}

module.exports = {
  isDirectLocalOrigin,
  resolveAuthContext,
  authContextMiddleware,
  hasPermission,
  requirePermission,
  requireOwner,
  Permissions,
};
