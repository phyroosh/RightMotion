/**
 * Automated Test Suite for RightMotion Remote Access & Permission System
 * Covers Test Matrix AUTH-001 through AUTH-015
 */

const http = require('http');
const path = require('path');
const fs = require('fs');
const assert = require('assert');

// Point to test data directory so we don't mess up live data
const TEST_DATA_DIR = path.join(__dirname, 'test_data');
if (!fs.existsSync(TEST_DATA_DIR)) {
  fs.mkdirSync(TEST_DATA_DIR, { recursive: true });
}

// We will launch a lightweight Express app with the exact same middleware and routes
const express = require('express');
const { authContextMiddleware, requirePermission, Permissions } = require('../../studio/remote/permissions');
const remoteRouter = require('../../studio/remote/routes');
const store = require('../../studio/remote/store');
const auth = require('../../studio/remote/auth');
const { Roles, InviteStatus } = require('../../studio/remote/types');

const app = express();
app.use(express.json());
app.use(authContextMiddleware);
app.use('/api/remote', remoteRouter);

// Mock protected routes matching studio/server.js
app.get('/api/videos', requirePermission(Permissions.VIEW_PROJECTS), (req, res) => {
  res.json({ success: true, videos: ['video1.mp4'] });
});

app.post('/api/upload', requirePermission(Permissions.UPLOAD), (req, res) => {
  res.json({ success: true, message: 'Uploaded successfully' });
});

app.post('/api/publish-multi', requirePermission(Permissions.PUBLISH), (req, res) => {
  res.json({ success: true, message: 'Published successfully' });
});

app.post('/api/settings/save-secrets', requirePermission(Permissions.MANAGE_SETTINGS), (req, res) => {
  res.json({ success: true, message: 'Settings saved' });
});

let server;
const TEST_PORT = 4099;
const BASE_URL = `http://127.0.0.1:${TEST_PORT}`;

function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = options.headers || {};
  return fetch(url, {
    ...options,
    headers,
  });
}

