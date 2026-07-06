import { describe, expect, it } from 'vitest';
import { calculateAge, calculateDateDiff, calculateTimeDuration, calculateCountdown } from './zamanCalculators.js';

describe('zaman hesaplayıcıları', () => {
  it('yaşı yıl/ay/gün olarak hesaplar', () => {
    expect(calculateAge({ birthDate: '2000-01-15', referenceDate: '2026-07-06' })).toEqual({
      valid: true,
      years: 26,
      months: 5,
      days: 21,
      totalDays: 9669,
      totalWeeks: 1381,
      daysUntilNextBirthday: 193,
    });
  });

  it('doğum tarihi referans tarihinden sonraysa geçersiz sayar', () => {
    expect(calculateAge({ birthDate: '2030-01-01', referenceDate: '2026-07-06' })).toEqual({ valid: false });
  });

  it('iki tarih arasındaki farkı hesaplar', () => {
    expect(calculateDateDiff({ startDate: '2026-01-01', endDate: '2026-07-06' })).toEqual({
      valid: true,
      reversed: false,
      years: 0,
      months: 6,
      days: 5,
      totalDays: 186,
      totalWeeks: 26,
      totalMonths: 6,
    });
  });

  it('ters sıralı tarihlerde mutlak farkı hesaplar', () => {
    expect(calculateDateDiff({ startDate: '2026-07-06', endDate: '2026-01-01' })).toEqual({
      valid: true,
      reversed: true,
      years: 0,
      months: 6,
      days: 5,
      totalDays: 186,
      totalWeeks: 26,
      totalMonths: 6,
    });
  });

  it('normal mesai süresini mola düşülerek hesaplar', () => {
    expect(calculateTimeDuration({ startTime: '09:00', endTime: '18:00', breakMinutes: 60 })).toEqual({
      valid: true,
      overnight: false,
      hours: 8,
      minutes: 0,
      totalMinutes: 480,
      decimalHours: 8,
    });
  });

  it('gece yarısını geçen vardiya süresini ertesi güne sararak hesaplar', () => {
    expect(calculateTimeDuration({ startTime: '22:00', endTime: '06:00', breakMinutes: 0 })).toEqual({
      valid: true,
      overnight: true,
      hours: 8,
      minutes: 0,
      totalMinutes: 480,
      decimalHours: 8,
    });
  });

  it('gelecekteki hedef tarihe kalan gün sayısını hesaplar', () => {
    expect(calculateCountdown({ targetDate: '2026-12-31', referenceDate: '2026-07-06' })).toEqual({
      valid: true,
      totalDays: 178,
      isPast: false,
      isToday: false,
      weeks: 25,
      remainderDays: 3,
    });
  });

  it('geçmiş bir tarih için negatif gün ve isPast döner', () => {
    expect(calculateCountdown({ targetDate: '2026-01-01', referenceDate: '2026-07-06' })).toEqual({
      valid: true,
      totalDays: -186,
      isPast: true,
      isToday: false,
      weeks: 26,
      remainderDays: 4,
    });
  });

  it('hedef tarih bugünse isToday true döner', () => {
    expect(calculateCountdown({ targetDate: '2026-07-06', referenceDate: '2026-07-06' })).toEqual({
      valid: true,
      totalDays: 0,
      isPast: false,
      isToday: true,
      weeks: 0,
      remainderDays: 0,
    });
  });
});
