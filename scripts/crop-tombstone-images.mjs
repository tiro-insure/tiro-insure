import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const outputDirectory = 'public/images/tombstones';
const crops = [
  ['baby-kemi', 2, 25, 62, 300, 405], ['baby-butterfly', 2, 335, 62, 294, 382], ['baby-sibaba', 2, 630, 314, 292, 386],
  ['molise', 3, 35, 75, 194, 365], ['curtain', 3, 245, 75, 210, 365], ['chapel', 3, 465, 75, 210, 365], ['faro', 3, 685, 75, 210, 365],
  ['house-prestige', 3, 30, 460, 276, 365], ['nteso', 3, 320, 462, 275, 365], ['minzi', 3, 630, 455, 275, 365],
  ['jonker', 4, 30, 50, 370, 415], ['faku-full', 4, 480, 80, 390, 390], ['nteso-full', 4, 35, 460, 410, 390], ['tlhabanello', 4, 490, 790, 405, 360],
  ['moiloole', 5, 25, 70, 380, 350], ['gimma', 5, 475, 70, 400, 350], ['lebona', 5, 20, 440, 425, 350], ['chapel-full', 5, 520, 450, 375, 350],
  ['brizollari', 6, 20, 55, 450, 420], ['premium-curtain', 6, 500, 55, 410, 420], ['mayor-double', 6, 25, 480, 450, 365], ['statai', 6, 490, 480, 410, 365],
  ['bonanza', 8, 55, 45, 390, 585], ['marble-shrine', 8, 505, 45, 385, 585], ['cremation-vase', 8, 45, 670, 400, 520],
  // Tight crop isolating just the monument (no brochure price/name overlays), used for the homepage hero slider.
  ['marble-shrine-hero', 8, 745, 163, 158, 482],
];

await mkdir(outputDirectory, { recursive: true });
for (const [name, page, x, y, width, height] of crops) {
  const image = await loadImage(`tmp-brochure/page-${page}.png`);
  const canvas = createCanvas(width, height);
  canvas.getContext('2d').drawImage(image, x, y, width, height, 0, 0, width, height);
  await writeFile(join(outputDirectory, `${name}.webp`), await canvas.encode('webp', 82));
}
