import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import AmountInput from '../../../components/AmountInput.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculatePriceChangeRate } from '../../../lib/alisverisCalculators.js';
import { formatCurrency, formatPercent, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

export default function ZamOraniHesaplama() {
  const [oldPrice, setOldPrice] = useQueryParamState('eski', '100');
  const [newPrice, setNewPrice] = useQueryParamState('yeni', '130');

  const { result, error } = useMemo(() => {
    const parsedOld = parseLocaleNumber(oldPrice);
    const parsedNew = parseLocaleNumber(newPrice);

    if (!Number.isFinite(parsedOld) || parsedOld <= 0) {
      return { result: null, error: 'Lütfen geçerli bir eski fiyat girin.' };
    }
    if (!Number.isFinite(parsedNew) || parsedNew < 0) {
      return { result: null, error: 'Lütfen geçerli bir yeni fiyat girin.' };
    }

    return { result: calculatePriceChangeRate({ oldPrice: parsedOld, newPrice: parsedNew }), error: null };
  }, [oldPrice, newPrice]);

  return (
    <CalculatorLayout calculatorId="zam-orani-hesaplama">
      <div className="calc-card">
        <h2>Fiyat bilgileri</h2>
        <div className="form-grid">
          <FormField label="Eski fiyat (TL)" htmlFor="oldPrice">
            <AmountInput id="oldPrice" value={oldPrice} onChange={setOldPrice} />
          </FormField>
          <FormField label="Yeni fiyat (TL)" htmlFor="newPrice">
            <AmountInput id="newPrice" value={newPrice} onChange={setNewPrice} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard
            label={result.isIncrease ? 'Zam oranı' : 'İndirim oranı'}
            value={formatPercent(Math.abs(result.changeRate))}
          />
          <ResultMetrics items={[{ label: result.isIncrease ? 'Zam tutarı' : 'Düşüş tutarı', value: formatCurrency(Math.abs(result.changeAmount)) }]} />
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl hesaplanır?</h2>
        <p>Oran, yeni fiyat ile eski fiyat arasındaki farkın eski fiyata bölünüp 100 ile çarpılmasıyla bulunur: ((yeni − eski) ÷ eski) × 100. Yeni fiyat eski fiyattan düşükse sonuç indirim oranı olarak yorumlanır.</p>
      </div>
    </CalculatorLayout>
  );
}
