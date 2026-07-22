import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import AmountInput from '../../../components/AmountInput.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import DataPeriodNote from '../../../components/DataPeriodNote.jsx';
import { calculateNaturalGasCost } from '../../../lib/gunlukYasamCalculators.js';
import { GUNCEL_VERILER } from '../../../data/guncelVeriler.js';
import { formatCurrency, formatNumber, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

const GAS_DATA = GUNCEL_VERILER.dogalgazDonusum;

export default function DogalgazTuketimiHesaplama() {
  const [m3, setM3] = useQueryParamState('m3', '120');
  const [pricePerM3, setPricePerM3] = useQueryParamState('fiyat', '18');

  const { result, error } = useMemo(() => {
    const parsedM3 = parseLocaleNumber(m3);
    const parsedPrice = parseLocaleNumber(pricePerM3);

    if (!Number.isFinite(parsedM3) || parsedM3 <= 0) {
      return { result: null, error: 'Lütfen geçerli bir m³ tüketimi girin.' };
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      return { result: null, error: 'Lütfen geçerli bir m³ birim fiyatı girin.' };
    }

    return { result: calculateNaturalGasCost({ m3: parsedM3, pricePerM3: parsedPrice }), error: null };
  }, [m3, pricePerM3]);

  return (
    <CalculatorLayout calculatorId="dogalgaz-tuketimi-hesaplama">
      <div className="calc-card">
        <h2>Tüketim bilgileri</h2>
        <div className="form-grid">
          <FormField label="Sayaçtan okunan tüketim (m³)" htmlFor="m3">
            <input id="m3" type="text" inputMode="decimal" value={m3} onChange={(e) => setM3(e.target.value)} />
          </FormField>
          <FormField label="m³ birim fiyatı (TL)" htmlFor="pricePerM3" hint="Faturanızdaki birim fiyatı girin">
            <AmountInput id="pricePerM3" value={pricePerM3} onChange={setPricePerM3} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard label="Aylık maliyet" value={formatCurrency(result.monthlyCost)} />
          <ResultMetrics
            items={[
              { label: 'Enerji karşılığı', value: `${formatNumber(result.kwh)} kWh` },
              { label: 'kWh başına maliyet', value: formatCurrency(result.costPerKwh) },
            ]}
          />
          <DataPeriodNote period={GAS_DATA.period} lastUpdated={GAS_DATA.lastUpdated} source={GAS_DATA.source} />
        </div>
      )}

      <div className="info-card">
        <h2>m³ nasıl kWh'e çevrilir?</h2>
        <p>
          Enerji (kWh) = Düzeltilmiş tüketim (m³) × Üst ısıl değer (kcal/m³) ÷ 860,42 (1 kWh'in kcal karşılığı).
          "Üst ısıl değer" doğalgazın enerji içeriğidir ve dağıtım şirketinin o faturalandırma dönemi için
          yayınladığı ortalamaya göre küçük farklar gösterebilir; burada tipik bir değer kullanılmıştır.
          "Düzeltme katsayısı" ise sayacın ölçtüğü hacmi, mevsimsel sıcaklık/basınç farklarına göre standart
          koşullara taşır ve genellikle 1'e yakın bir değerdir. kWh karşılığı, elektrik faturanızla kıyaslama
          yapmak istediğinizde işinize yarar — <Link to="/elektrik-tuketimi-hesaplama">elektrik tüketimi aracıyla</Link> karşılaştırabilirsiniz.
        </p>
      </div>
    </CalculatorLayout>
  );
}
