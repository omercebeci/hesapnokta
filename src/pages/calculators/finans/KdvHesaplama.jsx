import React, { useMemo, useState } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateVat } from '../../../lib/finansCalculators.js';
import { formatCurrency, parseLocaleNumber } from '../../../utils/format.js';

export default function KdvHesaplama() {
  const [amount, setAmount] = useState('1000');
  const [vatRate, setVatRate] = useState('20');
  const [mode, setMode] = useState('add');

  const { result, error } = useMemo(() => {
    const parsedAmount = parseLocaleNumber(amount);
    const parsedRate = parseLocaleNumber(vatRate);

    if (!Number.isFinite(parsedAmount) || parsedAmount < 0) {
      return { result: null, error: 'Lütfen geçerli bir tutar girin.' };
    }
    if (!Number.isFinite(parsedRate) || parsedRate < 0) {
      return { result: null, error: 'Lütfen geçerli bir KDV oranı girin.' };
    }

    return { result: calculateVat({ amount: parsedAmount, vatRate: parsedRate, mode }), error: null };
  }, [amount, vatRate, mode]);

  return (
    <CalculatorLayout calculatorId="kdv-hesaplama">
      <div className="calc-card">
        <h2>Tutar bilgileri</h2>
        <div className="form-grid">
          <FormField label="Tutar (TL)" htmlFor="amount" full>
            <input id="amount" type="text" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </FormField>
          <FormField label="KDV oranı (%)" htmlFor="vatRate">
            <input id="vatRate" type="text" inputMode="decimal" value={vatRate} onChange={(e) => setVatRate(e.target.value)} />
          </FormField>
          <FormField label="Hesaplama türü" htmlFor="mode">
            <div className="segmented" role="group" aria-label="Hesaplama türü">
              <button type="button" className={mode === 'add' ? 'active' : ''} onClick={() => setMode('add')}>KDV hariç</button>
              <button type="button" className={mode === 'included' ? 'active' : ''} onClick={() => setMode('included')}>KDV dahil</button>
            </div>
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard label="Toplam tutar (KDV dahil)" value={formatCurrency(result.grossAmount)} />
          <ResultMetrics
            items={[
              { label: 'Matrah (KDV hariç)', value: formatCurrency(result.netAmount) },
              { label: 'KDV tutarı', value: formatCurrency(result.vatAmount) },
            ]}
          />
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl yorumlanır?</h2>
        <ul>
          <li>"KDV hariç" modunda girilen tutara KDV eklenir.</li>
          <li>"KDV dahil" modunda girilen tutarın içinden KDV ayrıştırılır.</li>
        </ul>
      </div>
    </CalculatorLayout>
  );
}
