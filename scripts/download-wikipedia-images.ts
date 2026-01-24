/**
 * Download images from Wikipedia/Wikimedia Commons for news articles
 *
 * This script downloads high-quality images for each article theme
 * and saves them optimized for web use.
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import sharp from 'sharp';

interface ImageTask {
  theme: string;
  searchTerms: string[];
  outputFiles: string[];
  description: string;
}

// Image download tasks for each article theme
const imageTasks: ImageTask[] = [
  {
    theme: 'Milano skyline',
    searchTerms: ['Milano_Skyline', 'Porta_Nuova_Milan', 'CityLife_Milan'],
    outputFiles: ['milano-skyline.jpg', 'porta-nuova.jpg'],
    description: 'Skyline di Milano, Porta Nuova, CityLife'
  },
  {
    theme: 'Italia luxury destinations',
    searchTerms: ['Amalfi_Coast', 'Lake_Como', 'Italian_Riviera'],
    outputFiles: ['amalfi-coast.jpg', 'lago-como.jpg'],
    description: 'Costa Amalfitana, Lago di Como'
  },
  {
    theme: 'Ferrari 250 GTO',
    searchTerms: ['Ferrari_250_GTO', 'Ferrari_classic_cars'],
    outputFiles: ['ferrari-250-gto.jpg'],
    description: 'Ferrari 250 GTO'
  },
  {
    theme: 'Gold bars',
    searchTerms: ['Gold_bars', 'Gold_bullion', 'Gold_ingots'],
    outputFiles: ['gold-bars.jpg'],
    description: 'Lingotti d\'oro'
  },
  {
    theme: 'Private banking',
    searchTerms: ['Private_banking', 'Wealth_management', 'Financial_advisor'],
    outputFiles: ['private-banking.jpg', 'consulenza-finanziaria.jpg'],
    description: 'Private banking, consulenza finanziaria'
  },
  {
    theme: 'Legal documents',
    searchTerms: ['Notary', 'Legal_documents', 'Contract_signing'],
    outputFiles: ['documenti-legali.jpg', 'notaio.jpg'],
    description: 'Documenti legali, notaio'
  },
  {
    theme: 'Milano luxury real estate',
    searchTerms: ['CityLife_Milan', 'Milan_architecture', 'Luxury_apartment'],
    outputFiles: ['citylife-milano.jpg', 'appartamento-lusso.jpg'],
    description: 'CityLife Milano, appartamenti di lusso'
  },
  {
    theme: 'Wall Street trading',
    searchTerms: ['New_York_Stock_Exchange', 'Trading_floor', 'Wall_Street'],
    outputFiles: ['wall-street.jpg', 'trading-floor.jpg'],
    description: 'Wall Street, trading floor'
  },
  {
    theme: 'Monaco yacht',
    searchTerms: ['Monaco_Harbor', 'Superyacht', 'Port_Hercule'],
    outputFiles: ['monaco-yacht.jpg', 'superyacht.jpg'],
    description: 'Monaco, superyacht, Port Hercule'
  },
  {
    theme: 'Patek Philippe',
    searchTerms: ['Patek_Philippe', 'Luxury_watch', 'Swiss_watch'],
    outputFiles: ['patek-philippe.jpg', 'orologio-lusso.jpg'],
    description: 'Orologi Patek Philippe'
  },
  {
    theme: 'Burgundy wine',
    searchTerms: ['Burgundy_wine', 'Wine_cellar', 'French_wine'],
    outputFiles: ['vino-borgogna.jpg', 'cantina.jpg'],
    description: 'Vino Borgogna, cantina'
  },
  {
    theme: 'Picasso art',
    searchTerms: ['Pablo_Picasso', 'Art_auction', 'Modern_art'],
    outputFiles: ['picasso.jpg', 'asta-arte.jpg'],
    description: 'Picasso, asta d\'arte'
  },
  {
    theme: 'Private jet',
    searchTerms: ['Gulfstream', 'Business_jet', 'Private_aviation'],
    outputFiles: ['gulfstream.jpg', 'jet-privato.jpg'],
    description: 'Gulfstream, jet privato'
  },
  {
    theme: 'Swiss banks',
    searchTerms: ['Zurich', 'Swiss_banking', 'Bank_building'],
    outputFiles: ['zurigo.jpg', 'banca-svizzera.jpg'],
    description: 'Zurigo, banche svizzere'
  },
  {
    theme: 'Family office',
    searchTerms: ['Office_interior', 'Business_meeting', 'Corporate_office'],
    outputFiles: ['ufficio.jpg', 'consulenza.jpg'],
    description: 'Ufficio, consulenza'
  },
  {
    theme: 'Bitcoin cryptocurrency',
    searchTerms: ['Bitcoin', 'Cryptocurrency', 'Digital_currency'],
    outputFiles: ['bitcoin.jpg', 'criptovaluta.jpg'],
    description: 'Bitcoin, criptovaluta'
  },
  {
    theme: 'Monaco real estate',
    searchTerms: ['Monaco', 'Monte_Carlo', 'Monaco_cityscape'],
    outputFiles: ['monaco.jpg', 'monte-carlo.jpg'],
    description: 'Monaco, Monte Carlo'
  }
];

/**
 * Fetch image URLs from Wikimedia Commons API
 */
