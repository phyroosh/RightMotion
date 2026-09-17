const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function runVisualTests() {
  const outDir = path.resolve(__dirname, '../../out');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  console.log('🚀 Launching RightMotion Studio Responsive Visual Test Matrix...');

  try {
    // -------------------------------------------------------------
    // TEST 1: Desktop Viewport (1440x900)
    // -------------------------------------------------------------
    console.log('\n🖥️ [1/4] Testing Desktop 1440x900...');
    const desktopContext = await browser.newContext({
      viewport: { width: 1440, height: 900 }
    });
    const desktopPage = await desktopContext.newPage();
    await desktopPage.goto('http://localhost:4000', { waitUntil: 'networkidle' });
    await desktopPage.waitForTimeout(1500);

    // Verify desktop structural integrity
    const desktopTopbarDisplay = await desktopPage.$eval('.app > .topbar', el => window.getComputedStyle(el).display);
    const desktopMainDisplay = await desktopPage.$eval('.app > .main', el => window.getComputedStyle(el).display);
    const mobileContainerDisplay = await desktopPage.$eval('#mobileAppContainer', el => window.getComputedStyle(el).display);

    console.log(`   Desktop Topbar Display: ${desktopTopbarDisplay} (Expected: flex/block)`);
    console.log(`   Desktop Main Workspace: ${desktopMainDisplay} (Expected: grid/flex)`);
    console.log(`   Mobile Container Display: ${mobileContainerDisplay} (Expected: none)`);

    if (mobileContainerDisplay !== 'none') {
      throw new Error(`Mobile container is visible on desktop! display: ${mobileContainerDisplay}`);
    }

    const desktopPath = path.join(outDir, 'desktop_1440x900.png');
    await desktopPage.screenshot({ path: desktopPath });
    console.log(`   📸 Saved desktop screenshot: ${desktopPath}`);
    await desktopContext.close();

    // -------------------------------------------------------------
    // TEST 2: iPhone 12/13/14 (390x844) - All 5 Mobile Tabs
    // -------------------------------------------------------------
    console.log('\n📱 [2/4] Testing Mobile 390x844 (iPhone 12/13/14)...');
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto('http://localhost:4000', { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(1500);

    // Verify desktop hidden, mobile active
    const mobTopbarDisplay = await mobilePage.$eval('.app > .topbar', el => window.getComputedStyle(el).display);
    const mobMainDisplay = await mobilePage.$eval('.app > .main', el => window.getComputedStyle(el).display);
    const mobContainerDisplay = await mobilePage.$eval('#mobileAppContainer', el => window.getComputedStyle(el).display);

    console.log(`   Desktop Topbar on Mobile: ${mobTopbarDisplay} (Expected: none)`);
    console.log(`   Desktop Main on Mobile: ${mobMainDisplay} (Expected: none)`);
    console.log(`   Mobile Container on Mobile: ${mobContainerDisplay} (Expected: flex)`);

    if (mobTopbarDisplay !== 'none' || mobMainDisplay !== 'none') {
      throw new Error('Desktop layout is not hidden on mobile viewport!');
    }
    if (mobContainerDisplay !== 'flex') {
      throw new Error(`Mobile container is not flex on mobile viewport! Computed: ${mobContainerDisplay}`);
    }

    // TAB 1: Projects
    const projectsPath = path.join(outDir, 'mobile_390x844_projects.png');
    await mobilePage.screenshot({ path: projectsPath });
    console.log(`   📸 Saved Projects Tab: ${projectsPath}`);

    // Click first project card or navigate to Studio
    const firstProject = await mobilePage.$('.mobile-project-card');
    if (firstProject) {
      await firstProject.click();
      await mobilePage.waitForTimeout(800);
    } else {
      await mobilePage.click('#mobileNavItemStudio');
      await mobilePage.waitForTimeout(800);
    }

    // TAB 2: Studio
    const studioPath = path.join(outDir, 'mobile_390x844_studio.png');
    await mobilePage.screenshot({ path: studioPath });
    console.log(`   📸 Saved Studio Tab: ${studioPath}`);

    // TAB 3: AI
    await mobilePage.click('#mobileNavItemAi');
    await mobilePage.waitForTimeout(600);
    const aiPath = path.join(outDir, 'mobile_390x844_ai.png');
    await mobilePage.screenshot({ path: aiPath });
    console.log(`   📸 Saved AI Tab: ${aiPath}`);

    // TAB 4: Activity
    await mobilePage.click('#mobileNavItemActivity');
    await mobilePage.waitForTimeout(600);
    const actPath = path.join(outDir, 'mobile_390x844_activity.png');
    await mobilePage.screenshot({ path: actPath });
    console.log(`   📸 Saved Activity Tab: ${actPath}`);

    // TAB 5: More
    await mobilePage.click('#mobileNavItemMore');
    await mobilePage.waitForTimeout(600);
    const morePath = path.join(outDir, 'mobile_390x844_more.png');
    await mobilePage.screenshot({ path: morePath });
    console.log(`   📸 Saved More Tab: ${morePath}`);

    await mobileContext.close();

    // -------------------------------------------------------------
    // TEST 3: iPhone 14/15 Pro (393x852)
    // -------------------------------------------------------------
    console.log('\n📱 [3/4] Testing Mobile 393x852 (iPhone 14/15 Pro)...');
    const proContext = await browser.newContext({
      viewport: { width: 393, height: 852 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true
    });
    const proPage = await proContext.newPage();
    await proPage.goto('http://localhost:4000', { waitUntil: 'networkidle' });
    await proPage.waitForTimeout(1000);
    await proPage.click('#mobileNavItemStudio');
    await proPage.waitForTimeout(600);

    const proStudioPath = path.join(outDir, 'mobile_393x852_studio.png');
    await proPage.screenshot({ path: proStudioPath });
    console.log(`   📸 Saved iPhone 14 Pro Studio Tab: ${proStudioPath}`);
    await proContext.close();

    // -------------------------------------------------------------
    // TEST 4: iPhone 14/15 Pro Max (430x932)
    // -------------------------------------------------------------
    console.log('\n📱 [4/4] Testing Mobile 430x932 (iPhone 14/15 Pro Max)...');
    const maxContext = await browser.newContext({
      viewport: { width: 430, height: 932 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true
    });
    const maxPage = await maxContext.newPage();
    await maxPage.goto('http://localhost:4000', { waitUntil: 'networkidle' });
    await maxPage.waitForTimeout(1000);

    const maxProjectsPath = path.join(outDir, 'mobile_430x932_projects.png');
    await maxPage.screenshot({ path: maxProjectsPath });
    console.log(`   📸 Saved iPhone Pro Max Projects Tab: ${maxProjectsPath}`);

    await maxPage.click('#mobileNavItemMore');
    await maxPage.waitForTimeout(600);
    const maxMorePath = path.join(outDir, 'mobile_430x932_more.png');
    await maxPage.screenshot({ path: maxMorePath });
    console.log(`   📸 Saved iPhone Pro Max More Tab: ${maxMorePath}`);
    await maxContext.close();

    console.log('\n======================================================');
    console.log('✅ ALL RESPONSIVE VISUAL TESTS COMPLETED SUCCESSFULLY!');
    console.log('======================================================\n');

  } finally {
    await browser.close();
  }
}

runVisualTests().catch(err => {
  console.error('❌ Visual test failed:', err);
  process.exit(1);
});
