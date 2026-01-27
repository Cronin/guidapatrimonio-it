import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

async function testTypeformFlow() {
  const outputDir = '/Users/claudiocronin/websites/sites/guidapatrimonio.it/visual-checks/typeform-final';

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: false, // Keep visible to see interactions
    slowMo: 500 // Slow down for smooth transitions
  });

  const context = await browser.newContext({
    viewport: { width: 1366, height: 768 }
  });

  const page = await context.newPage();

  try {
    console.log('Navigating to guidapatrimonio.it/#contatti...');
    await page.goto('https://guidapatrimonio.it/#contatti', {
      timeout: 30000,
      waitUntil: 'networkidle'
    });

    // Wait a bit for any animations
    await page.waitForTimeout(2000);

    // Step 1: Screenshot initial state (Nome)
    console.log('Step 1: Capturing initial form state (Nome)');
    await page.screenshot({
      path: path.join(outputDir, '01-step-nome.png'),
      fullPage: false
    });

    // Type name and press Enter
    console.log('Typing "Test" and pressing Enter...');
    await page.fill('input[type="text"]', 'Test');
    await page.waitForTimeout(500);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500); // Wait for transition

    // Step 2: Screenshot Cognome
    console.log('Step 2: Capturing Cognome step');
    await page.screenshot({
      path: path.join(outputDir, '02-step-cognome.png'),
      fullPage: false
    });

    // Type surname and press Enter
    console.log('Typing "Utente" and pressing Enter...');
    await page.fill('input[type="text"]:visible', 'Utente');
    await page.waitForTimeout(500);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);

    // Step 3: Screenshot Email
    console.log('Step 3: Capturing Email step');
    await page.screenshot({
      path: path.join(outputDir, '03-step-email.png'),
      fullPage: false
    });

    // Type email and press Enter
    console.log('Typing "test@test.com" and pressing Enter...');
    await page.fill('input[type="email"]:visible', 'test@test.com');
    await page.waitForTimeout(500);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);

    // Step 4: Screenshot Telefono
    console.log('Step 4: Capturing Telefono step');
    await page.screenshot({
      path: path.join(outputDir, '04-step-telefono.png'),
      fullPage: false
    });

    // Type phone and press Enter
    console.log('Typing "+39 333 0000000" and pressing Enter...');
    await page.fill('input[type="tel"]:visible', '+39 333 0000000');
    await page.waitForTimeout(500);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);

    // Step 5: Screenshot Patrimonio options
    console.log('Step 5: Capturing Patrimonio options step');
    await page.screenshot({
      path: path.join(outputDir, '05-step-patrimonio.png'),
      fullPage: false
    });

    // Click on "€250.000 - €500.000" option
    console.log('Clicking "€250.000 - €500.000" option...');

    // Try multiple selectors to find the button
    const patrimonioButton = await page.locator('text=€250.000 - €500.000').first();
    await patrimonioButton.click();
    await page.waitForTimeout(1500);

    // Step 6: Screenshot Messaggio optional
    console.log('Step 6: Capturing Messaggio optional step');
    await page.screenshot({
      path: path.join(outputDir, '06-step-messaggio.png'),
      fullPage: false
    });

    // Click "Invia" button (skip optional message)
    console.log('Clicking "Invia" button...');
    const inviaButton = await page.locator('button:has-text("Invia")').first();
    await inviaButton.click();
    await page.waitForTimeout(1000);

    // Step 7: Screenshot loading state
    console.log('Step 7: Capturing loading state');
    await page.screenshot({
      path: path.join(outputDir, '07-loading.png'),
      fullPage: false
    });

    // Wait for final result
    await page.waitForTimeout(3000);

    // Step 8: Screenshot final result
    console.log('Step 8: Capturing final result');
    await page.screenshot({
      path: path.join(outputDir, '08-final-result.png'),
      fullPage: false
    });

    // Also take a mobile screenshot of the form
    console.log('Taking mobile screenshot...');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('https://guidapatrimonio.it/#contatti', {
      timeout: 30000,
      waitUntil: 'networkidle'
    });
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: path.join(outputDir, '09-mobile-initial.png'),
      fullPage: true
    });

    console.log('\n✅ Test completed successfully!');
    console.log(`Screenshots saved to: ${outputDir}`);

    // Generate report
    const report = {
      timestamp: new Date().toISOString(),
      status: 'success',
      url: 'https://guidapatrimonio.it/#contatti',
      steps: [
        { step: 1, description: 'Nome field', screenshot: '01-step-nome.png' },
        { step: 2, description: 'Cognome field', screenshot: '02-step-cognome.png' },
        { step: 3, description: 'Email field', screenshot: '03-step-email.png' },
        { step: 4, description: 'Telefono field', screenshot: '04-step-telefono.png' },
        { step: 5, description: 'Patrimonio options', screenshot: '05-step-patrimonio.png' },
        { step: 6, description: 'Messaggio optional', screenshot: '06-step-messaggio.png' },
        { step: 7, description: 'Loading state', screenshot: '07-loading.png' },
        { step: 8, description: 'Final result', screenshot: '08-final-result.png' },
        { step: 9, description: 'Mobile initial', screenshot: '09-mobile-initial.png' }
      ]
    };

    fs.writeFileSync(
      path.join(outputDir, 'test-report.json'),
      JSON.stringify(report, null, 2)
    );

    return report;

  } catch (error) {
    console.error('❌ Error during test:', error);

    // Take error screenshot
    await page.screenshot({
      path: path.join(outputDir, 'error-state.png'),
      fullPage: true
    });

    throw error;
  } finally {
    await browser.close();
  }
}

// Run the test
testTypeformFlow()
  .then(report => {
    console.log('\n📊 Test Report:');
    console.log(JSON.stringify(report, null, 2));
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
