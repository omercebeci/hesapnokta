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

// ── 11) Klima BTU hesaplama ──
// Bu alan, Manual-J gibi mühendislik hesabı değil, Türkiye'deki klima
// perakendecilerinin (klima.com.tr, btuhesaplama.com, Vestel, semteknik.com.tr
// vb. birden çok kaynakta tutarlı biçimde tekrarlanan) "kaba tahmin" pratiğidir;
// bu yüzden sonuç kesin tek sayı değil bir ARALIK olarak sunulur.
// Taban oran: oda alanı × ~600 BTU/m² (yaygın kabul gören ortalama pratik değer).
// Düzeltmeler: tavan yüksekliği (2,5 m taban, hacimsel ölçekleme), maruziyet
// durumu (kat/cephe/güneş alma — az güneşli -%5, normal değişiklik yok, çok
// güneşli/üst kat +%15, hem üst kat hem çok güneşli +%25 — birden çok kaynakta
// "+%10-20" olarak tekrarlanan aralığın orta noktaları), kişi başı +600 BTU
// (2 kişilik taban varsayımın üzerindeki her kişi için) ve cihaz başı +600 BTU.
export const AC_BTU_BASE_PER_M2 = 600;
export const AC_BTU_BASE_CEILING_HEIGHT_M = 2.5;
export const AC_BTU_PER_EXTRA_PERSON = 600;
export const AC_BTU_PER_DEVICE = 600;

export const AC_EXPOSURE_FACTORS = {
  'az-gunes': { label: 'Az güneş alan / kuzey cephe', factor: 0.95 },
  normal: { label: 'Normal (ara kat, orta düzey güneş)', factor: 1 },
  'cok-gunes-veya-ust-kat': { label: 'Çok güneş alan (güney/batı cephe) VEYA üst kat/çatı katı', factor: 1.15 },
  'cok-gunes-ve-ust-kat': { label: 'Çok güneş alan VE üst kat/çatı katı (ikisi birden)', factor: 1.25 },
};

// Standart klima kapasite sınıfları (BTU/h) ve bu sınıfa geçiş eşiği (üst sınır).
const AC_CAPACITY_CLASSES = [9000, 12000, 18000, 24000];

function pickAcCapacityClass(btu) {
  const found = AC_CAPACITY_CLASSES.find((capacity) => btu <= capacity);
  return found || null; // null: 24000 BTU üzeri, çoklu/salon tipi klima veya uzman değerlendirmesi gerekir
}

export function calculateAcBtuNeed({ area, ceilingHeight = AC_BTU_BASE_CEILING_HEIGHT_M, exposureKey = 'normal', personCount = 2, deviceCount = 0 }) {
  const a = Math.max(0, safeNumber(area));
  const height = Math.max(1, safeNumber(ceilingHeight, AC_BTU_BASE_CEILING_HEIGHT_M));
  const people = Math.max(0, safeNumber(personCount, 2));
  const devices = Math.max(0, safeNumber(deviceCount, 0));
  const exposure = AC_EXPOSURE_FACTORS[exposureKey] || AC_EXPOSURE_FACTORS.normal;

  const heightFactor = Math.max(1, height / AC_BTU_BASE_CEILING_HEIGHT_M);
  const baseBtu = a * AC_BTU_BASE_PER_M2 * heightFactor * exposure.factor;
  const peopleExtraBtu = Math.max(0, people - 2) * AC_BTU_PER_EXTRA_PERSON;
  const deviceExtraBtu = devices * AC_BTU_PER_DEVICE;
  const estimatedBtu = baseBtu + peopleExtraBtu + deviceExtraBtu;

  const minBtu = estimatedBtu * 0.9;
  const maxBtu = estimatedBtu * 1.1;

  return {
    estimatedBtu: Math.round(estimatedBtu),
    minBtu: Math.round(minBtu),
    maxBtu: Math.round(maxBtu),
    recommendedClass: pickAcCapacityClass(estimatedBtu),
    exposureLabel: exposure.label,
  };
}

