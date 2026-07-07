import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultError } from '../../../components/Result.jsx';
import { calculateBodyFatPercentage } from '../../../lib/saglikCalculators.js';
import { formatNumber, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

export default function VucutYagOraniHesaplama() {
  const [gender, setGender] = useQueryParamState('cinsiyet', 'female');
  const [heightCm, setHeightCm] = useQueryParamState('boy', '165');
  const [neckCm, setNeckCm] = useQueryParamState('boyun', '32');
  const [waistCm, setWaistCm] = useQueryParamState('bel', '70');
  const [hipCm, setHipCm] = useQueryParamState('kalca', '95');

  const { result, error } = useMemo(() => {
    const parsedHeight = parseLocaleNumber(heightCm);
    const parsedNeck = parseLocaleNumber(neckCm);
    const parsedWaist = parseLocaleNumber(waistCm);
    const parsedHip = parseLocaleNumber(hipCm);

    if (!Number.isFinite(parsedHeight) || parsedHeight <= 0) {
      return { result: null, error: 'Lütfen geçerli bir boy girin.' };
    }
    if (!Number.isFinite(parsedNeck) || parsedNeck <= 0) {
      return { result: null, error: 'Lütfen geçerli bir boyun çevresi girin.' };
    }
    if (!Number.isFinite(parsedWaist) || parsedWaist <= 0) {
      return { result: null, error: 'Lütfen geçerli bir bel çevresi girin.' };
    }
    if (gender === 'female' && (!Number.isFinite(parsedHip) || parsedHip <= 0)) {
      return { result: null, error: 'Kadınlar için kalça çevresi gereklidir.' };
    }

    const computed = calculateBodyFatPercentage({ gender, heightCm: parsedHeight, neckCm: parsedNeck, waistCm: parsedWaist, hipCm: parsedHip });
    if (!computed.valid) {
      return { result: null, error: 'Girilen ölçülerle hesaplama yapılamadı; bel çevresinin boyundan büyük olduğundan emin olun.' };
    }
    return { result: computed, error: null };
  }, [gender, heightCm, neckCm, waistCm, hipCm]);

  return (
    <CalculatorLayout calculatorId="vucut-yag-orani-hesaplama">
      <div className="calc-card">
        <h2>Vücut ölçüleri</h2>
        <div className="form-grid">
          <FormField label="Cinsiyet" htmlFor="gender" full>
            <div className="segmented" role="group" aria-label="Cinsiyet">
              <button type="button" className={gender === 'female' ? 'active' : ''} onClick={() => setGender('female')}>Kadın</button>
              <button type="button" className={gender === 'male' ? 'active' : ''} onClick={() => setGender('male')}>Erkek</button>
            </div>
          </FormField>
          <FormField label="Boy (cm)" htmlFor="heightCm">
            <input id="heightCm" type="text" inputMode="decimal" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} />
          </FormField>
          <FormField label="Boyun çevresi (cm)" htmlFor="neckCm">
            <input id="neckCm" type="text" inputMode="decimal" value={neckCm} onChange={(e) => setNeckCm(e.target.value)} />
          </FormField>
          <FormField label="Bel çevresi (cm)" htmlFor="waistCm">
            <input id="waistCm" type="text" inputMode="decimal" value={waistCm} onChange={(e) => setWaistCm(e.target.value)} />
          </FormField>
          {gender === 'female' && (
            <FormField label="Kalça çevresi (cm)" htmlFor="hipCm">
              <input id="hipCm" type="text" inputMode="decimal" value={hipCm} onChange={(e) => setHipCm(e.target.value)} />
            </FormField>
          )}
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <ResultCard
          key={result.bodyFatPercentage}
          label="Vücut yağ oranı"
          value={`%${formatNumber(result.bodyFatPercentage, { decimals: 1 })}`}
          note={result.category}
        />
      )}

      <div className="info-card">
        <h2>US Navy yöntemi nedir?</h2>
        <p>ABD Donanması'nın kullandığı bu yöntem, boyun ve bel (kadınlarda ayrıca kalça) çevresi ölçümlerinden logaritmik bir formülle vücut yağ oranını tahmin eder. Mezura ile ölçüm hatası sonucu etkileyebilir; kesin ölçüm için DEXA/biyoelektrik empedans gibi yöntemler daha güvenilirdir.</p>
      </div>
    </CalculatorLayout>
  );
}
