// Eğitim kategorisi için saf hesaplama fonksiyonları.

const round2 = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;
const safeNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

// Ağırlıklı not ortalamasını ve (verilirse) geçmek için finalden gereken minimum notu hesaplar.
export function calculateGradeAverage({ midtermScore, midtermWeight = 40, finalScore, finalWeight = 60, passingGrade = 50 }) {
  const midterm = safeNumber(midtermScore);
  const midtermW = Math.max(0, safeNumber(midtermWeight, 40));
  const finalW = Math.max(0, safeNumber(finalWeight, 60));
  const totalWeight = midtermW + finalW;
  const passGrade = safeNumber(passingGrade, 50);

  const requiredFinalScoreRaw = finalW > 0 && totalWeight > 0
    ? ((passGrade * totalWeight) - (midterm * midtermW)) / finalW
    : 0;
  const requiredFinalScore = Math.min(100, Math.max(0, requiredFinalScoreRaw));

  let weightedAverage = null;
  let passed = null;
  const hasFinalScore = finalScore !== undefined && finalScore !== null && finalScore !== '';
  if (hasFinalScore) {
    const final = safeNumber(finalScore);
    weightedAverage = totalWeight > 0 ? ((midterm * midtermW) + (final * finalW)) / totalWeight : 0;
    passed = weightedAverage >= passGrade;
  }

  return {
    weightedAverage: weightedAverage !== null ? round2(weightedAverage) : null,
    passed,
    requiredFinalScore: round2(requiredFinalScore),
    isAlreadyGuaranteed: requiredFinalScoreRaw <= 0,
    isImpossible: requiredFinalScoreRaw > 100,
  };
}

// Doğru-yanlış-boş sayısına göre net ve 100 üzerinden puanı hesaplar (ör. ÖSYM sınavlarında 4 yanlış 1 doğruyu götürür).
export function calculateExamScore({ correctCount, wrongCount, totalQuestions, wrongPenaltyDivisor = 4 }) {
  const correct = Math.max(0, safeNumber(correctCount));
  const wrong = Math.max(0, safeNumber(wrongCount));
  const total = Math.max(1, safeNumber(totalQuestions, 1));
  const divisor = Math.max(1, safeNumber(wrongPenaltyDivisor, 4));

  const net = correct - (wrong / divisor);
  const emptyCount = Math.max(0, total - correct - wrong);
  const scorePercent = (net / total) * 100;

  return {
    net: round2(net),
    emptyCount: round2(emptyCount),
    scorePercent: round2(scorePercent),
  };
}
