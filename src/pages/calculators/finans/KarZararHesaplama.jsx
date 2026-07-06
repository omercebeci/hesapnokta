import React, { useMemo, useState } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateInvestmentReturn } from '../../../lib/finansCalculators.js';
import { formatCurrency, formatPercent, parseLocaleNumber } from '../../../utils/format.js';

export default function KarZararHesaplama() {
  const [buyPrice, setBuyPrice] = useState('100');
  const [currentPrice, setCurrentPrice] = useState('120');
  const [quantity, setQuantity] = useState('1');

  const { result, error } = useMemo(() => {
    const parsedBuy = parseLocaleNumber(buyPrice);
    const parsedCurrent = parseLocaleNumber(currentPrice);
    const parsedQty = parseLocaleNumber(quantity);

    if (!Number.isFinite(parsedBuy) || parsedBuy < 0) {
      return { result: null, error: 'Lütfen geçerli bir alış fiyatı girin.' };
    }
    if (!Number.isFinite(parsedCurrent) || parsedCurrent < 0) {
      return { result: null, error: 'Lütfen geçerli bir güncel fiyat girin.' };
    }
    if (!Number.isFinite(parsedQty) || parsedQty <= 0) {
      return { result: null, error: 'Adet/miktar en az 1 olmalıdır.' };
    }

    return { result: calculateInvestmentReturn({ buyPrice: parsedBuy, currentPrice: parsedCurrent, quantity: parsedQty }), error: null };
  }, [buyPrice, currentPrice, quantity]);

  const isProfit = result && result.profit >= 0;

  return (
    <CalculatorLayout calculatorId="kar-zarar-hesaplama">
      <div className="calc-card">
        <h2>Yatırım bilgileri</h2>
        <div className="form-grid">
          <FormField label="Alış fiyatı (birim)" htmlFor="buyPrice">
            <input id="buyPrice" type="text" inputMode="decimal" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} />
          </FormField>
          <FormField label="Güncel fiyat (birim)" htmlFor="currentPrice">
            <input id="currentPrice" type="text" inputMode="decimal" value={currentPrice} onChange={(e) => setCurrentPrice(e.target.value)} />
          </FormField>
          <FormField label="Adet / miktar" htmlFor="quantity" full>
            <input id="quantity" type="text" inputMode="decimal" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard
            label={isProfit ? 'Kâr' : 'Zarar'}
            value={formatCurrency(Math.abs(result.profit))}
            note={`Getiri oranı: ${formatPercent(result.returnRate)}`}
          />
          <ResultMetrics
            items={[
              { label: 'Toplam yatırılan', value: formatCurrency(result.invested) },
              { label: 'Güncel değer', value: formatCurrency(result.currentValue) },
            ]}
          />
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl yorumlanır?</h2>
        <ul>
          <li>Bu araç yalnızca alış/güncel fiyat farkına göre kâr-zarar gösterir.</li>
          <li>Komisyon, vergi ve kur farkı gibi maliyetleri içermez; yatırım tavsiyesi değildir.</li>
        </ul>
      </div>
    </CalculatorLayout>
  );
}
