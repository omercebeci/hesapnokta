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
});
