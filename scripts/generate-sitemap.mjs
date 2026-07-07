// public/sitemap.xml dosyasını, calculatorRegistry.js'deki hesaplayıcılardan ve
// content/rehber/ altındaki yazılardan otomatik üretir. Elle düzenlemeyin.
// Not: bu script'in "generate:rehber" script'inden SONRA çalışması gerekir (package.json build sırasına bakın),
// çünkü rehber yazılarını src/data/rehberYazilari.generated.js dosyasından okur.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { calculators } from '../src/data/calculatorRegistry.js';
import { rehberYazilari } from '../src/data/rehberYazilari.generated.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outFile = path.join(root, 'public', 'sitemap.xml');

const SITE_URL = 'https://hesapnokta.com';

function main() {
  const urls = [
    '/',
    ...calculators.map((c) => `/${c.id}`),
    '/rehber',
    ...rehberYazilari.map((post) => `/rehber/${post.slug}`),
  ];

  const body = urls.map((url) => `  <url><loc>${SITE_URL}${url}</loc></url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

  fs.writeFileSync(outFile, xml);
  console.log(`✓ sitemap.xml üretildi: ${urls.length} URL (${outFile}).`);
}

main();
