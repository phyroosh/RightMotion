/**
 * Automated Test Suite for RightMotion Event-Driven Notification System
 * Tests:
 * 1. VAPID Public Key retrieval
 * 2. Push Subscription registration and unsubscription
 * 3. Event Emission via API (/api/notifications/emit)
 * 4. Test Notification dispatch (/api/notifications/test)
 * 5. Notification History retrieval and unread counters
 * 6. Mark single notification as read & mark all as read
 * 7. Clear notification history
 * 8. CLI notification dispatcher (scripts/notify.py)
 */

const assert = require('assert');
const http = require('http');
const { execSync } = require('child_process');
const path = require('path');

const PORT = 4000;
const BASE_URL = `http://localhost:${PORT}`;

function makeRequest(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, body: json, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('\n======================================================');
  console.log('🧪 RUNNING RIGHTMOTION NOTIFICATION SYSTEM TEST MATRIX');
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

  // TEST 1: VAPID Public Key
  await test('NOTIF-001: VAPID public key endpoint returns valid base64url string', async () => {
    const res = await makeRequest('GET', '/api/notifications/vapid-public-key');
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.publicKey, 'Expected publicKey in response');
    assert.ok(res.body.publicKey.length > 50, 'PublicKey too short');
  });

  // TEST 2: Clear history to start clean
  await test('NOTIF-002: Clear notification history', async () => {
    const res = await makeRequest('POST', '/api/notifications/clear');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);

    const list = await makeRequest('GET', '/api/notifications');
    assert.strictEqual(list.body.totalCount, 0);
    assert.strictEqual(list.body.unreadCount, 0);
  });

  // TEST 3: Emit Custom Notification via API
  let testNotifId = null;
  await test('NOTIF-003: Emit custom notification via /api/notifications/emit', async () => {
    const res = await makeRequest('POST', '/api/notifications/emit', {
      type: 'RENDER_COMPLETED',
      title: '🎬 Test Render Finished',
      body: 'Dopamine Reality 1080x1920 finished rendering.',
      clip: 'dopamine_reality_video.mp4',
      tab: 'studio',
      category: 'render'
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.notification);
    assert.strictEqual(res.body.notification.category, 'render');
    assert.strictEqual(res.body.notification.clip, 'dopamine_reality_video.mp4');
    assert.strictEqual(res.body.notification.read, false);
    testNotifId = res.body.notification.id;
  });

  // TEST 4: Verify Notification Appears in List with Unread Count
  await test('NOTIF-004: Fetch notification list and unread count', async () => {
    const res = await makeRequest('GET', '/api/notifications');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.totalCount, 1);
    assert.strictEqual(res.body.unreadCount, 1);
    assert.strictEqual(res.body.notifications[0].id, testNotifId);
  });

  // TEST 5: Mark Single Notification as Read
  await test('NOTIF-005: Mark single notification read via POST /api/notifications/read', async () => {
    const res = await makeRequest('POST', '/api/notifications/read', { id: testNotifId });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);

    const list = await makeRequest('GET', '/api/notifications');
    assert.strictEqual(list.body.unreadCount, 0);
    assert.strictEqual(list.body.notifications[0].read, true);
  });

  // TEST 6: Test Notification endpoint (/api/notifications/test)
  let test2Id = null;
  await test('NOTIF-006: Dispatch test notification via /api/notifications/test', async () => {
    const res = await makeRequest('POST', '/api/notifications/test', {
      clip: 'dopamine_reality_video.mp4'
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.notification.id);
    test2Id = res.body.notification.id;

    const list = await makeRequest('GET', '/api/notifications');
    assert.strictEqual(list.body.unreadCount, 1);
  });

  // TEST 7: Mark all notifications read
  await test('NOTIF-007: Mark all notifications as read', async () => {
    const res = await makeRequest('POST', '/api/notifications/read', { all: true });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);

    const list = await makeRequest('GET', '/api/notifications');
    assert.strictEqual(list.body.unreadCount, 0);
  });

  // TEST 8: Register Web Push Subscription
  const fakeEndpoint = `https://fcm.googleapis.com/fcm/send/fake-test-endpoint-${Date.now()}`;
  await test('NOTIF-008: Register Web Push subscription', async () => {
    const res = await makeRequest('POST', '/api/notifications/subscribe', {
      subscription: {
        endpoint: fakeEndpoint,
        keys: {
          p256dh: 'BNcRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_0QT9bP045GE-Z8QjG3ZkL',
          auth: 'tBHItDaCWFL12'
        }
      },
      device: 'Test Device Mobile',
      userAgent: 'Playwright Test Suite'
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.subscriberCount >= 1);
  });

  // TEST 9: Unsubscribe Web Push
  await test('NOTIF-009: Unsubscribe Web Push subscription', async () => {
    const res = await makeRequest('POST', '/api/notifications/unsubscribe', {
      endpoint: fakeEndpoint
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
  });

  // TEST 10: CLI Notification Dispatcher (scripts/notify.py)
  await test('NOTIF-010: CLI scripts/notify.py dispatches event cleanly', async () => {
    const rootDir = path.resolve(__dirname, '..');
    const cmd = `python3 ${path.join(rootDir, 'scripts/notify.py')} --event RENDER_COMPLETED --title "🎬 CLI Test Render" --message "Render via CLI notify.py completed" --clip "dopamine_reality_video.mp4" --tab "studio"`;
    const out = execSync(cmd, { encoding: 'utf8' });
    assert.ok(out.includes('Notification Sent') || out.includes('SUCCESS') || out.includes('Persisted notification'), `Unexpected output: ${out}`);

    const list = await makeRequest('GET', '/api/notifications');
    const latest = list.body.notifications[0];
    assert.strictEqual(latest.title, '🎬 CLI Test Render');
    assert.strictEqual(latest.clip, 'dopamine_reality_video.mp4');
  });

  console.log('\n======================================================');
  console.log(`🏁 NOTIFICATION TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
