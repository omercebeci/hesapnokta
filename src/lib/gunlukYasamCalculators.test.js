import { describe, expect, it } from 'vitest';
import { calculateElectricityCost, calculateFuelSplitCost, calculateRoomMaterials } from './gunlukYasamCalculators.js';

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
});
