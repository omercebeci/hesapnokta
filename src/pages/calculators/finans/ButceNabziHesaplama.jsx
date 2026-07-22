import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import AmountInput from '../../../components/AmountInput.jsx';
import { ResultCard, ResultError } from '../../../components/Result.jsx';
import RatioBar from '../../../components/RatioBar.jsx';
import { calculateBudgetPulse } from '../../../lib/finansCalculators.js';
import { formatCurrency, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

const RISK_LABEL = { düşük: 'Düşük risk', orta: 'Orta risk', yüksek: 'Yüksek risk' };

export default function ButceNabziHesaplama() {
  const [monthlyIncome, setMonthlyIncome] = useQueryParamState('gelir', '40000');
  const [fixedExpenses, setFixedExpenses] = useQueryParamState('gider', '18000');
  const [debtPayments, setDebtPayments] = useQueryParamState('borc', '6000');
  const [savings, setSavings] = useQueryParamState('birikim', '4000');

  const { result, error } = useMemo(() => {
    const parsedIncome = parseLocaleNumber(monthlyIncome);
    const parsedExpenses = parseLocaleNumber(fixedExpenses);
    const parsedDebt = parseLocaleNumber(debtPayments);
    const parsedSavings = parseLocaleNumber(savings);

    if (!Number.isFinite(parsedIncome) || parsedIncome <= 0) {
      return { result: null, error: 'Lütfen geçerli bir aylık gelir girin.' };
    }
    if ([parsedExpenses, parsedDebt, parsedSavings].some((value) => !Number.isFinite(value) || value < 0)) {
      return { result: null, error: 'Gider, borç ve birikim alanları negatif olamaz.' };
    }

    return {
      result: calculateBudgetPulse({
        monthlyIncome: parsedIncome,
        fixedExpenses: parsedExpenses,
        debtPayments: parsedDebt,
        savings: parsedSavings,
      }),
      error: null,
    };
  }, [monthlyIncome, fixedExpenses, debtPayments, savings]);

  return (
    <CalculatorLayout calculatorId="butce-nabzi-hesaplama">
      <div className="calc-card">
        <h2>Aylık bütçe bilgileri</h2>
        <div className="form-grid">
          <FormField label="Aylık gelir (TL)" htmlFor="monthlyIncome" full>
            <AmountInput id="monthlyIncome" value={monthlyIncome} onChange={setMonthlyIncome} />
          </FormField>
          <FormField label="Sabit giderler (TL)" htmlFor="fixedExpenses">
            <AmountInput id="fixedExpenses" value={fixedExpenses} onChange={setFixedExpenses} />
          </FormField>
          <FormField label="Borç ödemeleri (TL)" htmlFor="debtPayments">
            <AmountInput id="debtPayments" value={debtPayments} onChange={setDebtPayments} />
          </FormField>
          <FormField label="Birikim (TL)" htmlFor="savings" full>
            <AmountInput id="savings" value={savings} onChange={setSavings} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard label="Serbest nakit" value={formatCurrency(result.freeCash)} note={`${RISK_LABEL[result.riskLevel]} — ${result.recommendation}`} />
          <div className="result-metric" style={{ display: 'grid', gap: 16 }}>
            <RatioBar label="Gider oranı" value={result.expenseRatio} tone="info" />
            <RatioBar label="Borç oranı" value={result.debtRatio} tone={result.debtRatio > 35 ? 'danger' : 'accent'} />
            <RatioBar label="Birikim oranı" value={result.savingsRatio} tone={result.savingsRatio < 15 ? 'danger' : 'success'} />
          </div>
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl yorumlanır?</h2>
        <p>Borç oranı %35'i geçtiğinde ya da serbest nakit negatif olduğunda risk seviyesi "yüksek" olarak işaretlenir.</p>
      </div>
    </CalculatorLayout>
  );
}
