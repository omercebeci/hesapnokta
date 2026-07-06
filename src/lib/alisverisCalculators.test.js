import { describe, expect, it } from 'vitest';
import { calculatePriceChangeRate, calculateStackedDiscount, calculateTipSplit } from './alisverisCalculators.js';

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
});
