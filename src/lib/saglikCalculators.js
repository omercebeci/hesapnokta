// Sağlık kategorisi için saf hesaplama fonksiyonları.

import { GUNCEL_VERILER } from '../data/guncelVeriler.js';

const round1 = (value) => Math.round((Number(value) + Number.EPSILON) * 10) / 10;
const round2 = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;
const MS_PER_DAY_SAGLIK = 1000 * 60 * 60 * 24;

function parseDateSaglik(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function bmiCategory(bmi) {
  if (bmi < 18.5) return { label: 'Zayıf', tone: 'info' };
  if (bmi < 25) return { label: 'Normal', tone: 'success' };
  if (bmi < 30) return { label: 'Fazla kilolu', tone: 'warning' };
  if (bmi < 35) return { label: 'Obez (1. derece)', tone: 'danger' };
  if (bmi < 40) return { label: 'Obez (2. derece)', tone: 'danger' };
  return { label: 'Obez (3. derece)', tone: 'danger' };
}

// Vücut Kitle İndeksi = kilo (kg) / boy (m)^2
export function calculateBMI({ weightKg, heightCm }) {
  const weight = Number(weightKg);
  const heightM = Number(heightCm) / 100;
  if (!Number.isFinite(weight) || weight <= 0 || !Number.isFinite(heightM) || heightM <= 0) {
    return { bmi: 0, category: bmiCategory(0), idealWeightMin: 0, idealWeightMax: 0 };
  }
  const bmi = weight / (heightM * heightM);
  return {
    bmi: round1(bmi),
    category: bmiCategory(bmi),
    idealWeightMin: round1(18.5 * heightM * heightM),
    idealWeightMax: round1(24.9 * heightM * heightM),
  };
}

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
};

// Mifflin-St Jeor formülü ile bazal metabolizma hızı (BMR) ve günlük kalori ihtiyacı (TDEE).
export function calculateCalorieNeeds({ gender, weightKg, heightCm, age, activityLevel }) {
  const weight = Number(weightKg);
  const height = Number(heightCm);
  const years = Number(age);
  if (![weight, height, years].every((value) => Number.isFinite(value) && value > 0)) {
    return { bmr: 0, maintenanceCalories: 0, weightLossCalories: 0, weightGainCalories: 0 };
  }

  const genderOffset = gender === 'female' ? -161 : 5;
  const bmr = (10 * weight) + (6.25 * height) - (5 * years) + genderOffset;
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || ACTIVITY_MULTIPLIERS.moderate;
  const maintenanceCalories = bmr * multiplier;

  return {
    bmr: Math.round(bmr),
    maintenanceCalories: Math.round(maintenanceCalories),
    weightLossCalories: Math.round(maintenanceCalories - 500),
    weightGainCalories: Math.round(maintenanceCalories + 500),
  };
}

// Düzeltilmiş Broca formülü: (boy - 100) değerinden cinsiyete göre bir pay düşülür.
export function calculateIdealWeight({ heightCm, gender }) {
  const height = Number(heightCm);
  if (!Number.isFinite(height) || height <= 100) {
    return { idealWeight: 0 };
  }
  const base = height - 100;
  const deduction = gender === 'male' ? base * 0.10 : base * 0.15;
  return { idealWeight: round1(base - deduction) };
}

function bodyFatCategory(percentage, gender) {
  const ranges = gender === 'female'
    ? [[13, 'Esansiyel yağ'], [20, 'Atletik'], [24, 'Fit'], [31, 'Ortalama'], [Infinity, 'Yüksek']]
    : [[5, 'Esansiyel yağ'], [13, 'Atletik'], [17, 'Fit'], [24, 'Ortalama'], [Infinity, 'Yüksek']];
  const match = ranges.find(([limit]) => percentage < limit);
  return match ? match[1] : 'Yüksek';
}

// US Navy yöntemi: bel, boyun (ve kadınlarda kalça) çevresi ölçümüyle vücut yağ oranı tahmini.
export function calculateBodyFatPercentage({ gender, heightCm, neckCm, waistCm, hipCm }) {
  const height = Number(heightCm);
  const neck = Number(neckCm);
  const waist = Number(waistCm);
  const hip = Number(hipCm);
  const isFemale = gender === 'female';

  if (!Number.isFinite(height) || height <= 0 || !Number.isFinite(neck) || neck <= 0 || !Number.isFinite(waist) || waist <= 0) {
    return { valid: false };
  }
  if (isFemale && (!Number.isFinite(hip) || hip <= 0)) {
    return { valid: false };
  }

  let bodyFat;
  if (isFemale) {
    const term = waist + hip - neck;
    if (term <= 0) return { valid: false };
    bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(term) + 0.22100 * Math.log10(height)) - 450;
  } else {
    const term = waist - neck;
    if (term <= 0) return { valid: false };
    bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(term) + 0.15456 * Math.log10(height)) - 450;
  }

  if (!Number.isFinite(bodyFat)) return { valid: false };

  return {
    valid: true,
    bodyFatPercentage: round1(bodyFat),
    category: bodyFatCategory(bodyFat, gender),
  };
}

