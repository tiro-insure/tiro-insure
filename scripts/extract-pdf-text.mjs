import { readFile } from 'node:fs/promises';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const [source] = process.argv.slice(2);
if (!source) throw new Error('Pass a PDF path.');

const document = await getDocument({ data: new Uint8Array(await readFile(source)), useWorkerFetch: false, isEvalSupported: false }).promise;
for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
  const page = await document.getPage(pageNumber);
  const text = await page.getTextContent();
  const lines = text.items.map((item) => ('str' in item ? item.str : '')).filter(Boolean).join(' ');
  console.log(`\n--- Page ${pageNumber} ---\n${lines}`);
}
