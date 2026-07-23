// İnşaat & Tadilat kategorisi için saf hesaplama fonksiyonları.
// Tüm fonksiyonlar yalnızca MİKTAR hesaplar (litre, adet, m³, kg...); hiçbir gömülü fiyat içermez.
// Maliyet katmanı, sayfa bileşenlerinde bu miktarların calculateOptionalCost ile birim fiyatla çarpılmasıyla oluşur.

const round2 = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;
const safeNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

// ── Genel: opsiyonel maliyet katmanı ──
// Herhangi bir miktarı (litre, adet, m³...) kullanıcının girdiği birim fiyatla çarpar.
// unitPrice boş/0 ise 0 döner; sayfa bu durumda maliyet bölümünü hiç göstermeyebilir.
export function calculateOptionalCost(quantity, unitPrice) {
  const q = Math.max(0, safeNumber(quantity));
  const price = Math.max(0, safeNumber(unitPrice));
  return round2(q * price);
}

// ── 1) Boya hesaplama ──
export function calculateRoomWallArea({ length, width, height }) {
  const l = Math.max(0, safeNumber(length));
  const w = Math.max(0, safeNumber(width));
  const h = Math.max(0, safeNumber(height));
  return round2(2 * (l + w) * h);
}

// 2,5L / 7,5L / 15L ambalajlarla ihtiyacı tam karşılayacak (asla eksik bırakmayan) kombinasyon önerir.
export function suggestPaintPackages(literNeeded) {
  let remaining = Math.max(0, safeNumber(literNeeded));
  const fifteen = Math.floor(remaining / 15);
  remaining -= fifteen * 15;
  const sevenHalf = Math.floor(remaining / 7.5);
  remaining -= sevenHalf * 7.5;
  const twoHalf = remaining > 0 ? Math.ceil(remaining / 2.5) : 0;
  const totalLiters = fifteen * 15 + sevenHalf * 7.5 + twoHalf * 2.5;
  return { fifteen, sevenHalf, twoHalf, totalLiters: round2(totalLiters) };
}

export function calculatePaintNeed({ wallArea, deductionArea = 0, coatCount = 2, coveragePerLiter = 10 }) {
  const area = Math.max(0, safeNumber(wallArea));
  const deduction = Math.max(0, safeNumber(deductionArea));
  const coats = Math.max(1, safeNumber(coatCount, 2));
  const coverage = Math.max(0.1, safeNumber(coveragePerLiter, 10));

  const netArea = Math.max(0, area - deduction);
  const literPerCoat = netArea / coverage;
  const literNeeded = literPerCoat * coats;
  const packages = suggestPaintPackages(literNeeded);

  return {
    netArea: round2(netArea),
    literPerCoat: round2(literPerCoat),
    literNeeded: round2(literNeeded),
    ...packages,
    leftoverLiters: round2(Math.max(0, packages.totalLiters - literNeeded)),
  };
}

// ── 2) Fayans/seramik hesaplama ──
export function calculateTileNeed({ area, tileLengthCm, tileWidthCm, wasteRate = 10, piecesPerBox = 6 }) {
  const a = Math.max(0, safeNumber(area));
  const l = Math.max(1, safeNumber(tileLengthCm)) / 100;
  const w = Math.max(1, safeNumber(tileWidthCm)) / 100;
  const waste = Math.max(0, safeNumber(wasteRate, 10));
  const pieces = Math.max(1, Math.floor(safeNumber(piecesPerBox, 6)));

  const tileAreaM2 = l * w;
  const areaWithWaste = a * (1 + waste / 100);
  const tileCount = tileAreaM2 > 0 ? Math.ceil(areaWithWaste / tileAreaM2) : 0;
  const boxCount = Math.ceil(tileCount / pieces);

  return {
    tileAreaM2: round2(tileAreaM2),
    areaWithWaste: round2(areaWithWaste),
    tileCount,
    boxCount,
    leftoverTileCount: Math.max(0, boxCount * pieces - tileCount),
  };
}

// Sektörde yaygın kullanılan derz sarfiyat formülü: ((L+W)/(L×W)) × derz genişliği × derz derinliği × yoğunluk.
export function calculateGroutNeed({ area, tileLengthCm, tileWidthCm, jointWidthMm = 3, jointDepthMm = 8, groutDensity = 1.6 }) {
  const a = Math.max(0, safeNumber(area));
  const lengthMm = Math.max(1, safeNumber(tileLengthCm)) * 10;
  const widthMm = Math.max(1, safeNumber(tileWidthCm)) * 10;
  const jointWidth = Math.max(0, safeNumber(jointWidthMm, 3));
  const jointDepth = Math.max(0, safeNumber(jointDepthMm, 8));
  const density = Math.max(0.1, safeNumber(groutDensity, 1.6));

  const kgPerM2 = ((lengthMm + widthMm) / (lengthMm * widthMm)) * jointWidth * jointDepth * density;
  return round2(kgPerM2 * a);
}