// Kural: kilogram başına 33 ml + aktivite süresine göre ek + sıcak iklim payı.
export function calculateWaterIntake({ weightKg, activityMinutes = 0, hotClimate = false }) {
  const weight = Number(weightKg);
  if (!Number.isFinite(weight) || weight <= 0) {
    return { totalMl: 0, baseMl: 0, activityBonusMl: 0, climateBonusMl: 0, totalLiters: 0, glasses: 0 };
  }
  const base = weight * 33;
  const activityBonus = Math.max(0, Number(activityMinutes) || 0) * 12;
  const climateBonus = hotClimate ? 500 : 0;
  const totalMl = base + activityBonus + climateBonus;

  return {
    baseMl: Math.round(base),
    activityBonusMl: Math.round(activityBonus),
    climateBonusMl: climateBonus,
    totalMl: Math.round(totalMl),
    totalLiters: round2(totalMl / 1000),
    glasses: Math.round(totalMl / 200),
  };
}

// Naegele kuralı: son adet tarihine (LMP) 280 gün (40 hafta) eklenerek tahmini doğum tarihi bulunur.
// Ortalama 28 günlük döngü varsayımıdır; kesin tarih için ultrason ölçümü daha güvenilirdir.
export function calculatePregnancy({ lastPeriodDate, referenceDate }) {
  const lmp = parseDateSaglik(lastPeriodDate);
  const reference = parseDateSaglik(referenceDate) || new Date();
  if (!lmp || lmp > reference) {
    return { valid: false };
  }

  const daysSince = Math.floor((reference.getTime() - lmp.getTime()) / MS_PER_DAY_SAGLIK);
  const weeks = Math.floor(daysSince / 7);
  const days = daysSince % 7;

  const dueDate = new Date(lmp);
  dueDate.setDate(dueDate.getDate() + 280);
  const daysRemaining = Math.max(0, Math.round((dueDate.getTime() - reference.getTime()) / MS_PER_DAY_SAGLIK));

  let trimester = 1;
  if (weeks >= 27) trimester = 3;
  else if (weeks >= 13) trimester = 2;

  return {
    valid: true,
    weeks,
    days,
    trimester,
    dueDate: dueDate.toISOString().slice(0, 10),
    daysRemaining,
  };
}

