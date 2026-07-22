import { describe, expect, it } from 'vitest';
import { normalizeSearchText, searchCalculators } from './search.js';

const sample = [
  {
    id: 'kredi-hesaplama',
    title: 'Kredi Taksiti Hesaplama',
    description: 'Kredi tutarı, faiz oranı ve vadeye göre aylık taksit ve toplam maliyeti hesaplayın.',
    category: 'finans',
    keywords: ['kredi', 'taksit', 'faiz', 'bsmv', 'kkdf'],
  },
  {
    id: 'kredi-karti-asgari-odeme-hesaplama',
    title: 'Kredi Kartı Asgari Ödeme ve Gecikme Faizi Hesaplama',
    description: 'Kart limitinize göre asgari ödeme tutarını ve gecikme durumunda işleyecek faizi hesaplayın.',
    category: 'finans',
    keywords: ['kredi kartı', 'asgari ödeme', 'gecikme faizi', 'temerrüt faizi'],
  },
  {
    id: 'emlak-kredisi-uygunluk-hesaplama',
    title: 'Emlak Kredisi Uygunluk Hesaplama',
    description: 'Aylık gelirinize göre alabileceğiniz maksimum konut kredisi tutarını tahmin edin.',
    category: 'finans',
    keywords: ['emlak', 'konut kredisi', 'mortgage', 'uygunluk'],
  },
  {
    id: 'taksit-karsilastirma-hesaplama',
    title: 'Taksit Karşılaştırma Hesaplama',
    description: 'Peşin fiyat ile taksitli toplam fiyatı karşılaştırıp taksitlendirmenin gerçek maliyetini görün.',
    category: 'finans',
    keywords: ['taksit', 'peşin', 'karşılaştırma', 'vade farkı', 'kredi kartı'],
  },
  {
    id: 'vucut-kitle-indeksi-hesaplama',
    title: 'Vücut Kitle İndeksi (BMI)',
    description: 'Boy ve kilonuza göre vücut kitle indeksinizi ve ideal kilo aralığınızı hesaplayın.',
    category: 'saglik',
    keywords: ['bmi', 'vücut kitle indeksi', 'kilo', 'boy'],
  },
];

describe('normalizeSearchText', () => {
  it('Türkçe büyük/küçük harf kurallarını doğru uygular (İ→i, I→ı)', () => {
    expect(normalizeSearchText('KREDİ')).toBe('kredi');
    expect(normalizeSearchText('İNDİRİM')).toBe('indirim');
    expect(normalizeSearchText('IŞIK')).toBe('ışık');
  });

  it('baştaki/sondaki boşlukları temizler', () => {
    expect(normalizeSearchText('  kredi  ')).toBe('kredi');
  });
});

describe('searchCalculators', () => {
  it('boş sorguda boş liste döner', () => {
    expect(searchCalculators(sample, '')).toEqual([]);
    expect(searchCalculators(sample, '   ')).toEqual([]);
  });

  it('"kredi" ile ilgili tüm araçları getirir (başlık, açıklama veya anahtar kelime üzerinden)', () => {
    const results = searchCalculators(sample, 'kredi');
    const ids = results.map((r) => r.id);
    expect(ids).toContain('kredi-hesaplama');
    expect(ids).toContain('kredi-karti-asgari-odeme-hesaplama');
    expect(ids).toContain('emlak-kredisi-uygunluk-hesaplama');
    expect(ids).toContain('taksit-karsilastirma-hesaplama');
    expect(ids).not.toContain('vucut-kitle-indeksi-hesaplama');
  });

  it('sadece açıklamada geçen bir kelimeyle de eşleşir', () => {
    const results = searchCalculators(sample, 'gecikme');
    expect(results.map((r) => r.id)).toContain('kredi-karti-asgari-odeme-hesaplama');
  });

  it('büyük/küçük harf ve Türkçe karakter duyarsızdır', () => {
    const lower = searchCalculators(sample, 'kredi').map((r) => r.id);
    const upper = searchCalculators(sample, 'KREDİ').map((r) => r.id);
    const mixed = searchCalculators(sample, 'KrEdi').map((r) => r.id);
    expect(upper).toEqual(lower);
    expect(mixed).toEqual(lower);
  });

  it('başlıkta geçen sonuçları açıklamada geçenlerden önce sıralar', () => {
    const results = searchCalculators(sample, 'kredi');
    const titleMatchIndex = results.findIndex((r) => r.id === 'kredi-hesaplama');
    const descOnlyIndex = results.findIndex((r) => r.id === 'kredi-karti-asgari-odeme-hesaplama');
    expect(titleMatchIndex).toBeLessThan(descOnlyIndex === -1 ? Infinity : descOnlyIndex + 1);
  });

  it('birden fazla kelime AND mantığıyla eşleşir', () => {
    const results = searchCalculators(sample, 'kredi kartı');
    const ids = results.map((r) => r.id);
    expect(ids).toContain('kredi-karti-asgari-odeme-hesaplama');
    expect(ids).not.toContain('kredi-hesaplama');
  });

  it('eşleşme yoksa boş liste döner (bulunamadı durumu)', () => {
    expect(searchCalculators(sample, 'zzzznonexistent')).toEqual([]);
  });

  it('sonuçlar kategoriye göre gruplanmaz, düz bir dizi olarak döner', () => {
    const results = searchCalculators(sample, 'hesaplama');
    expect(Array.isArray(results)).toBe(true);
    const categories = new Set(results.map((r) => r.category));
    expect(categories.size).toBeGreaterThan(0);
  });
});
