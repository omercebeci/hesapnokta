import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateCountdown } from '../../../lib/zamanCalculators.js';
import { formatInteger } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

const today = new Date().toISOString().slice(0, 10);
const defaultTarget = new Date();
defaultTarget.setMonth(defaultTarget.getMonth() + 1);

export default function GunSayaciHesaplama() {
  const [targetDate, setTargetDate] = useQueryParamState('hedef', defaultTarget.toISOString().slice(0, 10));
  const [referenceDate, setReferenceDate] = useQueryParamState('referans', today);

  const { result, error } = useMemo(() => {
    if (!targetDate) {
      return { result: null, error: 'Lütfen hedef bir tarih seçin.' };
    }
    const computed = calculateCountdown({ targetDate, referenceDate });
    if (!computed.valid) {
      return { result: null, error: 'Lütfen geçerli bir tarih girin.' };
    }
    return { result: computed, error: null };
  }, [targetDate, referenceDate]);

  const primaryLabel = result?.isToday ? 'Bugün!' : result?.isPast ? 'Geçen süre' : 'Kalan süre';
  const primaryValue = result
    ? result.isToday
      ? 'Hedef tarih bugün'
      : `${formatInteger(Math.abs(result.totalDays))} gün`
    : '—';

  return (
    <CalculatorLayout calculatorId="gun-sayaci-hesaplama">
      <div className="calc-card">
        <h2>Tarih bilgileri</h2>
        <div className="form-grid">
          <FormField label="Hedef tarih" htmlFor="targetDate">
            <input id="targetDate" type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
          </FormField>
          <FormField label="Hangi tarihe göre?" htmlFor="referenceDate" hint="Varsayılan: bugün">
            <input id="referenceDate" type="date" value={referenceDate} onChange={(e) => setReferenceDate(e.target.value)} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard
            label={primaryLabel}
            value={primaryValue}
            note={result.isPast ? 'Hedef tarih geride kaldı' : result.isToday ? undefined : 'hedef tarihe kadar'}
          />
          <ResultMetrics
            items={[
              { label: 'Hafta', value: formatInteger(result.weeks) },
              { label: 'Kalan gün (hafta dışı)', value: formatInteger(result.remainderDays) },
            ]}
          />
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl kullanılır?</h2>
        <p>Doğum günü, yıl dönümü, sınav ya da tatil gibi hedef bir tarihe kaç gün kaldığını (veya geride kaldıysa kaç gün geçtiğini) hesaplar.</p>
      </div>
    </CalculatorLayout>
  );
}
