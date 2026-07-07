import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateStepsToCalories } from '../../../lib/saglikCalculators.js';
import { formatNumber, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

export default function AdimKaloriDonusumuHesaplama() {
  const [steps, setSteps] = useQueryParamState('adim', '10000');
  const [weightKg, setWeightKg] = useQueryParamState('kilo', '70');
  const [strideMeters, setStrideMeters] = useQueryParamState('adimBoyu', '0,75');

  const { result, error } = useMemo(() => {
    const parsedSteps = parseLocaleNumber(steps);
    const parsedWeight = parseLocaleNumber(weightKg);
    const parsedStride = parseLocaleNumber(strideMeters);

    if (!Number.isFinite(parsedSteps) || parsedSteps <= 0) {
      return { result: null, error: 'Lütfen geçerli bir adım sayısı girin.' };
    }
    if (!Number.isFinite(parsedWeight) || parsedWeight <= 0) {
      return { result: null, error: 'Lütfen geçerli bir kilo girin.' };
    }

    return {
      result: calculateStepsToCalories({
        steps: parsedSteps,
        weightKg: parsedWeight,
        strideMeters: Number.isFinite(parsedStride) ? parsedStride : 0.75,
      }),
      error: null,
    };
  }, [steps, weightKg, strideMeters]);

  return (
    <CalculatorLayout calculatorId="adim-kalori-donusumu-hesaplama">
      <div className="calc-card">
        <h2>Bilgileriniz</h2>
        <div className="form-grid">
          <FormField label="Adım sayısı" htmlFor="steps" full>
            <input id="steps" type="text" inputMode="numeric" value={steps} onChange={(e) => setSteps(e.target.value)} />
          </FormField>
          <FormField label="Kilo (kg)" htmlFor="weightKg">
            <input id="weightKg" type="text" inputMode="decimal" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
          </FormField>
          <FormField label="Adım uzunluğu (m)" htmlFor="strideMeters" hint="Varsayılan ortalama adım">
            <input id="strideMeters" type="text" inputMode="decimal" value={strideMeters} onChange={(e) => setStrideMeters(e.target.value)} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard label="Yakılan tahmini kalori" value={`${formatNumber(result.caloriesBurned, { decimals: 0 })} kcal`} />
          <ResultMetrics items={[{ label: 'Katedilen mesafe', value: `${formatNumber(result.distanceKm)} km` }]} />
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl hesaplanır?</h2>
        <p>Mesafe, adım sayısının ortalama adım uzunluğuyla çarpılmasıyla bulunur. Yakılan kalori ise adım sayısı, vücut ağırlığınız ve ortalama yürüme temposunu yansıtan bir katsayı (0,0005) ile tahmin edilir. Yokuş, koşu temposu veya sırt çantası gibi etkenler gerçek tüketimi değiştirebilir; bu araç sadece yaklaşık bir tahmin sunar.</p>
      </div>
    </CalculatorLayout>
  );
}
