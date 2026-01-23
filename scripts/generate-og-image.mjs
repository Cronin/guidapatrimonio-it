#!/usr/bin/env node
/**
 * Generate OpenGraph image for guidapatrimonio.it using Gemini AI
 */

import { GoogleGenAI, Modality } from '@google/genai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get API key from environment or .env.local
const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('Error: GOOGLE_GEMINI_API_KEY not found');
  console.log('Set it with: export GOOGLE_GEMINI_API_KEY=your_key');
  process.exit(1);
}

async function generateOGImage() {
  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  const prompt = `Create a professional OpenGraph image (1200x630 pixels) for a wealth management consultancy website.

Design requirements:
- Dark green background color (#1a3a2f or similar elegant dark green)
- Clean, minimalist, and luxurious design suitable for high-net-worth individuals
- Include a stylized tree icon/symbol in the center (representing growth, heritage, family wealth)
- Text "GuidaPatrimonio.it" in elegant white serif font, prominently displayed
- Tagline below: "Consulenza Patrimoniale per Grandi Patrimoni" in smaller white text
- Subtle gold or copper accents for elegance
- Professional financial/wealth management aesthetic
- No photos of people, just elegant abstract design
- The overall feel should be: trustworthy, sophisticated, established, exclusive

The image should look like a premium financial services brand targeting wealthy families and individuals seeking patrimony planning and wealth management services in Italy.`;

  console.log('Generating OG image with Gemini...');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: prompt,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    // Extract image from response
    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const imageBuffer = Buffer.from(part.inlineData.data, 'base64');
          const outputPath = path.join(__dirname, '..', 'public', 'og-default.png');

          fs.writeFileSync(outputPath, imageBuffer);
          console.log(`Image saved to: ${outputPath}`);
          console.log(`File size: ${(imageBuffer.length / 1024).toFixed(2)} KB`);
          return true;
        }
      }
    }

    console.error('No image found in response');
    console.log('Response:', JSON.stringify(response, null, 2));
    return false;
  } catch (error) {
    console.error('Error generating image:', error.message);
    if (error.message.includes('not supported')) {
      console.log('\nTrying with imagen-3.0-generate-002...');
      return await generateWithImagen();
    }
    return false;
  }
}

async function generateWithImagen() {
  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  const prompt = `Professional OpenGraph banner image for Italian wealth management consultancy. Dark green background (#1a3a2f). Elegant minimalist design with stylized tree symbol representing patrimony growth. Text "GuidaPatrimonio.it" in white serif font. Tagline "Consulenza Patrimoniale per Grandi Patrimoni". Gold accents. Luxurious sophisticated aesthetic for high-net-worth individuals. 1200x630 pixels aspect ratio.`;

  try {
    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: '16:9', // Closest to 1200x630
        outputMimeType: 'image/png',
      },
    });

    if (response.generatedImages && response.generatedImages[0]) {
      const imageData = response.generatedImages[0].image.imageBytes;
      const imageBuffer = Buffer.from(imageData, 'base64');
      const outputPath = path.join(__dirname, '..', 'public', 'og-default.png');

      fs.writeFileSync(outputPath, imageBuffer);
      console.log(`Image saved to: ${outputPath}`);
      console.log(`File size: ${(imageBuffer.length / 1024).toFixed(2)} KB`);
      return true;
    }

    console.error('No image generated');
    return false;
  } catch (error) {
    console.error('Error with Imagen:', error.message);
    return false;
  }
}

generateOGImage().then(success => {
  if (!success) {
    console.log('\nFailed to generate image with AI.');
    process.exit(1);
  }
});
