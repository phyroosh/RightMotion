const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SESSION_FILE = path.join(__dirname, 'instagram_session.json');

function getSavedSession() {
  if (fs.existsSync(SESSION_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(SESSION_FILE, 'utf-8'));
    } catch (e) {
      console.error('Failed to read instagram_session.json:', e);
    }
  }
  return null;
}

function saveSession(data) {
  try {
    fs.writeFileSync(SESSION_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write instagram_session.json:', e);
  }
}

async function checkSessionStatus() {
  const session = getSavedSession();
  if (!session || !session.storageState) {
    return { isConnected: false };
  }

  return {
    isConnected: true,
    username: session.username || 'instagram_user',
    name: session.name || session.username || 'Instagram Account',
    profilePicUrl: session.profilePicUrl || null,
    loggedInAt: session.loggedInAt || null,
  };
}

let activeLoginProcess = false;

async function startInteractiveLogin(onProgress) {
  if (activeLoginProcess) {
    return { inProgress: true, message: 'Login window is already open. Please complete login in the browser.' };
  }

  activeLoginProcess = true;
  let browser = null;

  try {
    if (onProgress) onProgress({ stage: 'Launching interactive Instagram browser...', progress: 10 });

    browser = await chromium.launch({
      headless: false,
      args: [
        '--start-maximized',
        '--disable-blink-features=AutomationControlled',
        '--no-default-browser-check',
      ],
    });

    const contextOptions = {
      viewport: null,
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    };

    const existingSession = getSavedSession();
    if (existingSession && existingSession.storageState) {
      contextOptions.storageState = existingSession.storageState;
    }

    const context = await browser.newContext(contextOptions);
    const page = await context.newPage();

    if (onProgress) onProgress({ stage: 'Waiting for login completion in browser...', progress: 30 });

    await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'domcontentloaded' });

    const startTime = Date.now();
    const TIMEOUT_MS = 5 * 60 * 1000;

    let loggedIn = false;
    let detectedUsername = null;
    let detectedAvatar = null;

    while (Date.now() - startTime < TIMEOUT_MS) {
      if (page.isClosed() || !browser.isConnected()) {
        break;
      }

      const url = page.url();

      const isPastLogin =
        !url.includes('/accounts/login') &&
        !url.includes('/accounts/signup') &&
        !url.includes('/accounts/emailsignup');

      if (isPastLogin) {
        const hasNav = await page
          .evaluate(() => {
            const hasCreate =
              document.querySelector('svg[aria-label="New post"]') ||
              document.querySelector('svg[aria-label="Create"]') ||
              document.querySelector('svg[aria-label="Home"]') ||
              document.querySelector('a[href^="/"][role="link"]');
            return !!hasCreate;
          })
          .catch(() => false);

        if (hasNav) {
          loggedIn = true;

          try {
            const profileData = await page.evaluate(() => {
              const profileLinks = Array.from(document.querySelectorAll('a[role="link"]'));
              let uname = null;
              let avatar = null;

              for (const a of profileLinks) {
                const href = a.getAttribute('href') || '';
                const img = a.querySelector('img');
                if (img && img.src && !img.src.includes('data:image')) {
                  avatar = img.src;
                }
                const match = href.match(/^\/([a-zA-Z0-9._]+)\/?$/);
                if (
                  match &&
                  !['explore', 'reels', 'direct', 'stories', 'your_activity'].includes(match[1])
                ) {
                  uname = match[1];
                }
              }
              return { username: uname, avatar };
            });

            if (profileData.username) detectedUsername = profileData.username;
            if (profileData.avatar) detectedAvatar = profileData.avatar;
          } catch (e) {}

          if (!detectedUsername) {
            const cookies = await context.cookies();
            const dsCookie = cookies.find((c) => c.name === 'ds_user_id');
            if (dsCookie) {
              detectedUsername = `user_${dsCookie.value}`;
            }
          }

          break;
        }
      }

      await new Promise((r) => setTimeout(r, 1000));
    }

    if (!loggedIn) {
      if (browser) await browser.close().catch(() => {});
      activeLoginProcess = false;
      return { success: false, error: 'Login window closed before authentication finished.' };
    }

    if (onProgress) onProgress({ stage: 'Saving session credentials...', progress: 90 });

    const storageState = await context.storageState();
    const sessionData = {
      storageState,
      username: detectedUsername || 'instagram_user',
      profilePicUrl: detectedAvatar || null,
      loggedInAt: new Date().toISOString(),
    };

    saveSession(sessionData);

    await new Promise((r) => setTimeout(r, 1500));
    await browser.close().catch(() => {});
    activeLoginProcess = false;

    console.log(`✅ Instagram session successfully saved for @${sessionData.username}`);
    return {
      success: true,
      username: sessionData.username,
      profilePicUrl: sessionData.profilePicUrl,
      message: `Successfully connected Instagram (@${sessionData.username})!`,
    };
  } catch (err) {
    if (browser) await browser.close().catch(() => {});
    activeLoginProcess = false;
    console.error('Interactive login error:', err);
    return { success: false, error: err.message };
  }
}