// ── 12) Radyatör/Petek dilim hesaplama ──
// Isı kaybı katsayıları (kcal/h per m³) — tesisat.org "Pratik Isı Kaybı Hesabı"
// rehberinde verilen, Türkiye'deki tesisatçı pratiğinde yaygın kullanılan
// kat/cephe yönü/cam türü kombinasyonlarına göre kaynaklı tablo.
export const ROOM_HEAT_LOSS_TIERS = {
  'guney-ic-cift-cam': { label: 'Güney cephe, ara kat, çift cam (iyi yalıtım)', kcalPerM3: 40 },
  'db-kose-tek-cam': { label: 'Doğu/Batı köşe, ara kat, tek cam (yalıtımlı)', kcalPerM3: 45 },
  'db-guney-tek-cam': { label: 'Doğu/Batı/Güney, ara kat, tek cam', kcalPerM3: 50 },
  'ust-cift-cam': { label: 'Üst kat/çatı katı/bodrum, çift cam (yalıtımlı)', kcalPerM3: 55 },
  'ust-db-tek-cam': { label: 'Üst kat/çatı katı/bodrum, Doğu/Batı, tek cam', kcalPerM3: 60 },
  'ust-kuzey-yalitimsiz': { label: 'Üst kat/bodrum, kuzey cephe, yalıtımsız duvar', kcalPerM3: 65 },
  'ust-kuzey-cati-yalitimsiz': { label: 'Üst kat/çatı katı, kuzey, yalıtımsız çatı, tek cam', kcalPerM3: 70 },
};

const KCAL_TO_WATT = 1.163; // standart dönüşüm: 1 kcal/h = 1,163 W

export function calculateRoomHeatLoss({ volumeM3, tierKey }) {
  const volume = Math.max(0, safeNumber(volumeM3));
  const tier = ROOM_HEAT_LOSS_TIERS[tierKey] || ROOM_HEAT_LOSS_TIERS['db-guney-tek-cam'];

  const estimatedKcal = volume * tier.kcalPerM3;

  return {
    estimatedKcal: round2(estimatedKcal),
    minKcal: round2(estimatedKcal * 0.9),
    maxKcal: round2(estimatedKcal * 1.1),
    estimatedWatt: round2(estimatedKcal * KCAL_TO_WATT),
    minWatt: round2(estimatedKcal * 0.9 * KCAL_TO_WATT),
    maxWatt: round2(estimatedKcal * 1.1 * KCAL_TO_WATT),
    tierLabel: tier.label,
  };
}

// Alüminyum panel radyatör dilim verimi (kcal/h per dilim) — RADYAL Isıtma
// Sistemleri A.Ş. "KN" (Konak) serisi teknik verileri, ΔT60 (90/70-20°C)
// standart ısıl güç ratingine göre. Marka/modele göre ±%10-15 değişebilir.
export const RADIATOR_DILIM_OUTPUT_KCAL = {
  300: 57,
  375: 70,
  450: 83,
  525: 95,
  600: 106,
  750: 130,
  825: 140,
  900: 149,
  1000: 163,
};

export function calculateRadiatorSections(heatLossKcal, heightMm) {
  const kcal = Math.max(0, safeNumber(heatLossKcal));
  const outputPerSection = RADIATOR_DILIM_OUTPUT_KCAL[heightMm] || RADIATOR_DILIM_OUTPUT_KCAL[600];
  return Math.ceil(kcal / outputPerSection);
}

