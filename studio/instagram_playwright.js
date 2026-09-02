let chromium;
try {
  chromium = require('playwright').chromium;
} catch (e) {
  try {
    chromium = require('playwright-core').chromium;
  } catch (err) {
    console.warn('Warning: Playwright / Playwright-core not found:', err.message);
  }
}
const fs = require('fs');
const path = require('path');

const ACCOUNTS_FILE = path.join(__dirname, 'instagram_accounts.json');
const SESSIONS_DIR = path.join(__dirname, 'instagram_sessions');
const SESSION_FILE = path.join(__dirname, 'instagram_session.json');

function ensureSessionsDir() {
  if (!fs.existsSync(SESSIONS_DIR)) {
    try {
      fs.mkdirSync(SESSIONS_DIR, { recursive: true });
    } catch (e) {}
  }
}

function getSavedAccounts() {
  ensureSessionsDir();
  if (fs.existsSync(ACCOUNTS_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(ACCOUNTS_FILE, 'utf-8'));
      if (data && Array.isArray(data.accounts)) return data;
    } catch (e) {
      console.error('Failed to read instagram_accounts.json:', e);
    }
  }

  // Auto-migrate legacy single session file if it exists
  if (fs.existsSync(SESSION_FILE)) {
    try {
      const legacy = JSON.parse(fs.readFileSync(SESSION_FILE, 'utf-8'));
      if (legacy && legacy.storageState) {
        const uname = (legacy.username || 'instagram_user').trim().toLowerCase();
        const sessPath = path.join(SESSIONS_DIR, `${uname}.json`);
        fs.writeFileSync(sessPath, JSON.stringify(legacy, null, 2), 'utf-8');

        const initialRegistry = {
          accounts: [
            {
              username: legacy.username || uname,
              name: legacy.name || legacy.username || uname,
              profilePicUrl: legacy.profilePicUrl || null,
              loggedInAt: legacy.loggedInAt || new Date().toISOString(),
            }
          ],
          activeUsername: legacy.username || uname,
        };
        fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(initialRegistry, null, 2), 'utf-8');
        return initialRegistry;
      }
    } catch (e) {
      console.error('Error migrating legacy instagram session:', e);
    }
  }

  return { accounts: [], activeUsername: null };
}

function saveAccounts(registry) {
  try {
    fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(registry, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write instagram_accounts.json:', e);
  }
}

function getSavedSession(targetUsername = null) {
  ensureSessionsDir();
  const registry = getSavedAccounts();
  const uname = (targetUsername || registry.activeUsername || '').trim();
  if (!uname) return null;

  const userFile = path.join(SESSIONS_DIR, `${uname.toLowerCase()}.json`);
  if (fs.existsSync(userFile)) {
    try {
      return JSON.parse(fs.readFileSync(userFile, 'utf-8'));
    } catch (e) {
      console.error(`Failed to read session for @${uname}:`, e);
    }
  }

  // Fallback to legacy single session file
  if (fs.existsSync(SESSION_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(SESSION_FILE, 'utf-8'));
    } catch (e) {}
  }
  return null;
}