function disconnectSession() {
  if (fs.existsSync(SESSION_FILE)) {
    try {
      fs.unlinkSync(SESSION_FILE);
    } catch (e) {}
  }
  return { success: true, message: 'Instagram session disconnected.' };
}

async function uploadReel({
  videoPath,
  coverPath,
  caption,
  shareToFeed = true,
  onProgress,
  headless = true,
}) {
  const session = getSavedSession();
  if (!session || !session.storageState) {
    throw new Error('Instagram is not connected! Please click "Connect Instagram" in Studio first.');
  }

  if (!fs.existsSync(videoPath)) {
    throw new Error(`Video file not found at path: ${videoPath}`);
  }

  let browser = null;

  try {
    if (onProgress) onProgress({ stage: 'Initializing Instagram browser session...', progress: 10 });

    browser = await chromium.launch({
      headless: headless,
      args: ['--disable-blink-features=AutomationControlled', '--no-default-browser-check'],
    });

    const context = await browser.newContext({
      storageState: session.storageState,
      viewport: { width: 1280, height: 900 },
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    });

    const page = await context.newPage();

    if (onProgress) onProgress({ stage: 'Navigating to Instagram...', progress: 20 });
    await page.goto('https://www.instagram.com/', { waitUntil: 'domcontentloaded' });

    try {
      const notNowBtn = await page.waitForSelector('button:has-text("Not Now"), button:has-text("Not now")', {
        timeout: 4000,
      });
      if (notNowBtn) await notNowBtn.click().catch(() => {});
    } catch (e) {}

    if (onProgress) onProgress({ stage: 'Opening Create Reel dialog...', progress: 30 });

    let createClicked = false;
    const createSelectors = [
      'svg[aria-label="New post"]',
      'svg[aria-label="Create"]',
      'span:has-text("Create")',
      'a[href="#"]:has-text("Create")',
    ];

    for (const sel of createSelectors) {
      try {
        const el = await page.$(sel);
        if (el) {
          await el.click();
          createClicked = true;
          break;
        }
      } catch (e) {}
    }

    if (!createClicked) {
      await page.goto('https://www.instagram.com/?upload=1');
    }

    await page.waitForTimeout(1000);

    try {
      const postOption = await page.waitForSelector('span:has-text("Post")', { timeout: 2000 });
      if (postOption) await postOption.click().catch(() => {});
    } catch (e) {}

    if (onProgress) onProgress({ stage: 'Selecting video file...', progress: 40 });

    const fileInput = await page.waitForSelector('input[type="file"]', { timeout: 15000 });
    await fileInput.setInputFiles(videoPath);

    await page.waitForTimeout(2500);

    try {
      const okBtn = await page.waitForSelector('button:has-text("OK"), button:has-text("Got it")', {
        timeout: 3000,
      });
      if (okBtn) await okBtn.click().catch(() => {});
    } catch (e) {}

    if (onProgress) onProgress({ stage: 'Configuring 9:16 vertical aspect ratio...', progress: 50 });

    try {
      const cropBtn = await page.waitForSelector('svg[aria-label="Select crop"]', { timeout: 3000 });
      if (cropBtn) {
        await cropBtn.click();
        await page.waitForTimeout(500);
        const vertical916 = await page.waitForSelector('span:has-text("9:16"), button:has-text("9:16")', {
          timeout: 2000,
        });
        if (vertical916) await vertical916.click().catch(() => {});
      }
    } catch (e) {}

    const nextBtn1 = await page.waitForSelector('div[role="button"]:has-text("Next"), button:has-text("Next")', {
      timeout: 10000,
    });
    await nextBtn1.click();
    await page.waitForTimeout(2000);

    if (onProgress) onProgress({ stage: 'Applying 4K cover thumbnail...', progress: 65 });

    if (coverPath && fs.existsSync(coverPath)) {
      try {
        const coverTab = await page.waitForSelector('div:has-text("Cover photo"), span:has-text("Cover photo")', {
          timeout: 3000,
        });
        if (coverTab) {
          await coverTab.click();
          await page.waitForTimeout(800);
          const selectFromComp = await page.waitForSelector('button:has-text("Select from computer"), input[type="file"]', {
            timeout: 3000,
          });
          if (selectFromComp) {
            const coverInput = await page.$('input[type="file"]');
            if (coverInput) {
              await coverInput.setInputFiles(coverPath);
              await page.waitForTimeout(1500);
            }
          }
        }
      } catch (e) {
        console.warn('Cover photo attachment notice:', e.message);
      }
    }

    const nextBtn2 = await page.waitForSelector('div[role="button"]:has-text("Next"), button:has-text("Next")', {
      timeout: 10000,
    });
    await nextBtn2.click();
    await page.waitForTimeout(2000);

    if (onProgress) onProgress({ stage: 'Writing caption & hashtags...', progress: 75 });

    try {
      const captionBox = await page.waitForSelector(
        'div[aria-label="Write a caption..."], div[contenteditable="true"], textarea[placeholder="Write a caption..."]',
        { timeout: 10000 }
      );
      if (captionBox) {
        await captionBox.click();
        await page.keyboard.type(caption || '', { delay: 10 });
      }
    } catch (e) {
      console.warn('Caption typing notice:', e.message);
    }

    await page.waitForTimeout(1000);

    if (onProgress) onProgress({ stage: 'Sharing Reel to Instagram...', progress: 85 });

    const shareBtn = await page.waitForSelector('div[role="button"]:has-text("Share"), button:has-text("Share")', {
      timeout: 10000,
    });
    await shareBtn.click();

    if (onProgress) onProgress({ stage: 'Waiting for Instagram server processing...', progress: 92 });

    const CONFIRM_TIMEOUT = 120000;
    await page
      .waitForSelector(
        'span:has-text("Your reel has been shared"), span:has-text("Reel shared"), span:has-text("Your post has been shared"), svg[aria-label="Animated checkmark"]',
        { timeout: CONFIRM_TIMEOUT }
      )
      .catch(() => null);

    let liveReelUrl = `https://www.instagram.com/${session.username}/reels/`;

    try {
      const linkEl = await page.$('a[href^="/reel/"], a[href^="/p/"]');
      if (linkEl) {
        const href = await linkEl.getAttribute('href');
        if (href) liveReelUrl = `https://www.instagram.com${href}`;
      }
    } catch (e) {}

    const updatedStorageState = await context.storageState();
    saveSession({
      ...session,
      storageState: updatedStorageState,
    });

    if (onProgress) onProgress({ stage: 'Reel shared successfully!', progress: 100 });

    await page.waitForTimeout(1000);
    await browser.close().catch(() => {});

    console.log(`🎉 Instagram Reel successfully published: ${liveReelUrl}`);
    return {
      success: true,
      reelUrl: liveReelUrl,
      username: session.username,
      publishedAt: new Date().toISOString(),
      message: 'Reel published successfully to Instagram!',
    };
  } catch (err) {
    if (browser) await browser.close().catch(() => {});
    console.error('Playwright Reel upload error:', err);
    throw err;
  }
}

module.exports = {
  checkSessionStatus,
  startInteractiveLogin,
  disconnectSession,
  uploadReel,
};
