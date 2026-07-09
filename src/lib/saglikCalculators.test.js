import { describe, expect, it } from 'vitest';
import {
  calculateBMI,
  calculateCalorieNeeds,
  calculateIdealWeight,
  calculateBodyFatPercentage,
  calculateWaterIntake,
  calculatePregnancy,
  calculateSleepSchedule,
  calculateCaffeineIntake,
  calculateStepsToCalories,
  classifyBloodPressure,
  calculateBloodPressureAverages,
  convertSaltSodium,
  convertHbA1cGlucose,
  calculateGlucoseLog,
  calculateCarbCounting,
  sortRowsByDate,
  filterRowsByRecency,
  buildBloodPressureTrendPoints,
  calculateBloodPressureStats,
  buildGlucoseTrendPoints,
  calculateGlucoseStats,
} from './saglikCalculators.js';

describe('sağlık hesaplayıcıları', () => {
  it('vücut kitle indeksini ve ideal kilo aralığını hesaplar', () => {
    expect(calculateBMI({ weightKg: 70, heightCm: 170 })).toEqual({
      bmi: 24.2,
      category: { label: 'Normal', tone: 'success' },
      idealWeightMin: 53.5,
      idealWeightMax: 72,
    });
  });

  it('geçersiz girdilerde sıfır sonuç döner', () => {
    expect(calculateBMI({ weightKg: 0, heightCm: 170 }).bmi).toBe(0);
  });

  it('Mifflin-St Jeor formülü ile günlük kalori ihtiyacını hesaplar', () => {
    expect(calculateCalorieNeeds({ gender: 'female', weightKg: 65, heightCm: 165, age: 30, activityLevel: 'moderate' })).toEqual({
      bmr: 1370,
      maintenanceCalories: 2124,
      weightLossCalories: 1624,
      weightGainCalories: 2624,
    });
  });

  it('düzeltilmiş Broca formülüyle ideal kiloyu hesaplar (erkek)', () => {
    expect(calculateIdealWeight({ heightCm: 180, gender: 'male' })).toEqual({ idealWeight: 72 });
  });

  it('düzeltilmiş Broca formülüyle ideal kiloyu hesaplar (kadın)', () => {
    expect(calculateIdealWeight({ heightCm: 165, gender: 'female' })).toEqual({ idealWeight: 55.3 });
  });

  it('US Navy yöntemiyle erkek vücut yağ oranını hesaplar', () => {
    expect(calculateBodyFatPercentage({ gender: 'male', heightCm: 180, neckCm: 38, waistCm: 85 })).toEqual({
      valid: true,
      bodyFatPercentage: 16.1,
      category: 'Fit',
    });
  });

  it('US Navy yöntemiyle kadın vücut yağ oranını hesaplar', () => {
    expect(calculateBodyFatPercentage({ gender: 'female', heightCm: 165, neckCm: 32, waistCm: 70, hipCm: 95 })).toEqual({
      valid: true,
      bodyFatPercentage: 24.9,
      category: 'Ortalama',
    });
  });

  it('kadın için kalça ölçüsü eksikse geçersiz sonuç döner', () => {
    expect(calculateBodyFatPercentage({ gender: 'female', heightCm: 165, neckCm: 32, waistCm: 70 })).toEqual({ valid: false });
  });

  it('günlük su ihtiyacını kilo ve aktiviteye göre hesaplar', () => {
    expect(calculateWaterIntake({ weightKg: 70, activityMinutes: 30, hotClimate: false })).toEqual({
      baseMl: 2310,
      activityBonusMl: 360,
      climateBonusMl: 0,
      totalMl: 2670,
      totalLiters: 2.67,
      glasses: 13,
    });
  });

  it('Naegele kuralıyla gebelik haftası ve tahmini doğum tarihini hesaplar', () => {
    expect(calculatePregnancy({ lastPeriodDate: '2026-01-01', referenceDate: '2026-04-01' })).toEqual({
      valid: true,
      weeks: 12,
      days: 6,
      trimester: 1,
      dueDate: '2026-10-08',
      daysRemaining: 190,
    });
  });

  it('kalkış saatine göre önerilen yatma saatlerini hesaplar', () => {
    expect(calculateSleepSchedule({ time: '07:00', mode: 'wakeup' })).toEqual({
      valid: true,
      options: [
        { cycles: 6, sleepHours: 9, time: '21:45' },
        { cycles: 5, sleepHours: 7.5, time: '23:15' },
        { cycles: 4, sleepHours: 6, time: '00:45' },
        { cycles: 3, sleepHours: 4.5, time: '02:15' },
      ],
    });
  });

  it('yatma saatine göre önerilen kalkış saatlerini hesaplar', () => {
    expect(calculateSleepSchedule({ time: '23:00', mode: 'bedtime' })).toEqual({
      valid: true,
      options: [
        { cycles: 6, sleepHours: 9, time: '08:15' },
        { cycles: 5, sleepHours: 7.5, time: '06:45' },
        { cycles: 4, sleepHours: 6, time: '05:15' },
        { cycles: 3, sleepHours: 4.5, time: '03:45' },
      ],
    });
  });

  it('birden fazla içecekten toplam günlük kafein miktarını hesaplar', () => {
    expect(calculateCaffeineIntake({ items: [{ drinkType: 'filtreKahve', count: 2 }, { drinkType: 'kola', count: 1 }], isPregnant: false })).toEqual({
      totalMg: 224,
      safeLimitMg: 400,
      percentageOfLimit: 56,
      isOverLimit: false,
    });
  });

  it('gebelikte güvenli kafein sınırını 200 mg olarak uygular', () => {
    expect(calculateCaffeineIntake({ items: [{ drinkType: 'espresso', count: 3 }], isPregnant: true })).toEqual({
      totalMg: 189,
      safeLimitMg: 200,
      percentageOfLimit: 94.5,
      isOverLimit: false,
    });
  });

  it('adım sayısını mesafe ve kaloriye çevirir', () => {
    expect(calculateStepsToCalories({ steps: 10000, weightKg: 70, strideMeters: 0.75 })).toEqual({
      distanceKm: 7.5,
      caloriesBurned: 350,
    });
  });

  describe('tansiyon değerlendirme', () => {
    it('optimal aralığı doğru sınıflandırır', () => {
      const result = classifyBloodPressure({ systolic: 115, diastolic: 75 });
      expect(result.category).toEqual({ key: 'optimal', label: 'Optimal', tone: 'success' });
      expect(result.isEmergencyRange).toBe(false);
    });

    it('sistolik ve diastolikten daha ağır olanı esas alır (evre 1)', () => {
      const result = classifyBloodPressure({ systolic: 150, diastolic: 85 });
      expect(result.category.key).toBe('evre1');
      expect(result.isIsolatedSystolic).toBe(true);
    });

    it('nabız basıncı ve ortalama arter basıncını hesaplar', () => {
      const result = classifyBloodPressure({ systolic: 140, diastolic: 90 });
      expect(result.pulsePressure).toBe(50);
      expect(result.map).toBe(106.7);
    });

    it('KRİTİK EŞİK: 180/120 mmHg ve üzerini acil aralık olarak işaretler', () => {
      const result = classifyBloodPressure({ systolic: 182, diastolic: 121 });
      expect(result.category.key).toBe('evre3');
      expect(result.category.tone).toBe('danger');
      expect(result.isEmergencyRange).toBe(true);
    });

    it('KRİTİK EŞİK: yalnızca diastolik 120 üzerindeyse de acil aralık sayılır', () => {
      expect(classifyBloodPressure({ systolic: 160, diastolic: 121 }).isEmergencyRange).toBe(true);
    });

    it('180/120 sınır değerinin altında acil aralık tetiklenmez', () => {
      expect(classifyBloodPressure({ systolic: 179, diastolic: 119 }).isEmergencyRange).toBe(false);
    });

    it('geçersiz girdilerde valid:false döner', () => {
      expect(classifyBloodPressure({ systolic: 0, diastolic: 80 }).valid).toBe(false);
      expect(classifyBloodPressure({ systolic: 120, diastolic: -5 }).valid).toBe(false);
    });
  });

  describe('ev tansiyon ölçüm ortalaması', () => {
    it('sabah/akşam ve genel ortalamayı hesaplar', () => {
      const rows = [
        { morningSys: '130', morningDia: '85', eveningSys: '120', eveningDia: '78' },
        { morningSys: '134', morningDia: '87' },
      ];
      const result = calculateBloodPressureAverages(rows);
      expect(result.valid).toBe(true);
      expect(result.dayCount).toBe(2);
      expect(result.readingCount).toBe(3);
      expect(result.morningAvgSys).toBe(132);
      expect(result.eveningAvgSys).toBe(120);
      expect(result.assessment.category.key).toBeDefined();
    });

    it('KRİTİK EŞİK: genel ortalama 180/120 üzerindeyse acil aralık işaretlenir', () => {
      const rows = [
        { morningSys: '190', morningDia: '125' },
        { eveningSys: '188', eveningDia: '123' },
      ];
      const result = calculateBloodPressureAverages(rows);
      expect(result.assessment.isEmergencyRange).toBe(true);
    });

    it('hiç geçerli ölçüm yoksa valid:false döner', () => {
      expect(calculateBloodPressureAverages([{ morningSys: '', morningDia: '' }]).valid).toBe(false);
    });
  });

  describe('ölçüm günlüğü yardımcıları: sıralama ve son N gün filtresi', () => {
    it('sortRowsByDate satırları tarihe göre artan sıraya koyar, tarihsizleri sona atar', () => {
      const rows = [{ date: '2026-07-05' }, { date: '2026-07-01' }, { date: '' }, { date: '2026-07-03' }];
      expect(sortRowsByDate(rows).map((r) => r.date)).toEqual(['2026-07-01', '2026-07-03', '2026-07-05', '']);
    });

    it('filterRowsByRecency en son tarihten geriye N günü alır', () => {
      const rows = [
        { date: '2026-06-20', v: 1 },
        { date: '2026-06-30', v: 2 },
        { date: '2026-07-01', v: 3 },
      ];
      const result = filterRowsByRecency(rows, 7);
      expect(result.map((r) => r.v)).toEqual([2, 3]);
    });

    it('days verilmezse tüm satırları döndürür', () => {
      const rows = [{ date: '2026-07-01' }];
      expect(filterRowsByRecency(rows, null)).toBe(rows);
    });
  });

  describe('tansiyon trend noktaları ve istatistik kartı', () => {
    it('buildBloodPressureTrendPoints günlük sistolik/diastolik noktaları tarihe göre sıralı üretir', () => {
      const rows = [
        { date: '2026-07-02', morningSys: '130', morningDia: '85', eveningSys: '120', eveningDia: '78' },
        { date: '2026-07-01', morningSys: '134', morningDia: '87' },
        { date: '2026-07-03', eveningSys: '', eveningDia: '' },
      ];
      const points = buildBloodPressureTrendPoints(rows);
      expect(points).toEqual([
        { date: '2026-07-01', sistolik: 134, diastolik: 87 },
        { date: '2026-07-02', sistolik: 125, diastolik: 81.5 },
      ]);
    });

    it('calculateBloodPressureStats son 7 gün/genel ortalama, kategori ve en yüksek/en düşük döner', () => {
      const rows = [
        { date: '2026-06-01', morningSys: '150', morningDia: '95' },
        { date: '2026-07-01', morningSys: '110', morningDia: '70' },
        { date: '2026-07-02', morningSys: '120', morningDia: '80' },
      ];
      const stats = calculateBloodPressureStats(rows);
      expect(stats.valid).toBe(true);
      expect(stats.last7AvgSys).toBe(115);
      expect(stats.overallAvgSys).toBeCloseTo(126.7, 1);
      expect(stats.category.key).toBeDefined();
      expect(stats.highest).toEqual({ sys: 150, dia: 95, date: '2026-06-01' });
      expect(stats.lowest).toEqual({ sys: 110, dia: 70, date: '2026-07-01' });
    });

    it('calculateBloodPressureStats veri yoksa valid:false döner', () => {
      expect(calculateBloodPressureStats([]).valid).toBe(false);
    });
  });

  describe('tuz/sodyum çevirici', () => {
    it('sodyumdan tuza dönüştürür ve günlük limite oranını hesaplar', () => {
      expect(convertSaltSodium({ mode: 'sodiumToSalt', value: 2000 })).toEqual({
        valid: true,
        sodiumMg: 2000,
        saltG: 5,
        percentOfDailyLimit: 100,
        dailyLimitSaltG: 5,
        dailyLimitSodiumMg: 2000,
        isOverDailyLimit: false,
      });
    });

    it('tuzdan sodyuma dönüştürür', () => {
      const result = convertSaltSodium({ mode: 'saltToSodium', value: 10 });
      expect(result.sodiumMg).toBe(4000);
      expect(result.isOverDailyLimit).toBe(true);
      expect(result.percentOfDailyLimit).toBe(200);
    });
  });

  describe('HbA1c ↔ ortalama şeker çevirici', () => {
    it('HbA1c\'den ADAG formülüyle tahmini ortalama şekeri hesaplar', () => {
      const result = convertHbA1cGlucose({ mode: 'a1cToGlucose', value: 7 });
      expect(result.eAGmgdl).toBe(154.2);
      expect(result.eAGmmol).toBe(8.6);
      expect(result.category).toEqual({ key: 'diyabet', label: 'Diyabet aralığı', tone: 'danger' });
    });

    it('mg/dL cinsinden ortalama şekerden HbA1c hesaplar', () => {
      const result = convertHbA1cGlucose({ mode: 'glucoseToA1c', value: 100, glukozBirim: 'mgdl' });
      expect(result.a1cPercent).toBe(5.1);
      expect(result.category.key).toBe('normal');
    });

    it('mmol/L cinsinden ortalama şekeri mg/dL\'e çevirip HbA1c hesaplar', () => {
      const result = convertHbA1cGlucose({ mode: 'glucoseToA1c', value: 8.6, glukozBirim: 'mmoll' });
      expect(result.a1cPercent).toBeCloseTo(7, 1);
    });

    it('prediyabet aralığını doğru sınıflandırır', () => {
      expect(convertHbA1cGlucose({ mode: 'a1cToGlucose', value: 6 }).category.key).toBe('prediyabet');
    });
  });

  describe('ev şeker ölçüm günlüğü', () => {
    it('açlık/tokluk ortalamalarını ve tahmini HbA1c\'yi hesaplar', () => {
      const result = calculateGlucoseLog([{ fasting: 90, postprandial: 130 }, { fasting: 100, postprandial: 140 }]);
      expect(result.valid).toBe(true);
      expect(result.avgFasting).toBe(95);
      expect(result.avgPostprandial).toBe(135);
      expect(result.hasLow).toBe(false);
      expect(result.hasSevereLow).toBe(false);
      expect(result.hasVeryHigh).toBe(false);
    });

    it('KRİTİK EŞİK: 54 mg/dL altındaki ölçümü ciddi hipoglisemi olarak işaretler', () => {
      const result = calculateGlucoseLog([{ fasting: 50, postprandial: 120 }]);
      expect(result.hasSevereLow).toBe(true);
      expect(result.hasLow).toBe(true);
      expect(result.rows[0].hasSevereLow).toBe(true);
    });

    it('KRİTİK EŞİK: 70 mg/dL altı ama 54 üzeri değeri yalnızca uyarı (hasLow) olarak işaretler', () => {
      const result = calculateGlucoseLog([{ fasting: 65, postprandial: 120 }]);
      expect(result.hasLow).toBe(true);
      expect(result.hasSevereLow).toBe(false);
    });

    it('KRİTİK EŞİK: 300 mg/dL ve üzerini hiperglisemi acil eşiği olarak işaretler', () => {
      const result = calculateGlucoseLog([{ fasting: 90, postprandial: 310 }]);
      expect(result.hasVeryHigh).toBe(true);
      expect(result.rows[0].hasVeryHigh).toBe(true);
    });

    it('geçerli ölçüm yoksa valid:false döner', () => {
      expect(calculateGlucoseLog([{ fasting: '', postprandial: '' }]).valid).toBe(false);
    });

    it('validDayCount geçerli ölçümü olan gün sayısını verir', () => {
      const result = calculateGlucoseLog([{ fasting: 90, postprandial: '' }, { fasting: '', postprandial: 130 }, { fasting: '', postprandial: '' }]);
      expect(result.validDayCount).toBe(2);
    });
  });

  describe('şeker trend noktaları ve istatistik kartı', () => {
    it('buildGlucoseTrendPoints tarihe göre sıralı, eksik alanı null bırakan noktalar üretir', () => {
      const rows = [
        { date: '2026-07-02', fasting: '102', postprandial: '' },
        { date: '2026-07-01', fasting: '95', postprandial: '138' },
      ];
      expect(buildGlucoseTrendPoints(rows)).toEqual([
        { date: '2026-07-01', aclik: 95, tokluk: 138 },
        { date: '2026-07-02', aclik: 102, tokluk: null },
      ]);
    });

    it('calculateGlucoseStats hedef bandına göre açlık/tokluk kategorisi ve en yüksek/en düşük döner', () => {
      const rows = [
        { date: '2026-07-01', fasting: '95', postprandial: '138' },
        { date: '2026-07-02', fasting: '150', postprandial: '210' },
      ];
      const stats = calculateGlucoseStats(rows);
      expect(stats.valid).toBe(true);
      expect(stats.avgFasting).toBeCloseTo(122.5, 1);
      expect(stats.fastingCategory).toEqual({ key: 'icinde', label: 'Hedef bandı içinde', tone: 'success' });
      expect(stats.avgPostprandial).toBeCloseTo(174, 1);
      expect(stats.postprandialCategory).toEqual({ key: 'icinde', label: 'Hedef bandı içinde', tone: 'success' });
      expect(stats.highest).toEqual({ value: 210, field: 'postprandial', date: '2026-07-02' });
      expect(stats.lowest).toEqual({ value: 95, field: 'fasting', date: '2026-07-01' });
    });

    it('calculateGlucoseStats hedef üstü/altı kategorileri doğru işaretler', () => {
      const stats = calculateGlucoseStats([{ date: '2026-07-01', fasting: '60', postprandial: '220' }]);
      expect(stats.fastingCategory).toEqual({ key: 'altinda', label: 'Hedefin altında', tone: 'warning' });
      expect(stats.postprandialCategory).toEqual({ key: 'ustunde', label: 'Hedefin üzerinde', tone: 'warning' });
    });
  });

  describe('karbonhidrat sayımı', () => {
    it('öğün ve gün toplamlarını hesaplar', () => {
      const result = calculateCarbCounting([
        { meal: 'kahvalti', carbGrams: 30 },
        { meal: 'kahvalti', carbGrams: 10 },
        { meal: 'aksam', carbGrams: 60 },
      ]);
      expect(result.valid).toBe(true);
      expect(result.dailyTotal).toBe(100);
      expect(result.mealTotals).toEqual([
        { key: 'kahvalti', label: 'Kahvaltı', total: 40 },
        { key: 'aksam', label: 'Akşam yemeği', total: 60 },
      ]);
    });

    it('geçersiz/boş kalemleri yok sayar', () => {
      expect(calculateCarbCounting([{ meal: 'kahvalti', carbGrams: '' }]).valid).toBe(false);
    });
  });
});
