import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file from web directory
config({ path: path.join(__dirname, '../.env') });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const prompt = `A clean, professional calendar page with a specific date circled in red. On that date, there is text that reads "Cancer Screening" with a large red checkmark next to it. The calendar should look modern and healthcare-themed, with subtle pink ribbon (cancer awareness) elements in the background. The overall mood should be hopeful and encouraging. Photorealistic style.`;

async function generateImage() {
  try {
    console.log('Generating Birthday Matters campaign image...');
    
    const response = await openai.images.generate({
      model: process.env.OPENAI_IMAGE_MODEL || 'dall-e-3',
      prompt,
      size: '1792x1024',
      quality: 'standard',
      n: 1,
    });

    const imageUrl = response.data[0].url;
    console.log('Image generated, downloading...');

    const imageResponse = await fetch(imageUrl);
    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const outputPath = path.join(__dirname, '../public/images/campaigns/campaign-9-cancer-screening.jpg');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, buffer);

    console.log(`✓ Saved to: ${outputPath}`);
  } catch (error) {
    console.error('Error generating image:', error.message);
    process.exit(1);
  }
}

generateImage();
