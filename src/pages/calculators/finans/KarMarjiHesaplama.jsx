import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateProfitMargin } from '../../../lib/finansCalculators.js';
import { formatCurrency, formatPercent, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

export default function KarMarjiHesaplama() {
  const [cost, setCost] = useQueryParamState('maliyet', '100');
  const [salePrice, setSalePrice] = useQueryParamState('fiyat', '150');
  const [quantity, setQuantity] = useQueryParamState('adet', '1');

  const { result, error } = useMemo(() => {
    const parsedCost = parseLocaleNumber(cost);
    const parsedSale = parseLocaleNumber(salePrice);
    const parsedQty = parseLocaleNumber(quantity);

    if (!Number.isFinite(parsedCost) || parsedCost < 0) {
      return { result: null, error: 'Lütfen geçerli bir maliyet girin.' };
    }
    if (!Number.isFinite(parsedSale) || parsedSale < 0) {
      return { result: null, error: 'Lütfen geçerli bir satış fiyatı girin.' };
    }
    if (!Number.isFinite(parsedQty) || parsedQty <= 0) {
      return { result: null, error: 'Adet en az 1 olmalıdır.' };
    }

    return { result: calculateProfitMargin({ cost: parsedCost, salePrice: parsedSale, quantity: parsedQty }), error: null };
  }, [cost, salePrice, quantity]);

  return (
    <CalculatorLayout calculatorId="kar-marji-hesaplama">
      <div className="calc-card">
        <h2>Ürün bilgileri</h2>
        <div className="form-grid">
          <FormField label="Birim maliyet (TL)" htmlFor="cost">
            <input id="cost" type="text" inputMode="decimal" value={cost} onChange={(e) => setCost(e.target.value)} />
          </FormField>
          <FormField label="Birim satış fiyatı (TL)" htmlFor="salePrice">
            <input id="salePrice" type="text" inputMode="decimal" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} />
          </FormField>
          <FormField label="Adet" htmlFor="quantity" full>
            <input id="quantity" type="text" inputMode="numeric" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard label="Toplam kâr" value={formatCurrency(result.profit)} />
          <ResultMetrics
            items={[
              { label: 'Toplam ciro', value: formatCurrency(result.revenue) },
              { label: 'Toplam maliyet', value: formatCurrency(result.totalCost) },
              { label: 'Kâr marjı (ciroya göre)', value: formatPercent(result.marginRate) },
              { label: 'Kâr yüzdesi (maliyete göre)', value: formatPercent(result.markupRate) },
            ]}
          />
        </div>
      )}

      <div className="info-card">
        <h2>Kâr marjı ile kâr yüzdesi farkı</h2>
        <ul>
          <li>Kâr marjı, kârın satış fiyatına oranıdır.</li>
          <li>Kâr yüzdesi (markup), kârın maliyete oranıdır.</li>
        </ul>
      </div>
    </CalculatorLayout>
  );
}
