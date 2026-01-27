import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

async function completeFormTest() {
  const outputDir = '/Users/claudiocronin/websites/sites/guidapatrimonio.it/visual-checks/typeform-final';

  const browser = await chromium.launch({
    headless: false,
    slowMo: 1000
  });

  const context = await browser.newContext({
    viewport: { width: 1366, height: 768 }
  });

  const page = await context.newPage();

  try {
    console.log('Navigating to guidapatrimonio.it/#contatti...');
    await page.goto('https://guidapatrimonio.it/#contatti', {
      timeout: 60000,
      waitUntil: 'domcontentloaded' // Less strict than networkidle
    });

    await page.waitForTimeout(3000);

    console.log('Filling name...');
    await page.fill('input[type="text"]', 'Test');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);

    console.log('Filling surname...');
    await page.fill('input[type="text"]:visible', 'Utente');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);

    console.log('Filling email...');
    await page.fill('input[type="email"]:visible', 'test@test.com');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);

    console.log('Filling phone...');
    await page.fill('input[type="tel"]:visible', '+39 333 0000000');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);

    console.log('Waiting for patrimonio options...');
    await page.waitForTimeout(1000);

    // Take screenshot before clicking
    await page.screenshot({
      path: path.join(outputDir, '05-patrimonio-before-click.png'),
      fullPage: false
    });

    console.log('Clicking €250.000 - €500.000 option...');

    // Click using keyboard shortcut (E key)
    await page.keyboard.press('e');
    await page.waitForTimeout(3000);

    // Take screenshot after clicking
    await page.screenshot({
      path: path.join(outputDir, '06-patrimonio-after-click.png'),
      fullPage: false
    });

    console.log('Looking for message field or submit button...');
    await page.waitForTimeout(2000);

    // Take screenshot of whatever is showing now
    await page.screenshot({
      path: path.join(outputDir, '07-current-state.png'),
      fullPage: false
    });

    // Try to find textarea for message
    const messageField = await page.locator('textarea').first();
    if (await messageField.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log('Found message field, taking screenshot...');
      await page.screenshot({
        path: path.join(outputDir, '08-message-step.png'),
        fullPage: false
      });

      // Skip message and submit
      console.log('Looking for submit button...');
      const submitBtn = await page.locator('button:has-text("Invia")').or(page.locator('button[type="submit"]')).first();
      await submitBtn.click();
      await page.waitForTimeout(2000);

      await page.screenshot({
        path: path.join(outputDir, '09-loading.png'),
        fullPage: false
      });

      await page.waitForTimeout(4000);

      await page.screenshot({
        path: path.join(outputDir, '10-final-result.png'),
        fullPage: false
      });
    } else {
      console.log('Message field not visible, checking page state...');
      const html = await page.content();
      fs.writeFileSync(path.join(outputDir, 'page-html.html'), html);
    }

    console.log('✅ Test completed!');

  } catch (error) {
    console.error('❌ Error:', error);
    await page.screenshot({
      path: path.join(outputDir, 'error-final.png'),
      fullPage: true
    });
  } finally {
    await browser.close();
  }
}

completeFormTest();