function addMinutesToTime(time, minutesDelta) {
  const [hours, minutes] = time.split(':').map(Number);
  let total = (hours * 60 + minutes + minutesDelta) % 1440;
  if (total < 0) total += 1440;
  const hh = Math.floor(total / 60);
  const mm = total % 60;
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

const SLEEP_CYCLE_MINUTES = 90;
const FALL_ASLEEP_MINUTES = 15;
const SLEEP_CYCLE_OPTIONS = [6, 5, 4, 3];

// 90 dakikalık uyku döngülerine göre; kalkış saati verilirse önerilen yatma saatlerini,
// yatma saati verilirse önerilen kalkış saatlerini hesaplar.
export function calculateSleepSchedule({ time, mode }) {
  if (!time || !/^\d{1,2}:\d{2}$/.test(time)) return { valid: false };
  const [hours, minutes] = time.split(':').map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return { valid: false };

  const options = SLEEP_CYCLE_OPTIONS.map((cycles) => {
    const totalMinutes = cycles * SLEEP_CYCLE_MINUTES + FALL_ASLEEP_MINUTES;
    const resultTime = mode === 'bedtime'
      ? addMinutesToTime(time, totalMinutes)
      : addMinutesToTime(time, -totalMinutes);
    return { cycles, sleepHours: round1(cycles * 1.5), time: resultTime };
  });

  return { valid: true, options };
}

// Yaygın içeceklerin ortalama kafein içeriği (mg), tek servis başına (EFSA/USDA referans değerleri).
export const CAFFEINE_SOURCES = {
  filtreKahve: { label: 'Filtre kahve (1 fincan, ~240 ml)', mg: 95 },
  espresso: { label: 'Espresso (1 shot)', mg: 63 },
  hazirKahve: { label: 'Hazır (instant) kahve (1 fincan)', mg: 30 },
  siyahCay: { label: 'Siyah çay (1 bardak)', mg: 47 },
  yesilCay: { label: 'Yeşil çay (1 bardak)', mg: 28 },
  enerjiIcecegi: { label: 'Enerji içeceği (1 kutu, ~250 ml)', mg: 80 },
  kola: { label: 'Kolalı gazoz (1 kutu, ~330 ml)', mg: 34 },
};

// EFSA'ya göre sağlıklı yetişkinlerde güvenli günlük üst sınır ~400 mg, gebelik/emzirmede ~200 mg'dır.
export function calculateCaffeineIntake({ items, isPregnant = false }) {
  const validItems = (items || [])
    .map((item) => ({ drinkType: item.drinkType, count: Number(item.count) }))
    .filter((item) => CAFFEINE_SOURCES[item.drinkType] && Number.isFinite(item.count) && item.count > 0);

  const totalMg = validItems.reduce((sum, item) => sum + item.count * CAFFEINE_SOURCES[item.drinkType].mg, 0);
  const safeLimitMg = isPregnant ? 200 : 400;
  const percentageOfLimit = (totalMg / safeLimitMg) * 100;

  return {
    totalMg: round1(totalMg),
    safeLimitMg,
    percentageOfLimit: round1(percentageOfLimit),
    isOverLimit: totalMg > safeLimitMg,
  };
}

// Yaklaşık formül: kalori ≈ adım × kilogram × 0,0005 (ortalama yürüyüş temposu varsayımıyla).
export function calculateStepsToCalories({ steps, weightKg, strideMeters = 0.75 }) {
  const stepCount = Math.max(0, Number(steps) || 0);
  const weight = Math.max(0, Number(weightKg) || 0);
  const stride = Math.max(0.1, Number(strideMeters) || 0.75);

  const distanceKm = (stepCount * stride) / 1000;
  const caloriesBurned = stepCount * weight * 0.0005;

  return {
    distanceKm: Math.round(distanceKm * 100) / 100,
    caloriesBurned: Math.round(caloriesBurned),
  };
}

// ═══════════════ Tansiyon / diyabet araçları ═══════════════
// Bu bölümdeki tüm eşik ve formül değerleri src/data/guncelVeriler.js dosyasından okunur;
// kılavuz güncellendiğinde tek değişiklik noktası orasıdır.

const BP_LADDER = GUNCEL_VERILER.tansiyonSiniflandirma.value.filter((item) => item.key !== 'izoleSistolik');
const BP_EMERGENCY = GUNCEL_VERILER.hipertansifAcilEsigi;
const BP_TONE_BY_KEY = {
  optimal: 'success',
  normal: 'success',
  yuksekNormal: 'warning',
  evre1: 'warning',
  evre2: 'danger',
  evre3: 'danger',
};

function bpRungIndex(value, axisMinKey) {
  let idx = 0;
  BP_LADDER.forEach((rung, i) => {
    const min = rung[axisMinKey];
    if (min !== undefined && value >= min) idx = i;
  });
  return idx;
}

// ESH 2023 / Türk Hipertansiyon Uzlaşı Raporu 2025 sınıflandırması: sistolik ve diastolik
// değerden hangisi daha ağır kategorideyse o kategori esas alınır ("worse of the two" kuralı).
export function classifyBloodPressure({ systolic, diastolic }) {
  const sys = Number(systolic);
  const dia = Number(diastolic);
  if (!Number.isFinite(sys) || sys <= 0 || sys > 300 || !Number.isFinite(dia) || dia <= 0 || dia > 200) {
    return { valid: false };
  }

  const rung = BP_LADDER[Math.max(bpRungIndex(sys, 'sistolikMin'), bpRungIndex(dia, 'diastolikMin'))];

  return {
    valid: true,
    systolic: sys,
    diastolic: dia,
    category: { key: rung.key, label: rung.label, tone: BP_TONE_BY_KEY[rung.key] || 'accent' },
    pulsePressure: round1(sys - dia),
    map: round1(dia + (sys - dia) / 3),
    isEmergencyRange: sys >= BP_EMERGENCY.sistolik || dia >= BP_EMERGENCY.diastolik,
    isIsolatedSystolic: sys >= 140 && dia < 90,
  };
}

// Ev tansiyon takibi: satır başına sabah/akşam ölçümü olabilir; genel, sabah ve akşam
// ortalamaları hesaplanır, kılavuz kategorisi genel ortalama üzerinden belirlenir.
export function calculateBloodPressureAverages(rows) {
  const readings = [];
  const morning = [];
  const evening = [];
  let dayCount = 0;

  (rows || []).forEach((row) => {
    const mSys = Number(row.morningSys);
    const mDia = Number(row.morningDia);
    const eSys = Number(row.eveningSys);
    const eDia = Number(row.eveningDia);
    let hasReading = false;

    if (Number.isFinite(mSys) && mSys > 0 && Number.isFinite(mDia) && mDia > 0) {
      morning.push({ sys: mSys, dia: mDia });
      readings.push({ sys: mSys, dia: mDia });
      hasReading = true;
    }
    if (Number.isFinite(eSys) && eSys > 0 && Number.isFinite(eDia) && eDia > 0) {
      evening.push({ sys: eSys, dia: eDia });
      readings.push({ sys: eSys, dia: eDia });
      hasReading = true;
    }
    if (hasReading) dayCount += 1;
  });

  if (readings.length === 0) return { valid: false };

  const avg = (list, key) => round1(list.reduce((sum, item) => sum + item[key], 0) / list.length);
  const overallAvgSys = avg(readings, 'sys');
  const overallAvgDia = avg(readings, 'dia');

  return {
    valid: true,
    dayCount,
    readingCount: readings.length,
    overallAvgSys,
    overallAvgDia,
    morningAvgSys: morning.length ? avg(morning, 'sys') : null,
    morningAvgDia: morning.length ? avg(morning, 'dia') : null,
    eveningAvgSys: evening.length ? avg(evening, 'sys') : null,
    eveningAvgDia: evening.length ? avg(evening, 'dia') : null,
    assessment: classifyBloodPressure({ systolic: overallAvgSys, diastolic: overallAvgDia }),
  };
}

const SALT_DATA = GUNCEL_VERILER.tuzSodyumLimiti;

// mode: 'sodiumToSalt' (girdi mg sodyum) | 'saltToSodium' (girdi g tuz).
export function convertSaltSodium({ mode, value }) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 0) return { valid: false };

  const katsayi = SALT_DATA.sodyumdanTuzaKatsayi;
  const saltG = mode === 'saltToSodium' ? amount : round2((amount / 1000) * katsayi);
  const sodiumMg = mode === 'saltToSodium' ? round1((amount / katsayi) * 1000) : amount;

  return {
    valid: true,
    sodiumMg: round1(sodiumMg),
    saltG,
    percentOfDailyLimit: round1((saltG / SALT_DATA.gunlukTuzGramLimiti) * 100),
    dailyLimitSaltG: SALT_DATA.gunlukTuzGramLimiti,
    dailyLimitSodiumMg: SALT_DATA.gunlukSodyumMgLimiti,
    isOverDailyLimit: saltG > SALT_DATA.gunlukTuzGramLimiti,
  };
}

