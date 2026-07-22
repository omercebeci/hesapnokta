// Türkçe karakter/büyük-küçük harf duyarsız arama normalizasyonu. 'tr-TR' locale'i
// İ→i ve I→ı gibi Türkçe'ye özgü küçültme kurallarını doğru uygular (Intl/ICU destekli).
export function normalizeSearchText(text = '') {
  return text.toLocaleLowerCase('tr-TR').trim();
}

// Her alana göre farklı ağırlık: başlıkta geçen bir kelime, açıklamada geçenden daha
// alakalı sayılır. Sıralama bu skora göre yapılır; kategoriye göre gruplama yapılmaz —
// tek, düz bir sonuç listesi döner.
const FIELD_WEIGHT = { title: 3, keywords: 2, description: 1 };
const TITLE_STARTS_WITH_BONUS = 2;

export function searchCalculators(calculators, query) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return [];

  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];

  const scored = [];

  for (const item of calculators) {
    const title = normalizeSearchText(item.title || '');
    const keywords = normalizeSearchText((item.keywords || []).join(' '));
    const description = normalizeSearchText(item.description || '');

    let score = 0;
    let matchesAllTokens = true;

    for (const token of tokens) {
      const inTitle = title.includes(token);
      const inKeywords = keywords.includes(token);
      const inDescription = description.includes(token);

      if (!inTitle && !inKeywords && !inDescription) {
        matchesAllTokens = false;
        break;
      }

      if (inTitle) score += FIELD_WEIGHT.title;
      if (inKeywords) score += FIELD_WEIGHT.keywords;
      if (inDescription) score += FIELD_WEIGHT.description;
      if (title.startsWith(token)) score += TITLE_STARTS_WITH_BONUS;
    }

    if (matchesAllTokens) {
      scored.push({ item, score });
    }
  }

  // Array.prototype.sort kararlıdır (stable): eşit skorlu sonuçlar arasında
  // registry'deki orijinal sıra korunur.
  return scored.sort((a, b) => b.score - a.score).map((entry) => entry.item);
}
