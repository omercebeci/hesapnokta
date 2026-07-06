import React, { useMemo, useState } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateDiscount } from '../../../lib/finansCalculators.js';
import { formatCurrency, parseLocaleNumber } from '../../../utils/format.js';

export default function IndirimHesaplama() {
  const [listPrice, setListPrice] = useState('1000');
  const [discountRate, setDiscountRate] = useState('20');

  const { result, error } = useMemo(() => {
    const parsedPrice = parseLocaleNumber(listPrice);
    const parsedRate = parseLocaleNumber(discountRate);

    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      return { result: null, error: 'Lütfen geçerli bir fiyat girin.' };
    }
    if (!Number.isFinite(parsedRate) || parsedRate < 0 || parsedRate > 100) {
      return { result: null, error: 'İndirim oranı 0-100 arasında olmalıdır.' };
    }

    return { result: calculateDiscount({ listPrice: parsedPrice, discountRate: parsedRate }), error: null };
  }, [listPrice, discountRate]);

  return (
    <CalculatorLayout calculatorId="indirim-hesaplama">
      <div className="calc-card">
        <h2>Fiyat bilgileri</h2>
        <div className="form-grid">
          <FormField label="Ürün fiyatı (TL)" htmlFor="listPrice">
            <input id="listPrice" type="text" inputMode="decimal" value={listPrice} onChange={(e) => setListPrice(e.target.value)} />
          </FormField>
          <FormField label="İndirim oranı (%)" htmlFor="discountRate">
            <input id="discountRate" type="text" inputMode="decimal" value={discountRate} onChange={(e) => setDiscountRate(e.target.value)} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard label="İndirimli fiyat" value={formatCurrency(result.finalPrice)} />
          <ResultMetrics items={[{ label: 'Kazanılan tutar', value: formatCurrency(result.discountAmount) }]} />
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl yorumlanır?</h2>
        <ul>
          <li>İndirim tutarı, ürün fiyatının indirim oranı kadarıdır.</li>
          <li>Kampanyalarda ek şartlar (kupon, minimum sepet tutarı vb.) sonucu etkileyebilir.</li>
        </ul>
      </div>
    </CalculatorLayout>
  );
}
