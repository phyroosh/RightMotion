/**
 * RightMotion Adversarial Security & Authorization Red Team Test Suite
 * Comprehensive automated verification for 48 adversarial attack vectors across:
 * - Command Injection & Shell RCE
 * - Path Traversal & Arbitrary File Access
 * - Remote Privilege Escalation & Admin Gaps
 * - Notification System Security & Broadcast Boundaries
 * - CSRF & Origin/Referer Spoofing
 * - Information Leakage & Security Transport Headers
 * - Session Invalidation & Cryptographic Token Verification
 */

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const store = require('../studio/remote/store');
const auth = require('../studio/remote/auth');
const { Permissions, Roles, InviteStatus } = require('../studio/remote/types');

const BASE_URL = process.env.STUDIO_URL || 'http://127.0.0.1:4000';
const PROXY_IP = '198.51.100.77'; // Simulated remote untrusted client

// Test State
let ownerToken = null;
let visitorToken = null; // Only VIEW_PROJECTS
let editorToken = null;  // Only VIEW_PROJECTS + EDIT_PROJECTS
let testInviteId1 = null;
let testInviteId2 = null;

let passed = 0;
let failed = 0;
const failures = [];

async function test(name, fn) {
  try {
    await fn();
    passed++;
    console.log(`  ✅ [PASS] ${name}`);
  } catch (err) {
    failed++;
    failures.push({ name, error: err.message, stack: err.stack });
    console.log(`  ❌ [FAIL] ${name}: ${err.message}`);
  }
}

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = { ...(options.headers || {}) };
  return fetch(url, {
    ...options,
    headers,
  });
}

