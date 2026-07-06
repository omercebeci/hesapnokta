// Türkiye locale (1.234,56) sayı biçimlendirme ve ayrıştırma yardımcıları.

const trNumber = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2, minimumFractionDigits: 0 });
const trCurrency = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 2 });
const trInteger = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 });

export function formatNumber(value, { decimals = 2 } = {}) {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);
}

export function formatInteger(value) {
  if (!Number.isFinite(value)) return '—';
  return trInteger.format(Math.round(value));
}

export function formatCurrency(value) {
  if (!Number.isFinite(value)) return '—';
  return trCurrency.format(value);
}

export function formatPercent(value, { decimals = 1 } = {}) {
  if (!Number.isFinite(value)) return '—';
  return `%${formatNumber(value, { decimals })}`;
}

// Kullanıcı "1.234,56" ya da "1234.56" yazabilir; ikisini de sayıya çevirir.
export function parseLocaleNumber(raw) {
  if (typeof raw === 'number') return raw;
  if (!raw && raw !== 0) return NaN;

  const trimmed = String(raw).trim();
  if (trimmed === '') return NaN;

  const hasComma = trimmed.includes(',');
  const hasDot = trimmed.includes('.');

  let normalized = trimmed;
  if (hasComma && hasDot) {
    // "1.234,56" biçimi: nokta binlik ayıracı, virgül ondalık ayıracı
    normalized = trimmed.replace(/\./g, '').replace(',', '.');
  } else if (hasComma) {
    // "1234,56" biçimi: virgül ondalık ayıracı
    normalized = trimmed.replace(',', '.');
  }
  // sadece nokta varsa zaten geçerli JS sayı biçimi olarak kabul edilir

  const value = Number(normalized);
  return value;
}

export function isPositiveNumber(value) {
  return Number.isFinite(value) && value > 0;
}

export function isNonNegativeNumber(value) {
  return Number.isFinite(value) && value >= 0;
}
