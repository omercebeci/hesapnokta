import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import AmountInput from '../../../components/AmountInput.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateSavingsGoal } from '../../../lib/finansCalculators.js';
import { formatCurrency, formatNumber, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

export default function BirikimHedefiHesaplama() {
  const [mode, setMode] = useQueryParamState('mod', 'monthlyNeeded'); // 'monthlyNeeded' | 'timeToGoal'
  const [targetAmount, setTargetAmount] = useQueryParamState('hedef', '200000');
  const [currentSavings, setCurrentSavings] = useQueryParamState('birikim', '20000');
  const [months, setMonths] = useQueryParamState('ay', '24');
  const [monthlyContribution, setMonthlyContribution] = useQueryParamState('katki', '5000');
  const [annualReturnRate, setAnnualReturnRate] = useQueryParamState('getiri', '0');

  const { result, error } = useMemo(() => {
    const parsedTarget = parseLocaleNumber(targetAmount);
    const parsedCurrent = parseLocaleNumber(currentSavings);

    if (!Number.isFinite(parsedTarget) || parsedTarget <= 0) {
      return { result: null, error: 'Lütfen geçerli bir hedef tutar girin.' };
    }
    if (!Number.isFinite(parsedCurrent) || parsedCurrent < 0) {
      return { result: null, error: 'Mevcut birikim negatif olamaz.' };
    }

    if (mode === 'monthlyNeeded') {
      const parsedMonths = parseLocaleNumber(months);
      if (!Number.isFinite(parsedMonths) || parsedMonths < 1) {
        return { result: null, error: 'Süre en az 1 ay olmalıdır.' };
      }
      return { result: calculateSavingsGoal({ targetAmount: parsedTarget, currentSavings: parsedCurrent, months: parsedMonths }), error: null };
    }

    const parsedContribution = parseLocaleNumber(monthlyContribution);
    const parsedReturn = parseLocaleNumber(annualReturnRate);
    if (!Number.isFinite(parsedContribution) || parsedContribution < 0) {
      return { result: null, error: 'Aylık katkı negatif olamaz.' };
    }

    return {
      result: calculateSavingsGoal({
        targetAmount: parsedTarget,
        currentSavings: parsedCurrent,
        monthlyContribution: parsedContribution,
        annualReturnRate: Number.isFinite(parsedReturn) ? parsedReturn : 0,
      }),
      error: null,
    };
  }, [mode, targetAmount, currentSavings, months, monthlyContribution, annualReturnRate]);

  return (
    <CalculatorLayout calculatorId="birikim-hedefi-hesaplama">
      <div className="calc-card">
        <h2>Hedef bilgileri</h2>
        <div className="form-grid">
          <FormField label="Ne hesaplamak istersiniz?" htmlFor="mode" full>
            <div className="segmented" role="group" aria-label="Hesaplama modu">
              <button type="button" className={mode === 'monthlyNeeded' ? 'active' : ''} onClick={() => setMode('monthlyNeeded')}>Aylık gereken tutar</button>
              <button type="button" className={mode === 'timeToGoal' ? 'active' : ''} onClick={() => setMode('timeToGoal')}>Hedefe ulaşma süresi</button>
            </div>
          </FormField>
          <FormField label="Hedef tutar (TL)" htmlFor="targetAmount">
            <AmountInput id="targetAmount" value={targetAmount} onChange={setTargetAmount} />
          </FormField>
          <FormField label="Mevcut birikim (TL)" htmlFor="currentSavings">
            <AmountInput id="currentSavings" value={currentSavings} onChange={setCurrentSavings} />
          </FormField>

          {mode === 'monthlyNeeded' ? (
            <FormField label="Hedeflenen süre (ay)" htmlFor="months" full>
              <input id="months" type="text" inputMode="numeric" value={months} onChange={(e) => setMonths(e.target.value)} />
            </FormField>
          ) : (
            <>
              <FormField label="Aylık katkı (TL)" htmlFor="monthlyContribution">
                <AmountInput id="monthlyContribution" value={monthlyContribution} onChange={setMonthlyContribution} />
              </FormField>
              <FormField label="Yıllık getiri oranı (%)" htmlFor="annualReturnRate" hint="Faizsiz birikim için 0 bırakın">
                <input id="annualReturnRate" type="text" inputMode="decimal" value={annualReturnRate} onChange={(e) => setAnnualReturnRate(e.target.value)} />
              </FormField>
            </>
          )}
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : mode === 'monthlyNeeded' ? (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard label="Aylık gereken tutar" value={formatCurrency(result.monthlyNeeded)} />
          <ResultMetrics
            items={[
              { label: 'Kalan tutar', value: formatCurrency(result.remainingAmount) },
              { label: 'Haftalık karşılık', value: formatCurrency(result.weeklyNeeded) },
              { label: 'Günlük karşılık', value: formatCurrency(result.dailyNeeded) },
            ]}
          />
        </div>
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard
            label="Hedefe ulaşma süresi"
            value={Number.isFinite(result.months) ? `${formatNumber(result.months, { decimals: 0 })} ay` : '100+ yıl'}
            note={result.status}
          />
          <ResultMetrics
            items={[
              { label: 'Yıl olarak', value: Number.isFinite(result.years) ? formatNumber(result.years) : '—' },
              { label: 'Projeksiyon tutarı', value: formatCurrency(result.projectedAmount) },
            ]}
          />
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl kullanılır?</h2>
        <p>"Aylık gereken tutar" modu belirli bir sürede hedefe ulaşmak için gereken katkıyı, "Hedefe ulaşma süresi" modu ise sabit bir aylık katkı ile hedefe ne zaman ulaşacağınızı hesaplar.</p>
      </div>
    </CalculatorLayout>
  );
}
