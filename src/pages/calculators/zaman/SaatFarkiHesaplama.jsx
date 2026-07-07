import React, { useMemo } from 'react';
import CalculatorLayout from '../../../components/CalculatorLayout.jsx';
import FormField from '../../../components/FormField.jsx';
import { ResultCard, ResultMetrics, ResultError } from '../../../components/Result.jsx';
import { calculateTimeDuration } from '../../../lib/zamanCalculators.js';
import { formatNumber, parseLocaleNumber } from '../../../utils/format.js';
import { useQueryParamState } from '../../../hooks/useQueryParamState.js';

export default function SaatFarkiHesaplama() {
  const [startTime, setStartTime] = useQueryParamState('baslangic', '09:00');
  const [endTime, setEndTime] = useQueryParamState('bitis', '18:00');
  const [breakMinutes, setBreakMinutes] = useQueryParamState('mola', '60');

  const { result, error } = useMemo(() => {
    const parsedBreak = parseLocaleNumber(breakMinutes);
    if (!startTime || !endTime) {
      return { result: null, error: 'Lütfen başlangıç ve bitiş saatini girin.' };
    }
    const computed = calculateTimeDuration({
      startTime,
      endTime,
      breakMinutes: Number.isFinite(parsedBreak) ? parsedBreak : 0,
    });
    if (!computed.valid) {
      return { result: null, error: 'Lütfen geçerli saat değerleri girin.' };
    }
    return { result: computed, error: null };
  }, [startTime, endTime, breakMinutes]);

  return (
    <CalculatorLayout calculatorId="saat-farki-hesaplama">
      <div className="calc-card">
        <h2>Saat bilgileri</h2>
        <div className="form-grid">
          <FormField label="Başlangıç saati" htmlFor="startTime">
            <input id="startTime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </FormField>
          <FormField label="Bitiş saati" htmlFor="endTime">
            <input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </FormField>
          <FormField label="Mola süresi (dk)" htmlFor="breakMinutes" full>
            <input id="breakMinutes" type="text" inputMode="numeric" value={breakMinutes} onChange={(e) => setBreakMinutes(e.target.value)} />
          </FormField>
        </div>
      </div>

      {error ? (
        <ResultError message={error} />
      ) : (
        <div key={JSON.stringify(result)} style={{ display: 'grid', gap: 14 }}>
          <ResultCard
            label="Toplam süre"
            value={`${result.hours} saat ${result.minutes} dk`}
            note={result.overnight ? 'Bitiş saati ertesi güne sarktı' : undefined}
          />
          <ResultMetrics
            items={[
              { label: 'Ondalık saat', value: formatNumber(result.decimalHours) },
              { label: 'Toplam dakika', value: formatNumber(result.totalMinutes, { decimals: 0 }) },
            ]}
          />
        </div>
      )}

      <div className="info-card">
        <h2>Nasıl kullanılır?</h2>
        <p>Bitiş saati başlangıçtan küçük ya da eşitse (ör. gece vardiyası), hesap otomatik olarak ertesi güne sarkacak şekilde yapılır. Mesai/vardiya süresi hesaplarken mola süresini girerek net çalışma süresini bulabilirsiniz.</p>
      </div>
    </CalculatorLayout>
  );
}