async function runTests() {
  console.log('\n======================================================');
  console.log('🧪 RUNNING RIGHTMOTION REMOTE ACCESS TEST MATRIX');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${name}: ${err.message}`);
      failed++;
    }
  }

  // Start test server
  await new Promise((resolve) => {
    server = app.listen(TEST_PORT, () => resolve());
  });

  // Clean up any test fixtures from previous runs
  const testEmails = ['visitor_test@rightmotion.local', 'phone_user@rightmotion.local', 'admin_friend@rightmotion.local'];
  testEmails.forEach(email => {
    const existing = store.getInviteByEmail(email);
    if (existing) store.deleteInvite(existing.id);
  });
  const prevSessions = store.getSessions();
  const cleanedSessions = prevSessions.filter(s => !testEmails.includes(s.email));
  store.saveSessions(cleanedSessions);

  try {
    // -------------------------------------------------------------
    // AUTH-001: Owner localhost access requires no login
    // -------------------------------------------------------------
    await test('AUTH-001: Owner localhost access requires no login', async () => {
      // Direct local request from 127.0.0.1 with local Host header
      const res = await request('/api/videos', {
        headers: { Host: `localhost:${TEST_PORT}` },
      });
      assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
      const data = await res.json();
      assert.strictEqual(data.success, true);
    });

    // -------------------------------------------------------------
    // AUTH-002: Remote visitor must authenticate
    // -------------------------------------------------------------
    await test('AUTH-002: Visitor must authenticate (proxy signal prevents owner bypass)', async () => {
      // Remote visitor simulated via X-Forwarded-For header
      const res = await request('/api/videos', {
        headers: {
          Host: `studio.rightmotion.funnel.com`,
          'X-Forwarded-For': '203.0.113.195',
        },
      });
      assert.strictEqual(res.status, 401, `Expected 401, got ${res.status}`);
      const data = await res.json();
      assert.strictEqual(data.code, 'AUTH_REQUIRED');
    });

    // Create a base invite for testing
    const inviteRes = auth.createInvite({
      email: 'visitor_test@rightmotion.local',
      password: 'StrongSecretPassword123!',
      permissions: [Permissions.VIEW_PROJECTS, Permissions.RENDER, Permissions.DOWNLOAD],
      label: "Friend's Laptop",
    });
    const { invite, credentials } = inviteRes;

    // -------------------------------------------------------------
    // AUTH-003: Invalid credentials rejected
    // -------------------------------------------------------------
    await test('AUTH-003: Invalid credentials rejected', async () => {
      const res = await request('/api/remote/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Forwarded-For': '203.0.113.195',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: 'WrongPassword!',
        }),
      });
      assert.strictEqual(res.status, 401, `Expected 401, got ${res.status}`);
      const data = await res.json();
      assert.strictEqual(data.code, 'INVALID_CREDENTIALS');
    });

    // Log in visitor legitimately
    const loginRes = await request('/api/remote/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-For': '203.0.113.195',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
    assert.strictEqual(loginRes.status, 200, 'Login failed');
    const loginData = await loginRes.json();
    const visitorToken = loginData.token;
    assert.ok(visitorToken, 'Visitor token missing');

    // -------------------------------------------------------------
    // AUTH-004: Suspended invite rejected
    // -------------------------------------------------------------
    await test('AUTH-004: Suspended invite rejected', async () => {
      // Suspend the invite
      store.updateInvite(invite.id, { status: InviteStatus.SUSPENDED });
      store.revokeSessionsForInvite(invite.id);

      // Attempt login with suspended invite
      const res = await request('/api/remote/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Forwarded-For': '203.0.113.195',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });
      assert.strictEqual(res.status, 403, `Expected 403, got ${res.status}`);
      const data = await res.json();
      assert.strictEqual(data.code, 'INVITE_SUSPENDED');

      // Reactivate for subsequent tests
      store.updateInvite(invite.id, { status: InviteStatus.ACTIVE });
    });

    // Re-login after reactivation
    const reLogin = await request('/api/remote/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-For': '203.0.113.195',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
    const reLoginData = await reLogin.json();
    const activeVisitorToken = reLoginData.token;
    const activeSessionId = reLoginData.sessionId;

    // -------------------------------------------------------------
    // AUTH-005: Revoked session rejected
    // -------------------------------------------------------------
    await test('AUTH-005: Revoked session rejected', async () => {
      // Revoke the session
      store.revokeSession(activeSessionId);

      const res = await request('/api/videos', {
        headers: {
          Authorization: `Bearer ${activeVisitorToken}`,
          'X-Forwarded-For': '203.0.113.195',
        },
      });
      assert.strictEqual(res.status, 401, `Expected 401, got ${res.status}`);
    });

    // Create fresh session for permission testing
    const sessionRes2 = await request('/api/remote/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-For': '203.0.113.195',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
    const token2 = (await sessionRes2.json()).token;

    // -------------------------------------------------------------
    // AUTH-006: Permission changes affect current sessions in real-time
    // -------------------------------------------------------------
    await test('AUTH-006: Permission changes affect current sessions in real-time', async () => {
      // Currently invite has VIEW_PROJECTS
      let res = await request('/api/videos', {
        headers: { Authorization: `Bearer ${token2}`, 'X-Forwarded-For': '203.0.113.195' },
      });
      assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);

      // Strip VIEW_PROJECTS from the invite
      store.updateInvite(invite.id, { permissions: [Permissions.DOWNLOAD] });

      // Immediate call without logging out
      res = await request('/api/videos', {
        headers: { Authorization: `Bearer ${token2}`, 'X-Forwarded-For': '203.0.113.195' },
      });
      assert.strictEqual(res.status, 403, `Expected 403 after permission removal, got ${res.status}`);

      // Restore VIEW_PROJECTS
      store.updateInvite(invite.id, { permissions: [Permissions.VIEW_PROJECTS, Permissions.DOWNLOAD] });
      res = await request('/api/videos', {
        headers: { Authorization: `Bearer ${token2}`, 'X-Forwarded-For': '203.0.113.195' },
      });
      assert.strictEqual(res.status, 200, `Expected 200 after permission restore, got ${res.status}`);
    });

    // -------------------------------------------------------------
    // AUTH-007: Visitor without UPLOAD receives 403
    // -------------------------------------------------------------
    await test('AUTH-007: Visitor without UPLOAD receives 403', async () => {
      // Invite has VIEW_PROJECTS and DOWNLOAD, but NOT UPLOAD
      const res = await request('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token2}`,
          'X-Forwarded-For': '203.0.113.195',
        },
        body: JSON.stringify({ filename: 'test.mp4' }),
      });
      assert.strictEqual(res.status, 403, `Expected 403, got ${res.status}`);
      const data = await res.json();
      assert.strictEqual(data.requiredPermission, 'UPLOAD');
    });

    // -------------------------------------------------------------
    // AUTH-008: Visitor without PUBLISH receives 403
    // -------------------------------------------------------------
    await test('AUTH-008: Visitor without PUBLISH receives 403', async () => {
      // Invite has VIEW_PROJECTS, but NOT PUBLISH
      const res = await request('/api/publish-multi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token2}`,
          'X-Forwarded-For': '203.0.113.195',
        },
        body: JSON.stringify({ filename: 'test.mp4' }),
      });
      assert.strictEqual(res.status, 403, `Expected 403, got ${res.status}`);
      const data = await res.json();
      assert.strictEqual(data.requiredPermission, 'PUBLISH');
    });

    // -------------------------------------------------------------
    // AUTH-009: Visitor with UPLOAD can upload
    // -------------------------------------------------------------
    await test('AUTH-009: Visitor with UPLOAD can upload (independent from PUBLISH)', async () => {
      // Grant UPLOAD but NOT PUBLISH
      store.updateInvite(invite.id, {
        permissions: [Permissions.VIEW_PROJECTS, Permissions.UPLOAD],
      });

      // Upload should succeed
      const uploadRes = await request('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token2}`,
          'X-Forwarded-For': '203.0.113.195',
        },
        body: JSON.stringify({ filename: 'test.mp4' }),
      });
      assert.strictEqual(uploadRes.status, 200, `Expected 200, got ${uploadRes.status}`);

      // Publish MUST still be 403 Forbidden!
      const pubRes = await request('/api/publish-multi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token2}`,
          'X-Forwarded-For': '203.0.113.195',
        },
        body: JSON.stringify({ filename: 'test.mp4' }),
      });
      assert.strictEqual(pubRes.status, 403, `Expected 403 for publish, got ${pubRes.status}`);
    });

    // -------------------------------------------------------------
    // AUTH-010: Visitor with PUBLISH can publish
    // -------------------------------------------------------------
    await test('AUTH-010: Visitor with PUBLISH can publish (independent from UPLOAD)', async () => {
      // Grant PUBLISH but NOT UPLOAD
      store.updateInvite(invite.id, {
        permissions: [Permissions.VIEW_PROJECTS, Permissions.PUBLISH],
      });

      // Publish should succeed
      const pubRes = await request('/api/publish-multi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token2}`,
          'X-Forwarded-For': '203.0.113.195',
        },
        body: JSON.stringify({ filename: 'test.mp4' }),
      });
      assert.strictEqual(pubRes.status, 200, `Expected 200, got ${pubRes.status}`);

      // Upload MUST still be 403 Forbidden!
      const uploadRes = await request('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token2}`,
          'X-Forwarded-For': '203.0.113.195',
        },
        body: JSON.stringify({ filename: 'test.mp4' }),
      });
      assert.strictEqual(uploadRes.status, 403, `Expected 403 for upload, got ${uploadRes.status}`);
    });

    // -------------------------------------------------------------
    // AUTH-011: Visitor cannot manage invites without permission
    // -------------------------------------------------------------
    await test('AUTH-011: Visitor cannot manage invites without permission', async () => {
      const res = await request('/api/remote/invites', {
        headers: {
          Authorization: `Bearer ${token2}`,
          'X-Forwarded-For': '203.0.113.195',
        },
      });
      assert.strictEqual(res.status, 403, `Expected 403, got ${res.status}`);
      const data = await res.json();
      assert.ok(data.code === 'OWNER_REQUIRED' || data.requiredPermission === 'MANAGE_INVITES', `Expected OWNER_REQUIRED or MANAGE_INVITES, got ${JSON.stringify(data)}`);
    });

    // -------------------------------------------------------------
    // AUTH-012: Remote disable invalidates visitor sessions
    // -------------------------------------------------------------
    await test('AUTH-012: Remote disable invalidates visitor sessions', async () => {
      // Owner disables remote access
      const disableRes = await request('/api/remote/disable', {
        method: 'POST',
        headers: { Host: `localhost:${TEST_PORT}` },
      });
      assert.strictEqual(disableRes.status, 200);

      // Visitor session token should now be rejected
      const visitorCheck = await request('/api/videos', {
        headers: {
          Authorization: `Bearer ${token2}`,
          'X-Forwarded-For': '203.0.113.195',
        },
      });
      assert.strictEqual(visitorCheck.status, 401, `Expected 401, got ${visitorCheck.status}`);
    });

    // -------------------------------------------------------------
    // AUTH-013: Owner remains functional after remote disable
    // -------------------------------------------------------------
    await test('AUTH-013: Owner remains functional after remote disable', async () => {
      const res = await request('/api/videos', {
        headers: { Host: `localhost:${TEST_PORT}` },
      });
      assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
      const data = await res.json();
      assert.strictEqual(data.success, true);
    });

    // -------------------------------------------------------------
    // AUTH-014: Multiple visitors tracked independently
    // -------------------------------------------------------------
    await test('AUTH-014: Multiple visitors tracked independently with device metadata', async () => {
      // Re-enable remote access
      await request('/api/remote/enable', {
        method: 'POST',
        headers: { Host: `localhost:${TEST_PORT}` },
        body: JSON.stringify({ transportType: 'manual', customUrl: 'https://test.rightmotion.local' }),
      });

      // Login Visitor A (Laptop)
      const loginA = await request('/api/remote/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Forwarded-For': '198.51.100.1',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36',
        },
        body: JSON.stringify({ email: credentials.email, password: credentials.password }),
      });
      assert.strictEqual(loginA.status, 200);

      // Create Visitor B invite
      const invB = auth.createInvite({
        email: 'phone_user@rightmotion.local',
        password: 'PhonePassword123!',
        permissions: [Permissions.VIEW_PROJECTS],
        label: 'My iPhone',
      });

      // Login Visitor B (iPhone)
      const loginB = await request('/api/remote/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Forwarded-For': '198.51.100.2',
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Safari/605.1.15',
        },
        body: JSON.stringify({ email: invB.credentials.email, password: invB.credentials.password }),
      });
      assert.strictEqual(loginB.status, 200);

      // Query active sessions as Owner
      const statusRes = await request('/api/remote/status', {
        headers: { Host: `localhost:${TEST_PORT}` },
      });
      const statusData = await statusRes.json();
      assert.ok(statusData.activeUsersCount >= 2, `Expected >= 2 active users, got ${statusData.activeUsersCount}`);

      const devices = statusData.activeUsers.map((u) => u.deviceLabel);
      assert.ok(devices.some((d) => d.includes('iPhone')), 'iPhone device missing');
      assert.ok(devices.some((d) => d.includes('Windows')), 'Windows device missing');
    });

    // -------------------------------------------------------------
    // AUTH-015: Active-user count expires stale heartbeats
    // -------------------------------------------------------------
    await test('AUTH-015: Active-user count expires stale heartbeats', async () => {
      const allSessions = store.getSessions();
      // Manually backdate all sessions for phone_user to 10 minutes ago
      allSessions.forEach((s) => {
        if (s.email === 'phone_user@rightmotion.local') {
          s.lastSeen = new Date(Date.now() - 10 * 60 * 1000).toISOString();
        }
      });
      store.saveSessions(allSessions);

      // Check active users
      const statusRes = await request('/api/remote/status', {
        headers: { Host: `localhost:${TEST_PORT}` },
      });
      const statusData = await statusRes.json();
      const activeEmails = statusData.activeUsers.map((u) => u.email);
      assert.strictEqual(activeEmails.includes('phone_user@rightmotion.local'), false, 'Stale user should not be active');
    });

  } finally {
    try {
      const { getTransport } = require('../studio/remote/transport');
      const transport = getTransport('cloudflare');
      await transport.stop(TEST_PORT).catch(() => {});
    } catch (e) {}
    server.close();
  }

  console.log('\n======================================================');
  console.log(`🏁 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
  process.exit(0);
}

runTests().catch((err) => {
  console.error('Fatal error during test run:', err);
  process.exit(1);
});
