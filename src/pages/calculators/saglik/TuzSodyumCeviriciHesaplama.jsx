import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import RatioBar from '../../../components/RatioBar.jsx';
import DataPeriodNote from '../../../components/DataPeriodNote.jsx';
import HealthResultDisclaimer from '../../../components/HealthResultDisclaimer.jsx';
import { convertSaltSodium } from '../../../lib/saglikCalculators.js';
import { GUNCEL_VERILER } from '../../../data/guncelVeriler.js';
import { formatNumber, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

const SALT_DATA = GUNCEL_VERILER.tuzSodyumLimiti;
const MODE_OPTIONS = [
  { id: 'sodiumToSalt', label: 'Sodyum → Tuz', unit: 'mg sodyum' },
  { id: 'saltToSodium', label: 'Tuz → Sodyum', unit: 'g tuz' },
];

function ratioTone(percent) {
  if (percent > 100) return 'danger';
  if (percent >= 70) return 'warning';
  return 'success';
}

export default function TuzSodyumCeviriciHesaplama() {
  const [mode, setMode] = useQueryParamState('yon', 'sodiumToSalt');
  const [value, setValue] = useQueryParamState('deger', mode === 'saltToSodium' ? '3' : '400');

  const activeMode = MODE_OPTIONS.find((opt) => opt.id === mode) || MODE_OPTIONS[0];

  const { result, error } = useMemo(() => {
    const parsed = parseLocaleNumber(value);
    if (!Number.isFinite(parsed) || parsed < 0) {
      return { result: null, error: 'Lütfen 0 veya üzeri geçerli bir değer girin.' };
    }
    const computed = convertSaltSodium({ mode, value: parsed });
    if (!computed.valid) {
      return { result: null, error: 'Lütfen 0 veya üzeri geçerli bir değer girin.' };
    }
    return { result: computed, error: null };
  }, [mode, value]);

  return (
    <CalculatorLayout calculatorId="tuz-sodyum-cevirici">
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
          <FormField label={`Değer (${activeMode.unit})`} htmlFor="value">
            <input id="value" type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard
            label={mode === 'sodiumToSalt' ? 'Tuz karşılığı' : 'Sodyum karşılığı'}
            value={mode === 'sodiumToSalt' ? `${formatNumber(result.saltG, { decimals: 2 })} g tuz` : `${formatNumber(result.sodiumMg, { decimals: 0 })} mg sodyum`}
          />
          <ResultMetrics
            items={[
              { label: 'Toplam sodyum', value: `${formatNumber(result.sodiumMg, { decimals: 0 })} mg` },
              { label: 'Toplam tuz', value: `${formatNumber(result.saltG, { decimals: 2 })} g` },
            ]}
          />
          <div className="result-metric">
            <RatioBar label="DSÖ günlük tuz limitine oranı" value={result.percentOfDailyLimit} tone={ratioTone(result.percentOfDailyLimit)} />
          </div>
          {result.isOverDailyLimit && (
            <p className="rate-disclaimer">⚠️ Bu miktar tek başına DSÖ'nün önerdiği günlük tuz sınırını (5 g) aşıyor.</p>
          )}
          <DataPeriodNote period={SALT_DATA.period} lastUpdated={SALT_DATA.lastUpdated} source={SALT_DATA.source} />
          <HealthResultDisclaimer />
        </div>
      )}

      <div className="info-card">
        <h2>Etiketten okurken nasıl kullanılır?</h2>
        <p>Ambalajlı gıdaların besin değeri tablosunda genellikle "sodyum" (Na) miktarı mg cinsinden yazar, "tuz" olarak değil. Örneğin bir çorba paketinde "1 porsiyon: 920 mg sodyum" yazıyorsa, bu yaklaşık 2,3 g tuza denk gelir — günlük 5 g limitin neredeyse yarısı. Bazı ürünlerde ise doğrudan "tuz" (g) değeri verilir; bu durumda "Tuz → Sodyum" yönünü kullanarak sodyum karşılığını görebilirsiniz.</p>
      </div>
    </CalculatorLayout>
  );
}
