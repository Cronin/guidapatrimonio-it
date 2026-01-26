import { chromium, devices } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

interface PageCheckResult {
  url: string;
  timestamp: string;
  screenshots: {
    desktop: string;
    mobile: string;
  };
  status: 'success' | 'error';
  error?: string;
}

const pages = [
  {
    url: 'https://guidapatrimonio.it/strumenti/mercato-immobiliare-luxury',
    name: 'mercato-luxury'
  },
  {
    url: 'https://guidapatrimonio.it/strumenti/calcolatore-plusvalenze',
    name: 'calcolatore-plusvalenze'
  },
  {
    url: 'https://guidapatrimonio.it/strumenti/backtest-portafoglio',
    name: 'backtest-portafoglio'
  }
];

async function checkPage(url: string, pageName: string, outputDir: string): Promise<PageCheckResult> {
  const browser = await chromium.launch({ headless: true });

  try {
    // Desktop screenshot
    const desktopContext = await browser.newContext({
      viewport: { width: 1366, height: 768 }
    });
    const desktopPage = await desktopContext.newPage();

    await desktopPage.goto(url, {
      timeout: 30000,
      waitUntil: 'networkidle'
    });

    const desktopPath = path.join(outputDir, `${pageName}-desktop.png`);
    await desktopPage.screenshot({
      path: desktopPath,
      fullPage: true
    });

    await desktopContext.close();

    // Mobile screenshot
    const iPhone12 = devices['iPhone 12'];
    const mobileContext = await browser.newContext({ ...iPhone12 });
    const mobilePage = await mobileContext.newPage();

    await mobilePage.goto(url, {
      timeout: 30000,
      waitUntil: 'networkidle'
    });

    const mobilePath = path.join(outputDir, `${pageName}-mobile.png`);
    await mobilePage.screenshot({
      path: mobilePath,
      fullPage: true
    });

    await mobileContext.close();

    return {
      url,
      timestamp: new Date().toISOString(),
      screenshots: {
        desktop: desktopPath,
        mobile: mobilePath
      },
      status: 'success'
    };

  } catch (error) {
    return {
      url,
      timestamp: new Date().toISOString(),
      screenshots: {
        desktop: '',
        mobile: ''
      },
      status: 'error',
      error: error instanceof Error ? error.message : String(error)
    };
  } finally {
    await browser.close();
  }
}

async function main() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const outputDir = path.join(
    '/Users/claudiocronin/websites/sites/guidapatrimonio.it',
    'visual-checks',
    `green-verification-${timestamp}`
  );

  fs.mkdirSync(outputDir, { recursive: true });

  console.log('Starting visual verification of green color scheme...\n');

  const results: PageCheckResult[] = [];

  for (const page of pages) {
    console.log(`Checking: ${page.name}...`);
    const result = await checkPage(page.url, page.name, outputDir);
    results.push(result);

    if (result.status === 'success') {
      console.log(`✓ Screenshots captured for ${page.name}`);
    } else {
      console.log(`✗ Error capturing ${page.name}: ${result.error}`);
    }
  }

  // Save report
  const reportPath = path.join(outputDir, 'verification-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));

  console.log('\n=== VERIFICATION COMPLETE ===');
  console.log(`Output directory: ${outputDir}`);
  console.log(`Total pages checked: ${results.length}`);
  console.log(`Successful: ${results.filter(r => r.status === 'success').length}`);
  console.log(`Failed: ${results.filter(r => r.status === 'error').length}`);
  console.log('\nScreenshots ready for visual analysis by main Claude instance.');
}

main();
