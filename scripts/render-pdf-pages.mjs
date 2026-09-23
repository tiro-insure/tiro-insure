import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createCanvas } from '@napi-rs/canvas';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const [source, outputDirectory] = process.argv.slice(2);
if (!source || !outputDirectory) throw new Error('Pass a PDF path and output directory.');

await mkdir(outputDirectory, { recursive: true });
const document = await getDocument({ data: new Uint8Array(await readFile(source)), useWorkerFetch: false, isEvalSupported: false }).promise;
for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
  const page = await document.getPage(pageNumber);
  const viewport = page.getViewport({ scale: 1.6 });
  const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
  await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
  await writeFile(join(outputDirectory, `page-${pageNumber}.png`), await canvas.encode('png'));
}
