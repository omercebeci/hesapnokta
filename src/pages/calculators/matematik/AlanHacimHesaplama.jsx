import React, { useMemo, useState } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultError } from '../../../components/Result.jsx';
import { calculateAreaVolume } from '../../../lib/matematikCalculators.js';
import { formatNumber, parseLocaleNumber } from '../../../utils/format.js';

const SHAPES = {
  area: {
    rectangle: { label: 'Dikdörtgen', fields: [{ key: 'width', label: 'Kenar (a)' }, { key: 'height', label: 'Kenar (b)' }] },
    square: { label: 'Kare', fields: [{ key: 'side', label: 'Kenar (a)' }] },
    circle: { label: 'Daire', fields: [{ key: 'radius', label: 'Yarıçap (r)' }] },
    triangle: { label: 'Üçgen', fields: [{ key: 'base', label: 'Taban' }, { key: 'height', label: 'Yükseklik' }] },
  },
  volume: {
    cube: { label: 'Küp', fields: [{ key: 'side', label: 'Kenar (a)' }] },
    cuboid: { label: 'Dikdörtgenler prizması', fields: [{ key: 'width', label: 'En' }, { key: 'height', label: 'Boy' }, { key: 'depth', label: 'Yükseklik' }] },
    cylinder: { label: 'Silindir', fields: [{ key: 'radius', label: 'Yarıçap (r)' }, { key: 'height', label: 'Yükseklik' }] },
    sphere: { label: 'Küre', fields: [{ key: 'radius', label: 'Yarıçap (r)' }] },
    cone: { label: 'Koni', fields: [{ key: 'radius', label: 'Taban yarıçapı (r)' }, { key: 'height', label: 'Yükseklik' }] },
  },
};

export default function AlanHacimHesaplama() {
  const [mode, setMode] = useState('area');
  const [shape, setShape] = useState('rectangle');
  const [dims, setDims] = useState({ width: '5', height: '3', side: '4', radius: '3', base: '6', depth: '2' });

  const shapeConfig = SHAPES[mode][shape] || Object.values(SHAPES[mode])[0];

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    setShape(Object.keys(SHAPES[nextMode])[0]);
  };

  const { result, error } = useMemo(() => {
    const parsedDims = {};
    for (const field of shapeConfig.fields) {
      const value = parseLocaleNumber(dims[field.key]);
      if (!Number.isFinite(value) || value <= 0) {
        return { result: null, error: `Lütfen "${field.label}" için geçerli, pozitif bir değer girin.` };
      }
      parsedDims[field.key] = value;
    }
    return { result: calculateAreaVolume({ mode, shape, dims: parsedDims }), error: null };
  }, [mode, shape, dims, shapeConfig]);

  return (
    <CalculatorLayout calculatorId="alan-hacim-hesaplama">
      <div className="calc-card">
        <h2>Şekil seçimi</h2>
        <div className="form-grid">
          <FormField label="Hesaplama türü" htmlFor="mode" full>
            <div className="segmented" role="group" aria-label="Alan veya hacim">
              <button type="button" className={mode === 'area' ? 'active' : ''} onClick={() => handleModeChange('area')}>Alan</button>
              <button type="button" className={mode === 'volume' ? 'active' : ''} onClick={() => handleModeChange('volume')}>Hacim</button>
            </div>
          </FormField>
          <FormField label="Şekil" htmlFor="shape" full>
            <select id="shape" value={shape} onChange={(e) => setShape(e.target.value)}>
              {Object.entries(SHAPES[mode]).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
          </FormField>
          {shapeConfig.fields.map((field) => (
            <FormField label={field.label} htmlFor={field.key} key={field.key}>
              <input
                id={field.key}
                type="text"
                inputMode="decimal"
                value={dims[field.key] ?? ''}
                onChange={(e) => setDims((current) => ({ ...current, [field.key]: e.target.value }))}
              />
            </FormField>
          ))}
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <ResultCard
          key={result.result}
          label={mode === 'area' ? 'Alan' : 'Hacim'}
          value={`${formatNumber(result.result)} birim${mode === 'area' ? '²' : '³'}`}
          note="Tüm ölçüleri aynı birimde girin (ör. hepsi cm ya da hepsi m)."
        />
      )}

      <div className="info-card">
        <h2>Formüller</h2>
        <ul>
          <li>Dikdörtgen alanı: a × b — Kare alanı: a²</li>
          <li>Daire alanı: π × r² — Üçgen alanı: (taban × yükseklik) / 2</li>
          <li>Küp hacmi: a³ — Prizma hacmi: en × boy × yükseklik</li>
          <li>Silindir hacmi: π × r² × h — Küre hacmi: (4/3) × π × r³ — Koni hacmi: (1/3) × π × r² × h</li>
        </ul>
      </div>
    </CalculatorLayout>
  );
}
