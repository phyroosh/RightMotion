/**
 * Playwright E2E Test for RightMotion Notification System UI
 * Tests:
 * 1. Desktop Notification Bell & Live SSE Badge Update
 * 2. Rich Foreground Notification Toast
 * 3. Notification Center Modal & Filtering
 * 4. Mobile Companion App Notification Bell & Push Alerts Card
 * 5. Deep Linking URL Parameter Support (?clip=...&tab=...)
 */

const { chromium } = require('playwright');
const assert = require('assert');
const path = require('path');
const fs = require('fs');
const http = require('http');

const PORT = 4000;
const BASE_URL = `http://localhost:${PORT}`;

function emitEvent(payload) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/notifications/emit',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    req.write(JSON.stringify(payload));
    req.end();
  });
}

function clearEvents() {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/notifications/clear',
      method: 'POST'
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    req.end();
  });
}

async function runUITests() {
  const outDir = path.resolve(__dirname, '../../out');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  console.log('\n======================================================');
  console.log('🧪 RUNNING RIGHTMOTION NOTIFICATION UI TEST SUITE');
  console.log('======================================================\n');

  try {
    // -------------------------------------------------------------
    // PHASE 1: Desktop Viewport (1440x900)
    // -------------------------------------------------------------
    console.log('🖥️ [1/3] Testing Desktop 1440x900 Notification Center & Live SSE...');
    await clearEvents();

    const desktopContext = await browser.newContext({
      viewport: { width: 1440, height: 900 }
    });
    const desktopPage = await desktopContext.newPage();
    await desktopPage.goto(BASE_URL, { waitUntil: 'networkidle' });
    await desktopPage.waitForTimeout(1000);

    // Verify desktop notification bell exists
    const bellVisible = await desktopPage.isVisible('#desktopNotificationBellBtn');
    console.log(`   Desktop Bell Button Present: ${bellVisible}`);
    assert.ok(bellVisible, 'Desktop notification bell button must be visible');

    // Wait for SSE connection to be established
    await desktopPage.waitForFunction(() => window.notifSseSource && window.notifSseSource.readyState === 1, { timeout: 10000 });
    console.log('   SSE stream connection verified (readyState: OPEN).');

    // Emit live event via SSE
    console.log('   Emitting live RENDER_COMPLETED event...');
    await emitEvent({
      type: 'RENDER_COMPLETED',
      title: '🎬 Render Finished: Dopamine Reality',
      body: 'Your 1080x1920 vertical video has completed rendering with GPU acceleration.',
      clip: 'dopamine_reality_video.mp4',
      tab: 'studio',
      category: 'render'
    });

    // Wait for badge and toast to update
    await desktopPage.waitForSelector('#desktopNotificationBadge:not(.hidden)', { timeout: 10000 });

    // Verify unread badge updated to 1
    const badgeText = await desktopPage.$eval('#desktopNotificationBadge', el => el.textContent.trim());
    const badgeHidden = await desktopPage.$eval('#desktopNotificationBadge', el => el.classList.contains('hidden'));
    console.log(`   Desktop Badge Value: "${badgeText}", Hidden: ${badgeHidden}`);
    assert.strictEqual(badgeText, '1');
    assert.strictEqual(badgeHidden, false);

    // Verify rich foreground toast banner
    const toastTitle = await desktopPage.$eval('#richToastTitle', el => el.textContent.trim());
    console.log(`   Rich Toast Displayed: "${toastTitle}"`);
    assert.ok(toastTitle.includes('Dopamine Reality'), 'Rich toast should display event title');

    // Open Notification Center
    console.log('   Opening Notification Center modal...');
    await desktopPage.click('#desktopNotificationBellBtn');
    await desktopPage.waitForTimeout(600);

    const modalVisible = await desktopPage.$eval('#notificationCenterModal', el => !el.classList.contains('opacity-0'));
    console.log(`   Notification Center Modal Open: ${modalVisible}`);
    assert.ok(modalVisible, 'Notification center modal should be open');

    // Check rendered item in container
    const itemCount = await desktopPage.$$eval('#notificationListContainer > div', els => els.length);
    console.log(`   Notification Items in List: ${itemCount}`);
    assert.strictEqual(itemCount, 1);

    const desktopScreenshotPath = path.join(outDir, 'notification_center_desktop.png');
    await desktopPage.screenshot({ path: desktopScreenshotPath });
    console.log(`   📸 Saved desktop screenshot: ${desktopScreenshotPath}`);

    // Mark all as read
    await desktopPage.click('button[onclick="markAllNotificationsRead()"]');
    await desktopPage.waitForTimeout(300);

    const badgeAfterRead = await desktopPage.$eval('#desktopNotificationBadge', el => el.classList.contains('hidden'));
    console.log(`   Badge Hidden After "Mark all read": ${badgeAfterRead}`);
    assert.ok(badgeAfterRead, 'Badge should be hidden after marking all as read');

    await desktopContext.close();

    // -------------------------------------------------------------
    // PHASE 2: Mobile Viewport (390x844)
    // -------------------------------------------------------------
    console.log('\n📱 [2/3] Testing Mobile 390x844 Companion App Alerts...');
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto(BASE_URL, { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(1000);

    // Verify mobile bell exists in header
    const mobileBellVisible = await mobilePage.isVisible('#mobileNotificationBellBtn');
    console.log(`   Mobile Bell Button Present: ${mobileBellVisible}`);
    assert.ok(mobileBellVisible, 'Mobile notification bell button must be visible');

    // Switch to Tab 5 ("More") to verify Push Alerts Card
    console.log('   Switching to Mobile Tab 5 ("More")...');
    await mobilePage.click('#mobileNavItemMore');
    await mobilePage.waitForTimeout(500);

    const pushCardVisible = await mobilePage.isVisible('#mobilePushCard');
    console.log(`   Mobile Push Card Present in Tab 5: ${pushCardVisible}`);
    assert.ok(pushCardVisible, 'Push Alerts card must be visible in Mobile Tab 5');

    // Open Notification Center from mobile bell
    console.log('   Opening Notification Center from mobile header bell...');
    await mobilePage.click('#mobileNotificationBellBtn');
    await mobilePage.waitForTimeout(600);

    const mobileModalOpen = await mobilePage.$eval('#notificationCenterModal', el => !el.classList.contains('opacity-0'));
    console.log(`   Notification Center Modal Open on Mobile: ${mobileModalOpen}`);
    assert.ok(mobileModalOpen, 'Notification Center modal must open on mobile');

    const mobileScreenshotPath = path.join(outDir, 'notification_center_mobile.png');
    await mobilePage.screenshot({ path: mobileScreenshotPath });
    console.log(`   📸 Saved mobile screenshot: ${mobileScreenshotPath}`);

    await mobileContext.close();

    // -------------------------------------------------------------
    // PHASE 3: Deep Linking URL Parameter Support (?clip=...&tab=...)
    // -------------------------------------------------------------
    console.log('\n🔗 [3/3] Testing Deep Linking URL Parameters (?clip=...&tab=studio)...');
    const deepLinkContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true
    });
    const deepLinkPage = await deepLinkContext.newPage();
    await deepLinkPage.goto(`${BASE_URL}/?clip=dopamine_reality_video.mp4&tab=studio`, { waitUntil: 'networkidle' });
    await deepLinkPage.waitForSelector('#mobileTabStudio.active', { timeout: 8000 });
    const activeTabStudio = await deepLinkPage.$eval('#mobileTabStudio', el => el.classList.contains('active'));
    console.log(`   Mobile Tab "Studio" Active via Deep Link: ${activeTabStudio}`);
    assert.ok(activeTabStudio, 'Mobile Tab "Studio" must be activated by deep-link param tab=studio');

    // Verify active clip title matches Dopamine Reality
    const activeTitle = await deepLinkPage.$eval('#mobileActiveTitle', el => el.textContent.trim());
    console.log(`   Mobile Active Studio Clip Title: "${activeTitle}"`);
    assert.ok(activeTitle.includes('Dopamine Reality') || activeTitle.includes('dopamine_reality'), 'Clip must be selected via deep-link');

    const deepLinkScreenshotPath = path.join(outDir, 'notification_deeplink_studio.png');
    await deepLinkPage.screenshot({ path: deepLinkScreenshotPath });
    console.log(`   📸 Saved deep-link screenshot: ${deepLinkScreenshotPath}`);

    await deepLinkContext.close();

    console.log('\n======================================================');
    console.log('🏁 ALL NOTIFICATION UI & DEEP-LINKING TESTS PASSED!');
    console.log('======================================================\n');

  } finally {
    await browser.close();
  }
}

runUITests().catch(err => {
  console.error('\n❌ Fatal UI test failure:', err);
  process.exit(1);
});