// ── 3) Duvar (tuğla/gazbeton) hesaplama ──
export function calculateWallBlockNeed({ wallArea, blockWidthCm, blockHeightCm, wasteRate = 5, mortarPerM2 = 5 }) {
  const area = Math.max(0, safeNumber(wallArea));
  const w = Math.max(1, safeNumber(blockWidthCm)) / 100;
  const h = Math.max(1, safeNumber(blockHeightCm)) / 100;
  const waste = Math.max(0, safeNumber(wasteRate, 5));
  const mortarRate = Math.max(0, safeNumber(mortarPerM2, 5));

  const blockFaceArea = w * h;
  const areaWithWaste = area * (1 + waste / 100);
  const blockCount = blockFaceArea > 0 ? Math.ceil(areaWithWaste / blockFaceArea) : 0;
  const mortarKg = area * mortarRate;

  return {
    blockFaceArea: round2(blockFaceArea),
    areaWithWaste: round2(areaWithWaste),
    blockCount,
    mortarKg: round2(mortarKg),
    blocksPerM2: blockFaceArea > 0 ? round2(1 / blockFaceArea) : 0,
  };
}

// ── 4) Beton/şap hesaplama ──
export function calculateConcreteNeed({ area, thicknessCm, wasteRate = 5, mixerCapacityM3 = 6 }) {
  const a = Math.max(0, safeNumber(area));
  const thickness = Math.max(0, safeNumber(thicknessCm)) / 100;
  const waste = Math.max(0, safeNumber(wasteRate, 5));
  const mixerCapacity = Math.max(0.1, safeNumber(mixerCapacityM3, 6));

  const volumeM3 = a * thickness * (1 + waste / 100);
  const mixerTrucks = volumeM3 / mixerCapacity;

  return {
    volumeM3: round2(volumeM3),
    mixerTrucksExact: round2(mixerTrucks),
    mixerTrucksToOrder: Math.ceil(mixerTrucks),
  };
}

// Tipik C25/30 beton karışım oranları (elle karım için referans); zemin sınıfı ve agrega türüne göre değişebilir.
export function calculateManualMixMaterials({ volumeM3, cementKgPerM3 = 350, sandM3PerM3 = 0.5, gravelM3PerM3 = 0.8, waterLPerM3 = 180 }) {
  const v = Math.max(0, safeNumber(volumeM3));
  const cementKg = v * Math.max(0, safeNumber(cementKgPerM3, 350));

  return {
    cementKg: round2(cementKg),
    cementBags: Math.ceil(cementKg / 50),
    sandM3: round2(v * Math.max(0, safeNumber(sandM3PerM3, 0.5))),
    gravelM3: round2(v * Math.max(0, safeNumber(gravelM3PerM3, 0.8))),
    waterL: round2(v * Math.max(0, safeNumber(waterLPerM3, 180))),
  };
}

// ── 5) Parke/laminat hesaplama ──
export function calculateFlooringNeed({ area, coveragePerPackage, wasteRate = 10, perimeter = 0 }) {
  const a = Math.max(0, safeNumber(area));
  const coverage = Math.max(0.1, safeNumber(coveragePerPackage));
  const waste = Math.max(0, safeNumber(wasteRate, 10));
  const perimeterValue = Math.max(0, safeNumber(perimeter));

  const areaWithWaste = a * (1 + waste / 100);
  const packageCount = Math.ceil(areaWithWaste / coverage);
  const totalPurchasedAreaM2 = packageCount * coverage;

  return {
    areaWithWaste: round2(areaWithWaste),
    packageCount,
    skirtingMeters: round2(perimeterValue),
    totalPurchasedAreaM2: round2(totalPurchasedAreaM2),
    leftoverAreaM2: round2(Math.max(0, totalPurchasedAreaM2 - areaWithWaste)),
  };
}

// ── 6, 7, 9) Kalem bazlı tadilat/yapım bütçesi (banyo, mutfak, ev yapımı ortak) ──
// items: [{ label, amount, enabled }] — enabled=false olan kalemler toplama dahil edilmez.
// TOP_ITEM_WARNING_RATIO: bir kalemin toplam bütçenin bu oranını aşması "bu kaleme dikkat" uyarısını tetikler.
const TOP_ITEM_WARNING_RATIO = 40;

export function calculateLineItemBudget(items) {
  const allItems = items || [];
  const activeItems = allItems.filter((item) => item.enabled !== false);
  const total = activeItems.reduce((sum, item) => sum + Math.max(0, safeNumber(item.amount)), 0);

  const breakdown = activeItems.map((item) => {
    const amount = Math.max(0, safeNumber(item.amount));
    return {
      label: item.label,
      amount: round2(amount),
      ratio: total > 0 ? round2((amount / total) * 100) : 0,
    };
  });

  const topItem = breakdown.reduce((max, item) => (!max || item.amount > max.amount ? item : max), null);

  return {
    total: round2(total),
    breakdown,
    enabledCount: activeItems.length,
    totalCount: allItems.length,
    topItem,
    topItemWarning: !!topItem && topItem.ratio > TOP_ITEM_WARNING_RATIO,
  };
}

