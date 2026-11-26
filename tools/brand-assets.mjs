import sharp from 'sharp';
import fs from 'node:fs';
const SRC = '/Users/shad/Downloads/SAKOOON logo.png';
const OUT = '/Users/shad/sakooon-wt/integration/assets';
const GREEN = [0x20, 0x48, 0x30], PAPER = [0xF5, 0xF2, 0xEC];
const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height;
// alpha from darkness: white -> 0, brand green -> 255
const lumGreen = 0.2126 * GREEN[0] + 0.7152 * GREEN[1] + 0.0722 * GREEN[2];
function tinted(rgb) {
  const out = Buffer.alloc(W * H * 4);
  for (let p = 0; p < W * H; p++) {
    const r = data[p * 3], g = data[p * 3 + 1], b = data[p * 3 + 2];
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    let a = (255 - lum) / (255 - lumGreen); a = Math.max(0, Math.min(1, a)); a = a < 0.06 ? 0 : (a - 0.06) / 0.94;
    out[p * 4] = rgb[0]; out[p * 4 + 1] = rgb[1]; out[p * 4 + 2] = rgb[2]; out[p * 4 + 3] = Math.round(a * 255);
  }
  return out;
}
function bbox(y0, y1) {
  let minx = W, maxx = 0;
  for (let y = y0; y <= y1; y++) for (let x = 0; x < W; x++) { const p = (y * W + x) * 3; if (data[p] + data[p + 1] + data[p + 2] < 600) { if (x < minx) minx = x; if (x > maxx) maxx = x; } }
  return { left: minx, top: y0, width: maxx - minx + 1, height: y1 - y0 + 1 };
}
const regions = { stacked: bbox(184, 1046), mark: bbox(184, 862), wordmark: bbox(900, 986), tagline: bbox(1016, 1049) };
console.log(regions);
const pad = (r, p) => ({ left: Math.max(0, r.left - p), top: Math.max(0, r.top - p), width: Math.min(W - Math.max(0, r.left - p), r.width + 2 * p), height: Math.min(H - Math.max(0, r.top - p), r.height + 2 * p) });
const green = tinted(GREEN), paper = tinted(PAPER);
async function emit(buf, region, name, width) {
  const img = sharp(buf, { raw: { width: W, height: H, channels: 4 } }).extract(pad(region, 6));
  if (width) img.resize({ width });
  const out = await img.png({ compressionLevel: 9, palette: true }).toBuffer();
  fs.writeFileSync(`${OUT}/${name}.png`, out); const m = await sharp(out).metadata(); console.log(name, m.width, m.height, out.length);
}
await emit(green, regions.stacked, 'sakooon-logo-stacked', 640);
await emit(paper, regions.stacked, 'sakooon-logo-stacked-light', 640);
await emit(green, regions.wordmark, 'sakooon-wordmark', 640);
await emit(paper, regions.wordmark, 'sakooon-wordmark-light', 640);
await emit(green, regions.mark, 'sakooon-mark', 480);
await emit(paper, regions.mark, 'sakooon-mark-light', 480);
// favicons: paper mark on brand green
const markLight = await sharp(paper, { raw: { width: W, height: H, channels: 4 } }).extract(pad(regions.mark, 0)).png().toBuffer();
for (const size of [32, 180, 512]) {
  const inner = Math.round(size * 0.82);
  const mark = await sharp(markLight).resize({ width: inner, height: inner, fit: 'inside' }).toBuffer();
  const out = await sharp({ create: { width: size, height: size, channels: 4, background: { r: GREEN[0], g: GREEN[1], b: GREEN[2], alpha: 1 } } })
    .composite([{ input: mark, gravity: 'centre' }]).png({ compressionLevel: 9, palette: true }).toBuffer();
  fs.writeFileSync(`${OUT}/sakooon-favicon-${size}.png`, out); console.log('favicon', size, out.length);
}
