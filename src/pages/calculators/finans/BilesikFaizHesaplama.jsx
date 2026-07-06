import React, { useMemo, useState } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateCompoundInterest } from '../../../lib/finansCalculators.js';
import { formatCurrency, parseLocaleNumber } from '../../../utils/format.js';

export default function BilesikFaizHesaplama() {
  const [principal, setPrincipal] = useState('100000');
  const [annualRate, setAnnualRate] = useState('12');
  const [years, setYears] = useState('5');
  const [monthlyContribution, setMonthlyContribution] = useState('0');
  const [frequency, setFrequency] = useState('monthly');

  const { result, error } = useMemo(() => {
    const parsedPrincipal = parseLocaleNumber(principal);
    const parsedRate = parseLocaleNumber(annualRate);
    const parsedYears = parseLocaleNumber(years);
    const parsedContribution = parseLocaleNumber(monthlyContribution);

    if (!Number.isFinite(parsedPrincipal) || parsedPrincipal < 0) {
      return { result: null, error: 'Lütfen geçerli bir anapara tutarı girin.' };
    }
    if (!Number.isFinite(parsedRate) || parsedRate < 0) {
      return { result: null, error: 'Lütfen geçerli bir yıllık faiz oranı girin.' };
    }
    if (!Number.isFinite(parsedYears) || parsedYears <= 0) {
      return { result: null, error: 'Vade en az 1 yıl olmalıdır.' };
    }

    return {
      result: calculateCompoundInterest({
        principal: parsedPrincipal,
        annualRate: parsedRate,
        years: parsedYears,
        monthlyContribution: Number.isFinite(parsedContribution) ? parsedContribution : 0,
        frequency,
      }),
      error: null,
    };
  }, [principal, annualRate, years, monthlyContribution, frequency]);

  return (
    <CalculatorLayout calculatorId="bilesik-faiz-hesaplama">
      <div className="calc-card">
        <h2>Yatırım bilgileri</h2>
        <div className="form-grid">
          <FormField label="Başlangıç anaparası (TL)" htmlFor="principal">
            <input id="principal" type="text" inputMode="decimal" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
          </FormField>
          <FormField label="Yıllık faiz oranı (%)" htmlFor="annualRate">
            <input id="annualRate" type="text" inputMode="decimal" value={annualRate} onChange={(e) => setAnnualRate(e.target.value)} />
          </FormField>
          <FormField label="Vade (yıl)" htmlFor="years">
            <input id="years" type="text" inputMode="decimal" value={years} onChange={(e) => setYears(e.target.value)} />
          </FormField>
          <FormField label="Aylık katkı (TL)" htmlFor="monthlyContribution" hint="Düzenli katkı yoksa 0 bırakın">
            <input id="monthlyContribution" type="text" inputMode="decimal" value={monthlyContribution} onChange={(e) => setMonthlyContribution(e.target.value)} />
          </FormField>
          <FormField label="Bileşiklenme sıklığı" htmlFor="frequency" full>
            <div className="segmented" role="group" aria-label="Bileşiklenme sıklığı">
              <button type="button" className={frequency === 'monthly' ? 'active' : ''} onClick={() => setFrequency('monthly')}>Aylık</button>
              <button type="button" className={frequency === 'yearly' ? 'active' : ''} onClick={() => setFrequency('yearly')}>Yıllık</button>
              <button type="button" className={frequency === 'daily' ? 'active' : ''} onClick={() => setFrequency('daily')}>Günlük</button>
            </div>
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard label="Vade sonu değer" value={formatCurrency(result.futureValue)} />
          <ResultMetrics
            items={[
              { label: 'Toplam yatırılan', value: formatCurrency(result.totalContributions) },
              { label: 'Toplam getiri', value: formatCurrency(result.totalInterest) },
            ]}
          />
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl hesaplanır?</h2>
        <ul>
          <li>Anapara, seçilen sıklıkta bileşik faiz formülüyle büyütülür: A = P × (1 + r/n)^(n×t).</li>
          <li>Aylık katkı girilirse, düzenli katkı için gelecek değer anüite formülüyle ayrıca hesaplanıp eklenir.</li>
          <li>Bu araç sabit getiri varsayar; gerçek yatırım araçlarında getiri dalgalı olabilir, garanti sunmaz.</li>
        </ul>
      </div>
    </CalculatorLayout>
  );
}