async function searchWikimediaImage(searchTerm: string): Promise<string | null> {
  const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&generator=search&gsrsearch=${encodeURIComponent(searchTerm)}&gsrnamespace=6&gsrlimit=1&iiprop=url&iiurlwidth=1200`;

  return new Promise((resolve) => {
    https.get(apiUrl, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.query && json.query.pages) {
            const pages = Object.values(json.query.pages) as any[];
            if (pages[0]?.imageinfo?.[0]?.thumburl) {
              resolve(pages[0].imageinfo[0].thumburl);
              return;
            }
          }
          resolve(null);
        } catch (e) {
          console.error('Error parsing Wikimedia response:', e);
          resolve(null);
        }
      });
    }).on('error', (e) => {
      console.error('Error fetching from Wikimedia:', e);
      resolve(null);
    });
  });
}

/**
 * Download image from URL
 */
async function downloadImage(url: string, outputPath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(outputPath);

    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(true);
        });
      } else {
        console.error(`Failed to download: ${url} (${response.statusCode})`);
        resolve(false);
      }
    }).on('error', (e) => {
      console.error('Download error:', e);
      fs.unlink(outputPath, () => {});
      resolve(false);
    });
  });
}

/**
 * Optimize image for web using sharp
 */
async function optimizeImage(inputPath: string, outputPath: string): Promise<void> {
  await sharp(inputPath)
    .resize(1200, null, {
      withoutEnlargement: true,
      fit: 'inside'
    })
    .jpeg({ quality: 85, progressive: true })
    .toFile(outputPath);
}

/**
 * Main execution
 */
async function main() {
  const outputDir = '/Users/claudiocronin/websites/sites/guidapatrimonio.it/public/images/news';

  console.log('🎨 Starting Wikipedia image download for guidapatrimonio.it news articles\n');

  for (const task of imageTasks) {
    console.log(`\n📌 Processing: ${task.theme}`);
    console.log(`   ${task.description}`);

    for (let i = 0; i < task.searchTerms.length && i < task.outputFiles.length; i++) {
      const searchTerm = task.searchTerms[i];
      const outputFile = task.outputFiles[i];
      const outputPath = path.join(outputDir, outputFile);

      // Skip if file already exists
      if (fs.existsSync(outputPath)) {
        console.log(`   ✅ Already exists: ${outputFile}`);
        continue;
      }

      console.log(`   🔍 Searching: ${searchTerm}`);

      // Search for image
      const imageUrl = await searchWikimediaImage(searchTerm);

      if (!imageUrl) {
        console.log(`   ❌ No image found for: ${searchTerm}`);
        continue;
      }

      console.log(`   📥 Downloading: ${imageUrl}`);

      // Download to temp file
      const tempPath = outputPath + '.tmp';
      const downloaded = await downloadImage(imageUrl, tempPath);

      if (!downloaded) {
        console.log(`   ❌ Download failed`);
        continue;
      }

      // Optimize and save
      try {
        await optimizeImage(tempPath, outputPath);
        fs.unlinkSync(tempPath);
        console.log(`   ✅ Saved and optimized: ${outputFile}`);
      } catch (e) {
        console.error(`   ❌ Optimization failed:`, e);
        fs.unlinkSync(tempPath);
      }

      // Rate limiting - be nice to Wikimedia
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log('\n\n✨ Download complete!\n');
  console.log('Next step: Update articles.ts to use local image paths');
  console.log('Example: image: \'/images/news/milano-skyline.jpg\'\n');
}

main().catch(console.error);
