import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import DataPeriodNote from '../../../components/DataPeriodNote.jsx';
import HealthResultDisclaimer from '../../../components/HealthResultDisclaimer.jsx';
import { convertHbA1cGlucose } from '../../../lib/saglikCalculators.js';
import { GUNCEL_VERILER } from '../../../data/guncelVeriler.js';
import { formatNumber, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

const FORMULA_DATA = GUNCEL_VERILER.hba1cOrtalamaGlukozFormulu;
const THRESHOLDS_DATA = GUNCEL_VERILER.diyabetTaniEsikleri;
const MODE_OPTIONS = [
  { id: 'a1cToGlucose', label: 'HbA1c → Ortalama şeker' },
  { id: 'glucoseToA1c', label: 'Ortalama şeker → HbA1c' },
];
const UNIT_OPTIONS = [
  { id: 'mgdl', label: 'mg/dL' },
  { id: 'mmoll', label: 'mmol/L' },
];

export default function Hba1cOrtalamaSekerHesaplama() {
  const [mode, setMode] = useQueryParamState('yon', 'a1cToGlucose');
  const [value, setValue] = useQueryParamState('deger', mode === 'glucoseToA1c' ? '154' : '7');
  const [glukozBirim, setGlukozBirim] = useQueryParamState('birim', 'mgdl');

  const { result, error } = useMemo(() => {
    const parsed = parseLocaleNumber(value);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return { result: null, error: mode === 'a1cToGlucose' ? 'Lütfen geçerli bir HbA1c yüzdesi girin.' : 'Lütfen geçerli bir ortalama şeker değeri girin.' };
    }
    const computed = convertHbA1cGlucose({ mode, value: parsed, glukozBirim });
    if (!computed.valid) {
      return { result: null, error: 'Lütfen geçerli bir değer girin.' };
    }
    return { result: computed, error: null };
  }, [mode, value, glukozBirim]);

  return (
    <CalculatorLayout calculatorId="hba1c-ortalama-seker">
      <div className="calc-card">
        <h2>Dönüştürmek istediğiniz değer</h2>
        <div className="form-grid">
          <FormField label="Yön" htmlFor="mode" full>
            <div className="segmented" role="group" aria-label="Dönüşüm yönü">
              {MODE_OPTIONS.map((opt) => (
                <button key={opt.id} type="button" className={mode === opt.id ? 'active' : ''} onClick={() => setMode(opt.id)}>{opt.label}</button>
              ))}
            </div>
          </FormField>
          <FormField label={mode === 'a1cToGlucose' ? 'HbA1c (%)' : 'Ortalama şeker'} htmlFor="value">
            <input id="value" type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} />
          </FormField>
          {mode === 'glucoseToA1c' && (
            <FormField label="Birim" htmlFor="birim" full>
              <div className="segmented" role="group" aria-label="Glukoz birimi">
                {UNIT_OPTIONS.map((opt) => (
                  <button key={opt.id} type="button" className={glukozBirim === opt.id ? 'active' : ''} onClick={() => setGlukozBirim(opt.id)}>{opt.label}</button>
                ))}
              </div>
            </FormField>
          )}
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard
            label={mode === 'a1cToGlucose' ? 'Tahmini ortalama şeker (eAG)' : 'Tahmini HbA1c'}
            value={mode === 'a1cToGlucose' ? `${formatNumber(result.eAGmgdl, { decimals: 0 })} mg/dL` : `%${formatNumber(result.a1cPercent, { decimals: 1 })}`}
            tone={result.category.tone}
            note={result.category.label}
          />
          <ResultMetrics
            items={[
              { label: 'HbA1c', value: `%${formatNumber(result.a1cPercent, { decimals: 1 })}` },
              { label: 'Ortalama şeker (mg/dL)', value: `${formatNumber(result.eAGmgdl, { decimals: 0 })} mg/dL` },
              { label: 'Ortalama şeker (mmol/L)', value: `${formatNumber(result.eAGmmol, { decimals: 1 })} mmol/L` },
            ]}
          />
          <p className="rate-disclaimer">ℹ️ "{result.category.label}" ifadesi ADA aralıklarına göre konumu gösterir; kesin tanı yalnızca hekim ve laboratuvar sonucuyla konur.</p>
          <DataPeriodNote period={FORMULA_DATA.period} lastUpdated={FORMULA_DATA.lastUpdated} source={FORMULA_DATA.source} />
          <DataPeriodNote period={THRESHOLDS_DATA.period} lastUpdated={THRESHOLDS_DATA.lastUpdated} source={THRESHOLDS_DATA.source} />
          <HealthResultDisclaimer />
        </div>
      )}

      <div className="info-card">
        <h2>HbA1c ile ortalama şeker arasındaki fark nedir?</h2>
        <p>HbA1c, kırmızı kan hücrelerindeki hemoglobine bağlanan şeker oranını ölçer ve son 2-3 aylık ortalama kan şekerinizi yansıtır. Ortalama şeker (eAG) ise bu yüzdeyi, günlük ölçümlerde alıştığınız mg/dL veya mmol/L birimine çevirir. Dönüşüm, ADA-onaylı ADAG çalışmasındaki eAG = 28,7 × HbA1c − 46,7 formülüne dayanır.</p>
      </div>
    </CalculatorLayout>
  );
}
