import { chromium } from 'playwright';
import path from 'path';

async function captureGuidaPatrimonio() {
  const url = 'http://localhost:3002';
  const outputDir = '/Users/claudiocronin/websites/sites/guidapatrimonio.it/screenshots/v4';
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  
  console.log('Starting capture of guidapatrimonio.it v4...');
  
  const browser = await chromium.launch({ headless: true });
  
  try {
    // Desktop full page
    const desktopContext = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    const desktopPage = await desktopContext.newPage();
    
    console.log('Navigating to', url);
    await desktopPage.goto(url, {
      timeout: 30000,
      waitUntil: 'networkidle'
    });
    
    // Wait a bit for fonts and images to load
    await desktopPage.waitForTimeout(2000);
    
    // Full page desktop screenshot
    const desktopFullPath = path.join(outputDir, `desktop-full-${timestamp}.png`);
    await desktopPage.screenshot({
      path: desktopFullPath,
      fullPage: true
    });
    console.log('✓ Desktop full page saved:', desktopFullPath);
    
    // Hero section focus (viewport height)
    const desktopHeroPath = path.join(outputDir, `desktop-hero-${timestamp}.png`);
    await desktopPage.screenshot({
      path: desktopHeroPath,
      fullPage: false
    });
    console.log('✓ Desktop hero section saved:', desktopHeroPath);
    
    await desktopContext.close();
    
    console.log('\n=== CAPTURE COMPLETE ===');
    console.log('Screenshots saved in:', outputDir);
    console.log('\nVerification checklist:');
    console.log('1. Logo "guidaPATRIMONIO" is in serif ITALIC (corsivo)?');
    console.log('2. Hero is MINIMAL like CWFG (little text, lots of space)?');
    console.log('3. Forest image is AERIAL view (green from above)?');
    console.log('4. Compare with CWFG original design');
    
  } catch (error) {
    console.error('Error during capture:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

captureGuidaPatrimonio().catch(console.error);
