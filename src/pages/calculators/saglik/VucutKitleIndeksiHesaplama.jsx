import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateBMI } from '../../../lib/saglikCalculators.js';
import { formatNumber, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

export default function VucutKitleIndeksiHesaplama() {
  const [weightKg, setWeightKg] = useQueryParamState('kilo', '70');
  const [heightCm, setHeightCm] = useQueryParamState('boy', '170');

  const { result, error } = useMemo(() => {
    const parsedWeight = parseLocaleNumber(weightKg);
    const parsedHeight = parseLocaleNumber(heightCm);

    if (!Number.isFinite(parsedWeight) || parsedWeight <= 0 || parsedWeight > 400) {
      return { result: null, error: 'Lütfen geçerli bir kilo değeri girin (kg).' };
    }
    if (!Number.isFinite(parsedHeight) || parsedHeight <= 0 || parsedHeight > 250) {
      return { result: null, error: 'Lütfen geçerli bir boy değeri girin (cm).' };
    }

    return { result: calculateBMI({ weightKg: parsedWeight, heightCm: parsedHeight }), error: null };
  }, [weightKg, heightCm]);

  return (
    <CalculatorLayout calculatorId="vucut-kitle-indeksi-hesaplama">
      <div className="calc-card">
        <h2>Vücut ölçüleri</h2>
        <div className="form-grid">
          <FormField label="Kilo (kg)" htmlFor="weightKg">
            <input id="weightKg" type="text" inputMode="decimal" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
          </FormField>
          <FormField label="Boy (cm)" htmlFor="heightCm">
            <input id="heightCm" type="text" inputMode="decimal" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard label="Vücut Kitle İndeksi" value={formatNumber(result.bmi, { decimals: 1 })} note={result.category.label} />
          <ResultMetrics
            items={[
              { label: 'İdeal kilo aralığı (min)', value: `${formatNumber(result.idealWeightMin, { decimals: 1 })} kg` },
              { label: 'İdeal kilo aralığı (max)', value: `${formatNumber(result.idealWeightMax, { decimals: 1 })} kg` },
            ]}
          />
        </div>
      )}

      <div className="info-card">
        <h2>VKİ kategorileri</h2>
        <ul>
          <li>18,5 altı: Zayıf</li>
          <li>18,5 – 24,9: Normal</li>
          <li>25 – 29,9: Fazla kilolu</li>
          <li>30 ve üzeri: Obez</li>
        </ul>
        <p style={{ marginTop: 10 }}>VKİ; kas kütlesi, yaş ve vücut yapısını ayırt etmez, genel bir gösterge sunar. Sağlık kararları için doktorunuza danışın.</p>
      </div>
    </CalculatorLayout>
  );
}
