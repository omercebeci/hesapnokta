// Tutar/para alanları için canlı binlik ayıracı biçimlendirme yardımcıları.
// Kural: nokta HER ZAMAN binlik ayıracıdır, virgül HER ZAMAN ondalık ayıracıdır —
// bu iki karakter asla karıştırılmaz (bkz. AmountInput.jsx).

// Ham değeri (ör. "1234567" veya "1234567,89") ekranda gösterilecek, binlik
// ayıracı eklenmiş hale çevirir (ör. "1.234.567" / "1.234.567,89").
export function formatAmountDisplay(rawValue) {
  if (rawValue == null) return '';
  const str = String(rawValue);
  if (str === '') return '';

  const negative = str.startsWith('-');
  const body = negative ? str.slice(1) : str;

  const commaIndex = body.indexOf(',');
  const intPart = commaIndex === -1 ? body : body.slice(0, commaIndex);
  const decPart = commaIndex === -1 ? undefined : body.slice(commaIndex + 1);

  const digits = intPart.replace(/\D/g, '');
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const sign = negative ? '-' : '';

  return decPart !== undefined ? `${sign}${grouped},${decPart}` : `${sign}${grouped}`;
}

// Kullanıcının o an yazdığı/yapıştırdığı (binlik nokta içerebilen) metni, hesap
// motoruna ve URL'e giden HAM sayı biçimine çevirir: binlik noktaları temizler,
// tek bir ondalık virgülü korur. Nokta her zaman binlik kabul edilir (ondalık
// olarak asla yorumlanmaz) — bu yüzden yapıştırılan İngilizce ondalık noktalı
// değerler de (ör. "1234.56") binlik ayıracı gibi ele alınır.
export function normalizeAmountText(text) {
  if (text == null) return '';
  let str = String(text).replace(/\s/g, '');
  if (str === '') return '';

  const negative = str.startsWith('-');
  if (negative) str = str.slice(1);
  str = str.replace(/[^0-9.,]/g, '');

  const commaIndex = str.lastIndexOf(',');
  const intRaw = commaIndex === -1 ? str : str.slice(0, commaIndex);
  const decRaw = commaIndex === -1 ? undefined : str.slice(commaIndex + 1);

  const intPart = intRaw.replace(/\D/g, '');
  const decPart = decRaw !== undefined ? decRaw.replace(/\D/g, '') : undefined;

  if (intPart === '' && decPart === undefined) return negative ? '-' : '';

  const sign = negative ? '-' : '';
  return decPart !== undefined ? `${sign}${intPart},${decPart}` : `${sign}${intPart}`;
}

// Biçimlendirme sırasında eklenen/çıkarılan "." karakterleri dışındaki tüm
// karakterleri sayarak imlecin yeni metindeki karşılık gelen konumunu bulur —
// kullanıcı yazarken imleç zıplamaz.
export function mapCaretPosition(oldText, oldCaret, newText) {
  let significantBeforeCaret = 0;
  const caret = Math.max(0, Math.min(oldCaret, oldText.length));
  for (let i = 0; i < caret; i++) {
    if (oldText[i] !== '.') significantBeforeCaret++;
  }

  if (significantBeforeCaret <= 0) return 0;

  let count = 0;
  for (let i = 0; i < newText.length; i++) {
    if (newText[i] !== '.') {
      count++;
      if (count === significantBeforeCaret) return i + 1;
    }
  }
  return newText.length;
}
