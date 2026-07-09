import { describe, expect, it } from 'vitest';
import {
  calculatePriceChangeRate, calculateStackedDiscount, calculateTipSplit,
  calculateDesi, calculateCargoShipment, findSizeRow, convertGoldUnits,
} from './alisverisCalculators.js';

describe('alışveriş hesaplayıcıları', () => {
  it('fiyat artışının tutar ve oranını hesaplar', () => {
    expect(calculatePriceChangeRate({ oldPrice: 100, newPrice: 150 })).toEqual({
      changeAmount: 50,
      changeRate: 50,
      isIncrease: true,
    });
  });

  it('fiyat azalışını negatif olarak hesaplar', () => {
    expect(calculatePriceChangeRate({ oldPrice: 200, newPrice: 150 })).toEqual({
      changeAmount: -50,
      changeRate: -25,
      isIncrease: false,
    });
  });

  it('art arda uygulanan indirimlerin gerçek toplam oranını hesaplar', () => {
    expect(calculateStackedDiscount({ price: 1000, discountRates: [20, 10] })).toEqual({
      finalPrice: 720,
      totalDiscountAmount: 280,
      effectiveDiscountRate: 28,
    });
  });

  it('bahşiş dahil hesabı kişi sayısına böler', () => {
    expect(calculateTipSplit({ billAmount: 1000, tipPercentage: 10, peopleCount: 4 })).toEqual({
      tipAmount: 100,
      totalWithTip: 1100,
      perPerson: 275,
    });
  });

  it('tek bir koli için desiyi hesaplar', () => {
    expect(calculateDesi({ lengthCm: 40, widthCm: 30, heightCm: 25 })).toBe(10);
  });

  it('birden fazla koli için desi/kg karşılaştırmasını ve toplamları hesaplar', () => {
    expect(calculateCargoShipment([
      { lengthCm: 40, widthCm: 30, heightCm: 25, weightKg: 8, quantity: 2 },
      { lengthCm: 20, widthCm: 20, heightCm: 20, weightKg: 5, quantity: 1 },
    ])).toEqual({
      breakdown: [
        { desi: 10, weight: 8, quantity: 2, billableUnit: 10, billableTotal: 20, desiWins: true },
        { desi: 2.67, weight: 5, quantity: 1, billableUnit: 5, billableTotal: 5, desiWins: false },
      ],
      totalDesi: 22.67,
      totalWeight: 21,
      totalBillableWeight: 25,
    });
  });

  it('beden tablosunda TR bedene karşılık gelen satırı bulur', () => {
    expect(findSizeRow('kadinAyakkabi', 'tr', 38)).toEqual({ tr: 38, eu: 38, us: 7.5, uk: 5 });
    expect(findSizeRow('erkekGiyim', 'eu', 50)).toEqual({ tr: 50, eu: 50, us: 40, uk: 40 });
  });

  it('tabloda olmayan bir bedeni null döner', () => {
    expect(findSizeRow('kadinGiyim', 'tr', 99)).toBeNull();
  });

  it('altın birimlerini gram üzerinden çevirir ve fiyat girilirse tutarı hesaplar', () => {
    expect(convertGoldUnits({ amount: 2, fromUnit: 'tam', toUnit: 'ceyrek', gramPrice: 4500 })).toEqual({
      totalGrams: 14,
      convertedAmount: 8,
      totalPrice: 63000,
    });
  });

  it('fiyat girilmezse altın çeviricide toplam tutar null döner', () => {
    expect(convertGoldUnits({ amount: 1, fromUnit: 'ceyrek', toUnit: 'gram' })).toEqual({
      totalGrams: 1.75,
      convertedAmount: 1.75,
      totalPrice: null,
    });
  });
});
