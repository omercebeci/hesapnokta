import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateMortgageAffordability } from '../../../lib/finansCalculators.js';
import { formatCurrency, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

export default function EmlakKredisiUygunlukHesaplama() {
  const [monthlyIncome, setMonthlyIncome] = useQueryParamState('gelir', '50000');
  const [existingDebtPayments, setExistingDebtPayments] = useQueryParamState('borc', '0');
  const [maxDebtToIncomeRatio, setMaxDebtToIncomeRatio] = useQueryParamState('oran', '40');
  const [monthlyRate, setMonthlyRate] = useQueryParamState('faiz', '3');
  const [months, setMonths] = useQueryParamState('vade', '120');

  const { result, error } = useMemo(() => {
    const parsedIncome = parseLocaleNumber(monthlyIncome);
    const parsedDebt = parseLocaleNumber(existingDebtPayments);
    const parsedRatio = parseLocaleNumber(maxDebtToIncomeRatio);
    const parsedRate = parseLocaleNumber(monthlyRate);
    const parsedMonths = parseLocaleNumber(months);

    if (!Number.isFinite(parsedIncome) || parsedIncome <= 0) {
      return { result: null, error: 'Lütfen geçerli bir aylık gelir girin.' };
    }
    if (!Number.isFinite(parsedDebt) || parsedDebt < 0) {
      return { result: null, error: 'Mevcut borç ödemesi negatif olamaz.' };
    }
    if (!Number.isFinite(parsedRatio) || parsedRatio <= 0 || parsedRatio > 100) {
      return { result: null, error: 'Oran 0-100 arasında olmalıdır.' };
    }
    if (!Number.isFinite(parsedMonths) || parsedMonths < 1) {
      return { result: null, error: 'Vade en az 1 ay olmalıdır.' };
    }

    return {
      result: calculateMortgageAffordability({
        monthlyIncome: parsedIncome,
        existingDebtPayments: parsedDebt,
        maxDebtToIncomeRatio: parsedRatio,
        monthlyRate: Number.isFinite(parsedRate) ? parsedRate : 0,
        months: parsedMonths,
      }),
      error: null,
    };
  }, [monthlyIncome, existingDebtPayments, maxDebtToIncomeRatio, monthlyRate, months]);

  return (
    <CalculatorLayout calculatorId="emlak-kredisi-uygunluk-hesaplama">
      <div className="calc-card">
        <h2>Gelir ve kredi bilgileri</h2>
        <div className="form-grid">
          <FormField label="Aylık net gelir (TL)" htmlFor="monthlyIncome" full>
            <input id="monthlyIncome" type="text" inputMode="decimal" value={monthlyIncome} onChange={(e) => setMonthlyIncome(e.target.value)} />
          </FormField>
          <FormField label="Mevcut borç ödemeleri (TL)" htmlFor="existingDebtPayments">
            <input id="existingDebtPayments" type="text" inputMode="decimal" value={existingDebtPayments} onChange={(e) => setExistingDebtPayments(e.target.value)} />
          </FormField>
          <FormField label="Maks. taksit/gelir oranı (%)" htmlFor="maxDebtToIncomeRatio" hint="Bankalarda yaygın uygulama ~%40">
            <input id="maxDebtToIncomeRatio" type="text" inputMode="decimal" value={maxDebtToIncomeRatio} onChange={(e) => setMaxDebtToIncomeRatio(e.target.value)} />
          </FormField>
          <FormField label="Aylık faiz oranı (%)" htmlFor="monthlyRate">
            <input id="monthlyRate" type="text" inputMode="decimal" value={monthlyRate} onChange={(e) => setMonthlyRate(e.target.value)} />
          </FormField>
          <FormField label="Vade (ay)" htmlFor="months">
            <input id="months" type="text" inputMode="numeric" value={months} onChange={(e) => setMonths(e.target.value)} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard label="Tahmini maksimum kredi tutarı" value={formatCurrency(result.maxLoanAmount)} />
          <ResultMetrics items={[{ label: 'Maksimum aylık taksit', value: formatCurrency(result.maxInstallment) }]} />
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl hesaplanır?</h2>
        <ul>
          <li>Maksimum taksit, aylık gelirinizin belirlediğiniz orana göre payından mevcut borç ödemeleriniz düşülerek bulunur.</li>
          <li>Bu taksitin karşılayabileceği maksimum kredi tutarı, girilen faiz oranı ve vadeye göre anüite formülüyle hesaplanır.</li>
          <li>Bu araç yaklaşık bir ön değerlendirmedir; BSMV/KKDF, teminat, kredi notu ve bankanın özel politikaları gerçek teklifi değiştirebilir.</li>
        </ul>
      </div>
    </CalculatorLayout>
  );
}
