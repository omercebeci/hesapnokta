import { describe, expect, it } from 'vitest';
import {
  calculateElectricityCost, calculateFuelSplitCost, calculateRoomMaterials,
  calculateNaturalGasCost, calculateRoommateSplit, calculateSubscriptionCost,
  calculateVehicleOwnershipCost, calculateEvChargingCost, calculateTrafficFineDiscount,
  calculateRecipeScale, convertKitchenMeasure, calculateCatHumanAge, calculateDogHumanAge,
  calculateDischargeDate,
} from './gunlukYasamCalculators.js';

describe('günlük yaşam hesaplayıcıları', () => {
  it('cihazın aylık elektrik tüketimi ve maliyetini hesaplar', () => {
    expect(calculateElectricityCost({ watt: 1500, hoursPerDay: 3, daysPerMonth: 30, pricePerKwh: 2.5 })).toEqual({
      dailyKwh: 4.5,
      monthlyKwh: 135,
      monthlyCost: 337.5,
    });
  });

  it('yolculuk yakıt maliyetini kişi sayısına böler', () => {
    expect(calculateFuelSplitCost({ distanceKm: 450, consumptionPer100Km: 7.2, fuelPrice: 43.15, peopleCount: 3 })).toEqual({
      fuelNeeded: 32.4,
      totalCost: 1398.06,
      perPerson: 466.02,
    });
  });

  it('oda ölçülerine göre zemin alanı ve boya ihtiyacını hesaplar', () => {
    expect(calculateRoomMaterials({ length: 4, width: 5, height: 2.5, paintCoveragePerLiter: 10, coatCount: 2, wasteRate: 10 })).toEqual({
      floorArea: 20,
      wallArea: 45,
      totalPaintLiters: 9.9,
    });
  });

  it('doğalgaz m³ tüketimini kWh ve aylık maliyete çevirir', () => {
    expect(calculateNaturalGasCost({ m3: 100, pricePerM3: 15 })).toEqual({
      kwh: 1064.02,
      monthlyCost: 1500,
      costPerKwh: 1.41,
    });
  });

  it('ev arkadaşları arasında eşit bölüşüm yapar', () => {
    expect(calculateRoommateSplit({
      items: [{ label: 'Kira', amount: 15000 }, { label: 'Elektrik', amount: 3000 }, { label: 'Su', amount: 2000 }],
      people: [{ name: 'Ali' }, { name: 'Veli' }, { name: 'Ayşe' }],
      mode: 'equal',
    })).toEqual({
      total: 20000,
      breakdown: [
        { name: 'Ali', amount: 6666.67, ratio: 33.33 },
        { name: 'Veli', amount: 6666.67, ratio: 33.33 },
        { name: 'Ayşe', amount: 6666.67, ratio: 33.33 },
      ],
    });
  });

  it('ev arkadaşları arasında ağırlığa göre bölüşüm yapar', () => {
    expect(calculateRoommateSplit({
      items: [{ label: 'Kira', amount: 20000 }],
      people: [{ name: 'Ali', weight: 20 }, { name: 'Veli', weight: 15 }, { name: 'Ayşe', weight: 10 }],
      mode: 'weighted',
    })).toEqual({
      total: 20000,
      breakdown: [
        { name: 'Ali', amount: 8888.89, ratio: 44.44 },
        { name: 'Veli', amount: 6666.67, ratio: 33.33 },
        { name: 'Ayşe', amount: 4444.44, ratio: 22.22 },
      ],
    });
  });

  it('abonelik listesinin aylık/yıllık toplamını ve asgari ücret gün karşılığını hesaplar', () => {
    expect(calculateSubscriptionCost([
      { name: 'Netflix', monthlyAmount: 150 },
      { name: 'Spotify', monthlyAmount: 80 },
      { name: 'Depolama', monthlyAmount: 45 },
    ])).toEqual({
      breakdown: [
        { name: 'Netflix', monthlyAmount: 150, yearlyAmount: 1800 },
        { name: 'Spotify', monthlyAmount: 80, yearlyAmount: 960 },
        { name: 'Depolama', monthlyAmount: 45, yearlyAmount: 540 },
      ],
      monthlyTotal: 275,
      yearlyTotal: 3300,
      minWageDaysPerYear: 3.53,
    });
  });

  it('araç sahip olma maliyetinin yıllık toplamını, km ve ay başı maliyetini hesaplar', () => {
    const result = calculateVehicleOwnershipCost({ mtv: 3500, sigorta: 8000, kasko: 12000, bakim: 4000, lastik: 3000, yakit: 25000, kmPerYear: 15000 });
    expect(result.yearlyTotal).toBe(55500);
    expect(result.perKm).toBe(3.7);
    expect(result.perMonth).toBe(4625);
    expect(result.breakdown).toEqual([
      { label: 'MTV', amount: 3500, ratio: 6.31 },
      { label: 'Sigorta', amount: 8000, ratio: 14.41 },
      { label: 'Kasko', amount: 12000, ratio: 21.62 },
      { label: 'Bakım', amount: 4000, ratio: 7.21 },
      { label: 'Lastik', amount: 3000, ratio: 5.41 },
      { label: 'Yakıt', amount: 25000, ratio: 45.05 },
    ]);
  });

  it('elektrikli araç şarj maliyetini ve benzinliyle karşılaştırmasını hesaplar', () => {
    expect(calculateEvChargingCost({
      batteryCapacityKwh: 60, consumptionPer100Km: 16, homePricePerKwh: 2.8, stationPricePerKwh: 6.5,
      fuelConsumptionPer100Km: 7, fuelPrice: 43,
    })).toEqual({
      fullChargeCostHome: 168,
      cost100KmHome: 44.8,
      cost100KmStation: 104,
      gasolineCost100Km: 301,
      savingsPer100KmVsGasoline: 256.2,
    });
  });

  it('trafik cezasında erken ödeme indirimini hesaplar', () => {
    expect(calculateTrafficFineDiscount({ amount: 2560 })).toEqual({
      discountAmount: 640,
      discountedAmount: 1920,
      discountRate: 25,
      dayLimit: 30,
    });
  });

  it('tarif malzemelerini hedef porsiyona göre ölçekler', () => {
    expect(calculateRecipeScale({
      originalServings: 4,
      targetServings: 7,
      ingredients: [{ name: 'Un', unit: 'gram', amount: 200 }, { name: 'Yumurta', unit: 'adet', amount: 2 }],
    })).toEqual({
      ratio: 1.75,
      scaledIngredients: [
        { name: 'Un', unit: 'gram', originalAmount: 200, scaledAmount: 350 },
        { name: 'Yumurta', unit: 'adet', originalAmount: 2, scaledAmount: 3.5 },
      ],
    });
  });

  it('mutfak ölçülerini malzeme tipine göre grama ve başka bir ölçüye çevirir', () => {
    expect(convertKitchenMeasure({ ingredientType: 'un', amount: 3, fromUnit: 'bardak', toUnit: 'yemekKasigi' })).toEqual({
      grams: 390,
      convertedAmount: 43.33,
    });
  });

  it('bilinmeyen malzeme tipi için null döner', () => {
    expect(convertKitchenMeasure({ ingredientType: 'bilinmeyen', amount: 1, fromUnit: 'bardak', toUnit: 'gram' })).toBeNull();
  });

  it('kedi yaşını 15-9-4 kuralıyla insan yaşına çevirir', () => {
    expect(calculateCatHumanAge(1)).toBe(15);
    expect(calculateCatHumanAge(3)).toBe(28);
  });

  it('köpek yaşını boyuta göre insan yaşına çevirir', () => {
    expect(calculateDogHumanAge({ dogYears: 5, sizeCategory: 'buyuk' })).toBe(42);
    expect(calculateDogHumanAge({ dogYears: 10, sizeCategory: 'kucuk' })).toBe(56);
  });

  it('sevk tarihi ve hizmet türüne göre terhis tarihini ve kalan günü hesaplar', () => {
    expect(calculateDischargeDate({ sevkTarihi: '2026-07-09', tur: 'er', referenceDate: '2026-07-09' })).toEqual({
      dischargeDate: '2027-01-09',
      remainingDays: 184,
    });
    expect(calculateDischargeDate({ sevkTarihi: '2026-07-09', tur: 'bedelli', referenceDate: '2026-07-09' })).toEqual({
      dischargeDate: '2026-08-10',
      remainingDays: 32,
    });
  });
});
