// Writes each inner page's real content and structured data into its built HTML.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
await import(pathToFileURL(path.join(root, 'public/js/data.js')).href);
const entry = fs.readdirSync(path.join(root, '.ssr')).find((f) => /^entry-server.*\.(m?js)$/.test(f));
const { PAGES } = await import(pathToFileURL(path.join(root, '.ssr', entry)).href);

for (const [file, page] of Object.entries(PAGES)) {
  const target = path.join(root, 'dist', file);
  const html = fs.readFileSync(target, 'utf8');
  if (!html.includes('<div id="root"></div>')) throw new Error(`No empty root in ${file}`);
  const schema = JSON.stringify(page.schema()).replace(/</g, '\\u003c');
  const out = html
    .replace('<div id="root"></div>', () => `<div id="root">${page.render()}</div>`)
    .replace('</head>', () => `<script type="application/ld+json">${schema}</script>\n</head>`);
  fs.writeFileSync(target, out);
  console.log(`prerendered ${file}: ${Math.round(out.length / 1024)} KB`);
}
fs.rmSync(path.join(root, '.ssr'), { recursive: true, force: true });
