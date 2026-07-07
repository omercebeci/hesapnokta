import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateDeposit } from '../../../lib/finansCalculators.js';
import { formatCurrency, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

export default function MevduatFaiziHesaplama() {
  const [principal, setPrincipal] = useQueryParamState('anapara', '100000');
  const [annualRate, setAnnualRate] = useQueryParamState('faiz', '45');
  const [days, setDays] = useQueryParamState('gun', '32');
  const [taxRate, setTaxRate] = useQueryParamState('stopaj', '5');

  const { result, error } = useMemo(() => {
    const parsedPrincipal = parseLocaleNumber(principal);
    const parsedRate = parseLocaleNumber(annualRate);
    const parsedDays = parseLocaleNumber(days);
    const parsedTax = parseLocaleNumber(taxRate);

    if (!Number.isFinite(parsedPrincipal) || parsedPrincipal <= 0) {
      return { result: null, error: 'Lütfen geçerli bir anapara tutarı girin.' };
    }
    if (!Number.isFinite(parsedRate) || parsedRate < 0) {
      return { result: null, error: 'Lütfen geçerli bir yıllık faiz oranı girin.' };
    }
    if (!Number.isFinite(parsedDays) || parsedDays <= 0) {
      return { result: null, error: 'Vade en az 1 gün olmalıdır.' };
    }

    return {
      result: calculateDeposit({
        principal: parsedPrincipal,
        annualRate: parsedRate,
        days: parsedDays,
        taxRate: Number.isFinite(parsedTax) ? parsedTax : 5,
      }),
      error: null,
    };
  }, [principal, annualRate, days, taxRate]);

  return (
    <CalculatorLayout calculatorId="mevduat-faizi-hesaplama">
      <div className="calc-card">
        <h2>Mevduat bilgileri</h2>
        <div className="form-grid">
          <FormField label="Anapara (TL)" htmlFor="principal">
            <input id="principal" type="text" inputMode="decimal" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
          </FormField>
          <FormField label="Yıllık faiz oranı (%)" htmlFor="annualRate">
            <input id="annualRate" type="text" inputMode="decimal" value={annualRate} onChange={(e) => setAnnualRate(e.target.value)} />
          </FormField>
          <FormField label="Vade (gün)" htmlFor="days">
            <input id="days" type="text" inputMode="numeric" value={days} onChange={(e) => setDays(e.target.value)} />
          </FormField>
          <FormField label="Stopaj oranı (%)" htmlFor="taxRate">
            <input id="taxRate" type="text" inputMode="decimal" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard label="Vade sonu net tutar" value={formatCurrency(result.maturityAmount)} />
          <ResultMetrics
            items={[
              { label: 'Brüt faiz', value: formatCurrency(result.grossInterest) },
              { label: 'Stopaj kesintisi', value: formatCurrency(result.tax) },
              { label: 'Net faiz', value: formatCurrency(result.netInterest) },
            ]}
          />
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl yorumlanır?</h2>
        <p>Stopaj oranı, vade türü ve bankanın güncel faiz oranı nihai getiriyi etkileyebilir.</p>
      </div>
    </CalculatorLayout>
  );
}