// ── 13) Mantolama (ısı yalıtımı) hesaplama ──
// Levha ölçüleri: EPS/XPS için 50×100 cm = 0,5 m² (İMPOR, Flextab ürün verileri
// ile teyitli standart piyasa ölçüsü); taşyünü mantolama levhası için 60×120 cm
// = 0,72 m² (Flextab/Rockwool ürün verisi). Dübel yoğunluğu bina yüksekliğine
// göre kademeli: ≤8 m için 6 adet/m², 8-20 m için 8 adet/m², 20 m üzeri için
// 10 adet/m² (yaygın uygulanan saha pratiği). File sarfiyatı %10 bindirme
// payıyla 1,10 m² file/m² cephe (sove.istanbul kaynaklı). Yapıştırıcı sarfiyatı
// 4,5 kg/m² (4-5 kg/m² aralığının ortası), toplam sıva (donatı gömme + üst kat)
// sarfiyatı 5 kg/m² (3 kg/m² + 2 kg/m²) — mekatronyapi.com.tr kaynaklı.
export const MANTOLAMA_MATERIALS = {
  eps: { label: 'EPS (Genleştirilmiş Polistiren)', boardAreaM2: 0.5 },
  xps: { label: 'XPS (Ekstrüde Polistiren)', boardAreaM2: 0.5 },
  tasyunu: { label: 'Taşyünü (Mineral Yün)', boardAreaM2: 0.72 },
};

function pickDubelDensityPerM2(buildingHeightM) {
  const height = Math.max(0, safeNumber(buildingHeightM, 8));
  if (height <= 8) return 6;
  if (height <= 20) return 8;
  return 10;
}

// Dübel uzunluğu = levha kalınlığı + yapıştırma kalınlığı (5 mm) + kaba sıva payı
// (10 mm) + ankraj derinliği (50 mm); piyasa pratiğinden kaynaklı formül.
const DUBEL_ADHESIVE_MM = 5;
const DUBEL_PLASTER_ALLOWANCE_MM = 10;
const DUBEL_ANCHOR_DEPTH_MM = 50;

export function calculateMantolamaNeed({ area, materialKey, thicknessMm = 50, wasteRate = 5, buildingHeightM = 8 }) {
  const a = Math.max(0, safeNumber(area));
  const thickness = Math.max(0, safeNumber(thicknessMm, 50));
  const waste = Math.max(0, safeNumber(wasteRate, 5));
  const material = MANTOLAMA_MATERIALS[materialKey] || MANTOLAMA_MATERIALS.eps;

  const areaWithWaste = a * (1 + waste / 100);
  const boardCount = Math.ceil(areaWithWaste / material.boardAreaM2);
  const dubelPerM2 = pickDubelDensityPerM2(buildingHeightM);
  const dubelCount = Math.ceil(a * dubelPerM2);
  const fileM2 = round2(a * 1.1);
  const adhesiveKg = round2(a * 4.5);
  const plasterKg = round2(a * 5);
  const recommendedDubelLengthMm = Math.ceil(thickness + DUBEL_ADHESIVE_MM + DUBEL_PLASTER_ALLOWANCE_MM + DUBEL_ANCHOR_DEPTH_MM);

  return {
    areaWithWaste: round2(areaWithWaste),
    boardCount,
    dubelPerM2,
    dubelCount,
    fileM2,
    adhesiveKg,
    plasterKg,
    recommendedDubelLengthMm,
    materialLabel: material.label,
  };
}

// ── 14) Moloz/hafriyat hesaplama ──
// Kabarma oranları (fire payı), molozhatti.com.tr'nin "Hafriyat m³ Nasıl
// Hesaplanır?" rehberinde iş türüne göre verilen aralıkların orta noktalarıdır:
// iç mekân kırım (duvar/zemin yıkımı) %10-20 → %15, temel/derin kazı %20-35 →
// %27,5, dolgu/karışık zemin %25-40 → %32,5. Taşıma aracı kapasite seçenekleri
// (6/8/12/14/16/18 m³), hafriyat sektöründe yaygın kullanılan damper tipi
// kapasite sınıflandırmasından alınmıştır.
export const MOLOZ_TIERS = {
  'ic-mekan-kirim': { label: 'İç mekân kırım (duvar/zemin yıkımı)', kabarmaOrani: 15 },
  'temel-derin-kazi': { label: 'Temel/derin kazı', kabarmaOrani: 27.5 },
  'dolgu-karisik-zemin': { label: 'Dolgu/karışık zemin', kabarmaOrani: 32.5 },
};

export const TRUCK_CAPACITY_OPTIONS_M3 = [6, 8, 12, 14, 16, 18];