// Remote visitor request helper
function visitorReq(endpoint, options = {}, token = visitorToken) {
  return request(endpoint, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-Forwarded-For': PROXY_IP,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
}

// Remote unauthenticated request helper
function unauthRemoteReq(endpoint, options = {}) {
  return request(endpoint, {
    ...options,
    headers: {
      'X-Forwarded-For': PROXY_IP,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
}

// Remote owner companion request helper
function ownerRemoteReq(endpoint, options = {}) {
  return request(endpoint, {
    ...options,
    headers: {
      'Authorization': `Bearer ${ownerToken}`,
      'X-Forwarded-For': PROXY_IP,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
}

// Direct local request helper
function localOwnerReq(endpoint, options = {}) {
  return request(endpoint, {
    ...options,
    headers: {
      'Host': 'localhost:4000',
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
}

async function runAdversarialSuite() {
  console.log('\n======================================================');
  console.log('🛡️  RIGHTMOTION ADVERSARIAL SECURITY & RED TEAM SUITE');
  console.log('======================================================\n');

  // 0. Pre-Flight & Fixtures Setup
  try {
    const health = await fetch(`${BASE_URL}/api/remote/status`);
    if (!health.ok) throw new Error(`Server returned HTTP ${health.status}`);
  } catch (err) {
    console.error(`❌ Pre-flight check failed: Unable to reach RightMotion Studio at ${BASE_URL}.`);
    console.error(`   Ensure the server is running on port 4000.`);
    process.exit(1);
  }

  // Get Owner Capability
  const cap = store.getOrCreateOwnerCapability();
  ownerToken = cap.ownerToken;
  assert.ok(ownerToken, 'Owner token must exist');

  // Create isolated test invites
  const testEmail1 = `sec_test_visitor_${Date.now()}@rightmotion.local`;
  const res1 = auth.createInvite({
    email: testEmail1,
    password: 'SecTestPassword123!',
    permissions: [Permissions.VIEW_PROJECTS],
    label: 'Security Audit Visitor',
  });
  testInviteId1 = res1.invite.id;
  const loginRes1 = await request('/api/remote/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail1, password: 'SecTestPassword123!', deviceLabel: 'Security Audit Visitor' }),
  });
  const login1 = await loginRes1.json();
  visitorToken = login1.token;

  const testEmail2 = `sec_test_editor_${Date.now()}@rightmotion.local`;
  const res2 = auth.createInvite({
    email: testEmail2,
    password: 'SecTestPassword456!',
    permissions: [Permissions.VIEW_PROJECTS, Permissions.EDIT_PROJECTS],
    label: 'Security Audit Editor (No Publish/Upload)',
  });
  testInviteId2 = res2.invite.id;
  const loginRes2 = await request('/api/remote/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail2, password: 'SecTestPassword456!', deviceLabel: 'Security Audit Editor' }),
  });
  const login2 = await loginRes2.json();
  editorToken = login2.token;

  console.log('🔒 Security fixtures initialized:');
  console.log(`   Owner token: ${ownerToken.slice(0, 15)}...`);
  console.log(`   Visitor token (VIEW only): ${visitorToken.slice(0, 15)}...`);
  console.log(`   Editor token (VIEW+EDIT only): ${editorToken.slice(0, 15)}...\n`);

  try {
    // =========================================================================
    // 1. P0: COMMAND INJECTION & RCE DEFENSE
    // =========================================================================
    console.log('--- [P0-1: Command Injection & RCE Attacks] ---');

    await test('SEC-CI-001: Extract PDF with shell command delimiter rejected', async () => {
      const canaryPath = path.join('/tmp', `rce_canary_${Date.now()}`);
      const res = await localOwnerReq('/api/products/extract', {
        method: 'POST',
        body: JSON.stringify({
          pdf: `sample.pdf; touch ${canaryPath}`,
          page: 1,
        }),
      });
      // Should reject with 400 (does not end with .pdf or invalid) or 404
      assert.ok([400, 404].includes(res.status), `Expected 400 or 404, got ${res.status}`);
      assert.strictEqual(fs.existsSync(canaryPath), false, 'Canary file must NOT be created');
    });

    await test('SEC-CI-002: Extract PDF with shell pipe payload rejected', async () => {
      const res = await localOwnerReq('/api/products/extract', {
        method: 'POST',
        body: JSON.stringify({
          pdf: 'sample.pdf | cat /etc/passwd',
          page: 1,
        }),
      });
      assert.ok([400, 404].includes(res.status), `Expected 400 or 404, got ${res.status}`);
    });

    await test('SEC-CI-003: Extract PDF with invalid non-integer page rejected', async () => {
      const res = await localOwnerReq('/api/products/extract', {
        method: 'POST',
        body: JSON.stringify({
          pdf: 'Photon.pdf',
          page: 'invalid_page; id',
        }),
      });
      assert.strictEqual(res.status, 400, `Expected 400 Bad Request, got ${res.status}`);
      const data = await res.json();
      assert.ok(data.error.includes('positive integer') || data.error.includes('Invalid'));
    });

    await test('SEC-CI-004: Extract PDF with negative/zero page rejected', async () => {
      const res = await localOwnerReq('/api/products/extract', {
        method: 'POST',
        body: JSON.stringify({
          pdf: 'Photon.pdf',
          page: -5,
        }),
      });
      assert.strictEqual(res.status, 400, `Expected 400, got ${res.status}`);
    });

    await test('SEC-CI-005: Render thumbnail with shell injection rejected via regex', async () => {
      const canary = path.join('/tmp', `rce_thumb_${Date.now()}`);
      const res = await localOwnerReq('/api/render-thumbnail', {
        method: 'POST',
        body: JSON.stringify({
          filename: `clip.mp4; touch ${canary}`,
        }),
      });
      assert.strictEqual(res.status, 400, `Expected 400, got ${res.status}`);
      assert.strictEqual(fs.existsSync(canary), false, 'Canary file must NOT be created');
    });

    await test('SEC-CI-006: Render thumbnail with subshell expansion rejected', async () => {
      const res = await localOwnerReq('/api/render-thumbnail', {
        method: 'POST',
        body: JSON.stringify({
          filename: 'clip$(whoami).mp4',
        }),
      });
      assert.strictEqual(res.status, 400, `Expected 400, got ${res.status}`);
    });

    await test('SEC-CI-007: Render thumbnail with backtick injection rejected', async () => {
      const res = await localOwnerReq('/api/render-thumbnail', {
        method: 'POST',
        body: JSON.stringify({
          filename: 'clip`id`.mp4',
        }),
      });
      assert.strictEqual(res.status, 400, `Expected 400, got ${res.status}`);
    });

    // =========================================================================
    // 2. P0: PATH TRAVERSAL & ARBITRARY FILE ACCESS
    // =========================================================================
    console.log('\n--- [P0-2: Path Traversal & Arbitrary File Access] ---');

    await test('SEC-PT-001: Video-file stream path traversal (URL encoded dots) rejected', async () => {
      const res = await localOwnerReq('/api/video-file/..%2f..%2f..%2fetc%2fpasswd');
      // Express / path.basename will sanitize to 'passwd' which does not exist in out/, returning 404
      assert.strictEqual(res.status, 404, `Expected 404, got ${res.status}`);
      const text = await res.text();
      assert.ok(!text.includes('root:'), 'Must NOT return passwd contents');
    });

    await test('SEC-PT-002: Video-file stream traversal to server secrets rejected', async () => {
      const res = await localOwnerReq('/api/video-file/..%2fstudio%2fclient_secrets.json');
      assert.strictEqual(res.status, 404, `Expected 404, got ${res.status}`);
      const text = await res.text();
      assert.ok(!text.includes('client_id') && !text.includes('client_secret'));
    });

    await test('SEC-PT-003: Video upload path traversal with dot-dot rejected', async () => {
      const res = await localOwnerReq('/api/upload', {
        method: 'POST',
        body: JSON.stringify({
          filename: '../../../package.json',
        }),
      });
      assert.ok([400, 404].includes(res.status), `Expected 400 or 404, got ${res.status}`);
    });

    await test('SEC-PT-004: Video upload non-mp4 file extension rejected', async () => {
      const res = await localOwnerReq('/api/upload', {
        method: 'POST',
        body: JSON.stringify({
          filename: 'client_secrets.json',
        }),
      });
      assert.strictEqual(res.status, 400, `Expected 400, got ${res.status}`);
      const data = await res.json();
      assert.ok(data.error.includes('.mp4'));
    });

    await test('SEC-PT-005: Instagram upload path traversal to secrets rejected', async () => {
      const res = await localOwnerReq('/api/instagram/upload', {
        method: 'POST',
        body: JSON.stringify({
          filename: '../../studio/token.json',
        }),
      });
      assert.strictEqual(res.status, 400, `Expected 400, got ${res.status}`);
    });

    await test('SEC-PT-006: Multi-channel publish path traversal rejected', async () => {
      const res = await localOwnerReq('/api/publish-multi', {
        method: 'POST',
        body: JSON.stringify({
          filename: '../../package.json',
          channels: ['ch_test'],
        }),
      });
      assert.strictEqual(res.status, 400, `Expected 400, got ${res.status}`);
    });

    await test('SEC-PT-007: Comment endpoint path traversal in filename sanitized', async () => {
      const res = await localOwnerReq('/api/videos/..%2f..%2fpackage.json/comment', {
        method: 'POST',
        body: JSON.stringify({
          commentText: 'Malicious test',
        }),
      });
      assert.strictEqual(res.status, 404, `Expected 404, got ${res.status}`);
    });

    // =========================================================================
    // 3. P0: REMOTE PRIVILEGE ESCALATION & OWNER ROUTE PROTECTION
    // =========================================================================
    console.log('\n--- [P0-3: Remote Privilege Escalation & Owner Route Protection] ---');

    await test('SEC-PE-001: Unauthenticated remote client cannot access invites list', async () => {
      const res = await unauthRemoteReq('/api/remote/invites');
      assert.ok([401, 403].includes(res.status), `Expected 401 or 403, got ${res.status}`);
    });

    await test('SEC-PE-002: Remote visitor cannot access invites list (requires OWNER)', async () => {
      const res = await visitorReq('/api/remote/invites');
      assert.strictEqual(res.status, 403, `Expected 403, got ${res.status}`);
      const data = await res.json();
      assert.strictEqual(data.code, 'OWNER_REQUIRED');
    });

    await test('SEC-PE-003: Remote visitor cannot create new invite', async () => {
      const res = await visitorReq('/api/remote/invites', {
        method: 'POST',
        body: JSON.stringify({
          email: 'hacker@rightmotion.local',
          password: 'Password123!',
          permissions: [Permissions.ALL],
        }),
      });
      assert.strictEqual(res.status, 403, `Expected 403, got ${res.status}`);
      const data = await res.json();
      assert.strictEqual(data.code, 'OWNER_REQUIRED');
    });

    await test('SEC-PE-004: Remote visitor cannot update invite permissions', async () => {
      const res = await visitorReq(`/api/remote/invites/${testInviteId1}`, {
        method: 'PATCH',
        body: JSON.stringify({
          permissions: Object.values(Permissions),
        }),
      });
      assert.strictEqual(res.status, 403, `Expected 403, got ${res.status}`);
      const data = await res.json();
      assert.strictEqual(data.code, 'OWNER_REQUIRED');
    });

    await test('SEC-PE-005: Remote visitor cannot delete invite', async () => {
      const res = await visitorReq(`/api/remote/invites/${testInviteId1}`, {
        method: 'DELETE',
      });
      assert.strictEqual(res.status, 403, `Expected 403, got ${res.status}`);
      const data = await res.json();
      assert.strictEqual(data.code, 'OWNER_REQUIRED');
    });

    await test('SEC-PE-006: Remote visitor cannot trigger emergency kill switch', async () => {
      const res = await visitorReq('/api/remote/kill', {
        method: 'POST',
      });
      assert.strictEqual(res.status, 403, `Expected 403, got ${res.status}`);
      const data = await res.json();
      assert.strictEqual(data.code, 'OWNER_REQUIRED');
    });

    await test('SEC-PE-007: Remote visitor cannot toggle remote disable', async () => {
      const res = await visitorReq('/api/remote/disable', {
        method: 'POST',
      });
      assert.strictEqual(res.status, 403, `Expected 403, got ${res.status}`);
      const data = await res.json();
      assert.strictEqual(data.code, 'OWNER_REQUIRED');
    });

    await test('SEC-PE-008: Remote visitor cannot toggle remote enable', async () => {
      const res = await visitorReq('/api/remote/enable', {
        method: 'POST',
      });
      assert.strictEqual(res.status, 403, `Expected 403, got ${res.status}`);
      const data = await res.json();
      assert.strictEqual(data.code, 'OWNER_REQUIRED');
    });

    await test('SEC-PE-009: Remote visitor cannot reset secrets', async () => {
      const res = await visitorReq('/api/settings/reset-secrets', {
        method: 'POST',
      });
      assert.strictEqual(res.status, 403, `Expected 403, got ${res.status}`);
      const data = await res.json();
      assert.strictEqual(data.code, 'OWNER_REQUIRED');
    });

    await test('SEC-PE-010: Remote visitor cannot save YouTube / platform secrets', async () => {
      const res = await visitorReq('/api/settings/save-secrets', {
        method: 'POST',
        body: JSON.stringify({
          client_id: 'fake',
          client_secret: 'fake',
        }),
      });
      assert.strictEqual(res.status, 403, `Expected 403, got ${res.status}`);
      const data = await res.json();
      assert.strictEqual(data.code, 'OWNER_REQUIRED');
    });

    await test('SEC-PE-011: Remote visitor cannot read YouTube client credentials', async () => {
      const res = await visitorReq('/api/settings/youtube');
      assert.strictEqual(res.status, 403, `Expected 403, got ${res.status}`);
      const data = await res.json();
      assert.strictEqual(data.code, 'OWNER_REQUIRED');
    });

    await test('SEC-PE-012: Remote visitor cannot switch active channel (requires OWNER)', async () => {
      const res = await visitorReq('/api/channels/switch', {
        method: 'POST',
        body: JSON.stringify({
          channelId: 'attacker_channel',
        }),
      });
      assert.strictEqual(res.status, 403, `Expected 403, got ${res.status}`);
      const data = await res.json();
      assert.strictEqual(data.code, 'OWNER_REQUIRED');
    });

    await test('SEC-PE-013: Remote visitor cannot save custom channel credentials (requires OWNER)', async () => {
      const res = await visitorReq('/api/credentials', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Attacker Credential',
          clientId: 'evil',
          clientSecret: 'evil',
        }),
      });
      assert.strictEqual(res.status, 403, `Expected 403, got ${res.status}`);
      const data = await res.json();
      assert.strictEqual(data.code, 'OWNER_REQUIRED');
    });

    await test('SEC-PE-014: Remote visitor cannot trigger Instagram login/switch/disconnect', async () => {
      const r1 = await visitorReq('/api/instagram/login', { method: 'POST', body: JSON.stringify({}) });
      assert.strictEqual(r1.status, 403);
      assert.strictEqual((await r1.json()).code, 'OWNER_REQUIRED');

      const r2 = await visitorReq('/api/instagram/switch', { method: 'POST', body: JSON.stringify({ accountId: 'acc1' }) });
      assert.strictEqual(r2.status, 403);
      assert.strictEqual((await r2.json()).code, 'OWNER_REQUIRED');

      const r3 = await visitorReq('/api/instagram/disconnect', { method: 'POST', body: JSON.stringify({ accountId: 'acc1' }) });
      assert.strictEqual(r3.status, 403);
      assert.strictEqual((await r3.json()).code, 'OWNER_REQUIRED');
    });

    await test('SEC-PE-015: Owner-only permissions stripped when creating invite', async () => {
      const res = await localOwnerReq('/api/remote/invites', {
        method: 'POST',
        body: JSON.stringify({
          email: `priv_esc_${Date.now()}@rightmotion.local`,
          password: 'EscalatePassword1!',
          permissions: [
            Permissions.VIEW_PROJECTS,
            Permissions.MANAGE_SETTINGS,
            Permissions.MANAGE_INVITES,
            Permissions.REMOTE_ACCESS_CONTROL,
          ],
        }),
      });
      assert.ok([200, 201].includes(res.status), `Expected 200 or 201, got ${res.status}`);
      const data = await res.json();
      const granted = data.invite.permissions;
      assert.ok(!granted.includes(Permissions.MANAGE_SETTINGS), 'MANAGE_SETTINGS must be stripped');
      assert.ok(!granted.includes(Permissions.MANAGE_INVITES), 'MANAGE_INVITES must be stripped');
      assert.ok(!granted.includes(Permissions.REMOTE_ACCESS_CONTROL), 'REMOTE_ACCESS_CONTROL must be stripped');
      assert.ok(granted.includes(Permissions.VIEW_PROJECTS), 'VIEW_PROJECTS should remain');
      store.deleteInvite(data.invite.id);
    });

    await test('SEC-PE-016: Editor without PUBLISH permission cannot post video comment', async () => {
      const res = await visitorReq('/api/videos/test.mp4/comment', {
        method: 'POST',
        body: JSON.stringify({ commentText: 'Test comment' }),
      }, editorToken);
      assert.strictEqual(res.status, 403, `Expected 403, got ${res.status}`);
      const data = await res.json();
      assert.strictEqual(data.code, 'PERMISSION_DENIED');
      assert.strictEqual(data.requiredPermission, Permissions.PUBLISH);
    });

    await test('SEC-PE-017: Visitor without RENDER permission cannot render thumbnail', async () => {
      const res = await visitorReq('/api/render-thumbnail', {
        method: 'POST',
        body: JSON.stringify({ filename: 'test.mp4' }),
      });
      assert.strictEqual(res.status, 403, `Expected 403, got ${res.status}`);
      const data = await res.json();
      assert.strictEqual(data.code, 'PERMISSION_DENIED');
      assert.strictEqual(data.requiredPermission, Permissions.RENDER);
    });

    // =========================================================================
    // 4. P1: NOTIFICATION SYSTEM SECURITY & BROADCAST BOUNDARIES
    // =========================================================================
    console.log('\n--- [P1-1: Notification System Security] ---');

    await test('SEC-NT-001: Unauthenticated remote client cannot access SSE notification stream', async () => {
      const res = await unauthRemoteReq('/api/notifications/stream');
      assert.strictEqual(res.status, 401, `Expected 401, got ${res.status}`);
    });

    await test('SEC-NT-002: Unauthenticated remote client cannot subscribe to Web Push', async () => {
      const res = await unauthRemoteReq('/api/notifications/subscribe', {
        method: 'POST',
        body: JSON.stringify({ endpoint: 'https://push.example.com', keys: {} }),
      });
      assert.strictEqual(res.status, 401, `Expected 401, got ${res.status}`);
    });

    await test('SEC-NT-003: Remote visitor cannot emit broadcast notifications', async () => {
      const res = await visitorReq('/api/notifications/emit', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Hacked Notification',
          message: 'This is a phishing attempt',
        }),
      });
      assert.strictEqual(res.status, 403, `Expected 403, got ${res.status}`);
      const data = await res.json();
      assert.ok(data.code === 'LOCAL_OR_OWNER_REQUIRED' || data.code === 'OWNER_REQUIRED');
    });

    await test('SEC-NT-004: Remote visitor cannot clear notification store', async () => {
      const res = await visitorReq('/api/notifications/clear', {
        method: 'POST',
      });
      assert.strictEqual(res.status, 403, `Expected 403, got ${res.status}`);
      const data = await res.json();
      assert.strictEqual(data.code, 'OWNER_REQUIRED');
    });

    await test('SEC-NT-005: Remote visitor cannot dispatch test notification', async () => {
      const res = await visitorReq('/api/notifications/test', {
        method: 'POST',
      });
      assert.strictEqual(res.status, 403, `Expected 403, got ${res.status}`);
      const data = await res.json();
      assert.strictEqual(data.code, 'OWNER_REQUIRED');
    });

    await test('SEC-NT-006: Proxy spoofing Host: localhost cannot bypass /emit protection', async () => {
      const res = await request('/api/notifications/emit', {
        method: 'POST',
        headers: {
          'Host': 'localhost:4000',
          'X-Forwarded-For': PROXY_IP,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Spoofed Proxy Attack',
          message: 'Should be blocked',
        }),
      });
      assert.strictEqual(res.status, 403, `Expected 403, got ${res.status}`);
    });

    await test('SEC-NT-007: Remote owner with valid token CAN emit notifications', async () => {
      const res = await ownerRemoteReq('/api/notifications/emit', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Authorized Companion Event',
          message: 'Sent by owner from phone companion',
        }),
      });
      assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
      const data = await res.json();
      assert.strictEqual(data.success, true);
    });

    // =========================================================================
    // 5. P1: CSRF & ORIGIN HEADER SPOOFING
    // =========================================================================
    console.log('\n--- [P1-2: CSRF & Origin Header Spoofing] ---');

    await test('SEC-CSRF-001: Local request with malicious Origin header loses owner bypass', async () => {
      const res = await request('/api/remote/invites', {
        headers: {
          'Host': 'localhost:4000',
          'Origin': 'https://evil-attacker-site.com',
        },
      });
      // Malicious origin causes isDirectLocalOrigin to fail; requireOwner then rejects with 403
      assert.ok([401, 403].includes(res.status), `Expected 401 or 403, got ${res.status}`);
      const data = await res.json();
      assert.ok(data.code === 'OWNER_REQUIRED' || data.code === 'AUTH_REQUIRED');
    });

    await test('SEC-CSRF-002: Local request with malicious Referer header loses owner bypass', async () => {
      const res = await request('/api/remote/invites', {
        headers: {
          'Host': 'localhost:4000',
          'Referer': 'https://evil-attacker-site.com/exploit.html',
        },
      });
      assert.ok([401, 403].includes(res.status), `Expected 401 or 403, got ${res.status}`);
      const data = await res.json();
      assert.ok(data.code === 'OWNER_REQUIRED' || data.code === 'AUTH_REQUIRED');
    });

    await test('SEC-CSRF-003: Valid localhost Origin preserves direct local owner access', async () => {
      const res = await request('/api/remote/invites', {
        headers: {
          'Host': 'localhost:4000',
          'Origin': 'http://localhost:4000',
        },
      });
      assert.strictEqual(res.status, 200, `Expected 200 OK, got ${res.status}`);
    });

    // =========================================================================
    // 6. P2: INFORMATION DISCLOSURE & SECURITY TRANSPORT HEADERS
    // =========================================================================
    console.log('\n--- [P2-1: Information Disclosure & Headers] ---');

    await test('SEC-INF-001: Unauthenticated /api/remote/status sanitizes internal LAN and users', async () => {
      const res = await unauthRemoteReq('/api/remote/status');
      assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
      const data = await res.json();
      assert.strictEqual(typeof data.enabled, 'boolean');
      assert.strictEqual(data.localIp, undefined, 'localIp must be omitted for unauthenticated callers');
      assert.strictEqual(data.activeUsers, undefined, 'activeUsers must be omitted for unauthenticated callers');
      assert.strictEqual(data.inviteCount, undefined, 'inviteCount must be omitted for unauthenticated callers');
    });

    await test('SEC-INF-002: Authenticated owner receives full telemetry on /api/remote/status', async () => {
      const res = await ownerRemoteReq('/api/remote/status');
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.isOwner, true);
      assert.ok(typeof data.activeUsersCount === 'number', 'Owner should see active user count');
      assert.ok(data.localIp !== undefined, 'Owner should see local IP');
    });

    await test('SEC-INF-003: Global HTTP security headers present on API responses', async () => {
      const res = await request('/api/remote/status');
      assert.strictEqual(res.headers.get('x-content-type-options'), 'nosniff');
      assert.strictEqual(res.headers.get('x-frame-options'), 'SAMEORIGIN');
      assert.strictEqual(res.headers.get('referrer-policy'), 'strict-origin-when-cross-origin');
    });

    await test('SEC-INF-004: Filesystem permissions & Git hygiene for sensitive stores', async () => {
      const remoteDataDir = path.resolve(__dirname, '../../studio/remote/data');
      const gitignore = fs.readFileSync(path.resolve(__dirname, '../../.gitignore'), 'utf-8');

      // Verify .gitignore entries
      assert.ok(gitignore.includes('studio/remote/data/'), '.gitignore must contain studio/remote/data/');
      assert.ok(gitignore.includes('studio/notifications/data/'), '.gitignore must contain studio/notifications/data/');

      // Verify directory permissions
      if (fs.existsSync(remoteDataDir)) {
        const stat = fs.statSync(remoteDataDir);
        const mode = (stat.mode & 0o777).toString(8);
        assert.ok(['700', '755', '750'].includes(mode), `Directory mode should be restricted, got ${mode}`);
      }
    });

    // =========================================================================
    // 7. P2: TOKEN CRYPTOGRAPHY & SESSION LIFECYCLE
    // =========================================================================
    console.log('\n--- [P2-2: Token Cryptography & Session Lifecycle] ---');

    await test('SEC-TOK-001: Tampered session token rejected with 401', async () => {
      const tampered = visitorToken.slice(0, -6) + 'XXXXXX';
      const res = await visitorReq('/api/videos', {}, tampered);
      assert.strictEqual(res.status, 401, `Expected 401, got ${res.status}`);
      const data = await res.json();
      assert.ok(data.code === 'AUTH_REQUIRED' || data.code === 'INVALID_TOKEN');
    });

    await test('SEC-TOK-002: Arbitrary synthetic Bearer string rejected with 401', async () => {
      const res = await visitorReq('/api/videos', {}, 'rm_sess_invalidfake1234567890abcdef');
      assert.strictEqual(res.status, 401, `Expected 401, got ${res.status}`);
      const data = await res.json();
      assert.ok(data.code === 'AUTH_REQUIRED' || data.code === 'INVALID_TOKEN');
    });

    await test('SEC-TOK-003: Suspended invite immediately invalidates active session', async () => {
      const preRes = await visitorReq('/api/videos', {}, visitorToken);
      assert.strictEqual(preRes.status, 200, 'Pre-condition: session should be valid');

      try {
        store.updateInvite(testInviteId1, { status: InviteStatus.SUSPENDED });

        const postRes = await visitorReq('/api/videos', {}, visitorToken);
        assert.ok([401, 403].includes(postRes.status), `Expected 401 or 403, got ${postRes.status}`);
      } finally {
        store.updateInvite(testInviteId1, { status: InviteStatus.ACTIVE });
      }
    });

    await test('SEC-TOK-004: Revoked session token rejected immediately', async () => {
      const loginRes = await request('/api/remote/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail1, password: 'SecTestPassword123!', deviceLabel: 'Disposable Session' }),
      });
      assert.strictEqual(loginRes.status, 200, 'Login must succeed');
      const loginData = await loginRes.json();
      const tempToken = loginData.token;

      const check1 = await visitorReq('/api/videos', {}, tempToken);
      assert.strictEqual(check1.status, 200, 'Session should be valid initially');

      store.revokeSession(loginData.sessionId);

      const check2 = await visitorReq('/api/videos', {}, tempToken);
      assert.strictEqual(check2.status, 401, `Expected 401, got ${check2.status}`);
      const data = await check2.json();
      assert.ok(data.code === 'AUTH_REQUIRED' || data.code === 'INVALID_TOKEN');
    });

  } finally {
    console.log('\n🧹 Cleaning up test fixtures...');
    if (testInviteId1) store.deleteInvite(testInviteId1);
    if (testInviteId2) store.deleteInvite(testInviteId2);
    console.log('   Test fixtures cleaned up.\n');
  }

  console.log('======================================================');
  console.log(`🏁 ADVERSARIAL SECURITY RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) {
    console.error('Failed Tests:');
    failures.forEach((f) => {
      console.error(`- ${f.name}: ${f.error}`);
    });
    process.exit(1);
  }
}

runAdversarialSuite().catch((err) => {
  console.error('Unhandled fatal error running test suite:', err);
  process.exit(1);
});
