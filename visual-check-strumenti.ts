import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

interface VisualCheckResult {
  site: string;
  timestamp: string;
  status: 'success' | 'error';
  screenshots: {
    desktop: string;
    mobile: string;
  };
  consoleErrors: string[];
  metrics: {
    loadTimeMs: number;
    statusCode: number;
  };
  pageUrl: string;
  error?: string;
}

async function visualCheck(url: string, pageName: string): Promise<VisualCheckResult> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const outputDir = path.join('/Users/claudiocronin/websites/sites/guidapatrimonio.it/visual-checks', timestamp);

  fs.mkdirSync(outputDir, { recursive: true });

  const consoleErrors: string[] = [];
  let statusCode = 0;
  let startTime = Date.now();

  const browser = await chromium.launch({ headless: true });

  try {
    // Desktop screenshot
    const desktopContext = await browser.newContext({
      viewport: { width: 1366, height: 768 }
    });
    const desktopPage = await desktopContext.newPage();

    desktopPage.on('console', msg => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        consoleErrors.push(`[${msg.type()}] ${msg.text()}`);
      }
    });

    const response = await desktopPage.goto(url, {
      timeout: 30000,
      waitUntil: 'networkidle'
    });

    statusCode = response?.status() || 0;
    const loadTimeMs = Date.now() - startTime;

    const desktopPath = path.join(outputDir, `${pageName}-desktop.png`);
    await desktopPage.screenshot({
      path: desktopPath,
      fullPage: true
    });

    await desktopContext.close();

    // Mobile screenshot
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true
    });
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
      site: 'guidapatrimonio.it',
      timestamp: new Date().toISOString(),
      status: 'success',
      screenshots: {
        desktop: desktopPath,
        mobile: mobilePath
      },
      consoleErrors,
      metrics: {
        loadTimeMs,
        statusCode
      },
      pageUrl: url
    };

  } catch (error) {
    return {
      site: 'guidapatrimonio.it',
      timestamp: new Date().toISOString(),
      status: 'error',
      screenshots: {
        desktop: '',
        mobile: ''
      },
      consoleErrors,
      metrics: {
        loadTimeMs: Date.now() - startTime,
        statusCode: statusCode || 0
      },
      pageUrl: url,
      error: error instanceof Error ? error.message : String(error)
    };
  } finally {
    await browser.close();
  }
}

async function checkAllPages() {
  const pagesToCheck = [
    { url: 'https://guidapatrimonio.it/strumenti', name: 'strumenti' },
    { url: 'https://guidapatrimonio.it/', name: 'homepage' },
    { url: 'https://guidapatrimonio.it/chi-sono', name: 'chi-sono' },
    { url: 'https://guidapatrimonio.it/contatti', name: 'contatti' }
  ];

  const results: VisualCheckResult[] = [];

  console.log('Starting visual checks for guidapatrimonio.it...\n');

  for (const page of pagesToCheck) {
    console.log(`Checking ${page.name} (${page.url})...`);
    const result = await visualCheck(page.url, page.name);
    results.push(result);

    if (result.status === 'success') {
      console.log(`✓ ${page.name} captured successfully`);
      console.log(`  Desktop: ${result.screenshots.desktop}`);
      console.log(`  Mobile: ${result.screenshots.mobile}`);
      console.log(`  Load time: ${result.metrics.loadTimeMs}ms`);
      console.log(`  Status: ${result.metrics.statusCode}`);
      if (result.consoleErrors.length > 0) {
        console.log(`  Console errors: ${result.consoleErrors.length}`);
      }
    } else {
      console.log(`✗ ${page.name} failed: ${result.error}`);
    }
    console.log('');
  }

  // Summary
  console.log('\n=== SUMMARY ===');
  console.log(`Total pages checked: ${results.length}`);
  console.log(`Successful: ${results.filter(r => r.status === 'success').length}`);
  console.log(`Failed: ${results.filter(r => r.status === 'error').length}`);

  const totalErrors = results.reduce((sum, r) => sum + r.consoleErrors.length, 0);
  if (totalErrors > 0) {
    console.log(`\nTotal console errors/warnings: ${totalErrors}`);
  }

  // Write JSON report
  const reportPath = path.join('/Users/claudiocronin/websites/sites/guidapatrimonio.it/visual-checks', 'report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\nFull report saved to: ${reportPath}`);

  return results;
}

checkAllPages().then(results => {
  const hasErrors = results.some(r => r.status === 'error');
  process.exit(hasErrors ? 1 : 0);
});
