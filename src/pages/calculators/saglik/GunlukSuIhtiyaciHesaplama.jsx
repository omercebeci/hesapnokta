import React, { useMemo, useState } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateWaterIntake } from '../../../lib/saglikCalculators.js';
import { formatNumber, parseLocaleNumber } from '../../../utils/format.js';

export default function GunlukSuIhtiyaciHesaplama() {
  const [weightKg, setWeightKg] = useState('70');
  const [activityMinutes, setActivityMinutes] = useState('30');
  const [hotClimate, setHotClimate] = useState(false);

  const { result, error } = useMemo(() => {
    const parsedWeight = parseLocaleNumber(weightKg);
    const parsedActivity = parseLocaleNumber(activityMinutes);

    if (!Number.isFinite(parsedWeight) || parsedWeight <= 0 || parsedWeight > 400) {
      return { result: null, error: 'Lütfen geçerli bir kilo değeri girin (kg).' };
    }
    if (!Number.isFinite(parsedActivity) || parsedActivity < 0) {
      return { result: null, error: 'Aktivite süresi negatif olamaz.' };
    }

    return {
      result: calculateWaterIntake({ weightKg: parsedWeight, activityMinutes: parsedActivity, hotClimate }),
      error: null,
    };
  }, [weightKg, activityMinutes, hotClimate]);

  return (
    <CalculatorLayout calculatorId="gunluk-su-ihtiyaci-hesaplama">
      <div className="calc-card">
        <h2>Bilgileriniz</h2>
        <div className="form-grid">
          <FormField label="Kilo (kg)" htmlFor="weightKg">
            <input id="weightKg" type="text" inputMode="decimal" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
          </FormField>
          <FormField label="Günlük egzersiz süresi (dk)" htmlFor="activityMinutes">
            <input id="activityMinutes" type="text" inputMode="numeric" value={activityMinutes} onChange={(e) => setActivityMinutes(e.target.value)} />
          </FormField>
          <FormField label="Sıcak iklim / yoğun terleme" htmlFor="hotClimate" full>
            <div className="segmented" role="group" aria-label="Sıcak iklim">
              <button type="button" className={!hotClimate ? 'active' : ''} onClick={() => setHotClimate(false)}>Hayır</button>
              <button type="button" className={hotClimate ? 'active' : ''} onClick={() => setHotClimate(true)}>Evet</button>
            </div>
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard label="Günlük su ihtiyacı" value={`${formatNumber(result.totalLiters)} L`} note={`Yaklaşık ${result.glasses} bardak (200 ml)`} />
          <ResultMetrics
            items={[
              { label: 'Kiloya göre temel ihtiyaç', value: `${formatNumber(result.baseMl / 1000)} L` },
              { label: 'Aktivite ek payı', value: `${formatNumber(result.activityBonusMl / 1000)} L` },
            ]}
          />
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl hesaplanır?</h2>
        <p>Kilogram başına 33 ml temel su ihtiyacına, egzersiz süresine göre (dakikada ~12 ml) ve sıcak iklim/yoğun terleme durumunda ek bir pay eklenir. Bu genel bir tahmindir; böbrek/kalp rahatsızlığı gibi durumlarda doktorunuzun önerisine uyun.</p>
      </div>
    </CalculatorLayout>
  );
}