function saveSession(data) {
  ensureSessionsDir();
  const uname = (data.username || 'instagram_user').trim();
  const userFile = path.join(SESSIONS_DIR, `${uname.toLowerCase()}.json`);
  fs.writeFileSync(userFile, JSON.stringify(data, null, 2), 'utf-8');

  // Keep legacy file updated with active account for backward compatibility
  try {
    fs.writeFileSync(SESSION_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {}

  const registry = getSavedAccounts();
  const idx = registry.accounts.findIndex(a => a.username.toLowerCase() === uname.toLowerCase());
  const accountInfo = {
    username: uname,
    name: data.name || uname,
    profilePicUrl: data.profilePicUrl || null,
    loggedInAt: data.loggedInAt || new Date().toISOString(),
  };

  if (idx >= 0) {
    registry.accounts[idx] = accountInfo;
  } else {
    registry.accounts.push(accountInfo);
  }
  registry.activeUsername = uname;
  saveAccounts(registry);
}

async function checkSessionStatus(targetUsername = null) {
  const registry = getSavedAccounts();
  const uname = targetUsername || registry.activeUsername;

  if (!uname || registry.accounts.length === 0) {
    return { isConnected: false, accounts: registry.accounts, activeUsername: null };
  }

  const session = getSavedSession(uname);
  if (!session || !session.storageState) {
    return { isConnected: false, accounts: registry.accounts, activeUsername: null };
  }

  return {
    isConnected: true,
    username: session.username || uname,
    name: session.name || session.username || uname,
    profilePicUrl: session.profilePicUrl || null,
    loggedInAt: session.loggedInAt || null,
    accounts: registry.accounts,
    activeUsername: registry.activeUsername,
  };
}

function listAccounts() {
  const registry = getSavedAccounts();
  return {
    accounts: registry.accounts,
    activeUsername: registry.activeUsername,
  };
}

function switchActiveAccount(username) {
  const registry = getSavedAccounts();
  const found = registry.accounts.find(a => a.username.toLowerCase() === username.toLowerCase());
  if (!found) {
    return { success: false, error: `Account @${username} not found.` };
  }
  registry.activeUsername = found.username;
  saveAccounts(registry);

  const session = getSavedSession(found.username);
  if (session) {
    try {
      fs.writeFileSync(SESSION_FILE, JSON.stringify(session, null, 2), 'utf-8');
    } catch (e) {}
  }
  return { success: true, activeUsername: found.username };
}

function disconnectAccount(username = null) {
  const registry = getSavedAccounts();
  const target = username || registry.activeUsername;
  if (!target) return { success: true };

  registry.accounts = registry.accounts.filter(a => a.username.toLowerCase() !== target.toLowerCase());
  const userFile = path.join(SESSIONS_DIR, `${target.toLowerCase()}.json`);
  if (fs.existsSync(userFile)) {
    try { fs.unlinkSync(userFile); } catch (e) {}
  }

  if (registry.activeUsername && registry.activeUsername.toLowerCase() === target.toLowerCase()) {
    registry.activeUsername = registry.accounts.length > 0 ? registry.accounts[0].username : null;
    if (registry.activeUsername) {
      const activeSess = getSavedSession(registry.activeUsername);
      if (activeSess) {
        try { fs.writeFileSync(SESSION_FILE, JSON.stringify(activeSess, null, 2), 'utf-8'); } catch (e) {}
      }
    } else {
      if (fs.existsSync(SESSION_FILE)) {
        try { fs.unlinkSync(SESSION_FILE); } catch (e) {}
      }
    }
  }

  saveAccounts(registry);
  return { success: true, message: `Disconnected @${target}` };
}

function disconnectSession() {
  return disconnectAccount();
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

async function uploadReel({
  username = null,
  videoPath,
  coverPath,
  caption,
  shareToFeed = true,
  onProgress,
  headless = false,
}) {
  const session = getSavedSession(username);
  if (!session || !session.storageState) {
    throw new Error(username ? `Instagram account @${username} is not connected! Please connect it in Studio first.` : 'Instagram is not connected! Please click "Connect Instagram" in Studio first.');
  }

  if (!fs.existsSync(videoPath)) {
    throw new Error(`Video file not found at path: ${videoPath}`);
  }

  let browser = null;

  try {
    if (onProgress) onProgress({ stage: 'Initializing Instagram browser session...', progress: 10 });

    browser = await chromium.launch({
      headless: headless,
      args: [
        '--disable-blink-features=AutomationControlled',
        '--no-default-browser-check',
        '--start-maximized',
      ],
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
    await page.waitForSelector('svg[aria-label="Home"], svg[aria-label="Create"], svg[aria-label="New post"], a[href="/"]', { timeout: 30000 });
    await page.waitForTimeout(2000);

    // Dismiss common dialogs (Not Now, Cookies, etc.)
    for (let i = 0; i < 4; i++) {
      try {
        const btn = page.locator('button:has-text("Not Now"), button:has-text("Not now"), button:has-text("Cancel"), button:has-text("Decline optional cookies")');
        if (await btn.count() > 0) {
          await btn.first().click({ force: true, timeout: 2000 });
          await page.waitForTimeout(1000);
        }
      } catch (e) {}
    }

    if (onProgress) onProgress({ stage: 'Opening Create Reel dialog...', progress: 30 });

    // Step 1: Click Create Button
    const create = page.locator('a._a6hd:has-text("Create"), a:has-text("Create"), span:has-text("Create")').first();
    await create.click({ force: true });
    await page.waitForTimeout(1500);

    // Click Post submenu item
    const postSvg = page.locator('svg[aria-label="Post"], a:has(svg[aria-label="Post"])').first();
    if (await postSvg.count() > 0) {
      await postSvg.click({ force: true });
      await page.waitForTimeout(2500);
    }

    if (onProgress) onProgress({ stage: 'Selecting video file...', progress: 40 });

    // Step 2: Set video file onto input[type="file"]
    // Instagram file inputs are attached to DOM but hidden (display: none).
    // We use state: 'attached' and also trigger FileChooser if needed.
    let fileSet = false;

    try {
      const fileInput = await page.waitForSelector('input[type="file"]', {
        state: 'attached',
        timeout: 10000,
      });
      if (fileInput) {
        await fileInput.setInputFiles(videoPath);
        fileSet = true;
      }
    } catch (e) {}

    if (!fileSet) {
      // Fallback: Click "Select from computer" button with FileChooser listener
      const [fileChooser] = await Promise.all([
        page.waitForEvent('filechooser', { timeout: 10000 }).catch(() => null),
        page.click('button:has-text("Select from computer"), div[role="button"]:has-text("Select from computer")').catch(() => null),
      ]);
      if (fileChooser) {
        await fileChooser.setFiles(videoPath);
        fileSet = true;
      }
    }

    if (!fileSet) {
      // Direct setInputFiles on page
      await page.setInputFiles('input[type="file"]', videoPath);
    }

    await page.waitForTimeout(3000);

    // Dismiss "Reels video sharing" prompt if it appears
    try {
      const okBtn = await page.waitForSelector('button:has-text("OK"), button:has-text("Got it"), button:has-text("Dismiss")', {
        timeout: 4000,
      });
      if (okBtn) await okBtn.click().catch(() => {});
    } catch (e) {}

    if (onProgress) onProgress({ stage: 'Configuring 9:16 vertical aspect ratio...', progress: 50 });

    // Step 3: Aspect Ratio / Crop (Set to 9:16 vertical)
    try {
      const cropBtn = await page.waitForSelector(
        'svg[aria-label="Select crop"], button[aria-label="Select crop"], button:has(svg[aria-label="Select crop"])',
        { timeout: 4000 }
      );
      if (cropBtn) {
        await cropBtn.click();
        await page.waitForTimeout(600);
        const vertical916 = await page.waitForSelector(
          'span:has-text("9:16"), button:has-text("9:16"), div[role="button"]:has-text("9:16"), span:has-text("Original")',
          { timeout: 3000 }
        );
        if (vertical916) await vertical916.click().catch(() => {});
      }
    } catch (e) {
      console.warn('Crop ratio notice:', e.message);
    }

    await page.waitForTimeout(1000);

    // Step 4: Click Next (to Cover Photo step)
    const nextBtn1 = await page.waitForSelector(
      'div[role="button"]:has-text("Next"), button:has-text("Next"), div:has-text("Next")',
      { timeout: 12000 }
    );
    if (nextBtn1) await nextBtn1.click();
    await page.waitForTimeout(2000);

    if (onProgress) onProgress({ stage: 'Applying 4K cover thumbnail...', progress: 65 });

    // Step 5: Attach 4K Cover Photo if available
    if (coverPath && fs.existsSync(coverPath)) {
      try {
        const coverTab = await page.waitForSelector(
          'div:has-text("Cover photo"), span:has-text("Cover photo"), button:has-text("Cover photo")',
          { timeout: 4000 }
        );
        if (coverTab) {
          await coverTab.click();
          await page.waitForTimeout(1000);

          // Find cover file input or click "Select from computer"
          const allInputs = await page.$$('input[type="file"]');
          if (allInputs.length > 0) {
            const lastInput = allInputs[allInputs.length - 1];
            await lastInput.setInputFiles(coverPath);
            await page.waitForTimeout(1500);
          } else {
            const [coverChooser] = await Promise.all([
              page.waitForEvent('filechooser', { timeout: 4000 }).catch(() => null),
              page.click('button:has-text("Select from computer"), div[role="button"]:has-text("Select from computer")').catch(() => null),
            ]);
            if (coverChooser) {
              await coverChooser.setFiles(coverPath);
              await page.waitForTimeout(1500);
            }
          }
        }
      } catch (e) {
        console.warn('Cover photo attachment notice:', e.message);
      }
    }

    // Step 6: Click Next (to Caption & Settings step)
    const nextBtn2 = await page.waitForSelector(
      'div[role="button"]:has-text("Next"), button:has-text("Next"), div:has-text("Next")',
      { timeout: 12000 }
    );
    if (nextBtn2) await nextBtn2.click();
    await page.waitForTimeout(2000);

    if (onProgress) onProgress({ stage: 'Writing caption & hashtags...', progress: 75 });

    // Step 7: Type Caption
    try {
      const captionBox = await page.waitForSelector(
        'div[aria-label="Write a caption..."], div[contenteditable="true"], div[role="textbox"], textarea[placeholder="Write a caption..."]',
        { timeout: 10000 }
      );
      if (captionBox) {
        await captionBox.click();
        await page.waitForTimeout(400);
        await page.keyboard.type(caption || '', { delay: 12 });
      }
    } catch (e) {
      console.warn('Caption typing notice:', e.message);
    }

    await page.waitForTimeout(1500);

    if (onProgress) onProgress({ stage: 'Sharing Reel to Instagram...', progress: 85 });

    // Step 8: Click Share Button
    const shareBtn = await page.waitForSelector(
      'div[role="button"]:has-text("Share"), button:has-text("Share"), div:has-text("Share")',
      { timeout: 12000 }
    );
    if (shareBtn) await shareBtn.click();

    if (onProgress) onProgress({ stage: 'Waiting for Instagram server processing...', progress: 92 });

    // Step 9: Wait for Upload / Share Completion (Progressive polling up to 3 minutes)
    for (let s = 1; s <= 36; s++) {
      await page.waitForTimeout(5000);
      const dialogText = await page.evaluate(() => {
        const d = document.querySelector('div[role="dialog"]');
        return d ? d.innerText : null;
      });

      if (!dialogText) {
        break; // Dialog dismissed, Reel successfully published
      }

      const lower = dialogText.toLowerCase();
      if (lower.includes('shared') || lower.includes('post shared') || lower.includes('reel shared')) {
        break;
      }

      if (onProgress) {
        onProgress({ stage: `Uploading & processing Reel on Instagram... (${s * 5}s)`, progress: Math.min(98, 85 + Math.floor(s * 0.35)) });
      }
    }

    let liveReelUrl = `https://www.instagram.com/${session.username}/reels/`;

    try {
      const linkEl = await page.$('a[href^="/reel/"], a[href^="/p/"]');
      if (linkEl) {
        const href = await linkEl.getAttribute('href');
        if (href) liveReelUrl = `https://www.instagram.com${href}`;
      }
    } catch (e) {}

    // Save updated session cookies
    const updatedStorageState = await context.storageState();
    saveSession({
      ...session,
      storageState: updatedStorageState,
    });

    if (onProgress) onProgress({ stage: 'Reel shared successfully!', progress: 100 });

    await page.waitForTimeout(2000);
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
  listAccounts,
  switchActiveAccount,
  disconnectAccount,
  disconnectSession,
  startInteractiveLogin,
  uploadReel,
};
