import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultError } from '../../../components/Result.jsx';
import { calculatePercentage } from '../../../lib/matematikCalculators.js';
import { formatNumber, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

const MODES = [
  { value: 'percentOf', label: 'X sayının %Y\'si' },
  { value: 'whatPercent', label: 'A, B\'nin yüzde kaçı' },
  { value: 'change', label: 'A → B yüzde değişim' },
];

export default function YuzdeHesaplama() {
  const [mode, setMode] = useQueryParamState('mod', 'percentOf');
  const [valueA, setValueA] = useQueryParamState('a', '250');
  const [valueB, setValueB] = useQueryParamState('b', '20');

  const { result, error } = useMemo(() => {
    const a = parseLocaleNumber(valueA);
    const b = parseLocaleNumber(valueB);

    if (!Number.isFinite(a) || !Number.isFinite(b)) {
      return { result: null, error: 'Lütfen her iki alana da geçerli bir sayı girin.' };
    }
    if (mode === 'whatPercent' && b === 0) {
      return { result: null, error: 'İkinci sayı (bütün) sıfır olamaz.' };
    }
    if (mode === 'change' && a === 0) {
      return { result: null, error: 'İlk değer (başlangıç) sıfır olamaz.' };
    }

    return { result: calculatePercentage({ mode, valueA: a, valueB: b }), error: null };
  }, [mode, valueA, valueB]);

  const labelA = mode === 'percentOf' ? 'Sayı (X)' : mode === 'whatPercent' ? 'Parça (A)' : 'Başlangıç değeri (A)';
  const labelB = mode === 'percentOf' ? 'Yüzde oranı (Y)' : mode === 'whatPercent' ? 'Bütün (B)' : 'Yeni değer (B)';

  return (
    <CalculatorLayout calculatorId="yuzde-hesaplama">
      <div className="calc-card">
        <h2>Hesaplama türü</h2>
        <div className="form-grid">
          <FormField label="Ne hesaplamak istersiniz?" htmlFor="mode" full>
            <div className="segmented" role="group" aria-label="Yüzde hesaplama türü">
              {MODES.map((option) => (
                <button key={option.value} type="button" className={mode === option.value ? 'active' : ''} onClick={() => setMode(option.value)}>
                  {option.label}
                </button>
              ))}
            </div>
          </FormField>
          <FormField label={labelA} htmlFor="valueA">
            <input id="valueA" type="text" inputMode="decimal" value={valueA} onChange={(e) => setValueA(e.target.value)} />
          </FormField>
          <FormField label={labelB} htmlFor="valueB">
            <input id="valueB" type="text" inputMode="decimal" value={valueB} onChange={(e) => setValueB(e.target.value)} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <ResultCard
          key={result.result}
          label="Sonuç"
          value={mode === 'percentOf' ? formatNumber(result.result) : `%${formatNumber(result.result)}`}
        />
      )}

      <div className="info-card">
        <h2>Örnekler</h2>
        <ul>
          <li>250 sayının %20'si: 50</li>
          <li>50, 250'nin yüzde kaçı: %20</li>
          <li>100'den 120'ye değişim: %20 artış</li>
        </ul>
      </div>
    </CalculatorLayout>
  );
}
