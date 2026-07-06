import React, { useMemo, useState } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateInflationImpact } from '../../../lib/finansCalculators.js';
import { formatCurrency, formatPercent, parseLocaleNumber } from '../../../utils/format.js';

export default function EnflasyonEtkisiHesaplama() {
  const [amount, setAmount] = useState('100000');
  const [annualInflationRate, setAnnualInflationRate] = useState('30');
  const [years, setYears] = useState('5');

  const { result, error } = useMemo(() => {
    const parsedAmount = parseLocaleNumber(amount);
    const parsedRate = parseLocaleNumber(annualInflationRate);
    const parsedYears = parseLocaleNumber(years);

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return { result: null, error: 'Lütfen geçerli bir tutar girin.' };
    }
    if (!Number.isFinite(parsedRate) || parsedRate < 0) {
      return { result: null, error: 'Lütfen geçerli bir yıllık enflasyon oranı girin.' };
    }
    if (!Number.isFinite(parsedYears) || parsedYears <= 0) {
      return { result: null, error: 'Süre en az 1 yıl olmalıdır.' };
    }

    return {
      result: calculateInflationImpact({ amount: parsedAmount, annualInflationRate: parsedRate, years: parsedYears }),
      error: null,
    };
  }, [amount, annualInflationRate, years]);

  return (
    <CalculatorLayout calculatorId="enflasyon-etkisi-hesaplama">
      <div className="calc-card">
        <h2>Senaryo bilgileri</h2>
        <div className="form-grid">
          <FormField label="Bugünkü tutar (TL)" htmlFor="amount" full>
            <input id="amount" type="text" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </FormField>
          <FormField label="Varsayılan yıllık enflasyon (%)" htmlFor="annualInflationRate" hint="Kendi senaryonuza göre değiştirebilirsiniz">
            <input id="annualInflationRate" type="text" inputMode="decimal" value={annualInflationRate} onChange={(e) => setAnnualInflationRate(e.target.value)} />
          </FormField>
          <FormField label="Süre (yıl)" htmlFor="years">
            <input id="years" type="text" inputMode="decimal" value={years} onChange={(e) => setYears(e.target.value)} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard
            label={`${years} yıl sonraki alım gücü (bugünün parasıyla)`}
            value={formatCurrency(result.erodedPurchasingPower)}
            note={`Alım gücü kaybı: ${formatPercent(result.purchasingPowerLossRate)}`}
          />
          <ResultMetrics items={[{ label: 'Aynı alım gücü için gereken nominal tutar', value: formatCurrency(result.futureNominalNeeded) }]} />
          <p className="rate-disclaimer">⚠️ Enflasyon oranı geleceğe yönelik bir varsayımdır; gerçek enflasyon bu tahminden farklı gerçekleşebilir. Güncel resmi TÜFE verilerini TÜİK'ten kontrol edebilirsiniz.</p>
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl hesaplanır?</h2>
        <p>Girdiğiniz tutar, yıllık enflasyon oranıyla bileşik olarak büyütülerek aynı alım gücünü korumak için gelecekte gereken nominal tutar bulunur (tutar × (1 + oran)^yıl). Bugünkü tutarın gelecekteki alım gücü ise bu işlemin tersine çevrilmesiyle hesaplanır.</p>
      </div>
    </CalculatorLayout>
  );
}