const A1C_FORMULA = GUNCEL_VERILER.hba1cOrtalamaGlukozFormulu;
const DIABETES_THRESHOLDS = GUNCEL_VERILER.diyabetTaniEsikleri.value;
const HYPO_DATA = GUNCEL_VERILER.hipoglisemiEsikleri;
const HYPER_EMERGENCY_DATA = GUNCEL_VERILER.hiperglisemiAcilEsigi;

function classifyA1c(a1c) {
  if (a1c >= DIABETES_THRESHOLDS.diyabet.a1cMin) return { key: 'diyabet', label: 'Diyabet aralığı', tone: 'danger' };
  if (a1c >= DIABETES_THRESHOLDS.prediyabet.a1cMin) return { key: 'prediyabet', label: 'Prediyabet aralığı', tone: 'warning' };
  return { key: 'normal', label: 'Normal aralık', tone: 'success' };
}

// ADAG formülü (eAG mg/dL = 28,7 × HbA1c − 46,7) ile iki yönlü dönüşüm.
// mode: 'a1cToGlucose' | 'glucoseToA1c'. glukozBirim yalnızca glucoseToA1c'de kullanılır.
export function convertHbA1cGlucose({ mode, value, glukozBirim = 'mgdl' }) {
  const input = Number(value);
  if (!Number.isFinite(input) || input <= 0) return { valid: false };

  let a1cPercent;
  let eAGmgdl;
  if (mode === 'glucoseToA1c') {
    eAGmgdl = glukozBirim === 'mmoll' ? input * 18 : input;
    a1cPercent = (eAGmgdl + A1C_FORMULA.sabit) / A1C_FORMULA.katsayi;
  } else {
    a1cPercent = input;
    eAGmgdl = A1C_FORMULA.katsayi * a1cPercent - A1C_FORMULA.sabit;
  }

  if (!Number.isFinite(eAGmgdl) || eAGmgdl <= 0 || !Number.isFinite(a1cPercent) || a1cPercent <= 0) {
    return { valid: false };
  }

  return {
    valid: true,
    a1cPercent: round1(a1cPercent),
    eAGmgdl: round1(eAGmgdl),
    eAGmmol: round1(eAGmgdl / 18),
    category: classifyA1c(a1cPercent),
  };
}

