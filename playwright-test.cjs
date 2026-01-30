const { chromium } = require('playwright');

const TARGET_URL = 'http://localhost:3000';
const SCREENSHOT_DIR = 'E:/dahuangzhanyaolu/screenshots';

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 100 });
  const page = await browser.newPage();
  const viewport = { width: 1920, height: 1080 };
  await page.setViewportSize(viewport);

  console.log('🎮 Testing 大荒斩妖录 (Dahuang Zanyaolu) Game UI');

  try {
    // Test 1: Main page load
    console.log('\n📄 Loading main page...');
    await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 15000 });
    const title = await page.title();
    console.log(`   Page title: "${title}"`);

    // Take screenshot of main screen
    await page.screenshot({ path: `${SCREENSHOT_DIR}/01-main-screen.png`, fullPage: true });
    console.log(`   ✅ Screenshot saved: 01-main-screen.png`);

    // Test 2: Check map container exists
    console.log('\n🗺️  Checking map view...');
    const mapContainer = await page.$('#map-container');
    if (mapContainer) {
      console.log('   ✅ Map container found');

      // Check background image is loaded
      const bgImage = await mapContainer.evaluate(el => {
        const style = window.getComputedStyle(el);
        return style.backgroundImage;
      });
      console.log(`   Background: ${bgImage.substring(0, 100)}...`);

      await page.screenshot({ path: `${SCREENSHOT_DIR}/02-map-view.png`, fullPage: true });
      console.log(`   ✅ Screenshot saved: 02-map-view.png`);
    } else {
      console.log('   ❌ Map container not found');
    }

    // Test 3: Check region hotspots
    console.log('\n📍 Checking region hotspots...');
    const hotspots = await page.$$('.region-hotspot');
    console.log(`   Found ${hotspots.length} region hotspots`);

    for (let i = 0; i < hotspots.length; i++) {
      const hotspot = hotspots[i];
      const regionId = await hotspot.getAttribute('data-region-id');
      const label = await hotspot.$eval('.region-label', el => el.textContent).catch(() => 'N/A');
      const isLocked = await hotspot.evaluate(el => el.classList.contains('locked'));
      console.log(`   - ${regionId}: "${label}" ${isLocked ? '(🔒 Locked)' : '(🔓 Unlocked)'}`);
    }

    await page.screenshot({ path: `${SCREENSHOT_DIR}/03-region-hotspots.png`, fullPage: true });
    console.log(`   ✅ Screenshot saved: 03-region-hotspots.png`);

    // Test 4: Click on a region (South)
    console.log('\n🔍 Testing region click (South)...');
    const southHotspot = await page.$('.region-hotspot[data-region-id="south"]');
    if (southHotspot) {
      await southHotspot.click();
      await page.waitForTimeout(500);

      await page.screenshot({ path: `${SCREENSHOT_DIR}/04-region-south.png`, fullPage: true });
      console.log(`   ✅ Screenshot saved: 04-region-south.png`);

      // Check if region detail view appeared
      const regionDetail = await page.$('#region-screen');
      if (regionDetail) {
        console.log('   ✅ Region detail view opened');

        // Get monsters in this region
        const monsterCards = await page.$$('.monster-card');
        console.log(`   Found ${monsterCards.length} monster cards`);

        for (let i = 0; i < Math.min(3, monsterCards.length); i++) {
          const monsterName = await monsterCards[i].$eval('.monster-name', el => el.textContent).catch(() => 'Unknown');
          console.log(`   - Monster ${i + 1}: ${monsterName}`);
        }

        await page.screenshot({ path: `${SCREENSHOT_DIR}/05-monster-list.png`, fullPage: true });
        console.log(`   ✅ Screenshot saved: 05-monster-list.png`);
      }
    }

    // Test 5: Go back to map
    console.log('\n🔙 Returning to map...');
    const backButton = await page.$('.back-button, #back-button, button[aria-label*="back"]');
    if (backButton) {
      await backButton.click();
      await page.waitForTimeout(500);
      console.log('   ✅ Returned to map');
    }

    // Test 6: Check blade gallery
    console.log('\n⚔️  Checking blade gallery...');
    const bladeGalleryBtn = await page.$('#blade-gallery-btn, .blade-gallery-button, button:has-text("神兵")');
    if (bladeGalleryBtn) {
      await bladeGalleryBtn.click();
      await page.waitForTimeout(500);

      await page.screenshot({ path: `${SCREENSHOT_DIR}/06-blade-gallery.png`, fullPage: true });
      console.log(`   ✅ Screenshot saved: 06-blade-gallery.png`);

      const bladeCards = await page.$$('.blade-card');
      console.log(`   Found ${bladeCards.length} blade cards`);
    } else {
      console.log('   ⚠️  Blade gallery button not found');
    }

    // Test 7: Check overall styling
    console.log('\n🎨 Checking visual styling...');
    const bodyStyles = await page.evaluate(() => {
      const styles = window.getComputedStyle(document.body);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        fontFamily: styles.fontFamily
      };
    });
    console.log(`   Body styles:`, bodyStyles);

    // Test 8: Responsive design check
    console.log('\n📱 Testing responsive design...');
    const viewports = [
      { name: 'Desktop', width: 1920, height: 1080 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Mobile', width: 375, height: 667 }
    ];

    for (const vp of viewports) {
      await page.setViewportSize(vp);
      await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
      await page.waitForTimeout(300);

      await page.screenshot({
        path: `${SCREENSHOT_DIR}/responsive-${vp.name.toLowerCase()}.png`,
        fullPage: true
      });
      console.log(`   ✅ ${vp.name} (${vp.width}x${vp.height}) screenshot saved`);
    }

    console.log('\n✨ All tests completed successfully!');
    console.log(`📸 Screenshots saved to: ${SCREENSHOT_DIR}`);

  } catch (error) {
    console.error('\n❌ Error during testing:', error.message);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/error-screenshot.png` });
    console.log('   📸 Error screenshot saved');
  } finally {
    await browser.close();
  }
})();
