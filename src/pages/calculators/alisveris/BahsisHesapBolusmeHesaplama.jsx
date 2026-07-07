import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateTipSplit } from '../../../lib/alisverisCalculators.js';
import { formatCurrency, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

export default function BahsisHesapBolusmeHesaplama() {
  const [billAmount, setBillAmount] = useQueryParamState('hesap', '1000');
  const [tipPercentage, setTipPercentage] = useQueryParamState('bahsis', '10');
  const [peopleCount, setPeopleCount] = useQueryParamState('kisi', '4');

  const { result, error } = useMemo(() => {
    const parsedBill = parseLocaleNumber(billAmount);
    const parsedTip = parseLocaleNumber(tipPercentage);
    const parsedPeople = parseLocaleNumber(peopleCount);

    if (!Number.isFinite(parsedBill) || parsedBill <= 0) {
      return { result: null, error: 'Lütfen geçerli bir hesap tutarı girin.' };
    }
    if (!Number.isFinite(parsedTip) || parsedTip < 0) {
      return { result: null, error: 'Bahşiş oranı negatif olamaz.' };
    }
    if (!Number.isFinite(parsedPeople) || parsedPeople < 1) {
      return { result: null, error: 'Kişi sayısı en az 1 olmalıdır.' };
    }

    return {
      result: calculateTipSplit({ billAmount: parsedBill, tipPercentage: parsedTip, peopleCount: parsedPeople }),
      error: null,
    };
  }, [billAmount, tipPercentage, peopleCount]);

  return (
    <CalculatorLayout calculatorId="bahsis-hesap-bolusme-hesaplama">
      <div className="calc-card">
        <h2>Hesap bilgileri</h2>
        <div className="form-grid">
          <FormField label="Hesap tutarı (TL)" htmlFor="billAmount" full>
            <input id="billAmount" type="text" inputMode="decimal" value={billAmount} onChange={(e) => setBillAmount(e.target.value)} />
          </FormField>
          <FormField label="Bahşiş oranı (%)" htmlFor="tipPercentage">
            <input id="tipPercentage" type="text" inputMode="decimal" value={tipPercentage} onChange={(e) => setTipPercentage(e.target.value)} />
          </FormField>
          <FormField label="Kişi sayısı" htmlFor="peopleCount">
            <input id="peopleCount" type="text" inputMode="numeric" value={peopleCount} onChange={(e) => setPeopleCount(e.target.value)} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard label="Kişi başı ödeme" value={formatCurrency(result.perPerson)} />
          <ResultMetrics
            items={[
              { label: 'Bahşiş tutarı', value: formatCurrency(result.tipAmount) },
              { label: 'Bahşiş dahil toplam', value: formatCurrency(result.totalWithTip) },
            ]}
          />
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl kullanılır?</h2>
        <p>Hesap tutarına girdiğiniz oranda bahşiş eklenir, toplam tutar kişi sayısına eşit olarak bölünür. Farklı miktarda yiyen/içen kişiler için pay eşit olmayabilir; bu araç eşit bölüşüm varsayar.</p>
      </div>
    </CalculatorLayout>
  );
}
