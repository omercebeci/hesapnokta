import React, { useMemo, useState } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultError } from '../../../components/Result.jsx';
import { convertUnit, UNIT_CATEGORIES } from '../../../lib/matematikCalculators.js';
import { formatNumber, parseLocaleNumber } from '../../../utils/format.js';

const CATEGORY_DEFAULT_UNITS = {
  length: ['km', 'mile'],
  weight: ['kg', 'pound'],
  speed: ['kmh', 'mph'],
  temperature: ['c', 'f'],
};

export default function BirimCevirici() {
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState(CATEGORY_DEFAULT_UNITS.length[0]);
  const [toUnit, setToUnit] = useState(CATEGORY_DEFAULT_UNITS.length[1]);
  const [value, setValue] = useState('10');

  const unitOptions = Object.entries(UNIT_CATEGORIES[category].units);

  const handleCategoryChange = (nextCategory) => {
    setCategory(nextCategory);
    setFromUnit(CATEGORY_DEFAULT_UNITS[nextCategory][0]);
    setToUnit(CATEGORY_DEFAULT_UNITS[nextCategory][1]);
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const { result, error } = useMemo(() => {
    const parsedValue = parseLocaleNumber(value);
    if (!Number.isFinite(parsedValue)) {
      return { result: null, error: 'Lütfen geçerli bir sayı girin.' };
    }
    return { result: convertUnit({ category, fromUnit, toUnit, value: parsedValue }), error: null };
  }, [category, fromUnit, toUnit, value]);

  return (
    <CalculatorLayout calculatorId="birim-cevirici">
      <div className="calc-card">
        <h2>Çevirim bilgileri</h2>
        <div className="form-grid">
          <FormField label="Kategori" htmlFor="category" full>
            <select id="category" value={category} onChange={(e) => handleCategoryChange(e.target.value)}>
              {Object.entries(UNIT_CATEGORIES).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Değer" htmlFor="value" full>
            <input id="value" type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} />
          </FormField>
          <FormField label="Kaynak birim" htmlFor="fromUnit">
            <select id="fromUnit" value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
              {unitOptions.map(([key, unit]) => (
                <option key={key} value={key}>{unit.label}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Hedef birim" htmlFor="toUnit">
            <select id="toUnit" value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
              {unitOptions.map(([key, unit]) => (
                <option key={key} value={key}>{unit.label}</option>
              ))}
            </select>
          </FormField>
          <FormField label=" " htmlFor="swap" full>
            <button type="button" id="swap" className="header-home-link" style={{ justifySelf: 'start' }} onClick={swapUnits}>
              ⇅ Birimleri yer değiştir
            </button>
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <ResultCard key={result.result} label="Sonuç" value={formatNumber(result.result)} />
      )}

      <div className="info-card">
        <h2>Nasıl kullanılır?</h2>
        <p>Uzunluk, ağırlık ve hız birimleri doğrusal katsayı ile; sıcaklık ise Celsius/Fahrenheit/Kelvin arasında kendi formülüyle çevrilir.</p>
      </div>
    </CalculatorLayout>
  );
}
