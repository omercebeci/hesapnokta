// Build sonrası çalışır (bkz. package.json "build" script'i): her hesaplayıcı ve ana sayfa için
// gerçek React render çıktısını ve o sayfaya özel SEO etiketlerini statik HTML dosyalarına yazar.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { calculators } from '../src/data/calculatorRegistry.js';
import { rehberYazilari } from '../src/data/rehberYazilari.generated.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');
const ssrEntryPath = path.join(root, 'dist-ssr', 'entry-server.js');

const SITE_URL = 'https://hesapnokta.com';

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildHeadHtml(head) {
  if (!head) return '';
  const canonicalUrl = `${SITE_URL}${head.path === '/' ? '/' : head.path}`;
  const parts = [
    `<title>${escapeHtml(head.title)}</title>`,
    `<meta name="description" content="${escapeHtml(head.description)}" />`,
    `<link rel="canonical" href="${canonicalUrl}" />`,
    `<meta property="og:title" content="${escapeHtml(head.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(head.description)}" />`,
    `<meta property="og:url" content="${canonicalUrl}" />`,
  ];
  for (const entry of head.jsonLd || []) {
    // </script> enjeksiyonunu engellemek için JSON içindeki "<" karakterini kaçışlıyoruz.
    const json = JSON.stringify(entry.data).replace(/</g, '\\u003c');
    parts.push(`<script type="application/ld+json" id="${entry.id}">${json}</script>`);
  }
  return parts.join('\n    ');
}

async function main() {
  if (!fs.existsSync(ssrEntryPath)) {
    console.error(`SSR paketi bulunamadı: ${ssrEntryPath}. Önce "vite build --ssr src/entry-server.jsx --outDir dist-ssr" çalıştırılmalı.`);
    process.exit(1);
  }

  const { render } = await import(pathToFileURL(ssrEntryPath).href);
  const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

  if (!template.includes('<!--app-html-->') || !template.includes('<!--app-head-->')) {
    console.error('dist/index.html içinde <!--app-html--> veya <!--app-head--> yer tutucusu bulunamadı (build minifikasyonu silmiş olabilir).');
    process.exit(1);
  }

  const routes = [
    '/',
    ...calculators.map((c) => `/${c.id}`),
    '/rehber',
    ...rehberYazilari.map((post) => `/rehber/${post.slug}`),
  ];
  let count = 0;

  for (const url of routes) {
    const { html, head } = await render(url);
    const finalHtml = template
      .replace('<!--app-html-->', html)
      .replace('<!--app-head-->', buildHeadHtml(head));

    const outPath = url === '/'
      ? path.join(distDir, 'index.html')
      : path.join(distDir, url.slice(1), 'index.html');

    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, finalHtml);
    count += 1;
  }

  console.log(`✓ ${count} sayfa statik HTML olarak üretildi (prerender tamamlandı).`);
}

main();
