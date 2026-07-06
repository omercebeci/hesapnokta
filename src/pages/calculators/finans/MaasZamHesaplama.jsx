import React, { useMemo, useState } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateSalaryIncrease } from '../../../lib/finansCalculators.js';
import { formatCurrency, parseLocaleNumber } from '../../../utils/format.js';

export default function MaasZamHesaplama() {
  const [currentSalary, setCurrentSalary] = useState('30000');
  const [increaseRate, setIncreaseRate] = useState('25');

  const { result, error } = useMemo(() => {
    const parsedSalary = parseLocaleNumber(currentSalary);
    const parsedRate = parseLocaleNumber(increaseRate);

    if (!Number.isFinite(parsedSalary) || parsedSalary < 0) {
      return { result: null, error: 'Lütfen geçerli bir maaş tutarı girin.' };
    }
    if (!Number.isFinite(parsedRate)) {
      return { result: null, error: 'Lütfen geçerli bir zam oranı girin.' };
    }

    return { result: calculateSalaryIncrease({ currentSalary: parsedSalary, increaseRate: parsedRate }), error: null };
  }, [currentSalary, increaseRate]);

  return (
    <CalculatorLayout calculatorId="maas-zam-hesaplama">
      <div className="calc-card">
        <h2>Maaş bilgileri</h2>
        <div className="form-grid">
          <FormField label="Mevcut maaş (TL)" htmlFor="currentSalary">
            <input id="currentSalary" type="text" inputMode="decimal" value={currentSalary} onChange={(e) => setCurrentSalary(e.target.value)} />
          </FormField>
          <FormField label="Zam oranı (%)" htmlFor="increaseRate">
            <input id="increaseRate" type="text" inputMode="decimal" value={increaseRate} onChange={(e) => setIncreaseRate(e.target.value)} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard label="Yeni maaş" value={formatCurrency(result.newSalary)} />
          <ResultMetrics
            items={[
              { label: 'Aylık artış', value: formatCurrency(result.increaseAmount) },
              { label: 'Yıllık fark', value: formatCurrency(result.annualDifference) },
            ]}
          />
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl yorumlanır?</h2>
        <p>Yıllık fark, aylık artışın 12 ay ile çarpımıdır; kesinti/vergi dilimi değişimi dahil değildir.</p>
      </div>
    </CalculatorLayout>
  );
}
