import React, { useMemo, useState } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import DataPeriodNote from '../../../components/DataPeriodNote.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateRentIncrease } from '../../../lib/finansCalculators.js';
import { formatCurrency, formatPercent, parseLocaleNumber } from '../../../utils/format.js';
import { GUNCEL_VERILER } from '../../../data/guncelVeriler.js';

const KIRA_TAVANI = GUNCEL_VERILER.kiraArtisTavanOrani;

export default function KiraArtisHesaplama() {
  const [currentRent, setCurrentRent] = useState('10000');
  const [increaseRate, setIncreaseRate] = useState('40');
  const [legalCapRate, setLegalCapRate] = useState(String(KIRA_TAVANI.value));

  const { result, error } = useMemo(() => {
    const parsedRent = parseLocaleNumber(currentRent);
    const parsedRate = parseLocaleNumber(increaseRate);
    const parsedCap = parseLocaleNumber(legalCapRate);

    if (!Number.isFinite(parsedRent) || parsedRent < 0) {
      return { result: null, error: 'Lütfen geçerli bir kira tutarı girin.' };
    }
    if (!Number.isFinite(parsedRate) || parsedRate < 0) {
      return { result: null, error: 'Lütfen geçerli bir istenen artış oranı girin.' };
    }

    return {
      result: calculateRentIncrease({
        currentRent: parsedRent,
        increaseRate: parsedRate,
        legalCapRate: Number.isFinite(parsedCap) ? parsedCap : undefined,
      }),
      error: null,
    };
  }, [currentRent, increaseRate, legalCapRate]);

  return (
    <CalculatorLayout calculatorId="kira-artis-hesaplama">
      <div className="calc-card">
        <h2>Kira bilgileri</h2>
        <div className="form-grid">
          <FormField label="Mevcut kira (TL)" htmlFor="currentRent">
            <input id="currentRent" type="text" inputMode="decimal" value={currentRent} onChange={(e) => setCurrentRent(e.target.value)} />
          </FormField>
          <FormField label="İstenen artış oranı (%)" htmlFor="increaseRate">
            <input id="increaseRate" type="text" inputMode="decimal" value={increaseRate} onChange={(e) => setIncreaseRate(e.target.value)} />
          </FormField>
          <FormField label="Yasal üst sınır - TÜFE 12 aylık ortalama (%)" htmlFor="legalCapRate" full hint={`Varsayılan: ${KIRA_TAVANI.period} dönemi oranı. Boş bırakılırsa sınır uygulanmaz.`}>
            <input id="legalCapRate" type="text" inputMode="decimal" value={legalCapRate} onChange={(e) => setLegalCapRate(e.target.value)} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard label="Yeni kira" value={formatCurrency(result.newRent)} note={`Uygulanan oran: ${formatPercent(result.appliedRate)}`} />
          <ResultMetrics
            items={[
              { label: 'Aylık fark', value: formatCurrency(result.monthlyDifference) },
              { label: 'Yıllık fark', value: formatCurrency(result.yearlyDifference) },
            ]}
          />
          <DataPeriodNote period={KIRA_TAVANI.period} lastUpdated={KIRA_TAVANI.lastUpdated} source={KIRA_TAVANI.source} />
          <p className="rate-disclaimer">⚠️ TÜFE 12 aylık ortalama oranı her ay güncellenir; girdiğiniz oran değişmiş olabilir, işlem öncesi güncel değeri TÜİK/resmi kaynaklardan kontrol edin.</p>
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl yorumlanır?</h2>
        <p>İstenen artış oranı, yasal üst sınırdan yüksekse hesap otomatik olarak üst sınırı uygular.</p>
      </div>
    </CalculatorLayout>
  );
}
