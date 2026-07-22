import { describe, expect, it } from 'vitest';
import { formatAmountDisplay, mapCaretPosition, normalizeAmountText } from './amountInput.js';

describe('formatAmountDisplay', () => {
  it('boş/null değerlerde boş string döner', () => {
    expect(formatAmountDisplay('')).toBe('');
    expect(formatAmountDisplay(null)).toBe('');
    expect(formatAmountDisplay(undefined)).toBe('');
  });

  it('tam sayılara binlik ayıracı ekler', () => {
    expect(formatAmountDisplay('1000000')).toBe('1.000.000');
    expect(formatAmountDisplay('100000')).toBe('100.000');
    expect(formatAmountDisplay('1000')).toBe('1.000');
    expect(formatAmountDisplay('999')).toBe('999');
    expect(formatAmountDisplay('0')).toBe('0');
  });

  it('ondalık virgülü korur, ondalık kısma binlik ayıracı eklemez', () => {
    expect(formatAmountDisplay('1234567,89')).toBe('1.234.567,89');
    expect(formatAmountDisplay('100000,5')).toBe('100.000,5');
    expect(formatAmountDisplay('3,5')).toBe('3,5');
  });

  it('yazarken yarım kalan ondalık girişleri (sonda virgül) korur', () => {
    expect(formatAmountDisplay('100000,')).toBe('100.000,');
    expect(formatAmountDisplay(',')).toBe(',');
  });

  it('negatif değerleri destekler', () => {
    expect(formatAmountDisplay('-1234567')).toBe('-1.234.567');
    expect(formatAmountDisplay('-1234567,5')).toBe('-1.234.567,5');
  });
});

describe('normalizeAmountText', () => {
  it('yazarken eklenen binlik noktalarını temizleyip ham değeri döner', () => {
    expect(normalizeAmountText('1.000.000')).toBe('1000000');
    expect(normalizeAmountText('1.234.567,89')).toBe('1234567,89');
  });

  it('nokta her zaman binlik kabul edilir, ondalık olarak yorumlanmaz', () => {
    // Yapıştırılan "1234.56" (İngilizce ondalık nokta biçimi) bile binlik ayıracı
    // gibi ele alınır — bu bileşenin tek ondalık kuralı virgüldür.
    expect(normalizeAmountText('1234.56')).toBe('123456');
  });

  it('virgülü ondalık ayıracı olarak korur', () => {
    expect(normalizeAmountText('1234,56')).toBe('1234,56');
    expect(normalizeAmountText('3,5')).toBe('3,5');
  });

  it('sayı olmayan karakterleri (boşluk, harf, TL işareti) temizler', () => {
    expect(normalizeAmountText('1.000.000 TL')).toBe('1000000');
    expect(normalizeAmountText(' 100 000 ')).toBe('100000');
  });

  it('yapıştırılan tam biçimli bir tutarı doğru ham değere çevirir', () => {
    expect(normalizeAmountText('1.500.000,75')).toBe('1500000,75');
  });

  it('negatif işareti korur', () => {
    expect(normalizeAmountText('-1.234.567,89')).toBe('-1234567,89');
  });

  it('boş veya sadece ayıraç içeren girdilerde makul bir sonuç döner', () => {
    expect(normalizeAmountText('')).toBe('');
    expect(normalizeAmountText('.')).toBe('');
    expect(normalizeAmountText(',')).toBe(',');
  });

  it('format ↔ normalize gidiş-dönüşü kaybı olmadan korur', () => {
    const raws = ['1000000', '1234567,89', '3,5', '999', '0', '-250000,25'];
    for (const raw of raws) {
      const displayed = formatAmountDisplay(raw);
      expect(normalizeAmountText(displayed)).toBe(raw);
    }
  });
});

describe('mapCaretPosition', () => {
  it('metnin sonuna ekleme yapıldığında imleci sona taşır', () => {
    // "100.000" iken sona "2" yazılınca tarayıcı geçici olarak "100.0002" üretir
    const pos = mapCaretPosition('100.0002', 8, '1.000.002');
    expect(pos).toBe(9); // yeni metnin sonu
  });

  it('imleç başlangıçtaysa 0 döner', () => {
    expect(mapCaretPosition('1.000.000', 0, '1.000.000')).toBe(0);
  });

  it('yeni binlik noktası eklendiğinde imleci doğru şekilde ileri kaydırır', () => {
    // "1000" -> kullanıcı 4. hanenin sonuna yazdı (caret=4), format sonrası "1.000"
    // olur; imleç noktadan sonraki aynı basamağın peşinde olmalı (caret=5).
    const pos = mapCaretPosition('1000', 4, '1.000');
    expect(pos).toBe(5);
  });

  it('ortadan silme (backspace) sonrası imleci doğru konumlar', () => {
    // "1.000.000" görünümünde, kullanıcı bir haneyi silip "1.00.000" ürettiğinde
    // (caret o noktada), yeniden gruplanan "100.000" içinde tutarlı bir konum bulur.
    const pos = mapCaretPosition('1.00.000', 4, '100.000');
    expect(pos).toBeGreaterThanOrEqual(0);
    expect(pos).toBeLessThanOrEqual('100.000'.length);
  });
});
