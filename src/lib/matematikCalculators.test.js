import { describe, expect, it } from 'vitest';
import {
  calculatePercentage,
  calculateRatio,
  calculateAreaVolume,
  calculateAverage,
  calculateCombinationPermutation,
  convertUnit,
} from './matematikCalculators.js';

describe('matematik hesaplayıcıları', () => {
  it('bir sayının yüzdesini hesaplar', () => {
    expect(calculatePercentage({ mode: 'percentOf', valueA: 250, valueB: 20 })).toEqual({ result: 50 });
  });

  it('bir değerin diğerinin yüzde kaçı olduğunu hesaplar', () => {
    expect(calculatePercentage({ mode: 'whatPercent', valueA: 50, valueB: 250 })).toEqual({ result: 20 });
  });

  it('iki değer arasındaki yüzde değişimi hesaplar', () => {
    expect(calculatePercentage({ mode: 'change', valueA: 100, valueB: 120 })).toEqual({ result: 20, difference: 20 });
  });

  it('doğru orantı ile bilinmeyeni bulur', () => {
    expect(calculateRatio({ type: 'direct', a: 4, b: 12, c: 6 })).toEqual({ result: 18 });
  });

  it('ters orantı ile bilinmeyeni bulur', () => {
    expect(calculateRatio({ type: 'inverse', a: 4, b: 12, c: 6 })).toEqual({ result: 8 });
  });

  it('dikdörtgen alanını hesaplar', () => {
    expect(calculateAreaVolume({ mode: 'area', shape: 'rectangle', dims: { width: 5, height: 3 } })).toEqual({ result: 15 });
  });

  it('daire alanını hesaplar', () => {
    expect(calculateAreaVolume({ mode: 'area', shape: 'circle', dims: { radius: 3 } })).toEqual({ result: 28.27 });
  });

  it('küp hacmini hesaplar', () => {
    expect(calculateAreaVolume({ mode: 'volume', shape: 'cube', dims: { side: 4 } })).toEqual({ result: 64 });
  });

  it('silindir hacmini hesaplar', () => {
    expect(calculateAreaVolume({ mode: 'volume', shape: 'cylinder', dims: { radius: 3, height: 5 } })).toEqual({ result: 141.37 });
  });

  it('basit ve ağırlıklı ortalamayı hesaplar (not ortalaması senaryosu)', () => {
    expect(calculateAverage([{ value: 80, weight: 40 }, { value: 90, weight: 60 }])).toEqual({
      simpleAverage: 85,
      weightedAverage: 86,
      totalWeight: 100,
      count: 2,
    });
  });

  it('kombinasyon hesaplar (nCr)', () => {
    expect(calculateCombinationPermutation({ n: 10, r: 3, mode: 'combination' })).toEqual({ valid: true, result: 120 });
  });

  it('permütasyon hesaplar (nPr)', () => {
    expect(calculateCombinationPermutation({ n: 10, r: 3, mode: 'permutation' })).toEqual({ valid: true, result: 720 });
  });

  it('r, n\'den büyükse geçersiz sonuç döner', () => {
    expect(calculateCombinationPermutation({ n: 3, r: 5, mode: 'combination' })).toEqual({ valid: false });
  });

  it('uzunluk birimini çevirir (km -> mil)', () => {
    expect(convertUnit({ category: 'length', fromUnit: 'km', toUnit: 'mile', value: 10 })).toEqual({ result: 6.21 });
  });

  it('ağırlık birimini çevirir (kg -> pound)', () => {
    expect(convertUnit({ category: 'weight', fromUnit: 'kg', toUnit: 'pound', value: 5 })).toEqual({ result: 11.02 });
  });

  it('sıcaklık birimini çevirir (celsius -> fahrenheit)', () => {
    expect(convertUnit({ category: 'temperature', fromUnit: 'c', toUnit: 'f', value: 100 })).toEqual({ result: 212 });
  });

  it('hız birimini çevirir (km/h -> mph)', () => {
    expect(convertUnit({ category: 'speed', fromUnit: 'kmh', toUnit: 'mph', value: 100 })).toEqual({ result: 62.14 });
  });
});
