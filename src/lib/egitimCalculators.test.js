import { describe, expect, it } from 'vitest';
import { calculateGradeAverage, calculateExamScore } from './egitimCalculators.js';

describe('eğitim hesaplayıcıları', () => {
  it('final notu girildiğinde ağırlıklı ortalamayı ve geçme durumunu hesaplar', () => {
    expect(calculateGradeAverage({ midtermScore: 60, midtermWeight: 40, finalScore: 70, finalWeight: 60, passingGrade: 50 })).toEqual({
      weightedAverage: 66,
      passed: true,
      requiredFinalScore: 43.33,
      isAlreadyGuaranteed: false,
      isImpossible: false,
    });
  });

  it('final notu girilmediğinde sadece gereken minimum finali hesaplar', () => {
    expect(calculateGradeAverage({ midtermScore: 40, midtermWeight: 40, finalWeight: 60, passingGrade: 50 })).toEqual({
      weightedAverage: null,
      passed: null,
      requiredFinalScore: 56.67,
      isAlreadyGuaranteed: false,
      isImpossible: false,
    });
  });

  it('vize notu tek başına geçme notunu garantiliyorsa işaretler', () => {
    expect(calculateGradeAverage({ midtermScore: 100, midtermWeight: 50, finalWeight: 50, passingGrade: 50 })).toEqual({
      weightedAverage: null,
      passed: null,
      requiredFinalScore: 0,
      isAlreadyGuaranteed: true,
      isImpossible: false,
    });
  });

  it('finalden 100 alsa bile geçilemiyorsa imkansız olarak işaretler', () => {
    expect(calculateGradeAverage({ midtermScore: 0, midtermWeight: 60, finalWeight: 40, passingGrade: 50 })).toEqual({
      weightedAverage: null,
      passed: null,
      requiredFinalScore: 100,
      isAlreadyGuaranteed: false,
      isImpossible: true,
    });
  });

  it('doğru-yanlış-boşa göre net ve 100 üzerinden puanı hesaplar', () => {
    expect(calculateExamScore({ correctCount: 30, wrongCount: 8, totalQuestions: 40, wrongPenaltyDivisor: 4 })).toEqual({
      net: 28,
      emptyCount: 2,
      scorePercent: 70,
    });
  });
});
