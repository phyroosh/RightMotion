/**
 * RightMotion Remote Access & Permission System — Presence & Heartbeat Tracking
 */

const store = require('./store');
const { Roles, InviteStatus } = require('./types');

const ACTIVE_THRESHOLD_MS = 60 * 1000; // Active if heartbeat seen within 60s
const IDLE_THRESHOLD_MS = 5 * 60 * 1000; // Idle between 60s and 5m; stale after 5m

function parseDeviceLabel(userAgent = '') {
  if (!userAgent) return 'Web Client';
  const ua = userAgent.toLowerCase();

  // Mobile checks
  if (ua.includes('iphone')) return 'iPhone';
  if (ua.includes('ipad')) return 'iPad';
  if (ua.includes('android')) return ua.includes('mobile') ? 'Android Phone' : 'Android Tablet';

  // Desktop OS & Browser
  let os = 'Desktop';
  if (ua.includes('macintosh') || ua.includes('mac os x')) os = 'Mac';
  else if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('linux')) os = 'Linux';

  let browser = 'Browser';
  if (ua.includes('edg/')) browser = 'Edge';
  else if (ua.includes('chrome/') && !ua.includes('edg/')) browser = 'Chrome';
  else if (ua.includes('safari/') && !ua.includes('chrome/')) browser = 'Safari';
  else if (ua.includes('firefox/')) browser = 'Firefox';

  return `${os} • ${browser}`;
}

function getActiveUsers(currentSessionId = null) {
  const allSessions = store.getSessions();
  const allInvites = store.getInvites();
  const inviteMap = new Map(allInvites.map((i) => [i.id, i]));
  const now = Date.now();

  const activeList = [];

  for (const sess of allSessions) {
    if (sess.revokedAt) continue;

    // If session belongs to an invite, ensure invite is active
    if (sess.inviteId) {
      const inv = inviteMap.get(sess.inviteId);
      if (!inv || inv.status !== InviteStatus.ACTIVE) {
        continue;
      }
    }

    const lastSeenMs = sess.lastSeen ? new Date(sess.lastSeen).getTime() : 0;
    const diffMs = now - lastSeenMs;

    // Consider user active or idle if seen within IDLE_THRESHOLD_MS
    if (diffMs <= IDLE_THRESHOLD_MS) {
      const secondsAgo = Math.max(0, Math.round(diffMs / 1000));
      const isOnline = diffMs <= ACTIVE_THRESHOLD_MS;

      activeList.push({
        id: sess.id,
        email: sess.email || (sess.role === Roles.OWNER ? 'Local Owner' : 'visitor'),
        role: sess.role,
        label: sess.label || (sess.role === Roles.OWNER ? 'Local Host' : parseDeviceLabel(sess.userAgent)),
        deviceLabel: parseDeviceLabel(sess.userAgent),
        userAgent: sess.userAgent || '',
        ip: sess.ip || '127.0.0.1',
        createdAt: sess.createdAt,
        lastSeen: sess.lastSeen,
        secondsAgo,
        status: isOnline ? 'ONLINE' : 'IDLE',
        isCurrent: currentSessionId ? sess.id === currentSessionId : false,
      });
    }
  }

  // Sort: online first, then by most recent lastSeen
  activeList.sort((a, b) => {
    if (a.status === 'ONLINE' && b.status !== 'ONLINE') return -1;
    if (b.status === 'ONLINE' && a.status !== 'ONLINE') return 1;
    return (a.secondsAgo || 0) - (b.secondsAgo || 0);
  });

  return activeList;
}

function processHeartbeat(sessionId, ip, userAgent) {
  const sess = store.getSessionById(sessionId);
  if (!sess) {
    return { valid: false, error: 'Session not found or expired' };
  }

  // If visitor session, check invite status in real time
  if (sess.inviteId) {
    const invite = store.getInviteById(sess.inviteId);
    if (!invite) {
      store.revokeSession(sessionId);
      return { valid: false, error: 'Associated invite was removed' };
    }
    if (invite.status !== InviteStatus.ACTIVE) {
      store.revokeSession(sessionId);
      return { valid: false, error: `Invite is ${invite.status.toLowerCase()}` };
    }
    if (invite.expiresAt && new Date(invite.expiresAt).getTime() <= Date.now()) {
      store.updateInvite(invite.id, { status: InviteStatus.EXPIRED });
      store.revokeSession(sessionId);
      return { valid: false, error: 'Invite has expired' };
    }

    // Update invite's lastSeen
    store.updateInvite(invite.id, { lastSeen: new Date().toISOString() });
  }

  store.updateSessionLastSeen(sessionId, ip, userAgent);
  return { valid: true };
}

module.exports = {
  parseDeviceLabel,
  getActiveUsers,
  processHeartbeat,
  ACTIVE_THRESHOLD_MS,
  IDLE_THRESHOLD_MS,
};
