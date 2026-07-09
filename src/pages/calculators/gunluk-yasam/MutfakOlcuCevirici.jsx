import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { convertKitchenMeasure } from '../../../lib/gunlukYasamCalculators.js';
import { formatNumber, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

const INGREDIENT_OPTIONS = [
  { id: 'un', label: 'Un' },
  { id: 'seker', label: 'Şeker' },
  { id: 'tuz', label: 'Tuz' },
  { id: 'pirinc', label: 'Pirinç' },
  { id: 'sivi', label: 'Sıvı (su, süt, yağ)' },
];

const UNIT_OPTIONS = [
  { id: 'bardak', label: 'Su bardağı' },
  { id: 'cayBardagi', label: 'Çay bardağı' },
  { id: 'yemekKasigi', label: 'Yemek kaşığı' },
  { id: 'tatliKasigi', label: 'Tatlı kaşığı' },
  { id: 'gram', label: 'Gram/ml' },
];
const UNIT_LABEL = Object.fromEntries(UNIT_OPTIONS.map((opt) => [opt.id, opt.label]));

export default function MutfakOlcuCevirici() {
  const [ingredientType, setIngredientType] = useQueryParamState('malzeme', 'un');
  const [amount, setAmount] = useQueryParamState('miktar', '1');
  const [fromUnit, setFromUnit] = useQueryParamState('kaynak', 'bardak');
  const [toUnit, setToUnit] = useQueryParamState('hedef', 'gram');

  const { result, error } = useMemo(() => {
    const parsedAmount = parseLocaleNumber(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return { result: null, error: 'Lütfen geçerli bir miktar girin.' };
    }
    return { result: convertKitchenMeasure({ ingredientType, amount: parsedAmount, fromUnit, toUnit }), error: null };
  }, [ingredientType, amount, fromUnit, toUnit]);

  return (
    <CalculatorLayout calculatorId="mutfak-olcu-cevirici">
      <div className="calc-card">
        <h2>Ölçü bilgileri</h2>
        <div className="form-grid">
          <FormField label="Malzeme tipi" htmlFor="ingredientType">
            <select id="ingredientType" value={ingredientType} onChange={(e) => setIngredientType(e.target.value)}>
              {INGREDIENT_OPTIONS.map((opt) => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
            </select>
          </FormField>
          <FormField label="Miktar" htmlFor="amount">
            <input id="amount" type="text" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </FormField>
          <FormField label="Hangi ölçüden" htmlFor="fromUnit">
            <select id="fromUnit" value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
              {UNIT_OPTIONS.map((opt) => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
            </select>
          </FormField>
          <FormField label="Hangi ölçüye" htmlFor="toUnit">
            <select id="toUnit" value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
              {UNIT_OPTIONS.map((opt) => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
            </select>
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard label={`${UNIT_LABEL[toUnit]} karşılığı`} value={`${formatNumber(result.convertedAmount)} ${toUnit === 'gram' ? 'gr/ml' : UNIT_LABEL[toUnit].toLowerCase()}`} />
          <ResultMetrics items={[{ label: 'Gram/ml karşılığı', value: `${formatNumber(result.grams)} gr/ml` }]} />
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl hesaplanır?</h2>
        <p>
          Türk mutfağında yaygın kullanılan su bardağı, çay bardağı, yemek kaşığı ve tatlı kaşığı ölçüleri
          malzemenin yoğunluğuna göre farklı gram karşılıkları verir — bu yüzden un, şeker, tuz, pirinç ve sıvılar
          için ayrı tablolar kullanılır. Sıvılarda (su, süt, sıvı yağ) yoğunluk yaklaşık 1 olduğundan ml ile gram
          birbirine eşit kabul edilir. Bu değerler yaygın kullanılan standart mutfak ölçü tablolarına dayanır; hassas
          tarifler (pasta, ekmek gibi) için bir mutfak tartısı kullanmanız daha kesin sonuç verir.
        </p>
      </div>
    </CalculatorLayout>
  );
}
