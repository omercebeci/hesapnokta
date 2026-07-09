// Günlük Yaşam kategorisi için saf hesaplama fonksiyonları.

import { GUNCEL_VERILER } from '../data/guncelVeriler.js';

const round2 = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;
const safeNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};
const MS_PER_DAY = 1000 * 60 * 60 * 24;
const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

// Cihazın watt gücü ve günlük kullanım saatine göre aylık elektrik tüketimi ve maliyetini hesaplar.
export function calculateElectricityCost({ watt, hoursPerDay, daysPerMonth = 30, pricePerKwh }) {
  const power = Math.max(0, safeNumber(watt));
  const hours = Math.max(0, safeNumber(hoursPerDay));
  const days = Math.max(1, safeNumber(daysPerMonth, 30));
  const price = Math.max(0, safeNumber(pricePerKwh));

  const dailyKwh = (power * hours) / 1000;
  const monthlyKwh = dailyKwh * days;
  const monthlyCost = monthlyKwh * price;

  return {
    dailyKwh: round2(dailyKwh),
    monthlyKwh: round2(monthlyKwh),
    monthlyCost: round2(monthlyCost),
  };
}

// Bir yolculuğun toplam yakıt maliyetini hesaplayıp araçtaki kişi sayısına böler.
export function calculateFuelSplitCost({ distanceKm, consumptionPer100Km, fuelPrice, peopleCount }) {
  const distance = Math.max(0, safeNumber(distanceKm));
  const consumption = Math.max(0, safeNumber(consumptionPer100Km));
  const price = Math.max(0, safeNumber(fuelPrice));
  const people = Math.max(1, Math.floor(safeNumber(peopleCount, 1)));

  const fuelNeeded = (distance * consumption) / 100;
  const totalCost = fuelNeeded * price;
  const perPerson = totalCost / people;

  return {
    fuelNeeded: round2(fuelNeeded),
    totalCost: round2(totalCost),
    perPerson: round2(perPerson),
  };
}

// Oda ölçülerine göre zemin alanını (halı/döşeme için) ve duvar alanına göre boya ihtiyacını hesaplar.
export function calculateRoomMaterials({ length, width, height, paintCoveragePerLiter = 10, coatCount = 2, wasteRate = 10 }) {
  const l = Math.max(0, safeNumber(length));
  const w = Math.max(0, safeNumber(width));
  const h = Math.max(0, safeNumber(height));
  const coverage = Math.max(0.1, safeNumber(paintCoveragePerLiter, 10));
  const coats = Math.max(1, safeNumber(coatCount, 2));
  const waste = Math.max(0, safeNumber(wasteRate, 10));

  const floorArea = l * w;
  const wallArea = 2 * (l + w) * h;
  const netPaintLiters = (wallArea * coats) / coverage;
  const totalPaintLiters = netPaintLiters * (1 + waste / 100);

  return {
    floorArea: round2(floorArea),
    wallArea: round2(wallArea),
    totalPaintLiters: round2(totalPaintLiters),
  };
}

// ── Doğalgaz tüketimi hesaplama ──
// Enerji (kWh) = Düzeltilmiş hacim (m³) × Üst ısıl değer (kcal/m³) / 860,42 (kcal/kWh).
const GAS_HEATING_VALUE_KCAL_M3 = GUNCEL_VERILER.dogalgazDonusum.ustIsilDegerKcalM3;
const GAS_CORRECTION_FACTOR = GUNCEL_VERILER.dogalgazDonusum.duzeltmeKatsayisi;
const GAS_KCAL_TO_KWH = GUNCEL_VERILER.dogalgazDonusum.kcalToKwh;

export function calculateNaturalGasCost({ m3, pricePerM3, heatingValueKcalM3 = GAS_HEATING_VALUE_KCAL_M3, correctionFactor = GAS_CORRECTION_FACTOR }) {
  const volume = Math.max(0, safeNumber(m3));
  const price = Math.max(0, safeNumber(pricePerM3));
  const heatingValue = Math.max(0, safeNumber(heatingValueKcalM3, GAS_HEATING_VALUE_KCAL_M3));
  const correction = Math.max(0, safeNumber(correctionFactor, GAS_CORRECTION_FACTOR));

  const correctedVolume = volume * correction;
  const kwh = (correctedVolume * heatingValue) / GAS_KCAL_TO_KWH;
  const monthlyCost = volume * price;
  const costPerKwh = kwh > 0 ? monthlyCost / kwh : 0;

  return {
    kwh: round2(kwh),
    monthlyCost: round2(monthlyCost),
    costPerKwh: round2(costPerKwh),
  };
}

