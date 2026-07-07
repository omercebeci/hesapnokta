// content/rehber/*.md dosyalarını okuyup src/data/rehberYazilari.generated.js dosyasını üretir.
// Yeni bir rehber yazısı eklemek için: content/rehber/ klasörüne yeni bir .md dosyası ekleyip
// commit + push yapmanız yeterlidir (bkz. README.md "Yeni rehber yazısı ekleme" bölümü).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { marked } from 'marked';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const contentDir = path.join(root, 'content', 'rehber');
const outFile = path.join(root, 'src', 'data', 'rehberYazilari.generated.js');

const WORDS_PER_MINUTE = 200;

function slugFromFilename(filename) {
  return filename.replace(/\.md$/, '');
}

function main() {
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }

  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith('.md'));
  const posts = files.map((filename) => {
    const raw = fs.readFileSync(path.join(contentDir, filename), 'utf-8');
    const { data, content } = matter(raw);
    const contentHtml = marked.parse(content);
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

    if (!data.title || !data.date) {
      throw new Error(`content/rehber/${filename}: "title" ve "date" alanları (frontmatter) zorunludur.`);
    }

    return {
      slug: slugFromFilename(filename),
      title: data.title,
      description: data.description || '',
      date: data.date,
      category: data.category || 'Genel',
      relatedCalculators: Array.isArray(data.relatedCalculators) ? data.relatedCalculators : [],
      contentHtml,
      readingMinutes: Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE)),
    };
  });

  posts.sort((a, b) => (a.date < b.date ? 1 : -1));

  const fileContents = `// Bu dosya otomatik üretilir (bkz. scripts/generate-rehber.mjs). Elle düzenlemeyin;
// içerik değişiklikleri için content/rehber/ altındaki .md dosyalarını güncelleyin.
export const rehberYazilari = ${JSON.stringify(posts, null, 2)};

export function getRehberYazisiBySlug(slug) {
  return rehberYazilari.find((post) => post.slug === slug);
}

export function getRehberYazilariByCalculatorId(calculatorId) {
  return rehberYazilari.filter((post) => post.relatedCalculators.includes(calculatorId));
}
`;

  fs.writeFileSync(outFile, fileContents);
  console.log(`✓ ${posts.length} rehber yazısı işlendi (${outFile}).`);
}

main();
