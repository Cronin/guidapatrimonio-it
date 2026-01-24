import https from 'https';
import fs from 'fs';
import path from 'path';

const outputDir = './public/images/news';

const images = [
  // Milano
  { name: 'milano-porta-nuova.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Porta_Nuova_%28Milan%29_-_2019.jpg/1280px-Porta_Nuova_%28Milan%29_-_2019.jpg' },
  { name: 'milano-citylife.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/CityLife_%28Milan%29_01.jpg/1280px-CityLife_%28Milan%29_01.jpg' },
  
  // Ferrari
  { name: 'ferrari-250-gto.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/1962_Ferrari_250_GTO_%283413GT%29_2.4L_V12.jpg/1280px-1962_Ferrari_250_GTO_%283413GT%29_2.4L_V12.jpg' },
  { name: 'ferrari-enzo.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Ferrari_Enzo_in_Tokyo.jpg/1280px-Ferrari_Enzo_in_Tokyo.jpg' },
  
  // Oro
  { name: 'oro-lingotti.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/GoldNuggetUSGOV.jpg/1280px-GoldNuggetUSGOV.jpg' },
  { name: 'oro-barre.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Gold_Bars.jpg/1280px-Gold_Bars.jpg' },
  
  // Italia lusso
  { name: 'amalfi-coast.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Amalfi_Coast_%28Italy%29.jpg/1280px-Amalfi_Coast_%28Italy%29.jpg' },
  { name: 'lago-como.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Lake_Como_from_Villa_Carlotta.jpg/1280px-Lake_Como_from_Villa_Carlotta.jpg' },
  
  // Monaco
  { name: 'monaco-port.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Monaco_Monte_Carlo_1.jpg/1280px-Monaco_Monte_Carlo_1.jpg' },
  { name: 'monaco-yacht.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Superyacht_A_-_Monaco.jpg/1280px-Superyacht_A_-_Monaco.jpg' },
  
  // Patek Philippe
  { name: 'patek-philippe.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Patek_Philippe_Grand_Complications_5270P.jpg/800px-Patek_Philippe_Grand_Complications_5270P.jpg' },
  
  // Vino
  { name: 'borgogna-vino.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Romanee_Conti.jpg/1024px-Romanee_Conti.jpg' },
  { name: 'cantina-vino.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Wine_cellar.jpg/1280px-Wine_cellar.jpg' },
  
  // Svizzera
  { name: 'zurigo.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Z%C3%BCrich_-_Limmat_-_Grossm%C3%BCnster_-_Wasserkirche_IMG_2107.JPG/1280px-Z%C3%BCrich_-_Limmat_-_Grossm%C3%BCnster_-_Wasserkirche_IMG_2107.JPG' },
  
  // Bitcoin
  { name: 'bitcoin.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/BTC_Logo.svg/1200px-BTC_Logo.svg.png' },
  
  // Jet privati
  { name: 'gulfstream-g650.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Gulfstream_G650ER_OE-LZG.jpg/1280px-Gulfstream_G650ER_OE-LZG.jpg' },
  
  // Picasso / Arte
  { name: 'sothebys-auction.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Sotheby%27s_New_York_by_David_Shankbone.jpg/1280px-Sotheby%27s_New_York_by_David_Shankbone.jpg' },
  
  // Wall Street
  { name: 'wall-street.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/NYSEbuilding.jpg/800px-NYSEbuilding.jpg' },
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    
    const options = {
      headers: {
        'User-Agent': 'GuidaPatrimonio/1.0 (https://guidapatrimonio.it; contact@guidapatrimonio.it) Node.js'
      }
    };
    
    https.get(url, options, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Follow redirect
        download(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  for (const img of images) {
    const dest = path.join(outputDir, img.name);
    try {
      await download(img.url, dest);
      const stats = fs.statSync(dest);
      console.log(`✓ ${img.name} (${Math.round(stats.size / 1024)}KB)`);
    } catch (err) {
      console.error(`✗ ${img.name}: ${err.message}`);
    }
  }
}

main();
