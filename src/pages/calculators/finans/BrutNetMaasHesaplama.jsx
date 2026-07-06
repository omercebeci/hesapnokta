import React, { useMemo, useState } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateSalaryConversion } from '../../../lib/finansCalculators.js';
import { formatCurrency, parseLocaleNumber } from '../../../utils/format.js';

export default function BrutNetMaasHesaplama() {
  const [mode, setMode] = useState('grossToNet');
  const [amount, setAmount] = useState('50000');

  const { result, error } = useMemo(() => {
    const parsedAmount = parseLocaleNumber(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return { result: null, error: 'Lütfen geçerli bir tutar girin.' };
    }
    return { result: calculateSalaryConversion({ amount: parsedAmount, mode }), error: null };
  }, [amount, mode]);

  return (
    <CalculatorLayout calculatorId="brut-net-maas-hesaplama">
      <div className="calc-card">
        <h2>Maaş bilgileri</h2>
        <div className="form-grid">
          <FormField label="Hesaplama yönü" htmlFor="mode" full>
            <div className="segmented" role="group" aria-label="Hesaplama yönü">
              <button type="button" className={mode === 'grossToNet' ? 'active' : ''} onClick={() => setMode('grossToNet')}>Brüt → Net</button>
              <button type="button" className={mode === 'netToGross' ? 'active' : ''} onClick={() => setMode('netToGross')}>Net → Brüt</button>
            </div>
          </FormField>
          <FormField label={mode === 'grossToNet' ? 'Brüt maaş (TL)' : 'Net maaş (TL)'} htmlFor="amount" full>
            <input id="amount" type="text" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard
            label={mode === 'grossToNet' ? 'Net maaş' : 'Brüt maaş'}
            value={formatCurrency(mode === 'grossToNet' ? result.netSalary : result.grossSalary)}
            note="2026 gelir vergisi dilimleri ve asgari ücret istisnasına göre"
          />
          <ResultMetrics
            items={[
              { label: 'SGK kesintisi (%14)', value: formatCurrency(result.sgkDeduction) },
              { label: 'İşsizlik sigortası (%1)', value: formatCurrency(result.unemploymentDeduction) },
              { label: 'Gelir vergisi', value: formatCurrency(result.incomeTax) },
              { label: 'Damga vergisi (‰7,59)', value: formatCurrency(result.stampTax) },
            ]}
          />
        </div>
      )}

      <div className="info-card" style={{ gridColumn: '1 / -1' }}>
        <h2>Varsayımlar ve kaynaklar</h2>
        <ul>
          <li>2026 gelir vergisi dilimleri: 190.000 TL'ye kadar %15, 400.000 TL'ye kadar %20, 1.500.000 TL'ye kadar %27, 5.300.000 TL'ye kadar %35, üzeri %40.</li>
          <li>SGK işçi payı %14, işsizlik sigortası işçi payı %1, damga vergisi oranı binde 7,59 olarak alınmıştır.</li>
          <li>2026 brüt asgari ücret (33.030 TL) tutarına isabet eden gelir ve damga vergisi istisna edilmiştir (asgari ücretliden vergi kesilmez).</li>
          <li>Hesaplama, ilgili ayı yılın ilk ayı kabul eder; yıl içindeki önceki aylardan gelen kümülatif vergi matrahını dikkate almaz. Prim/ikramiye, AGİ gibi ek unsurlar dahil değildir.</li>
        </ul>
      </div>
    </CalculatorLayout>
  );
}
