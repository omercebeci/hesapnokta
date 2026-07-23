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

// react-dom/server'ın renderToPipeableStream'i (App.jsx'teki tüm sayfa route'ları
// React.lazy() ile yüklendiği için) onAllReady'de bile bazen Suspense boundary'sini
// "askıda" biçimde yazar: görünür konumda boş bir <template> yer tutucu bırakır,
// gerçek (çözülmüş) içeriği sayfanın sonuna gizli bir <div hidden> içine koyar ve
// bunları DOM'da yer değiştiren bir $RC(...) betiği ekler — bu mekanizma gerçek bir
// ağ üzerinden akan yanıt için tasarlanmıştır, tek seferlik statik bir dosya için değil.
// Bu haliyle bırakılırsa: JS çalışmayan/geç çalışan istemcilerde (bazı crawler'lar,
// yavaş bağlantılar) gerçek içerik hiç görünmeyebilir, ayrıca $RC betiği tarayıcıda
// requestAnimationFrame ile zamanlandığından React'in hydrateRoot'uyla gereksiz
// yere yarışabilir. Prerender çıktısını CI'da/tarayıcıda test ederken bu, gerçek
// kök nedenle (bkz. vercel.json "cleanUrls" düzeltmesi — temiz URL'lerin yanlış
// sayfanın statik dosyasına düşmesi) karışabilecek ayrı bir kırılganlık kaynağıydı;
// derleme zamanında burada çözüp tamamen düz statik HTML üretiyoruz.
export function resolveSuspenseReplay(html) {
  const rcCallPattern = /\$RC\("(B:\d+)","(S:\d+)"\)/g;
  const pairs = [...html.matchAll(rcCallPattern)].map((match) => [match[1], match[2]]);
  if (pairs.length === 0) return html;

  let result = html;

  for (const [boundaryId, slotId] of pairs) {
    const slotOpenTag = `<div hidden id="${slotId}">`;
    const slotStart = result.indexOf(slotOpenTag);
    if (slotStart === -1) continue;

    let depth = 1;
    let cursor = slotStart + slotOpenTag.length;
    while (depth > 0) {
      const nextOpen = result.indexOf('<div', cursor);
      const nextClose = result.indexOf('</div>', cursor);
      if (nextClose === -1) break;
      if (nextOpen !== -1 && nextOpen < nextClose) {
        depth += 1;
        cursor = nextOpen + 4;
      } else {
        depth -= 1;
        cursor = nextClose + 6;
      }
    }
    const slotEnd = cursor;
    const resolvedContent = result.slice(slotStart + slotOpenTag.length, slotEnd - '</div>'.length);

    // Önce (belgede daha sonra konumlanan) gizli slot'u kaldır, sonra
    // (daha önce konumlanan) boundary yer tutucusunu değiştir — aksi halde
    // ilk değiştirme, henüz hesaplanmış slot indekslerini kaydırır.
    result = result.slice(0, slotStart) + result.slice(slotEnd);

    const boundaryPattern = new RegExp(`<!--\\$\\?-->[\\s\\S]*?<template id="${boundaryId}"><\\/template>[\\s\\S]*?<!--\\/\\$-->`);
    result = result.replace(boundaryPattern, `<!--$-->${resolvedContent}<!--/$-->`);
  }

  // Artık kullanılmayan replay betiklerini temizle ($RT zamanlama betiği + $RB/$RV/$RC
  // tanımı ve çağrıları içeren betik).
  result = result.replace(/<script>requestAnimationFrame\(function\(\)\{\$RT=performance\.now\(\)\}\);<\/script>/g, '');
  result = result.replace(/<script>\$RB=\[\];\$RV=function[\s\S]*?\$RC\("B:\d+","S:\d+"\)(?:;\$RC\("B:\d+","S:\d+"\))*<\/script>/g, '');

  return result;
}

function buildHeadHtml(head) {
  if (!head) return '';
  const canonicalUrl = `${SITE_URL}${head.path === '/' ? '/' : head.path}`;
  const imageUrl = `${SITE_URL}${head.image || '/og-image.png'}`;
  const parts = [
    `<title>${escapeHtml(head.title)}</title>`,
    `<meta name="description" content="${escapeHtml(head.description)}" />`,
    `<link rel="canonical" href="${canonicalUrl}" />`,
    `<meta property="og:title" content="${escapeHtml(head.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(head.description)}" />`,
    `<meta property="og:url" content="${canonicalUrl}" />`,
    `<meta property="og:image" content="${imageUrl}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="HesapNokta" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(head.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(head.description)}" />`,
    `<meta name="twitter:image" content="${imageUrl}" />`,
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
    '/hakkinda',
    '/iletisim',
    '/gizlilik-politikasi',
  ];
  let count = 0;

  for (const url of routes) {
    const { html, head } = await render(url);
    const resolvedHtml = resolveSuspenseReplay(html);
    const finalHtml = template
      .replace('<!--app-html-->', resolvedHtml)
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

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
