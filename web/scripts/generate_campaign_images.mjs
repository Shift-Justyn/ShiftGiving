import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error('OPENAI_API_KEY is required');
}

const model = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1';
const size = process.env.OPENAI_IMAGE_SIZE || '1792x1024';
const quality = process.env.OPENAI_IMAGE_QUALITY || 'standard';

const root = path.resolve(process.cwd(), 'public/images/campaigns/hope');

const campaigns = [
  {
    name: 'back-to-school',
    files: ['back-to-school/school-1.jpg', 'back-to-school/school-2.jpg', 'back-to-school/school-3.jpg', 'back-to-school/school-4.jpg'],
    prompts: [
      'Photorealistic flat lay of school supplies on a clean desk: notebooks, pencils, crayons, markers, erasers, glue sticks, scissors, ruler. No people. No faces. No text. No logos. Soft natural light. 16:9.',
      'Photorealistic backpack and school essentials neatly arranged: backpack, folders, notebook, pencil pouch, pens, calculator, sticky notes. No people. No faces. No text. No logos. 16:9.',
      'Photorealistic close-up of assorted school supplies in a donation bin: pencils, crayons, notebooks, glue, scissors, rulers. No people. No faces. No text. No logos. 16:9.',
      'Photorealistic stack of fresh school supply kits ready for donation: boxed sets, notebooks, pencils, crayons, folders. No people. No faces. No text. No logos. 16:9.',
    ],
  },
  {
    name: 'thanksgiving',
    files: ['thanksgiving/meal-1.jpg', 'thanksgiving/meal-2.jpg', 'thanksgiving/meal-4.jpg', 'thanksgiving-turkey.jpg'],
    prompts: [
      'Photorealistic meal kit packing table with hands placing items into boxes, shot from above so no faces are visible. No faces. No text. No logos. Warm lighting. 16:9.',
      'Photorealistic prepared meal trays lined up on a table ready to distribute. No people. No faces. No text. No logos. 16:9.',
      'Photorealistic close-up of meal kit ingredients and pantry staples arranged neatly: rice, beans, canned vegetables, pasta, sauce, spices. No people. No faces. No text. No logos. 16:9.',
      'Photorealistic baked turkey on a wooden cutting board with warm kitchen lighting. No people. No faces. No text. No logos. 16:9.',
    ],
  },
  {
    name: 'souper-bowl',
    files: ['souper-bowl/soup-1.jpg', 'souper-bowl/soup-5.jpg', 'souper-bowl/soup-6.jpg', 'souper-bowl.jpg'],
    prompts: [
      'Photorealistic stack of canned soups and pantry staples arranged for a food drive. No people. No faces. No text. No logos. 16:9.',
      'Photorealistic pantry shelves stocked with canned goods and boxed foods, clean and organized. No people. No faces. No text. No logos. 16:9.',
      'Photorealistic close-up of donation box filled with nonperishable food items: canned goods, pasta, rice, peanut butter. No people. No faces. No text. No logos. 16:9.',
      'Photorealistic food drive display themed around a big game: canned soup and pantry items with subtle football shape made from cans. No people. No faces. No text. No logos. 16:9.',
    ],
  },
];

const callOpenAI = async (prompt) => {
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      prompt,
      size,
      quality,
      n: 1,
      response_format: 'b64_json',
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text);
  }

  const json = await response.json();
  const b64 = json?.data?.[0]?.b64_json;
  if (!b64) {
    throw new Error('Unexpected image response');
  }
  return Buffer.from(b64, 'base64');
};

const writeJpeg = async (outputPath, pngBytes) => {
  const tmp = `${outputPath}.tmp.png`;
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(tmp, pngBytes);
  await execFileAsync('sips', ['-s', 'format', 'jpeg', tmp, '--out', outputPath]);
  await fs.unlink(tmp);
};

for (const campaign of campaigns) {
  for (let i = 0; i < campaign.files.length; i += 1) {
    const out = path.join(root, campaign.files[i]);
    const png = await callOpenAI(campaign.prompts[i]);
    await writeJpeg(out, png);
    process.stdout.write(`saved ${campaign.name} ${out}\n`);
  }
}