// ── Ev arkadaşı kira/fatura bölüşme ──
// "equal" modunda tutar kişi sayısına eşit bölünür, "weighted" modunda her kişinin
// ağırlığı (oda büyüklüğü, gelir vb.) oranında paylaştırılır.
export function calculateRoommateSplit({ items, people, mode = 'equal' }) {
  const total = (items || []).reduce((sum, item) => sum + Math.max(0, safeNumber(item.amount)), 0);
  const roommates = people || [];
  const totalWeight = roommates.reduce((sum, person) => sum + Math.max(0, safeNumber(person.weight)), 0);
  const equalShare = roommates.length > 0 ? total / roommates.length : 0;

  const breakdown = roommates.map((person) => {
    const share = mode === 'weighted' && totalWeight > 0
      ? total * (Math.max(0, safeNumber(person.weight)) / totalWeight)
      : equalShare;
    return {
      name: person.name,
      amount: round2(share),
      ratio: total > 0 ? round2((share / total) * 100) : 0,
    };
  });

  return {
    total: round2(total),
    breakdown,
  };
}

// ── Abonelik maliyeti hesaplama ──
const MIN_WAGE_NET_DAILY = GUNCEL_VERILER.asgariUcret.netAylik.value / 30;

export function calculateSubscriptionCost(subscriptions) {
  const list = subscriptions || [];

  const breakdown = list.map((item) => {
    const monthlyAmount = Math.max(0, safeNumber(item.monthlyAmount));
    return {
      name: item.name,
      monthlyAmount: round2(monthlyAmount),
      yearlyAmount: round2(monthlyAmount * 12),
    };
  });

  const monthlyTotal = breakdown.reduce((sum, item) => sum + item.monthlyAmount, 0);
  const yearlyTotal = monthlyTotal * 12;
  const minWageDaysPerYear = MIN_WAGE_NET_DAILY > 0 ? yearlyTotal / MIN_WAGE_NET_DAILY : 0;

  return {
    breakdown,
    monthlyTotal: round2(monthlyTotal),
    yearlyTotal: round2(yearlyTotal),
    minWageDaysPerYear: round2(minWageDaysPerYear),
  };
}

// ── Araç sahip olma maliyeti hesaplama ──
export function calculateVehicleOwnershipCost({ mtv, sigorta, kasko, bakim, lastik, yakit, kmPerYear }) {
  const rawBreakdown = [
    { label: 'MTV', amount: mtv },
    { label: 'Sigorta', amount: sigorta },
    { label: 'Kasko', amount: kasko },
    { label: 'Bakım', amount: bakim },
    { label: 'Lastik', amount: lastik },
    { label: 'Yakıt', amount: yakit },
  ].map((item) => ({ label: item.label, amount: round2(Math.max(0, safeNumber(item.amount))) }));

  const total = rawBreakdown.reduce((sum, item) => sum + item.amount, 0);
  const km = Math.max(0, safeNumber(kmPerYear));

  return {
    breakdown: rawBreakdown.map((item) => ({ ...item, ratio: total > 0 ? round2((item.amount / total) * 100) : 0 })),
    yearlyTotal: round2(total),
    perKm: km > 0 ? round2(total / km) : 0,
    perMonth: round2(total / 12),
  };
}

// ── Elektrikli araç şarj maliyeti hesaplama ──
export function calculateEvChargingCost({ batteryCapacityKwh, consumptionPer100Km, homePricePerKwh, stationPricePerKwh, fuelConsumptionPer100Km, fuelPrice }) {
  const battery = Math.max(0, safeNumber(batteryCapacityKwh));
  const consumption = Math.max(0, safeNumber(consumptionPer100Km));
  const homePrice = Math.max(0, safeNumber(homePricePerKwh));
  const stationPrice = Math.max(0, safeNumber(stationPricePerKwh));
  const fuelConsumption = Math.max(0, safeNumber(fuelConsumptionPer100Km));
  const fuelPriceValue = Math.max(0, safeNumber(fuelPrice));

  const cost100KmHome = consumption * homePrice;
  const cost100KmStation = stationPrice > 0 ? consumption * stationPrice : null;
  const gasolineCost100Km = fuelConsumption * fuelPriceValue;

  return {
    fullChargeCostHome: round2(battery * homePrice),
    cost100KmHome: round2(cost100KmHome),
    cost100KmStation: cost100KmStation !== null ? round2(cost100KmStation) : null,
    gasolineCost100Km: gasolineCost100Km > 0 ? round2(gasolineCost100Km) : null,
    savingsPer100KmVsGasoline: gasolineCost100Km > 0 ? round2(gasolineCost100Km - cost100KmHome) : null,
  };
}

// ── Trafik cezası erken ödeme hesaplama ──
const TRAFFIC_FINE_DISCOUNT_RATE = GUNCEL_VERILER.trafikCezasiErkenOdeme.indirimOrani;
const TRAFFIC_FINE_DAY_LIMIT = GUNCEL_VERILER.trafikCezasiErkenOdeme.gunSayisi;

export function calculateTrafficFineDiscount({ amount }) {
  const value = Math.max(0, safeNumber(amount));
  const discountAmount = value * TRAFFIC_FINE_DISCOUNT_RATE;

  return {
    discountAmount: round2(discountAmount),
    discountedAmount: round2(value - discountAmount),
    discountRate: round2(TRAFFIC_FINE_DISCOUNT_RATE * 100),
    dayLimit: TRAFFIC_FINE_DAY_LIMIT,
  };
}

