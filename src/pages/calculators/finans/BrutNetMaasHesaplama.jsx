import React, { useMemo, useState } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import DataPeriodNote from '../../../components/DataPeriodNote.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateSalaryConversion } from '../../../lib/finansCalculators.js';
import { formatCurrency, formatNumber, parseLocaleNumber } from '../../../utils/format.js';
import { GUNCEL_VERILER } from '../../../data/guncelVeriler.js';

const VERGI_DILIMLERI = GUNCEL_VERILER.gelirVergisiDilimleri;
const SGK_ORANI = GUNCEL_VERILER.sgkIsciPayiOrani;
const ISSIZLIK_ORANI = GUNCEL_VERILER.issizlikSigortasiIsciPayiOrani;
const DAMGA_ORANI = GUNCEL_VERILER.damgaVergisiOrani;
const ASGARI_UCRET = GUNCEL_VERILER.asgariUcret;

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
            note={`${VERGI_DILIMLERI.period} gelir vergisi dilimleri ve asgari ücret istisnasına göre`}
          />
          <ResultMetrics
            items={[
              { label: `SGK kesintisi (%${formatNumber(SGK_ORANI.value * 100, { decimals: 0 })})`, value: formatCurrency(result.sgkDeduction) },
              { label: `İşsizlik sigortası (%${formatNumber(ISSIZLIK_ORANI.value * 100, { decimals: 0 })})`, value: formatCurrency(result.unemploymentDeduction) },
              { label: 'Gelir vergisi', value: formatCurrency(result.incomeTax) },
              { label: `Damga vergisi (‰${formatNumber(DAMGA_ORANI.value * 1000, { decimals: 2 })})`, value: formatCurrency(result.stampTax) },
            ]}
          />
          <DataPeriodNote period={VERGI_DILIMLERI.period} lastUpdated={VERGI_DILIMLERI.lastUpdated} source={VERGI_DILIMLERI.source} />
        </div>
      )}

      <div className="info-card" style={{ gridColumn: '1 / -1' }}>
        <h2>Varsayımlar ve kaynaklar</h2>
        <ul>
          <li>
            {VERGI_DILIMLERI.period} gelir vergisi dilimleri:{' '}
            {VERGI_DILIMLERI.value.map((bracket, index) => {
              const isLast = index === VERGI_DILIMLERI.value.length - 1;
              const label = isLast
                ? `üzeri %${formatNumber(bracket.rate * 100, { decimals: 0 })}`
                : `${formatNumber(bracket.upTo, { decimals: 0 })} TL'ye kadar %${formatNumber(bracket.rate * 100, { decimals: 0 })}`;
              return `${label}${isLast ? '.' : ', '}`;
            })}
          </li>
          <li>
            SGK işçi payı %{formatNumber(SGK_ORANI.value * 100, { decimals: 0 })}, işsizlik sigortası işçi payı %{formatNumber(ISSIZLIK_ORANI.value * 100, { decimals: 0 })}, damga vergisi oranı binde {formatNumber(DAMGA_ORANI.value * 1000, { decimals: 2 })} olarak alınmıştır.
          </li>
          <li>
            {ASGARI_UCRET.brutAylik.period} brüt asgari ücret ({formatCurrency(ASGARI_UCRET.brutAylik.value)}) tutarına isabet eden gelir ve damga vergisi istisna edilmiştir (asgari ücretliden vergi kesilmez).
          </li>
          <li>Hesaplama, ilgili ayı yılın ilk ayı kabul eder; yıl içindeki önceki aylardan gelen kümülatif vergi matrahını dikkate almaz. Prim/ikramiye, AGİ gibi ek unsurlar dahil değildir.</li>
        </ul>
      </div>
    </CalculatorLayout>
  );
}
