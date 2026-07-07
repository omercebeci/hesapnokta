import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateExamScore } from '../../../lib/egitimCalculators.js';
import { formatNumber, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

export default function SinavPuaniHesaplama() {
  const [correctCount, setCorrectCount] = useQueryParamState('dogru', '30');
  const [wrongCount, setWrongCount] = useQueryParamState('yanlis', '8');
  const [totalQuestions, setTotalQuestions] = useQueryParamState('soru', '40');
  const [wrongPenaltyDivisor, setWrongPenaltyDivisor] = useQueryParamState('katsayi', '4');

  const { result, error } = useMemo(() => {
    const parsedCorrect = parseLocaleNumber(correctCount);
    const parsedWrong = parseLocaleNumber(wrongCount);
    const parsedTotal = parseLocaleNumber(totalQuestions);
    const parsedDivisor = parseLocaleNumber(wrongPenaltyDivisor);

    if (!Number.isFinite(parsedTotal) || parsedTotal <= 0) {
      return { result: null, error: 'Lütfen geçerli bir toplam soru sayısı girin.' };
    }
    if (!Number.isFinite(parsedCorrect) || parsedCorrect < 0) {
      return { result: null, error: 'Doğru sayısı negatif olamaz.' };
    }
    if (!Number.isFinite(parsedWrong) || parsedWrong < 0) {
      return { result: null, error: 'Yanlış sayısı negatif olamaz.' };
    }
    if (parsedCorrect + parsedWrong > parsedTotal) {
      return { result: null, error: 'Doğru ve yanlış toplamı, toplam soru sayısını geçemez.' };
    }

    return {
      result: calculateExamScore({
        correctCount: parsedCorrect,
        wrongCount: parsedWrong,
        totalQuestions: parsedTotal,
        wrongPenaltyDivisor: Number.isFinite(parsedDivisor) && parsedDivisor > 0 ? parsedDivisor : 4,
      }),
      error: null,
    };
  }, [correctCount, wrongCount, totalQuestions, wrongPenaltyDivisor]);

  return (
    <CalculatorLayout calculatorId="sinav-puani-hesaplama">
      <div className="calc-card">
        <h2>Sınav sonucu</h2>
        <div className="form-grid">
          <FormField label="Doğru sayısı" htmlFor="correctCount">
            <input id="correctCount" type="text" inputMode="numeric" value={correctCount} onChange={(e) => setCorrectCount(e.target.value)} />
          </FormField>
          <FormField label="Yanlış sayısı" htmlFor="wrongCount">
            <input id="wrongCount" type="text" inputMode="numeric" value={wrongCount} onChange={(e) => setWrongCount(e.target.value)} />
          </FormField>
          <FormField label="Toplam soru sayısı" htmlFor="totalQuestions">
            <input id="totalQuestions" type="text" inputMode="numeric" value={totalQuestions} onChange={(e) => setTotalQuestions(e.target.value)} />
          </FormField>
          <FormField label="Kaç yanlış 1 doğruyu götürür" htmlFor="wrongPenaltyDivisor" hint="ÖSYM sınavlarında genellikle 4">
            <input id="wrongPenaltyDivisor" type="text" inputMode="numeric" value={wrongPenaltyDivisor} onChange={(e) => setWrongPenaltyDivisor(e.target.value)} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard label="Net" value={formatNumber(result.net)} note={`100 üzerinden puan: ${formatNumber(result.scorePercent)}`} />
          <ResultMetrics items={[{ label: 'Boş sayısı', value: formatNumber(result.emptyCount, { decimals: 0 }) }]} />
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl hesaplanır?</h2>
        <p>Net, doğru sayısından yanlış sayısının belirlediğiniz oranla (varsayılan 4 yanlış 1 doğruyu götürür) bölünüp çıkarılmasıyla bulunur: net = doğru − (yanlış ÷ oran). 100 üzerinden puan ise net sayının toplam soru sayısına oranıdır.</p>
      </div>
    </CalculatorLayout>
  );
}
