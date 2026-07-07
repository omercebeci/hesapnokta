import { describe, expect, it } from 'vitest';
import {
  calculateOptionalCost,
  calculateRoomWallArea,
  suggestPaintPackages,
  calculatePaintNeed,
  calculateTileNeed,
  calculateGroutNeed,
  calculateWallBlockNeed,
  calculateConcreteNeed,
  calculateManualMixMaterials,
  calculateFlooringNeed,
  calculateLineItemBudget,
  calculateRoofNeed,
} from './insaatTadilatCalculators.js';

describe('insaat & tadilat hesaplayıcıları', () => {
  it('miktarı birim fiyatla çarparak opsiyonel maliyeti hesaplar', () => {
    expect(calculateOptionalCost(10, 25)).toBe(250);
    expect(calculateOptionalCost(10, 0)).toBe(0);
    expect(calculateOptionalCost(10, '')).toBe(0);
  });

  it('oda ölçülerinden duvar alanını hesaplar', () => {
    expect(calculateRoomWallArea({ length: 4, width: 5, height: 2.5 })).toBe(45);
  });

  it('ihtiyacı eksiksiz karşılayan ambalaj kombinasyonu önerir', () => {
    expect(suggestPaintPackages(15)).toEqual({ fifteen: 1, sevenHalf: 0, twoHalf: 0, totalLiters: 15 });
    expect(suggestPaintPackages(17)).toEqual({ fifteen: 1, sevenHalf: 0, twoHalf: 1, totalLiters: 17.5 });
    expect(suggestPaintPackages(8)).toEqual({ fifteen: 0, sevenHalf: 1, twoHalf: 1, totalLiters: 10 });
    expect(suggestPaintPackages(0)).toEqual({ fifteen: 0, sevenHalf: 0, twoHalf: 0, totalLiters: 0 });
  });

  it('kapı/pencere düşümü ve kat sayısına göre boya ihtiyacını hesaplar', () => {
    const result = calculatePaintNeed({ wallArea: 45, deductionArea: 5, coatCount: 2, coveragePerLiter: 10 });
    expect(result.netArea).toBe(40);
    expect(result.literNeeded).toBe(8);
    expect(result.fifteen).toBe(0);
    expect(result.sevenHalf).toBe(1);
    expect(result.twoHalf).toBe(1);
    expect(result.totalLiters).toBe(10);
  });

  it('fayans adedi ve kutu sayısını fire payıyla hesaplar', () => {
    const result = calculateTileNeed({ area: 20, tileLengthCm: 60, tileWidthCm: 30, wasteRate: 10, piecesPerBox: 6 });
    expect(result.tileAreaM2).toBe(0.18);
    expect(result.areaWithWaste).toBe(22);
    expect(result.tileCount).toBe(Math.ceil(22 / 0.18));
    expect(result.boxCount).toBe(Math.ceil(result.tileCount / 6));
  });

  it('derz sarfiyatını fayans ölçüsüne göre hesaplar', () => {
    const kg = calculateGroutNeed({ area: 20, tileLengthCm: 60, tileWidthCm: 30, jointWidthMm: 3, jointDepthMm: 8, groutDensity: 1.6 });
    expect(kg).toBeGreaterThan(0);
    expect(kg).toBe(round2(((600 + 300) / (600 * 300)) * 3 * 8 * 1.6 * 20));
  });

  it('blok adedi ve harç sarfiyatını hesaplar', () => {
    const result = calculateWallBlockNeed({ wallArea: 30, blockWidthCm: 60, blockHeightCm: 20, wasteRate: 5, mortarPerM2: 5 });
    expect(result.blockFaceArea).toBe(0.12);
    expect(result.areaWithWaste).toBe(31.5);
    expect(result.blockCount).toBe(Math.ceil(31.5 / 0.12));
    expect(result.mortarKg).toBe(150);
  });

  it('beton hacmini ve mikser sayısını hesaplar', () => {
    const result = calculateConcreteNeed({ area: 50, thicknessCm: 10, wasteRate: 5, mixerCapacityM3: 6 });
    expect(result.volumeM3).toBe(5.25);
    expect(result.mixerTrucksExact).toBe(0.88);
    expect(result.mixerTrucksToOrder).toBe(1);
  });

  it('elle karım için çimento/kum/çakıl miktarlarını hesaplar', () => {
    const result = calculateManualMixMaterials({ volumeM3: 5 });
    expect(result.cementKg).toBe(1750);
    expect(result.cementBags).toBe(35);
    expect(result.sandM3).toBe(2.5);
    expect(result.gravelM3).toBe(4);
    expect(result.waterL).toBe(900);
  });

  it('parke/laminat paket sayısını ve süpürgelik metresini hesaplar', () => {
    const result = calculateFlooringNeed({ area: 20, coveragePerPackage: 2.2, wasteRate: 10, perimeter: 18 });
    expect(result.areaWithWaste).toBe(22);
    expect(result.packageCount).toBe(Math.ceil(22 / 2.2));
    expect(result.skirtingMeters).toBe(18);
  });

  it('kapalı kalemleri hariç tutarak bütçe toplamını ve dağılımını hesaplar', () => {
    const result = calculateLineItemBudget([
      { label: 'Seramik', amount: 6000, enabled: true },
      { label: 'Vitrifiye', amount: 4000, enabled: true },
      { label: 'Mobilya', amount: 10000, enabled: false },
    ]);
    expect(result.total).toBe(10000);
    expect(result.breakdown).toEqual([
      { label: 'Seramik', amount: 6000, ratio: 60 },
      { label: 'Vitrifiye', amount: 4000, ratio: 40 },
    ]);
  });

  it('çatı eğimine göre gerçek alanı ve malzeme adetlerini hesaplar', () => {
    const result = calculateRoofNeed({ length: 10, width: 8, pitchDegrees: 30, tilesPerM2: 10, wasteRate: 10 });
    expect(result.footprintArea).toBe(80);
    expect(result.actualRoofArea).toBeCloseTo(92.38, 1);
    expect(result.areaWithWaste).toBeCloseTo(101.61, 1);
    expect(result.tileCount).toBe(Math.ceil(result.areaWithWaste * 10));
    expect(result.osbSheetsCount).toBe(Math.ceil(result.areaWithWaste / 2.9768));
  });
});

function round2(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}
