import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultError } from '../../../components/Result.jsx';
import { calculateCatHumanAge, calculateDogHumanAge } from '../../../lib/gunlukYasamCalculators.js';
import { formatNumber, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

const DOG_SIZE_OPTIONS = [
  { id: 'kucuk', label: 'Küçük ırk (≤10 kg, ör. Chihuahua, Pomeranian)' },
  { id: 'orta', label: 'Orta ırk (10-25 kg, ör. Cocker Spaniel, Border Collie)' },
  { id: 'buyuk', label: 'Büyük ırk (25-45 kg, ör. Labrador, Golden Retriever)' },
  { id: 'dev', label: 'Dev ırk (45 kg üzeri, ör. Saint Bernard, Kangal)' },
];

export default function EvcilHayvanYasiHesaplama() {
  const [species, setSpecies] = useQueryParamState('tur', 'kopek');
  const [petYears, setPetYears] = useQueryParamState('yas', '3');
  const [sizeCategory, setSizeCategory] = useQueryParamState('boy', 'orta');

  const { humanAge, error } = useMemo(() => {
    const years = parseLocaleNumber(petYears);
    if (!Number.isFinite(years) || years < 0) {
      return { humanAge: null, error: 'Lütfen geçerli bir yaş girin.' };
    }
    const age = species === 'kedi' ? calculateCatHumanAge(years) : calculateDogHumanAge({ dogYears: years, sizeCategory });
    return { humanAge: age, error: null };
  }, [species, petYears, sizeCategory]);

  return (
    <CalculatorLayout calculatorId="evcil-hayvan-yasi-hesaplama">
      <div className="calc-card">
        <h2>Evcil hayvan bilgileri</h2>
        <div className="form-grid">
          <FormField label="Tür" htmlFor="species">
            <select id="species" value={species} onChange={(e) => setSpecies(e.target.value)}>
              <option value="kopek">Köpek</option>
              <option value="kedi">Kedi</option>
            </select>
          </FormField>
          <FormField label="Yaşı (yıl)" htmlFor="petYears">
            <input id="petYears" type="text" inputMode="decimal" value={petYears} onChange={(e) => setPetYears(e.target.value)} />
          </FormField>
          {species === 'kopek' && (
            <FormField label="Boyutu" htmlFor="sizeCategory" full>
              <select id="sizeCategory" value={sizeCategory} onChange={(e) => setSizeCategory(e.target.value)}>
                {DOG_SIZE_OPTIONS.map((opt) => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
              </select>
            </FormField>
          )}
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <ResultCard label="İnsan yaşı karşılığı" value={`${formatNumber(humanAge, { decimals: 0 })} yaş`} />
      )}

      <div className="info-card">
        <h2>Bu hesaplama neye dayanıyor?</h2>
        <p>
          "Her köpek/kedi yılı 7 insan yılıdır" kuralı artık güncel kabul edilmiyor; evcil hayvanlar ilk yıllarda çok
          hızlı, sonrasında daha yavaş yaşlanır. Bu araç, Amerikan Hayvan Hastaneleri Birliği (AAHA) ve International
          Cat Care tarafından kabul edilen "15-9-4" kuralını kediler için, köpeklerde ise aynı ilk-iki-yıl eğrisinin
          (1. yıl 15, 2. yıl toplam 24 insan yılı) ırkın boyutuna göre farklılaşan yıllık artış oranıyla devam
          ettirilen versiyonunu kullanır — büyük ve dev ırklar küçük ırklara göre daha hızlı yaşlanır. Sonuçlar
          eğlenceli bir yaklaşık tahmindir; hayvanınızın gerçek sağlık/yaşlanma durumu için veterinerinize danışın.
        </p>
      </div>
    </CalculatorLayout>
  );
}