// Satır bazlı açlık/tokluk şeker günlüğü: ortalamalar + ADAG formülüyle tahmini HbA1c
// karşılığı. Hipoglisemi eşiğinin altındaki değerler satır bazında ayrıca işaretlenir.
export function calculateGlucoseLog(rows) {
  const allReadings = [];
  const fastingReadings = [];
  const postprandialReadings = [];
  let hasLow = false;
  let hasSevereLow = false;
  let hasVeryHigh = false;

  const flaggedRows = (rows || []).map((row) => {
    const fasting = Number(row.fasting);
    const postprandial = Number(row.postprandial);
    const validFasting = Number.isFinite(fasting) && fasting > 0 && fasting < 700;
    const validPostprandial = Number.isFinite(postprandial) && postprandial > 0 && postprandial < 700;

    if (validFasting) { fastingReadings.push(fasting); allReadings.push(fasting); }
    if (validPostprandial) { postprandialReadings.push(postprandial); allReadings.push(postprandial); }

    const rowHasLow = (validFasting && fasting < HYPO_DATA.seviye1UyariEsigi) || (validPostprandial && postprandial < HYPO_DATA.seviye1UyariEsigi);
    const rowHasSevereLow = (validFasting && fasting < HYPO_DATA.seviye2CiddiEsik) || (validPostprandial && postprandial < HYPO_DATA.seviye2CiddiEsik);
    const rowHasVeryHigh = (validFasting && fasting >= HYPER_EMERGENCY_DATA.esikMgdl) || (validPostprandial && postprandial >= HYPER_EMERGENCY_DATA.esikMgdl);
    if (rowHasLow) hasLow = true;
    if (rowHasSevereLow) hasSevereLow = true;
    if (rowHasVeryHigh) hasVeryHigh = true;

    return { ...row, validFasting, validPostprandial, hasLow: rowHasLow, hasSevereLow: rowHasSevereLow, hasVeryHigh: rowHasVeryHigh };
  });

  if (allReadings.length === 0) return { valid: false };

  const avg = (list) => round1(list.reduce((sum, v) => sum + v, 0) / list.length);
  const overallAvg = avg(allReadings);
  const estimatedA1c = round1((overallAvg + A1C_FORMULA.sabit) / A1C_FORMULA.katsayi);

  return {
    valid: true,
    rows: flaggedRows,
    avgFasting: fastingReadings.length ? avg(fastingReadings) : null,
    avgPostprandial: postprandialReadings.length ? avg(postprandialReadings) : null,
    overallAvg,
    estimatedA1c: estimatedA1c > 0 ? estimatedA1c : null,
    hasLow,
    hasSevereLow,
    hasVeryHigh,
  };
}

export const CARB_MEAL_OPTIONS = [
  { key: 'kahvalti', label: 'Kahvaltı' },
  { key: 'araSabah', label: 'Ara öğün (sabah)' },
  { key: 'ogle', label: 'Öğle yemeği' },
  { key: 'araOgleden', label: 'Ara öğün (öğleden sonra)' },
  { key: 'aksam', label: 'Akşam yemeği' },
  { key: 'araGece', label: 'Ara öğün (gece)' },
];

// Öğün başına ve gün geneli karbonhidrat toplamı. Karb gramları kullanıcı tarafından
// etiket/diyetisyen listesinden girilir; site bir gıda veritabanı veya doz önerisi sunmaz.
export function calculateCarbCounting(rows) {
  const mealTotals = new Map(CARB_MEAL_OPTIONS.map((meal) => [meal.key, 0]));
  let dailyTotal = 0;
  let itemCount = 0;

  (rows || []).forEach((row) => {
    const grams = Number(row.carbGrams);
    if (!Number.isFinite(grams) || grams <= 0) return;
    const mealKey = mealTotals.has(row.meal) ? row.meal : CARB_MEAL_OPTIONS[0].key;
    mealTotals.set(mealKey, mealTotals.get(mealKey) + grams);
    dailyTotal += grams;
    itemCount += 1;
  });

  return {
    valid: itemCount > 0,
    itemCount,
    dailyTotal: round1(dailyTotal),
    mealTotals: CARB_MEAL_OPTIONS
      .map((meal) => ({ key: meal.key, label: meal.label, total: round1(mealTotals.get(meal.key)) }))
      .filter((meal) => meal.total > 0),
  };
}
