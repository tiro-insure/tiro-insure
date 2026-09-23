import { writeFile } from 'node:fs/promises';
import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';

const sheet = await loadImage('public/brand/campaigns/a_clean_grid_style_advertisement_poster_layout_s.png');

// Cell 3 (top-right): "From R60 a month." — crop into its own standalone image.
const CELL_X = 683, CELL_Y = 0, CELL_W = 341, CELL_H = 768;
const canvas = createCanvas(CELL_W, CELL_H);
const ctx = canvas.getContext('2d');
ctx.drawImage(sheet, CELL_X, CELL_Y, CELL_W, CELL_H, 0, 0, CELL_W, CELL_H);

// 1) Patch over "R60" and draw "R147" in the same red, same position/baseline.
const toLocalX = (absX) => absX - CELL_X;
const toLocalY = (absY) => absY - CELL_Y;

ctx.fillStyle = 'rgb(253,253,254)';
ctx.fillRect(toLocalX(688), toLocalY(108), 220, 88);

ctx.textBaseline = 'alphabetic';
ctx.fillStyle = '#e51729';
const targetBottom = toLocalY(183);
const targetLeft = toLocalX(702);
const fontSize = 95;
ctx.font = `bold ${fontSize}px Bahnschrift`;
const m = ctx.measureText('R147');
console.log('capHeight', m.actualBoundingBoxAscent, 'width', m.width);
ctx.fillText('R147', targetLeft, targetBottom);

// 2) Recolor the chevron from red to blue via HSL hue shift (keeps original saturation/lightness so anti-aliasing stays smooth).
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s; const l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h *= 60;
  }
  return [h, s, l];
}
function hslToRgb(h, s, l) {
  h /= 360;
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  let r, g, b;
  if (s === 0) { r = g = b = l; }
  else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

const bx = toLocalX(855), by = toLocalY(390), bw = 1005 - 855, bh = 580 - 390;
const region = ctx.getImageData(bx, by, bw, bh);
const data = region.data;
const TARGET_HUE = 218.3;
for (let p = 0; p < data.length; p += 4) {
  const r = data[p], g = data[p + 1], b = data[p + 2];
  const [h, s, l] = rgbToHsl(r, g, b);
  const hueDist = Math.min(Math.abs(h - 354), 360 - Math.abs(h - 354));
  if (hueDist <= 18 && s > 0.55 && l > 0.35 && l < 0.9) {
    const [nr, ng, nb] = hslToRgb(TARGET_HUE, s, l);
    data[p] = nr; data[p + 1] = ng; data[p + 2] = nb;
  }
}
ctx.putImageData(region, bx, by);

await writeFile('public/brand/campaigns/tombstone-lay-by-poster.png', await canvas.encode('png'));
console.log('done', fontSize);
