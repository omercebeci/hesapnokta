import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultError } from '../../../components/Result.jsx';
import { calculateIdealWeight } from '../../../lib/saglikCalculators.js';
import { formatNumber, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

export default function IdealKiloHesaplama() {
  const [heightCm, setHeightCm] = useQueryParamState('boy', '170');
  const [gender, setGender] = useQueryParamState('cinsiyet', 'female');

  const { result, error } = useMemo(() => {
    const parsedHeight = parseLocaleNumber(heightCm);
    if (!Number.isFinite(parsedHeight) || parsedHeight <= 100 || parsedHeight > 250) {
      return { result: null, error: 'Lütfen 100-250 cm arasında geçerli bir boy girin.' };
    }
    return { result: calculateIdealWeight({ heightCm: parsedHeight, gender }), error: null };
  }, [heightCm, gender]);

  return (
    <CalculatorLayout calculatorId="ideal-kilo-hesaplama">
      <div className="calc-card">
        <h2>Bilgileriniz</h2>
        <div className="form-grid">
          <FormField label="Cinsiyet" htmlFor="gender" full>
            <div className="segmented" role="group" aria-label="Cinsiyet">
              <button type="button" className={gender === 'female' ? 'active' : ''} onClick={() => setGender('female')}>Kadın</button>
              <button type="button" className={gender === 'male' ? 'active' : ''} onClick={() => setGender('male')}>Erkek</button>
            </div>
          </FormField>
          <FormField label="Boy (cm)" htmlFor="heightCm" full>
            <input id="heightCm" type="text" inputMode="decimal" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <ResultCard key={result.idealWeight} label="İdeal kilo" value={`${formatNumber(result.idealWeight, { decimals: 1 })} kg`} />
      )}

      <div className="info-card">
        <h2>Nasıl hesaplanır?</h2>
        <p>Düzeltilmiş Broca formülü kullanılır: (Boy - 100) değerinden erkeklerde %10, kadınlarda %15 düşülür. Bu, kas kütlesi ve vücut yapısını ayırt etmeyen basit bir tahmindir; sağlık kararları için doktorunuza danışın.</p>
      </div>
    </CalculatorLayout>
  );
}
