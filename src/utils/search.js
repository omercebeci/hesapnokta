export function normalizeSearchText(text = '') {
  return text.toLocaleLowerCase('tr-TR').trim();
}

export function searchCalculators(calculators, query) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return [];

  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);

  return calculators.filter((item) => {
    const haystack = normalizeSearchText(`${item.title} ${item.description} ${(item.keywords || []).join(' ')}`);
    return tokens.every((token) => haystack.includes(token));
  });
}
