import { chromium } from 'playwright';
import path from 'path';

async function testContactForm() {
  const outputDir = '/Users/claudiocronin/websites/sites/guidapatrimonio.it/visual-checks/form-test';
  const url = 'https://guidapatrimonio.it/#contatti';

  const browser = await chromium.launch({ headless: false }); // Non-headless to see what's happening

  try {
    const context = await browser.newContext({
      viewport: { width: 1366, height: 768 }
    });
    const page = await context.newPage();

    console.log('Navigating to guidapatrimonio.it...');
    await page.goto(url, {
      timeout: 30000,
      waitUntil: 'networkidle'
    });

    // Wait for form to be visible
    await page.waitForSelector('form', { timeout: 10000 });

    // Screenshot 1: Initial form
    console.log('Taking screenshot of contact form...');
    await page.screenshot({
      path: path.join(outputDir, '01-contact-form-initial.png'),
      fullPage: false
    });

    // Fill out the form
    console.log('Filling out form fields...');

    // Nome
    await page.fill('input[name="nome"], input[placeholder*="Nome"]', 'Test');
    await page.waitForTimeout(300);

    // Cognome
    await page.fill('input[name="cognome"], input[placeholder*="Cognome"]', 'Utente');
    await page.waitForTimeout(300);

    // Telefono
    await page.fill('input[name="telefono"], input[type="tel"], input[placeholder*="Telefono"]', '+39 333 1234567');
    await page.waitForTimeout(300);

    // Email
    await page.fill('input[name="email"], input[type="email"], input[placeholder*="Email"]', 'test@example.com');
    await page.waitForTimeout(300);

    // Patrimonio - find and select the option
    const patrimonioSelector = 'select[name="patrimonio"], select[name="assets"]';
    await page.waitForSelector(patrimonioSelector, { timeout: 5000 });
    await page.selectOption(patrimonioSelector, { label: '€150.000 - €250.000' });
    await page.waitForTimeout(300);

    // Screenshot 2: Form filled
    console.log('Taking screenshot of filled form...');
    await page.screenshot({
      path: path.join(outputDir, '02-contact-form-filled.png'),
      fullPage: false
    });

    // Click submit button
    console.log('Clicking submit button...');
    const submitButton = page.locator('button:has-text("Richiedi Callback Gratuito"), button[type="submit"]').first();
    await submitButton.click();

    // Wait a moment for transition
    await page.waitForTimeout(1000);

    // Screenshot 3: Loading/analyzing screen (with green circle)
    console.log('Taking screenshot of loading screen...');
    await page.screenshot({
      path: path.join(outputDir, '03-loading-analyzing.png'),
      fullPage: false
    });

    // Wait for the match confirmed screen
    console.log('Waiting for Match Confermato screen...');
    await page.waitForTimeout(3000); // Give it time to complete analysis animation

    // Screenshot 4: Final "Match Confermato" screen
    console.log('Taking screenshot of Match Confermato screen...');
    await page.screenshot({
      path: path.join(outputDir, '04-match-confermato.png'),
      fullPage: false
    });

    // Also take a full page screenshot for context
    await page.screenshot({
      path: path.join(outputDir, '05-match-confermato-fullpage.png'),
      fullPage: true
    });

    console.log('\n✅ Form test completed successfully!');
    console.log('Screenshots saved to:', outputDir);

    return {
      status: 'success',
      screenshots: [
        '01-contact-form-initial.png',
        '02-contact-form-filled.png',
        '03-loading-analyzing.png',
        '04-match-confermato.png',
        '05-match-confermato-fullpage.png'
      ]
    };

  } catch (error) {
    console.error('Error during form test:', error);

    // Take error screenshot
    const page = (await browser.contexts()[0]?.pages())?.[0];
    if (page) {
      await page.screenshot({
        path: path.join(outputDir, 'error-screenshot.png'),
        fullPage: true
      });
    }

    throw error;
  } finally {
    await browser.close();
  }
}

testContactForm().then(result => {
  console.log(JSON.stringify(result, null, 2));
}).catch(err => {
  console.error('Failed:', err);
  process.exit(1);
});
