const https = require('https');
const fs = require('fs');
const path = require('path');

// Search for Zurich skyline or Paradeplatz
const searches = [
  { name: 'Zurich Skyline', slug: 'Zurich', filename: 'zurich-skyline' },
  { name: 'Paradeplatz', slug: 'Paradeplatz', filename: 'paradeplatz' },
];

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function extractImageFilename(html) {
  // Find the infobox image link like: /wiki/File:Zurich_2025.jpg
  const match = html.match(/href="\/wiki\/(File:[^"]+\.(jpg|jpeg|png))"/i);
  return match ? match[1] : null;
}

function extractDirectImageUrl(filePageHtml) {
  // Find the direct image URL from the File: page
  const match = filePageHtml.match(/href="(\/\/upload\.wikimedia\.org\/wikipedia\/commons\/[^"]+\.(jpg|jpeg|png))"/i);
  return match ? 'https:' + match[1] : null;
}

async function getImageUrl(slug) {
  try {
    console.log(`\nFetching Wikipedia page for ${slug}...`);
    const wikipediaUrl = `https://en.wikipedia.org/wiki/${slug}`;
    const html = await fetchPage(wikipediaUrl);

    const imageFilename = extractImageFilename(html);
    if (!imageFilename) {
      console.log(`  ✗ No image found on Wikipedia page`);
      return null;
    }

    console.log(`  → Found image file: ${imageFilename}`);

    // Fetch the File: page
    const filePageUrl = `https://en.wikipedia.org/wiki/${imageFilename}`;
    console.log(`  → Fetching file page...`);
    const filePageHtml = await fetchPage(filePageUrl);

    const directUrl = extractDirectImageUrl(filePageHtml);
    if (!directUrl) {
      console.log(`  ✗ Could not extract direct image URL`);
      return null;
    }

    console.log(`  ✓ Direct URL: ${directUrl}`);
    return directUrl;

  } catch (error) {
    console.log(`  ✗ Error: ${error.message}`);
    return null;
  }
}

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const imagesDir = path.join(__dirname, '..', 'public', 'images', 'about');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    const filepath = path.join(imagesDir, filename);
    const file = fs.createWriteStream(filepath);

    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://commons.wikimedia.org/' } }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        return downloadImage(response.headers.location, filename).then(resolve).catch(reject);
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed: ${response.statusCode}`));
        return;
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`  ✓ Downloaded: ${filename}`);
        resolve(filepath);
      });
    }).on('error', reject);

    file.on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function main() {
  console.log('=== Wikipedia Image Fetcher for GuidaPatrimonio ===\n');

  for (const search of searches) {
    const imageUrl = await getImageUrl(search.slug);

    if (imageUrl) {
      try {
        await downloadImage(imageUrl, `${search.filename}.jpg`);
        console.log(`\n✓ Image saved to public/images/about/${search.filename}.jpg`);
        break; // Stop after first successful download
      } catch (error) {
        console.log(`  ✗ Download failed: ${error.message}`);
      }
    }

    // Wait a bit between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

main();
