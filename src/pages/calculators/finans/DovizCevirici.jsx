import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultError } from '../../../components/Result.jsx';
import { calculateCurrencyConversion } from '../../../lib/finansCalculators.js';
import { formatNumber, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

export default function DovizCevirici() {
  const [amount, setAmount] = useQueryParamState('tutar', '100');
  const [rate, setRate] = useQueryParamState('kur', '34,50');
  const [direction, setDirection] = useQueryParamState('yon', 'toForeign'); // toForeign: TL -> döviz, toTl: döviz -> TL
  const [currencyLabel, setCurrencyLabel] = useQueryParamState('birim', 'USD');

  const { result, error } = useMemo(() => {
    const parsedAmount = parseLocaleNumber(amount);
    const parsedRate = parseLocaleNumber(rate);

    if (!Number.isFinite(parsedAmount) || parsedAmount < 0) {
      return { result: null, error: 'Lütfen geçerli bir tutar girin.' };
    }
    if (!Number.isFinite(parsedRate) || parsedRate <= 0) {
      return { result: null, error: 'Lütfen geçerli bir kur değeri girin.' };
    }

    return { result: calculateCurrencyConversion({ amount: parsedAmount, rate: parsedRate, direction }), error: null };
  }, [amount, rate, direction]);

  return (
    <CalculatorLayout calculatorId="doviz-cevirici">
      <div className="calc-card">
        <h2>Çevirim bilgileri</h2>
        <div className="form-grid">
          <FormField label="Yön" htmlFor="direction" full hint="Kuru elle girin; canlı kur çekilmez">
            <div className="segmented" role="group" aria-label="Çevirim yönü">
              <button type="button" className={direction === 'toForeign' ? 'active' : ''} onClick={() => setDirection('toForeign')}>TL → Döviz</button>
              <button type="button" className={direction === 'toTl' ? 'active' : ''} onClick={() => setDirection('toTl')}>Döviz → TL</button>
            </div>
          </FormField>
          <FormField label={direction === 'toForeign' ? 'Tutar (TL)' : `Tutar (${currencyLabel})`} htmlFor="amount">
            <input id="amount" type="text" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </FormField>
          <FormField label="Kur (1 birim döviz = ? TL)" htmlFor="rate">
            <input id="rate" type="text" inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} />
          </FormField>
          <FormField label="Döviz kodu (etiket)" htmlFor="currencyLabel" full>
            <input id="currencyLabel" type="text" value={currencyLabel} onChange={(e) => setCurrencyLabel(e.target.value.toUpperCase())} maxLength={6} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <ResultCard
          key={result.convertedAmount}
          label="Sonuç"
          value={direction === 'toForeign'
            ? `${formatNumber(result.convertedAmount)} ${currencyLabel}`
            : `${formatNumber(result.convertedAmount)} TL`}
          note={`Kullanılan kur: 1 ${currencyLabel} = ${formatNumber(result.rate)} TL`}
        />
      )}

      <div className="info-card">
        <h2>Nasıl kullanılır?</h2>
        <ul>
          <li>Bu araç canlı döviz kuru çekmez; güncel kuru elle girmeniz gerekir.</li>
          <li>"TL → Döviz" modunda TL tutarı dövize, "Döviz → TL" modunda döviz tutarı TL'ye çevrilir.</li>
        </ul>
      </div>
    </CalculatorLayout>
  );
}
