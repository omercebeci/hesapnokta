import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateInstallmentComparison } from '../../../lib/finansCalculators.js';
import { formatCurrency, formatNumber, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

export default function TaksitKarsilastirmaHesaplama() {
  const [cashPrice, setCashPrice] = useQueryParamState('pesin', '10000');
  const [installmentCount, setInstallmentCount] = useQueryParamState('taksitSayisi', '12');
  const [monthlyInstallment, setMonthlyInstallment] = useQueryParamState('taksit', '950');

  const { result, error } = useMemo(() => {
    const parsedCash = parseLocaleNumber(cashPrice);
    const parsedCount = parseLocaleNumber(installmentCount);
    const parsedMonthly = parseLocaleNumber(monthlyInstallment);

    if (!Number.isFinite(parsedCash) || parsedCash <= 0) {
      return { result: null, error: 'Lütfen geçerli bir peşin fiyat girin.' };
    }
    if (!Number.isFinite(parsedCount) || parsedCount < 1) {
      return { result: null, error: 'Taksit sayısı en az 1 olmalıdır.' };
    }
    if (!Number.isFinite(parsedMonthly) || parsedMonthly <= 0) {
      return { result: null, error: 'Lütfen geçerli bir aylık taksit tutarı girin.' };
    }

    return {
      result: calculateInstallmentComparison({ cashPrice: parsedCash, installmentCount: parsedCount, monthlyInstallment: parsedMonthly }),
      error: null,
    };
  }, [cashPrice, installmentCount, monthlyInstallment]);

  return (
    <CalculatorLayout calculatorId="taksit-karsilastirma-hesaplama">
      <div className="calc-card">
        <h2>Fiyat bilgileri</h2>
        <div className="form-grid">
          <FormField label="Peşin fiyat (TL)" htmlFor="cashPrice" full>
            <input id="cashPrice" type="text" inputMode="decimal" value={cashPrice} onChange={(e) => setCashPrice(e.target.value)} />
          </FormField>
          <FormField label="Taksit sayısı" htmlFor="installmentCount">
            <input id="installmentCount" type="text" inputMode="numeric" value={installmentCount} onChange={(e) => setInstallmentCount(e.target.value)} />
          </FormField>
          <FormField label="Aylık taksit tutarı (TL)" htmlFor="monthlyInstallment">
            <input id="monthlyInstallment" type="text" inputMode="decimal" value={monthlyInstallment} onChange={(e) => setMonthlyInstallment(e.target.value)} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard
            label="Taksitin gerçek ek maliyeti"
            value={formatCurrency(result.extraCost)}
            note={`Peşine göre %${formatNumber(result.extraCostRate)} daha pahalı`}
          />
          <ResultMetrics items={[{ label: 'Taksitli toplam fiyat', value: formatCurrency(result.totalInstallmentPrice) }]} />
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl hesaplanır?</h2>
        <p>Taksitli toplam fiyat, aylık taksit tutarının taksit sayısıyla çarpılmasıyla bulunur. Bu tutarın peşin fiyattan farkı, taksitlendirmenin gizli faiz maliyetini (ek maliyet) gösterir.</p>
      </div>
    </CalculatorLayout>
  );
}
