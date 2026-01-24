import https from 'https';
import fs from 'fs';
import path from 'path';

const outputDir = './public/images/news';

// Wikimedia Commons API search
async function searchImages(query, limit = 3) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      action: 'query',
      format: 'json',
      list: 'search',
      srsearch: `${query} filetype:bitmap`,
      srnamespace: '6', // File namespace
      srlimit: limit.toString()
    });
    
    const url = `https://commons.wikimedia.org/w/api.php?${params}`;
    
    const options = {
      headers: {
        'User-Agent': 'GuidaPatrimonio/1.0 (https://guidapatrimonio.it; info@guidapatrimonio.it)'
      }
    };
    
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.query?.search || []);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// Get image info (URL)
async function getImageInfo(title) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      action: 'query',
      format: 'json',
      titles: title,
      prop: 'imageinfo',
      iiprop: 'url',
      iiurlwidth: '1200'
    });
    
    const url = `https://commons.wikimedia.org/w/api.php?${params}`;
    
    const options = {
      headers: {
        'User-Agent': 'GuidaPatrimonio/1.0 (https://guidapatrimonio.it; info@guidapatrimonio.it)'
      }
    };
    
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query?.pages;
          if (pages) {
            const page = Object.values(pages)[0];
            const imageinfo = page?.imageinfo?.[0];
            if (imageinfo) {
              resolve(imageinfo.thumburl || imageinfo.url);
            }
          }
          resolve(null);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// Download file
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith('https') ? https : require('http');
    
    const options = {
      headers: {
        'User-Agent': 'GuidaPatrimonio/1.0 (https://guidapatrimonio.it; info@guidapatrimonio.it)'
      }
    };
    
    https.get(url, options, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadFile(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', reject);
  });
}

const searches = [
  { query: 'Milan Porta Nuova skyline', name: 'milano-skyline.jpg' },
  { query: 'CityLife Milan tower', name: 'milano-citylife.jpg' },
  { query: 'Ferrari 250 GTO', name: 'ferrari-250-gto.jpg' },
  { query: 'Ferrari Enzo', name: 'ferrari-enzo.jpg' },
  { query: 'gold bars bullion', name: 'oro-lingotti.jpg' },
  { query: 'Amalfi coast Italy', name: 'amalfi-coast.jpg' },
  { query: 'Lake Como Italy', name: 'lago-como.jpg' },
  { query: 'Monaco Monte Carlo port', name: 'monaco-port.jpg' },
  { query: 'superyacht luxury', name: 'superyacht.jpg' },
  { query: 'Patek Philippe watch', name: 'patek-philippe.jpg' },
  { query: 'wine cellar barrels', name: 'cantina-vino.jpg' },
  { query: 'Zurich Switzerland city', name: 'zurigo.jpg' },
  { query: 'private jet Gulfstream', name: 'jet-privato.jpg' },
  { query: 'Christie auction art', name: 'asta-arte.jpg' },
  { query: 'Wall Street NYSE', name: 'wall-street.jpg' },
  { query: 'Bitcoin cryptocurrency', name: 'bitcoin.jpg' },
  { query: 'family office meeting', name: 'family-office.jpg' },
];

async function main() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  for (const search of searches) {
    try {
      console.log(`Searching: ${search.query}...`);
      const results = await searchImages(search.query, 1);
      
      if (results.length === 0) {
        console.log(`  ✗ No results for: ${search.query}`);
        continue;
      }
      
      const title = results[0].title;
      console.log(`  Found: ${title}`);
      
      const imageUrl = await getImageInfo(title);
      if (!imageUrl) {
        console.log(`  ✗ Could not get URL for: ${title}`);
        continue;
      }
      
      const dest = path.join(outputDir, search.name);
      await downloadFile(imageUrl, dest);
      
      const stats = fs.statSync(dest);
      console.log(`  ✓ Downloaded: ${search.name} (${Math.round(stats.size / 1024)}KB)`);
      
      // Delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 500));
      
    } catch (err) {
      console.log(`  ✗ Error: ${err.message}`);
    }
  }
}

main();
