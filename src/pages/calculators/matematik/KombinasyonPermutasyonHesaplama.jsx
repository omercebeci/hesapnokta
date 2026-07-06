import React, { useMemo, useState } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultError } from '../../../components/Result.jsx';
import { calculateCombinationPermutation } from '../../../lib/matematikCalculators.js';
import { formatNumber, parseLocaleNumber } from '../../../utils/format.js';

export default function KombinasyonPermutasyonHesaplama() {
  const [mode, setMode] = useState('combination');
  const [n, setN] = useState('10');
  const [r, setR] = useState('3');

  const { result, error } = useMemo(() => {
    const parsedN = parseLocaleNumber(n);
    const parsedR = parseLocaleNumber(r);

    if (!Number.isFinite(parsedN) || parsedN < 0 || parsedN > 170) {
      return { result: null, error: 'n, 0-170 arasında olmalıdır.' };
    }
    if (!Number.isFinite(parsedR) || parsedR < 0) {
      return { result: null, error: 'Lütfen geçerli bir r değeri girin.' };
    }
    if (parsedR > parsedN) {
      return { result: null, error: 'r, n değerinden büyük olamaz.' };
    }

    return { result: calculateCombinationPermutation({ n: parsedN, r: parsedR, mode }), error: null };
  }, [mode, n, r]);

  return (
    <CalculatorLayout calculatorId="kombinasyon-permutasyon-hesaplama">
      <div className="calc-card">
        <h2>Değerler</h2>
        <div className="form-grid">
          <FormField label="Hesaplama türü" htmlFor="mode" full>
            <div className="segmented" role="group" aria-label="Hesaplama türü">
              <button type="button" className={mode === 'combination' ? 'active' : ''} onClick={() => setMode('combination')}>Kombinasyon (nCr)</button>
              <button type="button" className={mode === 'permutation' ? 'active' : ''} onClick={() => setMode('permutation')}>Permütasyon (nPr)</button>
            </div>
          </FormField>
          <FormField label="Toplam eleman sayısı (n)" htmlFor="n">
            <input id="n" type="text" inputMode="numeric" value={n} onChange={(e) => setN(e.target.value)} />
          </FormField>
          <FormField label="Seçilecek eleman sayısı (r)" htmlFor="r">
            <input id="r" type="text" inputMode="numeric" value={r} onChange={(e) => setR(e.target.value)} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <ResultCard key={result.result} label="Sonuç" value={formatNumber(result.result, { decimals: 0 })} />
      )}

      <div className="info-card">
        <h2>Fark nedir?</h2>
        <ul>
          <li>Kombinasyon (nCr): sıralamanın önemli olmadığı seçimlerde kullanılır. Formül: n! / (r! × (n-r)!)</li>
          <li>Permütasyon (nPr): sıralamanın önemli olduğu dizilişlerde kullanılır. Formül: n! / (n-r)!</li>
        </ul>
      </div>
    </CalculatorLayout>
  );
}
