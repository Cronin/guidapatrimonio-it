import https from 'https';
import fs from 'fs';
import path from 'path';

const outputDir = './public/images/news';

async function searchImages(query, limit = 1) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      action: 'query',
      format: 'json',
      list: 'search',
      srsearch: `${query} filetype:bitmap`,
      srnamespace: '6',
      srlimit: limit.toString()
    });
    const url = `https://commons.wikimedia.org/w/api.php?${params}`;
    const options = { headers: { 'User-Agent': 'GuidaPatrimonio/1.0 (https://guidapatrimonio.it)' }};
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.query?.search || []);
        } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

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
    const options = { headers: { 'User-Agent': 'GuidaPatrimonio/1.0 (https://guidapatrimonio.it)' }};
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
            if (imageinfo) resolve(imageinfo.thumburl || imageinfo.url);
          }
          resolve(null);
        } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const options = { headers: { 'User-Agent': 'GuidaPatrimonio/1.0 (https://guidapatrimonio.it)' }};
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
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', reject);
  });
}

const searches = [
  { query: 'notary documents signing', name: 'documenti-legali.jpg' },
  { query: 'Swiss bank building', name: 'banca-svizzera.jpg' },
  { query: 'trading floor screens', name: 'trading-floor.jpg' },
  { query: 'luxury apartment interior', name: 'appartamento-lusso.jpg' },
  { query: 'Burgundy vineyard France', name: 'borgogna-vigneto.jpg' },
  { query: 'Rolex Daytona watch', name: 'rolex-daytona.jpg' },
  { query: 'art gallery museum', name: 'galleria-arte.jpg' },
  { query: 'private banking office', name: 'private-banking.jpg' },
];

async function main() {
  for (const search of searches) {
    try {
      console.log(`Searching: ${search.query}...`);
      const results = await searchImages(search.query, 1);
      if (results.length === 0) { console.log(`  ✗ No results`); continue; }
      const title = results[0].title;
      const imageUrl = await getImageInfo(title);
      if (!imageUrl) { console.log(`  ✗ No URL`); continue; }
      const dest = path.join(outputDir, search.name);
      await downloadFile(imageUrl, dest);
      const stats = fs.statSync(dest);
      console.log(`  ✓ ${search.name} (${Math.round(stats.size / 1024)}KB)`);
      await new Promise(r => setTimeout(r, 500));
    } catch (err) {
      console.log(`  ✗ Error: ${err.message}`);
    }
  }
}
main();
