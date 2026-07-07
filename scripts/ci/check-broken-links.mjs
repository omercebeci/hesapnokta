// dist/ altındaki statik HTML sayfalarında iç linkleri (href="/...") tarar; hedef
// sayfa dist/ içinde bulunamıyorsa "kırık iç link" olarak raporlar. Dış linkler
// (http/https ile başlayanlar) taranmaz — bunlar yanlış alarm üretebileceğinden
// kapsam dışı tutulur (bkz. .github/workflows/haftalik-saglik-kontrolu.yml).
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const distDir = path.join(root, 'dist');
const reportDir = path.join(root, 'ci-reports');

// Uzantısı olan bir yol ise (sitemap.xml, ads.txt, favicon.svg gibi) doğrudan o
// dosyaya, yoksa "temiz URL" mantığıyla altındaki index.html'e bakılır.
const STATIC_EXTENSION = /\.[a-z0-9]{2,5}$/i;

function walkHtmlFiles(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkHtmlFiles(full, files);
    else if (entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

function resolveInternalPath(href) {
  const clean = href.split('#')[0].split('?')[0];
  if (!clean || clean === '/') return path.join(distDir, 'index.html');
  if (STATIC_EXTENSION.test(clean)) return path.join(distDir, clean);
  return path.join(distDir, clean, 'index.html');
}

function main() {
  if (!fs.existsSync(distDir)) {
    console.error('dist/ bulunamadı; bu kontrolden önce build alınmış olmalı.');
    process.exit(1);
  }

  const htmlFiles = walkHtmlFiles(distDir);
  const hrefPattern = /<a\b[^>]*\bhref="([^"]+)"/gi;
  const brokenMap = new Map(); // href -> Set(referans veren dosyalar)

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf-8');
    let match;
    while ((match = hrefPattern.exec(html))) {
      const href = match[1];
      if (!href.startsWith('/') || href.startsWith('//')) continue; // yalnızca iç linkler
      const target = resolveInternalPath(href);
      if (!fs.existsSync(target)) {
        const relFile = path.relative(distDir, file);
        if (!brokenMap.has(href)) brokenMap.set(href, new Set());
        brokenMap.get(href).add(relFile);
      }
    }
  }

  if (brokenMap.size === 0) {
    console.log(`✅ ${htmlFiles.length} sayfa tarandı, kırık iç link bulunamadı.`);
    process.exit(0);
  }

  const lines = [...brokenMap.entries()].map(([href, files]) => {
    const sample = [...files].slice(0, 3).join(', ');
    return `- \`${href}\` — ${files.size} sayfada referans veriliyor (örnek: ${sample})`;
  });

  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(path.join(reportDir, 'broken-links.md'), `${lines.join('\n')}\n`);
  console.log(`❌ ${brokenMap.size} kırık iç link bulundu:\n${lines.join('\n')}`);
  process.exit(1);
}

main();
