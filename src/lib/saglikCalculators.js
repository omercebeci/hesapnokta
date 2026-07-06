// Sağlık kategorisi için saf hesaplama fonksiyonları.

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