export function calculateDemolitionNetVolume({ length, width, thicknessCm }) {
  const l = Math.max(0, safeNumber(length));
  const w = Math.max(0, safeNumber(width));
  const thickness = Math.max(0, safeNumber(thicknessCm)) / 100;
  return round2(l * w * thickness);
}

export function calculateMolozVolume({ netVolumeM3, tierKey }) {
  const netVolume = Math.max(0, safeNumber(netVolumeM3));
  const tier = MOLOZ_TIERS[tierKey] || MOLOZ_TIERS['ic-mekan-kirim'];
  const looseVolumeM3 = netVolume * (1 + tier.kabarmaOrani / 100);

  return {
    netVolumeM3: round2(netVolume),
    looseVolumeM3: round2(looseVolumeM3),
    kabarmaOrani: tier.kabarmaOrani,
    tierLabel: tier.label,
  };
}

export function calculateTruckCount(looseVolumeM3, truckCapacityM3) {
  const volume = Math.max(0, safeNumber(looseVolumeM3));
  const capacity = Math.max(0.1, safeNumber(truckCapacityM3, 12));
  return Math.ceil(volume / capacity);
}

// ── 15) Demir/donatı ağırlık hesaplama ──
// Birim ağırlık (kg/m) = (π/4) × çap(m)² × çelik yoğunluğu (7850 kg/m³) — bu,
// TS 708 standardındaki inşaat demiri birim ağırlık tablosunun dayandığı temel
// fizik formülüdür (çubuk hacmi × yoğunluk). Bu oturumda formülle hesaplanan
// Ø8/Ø10/Ø12/Ø14/Ø16 değerleri (0,395 / 0,617 / 0,888 / 1,208 / 1,578 kg/m),
// yayınlanmış TS 708 birim ağırlık tablosundaki değerlerle birebir örtüştüğü
// doğrulanmıştır — bu yüzden sabit bir tablo yerine doğrudan formül kullanılır
// (her çap için ayrı ayrı hata riski taşıyan elle girilmiş bir tablo yerine).
export const STEEL_DENSITY_KG_PER_M3 = 7850;
export const STANDARD_REBAR_DIAMETERS_MM = [8, 10, 12, 14, 16, 18, 20, 22, 25, 28, 32];

export function calculateRebarWeight({ diameterMm, lengthM }) {
  const diameterM = Math.max(0, safeNumber(diameterMm)) / 1000;
  const length = Math.max(0, safeNumber(lengthM));

  const kgPerMeter = (Math.PI / 4) * diameterM * diameterM * STEEL_DENSITY_KG_PER_M3;
  const totalKg = kgPerMeter * length;

  return {
    kgPerMeter: Math.round(kgPerMeter * 1000) / 1000,
    totalKg: round2(totalKg),
    totalTon: Math.round((totalKg / 1000) * 10000) / 10000,
  };
}

// Kutu/dikdörtgen profil ağırlığı — dış ölçüler ve et kalınlığından kesit
// alanı bulunup aynı çelik yoğunluğuyla çarpılır (fiziksel formül, marka/
// üreticiden bağımsız).
export function calculateHollowProfileWeight({ outerWidthMm, outerHeightMm, wallThicknessMm, lengthM }) {
  const width = Math.max(0, safeNumber(outerWidthMm));
  const height = Math.max(0, safeNumber(outerHeightMm));
  const wall = Math.max(0, safeNumber(wallThicknessMm));
  const length = Math.max(0, safeNumber(lengthM));

  const innerWidth = Math.max(0, width - 2 * wall);
  const innerHeight = Math.max(0, height - 2 * wall);
  const crossSectionAreaMm2 = Math.max(0, width * height - innerWidth * innerHeight);
  const crossSectionAreaM2 = crossSectionAreaMm2 / 1_000_000;

  const kgPerMeter = crossSectionAreaM2 * STEEL_DENSITY_KG_PER_M3;
  const totalKg = kgPerMeter * length;

  return {
    kgPerMeter: Math.round(kgPerMeter * 1000) / 1000,
    totalKg: round2(totalKg),
    totalTon: Math.round((totalKg / 1000) * 10000) / 10000,
  };
}
