import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file
config({ path: path.join(__dirname, '../.env') });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const images = [
  {
    name: 'Back-to-School Backpacks',
    prompt: 'A vibrant, cheerful photograph of colorful school backpacks - featuring pink and blue backpacks prominently. The backpacks are new and ready for school, arranged in an appealing composition. Bright, clean background with good lighting. Professional product photography style. No people visible.',
    outputPath: '../public/images/campaigns/hope/back-to-school/school-3.jpg',
  },
  {
    name: 'Thanksgiving Mashed Potatoes',
    prompt: 'A beautiful, appetizing photograph of a bowl of creamy mashed potatoes with golden butter melting on top and a drizzle of rich gravy. Shot from a slightly elevated angle with warm, inviting lighting. Professional food photography style. Thanksgiving themed. No people visible.',
    outputPath: '../public/images/campaigns/hope/thanksgiving-meals/meal-1.jpg',
  },
  {
    name: 'Thanksgiving Stuffing',
    prompt: 'A delicious photograph of traditional Thanksgiving stuffing (dressing) in a rustic serving bowl. The stuffing is golden brown with visible herbs, celery, and bread cubes. Warm, cozy lighting. Professional food photography style. No people visible.',
    outputPath: '../public/images/campaigns/hope/thanksgiving-meals/meal-2.jpg',
  },
  {
    name: 'Thanksgiving Green Beans',
    prompt: 'A vibrant photograph of fresh green bean casserole in a white serving dish, topped with crispy fried onions. The green beans are tender and appetizing with a creamy sauce. Professional food photography with warm Thanksgiving lighting. No people visible.',
    outputPath: '../public/images/campaigns/hope/thanksgiving-meals/meal-3.jpg',
  },
];

async function generateImage(imageConfig) {
  try {
    console.log(`\nGenerating: ${imageConfig.name}...`);
    
    const response = await openai.images.generate({
      model: process.env.OPENAI_IMAGE_MODEL || 'dall-e-3',
      prompt: imageConfig.prompt,
      size: '1792x1024',
      quality: 'standard',
      n: 1,
    });

    const imageUrl = response.data[0].url;
    console.log(`  ✓ Image generated, downloading...`);

    const imageResponse = await fetch(imageUrl);
    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const outputPath = path.join(__dirname, imageConfig.outputPath);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, buffer);

    console.log(`  ✓ Saved to: ${outputPath}`);
    
    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 2000));
  } catch (error) {
    console.error(`  ✗ Error generating ${imageConfig.name}:`, error.message);
    throw error;
  }
}

async function generateAllImages() {
  console.log('=== Hope Campaign Image Generator ===');
  console.log(`Generating ${images.length} images...\n`);
  
  for (const imageConfig of images) {
    await generateImage(imageConfig);
  }
  
  console.log('\n✓ All images generated successfully!');
}

generateAllImages().catch(error => {
  console.error('\n✗ Generation failed:', error.message);
  process.exit(1);
});