// ── 8) Çatı hesaplama ──
const DEG_TO_RAD = Math.PI / 180;
const OSB_SHEET_AREA_M2 = 2.9768; // Standart OSB levha: 122 cm × 244 cm

export function calculateRoofNeed({ length, width, pitchDegrees = 30, tilesPerM2 = 10, wasteRate = 10 }) {
  const l = Math.max(0, safeNumber(length));
  const w = Math.max(0, safeNumber(width));
  const pitch = Math.min(85, Math.max(0, safeNumber(pitchDegrees, 30)));
  const tileDensity = Math.max(0.1, safeNumber(tilesPerM2, 10));
  const waste = Math.max(0, safeNumber(wasteRate, 10));

  const footprintArea = l * w;
  const slopeFactor = 1 / Math.cos(pitch * DEG_TO_RAD);
  const actualRoofArea = footprintArea * slopeFactor;
  const areaWithWaste = actualRoofArea * (1 + waste / 100);

  return {
    footprintArea: round2(footprintArea),
    actualRoofArea: round2(actualRoofArea),
    areaWithWaste: round2(areaWithWaste),
    slopeIncreasePercent: footprintArea > 0 ? round2((slopeFactor - 1) * 100) : 0,
    tileCount: Math.ceil(areaWithWaste * tileDensity),
    osbSheetsCount: Math.ceil(areaWithWaste / OSB_SHEET_AREA_M2),
  };
}

// ── 10) Alçı/Sıva hesaplama ──
// Sarfiyat sabitleri (kg/m² per mm kalınlık) üretici teknik föylerinden alınmıştır, fiyat içermez:
// - saten-alcisi: Dalsan SATENTEK Teknik Föyü, "Her 1 mm kalınlık 1 kg/m²" (TS EN 13279-1/2 C6/20/2)
// - perlitli-siva: BMT Alçı (SIAS) ürün verisi, "1 cm için yaklaşık 9-10 kg/m²" (ortalama 9,5 kg/m²/cm)
// - makine-sivasi: Dalsan ALÇITEK Teknik Föyü, "Her 1 cm kalınlık 10 kg/m²" (TS EN 13279-1/2 B4/50/2)
// - kaba-siva: İSKİM Çimento Esaslı Hazır Sıva (Kalın) 3260 ürün verisi, "1 cm için 14-15 kg/m²" (ortalama)
export const PLASTER_MATERIALS = {
  'saten-alcisi': { label: 'Saten Alçı', kgPerM2PerMm: 1, source: 'Dalsan SATENTEK Teknik Föyü (TS EN 13279-1/2 C6/20/2)' },
  'perlitli-siva': { label: 'Perlitli Sıva Alçısı', kgPerM2PerMm: 0.95, source: 'BMT Alçı (SIAS) ürün verisi' },
  'makine-sivasi': { label: 'Makine Sıvası (alçı bazlı)', kgPerM2PerMm: 1, source: 'Dalsan ALÇITEK Teknik Föyü (TS EN 13279-1/2 B4/50/2)' },
  'kaba-siva': { label: 'Kaba Sıva (çimento esaslı)', kgPerM2PerMm: 1.45, source: 'İSKİM Çimento Esaslı Hazır Sıva (Kalın) 3260 ürün verisi' },
};

function resolvePlasterMaterial(materialKey) {
  return PLASTER_MATERIALS[materialKey] || PLASTER_MATERIALS['saten-alcisi'];
}

export function calculatePlasterNeed({ area, thicknessMm, materialKey, wasteRate = 5 }) {
  const a = Math.max(0, safeNumber(area));
  const thickness = Math.max(0, safeNumber(thicknessMm));
  const waste = Math.max(0, safeNumber(wasteRate, 5));
  const material = resolvePlasterMaterial(materialKey);

  const requiredKg = a * thickness * material.kgPerM2PerMm * (1 + waste / 100);

  return {
    requiredKg: round2(requiredKg),
    materialLabel: material.label,
    materialSource: material.source,
  };
}

export function calculateBagCount(requiredKg, bagWeightKg) {
  const kg = Math.max(0, safeNumber(requiredKg));
  const bagWeight = Math.max(1, safeNumber(bagWeightKg, 25));
  return Math.ceil(kg / bagWeight);
}

// Ters hesap: torba sayısı ve kalınlıktan kaplanabilir alanı bulur (ör. "35 kg alçı kaç m² yapar?").
export function calculatePlasterCoverage({ bagCount, bagWeightKg, thicknessMm, materialKey }) {
  const bags = Math.max(0, safeNumber(bagCount));
  const bagWeight = Math.max(1, safeNumber(bagWeightKg, 25));
  const thickness = Math.max(0.1, safeNumber(thicknessMm, 1));
  const material = resolvePlasterMaterial(materialKey);

  const totalKg = bags * bagWeight;
  const coverageM2 = totalKg / (thickness * material.kgPerM2PerMm);

  return {
    totalKg: round2(totalKg),
    coverageM2: round2(coverageM2),
    materialLabel: material.label,
    materialSource: material.source,
  };
}
