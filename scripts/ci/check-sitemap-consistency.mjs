// dist/sitemap.xml içindeki URL listesi ile dist/ altında build'de üretilen
// statik sayfa (index.html) listesini karşılaştırır; iki taraf birebir
// örtüşmüyorsa farkı raporlar (bkz. .github/workflows/haftalik-saglik-kontrolu.yml).
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const distDir = path.join(root, 'dist');
const sitemapPath = path.join(distDir, 'sitemap.xml');
const reportDir = path.join(root, 'ci-reports');
const SITE_URL = 'https://hesapnokta.com';

function walkPages(dir, base, pages = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkPages(full, path.join(base, entry.name), pages);
    } else if (entry.name === 'index.html') {
      const route = base === '' ? '/' : `/${base.split(path.sep).join('/')}`;
      pages.push(route);
    }
  }
  return pages;
}

function main() {
  if (!fs.existsSync(sitemapPath)) {
    console.error('dist/sitemap.xml bulunamadı; bu kontrolden önce build alınmış olmalı.');
    process.exit(1);
  }

  const xml = fs.readFileSync(sitemapPath, 'utf-8');
  const locMatches = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const sitemapPaths = new Set(locMatches.map((url) => url.replace(SITE_URL, '') || '/'));
  const distPages = new Set(walkPages(distDir, ''));

  const onlyInSitemap = [...sitemapPaths].filter((p) => !distPages.has(p)).sort();
  const onlyInDist = [...distPages].filter((p) => !sitemapPaths.has(p)).sort();

  if (onlyInSitemap.length === 0 && onlyInDist.length === 0) {
    console.log(`✅ Sitemap (${sitemapPaths.size} URL) ve üretilen statik sayfalar (${distPages.size} sayfa) tutarlı.`);
    process.exit(0);
  }

  const lines = [`Sitemap'te **${sitemapPaths.size}** URL, dist/ altında **${distPages.size}** statik sayfa var.`];
  if (onlyInSitemap.length > 0) {
    lines.push('', 'Sitemap\'te olup statik sayfası üretilmemiş URL\'ler:');
    onlyInSitemap.forEach((p) => lines.push(`- \`${p}\``));
  }
  if (onlyInDist.length > 0) {
    lines.push('', 'Statik sayfası üretilip sitemap\'te olmayan URL\'ler:');
    onlyInDist.forEach((p) => lines.push(`- \`${p}\``));
  }

  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(path.join(reportDir, 'sitemap.md'), `${lines.join('\n')}\n`);
  console.log(`❌ Sitemap tutarsızlığı:\n${lines.join('\n')}`);
  process.exit(1);
}

main();