// ── Tarif porsiyon ölçekleme ──
export function calculateRecipeScale({ originalServings, targetServings, ingredients }) {
  const original = Math.max(0.01, safeNumber(originalServings, 1));
  const target = Math.max(0, safeNumber(targetServings, original));
  const ratio = target / original;

  const scaledIngredients = (ingredients || []).map((ingredient) => {
    const originalAmount = Math.max(0, safeNumber(ingredient.amount));
    return {
      name: ingredient.name,
      unit: ingredient.unit,
      originalAmount: round2(originalAmount),
      scaledAmount: round2(originalAmount * ratio),
    };
  });

  return { ratio: round2(ratio), scaledIngredients };
}

// ── Mutfak ölçü çevirici ──
// Gram/ml karşılıkları Türk mutfağı için yaygın kullanılan standart ölçü tablolarından alınmıştır
// (sıvılarda ml ≈ gram kabul edilir).
export const KITCHEN_MEASURES_GRAM = {
  un: { bardak: 130, cayBardagi: 65, yemekKasigi: 9, tatliKasigi: 3, gram: 1 },
  seker: { bardak: 200, cayBardagi: 100, yemekKasigi: 12.5, tatliKasigi: 4, gram: 1 },
  tuz: { bardak: 220, cayBardagi: 110, yemekKasigi: 18, tatliKasigi: 6, gram: 1 },
  pirinc: { bardak: 190, cayBardagi: 95, yemekKasigi: 12, tatliKasigi: 4, gram: 1 },
  sivi: { bardak: 200, cayBardagi: 100, yemekKasigi: 15, tatliKasigi: 5, gram: 1 },
};

export function convertKitchenMeasure({ ingredientType, amount, fromUnit, toUnit }) {
  const table = KITCHEN_MEASURES_GRAM[ingredientType];
  if (!table) return null;

  const value = Math.max(0, safeNumber(amount));
  const grams = value * (table[fromUnit] ?? 1);
  const convertedAmount = grams / (table[toUnit] ?? 1);

  return { grams: round2(grams), convertedAmount: round2(convertedAmount) };
}

// ── Evcil hayvan yaşı hesaplama ──
// AAHA/International Cat Care'in kabul ettiği "15-9-4" kuralı (kedi) ve aynı ilk-iki-yıl
// eğrisinin köpeklerde boyuta göre farklılaşan yıllık artışla uygulanması (15-9-boyut kuralı).
const PET_YEAR_1 = 15;
const PET_YEAR_2_ADD = 9;
const CAT_YEAR_AFTER = 4;
const DOG_SIZE_AFTER_YEAR_RATE = { kucuk: 4, orta: 5, buyuk: 6, dev: 7 };

export function calculateCatHumanAge(catYears) {
  const years = Math.max(0, safeNumber(catYears));
  if (years <= 0) return 0;
  if (years <= 1) return round2(PET_YEAR_1 * years);
  if (years <= 2) return round2(PET_YEAR_1 + PET_YEAR_2_ADD * (years - 1));
  return round2(PET_YEAR_1 + PET_YEAR_2_ADD + CAT_YEAR_AFTER * (years - 2));
}

export function calculateDogHumanAge({ dogYears, sizeCategory = 'orta' }) {
  const years = Math.max(0, safeNumber(dogYears));
  const rate = DOG_SIZE_AFTER_YEAR_RATE[sizeCategory] ?? DOG_SIZE_AFTER_YEAR_RATE.orta;
  if (years <= 0) return 0;
  if (years <= 1) return round2(PET_YEAR_1 * years);
  if (years <= 2) return round2(PET_YEAR_1 + PET_YEAR_2_ADD * (years - 1));
  return round2(PET_YEAR_1 + PET_YEAR_2_ADD + rate * (years - 2));
}

// ── Askerlik terhis tarihi hesaplama ──
const ASKERLIK_SURELERI = GUNCEL_VERILER.askerlikHizmetSureleri.value;

export function calculateDischargeDate({ sevkTarihi, tur = 'er', referenceDate }) {
  const startDate = parseDate(sevkTarihi);
  if (!startDate) return null;

  const config = ASKERLIK_SURELERI[tur] || ASKERLIK_SURELERI.er;
  const dischargeDate = new Date(startDate);
  if (config.ay) {
    dischargeDate.setMonth(dischargeDate.getMonth() + config.ay);
  } else if (config.gun) {
    dischargeDate.setDate(dischargeDate.getDate() + config.gun);
  }

  const reference = parseDate(referenceDate) || new Date();
  const dischargeMidnight = new Date(dischargeDate.getFullYear(), dischargeDate.getMonth(), dischargeDate.getDate()).getTime();
  const referenceMidnight = new Date(reference.getFullYear(), reference.getMonth(), reference.getDate()).getTime();
  const remainingDays = Math.round((dischargeMidnight - referenceMidnight) / MS_PER_DAY);

  return {
    dischargeDate: dischargeDate.toISOString().slice(0, 10),
    remainingDays,
  };
}
