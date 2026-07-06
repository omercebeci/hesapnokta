import React, { useMemo, useState } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateCalorieNeeds } from '../../../lib/saglikCalculators.js';
import { formatInteger, parseLocaleNumber } from '../../../utils/format.js';

const ACTIVITY_OPTIONS = [
  { value: 'sedentary', label: 'Hareketsiz (masa başı, egzersiz yok)' },
  { value: 'light', label: 'Az hareketli (haftada 1-3 gün)' },
  { value: 'moderate', label: 'Orta hareketli (haftada 3-5 gün)' },
  { value: 'active', label: 'Hareketli (haftada 6-7 gün)' },
  { value: 'veryActive', label: 'Çok hareketli (yoğun antrenman/fiziksel iş)' },
];

export default function KaloriIhtiyaciHesaplama() {
  const [gender, setGender] = useState('female');
  const [weightKg, setWeightKg] = useState('65');
  const [heightCm, setHeightCm] = useState('165');
  const [age, setAge] = useState('30');
  const [activityLevel, setActivityLevel] = useState('moderate');

  const { result, error } = useMemo(() => {
    const parsedWeight = parseLocaleNumber(weightKg);
    const parsedHeight = parseLocaleNumber(heightCm);
    const parsedAge = parseLocaleNumber(age);

    if (!Number.isFinite(parsedWeight) || parsedWeight <= 0 || parsedWeight > 400) {
      return { result: null, error: 'Lütfen geçerli bir kilo değeri girin (kg).' };
    }
    if (!Number.isFinite(parsedHeight) || parsedHeight <= 0 || parsedHeight > 250) {
      return { result: null, error: 'Lütfen geçerli bir boy değeri girin (cm).' };
    }
    if (!Number.isFinite(parsedAge) || parsedAge <= 0 || parsedAge > 120) {
      return { result: null, error: 'Lütfen geçerli bir yaş girin.' };
    }

    return {
      result: calculateCalorieNeeds({ gender, weightKg: parsedWeight, heightCm: parsedHeight, age: parsedAge, activityLevel }),
      error: null,
    };
  }, [gender, weightKg, heightCm, age, activityLevel]);

  return (
    <CalculatorLayout calculatorId="kalori-ihtiyaci-hesaplama">
      <div className="calc-card">
        <h2>Kişisel bilgiler</h2>
        <div className="form-grid">
          <FormField label="Cinsiyet" htmlFor="gender" full>
            <div className="segmented" role="group" aria-label="Cinsiyet">
              <button type="button" className={gender === 'female' ? 'active' : ''} onClick={() => setGender('female')}>Kadın</button>
              <button type="button" className={gender === 'male' ? 'active' : ''} onClick={() => setGender('male')}>Erkek</button>
            </div>
          </FormField>
          <FormField label="Kilo (kg)" htmlFor="weightKg">
            <input id="weightKg" type="text" inputMode="decimal" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
          </FormField>
          <FormField label="Boy (cm)" htmlFor="heightCm">
            <input id="heightCm" type="text" inputMode="decimal" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} />
          </FormField>
          <FormField label="Yaş" htmlFor="age" full>
            <input id="age" type="text" inputMode="numeric" value={age} onChange={(e) => setAge(e.target.value)} />
          </FormField>
          <FormField label="Aktivite seviyesi" htmlFor="activityLevel" full>
            <select id="activityLevel" value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)}>
              {ACTIVITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard label="Günlük kalori ihtiyacı (koruma)" value={`${formatInteger(result.maintenanceCalories)} kcal`} />
          <ResultMetrics
            items={[
              { label: 'Bazal metabolizma (BMR)', value: `${formatInteger(result.bmr)} kcal` },
              { label: 'Kilo verme (~0,5 kg/hafta)', value: `${formatInteger(result.weightLossCalories)} kcal` },
              { label: 'Kilo alma (~0,5 kg/hafta)', value: `${formatInteger(result.weightGainCalories)} kcal` },
            ]}
          />
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl hesaplanır?</h2>
        <p>Mifflin-St Jeor formülü ile bazal metabolizma hızı (BMR) bulunur, ardından aktivite seviyenize göre çarpılarak günlük kalori ihtiyacınız (TDEE) hesaplanır. Sonuçlar genel bir tahmindir; özel durumlar için diyetisyene danışın.</p>
      </div>
    </CalculatorLayout>
  );
}
