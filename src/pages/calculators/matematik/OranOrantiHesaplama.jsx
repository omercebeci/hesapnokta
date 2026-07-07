import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultError } from '../../../components/Result.jsx';
import { calculateRatio } from '../../../lib/matematikCalculators.js';
import { formatNumber, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

export default function OranOrantiHesaplama() {
  const [type, setType] = useQueryParamState('tur', 'direct');
  const [a, setA] = useQueryParamState('a', '4');
  const [b, setB] = useQueryParamState('b', '12');
  const [c, setC] = useQueryParamState('c', '6');

  const { result, error } = useMemo(() => {
    const parsedA = parseLocaleNumber(a);
    const parsedB = parseLocaleNumber(b);
    const parsedC = parseLocaleNumber(c);

    if (![parsedA, parsedB, parsedC].every((value) => Number.isFinite(value))) {
      return { result: null, error: 'Lütfen tüm alanlara geçerli sayılar girin.' };
    }
    if (type === 'direct' && parsedA === 0) {
      return { result: null, error: 'İlk değer (A) sıfır olamaz.' };
    }
    if (type === 'inverse' && parsedC === 0) {
      return { result: null, error: 'Üçüncü değer (C) sıfır olamaz.' };
    }

    return { result: calculateRatio({ type, a: parsedA, b: parsedB, c: parsedC }), error: null };
  }, [type, a, b, c]);

  return (
    <CalculatorLayout calculatorId="oran-oranti-hesaplama">
      <div className="calc-card">
        <h2>Orantı türü</h2>
        <div className="form-grid">
          <FormField label="Orantı türü" htmlFor="type" full>
            <div className="segmented" role="group" aria-label="Orantı türü">
              <button type="button" className={type === 'direct' ? 'active' : ''} onClick={() => setType('direct')}>Doğru orantı</button>
              <button type="button" className={type === 'inverse' ? 'active' : ''} onClick={() => setType('inverse')}>Ters orantı</button>
            </div>
          </FormField>
          <FormField label="A" htmlFor="a" hint={type === 'direct' ? 'A / B = C / X' : 'A × B = C × X'}>
            <input id="a" type="text" inputMode="decimal" value={a} onChange={(e) => setA(e.target.value)} />
          </FormField>
          <FormField label="B" htmlFor="b">
            <input id="b" type="text" inputMode="decimal" value={b} onChange={(e) => setB(e.target.value)} />
          </FormField>
          <FormField label="C" htmlFor="c" full>
            <input id="c" type="text" inputMode="decimal" value={c} onChange={(e) => setC(e.target.value)} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <ResultCard key={result.result} label="Bilinmeyen değer (X)" value={formatNumber(result.result)} />
      )}

      <div className="info-card">
        <h2>Nasıl çalışır?</h2>
        <ul>
          <li>Doğru orantı: A/B = C/X → X = (C × B) / A. Biri artınca diğeri de artar.</li>
          <li>Ters orantı: A × B = C × X → X = (A × B) / C. Biri artınca diğeri azalır.</li>
        </ul>
      </div>
    </CalculatorLayout>
  );
}
