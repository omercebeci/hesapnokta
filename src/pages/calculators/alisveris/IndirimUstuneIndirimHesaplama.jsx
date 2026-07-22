import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import AmountInput from '../../../components/AmountInput.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateStackedDiscount } from '../../../lib/alisverisCalculators.js';
import { formatCurrency, formatPercent, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

export default function IndirimUstuneIndirimHesaplama() {
  const [price, setPrice] = useQueryParamState('fiyat', '1000');
  const [firstDiscount, setFirstDiscount] = useQueryParamState('indirim1', '20');
  const [secondDiscount, setSecondDiscount] = useQueryParamState('indirim2', '10');

  const { result, error } = useMemo(() => {
    const parsedPrice = parseLocaleNumber(price);
    const parsedFirst = parseLocaleNumber(firstDiscount);
    const parsedSecond = parseLocaleNumber(secondDiscount);

    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      return { result: null, error: 'Lütfen geçerli bir ürün fiyatı girin.' };
    }
    if (!Number.isFinite(parsedFirst) || parsedFirst < 0 || parsedFirst > 100) {
      return { result: null, error: 'İlk indirim oranı 0-100 arasında olmalıdır.' };
    }
    if (!Number.isFinite(parsedSecond) || parsedSecond < 0 || parsedSecond > 100) {
      return { result: null, error: 'İkinci indirim oranı 0-100 arasında olmalıdır.' };
    }

    return {
      result: calculateStackedDiscount({ price: parsedPrice, discountRates: [parsedFirst, parsedSecond] }),
      error: null,
    };
  }, [price, firstDiscount, secondDiscount]);

  return (
    <CalculatorLayout calculatorId="indirim-ustune-indirim-hesaplama">
      <div className="calc-card">
        <h2>Kampanya bilgileri</h2>
        <div className="form-grid">
          <FormField label="Ürün fiyatı (TL)" htmlFor="price" full>
            <AmountInput id="price" value={price} onChange={setPrice} />
          </FormField>
          <FormField label="1. indirim oranı (%)" htmlFor="firstDiscount">
            <input id="firstDiscount" type="text" inputMode="decimal" value={firstDiscount} onChange={(e) => setFirstDiscount(e.target.value)} />
          </FormField>
          <FormField label="2. indirim oranı (%)" htmlFor="secondDiscount">
            <input id="secondDiscount" type="text" inputMode="decimal" value={secondDiscount} onChange={(e) => setSecondDiscount(e.target.value)} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard
            label="Son fiyat"
            value={formatCurrency(result.finalPrice)}
            note={`Gerçek toplam indirim: ${formatPercent(result.effectiveDiscountRate)} (${firstDiscount}% + ${secondDiscount}% toplanmaz)`}
          />
          <ResultMetrics items={[{ label: 'Toplam tasarruf', value: formatCurrency(result.totalDiscountAmount) }]} />
        </div>
      )}

      <div className="info-card">
        <h2>Neden %20 + %10, %30 etmiyor?</h2>
        <p>İkinci indirim, ilk indirimden sonraki yeni fiyat üzerinden uygulanır. Bu yüzden art arda uygulanan indirimler basitçe toplanmaz; gerçek toplam indirim oranı her zaman iki oranın aritmetik toplamından biraz daha düşük çıkar.</p>
      </div>
    </CalculatorLayout>
  );
}
